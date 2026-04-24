import { useState } from 'react'

// ─── Password gate ────────────────────────────────────────────────────────────

const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE   // set in Vercel env vars
const STORAGE_KEY = 'pf_access_granted'

function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(() => {
    if (!ACCESS_CODE) return true                         // dev: no code set → skip gate
    return localStorage.getItem(STORAGE_KEY) === ACCESS_CODE
  })
  const [input, setInput]   = useState('')
  const [shake,  setShake]  = useState(false)
  const [show,   setShow]   = useState(false)

  if (unlocked) return children

  function attempt() {
    if (input.trim().toUpperCase() === ACCESS_CODE.toUpperCase()) {
      localStorage.setItem(STORAGE_KEY, ACCESS_CODE)
      setUnlocked(true)
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 600)
      setInput('')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--ink)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '0.1em', color: 'var(--white)' }}>
          PERFORMUSCLE
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--accent)', marginTop: 2 }}>
          HEALTH · FUNCTION · PERFORMANCE
        </div>
        <div style={{ width: 48, height: 2, background: 'var(--accent)', margin: '12px auto 0' }} />
      </div>

      {/* Gate card */}
      <div style={{
        width: '100%', maxWidth: 380,
        background: 'var(--ink-2)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '32px 28px', textAlign: 'center',
        animation: shake ? 'shake 0.5s ease' : undefined,
      }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>🔒</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: '0.06em', color: 'var(--white)', marginBottom: 8 }}>
          CLIENT ACCESS ONLY
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
          This tool is exclusively for Performuscle coaching clients.<br/>
          Enter the access code from your Notion hub to continue.
        </p>

        <div style={{ position: 'relative', marginBottom: 16 }}>
          <input
            className="form-input"
            type={show ? 'text' : 'password'}
            placeholder="Enter access code"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            style={{ textAlign: 'center', letterSpacing: '0.15em', fontFamily: 'var(--font-display)', fontSize: 16, paddingRight: 44 }}
            autoFocus
          />
          <button
            onClick={() => setShow(s => !s)}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 16, padding: 4,
            }}
            tabIndex={-1}
            title={show ? 'Hide' : 'Show'}
          >
            {show ? '🙈' : '👁'}
          </button>
        </div>

        <button className="btn-primary" onClick={attempt} style={{ marginBottom: 20 }}>
          UNLOCK →
        </button>

        <p style={{ fontSize: 11, color: 'var(--muted)' }}>
          Not a client yet?{' '}
          <a href="https://performuscle.com" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            Learn about coaching →
          </a>
        </p>
      </div>

      {/* Shake animation */}
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}

// ─── Calculation engine ───────────────────────────────────────────────────────

function clamp(val, min, max) { return Math.min(max, Math.max(min, val)) }
function round5(n) { return Math.round(n / 5) * 5 }

