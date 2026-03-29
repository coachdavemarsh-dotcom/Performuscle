import { useState, useMemo } from 'react'
import { PROTOCOL_DATA } from '../../data/protocolData.js'

// ─── Category colors ──────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  Immune:    { bg: '#00C89620', border: '#00C89640', text: '#00C896' },
  Sleep:     { bg: '#8b5cf620', border: '#8b5cf640', text: '#8b5cf6' },
  Recovery:  { bg: '#3b82f620', border: '#3b82f640', text: '#3b82f6' },
  Gut:       { bg: '#f59e0b20', border: '#f59e0b40', text: '#f59e0b' },
  Stress:    { bg: '#ef444420', border: '#ef444440', text: '#ef4444' },
}

function CategoryBadge({ category }) {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Immune
  return (
    <span style={{
      fontFamily: 'var(--font-display)',
      fontSize: 9,
      letterSpacing: '0.08em',
      color: colors.text,
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      borderRadius: 4,
      padding: '2px 8px',
    }}>
      {category.toUpperCase()}
    </span>
  )
}

// ─── Protocol Card ────────────────────────────────────────────────────────────
function ProtocolCard({ protocol }) {
  const [expanded, setExpanded] = useState(false)
  const colors = CATEGORY_COLORS[protocol.category] || CATEGORY_COLORS.Immune

  return (
    <div
      className="card"
      style={{
        cursor: 'pointer',
        border: expanded ? `1px solid ${colors.border}` : '1px solid var(--border)',
        transition: 'border-color 0.2s',
      }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flex: 1 }}>
          {/* Icon */}
          <div style={{
            fontSize: 32,
            lineHeight: 1,
            flexShrink: 0,
            marginTop: 2,
          }}>
            {protocol.icon}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              color: 'var(--white)',
              letterSpacing: '0.04em',
              marginBottom: 6,
            }}>
              {protocol.name}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <CategoryBadge category={protocol.category} />
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--muted)',
              }}>
                {protocol.duration}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--muted)',
              }}>
                {protocol.steps.length} phase{protocol.steps.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 16,
          color: 'var(--muted)',
          marginLeft: 12,
          flexShrink: 0,
        }}>
          {expanded ? '▲' : '▼'}
        </div>
      </div>

      {/* Description preview */}
      {!expanded && (
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--muted)',
          lineHeight: 1.5,
          marginTop: 12,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {protocol.description}
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div style={{ marginTop: 16 }}>
          {/* Description */}
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--white)',
            lineHeight: 1.6,
            marginBottom: 20,
          }}>
            {protocol.description}
          </div>

          {/* Phase steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {protocol.steps.map((step, stepIdx) => (
              <div key={stepIdx} style={{
                padding: '14px 16px',
                background: 'var(--s3)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                borderLeft: `3px solid ${colors.text}`,
              }}>
                {/* Phase label */}
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  color: colors.text,
                  letterSpacing: '0.06em',
                  marginBottom: 12,
                }}>
                  {step.phase}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {step.actions.map((action, actionIdx) => (
                    <div key={actionIdx} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: colors.bg,
                        border: `1px solid ${colors.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 1,
                        fontFamily: 'var(--font-display)',
                        fontSize: 9,
                        color: colors.text,
                      }}>
                        {actionIdx + 1}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 12,
                        color: 'var(--muted)',
                        lineHeight: 1.55,
                        flex: 1,
                      }}>
                        {action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Immune', 'Sleep', 'Recovery', 'Gut', 'Stress']

export default function Protocols() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return PROTOCOL_DATA
    return PROTOCOL_DATA.filter(p => p.category === activeCategory)
  }, [activeCategory])

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Wellness Protocols</div>
          <div className="page-subtitle">Step-by-step evidence-based protocols for health optimisation</div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
            {cat !== 'All' && (
              <span style={{ marginLeft: 6, opacity: 0.6 }}>
                {PROTOCOL_DATA.filter(p => p.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Protocol grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map(p => (
          <ProtocolCard key={p.id} protocol={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--muted)',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
        }}>
          No protocols in this category.
        </div>
      )}
    </div>
  )
}
