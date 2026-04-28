import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useClient } from '../../hooks/useClient.js'
import { getMeasurements, getHabitLogsRange, supabase } from '../../lib/supabase.js'
import { navalBF, periodisedNutrition } from '../../lib/calculators.js'

// ─── Featured Content hero banner ────────────────────────────────────────────
function FeaturedContentBanner({ coachId }) {
  const [video, setVideo]       = useState(null)
  const [playing, setPlaying]   = useState(false)

  useEffect(() => {
    if (!coachId) return
    supabase.from('technique_videos')
      .select('*').eq('coach_id', coachId).eq('is_active', true)
      .order('published_at', { ascending: false }).limit(1)
      .then(({ data }) => { if (data?.[0]) setVideo(data[0]) })
  }, [coachId])

  if (!video) return null

  const m    = video.video_url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  const ytId = m ? m[1] : null
  const dateStr = new Date(video.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  return (
    <div style={{
      borderRadius: 14,
      overflow: 'hidden',
      marginBottom: 24,
      border: '1px solid rgba(0,200,150,.2)',
      boxShadow: '0 4px 24px rgba(0,0,0,.18), 0 0 0 1px rgba(0,200,150,.08)',
      position: 'relative',
    }}>

      {/* Video area */}
      {playing && ytId ? (
        <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            allowFullScreen allow="autoplay; encrypted-media"
            title={video.title}
          />
          <button
            onClick={() => setPlaying(false)}
            style={{
              position: 'absolute', top: 10, right: 10, zIndex: 2,
              background: 'rgba(0,0,0,.7)', border: 'none', borderRadius: 6,
              color: '#fff', fontFamily: 'var(--font-display)',
              fontSize: 9, letterSpacing: 1, padding: '5px 10px', cursor: 'pointer',
            }}
          >
            ✕ CLOSE
          </button>
        </div>
      ) : (
        /* Thumbnail hero */
        <div
          onClick={() => ytId && setPlaying(true)}
          style={{ position: 'relative', cursor: ytId ? 'pointer' : 'default' }}
        >
          {ytId ? (
            <img
              src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`}
              onError={e => { e.target.src = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` }}
              alt={video.title}
              style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ aspectRatio: '16/9', background: 'var(--s3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', color: 'var(--muted)', fontSize: 12, letterSpacing: 2 }}>NO VIDEO YET</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,.15) 0%, rgba(0,0,0,.0) 40%, rgba(6,6,8,.85) 100%)',
          }} />

          {/* FEATURED CONTENT label top-left */}
          <div style={{
            position: 'absolute', top: 12, left: 14,
            fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: '2px',
            color: 'var(--accent)',
            background: 'rgba(0,200,150,.15)',
            border: '1px solid rgba(0,200,150,.35)',
            borderRadius: 4, padding: '3px 9px',
            backdropFilter: 'blur(6px)',
          }}>
            FEATURED CONTENT
          </div>

          {/* Date top-right */}
          <div style={{
            position: 'absolute', top: 12, right: 14,
            fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: '1.5px',
            color: 'rgba(255,255,255,.6)',
          }}>
            {dateStr}
          </div>

          {/* Play button centred */}
          {ytId && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 0 8px rgba(0,200,150,.2), 0 4px 24px rgba(0,0,0,.5)',
                transition: 'transform .15s',
              }}>
                <svg viewBox="0 0 16 16" width="22" height="22" fill="#060608">
                  <path d="M5 3l10 5-10 5V3z"/>
                </svg>
              </div>
            </div>
          )}

          {/* Title + notes overlaid at bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 16px' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '1px',
              color: '#fff', lineHeight: 1.2, marginBottom: 4,
              textShadow: '0 1px 4px rgba(0,0,0,.6)',
            }}>
              {video.title}
            </div>
            {video.description && (
              <div style={{
                fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,.65)',
                lineHeight: 1.4,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {video.description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function getWeekRange() {
  const now  = new Date()
  const day  = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const mon  = new Date(new Date(now).setDate(diff))
  const sun  = new Date(mon); sun.setDate(sun.getDate() + 6)
  return { start: mon.toISOString().split('T')[0], end: sun.toISOString().split('T')[0] }
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function calcBF(profile) {
  if (!profile?.height_cm || !profile?.waist_cm || !profile?.neck_cm) return null
  const gender = profile.gender === 'male' ? 'male' : 'female'
  return navalBF(gender, profile.waist_cm, profile.neck_cm, profile.height_cm, profile.hips_cm)
}

function bfCategory(gender, bf) {
  if (bf === null) return { label: '—', color: 'var(--muted)' }
  if (gender === 'male') {
    if (bf < 6)  return { label: 'Essential',  color: 'var(--info)' }
    if (bf < 14) return { label: 'Athletic',   color: 'var(--accent)' }
    if (bf < 18) return { label: 'Fitness',    color: 'var(--accent)' }
    if (bf < 25) return { label: 'Average',    color: 'var(--warn)' }
    return            { label: 'High',         color: 'var(--danger)' }
  }
  if (bf < 14) return { label: 'Essential',  color: 'var(--info)' }
  if (bf < 21) return { label: 'Athletic',   color: 'var(--accent)' }
  if (bf < 25) return { label: 'Fitness',    color: 'var(--accent)' }
  if (bf < 32) return { label: 'Average',    color: 'var(--warn)' }
  return            { label: 'High',         color: 'var(--danger)' }
}

const GOAL_LABELS = {
  cut:      { label: 'Fat Loss',       color: '#f472b6', icon: '🔥' },
  gain:     { label: 'Muscle Gain',    color: 'var(--accent)', icon: '💪' },
  recomp:   { label: 'Recomposition',  color: 'var(--info)', icon: '⚖️' },
  maintain: { label: 'Maintain',       color: 'var(--warn)', icon: '🏃' },
}

// ─── cycle phase ──────────────────────────────────────────────────────────────

const PHASES = {
  menstrual:  { label: 'Menstrual',   color: '#ef4444', icon: '🔴', training: 'Lower intensity. Mobility, walks, light movement.' },
  follicular: { label: 'Follicular',  color: '#f472b6', icon: '🌸', training: 'Energy rising — good for progressive overload and new skills.' },
  ovulatory:  { label: 'Ovulatory',   color: '#f59e0b', icon: '⚡', training: 'Peak power. Schedule your hardest sessions here.' },
  luteal:     { label: 'Luteal',      color: '#8b5cf6', icon: '🌙', training: 'Early: maintain strength. Late: reduce intensity and recover well.' },
}

function getCurrentPhase(profile) {
  // We'd fetch the latest period_log — for now use a placeholder if no data
  return null
}

// ─── week 1 protocol card ─────────────────────────────────────────────────────

function Week1Card() {
  const DAYS = [
    { day: 'Day 1', focus: 'Upper + Cooper Run', items: ['Cooper 12-Min Run (VO₂ baseline)', 'Bench Press 3×AMRAP', 'Pull-Up / Max Dead-Hang hold', 'Overhead Press 3×AMRAP'] },
    { day: 'Day 2', focus: 'Lower Body',         items: ['Back Squat 3×AMRAP', 'Romanian Deadlift 3×AMRAP', 'Bulgarian Split Squat 3×/side', 'Walking Lunge 2×20m'] },
    { day: 'Day 3', focus: 'Posterior + Conditioning', items: ['Conventional Deadlift 3×AMRAP', 'Barbell Row 3×AMRAP', 'Dip 3×max', 'GBC Finisher 10 min'] },
  ]
  return (
    <div className="card" style={{ borderLeft: '3px solid var(--accent)' }}>
      <div className="card-header" style={{ marginBottom: 14 }}>
        <div>
          <div className="card-title">Week 1 — Assessment Protocol</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
            Testing week. Establish your baselines before programming begins.
          </div>
        </div>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5,
          color: 'var(--accent)', background: 'var(--accent-dim)',
          border: '1px solid var(--border-accent)', borderRadius: 4, padding: '3px 8px',
        }}>GBC FORMAT</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {DAYS.map(d => (
          <div key={d.day} style={{ padding: '12px 14px', background: 'var(--s3)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--accent)', letterSpacing: 1, marginBottom: 2 }}>{d.day}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 10 }}>{d.focus}</div>
            {d.items.map(item => (
              <div key={item} style={{ display: 'flex', gap: 6, marginBottom: 5, fontSize: 11, color: 'var(--sub)', lineHeight: 1.4 }}>
                <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>▸</span>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(0,200,150,.05)', border: '1px solid rgba(0,200,150,.15)', borderRadius: 8, fontSize: 11, color: 'var(--sub)', lineHeight: 1.7 }}>
        After Week 1, your coach uses your Cooper run distance, set logs, and FMS scores to build your personalised 6-month programme.
      </div>
    </div>
  )
}

// ─── body composition card ────────────────────────────────────────────────────

function BodyCompCard({ profile, latestWeight }) {
  const bf          = calcBF(profile)
  const bfCat       = bfCategory(profile?.gender, bf)
  const displayWeight = latestWeight || profile?.current_weight
  const leanMass    = bf && displayWeight ? Math.round((1 - bf / 100) * displayWeight * 10) / 10 : null
  const fatMass     = bf && displayWeight ? Math.round((bf / 100)     * displayWeight * 10) / 10 : null
  const goalCfg     = GOAL_LABELS[profile?.goal_type] || null
  const startW      = profile?.current_weight
  const targetW     = profile?.target_weight
  const progressPct = startW && targetW && displayWeight
    ? Math.min(100, Math.max(0, Math.round(
        ((startW - displayWeight) / (startW - targetW)) * 100
      )))
    : null

  return (
    <div className="card" style={{ borderLeft: `3px solid ${bfCat.color}` }}>
      <div className="card-header" style={{ marginBottom: 16 }}>
        <div className="card-title">Body Composition</div>
        {goalCfg && (
          <span style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5,
            color: goalCfg.color, background: `${goalCfg.color}15`,
            border: `1px solid ${goalCfg.color}33`, borderRadius: 4, padding: '3px 10px',
          }}>
            {goalCfg.icon} {goalCfg.label.toUpperCase()}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Body Weight', value: displayWeight ? `${displayWeight}` : '—', unit: 'kg', color: 'var(--white)' },
          { label: 'Body Fat',    value: bf ? `${bf}` : '—',                       unit: '%',  color: bfCat.color },
          { label: 'Lean Mass',   value: leanMass ? `${leanMass}` : '—',           unit: 'kg', color: 'var(--accent)' },
          { label: 'Fat Mass',    value: fatMass ? `${fatMass}` : '—',             unit: 'kg', color: 'var(--muted)' },
        ].map(s => (
          <div key={s.label} style={{ padding: '12px 10px', background: 'var(--s3)', borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: 1, marginBottom: 4 }}>
              {s.label.toUpperCase()}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{s.unit}</div>
          </div>
        ))}
      </div>

      {/* Goal progress bar */}
      {targetW && startW && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>
              Start: <strong style={{ color: 'var(--sub)' }}>{startW}kg</strong>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>
              Target: <strong style={{ color: goalCfg?.color || 'var(--accent)' }}>{targetW}kg</strong>
            </div>
          </div>
          <div style={{ height: 6, background: 'var(--s4)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progressPct || 0}%`, borderRadius: 3,
              background: `linear-gradient(90deg,${goalCfg?.color || 'var(--accent)'},var(--accent-hi))`,
              boxShadow: `0 0 8px ${goalCfg?.color || 'var(--accent)'}44`,
              transition: 'width .4s ease',
            }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 5, textAlign: 'right' }}>
            {progressPct !== null ? `${progressPct}% of goal` : 'Log weight to track progress'}
          </div>
        </div>
      )}

      {!bf && (
        <div style={{ fontSize: 11, color: 'var(--muted)', padding: '8px 12px', background: 'var(--s3)', borderRadius: 6 }}>
          Add waist, neck{profile?.gender !== 'male' ? ', and hips' : ''} measurements in your profile to calculate body fat %.
        </div>
      )}
    </div>
  )
}

