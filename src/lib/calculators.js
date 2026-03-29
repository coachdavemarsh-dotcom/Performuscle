// ============================================================
// PERFORMUSCLE — FITNESS CALCULATORS
// ============================================================

/**
 * Naval Body Fat % Formula
 * Male:   495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
 * Female: 495 / (1.29579 - 0.35004 * log10(waist + hips - neck) + 0.22100 * log10(height)) - 450
 *
 * @param {string} gender - 'male' | 'female'
 * @param {number} waist - cm
 * @param {number} neck - cm
 * @param {number} height - cm
 * @param {number} [hips] - cm (required for female)
 * @returns {number|null} BF% or null if invalid
 */
export function navalBF(gender, waist, neck, height, hips = 0) {
  if (!waist || !neck || !height) return null
  if (waist <= neck) return null
  if (gender === 'female' && (!hips || waist + hips <= neck)) return null

  if (gender === 'male') {
    const bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450
    return Math.round(bf * 10) / 10
  } else {
    const bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hips - neck) + 0.22100 * Math.log10(height)) - 450
    return Math.round(bf * 10) / 10
  }
}

/**
 * Lean Body Mass
 * @param {number} bodyWeight - kg
 * @param {number} bfPercent - %
 * @returns {number} lean mass in kg
 */
export function leanMass(bodyWeight, bfPercent) {
  return Math.round((bodyWeight * (1 - bfPercent / 100)) * 10) / 10
}

/**
 * Energy Availability (EA)
 * EA = (Energy Intake - Exercise Energy Expenditure) / Lean Body Mass
 *
 * Thresholds:
 *   Male:   < 30 kcal/kg LBM = RED-S risk, 30-44 = low, >= 45 = optimal
 *   Female: < 30 = RED-S risk, 30-35 = critically low, 36-44 = low, >= 45 = optimal
 *
 * @param {number} intakeKcal - total calories consumed
 * @param {number} exerciseKcal - calories burned from exercise
 * @param {number} leanMassKg - lean body mass in kg
 * @param {string} [gender='male']
 * @returns {{ ea: number, status: string, color: string }}
 */
export function energyAvailability(intakeKcal, exerciseKcal, leanMassKg, gender = 'male') {
  if (!leanMassKg || leanMassKg <= 0) return null
  const ea = (intakeKcal - exerciseKcal) / leanMassKg

  let status, color
  if (ea < 30) {
    status = 'RED-S Risk'
    color = 'danger'
  } else if (gender === 'female' && ea < 36) {
    status = 'Critically Low'
    color = 'danger'
  } else if (ea < 45) {
    status = 'Low EA'
    color = 'warn'
  } else {
    status = 'Optimal'
    color = 'accent'
  }

  return { ea: Math.round(ea * 10) / 10, status, color }
}

/**
 * Rate of Weight Loss per week
 * @param {number} currentWeight - kg
 * @param {number} bfPercent - %
 * @param {number} tdee - total daily energy expenditure kcal
 * @param {number} intakeKcal - daily intake kcal
 * @returns {{ weeklyLossKg: number, dailyDeficit: number, ea: number|null }}
 */
export function weeklyLoss(currentWeight, bfPercent, tdee, intakeKcal) {
  const dailyDeficit = tdee - intakeKcal
  const weeklyLossKcal = dailyDeficit * 7
  const weeklyLossKg = Math.round((weeklyLossKcal / 7700) * 100) / 100

  const lbm = leanMass(currentWeight, bfPercent)

  return {
    weeklyLossKg,
    dailyDeficit: Math.round(dailyDeficit),
    leanMassKg: lbm,
    percentOfBW: Math.round((weeklyLossKg / currentWeight) * 1000) / 10,
  }
}

// ============================================================
// 1RM CALCULATORS
// ============================================================

/**
 * Epley formula: weight * (1 + reps / 30)
 */
export function epley(weight, reps) {
  if (reps === 1) return weight
  return Math.round(weight * (1 + reps / 30))
}

/**
 * Brzycki formula: weight * (36 / (37 - reps))
 */
