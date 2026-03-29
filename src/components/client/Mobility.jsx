import { useState, useMemo } from 'react'
import { MOBILITY_DATA } from '../../data/mobilityData.js'

// Extract YouTube video ID from any YouTube URL format
function ytId(url) {
  if (!url) return null
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

// ─── Level badge ──────────────────────────────────────────────────────────────
const LEVEL_COLORS = {
  Beginner:     { bg: '#3b82f620', border: '#3b82f640', text: '#3b82f6' },
  Intermediate: { bg: '#f59e0b20', border: '#f59e0b40', text: '#f59e0b' },
  Advanced:     { bg: '#00C89620', border: '#00C89640', text: '#00C896' },
}

const TARGET_COLORS = {
  Hips:       '#f59e0b',
  Shoulders:  '#8b5cf6',
  Spine:      '#3b82f6',
  'Full Body': '#00C896',
}

function LevelBadge({ level }) {
  const colors = LEVEL_COLORS[level] || LEVEL_COLORS.Beginner
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
      {level.toUpperCase()}
    </span>
  )
}

function TargetBadge({ target }) {
  const color = TARGET_COLORS[target] || 'var(--muted)'
  return (
    <span style={{
      fontFamily: 'var(--font-display)',
      fontSize: 9,
      letterSpacing: '0.08em',
      color,
      background: color + '20',
      border: `1px solid ${color}40`,
      borderRadius: 4,
      padding: '2px 8px',
    }}>
      {target.toUpperCase()}
    </span>
  )
}

