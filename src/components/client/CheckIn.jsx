import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useClient } from '../../hooks/useClient.js'
import { submitCheckIn, uploadCheckInPhoto, getNutritionLogsRange, getActiveNutritionPlan } from '../../lib/supabase.js'
import { notifyCoachCheckIn } from '../../lib/emailApi.js'

// ─── Metric definitions ────────────────────────────────────────────────────
const METRICS = [
  // ADHERENCE group
  { key: 'training_score',         label: 'Training Adherence',   hint: 'How well did you stick to your training plan?',       group: 'ADHERENCE',   inverted: false, color: '#00C896' },
  { key: 'nutrition_score',        label: 'Nutrition Consistency', hint: 'How consistent was your nutrition this week?',       group: 'ADHERENCE',   inverted: false, color: '#00C896' },
  { key: 'step_score',             label: 'Daily Step Count',     hint: 'How well did you hit your daily step targets?',       group: 'ADHERENCE',   inverted: false, color: '#00C896' },
  { key: 'supplementation_score',  label: 'Supplementation',      hint: 'How consistent were you with your supplements?',     group: 'ADHERENCE',   inverted: false, color: '#00C896' },
  // RECOVERY group
  { key: 'sleep_score',            label: 'Sleep Quality',        hint: 'How well did you sleep this week overall?',           group: 'RECOVERY',    inverted: false, color: '#7C6FFF' },
  { key: 'digestion_score',        label: 'Digestion',            hint: 'How was your gut health and digestion?',              group: 'RECOVERY',    inverted: false, color: '#7C6FFF' },
  { key: 'physical_stress_score',  label: 'Physical Stress',      hint: '0 = highly stressed, 10 = fully relaxed',            group: 'RECOVERY',    inverted: true,  color: '#7C6FFF' },
  { key: 'emotional_stress_score', label: 'Emotional Stress',     hint: '0 = highly stressed, 10 = emotionally calm',         group: 'RECOVERY',    inverted: true,  color: '#7C6FFF' },
  // PERFORMANCE group
  { key: 'strength_score',         label: 'Strength & Performance', hint: 'How strong did you feel in your sessions?',        group: 'PERFORMANCE', inverted: false, color: '#FF6B35' },
  { key: 'confidence_score',       label: 'Self Confidence',      hint: 'How confident did you feel about your progress?',    group: 'PERFORMANCE', inverted: false, color: '#FF6B35' },
  { key: 'recovery_score',         label: 'Training Recovery',    hint: 'How well did you recover between training sessions?',group: 'PERFORMANCE', inverted: false, color: '#FF6B35' },
]

const GROUPS = [
  { name: 'ADHERENCE',   subtitle: 'How well did you follow the plan this week?', color: '#00C896' },
  { name: 'RECOVERY',    subtitle: 'Sleep, stress, and body health indicators.',   color: '#7C6FFF' },
  { name: 'PERFORMANCE', subtitle: 'Output, confidence, and training quality.',    color: '#FF6B35' },
]

const PHOTO_POSITIONS = ['front', 'back', 'left', 'right', 'flexed']

// ─── Helpers ──────────────────────────────────────────────────────────────
function effectiveScore(metric, value) {
  if (value === null || value === undefined) return null
  return metric.inverted ? 10 - value : value
}

function computeBiofeedbackScore(values) {
  let sum = 0
  let count = 0
  for (const m of METRICS) {
    const v = values[m.key]
    if (v !== null && v !== undefined) {
      sum += effectiveScore(m, v)
      count++
    }
  }
  if (count === 0) return null
  return Math.round((sum / (count * 10)) * 100)
}

function gradeBand(score) {
  if (score === null || score === undefined) return { label: '--', color: 'var(--muted)' }
  if (score >= 90) return { label: 'Elite',      color: 'var(--accent)' }
  if (score >= 80) return { label: 'Excellent',  color: 'var(--accent)' }
  if (score >= 70) return { label: 'Strong',     color: 'var(--accent)' }
  if (score >= 60) return { label: 'Solid',      color: 'var(--warn)' }
  if (score >= 50) return { label: 'Needs Work', color: 'var(--warn)' }
  return             { label: 'Struggling',      color: 'var(--danger)' }
}

