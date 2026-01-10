import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      throw new Error("Payment service not configured");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Not authenticated");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error("Not authenticated");
    }

    const user = userData.user;
    const { expenseShareId, paymentMethod } = await req.json();
    const origin = req.headers.get("origin") || "https://lovable.dev";

    console.log(`Creating payment for expense share ${expenseShareId}, method: ${paymentMethod}`);

    // Get the expense share details
    const { data: share, error: shareError } = await supabaseClient
      .from("expense_shares")
      .select(`
        *,
        expense:expenses(
          *,
          team:teams(club_id)
        )
      `)
      .eq("id", expenseShareId)
      .single();

    if (shareError || !share) {
      throw new Error("Expense share not found");
    }

    // Verify user owns this share
    if (share.user_id !== user.id) {
      throw new Error("Not authorized to pay this expense");
    }

    // Get the connected account for the expense creator
    const { data: connectedAccount } = await supabaseClient
      .from("connected_accounts")
      .select("*")
      .eq("user_id", share.expense.created_by)
      .eq("charges_enabled", true)
      .maybeSingle();

    if (!connectedAccount) {
      throw new Error("The team manager has not set up their payment account yet");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-08-27.basil",
    });

    const amountInCents = Math.round(Number(share.amount) * 100);

    // Create checkout session based on payment method
    const paymentMethodTypes: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] = 
      paymentMethod === "ach" 
        ? ["us_bank_account"] 
        : ["card"];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethodTypes,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: share.expense.title,
              description: share.expense.description || `Team expense - ${share.expense.category}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/expenses?payment=success&share=${expenseShareId}`,
      cancel_url: `${origin}/expenses?payment=canceled`,
      // Transfer to connected account (no platform fee)
      payment_intent_data: {
        transfer_data: {
          destination: connectedAccount.stripe_account_id,
        },
      },
      metadata: {
        expense_share_id: expenseShareId,
        expense_id: share.expense_id,
        user_id: user.id,
        payment_method: paymentMethod,
      },
      // For ACH, allow delayed notification
      ...(paymentMethod === "ach" && {
        payment_method_options: {
          us_bank_account: {
            financial_connections: {
              permissions: ["payment_method"],
            },
          },
        },
      }),
    });

    console.log(`Created checkout session: ${session.id}`);

    // Update the expense share with payment intent info
    await supabaseClient
      .from("expense_shares")
      .update({
        stripe_payment_intent_id: session.payment_intent as string,
        payment_method: paymentMethod,
      })
      .eq("id", expenseShareId);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Error creating expense payment:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
