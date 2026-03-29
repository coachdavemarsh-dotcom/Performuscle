import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { getHabitLog, upsertHabitLog, getHabitLogsRange } from '../../lib/supabase.js'

const TODAY = new Date().toISOString().split('T')[0]

// ─── Readiness Score ──────────────────────────────────────────────────────
function computeReadiness(log) {
  if (!log) return null
  let pts = 0
  let maxPts = 0

  if (log.energy_score !== null && log.energy_score !== undefined) {
    pts += (log.energy_score / 5) * 30
    maxPts += 30
  }
  if (log.stress_score !== null && log.stress_score !== undefined) {
    pts += ((6 - log.stress_score) / 5) * 25
    maxPts += 25
  }
  if (log.sleep_hrs !== null && log.sleep_hrs !== undefined) {
    pts += (Math.min(log.sleep_hrs, 9) / 9) * 25
    maxPts += 25
  }
  if (log.steps !== null && log.steps !== undefined) {
    pts += (Math.min(log.steps, 10000) / 10000) * 20
    maxPts += 20
  }

  if (maxPts === 0) return null
  return Math.round((pts / maxPts) * 100)
}

function readinessColor(score) {
  if (score === null || score === undefined) return 'var(--muted)'
  if (score > 75) return 'var(--accent)'
  if (score >= 50) return 'var(--warn)'
  return 'var(--danger)'
}

// ─── Small Ring Gauge ─────────────────────────────────────────────────────
function SmallRing({ score, size = 70 }) {
  const radius = (size - 10) / 2
  const circ = 2 * Math.PI * radius
  const offset = score !== null ? circ - (score / 100) * circ : circ
  const col = readinessColor(score)

  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="var(--s4)" strokeWidth={6}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        stroke={col}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: '50% 50%',
          transition: 'stroke-dashoffset 0.5s ease',
        }}
      />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={col}
        fontFamily="var(--font-display)"
        fontSize={size * 0.24}
      >
        {score !== null ? score : '--'}
      </text>
    </svg>
  )
}

