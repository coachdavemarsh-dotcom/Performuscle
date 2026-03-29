import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

/**
 * Middleware to verify Supabase JWT from Authorization header
 * Attaches req.user with the authenticated user's data
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' })
  }

  const token = authHeader.slice(7)

  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  req.user = user
  req.supabaseToken = token
  next()
}

/**
 * Middleware to require coach role
 */
export async function requireCoach(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' })

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_coach')
    .eq('id', req.user.id)
    .single()

  if (!profile?.is_coach) {
    return res.status(403).json({ error: 'Coach access required' })
  }

  next()
}
