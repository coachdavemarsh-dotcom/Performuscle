import { useMemo } from 'react'
import { rollingAverage } from '../../lib/calculators.js'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function BWChart({ entries = [], targetWeight, height = 200 }) {
  const data = useMemo(() => {
    if (!entries.length) return []
    return rollingAverage(entries.map(e => ({ date: e.measured_date || e.date, weight: e.body_weight_kg || e.weight })))
  }, [entries])

  if (!data.length) {
    return (
      <div className="card" style={{ height }}>
        <div className="empty-state" style={{ height }}>
          <div className="empty-state-title">No Weight Data</div>
          <div className="empty-state-text">Log your body weight to see your trend chart.</div>
        </div>
      </div>
    )
  }

  const weights = data.map(d => d.weight)
  const avgs = data.map(d => d.avg)
  const allVals = [...weights, ...avgs, targetWeight].filter(Boolean)
  const minW = Math.min(...allVals) - 1
  const maxW = Math.max(...allVals) + 1
  const range = maxW - minW

  const W = 600
  const H = height - 40
  const PAD = { top: 10, right: 20, bottom: 30, left: 40 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  function xPos(i) {
    return PAD.left + (i / (data.length - 1 || 1)) * chartW
  }

  function yPos(val) {
    return PAD.top + chartH - ((val - minW) / range) * chartH
  }

  function pathD(values) {
    return values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xPos(i).toFixed(1)} ${yPos(v).toFixed(1)}`).join(' ')
  }

  const targetY = targetWeight ? yPos(targetWeight) : null
  const yTicks = 4
  const tickStep = range / yTicks

  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <div className="label">Body Weight Trend</div>
        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--muted)' }}>
          <span style={{ color: 'var(--accent)' }}>— Actual</span>
          <span style={{ color: 'var(--sub)', borderBottom: '2px dashed var(--sub)', paddingBottom: 0 }}>-- 7-day avg</span>
          {targetWeight && <span style={{ color: 'var(--warn)' }}>— Target</span>}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: height - 40, display: 'block' }}
        preserveAspectRatio="none"
      >
        {/* Y-axis ticks */}
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const val = minW + tickStep * i
          const y = yPos(val)
          return (
            <g key={i}>
              <line
                x1={PAD.left} y1={y}
                x2={PAD.left + chartW} y2={y}
                stroke="var(--border)" strokeWidth="1"
              />
              <text
                x={PAD.left - 6} y={y + 4}
                textAnchor="end"
                fill="var(--muted)"
                fontSize="9"
                fontFamily="var(--font-body)"
              >
                {val.toFixed(1)}
              </text>
            </g>
          )
        })}

        {/* X-axis dates — show ~5 labels */}
        {data.reduce((acc, d, i) => {
          const step = Math.max(1, Math.floor(data.length / 5))
          if (i % step === 0 || i === data.length - 1) acc.push({ d, i })
          return acc
        }, []).map(({ d, i }) => (
            <text
              key={i}
              x={xPos(i)}
              y={H - PAD.bottom + 16}
              textAnchor="middle"
              fill="var(--muted)"
              fontSize="9"
              fontFamily="var(--font-body)"
            >
              {formatDate(d.date)}
            </text>
          )
        )}

        {/* Target line */}
        {targetY !== null && (
          <line
            x1={PAD.left} y1={targetY}
            x2={PAD.left + chartW} y2={targetY}
            stroke="var(--warn)"
            strokeWidth="1.5"
            strokeDasharray="6,4"
            opacity="0.7"
          />
        )}

        {/* Area fill under actual */}
        <defs>
          <linearGradient id="bwGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathD(weights)} L ${xPos(data.length - 1)} ${PAD.top + chartH} L ${PAD.left} ${PAD.top + chartH} Z`}
          fill="url(#bwGradient)"
        />

        {/* 7-day average line */}
        <path
          d={pathD(avgs)}
          fill="none"
          stroke="var(--sub)"
          strokeWidth="1.5"
          strokeDasharray="6,3"
          opacity="0.7"
        />

        {/* Actual weight line */}
        <path
          d={pathD(weights)}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xPos(i)}
            cy={yPos(d.weight)}
            r="3"
            fill="var(--accent)"
            stroke="var(--s3)"
            strokeWidth="1.5"
          />
        ))}
      </svg>
    </div>
  )
}
