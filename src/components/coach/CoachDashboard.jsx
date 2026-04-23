import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useCoach } from '../../hooks/useCoach.js'
import { supabase } from '../../lib/supabase.js'
import { navalBF } from '../../lib/calculators.js'
import { sendWelcome } from '../../lib/emailApi.js'

// ─── helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#00C896', '#f472b6', '#60a5fa', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981']
function avatarColor(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}
function initials(name = '') {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}
function daysAgo(dateStr) {
  if (!dateStr) return null
  const d = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24))
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  return `${d}d ago`
}
function calcClientBF(profile) {
  if (!profile?.height_cm || !profile?.waist_cm || !profile?.neck_cm) return null
  const g = profile.gender === 'male' ? 'male' : 'female'
  return navalBF(g, profile.waist_cm, profile.neck_cm, profile.height_cm, profile.hips_cm)
}

const GOAL_CONFIG = {
  cut:      { label: 'Fat Loss',    color: '#f472b6', icon: '🔥' },
  gain:     { label: 'Muscle',      color: 'var(--accent)', icon: '💪' },
  recomp:   { label: 'Recomp',      color: 'var(--info)',   icon: '⚖️' },
  maintain: { label: 'Maintain',    color: 'var(--warn)',   icon: '🏃' },
}

// ─── stat card ────────────────────────────────────────────────────────────────

function Stat({ label, value, sub, color = 'var(--white)', onClick }) {
  return (
    <div className="stat-card" style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
      <div className="label">{label}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── alert banner ─────────────────────────────────────────────────────────────

function Alert({ type = 'warn', icon, message, action, onAction }) {
  const colors = { warn: 'var(--warn)', danger: 'var(--danger)', info: 'var(--info)', accent: 'var(--accent)' }
  const col = colors[type]
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 16px', borderRadius: 8, marginBottom: 8,
      background: `${col}0e`, border: `1px solid ${col}33`,
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 12, color: 'var(--sub)' }}>{message}</span>
      {action && (
        <button onClick={onAction} style={{
          fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5,
          color: col, background: `${col}18`, border: `1px solid ${col}33`,
          borderRadius: 4, padding: '3px 10px', cursor: 'pointer',
        }}>
          {action.toUpperCase()}
        </button>
      )}
    </div>
  )
}

// ─── client card ─────────────────────────────────────────────────────────────