// ─── Score Buttons (1-5) ──────────────────────────────────────────────────
function ScoreButtons({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="label" style={{ marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => onChange(value === n ? null : n)}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 6,
              border: value === n ? '2px solid var(--accent)' : '1px solid var(--border)',
              background: value === n ? 'var(--accent)' : 'var(--s4)',
              color: value === n ? 'var(--ink)' : value !== null && n <= value ? 'var(--accent)' : 'var(--muted)',
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.1s',
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Water Tracker ────────────────────────────────────────────────────────
function WaterTracker({ value, onChange }) {
  const count = value ?? 0
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div className="label">Water Glasses</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => onChange(Math.max(0, count - 1))}
            style={{
              width: 28, height: 28,
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'var(--s4)',
              color: 'var(--white)',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            −
          </button>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, minWidth: 24, textAlign: 'center', color: 'var(--accent)' }}>
            {count}
          </span>
          <button
            onClick={() => onChange(Math.min(10, count + 1))}
            style={{
              width: 28, height: 28,
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'var(--s4)',
              color: 'var(--white)',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            +
          </button>
        </div>
      </div>
      {/* 10 glass icons */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {Array.from({ length: 10 }, (_, i) => {
          const filled = i < count
          return (
            <div
              key={i}
              onClick={() => onChange(filled && count === i + 1 ? i : i + 1)}
              style={{
                fontSize: 22,
                cursor: 'pointer',
                opacity: filled ? 1 : 0.25,
                filter: filled ? 'none' : 'grayscale(1)',
                transition: 'all 0.15s',
                userSelect: 'none',
              }}
              title={`${i + 1} glass${i + 1 !== 1 ? 'es' : ''}`}
            >
              🥤
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Week Grid ────────────────────────────────────────────────────────────
function WeekGrid({ logs }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)

  return (
    <div className="card">
      <div className="label" style={{ marginBottom: 12 }}>This Week</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {days.map((d, i) => {
          const date = new Date(now)
          date.setDate(diff + i)
          const dateStr = date.toISOString().split('T')[0]
          const log = logs.find(l => l.logged_date === dateStr)
          const readiness = log ? computeReadiness(log) : null
          const isToday = dateStr === TODAY
          const isFuture = date > now && !isToday

          let bgColor = 'var(--s4)'
          if (readiness !== null) {
            if (readiness > 75) bgColor = 'rgba(0,200,150,0.18)'
            else if (readiness >= 50) bgColor = 'rgba(255,196,0,0.18)'
            else bgColor = 'rgba(255,59,48,0.18)'
          }

          return (
            <div
              key={d}
              style={{
                textAlign: 'center',
                opacity: isFuture ? 0.3 : 1,
              }}
            >
              <div style={{
                fontSize: 10,
                fontFamily: 'var(--font-display)',
                color: isToday ? 'var(--accent)' : 'var(--muted)',
                marginBottom: 4,
                letterSpacing: '0.05em',
              }}>
                {d}
              </div>
              <div style={{
                width: '100%',
                aspectRatio: 1,
                borderRadius: 6,
                background: bgColor,
                border: `1px solid ${isToday ? 'var(--accent)' : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontFamily: 'var(--font-display)',
                color: readiness !== null ? readinessColor(readiness) : 'var(--muted)',
              }}>
                {readiness !== null
                  ? readiness
                  : log
                    ? '✓'
                    : ''
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── 4-week Sparkline ────────────────────────────────────────────────────
function Sparkline({ logs28 }) {
  const width = 300
  const height = 48
  const pad = 4

  const points = logs28.map((log, i) => {
    const score = computeReadiness(log)
    const x = pad + (i / 27) * (width - pad * 2)
    const y = score !== null
      ? pad + (1 - score / 100) * (height - pad * 2)
      : null
    return { x, y, score }
  })

  const validPoints = points.filter(p => p.y !== null)
  if (validPoints.length < 2) return null

  const polyline = validPoints.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <div className="card">
      <div className="label" style={{ marginBottom: 12 }}>4-Week Readiness Trend</div>
      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block', overflow: 'visible' }}
        preserveAspectRatio="none"
      >
        <polyline
          points={polyline}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {validPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={2.5}
            fill="var(--accent)"
          />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 10, color: 'var(--muted)' }}>4 weeks ago</span>
        <span style={{ fontSize: 10, color: 'var(--muted)' }}>Today</span>
      </div>
    </div>
  )
}

// ─── Days Logged This Month ───────────────────────────────────────────────
function daysLoggedThisMonth(logs) {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const prefix = `${year}-${month}`
  return logs.filter(l => l.logged_date && l.logged_date.startsWith(prefix)).length
}

// ─── Streak calc ──────────────────────────────────────────────────────────
function computeStreak(logs) {
  if (!logs || logs.length === 0) return 0
  const loggedSet = new Set(logs.map(l => l.logged_date))

  const now = new Date()
  let streak = 0
  let cursor = new Date(now)

  // If today not logged, start from yesterday
  const todayStr = now.toISOString().split('T')[0]
  if (!loggedSet.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1)
  }

  for (let i = 0; i < 60; i++) {
    const dateStr = cursor.toISOString().split('T')[0]
    if (loggedSet.has(dateStr)) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

// ─── Weekly averages from weekLogs ───────────────────────────────────────
function weekAvg(logs, key) {
  const vals = logs.filter(l => l[key] !== null && l[key] !== undefined).map(l => l[key])
  if (vals.length === 0) return null
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

// ─── Main Habits Page ─────────────────────────────────────────────────────
export default function Habits() {
  const { user } = useAuth()
  const [date, setDate] = useState(TODAY)

  // Form fields
  const [steps, setSteps] = useState('')
  const [sleepHrs, setSleepHrs] = useState('')
  const [waterGlasses, setWaterGlasses] = useState(0)
  const [energyScore, setEnergyScore] = useState(null)
  const [hungerScore, setHungerScore] = useState(null)
  const [stressScore, setStressScore] = useState(null)

  // Data
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [weekLogs, setWeekLogs] = useState([])
  const [logs28, setLogs28] = useState([])
  const [logs60, setLogs60] = useState([])

  useEffect(() => {
    if (!user) return
    loadData()
  }, [user, date])

  async function loadData() {
    setLoading(true)

    // Load today's (or selected date's) log
    const { data } = await getHabitLog(user.id, date)
    if (data) {
      setSteps(data.steps ?? '')
      setSleepHrs(data.sleep_hrs ?? '')
      setWaterGlasses(data.water_glasses ?? 0)
      setEnergyScore(data.energy_score ?? null)
      setHungerScore(data.hunger_score ?? null)
      setStressScore(data.stress_score ?? null)
    } else {
      setSteps('')
      setSleepHrs('')
      setWaterGlasses(0)
      setEnergyScore(null)
      setHungerScore(null)
      setStressScore(null)
    }

    // Week range (Mon–Sun of current week)
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    const mon = new Date(now)
    mon.setDate(diff)
    const sun = new Date(mon)
    sun.setDate(sun.getDate() + 6)
    const { data: weekData } = await getHabitLogsRange(
      user.id,
      mon.toISOString().split('T')[0],
      sun.toISOString().split('T')[0]
    )
    setWeekLogs(weekData || [])

    // Last 28 days (for sparkline)
    const end28 = new Date()
    const start28 = new Date()
    start28.setDate(start28.getDate() - 27)
    const { data: data28 } = await getHabitLogsRange(
      user.id,
      start28.toISOString().split('T')[0],
      end28.toISOString().split('T')[0]
    )

    // Build a full 28-day array (one entry per day, null if no log)
    const logMap28 = {}
    if (data28) {
      for (const l of data28) logMap28[l.logged_date] = l
    }
    const arr28 = []
    for (let i = 27; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const ds = d.toISOString().split('T')[0]
      arr28.push(logMap28[ds] || null)
    }
    setLogs28(arr28)

    // Last 60 days for streak
    const end60 = new Date()
    const start60 = new Date()
    start60.setDate(start60.getDate() - 59)
    const { data: data60 } = await getHabitLogsRange(
      user.id,
      start60.toISOString().split('T')[0],
      end60.toISOString().split('T')[0]
    )
    setLogs60(data60 || [])

    setLoading(false)
  }

  async function handleSave() {
    if (!user) return
    setSaving(true)
    await upsertHabitLog({
      client_id: user.id,
      logged_date: date,
      steps: steps !== '' ? parseInt(steps) : null,
      sleep_hrs: sleepHrs !== '' ? parseFloat(sleepHrs) : null,
      water_glasses: waterGlasses,
      energy_score: energyScore,
      hunger_score: hungerScore,
      stress_score: stressScore,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    loadData()
  }

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>

  // Derived values
  const currentLog = {
    steps: steps !== '' ? parseInt(steps) : null,
    sleep_hrs: sleepHrs !== '' ? parseFloat(sleepHrs) : null,
    energy_score: energyScore,
    stress_score: stressScore,
  }
  const todayReadiness = computeReadiness(currentLog)
  const streak = computeStreak(logs60)
  const daysLogged = daysLoggedThisMonth(logs60)

  const avgSteps   = weekAvg(weekLogs, 'steps')
  const avgSleep   = weekAvg(weekLogs, 'sleep_hrs')
  const avgEnergy  = weekAvg(weekLogs, 'energy_score')
  const avgStress  = weekAvg(weekLogs, 'stress_score')

  const has28Data = logs28.filter(Boolean).length > 7

  const displayDate = (() => {
    const parts = date.split('-')
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  })()

  return (
    <div>
      {/* Page header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-title">Daily Habits</div>
          <div className="page-subtitle">Track your lifestyle metrics</div>
        </div>
        <input
          className="input"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{ width: 150 }}
        />
      </div>

      {/* Top stat cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {/* Streak */}
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🔥</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            color: streak > 0 ? 'var(--accent)' : 'var(--muted)',
            lineHeight: 1,
          }}>
            {streak}
          </div>
          <div className="label" style={{ marginTop: 4 }}>day streak</div>
        </div>

        {/* Today's Readiness */}
        <div className="stat-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SmallRing score={todayReadiness} size={70} />
          <div className="label" style={{ marginTop: 6 }}>Readiness</div>
        </div>

        {/* Days Logged */}
        <div className="stat-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>📅</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            color: 'var(--white)',
            lineHeight: 1,
          }}>
            {daysLogged}
          </div>
          <div className="label" style={{ marginTop: 4 }}>days this month</div>
        </div>
      </div>

      {/* Log form card */}
      <div className="card" style={{ marginBottom: 16 }}>
        {/* Card header with readiness */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--white)', letterSpacing: '0.05em' }}>
              {displayDate}
            </div>
            {todayReadiness !== null && (
              <div style={{ fontSize: 11, color: readinessColor(todayReadiness), marginTop: 2 }}>
                Readiness: {todayReadiness}
              </div>
            )}
          </div>
          {todayReadiness !== null && (
            <SmallRing score={todayReadiness} size={52} />
          )}
        </div>

        {/* Steps + Sleep grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <div className="label" style={{ marginBottom: 6 }}>Steps</div>
            <input
              className="input"
              type="number"
              placeholder="10000"
              value={steps}
              onChange={e => setSteps(e.target.value)}
            />
          </div>
          <div>
            <div className="label" style={{ marginBottom: 6 }}>Sleep (hours)</div>
            <input
              className="input"
              type="number"
              placeholder="8.0"
              step="0.5"
              value={sleepHrs}
              onChange={e => setSleepHrs(e.target.value)}
            />
          </div>
        </div>

        {/* Water glasses */}
        <WaterTracker value={waterGlasses} onChange={setWaterGlasses} />

        {/* Score buttons */}
        <ScoreButtons label="Energy Level (1–5)" value={energyScore} onChange={setEnergyScore} />
        <ScoreButtons label="Hunger Level (1–5)" value={hungerScore} onChange={setHungerScore} />
        <ScoreButtons label="Stress Level (1–5)" value={stressScore} onChange={setStressScore} />

        <button
          className={`btn ${saved ? 'btn-primary' : 'btn-ghost'}`}
          onClick={handleSave}
          disabled={saving}
          style={{ width: '100%' }}
        >
          {saving ? '...' : saved ? 'SAVED ✓' : 'SAVE HABITS'}
        </button>
      </div>

      {/* Week grid card */}
      <WeekGrid logs={weekLogs} />

      {/* 4-week sparkline */}
      {has28Data && (
        <div style={{ marginTop: 12 }}>
          <Sparkline logs28={logs28} />
        </div>
      )}

      {/* Weekly averages */}
      {weekLogs.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 12 }}>
          {avgSteps !== null && (
            <div className="stat-card">
              <div className="label">Avg Steps</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--white)' }}>
                {Math.round(avgSteps).toLocaleString()}
              </div>
            </div>
          )}
          {avgSleep !== null && (
            <div className="stat-card">
              <div className="label">Avg Sleep</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--white)' }}>
                {avgSleep.toFixed(1)}<span style={{ fontSize: 13, color: 'var(--sub)' }}>h</span>
              </div>
            </div>
          )}
          {avgEnergy !== null && (
            <div className="stat-card">
              <div className="label">Avg Energy</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--white)' }}>
                {avgEnergy.toFixed(1)}<span style={{ fontSize: 13, color: 'var(--sub)' }}>/5</span>
              </div>
            </div>
          )}
          {avgStress !== null && (
            <div className="stat-card">
              <div className="label">Avg Stress</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--white)' }}>
                {avgStress.toFixed(1)}<span style={{ fontSize: 13, color: 'var(--sub)' }}>/5</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
