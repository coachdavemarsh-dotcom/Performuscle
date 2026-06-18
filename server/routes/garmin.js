// Garmin Connect integration routes
// OAuth 1.0a flow + Training API (push workouts) + Activity API (receive completions)

import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'
import {
  getRequestToken, buildAuthorizeUrl, getAccessToken,
  pushWorkout, scheduleWorkout, getGarminUser, sessionToGarminWorkout,
} from '../lib/garminClient.js'

const router = Router()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

// Temporary in-memory store for request tokens (keyed by token, value = userId)
// Fine for single-instance Railway deployments; swap for Redis if you scale horizontally
const pendingTokens = new Map()

// ─── Auth middleware (validates Supabase JWT) ─────────────────────────────────

async function requireAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorised' })
  const { data: { user }, error } = await supabase.auth.getUser(auth.split(' ')[1])
  if (error || !user) return res.status(401).json({ error: 'Unauthorised' })
  req.userId = user.id
  next()
}

// ─── GET /api/garmin/status ───────────────────────────────────────────────────
// Returns whether the current user has a connected Garmin account

router.get('/status', requireAuth, async (req, res) => {
  const { data } = await supabase
    .from('garmin_connections')
    .select('garmin_user_id, connected_at')
    .eq('user_id', req.userId)
    .maybeSingle()

  res.json({ connected: !!data, garminUserId: data?.garmin_user_id, connectedAt: data?.connected_at })
})

// ─── GET /api/garmin/auth ─────────────────────────────────────────────────────
// Step 1: get request token, redirect user to Garmin to authorise

router.get('/auth', requireAuth, async (req, res) => {
  try {
    const callbackUrl = `${process.env.RAILWAY_PUBLIC_DOMAIN || 'http://localhost:3001'}/api/garmin/callback?userId=${req.userId}`
    const { token, secret } = await getRequestToken(callbackUrl)

    // Store secret temporarily so we can use it in the callback
    pendingTokens.set(token, { secret, userId: req.userId })
    // Clean up after 10 minutes
    setTimeout(() => pendingTokens.delete(token), 10 * 60 * 1000)

    res.json({ authorizeUrl: buildAuthorizeUrl(token) })
  } catch (err) {
    console.error('[Garmin] auth error:', err.message)
    res.status(500).json({ error: 'Failed to start Garmin authorisation' })
  }
})

// ─── GET /api/garmin/callback ─────────────────────────────────────────────────
// Step 2: Garmin redirects here after user authorises — exchange for access token

router.get('/callback', async (req, res) => {
  const { oauth_token, oauth_verifier, userId } = req.query

  if (!oauth_token || !oauth_verifier || !userId) {
    return res.redirect(`${process.env.APP_URL || 'http://localhost:5173'}/dashboard?garmin=error`)
  }

  const pending = pendingTokens.get(oauth_token)
  if (!pending) {
    return res.redirect(`${process.env.APP_URL || 'http://localhost:5173'}/dashboard?garmin=expired`)
  }

  try {
    const { token, secret, userId: garminUserId } = await getAccessToken(oauth_token, pending.secret, oauth_verifier)
    pendingTokens.delete(oauth_token)

    // Upsert connection — one row per user
    await supabase.from('garmin_connections').upsert({
      user_id:              userId,
      access_token:         token,
      access_token_secret:  secret,
      garmin_user_id:       garminUserId || null,
      connected_at:         new Date().toISOString(),
    }, { onConflict: 'user_id' })

    res.redirect(`${process.env.APP_URL || 'http://localhost:5173'}/dashboard?garmin=connected`)
  } catch (err) {
    console.error('[Garmin] callback error:', err.message)
    res.redirect(`${process.env.APP_URL || 'http://localhost:5173'}/dashboard?garmin=error`)
  }
})

// ─── DELETE /api/garmin/disconnect ───────────────────────────────────────────

router.delete('/disconnect', requireAuth, async (req, res) => {
  await supabase.from('garmin_connections').delete().eq('user_id', req.userId)
  res.json({ ok: true })
})

// ─── POST /api/garmin/push-session ───────────────────────────────────────────
// Push a single session to the user's Garmin Connect calendar
// Body: { sessionId, scheduledDate? }

router.post('/push-session', requireAuth, async (req, res) => {
  const { sessionId, scheduledDate } = req.body

  // Load connection
  const { data: conn } = await supabase
    .from('garmin_connections')
    .select('access_token, access_token_secret')
    .eq('user_id', req.userId)
    .maybeSingle()

  if (!conn) return res.status(400).json({ error: 'No Garmin account connected' })

  // Load session
  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .maybeSingle()

  if (!session?.conditioning_config) {
    return res.status(400).json({ error: 'Session has no endurance config to push' })
  }

  // Load user's latest test results to resolve zone targets
  const testTypes = ['tt_5km', 'vo2_rhr', 'lactate_threshold', 'ftp_cycling', 'css_swim']
  const rows = await Promise.all(testTypes.map(t =>
    supabase.from('test_results')
      .select('results')
      .eq('client_id', req.userId)
      .eq('test_type', t)
      .order('tested_date', { ascending: false })
      .limit(1)
      .maybeSingle()
  ))
  const latestResults = {}
  testTypes.forEach((t, i) => { latestResults[t] = rows[i].data })

  // Resolve HR and power zones for the session segments
  const resolvedZones = resolveZonesFromResults(latestResults)

  try {
    // Create workout on Garmin
    const payload    = sessionToGarminWorkout(session, resolvedZones)
    const { workoutId } = await pushWorkout(payload, conn.access_token, conn.access_token_secret)

    // Schedule it if a date was provided
    if (scheduledDate && workoutId) {
      await scheduleWorkout(workoutId, scheduledDate, conn.access_token, conn.access_token_secret)
    }

    // Store the Garmin workout ID so we can delete/update it later
    await supabase.from('garmin_pushed_workouts').upsert({
      session_id:       sessionId,
      user_id:          req.userId,
      garmin_workout_id: String(workoutId),
      scheduled_date:   scheduledDate || null,
      pushed_at:        new Date().toISOString(),
    }, { onConflict: 'session_id,user_id' })

    res.json({ ok: true, workoutId })
  } catch (err) {
    console.error('[Garmin] push-session error:', err.message)
    res.status(500).json({ error: 'Failed to push workout to Garmin: ' + err.message })
  }
})

