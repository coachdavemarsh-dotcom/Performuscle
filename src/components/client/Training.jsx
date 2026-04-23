import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useClient } from '../../hooks/useClient.js'
import { supabase, insertNotification } from '../../lib/supabase.js'
import { getWeekSessions, upsertSetLog, completeSession, upsertConditioningLog, getConditioningLog } from '../../lib/supabase.js'
import { epley } from '../../lib/calculators.js'
import { EXERCISE_BY_NAME } from '../../data/exerciseLibrary.js'
import MovementPrep from '../shared/MovementPrep.jsx'
import ProgressionCard from '../shared/ProgressionCard.jsx'

// ─── constants ────────────────────────────────────────────────────────────────

const SET_TYPES = {
  standard:   { label: 'Standard',   cls: 'set-type-standard',  color: 'var(--muted)' },
  amrap:      { label: 'AMRAP',      cls: 'set-type-amrap',     color: 'var(--warn)' },
  drop:       { label: 'Drop Set',   cls: 'set-type-drop',      color: 'var(--purple)' },
  rest_pause: { label: 'Rest-Pause', cls: 'set-type-rest_pause',color: 'var(--info)' },
  failure:    { label: 'To Failure', cls: 'set-type-failure',   color: 'var(--danger)' },
}

const PAIRING_COLORS = ['var(--accent)', 'var(--purple)', 'var(--warn)', 'var(--info)', '#f472b6']

const REST_PRESETS = [
  { label: '45s', s: 45 },
  { label: '60s', s: 60 },
  { label: '90s', s: 90 },
  { label: '2m',  s: 120 },
  { label: '3m',  s: 180 },
  { label: '5m',  s: 300 },
]

// ─── movement prep categories ─────────────────────────────────────────────────

const PREP_CATEGORIES = [
  { key: 'feet',        label: 'Feet & Ankles', color: '#f472b6' },
  { key: 'hips',        label: 'Hips',          color: 'var(--warn)' },
  { key: 'shoulders',   label: 'Shoulders',     color: 'var(--info)' },
  { key: 'spine',       label: 'Spine',         color: 'var(--purple)' },
  { key: 'integration', label: 'Integration',   color: 'var(--accent)' },
]

// Default movement prep — 6 essentials: ground up, mobility → activation → integration
const DEFAULT_MOVEMENT_PREP = [

  // ── ANKLES ────────────────────────────────────────────────────────────────
  {
    id: 'fa2', category: 'feet',
    name: 'Ankle CARs',
    sets: 1, reps: '5 slow circles/side',
    cue: 'Full range — point, circle, flex. No compensation from knee or hip. Own every end range.',
    progression: 'Banded dorsiflexion with knee drive over 3rd toe',
    video_url: null,
  },

  // ── HIPS ──────────────────────────────────────────────────────────────────
  {
    id: 'h1', category: 'hips',
    name: 'Hip 90/90',
    sets: 2, reps: '8 slow/side each way',
    cue: 'Pelvis neutral throughout. Breathe into the hip, exhale and rotate. No lumbar extension to compensate.',
    progression: 'Hip CARs — full controlled articular rotation through max range',
    video_url: null,
  },
  {
    id: 'h2', category: 'hips',
    name: 'Hip Flexor Stretch — PPT First',
    sets: 1, reps: '45s/side',
    cue: 'Tuck tailbone, squeeze glute, ribs DOWN before you step into the stretch. Lengthen from a stacked position.',
    progression: 'Half-kneeling + ipsilateral overhead reach',
    video_url: null,
  },

  // ── SHOULDERS ─────────────────────────────────────────────────────────────
  {
    id: 's1', category: 'shoulders',
    name: 'Wall Slides',
    sets: 2, reps: '10',
    cue: 'Flat lower back against wall, ribs DOWN. Forearms glide up as scapulas upwardly rotate — move the bone, not just the arm.',
    progression: 'Single arm overhead wall slide — contralateral hand on ribs',
    video_url: null,
  },

  // ── SPINE ─────────────────────────────────────────────────────────────────
  {
    id: 'sp1', category: 'spine',
    name: 'Segmental Cat-Cow',
    sets: 2, reps: '8',
    cue: 'One vertebra at a time — cervical, thoracic, lumbar. Own each segment, pause at each transition.',
    progression: 'Thoracic extension over foam roller — breathe into the thorax',
    video_url: null,
  },

  // ── INTEGRATION ───────────────────────────────────────────────────────────
  {
    id: 'i1', category: 'integration',
    name: 'Dead Bug — Contralateral',
    sets: 2, reps: '6/side',
    cue: 'Exhale ALL air, flatten lower back. Opposite arm + leg extend slowly. RIB CAGE DOWN — do not let the lumbar leave the floor.',
    progression: 'Add resistance band at wrist + opposite ankle',
    video_url: null,
  },
]

// ─── YouTube embed helper ─────────────────────────────────────────────────────

function toEmbedUrl(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    let videoId = null
    if (u.hostname.includes('youtube.com')) {
      videoId = u.searchParams.get('v')
    } else if (u.hostname.includes('youtu.be')) {
      videoId = u.pathname.slice(1).split('?')[0]
    }
    if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
  } catch {}
  return null
}

// ─── movement prep section ────────────────────────────────────────────────────

function PrepItem({ item, catColor, checked, onCheck }) {
  const [showCue, setShowCue]         = useState(false)
  const [showProgression, setShowProg] = useState(false)
  const [showVideo, setShowVideo]     = useState(false)
  const embedUrl = toEmbedUrl(item.video_url)

  return (
    <div style={{
      padding: '12px 0',
      borderBottom: '1px solid var(--border)',
      opacity: checked ? 0.45 : 1,
      transition: 'opacity .3s',
    }}>
      {/* Row 1 — checkbox + name + sets + video */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Checkbox */}
        <div
          onClick={onCheck}
          style={{
            width: 22, height: 22, borderRadius: 5, flexShrink: 0,
            border: `1.5px solid ${checked ? catColor : 'var(--border-hi)'}`,
            background: checked ? catColor : 'var(--s4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all .2s',
            boxShadow: checked ? `0 0 8px ${catColor}55` : 'none',
            fontSize: 11, color: 'var(--ink)', fontWeight: 700,
          }}
        >
          {checked ? '✓' : ''}
        </div>

        {/* Name */}
        <div style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--white)', letterSpacing: .5 }}>
          {item.name}
        </div>

        {/* Sets × reps */}
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--sub)', flexShrink: 0 }}>
          {item.sets}×{item.reps}
        </div>

        {/* Video */}
        {embedUrl && (
          <button
            onClick={() => setShowVideo(v => !v)}
            style={{
              width: 28, height: 28, borderRadius: 5, flexShrink: 0,
              background: showVideo ? 'rgba(255,0,0,.25)' : 'rgba(255,0,0,.1)',
              border: '1px solid rgba(255,0,0,.3)',
              color: '#ff5555', fontSize: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all .2s',
            }}
            title="Watch demo"
          >▶</button>
        )}
      </div>

      {/* Video embed */}
      {showVideo && embedUrl && (
        <div style={{ marginTop: 10, borderRadius: 6, overflow: 'hidden', position: 'relative', paddingBottom: '56.25%', height: 0, background: 'var(--s3)' }}>
          <iframe
            src={embedUrl}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allow="fullscreen" allowFullScreen title={item.name}
          />
        </div>
      )}

      {/* Row 2 — cue + progression toggles */}
      <div style={{ display: 'flex', gap: 6, marginTop: 8, paddingLeft: 32 }}>
        <button
          onClick={() => setShowCue(c => !c)}
          style={{
            fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5,
            padding: '3px 8px', borderRadius: 4,
            background: showCue ? `${catColor}22` : 'var(--s3)',
            border: `1px solid ${showCue ? catColor + '66' : 'var(--border)'}`,
            color: showCue ? catColor : 'var(--muted)',
            cursor: 'pointer', transition: 'all .2s',
          }}
        >
          COACHING CUE
        </button>
        {item.progression && (
          <button
            onClick={() => setShowProg(p => !p)}
            style={{
              fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5,
              padding: '3px 8px', borderRadius: 4,
              background: showProgression ? 'rgba(0,200,150,.12)' : 'var(--s3)',
              border: `1px solid ${showProgression ? 'var(--accent)44' : 'var(--border)'}`,
              color: showProgression ? 'var(--accent)' : 'var(--muted)',
              cursor: 'pointer', transition: 'all .2s',
            }}
          >
            ↑ PROGRESSION
          </button>
        )}
      </div>

      {/* Coaching cue */}
      {showCue && item.cue && (
        <div style={{
          marginTop: 8, marginLeft: 32, padding: '10px 14px',
          background: `${catColor}0e`,
          border: `1px solid ${catColor}2a`,
          borderLeft: `3px solid ${catColor}`,
          borderRadius: 6, fontSize: 12, color: 'var(--sub)', lineHeight: 1.75,
          fontStyle: 'italic',
        }}>
          {item.cue}
        </div>
      )}

      {/* Progression */}
      {showProgression && item.progression && (
        <div style={{
          marginTop: 8, marginLeft: 32, padding: '10px 14px',
          background: 'rgba(0,200,150,.06)',
          border: '1px solid rgba(0,200,150,.2)',
          borderLeft: '3px solid var(--accent)',
          borderRadius: 6,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5, color: 'var(--accent)', marginBottom: 4 }}>
            PROGRESSION
          </div>
          <div style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.7 }}>
            {item.progression}
          </div>
        </div>
      )}
    </div>
  )
}

