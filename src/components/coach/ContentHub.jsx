import { useState } from 'react'

// ============================================================
// COACH CONTENT HUB — Upload, manage, assign, phase-lock modules
// ============================================================

const CATEGORIES = ['Nutrition', 'Training', 'Recovery', 'Mindset', 'Programming']
const CONTENT_TYPES = ['Article', 'Video', 'PDF', 'Quiz']
const ASSIGN_OPTIONS = ['All Clients', 'Elite Plan', 'Standard Plan']

const MOCK_MODULES = [
  { id: '1', title: 'Progressive Overload Explained', category: 'Training', contentType: 'Article', unlockWeek: 0, assignedTo: 'All Clients', isPublished: true, completions: 8, total: 12 },
  { id: '2', title: 'Your Nutrition Foundations', category: 'Nutrition', contentType: 'Video', unlockWeek: 0, assignedTo: 'All Clients', isPublished: true, completions: 10, total: 12 },
  { id: '3', title: 'Macro Tracking Masterclass', category: 'Nutrition', contentType: 'PDF', unlockWeek: 2, assignedTo: 'Elite Plan', isPublished: true, completions: 4, total: 6 },
  { id: '4', title: 'Sleep & Recovery Protocol', category: 'Recovery', contentType: 'Article', unlockWeek: 0, assignedTo: 'All Clients', isPublished: true, completions: 6, total: 12 },
  { id: '5', title: 'Periodisation Quiz', category: 'Programming', contentType: 'Quiz', unlockWeek: 4, assignedTo: 'All Clients', isPublished: true, completions: 3, total: 12 },
  { id: '6', title: 'Advanced Hypertrophy Techniques', category: 'Training', contentType: 'Video', unlockWeek: 6, assignedTo: 'Elite Plan', isPublished: false, completions: 0, total: 6 },
  { id: '7', title: 'Mindset & Habit Architecture', category: 'Mindset', contentType: 'Article', unlockWeek: 0, assignedTo: 'All Clients', isPublished: true, completions: 5, total: 12 },
  { id: '8', title: 'RPE & RIR Training Guide', category: 'Training', contentType: 'PDF', unlockWeek: 1, assignedTo: 'All Clients', isPublished: true, completions: 7, total: 12 },
]

const QUIZ_TEMPLATES = [
  {
    id: 'nutrition_basics',
    title: 'Nutrition Basics Quiz',
    questions: [
      {
        question: 'What is the recommended daily protein intake for someone actively training?',
        options: [
          { text: '0.8g per kg body weight', hint: 'This is the minimum for sedentary people.' },
          { text: '1.6–2.4g per kg body weight', hint: 'Correct! This is the research-backed range for athletes.' },
          { text: '3.5–4g per kg body weight', hint: 'This is higher than necessary and provides no additional benefit.' },
          { text: '0.5g per kg body weight', hint: 'This would result in muscle loss over time.' },
        ],
        correctIndex: 1,
        explanation: 'The evidence consistently supports 1.6–2.4g/kg for people in hard training. Going higher (up to ~3.1g/kg) on a cut can help preserve muscle but provides diminishing returns above that.',
      },
      {
        question: 'Which macronutrient has the highest thermic effect (costs the most calories to digest)?',
        options: [
          { text: 'Carbohydrates (5–10%)', hint: 'Close but not the highest.' },
          { text: 'Fats (0–3%)', hint: 'Fat has the lowest thermic effect.' },
          { text: 'Protein (20–30%)', hint: 'Correct! Your body burns ~25–30% of protein calories just digesting it.' },
          { text: 'Alcohol (15–20%)', hint: 'Alcohol does have a moderate thermic effect but less than protein.' },
        ],
        correctIndex: 2,
        explanation: 'Protein\'s high thermic effect is one reason high-protein diets are so effective — you\'re burning more calories just by eating more protein, even before any other effects.',
      },
    ],
  },
]

// ── Helper components ──────────────────────────────────────

