import { Resend } from 'resend'
import * as templates from './emailTemplates.js'

const FROM = process.env.FROM_EMAIL || 'Performuscle <noreply@coachdavemarsh.net>'
const APP_URL = process.env.APP_URL || 'http://localhost:5173'

async function send({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set — skipping email to', to)
    return { error: null }
  }
  const resend = new Resend(process.env.RESEND_API_KEY)
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to, subject, html })
    if (error) console.error('[Email] Send error:', error)
    return { data, error }
  } catch (err) {
    console.error('[Email] Exception:', err.message)
    return { error: err }
  }
}

export async function sendCheckInNotification({
  coachEmail,
  clientName,
  weekNumber,
  biofeedbackScore,
  bodyWeight,
  urgency,
  lowestAreasNote,
}) {
  const { subject, html } = templates.checkInSubmitted({
    clientName,
    weekNumber,
    biofeedbackScore,
    bodyWeight,
    urgency,
    lowestAreasNote,
    appUrl: APP_URL,
  })
  return send({ to: coachEmail, subject, html })
}

export async function sendCoachReplyNotification({
  clientEmail,
  clientName,
  coachName,
  weekNumber,
  replyText,
}) {
  const { subject, html } = templates.coachReplied({
    clientName,
    coachName,
    weekNumber,
    replyText,
    appUrl: APP_URL,
  })
  return send({ to: clientEmail, subject, html })
}

export async function sendWeeklyReminder({
  clientEmail,
  clientName,
  weekNumber,
  coachName,
}) {
  const { subject, html } = templates.weeklyReminder({
    clientName,
    weekNumber,
    coachName,
    appUrl: APP_URL,
  })
  return send({ to: clientEmail, subject, html })
}

export async function sendWelcomeEmail({
  clientEmail,
  clientName,
  coachName,
}) {
  const { subject, html } = templates.welcomeClient({
    clientName,
    coachName,
    appUrl: APP_URL,
  })
  return send({ to: clientEmail, subject, html })
}

export async function sendClientInviteEmail({ clientEmail, clientName, coachName, inviteUrl }) {
  const { subject, html } = templates.clientInvite({ clientName, coachName, inviteUrl })
  return send({ to: clientEmail, subject, html })
}

export async function sendBirthdayEmail({ clientEmail, clientName }) {
  const firstName = clientName?.split(' ')[0] || 'there'
  const subject = `🎂 Happy Birthday, ${firstName}!`
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#060608;color:#F5F6FA;padding:32px;border-radius:12px;">
      <div style="text-align:center;margin-bottom:24px;">
        <div style="font-size:48px;margin-bottom:12px;">🎂</div>
        <h1 style="font-family:'Arial Black',sans-serif;font-size:28px;color:#00C896;letter-spacing:2px;margin:0;">HAPPY BIRTHDAY!</h1>
      </div>
      <p style="font-size:16px;line-height:1.6;color:#F5F6FA;">Hey ${firstName},</p>
      <p style="font-size:14px;line-height:1.7;color:#9ca3af;">Today is your day — and we just want to say how proud we are of the work you've been putting in. Birthdays are a great time to reflect on how far you've come and everything still ahead.</p>
      <p style="font-size:14px;line-height:1.7;color:#9ca3af;">Keep training hard, eating well, and showing up for yourself. That's the real gift. 💪</p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${APP_URL}/dashboard" style="background:#00C896;color:#060608;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;letter-spacing:1px;">OPEN APP →</a>
      </div>
      <p style="font-size:12px;color:#5e5e70;text-align:center;margin-top:24px;">The Performuscle Team</p>
    </div>
  `
  return send({ to: clientEmail, subject, html })
}
