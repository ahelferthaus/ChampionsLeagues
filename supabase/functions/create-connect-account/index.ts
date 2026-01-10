import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validation constants
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_URL_LENGTH = 500;
const ALLOWED_URL_PATTERNS = [/^https?:\/\//]; // Must be HTTP(S) URLs

interface ConnectAccountRequest {
  clubId?: string;
  teamId?: string;
  refreshUrl?: string;
  returnUrl?: string;
}

function validateUrl(url: string | undefined, fieldName: string): string | undefined {
  if (url === undefined || url === null || url === '') {
    return undefined;
  }
  if (typeof url !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  if (url.length > MAX_URL_LENGTH) {
    throw new Error(`${fieldName} must be ${MAX_URL_LENGTH} characters or less`);
  }
  if (!ALLOWED_URL_PATTERNS.some(pattern => pattern.test(url))) {
    throw new Error(`${fieldName} must be a valid HTTP(S) URL`);
  }
  return url;
}

function validateRequest(body: unknown): ConnectAccountRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid request body');
  }

  const { clubId, teamId, refreshUrl, returnUrl } = body as Record<string, unknown>;

  // Validate optional UUIDs
  if (clubId !== undefined && clubId !== null && clubId !== '') {
    if (typeof clubId !== 'string' || !UUID_REGEX.test(clubId)) {
      throw new Error('Club ID must be a valid UUID');
    }
  }

  if (teamId !== undefined && teamId !== null && teamId !== '') {
    if (typeof teamId !== 'string' || !UUID_REGEX.test(teamId)) {
      throw new Error('Team ID must be a valid UUID');
    }
  }

  return {
    clubId: typeof clubId === 'string' && UUID_REGEX.test(clubId) ? clubId : undefined,
    teamId: typeof teamId === 'string' && UUID_REGEX.test(teamId) ? teamId : undefined,
    refreshUrl: validateUrl(refreshUrl as string | undefined, 'Refresh URL'),
    returnUrl: validateUrl(returnUrl as string | undefined, 'Return URL'),
  };
}

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
    
    // Parse and validate input
    const rawBody = await req.json();
    const { clubId, teamId, refreshUrl, returnUrl } = validateRequest(rawBody);
    const origin = req.headers.get("origin") || "https://lovable.dev";

    console.log(`Creating Connect account for user ${user.id}`);

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-08-27.basil",
    });

    // Check if user already has a connected account
    const { data: existingAccount } = await supabaseClient
      .from("connected_accounts")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    let accountId: string;

    if (existingAccount?.stripe_account_id) {
      accountId = existingAccount.stripe_account_id;
      console.log(`Found existing account: ${accountId}`);
    } else {
      // Create new Express account
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
          us_bank_account_ach_payments: { requested: true }, // ACH support
        },
        business_type: "individual",
        metadata: {
          user_id: user.id,
          club_id: clubId || "",
          team_id: teamId || "",
        },
      });

      accountId = account.id;
      console.log(`Created new Connect account: ${accountId}`);

      // Save to database
      const { error: insertError } = await supabaseClient
        .from("connected_accounts")
        .insert({
          user_id: user.id,
          club_id: clubId || null,
          team_id: teamId || null,
          stripe_account_id: accountId,
          account_type: "express",
        });

      if (insertError) {
        console.error("Error saving connected account:", insertError);
      }
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl || `${origin}/expenses?refresh=true`,
      return_url: returnUrl || `${origin}/expenses?setup=complete`,
      type: "account_onboarding",
    });

    console.log(`Created account link for onboarding`);

    return new Response(
      JSON.stringify({ url: accountLink.url, accountId }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Error creating Connect account:", error);
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
