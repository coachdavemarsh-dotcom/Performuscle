import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase.js'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const PROVIDER_NAMES = {
  APPLE: 'Apple Health',
  GARMIN: 'Garmin',
  FITBIT: 'Fitbit',
  GOOGLE: 'Google Fit',
  POLAR: 'Polar',
  SUUNTO: 'Suunto',
  WHOOP: 'Whoop',
  SAMSUNG: 'Samsung Health',
}
const PROVIDER_ICONS = {
  APPLE: '🍎',
  GARMIN: '⌚',
  FITBIT: '⌚',
  GOOGLE: '📱',
  POLAR: '⌚',
  SUUNTO: '⌚',
  WHOOP: '⌚',
  SAMSUNG: '📱',
}

export default function TerraConnect() {
  const { user, session } = useAuth()
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)

  useEffect(() => {
    if (!user) return
    load()
    const params = new URLSearchParams(window.location.search)
    if (params.get('terra')) {
      window.history.replaceState({}, '', window.location.pathname)
      load()
    }
  }, [user])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('terra_connections')
      .select('provider, connected_at')
      .eq('user_id', user.id)
    setConnections(data || [])
    setLoading(false)
  }

  async function handleConnect() {
    setWorking(true)
    try {
      const res = await fetch(`${API}/api/terra/widget-url`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (err) {
      alert('Could not open wearable connect: ' + err.message)
      setWorking(false)
    }
  }

  async function handleDisconnect(provider) {
    if (!confirm(`Disconnect ${PROVIDER_NAMES[provider] || provider}? Your activity history will be kept.`)) return
    await fetch(`${API}/api/terra/disconnect`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ provider }),
    })
    setConnections(prev => prev.filter(c => c.provider !== provider))
  }

  if (loading) return null

  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: connections.length ? 12 : 6 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1, color: 'var(--white)', marginBottom: 2 }}>
            WEARABLE SYNC
          </div>
          {!connections.length && (
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>
              Apple Health · Garmin · Whoop · Fitbit and more
            </div>
          )}
        </div>
        <button
          className="btn btn-sm"
          style={{ background: 'var(--accent)', color: '#000', fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1, flexShrink: 0 }}
          onClick={handleConnect}
          disabled={working}
        >{working ? '...' : connections.length ? '+ ADD' : 'CONNECT'}</button>
      </div>

      {connections.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {connections.map(conn => (
            <div key={conn.provider} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>{PROVIDER_ICONS[conn.provider] || '📱'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--white)', fontWeight: 500 }}>
                  {PROVIDER_NAMES[conn.provider] || conn.provider}
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>
                  Since {new Date(conn.connected_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <span style={{
                fontSize: 8, fontFamily: 'var(--font-display)', letterSpacing: 1,
                padding: '3px 8px', borderRadius: 4,
                background: 'var(--accent-dim)', color: 'var(--accent)',
                border: '1px solid var(--border-accent)',
              }}>LIVE</span>
              <button
                className="btn btn-ghost btn-sm"
                style={{ fontSize: 10, color: 'var(--muted)', padding: '2px 8px' }}
                onClick={() => handleDisconnect(conn.provider)}
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
