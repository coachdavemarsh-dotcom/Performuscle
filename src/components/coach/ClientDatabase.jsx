import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase.js'

const GOAL_LABELS = {
  cut:            { label: 'Fat Loss',       color: '#f472b6' },
  aggressive_cut: { label: 'Agg. Cut',       color: '#ef4444' },
  lean_gain:      { label: 'Lean Gain',      color: '#00C896' },
  gain:           { label: 'Muscle Gain',    color: '#a78bfa' },
  maintain:       { label: 'Maintenance',    color: '#f59e0b' },
  recomp:         { label: 'Recomp',         color: '#60a5fa' },
}

const PLAN_LABELS = {
  starter:    { label: 'Starter',    color: '#9ca3af' },
  essential:  { label: 'Essential',  color: '#60a5fa' },
  premium:    { label: 'Premium',    color: '#00C896' },
  elite:      { label: 'Elite',      color: '#f59e0b' },
}

function Tag({ label, color }) {
  if (!label) return <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>
  return (
    <span style={{
      fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.06em',
      color, background: color + '22', border: `1px solid ${color}44`,
      borderRadius: 4, padding: '2px 7px', whiteSpace: 'nowrap',
    }}>{label.toUpperCase()}</span>
  )
}

function BPTag({ systolic, diastolic }) {
  if (!systolic || !diastolic) return <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>
  const cat = systolic < 120 && diastolic < 80 ? { label: 'Normal', color: 'var(--accent)' }
    : systolic < 130 && diastolic < 80 ? { label: 'Elevated', color: 'var(--warn)' }
    : systolic < 140 || diastolic < 90 ? { label: 'High 1', color: '#fb923c' }
    : { label: 'High 2', color: 'var(--danger)' }
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--white)' }}>{systolic}/{diastolic}</div>
      <Tag label={cat.label} color={cat.color} />
    </div>
  )
}

