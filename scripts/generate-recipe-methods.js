/**
 * generate-recipe-methods.js
 *
 * Fetches all public recipes from Supabase that have no method,
 * generates a concise cooking method for each using Claude,
 * and saves it back to the database.
 *
 * Usage:
 *   node scripts/generate-recipe-methods.js
 *
 * Requires env vars (reads from .env in project root):
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY
 */

import 'dotenv/config'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Small delay to stay well within API rate limits
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function generateMethod(recipe) {
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.filter(Boolean).join(', ')
    : ''

  const prompt = `You are a concise recipe writer. Write a short, practical "how to make it" method for this recipe.

Recipe: ${recipe.name}
Category: ${recipe.category || 'main'}
Servings: ${recipe.servings || 1}
Ingredients: ${ingredients}
Macros per serving: ${recipe.kcal}kcal | P:${recipe.protein_g}g C:${recipe.carbs_g}g F:${recipe.fat_g}g

Write 3–6 clear steps. Each step should be one sentence. No bullet points — just numbered steps like "1. ...", "2. ...", etc. Keep the total under 120 words. Focus on practical technique, timing, and doneness cues. Do not repeat the ingredient list.`

  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  })

  return msg.content[0]?.text?.trim() || null
}

async function main() {
  // Fetch all public recipes missing a method
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, name, category, servings, kcal, protein_g, carbs_g, fat_g, ingredients')
    .eq('is_public', true)
    .is('method', null)
    .order('category')

  if (error) {
    console.error('Failed to fetch recipes:', error.message)
    process.exit(1)
  }

  if (!recipes?.length) {
    console.log('All recipes already have methods — nothing to do.')
    process.exit(0)
  }

  console.log(`Generating methods for ${recipes.length} recipes...\n`)

  let done = 0
  let failed = 0

  for (const recipe of recipes) {
    process.stdout.write(`[${done + failed + 1}/${recipes.length}] ${recipe.name} ... `)

    try {
      const method = await generateMethod(recipe)

      if (!method) {
        console.log('SKIP (empty response)')
        failed++
        continue
      }

      const { error: updateError } = await supabase
        .from('recipes')
        .update({ method })
        .eq('id', recipe.id)

      if (updateError) {
        console.log(`FAIL (${updateError.message})`)
        failed++
      } else {
        console.log('OK')
        done++
      }
    } catch (err) {
      console.log(`ERROR (${err.message})`)
      failed++
    }

    // 300ms between calls — keeps us under rate limits comfortably
    await sleep(300)
  }

  console.log(`\nDone. ${done} updated, ${failed} failed.`)
}

main()
