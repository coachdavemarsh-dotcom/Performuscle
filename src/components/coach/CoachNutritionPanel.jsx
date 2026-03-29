import { useState, useEffect, useRef, useCallback } from 'react'
import {
  getActiveNutritionPlan,
  upsertNutritionPlan,
  getNutritionLogsRange,
  getRecipes,
  upsertMealPlan,
  getActiveMealPlan,
} from '../../lib/supabase.js'
import PSMFPanel from './PSMFPanel.jsx'

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = ['Targets', 'Log History', 'Meal Plan', 'PSMF']

const DAY_TYPES = [
  { key: 'training',  label: 'Training Day' },
  { key: 'moderate',  label: 'Moderate Day' },
  { key: 'rest',      label: 'Rest Day' },
]

const MEAL_SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks']
const MEAL_SLOT_LABELS = {
  breakfast: 'Breakfast',
  lunch:     'Lunch',
  dinner:    'Dinner',
  snacks:    'Snacks',
}

const EMPTY_DAY_TARGETS = { kcal: '', protein_g: '', carbs_g: '', fat_g: '' }

function emptyDayTargets() {
  return DAY_TYPES.reduce((acc, dt) => {
    acc[dt.key] = { ...EMPTY_DAY_TARGETS }
    return acc
  }, {})
}

function emptyMealPlanDays() {
  return DAY_TYPES.reduce((acc, dt) => {
    acc[dt.key] = MEAL_SLOTS.reduce((s, slot) => {
      s[slot] = []
      return s
    }, {})
    return acc
  }, {})
}

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

function fmtDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function avg(arr, key) {
  const vals = arr.map(r => parseFloat(r[key] || 0)).filter(v => !isNaN(v))
  if (!vals.length) return 0
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toast({ message, color = 'var(--accent)' }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: color, color: '#fff',
      fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
      padding: '10px 20px', borderRadius: 8,
      boxShadow: '0 4px 16px rgba(0,0,0,.25)',
      pointerEvents: 'none',
    }}>
      {message}
    </div>
  )
}

function MacroPill({ label, value, unit = 'g', color = 'var(--muted)' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      background: `${color}18`, border: `1px solid ${color}44`,
      borderRadius: 20, padding: '2px 8px',
      fontSize: 11, fontFamily: 'var(--font-body)', color,
    }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 13 }}>{value ?? '—'}</span>
      <span style={{ opacity: 0.8 }}>{unit} {label}</span>
    </span>
  )
}

// ─── Tab: Targets ─────────────────────────────────────────────────────────────

