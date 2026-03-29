import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import {
  getCoachClientProfile,
  getClientAllPrograms,
  getClientCheckIns,
  getMeasurements,
  replyToCheckIn,
} from '../../lib/supabase.js'
import { navalBF, leanMass, estimateTDEE } from '../../lib/calculators.js'
import BWChart from '../shared/BWChart.jsx'
import CoachNutritionPanel from './CoachNutritionPanel.jsx'

// ─── helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ['#00C896','#f472b6','#60a5fa','#f59e0b','#8b5cf6','#ef4444','#10b981']
function avatarColor(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}
function initials(name = '') {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}
function fmt(dateStr, opts = { day: 'numeric', month: 'short', year: 'numeric' }) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', opts)
}
function daysAgo(dateStr) {
  if (!dateStr) return null
  const d = Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24))
  if (d === 0) return 'Today'
  if (d === 1) return 'Yesterday'
  return `${d}d ago`
}
function calcAge(dob) {
  if (!dob) return null
  const b = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - b.getFullYear()
  if (now < new Date(now.getFullYear(), b.getMonth(), b.getDate())) age--
  return age
}

const GOAL_CONFIG = {
  cut:      { label: 'Fat Loss',   color: '#f472b6', icon: '🔥' },
  gain:     { label: 'Muscle',     color: 'var(--accent)', icon: '💪' },
  recomp:   { label: 'Recomp',     color: 'var(--info)',   icon: '⚖️' },
  maintain: { label: 'Maintain',   color: 'var(--warn)',   icon: '🏃' },
}

const SESSION_TYPE_META = {
  strength: { label: 'Strength',   icon: '💪', color: 'var(--accent)' },
  emom:     { label: 'EMOM',       icon: '⏱️', color: 'var(--purple)' },
  amrap:    { label: 'AMRAP',      icon: '🔄', color: 'var(--info)'   },
  for_time: { label: 'For Time',   icon: '⏩', color: 'var(--warn)'   },
  hyrox:    { label: 'HYROX',      icon: '🏃', color: '#f472b6'       },
  mixed:    { label: 'Mixed',      icon: '🔀', color: 'var(--danger)' },
}

const SCORE_COLOR = v => v >= 4 ? 'var(--accent)' : v <= 2 ? 'var(--danger)' : 'var(--warn)'

// ─── sub-components ───────────────────────────────────────────────────────────

