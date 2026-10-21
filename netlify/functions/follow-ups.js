// Netlify scheduled function (runs every hour, set in netlify.toml): follows up audits that stall.
//   24 h after the audit with no movement screen  -> "Your movement screen is waiting"
//   72 h after the audit with no movement screen  -> "Before we speak: your movement screen"
//   24 h after the screen with no call booked     -> "Let's map your six months"
// Stops as soon as Dave sets the audit to Booked, Became client or Archived.
// What was sent is recorded on the audit (coach_data.followups), so nothing is sent twice.
// Needs SUPABASE_SERVICE_ROLE_KEY and RESEND_API_KEY in Netlify.

const { TEMPLATES } = require('../lib/client-email');
const SB_URL = 'https://opccfbudpovmxfmpanvj.supabase.co';
const FROM = 'Dave Marsh <noreply@coachdavemarsh.net>';
const REPLY = 'coachdavemarsh@gmail.com';
const H = 3600 * 1000, MAX_PER_RUN = 25;

async function sb(path, key, opt = {}) {
  const r = await fetch(`${SB_URL}${path}`, { ...opt, headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(opt.headers || {}) } });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${await r.text()}`);
  const t = await r.text(); return t ? JSON.parse(t) : null;
}

async function send(resend, to, tpl) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${resend}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: process.env.COACH_EMAIL || REPLY, subject: tpl.subject, html: tpl.html })
  });
  if (!r.ok) throw new Error(`Resend ${r.status}`);
}

// Which follow-up (if any) is due for this audit right now
function due(a, screen, now) {
  const fu = (a.coach_data && a.coach_data.followups) || {};
  const age = now - new Date(a.created_at).getTime();
  if (!screen) {
    if (!fu.screen1 && age > 24 * H) return 'screen1';
    if (fu.screen1 && !fu.screen2 && age > 72 * H && now - new Date(fu.screen1).getTime() > 40 * H) return 'screen2';
    return null;
  }
  if (!fu.call1 && now - new Date(screen).getTime() > 24 * H) return 'call1';
  return null;
}

async function run() {
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY, resend = process.env.RESEND_API_KEY;
  if (!service || !resend) return { skipped: 'not set up' };
  const now = Date.now(), since = encodeURIComponent(new Date(now - 14 * 24 * H).toISOString());
  const audits = await sb(`/rest/v1/performance_audits?select=id,full_name,email,created_at,status,source,coach_data&created_at=gte.${since}&status=in.(new,reviewed)&source=neq.existing-client&order=created_at.asc&limit=200`, service);
  const screens = await sb(`/rest/v1/movement_screens?select=email,created_at&created_at=gte.${since}&order=created_at.asc&limit=1000`, service);
  const latest = {}; (screens || []).forEach(s => { latest[(s.email || '').toLowerCase()] = s.created_at; });

  const sent = [];
  for (const a of audits || []) {
    if (sent.length >= MAX_PER_RUN) break;
    if (!a.email) continue;
    const key = due(a, latest[a.email.toLowerCase()], now);
    if (!key) continue;
    try {
      await send(resend, a.email, TEMPLATES[key](a.full_name));
      const cd = a.coach_data || {};
      const followups = { ...(cd.followups || {}), [key]: new Date().toISOString() };
      await sb(`/rest/v1/performance_audits?id=eq.${encodeURIComponent(a.id)}`, service, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ coach_data: { ...cd, followups } }) });
      sent.push(`${key}:${a.email}`);
    } catch (e) { sent.push(`error:${a.email}:${e.message}`); }
  }
  return { checked: (audits || []).length, sent };
}

exports.handler = async function () {
  try { const r = await run(); console.log('follow-ups', JSON.stringify(r)); return { statusCode: 200, body: JSON.stringify(r) }; }
  catch (e) { console.error('follow-ups failed', e.message); return { statusCode: 500, body: JSON.stringify({ error: e.message }) }; }
};
module.exports.due = due;
