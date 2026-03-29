// Vercel serverless adapter — wraps Express app without calling app.listen()
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import stripeRouter   from '../server/routes/stripe.js'
import webhooksRouter from '../server/routes/webhooks.js'
import emailRouter    from '../server/routes/emails.js'
import aiRouter       from '../server/routes/ai.js'

const app = express()

// CORS — allow deployed frontend URL
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || '',
    'http://localhost:5173',
  ],
  credentials: true,
}))

// Stripe webhooks need raw body — BEFORE express.json()
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }))

// JSON for all other routes
app.use(express.json())

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/stripe',   stripeRouter)
app.use('/api/webhooks', webhooksRouter)
app.use('/api/emails',   emailRouter)
app.use('/api',          aiRouter)

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('[API Error]', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

// ── Vercel Cron endpoints (replaces node-cron) ────────────────────────────
// Called by Vercel on schedule defined in vercel.json
import { createClient } from '@supabase/supabase-js'
import { sendWeeklyReminder, sendBirthdayEmail } from '../server/lib/email.js'

app.get('/api/cron/reminders', async (req, res) => {
  // Verify this is called by Vercel cron (not public)
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  const now = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)
  const { data: clients } = await supabase.from('clients').select(`
    client_id, coach_id,
    client:profiles!clients_client_id_fkey(full_name),
    coach:profiles!clients_coach_id_fkey(full_name)
  `)
  const { data: recentCheckIns } = await supabase
    .from('check_ins').select('client_id').gte('submitted_at', monday.toISOString())
  const submittedIds = new Set((recentCheckIns || []).map(c => c.client_id))
  let sent = 0
  for (const client of clients || []) {
    if (submittedIds.has(client.client_id)) continue
    const { data: authData } = await supabase.auth.admin.getUserById(client.client_id)
    const email = authData?.user?.email
    if (!email) continue
    const { data: program } = await supabase.from('programs').select('current_week')
      .eq('client_id', client.client_id).eq('is_active', true).single()
    await sendWeeklyReminder({
      clientEmail: email,
      clientName:  client.client?.full_name || 'there',
      weekNumber:  program?.current_week || 1,
      coachName:   client.coach?.full_name || 'Your coach',
    })
    sent++
  }
  res.json({ sent })
})

app.get('/api/cron/birthdays', async (req, res) => {
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
  const today = new Date()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const { data: profiles } = await supabase.from('profiles')
    .select('id, full_name, date_of_birth')
    .not('date_of_birth', 'is', null)
  let sent = 0
  for (const p of profiles || []) {
    const dob = new Date(p.date_of_birth)
    if (
      String(dob.getMonth() + 1).padStart(2, '0') === mm &&
      String(dob.getDate()).padStart(2, '0') === dd
    ) {
      const { data: authData } = await supabase.auth.admin.getUserById(p.id)
      const email = authData?.user?.email
      if (email) {
        await sendBirthdayEmail({ clientEmail: email, clientName: p.full_name || 'there' })
        sent++
      }
    }
  }
  res.json({ sent })
})

// Export for Vercel — do NOT call app.listen()
export default app