function MovementPrepCard({ items = DEFAULT_MOVEMENT_PREP }) {
  const [open, setOpen]     = useState(true)
  const [checked, setChecked] = useState({})
  // Track which categories are expanded
  const [catOpen, setCatOpen] = useState(() =>
    Object.fromEntries(PREP_CATEGORIES.map(c => [c.key, true]))
  )

  const doneCount = Object.values(checked).filter(Boolean).length
  const pct = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0

  // Group items by category
  const byCategory = PREP_CATEGORIES.map(cat => ({
    ...cat,
    items: items.filter(i => i.category === cat.key),
  })).filter(c => c.items.length > 0)

  // For items without a category field (legacy / coach-custom)
  const uncategorised = items.filter(i => !i.category)

  return (
    <div className="card" style={{ marginBottom: 20, borderLeft: '3px solid var(--warn)' }}>
      {/* Master header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 2,
            color: 'var(--warn)', background: 'rgba(255,173,0,.1)', border: '1px solid rgba(255,173,0,.25)',
            borderRadius: 4, padding: '3px 8px',
          }}>
            MOVEMENT PREP
          </span>
          <span style={{ fontSize: 9, color: 'var(--muted)', paddingLeft: 2 }}>
            Ground up · Positioning before loading
          </span>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ height: 2, background: 'var(--s5)', borderRadius: 1 }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: pct === 100
                ? 'linear-gradient(90deg, var(--accent), var(--accent-hi))'
                : 'linear-gradient(90deg, var(--warn), #fde68a)',
              borderRadius: 1, transition: 'width .4s',
              boxShadow: pct > 0 ? '0 0 6px rgba(255,173,0,.4)' : 'none',
            }} />
          </div>
        </div>

        <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: pct === 100 ? 'var(--accent)' : 'var(--sub)', minWidth: 44, textAlign: 'right' }}>
          {doneCount}/{items.length}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ color: 'var(--muted)', flexShrink: 0, transition: 'transform .25s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={{ padding: '0 18px 16px' }}>
          {/* Category legend */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, paddingTop: 4 }}>
            {byCategory.map(cat => {
              const catDone = cat.items.filter(i => checked[i.id]).length
              return (
                <button
                  key={cat.key}
                  onClick={() => setCatOpen(o => ({ ...o, [cat.key]: !o[cat.key] }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 20,
                    background: `${cat.color}14`,
                    border: `1px solid ${cat.color}33`,
                    cursor: 'pointer', transition: 'all .2s',
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5, color: cat.color }}>
                    {cat.label}
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--muted)' }}>
                    {catDone}/{cat.items.length}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Categories */}
          {byCategory.map(cat => (
            <div key={cat.key} style={{ marginBottom: 4 }}>
              {/* Category header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 0 6px',
                borderBottom: catOpen[cat.key] ? `1px solid ${cat.color}22` : 'none',
                marginBottom: catOpen[cat.key] ? 0 : 8,
              }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 2,
                  color: cat.color,
                }}>
                  {cat.label.toUpperCase()}
                </span>
                <div style={{ flex: 1, height: 1, background: `${cat.color}18` }} />
              </div>

              {/* Items */}
              {catOpen[cat.key] && cat.items.map(item => (
                <PrepItem
                  key={item.id}
                  item={item}
                  catColor={cat.color}
                  checked={!!checked[item.id]}
                  onCheck={() => setChecked(c => ({ ...c, [item.id]: !c[item.id] }))}
                />
              ))}
            </div>
          ))}

          {/* Legacy uncategorised items */}
          {uncategorised.map(item => (
            <PrepItem
              key={item.id}
              item={item}
              catColor="var(--muted)"
              checked={!!checked[item.id]}
              onCheck={() => setChecked(c => ({ ...c, [item.id]: !c[item.id] }))}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── rest panel (self-contained) ──────────────────────────────────────────────

function RestPanel({ autoTrigger }) {
  const [duration, setDuration] = useState(120)
  const [remaining, setRemaining] = useState(null)
  const [running, setRunning] = useState(false)
  const ref = useRef(null)

  const startTimer = useCallback((secs) => {
    clearInterval(ref.current)
    const d = secs ?? duration
    setDuration(d)
    setRemaining(d)
    setRunning(true)
  }, [duration])

  const stopTimer = () => { clearInterval(ref.current); setRunning(false); setRemaining(null) }

  useEffect(() => {
    if (!running) return
    ref.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(ref.current)
          setRunning(false)
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain); gain.connect(ctx.destination)
            osc.frequency.value = 880
            gain.gain.setValueAtTime(0.3, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
            osc.start(); osc.stop(ctx.currentTime + 0.8)
          } catch {}
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [running])

  useEffect(() => {
    if (autoTrigger > 0) startTimer(duration)
  }, [autoTrigger])

  const display  = remaining ?? duration
  const mins     = Math.floor(display / 60)
  const secs     = display % 60
  const pct      = remaining != null ? (remaining / duration) * 100 : 100
  const C        = 2 * Math.PI * 42
  const dash     = (pct / 100) * C
  const urgent   = running && remaining != null && remaining <= 10

  return (
    <div className="card" style={{ padding: '18px 20px', position: 'sticky', top: 20 }}>
      <div className="label" style={{ marginBottom: 14 }}>Rest Timer</div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <div style={{ position: 'relative', width: 96, height: 96 }}>
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="42" fill="none" stroke="var(--s5)" strokeWidth="5" />
            <circle
              cx="48" cy="48" r="42" fill="none"
              stroke={urgent ? 'var(--danger)' : running ? 'var(--accent)' : 'var(--border-hi)'}
              strokeWidth="5"
              strokeDasharray={`${dash} ${C}`}
              strokeLinecap="round"
              transform="rotate(-90 48 48)"
              style={{ transition: 'stroke-dasharray 1s linear, stroke .3s' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 22,
              color: urgent ? 'var(--danger)' : running ? 'var(--accent)' : 'var(--white)',
              lineHeight: 1, transition: 'color .3s',
            }}>
              {mins}:{String(secs).padStart(2, '0')}
            </div>
            {running && <div style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: 1.5, marginTop: 2 }}>REST</div>}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 5, marginBottom: 10 }}>
        {REST_PRESETS.map(p => (
          <button
            key={p.label}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 9, padding: '5px 0', background: duration === p.s && !running ? 'var(--accent-dim)' : undefined }}
            onClick={() => startTimer(p.s)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {running ? (
          <>
            <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}
              onClick={() => { clearInterval(ref.current); setRunning(false) }}>
              PAUSE
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setRemaining(r => Math.min((r ?? 0) + 30, 600))} style={{ padding: '5px 10px' }}>+30s</button>
            <button className="btn btn-ghost btn-sm" onClick={stopTimer} style={{ padding: '5px 10px' }}>SKIP</button>
          </>
        ) : remaining != null && remaining > 0 ? (
          <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => setRunning(true)}>RESUME</button>
        ) : (
          <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => startTimer()}>START</button>
        )}
      </div>

      {running && (
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 10, color: 'var(--muted)' }}>
          Auto-started after last set
        </div>
      )}
    </div>
  )
}

// ─── set row ──────────────────────────────────────────────────────────────────

function SetRow({ num, exerciseId, clientId, initial, prevLog, onCompleted }) {
  const [weight, setWeight] = useState(initial?.weight_kg ?? '')
  const [reps,   setReps]   = useState(initial?.reps ?? '')
  const [rpe,    setRpe]    = useState(initial?.rpe ?? '')
  const [done,   setDone]   = useState(initial?.is_completed ?? false)
  const [saving, setSaving] = useState(false)
  const [flash,  setFlash]  = useState(false)

  // Previous week ghost targets
  const prevWeight = prevLog?.weight_kg ?? null
  const beatPrev   = prevWeight && weight && parseFloat(weight) >= parseFloat(prevWeight)

  const estimated1RM = weight && reps && parseInt(reps) > 0 && parseInt(reps) <= 12
    ? Math.round(epley(parseFloat(weight), parseInt(reps)))
    : null

  async function handleTick() {
    if (!weight || !reps || done) return
    setSaving(true)
    await upsertSetLog({
      exercise_id: exerciseId,
      client_id: clientId,
      set_number: num,
      weight_kg: parseFloat(weight),
      reps: parseInt(reps),
      rpe: rpe ? parseFloat(rpe) : null,
      is_completed: true,
      logged_at: new Date().toISOString(),
    })
    setSaving(false)
    setDone(true)
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
    onCompleted?.()
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '28px 1fr 1fr 68px 36px',
      gap: 6,
      alignItems: 'center',
      padding: '7px 0',
      borderBottom: '1px solid var(--border)',
      opacity: done ? 0.45 : 1,
      transition: 'opacity .4s, background .3s',
      background: flash ? 'rgba(0,200,150,.08)' : 'transparent',
      borderRadius: flash ? 6 : 0,
    }}>
      {/* Set number */}
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 12,
        color: done ? 'var(--accent)' : 'var(--muted)',
        textAlign: 'center', transition: 'color .3s',
      }}>
        {done ? '✓' : num}
      </div>

      {/* Weight */}
      <div style={{ position: 'relative' }}>
        {prevWeight && !weight && !done && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
            paddingLeft: 10, pointerEvents: 'none', zIndex: 1,
          }}>
            <span style={{ fontSize: 13, color: 'rgba(94,94,112,0.6)' }}>{prevWeight}</span>
          </div>
        )}
        <input
          className="input input-sm"
          type="number" inputMode="decimal" step="0.5"
          placeholder={prevWeight ? '' : 'kg'}
          value={weight}
          onChange={e => setWeight(e.target.value)}
          disabled={done}
          style={{
            paddingRight: 24,
            borderColor: beatPrev ? 'rgba(0,200,150,.5)' : undefined,
            background: beatPrev ? 'rgba(0,200,150,.06)' : undefined,
          }}
        />
        <span style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', fontSize: 9, color: 'var(--muted)', pointerEvents: 'none' }}>kg</span>
      </div>

      {/* Reps */}
      <div style={{ position: 'relative' }}>
        <input
          className="input input-sm"
          type="number" inputMode="numeric"
          placeholder="reps"
          value={reps}
          onChange={e => setReps(e.target.value)}
          disabled={done}
        />
        {estimated1RM && !done && (
          <div style={{
            position: 'absolute', top: -15, left: 0,
            fontSize: 9, color: 'var(--accent)',
            fontFamily: 'var(--font-display)', letterSpacing: 0.5, whiteSpace: 'nowrap',
          }}>~{estimated1RM}kg 1RM</div>
        )}
      </div>

      {/* RPE */}
      <select
        className="select input-sm"
        value={rpe}
        onChange={e => setRpe(e.target.value)}
        disabled={done}
        style={{ fontSize: 11, padding: '7px 4px' }}
      >
        <option value="">RPE</option>
        {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map(v => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>

      {/* Tick */}
      <button
        onClick={handleTick}
        disabled={done || saving || !weight || !reps}
        style={{
          width: 36, height: 36, borderRadius: 8,
          background: done
            ? 'linear-gradient(135deg, var(--accent), var(--accent-hi))'
            : 'var(--s4)',
          border: `1.5px solid ${done ? 'var(--accent)' : 'var(--border-hi)'}`,
          color: done ? 'var(--ink)' : (!weight || !reps) ? 'var(--muted)' : 'var(--white)',
          fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: done ? 'default' : 'pointer',
          transition: 'all .2s',
          boxShadow: done ? '0 0 10px rgba(0,200,150,.35)' : 'none',
        }}
      >
        {saving ? (
          <div style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,.3)', borderTopColor: 'var(--ink)', borderRadius: '50%', animation: 'spin .6s linear infinite' }} />
        ) : '✓'}
      </button>
    </div>
  )
}