function scoreColor(score) {
  if (score === null || score === undefined) return 'var(--muted)'
  if (score >= 80) return 'var(--accent)'
  if (score >= 60) return 'var(--warn)'
  return 'var(--danger)'
}

function metricEffColor(effVal) {
  if (effVal === null || effVal === undefined) return 'var(--muted)'
  if (effVal >= 7) return 'var(--accent)'
  if (effVal >= 4) return 'var(--warn)'
  return 'var(--danger)'
}

// ─── SVG Ring Gauge ───────────────────────────────────────────────────────
function RingGauge({ score, size = 120, animate = false }) {
  const [display, setDisplay] = useState(animate ? 0 : (score ?? 0))
  const radius = (size - 16) / 2
  const circ = 2 * Math.PI * radius
  const safeScore = score ?? 0
  const displayRounded = Math.round(display)
  const offset = circ - (displayRounded / 100) * circ
  const { label, color } = gradeBand(displayRounded)

  useEffect(() => {
    if (!animate || score === null) return
    setDisplay(0)
    const increment = Math.max(1, score / 60)
    const timer = setInterval(() => {
      setDisplay(prev => {
        const next = prev + increment
        if (next >= score) {
          clearInterval(timer)
          return score
        }
        return next
      })
    }, 16)
    return () => clearInterval(timer)
  }, [animate, score])

  useEffect(() => {
    if (!animate) setDisplay(safeScore)
  }, [animate, safeScore])

  return (
    <svg width={size} height={size} style={{ display: 'block', flexShrink: 0 }}>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="var(--s4)" strokeWidth={8}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke={scoreColor(score)}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
          transition: animate ? 'none' : 'stroke-dashoffset 0.6s ease',
        }}
      />
      <text
        x={size / 2} y={size / 2 - 4}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={scoreColor(score)}
        fontFamily="var(--font-display)"
        fontSize={size * 0.22}
      >
        {score !== null ? displayRounded : '--'}
      </text>
      <text
        x={size / 2} y={size / 2 + size * 0.18}
        textAnchor="middle"
        fill="var(--muted)"
        fontFamily="var(--font-display)"
        fontSize={size * 0.12}
      >
        /100
      </text>
      <text
        x={size / 2} y={size - 4}
        textAnchor="middle"
        fill={color}
        fontFamily="var(--font-display)"
        fontSize={size * 0.11}
      >
        {score !== null ? label : ''}
      </text>
    </svg>
  )
}

// ─── Metric Picker ────────────────────────────────────────────────────────
function MetricPicker({ metric, value, onChange }) {
  const effVal = effectiveScore(metric, value)
  const col = metricEffColor(effVal)

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ flex: 1, paddingRight: 12 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            color: 'var(--white)',
            letterSpacing: '0.05em',
          }}>
            {metric.label}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{metric.hint}</div>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          color: value !== null && value !== undefined ? col : 'var(--muted)',
          minWidth: 32,
          textAlign: 'right',
          lineHeight: 1,
        }}>
          {value !== null && value !== undefined ? value : '--'}
        </div>
      </div>

      {/* Button row 0–10 */}
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: 11 }, (_, i) => {
          const isSelected = value === i
          const isFilled = value !== null && value !== undefined && i <= value
          return (
            <button
              key={i}
              onClick={() => onChange(isSelected ? null : i)}
              style={{
                flex: 1,
                height: 28,
                borderRadius: 4,
                border: isSelected ? `2px solid ${metric.color}` : '1px solid var(--border)',
                background: isSelected
                  ? metric.color
                  : isFilled
                    ? `${metric.color}44`
                    : 'var(--s4)',
                color: isSelected ? 'var(--ink)' : isFilled ? metric.color : 'var(--muted)',
                fontFamily: 'var(--font-display)',
                fontSize: 11,
                cursor: 'pointer',
                transition: 'all 0.1s',
                padding: 0,
                minWidth: 0,
              }}
            >
              {i}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
        <span style={{ fontSize: 10, color: 'var(--muted)' }}>
          {metric.inverted ? 'Very Stressed' : 'Very Low'}
        </span>
        <span style={{ fontSize: 10, color: 'var(--muted)' }}>
          {metric.inverted ? 'Fully Relaxed' : 'Excellent'}
        </span>
      </div>
    </div>
  )
}

