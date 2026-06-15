import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase.js'
import {
  deriveHRZones, deriveLTHRZones, derivePaceZones, predictRaceTimes,
  deriveFTPZones, deriveSwimZones, formatTime, rollingAverage,
} from '../../lib/calculators.js'

// ─── test type config ─────────────────────────────────────────────────────────

const TEST_CONFIG = {
  vo2_cooper:   { label: 'VO₂ Max (Cooper)',    group: 'VO₂ Max',   unit: 'mL/kg/min', key: 'vo2',             color: 'var(--accent)' },
  vo2_rockport: { label: 'VO₂ Max (Rockport)',  group: 'VO₂ Max',   unit: 'mL/kg/min', key: 'vo2',             color: 'var(--accent)' },
  vo2_mile:     { label: 'VO₂ Max (1.5 Mile)',  group: 'VO₂ Max',   unit: 'mL/kg/min', key: 'vo2',             color: 'var(--accent)' },
  vo2_rhr:      { label: 'VO₂ Max (RHR Est.)',  group: 'VO₂ Max',   unit: 'mL/kg/min', key: 'vo2',             color: 'var(--accent)' },
  wingate:      { label: 'Wingate Power',        group: 'Anaerobic', unit: 'W/kg',       key: 'peakPowerPerKg',  color: 'var(--purple)' },
  grip:         { label: 'Grip Strength',        group: 'Strength',  unit: 'kg',         key: 'dominant',        color: 'var(--warn)' },
  one_rm:       { label: '1-Rep Max',            group: 'Strength',  unit: 'kg',         key: 'estimated1rm',    color: 'var(--info)' },
  body_comp:          { label: 'Body Composition',     group: 'Body Comp', unit: '%',          key: 'body_fat_pct',    color: '#f472b6' },
  structural_balance: { label: 'Structural Balance',   group: 'Strength',  unit: 'deficits',   key: 'deficits_count',  color: 'var(--warn)' },
  relative_strength:  { label: 'Relative Strength',    group: 'Strength',  unit: 'kg/BW',      key: 'bench_ratio',     color: 'var(--info)' },
  lactate_threshold:  { label: 'Lactate Threshold',    group: 'Endurance', unit: 'bpm',        key: 'lthr',            color: 'var(--warn)' },
  tt_5km:             { label: '5K Time Trial',        group: 'Endurance', unit: 'min/km',     key: 'pacePerKm',       color: 'var(--accent)' },
  ftp_cycling:        { label: 'FTP Test',             group: 'Endurance', unit: 'W',          key: 'ftp',             color: 'var(--info)' },
  css_swim:           { label: 'CSS Swim Test',        group: 'Endurance', unit: 'sec/100m',   key: 'cssPer100',       color: 'var(--info)' },
}

const GROUPS = ['VO₂ Max', 'Anaerobic', 'Strength', 'Body Comp', 'Endurance']

// ─── classification helpers ───────────────────────────────────────────────────

const CLASSIFICATION_COLORS = {
  Superior:     'var(--accent)',
  Excellent:    'var(--accent)',
  Good:         'var(--info)',
  Fair:         'var(--warn)',
  Average:      'var(--warn)',
  Poor:         'var(--danger)',
  Elite:        'var(--accent)',
  Trained:      'var(--accent)',
  Untrained:    'var(--warn)',
  'Below Average': 'var(--danger)',
}

function classColor(label) {
  if (!label) return 'var(--muted)'
  for (const [key, color] of Object.entries(CLASSIFICATION_COLORS)) {
    if (label.toLowerCase().includes(key.toLowerCase())) return color
  }
  return 'var(--sub)'
}

// ─── trend arrow ──────────────────────────────────────────────────────────────

function TrendBadge({ current, previous, higherIsBetter = true }) {
  if (previous == null || current == null) return null
  const delta = parseFloat((current - previous).toFixed(2))
  const improved = higherIsBetter ? delta > 0 : delta < 0
  const neutral = Math.abs(delta) < 0.1
  if (neutral) return null
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1,
      color: improved ? 'var(--accent)' : 'var(--danger)',
      background: improved ? 'rgba(0,200,150,.1)' : 'rgba(255,68,68,.1)',
      border: `1px solid ${improved ? 'rgba(0,200,150,.3)' : 'rgba(255,68,68,.3)'}`,
      borderRadius: 4, padding: '2px 7px',
    }}>
      {improved ? '▲' : '▼'} {Math.abs(delta)}
    </span>
  )
}

// ─── mini SVG trend chart ─────────────────────────────────────────────────────

function TrendChart({ points, color, unit }) {
  if (!points || points.length < 2) return null
  const W = 240
  const H = 60
  const PAD = { top: 6, right: 8, bottom: 18, left: 8 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const vals = points.map(p => p.value)
  const minV = Math.min(...vals)
  const maxV = Math.max(...vals)
  const range = maxV - minV || 1

  const xScale = i => PAD.left + (i / (points.length - 1)) * chartW
  const yScale = v => PAD.top + chartH - ((v - minV) / range) * chartH

  const pathD = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(1)} ${yScale(p.value).toFixed(1)}`
  ).join(' ')

  const areaD = `${pathD} L ${xScale(points.length - 1)} ${H - PAD.bottom} L ${xScale(0)} ${H - PAD.bottom} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* Area */}
      <path d={areaD} fill={color} opacity="0.08" />
      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots */}
      {points.map((p, i) => (
        <circle key={i} cx={xScale(i)} cy={yScale(p.value)} r="3"
          fill={color} stroke="var(--ink)" strokeWidth="1.5" />
      ))}
      {/* Date labels */}
      {points.map((p, i) => (
        <text key={i} x={xScale(i)} y={H - 2}
          textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}
          fontSize="7" fill="var(--muted)" fontFamily="var(--font-display)">
          {new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </text>
      ))}
    </svg>
  )
}

