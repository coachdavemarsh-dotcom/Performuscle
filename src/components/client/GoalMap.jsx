import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useClient } from '../../hooks/useClient.js'
import { supabase } from '../../lib/supabase.js'
import { navalBF, leanMass as lmCalc, estimateTDEE } from '../../lib/calculators.js'

// ─── helpers ──────────────────────────────────────────────────────────────────

function calcAge(dob) {
  if (!dob) return null
  const d = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - d.getFullYear()
  const m = today.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--
  return age
}

function weeklyRateKg(goalType, startWeight) {
  switch (goalType) {
    case 'cut':            return -(startWeight * 0.007)
    case 'aggressive_cut': return -(startWeight * 0.01)
    case 'gain':           return +(startWeight * 0.003)
    case 'lean_gain':      return +(startWeight * 0.002)
    case 'maintain':       return 0
    case 'recomp':         return 0
    default:               return 0
  }
}

function calorieTarget(goalType, tdee) {
  switch (goalType) {
    case 'cut':            return tdee - 400
    case 'aggressive_cut': return tdee - 600
    case 'gain':           return tdee + 300
    case 'lean_gain':      return tdee + 200
    case 'maintain':       return tdee
    case 'recomp':         return tdee - 100
    default:               return tdee
  }
}

function proteinTarget(weightKg, goalType) {
  const mult = ['gain', 'lean_gain'].includes(goalType) ? 2.2 : 2.4
  return Math.round(weightKg * mult)
}

function goalLabel(goalType) {
  const map = {
    cut: 'Fat Loss',
    aggressive_cut: 'Aggressive Cut',
    gain: 'Muscle Gain',
    lean_gain: 'Lean Gain',
    maintain: 'Maintenance',
    recomp: 'Body Recomposition',
  }
  return map[goalType] || goalType || 'Not set'
}

function goalColor(goalType) {
  if (!goalType) return 'var(--muted)'
  if (goalType.includes('cut')) return 'var(--info)'
  if (goalType.includes('gain')) return 'var(--accent)'
  if (goalType === 'maintain') return 'var(--warn)'
  return 'var(--purple)'
}

function bfCategory(gender, bf) {
  if (bf === null) return { label: '—', color: 'var(--muted)' }
  if (gender === 'female') {
    if (bf < 14) return { label: 'Essential', color: 'var(--danger)' }
    if (bf < 21) return { label: 'Athletic', color: 'var(--accent)' }
    if (bf < 25) return { label: 'Fitness', color: 'var(--info)' }
    if (bf < 32) return { label: 'Average', color: 'var(--warn)' }
    return { label: 'Above Average', color: 'var(--danger)' }
  }
  if (bf < 6) return { label: 'Essential', color: 'var(--danger)' }
  if (bf < 14) return { label: 'Athletic', color: 'var(--accent)' }
  if (bf < 18) return { label: 'Fitness', color: 'var(--info)' }
  if (bf < 25) return { label: 'Average', color: 'var(--warn)' }
  return { label: 'Above Average', color: 'var(--danger)' }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function addWeeks(dateStr, weeks) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  d.setDate(d.getDate() + weeks * 7)
  return d.toISOString().split('T')[0]
}

// Default 6-month periodisation phases
const DEFAULT_PHASES = [
  { name: 'Structural Balance',  weeks: 4,  color: '#f472b6', focus: 'Corrective & joint health, addressing FMS findings' },
  { name: 'Hypertrophy Base',    weeks: 6,  color: 'var(--accent)',  focus: 'Volume accumulation, muscle growth, GBC protocols' },
  { name: 'Strength Phase',      weeks: 6,  color: 'var(--purple)', focus: 'Progressive overload, neural drive, compound focus' },
  { name: 'Intensification',     weeks: 6,  color: 'var(--warn)',   focus: 'Intensity peaks, advanced techniques, body comp push' },
  { name: 'Peak & Test',         weeks: 4,  color: 'var(--danger)', focus: 'Max strength retest, body composition reassessment' },
]

// Week 1 GBC testing protocol
const WEEK1_PROTOCOL = [
  {
    day: 'Day 1', label: 'Aerobic Baseline + Upper Body', color: '#60a5fa',
    tests: ['Cooper 12-min Run (VO₂ max estimate)', 'Bench Press 5RM → 1RM calc', 'Pull-Up Max Reps (BW)', 'Max Dead-Hang (time in seconds)'],
  },
  {
    day: 'Day 2', label: 'Lower Body Strength', color: 'var(--accent)',
    tests: ['Back Squat 5RM → 1RM calc', 'Romanian Deadlift 5RM', 'Single-leg stability assessment', 'Hip flexor mobility re-check'],
  },
  {
    day: 'Day 3', label: 'Posterior Chain + GBC Finisher', color: '#f472b6',
    tests: ['Conventional Deadlift 5RM → 1RM calc', 'Hip thrust max load', 'GBC Circuit: Squat / RDL / Bench / Row × 3 sets', 'Record all weights + RPE for programme design'],
  },
]

// ─── SVG weight chart ─────────────────────────────────────────────────────────

