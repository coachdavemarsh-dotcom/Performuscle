import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCoach } from '../../hooks/useCoach.js'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../hooks/useAuth.jsx'
import { PROGRAM_TEMPLATES } from '../../data/programTemplates.js'
import { createProgramFromTemplate } from '../../lib/supabase.js'

// ─── constants ────────────────────────────────────────────────────────────────

const GOAL_TYPES = [
  { value: 'cut',            label: 'Fat Loss',           color: 'var(--info)' },
  { value: 'aggressive_cut', label: 'Aggressive Cut',     color: 'var(--danger)' },
  { value: 'lean_gain',      label: 'Lean Gain',          color: 'var(--accent)' },
  { value: 'gain',           label: 'Muscle Gain',        color: 'var(--purple)' },
  { value: 'maintain',       label: 'Maintenance',        color: 'var(--warn)' },
  { value: 'recomp',         label: 'Body Recomposition', color: '#f472b6' },
]

const SET_TYPES = ['standard', 'amrap', 'drop', 'rest_pause', 'failure']

const PAIRING_LETTERS = ['', 'A', 'B', 'C', 'D', 'E', 'F']

const DAYS = ['Day A', 'Day B', 'Day C', 'Day D', 'Day E', 'Upper', 'Lower', 'Full Body', 'Push', 'Pull', 'Legs']

const PREP_CATEGORIES = ['feet', 'hips', 'shoulders', 'spine', 'integration']

const SESSION_TYPES = [
  { value: 'strength',  label: 'Strength',    icon: '💪', color: 'var(--accent)' },
  { value: 'emom',      label: 'EMOM',         icon: '⏱️', color: 'var(--purple)' },
  { value: 'amrap',     label: 'AMRAP',        icon: '🔄', color: 'var(--info)' },
  { value: 'for_time',  label: 'For Time',     icon: '⏩', color: 'var(--warn)' },
  { value: 'hyrox',     label: 'HYROX',        icon: '🏃', color: '#f472b6' },
  { value: 'mixed',     label: 'Mixed Modal',  icon: '🔀', color: 'var(--danger)' },
]

const HYROX_STATIONS = [
  { id: '1', name: 'SkiErg',            distance: '1000m', load_m: '—',       load_f: '—',       target: '' },
  { id: '2', name: 'Sled Push',         distance: '50m',   load_m: '152kg',   load_f: '102kg',   target: '' },
  { id: '3', name: 'Sled Pull',         distance: '50m',   load_m: '103kg',   load_f: '78kg',    target: '' },
  { id: '4', name: 'Burpee Broad Jump', distance: '80m',   load_m: 'BW',      load_f: 'BW',      target: '' },
  { id: '5', name: 'Rowing',            distance: '1000m', load_m: '—',       load_f: '—',       target: '' },
  { id: '6', name: 'Farmers Carry',     distance: '200m',  load_m: '2×24kg',  load_f: '2×16kg',  target: '' },
  { id: '7', name: 'Sandbag Lunges',    distance: '100m',  load_m: '20kg',    load_f: '10kg',    target: '' },
  { id: '8', name: 'Wall Balls',        distance: '100 reps', load_m: '6kg',  load_f: '4kg',     target: '' },
]

const COND_UNITS = ['reps', 'cals', 'm', 'km', 'secs', 'mins', 'rounds']

// ─── helpers ──────────────────────────────────────────────────────────────────

function goalInfo(goalType) {
  return GOAL_TYPES.find(g => g.value === goalType) || { label: goalType || '—', color: 'var(--muted)' }
}

// ─── supabase helpers (inline) ────────────────────────────────────────────────

async function fetchProgramDetail(programId) {
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*, exercises(*)')
    .eq('program_id', programId)
    .order('week_number')
    .order('day_label')
  return sessions || []
}

async function saveProgram(programId, updates) {
  return supabase.from('programs').update(updates).eq('id', programId)
}

async function createSession(programId, clientId, weekNumber, dayLabel) {
  const { data } = await supabase
    .from('sessions')
    .insert({ program_id: programId, client_id: clientId, week_number: weekNumber, day_label: dayLabel, movement_prep: [] })
    .select('*, exercises(*)')
    .single()
  return data
}

async function deleteSession(sessionId) {
  return supabase.from('sessions').delete().eq('id', sessionId)
}

async function saveExercise(exercise) {
  if (exercise.id) {
    const { id, ...rest } = exercise
    return supabase.from('exercises').update(rest).eq('id', id).select().single()
  }
  const { data } = await supabase.from('exercises').insert(exercise).select().single()
  return { data }
}

async function deleteExercise(exerciseId) {
  return supabase.from('exercises').delete().eq('id', exerciseId)
}

async function updateMovementPrep(sessionId, prepItems) {
  return supabase.from('sessions').update({ movement_prep: prepItems }).eq('id', sessionId)
}

async function saveSessionField(sessionId, updates) {
  return supabase.from('sessions').update(updates).eq('id', sessionId)
}

// ─── small components ─────────────────────────────────────────────────────────

function Chip({ label, color }) {
  return (
    <span style={{
      fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5,
      color, background: `${color}18`, border: `1px solid ${color}44`,
      borderRadius: 4, padding: '2px 8px',
    }}>
      {label}
    </span>
  )
}

function FieldRow({ label, children }) {
  return (
    <div className="input-group">
      <label className="form-label">{label}</label>
      {children}
    </div>
  )
}

// ─── exercise editor row ──────────────────────────────────────────────────────

