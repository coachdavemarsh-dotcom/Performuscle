import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase.js'

// ── Phase definitions ─────────────────────────────────────────────────────────

const PHASES = {
  menstrual: {
    name: 'Menstrual', color: '#ef4444', bgColor: 'rgba(239,68,68,.1)',
    days: '1–5', icon: '🔴',
    hormones: 'Oestrogen & progesterone at their lowest. Prostaglandins cause uterine contractions.',
    energy: 'Lower — fatigue common, especially days 1–2.',
    training: 'Light to moderate movement is fine and often helpful. Reduce intensity if experiencing significant pain. Mobility, walking, yoga, or lighter resistance work. Forced rest is not necessary — tune into the body.',
    nutrition: 'Iron-rich foods to replace losses (red meat, spinach, legumes, pumpkin seeds). Anti-inflammatory foods (fatty fish, turmeric, ginger). Maintain hydration. Magnesium may ease cramping.',
    coachNote: 'Do not push heavy loads on days 1–2. Adjust session targets rather than skipping altogether.',
  },
  follicular: {
    name: 'Follicular', color: '#f472b6', bgColor: 'rgba(244,114,182,.1)',
    days: '6–13', icon: '🌸',
    hormones: 'Oestrogen rising steadily. FSH stimulating follicle development. Testosterone starting to rise.',
    energy: 'Rising — mood, motivation and focus improving.',
    training: 'Ideal phase for progressive overload and learning new movements. Motor patterns are laid down more effectively. Build volume, increase loads, introduce complex technique work.',
    nutrition: 'Higher carbohydrate tolerance — fuel sessions well. Metabolic rate is at its lowest so slight caloric efficiency is common. Lean proteins, complex carbs.',
    coachNote: 'Best phase for introducing new exercises or skills. Schedule technique work and volume blocks here.',
  },
  ovulatory: {
    name: 'Ovulatory', color: '#f59e0b', bgColor: 'rgba(245,158,11,.1)',
    days: '14–16', icon: '⚡',
    hormones: 'Oestrogen peaks then LH surge triggers ovulation. Testosterone also peaks briefly.',
    energy: 'Peak — highest energy, strength and power output of the cycle.',
    training: 'Best time for max effort, 1RM testing, and high-intensity work. Peak power output. Schedule the hardest sessions here. Note: ligament laxity is slightly higher around ovulation — warm up thoroughly.',
    nutrition: 'Cruciferous vegetables (broccoli, cauliflower) support oestrogen metabolism. Maintain fibre intake. Anti-oxidant rich foods. Adequate protein.',
    coachNote: 'Schedule strength tests and max effort sessions in this window. Warm up well — ligament laxity is elevated.',
  },
  luteal: {
    name: 'Luteal', color: '#8b5cf6', bgColor: 'rgba(139,92,246,.1)',
    days: '17–28', icon: '🌙',
    hormones: 'Progesterone dominant. Oestrogen has a secondary peak (days 17–21) then both fall sharply before menstruation.',
    energy: 'Variable — early luteal often good, late luteal energy drops. PMS symptoms in final days.',
    training: 'Early luteal (days 17–21): strength work holds well, good for hypertrophy focus. Late luteal (days 22–28): reduce intensity, prioritise recovery, more rest between sessions.',
    nutrition: 'Caloric needs genuinely increase by 100–300 kcal/day — this is physiological, not a failure. Higher fat and protein. Complex carbs manage cravings. Magnesium (300–400mg) helps PMS. Reduce sodium for bloating. Limit caffeine and alcohol.',
    coachNote: 'Increased caloric target in late luteal is evidence-based. Adjust nutrition targets accordingly in this phase.',
  },
}

