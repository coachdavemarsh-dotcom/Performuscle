export default function StatCard({ label, value, unit = '', sub, variant = 'accent', trend }) {
  const variantClass = {
    accent: '',
    danger: 'danger',
    warn: 'warn',
    purple: 'purple',
    neutral: 'neutral',
  }[variant] || ''

  return (
    <div className={`stat-card ${variantClass}`}>
      <div className="label">{label}</div>
      <div className="stat-value">
        {value ?? '—'}
        {unit && <span style={{ fontSize: 18, color: 'var(--sub)', marginLeft: 2 }}>{unit}</span>}
      </div>
      {sub && <div className="stat-sub">{sub}</div>}
      {trend !== undefined && (
        <div className="stat-sub" style={{ color: trend > 0 ? 'var(--danger)' : trend < 0 ? 'var(--accent)' : 'var(--muted)' }}>
          {trend > 0 ? '▲' : trend < 0 ? '▼' : '—'} {Math.abs(trend).toFixed(1)} kg/wk
        </div>
      )}
    </div>
  )
}
