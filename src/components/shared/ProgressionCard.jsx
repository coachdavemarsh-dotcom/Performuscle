import { useState, useEffect } from 'react'
import { generateWeekProgressions, getProgressionSummary } from '../../lib/progressiveOverload.js'

// ─── Chevron icon ─────────────────────────────────────────────────────────────

function Chevron({ open }) {
  return (
    <svg
      width="10" height="10" viewBox="0 0 10 10" fill="none"
      style={{ color: 'var(--muted)', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s', flexShrink: 0 }}
    >
      <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── Single progression row ───────────────────────────────────────────────────

function ProgressionRow({ p, isLast }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '11px 0',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
    }}>
      {/* Badge */}
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 7, letterSpacing: 1.5,
        padding: '3px 7px', borderRadius: 4, flexShrink: 0, marginTop: 3,
        background: `${p.badgeColor}18`,
        border:     `1px solid ${p.badgeColor}44`,
        color:       p.badgeColor,
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
      }}>
        {p.badge}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 13,
          color: 'var(--white)', letterSpacing: .4, marginBottom: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {p.exerciseName}
        </div>
        <div style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.5 }}>
          {p.suggestion}
        </div>
        {p.previousBest && (
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>
            Last week: {p.previousBest}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProgressionCard({ program, exercises, prevWeightMap }) {
  const [expanded,  setExpanded]  = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const [progressions, setProgressions] = useState([])

  const dismissKey = program
    ? `progression_dismissed_${program.id}_w${program.current_week}`
    : null

  // Restore dismissal state from localStorage
  useEffect(() => {
    if (!dismissKey) return
    setDismissed(localStorage.getItem(dismissKey) === 'true')
  }, [dismissKey])

  // Recalculate whenever exercises or prevWeightMap change
  useEffect(() => {
    if (!exercises?.length || !prevWeightMap) { setProgressions([]); return }
    setProgressions(generateWeekProgressions(exercises, prevWeightMap))
  }, [exercises, prevWeightMap])

  // Only show from week 2 onwards and when there's something to report
  if (!program || program.current_week <= 1) return null
  if (dismissed) return null
  if (!progressions.length) return null

  const summary = getProgressionSummary(progressions)
  const loadUps = progressions.filter(p => p.type === 'weight')
  const shown   = progressions.slice(0, 8) // cap at 8 to keep card focused

  function handleDismiss(e) {
    e.stopPropagation()
    if (dismissKey) localStorage.setItem(dismissKey, 'true')
    setDismissed(true)
  }

  return (
    <div
      className="card"
      style={{
        marginBottom: 20,
        borderLeft: '3px solid var(--accent)',
        background: 'linear-gradient(135deg, rgba(0,200,150,.05) 0%, var(--s2) 60%)',
        overflow: 'hidden',
        transition: 'box-shadow .2s',
      }}
    >
      {/* ── Header (always visible, toggles body) ── */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: 'rgba(0,200,150,.14)',
          border: '1px solid rgba(0,200,150,.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17,
        }}>
          📈
        </div>

        {/* Title + summary */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 12,
            letterSpacing: 1.5, color: 'var(--accent)',
          }}>
            WEEK {program.current_week} PROGRESSION TARGETS
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, lineHeight: 1.4 }}>
            {summary}
          </div>
        </div>

        {/* Load-up count pill */}
        {loadUps.length > 0 && (
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1,
            padding: '3px 9px', borderRadius: 20,
            background: 'rgba(0,200,150,.15)',
            border: '1px solid rgba(0,200,150,.35)',
            color: 'var(--accent)', flexShrink: 0,
          }}>
            +{loadUps.length} load
          </div>
        )}

        <Chevron open={expanded} />
      </button>

      {/* ── Body ── */}
      {expanded && (
        <div style={{ padding: '0 18px 16px' }}>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            {shown.map((p, i) => (
              <ProgressionRow key={p.exerciseName} p={p} isLast={i === shown.length - 1} />
            ))}
            {progressions.length > 8 && (
              <div style={{ fontSize: 11, color: 'var(--muted)', paddingTop: 10, textAlign: 'center' }}>
                +{progressions.length - 8} more exercises — check in-session targets
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', gap: 10, alignItems: 'center', marginTop: 14,
            paddingTop: 12, borderTop: '1px solid var(--border)',
          }}>
            <div style={{
              flex: 1, fontSize: 10, color: 'var(--muted)', lineHeight: 1.5,
            }}>
              Based on your Week {program.current_week - 1} performance. Only increase load when form is solid — never chase numbers at the cost of technique.
            </div>
            <button
              onClick={handleDismiss}
              style={{
                fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5,
                padding: '5px 11px', borderRadius: 6, flexShrink: 0,
                background: 'var(--s3)', border: '1px solid var(--border)',
                color: 'var(--muted)', cursor: 'pointer',
                transition: 'border-color .15s, color .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hi)'; e.currentTarget.style.color = 'var(--sub)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)';    e.currentTarget.style.color = 'var(--muted)' }}
            >
              GOT IT
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