function ClientCard({ client, programme, lastCheckIn, assessment, testResult, navigate, coachId }) {
  const p      = client.profile || {}
  const name   = p.full_name || 'Unknown'
  const color  = avatarColor(name)
  const goal   = GOAL_CONFIG[p.goal_type]
  const bf     = calcClientBF(p)
  const weight = lastCheckIn?.body_weight_kg || p.current_weight
  const leanMass = bf && weight ? Math.round((1 - bf / 100) * weight * 10) / 10 : null

  const checkInAge = lastCheckIn ? Math.floor((Date.now() - new Date(lastCheckIn.submitted_at)) / (1000 * 60 * 60 * 24)) : null
  const needsReply = lastCheckIn && !lastCheckIn.coach_reply
  const checkInUrgent = needsReply && checkInAge >= 2

  const isWeek1 = !programme || programme.current_week === 1
  const progPct = programme
    ? Math.min(100, Math.round((programme.current_week / programme.total_weeks) * 100))
    : 0

  const daysUntilExpiry = programme?.end_date
    ? Math.ceil((new Date(programme.end_date) - Date.now()) / (1000 * 60 * 60 * 24))
    : null
  const expiringWarn = daysUntilExpiry !== null && daysUntilExpiry <= 14

  return (
    <div style={{
      background: 'var(--s3)', borderRadius: 12,
      border: `1px solid ${checkInUrgent ? 'rgba(255,68,68,.35)' : expiringWarn ? 'rgba(255,173,0,.35)' : 'var(--border)'}`,
      overflow: 'hidden', transition: 'border-color .2s',
    }}>
      {/* Top bar */}
      <div style={{
        height: 3,
        background: programme
          ? `linear-gradient(90deg,var(--accent) ${progPct}%,var(--s5) ${progPct}%)`
          : 'var(--s5)',
      }} />

      <div style={{ padding: '16px 18px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
          {/* Avatar */}
          <div style={{
            width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
            background: `${color}22`, border: `2px solid ${color}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 13, color,
          }}>
            {initials(name)}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--white)', letterSpacing: .5, marginBottom: 4 }}>
              {name}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5,
                color: client.plan === 'elite' ? 'var(--warn)' : 'var(--muted)',
                background: client.plan === 'elite' ? 'rgba(255,173,0,.1)' : 'var(--s4)',
                border: `1px solid ${client.plan === 'elite' ? 'rgba(255,173,0,.3)' : 'var(--border)'}`,
                borderRadius: 4, padding: '2px 7px',
              }}>
                {(client.plan || 'standard').toUpperCase()}
              </span>
              {goal && (
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5,
                  color: goal.color, background: `${goal.color}12`,
                  border: `1px solid ${goal.color}30`, borderRadius: 4, padding: '2px 7px',
                }}>
                  {goal.icon} {goal.label.toUpperCase()}
                </span>
              )}
              {isWeek1 && !programme && (
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5,
                  color: 'var(--accent)', background: 'var(--accent-dim)',
                  border: '1px solid var(--border-accent)', borderRadius: 4, padding: '2px 7px',
                }}>
                  NEEDS PROGRAMME
                </span>
              )}
              {isWeek1 && programme && (
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5,
                  color: '#f472b6', background: 'rgba(244,114,182,.1)',
                  border: '1px solid rgba(244,114,182,.3)', borderRadius: 4, padding: '2px 7px',
                }}>
                  WK 1 — ASSESSMENT
                </span>
              )}
            </div>
          </div>

          {/* Monthly price */}
          {client.monthly_price > 0 && (
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--accent)' }}>
                £{client.monthly_price}
              </div>
              <div style={{ fontSize: 9, color: 'var(--muted)' }}>/mo</div>
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'Weight',    value: weight ? `${weight}kg` : '—',          color: 'var(--white)' },
            { label: 'Body Fat',  value: bf ? `${bf}%` : '—',                   color: bf ? (bf < 20 ? 'var(--accent)' : bf < 28 ? 'var(--warn)' : 'var(--danger)') : 'var(--muted)' },
            { label: 'Lean Mass', value: leanMass ? `${leanMass}kg` : '—',      color: 'var(--accent)' },
            { label: 'Target',    value: p.target_weight ? `${p.target_weight}kg` : '—', color: 'var(--muted)' },
          ].map(s => (
            <div key={s.label} style={{ padding: '7px 8px', background: 'var(--s4)', borderRadius: 6, textAlign: 'center' }}>
              <div style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: .5, marginBottom: 2 }}>
                {s.label.toUpperCase()}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Programme row */}
        <div style={{ marginBottom: 12 }}>
          {programme ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ fontSize: 11, color: 'var(--sub)' }}>
                  {programme.name || 'Active Programme'}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: expiringWarn ? 'var(--warn)' : 'var(--muted)' }}>
                    Wk {programme.current_week}/{programme.total_weeks}
                  </span>
                  {expiringWarn && (
                    <span style={{ fontSize: 9, color: 'var(--warn)' }}>
                      ⚠ {daysUntilExpiry}d left
                    </span>
                  )}
                </div>
              </div>
              <div style={{ height: 4, background: 'var(--s5)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${progPct}%`, borderRadius: 2,
                  background: 'linear-gradient(90deg,var(--accent),var(--accent-hi))',
                  boxShadow: '0 0 6px rgba(0,200,150,.3)',
                }} />
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>No programme assigned</div>
          )}
        </div>

        {/* Check-in + assessment row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {/* Check-in status */}
          <div style={{
            flex: 1, padding: '8px 10px', borderRadius: 6,
            background: checkInUrgent ? 'rgba(255,68,68,.08)' : needsReply ? 'rgba(255,173,0,.08)' : 'var(--s4)',
            border: `1px solid ${checkInUrgent ? 'rgba(255,68,68,.25)' : needsReply ? 'rgba(255,173,0,.25)' : 'var(--border)'}`,
          }}>
            <div style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: .5, marginBottom: 3 }}>
              LAST CHECK-IN
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: checkInUrgent ? 'var(--danger)' : needsReply ? 'var(--warn)' : 'var(--sub)' }}>
              {lastCheckIn ? daysAgo(lastCheckIn.submitted_at) : 'None'}
            </div>
            {needsReply && (
              <div style={{ fontSize: 9, color: checkInUrgent ? 'var(--danger)' : 'var(--warn)', marginTop: 2 }}>
                {checkInUrgent ? '⚠ Awaiting reply' : '• Needs reply'}
              </div>
            )}
          </div>

          {/* Assessment */}
          <div style={{
            flex: 1, padding: '8px 10px', borderRadius: 6,
            background: assessment ? 'rgba(0,200,150,.05)' : 'var(--s4)',
            border: `1px solid ${assessment ? 'rgba(0,200,150,.2)' : 'var(--border)'}`,
          }}>
            <div style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: .5, marginBottom: 3 }}>
              ASSESSMENT
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: assessment ? 'var(--accent)' : 'var(--muted)' }}>
              {assessment ? daysAgo(assessment.assessed_at) : 'Not submitted'}
            </div>
            {assessment && (
              <div style={{ fontSize: 9, color: 'var(--accent)', marginTop: 2 }}>✓ Photos + FMS</div>
            )}
          </div>

          {/* Latest test */}
          <div style={{ flex: 1, padding: '8px 10px', borderRadius: 6, background: 'var(--s4)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: .5, marginBottom: 3 }}>
              LATEST TEST
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: testResult ? 'var(--info)' : 'var(--muted)' }}>
              {testResult ? (testResult.results?.vo2 ? `VO₂ ${testResult.results.vo2}` : testResult.test_type?.replace('_', ' ')) : 'None'}
            </div>
            {testResult && (
              <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>
                {daysAgo(testResult.tested_date)}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <button className="btn btn-primary btn-sm" style={{ flex: 1 }}
            onClick={() => navigate(`/coach/client/${client.client_id}`)}>
            View Profile
          </button>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}
            onClick={() => navigate('/coach/programs')}>
            Programme
          </button>
          <button
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 10 }}
            onClick={() => {
              sendWelcome({ clientId: client.client_id, coachId })
                .then(() => alert('Welcome email sent!'))
            }}
            title="Send welcome email"
          >
            📧 WELCOME
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}
            onClick={() => navigate('/coach/checkins')}>
            Check-Ins {needsReply ? '●' : ''}
          </button>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}
            onClick={() => navigate('/coach/assessment')}>
            Assessment
          </button>
          <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}
            onClick={() => navigate('/coach/testing')}>
            Testing
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── main dashboard ───────────────────────────────────────────────────────────

