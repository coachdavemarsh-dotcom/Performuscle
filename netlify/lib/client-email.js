// Shared look for emails to clients: same black, gold and sand as the Client Hub welcome email.
const SCREEN = 'https://coachdavemarsh.net/screen';
const CALL = 'https://calendly.com/coachdavemarsh/client-triage-call';
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function steps(done) {
  const items = ['Performance Audit', 'Movement screen', 'Strategy call', 'Your roadmap in the Client Hub'];
  return items.map((t, i) => {
    const d = i < done, now = i === done;
    const dot = d ? `<div style="width:24px;height:24px;border-radius:12px;background:#C9A56B;color:#141413;font:700 12px/24px Arial,sans-serif;text-align:center;">&#10003;</div>`
      : `<div style="width:24px;height:24px;border-radius:12px;border:1.5px solid ${now ? '#8A6A3B' : '#DDD7CB'};color:${now ? '#8A6A3B' : '#9A9488'};font:700 12px/21px Arial,sans-serif;text-align:center;box-sizing:border-box;">${i + 1}</div>`;
    return `<tr><td width="34" style="padding:0 0 10px;vertical-align:middle;">${dot}</td><td style="padding:0 0 10px;font:${now ? '700' : '400'} 15px Arial,sans-serif;color:${d ? '#77726A' : '#141413'};vertical-align:middle;">${esc(t)}${now ? ' &middot; next' : ''}</td></tr>`;
  }).join('');
}

function build({ preheader, eyebrow, title, lede, button, done, extra, list, foot }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:#F1EDE4;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1EDE4;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="background:#141413;border-radius:20px 20px 0 0;padding:28px 32px 24px;"><p style="margin:0;font:600 20px 'Oswald','Arial Narrow',Arial,sans-serif;letter-spacing:1px;color:#F4F1EA;text-transform:uppercase;">Soul Meets <span style="color:#C9A56B;">Strength</span></p></td></tr>
<tr><td style="background:#141413;padding:8px 32px 34px;">
<p style="margin:0 0 14px;font:700 11px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#C9A56B;">${esc(eyebrow)}</p>
<h1 style="margin:0 0 16px;font:600 36px/1.05 'Oswald','Arial Narrow',Arial,sans-serif;text-transform:uppercase;color:#F4F1EA;">${esc(title)}</h1>
<p style="margin:0 0 26px;font:16px/1.6 Arial,sans-serif;color:#BDB7AA;">${lede}</p>
<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:#F4F1EA;"><a href="${button[1]}" style="display:inline-block;padding:15px 30px;font:700 15px Arial,sans-serif;color:#141413;text-decoration:none;border-radius:999px;">${esc(button[0])} &rarr;</a></td></tr></table>
</td></tr>
<tr><td style="background:#FBFAF6;padding:28px 32px 18px;">
${list ? `<p style="margin:0 0 14px;font:700 11px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#8A6A3B;">${esc(list[0])}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${list[1].map(t => `<tr><td width="22" style="padding:0 0 10px;vertical-align:top;font:700 15px Arial,sans-serif;color:#C9A56B;">&bull;</td><td style="padding:0 0 10px;font:15px/1.5 Arial,sans-serif;color:#141413;">${esc(t)}</td></tr>`).join('')}</table>`
  : `<p style="margin:0 0 14px;font:700 11px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#8A6A3B;">Where you are</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps(done)}</table>`}
${extra ? `<p style="margin:10px 0 0;font:14px/1.6 Arial,sans-serif;color:#4A4740;">${extra}</p>` : ''}
<p style="margin:20px 0 0;font:15px/1.6 Arial,sans-serif;color:#141413;">Dave</p>
</td></tr>
<tr><td style="background:#141413;border-radius:0 0 20px 20px;padding:22px 32px;">
<p style="margin:0 0 6px;font:600 15px 'Oswald','Arial Narrow',Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:#C9A56B;">Stand in Your Standard.</p>
<p style="margin:0;font:12px/1.6 Arial,sans-serif;color:#8E887C;">${esc(foot || 'You’re getting this because you took the Performance Audit at coachdavemarsh.net.')} Just reply to this email to reach Dave.</p>
</td></tr></table></td></tr></table></body></html>`;
}

const FIRST = n => (String(n || '').trim().split(/\s+/)[0] || 'there');

const TEMPLATES = {
  // Sent straight after the audit
  thanks: n => ({
    subject: 'Your baseline is in. Next: your movement screen',
    html: build({ preheader: 'Fifteen minutes on your phone, then we talk.', eyebrow: 'Audit received', title: `Thanks, ${FIRST(n)}.`,
      lede: 'Dave has your audit. The next step takes about 15 minutes: film nine short movement tests on your phone, each with an example to copy. That way our strategy call starts at the deep end.',
      button: ['Start your movement screen', SCREEN], done: 1 })
  }),
  // 24 hours after the audit, no screen yet
  screen1: n => ({
    subject: 'Your movement screen is waiting',
    html: build({ preheader: 'Nine short clips, about 15 minutes.', eyebrow: 'One step to go', title: `${FIRST(n)}, show me how you move.`,
      lede: 'Your audit tells me where you are. The movement screen shows me how your body moves, so the plan fits you from day one. Nine short clips, about 15 minutes, with an example video for each test.',
      button: ['Film your movement screen', SCREEN], done: 1, extra: 'Can’t film right now? Book your strategy call anyway and do the screen before we speak.' })
  }),
  // 3 days after the audit, still no screen
  screen2: n => ({
    subject: 'Before we speak: your movement screen',
    html: build({ preheader: 'The last piece before your strategy call.', eyebrow: 'Last reminder', title: 'The last piece.',
      lede: `Hey ${esc(FIRST(n))}, your audit is in and reviewed. The movement screen is the last piece before your strategy call. If it’s easier, book the call now and film the screen any time before it.`,
      button: ['Film your movement screen', SCREEN], done: 1, extra: `Or <a href="${CALL}" style="color:#8A6A3B;font-weight:700;">book your strategy call</a> straight away.` })
  }),
  // 24 hours after the screen, call not booked
  call1: n => ({
    subject: 'Let’s map your six months',
    html: build({ preheader: 'Your audit and screen are in. Time to talk.', eyebrow: 'Ready when you are', title: `${FIRST(n)}, let’s talk.`,
      lede: 'Your audit and movement screen are both in, and Dave has been through them. Book your strategy call and we’ll map out your six months together.',
      button: ['Book your strategy call', CALL], done: 2 })
  }),
  // Client Hub: a training's week has passed and it isn't complete (at most one a week)
  training: (n, titles) => ({
    subject: titles.length > 1 ? `${titles.length} trainings are waiting in your Hub` : `${titles[0].split(':')[0]} is waiting in your Hub`,
    html: build({ preheader: 'Pick up where you left off. About 20 minutes.', eyebrow: 'Client Hub', title: `${FIRST(n)}, pick it back up.`,
      lede: `Life gets loud, and that’s fine. ${titles.length > 1 ? 'These trainings are' : 'This training is'} still open and waiting for you. Watch the video, answer the worksheet and start the practice. About 20 minutes. New trainings keep opening each week, so the sooner you catch up, the easier it gets.`,
      button: ['Open your Hub', 'https://coachdavemarsh.net/hub'], list: ['Still to finish', titles],
      foot: 'You’re getting this because you’re in the Soul Meets Strength Client Hub.' })
  })
};

module.exports = { TEMPLATES };
