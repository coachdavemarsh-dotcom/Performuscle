import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useClient } from '../../hooks/useClient.js'

const DAYS     = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const DAY_ABBR = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

const DIETARY_FILTERS = [
  { value: 'dairy-free',   label: 'Dairy-Free'   },
  { value: 'gluten-free',  label: 'Gluten-Free'  },
  { value: 'vegetarian',   label: 'Vegetarian'   },
  { value: 'vegan',        label: 'Vegan'        },
  { value: 'nut-free',     label: 'Nut-Free'     },
  { value: 'egg-free',     label: 'Egg-Free'     },
  { value: 'high-protein', label: 'High-Protein' },
  { value: 'low-carb',     label: 'Low-Carb'     },
]

const MEAL_TYPE_COLOURS = {
  'pre-workout':  '#f59e0b',
  'post-workout': '#00C896',
  'breakfast':    '#6366f1',
  'lunch':        '#3b82f6',
  'dinner':       '#8b5cf6',
  'snack':        '#ec4899',
}

// In dev fall back to localhost; in production use relative /api/* (Vercel proxies to Railway)
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '')

// ─── Utility ─────────────────────────────────────────────────────────────────
const pill = (active) => ({
  padding: '8px 14px',
  borderRadius: 20,
  border: active ? '1.5px solid var(--accent)' : '1.5px solid rgba(255,255,255,0.1)',
  background: active ? 'rgba(0,200,150,0.1)' : 'rgba(255,255,255,0.03)',
  color: active ? 'var(--accent)' : 'var(--muted)',
  cursor: 'pointer',
  fontSize: 12,
  fontFamily: 'var(--font-display)',
  letterSpacing: '0.04em',
})

const square = (active) => ({
  width: 48,
  height: 48,
  borderRadius: 8,
  border: active ? '1.5px solid var(--accent)' : '1.5px solid rgba(255,255,255,0.1)',
  background: active ? 'rgba(0,200,150,0.1)' : 'rgba(255,255,255,0.03)',
  color: active ? 'var(--accent)' : 'var(--muted)',
  cursor: 'pointer',
  fontSize: 16,
  fontFamily: 'var(--font-display)',
})

