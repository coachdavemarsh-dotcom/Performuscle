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
 * EA = (Energy Intake - Exercise Energy Expenditure) / Lean Body Mass (FFM)
 *
 * Thresholds:
 *   Male:   >= 40 kcal/kg FFM = Performance
 *           20–39 kcal/kg FFM = Subclinical EA
 *           < 20 kcal/kg FFM  = Clinical RED-S
 *
 *   Female: >= 45 kcal/kg FFM = Optimal
 *           36–44             = Low EA
 *           30–35             = Critically Low
 *           < 30              = Clinical RED-S
 *
 * @param {number} intakeKcal - total calories consumed
 * @param {number} exerciseKcal - calories burned from exercise (inc. NEAT if known)
 * @param {number} leanMassKg - lean body mass / FFM in kg
 * @param {string} [gender='male']
 * @returns {{ ea: number, status: string, color: string }}
 */
export function energyAvailability(intakeKcal, exerciseKcal, leanMassKg, gender = 'male') {
  if (!leanMassKg || leanMassKg <= 0) return null
  const ea = (intakeKcal - exerciseKcal) / leanMassKg

  let status, color

  if (gender === 'male') {
    if (ea < 20) {
      status = 'Clinical RED-S'
      color  = 'danger'
    } else if (ea < 40) {
      status = 'Subclinical EA'
      color  = 'warn'
    } else {
      status = 'Performance'
      color  = 'accent'
    }
  } else {
    if (ea < 30) {
      status = 'Clinical RED-S'
      color  = 'danger'
    } else if (ea < 36) {
      status = 'Critically Low'
      color  = 'danger'
    } else if (ea < 45) {
      status = 'Low EA'
      color  = 'warn'
    } else {
      status = 'Optimal'
      color  = 'accent'
    }
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
 * Periodised nutrition — calculates training day, rest day and moderate day
 * macro targets based on profile data. Uses carb cycling: protein stays fixed,
 * carbs flex up on training days and down on rest days, fat fills the gap.
 *
 * @param {object} p
 * @param {string}  p.gender        - 'male'|'female'|'non_binary'
 * @param {number}  p.weight        - kg
 * @param {number}  p.height        - cm
 * @param {number}  p.age           - years
 * @param {string}  p.activityLevel - 'sedentary'|'light'|'moderate'|'active'|'very_active'
 * @param {string}  p.goalType      - 'cut'|'maintain'|'gain'|'recomp'
 * @param {number}  [p.trainingDaysPerWeek] - defaults inferred from activityLevel
 */
export function periodisedNutrition({ gender, weight, height, age, activityLevel, goalType, trainingDaysPerWeek }) {
  const w = parseFloat(weight) || 80
  const h = parseFloat(height) || 175
  const a = parseInt(age)      || 30

  // 1. BMR (Mifflin-St Jeor)
  const bmr = gender === 'male'
    ? 10 * w + 6.25 * h - 5 * a + 5
    : 10 * w + 6.25 * h - 5 * a - 161

  // 2. TDEE
  const actMult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 }
  const tdee = Math.round(bmr * (actMult[activityLevel] || 1.55))

  // 3. Weekly calorie goal adjustment
  const adjust = { cut: -400, maintain: 0, gain: 250, recomp: -200 }[goalType] ?? 0
  const avgDaily = tdee + adjust

  // 4. Training days per week (infer if not supplied)
  const trainingDays = trainingDaysPerWeek
    ?? { sedentary: 0, light: 2, moderate: 3, active: 5, very_active: 6 }[activityLevel]
    ?? 3
  const restDays = 7 - trainingDays

  // 5. Calorie split: training days +300 vs rest days (weekly total preserved)
  const BOOST = 300
  const restKcal     = Math.round((avgDaily * 7 - trainingDays * BOOST) / 7 / 50) * 50
  const trainingKcal = restKcal + BOOST
  const moderateKcal = Math.round(avgDaily / 50) * 50

  // 6. Protein — same all days (structural, not a flex macro)
  const proteinPerKg = { cut: 2.3, maintain: 2.0, gain: 1.8, recomp: 2.2 }[goalType] ?? 2.0
  const proteinG = Math.round(w * proteinPerKg / 5) * 5
  const proteinKcal = proteinG * 4

  // 7. Fat — higher on rest days (preferred substrate at rest), lower training days
  const fatTraining = Math.round(w * 0.8 / 5) * 5
  const fatRest     = Math.round(w * 1.1 / 5) * 5
  const fatModerate = Math.round(w * 0.95 / 5) * 5

  // 8. Carbs = remaining calories ÷ 4
  function carbs(kcal, fat) { return Math.max(0, Math.round((kcal - proteinKcal - fat * 9) / 4 / 5) * 5) }

  return {
    tdee,
    avgDaily: moderateKcal,
    trainingDay: {
      kcal:      trainingKcal,
      protein_g: proteinG,
      carbs_g:   carbs(trainingKcal, fatTraining),
      fat_g:     fatTraining,
    },
    moderateDay: {
      kcal:      moderateKcal,
      protein_g: proteinG,
      carbs_g:   carbs(moderateKcal, fatModerate),
      fat_g:     fatModerate,
    },
    restDay: {
      kcal:      restKcal,
      protein_g: proteinG,
      carbs_g:   carbs(restKcal, fatRest),
      fat_g:     fatRest,
    },
    meta: { trainingDays, restDays, goalAdjust: adjust },
  }
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

// ============================================================
// ENDURANCE — TRAINING ZONES & PERFORMANCE PREDICTION
// ============================================================

/**
 * Karvonen heart rate zones (5-zone model)
 * @param {number} restingHr - bpm
 * @param {number} maxHr - bpm
 * @returns {Array<{zone, label, lo, hi, color, desc, loBpm, hiBpm}>|null}
 */
export function deriveHRZones(restingHr, maxHr) {
  if (!restingHr || !maxHr || maxHr <= restingHr) return null
  const hrr = maxHr - restingHr
  const ZONES = [
    { zone: 1, label: 'Zone 1 — Recovery',     lo: 0.50, hi: 0.60, color: 'var(--muted)',  desc: 'Active recovery. Walking, easy cycling.' },
    { zone: 2, label: 'Zone 2 — Aerobic Base', lo: 0.60, hi: 0.70, color: 'var(--accent)', desc: 'Fat burning, aerobic base building. Most training here.' },
    { zone: 3, label: 'Zone 3 — Aerobic Dev.', lo: 0.70, hi: 0.80, color: 'var(--accent)', desc: 'Improves aerobic capacity and efficiency.' },
    { zone: 4, label: 'Zone 4 — Threshold',    lo: 0.80, hi: 0.90, color: 'var(--warn)',   desc: 'Lactate threshold work. Hard but controlled.' },
    { zone: 5, label: 'Zone 5 — Max',          lo: 0.90, hi: 1.00, color: 'var(--danger)', desc: 'VO₂ max intervals. Short, very intense.' },
  ]
  return ZONES.map(z => ({
    ...z,
    loBpm: Math.round(restingHr + z.lo * hrr),
    hiBpm: Math.round(restingHr + z.hi * hrr),
  }))
}

/**
 * Lactate threshold heart rate zones (Friel 7-zone model, run/bike)
 * @param {number} lthr - lactate threshold heart rate (bpm)
 * @returns {Array<{zone, label, color, desc, loBpm, hiBpm}>|null}
 */
export function deriveLTHRZones(lthr) {
  if (!lthr) return null
  const ZONES = [
    { zone: '1',  label: 'Recovery',            pctLo: 0,    pctHi: 0.85, color: 'var(--muted)',  desc: 'Easy aerobic / recovery.' },
    { zone: '2',  label: 'Aerobic / Endurance', pctLo: 0.85, pctHi: 0.89, color: 'var(--accent)', desc: 'Long steady aerobic work.' },
    { zone: '3',  label: 'Tempo',               pctLo: 0.90, pctHi: 0.94, color: 'var(--accent)', desc: 'Steady, moderately hard.' },
    { zone: '4',  label: 'Sub-Threshold (LT)',  pctLo: 0.95, pctHi: 0.99, color: 'var(--warn)',   desc: 'Comfortably hard, just under threshold.' },
    { zone: '5a', label: 'Super-Threshold',     pctLo: 1.00, pctHi: 1.02, color: 'var(--warn)',   desc: 'Threshold intervals.' },
    { zone: '5b', label: 'Aerobic Capacity',    pctLo: 1.03, pctHi: 1.06, color: 'var(--danger)', desc: 'VO₂max intervals.' },
    { zone: '5c', label: 'Anaerobic Capacity',  pctLo: 1.07, pctHi: 1.15, color: 'var(--danger)', desc: 'Short, very hard repetitions.' },
  ]
  return ZONES.map(z => ({
    ...z,
    loBpm: Math.round(lthr * z.pctLo),
    hiBpm: Math.round(lthr * z.pctHi),
  }))
}

/**
 * VDOT estimate from a race / time-trial performance (Daniels' Running Formula)
 * @param {number} distanceM - distance in metres
 * @param {number} timeSec - time in seconds
 * @returns {number|null} VDOT
 */
export function calcVDOT(distanceM, timeSec) {
  if (!distanceM || !timeSec) return null
  const v = distanceM / (timeSec / 60) // velocity, m/min
  const t = timeSec / 60               // time, min
  const vo2 = -4.60 + 0.182258 * v + 0.000104 * v * v
  const pctMax = 0.8 + 0.1894393 * Math.exp(-0.012778 * t) + 0.2989558 * Math.exp(-0.1932605 * t)
  return Math.round((vo2 / pctMax) * 10) / 10
}

/**
 * Inverse of the Daniels VO2 formula — velocity (m/min) that elicits a given VO2.
 */
export function velocityForVO2(vo2) {
  const a = 0.000104, b = 0.182258, c = -4.60 - vo2
  return (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a)
}

/**
 * Convert velocity (m/min) to a pace string "M:SS" per km
 */
export function paceFromVelocity(vMinPerKm) {
  if (!vMinPerKm) return '—'
  const minPerKm = 1000 / vMinPerKm
  const min = Math.floor(minPerKm)
  const sec = Math.round((minPerKm - min) * 60)
  return `${min}:${sec.toString().padStart(2, '0')}`
}

/**
 * Daniels training pace zones derived from VDOT
 * @param {number} vdot
 * @returns {Array<{zone, label, color, desc, pacePerKm}>|null}
 */
export function derivePaceZones(vdot) {
  if (!vdot) return null
  const ZONES = [
    { zone: 'E', label: 'Easy / Long Run',    pct: 0.70,  color: 'var(--muted)',  desc: 'Conversational pace, builds aerobic base.' },
    { zone: 'M', label: 'Marathon Pace',      pct: 0.84,  color: 'var(--accent)', desc: 'Steady, sustainable race effort.' },
    { zone: 'T', label: 'Threshold',          pct: 0.88,  color: 'var(--warn)',   desc: 'Comfortably hard tempo / cruise intervals.' },
    { zone: 'I', label: 'Interval (VO₂ Max)', pct: 0.975, color: 'var(--danger)', desc: '3–5min hard reps with equal recovery.' },
    { zone: 'R', label: 'Repetition (Speed)', pct: 1.05,  color: 'var(--danger)', desc: 'Short, fast reps for economy & speed.' },
  ]
  return ZONES.map(z => {
    const v = velocityForVO2(vdot * z.pct)
    return { ...z, pacePerKm: paceFromVelocity(v) }
  })
}

/**
 * Riegel formula — predict time for a different distance from a known performance
 * @param {number} timeSec - known time, seconds
 * @param {number} distFromM - known distance, metres
 * @param {number} distToM - target distance, metres
 * @param {number} [exponent=1.06] - fatigue factor
 * @returns {number|null} predicted time in seconds
 */
export function riegelPredict(timeSec, distFromM, distToM, exponent = 1.06) {
  if (!timeSec || !distFromM || !distToM) return null
  return Math.round(timeSec * Math.pow(distToM / distFromM, exponent))
}

/**
 * Predict 10km / half marathon / marathon times from a 5km time trial
 * @param {number} time5kSec
 * @returns {{'5km': number, '10km': number, half_marathon: number, marathon: number}|null}
 */
export function predictRaceTimes(time5kSec) {
  if (!time5kSec) return null
  return {
    '5km': time5kSec,
    '10km': riegelPredict(time5kSec, 5000, 10000),
    half_marathon: riegelPredict(time5kSec, 5000, 21097.5),
    marathon: riegelPredict(time5kSec, 5000, 42195, 1.08),
  }
}

/**
 * Functional Threshold Power (FTP) from a 20-minute test
 * @param {number} avgPower20min - average power, watts
 * @returns {number|null} FTP, watts
 */
export function calcFTP(avgPower20min) {
  if (!avgPower20min) return null
  return Math.round(avgPower20min * 0.95)
}

/**
 * Coggan power training zones from FTP
 * @param {number} ftp - watts
 * @returns {Array<{zone, label, color, loW, hiW}>|null}
 */
export function deriveFTPZones(ftp) {
  if (!ftp) return null
  const ZONES = [
    { zone: '1', label: 'Active Recovery',     pctLo: 0,    pctHi: 0.55, color: 'var(--muted)' },
    { zone: '2', label: 'Endurance',           pctLo: 0.56, pctHi: 0.75, color: 'var(--accent)' },
    { zone: '3', label: 'Tempo',               pctLo: 0.76, pctHi: 0.90, color: 'var(--accent)' },
    { zone: '4', label: 'Lactate Threshold',   pctLo: 0.91, pctHi: 1.05, color: 'var(--warn)' },
    { zone: '5', label: 'VO₂ Max',             pctLo: 1.06, pctHi: 1.20, color: 'var(--danger)' },
    { zone: '6', label: 'Anaerobic Capacity',  pctLo: 1.21, pctHi: 1.50, color: 'var(--danger)' },
    { zone: '7', label: 'Neuromuscular Power', pctLo: 1.51, pctHi: 2.50, color: 'var(--danger)' },
  ]
  return ZONES.map(z => ({
    ...z,
    loW: Math.round(ftp * z.pctLo),
    hiW: Math.round(ftp * z.pctHi),
  }))
}

/**
 * Critical Swim Speed (CSS) pace from 200m and 400m time trials
 * @param {number} time200Sec
 * @param {number} time400Sec
 * @returns {number|null} CSS pace, seconds per 100m
 */
export function calcCSS(time200Sec, time400Sec) {
  if (!time200Sec || !time400Sec || time400Sec <= time200Sec) return null
  return Math.round(((time400Sec - time200Sec) / 2) * 10) / 10
}

/**
 * Swim training pace zones from CSS (% of CSS pace — a lower % is a faster pace)
 * @param {number} cssPer100Sec - CSS pace, seconds per 100m
 * @returns {Array<{zone, label, color, desc, loPer100, hiPer100}>|null}
 */
export function deriveSwimZones(cssPer100Sec) {
  if (!cssPer100Sec) return null
  const ZONES = [
    { zone: 'Recovery',  label: 'Recovery / Drills',  pctLo: 1.12, pctHi: 1.20, color: 'var(--muted)',  desc: 'Technique, easy recovery swimming.' },
    { zone: 'Endurance', label: 'Endurance / Aerobic', pctLo: 1.04, pctHi: 1.10, color: 'var(--accent)', desc: 'Long steady swims.' },
    { zone: 'CSS',       label: 'CSS / Threshold',     pctLo: 0.99, pctHi: 1.02, color: 'var(--warn)',   desc: 'Sustainable race pace intervals.' },
    { zone: 'VO2max',    label: 'VO₂ Max',             pctLo: 0.95, pctHi: 0.98, color: 'var(--danger)', desc: 'Short, fast intervals.' },
    { zone: 'Sprint',    label: 'Sprint / Speed',      pctLo: 0.88, pctHi: 0.94, color: 'var(--danger)', desc: 'All-out speed work.' },
  ]
  return ZONES.map(z => ({
    ...z,
    loPer100: Math.round(cssPer100Sec * z.pctLo * 10) / 10,
    hiPer100: Math.round(cssPer100Sec * z.pctHi * 10) / 10,
  }))
}

/**
 * Format a duration in seconds as "M:SS" or "H:MM:SS"
 * @param {number} totalSec
 * @returns {string}
 */
export function formatTime(totalSec) {
  if (totalSec === null || totalSec === undefined || isNaN(totalSec)) return '—'
  const sign = totalSec < 0 ? '-' : ''
  const abs = Math.abs(Math.round(totalSec))
  const h = Math.floor(abs / 3600)
  const m = Math.floor((abs % 3600) / 60)
  const s = abs % 60
  if (h > 0) return `${sign}${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${sign}${m}:${s.toString().padStart(2, '0')}`
}

/**
 * Resolve an endurance session target (e.g. { metric: 'pace', zone: 'T' }) into a
 * displayable training zone using the client's latest test results.
 * @param {{metric: 'pace'|'hr'|'power'|'css', zone: string|number}} target
 * @param {Object} latestResults - map of test_type -> latest test_results row (or null)
 * @returns {{available: true, label, display, zone}|{available: false, message}|null}
 */
export function resolveEnduranceTarget(target, latestResults = {}) {
  if (!target) return null
  const { metric, zone } = target

  switch (metric) {
    case 'pace': {
      const vdot = latestResults.tt_5km?.results?.vdot
      if (!vdot) return { available: false, message: 'Complete a 5K Time Trial to unlock pace targets' }
      const z = derivePaceZones(vdot).find(zz => zz.zone === zone)
      if (!z) return { available: false, message: `Pace zone "${zone}" not found` }
      return { available: true, label: z.label, display: `${z.pacePerKm}/km`, zone: z }
    }
    case 'hr': {
      const lthr = latestResults.lactate_threshold?.results?.lthr
      if (lthr) {
        const z = deriveLTHRZones(lthr).find(zz => zz.zone === zone)
        if (z) return { available: true, label: z.label, display: `${z.loBpm}-${z.hiBpm} bpm`, zone: z }
      }
      const { restingHr, maxHr } = latestResults.vo2_rhr?.results || {}
      if (restingHr && maxHr) {
        const z = deriveHRZones(restingHr, maxHr).find(zz => zz.zone === zone)
        if (z) return { available: true, label: z.label, display: `${z.loBpm}-${z.hiBpm} bpm`, zone: z }
      }
      return { available: false, message: 'Complete a Resting HR or Lactate Threshold test to unlock HR targets' }
    }
    case 'power': {
      const ftp = latestResults.ftp_cycling?.results?.ftp
      if (!ftp) return { available: false, message: 'Complete an FTP Test to unlock power targets' }
      const z = deriveFTPZones(ftp).find(zz => zz.zone === zone)
      if (!z) return { available: false, message: `Power zone "${zone}" not found` }
      return { available: true, label: z.label, display: `${z.loW}-${z.hiW}W`, zone: z }
    }
    case 'css': {
      const css = latestResults.css_swim?.results?.cssPer100
      if (!css) return { available: false, message: 'Complete a CSS Swim Test to unlock swim pace targets' }
      const z = deriveSwimZones(css).find(zz => zz.zone === zone)
      if (!z) return { available: false, message: `Swim zone "${zone}" not found` }
      return { available: true, label: z.label, display: `${formatTime(z.loPer100)}-${formatTime(z.hiPer100)}/100m`, zone: z }
    }
    default:
      return { available: false, message: 'Unknown target metric' }
  }
}

// ─── Menstrual Cycle Phase Calculator ─────────────────────────────────────────
// Used by CycleTracker.jsx and coach client profile views.

export function computeCyclePhase(periodStart, cycleLength = 28, periodLength = 5) {
  const start = new Date(periodStart)
  const today = new Date()
  start.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const totalDays = Math.floor((today - start) / 86400000)
  const dayOfCycle = (totalDays % cycleLength) + 1
  const daysUntilNext = cycleLength - (totalDays % cycleLength)
  const progressPct = Math.round((dayOfCycle / cycleLength) * 100)

  let phase, color, emoji, tagline, training, nutrition, carbAdjust

  if (dayOfCycle <= periodLength) {
    phase      = 'Menstrual'
    color      = '#ef4444'
    emoji      = '🌑'
    tagline    = 'Rest & restore — honour your body'
    training   = 'Reduce intensity. Focus on walks, yoga and light mobility. Avoid heavy loading on days 1–2. Listen to your body — some clients perform well, others need full rest.'
    nutrition  = 'Prioritise iron-rich foods (red meat, leafy greens, legumes), omega-3s to reduce inflammation, and magnesium for cramp relief. Avoid excessive caffeine and alcohol.'
    carbAdjust = '+10–20g carbs — serotonin and mood support'
  } else if (dayOfCycle <= 13) {
    phase      = 'Follicular'
    color      = '#10b981'
    emoji      = '🌒'
    tagline    = 'Energy rising — build momentum'
    training   = 'Oestrogen is climbing — strength, endurance and mood improve daily. Great phase for progressive overload, learning new skills and pushing training volume. Recovery is faster.'
    nutrition  = 'Normal macro targets. Oestrogen supports muscle protein synthesis — keep protein high. Carbohydrate tolerance is good; fuel training sessions well.'
    carbAdjust = 'Normal targets'
  } else if (dayOfCycle <= 15) {
    phase      = 'Ovulatory'
    color      = '#f59e0b'
    emoji      = '🌕'
    tagline    = 'Peak power — your strongest window'
    training   = 'Oestrogen peaks — this is your strongest, most coordinated phase. Ideal for PB attempts, high-intensity conditioning, and maximal effort sessions. Pain tolerance is highest.'
    nutrition  = 'Normal macro targets. Fuel well around training. Some clients experience reduced appetite — ensure you\'re eating enough to support performance.'
    carbAdjust = 'Normal targets — fuel for performance'
  } else {
    phase      = 'Luteal'
    color      = '#8b5cf6'
    emoji      = '🌖'
    tagline    = 'Progesterone phase — train smart'
    training   = 'Progesterone raises core temperature and BMR. Fatigue and cravings are common in late luteal. Moderate intensity — reduce volume by 10–20% in the final week. Technique and steady-state work respond well.'
    nutrition  = 'BMR rises ~100–200 kcal — don\'t under-eat. Increase healthy fats and complex carbs to manage cravings. Reduce sodium to minimise bloating. Magnesium before bed helps sleep and PMS symptoms.'
    carbAdjust = '+20–30g carbs — higher BMR and cravings'
  }

  return {
    phase,
    color,
    emoji,
    tagline,
    training,
    nutrition,
    carbAdjust,
    dayOfCycle,
    cycleLength,
    daysUntilNext,
    progressPct,
  }
}
