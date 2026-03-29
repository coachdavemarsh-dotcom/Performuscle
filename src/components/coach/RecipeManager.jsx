import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { getRecipes, upsertRecipe, deleteRecipe } from '../../lib/supabase.js'

const CATEGORIES = ['breakfast', 'lunch', 'dinner', 'snack']
const ALL_TAGS = ['high-protein','low-carb','quick','meal-prep','gluten-free','dairy-free','vegetarian','contains-nuts']

const EMPTY_RECIPE = {
  name: '', category: 'dinner', tags: [],
  kcal: '', protein_g: '', carbs_g: '', fat_g: '',
  servings: 1, ingredients: [], method: '', is_public: true,
}

function RecipeForm({ initial = EMPTY_RECIPE, onSave, onCancel }) {
  const [form, setForm] = useState({
    ...EMPTY_RECIPE,
    ...initial,
    tags: initial.tags || [],
    kcal: initial.kcal ?? '',
    protein_g: initial.protein_g ?? '',
    carbs_g: initial.carbs_g ?? '',
    fat_g: initial.fat_g ?? '',
    ingredients: Array.isArray(initial.ingredients) ? initial.ingredients.join('\n') : '',
  })
  const [saving, setSaving] = useState(false)

  function setField(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function toggleTag(tag) {
    setForm(f => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    const payload = {
      ...initial,
      name: form.name.trim(),
      category: form.category,
      tags: form.tags,
      kcal: form.kcal ? parseInt(form.kcal) : null,
      protein_g: form.protein_g ? parseFloat(form.protein_g) : null,
      carbs_g: form.carbs_g ? parseFloat(form.carbs_g) : null,
      fat_g: form.fat_g ? parseFloat(form.fat_g) : null,
      servings: form.servings || 1,
      ingredients: form.ingredients.split('\n').map(l => l.trim()).filter(Boolean),
      method: form.method.trim(),
      is_public: form.is_public,
    }
    await onSave(payload)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="input-group">
        <label className="form-label">Recipe Name *</label>
        <input className="input" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. Grilled Salmon with Zoodles" required />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="input-group">
          <label className="form-label">Category</label>
          <select className="select" value={form.category} onChange={e => setField('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </div>
        <div className="input-group">
          <label className="form-label">Servings</label>
          <input className="input" type="number" min="1" value={form.servings} onChange={e => setField('servings', parseInt(e.target.value))} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {[
          { key: 'kcal', label: 'Kcal' },
          { key: 'protein_g', label: 'Protein (g)' },
          { key: 'carbs_g', label: 'Carbs (g)' },
          { key: 'fat_g', label: 'Fat (g)' },
        ].map(f => (
          <div key={f.key} className="input-group">
            <label className="form-label">{f.label}</label>
            <input className="input input-sm" type="number" min="0" step="0.1" value={form[f.key]} onChange={e => setField(f.key, e.target.value)} />
          </div>
        ))}
      </div>

      <div className="input-group">
        <label className="form-label">Tags</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              style={{
                padding: '4px 10px', borderRadius: 12, fontSize: 11,
                fontFamily: 'var(--font-display)', letterSpacing: 0.5,
                border: `1px solid ${form.tags.includes(tag) ? 'var(--accent)' : 'var(--border-hi)'}`,
                background: form.tags.includes(tag) ? 'rgba(0,200,150,.12)' : 'var(--s3)',
                color: form.tags.includes(tag) ? 'var(--accent)' : 'var(--sub)',
                cursor: 'pointer',
              }}
            >
              {tag.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="input-group">
        <label className="form-label">Ingredients (one per line)</label>
        <textarea
          className="input"
          rows={6}
          value={form.ingredients}
          onChange={e => setField('ingredients', e.target.value)}
          placeholder={'200g chicken breast, diced\n1 tbsp olive oil\n2 cloves garlic, minced\n...'}
          style={{ resize: 'vertical', lineHeight: 1.6 }}
        />
      </div>

      <div className="input-group">
        <label className="form-label">Method</label>
        <textarea
          className="input"
          rows={5}
          value={form.method}
          onChange={e => setField('method', e.target.value)}
          placeholder="Step-by-step cooking instructions…"
          style={{ resize: 'vertical', lineHeight: 1.6 }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <input
          type="checkbox" id="is_public"
          checked={form.is_public}
          onChange={e => setField('is_public', e.target.checked)}
        />
        <label htmlFor="is_public" style={{ fontSize: 13, color: 'var(--sub)' }}>
          Visible to all clients
        </label>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-primary" type="submit" disabled={saving} style={{ flex: 1 }}>
          {saving ? '…' : initial.id ? 'SAVE CHANGES' : 'ADD RECIPE'}
        </button>
        <button className="btn btn-ghost" type="button" onClick={onCancel} style={{ flex: 1 }}>
          CANCEL
        </button>
      </div>
    </form>
  )
}

export default function RecipeManager() {
  const { user } = useAuth()
  const [recipes, setRecipes]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [category, setCategory]   = useState('all')
  const [search, setSearch]       = useState('')
  const [editing, setEditing]     = useState(null)   // null = list, {} = new, recipe = edit
  const [toast, setToast]         = useState(null)

  useEffect(() => { loadRecipes() }, [category, search])

  async function loadRecipes() {
    setLoading(true)
    const { data } = await getRecipes({
      category,
      search: search.length >= 2 ? search : undefined,
    })
    setRecipes(data || [])
    setLoading(false)
  }

  async function handleSave(payload) {
    const { error } = await upsertRecipe({ ...payload, created_by: user.id })
    if (!error) {
      setEditing(null)
      setToast(payload.id ? 'Recipe updated' : 'Recipe added')
      setTimeout(() => setToast(null), 3000)
      loadRecipes()
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    const { error } = await deleteRecipe(id)
    if (!error) {
      setToast('Recipe deleted')
      setTimeout(() => setToast(null), 2000)
      loadRecipes()
    }
  }

  if (editing !== null) {
    return (
      <div>
        <div className="page-header">
          <div className="page-title">{editing.id ? 'Edit Recipe' : 'New Recipe'}</div>
          <div className="page-subtitle">Fill in the details below</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <RecipeForm
            initial={editing.id ? editing : EMPTY_RECIPE}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      {toast && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--accent)', color: 'var(--ink)',
          padding: '10px 20px', borderRadius: 20, fontSize: 13,
          fontFamily: 'var(--font-display)', letterSpacing: 0.5, zIndex: 999,
          boxShadow: '0 4px 20px rgba(0,200,150,.4)',
        }}>
          ✓ {toast}
        </div>
      )}

      <div className="page-header flex-between">
        <div>
          <div className="page-title">Recipe Library</div>
          <div className="page-subtitle">{recipes.length} recipes</div>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>
          + ADD RECIPE
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {['all', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            className={`btn ${category === cat ? 'btn-primary' : 'btn-ghost'} btn-sm`}
            onClick={() => setCategory(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <input
          className="input"
          placeholder="Search recipes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-overlay"><div className="spinner" /></div>
      ) : (
        <div>
          {recipes.map(recipe => (
            <div key={recipe.id} className="card" style={{ marginBottom: 10, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--white)', letterSpacing: 0.5 }}>
                    {recipe.name}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 10, fontFamily: 'var(--font-display)',
                      padding: '2px 8px', borderRadius: 10,
                      background: 'rgba(0,200,150,.12)', color: 'var(--accent)',
                      border: '1px solid rgba(0,200,150,.25)',
                    }}>
                      {recipe.category.toUpperCase()}
                    </span>
                    {recipe.kcal && (
                      <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                        {recipe.kcal} kcal · P{recipe.protein_g}g · C{recipe.carbs_g}g · F{recipe.fat_g}g
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEditing(recipe)}
                  >
                    EDIT
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ background: 'rgba(229,53,53,.1)', color: 'var(--danger)', border: '1px solid rgba(229,53,53,.25)' }}
                    onClick={() => handleDelete(recipe.id, recipe.name)}
                  >
                    DEL
                  </button>
                </div>
              </div>
            </div>
          ))}

          {recipes.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🍽️</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>No recipes found</div>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setEditing({})}>
                Add your first recipe
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
