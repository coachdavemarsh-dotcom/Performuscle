/**
 * Progressive Overload Calculator
 * Analyses last week's set logs and generates specific weekly progression targets.
 * Used by the ProgressionCard component on the client Training page.
 */

// ─── Rep scheme parser ────────────────────────────────────────────────────────
// Handles: "8", "6-8", "3x8", "4x6-8", "12-15", "AMRAP", "10-12"
function parseRepScheme(scheme) {
  if (!scheme) return null
  const s = scheme.trim().toLowerCase()
  if (s === 'amrap') return { type: 'amrap' }

  // Strip leading "NxM" or "Nx" — e.g. "3x8-10" → "8-10", "4x12" → "12"
  const noSets = s.replace(/^\d+\s*x\s*/i, '')

  if (noSets.includes('-')) {
    const parts = noSets.split('-').map(n => parseInt(n, 10))
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { type: 'range', low: parts[0], high: parts[1] }
    }
  }

  const n = parseInt(noSets, 10)
  if (!isNaN(n)) return { type: 'fixed', low: n, high: n }

  return null
}

// ─── Exercise classification ──────────────────────────────────────────────────
// Compound lifts use 2.5 kg jumps; isolations use 1.25 kg jumps
const COMPOUND_KEYWORDS = [
  'squat', 'deadlift', 'bench', 'press', 'row', 'pull-up', 'chin-up', 'pullup',
  'chinup', 'hip thrust', 'lunge', 'rdl', 'sumo', 'hack', 'goblet',
  'split squat', 'step up', 'step-up', 'clean', 'snatch', 'thruster',
  'overhead', 'farmer', 'carry', 'dip',
]

const ISOLATION_KEYWORDS = [
  'curl', 'extension', 'fly', 'flye', 'raise', 'pulldown', 'pushdown',
  'kickback', 'face pull', 'shrug', 'calf raise', 'leg curl', 'leg extension',
  'pull down', 'push down',
]

function classifyExercise(name) {
  const n = name.toLowerCase()
  if (COMPOUND_KEYWORDS.some(k => n.includes(k))) return 'compound'
  if (ISOLATION_KEYWORDS.some(k => n.includes(k))) return 'isolation'
  return 'compound' // default to compound weight steps when unsure
}

// ─── Core progression calculator ─────────────────────────────────────────────
/**
 * Calculate the progression target for a single exercise.
 *
 * @param {string}  exerciseName  - Exercise name
 * @param {string}  repScheme     - Target rep scheme e.g. "3x8-10"
 * @param {string}  setType       - 'standard' | 'amrap' | 'drop' | 'rest_pause' | 'failure'
 * @param {object}  prevSetsMap   - { setNum: { weight_kg, reps } } from last week
 * @returns {object|null}         - Progression suggestion object or null
 */
