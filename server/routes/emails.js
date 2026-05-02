import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'
import { requireAuth, requireCoach } from '../middleware/auth.js'
import {
  sendCheckInNotification,
  sendCoachReplyNotification,
  sendWelcomeEmail,
  sendClientInviteEmail,
  sendCalculatorResults,
} from '../lib/email.js'
import {
  build1rmResultsHtml,
  buildBfResultsHtml,
  buildRolResultsHtml,
  buildStructuralBalanceResultsHtml,
} from '../lib/emailTemplates.js'

const router = Router()

// Service-role Supabase client to query emails without RLS
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// ─── POST /api/emails/checkin-submitted ──────────────────────────────────────
// Called by client after submitting a check-in
// Body: { clientId, weekNumber, biofeedbackScore, bodyWeight, urgency, lowestAreasNote }
router.post('/checkin-submitted', requireAuth, async (req, res) => {
  try {
    const { clientId, weekNumber, biofeedbackScore, bodyWeight, urgency, lowestAreasNote } = req.body

    // Get client profile + their coach's profile
    const { data: clientData } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', clientId)
      .single()

    const { data: clientRow } = await supabaseAdmin
      .from('clients')
      .select('coach_id')
      .eq('client_id', clientId)
      .single()

    if (!clientRow?.coach_id) {
      return res.json({ sent: false, reason: 'No coach assigned' })
    }

    const { data: coachData } = await supabaseAdmin.auth.admin.getUserById(clientRow.coach_id)

    const coachEmail = coachData?.user?.email
    if (!coachEmail) {
      return res.json({ sent: false, reason: 'Coach email not found' })
    }

    await sendCheckInNotification({
      coachEmail,
      clientName:      clientData?.full_name || 'A client',
      weekNumber,
      biofeedbackScore,
      bodyWeight,
      urgency,
      lowestAreasNote,
    })

    res.json({ sent: true })
  } catch (err) {
    console.error('[Email Route] checkin-submitted:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/emails/coach-replied ─────────────────────────────────────────
// Called by coach after sending a check-in reply
// Body: { clientId, coachId, weekNumber, replyText }
router.post('/coach-replied', requireAuth, async (req, res) => {
  try {
    const { clientId, coachId, weekNumber, replyText } = req.body

    // Resolve coachId — fall back to the authenticated user if not provided
    const resolvedCoachId = coachId || req.user.id

    const [clientAuth, coachProfile, clientProfile] = await Promise.all([
      supabaseAdmin.auth.admin.getUserById(clientId),
      supabaseAdmin.from('profiles').select('full_name').eq('id', resolvedCoachId).single(),
      supabaseAdmin.from('profiles').select('full_name').eq('id', clientId).single(),
    ])

    const clientEmail = clientAuth?.data?.user?.email
    if (!clientEmail) {
      return res.json({ sent: false, reason: 'Client email not found' })
    }

    await sendCoachReplyNotification({
      clientEmail,
      clientName: clientProfile?.data?.full_name || 'there',
      coachName:  coachProfile?.data?.full_name  || 'Your coach',
      weekNumber,
      replyText,
    })

    res.json({ sent: true })
  } catch (err) {
    console.error('[Email Route] coach-replied:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/emails/welcome ────────────────────────────────────────────────
// Called by coach to send a welcome email to a new client
// Body: { clientId, coachId }
router.post('/welcome', requireAuth, async (req, res) => {
  try {
    const { clientId, coachId } = req.body

    const resolvedCoachId = coachId || req.user.id

    const [clientAuth, coachProfile, clientProfile] = await Promise.all([
      supabaseAdmin.auth.admin.getUserById(clientId),
      supabaseAdmin.from('profiles').select('full_name').eq('id', resolvedCoachId).single(),
      supabaseAdmin.from('profiles').select('full_name').eq('id', clientId).single(),
    ])

    const clientEmail = clientAuth?.data?.user?.email
    if (!clientEmail) {
      return res.json({ sent: false, reason: 'Client email not found' })
    }

    await sendWelcomeEmail({
      clientEmail,
      clientName: clientProfile?.data?.full_name || 'there',
      coachName:  coachProfile?.data?.full_name  || 'Your coach',
    })

    res.json({ sent: true })
  } catch (err) {
    console.error('[Email Route] welcome:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/emails/invite-client ─────────────────────────────────────────
// Called by coach to invite a new client by email
// Body: { email, fullName }
router.post('/invite-client', requireAuth, requireCoach, async (req, res) => {
  try {
    const { email, fullName } = req.body
    if (!email || !fullName) {
      return res.status(400).json({ error: 'email and fullName are required' })
    }

    // Get coach's name for the email
    const { data: coachProfile } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', req.user.id)
      .single()

    const coachName = coachProfile?.full_name || 'Your coach'
    const redirectTo = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/onboarding`

    // Generate a Supabase invite link — sends no email itself, gives us the magic URL
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email,
      options: {
        data: { coach_id: req.user.id, full_name: fullName, invited: true },
        redirectTo,
      },
    })

    if (linkError) {
      console.error('[Invite] generateLink error:', linkError)
      return res.status(500).json({ error: linkError.message })
    }

    const inviteUrl = linkData?.properties?.action_link
    if (!inviteUrl) {
      return res.status(500).json({ error: 'Failed to generate invite link' })
    }

    // Send our branded invite email
    await sendClientInviteEmail({
      clientEmail: email,
      clientName: fullName,
      coachName,
      inviteUrl,
    })

    res.json({ sent: true, email })
  } catch (err) {
    console.error('[Email Route] invite-client:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── GET /api/emails/pending-invites ────────────────────────────────────────
// Returns users invited by this coach who haven't completed onboarding yet
router.get('/pending-invites', requireAuth, requireCoach, async (req, res) => {
  try {
    // Fetch all auth users (up to 1000 — plenty for a coaching business)
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000,
      page: 1,
    })
    if (listError) throw listError

    // Filter to those invited by this coach
    const invited = users.filter(u =>
      u.user_metadata?.invited === true &&
      u.user_metadata?.coach_id === req.user.id
    )

    if (!invited.length) return res.json({ pending: [] })

    // Find which invited users have already completed onboarding (in clients table)
    const { data: existingClients } = await supabaseAdmin
      .from('clients')
      .select('client_id')
      .eq('coach_id', req.user.id)

    const onboarded = new Set((existingClients || []).map(c => c.client_id))

    const pending = invited
      .filter(u => !onboarded.has(u.id))
      .map(u => ({
        id:        u.id,
        email:     u.email,
        fullName:  u.user_metadata?.full_name || null,
        invitedAt: u.created_at,
      }))
      .sort((a, b) => new Date(b.invitedAt) - new Date(a.invitedAt))

    res.json({ pending })
  } catch (err) {
    console.error('[Email Route] pending-invites:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/emails/resend-invite ─────────────────────────────────────────
// Called by coach to resend the invite link to an existing client
// Body: { clientId }
router.post('/resend-invite', requireAuth, requireCoach, async (req, res) => {
  try {
    const { clientId } = req.body
    if (!clientId) {
      return res.status(400).json({ error: 'clientId is required' })
    }

    // Look up client's auth record (email) + profile (name) + coach name
    const [clientAuth, clientProfile, coachProfile] = await Promise.all([
      supabaseAdmin.auth.admin.getUserById(clientId),
      supabaseAdmin.from('profiles').select('full_name').eq('id', clientId).single(),
      supabaseAdmin.from('profiles').select('full_name').eq('id', req.user.id).single(),
    ])

    const clientEmail = clientAuth?.data?.user?.email
    if (!clientEmail) {
      return res.status(404).json({ error: 'Client email not found' })
    }

    const clientName = clientProfile?.data?.full_name || 'there'
    const coachName  = coachProfile?.data?.full_name  || 'Your coach'
    const redirectTo = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/onboarding`

    // Generate a fresh login link.
    // type:'invite' fails with email_exists for already-registered users,
    // so we use type:'magiclink' which works for any existing account.
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: clientEmail,
      options: { redirectTo },
    })

    if (linkError) {
      console.error('[Resend Invite] generateLink error:', linkError)
      return res.status(500).json({ error: linkError.message })
    }

    const inviteUrl = linkData?.properties?.action_link
    if (!inviteUrl) {
      return res.status(500).json({ error: 'Failed to generate invite link' })
    }

    await sendClientInviteEmail({ clientEmail, clientName, coachName, inviteUrl })

    res.json({ sent: true, email: clientEmail })
  } catch (err) {
    console.error('[Email Route] resend-invite:', err)
    res.status(500).json({ error: err.message })
  }
})

// ─── POST /api/emails/calculator-results ─────────────────────────────────────
// Public — no auth required. Called from static calculator pages.
// Body: { name, email, calculator, results }
// calculator: '1rm' | 'body-composition-bf' | 'body-composition-rol' | 'structural-balance'
router.post('/calculator-results', async (req, res) => {
  try {
    const { name, email, calculator, results } = req.body

    if (!name || !email || !calculator || !results) {
      return res.status(400).json({ error: 'name, email, calculator, and results are required' })
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' })
    }

    const CALCULATORS = {
      '1rm':                   '1RM Calculator',
      'body-composition-bf':   'Body Composition (Body Fat %)',
      'body-composition-rol':  'Body Composition (Rate of Loss)',
      'structural-balance':    'Structural Balance Calculator',
    }

    const calculatorName = CALCULATORS[calculator]
    if (!calculatorName) {
      return res.status(400).json({ error: 'Unknown calculator type' })
    }

    let resultsHtml = ''
    if (calculator === '1rm') {
      resultsHtml = build1rmResultsHtml(results)
    } else if (calculator === 'body-composition-bf') {
      resultsHtml = buildBfResultsHtml(results)
    } else if (calculator === 'body-composition-rol') {
      resultsHtml = buildRolResultsHtml(results)
    } else if (calculator === 'structural-balance') {
      resultsHtml = buildStructuralBalanceResultsHtml(results)
    }

    const coachEmail = process.env.COACH_EMAIL || null

    await sendCalculatorResults({
      clientEmail: email,
      clientName: name,
      calculatorName,
      resultsHtml,
      coachEmail,
    })

    res.json({ sent: true })
  } catch (err) {
    console.error('[Email Route] calculator-results:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router
