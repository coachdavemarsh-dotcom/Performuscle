import { useState, useEffect, useCallback } from 'react'
import { getRecipes, addRecipeToNutritionLog } from '../../lib/supabase.js'
import { useAuth } from '../../hooks/useAuth.jsx'

const CATEGORIES = [
  { value: 'all',       label: 'All',       icon: '🍽️' },
  { value: 'breakfast', label: 'Breakfast',  icon: '🍳' },
  { value: 'lunch',     label: 'Lunch',      icon: '🥗' },
  { value: 'dinner',    label: 'Dinner',     icon: '🍖' },
  { value: 'snack',     label: 'Snacks',     icon: '🍫' },
]

const TAG_FILTERS = [
  { value: 'high-protein', label: 'High Protein' },
  { value: 'low-carb',     label: 'Low Carb' },
  { value: 'quick',        label: 'Quick (<30 min)' },
  { value: 'meal-prep',    label: 'Meal Prep' },
  { value: 'gluten-free',  label: 'Gluten Free' },
  { value: 'dairy-free',   label: 'Dairy Free' },
  { value: 'vegetarian',   label: 'Vegetarian' },
]

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-workout', 'Post-workout']

const TODAY = new Date().toISOString().split('T')[0]

function MacroPill({ label, value, color }) {
  if (value == null) return null
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      background: `${color}18`, border: `1px solid ${color}35`,
      borderRadius: 6, padding: '4px 8px', minWidth: 44,
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color, letterSpacing: 0.5 }}>{value}</div>
      <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 0.5, fontFamily: 'var(--font-display)' }}>{label}</div>
    </div>
  )
}

