import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { getEventPlansForClient } from '../../lib/supabase.js'
import {
  EVENT_TYPES, daysBetween, weeksBetween,
  formatEventDate, currentPhaseIndex,
} from '../../lib/periodisation.js'

// ─── Countdown hero ───────────────────────────────────────────────────────────

function CountdownHero({ plan }) {
  const eventDef = EVENT_TYPES.find(e => e.value === plan.event_type)
  const today    = new Date().toISOString().split('T')[0]
  const days     = daysBetween(today, plan.event_date)
  const weeks    = weeksBetween(today, plan.event_date)

  return (
    <div style={{
      padding: '24px 28px', borderRadius: 14, marginBottom: 24,
      background: 'linear-gradient(135deg, var(--s2) 0%, var(--s3) 100%)',
      border: '1px solid var(--border)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background watermark */}
      <div style={{
        position: 'absolute', right: -10, top: -10,
        fontSize: 100, opacity: 0.06, lineHeight: 1,
        userSelect: 'none',
      }}>{eventDef?.icon || '🏆'}</div>

      <div style={{ position: 'relative' }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 2,
          color: 'var(--muted)', marginBottom: 8,
        }}>TARGET EVENT</div>

        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1,
          color: 'var(--white)', marginBottom: 6,
        }}>{plan.event_name}</div>

        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>
          {eventDef?.label} · {formatEventDate(plan.event_date)}
        </div>

        {days > 0 ? (
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, lineHeight: 1, color: 'var(--accent)' }}>
                {days}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
                DAYS TO GO
              </div>
            </div>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, lineHeight: 1, color: 'var(--white)' }}>
                {weeks}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
                WEEKS
              </div>
            </div>
          </div>
        ) : days === 0 ? (
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--accent)' }}>
            🏆 RACE DAY — GO GET IT!
          </div>
        ) : (
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)' }}>
            Event completed — great work!
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

function RoadmapTimeline({ phases, eventDate }) {
  if (!phases || phases.length === 0) return null
  const today      = new Date().toISOString().split('T')[0]
  const planStart  = phases[0].start_date
  const totalMs    = new Date(eventDate) - new Date(planStart)
  const todayPct   = Math.min(100, Math.max(0,
    ((new Date(today) - new Date(planStart)) / totalMs) * 100
  ))
  const curIdx = currentPhaseIndex(phases)

  return (
    <div style={{ marginBottom: 24 }}>
      <div className="label" style={{ marginBottom: 10 }}>Your Roadmap</div>

      {/* Bar */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', height: 48 }}>
          {phases.map((p, i) => (
            <div
              key={p.id}
              title={`${p.label} — ${p.weeks}w`}
              style={{
                flex: p.weeks, background: p.color,
                opacity: today > p.end_date ? 0.35 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: i === curIdx ? `inset 0 0 0 2px rgba(255,255,255,.4)` : 'none',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1,
                color: '#000', opacity: 0.75, whiteSpace: 'nowrap', padding: '0 6px',
              }}>{p.label.toUpperCase()}</span>
            </div>
          ))}
          <div style={{
            width: 32, flexShrink: 0,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🏆</div>
        </div>

        {/* Today marker */}
        {today >= planStart && today <= eventDate && (
          <div style={{
            position: 'absolute', top: -4, bottom: -4,
            left: `calc(${todayPct}% - 1px)`,
            width: 2, background: 'var(--white)', borderRadius: 2,
            boxShadow: '0 0 8px rgba(255,255,255,.8)',
          }}>
            <div style={{
              position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
              marginTop: 4,
              fontFamily: 'var(--font-display)', fontSize: 7, letterSpacing: 1,
              color: 'var(--white)', whiteSpace: 'nowrap',
            }}>TODAY</div>
          </div>
        )}
      </div>

      {/* Week labels */}
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        {phases.map(p => (
          <div key={p.id} style={{ flex: p.weeks, textAlign: 'center', fontSize: 9, color: 'var(--muted)' }}>
            {p.weeks}w
          </div>
        ))}
        <div style={{ width: 32 }} />
      </div>
    </div>
  )
}

// ─── Phase cards (read-only) ──────────────────────────────────────────────────

function PhaseCards({ phases }) {
  const today  = new Date().toISOString().split('T')[0]
  const curIdx = currentPhaseIndex(phases)

  return (
    <div style={{ marginBottom: 24 }}>
      <div className="label" style={{ marginBottom: 12 }}>Training Phases</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {phases.map((p, i) => {
          const isCurrent = i === curIdx
          const isPast    = today > p.end_date
          const isNext    = i === curIdx + 1

          return (
            <div key={p.id} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              padding: '14px 16px', borderRadius: 10,
              border: `1px solid ${isCurrent ? p.color + '66' : 'var(--border)'}`,
              borderLeft: `4px solid ${p.color}`,
              background: isCurrent ? `${p.color}10` : 'var(--s2)',
              opacity: isPast ? 0.55 : 1,
              transition: 'opacity .2s',
            }}>
              {/* Phase number */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: p.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: 11, color: '#000',
                flexShrink: 0, marginTop: 2,
              }}>{i + 1}</div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1, color: 'var(--white)' }}>
                    {p.label}
                  </div>
                  {isCurrent && (
                    <span style={{
                      fontSize: 7, fontFamily: 'var(--font-display)', letterSpacing: 1,
                      padding: '2px 7px', borderRadius: 4,
                      background: 'var(--accent-dim)', color: 'var(--accent)',
                      border: '1px solid var(--border-accent)',
                    }}>YOU ARE HERE</span>
                  )}
                  {isNext && (
                    <span style={{
                      fontSize: 7, fontFamily: 'var(--font-display)', letterSpacing: 1,
                      padding: '2px 7px', borderRadius: 4,
                      background: 'var(--s3)', color: 'var(--muted)',
                      border: '1px solid var(--border)',
                    }}>UP NEXT</span>
                  )}
                  {isPast && (
                    <span style={{ fontSize: 9, color: 'var(--muted)' }}>✓ Completed</span>
                  )}
                </div>

                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>
                  {p.weeks} weeks · {formatEventDate(p.start_date)} → {formatEventDate(p.end_date)}
                </div>

                <div style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.5 }}>
                  {p.description}
                </div>

                {isCurrent && (
                  <Link
                    to="/training"
                    style={{
                      display: 'inline-block', marginTop: 10,
                      fontSize: 11, color: 'var(--accent)', textDecoration: 'none',
                      padding: '5px 12px', borderRadius: 6,
                      background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
                    }}
                  >
                    Go to Training →
                  </Link>
                )}
              </div>
            </div>
          )
        })}

        {/* Event day */}
        <div style={{
          display: 'flex', gap: 14, alignItems: 'center',
          padding: '14px 16px', borderRadius: 10,
          border: '1px solid var(--border-accent)',
          background: 'var(--accent-dim)',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, flexShrink: 0,
          }}>🏆</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1, color: 'var(--accent)' }}>
            RACE DAY
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Plan selector (if multiple plans) ───────────────────────────────────────