// ─── invite modal ─────────────────────────────────────────────────────────────

function InviteClientModal({ onClose }) {
  const { user } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email,    setEmail]    = useState('')
  const [sending,  setSending]  = useState(false)
  const [sent,     setSent]     = useState(false)
  const [error,    setError]    = useState(null)

  async function handleSend() {
    if (!fullName.trim() || !email.trim()) { setError('Please fill in both fields.'); return }
    setSending(true)
    setError(null)

    try {
      // Use Supabase's built-in magic-link flow — no Express server required.
      // The coach_id + full_name go into user_metadata so Onboarding can
      // auto-link the client when they complete registration.
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/onboarding`,
          data: {
            full_name:  fullName.trim(),
            coach_id:   user?.id,
            invited:    true,
          },
        },
      })

      if (otpError) {
        setError(otpError.message)
      } else {
        setSent(true)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    }

    setSending(false)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(6,6,8,0.8)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--s2)', border: '1px solid var(--border)',
        borderRadius: 12, padding: 32, width: '100%', maxWidth: 440,
      }} onClick={e => e.stopPropagation()}>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 2, color: 'var(--accent)', marginBottom: 8 }}>INVITE SENT</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--white)' }}>{fullName}</strong> will receive an email at <strong style={{ color: 'var(--white)' }}>{email}</strong> with a link to set up their account and complete onboarding.
            </p>
            <button className="btn btn-primary" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 2, color: 'var(--white)', marginBottom: 4 }}>ADD NEW CLIENT</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>They'll receive an invite email with a link to set up their account and start onboarding.</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 6 }}>FULL NAME</label>
                <input
                  className="input"
                  placeholder="e.g. Sarah Johnson"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  autoFocus
                />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 6 }}>EMAIL ADDRESS</label>
                <input
                  className="input"
                  type="email"
                  placeholder="sarah@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
              </div>
            </div>

            {error && (
              <div style={{ background: 'var(--danger-dim)', border: '1px solid var(--danger)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--danger)', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onClose} disabled={sending}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleSend} disabled={sending || !fullName || !email}>
                {sending ? 'Sending…' : 'Send Invite'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function CoachDashboard() {
  const { user } = useAuth()
  const { clients, activeClients, pendingCheckIns, overdueCheckIns, loading } = useCoach()
  const navigate  = useNavigate()

  const [programmes,   setProgrammes]   = useState([])
  const [checkIns,     setCheckIns]     = useState([])
  const [assessments,  setAssessments]  = useState([])
  const [testResults,  setTestResults]  = useState([])
  const [dataLoading,  setDataLoading]  = useState(true)
  const [filter,       setFilter]       = useState('all') // all | needs_reply | week1 | no_programme
  const [showInvite,   setShowInvite]   = useState(false)

  useEffect(() => {
    if (!clients?.length) { setDataLoading(false); return }
    const ids = clients.map(c => c.client_id).filter(Boolean)
    if (!ids.length) { setDataLoading(false); return }

    setDataLoading(true)
    Promise.all([
      supabase.from('programs').select('id,client_id,name,current_week,total_weeks,end_date,status').in('client_id', ids).eq('status', 'active'),
      supabase.from('check_ins').select('client_id,week_number,submitted_at,coach_reply,body_weight_kg').in('client_id', ids).order('submitted_at', { ascending: false }),
      supabase.from('client_assessments').select('client_id,assessed_at').in('client_id', ids).order('assessed_at', { ascending: false }),
      supabase.from('test_results').select('client_id,test_type,tested_date,results').in('client_id', ids).order('tested_date', { ascending: false }),
    ]).then(([prog, ci, assess, tests]) => {
      setProgrammes(prog.data  || [])
      setCheckIns(ci.data      || [])
      setAssessments(assess.data || [])
      setTestResults(tests.data  || [])
      setDataLoading(false)
    })
  }, [clients])

  if (loading || dataLoading) return <div className="loading-overlay"><div className="spinner" /></div>

  // ── build per-client lookup maps ──────────────────────────────────────────

  const progMap       = {}
  programmes.forEach(p => { if (!progMap[p.client_id]) progMap[p.client_id] = p })

  const checkInMap    = {}
  checkIns.forEach(ci => { if (!checkInMap[ci.client_id]) checkInMap[ci.client_id] = ci })

  const assessMap     = {}
  assessments.forEach(a => { if (!assessMap[a.client_id]) assessMap[a.client_id] = a })

  const testMap       = {}
  testResults.forEach(t => { if (!testMap[t.client_id]) testMap[t.client_id] = t })

  // ── computed stats ────────────────────────────────────────────────────────

  const mrr            = activeClients.reduce((s, c) => s + (c.monthly_price || 0), 0)
  const week1Clients   = clients.filter(c => !progMap[c.client_id] || progMap[c.client_id]?.current_week === 1)
  const noProg         = clients.filter(c => !progMap[c.client_id])
  const noAssessment   = clients.filter(c => !assessMap[c.client_id])
  const expiringProgs  = programmes.filter(p => {
    if (!p.end_date) return false
    const d = Math.ceil((new Date(p.end_date) - Date.now()) / (1000 * 60 * 60 * 24))
    return d >= 0 && d <= 14
  })
  const needsReplyClients = clients.filter(c => {
    const ci = checkInMap[c.client_id]
    return ci && !ci.coach_reply
  })

  // ── filtered client list ──────────────────────────────────────────────────

  const filteredClients = clients.filter(c => {
    if (filter === 'needs_reply')   return needsReplyClients.some(x => x.client_id === c.client_id)
    if (filter === 'week1')         return week1Clients.some(x => x.client_id === c.client_id)
    if (filter === 'no_programme')  return noProg.some(x => x.client_id === c.client_id)
    return true
  })

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div>
      {showInvite && <InviteClientModal onClose={() => setShowInvite(false)} />}

      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">Coach Dashboard</div>
          <div className="page-subtitle">{today}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            className="btn btn-primary"
            style={{ fontSize: 11, padding: '7px 16px', letterSpacing: 1 }}
            onClick={() => setShowInvite(true)}
          >
            + Add Client
          </button>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1.5,
            color: 'var(--accent)', background: 'var(--accent-dim)',
            border: '1px solid var(--border-accent)', borderRadius: 6, padding: '6px 14px',
          }}>
            £{mrr.toLocaleString()} MRR
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-grid section-gap">
        <Stat label="Active Clients"     value={activeClients.length}         sub="On active plan" />
        <Stat label="Pending Check-Ins"  value={pendingCheckIns.length}       sub="Awaiting reply"
          color={pendingCheckIns.length > 0 ? 'var(--warn)' : 'var(--white)'}
          onClick={() => navigate('/coach/checkins')} />
        <Stat label="Overdue > 48hrs"    value={overdueCheckIns.length}       sub="Needs attention"
          color={overdueCheckIns.length > 0 ? 'var(--danger)' : 'var(--white)'}
          onClick={() => navigate('/coach/checkins')} />
        <Stat label="Week 1 Clients"     value={week1Clients.length}          sub="In assessment week"
          color={week1Clients.length > 0 ? '#f472b6' : 'var(--white)'} />
        <Stat label="No Programme"       value={noProg.length}                sub="Needs assigning"
          color={noProg.length > 0 ? 'var(--warn)' : 'var(--white)'}
          onClick={() => navigate('/coach/programs')} />
        <Stat label="Expiring Soon"      value={expiringProgs.length}         sub="Within 14 days"
          color={expiringProgs.length > 0 ? 'var(--warn)' : 'var(--white)'}
          onClick={() => navigate('/coach/programs')} />
        <Stat label="No Assessment"      value={noAssessment.length}          sub="Onboarding incomplete"
          color={noAssessment.length > 0 ? 'var(--muted)' : 'var(--white)'} />
        <Stat label="Total Clients"      value={clients.length}               sub="All time" />
      </div>

      {/* Action alerts */}
      {(overdueCheckIns.length > 0 || noProg.length > 0 || expiringProgs.length > 0) && (
        <div className="section-gap">
          {overdueCheckIns.length > 0 && (
            <Alert type="danger" icon="⚠️"
              message={`${overdueCheckIns.length} check-in${overdueCheckIns.length > 1 ? 's' : ''} waiting more than 48 hours for a reply`}
              action="Reply now" onAction={() => navigate('/coach/checkins')} />
          )}
          {noProg.length > 0 && (
            <Alert type="warn" icon="📋"
              message={`${noProg.length} client${noProg.length > 1 ? 's' : ''} ${noProg.length > 1 ? 'have' : 'has'} no programme assigned`}
              action="Assign" onAction={() => navigate('/coach/programs')} />
          )}
          {expiringProgs.length > 0 && (
            <Alert type="warn" icon="⏳"
              message={`${expiringProgs.length} programme${expiringProgs.length > 1 ? 's' : ''} expiring within 14 days`}
              action="Review" onAction={() => navigate('/coach/programs')} />
          )}
          {week1Clients.length > 0 && (
            <Alert type="info" icon="🔬"
              message={`${week1Clients.length} client${week1Clients.length > 1 ? 's' : ''} in Week 1 assessment protocol — review their FMS and test results`}
              action="View assessments" onAction={() => navigate('/coach/assessment')} />
          )}
        </div>
      )}

      {/* Filter bar + client grid */}
      <div className="section-gap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--white)', letterSpacing: 1 }}>
            CLIENT ROSTER
            <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 8, fontFamily: 'var(--font-body)' }}>
              {filteredClients.length} {filter !== 'all' ? 'filtered' : 'total'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'all',           label: 'All' },
              { id: 'needs_reply',   label: `Needs Reply${needsReplyClients.length ? ` (${needsReplyClients.length})` : ''}` },
              { id: 'week1',         label: `Week 1${week1Clients.length ? ` (${week1Clients.length})` : ''}` },
              { id: 'no_programme',  label: `No Programme${noProg.length ? ` (${noProg.length})` : ''}` },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5,
                padding: '5px 12px', borderRadius: 5, cursor: 'pointer',
                background: filter === f.id ? 'linear-gradient(135deg,var(--accent),var(--accent-hi))' : 'var(--s3)',
                color: filter === f.id ? 'var(--ink)' : 'var(--muted)',
                border: `1px solid ${filter === f.id ? 'var(--accent)' : 'var(--border)'}`,
              }}>
                {f.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <div className="empty-state" style={{ height: 180 }}>
            <div className="empty-state-title">
              {clients.length === 0 ? 'No clients yet' : 'No clients match this filter'}
            </div>
            <div className="empty-state-text">
              {clients.length === 0
                ? 'Clients will appear here once they sign up and are linked to your account.'
                : 'Try switching to "All" to see your full roster.'}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(360px,1fr))', gap: 16 }}>
            {filteredClients.map(client => (
              <ClientCard
                key={client.id}
                client={client}
                programme={progMap[client.client_id]}
                lastCheckIn={checkInMap[client.client_id]}
                assessment={assessMap[client.client_id]}
                testResult={testMap[client.client_id]}
                navigate={navigate}
                coachId={user?.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Expiring programmes detail */}
      {expiringProgs.length > 0 && (
        <div className="card section-gap">
          <div className="card-header" style={{ marginBottom: 14 }}>
            <div className="card-title">Expiring Programmes</div>
            <span className="tag tag-warn">{expiringProgs.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {expiringProgs.map(p => {
              const daysLeft = Math.ceil((new Date(p.end_date) - Date.now()) / (1000 * 60 * 60 * 24))
              const client   = clients.find(c => c.client_id === p.client_id)
              return (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 14px', background: 'var(--s3)',
                  borderRadius: 8, border: '1px solid var(--border)',
                  borderLeft: `3px solid ${daysLeft <= 7 ? 'var(--danger)' : 'var(--warn)'}`,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--white)' }}>
                      {client?.profile?.full_name || 'Unknown'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{p.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: daysLeft <= 7 ? 'var(--danger)' : 'var(--warn)' }}>
                      {daysLeft}d left
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>Wk {p.current_week}/{p.total_weeks}</div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/coach/programs')}>
                    Renew →
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
