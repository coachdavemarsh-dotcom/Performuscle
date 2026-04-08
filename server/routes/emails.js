import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '../middleware/auth.js'
import {
  sendCheckInNotification,
  sendCoachReplyNotification,
  sendWelcomeEmail,
  sendClientInviteEmail,
} from '../lib/email.js'
import { requireCoach } from '../middleware/auth.js'

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

export default router
