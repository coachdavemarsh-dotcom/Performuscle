import { Router } from 'express'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Service role key required — webhooks must bypass RLS to update billing records
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not set — webhook billing updates will fail')
}
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

/**
 * POST /api/webhooks/stripe
 * Handles Stripe webhook events
 * Must be registered with raw body parser (express.raw)
 */
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  console.log(`[Webhook] Event: ${event.type}`)

  try {
    switch (event.type) {
      case 'customer.subscription.updated': {
        const sub = event.data.object
        await handleSubscriptionUpdated(sub)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object
        await handleSubscriptionDeleted(sub)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        await handlePaymentFailed(invoice)
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object
        await handleInvoicePaid(invoice)
        break
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error(`[Webhook] Handler error for ${event.type}:`, err)
    // Return 200 so Stripe doesn't retry — log the error internally
  }

  res.json({ received: true })
})

async function handleSubscriptionUpdated(sub) {
  const clientId = sub.metadata?.supabase_client_id
  if (!clientId) return

  const status = sub.status === 'active' ? 'active'
    : sub.status === 'paused' || sub.pause_collection ? 'paused'
    : sub.status === 'canceled' ? 'cancelled'
    : 'active'

  await supabase
    .from('clients')
    .update({
      status,
      stripe_subscription_id: sub.id,
    })
    .eq('client_id', clientId)
}

async function handleSubscriptionDeleted(sub) {
  const clientId = sub.metadata?.supabase_client_id
  if (!clientId) return

  await supabase
    .from('clients')
    .update({ status: 'cancelled' })
    .eq('stripe_subscription_id', sub.id)
}

async function handlePaymentFailed(invoice) {
  const customerId = invoice.customer

  // Find the client by stripe customer ID
  const { data: client } = await supabase
    .from('clients')
    .select('client_id, coach_id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!client) return

  // Update client status
  await supabase
    .from('clients')
    .update({ status: 'active' }) // Keep active but coach can see via Stripe
    .eq('stripe_customer_id', customerId)

  console.log(`[Webhook] Payment failed for customer ${customerId}, client ${client.client_id}`)
}

async function handleInvoicePaid(invoice) {
  const customerId = invoice.customer

  await supabase
    .from('clients')
    .update({ status: 'active' })
    .eq('stripe_customer_id', customerId)

  console.log(`[Webhook] Invoice paid for customer ${customerId}`)
}

export default router
