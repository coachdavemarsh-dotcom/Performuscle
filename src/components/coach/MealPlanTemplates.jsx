import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import {
  getMealPlanTemplates,
  upsertMealPlanTemplate,
  deleteMealPlanTemplate,
  getCoachClients,
  getRecipes,
  upsertMealPlan,
} from '../../lib/supabase.js'
import { supabase } from '../../lib/supabase.js'
import { PSMF_PROTOCOL } from '../../data/psmfData.js'

// ─── Constants ────────────────────────────────────────────────────────────────
const DAY_TYPES = [
  { key: 'training',  label: 'Training Day',  color: '#00C896' },
  { key: 'moderate',  label: 'Moderate Day',  color: '#9b59f5' },
  { key: 'rest',      label: 'Rest Day',      color: '#5e5e70' },
]
const MEAL_SLOTS = ['breakfast', 'lunch', 'dinner', 'snacks']
const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks' }

const CATEGORIES = [
  { key: 'all',         label: 'All',         color: 'var(--accent)' },
  { key: 'cut',         label: '🔥 Cut',       color: '#ff5e5e' },
  { key: 'bulk',        label: '💪 Bulk',      color: '#9b59f5' },
  { key: 'maintenance', label: '⚖️ Maintain',  color: '#00C896' },
  { key: 'standard',   label: '📋 Standard',  color: '#5e5e70' },
  { key: 'psmf',       label: '⚡ PSMF',       color: '#ffad00' },
]

const CAT_COLORS = {
  cut: '#ff5e5e', bulk: '#9b59f5', maintenance: '#00C896',
  standard: '#5e5e70', psmf: '#ffad00',
}

const DAYS_OF_WEEK = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']

function emptyDays() {
  return DAY_TYPES.reduce((acc, dt) => {
    acc[dt.key] = MEAL_SLOTS.reduce((s, slot) => { s[slot] = []; return s }, {})
    return acc
  }, {})
}

function defaultForm() {
  return { name: '', description: '', category: 'standard', days: emptyDays() }
}

function kgToLbs(kg) { return kg * 2.20462 }
function calcProtein(profile) {
  const w  = parseFloat(profile?.current_weight || 80)
  const bf = parseFloat(profile?.body_fat_pct   || 25)
  const lbm = kgToLbs(w * (1 - bf / 100))
  return Math.round(Math.max(
    PSMF_PROTOCOL.proteinCalculator.minProteinG,
    Math.min(lbm * 1.2, PSMF_PROTOCOL.proteinCalculator.maxProteinG)
  ))
}

// ─── Small helpers ─────────────────────────────────────────────────────────
function dayTotals(dayData = {}) {
  let kcal = 0, protein = 0, carbs = 0, fat = 0
  MEAL_SLOTS.forEach(slot => {
    ;(dayData[slot] || []).forEach(r => {
      kcal    += r.kcal      || 0
      protein += r.protein_g || 0
      carbs   += r.carbs_g   || 0
      fat     += r.fat_g     || 0
    })
  })
  return { kcal, protein, carbs, fat }
}

function MacroPill({ label, value, unit = 'g', color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: `${color}12`, border: `1px solid ${color}30`,
      borderRadius: 8, padding: '5px 10px', minWidth: 52,
    }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color, letterSpacing: 0.5 }}>
        {Math.round(value)}{unit}
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 8, color: 'var(--muted)', letterSpacing: 1 }}>
        {label}
      </span>
    </div>
  )
}

function Toast({ message, color }) {
  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
      background: color || 'var(--accent)', color: '#fff',
      padding: '10px 20px', borderRadius: 10, fontSize: 13,
      fontFamily: 'var(--font-body)', zIndex: 9999, whiteSpace: 'nowrap',
      boxShadow: '0 4px 20px rgba(0,0,0,.25)',
    }}>
      {message}
    </div>
  )
}

