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
      {activeCalc === 'sb'  && <StructuralBalanceCalc />}
    </div>
  )
}

// ============================================================
// STRUCTURAL BALANCE — inline calculator
// ============================================================

function sbEstOrm(weight, reps) {
  const w = parseFloat(weight)
  if (!w || w <= 0) return null
  return w * (1 + reps / 30)
}

function sbStatus(actual, target) {
  if (actual === null) return null
  const pct = actual / target
  if (pct >= 0.95) return { label: 'ON TARGET', color: 'var(--accent)',  bg: 'var(--accent-dim)' }
  if (pct >= 0.85) return { label: 'CLOSE',     color: 'var(--warn)',    bg: 'rgba(245,158,11,.08)' }
  return                  { label: 'DEFICIT',    color: 'var(--danger)',  bg: 'rgba(239,68,68,.08)' }
}

const SB_UPPER = [
  { id: 'incline_press',  name: 'Incline DB Press',         target: 65, critical: false },
  { id: 'close_grip',     name: 'Close Grip Bench Press',   target: 75, critical: false },
  { id: 'db_military',    name: 'Seated DB Military Press', target: 65, critical: false },
  { id: 'cable_row',      name: 'Low Cable Row',            target: 75, critical: false },
  { id: 'ext_rotation',   name: 'External Rotation',        target: 10, critical: false },
  { id: 'powell_raise',   name: 'Powell Raise',             target: 8,  critical: true  },
  { id: 'incline_curl',   name: 'Incline DB Curl',          target: 13, critical: false },
]
const SB_LOWER = [
  { id: 'rdl',            name: 'Romanian Deadlift',        target: 90, critical: false },
  { id: 'calf_raise',     name: 'Standing Calf Raise',      target: 75, critical: false },
]

function SBRow({ ratio, rawVal, anchorOrm, unit, repMode, onInput }) {
  const toKg  = w => unit === 'lb' ? (parseFloat(w) || 0) * 0.4536 : (parseFloat(w) || 0)
  const reps  = repMode === '5rm' ? 5 : repMode === '3rm' ? 3 : 1
  const orm   = rawVal ? sbEstOrm(toKg(rawVal), reps) : null
  const pct   = orm !== null && anchorOrm ? (orm / anchorOrm) * 100 : null
  const st    = sbStatus(pct, ratio.target)

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 110px 64px 64px 96px',
      gap: 8, alignItems: 'center', padding: '9px 12px',
      background: ratio.critical && st?.label === 'DEFICIT' ? 'rgba(239,68,68,.06)' : 'var(--s3)',
      border: `1px solid ${ratio.critical && st?.label === 'DEFICIT' ? 'rgba(239,68,68,.4)' : 'var(--border)'}`,
      borderRadius: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--white)' }}>{ratio.name}</span>
        {ratio.critical && (
          <span style={{ fontSize: 9, letterSpacing: 1, fontFamily: 'var(--font-display)', color: 'var(--danger)', background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 3, padding: '1px 5px' }}>CRITICAL</span>
        )}
      </div>
      <input type="number" step="0.5" className="input" style={{ width: '100%' }}
        placeholder={`0 ${unit}`} value={rawVal ?? ''}
        onChange={e => onInput(e.target.value)} />
      <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}>
        {orm && repMode !== '1rm' ? `~${Math.round(orm)}kg` : '—'}
      </div>
      <div style={{ textAlign: 'center' }}>
        {pct !== null
          ? <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--sub)' }}>{Math.round(pct)}%</span>
          : <span style={{ fontSize: 11, color: 'var(--muted)' }}>—</span>}
      </div>
      <div style={{ textAlign: 'right' }}>
        {st
          ? <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1, color: st.color, background: st.bg, border: `1px solid ${st.color}44`, borderRadius: 4, padding: '2px 7px' }}>{st.label}</span>
          : <span style={{ fontSize: 10, color: 'var(--muted)' }}>target {ratio.target}%</span>}
      </div>
    </div>
  )
}