// ─── Live Score Banner ────────────────────────────────────────────────────
function ScoreBanner({ values, score, weekNumber }) {
  const answeredCount = METRICS.filter(m => {
    const v = values[m.key]
    return v !== null && v !== undefined
  }).length

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <RingGauge score={score} size={90} />
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 11,
            color: 'var(--muted)',
            letterSpacing: '0.12em',
            marginBottom: 8,
          }}>
            WEEK {weekNumber} LIVE SCORE
          </div>
          {/* 11 dot indicators */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
            {METRICS.map(m => {
              const v = values[m.key]
              const eff = effectiveScore(m, v)
              const dotColor = eff === null ? 'var(--s4)' : metricEffColor(eff)
              return (
                <div
                  key={m.key}
                  title={m.label}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: dotColor,
                    border: eff === null ? '1px solid var(--border)' : 'none',
                    flexShrink: 0,
                  }}
                />
              )
            })}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            {answeredCount} of 11 metrics logged
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Score Reveal ─────────────────────────────────────────────────────────
function ScoreReveal({ score, values, weekNumber }) {
  const { label, color } = gradeBand(score)

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--ink)',
      zIndex: 1000,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 16px 60px',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 12,
        color: 'var(--muted)',
        letterSpacing: '0.15em',
        marginBottom: 24,
      }}>
        WEEK {weekNumber} CHECK-IN SUBMITTED
      </div>

      <RingGauge score={score} size={180} animate />

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 24,
        color,
        marginTop: 16,
        letterSpacing: '0.1em',
      }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
        This Week's Biofeedback Score
      </div>

      {/* Breakdown card */}
      <div className="card" style={{ width: '100%', maxWidth: 480, marginTop: 32 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 12,
          color: 'var(--muted)',
          letterSpacing: '0.1em',
          marginBottom: 16,
        }}>
          BREAKDOWN
        </div>
        {METRICS.map(m => {
          const v = values[m.key]
          if (v === null || v === undefined) return null
          const eff = effectiveScore(m, v)
          const col = metricEffColor(eff)
          return (
            <div key={m.key} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: 'var(--white)' }}>{m.label}</span>
                <span style={{ fontSize: 12, fontFamily: 'var(--font-display)', color: col }}>{v}/10</span>
              </div>
              <div style={{ height: 4, background: 'var(--s4)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${eff * 10}%`,
                  background: col,
                  borderRadius: 2,
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>
          )
        })}
      </div>

      <div style={{
        marginTop: 24,
        padding: '14px 20px',
        background: 'var(--s2)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        fontSize: 13,
        color: 'var(--muted)',
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
        lineHeight: 1.6,
      }}>
        ✓ Check-in submitted. Your coach will review and reply shortly.
      </div>
    </div>
  )
}