// ─── result detail card ───────────────────────────────────────────────────────

function ResultCard({ result }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = TEST_CONFIG[result.test_type] || { label: result.test_type, unit: '', key: 'value', color: 'var(--muted)' }
  const r = result.results || {}
  const primaryValue = r[cfg.key]
  const category = r.category || r.peakCategory || r.fatigueCategory || null
  const catLabel = typeof category === 'object' ? category?.label : category

  return (
    <div style={{
      background: 'var(--s3)', borderRadius: 8,
      border: '1px solid var(--border)',
      borderLeft: `3px solid ${cfg.color}`,
      marginBottom: 8,
    }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        {/* Date */}
        <div style={{ minWidth: 70, flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', letterSpacing: 1 }}>
            {new Date(result.tested_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
          </div>
        </div>

        {/* Test name */}
        <div style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--sub)', letterSpacing: .5 }}>
          {cfg.label}
          {r.exercise && <span style={{ color: 'var(--muted)', marginLeft: 6 }}>— {r.exercise}</span>}
        </div>

        {/* Primary value */}
        {primaryValue != null && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: cfg.color }}>
              {typeof primaryValue === 'number' ? primaryValue : primaryValue}
            </span>
            <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 4 }}>{cfg.unit}</span>
          </div>
        )}

        {/* Classification badge */}
        {catLabel && (
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5,
            color: classColor(catLabel),
            background: `${classColor(catLabel)}18`,
            border: `1px solid ${classColor(catLabel)}33`,
            borderRadius: 4, padding: '2px 7px', flexShrink: 0,
          }}>
            {catLabel.toUpperCase()}
          </span>
        )}

        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
          style={{ color: 'var(--muted)', transition: 'transform .2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0)', flexShrink: 0 }}>
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {expanded && (
        <div style={{ padding: '0 16px 14px', borderTop: '1px solid var(--border)' }}>
          {/* All result fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 8, marginTop: 12 }}>
            {Object.entries(r).map(([key, value]) => {
              if (key === 'category' || key === 'peakCategory' || key === 'fatigueCategory') return null
              if (typeof value === 'object') return null
              return (
                <div key={key} style={{
                  padding: '8px 12px', background: 'var(--s4)',
                  borderRadius: 6, border: '1px solid var(--border)',
                }}>
                  <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: 1, marginBottom: 2 }}>
                    {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').toUpperCase()}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)' }}>
                    {value}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Coach note */}
          {result.coach_note && (
            <div className="coach-note" style={{ marginTop: 12 }}>
              {result.coach_note}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── vo2 max section ──────────────────────────────────────────────────────────

function VO2Section({ results }) {
  const vo2Results = results
    .filter(r => r.test_type.startsWith('vo2_'))
    .sort((a, b) => new Date(a.tested_date) - new Date(b.tested_date))

  const latest = vo2Results[vo2Results.length - 1]
  const previous = vo2Results[vo2Results.length - 2]
  const latestVO2 = latest?.results?.vo2
  const prevVO2 = previous?.results?.vo2
  const category = latest?.results?.category

  const trendPoints = vo2Results
    .filter(r => r.results?.vo2)
    .map(r => ({ date: r.tested_date, value: r.results.vo2 }))

  const hrvEntries = vo2Results
    .filter(r => r.results?.hrv)
    .map(r => ({ date: r.tested_date, weight: r.results.hrv }))
  const hrvTrendPoints = rollingAverage(hrvEntries)
    .map(e => ({ date: e.date, value: e.avg }))

  // Training zones from latest result
  const restingHr = latest?.results?.restingHr
  const maxHr = latest?.results?.maxHr
  const hrZones = restingHr && maxHr ? deriveHRZones(restingHr, maxHr) : null

  return (
    <div>
      {/* Hero metric */}
      {latestVO2 && (
        <div className="card" style={{ padding: '20px 22px', marginBottom: 16, borderLeft: '3px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>Latest VO₂ Max</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--accent)', lineHeight: 1 }}>
                  {latestVO2}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)' }}>
                  mL/kg/min
                </div>
                <TrendBadge current={latestVO2} previous={prevVO2} />
              </div>
              {category && (
                <div style={{
                  marginTop: 8,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1.5,
                  color: classColor(typeof category === 'object' ? category.label : category),
                  background: `${classColor(typeof category === 'object' ? category.label : category)}18`,
                  border: `1px solid ${classColor(typeof category === 'object' ? category.label : category)}33`,
                  borderRadius: 4, padding: '4px 10px',
                }}>
                  {typeof category === 'object' ? category.label?.toUpperCase() : category?.toUpperCase()}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="label" style={{ marginBottom: 4 }}>Tested</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--sub)' }}>
                {new Date(latest.tested_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                {TEST_CONFIG[latest.test_type]?.label}
              </div>
            </div>
          </div>

          {/* Trend chart */}
          {trendPoints.length >= 2 && (
            <div>
              <div className="label" style={{ marginBottom: 8 }}>Progress Over Time</div>
              <TrendChart points={trendPoints} color="var(--accent)" unit="mL/kg/min" />
            </div>
          )}

          {/* HRV trend */}
          {hrvTrendPoints.length >= 2 && (
            <div style={{ marginTop: 16 }}>
              <div className="label" style={{ marginBottom: 8 }}>HRV Trend (rolling average, ms)</div>
              <TrendChart points={hrvTrendPoints} color="var(--info)" unit="ms" />
            </div>
          )}
        </div>
      )}

      {/* What it means */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 16, borderLeft: '3px solid var(--s5)' }}>
        <div className="label" style={{ marginBottom: 10 }}>What VO₂ Max Means</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
          VO₂ Max (maximal oxygen uptake) is the gold standard measure of aerobic fitness — how much oxygen your body can use during intense exercise. Higher values mean your heart, lungs and muscles work more efficiently. It's strongly linked to long-term health and athletic performance.
        </div>
        {/* Norms reference */}
        <div style={{ marginTop: 14 }}>
          <div className="label" style={{ fontSize: 8, marginBottom: 8 }}>GENERAL REFERENCE RANGES (mL/kg/min)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }}>
            {[
              { label: 'Superior', range: '55+', color: 'var(--accent)' },
              { label: 'Excellent', range: '51–55', color: 'var(--accent)' },
              { label: 'Good', range: '45–51', color: 'var(--info)' },
              { label: 'Fair', range: '41–45', color: 'var(--warn)' },
              { label: 'Poor', range: '< 41', color: 'var(--danger)' },
            ].map(n => (
              <div key={n.label} style={{
                padding: '8px 10px', background: `${n.color}10`,
                border: `1px solid ${n.color}33`, borderRadius: 6, textAlign: 'center',
                borderTop: latestVO2 && n.label === (typeof category === 'object' ? category?.label : category)
                  ? `3px solid ${n.color}` : undefined,
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1, color: n.color }}>{n.label}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{n.range}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Training zones (if RHR test was used) */}
      {hrZones && (
        <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
          <div className="label" style={{ marginBottom: 12 }}>Your Karvonen Training Zones</div>
          {hrZones.map(z => (
            <div key={z.label} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', marginBottom: 6,
              background: 'var(--s3)', borderRadius: 6,
              border: `1px solid var(--border)`,
              borderLeft: `3px solid ${z.color}`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1, color: z.color }}>
                  {z.label}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{z.desc}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)', flexShrink: 0 }}>
                {z.loBpm}–{z.hiBpm} <span style={{ fontSize: 10, color: 'var(--muted)' }}>bpm</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All VO2 tests history */}
      <div className="label" style={{ marginBottom: 10 }}>Test History</div>
      {vo2Results.length === 0 ? (
        <div className="empty-state" style={{ height: 120 }}>
          <div className="empty-state-title">No VO₂ Max tests recorded</div>
          <div className="empty-state-text">Your coach will add results after your fitness test.</div>
        </div>
      ) : (
        [...vo2Results].reverse().map(r => <ResultCard key={r.id} result={r} />)
      )}
    </div>
  )
}

// ─── anaerobic section ────────────────────────────────────────────────────────

function AnaerobicSection({ results }) {
  const wingateResults = results
    .filter(r => r.test_type === 'wingate')
    .sort((a, b) => new Date(a.tested_date) - new Date(b.tested_date))

  const latest = wingateResults[wingateResults.length - 1]
  const previous = wingateResults[wingateResults.length - 2]
  const latestPeak = latest?.results?.peakPowerPerKg
  const prevPeak = previous?.results?.peakPowerPerKg

  const trendPoints = wingateResults
    .filter(r => r.results?.peakPowerPerKg)
    .map(r => ({ date: r.tested_date, value: r.results.peakPowerPerKg }))

  return (
    <div>
      {latestPeak && (
        <div className="card" style={{ padding: '20px 22px', marginBottom: 16, borderLeft: '3px solid var(--purple)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>Peak Anaerobic Power</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--purple)', lineHeight: 1 }}>
                  {latestPeak}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)' }}>W/kg</div>
                <TrendBadge current={latestPeak} previous={prevPeak} />
              </div>
              {latest?.results?.peakPower && (
                <div style={{ marginTop: 4, fontSize: 13, color: 'var(--muted)' }}>
                  {latest.results.peakPower}W absolute
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="label" style={{ marginBottom: 4 }}>Wingate Test</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--sub)' }}>
                {new Date(latest.tested_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Secondary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Mean Power', value: latest.results?.meanPowerPerKg, unit: 'W/kg' },
              { label: 'Fatigue Index', value: latest.results?.fatigueIndex, unit: '%' },
              { label: 'Peak Power', value: latest.results?.peakPower, unit: 'W' },
            ].map(s => s.value != null && (
              <div key={s.label} style={{ padding: '10px 14px', background: 'var(--s3)', borderRadius: 6, border: '1px solid var(--border)' }}>
                <div className="label" style={{ fontSize: 8, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)' }}>
                  {s.value}<span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 3 }}>{s.unit}</span>
                </div>
              </div>
            ))}
          </div>

          {trendPoints.length >= 2 && (
            <div>
              <div className="label" style={{ marginBottom: 8 }}>Peak Power Progress</div>
              <TrendChart points={trendPoints} color="var(--purple)" unit="W/kg" />
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ padding: '16px 20px', marginBottom: 16, borderLeft: '3px solid var(--s5)' }}>
        <div className="label" style={{ marginBottom: 10 }}>What the Wingate Measures</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
          The Wingate test is a 30-second all-out sprint on a cycle ergometer. It measures your peak anaerobic power (explosive capacity), mean anaerobic power (ability to sustain that output) and fatigue index (how quickly your power drops — a measure of alactic and lactic capacity).
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="label" style={{ fontSize: 8, marginBottom: 8 }}>PEAK POWER NORMS (W/kg)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {[
              { label: 'Elite Male', range: '13–15+ W/kg', color: 'var(--accent)' },
              { label: 'Elite Female', range: '10–12 W/kg', color: 'var(--accent)' },
              { label: 'Trained Male', range: '10–12 W/kg', color: 'var(--info)' },
              { label: 'Trained Female', range: '8–10 W/kg', color: 'var(--info)' },
              { label: 'Untrained Male', range: '7–9 W/kg', color: 'var(--warn)' },
              { label: 'Untrained Female', range: '5–7 W/kg', color: 'var(--warn)' },
            ].map(n => (
              <div key={n.label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '6px 10px', background: `${n.color}0a`,
                border: `1px solid ${n.color}22`, borderRadius: 4,
              }}>
                <span style={{ fontSize: 11, color: n.color }}>{n.label}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-display)' }}>{n.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="label" style={{ marginBottom: 10 }}>Test History</div>
      {wingateResults.length === 0 ? (
        <div className="empty-state" style={{ height: 120 }}>
          <div className="empty-state-title">No Wingate results recorded</div>
          <div className="empty-state-text">Your coach will record results after your anaerobic power test.</div>
        </div>
      ) : (
        [...wingateResults].reverse().map(r => <ResultCard key={r.id} result={r} />)
      )}
    </div>
  )
}

// ─── strength section ─────────────────────────────────────────────────────────

function StrengthSection({ results }) {
  const gripResults = results
    .filter(r => r.test_type === 'grip')
    .sort((a, b) => new Date(a.tested_date) - new Date(b.tested_date))

  const oneRMResults = results
    .filter(r => r.test_type === 'one_rm')
    .sort((a, b) => new Date(a.tested_date) - new Date(b.tested_date))

  const latestGrip = gripResults[gripResults.length - 1]
  const prevGrip = gripResults[gripResults.length - 2]

  const gripTrend = gripResults
    .filter(r => r.results?.dominant)
    .map(r => ({ date: r.tested_date, value: parseFloat(r.results.dominant) }))

  // Group 1RM by exercise
  const oneRMByExercise = {}
  oneRMResults.forEach(r => {
    const ex = r.results?.exercise || 'Unknown'
    if (!oneRMByExercise[ex]) oneRMByExercise[ex] = []
    oneRMByExercise[ex].push(r)
  })

  return (
    <div>
      {/* Grip strength */}
      {latestGrip && (
        <div className="card" style={{ padding: '20px 22px', marginBottom: 16, borderLeft: '3px solid var(--warn)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>Grip Strength — Dominant</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--warn)', lineHeight: 1 }}>
                  {latestGrip.results?.dominant}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)' }}>kg</div>
                <TrendBadge current={parseFloat(latestGrip.results?.dominant)} previous={prevGrip ? parseFloat(prevGrip.results?.dominant) : null} />
              </div>
              {latestGrip.results?.nonDominant && (
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                  Non-dominant: {latestGrip.results.nonDominant}kg
                  {latestGrip.results?.ratio && (
                    <span style={{
                      marginLeft: 10, fontSize: 11,
                      color: latestGrip.results.ratio < 90 ? 'var(--danger)' : latestGrip.results.ratio < 95 ? 'var(--warn)' : 'var(--accent)',
                    }}>
                      ({latestGrip.results.ratio}% bilateral)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {gripTrend.length >= 2 && (
            <div>
              <div className="label" style={{ marginBottom: 8 }}>Grip Strength Progress</div>
              <TrendChart points={gripTrend} color="var(--warn)" unit="kg" />
            </div>
          )}
        </div>
      )}

      {/* 1RM by exercise */}
      {Object.keys(oneRMByExercise).length > 0 && (
        <div className="card" style={{ padding: '18px 20px', marginBottom: 16 }}>
          <div className="label" style={{ marginBottom: 14 }}>Predicted 1-Rep Maxes</div>
          {Object.entries(oneRMByExercise).map(([exercise, exResults]) => {
            const sorted = exResults.sort((a, b) => new Date(a.tested_date) - new Date(b.tested_date))
            const latest = sorted[sorted.length - 1]
            const prev = sorted[sorted.length - 2]
            const val = latest?.results?.estimated1rm
            const prevVal = prev?.results?.estimated1rm

            const trendPts = sorted
              .filter(r => r.results?.estimated1rm)
              .map(r => ({ date: r.tested_date, value: r.results.estimated1rm }))

            return (
              <div key={exercise} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--white)', flex: 1 }}>
                    {exercise}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--info)' }}>{val}</span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>kg</span>
                    <TrendBadge current={val} previous={prevVal} />
                  </div>
                </div>

                {/* % training table from latest 1RM */}
                {val && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(80px,1fr))', gap: 5 }}>
                    {[100, 95, 90, 85, 80, 75, 70, 65, 60].map(pct => (
                      <div key={pct} style={{
                        padding: '6px 8px', background: pct === 100 ? 'rgba(0,200,150,.1)' : 'var(--s3)',
                        border: `1px solid ${pct === 100 ? 'rgba(0,200,150,.3)' : 'var(--border)'}`,
                        borderRadius: 5, textAlign: 'center',
                      }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 8, color: 'var(--muted)', letterSpacing: 1 }}>{pct}%</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: pct === 100 ? 'var(--accent)' : 'var(--sub)' }}>
                          {Math.round(val * pct / 100)}kg
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {trendPts.length >= 2 && (
                  <div style={{ marginTop: 12 }}>
                    <TrendChart points={trendPts} color="var(--info)" unit="kg" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="label" style={{ marginBottom: 10 }}>Test History</div>
      {[...gripResults, ...oneRMResults].length === 0 ? (
        <div className="empty-state" style={{ height: 120 }}>
          <div className="empty-state-title">No strength tests recorded</div>
          <div className="empty-state-text">Your coach will record grip strength and 1RM results after testing.</div>
        </div>
      ) : (
        [...gripResults, ...oneRMResults]
          .sort((a, b) => new Date(b.tested_date) - new Date(a.tested_date))
          .map(r => <ResultCard key={r.id} result={r} />)
      )}
    </div>
  )
}

// ─── structural balance section ──────────────────────────────────────────────

function StructuralBalanceSection({ results }) {
  const sbResults = results
    .filter(r => r.test_type === 'structural_balance')
    .sort((a, b) => new Date(b.tested_date) - new Date(a.tested_date))

  const latest = sbResults[0]

  if (sbResults.length === 0) {
    return (
      <div className="empty-state" style={{ height: 180 }}>
        <div className="empty-state-title">No structural balance tests recorded</div>
        <div className="empty-state-text">Your coach will record your structural balance assessment results here.</div>
      </div>
    )
  }

  const STATUS_COLOR = {
    'ON TARGET': 'var(--accent)',
    'CLOSE':     'var(--warn)',
    'DEFICIT':   'var(--danger)',
  }
  const STATUS_BG = {
    'ON TARGET': 'var(--accent-dim)',
    'CLOSE':     'rgba(245,158,11,.08)',
    'DEFICIT':   'rgba(239,68,68,.08)',
  }

  return (
    <div>
      {/* Latest result summary */}
      {latest && (
        <div className="card" style={{ padding: '20px 22px', marginBottom: 16, borderLeft: '3px solid var(--warn)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="label" style={{ marginBottom: 6 }}>Structural Balance Assessment</div>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: latest.results?.deficits_count > 0 ? 'var(--warn)' : 'var(--accent)', lineHeight: 1 }}>
                    {latest.results?.deficits_count ?? '—'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>deficits found</div>
                </div>
                {latest.results?.critical_count > 0 && (
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: 'var(--danger)', lineHeight: 1 }}>
                      {latest.results.critical_count}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>critical</div>
                  </div>
                )}
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: 'var(--sub)', lineHeight: 1 }}>
                    {Object.keys(latest.results?.ratios || {}).length}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>ratios assessed</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="label" style={{ marginBottom: 4 }}>Test Date</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--sub)' }}>
                {new Date(latest.tested_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              {latest.results?.bench_1rm && (
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                  Bench anchor: {latest.results.bench_1rm}kg
                </div>
              )}
              {latest.results?.squat_1rm && (
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  Squat anchor: {latest.results.squat_1rm}kg
                </div>
              )}
            </div>
          </div>

          {/* Critical warning */}
          {latest.results?.critical_count > 0 && (
            <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 8, fontSize: 13, color: 'var(--danger)', marginBottom: 16 }}>
              ⚠ Critical deficit detected — your coach will program correctives before advancing upper body loading.
            </div>
          )}

          {/* Ratio breakdown */}
          {latest.results?.ratios && Object.keys(latest.results.ratios).length > 0 && (
            <div>
              <div className="label" style={{ marginBottom: 10 }}>Ratio Breakdown</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {Object.entries(latest.results.ratios).map(([id, data]) => {
                  if (!data?.status) return null
                  const color  = STATUS_COLOR[data.status] || 'var(--muted)'
                  const bg     = STATUS_BG[data.status]    || 'var(--s3)'
                  const label  = id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                  return (
                    <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', background: 'var(--s3)', border: `1px solid var(--border)`, borderRadius: 6 }}>
                      <span style={{ fontSize: 13, color: 'var(--sub)' }}>{label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {data.pct != null && (
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--sub)' }}>{data.pct}%</span>
                        )}
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1, color, background: bg, border: `1px solid ${color}44`, borderRadius: 4, padding: '2px 7px' }}>{data.status}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {latest.coach_note && (
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 8, fontSize: 13, color: 'var(--sub)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1, color: 'var(--accent)', marginRight: 8 }}>COACH NOTE</span>
              {latest.coach_note}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {sbResults.length > 1 && (
        <>
          <div className="label" style={{ marginBottom: 10 }}>Previous Assessments</div>
          {sbResults.slice(1).map(r => (
            <div key={r.id} className="card" style={{ padding: '14px 18px', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--sub)' }}>
                  {new Date(r.tested_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted)' }}>
                  <span>{r.results?.deficits_count ?? '—'} deficits</span>
                  <span>{Object.keys(r.results?.ratios || {}).length} ratios</span>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ─── shared zone table ─────────────────────────────────────────────────────────

function ZoneTable({ title, zones, renderRange }) {
  if (!zones) return null
  return (
    <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
      <div className="label" style={{ marginBottom: 12 }}>{title}</div>
      {zones.map(z => (
        <div key={z.zone ?? z.label} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 12px', marginBottom: 6,
          background: 'var(--s3)', borderRadius: 6,
          border: `1px solid var(--border)`,
          borderLeft: `3px solid ${z.color}`,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1, color: z.color }}>
              {z.label}
            </div>
            {z.desc && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{z.desc}</div>}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)', flexShrink: 0, textAlign: 'right' }}>
            {renderRange(z)}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── lactate threshold section ────────────────────────────────────────────────

function LactateThresholdSection({ results }) {
  const ltResults = results
    .filter(r => r.test_type === 'lactate_threshold')
    .sort((a, b) => new Date(a.tested_date) - new Date(b.tested_date))

  const latest = ltResults[ltResults.length - 1]
  const previous = ltResults[ltResults.length - 2]
  const latestLthr = latest?.results?.lthr
  const prevLthr = previous?.results?.lthr

  const trendPoints = ltResults
    .filter(r => r.results?.lthr)
    .map(r => ({ date: r.tested_date, value: r.results.lthr }))

  const ltZones = latestLthr ? deriveLTHRZones(latestLthr) : null

  return (
    <div>
      {latestLthr && (
        <div className="card" style={{ padding: '20px 22px', marginBottom: 16, borderLeft: '3px solid var(--warn)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>Lactate Threshold Heart Rate</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--warn)', lineHeight: 1 }}>
                  {latestLthr}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)' }}>bpm</div>
                <TrendBadge current={latestLthr} previous={prevLthr} />
              </div>
              {latest?.results?.sport && (
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>
                  Tested on: {latest.results.sport === 'bike' ? 'Bike' : 'Run'}
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="label" style={{ marginBottom: 4 }}>Tested</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--sub)' }}>
                {new Date(latest.tested_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {trendPoints.length >= 2 && (
            <div>
              <div className="label" style={{ marginBottom: 8 }}>LTHR Progress</div>
              <TrendChart points={trendPoints} color="var(--warn)" unit="bpm" />
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ padding: '16px 20px', marginBottom: 16, borderLeft: '3px solid var(--s5)' }}>
        <div className="label" style={{ marginBottom: 10 }}>What Lactate Threshold Means</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
          Lactate threshold is the effort level above which lactate starts accumulating in your blood faster than your body can clear it. Training zones built from your LTHR target the right intensities to raise that threshold — building a bigger aerobic engine before tapping into harder, less sustainable efforts.
        </div>
      </div>

      <ZoneTable
        title="Your Lactate Threshold Zones"
        zones={ltZones}
        renderRange={z => <>{z.loBpm}–{z.hiBpm} <span style={{ fontSize: 10, color: 'var(--muted)' }}>bpm</span></>}
      />

      <div className="label" style={{ marginBottom: 10 }}>Test History</div>
      {ltResults.length === 0 ? (
        <div className="empty-state" style={{ height: 120 }}>
          <div className="empty-state-title">No lactate threshold tests recorded</div>
          <div className="empty-state-text">Your coach will record results after your threshold test.</div>
        </div>
      ) : (
        [...ltResults].reverse().map(r => <ResultCard key={r.id} result={r} />)
      )}
    </div>
  )
}

// ─── run performance section ──────────────────────────────────────────────────

function RunPerformanceSection({ results }) {
  const runResults = results
    .filter(r => r.test_type === 'tt_5km')
    .sort((a, b) => new Date(a.tested_date) - new Date(b.tested_date))

  const latest = runResults[runResults.length - 1]
  const previous = runResults[runResults.length - 2]
  const latestTime = latest?.results?.timeSec
  const prevTime = previous?.results?.timeSec
  const vdot = latest?.results?.vdot
  const predictions = latest?.results?.predictions

  const trendPoints = runResults
    .filter(r => r.results?.timeSec)
    .map(r => ({ date: r.tested_date, value: Math.round(r.results.timeSec / 5) }))

  const paceZones = vdot ? derivePaceZones(vdot) : null

  return (
    <div>
      {latestTime && (
        <div className="card" style={{ padding: '20px 22px', marginBottom: 16, borderLeft: '3px solid var(--accent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>5K Time Trial</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--accent)', lineHeight: 1 }}>
                  {formatTime(latestTime)}
                </div>
                <TrendBadge current={latestTime} previous={prevTime} higherIsBetter={false} />
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  Pace: <span style={{ color: 'var(--sub)' }}>{formatTime(latestTime / 5)}/km</span>
                </div>
                {vdot && (
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    VDOT: <span style={{ color: 'var(--sub)' }}>{vdot}</span>
                  </div>
                )}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="label" style={{ marginBottom: 4 }}>Tested</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--sub)' }}>
                {new Date(latest.tested_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Predicted race times */}
          {predictions && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { label: '10K', value: predictions['10km'] },
                { label: 'Half Marathon', value: predictions.half_marathon },
                { label: 'Marathon', value: predictions.marathon },
              ].map(p => (
                <div key={p.label} style={{ padding: '10px 14px', background: 'var(--s3)', borderRadius: 6, border: '1px solid var(--border)' }}>
                  <div className="label" style={{ fontSize: 8, marginBottom: 4 }}>Predicted {p.label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)' }}>
                    {formatTime(p.value)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {trendPoints.length >= 2 && (
            <div>
              <div className="label" style={{ marginBottom: 8 }}>Pace Progress (sec/km — lower is faster)</div>
              <TrendChart points={trendPoints} color="var(--accent)" unit="sec/km" />
            </div>
          )}
        </div>
      )}

      <ZoneTable
        title="Your Daniels Training Pace Zones"
        zones={paceZones}
        renderRange={z => <>{z.pacePerKm} <span style={{ fontSize: 10, color: 'var(--muted)' }}>/km</span></>}
      />

      <div className="label" style={{ marginBottom: 10 }}>Test History</div>
      {runResults.length === 0 ? (
        <div className="empty-state" style={{ height: 120 }}>
          <div className="empty-state-title">No 5K time trials recorded</div>
          <div className="empty-state-text">Your coach will record results after your time trial.</div>
        </div>
      ) : (
        [...runResults].reverse().map(r => <ResultCard key={r.id} result={r} />)
      )}
    </div>
  )
}

// ─── FTP section ──────────────────────────────────────────────────────────────

function FTPSection({ results }) {
  const ftpResults = results
    .filter(r => r.test_type === 'ftp_cycling')
    .sort((a, b) => new Date(a.tested_date) - new Date(b.tested_date))

  const latest = ftpResults[ftpResults.length - 1]
  const previous = ftpResults[ftpResults.length - 2]
  const latestFtp = latest?.results?.ftp
  const prevFtp = previous?.results?.ftp

  const trendPoints = ftpResults
    .filter(r => r.results?.ftp)
    .map(r => ({ date: r.tested_date, value: r.results.ftp }))

  const ftpZones = latestFtp ? deriveFTPZones(latestFtp) : null

  return (
    <div>
      {latestFtp && (
        <div className="card" style={{ padding: '20px 22px', marginBottom: 16, borderLeft: '3px solid var(--info)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>Functional Threshold Power</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--info)', lineHeight: 1 }}>
                  {latestFtp}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)' }}>W</div>
                <TrendBadge current={latestFtp} previous={prevFtp} />
              </div>
              {latest?.results?.ftpPerKg && (
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>
                  {latest.results.ftpPerKg} <span>W/kg</span>
                </div>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="label" style={{ marginBottom: 4 }}>Tested</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--sub)' }}>
                {new Date(latest.tested_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {trendPoints.length >= 2 && (
            <div>
              <div className="label" style={{ marginBottom: 8 }}>FTP Progress</div>
              <TrendChart points={trendPoints} color="var(--info)" unit="W" />
            </div>
          )}
        </div>
      )}

      <ZoneTable
        title="Your Coggan Power Zones"
        zones={ftpZones}
        renderRange={z => <>{z.loW}–{z.hiW} <span style={{ fontSize: 10, color: 'var(--muted)' }}>W</span></>}
      />

      <div className="label" style={{ marginBottom: 10 }}>Test History</div>
      {ftpResults.length === 0 ? (
        <div className="empty-state" style={{ height: 120 }}>
          <div className="empty-state-title">No FTP tests recorded</div>
          <div className="empty-state-text">Your coach will record results after your FTP test.</div>
        </div>
      ) : (
        [...ftpResults].reverse().map(r => <ResultCard key={r.id} result={r} />)
      )}
    </div>
  )
}

// ─── swim section ─────────────────────────────────────────────────────────────

function SwimSection({ results }) {
  const swimResults = results
    .filter(r => r.test_type === 'css_swim')
    .sort((a, b) => new Date(a.tested_date) - new Date(b.tested_date))

  const latest = swimResults[swimResults.length - 1]
  const previous = swimResults[swimResults.length - 2]
  const latestCss = latest?.results?.cssPer100
  const prevCss = previous?.results?.cssPer100

  const trendPoints = swimResults
    .filter(r => r.results?.cssPer100)
    .map(r => ({ date: r.tested_date, value: r.results.cssPer100 }))

  const swimZones = latestCss ? deriveSwimZones(latestCss) : null

  return (
    <div>
      {latestCss && (
        <div className="card" style={{ padding: '20px 22px', marginBottom: 16, borderLeft: '3px solid var(--info)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div className="label" style={{ marginBottom: 4 }}>Critical Swim Speed</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--info)', lineHeight: 1 }}>
                  {formatTime(latestCss)}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)' }}>/100m</div>
                <TrendBadge current={latestCss} previous={prevCss} higherIsBetter={false} />
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="label" style={{ marginBottom: 4 }}>Tested</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--sub)' }}>
                {new Date(latest.tested_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {trendPoints.length >= 2 && (
            <div>
              <div className="label" style={{ marginBottom: 8 }}>CSS Progress (sec/100m — lower is faster)</div>
              <TrendChart points={trendPoints} color="var(--info)" unit="sec/100m" />
            </div>
          )}
        </div>
      )}

      <ZoneTable
        title="Your Swim Training Zones"
        zones={swimZones}
        renderRange={z => <>{formatTime(z.loPer100)}–{formatTime(z.hiPer100)} <span style={{ fontSize: 10, color: 'var(--muted)' }}>/100m</span></>}
      />

      <div className="label" style={{ marginBottom: 10 }}>Test History</div>
      {swimResults.length === 0 ? (
        <div className="empty-state" style={{ height: 120 }}>
          <div className="empty-state-title">No CSS swim tests recorded</div>
          <div className="empty-state-text">Your coach will record results after your swim test.</div>
        </div>
      ) : (
        [...swimResults].reverse().map(r => <ResultCard key={r.id} result={r} />)
      )}
    </div>
  )
}

// ─── endurance section (combines LTHR, run, FTP, swim) ──────────────────────────

function EnduranceSection({ results }) {
  const [sub, setSub] = useState('Run')
  const SUBS = ['Run', 'Lactate Threshold', 'FTP', 'Swim']

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
        {SUBS.map(s => (
          <button key={s} onClick={() => setSub(s)} style={{
            fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1.5,
            color: sub === s ? 'var(--white)' : 'var(--muted)',
            background: sub === s ? 'var(--s4)' : 'var(--s3)',
            border: `1px solid ${sub === s ? 'var(--border-accent)' : 'var(--border)'}`,
            borderRadius: 6, cursor: 'pointer', padding: '6px 14px',
            transition: 'color .2s, background .2s',
          }}>
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {sub === 'Run'               && <RunPerformanceSection results={results} />}
      {sub === 'Lactate Threshold'  && <LactateThresholdSection results={results} />}
      {sub === 'FTP'                && <FTPSection results={results} />}
      {sub === 'Swim'               && <SwimSection results={results} />}
    </div>
  )
}

// ─── overview section ─────────────────────────────────────────────────────────

function OverviewSection({ results }) {
  // Latest result per key test type
  const getLatest = (types) => {
    const matches = results
      .filter(r => types.includes(r.test_type))
      .sort((a, b) => new Date(b.tested_date) - new Date(a.tested_date))
    return matches[0] || null
  }

  const latestVO2 = getLatest(['vo2_cooper', 'vo2_rockport', 'vo2_mile', 'vo2_rhr'])
  const latestWingate = getLatest(['wingate'])
  const latestGrip = getLatest(['grip'])
  const latestOneRM = getLatest(['one_rm'])
  const latestSB = getLatest(['structural_balance'])

  const recentTests = [...results]
    .sort((a, b) => new Date(b.tested_date) - new Date(a.tested_date))
    .slice(0, 5)

  return (
    <div>
      {/* Summary stats */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {latestVO2 && (
          <div className="stat-card" style={{ borderLeft: '3px solid var(--accent)' }}>
            <div className="label">VO₂ Max</div>
            <div className="stat-value" style={{ color: 'var(--accent)' }}>
              {latestVO2.results?.vo2}
              <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 4 }}>mL/kg/min</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              {latestVO2.results?.category?.label || latestVO2.results?.category || ''}
            </div>
          </div>
        )}

        {latestWingate && (
          <div className="stat-card" style={{ borderLeft: '3px solid var(--purple)' }}>
            <div className="label">Peak Power</div>
            <div className="stat-value" style={{ color: 'var(--purple)' }}>
              {latestWingate.results?.peakPowerPerKg}
              <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 4 }}>W/kg</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Wingate anaerobic</div>
          </div>
        )}

        {latestGrip && (
          <div className="stat-card" style={{ borderLeft: '3px solid var(--warn)' }}>
            <div className="label">Grip Strength</div>
            <div className="stat-value" style={{ color: 'var(--warn)' }}>
              {latestGrip.results?.dominant}
              <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 4 }}>kg</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              {latestGrip.results?.category?.label || latestGrip.results?.category || 'Dominant hand'}
            </div>
          </div>
        )}

        {latestOneRM && (
          <div className="stat-card" style={{ borderLeft: '3px solid var(--info)' }}>
            <div className="label">Latest 1RM</div>
            <div className="stat-value" style={{ color: 'var(--info)' }}>
              {latestOneRM.results?.estimated1rm}
              <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 4 }}>kg</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              {latestOneRM.results?.exercise || ''}
            </div>
          </div>
        )}

        {latestSB && (
          <div className="stat-card" style={{ borderLeft: '3px solid var(--warn)' }}>
            <div className="label">Structural Balance</div>
            <div className="stat-value" style={{ color: latestSB.results?.deficits_count > 0 ? 'var(--warn)' : 'var(--accent)' }}>
              {latestSB.results?.deficits_count ?? '—'}
              <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 4 }}>deficits</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              {latestSB.results?.critical_count > 0 ? `${latestSB.results.critical_count} critical` : 'No critical deficits'}
            </div>
          </div>
        )}

        <div className="stat-card">
          <div className="label">Tests Recorded</div>
          <div className="stat-value">{results.length}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
            across {new Set(results.map(r => r.test_type)).size} test types
          </div>
        </div>
      </div>

      {/* Recent tests */}
      {recentTests.length > 0 && (
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="label" style={{ marginBottom: 14 }}>Recent Tests</div>
          {recentTests.map(r => <ResultCard key={r.id} result={r} />)}
        </div>
      )}

      {results.length === 0 && (
        <div className="empty-state" style={{ height: 280 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
          <div className="empty-state-title">No Test Results Yet</div>
          <div className="empty-state-text">
            Your coach will record your fitness test results here. Once tested, you'll see your VO₂ Max, peak power, strength scores and training zones.
          </div>
        </div>
      )}
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

const TABS = ['Overview', 'VO₂ Max', 'Endurance', 'Anaerobic', 'Strength', 'Structural Balance']

export default function TestResults() {
  const { user } = useAuth()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('Overview')

  useEffect(() => {
    if (!user) return
    fetchResults()
  }, [user])

  async function fetchResults() {
    setLoading(true)
    const { data } = await supabase
      .from('test_results')
      .select('*')
      .eq('client_id', user.id)
      .order('tested_date', { ascending: false })
    setResults(data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">My Results</div>
          <div className="page-subtitle">
            {results.length} test{results.length !== 1 ? 's' : ''} recorded · VO₂ Max, Power, Strength
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1.5,
            color: tab === t ? 'var(--accent)' : 'var(--muted)',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px 16px',
            borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
            marginBottom: -1, transition: 'color .2s',
          }}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === 'Overview'            && <OverviewSection results={results} />}
      {tab === 'VO₂ Max'             && <VO2Section results={results} />}
      {tab === 'Endurance'           && <EnduranceSection results={results} />}
      {tab === 'Anaerobic'           && <AnaerobicSection results={results} />}
      {tab === 'Strength'            && <StrengthSection results={results} />}
      {tab === 'Structural Balance'  && <StructuralBalanceSection results={results} />}
    </div>
  )
}