function StructuralBalanceCalc() {
  const [repMode, setRepMode] = useState('5rm')
  const [unit,    setUnit]    = useState('kg')
  const [benchRaw,    setBenchRaw]    = useState('')
  const [squatRaw,    setSquatRaw]    = useState('')
  const [wristFlexRaw, setWristFlexRaw] = useState('')
  const [hipAbdRaw,    setHipAbdRaw]    = useState('')
  const [wristExtRaw,  setWristExtRaw]  = useState('')
  const [hipAddRaw,    setHipAddRaw]    = useState('')
  const [inputs, setInputs] = useState({})
  const setInput = (id, val) => setInputs(p => ({ ...p, [id]: val }))

  const reps  = repMode === '5rm' ? 5 : repMode === '3rm' ? 3 : 1
  const toKg  = w => unit === 'lb' ? (parseFloat(w) || 0) * 0.4536 : (parseFloat(w) || 0)

  const benchOrm     = benchRaw    ? sbEstOrm(toKg(benchRaw), reps)    : null
  const squatOrm     = squatRaw    ? sbEstOrm(toKg(squatRaw), reps)    : null
  const wristFlexOrm = wristFlexRaw ? sbEstOrm(toKg(wristFlexRaw), reps) : null
  const hipAbdOrm    = hipAbdRaw    ? sbEstOrm(toKg(hipAbdRaw),    reps) : null
  const wristExtOrm  = wristExtRaw  ? sbEstOrm(toKg(wristExtRaw),  reps) : null
  const hipAddOrm    = hipAddRaw    ? sbEstOrm(toKg(hipAddRaw),    reps) : null

  const wristPct = wristExtOrm && wristFlexOrm ? (wristExtOrm / wristFlexOrm) * 100 : null
  const hipPct   = hipAddOrm   && hipAbdOrm    ? (hipAddOrm   / hipAbdOrm)    * 100 : null
  const wristSt  = sbStatus(wristPct, 65)
  const hipSt    = sbStatus(hipPct,   80)

  const upperResults = SB_UPPER.map(r => {
    const orm = inputs[r.id] ? sbEstOrm(toKg(inputs[r.id]), reps) : null
    const pct = orm && benchOrm ? (orm / benchOrm) * 100 : null
    return { ...r, pct, status: sbStatus(pct, r.target) }
  })
  const lowerResults = SB_LOWER.map(r => {
    const orm = inputs[r.id] ? sbEstOrm(toKg(inputs[r.id]), reps) : null
    const pct = orm && squatOrm ? (orm / squatOrm) * 100 : null
    return { ...r, pct, status: sbStatus(pct, r.target) }
  })
  const allResults = [
    ...upperResults,
    ...(wristPct !== null ? [{ id: 'wrist_ext', name: 'Wrist Extension', pct: wristPct, status: wristSt, critical: false }] : []),
    ...lowerResults,
    ...(hipPct !== null   ? [{ id: 'hip_add',   name: 'Hip Adductor',    pct: hipPct,   status: hipSt,   critical: false }] : []),
  ]
  const deficits  = allResults.filter(r => r.status?.label === 'DEFICIT')
  const criticals = deficits.filter(r => r.critical)
  const hasInput  = benchRaw || squatRaw || Object.keys(inputs).length > 0

  const colHdr = { fontSize: 9, fontFamily: 'var(--font-display)', letterSpacing: 1, color: 'var(--muted)' }
  const divider = (label, note) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 8px' }}>
      <div style={{ ...colHdr, letterSpacing: 2 }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      {note && <div style={{ fontSize: 10, color: 'var(--muted)' }}>{note}</div>}
    </div>
  )

  return (
    <CalcSection title="STRUCTURAL BALANCE">
      {/* Controls */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <div className="label" style={{ marginBottom: 4 }}>Input Mode</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['1rm','1RM'],['3rm','3RM'],['5rm','5RM']].map(([id, lbl]) => (
              <button key={id} className={`btn btn-sm ${repMode === id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setRepMode(id)}>{lbl}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 4 }}>Unit</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['kg','lb'].map(u => (
              <button key={u} className={`btn btn-sm ${unit === u ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setUnit(u)}>{u.toUpperCase()}</button>
            ))}
          </div>
        </div>
        {repMode !== '1rm' && (
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', padding: '6px 10px', background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 6 }}>
              Auto-converting {repMode.toUpperCase()} → 1RM · w × (1 + {repMode === '5rm' ? 5 : 3}/30)
            </div>
          </div>
        )}
      </div>

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 64px 64px 96px', gap: 8, padding: '0 12px', marginBottom: 6 }}>
        <div style={colHdr}>EXERCISE</div>
        <div style={colHdr}>{repMode === '1rm' ? '1RM' : repMode.toUpperCase()} ({unit})</div>
        <div style={{ ...colHdr, textAlign: 'center' }}>EST. 1RM</div>
        <div style={{ ...colHdr, textAlign: 'center' }}>RATIO</div>
        <div style={{ ...colHdr, textAlign: 'right' }}>STATUS</div>
      </div>

      {/* ── UPPER BODY ── */}
      {divider('UPPER BODY', 'Anchor')}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 64px 64px 96px', gap: 8, alignItems: 'center', padding: '9px 12px', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 8, marginBottom: 6 }}>
        <div style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>FLAT BENCH — ANCHOR</div>
        <input type="number" step="0.5" className="input" style={{ width: '100%' }} placeholder={`0 ${unit}`} value={benchRaw} onChange={e => setBenchRaw(e.target.value)} />
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}>{benchOrm && repMode !== '1rm' ? `~${Math.round(benchOrm)}kg` : '—'}</div>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>100%</div>
        <div />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 12 }}>
        {SB_UPPER.map(r => <SBRow key={r.id} ratio={r} rawVal={inputs[r.id] ?? null} anchorOrm={benchOrm} unit={unit} repMode={repMode} onInput={v => setInput(r.id, v)} />)}
      </div>

      {/* ── WRIST RATIO ── */}
      {divider('WRIST RATIO')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 64px 64px 96px', gap: 8, alignItems: 'center', padding: '9px 12px', background: 'rgba(96,165,250,.06)', border: '1px solid rgba(96,165,250,.2)', borderRadius: 8 }}>
          <div style={{ fontSize: 13, color: '#60a5fa' }}>Wrist Flexion — Anchor</div>
          <input type="number" step="0.5" className="input" style={{ width: '100%' }} placeholder={`0 ${unit}`} value={wristFlexRaw} onChange={e => setWristFlexRaw(e.target.value)} />
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}>{wristFlexOrm && repMode !== '1rm' ? `~${Math.round(wristFlexOrm)}kg` : '—'}</div>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#60a5fa', fontFamily: 'var(--font-display)' }}>100%</div>
          <div />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 64px 64px 96px', gap: 8, alignItems: 'center', padding: '9px 12px', background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--white)' }}>Wrist Extension</span>
          <input type="number" step="0.5" className="input" style={{ width: '100%' }} placeholder={`0 ${unit}`} value={wristExtRaw} onChange={e => setWristExtRaw(e.target.value)} />
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}>{wristExtOrm && repMode !== '1rm' ? `~${Math.round(wristExtOrm)}kg` : '—'}</div>
          <div style={{ textAlign: 'center' }}>{wristPct !== null ? <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--sub)' }}>{Math.round(wristPct)}%</span> : <span style={{ fontSize: 11, color: 'var(--muted)' }}>—</span>}</div>
          <div style={{ textAlign: 'right' }}>{wristSt ? <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1, color: wristSt.color, background: wristSt.bg, border: `1px solid ${wristSt.color}44`, borderRadius: 4, padding: '2px 7px' }}>{wristSt.label}</span> : <span style={{ fontSize: 10, color: 'var(--muted)' }}>target 65%</span>}</div>
        </div>
      </div>

      {/* ── LOWER BODY ── */}
      {divider('LOWER BODY', 'Anchor')}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 64px 64px 96px', gap: 8, alignItems: 'center', padding: '9px 12px', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 8, marginBottom: 6 }}>
        <div style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>BACK SQUAT — ANCHOR</div>
        <input type="number" step="0.5" className="input" style={{ width: '100%' }} placeholder={`0 ${unit}`} value={squatRaw} onChange={e => setSquatRaw(e.target.value)} />
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}>{squatOrm && repMode !== '1rm' ? `~${Math.round(squatOrm)}kg` : '—'}</div>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>100%</div>
        <div />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 12 }}>
        {SB_LOWER.map(r => <SBRow key={r.id} ratio={r} rawVal={inputs[r.id] ?? null} anchorOrm={squatOrm} unit={unit} repMode={repMode} onInput={v => setInput(r.id, v)} />)}
      </div>

      {/* ── HIP RATIO ── */}
      {divider('HIP RATIO')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 64px 64px 96px', gap: 8, alignItems: 'center', padding: '9px 12px', background: 'rgba(96,165,250,.06)', border: '1px solid rgba(96,165,250,.2)', borderRadius: 8 }}>
          <div style={{ fontSize: 13, color: '#60a5fa' }}>Hip Abductor — Anchor</div>
          <input type="number" step="0.5" className="input" style={{ width: '100%' }} placeholder={`0 ${unit}`} value={hipAbdRaw} onChange={e => setHipAbdRaw(e.target.value)} />
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}>{hipAbdOrm && repMode !== '1rm' ? `~${Math.round(hipAbdOrm)}kg` : '—'}</div>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#60a5fa', fontFamily: 'var(--font-display)' }}>100%</div>
          <div />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 64px 64px 96px', gap: 8, alignItems: 'center', padding: '9px 12px', background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--white)' }}>Hip Adductor</span>
          <input type="number" step="0.5" className="input" style={{ width: '100%' }} placeholder={`0 ${unit}`} value={hipAddRaw} onChange={e => setHipAddRaw(e.target.value)} />
          <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}>{hipAddOrm && repMode !== '1rm' ? `~${Math.round(hipAddOrm)}kg` : '—'}</div>
          <div style={{ textAlign: 'center' }}>{hipPct !== null ? <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--sub)' }}>{Math.round(hipPct)}%</span> : <span style={{ fontSize: 11, color: 'var(--muted)' }}>—</span>}</div>
          <div style={{ textAlign: 'right' }}>{hipSt ? <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1, color: hipSt.color, background: hipSt.bg, border: `1px solid ${hipSt.color}44`, borderRadius: 4, padding: '2px 7px' }}>{hipSt.label}</span> : <span style={{ fontSize: 10, color: 'var(--muted)' }}>target 80%</span>}</div>
        </div>
      </div>

      {/* ── Summary ── */}
      {hasInput && allResults.length > 0 && (
        <div style={{ padding: '14px 18px', background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16, display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          <div><div className="label" style={{ marginBottom: 4 }}>ASSESSED</div><span style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--accent)' }}>{allResults.length}</span></div>
          <div><div className="label" style={{ marginBottom: 4 }}>DEFICITS</div><span style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: deficits.length ? 'var(--warn)' : 'var(--accent)' }}>{deficits.length}</span></div>
          {criticals.length > 0 && (
            <div><div className="label" style={{ marginBottom: 4 }}>CRITICAL</div><span style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--danger)' }}>{criticals.length}</span></div>
          )}
          {criticals.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', padding: '6px 12px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 8, fontSize: 12, color: 'var(--danger)', flex: 1 }}>
              ⚠ Powell Raise deficit — address before upper body loading progression.
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <a href="/coach/testing" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', padding: '6px 12px', border: '1px solid var(--border-accent)', borderRadius: 6, background: 'var(--accent-dim)' }}>
          Save to client record → Testing
        </a>
      </div>
    </CalcSection>
  )
}
