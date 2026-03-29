import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCoach } from '../../hooks/useCoach.js'
import { replyToCheckIn } from '../../lib/supabase.js'
import { notifyClientReply } from '../../lib/emailApi.js'

const PHOTO_POSITIONS = ['front', 'back', 'left', 'right', 'flexed']

// ─── Biofeedback metric definitions (same keys as check-ins) ──────────────
const BIO_METRICS = [
  { key: 'training_score',         label: 'Training',         group: 'ADHERENCE',   inverted: false },
  { key: 'nutrition_score',        label: 'Nutrition',        group: 'ADHERENCE',   inverted: false },
  { key: 'step_score',             label: 'Steps',            group: 'ADHERENCE',   inverted: false },
  { key: 'supplementation_score',  label: 'Supps',            group: 'ADHERENCE',   inverted: false },
  { key: 'sleep_score',            label: 'Sleep',            group: 'RECOVERY',    inverted: false },
  { key: 'digestion_score',        label: 'Digestion',        group: 'RECOVERY',    inverted: false },
  { key: 'physical_stress_score',  label: 'Phys. Stress',     group: 'RECOVERY',    inverted: true  },
  { key: 'emotional_stress_score', label: 'Emo. Stress',      group: 'RECOVERY',    inverted: true  },
  { key: 'strength_score',         label: 'Strength',         group: 'PERFORMANCE', inverted: false },
  { key: 'confidence_score',       label: 'Confidence',       group: 'PERFORMANCE', inverted: false },
  { key: 'recovery_score',         label: 'Recovery',         group: 'PERFORMANCE', inverted: false },
]

// ─── Helpers ──────────────────────────────────────────────────────────────
function bioScoreColor(score) {
  if (score === null || score === undefined) return 'var(--muted)'
  if (score >= 80) return 'var(--accent)'
  if (score >= 60) return 'var(--warn)'
  return 'var(--danger)'
}

function metricEffective(metric, value) {
  if (value === null || value === undefined) return null
  return metric.inverted ? 10 - value : value
}

function metricEffColor(eff) {
  if (eff === null || eff === undefined) return 'var(--muted)'
  if (eff >= 7) return 'var(--accent)'
  if (eff >= 4) return 'var(--warn)'
  return 'var(--danger)'
}

// ─── ScoreBadge (legacy 1-5 scale, also handles 0-10) ────────────────────
function ScoreBadge({ value }) {
  let color
  if (value > 5) {
    // 0-10 scale
    color = value >= 7 ? 'var(--accent)' : value <= 4 ? 'var(--danger)' : 'var(--warn)'
  } else {
    // 1-5 scale (backward compat)
    color = value >= 4 ? 'var(--accent)' : value <= 2 ? 'var(--danger)' : 'var(--warn)'
  }
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
      height: 28,
      borderRadius: 4,
      background: `${color}22`,
      border: `1px solid ${color}44`,
      fontFamily: 'var(--font-display)',
      fontSize: 13,
      color,
    }}>
      {value}
    </div>
  )
}

