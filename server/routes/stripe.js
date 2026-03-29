import { Router } from 'express'
import Stripe from 'stripe'
import { requireAuth, requireCoach } from '../middleware/auth.js'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// All stripe routes require auth + coach role
router.use(requireAuth, requireCoach)

// ============================================================
// BILLING OVERVIEW
// ============================================================

router.get('/overview', async (req, res) => {
  try {
    const [subscriptions, invoices] = await Promise.all([
      stripe.subscriptions.list({ limit: 100, status: 'all' }),
      stripe.invoices.list({ limit: 100, status: 'open' }),
    ])

    const active = subscriptions.data.filter(s => s.status === 'active')
    const failed = subscriptions.data.filter(s => s.status === 'past_due')
    const mrr = active.reduce((sum, s) => sum + s.items.data[0]?.price?.unit_amount || 0, 0)

    res.json({
      mrr,
      arr: mrr * 12,
      active_count: active.length,
      failed_count: failed.length,
      total_count: subscriptions.data.length,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============================================================
// SUBSCRIPTIONS LIST
// ============================================================

router.get('/subscriptions', async (req, res) => {
  try {
    const subscriptions = await stripe.subscriptions.list({
      limit: 100,
      status: 'all',
      expand: ['data.customer', 'data.latest_invoice'],
    })

    const enriched = subscriptions.data.map(s => ({
      id: s.id,
      customer: s.customer.id,
      customer_email: s.customer.email,
      clientName: s.customer.name,
      plan: s.items.data[0]?.price?.nickname || s.metadata?.plan,
      amount: s.items.data[0]?.price?.unit_amount || 0,
      status: s.status,
      current_period_end: s.current_period_end,
      latest_invoice: s.latest_invoice?.id,
    }))

    res.json({ subscriptions: enriched })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================

router.post('/subscriptions/:id/pause', async (req, res) => {
  try {
    const sub = await stripe.subscriptions.update(req.params.id, {
      pause_collection: { behavior: 'keep_as_draft' },
    })
    res.json({ subscription: sub })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/subscriptions/:id/resume', async (req, res) => {
  try {
    const sub = await stripe.subscriptions.update(req.params.id, {
      pause_collection: '',
    })
    res.json({ subscription: sub })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/subscriptions/:id/cancel', async (req, res) => {
  try {
    const sub = await stripe.subscriptions.cancel(req.params.id)
    res.json({ subscription: sub })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============================================================
// PAYMENT HANDLING
// ============================================================

router.post('/invoices/:id/retry', async (req, res) => {
  try {
    const invoice = await stripe.invoices.pay(req.params.id)
    res.json({ invoice })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/customers/:id/payment-link', async (req, res) => {
  try {
    // Get customer's open invoices
    const invoices = await stripe.invoices.list({
      customer: req.params.id,
      status: 'open',
      limit: 1,
    })

    if (!invoices.data.length) {
      return res.status(404).json({ error: 'No open invoice found' })
    }

    // Finalize the invoice to get a hosted URL
    const invoice = await stripe.invoices.finalizeInvoice(invoices.data[0].id)
    res.json({ payment_link: invoice.hosted_invoice_url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============================================================
// CUSTOMER MANAGEMENT
// ============================================================

router.post('/customers', async (req, res) => {
  try {
    const { email, name, clientId } = req.body
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { supabase_client_id: clientId },
    })
    res.json({ customer })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/subscriptions', async (req, res) => {
  try {
    const { customerId, priceId, clientId } = req.body
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata: { supabase_client_id: clientId },
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    })
    res.json({ subscription })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
