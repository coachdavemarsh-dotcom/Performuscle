// Garmin Connect OAuth 1.0a + Training/Activity API client
// All calls are server-side — consumer key/secret never leaves Railway.

import { OAuth } from 'oauth'

const REQUEST_TOKEN_URL = 'https://connectapi.garmin.com/oauth-service/oauth/request_token'
const ACCESS_TOKEN_URL  = 'https://connectapi.garmin.com/oauth-service/oauth/access_token'
const AUTHORIZE_URL     = 'https://connect.garmin.com/oauthConfirm'
const TRAINING_API      = 'https://apis.garmin.com/training-api'
const WELLNESS_API      = 'https://apis.garmin.com/wellness-api/rest'

function makeOAuth(callbackUrl = 'oob') {
  return new OAuth(
    REQUEST_TOKEN_URL,
    ACCESS_TOKEN_URL,
    process.env.GARMIN_CONSUMER_KEY,
    process.env.GARMIN_CONSUMER_SECRET,
    '1.0',
    callbackUrl,
    'HMAC-SHA1',
  )
}

// ─── OAuth flow ───────────────────────────────────────────────────────────────

export async function getRequestToken(callbackUrl) {
  const oa = makeOAuth(callbackUrl)
  return new Promise((resolve, reject) => {
    oa.getOAuthRequestToken((err, token, secret) => {
      if (err) return reject(new Error(err.data || err.message || 'Request token failed'))
      resolve({ token, secret })
    })
  })
}

export function buildAuthorizeUrl(requestToken) {
  return `${AUTHORIZE_URL}?oauth_token=${requestToken}`
}

export async function getAccessToken(requestToken, requestTokenSecret, verifier) {
  const oa = makeOAuth()
  return new Promise((resolve, reject) => {
    oa.getOAuthAccessToken(requestToken, requestTokenSecret, verifier, (err, token, secret, results) => {
      if (err) return reject(new Error(err.data || err.message || 'Access token failed'))
      resolve({ token, secret, userId: results?.userId })
    })
  })
}

// ─── Signed API calls ─────────────────────────────────────────────────────────

function signedGet(url, accessToken, accessTokenSecret) {
  const oa = makeOAuth()
  return new Promise((resolve, reject) => {
    oa.get(url, accessToken, accessTokenSecret, (err, data) => {
      if (err) return reject(new Error(err.data || err.message || 'GET failed'))
      resolve(JSON.parse(data))
    })
  })
}

function signedPost(url, body, accessToken, accessTokenSecret) {
  const oa = makeOAuth()
  return new Promise((resolve, reject) => {
    oa.post(url, accessToken, accessTokenSecret, JSON.stringify(body), 'application/json', (err, data) => {
      if (err) return reject(new Error(err.data || err.message || 'POST failed'))
      resolve(data ? JSON.parse(data) : {})
    })
  })
}

function signedDelete(url, accessToken, accessTokenSecret) {
  const oa = makeOAuth()
  return new Promise((resolve, reject) => {
    oa.delete(url, accessToken, accessTokenSecret, (err, data) => {
      if (err) return reject(new Error(err.data || err.message || 'DELETE failed'))
      resolve(data ? JSON.parse(data) : {})
    })
  })
}

// ─── Training API ─────────────────────────────────────────────────────────────

export async function pushWorkout(workoutPayload, accessToken, accessTokenSecret) {
  return signedPost(`${TRAINING_API}/workout`, workoutPayload, accessToken, accessTokenSecret)
}

export async function scheduleWorkout(workoutId, dateStr, accessToken, accessTokenSecret) {
  // dateStr: 'YYYY-MM-DD'
  return signedPost(`${TRAINING_API}/schedule/${workoutId}`, { date: dateStr }, accessToken, accessTokenSecret)
}

export async function deleteWorkout(workoutId, accessToken, accessTokenSecret) {
  return signedDelete(`${TRAINING_API}/workout/${workoutId}`, accessToken, accessTokenSecret)
}

// ─── User profile ──────────────────────────────────────────────────────────────

export async function getGarminUser(accessToken, accessTokenSecret) {
  return signedGet(`${WELLNESS_API}/user/id`, accessToken, accessTokenSecret)
}

