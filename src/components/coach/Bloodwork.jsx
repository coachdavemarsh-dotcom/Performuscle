import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useCoach } from '../../hooks/useCoach.js'
import { getBloodMarkers, upsertBloodMarker, deleteBloodMarker, saveBloodPanel } from '../../lib/supabase.js'
import { classifyBloodMarker, summarizeBloodPanel } from '../../lib/calculators.js'

const API_URL = import.meta.env.VITE_API_URL || ''

// ============================================================
// COACH BLOODWORK — reference range library + client panel entry
// ============================================================

const STATUS_LABELS = {
  optimal: { text: 'Optimal', color: 'var(--accent)' },
  borderline_low: { text: 'In range, below optimal', color: 'var(--warn)' },
  borderline_high: { text: 'In range, above optimal', color: 'var(--warn)' },
  out_of_range_low: { text: 'Below lab range', color: 'var(--danger)' },
  out_of_range_high: { text: 'Above lab range', color: 'var(--danger)' },
  no_range: { text: '—', color: 'var(--muted)' },
}

function Disclaimer() {
  return (
    <div style={{
      marginTop: 24, padding: '10px 16px', background: 'var(--s4)',
      border: '1px solid var(--border)', borderRadius: 8, fontSize: 11, color: 'var(--muted)',
    }}>
      Educational reference only — not a medical diagnosis. Always advise clients to consult their physician about any abnormal or concerning result.
    </div>
  )
}

function rangeText(low, high) {
  if (low === null && high === null) return '—'
  if (low === null) return `< ${high}`
  if (high === null) return `> ${low}`
  return `${low}–${high}`
}

// ── Marker Editor ───────────────────────────────────────────

function emptyMarker(coachId) {
  return {
    coach_id: coachId, marker_key: '', display_name: '', unit: '', category: 'General',
    sex: '', conventional_low: '', conventional_high: '', optimal_low: '', optimal_high: '', notes: '',
    aliases: '', rec_low: '', rec_high: '',
  }
}