// ─── exercise card ────────────────────────────────────────────────────────────

function ExerciseCard({ exercise, clientId, pairingColor, pairingLabel, onSetCompleted, onVideoOpen, prevLogs = {} }) {
  const { id, name, set_count, rep_scheme, tempo, set_type, coach_note, video_url, set_logs = [] } = exercise
  const typeInfo = SET_TYPES[set_type] || SET_TYPES.standard
  const completedCount = set_logs.filter(s => s.is_completed).length
  const [localCompleted, setLocalCompleted] = useState(completedCount)
  const pct = Math.round((localCompleted / set_count) * 100)
  const [restSecs, setRestSecs] = useState(null)
  const restRef = useRef(null)

  function startRest(seconds) {
    if (restRef.current) clearInterval(restRef.current)
    setRestSecs(seconds)
    restRef.current = setInterval(() => {
      setRestSecs(prev => {
        if (prev <= 1) { clearInterval(restRef.current); return null }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => () => { if (restRef.current) clearInterval(restRef.current) }, [])

  // Resolve video ID: library entry takes precedence, fall back to Supabase video_url (full URL)
  const libEntry = EXERCISE_BY_NAME.get(name)
  const videoId = (() => {
    if (libEntry?.videoUrl) return libEntry.videoUrl
    if (video_url) {
      try {
        const u = new URL(video_url)
        if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
        if (u.hostname.includes('youtu.be')) return u.pathname.slice(1).split('?')[0]
      } catch {}
    }
    return null
  })()

  function handleSetDone() {
    setLocalCompleted(p => Math.min(p + 1, set_count))
    onSetCompleted?.()
    // Auto-start rest timer using exercise rest_seconds or default 60s
    const secs = exercise.rest_seconds || 60
    startRest(secs)
  }

  return (
    <div
      className="card"
      style={{
        marginBottom: 14,
        borderLeft: `3px solid ${pairingColor || 'var(--s5)'}`,
        padding: '16px 18px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            {pairingLabel && (
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1.5,
                color: pairingColor, background: `${pairingColor}18`,
                border: `1px solid ${pairingColor}44`,
                borderRadius: 4, padding: '2px 7px',
              }}>
                {pairingLabel}
              </span>
            )}
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: 1, color: 'var(--white)' }}>
              {name}
            </span>
            <span className={`tag ${typeInfo.cls}`}>{typeInfo.label}</span>

            {/* Video button */}
            {videoId && (
              <button
                onClick={() => onVideoOpen?.({ name, videoId })}
                title="Watch demo"
                style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--accent)',
                  border: 'none',
                  color: 'var(--ink)',
                  fontSize: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 0 8px rgba(0,200,150,.4)',
                  transition: 'opacity .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >▶</button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
              {set_count} sets × {rep_scheme || '—'}
            </span>
            {tempo && (
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                <span style={{ fontFamily: 'var(--font-display)', letterSpacing: 1, color: 'var(--sub)' }}>TEMPO</span> {tempo}
              </span>
            )}
          </div>
        </div>

        {/* Completion badge */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 18,
            color: localCompleted === set_count ? 'var(--accent)' : 'var(--white)',
            lineHeight: 1, transition: 'color .3s',
          }}>
            {localCompleted}/{set_count}
          </div>
          <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>SETS</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'var(--s5)', borderRadius: 1, marginBottom: 12 }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: localCompleted === set_count
            ? 'linear-gradient(90deg, var(--accent), var(--accent-hi))'
            : `${pairingColor || 'var(--accent)'}`,
          borderRadius: 1, transition: 'width .4s ease',
          boxShadow: pct > 0 ? `0 0 6px ${pairingColor || 'var(--accent)'}66` : 'none',
        }} />
      </div>

      {/* Coach note */}
      {coach_note && (
        <div className="coach-note" style={{ marginBottom: 12 }}>{coach_note}</div>
      )}

      {/* Previous week summary */}
      {Object.keys(prevLogs).length > 0 && (() => {
        const logs = Object.values(prevLogs).filter(l => l.weight_kg)
        if (!logs.length) return null
        const maxWeight = Math.max(...logs.map(l => l.weight_kg))
        const topSet = logs.find(l => l.weight_kg === maxWeight)
        return (
          <div style={{
            fontSize: 11, color: 'var(--muted)', marginBottom: 10,
            padding: '5px 10px', background: 'var(--s3)', borderRadius: 6,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ color: 'rgba(94,94,112,0.7)' }}>↑ Last week:</span>
            <span style={{ color: 'var(--sub)' }}>{maxWeight}kg × {topSet?.reps || '—'} reps (top set)</span>
          </div>
        )
      })()}

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 1fr 68px 36px', gap: 6, marginBottom: 6 }}>
        {['#', 'Weight', 'Reps', 'RPE', ''].map((h, i) => (
          <div key={i} className="label" style={{ fontSize: 8 }}>{h}</div>
        ))}
      </div>

      {/* Set rows */}
      {Array.from({ length: set_count }, (_, i) => i + 1).map(n => {
        const initial = set_logs.find(s => s.set_number === n)
        const prevLog = prevLogs[n] || null
        return (
          <SetRow
            key={n}
            num={n}
            exerciseId={id}
            clientId={clientId}
            initial={initial}
            prevLog={prevLog}
            setType={set_type}
            onCompleted={handleSetDone}
          />
        )
      })}

      {/* Inline rest timer — appears after a set is ticked */}
      {restSecs !== null && (
        <div style={{
          marginTop: 10, padding: '10px 14px',
          background: 'rgba(0,200,150,.06)',
          border: '1px solid rgba(0,200,150,.2)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>⏱</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: restSecs <= 10 ? 'var(--danger)' : 'var(--accent)', lineHeight: 1 }}>
                {Math.floor(restSecs / 60)}:{String(restSecs % 60).padStart(2, '0')}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>Rest — next set ready</div>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 11 }}
            onClick={() => { clearInterval(restRef.current); setRestSecs(null) }}
          >
            SKIP
          </button>
        </div>
      )}
      {restSecs === null && localCompleted > 0 && localCompleted < set_count && (
        <div style={{ marginTop: 8, textAlign: 'right' }}>
          <button
            className="btn btn-ghost btn-sm"
            style={{ fontSize: 10 }}
            onClick={() => startRest(exercise.rest_seconds || 60)}
          >
            ⏱ Restart rest timer
          </button>
        </div>
      )}
    </div>
  )
}

// ─── superset group ───────────────────────────────────────────────────────────

function PairingGroup({ pairing, exercises, clientId, colorIndex, onSetCompleted, onVideoOpen, prevWeightMap = {} }) {
  const color = PAIRING_COLORS[colorIndex % PAIRING_COLORS.length]
  const isSuperset = exercises.length > 1

  if (!isSuperset) {
    const ex = exercises[0]
    return (
      <ExerciseCard
        exercise={ex}
        clientId={clientId}
        pairingColor={color}
        pairingLabel={pairing !== 'solo' ? `${pairing}` : null}
        onSetCompleted={onSetCompleted}
        onVideoOpen={onVideoOpen}
        prevLogs={prevWeightMap[ex.name] || {}}
      />
    )
  }

  return (
    <div style={{
      borderLeft: `2px solid ${color}44`,
      paddingLeft: 12, marginBottom: 6, position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingLeft: 4 }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 2,
          color, background: `${color}18`, border: `1px solid ${color}33`,
          borderRadius: 4, padding: '3px 8px',
        }}>
          SUPERSET
        </span>
        <div style={{ flex: 1, height: 1, background: `${color}22` }} />
        <span style={{ fontSize: 10, color: 'var(--muted)' }}>
          Alternate exercises with minimal rest
        </span>
      </div>
      {exercises.map((ex, i) => (
        <ExerciseCard
          key={ex.id}
          exercise={ex}
          clientId={clientId}
          pairingColor={color}
          pairingLabel={`${pairing}${i + 1}`}
          onSetCompleted={onSetCompleted}
          onVideoOpen={onVideoOpen}
          prevLogs={prevWeightMap[ex.name] || {}}
        />
      ))}
    </div>
  )
}

// ─── session complete screen ──────────────────────────────────────────────────