// ─── Recipe Search Dropdown ────────────────────────────────────────────────
function RecipeSearch({ recipes, onSelect, onClose }) {
  const [q, setQ] = useState('')
  const filtered = recipes.filter(r =>
    !q || r.name.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 30)

  return (
    <div style={{
      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
      background: 'var(--white)', border: '1px solid var(--border)',
      borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,.15)',
      overflow: 'hidden', marginTop: 4,
    }}>
      <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)' }}>
        <input
          autoFocus
          className="input input-sm"
          placeholder="Search recipes…"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ maxHeight: 220, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '14px', textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
            No recipes found
          </div>
        ) : filtered.map(r => (
          <button
            key={r.id}
            onClick={() => onSelect(r)}
            style={{
              width: '100%', padding: '8px 12px', background: 'none',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: '1px solid var(--border)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--s2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <span style={{ fontSize: 12, color: 'var(--ink)', fontFamily: 'var(--font-body)' }}>
              {r.name}
            </span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>
              {r.kcal} kcal · {r.protein_g}g P
            </span>
          </button>
        ))}
      </div>
      <div style={{ padding: '8px 10px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={onClose}
          style={{ fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

// ─── PSMF Assign Modal ─────────────────────────────────────────────────────
function PSMFAssignModal({ clients, onClose, onSave }) {
  const [clientId, setClientId] = useState('')
  const [profile, setProfile]   = useState(null)
  const [saving, setSaving]     = useState(false)
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    start_date:       today,
    duration_weeks:   2,
    protein_target_g: 150,
    refeed_days:      ['saturday'],
    coach_notes:      '',
  })

  useEffect(() => {
    if (!clientId) { setProfile(null); return }
    const found = clients.find(c => c.id === clientId)
    if (found) {
      setProfile(found)
      setForm(prev => ({ ...prev, protein_target_g: calcProtein(found) }))
    }
  }, [clientId, clients])

  function toggle(day) {
    setForm(prev => ({
      ...prev,
      refeed_days: prev.refeed_days.includes(day)
        ? prev.refeed_days.filter(d => d !== day)
        : [...prev.refeed_days, day],
    }))
  }

  async function handleSave() {
    if (!clientId) return
    setSaving(true)
    await onSave(clientId, form)
    setSaving(false)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9000, padding: 16,
    }}>
      <div style={{
        background: 'var(--white)', borderRadius: 14,
        width: '100%', maxWidth: 480,
        maxHeight: '90vh', overflowY: 'auto',
        border: '1px solid var(--border)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(255,173,0,.06)',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 1, color: '#ffad00' }}>
              ASSIGN PSMF PROTOCOL
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              Protein Sparing Modified Fast
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Client picker */}
          <div>
            <label className="label">Select Client</label>
            <select
              className="select"
              value={clientId}
              onChange={e => setClientId(e.target.value)}
            >
              <option value="">— Choose a client —</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.full_name || c.email}
                </option>
              ))}
            </select>
          </div>

          {profile && (
            <div style={{
              background: 'rgba(255,173,0,.08)', border: '1px solid rgba(255,173,0,.3)',
              borderRadius: 8, padding: '10px 14px', fontSize: 11, color: 'var(--muted)',
            }}>
              🧮 {profile.current_weight}kg · {profile.body_fat_pct}% BF →{' '}
              <strong style={{ color: '#ffad00' }}>{calcProtein(profile)}g protein/day</strong>
            </div>
          )}

          {/* Start + duration */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 140px' }}>
              <label className="label">Start Date</label>
              <input type="date" className="input" value={form.start_date}
                onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} />
            </div>
            <div style={{ flex: '1 1 140px' }}>
              <label className="label">Duration</label>
              <select className="select" value={form.duration_weeks}
                onChange={e => setForm(p => ({ ...p, duration_weeks: Number(e.target.value) }))}>
                <option value={1}>1 Week</option>
                <option value={2}>2 Weeks (Recommended)</option>
                <option value={3}>3 Weeks</option>
                <option value={4}>4 Weeks</option>
              </select>
            </div>
          </div>

          {/* Protein target */}
          <div>
            <label className="label">
              Daily Protein Target (g)
              {profile && (
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 10, marginLeft: 8, padding: '2px 8px' }}
                  onClick={() => setForm(p => ({ ...p, protein_target_g: calcProtein(profile) }))}
                >
                  Reset to calculated
                </button>
              )}
            </label>
            <input
              type="number" className="input" min={60} max={300} step={5}
              value={form.protein_target_g}
              onChange={e => setForm(p => ({ ...p, protein_target_g: Number(e.target.value) }))}
            />
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
              ≈ {form.protein_target_g * 4} kcal/day from protein
            </div>
          </div>

          {/* Refeed days */}
          <div>
            <label className="label">Refeed Days <span style={{ fontWeight: 'normal', fontSize: 10, color: 'var(--muted)' }}>(Higher-carb 100–150g)</span></label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              {DAYS_OF_WEEK.map(day => {
                const sel = form.refeed_days.includes(day)
                return (
                  <button key={day} onClick={() => toggle(day)} style={{
                    fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1,
                    padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
                    border: `1px solid ${sel ? '#ffad00' : 'var(--border)'}`,
                    background: sel ? 'rgba(255,173,0,.2)' : 'transparent',
                    color: sel ? '#ffad00' : 'var(--muted)',
                    transition: 'all .15s',
                  }}>
                    {day.slice(0, 3).toUpperCase()}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Coach notes */}
          <div>
            <label className="label">Notes / Instructions to Client</label>
            <textarea className="input" rows={3}
              placeholder="e.g. Hit your protein target every day. Message me if you get heart palpitations."
              value={form.coach_notes}
              onChange={e => setForm(p => ({ ...p, coach_notes: e.target.value }))}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Warning */}
          <div style={{
            background: 'rgba(217,119,6,.1)', border: '1px solid rgba(217,119,6,.4)',
            borderRadius: 8, padding: '10px 14px', fontSize: 11, color: 'var(--warn)',
            display: 'flex', gap: 8,
          }}>
            <span>⚠️</span>
            <span>Confirm client has no contraindications (pregnancy, T1D, kidney disease, eating disorder history, cardiac arrhythmia, under 18, underweight). Discuss electrolytes before starting.</span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={onClose} disabled={saving}>Cancel</button>
            <button
              className="btn btn-sm"
              style={{ background: '#ffad00', color: '#111', border: 'none', opacity: (!clientId || saving) ? 0.5 : 1 }}
              onClick={handleSave}
              disabled={!clientId || saving}
            >
              {saving ? 'Assigning…' : 'Assign Protocol'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Assign Template Modal ─────────────────────────────────────────────────
function AssignModal({ template, clients, onClose, onAssign }) {
  const [clientId, setClientId] = useState('')
  const [assigning, setAssigning] = useState(false)

  async function handle() {
    if (!clientId) return
    setAssigning(true)
    await onAssign(clientId, template)
    setAssigning(false)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9000, padding: 16,
    }}>
      <div style={{
        background: 'var(--white)', borderRadius: 14,
        width: '100%', maxWidth: 400,
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 1, color: 'var(--ink)' }}>
              ASSIGN MEAL PLAN
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{template.name}</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Select Client</label>
            <select className="select" value={clientId} onChange={e => setClientId(e.target.value)}>
              <option value="">— Choose a client —</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.full_name || c.email}</option>
              ))}
            </select>
          </div>

          <div style={{
            background: 'var(--s2)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '10px 14px', fontSize: 11, color: 'var(--muted)',
          }}>
            This will replace the client's current active meal plan with this template.
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={onClose} disabled={assigning}>Cancel</button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handle}
              disabled={!clientId || assigning}
              style={{ opacity: (!clientId || assigning) ? 0.5 : 1 }}
            >
              {assigning ? 'Assigning…' : 'Assign to Client'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Template Editor ───────────────────────────────────────────────────────
function TemplateEditor({ initial, recipes, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || defaultForm())
  const [openSearch, setOpenSearch] = useState(null) // { dayKey, slot }

  function addRecipe(dayKey, slot, recipe) {
    setForm(prev => {
      const updated = JSON.parse(JSON.stringify(prev))
      updated.days[dayKey][slot] = [
        ...(updated.days[dayKey][slot] || []),
        { recipe_id: recipe.id, name: recipe.name, kcal: recipe.kcal || 0,
          protein_g: recipe.protein_g || 0, carbs_g: recipe.carbs_g || 0, fat_g: recipe.fat_g || 0 },
      ]
      return updated
    })
    setOpenSearch(null)
  }

  function removeRecipe(dayKey, slot, idx) {
    setForm(prev => {
      const updated = JSON.parse(JSON.stringify(prev))
      updated.days[dayKey][slot] = updated.days[dayKey][slot].filter((_, i) => i !== idx)
      return updated
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Name + category + description */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 220px' }}>
          <label className="label">Template Name</label>
          <input
            className="input"
            placeholder="e.g. 12-Week Cut Plan"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          />
        </div>
        <div style={{ flex: '1 1 160px' }}>
          <label className="label">Category</label>
          <select
            className="select"
            value={form.category}
            onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
          >
            <option value="standard">Standard</option>
            <option value="cut">Cut</option>
            <option value="bulk">Bulk</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Description <span style={{ fontWeight: 'normal', color: 'var(--muted)', fontSize: 10 }}>(optional)</span></label>
        <input
          className="input"
          placeholder="e.g. High-protein, moderate-carb cut protocol for intermediate clients"
          value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
        />
      </div>

      {/* Day columns */}
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--muted)', letterSpacing: 1.5, marginBottom: 12 }}>
          MEAL SLOTS BY DAY TYPE
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {DAY_TYPES.map(dt => {
            const totals = dayTotals(form.days[dt.key])
            return (
              <div key={dt.key} style={{
                background: 'var(--white)', border: '1px solid var(--border)',
                borderRadius: 12, overflow: 'hidden',
              }}>
                {/* Day header */}
                <div style={{
                  padding: '12px 16px',
                  background: `${dt.color}0d`,
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexWrap: 'wrap', gap: 8,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 4, height: 16, borderRadius: 2, background: dt.color }} />
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1, color: 'var(--ink)' }}>
                      {dt.label.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <MacroPill label="KCAL" value={totals.kcal} unit=""  color={dt.color} />
                    <MacroPill label="PRO"  value={totals.protein} color="#00C896" />
                    <MacroPill label="CARB" value={totals.carbs}   color="#9b59f5" />
                    <MacroPill label="FAT"  value={totals.fat}     color="#ffad00" />
                  </div>
                </div>

                {/* Meal slots */}
                <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {MEAL_SLOTS.map(slot => {
                    const items = form.days[dt.key]?.[slot] || []
                    const isOpen = openSearch?.dayKey === dt.key && openSearch?.slot === slot
                    return (
                      <div key={slot}>
                        <div style={{
                          fontFamily: 'var(--font-display)', fontSize: 9,
                          color: 'var(--muted)', letterSpacing: 1.5, marginBottom: 6,
                        }}>
                          {MEAL_LABELS[slot].toUpperCase()}
                        </div>

                        {/* Added recipes */}
                        {items.map((item, idx) => (
                          <div key={idx} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '6px 10px', background: 'var(--s2)',
                            border: '1px solid var(--border)', borderRadius: 7, marginBottom: 4,
                          }}>
                            <div>
                              <div style={{ fontSize: 12, color: 'var(--ink)', fontFamily: 'var(--font-body)' }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                                {item.kcal} kcal · {item.protein_g}g P · {item.carbs_g}g C · {item.fat_g}g F
                              </div>
                            </div>
                            <button
                              onClick={() => removeRecipe(dt.key, slot, idx)}
                              style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--muted)', fontSize: 14, lineHeight: 1,
                                padding: '2px 4px', borderRadius: 4,
                              }}
                              onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'rgba(229,53,53,.1)' }}
                              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'none' }}
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        {/* Add recipe button */}
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={() => setOpenSearch(isOpen ? null : { dayKey: dt.key, slot })}
                            style={{
                              width: '100%', padding: '6px 10px',
                              background: 'none', border: '1px dashed var(--border)',
                              borderRadius: 7, cursor: 'pointer',
                              fontSize: 11, color: 'var(--muted)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                              transition: 'all .15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = dt.color; e.currentTarget.style.color = dt.color }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
                          >
                            + Add Recipe
                          </button>
                          {isOpen && (
                            <RecipeSearch
                              recipes={recipes}
                              onSelect={r => addRecipe(dt.key, slot, r)}
                              onClose={() => setOpenSearch(null)}
                            />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Save / cancel */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
        <button className="btn btn-ghost" onClick={onCancel} disabled={saving}>Cancel</button>
        <button
          className="btn btn-primary"
          onClick={() => onSave(form)}
          disabled={!form.name.trim() || saving}
          style={{ opacity: (!form.name.trim() || saving) ? 0.5 : 1 }}
        >
          {saving ? 'Saving…' : 'Save Template'}
        </button>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function MealPlanTemplates() {
  const { profile } = useAuth()
  const coachId = profile?.id

  const [templates,   setTemplates]   = useState([])
  const [clients,     setClients]     = useState([])
  const [recipes,     setRecipes]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [catFilter,   setCatFilter]   = useState('all')
  const [editing,     setEditing]     = useState(false)   // null | template
  const [saving,      setSaving]      = useState(false)
  const [deleteId,    setDeleteId]    = useState(null)
  const [assignTpl,   setAssignTpl]   = useState(null)    // template to assign
  const [psmfModal,   setPsmfModal]   = useState(false)
  const [toast,       setToast]       = useState(null)

  const showToast = (msg, color) => {
    setToast({ msg, color })
    setTimeout(() => setToast(null), 2800)
  }

  // Load data
  useEffect(() => {
    if (!coachId) return
    async function load() {
      setLoading(true)
      const [{ data: tpls }, { data: cls }, { data: rcs }] = await Promise.all([
        getMealPlanTemplates(coachId),
        getCoachClients(coachId),
        getRecipes(),
      ])
      setTemplates(tpls || [])
      setClients(cls || [])
      setRecipes(rcs || [])
      setLoading(false)
    }
    load()
  }, [coachId])

  // Save template
  async function handleSave(form) {
    setSaving(true)
    const { data, error } = await upsertMealPlanTemplate({
      id:          editing?.id || null,
      coachId,
      name:        form.name,
      description: form.description,
      category:    form.category,
      days:        form.days,
    })
    setSaving(false)
    if (error) { showToast('Error saving — try again', 'var(--danger)'); return }
    if (editing?.id) {
      setTemplates(prev => prev.map(t => t.id === data.id ? data : t))
    } else {
      setTemplates(prev => [data, ...prev])
    }
    setEditing(false)
    showToast('Template saved ✓')
  }

  // Delete template
  async function handleDelete(id) {
    const { error } = await deleteMealPlanTemplate(id, coachId)
    if (error) { showToast('Error deleting', 'var(--danger)'); return }
    setTemplates(prev => prev.filter(t => t.id !== id))
    setDeleteId(null)
    showToast('Template deleted')
  }

  // Assign meal plan template to client
  async function handleAssign(clientId, template) {
    const { error } = await upsertMealPlan({
      coachId,
      clientId,
      name: template.name,
      days: template.days,
    })
    if (error) { showToast('Error assigning — try again', 'var(--danger)'); return }
    setAssignTpl(null)
    showToast('Meal plan assigned to client ✓')
  }

  // Assign PSMF to client
  async function handlePSMFAssign(clientId, form) {
    const { error } = await supabase
      .from('profiles')
      .update({
        nutrition_protocol_type:     'psmf',
        nutrition_protocol_settings: {
          duration_weeks:   Number(form.duration_weeks),
          protein_target_g: Number(form.protein_target_g),
          refeed_days:      form.refeed_days,
          coach_notes:      form.coach_notes.trim(),
          start_date:       form.start_date,
        },
      })
      .eq('id', clientId)
    if (error) { showToast('Error assigning PSMF — try again', 'var(--danger)'); setPsmfModal(false); return }
    setPsmfModal(false)
    showToast('PSMF protocol assigned ✓', '#ffad00')
  }

  const filtered = templates.filter(t =>
    catFilter === 'all' || t.category === catFilter
  )

  if (loading) {
    return (
      <div className="page-content" style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
        <span className="spinner" />
      </div>
    )
  }

  return (
    <div className="page-content" style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      {toast && <Toast message={toast.msg} color={toast.color} />}
      {assignTpl  && <AssignModal template={assignTpl}  clients={clients} onClose={() => setAssignTpl(null)} onAssign={handleAssign} />}
      {psmfModal  && <PSMFAssignModal clients={clients} onClose={() => setPsmfModal(false)} onSave={handlePSMFAssign} />}

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: 2,
          color: 'var(--ink)', margin: 0,
        }}>
          MEAL PLAN TEMPLATES
        </h1>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, fontFamily: 'var(--font-body)' }}>
          Build reusable meal plans and assign them to clients in one click.
        </p>
      </div>

      {editing !== false ? (
        /* ── Editor view ── */
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setEditing(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              ← Back
            </button>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 1, color: 'var(--ink)',
            }}>
              {editing?.id ? 'EDIT TEMPLATE' : 'NEW TEMPLATE'}
            </div>
          </div>
          <TemplateEditor
            initial={editing?.id ? {
              name: editing.name,
              description: editing.description || '',
              category: editing.category,
              days: editing.days || emptyDays(),
            } : null}
            recipes={recipes}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
            saving={saving}
          />
        </div>
      ) : (
        /* ── List view ── */
        <>
          {/* Category filter + new button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setCatFilter(cat.key)}
                  style={{
                    fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1,
                    padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
                    border: `1px solid ${catFilter === cat.key ? cat.color : 'var(--border)'}`,
                    background: catFilter === cat.key ? `${cat.color}18` : 'transparent',
                    color: catFilter === cat.key ? cat.color : 'var(--muted)',
                    transition: 'all .15s',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setEditing({})}
              style={{ whiteSpace: 'nowrap' }}
            >
              + New Template
            </button>
          </div>

          {/* ── PSMF System Card (always visible when All or PSMF filter) ── */}
          {(catFilter === 'all' || catFilter === 'psmf') && (
            <div style={{
              background: 'rgba(255,173,0,.06)',
              border: '1px solid rgba(255,173,0,.3)',
              borderRadius: 14, padding: 20, marginBottom: 16,
              display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap',
            }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 20 }}>⚡</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 1, color: '#ffad00' }}>
                      PSMF PROTOCOL
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1,
                      background: 'rgba(255,173,0,.2)', color: '#ffad00',
                      border: '1px solid rgba(255,173,0,.4)', borderRadius: 4,
                      padding: '2px 8px', display: 'inline-block', marginTop: 2,
                    }}>
                      SYSTEM TEMPLATE
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6, margin: 0 }}>
                  Protein Sparing Modified Fast — rapid fat loss while preserving lean muscle mass.
                  Very low calorie (protein only) with strategic refeed days.
                  Recommended 2-week cycles with a maintenance break.
                </p>
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {['~500–800 kcal/day', 'Protein only', 'Weekly refeed', '2-week cycles'].map(tag => (
                    <span key={tag} style={{
                      fontSize: 10, fontFamily: 'var(--font-body)',
                      background: 'rgba(255,173,0,.12)', color: '#ffad00',
                      border: '1px solid rgba(255,173,0,.3)',
                      borderRadius: 20, padding: '2px 10px',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button
                className="btn btn-sm"
                style={{ background: '#ffad00', color: '#111', border: 'none', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)', letterSpacing: 1 }}
                onClick={() => setPsmfModal(true)}
              >
                Assign to Client →
              </button>
            </div>
          )}

          {/* ── Template grid ── */}
          {filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '48px 20px',
              border: '1px dashed var(--border)', borderRadius: 14,
            }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--muted)', letterSpacing: 1 }}>
                NO TEMPLATES YET
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, marginBottom: 16, fontFamily: 'var(--font-body)' }}>
                Create your first reusable meal plan template
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setEditing({})}>
                + New Template
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map(tpl => {
                const color = CAT_COLORS[tpl.category] || 'var(--accent)'
                const trainingTotals = dayTotals(tpl.days?.training)
                const isDeleting = deleteId === tpl.id
                return (
                  <div key={tpl.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{
                      padding: '14px 18px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      flexWrap: 'wrap', gap: 10,
                    }}>
                      {/* Left: name + meta */}
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <div style={{ width: 4, height: 18, borderRadius: 2, background: color }} />
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 0.5, color: 'var(--ink)' }}>
                            {tpl.name}
                          </span>
                          <span style={{
                            fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1,
                            background: `${color}18`, color, border: `1px solid ${color}40`,
                            borderRadius: 4, padding: '2px 7px',
                          }}>
                            {tpl.category.toUpperCase()}
                          </span>
                        </div>
                        {tpl.description && (
                          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-body)', marginBottom: 6 }}>
                            {tpl.description}
                          </div>
                        )}
                        {/* Training day macro preview */}
                        {trainingTotals.kcal > 0 && (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {[
                              { l: 'KCAL', v: trainingTotals.kcal, u: '', c: color },
                              { l: 'PRO',  v: trainingTotals.protein, u: 'g', c: '#00C896' },
                              { l: 'CARB', v: trainingTotals.carbs,   u: 'g', c: '#9b59f5' },
                              { l: 'FAT',  v: trainingTotals.fat,     u: 'g', c: '#ffad00' },
                            ].map(m => (
                              <div key={m.l} style={{ fontSize: 10, color: 'var(--muted)' }}>
                                <span style={{ color: m.c, fontFamily: 'var(--font-display)' }}>
                                  {Math.round(m.v)}{m.u}
                                </span>
                                {' '}{m.l}
                              </div>
                            ))}
                            <span style={{ fontSize: 10, color: 'var(--muted)' }}>· Training Day</span>
                          </div>
                        )}
                      </div>

                      {/* Right: actions */}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setAssignTpl(tpl)}
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          Assign →
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setEditing(tpl)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => setDeleteId(isDeleting ? null : tpl.id)}
                          style={{
                            background: isDeleting ? 'var(--danger)' : 'var(--danger)12',
                            color: isDeleting ? '#fff' : 'var(--danger)',
                            border: '1px solid var(--danger)40',
                          }}
                        >
                          {isDeleting ? 'Confirm?' : 'Delete'}
                        </button>
                        {isDeleting && (
                          <button className="btn btn-ghost btn-sm" onClick={() => setDeleteId(null)}>
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Confirm delete strip */}
                    {isDeleting && (
                      <div style={{
                        padding: '8px 18px', background: 'rgba(229,53,53,.06)',
                        borderTop: '1px solid var(--danger)30',
                        fontSize: 11, color: 'var(--danger)', fontFamily: 'var(--font-body)',
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        ⚠️ This will permanently delete "{tpl.name}". This cannot be undone.
                        <button
                          className="btn btn-sm"
                          style={{ marginLeft: 'auto', background: 'var(--danger)', color: '#fff', border: 'none' }}
                          onClick={() => handleDelete(tpl.id)}
                        >
                          Yes, Delete
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