const typeColors = {
  Article: { bg: 'rgba(0,200,150,.12)', border: 'rgba(0,200,150,.3)', text: 'var(--accent)' },
  Video: { bg: 'rgba(167,139,250,.12)', border: 'rgba(167,139,250,.3)', text: '#a78bfa' },
  PDF: { bg: 'rgba(255,173,0,.12)', border: 'rgba(255,173,0,.3)', text: 'var(--warn)' },
  Quiz: { bg: 'rgba(96,165,250,.12)', border: 'rgba(96,165,250,.3)', text: '#60a5fa' },
}

const catColors = {
  Nutrition: 'var(--accent)', Training: '#a78bfa', Recovery: '#60a5fa', Mindset: 'var(--warn)', Programming: 'var(--danger)',
}

function TypeBadge({ type }) {
  const c = typeColors[type] || typeColors.Article
  return (
    <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5, color: c.text, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 3, padding: '2px 7px' }}>
      {type}
    </span>
  )
}

function CompletionBar({ completions, total }) {
  const pct = total > 0 ? Math.round((completions / total) * 100) : 0
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: 'var(--muted)' }}>Completions</span>
        <span style={{ fontSize: 10, color: 'var(--sub)' }}>{completions}/{total} ({pct}%)</span>
      </div>
      <div style={{ height: 3, background: 'var(--s5)', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? 'var(--accent)' : pct >= 50 ? 'var(--warn)' : 'var(--danger)', borderRadius: 2 }} />
      </div>
    </div>
  )
}

// ── Module Card ────────────────────────────────────────────

function ModuleCard({ module, onEdit, onTogglePublish }) {
  return (
    <div className="card" style={{ borderLeft: `3px solid ${module.isPublished ? catColors[module.category] || 'var(--accent)' : 'var(--s5)'}`, opacity: module.isPublished ? 1 : 0.6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <TypeBadge type={module.contentType} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5, color: catColors[module.category] || 'var(--muted)', background: `${catColors[module.category] || 'var(--muted)'}18`, border: `1px solid ${catColors[module.category] || 'var(--muted)'}33`, borderRadius: 3, padding: '2px 7px' }}>
            {module.category}
          </span>
          {module.unlockWeek > 0 && (
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1, color: 'var(--muted)', background: 'var(--s5)', border: '1px solid var(--border)', borderRadius: 3, padding: '2px 7px' }}>
              🔒 Week {module.unlockWeek}+
            </span>
          )}
        </div>
        <span style={{ fontSize: 10, color: module.isPublished ? 'var(--accent)' : 'var(--muted)' }}>
          {module.isPublished ? '● Live' : '○ Draft'}
        </span>
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 1, color: 'var(--white)', marginBottom: 6 }}>
        {module.title}
      </div>

      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 12 }}>
        Assigned to: {module.assignedTo}
      </div>

      <CompletionBar completions={module.completions} total={module.total} />

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => onEdit(module)}>Edit</button>
        <button
          className="btn btn-sm"
          style={{ flex: 1, background: module.isPublished ? 'rgba(255,59,59,.15)' : 'var(--accent-dim)', color: module.isPublished ? 'var(--danger)' : 'var(--accent)', border: `1px solid ${module.isPublished ? 'rgba(255,59,59,.3)' : 'rgba(0,200,150,.3)'}` }}
          onClick={() => onTogglePublish(module.id)}
        >
          {module.isPublished ? 'Unpublish' : 'Publish'}
        </button>
      </div>
    </div>
  )
}

// ── Module Editor / Uploader ───────────────────────────────

