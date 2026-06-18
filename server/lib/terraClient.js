const TERRA_BASE = 'https://api.tryterra.co/v2'

function headers() {
  return {
    'x-api-key': process.env.TERRA_API_KEY,
    'dev-id': process.env.TERRA_DEV_ID,
    'Content-Type': 'application/json',
  }
}

export async function generateWidgetSession(referenceId, redirectUrl) {
  const res = await fetch(`${TERRA_BASE}/auth/generateWidgetSession`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      reference_id: referenceId,
      providers: 'APPLE,GARMIN,FITBIT,GOOGLE,POLAR,SUUNTO,WHOOP,SAMSUNG',
      language: 'en',
      auth_success_redirect_url: redirectUrl,
    }),
  })
  return res.json()
}

export async function deauthenticateUser(terraUserId) {
  const res = await fetch(
    `${TERRA_BASE}/auth/deauthenticate?user_id=${encodeURIComponent(terraUserId)}`,
    { method: 'DELETE', headers: headers() }
  )
  return res.ok
}

export async function fetchDailyData(terraUserId, date) {
  const res = await fetch(
    `${TERRA_BASE}/daily?user_id=${encodeURIComponent(terraUserId)}&start_date=${date}&end_date=${date}&to_webhook=false`,
    { headers: headers() }
  )
  return res.json()
}