function calculate({ weightKg, activityType, durationMin, intensity, heat }) {
  const w   = parseFloat(weightKg) || 75
  const dur = parseInt(durationMin) || 60
  const hrDur = dur / 60

  const heatMult = { cool: 0.8, moderate: 1.0, hot: 1.35, very_hot: 1.7 }[heat] || 1.0
  const isEndurance = ['run', 'cycle', 'swim'].includes(activityType)
  const isStrength  = activityType === 'strength'

  // PRE
  let preCarbFactor
  if (intensity === 'easy' || dur < 45)   preCarbFactor = 1.0
  else if (intensity === 'moderate')       preCarbFactor = isEndurance ? 2.0 : 1.5
  else if (intensity === 'hard')           preCarbFactor = isEndurance ? 3.0 : 2.0
  else                                     preCarbFactor = isEndurance ? 4.0 : 2.5
  const preCarbs   = round5(clamp(w * preCarbFactor, 20, 400))
  const preProtein = isStrength ? round5(clamp(w * 0.2, 15, 30)) : round5(clamp(w * 0.15, 10, 25))
  const preFluid   = Math.round(w * 6)

  // INTRA
  let intraCarbHr
  if (dur < 45)         intraCarbHr = 0
  else if (dur < 75)    intraCarbHr = 20
  else if (dur < 90)    intraCarbHr = 30
  else if (dur < 120)   intraCarbHr = 45
  else if (dur < 180)   intraCarbHr = 60
  else                  intraCarbHr = 80
  if (intensity === 'hard' && isEndurance && dur >= 90)  intraCarbHr = Math.min(intraCarbHr * 1.1, 90)
  if (intensity === 'race' && isEndurance && dur >= 120) intraCarbHr = Math.min(intraCarbHr * 1.2, 90)
  const intraCarbHrR  = round5(intraCarbHr)
  const intraTotalCarb = round5(intraCarbHrR * hrDur)
  const useMultiCarb  = dur > 150 && intraCarbHrR > 50
  const baseSodium    = { easy: 250, moderate: 400, hard: 600, race: 800 }[intensity] || 400
  const intraSodiumHr = Math.round(baseSodium * heatMult)
  const baseFluidHr   = 500 + (w > 80 ? 100 : 0)
  const intensFluid   = { easy: 0.8, moderate: 1.0, hard: 1.2, race: 1.4 }[intensity] || 1.0
  const intraFluidHr  = Math.round(baseFluidHr * intensFluid * heatMult / 50) * 50
  const intraPotassiumHr = Math.round(150 * Math.min(heatMult, 1.4))

  // POST
  const postProtein = round5(clamp(w * (isStrength ? 0.35 : 0.3), 20, 45))
  let postCarbFactor
  if (isStrength)                                  postCarbFactor = 0.5
  else if (activityType === 'hiit')                postCarbFactor = 0.7
  else if (intensity === 'race' && isEndurance)    postCarbFactor = 1.2
  else if (intensity === 'hard')                   postCarbFactor = 1.0
  else                                             postCarbFactor = 0.7
  const postCarbs   = round5(clamp(w * postCarbFactor, 20, 200))
  const sweatRateLhr = { easy: 0.5, moderate: 0.8, hard: 1.2, race: 1.6 }[intensity] || 0.8
  const sweatLossL  = sweatRateLhr * heatMult * hrDur
  const rehydMl     = Math.round(sweatLossL * 1500)
  const postSodium  = Math.round(sweatLossL * 800)

  // CARB LOAD
  const shouldLoad  = dur >= 90 && (intensity === 'hard' || intensity === 'race') && isEndurance
  const loadDay2    = shouldLoad ? round5(w * 8)  : null
  const loadDay1    = shouldLoad ? round5(w * 10) : null
  const loadMorning = shouldLoad ? round5(w * 2)  : null

  // ELECTROLYTES
  const trainingBoost = hrDur * ({ easy: 0.6, moderate: 1.0, hard: 1.4, race: 1.8 }[intensity] || 1.0)
  const sodiumDaily    = Math.round((2000 + trainingBoost * 600) * heatMult)
  const potassiumDaily = 3500 + Math.round(trainingBoost * 200)
  const magnesiumDaily = Math.round(w * 5.5)
  const sessionSodiumLoss    = Math.round(intraSodiumHr * hrDur)
  const sessionPotassiumLoss = Math.round(intraPotassiumHr * hrDur)
  const sessionMagLoss       = Math.round(5 * hrDur)

  return {
    weight: w,
    preCarbs, preProtein, preFluid,
    preTiming: preCarbFactor >= 3 ? '3–4 hours before' : preCarbFactor >= 2 ? '2–3 hours before' : '1–2 hours before',
    intraCarbHr: intraCarbHrR, intraTotalCarb, useMultiCarb,
    intraSodiumHr, intraFluidHr, intraPotassiumHr, needsIntra: dur >= 45,
    postCarbs, postProtein, rehydMl, postSodium,
    postWindow: isEndurance && intensity !== 'easy' ? '30 min' : '60 min',
    shouldLoad, loadDay2, loadDay1, loadMorning,
    sodiumDaily, potassiumDaily, magnesiumDaily,
    sessionSodiumLoss, sessionPotassiumLoss, sessionMagLoss,
  }
}

// ─── Shared UI helpers ────────────────────────────────────────────────────────

function FoodList({ label, items }) {
  return (
    <div className="food-list">
      <div className="food-list-label">{label}</div>
      <div className="food-tags">
        {items.map(f => <span key={f} className="food-tag">{f}</span>)}
      </div>
    </div>
  )
}

