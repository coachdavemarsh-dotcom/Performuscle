import cron from 'node-cron'
import { createClient } from '@supabase/supabase-js'
import { sendBirthdayEmail } from './email.js'

export function startBirthdayCron() {
  // Runs every day at 8am London time
  cron.schedule('0 8 * * *', async () => {
    console.log('[BirthdayCron] Checking for birthdays today...')

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const today = new Date()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day   = String(today.getDate()).padStart(2, '0')
    const mmdd  = `${month}-${day}`

    // Find all profiles where the MM-DD portion of date_of_birth matches today
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, date_of_birth')
      .not('date_of_birth', 'is', null)

    if (error) {
      console.error('[BirthdayCron] Failed to fetch profiles:', error)
      return
    }

    const birthdays = (profiles || []).filter(p => {
      if (!p.date_of_birth) return false
      const dob = p.date_of_birth.slice(5, 10) // MM-DD
      return dob === mmdd
    })

    console.log(`[BirthdayCron] Found ${birthdays.length} birthday(s) today`)

    for (const profile of birthdays) {
      // Get auth user email
      const { data: authData } = await supabase.auth.admin.getUserById(profile.id)
      const email = authData?.user?.email
      if (!email) continue

      // Send birthday email
      await sendBirthdayEmail({
        clientEmail: email,
        clientName: profile.full_name || 'there',
      })

      // Create an in-app notification
      await supabase.from('notifications').insert({
        user_id: profile.id,
        type: 'birthday',
        title: '🎉 Happy Birthday!',
        message: `Happy birthday, ${profile.full_name?.split(' ')[0] || 'there'}! Wishing you a fantastic day. Keep crushing your goals! 🎂`,
        read: false,
        created_at: new Date().toISOString(),
      }).select()

      console.log(`[BirthdayCron] ✓ Birthday processed for ${profile.full_name}`)
    }
  }, { timezone: 'Europe/London' })

  console.log('🎂 Birthday cron scheduled (daily 8am London time)')
}