function ExerciseRow({ exercise, sessionId, onSaved, onDeleted, orderIndex, totalExercises }) {
  const isNew = !exercise.id
  const [form, setForm] = useState({
    name: exercise.name || '',
    set_count: exercise.set_count || 3,
    rep_scheme: exercise.rep_scheme || exercise.rep_range || '',
    tempo: exercise.tempo || '',
    set_type: exercise.set_type || 'standard',
    pairing: exercise.pairing || exercise.superset_group || '',
    coach_note: exercise.coach_note || exercise.notes || '',
    video_url: exercise.video_url || '',
    order_index: orderIndex,
    session_id: sessionId,
  })
  const [expanded, setExpanded] = useState(isNew)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function quickSaveField(key, value) {
    if (!exercise.id) return
    const updated = { ...form, [key]: value }
    setForm(updated)
    const { data } = await saveExercise({ ...updated, id: exercise.id })
    if (data) onSaved(data)
  }

  function f(key) {
    return { value: form[key], onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) }
  }

  async function handleSave() {
    if (!form.name) return
    setSaving(true)
    const payload = exercise.id ? { ...form, id: exercise.id } : form
    const { data } = await saveExercise(payload)
    setSaving(false)
    if (data) { onSaved(data); setExpanded(false) }
  }

  async function handleDelete() {
    if (!exercise.id) { onDeleted(null); return }
    setDeleting(true)
    await deleteExercise(exercise.id)
    setDeleting(false)
    onDeleted(exercise.id)
  }

  const gi = goalInfo(form.set_type)

  return (
    <div style={{
      background: 'var(--s3)', borderRadius: 8,
      border: '1px solid var(--border)',
      marginBottom: 8,
      borderLeft: form.pairing ? `3px solid var(--accent)` : '3px solid var(--border)',
    }}>
      {/* Collapsed header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px' }}>
        {/* Index */}
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', minWidth: 18, textAlign: 'center', flexShrink: 0 }}>
          {orderIndex + 1}
        </div>
        {/* Pairing badge */}
        {form.pairing && (
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1,
            color: 'var(--accent)', background: 'var(--accent-dim)',
            border: '1px solid var(--border-accent)',
            borderRadius: 3, padding: '2px 6px', flexShrink: 0,
          }}>
            {form.pairing}
          </span>
        )}
        {/* Exercise name — click to expand */}
        <div
          onClick={() => setExpanded(e => !e)}
          style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 13, color: form.name ? 'var(--white)' : 'var(--muted)', cursor: 'pointer', minWidth: 0 }}
        >
          {form.name || 'New Exercise'}
          {form.tempo && <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 8 }}>{form.tempo}</span>}
        </div>
        {/* Quick rep scheme edit */}
        {!isNew && (
          <input
            className="input input-sm"
            style={{ width: 60, textAlign: 'center', padding: '4px 6px', fontSize: 11 }}
            value={form.rep_scheme}
            placeholder="reps"
            onClick={e => e.stopPropagation()}
            onChange={e => setForm(p => ({ ...p, rep_scheme: e.target.value }))}
            onBlur={e => quickSaveField('rep_scheme', e.target.value)}
            title="Rep scheme — edit inline"
          />
        )}
        {/* Quick set count stepper */}
        {!isNew && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
            <button
              onClick={e => { e.stopPropagation(); const v = Math.max(1, (form.set_count || 3) - 1); quickSaveField('set_count', v) }}
              style={{
                width: 22, height: 22, borderRadius: 4, border: '1px solid var(--border)',
                background: 'var(--s4)', color: 'var(--muted)', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontSize: 14, lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="Decrease sets"
            >−</button>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--white)',
              minWidth: 24, textAlign: 'center',
            }}>
              {form.set_count || 3}
            </div>
            <button
              onClick={e => { e.stopPropagation(); const v = Math.min(20, (form.set_count || 3) + 1); quickSaveField('set_count', v) }}
              style={{
                width: 22, height: 22, borderRadius: 4, border: '1px solid var(--border)',
                background: 'var(--s4)', color: 'var(--accent)', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontSize: 14, lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              title="Increase sets"
            >+</button>
            <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--font-display)', marginLeft: 2 }}>SETS</span>
          </div>
        )}
        {/* Expand chevron */}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          onClick={() => setExpanded(e => !e)}
          style={{ color: 'var(--muted)', transition: 'transform .2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0)', cursor: 'pointer', flexShrink: 0 }}>
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginTop: 12 }}>
            <FieldRow label="Exercise Name">
              <input className="input" placeholder="e.g. Barbell Back Squat" {...f('name')} />
            </FieldRow>
            <FieldRow label="Pairing (superset)">
              <select className="select" {...f('pairing')}>
                {PAIRING_LETTERS.map(l => (
                  <option key={l} value={l}>{l || '— Solo —'}</option>
                ))}
              </select>
            </FieldRow>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginTop: 10 }}>
            <FieldRow label="Sets">
              <input className="input" type="number" min="1" max="20" {...f('set_count')} />
            </FieldRow>
            <FieldRow label="Reps / Scheme">
              <input className="input" placeholder="e.g. 6-8 or 10" {...f('rep_scheme')} />
            </FieldRow>
            <FieldRow label="Tempo">
              <input className="input" placeholder="e.g. 4010" {...f('tempo')} />
            </FieldRow>
            <FieldRow label="Set Type">
              <select className="select" {...f('set_type')}>
                {SET_TYPES.map(t => (
                  <option key={t} value={t}>{t.replace('_', ' ')}</option>
                ))}
              </select>
            </FieldRow>
          </div>

          <div style={{ marginTop: 10 }}>
            <FieldRow label="YouTube Demo URL">
              <input className="input" placeholder="https://youtube.com/watch?v=..." {...f('video_url')} />
            </FieldRow>
          </div>

          <div style={{ marginTop: 10 }}>
            <FieldRow label="Coach Note (shown to client)">
              <textarea
                className="input"
                rows={2}
                placeholder="Cue, technique note or intention for this exercise…"
                style={{ resize: 'vertical', lineHeight: 1.6 }}
                {...f('coach_note')}
              />
            </FieldRow>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? '…' : 'DELETE'}
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving || !form.name}>
              {saving ? 'Saving…' : isNew ? 'Add Exercise' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── movement prep editor ─────────────────────────────────────────────────────

const PREP_BLANK = { id: '', category: 'integration', name: '', sets: 2, reps: '10', cue: '', progression: '', video_url: '' }

function MovementPrepEditor({ sessionId, initial = [] }) {
  const [items, setItems] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function addItem() {
    const newItem = { ...PREP_BLANK, id: `mp_${Date.now()}` }
    setItems(p => [...p, newItem])
  }

  function updateItem(id, key, val) {
    setItems(p => p.map(i => i.id === id ? { ...i, [key]: val } : i))
  }

  function removeItem(id) {
    setItems(p => p.filter(i => i.id !== id))
  }

  async function handleSave() {
    setSaving(true)
    await updateMovementPrep(sessionId, items)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          {items.length} exercises · Leave empty to use default movement prep
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={addItem}>+ Add Exercise</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Prep'}
          </button>
        </div>
      </div>

      {items.map((item, idx) => (
        <div key={item.id} style={{
          background: 'var(--s3)', borderRadius: 8, border: '1px solid var(--border)',
          padding: '12px 14px', marginBottom: 8,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto auto', gap: 8, alignItems: 'end', marginBottom: 8 }}>
            <FieldRow label="Name">
              <input className="input input-sm" placeholder="Exercise name" value={item.name}
                onChange={e => updateItem(item.id, 'name', e.target.value)} />
            </FieldRow>
            <FieldRow label="Category">
              <select className="select input-sm" value={item.category}
                onChange={e => updateItem(item.id, 'category', e.target.value)}>
                {PREP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Sets">
              <input className="input input-sm" type="number" min="1" style={{ width: 56 }}
                value={item.sets} onChange={e => updateItem(item.id, 'sets', e.target.value)} />
            </FieldRow>
            <FieldRow label="Reps / Duration">
              <input className="input input-sm" placeholder="10 or 45s" style={{ width: 80 }}
                value={item.reps} onChange={e => updateItem(item.id, 'reps', e.target.value)} />
            </FieldRow>
            <div style={{ paddingBottom: 2 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => removeItem(item.id)}
                style={{ color: 'var(--danger)', padding: '5px 8px' }}>✕</button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <FieldRow label="Coaching Cue">
              <textarea className="input input-sm" rows={2} placeholder="Cue for the client…"
                style={{ resize: 'vertical' }} value={item.cue}
                onChange={e => updateItem(item.id, 'cue', e.target.value)} />
            </FieldRow>
            <FieldRow label="Progression">
              <textarea className="input input-sm" rows={2} placeholder="When they've earned it…"
                style={{ resize: 'vertical' }} value={item.progression}
                onChange={e => updateItem(item.id, 'progression', e.target.value)} />
            </FieldRow>
          </div>
          <div style={{ marginTop: 8 }}>
            <FieldRow label="YouTube Demo URL (optional)">
              <input className="input input-sm" placeholder="https://youtube.com/watch?v=…"
                value={item.video_url} onChange={e => updateItem(item.id, 'video_url', e.target.value)} />
            </FieldRow>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: 12 }}>
          No custom prep — client will see the default movement prep sequence.
        </div>
      )}
    </div>
  )
}

// ─── shared conditioning save bar ─────────────────────────────────────────────

function CondSaveBar({ onSave, saving, saved, onReset }) {
  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
      {onReset && (
        <button className="btn btn-ghost btn-sm" onClick={onReset} style={{ color: 'var(--muted)' }}>
          Reset
        </button>
      )}
      <button className="btn btn-primary btn-sm" onClick={onSave} disabled={saving}>
        {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Workout'}
      </button>
    </div>
  )
}

// ─── EMOM builder ─────────────────────────────────────────────────────────────

function EMOMBuilder({ session }) {
  const def = { duration_mins: 20, interval_mins: 1, stations: [], coach_note: '' }
  const [cfg, setCfg] = useState({ ...def, ...(session.conditioning_config || {}) })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function addStation() {
    const n = cfg.stations.length + 1
    setCfg(p => ({ ...p, stations: [...p.stations, { id: String(Date.now()), label: `Min ${n}`, movement: '', target: '', note: '' }] }))
  }
  function updateStation(id, key, val) {
    setCfg(p => ({ ...p, stations: p.stations.map(s => s.id === id ? { ...s, [key]: val } : s) }))
  }
  function removeStation(id) {
    setCfg(p => ({ ...p, stations: p.stations.filter(s => s.id !== id) }))
  }

  async function handleSave() {
    setSaving(true)
    await saveSessionField(session.id, { conditioning_config: cfg, session_type: 'emom' })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const totalMins = cfg.duration_mins || 20
  const interval = cfg.interval_mins || 1
  const stationCount = cfg.stations.length
  const rounds = stationCount > 0 ? Math.floor(totalMins / (stationCount * interval)) : null

  return (
    <div>
      {/* Config row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, marginBottom: 16 }}>
        <div className="input-group">
          <label className="form-label">Total Duration (mins)</label>
          <input className="input" type="number" min="1" max="120" value={cfg.duration_mins}
            onChange={e => setCfg(p => ({ ...p, duration_mins: +e.target.value }))} />
        </div>
        <div className="input-group">
          <label className="form-label">Interval (every X mins)</label>
          <select className="select" value={cfg.interval_mins}
            onChange={e => setCfg(p => ({ ...p, interval_mins: +e.target.value }))}>
            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>E{n > 1 ? `${n}M` : ''}OM — Every {n} min{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--purple)', lineHeight: 1 }}>
              {rounds ?? '—'}
            </div>
            <div className="label" style={{ fontSize: 8 }}>ROUNDS</div>
          </div>
        </div>
      </div>

      {/* Station list */}
      <div className="label" style={{ marginBottom: 10 }}>
        Stations — {stationCount === 0 ? 'Add your work intervals below' : `${stationCount} station${stationCount > 1 ? 's' : ''} · repeats every ${stationCount * interval} min${stationCount * interval > 1 ? 's' : ''}`}
      </div>

      {cfg.stations.map((s, idx) => (
        <div key={s.id} style={{
          display: 'grid', gridTemplateColumns: '80px 1fr 140px 1fr 28px',
          gap: 8, alignItems: 'center', marginBottom: 8,
          padding: '10px 12px', background: 'var(--s3)', borderRadius: 8,
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--purple)',
        }}>
          <input className="input input-sm" placeholder="Min 1" value={s.label}
            onChange={e => updateStation(s.id, 'label', e.target.value)} />
          <input className="input input-sm" placeholder="Movement name…" value={s.movement}
            onChange={e => updateStation(s.id, 'movement', e.target.value)} />
          <input className="input input-sm" placeholder="Target (e.g. 15 reps)" value={s.target}
            onChange={e => updateStation(s.id, 'target', e.target.value)} />
          <input className="input input-sm" placeholder="Coaching note…" value={s.note}
            onChange={e => updateStation(s.id, 'note', e.target.value)} />
          <button onClick={() => removeStation(s.id)}
            style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
        </div>
      ))}

      <button className="btn btn-ghost btn-sm" onClick={addStation}
        style={{ width: '100%', borderStyle: 'dashed', borderColor: 'var(--purple)', color: 'var(--purple)', marginBottom: 14 }}>
        + Add Station
      </button>

      <div className="input-group">
        <label className="form-label">Coach Note</label>
        <textarea className="input" rows={2} placeholder="Pacing strategy, scaling options, intent…"
          style={{ resize: 'vertical' }} value={cfg.coach_note}
          onChange={e => setCfg(p => ({ ...p, coach_note: e.target.value }))} />
      </div>

      <CondSaveBar onSave={handleSave} saving={saving} saved={saved} />
    </div>
  )
}

// ─── AMRAP builder ────────────────────────────────────────────────────────────

function AMRAPBuilder({ session }) {
  const def = { time_cap_mins: 15, movements: [], coach_note: '' }
  const [cfg, setCfg] = useState({ ...def, ...(session.conditioning_config || {}) })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function addMovement() {
    setCfg(p => ({ ...p, movements: [...p.movements, { id: String(Date.now()), name: '', reps: '', unit: 'reps', load: '', note: '' }] }))
  }
  function updateMovement(id, key, val) {
    setCfg(p => ({ ...p, movements: p.movements.map(m => m.id === id ? { ...m, [key]: val } : m) }))
  }
  function removeMovement(id) {
    setCfg(p => ({ ...p, movements: p.movements.filter(m => m.id !== id) }))
  }

  async function handleSave() {
    setSaving(true)
    await saveSessionField(session.id, { conditioning_config: cfg, session_type: 'amrap' })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, marginBottom: 16, alignItems: 'flex-end' }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Time Cap (mins)</label>
          <input className="input" type="number" min="1" max="60" value={cfg.time_cap_mins}
            onChange={e => setCfg(p => ({ ...p, time_cap_mins: +e.target.value }))} />
        </div>
        <div style={{
          padding: '10px 16px', background: 'var(--info)0e', border: '1px solid var(--info)2a',
          borderLeft: '3px solid var(--info)', borderRadius: 6, fontSize: 12, color: 'var(--muted)',
        }}>
          As Many Rounds As Possible in <strong style={{ color: 'var(--info)' }}>{cfg.time_cap_mins} minutes</strong>.
          Complete as many full cycles of the movements below as possible.
        </div>
      </div>

      <div className="label" style={{ marginBottom: 10 }}>Movements</div>
      {cfg.movements.map((m, idx) => (
        <div key={m.id} style={{
          display: 'grid', gridTemplateColumns: '28px 1fr 80px 80px 80px 1fr 28px',
          gap: 8, alignItems: 'center', marginBottom: 8,
          padding: '10px 12px', background: 'var(--s3)', borderRadius: 8,
          border: '1px solid var(--border)', borderLeft: '3px solid var(--info)',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--info)', textAlign: 'center' }}>{idx + 1}</div>
          <input className="input input-sm" placeholder="Movement name" value={m.name}
            onChange={e => updateMovement(m.id, 'name', e.target.value)} />
          <input className="input input-sm" placeholder="Reps / dist" value={m.reps}
            onChange={e => updateMovement(m.id, 'reps', e.target.value)} />
          <select className="select input-sm" value={m.unit}
            onChange={e => updateMovement(m.id, 'unit', e.target.value)}>
            {COND_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <input className="input input-sm" placeholder="Load" value={m.load}
            onChange={e => updateMovement(m.id, 'load', e.target.value)} />
          <input className="input input-sm" placeholder="Note / scaling" value={m.note}
            onChange={e => updateMovement(m.id, 'note', e.target.value)} />
          <button onClick={() => removeMovement(m.id)}
            style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
        </div>
      ))}
      <button className="btn btn-ghost btn-sm" onClick={addMovement}
        style={{ width: '100%', borderStyle: 'dashed', borderColor: 'var(--info)', color: 'var(--info)', marginBottom: 14 }}>
        + Add Movement
      </button>

      <div className="input-group">
        <label className="form-label">Coach Note</label>
        <textarea className="input" rows={2} placeholder="Pacing, scaling, target rounds per hour…"
          style={{ resize: 'vertical' }} value={cfg.coach_note}
          onChange={e => setCfg(p => ({ ...p, coach_note: e.target.value }))} />
      </div>
      <CondSaveBar onSave={handleSave} saving={saving} saved={saved} />
    </div>
  )
}

// ─── For Time builder ─────────────────────────────────────────────────────────

function ForTimeBuilder({ session }) {
  const def = { format: 'rounds', rounds: 5, time_cap_mins: 20, movements: [], coach_note: '' }
  const [cfg, setCfg] = useState({ ...def, ...(session.conditioning_config || {}) })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function addMovement() {
    setCfg(p => ({ ...p, movements: [...p.movements, { id: String(Date.now()), name: '', reps: '', unit: 'reps', load: '', note: '' }] }))
  }
  function updateMovement(id, key, val) {
    setCfg(p => ({ ...p, movements: p.movements.map(m => m.id === id ? { ...m, [key]: val } : m) }))
  }
  function removeMovement(id) {
    setCfg(p => ({ ...p, movements: p.movements.filter(m => m.id !== id) }))
  }

  async function handleSave() {
    setSaving(true)
    await saveSessionField(session.id, { conditioning_config: cfg, session_type: 'for_time' })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const forTimeColor = 'var(--warn)'

  return (
    <div>
      {/* Format + config row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div className="input-group">
          <label className="form-label">Format</label>
          <select className="select" value={cfg.format} onChange={e => setCfg(p => ({ ...p, format: e.target.value }))}>
            <option value="rounds">Rounds (e.g. 5 Rounds For Time)</option>
            <option value="chipper">Chipper (descending list)</option>
            <option value="ladder">Ladder (ascending / descending)</option>
            <option value="21_15_9">21-15-9</option>
          </select>
        </div>
        {cfg.format === 'rounds' && (
          <div className="input-group">
            <label className="form-label">Rounds</label>
            <input className="input" type="number" min="1" max="30" value={cfg.rounds}
              onChange={e => setCfg(p => ({ ...p, rounds: +e.target.value }))} />
          </div>
        )}
        <div className="input-group">
          <label className="form-label">Time Cap (mins)</label>
          <input className="input" type="number" min="1" max="120" value={cfg.time_cap_mins}
            onChange={e => setCfg(p => ({ ...p, time_cap_mins: +e.target.value }))} />
        </div>
      </div>

      {/* Workout summary pill */}
      <div style={{
        padding: '10px 16px', marginBottom: 16,
        background: `${forTimeColor}0e`, border: `1px solid ${forTimeColor}2a`,
        borderLeft: `3px solid ${forTimeColor}`, borderRadius: 6,
        fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--sub)', letterSpacing: 0.5,
      }}>
        {cfg.format === 'rounds' ? `${cfg.rounds} Rounds For Time` : cfg.format === 'chipper' ? 'Chipper — For Time' : cfg.format === '21_15_9' ? '21-15-9 For Time' : 'Ladder For Time'}
        {cfg.time_cap_mins ? <span style={{ color: 'var(--muted)', fontSize: 10, marginLeft: 10 }}>Time cap: {cfg.time_cap_mins} min</span> : ''}
      </div>

      <div className="label" style={{ marginBottom: 10 }}>Movements</div>
      {cfg.movements.map((m, idx) => (
        <div key={m.id} style={{
          display: 'grid', gridTemplateColumns: '28px 1fr 80px 80px 80px 1fr 28px',
          gap: 8, alignItems: 'center', marginBottom: 8,
          padding: '10px 12px', background: 'var(--s3)', borderRadius: 8,
          border: '1px solid var(--border)', borderLeft: `3px solid ${forTimeColor}`,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: forTimeColor, textAlign: 'center' }}>
            {cfg.format === '21_15_9' ? ['21', '15', '9'][idx] ?? idx + 1 : idx + 1}
          </div>
          <input className="input input-sm" placeholder="Movement name" value={m.name}
            onChange={e => updateMovement(m.id, 'name', e.target.value)} />
          <input className="input input-sm" placeholder="Reps / dist" value={m.reps}
            onChange={e => updateMovement(m.id, 'reps', e.target.value)} />
          <select className="select input-sm" value={m.unit}
            onChange={e => updateMovement(m.id, 'unit', e.target.value)}>
            {COND_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <input className="input input-sm" placeholder="Load" value={m.load}
            onChange={e => updateMovement(m.id, 'load', e.target.value)} />
          <input className="input input-sm" placeholder="Note / scaling" value={m.note}
            onChange={e => updateMovement(m.id, 'note', e.target.value)} />
          <button onClick={() => removeMovement(m.id)}
            style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
        </div>
      ))}
      <button className="btn btn-ghost btn-sm" onClick={addMovement}
        style={{ width: '100%', borderStyle: 'dashed', borderColor: forTimeColor, color: forTimeColor, marginBottom: 14 }}>
        + Add Movement
      </button>

      <div className="input-group">
        <label className="form-label">Coach Note</label>
        <textarea className="input" rows={2} placeholder="Target time, pacing strategy, scaling options…"
          style={{ resize: 'vertical' }} value={cfg.coach_note}
          onChange={e => setCfg(p => ({ ...p, coach_note: e.target.value }))} />
      </div>
      <CondSaveBar onSave={handleSave} saving={saving} saved={saved} />
    </div>
  )
}

// ─── HYROX builder ────────────────────────────────────────────────────────────

const HYROX_FORMATS = [
  { value: 'full_sim', label: 'Full Simulation', description: '8 × 1km run + 8 stations' },
  { value: 'half_sim', label: 'Half Simulation', description: '4 × 1km run + 4 stations' },
  { value: 'standalone', label: 'Station Blocks', description: 'Station-only — no runs' },
  { value: 'custom', label: 'Custom Race Prep', description: 'Build your own order' },
]

function HYROXBuilder({ session }) {
  const def = {
    format: 'full_sim', gender: 'male', run_distance_m: 1000,
    target_finish_mins: 75, stations: JSON.parse(JSON.stringify(HYROX_STATIONS)),
    coach_note: '',
  }
  const [cfg, setCfg] = useState(() => {
    const saved = session.conditioning_config
    return saved && saved.stations ? saved : def
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function updateStation(id, key, val) {
    setCfg(p => ({ ...p, stations: p.stations.map(s => s.id === id ? { ...s, [key]: val } : s) }))
  }
  function addCustomStation() {
    const id = String(Date.now())
    setCfg(p => ({ ...p, stations: [...p.stations, { id, name: '', distance: '', load_m: '', load_f: '', target: '' }] }))
  }
  function removeStation(id) {
    setCfg(p => ({ ...p, stations: p.stations.filter(s => s.id !== id) }))
  }

  const stationsToShow = cfg.format === 'half_sim' ? cfg.stations.slice(0, 4) : cfg.stations

  async function handleSave() {
    setSaving(true)
    await saveSessionField(session.id, { conditioning_config: { ...cfg, stations: stationsToShow }, session_type: 'hyrox' })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      {/* Format selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
        {HYROX_FORMATS.map(f => (
          <button key={f.value} type="button" onClick={() => setCfg(p => ({ ...p, format: f.value }))} style={{
            padding: '10px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
            background: cfg.format === f.value ? '#f472b618' : 'var(--s3)',
            border: `1.5px solid ${cfg.format === f.value ? '#f472b666' : 'var(--border)'}`,
            color: cfg.format === f.value ? '#f472b6' : 'var(--muted)',
            transition: 'all .15s',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1, marginBottom: 3 }}>{f.label}</div>
            <div style={{ fontSize: 9, opacity: 0.8 }}>{f.description}</div>
          </button>
        ))}
      </div>

      {/* Meta row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        <div className="input-group">
          <label className="form-label">Athlete Gender</label>
          <select className="select" value={cfg.gender} onChange={e => setCfg(p => ({ ...p, gender: e.target.value }))}>
            <option value="male">Male (M loads)</option>
            <option value="female">Female (F loads)</option>
          </select>
        </div>
        <div className="input-group">
          <label className="form-label">Run Distance (m)</label>
          <input className="input" type="number" value={cfg.run_distance_m}
            onChange={e => setCfg(p => ({ ...p, run_distance_m: +e.target.value }))} />
        </div>
        <div className="input-group">
          <label className="form-label">Target Finish (mins)</label>
          <input className="input" type="number" value={cfg.target_finish_mins}
            onChange={e => setCfg(p => ({ ...p, target_finish_mins: +e.target.value }))} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#f472b6', lineHeight: 1.2 }}>
              {Math.floor(cfg.target_finish_mins / 60) > 0 ? `${Math.floor(cfg.target_finish_mins / 60)}h ` : ''}{cfg.target_finish_mins % 60}min
            </div>
            <div className="label" style={{ fontSize: 8 }}>TARGET TIME</div>
          </div>
        </div>
      </div>

      {/* Station cards */}
      <div className="label" style={{ marginBottom: 10 }}>
        Stations — {stationsToShow.length} stations · {cfg.format !== 'standalone' ? `${stationsToShow.length} × ${cfg.run_distance_m}m runs between each` : 'No run segments'}
      </div>

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 80px 100px 90px 28px', gap: 8, padding: '0 12px', marginBottom: 6 }}>
        {['#', 'Station', 'Distance', `Load (${cfg.gender === 'male' ? 'M' : 'F'})`, 'Target Split', ''].map(h => (
          <div key={h} style={{ fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5, color: 'var(--muted)' }}>{h}</div>
        ))}
      </div>

      {stationsToShow.map((s, idx) => (
        <div key={s.id} style={{
          display: 'grid', gridTemplateColumns: '28px 1fr 80px 100px 90px 28px',
          gap: 8, alignItems: 'center', marginBottom: 6,
          padding: '10px 12px', background: 'var(--s3)', borderRadius: 8,
          border: '1px solid var(--border)', borderLeft: '3px solid #f472b6',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: '#f472b6', textAlign: 'center' }}>{idx + 1}</div>
          <input className="input input-sm" placeholder="Station name" value={s.name}
            onChange={e => updateStation(s.id, 'name', e.target.value)} />
          <input className="input input-sm" placeholder="Dist / reps" value={s.distance}
            onChange={e => updateStation(s.id, 'distance', e.target.value)} />
          <input className="input input-sm" placeholder={cfg.gender === 'male' ? s.load_m : s.load_f}
            value={cfg.gender === 'male' ? s.load_m : s.load_f}
            onChange={e => updateStation(s.id, cfg.gender === 'male' ? 'load_m' : 'load_f', e.target.value)} />
          <input className="input input-sm" placeholder="e.g. 4:30" value={s.target}
            onChange={e => updateStation(s.id, 'target', e.target.value)} />
          {cfg.format === 'custom' ? (
            <button onClick={() => removeStation(s.id)}
              style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
          ) : <div />}
        </div>
      ))}

      {cfg.format === 'custom' && (
        <button className="btn btn-ghost btn-sm" onClick={addCustomStation}
          style={{ width: '100%', borderStyle: 'dashed', borderColor: '#f472b6', color: '#f472b6', marginBottom: 14 }}>
          + Add Station
        </button>
      )}

      <div className="input-group" style={{ marginTop: 14 }}>
        <label className="form-label">Coach Note / Race Strategy</label>
        <textarea className="input" rows={3}
          placeholder="Run pacing strategy, station targets, transitions, mental cues…"
          style={{ resize: 'vertical' }} value={cfg.coach_note}
          onChange={e => setCfg(p => ({ ...p, coach_note: e.target.value }))} />
      </div>
      <CondSaveBar onSave={handleSave} saving={saving} saved={saved}
        onReset={() => setCfg(def)} />
    </div>
  )
}

// ─── Mixed Modal builder ──────────────────────────────────────────────────────

const SEGMENT_TYPES = [
  { value: 'strength',  label: 'Strength',  color: 'var(--accent)',  icon: '💪' },
  { value: 'emom',      label: 'EMOM',       color: 'var(--purple)',  icon: '⏱️' },
  { value: 'amrap',     label: 'AMRAP',      color: 'var(--info)',    icon: '🔄' },
  { value: 'for_time',  label: 'For Time',   color: 'var(--warn)',    icon: '⏩' },
  { value: 'run',       label: 'Run / Row',  color: '#60a5fa',       icon: '🏃' },
  { value: 'rest',      label: 'Active Rest',color: 'var(--muted)',  icon: '💨' },
]

function MixedSegment({ seg, idx, onChange, onRemove }) {
  const typeInfo = SEGMENT_TYPES.find(t => t.value === seg.type) || SEGMENT_TYPES[0]
  const [open, setOpen] = useState(!seg.label)

  const label = String.fromCharCode(65 + idx) // A, B, C…

  return (
    <div style={{
      background: 'var(--s3)', borderRadius: 10, border: '1px solid var(--border)',
      borderLeft: `3px solid ${typeInfo.color}`, marginBottom: 10, overflow: 'hidden',
    }}>
      {/* Segment header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer' }}
        onClick={() => setOpen(o => !o)}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 11, color: typeInfo.color,
          background: `${typeInfo.color}18`, border: `1px solid ${typeInfo.color}44`,
          borderRadius: 4, padding: '2px 8px',
        }}>{label}</span>
        <span style={{ fontSize: 14 }}>{typeInfo.icon}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>{typeInfo.label.toUpperCase()}</span>
        <span style={{ flex: 1, fontSize: 12, color: 'var(--sub)' }}>{seg.label || '—'}</span>
        <button onClick={e => { e.stopPropagation(); onRemove() }}
          style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}>×</button>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ color: 'var(--muted)', transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s', flexShrink: 0 }}>
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {open && (
        <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>
          {/* Type + label row */}
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 10, marginTop: 12, marginBottom: 12 }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Segment Type</label>
              <select className="select" value={seg.type} onChange={e => onChange({ ...seg, type: e.target.value })}>
                {SEGMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
              </select>
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Label / Intent</label>
              <input className="input" placeholder={`e.g. ${label} — Strength Block`} value={seg.label || ''}
                onChange={e => onChange({ ...seg, label: e.target.value })} />
            </div>
          </div>

          {/* Type-specific inline config */}
          {seg.type === 'strength' && (
            <div>
              {(seg.exercises || []).map((ex, i) => (
                <div key={ex.id} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 80px 80px 28px', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                  <input className="input input-sm" placeholder="Exercise name" value={ex.name || ''}
                    onChange={e => onChange({ ...seg, exercises: seg.exercises.map((x, j) => j === i ? { ...x, name: e.target.value } : x) })} />
                  <input className="input input-sm" placeholder="Sets" type="number" value={ex.sets || ''}
                    onChange={e => onChange({ ...seg, exercises: seg.exercises.map((x, j) => j === i ? { ...x, sets: e.target.value } : x) })} />
                  <input className="input input-sm" placeholder="Reps" value={ex.reps || ''}
                    onChange={e => onChange({ ...seg, exercises: seg.exercises.map((x, j) => j === i ? { ...x, reps: e.target.value } : x) })} />
                  <input className="input input-sm" placeholder="Load / %" value={ex.load || ''}
                    onChange={e => onChange({ ...seg, exercises: seg.exercises.map((x, j) => j === i ? { ...x, load: e.target.value } : x) })} />
                  <button style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 }}
                    onClick={() => onChange({ ...seg, exercises: seg.exercises.filter((_, j) => j !== i) })}>×</button>
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={() => onChange({ ...seg, exercises: [...(seg.exercises || []), { id: String(Date.now()), name: '', sets: '', reps: '', load: '' }] })}
                style={{ borderStyle: 'dashed', borderColor: 'var(--accent)', color: 'var(--accent)', width: '100%' }}>
                + Add Exercise
              </button>
            </div>
          )}

          {(seg.type === 'emom' || seg.type === 'amrap' || seg.type === 'for_time') && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
              {seg.type === 'emom' && <>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Duration (mins)</label>
                  <input className="input input-sm" type="number" value={seg.duration_mins || ''} placeholder="e.g. 12"
                    onChange={e => onChange({ ...seg, duration_mins: e.target.value })} />
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Interval</label>
                  <select className="select input-sm" value={seg.interval_mins || 1} onChange={e => onChange({ ...seg, interval_mins: +e.target.value })}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>Every {n} min</option>)}
                  </select>
                </div>
              </>}
              {(seg.type === 'amrap' || seg.type === 'for_time') && <>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Time Cap (mins)</label>
                  <input className="input input-sm" type="number" value={seg.time_cap_mins || ''} placeholder="e.g. 10"
                    onChange={e => onChange({ ...seg, time_cap_mins: e.target.value })} />
                </div>
                {seg.type === 'for_time' && <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Rounds</label>
                  <input className="input input-sm" type="number" value={seg.rounds || ''} placeholder="e.g. 3"
                    onChange={e => onChange({ ...seg, rounds: e.target.value })} />
                </div>}
              </>}
            </div>
          )}
          {(seg.type === 'emom' || seg.type === 'amrap' || seg.type === 'for_time') && (
            <div>
              {(seg.movements || []).map((m, i) => (
                <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 70px 28px', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                  <input className="input input-sm" placeholder="Movement" value={m.name || ''}
                    onChange={e => onChange({ ...seg, movements: seg.movements.map((x, j) => j === i ? { ...x, name: e.target.value } : x) })} />
                  <input className="input input-sm" placeholder="Reps / target" value={m.reps || ''}
                    onChange={e => onChange({ ...seg, movements: seg.movements.map((x, j) => j === i ? { ...x, reps: e.target.value } : x) })} />
                  <input className="input input-sm" placeholder="Load" value={m.load || ''}
                    onChange={e => onChange({ ...seg, movements: seg.movements.map((x, j) => j === i ? { ...x, load: e.target.value } : x) })} />
                  <button style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 }}
                    onClick={() => onChange({ ...seg, movements: seg.movements.filter((_, j) => j !== i) })}>×</button>
                </div>
              ))}
              <button className="btn btn-ghost btn-sm" onClick={() => onChange({ ...seg, movements: [...(seg.movements || []), { id: String(Date.now()), name: '', reps: '', load: '' }] })}
                style={{ borderStyle: 'dashed', borderColor: typeInfo.color, color: typeInfo.color, width: '100%' }}>
                + Add Movement
              </button>
            </div>
          )}

          {seg.type === 'run' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Modality</label>
                <select className="select input-sm" value={seg.modality || 'run'} onChange={e => onChange({ ...seg, modality: e.target.value })}>
                  {['Run', 'Row', 'SkiErg', 'Bike', 'Swim', 'Assault Bike'].map(m => <option key={m} value={m.toLowerCase()}>{m}</option>)}
                </select>
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Distance / Duration</label>
                <input className="input input-sm" placeholder="e.g. 1km or 10 mins" value={seg.distance || ''}
                  onChange={e => onChange({ ...seg, distance: e.target.value })} />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Target Pace / Effort</label>
                <input className="input input-sm" placeholder="e.g. Z2, 4:30/km" value={seg.target || ''}
                  onChange={e => onChange({ ...seg, target: e.target.value })} />
              </div>
            </div>
          )}

          {seg.type === 'rest' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Duration</label>
                <input className="input input-sm" placeholder="e.g. 3 mins" value={seg.duration || ''}
                  onChange={e => onChange({ ...seg, duration: e.target.value })} />
              </div>
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Activity</label>
                <input className="input input-sm" placeholder="e.g. Walking, breathing work" value={seg.activity || ''}
                  onChange={e => onChange({ ...seg, activity: e.target.value })} />
              </div>
            </div>
          )}

          <div className="input-group" style={{ marginTop: 10, marginBottom: 0 }}>
            <label className="form-label">Coach Note for this Segment</label>
            <input className="input input-sm" placeholder="Pacing, intent, scaling…" value={seg.note || ''}
              onChange={e => onChange({ ...seg, note: e.target.value })} />
          </div>
        </div>
      )}
    </div>
  )
}

