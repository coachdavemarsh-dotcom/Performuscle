// Netlify function: the weekly check-in loop between a client's My Plan and Dave.
//   POST /.netlify/functions/checkins  {action:'submitted'}               client token: emails Dave the check-in
//   POST /.netlify/functions/checkins  {action:'reply', email, d, ...}    coach token: emails the client Dave's reply
// Needs SUPABASE_SERVICE_ROLE_KEY and RESEND_API_KEY (already set). COACH_EMAIL optional.

const { TEMPLATES } = require('../lib/client-email');
const SB_URL = 'https://opccfbudpovmxfmpanvj.supabase.co';
const ANON = 'sb_publishable_brN2Be820KKzLyA8gfGltQ_Tvvus9Lg';
const DASH = 'https://coachdavemarsh.net/audit-coach';
const REPLY = 'coachdavemarsh@gmail.com';
const BIO = { sleep: 'Sleep', energy: 'Energy', calm: 'Stress', mood: 'Mood', digest: 'Digestion', appetite: 'Appetite', recovery: 'Recovery', training: 'Training' };

const json = (status, body) => ({ statusCode: status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) });
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sb = async (path, key) => { const r = await fetch(`${SB_URL}${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } }); if (!r.ok) throw new Error(`Supabase ${r.status}`); return r.json(); };
async function send(resend, from, to, subject, html) {
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${resend}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], reply_to: process.env.COACH_EMAIL || REPLY, subject, html }) });
  if (!r.ok) throw new Error(`Resend ${r.status}`);
}
async function who(event) {
  const auth = (event.headers.authorization || event.headers.Authorization || '').replace(/^Bearer\s+/i, '');
  if (!auth) return null;
  const r = await fetch(`${SB_URL}/auth/v1/user`, { headers: { apikey: ANON, Authorization: `Bearer ${auth}` } });
  return r.ok ? r.json() : null;
}

// Email to Dave: the check-in at a glance
function coachEmail(name, e, prev) {
  const d = (k, u = '') => (e[k] != null ? `${e[k]}${u}${prev && prev[k] != null && prev[k] !== e[k] ? ` <span style="color:#77726A;">(was ${prev[k]}${u})</span>` : ''}` : '');
  const rows = [['Biofeedback score', e.score != null ? d('score', '/100') : ''], ['Body weight', d('w', ' kg')], ['Body fat', d('bf', '%')], ['Waist', d('waist', ' cm')], ['Resting HR', d('rhr', ' bpm')], ['HRV', d('hrv', ' ms')],
    ['Ratings', Object.keys(BIO).map(k => `${BIO[k]} ${(e.r || {})[k] || '–'}`).join(' · ')]].filter(r => r[1]);
  const low = Object.keys(BIO).filter(k => +((e.r || {})[k]) <= 2).map(k => BIO[k]);
  return `<!doctype html><html><body style="margin:0;background:#F1EDE4;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1EDE4;"><tr><td align="center" style="padding:28px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="background:#141413;border-radius:18px 18px 0 0;padding:24px 28px;"><p style="margin:0 0 10px;font:700 11px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#C9A56B;">Weekly check-in</p>
<h1 style="margin:0;font:600 30px 'Oswald','Arial Narrow',Arial,sans-serif;line-height:1.1;text-transform:uppercase;color:#F4F1EA;">${esc(name)}</h1></td></tr>
<tr><td style="background:#FBFAF6;padding:16px 28px 6px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows.map(([k, v]) => `<tr><td style="padding:8px 0;border-top:1px solid #E4DED2;font:12px Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:#77726A;width:150px;vertical-align:top;">${k}</td><td style="padding:8px 0;border-top:1px solid #E4DED2;font:15px Arial,sans-serif;color:#141413;">${v}</td></tr>`).join('')}</table></td></tr>
${low.length ? `<tr><td style="background:#FBFAF6;padding:4px 28px;"><p style="margin:0;font:14px Arial,sans-serif;color:#B23A26;"><b>Low this week:</b> ${esc(low.join(', '))}</p></td></tr>` : ''}
${e.note ? `<tr><td style="background:#FBFAF6;padding:8px 28px 4px;"><p style="margin:0;padding:12px 14px;border-left:3px solid #C9A56B;background:#F1EDE4;font:14px/1.5 Arial,sans-serif;color:#141413;">${esc(e.note)}</p></td></tr>` : ''}
<tr><td style="background:#FBFAF6;border-radius:0 0 18px 18px;padding:18px 28px 26px;"><a href="${DASH}" style="display:inline-block;background:#141413;color:#F4F1EA;font:700 14px Arial,sans-serif;text-decoration:none;padding:13px 24px;border-radius:999px;">Open the dashboard and reply</a></td></tr>
</table></td></tr></table></body></html>`;
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Use POST.' });
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY, resend = process.env.RESEND_API_KEY;
  if (!service || !resend) return json(500, { error: 'Check-in emails are not set up yet.' });
  let body; try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'Bad request.' }); }
  const user = await who(event); if (!user) return json(401, { error: 'Sign in again.' });

  try {
    if (body.action === 'submitted') {
      // Only a check-in the client really saved in the last 15 minutes, and only ever to Dave
      const rows = await sb(`/rest/v1/client_progress?select=email,data&user_id=eq.${encodeURIComponent(user.id)}&module=eq.checkins&limit=1`, service);
      const data = (rows[0] || {}).data || {}, list = (data.list || []).filter(x => x && x.score != null).sort((a, b) => (a.d < b.d ? -1 : 1));
      const e = list.slice().sort((a, b) => ((a.at || '') < (b.at || '') ? -1 : 1)).pop(); if (!e || !e.at || Date.now() - new Date(e.at).getTime() > 15 * 60 * 1000) return json(404, { error: 'No recent check-in.' });
      const prev = e ? list.filter(x => x.d < e.d).pop() || null : null;
      const plans = await sb(`/rest/v1/client_plans?select=plan&email=ilike.${encodeURIComponent((user.email || '').replace(/[%_]/g, '\\$&'))}&published=eq.true&limit=1`, service);
      const cl = ((plans[0] || {}).plan || {}).client || {}, name = cl.name || cl.first || user.email;
      await send(resend, 'My Plan <noreply@coachdavemarsh.net>', process.env.COACH_EMAIL || REPLY, `Check-in: ${name}${e.score != null ? ` · ${e.score}/100` : ''}`, coachEmail(name, e, prev));
      return json(200, { ok: true });
    }
    if (body.action === 'reply') {
      const prof = await sb(`/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=is_coach`, service);
      if (!prof[0] || !prof[0].is_coach) return json(403, { error: 'Only coaches can reply.' });
      const email = String(body.email || '').trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(400, { error: 'Bad email.' });
      const tpl = TEMPLATES.checkinReply(String(body.name || ''), String(body.text || '').slice(0, 2000), !!body.video, String(body.d || ''));
      await send(resend, 'Dave Marsh <noreply@coachdavemarsh.net>', email, tpl.subject, tpl.html);
      return json(200, { ok: true });
    }
    return json(400, { error: 'Unknown action.' });
  } catch (e) { return json(500, { error: e.message }); }
};
