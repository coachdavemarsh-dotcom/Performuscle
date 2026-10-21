// Netlify function: when someone books a call in Calendly, mark their Performance Audit as "booked".
// That clears the "No call booked" flag in the coach dashboard and stops the follow-up emails.
//
// Setup, once:
//   1. Calendly > Integrations & apps > API and webhooks > Personal access tokens > Generate.
//      Put it in Netlify as CALENDLY_TOKEN, then deploy.
//   2. Visit https://coachdavemarsh.net/.netlify/functions/calendly-booked?setup=1
//      This tells Calendly to send new bookings here (safe to visit again; it won't duplicate).
// Needs SUPABASE_SERVICE_ROLE_KEY too.

const crypto = require('crypto');
const SB_URL = 'https://opccfbudpovmxfmpanvj.supabase.co';
const HOOK = 'https://coachdavemarsh.net/.netlify/functions/calendly-booked';
const json = (status, body) => ({ statusCode: status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) });
const signingKey = token => crypto.createHash('sha256').update('calendly-hook:' + token).digest('hex').slice(0, 40);

async function cal(path, token, opt = {}) {
  const r = await fetch(`https://api.calendly.com${path}`, { ...opt, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(opt.headers || {}) } });
  const t = await r.text(); let j = {}; try { j = t ? JSON.parse(t) : {}; } catch (e) {}
  if (!r.ok) throw new Error(j.message || j.title || `Calendly ${r.status}`);
  return j;
}

async function setup(token) {
  const me = await cal('/users/me', token);
  const user = me.resource.uri, org = me.resource.current_organization;
  const list = await cal(`/webhook_subscriptions?organization=${encodeURIComponent(org)}&user=${encodeURIComponent(user)}&scope=user&count=100`, token);
  const existing = (list.collection || []).find(w => w.callback_url === HOOK && w.state === 'active');
  if (existing) return { ok: true, already: true };
  await cal('/webhook_subscriptions', token, { method: 'POST', body: JSON.stringify({ url: HOOK, events: ['invitee.created'], organization: org, user, scope: 'user', signing_key: signingKey(token) }) });
  return { ok: true, created: true };
}

function verified(event, token) {
  const h = event.headers['calendly-webhook-signature'] || event.headers['Calendly-Webhook-Signature'] || '';
  const parts = Object.fromEntries(h.split(',').map(p => p.split('=')));
  if (!parts.t || !parts.v1) return false;
  if (Math.abs(Date.now() / 1000 - Number(parts.t)) > 600) return false;
  const expect = crypto.createHmac('sha256', signingKey(token)).update(`${parts.t}.${event.body || ''}`).digest('hex');
  try { return crypto.timingSafeEqual(Buffer.from(expect), Buffer.from(parts.v1)); } catch (e) { return false; }
}

exports.handler = async function (event) {
  const token = process.env.CALENDLY_TOKEN, service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!token || !service) return json(500, { error: 'Calendly connection is not set up yet: add CALENDLY_TOKEN in Netlify.' });

  if (event.httpMethod === 'GET') {
    if ((event.queryStringParameters || {}).setup !== '1') return json(200, { ok: true });
    try { return json(200, await setup(token)); } catch (e) { return json(502, { error: e.message }); }
  }
  if (event.httpMethod !== 'POST') return json(405, { error: 'Use POST.' });
  if (!verified(event, token)) return json(401, { error: 'Signature check failed.' });

  let body; try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'Bad request.' }); }
  if (body.event !== 'invitee.created') return json(200, { ignored: body.event });
  const p = body.payload || {}, email = String(p.email || '').trim().toLowerCase();
  if (!email) return json(200, { ignored: 'no email' });

  const H = { apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json' };
  const q = encodeURIComponent(email.replace(/[%_]/g, '\\$&'));
  const r = await fetch(`${SB_URL}/rest/v1/performance_audits?select=id,status,coach_data&email=ilike.${q}&status=in.(new,reviewed)&order=created_at.desc&limit=1`, { headers: H });
  const rows = r.ok ? await r.json() : [];
  if (!rows[0]) return json(200, { matched: false });
  const a = rows[0], cd = a.coach_data || {};
  const booking = { at: new Date().toISOString(), start: (p.scheduled_event && p.scheduled_event.start_time) || null, name: p.name || null };
  await fetch(`${SB_URL}/rest/v1/performance_audits?id=eq.${encodeURIComponent(a.id)}`, { method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify({ status: 'booked', coach_data: { ...cd, booking } }) });
  return json(200, { matched: true });
};