// ─── cycle phase card ─────────────────────────────────────────────────────────

function CycleCard({ profile }) {
  const [cycleLog, setCycleLog] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    supabase.from('cycle_logs')
      .select('*')
      .eq('client_id', profile.id)
      .not('period_start', 'is', null)
      .order('period_start', { ascending: false })
      .limit(1)
      .then(({ data }) => { setCycleLog(data?.[0] || null); setLoading(false) })
  }, [profile.id])

  if (loading) return null

  let phase = null, cycleDay = null
  if (cycleLog?.period_start) {
    const start  = new Date(cycleLog.period_start)
    const today  = new Date()
    const days   = Math.floor((today - start) / (1000 * 60 * 60 * 24))
    const len    = profile.cycle_length || 28
    const period = profile.period_length || 5
    cycleDay = (days % len) + 1
    if (cycleDay <= period)   phase = 'menstrual'
    else if (cycleDay <= 13)  phase = 'follicular'
    else if (cycleDay <= 16)  phase = 'ovulatory'
    else                      phase = 'luteal'
  }

  const cfg = phase ? PHASES[phase] : null

  return (
    <div className="card" style={{ borderLeft: `3px solid ${cfg?.color || 'var(--border)'}` }}>
      <div className="card-header" style={{ marginBottom: 10 }}>
        <div className="card-title">Cycle Tracking</div>
        <Link to="/cycle" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none' }}>View →</Link>
      </div>
      {cfg ? (
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
            background: `${cfg.color}15`, border: `2px solid ${cfg.color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>{cfg.icon}</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: cfg.color, letterSpacing: 1 }}>
              {cfg.label.toUpperCase()} — Day {cycleDay}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, lineHeight: 1.6 }}>
              {cfg.training}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          Log your period start date to see your current phase.
          <Link to="/cycle" style={{ color: 'var(--accent)', marginLeft: 6 }}>Log now →</Link>
        </div>
      )}
    </div>
  )
}

// ─── nutrition targets card ───────────────────────────────────────────────────

const DAY_TYPE_CONFIG = {
  training: { label: 'Training Day', icon: '⚡', color: 'var(--accent)'  },
  moderate: { label: 'Moderate Day', icon: '🔄', color: 'var(--info)'    },
  rest:     { label: 'Rest Day',     icon: '💤', color: 'var(--purple)'  },
}

function NutritionTargetsCard({ profile }) {
  const [dayType, setDayType] = useState('training')

  const targets = (() => {
    const { gender, current_weight, height_cm, date_of_birth, activity_level, goal_type } = profile || {}
    if (!current_weight || !height_cm || !date_of_birth) return null
    const age = Math.floor((Date.now() - new Date(date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000))
    return periodisedNutrition({
      gender:        gender === 'non_binary' ? 'female' : (gender || 'male'),
      weight:        current_weight,
      height:        height_cm,
      age,
      activityLevel: activity_level || 'moderate',
      goalType:      goal_type      || 'maintain',
    })
  })()

  if (!targets) return null

  const cfg    = DAY_TYPE_CONFIG[dayType]
  const today  = targets[`${dayType}Day`] || targets.moderateDay
  const GOAL_LABEL = { cut: 'Fat Loss', maintain: 'Maintenance', gain: 'Muscle Gain', recomp: 'Recomp' }[profile?.goal_type] || 'Maintenance'

  return (
    <div className="card" style={{ borderLeft: `3px solid ${cfg.color}` }}>
      {/* Header */}
      <div className="card-header" style={{ marginBottom: 16 }}>
        <div>
          <div className="card-title">Daily Nutrition Targets</div>
          <div className="label" style={{ marginTop: 2 }}>{GOAL_LABEL} · TDEE {targets.tdee} kcal</div>
        </div>
        <Link to="/nutrition" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}>
          LOG FOOD →
        </Link>
      </div>

      {/* Day type toggle */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {Object.entries(DAY_TYPE_CONFIG).map(([key, c]) => (
          <button
            key={key}
            onClick={() => setDayType(key)}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.08em',
              border: `1.5px solid ${dayType === key ? c.color : 'var(--border-hi)'}`,
              background: dayType === key ? `${c.color}15` : 'var(--s2)',
              color: dayType === key ? c.color : 'var(--sub)',
              transition: 'all 0.15s',
            }}
          >
            {c.icon} {c.label.split(' ')[0].toUpperCase()}
          </button>
        ))}
      </div>

      {/* Main calorie target */}
      <div style={{ textAlign: 'center', padding: '16px 0 20px', borderBottom: '1px solid var(--border-hi)', marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.12em', color: 'var(--muted)', marginBottom: 6 }}>
          {cfg.icon} {cfg.label.toUpperCase()} TARGET
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, color: cfg.color, lineHeight: 1 }}>
          {today.kcal.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>calories</div>
      </div>

      {/* Macro split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'PROTEIN', value: today.protein_g, unit: 'g', color: 'var(--info)',   sub: `${(today.protein_g / (profile?.current_weight || 80)).toFixed(1)}g/kg` },
          { label: 'CARBS',   value: today.carbs_g,   unit: 'g', color: cfg.color,        sub: 'primary fuel'   },
          { label: 'FAT',     value: today.fat_g,     unit: 'g', color: 'var(--warn)',    sub: `${(today.fat_g / (profile?.current_weight || 80)).toFixed(1)}g/kg` },
        ].map(m => (
          <div key={m.label} style={{
            background: 'var(--s3)', borderRadius: 8, padding: '12px 10px', textAlign: 'center',
            border: `1px solid ${m.color}22`,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: '1.5px', color: 'var(--muted)', marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: m.color, lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Training vs Rest comparison */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
        padding: '12px 14px', background: 'var(--s3)', borderRadius: 8,
        border: '1px solid var(--border-hi)',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: '1.5px', color: 'var(--accent)', marginBottom: 4 }}>⚡ TRAINING DAY</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)' }}>{targets.trainingDay.kcal.toLocaleString()} <span style={{ fontSize: 11, color: 'var(--muted)' }}>kcal</span></div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>C: {targets.trainingDay.carbs_g}g · P: {targets.trainingDay.protein_g}g · F: {targets.trainingDay.fat_g}g</div>
        </div>
        <div style={{ borderLeft: '1px solid var(--border-hi)', paddingLeft: 12 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: '1.5px', color: 'var(--purple)', marginBottom: 4 }}>💤 REST DAY</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)' }}>{targets.restDay.kcal.toLocaleString()} <span style={{ fontSize: 11, color: 'var(--muted)' }}>kcal</span></div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>C: {targets.restDay.carbs_g}g · P: {targets.restDay.protein_g}g · F: {targets.restDay.fat_g}g</div>
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>
        Carb cycling — protein stays fixed · carbs flex with training demand
      </div>
    </div>
  )
}

// ─── stat card ────────────────────────────────────────────────────────────────

function Stat({ label, value, unit, sub, color = 'var(--white)', warn }) {
  return (
    <div className="stat-card">
      <div className="label">{label}</div>
      <div className="stat-value" style={{ color: warn ? 'var(--warn)' : color }}>
        {value}
        {unit && <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 4 }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, profile } = useAuth()
  const { program, recentCheckIns, clientRecord, loading } = useClient()
  const [latestWeight, setLatestWeight] = useState(null)
  const [weekHabits,   setWeekHabits]   = useState([])
  const [testResults,  setTestResults]  = useState([])

  useEffect(() => {
    if (!user) return
    const { start, end } = getWeekRange()

    getMeasurements(user.id, 1).then(({ data }) => {
      if (data?.[0]) setLatestWeight(data[0].body_weight_kg)
    })
    getHabitLogsRange(user.id, start, end).then(({ data }) => {
      setWeekHabits(data || [])
    })
    supabase.from('test_results').select('*').eq('client_id', user.id)
      .order('tested_date', { ascending: false }).limit(6)
      .then(({ data }) => setTestResults(data || []))
  }, [user])

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>

  const lastCheckIn     = recentCheckIns[0]
  const avgSleep        = weekHabits.length ? (weekHabits.reduce((s, h) => s + (h.sleep_hrs || 0), 0) / weekHabits.length).toFixed(1) : null
  const avgSteps        = weekHabits.length ? Math.round(weekHabits.reduce((s, h) => s + (h.steps || 0), 0) / weekHabits.length) : null
  const currentWeek     = program?.current_week || 1
  const isWeek1         = currentWeek === 1 && !program
  const hasCycleTracking = profile?.cycle_tracking_enabled && profile?.gender !== 'male'

  // Latest VO2 and 1RM from test results
  const latestVO2  = testResults.find(r => r.test_type?.startsWith('vo2_'))
  const latest1RM  = testResults.find(r => r.test_type === 'one_rm')

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">{greeting()}, {profile?.full_name?.split(' ')[0] || 'Athlete'} 👊</div>
          <div className="page-subtitle">
            {program ? `Week ${currentWeek} · ${program.name || 'Active Programme'}` : 'No programme assigned yet'}
          </div>
        </div>
        {profile?.goal_type && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1.5,
            color: GOAL_LABELS[profile.goal_type]?.color || 'var(--accent)',
            background: `${GOAL_LABELS[profile.goal_type]?.color || 'var(--accent)'}15`,
            border: `1px solid ${GOAL_LABELS[profile.goal_type]?.color || 'var(--accent)'}33`,
            borderRadius: 6, padding: '6px 14px',
          }}>
            {GOAL_LABELS[profile.goal_type]?.icon} {GOAL_LABELS[profile.goal_type]?.label?.toUpperCase()}
            {profile.target_weight && <span style={{ color: 'var(--muted)', marginLeft: 6 }}>→ {profile.target_weight}kg</span>}
          </div>
        )}
      </div>

      {/* Featured Content — hero banner just below greeting */}
      {clientRecord?.coach_id && (
        <FeaturedContentBanner coachId={clientRecord.coach_id} />
      )}

      {/* Top stats row */}
      <div className="stats-grid section-gap">
        <Stat label="Body Weight"  value={latestWeight || profile?.current_weight || '—'} unit="kg" sub="Latest logged" />
        <Stat label="Avg Sleep"    value={avgSleep ?? '—'} unit="hrs" sub="This week" warn={avgSleep && avgSleep < 7} />
        <Stat label="Avg Steps"    value={avgSteps ? avgSteps.toLocaleString() : '—'} sub="This week" />
        <Stat
          label="Last Check-In"
          value={lastCheckIn ? `Wk ${lastCheckIn.week_number}` : '—'}
          sub={lastCheckIn ? new Date(lastCheckIn.submitted_at).toLocaleDateString('en-GB') : 'None yet'}
          color={lastCheckIn?.coach_reply ? 'var(--accent)' : 'var(--warn)'}
        />
        {latestVO2 && (
          <Stat label="VO₂ Max" value={latestVO2.results?.vo2} unit="mL/kg/min"
            sub={latestVO2.results?.category?.label || latestVO2.results?.category || ''}
            color="var(--accent)" />
        )}
        {latest1RM && (
          <Stat label={`1RM — ${latest1RM.results?.exercise || 'Strength'}`}
            value={latest1RM.results?.estimated1rm} unit="kg"
            sub="Predicted max" color="var(--info)" />
        )}
      </div>

      {/* Body composition */}
      <div className="section-gap">
        <BodyCompCard profile={profile} latestWeight={latestWeight} />
      </div>

      {/* Nutrition targets card */}
      <div className="section-gap">
        <NutritionTargetsCard profile={profile} />
      </div>

      {/* Cycle tracking card (female/non-binary only) */}
      {hasCycleTracking && (
        <div className="section-gap">
          <CycleCard profile={profile} />
        </div>
      )}

      {/* Week 1 protocol (if no programme yet) */}
      {isWeek1 && (
        <div className="section-gap">
          <Week1Card />
        </div>
      )}

      {/* Quick nav cards */}
      <div className="section-gap">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10 }}>
          {[
            { to: '/training',  icon: '🏋️', label: 'Training',    sub: program ? `Week ${currentWeek}` : 'No programme' },
            { to: '/nutrition', icon: '🥗',  label: 'Nutrition',   sub: 'Log meals' },
            { to: '/checkin',   icon: '📋',  label: 'Check-In',    sub: 'Weekly report' },
            { to: '/goalmap',   icon: '📈',  label: 'Goal Map',    sub: '6-month plan' },
            { to: '/results',   icon: '📊',  label: 'My Results',  sub: `${testResults.length} tests` },
            { to: '/education', icon: '🎓',  label: 'Education',   sub: 'Learn & grow' },
          ].map(n => (
            <Link key={n.to} to={n.to} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '14px 16px', background: 'var(--s3)', borderRadius: 10,
                border: '1px solid var(--border)', cursor: 'pointer', transition: 'all .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(0,200,150,.05)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--s3)' }}
              >
                <div style={{ fontSize: 22, marginBottom: 8 }}>{n.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1, color: 'var(--white)', marginBottom: 2 }}>
                  {n.label.toUpperCase()}
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{n.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent check-ins */}
      <div className="section-gap">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Recent Check-Ins</div>
            <Link to="/checkin" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none' }}>New check-in →</Link>
          </div>
          {recentCheckIns.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-title">No check-ins yet</div>
              <div className="empty-state-text">Submit your first weekly check-in to start tracking progress.</div>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Week</th><th>Weight</th><th>Sleep</th>
                  <th>Training</th><th>Nutrition</th><th>Mood</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentCheckIns.map(ci => (
                  <tr key={ci.id}>
                    <td><span style={{ fontFamily: 'var(--font-display)', letterSpacing: 1 }}>Week {ci.week_number}</span></td>
                    <td>{ci.body_weight_kg ? `${ci.body_weight_kg} kg` : '—'}</td>
                    <td>{ci.sleep_hrs ? `${ci.sleep_hrs}h` : '—'}</td>
                    <td><span style={{ color: ci.training_score >= 4 ? 'var(--accent)' : ci.training_score <= 2 ? 'var(--danger)' : 'var(--warn)' }}>{'★'.repeat(ci.training_score||0)}{'☆'.repeat(5-(ci.training_score||0))}</span></td>
                    <td><span style={{ color: ci.nutrition_score >= 4 ? 'var(--accent)' : ci.nutrition_score <= 2 ? 'var(--danger)' : 'var(--warn)' }}>{'★'.repeat(ci.nutrition_score||0)}{'☆'.repeat(5-(ci.nutrition_score||0))}</span></td>
                    <td><span style={{ color: ci.mood_score >= 4 ? 'var(--accent)' : ci.mood_score <= 2 ? 'var(--danger)' : 'var(--warn)' }}>{'★'.repeat(ci.mood_score||0)}{'☆'.repeat(5-(ci.mood_score||0))}</span></td>
                    <td>{ci.coach_reply ? <span className="tag tag-accent">Replied</span> : <span className="tag tag-warn">Pending</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Coach reply */}
      {lastCheckIn?.coach_reply && (
        <div className="section-gap">
          <div className="card card-accent">
            <div className="label" style={{ marginBottom: 8 }}>Coach Reply — Week {lastCheckIn.week_number}</div>
            <p style={{ fontSize: 13, color: 'var(--white)', lineHeight: 1.6 }}>{lastCheckIn.coach_reply}</p>
            {lastCheckIn.video_feedback_url && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>VIDEO FEEDBACK</div>
                <a href={lastCheckIn.video_feedback_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: 13, textDecoration: 'none' }}>
                  ▶ Watch Coach Feedback
                </a>
              </div>
            )}
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
              {new Date(lastCheckIn.replied_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
