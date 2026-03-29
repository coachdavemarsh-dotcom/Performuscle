import { useState, useEffect } from 'react'
import StatCard from '../shared/StatCard.jsx'
import {
  getBillingOverview,
  getSubscriptions,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  retryPayment,
  sendPaymentLink,
} from '../../lib/stripe.js'

function SubscriptionRow({ sub, onAction }) {
  const [loading, setLoading] = useState(null)

  async function act(action, fn) {
    setLoading(action)
    try { await fn() } catch (e) { alert(e.message) }
    setLoading(null)
    onAction()
  }

  const statusColor = {
    active: 'var(--accent)',
    paused: 'var(--warn)',
    past_due: 'var(--danger)',
    canceled: 'var(--muted)',
  }[sub.status] || 'var(--muted)'

  return (
    <tr>
      <td>{sub.clientName || sub.customer_email || '—'}</td>
      <td>
        <span className="tag tag-muted">{sub.plan || '—'}</span>
      </td>
      <td>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>
          £{(sub.amount / 100).toFixed(0)}/mo
        </div>
      </td>
      <td>
        {sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toLocaleDateString('en-GB')
          : '—'
        }
      </td>
      <td>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 9,
          letterSpacing: 1,
          color: statusColor,
          textTransform: 'uppercase',
        }}>
          {sub.status}
        </span>
      </td>
      <td>
        <div style={{ display: 'flex', gap: 6 }}>
          {sub.status === 'active' && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => act('pause', () => pauseSubscription(sub.id))}
              disabled={!!loading}
            >
              {loading === 'pause' ? '…' : 'PAUSE'}
            </button>
          )}
          {sub.status === 'paused' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => act('resume', () => resumeSubscription(sub.id))}
              disabled={!!loading}
            >
              {loading === 'resume' ? '…' : 'RESUME'}
            </button>
          )}
          {sub.status === 'past_due' && (
            <>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => act('retry', () => retryPayment(sub.latest_invoice))}
                disabled={!!loading}
              >
                {loading === 'retry' ? '…' : 'RETRY'}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => act('link', () => sendPaymentLink(sub.customer))}
                disabled={!!loading}
              >
                {loading === 'link' ? '…' : 'SEND LINK'}
              </button>
            </>
          )}
          {sub.status !== 'canceled' && (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                if (confirm(`Cancel subscription for ${sub.clientName || sub.customer_email}?`)) {
                  act('cancel', () => cancelSubscription(sub.id))
                }
              }}
              disabled={!!loading}
            >
              {loading === 'cancel' ? '…' : 'CANCEL'}
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function StripePage() {
  const [overview, setOverview] = useState(null)
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    setError(null)
    try {
      const [ov, subs] = await Promise.all([getBillingOverview(), getSubscriptions()])
      setOverview(ov)
      setSubscriptions(subs.subscriptions || [])
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  if (loading) return <div className="loading-overlay"><div className="spinner" /></div>

  const failedSubs = subscriptions.filter(s => s.status === 'past_due')

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Billing</div>
        <div className="page-subtitle">Stripe subscription management</div>
      </div>

      {error && (
        <div className="alert alert-danger section-gap">
          <span>⚠</span>
          <div>
            <strong>API Error:</strong> {error}
            <div style={{ fontSize: 11, marginTop: 4, color: 'var(--muted)' }}>
              Make sure your Express server is running and STRIPE_SECRET_KEY is configured.
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {overview && (
        <div className="grid-4 section-gap">
          <StatCard
            label="MRR"
            value={`£${((overview.mrr || 0) / 100).toFixed(0)}`}
            sub="Monthly recurring revenue"
          />
          <StatCard
            label="ARR"
            value={`£${((overview.arr || 0) / 100).toFixed(0)}`}
            sub="Annual run rate"
          />
          <StatCard
            label="Active"
            value={overview.active_count || 0}
            sub="Active subscriptions"
          />
          <StatCard
            label="Failed"
            value={overview.failed_count || 0}
            sub="Past due payments"
            variant={overview.failed_count > 0 ? 'danger' : 'accent'}
          />
        </div>
      )}

      {/* Failed payments alert */}
      {failedSubs.length > 0 && (
        <div className="alert alert-danger section-gap">
          <span>⚠</span>
          <div>
            <strong>{failedSubs.length} failed payment{failedSubs.length > 1 ? 's' : ''}</strong>
            {' '}— {failedSubs.map(s => s.clientName || s.customer_email).join(', ')}
          </div>
        </div>
      )}

      {/* Subscriptions table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Subscriptions</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="tag tag-muted">{subscriptions.length} total</span>
            <button className="btn btn-ghost btn-sm" onClick={loadData}>REFRESH</button>
          </div>
        </div>

        {subscriptions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No subscriptions found</div>
            <div className="empty-state-text">
              {error ? 'Check server connection.' : 'Subscriptions will appear here once Stripe is connected.'}
            </div>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Next Bill</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map(sub => (
                <SubscriptionRow key={sub.id} sub={sub} onAction={loadData} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
