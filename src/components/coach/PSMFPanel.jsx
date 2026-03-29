import { useState, useMemo } from 'react'
import { supabase } from '../../lib/supabase.js'
import { PSMF_PROTOCOL } from '../../data/psmfData.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function kgToLbs(kg) { return kg * 2.20462 }

function calcDefaultProtein(profile) {
  const weight = parseFloat(profile?.current_weight || 80)
  const bf = parseFloat(profile?.body_fat_pct || 25)
  const lbmKg = weight * (1 - bf / 100)
  const lbmLbs = kgToLbs(lbmKg)
  const proteinG = Math.round(
    Math.max(
      PSMF_PROTOCOL.proteinCalculator.minProteinG,
      Math.min(lbmLbs * 1.2, PSMF_PROTOCOL.proteinCalculator.maxProteinG)
    )
  )
  return { proteinG, lbmKg: lbmKg.toFixed(1), lbmLbs: lbmLbs.toFixed(1), weight, bf }
}

function fmt(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function weeksAndDaysFromStart(startDateStr) {
  if (!startDateStr) return null
  const start = new Date(startDateStr)
  const today = new Date()
  const totalDays = Math.floor((today - start) / (1000 * 60 * 60 * 24))
  if (totalDays < 0) return { started: false, totalDays: 0, weeks: 0, days: 0 }
  const weeks = Math.floor(totalDays / 7)
  const days = totalDays % 7
  return { started: true, totalDays, weeks, days }
}

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ active }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-display)',
      fontSize: 9,
      letterSpacing: '0.1em',
      color: active ? 'var(--accent)' : 'var(--muted)',
      background: active ? 'var(--accent)15' : 'var(--s3)',
      border: `1px solid ${active ? 'var(--accent)40' : 'var(--border)'}`,
      borderRadius: 5,
      padding: '3px 9px',
    }}>
      <div style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: active ? 'var(--accent)' : 'var(--muted)',
      }} />
      {active ? 'ACTIVE' : 'INACTIVE'}
    </div>
  )
}