function SessionComplete({ session, totalSets, condResult }) {
  // Build the result stats to display based on session type
  const stats = (() => {
    if (!condResult) {
      return [
        { label: 'Exercises', value: session?.exercises?.length || 0 },
        { label: 'Sets Done', value: totalSets },
      ]
    }
    switch (condResult.type) {
      case 'emom':
        return [
          { label: 'Intervals', value: `${condResult.intervals_completed}/${condResult.total_intervals}` },
          { label: 'Completion', value: `${Math.round((condResult.intervals_completed / (condResult.total_intervals || 1)) * 100)}%` },
        ]
      case 'amrap':
        return [
          { label: 'Rounds', value: condResult.rounds },
          ...(condResult.partial_reps > 0 ? [{ label: '+ Reps', value: condResult.partial_reps }] : []),
        ]
      case 'for_time':
        return [
          { label: 'Finish Time', value: condResult.finish_time, wide: true },
        ]
      case 'hyrox':
        return [
          { label: 'Total Time', value: condResult.total_time },
          { label: 'Stations', value: condResult.stations_completed },
        ]
      case 'mixed':
        return [
          { label: 'Total Time', value: condResult.total_time, wide: true },
        ]
      default:
        return [
          { label: 'Sets Done', value: totalSets },
        ]
    }
  })()

  // Accent colour per type
  const typeColor = {
    emom: 'var(--purple)',
    amrap: 'var(--info)',
    for_time: 'var(--warn)',
    hyrox: '#f472b6',
    mixed: 'var(--danger)',
  }[condResult?.type] || 'var(--accent)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 24, textAlign: 'center' }}>
      {/* Ring */}
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--s4)" strokeWidth="6" />
          <circle
            cx="60" cy="60" r="52" fill="none"
            stroke={typeColor} strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 52}`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ filter: `drop-shadow(0 0 10px ${typeColor})` }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
          {condResult?.type === 'hyrox' ? '🏃' : condResult?.type === 'for_time' ? '⏱️' : '✓'}
        </div>
      </div>

      {/* Title */}
      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: 3,
          background: `linear-gradient(90deg, var(--white), ${typeColor})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: 6,
        }}>
          SESSION COMPLETE
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          {session?.day_label} · Week {session?.week_number}
          {condResult && (
            <span style={{
              marginLeft: 8, fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5,
              color: typeColor, background: `${typeColor}18`,
              border: `1px solid ${typeColor}44`,
              borderRadius: 4, padding: '2px 7px',
            }}>
              {{
                emom: 'EMOM', amrap: 'AMRAP', for_time: 'FOR TIME', hyrox: 'HYROX', mixed: 'MIXED MODAL',
              }[condResult.type] || condResult.type.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card" style={{ minWidth: s.wide ? 180 : 100, textAlign: 'center' }}>
            <div className="stat-value" style={{ fontSize: s.wide ? 32 : 28, color: typeColor, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div className="label" style={{ textAlign: 'center', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Personal best nudge for For Time */}
      {condResult?.type === 'for_time' && (
        <div style={{
          padding: '10px 20px', borderRadius: 8,
          background: 'rgba(255,173,0,.08)', border: '1px solid rgba(255,173,0,.2)',
          fontSize: 12, color: 'var(--warn)', maxWidth: 280, lineHeight: 1.6,
        }}>
          ⏱️ Note your finish time — compare it next cycle to track your conditioning progress.
        </div>
      )}

      {/* HYROX time guide */}
      {condResult?.type === 'hyrox' && (
        <div style={{
          padding: '10px 20px', borderRadius: 8,
          background: 'rgba(244,114,182,.08)', border: '1px solid rgba(244,114,182,.2)',
          fontSize: 12, color: '#f472b6', maxWidth: 300, lineHeight: 1.6,
        }}>
          🏆 Elite men sub 60 min · Sub 75 min is a solid target · Sub 90 min puts you in the top 25%
        </div>
      )}

      <div style={{ fontSize: 12, color: 'var(--muted)', maxWidth: 300, lineHeight: 1.7 }}>
        Log how you felt in your weekly check-in and keep the recovery consistent tonight.
      </div>
    </div>
  )
}

// ─── no program state ─────────────────────────────────────────────────────────

function NoProgram() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, textAlign: 'center' }}>
      <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--s3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
        🏋️
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 2, color: 'var(--white)' }}>
        No Programme Yet
      </div>
      <div style={{ fontSize: 13, color: 'var(--muted)', maxWidth: 280, lineHeight: 1.7 }}>
        Your coach hasn't assigned a programme yet. It'll appear here once they do.
      </div>
    </div>
  )
}

// ─── session type metadata ────────────────────────────────────────────────────

const SESSION_TYPE_META = {
  strength:  { label: 'Strength',    icon: '💪', color: 'var(--accent)' },
  emom:      { label: 'EMOM',         icon: '⏱️', color: 'var(--purple)' },
  amrap:     { label: 'AMRAP',        icon: '🔄', color: 'var(--info)' },
  for_time:  { label: 'For Time',     icon: '⏩', color: 'var(--warn)' },
  hyrox:     { label: 'HYROX',        icon: '🏃', color: '#f472b6' },
  mixed:     { label: 'Mixed Modal',  icon: '🔀', color: 'var(--danger)' },
}

// ─── conditioning timer ───────────────────────────────────────────────────────

function useTimer(mode = 'stopwatch') {
  // mode: 'stopwatch' | 'countdown'
  const [elapsed, setElapsed]   = useState(0)  // seconds elapsed (stopwatch)
  const [remaining, setRemaining] = useState(0) // seconds left (countdown)
  const [running, setRunning]   = useState(false)
  const [duration, setDuration] = useState(0)   // countdown total
  const ref = useRef(null)

  const start = useCallback((secs) => {
    clearInterval(ref.current)
    if (mode === 'countdown') {
      const d = secs ?? duration
      setDuration(d)
      setRemaining(d)
    } else {
      setElapsed(0)
    }
    setRunning(true)
  }, [mode, duration])

  const pause  = () => { clearInterval(ref.current); setRunning(false) }
  const resume = () => setRunning(true)
  const reset  = () => { clearInterval(ref.current); setRunning(false); setElapsed(0); setRemaining(duration) }

  useEffect(() => {
    if (!running) return
    ref.current = setInterval(() => {
      if (mode === 'stopwatch') {
        setElapsed(e => e + 1)
      } else {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(ref.current)
            setRunning(false)
            try {
              const ctx = new (window.AudioContext || window.webkitAudioContext)()
              const osc = ctx.createOscillator(); const gain = ctx.createGain()
              osc.connect(gain); gain.connect(ctx.destination)
              osc.frequency.value = 880; gain.gain.setValueAtTime(0.4, ctx.currentTime)
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
              osc.start(); osc.stop(ctx.currentTime + 0.6)
            } catch {}
            return 0
          }
          return r - 1
        })
      }
    }, 1000)
    return () => clearInterval(ref.current)
  }, [running, mode])

  const display = mode === 'stopwatch' ? elapsed : remaining
  const mins = Math.floor(display / 60)
  const secs = display % 60
  const formatted = `${mins}:${String(secs).padStart(2, '0')}`

  return { elapsed, remaining, running, start, pause, resume, reset, setDuration, formatted, pct: duration > 0 ? (remaining / duration) * 100 : 0 }
}

function TimerFace({ formatted, running, urgent, size = 72, color = 'var(--accent)', pct = 100 }) {
  const r = size * 0.44; const C = 2 * Math.PI * r
  return (
    <div style={{ position: 'relative', width: size * 2, height: size * 2, flexShrink: 0 }}>
      <svg width={size * 2} height={size * 2} viewBox={`0 0 ${size * 2} ${size * 2}`}>
        <circle cx={size} cy={size} r={r} fill="none" stroke="var(--s5)" strokeWidth="5" />
        <circle cx={size} cy={size} r={r} fill="none"
          stroke={urgent ? 'var(--danger)' : running ? color : 'var(--border-hi)'}
          strokeWidth="5"
          strokeDasharray={`${(pct / 100) * C} ${C}`}
          strokeLinecap="round" transform={`rotate(-90 ${size} ${size})`}
          style={{ transition: 'stroke-dasharray 1s linear, stroke .3s' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: size * 0.3,
          color: urgent ? 'var(--danger)' : running ? color : 'var(--white)',
          lineHeight: 1, transition: 'color .3s',
        }}>{formatted}</div>
        {running && <div style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: 1.5, marginTop: 2 }}>
          {pct > 0 ? 'REMAINING' : 'ELAPSED'}
        </div>}
      </div>
    </div>
  )
}

// ─── EMOM view ────────────────────────────────────────────────────────────────

