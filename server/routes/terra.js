import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'
import { generateWidgetSession, deauthenticateUser } from '../lib/terraClient.js'

const router = Router()
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const APP_URL = process.env.APP_URL || 'http://localhost:5173'

async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' })
  req.user = user
  next()
}

// GET /api/terra/status
router.get('/status', requireAuth, async (req, res) => {
  const { data } = await supabase
    .from('terra_connections')
    .select('provider, connected_at')
    .eq('user_id', req.user.id)
  res.json({ connected: (data || []).length > 0, connections: data || [] })
})

// GET /api/terra/widget-url
router.get('/widget-url', requireAuth, async (req, res) => {
  try {
    const redirectUrl = `${APP_URL}/dashboard?terra=connected`
    const result = await generateWidgetSession(req.user.id, redirectUrl)
    if (!result.url) throw new Error(result.message || 'Terra widget session failed')
    res.json({ url: result.url })
  } catch (err) {
    console.error('[Terra] widget-url error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/terra/disconnect  body: { provider? }
router.delete('/disconnect', requireAuth, async (req, res) => {
  const { provider } = req.body || {}

  let query = supabase
    .from('terra_connections')
    .select('terra_user_id, provider')
    .eq('user_id', req.user.id)
  if (provider) query = query.eq('provider', provider)

  const { data: connections } = await query

  for (const conn of connections || []) {
    await deauthenticateUser(conn.terra_user_id)
  }

  let del = supabase.from('terra_connections').delete().eq('user_id', req.user.id)
  if (provider) del = del.eq('provider', provider)
  await del

  res.json({ ok: true })
})

// POST /api/terra/webhooks — Terra pushes daily summaries + auth events here
router.post('/webhooks', async (req, res) => {
  // Terra sends dev-id header for verification
  const devId = req.headers['dev-id']
  if (process.env.TERRA_DEV_ID && devId !== process.env.TERRA_DEV_ID) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const body = req.body
  const type = body?.type
  const user = body?.user
  const userId = user?.reference_id

  if (!userId) return res.json({ ok: true })

  try {
    if (type === 'auth' && user.status !== 'error') {
      await supabase.from('terra_connections').upsert({
        user_id: userId,
        terra_user_id: user.user_id,
        provider: user.provider,
        connected_at: new Date().toISOString(),
      }, { onConflict: 'user_id,provider' })
    }

    if (type === 'daily' && body.data?.length) {
      const d = body.data[0]
      const date = d.metadata?.start_time?.slice(0, 10) || new Date().toISOString().slice(0, 10)

      await supabase.from('terra_daily_activity').upsert({
        user_id: userId,
        date,
        steps: d.distance_data?.steps || 0,
        total_burned_calories: Math.round(d.calories_data?.total_burned_calories || 0),
        bmr_calories: Math.round(d.calories_data?.BMR_calories || 0),
        activity_calories: Math.round(d.calories_data?.activity_calories || 0),
        active_seconds: d.active_durations_data?.activity_seconds || 0,
        avg_hr: d.heart_rate_data?.summary?.avg_hr_bpm || null,
        sleep_seconds: d.sleep_durations_data?.asleep?.duration_asleep_state_seconds || 0,
        provider: user.provider,
        raw_data: d,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,date,provider' })
    }
  } catch (err) {
    console.error('[Terra] webhook error:', err.message)
  }

  res.json({ ok: true })
})

export default router