// ─── Biofeedback mini breakdown (for expanded view) ───────────────────────
function BioBreakdown({ checkIn }) {
  const hasAny = BIO_METRICS.some(m => {
    const v = checkIn[m.key]
    return v !== null && v !== undefined
  })
  if (!hasAny) return null

  return (
    <div style={{ marginTop: 12, marginBottom: 12 }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 11,
        color: 'var(--muted)',
        letterSpacing: '0.1em',
        marginBottom: 10,
      }}>
        BIOFEEDBACK BREAKDOWN
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
        {BIO_METRICS.map(m => {
          const v = checkIn[m.key]
          if (v === null || v === undefined) return null
          const eff = metricEffective(m, v)
          const col = metricEffColor(eff)
          return (
            <div key={m.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{m.label}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-display)', color: col }}>{v}/10</span>
              </div>
              <div style={{ height: 3, background: 'var(--s4)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${(eff ?? 0) * 10}%`,
                  background: col,
                  borderRadius: 2,
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── CheckInCard ──────────────────────────────────────────────────────────
function CheckInCard({ checkIn, onReplied }) {
  const [reply, setReply] = useState(checkIn.coach_reply || '')
  const [videoUrl, setVideoUrl] = useState(checkIn.video_feedback_url || '')
  const [saving, setSaving] = useState(false)
  const [photoView, setPhotoView] = useState('front')
  const [expanded, setExpanded] = useState(false)
  const [aiSummary, setAiSummary] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const navigate = useNavigate()

  const isReplied = !!checkIn.coach_reply
  const daysSince = Math.floor((Date.now() - new Date(checkIn.submitted_at)) / (1000 * 60 * 60 * 24))
  const hasBiofeedback = checkIn.biofeedback_score !== null && checkIn.biofeedback_score !== undefined
  const bioScore = hasBiofeedback ? Math.round(checkIn.biofeedback_score) : null

  // Urgency badge config
  const urgencyConfig = {
    need_help:     { label: 'NEED HELP 🚨',     color: 'var(--danger)' },
    few_questions: { label: 'FEW QUESTIONS 🙋', color: 'var(--warn)' },
  }
  const urgencyBadge = checkIn.urgency && urgencyConfig[checkIn.urgency]
    ? urgencyConfig[checkIn.urgency]
    : null

  async function handleSendReply() {
    if (!reply.trim()) return
    setSaving(true)
    // Save reply + optional video URL
    const updateData = { coach_reply: reply.trim(), replied_at: new Date().toISOString() }
    if (videoUrl.trim()) updateData.video_feedback_url = videoUrl.trim()
    const { error } = await replyToCheckIn(checkIn.id, reply.trim(), videoUrl.trim() || null)
    setSaving(false)
    if (!error) {
      onReplied(checkIn.id, reply.trim())
      notifyClientReply({
        clientId:   checkIn.client_id,
        coachId:    null,
        weekNumber: checkIn.week_number,
        replyText:  reply.trim(),
      })
    }
  }

  async function handleGenerateSummary() {
    setAiLoading(true)
    setAiSummary(null)
    try {
      const res = await fetch('/api/checkin-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkIn }),
      })
      const json = await res.json()
      setAiSummary(json.summary || 'Could not generate summary.')
    } catch {
      setAiSummary('Error generating summary — check server connection.')
    }
    setAiLoading(false)
  }

  return (
    <div className={`card ${isReplied ? '' : daysSince >= 2 ? 'card-danger' : 'card-warn'}`} style={{ marginBottom: 12 }}>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 16,
                cursor: 'pointer',
                color: 'var(--accent)',
              }}
              onClick={() => checkIn.client_id && navigate(`/coach/client/${checkIn.client_id}`)}
            >
              {checkIn.client?.full_name || 'Unknown Client'}
            </span>
            <span className="tag tag-muted">W{checkIn.week_number}</span>
            {isReplied
              ? <span className="tag tag-accent">Replied</span>
              : daysSince >= 2
                ? <span className="tag tag-danger">Overdue</span>
                : <span className="tag tag-warn">Pending</span>
            }
            {/* Urgency badge */}
            {urgencyBadge && (
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 11,
                color: urgencyBadge.color,
                background: `${urgencyBadge.color}18`,
                border: `1px solid ${urgencyBadge.color}44`,
                padding: '2px 8px',
                borderRadius: 4,
                letterSpacing: '0.05em',
              }}>
                {urgencyBadge.label}
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
            Submitted {new Date(checkIn.submitted_at).toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
            {daysSince > 0 && ` · ${daysSince}d ago`}
            {checkIn.checkin_type && (
              <span style={{ marginLeft: 6, opacity: 0.6 }}>
                · {checkIn.checkin_type}
              </span>
            )}
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setExpanded(e => !e)}
        >
          {expanded ? 'COLLAPSE' : 'EXPAND'}
        </button>
      </div>

      {/* Quick stats row */}
      {hasBiofeedback ? (
        // New-style: biofeedback score + weight
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 12 }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 11,
              color: 'var(--muted)',
              letterSpacing: '0.1em',
              marginBottom: 2,
            }}>
              BIOFEEDBACK
            </div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 36,
              color: bioScoreColor(bioScore),
              lineHeight: 1,
            }}>
              {bioScore}
              <span style={{ fontSize: 14, color: 'var(--muted)', marginLeft: 2 }}>/100</span>
            </div>
          </div>
          {checkIn.body_weight_kg && (
            <div>
              <div className="label">Weight</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>
                {checkIn.body_weight_kg} kg
              </div>
            </div>
          )}
          {checkIn.lowest_areas_note && (
            <div style={{ flex: 1 }}>
              <div className="label">Lowest Areas</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {checkIn.lowest_areas_note}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Legacy: training/nutrition/mood badges
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 12 }}>
          {checkIn.body_weight_kg && (
            <div>
              <div className="label">Weight</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>{checkIn.body_weight_kg} kg</div>
            </div>
          )}
          {checkIn.sleep_hrs && (
            <div>
              <div className="label">Sleep</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>{checkIn.sleep_hrs}h</div>
            </div>
          )}
          <div>
            <div className="label">Training</div>
            <ScoreBadge value={checkIn.training_score} />
          </div>
          <div>
            <div className="label">Nutrition</div>
            <ScoreBadge value={checkIn.nutrition_score} />
          </div>
          <div>
            <div className="label">Mood</div>
            <ScoreBadge value={checkIn.mood_score} />
          </div>
        </div>
      )}

      {/* Client note */}
      {checkIn.client_note && (
        <div style={{
          background: 'var(--s4)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          padding: '10px 12px',
          marginBottom: 12,
          fontSize: 13,
          color: 'var(--white)',
          lineHeight: 1.6,
        }}>
          <div className="label" style={{ marginBottom: 4 }}>Client Note</div>
          "{checkIn.client_note}"
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <>
          {/* Biofeedback breakdown (new check-ins) */}
          {hasBiofeedback && <BioBreakdown checkIn={checkIn} />}

          {/* Photos */}
          {checkIn.photos && Object.keys(checkIn.photos).length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                {PHOTO_POSITIONS.filter(p => checkIn.photos[p]).map(pos => (
                  <button
                    key={pos}
                    className={`btn btn-sm ${photoView === pos ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setPhotoView(pos)}
                  >
                    {pos.toUpperCase()}
                  </button>
                ))}
              </div>
              {checkIn.photos[photoView] && (
                <img
                  src={checkIn.photos[photoView]}
                  alt={photoView}
                  style={{ maxHeight: 300, borderRadius: 6, border: '1px solid var(--border)' }}
                />
              )}
            </div>
          )}
        </>
      )}

      {/* AI Summary */}
      {!isReplied && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: aiSummary ? 8 : 0 }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleGenerateSummary}
              disabled={aiLoading}
              style={{ fontSize: 11 }}
            >
              {aiLoading ? '…' : '✦ AI SUMMARY'}
            </button>
            {aiSummary && (
              <span style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>Generated</span>
            )}
          </div>
          {aiSummary && (
            <div style={{
              background: 'rgba(0,200,150,0.06)', border: '1px solid rgba(0,200,150,0.2)',
              borderRadius: 8, padding: '12px 14px', fontSize: 13, color: 'var(--white)',
              lineHeight: 1.7, whiteSpace: 'pre-wrap',
            }}>
              {aiSummary}
            </div>
          )}
        </div>
      )}

      {/* Reply */}
      {isReplied ? (
        <div>
          <div className="coach-note" style={{ fontSize: 13 }}>{checkIn.coach_reply}</div>
          {checkIn.video_feedback_url && (
            <div style={{ marginTop: 8 }}>
              <a href={checkIn.video_feedback_url} target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--accent)', fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                ▶ Video Feedback
              </a>
            </div>
          )}
        </div>
      ) : (
        <div>
          <textarea
            className="input"
            rows={3}
            placeholder="Write your reply to the client..."
            value={reply}
            onChange={e => setReply(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <input
            className="input"
            style={{ marginBottom: 8, fontSize: 12 }}
            placeholder="Video feedback URL (Zoom, Loom, YouTube — optional)"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-primary"
              onClick={handleSendReply}
              disabled={saving || !reply.trim()}
            >
              {saving ? '…' : 'SEND REPLY'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Coach CheckIns Page ─────────────────────────────────────────────
export default function CoachCheckIns() {
  const { pendingCheckIns, overdueCheckIns, setPendingCheckIns, loading } = useCoach()
  const [activeTab, setActiveTab] = useState('pending')

  function handleReplied(checkInId, replyText) {
    setPendingCheckIns(prev =>
      prev.map(ci => ci.id === checkInId
        ? { ...ci, coach_reply: replyText, replied_at: new Date().toISOString() }
        : ci
      )
    )
  }

  const displayList = activeTab === 'pending'
    ? pendingCheckIns.filter(ci => !ci.coach_reply)
    : overdueCheckIns.filter(ci => !ci.coach_reply)

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Client Check-Ins</div>
        <div className="page-subtitle">Review and reply to weekly check-ins</div>
      </div>

      <div className="tabs">
        <div
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({pendingCheckIns.filter(ci => !ci.coach_reply).length})
        </div>
        <div
          className={`tab ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => setActiveTab('overdue')}
        >
          Overdue ({overdueCheckIns.filter(ci => !ci.coach_reply).length})
        </div>
        <div
          className={`tab ${activeTab === 'replied' ? 'active' : ''}`}
          onClick={() => setActiveTab('replied')}
        >
          Replied ({pendingCheckIns.filter(ci => ci.coach_reply).length})
        </div>
      </div>

      {activeTab === 'replied' ? (
        pendingCheckIns.filter(ci => ci.coach_reply).length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No replied check-ins</div>
          </div>
        ) : (
          pendingCheckIns.filter(ci => ci.coach_reply).map(ci => (
            <CheckInCard key={ci.id} checkIn={ci} onReplied={handleReplied} />
          ))
        )
      ) : displayList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">
            {activeTab === 'pending' ? 'No pending check-ins' : 'No overdue check-ins'}
          </div>
          <div className="empty-state-text">
            {activeTab === 'pending' ? 'All caught up!' : "You're on top of your replies."}
          </div>
        </div>
      ) : (
        displayList.map(ci => (
          <CheckInCard key={ci.id} checkIn={ci} onReplied={handleReplied} />
        ))
      )}
    </div>
  )
}
