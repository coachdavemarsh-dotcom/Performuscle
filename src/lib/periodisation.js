// ─── Event type definitions ───────────────────────────────────────────────────

export const EVENT_TYPES = [
  { value: 'hyrox',         label: 'HYROX',              icon: '🏃' },
  { value: 'marathon',      label: 'Marathon',            icon: '🏅' },
  { value: 'half_marathon', label: 'Half Marathon',       icon: '🏃‍♂️' },
  { value: 'sprint_tri',    label: 'Sprint Triathlon',    icon: '🏊' },
  { value: 'physique',      label: 'Physique / Photoshoot', icon: '💪' },
]

export const PHASE_TYPE_COLORS = {
  corrective: '#f472b6',
  base:       '#60a5fa',
  build:      '#f97316',
  peak:       '#ef4444',
  taper:      '#00C896',
}

// ─── Phase blueprints per event type ─────────────────────────────────────────
// Each entry: key, label, phase_type, defaultWeeks, minWeeks, maxWeeks,
//             suggested_template_id, desc

const BLUEPRINTS = {
  hyrox: [
    {
      key: 'corrective', label: 'Structural Balance', phase_type: 'corrective',
      defaultWeeks: 4, minWeeks: 2, maxWeeks: 6,
      suggested_template_id: 'structural-balance-full',
      desc: 'Address muscular imbalances, joint health, and movement quality before loading begins.',
    },
    {
      key: 'base', label: 'HYROX Foundation', phase_type: 'base',
      defaultWeeks: 8, minWeeks: 4, maxWeeks: 12,
      suggested_template_id: 'hyrox-prep-base',
      desc: 'Build aerobic base and HYROX-specific movement patterns across all stations.',
    },
    {
      key: 'build', label: 'HYROX Build', phase_type: 'build',
      defaultWeeks: 8, minWeeks: 4, maxWeeks: 12,
      suggested_template_id: 'hyrox-prep-phase2',
      desc: 'Increase intensity, station-specific conditioning, and competition volume.',
    },
    {
      key: 'peak', label: 'Race Prep', phase_type: 'peak',
      defaultWeeks: 6, minWeeks: 3, maxWeeks: 8,
      suggested_template_id: 'hyrox-12wk-4day',
      desc: 'Race simulations, peak loading, and HYROX-specific race preparation.',
    },
    {
      key: 'taper', label: 'Taper', phase_type: 'taper',
      defaultWeeks: 2, minWeeks: 1, maxWeeks: 3,
      suggested_template_id: null,
      desc: 'Reduce volume, maintain intensity. Arrive fresh and sharp on race day.',
    },
  ],

  marathon: [
    {
      key: 'base', label: 'Aerobic Base', phase_type: 'base',
      defaultWeeks: 6, minWeeks: 4, maxWeeks: 10,
      suggested_template_id: 'endurance-marathon-16wk',
      desc: 'Build your aerobic engine and establish consistent weekly mileage.',
    },
    {
      key: 'build', label: 'Marathon Build', phase_type: 'build',
      defaultWeeks: 7, minWeeks: 4, maxWeeks: 10,
      suggested_template_id: 'endurance-marathon-16wk-4day',
      desc: 'Increase long run volume, introduce tempo and marathon-pace work.',
    },
    {
      key: 'peak', label: 'Race Prep', phase_type: 'peak',
      defaultWeeks: 3, minWeeks: 2, maxWeeks: 5,
      suggested_template_id: 'endurance-marathon-16wk-3day',
      desc: 'Peak long runs, race-pace intervals, and final high-volume weeks.',
    },
    {
      key: 'taper', label: 'Taper', phase_type: 'taper',
      defaultWeeks: 3, minWeeks: 2, maxWeeks: 3,
      suggested_template_id: null,
      desc: 'Reduce mileage while maintaining intensity. Trust the training.',
    },
  ],

  half_marathon: [
    {
      key: 'base', label: 'Aerobic Base', phase_type: 'base',
      defaultWeeks: 5, minWeeks: 3, maxWeeks: 8,
      suggested_template_id: 'endurance-hm-12wk',
      desc: 'Build your aerobic engine and establish consistent weekly mileage.',
    },
    {
      key: 'build', label: 'Half Marathon Build', phase_type: 'build',
      defaultWeeks: 4, minWeeks: 3, maxWeeks: 7,
      suggested_template_id: 'endurance-hm-12wk-4day',
      desc: 'Increase volume, introduce threshold runs and race-pace work.',
    },
    {
      key: 'peak', label: 'Race Prep', phase_type: 'peak',
      defaultWeeks: 3, minWeeks: 2, maxWeeks: 4,
      suggested_template_id: 'endurance-hm-12wk-3day',
      desc: 'Race simulations, peak volume, and final hard weeks before taper.',
    },
    {
      key: 'taper', label: 'Taper', phase_type: 'taper',
      defaultWeeks: 2, minWeeks: 1, maxWeeks: 2,
      suggested_template_id: null,
      desc: 'Two weeks of reduced load. Keep the sharpness, lose the fatigue.',
    },
  ],

  sprint_tri: [
    {
      key: 'base', label: 'Tri Base', phase_type: 'base',
      defaultWeeks: 6, minWeeks: 4, maxWeeks: 10,
      suggested_template_id: 'sprint-tri-12wk-5day',
      desc: 'Build aerobic base across swim, bike, and run. Establish technique.',
    },
    {
      key: 'build', label: 'Tri Build', phase_type: 'build',
      defaultWeeks: 4, minWeeks: 3, maxWeeks: 8,
      suggested_template_id: 'sprint-tri-12wk-6day',
      desc: 'Increase training density, add bricks, and introduce race-pace intervals.',
    },
    {
      key: 'peak', label: 'Race Prep', phase_type: 'peak',
      defaultWeeks: 3, minWeeks: 2, maxWeeks: 4,
      suggested_template_id: null,
      desc: 'Race simulations, transition practice, and final tune-up sessions.',
    },
    {
      key: 'taper', label: 'Taper', phase_type: 'taper',
      defaultWeeks: 2, minWeeks: 1, maxWeeks: 2,
      suggested_template_id: null,
      desc: 'Sharpen up. Trust your base. Race day ready.',
    },
  ],

  physique: [
    {
      key: 'foundation', label: 'Structural Balance', phase_type: 'corrective',
      defaultWeeks: 4, minWeeks: 3, maxWeeks: 5,
      suggested_template_id: 'structural-balance-full',
      desc: 'Address imbalances and build a solid structural foundation for high-volume training.',
    },
    {
      key: 'hypertrophy', label: 'Hypertrophy Block', phase_type: 'base',
      defaultWeeks: 8, minWeeks: 6, maxWeeks: 16,
      suggested_template_id: 'gvt-classic',
      desc: 'Maximise muscle mass accumulation with high-volume GVT training.',
    },
    {
      key: 'recomp', label: 'Body Recomp', phase_type: 'build',
      defaultWeeks: 6, minWeeks: 4, maxWeeks: 10,
      suggested_template_id: 'gbc-body-comp',
      desc: 'Maintain muscle mass while beginning the body composition transformation.',
    },
    {
      key: 'cut', label: 'Lean Down / Peak', phase_type: 'peak',
      defaultWeeks: 6, minWeeks: 4, maxWeeks: 8,
      suggested_template_id: 'gbc-body-comp',
      desc: 'Final conditioning, carb cycling, and physique shoot preparation.',
    },
    {
      key: 'peak_week', label: 'Peak Week', phase_type: 'taper',
      defaultWeeks: 1, minWeeks: 1, maxWeeks: 1,
      suggested_template_id: null,
      desc: 'Final prep. Water, carbs, and last touches before the shoot.',
    },
  ],
}

