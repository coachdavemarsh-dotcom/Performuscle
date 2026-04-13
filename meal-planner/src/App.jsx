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
function StepHeader({ step, title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div className="step-progress">
        {[1, 2, 3].map(n => (
          <div key={n} className="step-bar" style={{
            width: n < step ? 28 : n === step ? 48 : 12,
            background: n <= step ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
          }} />
        ))}
      </div>
      <div className="step-eyebrow">STEP {step} OF 3</div>
      <div className="step-title">{title.toUpperCase()}</div>
      {subtitle && <div className="step-sub">{subtitle}</div>}
    </div>
  )
}

// ─── Meal card ────────────────────────────────────────────────────────────────
function MealCard({ meal }) {
  const [open, setOpen] = useState(false)
  const t = meal.mealTotals || {}
  const colour = MEAL_TYPE_COLOURS[meal.mealType] || 'var(--accent)'

  return (
    <div className="meal-card">
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

      {open && (
        <div className="meal-detail">
          {meal.recipe_name && (
            <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em', margin: '8px 0 6px' }}>
              FROM LIBRARY: {meal.recipe_name}
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
            We'll send your full 7-day meal plan and shopping list straight to your inbox — ready to save or print.
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

  // Step 1 state
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

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')

      setResult(data)
      setStep(3)
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
            <div className="header-badge">✨ AI MEAL PLANNER</div>
          </div>
        </div>
      </header>

      {/* Hero — hide once results are showing */}
      {step < 3 && (
        <section className="hero">
          <div className="container">
            <div className="hero-eyebrow">FREE TOOL — NO SIGN-UP REQUIRED</div>
            <h1 className="hero-title">
              Your Custom<br /><span>7-Day Meal Plan</span><br />in Seconds
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

          {/* ── Step 1: Macros ─────────────────────────────────────────────── */}
          {step === 1 && (
            <div className="wizard-card">
              <StepHeader step={1} title="Your Macro Targets" subtitle="Enter your daily nutrition targets. Not sure? Use a TDEE calculator first." />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                {[
                  { key: 'kcal',      label: 'Calories (kcal)', ph: '2400', tip: 'Total daily calories' },
                  { key: 'protein_g', label: 'Protein (g)',     ph: '180',  tip: 'e.g. 2g per kg bodyweight' },
                  { key: 'carbs_g',   label: 'Carbs (g)',       ph: '220',  tip: 'Remaining after protein & fat' },
                  { key: 'fat_g',     label: 'Fat (g)',         ph: '75',   tip: 'Min 0.8g per kg bodyweight' },
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

              {/* Quick macro preview */}
              {macros.kcal && macros.protein_g && macros.carbs_g && macros.fat_g && (
                <div className="section-card" style={{ marginBottom: 20 }}>
                  <div className="macro-grid">
                    {[
                      { label: 'KCAL',    val: macros.kcal      },
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
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => {
                if (!macros.kcal || !macros.protein_g || !macros.carbs_g || !macros.fat_g) {
                  setError('Please fill in all four macro targets.')
                  return
                }
                setError(null)
                setStep(2)
              }}>
                NEXT →
              </button>
            </div>
          )}

          {/* ── Step 2: Preferences ────────────────────────────────────────── */}
          {step === 2 && (
            <div className="wizard-card">
              <StepHeader step={2} title="Your Preferences" subtitle="Tell us about your training schedule and dietary needs." />

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
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setStep(1); setError(null) }}>
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
                    <br />This usually takes 15–30 seconds.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Results ────────────────────────────────────────────── */}
          {step === 3 && result && (
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
                  <button className="btn-secondary" onClick={() => { setStep(2); setResult(null) }}>
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