function PlanSelector({ plans, selectedId, onSelect }) {
  if (plans.length <= 1) return null
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
      {plans.map(p => {
        const eventDef = EVENT_TYPES.find(e => e.value === p.event_type)
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            style={{
              padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1,
              background: selectedId === p.id ? 'var(--accent-dim)' : 'var(--s3)',
              border: `1.5px solid ${selectedId === p.id ? 'var(--accent)' : 'var(--border)'}`,
              color: selectedId === p.id ? 'var(--accent)' : 'var(--muted)',
            }}
          >
            {eventDef?.icon} {p.event_name.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MyRoadmap() {
  const { user }   = useAuth()
  const [plans, setPlans]         = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    if (!user?.id) return
    getEventPlansForClient(user.id).then(({ data }) => {
      const list = data || []
      setPlans(list)
      if (list.length > 0) setSelectedId(list[0].id)
      setLoading(false)
    })
  }, [user?.id])

  const activePlan = plans.find(p => p.id === selectedId)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">My Roadmap</div>
          <div className="page-subtitle">
            Your periodised plan to peak performance — phase by phase.
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ height: 160, opacity: 0.4 }} />
          <div className="card" style={{ height: 60, opacity: 0.4 }} />
          <div className="card" style={{ height: 100, opacity: 0.3 }} />
        </div>
      ) : plans.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 1,
            color: 'var(--muted)', marginBottom: 8,
          }}>NO PLAN YET</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            Your coach will build a personalised periodised plan here once your goal event is set.
            Reach out to get started.
          </div>
        </div>
      ) : (
        <>
          <PlanSelector plans={plans} selectedId={selectedId} onSelect={setSelectedId} />

          {activePlan && (
            <>
              <CountdownHero plan={activePlan} />
              <RoadmapTimeline phases={activePlan.phases || []} eventDate={activePlan.event_date} />
              <PhaseCards phases={activePlan.phases || []} />
            </>
          )}
        </>
      )}
    </div>
  )
}