function TargetsTab({ clientId, coachId, onUpdated }) {
  const [targets, setTargets] = useState(emptyDayTargets())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const { data } = await getActiveNutritionPlan(clientId)
      if (!cancelled && data?.day_types) {
        const populated = emptyDayTargets()
        data.day_types.forEach(dt => {
          if (populated[dt.day_type]) {
            populated[dt.day_type] = {
              kcal:      dt.kcal      ?? '',
              protein_g: dt.protein_g ?? '',
              carbs_g:   dt.carbs_g   ?? '',
              fat_g:     dt.fat_g     ?? '',
            }
          }
        })
        setTargets(populated)
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [clientId])

  function handleChange(dayKey, field, value) {
    setTargets(prev => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: value },
    }))
  }

  async function handleSave() {
    setSaving(true)
    const dayTypes = DAY_TYPES.map(dt => ({
      day_type:  dt.key,
      kcal:      parseFloat(targets[dt.key].kcal)      || 0,
      protein_g: parseFloat(targets[dt.key].protein_g) || 0,
      carbs_g:   parseFloat(targets[dt.key].carbs_g)   || 0,
      fat_g:     parseFloat(targets[dt.key].fat_g)     || 0,
    }))
    const { error } = await upsertNutritionPlan({ clientId, coachId, dayTypes })
    setSaving(false)
    if (!error) {
      setToast('Saved ✓')
      setTimeout(() => setToast(null), 2500)
      if (onUpdated) onUpdated()
    } else {
      setToast('Error saving — try again')
      setTimeout(() => setToast(null), 3000)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <span className="spinner" />
      </div>
    )
  }

  return (
    <div>
      {toast && <Toast message={toast} color={toast.startsWith('Error') ? 'var(--danger)' : 'var(--accent)'} />}

      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        {DAY_TYPES.map(dt => {
          const t = targets[dt.key]
          return (
            <div key={dt.key} className="card" style={{
              flex: 1, minWidth: 140, padding: '12px 16px',
              borderTop: '3px solid var(--accent)',
            }}>
              <div className="label" style={{ marginBottom: 6 }}>{dt.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--accent)', lineHeight: 1 }}>
                {t.kcal || '—'} <span style={{ fontSize: 13, color: 'var(--muted)' }}>kcal</span>
              </div>
              <div style={{ marginTop: 4, fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>
                {t.protein_g || '—'}g protein
              </div>
            </div>
          )
        })}
      </div>

      {/* Input columns */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        {DAY_TYPES.map(dt => (
          <div key={dt.key} style={{
            flex: 1, minWidth: 160,
            background: 'var(--white)', border: '1px solid var(--border)',
            borderRadius: 12, padding: 16,
          }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 16,
              color: 'var(--ink)', letterSpacing: 1, marginBottom: 14,
            }}>
              {dt.label}
            </div>

            {[
              { field: 'kcal',      label: 'Calories (kcal)' },
              { field: 'protein_g', label: 'Protein (g)' },
              { field: 'carbs_g',   label: 'Carbs (g)' },
              { field: 'fat_g',     label: 'Fat (g)' },
            ].map(({ field, label }) => (
              <div key={field} style={{ marginBottom: 12 }}>
                <label className="label" style={{ display: 'block', marginBottom: 4 }}>{label}</label>
                <input
                  type="number"
                  className="input input-sm"
                  min={0}
                  value={targets[dt.key][field]}
                  onChange={e => handleChange(dt.key, field, e.target.value)}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <button
        className="btn btn-primary"
        onClick={handleSave}
        disabled={saving}
        style={{ minWidth: 120 }}
      >
        {saving ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Save Targets'}
      </button>
    </div>
  )
}

// ─── Tab: Log History ─────────────────────────────────────────────────────────

function LogHistoryTab({ clientId }) {
  const [logs, setLogs]     = useState([])
  const [plan, setPlan]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const end   = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 13) // last 14 days inclusive

      const [logsRes, planRes] = await Promise.all([
        getNutritionLogsRange(clientId, isoDate(start), isoDate(end)),
        getActiveNutritionPlan(clientId),
      ])

      if (!cancelled) {
        setLogs(logsRes.data || [])
        setPlan(planRes.data || null)
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [clientId])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <span className="spinner" />
      </div>
    )
  }

  if (!logs.length) {
    return (
      <div style={{
        textAlign: 'center', padding: '48px 24px',
        color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: 14,
      }}>
        No nutrition logs in the last 14 days
      </div>
    )
  }

  // Weekly averages (all 14 days window)
  const avgKcal    = avg(logs, 'total_kcal')
  const avgProtein = avg(logs, 'total_protein_g')
  const avgCarbs   = avg(logs, 'total_carbs_g')
  const avgFat     = avg(logs, 'total_fat_g')
  const daysLogged = logs.length

  // Build target map by day_type
  const targetMap = {}
  if (plan?.day_types) {
    plan.day_types.forEach(dt => { targetMap[dt.day_type] = dt })
  }

  function kcalColor(kcal, target) {
    if (!target || !kcal) return 'var(--danger)'
    const pct = kcal / target
    if (pct >= 0.9)  return 'var(--accent)'
    if (pct >= 0.7)  return 'var(--warn)'
    return 'var(--danger)'
  }

  function kcalPct(kcal, target) {
    if (!target || !kcal) return 0
    return Math.min(100, Math.round((kcal / target) * 100))
  }

  const dayTypeBadgeColor = {
    training: 'var(--accent)',
    moderate: 'var(--info)',
    rest:     'var(--purple)',
  }

  return (
    <div>
      {/* Weekly averages card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: 1,
          color: 'var(--ink)', marginBottom: 12,
        }}>
          14-DAY AVERAGES
          <span style={{
            marginLeft: 10, fontSize: 12, fontFamily: 'var(--font-body)',
            color: 'var(--muted)', fontWeight: 400,
          }}>
            {daysLogged} / 14 days logged
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { label: 'Avg Calories', val: avgKcal, unit: 'kcal', color: 'var(--accent)' },
            { label: 'Avg Protein',  val: avgProtein, unit: 'g', color: 'var(--info)' },
            { label: 'Avg Carbs',    val: avgCarbs,   unit: 'g', color: 'var(--warn)' },
            { label: 'Avg Fat',      val: avgFat,     unit: 'g', color: 'var(--purple)' },
          ].map(({ label, val, unit, color }) => (
            <div key={label} style={{
              flex: '1 1 100px', background: `${color}10`, border: `1px solid ${color}30`,
              borderRadius: 10, padding: '10px 14px',
            }}>
              <div className="label" style={{ marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color, lineHeight: 1 }}>
                {val} <span style={{ fontSize: 12, color: 'var(--muted)' }}>{unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Day-by-day list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {logs.map(log => {
          const dt = log.day_type || null
          const target = dt ? targetMap[dt] : null
          const kcalTarget = target?.kcal
          const color = kcalColor(log.total_kcal, kcalTarget)
          const pct   = kcalPct(log.total_kcal, kcalTarget)
          const badgeColor = dt ? (dayTypeBadgeColor[dt] || 'var(--muted)') : 'var(--muted)'

          return (
            <div key={log.logged_date} style={{
              background: 'var(--white)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '12px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                {/* Date */}
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 15,
                  color: 'var(--ink)', minWidth: 70,
                }}>
                  {fmtDate(log.logged_date)}
                </span>

                {/* Day type badge */}
                {dt && (
                  <span style={{
                    fontSize: 10, fontFamily: 'var(--font-display)', letterSpacing: 0.5,
                    background: `${badgeColor}18`, border: `1px solid ${badgeColor}44`,
                    color: badgeColor, borderRadius: 20, padding: '2px 8px',
                  }}>
                    {dt.toUpperCase()}
                  </span>
                )}

                {/* Kcal */}
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 18, color, marginLeft: 'auto',
                }}>
                  {log.total_kcal ?? '—'} <span style={{ fontSize: 11, color: 'var(--muted)' }}>kcal</span>
                </span>
              </div>

              {/* Macro pills */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                <MacroPill label="P"  value={log.total_protein_g} color="var(--info)" />
                <MacroPill label="C"  value={log.total_carbs_g}   color="var(--warn)" />
                <MacroPill label="F"  value={log.total_fat_g}     color="var(--purple)" />
              </div>

              {/* Mini kcal bar */}
              {kcalTarget > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    flex: 1, height: 5, background: 'var(--border)', borderRadius: 4, overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${pct}%`, height: '100%',
                      background: color, borderRadius: 4,
                      transition: 'width .3s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                    {pct}% of {kcalTarget} target
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Recipe Search Dropdown ───────────────────────────────────────────────────

function RecipeSearchDropdown({ onSelect, onClose }) {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const debounceRef = useRef(null)
  const inputRef    = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleChange(e) {
    const val = e.target.value
    setQuery(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      if (!val.trim()) {
        setResults([])
        return
      }
      setSearching(true)
      const { data } = await getRecipes({ search: val.trim() })
      setResults((data || []).slice(0, 8))
      setSearching(false)
    }, 300)
  }

  return (
    <div style={{
      border: '1px solid var(--border-hi)', borderRadius: 8,
      background: '#fff', marginTop: 6,
      boxShadow: '0 4px 16px rgba(0,0,0,.12)',
    }}>
      <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)' }}>
        <input
          ref={inputRef}
          type="text"
          className="input input-sm"
          value={query}
          onChange={handleChange}
          placeholder="Search recipes…"
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ maxHeight: 220, overflowY: 'auto' }}>
        {searching && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 12 }}>
            <span className="spinner" style={{ width: 16, height: 16 }} />
          </div>
        )}
        {!searching && results.length === 0 && query.trim() && (
          <div style={{
            padding: '10px 14px', fontSize: 13, color: 'var(--muted)',
            fontFamily: 'var(--font-body)',
          }}>
            No recipes found
          </div>
        )}
        {!searching && results.map(r => (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%', padding: '9px 14px',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: '1px solid var(--border)',
              fontFamily: 'var(--font-body)', fontSize: 13, textAlign: 'left',
              color: 'var(--ink)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <span>{r.name}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>
              {r.kcal} kcal · {r.protein_g}g P
            </span>
          </button>
        ))}
      </div>
      <div style={{ padding: '6px 10px', borderTop: '1px solid var(--border)' }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={onClose}
          style={{ fontSize: 12 }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ─── Tab: Meal Plan ───────────────────────────────────────────────────────────

function MealPlanTab({ clientId, coachId }) {
  const [planName, setPlanName] = useState('')
  const [days, setDays]         = useState(emptyMealPlanDays())
  const [openSearch, setOpenSearch] = useState(null) // { dayKey, slot }
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [toast, setToast]       = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const { data } = await getActiveMealPlan(clientId)
      if (!cancelled && data) {
        setPlanName(data.name || '')
        setDays(data.days || emptyMealPlanDays())
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [clientId])

  function addRecipe(dayKey, slot, recipe) {
    setDays(prev => {
      const updated = JSON.parse(JSON.stringify(prev))
      updated[dayKey][slot] = [
        ...(updated[dayKey][slot] || []),
        {
          recipe_id: recipe.id,
          name:      recipe.name,
          kcal:      recipe.kcal      || 0,
          protein_g: recipe.protein_g || 0,
          carbs_g:   recipe.carbs_g   || 0,
          fat_g:     recipe.fat_g     || 0,
        },
      ]
      return updated
    })
    setOpenSearch(null)
  }

  function removeRecipe(dayKey, slot, idx) {
    setDays(prev => {
      const updated = JSON.parse(JSON.stringify(prev))
      updated[dayKey][slot] = updated[dayKey][slot].filter((_, i) => i !== idx)
      return updated
    })
  }

  function dayTotals(dayKey) {
    const slots = days[dayKey] || {}
    let kcal = 0, protein = 0, carbs = 0, fat = 0
    MEAL_SLOTS.forEach(slot => {
      ;(slots[slot] || []).forEach(r => {
        kcal    += r.kcal      || 0
        protein += r.protein_g || 0
        carbs   += r.carbs_g   || 0
        fat     += r.fat_g     || 0
      })
    })
    return { kcal, protein, carbs, fat }
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await upsertMealPlan({
      coachId, clientId,
      name: planName || 'Meal Plan',
      days,
    })
    setSaving(false)
    if (!error) {
      setToast('Saved ✓')
      setTimeout(() => setToast(null), 2500)
    } else {
      setToast('Error saving — try again')
      setTimeout(() => setToast(null), 3000)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <span className="spinner" />
      </div>
    )
  }

  return (
    <div>
      {toast && <Toast message={toast} color={toast.startsWith('Error') ? 'var(--danger)' : 'var(--accent)'} />}

      {/* Plan name */}
      <div style={{ marginBottom: 20 }}>
        <label className="label" style={{ display: 'block', marginBottom: 6 }}>Plan Name</label>
        <input
          type="text"
          className="input"
          value={planName}
          onChange={e => setPlanName(e.target.value)}
          placeholder="e.g. Week 1 Cut Plan"
          style={{ maxWidth: 320 }}
        />
      </div>

      {/* Day columns */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        {DAY_TYPES.map(dt => {
          const totals = dayTotals(dt.key)
          return (
            <div key={dt.key} style={{
              flex: 1, minWidth: 240,
              background: 'var(--white)', border: '1px solid var(--border)',
              borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: 1,
                color: 'var(--ink)', marginBottom: 14,
              }}>
                {dt.label}
              </div>

              {MEAL_SLOTS.map(slot => {
                const recipes = days[dt.key]?.[slot] || []
                const isOpen  = openSearch?.dayKey === dt.key && openSearch?.slot === slot

                return (
                  <div key={slot} style={{ marginBottom: 14 }}>
                    <div className="label" style={{ marginBottom: 6 }}>
                      {MEAL_SLOT_LABELS[slot]}
                    </div>

                    {/* Recipe items */}
                    {recipes.map((r, idx) => (
                      <div key={idx} style={{
                        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                        background: 'var(--border)', borderRadius: 6, padding: '6px 10px',
                        marginBottom: 4,
                      }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontFamily: 'var(--font-body)', fontSize: 13,
                            color: 'var(--ink)', fontWeight: 500,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {r.name}
                          </div>
                          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
                            <MacroPill label="kcal" value={r.kcal}      unit="" color="var(--accent)" />
                            <MacroPill label="P"    value={r.protein_g} color="var(--info)" />
                          </div>
                        </div>
                        <button
                          onClick={() => removeRecipe(dt.key, slot, idx)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--muted)', fontSize: 16, lineHeight: 1,
                            padding: '0 0 0 6px', flexShrink: 0, marginTop: 2,
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {/* Recipe search dropdown */}
                    {isOpen && (
                      <RecipeSearchDropdown
                        onSelect={r => addRecipe(dt.key, slot, r)}
                        onClose={() => setOpenSearch(null)}
                      />
                    )}

                    {!isOpen && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setOpenSearch({ dayKey: dt.key, slot })}
                        style={{ fontSize: 12, marginTop: 2 }}
                      >
                        + Add Recipe
                      </button>
                    )}
                  </div>
                )
              })}

              {/* Day totals */}
              <div style={{
                marginTop: 'auto', paddingTop: 12,
                borderTop: '1px solid var(--border)',
                display: 'flex', gap: 6, flexWrap: 'wrap',
              }}>
                <MacroPill label="kcal" value={totals.kcal}    unit="" color="var(--accent)" />
                <MacroPill label="P"    value={Math.round(totals.protein)} color="var(--info)" />
                <MacroPill label="C"    value={Math.round(totals.carbs)}   color="var(--warn)" />
                <MacroPill label="F"    value={Math.round(totals.fat)}     color="var(--purple)" />
              </div>
            </div>
          )
        })}
      </div>

      <button
        className="btn btn-primary"
        onClick={handleSave}
        disabled={saving}
        style={{ minWidth: 120 }}
      >
        {saving ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Save Meal Plan'}
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CoachNutritionPanel({ clientId, clientProfile, coachId, onUpdated }) {
  const [activeTab, setActiveTab] = useState('Targets')

  const tabBarStyle = {
    display: 'flex', gap: 6, flexWrap: 'wrap',
    marginBottom: 24, padding: '4px',
    background: 'var(--border)', borderRadius: 10,
    width: 'fit-content',
  }

  function tabPillStyle(tab) {
    const active = activeTab === tab
    return {
      fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 0.5,
      padding: '6px 18px', borderRadius: 7, cursor: 'pointer',
      border: 'none', outline: 'none',
      background: active ? '#fff' : 'transparent',
      color: active ? 'var(--ink)' : 'var(--muted)',
      boxShadow: active ? '0 1px 4px rgba(0,0,0,.1)' : 'none',
      transition: 'all .15s ease',
    }
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      {/* Sub-tab bar */}
      <div style={tabBarStyle}>
        {TABS.map(tab => (
          <button
            key={tab}
            style={tabPillStyle(tab)}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'Targets' && (
        <TargetsTab clientId={clientId} coachId={coachId} onUpdated={onUpdated} />
      )}

      {activeTab === 'Log History' && (
        <LogHistoryTab clientId={clientId} />
      )}

      {activeTab === 'Meal Plan' && (
        <MealPlanTab clientId={clientId} coachId={coachId} />
      )}

      {activeTab === 'PSMF' && (
        <PSMFPanel
          clientId={clientId}
          clientProfile={clientProfile}
          onUpdated={onUpdated}
        />
      )}
    </div>
  )
}