export function brzycki(weight, reps) {
  if (reps === 1) return weight
  if (reps >= 37) return null
  return Math.round(weight * (36 / (37 - reps)))
}

/**
 * Lander formula: (100 * weight) / (101.3 - 2.67123 * reps)
 */
export function lander(weight, reps) {
  if (reps === 1) return weight
  return Math.round((100 * weight) / (101.3 - 2.67123 * reps))
}

/**
 * Lombardi formula: weight * reps^0.10
 */
export function lombardi(weight, reps) {
  if (reps === 1) return weight
  return Math.round(weight * Math.pow(reps, 0.10))
}

/**
 * Average of all 4 formulas
 */
export function avgOneRM(weight, reps) {
  const results = [epley, brzycki, lander, lombardi]
    .map(fn => fn(weight, reps))
    .filter(v => v !== null && !isNaN(v))
  if (!results.length) return null
  return Math.round(results.reduce((a, b) => a + b, 0) / results.length)
}

/**
 * All 1RM estimates
 */
export function allOneRMs(weight, reps) {
  return {
    epley: epley(weight, reps),
    brzycki: brzycki(weight, reps),
    lander: lander(weight, reps),
    lombardi: lombardi(weight, reps),
    average: avgOneRM(weight, reps),
  }
}

// ============================================================
// UTILITY CALCULATORS
// ============================================================

/**
 * TDEE estimate using Mifflin-St Jeor + activity multiplier
 * @param {string} gender
 * @param {number} weight - kg
 * @param {number} height - cm
 * @param {number} age - years
 * @param {string} activity - 'sedentary'|'light'|'moderate'|'active'|'very_active'
 */
export function estimateTDEE(gender, weight, height, age, activity = 'moderate') {
  let bmr
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161
  }

  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  }

  return Math.round(bmr * (multipliers[activity] || 1.55))
}

/**
 * 7-day rolling average of weight
 * @param {Array<{date: string, weight: number}>} entries
 * @returns {Array<{date: string, weight: number, avg: number}>}
 */
export function rollingAverage(entries, window = 7) {
  return entries.map((entry, i) => {
    const slice = entries.slice(Math.max(0, i - window + 1), i + 1)
    const avg = slice.reduce((sum, e) => sum + e.weight, 0) / slice.length
    return { ...entry, avg: Math.round(avg * 100) / 100 }
  })
}

/**
 * Calculate macro targets from kcal goal and protein/fat priorities
 */
export function macroTargets(kcal, proteinG, fatG) {
  const proteinKcal = proteinG * 4
  const fatKcal = fatG * 9
  const carbsKcal = kcal - proteinKcal - fatKcal
  const carbsG = Math.max(0, Math.round(carbsKcal / 4))
  return { kcal, proteinG, fatG, carbsG }
}

/**
 * Sum macros from an array of food items
 * @param {Array<{protein_g, carbs_g, fat_g, kcal}>} foods
 */
export function sumMacros(foods = []) {
  return foods.reduce((acc, food) => ({
    kcal: acc.kcal + (food.kcal || 0),
    protein_g: acc.protein_g + (food.protein_g || 0),
    carbs_g: acc.carbs_g + (food.carbs_g || 0),
    fat_g: acc.fat_g + (food.fat_g || 0),
  }), { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 })
}

/**
 * Format number with unit
 */
export function fmt(value, unit = '', decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '—'
  return `${Number(value).toFixed(decimals)}${unit}`
}

/**
 * Clamp a value between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculates total sets per primary muscle group from an array of sessions.
 * @param {Array} sessions - array of session objects, each with exercises[]
 * @param {Map} exerciseMap - EXERCISE_BY_NAME map for lookup
 * @returns {{ volume: Array<{muscle, sets, secondarySets, total}>, untracked: string[] }}
 */
