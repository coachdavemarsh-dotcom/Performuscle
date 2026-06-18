import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useCoach } from '../../hooks/useCoach.js'
import {
  getEventPlansForCoach, upsertEventPlan, deleteEventPlan,
} from '../../lib/supabase.js'
import {
  EVENT_TYPES, PHASE_TYPE_COLORS, generatePhases,
  weeksBetween, daysBetween, formatEventDate, currentPhaseIndex,
} from '../../lib/periodisation.js'
import { PROGRAM_TEMPLATES } from '../../data/programTemplates.js'

// ─── Timeline bar ─────────────────────────────────────────────────────────────

function PlanTimeline({ phases, eventDate, compact = false }) {
  if (!phases || phases.length === 0) return null
  const totalWeeks = phases.reduce((s, p) => s + p.weeks, 0)
  const today = new Date().toISOString().split('T')[0]
  const planStart = phases[0].start_date
  const totalMs = new Date(eventDate) - new Date(planStart)
  const todayPct = Math.min(100, Math.max(0,
    ((new Date(today) - new Date(planStart)) / totalMs) * 100
  ))

  return (
    <div style={{ position: 'relative', marginBottom: compact ? 8 : 16 }}>
      <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: compact ? 28 : 40 }}>
        {phases.map(p => (
          <div
            key={p.id}
            title={`${p.label} — ${p.weeks}w`}
            style={{
              flex: p.weeks,
              background: p.color,
              opacity: today > p.end_date ? 0.4 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', transition: 'flex .3s',
            }}
          >
            {!compact && (
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1,
                color: '#000', opacity: 0.7, whiteSpace: 'nowrap', padding: '0 4px',
              }}>{p.label.toUpperCase()}</span>
            )}
          </div>
        ))}
        {/* Event day block */}
        <div style={{
          width: compact ? 16 : 24, flexShrink: 0,
          background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: compact ? 10 : 14,
        }}>🏆</div>
      </div>

      {/* Today marker */}
      {today >= planStart && today <= eventDate && (
        <div style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `calc(${todayPct}% - 1px)`,
          width: 2, background: 'var(--white)', opacity: 0.9,
          boxShadow: '0 0 6px rgba(255,255,255,.6)',
        }} />
      )}

      {/* Week labels */}
      {!compact && (
        <div style={{ display: 'flex', marginTop: 4 }}>
          {phases.map(p => (
            <div key={p.id} style={{ flex: p.weeks, textAlign: 'center', fontSize: 9, color: 'var(--muted)' }}>
              {p.weeks}w
            </div>
          ))}
          <div style={{ width: 24 }} />
        </div>
      )}
    </div>
  )
}

// ─── Phase card (editable) ────────────────────────────────────────────────────

const TEMPLATE_OPTIONS = PROGRAM_TEMPLATES.map(t => ({ value: t.id, label: t.name }))

