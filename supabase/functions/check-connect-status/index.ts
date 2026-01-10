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

    // Get user's connected account
    const { data: account, error: accountError } = await supabaseClient
      .from("connected_accounts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!account) {
      return new Response(
        JSON.stringify({ 
          hasAccount: false,
          onboardingComplete: false,
          chargesEnabled: false,
          payoutsEnabled: false,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-08-27.basil",
    });

    // Get latest account status from Stripe
    const stripeAccount = await stripe.accounts.retrieve(account.stripe_account_id);

    const chargesEnabled = stripeAccount.charges_enabled || false;
    const payoutsEnabled = stripeAccount.payouts_enabled || false;
    const onboardingComplete = stripeAccount.details_submitted || false;

    // Update local record if status changed
    if (
      account.charges_enabled !== chargesEnabled ||
      account.payouts_enabled !== payoutsEnabled ||
      account.onboarding_complete !== onboardingComplete
    ) {
      await supabaseClient
        .from("connected_accounts")
        .update({
          charges_enabled: chargesEnabled,
          payouts_enabled: payoutsEnabled,
          onboarding_complete: onboardingComplete,
        })
        .eq("id", account.id);
    }

    console.log(`Connect account status for ${user.id}: charges=${chargesEnabled}, payouts=${payoutsEnabled}`);

    return new Response(
      JSON.stringify({
        hasAccount: true,
        accountId: account.stripe_account_id,
        onboardingComplete,
        chargesEnabled,
        payoutsEnabled,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Error checking Connect status:", error);
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
