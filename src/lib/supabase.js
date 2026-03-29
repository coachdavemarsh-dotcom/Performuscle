import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// ============================================================
// AUTH HELPERS
// ============================================================

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  // Manually create profile row (no DB trigger needed)
  if (data?.user && !error) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
    })
  }
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ============================================================
// PROFILE HELPERS
// ============================================================

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

// ============================================================
// CLIENT HELPERS
// ============================================================

export async function getCoachClients(coachId) {
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      profile:profiles!client_id(id, full_name, plan, check_in_day)
    `)
    .eq('coach_id', coachId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function getClientRecord(clientId) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('client_id', clientId)
    .single()
  return { data, error }
}

export async function getCoachClientProfile(clientId) {
  // Full profile for coach view — all onboarding fields
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', clientId)
    .single()
  return { data, error }
}

export async function getClientAllPrograms(clientId) {
  // All programs for a client with their sessions (coach view)
  const { data, error } = await supabase
    .from('programs')
    .select(`
      id, name, phase, is_active, current_week, total_weeks, goal_type,
      start_weight, target_weight, created_at,
      sessions(id, day_label, week_number, session_type, is_completed, completed_at,
        exercises(id, name, set_count))
    `)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  return { data, error }
}

// ============================================================
// PROGRAM HELPERS
// ============================================================

export async function getActiveProgram(clientId) {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  return { data, error }
}

export async function getCoachPrograms(coachId) {
  const { data, error } = await supabase
    .from('programs')
    .select(`
      *,
      client:profiles!client_id(id, full_name)
    `)
    .eq('coach_id', coachId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function updateProgram(programId, updates) {
  const { data, error } = await supabase
    .from('programs')
    .update(updates)
    .eq('id', programId)
    .select()
    .single()
  return { data, error }
}

// ============================================================
// SESSION HELPERS
// ============================================================

export async function getProgramSessions(programId) {
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      exercises(*, set_logs(*))
    `)
    .eq('program_id', programId)
    .order('week_number', { ascending: true })
  return { data, error }
}

export async function getTodaySession(clientId, programId, weekNumber) {
  const { data, error } = await supabase
    .from('sessions')
    .select(`*, exercises(*, set_logs(*))`)
    .eq('client_id', clientId)
    .eq('program_id', programId)
    .eq('week_number', weekNumber)
    .eq('is_completed', false)
    .order('created_at', { ascending: true })
    .limit(1)
    .single()
  return { data, error }
}

export async function getWeekSessions(clientId, programId, weekNumber) {
  const { data, error } = await supabase
    .from('sessions')
    .select(`*, exercises(*, set_logs(*))`)
    .eq('program_id', programId)
    .eq('week_number', weekNumber)
    .order('created_at', { ascending: true })
  return { data: data || [], error }
}

export async function upsertConditioningLog(log) {
  const { data, error } = await supabase
    .from('conditioning_logs')
    .upsert(log, { onConflict: 'session_id,client_id' })
    .select()
    .single()
  return { data, error }
}

export async function getConditioningLog(sessionId, clientId) {
  const { data, error } = await supabase
    .from('conditioning_logs')
    .select('*')
    .eq('session_id', sessionId)
    .eq('client_id', clientId)
    .maybeSingle()
  return { data, error }
}

export async function completeSession(sessionId) {
  const { data, error } = await supabase
    .from('sessions')
    .update({ is_completed: true, completed_at: new Date().toISOString() })
    .eq('id', sessionId)
    .select()
    .single()
  return { data, error }
}

// ============================================================
// SET LOG HELPERS
// ============================================================

export async function upsertSetLog(setLog) {
  const { data, error } = await supabase
    .from('set_logs')
    .upsert(setLog, { onConflict: 'exercise_id,set_number,client_id' })
    .select()
    .single()
  return { data, error }
}

export async function getSetLogs(exerciseId) {
  const { data, error } = await supabase
    .from('set_logs')
    .select('*')
    .eq('exercise_id', exerciseId)
    .order('set_number', { ascending: true })
  return { data, error }
}

// ============================================================
// CHECK-IN HELPERS
// ============================================================

export async function submitCheckIn(checkIn) {
  const { data, error } = await supabase
    .from('check_ins')
    .insert(checkIn)
    .select()
    .single()
  return { data, error }
}

export async function getClientCheckIns(clientId, limit = 10) {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('client_id', clientId)
    .order('submitted_at', { ascending: false })
    .limit(limit)
  return { data, error }
}