function PhaseCard({ phase, index, total, onChange, onDelete }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{
      border: `1px solid var(--border)`,
      borderLeft: `4px solid ${phase.color}`,
      borderRadius: 8, marginBottom: 8, overflow: 'hidden',
    }}>
      {/* Header row */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 14px', cursor: 'pointer', background: 'var(--s2)',
        }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{
          width: 20, height: 20, borderRadius: '50%', background: phase.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 9, color: '#000', flexShrink: 0,
        }}>{index + 1}</div>

        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1, color: 'var(--white)' }}>
            {phase.label}
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>
            {phase.weeks} weeks · {formatEventDate(phase.start_date)} → {formatEventDate(phase.end_date)}
          </div>
        </div>

        {phase.suggested_template_id && (
          <span style={{
            fontSize: 8, fontFamily: 'var(--font-display)', letterSpacing: 0.5,
            padding: '2px 6px', borderRadius: 3,
            background: 'rgba(0,200,150,.12)', color: 'var(--accent)',
            border: '1px solid rgba(0,200,150,.25)', flexShrink: 0,
          }}>TEMPLATE</span>
        )}

        <span style={{ color: 'var(--muted)', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
      </div>

      {/* Expanded edit area */}
      {open && (
        <div style={{ padding: '14px 16px', background: 'var(--s1)', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>Phase Name</div>
              <input
                className="input"
                value={phase.label}
                onChange={e => onChange({ ...phase, label: e.target.value })}
              />
            </div>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>Weeks</div>
              <input
                className="input"
                type="number"
                min={1}
                max={20}
                value={phase.weeks}
                onChange={e => {
                  const w = Math.max(1, parseInt(e.target.value) || 1)
                  const start = new Date(phase.start_date)
                  const end = new Date(start.getTime() + w * 7 * 24 * 60 * 60 * 1000 - 86400000)
                  onChange({
                    ...phase,
                    weeks: w,
                    end_date: end.toISOString().split('T')[0],
                  })
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div className="label" style={{ marginBottom: 4 }}>Suggested Template</div>
            <select
              className="select"
              value={phase.suggested_template_id || ''}
              onChange={e => onChange({ ...phase, suggested_template_id: e.target.value || null })}
            >
              <option value="">— None / Custom —</option>
              {TEMPLATE_OPTIONS.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div className="label" style={{ marginBottom: 4 }}>Phase Description</div>
            <textarea
              className="input"
              rows={2}
              style={{ resize: 'vertical' }}
              value={phase.description}
              onChange={e => onChange({ ...phase, description: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <div className="label" style={{ marginBottom: 4 }}>Coach Notes (private)</div>
            <textarea
              className="input"
              rows={2}
              style={{ resize: 'vertical' }}
              placeholder="Internal notes for this phase…"
              value={phase.notes}
              onChange={e => onChange({ ...phase, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ fontSize: 11, color: 'var(--danger)' }}
              onClick={onDelete}
            >
              Remove phase
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Create / Edit modal ──────────────────────────────────────────────────────

function PlanModal({ clients, onClose, onSaved, initialPlan = null }) {
  const { user } = useAuth()
  const today = new Date().toISOString().split('T')[0]

  const [step, setStep]           = useState(initialPlan ? 2 : 1)
  const [clientId, setClientId]   = useState(initialPlan?.client_id || '')
  const [eventType, setEventType] = useState(initialPlan?.event_type || '')
  const [eventName, setEventName] = useState(initialPlan?.event_name || '')
  const [eventDate, setEventDate] = useState(initialPlan?.event_date || '')
  const [phases, setPhases]       = useState(initialPlan?.phases || [])
  const [notes, setNotes]         = useState(initialPlan?.notes || '')
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState(null)

  const planId = initialPlan?.id || null

  function handleGenerate() {
    if (!eventType || !eventDate) return
    const generated = generatePhases(eventType, eventDate, today)
    setPhases(generated)
    setStep(2)
  }

  function updatePhase(index, updated) {
    setPhases(ps => ps.map((p, i) => i === index ? updated : p))
  }

  function deletePhase(index) {
    setPhases(ps => ps.filter((_, i) => i !== index))
  }

  function addPhase() {
    const lastPhase = phases[phases.length - 1]
    const start = lastPhase
      ? new Date(new Date(lastPhase.end_date).getTime() + 86400000).toISOString().split('T')[0]
      : today
    const end = new Date(new Date(start).getTime() + 4 * 7 * 24 * 60 * 60 * 1000 - 86400000).toISOString().split('T')[0]
    setPhases(ps => [...ps, {
      id: `phase-${Date.now()}`,
      key: 'custom', label: 'Custom Phase', phase_type: 'build',
      weeks: 4, start_date: start, end_date: end,
      suggested_template_id: null, program_id: null,
      color: PHASE_TYPE_COLORS.build, description: '', notes: '',
    }])
  }

  async function handleSave(status) {
    if (!clientId || !eventType || !eventName || !eventDate || phases.length === 0) {
      setError('Please fill in all fields and generate phases.')
      return
    }
    setSaving(true)
    setError(null)
    const { data, error: err } = await upsertEventPlan({
      ...(planId ? { id: planId } : {}),
      client_id: clientId,
      coach_id: user.id,
      event_type: eventType,
      event_name: eventName,
      event_date: eventDate,
      status,
      phases,
      notes,
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    onSaved(data)
  }

  const eventTypeDef = EVENT_TYPES.find(e => e.value === eventType)
  const daysToEvent  = eventDate ? daysBetween(today, eventDate) : null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      zIndex: 1000, overflowY: 'auto', padding: '40px 16px',
    }}>
      <div style={{
        background: 'var(--s1)', border: '1px solid var(--border)',
        borderRadius: 16, width: '100%', maxWidth: 700,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
        }}>
          <div>
            <div className="page-title" style={{ fontSize: 18 }}>
              {initialPlan ? 'Edit Plan' : 'New Event Plan'}
            </div>
            {step === 2 && eventName && (
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {eventTypeDef?.icon} {eventName} · {formatEventDate(eventDate)}
                {daysToEvent !== null && ` · ${daysToEvent > 0 ? `${daysToEvent} days away` : 'past'}`}
              </div>
            )}
          </div>
          <button type="button" className="btn btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {/* ── STEP 1: Event details ── */}
          {step === 1 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <div className="label" style={{ marginBottom: 6 }}>Client</div>
                  <select
                    className="select"
                    value={clientId}
                    onChange={e => setClientId(e.target.value)}
                  >
                    <option value="">— Select client —</option>
                    {(clients || []).map(c => (
                      <option key={c.id} value={c.client_id}>{c.profile?.full_name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ gridColumn: '1/-1' }}>
                  <div className="label" style={{ marginBottom: 6 }}>Event Type</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {EVENT_TYPES.map(et => (
                      <button
                        key={et.value}
                        type="button"
                        onClick={() => setEventType(et.value)}
                        style={{
                          padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
                          fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1,
                          background: eventType === et.value ? 'var(--accent-dim)' : 'var(--s3)',
                          border: `1.5px solid ${eventType === et.value ? 'var(--accent)' : 'var(--border)'}`,
                          color: eventType === et.value ? 'var(--accent)' : 'var(--muted)',
                        }}
                      >
                        {et.icon} {et.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="label" style={{ marginBottom: 6 }}>Event Name</div>
                  <input
                    className="input"
                    placeholder="e.g. HYROX Dublin, Manchester Marathon"
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                  />
                </div>

                <div>
                  <div className="label" style={{ marginBottom: 6 }}>Event Date</div>
                  <input
                    className="input"
                    type="date"
                    value={eventDate}
                    min={today}
                    onChange={e => setEventDate(e.target.value)}
                  />
                </div>
              </div>

              {eventDate && eventType && (
                <div style={{
                  padding: '10px 14px', borderRadius: 8, marginBottom: 16,
                  background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
                  fontSize: 12, color: 'var(--accent)',
                }}>
                  {daysBetween(today, eventDate)} days ({weeksBetween(today, eventDate)} weeks) to build towards {eventName || 'event'}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!clientId || !eventType || !eventName || !eventDate}
                  onClick={handleGenerate}
                >
                  Generate Phase Plan →
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: Phase editor ── */}
          {step === 2 && (
            <>
              {/* Timeline preview */}
              <PlanTimeline phases={phases} eventDate={eventDate} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div className="label">
                  {phases.reduce((s, p) => s + p.weeks, 0)} weeks total across {phases.length} phases
                </div>
                <button type="button" className="btn btn-ghost" style={{ fontSize: 11 }} onClick={() => setStep(1)}>
                  ← Edit Details
                </button>
              </div>

              {phases.map((phase, i) => (
                <PhaseCard
                  key={phase.id}
                  phase={phase}
                  index={i}
                  total={phases.length}
                  onChange={updated => updatePhase(i, updated)}
                  onDelete={() => deletePhase(i)}
                />
              ))}

              <button
                type="button"
                className="btn btn-ghost"
                style={{ width: '100%', marginBottom: 16, fontSize: 12 }}
                onClick={addPhase}
              >
                + Add Phase
              </button>

              <div style={{ marginBottom: 16 }}>
                <div className="label" style={{ marginBottom: 6 }}>Plan Notes (coach only)</div>
                <textarea
                  className="input"
                  rows={2}
                  style={{ resize: 'vertical' }}
                  placeholder="Overall notes for this plan…"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              {error && (
                <div style={{ color: 'var(--danger)', fontSize: 12, marginBottom: 12 }}>{error}</div>
              )}

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={saving}
                  onClick={() => handleSave('draft')}
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={saving || phases.length === 0}
                  onClick={() => handleSave('approved')}
                >
                  {saving ? 'Saving…' : '✓ Approve & Share with Client'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Plan summary card ────────────────────────────────────────────────────────

const STATUS_COLORS = {
  draft:     { color: 'var(--muted)',   bg: 'var(--s3)' },
  approved:  { color: 'var(--accent)',  bg: 'var(--accent-dim)' },
  active:    { color: '#60a5fa',        bg: 'rgba(96,165,250,.12)' },
  completed: { color: 'var(--muted)',   bg: 'var(--s3)' },
}

function PlanCard({ plan, onOpen }) {
  const eventDef   = EVENT_TYPES.find(e => e.value === plan.event_type)
  const daysAway   = daysBetween(new Date().toISOString().split('T')[0], plan.event_date)
  const totalWeeks = (plan.phases || []).reduce((s, p) => s + p.weeks, 0)
  const sc         = STATUS_COLORS[plan.status] || STATUS_COLORS.draft
  const clientName = plan.profiles?.full_name || '—'

  return (
    <div
      className="card"
      style={{ padding: '16px 18px', cursor: 'pointer' }}
      onClick={() => onOpen(plan)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 18, marginBottom: 4 }}>{eventDef?.icon || '🏆'}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 1, color: 'var(--white)' }}>
            {plan.event_name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            {clientName} · {formatEventDate(plan.event_date)}
          </div>
        </div>
        <span style={{
          fontSize: 8, fontFamily: 'var(--font-display)', letterSpacing: 1,
          padding: '3px 8px', borderRadius: 4,
          background: sc.bg, color: sc.color, border: `1px solid ${sc.color}44`,
        }}>{plan.status.toUpperCase()}</span>
      </div>

      <PlanTimeline phases={plan.phases || []} eventDate={plan.event_date} compact />

      <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 10, color: 'var(--muted)' }}>
        <span>{(plan.phases || []).length} phases</span>
        <span>{totalWeeks}w total</span>
        <span style={{ color: daysAway > 0 ? 'var(--accent)' : 'var(--muted)' }}>
          {daysAway > 0 ? `${daysAway}d to go` : daysAway === 0 ? 'Today!' : 'Past'}
        </span>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PeriodisationPlanner() {
  const { user }      = useAuth()
  const { clients }   = useCoach()
  const [plans, setPlans]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)
  const [filter, setFilter]         = useState('all')

  useEffect(() => {
    if (!user?.id) return
    getEventPlansForCoach(user.id).then(({ data }) => {
      setPlans(data || [])
      setLoading(false)
    })
  }, [user?.id])

  function handleSaved(plan) {
    setPlans(ps => {
      const idx = ps.findIndex(p => p.id === plan.id)
      return idx >= 0 ? ps.map((p, i) => i === idx ? plan : p) : [plan, ...ps]
    })
    setShowModal(false)
    setEditingPlan(null)
  }

  async function handleDelete(planId) {
    if (!confirm('Delete this plan? The client will no longer see it.')) return
    await deleteEventPlan(planId)
    setPlans(ps => ps.filter(p => p.id !== planId))
    setEditingPlan(null)
  }

  async function handleStatusChange(plan, status) {
    const { data } = await upsertEventPlan({ ...plan, status })
    if (data) setPlans(ps => ps.map(p => p.id === data.id ? data : p))
  }

  const filtered = filter === 'all'
    ? plans
    : plans.filter(p => p.status === filter)

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Periodisation</div>
          <div className="page-subtitle">
            Build 6–12 month event plans for clients. Generate phase structure, assign templates, approve to share.
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setEditingPlan(null); setShowModal(true) }}
        >
          + New Plan
        </button>
      </div>

      {/* Filter tabs */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {['all','draft','approved','active','completed'].map(f => (
          <div
            key={f}
            className={`tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? `All (${plans.length})` : f.charAt(0).toUpperCase() + f.slice(1)}
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 14 }}>
          {[1,2,3].map(i => <div key={i} className="card" style={{ height: 140, opacity: 0.4 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 1, color: 'var(--muted)', marginBottom: 8 }}>
            NO PLANS YET
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>
            Create a periodised plan for a client targeting a specific event.
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Create First Plan
          </button>
        </div>
      ) : (
        <>
          {/* Plan detail view if editing */}
          {editingPlan && (
            <div style={{ marginBottom: 24 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                marginBottom: 16, padding: '14px 18px',
                background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 10,
              }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ fontSize: 11 }}
                  onClick={() => setEditingPlan(null)}
                >← Back</button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 1 }}>
                    {editingPlan.event_name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {editingPlan.profiles?.full_name} · {formatEventDate(editingPlan.event_date)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {editingPlan.status === 'draft' && (
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: 11 }}
                      onClick={() => handleStatusChange(editingPlan, 'approved')}
                    >✓ Approve</button>
                  )}
                  {editingPlan.status === 'approved' && (
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 11, color: '#60a5fa' }}
                      onClick={() => handleStatusChange(editingPlan, 'active')}
                    >Mark Active</button>
                  )}
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 11 }}
                    onClick={() => { setShowModal(true) }}
                  >Edit</button>
                  <button
                    className="btn btn-ghost"
                    style={{ fontSize: 11, color: 'var(--danger)' }}
                    onClick={() => handleDelete(editingPlan.id)}
                  >Delete</button>
                </div>
              </div>

              <PlanTimeline phases={editingPlan.phases} eventDate={editingPlan.event_date} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 10 }}>
                {(editingPlan.phases || []).map((p, i) => {
                  const today = new Date().toISOString().split('T')[0]
                  const isCurrent = today >= p.start_date && today <= p.end_date
                  const isPast = today > p.end_date
                  return (
                    <div key={p.id} style={{
                      padding: '14px 16px', borderRadius: 8,
                      border: `1px solid ${isCurrent ? p.color + '66' : 'var(--border)'}`,
                      borderLeft: `4px solid ${p.color}`,
                      background: isCurrent ? `${p.color}10` : 'var(--s2)',
                      opacity: isPast ? 0.6 : 1,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', background: p.color, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-display)', fontSize: 8, color: '#000',
                        }}>{i + 1}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1, color: 'var(--white)' }}>
                          {p.label}
                        </div>
                        {isCurrent && (
                          <span style={{
                            fontSize: 7, fontFamily: 'var(--font-display)', letterSpacing: 1,
                            padding: '1px 5px', borderRadius: 3,
                            background: 'var(--accent-dim)', color: 'var(--accent)',
                          }}>NOW</span>
                        )}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>
                        {p.weeks}w · {formatEventDate(p.start_date)}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.4 }}>{p.description}</div>
                      {p.suggested_template_id && (
                        <div style={{ marginTop: 6, fontSize: 9, color: 'var(--accent)' }}>
                          Template: {p.suggested_template_id}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Plan grid */}
          {!editingPlan && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 14 }}>
              {filtered.map(plan => (
                <PlanCard key={plan.id} plan={plan} onOpen={p => setEditingPlan(p)} />
              ))}
            </div>
          )}
        </>
      )}

      {(showModal || (editingPlan && showModal)) && (
        <PlanModal
          clients={clients}
          initialPlan={editingPlan || null}
          onClose={() => { setShowModal(false) }}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
