import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { getActiveMealPlan } from '../../lib/supabase.js'

// ─── Config ───────────────────────────────────────────────────────────────────

const DAY_TABS = [
  { key: 'training', label: 'Training',  icon: '⚡', color: 'var(--accent)'  },
  { key: 'moderate', label: 'Moderate',  icon: '🔄', color: 'var(--info)'    },
  { key: 'rest',     label: 'Rest',      icon: '💤', color: 'var(--purple)'  },
]

const MEAL_SECTIONS = [
  { key: 'breakfast',    label: 'Breakfast',       icon: '🌅' },
  { key: 'pre_workout',  label: 'Pre-Workout',     icon: '⚡' },
  { key: 'lunch',        label: 'Lunch',           icon: '☀️' },
  { key: 'post_workout', label: 'Post-Workout',    icon: '💪' },
  { key: 'dinner',       label: 'Dinner',          icon: '🌙' },
  { key: 'snacks',       label: 'Snacks',          icon: '🍎' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sumItems(items = []) {
  return items.reduce(
    (acc, item) => ({
      kcal:      acc.kcal      + (item.kcal      || 0),
      protein_g: acc.protein_g + (item.protein_g || 0),
      carbs_g:   acc.carbs_g   + (item.carbs_g   || 0),
      fat_g:     acc.fat_g     + (item.fat_g     || 0),
    }),
    { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  )
}

function sumDay(dayData = {}) {
  return MEAL_SECTIONS.reduce((acc, s) => {
    const t = sumItems(dayData[s.key])
    return {
      kcal:      acc.kcal      + t.kcal,
      protein_g: acc.protein_g + t.protein_g,
      carbs_g:   acc.carbs_g   + t.carbs_g,
      fat_g:     acc.fat_g     + t.fat_g,
    }
  }, { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 })
}

// ─── Day totals strip ─────────────────────────────────────────────────────────

function DayTotals({ dayData, color }) {
  const t = sumDay(dayData)
  const stats = [
    { label: 'CALORIES', value: Math.round(t.kcal),      unit: 'kcal', color },
    { label: 'PROTEIN',  value: Math.round(t.protein_g), unit: 'g',    color: 'var(--accent)' },
    { label: 'CARBS',    value: Math.round(t.carbs_g),   unit: 'g',    color: 'var(--info)'   },
    { label: 'FAT',      value: Math.round(t.fat_g),     unit: 'g',    color: 'var(--warn)'   },
  ]
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 20,
    }}>
      {stats.map(s => (
        <div key={s.label} style={{
          background: 'var(--s3)', borderRadius: 10, padding: '12px 8px', textAlign: 'center',
          border: `1px solid ${s.color}22`,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: '1.5px', color: 'var(--muted)', marginBottom: 5 }}>
            {s.label}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: s.color, lineHeight: 1 }}>
            {s.value}
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{s.unit}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Food item row ────────────────────────────────────────────────────────────

function FoodRow({ item }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-hi)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: 'var(--white)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.name}
        </div>
        {item.serving && (
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{item.serving}</div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 10, flexShrink: 0, alignItems: 'center' }}>
        <MacroChip value={item.protein_g ?? 0} label="P" color="var(--accent)" />
        <MacroChip value={item.carbs_g   ?? 0} label="C" color="var(--info)"   />
        <MacroChip value={item.fat_g     ?? 0} label="F" color="var(--warn)"   />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--muted)', minWidth: 44, textAlign: 'right' }}>
          {item.kcal ?? 0}<span style={{ fontSize: 9, marginLeft: 1 }}>kcal</span>
        </div>
      </div>
    </div>
  )
}

function MacroChip({ value, label, color }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 32 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color, lineHeight: 1 }}>
        {Math.round(value)}
      </div>
      <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  )
}

// ─── Meal section card ────────────────────────────────────────────────────────

