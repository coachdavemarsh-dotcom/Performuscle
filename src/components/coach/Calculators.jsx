import { useState } from 'react'
import {
  navalBF,
  leanMass,
  energyAvailability,
  weeklyLoss,
  epley,
  brzycki,
  lander,
  lombardi,
  estimateTDEE,
  fmt,
} from '../../lib/calculators.js'

// ============================================================
// SHARED
// ============================================================

function CalcSection({ title, children }) {
  return (
    <div className="card section-gap">
      <div className="card-title" style={{ marginBottom: 20, fontSize: 15, letterSpacing: 2 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function ResultRow({ label, value, unit = '', highlight = false, variant = 'accent' }) {
  const color = {
    accent: 'var(--accent)',
    danger: 'var(--danger)',
    warn: 'var(--warn)',
    muted: 'var(--muted)',
  }[variant] || 'var(--accent)'

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      background: highlight ? `${color}11` : 'var(--s4)',
      border: `1px solid ${highlight ? color + '33' : 'var(--border)'}`,
      borderRadius: 6,
      marginBottom: 6,
    }}>
      <span className="label" style={{ color: 'var(--sub)' }}>{label}</span>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: 18,
        color: highlight ? color : 'var(--white)',
      }}>
        {value}{unit && <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 3 }}>{unit}</span>}
      </span>
    </div>
  )
}