export async function getPendingCheckIns(coachId) {
  const { data, error } = await supabase
    .from('check_ins')
    .select(`
      *,
      client:profiles!client_id(id, full_name)
    `)
    .eq('coach_id', coachId)
    .is('coach_reply', null)
    .order('submitted_at', { ascending: false })
  return { data, error }
}

export async function replyToCheckIn(checkInId, reply, videoFeedbackUrl = null) {
  const update = { coach_reply: reply, replied_at: new Date().toISOString() }
  if (videoFeedbackUrl) update.video_feedback_url = videoFeedbackUrl
  const { data, error } = await supabase
    .from('check_ins')
    .update(update)
    .eq('id', checkInId)
    .select()
    .single()
  return { data, error }
}

// ============================================================
// FOODS DATABASE HELPERS
// ============================================================

/**
 * Search the coach's foods database.
 * Falls back to an empty array if the table doesn't exist yet.
 */
export async function searchFoods(query, limit = 20) {
  if (!query || query.trim().length < 1) return []
  const { data } = await supabase
    .from('foods')
    .select('id,name,serving_amount,serving_unit,kcal,protein_g,carbs_g,fat_g,fibre_g,net_carbs_g,category')
    .ilike('name', `%${query.trim()}%`)
    .order('name')
    .limit(limit)
  return data || []
}

export async function getAllFoodCategories() {
  const { data } = await supabase
    .from('foods')
    .select('category')
    .not('category', 'is', null)
  if (!data) return []
  return [...new Set(data.map(r => r.category))].sort()
}

export async function getFoodsByCategory(category) {
  const { data } = await supabase
    .from('foods')
    .select('*')
    .eq('category', category)
    .order('name')
  return data || []
}

export async function upsertFood(food) {
  const { data, error } = await supabase
    .from('foods')
    .upsert(food, { onConflict: 'name' })
    .select()
    .single()
  return { data, error }
}

export async function deleteFood(id) {
  const { error } = await supabase.from('foods').delete().eq('id', id)
  return { error }
}

// ============================================================
// NUTRITION HELPERS
// ============================================================

export async function getNutritionLog(clientId, date) {
  const { data, error } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('client_id', clientId)
    .eq('logged_date', date)
    .single()
  return { data, error }
}

export async function upsertNutritionLog(log) {
  const { data, error } = await supabase
    .from('nutrition_logs')
    .upsert(log, { onConflict: 'client_id,logged_date' })
    .select()
    .single()
  return { data, error }
}

export async function getActiveNutritionPlan(clientId) {
  const { data, error } = await supabase
    .from('nutrition_plans')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  return { data, error }
}

// ============================================================
// HABIT LOG HELPERS
// ============================================================

export async function getHabitLog(clientId, date) {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('client_id', clientId)
    .eq('logged_date', date)
    .single()
  return { data, error }
}

export async function upsertHabitLog(log) {
  const { data, error } = await supabase
    .from('habit_logs')
    .upsert(log, { onConflict: 'client_id,logged_date' })
    .select()
    .single()
  return { data, error }
}

export async function getHabitLogsRange(clientId, startDate, endDate) {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('client_id', clientId)
    .gte('logged_date', startDate)
    .lte('logged_date', endDate)
    .order('logged_date', { ascending: true })
  return { data, error }
}

// ============================================================
// MEASUREMENT HELPERS
// ============================================================

export async function getMeasurements(clientId, limit = 20) {
  const { data, error } = await supabase
    .from('measurements')
    .select('*')
    .eq('client_id', clientId)
    .order('measured_date', { ascending: false })
    .limit(limit)
  return { data, error }
}

export async function insertMeasurement(measurement) {
  const { data, error } = await supabase
    .from('measurements')
    .insert(measurement)
    .select()
    .single()
  return { data, error }
}

// ============================================================
// STORAGE HELPERS
// ============================================================

export async function uploadCheckInPhoto(clientId, weekNumber, position, file) {
  const ext = file.name.split('.').pop()
  const path = `${clientId}/${weekNumber}/${position}.${ext}`
  const { data, error } = await supabase.storage
    .from('check-in-photos')
    .upload(path, file, { upsert: true })
  if (error) return { url: null, error }
  const { data: { publicUrl } } = supabase.storage
    .from('check-in-photos')
    .getPublicUrl(path)
  return { url: publicUrl, error: null }
}

