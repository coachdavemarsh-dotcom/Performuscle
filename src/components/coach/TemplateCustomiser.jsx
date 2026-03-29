import { useState, useMemo } from 'react'
import { EXERCISE_LIBRARY, EXERCISE_BY_NAME } from '../../data/exerciseLibrary.js'
import { createProgramFromTemplate } from '../../lib/supabase.js'
import { volumeByMuscleGroup } from '../../lib/calculators.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function applyCustomisations(rawSessions, swapMap, overrideMap) {
  return rawSessions.map(session => ({
    ...session,
    exercises: session.exercises.map(ex => {
      const key = `${session.day_label}::${ex.order_index}`
      const swappedName = swapMap[ex.name] ?? ex.name
      const override = overrideMap[key] ?? {}
      return {
        ...ex,
        name: swappedName,
        ...(override.set_count !== undefined && { set_count: override.set_count }),
        ...(override.rep_range !== undefined && { rep_range: override.rep_range }),
        ...(override.tempo !== undefined && { tempo: override.tempo }),
        ...(override.rest_seconds !== undefined && { rest_seconds: override.rest_seconds }),
      }
    })
  }))
}

// Shared input style
const inputStyle = {
  background: 'var(--s3)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  color: 'var(--white)',
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  padding: '4px 8px',
  width: '100%',
  boxSizing: 'border-box',
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepPills({ step, onStep }) {
  const steps = [
    { n: 1, label: 'CUSTOMISE' },
    { n: 2, label: 'VOLUME CHECK' },
    { n: 3, label: 'ASSIGN' },
  ]
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {steps.map((s, i) => (
        <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => onStep(s.n)}
            style={{
              background: step === s.n ? 'var(--accent)' : 'var(--s3)',
              border: `1px solid ${step === s.n ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 20,
              color: step === s.n ? 'var(--ink)' : 'var(--muted)',
              fontFamily: 'var(--font-display)',
              fontSize: 11,
              letterSpacing: '0.07em',
              padding: '5px 14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: step === s.n ? 'rgba(0,0,0,0.2)' : 'var(--s4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontFamily: 'var(--font-display)',
                color: step === s.n ? 'var(--ink)' : 'var(--muted)',
              }}
            >
              {s.n}
            </span>
            {s.label}
          </button>
          {i < steps.length - 1 && (
            <div style={{ width: 20, height: 1, background: 'var(--border)' }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Exercise Swap Panel ──────────────────────────────────────────────────────

function ExerciseSwapPanel({ target, onSwap, onClose }) {
  const [vectorFilter, setVectorFilter] = useState(null)

  const info = EXERCISE_BY_NAME.get(target.currentName)

  const alternatives = useMemo(() => {
    if (!info) return []
    return EXERCISE_LIBRARY.filter(ex =>
      ex.name !== target.currentName &&
      ex.movementPattern === info.movementPattern &&
      !(info.progressions || []).includes(ex.name) &&
      !(info.regressions || []).includes(ex.name) &&
      (!vectorFilter || ex.loadingVector === vectorFilter)
    )
  }, [info, target.currentName, vectorFilter])

  const vectors = [
    { key: 'bilateral', label: 'Bilateral' },
    { key: 'unilateral', label: 'Unilateral' },
    { key: 'anterior_chain', label: 'Anterior' },
    { key: 'posterior_chain', label: 'Posterior' },
  ]

  const Section = ({ title, exercises }) => {
    if (!exercises || exercises.length === 0) return null
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          letterSpacing: '0.08em',
          color: 'var(--muted)',
          marginBottom: 6,
          paddingBottom: 4,
          borderBottom: '1px solid var(--border)',
        }}>
          {title}
        </div>
        {exercises.map(name => {
          const ex = typeof name === 'string' ? { name } : name
          const exName = ex.name || ex
          return (
            <button
              key={exName}
              onClick={() => onSwap(target.currentName, exName)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                background: 'none',
                border: 'none',
                borderRadius: 6,
                color: 'var(--white)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                padding: '7px 10px',
                cursor: 'pointer',
                marginBottom: 2,
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--s3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              {exName}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div style={{
      width: '38%',
      minWidth: 260,
      background: 'var(--s3)',
      borderLeft: '1px solid var(--border)',
      borderRadius: '0 0 14px 0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Panel header */}
      <div style={{
        padding: '14px 16px 12px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--s4)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--white)', letterSpacing: '0.05em' }}>
            SWAP EXERCISE
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: 'var(--muted)',
              fontSize: 16, cursor: 'pointer', padding: '0 2px', lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--accent)', marginBottom: 8 }}>
          {target.currentName}
        </div>
        {info && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(0,200,150,0.15)',
              border: '1px solid rgba(0,200,150,0.3)',
              borderRadius: 10,
              padding: '2px 8px',
              fontSize: 10,
              color: 'var(--accent-hi)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.05em',
            }}>
              {info.movementPattern?.replace(/_/g, ' ').toUpperCase()}
            </span>
            <span style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '2px 8px',
              fontSize: 10,
              color: 'var(--muted)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.05em',
            }}>
              {info.loadingVector?.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
        )}
        {info && info.primaryMuscles && (
          <div style={{ marginTop: 6, fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>
            {info.primaryMuscles.join(', ')}
          </div>
        )}
      </div>

      {/* Vector filter */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.07em', alignSelf: 'center', marginRight: 2 }}>
          FILTER:
        </span>
        {vectors.map(v => (
          <button
            key={v.key}
            onClick={() => setVectorFilter(vectorFilter === v.key ? null : v.key)}
            style={{
              background: vectorFilter === v.key ? 'rgba(0,200,150,0.15)' : 'none',
              border: `1px solid ${vectorFilter === v.key ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 10,
              color: vectorFilter === v.key ? 'var(--accent)' : 'var(--muted)',
              fontFamily: 'var(--font-display)',
              fontSize: 9,
              letterSpacing: '0.06em',
              padding: '3px 8px',
              cursor: 'pointer',
            }}
          >
            {v.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Exercise lists */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        <Section
          title="PROGRESSIONS"
          exercises={(info?.progressions || []).map(n => ({ name: n }))}
        />
        <Section
          title="REGRESSIONS"
          exercises={(info?.regressions || []).map(n => ({ name: n }))}
        />
        <Section
          title="ALTERNATIVES (SAME PATTERN)"
          exercises={alternatives}
        />
        {!info && (
          <div style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: 12, textAlign: 'center', paddingTop: 24 }}>
            Exercise not in library — swap manually by typing in the name field.
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Step 1: Customise ────────────────────────────────────────────────────────

function Step1({ previewSessions, activeSessionIdx, setActiveSessionIdx, swapMap, overrideMap, setSwapMap, setOverrideMap, setPreviewSessions }) {
  const [swapTarget, setSwapTarget] = useState(null)

  const activeSession = previewSessions[activeSessionIdx]

  function getShortLabel(dayLabel) {
    // Remove "Day N — " prefix for tabs
    return dayLabel.replace(/^Day \w+\s*[—-]\s*/i, '').replace(/^(Day [A-Z]\s*[—-]\s*)/i, '')
  }

  function handleFieldChange(sessionIdx, exIdx, field, value) {
    const newSessions = previewSessions.map((s, si) => {
      if (si !== sessionIdx) return s
      return {
        ...s,
        exercises: s.exercises.map((ex, ei) => {
          if (ei !== exIdx) return ex
          const updated = { ...ex, [field]: field === 'set_count' || field === 'rest_seconds' ? Number(value) : value }
          return updated
        })
      }
    })
    setPreviewSessions(newSessions)

    // Update override map
    const ex = previewSessions[sessionIdx].exercises[exIdx]
    const key = `${previewSessions[sessionIdx].day_label}::${ex.order_index}`
    setOverrideMap(prev => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [field]: field === 'set_count' || field === 'rest_seconds' ? Number(value) : value }
    }))
  }

  function handleSwap(originalName, newName) {
    setSwapMap(prev => ({ ...prev, [originalName]: newName }))
    const newSessions = previewSessions.map(s => ({
      ...s,
      exercises: s.exercises.map(ex => ({
        ...ex,
        name: ex.name === originalName ? newName : ex.name,
      }))
    }))
    setPreviewSessions(newSessions)
    setSwapTarget(null)
  }

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
      {/* Main table area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Session tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', overflowX: 'auto', padding: '0 20px', flexShrink: 0 }}>
          {previewSessions.map((s, i) => (
            <button
              key={i}
              onClick={() => { setActiveSessionIdx(i); setSwapTarget(null) }}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeSessionIdx === i ? 'var(--accent)' : 'transparent'}`,
                color: activeSessionIdx === i ? 'var(--accent)' : 'var(--muted)',
                fontFamily: 'var(--font-display)',
                fontSize: 11,
                letterSpacing: '0.06em',
                padding: '10px 16px 12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                marginBottom: -1,
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {getShortLabel(s.day_label) || s.day_label}
            </button>
          ))}
        </div>

        {/* Exercise table */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {activeSession && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Group', 'Exercise', 'Sets', 'Reps', 'Tempo', 'Rest', ''].map(h => (
                    <th
                      key={h}
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 10,
                        letterSpacing: '0.07em',
                        color: 'var(--muted)',
                        textAlign: 'left',
                        padding: '0 8px 10px',
                        borderBottom: '1px solid var(--border)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeSession.exercises.map((ex, exIdx) => {
                  const originalName = Object.keys(swapMap).find(k => swapMap[k] === ex.name) || ex.name
                  const wasSwapped = swapMap[originalName] && swapMap[originalName] !== originalName
                  return (
                    <tr
                      key={exIdx}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      {/* Group */}
                      <td style={{ padding: '8px' }}>
                        {ex.superset_group ? (
                          <span style={{
                            background: 'rgba(0,200,150,0.15)',
                            border: '1px solid rgba(0,200,150,0.3)',
                            borderRadius: 10,
                            padding: '2px 8px',
                            fontSize: 11,
                            color: 'var(--accent-hi)',
                            fontFamily: 'var(--font-display)',
                            letterSpacing: '0.05em',
                            whiteSpace: 'nowrap',
                          }}>
                            {ex.superset_group}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>
                        )}
                      </td>

                      {/* Exercise name */}
                      <td style={{ padding: '8px', minWidth: 160 }}>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--white)' }}>
                          {ex.name}
                        </div>
                        {wasSwapped && (
                          <div style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: 2 }}>
                            ↔ swapped
                          </div>
                        )}
                      </td>

                      {/* Sets */}
                      <td style={{ padding: '8px', width: 60 }}>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={ex.set_count}
                          onChange={e => handleFieldChange(activeSessionIdx, exIdx, 'set_count', e.target.value)}
                          style={{ ...inputStyle, width: 52, textAlign: 'center' }}
                        />
                      </td>

                      {/* Reps */}
                      <td style={{ padding: '8px', width: 80 }}>
                        <input
                          type="text"
                          value={ex.rep_range}
                          onChange={e => handleFieldChange(activeSessionIdx, exIdx, 'rep_range', e.target.value)}
                          style={{ ...inputStyle, width: 72 }}
                        />
                      </td>

                      {/* Tempo */}
                      <td style={{ padding: '8px', width: 80 }}>
                        <input
                          type="text"
                          value={ex.tempo || ''}
                          onChange={e => handleFieldChange(activeSessionIdx, exIdx, 'tempo', e.target.value)}
                          style={{
                            ...inputStyle,
                            width: 72,
                            fontFamily: 'var(--font-display)',
                            letterSpacing: '0.1em',
                            textAlign: 'center',
                          }}
                        />
                      </td>

                      {/* Rest */}
                      <td style={{ padding: '8px', width: 80 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <input
                            type="number"
                            min="0"
                            value={ex.rest_seconds || 0}
                            onChange={e => handleFieldChange(activeSessionIdx, exIdx, 'rest_seconds', e.target.value)}
                            style={{ ...inputStyle, width: 52, textAlign: 'center' }}
                          />
                          <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)' }}>s</span>
                        </div>
                      </td>

                      {/* Swap button */}
                      <td style={{ padding: '8px', width: 80 }}>
                        <button
                          onClick={() => setSwapTarget({ sessionIdx: activeSessionIdx, exIdx, currentName: ex.name })}
                          style={{
                            background: swapTarget?.currentName === ex.name ? 'rgba(0,200,150,0.2)' : 'var(--s3)',
                            border: `1px solid ${swapTarget?.currentName === ex.name ? 'var(--accent)' : 'var(--border)'}`,
                            borderRadius: 6,
                            color: swapTarget?.currentName === ex.name ? 'var(--accent)' : 'var(--muted)',
                            fontFamily: 'var(--font-display)',
                            fontSize: 10,
                            letterSpacing: '0.06em',
                            padding: '5px 8px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          ↔ SWAP
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Swap panel */}
      {swapTarget && (
        <ExerciseSwapPanel
          target={swapTarget}
          onSwap={handleSwap}
          onClose={() => setSwapTarget(null)}
        />
      )}
    </div>
  )
}

// ─── Step 2: Volume Check ─────────────────────────────────────────────────────

function Step2({ previewSessions, template }) {
  const { volume, untracked } = useMemo(
    () => volumeByMuscleGroup(previewSessions, EXERCISE_BY_NAME),
    [previewSessions]
  )

  const maxSets = volume.reduce((m, v) => Math.max(m, v.sets), 0) || 1

  const ANTERIOR = ['Quadriceps', 'Chest', 'Biceps', 'Front Deltoid']
  const POSTERIOR = ['Hamstrings', 'Glutes', 'Lats', 'Rear Deltoid', 'Erector Spinae', 'Rhomboids', 'Traps']

  const anteriorSets = volume.filter(v => ANTERIOR.includes(v.muscle)).reduce((s, v) => s + v.total, 0)
  const posteriorSets = volume.filter(v => POSTERIOR.includes(v.muscle)).reduce((s, v) => s + v.total, 0)
  const balTotal = anteriorSets + posteriorSets || 1
  const antPct = Math.round((anteriorSets / balTotal) * 100)
  const postPct = 100 - antPct

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)', letterSpacing: '0.04em', marginBottom: 4 }}>
        WEEKLY VOLUME DISTRIBUTION
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
        Based on Week 1 sessions ({template.days_per_week} days/week)
      </div>

      {/* Bar chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {volume.map(({ muscle, sets, secondarySets }) => (
          <div key={muscle} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 120,
              textAlign: 'right',
              fontFamily: 'var(--font-display)',
              fontSize: 11,
              color: 'var(--muted)',
              letterSpacing: '0.04em',
              flexShrink: 0,
            }}>
              {muscle.toUpperCase()}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Primary bar */}
              <div style={{
                height: 8,
                borderRadius: 4,
                background: 'var(--s3)',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${(sets / maxSets) * 100}%`,
                  background: 'var(--accent)',
                  borderRadius: 4,
                  transition: 'width 0.3s ease',
                }} />
              </div>
              {/* Secondary bar */}
              {secondarySets > 0 && (
                <div style={{
                  height: 4,
                  borderRadius: 4,
                  background: 'var(--s3)',
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${(secondarySets / maxSets) * 100}%`,
                    background: 'rgba(0,200,150,0.3)',
                    borderRadius: 4,
                  }} />
                </div>
              )}
            </div>
            <div style={{
              width: 56,
              textAlign: 'right',
              fontFamily: 'var(--font-display)',
              fontSize: 12,
              color: 'var(--white)',
              flexShrink: 0,
            }}>
              {sets} <span style={{ color: 'var(--muted)', fontSize: 10 }}>sets</span>
            </div>
          </div>
        ))}
      </div>

      {/* Anterior / Posterior balance */}
      <div style={{
        background: 'var(--s3)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '14px 18px',
        marginBottom: 16,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.07em', marginBottom: 12 }}>
          ANTERIOR vs POSTERIOR BALANCE
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            flex: antPct,
            background: 'rgba(147,197,253,0.15)',
            border: '1px solid rgba(147,197,253,0.4)',
            borderRadius: 8,
            padding: '10px 14px',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#93c5fd', letterSpacing: '0.02em' }}>
              {antPct}%
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              Anterior
            </div>
          </div>
          <div style={{
            flex: postPct,
            background: 'rgba(0,200,150,0.1)',
            border: '1px solid rgba(0,200,150,0.3)',
            borderRadius: 8,
            padding: '10px 14px',
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--accent)', letterSpacing: '0.02em' }}>
              {postPct}%
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              Posterior
            </div>
          </div>
        </div>
      </div>

      {/* Untracked note */}
      {untracked.length > 0 && (
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>
          {untracked.length} exercise{untracked.length !== 1 ? 's' : ''} not in library (volume untracked): {untracked.join(', ')}
        </div>
      )}
    </div>
  )
}

// ─── Step 3: Assign ───────────────────────────────────────────────────────────

function Step3({ template, clients, swapMap, overrideMap, previewSessions, onCreated }) {
  const [progName, setProgName] = useState(template.name)
  const [totalWeeks, setTotalWeeks] = useState(template.default_weeks)
  const [assignClientId, setAssignClientId] = useState('')
  const [assignStartDate, setAssignStartDate] = useState(new Date().toISOString().split('T')[0])
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)

  async function handleCreate() {
    if (!assignClientId) { setError('Please select a client.'); return }
    setCreating(true)
    setError(null)
    try {
      const raw = template.generateSessions(totalWeeks)
      const custom = applyCustomisations(raw, swapMap, overrideMap)
      const programData = {
        client_id: assignClientId,
        name: progName,
        phase: template.phase,
        goal_type: template.goal_type,
        total_weeks: totalWeeks,
        current_week: 1,
        start_date: assignStartDate,
        is_active: true,
      }
      const { error: err } = await createProgramFromTemplate(programData, custom)
      if (err) {
        setError(err.message || String(err))
      } else {
        onCreated(progName)
      }
    } catch (e) {
      setError(e.message || 'Something went wrong.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', maxWidth: 520 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)', letterSpacing: '0.04em', marginBottom: 4 }}>
        ASSIGN TO CLIENT
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
        Customisations applied. Set a start date and select a client.
      </div>

      {error && (
        <div style={{
          background: 'rgba(220,50,50,0.15)',
          border: '1px solid rgba(220,50,50,0.4)',
          borderRadius: 8,
          padding: '10px 14px',
          color: '#f87171',
          fontSize: 13,
          fontFamily: 'var(--font-body)',
          marginBottom: 20,
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Programme name */}
        <div>
          <label style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.07em', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
            PROGRAMME NAME
          </label>
          <input
            type="text"
            value={progName}
            onChange={e => setProgName(e.target.value)}
            style={{ ...inputStyle, padding: '10px 12px', fontSize: 14 }}
          />
        </div>

        {/* Total weeks */}
        <div>
          <label style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.07em', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
            TOTAL WEEKS
          </label>
          <input
            type="number"
            min="1"
            max="52"
            value={totalWeeks}
            onChange={e => setTotalWeeks(Number(e.target.value))}
            style={{ ...inputStyle, padding: '10px 12px', fontSize: 14, width: 100 }}
          />
        </div>

        {/* Client */}
        <div>
          <label style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.07em', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
            CLIENT
          </label>
          <select
            value={assignClientId}
            onChange={e => setAssignClientId(e.target.value)}
            style={{ ...inputStyle, padding: '10px 12px', fontSize: 14 }}
          >
            <option value="">Select client…</option>
            {(clients || []).map(c => (
              <option key={c.client_id} value={c.client_id}>
                {c.client?.full_name || c.profile?.full_name || c.client_id}
              </option>
            ))}
          </select>
        </div>

        {/* Start date */}
        <div>
          <label style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.07em', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
            START DATE
          </label>
          <input
            type="date"
            value={assignStartDate}
            onChange={e => setAssignStartDate(e.target.value)}
            style={{ ...inputStyle, padding: '10px 12px', fontSize: 14 }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Main TemplateCustomiser ──────────────────────────────────────────────────

export default function TemplateCustomiser({ template, clients, onClose, onCreated }) {
  const [step, setStep] = useState(1)
  const [previewSessions, setPreviewSessions] = useState(
    () => JSON.parse(JSON.stringify(template.generateSessions(1)))
  )
  const [activeSessionIdx, setActiveSessionIdx] = useState(0)
  const [swapMap, setSwapMap] = useState({})
  const [overrideMap, setOverrideMap] = useState({})

  // Step 3 state lifted here so it persists when stepping back
  const [step3State, setStep3State] = useState({
    progName: template.name,
    totalWeeks: template.default_weeks,
    assignClientId: '',
    assignStartDate: new Date().toISOString().split('T')[0],
    creating: false,
    error: null,
  })

  async function handleCreate() {
    if (!step3State.assignClientId) {
      setStep3State(s => ({ ...s, error: 'Please select a client.' }))
      return
    }
    setStep3State(s => ({ ...s, creating: true, error: null }))
    try {
      const raw = template.generateSessions(step3State.totalWeeks)
      const custom = applyCustomisations(raw, swapMap, overrideMap)
      const programData = {
        client_id: step3State.assignClientId,
        name: step3State.progName,
        phase: template.phase,
        goal_type: template.goal_type,
        total_weeks: step3State.totalWeeks,
        current_week: 1,
        start_date: step3State.assignStartDate,
        is_active: true,
      }
      const { error: err } = await createProgramFromTemplate(programData, custom)
      if (err) {
        setStep3State(s => ({ ...s, error: err.message || String(err), creating: false }))
      } else {
        onCreated(step3State.progName)
      }
    } catch (e) {
      setStep3State(s => ({ ...s, error: e.message || 'Something went wrong.', creating: false }))
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 500,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(4px)',
      overflowY: 'auto',
      padding: '24px 16px',
      /* Push content past sidebar on desktop */
      paddingLeft: 'max(16px, calc(var(--sidebar-width) + 16px))',
    }}>
      <div style={{
        maxWidth: 1060,
        margin: '0 auto',
        background: 'var(--s2)',
        borderRadius: 14,
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        /* Fill remaining viewport height so inner panes can scroll */
        minHeight: 'calc(100vh - 48px)',
        overflow: 'hidden',
      }}>
        {/* Modal header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--s4)',
          flexShrink: 0,
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16,
              color: 'var(--white)',
              letterSpacing: '0.05em',
              marginBottom: 2,
            }}>
              {template.name.toUpperCase()}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>
              Customise before assigning
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <StepPills step={step} onStep={setStep} />
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                fontSize: 22,
                cursor: 'pointer',
                padding: '0 4px',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Step content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 460 }}>
          {step === 1 && (
            <Step1
              previewSessions={previewSessions}
              activeSessionIdx={activeSessionIdx}
              setActiveSessionIdx={setActiveSessionIdx}
              swapMap={swapMap}
              overrideMap={overrideMap}
              setSwapMap={setSwapMap}
              setOverrideMap={setOverrideMap}
              setPreviewSessions={setPreviewSessions}
            />
          )}
          {step === 2 && (
            <Step2 previewSessions={previewSessions} template={template} />
          )}
          {step === 3 && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', maxWidth: 520 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)', letterSpacing: '0.04em', marginBottom: 4 }}>
                ASSIGN TO CLIENT
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
                Customisations applied. Set a start date and select a client.
              </div>

              {step3State.error && (
                <div style={{
                  background: 'rgba(220,50,50,0.15)',
                  border: '1px solid rgba(220,50,50,0.4)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#f87171',
                  fontSize: 13,
                  fontFamily: 'var(--font-body)',
                  marginBottom: 20,
                }}>
                  {step3State.error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.07em', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                    PROGRAMME NAME
                  </label>
                  <input
                    type="text"
                    value={step3State.progName}
                    onChange={e => setStep3State(s => ({ ...s, progName: e.target.value }))}
                    style={{ ...inputStyle, padding: '10px 12px', fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.07em', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                    TOTAL WEEKS
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={step3State.totalWeeks}
                    onChange={e => setStep3State(s => ({ ...s, totalWeeks: Number(e.target.value) }))}
                    style={{ ...inputStyle, padding: '10px 12px', fontSize: 14, width: 100 }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.07em', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                    CLIENT
                  </label>
                  <select
                    value={step3State.assignClientId}
                    onChange={e => setStep3State(s => ({ ...s, assignClientId: e.target.value }))}
                    style={{ ...inputStyle, padding: '10px 12px', fontSize: 14 }}
                  >
                    <option value="">Select client…</option>
                    {(clients || []).map(c => (
                      <option key={c.client_id} value={c.client_id}>
                        {c.client?.full_name || c.profile?.full_name || c.client_id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.07em', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                    START DATE
                  </label>
                  <input
                    type="date"
                    value={step3State.assignStartDate}
                    onChange={e => setStep3State(s => ({ ...s, assignStartDate: e.target.value }))}
                    style={{ ...inputStyle, padding: '10px 12px', fontSize: 14 }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 24px',
          borderTop: '1px solid var(--border)',
          background: 'var(--s4)',
          flexShrink: 0,
        }}>
          {/* Back button */}
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  color: 'var(--muted)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 11,
                  letterSpacing: '0.07em',
                  padding: '10px 20px',
                  cursor: 'pointer',
                }}
              >
                ← BACK
              </button>
            )}
          </div>

          {/* Next / Create button */}
          <div>
            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                style={{
                  background: 'var(--accent)',
                  border: 'none',
                  borderRadius: 8,
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 11,
                  letterSpacing: '0.07em',
                  fontWeight: 700,
                  padding: '10px 24px',
                  cursor: 'pointer',
                }}
              >
                NEXT: VOLUME CHECK →
              </button>
            )}
            {step === 2 && (
              <button
                onClick={() => setStep(3)}
                style={{
                  background: 'var(--accent)',
                  border: 'none',
                  borderRadius: 8,
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 11,
                  letterSpacing: '0.07em',
                  fontWeight: 700,
                  padding: '10px 24px',
                  cursor: 'pointer',
                }}
              >
                NEXT: ASSIGN →
              </button>
            )}
            {step === 3 && (
              <button
                onClick={handleCreate}
                disabled={step3State.creating || !step3State.assignClientId}
                style={{
                  background: step3State.creating || !step3State.assignClientId
                    ? 'rgba(0,200,150,0.4)'
                    : 'var(--accent)',
                  border: 'none',
                  borderRadius: 8,
                  color: 'var(--ink)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 11,
                  letterSpacing: '0.07em',
                  fontWeight: 700,
                  padding: '10px 24px',
                  cursor: step3State.creating || !step3State.assignClientId ? 'not-allowed' : 'pointer',
                }}
              >
                {step3State.creating ? 'CREATING…' : 'CREATE PROGRAMME →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
