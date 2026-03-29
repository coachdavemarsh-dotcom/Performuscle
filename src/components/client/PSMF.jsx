import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { PSMF_PROTOCOL } from '../../data/psmfData.js'

// ─── Utility ──────────────────────────────────────────────────────────────────
function kgToLbs(kg) { return kg * 2.20462 }

// ─── Sub-components ───────────────────────────────────────────────────────────

function WarningBanner({ children, color = 'var(--warn)', bg = '#d9770610' }) {
  return (
    <div style={{
      background: bg,
      border: `1px solid ${color}`,
      borderRadius: 10,
      padding: '14px 18px',
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
    }}>
      {children}
    </div>
  )
}

function StatBox({ label, value, sub }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '16px 12px', flex: 1, minWidth: 120 }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 22,
        color: 'var(--accent)',
        lineHeight: 1.1,
        letterSpacing: '0.02em',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--accent-hi)', letterSpacing: '0.1em', marginBottom: 4 }}>
          {sub}
        </div>
      )}
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em', marginTop: 4 }}>
        {label}
      </div>
    </div>
  )
}

function SectionToggle({ title, accent, children, defaultOpen = false, icon }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '18px 20px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            color: accent || 'var(--white)',
            letterSpacing: '0.05em',
          }}>
            {title}
          </span>
        </div>
        <span style={{ color: 'var(--muted)', fontSize: 18, lineHeight: 1, flexShrink: 0 }}>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 20px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

function FoodRow({ item, showNote }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: 'var(--white)', fontFamily: 'var(--font-body)' }}>{item.name}</div>
        {showNote && item.note && (
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{item.note}</div>
        )}
      </div>
      {item.protein100g > 0 && (
        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 14,
            color: 'var(--accent)',
            letterSpacing: '0.04em',
          }}>
            {item.protein100g}g
          </span>
          <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 3 }}>/ 100g</span>
        </div>
      )}
      {item.typicalServing && item.protein100g > 0 && (
        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12, minWidth: 70 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{item.typicalServing}</span>
          {item.servingProtein > 0 && (
            <>
              <br />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--accent-hi)' }}>
                {item.servingProtein}g prot
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function AccordionItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '14px 0',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          textAlign: 'left',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 13, color: 'var(--white)', fontFamily: 'var(--font-body)', flex: 1, lineHeight: 1.5 }}>
          {question}
        </span>
        <span style={{ color: open ? 'var(--accent)' : 'var(--muted)', fontSize: 18, flexShrink: 0, marginTop: 1 }}>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div style={{
          fontSize: 13,
          color: 'var(--muted)',
          fontFamily: 'var(--font-body)',
          lineHeight: 1.7,
          paddingBottom: 14,
        }}>
          {answer}
        </div>
      )}
    </div>
  )
}