export default function ClientDatabase() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('full_name')
  const [sortDir, setSortDir] = useState('asc')
  const [goalFilter, setGoalFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    if (!user?.id) return
    supabase
      .from('clients')
      .select(`
        *,
        profile:profiles!client_id(
          id, full_name, date_of_birth, gender, height_cm, current_weight,
          goal_type, target_weight, training_experience, activity_level,
          occupation, sleep_hours, stress_level, injuries,
          waist_cm, neck_cm, hips_cm, plan, check_in_day,
          address_line1, city, postcode, country,
          systolic_bp, diastolic_bp, onboarding_complete
        )
      `)
      .eq('coach_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setClients(data || []); setLoading(false) })
  }, [user?.id])

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  function calcAge(dob) {
    if (!dob) return null
    const diff = Date.now() - new Date(dob).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  }

  const filtered = useMemo(() => {
    return clients
      .filter(c => {
        const name = c.profile?.full_name?.toLowerCase() || ''
        if (search && !name.includes(search.toLowerCase())) return false
        if (goalFilter !== 'all' && c.profile?.goal_type !== goalFilter) return false
        return true
      })
      .sort((a, b) => {
        let va, vb
        if (sortKey === 'full_name') { va = a.profile?.full_name || ''; vb = b.profile?.full_name || '' }
        else if (sortKey === 'weight') { va = a.profile?.current_weight || 0; vb = b.profile?.current_weight || 0 }
        else if (sortKey === 'age') { va = calcAge(a.profile?.date_of_birth) || 0; vb = calcAge(b.profile?.date_of_birth) || 0 }
        else if (sortKey === 'plan') { va = a.profile?.plan || ''; vb = b.profile?.plan || '' }
        else { va = a.created_at; vb = b.created_at }
        if (va < vb) return sortDir === 'asc' ? -1 : 1
        if (va > vb) return sortDir === 'asc' ? 1 : -1
        return 0
      })
  }, [clients, search, sortKey, sortDir, goalFilter])

  const SortHeader = ({ label, k }) => (
    <th
      onClick={() => toggleSort(k)}
      style={{ cursor: 'pointer', userSelect: 'none', color: sortKey === k ? 'var(--accent)' : 'var(--muted)', whiteSpace: 'nowrap' }}
    >
      {label} {sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : ''}
    </th>
  )

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Client Database</div>
          <div className="page-subtitle">{clients.length} client{clients.length !== 1 ? 's' : ''} — full profile view</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="input" style={{ width: 220 }}
          placeholder="Search by name…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[{ v: 'all', l: 'All Goals' }, ...Object.entries(GOAL_LABELS).map(([v, g]) => ({ v, l: g.label }))].map(g => (
            <button
              key={g.v}
              className={`btn btn-sm ${goalFilter === g.v ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setGoalFilter(g.v)}
            >{g.l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ minWidth: 900 }}>
            <thead>
              <tr>
                <SortHeader label="Name" k="full_name" />
                <SortHeader label="Age" k="age" />
                <th style={{ color: 'var(--muted)' }}>Gender</th>
                <SortHeader label="Weight" k="weight" />
                <th style={{ color: 'var(--muted)' }}>Goal</th>
                <SortHeader label="Plan" k="plan" />
                <th style={{ color: 'var(--muted)' }}>BP</th>
                <th style={{ color: 'var(--muted)' }}>Location</th>
                <th style={{ color: 'var(--muted)' }}>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>No clients match filters</td></tr>
              ) : filtered.map(c => {
                const p = c.profile || {}
                const age = calcAge(p.date_of_birth)
                const goal = GOAL_LABELS[p.goal_type]
                const plan = PLAN_LABELS[p.plan]
                const isExpanded = expandedId === c.client_id
                return [
                  <tr
                    key={c.client_id}
                    onClick={() => setExpandedId(isExpanded ? null : c.client_id)}
                    style={{ cursor: 'pointer', background: isExpanded ? 'rgba(0,200,150,0.04)' : undefined }}
                  >
                    <td>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--white)', fontWeight: 500 }}>{p.full_name || '—'}</div>
                      {!p.onboarding_complete && <div style={{ fontSize: 10, color: 'var(--warn)' }}>Onboarding incomplete</div>}
                    </td>
                    <td style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>{age ?? '—'}</td>
                    <td style={{ color: 'var(--sub)', fontSize: 13, textTransform: 'capitalize' }}>{p.gender || '—'}</td>
                    <td style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>{p.current_weight ? `${p.current_weight} kg` : '—'}</td>
                    <td>{goal ? <Tag label={goal.label} color={goal.color} /> : <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                    <td>{plan ? <Tag label={plan.label} color={plan.color} /> : <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                    <td><BPTag systolic={p.systolic_bp} diastolic={p.diastolic_bp} /></td>
                    <td style={{ color: 'var(--sub)', fontSize: 12 }}>{p.city ? `${p.city}${p.country ? `, ${p.country}` : ''}` : '—'}</td>
                    <td>
                      <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                        {isExpanded ? '▲ Less' : '▼ More'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={e => { e.stopPropagation(); navigate(`/coach/client/${c.client_id}`) }}
                      >Profile →</button>
                    </td>
                  </tr>,
                  isExpanded && (
                    <tr key={`${c.client_id}-expanded`} style={{ background: 'rgba(0,200,150,0.03)' }}>
                      <td colSpan={10} style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                          {[
                            { label: 'Date of Birth', value: p.date_of_birth || '—' },
                            { label: 'Height', value: p.height_cm ? `${p.height_cm} cm` : '—' },
                            { label: 'Target Weight', value: p.target_weight ? `${p.target_weight} kg` : '—' },
                            { label: 'Training Exp.', value: p.training_experience || '—', caps: true },
                            { label: 'Activity Level', value: p.activity_level || '—', caps: true },
                            { label: 'Occupation', value: p.occupation || '—' },
                            { label: 'Avg Sleep', value: p.sleep_hours ? `${p.sleep_hours}h/night` : '—' },
                            { label: 'Stress Level', value: p.stress_level ? `${p.stress_level}/5` : '—' },
                            { label: 'Waist', value: p.waist_cm ? `${p.waist_cm} cm` : '—' },
                            { label: 'Neck', value: p.neck_cm ? `${p.neck_cm} cm` : '—' },
                            { label: 'Hips', value: p.hips_cm ? `${p.hips_cm} cm` : '—' },
                            { label: 'Address', value: [p.address_line1, p.city, p.postcode, p.country].filter(Boolean).join(', ') || '—' },
                          ].map(f => (
                            <div key={f.label}>
                              <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: '0.07em', color: 'var(--muted)', marginBottom: 3 }}>{f.label.toUpperCase()}</div>
                              <div style={{ fontSize: 13, color: 'var(--white)', textTransform: f.caps ? 'capitalize' : 'none' }}>{f.value}</div>
                            </div>
                          ))}
                          {p.injuries && (
                            <div style={{ gridColumn: '1 / -1' }}>
                              <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: '0.07em', color: 'var(--muted)', marginBottom: 3 }}>INJURIES / HEALTH CONCERNS</div>
                              <div style={{ fontSize: 13, color: 'var(--white)' }}>{p.injuries}</div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                ]
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