function getPhaseInfo(lastPeriodStart, cycleLength, periodLength) {
  if (!lastPeriodStart) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(lastPeriodStart)
  start.setHours(0, 0, 0, 0)
  const daysSince = Math.floor((today - start) / (1000 * 60 * 60 * 24))
  const cycleDay = (daysSince % cycleLength) + 1
  const daysUntilNext = cycleLength - cycleDay + 1

  let phase
  if (cycleDay <= periodLength) phase = 'menstrual'
  else if (cycleDay <= 13) phase = 'follicular'
  else if (cycleDay <= 16) phase = 'ovulatory'
  else phase = 'luteal'

  return { phase, cycleDay, daysUntilNext, phaseInfo: PHASES[phase] }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PhaseRing({ cycleDay, cycleLength, phaseColor }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const progress = cycleDay / cycleLength
  const dashOffset = circumference * (1 - progress)

  return (
    <div style={{ position: 'relative', width: 140, height: 140, flexShrink: 0 }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={phaseColor}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${phaseColor})`, transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 2,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          color: 'var(--white)',
          letterSpacing: 1,
          lineHeight: 1,
        }}>
          {cycleDay}
        </span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 9,
          color: 'var(--muted)',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}>
          of {cycleLength}
        </span>
      </div>
    </div>
  )
}

function ExpandableInfoCard({ title, content, color }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        background: 'var(--s3)',
        border: `1px solid ${open ? color : 'var(--border)'}`,
        borderRadius: 10,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          gap: 8,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 11,
          letterSpacing: 2,
          color: open ? color : 'var(--white)',
          textTransform: 'uppercase',
          transition: 'color 0.2s',
        }}>
          {title}
        </span>
        <span style={{
          color: 'var(--muted)',
          fontSize: 16,
          lineHeight: 1,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
          display: 'inline-block',
        }}>
          ›
        </span>
      </button>
      {open && (
        <div style={{
          padding: '0 16px 14px',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--muted)',
          lineHeight: 1.65,
          borderTop: `1px solid ${color}22`,
          paddingTop: 12,
        }}>
          {content}
        </div>
      )}
    </div>
  )
}

function EnergyStars({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 22,
            padding: '2px 3px',
            color: n <= (value || 0) ? '#f59e0b' : 'var(--border)',
            transition: 'color 0.15s',
            lineHeight: 1,
          }}
          title={`Energy: ${n}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function MoodButtons({ value, onChange }) {
  const moods = [
    { key: 'great', emoji: '😄', label: 'Great' },
    { key: 'good', emoji: '😊', label: 'Good' },
    { key: 'neutral', emoji: '😐', label: 'Neutral' },
    { key: 'low', emoji: '😔', label: 'Low' },
    { key: 'irritable', emoji: '😤', label: 'Irritable' },
  ]
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {moods.map(m => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          title={m.label}
          style={{
            background: value === m.key ? 'rgba(0,200,150,0.15)' : 'var(--s3)',
            border: `1px solid ${value === m.key ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 8,
            cursor: 'pointer',
            padding: '6px 10px',
            fontSize: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            transition: 'border-color 0.15s, background 0.15s',
          }}
        >
          <span>{m.emoji}</span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 8,
            color: value === m.key ? 'var(--accent)' : 'var(--muted)',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}>
            {m.label}
          </span>
        </button>
      ))}
    </div>
  )
}

function TrainingFeelButtons({ value, onChange }) {
  const opts = [
    { key: 'great', label: 'Great' },
    { key: 'good', label: 'Good' },
    { key: 'ok', label: 'OK' },
    { key: 'poor', label: 'Poor' },
    { key: 'rest', label: 'Rest Day' },
  ]
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {opts.map(o => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          style={{
            background: value === o.key ? 'rgba(0,200,150,0.15)' : 'var(--s3)',
            border: `1px solid ${value === o.key ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 6,
            cursor: 'pointer',
            padding: '5px 12px',
            fontFamily: 'var(--font-display)',
            fontSize: 10,
            letterSpacing: 1.5,
            color: value === o.key ? 'var(--accent)' : 'var(--muted)',
            textTransform: 'uppercase',
            transition: 'border-color 0.15s, color 0.15s, background 0.15s',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function CrampingButtons({ value, onChange }) {
  const opts = [
    { key: 'none', label: 'None' },
    { key: 'mild', label: 'Mild' },
    { key: 'moderate', label: 'Moderate' },
    { key: 'severe', label: 'Severe' },
  ]
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {opts.map(o => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          style={{
            background: value === o.key ? 'rgba(239,68,68,0.15)' : 'var(--s3)',
            border: `1px solid ${value === o.key ? '#ef4444' : 'var(--border)'}`,
            borderRadius: 6,
            cursor: 'pointer',
            padding: '5px 12px',
            fontFamily: 'var(--font-display)',
            fontSize: 10,
            letterSpacing: 1.5,
            color: value === o.key ? '#ef4444' : 'var(--muted)',
            textTransform: 'uppercase',
            transition: 'border-color 0.15s, color 0.15s, background 0.15s',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function CheckboxRow({ items, checked, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {items.map(item => {
        const active = checked.includes(item.key)
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            style={{
              background: active ? 'rgba(0,200,150,0.12)' : 'var(--s3)',
              border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 6,
              cursor: 'pointer',
              padding: '5px 11px',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: active ? 'var(--accent)' : 'var(--muted)',
              display: 'flex', alignItems: 'center', gap: 5,
              transition: 'all 0.15s',
            }}
          >
            <span style={{
              width: 12, height: 12,
              border: `1.5px solid ${active ? 'var(--accent)' : 'var(--muted)'}`,
              borderRadius: 3,
              background: active ? 'var(--accent)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.15s',
            }}>
              {active && <span style={{ color: 'var(--ink)', fontSize: 9, lineHeight: 1 }}>✓</span>}
            </span>
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

// ── Setup Screen ──────────────────────────────────────────────────────────────

function SetupScreen({ profile, onSaved }) {
  const [gender, setGender] = useState(profile?.gender || '')
  const [enableTracking, setEnableTracking] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSave() {
    if (!gender) { setError('Please select a gender option to continue.'); return }
    setSaving(true)
    setError(null)
    const { error: err } = await supabase
      .from('profiles')
      .update({ gender, cycle_tracking_enabled: enableTracking })
      .eq('id', profile.id)
    setSaving(false)
    if (err) { setError(err.message); return }
    onSaved({ ...profile, gender, cycle_tracking_enabled: enableTracking })
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 0' }}>
      <div className="card" style={{ padding: 28 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🌙</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            letterSpacing: 2,
            color: 'var(--white)',
            marginBottom: 8,
          }}>
            CYCLE TRACKER
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--muted)',
            lineHeight: 1.65,
            maxWidth: 380,
            margin: '0 auto',
          }}>
            Understand how your menstrual cycle affects energy, training performance and nutrition needs. Logging is private and used only to personalise your programme guidance.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="form-label">Gender</label>
            <select
              className="select"
              value={gender}
              onChange={e => setGender(e.target.value)}
            >
              <option value="">Select…</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non_binary">Non-binary</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          {(gender === 'female' || gender === 'non_binary') && (
            <div style={{
              background: 'var(--s3)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--white)',
                  marginBottom: 2,
                }}>
                  Enable cycle tracking
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--muted)',
                }}>
                  Adds cycle phase guidance to your dashboard
                </div>
              </div>
              <button
                onClick={() => setEnableTracking(t => !t)}
                style={{
                  width: 44, height: 24,
                  borderRadius: 12,
                  border: 'none',
                  cursor: 'pointer',
                  background: enableTracking ? 'var(--accent)' : 'var(--s5)',
                  position: 'relative',
                  flexShrink: 0,
                  transition: 'background 0.2s',
                }}
              >
                <span style={{
                  position: 'absolute',
                  top: 2,
                  left: enableTracking ? 22 : 2,
                  width: 20, height: 20,
                  borderRadius: '50%',
                  background: 'var(--white)',
                  transition: 'left 0.2s',
                  display: 'block',
                }} />
              </button>
            </div>
          )}

          {error && (
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              color: 'var(--danger)',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 6,
              padding: '8px 12px',
            }}>
              {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
            style={{ marginTop: 4 }}
          >
            {saving ? 'Saving…' : 'Save & Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Today Tab ─────────────────────────────────────────────────────────────────

const BOOLEAN_SYMPTOMS = [
  { key: 'bloating', label: 'Bloating' },
  { key: 'headache', label: 'Headache' },
  { key: 'fatigue', label: 'Fatigue' },
  { key: 'cravings', label: 'Cravings' },
  { key: 'breast_tenderness', label: 'Breast Tenderness' },
]

function TodayTab({ profile, lastPeriodStart, onLogSaved }) {
  const { user } = useAuth()
  const phaseData = getPhaseInfo(lastPeriodStart, profile.cycle_length, profile.period_length)

  const [symptoms, setSymptoms] = useState({
    energy: 0,
    mood: '',
    cramping: '',
    bloating: false,
    headache: false,
    fatigue: false,
    cravings: false,
    breast_tenderness: false,
    training_feel: '',
  })
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTodayLog() {
      setLoading(true)
      const { data } = await supabase
        .from('cycle_logs')
        .select('*')
        .eq('client_id', user.id)
        .eq('log_date', todayStr())
        .maybeSingle()
      if (data?.symptoms) {
        const s = data.symptoms
        setSymptoms({
          energy: s.energy || 0,
          mood: s.mood || '',
          cramping: s.cramping || '',
          bloating: !!s.bloating,
          headache: !!s.headache,
          fatigue: !!s.fatigue,
          cravings: !!s.cravings,
          breast_tenderness: !!s.breast_tenderness,
          training_feel: s.training_feel || '',
        })
        setNotes(data.notes || '')
      }
      setLoading(false)
    }
    loadTodayLog()
  }, [user.id])

  function toggleBoolean(key) {
    setSymptoms(s => ({ ...s, [key]: !s[key] }))
  }

  async function handleSave() {
    setSaving(true)
    const symptomPayload = {
      energy: symptoms.energy,
      mood: symptoms.mood,
      cramping: symptoms.cramping,
      bloating: symptoms.bloating,
      headache: symptoms.headache,
      fatigue: symptoms.fatigue,
      cravings: symptoms.cravings,
      breast_tenderness: symptoms.breast_tenderness,
      training_feel: symptoms.training_feel,
    }
    await supabase.from('cycle_logs').upsert({
      client_id: user.id,
      log_date: todayStr(),
      symptoms: symptomPayload,
      notes,
    }, { onConflict: 'client_id,log_date' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    if (onLogSaved) onLogSaved()
  }

  if (!phaseData) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">No period logged yet</div>
        <div className="empty-state-text">
          Go to the "Log Period" tab and log the start of your last period to see your cycle phase.
        </div>
      </div>
    )
  }

  const { phase, cycleDay, daysUntilNext, phaseInfo } = phaseData

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Phase hero card */}
      <div
        className="card"
        style={{
          padding: 24,
          background: phaseInfo.bgColor,
          border: `1px solid ${phaseInfo.color}44`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <PhaseRing
            cycleDay={cycleDay}
            cycleLength={profile.cycle_length}
            phaseColor={phaseInfo.color}
          />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 24 }}>{phaseInfo.icon}</span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 9,
                letterSpacing: 2.5,
                color: phaseInfo.color,
                textTransform: 'uppercase',
                background: `${phaseInfo.color}22`,
                border: `1px solid ${phaseInfo.color}44`,
                padding: '3px 10px',
                borderRadius: 20,
              }}>
                {phaseInfo.name} Phase
              </span>
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              color: 'var(--white)',
              letterSpacing: 1,
              lineHeight: 1,
              marginBottom: 6,
            }}>
              Day {cycleDay}
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 9,
                  letterSpacing: 2,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  marginBottom: 2,
                }}>
                  Typical Days
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--white)',
                }}>
                  {phaseInfo.days}
                </div>
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 9,
                  letterSpacing: 2,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  marginBottom: 2,
                }}>
                  Next Period
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--white)',
                }}>
                  ~{daysUntilNext} day{daysUntilNext !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ExpandableInfoCard
          title="Hormones"
          content={phaseInfo.hormones}
          color={phaseInfo.color}
        />
        <ExpandableInfoCard
          title="Training"
          content={phaseInfo.training}
          color={phaseInfo.color}
        />
        <ExpandableInfoCard
          title="Nutrition"
          content={phaseInfo.nutrition}
          color={phaseInfo.color}
        />
      </div>

      {/* Coach note */}
      <div className="coach-note">
        <strong>Coach Note:</strong> {phaseInfo.coachNote}
      </div>

      {/* Symptom log */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 12,
          letterSpacing: 2,
          color: 'var(--white)',
          marginBottom: 18,
          textTransform: 'uppercase',
        }}>
          Today's Log
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
            <div className="spinner" />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Energy */}
            <div>
              <label className="form-label">Energy Level</label>
              <EnergyStars
                value={symptoms.energy}
                onChange={v => setSymptoms(s => ({ ...s, energy: v }))}
              />
            </div>

            {/* Mood */}
            <div>
              <label className="form-label">Mood</label>
              <MoodButtons
                value={symptoms.mood}
                onChange={v => setSymptoms(s => ({ ...s, mood: v }))}
              />
            </div>

            {/* Cramping — always visible but contextual */}
            <div>
              <label className="form-label">
                Cramping {phase !== 'menstrual' && (
                  <span style={{ color: 'var(--muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                    (optional)
                  </span>
                )}
              </label>
              <CrampingButtons
                value={symptoms.cramping}
                onChange={v => setSymptoms(s => ({ ...s, cramping: v === s.cramping ? '' : v }))}
              />
            </div>

            {/* Boolean symptoms */}
            <div>
              <label className="form-label">Symptoms</label>
              <CheckboxRow
                items={BOOLEAN_SYMPTOMS}
                checked={BOOLEAN_SYMPTOMS.filter(i => symptoms[i.key]).map(i => i.key)}
                onChange={key => toggleBoolean(key)}
              />
            </div>

            {/* Training feel */}
            <div>
              <label className="form-label">Training Feel</label>
              <TrainingFeelButtons
                value={symptoms.training_feel}
                onChange={v => setSymptoms(s => ({ ...s, training_feel: v === s.training_feel ? '' : v }))}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="form-label">Notes</label>
              <textarea
                className="input"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Anything else worth noting today…"
                rows={3}
                style={{ resize: 'vertical', minHeight: 72 }}
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Today\'s Log'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Log Period Tab ─────────────────────────────────────────────────────────────

function LogPeriodTab({ profile, periodLogs, onRefresh }) {
  const { user } = useAuth()
  const [flow, setFlow] = useState('medium')
  const [saving, setSaving] = useState(false)
  const [confirmEnd, setConfirmEnd] = useState(false)

  // Find if period is currently active (last log was a period day within last 14 days)
  const today = todayStr()
  const activePeriod = periodLogs.find(l => l.is_period_day && l.period_start === l.log_date)
  const latestPeriodStart = periodLogs.find(l => l.period_start)?.period_start || null

  // Check if today is already logged as period day
  const todayLog = periodLogs.find(l => l.log_date === today)
  const periodStarted = !!latestPeriodStart && (() => {
    const start = new Date(latestPeriodStart + 'T00:00:00')
    const now = new Date(today + 'T00:00:00')
    const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24))
    return diff < 14
  })()

  async function handleStartPeriod() {
    setSaving(true)
    await supabase.from('cycle_logs').upsert({
      client_id: user.id,
      log_date: today,
      is_period_day: true,
      period_start: today,
      flow_intensity: flow,
      symptoms: {},
    }, { onConflict: 'client_id,log_date' })
    setSaving(false)
    onRefresh()
  }

  async function handleEndPeriod() {
    setSaving(true)
    await supabase.from('cycle_logs').upsert({
      client_id: user.id,
      log_date: today,
      is_period_day: false,
      symptoms: {},
    }, { onConflict: 'client_id,log_date' })
    setSaving(false)
    setConfirmEnd(false)
    onRefresh()
  }

  async function handleLogFlowUpdate(newFlow) {
    setFlow(newFlow)
    if (periodStarted) {
      await supabase.from('cycle_logs').upsert({
        client_id: user.id,
        log_date: today,
        is_period_day: true,
        period_start: latestPeriodStart,
        flow_intensity: newFlow,
        symptoms: todayLog?.symptoms || {},
      }, { onConflict: 'client_id,log_date' })
    }
  }

  const flowOpts = [
    { key: 'spotting', label: 'Spotting' },
    { key: 'light', label: 'Light' },
    { key: 'medium', label: 'Medium' },
    { key: 'heavy', label: 'Heavy' },
  ]

  // Compute estimated next period
  const avgCycleLength = profile.cycle_length
  let estimatedNext = null
  if (latestPeriodStart) {
    const start = new Date(latestPeriodStart + 'T00:00:00')
    start.setDate(start.getDate() + avgCycleLength)
    estimatedNext = start.toISOString().slice(0, 10)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Period controls */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 12,
          letterSpacing: 2,
          color: 'var(--white)',
          marginBottom: 16,
          textTransform: 'uppercase',
        }}>
          Period Status
        </div>

        {!periodStarted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--muted)',
              margin: 0,
            }}>
              Log the start of your period to track your cycle and receive phase-specific guidance.
            </p>
            <div>
              <label className="form-label">Flow Intensity</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {flowOpts.map(o => (
                  <button
                    key={o.key}
                    onClick={() => setFlow(o.key)}
                    style={{
                      background: flow === o.key ? 'rgba(239,68,68,0.15)' : 'var(--s3)',
                      border: `1px solid ${flow === o.key ? '#ef4444' : 'var(--border)'}`,
                      borderRadius: 6,
                      cursor: 'pointer',
                      padding: '5px 13px',
                      fontFamily: 'var(--font-display)',
                      fontSize: 10,
                      letterSpacing: 1.5,
                      color: flow === o.key ? '#ef4444' : 'var(--muted)',
                      textTransform: 'uppercase',
                      transition: 'all 0.15s',
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleStartPeriod}
              disabled={saving}
              style={{ background: '#ef4444', boxShadow: '0 0 12px rgba(239,68,68,0.25)' }}
            >
              {saving ? 'Logging…' : '🔴 Start Period'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 8,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <span style={{ fontSize: 18 }}>🔴</span>
              <div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--white)',
                }}>
                  Period in progress
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  color: 'var(--muted)',
                }}>
                  Started {formatDate(latestPeriodStart)}
                </div>
              </div>
            </div>
            <div>
              <label className="form-label">Today's Flow</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {flowOpts.map(o => (
                  <button
                    key={o.key}
                    onClick={() => handleLogFlowUpdate(o.key)}
                    style={{
                      background: flow === o.key ? 'rgba(239,68,68,0.15)' : 'var(--s3)',
                      border: `1px solid ${flow === o.key ? '#ef4444' : 'var(--border)'}`,
                      borderRadius: 6,
                      cursor: 'pointer',
                      padding: '5px 13px',
                      fontFamily: 'var(--font-display)',
                      fontSize: 10,
                      letterSpacing: 1.5,
                      color: flow === o.key ? '#ef4444' : 'var(--muted)',
                      textTransform: 'uppercase',
                      transition: 'all 0.15s',
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
            {!confirmEnd ? (
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmEnd(true)}
                disabled={saving}
              >
                End Period
              </button>
            ) : (
              <div style={{
                background: 'var(--s3)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'var(--white)',
                  margin: 0,
                }}>
                  Confirm period has ended?
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleEndPeriod}
                    disabled={saving}
                    style={{ background: '#ef4444' }}
                  >
                    {saving ? '…' : 'Yes, End Period'}
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setConfirmEnd(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Estimated next period */}
      {estimatedNext && (
        <div className="card" style={{ padding: 16 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 9,
            letterSpacing: 2,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            Estimated Next Period
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            color: 'var(--white)',
            letterSpacing: 1,
          }}>
            {formatDate(estimatedNext)}
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: 'var(--muted)',
            marginTop: 2,
          }}>
            Based on your {avgCycleLength}-day average cycle
          </div>
        </div>
      )}

      {/* Recent period logs */}
      {periodLogs.filter(l => l.period_start).length > 0 && (
        <div className="card" style={{ padding: 20 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 12,
            letterSpacing: 2,
            color: 'var(--white)',
            marginBottom: 14,
            textTransform: 'uppercase',
          }}>
            Recent Periods
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {periodLogs
              .filter(l => l.period_start)
              .slice(0, 6)
              .map(log => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'var(--s3)',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: 'var(--white)',
                  }}>
                    {formatDate(log.period_start)}
                  </div>
                  {log.flow_intensity && (
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 9,
                      letterSpacing: 1.5,
                      color: '#ef4444',
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: 4,
                      padding: '2px 8px',
                      textTransform: 'uppercase',
                    }}>
                      {log.flow_intensity}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── History Tab ────────────────────────────────────────────────────────────────

function HistoryTab({ profile, allLogs }) {
  // Build cycle history from period_start logs
  const periodStarts = allLogs
    .filter(l => l.period_start && l.log_date === l.period_start)
    .map(l => l.period_start)
    .sort((a, b) => a < b ? -1 : 1)

  const cycles = periodStarts.map((start, i) => {
    const nextStart = periodStarts[i + 1]
    const cycleLen = nextStart
      ? Math.floor((new Date(nextStart + 'T00:00:00') - new Date(start + 'T00:00:00')) / (1000 * 60 * 60 * 24))
      : null
    // Period days count: find consecutive is_period_day rows from start
    const periodDays = allLogs.filter(l => {
      if (!l.is_period_day) return false
      const d = new Date(l.log_date + 'T00:00:00')
      const s = new Date(start + 'T00:00:00')
      const diff = Math.floor((d - s) / (1000 * 60 * 60 * 24))
      return diff >= 0 && diff < 14
    }).length
    return { start, cycleLen, periodDays }
  })

  const validLengths = cycles.filter(c => c.cycleLen !== null).map(c => c.cycleLen)
  const avgLen = validLengths.length > 0
    ? Math.round(validLengths.reduce((a, b) => a + b, 0) / validLengths.length)
    : null
  const minLen = validLengths.length > 0 ? Math.min(...validLengths) : null
  const maxLen = validLengths.length > 0 ? Math.max(...validLengths) : null

  const barMax = maxLen || profile.cycle_length
  const barWidth = 200

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Stats */}
      {avgLen !== null && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <div className="stat-card">
            <div className="stat-value">{avgLen}</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 9,
              letterSpacing: 1.5,
              color: 'var(--muted)',
              textTransform: 'uppercase',
            }}>Avg Length</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{minLen}</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 9,
              letterSpacing: 1.5,
              color: 'var(--muted)',
              textTransform: 'uppercase',
            }}>Shortest</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{maxLen}</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 9,
              letterSpacing: 1.5,
              color: 'var(--muted)',
              textTransform: 'uppercase',
            }}>Longest</div>
          </div>
        </div>
      )}

      {cycles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">No cycle history yet</div>
          <div className="empty-state-text">
            Log at least two period starts to see cycle history and statistics.
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 20 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 12,
            letterSpacing: 2,
            color: 'var(--white)',
            marginBottom: 16,
            textTransform: 'uppercase',
          }}>
            Cycle History
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cycles.slice().reverse().map((cycle, i) => (
              <div key={cycle.start}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: 'var(--white)',
                  }}>
                    {formatDate(cycle.start)}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {cycle.periodDays > 0 && (
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 9,
                        letterSpacing: 1,
                        color: '#ef4444',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: 4,
                        padding: '2px 7px',
                      }}>
                        {cycle.periodDays}d period
                      </span>
                    )}
                    {cycle.cycleLen !== null && (
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 9,
                        letterSpacing: 1,
                        color: 'var(--accent)',
                        background: 'var(--accent-dim)',
                        border: '1px solid rgba(0,200,150,0.2)',
                        borderRadius: 4,
                        padding: '2px 7px',
                      }}>
                        {cycle.cycleLen}d cycle
                      </span>
                    )}
                    {cycle.cycleLen === null && (
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 9,
                        letterSpacing: 1,
                        color: 'var(--muted)',
                      }}>
                        Current
                      </span>
                    )}
                  </div>
                </div>
                {/* Bar chart */}
                {cycle.cycleLen !== null && (
                  <div style={{
                    background: 'var(--s4)',
                    borderRadius: 4,
                    height: 6,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${Math.min(100, (cycle.cycleLen / (barMax + 4)) * 100)}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, var(--accent), var(--accent-hi))`,
                      borderRadius: 4,
                      transition: 'width 0.4s ease',
                    }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Settings Tab ──────────────────────────────────────────────────────────────

function SettingsTab({ profile, onProfileUpdate }) {
  const [cycleLength, setCycleLength] = useState(profile.cycle_length || 28)
  const [periodLength, setPeriodLength] = useState(profile.period_length || 5)
  const [gender, setGender] = useState(profile.gender || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [confirmDisable, setConfirmDisable] = useState(false)
  const [disabling, setDisabling] = useState(false)

  async function handleSave() {
    setSaving(true)
    await supabase
      .from('profiles')
      .update({ cycle_length: cycleLength, period_length: periodLength, gender })
      .eq('id', profile.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    onProfileUpdate({ ...profile, cycle_length: cycleLength, period_length: periodLength, gender })
  }

  async function handleDisable() {
    setDisabling(true)
    await supabase
      .from('profiles')
      .update({ cycle_tracking_enabled: false })
      .eq('id', profile.id)
    setDisabling(false)
    setConfirmDisable(false)
    onProfileUpdate({ ...profile, cycle_tracking_enabled: false })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card" style={{ padding: 20 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 12,
          letterSpacing: 2,
          color: 'var(--white)',
          marginBottom: 20,
          textTransform: 'uppercase',
        }}>
          Cycle Settings
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Gender */}
          <div>
            <label className="form-label">Gender</label>
            <select
              className="select"
              value={gender}
              onChange={e => setGender(e.target.value)}
            >
              <option value="">Select…</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="non_binary">Non-binary</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          {/* Cycle length slider */}
          <div>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Average Cycle Length</span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{cycleLength} days</span>
            </label>
            <input
              type="range"
              min={21}
              max={35}
              value={cycleLength}
              onChange={e => setCycleLength(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--muted)',
              marginTop: 4,
            }}>
              <span>21 days</span>
              <span>35 days</span>
            </div>
          </div>

          {/* Period length slider */}
          <div>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Average Period Length</span>
              <span style={{ color: '#ef4444', fontWeight: 700 }}>{periodLength} days</span>
            </label>
            <input
              type="range"
              min={3}
              max={8}
              value={periodLength}
              onChange={e => setPeriodLength(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ef4444', cursor: 'pointer' }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--muted)',
              marginTop: 4,
            }}>
              <span>3 days</span>
              <span>8 days</span>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Disable tracking */}
      <div className="card" style={{ padding: 20, border: '1px solid rgba(239,68,68,0.2)' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 12,
          letterSpacing: 2,
          color: 'var(--danger)',
          marginBottom: 10,
          textTransform: 'uppercase',
        }}>
          Disable Tracking
        </div>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--muted)',
          margin: '0 0 14px',
          lineHeight: 1.5,
        }}>
          Disabling will hide the cycle tracker from your navigation. Your log data will be preserved.
        </p>

        {!confirmDisable ? (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setConfirmDisable(true)}
            style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.3)' }}
          >
            Disable Cycle Tracking
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--white)',
              margin: 0,
            }}>
              Are you sure? You can re-enable this from the setup screen at any time.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-sm"
                onClick={handleDisable}
                disabled={disabling}
                style={{
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 14px',
                  fontFamily: 'var(--font-display)',
                  fontSize: 10,
                  letterSpacing: 1.5,
                  cursor: 'pointer',
                }}
              >
                {disabling ? '…' : 'Yes, Disable'}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setConfirmDisable(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

const TABS = [
  { key: 'today', label: 'Today' },
  { key: 'log', label: 'Log Period' },
  { key: 'history', label: 'History' },
  { key: 'settings', label: 'Settings' },
]

export default function CycleTracker() {
  const { user, profile: authProfile } = useAuth()
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('today')
  const [allLogs, setAllLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authProfile) setProfile(authProfile)
  }, [authProfile])

  useEffect(() => {
    if (!user) return
    loadLogs()
  }, [user])

  async function loadLogs() {
    const { data } = await supabase
      .from('cycle_logs')
      .select('*')
      .eq('client_id', user.id)
      .order('log_date', { ascending: false })
      .limit(200)
    setAllLogs(data || [])
    setLoading(false)
  }

  function handleProfileUpdate(updated) {
    setProfile(updated)
  }

  function handleSetupSaved(updated) {
    setProfile(updated)
  }

  if (loading || !profile) {
    return (
      <div className="flex-center" style={{ height: 200 }}>
        <div className="spinner" />
      </div>
    )
  }

  // Show setup if tracking not enabled or gender not set
  const needsSetup = !profile.cycle_tracking_enabled || !profile.gender
  if (needsSetup) {
    return <SetupScreen profile={profile} onSaved={handleSetupSaved} />
  }

  // Find last period start for phase calculation
  const lastPeriodLog = allLogs.find(l => l.period_start)
  const lastPeriodStart = lastPeriodLog?.period_start || null

  const periodLogs = allLogs.filter(l => l.is_period_day || l.period_start)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        gap: 2,
        background: 'var(--s3)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: 4,
      }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: 7,
              cursor: 'pointer',
              background: activeTab === tab.key ? 'var(--s5)' : 'transparent',
              color: activeTab === tab.key ? 'var(--white)' : 'var(--muted)',
              fontFamily: 'var(--font-display)',
              fontSize: 10,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              transition: 'all 0.15s',
              boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'today' && (
        <TodayTab
          profile={profile}
          lastPeriodStart={lastPeriodStart}
          onLogSaved={loadLogs}
        />
      )}
      {activeTab === 'log' && (
        <LogPeriodTab
          profile={profile}
          periodLogs={periodLogs}
          onRefresh={loadLogs}
        />
      )}
      {activeTab === 'history' && (
        <HistoryTab
          profile={profile}
          allLogs={allLogs}
        />
      )}
      {activeTab === 'settings' && (
        <SettingsTab
          profile={profile}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  )
}
