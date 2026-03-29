import { clamp } from '../../lib/calculators.js'

function MacroItem({ label, current, target, color, unit = 'g' }) {
  const pct = target > 0 ? clamp((current / target) * 100, 0, 100) : 0
  const over = target > 0 && current > target

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="flex-between" style={{ marginBottom: 4 }}>
        <span className="label">{label}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: over ? 'var(--warn)' : 'var(--white)' }}>
          {Math.round(current)}<span style={{ color: 'var(--muted)', fontSize: 10 }}>/{Math.round(target)}{unit}</span>
        </span>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-bar-fill ${over ? 'warn' : ''}`}
          style={{
            width: `${pct}%`,
            background: color,
          }}
        />
      </div>
    </div>
  )
}

export default function MacroBar({ current = {}, targets = {} }) {
  const { kcal = 0, protein_g = 0, carbs_g = 0, fat_g = 0 } = current
  const { kcal: tKcal = 0, protein_g: tProtein = 0, carbs_g: tCarbs = 0, fat_g: tFat = 0 } = targets

  const kcalPct = tKcal > 0 ? clamp((kcal / tKcal) * 100, 0, 100) : 0
  const kcalOver = tKcal > 0 && kcal > tKcal

  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      {/* Calorie headline */}
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <div>
          <div className="label">Calories</div>
          <div className="stat-value" style={{ fontSize: 28, color: kcalOver ? 'var(--warn)' : 'var(--white)' }}>
            {Math.round(kcal)}
            <span style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--font-body)', marginLeft: 4 }}>
              / {Math.round(tKcal)} kcal
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="label">Remaining</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: kcalOver ? 'var(--danger)' : 'var(--accent)' }}>
            {kcalOver ? '+' : ''}{Math.round(kcal - tKcal)} kcal
          </div>
        </div>
      </div>

      <div className="progress-bar progress-bar-thick" style={{ marginBottom: 16 }}>
        <div
          className={`progress-bar-fill ${kcalOver ? 'warn' : ''}`}
          style={{ width: `${kcalPct}%` }}
        />
      </div>

      {/* Macro breakdown */}
      <div style={{ display: 'flex', gap: 16 }}>
        <MacroItem label="Protein" current={protein_g} target={tProtein} color="var(--accent)" />
        <MacroItem label="Carbs" current={carbs_g} target={tCarbs} color="var(--info)" />
        <MacroItem label="Fat" current={fat_g} target={tFat} color="var(--warn)" />
      </div>
    </div>
  )
}