export function volumeByMuscleGroup(sessions, exerciseMap) {
  const primary = {}
  const secondary = {}
  const untracked = []

  for (const session of sessions) {
    for (const ex of (session.exercises || [])) {
      const info = exerciseMap?.get(ex.name)
      const sets = ex.set_count || 0
      if (!info) {
        if (!untracked.includes(ex.name)) untracked.push(ex.name)
        continue
      }
      for (const m of (info.primaryMuscles || [])) {
        primary[m] = (primary[m] || 0) + sets
      }
      for (const m of (info.secondaryMuscles || [])) {
        secondary[m] = (secondary[m] || 0) + sets * 0.5
      }
    }
  }

  const allMuscles = new Set([...Object.keys(primary), ...Object.keys(secondary)])
  const result = Array.from(allMuscles).map(muscle => ({
    muscle,
    sets: primary[muscle] || 0,
    secondarySets: Math.round((secondary[muscle] || 0) * 10) / 10,
    total: (primary[muscle] || 0) + (secondary[muscle] || 0) * 0.5,
  }))
  result.sort((a, b) => b.total - a.total)
  return { volume: result, untracked }
}

// ============================================================
// RELATIVE STRENGTH STANDARDS
// Based on ExRx.net / Poliquin strength ratios (1RM / bodyweight)
// ============================================================

export const STRENGTH_STANDARDS = {
  'Back Squat': {
    male:   [0.0, 0.55, 1.0, 1.5, 2.0, 2.5],
    female: [0.0, 0.45, 0.75, 1.15, 1.5, 2.0],
  },
  'Deadlift': {
    male:   [0.0, 0.75, 1.25, 1.75, 2.25, 2.75],
    female: [0.0, 0.55, 0.9, 1.3, 1.7, 2.2],
  },
  'Bench Press': {
    male:   [0.0, 0.5, 0.75, 1.15, 1.5, 2.0],
    female: [0.0, 0.3, 0.5, 0.75, 1.0, 1.35],
  },
  'Overhead Press': {
    male:   [0.0, 0.35, 0.55, 0.8, 1.05, 1.3],
    female: [0.0, 0.2, 0.35, 0.55, 0.7, 0.9],
  },
  'Barbell Row': {
    male:   [0.0, 0.5, 0.75, 1.15, 1.5, 1.9],
    female: [0.0, 0.3, 0.5, 0.75, 1.0, 1.3],
  },
  'Chin-up / Pull-up (Weighted)': {
    male:   [0.0, 0.0, 0.25, 0.5, 0.75, 1.0],
    female: [0.0, 0.0, 0.1, 0.3, 0.5, 0.75],
  },
}

export const STRENGTH_LEVELS = [
  { n: 1, label: 'Untrained',    color: '#6b7280' },
  { n: 2, label: 'Beginner',     color: '#3b82f6' },
  { n: 3, label: 'Intermediate', color: '#f59e0b' },
  { n: 4, label: 'Advanced',     color: '#00C896' },
  { n: 5, label: 'Elite',        color: '#00FFB8' },
]

/**
 * Returns relative strength level for a given lift.
 * @param {string} lift - lift name matching STRENGTH_STANDARDS key
 * @param {number} orm - 1RM in kg
 * @param {number} bodyweight - kg
 * @param {'male'|'female'} gender
 * @returns {{ ratio: number, level: number, label: string, color: string, nextRatio: number|null }}
 */
export function relativeStrengthLevel(lift, orm, bodyweight, gender = 'male') {
  const std = STRENGTH_STANDARDS[lift]
  if (!std || !orm || !bodyweight || bodyweight <= 0) return null
  const g = gender === 'female' ? 'female' : 'male'
  const thresholds = std[g] // [0, novice, beginner, inter, advanced, elite]
  const ratio = parseFloat((orm / bodyweight).toFixed(3))
  let level = 0
  for (let i = thresholds.length - 1; i >= 1; i--) {
    if (ratio >= thresholds[i]) { level = i; break }
  }
  if (level === 0 && ratio > 0) level = 1
  const lvlInfo = STRENGTH_LEVELS[Math.min(level - 1, 4)] || STRENGTH_LEVELS[0]
  const nextThresh = thresholds[Math.min(level + 1, thresholds.length - 1)]
  return {
    ratio,
    level,
    label: lvlInfo?.label || 'Untrained',
    color: lvlInfo?.color || '#6b7280',
    nextRatio: nextThresh && nextThresh > ratio ? nextThresh : null,
  }
}
