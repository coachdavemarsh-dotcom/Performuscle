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

// ─── POST /api/ai/parse-session ──────────────────────────────────────────────
// Takes a voice transcript and returns structured exercise objects
router.post('/ai/parse-session', async (req, res) => {
  const { transcript } = req.body
  if (!transcript?.trim()) return res.status(400).json({ error: 'transcript required' })

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'AI not configured — set ANTHROPIC_API_KEY' })
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const systemPrompt = `You are a personal training assistant that converts spoken exercise programming into structured data.

Parse the transcript and return a JSON array of exercise objects. Each object must have these exact fields:
- name (string): full exercise name, capitalised properly
- set_count (integer): number of sets, default 3 if not mentioned
- rep_scheme (string): reps or range e.g. "8", "6-8", "10-12", "AMRAP", "30s"
- tempo (string): 4-digit tempo code e.g. "4010", "3010", "2011" — empty string if not mentioned
- rest_seconds (integer): rest in seconds, default 60 if not mentioned. Convert "90 seconds" to 90, "2 minutes" to 120
- set_type (string): one of "standard", "amrap", "drop", "rest_pause", "failure" — default "standard"
- pairing (string): superset group letter e.g. "A1", "A2", "B1", "B2" — empty string if solo. If two exercises are described as a superset, pair them A1/A2, next pair B1/B2 etc.
- coach_note (string): any technique cues or notes mentioned — empty string if none
- video_url (string): always empty string

Return ONLY valid JSON — a raw array with no extra text, no markdown, no code fences.

Example input: "Four sets of back squat eight to ten reps tempo four zero one zero ninety seconds rest superset with Romanian deadlift same sets and reps"
Example output: [{"name":"Barbell Back Squat","set_count":4,"rep_scheme":"8-10","tempo":"4010","rest_seconds":90,"set_type":"standard","pairing":"A1","coach_note":"","video_url":""},{"name":"Romanian Deadlift","set_count":4,"rep_scheme":"8-10","tempo":"4010","rest_seconds":90,"set_type":"standard","pairing":"A2","coach_note":"","video_url":""}]`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: `Parse this exercise transcript into JSON:\n\n${transcript}` }],
    })

    const raw = message.content[0]?.text?.trim() || '[]'
    const cleaned = raw.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '').trim()

    let exercises
    try {
      exercises = JSON.parse(cleaned)
    } catch {
      return res.status(500).json({ error: 'AI returned invalid JSON', raw })
    }

    if (!Array.isArray(exercises)) {
      return res.status(500).json({ error: 'AI returned non-array', raw })
    }

    res.json({ exercises })
  } catch (err) {
    console.error('[AI] parse-session error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

export default router