function MacroRow({ label, value, unit = 'g', color = 'var(--accent)', sub }) {
  return (
    <div className="macro-row">
      <div>
        <div className="macro-row-label">{label}</div>
        {sub && <div className="macro-row-sub">{sub}</div>}
      </div>
      <div>
        <span className="macro-row-value" style={{ color }}>{value}</span>
        <span className="macro-row-unit">{unit}</span>
      </div>
    </div>
  )
}

function ElecRow({ label, value, unit, max, color, note }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="elec-row">
      <div className="elec-header">
        <div>
          <span className="elec-label">{label}</span>
          {note && <span className="elec-note">{note}</span>}
        </div>
        <div>
          <span className="elec-value" style={{ color }}>{value.toLocaleString()}</span>
          <span className="elec-unit"> {unit}</span>
        </div>
      </div>
      <div className="elec-bar-bg">
        <div className="elec-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

// ─── Result tab panels ────────────────────────────────────────────────────────

function TabPre({ r }) {
  return (
    <div className="fade-in">
      <div className="section-eyebrow" style={{ color: 'var(--accent)' }}>WINDOW</div>
      <div className="section-title">{r.preTiming.toUpperCase()} YOUR SESSION</div>
      <div className="stat-grid-2">
        <div className="stat-box">
          <div className="stat-box-label">CARBOHYDRATES</div>
          <div className="stat-box-value" style={{ color: 'var(--accent)' }}>{r.preCarbs}</div>
          <div className="stat-box-unit">grams</div>
          <div className="stat-box-sub">{(r.preCarbs / r.weight).toFixed(1)} g/kg</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-label">PROTEIN</div>
          <div className="stat-box-value" style={{ color: 'var(--info)' }}>{r.preProtein}</div>
          <div className="stat-box-unit">grams</div>
          <div className="stat-box-sub">light — easy to digest</div>
        </div>
      </div>
      <MacroRow label="Fluid" value={r.preFluid} unit="ml" color="var(--info)" sub="2 hrs before · top up 200–300ml 20 min before" />
      <MacroRow label="Fat" value="Keep low" unit="" color="var(--warn)" sub="Slows gastric emptying — avoid high-fat meals pre-session" />
      <FoodList label="IDEAL PRE-WORKOUT FOODS"
        items={['White rice','Oats','Banana','Sourdough toast','Rice cakes','Potato','Sports drink','Low-fat yogurt','Honey']} />
      <div className="info-box" style={{ background: 'rgba(0,200,150,0.06)', border: '1px solid rgba(0,200,150,0.15)', color: 'var(--muted)' }}>
        💡 Eating <strong>1 hour or less</strong> before training? Stick to simple carbs only — no fat, minimal protein, nothing high-fibre.
      </div>
    </div>
  )
}

function TabIntra({ r }) {
  if (!r.needsIntra) {
    return (
      <div className="fade-in empty-state">
        <div className="empty-state-icon">⚡</div>
        <div className="empty-state-title">NO INTRA-WORKOUT FUEL NEEDED</div>
        <div className="empty-state-body">For sessions under 45 minutes, endogenous glycogen stores are sufficient. Stay hydrated with water.</div>
      </div>
    )
  }
  return (
    <div className="fade-in">
      <div className="section-eyebrow" style={{ color: 'var(--warn)' }}>PER HOUR OF TRAINING</div>
      <div className="section-title">DURING YOUR SESSION</div>
      <div className="stat-grid-3">
        {[
          { label: 'CARBS',   value: r.intraCarbHr,   unit: 'g/hr',  color: 'var(--accent)' },
          { label: 'SODIUM',  value: r.intraSodiumHr,  unit: 'mg/hr', color: 'var(--warn)'   },
          { label: 'FLUID',   value: r.intraFluidHr,   unit: 'ml/hr', color: 'var(--info)'   },
        ].map(s => (
          <div key={s.label} className="stat-box">
            <div className="stat-box-label">{s.label}</div>
            <div className="stat-box-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-box-unit">{s.unit}</div>
          </div>
        ))}
      </div>
      <MacroRow label="Potassium" value={r.intraPotassiumHr} unit="mg/hr" color="var(--accent-hi)" sub="Lost in sweat — replenish during long sessions" />
      {r.intraCarbHr > 0 && (
        <MacroRow label="Session total carbs" value={r.intraTotalCarb} unit="g total" color="var(--accent)" sub="Spread evenly — don't take it all at once" />
      )}
      {r.useMultiCarb && (
        <div className="info-box" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', color: 'var(--muted)' }}>
          <strong style={{ color: 'var(--warn)', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', fontSize: 11 }}>MULTI-CARB PROTOCOL RECOMMENDED</strong><br/>
          For sessions over 2.5 hrs at 60g+/hr, use a <strong>2:1 glucose:fructose</strong> ratio to saturate separate intestinal transporters and absorb up to 90g/hr (Jeukendrup 2011).
        </div>
      )}
      <FoodList label="INTRA-WORKOUT OPTIONS"
        items={['Energy gel (22–25g)','Medjool dates (2)','Banana (half)','Sports drink 500ml','Rice balls','Chews / blocks','Maltodextrin + fructose mix']} />
      <div className="info-box" style={{ background: 'rgba(0,200,150,0.06)', border: '1px solid rgba(0,200,150,0.15)', color: 'var(--muted)' }}>
        💡 Sip fluid <strong>regularly, not all at once</strong>. Sodium in sports drinks helps fluid retention and maintains the drive to drink.
      </div>
    </div>
  )
}

function TabPost({ r }) {
  return (
    <div className="fade-in">
      <div className="section-eyebrow" style={{ color: 'var(--pink)' }}>WITHIN {r.postWindow} OF FINISHING</div>
      <div className="section-title">RECOVERY WINDOW</div>
      <div className="stat-grid-2">
        <div className="stat-box">
          <div className="stat-box-label">PROTEIN</div>
          <div className="stat-box-value" style={{ color: 'var(--pink)' }}>{r.postProtein}</div>
          <div className="stat-box-unit">grams</div>
          <div className="stat-box-sub">leucine-rich source</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-label">CARBOHYDRATES</div>
          <div className="stat-box-value" style={{ color: 'var(--accent)' }}>{r.postCarbs}</div>
          <div className="stat-box-unit">grams</div>
          <div className="stat-box-sub">{(r.postCarbs / r.weight).toFixed(1)} g/kg</div>
        </div>
      </div>
      <MacroRow label="Rehydration target" value={r.rehydMl} unit="ml" color="var(--info)" sub="Replace 1.5× estimated sweat loss over 2–4 hrs" />
      <MacroRow label="Sodium to replenish" value={r.postSodium} unit="mg" color="var(--warn)" sub="Add to food or use an electrolyte drink" />
      <FoodList label="IDEAL POST-WORKOUT FOODS"
        items={['Greek yogurt + berries','Whey protein + banana','Chicken + white rice','Eggs + sourdough','Tuna + rice cakes','Chocolate milk','Cottage cheese + fruit']} />
      <div className="info-box" style={{ background: 'rgba(244,114,182,0.06)', border: '1px solid rgba(244,114,182,0.15)', color: 'var(--muted)' }}>
        💡 Co-ingesting carbs and protein post-workout does not impair MPS but accelerates glycogen resynthesis. Aim for <strong>leucine ≥2–3g</strong> in your protein source.
      </div>
    </div>
  )
}

function TabLoad({ r }) {
  if (!r.shouldLoad) {
    return (
      <div className="fade-in empty-state">
        <div className="empty-state-icon">📊</div>
        <div className="empty-state-title">NOT REQUIRED FOR THIS SESSION</div>
        <div className="empty-state-body">Carb loading benefits endurance events lasting <strong style={{ color: 'var(--white)' }}>90+ minutes at hard or race intensity</strong>. Adjust your session settings to see a loading protocol.</div>
      </div>
    )
  }
  const days = [
    { label: '2 DAYS OUT',  grams: r.loadDay2,    note: 'Moderate loading — taper training',               color: 'var(--info)'   },
    { label: '1 DAY OUT',   grams: r.loadDay1,    note: 'Peak loading — rest or very easy activity',        color: 'var(--accent)' },
    { label: 'RACE MORNING',grams: r.loadMorning, note: '3–4 hrs before — familiar, low-fibre foods only',  color: 'var(--pink)'   },
  ]
  return (
    <div className="fade-in">
      <div className="section-eyebrow" style={{ color: 'var(--info)' }}>PRE-EVENT PROTOCOL</div>
      <div className="section-title">CARBOHYDRATE LOADING</div>
      {days.map(d => (
        <div key={d.label} className="step-card" style={{ borderLeft: `3px solid ${d.color}` }}>
          <div>
            <div className="step-card-label" style={{ color: d.color }}>{d.label}</div>
            <div className="step-card-note">{d.note}</div>
          </div>
          <div className="step-card-value">
            <div className="step-card-num" style={{ color: d.color }}>{d.grams}</div>
            <div className="step-card-unit">grams carbs</div>
            <div className="step-card-gkg">{(d.grams / r.weight).toFixed(0)} g/kg</div>
          </div>
        </div>
      ))}
      <FoodList label="LOADING FOODS — LOW FIBRE, HIGH CARB"
        items={['White rice','White pasta','White bread','Potatoes (no skin)','Pancakes + syrup','Sports drinks','Rice pudding','Pretzels','White bagels','Cornflakes']} />
      <div className="info-box" style={{ background: 'rgba(99,179,237,0.06)', border: '1px solid rgba(99,179,237,0.15)', color: 'var(--muted)' }}>
        ⚠️ <strong>Nothing new on race day.</strong> Only eat foods you've tested in training. Avoid high-fat, high-fibre, and high-protein meals in the 24hrs before to prevent GI distress.
      </div>
    </div>
  )
}

function TabElec({ r }) {
  return (
    <div className="fade-in">
      <div className="section-eyebrow" style={{ color: 'var(--warn)' }}>DAILY TARGETS FOR YOUR TRAINING LOAD</div>
      <div className="section-title">ELECTROLYTES</div>
      <ElecRow label="Sodium"    value={r.sodiumDaily}    unit="mg/day" max={6000} color="var(--warn)"   note="Athletes often need 2–4× sedentary targets" />
      <ElecRow label="Potassium" value={r.potassiumDaily} unit="mg/day" max={7000} color="var(--accent)" note="Critical for muscle contractions" />
      <ElecRow label="Magnesium" value={r.magnesiumDaily} unit="mg/day" max={600}  color="var(--purple)" note="Sleep, muscle relaxation, energy" />
      <ElecRow label="Calcium"   value={1000}             unit="mg/day" max={1500} color="var(--info)"   note="Bone health, muscle function" />

      <div className="stat-grid-3" style={{ marginTop: 20 }}>
        {[
          { label: 'SODIUM LOST',    value: r.sessionSodiumLoss,    unit: 'mg' },
          { label: 'POTASSIUM LOST', value: r.sessionPotassiumLoss, unit: 'mg' },
          { label: 'MAGNESIUM LOST', value: r.sessionMagLoss,       unit: 'mg' },
        ].map(e => (
          <div key={e.label} className="stat-box">
            <div className="stat-box-label">{e.label}</div>
            <div className="stat-box-value" style={{ color: 'var(--white)', fontSize: 20 }}>{e.value}</div>
            <div className="stat-box-unit">{e.unit} this session</div>
          </div>
        ))}
      </div>
      <FoodList label="SODIUM" items={['Salt (¼ tsp = 575mg)','Soy sauce','Pickles / pickle juice','Olives','Cheese','Miso soup','Electrolyte tabs']} />
      <FoodList label="POTASSIUM" items={['Banana (422mg)','Avocado (975mg)','Sweet potato','Spinach','Salmon','White beans','Coconut water']} />
      <FoodList label="MAGNESIUM" items={['Pumpkin seeds (156mg/oz)','Dark chocolate','Almonds','Black beans','Spinach','Edamame','Magnesium glycinate supp']} />
    </div>
  )
}

// ─── Config ───────────────────────────────────────────────────────────────────

const ACTIVITY_TYPES = [
  { id: 'strength', label: '🏋️ Strength' },
  { id: 'hiit',     label: '⚡ HIIT'     },
  { id: 'run',      label: '🏃 Running'  },
  { id: 'cycle',    label: '🚴 Cycling'  },
  { id: 'team',     label: '⚽ Team Sport'},
  { id: 'swim',     label: '🏊 Swimming' },
]
const DURATIONS = [
  { id: '30',  label: '<30 min' },
  { id: '45',  label: '45 min'  },
  { id: '60',  label: '60 min'  },
  { id: '90',  label: '90 min'  },
  { id: '120', label: '2 hrs'   },
  { id: '180', label: '3 hrs+'  },
]
const INTENSITIES = [
  { id: 'easy',     label: 'Easy',     sub: 'RPE 4–5' },
  { id: 'moderate', label: 'Moderate', sub: 'RPE 6–7' },
  { id: 'hard',     label: 'Hard',     sub: 'RPE 8–9' },
  { id: 'race',     label: 'Race',     sub: 'RPE 10'  },
]
const HEATS = [
  { id: 'cool',     label: '❄️ Cool',     sub: '<15°C'        },
  { id: 'moderate', label: '🌤 Moderate', sub: '15–25°C'      },
  { id: 'hot',      label: '☀️ Hot',      sub: '25–35°C'      },
  { id: 'very_hot', label: '🔥 Very Hot', sub: '>35°C / Humid' },
]
const TABS = [
  { id: 'pre',   label: '↑ PRE',          color: 'var(--accent)' },
  { id: 'intra', label: '⚡ INTRA',        color: 'var(--warn)'   },
  { id: 'post',  label: '↓ POST',         color: 'var(--pink)'   },
  { id: 'load',  label: '📊 CARB LOAD',   color: 'var(--info)'   },
  { id: 'elec',  label: '⚗️ ELECTROLYTES', color: 'var(--purple)' },
]

// ─── Main app ─────────────────────────────────────────────────────────────────

export default function App() {
  const [weight,    setWeight]    = useState(75)
  const [activity,  setActivity]  = useState('run')
  const [duration,  setDuration]  = useState('60')
  const [intensity, setIntensity] = useState('moderate')
  const [heat,      setHeat]      = useState('moderate')
  const [results,   setResults]   = useState(null)
  const [tab,       setTab]       = useState('pre')

  function handleCalculate() {
    setResults(calculate({ weightKg: weight, activityType: activity, durationMin: duration, intensity, heat }))
    setTab('pre')
  }

  return (
    <PasswordGate>
    <div className="page-wrapper">
      {/* Header */}
      <header className="site-header">
        <div className="container">
          <div className="header-inner">
            <a href="https://performuscle.com" className="logo">
              <span className="logo-name">PERFORMUSCLE</span>
              <span className="logo-tag">HEALTH · FUNCTION · PERFORMANCE</span>
            </a>
            <span className="header-badge">CLIENT EXCLUSIVE</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow">PERFORMANCE NUTRITION CALCULATOR</div>
          <h1 className="hero-title">FUEL SMARTER.<br/><span>RECOVER FASTER.</span></h1>
          <p className="hero-sub">
            Your exclusive performance nutrition tool. Enter your session details and get an exact pre, intra and post-workout nutrition plan — carb loading, electrolytes and everything in between.
          </p>
          <div className="hero-features">
            {['Pre-workout carbs & timing','Intra-workout fuelling','Post-workout recovery','Carb loading protocol','Electrolyte targets'].map(f => (
              <div key={f} className="hero-feature">
                <div className="hero-feature-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <main className="main-wrapper">
        <div className="container">

          {!results ? (
            <div className="card">
              {/* Weight */}
              <div style={{ marginBottom: 22 }}>
                <label className="form-label">BODY WEIGHT</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, maxWidth: 180 }}>
                  <input className="form-input" type="number" step="0.5" min="40" max="200"
                    value={weight} onChange={e => setWeight(e.target.value)}
                    style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 20 }}
                  />
                  <span style={{ color: 'var(--muted)', fontSize: 14 }}>kg</span>
                </div>
              </div>

              {/* Activity */}
              <div style={{ marginBottom: 22 }}>
                <label className="form-label">ACTIVITY TYPE</label>
                <div className="pill-group">
                  {ACTIVITY_TYPES.map(a => (
                    <button key={a.id} className={`pill ${activity === a.id ? 'active' : ''}`} onClick={() => setActivity(a.id)}>
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div style={{ marginBottom: 22 }}>
                <label className="form-label">SESSION DURATION</label>
                <div className="pill-group">
                  {DURATIONS.map(d => (
                    <button key={d.id} className={`pill ${duration === d.id ? 'active' : ''}`} onClick={() => setDuration(d.id)}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity */}
              <div style={{ marginBottom: 22 }}>
                <label className="form-label">INTENSITY</label>
                <div className="pill-group">
                  {INTENSITIES.map(i => (
                    <button key={i.id} className={`pill ${intensity === i.id ? 'active' : ''}`} onClick={() => setIntensity(i.id)}>
                      {i.label}
                      <span className="pill-sub">{i.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Heat */}
              <div style={{ marginBottom: 28 }}>
                <label className="form-label">ENVIRONMENT</label>
                <div className="pill-group">
                  {HEATS.map(h => (
                    <button key={h.id} className={`pill ${heat === h.id ? 'active' : ''}`} onClick={() => setHeat(h.id)}>
                      {h.label}
                      <span className="pill-sub">{h.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn-primary" onClick={handleCalculate}>
                CALCULATE MY FUEL PLAN →
              </button>
            </div>
          ) : (
            <div className="card">
              {/* Summary */}
              <div className="summary-strip">
                <div><div className="summary-label">BODY WEIGHT</div><div className="summary-value">{results.weight} kg</div></div>
                <div><div className="summary-label">SWEAT LOSS EST.</div><div className="summary-value">{Math.round(results.rehydMl / 1.5)} ml</div></div>
                <div><div className="summary-label">CARB LOAD</div><div className="summary-value">{results.shouldLoad ? 'YES' : 'N/A'}</div></div>
              </div>

              {/* Tab bar */}
              <div className="tab-bar">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    className="tab-btn"
                    onClick={() => setTab(t.id)}
                    style={{
                      background: tab === t.id ? `rgba(${t.color === 'var(--accent)' ? '0,200,150' : t.color === 'var(--warn)' ? '245,158,11' : t.color === 'var(--pink)' ? '244,114,182' : t.color === 'var(--info)' ? '96,165,250' : '167,139,250'},.12)` : undefined,
                      color:      tab === t.id ? t.color : undefined,
                      borderColor: tab === t.id ? `${t.color}44` : undefined,
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              {tab === 'pre'   && <TabPre  r={results} />}
              {tab === 'intra' && <TabIntra r={results} />}
              {tab === 'post'  && <TabPost  r={results} />}
              {tab === 'load'  && <TabLoad  r={results} />}
              {tab === 'elec'  && <TabElec  r={results} />}

              {/* Back + attribution */}
              <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                  Jeukendrup (2011) · Burke et al. (2011) · ISSN Position Stand (2017) · ACSM Fluid Guidelines
                </div>
                <button className="btn-ghost" onClick={() => setResults(null)}>← Adjust inputs</button>
              </div>
            </div>
          )}

          {/* CTA */}
          {!results && (
            <div style={{
              marginTop: 16, padding: '20px 24px', borderRadius: 12,
              background: 'rgba(0,200,150,0.06)', border: '1px solid rgba(0,200,150,0.15)',
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.05em', color: 'var(--white)', marginBottom: 6 }}>
                WANT A FULLY PERSONALISED PROGRAMME?
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.7 }}>
                This calculator gives you the numbers. Performuscle coaching gives you the full system — training, nutrition and recovery designed around you.
              </p>
              <a href="https://performuscle.com/#coaching" className="btn-primary" style={{ display: 'inline-flex', width: 'auto', padding: '11px 24px', textDecoration: 'none' }}>
                LEARN MORE →
              </a>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.08em', color: 'var(--muted)', marginBottom: 6 }}>PERFORMUSCLE</div>
          <p>Performuscle clients only · <a href="https://performuscle.com">performuscle.com</a></p>
          <p style={{ marginTop: 4 }}>Based on peer-reviewed sports nutrition research. Individual needs vary — consult a sports dietitian for clinical guidance.</p>
        </div>
      </footer>
    </div>
    </PasswordGate>
  )
}
