// Netlify scheduled function (runs every hour, set in netlify.toml): follows up audits that stall.
//   24 h after the audit with no movement screen  -> "Your movement screen is waiting"
//   72 h after the audit with no movement screen  -> "Before we speak: your movement screen"
//   24 h after the screen with no call booked     -> "Let's map your six months"
// Stops as soon as Dave sets the audit to Booked, Became client or Archived.
// Client Hub: when a training's week has passed and it isn't complete, the client gets one
// bundled reminder, at most once a week (recorded in coach_data.hubReminders).
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

// The fixed course: one training a week from the client's start date (same as hub.html)
const PATH_WEEKS = { regulate: 1, awareness: 2, halts: 2, sleep: 3, recovery: 4, nutrition: 5, strength: 6, mobility: 7, values: 8, identity: 9, limits: 10, boundaries: 11, metabolism: 12, hormones: 13, growth: 14, release: 15, grief: 16, purpose: 17, polarity: 18, devotion: 19, service: 20, presence: 21 };
const TITLES = { regulate: 'Somatics: Regulate the body', sleep: 'Sleep: The foundation', recovery: 'Recovery: Read the signals', mobility: 'Mobility: Own your range', strength: 'Strength training: Build the base', metabolism: 'Metabolism: Build the engine', nutrition: 'Nutrition: Fuel the work', hormones: 'Hormones: Your daily environment', awareness: 'Awareness: Notice the pattern', halts: 'HALTS: Pause before you act', values: 'Values: The Human Formula to Win', identity: 'Identity: Old self, new self', limits: 'Self-limits: The inner voice', boundaries: 'Boundaries: Protect the standard', growth: 'Growth: Choose the challenge', release: 'Release: Head to heart', grief: 'Grief: The other side of love', purpose: 'Purpose: From proving to purpose', polarity: 'Polarity: Masculine and feminine', devotion: 'Devotion: Discipline with love', service: 'Service: Give it back', presence: 'Presence under pressure: Perform from presence' };
const DAY = 24 * H;

// Trainings whose week has ended without being completed
function overdue(start, done, now) {
  const st = new Date(start + 'T00:00:00Z').getTime();
  if (isNaN(st)) return [];
  if (now - st > 26 * 7 * DAY) return []; // course over
  return Object.keys(PATH_WEEKS).filter(id => !done[id] && now >= st + PATH_WEEKS[id] * 7 * DAY)
    .sort((a, b) => PATH_WEEKS[a] - PATH_WEEKS[b]);
}

async function trainingReminders(service, resend, now, budget) {
  const plans = await sb('/rest/v1/client_plans?select=audit_id,email,plan&published=eq.true&limit=500', service);
  const ids = (plans || []).filter(p => p.audit_id && p.email && p.plan && p.plan.hubPath && p.plan.hubPath.start).map(p => p.audit_id);
  if (!ids.length) return [];
  const audits = await sb(`/rest/v1/performance_audits?select=id,full_name,status,coach_data&id=in.(${ids.map(encodeURIComponent).join(',')})`, service);
  const byId = {}; (audits || []).forEach(a => { byId[a.id] = a; });
  const prog = await sb('/rest/v1/client_progress?select=email,module,done:data->>done&limit=10000', service);
  const doneBy = {}; (prog || []).forEach(r => { const e = (r.email || '').toLowerCase(); (doneBy[e] = doneBy[e] || {})[r.module] = r.done === 'true'; });
  const sent = [];
  for (const p of plans) {
    if (sent.length >= budget) break;
    const a = byId[p.audit_id], email = (p.email || '').trim();
    if (!a || !email || a.status === 'archived') continue;
    if (email.toLowerCase() === (process.env.COACH_EMAIL || REPLY).toLowerCase()) continue;
    const cd = a.coach_data || {}, last = cd.hubReminders && cd.hubReminders.last;
    if (last && now - new Date(last).getTime() < 7 * DAY) continue;
    const late = overdue(p.plan.hubPath.start, doneBy[email.toLowerCase()] || {}, now);
    if (!late.length) continue;
    try {
      await send(resend, email, TEMPLATES.training(a.full_name || (p.plan.client && p.plan.client.name), late.slice(0, 4).map(id => TITLES[id])));
      const hubReminders = { last: new Date().toISOString(), count: ((cd.hubReminders || {}).count || 0) + 1, modules: late };
      await sb(`/rest/v1/performance_audits?id=eq.${encodeURIComponent(a.id)}`, service, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ coach_data: { ...cd, hubReminders } }) });
      sent.push(`training:${email}`);
    } catch (e) { sent.push(`error:${email}:${e.message}`); }
  }
  return sent;
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
    if (a.email.toLowerCase() === (process.env.COACH_EMAIL || REPLY).toLowerCase()) continue; // your own test audits
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
  try { sent.push(...await trainingReminders(service, resend, now, MAX_PER_RUN - sent.length)); }
  catch (e) { sent.push(`error:hub:${e.message}`); }
  return { checked: (audits || []).length, sent };
}

exports.handler = async function () {
  try { const r = await run(); console.log('follow-ups', JSON.stringify(r)); return { statusCode: 200, body: JSON.stringify(r) }; }
  catch (e) { console.error('follow-ups failed', e.message); return { statusCode: 500, body: JSON.stringify({ error: e.message }) }; }
};
module.exports.due = due;
module.exports.overdue = overdue;