// ─── PSMFPanel ────────────────────────────────────────────────────────────────
export default function PSMFPanel({ clientId, clientProfile, onUpdated }) {
  const isActive = clientProfile?.nutrition_protocol_type === 'psmf'
  const existingSettings = clientProfile?.nutrition_protocol_settings || {}

  const defaultProtein = useMemo(() => calcDefaultProtein(clientProfile), [clientProfile])

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [confirmRemove, setConfirmRemove] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const [formState, setFormState] = useState({
    start_date: existingSettings.start_date || today,
    duration_weeks: existingSettings.duration_weeks || 2,
    protein_target_g: existingSettings.protein_target_g || defaultProtein.proteinG,
    refeed_days: existingSettings.refeed_days || ['saturday'],
    coach_notes: existingSettings.coach_notes || '',
  })

  function updateField(key, val) {
    setFormState(prev => ({ ...prev, [key]: val }))
  }

  function toggleRefeedDay(day) {
    setFormState(prev => {
      const current = prev.refeed_days || []
      return {
        ...prev,
        refeed_days: current.includes(day)
          ? current.filter(d => d !== day)
          : [...current, day],
      }
    })
  }

  // ── Save ──
  async function handleSave() {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const { error: supaErr } = await supabase
        .from('profiles')
        .update({
          nutrition_protocol_type: 'psmf',
          nutrition_protocol_settings: {
            duration_weeks: Number(formState.duration_weeks),
            protein_target_g: Number(formState.protein_target_g),
            refeed_days: formState.refeed_days,
            coach_notes: formState.coach_notes.trim(),
            start_date: formState.start_date,
          },
        })
        .eq('id', clientId)

      if (supaErr) throw supaErr
      setSuccess('PSMF protocol assigned successfully.')
      setShowForm(false)
      if (onUpdated) onUpdated()
    } catch (err) {
      setError(err.message || 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Remove ──
  async function handleRemove() {
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const { error: supaErr } = await supabase
        .from('profiles')
        .update({
          nutrition_protocol_type: null,
          nutrition_protocol_settings: null,
        })
        .eq('id', clientId)

      if (supaErr) throw supaErr
      setSuccess('PSMF protocol removed.')
      setConfirmRemove(false)
      if (onUpdated) onUpdated()
    } catch (err) {
      setError(err.message || 'Failed to remove protocol.')
    } finally {
      setSaving(false)
    }
  }

  // ── Progress Timeline ──
  const progressInfo = useMemo(() => {
    if (!isActive) return null
    return weeksAndDaysFromStart(existingSettings.start_date)
  }, [isActive, existingSettings.start_date])

  const totalDurationDays = (existingSettings.duration_weeks || 2) * 7
  const progressPct = progressInfo?.started
    ? Math.min(100, Math.round((progressInfo.totalDays / totalDurationDays) * 100))
    : 0

  const phaseLabel = useMemo(() => {
    if (!progressInfo?.started) return 'Not started'
    if (progressInfo.weeks >= (existingSettings.duration_weeks || 2)) return 'Maintenance Break Phase'
    if (progressInfo.weeks === 1) return 'Week 2 — Peak Fat Loss'
    return 'Week 1 — Adaptation'
  }, [progressInfo, existingSettings.duration_weeks])

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>

      {/* ── Panel Header ── */}
      <div style={{
        padding: '16px 20px',
        background: isActive ? 'var(--accent)08' : 'transparent',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 14,
              color: 'var(--white)',
              letterSpacing: '0.05em',
            }}>
              PSMF PROTOCOL
            </span>
            <StatusBadge active={isActive} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>
            Protein Sparing Modified Fast
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {isActive && !showForm && (
            <>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setFormState({
                    start_date: existingSettings.start_date || today,
                    duration_weeks: existingSettings.duration_weeks || 2,
                    protein_target_g: existingSettings.protein_target_g || defaultProtein.proteinG,
                    refeed_days: existingSettings.refeed_days || ['saturday'],
                    coach_notes: existingSettings.coach_notes || '',
                  })
                  setShowForm(true)
                  setError(null)
                  setSuccess(null)
                }}
              >
                Edit Protocol
              </button>
              <button
                className="btn btn-sm"
                style={{
                  background: 'var(--danger)18',
                  border: '1px solid var(--danger)40',
                  color: 'var(--danger)',
                }}
                onClick={() => setConfirmRemove(true)}
              >
                Remove
              </button>
            </>
          )}
          {!isActive && !showForm && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setFormState({
                  start_date: today,
                  duration_weeks: 2,
                  protein_target_g: defaultProtein.proteinG,
                  refeed_days: ['saturday'],
                  coach_notes: '',
                })
                setShowForm(true)
                setError(null)
                setSuccess(null)
              }}
            >
              Assign PSMF
            </button>
          )}
          {showForm && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setShowForm(false); setError(null) }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ── Active Status Display ── */}
      {isActive && !showForm && (
        <div style={{ padding: '16px 20px' }}>

          {/* Progress bar */}
          {progressInfo?.started && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em' }}>
                  PROTOCOL PROGRESS
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.06em' }}>
                  {phaseLabel.toUpperCase()}
                </span>
              </div>
              <div style={{
                height: 6,
                background: 'var(--s3)',
                borderRadius: 3,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  background: progressPct >= 100
                    ? 'var(--info)'
                    : progressPct > 60
                    ? 'var(--warn)'
                    : 'var(--accent)',
                  borderRadius: 3,
                  transition: 'width 0.4s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                  Day {progressInfo.totalDays} of {totalDurationDays}
                </span>
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                  Week {progressInfo.weeks + 1}
                </span>
              </div>
            </div>
          )}

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
            {[
              { label: 'START DATE', value: fmt(existingSettings.start_date) },
              { label: 'DURATION', value: `${existingSettings.duration_weeks || 2} Weeks` },
              { label: 'PROTEIN TARGET', value: `${existingSettings.protein_target_g || defaultProtein.proteinG}g / day` },
              {
                label: 'REFEED DAYS',
                value: existingSettings.refeed_days?.length > 0
                  ? existingSettings.refeed_days.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')
                  : 'None set',
              },
            ].map(stat => (
              <div key={stat.label} style={{
                flex: '1 1 130px',
                background: 'var(--s2)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '10px 12px',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 8, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 4 }}>
                  {stat.label}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--white)', letterSpacing: '0.03em' }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Coach notes */}
          {existingSettings.coach_notes && (
            <div style={{
              background: 'var(--s2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '10px 14px',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 5 }}>
                COACH NOTES TO CLIENT
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{existingSettings.coach_notes}"
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Inactive Placeholder ── */}
      {!isActive && !showForm && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔥</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--muted)', letterSpacing: '0.06em', marginBottom: 4 }}>
            NO PROTOCOL ASSIGNED
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>
            Assign a PSMF protocol to this client to enable the guided programme.
          </div>
          {/* Protein estimate info */}
          <div style={{
            marginTop: 14,
            background: 'var(--s2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '10px 14px',
            display: 'inline-block',
            textAlign: 'left',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 5 }}>
              ESTIMATED PROTEIN TARGET
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--accent)', letterSpacing: '0.04em' }}>
              {defaultProtein.proteinG}g / day
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-body)', marginTop: 3 }}>
              Based on {defaultProtein.weight}kg bodyweight, {defaultProtein.bf}% BF → LBM {defaultProtein.lbmKg}kg
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm Remove ── */}
      {confirmRemove && (
        <div style={{
          padding: '16px 20px',
          background: '#e5353510',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--danger)', letterSpacing: '0.06em', marginBottom: 8 }}>
            REMOVE PSMF PROTOCOL?
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', marginBottom: 14, lineHeight: 1.5 }}>
            This will remove the PSMF assignment from this client's profile. Their guide page will revert to general information mode. This action can be undone by reassigning.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="btn btn-sm"
              style={{
                background: 'var(--danger)',
                color: '#fff',
                border: 'none',
                opacity: saving ? 0.6 : 1,
              }}
              onClick={handleRemove}
              disabled={saving}
            >
              {saving ? 'Removing…' : 'Yes, Remove Protocol'}
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setConfirmRemove(false)}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Assignment / Edit Form ── */}
      {showForm && (
        <div style={{ padding: '20px' }}>

          {/* Protein calc info */}
          <div style={{
            background: 'var(--accent)08',
            border: '1px solid var(--accent)30',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 20,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>🧮</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 3 }}>
                CALCULATED FROM CLIENT PROFILE
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>
                {defaultProtein.weight}kg bodyweight · {defaultProtein.bf}% body fat · LBM {defaultProtein.lbmKg}kg ({defaultProtein.lbmLbs}lbs)
              </div>
              <div style={{ fontSize: 12, color: 'var(--white)', fontFamily: 'var(--font-body)', marginTop: 3 }}>
                Formula: {defaultProtein.lbmLbs} lbs LBM × 1.2 = <strong style={{ color: 'var(--accent)' }}>{defaultProtein.proteinG}g protein/day</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Start date + Duration */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 160px' }}>
                <label className="label">Start Date</label>
                <input
                  type="date"
                  className="input"
                  value={formState.start_date}
                  onChange={e => updateField('start_date', e.target.value)}
                />
              </div>
              <div style={{ flex: '1 1 160px' }}>
                <label className="label">Duration</label>
                <select
                  className="select"
                  value={formState.duration_weeks}
                  onChange={e => updateField('duration_weeks', Number(e.target.value))}
                >
                  <option value={1}>1 Week</option>
                  <option value={2}>2 Weeks (Recommended)</option>
                  <option value={3}>3 Weeks (Extended — with break)</option>
                  <option value={4}>4 Weeks (Custom — specify in notes)</option>
                </select>
              </div>
            </div>

            {/* Protein target */}
            <div>
              <label className="label">
                Daily Protein Target (g)
                <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-body)', fontWeight: 'normal', marginLeft: 8 }}>
                  Calculated: {defaultProtein.proteinG}g — override if needed
                </span>
              </label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="number"
                  className="input"
                  value={formState.protein_target_g}
                  min={PSMF_PROTOCOL.proteinCalculator.minProteinG}
                  max={PSMF_PROTOCOL.proteinCalculator.maxProteinG}
                  step={5}
                  onChange={e => updateField('protein_target_g', Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => updateField('protein_target_g', defaultProtein.proteinG)}
                  style={{ flexShrink: 0, fontSize: 11 }}
                >
                  Reset to calculated
                </button>
              </div>
              {formState.protein_target_g < PSMF_PROTOCOL.proteinCalculator.minProteinG && (
                <div style={{ fontSize: 11, color: 'var(--danger)', fontFamily: 'var(--font-body)', marginTop: 4 }}>
                  Warning: Below minimum recommended ({PSMF_PROTOCOL.proteinCalculator.minProteinG}g). Increase to reduce lean mass loss risk.
                </div>
              )}
              {formState.protein_target_g > PSMF_PROTOCOL.proteinCalculator.maxProteinG && (
                <div style={{ fontSize: 11, color: 'var(--warn)', fontFamily: 'var(--font-body)', marginTop: 4 }}>
                  Note: Above typical maximum ({PSMF_PROTOCOL.proteinCalculator.maxProteinG}g). Thermogenic benefit plateaus above this.
                </div>
              )}
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-body)', marginTop: 4 }}>
                Estimated {formState.protein_target_g * 4} kcal/day from protein
                {' '}({Math.round(formState.protein_target_g / 0.31 * 10) / 10}g chicken breast equivalent)
              </div>
            </div>

            {/* Refeed days */}
            <div>
              <label className="label">
                Refeed Days
                <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-body)', fontWeight: 'normal', marginLeft: 8 }}>
                  Higher-carb days (100–150g CHO). 1–2 per week.
                </span>
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                {DAYS_OF_WEEK.map(day => {
                  const selected = formState.refeed_days.includes(day)
                  return (
                    <button
                      key={day}
                      onClick={() => toggleRefeedDay(day)}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 10,
                        letterSpacing: '0.08em',
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: `1px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                        background: selected ? 'var(--accent)20' : 'transparent',
                        color: selected ? 'var(--accent)' : 'var(--muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {day.slice(0, 3).toUpperCase()}
                    </button>
                  )
                })}
                {formState.refeed_days.length === 0 && (
                  <div style={{ fontSize: 11, color: 'var(--danger)', fontFamily: 'var(--font-body)', alignSelf: 'center' }}>
                    At least 1 refeed day recommended for hormonal reset
                  </div>
                )}
              </div>
            </div>

            {/* Coach notes */}
            <div>
              <label className="label">
                Notes / Instructions to Client
                <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-body)', fontWeight: 'normal', marginLeft: 8 }}>
                  Shown in their PSMF guide
                </span>
              </label>
              <textarea
                className="input"
                rows={3}
                placeholder="e.g. 'Focus on hitting your protein target before worrying about perfect food choices. Message me if you get heart palpitations.'"
                value={formState.coach_notes}
                onChange={e => updateField('coach_notes', e.target.value)}
                style={{ resize: 'vertical', minHeight: 70 }}
              />
            </div>

            {/* Protocol summary */}
            <div style={{
              background: 'var(--s2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '12px 16px',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 8 }}>
                PROTOCOL SUMMARY
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
                {[
                  { label: 'Start', value: fmt(formState.start_date) },
                  { label: 'PSMF Days End', value: fmt(new Date(new Date(formState.start_date).getTime() + formState.duration_weeks * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]) },
                  { label: 'Protein', value: `${formState.protein_target_g}g/day (${formState.protein_target_g * 4} kcal)` },
                  { label: 'Refeeds', value: formState.refeed_days.length > 0 ? formState.refeed_days.join(', ') : 'None' },
                  { label: 'Duration', value: `${formState.duration_weeks} week${formState.duration_weeks > 1 ? 's' : ''}` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>{item.label}:</span>
                    <span style={{ fontSize: 11, color: 'var(--white)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety reminder */}
            <div style={{
              background: '#d9770610',
              border: '1px solid #d9770640',
              borderRadius: 8,
              padding: '10px 14px',
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
              <div style={{ fontSize: 11, color: 'var(--warn)', fontFamily: 'var(--font-body)', lineHeight: 1.55 }}>
                Confirm client has no contraindications (pregnancy, T1D, kidney disease, eating disorder history, cardiac arrhythmia, under 18, underweight). Electrolyte supplementation must be discussed before the client starts.
              </div>
            </div>

            {/* Error / Success */}
            {error && (
              <div style={{
                background: '#e5353512',
                border: '1px solid #e5353540',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 12,
                color: 'var(--danger)',
                fontFamily: 'var(--font-body)',
              }}>
                {error}
              </div>
            )}

            {/* Save button */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setShowForm(false); setError(null) }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
                style={{ opacity: saving ? 0.7 : 1 }}
              >
                {saving ? 'Saving…' : isActive ? 'Update Protocol' : 'Assign PSMF Protocol'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Message ── */}
      {success && !showForm && (
        <div style={{
          padding: '12px 20px',
          background: 'var(--accent)10',
          borderTop: '1px solid var(--accent)30',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ color: 'var(--accent)', fontSize: 14 }}>✓</span>
          <span style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-body)' }}>{success}</span>
        </div>
      )}

    </div>
  )
}
