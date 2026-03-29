import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase.js'

// ─── YouTube embed helper ─────────────────────────────────────────────────────

function youtubeId(url) {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  return m ? m[1] : null
}

// ─── Video Card ───────────────────────────────────────────────────────────────

function VideoCard({ video, onDelete }) {
  const ytId = youtubeId(video.video_url)
  const dateStr = new Date(video.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{
      background: 'var(--s3)', border: '1px solid var(--border)',
      borderRadius: 12, overflow: 'hidden',
    }}>
      {/* Video embed */}
      {ytId ? (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            allowFullScreen
            title={video.title}
          />
        </div>
      ) : (
        <div style={{
          height: 160, background: 'var(--s4)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: 'var(--muted)', fontSize: 13, fontFamily: 'var(--font-body)',
        }}>
          No valid YouTube URL
        </div>
      )}

      {/* Info */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            {video.is_active && (
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: '0.07em',
                color: 'var(--accent)', background: 'rgba(0,200,150,0.15)',
                border: '1px solid rgba(0,200,150,0.3)', borderRadius: 4, padding: '2px 8px',
                marginBottom: 6, display: 'inline-block',
              }}>FEATURED THIS WEEK</span>
            )}
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)', letterSpacing: '0.02em', marginTop: 4 }}>
              {video.title}
            </div>
            {video.description && (
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, lineHeight: 1.6 }}>
                {video.description}
              </div>
            )}
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>{dateStr}</div>
          </div>
          <button
            onClick={() => onDelete(video.id)}
            style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: 6,
              color: 'var(--muted)', cursor: 'pointer', padding: '4px 10px', fontSize: 12,
              flexShrink: 0,
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Post Form ────────────────────────────────────────────────────────────────

function PostForm({ coachId, onPosted }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const ytId = youtubeId(videoUrl)

  async function handlePost() {
    if (!title.trim() || !videoUrl.trim()) {
      setError('Title and YouTube URL are required.')
      return
    }
    if (!ytId) {
      setError('Please enter a valid YouTube URL or video ID.')
      return
    }
    setSaving(true)
    setError(null)

    // Mark all existing as not active
    await supabase.from('technique_videos')
      .update({ is_active: false })
      .eq('coach_id', coachId)

    const { error: err } = await supabase.from('technique_videos').insert({
      coach_id: coachId,
      title: title.trim(),
      description: description.trim() || null,
      video_url: videoUrl.trim(),
      is_active: true,
      published_at: new Date().toISOString(),
    })

    setSaving(false)
    if (err) { setError(err.message); return }
    setTitle('')
    setDescription('')
    setVideoUrl('')
    onPosted()
  }

  return (
    <div style={{ background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 12, padding: '24px 28px', marginBottom: 28 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)', letterSpacing: '0.04em', marginBottom: 20 }}>
        POST THIS WEEK'S TECHNIQUE VIDEO
      </div>

      {error && (
        <div style={{ background: 'rgba(220,50,50,0.15)', border: '1px solid rgba(220,50,50,0.4)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.07em', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>VIDEO TITLE</label>
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Perfect the Hip Hinge — Romanian Deadlift Breakdown" />
        </div>
        <div>
          <label style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.07em', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>YOUTUBE URL</label>
          <input className="input" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
          {ytId && (
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
              ✓ Valid YouTube video: {ytId}
            </div>
          )}
        </div>
        <div>
          <label style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.07em', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>COACHING NOTES <span style={{ fontFamily: 'var(--font-body)', fontWeight: 400 }}>(optional)</span></label>
          <textarea className="input" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="What should the client focus on? Any cues or context?" style={{ resize: 'none' }} />
        </div>
        <button
          className="btn btn-primary"
          onClick={handlePost}
          disabled={saving || !title.trim() || !ytId}
          style={{ alignSelf: 'flex-start', padding: '10px 28px' }}
        >
          {saving ? '…' : 'POST VIDEO →'}
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TechniqueLab() {
  const { user } = useAuth()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase
      .from('technique_videos')
      .select('*')
      .eq('coach_id', user?.id)
      .order('published_at', { ascending: false })
      .limit(20)
    setVideos(data || [])
    setLoading(false)
  }

  useEffect(() => { if (user?.id) load() }, [user?.id])

  async function handleDelete(id) {
    if (!window.confirm('Delete this video?')) return
    await supabase.from('technique_videos').delete().eq('id', id)
    setVideos(v => v.filter(x => x.id !== id))
  }

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Technique Lab</div>
          <div className="page-subtitle">Post a featured coaching video — appears on every client's dashboard</div>
        </div>
      </div>

      <PostForm coachId={user?.id} onPosted={load} />

      <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.07em', marginBottom: 14 }}>
        POSTED VIDEOS ({videos.length})
      </div>

      {videos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-title">No videos posted yet</div>
          <div className="empty-state-text">Post your first technique video above.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
          {videos.map(v => <VideoCard key={v.id} video={v} onDelete={handleDelete} />)}
        </div>
      )}
    </div>
  )
}
