import { useState, useMemo } from 'react'
import { SUPPLEMENT_DATA } from '../../data/supplementData.js'

// ─── Star Rating ──────────────────────────────────────────────────────────────
function EvidenceStars({ count }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <div
          key={n}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: n <= count ? 'var(--accent)' : 'var(--s4)',
            border: `1px solid ${n <= count ? 'var(--accent)' : 'var(--border)'}`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Category Badge ───────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  Foundation:  { bg: '#3b82f620', border: '#3b82f640', text: '#3b82f6' },
  Performance: { bg: '#f59e0b20', border: '#f59e0b40', text: '#f59e0b' },
  Recovery:    { bg: '#00C89620', border: '#00C89640', text: '#00C896' },
  Health:      { bg: '#8b5cf620', border: '#8b5cf640', text: '#8b5cf6' },
  Peptides:    { bg: '#ef444420', border: '#ef444440', text: '#ef4444' },
}

function CategoryBadge({ category }) {
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Foundation
  return (
    <span style={{
      fontFamily: 'var(--font-display)',
      fontSize: 9,
      letterSpacing: '0.08em',
      color: colors.text,
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      borderRadius: 4,
      padding: '2px 8px',
    }}>
      {category.toUpperCase()}
    </span>
  )
}

// ─── Supplement Card ──────────────────────────────────────────────────────────
function SupplementCard({ supplement }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="card"
      style={{
        cursor: 'pointer',
        border: expanded ? '1px solid var(--accent)' : '1px solid var(--border)',
        transition: 'border-color 0.2s',
      }}
      onClick={() => setExpanded(e => !e)}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            color: 'var(--white)',
            letterSpacing: '0.04em',
            marginBottom: 6,
          }}>
            {supplement.name}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <CategoryBadge category={supplement.category} />
            <EvidenceStars count={supplement.evidence} />
          </div>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 16,
          color: 'var(--muted)',
          marginLeft: 12,
          flexShrink: 0,
        }}>
          {expanded ? '▲' : '▼'}
        </div>
      </div>

      {/* Primary benefit */}
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        color: 'var(--accent)',
        fontWeight: 600,
        marginBottom: 8,
      }}>
        {supplement.primaryBenefit}
      </div>

      {/* Dosing preview */}
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: 11,
        color: 'var(--muted)',
        padding: '6px 10px',
        background: 'var(--s4)',
        borderRadius: 6,
        marginBottom: expanded ? 12 : 0,
      }}>
        <span style={{ color: 'var(--white)', fontWeight: 600 }}>Dose: </span>
        {supplement.dosing}
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ marginTop: 4 }}>
          {/* Description */}
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--white)',
            lineHeight: 1.6,
            marginBottom: 12,
          }}>
            {supplement.description}
          </div>

          {/* Timing */}
          <div style={{ marginBottom: 10 }}>
            <div className="label" style={{ marginBottom: 4 }}>Timing</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>
              {supplement.timing}
            </div>
          </div>

          {/* Notes */}
          <div style={{
            padding: '10px 12px',
            background: 'var(--s4)',
            borderRadius: 8,
            borderLeft: '3px solid var(--accent)',
            marginBottom: 12,
          }}>
            <div className="label" style={{ marginBottom: 4, color: 'var(--accent)' }}>Coach Notes</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
              {supplement.notes}
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {supplement.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                color: 'var(--muted)',
                background: 'var(--s4)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: '2px 8px',
              }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Foundation', 'Performance', 'Recovery', 'Health', 'Peptides']

export default function Supplements() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = SUPPLEMENT_DATA
    if (activeCategory !== 'All') {
      list = list.filter(s => s.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.primaryBenefit.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [activeCategory, search])

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Supplements</div>
          <div className="page-subtitle">Evidence-based supplement guide — dosing, timing & research quality</div>
        </div>
        <input
          type="search"
          className="input"
          placeholder="Search supplements..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 220 }}
        />
      </div>

      {/* Peptides disclaimer */}
      {(activeCategory === 'Peptides' || (activeCategory === 'All' && filtered.some(s => s.category === 'Peptides'))) && (
        <div className="alert alert-danger" style={{ marginBottom: 20 }}>
          Peptide entries are included for educational awareness only. These are research compounds not approved for human use by any regulatory body. This information does not constitute medical advice.
        </div>
      )}

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`btn btn-sm ${activeCategory === cat ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
            {cat !== 'All' && (
              <span style={{ marginLeft: 6, opacity: 0.6 }}>
                {SUPPLEMENT_DATA.filter(s => s.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Evidence legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
        padding: '8px 14px',
        background: 'var(--s3)',
        border: '1px solid var(--border)',
        borderRadius: 8,
      }}>
        <span className="label" style={{ flexShrink: 0 }}>Evidence Strength:</span>
        {[
          { dots: 1, label: 'Weak' },
          { dots: 2, label: 'Limited' },
          { dots: 3, label: 'Moderate' },
          { dots: 4, label: 'Strong' },
          { dots: 5, label: 'Exceptional' },
        ].map(e => (
          <div key={e.dots} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <EvidenceStars count={e.dots} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--muted)' }}>{e.label}</span>
          </div>
        ))}
      </div>

      {/* Results count */}
      <div style={{ marginBottom: 16, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>
        {filtered.length} supplement{filtered.length !== 1 ? 's' : ''}
        {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
        {search ? ` matching "${search}"` : ''}
      </div>

      {/* Supplement grid */}
      {filtered.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 16,
        }}>
          {filtered.map(s => (
            <SupplementCard key={s.id} supplement={s} />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--muted)',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
        }}>
          No supplements found{search ? ` for "${search}"` : ''}.
        </div>
      )}
    </div>
  )
}