function Field({ label, value, onChange, type = 'number', step = 0.1, placeholder = '' }) {
  return (
    <div className="input-group">
      <label className="form-label">{label}</label>
      <input
        className="input input-sm"
        type={type}
        step={step}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

// ============================================================
// NAVAL BF% CALCULATOR
// ============================================================

function NavalBFCalc() {
  const [gender, setGender] = useState('male')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [neck, setNeck] = useState('')
  const [waist, setWaist] = useState('')
  const [hips, setHips] = useState('')

  const bf = navalBF(
    gender,
    parseFloat(waist) || 0,
    parseFloat(neck) || 0,
    parseFloat(height) || 0,
    parseFloat(hips) || 0
  )

  const lbm = bf !== null && weight
    ? leanMass(parseFloat(weight), bf)
    : null

  const fatMass = bf !== null && weight
    ? Math.round((parseFloat(weight) * (bf / 100)) * 10) / 10
    : null

  const bfCategory = bf === null ? null
    : gender === 'male'
      ? bf < 6 ? { label: 'Essential Fat', variant: 'danger' }
        : bf < 14 ? { label: 'Athletic', variant: 'accent' }
        : bf < 18 ? { label: 'Fitness', variant: 'accent' }
        : bf < 25 ? { label: 'Average', variant: 'warn' }
        : { label: 'Obese', variant: 'danger' }
      : bf < 14 ? { label: 'Essential Fat', variant: 'danger' }
        : bf < 21 ? { label: 'Athletic', variant: 'accent' }
        : bf < 25 ? { label: 'Fitness', variant: 'accent' }
        : bf < 32 ? { label: 'Average', variant: 'warn' }
        : { label: 'Obese', variant: 'danger' }

  return (
    <CalcSection title="Naval Body Fat %">
      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="input-group">
            <label className="form-label">Gender</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['male', 'female'].map(g => (
                <button
                  key={g}
                  className={`btn btn-sm ${gender === g ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setGender(g)}
                  style={{ flex: 1, textTransform: 'capitalize' }}
                >
                  {g.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <Field label="Body Weight (kg)" value={weight} onChange={setWeight} step={0.1} placeholder="80" />
            <Field label="Height (cm)" value={height} onChange={setHeight} step={1} placeholder="178" />
          </div>

          <div className="grid-2">
            <Field label="Neck (cm)" value={neck} onChange={setNeck} step={0.5} placeholder="38" />
            <Field label="Waist (cm)" value={waist} onChange={setWaist} step={0.5} placeholder="85" />
          </div>

          {gender === 'female' && (
            <Field label="Hips (cm)" value={hips} onChange={setHips} step={0.5} placeholder="95" />
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="label" style={{ marginBottom: 8 }}>Results</div>

          {bf !== null ? (
            <>
              <ResultRow label="Body Fat %" value={`${bf}`} unit="%" highlight variant={bfCategory?.variant} />
              {bfCategory && (
                <ResultRow label="Category" value={bfCategory.label} highlight variant={bfCategory.variant} />
              )}
              {fatMass !== null && <ResultRow label="Fat Mass" value={fatMass} unit="kg" />}
              {lbm !== null && <ResultRow label="Lean Body Mass" value={lbm} unit="kg" highlight />}
            </>
          ) : (
            <div className="empty-state" style={{ height: 120 }}>
              <div className="empty-state-text">Enter measurements to calculate</div>
            </div>
          )}
        </div>
      </div>
    </CalcSection>
  )
}

// ============================================================
// ENERGY AVAILABILITY
// ============================================================

function EnergyAvailabilityCalc() {
  const [gender, setGender] = useState('male')
  const [intake, setIntake] = useState('')
  const [exercise, setExercise] = useState('')
  const [lbmKg, setLbmKg] = useState('')

  const result = intake && lbmKg
    ? energyAvailability(
        parseFloat(intake),
        parseFloat(exercise) || 0,
        parseFloat(lbmKg),
        gender
      )
    : null

  const thresholds = gender === 'male'
    ? [
        { label: '< 30 kcal/kg LBM', desc: 'RED-S Risk', color: 'var(--danger)' },
        { label: '30–44 kcal/kg LBM', desc: 'Low EA', color: 'var(--warn)' },
        { label: '≥ 45 kcal/kg LBM', desc: 'Optimal', color: 'var(--accent)' },
      ]
    : [
        { label: '< 30 kcal/kg LBM', desc: 'RED-S Risk', color: 'var(--danger)' },
        { label: '30–35 kcal/kg LBM', desc: 'Critically Low', color: 'var(--danger)' },
        { label: '36–44 kcal/kg LBM', desc: 'Low EA', color: 'var(--warn)' },
        { label: '≥ 45 kcal/kg LBM', desc: 'Optimal', color: 'var(--accent)' },
      ]

  return (
    <CalcSection title="Energy Availability">
      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="input-group">
            <label className="form-label">Gender</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['male', 'female'].map(g => (
                <button
                  key={g}
                  className={`btn btn-sm ${gender === g ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setGender(g)}
                >
                  {g.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <Field label="Energy Intake (kcal)" value={intake} onChange={setIntake} step={50} placeholder="2400" />
          <Field label="Exercise Energy Expenditure (kcal)" value={exercise} onChange={setExercise} step={50} placeholder="400" />
          <Field label="Lean Body Mass (kg)" value={lbmKg} onChange={setLbmKg} step={0.5} placeholder="65" />

          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
            EA = (Intake − Exercise EE) ÷ Lean Mass
          </div>
        </div>

        <div>
          <div className="label" style={{ marginBottom: 8 }}>Results</div>

          {result ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <ResultRow
                label="Energy Availability"
                value={result.ea}
                unit="kcal/kg LBM"
                highlight
                variant={result.color}
              />
              <ResultRow
                label="Status"
                value={result.status}
                highlight
                variant={result.color}
              />
              <ResultRow
                label="Net Energy"
                value={Math.round(parseFloat(intake) - (parseFloat(exercise) || 0))}
                unit="kcal"
              />
            </div>
          ) : (
            <div className="empty-state" style={{ height: 120 }}>
              <div className="empty-state-text">Enter values to calculate</div>
            </div>
          )}

          {/* Thresholds reference */}
          <div style={{ marginTop: 16 }}>
            <div className="label" style={{ marginBottom: 8 }}>Thresholds</div>
            {thresholds.map(t => (
              <div key={t.desc} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11, color: t.color, fontFamily: 'var(--font-display)', letterSpacing: 1 }}>{t.desc}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalcSection>
  )
}

// ============================================================
// RATE OF WEIGHT LOSS
// ============================================================

function WeightLossCalc() {
  const [gender, setGender] = useState('male')
  const [currentWeight, setCurrentWeight] = useState('')
  const [bfPercent, setBfPercent] = useState('')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [activity, setActivity] = useState('moderate')
  const [intakeKcal, setIntakeKcal] = useState('')

  const tdee = currentWeight && height && age
    ? estimateTDEE(gender, parseFloat(currentWeight), parseFloat(height), parseFloat(age), activity)
    : null

  const result = currentWeight && bfPercent && tdee && intakeKcal
    ? weeklyLoss(
        parseFloat(currentWeight),
        parseFloat(bfPercent),
        tdee,
        parseFloat(intakeKcal)
      )
    : null

  const eaResult = result && intakeKcal
    ? energyAvailability(
        parseFloat(intakeKcal),
        0,
        result.leanMassKg,
        gender
      )
    : null

  return (
    <CalcSection title="Rate of Weight Loss">
      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="input-group">
            <label className="form-label">Gender</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['male', 'female'].map(g => (
                <button key={g} className={`btn btn-sm ${gender === g ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setGender(g)}>
                  {g.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <Field label="Current Weight (kg)" value={currentWeight} onChange={setCurrentWeight} step={0.5} placeholder="85" />
            <Field label="Body Fat %" value={bfPercent} onChange={setBfPercent} step={0.5} placeholder="20" />
          </div>

          <div className="grid-2">
            <Field label="Height (cm)" value={height} onChange={setHeight} step={1} placeholder="178" />
            <Field label="Age" value={age} onChange={setAge} step={1} placeholder="30" />
          </div>

          <div className="input-group">
            <label className="form-label">Activity Level</label>
            <select className="select" value={activity} onChange={e => setActivity(e.target.value)}>
              <option value="sedentary">Sedentary (desk job, no exercise)</option>
              <option value="light">Light (1–3 days/week)</option>
              <option value="moderate">Moderate (3–5 days/week)</option>
              <option value="active">Active (6–7 days/week)</option>
              <option value="very_active">Very Active (twice/day)</option>
            </select>
          </div>

          <Field label="Daily Intake Target (kcal)" value={intakeKcal} onChange={setIntakeKcal} step={50} placeholder="2000" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="label" style={{ marginBottom: 8 }}>Results</div>

          {tdee && (
            <ResultRow label="Estimated TDEE" value={tdee} unit="kcal/day" />
          )}

          {result ? (
            <>
              <ResultRow
                label="Daily Deficit"
                value={result.dailyDeficit}
                unit="kcal"
                highlight
                variant={result.dailyDeficit > 1000 ? 'danger' : result.dailyDeficit > 500 ? 'warn' : 'accent'}
              />
              <ResultRow
                label="Weekly Loss"
                value={result.weeklyLossKg}
                unit="kg/week"
                highlight
                variant={result.weeklyLossKg > 1 ? 'danger' : result.weeklyLossKg > 0.5 ? 'warn' : 'accent'}
              />
              <ResultRow label="% of Body Weight" value={result.percentOfBW} unit="%/week" />
              <ResultRow label="Lean Body Mass" value={result.leanMassKg} unit="kg" />

              {eaResult && (
                <ResultRow
                  label={`EA Status: ${eaResult.status}`}
                  value={eaResult.ea}
                  unit="kcal/kg LBM"
                  highlight
                  variant={eaResult.color}
                />
              )}

              {result.weeklyLossKg > 1 && (
                <div className="alert alert-danger" style={{ marginTop: 8, fontSize: 12 }}>
                  ⚠ Weekly loss exceeds 1kg — risk of muscle loss and RED-S. Consider increasing intake.
                </div>
              )}
            </>
          ) : (
            <div className="empty-state" style={{ height: 120 }}>
              <div className="empty-state-text">Enter all values to calculate</div>
            </div>
          )}
        </div>
      </div>
    </CalcSection>
  )
}

// ============================================================
// 1RM CALCULATOR
// ============================================================

function OneRMCalc() {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')

  const w = parseFloat(weight)
  const r = parseInt(reps)
  const hasInput = w > 0 && r > 0

  const results = hasInput
    ? [
        { label: 'Epley', value: epley(w, r), desc: 'weight × (1 + reps/30)' },
        { label: 'Brzycki', value: brzycki(w, r), desc: 'weight × 36/(37−reps)' },
        { label: 'Lander', value: lander(w, r), desc: '100w / (101.3 − 2.67×reps)' },
        { label: 'Lombardi', value: lombardi(w, r), desc: 'weight × reps^0.10' },
      ]
    : []

  const avg = results.length
    ? Math.round(results.reduce((s, r) => s + (r.value || 0), 0) / results.length)
    : null

  // Percentage table
  const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60]

  return (
    <CalcSection title="1 Rep Max Calculator">
      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="grid-2">
            <Field label="Weight Lifted (kg)" value={weight} onChange={setWeight} step={0.5} placeholder="100" />
            <Field label="Reps Performed" value={reps} onChange={setReps} step={1} placeholder="5" />
          </div>

          {hasInput && results.length > 0 && (
            <>
              <div className="label" style={{ marginTop: 8 }}>Formula Results</div>
              {results.map(r => (
                r.value !== null && (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--s4)', borderRadius: 6, border: '1px solid var(--border)' }}>
                    <div>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1, color: 'var(--white)' }}>{r.label}</span>
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{r.desc}</div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--accent)' }}>{r.value} kg</span>
                  </div>
                )
              ))}

              {avg && (
                <div style={{ padding: '10px 12px', background: 'var(--accent-dim)', border: '1px solid rgba(0,200,150,.3)', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="label">Average Estimated 1RM</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--accent)' }}>{avg} kg</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Percentage table */}
        {avg && (
          <div>
            <div className="label" style={{ marginBottom: 10 }}>Training Percentages</div>
            <table className="table">
              <thead>
                <tr>
                  <th>% 1RM</th>
                  <th>Weight (kg)</th>
                  <th>Rep Range</th>
                </tr>
              </thead>
              <tbody>
                {percentages.map(pct => {
                  const repRanges = { 100: '1', 95: '1–2', 90: '2–3', 85: '3–4', 80: '4–6', 75: '6–8', 70: '8–10', 65: '10–12', 60: '12–15' }
                  return (
                    <tr key={pct} style={{ opacity: pct === 100 ? 1 : 0.9 }}>
                      <td>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: pct >= 90 ? 'var(--danger)' : pct >= 80 ? 'var(--warn)' : 'var(--accent)' }}>
                          {pct}%
                        </span>
                      </td>
                      <td style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>
                        {Math.round(avg * pct / 100)} kg
                      </td>
                      <td style={{ color: 'var(--muted)', fontSize: 12 }}>{repRanges[pct]}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {!hasInput && (
          <div className="empty-state" style={{ height: 200 }}>
            <div className="empty-state-text">Enter weight and reps to see all 4 formulas and a full training percentage table</div>
          </div>
        )}
      </div>
    </CalcSection>
  )
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function Calculators() {
  const [activeCalc, setActiveCalc] = useState('bf')

  const calcs = [
    { id: 'bf',  label: 'Naval BF%' },
    { id: 'ea',  label: 'Energy Availability' },
    { id: 'wl',  label: 'Weight Loss Rate' },
    { id: '1rm', label: '1RM Calculator' },
    { id: 'sb',  label: 'Structural Balance' },
  ]

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Calculators</div>
        <div className="page-subtitle">Coaching tools — BF%, Energy Availability, Weight Loss, 1RM, Structural Balance</div>
      </div>

      <div className="tabs">
        {calcs.map(c => (
          <div
            key={c.id}
            className={`tab ${activeCalc === c.id ? 'active' : ''}`}
            onClick={() => setActiveCalc(c.id)}
          >
            {c.label}
          </div>
        ))}
      </div>

      {activeCalc === 'bf'  && <NavalBFCalc />}
      {activeCalc === 'ea'  && <EnergyAvailabilityCalc />}
      {activeCalc === 'wl'  && <WeightLossCalc />}
      {activeCalc === '1rm' && <OneRMCalc />}
      {activeCalc === 'sb'  && <StructuralBalanceLaunch />}
    </div>
  )
}

// ============================================================
// STRUCTURAL BALANCE LAUNCH CARD
// ============================================================

function StructuralBalanceLaunch() {
  const features = [
    'Live ratio calculator — upper & lower body anchored correctly',
    'Status pills: On Target / Close / Deficit calculated in real time',
    'Auto-generated summary — deficits, priority system & starting block',
    'Deficit list with specific A-block exercise prescriptions per ratio',
    'Four-block periodisation plan with active starting block highlighted',
    'Exercise classification table: Proximal / Mixed / Earned',
    'Chart.js progression tracking from your entered values',
    'KG / LB toggle + fully responsive',
  ]

  return (
    <CalcSection title="STRUCTURAL BALANCE CALCULATOR">
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: 'var(--sub)', lineHeight: 1.7, marginBottom: 20 }}>
          Identify muscular imbalances across 7 key strength ratios, generate a prioritised deficit report,
          and get a four-block corrective programme — all in real time.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
          {features.map((f, i) => (
            <li key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '7px 0',
              borderBottom: i < features.length - 1 ? '1px solid var(--border)' : 'none',
              fontSize: 14, color: 'var(--sub)',
            }}>
              <span style={{ color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>✓</span>
              {f}
            </li>
          ))}
        </ul>
        <a
          href="/structural-balance.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'var(--accent)', color: '#060608',
            padding: '14px 32px', borderRadius: 8,
            fontFamily: 'var(--font-display)', fontSize: 16,
            letterSpacing: 2, textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          LAUNCH CALCULATOR ↗
        </a>
      </div>
    </CalcSection>
  )
}
