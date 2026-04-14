import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const router = express.Router()

// ─── Supabase admin client (service role — bypasses RLS) ─────────────────────
function getSupabase() {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

// ─── GET /api/meal-planner/recipes ───────────────────────────────────────────
// Returns all public recipes with full ingredient lists.
// Called by both Performuscle wizard and the standalone site.
router.get('/meal-planner/recipes', async (req, res) => {
  const supabase = getSupabase()
  if (!supabase) {
    // Graceful fallback — no recipes available without DB config
    return res.json({ recipes: [] })
  }

  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('id, name, category, tags, kcal, protein_g, carbs_g, fat_g, servings, ingredients')
      .eq('is_public', true)
      .order('category')

    if (error) throw error
    res.json({ recipes: data || [] })
  } catch (err) {
    console.error('[MealPlanner] Recipes fetch error:', err.message)
    res.json({ recipes: [] }) // non-fatal — generate without library
  }
})

// ─── Format recipes for the AI prompt ────────────────────────────────────────
function buildRecipeSection(recipes, dietaryFilters = []) {
  if (!recipes?.length) return null

  // Filter out recipes that violate dietary requirements
  const excludeTags = []
  if (dietaryFilters.includes('dairy-free'))  excludeTags.push('contains-dairy')
  if (dietaryFilters.includes('vegan'))        excludeTags.push('contains-meat', 'contains-dairy', 'contains-eggs')
  if (dietaryFilters.includes('vegetarian'))   excludeTags.push('contains-meat')
  if (dietaryFilters.includes('nut-free'))     excludeTags.push('contains-nuts')
  if (dietaryFilters.includes('gluten-free'))  excludeTags.push('contains-gluten')
  if (dietaryFilters.includes('egg-free'))     excludeTags.push('contains-eggs')

  const filtered = recipes.filter(r => {
    const tags = r.tags || []
    return !excludeTags.some(ex => tags.includes(ex))
  })

  if (!filtered.length) return null

  // Drop recipes without macro data — AI can't use them accurately
  const withMacros = filtered.filter(r => r.kcal && r.protein_g != null && r.carbs_g != null && r.fat_g != null)

  if (!withMacros.length) return null

  // Group by category for a cleaner prompt
  const byCategory = {}
  for (const r of withMacros) {
    const cat = r.category || 'other'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(r)
  }

  const lines = [
    `RECIPE LIBRARY — USE THESE AS YOUR PRIMARY MEAL SOURCE`,
    `Assign at least 65% of meals directly from this library. Scale portion sizes to hit the meal's macro target.`,
    `When using a library recipe set source="library", recipe_name=the recipe name, and list the actual ingredients with scaled amounts.`,
    `Only generate a fresh meal when no library recipe fits (wrong category, dietary conflict, or already used twice this week).`,
    `When generating fresh meals: make them flavourful and varied — use herbs, spices, sauces. NO plain chicken + rice.`,
    ``,
  ]

  for (const [cat, recs] of Object.entries(byCategory)) {
    lines.push(`${cat.toUpperCase()} RECIPES:`)
    for (const r of recs) {
      const ingredients = Array.isArray(r.ingredients)
        ? r.ingredients.filter(i => i && !i.match(/^\s*$/)).slice(0, 8).join(', ')
        : ''
      lines.push(`  • "${r.name}" — ${r.kcal}kcal/serving | P:${r.protein_g}g C:${r.carbs_g}g F:${r.fat_g}g`)
      if (ingredients) lines.push(`    Ingredients: ${ingredients}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

// ─── POST /api/meal-planner/generate ─────────────────────────────────────────
router.post('/meal-planner/generate', async (req, res) => {
  const { macros, mealsPerDay, trainingDays, trainingTime, dietaryFilters } = req.body

  if (!macros?.kcal || !macros?.protein_g || !macros?.carbs_g || !macros?.fat_g) {
    return res.status(400).json({ error: 'macros required: kcal, protein_g, carbs_g, fat_g' })
  }
  if (!mealsPerDay || mealsPerDay < 2 || mealsPerDay > 6) {
    return res.status(400).json({ error: 'mealsPerDay must be 2–6' })
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'AI not configured — set ANTHROPIC_API_KEY' })
  }

  // ── Fetch recipe library from Supabase ──────────────────────────────────────
  let recipes = []
  const supabase = getSupabase()
  if (supabase) {
    try {
      const { data } = await supabase
        .from('recipes')
        .select('id, name, category, tags, kcal, protein_g, carbs_g, fat_g, servings, ingredients')
        .eq('is_public', true)
        .order('category')
      recipes = data || []
    } catch { /* non-fatal */ }
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const trainingSet = new Set((trainingDays || []).map(d => d.toLowerCase()))
  const dayTypeMap = Object.fromEntries(
    DAYS.map(d => [d, trainingSet.has(d.toLowerCase()) ? 'training' : 'rest'])
  )

  // ── Dietary filter text ─────────────────────────────────────────────────────
  const filterDescriptions = {
    'dairy-free':   'NO dairy: no milk, cheese, yoghurt, butter, cream, or whey protein',
    'vegan':        'STRICTLY vegan — no animal products whatsoever (no meat, fish, eggs, dairy, honey)',
    'vegetarian':   'vegetarian — no meat or fish (eggs and dairy OK unless dairy-free also selected)',
    'gluten-free':  'STRICTLY gluten-free — no wheat, barley, rye, or regular oats',
    'nut-free':     'NO nuts or nut butters of any kind',
    'egg-free':     'NO eggs or egg-containing products',
    'high-protein': 'high-protein — protein must be at least 35% of total calories',
    'low-carb':     'low-carb — total daily carbs must stay below 100g',
  }
  const activeFilters = (dietaryFilters || []).map(f => filterDescriptions[f]).filter(Boolean)
  const filterSection = activeFilters.length > 0
    ? `DIETARY REQUIREMENTS — STRICTLY ENFORCE:\n${activeFilters.map(f => `• ${f}`).join('\n')}`
    : 'No dietary restrictions.'

  // ── Training day structure ──────────────────────────────────────────────────
  const trainingDayStructure = trainingTime === 'am'
    ? `Morning training — meal 1 = Pre-Workout, meal 2 = Post-Workout, rest split evenly:
  • Pre-workout:  ~30% daily carbs | ~20% protein | ~15% fat  (energy for the session)
  • Post-workout: ~35% daily carbs | ~30% protein | ~15% fat  (recovery)
  • Other meals:  split remaining macros, favour protein + healthy fats`
    : `Evening training — second-to-last = Pre-Workout, last = Post-Workout:
  • Early meals:  split remaining macros, favour protein + healthy fats
  • Pre-workout:  ~30% daily carbs | ~20% protein | ~15% fat
  • Post-workout: ~35% daily carbs | ~30% protein | ~15% fat`

  // ── Recipe library section ──────────────────────────────────────────────────
  const recipeSection = buildRecipeSection(recipes, dietaryFilters || [])
    || 'No recipe library available — generate all meals from scratch using varied, flavourful whole-food meals.'

  // ── Prompts ─────────────────────────────────────────────────────────────────
  const systemPrompt = `You are an expert sports nutritionist creating practical, flavourful weekly meal plans.

Core rules:
- Prioritise the provided recipe library — at least 65% of meals must come from it
- When using a library recipe: scale ingredients proportionally to hit the meal's macro target
- For any AI-generated meals: make them interesting — use herbs, spices, sauces, varied proteins. NO plain "chicken + rice"
- Hit macro targets within 10% per meal
- Keep food names short and clear
- Limit each meal to 3–5 ingredients/food items
- Calculate mealTotals by summing foods; calculate dayTotals by summing meals
- Return ONLY valid JSON — no markdown, no code fences, no extra text`

  const userPrompt = `Generate a complete 7-day meal plan.

DAILY MACRO TARGETS:
• ${macros.kcal} kcal | ${macros.protein_g}g protein | ${macros.carbs_g}g carbs | ${macros.fat_g}g fat

MEALS PER DAY: ${mealsPerDay}

TRAINING SCHEDULE:
• Training days: ${trainingDays?.length > 0 ? trainingDays.join(', ') : 'None — all rest days'}
• Training time: ${trainingTime === 'am' ? 'Morning (AM)' : 'Evening (PM)'}

TRAINING DAY MEAL STRUCTURE:
${trainingDayStructure}

REST/MODERATE DAYS: Distribute macros evenly — protein and healthy fat focused.

${filterSection}

${recipeSection}

WEEK SCHEDULE:
${DAYS.map(d => `• ${d}: ${dayTypeMap[d]} day`).join('\n')}

Return exactly this JSON structure (no markdown, no code fences):
{
  "weekPlan": {
    "Monday": {
      "dayType": "training",
      "dayTotals": {"kcal": 0, "protein_g": 0, "carbs_g": 0, "fat_g": 0},
      "meals": [
        {
          "name": "Pre-Workout Breakfast",
          "mealType": "pre-workout",
          "foods": [
            {"name": "Rolled Oats", "amount": "80g", "kcal": 304, "protein_g": 10, "carbs_g": 54, "fat_g": 6},
            {"name": "Banana", "amount": "1 medium (120g)", "kcal": 107, "protein_g": 1, "carbs_g": 27, "fat_g": 0}
          ],
          "mealTotals": {"kcal": 411, "protein_g": 11, "carbs_g": 81, "fat_g": 6},
          "source": "ai",
          "recipe_id": null,
          "recipe_name": null
        }
      ]
    },
    "Tuesday": {},
    "Wednesday": {},
    "Thursday": {},
    "Friday": {},
    "Saturday": {},
    "Sunday": {}
  },
  "shoppingList": {
    "Protein & Meat": ["Chicken Breast (1.2kg)"],
    "Fish & Seafood": ["Salmon Fillets (600g)"],
    "Dairy & Eggs": ["Eggs x18"],
    "Grains & Carbs": ["Rolled Oats (800g)", "Sweet Potato (1.5kg)"],
    "Produce": ["Spinach (400g)", "Broccoli (600g)"],
    "Fats & Oils": ["Extra Virgin Olive Oil (1 bottle)"],
    "Condiments & Spices": ["Garlic (1 bulb)", "Soy Sauce"],
    "Supplements & Other": []
  }
}`

  // ── SSE setup — keeps connection alive through any proxy/timeout ────────────
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  // Send a heartbeat comment every 8 s so proxies don't close the connection
  const heartbeat = setInterval(() => {
    if (!res.writableEnded) res.write(': ping\n\n')
  }, 8000)

  // Clean up if the client disconnects early
  req.on('close', () => clearInterval(heartbeat))

  function sendResult(payload) {
    clearInterval(heartbeat)
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify(payload)}\n\n`)
      res.end()
    }
  }

  try {
    // Stream tokens from Anthropic so the connection stays warm
    const stream = await anthropic.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 12000,
      stream:     true,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userPrompt }],
    })

    let raw = ''
    let stopReason = null
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        raw += event.delta.text
      }
      if (event.type === 'message_delta' && event.delta?.stop_reason) {
        stopReason = event.delta.stop_reason
      }
    }

    console.log(`[MealPlanner] Generation complete. stop_reason=${stopReason} length=${raw.length}`)

    if (stopReason === 'max_tokens') {
      console.error('[MealPlanner] Hit max_tokens — output truncated')
      return sendResult({ error: 'Plan was too long to generate — try fewer meals per day or contact support.' })
    }

    // Robust JSON extraction — handle prose before/after, code fences, etc.
    let cleaned = raw.trim()

    // Strip code fences (```json ... ``` or ``` ... ```)
    const fenceMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
    if (fenceMatch) {
      cleaned = fenceMatch[1].trim()
    }

    // If still not starting with {, find the first { and last }
    if (!cleaned.startsWith('{')) {
      const start = cleaned.indexOf('{')
      const end   = cleaned.lastIndexOf('}')
      if (start !== -1 && end !== -1 && end > start) {
        cleaned = cleaned.slice(start, end + 1)
      }
    }

    let result
    try {
      result = JSON.parse(cleaned)
    } catch {
      console.error('[MealPlanner] JSON parse error. stop_reason:', stopReason, 'Raw tail:', raw.slice(-200))
      return sendResult({ error: 'AI returned invalid JSON — please try again' })
    }

    if (!result.weekPlan) {
      return sendResult({ error: 'AI returned unexpected format — please try again' })
    }

    sendResult(result)
  } catch (err) {
    console.error('[MealPlanner] Generation error:', err.message)
    sendResult({ error: err.message })
  }
})