export function calculateProgression(exerciseName, repScheme, setType, prevSetsMap) {
  if (!prevSetsMap) return null

  const logs = Object.values(prevSetsMap).filter(
    l => l && (l.weight_kg != null || l.reps != null),
  )
  if (!logs.length) return null

  const parsed = parseRepScheme(repScheme)
  const exType = classifyExercise(exerciseName)
  const weightStep = exType === 'compound' ? 2.5 : 1.25

  // ── AMRAP sets: beat the rep count ──────────────────────────────────────────
  if (setType === 'amrap' || parsed?.type === 'amrap') {
    const bestReps = Math.max(...logs.map(l => l.reps || 0))
    if (!bestReps) return null
    return {
      exerciseName,
      type: 'amrap',
      suggestion: `Beat ${bestReps} reps — that's your minimum`,
      badge: 'AMRAP TARGET',
      badgeColor: 'var(--info)',
      priority: 2,
      previousBest: `${bestReps} reps`,
    }
  }

  if (!parsed) return null

  // Find top set: highest weight × reps composite score
  const topSet = logs.reduce((best, l) => {
    const score = (l.weight_kg || 0) * 10 + (l.reps || 0)
    const bestScore = (best.weight_kg || 0) * 10 + (best.reps || 0)
    return score > bestScore ? l : best
  }, logs[0])

  const lastWeight = topSet.weight_kg
  const lastReps   = topSet.reps
  const targetHigh = parsed.high ?? parsed.low

  // ── Exercise has weight data ─────────────────────────────────────────────────
  if (lastWeight && lastWeight > 0) {
    if (lastReps >= targetHigh) {
      // Hit top of rep range → increase load
      const newWeight = lastWeight + weightStep
      return {
        exerciseName,
        type: 'weight',
        suggestion: `${newWeight}kg — up ${weightStep}kg from last week`,
        badge: '↑ LOAD',
        badgeColor: 'var(--accent)',
        priority: 1,
        previousBest: `${lastWeight}kg × ${lastReps}`,
      }
    }

    if (lastReps >= parsed.low) {
      // In the rep range but not at top → add a rep
      const targetReps = Math.min(lastReps + 1, targetHigh)
      const repsGained = targetReps - lastReps
      return {
        exerciseName,
        type: 'reps',
        suggestion: `${lastWeight}kg × ${targetReps} reps (+${repsGained} rep${repsGained !== 1 ? 's' : ''})`,
        badge: '↑ REPS',
        badgeColor: 'var(--warn)',
        priority: 2,
        previousBest: `${lastWeight}kg × ${lastReps}`,
      }
    }

    // Didn't hit the lower bound → maintain focus on form/completion
    return {
      exerciseName,
      type: 'maintain',
      suggestion: `${lastWeight}kg — hit all ${parsed.low}+ reps with good form`,
      badge: 'COMPLETE',
      badgeColor: '#6b7280',
      priority: 3,
      previousBest: `${lastWeight}kg × ${lastReps}`,
    }
  }

  // ── Bodyweight / rep-only exercises ─────────────────────────────────────────
  if (lastReps != null && lastReps > 0) {
    if (lastReps >= targetHigh) {
      return {
        exerciseName,
        type: 'reps',
        suggestion: `Add 2 reps or increase difficulty (last week: ${lastReps})`,
        badge: '↑ PROGRESS',
        badgeColor: 'var(--accent)',
        priority: 2,
        previousBest: `${lastReps} reps`,
      }
    }
    return {
      exerciseName,
      type: 'maintain',
      suggestion: `Target ${targetHigh} reps (last week: ${lastReps})`,
      badge: 'BUILD',
      badgeColor: 'var(--warn)',
      priority: 2,
      previousBest: `${lastReps} reps`,
    }
  }

  return null
}

// ─── Weekly progression plan ─────────────────────────────────────────────────
/**
 * Generate a full week's progression targets from the previous week's performance.
 *
 * @param {Array}  exercises      - All exercises from current week sessions
 * @param {object} prevWeightMap  - { exerciseName: { setNum: { weight_kg, reps } } }
 * @returns {Array}               - Sorted array of progression suggestions
 */
export function generateWeekProgressions(exercises, prevWeightMap) {
  if (!exercises?.length || !prevWeightMap) return []

  const progressions = []
  const seen = new Set()

  for (const ex of exercises) {
    if (!ex?.name || seen.has(ex.name)) continue
    seen.add(ex.name)

    const prev = prevWeightMap[ex.name]
    if (!prev || !Object.keys(prev).length) continue

    const progression = calculateProgression(ex.name, ex.rep_scheme, ex.set_type, prev)
    if (progression) progressions.push(progression)
  }

  // Sort: load increases → rep increases → AMRAP targets → maintenance
  return progressions.sort((a, b) => {
    const order = { weight: 0, reps: 1, amrap: 2, maintain: 3 }
    const aScore = (order[a.type] ?? 4) * 10 + a.priority
    const bScore = (order[b.type] ?? 4) * 10 + b.priority
    return aScore - bScore
  })
}

// ─── Summary stats ────────────────────────────────────────────────────────────
export function getProgressionSummary(progressions) {
  const loadUps    = progressions.filter(p => p.type === 'weight').length
  const repUps     = progressions.filter(p => p.type === 'reps').length
  const amraps     = progressions.filter(p => p.type === 'amrap').length
  const maintains  = progressions.filter(p => p.type === 'maintain').length

  const parts = []
  if (loadUps)   parts.push(`${loadUps} load increase${loadUps   !== 1 ? 's' : ''}`)
  if (repUps)    parts.push(`${repUps} rep target${repUps        !== 1 ? 's' : ''}`)
  if (amraps)    parts.push(`${amraps} AMRAP target${amraps      !== 1 ? 's' : ''}`)
  if (maintains) parts.push(`${maintains} to consolidate`)

  return parts.join(' · ') || 'No progressions this week'
}
