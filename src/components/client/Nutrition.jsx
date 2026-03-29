import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useClient } from '../../hooks/useClient.js'
import MacroBar from '../shared/MacroBar.jsx'
import { getNutritionLog, upsertNutritionLog, searchFoods } from '../../lib/supabase.js'
import { sumMacros } from '../../lib/calculators.js'
import RecipeLibrary from './RecipeLibrary.jsx'
import MealPlanView from './MealPlanView.jsx'

const TODAY = new Date().toISOString().split('T')[0]

const DAY_TYPES = [
  { value: 'training', label: 'Training Day' },
  { value: 'moderate', label: 'Moderate Day' },
  { value: 'rest', label: 'Rest Day' },
]

// ─── Food Search (database-first, Nutritionix fallback) ─────────────────────

async function searchNutrionix(query, appId, appKey) {
  if (!appId || !appKey) return []
  try {
    const res = await fetch(
      `https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(query)}`,
      { headers: { 'x-app-id': appId, 'x-app-key': appKey } }
    )
    const data = await res.json()
    return [...(data.common || []).slice(0, 5), ...(data.branded || []).slice(0, 5)]
      .map(f => ({
        _source: 'nutritionix',
        name: f.food_name || f.item_name,
        serving_amount: f.serving_qty || 100,
        serving_unit: f.serving_unit || 'g',
        kcal: f.nf_calories || 0,
        protein_g: f.nf_protein || 0,
        carbs_g: f.nf_total_carbohydrate || 0,
        fat_g: f.nf_total_fat || 0,
        fibre_g: 0,
        category: 'External',
      }))
  } catch { return [] }
}

