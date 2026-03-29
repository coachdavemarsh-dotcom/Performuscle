import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useClient } from '../../hooks/useClient.js'
import {
  getMeasurements, insertMeasurement,
  uploadProgressPhoto, updateMeasurementPhotos,
  insertNotification,
} from '../../lib/supabase.js'
import BWChart from '../shared/BWChart.jsx'
import { navalBF, leanMass, fmt } from '../../lib/calculators.js'

const TODAY = new Date().toISOString().split('T')[0]

const POSITIONS = ['front', 'back', 'left', 'right', 'flexed']

const MEASUREMENT_FIELDS = [
  { key: 'body_weight_kg', label: 'Body Weight', unit: 'kg', step: 0.1 },
  { key: 'neck_cm',        label: 'Neck',        unit: 'cm', step: 0.5 },
  { key: 'waist_cm',       label: 'Waist',       unit: 'cm', step: 0.5 },
  { key: 'hips_cm',        label: 'Hips',        unit: 'cm', step: 0.5 },
  { key: 'chest_cm',       label: 'Chest',       unit: 'cm', step: 0.5 },
  { key: 'arm_l_cm',       label: 'Arm (L)',     unit: 'cm', step: 0.5 },
  { key: 'arm_r_cm',       label: 'Arm (R)',     unit: 'cm', step: 0.5 },
  { key: 'thigh_l_cm',     label: 'Thigh (L)',   unit: 'cm', step: 0.5 },
  { key: 'thigh_r_cm',     label: 'Thigh (R)',   unit: 'cm', step: 0.5 },
]

// ─── measurement form ─────────────────────────────────────────────────────────

