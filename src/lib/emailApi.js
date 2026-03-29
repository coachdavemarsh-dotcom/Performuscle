const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function post(path, body) {
  try {
    const res = await fetch(`${API_URL}/api/emails/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    })
    return res.ok
  } catch {
    return false
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