export async function uploadProgressPhoto(clientId, date, position, file) {
  const ext = file.name.split('.').pop()
  const path = `${clientId}/${date}/${position}.${ext}`
  const { data, error } = await supabase.storage
    .from('progress-photos')
    .upload(path, file, { upsert: true })
  if (error) return { url: null, error }
  const { data: { publicUrl } } = supabase.storage
    .from('progress-photos')
    .getPublicUrl(path)
  return { url: publicUrl, error: null }
}

// ============================================================
// EDUCATION PROGRESS HELPERS
// ============================================================

export async function getEducationProgress(clientId) {
  const { data, error } = await supabase
    .from('education_progress')
    .select('*')
    .eq('client_id', clientId)
  return { data, error }
}

export async function upsertEducationProgress(progress) {
  const { data, error } = await supabase
    .from('education_progress')
    .upsert(progress, { onConflict: 'client_id,course_id,module_id' })
    .select()
    .single()
  return { data, error }
}

// ============================================================
// TEMPLATE HELPERS
// ============================================================

export async function createProgramFromTemplate(programData, templateSessions) {
  console.log('[CPT] step 1 — inserting program', programData)

  // 1. Create program record
  const { data: program, error: progError } = await supabase
    .from('programs')
    .insert(programData)
    .select()
    .single()
  if (progError) {
    console.error('[CPT] program insert failed', progError)
    return { error: progError }
  }
  console.log('[CPT] program created', program.id)

  // 2. Insert all sessions (client_id required so RLS lets the client read their sessions)
  const sessionsToInsert = templateSessions.map(s => ({
    program_id: program.id,
    client_id: programData.client_id,
    day_label: s.day_label,
    week_number: s.week_number,
    session_type: s.session_type,
    is_completed: false,
  }))
  console.log('[CPT] step 2 — inserting', sessionsToInsert.length, 'sessions')
  const { data: createdSessions, error: sessionError } = await supabase
    .from('sessions')
    .insert(sessionsToInsert)
    .select()
  if (sessionError) {
    console.error('[CPT] sessions insert failed', sessionError)
    return { error: new Error(`Sessions failed: ${sessionError.message}`) }
  }
  console.log('[CPT] sessions created', createdSessions?.length)

  // 3. Match sessions by day_label + week_number and insert exercises
  const exercisesToInsert = []
  createdSessions.forEach(session => {
    const templateSession = templateSessions.find(
      s => s.day_label === session.day_label && s.week_number === session.week_number
    )
    if (!templateSession) return
    templateSession.exercises.forEach(ex => {
      exercisesToInsert.push({
        session_id: session.id,
        name: ex.name,
        set_count: ex.set_count,
        rep_scheme: ex.rep_range || ex.rep_scheme || null,   // templates use rep_range
        tempo: ex.tempo || null,
        rest_seconds: ex.rest_seconds || null,
        coach_note: ex.notes || ex.coach_note || null,       // templates use notes
        order_index: ex.order_index ?? 0,
        pairing: ex.superset_group || ex.pairing || null,    // templates use superset_group
        set_type: ex.set_type || 'standard',
      })
    })
  })

  console.log('[CPT] step 3 — inserting', exercisesToInsert.length, 'exercises')
  if (exercisesToInsert.length > 0) {
    const { error: exError } = await supabase
      .from('exercises')
      .insert(exercisesToInsert)
    if (exError) {
      console.error('[CPT] exercises insert failed', exError)
      return { error: new Error(`Exercises failed: ${exError.message}`) }
    }
  }
  console.log('[CPT] done — programme fully created')

  return {
    data: program,
    sessionCount: createdSessions?.length ?? 0,
    exerciseCount: exercisesToInsert.length,
    error: null,
  }
}

// ─── RECIPE LIBRARY ───────────────────────────────────────────────────────────

export async function getRecipes({ category, search, tags } = {}) {
  let query = supabase
    .from('recipes')
    .select('*')
    .eq('is_public', true)
    .order('name')

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  if (search) {
    query = query.ilike('name', `%${search}%`)
  }
  if (tags && tags.length > 0) {
    query = query.overlaps('tags', tags)
  }

  const { data, error } = await query
  return { data, error }
}

export async function getRecipe(id) {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function upsertRecipe(recipe) {
  const { data, error } = await supabase
    .from('recipes')
    .upsert(recipe)
    .select()
    .single()
  return { data, error }
}

export async function deleteRecipe(id) {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)
  return { error }
}

