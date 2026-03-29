import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useTheme } from '../../hooks/useTheme.jsx'
import {
  getCoachNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../lib/supabase.js'

const pageMeta = {
  '/dashboard':        { title: 'Dashboard',       sub: 'Your overview' },
  '/training':         { title: 'Training',         sub: 'Session logger' },
  '/nutrition':        { title: 'Nutrition',        sub: 'Meal tracking' },
  '/habits':           { title: 'Habits',           sub: 'Daily tracking' },
  '/progress':         { title: 'Progress',         sub: 'Body composition' },
  '/checkin':          { title: 'Check-In',         sub: 'Weekly report' },
  '/education':        { title: 'Education',        sub: 'Learning hub' },
  '/goalmap':          { title: 'Goal Map',          sub: '6-month periodisation' },
  '/cycle':            { title: 'Cycle',             sub: 'Menstrual tracking' },
  '/results':          { title: 'My Results',        sub: 'Fitness test history' },
  '/supplements':      { title: 'Supplements',       sub: 'Nutrition & stacks' },
  '/protocols':        { title: 'Protocols',         sub: 'Health protocols' },
  '/mobility':         { title: 'Mobility',          sub: 'Movement library' },
  '/psmf':             { title: 'PSMF Protocol',      sub: 'Protein Sparing Modified Fast' },
  '/coach/dashboard':  { title: 'Dashboard',        sub: 'Coach overview' },
  '/coach/checkins':   { title: 'Check-Ins',        sub: 'Client reviews' },
  '/coach/programs':   { title: 'Programs',         sub: 'Client programmes' },
  '/coach/templates':  { title: 'Templates',        sub: 'Programme library' },
  '/coach/assessment': { title: 'Assessment',       sub: 'Biomechanical screen' },
  '/coach/testing':    { title: 'Testing',          sub: 'Performance tests' },
  '/coach/calculators':{ title: 'Calculators',      sub: 'Coaching tools' },
  '/coach/content':    { title: 'Content Hub',      sub: 'Education library' },
  '/coach/stripe':     { title: 'Billing',          sub: 'Subscriptions' },
}

function getTodayStr() {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
  })
}