function MealSection({ section, items }) {
  if (!items?.length) return null
  const totals = sumItems(items)

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>{section.icon}</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.08em', color: 'var(--white)' }}>
              {section.label.toUpperCase()}
            </div>
          </div>
        </div>
        {/* Section kcal */}
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--muted)' }}>
          {Math.round(totals.kcal)}<span style={{ fontSize: 10, marginLeft: 2 }}>kcal</span>
        </div>
      </div>

      {/* Macro header row */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end', gap: 10, paddingBottom: 6,
        marginBottom: 2, borderBottom: '1px solid var(--border-hi)',
      }}>
        {[
          { label: 'P', color: 'var(--accent)' },
          { label: 'C', color: 'var(--info)'   },
          { label: 'F', color: 'var(--warn)'   },
        ].map(m => (
          <div key={m.label} style={{ minWidth: 32, textAlign: 'center', fontSize: 9, color: m.color, fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>
            {m.label}
          </div>
        ))}
        <div style={{ minWidth: 44 }} />
      </div>

      {/* Food rows */}
      {items.map((item, i) => (
        <FoodRow key={item.recipe_id ?? i} item={item} />
      ))}

      {/* Section totals */}
      {items.length > 1 && (
        <div style={{
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
          gap: 10, paddingTop: 8, marginTop: 2,
        }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginRight: 'auto' }}>TOTAL</div>
          <MacroChip value={totals.protein_g} label="P" color="var(--accent)" />
          <MacroChip value={totals.carbs_g}   label="C" color="var(--info)"   />
          <MacroChip value={totals.fat_g}     label="F" color="var(--warn)"   />
          <div style={{ minWidth: 44 }} />
        </div>
      )}
    </div>
  )
}

// ─── Empty / rest states ──────────────────────────────────────────────────────

function RestDayNote() {
  return (
    <div style={{
      padding: '16px 18px', borderRadius: 10, marginBottom: 16,
      background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)',
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.06em', color: 'var(--purple)', marginBottom: 4 }}>
        💤 REST DAY
      </div>
      <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
        No specific meal plan for today — eat to your macro targets, prioritise protein and keep carbs moderate. Focus on recovery.
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{ fontSize: 40, marginBottom: 14 }}>🍽️</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.04em', color: 'var(--white)', marginBottom: 8 }}>
        NO MEAL PLAN YET
      </div>
      <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 280, margin: '0 auto' }}>
        Your coach will assign a personalised meal plan once your onboarding is complete.
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function MealPlanView() {
  const { user } = useAuth()
  const [plan,       setPlan]       = useState(null)
  const [loading,    setLoading]    = useState(true)
  const [activeDay,  setActiveDay]  = useState('training')

  useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    async function load() {
      setLoading(true)
      const { data } = await getActiveMealPlan(user.id)
      if (!cancelled) { setPlan(data ?? null); setLoading(false) }
    }
    load()
    return () => { cancelled = true }
  }, [user?.id])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
      <span className="spinner" />
    </div>
  )

  if (!plan) return <EmptyState />

  const dayData     = plan.days?.[activeDay] ?? {}
  const activeTab   = DAY_TABS.find(t => t.key === activeDay)
  const hasAnyItems = MEAL_SECTIONS.some(s => (dayData[s.key] ?? []).length > 0)

  return (
    <div style={{ paddingBottom: 48 }}>
      {/* Plan name */}
      <div style={{ marginBottom: 20 }}>
        <div className="label" style={{ marginBottom: 2 }}>Coach-assigned plan</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: '0.04em', color: 'var(--white)' }}>
          {plan.name}
        </div>
      </div>

      {/* Day type tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {DAY_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveDay(tab.key)}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.08em',
              border: `1.5px solid ${activeDay === tab.key ? tab.color : 'var(--border-hi)'}`,
              background: activeDay === tab.key ? `${tab.color}15` : 'var(--s2)',
              color: activeDay === tab.key ? tab.color : 'var(--sub)',
              transition: 'all 0.15s',
            }}
          >
            {tab.icon} {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Day totals — at the top so clients see their target at a glance */}
      <DayTotals dayData={dayData} color={activeTab?.color || 'var(--accent)'} />

      {/* Meal sections or rest note */}
      {!hasAnyItems ? (
        <RestDayNote />
      ) : (
        MEAL_SECTIONS.map(s => (
          <MealSection
            key={s.key}
            section={s}
            items={dayData[s.key] ?? []}
          />
        ))
      )}
    </div>
  )
}
