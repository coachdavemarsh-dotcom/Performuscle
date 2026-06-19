import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase, getLatestTestResult } from '../../lib/supabase.js'
import {
  deriveHRZones, deriveLTHRZones, calcVDOT, derivePaceZones, predictRaceTimes,
  calcFTP, deriveFTPZones, calcCSS, deriveSwimZones, formatTime,
} from '../../lib/calculators.js'

// ─── shared helpers ────────────────────────────────────────────────────────────

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

function ZoneRow({ zone, label, lo, hi, unit, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 11, color, fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
        {zone ? `Z${zone} — ` : ''}{label}
      </span>
      <span style={{ fontSize: 11, color: 'var(--white)', fontFamily: 'var(--font-display)' }}>
        {lo}–{hi} {unit}
      </span>
    </div>
  )
}

function ProtocolBox({ steps }) {
  return (
    <div style={{ padding: '12px 14px', background: 'var(--s4)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 16 }}>
      <div className="label" style={{ marginBottom: 8, color: 'var(--accent)' }}>TEST PROTOCOL</div>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--accent)', minWidth: 18 }}>{i + 1}.</span>
          <span style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.5 }}>{s}</span>
        </div>
      ))}
    </div>
  )
}

// ─── save button ──────────────────────────────────────────────────────────────

