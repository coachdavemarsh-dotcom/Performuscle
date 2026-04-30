import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useCoach } from '../../hooks/useCoach.js'
import { STRENGTH_STANDARDS, STRENGTH_LEVELS, relativeStrengthLevel } from '../../lib/calculators.js'

// ============================================================
// SHARED UI
// ============================================================

// ─── save result helper ───────────────────────────────────────────────────────

async function saveTestResult({ clientId, coachId, testType, results, coachNote, testedDate }) {
  return supabase.from('test_results').insert({
    client_id: clientId,
    coach_id: coachId,
    test_type: testType,
    results,
    coach_note: coachNote || null,
    tested_date: testedDate || new Date().toISOString().split('T')[0],
  })
}

// ─── save result button ───────────────────────────────────────────────────────

function SaveResultButton({ clientId, coachId, testType, results, disabled }) {
  const [coachNote, setCoachNote] = useState('')
  const [testedDate, setTestedDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving]   = useState(false)
  const [saved,  setSaved]    = useState(false)
  const [open,   setOpen]     = useState(false)
  const [error,  setError]    = useState(null)

  async function handleSave() {
    if (!clientId) { setError('Select a client first'); return }
    setSaving(true)
    setError(null)
    const { error: err } = await saveTestResult({ clientId, coachId, testType, results, coachNote, testedDate })
    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    setOpen(false)
    setTimeout(() => setSaved(false), 3000)
  }

  if (disabled) return null

  return (
    <div style={{ marginTop: 16 }}>
      {!open ? (
        <button
          className={`btn btn-sm ${saved ? 'btn-ghost' : 'btn-primary'}`}
          onClick={() => setOpen(true)}
          style={{ minWidth: 140 }}
        >
          {saved ? '✓ Result Saved' : 'Save Result →'}
        </button>
      ) : (
        <div style={{
          padding: '14px 16px', background: 'var(--accent-dim)',
          border: '1px solid var(--border-accent)', borderRadius: 8,
        }}>
          <div className="label" style={{ marginBottom: 10 }}>Save to Client Record</div>
          {error && <div style={{ fontSize: 11, color: 'var(--danger)', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div className="input-group">
              <label className="form-label">Test Date</label>
              <input className="input input-sm" type="date" value={testedDate}
                onChange={e => setTestedDate(e.target.value)} />
            </div>
          </div>
          <div className="input-group" style={{ marginBottom: 10 }}>
            <label className="form-label">Coach Note (optional)</label>
            <textarea className="input input-sm" rows={2} style={{ resize: 'vertical' }}
              placeholder="Conditions, context, or guidance for the client…"
              value={coachNote} onChange={e => setCoachNote(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving || !clientId}>
              {saving ? 'Saving…' : 'Confirm Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function TestSection({ title, subtitle, children }) {
  return (
    <div className="card section-gap">
      <div style={{ marginBottom: 20 }}>
        <div className="card-title" style={{ fontSize: 15, letterSpacing: 2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  )
}

function ResultRow({ label, value, unit = '', highlight = false, variant = 'accent', note = '' }) {
  const color = { accent: 'var(--accent)', danger: 'var(--danger)', warn: 'var(--warn)', muted: 'var(--muted)' }[variant] || 'var(--accent)'
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 12px',
      background: highlight ? `${color}11` : 'var(--s4)',
      border: `1px solid ${highlight ? color + '44' : 'var(--border)'}`,
      borderRadius: 6, marginBottom: 6,
    }}>
      <div>
        <span className="label" style={{ color: 'var(--sub)' }}>{label}</span>
        {note && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{note}</div>}
      </div>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: highlight ? color : 'var(--white)' }}>
        {value}{unit && <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 3 }}>{unit}</span>}
      </span>
    </div>
  )
}

function Field({ label, value, onChange, type = 'number', step = 0.1, placeholder = '', note = '' }) {
  return (
    <div className="input-group">
      <label className="form-label">{label}</label>
      <input className="input input-sm" type={type} step={step} placeholder={placeholder}
        value={value} onChange={e => onChange(e.target.value)} />
      {note && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>{note}</div>}
    </div>
  )
}

function NormTable({ title, rows, highlightFn }) {
  return (
    <div style={{ marginTop: 16 }}>
      <div className="label" style={{ marginBottom: 8 }}>{title}</div>
      {rows.map(r => (
        <div key={r.label} style={{
          display: 'flex', justifyContent: 'space-between', padding: '5px 10px',
          background: highlightFn && highlightFn(r) ? 'var(--accent-dim)' : 'transparent',
          border: '1px solid var(--border)', borderRadius: 4, marginBottom: 3,
        }}>
          <span style={{ fontSize: 11, color: 'var(--sub)' }}>{r.label}</span>
          <span style={{
            fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: 1,
            color: highlightFn && highlightFn(r) ? 'var(--accent)' : 'var(--muted)',
          }}>{r.range}</span>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// VO2 MAX — COOPER 12-MIN RUN
// ============================================================

function CooperTest({ saveProps = {} }) {
  const [distance, setDistance] = useState('')
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState('')

  const vo2 = distance
    ? Math.round(((parseFloat(distance) - 504.9) / 44.73) * 10) / 10
    : null

  const getMaleNorms = (a) => {
    const ag = parseInt(a)
    if (!ag) return []
    if (ag < 30) return [
      { label: 'Superior', range: '≥ 55.4 mL/kg/min' }, { label: 'Excellent', range: '51.1–55.3' },
      { label: 'Good', range: '45.2–51.0' }, { label: 'Fair', range: '41.1–45.1' },
      { label: 'Poor', range: '< 41.1' },
    ]
    if (ag < 40) return [
      { label: 'Superior', range: '≥ 54.0' }, { label: 'Excellent', range: '48.2–53.9' },
      { label: 'Good', range: '43.0–48.1' }, { label: 'Fair', range: '38.9–42.9' },
      { label: 'Poor', range: '< 38.9' },
    ]
    return [
      { label: 'Superior', range: '≥ 52.5' }, { label: 'Excellent', range: '46.8–52.4' },
      { label: 'Good', range: '41.0–46.7' }, { label: 'Fair', range: '36.7–40.9' },
      { label: 'Poor', range: '< 36.7' },
    ]
  }

  const getFemaleNorms = (a) => {
    const ag = parseInt(a)
    if (!ag) return []
    if (ag < 30) return [
      { label: 'Superior', range: '≥ 49.7' }, { label: 'Excellent', range: '45.2–49.6' },
      { label: 'Good', range: '38.8–45.1' }, { label: 'Fair', range: '35.1–38.7' },
      { label: 'Poor', range: '< 35.1' },
    ]
    return [
      { label: 'Superior', range: '≥ 45.2' }, { label: 'Excellent', range: '41.0–45.1' },
      { label: 'Good', range: '34.6–40.9' }, { label: 'Fair', range: '31.2–34.5' },
      { label: 'Poor', range: '< 31.2' },
    ]
  }

  const norms = gender === 'male' ? getMaleNorms(age) : getFemaleNorms(age)

  const getCategory = (vo2, g, a) => {
    const ag = parseInt(a)
    if (!vo2 || !ag) return null
    if (g === 'male') {
      const t = ag < 30 ? [55.4, 51.1, 45.2, 41.1] : ag < 40 ? [54.0, 48.2, 43.0, 38.9] : [52.5, 46.8, 41.0, 36.7]
      if (vo2 >= t[0]) return { label: 'Superior', variant: 'accent' }
      if (vo2 >= t[1]) return { label: 'Excellent', variant: 'accent' }
      if (vo2 >= t[2]) return { label: 'Good', variant: 'accent' }
      if (vo2 >= t[3]) return { label: 'Fair', variant: 'warn' }
      return { label: 'Poor', variant: 'danger' }
    } else {
      const t = ag < 30 ? [49.7, 45.2, 38.8, 35.1] : [45.2, 41.0, 34.6, 31.2]
      if (vo2 >= t[0]) return { label: 'Superior', variant: 'accent' }
      if (vo2 >= t[1]) return { label: 'Excellent', variant: 'accent' }
      if (vo2 >= t[2]) return { label: 'Good', variant: 'accent' }
      if (vo2 >= t[3]) return { label: 'Fair', variant: 'warn' }
      return { label: 'Poor', variant: 'danger' }
    }
  }

  const category = getCategory(vo2, gender, age)

  return (
    <TestSection title="Cooper 12-Minute Run Test"
      subtitle="Client runs as far as possible in 12 minutes. Measure total distance covered.">
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
          <Field label="Age" value={age} onChange={setAge} step={1} placeholder="28" />
          <Field label="Distance Covered (metres)" value={distance} onChange={setDistance} step={10} placeholder="2800"
            note="Total metres run in 12 minutes" />

          <div style={{ padding: '10px 12px', background: 'var(--s4)', borderRadius: 6, border: '1px solid var(--border)', fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--sub)' }}>Formula:</strong><br />
            VO₂max = (distance − 504.9) ÷ 44.73<br />
            <em>Cooper, K.H. (1968)</em>
          </div>
        </div>

        <div>
          <div className="label" style={{ marginBottom: 8 }}>Results</div>
          {vo2 !== null ? (
            <>
              <ResultRow label="Estimated VO₂ Max" value={vo2} unit="mL/kg/min" highlight variant={category?.variant || 'accent'} />
              {category && <ResultRow label="Classification" value={category.label} highlight variant={category.variant} />}
              <ResultRow label="Distance" value={distance} unit="m" />
            </>
          ) : (
            <div className="empty-state" style={{ height: 80 }}>
              <div className="empty-state-text">Enter distance to calculate</div>
            </div>
          )}
          {norms.length > 0 && (
            <NormTable title="Age/Gender Norms (mL/kg/min)"
              rows={norms}
              highlightFn={r => category && r.label === category.label}
            />
          )}
          <SaveResultButton {...saveProps} testType="vo2_cooper"
            results={{ vo2, distance, gender, age, category }}
            disabled={!vo2} />
        </div>
      </div>
    </TestSection>
  )
}

// ============================================================
// VO2 MAX — ROCKPORT WALK TEST
// ============================================================

function RockportTest({ saveProps = {} }) {
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [timeMins, setTimeMins] = useState('')
  const [timeSecs, setTimeSecs] = useState('')
  const [heartRate, setHeartRate] = useState('')

  const weightLbs = weightKg ? parseFloat(weightKg) * 2.20462 : 0
  const totalMins = timeMins && timeSecs !== ''
    ? parseFloat(timeMins) + parseFloat(timeSecs) / 60
    : timeMins ? parseFloat(timeMins) : 0

  const vo2 = weightLbs && totalMins && heartRate && age
    ? Math.round((132.853
        - (0.0769 * weightLbs)
        - (0.3877 * parseFloat(age))
        + (6.315 * (gender === 'male' ? 1 : 0))
        - (3.2649 * totalMins)
        - (0.1565 * parseFloat(heartRate))
      ) * 10) / 10
    : null

  return (
    <TestSection title="Rockport 1-Mile Walk Test"
      subtitle="Client walks 1 mile (1609m) as fast as possible. Record time and immediate post-walk heart rate.">
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
            <Field label="Age" value={age} onChange={setAge} step={1} placeholder="35" />
            <Field label="Body Weight (kg)" value={weightKg} onChange={setWeightKg} step={0.5} placeholder="80" />
          </div>
          <div className="grid-2">
            <Field label="Walk Time (mins)" value={timeMins} onChange={setTimeMins} step={1} placeholder="14" />
            <Field label="Seconds" value={timeSecs} onChange={setTimeSecs} step={1} placeholder="30" />
          </div>
          <Field label="Post-Walk Heart Rate (bpm)" value={heartRate} onChange={setHeartRate} step={1} placeholder="140"
            note="Measured immediately after finishing the mile" />

          <div style={{ padding: '10px 12px', background: 'var(--s4)', borderRadius: 6, border: '1px solid var(--border)', fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--sub)' }}>Formula (Kline et al., 1987):</strong><br />
            VO₂max = 132.853 − 0.0769(wt lbs) − 0.3877(age)<br />
            + 6.315(gender) − 3.2649(time) − 0.1565(HR)
          </div>
        </div>

        <div>
          <div className="label" style={{ marginBottom: 8 }}>Results</div>
          {vo2 !== null ? (
            <>
              <ResultRow label="Estimated VO₂ Max" value={vo2} unit="mL/kg/min" highlight />
              <ResultRow label="Walk Time" value={`${timeMins}:${String(timeSecs || 0).padStart(2, '0')}`} />
              <ResultRow label="Post-Walk HR" value={heartRate} unit="bpm" />
              <SaveResultButton {...saveProps} testType="vo2_rockport"
                results={{ vo2, walkTime: `${timeMins}:${String(timeSecs||0).padStart(2,'0')}`, heartRate, gender, age }}
                disabled={!vo2} />
            </>
          ) : (
            <div className="empty-state" style={{ height: 100 }}>
              <div className="empty-state-text">Enter all fields to calculate</div>
            </div>
          )}

          <div style={{ marginTop: 16, padding: '12px', background: 'var(--s4)', borderRadius: 6, border: '1px solid var(--border)' }}>
            <div className="label" style={{ marginBottom: 10 }}>VO₂ Max Reference Ranges</div>
            {[
              { label: 'Elite athletes', range: '60–85+ mL/kg/min', color: 'var(--accent)' },
              { label: 'Excellent fitness', range: '52–60', color: 'var(--accent)' },
              { label: 'Good fitness', range: '43–52', color: 'var(--sub)' },
              { label: 'Average', range: '34–43', color: 'var(--warn)' },
              { label: 'Below average', range: '< 34', color: 'var(--danger)' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11, color: r.color, fontFamily: 'var(--font-display)', letterSpacing: 1 }}>{r.label}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{r.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TestSection>
  )
}

// ============================================================
// VO2 MAX — 1.5 MILE RUN TEST
// ============================================================

function MileHalfTest({ saveProps = {} }) {
  const [mins, setMins] = useState('')
  const [secs, setSecs] = useState('')

  const totalMins = mins && secs !== '' ? parseFloat(mins) + parseFloat(secs) / 60 : mins ? parseFloat(mins) : 0
  const vo2 = totalMins > 0 ? Math.round((3.5 + 483 / totalMins) * 10) / 10 : null

  return (
    <TestSection title="1.5-Mile Run Test"
      subtitle="Client runs 1.5 miles (2414m) as fast as possible on a track. Record finish time.">
      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="grid-2">
            <Field label="Finish Time (mins)" value={mins} onChange={setMins} step={1} placeholder="10" />
            <Field label="Seconds" value={secs} onChange={setSecs} step={1} placeholder="30" />
          </div>
          <div style={{ padding: '10px 12px', background: 'var(--s4)', borderRadius: 6, border: '1px solid var(--border)', fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--sub)' }}>Formula (George et al.):</strong><br />
            VO₂max = 3.5 + 483 ÷ time (minutes)
          </div>
        </div>

        <div>
          <div className="label" style={{ marginBottom: 8 }}>Results</div>
          {vo2 ? (
            <>
              <ResultRow label="Estimated VO₂ Max" value={vo2} unit="mL/kg/min" highlight />
              <ResultRow label="Finish Time" value={`${mins}:${String(secs || 0).padStart(2, '0')}`} />
              <SaveResultButton {...saveProps} testType="vo2_mile"
                results={{ vo2, finishTime: `${mins}:${String(secs||0).padStart(2,'0')}` }}
                disabled={!vo2} />
            </>
          ) : (
            <div className="empty-state" style={{ height: 80 }}>
              <div className="empty-state-text">Enter time to calculate</div>
            </div>
          )}
        </div>
      </div>
    </TestSection>
  )
}

// ============================================================
// WINGATE TEST
// ============================================================

function WingateTest({ saveProps = {} }) {
  const [bodyMass, setBodyMass] = useState('')
  const [resistance, setResistance] = useState('')   // kg (Monark style)
  const [peakRpm, setPeakRpm] = useState('')         // highest 5-sec RPM
  const [meanRpm, setMeanRpm] = useState('')         // average RPM over 30s
  const [minRpm, setMinRpm] = useState('')           // lowest 5-sec RPM

  // Monark bike: flywheel travels 6 metres per pedal revolution
  // Power (W) = Force (kg) × Distance (m/rev) × Revolutions/sec × 9.81
  const FLYWHEEL = 6 // metres per revolution (Monark 824E)

  const calcPower = (rpm, res) => {
    if (!rpm || !res) return null
    const revsPerSec = parseFloat(rpm) / 60
    return Math.round(parseFloat(res) * FLYWHEEL * revsPerSec * 9.81)
  }

  const peakPower = calcPower(peakRpm, resistance)
  const meanPower = calcPower(meanRpm, resistance)
  const minPower = calcPower(minRpm, resistance)

  const peakPowerPerKg = peakPower && bodyMass ? Math.round((peakPower / parseFloat(bodyMass)) * 10) / 10 : null
  const meanPowerPerKg = meanPower && bodyMass ? Math.round((meanPower / parseFloat(bodyMass)) * 10) / 10 : null

  const fatigueIndex = peakPower && minPower
    ? Math.round(((peakPower - minPower) / peakPower) * 100)
    : null

  const getFatigueCategory = (fi) => {
    if (fi === null) return null
    if (fi < 30) return { label: 'Excellent Fatigue Resistance', variant: 'accent' }
    if (fi < 45) return { label: 'Good Fatigue Resistance', variant: 'accent' }
    if (fi < 55) return { label: 'Average', variant: 'warn' }
    return { label: 'High Fatigue Rate', variant: 'danger' }
  }

  const getPeakCategory = (pp) => {
    if (!pp) return null
    if (pp > 1000) return { label: 'Elite', variant: 'accent' }
    if (pp > 800) return { label: 'Excellent', variant: 'accent' }
    if (pp > 600) return { label: 'Good', variant: 'accent' }
    if (pp > 400) return { label: 'Average', variant: 'warn' }
    return { label: 'Below Average', variant: 'danger' }
  }

  const fatigueCategory = getFatigueCategory(fatigueIndex)
  const peakCategory = getPeakCategory(peakPower)

  return (
    <TestSection title="Wingate Anaerobic Power Test"
      subtitle="30-second all-out sprint on cycle ergometer (Monark). Record peak, mean, and minimum RPM.">
      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="grid-2">
            <Field label="Body Mass (kg)" value={bodyMass} onChange={setBodyMass} step={0.5} placeholder="80" />
            <Field label="Resistance (kg)" value={resistance} onChange={setResistance} step={0.5} placeholder="5"
              note="Typically 7.5% of body mass" />
          </div>
          <Field label="Peak RPM (highest 5s)" value={peakRpm} onChange={setPeakRpm} step={1} placeholder="140"
            note="Highest 5-second average pedal speed" />
          <Field label="Mean RPM (average over 30s)" value={meanRpm} onChange={setMeanRpm} step={1} placeholder="110"
            note="Average pedal speed for full 30 seconds" />
          <Field label="Minimum RPM (lowest 5s)" value={minRpm} onChange={setMinRpm} step={1} placeholder="80"
            note="Lowest 5-second average — used for fatigue index" />

          {/* Resistance suggestion */}
          {bodyMass && (
            <div style={{ padding: '10px 12px', background: 'var(--accent-dim)', border: '1px solid rgba(0,200,150,.2)', borderRadius: 6, fontSize: 11, color: 'var(--sub)' }}>
              <strong style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>SUGGESTED RESISTANCE</strong>
              <div style={{ marginTop: 4 }}>
                Standard (7.5%): <strong style={{ color: 'var(--white)' }}>{Math.round(parseFloat(bodyMass) * 0.075 * 10) / 10} kg</strong><br />
                Trained athletes (9%): <strong style={{ color: 'var(--white)' }}>{Math.round(parseFloat(bodyMass) * 0.09 * 10) / 10} kg</strong>
              </div>
            </div>
          )}

          <div style={{ padding: '10px 12px', background: 'var(--s4)', borderRadius: 6, border: '1px solid var(--border)', fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--sub)' }}>Formula (Monark ergometer):</strong><br />
            Power (W) = Force × 6m × RPM/60 × 9.81<br />
            Fatigue Index = (Peak − Min) ÷ Peak × 100
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="label" style={{ marginBottom: 4 }}>Power Output</div>

          {peakPower !== null ? (
            <>
              <ResultRow label="Peak Power" value={peakPower} unit="W" highlight variant={peakCategory?.variant} />
              {peakPowerPerKg && <ResultRow label="Peak Power / kg" value={peakPowerPerKg} unit="W/kg" highlight />}
              {meanPower && <ResultRow label="Mean Power" value={meanPower} unit="W" />}
              {meanPowerPerKg && <ResultRow label="Mean Power / kg" value={meanPowerPerKg} unit="W/kg" />}
              {minPower && <ResultRow label="Minimum Power" value={minPower} unit="W" />}
              {peakCategory && <ResultRow label="Peak Power Category" value={peakCategory.label} variant={peakCategory.variant} highlight />}
            </>
          ) : (
            <div className="empty-state" style={{ height: 80 }}>
              <div className="empty-state-text">Enter RPM and resistance to calculate</div>
            </div>
          )}

          {fatigueIndex !== null && (
            <>
              <div className="label" style={{ marginTop: 12, marginBottom: 4 }}>Anaerobic Fatigue</div>
              <ResultRow label="Fatigue Index" value={`${fatigueIndex}`} unit="%" highlight variant={fatigueCategory?.variant} />
              {fatigueCategory && <ResultRow label="Fatigue Category" value={fatigueCategory.label} variant={fatigueCategory.variant} highlight />}
            </>
          )}
          <SaveResultButton {...saveProps} testType="wingate"
            results={{ peakPower, meanPower, minPower, peakPowerPerKg, meanPowerPerKg, fatigueIndex, fatigueCategory: fatigueCategory?.label, peakCategory: peakCategory?.label, bodyMass }}
            disabled={!peakPower} />

          {/* Norms table */}
          <div style={{ marginTop: 12 }}>
            <div className="label" style={{ marginBottom: 8 }}>Peak Power Norms (W/kg)</div>
            {[
              { label: 'Elite Male Athletes', range: '13–15+ W/kg', color: 'var(--accent)' },
              { label: 'Trained Male', range: '10–12 W/kg', color: 'var(--accent)' },
              { label: 'Untrained Male', range: '7–9 W/kg', color: 'var(--sub)' },
              { label: 'Elite Female Athletes', range: '10–12 W/kg', color: 'var(--accent)' },
              { label: 'Trained Female', range: '8–10 W/kg', color: 'var(--accent)' },
              { label: 'Untrained Female', range: '5–7 W/kg', color: 'var(--sub)' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11, color: r.color }}>{r.label}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>{r.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TestSection>
  )
}

// ============================================================
// GRIP STRENGTH TEST
// ============================================================

function GripStrengthTest({ saveProps = {} }) {
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState('')
  const [dominant, setDominant] = useState('')
  const [nonDominant, setNonDominant] = useState('')

  const ratio = dominant && nonDominant
    ? Math.round((parseFloat(nonDominant) / parseFloat(dominant)) * 100)
    : null

  const getCategory = (kg, g, a) => {
    const v = parseFloat(kg)
    const ag = parseInt(a)
    if (!v || !ag) return null
    // Male norms (kg) — rough reference
    const maleThresh = ag < 30 ? [56, 48, 40, 34] : ag < 40 ? [54, 46, 38, 30] : ag < 50 ? [52, 44, 36, 28] : [48, 40, 32, 24]
    const femaleThresh = ag < 30 ? [36, 30, 24, 18] : ag < 40 ? [34, 28, 22, 16] : ag < 50 ? [32, 26, 20, 14] : [28, 22, 16, 10]
    const t = g === 'male' ? maleThresh : femaleThresh
    if (v >= t[0]) return { label: 'Excellent', variant: 'accent' }
    if (v >= t[1]) return { label: 'Good', variant: 'accent' }
    if (v >= t[2]) return { label: 'Average', variant: 'warn' }
    if (v >= t[3]) return { label: 'Below Average', variant: 'warn' }
    return { label: 'Poor', variant: 'danger' }
  }

  const category = getCategory(dominant, gender, age)

  return (
    <TestSection title="Grip Strength Test"
      subtitle="Measure handgrip strength using a calibrated dynamometer. Best of 3 attempts per hand.">
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
          <Field label="Age" value={age} onChange={setAge} step={1} placeholder="30" />
          <Field label="Dominant Hand (kg)" value={dominant} onChange={setDominant} step={0.5} placeholder="48" />
          <Field label="Non-Dominant Hand (kg)" value={nonDominant} onChange={setNonDominant} step={0.5} placeholder="44" />
        </div>

        <div>
          <div className="label" style={{ marginBottom: 8 }}>Results</div>
          {dominant ? (
            <>
              <ResultRow label="Dominant Grip" value={dominant} unit="kg" highlight variant={category?.variant} />
              {category && <ResultRow label="Classification" value={category.label} highlight variant={category.variant} />}
              {nonDominant && <ResultRow label="Non-Dominant Grip" value={nonDominant} unit="kg" />}
              {ratio !== null && (
                <ResultRow
                  label="Bilateral Ratio"
                  value={ratio}
                  unit="%"
                  highlight
                  variant={ratio < 90 ? 'danger' : ratio < 95 ? 'warn' : 'accent'}
                  note={ratio < 95 ? 'Asymmetry > 5% — flag for assessment' : 'Symmetry within normal range'}
                />
              )}
              <SaveResultButton {...saveProps} testType="grip"
                results={{ dominant, nonDominant, ratio, category: category?.label, gender, age }}
                disabled={!dominant} />
            </>
          ) : (
            <div className="empty-state" style={{ height: 80 }}>
              <div className="empty-state-text">Enter grip strength values to calculate</div>
            </div>
          )}
        </div>
      </div>
    </TestSection>
  )
}

// ============================================================
// RESTING HR / HRR FITNESS ESTIMATE
// ============================================================

function HRFitness({ saveProps = {} }) {
  const [age, setAge] = useState('')
  const [restingHr, setRestingHr] = useState('')

  const maxHr = age ? 220 - parseInt(age) : null
  const hrr = maxHr && restingHr ? maxHr - parseInt(restingHr) : null

  // Uth–Sørensen–Overgaard–Pedersen formula
  const vo2 = restingHr && maxHr
    ? Math.round((15 * (maxHr / parseInt(restingHr))) * 10) / 10
    : null

  const getHrCategory = (rhr) => {
    const v = parseInt(rhr)
    if (v < 50) return { label: 'Athletic', variant: 'accent' }
    if (v < 60) return { label: 'Excellent', variant: 'accent' }
    if (v < 70) return { label: 'Good', variant: 'accent' }
    if (v < 80) return { label: 'Average', variant: 'warn' }
    return { label: 'Below Average / Check Health', variant: 'danger' }
  }

  const hrCategory = restingHr ? getHrCategory(restingHr) : null

  return (
    <TestSection title="Resting HR & Fitness Estimate"
      subtitle="Measure resting heart rate (5 min seated, quiet). Used to estimate VO₂ max and training zones.">
      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Age" value={age} onChange={setAge} step={1} placeholder="30" />
          <Field label="Resting Heart Rate (bpm)" value={restingHr} onChange={setRestingHr} step={1} placeholder="58"
            note="Measured on waking, before getting out of bed ideally" />
        </div>

        <div>
          <div className="label" style={{ marginBottom: 8 }}>Results</div>
          {restingHr ? (
            <>
              <ResultRow label="Resting Heart Rate" value={restingHr} unit="bpm" highlight variant={hrCategory?.variant} />
              {hrCategory && <ResultRow label="RHR Category" value={hrCategory.label} highlight variant={hrCategory.variant} />}
              {maxHr && <ResultRow label="Age-Predicted Max HR (220−age)" value={maxHr} unit="bpm" />}
              {hrr && <ResultRow label="HR Reserve (HRR)" value={hrr} unit="bpm" />}
              {vo2 && <ResultRow label="Estimated VO₂ Max" value={vo2} unit="mL/kg/min" highlight note="Uth–Sørensen formula" />}
              {vo2 && <SaveResultButton {...saveProps} testType="vo2_rhr"
                results={{ vo2, restingHr: parseInt(restingHr), maxHr, hrr, category: hrCategory?.label, age }}
                disabled={!vo2} />}

              {maxHr && hrr && (
                <div style={{ marginTop: 12 }}>
                  <div className="label" style={{ marginBottom: 8 }}>Karvonen Training Zones</div>
                  {[
                    { label: 'Zone 1 — Recovery', pct: '50–60%', lo: 0.5, hi: 0.6, color: 'var(--muted)' },
                    { label: 'Zone 2 — Aerobic Base', pct: '60–70%', lo: 0.6, hi: 0.7, color: 'var(--accent)' },
                    { label: 'Zone 3 — Aerobic Dev.', pct: '70–80%', lo: 0.7, hi: 0.8, color: 'var(--accent)' },
                    { label: 'Zone 4 — Threshold', pct: '80–90%', lo: 0.8, hi: 0.9, color: 'var(--warn)' },
                    { label: 'Zone 5 — Max / VO₂ Max', pct: '90–100%', lo: 0.9, hi: 1.0, color: 'var(--danger)' },
                  ].map(z => (
                    <div key={z.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 11, color: z.color, fontFamily: 'var(--font-display)', letterSpacing: 1 }}>{z.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--white)', fontFamily: 'var(--font-display)' }}>
                        {Math.round(parseInt(restingHr) + z.lo * hrr)}–{Math.round(parseInt(restingHr) + z.hi * hrr)} bpm
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state" style={{ height: 80 }}>
              <div className="empty-state-text">Enter resting HR to calculate</div>
            </div>
          )}
        </div>
      </div>
    </TestSection>
  )
}

// ─── Relative Strength Test ───────────────────────────────────────────────────

const LIFTS = Object.keys(STRENGTH_STANDARDS)

function LevelBar({ level, color }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1,2,3,4,5].map(n => (
        <div key={n} style={{
          width: 28, height: 8, borderRadius: 3,
          background: n <= level ? color : 'var(--s4)',
          border: `1px solid ${n <= level ? color : 'var(--border)'}`,
          transition: 'background 0.2s',
        }} />
      ))}
    </div>
  )
}

function RelativeStrengthTest({ saveProps, clients, selectedClient }) {
  const [gender, setGender] = useState('male')
  const [bodyweight, setBodyweight] = useState('')
  const [orms, setOrms] = useState({})

  const clientProfile = (clients || []).find(c => c.client_id === selectedClient)?.profile
  const bw = parseFloat(bodyweight) || parseFloat(clientProfile?.current_weight) || 0

  const results = LIFTS.map(lift => {
    const orm = parseFloat(orms[lift])
    if (!orm || !bw) return { lift, orm: null, data: null }
    return { lift, orm, data: relativeStrengthLevel(lift, orm, bw, gender) }
  }).filter(r => r.data)

  const avgLevel = results.length
    ? Math.round(results.reduce((s, r) => s + r.data.level, 0) / results.length * 10) / 10
    : null

  const overallLevel = STRENGTH_LEVELS[Math.round(avgLevel) - 1] || STRENGTH_LEVELS[0]

  const saveResults = results.reduce((acc, r) => {
    acc[r.lift] = { orm_kg: r.orm, ratio: r.data.ratio, level: r.data.level, label: r.data.label }
    return acc
  }, { bodyweight_kg: bw, gender, avg_level: avgLevel })

  return (
    <TestSection
      title="Relative Strength Assessment"
      subtitle="1RM to bodyweight ratios scored against strength level standards (ExRx / Poliquin methodology)"
    >
      {/* Config row */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <div className="label" style={{ marginBottom: 4 }}>Gender</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['male','female'].map(g => (
              <button key={g} className={`btn btn-sm ${gender === g ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setGender(g)}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 4 }}>Bodyweight (kg)</div>
          <input
            type="number" step="0.1" className="input" style={{ width: 120 }}
            value={bodyweight || clientProfile?.current_weight || ''}
            placeholder={clientProfile?.current_weight ? String(clientProfile.current_weight) : '80'}
            onChange={e => setBodyweight(e.target.value)}
          />
        </div>
        {avgLevel !== null && (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div className="label" style={{ marginBottom: 4 }}>Overall Level</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 22, color: overallLevel?.color || 'var(--accent)'
              }}>{avgLevel}</span>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: '0.07em',
                color: overallLevel?.color || 'var(--accent)',
                background: (overallLevel?.color || '#00C896') + '22',
                border: `1px solid ${(overallLevel?.color || '#00C896')}44`,
                borderRadius: 4, padding: '2px 8px',
              }}>{overallLevel?.label || '—'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Level legend */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {STRENGTH_LEVELS.map((l, i) => (
          <div key={l.n} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>{i+1}. {l.label}</span>
          </div>
        ))}
      </div>

      {/* Lift inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {LIFTS.map(lift => {
          const orm = parseFloat(orms[lift])
          const data = orm && bw ? relativeStrengthLevel(lift, orm, bw, gender) : null
          return (
            <div key={lift} style={{
              display: 'grid', gridTemplateColumns: '200px 100px 80px 1fr auto',
              gap: 12, alignItems: 'center',
              padding: '10px 14px', background: 'var(--s3)',
              border: '1px solid var(--border)', borderRadius: 8,
            }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--white)' }}>{lift}</div>
              <div>
                <input
                  type="number" step="0.5" className="input" style={{ width: '100%' }}
                  placeholder="0 kg"
                  value={orms[lift] || ''}
                  onChange={e => setOrms(p => ({ ...p, [lift]: e.target.value }))}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                {data ? (
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--sub)' }}>
                    {data.ratio}×
                  </span>
                ) : (
                  <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>
                )}
              </div>
              <div>
                {data ? <LevelBar level={data.level} color={data.color} /> : (
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[1,2,3,4,5].map(n => <div key={n} style={{ width: 28, height: 8, borderRadius: 3, background: 'var(--s4)', border: '1px solid var(--border)' }} />)}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right', minWidth: 90 }}>
                {data ? (
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.06em',
                    color: data.color, background: data.color + '22',
                    border: `1px solid ${data.color}44`, borderRadius: 4, padding: '2px 8px',
                  }}>{data.label.toUpperCase()}</span>
                ) : null}
                {data?.nextRatio && (
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
                    Next: {data.nextRatio}×BW ({Math.round(data.nextRatio * bw)}kg)
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <SaveResultButton
        {...saveProps}
        testType="relative_strength"
        results={saveResults}
        disabled={results.length === 0}
      />
    </TestSection>
  )
}

// ============================================================
// STRUCTURAL BALANCE TEST
// ============================================================

// 5RM / 3RM → estimated 1RM  (Brzycki: w × (1 + reps/30))
function estOneRM(weight, reps) {
  const w = parseFloat(weight)
  if (!w || w <= 0) return null
  return w * (1 + reps / 30)
}

// Status for a ratio
function sbStatus(actual, target) {
  if (actual === null) return null
  const pct = actual / target
  if (pct >= 0.95) return { label: 'ON TARGET', color: 'var(--accent)', bg: 'var(--accent-dim)' }
  if (pct >= 0.85) return { label: 'CLOSE',     color: 'var(--warn)',   bg: 'rgba(245,158,11,.08)' }
  return                  { label: 'DEFICIT',    color: 'var(--danger)', bg: 'rgba(239,68,68,.08)' }
}

// Structural balance ratios — target is % of anchor 1RM
const SB_UPPER = [
  { id: 'incline_press',   name: 'Incline DB Press',          target: 65,  critical: false },
  { id: 'close_grip',      name: 'Close Grip Bench Press',    target: 75,  critical: false },
  { id: 'db_military',     name: 'Seated DB Military Press',  target: 65,  critical: false },
  { id: 'cable_row',       name: 'Low Cable Row',             target: 75,  critical: false },
  { id: 'ext_rotation',    name: 'External Rotation',         target: 10,  critical: false },
  { id: 'powell_raise',    name: 'Powell Raise',              target: 8,   critical: true  },
  { id: 'incline_curl',    name: 'Incline DB Curl',           target: 13,  critical: false },
]
const SB_LOWER = [
  { id: 'rdl',             name: 'Romanian Deadlift',         target: 90,  critical: false },
  { id: 'calf_raise',      name: 'Standing Calf Raise',       target: 75,  critical: false },
]

function SBRow({ ratio, orm, anchorOrm, unit, repMode, onInput }) {
  const multiplier = unit === 'lb' ? 0.4536 : 1
  const ormKg = orm !== null ? orm * multiplier : null
  const pct = ormKg !== null && anchorOrm !== null ? (ormKg / anchorOrm) * 100 : null
  const status = sbStatus(pct, ratio.target)

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 120px 70px 70px 100px',
      gap: 10, alignItems: 'center',
      padding: '10px 14px',
      background: ratio.critical && status?.label === 'DEFICIT' ? 'rgba(239,68,68,.06)' : 'var(--s3)',
      border: `1px solid ${ratio.critical && status?.label === 'DEFICIT' ? 'rgba(239,68,68,.4)' : 'var(--border)'}`,
      borderRadius: 8,
    }}>
      {/* Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--white)' }}>{ratio.name}</span>
        {ratio.critical && (
          <span style={{
            fontSize: 9, letterSpacing: 1, fontFamily: 'var(--font-display)',
            color: 'var(--danger)', background: 'rgba(239,68,68,.12)',
            border: '1px solid rgba(239,68,68,.3)', borderRadius: 3, padding: '1px 5px',
          }}>CRITICAL</span>
        )}
      </div>
      {/* Input */}
      <input
        type="number" step="0.5" className="input"
        style={{ width: '100%' }}
        placeholder={`0 ${unit}`}
        value={orm ?? ''}
        onChange={e => onInput(e.target.value)}
      />
      {/* Est. 1RM */}
      <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
        {ormKg !== null && repMode !== '1rm'
          ? `~${Math.round(ormKg)}kg`
          : '—'
        }
      </div>
      {/* Ratio % */}
      <div style={{ textAlign: 'center' }}>
        {pct !== null
          ? <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--sub)' }}>{Math.round(pct)}%</span>
          : <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>
        }
      </div>
      {/* Status */}
      <div style={{ textAlign: 'right' }}>
        {status
          ? <span style={{
              fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1,
              color: status.color, background: status.bg,
              border: `1px solid ${status.color}44`, borderRadius: 4, padding: '2px 8px',
            }}>{status.label}</span>
          : <span style={{ fontSize: 11, color: 'var(--muted)' }}>target {ratio.target}%</span>
        }
      </div>
    </div>
  )
}

function StructuralBalanceTest({ saveProps, clients, selectedClient }) {
  const [repMode, setRepMode] = useState('5rm')
  const [unit, setUnit]       = useState('kg')

  // Anchor inputs (raw weight entered, before 1RM conversion)
  const [benchRaw, setBenchRaw]   = useState('')
  const [squatRaw, setSquatRaw]   = useState('')
  const [wristFlexRaw, setWristFlexRaw] = useState('')
  const [hipAbdRaw, setHipAbdRaw]       = useState('')
  const [hipAddRaw, setHipAddRaw]       = useState('')
  const [wristExtRaw, setWristExtRaw]   = useState('')

  // Per-ratio inputs
  const [inputs, setInputs] = useState({})
  const setInput = (id, val) => setInputs(p => ({ ...p, [id]: val }))

  const reps = repMode === '5rm' ? 5 : repMode === '3rm' ? 3 : 1
  const toKg = (w) => unit === 'lb' ? (parseFloat(w) || 0) * 0.4536 : (parseFloat(w) || 0)

  // Anchor 1RMs (in kg)
  const benchOrm = benchRaw ? estOneRM(toKg(benchRaw), reps) : null
  const squatOrm = squatRaw ? estOneRM(toKg(squatRaw), reps) : null
  const wristFlexOrm = wristFlexRaw ? estOneRM(toKg(wristFlexRaw), reps) : null
  const hipAbdOrm    = hipAbdRaw    ? estOneRM(toKg(hipAbdRaw),    reps) : null

  // Per-ratio 1RMs (in kg)
  const ratioOrm = (id) => {
    const raw = inputs[id]
    if (!raw) return null
    return estOneRM(toKg(raw), reps)
  }

  // Wrist and hip ratios
  const wristExtOrm  = wristExtRaw ? estOneRM(toKg(wristExtRaw), reps) : null
  const hipAddOrmVal = hipAddRaw   ? estOneRM(toKg(hipAddRaw),   reps) : null

  const wristPct = wristExtOrm && wristFlexOrm ? (wristExtOrm / wristFlexOrm) * 100 : null
  const hipPct   = hipAddOrmVal && hipAbdOrm   ? (hipAddOrmVal / hipAbdOrm)    * 100 : null

  const wristStatus = sbStatus(wristPct, 65)
  const hipStatus   = sbStatus(hipPct,   80)

  // Deficits summary
  const upperResults = SB_UPPER.map(r => {
    const pct = ratioOrm(r.id) !== null && benchOrm ? (ratioOrm(r.id) / benchOrm) * 100 : null
    return { ...r, pct, status: sbStatus(pct, r.target) }
  })
  const lowerResults = SB_LOWER.map(r => {
    const pct = ratioOrm(r.id) !== null && squatOrm ? (ratioOrm(r.id) / squatOrm) * 100 : null
    return { ...r, pct, status: sbStatus(pct, r.target) }
  })

  const allResults = [
    ...upperResults,
    ...lowerResults,
    wristPct !== null ? { id: 'wrist_ext', name: 'Wrist Extension', pct: wristPct, status: wristStatus, critical: false } : null,
    hipPct   !== null ? { id: 'hip_add',   name: 'Hip Adductor',    pct: hipPct,   status: hipStatus,   critical: false } : null,
  ].filter(Boolean)

  const deficits  = allResults.filter(r => r.status?.label === 'DEFICIT')
  const criticals = deficits.filter(r => r.critical)
  const hasAnyInput = benchRaw || squatRaw || Object.keys(inputs).length > 0

  // Build save payload
  const savePayload = {
    repMode, unit,
    bench_1rm: benchOrm ? Math.round(benchOrm * 10) / 10 : null,
    squat_1rm: squatOrm ? Math.round(squatOrm * 10) / 10 : null,
    deficits_count: deficits.length,
    critical_count: criticals.length,
    ratios: Object.fromEntries(allResults.map(r => [r.id, { pct: r.pct ? Math.round(r.pct) : null, status: r.status?.label || null }])),
  }

  return (
    <TestSection
      title="Structural Balance Assessment"
      subtitle="Ratio-based strength audit — identifies muscular deficits and programs priority correctives (Poliquin methodology)"
    >
      {/* Controls */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <div className="label" style={{ marginBottom: 4 }}>Input Mode</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['1rm','1RM'],['3rm','3RM'],['5rm','5RM']].map(([id, label]) => (
              <button key={id} className={`btn btn-sm ${repMode === id ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setRepMode(id)}>{label}</button>
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
              Auto-converting {repMode.toUpperCase()} → 1RM &nbsp;·&nbsp; w × (1 + {repMode === '5rm' ? 5 : 3}/30)
            </div>
          </div>
        )}
      </div>

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 70px 70px 100px', gap: 10, padding: '0 14px', marginBottom: 6 }}>
        <div className="label" style={{ fontSize: 9 }}>EXERCISE</div>
        <div className="label" style={{ fontSize: 9 }}>{repMode === '1rm' ? '1RM' : repMode.toUpperCase()} ({unit})</div>
        <div className="label" style={{ fontSize: 9, textAlign: 'center' }}>EST. 1RM</div>
        <div className="label" style={{ fontSize: 9, textAlign: 'center' }}>RATIO</div>
        <div className="label" style={{ fontSize: 9, textAlign: 'right' }}>STATUS</div>
      </div>

      {/* ── UPPER BODY ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 8px' }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-display)', letterSpacing: 2, color: 'var(--muted)' }}>UPPER BODY</div>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <div style={{ fontSize: 10, color: 'var(--muted)' }}>Anchor</div>
      </div>

      {/* Bench anchor */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 120px 70px 70px 100px',
        gap: 10, alignItems: 'center', padding: '10px 14px',
        background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 8, marginBottom: 8,
      }}>
        <div style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
          FLAT BENCH PRESS — ANCHOR
        </div>
        <input type="number" step="0.5" className="input" style={{ width: '100%' }}
          placeholder={`0 ${unit}`} value={benchRaw}
          onChange={e => setBenchRaw(e.target.value)} />
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
          {benchOrm && repMode !== '1rm' ? `~${Math.round(benchOrm)}kg` : '—'}
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>100%</div>
        <div />
      </div>

      {/* Upper ratios */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {SB_UPPER.map(r => (
          <SBRow key={r.id} ratio={r}
            orm={inputs[r.id] ?? null}
            anchorOrm={benchOrm}
            unit={unit} repMode={repMode}
            onInput={val => setInput(r.id, val)} />
        ))}
      </div>

      {/* ── WRIST RATIO ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 8px' }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-display)', letterSpacing: 2, color: 'var(--muted)' }}>WRIST RATIO</div>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {/* Wrist Flexion anchor */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 120px 70px 70px 100px',
          gap: 10, alignItems: 'center', padding: '10px 14px',
          background: 'rgba(96,165,250,.06)', border: '1px solid rgba(96,165,250,.2)', borderRadius: 8,
        }}>
          <div style={{ fontSize: 13, color: 'var(--info, #60a5fa)' }}>Wrist Flexion — Anchor</div>
          <input type="number" step="0.5" className="input" style={{ width: '100%' }}
            placeholder={`0 ${unit}`} value={wristFlexRaw}
            onChange={e => setWristFlexRaw(e.target.value)} />
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
            {wristFlexOrm && repMode !== '1rm' ? `~${Math.round(wristFlexOrm)}kg` : '—'}
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#60a5fa', fontFamily: 'var(--font-display)' }}>100%</div>
          <div />
        </div>
        {/* Wrist Extension */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 120px 70px 70px 100px',
          gap: 10, alignItems: 'center', padding: '10px 14px',
          background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 8,
        }}>
          <span style={{ fontSize: 13, color: 'var(--white)' }}>Wrist Extension</span>
          <input type="number" step="0.5" className="input" style={{ width: '100%' }}
            placeholder={`0 ${unit}`} value={wristExtRaw}
            onChange={e => setWristExtRaw(e.target.value)} />
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
            {wristExtOrm && repMode !== '1rm' ? `~${Math.round(wristExtOrm)}kg` : '—'}
          </div>
          <div style={{ textAlign: 'center' }}>
            {wristPct !== null
              ? <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--sub)' }}>{Math.round(wristPct)}%</span>
              : <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>}
          </div>
          <div style={{ textAlign: 'right' }}>
            {wristStatus
              ? <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1, color: wristStatus.color, background: wristStatus.bg, border: `1px solid ${wristStatus.color}44`, borderRadius: 4, padding: '2px 8px' }}>{wristStatus.label}</span>
              : <span style={{ fontSize: 11, color: 'var(--muted)' }}>target 65%</span>}
          </div>
        </div>
      </div>

      {/* ── LOWER BODY ─────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 8px' }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-display)', letterSpacing: 2, color: 'var(--muted)' }}>LOWER BODY</div>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <div style={{ fontSize: 10, color: 'var(--muted)' }}>Anchor</div>
      </div>

      {/* Squat anchor */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 120px 70px 70px 100px',
        gap: 10, alignItems: 'center', padding: '10px 14px',
        background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 8, marginBottom: 8,
      }}>
        <div style={{ fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
          BACK SQUAT — ANCHOR
        </div>
        <input type="number" step="0.5" className="input" style={{ width: '100%' }}
          placeholder={`0 ${unit}`} value={squatRaw}
          onChange={e => setSquatRaw(e.target.value)} />
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
          {squatOrm && repMode !== '1rm' ? `~${Math.round(squatOrm)}kg` : '—'}
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>100%</div>
        <div />
      </div>

      {/* Lower ratios */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {SB_LOWER.map(r => (
          <SBRow key={r.id} ratio={r}
            orm={inputs[r.id] ?? null}
            anchorOrm={squatOrm}
            unit={unit} repMode={repMode}
            onInput={val => setInput(r.id, val)} />
        ))}
      </div>

      {/* ── HIP RATIO ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 8px' }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-display)', letterSpacing: 2, color: 'var(--muted)' }}>HIP RATIO</div>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
        {/* Hip Abductor anchor */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 120px 70px 70px 100px',
          gap: 10, alignItems: 'center', padding: '10px 14px',
          background: 'rgba(96,165,250,.06)', border: '1px solid rgba(96,165,250,.2)', borderRadius: 8,
        }}>
          <div style={{ fontSize: 13, color: '#60a5fa' }}>Hip Abductor — Anchor</div>
          <input type="number" step="0.5" className="input" style={{ width: '100%' }}
            placeholder={`0 ${unit}`} value={hipAbdRaw}
            onChange={e => setHipAbdRaw(e.target.value)} />
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
            {hipAbdOrm && repMode !== '1rm' ? `~${Math.round(hipAbdOrm)}kg` : '—'}
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: '#60a5fa', fontFamily: 'var(--font-display)' }}>100%</div>
          <div />
        </div>
        {/* Hip Adductor */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 120px 70px 70px 100px',
          gap: 10, alignItems: 'center', padding: '10px 14px',
          background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 8,
        }}>
          <span style={{ fontSize: 13, color: 'var(--white)' }}>Hip Adductor</span>
          <input type="number" step="0.5" className="input" style={{ width: '100%' }}
            placeholder={`0 ${unit}`} value={hipAddRaw}
            onChange={e => setHipAddRaw(e.target.value)} />
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
            {hipAddOrmVal && repMode !== '1rm' ? `~${Math.round(hipAddOrmVal)}kg` : '—'}
          </div>
          <div style={{ textAlign: 'center' }}>
            {hipPct !== null
              ? <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--sub)' }}>{Math.round(hipPct)}%</span>
              : <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>}
          </div>
          <div style={{ textAlign: 'right' }}>
            {hipStatus
              ? <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1, color: hipStatus.color, background: hipStatus.bg, border: `1px solid ${hipStatus.color}44`, borderRadius: 4, padding: '2px 8px' }}>{hipStatus.label}</span>
              : <span style={{ fontSize: 11, color: 'var(--muted)' }}>target 80%</span>}
          </div>
        </div>
      </div>

      {/* ── SUMMARY ────────────────────────────────────────────────────────── */}
      {hasAnyInput && allResults.length > 0 && (
        <div style={{
          padding: '16px 20px', background: 'var(--s3)',
          border: '1px solid var(--border)', borderRadius: 10, marginBottom: 20,
          display: 'flex', gap: 32, flexWrap: 'wrap',
        }}>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>RATIOS ASSESSED</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--accent)' }}>{allResults.length}</span>
          </div>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>DEFICITS</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: deficits.length ? 'var(--warn)' : 'var(--accent)' }}>{deficits.length}</span>
          </div>
          {criticals.length > 0 && (
            <div>
              <div className="label" style={{ marginBottom: 4 }}>CRITICAL</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--danger)' }}>{criticals.length}</span>
            </div>
          )}
          {criticals.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', padding: '8px 14px',
              background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)',
              borderRadius: 8, fontSize: 12, color: 'var(--danger)', flex: 1,
            }}>
              ⚠ Powell Raise deficit — programming gate active. Address before upper body loading progression.
            </div>
          )}
        </div>
      )}

      {/* Full calculator link */}
      <div style={{ marginBottom: 16 }}>
        <a href="/structural-balance.html" target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 12, color: 'var(--accent)', textDecoration: 'none',
            padding: '6px 12px', border: '1px solid var(--border-accent)',
            borderRadius: 6, background: 'var(--accent-dim)',
          }}>
          OPEN FULL CALCULATOR ↗ — periodisation plan, exercise prescriptions &amp; progression chart
        </a>
      </div>

      <SaveResultButton
        {...saveProps}
        testType="structural_balance"
        results={savePayload}
        disabled={allResults.length === 0}
      />
    </TestSection>
  )
}

