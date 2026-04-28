import { supabase } from './supabase.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function post(path, body) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const headers = { 'Content-Type': 'application/json' }
    if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
    const res = await fetch(`${API_URL}/api/emails/${path}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return { ok: false, error: body.error || `HTTP ${res.status}` }
    }
    return { ok: true }
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
