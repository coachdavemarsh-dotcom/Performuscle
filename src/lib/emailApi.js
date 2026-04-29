import { supabase } from './supabase.js'

// In production, leave VITE_API_URL unset — requests go to /api/* which
// Vercel proxies server-side to Railway (no CORS). For local dev, set
// VITE_API_URL=http://localhost:3001 in your .env file.
const API_URL = import.meta.env.VITE_API_URL || ''

async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  const headers = {}
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
  return headers
}

async function post(path, body) {
  try {
    const headers = { 'Content-Type': 'application/json', ...(await authHeaders()) }
    const res = await fetch(`${API_URL}/api/emails/${path}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}))
      return { ok: false, error: payload.error || `HTTP ${res.status}` }
    }
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

async function get(path) {
  try {
    const headers = await authHeaders()
    const res = await fetch(`${API_URL}/api/emails/${path}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    })
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}))
      return { ok: false, error: payload.error || `HTTP ${res.status}` }
    }
    const data = await res.json()
    return { ok: true, data }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

export function notifyCoachCheckIn({
  clientId,
  weekNumber,
  biofeedbackScore,
  bodyWeight,
  urgency,
  lowestAreasNote,
}) {
  return post('checkin-submitted', {
    clientId,
    weekNumber,
    biofeedbackScore,
    bodyWeight,
    urgency,
    lowestAreasNote,
  })
}

export function notifyClientReply({ clientId, coachId, weekNumber, replyText }) {
  return post('coach-replied', { clientId, coachId, weekNumber, replyText })
}

export function sendWelcome({ clientId, coachId }) {
  return post('welcome', { clientId, coachId })
}

export function inviteClient({ email, fullName }) {
  return post('invite-client', { email, fullName })
}

export function resendInvite({ clientId }) {
  return post('resend-invite', { clientId })
}

export function getPendingInvites() {
  return get('pending-invites')
}