function RecipeCard({ recipe, onAddToDay }) {
  const [expanded, setExpanded] = useState(false)
  const [addOpen, setAddOpen]   = useState(false)
  const [mealType, setMealType] = useState('Dinner')
  const [adding, setAdding]     = useState(false)
  const [added, setAdded]       = useState(false)

  const tagColors = {
    'high-protein': 'var(--accent)',
    'low-carb': 'var(--info)',
    'quick': 'var(--warn)',
    'meal-prep': 'var(--purple)',
    'gluten-free': '#f472b6',
    'dairy-free': '#a78bfa',
    'vegetarian': '#34d399',
    'contains-nuts': '#fb923c',
  }

  async function handleAdd() {
    setAdding(true)
    await onAddToDay(recipe, mealType)
    setAdding(false)
    setAdded(true)
    setAddOpen(false)
    setTimeout(() => setAdded(false), 3000)
  }

  const catIcon = CATEGORIES.find(c => c.value === recipe.category)?.icon || '🍽️'

  return (
    <div className="card" style={{
      marginBottom: 12,
      border: added ? '1px solid var(--accent)' : '1px solid var(--border)',
      transition: 'border-color .3s',
      overflow: 'hidden',
    }}>
      {/* Hero image */}
      {recipe.image_url && (
        <div
          onClick={() => setExpanded(e => !e)}
          style={{ position: 'relative', cursor: 'pointer', aspectRatio: '3/2', overflow: 'hidden' }}
        >
          <img
            src={recipe.image_url}
            alt={recipe.name}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          {/* Gradient overlay at bottom */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 90,
            background: 'linear-gradient(to top, rgba(6,6,8,.92), transparent)',
            pointerEvents: 'none',
          }} />
          {/* Recipe name */}
          <div style={{
            position: 'absolute', bottom: 10, left: 14, right: 50,
            fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: 0.5,
            color: '#fff', lineHeight: 1.2, textShadow: '0 1px 6px rgba(0,0,0,.8)',
          }}>
            {recipe.name}
          </div>
          {/* Kcal badge */}
          {recipe.kcal && (
            <div style={{
              position: 'absolute', top: 10, right: 10,
              background: 'rgba(0,200,150,.9)', backdropFilter: 'blur(4px)',
              borderRadius: 10, padding: '3px 10px',
              fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--ink)',
              letterSpacing: 0.5,
            }}>
              {recipe.kcal} kcal
            </div>
          )}
          {/* Category badge */}
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(6,6,8,.72)', backdropFilter: 'blur(4px)',
            borderRadius: 10, padding: '3px 10px',
            fontSize: 11, color: 'rgba(255,255,255,.85)',
          }}>
            {catIcon} {recipe.category}
          </div>
          {/* Expand chevron */}
          <div style={{
            position: 'absolute', bottom: 12, right: 14,
            fontSize: 13, color: 'rgba(255,255,255,.8)',
          }}>
            {expanded ? '▲' : '▼'}
          </div>
        </div>
      )}

      {/* Header row — shown when no image */}
      {!recipe.image_url && (
      <div
        onClick={() => setExpanded(e => !e)}
        style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', padding: '14px 16px 12px' }}
      >
        <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{catIcon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 0.5,
            color: 'var(--white)', lineHeight: 1.3,
          }}>
            {recipe.name}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
            {(recipe.tags || []).slice(0, 3).map(tag => (
              <span key={tag} style={{
                fontSize: 9, fontFamily: 'var(--font-display)', letterSpacing: 0.5,
                padding: '2px 6px', borderRadius: 10,
                background: `${tagColors[tag] || 'var(--muted)'}20`,
                color: tagColors[tag] || 'var(--muted)',
                border: `1px solid ${tagColors[tag] || 'var(--muted)'}40`,
              }}>
                {tag.replace('-', ' ').toUpperCase()}
              </span>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          {recipe.kcal && (
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--accent)', letterSpacing: 0.5,
            }}>
              {recipe.kcal}
              <span style={{ fontSize: 9, color: 'var(--muted)', marginLeft: 2 }}>kcal</span>
            </div>
          )}
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            {expanded ? '▲' : '▼'}
          </div>
        </div>
      </div>
      )}

      {/* Tags row — shown when image present */}
      {recipe.image_url && (recipe.tags || []).length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '10px 14px 4px' }}>
          {(recipe.tags || []).slice(0, 4).map(tag => (
            <span key={tag} style={{
              fontSize: 9, fontFamily: 'var(--font-display)', letterSpacing: 0.5,
              padding: '2px 6px', borderRadius: 10,
              background: `${tagColors[tag] || 'var(--muted)'}20`,
              color: tagColors[tag] || 'var(--muted)',
              border: `1px solid ${tagColors[tag] || 'var(--muted)'}40`,
            }}>
              {tag.replace(/-/g, ' ').toUpperCase()}
            </span>
          ))}
        </div>
      )}

      {/* Macros bar */}
      {(recipe.protein_g || recipe.carbs_g || recipe.fat_g) && (
        <div style={{ display: 'flex', gap: 6, padding: '0 16px 10px', flexWrap: 'wrap' }}>
          <MacroPill label="PROTEIN" value={recipe.protein_g ? `${recipe.protein_g}g` : null} color="var(--accent)" />
          <MacroPill label="CARBS"   value={recipe.carbs_g   ? `${recipe.carbs_g}g`   : null} color="var(--info)" />
          <MacroPill label="FAT"     value={recipe.fat_g     ? `${recipe.fat_g}g`     : null} color="var(--warn)" />
          {recipe.servings > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              <span style={{ fontSize: 10, color: 'var(--muted)' }}>serves {recipe.servings}</span>
            </div>
          )}
        </div>
      )}

      {/* Expanded: ingredients + method */}
      {expanded && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '14px 16px' }}>
          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1.5,
                color: 'var(--muted)', marginBottom: 8,
              }}>
                INGREDIENTS
              </div>
              <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7 }}>{ing}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Method */}
          {recipe.method && (
            <div style={{ marginBottom: 14 }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1.5,
                color: 'var(--muted)', marginBottom: 8,
              }}>
                METHOD
              </div>
              <p style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7, margin: 0 }}>
                {recipe.method}
              </p>
            </div>
          )}

          {/* Source badge */}
          {recipe.source && (
            <div style={{ fontSize: 10, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 10 }}>
              From: {recipe.source}
            </div>
          )}

          {/* Add to day / meal type selector */}
          {!addOpen ? (
            <button
              className={`btn ${added ? 'btn-primary' : 'btn-ghost'}`}
              style={{ width: '100%' }}
              onClick={() => setAddOpen(true)}
            >
              {added ? '✓ ADDED TO TODAY' : '+ ADD TO MY DAY'}
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <select
                className="select input-sm"
                value={mealType}
                onChange={e => setMealType(e.target.value)}
              >
                {MEAL_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleAdd}
                  disabled={adding}
                >
                  {adding ? '…' : 'LOG IT'}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => setAddOpen(false)}
                  style={{ flex: 1 }}
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function RecipeLibrary({ date = TODAY }) {
  const { user } = useAuth()
  const [category,  setCategory]  = useState('all')
  const [search,    setSearch]    = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [recipes,   setRecipes]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [toast,     setToast]     = useState(null)

  const loadRecipes = useCallback(async () => {
    setLoading(true)
    const { data } = await getRecipes({
      category,
      search: search.length >= 2 ? search : undefined,
      tags: activeTag ? [activeTag] : undefined,
    })
    setRecipes(data || [])
    setLoading(false)
  }, [category, search, activeTag])

  useEffect(() => {
    const t = setTimeout(loadRecipes, search ? 300 : 0)
    return () => clearTimeout(t)
  }, [loadRecipes, search])

  async function handleAddToDay(recipe, mealType) {
    if (!user) return
    const { error } = await addRecipeToNutritionLog({
      clientId: user.id,
      date,
      mealType: mealType.toLowerCase(),
      recipe,
    })
    if (!error) {
      setToast(`${recipe.name} added to ${mealType}`)
      setTimeout(() => setToast(null), 3000)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--accent)', color: 'var(--ink)',
          padding: '10px 20px', borderRadius: 20, fontSize: 13,
          fontFamily: 'var(--font-display)', letterSpacing: 0.5,
          zIndex: 999, boxShadow: '0 4px 20px rgba(0,200,150,.4)',
          whiteSpace: 'nowrap',
        }}>
          ✓ {toast}
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: 12 }}>
        <input
          className="input"
          placeholder="Search recipes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              borderRadius: 20,
              border: `1.5px solid ${category === cat.value ? 'var(--accent)' : 'var(--border-hi)'}`,
              background: category === cat.value ? 'rgba(0,200,150,.12)' : 'var(--s2)',
              color: category === cat.value ? 'var(--accent)' : 'var(--sub)',
              fontSize: 12,
              fontFamily: 'var(--font-display)',
              letterSpacing: 0.5,
              cursor: 'pointer',
              transition: 'all .15s',
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Tag filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {TAG_FILTERS.map(tag => (
          <button
            key={tag.value}
            onClick={() => setActiveTag(activeTag === tag.value ? null : tag.value)}
            style={{
              flexShrink: 0,
              padding: '4px 10px',
              borderRadius: 12,
              border: `1px solid ${activeTag === tag.value ? 'var(--accent)' : 'var(--border)'}`,
              background: activeTag === tag.value ? 'rgba(0,200,150,.10)' : 'transparent',
              color: activeTag === tag.value ? 'var(--accent)' : 'var(--muted)',
              fontSize: 10,
              fontFamily: 'var(--font-display)',
              letterSpacing: 0.5,
              cursor: 'pointer',
            }}
          >
            {tag.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Count */}
      {!loading && (
        <div style={{
          fontSize: 11, color: 'var(--muted)', marginBottom: 12,
          fontFamily: 'var(--font-display)', letterSpacing: 0.5,
        }}>
          {recipes.length} RECIPE{recipes.length !== 1 ? 'S' : ''}
        </div>
      )}

      {/* Recipe list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)', fontSize: 13 }}>
          Loading recipes…
        </div>
      ) : recipes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🍽️</div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>No recipes found</div>
          {search && (
            <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => setSearch('')}>
              Clear search
            </button>
          )}
        </div>
      ) : (
        recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onAddToDay={handleAddToDay}
          />
        ))
      )}
    </div>
  )
}