function FoodSearchInput({ onAdd }) {
  const [query, setQuery]         = useState('')
  const [results, setResults]     = useState([])
  const [searching, setSearching] = useState(false)
  const [open, setOpen]           = useState(false)
  // Serving-size modal state
  const [selected, setSelected]   = useState(null)   // food row from DB
  const [servingG, setServingG]   = useState('')      // grams user enters
  const timeoutRef = useRef(null)
  const inputRef   = useRef(null)

  const appId  = import.meta.env.VITE_NUTRITIONIX_APP_ID
  const appKey = import.meta.env.VITE_NUTRITIONIX_APP_KEY

  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); return }
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(async () => {
      setSearching(true)
      const dbResults  = await searchFoods(query, 15)
      // Only hit Nutritionix if DB gives fewer than 5 results
      const nxResults  = dbResults.length < 5
        ? await searchNutrionix(query, appId, appKey)
        : []
      setResults([...dbResults, ...nxResults])
      setOpen(true)
      setSearching(false)
    }, 300)
    return () => clearTimeout(timeoutRef.current)
  }, [query])

  function pickFood(food) {
    setOpen(false)
    setQuery('')
    setResults([])
    if (food._source === 'nutritionix') {
      // Nutritionix gives absolute values, add directly
      onAdd({
        name: food.name,
        serving: `${food.serving_amount}${food.serving_unit}`,
        kcal: Math.round(food.kcal),
        protein_g: Math.round(food.protein_g * 10) / 10,
        carbs_g:   Math.round(food.carbs_g * 10) / 10,
        fat_g:     Math.round(food.fat_g * 10) / 10,
      })
    } else {
      // DB foods are per serving_amount — open serving-size picker
      setSelected(food)
      setServingG(String(food.serving_amount || 100))
    }
  }

  function confirmServing() {
    if (!selected) return
    const grams = parseFloat(servingG) || selected.serving_amount || 100
    const ratio = grams / (selected.serving_amount || 100)
    const r = (v) => Math.round((v || 0) * ratio * 10) / 10
    onAdd({
      name: selected.name,
      serving: `${grams}${selected.serving_unit || 'g'}`,
      kcal:      Math.round((selected.kcal || 0) * ratio),
      protein_g: r(selected.protein_g),
      carbs_g:   r(selected.carbs_g),
      fat_g:     r(selected.fat_g),
      fibre_g:   r(selected.fibre_g),
    })
    setSelected(null)
    setServingG('')
  }

  // Live scaled preview
  const preview = selected
    ? (() => {
        const grams = parseFloat(servingG) || selected.serving_amount || 100
        const ratio = grams / (selected.serving_amount || 100)
        const r = v => Math.round((v || 0) * ratio * 10) / 10
        return {
          kcal: Math.round((selected.kcal || 0) * ratio),
          p: r(selected.protein_g), c: r(selected.carbs_g), f: r(selected.fat_g),
        }
      })()
    : null

  return (
    <div>
      {/* Search bar */}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          className="input input-sm"
          placeholder="🔍 Search food database..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
        />
        {searching && (
          <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
            <div className="spinner" style={{ width: 14, height: 14 }} />
          </div>
        )}
        {open && results.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'var(--s1)', border: '1px solid var(--border-hi)',
            borderRadius: 'var(--radius-sm)', zIndex: 200,
            maxHeight: 280, overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,.12)',
          }}>
            {results.map((food, i) => {
              const isNx = food._source === 'nutritionix'
              return (
                <div
                  key={i}
                  onMouseDown={() => pickFood(food)}
                  style={{
                    padding: '9px 13px', cursor: 'pointer',
                    borderBottom: '1px solid var(--border)', fontSize: 13,
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--s3)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--white)', fontWeight: 500 }}>{food.name}</span>
                    {isNx && (
                      <span style={{ fontSize: 9, color: 'var(--muted)', background: 'var(--s4)', padding: '1px 6px', borderRadius: 4 }}>
                        ext
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, display: 'flex', gap: 8 }}>
                    <span>{Math.round(food.kcal)} kcal</span>
                    <span>P {food.protein_g}g</span>
                    <span>C {food.carbs_g}g</span>
                    <span>F {food.fat_g}g</span>
                    {!isNx && <span style={{ color: 'var(--sub)' }}>per {food.serving_amount}{food.serving_unit}</span>}
                    {food.category && <span style={{ color: 'var(--sub)', marginLeft: 'auto' }}>{food.category}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {query.length > 1 && !searching && open && results.length === 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'var(--s1)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', padding: '12px',
            fontSize: 13, color: 'var(--muted)', zIndex: 200,
          }}>
            No results found for "{query}"
          </div>
        )}
      </div>

      {/* Serving-size modal */}
      {selected && (
        <div style={{
          marginTop: 10, background: 'var(--s2)', borderRadius: 'var(--radius-sm)',
          padding: '12px 14px', border: '1px solid var(--border-accent)',
        }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--white)', marginBottom: 4 }}>
            {selected.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>
            Database values are per {selected.serving_amount}{selected.serving_unit}. Enter your serving:
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
            <input
              className="input input-sm"
              type="number"
              inputMode="decimal"
              value={servingG}
              onChange={e => setServingG(e.target.value)}
              placeholder={String(selected.serving_amount)}
              style={{ width: 90 }}
              autoFocus
            />
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{selected.serving_unit || 'g'}</span>
          </div>
          {preview && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
              {[
                { label: 'KCAL', val: preview.kcal, color: 'var(--accent)' },
                { label: 'P',    val: preview.p + 'g', color: '#f472b6' },
                { label: 'C',    val: preview.c + 'g', color: '#60a5fa' },
                { label: 'F',    val: preview.f + 'g', color: '#fbbf24' },
              ].map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: m.color }}>{m.val}</div>
                  <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 1 }}>{m.label}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={confirmServing}>
              + Add to Meal
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setSelected(null); setServingG('') }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MealCard({ meal, mealIndex, onUpdate, onDelete }) {
  function addFood(food) {
    const updated = { ...meal, foods: [...(meal.foods || []), food] }
    onUpdate(mealIndex, updated)
  }

  function removeFood(foodIndex) {
    const updated = { ...meal, foods: meal.foods.filter((_, i) => i !== foodIndex) }
    onUpdate(mealIndex, updated)
  }

  const totals = sumMacros(meal.foods || [])

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            className="input input-sm"
            style={{ width: 160 }}
            value={meal.name || ''}
            onChange={e => onUpdate(mealIndex, { ...meal, name: e.target.value })}
            placeholder="Meal name"
          />
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>
            {Math.round(totals.kcal)} kcal · P {Math.round(totals.protein_g)}g · C {Math.round(totals.carbs_g)}g · F {Math.round(totals.fat_g)}g
          </span>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => onDelete(mealIndex)}>✕</button>
      </div>

      {/* Food rows */}
      {(meal.foods || []).length > 0 && (
        <table className="table" style={{ marginBottom: 10 }}>
          <thead>
            <tr>
              <th>Food</th>
              <th>Serving</th>
              <th>kcal</th>
              <th>P (g)</th>
              <th>C (g)</th>
              <th>F (g)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(meal.foods || []).map((food, i) => (
              <tr key={i}>
                <td>{food.name}</td>
                <td style={{ color: 'var(--muted)' }}>{food.serving}</td>
                <td>{Math.round(food.kcal)}</td>
                <td>{food.protein_g?.toFixed(1)}</td>
                <td>{food.carbs_g?.toFixed(1)}</td>
                <td>{food.fat_g?.toFixed(1)}</td>
                <td>
                  <button
                    style={{ color: 'var(--danger)', fontSize: 12 }}
                    onClick={() => removeFood(i)}
                  >✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <FoodSearchInput onAdd={addFood} />
    </div>
  )
}

export default function Nutrition() {
  const { user, profile } = useAuth()
  const { nutritionPlan } = useClient()
  const navigate = useNavigate()
  const [tab, setTab] = useState('log')   // 'log' | 'recipes'
  const [date, setDate] = useState(TODAY)
  const [dayType, setDayType] = useState('training')
  const [meals, setMeals] = useState([
    { name: 'Breakfast', foods: [] },
    { name: 'Lunch', foods: [] },
    { name: 'Dinner', foods: [] },
  ])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!user) return
    loadLog()
  }, [user, date])

  async function loadLog() {
    setLoading(true)
    const { data } = await getNutritionLog(user.id, date)
    if (data) {
      setDayType(data.day_type || 'training')
      setMeals(data.meals || [{ name: 'Breakfast', foods: [] }, { name: 'Lunch', foods: [] }, { name: 'Dinner', foods: [] }])
    } else {
      setMeals([{ name: 'Breakfast', foods: [] }, { name: 'Lunch', foods: [] }, { name: 'Dinner', foods: [] }])
    }
    setLoading(false)
  }

  function updateMeal(index, meal) {
    const updated = [...meals]
    updated[index] = meal
    setMeals(updated)
  }

  function deleteMeal(index) {
    setMeals(meals.filter((_, i) => i !== index))
  }

  function addMeal() {
    setMeals([...meals, { name: `Meal ${meals.length + 1}`, foods: [] }])
  }

  async function save() {
    setSaving(true)
    const totals = sumMacros(meals.flatMap(m => m.foods || []))
    await upsertNutritionLog({
      client_id: user.id,
      logged_date: date,
      day_type: dayType,
      meals,
      total_kcal: totals.kcal,
      total_protein_g: totals.protein_g,
      total_carbs_g: totals.carbs_g,
      total_fat_g: totals.fat_g,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Get targets from nutrition plan for this day type
  const planDayType = nutritionPlan?.day_types?.find(dt => dt.label === dayType || dt.day_type === dayType)
  const targets = planDayType
    ? { kcal: planDayType.kcal, protein_g: planDayType.protein_g, carbs_g: planDayType.carbs_g, fat_g: planDayType.fat_g }
    : {}

  const allFoods = meals.flatMap(m => m.foods || [])
  const currentMacros = sumMacros(allFoods)

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header flex-between">
        <div>
          <div className="page-title">Nutrition</div>
          <div className="page-subtitle">{tab === 'log' ? 'Track your daily intake' : 'Recipe library'}</div>
        </div>
        {tab === 'log' && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              className="input input-sm"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ width: 140 }}
            />
            <button
              className={`btn ${saved ? 'btn-primary' : 'btn-ghost'}`}
              onClick={save}
              disabled={saving}
            >
              {saving ? '…' : saved ? 'SAVED ✓' : 'SAVE LOG'}
            </button>
          </div>
        )}
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {[
          { value: 'log',      label: '📋 Food Log' },
          { value: 'recipes',  label: '📖 Recipes' },
          { value: 'mealplan', label: '🍽️ Meal Plan' },
        ].map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 8,
              border: `1.5px solid ${tab === t.value ? 'var(--accent)' : 'var(--border-hi)'}`,
              background: tab === t.value ? 'rgba(0,200,150,.10)' : 'var(--s2)',
              color: tab === t.value ? 'var(--accent)' : 'var(--sub)',
              fontFamily: 'var(--font-display)',
              fontSize: 12,
              letterSpacing: 0.5,
              cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Recipe Library tab */}
      {tab === 'recipes' && <RecipeLibrary date={date} />}

      {/* Meal Plan tab */}
      {tab === 'mealplan' && <MealPlanView />}

      {/* Food Log tab */}
      {tab === 'log' && <>

      {/* Day Type */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {DAY_TYPES.map(dt => (
          <button
            key={dt.value}
            className={`btn ${dayType === dt.value ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setDayType(dt.value)}
          >
            {dt.label}
          </button>
        ))}
      </div>

      {/* PSMF Protocol Banner — shown when coach has assigned this protocol */}
      {profile?.nutrition_protocol_type === 'psmf' && (
        <div
          onClick={() => navigate('/psmf')}
          style={{
            marginBottom: 20, padding: '14px 18px',
            background: 'rgba(229,53,53,.06)',
            border: '1px solid rgba(229,53,53,.25)',
            borderLeft: '3px solid var(--danger)',
            borderRadius: 8, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 14,
            transition: 'background .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(229,53,53,.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(229,53,53,.06)'}
        >
          <span style={{ fontSize: 24 }}>🔥</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1.5, color: 'var(--danger)', marginBottom: 2 }}>
              ACTIVE PROTOCOL: PSMF
            </div>
            <div style={{ fontSize: 12, color: 'var(--sub)' }}>
              Protein Sparing Modified Fast — view your targets, approved foods &amp; full guide
            </div>
          </div>
          <span style={{ color: 'var(--danger)', fontSize: 16 }}>→</span>
        </div>
      )}

      {/* Macro Bar */}
      {Object.keys(targets).length > 0 && (
        <div className="section-gap">
          <MacroBar current={currentMacros} targets={targets} />
        </div>
      )}

      {/* Meals */}
      <div className="section-gap">
        {meals.map((meal, i) => (
          <MealCard
            key={i}
            meal={meal}
            mealIndex={i}
            onUpdate={updateMeal}
            onDelete={deleteMeal}
          />
        ))}

        <button className="btn btn-ghost" onClick={addMeal} style={{ width: '100%' }}>
          + ADD MEAL
        </button>
      </div>

      {/* Coach plan targets (read-only) */}
      {nutritionPlan && planDayType && (
        <div className="card card-accent">
          <div className="label" style={{ marginBottom: 8 }}>Coach-Assigned Targets — {dayType}</div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Calories', val: planDayType.kcal, unit: 'kcal' },
              { label: 'Protein', val: planDayType.protein_g, unit: 'g' },
              { label: 'Carbs', val: planDayType.carbs_g, unit: 'g' },
              { label: 'Fat', val: planDayType.fat_g, unit: 'g' },
            ].map(item => (
              <div key={item.label}>
                <div className="label">{item.label}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>
                  {item.val}<span style={{ fontSize: 11, color: 'var(--muted)' }}>{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* end food log tab */}
      </>}
    </div>
  )
}