function ClientSaveButton({ clientId, testType, results, disabled, onSaved }) {
  const [testedDate, setTestedDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    const { error: err } = await supabase.from('test_results').insert({
      client_id: clientId,
      coach_id: null,
      test_type: testType,
      results,
      coach_note: null,
      tested_date: testedDate,
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    setOpen(false)
    onSaved?.()
    setTimeout(() => setSaved(false), 4000)
  }

  if (disabled) return null

  return (
    <div style={{ marginTop: 16 }}>
      {!open ? (
        <button
          className={`btn btn-sm ${saved ? 'btn-ghost' : 'btn-primary'}`}
          onClick={() => setOpen(true)}
          style={{ minWidth: 160 }}
        >
          {saved ? '✓ Result Saved!' : 'Save My Result →'}
        </button>
      ) : (
        <div style={{ padding: '14px 16px', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 8 }}>
          <div className="label" style={{ marginBottom: 10 }}>Confirm & Save</div>
          {error && <div style={{ fontSize: 11, color: 'var(--danger)', marginBottom: 8 }}>{error}</div>}
          <div className="input-group" style={{ marginBottom: 12 }}>
            <label className="form-label">Test Date</label>
            <input className="input input-sm" type="date" value={testedDate}
              onChange={e => setTestedDate(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Result'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── last-tested status ───────────────────────────────────────────────────────

function daysSince(dateStr) {
  if (!dateStr) return null
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

function StatusBadge({ date }) {
  const days = daysSince(date)
  if (days === null) return (
    <span style={{ fontSize: 10, fontFamily: 'var(--font-display)', letterSpacing: 1, color: 'var(--muted)', background: 'var(--s4)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 7px' }}>
      NEVER LOGGED
    </span>
  )
  if (days > 56) return (
    <span style={{ fontSize: 10, fontFamily: 'var(--font-display)', letterSpacing: 1, color: 'var(--warn)', background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.3)', borderRadius: 4, padding: '2px 7px' }}>
      DUE
    </span>
  )
  return (
    <span style={{ fontSize: 10, fontFamily: 'var(--font-display)', letterSpacing: 1, color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 4, padding: '2px 7px' }}>
      {days === 0 ? 'TODAY' : days === 1 ? '1 DAY AGO' : `${days}d AGO`}
    </span>
  )
}

// ─── RESTING HR ──────────────────────────────────────────────────────────────

function RestingHRTest({ clientId, onSaved }) {
  const [age, setAge] = useState('')
  const [rhr, setRhr] = useState('')
  const [hrv, setHrv] = useState('')

  const maxHr = age ? 220 - parseInt(age) : null
  const hrr = maxHr && rhr ? maxHr - parseInt(rhr) : null
  const vo2 = maxHr && rhr ? Math.round(15 * (maxHr / parseInt(rhr)) * 10) / 10 : null
  const zones = rhr && maxHr ? deriveHRZones(parseInt(rhr), maxHr) : null

  const hrCat = (v) => {
    if (v < 50) return { label: 'Athletic', variant: 'accent' }
    if (v < 60) return { label: 'Excellent', variant: 'accent' }
    if (v < 70) return { label: 'Good', variant: 'accent' }
    if (v < 80) return { label: 'Average', variant: 'warn' }
    return { label: 'Below Average', variant: 'danger' }
  }
  const cat = rhr ? hrCat(parseInt(rhr)) : null

  return (
    <div>
      <ProtocolBox steps={[
        'Measure on waking, before getting out of bed',
        'Lie still for 5 minutes, then count your heartbeats for 60 seconds (or use a heart rate monitor)',
        'If you have a wearable (Garmin, Whoop, etc.) use the overnight reading',
        'For HRV, use your wearable\'s morning reading in milliseconds',
      ]} />

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Your Age" value={age} onChange={setAge} step={1} placeholder="30" />
          <Field label="Resting Heart Rate (bpm)" value={rhr} onChange={setRhr} step={1} placeholder="55"
            note="Count beats for 60 seconds lying still on waking" />
          <Field label="HRV (ms, optional)" value={hrv} onChange={setHrv} step={1} placeholder="65"
            note="Morning HRV from your wearable" />
        </div>

        <div>
          {rhr && age ? (
            <>
              <div className="label" style={{ marginBottom: 8 }}>Your Results</div>
              <ResultRow label="Resting HR" value={rhr} unit="bpm" highlight variant={cat?.variant} />
              {cat && <ResultRow label="Category" value={cat.label} highlight variant={cat.variant} />}
              {maxHr && <ResultRow label="Max HR (estimated)" value={maxHr} unit="bpm" note="220 − age" />}
              {hrr && <ResultRow label="HR Reserve" value={hrr} unit="bpm" />}
              {vo2 && <ResultRow label="Estimated VO₂ Max" value={vo2} unit="mL/kg/min" highlight note="Uth–Sørensen formula" />}
              {hrv && <ResultRow label="HRV" value={hrv} unit="ms" />}

              <ClientSaveButton
                clientId={clientId}
                testType="vo2_rhr"
                results={{ vo2, restingHr: parseInt(rhr), maxHr, hrr, category: cat?.label, age: parseInt(age), hrv: hrv ? parseInt(hrv) : null }}
                disabled={!vo2}
                onSaved={onSaved}
              />

              {zones && (
                <div style={{ marginTop: 16 }}>
                  <div className="label" style={{ marginBottom: 8 }}>Your HR Training Zones</div>
                  {zones.map(z => (
                    <ZoneRow key={z.label} zone={null} label={z.label} lo={z.loBpm} hi={z.hiBpm} unit="bpm" color={z.color} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state" style={{ height: 100 }}>
              <div className="empty-state-text">Enter your age and resting HR to see zones</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── 5K TIME TRIAL ───────────────────────────────────────────────────────────

function FiveKTest({ clientId, onSaved }) {
  const [minutes, setMinutes] = useState('')
  const [seconds, setSeconds] = useState('')
  const [avgHr, setAvgHr] = useState('')

  const timeSec = (minutes || seconds) ? (parseInt(minutes || 0) * 60 + parseInt(seconds || 0)) : null
  const vdot = timeSec ? calcVDOT(5000, timeSec) : null
  const paceZones = vdot ? derivePaceZones(vdot) : null
  const predictions = timeSec ? predictRaceTimes(timeSec) : null

  return (
    <div>
      <ProtocolBox steps={[
        '5–10 minute easy warm-up jog',
        'Run 5km (5000m) as fast as possible — flat, accurate course or track',
        'Maintain consistent effort — start slightly conservative, build to finish strong',
        'Record your total finish time and (if wearing HR monitor) your average HR',
        'Cool down 5 minutes easy, note any conditions (heat, wind, surface)',
      ]} />

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Minutes" value={minutes} onChange={setMinutes} step={1} placeholder="22" />
            <Field label="Seconds" value={seconds} onChange={setSeconds} step={1} placeholder="30" />
          </div>
          <Field label="Average HR (optional, bpm)" value={avgHr} onChange={setAvgHr} step={1} placeholder="175" />
        </div>

        <div>
          {timeSec ? (
            <>
              <div className="label" style={{ marginBottom: 8 }}>Your Results</div>
              <ResultRow label="5K Pace" value={formatTime(timeSec / 5)} unit="/km" highlight />
              <ResultRow label="VDOT" value={vdot} highlight note="Aerobic fitness score (Daniels)" />
              {avgHr && <ResultRow label="Average HR" value={avgHr} unit="bpm" />}

              <ClientSaveButton
                clientId={clientId}
                testType="tt_5km"
                results={{ timeSec, pacePerKm: formatTime(timeSec / 5), vdot, predictions, avgHr: avgHr ? parseInt(avgHr) : null }}
                disabled={!timeSec}
                onSaved={onSaved}
              />

              {predictions && (
                <>
                  <div className="label" style={{ marginTop: 14, marginBottom: 8 }}>Predicted Race Times</div>
                  <ResultRow label="10K" value={formatTime(predictions['10km'])} />
                  <ResultRow label="Half Marathon" value={formatTime(predictions.half_marathon)} />
                  <ResultRow label="Marathon" value={formatTime(predictions.marathon)} />
                </>
              )}

              {paceZones && (
                <>
                  <div className="label" style={{ marginTop: 14, marginBottom: 8 }}>Running Pace Zones</div>
                  {paceZones.map(z => (
                    <div key={z.zone} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 11, color: 'var(--sub)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>{z.zone} — {z.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--white)', fontFamily: 'var(--font-display)' }}>{z.pacePerKm} /km</span>
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
            <div className="empty-state" style={{ height: 100 }}>
              <div className="empty-state-text">Enter your 5K time to calculate VDOT and pace zones</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── FTP TEST ─────────────────────────────────────────────────────────────────

function FTPTest({ clientId, onSaved }) {
  const [avgPower, setAvgPower] = useState('')
  const [bodyMass, setBodyMass] = useState('')

  const ftp = avgPower ? calcFTP(parseFloat(avgPower)) : null
  const ftpPerKg = ftp && bodyMass ? Math.round((ftp / parseFloat(bodyMass)) * 100) / 100 : null
  const zones = ftp ? deriveFTPZones(ftp) : null

  return (
    <div>
      <ProtocolBox steps={[
        '20–30 minute thorough warm-up including 2–3 x 1 minute hard efforts',
        'Ride 20 minutes at the absolute maximum sustainable power — this should be very hard',
        'Use a power meter or smart trainer in ERG mode (Zwift, TrainerRoad, etc.)',
        'Record your average power for the full 20 minutes',
        'FTP is calculated as 95% of your 20-minute average power',
      ]} />

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="20-Minute Average Power (watts)" value={avgPower} onChange={setAvgPower} step={1} placeholder="240"
            note="Your average wattage for the full 20 minutes" />
          <Field label="Body Weight (kg)" value={bodyMass} onChange={setBodyMass} step={0.5} placeholder="70"
            note="Used to calculate W/kg" />
        </div>

        <div>
          {ftp ? (
            <>
              <div className="label" style={{ marginBottom: 8 }}>Your Results</div>
              <ResultRow label="FTP" value={ftp} unit="W" highlight />
              {ftpPerKg && <ResultRow label="FTP / kg" value={ftpPerKg} unit="W/kg" highlight note="Functional threshold per kg bodyweight" />}

              <ClientSaveButton
                clientId={clientId}
                testType="ftp_cycling"
                results={{ avgPower20: parseFloat(avgPower), ftp, ftpPerKg, bodyMass: bodyMass ? parseFloat(bodyMass) : null }}
                disabled={!ftp}
                onSaved={onSaved}
              />

              {zones && (
                <>
                  <div className="label" style={{ marginTop: 14, marginBottom: 8 }}>Cycling Power Zones</div>
                  {zones.map(z => (
                    <div key={z.zone} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 10px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 11, color: z.color, fontFamily: 'var(--font-display)', letterSpacing: 1 }}>Z{z.zone} — {z.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--white)', fontFamily: 'var(--font-display)' }}>{z.loW}–{z.hiW} W</span>
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
            <div className="empty-state" style={{ height: 100 }}>
              <div className="empty-state-text">Enter your 20-minute average power to calculate FTP</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── CSS SWIM TEST ────────────────────────────────────────────────────────────

function CSSTest({ clientId, onSaved }) {
  const [min400, setMin400] = useState('')
  const [sec400, setSec400] = useState('')
  const [min200, setMin200] = useState('')
  const [sec200, setSec200] = useState('')

  const time400 = (min400 || sec400) ? parseInt(min400 || 0) * 60 + parseInt(sec400 || 0) : null
  const time200 = (min200 || sec200) ? parseInt(min200 || 0) * 60 + parseInt(sec200 || 0) : null
  const css = time400 && time200 ? calcCSS(time200, time400) : null
  const zones = css ? deriveSwimZones(css) : null

  return (
    <div>
      <ProtocolBox steps={[
        '10 minute warm-up swim (easy)',
        'Swim 400m (16 laps of a 25m pool) as fast as possible — record your time',
        'Rest for 10–15 minutes (easy swimming or rest)',
        'Swim 200m (8 laps) as fast as possible — record your time',
        'CSS pace is calculated as: (400m time − 200m time) ÷ 2 per 100m',
      ]} />

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="label" style={{ marginBottom: -4, color: 'var(--sub)' }}>400m Time Trial</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Minutes" value={min400} onChange={setMin400} step={1} placeholder="6" />
            <Field label="Seconds" value={sec400} onChange={setSec400} step={1} placeholder="15" />
          </div>
          <div className="label" style={{ marginBottom: -4, color: 'var(--sub)' }}>200m Time Trial</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Minutes" value={min200} onChange={setMin200} step={1} placeholder="2" />
            <Field label="Seconds" value={sec200} onChange={setSec200} step={1} placeholder="55" />
          </div>
        </div>

        <div>
          {css ? (
            <>
              <div className="label" style={{ marginBottom: 8 }}>Your Results</div>
              <ResultRow label="CSS Pace" value={formatTime(css)} unit="/100m" highlight />
              {time400 && <ResultRow label="400m Time" value={`${min400}:${String(sec400 || 0).padStart(2, '0')}`} />}
              {time200 && <ResultRow label="200m Time" value={`${min200}:${String(sec200 || 0).padStart(2, '0')}`} />}

              <ClientSaveButton
                clientId={clientId}
                testType="css_swim"
                results={{ time200, time400, cssPer100: css }}
                disabled={!css}
                onSaved={onSaved}
              />

              {zones && (
                <>
                  <div className="label" style={{ marginTop: 14, marginBottom: 8 }}>Swim Training Zones</div>
                  {zones.map(z => (
                    <div key={z.zone} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 10px', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 11, color: 'var(--sub)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>{z.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--white)', fontFamily: 'var(--font-display)' }}>
                        {formatTime(z.loPer100)}–{formatTime(z.hiPer100)} /100m
                      </span>
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
            <div className="empty-state" style={{ height: 100 }}>
              <div className="empty-state-text">Enter both time trials to calculate CSS pace</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── LACTATE THRESHOLD ────────────────────────────────────────────────────────

function LTHRTest({ clientId, onSaved }) {
  const [lthr, setLthr] = useState('')
  const [sport, setSport] = useState('run')

  const lthrVal = lthr ? parseInt(lthr) : null
  const zones = lthrVal ? deriveLTHRZones(lthrVal) : null

  return (
    <div>
      <ProtocolBox steps={[
        '10 minute easy warm-up',
        'Run (or ride) for 30 minutes at the absolute hardest sustainable pace — as if racing',
        'Wear a heart rate monitor throughout',
        'After the first 10 minutes, record your average HR for the remaining 20 minutes',
        'That average HR for the final 20 minutes is your LTHR (Lactate Threshold Heart Rate)',
      ]} />

      <div className="grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="input-group">
            <label className="form-label">Sport</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['run', 'bike'].map(s => (
                <button key={s} className={`btn btn-sm ${sport === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setSport(s)}>
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <Field label="Average HR — Final 20 Minutes (bpm)" value={lthr} onChange={setLthr} step={1} placeholder="165"
            note="This is your Lactate Threshold Heart Rate (LTHR)" />
        </div>

        <div>
          {lthrVal ? (
            <>
              <div className="label" style={{ marginBottom: 8 }}>Your Results</div>
              <ResultRow label="LTHR" value={lthrVal} unit="bpm" highlight variant="warn" />

              <ClientSaveButton
                clientId={clientId}
                testType="lactate_threshold"
                results={{ sport, lthr: lthrVal }}
                disabled={!lthrVal}
                onSaved={onSaved}
              />

              {zones && (
                <>
                  <div className="label" style={{ marginTop: 14, marginBottom: 8 }}>HR Training Zones (Friel 7-zone)</div>
                  {zones.map(z => (
                    <ZoneRow key={z.zone} zone={z.zone} label={z.label} lo={z.loBpm} hi={z.hiBpm} unit="bpm" color={z.color} />
                  ))}
                </>
              )}
            </>
          ) : (
            <div className="empty-state" style={{ height: 100 }}>
              <div className="empty-state-text">Enter your average HR for the final 20 minutes</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

const TESTS = [
  {
    id: 'rhr',
    testType: 'vo2_rhr',
    label: 'Resting HR',
    icon: '❤',
    group: 'Cardiovascular',
    shortDesc: 'Heart rate zones + estimated VO₂ max',
    fullDesc: 'Measure on waking — sets up your heart rate training zones',
  },
  {
    id: '5k',
    testType: 'tt_5km',
    label: '5K Time Trial',
    icon: '🏃',
    group: 'Running',
    shortDesc: 'VDOT · pace zones · race predictions',
    fullDesc: 'Run 5km flat as fast as possible — calculates all running zones',
  },
  {
    id: 'ftp',
    testType: 'ftp_cycling',
    label: 'FTP Test',
    icon: '🚴',
    group: 'Cycling',
    shortDesc: 'Functional threshold power · W/kg · power zones',
    fullDesc: '20-minute max effort on the bike — sets all cycling power zones',
  },
  {
    id: 'css',
    testType: 'css_swim',
    label: 'CSS Swim',
    icon: '🏊',
    group: 'Swimming',
    shortDesc: 'Critical swim speed · swim pace zones',
    fullDesc: '400m + 200m time trials — calculates your swim training zones',
  },
  {
    id: 'lthr',
    testType: 'lactate_threshold',
    label: 'Lactate Threshold',
    icon: '📈',
    group: 'Endurance',
    shortDesc: 'LTHR · Friel 7-zone HR model',
    fullDesc: '30-minute max effort with HR monitor — precision HR zones',
  },
]

export default function ClientTesting() {
  const { user } = useAuth()
  const [activeTest, setActiveTest] = useState('rhr')
  const [lastResults, setLastResults] = useState({})
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!user) return
    Promise.all(TESTS.map(t => getLatestTestResult(user.id, t.testType)))
      .then(results => {
        const map = {}
        TESTS.forEach((t, i) => { map[t.testType] = results[i].data })
        setLastResults(map)
      })
  }, [user, refreshKey])

  function handleSaved() {
    setRefreshKey(k => k + 1)
  }

  const active = TESTS.find(t => t.id === activeTest)

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">My Testing</div>
          <div className="page-subtitle">Log your own fitness tests — zones auto-populate across all your training</div>
        </div>
      </div>

      {/* Test status overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 24 }}>
        {TESTS.map(t => {
          const last = lastResults[t.testType]
          const isActive = activeTest === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActiveTest(t.id)}
              style={{
                padding: '14px 16px', textAlign: 'left', cursor: 'pointer',
                background: isActive ? 'var(--accent-dim)' : 'var(--s3)',
                border: `1px solid ${isActive ? 'var(--border-accent)' : 'var(--border)'}`,
                borderRadius: 10, transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <StatusBadge date={last?.tested_date} />
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 1,
                color: isActive ? 'var(--accent)' : 'var(--white)', marginBottom: 3,
              }}>{t.label}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>{t.shortDesc}</div>
              {last?.tested_date && (
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 6 }}>
                  Last: {new Date(last.tested_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Active test form */}
      {active && (
        <div className="card">
          {/* Test header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div className="card-title" style={{ fontSize: 16, letterSpacing: 2 }}>
                {active.icon} {active.label}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{active.fullDesc}</div>
            </div>
            {lastResults[active.testType] && (
              <div style={{
                padding: '8px 12px', background: 'var(--s4)', border: '1px solid var(--border)',
                borderRadius: 8, fontSize: 11, color: 'var(--sub)', textAlign: 'right',
              }}>
                <div className="label" style={{ marginBottom: 2, fontSize: 9 }}>LAST LOGGED</div>
                {new Date(lastResults[active.testType].tested_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            )}
          </div>

          {/* Zone auto-population notice */}
          <div style={{
            marginBottom: 20, padding: '10px 14px',
            background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
            borderRadius: 8, fontSize: 12, color: 'var(--accent)',
          }}>
            Results saved here automatically update your training zone targets in your programme sessions.
          </div>

          {activeTest === 'rhr'  && <RestingHRTest clientId={user?.id} onSaved={handleSaved} />}
          {activeTest === '5k'   && <FiveKTest     clientId={user?.id} onSaved={handleSaved} />}
          {activeTest === 'ftp'  && <FTPTest       clientId={user?.id} onSaved={handleSaved} />}
          {activeTest === 'css'  && <CSSTest       clientId={user?.id} onSaved={handleSaved} />}
          {activeTest === 'lthr' && <LTHRTest      clientId={user?.id} onSaved={handleSaved} />}
        </div>
      )}

      {/* Link to full results */}
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <a href="/results" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none' }}>
          View full test history &amp; trends → My Results
        </a>
      </div>
    </div>
  )
}
