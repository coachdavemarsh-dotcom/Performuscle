// Netlify function: sends a client their Client Hub welcome email when Dave publishes a plan.
// Called from the coach dashboard as POST /.netlify/functions/invite-client
// with the coach's own sign-in token. Only signed-in coaches can use it.
//
// Needs one environment variable in Netlify (Site configuration > Environment variables):
//   SUPABASE_SERVICE_ROLE_KEY  — Supabase > Project Settings > API keys > service_role (secret)
//
// New clients get Supabase's "Invite user" email; anyone who already has a login gets the
// "Magic link" email. Both templates are set in Supabase > Authentication > Emails.

const SB_URL = 'https://opccfbudpovmxfmpanvj.supabase.co';
const ANON = 'sb_publishable_brN2Be820KKzLyA8gfGltQ_Tvvus9Lg';
const REDIRECT = 'https://coachdavemarsh.net/my-plan';

const json = (status, body) => ({ statusCode: status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) });

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Use POST.' });
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!service) return json(500, { error: 'The welcome email is not set up yet: add SUPABASE_SERVICE_ROLE_KEY in Netlify.' });

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'Bad request.' }); }
  const email = String(body.email || '').trim().toLowerCase();
  const first = String(body.first || '').trim().slice(0, 60);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(400, { error: 'That email address does not look right.' });

  // 1. The caller must be a signed-in coach
  const auth = (event.headers.authorization || event.headers.Authorization || '').replace(/^Bearer\s+/i, '');
  if (!auth) return json(401, { error: 'Sign in again.' });
  const who = await fetch(`${SB_URL}/auth/v1/user`, { headers: { apikey: ANON, Authorization: `Bearer ${auth}` } });
  if (!who.ok) return json(401, { error: 'Sign in again.' });
  const user = await who.json();
  const prof = await fetch(`${SB_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=is_coach`, { headers: { apikey: service, Authorization: `Bearer ${service}` } });
  const rows = prof.ok ? await prof.json() : [];
  if (!rows[0] || !rows[0].is_coach) return json(403, { error: 'Only coaches can send welcome emails.' });

  // 2. Invite a new client; if they already have a login, send a sign-in link instead
  const redirect = encodeURIComponent(REDIRECT);
  const inv = await fetch(`${SB_URL}/auth/v1/invite?redirect_to=${redirect}`, {
    method: 'POST',
    headers: { apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, data: { first_name: first } })
  });
  if (inv.ok) return json(200, { sent: 'invite' });

  let msg = '';
  try { const j = await inv.json(); msg = j.msg || j.message || j.error_description || ''; } catch (e) {}
  if (inv.status === 422 || /already|registered|exists/i.test(msg)) {
    const otp = await fetch(`${SB_URL}/auth/v1/otp?redirect_to=${redirect}`, {
      method: 'POST',
      headers: { apikey: ANON, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, create_user: false })
    });
    if (otp.ok) return json(200, { sent: 'magiclink' });
    let m2 = ''; try { const j = await otp.json(); m2 = j.msg || j.message || ''; } catch (e) {}
    return json(502, { error: m2 || `The sign-in email didn't send (${otp.status}).` });
  }
  if (inv.status === 429) return json(429, { error: 'Too many emails in a short time. Try again in a few minutes.' });
  return json(502, { error: msg || `The welcome email didn't send (${inv.status}).` });
};