function WeightChart({ predictedPoints, actualPoints, currentWeek, totalWeeks, goalWeight, startWeight }) {
  const W = 640
  const H = 220
  const PAD = { top: 20, right: 24, bottom: 36, left: 52 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const allWeights = [
    ...predictedPoints.map(p => p.weight),
    ...actualPoints.map(p => p.weight),
    goalWeight,
    startWeight,
  ].filter(Boolean)

  if (!allWeights.length) return null

  const minW = Math.floor(Math.min(...allWeights) - 2)
  const maxW = Math.ceil(Math.max(...allWeights) + 2)
  const wRange = maxW - minW || 10

  const xScale = w => PAD.left + (w / totalWeeks) * chartW
  const yScale = w => PAD.top + chartH - ((w - minW) / wRange) * chartH

  function toPath(points) {
    return points.map((p, i) =>
      `${i === 0 ? 'M' : 'L'} ${xScale(p.week).toFixed(1)} ${yScale(p.weight).toFixed(1)}`
    ).join(' ')
  }

  const yTicks = 5
  const yTickStep = wRange / yTicks
  const xTicks = []
  for (let w = 0; w <= totalWeeks; w += 4) xTicks.push(w)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {Array.from({ length: yTicks + 1 }, (_, i) => {
        const y = yScale(minW + i * yTickStep)
        return (
          <g key={i}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="var(--s5)" strokeWidth="1" strokeDasharray="4 4" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="var(--muted)" fontFamily="var(--font-display)">
              {(minW + i * yTickStep).toFixed(0)}
            </text>
          </g>
        )
      })}

      {xTicks.map(w => (
        <g key={w}>
          <line x1={xScale(w)} y1={PAD.top} x2={xScale(w)} y2={H - PAD.bottom} stroke="var(--s5)" strokeWidth="1" strokeDasharray="4 4" />
          <text x={xScale(w)} y={H - PAD.bottom + 14} textAnchor="middle" fontSize="9" fill="var(--muted)" fontFamily="var(--font-display)">
            {w === 0 ? 'Start' : `Wk ${w}`}
          </text>
        </g>
      ))}

      {goalWeight && (
        <>
          <line x1={PAD.left} y1={yScale(goalWeight)} x2={W - PAD.right} y2={yScale(goalWeight)}
            stroke="var(--accent)" strokeWidth="1" strokeDasharray="6 3" opacity="0.5" />
          <text x={W - PAD.right + 3} y={yScale(goalWeight) + 4} fontSize="9" fill="var(--accent)" fontFamily="var(--font-display)">
            Goal
          </text>
        </>
      )}

      {predictedPoints.length > 1 && (
        <>
          <path
            d={`${toPath(predictedPoints)} L ${xScale(predictedPoints[predictedPoints.length - 1].week)} ${H - PAD.bottom} L ${xScale(predictedPoints[0].week)} ${H - PAD.bottom} Z`}
            fill="var(--accent)" opacity="0.06"
          />
          <path d={toPath(predictedPoints)} fill="none" stroke="var(--accent)" strokeWidth="2" strokeDasharray="6 3" opacity="0.7" />
        </>
      )}

      {actualPoints.length > 1 && (
        <path d={toPath(actualPoints)} fill="none" stroke="var(--accent-hi)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      )}

      {actualPoints.map((p, i) => (
        <g key={i}>
          <circle cx={xScale(p.week)} cy={yScale(p.weight)} r="4" fill="var(--accent-hi)" stroke="var(--ink)" strokeWidth="2" />
          <title>{p.weight}kg — Week {p.week}</title>
        </g>
      ))}

      {currentWeek > 0 && currentWeek <= totalWeeks && (
        <g>
          <line x1={xScale(currentWeek)} y1={PAD.top} x2={xScale(currentWeek)} y2={H - PAD.bottom}
            stroke="var(--warn)" strokeWidth="1.5" />
          <polygon
            points={`${xScale(currentWeek)},${PAD.top - 4} ${xScale(currentWeek) - 4},${PAD.top + 4} ${xScale(currentWeek) + 4},${PAD.top + 4}`}
            fill="var(--warn)"
          />
          <text x={xScale(currentWeek) + 4} y={PAD.top + 12} fontSize="8" fill="var(--warn)" fontFamily="var(--font-display)">NOW</text>
        </g>
      )}

      <text x={PAD.left - 36} y={PAD.top + chartH / 2} fontSize="9" fill="var(--muted)" fontFamily="var(--font-display)"
        transform={`rotate(-90, ${PAD.left - 36}, ${PAD.top + chartH / 2})`} textAnchor="middle">
        WEIGHT (KG)
      </text>

      <g transform={`translate(${PAD.left + 10}, ${H - 10})`}>
        <line x1="0" y1="0" x2="18" y2="0" stroke="var(--accent)" strokeWidth="2" strokeDasharray="4 2" />
        <text x="22" y="4" fontSize="8" fill="var(--muted)" fontFamily="var(--font-display)">PREDICTED</text>
        <line x1="90" y1="0" x2="108" y2="0" stroke="var(--accent-hi)" strokeWidth="2.5" />
        <text x="112" y="4" fontSize="8" fill="var(--muted)" fontFamily="var(--font-display)">ACTUAL</text>
      </g>
    </svg>
  )
}

// ─── phase timeline strip ─────────────────────────────────────────────────────

function PhaseTimeline({ phases, totalWeeks, currentWeek }) {
  let startWk = 0
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ position: 'relative', height: 28, background: 'var(--s3)', borderRadius: 6, overflow: 'hidden' }}>
        {phases.map((phase, i) => {
          const left = `${(startWk / totalWeeks) * 100}%`
          const width = `${(phase.weeks / totalWeeks) * 100}%`
          startWk += phase.weeks
          return (
            <div key={i} style={{
              position: 'absolute', left, width, height: '100%',
              background: `${phase.color}28`,
              borderLeft: `2px solid ${phase.color}66`,
              display: 'flex', alignItems: 'center', paddingLeft: 8,
              overflow: 'hidden',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1, color: phase.color, whiteSpace: 'nowrap' }}>
                {phase.name}
              </span>
            </div>
          )
        })}
        {currentWeek > 0 && (
          <div style={{
            position: 'absolute',
            left: `${Math.min((currentWeek / totalWeeks) * 100, 100)}%`,
            top: 0, bottom: 0, width: 2,
            background: 'var(--warn)',
            boxShadow: '0 0 8px var(--warn)',
          }} />
        )}
      </div>
      <div style={{ position: 'relative', height: 16, marginTop: 2 }}>
        {(() => { let s = 0; return phases.map((p, i) => {
          const left = `${(s / totalWeeks) * 100}%`
          s += p.weeks
          return (
            <span key={i} style={{ position: 'absolute', left, fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--font-display)' }}>
              Wk {i === 0 ? 1 : phases.slice(0, i).reduce((a, pp) => a + pp.weeks, 0) + 1}
            </span>
          )
        })})()}
      </div>
    </div>
  )
}

