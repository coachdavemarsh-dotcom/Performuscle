/**
 * Performuscle — Test Client Seeder
 * ─────────────────────────────────
 * Creates a fully onboarded test client and links them to your coach account.
 *
 * Usage:
 *   node scripts/seed-test-client.js
 *
 * Requirements:
 *   • VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env (already set)
 *   • SUPABASE_SERVICE_ROLE_KEY in .env (add this from Supabase → Settings → API)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ── Load .env manually (no dotenv dependency needed) ────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dir, '..', '.env')
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()]
    })
)

const SUPABASE_URL      = env.VITE_SUPABASE_URL
const ANON_KEY          = env.VITE_SUPABASE_ANON_KEY
const SERVICE_ROLE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !ANON_KEY) {
  console.error('❌  Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}

if (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY === 'your-service-role-key-here') {
  console.error(`
❌  SUPABASE_SERVICE_ROLE_KEY is not set in .env

To fix:
  1. Go to your Supabase project → Settings → API
  2. Copy the "service_role" secret key
  3. Paste it into .env as:
     SUPABASE_SERVICE_ROLE_KEY=eyJ...
  4. Re-run this script
`)
  process.exit(1)
}

// ── Admin client (bypasses RLS + email confirmation) ────────────────────────
const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Test client details ──────────────────────────────────────────────────────
const TEST_EMAIL    = 'testclient@performuscle.com'
const TEST_PASSWORD = 'TestClient123!'
const TEST_NAME     = 'Alex Thompson'

async function run() {
  console.log('\n🏋️  Performuscle Test Client Seeder\n')

  // ── 1. Find your coach account ────────────────────────────────────────────
  console.log('1. Looking for coach account...')
  const { data: coaches, error: coachErr } = await admin
    .from('profiles')
    .select('id, full_name')
    .eq('is_coach', true)
    .limit(1)

  if (coachErr || !coaches?.length) {
    console.error('❌  No coach account found in profiles table.')
    console.error('    Make sure you have logged in as coach at least once to create your profile.')
    process.exit(1)
  }

  const coach = coaches[0]
  console.log(`   ✅  Found coach: ${coach.full_name} (${coach.id})`)

  // ── 2. Create or retrieve test user ───────────────────────────────────────
  console.log(`\n2. Creating test client: ${TEST_EMAIL}`)

  let userId

  // Check if user already exists
  const { data: existingUsers } = await admin.auth.admin.listUsers()
  const existing = existingUsers?.users?.find(u => u.email === TEST_EMAIL)

  if (existing) {
    userId = existing.id
    console.log(`   ℹ️  User already exists (${userId}) — skipping auth creation`)
  } else {
    const { data: created, error: signUpErr } = await admin.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,  // skip email verification
    })

    if (signUpErr) {
      console.error('❌  Failed to create auth user:', signUpErr.message)
      process.exit(1)
    }

    userId = created.user.id
    console.log(`   ✅  Auth user created (${userId})`)
  }

  // ── 3. Upsert profile ─────────────────────────────────────────────────────
  console.log('\n3. Setting up client profile...')

  const dob = new Date()
  dob.setFullYear(dob.getFullYear() - 28)  // 28 years old
  const dobStr = dob.toISOString().slice(0, 10)

  const { error: profileErr } = await admin.from('profiles').upsert({
    id: userId,
    full_name: TEST_NAME,
    is_coach: false,
    plan: 'standard',
    check_in_day: 'monday',
    gender: 'male',
    date_of_birth: dobStr,
    height_cm: 180,
    current_weight: 85,
    target_weight: 80,
    goal_type: 'body_recomposition',
    training_experience: 'intermediate',
    activity_level: 'moderately_active',
    occupation: 'Software Developer',
    sleep_hours: 7,
    stress_level: 6,
    injuries: 'Minor right shoulder impingement — cleared for training',
    systolic_bp: 122,
    diastolic_bp: 78,
    address_line1: '42 Fitness Lane',
    city: 'London',
    postcode: 'SW1A 1AA',
    country: 'United Kingdom',
    onboarding_complete: true,
    created_at: new Date().toISOString(),
  }, { onConflict: 'id' })

  if (profileErr) {
    console.error('❌  Failed to upsert profile:', profileErr.message)
    process.exit(1)
  }
  console.log('   ✅  Profile created')

  // ── 4. Link client to coach ───────────────────────────────────────────────
  console.log('\n4. Linking client to your coach account...')

  const { error: clientErr } = await admin.from('clients').upsert({
    coach_id: coach.id,
    client_id: userId,
    plan: 'standard',
    monthly_price: 150,
    status: 'active',
    created_at: new Date().toISOString(),
  }, { onConflict: 'coach_id,client_id' })

  if (clientErr) {
    console.error('❌  Failed to create clients record:', clientErr.message)
    console.error('    (If this is a "unique constraint" error the link already exists — that is fine)')
  } else {
    console.log('   ✅  Client linked to coach')
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Test client ready!

  Name:     ${TEST_NAME}
  Email:    ${TEST_EMAIL}
  Password: ${TEST_PASSWORD}
  Coach:    ${coach.full_name}

Open http://localhost:5173/auth and log in
with the credentials above to test client features.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
}

run().catch(err => {
  console.error('❌  Unexpected error:', err.message)
  process.exit(1)
})
