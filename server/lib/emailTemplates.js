// ─── Email Templates ─────────────────────────────────────────────────────────
// All templates return { subject, html }
// Full inline styles — no external CSS, no classes

const BRAND = {
  ink:    '#060608',
  accent: '#00C896',
  accentHi: '#00FFB8',
  white:  '#F5F6FA',
  muted:  '#5e5e70',
  text:   '#111827',
  warn:   '#d97706',
  danger: '#e53535',
  bg:     '#f4f5f8',
}

// Base wrapper shared by all templates
function wrap(bodyContent) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Performuscle</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:'DM Sans',Helvetica,Arial,sans-serif;color:${BRAND.text};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.bg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:600px;" cellspacing="0" cellpadding="0">

          <!-- HEADER -->
          <tr>
            <td style="background:${BRAND.ink};border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
              <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:28px;letter-spacing:0.15em;color:${BRAND.accent};">
                PERFORMUSCLE
              </div>
              <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:11px;letter-spacing:0.2em;color:${BRAND.muted};margin-top:4px;">
                HEALTH &nbsp;|&nbsp; FUNCTION &nbsp;|&nbsp; PERFORMANCE
              </div>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background:#ffffff;padding:36px 32px;">
              ${bodyContent}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:${BRAND.ink};border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;color:${BRAND.muted};line-height:1.6;">
                Performuscle &middot; You're receiving this because you're a coach on Performuscle
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// Shared CTA button
function ctaButton(label, url, opts = {}) {
  const bg  = opts.bg  || BRAND.accent
  const fg  = opts.fg  || '#ffffff'
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0 0;">
      <tr>
        <td align="center">
          <a href="${url}"
             style="display:inline-block;background:${bg};color:${fg};text-decoration:none;font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:15px;letter-spacing:0.12em;padding:14px 36px;border-radius:8px;">
            ${label}
          </a>
        </td>
      </tr>
    </table>`
}

// Score grade helper (used in checkInSubmitted template)
function scoreGrade(score) {
  if (score >= 90) return 'ELITE'
  if (score >= 80) return 'EXCELLENT'
  if (score >= 70) return 'STRONG'
  if (score >= 60) return 'SOLID'
  if (score >= 50) return 'NEEDS WORK'
  return 'STRUGGLING'
}

function scoreColor(score) {
  if (score >= 80) return BRAND.accent
  if (score >= 60) return BRAND.warn
  return BRAND.danger
}

// ─── Template 1: Check-In Submitted (Coach notification) ─────────────────────
export function checkInSubmitted({
  clientName,
  weekNumber,
  biofeedbackScore,
  bodyWeight,
  urgency,
  lowestAreasNote,
  appUrl,
}) {
  const subject = `\uD83D\uDD14 New check-in from ${clientName} \u2014 Week ${weekNumber}`

  const hasScore = biofeedbackScore !== null && biofeedbackScore !== undefined
  const scoreVal = hasScore ? Math.round(biofeedbackScore) : null
  const ringColor = hasScore ? scoreColor(scoreVal) : BRAND.muted
  const grade = hasScore ? scoreGrade(scoreVal) : ''

  // Urgency display
  const urgencyMap = {
    need_help:     { label: 'Need Help ASAP \uD83D\uDEA8', color: BRAND.danger },
    few_questions: { label: 'Few Questions \uD83D\uDE4B',  color: BRAND.warn   },
    all_good:      { label: 'All Good \u2705',              color: BRAND.accent },
  }
  const urgencyInfo = urgency && urgencyMap[urgency]
    ? urgencyMap[urgency]
    : { label: urgency || '\u2014', color: BRAND.muted }

  // Score ring visual
  const scoreRing = hasScore ? `
    <div style="text-align:center;margin:28px 0 20px;">
      <div style="display:inline-block;width:100px;height:100px;border-radius:50%;border:4px solid ${ringColor};line-height:1;position:relative;box-shadow:0 0 0 8px ${ringColor}18;">
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
          <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:36px;color:${ringColor};line-height:1;">${scoreVal}</div>
          <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:9px;letter-spacing:0.12em;color:${ringColor};text-align:center;">${grade}</div>
        </div>
      </div>
    </div>` : ''

  // Stats row
  const hasStats = bodyWeight || urgency
  const statsRow = hasStats ? `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:8px 0 20px;">
      <tr>
        ${bodyWeight ? `
        <td style="text-align:center;padding:12px;background:#f8f9fb;border-radius:8px;width:50%;">
          <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:10px;letter-spacing:0.12em;color:${BRAND.muted};margin-bottom:4px;">WEIGHT</div>
          <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:22px;color:${BRAND.text};">${bodyWeight}kg</div>
        </td>
        <td width="12">&nbsp;</td>` : ''}
        ${urgency ? `
        <td style="text-align:center;padding:12px;background:#f8f9fb;border-radius:8px;">
          <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:10px;letter-spacing:0.12em;color:${BRAND.muted};margin-bottom:4px;">URGENCY</div>
          <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:14px;color:${urgencyInfo.color};">${urgencyInfo.label}</div>
        </td>` : ''}
      </tr>
    </table>` : ''

  // Client note box
  const noteBox = lowestAreasNote ? `
    <div style="background:#f4f5f8;border-radius:8px;padding:16px 20px;margin:20px 0;">
      <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:10px;letter-spacing:0.12em;color:${BRAND.muted};margin-bottom:8px;">CLIENT NOTE</div>
      <p style="margin:0;font-size:14px;line-height:1.6;color:${BRAND.text};">${lowestAreasNote}</p>
    </div>` : ''

  const html = wrap(`
    <h1 style="margin:0 0 6px;font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:26px;letter-spacing:0.08em;color:${BRAND.text};">
      New Check-In Received
    </h1>
    <p style="margin:0 0 4px;font-size:15px;color:${BRAND.muted};">
      <strong style="color:${BRAND.accent};">${clientName}</strong> has submitted their Week ${weekNumber} check-in.
    </p>

    ${scoreRing}
    ${statsRow}
    ${noteBox}

    ${ctaButton('VIEW &amp; REPLY \u2192', `${appUrl}/coach/checkins`)}

    <p style="margin:24px 0 0;font-size:12px;color:${BRAND.muted};text-align:center;">
      Reply within 24 hours to keep your client on track.
    </p>
  `)

  return { subject, html }
}

// ─── Template 2: Coach Replied (Client notification) ─────────────────────────
export function coachReplied({
  clientName,
  coachName,
  weekNumber,
  replyText,
  appUrl,
}) {
  const subject = `\uD83D\uDCAC Your coach has replied to your Week ${weekNumber} check-in`

  const html = wrap(`
    <h1 style="margin:0 0 6px;font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:26px;letter-spacing:0.08em;color:${BRAND.text};">
      Your Coach Responded
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:${BRAND.muted};">
      Great news &mdash; <strong style="color:${BRAND.text};">${coachName}</strong> has reviewed your Week ${weekNumber} check-in and left you a reply.
    </p>

    <!-- Reply box -->
    <div style="background:#f8f9fb;border-left:4px solid ${BRAND.accent};border-radius:0 8px 8px 0;padding:20px 24px;margin:0 0 8px;">
      <div style="font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:10px;letter-spacing:0.12em;color:${BRAND.accent};margin-bottom:10px;">
        ${coachName.toUpperCase()}
      </div>
      <p style="margin:0;font-size:15px;line-height:1.7;color:${BRAND.text};white-space:pre-wrap;">${replyText}</p>
    </div>

    ${ctaButton('VIEW YOUR CHECK-IN \u2192', `${appUrl}/checkin`, { bg: BRAND.ink, fg: BRAND.accent })}

    <p style="margin:28px 0 0;font-size:13px;color:${BRAND.muted};text-align:center;line-height:1.6;">
      Keep up the great work. Consistency is everything.
    </p>
  `)

  return { subject, html }
}

// ─── Template 3: Weekly Reminder (Client notification) ───────────────────────
export function weeklyReminder({
  clientName,
  weekNumber,
  coachName,
  appUrl,
}) {
  const subject = `\uD83D\uDCCB Time for your Week ${weekNumber} check-in`

  const bullets = [
    { icon: '\uD83D\uDCCA', text: 'Log your biofeedback scores' },
    { icon: '\u2696\uFE0F',  text: 'Record your weight' },
    { icon: '\uD83D\uDCAC', text: 'Update your coach on your week' },
  ]

  const bulletList = bullets.map(b => `
    <tr>
      <td style="padding:10px 0;">
        <table role="presentation" cellspacing="0" cellpadding="0">
          <tr>
            <td style="width:36px;height:36px;background:${BRAND.accent}18;border-radius:8px;text-align:center;vertical-align:middle;font-size:18px;">${b.icon}</td>
            <td style="padding-left:14px;font-size:14px;color:${BRAND.text};line-height:1.4;">${b.text}</td>
          </tr>
        </table>
      </td>
    </tr>`).join('')

  const html = wrap(`
    <h1 style="margin:0 0 6px;font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:26px;letter-spacing:0.08em;color:${BRAND.text};">
      Weekly Check-In
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:${BRAND.muted};">
      Hey <strong style="color:${BRAND.text};">${clientName}</strong>, it's time to submit your Week ${weekNumber} check-in to <strong style="color:${BRAND.text};">${coachName}</strong>.
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 8px;">
      ${bulletList}
    </table>

    ${ctaButton('SUBMIT CHECK-IN \u2192', `${appUrl}/checkin`)}

    <p style="margin:16px 0 0;font-size:12px;color:${BRAND.muted};text-align:center;">
      Takes less than 3 minutes.
    </p>
  `)

  return { subject, html }
}

// ─── Template 4: Welcome Client ───────────────────────────────────────────────
export function welcomeClient({
  clientName,
  coachName,
  appUrl,
}) {
  const subject = `\uD83C\uDF89 Welcome to ${coachName}'s programme`

  const steps = [
    { num: 1, text: 'Complete your first weekly check-in' },
    { num: 2, text: 'Explore your training programme' },
    { num: 3, text: 'Log your daily habits' },
    { num: 4, text: 'Check the Learning Hub \u2014 built to help you understand every part of your programme' },
  ]

  const stepCards = steps.map(s => `
    <tr>
      <td style="padding:8px 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
               style="background:#f8f9fb;border-radius:10px;padding:0;">
          <tr>
            <td style="padding:16px 20px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="width:34px;height:34px;background:${BRAND.accent};border-radius:50%;text-align:center;vertical-align:middle;font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:16px;color:#fff;font-weight:bold;flex-shrink:0;">${s.num}</td>
                  <td style="padding-left:14px;font-size:14px;color:${BRAND.text};line-height:1.5;">${s.text}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`).join('')

  const html = wrap(`
    <h1 style="margin:0 0 6px;font-family:'Bebas Neue',Impact,'Arial Narrow',sans-serif;font-size:26px;letter-spacing:0.08em;color:${BRAND.text};">
      Welcome, ${clientName}!
    </h1>
    <p style="margin:0 0 24px;font-size:15px;color:${BRAND.muted};line-height:1.6;">
      You've been added to <strong style="color:${BRAND.text};">${coachName}</strong>'s coaching programme on Performuscle. Here's how to get started:
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 8px;">
      ${stepCards}
    </table>

    ${ctaButton('GET STARTED \u2192', `${appUrl}/dashboard`)}

    <p style="margin:24px 0 0;font-size:13px;color:${BRAND.muted};text-align:center;line-height:1.6;">
      We're excited to have you. Let's get to work.
    </p>
  `)

  return { subject, html }
}