function SideEffectRow({ effect }) {
  const [open, setOpen] = useState(false)
  const severityColor = effect.severity.includes('Significant') || effect.severity.includes('significant')
    ? 'var(--danger)' : effect.severity.includes('moderate')
    ? 'var(--warn)' : 'var(--muted)'

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '14px 0',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          textAlign: 'left',
          gap: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--white)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
            {effect.effect}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{effect.timing}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 9,
            letterSpacing: '0.06em',
            color: severityColor,
            background: `${severityColor}18`,
            border: `1px solid ${severityColor}40`,
            borderRadius: 4,
            padding: '2px 7px',
          }}>
            {effect.severity.toUpperCase()}
          </span>
          <span style={{ color: open ? 'var(--accent)' : 'var(--muted)', fontSize: 18 }}>{open ? '−' : '+'}</span>
        </div>
      </button>
      {open && (
        <div style={{ paddingBottom: 14 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 8 }}>
            MANAGEMENT
          </div>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {effect.management.map((m, i) => (
              <li key={i} style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6, marginBottom: 4 }}>
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ─── Protein Calculator ───────────────────────────────────────────────────────
function ProteinCalculator({ profile }) {
  const [bfPct, setBfPct] = useState(25)
  const [weightKg, setWeightKg] = useState(
    profile?.current_weight ? parseFloat(profile.current_weight) : 80
  )

  const calc = useMemo(() => {
    const lbmKg = weightKg * (1 - bfPct / 100)
    const lbmLbs = kgToLbs(lbmKg)
    const proteinG = Math.round(Math.max(
      PSMF_PROTOCOL.proteinCalculator.minProteinG,
      Math.min(lbmLbs * 1.2, PSMF_PROTOCOL.proteinCalculator.maxProteinG)
    ))
    const kcal = proteinG * 4
    const chickenG = Math.round(proteinG / 0.31)
    const codG = Math.round(proteinG / 0.18)
    const tunaG = Math.round(proteinG / 0.26)
    return { lbmKg: lbmKg.toFixed(1), lbmLbs: lbmLbs.toFixed(1), proteinG, kcal, chickenG, codG, tunaG }
  }, [bfPct, weightKg])

  return (
    <div>
      <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6, marginBottom: 20 }}>
        {PSMF_PROTOCOL.proteinCalculator.formula}. Adjust your body fat percentage below to calculate your personal target.
      </p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label className="label">Bodyweight (kg)</label>
          <input
            type="number"
            className="input"
            value={weightKg}
            min={40}
            max={200}
            step={0.5}
            onChange={e => setWeightKg(parseFloat(e.target.value) || 80)}
          />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label className="label">Estimated Body Fat %: <strong style={{ color: 'var(--accent)' }}>{bfPct}%</strong></label>
          <input
            type="range"
            min={8}
            max={55}
            step={1}
            value={bfPct}
            onChange={e => setBfPct(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)', marginTop: 8 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)' }}>
            <span>8% (lean)</span>
            <span>55% (high)</span>
          </div>
        </div>
      </div>

      {/* Result Box */}
      <div style={{
        background: 'var(--accent)18',
        border: '1px solid var(--accent)50',
        borderRadius: 12,
        padding: '20px 22px',
        marginBottom: 16,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 48,
          color: 'var(--accent)',
          lineHeight: 1,
          letterSpacing: '0.02em',
        }}>
          {calc.proteinG}g
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--accent-hi)', letterSpacing: '0.1em', marginTop: 4, marginBottom: 12 }}>
          DAILY PROTEIN TARGET
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>
          Lean body mass: <strong style={{ color: 'var(--white)' }}>{calc.lbmKg}kg ({calc.lbmLbs}lbs)</strong>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          Estimated calories: <strong style={{ color: 'var(--white)' }}>{calc.kcal} kcal</strong>
        </div>
      </div>

      {/* Food equivalents */}
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 10 }}>
        TO HIT YOUR TARGET YOU NEED APPROXIMATELY:
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {[
          { food: 'Chicken Breast', amount: `${calc.chickenG}g`, icon: '🍗' },
          { food: 'Cod Fillet', amount: `${calc.codG}g`, icon: '🐟' },
          { food: 'Tuna (canned)', amount: `${calc.tunaG}g`, icon: '🥫' },
        ].map(f => (
          <div key={f.food} style={{
            background: 'var(--s2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            minWidth: 120,
          }}>
            <span style={{ fontSize: 20 }}>{f.icon}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)', letterSpacing: '0.03em' }}>{f.amount}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>{f.food}</div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-body)', marginTop: 14, lineHeight: 1.5 }}>
        {PSMF_PROTOCOL.proteinCalculator.targetCalsRationale}
      </p>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PSMF() {
  const { profile } = useAuth()
  const isPSMFAssigned = profile?.nutrition_protocol_type === 'psmf'
  const settings = profile?.nutrition_protocol_settings || {}

  // Calculate which PSMF week we're in if assigned
  const psmfWeekInfo = useMemo(() => {
    if (!isPSMFAssigned || !settings.start_date) return null
    const start = new Date(settings.start_date)
    const today = new Date()
    const daysDiff = Math.floor((today - start) / (1000 * 60 * 60 * 24))
    const week = Math.floor(daysDiff / 7) + 1
    return { daysDiff, week }
  }, [isPSMFAssigned, settings.start_date])

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 0 60px' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 11,
          letterSpacing: '0.15em',
          color: 'var(--accent)',
          marginBottom: 8,
        }}>
          ADVANCED NUTRITION PROTOCOL
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 6vw, 48px)',
          color: 'var(--white)',
          letterSpacing: '0.04em',
          margin: 0,
          lineHeight: 1.05,
        }}>
          {PSMF_PROTOCOL.title.toUpperCase()}
        </h1>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 14,
          color: 'var(--accent-hi)',
          letterSpacing: '0.06em',
          margin: '8px 0 0',
        }}>
          {PSMF_PROTOCOL.tagline.toUpperCase()}
        </p>
      </div>

      {/* ── Coach Assigned Banner ── */}
      {isPSMFAssigned && (
        <WarningBanner color="var(--accent)" bg="var(--accent)10">
          <span style={{ fontSize: 20, flexShrink: 0 }}>✓</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--accent)', letterSpacing: '0.06em' }}>
              PSMF PROTOCOL ASSIGNED BY YOUR COACH
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', marginTop: 4 }}>
              {settings.start_date && `Started: ${new Date(settings.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
              {psmfWeekInfo && ` · Week ${psmfWeekInfo.week}`}
              {settings.protein_target_g && ` · Protein target: ${settings.protein_target_g}g/day`}
              {settings.refeed_days?.length > 0 && ` · Refeed days: ${settings.refeed_days.join(', ')}`}
            </div>
            {settings.coach_notes && (
              <div style={{ fontSize: 12, color: 'var(--white)', fontFamily: 'var(--font-body)', marginTop: 8, fontStyle: 'italic' }}>
                Coach note: "{settings.coach_notes}"
              </div>
            )}
          </div>
        </WarningBanner>
      )}

      {/* ── Advanced Protocol Warning ── */}
      <WarningBanner>
        <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--warn)', letterSpacing: '0.08em', marginBottom: 4 }}>
            ADVANCED PROTOCOL — COACH SUPERVISED ONLY
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
            PSMF is an extreme dietary intervention. Do not attempt without your coach's oversight. Read the contraindications carefully.
          </div>
        </div>
      </WarningBanner>

      {/* ── Quick Stats ── */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '20px 0' }}>
        <StatBox value="800-1000" sub="KCAL/DAY" label="Target Calories" />
        <StatBox value="1.2G" sub="PER LB LBM" label="Protein Target" />
        <StatBox value="MAX 2" sub="WEEKS" label="Per PSMF Cycle" />
        <StatBox value="ELECTRO" sub="LYTES" label="Critical Daily" />
      </div>

      {/* ── Overview ── */}
      <SectionToggle title="What Is PSMF?" defaultOpen icon="📋">
        <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.7, marginBottom: 16 }}>
          {PSMF_PROTOCOL.description}
        </p>
        <div style={{
          background: 'var(--s2)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '16px 18px',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 12 }}>
            THE SCIENCE
          </div>
          {PSMF_PROTOCOL.science.mechanism.map((point, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <div style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'var(--accent)20',
                border: '1px solid var(--accent)40',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontFamily: 'var(--font-display)',
                fontSize: 10,
                color: 'var(--accent)',
                marginTop: 2,
              }}>
                {i + 1}
              </div>
              <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6, margin: 0 }}>
                {point}
              </p>
            </div>
          ))}
        </div>
      </SectionToggle>

      {/* ── Personal Protein Calculator ── */}
      <SectionToggle title="Your Personal Protein Calculator" accent="var(--accent)" defaultOpen={isPSMFAssigned} icon="🧮">
        <ProteinCalculator profile={profile} />
      </SectionToggle>

      {/* ── Phase Overview ── */}
      <SectionToggle title="Protocol Phases" defaultOpen icon="🗓">
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {PSMF_PROTOCOL.phases.map(phase => (
            <div key={phase.id} style={{
              flex: '1 1 220px',
              background: phase.colorBg,
              border: `1px solid ${phase.colorBorder}`,
              borderRadius: 12,
              padding: '16px 18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 22 }}>{phase.icon}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: phase.color, letterSpacing: '0.1em' }}>
                    PHASE {phase.number}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)', letterSpacing: '0.04em' }}>
                    {phase.name.toUpperCase()}
                  </div>
                </div>
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 9,
                color: phase.color,
                letterSpacing: '0.08em',
                background: `${phase.color}18`,
                border: `1px solid ${phase.color}30`,
                borderRadius: 4,
                padding: '3px 8px',
                display: 'inline-block',
                marginBottom: 10,
              }}>
                {phase.label.toUpperCase()}
              </div>
              <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6, margin: '0 0 10px' }}>
                {phase.description}
              </p>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 6 }}>
                DURATION
              </div>
              <div style={{ fontSize: 12, color: 'var(--white)', fontFamily: 'var(--font-body)' }}>{phase.duration}</div>

              {phase.eat && (
                <>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--accent)', letterSpacing: '0.1em', marginTop: 12, marginBottom: 6 }}>
                    EAT
                  </div>
                  {phase.eat.slice(0, 4).map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                      <span style={{ color: 'var(--accent)', fontSize: 12, flexShrink: 0, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>{item}</span>
                    </div>
                  ))}
                </>
              )}

              {phase.why && (
                <>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--accent)', letterSpacing: '0.1em', marginTop: 12, marginBottom: 6 }}>
                    WHY IT WORKS
                  </div>
                  {phase.why.slice(0, 3).map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                      <span style={{ color: 'var(--accent)', fontSize: 12, flexShrink: 0, marginTop: 1 }}>→</span>
                      <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>{item}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </SectionToggle>

      {/* ── Approved Foods ── */}
      <SectionToggle title="Approved Foods" accent="var(--accent)" icon="✅">
        <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6, marginBottom: 16 }}>
          All food on PSMF days comes from the list below. Protein is your primary calorie source. Vegetables marked as unlimited may be eaten freely.
        </p>
        {PSMF_PROTOCOL.approvedFoods.map(cat => (
          <div key={cat.category} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: cat.color,
                flexShrink: 0,
              }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: cat.color, letterSpacing: '0.1em' }}>
                {cat.category.toUpperCase()}
              </div>
            </div>
            {cat.note && (
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-body)', marginBottom: 8, fontStyle: 'italic' }}>
                {cat.note}
              </div>
            )}
            {cat.items.map(item => (
              <FoodRow key={item.name} item={item} />
            ))}
          </div>
        ))}
      </SectionToggle>

      {/* ── Restricted Foods ── */}
      <SectionToggle title="What to Avoid" accent="var(--danger)" icon="🚫">
        <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6, marginBottom: 16 }}>
          These foods are excluded from PSMF days. Even small amounts of fat or carbohydrate add significant calories and undermine the ketogenic protein-sparing mechanism.
        </p>
        {PSMF_PROTOCOL.restrictedFoods.map((f, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: 12,
            padding: '10px 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ color: 'var(--danger)', fontSize: 14, flexShrink: 0, marginTop: 1 }}>✕</span>
            <div>
              <div style={{ fontSize: 13, color: 'var(--white)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                {f.item}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-body)', marginTop: 2 }}>
                {f.reason}
              </div>
            </div>
          </div>
        ))}
      </SectionToggle>

      {/* ── Electrolytes (Critical) ── */}
      <SectionToggle title="Electrolytes — Critical" accent="var(--danger)" defaultOpen={isPSMFAssigned} icon="⚡">
        <WarningBanner color="var(--danger)" bg="#e5353510">
          <span style={{ fontSize: 18, flexShrink: 0 }}>🚨</span>
          <div style={{ fontSize: 12, color: 'var(--danger)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
            {PSMF_PROTOCOL.electrolytes.warning}
          </div>
        </WarningBanner>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
          {PSMF_PROTOCOL.electrolytes.targets.map(elec => (
            <div key={elec.mineral} style={{
              background: 'var(--s2)',
              border: `1px solid ${elec.color}40`,
              borderLeft: `3px solid ${elec.color}`,
              borderRadius: '0 10px 10px 0',
              padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{elec.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--white)', letterSpacing: '0.04em' }}>
                      {elec.mineral.toUpperCase()}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 13,
                  color: elec.color,
                  letterSpacing: '0.04em',
                  textAlign: 'right',
                }}>
                  {elec.target}
                </div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-body)', marginBottom: 8 }}>
                <strong style={{ color: 'var(--white)' }}>Sources:</strong> {elec.sources.join(' · ')}
              </div>
              <div style={{ fontSize: 11, color: 'var(--danger)', fontFamily: 'var(--font-body)', marginBottom: 6 }}>
                <strong>Deficiency symptoms:</strong> {elec.deficiencySymptoms}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                {elec.note}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 12 }}>
            PRACTICAL TIPS
          </div>
          {PSMF_PROTOCOL.electrolytes.practicalTips.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <span style={{ color: 'var(--accent)', fontSize: 13, flexShrink: 0 }}>→</span>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>{tip}</span>
            </div>
          ))}
        </div>

        <WarningBanner color="var(--warn)" bg="#d9770608">
          <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
          <div style={{ fontSize: 12, color: 'var(--warn)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
            {PSMF_PROTOCOL.electrolytes.hyponatraeiaWarning}
          </div>
        </WarningBanner>
      </SectionToggle>

      {/* ── Supplements ── */}
      <SectionToggle title="Recommended Supplements" icon="💊">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PSMF_PROTOCOL.supplements.map(supp => {
            const priorityColor = supp.priority === 'Essential' ? 'var(--danger)'
              : supp.priority === 'Highly Recommended' ? 'var(--warn)'
              : supp.priority === 'Recommended' ? 'var(--info)' : 'var(--muted)'
            return (
              <div key={supp.name} style={{
                display: 'flex',
                gap: 14,
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
                alignItems: 'flex-start',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: 'var(--white)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                      {supp.name}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 8,
                      letterSpacing: '0.08em',
                      color: priorityColor,
                      background: `${priorityColor}18`,
                      border: `1px solid ${priorityColor}40`,
                      borderRadius: 3,
                      padding: '2px 6px',
                    }}>
                      {supp.priority.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-body)', marginBottom: 4 }}>
                    Dose: {supp.dose}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>
                    {supp.rationale}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </SectionToggle>

      {/* ── Side Effects ── */}
      <SectionToggle title="Side Effects & Management" icon="🩺">
        <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6, marginBottom: 16 }}>
          All side effects below are manageable and temporary. Most resolve by week 2. Click each to see management strategies.
        </p>
        {PSMF_PROTOCOL.sideEffects.map((effect, i) => (
          <SideEffectRow key={i} effect={effect} />
        ))}
      </SectionToggle>

      {/* ── Week by Week Guide ── */}
      <SectionToggle title="Week by Week Guide" icon="📅" defaultOpen={isPSMFAssigned}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {PSMF_PROTOCOL.weekByWeekGuide.map((week, i) => {
            const isCurrentWeek = psmfWeekInfo?.week === week.week
            const colors = [
              { c: 'var(--danger)', bg: '#e5353510', border: '#e5353530' },
              { c: 'var(--accent)', bg: '#00C89610', border: '#00C89630' },
              { c: 'var(--info)', bg: '#2563eb10', border: '#2563eb30' },
              { c: 'var(--purple)', bg: '#7c3aed10', border: '#7c3aed30' },
            ][i] || { c: 'var(--muted)', bg: 'var(--s2)', border: 'var(--border)' }

            return (
              <div key={week.week} style={{
                background: colors.bg,
                border: `1px solid ${isCurrentWeek ? colors.c : colors.border}`,
                borderRadius: 12,
                padding: '16px 18px',
                boxShadow: isCurrentWeek ? `0 0 0 2px ${colors.c}30` : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: colors.c, letterSpacing: '0.12em', marginBottom: 3 }}>
                      WEEK {week.week}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)', letterSpacing: '0.04em' }}>
                      {week.title.toUpperCase()}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', marginTop: 2 }}>
                      {week.subtitle}
                    </div>
                  </div>
                  {isCurrentWeek && (
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 9,
                      color: colors.c,
                      background: `${colors.c}20`,
                      border: `1px solid ${colors.c}50`,
                      borderRadius: 4,
                      padding: '3px 8px',
                      letterSpacing: '0.08em',
                      flexShrink: 0,
                    }}>
                      YOU ARE HERE
                    </div>
                  )}
                </div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {week.keyPoints.map((point, j) => (
                    <li key={j} style={{
                      fontSize: 12,
                      color: 'var(--muted)',
                      fontFamily: 'var(--font-body)',
                      lineHeight: 1.65,
                      marginBottom: 6,
                    }}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </SectionToggle>

      {/* ── Exit Protocol ── */}
      <SectionToggle title="Exit Protocol — Transitioning Off PSMF" icon="🚪">
        <p style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6, marginBottom: 16 }}>
          {PSMF_PROTOCOL.exitProtocol.description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {PSMF_PROTOCOL.exitProtocol.steps.map((step, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: 14,
              background: 'var(--s2)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '14px 16px',
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--accent)20',
                border: '1px solid var(--accent)40',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontFamily: 'var(--font-display)',
                fontSize: 13,
                color: 'var(--accent)',
              }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--white)', letterSpacing: '0.06em', marginBottom: 4 }}>
                  {step.phase.toUpperCase()}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
                  {step.instruction}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--warn)', letterSpacing: '0.1em', marginBottom: 10 }}>
          IMPORTANT WARNINGS
        </div>
        {PSMF_PROTOCOL.exitProtocol.warnings.map((w, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
            <span style={{ color: 'var(--warn)', fontSize: 13, flexShrink: 0 }}>⚠</span>
            <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>{w}</span>
          </div>
        ))}
      </SectionToggle>

      {/* ── FAQ ── */}
      <SectionToggle title="Frequently Asked Questions" icon="❓">
        {PSMF_PROTOCOL.faqs.map((faq, i) => (
          <AccordionItem key={i} question={faq.question} answer={faq.answer} />
        ))}
      </SectionToggle>

      {/* ── Who Is It For / Contraindications ── */}
      <SectionToggle title="Who Is It For — and Who Should NOT Do It" icon="👤">
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 260px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 12 }}>
              IDEAL CANDIDATES
            </div>
            {PSMF_PROTOCOL.whoIsItFor.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <span style={{ color: 'var(--accent)', fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: '1 1 260px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--danger)', letterSpacing: '0.1em', marginBottom: 12 }}>
              CONTRAINDICATIONS — DO NOT START IF:
            </div>
            {PSMF_PROTOCOL.contraindications.map((item, i) => (
              <div key={i} style={{
                padding: '8px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                <div style={{ fontSize: 12, color: 'var(--white)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                  {item.condition}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-body)', marginTop: 2 }}>
                  {item.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionToggle>

      {/* ── Monitoring ── */}
      <SectionToggle title="What to Track" icon="📊">
        <p style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.6, marginBottom: 16 }}>
          Record these metrics in your weekly check-in. Your coach monitors these to ensure the protocol is working safely.
        </p>
        {PSMF_PROTOCOL.monitoring.map((m, i) => (
          <div key={i} style={{
            padding: '12px 0',
            borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div style={{ fontSize: 13, color: 'var(--white)', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                {m.metric}
              </div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 9,
                color: 'var(--accent)',
                background: 'var(--accent)18',
                border: '1px solid var(--accent)30',
                borderRadius: 3,
                padding: '2px 7px',
                letterSpacing: '0.06em',
                flexShrink: 0,
                marginLeft: 10,
              }}>
                {m.frequency.includes('Daily') ? 'DAILY' : m.frequency.includes('Per') ? 'PER SESSION' : 'WEEKLY'}
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.5, marginBottom: 4 }}>
              {m.howToTrack}
            </div>
            <div style={{ fontSize: 11, color: 'var(--danger)', fontFamily: 'var(--font-body)' }}>
              Red flag: {m.redFlags}
            </div>
          </div>
        ))}
      </SectionToggle>

      {/* ── Safety Disclaimer ── */}
      <WarningBanner color="var(--warn)" bg="#d9770610">
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--warn)', letterSpacing: '0.1em', marginBottom: 8 }}>
            MEDICAL DISCLAIMER
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)', lineHeight: 1.7 }}>
            {PSMF_PROTOCOL.legalDisclaimer}
          </div>
        </div>
      </WarningBanner>

    </div>
  )
}