function MixedModalBuilder({ session }) {
  const def = { segments: [], coach_note: '', total_duration_mins: '' }
  const [cfg, setCfg] = useState({ ...def, ...(session.conditioning_config || {}) })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function addSegment(type = 'strength') {
    setCfg(p => ({
      ...p,
      segments: [...p.segments, { id: String(Date.now()), type, label: '', exercises: [], movements: [] }],
    }))
  }
  function updateSegment(id, data) {
    setCfg(p => ({ ...p, segments: p.segments.map(s => s.id === id ? { ...s, ...data } : s) }))
  }
  function removeSegment(id) {
    setCfg(p => ({ ...p, segments: p.segments.filter(s => s.id !== id) }))
  }

  async function handleSave() {
    setSaving(true)
    await saveSessionField(session.id, { conditioning_config: cfg, session_type: 'mixed' })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      {/* Session overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 10, marginBottom: 20 }}>
        <div className="input-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Total Duration (mins)</label>
          <input className="input" type="number" placeholder="e.g. 75" value={cfg.total_duration_mins}
            onChange={e => setCfg(p => ({ ...p, total_duration_mins: e.target.value }))} />
        </div>
        <div style={{
          padding: '10px 16px', background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)',
          borderLeft: '3px solid var(--danger)', borderRadius: 6, fontSize: 12, color: 'var(--muted)', lineHeight: 1.7,
        }}>
          Build your session block by block. Mix strength, EMOM, AMRAP, For Time, running, and rest segments freely. Each block can have its own structure and time allocation.
        </div>
      </div>

      {/* Add segment quick buttons */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1, color: 'var(--muted)', display: 'flex', alignItems: 'center', marginRight: 4 }}>
          ADD BLOCK
        </span>
        {SEGMENT_TYPES.map(t => (
          <button key={t.value} className="btn btn-ghost btn-sm" onClick={() => addSegment(t.value)}
            style={{ borderColor: t.color, color: t.color, fontSize: 11 }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {cfg.segments.length === 0 ? (
        <div className="empty-state" style={{ height: 120 }}>
          <div className="empty-state-title">No blocks yet</div>
          <div className="empty-state-text">Click a block type above to start building your mixed session.</div>
        </div>
      ) : (
        cfg.segments.map((seg, idx) => (
          <MixedSegment
            key={seg.id}
            seg={seg}
            idx={idx}
            onChange={data => updateSegment(seg.id, data)}
            onRemove={() => removeSegment(seg.id)}
          />
        ))
      )}

      {cfg.segments.length > 0 && (
        <div className="input-group" style={{ marginTop: 8 }}>
          <label className="form-label">Overall Session Note</label>
          <textarea className="input" rows={2} placeholder="Session intent, athlete cues, total time breakdown…"
            style={{ resize: 'vertical' }} value={cfg.coach_note}
            onChange={e => setCfg(p => ({ ...p, coach_note: e.target.value }))} />
        </div>
      )}

      <CondSaveBar onSave={handleSave} saving={saving} saved={saved} />
    </div>
  )
}

// ─── session builder ──────────────────────────────────────────────────────────

function SessionBuilder({ session, onDelete }) {
  const [exercises, setExercises] = useState(session.exercises || [])
  const [sessionType, setSessionType] = useState(session.session_type || 'strength')
  const [tab, setTab] = useState('workout')
  const [addingNew, setAddingNew] = useState(false)
  const [typeChanging, setTypeChanging] = useState(false)

  const typeInfo = SESSION_TYPES.find(t => t.value === sessionType) || SESSION_TYPES[0]

  async function handleTypeChange(newType) {
    if (newType === sessionType) return
    setTypeChanging(true)
    setSessionType(newType)
    await saveSessionField(session.id, { session_type: newType })
    setTypeChanging(false)
    setTab('workout')
  }

  function handleExerciseSaved(data) {
    setExercises(prev => {
      const idx = prev.findIndex(e => e.id === data.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = data; return next }
      return [...prev.filter(e => e.id), data]
    })
    setAddingNew(false)
  }

  function handleExerciseDeleted(id) {
    if (!id) { setAddingNew(false); return }
    setExercises(prev => prev.filter(e => e.id !== id))
  }

  const sessionExercises = exercises.filter(e => e.id)
  const sessionWithType = { ...session, session_type: sessionType }

  return (
    <div style={{
      background: 'var(--s2)', borderRadius: 10,
      border: `1px solid ${typeInfo.color}33`,
      marginBottom: 14, overflow: 'hidden',
    }}>
      {/* Session type selector row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
        padding: '10px 14px',
        background: 'var(--s3)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--white)', flex: '0 0 auto', marginRight: 8 }}>
          {session.day_label}
        </div>
        {/* Type pills */}
        <div style={{ display: 'flex', gap: 4, flex: 1, flexWrap: 'wrap' }}>
          {SESSION_TYPES.map(t => (
            <button key={t.value} onClick={() => handleTypeChange(t.value)} disabled={typeChanging} style={{
              fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1,
              padding: '4px 10px', borderRadius: 20, cursor: 'pointer', border: 'none',
              background: sessionType === t.value ? `${t.color}22` : 'transparent',
              color: sessionType === t.value ? t.color : 'var(--muted)',
              outline: sessionType === t.value ? `1px solid ${t.color}55` : 'none',
              transition: 'all .15s',
              whiteSpace: 'nowrap',
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Workout / Prep tabs */}
        <div style={{ display: 'flex', gap: 2, background: 'var(--s4)', borderRadius: 6, padding: 2, flexShrink: 0 }}>
          {['workout', 'movement prep'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.2,
              padding: '4px 10px', borderRadius: 4, border: 'none', cursor: 'pointer',
              background: tab === t ? 'var(--s6)' : 'transparent',
              color: tab === t ? 'var(--white)' : 'var(--muted)',
              transition: 'all .15s', whiteSpace: 'nowrap',
            }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <button onClick={onDelete}
          style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px', flexShrink: 0 }}
          title="Delete session">×</button>
      </div>

      <div style={{ padding: '14px 16px' }}>
        {tab === 'workout' && (
          <>
            {/* Strength */}
            {sessionType === 'strength' && (
              <>
                {sessionExercises
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((ex, idx) => (
                    <ExerciseRow key={ex.id} exercise={ex} sessionId={session.id}
                      orderIndex={idx} totalExercises={sessionExercises.length}
                      onSaved={handleExerciseSaved} onDeleted={handleExerciseDeleted} />
                  ))}
                {addingNew && (
                  <ExerciseRow exercise={{}} sessionId={session.id}
                    orderIndex={sessionExercises.length} totalExercises={sessionExercises.length + 1}
                    onSaved={handleExerciseSaved} onDeleted={handleExerciseDeleted} />
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => setAddingNew(true)} disabled={addingNew}
                  style={{ width: '100%', marginTop: 4, borderStyle: 'dashed' }}>
                  + Add Exercise
                </button>
                {sessionExercises.some(e => e.pairing) && (
                  <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--s3)', borderRadius: 6, fontSize: 11, color: 'var(--muted)' }}>
                    <strong style={{ color: 'var(--sub)' }}>Superset guide:</strong> Exercises with the same pairing letter (A, B, C…) are grouped as a superset.
                  </div>
                )}
              </>
            )}

            {/* Conditioning builders */}
            {sessionType === 'emom'     && <EMOMBuilder     session={sessionWithType} />}
            {sessionType === 'amrap'    && <AMRAPBuilder     session={sessionWithType} />}
            {sessionType === 'for_time' && <ForTimeBuilder   session={sessionWithType} />}
            {sessionType === 'hyrox'    && <HYROXBuilder     session={sessionWithType} />}
            {sessionType === 'mixed'    && <MixedModalBuilder session={sessionWithType} />}
          </>
        )}

        {tab === 'movement prep' && (
          <MovementPrepEditor sessionId={session.id} initial={session.movement_prep || []} />
        )}
      </div>
    </div>
  )
}

// ─── goal settings tab ────────────────────────────────────────────────────────

function GoalSettingsTab({ program, onSaved }) {
  const [form, setForm] = useState({
    goal_type:     program.goal_type || 'maintain',
    start_weight:  program.start_weight || '',
    target_weight: program.target_weight || '',
    start_date:    program.start_date || program.created_at?.split('T')[0] || '',
    end_date:      program.end_date || '',
    phase:         program.phase || '',
    current_week:  program.current_week || 1,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function f(key) {
    return { value: form[key] ?? '', onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) }
  }

  async function handleSave() {
    setSaving(true)
    await saveProgram(program.id, form)
    setSaving(false)
    setSaved(true)
    onSaved({ ...program, ...form })
    setTimeout(() => setSaved(false), 2000)
  }

  const gi = goalInfo(form.goal_type)

  // Estimate weekly rate
  const weeklyRate = {
    cut: -0.007, aggressive_cut: -0.01,
    lean_gain: 0.002, gain: 0.003,
    maintain: 0, recomp: 0,
  }[form.goal_type] || 0

  const startKg = parseFloat(form.start_weight)
  const rateKg = startKg ? (startKg * weeklyRate).toFixed(2) : null
  const totalChange = startKg && program.total_weeks ? (startKg * weeklyRate * program.total_weeks).toFixed(1) : null
  const predictedEnd = startKg && totalChange ? (startKg + parseFloat(totalChange)).toFixed(1) : null

  return (
    <div>
      {/* Goal type selector */}
      <div className="card" style={{ padding: '18px 20px', marginBottom: 16 }}>
        <div className="label" style={{ marginBottom: 12 }}>Goal Type</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {GOAL_TYPES.map(g => (
            <button
              key={g.value}
              onClick={() => setForm(p => ({ ...p, goal_type: g.value }))}
              style={{
                padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                background: form.goal_type === g.value ? `${g.color}18` : 'var(--s3)',
                border: `1.5px solid ${form.goal_type === g.value ? g.color + '66' : 'var(--border)'}`,
                color: form.goal_type === g.value ? g.color : 'var(--muted)',
                fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1,
                transition: 'all .2s',
                boxShadow: form.goal_type === g.value ? `0 0 12px ${g.color}22` : 'none',
              }}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weight & dates */}
      <div className="card" style={{ padding: '18px 20px', marginBottom: 16 }}>
        <div className="label" style={{ marginBottom: 14 }}>Body Weight Targets</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <FieldRow label="Start Weight (kg)">
            <input className="input" type="number" step="0.1" placeholder="e.g. 85.0" {...f('start_weight')} />
          </FieldRow>
          <FieldRow label="Target Weight (kg)">
            <input className="input" type="number" step="0.1" placeholder="e.g. 78.0" {...f('target_weight')} />
          </FieldRow>
        </div>

        {/* Prediction preview */}
        {rateKg && (
          <div style={{
            padding: '12px 14px', background: `${gi.color}0e`,
            border: `1px solid ${gi.color}2a`,
            borderLeft: `3px solid ${gi.color}`,
            borderRadius: 6,
          }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div>
                <div className="label" style={{ fontSize: 8, marginBottom: 2 }}>Rate / Week</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: gi.color }}>
                  {rateKg > 0 ? '+' : ''}{rateKg}kg
                </div>
              </div>
              <div>
                <div className="label" style={{ fontSize: 8, marginBottom: 2 }}>Over {program.total_weeks} Weeks</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: gi.color }}>
                  {totalChange > 0 ? '+' : ''}{totalChange}kg
                </div>
              </div>
              {predictedEnd && (
                <div>
                  <div className="label" style={{ fontSize: 8, marginBottom: 2 }}>Predicted End Weight</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)' }}>
                    {predictedEnd}kg
                  </div>
                </div>
              )}
              {form.target_weight && predictedEnd && (
                <div>
                  <div className="label" style={{ fontSize: 8, marginBottom: 2 }}>vs Target</div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: 16,
                    color: Math.abs(predictedEnd - parseFloat(form.target_weight)) < 2
                      ? 'var(--accent)' : 'var(--warn)',
                  }}>
                    {(predictedEnd - parseFloat(form.target_weight)).toFixed(1) > 0 ? '+' : ''}
                    {(predictedEnd - parseFloat(form.target_weight)).toFixed(1)}kg
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dates & phase */}
      <div className="card" style={{ padding: '18px 20px', marginBottom: 16 }}>
        <div className="label" style={{ marginBottom: 14 }}>Programme Details</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 14 }}>
          <FieldRow label="Start Date">
            <input className="input" type="date" {...f('start_date')} />
          </FieldRow>
          <FieldRow label="End Date">
            <input className="input" type="date" {...f('end_date')} />
          </FieldRow>
          <FieldRow label="Current Week">
            <input className="input" type="number" min="1" max={program.total_weeks} {...f('current_week')} />
          </FieldRow>
          <FieldRow label="Phase Label">
            <input className="input" placeholder="e.g. Hypertrophy" {...f('phase')} />
          </FieldRow>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Goal Settings'}
        </button>
      </div>
    </div>
  )
}

// ─── sessions tab ─────────────────────────────────────────────────────────────

function SessionsTab({ program }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedWeek, setSelectedWeek] = useState(program.current_week || 1)
  const [adding, setAdding] = useState(false)
  const [newDayLabel, setNewDayLabel] = useState('Day A')

  useEffect(() => {
    loadSessions()
  }, [program.id])

  async function loadSessions() {
    setLoading(true)
    const data = await fetchProgramDetail(program.id)
    setSessions(data)
    setLoading(false)
  }

  async function handleAddSession() {
    const data = await createSession(program.id, program.client_id, selectedWeek, newDayLabel)
    if (data) { setSessions(p => [...p, data]); setAdding(false) }
  }

  async function handleDeleteSession(sessionId) {
    if (!window.confirm('Delete this session and all its exercises?')) return
    await deleteSession(sessionId)
    setSessions(p => p.filter(s => s.id !== sessionId))
  }

  const weekSessions = sessions.filter(s => s.week_number === selectedWeek)
  const weeksWithSessions = [...new Set(sessions.map(s => s.week_number))].sort((a, b) => a - b)

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>

  return (
    <div>
      {/* Week selector */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div className="label">Select Week</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            {sessions.length} sessions across {weeksWithSessions.length} weeks
          </div>
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {Array.from({ length: program.total_weeks }, (_, i) => i + 1).map(w => {
            const hasSessions = weeksWithSessions.includes(w)
            const isCurrent = w === program.current_week
            return (
              <button
                key={w}
                onClick={() => setSelectedWeek(w)}
                style={{
                  width: 34, height: 34, borderRadius: 5,
                  fontFamily: 'var(--font-display)', fontSize: 11,
                  background: selectedWeek === w
                    ? 'linear-gradient(135deg,var(--accent),var(--accent-hi))'
                    : hasSessions ? 'var(--s4)' : 'var(--s3)',
                  border: isCurrent
                    ? '1.5px solid var(--accent)'
                    : selectedWeek === w ? 'none'
                    : '1px solid var(--border)',
                  color: selectedWeek === w ? 'var(--ink)'
                    : hasSessions ? 'var(--white)'
                    : 'var(--muted)',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all .15s',
                }}
              >
                {w}
                {hasSessions && selectedWeek !== w && (
                  <div style={{
                    position: 'absolute', top: 2, right: 2,
                    width: 5, height: 5, borderRadius: '50%',
                    background: 'var(--accent)',
                  }} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Sessions for selected week */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--white)' }}>
          Week {selectedWeek} — {weekSessions.length} session{weekSessions.length !== 1 ? 's' : ''}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setAdding(a => !a)}>
          + Add Session
        </button>
      </div>

      {/* Add session row */}
      {adding && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, padding: '12px 14px', background: 'var(--s3)', borderRadius: 8, border: '1px solid var(--border-hi)' }}>
          <select className="select" value={newDayLabel} onChange={e => setNewDayLabel(e.target.value)} style={{ flex: 1 }}>
            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input
            className="input"
            style={{ flex: 1 }}
            placeholder="Custom label e.g. Upper — Chest Focus"
            value={newDayLabel}
            onChange={e => setNewDayLabel(e.target.value)}
          />
          <button className="btn btn-primary btn-sm" onClick={handleAddSession}>Create</button>
          <button className="btn btn-ghost btn-sm" onClick={() => setAdding(false)}>Cancel</button>
        </div>
      )}

      {weekSessions.length === 0 ? (
        <div className="empty-state" style={{ height: 180 }}>
          <div className="empty-state-title">No sessions this week</div>
          <div className="empty-state-text">Add a session to start building the workout.</div>
        </div>
      ) : (
        weekSessions.map(session => (
          <SessionBuilder
            key={session.id}
            session={session}
            onDelete={() => handleDeleteSession(session.id)}
          />
        ))
      )}
    </div>
  )
}

// ─── program detail ───────────────────────────────────────────────────────────

function ProgramDetail({ program, onBack }) {
  const [activeProgram, setActiveProgram] = useState(program)
  const [tab, setTab] = useState('Goal Settings')
  const gi = goalInfo(activeProgram.goal_type)

  const TABS = ['Goal Settings', 'Sessions']

  return (
    <div>
      {/* Back + header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onBack}
            style={{ padding: '6px 10px' }}
          >
            ← Back
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <div className="page-title" style={{ marginBottom: 0 }}>{activeProgram.name}</div>
              {activeProgram.goal_type && <Chip label={gi.label} color={gi.color} />}
              {activeProgram.phase && <Chip label={activeProgram.phase.toUpperCase()} color="var(--accent)" />}
            </div>
            <div className="page-subtitle">
              {activeProgram.client?.full_name} · Week {activeProgram.current_week}/{activeProgram.total_weeks}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1.5,
            color: tab === t ? 'var(--accent)' : 'var(--muted)',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px',
            borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: -1, transition: 'color .2s, border-color .2s',
          }}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === 'Goal Settings' && (
        <GoalSettingsTab program={activeProgram} onSaved={setActiveProgram} />
      )}
      {tab === 'Sessions' && (
        <SessionsTab program={activeProgram} />
      )}
    </div>
  )
}

// ─── program list card ────────────────────────────────────────────────────────

function ProgramCard({ program, onClick }) {
  const gi = goalInfo(program.goal_type)
  const weeks = Array.from({ length: Math.min(program.total_weeks, 26) }, (_, i) => i + 1)
  const navigate = useNavigate()

  return (
    <div className="card" style={{ marginBottom: 12, cursor: 'pointer', transition: 'border-color .2s' }}
      onClick={onClick}>
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)' }}>
                {program.name}
              </span>
              {program.goal_type && <Chip label={gi.label} color={gi.color} />}
              {program.phase && <Chip label={program.phase.toUpperCase()} color="var(--accent)" />}
              {!program.is_active && <Chip label="INACTIVE" color="var(--muted)" />}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              {program.client?.full_name} · Week {program.current_week}/{program.total_weeks}
              {program.start_weight && ` · Start: ${program.start_weight}kg`}
              {program.target_weight && ` → ${program.target_weight}kg`}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--accent)', lineHeight: 1 }}>
              {Math.round((program.current_week / program.total_weeks) * 100)}%
            </div>
            <div className="label" style={{ fontSize: 8 }}>COMPLETE</div>
          </div>
        </div>

        {/* Week grid */}
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginBottom: program.client_id ? 12 : 0 }}>
          {weeks.map(w => (
            <div key={w} style={{
              width: 26, height: 26, borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 10,
              background: w < program.current_week
                ? 'var(--accent)'
                : w === program.current_week
                  ? 'var(--accent-dim)'
                  : 'var(--s4)',
              color: w < program.current_week
                ? 'var(--ink)'
                : w === program.current_week
                  ? 'var(--accent)'
                  : 'var(--muted)',
              border: w === program.current_week ? '1px solid var(--accent)' : '1px solid transparent',
            }}>
              {w}
            </div>
          ))}
        </div>

        {program.client_id && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ fontSize: 11 }}
              onClick={e => { e.stopPropagation(); navigate(`/coach/client/${program.client_id}`) }}
            >
              VIEW CLIENT PROFILE →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── programme templates ──────────────────────────────────────────────────────

const PROGRAMME_TEMPLATES = [
  {
    id: 'week1_gbc',
    label: 'Week 1 GBC Baseline',
    icon: '📐',
    color: 'var(--accent)',
    description: '1-week testing block — Cooper run, 3-day GBC circuits',
    fullTemplateId: 'gbc',
    defaults: {
      name: 'Week 1 GBC Baseline Assessment',
      total_weeks: 1,
      goal_type: 'maintain',
      phase: 'Testing',
    },
  },
  {
    id: 'structural_balance',
    label: 'Structural Balance',
    icon: '⚖️',
    color: '#f472b6',
    description: '4 weeks — corrective, joint health, FMS follow-up',
    fullTemplateId: 'structural-balance-full',
    defaults: {
      name: 'Structural Balance Block',
      total_weeks: 4,
      goal_type: 'maintain',
      phase: 'Structural Balance',
    },
  },
  {
    id: 'gbc_fat_loss',
    label: 'GBC Fat Loss',
    icon: '🔥',
    color: 'var(--info)',
    description: '6 weeks — German Body Comp, high density, fat loss',
    fullTemplateId: 'gbc-body-comp',
    defaults: {
      name: 'GBC Phase 1 — Fat Loss',
      total_weeks: 6,
      goal_type: 'cut',
      phase: 'GBC Hypertrophy',
    },
  },
  {
    id: 'hypertrophy',
    label: 'Hypertrophy Base',
    icon: '💪',
    color: 'var(--accent)',
    description: '6 weeks — GVT Classic, volume accumulation, muscle growth',
    fullTemplateId: 'gvt-classic',
    defaults: {
      name: 'GVT Hypertrophy Phase',
      total_weeks: 6,
      goal_type: 'lean_gain',
      phase: 'GPP Hypertrophy',
    },
  },
  {
    id: 'strength',
    label: 'Strength Phase',
    icon: '🏋️',
    color: 'var(--purple)',
    description: '6 weeks — 5×5 progressive overload, neural drive',
    fullTemplateId: 'strength-5x5',
    defaults: {
      name: 'Strength 5×5 Phase',
      total_weeks: 6,
      goal_type: 'gain',
      phase: 'Strength',
    },
  },
  {
    id: 'full_26',
    label: '26-Week Transformation',
    icon: '🗺️',
    color: 'var(--warn)',
    description: 'Full 6-month periodised programme — sessions added per phase',
    fullTemplateId: null,
    defaults: {
      name: '26-Week Body Transformation',
      total_weeks: 26,
      goal_type: 'cut',
      phase: 'Phase 1 — Structural Balance',
    },
  },
]

// ─── create program modal ─────────────────────────────────────────────────────

function CreateProgramModal({ clients, onClose, onCreated, preselectedClientId = '' }) {
  const { user } = useAuth()
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    client_id: preselectedClientId, name: '', total_weeks: 26, current_week: 1,
    phase: '', start_date: today, end_date: '',
    goal_type: 'maintain', start_weight: '', target_weight: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [selectedFullTemplate, setSelectedFullTemplate] = useState(null)
  const [loadingClient, setLoadingClient] = useState(false)

  // Auto-fill client data from their profile when client is selected
  useEffect(() => {
    if (!form.client_id) return
    loadClientProfile(form.client_id)
  }, [form.client_id])

  async function loadClientProfile(clientId) {
    setLoadingClient(true)
    const { data } = await supabase
      .from('profiles')
      .select('current_weight, target_weight, goal_type, full_name')
      .eq('id', clientId)
      .single()
    setLoadingClient(false)
    if (data) {
      setForm(p => ({
        ...p,
        start_weight: data.current_weight || p.start_weight,
        target_weight: data.target_weight || p.target_weight,
        goal_type: data.goal_type || p.goal_type,
        // Only auto-fill name if it's still empty
        name: p.name || (selectedTemplate ? p.name : `${data.full_name?.split(' ')[0]} — New Programme`),
      }))
    }
  }

  function applyTemplate(tpl) {
    setSelectedTemplate(tpl.id)
    // Look up matching full template with generateSessions
    const fullTpl = tpl.fullTemplateId
      ? PROGRAM_TEMPLATES.find(t => t.id === tpl.fullTemplateId) || null
      : null
    setSelectedFullTemplate(fullTpl)
    setForm(p => ({
      ...p,
      ...tpl.defaults,
      // If linked to a full template, use its week count
      total_weeks: fullTpl ? fullTpl.default_weeks : tpl.defaults.total_weeks,
      // Preserve client data already filled in
      start_weight: p.start_weight,
      target_weight: p.target_weight,
      client_id: p.client_id,
      start_date: p.start_date,
    }))
  }

  function f(key) {
    return { value: form[key] ?? '', onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) }
  }

  async function handleCreate() {
    if (!form.client_id || !form.name) { setError('Client and programme name are required.'); return }
    setSaving(true)
    setError(null)

    // If linked to a full template, use createProgramFromTemplate to generate all sessions + exercises
    if (selectedFullTemplate) {
      const programData = {
        client_id: form.client_id,
        coach_id: user.id,
        name: form.name,
        phase: form.phase || selectedFullTemplate.phase,
        goal_type: form.goal_type || selectedFullTemplate.goal_type,
        total_weeks: selectedFullTemplate.default_weeks,
        current_week: 1,
        start_date: form.start_date,
        start_weight: form.start_weight || null,
        target_weight: form.target_weight || null,
        is_active: true,
      }
      const sessions = selectedFullTemplate.generateSessions(selectedFullTemplate.default_weeks)
      const result = await createProgramFromTemplate(programData, sessions)
      setSaving(false)
      if (result.error) {
        setError(`Failed: ${result.error.message}`)
      } else {
        alert(`✅ Programme created with ${result.sessionCount} sessions and ${result.exerciseCount} exercises!`)
        onCreated(result.data)
        onClose()
      }
      return
    }

    // No full template — create blank programme shell
    const { data, error } = await supabase
      .from('programs')
      .insert({ ...form, coach_id: user.id, is_active: true })
      .select()
      .single()
    setSaving(false)
    if (error) setError(error.message)
    else { onCreated(data); onClose() }
  }

  const gi = goalInfo(form.goal_type)

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(6,6,8,0.88)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 24,
    }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="card" style={{ width: 620, maxHeight: '92vh', overflowY: 'auto' }}>
        <div className="card-header">
          <div className="card-title">Create Programme</div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Template picker */}
        <div style={{ marginBottom: 18 }}>
          <div className="label" style={{ marginBottom: 10 }}>Quick Start — Choose a Template</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {PROGRAMME_TEMPLATES.map(tpl => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => applyTemplate(tpl)}
                style={{
                  padding: '10px 12px', borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  background: selectedTemplate === tpl.id ? `${tpl.color}18` : 'var(--s3)',
                  border: `1.5px solid ${selectedTemplate === tpl.id ? tpl.color + '55' : 'var(--border)'}`,
                  transition: 'all .15s',
                  boxShadow: selectedTemplate === tpl.id ? `0 0 12px ${tpl.color}18` : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <div style={{ fontSize: 16 }}>{tpl.icon}</div>
                  {tpl.fullTemplateId && (
                    <span style={{
                      fontSize: 8, fontFamily: 'var(--font-display)', letterSpacing: 0.5,
                      padding: '2px 5px', borderRadius: 3,
                      background: 'rgba(0,200,150,.15)', color: 'var(--accent)',
                      border: '1px solid rgba(0,200,150,.3)',
                    }}>AUTO-BUILD</span>
                  )}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1,
                  color: selectedTemplate === tpl.id ? tpl.color : 'var(--sub)',
                  marginBottom: 3,
                }}>{tpl.label}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.4 }}>{tpl.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: 18 }} />

        {selectedFullTemplate && (
          <div style={{
            marginBottom: 14, padding: '10px 14px',
            background: 'rgba(0,200,150,.08)', border: '1px solid rgba(0,200,150,.25)',
            borderRadius: 8, fontSize: 12, color: 'var(--accent)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span>⚡</span>
            <span>
              <strong>Auto-build on:</strong> {selectedFullTemplate.name} — will generate all {selectedFullTemplate.default_weeks} weeks of sessions and exercises automatically.
            </span>
          </div>
        )}

        {error && <div className="alert alert-danger" style={{ margin: '0 0 14px' }}>{error}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FieldRow label="Client">
              <select className="select" {...f('client_id')}>
                <option value="">Select client…</option>
                {clients.map(c => (
                  <option key={c.id} value={c.client_id}>{c.profile?.full_name}</option>
                ))}
              </select>
            </FieldRow>
            <FieldRow label="Programme Name">
              <input className="input" placeholder="e.g. GBC Phase 1 — Fat Loss" {...f('name')} />
            </FieldRow>
          </div>

          {/* Client data auto-fill banner */}
          {loadingClient && (
            <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="spinner" style={{ width: 12, height: 12 }} />
              Loading client data from onboarding…
            </div>
          )}
          {form.client_id && !loadingClient && form.start_weight && (
            <div style={{
              padding: '10px 14px', background: 'rgba(0,200,150,.06)',
              border: '1px solid rgba(0,200,150,.2)', borderRadius: 8,
              display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
                AUTO-FILLED FROM ONBOARDING
              </span>
              {form.start_weight && <span style={{ fontSize: 11, color: 'var(--muted)' }}>Start: {form.start_weight}kg</span>}
              {form.target_weight && <span style={{ fontSize: 11, color: 'var(--muted)' }}>Target: {form.target_weight}kg</span>}
              {form.goal_type && <span style={{ fontSize: 11, color: 'var(--muted)' }}>Goal: {goalInfo(form.goal_type).label}</span>}
            </div>
          )}

          <div>
            <div className="form-label" style={{ marginBottom: 8 }}>Goal Type</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
              {GOAL_TYPES.map(g => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, goal_type: g.value }))}
                  style={{
                    padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
                    background: form.goal_type === g.value ? `${g.color}18` : 'var(--s3)',
                    border: `1.5px solid ${form.goal_type === g.value ? g.color + '66' : 'var(--border)'}`,
                    color: form.goal_type === g.value ? g.color : 'var(--muted)',
                    fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1,
                    transition: 'all .15s',
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
            <FieldRow label="Total Weeks">
              <input className="input" type="number" min="1" max="52" {...f('total_weeks')} />
            </FieldRow>
            <FieldRow label="Phase Label">
              <input className="input" placeholder="e.g. Hypertrophy" {...f('phase')} />
            </FieldRow>
            <FieldRow label="Start Weight (kg)">
              <input className="input" type="number" step="0.1" placeholder="85.0" {...f('start_weight')} />
            </FieldRow>
            <FieldRow label="Target Weight (kg)">
              <input className="input" type="number" step="0.1" placeholder="78.0" {...f('target_weight')} />
            </FieldRow>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <FieldRow label="Start Date">
              <input className="input" type="date" {...f('start_date')} />
            </FieldRow>
            <FieldRow label="End Date (optional)">
              <input className="input" type="date" {...f('end_date')} />
            </FieldRow>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="btn btn-ghost" onClick={onClose}>CANCEL</button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={saving || !form.client_id || !form.name} style={{ flex: 1 }}>
              {saving ? '…' : 'CREATE PROGRAMME'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── template library ─────────────────────────────────────────────────────────

function TemplateLibrary({ clients, onClose, onCreated }) {
  const { user } = useAuth()
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [clientId, setClientId] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState(null)

  const difficultyColor = {
    beginner: 'var(--accent)',
    intermediate: 'var(--warn)',
    advanced: 'var(--danger)',
  }

  async function handleCreate() {
    if (!selectedTemplate || !clientId) {
      setError('Please select a template and a client.')
      return
    }
    setCreating(true)
    setError(null)

    const sessions = selectedTemplate.generateSessions(selectedTemplate.default_weeks)
    const programData = {
      client_id: clientId,
      coach_id: user.id,
      name: selectedTemplate.name,
      phase: selectedTemplate.phase,
      goal_type: selectedTemplate.goal_type,
      total_weeks: selectedTemplate.default_weeks,
      current_week: 1,
      start_date: startDate,
      is_active: true,
    }

    const result = await createProgramFromTemplate(programData, sessions)
    setCreating(false)
    if (result.error) {
      console.error('createProgramFromTemplate error:', result.error)
      setError(`Failed: ${result.error.message || JSON.stringify(result.error)}`)
    } else {
      alert(`✅ Programme created!\n${result.sessionCount} sessions · ${result.exerciseCount} exercises\n\nIf sessions are missing in the builder, open browser console (F12) and check for [CPT] errors.`)
      onCreated(result.data)
      onClose()
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 100, display: 'flex', alignItems: 'flex-start',
      justifyContent: 'center', padding: '20px 16px', overflowY: 'auto',
    }}>
      <div className="card" style={{ width: '100%', maxWidth: 800, position: 'relative' }}>
        <div className="flex-between" style={{ marginBottom: 20 }}>
          <div>
            <div className="card-title" style={{ fontSize: 20 }}>Template Library</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
              Pre-built programmes from Training Methods — select one to auto-generate all sessions and exercises
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕ CLOSE</button>
        </div>

        {error && (
          <div style={{
            marginBottom: 16, padding: '14px 18px',
            background: 'rgba(229,53,53,.12)',
            border: '2px solid var(--danger)',
            borderRadius: 8,
            color: 'var(--danger)',
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            letterSpacing: 0.5,
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Template grid */}
        {!selectedTemplate ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
            {PROGRAM_TEMPLATES.map(t => (
              <div
                key={t.id}
                className="card"
                style={{
                  cursor: 'pointer', border: '2px solid var(--border)',
                  transition: 'border-color .15s',
                  padding: '14px 16px',
                }}
                onClick={() => setSelectedTemplate(t)}
                onMouseEnter={e => e.currentTarget.style.borderColor = t.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--white)', marginBottom: 6, lineHeight: 1.3 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.5 }}>{t.description}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span className="tag tag-muted" style={{ fontSize: 9 }}>{t.default_weeks}W</span>
                  <span className="tag tag-muted" style={{ fontSize: 9 }}>{t.days_per_week}D/WK</span>
                  <span style={{
                    fontSize: 9, fontFamily: 'var(--font-display)', letterSpacing: 0.5,
                    padding: '2px 6px', borderRadius: 3,
                    background: `${difficultyColor[t.difficulty]}22`,
                    color: difficultyColor[t.difficulty],
                    border: `1px solid ${difficultyColor[t.difficulty]}44`,
                  }}>{t.difficulty.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ marginBottom: 20 }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginBottom: 16 }}
              onClick={() => setSelectedTemplate(null)}
            >
              ← BACK TO TEMPLATES
            </button>

            {/* Selected template detail */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20, padding: '14px 16px', background: 'var(--s3)', borderRadius: 10, border: `2px solid ${selectedTemplate.color}` }}>
              <div style={{ fontSize: 36 }}>{selectedTemplate.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)' }}>{selectedTemplate.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{selectedTemplate.description}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  <span className="tag tag-muted">{selectedTemplate.default_weeks} weeks</span>
                  <span className="tag tag-muted">{selectedTemplate.days_per_week} days/week</span>
                  <span className="tag tag-muted">{selectedTemplate.phase}</span>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-display)', padding: '2px 6px', borderRadius: 3, background: `${difficultyColor[selectedTemplate.difficulty]}22`, color: difficultyColor[selectedTemplate.difficulty] }}>{selectedTemplate.difficulty.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Client + date pickers */}
            <div className="grid-2" style={{ gap: 16, marginBottom: 20 }}>
              <div className="input-group">
                <label className="form-label">Assign to Client</label>
                <select className="input" value={clientId} onChange={e => setClientId(e.target.value)}>
                  <option value="">Select client…</option>
                  {clients.map(c => (
                    <option key={c.client_id} value={c.client_id}>{c.client?.full_name || c.profile?.full_name || c.client_id}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="form-label">Start Date</label>
                <input className="input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px' }}
              onClick={handleCreate}
              disabled={creating || !clientId}
            >
              {creating ? '…' : `CREATE ${selectedTemplate.name.toUpperCase()} — ${selectedTemplate.default_weeks} WEEKS`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function Programs() {
  const { clients, programs: initialPrograms, loading } = useCoach()
  const [programs, setPrograms] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false)
  const [preselectedClientId, setPreselectedClientId] = useState('')
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [filter, setFilter] = useState('active')
  const [duplicating, setDuplicating] = useState(false)

  const allPrograms = programs || initialPrograms || []
  const displayPrograms = allPrograms.filter(p =>
    filter === 'all' ? true : filter === 'active' ? p.is_active : !p.is_active
  )

  function handleProgramCreated(newProgram) {
    setPrograms(prev => [newProgram, ...(prev || initialPrograms || [])])
  }

  async function handleDelete(program, e) {
    e.stopPropagation()
    if (!window.confirm(`Delete "${program.name}"? This will permanently remove all sessions and exercise data.`)) return
    await supabase.from('programs').delete().eq('id', program.id)
    setPrograms(prev => (prev || initialPrograms || []).filter(p => p.id !== program.id))
  }

  function openCreateForClient(clientId) {
    setPreselectedClientId(clientId || '')
    setShowCreate(true)
  }

  async function handleDuplicate(program, e) {
    e.stopPropagation()
    if (!window.confirm(`Duplicate "${program.name}"?`)) return
    setDuplicating(program.id)
    const { data } = await supabase
      .from('programs')
      .insert({
        client_id: program.client_id,
        coach_id: program.coach_id,
        name: `${program.name} (copy)`,
        total_weeks: program.total_weeks,
        current_week: 1,
        goal_type: program.goal_type,
        phase: program.phase,
        start_weight: program.start_weight,
        target_weight: program.target_weight,
        start_date: new Date().toISOString().split('T')[0],
        is_active: false,
      })
      .select()
      .single()
    setDuplicating(null)
    if (data) handleProgramCreated(data)
  }

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>

  // Program detail drill-down
  if (selectedProgram) {
    return (
      <ProgramDetail
        program={selectedProgram}
        onBack={() => setSelectedProgram(null)}
      />
    )
  }

  const noProgramClients = clients.filter(c => {
    const clientId = c.client_id
    return !allPrograms.some(p => p.client_id === clientId && p.is_active)
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Programmes</div>
          <div className="page-subtitle">
            {allPrograms.filter(p => p.is_active).length} active · {allPrograms.length} total · Click to open session builder
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-ghost"
            onClick={() => setShowTemplateLibrary(true)}
          >
            TEMPLATE LIBRARY
          </button>
          <button className="btn btn-primary" onClick={() => openCreateForClient('')}>
            + CREATE PROGRAMME
          </button>
        </div>
      </div>

      {/* Clients without a programme — quick assign strip */}
      {noProgramClients.length > 0 && (
        <div className="card" style={{ padding: '14px 18px', marginBottom: 20, borderLeft: '3px solid var(--warn)' }}>
          <div className="label" style={{ marginBottom: 10, color: 'var(--warn)' }}>
            {noProgramClients.length} CLIENT{noProgramClients.length !== 1 ? 'S' : ''} WITHOUT A PROGRAMME
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {noProgramClients.map(c => (
              <button
                key={c.client_id}
                className="btn btn-ghost btn-sm"
                onClick={() => openCreateForClient(c.client_id)}
                style={{ borderColor: 'var(--warn)', color: 'var(--warn)' }}
              >
                + Assign to {c.profile?.full_name?.split(' ')[0] || 'Client'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {['active', 'inactive', 'all'].map(f => (
          <div key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.toUpperCase()}
          </div>
        ))}
      </div>

      {displayPrograms.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
          <div className="empty-state-title">No programmes</div>
          <div className="empty-state-text">Create a programme and assign it to a client.</div>
        </div>
      ) : (
        displayPrograms.map(program => (
          <div key={program.id} style={{ position: 'relative' }}>
            <ProgramCard
              program={program}
              onClick={() => setSelectedProgram(program)}
            />
            {/* Action buttons overlay */}
            <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 6 }}>
              <button
                onClick={e => handleDuplicate(program, e)}
                disabled={duplicating === program.id}
                style={{
                  fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5,
                  color: 'var(--muted)', background: 'var(--s4)',
                  border: '1px solid var(--border)', borderRadius: 4,
                  padding: '4px 10px', cursor: 'pointer',
                  transition: 'all .15s',
                }}
              >
                {duplicating === program.id ? '…' : 'DUPLICATE'}
              </button>
              <button
                onClick={e => handleDelete(program, e)}
                style={{
                  fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5,
                  color: 'var(--danger)', background: 'rgba(229,53,53,.08)',
                  border: '1px solid rgba(229,53,53,.3)', borderRadius: 4,
                  padding: '4px 10px', cursor: 'pointer',
                  transition: 'all .15s',
                }}
              >
                DELETE
              </button>
            </div>
          </div>
        ))
      )}

      {showCreate && (
        <CreateProgramModal
          clients={clients}
          preselectedClientId={preselectedClientId}
          onClose={() => { setShowCreate(false); setPreselectedClientId('') }}
          onCreated={handleProgramCreated}
        />
      )}

      {showTemplateLibrary && (
        <TemplateLibrary
          clients={clients}
          onClose={() => setShowTemplateLibrary(false)}
          onCreated={(newProgram) => {
            setPrograms(prev => [newProgram, ...(prev || initialPrograms || [])])
            setShowTemplateLibrary(false)
          }}
        />
      )}
    </div>
  )
}
