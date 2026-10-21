// Netlify function: emails Dave when someone submits a Performance Audit or a Movement Screen.
// Called by the audit and screen pages right after a successful submit:
//   POST /.netlify/functions/notify-coach  {kind:'audit'|'screen', email}
// It only ever emails Dave, and only about a submission that really exists in the database
// and arrived in the last 15 minutes, so the endpoint can't be used to send anything else.
//
// Environment variables in Netlify:
//   SUPABASE_SERVICE_ROLE_KEY  (already set for the welcome email)
//   RESEND_API_KEY             Resend > API Keys > Create (Sending access)
//   COACH_EMAIL                optional, defaults to coachdavemarsh@gmail.com

const { TEMPLATES } = require('../lib/client-email');
const SB_URL = 'https://opccfbudpovmxfmpanvj.supabase.co';
const FROM = 'Performance Audit <noreply@coachdavemarsh.net>';
const DASH = 'https://coachdavemarsh.net/audit-coach';

const json = (status, body) => ({ statusCode: status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) });
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function sb(path, key) {
  const r = await fetch(`${SB_URL}${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!r.ok) throw new Error(`Supabase ${r.status}`);
  return r.json();
}

function shell(eyebrow, title, rows, note, button) {
  const tr = rows.filter(r => r[1] !== '' && r[1] != null).map(([k, v]) => `<tr><td style="padding:8px 0;border-top:1px solid #E4DED2;font:12px Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;color:#77726A;width:38%;vertical-align:top;">${esc(k)}</td><td style="padding:8px 0;border-top:1px solid #E4DED2;font:15px Arial,sans-serif;color:#141413;">${esc(v)}</td></tr>`).join('');
  return `<!doctype html><html><body style="margin:0;padding:0;background:#F1EDE4;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1EDE4;"><tr><td align="center" style="padding:28px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="background:#141413;border-radius:18px 18px 0 0;padding:24px 28px;">
<p style="margin:0 0 10px;font:700 11px Arial,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#C9A56B;">${esc(eyebrow)}</p>
<h1 style="margin:0;font:600 30px 'Oswald','Arial Narrow',Arial,sans-serif;line-height:1.1;text-transform:uppercase;color:#F4F1EA;">${esc(title)}</h1></td></tr>
<tr><td style="background:#FBFAF6;padding:18px 28px 8px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${tr}</table></td></tr>
${note ? `<tr><td style="background:#FBFAF6;padding:6px 28px 4px;"><p style="margin:0;padding:12px 14px;border-left:3px solid #A9573A;background:#F1EDE4;font:14px/1.5 Arial,sans-serif;color:#141413;">${note}</p></td></tr>` : ''}
<tr><td style="background:#FBFAF6;border-radius:0 0 18px 18px;padding:18px 28px 26px;"><a href="${button[1]}" style="display:inline-block;background:#141413;color:#F4F1EA;font:700 14px Arial,sans-serif;text-decoration:none;padding:13px 24px;border-radius:999px;">${esc(button[0])} &rarr;</a></td></tr>
</table></td></tr></table></body></html>`;
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Use POST.' });
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY, resend = process.env.RESEND_API_KEY;
  const to = process.env.COACH_EMAIL || 'coachdavemarsh@gmail.com';
  if (!service || !resend) return json(500, { error: 'Notifications are not set up yet.' });

  let body; try { body = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { error: 'Bad request.' }); }
  const kind = body.kind === 'screen' ? 'screen' : 'audit';
  const email = String(body.email || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json(400, { error: 'Bad email.' });
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const q = encodeURIComponent(email.replace(/[%_]/g, '\\$&'));

  let subject, html, clientName = null;
  try {
    if (kind === 'audit') {
      const rows = await sb(`/rest/v1/performance_audits?select=full_name,email,phone,created_at,answers&email=ilike.${q}&created_at=gte.${encodeURIComponent(since)}&order=created_at.desc&limit=1`, service);
      const r = rows[0]; if (!r) return json(404, { error: 'No recent audit.' });
      const a = r.answers || {}, b = a.baseline || {}, ns = a.ns || {}, ik = a.ik || {}, ex = a.extra || {};
      clientName = r.full_name || '';
      subject = `New Performance Audit: ${r.full_name}`;
      html = shell('New Performance Audit', r.full_name, [
        ['Email', r.email], ['Phone', r.phone || ''],
        ['Baseline', b.score != null ? `${Number(b.score).toFixed(1)} / 10` : ''], ['First focus', b.focus || ''],
        ['12-month goal', ns.year || ''], ['Motivation', ik.commit || ik.motivation || ''],
        ['Blood work', (ex.bloodFiles || []).length ? `${ex.bloodFiles.length} file(s) uploaded` : (ex.bloods === 'yes' ? 'Has bloods, not uploaded' : '')]
      ], 'Next for them: the movement screen, then booking a strategy call. If neither shows up within a day, send a nudge from the dashboard.', ['Open the coach dashboard', DASH]);
    } else {
      const rows = await sb(`/rest/v1/movement_screens?select=name,email,created_at,tests,files&email=ilike.${q}&created_at=gte.${encodeURIComponent(since)}&order=created_at.desc&limit=1`, service);
      const r = rows[0]; if (!r) return json(404, { error: 'No recent screen.' });
      const t = r.tests || {}, ids = Object.keys(t);
      const filmed = ids.filter(id => (t[id].files || []).length).length, pain = ids.filter(id => t[id].pain), skipped = ids.filter(id => t[id].skip);
      subject = `Movement screen in: ${r.name || r.email}`;
      html = shell('Movement screen received', r.name || r.email, [
        ['Email', r.email], ['Tests filmed', `${filmed} of 9`],
        ['Pain flagged', pain.length ? pain.join(', ') : 'None'], ['Couldn’t do', skipped.join(', ')],
        ['Blood work', (r.files || []).length ? `${r.files.length} file(s)` : '']
      ], pain.length ? 'Pain was flagged on at least one test. Check the clips before the call.' : '', ['Watch the clips', DASH]);
    }
  } catch (e) { return json(502, { error: e.message }); }

  const s = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${resend}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: email, subject, html })
  });
  if (!s.ok) { let m = ''; try { m = (await s.json()).message; } catch (e) {} return json(502, { error: m || `Email failed (${s.status}).` }); }
  // The client gets a thank-you that sends them straight to the movement screen
  if (kind === 'audit' && clientName !== null) {
    const t = TEMPLATES.thanks(clientName);
    await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${resend}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'Dave Marsh <noreply@coachdavemarsh.net>', to: [email], reply_to: to, subject: t.subject, html: t.html }) }).catch(() => {});
  }
  return json(200, { sent: true });
};