// ─── Phase generator ──────────────────────────────────────────────────────────

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000

function uid() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/**
 * Generate suggested phases for an event plan.
 * Works backwards from eventDate, scales phase weeks to fit available time.
 * @param {string} eventType - key in BLUEPRINTS
 * @param {string|Date} eventDate
 * @param {string|Date} [startDate=today]
 * @returns {Array} phase objects
 */
export function generatePhases(eventType, eventDate, startDate = new Date()) {
  const blueprints = BLUEPRINTS[eventType]
  if (!blueprints) return []

  const eventMs = new Date(eventDate).getTime()
  const startMs = new Date(startDate).getTime()
  const totalWeeks = Math.max(1, Math.floor((eventMs - startMs) / MS_PER_WEEK))

  const minTotal     = blueprints.reduce((s, p) => s + p.minWeeks, 0)
  const defaultTotal = blueprints.reduce((s, p) => s + p.defaultWeeks, 0)

  let allocated

  if (totalWeeks <= minTotal) {
    // Squeeze everything to minimums, then trim early phases
    allocated = blueprints.map(p => p.minWeeks)
    let excess = allocated.reduce((s, w) => s + w, 0) - totalWeeks
    for (let i = 0; i < allocated.length && excess > 0; i++) {
      const trim = Math.min(excess, allocated[i])
      allocated[i] -= trim
      excess -= trim
    }
  } else {
    const scale = totalWeeks / defaultTotal
    allocated = blueprints.map(p =>
      Math.max(p.minWeeks, Math.min(p.maxWeeks, Math.round(p.defaultWeeks * scale)))
    )
    // Distribute leftover weeks into middle (base/build) phases
    let diff = totalWeeks - allocated.reduce((s, w) => s + w, 0)
    const mid = blueprints.map((p, i) => i).filter(i => i > 0 && i < blueprints.length - 1)
    let attempts = 0
    let ai = 0
    while (diff !== 0 && mid.length > 0 && attempts < mid.length * 20) {
      const idx = mid[ai % mid.length]
      if (diff > 0 && allocated[idx] < blueprints[idx].maxWeeks) { allocated[idx]++; diff-- }
      else if (diff < 0 && allocated[idx] > blueprints[idx].minWeeks) { allocated[idx]--; diff++ }
      ai++; attempts++
    }
  }

  // Build dated phase objects
  let cursor = new Date(startDate)
  return blueprints.map((bp, i) => {
    if (allocated[i] === 0) return null
    const start = new Date(cursor)
    const end   = new Date(cursor.getTime() + allocated[i] * MS_PER_WEEK - 86400000)
    cursor      = new Date(cursor.getTime() + allocated[i] * MS_PER_WEEK)
    return {
      id:                   uid(),
      key:                  bp.key,
      label:                bp.label,
      phase_type:           bp.phase_type,
      weeks:                allocated[i],
      start_date:           start.toISOString().split('T')[0],
      end_date:             end.toISOString().split('T')[0],
      suggested_template_id: bp.suggested_template_id,
      program_id:           null,
      color:                PHASE_TYPE_COLORS[bp.phase_type] || 'var(--accent)',
      description:          bp.desc,
      notes:                '',
    }
  }).filter(Boolean)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Weeks between two dates (rounded) */
export function weeksBetween(a, b) {
  return Math.round(Math.abs(new Date(b) - new Date(a)) / MS_PER_WEEK)
}

/** Days between two dates (positive = b is later) */
export function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000)
}

/** Which phase index is "current" based on today */
export function currentPhaseIndex(phases) {
  const today = new Date().toISOString().split('T')[0]
  for (let i = 0; i < phases.length; i++) {
    if (today >= phases[i].start_date && today <= phases[i].end_date) return i
  }
  if (phases.length > 0 && today < phases[0].start_date) return -1   // not started
  return phases.length                                                 // finished
}

export function formatEventDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
