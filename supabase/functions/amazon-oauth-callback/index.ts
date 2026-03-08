import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const AMAZON_CLIENT_ID = Deno.env.get("AMAZON_CLIENT_ID")!
const AMAZON_CLIENT_SECRET = Deno.env.get("AMAZON_CLIENT_SECRET")!
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const FRONTEND_URL = Deno.env.get("FRONTEND_URL") || "http://localhost:3000" // Fallback to localhost natively for dev

Deno.serve(async (req: Request) => {
  const url = new URL(req.url)

  // The query parameters Amazon returns when redirecting the seller back to our app
  const spapi_oauth_code = url.searchParams.get('spapi_oauth_code')
  const selling_partner_id = url.searchParams.get('selling_partner_id')
  const state = url.searchParams.get('state') // We will pass user_id in the state

  // Basic validation
  if (!spapi_oauth_code || !selling_partner_id || !state) {
    return new Response(
      JSON.stringify({ error: 'Missing required OAuth parameters.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Determine redirect URL
  const dashboardUrl = `${FRONTEND_URL}/en/dashboards/rankings`

  try {
    // 1. Exchange the authorization code for a refresh token via Amazon LWA
    const tokenRes = await fetch("https://api.amazon.com/auth/o2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: spapi_oauth_code,
        client_id: AMAZON_CLIENT_ID,
        client_secret: AMAZON_CLIENT_SECRET,
      }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenData.refresh_token) {
      console.error("LWA Error:", tokenData)
      // Redirect to frontend with error
      return Response.redirect(`${dashboardUrl}?amazon_error=${encodeURIComponent(tokenData.error_description || 'Failed to get refresh token')}`, 302)
    }

    const { refresh_token } = tokenData

    // 2. Insert into our Supabase Database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Check if the user ID (from state) exists to be safe
    const userId = state

    // Constants for North America (US)
    const MARKETPLACE_US = "ATVPDKIKX0DER"
    const REGION_NA = "NA"

    // Upsert the amazon_account
    // We use upsert on user_id + seller_id so we don't create multiple identical links
    const { data: accountData, error: accountError } = await supabase
      .from('amazon_accounts')
      .upsert({
        user_id: userId,
        seller_id: selling_partner_id,
        marketplace_id: MARKETPLACE_US,
        region: REGION_NA
      }, { onConflict: 'user_id,seller_id' })
      .select()
      .single()

    if (accountError) {
      throw new Error(`Failed to upsert amazon_account: ${accountError.message}`)
    }

    // Attempt to select the account if upsert didn't return it (sometimes happens if no update occurred depending on RLS/schema config)
    // Actually we bypassed RLS via service role, but just in case:
    let accountId = accountData?.id
    if (!accountId) {
       const { data: existingAccount } = await supabase
        .from('amazon_accounts')
        .select('id')
        .eq('user_id', userId)
        .eq('seller_id', selling_partner_id)
        .single()
       accountId = existingAccount?.id
    }

    if (!accountId) {
       throw new Error('Could not find or create amazon_account record.')
    }

    // Upsert the amazon_tokens table
    const { error: tokenError } = await supabase
      .from('amazon_tokens')
      .upsert({
        amazon_account_id: accountId,
        refresh_token: refresh_token,
        updated_at: new Date().toISOString()
      }, { onConflict: 'amazon_account_id' })

    if (tokenError) {
      throw new Error(`Failed to save amazon_token: ${tokenError.message}`)
    }

    // 3. Success! Redirect user to frontend Dashboard
    return Response.redirect(`${dashboardUrl}?amazon_connected=true`, 302)

  } catch (err) {
    console.error("Detailed Error in Amazon OAuth:", err)
    return Response.redirect(`${dashboardUrl}?amazon_error=${encodeURIComponent((err as Error).message)}`, 302)
  }
})
