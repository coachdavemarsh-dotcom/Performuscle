import { useState } from 'react'

// ─── Constants ───────────────────────────────────────────────────────────────
const DAYS     = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_ABBR = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

const DIETARY_FILTERS = [
  { value: 'dairy-free',   label: 'Dairy-Free',   emoji: '🥛' },
  { value: 'gluten-free',  label: 'Gluten-Free',  emoji: '🌾' },
  { value: 'vegetarian',   label: 'Vegetarian',   emoji: '🥗' },
  { value: 'vegan',        label: 'Vegan',        emoji: '🌱' },
  { value: 'nut-free',     label: 'Nut-Free',     emoji: '🥜' },
  { value: 'egg-free',     label: 'Egg-Free',     emoji: '🥚' },
  { value: 'high-protein', label: 'High-Protein', emoji: '💪' },
  { value: 'low-carb',     label: 'Low-Carb',     emoji: '📉' },
]

const MEAL_TYPE_COLOURS = {
  'pre-workout':  '#f59e0b',
  'post-workout': '#00C896',
  'breakfast':    '#6366f1',
  'lunch':        '#3b82f6',
  'dinner':       '#8b5cf6',
  'snack':        '#ec4899',
}

const SHOPPING_ICONS = {
  'Protein & Meat':      '🥩',
  'Fish & Seafood':      '🐟',
  'Dairy & Eggs':        '🥚',
  'Grains & Carbs':      '🌾',
  'Produce':             '🥦',
  'Fats & Oils':         '🫒',
  'Condiments & Spices': '🧂',
  'Supplements & Other': '💊',
}

// Vite proxies /api → localhost:3001 in dev; set VITE_API_URL for production
const API_BASE = import.meta.env.VITE_API_URL || ''

// ─── Step header ──────────────────────────────────────────────────────────────
const TOTAL_STEPS = 4

function StepHeader({ step, title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div className="step-progress">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(n => (
          <div key={n} className="step-bar" style={{
            width: n < step ? 28 : n === step ? 48 : 12,
            background: n <= step ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
          }} />
        ))}
      </div>
      <div className="step-eyebrow">STEP {step} OF {TOTAL_STEPS}</div>
      <div className="step-title">{title.toUpperCase()}</div>
      {subtitle && <div className="step-sub">{subtitle}</div>}
    </div>
  )
}

// ─── TDEE Calculator (Step 1) ─────────────────────────────────────────────────
const ACTIVITY_LEVELS = [
  { value: 'sedentary',  label: 'Sedentary',        desc: 'Desk job, little or no exercise',      multiplier: 1.2   },
  { value: 'light',      label: 'Lightly Active',   desc: 'Light exercise 1–3 days/week',         multiplier: 1.375 },
  { value: 'moderate',   label: 'Moderately Active', desc: 'Moderate exercise 3–5 days/week',     multiplier: 1.55  },
  { value: 'active',     label: 'Very Active',       desc: 'Hard exercise 6–7 days/week',         multiplier: 1.725 },
  { value: 'veryActive', label: 'Athlete',           desc: 'Twice/day training or physical job',  multiplier: 1.9   },
]

const GOALS = [
  { value: 'lose',     label: '🔥 Lose Fat',      adjustment: -400 },
  { value: 'maintain', label: '⚖️  Maintain',      adjustment: 0    },
  { value: 'build',    label: '💪 Build Muscle',   adjustment: 250  },
]

