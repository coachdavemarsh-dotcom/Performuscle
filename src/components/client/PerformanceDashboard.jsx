import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase.js'
import { epley } from '../../lib/calculators.js'
import TrainingZonesPanel from '../shared/TrainingZonesPanel.jsx'

function est1RM(weight, reps) {
  if (!weight || !reps || reps <= 0 || weight <= 0) return 0
  return epley(weight, reps)
}

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32']

function StatCard({ label, value, sub, color = 'var(--accent)' }) {
  return (
    <div className="card" style={{ padding: '20px 24px', flex: 1, minWidth: 140 }}>
      <div className="label" style={{ marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1, color }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>{sub}</div>}
    </div>
  )
}

function OneRMCard({ rank, name, est, bestWeight, bestReps }) {
  const rankColor = rank <= 3 ? RANK_COLORS[rank - 1] : 'var(--accent)'
  const isTop3 = rank <= 3

  return (
    <div className="card" style={{
      padding: '14px 16px',
      border: isTop3 ? `1px solid ${rankColor}44` : '1px solid var(--border)',
      background: isTop3 ? `${rankColor}08` : 'var(--s2)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 8, right: 10,
        fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1,
        color: rankColor, opacity: isTop3 ? 0.8 : 0.4,
      }}>#{rank}</div>

      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1,
        color: 'var(--muted)', marginBottom: 6, paddingRight: 24,
        textTransform: 'uppercase',
      }}>{name}</div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, lineHeight: 1, color: rankColor }}>
          {est}
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)' }}>kg</span>
      </div>

      <div style={{ fontSize: 10, color: 'var(--muted)' }}>
        from {bestReps} × {bestWeight}kg
      </div>
    </div>
  )
}

export default function PerformanceDashboard() {
  const { user } = useAuth()
  const [setLogs, setSetLogs]       = useState(null)
  const [sessionCount, setSessionCount] = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  useEffect(() => {
    if (!user?.id) return
    let cancelled = false

    async function load() {
      try {
        const [logsRes, sessRes] = await Promise.all([
          supabase
            .from('set_logs')
            .select('weight_kg, reps, logged_at, exercises(name)')
            .eq('client_id', user.id)
            .eq('is_completed', true)
            .gt('weight_kg', 0)
            .gt('reps', 0),
          supabase
            .from('sessions')
            .select('id', { count: 'exact', head: true })
            .eq('client_id', user.id)
            .eq('is_completed', true),
        ])
        if (cancelled) return
        if (logsRes.error) throw logsRes.error
        setSetLogs(logsRes.data || [])
        setSessionCount(sessRes.count || 0)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [user?.id])

  const stats = useMemo(() => {
    if (!setLogs) return null
    const totalVolumeKg = setLogs.reduce((sum, s) => sum + s.weight_kg * s.reps, 0)
    const totalSets = setLogs.length
    const dates = setLogs.map(s => s.logged_at).filter(Boolean).sort()
    const daysTraining = dates.length > 1
      ? Math.ceil((new Date(dates[dates.length - 1]) - new Date(dates[0])) / 86400000) + 1
      : dates.length
    return {
      totalVolumeKg: Math.round(totalVolumeKg),
      totalVolumeTonnes: (totalVolumeKg / 1000).toFixed(1),
      totalSets,
      daysTraining,
    }
  }, [setLogs])

  const top1RMs = useMemo(() => {
    if (!setLogs || setLogs.length === 0) return []
    const byExercise = {}
    for (const s of setLogs) {
      const name = s.exercises?.name
      if (!name) continue
      const est = est1RM(s.weight_kg, s.reps)
      if (!byExercise[name] || est > byExercise[name].est) {
        byExercise[name] = { name, est, bestWeight: s.weight_kg, bestReps: s.reps }
      }
    }
    return Object.values(byExercise)
      .sort((a, b) => b.est - a.est)
      .slice(0, 9)
  }, [setLogs])

  const hasStrengthData = setLogs && setLogs.length > 0

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Performance Hub</div>
          <div className="page-subtitle">
            Your lifetime training stats, predicted maxes, and current zones — all in one place.{' '}
            <Link to="/results" style={{ color: 'var(--accent)' }}>View test history →</Link>
          </div>
        </div>
      </div>

      {/* ── HERO STATS ─────────────────────────────────────────────────── */}
      <div className="section-gap">
        <div className="label" style={{ marginBottom: 12 }}>Lifetime Stats</div>
        {loading ? (
          <div style={{ display: 'flex', gap: 12 }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="card" style={{ flex: 1, minWidth: 140, height: 100, opacity: 0.4 }} />
            ))}
          </div>
        ) : error ? (
          <div className="card" style={{ padding: 16, color: 'var(--danger)' }}>{error}</div>
        ) : (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <StatCard
              label="Total Volume"
              value={stats?.totalVolumeTonnes ?? '—'}
              sub="tonnes lifted"
              color="var(--accent)"
            />
            <StatCard
              label="Sessions Done"
              value={sessionCount ?? '—'}
              sub="completed workouts"
              color="var(--accent)"
            />
            <StatCard
              label="Sets Logged"
              value={stats?.totalSets?.toLocaleString() ?? '—'}
              sub="total sets completed"
              color="#60a5fa"
            />
            <StatCard
              label="Days Training"
              value={stats?.daysTraining ?? '—'}
              sub="since first session"
              color="#a78bfa"
            />
          </div>
        )}
      </div>

      {/* ── PREDICTED 1RMs ─────────────────────────────────────────────── */}
      <div className="section-gap">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div className="label">Predicted 1-Rep Maxes</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              Epley formula applied to your best logged sets
            </div>
          </div>
          <Link to="/training" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none' }}>
            Log a session →
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="card" style={{ height: 90, opacity: 0.4 }} />
            ))}
          </div>
        ) : !hasStrengthData ? (
          <div className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 1, color: 'var(--muted)', marginBottom: 8 }}>
              NO DATA YET
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
              Complete some sessions and log your sets — your predicted maxes will appear here.
            </div>
            <Link
              to="/training"
              className="btn btn-primary"
              style={{ display: 'inline-block', textDecoration: 'none', padding: '8px 20px' }}
            >
              Start Training
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {top1RMs.map((ex, i) => (
              <OneRMCard
                key={ex.name}
                rank={i + 1}
                name={ex.name}
                est={ex.est}
                bestWeight={ex.bestWeight}
                bestReps={ex.bestReps}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── TRAINING ZONES ─────────────────────────────────────────────── */}
      <div className="section-gap">
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div className="label">Training Zones</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              Heart rate, pace, power, and swim zones from your latest tests
            </div>
          </div>
          <Link to="/training-zones" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none' }}>
            Full zones view →
          </Link>
        </div>
        <TrainingZonesPanel clientId={user?.id} />
      </div>
    </div>
  )
}
