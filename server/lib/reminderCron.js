import cron from 'node-cron'
import { createClient } from '@supabase/supabase-js'
import { sendWeeklyReminder } from './email.js'

export function startReminderCron() {
  // Every Monday at 9:00am (Europe/London)
  cron.schedule('0 9 * * 1', async () => {
    console.log('[Cron] Running weekly check-in reminder...')

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Get start of current week (Monday at midnight)
    const now = new Date()
    const monday = new Date(now)
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
    monday.setHours(0, 0, 0, 0)
    const weekStart = monday.toISOString()

    // Get all active clients with their profile and coach profile
    const { data: clients, error } = await supabase
      .from('clients')
      .select(`
        client_id,
        coach_id,
        client:profiles!clients_client_id_fkey(full_name),
        coach:profiles!clients_coach_id_fkey(full_name)
      `)

    if (error) {
      console.error('[Cron] Failed to fetch clients:', error)
      return
    }

    // Get check-ins submitted this week so we skip clients who already submitted
    const { data: recentCheckIns } = await supabase
      .from('check_ins')
      .select('client_id')
      .gte('submitted_at', weekStart)

    const submittedIds = new Set((recentCheckIns || []).map(c => c.client_id))

    let sent = 0
    for (const client of clients || []) {
      // Skip clients who already submitted this week
      if (submittedIds.has(client.client_id)) continue

      // Get client email via auth admin
      const { data: authData } = await supabase.auth.admin.getUserById(client.client_id)
      const email = authData?.user?.email
      if (!email) continue

      // Get current week number from their active program
      const { data: program } = await supabase
        .from('programs')
        .select('current_week')
        .eq('client_id', client.client_id)
        .eq('is_active', true)
        .single()

      await sendWeeklyReminder({
        clientEmail: email,
        clientName:  client.client?.full_name || 'there',
        weekNumber:  program?.current_week || 1,
        coachName:   client.coach?.full_name || 'Your coach',
      })

      sent++
    }

    console.log(`[Cron] Weekly reminders sent: ${sent}`)
  }, {
    timezone: 'Europe/London',
  })

  console.log('\uD83D\uDCE7 Weekly reminder cron scheduled (Mondays 9am London time)')
}