// ─── Weekly Nutrition Summary ─────────────────────────────────────────────
function WeekNutritionSummary({ logs, targets }) {
  if (!logs || logs.length === 0) return null

  const daysLogged = logs.length
  const avgKcal    = Math.round(logs.reduce((s, l) => s + (l.total_kcal || 0), 0) / daysLogged)
  const avgProtein = Math.round(logs.reduce((s, l) => s + (l.total_protein_g || 0), 0) / daysLogged)
  const avgCarbs   = Math.round(logs.reduce((s, l) => s + (l.total_carbs_g || 0), 0) / daysLogged)
  const avgFat     = Math.round(logs.reduce((s, l) => s + (l.total_fat_g || 0), 0) / daysLogged)

  // Use training day target as reference
  const targetDay  = targets?.day_types?.find(d => d.day_type === 'training' || d.label === 'training')
  const targetKcal = targetDay?.kcal
  const compliance = targetKcal ? Math.round((avgKcal / targetKcal) * 100) : null
  const compColor  = compliance == null ? 'var(--muted)' : compliance >= 90 ? 'var(--accent)' : compliance >= 70 ? 'var(--warn)' : 'var(--danger)'

  return (
    <div className="card" style={{ marginBottom: 16, borderLeft: '3px solid #00C896' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.12em', color: 'var(--muted)' }}>
          THIS WEEK'S NUTRITION
        </div>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5,
          color: 'var(--accent)', background: 'var(--accent-dim)',
          border: '1px solid rgba(0,200,150,.25)', borderRadius: 4, padding: '2px 8px',
        }}>
          {daysLogged}/7 DAYS LOGGED
        </span>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'AVG KCAL',    val: avgKcal,    unit: '',  color: compliance != null ? compColor : 'var(--white)' },
          { label: 'AVG PROTEIN', val: `${avgProtein}g`, unit: '', color: 'var(--accent)' },
          { label: 'AVG CARBS',   val: `${avgCarbs}g`,  unit: '', color: 'var(--info)' },
          { label: 'AVG FAT',     val: `${avgFat}g`,    unit: '', color: 'var(--warn)' },
        ].map(item => (
          <div key={item.label} style={{ flex: '1 1 80px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: item.color, lineHeight: 1 }}>{item.val}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5, color: 'var(--muted)', marginTop: 3 }}>{item.label}</div>
          </div>
        ))}
        {compliance != null && (
          <div style={{ flex: '1 1 80px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: compColor, lineHeight: 1 }}>{compliance}%</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5, color: 'var(--muted)', marginTop: 3 }}>VS TARGET</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main CheckIn Page ────────────────────────────────────────────────────
export default function CheckIn() {
  const { user } = useAuth()
  const { program } = useClient()

  const weekNumber = program?.current_week || 1

  // Weekly nutrition data
  const [weekNutritionLogs, setWeekNutritionLogs]    = useState([])
  const [weekNutritionTargets, setWeekNutritionTargets] = useState(null)

  useEffect(() => {
    if (!user) return
    const end   = new Date().toISOString().split('T')[0]
    const start = new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0]
    getNutritionLogsRange(user.id, start, end).then(({ data }) => setWeekNutritionLogs(data || []))
    getActiveNutritionPlan(user.id).then(({ data }) => setWeekNutritionTargets(data))
  }, [user])

  // Form state
  const [checkinType, setCheckinType] = useState('express')
  const [bodyWeight, setBodyWeight] = useState('')
  const [urgency, setUrgency] = useState(null)
  const [clientNote, setClientNote] = useState('')
  const [photos, setPhotos] = useState({})
  const [uploading, setUploading] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [finalValues, setFinalValues] = useState(null)
  const [finalScore, setFinalScore] = useState(null)

  // Metric values — all start as null
  const [values, setValues] = useState(() =>
    Object.fromEntries(METRICS.map(m => [m.key, null]))
  )

  const score = computeBiofeedbackScore(values)

  // Lowest-scoring areas for note placeholder
  const scoredMetrics = METRICS
    .map(m => ({ ...m, eff: effectiveScore(m, values[m.key]) }))
    .filter(m => m.eff !== null)
    .sort((a, b) => a.eff - b.eff)
  const lowestAreas = scoredMetrics.slice(0, 3).map(m => m.label)
  const notePlaceholder = lowestAreas.length > 0
    ? `Lowest areas: ${lowestAreas.join(', ')}. Add any context or notes for your coach...`
    : 'Add any notes for your coach this week...'

  function setMetric(key, val) {
    setValues(prev => ({ ...prev, [key]: val }))
  }

  async function handlePhotoUpload(position, file) {
    if (!file || !user) return
    setUploading(prev => ({ ...prev, [position]: true }))
    const url = await uploadCheckInPhoto(user.id, weekNumber, position, file)
    setUploading(prev => ({ ...prev, [position]: false }))
    if (url) {
      setPhotos(prev => ({ ...prev, [position]: url }))
    }
  }

  async function handleSubmit() {
    if (!user) return
    setSubmitting(true)
    setSubmitError('')

    const computedScore = computeBiofeedbackScore(values)

    const payload = {
      client_id: user.id,
      week_number: weekNumber,
      checkin_type: checkinType,
      body_weight_kg: bodyWeight !== '' ? parseFloat(bodyWeight) : null,
      urgency: urgency,
      client_note: clientNote || null,
      biofeedback_score: computedScore,
      lowest_areas_note: lowestAreas.length > 0 ? lowestAreas.join(', ') : null,
      photos: Object.keys(photos).length > 0 ? photos : null,
      submitted_at: new Date().toISOString(),
    }

    // Attach all metric values
    for (const m of METRICS) {
      payload[m.key] = values[m.key] !== null && values[m.key] !== undefined ? values[m.key] : null
    }

    const { error } = await submitCheckIn(payload)
    setSubmitting(false)

    if (error) {
      setSubmitError(error.message || 'Failed to submit check-in. Please try again.')
      return
    }

    setFinalScore(computedScore)
    setFinalValues({ ...values })
    setSubmitted(true)

    // Fire-and-forget email notification to coach
    notifyCoachCheckIn({
      clientId: user.id,
      weekNumber,
      biofeedbackScore: computedScore,
      bodyWeight: bodyWeight !== '' ? parseFloat(bodyWeight) : null,
      urgency,
      lowestAreasNote: lowestAreas.length > 0 ? lowestAreas.join(', ') : null,
    })
  }

  if (submitted && finalValues !== null) {
    return (
      <ScoreReveal
        score={finalScore}
        values={finalValues}
        weekNumber={weekNumber}
      />
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 0 80px' }}>
      {/* Page header */}
      <div className="page-header">
        <div className="page-title">Weekly Check-In</div>
        <div className="page-subtitle">Week {weekNumber} — Track your biofeedback</div>
      </div>

      {/* Live score banner */}
      <ScoreBanner values={values} score={score} weekNumber={weekNumber} />

      {/* ── 1. Setup card ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 12,
          color: 'var(--muted)',
          letterSpacing: '0.12em',
          marginBottom: 16,
        }}>
          CHECK-IN SETUP
        </div>

        {/* Type toggle */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 11,
          color: 'var(--muted)',
          letterSpacing: '0.08em',
          marginBottom: 8,
        }}>
          CHECK-IN TYPE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          {[
            { key: 'express',       label: 'Express',       sub: 'Quick biofeedback only' },
            { key: 'comprehensive', label: 'Comprehensive', sub: 'Biofeedback + photos' },
          ].map(opt => (
            <div
              key={opt.key}
              onClick={() => setCheckinType(opt.key)}
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                border: checkinType === opt.key
                  ? '2px solid var(--accent)'
                  : '1px solid var(--border)',
                background: checkinType === opt.key ? 'rgba(0,200,150,0.07)' : 'var(--s2)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                color: checkinType === opt.key ? 'var(--accent)' : 'var(--white)',
              }}>
                {opt.label}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{opt.sub}</div>
            </div>
          ))}
        </div>

        {/* Body weight */}
        <div style={{ marginBottom: 20 }}>
          <div className="label" style={{ marginBottom: 6 }}>Body Weight (kg) — optional</div>
          <input
            type="number"
            className="input"
            placeholder="e.g. 78.5"
            value={bodyWeight}
            onChange={e => setBodyWeight(e.target.value)}
            step="0.1"
          />
        </div>

        {/* Urgency */}
        <div>
          <div className="label" style={{ marginBottom: 8 }}>How are you feeling this week?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { key: 'all_good',      label: "I'm all good ✅",     color: 'var(--accent)' },
              { key: 'few_questions', label: 'A few questions 🙋',   color: 'var(--warn)' },
              { key: 'need_help',     label: 'I need help ASAP 🚨',  color: 'var(--danger)' },
            ].map(opt => (
              <div
                key={opt.key}
                onClick={() => setUrgency(urgency === opt.key ? null : opt.key)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: urgency === opt.key
                    ? `2px solid ${opt.color}`
                    : '1px solid var(--border)',
                  background: urgency === opt.key ? `${opt.color}18` : 'var(--s2)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: urgency === opt.key ? opt.color : 'var(--white)',
                  transition: 'all 0.15s',
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Weekly nutrition snapshot ── */}
      <WeekNutritionSummary logs={weekNutritionLogs} targets={weekNutritionTargets} />

      {/* ── 2. Metric group cards ── */}
      {GROUPS.map(group => {
        const groupMetrics = METRICS.filter(m => m.group === group.name)
        return (
          <div key={group.name} className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 3,
                height: 20,
                background: group.color,
                borderRadius: 2,
                flexShrink: 0,
              }} />
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                color: group.color,
                letterSpacing: '0.1em',
              }}>
                {group.name}
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>
              {group.subtitle}
            </div>
            {groupMetrics.map(m => (
              <MetricPicker
                key={m.key}
                metric={m}
                value={values[m.key]}
                onChange={val => setMetric(m.key, val)}
              />
            ))}
          </div>
        )
      })}

      {/* ── 3. Note card ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 12,
          color: 'var(--muted)',
          letterSpacing: '0.12em',
          marginBottom: 12,
        }}>
          NOTES FOR COACH
        </div>
        <textarea
          className="input"
          rows={4}
          placeholder={notePlaceholder}
          value={clientNote}
          onChange={e => setClientNote(e.target.value)}
        />
      </div>

      {/* ── 4. Photos card (comprehensive only) ── */}
      {checkinType === 'comprehensive' && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 12,
            color: 'var(--muted)',
            letterSpacing: '0.12em',
            marginBottom: 4,
          }}>
            PROGRESS PHOTOS
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
            Upload photos for each position. All positions are optional.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
            {PHOTO_POSITIONS.map(pos => (
              <div key={pos} style={{ textAlign: 'center' }}>
                <label
                  style={{
                    display: 'block',
                    width: '100%',
                    aspectRatio: '3/4',
                    borderRadius: 6,
                    border: photos[pos]
                      ? '2px solid var(--accent)'
                      : '1px dashed var(--border)',
                    background: 'var(--s2)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {photos[pos] ? (
                    <img
                      src={photos[pos]}
                      alt={pos}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : uploading[pos] ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    }}>
                      <div className="spinner" style={{ width: 16, height: 16 }} />
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      fontSize: 22,
                      color: 'var(--muted)',
                    }}>
                      +
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={e => e.target.files[0] && handlePhotoUpload(pos, e.target.files[0])}
                  />
                </label>
                <div style={{
                  fontSize: 9,
                  color: 'var(--muted)',
                  marginTop: 4,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.05em',
                }}>
                  {pos.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 5. Submit section ── */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
          <RingGauge score={score} size={80} />
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 11,
              color: 'var(--muted)',
              letterSpacing: '0.1em',
            }}>
              CURRENT SCORE
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              color: scoreColor(score),
              lineHeight: 1.1,
            }}>
              {score !== null ? score : '--'}
            </div>
            {score !== null && (
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 12,
                color: gradeBand(score).color,
              }}>
                {gradeBand(score).label}
              </div>
            )}
          </div>
        </div>

        {submitError && (
          <div style={{
            color: 'var(--danger)',
            fontSize: 13,
            marginBottom: 12,
            padding: '8px 12px',
            background: 'rgba(255,59,48,0.1)',
            borderRadius: 6,
            border: '1px solid rgba(255,59,48,0.2)',
          }}>
            {submitError}
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ width: '100%', fontSize: 14 }}
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'SUBMITTING...' : `SUBMIT WEEK ${weekNumber} CHECK-IN`}
        </button>
      </div>
    </div>
  )
}
