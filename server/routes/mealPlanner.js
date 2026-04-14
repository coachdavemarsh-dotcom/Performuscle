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
function buildMealPlanEmail({ name, weekPlan, shoppingList, macros, mealsPerDay, trainingDays, dietaryFilters }) {
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const firstName = name?.split(' ')[0] || 'there'
  const trainingSet = new Set((trainingDays || []).map(d => d.toLowerCase()))
  const filters = (dietaryFilters || []).join(', ')

  const mealTypeColour = {
    'pre-workout':  '#f59e0b',
    'post-workout': '#00C896',
    'breakfast':    '#6366f1',
    'lunch':        '#3b82f6',
    'dinner':       '#8b5cf6',
    'snack':        '#ec4899',
  }

  // Render one day section
  function renderDay(day) {
    const plan = weekPlan?.[day]
    if (!plan) return ''
    const isTraining = trainingSet.has(day.toLowerCase())
    const t = plan.dayTotals || {}
    const dayBorder = isTraining ? '#00C896' : '#2a2a3a'
    const meals = (plan.meals || []).map(meal => {
      const mt = meal.mealTotals || {}
      const colour = mealTypeColour[meal.mealType] || '#00C896'
      const foods = (meal.foods || []).map(f =>
        `<tr>
          <td style="padding:5px 8px 5px 0;font-size:13px;color:#e5e7eb;">${f.name}</td>
          <td style="padding:5px 0 5px 8px;font-size:12px;color:#9ca3af;text-align:right;white-space:nowrap;">${f.amount}</td>
          <td style="padding:5px 0 5px 8px;font-size:12px;color:#e5e7eb;text-align:right;">${f.kcal}</td>
          <td style="padding:5px 0 5px 8px;font-size:12px;color:#818cf8;text-align:right;">${f.protein_g}g</td>
          <td style="padding:5px 0 5px 8px;font-size:12px;color:#f59e0b;text-align:right;">${f.carbs_g}g</td>
          <td style="padding:5px 0 5px 8px;font-size:12px;color:#34d399;text-align:right;">${f.fat_g}g</td>
        </tr>`
      ).join('')
      const recipeTag = meal.recipe_name
        ? `<div style="font-size:11px;color:#00C896;font-weight:700;letter-spacing:0.04em;margin-bottom:6px;">FROM LIBRARY: ${meal.recipe_name}</div>`
        : ''
      return `
        <div style="background:#0f0f18;border-radius:8px;overflow:hidden;margin-bottom:10px;">
          <div style="display:flex;align-items:center;padding:10px 14px;gap:10px;">
            <div style="width:3px;height:36px;background:${colour};border-radius:2px;flex-shrink:0;"></div>
            <div style="flex:1;">
              <div style="font-size:14px;font-weight:600;color:#f5f6fa;">${meal.name}</div>
              <div style="font-size:11px;color:#9ca3af;margin-top:2px;">${mt.kcal}kcal &nbsp;·&nbsp; P<span style="color:#818cf8;">${mt.protein_g}g</span> &nbsp;C<span style="color:#f59e0b;">${mt.carbs_g}g</span> &nbsp;F<span style="color:#34d399;">${mt.fat_g}g</span></div>
            </div>
          </div>
          <div style="padding:0 14px 14px;">
            ${recipeTag}
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th style="font-size:10px;color:#5e5e70;text-align:left;padding-bottom:4px;border-bottom:1px solid #1e1e2e;">Food</th>
                  <th style="font-size:10px;color:#5e5e70;text-align:right;padding-bottom:4px;border-bottom:1px solid #1e1e2e;padding-left:8px;">Amount</th>
                  <th style="font-size:10px;color:#5e5e70;text-align:right;padding-bottom:4px;border-bottom:1px solid #1e1e2e;padding-left:8px;">kcal</th>
                  <th style="font-size:10px;color:#818cf8;text-align:right;padding-bottom:4px;border-bottom:1px solid #1e1e2e;padding-left:8px;">P</th>
                  <th style="font-size:10px;color:#f59e0b;text-align:right;padding-bottom:4px;border-bottom:1px solid #1e1e2e;padding-left:8px;">C</th>
                  <th style="font-size:10px;color:#34d399;text-align:right;padding-bottom:4px;border-bottom:1px solid #1e1e2e;padding-left:8px;">F</th>
                </tr>
              </thead>
              <tbody>${foods}</tbody>
            </table>
          </div>
        </div>`
    }).join('')

    return `
      <div style="border:1.5px solid ${dayBorder};border-radius:12px;overflow:hidden;margin-bottom:20px;">
        <div style="background:${isTraining ? 'rgba(0,200,150,0.08)' : '#0a0a12'};padding:14px 18px;border-bottom:1px solid ${dayBorder};">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div>
              <span style="font-size:16px;font-weight:900;color:#f5f6fa;letter-spacing:0.06em;">${day.toUpperCase()}</span>
              ${isTraining ? '<span style="font-size:11px;color:#00C896;font-weight:700;letter-spacing:0.04em;margin-left:10px;">⚡ TRAINING DAY</span>' : '<span style="font-size:11px;color:#5e5e70;letter-spacing:0.04em;margin-left:10px;">REST DAY</span>'}
            </div>
            <div style="font-size:12px;color:#9ca3af;">${t.kcal}kcal &nbsp;·&nbsp; P<span style="color:#818cf8;">${t.protein_g}g</span> C<span style="color:#f59e0b;">${t.carbs_g}g</span> F<span style="color:#34d399;">${t.fat_g}g</span></div>
          </div>
        </div>
        <div style="padding:14px 18px;">${meals}</div>
      </div>`
  }

  // Shopping list
  const SHOP_ICONS = {
    'Protein & Meat': '🥩', 'Fish & Seafood': '🐟', 'Dairy & Eggs': '🥚',
    'Grains & Carbs': '🌾', 'Produce': '🥦', 'Fats & Oils': '🫒',
    'Condiments & Spices': '🧂', 'Supplements & Other': '💊',
  }
  const shoppingHtml = Object.entries(shoppingList || {})
    .filter(([, items]) => items?.length > 0)
    .map(([cat, items]) => `
      <div style="background:#0a0a12;border:1px solid #1e1e2e;border-radius:10px;padding:16px;margin-bottom:12px;">
        <div style="font-size:13px;font-weight:700;color:#f5f6fa;letter-spacing:0.05em;margin-bottom:10px;">
          ${SHOP_ICONS[cat] || '📦'} ${cat.toUpperCase()}
        </div>
        <ul style="margin:0;padding:0;list-style:none;">
          ${items.map(item => `<li style="font-size:13px;color:#e5e7eb;padding:4px 0;border-bottom:1px solid #1e1e2e;">&nbsp;□ &nbsp;${item}</li>`).join('')}
        </ul>
      </div>`).join('')

  const coachingUrl = process.env.GHL_COACHING_URL || process.env.APP_URL || 'https://performuscle.com'

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#030305;font-family:Arial,sans-serif;">
  <div style="max-width:680px;margin:0 auto;background:#060608;color:#f5f6fa;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#060608 0%,#0a1a14 100%);padding:32px 32px 28px;border-bottom:2px solid #00C896;">
      <div style="font-size:24px;font-weight:900;letter-spacing:0.08em;color:#f5f6fa;">PERFORMUSCLE</div>
      <div style="font-size:11px;color:#00C896;letter-spacing:0.12em;margin-top:2px;">HEALTH · FUNCTION · PERFORMANCE</div>
      <div style="margin-top:20px;">
        <div style="font-size:28px;font-weight:900;color:#f5f6fa;letter-spacing:0.04em;">YOUR 7-DAY MEAL PLAN</div>
        <div style="font-size:13px;color:#9ca3af;margin-top:6px;">
          ${mealsPerDay} meals/day &nbsp;·&nbsp; ${(trainingDays || []).length} training days${filters ? ` &nbsp;·&nbsp; ${filters}` : ''}
        </div>
      </div>
    </div>

    <!-- Macro summary -->
    <div style="padding:20px 32px;background:#0a0a12;border-bottom:1px solid #1e1e2e;">
      <div style="font-size:11px;color:#5e5e70;font-weight:700;letter-spacing:0.08em;margin-bottom:12px;">DAILY MACRO TARGETS</div>
      <div style="display:flex;gap:24px;flex-wrap:wrap;">
        ${[
          { label: 'KCAL',    val: macros?.kcal,      colour: '#f5f6fa' },
          { label: 'PROTEIN', val: `${macros?.protein_g}g`, colour: '#818cf8' },
          { label: 'CARBS',   val: `${macros?.carbs_g}g`,   colour: '#f59e0b' },
          { label: 'FAT',     val: `${macros?.fat_g}g`,     colour: '#34d399' },
        ].map(({ label, val, colour }) =>
          `<div style="text-align:center;">
            <div style="font-size:22px;font-weight:900;color:${colour};">${val}</div>
            <div style="font-size:10px;color:#5e5e70;letter-spacing:0.06em;">${label}</div>
          </div>`
        ).join('')}
      </div>
    </div>

    <!-- Meal plan -->
    <div style="padding:28px 32px;">
      <div style="font-size:14px;font-weight:900;color:#f5f6fa;letter-spacing:0.08em;margin-bottom:20px;">📅 WEEKLY MEAL PLAN</div>
      ${DAYS.map(renderDay).join('')}
    </div>

    <!-- Shopping list -->
    <div style="padding:0 32px 28px;">
      <div style="font-size:14px;font-weight:900;color:#f5f6fa;letter-spacing:0.08em;margin-bottom:16px;">🛒 SHOPPING LIST</div>
      ${shoppingHtml}
    </div>

    <!-- CTA -->
    <div style="background:linear-gradient(135deg,#0a1a14 0%,#060608 100%);border-top:2px solid #00C896;padding:32px;text-align:center;">
      <div style="font-size:11px;color:#00C896;font-weight:700;letter-spacing:0.1em;margin-bottom:8px;">WANT BETTER RESULTS?</div>
      <div style="font-size:22px;font-weight:900;color:#f5f6fa;letter-spacing:0.04em;margin-bottom:12px;">WORK WITH A COACH</div>
      <div style="font-size:14px;color:#9ca3af;margin-bottom:24px;line-height:1.6;">Get a fully personalised nutrition &amp; training plan,<br>weekly check-ins, and expert guidance around your goals.</div>
      <a href="${coachingUrl}" style="display:inline-block;background:#00C896;color:#060608;padding:16px 40px;border-radius:8px;text-decoration:none;font-weight:900;font-size:14px;letter-spacing:0.08em;">APPLY NOW →</a>
    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;text-align:center;border-top:1px solid #1e1e2e;">
      <div style="font-size:11px;color:#5e5e70;">Performuscle · Health | Function | Performance</div>
      <div style="font-size:11px;color:#5e5e70;margin-top:4px;">This meal plan was AI-generated based on your macro targets. Consult a registered dietitian for personalised medical nutrition advice.</div>
    </div>

  </div>
</body>
</html>`

  return { subject: `Your 7-Day Meal Plan, ${firstName} 🥗`, html }
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

  const { subject, html } = buildMealPlanEmail({
    name: name || email,
    weekPlan,
    shoppingList,
    macros,
    mealsPerDay,
    trainingDays,
    dietaryFilters,
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