// ─── Exercise row ─────────────────────────────────────────────────────────────
function ExerciseRow({ exercise, index }) {
  const [open, setOpen] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const videoId = ytId(exercise.videoUrl)
  const hasSearch = !videoId && !!exercise.videoSearch
  const searchUrl = hasSearch
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(exercise.videoSearch)}`
    : null

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
      {/* Row header */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          padding: '10px 14px',
          background: 'var(--s3)',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(o => !o)}
      >
        {/* Index */}
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: 'var(--accent-dim, var(--s4))',
          border: '1px solid var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--accent)', flexShrink: 0,
        }}>
          {index + 1}
        </div>

        {/* Main content — name, badge, meta stats stacked */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name row + video/tutorial pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--white)', fontWeight: 500 }}>
              {exercise.name}
            </div>
            {videoId && (
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: '0.06em',
                color: '#ef4444', background: 'rgba(239,68,68,.12)',
                border: '1px solid rgba(239,68,68,.3)', borderRadius: 3, padding: '1px 6px',
                flexShrink: 0,
              }}>
                ▶ VIDEO
              </span>
            )}
            {hasSearch && (
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: '0.06em',
                color: '#ef4444', background: 'rgba(239,68,68,.12)',
                border: '1px solid rgba(239,68,68,.3)', borderRadius: 3, padding: '1px 6px',
                flexShrink: 0,
              }}>
                ▶ TUTORIAL
              </span>
            )}
          </div>
          {/* Meta stats row — sits below name, never competes for space */}
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            {exercise.sets && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--white)' }}>{exercise.sets}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--muted)' }}>SETS</span>
              </div>
            )}
            {exercise.reps && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--white)' }}>{exercise.reps}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--muted)' }}>REPS</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--accent)' }}>{exercise.duration}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--muted)' }}>TIME</span>
            </div>
          </div>
        </div>

        {/* Toggle */}
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--muted)', flexShrink: 0 }}>
          {open ? '▲' : '▼'}
        </div>
      </div>

      {/* Expanded: cues + video */}
      {open && (
        <div style={{ background: 'var(--s2)', borderTop: '1px solid var(--border)' }}>
          {/* Coaching cues */}
          <div style={{ padding: '12px 14px 12px 48px' }}>
            <div className="label" style={{ marginBottom: 6, color: 'var(--accent)' }}>Coaching Cues</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.65 }}>
              {exercise.cues}
            </div>
          </div>

          {/* YouTube search link — shown when no direct embed but search query exists */}
          {hasSearch && (
            <div style={{ padding: '0 14px 14px 48px' }}>
              <a
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#ef444420', border: '1px solid rgba(239,68,68,.35)',
                  borderRadius: 8, padding: '10px 16px',
                  color: '#ef4444', textDecoration: 'none',
                  fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '1px',
                  transition: 'background .15s',
                  whiteSpace: 'nowrap',
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#ef4444">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z"/>
                </svg>
                Watch Tutorial on YouTube
              </a>
            </div>
          )}

          {/* Direct video embed */}
          {videoId && (
            <div style={{ padding: '0 14px 14px 48px' }}>
              {!videoPlaying ? (
                /* Thumbnail */
                <div
                  onClick={() => setVideoPlaying(true)}
                  style={{
                    position: 'relative', borderRadius: 8, overflow: 'hidden',
                    cursor: 'pointer', maxWidth: 480,
                    border: '1px solid var(--border)',
                  }}
                >
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                    alt={exercise.name}
                    style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
                  />
                  {/* Play button overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,.35)',
                    transition: 'background .2s',
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: '#ef4444',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(0,0,0,.5)',
                    }}>
                      <svg viewBox="0 0 16 16" width="20" height="20" fill="white">
                        <path d="M5 3l10 5-10 5V3z"/>
                      </svg>
                    </div>
                  </div>
                  <div style={{
                    position: 'absolute', bottom: 8, left: 8,
                    fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: '0.06em',
                    color: '#fff', background: 'rgba(0,0,0,.6)', borderRadius: 3, padding: '2px 7px',
                  }}>
                    WATCH TUTORIAL
                  </div>
                </div>
              ) : (
                /* Embedded player */
                <div style={{ position: 'relative', maxWidth: 480, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%' }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                      title={exercise.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                    />
                  </div>
                  <button
                    onClick={() => setVideoPlaying(false)}
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      background: 'rgba(0,0,0,.7)', border: 'none', borderRadius: 4,
                      color: '#fff', fontFamily: 'var(--font-display)', fontSize: 9,
                      letterSpacing: 1, padding: '4px 8px', cursor: 'pointer',
                    }}
                  >
                    ✕ CLOSE
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Mobility Card ────────────────────────────────────────────────────────────
function MobilityCard({ routine }) {
  const [expanded, setExpanded] = useState(false)
  const accentColor = TARGET_COLORS[routine.target] || '#00C896'

  return (
    <div
      className="card"
      style={{
        border: expanded ? `1px solid ${accentColor}60` : '1px solid var(--border)',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Card header — always visible */}
      <div
        style={{ cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              color: 'var(--white)',
              letterSpacing: '0.04em',
              marginBottom: 8,
            }}>
              {routine.name}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <TargetBadge target={routine.target} />
              <LevelBadge level={routine.level} />
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--muted)',
              }}>
                {routine.duration}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--muted)',
              }}>
                {routine.exercises.length} exercises
              </span>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--muted)', marginLeft: 12 }}>
            {expanded ? '▲' : '▼'}
          </div>
        </div>

        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--muted)',
          lineHeight: 1.5,
        }}>
          {routine.description}
        </div>
      </div>

      {/* Expanded exercise list */}
      {expanded && (
        <div style={{ marginTop: 20 }}>
          {/* Quick stats bar */}
          <div style={{
            display: 'flex',
            gap: 20,
            padding: '10px 14px',
            background: 'var(--s3)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            marginBottom: 16,
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: accentColor }}>
                {routine.exercises.length}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--muted)' }}>EXERCISES</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)' }}>
                {routine.duration}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--muted)' }}>DURATION</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)' }}>
                {routine.target}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--muted)' }}>TARGET</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)' }}>
                {routine.level}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--muted)' }}>LEVEL</div>
            </div>
          </div>

          {/* Exercises */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {routine.exercises.map((ex, i) => (
              <ExerciseRow key={i} exercise={ex} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TARGET_FILTERS = ['All', 'Hips', 'Shoulders', 'Spine', 'Full Body']
const LEVEL_FILTERS  = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']

export default function Mobility() {
  const [activeTarget, setActiveTarget] = useState('All')
  const [activeLevel,  setActiveLevel]  = useState('All Levels')

  const filtered = useMemo(() => {
    let list = MOBILITY_DATA
    if (activeTarget !== 'All') {
      list = list.filter(r => r.target === activeTarget)
    }
    if (activeLevel !== 'All Levels') {
      list = list.filter(r => r.level === activeLevel)
    }
    return list
  }, [activeTarget, activeLevel])

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Mobility Library</div>
          <div className="page-subtitle">Targeted mobility routines with full coaching cues</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Target Area</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TARGET_FILTERS.map(t => (
              <button
                key={t}
                className={`btn btn-sm ${activeTarget === t ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTarget(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="label" style={{ marginBottom: 6 }}>Level</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {LEVEL_FILTERS.map(l => (
              <button
                key={l}
                className={`btn btn-sm ${activeLevel === l ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveLevel(l)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div style={{ marginBottom: 16, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>
        {filtered.length} routine{filtered.length !== 1 ? 's' : ''}
        {activeTarget !== 'All' ? ` targeting ${activeTarget}` : ''}
        {activeLevel !== 'All Levels' ? ` · ${activeLevel}` : ''}
      </div>

      {/* Routine cards */}
      {filtered.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(r => (
            <MobilityCard key={r.id} routine={r} />
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
          No routines match the selected filters.
        </div>
      )}
    </div>
  )
}