// ─── Session → Garmin workout converter ──────────────────────────────────────
// Converts a Performuscle conditioning_config + resolved zones into Garmin Training API format.
// resolvedZones: { hr: { lo, hi }, power: { lo, hi } } — pre-resolved before calling

const SPORT_MAP = {
  run:  { sportTypeId: 1, sportTypeKey: 'running' },
  bike: { sportTypeId: 2, sportTypeKey: 'cycling' },
  swim: { sportTypeId: 5, sportTypeKey: 'swimming' },
}

const STEP_TYPE = {
  warmup:   { stepTypeId: 1, stepTypeKey: 'warmup' },
  cooldown: { stepTypeId: 2, stepTypeKey: 'cooldown' },
  interval: { stepTypeId: 3, stepTypeKey: 'interval' },
  recovery: { stepTypeId: 4, stepTypeKey: 'recovery' },
  rest:     { stepTypeId: 5, stepTypeKey: 'rest' },
  other:    { stepTypeId: 6, stepTypeKey: 'other' },
}

const END_TIME = { conditionTypeId: 2, conditionTypeKey: 'time' }

const TARGET_OPEN        = { workoutTargetTypeId: 0, workoutTargetTypeKey: 'no.target' }
const TARGET_HR_CUSTOM   = { workoutTargetTypeId: 4, workoutTargetTypeKey: 'heart.rate.custom.range' }
const TARGET_PWR_CUSTOM  = { workoutTargetTypeId: 10, workoutTargetTypeKey: 'power.custom.range' }

function labelToStepType(label = '') {
  const l = label.toLowerCase()
  if (l.includes('warm'))     return STEP_TYPE.warmup
  if (l.includes('cool'))     return STEP_TYPE.cooldown
  if (l.includes('recovery') || l.includes('rest')) return STEP_TYPE.recovery
  return STEP_TYPE.interval
}

function buildStep(order, label, durationSec, target, resolvedZones) {
  const stepType = labelToStepType(label)
  let targetType = TARGET_OPEN, targetValueOne = null, targetValueTwo = null

  if (target?.metric === 'hr' && resolvedZones?.hr) {
    targetType     = TARGET_HR_CUSTOM
    targetValueOne = resolvedZones.hr.lo
    targetValueTwo = resolvedZones.hr.hi
  } else if (target?.metric === 'power' && resolvedZones?.power) {
    targetType     = TARGET_PWR_CUSTOM
    targetValueOne = resolvedZones.power.lo
    targetValueTwo = resolvedZones.power.hi
  }

  return {
    stepOrder:      order,
    stepType,
    endCondition:   END_TIME,
    endConditionValue: Math.round(durationSec),
    targetType,
    targetValueOne,
    targetValueTwo,
    zoneNumber:     null,
    description:    label || null,
  }
}

export function sessionToGarminWorkout(session, resolvedZones = {}) {
  const cfg      = session.conditioning_config || {}
  const segments = cfg.segments || []
  const sport    = SPORT_MAP[cfg.modality] || SPORT_MAP.run
  const steps    = []
  let   order    = 1

  for (const seg of segments) {
    if (seg.repeat != null) {
      for (let r = 0; r < seg.repeat; r++) {
        if (seg.work) {
          steps.push(buildStep(order++, seg.work.label || `Rep ${r + 1}`,
            (seg.work.duration_min || 0) * 60, seg.work.target, resolvedZones))
        }
        if (seg.recovery) {
          steps.push(buildStep(order++, seg.recovery.label || `Rest ${r + 1}`,
            (seg.recovery.duration_min || 0) * 60, seg.recovery.target, resolvedZones))
        }
      }
    } else {
      steps.push(buildStep(order++, seg.label,
        (seg.duration_min || 0) * 60, seg.target, resolvedZones))
    }
  }

  return {
    workoutName: cfg.title || session.day_label || 'Performuscle Session',
    description: cfg.coach_note || '',
    sport:       cfg.modality === 'bike' ? 'CYCLING' : cfg.modality === 'swim' ? 'SWIMMING' : 'RUNNING',
    workoutSegments: [{
      segmentOrder: 1,
      sportType:    sport,
      workoutSteps: steps,
    }],
  }
}