// ─── POST /api/garmin/webhooks/activities ────────────────────────────────────
// Garmin sends completed activity data here when a user syncs their device.
// Garmin validates with a shared secret header — verify before processing.

router.post('/webhooks/activities', express_raw_handler, async (req, res) => {
  // Verify Garmin webhook signature
  const secret = req.headers['x-garmin-signature']
  if (secret !== process.env.GARMIN_WEBHOOK_SECRET) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  const activities = req.body?.activities || []

  for (const act of activities) {
    try {
      // Find the user by their Garmin access token
      const { data: conn } = await supabase
        .from('garmin_connections')
        .select('user_id')
        .eq('garmin_user_id', act.userId)
        .maybeSingle()

      if (!conn) continue

      const startTime = new Date(act.startTimeInSeconds * 1000).toISOString()

      // Store the activity
      await supabase.from('garmin_activities').upsert({
        user_id:            conn.user_id,
        garmin_activity_id: String(act.activityId || act.summaryId),
        activity_type:      act.activityType,
        start_time:         startTime,
        duration_seconds:   act.durationInSeconds,
        distance_meters:    act.distanceInMeters,
        avg_hr:             act.averageHeartRateInBeatsPerMinute,
        max_hr:             act.maxHeartRateInBeatsPerMinute,
        calories:           act.calories,
        avg_speed_ms:       act.averageSpeedInMetersPerSecond,
        raw_data:           act,
      }, { onConflict: 'garmin_activity_id' })

      // Try to auto-complete a matching session
      await autoCompleteSession(conn.user_id, act, startTime)
    } catch (err) {
      console.error('[Garmin] webhook activity error:', err.message)
    }
  }

  res.json({ ok: true })
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Raw body middleware for webhook (needs raw JSON for signature check)
function express_raw_handler(req, res, next) {
  if (req.headers['content-type']?.includes('application/json') && !Buffer.isBuffer(req.body)) {
    return next()
  }
  next()
}

// Resolve the best HR and power zone ranges from test results
function resolveZonesFromResults(latestResults) {
  const zones = {}

  // HR: prefer LTHR, fall back to RHR/maxHR
  const lthr = latestResults.lactate_threshold?.results?.lthr
  const rhr  = latestResults.vo2_rhr?.results?.restingHr
  const mhr  = latestResults.vo2_rhr?.results?.maxHr
  if (lthr) {
    // Karvonen zones from LTHR (approx)
    zones.hr = { lo: Math.round(lthr * 0.80), hi: Math.round(lthr * 0.90) }
  } else if (rhr && mhr) {
    zones.hr = { lo: Math.round(rhr + (mhr - rhr) * 0.60), hi: Math.round(rhr + (mhr - rhr) * 0.75) }
  }

  // Power: FTP zones 3–4 (sweet spot / threshold)
  const ftp = latestResults.ftp_cycling?.results?.ftp
  if (ftp) {
    zones.power = { lo: Math.round(ftp * 0.76), hi: Math.round(ftp * 0.90) }
  }

  return zones
}

// Find a session on the same day with the same sport type and mark it complete
async function autoCompleteSession(userId, act, startTime) {
  const date = startTime.split('T')[0]
  const sportMap = { RUNNING: 'run', CYCLING: 'bike', SWIMMING: 'swim' }
  const modality = sportMap[act.activityType]
  if (!modality) return

  // Find a pushed workout for this user on this date
  const { data: pushed } = await supabase
    .from('garmin_pushed_workouts')
    .select('session_id')
    .eq('user_id', userId)
    .eq('scheduled_date', date)
    .maybeSingle()

  const sessionId = pushed?.session_id
  if (!sessionId) return

  // Log the conditioning result and complete the session
  await supabase.from('conditioning_logs').upsert({
    session_id: sessionId,
    client_id:  userId,
    result: {
      type:         'endurance',
      modality,
      total_time:   secondsToHMS(act.durationInSeconds),
      distance_km:  act.distanceInMeters ? +(act.distanceInMeters / 1000).toFixed(2) : null,
      avg_hr:       act.averageHeartRateInBeatsPerMinute || null,
      source:       'garmin',
    },
  }, { onConflict: 'session_id' })

  await supabase.from('sessions').update({ is_completed: true, completed_at: startTime })
    .eq('id', sessionId)
}

function secondsToHMS(s) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return [h, m, sec].map(v => String(v).padStart(2, '0')).join(':')
}

export default router