function NotificationBell({ coachId }) {
  const [unread, setUnread]       = useState(0)
  const [open, setOpen]           = useState(false)
  const [notifications, setNotes] = useState([])
  const [loading, setLoading]     = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!coachId) return
    fetchCount()
    const interval = setInterval(fetchCount, 30000) // poll every 30s
    return () => clearInterval(interval)
  }, [coachId])

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function fetchCount() {
    const { count } = await getUnreadNotificationCount(coachId)
    setUnread(count)
  }

  async function handleOpen() {
    if (open) { setOpen(false); return }
    setOpen(true)
    setLoading(true)
    const { data } = await getCoachNotifications(coachId, 20)
    setNotes(data || [])
    setLoading(false)
  }

  async function handleMarkRead(id) {
    await markNotificationRead(id)
    setNotes(n => n.map(x => x.id === id ? { ...x, is_read: true } : x))
    setUnread(u => Math.max(0, u - 1))
  }

  async function handleMarkAll() {
    await markAllNotificationsRead(coachId)
    setNotes(n => n.map(x => ({ ...x, is_read: true })))
    setUnread(0)
  }

  const typeIcon = { workout_note: '💪', check_in: '📋', progress_photo: '📸', measurement: '📏' }
  const timeAgo = (ts) => {
    const diff = (Date.now() - new Date(ts)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
    return `${Math.floor(diff/86400)}d ago`
  }

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      <button
        onClick={handleOpen}
        style={{
          position: 'relative', width: 34, height: 34, borderRadius: 8,
          background: open ? 'rgba(0,200,150,.12)' : 'var(--s3)',
          border: `1.5px solid ${open ? 'var(--accent)' : 'var(--border-hi)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all .15s', flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 15 }}>🔔</span>
        {unread > 0 && (
          <div style={{
            position: 'absolute', top: -4, right: -4,
            width: 16, height: 16, borderRadius: '50%',
            background: 'var(--danger)', border: '2px solid var(--bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 8, color: '#fff',
            fontWeight: 700,
          }}>
            {unread > 9 ? '9+' : unread}
          </div>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 42, right: 0, width: 320, maxHeight: 420,
          background: 'var(--s1)', border: '1px solid var(--border-hi)',
          borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,.4)',
          zIndex: 200, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1, color: 'var(--white)' }}>
              NOTIFICATIONS {unread > 0 && <span style={{ color: 'var(--accent)' }}>({unread})</span>}
            </div>
            {unread > 0 && (
              <button
                onClick={handleMarkAll}
                style={{ fontSize: 10, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', letterSpacing: 0.5 }}
              >
                MARK ALL READ
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {loading ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>Loading…</div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>🔔</div>
                <div style={{ color: 'var(--muted)', fontSize: 12 }}>No notifications yet</div>
              </div>
            ) : notifications.map(n => (
              <div
                key={n.id}
                onClick={() => !n.is_read && handleMarkRead(n.id)}
                style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--border)',
                  background: n.is_read ? 'transparent' : 'rgba(0,200,150,.04)',
                  cursor: n.is_read ? 'default' : 'pointer',
                  transition: 'background .15s',
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                }}
              >
                <div style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{typeIcon[n.type] || '🔔'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <div style={{
                      fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 0.5,
                      color: n.is_read ? 'var(--sub)' : 'var(--white)',
                    }}>
                      {n.title}
                    </div>
                    {!n.is_read && (
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                    )}
                  </div>
                  {n.profiles?.full_name && (
                    <div style={{ fontSize: 10, color: 'var(--accent)', marginBottom: 2, fontFamily: 'var(--font-display)', letterSpacing: 0.5 }}>
                      {n.profiles.full_name}
                    </div>
                  )}
                  {n.body && (
                    <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {n.body}
                    </div>
                  )}
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>{timeAgo(n.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Topbar({ mode }) {
  const { pathname } = useLocation()
  const { profile } = useAuth()
  const { isDark, toggle } = useTheme()
  const meta = pageMeta[pathname] || { title: 'Performuscle', sub: '' }

  return (
    <header className="topbar">
      {/* Theme toggle — top left */}
      <button
        onClick={toggle}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--s3)', border: '1px solid var(--border-hi)',
          borderRadius: 20, cursor: 'pointer',
          padding: '5px 10px 5px 8px', marginRight: 14, flexShrink: 0,
          boxShadow: '0 1px 4px rgba(0,0,0,.08)',
          transition: 'background .2s, border-color .2s',
          WebkitTapHighlightColor: 'transparent',
          minHeight: 34,
        }}
      >
        {/* Animated icon */}
        <span style={{ fontSize: 14, lineHeight: 1, userSelect: 'none' }}>
          {isDark ? '☀️' : '🌙'}
        </span>
        {/* Slide pill */}
        <div style={{
          width: 40, height: 22, borderRadius: 11,
          background: isDark ? 'var(--accent)' : 'rgba(0,0,0,.12)',
          border: `1px solid ${isDark ? 'var(--accent)' : 'var(--border-hi)'}`,
          position: 'relative', transition: 'background .25s, border-color .25s',
          flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', top: 3,
            left: isDark ? 20 : 3,
            width: 14, height: 14, borderRadius: '50%',
            background: isDark ? '#fff' : '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,.25)',
            transition: 'left .25s cubic-bezier(.34,1.56,.64,1)',
          }} />
        </div>
        {/* Label */}
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 9, letterSpacing: '1.5px',
          color: 'var(--muted)',
          userSelect: 'none',
        }}>
          {isDark ? 'DARK' : 'LIGHT'}
        </span>
      </button>

      {/* Page identity */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flex: 1 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 19,
          letterSpacing: 2.5,
          color: 'var(--white)',
          lineHeight: 1,
        }}>
          {meta.title}
        </h1>
        {meta.sub && (
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 9,
            letterSpacing: 2,
            color: 'var(--muted)',
            textTransform: 'uppercase',
          }}>
            {meta.sub}
          </span>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Date */}
        <span className="topbar-date" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          letterSpacing: 1.5,
          color: 'var(--muted)',
        }}>
          {getTodayStr()}
        </span>

        {/* Notification bell — coach only */}
        {mode === 'coach' && profile?.id && (
          <NotificationBell coachId={profile.id} />
        )}

        {/* Mode badge */}
        {mode === 'coach' && (
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 9,
            letterSpacing: 1.5,
            color: 'var(--accent)',
            background: 'var(--accent-dim)',
            border: '1px solid rgba(0,200,150,.25)',
            borderRadius: 4,
            padding: '3px 9px',
            boxShadow: '0 0 10px rgba(0,200,150,.15)',
          }}>
            COACH
          </span>
        )}

        {/* Plan badge */}
        {profile?.plan && (
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 9,
            letterSpacing: 1.5,
            color: profile.plan === 'elite' ? 'var(--warn)' : 'var(--muted)',
            background: profile.plan === 'elite' ? 'rgba(255,173,0,.1)' : 'var(--s4)',
            border: `1px solid ${profile.plan === 'elite' ? 'rgba(255,173,0,.3)' : 'var(--border)'}`,
            borderRadius: 4,
            padding: '3px 9px',
          }}>
            {profile.plan.toUpperCase()}
          </span>
        )}

        {/* User dot */}
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--s4), var(--s5))',
          border: '1.5px solid rgba(0,200,150,.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 11,
          color: 'var(--accent)',
          boxShadow: '0 0 10px rgba(0,200,150,.15)',
        }}>
          {profile?.full_name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '?'}
        </div>
      </div>
    </header>
  )
}