function TDEEStep({ onComplete, onSkip }) {
  const [units,      setUnits]      = useState('metric')
  const [sex,        setSex]        = useState('male')
  const [age,        setAge]        = useState('')
  const [heightCm,   setHeightCm]   = useState('')
  const [heightFt,   setHeightFt]   = useState('')
  const [heightIn,   setHeightIn]   = useState('')
  const [weight,     setWeight]     = useState('')
  const [activity,   setActivity]   = useState('moderate')
  const [goal,       setGoal]       = useState('maintain')
  const [result,     setResult]     = useState(null)
  const [error,      setError]      = useState(null)

  function calculate() {
    const ageNum = Number(age)
    const weightNum = Number(weight)

    if (!ageNum || !weightNum || (units === 'metric' ? !heightCm : !heightFt)) {
      setError('Please fill in all fields.')
      return
    }
    setError(null)

    // Convert to metric
    const weightKg  = units === 'metric' ? weightNum : weightNum * 0.453592
    const heightCmV = units === 'metric'
      ? Number(heightCm)
      : (Number(heightFt) * 30.48) + (Number(heightIn || 0) * 2.54)

    // Mifflin-St Jeor BMR
    const bmr = sex === 'male'
      ? (10 * weightKg) + (6.25 * heightCmV) - (5 * ageNum) + 5
      : (10 * weightKg) + (6.25 * heightCmV) - (5 * ageNum) - 161

    // TDEE
    const multiplier = ACTIVITY_LEVELS.find(a => a.value === activity)?.multiplier || 1.55
    const tdee       = Math.round(bmr * multiplier)

    // Goal adjustment
    const adjustment = GOALS.find(g => g.value === goal)?.adjustment || 0
    const targetKcal = Math.max(1200, tdee + adjustment)

    // Macro split — protein priority, fat at ~27%, carbs fill the rest
    const proteinG = Math.round(weightKg * (goal === 'build' ? 2.2 : 2.0))
    const fatG     = Math.round((targetKcal * 0.27) / 9)
    const carbsG   = Math.max(50, Math.round((targetKcal - (proteinG * 4) - (fatG * 9)) / 4))

    setResult({ tdee, kcal: targetKcal, protein_g: proteinG, carbs_g: carbsG, fat_g: fatG })
  }

  const inp = { className: 'form-input' }

  return (
    <div className="wizard-card">
      <StepHeader
        step={1}
        title="Calculate Your Calories"
        subtitle="Don't know your macros? We'll work them out for you."
      />

      {/* Units toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[{ v: 'metric', l: 'Metric (kg / cm)' }, { v: 'imperial', l: 'Imperial (lbs / ft)' }].map(u => (
          <button key={u.v} className={`pill ${units === u.v ? 'active' : ''}`}
            style={{ flex: 1, borderRadius: 8, padding: '10px 0' }}
            onClick={() => setUnits(u.v)}>
            {u.l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Sex */}
      <div className="section-card">
        <div className="section-label">BIOLOGICAL SEX</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ v: 'male', l: '♂ Male' }, { v: 'female', l: '♀ Female' }].map(s => (
            <button key={s.v} className={`pill ${sex === s.v ? 'active' : ''}`}
              style={{ flex: 1, borderRadius: 8, padding: '10px 0' }}
              onClick={() => setSex(s.v)}>
              {s.l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Age + Weight + Height */}
      <div className="section-card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label className="form-label">Age</label>
            <input {...inp} type="number" placeholder="30" value={age} onChange={e => setAge(e.target.value)} min="16" max="99" />
          </div>
          <div>
            <label className="form-label">Weight ({units === 'metric' ? 'kg' : 'lbs'})</label>
            <input {...inp} type="number" placeholder={units === 'metric' ? '80' : '176'} value={weight} onChange={e => setWeight(e.target.value)} />
          </div>
        </div>

        {units === 'metric' ? (
          <div>
            <label className="form-label">Height (cm)</label>
            <input {...inp} type="number" placeholder="178" value={heightCm} onChange={e => setHeightCm(e.target.value)} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="form-label">Height (ft)</label>
              <input {...inp} type="number" placeholder="5" value={heightFt} onChange={e => setHeightFt(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Height (in)</label>
              <input {...inp} type="number" placeholder="10" value={heightIn} onChange={e => setHeightIn(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* Activity level */}
      <div className="section-card">
        <div className="section-label">ACTIVITY LEVEL</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ACTIVITY_LEVELS.map(a => (
            <button key={a.value}
              onClick={() => setActivity(a.value)}
              style={{
                padding: '12px 16px', borderRadius: 8, border: `1.5px solid ${activity === a.value ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}`,
                background: activity === a.value ? 'rgba(0,200,150,0.08)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: activity === a.value ? 'var(--accent)' : 'var(--white)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>{a.label.toUpperCase()}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{a.desc}</div>
              </div>
              {activity === a.value && <span style={{ color: 'var(--accent)', fontSize: 14 }}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div className="section-card">
        <div className="section-label">YOUR GOAL</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {GOALS.map(g => (
            <button key={g.value} className={`pill ${goal === g.value ? 'active' : ''}`}
              style={{ flex: 1, borderRadius: 8, padding: '12px 8px', fontSize: 11 }}
              onClick={() => setGoal(g.value)}>
              {g.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {/* Result */}
      {result && (
        <div className="section-card" style={{ borderColor: 'rgba(0,200,150,0.3)', background: 'rgba(0,200,150,0.05)', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: '0.08em', color: 'var(--accent)', marginBottom: 12 }}>
            YOUR ESTIMATED TARGETS
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
            {[
              { label: 'KCAL',    val: result.kcal,      color: 'var(--white)' },
              { label: 'PROTEIN', val: `${result.protein_g}g`, color: '#818cf8' },
              { label: 'CARBS',   val: `${result.carbs_g}g`,   color: '#f59e0b' },
              { label: 'FAT',     val: `${result.fat_g}g`,     color: '#34d399' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color }}>{val}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em' }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
            Maintenance TDEE: <strong style={{ color: 'var(--white)' }}>{result.tdee} kcal</strong>
            &nbsp;·&nbsp; Mifflin-St Jeor formula &nbsp;·&nbsp; Adjust based on real-world progress
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!result ? (
          <button className="btn-primary" style={{ width: '100%' }} onClick={calculate}>
            CALCULATE MY CALORIES →
          </button>
        ) : (
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => onComplete(result)}>
            BUILD MY PLAN WITH THESE MACROS →
          </button>
        )}
        <button className="btn-secondary" style={{ width: '100%' }} onClick={onSkip}>
          I ALREADY KNOW MY MACROS — SKIP
        </button>
      </div>
    </div>
  )
}

// ─── Meal card ────────────────────────────────────────────────────────────────
function MealCard({ meal }) {
  const [open, setOpen] = useState(false)
  const t      = meal.mealTotals || {}
  const colour = MEAL_TYPE_COLOURS[meal.mealType] || 'var(--accent)'

  return (
    <div className="meal-card">

      {/* Recipe hero image */}
      {meal.image_url && (
        <div
          className="meal-image"
          style={{ backgroundImage: `url(${meal.image_url})` }}
          aria-label={meal.recipe_name || meal.name}
        >
          <div className="meal-image-overlay" />
          {meal.recipe_name && (
            <span className="meal-image-badge">{meal.recipe_name}</span>
          )}
        </div>
      )}

      {/* Header row — always visible */}
      <button className="meal-header" onClick={() => setOpen(!open)}>
        <div className="meal-colour-bar" style={{ background: colour }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="meal-name">{meal.name}</div>
          <div className="meal-macros">
            {t.kcal}kcal · P{t.protein_g}g · C{t.carbs_g}g · F{t.fat_g}g
          </div>
        </div>
        <span style={{ color: 'var(--muted)', fontSize: 10, flexShrink: 0 }}>
          {open ? '▲' : '▼'}
        </span>
      </button>

      {/* Expanded detail */}
      {open && (
        <div className="meal-detail">
          {meal.recipe_name && !meal.image_url && (
            <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em', margin: '8px 0 6px' }}>
              📖 {meal.recipe_name}
            </div>
          )}

          <table className="food-table">
            <thead>
              <tr>
                <th>Food</th>
                <th className="amount">Amount</th>
                <th>kcal</th>
                <th className="p">P</th>
                <th className="c">C</th>
                <th className="f">F</th>
              </tr>
            </thead>
            <tbody>
              {(meal.foods || []).map((food, i) => (
                <tr key={i}>
                  <td>{food.name}</td>
                  <td className="amount">{food.amount}</td>
                  <td className="kcal">{food.kcal}</td>
                  <td className="p">{food.protein_g}</td>
                  <td className="c">{food.carbs_g}</td>
                  <td className="f">{food.fat_g}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Recipe method */}
          {meal.method && (
            <div className="recipe-method">
              <div className="recipe-method-label">HOW TO MAKE IT</div>
              <div className="recipe-method-text">{meal.method}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Day column ───────────────────────────────────────────────────────────────
function DayColumn({ day, dayPlan }) {
  if (!dayPlan) return (
    <div className="day-col">
      <div className="day-name">{day.toUpperCase()}</div>
    </div>
  )

  const isTraining = dayPlan.dayType === 'training'
  const t = dayPlan.dayTotals || {}

  return (
    <div className={`day-col ${isTraining ? 'training' : ''}`}>
      <div className="day-name">{day.toUpperCase()}</div>
      <div className={`day-type ${isTraining ? 'training' : 'rest'}`}>
        {isTraining ? '⚡ TRAINING' : 'REST'}
      </div>
      <div className="day-totals">
        {t.kcal}kcal · P{t.protein_g}g · C{t.carbs_g}g · F{t.fat_g}g
      </div>
      {(dayPlan.meals || []).map((meal, i) => (
        <MealCard key={i} meal={meal} />
      ))}
    </div>
  )
}

// ─── Shopping list ────────────────────────────────────────────────────────────
function ShoppingList({ shoppingList }) {
  const nonEmpty = Object.entries(shoppingList || {}).filter(([, items]) => items?.length > 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.06em', color: 'var(--white)' }}>
            SHOPPING LIST
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Everything you need for the week</div>
        </div>
        <button className="btn-secondary" onClick={() => window.print()}>
          🖨️ Print List
        </button>
      </div>
      <div className="shopping-grid">
        {nonEmpty.map(([cat, items]) => (
          <div key={cat} className="shopping-category">
            <div className="shopping-cat-header">
              <span style={{ fontSize: 18 }}>{SHOPPING_ICONS[cat] || '📦'}</span>
              <span className="shopping-cat-name">{cat.toUpperCase()}</span>
            </div>
            <ul className="shopping-list">
              {items.map((item, i) => (
                <li key={i} className="shopping-item">
                  <span className="checkbox" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Lead capture CTA ─────────────────────────────────────────────────────────
function LeadCTA({ result, macros, mealsPerDay, trainingDays, dietaryFilters }) {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [sending,  setSending]  = useState(false)
  const [sent,     setSent]     = useState(false)
  const [planSent, setPlanSent] = useState(false)
  const [error,    setError]    = useState(null)

  async function handleSendPlan(e) {
    e.preventDefault()
    if (!email) return
    setSending(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/meal-planner/send-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          weekPlan: result?.weekPlan,
          shoppingList: result?.shoppingList,
          macros,
          mealsPerDay,
          trainingDays,
          dietaryFilters,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setPlanSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ marginTop: 32 }}>
      {/* Send plan section */}
      <div className="cta-banner" style={{ marginBottom: 0, borderRadius: planSent ? '12px' : '12px 12px 0 0' }}>
        <div style={{ flex: 1 }}>
          <div className="cta-title">📧 GET YOUR PLAN BY EMAIL</div>
          <div className="cta-sub">
            We'll send your full 7-day meal plan, shopping list and exactly how to make each meal straight to your inbox — ready to save or print.
          </div>
        </div>
        {planSent ? (
          <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            ✓ CHECK YOUR INBOX
          </div>
        ) : (
          <form onSubmit={handleSendPlan} style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 240 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="email"
              className="form-input"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {error && <div style={{ fontSize: 12, color: '#f87171' }}>{error}</div>}
            <button type="submit" className="btn-primary" disabled={sending} style={{ whiteSpace: 'nowrap' }}>
              {sending ? 'SENDING…' : 'SEND MY PLAN →'}
            </button>
          </form>
        )}
      </div>

      {/* Coaching CTA */}
      <div style={{
        background: 'rgba(0,200,150,0.06)',
        border: '1.5px solid rgba(0,200,150,0.2)',
        borderTop: 'none',
        borderRadius: '0 0 12px 12px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: '0.06em', color: 'var(--white)' }}>
            WANT EXPERT GUIDANCE?
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
            Work 1:1 with a coach — personalised programming, weekly check-ins, real results.
          </div>
        </div>
        {sent ? (
          <div style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.04em' }}>
            ✓ WE'LL BE IN TOUCH
          </div>
        ) : (
          <button
            className="btn-primary"
            style={{ whiteSpace: 'nowrap' }}
            onClick={() => {
              const coachingUrl = import.meta.env.VITE_COACHING_URL || 'https://performuscle.com'
              window.open(coachingUrl, '_blank', 'noopener')
              setSent(true)
            }}
          >
            APPLY NOW →
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main app ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step,       setStep]       = useState(1)
  const [generating, setGenerating] = useState(false)
  const [error,      setError]      = useState(null)
  const [result,     setResult]     = useState(null)
  const [activeTab,  setActiveTab]  = useState('plan')

  // Step 2 state (macros — may be pre-filled from TDEE step)
  const [macros, setMacros] = useState({ kcal: '', protein_g: '', carbs_g: '', fat_g: '' })

  // Step 2 state
  const [mealsPerDay,    setMealsPerDay]    = useState(4)
  const [trainingDays,   setTrainingDays]   = useState(['Monday', 'Wednesday', 'Friday'])
  const [trainingTime,   setTrainingTime]   = useState('am')
  const [dietaryFilters, setDietaryFilters] = useState([])

  function toggleDay(day) {
    setTrainingDays(p => p.includes(day) ? p.filter(d => d !== day) : [...p, day])
  }
  function toggleFilter(f) {
    setDietaryFilters(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f])
  }

  async function handleGenerate() {
    const m = macros
    if (!m.kcal || !m.protein_g || !m.carbs_g || !m.fat_g) {
      setError('Please fill in all macro targets before generating.')
      return
    }
    setGenerating(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE}/api/meal-planner/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          macros: {
            kcal:      Number(m.kcal),
            protein_g: Number(m.protein_g),
            carbs_g:   Number(m.carbs_g),
            fat_g:     Number(m.fat_g),
          },
          mealsPerDay,
          trainingDays,
          trainingTime,
          dietaryFilters,
        }),
      })

      if (!res.body) throw new Error('No response from server — please try again.')

      // Read the SSE stream until we get a data: line
      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      outer: while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = JSON.parse(line.slice(6))
          if (data.error) throw new Error(data.error)
          setResult(data)
          setStep(4)
          window.scrollTo({ top: 0, behavior: 'smooth' })
          break outer
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="page-wrapper">

      {/* Header */}
      <header className="site-header">
        <div className="container">
          <div className="header-inner">
            <div className="logo">
              <div className="logo-name">PERFORMUSCLE</div>
              <div className="logo-tag">Health · Function · Performance</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero — hide once results are showing */}
      {step < 4 && (
        <section className="hero">
          <div className="container">
            <div className="hero-eyebrow">FREE TOOL — NO SIGN-UP REQUIRED</div>
            <h1 className="hero-title">
              Your Custom<br /><span>7-Day Meal Plan</span><br />in Minutes
            </h1>
            <p className="hero-sub">
              Enter your macros, set your training days and dietary preferences.
              Our AI builds you a complete weekly plan with a shopping list — instantly.
            </p>
            <div className="hero-features">
              {[
                'Macro-precise meals',
                'Training day carb timing',
                'Dietary filters',
                'Full shopping list',
                '100% free',
              ].map(f => (
                <div key={f} className="hero-feature">
                  <div className="hero-feature-dot" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Wizard */}
      <div className="wizard-wrapper">
        <div className="container">

          {/* ── Step 1: TDEE Calculator ───────────────────────────────────── */}
          {step === 1 && (
            <TDEEStep
              onComplete={tdeeResult => {
                setMacros({
                  kcal:      String(tdeeResult.kcal),
                  protein_g: String(tdeeResult.protein_g),
                  carbs_g:   String(tdeeResult.carbs_g),
                  fat_g:     String(tdeeResult.fat_g),
                })
                setStep(2)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              onSkip={() => {
                setMacros({ kcal: '', protein_g: '', carbs_g: '', fat_g: '' })
                setStep(2)
              }}
            />
          )}

          {/* ── Step 2: Macros ─────────────────────────────────────────────── */}
          {step === 2 && (
            <div className="wizard-card">
              <StepHeader step={2} title="Your Macro Targets" subtitle="Pre-filled from your TDEE — tweak if needed." />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                {[
                  { key: 'kcal',      label: 'Calories (kcal)', ph: '2400' },
                  { key: 'protein_g', label: 'Protein (g)',     ph: '180'  },
                  { key: 'carbs_g',   label: 'Carbs (g)',       ph: '220'  },
                  { key: 'fat_g',     label: 'Fat (g)',         ph: '75'   },
                ].map(({ key, label, ph }) => (
                  <div key={key}>
                    <label className="form-label">{label}</label>
                    <input
                      type="number" className="form-input" placeholder={ph}
                      value={macros[key]}
                      onChange={e => setMacros(p => ({ ...p, [key]: e.target.value }))}
                      min="0"
                    />
                  </div>
                ))}
              </div>

              {macros.kcal && macros.protein_g && macros.carbs_g && macros.fat_g && (
                <div className="section-card" style={{ marginBottom: 20 }}>
                  <div className="macro-grid">
                    {[
                      { label: 'KCAL',    val: macros.kcal                },
                      { label: 'PROTEIN', val: macros.protein_g, unit: 'g' },
                      { label: 'CARBS',   val: macros.carbs_g,   unit: 'g' },
                      { label: 'FAT',     val: macros.fat_g,     unit: 'g' },
                    ].map(({ label, val, unit = '' }) => (
                      <div key={label} className="macro-item">
                        <div className="macro-value">{val}{unit}</div>
                        <div className="macro-label">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && <div className="error-msg">{error}</div>}
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setStep(1); setError(null) }}>
                  ← BACK
                </button>
                <button className="btn-primary" style={{ flex: 2 }} onClick={() => {
                  if (!macros.kcal || !macros.protein_g || !macros.carbs_g || !macros.fat_g) {
                    setError('Please fill in all four macro targets.')
                    return
                  }
                  setError(null)
                  setStep(3)
                }}>
                  NEXT →
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Preferences ────────────────────────────────────────── */}
          {step === 3 && (
            <div className="wizard-card">
              <StepHeader step={3} title="Your Preferences" subtitle="Tell us about your training schedule and dietary needs." />

              {/* Meals per day */}
              <div className="section-card">
                <div className="section-label">MEALS PER DAY</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[2, 3, 4, 5, 6].map(n => (
                    <button
                      key={n}
                      className={`pill-square ${mealsPerDay === n ? 'active' : ''}`}
                      onClick={() => setMealsPerDay(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Training days */}
              <div className="section-card">
                <div className="section-label">TRAINING DAYS</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {DAYS.map((day, i) => (
                    <button
                      key={day}
                      className={`pill ${trainingDays.includes(day) ? 'active' : ''}`}
                      onClick={() => toggleDay(day)}
                    >
                      {DAY_ABBR[i]}
                    </button>
                  ))}
                </div>

                {trainingDays.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div className="section-label">TRAINING TIME</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {[
                        { value: 'am', label: '☀️  Morning (AM)' },
                        { value: 'pm', label: '🌙  Evening (PM)' },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          className={`pill ${trainingTime === opt.value ? 'active' : ''}`}
                          style={{ flex: 1, borderRadius: 8, padding: '10px 16px' }}
                          onClick={() => setTrainingTime(opt.value)}
                        >
                          {opt.label.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dietary filters */}
              <div className="section-card">
                <div className="section-label">DIETARY PREFERENCES (OPTIONAL)</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {DIETARY_FILTERS.map(f => (
                    <button
                      key={f.value}
                      className={`pill ${dietaryFilters.includes(f.value) ? 'active' : ''}`}
                      onClick={() => toggleFilter(f.value)}
                    >
                      {f.emoji} {f.label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="error-msg">{error}</div>}

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setStep(2); setError(null) }}>
                  ← BACK
                </button>
                <button
                  className="btn-primary"
                  style={{ flex: 2 }}
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  {generating ? 'GENERATING…' : '✨ GENERATE MY PLAN'}
                </button>
              </div>

              {generating && (
                <div style={{ textAlign: 'center', marginTop: 28 }}>
                  <div className="spinner" style={{ margin: '0 auto 14px' }} />
                  <div style={{ fontSize: 14, color: 'var(--white)', fontWeight: 500 }}>
                    Building your personalised 7-day meal plan…
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
                    AI is calculating macros, structuring training days, and compiling your shopping list.
                    <br />This usually takes 60–90 seconds.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 4: Results ────────────────────────────────────────────── */}
          {step === 4 && result && (
            <div>
              <div className="results-header">
                <div>
                  <div className="results-title">YOUR MEAL PLAN</div>
                  <div className="results-meta">
                    {mealsPerDay} meals/day · {trainingDays.length} training day{trainingDays.length !== 1 ? 's' : ''}
                    {dietaryFilters.length > 0 && ` · ${dietaryFilters.join(', ')}`}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-secondary" onClick={() => { setStep(3); setResult(null) }}>
                    ← REGENERATE
                  </button>
                  <button className="btn-secondary" onClick={() => { setStep(1); setResult(null); setMacros({ kcal: '', protein_g: '', carbs_g: '', fat_g: '' }) }}>
                    START OVER
                  </button>
                </div>
              </div>

              <div className="tab-row">
                {[
                  { id: 'plan',     label: '📅  MEAL PLAN'    },
                  { id: 'shopping', label: '🛒  SHOPPING LIST' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'plan' && (
                <div className="week-grid">
                  <div className="week-inner">
                    {DAYS.map(day => (
                      <DayColumn key={day} day={day} dayPlan={result.weekPlan?.[day]} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'shopping' && (
                <ShoppingList shoppingList={result.shoppingList} />
              )}

              <LeadCTA
                result={result}
                macros={macros}
                mealsPerDay={mealsPerDay}
                trainingDays={trainingDays}
                dietaryFilters={dietaryFilters}
              />
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-text">
            Built by <a href="#">Performuscle</a> · Health | Function | Performance
          </div>
        </div>
      </footer>

    </div>
  )
}