export async function addRecipeToNutritionLog({ clientId, date, mealType, recipe }) {
  // Build a nutrition log entry from a recipe
  const entry = {
    client_id: clientId,
    date,
    meal_type: mealType,
    name: recipe.name,
    serving: `1 serving (serves ${recipe.servings || 1})`,
    kcal: recipe.kcal || 0,
    protein_g: recipe.protein_g || 0,
    carbs_g: recipe.carbs_g || 0,
    fat_g: recipe.fat_g || 0,
    recipe_id: recipe.id,
    logged_at: new Date().toISOString(),
  }
  const { data, error } = await supabase
    .from('nutrition_logs')
    .insert(entry)
    .select()
    .single()
  return { data, error }
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

export async function insertNotification({ coachId, clientId, type, title, body, data = {} }) {
  const { error } = await supabase
    .from('notifications')
    .insert({ coach_id: coachId, client_id: clientId, type, title, body, data })
  return { error }
}

export async function getCoachNotifications(coachId, limit = 30) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*, profiles!notifications_client_id_fkey(full_name)')
    .eq('coach_id', coachId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data, error }
}

export async function getUnreadNotificationCount(coachId) {
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('coach_id', coachId)
    .eq('is_read', false)
  return { count: count || 0, error }
}

export async function markNotificationRead(id) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)
  return { error }
}

export async function markAllNotificationsRead(coachId) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('coach_id', coachId)
    .eq('is_read', false)
  return { error }
}

// ─── PROGRESS PHOTOS ──────────────────────────────────────────────────────────

export async function updateMeasurementPhotos(measurementId, photos) {
  const { data, error } = await supabase
    .from('measurements')
    .update({ photos })
    .eq('id', measurementId)
    .select()
    .single()
  return { data, error }
}

export async function getMeasurementsWithPhotos(clientId, limit = 20) {
  const { data, error } = await supabase
    .from('measurements')
    .select('*')
    .eq('client_id', clientId)
    .order('measured_date', { ascending: false })
    .limit(limit)
  return { data, error }
}

// ─── MEAL PLANS ───────────────────────────────────────────────────────────────

export async function getActiveMealPlan(clientId) {
  const { data, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return { data, error }
}

export async function upsertMealPlan({ coachId, clientId, name, days }) {
  // Deactivate any existing active plan
  await supabase
    .from('meal_plans')
    .update({ is_active: false })
    .eq('client_id', clientId)
    .eq('is_active', true)

  const { data, error } = await supabase
    .from('meal_plans')
    .insert({
      client_id: clientId,
      coach_id: coachId,
      name,
      days,
      is_active: true,
    })
    .select()
    .single()
  return { data, error }
}

// ─── MEAL PLAN TEMPLATES ──────────────────────────────────────────────────────

export async function getMealPlanTemplates(coachId) {
  const { data, error } = await supabase
    .from('meal_plan_templates')
    .select('*')
    .or(`coach_id.eq.${coachId},is_system.eq.true`)
    .order('is_system', { ascending: false })
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

export async function upsertMealPlanTemplate({ id, coachId, name, description, category, days }) {
  const payload = {
    coach_id:    coachId,
    name,
    description: description || '',
    category:    category || 'standard',
    days:        days || {},
    updated_at:  new Date().toISOString(),
  }
  if (id) {
    const { data, error } = await supabase
      .from('meal_plan_templates')
      .update(payload)
      .eq('id', id)
      .eq('coach_id', coachId)
      .select().single()
    return { data, error }
  }
  const { data, error } = await supabase
    .from('meal_plan_templates')
    .insert(payload)
    .select().single()
  return { data, error }
}

export async function deleteMealPlanTemplate(id, coachId) {
  const { error } = await supabase
    .from('meal_plan_templates')
    .delete()
    .eq('id', id)
    .eq('coach_id', coachId)
  return { error }
}

// ─── NUTRITION PLAN HELPERS (coach) ───────────────────────────────────────────

export async function upsertNutritionPlan({ clientId, coachId, dayTypes }) {
  // Deactivate any existing active plan
  await supabase
    .from('nutrition_plans')
    .update({ is_active: false })
    .eq('client_id', clientId)
    .eq('is_active', true)

  const { data, error } = await supabase
    .from('nutrition_plans')
    .insert({
      client_id: clientId,
      coach_id: coachId,
      day_types: dayTypes,
      is_active: true,
    })
    .select()
    .single()
  return { data, error }
}

export async function getNutritionLogsRange(clientId, startDate, endDate) {
  const { data, error } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('client_id', clientId)
    .gte('logged_date', startDate)
    .lte('logged_date', endDate)
    .order('logged_date', { ascending: false })
  return { data, error }
}
