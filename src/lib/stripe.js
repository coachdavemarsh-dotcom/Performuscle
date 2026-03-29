// ============================================================
// STRIPE CLIENT HELPERS
// All calls go through your Express server — never call Stripe directly
// ============================================================

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function apiCall(path, options = {}) {
  const { supabase } = await import('./supabase.js')
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const res = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'API error')
  }

  return res.json()
}

// ============================================================
// BILLING OVERVIEW
// ============================================================

export async function getBillingOverview() {
  return apiCall('/stripe/overview')
}

export async function getSubscriptions() {
  return apiCall('/stripe/subscriptions')
}

// ============================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================

export async function pauseSubscription(subscriptionId) {
  return apiCall(`/stripe/subscriptions/${subscriptionId}/pause`, { method: 'POST' })
}

export async function resumeSubscription(subscriptionId) {
  return apiCall(`/stripe/subscriptions/${subscriptionId}/resume`, { method: 'POST' })
}

export async function cancelSubscription(subscriptionId) {
  return apiCall(`/stripe/subscriptions/${subscriptionId}/cancel`, { method: 'POST' })
}

// ============================================================
// PAYMENT HANDLING
// ============================================================

export async function retryPayment(invoiceId) {
  return apiCall(`/stripe/invoices/${invoiceId}/retry`, { method: 'POST' })
}

export async function sendPaymentLink(customerId) {
  return apiCall(`/stripe/customers/${customerId}/payment-link`, { method: 'POST' })
}

// ============================================================
// CUSTOMER MANAGEMENT
// ============================================================

export async function createCustomer(clientId, email, name) {
  return apiCall('/stripe/customers', {
    method: 'POST',
    body: JSON.stringify({ clientId, email, name }),
  })
}

export async function createSubscription(customerId, priceId, clientId) {
  return apiCall('/stripe/subscriptions', {
    method: 'POST',
    body: JSON.stringify({ customerId, priceId, clientId }),
  })
}
