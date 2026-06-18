import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase.js'

const PROVIDER_ICONS = {
  APPLE: '🍎', GARMIN: '⌚', FITBIT: '⌚',
  GOOGLE: '📱', POLAR: '⌚', SUUNTO: '⌚', WHOOP: '⌚', SAMSUNG: '📱',
}
const PROVIDER_NAMES = {
  APPLE: 'Apple Health', GARMIN: 'Garmin', FITBIT: 'Fitbit',
  GOOGLE: 'Google Fit', POLAR: 'Polar', SUUNTO: 'Suunto', WHOOP: 'Whoop', SAMSUNG: 'Samsung Health',
}

function deriveTarget(activity, weight = 80, goalType = 'maintain') {
  if (!activity?.total_burned_calories) return null
  const goalAdjust = { cut: -400, maintain: 0, gain: 250, recomp: -200 }[goalType] ?? 0
  const isTrainingDay = (activity.activity_calories || 0) > 250 || (activity.active_seconds || 0) > 1200
  const kcal = Math.round((activity.total_burned_calories + goalAdjust) / 50) * 50
  const protein_g = Math.round(weight * 2.0 / 5) * 5
  const fat_g = isTrainingDay ? Math.round(weight * 0.8 / 5) * 5 : Math.round(weight * 1.1 / 5) * 5
  const carbs_g = Math.max(0, Math.round((kcal - protein_g * 4 - fat_g * 9) / 4 / 5) * 5)
  return { kcal, protein_g, carbs_g, fat_g, isTrainingDay }
}

export default function DailyEnergyCard() {
  const { user } = useAuth()
  const [state, setState] = useState({ activity: null, connection: null, weight: null, goalType: null, todayKcal: 0, loaded: false })

  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    if (!user) return
    load()
  }, [user])

  async function load() {
    const [actRes, connRes, measRes, progRes, logRes] = await Promise.all([
      supabase.from('terra_daily_activity').select('*').eq('user_id', user.id).eq('date', today)
        .order('updated_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('terra_connections').select('provider, connected_at').eq('user_id', user.id)
        .order('connected_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('measurements').select('body_weight_kg').eq('client_id', user.id)
        .order('measured_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('programs').select('goal_type').eq('client_id', user.id).eq('is_active', true)
        .limit(1).maybeSingle(),
      supabase.from('nutrition_logs').select('total_kcal').eq('client_id', user.id).eq('logged_date', today)
        .maybeSingle(),
    ])
    setState({
      activity: actRes.data,
      connection: connRes.data,
      weight: measRes.data?.body_weight_kg || null,
      goalType: progRes.data?.goal_type || 'maintain',
      todayKcal: logRes.data?.total_kcal || 0,
      loaded: true,
    })
  }

  const { activity, connection, weight, goalType, todayKcal, loaded } = state

  // Only show if Terra is connected
  if (!loaded || !connection) return null

  const target = deriveTarget(activity, weight || 80, goalType)
  const pct = target ? Math.min(100, Math.round((todayKcal / target.kcal) * 100)) : 0
  const gap = target ? target.kcal - todayKcal : 0

  const barColor = pct >= 100 ? 'var(--accent)' : pct >= 75 ? 'var(--warn)' : 'var(--accent)'

  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1, color: 'var(--white)' }}>
          TODAY'S FUEL TARGET
        </div>
        <div style={{ fontSize: 10, color: 'var(--muted)' }}>
          {activity
            ? `${PROVIDER_ICONS[activity.provider] || '📱'} ${PROVIDER_NAMES[activity.provider] || activity.provider}`
            : `${PROVIDER_ICONS[connection.provider] || '📱'} syncing…`}
        </div>
      </div>

      {/* No data yet — waiting for first sync */}
      {!target && (
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
          Waiting for today's data from {PROVIDER_NAMES[connection.provider] || 'your wearable'}.
          Data usually arrives within a few minutes of your first sync.
        </div>
      )}

      {/* Live data */}
      {target && (
        <>
          {/* Calorie target */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--accent)', lineHeight: 1 }}>
                {target.kcal.toLocaleString()}
              </span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>kcal today</span>
              {target.isTrainingDay && (
                <span style={{
                  fontSize: 8, fontFamily: 'var(--font-display)', letterSpacing: 1,
                  padding: '3px 8px', borderRadius: 4,
                  background: 'rgba(0,200,150,0.15)', color: 'var(--accent)',
                  border: '1px solid var(--border-accent)',
                }}>TRAINING DAY</span>
              )}
            </div>

            {/* Progress bar */}
            <div style={{ height: 6, borderRadius: 3, background: 'var(--s3)', overflow: 'hidden', marginBottom: 5 }}>
              <div style={{
                width: `${pct}%`, height: '100%', borderRadius: 3,
                background: barColor, transition: 'width 0.6s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)' }}>
              <span>{Math.round(todayKcal).toLocaleString()} kcal logged</span>
              <span style={{ color: gap > 0 ? 'var(--warn)' : 'var(--accent)' }}>
                {gap > 0
                  ? `${gap.toLocaleString()} to go${target.isTrainingDay ? ' · prioritise carbs' : ''}`
                  : `${Math.abs(gap).toLocaleString()} over target`}
              </span>
            </div>
          </div>

          {/* Activity stats from Terra */}
          <div style={{
            display: 'flex', gap: 0, marginBottom: 12,
            padding: '8px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
          }}>
            {activity.steps > 0 && (
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)' }}>
                  {activity.steps.toLocaleString()}
                </div>
                <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 0.5, marginTop: 1 }}>STEPS</div>
              </div>
            )}
            {activity.activity_calories > 0 && (
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)' }}>
                  {activity.activity_calories.toLocaleString()}
                </div>
                <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 0.5, marginTop: 1 }}>ACTIVE KCAL</div>
              </div>
            )}
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)' }}>
                {activity.total_burned_calories.toLocaleString()}
              </div>
              <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 0.5, marginTop: 1 }}>TOTAL BURN</div>
            </div>
            {activity.avg_hr && (
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)' }}>
                  {activity.avg_hr}
                </div>
                <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 0.5, marginTop: 1 }}>AVG BPM</div>
              </div>
            )}
          </div>

          {/* Macro targets */}
          <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
            <div>
              <span style={{ color: 'var(--muted)' }}>P </span>
              <strong style={{ color: 'var(--white)', fontFamily: 'var(--font-display)' }}>{target.protein_g}g</strong>
            </div>
            <div>
              <span style={{ color: 'var(--muted)' }}>C </span>
              <strong style={{ color: target.isTrainingDay ? 'var(--accent)' : 'var(--white)', fontFamily: 'var(--font-display)' }}>
                {target.carbs_g}g
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--muted)' }}>F </span>
              <strong style={{ color: 'var(--white)', fontFamily: 'var(--font-display)' }}>{target.fat_g}g</strong>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
