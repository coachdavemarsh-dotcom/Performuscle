import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = express.Router()

// POST /api/bloodwork/parse-pdf
// Extracts lab values from an uploaded bloodwork PDF, matched strictly
// against the coach's own marker library. The PDF is only ever held in
// memory for this request — never written to disk or storage.
router.post('/bloodwork/parse-pdf', async (req, res) => {
  const { pdfBase64, markers } = req.body
  if (!pdfBase64) return res.status(400).json({ error: 'pdfBase64 required' })
  if (!Array.isArray(markers) || markers.length === 0) {
    return res.status(400).json({ error: 'markers required — add markers to your Reference Library first' })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'AI not configured — set ANTHROPIC_API_KEY' })
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const markerList = markers
    .map(m => `- key: "${m.marker_key}", name: "${m.display_name}"${m.aliases ? `, aliases: "${m.aliases}"` : ''}${m.unit ? `, unit: "${m.unit}"` : ''}`)
    .join('\n')

  const systemPrompt = `You extract lab values from a bloodwork PDF report and match them strictly against a known list of markers.

Known markers (only ever use these exact "key" values, never invent new ones):
${markerList}

Rules:
- Match each value in the report to a marker above by its name or aliases (case-insensitive, flexible wording).
- If a value in the report doesn't confidently match any marker in the list, omit it entirely — do not guess or fabricate.
- If the same marker appears more than once in the report, use the most recent/relevant result.
- Convert units if the report uses a different unit than specified, so the number matches the marker's stated unit. If you cannot confidently convert, omit that value.
- Extract the test/collection date (as YYYY-MM-DD) and lab name if present in the report.

Return ONLY raw JSON (no markdown, no code fences, no extra text) in this exact shape:
{"tested_date": "YYYY-MM-DD or null", "lab_name": "string or null", "values": {"<marker_key>": <number>, ...}}`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: [
          { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 } },
          { type: 'text', text: 'Extract the lab values from this bloodwork report per the rules above.' },
        ],
      }],
    })

    const raw = message.content[0]?.text?.trim() || '{}'
    const cleaned = raw.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '').trim()

    let parsed
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      return res.status(500).json({ error: 'AI returned invalid JSON', raw })
    }

    const knownKeys = new Set(markers.map(m => m.marker_key))
    const values = Object.fromEntries(
      Object.entries(parsed.values || {}).filter(([key, v]) => knownKeys.has(key) && typeof v === 'number' && !Number.isNaN(v))
    )

    res.json({
      tested_date: parsed.tested_date || null,
      lab_name: parsed.lab_name || null,
      values,
    })
  } catch (err) {
    console.error('[Bloodwork] parse-pdf error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

export default router