function MeasurementForm({ onSaved, profile }) {
  const { user } = useAuth()
  const [date, setDate]   = useState(TODAY)
  const [vals, setVals]   = useState({})
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  const gender = profile?.gender || 'male'
  const height = profile?.height_cm

  const bf  = navalBF(gender, vals.waist_cm, vals.neck_cm, height, vals.hips_cm)
  const lbm = bf !== null && vals.body_weight_kg ? leanMass(parseFloat(vals.body_weight_kg), bf) : null

  async function handleSave() {
    setSaving(true)
    await insertMeasurement({
      client_id: user.id,
      measured_date: date,
      ...Object.fromEntries(Object.entries(vals).map(([k, v]) => [k, v !== '' ? parseFloat(v) : null])),
      bf_percent: bf,
      lean_mass_kg: lbm,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onSaved?.()
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Log Measurements</div>
        <input
          className="input input-sm"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={{ width: 140 }}
        />
      </div>

      <div className="grid-3" style={{ marginBottom: 16 }}>
        {MEASUREMENT_FIELDS.map(field => (
          <div key={field.key} className="input-group">
            <label className="form-label">{field.label} ({field.unit})</label>
            <input
              className="input input-sm"
              type="number"
              step={field.step}
              placeholder={field.label}
              value={vals[field.key] ?? ''}
              onChange={e => setVals(v => ({ ...v, [field.key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      {bf !== null && (
        <div className="card-sm card-accent" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <div className="label">Naval BF%</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{bf}%</div>
            </div>
            {lbm && (
              <div>
                <div className="label">Lean Mass</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{lbm} kg</div>
              </div>
            )}
            <div style={{ fontSize: 11, color: 'var(--muted)', alignSelf: 'flex-end', paddingBottom: 2 }}>
              Calculated from neck, waist{gender === 'female' ? ', hips' : ''}, height
            </div>
          </div>
        </div>
      )}

      <button
        className={`btn ${saved ? 'btn-primary' : 'btn-ghost'}`}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? '…' : saved ? 'SAVED ✓' : 'SAVE MEASUREMENTS'}
      </button>
    </div>
  )
}

// ─── progress photo upload ────────────────────────────────────────────────────

function PhotoUploadCard({ measurements, coachId, onPhotosUpdated }) {
  const { user, profile } = useAuth()
  const [date, setDate]         = useState(TODAY)
  const [position, setPosition] = useState('front')
  const [preview, setPreview]   = useState(null)
  const [file, setFile]         = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded]   = useState(false)
  const fileRef = useRef(null)

  // Find the measurement record for the selected date
  const measurementForDate = measurements.find(m => m.measured_date === date)

  function handleFileChange(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setUploaded(false)
  }

  async function handleUpload() {
    if (!file || !user) return
    setUploading(true)

    // Upload to Supabase Storage
    const { url, error } = await uploadProgressPhoto(user.id, date, position, file)
    if (error || !url) {
      console.error('Photo upload failed', error)
      setUploading(false)
      return
    }

    // Update or create measurement record with photo URL
    if (measurementForDate) {
      const updatedPhotos = { ...(measurementForDate.photos || {}), [position]: url }
      await updateMeasurementPhotos(measurementForDate.id, updatedPhotos)
    } else {
      // Insert a measurement record just to store the photo
      const { data: newMeasurement } = await insertMeasurement({
        client_id: user.id,
        measured_date: date,
        photos: { [position]: url },
      })
    }

    // Notify coach
    if (coachId) {
      await insertNotification({
        coachId,
        clientId: user.id,
        type: 'progress_photo',
        title: 'New progress photo',
        body: `${profile?.full_name || 'Client'} uploaded a ${position} photo for ${date}`,
        data: { date, position, url },
      })
    }

    setUploading(false)
    setUploaded(true)
    setFile(null)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
    onPhotosUpdated?.()
  }

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: 14 }}>Upload Progress Photo</div>

      {/* Date + Position */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <div className="input-group" style={{ flex: 1, minWidth: 130 }}>
          <label className="form-label">Date</label>
          <input
            className="input input-sm"
            type="date"
            value={date}
            onChange={e => { setDate(e.target.value); setUploaded(false) }}
          />
        </div>
        <div className="input-group" style={{ flex: 1, minWidth: 130 }}>
          <label className="form-label">Position</label>
          <select
            className="select input-sm"
            value={position}
            onChange={e => setPosition(e.target.value)}
          >
            {POSITIONS.map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Preview area */}
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          width: '100%', aspectRatio: '3/4', maxHeight: 280,
          background: 'var(--s4)',
          border: `2px dashed ${preview ? 'var(--accent)' : 'var(--border-hi)'}`,
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', overflow: 'hidden', marginBottom: 12,
          position: 'relative', transition: 'border-color .2s',
        }}
      >
        {preview ? (
          <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📸</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1 }}>TAP TO SELECT PHOTO</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>JPG or PNG</div>
          </div>
        )}
        {uploaded && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,200,150,.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--accent)', letterSpacing: 1 }}>✓ UPLOADED</div>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <button
        className={`btn ${uploaded ? 'btn-primary' : file ? 'btn-primary' : 'btn-ghost'}`}
        style={{ width: '100%' }}
        onClick={preview ? handleUpload : () => fileRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading…' : uploaded ? '✓ PHOTO SAVED' : preview ? 'SAVE PHOTO' : 'SELECT PHOTO'}
      </button>
    </div>
  )
}

// ─── photo comparison ─────────────────────────────────────────────────────────

function PhotoComparison({ measurements }) {
  const [dateA, setDateA] = useState('')
  const [dateB, setDateB] = useState('')
  const [view,  setView]  = useState('front')

  const datesWithPhotos = [...new Set(
    measurements
      .filter(m => m.photos && Object.keys(m.photos).length > 0)
      .map(m => m.measured_date)
  )].sort().reverse()

  const allDates = [...new Set(measurements.map(m => m.measured_date))].sort().reverse()

  return (
    <div className="card">
      <div className="card-title" style={{ marginBottom: 12 }}>Photo Comparison</div>

      {/* Date pickers */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        <select className="select" style={{ flex: 1 }} value={dateA} onChange={e => setDateA(e.target.value)}>
          <option value="">Before date</option>
          {allDates.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="select" style={{ flex: 1 }} value={dateB} onChange={e => setDateB(e.target.value)}>
          <option value="">After date</option>
          {allDates.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Position tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {POSITIONS.map(pos => (
          <button
            key={pos}
            className={`btn btn-sm ${view === pos ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setView(pos)}
          >
            {pos.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Side-by-side photos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[{ label: 'Before', date: dateA }, { label: 'After', date: dateB }].map(({ label, date }) => {
          const m = measurements.find(m => m.measured_date === date)
          const photoUrl = m?.photos?.[view]
          return (
            <div key={label} style={{
              background: 'var(--s4)', borderRadius: 8,
              border: `1px solid ${photoUrl ? 'var(--border-hi)' : 'var(--border)'}`,
              aspectRatio: '3/4', display: 'flex', alignItems: 'center',
              justifyContent: 'center', overflow: 'hidden', position: 'relative',
            }}>
              {photoUrl ? (
                <img src={photoUrl} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 12 }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>📸</div>
                  <div className="label">{label}</div>
                  <div style={{ fontSize: 10, marginTop: 4 }}>{date ? 'No photo for this date' : 'Select a date'}</div>
                </div>
              )}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '6px 10px', background: 'rgba(6,6,8,0.7)',
                fontFamily: 'var(--font-display)', fontSize: 10,
                letterSpacing: 1, color: 'var(--accent)',
              }}>
                {label}{date ? ` — ${date}` : ''}
              </div>
            </div>
          )
        })}
      </div>

      {datesWithPhotos.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: 12 }}>
          Upload progress photos above to compare them here
        </div>
      )}
    </div>
  )
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function Progress() {
  const { user, profile } = useAuth()
  const { clientRecord }  = useClient()
  const [measurements, setMeasurements] = useState([])
  const [loading, setLoading]           = useState(true)
  const [tab, setTab]                   = useState('measurements') // 'measurements' | 'photos'

  useEffect(() => {
    if (!user) return
    loadData()
  }, [user])

  async function loadData() {
    setLoading(true)
    const { data } = await getMeasurements(user.id, 30)
    setMeasurements(data || [])
    setLoading(false)
  }

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>

  const latest      = measurements[0]
  const prev        = measurements[1]
  const weightChange = latest && prev ? (latest.body_weight_kg - prev.body_weight_kg) : null
  const coachId     = clientRecord?.coach_id

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Progress</div>
        <div className="page-subtitle">Body composition tracking and trends</div>
      </div>

      {/* Summary stats */}
      <div className="grid-4 section-gap">
        <div className="stat-card">
          <div className="label">Current Weight</div>
          <div className="stat-value">{fmt(latest?.body_weight_kg, ' kg')}</div>
        </div>
        <div className="stat-card" style={{
          borderLeftColor: weightChange < 0 ? 'var(--accent)' : weightChange > 0 ? 'var(--warn)' : 'var(--s5)',
        }}>
          <div className="label">Weight Change</div>
          <div className="stat-value" style={{ fontSize: 28 }}>
            {weightChange !== null ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg` : '—'}
          </div>
          <div className="stat-sub">vs previous</div>
        </div>
        <div className="stat-card">
          <div className="label">Body Fat %</div>
          <div className="stat-value">{latest?.bf_percent ? `${latest.bf_percent}%` : '—'}</div>
        </div>
        <div className="stat-card">
          <div className="label">Lean Mass</div>
          <div className="stat-value">{fmt(latest?.lean_mass_kg, ' kg')}</div>
        </div>
      </div>

      {/* Weight chart */}
      <div className="section-gap">
        <BWChart entries={measurements} height={220} />
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 6, margin: '20px 0 16px' }}>
        {[
          { value: 'measurements', label: '📏 Measurements' },
          { value: 'photos',       label: '📸 Progress Photos' },
        ].map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8,
              border: `1.5px solid ${tab === t.value ? 'var(--accent)' : 'var(--border-hi)'}`,
              background: tab === t.value ? 'rgba(0,200,150,.10)' : 'var(--s2)',
              color: tab === t.value ? 'var(--accent)' : 'var(--sub)',
              fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 0.5,
              cursor: 'pointer', transition: 'all .15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Measurements tab */}
      {tab === 'measurements' && (
        <div className="grid-2 section-gap">
          <MeasurementForm onSaved={loadData} profile={profile} />
          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Measurement History</div>
            {measurements.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-title">No measurements yet</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th><th>Weight</th><th>BF%</th><th>Lean</th><th>Waist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {measurements.slice(0, 10).map(m => (
                      <tr key={m.id}>
                        <td style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1 }}>
                          {new Date(m.measured_date).toLocaleDateString('en-GB')}
                        </td>
                        <td>{fmt(m.body_weight_kg, ' kg')}</td>
                        <td>{fmt(m.bf_percent, '%')}</td>
                        <td>{fmt(m.lean_mass_kg, ' kg')}</td>
                        <td>{fmt(m.waist_cm, ' cm')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Photos tab */}
      {tab === 'photos' && (
        <div className="grid-2 section-gap">
          <PhotoUploadCard
            measurements={measurements}
            coachId={coachId}
            onPhotosUpdated={loadData}
          />
          <PhotoComparison measurements={measurements} />
        </div>
      )}
    </div>
  )
}
