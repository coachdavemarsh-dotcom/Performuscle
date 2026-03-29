import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { getActiveMealPlan } from '../../lib/supabase.js'

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_TABS = [
  { key: 'training', label: 'Training Day' },
  { key: 'moderate', label: 'Moderate Day' },
  { key: 'rest', label: 'Rest Day' },
]

const MEAL_SECTIONS = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snacks', label: 'Snacks' },
]

// ─── Macro helpers ────────────────────────────────────────────────────────────

function sumSection(items = []) {
  return items.reduce(
    (acc, item) => ({
      kcal: acc.kcal + (item.kcal || 0),
      protein_g: acc.protein_g + (item.protein_g || 0),
      carbs_g: acc.carbs_g + (item.carbs_g || 0),
      fat_g: acc.fat_g + (item.fat_g || 0),
    }),
    { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  )
}

function sumDay(dayData = {}) {
  return MEAL_SECTIONS.reduce(
    (acc, s) => {
      const totals = sumSection(dayData[s.key])
      return {
        kcal: acc.kcal + totals.kcal,
        protein_g: acc.protein_g + totals.protein_g,
        carbs_g: acc.carbs_g + totals.carbs_g,
        fat_g: acc.fat_g + totals.fat_g,
      }
    },
    { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MacroPill({ label, value, unit = 'g', color }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        padding: '2px 7px',
        borderRadius: 999,
        background: color + '18',
        color: color,
        fontSize: 11,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {label}: {value}{unit}
    </span>
  )
}

function RecipeRow({ item }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 6,
        padding: '8px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: 14,
          color: 'var(--white)',
          flex: '1 1 140px',
          minWidth: 0,
        }}
      >
        {item.name}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, flexShrink: 0 }}>
        <MacroPill label="P" value={item.protein_g ?? 0} color="var(--accent)" />
        <MacroPill label="C" value={item.carbs_g ?? 0} color="#2563eb" />
        <MacroPill label="F" value={item.fat_g ?? 0} color="var(--warn)" />
        <MacroPill label="" value={item.kcal ?? 0} unit="cal" color="var(--muted)" />
      </div>
    </div>
  )
}

function SectionTotalsRow({ totals }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        paddingTop: 10,
        marginTop: 4,
        borderTop: '1px solid var(--border-hi)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          color: 'var(--muted)',
          marginRight: 4,
          alignSelf: 'center',
        }}
      >
        Total:
      </span>
      <MacroPill label="P" value={Math.round(totals.protein_g)} color="var(--accent)" />
      <MacroPill label="C" value={Math.round(totals.carbs_g)} color="#2563eb" />
      <MacroPill label="F" value={Math.round(totals.fat_g)} color="var(--warn)" />
      <MacroPill label="" value={Math.round(totals.kcal)} unit=" kcal" color="var(--muted)" />
    </div>
  )
}

function MealSectionCard({ label, items = [] }) {
  const totals = sumSection(items)
  const hasItems = items.length > 0

  return (
    <div
      className="card"
      style={{ marginBottom: 16 }}
    >
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 18,
          color: 'var(--accent)',
          letterSpacing: '0.05em',
          margin: '0 0 10px 0',
        }}
      >
        {label}
      </h3>

      {hasItems ? (
        <>
          <div>
            {items.map((item, i) => (
              <RecipeRow key={item.recipe_id ?? i} item={item} />
            ))}
          </div>
          <SectionTotalsRow totals={totals} />
        </>
      ) : (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--muted)',
            margin: 0,
          }}
        >
          No items in this meal.
        </p>
      )}
    </div>
  )
}

function DayTotalsBar({ dayData }) {
  const totals = sumDay(dayData)

  const stats = [
    { label: 'Calories', value: Math.round(totals.kcal), unit: 'kcal', color: 'var(--white)' },
    { label: 'Protein', value: Math.round(totals.protein_g), unit: 'g', color: 'var(--accent)' },
    { label: 'Carbs', value: Math.round(totals.carbs_g), unit: 'g', color: '#2563eb' },
    { label: 'Fat', value: Math.round(totals.fat_g), unit: 'g', color: 'var(--warn)' },
  ]

  return (
    <div
      className="card"
      style={{ marginTop: 8 }}
    >
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 15,
          color: 'var(--muted)',
          letterSpacing: '0.08em',
          margin: '0 0 14px 0',
        }}
      >
        DAY TOTALS
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                color: s.color,
                lineHeight: 1,
              }}
            >
              {s.value}
              <span style={{ fontSize: 13, marginLeft: 2, color: 'var(--muted)' }}>{s.unit}</span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--muted)',
                marginTop: 3,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RestDayNote() {
  return (
    <div
      style={{
        padding: '14px 16px',
        borderRadius: 8,
        background: 'var(--sub)',
        border: '1px solid var(--border)',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        color: 'var(--muted)',
        marginBottom: 16,
      }}
    >
      Rest day — eat to your macro targets.
    </div>
  )
}

function EmptyState() {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        gap: 16,
      }}
    >
      <span style={{ fontSize: 48 }}>🍽️</span>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          color: 'var(--muted)',
          maxWidth: 320,
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        No meal plan assigned yet — your coach will set one up for you.
      </p>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MealPlanView() {
  const { user } = useAuth()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeDay, setActiveDay] = useState('training')

  useEffect(() => {
    if (!user?.id) return
    let cancelled = false

    async function load() {
      setLoading(true)
      const { data } = await getActiveMealPlan(user.id)
      if (!cancelled) {
        setPlan(data ?? null)
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [user?.id])

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
        }}
      >
        <span className="spinner" />
      </div>
    )
  }

  if (!plan) {
    return (
      <div style={{ padding: '0 0 32px' }}>
        <EmptyState />
      </div>
    )
  }

  const dayData = plan.days?.[activeDay] ?? {}
  const hasAnyItems = MEAL_SECTIONS.some(
    (s) => (dayData[s.key] ?? []).length > 0
  )

  return (
    <div style={{ padding: '0 0 48px' }}>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            color: 'var(--white)',
            letterSpacing: '0.04em',
            margin: '0 0 4px 0',
          }}
        >
          {plan.name}
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--muted)',
            margin: 0,
          }}
        >
          Assigned by your coach
        </p>
      </div>

      {/* Day tabs */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        {DAY_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveDay(tab.key)}
            className={activeDay === tab.key ? 'btn btn-sm' : 'btn btn-ghost btn-sm'}
            style={{
              borderRadius: 999,
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: 13,
              ...(activeDay === tab.key
                ? { background: 'var(--accent)', color: 'var(--ink)', border: 'none' }
                : { color: 'var(--muted)' }),
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Meal sections or rest note */}
      {!hasAnyItems ? (
        <RestDayNote />
      ) : (
        MEAL_SECTIONS.map((s) => (
          <MealSectionCard
            key={s.key}
            label={s.label}
            items={dayData[s.key] ?? []}
          />
        ))
      )}

      {/* Day totals bar */}
      <DayTotalsBar dayData={dayData} />
    </div>
  )
}