function MarkerEditor({ marker, coachId, onSave, onCancel }) {
  const [form, setForm] = useState(() => {
    if (!marker) return emptyMarker(coachId)
    const merged = { ...emptyMarker(coachId), ...marker }
    Object.keys(merged).forEach(k => { if (merged[k] === null) merged[k] = '' })
    return merged
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSave() {
    if (!form.marker_key.trim() || !form.display_name.trim()) {
      setError('Marker key and display name are required')
      return
    }
    setSaving(true)
    setError(null)
    const payload = {
      ...form,
      marker_key: form.marker_key.trim(),
      sex: form.sex || null,
      conventional_low: form.conventional_low === '' ? null : parseFloat(form.conventional_low),
      conventional_high: form.conventional_high === '' ? null : parseFloat(form.conventional_high),
      optimal_low: form.optimal_low === '' ? null : parseFloat(form.optimal_low),
      optimal_high: form.optimal_high === '' ? null : parseFloat(form.optimal_high),
    }
    const { data, error: err } = await upsertBloodMarker(payload)
    setSaving(false)
    if (err) { setError(err.message); return }
    onSave(data)
  }

  return (
    <div className="card" style={{ maxWidth: 680, marginBottom: 20 }}>
      <div className="card-title" style={{ marginBottom: 20, fontSize: 13, letterSpacing: 1.5 }}>
        {marker ? 'Edit Marker' : 'New Marker'}
      </div>
      {error && <div style={{ fontSize: 11, color: 'var(--danger)', marginBottom: 10 }}>{error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="grid-2">
          <div className="input-group">
            <label className="form-label">Display Name</label>
            <input className="input" value={form.display_name} onChange={e => set('display_name', e.target.value)} placeholder="e.g. TSH" />
          </div>
          <div className="input-group">
            <label className="form-label">Marker Key</label>
            <input className="input" value={form.marker_key} onChange={e => set('marker_key', e.target.value)} placeholder="e.g. tsh" />
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>Unique short code, no spaces</div>
          </div>
        </div>

        <div className="grid-2">
          <div className="input-group">
            <label className="form-label">Unit</label>
            <input className="input input-sm" value={form.unit} onChange={e => set('unit', e.target.value)} placeholder="e.g. mIU/L" />
          </div>
          <div className="input-group">
            <label className="form-label">Category</label>
            <input className="input input-sm" value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Thyroid" />
          </div>
        </div>

        <div className="input-group">
          <label className="form-label">Applies To</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ v: '', label: 'All Clients' }, { v: 'male', label: 'Male' }, { v: 'female', label: 'Female' }].map(o => (
              <button key={o.v} className={`btn btn-sm ${form.sex === o.v ? 'btn-primary' : 'btn-ghost'}`} onClick={() => set('sex', o.v)}>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="label" style={{ marginBottom: 8 }}>Lab (Conventional) Range</div>
          <div className="grid-2">
            <Field label="Low" value={form.conventional_low} onChange={v => set('conventional_low', v)} />
            <Field label="High" value={form.conventional_high} onChange={v => set('conventional_high', v)} />
          </div>
        </div>

        <div>
          <div className="label" style={{ marginBottom: 8 }}>Optimal (Functional) Range</div>
          <div className="grid-2">
            <Field label="Low" value={form.optimal_low} onChange={v => set('optimal_low', v)} />
            <Field label="High" value={form.optimal_high} onChange={v => set('optimal_high', v)} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>Leave either side blank if only one direction matters (e.g. only flag if too high).</div>
        </div>

        <div className="input-group">
          <label className="form-label">Notes (your own rationale, shown to the client)</label>
          <textarea className="input" rows={3} style={{ resize: 'vertical' }}
            value={form.notes} onChange={e => set('notes', e.target.value)}
            placeholder="Why this range, what it means, what to watch for…" />
        </div>

        <div className="input-group">
          <label className="form-label">Aliases (helps PDF import matching)</label>
          <input className="input input-sm" value={form.aliases} onChange={e => set('aliases', e.target.value)}
            placeholder="e.g. Thyroid Stimulating Hormone, Thyrotropin" />
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>Comma-separated alternate names this appears under on lab reports</div>
        </div>

        <div className="input-group">
          <label className="form-label">Recommendation if below optimal</label>
          <textarea className="input" rows={2} style={{ resize: 'vertical' }}
            value={form.rec_low} onChange={e => set('rec_low', e.target.value)}
            placeholder="Nutrition/lifestyle guidance to auto-pull in when this flags low…" />
        </div>

        <div className="input-group">
          <label className="form-label">Recommendation if above optimal</label>
          <textarea className="input" rows={2} style={{ resize: 'vertical' }}
            value={form.rec_high} onChange={e => set('rec_high', e.target.value)}
            placeholder="Nutrition/lifestyle guidance to auto-pull in when this flags high…" />
        </div>

        <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : marker ? 'Save Changes' : 'Add Marker'}
          </button>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange }) {
  return (
    <div className="input-group">
      <label className="form-label">{label}</label>
      <input className="input input-sm" type="number" step="any" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

// ── Reference Library Tab ───────────────────────────────────

function ReferenceLibrary({ coachId, markers, onChanged }) {
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  async function handleDelete(id) {
    if (!confirm('Delete this marker? This does not delete past panel values that reference it.')) return
    await deleteBloodMarker(id)
    onChanged()
  }

  const grouped = useMemo(() => {
    const map = {}
    markers.forEach(m => { (map[m.category] = map[m.category] || []).push(m) })
    return map
  }, [markers])

  if (creating || editing) {
    return (
      <MarkerEditor
        marker={editing}
        coachId={coachId}
        onSave={() => { setCreating(false); setEditing(null); onChanged() }}
        onCancel={() => { setCreating(false); setEditing(null) }}
      />
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn btn-primary btn-sm" onClick={() => setCreating(true)}>+ Add Marker</button>
      </div>

      {markers.length === 0 ? (
        <div className="empty-state" style={{ height: 120 }}>
          <div className="empty-state-text">No markers yet. Add your first reference range to start building your library.</div>
        </div>
      ) : (
        Object.entries(grouped).map(([category, rows]) => (
          <div key={category} className="card section-gap">
            <div className="card-title" style={{ fontSize: 13, letterSpacing: 1.5, marginBottom: 12 }}>{category}</div>
            {rows.map(m => (
              <div key={m.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', borderBottom: '1px solid var(--border)', gap: 10,
              }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1, color: 'var(--white)' }}>
                    {m.display_name} {m.unit && <span style={{ color: 'var(--muted)', fontSize: 10 }}>({m.unit})</span>}
                    {m.sex && <span style={{ marginLeft: 6, fontSize: 9, color: 'var(--muted)' }}>· {m.sex}</span>}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                    Lab: {rangeText(m.conventional_low, m.conventional_high)} &nbsp;·&nbsp; Optimal: {rangeText(m.optimal_low, m.optimal_high)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(m)}>Edit</button>
                  <button className="btn btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(m.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}

// ── Log Panel Tab ───────────────────────────────────────────

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function LogPanel({ coachId, clients, markers }) {
  const [selectedClient, setSelectedClient] = useState('')
  const [testedDate, setTestedDate] = useState(new Date().toISOString().split('T')[0])
  const [labName, setLabName] = useState('')
  const [values, setValues] = useState({})
  const [insight, setInsight] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)
  const [importing, setImporting] = useState(false)
  const [importMsg, setImportMsg] = useState(null)

  const clientGender = clients.find(c => c.client_id === selectedClient)?.profile?.gender

  const applicableMarkers = useMemo(() => {
    return markers.filter(m => !m.sex || m.sex === clientGender)
  }, [markers, clientGender])

  const grouped = useMemo(() => {
    const map = {}
    applicableMarkers.forEach(m => { (map[m.category] = map[m.category] || []).push(m) })
    return map
  }, [applicableMarkers])

  async function handleImportPdf(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setImporting(true)
    setImportMsg(null)
    setError(null)
    try {
      const pdfBase64 = await readFileAsBase64(file)
      const res = await fetch(`${API_URL}/api/bloodwork/parse-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64,
          markers: applicableMarkers.map(m => ({ marker_key: m.marker_key, display_name: m.display_name, unit: m.unit, aliases: m.aliases })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to parse PDF')

      if (data.tested_date) setTestedDate(data.tested_date)
      if (data.lab_name) setLabName(data.lab_name)
      const count = Object.keys(data.values || {}).length
      if (count > 0) setValues(p => ({ ...p, ...data.values }))
      setImportMsg(count > 0
        ? `Extracted ${count} value${count === 1 ? '' : 's'} — review below before saving.`
        : 'No matching markers found in this PDF. Enter values manually or check your Reference Library.')
    } catch (err) {
      setError(err.message)
    } finally {
      setImporting(false)
    }
  }

  const previewResults = useMemo(() => {
    const r = {}
    Object.entries(values).forEach(([key, v]) => { if (v !== '' && v !== undefined && v !== null) r[key] = parseFloat(v) })
    return r
  }, [values])
  const flagged = useMemo(() => summarizeBloodPanel(previewResults, applicableMarkers, clientGender), [previewResults, applicableMarkers, clientGender])

  async function handleSave() {
    if (!selectedClient) { setError('Select a client first'); return }
    const results = {}
    Object.entries(values).forEach(([key, v]) => {
      if (v !== '' && v !== undefined) results[key] = parseFloat(v)
    })
    if (Object.keys(results).length === 0) { setError('Enter at least one marker value'); return }

    setSaving(true)
    setError(null)
    const { error: err } = await saveBloodPanel({
      client_id: selectedClient,
      coach_id: coachId,
      tested_date: testedDate,
      results: labName ? { ...results, _lab_name: labName } : results,
      coach_note: insight || null,
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    setValues({})
    setInsight('')
    setTimeout(() => setSaved(false), 3000)
  }

  if (markers.length === 0) {
    return (
      <div className="empty-state" style={{ height: 120 }}>
        <div className="empty-state-text">Add markers to your Reference Library first, then come back here to log a client's panel.</div>
      </div>
    )
  }

  return (
    <div>
      <div className="card section-gap">
        <div className="grid-2">
          <div className="input-group">
            <label className="form-label">Client</label>
            <select className="select" value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
              <option value="">— Select client —</option>
              {(clients || []).map(c => (
                <option key={c.id} value={c.client_id}>{c.profile?.full_name}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label className="form-label">Test Date</label>
            <input className="input" type="date" value={testedDate} onChange={e => setTestedDate(e.target.value)} />
          </div>
        </div>
        <div className="input-group" style={{ marginTop: 14 }}>
          <label className="form-label">Lab Name (optional)</label>
          <input className="input input-sm" value={labName} onChange={e => setLabName(e.target.value)} placeholder="e.g. Medichecks" />
        </div>
      </div>

      {!selectedClient ? (
        <div className="empty-state" style={{ height: 80 }}>
          <div className="empty-state-text">Select a client to enter their panel values.</div>
        </div>
      ) : (
        <>
          <div className="card section-gap">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div className="label" style={{ marginBottom: 4 }}>Import from PDF</div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>Upload a lab report to prefill values below — review before saving.</div>
              </div>
              <label className={`btn btn-sm ${importing ? 'btn-ghost' : 'btn-primary'}`} style={{ cursor: 'pointer' }}>
                {importing ? 'Reading PDF…' : 'Choose PDF'}
                <input type="file" accept="application/pdf" onChange={handleImportPdf} disabled={importing} style={{ display: 'none' }} />
              </label>
            </div>
            {importMsg && <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 10 }}>{importMsg}</div>}
          </div>

          {Object.entries(grouped).map(([category, rows]) => (
            <div key={category} className="card section-gap">
              <div className="card-title" style={{ fontSize: 13, letterSpacing: 1.5, marginBottom: 12 }}>{category}</div>
              {rows.map(m => {
                const raw = values[m.marker_key] ?? ''
                const numeric = raw === '' ? null : parseFloat(raw)
                const { status, color } = classifyBloodMarker(numeric, {
                  conventionalLow: m.conventional_low, conventionalHigh: m.conventional_high,
                  optimalLow: m.optimal_low, optimalHigh: m.optimal_high,
                })
                const label = STATUS_LABELS[status]
                return (
                  <div key={m.marker_key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1, color: 'var(--white)' }}>{m.display_name}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                        Lab: {rangeText(m.conventional_low, m.conventional_high)} · Optimal: {rangeText(m.optimal_low, m.optimal_high)} {m.unit}
                      </div>
                    </div>
                    <input className="input input-sm" type="number" step="any" style={{ width: 100 }}
                      value={raw} onChange={e => setValues(p => ({ ...p, [m.marker_key]: e.target.value }))} />
                    <span style={{ fontSize: 10, color: label.color, minWidth: 130, textAlign: 'right' }}>{numeric !== null ? label.text : ''}</span>
                  </div>
                )
              })}
            </div>
          ))}

          {(flagged.red.length > 0 || flagged.amber.length > 0) && (
            <div className="card section-gap">
              <div className="card-title" style={{ fontSize: 13, letterSpacing: 1.5, marginBottom: 12 }}>Flagged Markers</div>
              {[...flagged.red, ...flagged.amber].map(f => (
                <div key={f.key} style={{ padding: '8px 12px', borderLeft: `3px solid ${f.status.startsWith('out_of_range') ? 'var(--danger)' : 'var(--warn)'}`, background: 'var(--s4)', borderRadius: 4, marginBottom: 8 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1, color: f.status.startsWith('out_of_range') ? 'var(--danger)' : 'var(--warn)' }}>
                    {f.displayName} — {f.value} {f.unit}
                  </div>
                  {f.recText && <div style={{ fontSize: 11, color: 'var(--sub)', marginTop: 4, lineHeight: 1.5 }}>{f.recText}</div>}
                </div>
              ))}
            </div>
          )}

          <div className="card section-gap">
            <div className="input-group">
              <label className="form-label">Overall Insight (your written summary for the client)</label>
              <textarea className="input" rows={4} style={{ resize: 'vertical' }}
                value={insight} onChange={e => setInsight(e.target.value)}
                placeholder="What stands out in this panel, and what you'd like the client to do about it…" />
            </div>
            {error && <div style={{ fontSize: 11, color: 'var(--danger)', marginTop: 8 }}>{error}</div>}
            <button className={`btn btn-sm ${saved ? 'btn-ghost' : 'btn-primary'}`} style={{ marginTop: 12, minWidth: 160 }}
              onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : saved ? '✓ Panel Saved' : 'Save Panel →'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────

export default function Bloodwork() {
  const { user } = useAuth()
  const { clients } = useCoach()
  const [activeTab, setActiveTab] = useState('library')
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadMarkers() {
    if (!user) return
    setLoading(true)
    const { data } = await getBloodMarkers(user.id)
    setMarkers(data || [])
    setLoading(false)
  }

  useEffect(() => { loadMarkers() }, [user])

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Bloodwork</div>
          <div className="page-subtitle">Your reference ranges and client panel results</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        <button className={`btn btn-sm ${activeTab === 'library' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('library')}>
          Reference Library
        </button>
        <button className={`btn btn-sm ${activeTab === 'log' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setActiveTab('log')}>
          Log Panel
        </button>
      </div>

      {loading ? (
        <div className="empty-state" style={{ height: 120 }}><div className="empty-state-text">Loading…</div></div>
      ) : activeTab === 'library' ? (
        <ReferenceLibrary coachId={user?.id} markers={markers} onChanged={loadMarkers} />
      ) : (
        <LogPanel coachId={user?.id} clients={clients} markers={markers} />
      )}

      <Disclaimer />
    </div>
  )
}
