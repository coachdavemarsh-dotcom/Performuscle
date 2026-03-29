import { useState } from 'react'
import { MOVEMENT_PREP_PROTOCOLS, SESSION_TYPE_MAP } from '../../data/movementPrepData.js'

const PHASE_COLORS = {
  realign:      { bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)',  text: '#93c5fd', label: 'RE-ALIGN' },
  release:      { bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.3)', text: '#c4b5fd', label: 'RELEASE' },
  reintegrate:  { bg: 'rgba(0,200,150,0.12)',   border: 'rgba(0,200,150,0.3)',   text: '#00FFB8', label: 'RE-INTEGRATE' },
  ramp:         { bg: 'rgba(245,158,11,0.12)',   border: 'rgba(245,158,11,0.3)',  text: '#fcd34d', label: 'RAMP' },
}

function PhaseCard({ phase, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false)
  const c = PHASE_COLORS[phase.id] || PHASE_COLORS.ramp

  return (
    <div style={{
      border: `1px solid ${c.border}`,
      background: c.bg,
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '12px 16px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: 12, textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.07em',
            color: c.text, background: c.bg, border: `1px solid ${c.border}`,
            borderRadius: 4, padding: '2px 8px', flexShrink: 0,
          }}>
            {c.label}
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--white)', letterSpacing: '0.03em' }}>
            {phase.name}
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>
            {phase.duration}
          </span>
        </div>
        <span style={{ color: 'var(--muted)', fontSize: 12, flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${c.border}`, padding: '12px 16px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6 }}>
            {phase.description}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {phase.exercises.map((ex, i) => (
              <div key={i} style={{
                background: 'rgba(0,0,0,0.2)', borderRadius: 8,
                padding: '10px 14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 4 }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--white)', fontWeight: 500 }}>
                    {ex.name}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    {ex.sets > 1 && (
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: c.text, letterSpacing: '0.05em' }}>
                        {ex.sets} sets
                      </span>
                    )}
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--sub)', letterSpacing: '0.04em' }}>
                      {ex.reps}
                    </span>
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>
                  {ex.cues}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * MovementPrep component
 * @param {string} sessionType - e.g. 'strength', 'upper', 'lower', 'push', 'pull', 'full_body'
 * @param {boolean} compact - if true, shows collapsed by default
 */
export default function MovementPrep({ sessionType, compact = false }) {
  const [expanded, setExpanded] = useState(!compact)
  const protocolKey = SESSION_TYPE_MAP[sessionType?.toLowerCase()] || 'full_body'
  const protocol = MOVEMENT_PREP_PROTOCOLS[protocolKey]

  if (!protocol) return null

  const totalDuration = protocol.phases.reduce((sum, p) => {
    const mins = parseInt(p.duration)
    return sum + (isNaN(mins) ? 0 : mins)
  }, 0)

  return (
    <div style={{
      background: 'var(--s3)', border: '1px solid var(--border)',
      borderRadius: 12, overflow: 'hidden', marginBottom: 20,
    }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '14px 20px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: 12, textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>{protocol.icon}</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--white)', letterSpacing: '0.04em' }}>
              MOVEMENT PREP — {protocol.label.toUpperCase()}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
              4 R's Protocol · ~{totalDuration} minutes · Complete before training
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {['realign','release','reintegrate','ramp'].map(id => {
              const c = PHASE_COLORS[id]
              return <div key={id} style={{ width: 6, height: 6, borderRadius: '50%', background: c.text }} />
            })}
          </div>
          <span style={{ color: 'var(--muted)', fontSize: 12 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Phases */}
      {expanded && (
        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {protocol.phases.map((phase, i) => (
            <PhaseCard key={phase.id} phase={phase} defaultOpen={i === 0} />
          ))}

          <div style={{
            marginTop: 6, padding: '10px 14px',
            background: 'rgba(0,200,150,0.06)', border: '1px solid rgba(0,200,150,0.2)',
            borderRadius: 8, fontSize: 12, color: 'var(--muted)', lineHeight: 1.7,
          }}>
            <strong style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>WHY THIS MATTERS:</strong>{' '}
            Movement prep addresses joint position before adding load. It reduces injury risk, improves motor recruitment, and ensures you get more from every rep. Skipping this is like starting a race with your shoes tied together.
          </div>
        </div>
      )}
    </div>
  )
}