// ─── Build meal plan HTML email ───────────────────────────────────────────────
function buildMealPlanEmail({ name, weekPlan, shoppingList, macros, mealsPerDay, trainingDays, dietaryFilters, recipeMap = {} }) {
  const DAYS      = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const firstName = (name?.split(' ')[0] || 'there').replace(/[<>]/g, '')
  const trainingSet = new Set((trainingDays || []).map(d => d.toLowerCase()))
  const filters   = (dietaryFilters || []).join(', ')

  const mealTypeColour = {
    'pre-workout':  '#f59e0b',
    'post-workout': '#00C896',
    'breakfast':    '#6366f1',
    'lunch':        '#3b82f6',
    'dinner':       '#8b5cf6',
    'snack':        '#ec4899',
  }

  const SHOP_ICONS = {
    'Protein & Meat': '🥩', 'Fish & Seafood': '🐟', 'Dairy & Eggs': '🥚',
    'Grains & Carbs': '🌾', 'Produce': '🥦', 'Fats & Oils': '🫒',
    'Condiments & Spices': '🧂', 'Supplements & Other': '💊',
  }

  // ── Render one meal card ────────────────────────────────────────────────────
  function renderMeal(meal) {
    const mt     = meal.mealTotals || {}
    const colour = mealTypeColour[meal.mealType] || '#00C896'
    const recipe = meal.recipe_name ? recipeMap[meal.recipe_name.toLowerCase()] : null
    const method = recipe?.method || null
    const img    = recipe?.image_url || null

    const foodRows = (meal.foods || []).map(f => `
      <tr>
        <td style="padding:6px 8px 6px 0;font-size:12px;color:#e5e7eb;border-bottom:1px solid #1e1e2e;">${f.name}</td>
        <td style="padding:6px 4px;font-size:11px;color:#9ca3af;text-align:center;border-bottom:1px solid #1e1e2e;white-space:nowrap;">${f.amount}</td>
        <td style="padding:6px 4px;font-size:12px;color:#f5f6fa;text-align:center;border-bottom:1px solid #1e1e2e;font-weight:600;">${f.kcal}</td>
        <td style="padding:6px 4px;font-size:12px;color:#818cf8;text-align:center;border-bottom:1px solid #1e1e2e;font-weight:600;">${f.protein_g}g</td>
        <td style="padding:6px 4px;font-size:12px;color:#f59e0b;text-align:center;border-bottom:1px solid #1e1e2e;font-weight:600;">${f.carbs_g}g</td>
        <td style="padding:6px 4px 6px 0;font-size:12px;color:#34d399;text-align:center;border-bottom:1px solid #1e1e2e;font-weight:600;">${f.fat_g}g</td>
      </tr>`).join('')

    const methodHtml = method ? `
      <tr><td colspan="2">
        <div style="margin-top:12px;padding:12px;background:#060608;border-left:3px solid #00C896;border-radius:0 6px 6px 0;">
          <div style="font-size:10px;font-weight:700;color:#00C896;letter-spacing:0.08em;margin-bottom:6px;">HOW TO MAKE IT</div>
          <div style="font-size:12px;color:#9ca3af;line-height:1.6;">${method}</div>
        </div>
      </td></tr>` : ''

    const imageHtml = img ? `
      <tr><td colspan="2" style="padding-bottom:10px;">
        <img src="${img}" alt="${meal.recipe_name || meal.name}" width="100%" style="display:block;border-radius:6px;max-height:180px;object-fit:cover;" />
      </td></tr>` : ''

    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0f0f18;border-radius:8px;margin-bottom:10px;overflow:hidden;">
        <!-- Meal header -->
        <tr>
          <td width="4" style="background:${colour};border-radius:8px 0 0 8px;">&nbsp;</td>
          <td style="padding:12px 14px;">
            ${imageHtml}
            <div style="font-size:14px;font-weight:700;color:#f5f6fa;margin-bottom:3px;">${meal.name}</div>
            ${meal.recipe_name ? `<div style="font-size:10px;color:#00C896;font-weight:700;letter-spacing:0.05em;margin-bottom:4px;">📖 ${meal.recipe_name}</div>` : ''}
            <div style="font-size:11px;color:#9ca3af;">${mt.kcal} kcal &nbsp;·&nbsp; <span style="color:#818cf8;">P ${mt.protein_g}g</span> &nbsp;·&nbsp; <span style="color:#f59e0b;">C ${mt.carbs_g}g</span> &nbsp;·&nbsp; <span style="color:#34d399;">F ${mt.fat_g}g</span></div>
            <!-- Ingredients table -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:10px;">
              <thead>
                <tr>
                  <th style="font-size:10px;color:#5e5e70;text-align:left;padding-bottom:5px;border-bottom:1px solid #2a2a3a;">Ingredient</th>
                  <th style="font-size:10px;color:#5e5e70;text-align:center;padding-bottom:5px;border-bottom:1px solid #2a2a3a;">Amount</th>
                  <th style="font-size:10px;color:#5e5e70;text-align:center;padding-bottom:5px;border-bottom:1px solid #2a2a3a;">kcal</th>
                  <th style="font-size:10px;color:#818cf8;text-align:center;padding-bottom:5px;border-bottom:1px solid #2a2a3a;">P</th>
                  <th style="font-size:10px;color:#f59e0b;text-align:center;padding-bottom:5px;border-bottom:1px solid #2a2a3a;">C</th>
                  <th style="font-size:10px;color:#34d399;text-align:center;padding-bottom:5px;border-bottom:1px solid #2a2a3a;">F</th>
                </tr>
              </thead>
              <tbody>${foodRows}</tbody>
            </table>
            ${methodHtml}
          </td>
        </tr>
      </table>`
  }

  // ── Render one day ──────────────────────────────────────────────────────────
  function renderDay(day) {
    const plan = weekPlan?.[day]
    if (!plan) return ''
    const isTraining = trainingSet.has(day.toLowerCase())
    const t          = plan.dayTotals || {}
    const border     = isTraining ? '#00C896' : '#2a2a3a'
    const headerBg   = isTraining ? '#0a1a14' : '#0a0a12'

    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1.5px solid ${border};border-radius:12px;margin-bottom:20px;border-collapse:separate;border-spacing:0;">
        <!-- Day header -->
        <tr>
          <td style="background:${headerBg};padding:12px 16px;border-bottom:1px solid ${border};border-radius:11px 11px 0 0;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <span style="font-size:15px;font-weight:900;color:#f5f6fa;letter-spacing:0.06em;">${day.toUpperCase()}</span>
                  ${isTraining
                    ? '&nbsp;&nbsp;<span style="font-size:10px;color:#00C896;font-weight:700;letter-spacing:0.05em;">⚡ TRAINING DAY</span>'
                    : '&nbsp;&nbsp;<span style="font-size:10px;color:#5e5e70;letter-spacing:0.05em;">REST DAY</span>'}
                </td>
                <td align="right" style="font-size:11px;color:#9ca3af;white-space:nowrap;">
                  ${t.kcal} kcal &nbsp;·&nbsp;
                  <span style="color:#818cf8;">P ${t.protein_g}g</span> &nbsp;
                  <span style="color:#f59e0b;">C ${t.carbs_g}g</span> &nbsp;
                  <span style="color:#34d399;">F ${t.fat_g}g</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Day meals -->
        <tr>
          <td style="padding:14px 16px;">
            ${(plan.meals || []).map(renderMeal).join('')}
          </td>
        </tr>
      </table>`
  }

  // ── Shopping list ───────────────────────────────────────────────────────────
  const shopEntries = Object.entries(shoppingList || {}).filter(([, items]) => items?.length > 0)
  const shoppingHtml = shopEntries.map(([cat, items]) => `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a12;border:1px solid #1e1e2e;border-radius:8px;margin-bottom:12px;">
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #1e1e2e;">
          <span style="font-size:12px;font-weight:700;color:#f5f6fa;letter-spacing:0.05em;">${SHOP_ICONS[cat] || '📦'} ${cat.toUpperCase()}</span>
        </td>
      </tr>
      ${items.map((item, i) => `
        <tr>
          <td style="padding:7px 16px;font-size:13px;color:#e5e7eb;${i < items.length - 1 ? 'border-bottom:1px solid #1a1a24;' : ''}">
            ☐ &nbsp;${item}
          </td>
        </tr>`).join('')}
    </table>`).join('')

  const coachingUrl = process.env.GHL_COACHING_URL || process.env.APP_URL || 'https://coachdavemarsh.net'

  // ── Full email ──────────────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>Your 7-Day Meal Plan</title>
</head>
<body style="margin:0;padding:0;background:#030305;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#030305;min-width:320px;">
  <tr><td align="center" style="padding:20px 10px;">

    <table width="640" cellpadding="0" cellspacing="0" border="0" style="background:#060608;color:#f5f6fa;max-width:640px;width:100%;">

      <!-- ── HEADER ── -->
      <tr>
        <td style="background:#060608;padding:28px 32px 24px;border-bottom:2px solid #00C896;">
          <div style="font-size:20px;font-weight:900;letter-spacing:0.1em;color:#f5f6fa;">PERFORMUSCLE</div>
          <div style="font-size:10px;color:#00C896;letter-spacing:0.14em;margin-top:2px;">HEALTH &nbsp;·&nbsp; FUNCTION &nbsp;·&nbsp; PERFORMANCE</div>
          <div style="margin-top:22px;">
            <div style="font-size:11px;color:#00C896;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:8px;">Your Free Meal Plan Is Ready 🥗</div>
            <div style="font-size:28px;font-weight:900;color:#f5f6fa;line-height:1.15;margin-bottom:10px;">Hey ${firstName},<br>here's your personalised<br>7-day meal plan!</div>
            <div style="font-size:13px;color:#9ca3af;">
              ${mealsPerDay} meals/day &nbsp;·&nbsp; ${(trainingDays || []).length} training days${filters ? ` &nbsp;·&nbsp; ${filters}` : ''}
            </div>
          </div>
        </td>
      </tr>

      <!-- ── MACRO TARGETS ── -->
      <tr>
        <td style="background:#0a0a12;padding:20px 32px;border-bottom:1px solid #1e1e2e;">
          <div style="font-size:10px;color:#5e5e70;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:14px;">Daily Macro Targets</div>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="25%" align="center" style="padding:4px;">
                <div style="font-size:26px;font-weight:900;color:#f5f6fa;line-height:1;">${macros?.kcal}</div>
                <div style="font-size:10px;color:#5e5e70;letter-spacing:0.08em;margin-top:4px;">KCAL</div>
              </td>
              <td width="25%" align="center" style="padding:4px;border-left:1px solid #1e1e2e;">
                <div style="font-size:26px;font-weight:900;color:#818cf8;line-height:1;">${macros?.protein_g}g</div>
                <div style="font-size:10px;color:#5e5e70;letter-spacing:0.08em;margin-top:4px;">PROTEIN</div>
              </td>
              <td width="25%" align="center" style="padding:4px;border-left:1px solid #1e1e2e;">
                <div style="font-size:26px;font-weight:900;color:#f59e0b;line-height:1;">${macros?.carbs_g}g</div>
                <div style="font-size:10px;color:#5e5e70;letter-spacing:0.08em;margin-top:4px;">CARBS</div>
              </td>
              <td width="25%" align="center" style="padding:4px;border-left:1px solid #1e1e2e;">
                <div style="font-size:26px;font-weight:900;color:#34d399;line-height:1;">${macros?.fat_g}g</div>
                <div style="font-size:10px;color:#5e5e70;letter-spacing:0.08em;margin-top:4px;">FAT</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- ── MEAL PLAN ── -->
      <tr>
        <td style="padding:24px 32px;">
          <div style="font-size:13px;font-weight:900;color:#f5f6fa;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:20px;">📅 Weekly Meal Plan</div>
          ${DAYS.map(renderDay).join('')}
        </td>
      </tr>

      <!-- ── SHOPPING LIST ── -->
      <tr>
        <td style="padding:0 32px 28px;">
          <div style="font-size:13px;font-weight:900;color:#f5f6fa;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:16px;">🛒 Shopping List</div>
          ${shoppingHtml}
        </td>
      </tr>

      <!-- ── CTA ── -->
      <tr>
        <td style="background:#0a1a14;border-top:2px solid #00C896;padding:32px;text-align:center;">
          <div style="font-size:10px;color:#00C896;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:8px;">Want Expert Guidance?</div>
          <div style="font-size:24px;font-weight:900;color:#f5f6fa;letter-spacing:0.02em;margin-bottom:10px;">Work 1-on-1 With a Coach</div>
          <div style="font-size:13px;color:#9ca3af;line-height:1.7;margin-bottom:24px;">Get a fully personalised nutrition &amp; training plan,<br>weekly check-ins, and real results.</div>
          <a href="${coachingUrl}" style="display:inline-block;background:#00C896;color:#060608;padding:16px 44px;border-radius:6px;text-decoration:none;font-weight:900;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">Apply Now &rarr;</a>
        </td>
      </tr>

      <!-- ── FOOTER ── -->
      <tr>
        <td style="padding:20px 32px;text-align:center;border-top:1px solid #1e1e2e;">
          <div style="font-size:11px;color:#5e5e70;">Performuscle &nbsp;·&nbsp; Health | Function | Performance</div>
          <div style="font-size:11px;color:#3a3a4a;margin-top:6px;line-height:1.5;">This meal plan was generated based on your macro targets.<br>Consult a registered dietitian for personalised medical nutrition advice.</div>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`

  return { subject: `Hey ${firstName}, your 7-day meal plan is ready! 🥗`, html }
}

// ─── POST /api/meal-planner/send-plan ────────────────────────────────────────
router.post('/meal-planner/send-plan', async (req, res) => {
  const { name, email, weekPlan, shoppingList, macros, mealsPerDay, trainingDays, dietaryFilters } = req.body

  if (!email || !weekPlan) {
    return res.status(400).json({ error: 'email and weekPlan are required' })
  }
  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: 'Email not configured — set RESEND_API_KEY' })
  }

  // Fetch recipe methods + images from Supabase to enrich the email
  let recipeMap = {}
  const supabase = getSupabase()
  if (supabase) {
    try {
      const { data } = await supabase
        .from('recipes')
        .select('name, method, image_url')
        .eq('is_public', true)
      if (data) {
        for (const r of data) {
          recipeMap[r.name.toLowerCase()] = { method: r.method, image_url: r.image_url }
        }
      }
    } catch { /* non-fatal — email sends without methods */ }
  }

  const { subject, html } = buildMealPlanEmail({
    name: name || email,
    weekPlan,
    shoppingList,
    macros,
    mealsPerDay,
    trainingDays,
    dietaryFilters,
    recipeMap,
  })

  // Send email via Resend
  const resend = new Resend(process.env.RESEND_API_KEY)
  // Build from address — use env var if set, otherwise fall back to onboarding address
  const fromEmail = process.env.FROM_EMAIL_ADDRESS || 'onboarding@resend.dev'
  const fromName  = process.env.FROM_EMAIL_NAME    || 'Performuscle'
  const FROM      = `${fromName} <${fromEmail}>`

  try {
    const { error: sendError } = await resend.emails.send({ from: FROM, to: email, subject, html })
    if (sendError) {
      console.error('[MealPlanner] Email send error:', sendError)
      return res.status(500).json({ error: 'Failed to send email' })
    }
  } catch (err) {
    console.error('[MealPlanner] Email exception:', err.message)
    return res.status(500).json({ error: err.message })
  }

  // Optional GHL webhook — fire-and-forget
  if (process.env.GHL_WEBHOOK_URL) {
    fetch(process.env.GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name || '', email, source: 'meal-planner', tags: ['meal-plan-lead'] }),
    }).catch(err => console.warn('[MealPlanner] GHL webhook failed:', err.message))
  }

  console.log(`[MealPlanner] Plan emailed to ${email}`)
  res.json({ ok: true })
})

export default router