function ModuleEditor({ module, onSave, onCancel }) {
  const [form, setForm] = useState(module || {
    title: '', category: 'Training', contentType: 'Article', unlockWeek: 0,
    assignedTo: 'All Clients', isPublished: false, contentUrl: '', articleBody: '',
  })
  const [quizQuestions, setQuizQuestions] = useState([])
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const addQuestion = () => setQuizQuestions(p => [...p, {
    id: Date.now(), question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '',
  }])

  return (
    <div className="card" style={{ maxWidth: 680 }}>
      <div className="card-title" style={{ marginBottom: 20, fontSize: 13, letterSpacing: 1.5 }}>
        {module ? 'Edit Module' : 'New Module'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="input-group">
          <label className="form-label">Title</label>
          <input className="input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Module title…" />
        </div>

        <div className="grid-2">
          <div className="input-group">
            <label className="form-label">Category</label>
            <select className="select" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label className="form-label">Content Type</label>
            <select className="select" value={form.contentType} onChange={e => set('contentType', e.target.value)}>
              {CONTENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div className="input-group">
            <label className="form-label">Unlock at Week</label>
            <input className="input input-sm" type="number" min={0} value={form.unlockWeek} onChange={e => set('unlockWeek', parseInt(e.target.value) || 0)} />
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>0 = always visible</div>
          </div>
          <div className="input-group">
            <label className="form-label">Assign To</label>
            <select className="select" value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
              {ASSIGN_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {(form.contentType === 'Video' || form.contentType === 'PDF') && (
          <div className="input-group">
            <label className="form-label">{form.contentType === 'Video' ? 'Video URL (YouTube / Vimeo)' : 'PDF File'}</label>
            {form.contentType === 'PDF' ? (
              <div style={{ padding: '16px', background: 'var(--s4)', border: '1px dashed var(--border-hi)', borderRadius: 6, textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Drop PDF here or</div>
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 6 }}>Browse Files</button>
              </div>
            ) : (
              <input className="input" value={form.contentUrl} onChange={e => set('contentUrl', e.target.value)} placeholder="https://youtu.be/…" />
            )}
          </div>
        )}

        {form.contentType === 'Article' && (
          <div className="input-group">
            <label className="form-label">Article Body</label>
            <textarea
              className="textarea"
              rows={8}
              value={form.articleBody}
              onChange={e => set('articleBody', e.target.value)}
              placeholder="Write article content here. Use **bold** for emphasis, - for bullet points."
            />
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>Supports **bold** and - bullet points</div>
          </div>
        )}

        {form.contentType === 'Quiz' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="label">Quiz Questions</div>
              <button className="btn btn-ghost btn-sm" onClick={addQuestion}>+ Add Question</button>
            </div>
            {quizQuestions.map((q, qi) => (
              <div key={q.id} className="card" style={{ marginBottom: 10, background: 'var(--s4)' }}>
                <div style={{ marginBottom: 8, fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1, color: 'var(--muted)' }}>Question {qi + 1}</div>
                <div className="input-group">
                  <input className="input input-sm" value={q.question} onChange={e => setQuizQuestions(p => p.map((x, i) => i === qi ? { ...x, question: e.target.value } : x))} placeholder="Question text…" />
                </div>
                {[0, 1, 2, 3].map(oi => (
                  <div key={oi} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                    <button
                      style={{ width: 24, height: 24, borderRadius: '50%', border: `1.5px solid ${q.correctIndex === oi ? 'var(--accent)' : 'var(--border-hi)'}`, background: q.correctIndex === oi ? 'var(--accent-dim)' : 'var(--s5)', cursor: 'pointer', flexShrink: 0 }}
                      onClick={() => setQuizQuestions(p => p.map((x, i) => i === qi ? { ...x, correctIndex: oi } : x))}
                    />
                    <input className="input input-sm" style={{ flex: 1 }} value={q.options[oi]} onChange={e => {
                      const opts = [...q.options]; opts[oi] = e.target.value
                      setQuizQuestions(p => p.map((x, i) => i === qi ? { ...x, options: opts } : x))
                    }} placeholder={`Option ${oi + 1}`} />
                  </div>
                ))}
                <div className="input-group" style={{ marginTop: 8 }}>
                  <label className="form-label">Explanation (shown after answer)</label>
                  <input className="input input-sm" value={q.explanation} onChange={e => setQuizQuestions(p => p.map((x, i) => i === qi ? { ...x, explanation: e.target.value } : x))} placeholder="Why is this the correct answer?" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, paddingTop: 8 }}>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onSave({ ...form, id: module?.id || String(Date.now()) })}>
            {module ? 'Save Changes' : 'Create Module'}
          </button>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ── Stats bar ──────────────────────────────────────────────

function StatsBar({ modules }) {
  const published = modules.filter(m => m.isPublished).length
  const totalCompletions = modules.reduce((s, m) => s + m.completions, 0)
  const totalPossible = modules.reduce((s, m) => s + m.total, 0)
  const avgCompletion = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0

  return (
    <div className="stats-grid" style={{ marginBottom: 24 }}>
      <div className="stat-card" style={{ borderLeft: '3px solid var(--accent)' }}>
        <div className="stat-value">{modules.length}</div>
        <div className="stat-label">Total Modules</div>
      </div>
      <div className="stat-card" style={{ borderLeft: '3px solid var(--accent)' }}>
        <div className="stat-value">{published}</div>
        <div className="stat-label">Published</div>
      </div>
      <div className="stat-card" style={{ borderLeft: '3px solid var(--warn)' }}>
        <div className="stat-value">{avgCompletion}%</div>
        <div className="stat-label">Avg Completion</div>
      </div>
      <div className="stat-card" style={{ borderLeft: '3px solid var(--accent)' }}>
        <div className="stat-value">{totalCompletions}</div>
        <div className="stat-label">Total Completions</div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────

export default function ContentHub() {
  const [modules, setModules] = useState(MOCK_MODULES)
  const [editingModule, setEditingModule] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [filterCat, setFilterCat] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  const togglePublish = id => setModules(p => p.map(m => m.id === id ? { ...m, isPublished: !m.isPublished } : m))

  const handleSave = mod => {
    if (mod.id && modules.find(m => m.id === mod.id)) {
      setModules(p => p.map(m => m.id === mod.id ? { ...mod, completions: m.completions, total: m.total } : m))
    } else {
      setModules(p => [...p, { ...mod, completions: 0, total: 0 }])
    }
    setEditingModule(null)
    setIsCreating(false)
  }

  const filtered = modules.filter(m => {
    if (filterCat !== 'All' && m.category !== filterCat) return false
    if (filterType !== 'All' && m.contentType !== filterType) return false
    if (filterStatus === 'Published' && !m.isPublished) return false
    if (filterStatus === 'Draft' && m.isPublished) return false
    return true
  })

  if (isCreating || editingModule) {
    return (
      <div>
        <div className="page-header">
          <div className="page-title">Content Hub</div>
        </div>
        <ModuleEditor module={editingModule} onSave={handleSave} onCancel={() => { setEditingModule(null); setIsCreating(false) }} />
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Content Hub</div>
          <div className="page-subtitle">Manage education modules — articles, videos, PDFs & quizzes</div>
        </div>
        <button className="btn btn-primary" onClick={() => setIsCreating(true)}>+ New Module</button>
      </div>

      <StatsBar modules={modules} />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {['All', ...CATEGORIES].map(c => (
            <button key={c} className={`btn btn-sm ${filterCat === c ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilterCat(c)}>{c}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
          {['All', ...CONTENT_TYPES].map(t => (
            <button key={t} className={`btn btn-sm ${filterType === t ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilterType(t)}>{t}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['All', 'Published', 'Draft'].map(s => (
            <button key={s} className={`btn btn-sm ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilterStatus(s)}>{s}</button>
          ))}
        </div>
      </div>

      {/* Module grid */}
      {filtered.length > 0 ? (
        <div className="grid-3" style={{ alignItems: 'start' }}>
          {filtered.map(m => (
            <ModuleCard key={m.id} module={m} onEdit={setEditingModule} onTogglePublish={togglePublish} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <div className="empty-state-text">No modules match your filters</div>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setIsCreating(true)}>Create First Module</button>
        </div>
      )}
    </div>
  )
}
