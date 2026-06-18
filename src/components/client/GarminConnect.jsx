import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function GarminConnect() {
  const { user, session } = useAuth()
  const [status, setStatus]   = useState(null)  // null | { connected, garminUserId, connectedAt }
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)

  useEffect(() => {
    if (!user) return
    fetchStatus()
    // Handle redirect back from Garmin OAuth
    const params = new URLSearchParams(window.location.search)
    const garminResult = params.get('garmin')
    if (garminResult) {
      window.history.replaceState({}, '', window.location.pathname)
      if (garminResult === 'connected') fetchStatus()
    }
  }, [user])

  async function fetchStatus() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/garmin/status`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      setStatus(await res.json())
    } catch {
      setStatus({ connected: false })
    } finally {
      setLoading(false)
    }
  }

  async function handleConnect() {
    setWorking(true)
    try {
      const res = await fetch(`${API}/api/garmin/auth`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      const { authorizeUrl, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = authorizeUrl
    } catch (err) {
      alert('Could not start Garmin connection: ' + err.message)
      setWorking(false)
    }
  }

  async function handleDisconnect() {
    if (!confirm('Disconnect your Garmin account? Scheduled workouts on Garmin won\'t be removed.')) return
    setWorking(true)
    await fetch(`${API}/api/garmin/disconnect`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session?.access_token}` },
    })
    setStatus({ connected: false })
    setWorking(false)
  }

  if (loading) {
    return (
      <div className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--s3)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ width: 100, height: 10, background: 'var(--s3)', borderRadius: 4, marginBottom: 6 }} />
          <div style={{ width: 160, height: 8, background: 'var(--s3)', borderRadius: 4 }} />
        </div>
      </div>
    )
  }

  const connected = status?.connected

  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Garmin icon */}
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: connected ? 'var(--accent-dim)' : 'var(--s3)',
          border: `1.5px solid ${connected ? 'var(--accent)' : 'var(--border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20,
        }}>⌚</div>

        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1,
            color: 'var(--white)', marginBottom: 3,
          }}>GARMIN CONNECT</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            {connected
              ? `Connected${status.connectedAt ? ` · ${new Date(status.connectedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}`
              : 'Push workouts directly to your Garmin device'}
          </div>
        </div>

        {connected ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{
              fontSize: 8, fontFamily: 'var(--font-display)', letterSpacing: 1,
              padding: '3px 8px', borderRadius: 4,
              background: 'var(--accent-dim)', color: 'var(--accent)',
              border: '1px solid var(--border-accent)',
            }}>CONNECTED</span>
            <button
              className="btn btn-ghost btn-sm"
              style={{ fontSize: 9, color: 'var(--muted)' }}
              onClick={handleDisconnect}
              disabled={working}
            >Disconnect</button>
          </div>
        ) : (
          <button
            className="btn btn-sm"
            style={{ background: 'var(--accent)', color: '#000', fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1 }}
            onClick={handleConnect}
            disabled={working}
          >{working ? 'Redirecting…' : 'CONNECT'}</button>
        )}
      </div>

      {connected && (
        <div style={{
          marginTop: 12, padding: '10px 12px', borderRadius: 8,
          background: 'var(--s3)', border: '1px solid var(--border)',
          fontSize: 11, color: 'var(--muted)', lineHeight: 1.6,
        }}>
          Your endurance sessions now have a <strong style={{ color: 'var(--white)' }}>⌚ Garmin</strong> button.
          Tap it to push that session to your Garmin Connect calendar — it syncs to your watch on the next sync.
          Completed activities sync back automatically and mark your sessions as done.
        </div>
      )}
    </div>
  )
}
