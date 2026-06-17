export default function ZoneTable({ title, zones, renderRange }) {
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
