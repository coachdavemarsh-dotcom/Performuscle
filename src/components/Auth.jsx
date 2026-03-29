import { useState } from 'react'
import { signIn, signUp } from '../lib/supabase.js'

export default function Auth() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
    } else {
      const { error } = await signUp(email, password, fullName)
      if (error) setError(error.message)
      else setSuccess('Check your email to confirm your account.')
    }

    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">PERFORMUSCLE</div>
        <div className="auth-tagline">Health · Function · Performance</div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'signup' && (
            <div className="input-group">
              <label className="form-label">Full Name</label>
              <input
                className="input"
                type="text"
                placeholder="Dave Marshall"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label className="form-label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="form-label">Password</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: 6, width: '100%', padding: '11px 18px', fontSize: 13 }}
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : (
              mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button
            style={{
              fontSize: 12,
              color: 'var(--accent)',
              fontFamily: 'var(--font-display)',
              letterSpacing: 1,
            }}
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null) }}
          >
            {mode === 'login' ? 'SIGN UP' : 'SIGN IN'}
          </button>
        </div>
      </div>
    </div>
  )
}