// ─── Step header ──────────────────────────────────────────────────────────────
function StepHeader({ step, title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[1, 2, 3].map(n => (
          <div key={n} style={{
            height: 3,
            borderRadius: 2,
            flexShrink: 0,
            width: n < step ? 28 : n === step ? 48 : 12,
            background: n <= step ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>
      <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: '0.08em', color: 'var(--accent)', marginBottom: 4 }}>
        STEP {step} OF 3
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.06em', color: 'var(--white)' }}>
        {title.toUpperCase()}
      </div>
      {subtitle && (
        <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{subtitle}</div>
      )}
    </div>
  )
}

// ─── Meal card ────────────────────────────────────────────────────────────────
function MealCard({ meal }) {
  const [open, setOpen] = useState(false)
  const t      = meal.mealTotals || {}
  const colour = MEAL_TYPE_COLOURS[meal.mealType] || 'var(--accent)'

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10,
      marginBottom: 8,
      overflow: 'hidden',
    }}>
      {/* Recipe image banner */}
      {meal.image_url && (
        <div style={{
          height: 120,
          backgroundImage: `url(${meal.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 30%, rgba(6,6,8,0.85))',
          }} />
          {meal.recipe_name && (
            <span style={{
              position: 'absolute', bottom: 8, left: 10,
              background: 'var(--accent)', color: '#060608',
              fontSize: 10, fontWeight: 700,
              fontFamily: 'var(--font-display)', letterSpacing: '0.04em',
              padding: '3px 8px', borderRadius: 12,
            }}>
              {meal.recipe_name}
            </span>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '10px 12px', display: 'flex',
          alignItems: 'center', gap: 8, background: 'none',
          border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <div style={{ width: 3, height: 34, borderRadius: 2, background: colour, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {meal.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>
            {t.kcal}kcal · P{t.protein_g}g · C{t.carbs_g}g · F{t.fat_g}g
          </div>
        </div>
        <span style={{ color: 'var(--muted)', fontSize: 10, flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ padding: '0 12px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {meal.recipe_name && !meal.image_url && (
            <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em', margin: '8px 0 6px' }}>
              FROM LIBRARY: {meal.recipe_name}
            </div>
          )}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
            <thead>
              <tr>
                {['Food', 'Amount', 'kcal', 'P', 'C', 'F'].map(h => (
                  <th key={h} style={{
                    fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-display)',
                    letterSpacing: '0.04em', textAlign: h === 'Food' ? 'left' : 'right',
                    paddingBottom: 4, borderBottom: '1px solid rgba(255,255,255,0.06)',
                    paddingRight: h !== 'F' ? 6 : 0,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(meal.foods || []).map((food, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 12, color: 'var(--white)', padding: '4px 6px 4px 0' }}>{food.name}</td>
                  <td style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right', padding: '4px 6px 4px 0', whiteSpace: 'nowrap' }}>{food.amount}</td>
                  <td style={{ fontSize: 11, color: 'var(--white)', textAlign: 'right', padding: '4px 6px 4px 0' }}>{food.kcal}</td>
                  <td style={{ fontSize: 11, color: '#818cf8', textAlign: 'right', padding: '4px 6px 4px 0' }}>{food.protein_g}</td>
                  <td style={{ fontSize: 11, color: '#f59e0b', textAlign: 'right', padding: '4px 6px 4px 0' }}>{food.carbs_g}</td>
                  <td style={{ fontSize: 11, color: '#34d399', textAlign: 'right', padding: '4px 0' }}>{food.fat_g}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {meal.method && (
            <div style={{
              marginTop: 12, padding: '10px 12px',
              background: 'rgba(0,200,150,0.05)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: '0 6px 6px 0',
            }}>
              <div style={{ fontSize: 10, fontFamily: 'var(--font-display)', letterSpacing: '0.08em', color: 'var(--accent)', marginBottom: 6 }}>
                HOW TO MAKE IT
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
                {meal.method}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Shopping list ────────────────────────────────────────────────────────────
function ShoppingList({ shoppingList }) {
  const ICONS = {
    'Protein & Meat':       '🥩',
    'Fish & Seafood':       '🐟',
    'Dairy & Eggs':         '🥚',
    'Grains & Carbs':       '🌾',
    'Produce':              '🥦',
    'Fats & Oils':          '🫒',
    'Condiments & Spices':  '🧂',
    'Supplements & Other':  '💊',
  }

  const nonEmpty = Object.entries(shoppingList || {}).filter(([, items]) => items?.length > 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.06em', color: 'var(--white)' }}>SHOPPING LIST</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Everything you need for the week</div>
        </div>
        <button className="btn-secondary" onClick={() => window.print()} style={{ fontSize: 12 }}>
          🖨️ Print List
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
        {nonEmpty.map(([cat, items]) => (
          <div key={cat} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 18 }}>{ICONS[cat] || '📦'}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.05em', color: 'var(--white)' }}>
                {cat.toUpperCase()}
              </span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {items.map((item, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '5px 0',
                  borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  fontSize: 13, color: 'var(--white)',
                }}>
                  <span style={{ width: 15, height: 15, border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 3, flexShrink: 0, display: 'inline-block' }} />
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

// ─── Send plan button ─────────────────────────────────────────────────────────
function SendPlanButton({ result, macros, mealsPerDay, trainingDays, dietaryFilters, userEmail, userName }) {
  const [sending, setSending] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState(null)

  async function handleSend() {
    if (!userEmail) return
    setSending(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/meal-planner/send-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userName || userEmail,
          email: userEmail,
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
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  if (sent) return (
    <div style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
      ✓ PLAN SENT TO {userEmail?.toUpperCase()}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <button className="btn-secondary" onClick={handleSend} disabled={sending || !userEmail} style={{ fontSize: 12 }}>
        {sending ? 'SENDING…' : '📧 EMAIL ME THIS PLAN'}
      </button>
      {error && <div style={{ fontSize: 11, color: '#f87171' }}>{error}</div>}
    </div>
  )
}

// ─── Main wizard ──────────────────────────────────────────────────────────────
export default function MealPlannerWizard() {
  const { user } = useAuth()
  const { nutritionPlan } = useClient()

  const [step,       setStep]       = useState(1)
  const [generating, setGenerating] = useState(false)
  const [error,      setError]      = useState(null)
  const [result,     setResult]     = useState(null)
  const [activeTab,  setActiveTab]  = useState('plan')
  const [activeDay,  setActiveDay]  = useState('Monday')

  // Step 1
  const [macroSource, setMacroSource] = useState('plan')
  const [macros, setMacros] = useState({ kcal: '', protein_g: '', carbs_g: '', fat_g: '' })

  // Step 2
  const [mealsPerDay,    setMealsPerDay]    = useState(4)
  const [trainingDays,   setTrainingDays]   = useState(['Monday', 'Wednesday', 'Friday'])
  const [trainingTime,   setTrainingTime]   = useState('am')
  const [dietaryFilters, setDietaryFilters] = useState([])

  const planMacros = nutritionPlan?.day_types?.find(d => d.day_type === 'training')
    || nutritionPlan?.day_types?.[0]

  const activeMacros = macroSource === 'plan' && planMacros
    ? { kcal: planMacros.kcal, protein_g: planMacros.protein_g, carbs_g: planMacros.carbs_g, fat_g: planMacros.fat_g }
    : macros

  function toggleDay(day) {
    setTrainingDays(p => p.includes(day) ? p.filter(d => d !== day) : [...p, day])
  }
  function toggleFilter(f) {
    setDietaryFilters(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f])
  }

  // ── SSE streaming generation ────────────────────────────────────────────────
  async function handleGenerate() {
    const m = activeMacros
    if (!m.kcal || !m.protein_g || !m.carbs_g || !m.fat_g) {
      setError('Please fill in all macro targets.')
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

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Generation failed')
      }

      // Server streams SSE — read until we get the data event
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
          setActiveDay('Monday')
          setActiveTab('plan')
          setStep(3)
          break outer
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  // ── Step 1: Macros ──────────────────────────────────────────────────────────
  if (step === 1) return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <StepHeader step={1} title="Your Macro Targets" subtitle="Set daily nutrition targets for your plan" />

      {planMacros && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[
            { value: 'plan',   label: 'Use My Nutrition Plan' },
            { value: 'manual', label: 'Enter Manually'        },
          ].map(opt => (
            <button key={opt.value} onClick={() => setMacroSource(opt.value)} style={{
              flex: 1, padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 12,
              fontFamily: 'var(--font-display)', letterSpacing: '0.04em',
              border: macroSource === opt.value ? '1.5px solid var(--accent)' : '1.5px solid rgba(255,255,255,0.1)',
              background: macroSource === opt.value ? 'rgba(0,200,150,0.1)' : 'rgba(255,255,255,0.03)',
              color: macroSource === opt.value ? 'var(--accent)' : 'var(--muted)',
            }}>
              {opt.label.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {macroSource === 'plan' && planMacros ? (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 14 }}>
            TRAINING DAY TARGETS
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[
              { label: 'KCAL',    val: planMacros.kcal,      unit: ''  },
              { label: 'PROTEIN', val: planMacros.protein_g, unit: 'g' },
              { label: 'CARBS',   val: planMacros.carbs_g,   unit: 'g' },
              { label: 'FAT',     val: planMacros.fat_g,     unit: 'g' },
            ].map(({ label, val, unit }) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--white)' }}>{val}{unit}</div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-display)', letterSpacing: '0.06em', color: 'var(--muted)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {[
            { key: 'kcal',      label: 'Calories (kcal)', ph: '2400' },
            { key: 'protein_g', label: 'Protein (g)',     ph: '180'  },
            { key: 'carbs_g',   label: 'Carbs (g)',       ph: '220'  },
            { key: 'fat_g',     label: 'Fat (g)',         ph: '80'   },
          ].map(({ key, label, ph }) => (
            <div key={key}>
              <label className="form-label">{label}</label>
              <input
                type="number" className="form-input" placeholder={ph}
                value={macros[key]}
                onChange={e => setMacros(p => ({ ...p, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      )}

      {error && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 10 }}>{error}</div>}
      <button className="btn-primary" style={{ width: '100%' }} onClick={() => {
        const m = activeMacros
        if (!m.kcal || !m.protein_g || !m.carbs_g || !m.fat_g) {
          setError('Please fill in all macro targets.')
          return
        }
        setError(null)
        setStep(2)
      }}>
        NEXT →
      </button>
    </div>
  )

  // ── Step 2: Preferences ─────────────────────────────────────────────────────
  if (step === 2) return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <StepHeader step={2} title="Your Preferences" subtitle="Customise meals, training days and dietary needs" />

      {/* Meals per day */}
      <div className="card" style={{ padding: 18, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 12 }}>
          MEALS PER DAY
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[2, 3, 4, 5, 6].map(n => (
            <button key={n} onClick={() => setMealsPerDay(n)} style={square(mealsPerDay === n)}>
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Training days */}
      <div className="card" style={{ padding: 18, marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 12 }}>
          TRAINING DAYS
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {DAYS.map((day, i) => (
            <button key={day} onClick={() => toggleDay(day)} style={pill(trainingDays.includes(day))}>
              {DAY_ABBR[i]}
            </button>
          ))}
        </div>

        {trainingDays.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 10 }}>
              TRAINING TIME
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { value: 'am', label: 'Morning (AM)' },
                { value: 'pm', label: 'Evening (PM)' },
              ].map(opt => (
                <button key={opt.value} onClick={() => setTrainingTime(opt.value)} style={{
                  ...pill(trainingTime === opt.value),
                  flex: 1, padding: '10px 16px', borderRadius: 8,
                }}>
                  {opt.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dietary filters */}
      <div className="card" style={{ padding: 18, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: '0.06em', color: 'var(--muted)', marginBottom: 12 }}>
          DIETARY PREFERENCES
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {DIETARY_FILTERS.map(f => (
            <button key={f.value} onClick={() => toggleFilter(f.value)} style={pill(dietaryFilters.includes(f.value))}>
              {f.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {error && <div style={{ color: '#f87171', fontSize: 13, marginBottom: 10 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setStep(1); setError(null) }}>
          ← BACK
        </button>
        <button className="btn-primary" style={{ flex: 2 }} onClick={handleGenerate} disabled={generating}>
          {generating ? 'GENERATING…' : '✨ GENERATE PLAN'}
        </button>
      </div>

      {generating && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <div className="spinner" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Building your personalised 7-day meal plan…</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>This usually takes 60–90 seconds</div>
        </div>
      )}
    </div>
  )

  // ── Step 3: Results ─────────────────────────────────────────────────────────
  if (step === 3 && result) {
    const activeDayPlan = result.weekPlan?.[activeDay]
    const isTraining    = activeDayPlan?.dayType === 'training'
    const t             = activeDayPlan?.dayTotals || {}

    return (
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '0.06em', color: 'var(--white)' }}>
              YOUR MEAL PLAN
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
              {mealsPerDay} meals/day · {trainingDays.length} training days
              {dietaryFilters.length > 0 && ` · ${dietaryFilters.join(', ')}`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <SendPlanButton
              result={result}
              macros={activeMacros}
              mealsPerDay={mealsPerDay}
              trainingDays={trainingDays}
              dietaryFilters={dietaryFilters}
              userEmail={user?.email}
              userName={user?.user_metadata?.full_name}
            />
            <button className="btn-secondary" onClick={() => { setStep(2); setResult(null) }}>
              ← REGENERATE
            </button>
          </div>
        </div>

        {/* Main tabs */}
        <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4, marginBottom: 20 }}>
          {[
            { id: 'plan',     label: '📅  MEAL PLAN'    },
            { id: 'shopping', label: '🛒  SHOPPING LIST' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.04em',
              background: activeTab === tab.id ? 'rgba(0,200,150,0.15)' : 'transparent',
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)',
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'plan' && (
          <div>
            {/* Day selector — scrollable pill row */}
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 16, scrollbarWidth: 'none' }}>
              {DAYS.map((day, i) => {
                const dp = result.weekPlan?.[day]
                const isTrain = dp?.dayType === 'training'
                const isActive = activeDay === day
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    style={{
                      flexShrink: 0,
                      padding: '8px 14px',
                      borderRadius: 20,
                      border: isActive
                        ? `1.5px solid ${isTrain ? 'var(--accent)' : 'rgba(255,255,255,0.4)'}`
                        : `1.5px solid ${isTrain ? 'rgba(0,200,150,0.3)' : 'rgba(255,255,255,0.1)'}`,
                      background: isActive
                        ? (isTrain ? 'rgba(0,200,150,0.15)' : 'rgba(255,255,255,0.08)')
                        : 'rgba(255,255,255,0.03)',
                      color: isActive
                        ? (isTrain ? 'var(--accent)' : 'var(--white)')
                        : 'var(--muted)',
                      cursor: 'pointer',
                      fontSize: 12,
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {DAY_ABBR[i]}
                    {isTrain && <span style={{ marginLeft: 4, fontSize: 9 }}>⚡</span>}
                  </button>
                )
              })}
            </div>

            {/* Active day card */}
            {activeDayPlan && (
              <div>
                {/* Day header */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: 14, flexWrap: 'wrap', gap: 8,
                }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.06em', color: 'var(--white)' }}>
                      {activeDay.toUpperCase()}
                    </span>
                    {isTraining
                      ? <span style={{ marginLeft: 10, fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>⚡ TRAINING DAY</span>
                      : <span style={{ marginLeft: 10, fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>REST DAY</span>
                    }
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {t.kcal} kcal &nbsp;·&nbsp;
                    <span style={{ color: '#818cf8' }}>P {t.protein_g}g</span> &nbsp;·&nbsp;
                    <span style={{ color: '#f59e0b' }}>C {t.carbs_g}g</span> &nbsp;·&nbsp;
                    <span style={{ color: '#34d399' }}>F {t.fat_g}g</span>
                  </div>
                </div>

                {/* Meal cards */}
                {(activeDayPlan.meals || []).map((meal, i) => (
                  <MealCard key={i} meal={meal} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'shopping' && (
          <ShoppingList shoppingList={result.shoppingList} />
        )}
      </div>
    )
  }

  return null
}