function StatPill({ label, value, color = 'var(--white)', sub }) {
  return (
    <div style={{
      background: '#ffffff', border: '1px solid var(--border)',
      borderRadius: 10, padding: '12px 16px',
      boxShadow: '0 1px 3px rgba(0,0,0,.05)',
      minWidth: 100,
    }}>
      <div className="label" style={{ marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

function ScoreDot({ value }) {
  if (!value) return <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 22, height: 22, borderRadius: 4,
      background: `${SCORE_COLOR(value)}18`,
      border: `1px solid ${SCORE_COLOR(value)}44`,
      fontFamily: 'var(--font-display)', fontSize: 12,
      color: SCORE_COLOR(value),
    }}>{value}</span>
  )
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────

function OverviewTab({ profile, programs, checkIns, measurements }) {
  const activeProgram = programs.find(p => p.is_active) || programs[0]
  const latestWeight = measurements[0]?.body_weight_kg
    || checkIns[0]?.body_weight_kg
    || null

  const bf = profile?.gender && profile?.waist_cm && profile?.neck_cm && profile?.height_cm
    ? navalBF(profile.gender, profile.waist_cm, profile.neck_cm, profile.height_cm, profile.hips_cm)
    : null

  const lean = bf && latestWeight ? leanMass(latestWeight, bf) : null
  const fat  = bf && latestWeight ? Math.round((latestWeight - lean) * 10) / 10 : null

  const goalConf = GOAL_CONFIG[activeProgram?.goal_type || profile?.goal_type] || GOAL_CONFIG.maintain
  const age = calcAge(profile?.date_of_birth)

  // Completed vs total sessions
  const allSessions = programs.flatMap(p => p.sessions || [])
  const completedSessions = allSessions.filter(s => s.is_completed)
  const lastSession = completedSessions.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))[0]
  const lastCheckIn = checkIns[0]

  return (
    <div>
      {/* ── Body profile ─────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="label" style={{ marginBottom: 12 }}>Body Profile</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <StatPill label="Weight" value={latestWeight ? `${latestWeight} kg` : '—'} color="var(--white)" />
          <StatPill label="Target" value={activeProgram?.target_weight ? `${activeProgram.target_weight} kg` : '—'} color="var(--accent)" />
          <StatPill label="Body Fat" value={bf ? `${bf}%` : '—'} color="var(--info)"
            sub={bf ? (profile.gender === 'male'
              ? (bf < 10 ? 'Athletic' : bf < 15 ? 'Fit' : bf < 20 ? 'Average' : 'High')
              : (bf < 18 ? 'Athletic' : bf < 24 ? 'Fit' : bf < 30 ? 'Average' : 'High')) : null}
          />
          <StatPill label="Lean Mass" value={lean ? `${lean} kg` : '—'} color="var(--purple)" />
          <StatPill label="Fat Mass" value={fat ? `${fat} kg` : '—'} color="#f472b6" />
          {age && <StatPill label="Age" value={age} />}
          {profile?.height_cm && <StatPill label="Height" value={`${profile.height_cm} cm`} />}
        </div>

        {/* Onboarding measurements */}
        {(profile?.waist_cm || profile?.hip_cm || profile?.neck_cm) && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {profile.neck_cm  && <div><div className="label">Neck</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>{profile.neck_cm} cm</div></div>}
            {profile.waist_cm && <div><div className="label">Waist</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>{profile.waist_cm} cm</div></div>}
            {profile.hips_cm  && <div><div className="label">Hips</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>{profile.hips_cm} cm</div></div>}
            {profile.activity_level && <div><div className="label">Activity</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 14, textTransform: 'capitalize' }}>{profile.activity_level}</div></div>}
          </div>
        )}
      </div>

      {/* ── Programme ────────────────────────────────────── */}
      {activeProgram ? (
        <div className="card card-accent" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>Active Programme</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)', letterSpacing: 1 }}>{activeProgram.name}</div>
              {activeProgram.phase && (
                <span style={{
                  display: 'inline-block', marginTop: 4,
                  fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5,
                  color: 'var(--accent)', background: 'var(--accent-dim)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: 4, padding: '2px 7px',
                }}>{activeProgram.phase}</span>
              )}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--accent)' }}>
                {activeProgram.current_week}<span style={{ fontSize: 14, color: 'var(--muted)' }}>/{activeProgram.total_weeks}</span>
              </div>
              <div className="label">Week</div>
            </div>
          </div>

          {/* Goal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span>{goalConf.icon}</span>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5,
              color: goalConf.color, background: `${goalConf.color}18`,
              border: `1px solid ${goalConf.color}33`,
              borderRadius: 4, padding: '2px 8px',
            }}>{goalConf.label}</span>
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ height: 5, background: 'var(--s4)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.round((activeProgram.current_week / activeProgram.total_weeks) * 100)}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--accent-hi))',
                borderRadius: 3, transition: 'width .5s ease',
                boxShadow: '0 0 6px rgba(0,200,150,.4)',
              }} />
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
              {activeProgram.total_weeks - activeProgram.current_week} weeks remaining
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 16, textAlign: 'center', padding: '24px' }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>📋</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)', letterSpacing: 1 }}>No Active Programme</div>
        </div>
      )}

      {/* ── Activity summary ──────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="card">
          <div className="label" style={{ marginBottom: 8 }}>Last Check-In</div>
          {lastCheckIn ? (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)' }}>
                {daysAgo(lastCheckIn.submitted_at)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                {fmt(lastCheckIn.submitted_at, { day: 'numeric', month: 'short' })} · W{lastCheckIn.week_number}
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <ScoreDot value={lastCheckIn.training_score} />
                <ScoreDot value={lastCheckIn.nutrition_score} />
                <ScoreDot value={lastCheckIn.mood_score} />
              </div>
              {!lastCheckIn.coach_reply && (
                <div style={{ marginTop: 8, fontSize: 10, color: 'var(--warn)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>⚠ AWAITING REPLY</div>
              )}
            </>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>No check-ins yet</div>
          )}
        </div>

        <div className="card">
          <div className="label" style={{ marginBottom: 8 }}>Last Session</div>
          {lastSession ? (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)' }}>
                {daysAgo(lastSession.completed_at)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                {lastSession.day_label || 'Session'} · W{lastSession.week_number}
              </div>
              <div style={{ marginTop: 6 }}>
                {(() => {
                  const m = SESSION_TYPE_META[lastSession.session_type || 'strength']
                  return (
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5,
                      color: m.color, background: `${m.color}18`,
                      border: `1px solid ${m.color}44`,
                      borderRadius: 4, padding: '2px 7px',
                    }}>{m.icon} {m.label}</span>
                  )
                })()}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>No sessions completed</div>
          )}
        </div>

        <div className="card">
          <div className="label" style={{ marginBottom: 8 }}>Sessions Completed</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--accent)' }}>
            {completedSessions.length}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>of {allSessions.length} total</div>
        </div>

        <div className="card">
          <div className="label" style={{ marginBottom: 8 }}>Check-Ins Total</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--accent)' }}>
            {checkIns.length}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            {checkIns.filter(c => c.coach_reply).length} replied
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── CHECK-INS TAB ────────────────────────────────────────────────────────────

function CheckInsTab({ checkIns, onReplied }) {
  const [expanded, setExpanded] = useState(checkIns[0]?.id || null)
  const [replies, setReplies] = useState({})
  const [saving, setSaving] = useState(null)

  async function sendReply(ci) {
    const text = replies[ci.id]?.trim()
    if (!text) return
    setSaving(ci.id)
    const { error } = await replyToCheckIn(ci.id, text)
    setSaving(null)
    if (!error) onReplied(ci.id, text)
  }

  if (!checkIns.length) return (
    <div className="empty-state" style={{ height: 280 }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
      <div className="empty-state-title">No check-ins yet</div>
    </div>
  )

  return (
    <div>
      {checkIns.map(ci => {
        const isOpen = expanded === ci.id
        const replied = !!ci.coach_reply
        const days = Math.floor((Date.now() - new Date(ci.submitted_at)) / 864e5)
        const urgent = !replied && days >= 2

        return (
          <div
            key={ci.id}
            className={`card ${urgent ? 'card-danger' : replied ? '' : 'card-warn'}`}
            style={{ marginBottom: 10 }}
          >
            {/* Header */}
            <button
              onClick={() => setExpanded(isOpen ? null : ci.id)}
              style={{
                width: '100%', background: 'none', border: 'none',
                cursor: 'pointer', textAlign: 'left', padding: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--white)' }}>
                      Week {ci.week_number}
                    </span>
                    {replied
                      ? <span className="tag tag-accent">Replied</span>
                      : urgent
                        ? <span className="tag tag-danger">Overdue</span>
                        : <span className="tag tag-warn">Pending</span>
                    }
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    {fmt(ci.submitted_at, { weekday: 'long', day: 'numeric', month: 'long' })}
                    {days > 0 && ` · ${days}d ago`}
                  </div>
                </div>

                {/* Score row */}
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <ScoreDot value={ci.training_score} />
                  <ScoreDot value={ci.nutrition_score} />
                  <ScoreDot value={ci.mood_score} />
                </div>

                {/* Chevron */}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{ color: 'var(--muted)', flexShrink: 0, transition: 'transform .2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            {/* Expanded body */}
            {isOpen && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                {/* Quick stats */}
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 12 }}>
                  {ci.body_weight_kg && (
                    <div>
                      <div className="label">Weight</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>{ci.body_weight_kg} kg</div>
                    </div>
                  )}
                  {ci.sleep_hrs && (
                    <div>
                      <div className="label">Sleep</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>{ci.sleep_hrs}h</div>
                    </div>
                  )}
                  <div>
                    <div className="label">Training</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: SCORE_COLOR(ci.training_score) }}>{ci.training_score}/5</div>
                  </div>
                  <div>
                    <div className="label">Nutrition</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: SCORE_COLOR(ci.nutrition_score) }}>{ci.nutrition_score}/5</div>
                  </div>
                  <div>
                    <div className="label">Mood</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: SCORE_COLOR(ci.mood_score) }}>{ci.mood_score}/5</div>
                  </div>
                </div>

                {/* Client note */}
                {ci.client_note && (
                  <div style={{
                    background: 'var(--s3)', border: '1px solid var(--border)',
                    borderLeft: '3px solid var(--info)',
                    borderRadius: 6, padding: '10px 12px',
                    marginBottom: 12, fontSize: 13, color: 'var(--white)', lineHeight: 1.65,
                  }}>
                    <div className="label" style={{ marginBottom: 4 }}>Client Note</div>
                    "{ci.client_note}"
                  </div>
                )}

                {/* Progress photos */}
                {ci.photos && Object.keys(ci.photos).length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div className="label" style={{ marginBottom: 8 }}>Progress Photos</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {Object.entries(ci.photos).map(([pos, url]) => url && (
                        <a key={pos} href={url} target="_blank" rel="noopener noreferrer"
                          style={{ textDecoration: 'none' }}>
                          <img
                            src={url} alt={pos}
                            style={{
                              width: 72, height: 96, objectFit: 'cover',
                              borderRadius: 6, border: '1px solid var(--border)',
                            }}
                          />
                          <div className="label" style={{ textAlign: 'center', marginTop: 2 }}>{pos}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reply */}
                {replied ? (
                  <div style={{
                    background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
                    borderRadius: 6, padding: '10px 12px',
                    fontSize: 13, color: 'var(--white)', lineHeight: 1.65,
                  }}>
                    <div className="label" style={{ marginBottom: 4, color: 'var(--accent)' }}>Your Reply</div>
                    {ci.coach_reply}
                  </div>
                ) : (
                  <div>
                    <textarea
                      className="input"
                      rows={3}
                      placeholder="Write your reply to the client..."
                      value={replies[ci.id] || ''}
                      onChange={e => setReplies(r => ({ ...r, [ci.id]: e.target.value }))}
                      style={{ marginBottom: 8 }}
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => sendReply(ci)}
                      disabled={saving === ci.id || !replies[ci.id]?.trim()}
                    >
                      {saving === ci.id ? '…' : 'SEND REPLY'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── PROGRESS TAB ─────────────────────────────────────────────────────────────

function ProgressTab({ checkIns, measurements, profile }) {
  // Combine measurement entries + check-in weights for chart
  const weightEntries = [
    ...measurements.map(m => ({ date: m.measured_date, body_weight_kg: m.body_weight_kg })),
    ...checkIns.filter(ci => ci.body_weight_kg).map(ci => ({
      date: ci.submitted_at?.split('T')[0],
      body_weight_kg: ci.body_weight_kg,
    })),
  ].sort((a, b) => new Date(a.date) - new Date(b.date))

  // Unique weeks that have photos
  const weeksWithPhotos = checkIns
    .filter(ci => ci.photos && Object.keys(ci.photos).some(k => ci.photos[k]))
    .sort((a, b) => a.week_number - b.week_number)

  return (
    <div>
      <BWChart entries={weightEntries} targetWeight={profile?.target_weight} height={220} />

      {/* Measurements table */}
      {measurements.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="label" style={{ marginBottom: 12 }}>Measurement History</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Date','Weight','BF%','Lean','Fat','Waist'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '6px 10px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5, color: 'var(--muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {measurements.slice(0, 15).map((m, i) => {
                  const bf = m.body_fat_pct || (profile?.gender && m.waist_cm && profile?.neck_cm && m.height_cm
                    ? navalBF(profile.gender, m.waist_cm, profile.neck_cm, m.height_cm, m.hips_cm)
                    : null)
                  const lean = bf && m.body_weight_kg ? leanMass(m.body_weight_kg, bf) : null
                  const fat = lean && m.body_weight_kg ? Math.round((m.body_weight_kg - lean) * 10) / 10 : null
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)', color: i === 0 ? 'var(--white)' : 'var(--sub)' }}>
                      <td style={{ padding: '8px 10px' }}>{fmt(m.measured_date, { day: 'numeric', month: 'short' })}</td>
                      <td style={{ padding: '8px 10px', fontFamily: 'var(--font-display)' }}>{m.body_weight_kg ? `${m.body_weight_kg} kg` : '—'}</td>
                      <td style={{ padding: '8px 10px', color: bf ? 'var(--info)' : 'var(--muted)' }}>{bf ? `${bf}%` : '—'}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--purple)' }}>{lean ? `${lean} kg` : '—'}</td>
                      <td style={{ padding: '8px 10px', color: '#f472b6' }}>{fat ? `${fat} kg` : '—'}</td>
                      <td style={{ padding: '8px 10px' }}>{m.waist_cm ? `${m.waist_cm} cm` : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Progress photo timeline */}
      {weeksWithPhotos.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="label" style={{ marginBottom: 12 }}>Photo Timeline</div>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {weeksWithPhotos.map(ci => (
              <div key={ci.id} style={{ flexShrink: 0, textAlign: 'center' }}>
                <div className="label" style={{ marginBottom: 6 }}>Week {ci.week_number}</div>
                {ci.photos?.front
                  ? <a href={ci.photos.front} target="_blank" rel="noopener noreferrer">
                      <img src={ci.photos.front} alt="front"
                        style={{ width: 72, height: 96, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)', display: 'block' }} />
                    </a>
                  : <div style={{ width: 72, height: 96, borderRadius: 6, background: 'var(--s3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--muted)' }}>No photo</div>
                }
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
                  {fmt(ci.submitted_at, { day: 'numeric', month: 'short' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!weightEntries.length && !weeksWithPhotos.length && (
        <div className="empty-state" style={{ height: 200, marginTop: 16 }}>
          <div className="empty-state-title">No Progress Data Yet</div>
          <div className="empty-state-text">Data appears here as the client logs weight and uploads photos.</div>
        </div>
      )}
    </div>
  )
}

// ─── TRAINING TAB ─────────────────────────────────────────────────────────────

function TrainingTab({ programs }) {
  const allCompleted = programs
    .flatMap(p => (p.sessions || []).map(s => ({ ...s, program_name: p.name })))
    .filter(s => s.is_completed)
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))

  if (!allCompleted.length) return (
    <div className="empty-state" style={{ height: 280 }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>🏋️</div>
      <div className="empty-state-title">No Sessions Completed</div>
      <div className="empty-state-text">Completed sessions will appear here.</div>
    </div>
  )

  // Group by week
  const byWeek = {}
  allCompleted.forEach(s => {
    const key = `${s.program_name} · W${s.week_number}`
    if (!byWeek[key]) byWeek[key] = []
    byWeek[key].push(s)
  })

  return (
    <div>
      {Object.entries(byWeek).map(([weekLabel, sessions]) => (
        <div key={weekLabel} style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 2, color: 'var(--muted)', marginBottom: 8 }}>
            {weekLabel}
          </div>
          {sessions.map(s => {
            const meta = SESSION_TYPE_META[s.session_type || 'strength']
            return (
              <div key={s.id} className="card" style={{ marginBottom: 8, padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{meta.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--white)', letterSpacing: 0.5 }}>
                        {s.day_label || 'Session'}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-display)', fontSize: 7, letterSpacing: 1.5,
                        color: meta.color, background: `${meta.color}18`,
                        border: `1px solid ${meta.color}44`,
                        borderRadius: 3, padding: '2px 6px',
                      }}>{meta.label}</span>
                    </div>
                    {s.exercises?.length > 0 && (
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                        {s.exercises.slice(0, 3).map(e => e.name).join(' · ')}
                        {s.exercises.length > 3 && ` +${s.exercises.length - 3} more`}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>✓ DONE</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                      {fmt(s.completed_at, { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

const TABS = ['Overview', 'Check-ins', 'Progress', 'Training', 'Nutrition']

export default function ClientProfile() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const { profile: coachProfile } = useAuth()
  const [tab, setTab] = useState('Overview')
  const [profile, setProfile] = useState(null)
  const [programs, setPrograms] = useState([])
  const [checkIns, setCheckIns] = useState([])
  const [measurements, setMeasurements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!clientId) return
    load()
  }, [clientId])

  async function load() {
    setLoading(true)
    const [profileRes, programsRes, checkInsRes, measurementsRes] = await Promise.all([
      getCoachClientProfile(clientId),
      getClientAllPrograms(clientId),
      getClientCheckIns(clientId, 52),
      getMeasurements(clientId, 30),
    ])
    setProfile(profileRes.data)
    setPrograms(programsRes.data || [])
    setCheckIns(checkInsRes.data || [])
    setMeasurements(measurementsRes.data || [])
    setLoading(false)
  }

  function handleReplied(checkInId, text) {
    setCheckIns(prev => prev.map(ci =>
      ci.id === checkInId ? { ...ci, coach_reply: text, replied_at: new Date().toISOString() } : ci
    ))
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div className="spinner" />
    </div>
  )

  if (!profile) return (
    <div className="empty-state" style={{ height: '60vh' }}>
      <div className="empty-state-title">Client not found</div>
    </div>
  )

  const color = avatarColor(profile.full_name)
  const activeProgram = programs.find(p => p.is_active) || programs[0]
  const pendingCheckIns = checkIns.filter(ci => !ci.coach_reply).length

  return (
    <div>
      {/* ── Page header ──────────────────────────────────── */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => navigate('/coach/dashboard')}
            style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: 'var(--s3)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--muted)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Avatar */}
          <div style={{
            width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
            background: `${color}22`, border: `2px solid ${color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 16, color,
          }}>
            {initials(profile.full_name)}
          </div>

          <div>
            <div className="page-title" style={{ fontSize: 24, marginBottom: 0 }}>{profile.full_name}</div>
            <div className="page-subtitle" style={{ marginTop: 2 }}>
              {activeProgram
                ? `${activeProgram.name} · Week ${activeProgram.current_week}/${activeProgram.total_weeks}`
                : 'No active programme'}
              {pendingCheckIns > 0 && (
                <span style={{
                  marginLeft: 8, fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5,
                  color: 'var(--warn)', background: 'rgba(217,119,6,.1)',
                  border: '1px solid rgba(217,119,6,.3)', borderRadius: 4, padding: '2px 7px',
                }}>
                  {pendingCheckIns} PENDING
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────── */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {TABS.map(t => (
          <div
            key={t}
            className={`tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
            {t === 'Check-ins' && pendingCheckIns > 0 && (
              <span style={{
                marginLeft: 6,
                background: 'var(--warn)', color: '#fff',
                borderRadius: 10, fontSize: 9, padding: '1px 5px',
                fontFamily: 'var(--font-display)',
              }}>
                {pendingCheckIns}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ── Tab content ──────────────────────────────────── */}
      {tab === 'Overview'   && <OverviewTab  profile={profile} programs={programs} checkIns={checkIns} measurements={measurements} />}
      {tab === 'Check-ins'  && <CheckInsTab  checkIns={checkIns} onReplied={handleReplied} />}
      {tab === 'Progress'   && <ProgressTab  checkIns={checkIns} measurements={measurements} profile={profile} />}
      {tab === 'Training'   && <TrainingTab  programs={programs} />}
      {tab === 'Nutrition'  && <CoachNutritionPanel clientId={clientId} clientProfile={profile} coachId={coachProfile?.id} onUpdated={load} />}
    </div>
  )
}
