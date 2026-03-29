import { useState, useEffect, useRef, useCallback } from 'react'

const PRESETS = [
  { label: '1m', seconds: 60 },
  { label: '90s', seconds: 90 },
  { label: '2m', seconds: 120 },
  { label: '3m', seconds: 180 },
  { label: '5m', seconds: 300 },
]

export default function RestTimer() {
  const [duration, setDuration] = useState(120)
  const [remaining, setRemaining] = useState(null)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  const stop = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setRemaining(null)
  }, [])

  const start = useCallback((secs) => {
    clearInterval(intervalRef.current)
    setRemaining(secs)
    setRunning(true)
  }, [])

  useEffect(() => {
    if (running && remaining !== null) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            // Subtle beep using AudioContext
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)()
              const osc = ctx.createOscillator()
              const gain = ctx.createGain()
              osc.connect(gain)
              gain.connect(ctx.destination)
              osc.frequency.value = 880
              gain.gain.setValueAtTime(0.3, ctx.currentTime)
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
              osc.start()
              osc.stop(ctx.currentTime + 0.8)
            } catch {}
            return 0
          }
          return r - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const mins = remaining !== null ? Math.floor(remaining / 60) : Math.floor(duration / 60)
  const secs = remaining !== null ? remaining % 60 : duration % 60
  const progress = remaining !== null ? (remaining / duration) * 100 : 100

  const circumference = 2 * Math.PI * 44
  const strokeDash = (progress / 100) * circumference
  const timeStr = `${mins}:${String(secs).padStart(2, '0')}`

  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      <div className="label" style={{ marginBottom: 12 }}>Rest Timer</div>

      {/* Circular timer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke="var(--s5)"
              strokeWidth="6"
            />
            <circle
              cx="50" cy="50" r="44"
              fill="none"
              stroke={running ? 'var(--accent)' : 'var(--border-hi)'}
              strokeWidth="6"
              strokeDasharray={`${strokeDash} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dasharray 1s linear' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            color: running ? 'var(--accent)' : 'var(--white)',
          }}>
            {timeStr}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Presets */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {PRESETS.map(p => (
              <button
                key={p.label}
                className={`btn btn-ghost btn-sm ${duration === p.seconds && !running ? 'active' : ''}`}
                style={{ minWidth: 42 }}
                onClick={() => {
                  setDuration(p.seconds)
                  start(p.seconds)
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 6 }}>
            {running ? (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { clearInterval(intervalRef.current); setRunning(false) }}
              >
                PAUSE
              </button>
            ) : remaining !== null && remaining > 0 ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setRunning(true)}
              >
                RESUME
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => start(duration)}
              >
                START
              </button>
            )}

            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                if (running || remaining !== null) {
                  setRemaining(r => Math.min(r + 30, duration + 30))
                }
              }}
            >
              +30s
            </button>

            {(running || remaining !== null) && (
              <button className="btn btn-ghost btn-sm" onClick={stop}>
                SKIP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
