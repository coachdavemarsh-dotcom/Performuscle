import { createClient } from '@supabase/supabase-js'

// Lazy init — created on first request so missing env vars don't crash startup
// Uses service role key (same as email routes) and server-safe options
let _supabase = null
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    )
  }
  return _supabase
}

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

  const { data: { user }, error } = await getSupabase().auth.getUser(token)

  if (error || !user) {
    console.error('[Auth] getUser failed:', error?.message || error, '| token prefix:', token?.slice(0, 20))
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

  const { data: profile } = await getSupabase()
    .from('profiles')
    .select('is_coach')
    .eq('id', req.user.id)
    .single()

  if (!profile?.is_coach) {
    return res.status(403).json({ error: 'Coach access required' })
  }

  next()
}