// ============================================================
// MAIN PAGE
// ============================================================

const TABS = [
  { id: 'cooper', label: 'Cooper Run', group: 'VO₂ Max' },
  { id: 'rockport', label: 'Rockport Walk', group: 'VO₂ Max' },
  { id: 'mile', label: '1.5 Mile Run', group: 'VO₂ Max' },
  { id: 'wingate', label: 'Wingate', group: 'Anaerobic' },
  { id: 'grip', label: 'Grip Strength', group: 'Strength' },
  { id: 'relative', label: 'Relative Strength', group: 'Strength' },
  { id: 'balance', label: 'Structural Balance', group: 'Strength' },
  { id: 'rhr', label: 'Resting HR', group: 'Cardiovascular' },
]

export default function Testing() {
  const { user } = useAuth()
  const { clients } = useCoach()
  const [activeTab, setActiveTab]       = useState('cooper')
  const [selectedClient, setSelectedClient] = useState('')

  const groups = [...new Set(TABS.map(t => t.group))]
  const saveProps = { clientId: selectedClient, coachId: user?.id }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Fitness Testing</div>
          <div className="page-subtitle">VO₂ Max, Anaerobic Power, Strength & Cardiovascular Assessments</div>
        </div>

        {/* Client selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="label" style={{ flexShrink: 0 }}>Testing:</div>
          <select
            className="select"
            value={selectedClient}
            onChange={e => setSelectedClient(e.target.value)}
            style={{ minWidth: 180 }}
          >
            <option value="">— Select client —</option>
            {(clients || []).map(c => (
              <option key={c.id} value={c.client_id}>{c.profile?.full_name}</option>
            ))}
          </select>
          {selectedClient && (
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5,
              color: 'var(--accent)', background: 'var(--accent-dim)',
              border: '1px solid var(--border-accent)', borderRadius: 4, padding: '3px 8px',
            }}>
              ACTIVE
            </span>
          )}
        </div>
      </div>

      {!selectedClient && (
        <div style={{
          marginBottom: 20, padding: '10px 16px',
          background: 'rgba(255,173,0,.08)', border: '1px solid rgba(255,173,0,.2)',
          borderRadius: 8, fontSize: 12, color: 'var(--warn)',
        }}>
          Select a client above to enable saving results to their record.
        </div>
      )}

      {/* Grouped tab bar */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
        {groups.map(group => (
          <div key={group}>
            <div className="label" style={{ marginBottom: 6, fontSize: 9 }}>{group}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {TABS.filter(t => t.group === group).map(t => (
                <button
                  key={t.id}
                  className={`btn btn-sm ${activeTab === t.id ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {activeTab === 'cooper'   && <CooperTest   saveProps={saveProps} />}
      {activeTab === 'rockport' && <RockportTest saveProps={saveProps} />}
      {activeTab === 'mile'     && <MileHalfTest saveProps={saveProps} />}
      {activeTab === 'wingate'  && <WingateTest  saveProps={saveProps} />}
      {activeTab === 'grip'     && <GripStrengthTest saveProps={saveProps} />}
      {activeTab === 'relative' && <RelativeStrengthTest saveProps={saveProps} clients={clients} selectedClient={selectedClient} />}
      {activeTab === 'balance'  && <StructuralBalanceTest saveProps={saveProps} clients={clients} selectedClient={selectedClient} />}
      {activeTab === 'rhr'      && <HRFitness    saveProps={saveProps} />}
    </div>
  )
}