// ─── Week 1 protocol panel (shown pre-programme) ──────────────────────────────

function Week1Banner({ startDate }) {
  return (
    <div className="card" style={{ padding: '20px 22px', marginBottom: 24, borderLeft: '3px solid var(--accent)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div className="label" style={{ color: 'var(--accent)', marginBottom: 4 }}>WEEK 1 — TESTING PROTOCOL</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)', letterSpacing: 1 }}>
            GBC Baseline Assessment
          </div>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1.5,
          color: 'var(--accent)', background: 'rgba(0,200,150,.12)',
          border: '1px solid rgba(0,200,150,.3)', borderRadius: 4, padding: '4px 10px',
        }}>
          AWAITING PROGRAMME
        </div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 18 }}>
        Complete this 3-day testing week before your personalised programme begins.
        Results from each session feed directly into your periodisation design — your coach
        uses these to set exact loads, set/rep schemes and phase targets.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
        {WEEK1_PROTOCOL.map((day, i) => (
          <div key={i} style={{
            background: 'var(--s2)', borderRadius: 10,
            border: `1px solid ${day.color}33`,
            padding: '14px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: `${day.color}1a`,
                border: `1px solid ${day.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: 11, color: day.color,
              }}>{i + 1}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1, color: day.color }}>
                  {day.day}
                </div>
                <div style={{ fontSize: 11, color: 'var(--sub)', fontWeight: 500 }}>{day.label}</div>
              </div>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {day.tests.map((t, j) => (
                <li key={j} style={{ display: 'flex', gap: 6, marginBottom: 5, fontSize: 11, color: 'var(--muted)' }}>
                  <span style={{ color: day.color, flexShrink: 0 }}>›</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {startDate && (
        <div style={{ marginTop: 14, fontSize: 11, color: 'var(--muted)' }}>
          Onboarding completed: <span style={{ color: 'var(--sub)' }}>{formatDate(startDate)}</span>
        </div>
      )}
    </div>
  )
}

// ─── body comp summary mini-card ─────────────────────────────────────────────

function BodyCompSummary({ profile }) {
  const bf = navalBF(
    profile.gender,
    profile.waist_cm,
    profile.neck_cm,
    profile.height_cm,
    profile.hips_cm,
  )
  const weight = profile.current_weight
  const lean = bf !== null && weight ? lmCalc(weight, bf) : null
  const fat = lean !== null && weight ? Math.round((weight - lean) * 10) / 10 : null
  const cat = bfCategory(profile.gender, bf)

  const items = [
    { label: 'Weight', value: weight ? `${weight}kg` : '—', color: 'var(--sub)' },
    { label: 'Body Fat', value: bf !== null ? `${bf}%` : '—', color: cat.color, sub: cat.label },
    { label: 'Lean Mass', value: lean ? `${lean}kg` : '—', color: 'var(--accent)' },
    { label: 'Fat Mass', value: fat ? `${fat}kg` : '—', color: 'var(--info)' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
      {items.map(item => (
        <div key={item.label} className="stat-card">
          <div className="label">{item.label}</div>
          <div className="stat-value" style={{ color: item.color, fontSize: 20 }}>{item.value}</div>
          {item.sub && <div style={{ fontSize: 10, color: item.color, marginTop: 2 }}>{item.sub}</div>}
        </div>
      ))}
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

const TABS = ['Overview', 'Training Phases', 'Nutrition', 'Body Comp']

export default function GoalMap() {
  const { user, profile } = useAuth()
  const { program } = useClient()
  const [tab, setTab] = useState('Overview')
  const [measurements, setMeasurements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchMeasurements()
  }, [user])

  async function fetchMeasurements() {
    setLoading(true)
    const { data } = await supabase
      .from('measurements')
      .select('*')
      .eq('client_id', user.id)
      .order('measured_at', { ascending: true })
    setMeasurements(data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  // ── Resolve data: programme takes priority, profile fills gaps ──────────────
  const goalType    = program?.goal_type    || profile?.goal_type    || 'maintain'
  const startWeight = program?.start_weight || profile?.current_weight || measurements[0]?.weight_kg || null
  const targetWeight= program?.target_weight|| profile?.target_weight || null
  const totalWeeks  = program?.total_weeks  || 26
  const currentWeek = program?.current_week || 1
  const startDate   = program?.start_date   || null

  // TDEE — use real profile data if available, else rough estimate
  const age = profile ? calcAge(profile.date_of_birth) : null
  const activityMap = { sedentary: 'sedentary', light: 'light', moderate: 'moderate', active: 'active', athlete: 'very_active' }
  const tdee = (profile?.gender && startWeight && profile?.height_cm && age)
    ? estimateTDEE(profile.gender, startWeight, profile.height_cm, age, activityMap[profile.activity_level] || 'moderate')
    : startWeight ? Math.round(startWeight * 33) : null

  // Body fat from Naval formula (profile measurements)
  const profileBF = profile
    ? navalBF(profile.gender, profile.waist_cm, profile.neck_cm, profile.height_cm, profile.hips_cm)
    : null

  // Nutrition targets
  const dailyCals = tdee ? calorieTarget(goalType, tdee) : null
  const proteinG  = startWeight ? proteinTarget(startWeight, goalType) : null
  const carbsG    = dailyCals && proteinG ? Math.round((dailyCals * 0.35) / 4) : null
  const fatG      = dailyCals && proteinG ? Math.round((dailyCals - proteinG * 4 - (carbsG || 0) * 4) / 9) : null

  const weeklyRate = startWeight ? weeklyRateKg(goalType, startWeight) : 0

  // Predicted weight trajectory
  const predictedPoints = startWeight
    ? Array.from({ length: totalWeeks + 1 }, (_, w) => ({
        week: w,
        weight: parseFloat((startWeight + weeklyRate * w).toFixed(1)),
      }))
    : []

  // Actual weight from measurements mapped to weeks
  const actualPoints = startDate && measurements.length
    ? measurements
        .filter(m => m.weight_kg)
        .map(m => {
          const diffWeeks = Math.round((new Date(m.measured_at) - new Date(startDate)) / (7 * 86400000))
          return { week: diffWeeks, weight: m.weight_kg }
        })
        .filter(p => p.week >= 0 && p.week <= totalWeeks)
        .sort((a, b) => a.week - b.week)
    : []

  const latestActual   = actualPoints.length ? actualPoints[actualPoints.length - 1].weight : null
  const predictedNow   = startWeight ? parseFloat((startWeight + weeklyRate * currentWeek).toFixed(1)) : null
  const variance       = latestActual && predictedNow ? parseFloat((latestActual - predictedNow).toFixed(1)) : null
  const weeksRemaining = totalWeeks - currentWeek

  // Phases
  const phases = program?.phases || DEFAULT_PHASES
  const phaseWeekSum = phases.reduce((s, p) => s + p.weeks, 0)
  const normPhases = phases.map(p => ({ ...p, weeks: Math.round((p.weeks / phaseWeekSum) * totalWeeks) }))

  let cumulativeWeeks = 0
  const currentPhase = normPhases.find(p => {
    cumulativeWeeks += p.weeks
    return currentWeek <= cumulativeWeeks
  }) || normPhases[normPhases.length - 1]

  const endDate           = startDate ? addWeeks(startDate, totalWeeks) : null
  const predictedEndWeight= startWeight ? parseFloat((startWeight + weeklyRate * totalWeeks).toFixed(1)) : null
  const totalChange       = predictedEndWeight && startWeight ? parseFloat((predictedEndWeight - startWeight).toFixed(1)) : null

  // Body comp from measurements
  const bfReadings = measurements.filter(m => m.body_fat_pct).map(m => ({ date: m.measured_at, bf: m.body_fat_pct, weight: m.weight_kg }))
  const latestBF   = bfReadings.length ? bfReadings[bfReadings.length - 1].bf : profileBF
  const firstBF    = bfReadings.length ? bfReadings[0].bf : profileBF
  const bfChange   = latestBF && firstBF && bfReadings.length > 1 ? parseFloat((latestBF - firstBF).toFixed(1)) : null

  const latestMeasure = measurements.length ? measurements[measurements.length - 1] : null
  const leanMassKg    = (latestMeasure?.weight_kg && latestMeasure?.body_fat_pct)
    ? lmCalc(latestMeasure.weight_kg, latestMeasure.body_fat_pct)
    : (startWeight && latestBF ? lmCalc(startWeight, latestBF) : null)
  const fatMassKg     = leanMassKg && startWeight ? parseFloat((startWeight - leanMassKg).toFixed(1)) : null

  const gColor = goalColor(goalType)

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <div className="page-title">Goal Map</div>
          <div className="page-subtitle">
            {program ? `${program.name} · ` : ''}{goalLabel(goalType)} · {totalWeeks} weeks
          </div>
        </div>
        {endDate && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>TARGET DATE</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)' }}>{formatDate(endDate)}</div>
          </div>
        )}
      </div>

      {/* Pre-programme banner + body comp from onboarding */}
      {!program && (
        <>
          {profile && <BodyCompSummary profile={profile} />}
          <Week1Banner startDate={profile?.created_at} />
        </>
      )}

      {/* Summary stat cards */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="label">Goal</div>
          <div className="stat-value" style={{ color: gColor, fontSize: 16 }}>{goalLabel(goalType)}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            {weeklyRate !== 0 ? `${weeklyRate > 0 ? '+' : ''}${weeklyRate.toFixed(2)}kg/wk` : 'No weight change'}
          </div>
        </div>

        <div className="stat-card">
          <div className="label">Week</div>
          <div className="stat-value">{currentWeek}<span style={{ fontSize: 14, color: 'var(--muted)' }}>/{totalWeeks}</span></div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{weeksRemaining} weeks remaining</div>
        </div>

        <div className="stat-card">
          <div className="label">{program ? 'Predicted Now' : 'Starting Weight'}</div>
          <div className="stat-value" style={{ color: 'var(--sub)' }}>
            {(program ? predictedNow : startWeight) ? `${program ? predictedNow : startWeight}kg` : '—'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            {program ? `Started at ${startWeight ? `${startWeight}kg` : '—'}` : 'From onboarding'}
          </div>
        </div>

        <div className="stat-card">
          <div className="label">{latestActual ? 'Actual Weight' : 'Target Weight'}</div>
          <div className="stat-value" style={{ color: latestActual ? 'var(--accent)' : targetWeight ? 'var(--accent-hi)' : 'var(--muted)' }}>
            {latestActual ? `${latestActual}kg` : targetWeight ? `${targetWeight}kg` : '—'}
          </div>
          {latestActual && variance !== null ? (
            <div style={{
              fontSize: 11, marginTop: 2,
              color: Math.abs(variance) < 0.5 ? 'var(--accent)'
                : goalType.includes('cut') && variance < 0 ? 'var(--accent)'
                : goalType.includes('gain') && variance > 0 ? 'var(--accent)'
                : 'var(--warn)',
            }}>
              {variance > 0 ? '+' : ''}{variance}kg vs predicted
            </div>
          ) : (
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              {latestActual ? '' : startWeight && targetWeight ? `${Math.abs(startWeight - targetWeight).toFixed(1)}kg to go` : 'Set in goal settings'}
            </div>
          )}
        </div>

        {latestBF !== null && (
          <div className="stat-card">
            <div className="label">Body Fat</div>
            <div className="stat-value" style={{ color: bfCategory(profile?.gender, latestBF).color, fontSize: 20 }}>
              {latestBF}%
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
              {bfCategory(profile?.gender, latestBF).label}
              {bfReadings.length ? ' (measured)' : ' (Naval calc)'}
            </div>
          </div>
        )}

        {predictedEndWeight && (
          <div className="stat-card">
            <div className="label">Predicted End</div>
            <div className="stat-value" style={{ color: gColor }}>{predictedEndWeight}kg</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              {totalChange !== null ? `${totalChange > 0 ? '+' : ''}${totalChange}kg total` : ''}
            </div>
          </div>
        )}
      </div>

      {/* Current phase badge */}
      <div className="card" style={{ padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14, borderLeft: `3px solid ${currentPhase?.color || 'var(--accent)'}` }}>
        <div>
          <div className="label" style={{ marginBottom: 2 }}>
            {program ? 'Current Phase' : 'Planned Phase 1'}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)', letterSpacing: 1 }}>
            {currentPhase?.name || 'Phase 1'}
          </div>
        </div>
        <div style={{ width: 1, height: 32, background: 'var(--border)' }} />
        <div style={{ fontSize: 12, color: 'var(--muted)', flex: 1 }}>{currentPhase?.focus || ''}</div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: currentPhase?.color || 'var(--accent)', lineHeight: 1 }}>
            {program ? weeksRemaining : currentPhase?.weeks}
          </div>
          <div className="label" style={{ fontSize: 8 }}>{program ? 'WKS LEFT' : 'WKS'}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1.5,
            color: tab === t ? 'var(--accent)' : 'var(--muted)',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px',
            borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: -1,
            transition: 'color .2s, border-color .2s',
          }}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === 'Overview' && (
        <div>
          <div className="card" style={{ padding: '16px 18px', marginBottom: 20 }}>
            <div className="label" style={{ marginBottom: 14 }}>
              {program ? '6-Month Periodisation Timeline' : 'Planned 6-Month Periodisation'}
            </div>
            <PhaseTimeline phases={normPhases} totalWeeks={totalWeeks} currentWeek={currentWeek} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, marginTop: 8 }}>
              <span className="label">Overall Progress</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--accent)' }}>
                {Math.round((currentWeek / totalWeeks) * 100)}%
              </span>
            </div>
            <div style={{ height: 4, background: 'var(--s5)', borderRadius: 2 }}>
              <div style={{
                height: '100%',
                width: `${Math.min((currentWeek / totalWeeks) * 100, 100)}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--accent-hi))',
                borderRadius: 2, transition: 'width .4s',
                boxShadow: '0 0 8px rgba(0,200,150,.35)',
              }} />
            </div>
          </div>

          <div className="card" style={{ padding: '16px 18px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="label">Predicted vs Actual Weight</div>
              {!startDate && (
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>Awaiting programme start date</span>
              )}
              {startDate && actualPoints.length === 0 && (
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>Log measurements to see actual progress</span>
              )}
            </div>
            {startWeight ? (
              <WeightChart
                predictedPoints={predictedPoints}
                actualPoints={actualPoints}
                currentWeek={program ? currentWeek : 0}
                totalWeeks={totalWeeks}
                goalWeight={targetWeight}
                startWeight={startWeight}
              />
            ) : (
              <div className="empty-state" style={{ height: 160 }}>
                <div className="empty-state-title">No start weight set</div>
                <div className="empty-state-text">Complete onboarding to set your starting weight.</div>
              </div>
            )}
          </div>

          {startWeight && (
            <div className="card" style={{ padding: '16px 18px' }}>
              <div className="label" style={{ marginBottom: 14 }}>Monthly Milestones</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 10 }}>
                {[4, 8, 13, 17, 22, 26].filter(w => w <= totalWeeks).map(w => {
                  const predW = parseFloat((startWeight + weeklyRate * w).toFixed(1))
                  const actual = actualPoints.find(p => Math.abs(p.week - w) <= 1)
                  const isPast = program && w <= currentWeek
                  return (
                    <div key={w} style={{
                      padding: '12px 14px', background: 'var(--s3)', borderRadius: 8,
                      border: `1px solid ${isPast ? 'var(--border-hi)' : 'var(--border)'}`,
                      opacity: isPast ? 1 : 0.6,
                    }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 4 }}>WEEK {w}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--sub)', lineHeight: 1 }}>{predW}kg</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>predicted</div>
                      {actual && (
                        <div style={{ marginTop: 6, fontSize: 12, color: Math.abs(actual.weight - predW) < 0.5 ? 'var(--accent)' : 'var(--warn)', fontFamily: 'var(--font-display)' }}>
                          {actual.weight}kg actual
                        </div>
                      )}
                      {isPast && !actual && (
                        <div style={{ marginTop: 6, fontSize: 10, color: 'var(--border-hi)', fontStyle: 'italic' }}>no data</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TRAINING PHASES TAB ── */}
      {tab === 'Training Phases' && (
        <div>
          {(() => {
            let wk = 0
            return normPhases.map((phase, i) => {
              const phaseStart = wk + 1
              const phaseEnd = wk + phase.weeks
              const isActive = program && currentWeek >= phaseStart && currentWeek <= phaseEnd
              const isPast = program && currentWeek > phaseEnd
              wk += phase.weeks
              return (
                <div key={i} className="card" style={{
                  padding: '18px 20px', marginBottom: 14,
                  borderLeft: `3px solid ${phase.color}${isActive ? '' : '66'}`,
                  opacity: isPast ? 0.7 : 1,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{
                        fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1.5,
                        color: phase.color,
                        background: `${phase.color}18`,
                        border: `1px solid ${phase.color}44`,
                        borderRadius: 4, padding: '2px 8px',
                      }}>
                        {isPast ? 'COMPLETE' : isActive ? 'ACTIVE' : `WK ${phaseStart}–${phaseEnd}`}
                      </span>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)', letterSpacing: 1 }}>
                        {phase.name}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: phase.color, lineHeight: 1 }}>{phase.weeks}</div>
                      <div className="label" style={{ fontSize: 8 }}>WEEKS</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.7 }}>{phase.focus}</div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ padding: '6px 12px', background: 'var(--s3)', borderRadius: 6, border: '1px solid var(--border)' }}>
                      <div className="label" style={{ fontSize: 8, marginBottom: 2 }}>Goal</div>
                      <div style={{ fontSize: 12, color: 'var(--sub)' }}>{goalLabel(phase.goal || goalType)}</div>
                    </div>
                    <div style={{ padding: '6px 12px', background: 'var(--s3)', borderRadius: 6, border: '1px solid var(--border)' }}>
                      <div className="label" style={{ fontSize: 8, marginBottom: 2 }}>Weeks</div>
                      <div style={{ fontSize: 12, color: 'var(--sub)' }}>{phaseStart} – {phaseEnd}</div>
                    </div>
                    {startDate && (
                      <div style={{ padding: '6px 12px', background: 'var(--s3)', borderRadius: 6, border: '1px solid var(--border)' }}>
                        <div className="label" style={{ fontSize: 8, marginBottom: 2 }}>Start Date</div>
                        <div style={{ fontSize: 12, color: 'var(--sub)' }}>{formatDate(addWeeks(startDate, phaseStart - 1))}</div>
                      </div>
                    )}
                  </div>
                  {isActive && (
                    <div style={{ marginTop: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span className="label" style={{ fontSize: 8 }}>Phase Progress</span>
                        <span style={{ fontSize: 10, color: phase.color, fontFamily: 'var(--font-display)' }}>
                          Week {currentWeek - phaseStart + 1} of {phase.weeks}
                        </span>
                      </div>
                      <div style={{ height: 3, background: 'var(--s5)', borderRadius: 2 }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.round(((currentWeek - phaseStart + 1) / phase.weeks) * 100)}%`,
                          background: phase.color, borderRadius: 2, transition: 'width .4s',
                          boxShadow: `0 0 6px ${phase.color}66`,
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          })()}
        </div>
      )}

      {/* ── NUTRITION TAB ── */}
      {tab === 'Nutrition' && (
        <div>
          {tdee && (
            <div className="card" style={{ padding: '14px 18px', marginBottom: 20, borderLeft: '3px solid var(--info)', display: 'flex', gap: 16, alignItems: 'center' }}>
              <div>
                <div className="label">Estimated TDEE</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--info)' }}>{tdee.toLocaleString()} kcal</div>
              </div>
              <div style={{ width: 1, height: 36, background: 'var(--border)' }} />
              <div style={{ fontSize: 12, color: 'var(--muted)', flex: 1, lineHeight: 1.7 }}>
                Calculated using Mifflin-St Jeor with {profile?.activity_level || 'moderate'} activity.
                {age ? ` Age: ${age}.` : ''} Your coach may adjust this based on check-in data.
              </div>
            </div>
          )}

          <div className="stats-grid" style={{ marginBottom: 20 }}>
            {[
              { label: 'Daily Calories', value: dailyCals ? dailyCals.toLocaleString() : '—', sub: 'kcal/day', color: gColor },
              { label: 'Protein', value: proteinG ? `${proteinG}g` : '—', sub: startWeight ? `${(proteinG / startWeight).toFixed(1)}g/kg BW` : 'per day', color: 'var(--accent)' },
              { label: 'Carbohydrates', value: carbsG ? `${carbsG}g` : '—', sub: 'per day', color: 'var(--info)' },
              { label: 'Fats', value: fatG ? `${fatG}g` : '—', sub: 'per day', color: 'var(--warn)' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="label">{s.label}</div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {dailyCals && proteinG && carbsG && fatG && (
            <div className="card" style={{ padding: '18px 20px', marginBottom: 20 }}>
              <div className="label" style={{ marginBottom: 14 }}>Macro Split</div>
              <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', gap: 2 }}>
                {[
                  { name: 'Protein', cals: proteinG * 4, color: 'var(--accent)' },
                  { name: 'Carbs', cals: carbsG * 4, color: 'var(--info)' },
                  { name: 'Fats', cals: fatG * 9, color: 'var(--warn)' },
                ].map(m => (
                  <div key={m.name} style={{ flex: m.cals, background: m.color, opacity: 0.85, minWidth: 4 }}
                    title={`${m.name}: ${Math.round((m.cals / dailyCals) * 100)}%`} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
                {[
                  { name: 'Protein', cals: proteinG * 4, color: 'var(--accent)', g: proteinG },
                  { name: 'Carbs', cals: carbsG * 4, color: 'var(--info)', g: carbsG },
                  { name: 'Fats', cals: fatG * 9, color: 'var(--warn)', g: fatG },
                ].map(m => (
                  <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: m.color }} />
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {m.name} — {m.g}g ({Math.round((m.cals / dailyCals) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {startWeight && (
            <div className="card" style={{ padding: '18px 20px', marginBottom: 20 }}>
              <div className="label" style={{ marginBottom: 14 }}>Weekly Rate of Change Projections</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr>
                      {['Week', 'Predicted Weight', 'Weekly Change', 'Cumulative Change', 'Status'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '6px 12px', fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5, color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 4, 8, 12, 16, 20, 24, 26].filter(w => w <= totalWeeks).map(w => {
                      const predW = parseFloat((startWeight + weeklyRate * w).toFixed(1))
                      const cumChange = parseFloat((predW - startWeight).toFixed(1))
                      const isPast = program && w <= currentWeek
                      const actual = actualPoints.find(p => Math.abs(p.week - w) <= 1)
                      return (
                        <tr key={w} style={{ borderBottom: '1px solid var(--border)', background: program && w === currentWeek ? 'rgba(0,200,150,.04)' : 'transparent' }}>
                          <td style={{ padding: '8px 12px', fontFamily: 'var(--font-display)', color: program && w === currentWeek ? 'var(--warn)' : 'var(--sub)' }}>
                            {program && w === currentWeek ? `▶ ${w}` : w}
                          </td>
                          <td style={{ padding: '8px 12px', color: 'var(--sub)' }}>{predW}kg</td>
                          <td style={{ padding: '8px 12px', color: weeklyRate < 0 ? 'var(--info)' : weeklyRate > 0 ? 'var(--accent)' : 'var(--muted)' }}>
                            {weeklyRate !== 0 ? `${weeklyRate > 0 ? '+' : ''}${weeklyRate.toFixed(2)}kg` : '—'}
                          </td>
                          <td style={{ padding: '8px 12px', color: cumChange < 0 ? 'var(--info)' : cumChange > 0 ? 'var(--accent)' : 'var(--muted)' }}>
                            {cumChange > 0 ? '+' : ''}{cumChange}kg
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            {actual ? (
                              <span style={{ fontSize: 10, fontFamily: 'var(--font-display)', color: Math.abs(actual.weight - predW) < 1 ? 'var(--accent)' : 'var(--warn)' }}>
                                {actual.weight}kg actual
                              </span>
                            ) : isPast ? (
                              <span style={{ fontSize: 10, color: 'var(--border-hi)' }}>no data</span>
                            ) : (
                              <span style={{ fontSize: 10, color: 'var(--s5)' }}>—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="card" style={{ padding: '16px 20px', borderLeft: '3px solid var(--warn)' }}>
            <div className="label" style={{ marginBottom: 8 }}>Energy Availability Note</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
              Energy availability (EA) = (Daily intake − Exercise expenditure) ÷ Lean body mass.
              <br />
              Optimal EA for health and performance is <strong style={{ color: 'var(--white)' }}>≥ 45 kcal/kg LBM/day</strong>.
              Values below 30 kcal/kg LBM/day risk RED-S. Your coach monitors this weekly.
            </div>
          </div>
        </div>
      )}

      {/* ── BODY COMP TAB ── */}
      {tab === 'Body Comp' && (
        <div>
          {/* Source label */}
          {profileBF !== null && bfReadings.length === 0 && (
            <div className="card" style={{ padding: '12px 16px', marginBottom: 16, borderLeft: '3px solid var(--info)', display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 18 }}>📐</span>
              <div>
                <div style={{ fontSize: 12, color: 'var(--sub)', fontWeight: 500 }}>Naval Body Fat Formula — Onboarding Baseline</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  Waist {profile?.waist_cm}cm · Neck {profile?.neck_cm}cm{profile?.hips_cm ? ` · Hips ${profile.hips_cm}cm` : ''} · Height {profile?.height_cm}cm
                </div>
              </div>
            </div>
          )}

          <div className="stats-grid" style={{ marginBottom: 20 }}>
            {[
              { label: 'Body Fat %', value: latestBF !== null ? `${latestBF}%` : '—', sub: bfCategory(profile?.gender, latestBF).label, color: bfCategory(profile?.gender, latestBF).color },
              { label: 'Current Weight', value: (latestMeasure?.weight_kg || startWeight) ? `${latestMeasure?.weight_kg || startWeight}kg` : '—', sub: 'kg', color: 'var(--sub)' },
              { label: 'Lean Mass', value: leanMassKg ? `${leanMassKg}kg` : '—', sub: 'skeletal + organ', color: 'var(--accent)' },
              { label: 'Fat Mass', value: fatMassKg ? `${fatMassKg}kg` : '—', sub: 'total adipose', color: 'var(--info)' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div className="label">{s.label}</div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* BF% classification norms */}
          <div className="card" style={{ padding: '18px 20px', marginBottom: 20 }}>
            <div className="label" style={{ marginBottom: 14 }}>Body Fat % Classification</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 10 }}>
              {(profile?.gender === 'female'
                ? [
                    { label: 'Essential', range: '10–14%', min: 10, max: 14, color: 'var(--danger)' },
                    { label: 'Athletic', range: '14–21%', min: 14, max: 21, color: 'var(--accent)' },
                    { label: 'Fitness', range: '21–25%', min: 21, max: 25, color: 'var(--info)' },
                    { label: 'Average', range: '25–32%', min: 25, max: 32, color: 'var(--warn)' },
                    { label: 'Above Avg', range: '>32%', min: 32, max: 999, color: 'var(--danger)' },
                  ]
                : [
                    { label: 'Essential', range: '2–6%', min: 2, max: 6, color: 'var(--danger)' },
                    { label: 'Athletic', range: '6–14%', min: 6, max: 14, color: 'var(--accent)' },
                    { label: 'Fitness', range: '14–18%', min: 14, max: 18, color: 'var(--info)' },
                    { label: 'Average', range: '18–25%', min: 18, max: 25, color: 'var(--warn)' },
                    { label: 'Above Avg', range: '>25%', min: 25, max: 999, color: 'var(--danger)' },
                  ]
              ).map(cat => {
                const isClient = latestBF !== null && latestBF >= cat.min && latestBF < cat.max
                return (
                  <div key={cat.label} style={{
                    padding: '12px 14px', background: isClient ? `${cat.color}18` : 'var(--s3)',
                    borderRadius: 8,
                    border: `1px solid ${isClient ? cat.color : 'var(--border)'}`,
                  }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1, color: cat.color, marginBottom: 4 }}>
                      {cat.label.toUpperCase()}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--sub)', fontFamily: 'var(--font-display)' }}>{cat.range}</div>
                    {isClient && (
                      <div style={{ marginTop: 6, fontSize: 10, color: cat.color }}>← You are here</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* BF trend */}
          {bfReadings.length > 1 && (
            <div className="card" style={{ padding: '18px 20px', marginBottom: 20 }}>
              <div className="label" style={{ marginBottom: 14 }}>Body Fat % History</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr>
                      {['Date', 'Body Fat %', 'Weight', 'Lean Mass', 'Change'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '6px 12px', fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5, color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bfReadings.map((r, i) => {
                      const lean = r.weight ? lmCalc(r.weight, r.bf) : null
                      const prev = i > 0 ? bfReadings[i - 1].bf : null
                      const delta = prev !== null ? parseFloat((r.bf - prev).toFixed(1)) : null
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '8px 12px', color: 'var(--muted)' }}>{formatDate(r.date)}</td>
                          <td style={{ padding: '8px 12px', color: bfCategory(profile?.gender, r.bf).color, fontFamily: 'var(--font-display)' }}>{r.bf}%</td>
                          <td style={{ padding: '8px 12px', color: 'var(--sub)' }}>{r.weight ? `${r.weight}kg` : '—'}</td>
                          <td style={{ padding: '8px 12px', color: 'var(--accent)' }}>{lean ? `${lean}kg` : '—'}</td>
                          <td style={{ padding: '8px 12px' }}>
                            {delta !== null ? (
                              <span style={{ color: delta < 0 ? 'var(--accent)' : delta > 0 ? 'var(--danger)' : 'var(--muted)', fontSize: 10, fontFamily: 'var(--font-display)' }}>
                                {delta > 0 ? '+' : ''}{delta}%
                              </span>
                            ) : '—'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {bfChange !== null && (
                <div style={{ marginTop: 14, padding: '10px 14px', background: bfChange < 0 ? 'rgba(0,200,150,.06)' : 'rgba(239,68,68,.06)', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: bfChange < 0 ? 'var(--accent)' : 'var(--danger)' }}>
                    {bfChange > 0 ? '+' : ''}{bfChange}%
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                    total body fat change since first measurement
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Goal target body comp */}
          {startWeight && targetWeight && (
            <div className="card" style={{ padding: '18px 20px' }}>
              <div className="label" style={{ marginBottom: 14 }}>Goal Targets</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 14 }}>
                <div style={{ padding: '14px 16px', background: 'var(--s3)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div className="label" style={{ marginBottom: 6 }}>Target Weight</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: gColor, lineHeight: 1 }}>{targetWeight}kg</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                    {Math.abs(startWeight - targetWeight).toFixed(1)}kg {targetWeight < startWeight ? 'to lose' : 'to gain'}
                  </div>
                </div>
                <div style={{ padding: '14px 16px', background: 'var(--s3)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div className="label" style={{ marginBottom: 6 }}>Progress</div>
                  <div style={{ height: 8, background: 'var(--s5)', borderRadius: 4, marginBottom: 6 }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(Math.max(latestActual && targetWeight !== startWeight
                        ? Math.abs((latestActual - startWeight) / (targetWeight - startWeight)) * 100
                        : 0, 0), 100)}%`,
                      background: `linear-gradient(90deg, ${gColor}, var(--accent-hi))`,
                      borderRadius: 4,
                    }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {latestActual ? `${Math.abs(latestActual - targetWeight).toFixed(1)}kg remaining` : 'No weight logged yet'}
                  </div>
                </div>
                <div style={{ padding: '14px 16px', background: 'var(--s3)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div className="label" style={{ marginBottom: 6 }}>Est. Time to Goal</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--sub)', lineHeight: 1 }}>
                    {weeklyRate !== 0 && latestActual
                      ? `${Math.ceil(Math.abs((latestActual - targetWeight) / weeklyRate))}wks`
                      : '—'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>at {weeklyRate.toFixed(2)}kg/wk</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
