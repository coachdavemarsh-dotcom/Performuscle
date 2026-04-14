import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import stripeRouter from './routes/stripe.js'
import webhooksRouter from './routes/webhooks.js'
import emailRouter from './routes/emails.js'
import aiRouter from './routes/ai.js'
import mealPlannerRouter from './routes/mealPlanner.js'
import { startReminderCron } from './lib/reminderCron.js'
import { startBirthdayCron } from './lib/birthdayCron.js'

const app = express()
const PORT = process.env.PORT || 3001
const isProd = process.env.NODE_ENV === 'production'

// ============================================================
// MIDDLEWARE
// ============================================================

// Secure HTTP headers
app.use(helmet())

// CORS — comma-separated ALLOWED_ORIGINS env var covers all frontends
// e.g. "https://performuscle.vercel.app,https://coachdavemarsh.net"
const allowedOrigins = [
  // Dev defaults
  'http://localhost:5173',
  'http://localhost:5175',
  'http://localhost:8080',
  // Production — set ALLOWED_ORIGINS in Railway with all your live domains
  ...(process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean),
]

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Netlify proxy, same-origin)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    console.warn('[CORS] Blocked origin:', origin)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

// Rate limiting — 100 requests per 15 minutes per IP
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please try again later' },
}))

// Stricter limit on auth-adjacent routes
app.use('/api/stripe', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please try again later' },
}))

// Stripe webhooks need raw body — register BEFORE express.json()
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }))

// JSON parsing for all other routes
app.use(express.json())

// ============================================================
// ROUTES
// ============================================================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/stripe', stripeRouter)
app.use('/api/webhooks', webhooksRouter)
app.use('/api/emails', emailRouter)
app.use('/api', aiRouter)
app.use('/api', mealPlannerRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` })
})

// Error handler — never expose stack traces or internal messages in production
app.use((err, req, res, next) => {
  console.error('[Server Error]', err)
  res.status(err.status || 500).json({
    error: isProd ? 'Internal server error' : (err.message || 'Internal server error'),
  })
})

// ============================================================
// START
// ============================================================

app.listen(PORT, () => {
  console.log(`🚀 Performuscle server running on port ${PORT}`)

  // Cron jobs — wrapped so a missing env var never crashes the server
  try { startReminderCron() } catch (e) { console.warn('⚠️  Reminder cron failed to start:', e.message) }
  try { startBirthdayCron() } catch (e) { console.warn('⚠️  Birthday cron failed to start:', e.message) }

  if (!process.env.STRIPE_SECRET_KEY)      console.warn('⚠️  STRIPE_SECRET_KEY not set')
  if (!process.env.STRIPE_WEBHOOK_SECRET)  console.warn('⚠️  STRIPE_WEBHOOK_SECRET not set')
  if (!process.env.VITE_SUPABASE_URL)      console.warn('⚠️  VITE_SUPABASE_URL not set')
  if (!process.env.RESEND_API_KEY)         console.warn('⚠️  RESEND_API_KEY not set')
  if (!process.env.ANTHROPIC_API_KEY)      console.warn('⚠️  ANTHROPIC_API_KEY not set')
})