function EMOMView({ session, clientId, onFinish }) {
  const cfg = session.conditioning_config || {}
  const stations = cfg.stations || []
  const intervalSecs = (cfg.interval_mins || 1) * 60
  const totalSecs = (cfg.duration_mins || 20) * 60
  const [currentStation, setCurrentStation] = useState(0)
  const [intervalCount, setIntervalCount] = useState(0)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const timer = useTimer('countdown')

  const stationIdx = stations.length > 0 ? intervalCount % stations.length : 0
  const currentWork = stations[stationIdx]
  const totalIntervals = Math.floor(totalSecs / intervalSecs)
  const color = 'var(--purple)'

  function startInterval() {
    timer.start(intervalSecs)
  }

  // When interval ends, advance
  useEffect(() => {
    if (timer.remaining === 0 && !timer.running && intervalCount > 0) {
      // beep already happened in timer
    }
  }, [timer.remaining, timer.running])

  function nextInterval() {
    setIntervalCount(p => p + 1)
    if (intervalCount < totalIntervals - 1) {
      timer.start(intervalSecs)
    }
  }

  async function handleFinish() {
    setSaving(true)
    await upsertConditioningLog({ session_id: session.id, client_id: clientId, result: { intervals_completed: intervalCount, total_intervals: totalIntervals }, notes })
    await completeSession(session.id)
    setSaving(false)
    onFinish({ type: 'emom', intervals_completed: intervalCount, total_intervals: totalIntervals })
  }

  const progressPct = totalIntervals > 0 ? Math.round((intervalCount / totalIntervals) * 100) : 0

  return (
    <div>
      {/* Header bar */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: 20, borderLeft: `3px solid ${color}` }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div className="label" style={{ color }}>EMOM — {cfg.duration_mins} MINS</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)', letterSpacing: 1 }}>
              {cfg.interval_mins > 1 ? `E${cfg.interval_mins}MOM` : 'Every Minute On The Minute'}
            </div>
          </div>
          <div style={{ height: 32, width: 1, background: 'var(--border)' }} />
          <div style={{ display: 'flex', gap: 20 }}>
            <div><div className="label">Interval</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color }}>{intervalCount}</div></div>
            <div><div className="label">Total</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--sub)' }}>{totalIntervals}</div></div>
            <div><div className="label">Stations</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--sub)' }}>{stations.length}</div></div>
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost btn-sm" onClick={handleFinish} disabled={saving} style={{ borderColor: color, color }}>
            {saving ? '…' : 'Finish EMOM'}
          </button>
        </div>
        <div style={{ height: 3, background: 'var(--s5)', borderRadius: 2, marginTop: 12 }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: `linear-gradient(90deg, ${color}, #a78bfa)`, borderRadius: 2, transition: 'width .4s', boxShadow: `0 0 8px ${color}55` }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 20, alignItems: 'start' }}>
        <div>
          {/* Station cards */}
          {stations.map((s, idx) => {
            const isCurrent = idx === stationIdx && timer.running
            const isDone = intervalCount > 0 && idx === (intervalCount - 1) % stations.length && !timer.running
            return (
              <div key={s.id} className="card" style={{
                padding: '16px 18px', marginBottom: 10,
                borderLeft: `3px solid ${isCurrent ? color : 'var(--s5)'}`,
                background: isCurrent ? `${color}08` : undefined,
                transition: 'all .3s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1.5, color: isCurrent ? color : 'var(--muted)', background: `${color}15`, border: `1px solid ${color}33`, borderRadius: 4, padding: '2px 8px' }}>
                    {s.label || `Station ${idx + 1}`}
                  </span>
                  {isCurrent && <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 2, color, animation: 'pulse 1s infinite' }}>ACTIVE</span>}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)', letterSpacing: 1, marginBottom: 4 }}>
                  {s.movement || '—'}
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {s.target && <span style={{ fontSize: 12, color: isCurrent ? color : 'var(--muted)' }}>{s.target}</span>}
                  {s.note && <span style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>{s.note}</span>}
                </div>
              </div>
            )
          })}

          {/* Coach note */}
          {cfg.coach_note && (
            <div className="coach-note" style={{ marginBottom: 16 }}>{cfg.coach_note}</div>
          )}

          {/* Notes field */}
          <div className="card" style={{ padding: '14px 16px' }}>
            <div className="label" style={{ marginBottom: 8 }}>Session Notes</div>
            <textarea className="input" rows={3} placeholder="How did it feel? Any scaling? Rounds completed per station…"
              style={{ resize: 'vertical' }} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        {/* Timer sidebar */}
        <div style={{ position: 'sticky', top: 20 }}>
          <div className="card" style={{ padding: '18px 16px', textAlign: 'center', marginBottom: 12 }}>
            <div className="label" style={{ marginBottom: 12, color }}>INTERVAL TIMER</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <TimerFace formatted={timer.formatted} running={timer.running}
                urgent={timer.running && timer.remaining <= 5}
                color={color} pct={timer.pct} />
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {!timer.running ? (
                <button className="btn btn-primary btn-sm" style={{ flex: 1, background: color, borderColor: color }}
                  onClick={startInterval}>
                  {intervalCount === 0 ? `START INTERVAL 1` : `INTERVAL ${intervalCount + 1}`}
                </button>
              ) : (
                <>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={timer.pause}>PAUSE</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { timer.pause(); nextInterval() }} style={{ color, borderColor: color }}>SKIP →</button>
                </>
              )}
            </div>
            {!timer.running && intervalCount > 0 && (
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 8 }} onClick={nextInterval}>
                ✓ Done — Next Interval
              </button>
            )}
          </div>

          {/* Station rotation */}
          {stations.length > 0 && (
            <div className="card" style={{ padding: '12px 14px' }}>
              <div className="label" style={{ marginBottom: 8, color }}>ROTATION</div>
              {stations.map((s, idx) => (
                <div key={s.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                    background: idx === stationIdx && timer.running ? color : 'var(--s4)',
                    border: `1px solid ${idx === stationIdx ? color : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: 9, color: idx === stationIdx && timer.running ? 'var(--ink)' : 'var(--muted)',
                  }}>{idx + 1}</div>
                  <span style={{ fontSize: 11, color: idx === stationIdx && timer.running ? 'var(--white)' : 'var(--muted)', lineHeight: 1.3 }}>
                    {s.movement || '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── AMRAP view ───────────────────────────────────────────────────────────────

function AMRAPView({ session, clientId, onFinish }) {
  const cfg = session.conditioning_config || {}
  const movements = cfg.movements || []
  const timeCap = (cfg.time_cap_mins || 15) * 60
  const [rounds, setRounds] = useState(0)
  const [partialReps, setPartialReps] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const timer = useTimer('countdown')
  const color = 'var(--info)'

  async function handleFinish() {
    setSaving(true)
    await upsertConditioningLog({ session_id: session.id, client_id: clientId, result: { rounds, partial_reps: partialReps, time_cap_mins: cfg.time_cap_mins }, notes })
    await completeSession(session.id)
    setSaving(false)
    onFinish({ type: 'amrap', rounds, partial_reps: partialReps })
  }

  return (
    <div>
      <div className="card" style={{ padding: '14px 18px', marginBottom: 20, borderLeft: `3px solid ${color}` }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div className="label" style={{ color }}>AMRAP</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)', letterSpacing: 1 }}>
              {cfg.time_cap_mins} Minutes — As Many Rounds As Possible
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost btn-sm" onClick={handleFinish} disabled={saving || timer.running} style={{ borderColor: color, color }}>
            {saving ? '…' : 'Log & Finish'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 20, alignItems: 'start' }}>
        <div>
          {/* Movement list */}
          {movements.map((m, idx) => (
            <div key={m.id} className="card" style={{ padding: '14px 18px', marginBottom: 10, borderLeft: `3px solid ${color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color, minWidth: 28 }}>{idx + 1}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)', letterSpacing: 1 }}>{m.name || '—'}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
                    {m.reps && <span style={{ fontSize: 12, color }}>{m.reps} {m.unit || 'reps'}</span>}
                    {m.load && <span style={{ fontSize: 12, color: 'var(--muted)' }}>{m.load}</span>}
                    {m.note && <span style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>{m.note}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {cfg.coach_note && <div className="coach-note" style={{ marginBottom: 14 }}>{cfg.coach_note}</div>}

          {/* Log result */}
          <div className="card" style={{ padding: '16px 18px' }}>
            <div className="label" style={{ marginBottom: 12 }}>Log Your Result</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div className="input-group">
                <label className="form-label">Rounds Completed</label>
                <input className="input" type="number" min="0" placeholder="e.g. 8" value={rounds}
                  onChange={e => setRounds(+e.target.value)} />
              </div>
              <div className="input-group">
                <label className="form-label">+ Partial Reps</label>
                <input className="input" placeholder="e.g. 10 thrusters" value={partialReps}
                  onChange={e => setPartialReps(e.target.value)} />
              </div>
            </div>
            <textarea className="input" rows={2} placeholder="How did it feel? Any scaling?" style={{ resize: 'vertical' }}
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        {/* Timer sidebar */}
        <div style={{ position: 'sticky', top: 20 }}>
          <div className="card" style={{ padding: '18px 16px', textAlign: 'center' }}>
            <div className="label" style={{ marginBottom: 12, color }}>COUNTDOWN</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <TimerFace formatted={timer.formatted} running={timer.running}
                urgent={timer.running && timer.remaining <= 30} color={color}
                pct={timer.pct || (timer.remaining > 0 ? (timer.remaining / timeCap) * 100 : 100)} />
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {!timer.running && timer.remaining === 0 ? (
                <button className="btn btn-primary btn-sm" style={{ flex: 1, background: color, borderColor: color }}
                  onClick={() => timer.start(timeCap)}>
                  START {cfg.time_cap_mins}-MIN AMRAP
                </button>
              ) : timer.running ? (
                <>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={timer.pause}>PAUSE</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setRounds(r => r + 1)} style={{ color: color, borderColor: color }}>+1 ROUND</button>
                </>
              ) : (
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={timer.resume}>RESUME</button>
              )}
            </div>
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center', gap: 20 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color, lineHeight: 1 }}>{rounds}</div>
                <div className="label" style={{ fontSize: 8 }}>ROUNDS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── For Time view ────────────────────────────────────────────────────────────

function ForTimeView({ session, clientId, onFinish }) {
  const cfg = session.conditioning_config || {}
  const movements = cfg.movements || []
  const [finishTime, setFinishTime] = useState('')
  const [roundsDone, setRoundsDone] = useState(0)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const timer = useTimer('stopwatch')
  const color = 'var(--warn)'

  function stopAndLog() {
    timer.pause()
    setFinishTime(timer.formatted)
  }

  async function handleFinish() {
    setSaving(true)
    await upsertConditioningLog({ session_id: session.id, client_id: clientId,
      result: { finish_time: finishTime || timer.formatted, rounds_completed: roundsDone, format: cfg.format, total_rounds: cfg.rounds },
      notes })
    await completeSession(session.id)
    setSaving(false)
    onFinish({ type: 'for_time', finish_time: finishTime || timer.formatted })
  }

  const headerText = cfg.format === 'chipper' ? 'Chipper — For Time'
    : cfg.format === '21_15_9' ? '21-15-9 For Time'
    : `${cfg.rounds || '?'} Rounds For Time`

  return (
    <div>
      <div className="card" style={{ padding: '14px 18px', marginBottom: 20, borderLeft: `3px solid ${color}` }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div className="label" style={{ color }}>FOR TIME</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)', letterSpacing: 1 }}>{headerText}</div>
          </div>
          {cfg.time_cap_mins && <span style={{ fontSize: 12, color: 'var(--muted)' }}>Time cap: {cfg.time_cap_mins} min</span>}
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost btn-sm" onClick={handleFinish} disabled={saving} style={{ borderColor: color, color }}>
            {saving ? '…' : 'Log & Finish'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 20, alignItems: 'start' }}>
        <div>
          {movements.map((m, idx) => (
            <div key={m.id} className="card" style={{ padding: '14px 18px', marginBottom: 10, borderLeft: `3px solid ${color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color, minWidth: 32, textAlign: 'center' }}>
                  {cfg.format === '21_15_9' ? ['21', '15', '9'][idx] ?? (idx + 1) : (idx + 1)}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)', letterSpacing: 1 }}>{m.name || '—'}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
                    {m.reps && <span style={{ fontSize: 12, color }}>{m.reps} {m.unit || 'reps'}</span>}
                    {m.load && <span style={{ fontSize: 12, color: 'var(--muted)' }}>{m.load}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {cfg.coach_note && <div className="coach-note" style={{ marginBottom: 14 }}>{cfg.coach_note}</div>}

          <div className="card" style={{ padding: '16px 18px' }}>
            <div className="label" style={{ marginBottom: 12 }}>Log Your Result</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div className="input-group">
                <label className="form-label">Finish Time</label>
                <input className="input" placeholder="e.g. 12:34" value={finishTime}
                  onChange={e => setFinishTime(e.target.value)} />
              </div>
              {cfg.format === 'rounds' && cfg.rounds > 1 && (
                <div className="input-group">
                  <label className="form-label">Rounds Completed</label>
                  <input className="input" type="number" min="0" max={cfg.rounds} value={roundsDone}
                    onChange={e => setRoundsDone(+e.target.value)} />
                </div>
              )}
            </div>
            <textarea className="input" rows={2} placeholder="Any scaling? How did the pace feel?" style={{ resize: 'vertical' }}
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        <div style={{ position: 'sticky', top: 20 }}>
          <div className="card" style={{ padding: '18px 16px', textAlign: 'center' }}>
            <div className="label" style={{ marginBottom: 12, color }}>STOPWATCH</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <TimerFace formatted={timer.formatted} running={timer.running} color={color} pct={100} />
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {!timer.running && timer.elapsed === 0 ? (
                <button className="btn btn-primary btn-sm" style={{ flex: 1, background: color, borderColor: color }} onClick={() => timer.start()}>START</button>
              ) : timer.running ? (
                <>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={timer.pause}>PAUSE</button>
                  <button className="btn btn-primary btn-sm" onClick={stopAndLog} style={{ background: color, borderColor: color }}>FINISH</button>
                </>
              ) : (
                <>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={timer.resume}>RESUME</button>
                  <button className="btn btn-ghost btn-sm" onClick={timer.reset}>RESET</button>
                </>
              )}
            </div>
            {finishTime && (
              <div style={{ marginTop: 12, padding: '8px 12px', background: `${color}12`, border: `1px solid ${color}33`, borderRadius: 6 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color, lineHeight: 1 }}>{finishTime}</div>
                <div className="label" style={{ fontSize: 8 }}>FINISH TIME</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── HYROX view ───────────────────────────────────────────────────────────────

function HYROXView({ session, clientId, onFinish }) {
  const cfg = session.conditioning_config || {}
  const stations = cfg.stations || []
  const color = '#f472b6'
  const [splits, setSplits] = useState(() => Object.fromEntries(stations.map(s => [s.id, { run: '', station: '' }])))
  const [currentIdx, setCurrentIdx] = useState(0)
  const [phase, setPhase] = useState('run') // 'run' | 'station'
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const timer = useTimer('stopwatch')

  function logSplit(stationId, field, val) {
    setSplits(p => ({ ...p, [stationId]: { ...p[stationId], [field]: val } }))
  }

  function advance() {
    if (phase === 'run') {
      setPhase('station')
    } else {
      setPhase('run')
      setCurrentIdx(p => Math.min(p + 1, stations.length - 1))
    }
  }

  const totalStations = stations.length
  const completed = Object.values(splits).filter(s => s.station).length

  async function handleFinish() {
    setSaving(true)
    const result = { format: cfg.format, splits, total_time: timer.formatted, target_finish_mins: cfg.target_finish_mins }
    await upsertConditioningLog({ session_id: session.id, client_id: clientId, result, notes })
    await completeSession(session.id)
    setSaving(false)
    onFinish({ type: 'hyrox', total_time: timer.formatted, stations_completed: completed })
  }

  return (
    <div>
      <div className="card" style={{ padding: '14px 18px', marginBottom: 20, borderLeft: `3px solid ${color}` }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div className="label" style={{ color }}>HYROX SIMULATION</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)', letterSpacing: 1 }}>
              {totalStations} Stations · Target: {cfg.target_finish_mins} min
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div><div className="label">Run</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color }}>{cfg.run_distance_m}m</div></div>
            <div><div className="label">Done</div><div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--accent)' }}>{completed}/{totalStations}</div></div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            {!timer.running ? (
              <button className="btn btn-primary btn-sm" style={{ background: color, borderColor: color }} onClick={() => timer.start()}>START RACE</button>
            ) : (
              <button className="btn btn-ghost btn-sm" onClick={timer.pause}>PAUSE</button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={handleFinish} disabled={saving} style={{ borderColor: color, color }}>
              {saving ? '…' : 'Finish'}
            </button>
          </div>
        </div>
        {/* Elapsed */}
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: timer.running ? color : 'var(--muted)', lineHeight: 1 }}>{timer.formatted}</div>
          <div style={{ flex: 1, height: 4, background: 'var(--s5)', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${Math.min((completed / totalStations) * 100, 100)}%`, background: `linear-gradient(90deg, ${color}, #fb7185)`, borderRadius: 2, transition: 'width .4s' }} />
          </div>
          {cfg.target_finish_mins && (
            <div style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
              Target: {cfg.target_finish_mins} min
            </div>
          )}
        </div>
      </div>

      {/* Station-by-station cards */}
      {stations.map((s, idx) => {
        const isActive = idx === currentIdx
        const isDone = splits[s.id]?.station
        return (
          <div key={s.id} className="card" style={{
            padding: '16px 18px', marginBottom: 10,
            borderLeft: `3px solid ${isActive ? color : isDone ? 'var(--accent)' : 'var(--s5)'}`,
            background: isActive ? `${color}06` : undefined,
            opacity: idx > currentIdx && !isDone ? 0.5 : 1,
            transition: 'all .3s',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                  background: isDone ? 'rgba(0,200,150,.15)' : `${color}15`,
                  border: `1px solid ${isDone ? 'var(--accent)' : color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: 14,
                  color: isDone ? 'var(--accent)' : color,
                }}>{isDone ? '✓' : idx + 1}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)', letterSpacing: 1 }}>{s.name}</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{s.distance}</span>
                    {(cfg.gender === 'male' ? s.load_m : s.load_f) && (
                      <span style={{ fontSize: 11, color }}>@ {cfg.gender === 'male' ? s.load_m : s.load_f}</span>
                    )}
                    {s.target && <span style={{ fontSize: 11, color: 'var(--muted)' }}>Target: {s.target}</span>}
                  </div>
                </div>
              </div>

              {/* Split inputs */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div>
                  <div className="label" style={{ fontSize: 8, marginBottom: 3 }}>RUN SPLIT</div>
                  <input className="input input-sm" style={{ width: 80 }} placeholder="m:ss"
                    value={splits[s.id]?.run || ''}
                    onChange={e => logSplit(s.id, 'run', e.target.value)} />
                </div>
                <div>
                  <div className="label" style={{ fontSize: 8, marginBottom: 3 }}>STATION SPLIT</div>
                  <input className="input input-sm" style={{ width: 80 }} placeholder="m:ss"
                    value={splits[s.id]?.station || ''}
                    onChange={e => logSplit(s.id, 'station', e.target.value)} />
                </div>
                {isActive && (
                  <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-end', borderColor: color, color }} onClick={advance}>
                    {phase === 'run' ? 'RUN DONE →' : 'STATION DONE →'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}

      <div className="card" style={{ padding: '14px 16px', marginTop: 4 }}>
        <div className="label" style={{ marginBottom: 8 }}>Race Notes / Strategy</div>
        <textarea className="input" rows={2} placeholder="Transitions, pacing notes, what to adjust next time…" style={{ resize: 'vertical' }}
          value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
    </div>
  )
}

// ─── Mixed Modal view ─────────────────────────────────────────────────────────

const MIXED_TYPE_META = {
  strength: { color: 'var(--accent)', label: 'Strength' },
  emom:     { color: 'var(--purple)', label: 'EMOM' },
  amrap:    { color: 'var(--info)',   label: 'AMRAP' },
  for_time: { color: 'var(--warn)',   label: 'For Time' },
  run:      { color: '#60a5fa',      label: 'Run / Row' },
  rest:     { color: 'var(--muted)', label: 'Active Rest' },
}

function MixedSegmentView({ seg, idx, clientId, user }) {
  const meta = MIXED_TYPE_META[seg.type] || MIXED_TYPE_META.strength
  const label = String.fromCharCode(65 + idx)
  const [open, setOpen] = useState(idx === 0)
  const [done, setDone] = useState(false)
  const [notes, setNotes] = useState('')
  const timer = useTimer(seg.type === 'for_time' ? 'stopwatch' : 'countdown')

  return (
    <div className="card" style={{ marginBottom: 12, borderLeft: `3px solid ${meta.color}${done ? '' : '99'}`, opacity: done ? 0.7 : 1, transition: 'opacity .3s' }}>
      <button onClick={() => setOpen(o => !o)} style={{ width: '100%', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: meta.color, background: `${meta.color}18`, border: `1px solid ${meta.color}44`, borderRadius: 4, padding: '2px 8px' }}>{label}</span>
        <span style={{ fontSize: 14 }}>{seg.type === 'strength' ? '💪' : seg.type === 'emom' ? '⏱️' : seg.type === 'amrap' ? '🔄' : seg.type === 'for_time' ? '⏩' : seg.type === 'run' ? '🏃' : '💨'}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--sub)', flex: 1 }}>{seg.label || meta.label}</span>
        {done && <span style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>✓ DONE</span>}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: 'var(--muted)', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s', flexShrink: 0 }}>
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div style={{ padding: '0 18px 16px', borderTop: '1px solid var(--border)' }}>
          {/* Strength: exercise list with set-logging */}
          {seg.type === 'strength' && (
            <div style={{ paddingTop: 12 }}>
              {(seg.exercises || []).map((ex, i) => (
                <div key={ex.id || i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, padding: '8px 12px', background: 'var(--s3)', borderRadius: 6 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: meta.color, minWidth: 20 }}>{i + 1}</span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--white)' }}>{ex.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{ex.sets && ex.reps ? `${ex.sets} × ${ex.reps}` : ''}</span>
                  {ex.load && <span style={{ fontSize: 11, color: meta.color }}>{ex.load}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Conditioning: show structure + mini timer */}
          {(seg.type === 'emom' || seg.type === 'amrap' || seg.type === 'for_time') && (
            <div style={{ paddingTop: 12 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
                <div>
                  {seg.type === 'emom' && <div style={{ fontSize: 12, color: 'var(--muted)' }}>EMOM · {seg.duration_mins} mins · every {seg.interval_mins || 1} min</div>}
                  {seg.type === 'amrap' && <div style={{ fontSize: 12, color: 'var(--muted)' }}>AMRAP · {seg.time_cap_mins} min cap</div>}
                  {seg.type === 'for_time' && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{seg.rounds ? `${seg.rounds} Rounds` : ''} For Time · {seg.time_cap_mins} min cap</div>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {!timer.running ? (
                    <button className="btn btn-ghost btn-sm" style={{ borderColor: meta.color, color: meta.color }}
                      onClick={() => timer.start(seg.type === 'emom' ? (seg.interval_mins || 1) * 60 : seg.type === 'amrap' ? (seg.time_cap_mins || 10) * 60 : 0)}>
                      START TIMER
                    </button>
                  ) : (
                    <button className="btn btn-ghost btn-sm" onClick={timer.pause}>PAUSE</button>
                  )}
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: meta.color }}>{timer.formatted}</div>
                </div>
              </div>
              {(seg.movements || []).map((m, i) => (
                <div key={m.id || i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6, padding: '8px 12px', background: 'var(--s3)', borderRadius: 6 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: meta.color, minWidth: 20 }}>{i + 1}</span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--white)' }}>{m.name}</span>
                  <span style={{ fontSize: 12, color: meta.color }}>{m.reps}</span>
                  {m.load && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{m.load}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Run/row segment */}
          {seg.type === 'run' && (
            <div style={{ paddingTop: 12, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#60a5fa', lineHeight: 1 }}>{seg.distance || '—'}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{(seg.modality || 'run').toUpperCase()}</div>
              </div>
              {seg.target && <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>Target: {seg.target}</div>}
              <div style={{ display: 'flex', gap: 6 }}>
                {!timer.running ? (
                  <button className="btn btn-ghost btn-sm" style={{ borderColor: '#60a5fa', color: '#60a5fa' }} onClick={() => timer.start()}>START</button>
                ) : (
                  <><button className="btn btn-ghost btn-sm" onClick={timer.pause}>PAUSE</button>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#60a5fa', alignSelf: 'center' }}>{timer.formatted}</span></>
                )}
              </div>
            </div>
          )}

          {/* Rest segment */}
          {seg.type === 'rest' && (
            <div style={{ paddingTop: 12, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{seg.duration || '—'} · {seg.activity || 'Active rest'}</div>
              {!timer.running ? (
                <button className="btn btn-ghost btn-sm" onClick={() => { const secs = parseInt(seg.duration) * 60 || 180; timer.start(secs) }}>START REST</button>
              ) : (
                <><button className="btn btn-ghost btn-sm" onClick={timer.pause}>PAUSE</button>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--muted)' }}>{timer.formatted}</span></>
              )}
            </div>
          )}

          {/* Segment notes + done */}
          {seg.note && <div className="coach-note" style={{ marginTop: 10 }}>{seg.note}</div>}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input className="input input-sm" style={{ flex: 1 }} placeholder="Quick note for this block…"
              value={notes} onChange={e => setNotes(e.target.value)} />
            <button className={`btn btn-sm ${done ? 'btn-ghost' : 'btn-primary'}`}
              onClick={() => setDone(d => !d)}
              style={done ? {} : { background: meta.color, borderColor: meta.color }}>
              {done ? 'Undo' : '✓ Done'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MixedModalView({ session, clientId, onFinish }) {
  const cfg = session.conditioning_config || {}
  const segments = cfg.segments || []
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const timer = useTimer('stopwatch')

  async function handleFinish() {
    setSaving(true)
    await upsertConditioningLog({ session_id: session.id, client_id: clientId, result: { total_time: timer.formatted, segments: segments.length }, notes })
    await completeSession(session.id)
    setSaving(false)
    onFinish({ type: 'mixed', total_time: timer.formatted })
  }

  return (
    <div>
      <div className="card" style={{ padding: '14px 18px', marginBottom: 20, borderLeft: '3px solid var(--danger)' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div className="label" style={{ color: 'var(--danger)' }}>MIXED MODAL</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)', letterSpacing: 1 }}>
              {segments.length} Block{segments.length !== 1 ? 's' : ''}{cfg.total_duration_mins ? ` · ${cfg.total_duration_mins} min` : ''}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: timer.running ? 'var(--accent)' : 'var(--muted)' }}>{timer.formatted}</div>
            {!timer.running ? (
              <button className="btn btn-ghost btn-sm" onClick={() => timer.start()}>START</button>
            ) : (
              <button className="btn btn-ghost btn-sm" onClick={timer.pause}>PAUSE</button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={handleFinish} disabled={saving} style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
              {saving ? '…' : 'Finish'}
            </button>
          </div>
        </div>
      </div>

      {cfg.coach_note && <div className="coach-note" style={{ marginBottom: 16 }}>{cfg.coach_note}</div>}

      {segments.map((seg, idx) => (
        <MixedSegmentView key={seg.id} seg={seg} idx={idx} clientId={clientId} />
      ))}

      <div className="card" style={{ padding: '14px 16px', marginTop: 8 }}>
        <div className="label" style={{ marginBottom: 8 }}>Session Notes</div>
        <textarea className="input" rows={2} placeholder="Overall session notes…" style={{ resize: 'vertical' }}
          value={notes} onChange={e => setNotes(e.target.value)} />
      </div>
    </div>
  )
}

// ─── week session picker ──────────────────────────────────────────────────────

function WeekSessionPicker({ sessions, selectedId, onSelect }) {
  if (!sessions.length) return null
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
      {sessions.map(s => {
        const meta = SESSION_TYPE_META[s.session_type || 'strength'] || SESSION_TYPE_META.strength
        const isSelected = s.id === selectedId
        return (
          <button key={s.id} onClick={() => onSelect(s)} style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
            background: isSelected ? `${meta.color}18` : 'var(--s3)',
            border: `1.5px solid ${isSelected ? meta.color + '66' : 'var(--border)'}`,
            color: isSelected ? meta.color : 'var(--muted)',
            transition: 'all .15s',
            boxShadow: isSelected ? `0 0 12px ${meta.color}22` : 'none',
          }}>
            <span style={{ fontSize: 14 }}>{meta.icon}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1 }}>
              {s.day_label || `Session ${sessions.indexOf(s) + 1}`}
            </span>
            {s.is_completed && <span style={{ fontSize: 9, color: 'var(--accent)', marginLeft: 2 }}>✓</span>}
          </button>
        )
      })}
    </div>
  )
}

// ─── workout notes ────────────────────────────────────────────────────────────

function WorkoutNotes({ sessionId, coachId, clientId }) {
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  async function saveNote() {
    if (!note.trim()) return
    setSaving(true)
    await supabase
      .from('sessions')
      .update({ client_note: note.trim() })
      .eq('id', sessionId)
    // Notify coach
    if (coachId) {
      await insertNotification({
        coachId,
        clientId,
        type: 'workout_note',
        title: 'New workout note',
        body: note.trim().slice(0, 200),
        data: { session_id: sessionId },
      })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="card" style={{ marginTop: 20, padding: '18px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 16 }}>📝</span>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 1, color: 'var(--white)' }}>
          WORKOUT NOTES
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 'auto' }}>Visible to your coach</div>
      </div>
      <textarea
        className="input"
        rows={3}
        placeholder="How did that feel? Any pain, PRs, or things to flag for your coach…"
        value={note}
        onChange={e => { setNote(e.target.value); setSaved(false) }}
        style={{ resize: 'none', marginBottom: 10, lineHeight: 1.5 }}
      />
      <button
        className={`btn ${saved ? 'btn-primary' : 'btn-ghost'}`}
        style={{ width: '100%' }}
        onClick={saveNote}
        disabled={saving || !note.trim()}
      >
        {saving ? '…' : saved ? '✓ SENT TO COACH' : 'SEND TO COACH'}
      </button>
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function Training() {
  const { user } = useAuth()
  const { program } = useClient()
  const [weekSessions, setWeekSessions] = useState([])
  const [session, setSession]           = useState(null)
  const [loading, setLoading]           = useState(true)
  const [done, setDone]                 = useState(false)
  const [condResult, setCondResult]     = useState(null)
  const [totalSetsDone, setTotalSetsDone] = useState(0)
  const [autoTrigger, setAutoTrigger]     = useState(0)
  const [videoExercise, setVideoExercise] = useState(null)
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [prevWeightMap, setPrevWeightMap]   = useState({})  // { exerciseName: { setNum: { weight_kg, reps } } }
  const workoutStartTime = useRef(null)

  useEffect(() => {
    if (!user || !program) { setLoading(false); return }
    loadSessions()
  }, [user, program])

  async function loadSessions() {
    setLoading(true)
    const { data } = await getWeekSessions(user.id, program.id, program.current_week)
    setWeekSessions(data || [])

    // Build previous-week weight map for ghost placeholders
    if (program.current_week > 1) {
      const { data: prevData } = await getWeekSessions(user.id, program.id, program.current_week - 1)
      const map = {}
      ;(prevData || []).forEach(s => {
        ;(s.exercises || []).forEach(ex => {
          if (!map[ex.name]) map[ex.name] = {}
          ;(ex.set_logs || []).filter(l => l.is_completed).forEach(log => {
            if (!map[ex.name][log.set_number]) {
              map[ex.name][log.set_number] = { weight_kg: log.weight_kg, reps: log.reps }
            }
          })
        })
      })
      setPrevWeightMap(map)
    }

    // Auto-select first uncompleted session
    const first = (data || []).find(s => !s.is_completed) || (data || [])[0] || null
    setSession(first)
    setWorkoutStarted(false)
    setLoading(false)
  }

  function handleSetCompleted() {
    setTotalSetsDone(p => p + 1)
    setAutoTrigger(p => p + 1)
  }

  function handleCondFinish(result) {
    setCondResult(result)
    setDone(true)
  }

  async function handleStrengthFinish() {
    if (!session) return
    await completeSession(session.id)
    setDone(true)
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div className="spinner" />
    </div>
  )

  if (!program) return (
    <div>
      <div className="page-header"><div className="page-title">Training</div></div>
      <NoProgram />
    </div>
  )

  if (done) return (
    <div>
      <div className="page-header"><div className="page-title">Training</div></div>
      <SessionComplete session={session} totalSets={totalSetsDone} condResult={condResult} />
    </div>
  )

  if (!weekSessions.length) return (
    <div>
      <div className="page-header"><div className="page-title">Training</div></div>
      <div className="empty-state" style={{ height: 300 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
        <div className="empty-state-title">Rest Week</div>
        <div className="empty-state-text">No sessions scheduled for Week {program.current_week}. Check back next week.</div>
      </div>
    </div>
  )

  const sessionType = session?.session_type || 'strength'
  const typeMeta = SESSION_TYPE_META[sessionType] || SESSION_TYPE_META.strength

  // All exercises across the whole week (for progression analysis)
  const allCurrentExercises = weekSessions.flatMap(s => s.exercises || [])

  // Strength session data
  const exercises = session ? [...(session.exercises || [])].sort((a, b) => a.order_index - b.order_index) : []
  const groups = []
  const seen = new Set()
  exercises.forEach(ex => {
    const key = ex.pairing || `solo_${ex.id}`
    if (!seen.has(key)) {
      seen.add(key)
      groups.push({ pairing: ex.pairing || 'solo', exercises: ex.pairing ? exercises.filter(e => e.pairing === ex.pairing) : [ex] })
    }
  })
  const totalSets = exercises.reduce((s, ex) => s + (ex.set_count || 0), 0)
  const completedSets = exercises.reduce((s, ex) => s + (ex.set_logs || []).filter(l => l.is_completed).length, 0)
  const sessionPct = totalSets > 0 ? Math.round(((completedSets + totalSetsDone) / totalSets) * 100) : 0

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
            <div className="page-title" style={{ marginBottom: 0 }}>{session?.day_label || 'Training'}</div>
            {session && (
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5,
                color: typeMeta.color, background: `${typeMeta.color}18`,
                border: `1px solid ${typeMeta.color}44`,
                borderRadius: 4, padding: '3px 8px',
              }}>
                {typeMeta.icon} {typeMeta.label.toUpperCase()}
              </span>
            )}
          </div>
          <div className="page-subtitle">
            Week {program.current_week} of {program.total_weeks}
            {sessionType === 'strength' && session && ` · ${exercises.length} exercise${exercises.length !== 1 ? 's' : ''} · ${totalSets} sets`}
          </div>
        </div>
        {sessionType === 'strength' && session && workoutStarted && (
          <button className="btn btn-primary" onClick={handleStrengthFinish}>Finish Session</button>
        )}
      </div>

      {/* Weekly progressive overload targets */}
      <ProgressionCard
        program={program}
        exercises={allCurrentExercises}
        prevWeightMap={prevWeightMap}
      />

      {/* Week session picker */}
      <WeekSessionPicker sessions={weekSessions} selectedId={session?.id} onSelect={s => { setSession(s); setDone(false); setCondResult(null); setWorkoutStarted(false); setTotalSetsDone(0) }} />

      {!session && (
        <div className="empty-state" style={{ height: 240 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
          <div className="empty-state-title">Select a session above</div>
        </div>
      )}

      {/* Strength session — pre-workout START screen */}
      {session && sessionType === 'strength' && !workoutStarted && (
        <div className="card" style={{ padding: 28, textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💪</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--white)', marginBottom: 6 }}>
            {session.day_label}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
            {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} · {totalSets} sets
            {session.session_type && ` · ${session.session_type.charAt(0).toUpperCase() + session.session_type.slice(1)}`}
          </div>
          {exercises.length > 0 && (
            <div style={{ marginBottom: 24, textAlign: 'left' }}>
              {exercises.slice(0, 6).map(ex => (
                <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--white)' }}>{ex.name}</span>
                  <span style={{ color: 'var(--muted)', fontSize: 11 }}>{ex.set_count} × {ex.rep_scheme || '—'}</span>
                </div>
              ))}
              {exercises.length > 6 && (
                <div style={{ fontSize: 11, color: 'var(--muted)', paddingTop: 8 }}>+{exercises.length - 6} more exercises</div>
              )}
            </div>
          )}
          {Object.keys(prevWeightMap).length > 0 && (
            <div style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 20, padding: '8px 14px', background: 'rgba(0,200,150,.06)', borderRadius: 8, border: '1px solid rgba(0,200,150,.2)' }}>
              ↑ Last week's weights loaded — shown as targets in each set
            </div>
          )}
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: 15, letterSpacing: 2 }}
            onClick={() => { workoutStartTime.current = Date.now(); setWorkoutStarted(true) }}
          >
            START WORKOUT
          </button>
        </div>
      )}

      {/* Strength session — active */}
      {session && sessionType === 'strength' && workoutStarted && (
        <>
          {/* Session progress bar */}
          <div className="card" style={{ padding: '14px 18px', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="label">Session Progress</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: sessionPct === 100 ? 'var(--accent)' : 'var(--sub)' }}>
                {Math.min(completedSets + totalSetsDone, totalSets)}/{totalSets} sets
              </span>
            </div>
            <div style={{ height: 4, background: 'var(--s5)', borderRadius: 2 }}>
              <div style={{
                height: '100%', width: `${Math.min(sessionPct, 100)}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--accent-hi))',
                borderRadius: 2, transition: 'width .4s ease',
                boxShadow: sessionPct > 0 ? '0 0 8px rgba(0,200,150,.4)' : 'none',
              }} />
            </div>
          </div>

          <div>
            <MovementPrep sessionType={sessionType} compact />
            <MovementPrepCard items={session.movement_prep || undefined} />
            {groups.map((group, idx) => (
              <PairingGroup key={group.pairing} pairing={group.pairing} exercises={group.exercises}
                clientId={user.id} colorIndex={idx} onSetCompleted={handleSetCompleted}
                onVideoOpen={setVideoExercise} prevWeightMap={prevWeightMap} />
            ))}

            {/* Workout notes */}
            <WorkoutNotes sessionId={session.id} coachId={program.coach_id} clientId={user.id} />
          </div>
        </>
      )}

      {/* Conditioning sessions */}
      {session && sessionType === 'emom'     && <EMOMView     session={session} clientId={user.id} onFinish={handleCondFinish} />}
      {session && sessionType === 'amrap'    && <AMRAPView    session={session} clientId={user.id} onFinish={handleCondFinish} />}
      {session && sessionType === 'for_time' && <ForTimeView  session={session} clientId={user.id} onFinish={handleCondFinish} />}
      {session && sessionType === 'hyrox'    && <HYROXView    session={session} clientId={user.id} onFinish={handleCondFinish} />}
      {session && sessionType === 'mixed'    && <MixedModalView session={session} clientId={user.id} onFinish={handleCondFinish} />}

      {/* ─── Video modal ────────────────────────────────────────────────────── */}
      {videoExercise && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setVideoExercise(null)}
        >
          <div
            style={{ background: '#1a1a2e', borderRadius: 12, overflow: 'hidden', width: '100%', maxWidth: 640 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)', letterSpacing: '0.04em' }}>{videoExercise.name}</span>
              <button
                onClick={() => setVideoExercise(null)}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}
              >✕</button>
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoExercise.videoId}?autoplay=1&rel=0`}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
