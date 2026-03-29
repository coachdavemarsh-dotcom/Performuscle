import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = express.Router()

// POST /api/checkin-summary
// Generates an AI coaching summary for a check-in
router.post('/checkin-summary', async (req, res) => {
  const { checkIn } = req.body
  if (!checkIn) return res.status(400).json({ error: 'checkIn required' })

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'AI not configured — set ANTHROPIC_API_KEY' })
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  // Build a structured summary of the check-in data
  const dataPoints = []

  if (checkIn.body_weight_kg) dataPoints.push(`Body weight: ${checkIn.body_weight_kg} kg`)
  if (checkIn.biofeedback_score != null) dataPoints.push(`Overall biofeedback score: ${Math.round(checkIn.biofeedback_score)}/100`)
  if (checkIn.training_score != null) dataPoints.push(`Training adherence: ${checkIn.training_score}/10`)
  if (checkIn.nutrition_score != null) dataPoints.push(`Nutrition adherence: ${checkIn.nutrition_score}/10`)
  if (checkIn.sleep_score != null) dataPoints.push(`Sleep quality: ${checkIn.sleep_score}/10`)
  if (checkIn.sleep_hrs != null) dataPoints.push(`Sleep hours: ${checkIn.sleep_hrs}h/night`)
  if (checkIn.digestion_score != null) dataPoints.push(`Digestion: ${checkIn.digestion_score}/10`)
  if (checkIn.physical_stress_score != null) dataPoints.push(`Physical stress: ${checkIn.physical_stress_score}/10`)
  if (checkIn.emotional_stress_score != null) dataPoints.push(`Emotional stress: ${checkIn.emotional_stress_score}/10`)
  if (checkIn.strength_score != null) dataPoints.push(`Strength in sessions: ${checkIn.strength_score}/10`)
  if (checkIn.recovery_score != null) dataPoints.push(`Recovery: ${checkIn.recovery_score}/10`)
  if (checkIn.confidence_score != null) dataPoints.push(`Confidence: ${checkIn.confidence_score}/10`)
  if (checkIn.step_score != null) dataPoints.push(`Step count adherence: ${checkIn.step_score}/10`)
  if (checkIn.supplementation_score != null) dataPoints.push(`Supplementation: ${checkIn.supplementation_score}/10`)
  if (checkIn.urgency) dataPoints.push(`Client urgency flag: ${checkIn.urgency.replace(/_/g, ' ')}`)
  if (checkIn.client_note) dataPoints.push(`Client's own note: "${checkIn.client_note}"`)
  if (checkIn.lowest_areas_note) dataPoints.push(`Client's lowest areas: ${checkIn.lowest_areas_note}`)
  if (checkIn.progress_note) dataPoints.push(`Progress notes: ${checkIn.progress_note}`)

  const prompt = `You are a professional personal trainer reviewing a client's weekly check-in. Based on the following data, write a concise coaching summary (3–5 bullet points) that covers:
1. The main positives / wins this week
2. Key areas of concern or lowest scores
3. The primary coaching focus point for next week

Keep the tone professional, direct and motivating. Use bullet points. No fluff.

Client check-in data (Week ${checkIn.week_number || '?'}):
${dataPoints.length > 0 ? dataPoints.join('\n') : 'No detailed data provided.'}

Write the summary now:`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    })
    const summary = message.content[0]?.text || 'Could not generate summary.'
    res.json({ summary })
  } catch (err) {
    console.error('[AI] Summary error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

export default router
