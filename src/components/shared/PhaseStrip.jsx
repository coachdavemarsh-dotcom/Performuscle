export default function PhaseStrip({ program }) {
  if (!program) return null

  const { name, phase, current_week, total_weeks, start_date, end_date } = program
  const progress = total_weeks > 0 ? (current_week / total_weeks) * 100 : 0

  const weeks = Array.from({ length: total_weeks }, (_, i) => i + 1)

  return (
    <div className="card card-accent" style={{ padding: '16px 20px' }}>
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <div>
          <div className="label">Active Program</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 1, marginTop: 2 }}>
            {name}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {phase && <span className="tag tag-accent">{phase.toUpperCase()}</span>}
          <div style={{ marginTop: 6, fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--sub)' }}>
            WEEK {current_week} / {total_weeks}
          </div>
        </div>
      </div>

      {/* Week pills */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
        {weeks.map(w => (
          <div
            key={w}
            style={{
              width: 28,
              height: 28,
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: 11,
              background: w < current_week
                ? 'var(--accent)'
                : w === current_week
                  ? 'var(--accent-dim)'
                  : 'var(--s4)',
              color: w < current_week
                ? 'var(--ink)'
                : w === current_week
                  ? 'var(--accent)'
                  : 'var(--muted)',
              border: w === current_week ? '1px solid var(--accent)' : '1px solid transparent',
            }}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {start_date && (
        <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
          {new Date(start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          {end_date && ` → ${new Date(end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
        </div>
      )}
    </div>
  )
}
