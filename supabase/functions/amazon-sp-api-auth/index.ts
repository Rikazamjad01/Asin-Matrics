const CLIENT_ID = Deno.env.get('AMAZON_CLIENT_ID')
const CLIENT_SECRET = Deno.env.get('AMAZON_CLIENT_SECRET')

Deno.serve(async (req) => {
  const { refresh_token } = await req.json()

  // 1. Call Amazon LWA to refresh the token
  const response = await fetch('https://api.amazon.com/auth/o2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
    }),
  })

  const data = await response.json()

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
})
