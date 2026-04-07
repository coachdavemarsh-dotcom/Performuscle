// ============================================================
// PERFORMUSCLE — Training Methods Programme Templates
// Generated sessions use the Poliquin / Training Methods system
// ============================================================

// ─── GVT Classic Day Definitions ─────────────────────────────────────────────

const GVT_CLASSIC_DAYS = [
  {
    day_label: 'Day 1 — Lower Body',
    session_type: 'strength',
    exercises: [
      { name: 'Back Squat',       set_count: 10, rep_range: '10', tempo: '4010', rest_seconds: 60,  notes: 'Superset with A2 — 60s rest after A2', order_index: 0, superset_group: 'A1' },
      { name: 'Lying Leg Curl',   set_count: 10, rep_range: '10', tempo: '4010', rest_seconds: 60,  notes: 'Rest 60s then return to A1',            order_index: 1, superset_group: 'A2' },
      { name: 'Split Squat',      set_count: 3,  rep_range: '12-15', tempo: '3010', rest_seconds: 60,  notes: null,                                 order_index: 2, superset_group: 'B1' },
      { name: 'Reverse Hyper',    set_count: 3,  rep_range: '12-15', tempo: '3010', rest_seconds: 60,  notes: null,                                 order_index: 3, superset_group: 'B2' },
    ],
  },
  {
    day_label: 'Day 2 — Torso',
    session_type: 'strength',
    exercises: [
      { name: 'Flat DB Press',    set_count: 10, rep_range: '10', tempo: '4010', rest_seconds: 60,  notes: null, order_index: 0, superset_group: 'A1' },
      { name: 'Pullup',           set_count: 10, rep_range: '10', tempo: '4010', rest_seconds: 60,  notes: null, order_index: 1, superset_group: 'A2' },
      { name: 'Flat DB Fly',      set_count: 3,  rep_range: '12-15', tempo: '3010', rest_seconds: 60,  notes: null, order_index: 2, superset_group: 'B1' },
      { name: 'Bent Over Row',    set_count: 3,  rep_range: '12-15', tempo: '3010', rest_seconds: 60,  notes: null, order_index: 3, superset_group: 'B2' },
    ],
  },
  {
    day_label: 'Day 3 — Arms & Delts',
    session_type: 'strength',
    exercises: [
      { name: 'Close Grip Bench Press',    set_count: 10, rep_range: '10', tempo: '4010', rest_seconds: 60,  notes: null, order_index: 0, superset_group: 'A1' },
      { name: 'Scott Hammer Curl',         set_count: 10, rep_range: '10', tempo: '4010', rest_seconds: 60,  notes: null, order_index: 1, superset_group: 'A2' },
      { name: 'Seated Lateral Raise',      set_count: 3,  rep_range: '12-15', tempo: '3010', rest_seconds: 60,  notes: null, order_index: 2, superset_group: 'B1' },
      { name: '60° Prone Lateral Raise',   set_count: 3,  rep_range: '12-15', tempo: '3010', rest_seconds: 60,  notes: null, order_index: 3, superset_group: 'B2' },
    ],
  },
]

// ─── GVT Advanced Day Definitions ────────────────────────────────────────────

function buildGvtAdvancedDays(repRange) {
  return [
    {
      day_label: 'Day 1 — Lower Body',
      session_type: 'strength',
      exercises: [
        { name: 'Back Squat',    set_count: 10, rep_range: repRange, tempo: '4010', rest_seconds: 90,  notes: null, order_index: 0, superset_group: 'A1' },
        { name: 'Lying Leg Curl', set_count: 10, rep_range: repRange, tempo: '4010', rest_seconds: 90,  notes: null, order_index: 1, superset_group: 'A2' },
        { name: 'Split Squat',   set_count: 3,  rep_range: '8-10',   tempo: '3010', rest_seconds: 60,  notes: null, order_index: 2, superset_group: 'B1' },
        { name: 'Reverse Hyper', set_count: 3,  rep_range: '8-10',   tempo: '3010', rest_seconds: 60,  notes: null, order_index: 3, superset_group: 'B2' },
      ],
    },
    {
      day_label: 'Day 2 — Torso',
      session_type: 'strength',
      exercises: [
        { name: 'Flat DB Press',   set_count: 10, rep_range: repRange, tempo: '4010', rest_seconds: 90,  notes: null, order_index: 0, superset_group: 'A1' },
        { name: 'Chin-up',         set_count: 10, rep_range: repRange, tempo: '4010', rest_seconds: 90,  notes: null, order_index: 1, superset_group: 'A2' },
        { name: 'Flat DB Fly',     set_count: 3,  rep_range: '8-10',  tempo: '3010', rest_seconds: 60,  notes: null, order_index: 2, superset_group: 'B1' },
        { name: 'Bent Over Row',   set_count: 3,  rep_range: '8-10',  tempo: '3010', rest_seconds: 60,  notes: null, order_index: 3, superset_group: 'B2' },
      ],
    },
    {
      day_label: 'Day 3 — Arms & Delts',
      session_type: 'strength',
      exercises: [
        { name: 'Close Grip Bench', set_count: 10, rep_range: repRange, tempo: '4010', rest_seconds: 90,  notes: null, order_index: 0, superset_group: 'A1' },
        { name: 'Barbell Curl',     set_count: 10, rep_range: repRange, tempo: '4010', rest_seconds: 90,  notes: null, order_index: 1, superset_group: 'A2' },
        { name: 'Lateral Raise',    set_count: 3,  rep_range: '10-12', tempo: '3010', rest_seconds: 60,  notes: null, order_index: 2, superset_group: 'B1' },
        { name: 'Rear Delt Fly',    set_count: 3,  rep_range: '10-12', tempo: '3010', rest_seconds: 60,  notes: null, order_index: 3, superset_group: 'B2' },
      ],
    },
  ]
}

// ─── GBC Day Definitions ──────────────────────────────────────────────────────

const GBC_DAY_A = {
  day_label: 'Day A — Full Body',
  session_type: 'mixed',
  exercises: [
    { name: 'Back Squat',                          set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 0, superset_group: 'A1' },
    { name: 'Lean Away Pullup (or Lat Pulldown)',  set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 1, superset_group: 'A2' },
    { name: 'Lying Leg Curl',                      set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 2, superset_group: 'B1' },
    { name: 'Low Incline DB Press',                set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 3, superset_group: 'B2' },
    { name: 'Seated Shoulder Press',               set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 45, notes: null, order_index: 4, superset_group: 'C1' },
    { name: 'Triceps Pressdown',                   set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 45, notes: null, order_index: 5, superset_group: 'C2' },
    { name: 'Scott Curl',                          set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 45, notes: null, order_index: 6, superset_group: 'C3' },
  ],
}

const GBC_DAY_B = {
  day_label: 'Day B — Full Body',
  session_type: 'mixed',
  exercises: [
    { name: 'Snatch Grip Deadlift',  set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 0, superset_group: 'A1' },
    { name: '45° Incline DB Press',  set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 1, superset_group: 'A2' },
    { name: 'Split Squat',           set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 2, superset_group: 'B1' },
    { name: 'Bent Over Row',         set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 3, superset_group: 'B2' },
    { name: 'Push Jerk',             set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 45, notes: null, order_index: 4, superset_group: 'C1' },
    { name: 'Romanian Deadlift',     set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 45, notes: null, order_index: 5, superset_group: 'C2' },
    { name: 'Hanging Leg Raise',     set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 45, notes: null, order_index: 6, superset_group: 'C3' },
  ],
}

// ─── Linear Beginner Day Definitions ─────────────────────────────────────────

function buildLinearBeginnerDay(dayLetter, repRange, phaseNotes) {
  if (dayLetter === 'A') {
    return {
      day_label: 'Day A — Full Body',
      session_type: 'strength',
      exercises: [
        { name: 'Back Squat',            set_count: 3, rep_range: repRange, tempo: '3010', rest_seconds: 90, notes: phaseNotes, order_index: 0, superset_group: 'A1' },
        { name: 'Romanian Deadlift',     set_count: 3, rep_range: repRange, tempo: '3010', rest_seconds: 90, notes: null,       order_index: 1, superset_group: 'A2' },
        { name: 'Flat DB Press',         set_count: 3, rep_range: repRange, tempo: '3010', rest_seconds: 90, notes: null,       order_index: 2, superset_group: 'B1' },
        { name: 'Seated Cable Row',      set_count: 3, rep_range: repRange, tempo: '3010', rest_seconds: 90, notes: null,       order_index: 3, superset_group: 'B2' },
        { name: 'Seated Shoulder Press', set_count: 3, rep_range: repRange, tempo: '3010', rest_seconds: 75, notes: null,       order_index: 4, superset_group: 'C1' },
        { name: 'Barbell Curl',          set_count: 2, rep_range: repRange, tempo: '3010', rest_seconds: 60, notes: null,       order_index: 5, superset_group: 'C2' },
        { name: 'Triceps Pressdown',     set_count: 2, rep_range: repRange, tempo: '3010', rest_seconds: 60, notes: null,       order_index: 6, superset_group: 'C3' },
      ],
    }
  }
  return {
    day_label: 'Day B — Full Body',
    session_type: 'strength',
    exercises: [
      { name: 'Leg Press',                    set_count: 3, rep_range: repRange, tempo: '3010', rest_seconds: 90, notes: phaseNotes, order_index: 0, superset_group: 'A1' },
      { name: 'Lying Leg Curl',               set_count: 3, rep_range: repRange, tempo: '3010', rest_seconds: 90, notes: null,       order_index: 1, superset_group: 'A2' },
      { name: 'Incline DB Press',             set_count: 3, rep_range: repRange, tempo: '3010', rest_seconds: 90, notes: null,       order_index: 2, superset_group: 'B1' },
      { name: 'Lat Pulldown',                 set_count: 3, rep_range: repRange, tempo: '3010', rest_seconds: 90, notes: null,       order_index: 3, superset_group: 'B2' },
      { name: 'Lateral Raise',                set_count: 3, rep_range: repRange, tempo: '3010', rest_seconds: 60, notes: null,       order_index: 4, superset_group: 'C1' },
      { name: 'Hammer Curl',                  set_count: 2, rep_range: repRange, tempo: '3010', rest_seconds: 60, notes: null,       order_index: 5, superset_group: 'C2' },
      { name: 'Overhead Triceps Extension',   set_count: 2, rep_range: repRange, tempo: '3010', rest_seconds: 60, notes: null,       order_index: 6, superset_group: 'C3' },
    ],
  }
}

// ─── Linear Intermediate Day Definitions ─────────────────────────────────────

function buildLinearIntermediateDays(repRange) {
  return [
    {
      day_label: 'Lower A',
      session_type: 'strength',
      exercises: [
        { name: 'Back Squat',         set_count: 4, rep_range: repRange,  tempo: '4010', rest_seconds: 120, notes: null,                                order_index: 0, superset_group: null },
        { name: 'Romanian Deadlift',  set_count: 4, rep_range: repRange,  tempo: '3010', rest_seconds: 120, notes: null,                                order_index: 1, superset_group: null },
        { name: 'Leg Press',          set_count: 3, rep_range: repRange,  tempo: '3010', rest_seconds: 90,  notes: null,                                order_index: 2, superset_group: 'C1' },
        { name: 'Lying Leg Curl',     set_count: 3, rep_range: repRange,  tempo: '3010', rest_seconds: 90,  notes: null,                                order_index: 3, superset_group: 'C2' },
        { name: 'Calf Raise',         set_count: 3, rep_range: '15-20',  tempo: '2020', rest_seconds: 60,  notes: 'Fixed reps regardless of phase',    order_index: 4, superset_group: null },
      ],
    },
    {
      day_label: 'Upper A',
      session_type: 'strength',
      exercises: [
        { name: 'Flat Barbell Bench Press', set_count: 4, rep_range: repRange,  tempo: '4010', rest_seconds: 120, notes: null, order_index: 0, superset_group: null },
        { name: 'Bent Over Barbell Row',    set_count: 4, rep_range: repRange,  tempo: '3010', rest_seconds: 120, notes: null, order_index: 1, superset_group: null },
        { name: 'Incline DB Press',         set_count: 3, rep_range: repRange,  tempo: '3010', rest_seconds: 90,  notes: null, order_index: 2, superset_group: 'C1' },
        { name: 'Seated Cable Row',         set_count: 3, rep_range: repRange,  tempo: '3010', rest_seconds: 90,  notes: null, order_index: 3, superset_group: 'C2' },
        { name: 'Lateral Raise',            set_count: 3, rep_range: '12-15',  tempo: '2010', rest_seconds: 60,  notes: null, order_index: 4, superset_group: 'D1' },
        { name: 'Barbell Curl',             set_count: 3, rep_range: repRange,  tempo: '3010', rest_seconds: 60,  notes: null, order_index: 5, superset_group: 'D2' },
      ],
    },
    {
      day_label: 'Lower B',
      session_type: 'strength',
      exercises: [
        { name: 'Deadlift',           set_count: 4, rep_range: repRange, tempo: '3010', rest_seconds: 120, notes: null,                             order_index: 0, superset_group: null },
        { name: 'Front Squat',        set_count: 4, rep_range: repRange, tempo: '3010', rest_seconds: 120, notes: null,                             order_index: 1, superset_group: null },
        { name: 'Split Squat',        set_count: 3, rep_range: repRange, tempo: '3010', rest_seconds: 90,  notes: null,                             order_index: 2, superset_group: 'C1' },
        { name: '45° Back Extension', set_count: 3, rep_range: repRange, tempo: '3010', rest_seconds: 90,  notes: null,                             order_index: 3, superset_group: 'C2' },
        { name: 'Calf Raise',         set_count: 3, rep_range: '15-20', tempo: '2020', rest_seconds: 60,  notes: 'Fixed reps regardless of phase', order_index: 4, superset_group: null },
      ],
    },
    {
      day_label: 'Upper B',
      session_type: 'strength',
      exercises: [
        { name: 'Overhead Press',     set_count: 4, rep_range: repRange,  tempo: '3010', rest_seconds: 120, notes: null, order_index: 0, superset_group: null },
        { name: 'Chin-up',            set_count: 4, rep_range: repRange,  tempo: '3010', rest_seconds: 120, notes: null, order_index: 1, superset_group: null },
        { name: 'Flat DB Press',      set_count: 3, rep_range: repRange,  tempo: '3010', rest_seconds: 90,  notes: null, order_index: 2, superset_group: 'C1' },
        { name: 'Lat Pulldown',       set_count: 3, rep_range: repRange,  tempo: '3010', rest_seconds: 90,  notes: null, order_index: 3, superset_group: 'C2' },
        { name: 'Rear Delt Fly',      set_count: 3, rep_range: '12-15',  tempo: '2010', rest_seconds: 60,  notes: null, order_index: 4, superset_group: 'D1' },
        { name: 'Close Grip Bench',   set_count: 3, rep_range: repRange,  tempo: '3010', rest_seconds: 60,  notes: null, order_index: 5, superset_group: 'D2' },
      ],
    },
  ]
}

// ─── DUP Day Definitions ──────────────────────────────────────────────────────

const DUP_DAYS = [
  {
    day_label: 'Lower — Max Strength',
    session_type: 'strength',
    exercises: [
      { name: 'Back Squat',        set_count: 6, rep_range: '2-4',  tempo: '40X0',     rest_seconds: 180, notes: 'Work up to working weight at RPE 8', order_index: 0, superset_group: null },
      { name: 'Deadlift',          set_count: 5, rep_range: '2-4',  tempo: '31X0',     rest_seconds: 180, notes: null, order_index: 1, superset_group: null },
      { name: 'Romanian Deadlift', set_count: 3, rep_range: '5-7',  tempo: '3010',     rest_seconds: 90,  notes: null, order_index: 2, superset_group: 'C1' },
      { name: 'Leg Curl',          set_count: 3, rep_range: '5-7',  tempo: '3010',     rest_seconds: 90,  notes: null, order_index: 3, superset_group: 'C2' },
      { name: 'Weighted Plank',    set_count: 3, rep_range: '30s',  tempo: 'hold',     rest_seconds: 60,  notes: null, order_index: 4, superset_group: null },
    ],
  },
  {
    day_label: 'Upper — Max Strength',
    session_type: 'strength',
    exercises: [
      { name: 'Bench Press',          set_count: 6, rep_range: '2-4',  tempo: '40X0', rest_seconds: 180, notes: null, order_index: 0, superset_group: null },
      { name: 'Bent Over Row',        set_count: 5, rep_range: '3-5',  tempo: '31X0', rest_seconds: 150, notes: null, order_index: 1, superset_group: null },
      { name: 'Overhead Press',       set_count: 4, rep_range: '4-6',  tempo: '3010', rest_seconds: 120, notes: null, order_index: 2, superset_group: null },
      { name: 'Weighted Chin-up',     set_count: 3, rep_range: '4-6',  tempo: '3010', rest_seconds: 90,  notes: null, order_index: 3, superset_group: 'D1' },
      { name: 'Close Grip Bench',     set_count: 3, rep_range: '5-7',  tempo: '3010', rest_seconds: 90,  notes: null, order_index: 4, superset_group: 'D2' },
    ],
  },
  {
    day_label: 'Lower — Hypertrophy',
    session_type: 'strength',
    exercises: [
      { name: 'Front Squat',     set_count: 5, rep_range: '8-10',  tempo: '4010',     rest_seconds: 90,  notes: null, order_index: 0, superset_group: null },
      { name: 'Leg Press',       set_count: 4, rep_range: '10-12', tempo: '3010',     rest_seconds: 90,  notes: null, order_index: 1, superset_group: null },
      { name: 'Walking Lunge',   set_count: 3, rep_range: '12 each', tempo: '2010',   rest_seconds: 75,  notes: null, order_index: 2, superset_group: 'C1' },
      { name: 'Leg Curl',        set_count: 3, rep_range: '10-12', tempo: '3010',     rest_seconds: 75,  notes: null, order_index: 3, superset_group: 'C2' },
      { name: 'Calf Raise',      set_count: 4, rep_range: '15-20', tempo: '2020',     rest_seconds: 45,  notes: null, order_index: 4, superset_group: 'D1' },
      { name: 'Abs Circuit',     set_count: 3, rep_range: '15',    tempo: 'controlled', rest_seconds: 45, notes: null, order_index: 5, superset_group: 'D2' },
    ],
  },
  {
    day_label: 'Upper — Hypertrophy',
    session_type: 'strength',
    exercises: [
      { name: 'Incline DB Press',             set_count: 5, rep_range: '8-10',  tempo: '4010', rest_seconds: 90,  notes: null, order_index: 0, superset_group: null },
      { name: 'Lat Pulldown',                 set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 90,  notes: null, order_index: 1, superset_group: null },
      { name: 'Cable Fly',                    set_count: 3, rep_range: '12-15', tempo: '2011', rest_seconds: 75,  notes: null, order_index: 2, superset_group: 'C1' },
      { name: 'Seated Cable Row',             set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 75,  notes: null, order_index: 3, superset_group: 'C2' },
      { name: 'Lateral Raise',                set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 60,  notes: null, order_index: 4, superset_group: 'D1' },
      { name: 'Hammer Curl',                  set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60,  notes: null, order_index: 5, superset_group: 'D2' },
      { name: 'Overhead Triceps Extension',   set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60,  notes: null, order_index: 6, superset_group: 'D3' },
    ],
  },
]

// ─── 6-12-25 Day Definitions ──────────────────────────────────────────────────

const SIX_TWELVE_TWENTYFIVE_DAYS = [
  {
    day_label: 'Day A — Lower',
    session_type: 'mixed',
    exercises: [
      { name: 'Front Squat',    set_count: 4, rep_range: '6',        tempo: '40X0', rest_seconds: 10,  notes: 'Tri-set: go straight to A2', order_index: 0, superset_group: 'A1' },
      { name: 'Back Squat',     set_count: 4, rep_range: '12',       tempo: '3010', rest_seconds: 10,  notes: 'Go straight to A3',          order_index: 1, superset_group: 'A2' },
      { name: 'Walking Lunge',  set_count: 4, rep_range: '25 steps', tempo: '2010', rest_seconds: 120, notes: 'Rest 2 min then repeat',     order_index: 2, superset_group: 'A3' },
      { name: 'Hack Squat',     set_count: 3, rep_range: '6',        tempo: '40X0', rest_seconds: 10,  notes: null, order_index: 3, superset_group: 'B1' },
      { name: 'Leg Press',      set_count: 3, rep_range: '12',       tempo: '3010', rest_seconds: 10,  notes: null, order_index: 4, superset_group: 'B2' },
      { name: 'Leg Extension',  set_count: 3, rep_range: '25',       tempo: '2010', rest_seconds: 120, notes: null, order_index: 5, superset_group: 'B3' },
    ],
  },
  {
    day_label: 'Day B — Upper',
    session_type: 'mixed',
    exercises: [
      { name: 'Close Grip Bench Press',   set_count: 4, rep_range: '6',  tempo: '40X0', rest_seconds: 10,  notes: null, order_index: 0, superset_group: 'A1' },
      { name: 'Flat DB Press',            set_count: 4, rep_range: '12', tempo: '3010', rest_seconds: 10,  notes: null, order_index: 1, superset_group: 'A2' },
      { name: 'Push-Up',                  set_count: 4, rep_range: '25', tempo: '2010', rest_seconds: 120, notes: null, order_index: 2, superset_group: 'A3' },
      { name: 'Weighted Chin-up',         set_count: 3, rep_range: '6',  tempo: '40X0', rest_seconds: 10,  notes: null, order_index: 3, superset_group: 'B1' },
      { name: 'Lat Pulldown',             set_count: 3, rep_range: '12', tempo: '3010', rest_seconds: 10,  notes: null, order_index: 4, superset_group: 'B2' },
      { name: 'Straight Arm Pulldown',    set_count: 3, rep_range: '25', tempo: '2010', rest_seconds: 120, notes: null, order_index: 5, superset_group: 'B3' },
    ],
  },
  {
    day_label: 'Day C — Full Body',
    session_type: 'mixed',
    exercises: [
      { name: 'Push Press',          set_count: 4, rep_range: '6',  tempo: 'X0X0', rest_seconds: 10,  notes: null, order_index: 0, superset_group: 'A1' },
      { name: 'Lateral Raise',       set_count: 4, rep_range: '12', tempo: '2010', rest_seconds: 10,  notes: null, order_index: 1, superset_group: 'A2' },
      { name: 'Band Pull-Apart',     set_count: 4, rep_range: '25', tempo: '1010', rest_seconds: 90,  notes: null, order_index: 2, superset_group: 'A3' },
      { name: 'Romanian Deadlift',   set_count: 3, rep_range: '6',  tempo: '40X0', rest_seconds: 10,  notes: null, order_index: 3, superset_group: 'B1' },
      { name: '45° Back Extension',  set_count: 3, rep_range: '12', tempo: '3010', rest_seconds: 10,  notes: null, order_index: 4, superset_group: 'B2' },
      { name: 'Glute Bridge',        set_count: 3, rep_range: '25', tempo: '1011', rest_seconds: 90,  notes: null, order_index: 5, superset_group: 'B3' },
    ],
  },
]

// ─── POF Day Definitions ──────────────────────────────────────────────────────

const POF_DAYS = [
  {
    day_label: 'Day A — Push',
    session_type: 'strength',
    exercises: [
      { name: 'Flat DB Press',                set_count: 4, rep_range: '6-8',   tempo: '4010', rest_seconds: 180, notes: 'Midrange — power movement',              order_index: 0, superset_group: null },
      { name: 'Cable Fly',                    set_count: 3, rep_range: '10-12', tempo: '2011', rest_seconds: 90,  notes: 'Contracted — squeeze hard at peak',      order_index: 1, superset_group: null },
      { name: 'DB Pullover',                  set_count: 3, rep_range: '8-10',  tempo: '3210', rest_seconds: 120, notes: 'Lengthened — full stretch at bottom',    order_index: 2, superset_group: null },
      { name: 'Lateral Raise',               set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 75,  notes: 'Contracted position for delts',          order_index: 3, superset_group: null },
      { name: 'Overhead DB Press',            set_count: 3, rep_range: '8-10',  tempo: '3010', rest_seconds: 90,  notes: 'Midrange delt movement',                 order_index: 4, superset_group: null },
      { name: 'Overhead Triceps Extension',   set_count: 3, rep_range: '10-12', tempo: '3210', rest_seconds: 75,  notes: 'Lengthened triceps position',            order_index: 5, superset_group: null },
      { name: 'Triceps Pressdown',            set_count: 3, rep_range: '12-15', tempo: '2011', rest_seconds: 60,  notes: 'Contracted triceps position',            order_index: 6, superset_group: null },
    ],
  },
  {
    day_label: 'Day B — Pull',
    session_type: 'strength',
    exercises: [
      { name: 'Pullup',               set_count: 4, rep_range: '6-8',   tempo: '4010', rest_seconds: 180, notes: 'Midrange — power movement',           order_index: 0, superset_group: null },
      { name: 'Dual Rope Pulldown',   set_count: 3, rep_range: '10-12', tempo: '2022', rest_seconds: 90,  notes: 'Contracted back position',            order_index: 1, superset_group: null },
      { name: 'DB Pullover',          set_count: 3, rep_range: '8-10',  tempo: '3210', rest_seconds: 120, notes: 'Lengthened back position',            order_index: 2, superset_group: null },
      { name: 'Barbell Curl',         set_count: 3, rep_range: '6-8',   tempo: '4010', rest_seconds: 120, notes: 'Midrange bicep movement',             order_index: 3, superset_group: null },
      { name: 'Spider Curl',          set_count: 3, rep_range: '12-15', tempo: '2021', rest_seconds: 60,  notes: 'Contracted bicep position',           order_index: 4, superset_group: null },
      { name: 'Incline DB Curl',      set_count: 3, rep_range: '8-10',  tempo: '3210', rest_seconds: 90,  notes: 'Lengthened bicep position',           order_index: 5, superset_group: null },
      { name: 'Rear Delt Fly',        set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 60,  notes: 'Contracted rear delt',               order_index: 6, superset_group: null },
    ],
  },
  {
    day_label: 'Day C — Arms & Shoulders',
    session_type: 'strength',
    exercises: [
      { name: 'Close Grip Bench Press',     set_count: 4, rep_range: '6-8',   tempo: '4010', rest_seconds: 120, notes: 'Midrange triceps',                      order_index: 0, superset_group: null },
      { name: 'JM Press',                   set_count: 3, rep_range: '8-10',  tempo: '3010', rest_seconds: 90,  notes: null,                                    order_index: 1, superset_group: null },
      { name: 'Scott Curl',                 set_count: 3, rep_range: '8-10',  tempo: '3210', rest_seconds: 90,  notes: 'Midrange to contracted biceps',          order_index: 2, superset_group: null },
      { name: 'Overhead Triceps Extension', set_count: 3, rep_range: '10-12', tempo: '3210', rest_seconds: 75,  notes: 'Lengthened triceps',                    order_index: 3, superset_group: null },
      { name: 'Incline DB Curl',            set_count: 3, rep_range: '10-12', tempo: '3210', rest_seconds: 75,  notes: 'Lengthened biceps',                     order_index: 4, superset_group: null },
      { name: 'Seated Lateral Raise',       set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 60,  notes: null,                                    order_index: 5, superset_group: null },
      { name: '60° Prone Lateral Raise',    set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 60,  notes: null,                                    order_index: 6, superset_group: null },
    ],
  },
]

// ─── Phase helpers ────────────────────────────────────────────────────────────

const LINEAR_BEGINNER_PHASES = [
  { weeks: [1, 2, 3, 4],   repRange: '15-20', notes: 'Strength Endurance — focus on technique and tempo' },
  { weeks: [5, 6, 7, 8],   repRange: '12-15', notes: 'Strength Endurance — increasing load' },
  { weeks: [9, 10, 11, 12], repRange: '10-12', notes: 'Hypertrophy — controlled tempo, full ROM' },
  { weeks: [13, 14, 15, 16], repRange: '8-10', notes: 'Hypertrophy — progressive overload' },
]

const LINEAR_INTERMEDIATE_PHASES = [
  { weeks: [1, 2, 3, 4],    repRange: '12-15' },
  { weeks: [5, 6, 7, 8],    repRange: '10-12' },
  { weeks: [9, 10, 11, 12],  repRange: '8-10' },
  { weeks: [13, 14, 15, 16], repRange: '6-8' },
]

function getLinearBeginnerPhase(week) {
  return LINEAR_BEGINNER_PHASES.find(p => p.weeks.includes(week)) || LINEAR_BEGINNER_PHASES[0]
}

function getLinearIntermediatePhase(week) {
  return LINEAR_INTERMEDIATE_PHASES.find(p => p.weeks.includes(week)) || LINEAR_INTERMEDIATE_PHASES[0]
}

function getGvtAdvancedRepRange(week) {
  // Cycle: 1→5, 2→4, 3→3, 4→5, 5→4, 6→3
  const cycle = ((week - 1) % 3) + 1
  if (cycle === 1) return '5'
  if (cycle === 2) return '4'
  return '3'
}

// ============================================================
// PROGRAM TEMPLATES
// ============================================================

const RAW_PROGRAM_TEMPLATES = [

  // ─── 1. GVT Classic ─────────────────────────────────────────────────────────
  {
    id: 'gvt-classic',
    name: 'German Volume Training — Classic',
    description: '10 sets of 10 reps. The most effective hypertrophy method for building size. Three days targeting Lower Body, Torso, and Arms & Delts.',
    goal_type: 'lean_gain',
    phase: 'GPP Hypertrophy',
    default_weeks: 6,
    days_per_week: 3,
    difficulty: 'intermediate',
    icon: '🇩🇪',
    color: 'var(--accent)',
    tags: ['hypertrophy', 'gvt', 'superset', 'classic'],
    generateSessions: (weeks) => {
      const sessions = []
      for (let week = 1; week <= weeks; week++) {
        GVT_CLASSIC_DAYS.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ─── 2. GVT Advanced ────────────────────────────────────────────────────────
  {
    id: 'gvt-advanced',
    name: 'Advanced German Volume Training',
    description: 'Progressive overload across three rep schemes — 10×5, 10×4, 10×3 with a 4-5% load increase each workout. For experienced lifters only.',
    goal_type: 'gain',
    phase: 'Advanced Hypertrophy',
    default_weeks: 6,
    days_per_week: 3,
    difficulty: 'advanced',
    icon: '⚡',
    color: 'var(--accent)',
    tags: ['hypertrophy', 'gvt', 'advanced', 'strength'],
    generateSessions: (weeks) => {
      const sessions = []
      for (let week = 1; week <= weeks; week++) {
        const repRange = getGvtAdvancedRepRange(week)
        const days = buildGvtAdvancedDays(repRange)
        days.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ─── 3. GBC Body Comp ───────────────────────────────────────────────────────
  {
    id: 'gbc-body-comp',
    name: 'German Body Comp — Body Composition',
    description: 'Full-body supersets with upper/lower pairings. Builds muscle while burning fat. 3 days per week alternating two full-body workouts.',
    goal_type: 'cut',
    phase: 'Body Composition',
    default_weeks: 8,
    days_per_week: 3,
    difficulty: 'beginner',
    icon: '🔥',
    color: 'var(--warn)',
    tags: ['body-comp', 'gbc', 'fat-loss', 'superset', 'full-body'],
    generateSessions: (weeks) => {
      const sessions = []
      for (let week = 1; week <= weeks; week++) {
        const isOddWeek = week % 2 !== 0
        // Odd weeks: A B A, Even weeks: B A B
        const daySequence = isOddWeek
          ? [GBC_DAY_A, GBC_DAY_B, GBC_DAY_A]
          : [GBC_DAY_B, GBC_DAY_A, GBC_DAY_B]
        daySequence.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ─── 4. Linear Beginner ─────────────────────────────────────────────────────
  {
    id: 'linear-beginner',
    name: 'Linear Progression — Beginner',
    description: 'A classic 16-week programme taking you through four phases from strength endurance to hypertrophy. Perfect for your first year of structured training.',
    goal_type: 'lean_gain',
    phase: 'Linear Periodization',
    default_weeks: 16,
    days_per_week: 3,
    difficulty: 'beginner',
    icon: '📈',
    color: 'var(--info)',
    tags: ['linear', 'beginner', 'periodization', 'full-body'],
    generateSessions: (weeks) => {
      const sessions = []
      for (let week = 1; week <= weeks; week++) {
        const phase = getLinearBeginnerPhase(week)
        // Alternate A/B/A odd weeks, B/A/B even weeks
        const isOddWeek = week % 2 !== 0
        const dayLetters = isOddWeek ? ['A', 'B', 'A'] : ['B', 'A', 'B']
        dayLetters.forEach(letter => {
          const dayDef = buildLinearBeginnerDay(letter, phase.repRange, phase.notes)
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ─── 5. Linear Intermediate ─────────────────────────────────────────────────
  {
    id: 'linear-intermediate',
    name: 'Linear Progression — Intermediate',
    description: '16 weeks taking you from hypertrophy through functional hypertrophy into max strength. For those with 18+ months of solid training.',
    goal_type: 'gain',
    phase: 'Linear Periodization',
    default_weeks: 16,
    days_per_week: 4,
    difficulty: 'intermediate',
    icon: '📊',
    color: 'var(--info)',
    tags: ['linear', 'intermediate', 'periodization', 'upper-lower'],
    generateSessions: (weeks) => {
      const sessions = []
      for (let week = 1; week <= weeks; week++) {
        const phase = getLinearIntermediatePhase(week)
        const days = buildLinearIntermediateDays(phase.repRange)
        days.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ─── 6. DUP Strength & Size ─────────────────────────────────────────────────
  {
    id: 'dup-strength-size',
    name: 'DUP — Strength & Size',
    description: 'Daily Undulating Periodization with dedicated strength and hypertrophy days. 4 days per week, upper/lower split.',
    goal_type: 'gain',
    phase: 'DUP Strength/Hypertrophy',
    default_weeks: 8,
    days_per_week: 4,
    difficulty: 'intermediate',
    icon: '🔄',
    color: 'var(--purple)',
    tags: ['dup', 'strength', 'hypertrophy', 'upper-lower'],
    generateSessions: (weeks) => {
      const sessions = []
      for (let week = 1; week <= weeks; week++) {
        DUP_DAYS.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ─── 7. 6-12-25 Fat Loss Protocol ───────────────────────────────────────────
  {
    id: 'six-twelve-twentyfive',
    name: '6-12-25 Fat Loss Protocol',
    description: 'An advanced tri-set hitting all three muscle fibre types back to back. Intense, brutal, and extremely effective for body recomposition.',
    goal_type: 'cut',
    phase: 'Advanced Fat Loss',
    default_weeks: 4,
    days_per_week: 3,
    difficulty: 'advanced',
    icon: '💀',
    color: 'var(--danger)',
    tags: ['fat-loss', '6-12-25', 'tri-set', 'advanced', 'metabolic'],
    generateSessions: (weeks) => {
      const sessions = []
      for (let week = 1; week <= weeks; week++) {
        SIX_TWELVE_TWENTYFIVE_DAYS.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ─── 8. POF Upper Body ──────────────────────────────────────────────────────
  {
    id: 'pof-upper',
    name: 'Position of Flexion — Upper Body',
    description: 'Trains each muscle through its full range in three positions: midrange, contracted, and lengthened. The Muscle Nerds POF sequence for maximum muscle stimulus.',
    goal_type: 'lean_gain',
    phase: 'POF Hypertrophy',
    default_weeks: 6,
    days_per_week: 3,
    difficulty: 'intermediate',
    icon: '🎯',
    color: 'var(--accent)',
    tags: ['pof', 'hypertrophy', 'upper-body', 'bodybuilding'],
    generateSessions: (weeks) => {
      const sessions = []
      for (let week = 1; week <= weeks; week++) {
        POF_DAYS.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ─── 9. Anterior / Posterior 4-Day Split ────────────────────────────────────
  {
    id: 'anterior-posterior-4day',
    name: '4-Day Anterior / Posterior Split',
    description: 'Splits the body into anterior chain (quads, chest, biceps, front delts) and posterior chain (hamstrings, back, triceps, rear delts) across 4 days. Three-phase progression from accumulation through to intensification.',
    goal_type: 'lean_gain',
    phase: 'Anterior/Posterior',
    default_weeks: 18,
    days_per_week: 4,
    difficulty: 'intermediate',
    icon: '⚖️',
    color: 'var(--info)',
    tags: ['anterior-posterior', '4-day', 'phased', 'poliquin', 'split'],
    generateSessions: (weeks) => {
      const sessions = []

      const phases = [
        { name: 'Accumulation',    setCount: 4, repRange: '10-12', tempo: '4010', rest: 75 },
        { name: 'Loading',         setCount: 5, repRange: '6-8',   tempo: '4010', rest: 120 },
        { name: 'Intensification', setCount: 6, repRange: '3-5',   tempo: '41X0', rest: 180 },
      ]

      const accConfig  = { set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 60 }
      const loadConfig = { set_count: 4, rep_range: '8-12',  tempo: '3010', rest_seconds: 90 }
      const inteConfig = { set_count: 4, rep_range: '6-8',   tempo: '3010', rest_seconds: 120 }

      const finisher = { set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 45 }

      for (let week = 1; week <= weeks; week++) {
        const phaseLength = Math.floor(weeks / 3)
        const phaseIdx = week <= phaseLength ? 0 : week <= phaseLength * 2 ? 1 : 2
        const phase = phases[phaseIdx]
        const acc = phaseIdx === 0 ? accConfig : phaseIdx === 1 ? loadConfig : inteConfig

        // Day 1 — Anterior A
        sessions.push({
          day_label: 'Day 1 — Anterior A',
          week_number: week,
          session_type: 'strength',
          exercises: [
            { name: 'Back Squat',              order_index: 0, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Flat Barbell Bench Press', order_index: 1, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Leg Press',               order_index: 2, superset_group: 'B1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Incline DB Press',        order_index: 3, superset_group: 'B2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Barbell Curl',            order_index: 4, superset_group: 'C1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Scott Curl',              order_index: 5, superset_group: 'C2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Leg Extension',           order_index: 6, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: 'Constant tension, squeeze at top' },
            { name: 'Cable Fly',               order_index: 7, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: 'Squeeze at peak contraction' },
          ],
        })

        // Day 2 — Posterior A
        sessions.push({
          day_label: 'Day 2 — Posterior A',
          week_number: week,
          session_type: 'strength',
          exercises: [
            { name: 'Romanian Deadlift',      order_index: 0, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Bent Over Barbell Row',  order_index: 1, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Lying Leg Curl',         order_index: 2, superset_group: 'B1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Lat Pulldown',           order_index: 3, superset_group: 'B2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Skull Crushers',         order_index: 4, superset_group: 'C1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Triceps Pressdown',      order_index: 5, superset_group: 'C2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: '45° Back Extension',     order_index: 6, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: 'Full range, squeeze glutes at top' },
            { name: 'Reverse Fly',            order_index: 7, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: 'Light weight, perfect form' },
          ],
        })

        // Day 3 — Anterior B
        sessions.push({
          day_label: 'Day 3 — Anterior B',
          week_number: week,
          session_type: 'strength',
          exercises: [
            { name: 'Front Squat',          order_index: 0, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Incline Barbell Press', order_index: 1, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Hack Squat',           order_index: 2, superset_group: 'B1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Low Incline DB Press', order_index: 3, superset_group: 'B2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Hammer Curl',          order_index: 4, superset_group: 'C1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Incline DB Curl',      order_index: 5, superset_group: 'C2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Walking Lunge',        order_index: 6, superset_group: null,  set_count: finisher.set_count, rep_range: '20 steps', tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: 'Controlled descent' },
            { name: 'DB Pullover',          order_index: 7, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: 'Full stretch through chest and lats' },
          ],
        })

        // Day 4 — Posterior B
        sessions.push({
          day_label: 'Day 4 — Posterior B',
          week_number: week,
          session_type: 'strength',
          exercises: [
            { name: 'Deadlift',                  order_index: 0, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Chest Supported DB Row',    order_index: 1, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Lying Leg Curl',            order_index: 2, superset_group: 'B1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: 'Plantarflexed foot position' },
            { name: 'Neutral Grip Pulldown',     order_index: 3, superset_group: 'B2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'French Press',              order_index: 4, superset_group: 'C1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'JM Press',                  order_index: 5, superset_group: 'C2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Glute Ham Raise',           order_index: 6, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: 'Slow eccentric, 5 seconds' },
            { name: 'Seated Rear Delt Fly',      order_index: 7, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: 'Elbows high, lead with elbows' },
          ],
        })
      }

      return sessions
    },
  },

  // ─── 10. Push / Pull / Legs — 3-Phase ───────────────────────────────────────
  {
    id: 'push-pull-legs',
    name: 'Push / Pull / Legs — 3-Phase',
    description: 'The classic 6-day PPL split with dedicated push, pull and legs days — each doubled per week. Three phases take you from volume accumulation through to heavy intensification.',
    goal_type: 'lean_gain',
    phase: 'PPL Periodization',
    default_weeks: 18,
    days_per_week: 6,
    difficulty: 'intermediate',
    icon: '🔁',
    color: 'var(--accent)',
    tags: ['ppl', 'push-pull-legs', '6-day', 'phased', 'hypertrophy'],
    generateSessions: (weeks) => {
      const sessions = []

      const phases = [
        { name: 'Accumulation',    setCount: 4, repRange: '10-12', tempo: '4010', rest: 75 },
        { name: 'Loading',         setCount: 5, repRange: '6-8',   tempo: '4010', rest: 120 },
        { name: 'Intensification', setCount: 6, repRange: '3-5',   tempo: '41X0', rest: 180 },
      ]

      const accConfig  = { set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 60 }
      const loadConfig = { set_count: 4, rep_range: '8-12',  tempo: '3010', rest_seconds: 90 }
      const inteConfig = { set_count: 4, rep_range: '6-8',   tempo: '3010', rest_seconds: 120 }

      const finisher = { set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 45 }

      for (let week = 1; week <= weeks; week++) {
        const phaseLength = Math.floor(weeks / 3)
        const phaseIdx = week <= phaseLength ? 0 : week <= phaseLength * 2 ? 1 : 2
        const phase = phases[phaseIdx]
        const acc = phaseIdx === 0 ? accConfig : phaseIdx === 1 ? loadConfig : inteConfig

        // Push A — Chest focus
        sessions.push({
          day_label: 'Push A — Chest Focus',
          week_number: week,
          session_type: 'strength',
          exercises: [
            { name: 'Flat Barbell Bench Press',       order_index: 0, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Overhead Press',                  order_index: 1, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Incline DB Press',                order_index: 2, superset_group: 'B1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Lateral Raise',                   order_index: 3, superset_group: 'B2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Cable Fly',                       order_index: 4, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: 'Constant tension, peak squeeze' },
            { name: 'Triceps Pressdown',               order_index: 5, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: 'Full lockout' },
            { name: 'Overhead Triceps Extension',      order_index: 6, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: 'Full stretch at bottom' },
          ],
        })

        // Pull A — Back thickness focus
        sessions.push({
          day_label: 'Pull A — Back Thickness',
          week_number: week,
          session_type: 'strength',
          exercises: [
            { name: 'Bent Over Barbell Row',           order_index: 0, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Weighted Chin-up',                order_index: 1, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: 'Or Lat Pulldown' },
            { name: 'Seated Cable Row',                order_index: 2, superset_group: 'B1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Face Pull',                       order_index: 3, superset_group: 'B2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Straight Arm Pulldown',           order_index: 4, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: null },
            { name: 'Barbell Curl',                    order_index: 5, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: null },
            { name: 'Hammer Curl',                     order_index: 6, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: null },
          ],
        })

        // Legs A — Quad focus
        sessions.push({
          day_label: 'Legs A — Quad Focus',
          week_number: week,
          session_type: 'strength',
          exercises: [
            { name: 'Back Squat',                      order_index: 0, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Romanian Deadlift',               order_index: 1, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Leg Press',                       order_index: 2, superset_group: 'B1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Lying Leg Curl',                  order_index: 3, superset_group: 'B2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Leg Extension',                   order_index: 4, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: null },
            { name: 'Leg Curl',                        order_index: 5, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: null },
            { name: 'Calf Raise',                      order_index: 6, superset_group: null,  set_count: finisher.set_count, rep_range: '20', tempo: finisher.tempo, rest_seconds: 45, notes: 'Pause at bottom stretch' },
          ],
        })

        // Push B — Shoulders focus variation
        sessions.push({
          day_label: 'Push B — Shoulder Focus',
          week_number: week,
          session_type: 'strength',
          exercises: [
            { name: 'Incline Barbell Press',           order_index: 0, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Seated DB Shoulder Press',        order_index: 1, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Low Incline DB Press',            order_index: 2, superset_group: 'B1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Arnold Press',                    order_index: 3, superset_group: 'B2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Lateral Raise',                   order_index: 4, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: null },
            { name: 'Front Raise',                     order_index: 5, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: null },
            { name: 'Close Grip Bench Press',          order_index: 6, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: null },
          ],
        })

        // Pull B — Back width focus
        sessions.push({
          day_label: 'Pull B — Back Width',
          week_number: week,
          session_type: 'strength',
          exercises: [
            { name: 'Deadlift',                        order_index: 0, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Pullup',                          order_index: 1, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: 'Or Lat Pulldown' },
            { name: 'Lat Pulldown',                    order_index: 2, superset_group: 'B1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'DB Row',                          order_index: 3, superset_group: 'B2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Pullover',                        order_index: 4, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: null },
            { name: 'Scott Curl',                      order_index: 5, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: null },
            { name: 'Incline DB Curl',                 order_index: 6, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: null },
          ],
        })

        // Legs B — Posterior chain focus
        sessions.push({
          day_label: 'Legs B — Posterior Chain',
          week_number: week,
          session_type: 'strength',
          exercises: [
            { name: 'Front Squat',                     order_index: 0, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Deadlift from Deficit',           order_index: 1, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
            { name: 'Hack Squat',                      order_index: 2, superset_group: 'B1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Nordic Curl',                     order_index: 3, superset_group: 'B2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Walking Lunge',                   order_index: 4, superset_group: null,  set_count: finisher.set_count, rep_range: '20 steps', tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: null },
            { name: '45° Back Extension',              order_index: 5, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: null },
            { name: 'Seated Calf Raise',               order_index: 6, superset_group: null,  set_count: finisher.set_count, rep_range: finisher.rep_range, tempo: finisher.tempo, rest_seconds: finisher.rest_seconds, notes: null },
          ],
        })
      }

      return sessions
    },
  },

  // ─── 11. Strength 5×5 — 3-Phase ─────────────────────────────────────────────
  {
    id: 'strength-5x5',
    name: 'Strength 5×5 — 3-Phase',
    description: 'Built on the foundation of 5 sets across the big compound lifts. Three phases progress from volume accumulation into classic 5×5 and finally into heavy triples and singles.',
    goal_type: 'gain',
    phase: '5×5 Strength',
    default_weeks: 18,
    days_per_week: 3,
    difficulty: 'intermediate',
    icon: '5️⃣',
    color: 'var(--purple)',
    tags: ['5x5', 'strength', 'compound', 'barbell', 'phased'],
    generateSessions: (weeks) => {
      const sessions = []

      // Custom 5x5 main lift phase configs
      const mainPhases = [
        { setCount: 5, repRange: '8-10', tempo: '4010', rest: 120, notes: 'Building volume base' },
        { setCount: 5, repRange: '5',    tempo: '41X0', rest: 180, notes: 'Classic 5x5 — add weight when all reps completed' },
        { setCount: 5, repRange: '3',    tempo: '41X0', rest: 240, notes: 'Wave load: sets 1-3 build to heavy triple, sets 4-5 back off 10%' },
      ]

      const accConfig  = { set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 60 }
      const loadConfig = { set_count: 4, rep_range: '8-12',  tempo: '3010', rest_seconds: 90 }
      const inteConfig = { set_count: 4, rep_range: '6-8',   tempo: '3010', rest_seconds: 120 }

      const finisherEx = { set_count: 3, rep_range: '15', tempo: '2010', rest_seconds: 45 }

      for (let week = 1; week <= weeks; week++) {
        const phaseLength = Math.floor(weeks / 3)
        const phaseIdx = week <= phaseLength ? 0 : week <= phaseLength * 2 ? 1 : 2
        const mainPhase = mainPhases[phaseIdx]
        const acc = phaseIdx === 0 ? accConfig : phaseIdx === 1 ? loadConfig : inteConfig

        // Alternating A/B/A pattern: odd weeks = A B A, even weeks = B A B
        const isOddWeek = week % 2 !== 0
        const daySequence = isOddWeek ? ['A', 'B', 'A'] : ['B', 'A', 'B']

        daySequence.forEach(dayType => {
          if (dayType === 'A') {
            sessions.push({
              day_label: 'Day A — Squat / Bench / Row',
              week_number: week,
              session_type: 'strength',
              exercises: [
                { name: 'Back Squat',                order_index: 0, superset_group: null,  set_count: mainPhase.setCount, rep_range: mainPhase.repRange, tempo: mainPhase.tempo, rest_seconds: mainPhase.rest, notes: mainPhase.notes },
                { name: 'Flat Barbell Bench Press',  order_index: 1, superset_group: null,  set_count: mainPhase.setCount, rep_range: mainPhase.repRange, tempo: mainPhase.tempo, rest_seconds: mainPhase.rest, notes: mainPhase.notes },
                { name: 'Bent Over Barbell Row',     order_index: 2, superset_group: null,  set_count: mainPhase.setCount, rep_range: mainPhase.repRange, tempo: mainPhase.tempo, rest_seconds: mainPhase.rest, notes: mainPhase.notes },
                { name: 'Romanian Deadlift',         order_index: 3, superset_group: 'B1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
                { name: 'Incline DB Press',          order_index: 4, superset_group: 'B2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
                { name: 'Pull-up or Lat Pulldown',   order_index: 5, superset_group: null,  set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: 'Body weight or add load as phase progresses' },
                { name: 'Calf Raise',                order_index: 6, superset_group: null,  set_count: finisherEx.set_count, rep_range: finisherEx.rep_range, tempo: finisherEx.tempo, rest_seconds: finisherEx.rest_seconds, notes: null },
                { name: 'Barbell Curl',              order_index: 7, superset_group: null,  set_count: finisherEx.set_count, rep_range: finisherEx.rep_range, tempo: finisherEx.tempo, rest_seconds: finisherEx.rest_seconds, notes: null },
              ],
            })
          } else {
            sessions.push({
              day_label: 'Day B — Deadlift / OHP / Chin',
              week_number: week,
              session_type: 'strength',
              exercises: [
                { name: 'Deadlift',                  order_index: 0, superset_group: null,  set_count: mainPhase.setCount, rep_range: mainPhase.repRange, tempo: mainPhase.tempo, rest_seconds: mainPhase.rest, notes: mainPhase.notes },
                { name: 'Overhead Press',             order_index: 1, superset_group: null,  set_count: mainPhase.setCount, rep_range: mainPhase.repRange, tempo: mainPhase.tempo, rest_seconds: mainPhase.rest, notes: mainPhase.notes },
                { name: 'Weighted Chin-up',           order_index: 2, superset_group: null,  set_count: mainPhase.setCount, rep_range: mainPhase.repRange, tempo: mainPhase.tempo, rest_seconds: mainPhase.rest, notes: mainPhase.notes },
                { name: 'Front Squat',                order_index: 3, superset_group: 'B1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
                { name: 'DB Shoulder Press',          order_index: 4, superset_group: 'B2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
                { name: 'Seated Cable Row',           order_index: 5, superset_group: null,  set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: 'Full retraction at peak' },
                { name: 'Triceps Pressdown',          order_index: 6, superset_group: null,  set_count: finisherEx.set_count, rep_range: finisherEx.rep_range, tempo: finisherEx.tempo, rest_seconds: finisherEx.rest_seconds, notes: null },
                { name: 'Hammer Curl',                order_index: 7, superset_group: null,  set_count: finisherEx.set_count, rep_range: finisherEx.rep_range, tempo: finisherEx.tempo, rest_seconds: finisherEx.rest_seconds, notes: null },
              ],
            })
          }
        })
      }

      return sessions
    },
  },

  // ─── 12. Wendler 5/3/1 ──────────────────────────────────────────────────────
  {
    id: 'wendler-531',
    name: '5/3/1 — Wendler Method',
    description: "Jim Wendler's 5/3/1 structured across three progressive phases: Boring But Big volume work, standard 5/3/1 with PR sets, and Joker sets for peak strength. Four main lift days per week.",
    goal_type: 'gain',
    phase: '5/3/1 Periodization',
    default_weeks: 16,
    days_per_week: 4,
    difficulty: 'intermediate',
    icon: '🏋️',
    color: 'var(--purple)',
    tags: ['531', 'wendler', 'barbell', 'strength', 'periodization'],
    generateSessions: (weeks) => {
      const sessions = []

      // Determine phase by week (not using Math.floor(weeks/3) since weeks=16 is fixed)
      // Phase 0: weeks 1-5, Phase 1: weeks 6-11, Phase 2: weeks 12-16
      function getPhaseIdx(week) {
        if (week <= 5)  return 0
        if (week <= 11) return 1
        return 2
      }

      // Main lift rep range based on cycle week (1→"5+", 2→"3+", 3→"1+")
      function getCycleRepRange(cycleWeek) {
        if (cycleWeek === 1) return '5+'
        if (cycleWeek === 2) return '3+'
        return '1+'
      }

      // Accessory config per phase
      const accPhases = [
        { set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 60 },  // Phase 0
        { set_count: 4, rep_range: '8-12',  tempo: '3010', rest_seconds: 75 },  // Phase 1
        { set_count: 4, rep_range: '5-8',   tempo: '3010', rest_seconds: 90 },  // Phase 2
      ]

      // Returns main lift config + assistance exercise config based on phase and cycle week
      function getMainSets(phaseIdx, cycleWeek, mainLiftName) {
        const repRange = getCycleRepRange(cycleWeek)

        if (phaseIdx === 0) {
          // Boring But Big
          const mainLift = { set_count: 3, rep_range: repRange, tempo: '31X0', rest_seconds: 180, notes: null }
          const assistance = { name: mainLiftName + ' (BBB)', set_count: 5, rep_range: '10', tempo: '3010', rest_seconds: 90, notes: 'BBB: 50-60% of training max' }
          return { mainLift, assistance }
        } else if (phaseIdx === 1) {
          // First Set Last
          const mainLift = { set_count: 3, rep_range: repRange, tempo: '31X0', rest_seconds: 180, notes: null }
          const assistance = { name: mainLiftName + ' (FSL)', set_count: 3, rep_range: '5', tempo: '3010', rest_seconds: 90, notes: 'FSL: First Set Last — back-off sets at 65%' }
          return { mainLift, assistance }
        } else {
          // Joker Sets
          const mainLift = { set_count: 3, rep_range: repRange, tempo: '31X0', rest_seconds: 240, notes: null }
          const assistance = { name: mainLiftName + ' (Joker)', set_count: 3, rep_range: '1-3', tempo: '31X0', rest_seconds: 180, notes: 'Joker sets: if top set RPE <9, add 5-10% and work up' }
          return { mainLift, assistance }
        }
      }

      for (let week = 1; week <= weeks; week++) {
        const phaseIdx = getPhaseIdx(week)
        const cycleWeek = ((week - 1) % 3) + 1
        const acc = accPhases[phaseIdx]

        // Day 1 — Squat
        const squat531 = getMainSets(phaseIdx, cycleWeek, 'Back Squat')
        sessions.push({
          day_label: 'Day 1 — Squat',
          week_number: week,
          session_type: 'strength',
          exercises: [
            { name: 'Back Squat',         order_index: 0, superset_group: null,  set_count: squat531.mainLift.set_count, rep_range: squat531.mainLift.rep_range, tempo: squat531.mainLift.tempo, rest_seconds: squat531.mainLift.rest_seconds, notes: squat531.mainLift.notes },
            { name: squat531.assistance.name, order_index: 1, superset_group: null, set_count: squat531.assistance.set_count, rep_range: squat531.assistance.rep_range, tempo: squat531.assistance.tempo, rest_seconds: squat531.assistance.rest_seconds, notes: squat531.assistance.notes },
            { name: 'Romanian Deadlift',  order_index: 2, superset_group: 'C1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Leg Press',          order_index: 3, superset_group: 'C2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Leg Curl',           order_index: 4, superset_group: 'D1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Ab Wheel',           order_index: 5, superset_group: null,  set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 45, notes: 'Core strength' },
          ],
        })

        // Day 2 — Bench
        const bench531 = getMainSets(phaseIdx, cycleWeek, 'Flat Barbell Bench Press')
        sessions.push({
          day_label: 'Day 2 — Bench',
          week_number: week,
          session_type: 'strength',
          exercises: [
            { name: 'Flat Barbell Bench Press', order_index: 0, superset_group: null,  set_count: bench531.mainLift.set_count, rep_range: bench531.mainLift.rep_range, tempo: bench531.mainLift.tempo, rest_seconds: bench531.mainLift.rest_seconds, notes: bench531.mainLift.notes },
            { name: bench531.assistance.name,   order_index: 1, superset_group: null,  set_count: bench531.assistance.set_count, rep_range: bench531.assistance.rep_range, tempo: bench531.assistance.tempo, rest_seconds: bench531.assistance.rest_seconds, notes: bench531.assistance.notes },
            { name: 'DB Row',                   order_index: 2, superset_group: 'C1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Incline DB Press',         order_index: 3, superset_group: 'C2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Face Pull',                order_index: 4, superset_group: 'D1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Triceps Pressdown',        order_index: 5, superset_group: 'D2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
          ],
        })

        // Day 3 — Deadlift
        const dead531 = getMainSets(phaseIdx, cycleWeek, 'Deadlift')
        const deadAssistanceName = phaseIdx === 0 ? 'Romanian Deadlift (BBB)' : phaseIdx === 1 ? 'Good Morning (FSL)' : 'Deadlift (Joker)'
        sessions.push({
          day_label: 'Day 3 — Deadlift',
          week_number: week,
          session_type: 'strength',
          exercises: [
            { name: 'Deadlift',              order_index: 0, superset_group: null,  set_count: dead531.mainLift.set_count, rep_range: dead531.mainLift.rep_range, tempo: dead531.mainLift.tempo, rest_seconds: dead531.mainLift.rest_seconds, notes: dead531.mainLift.notes },
            { name: deadAssistanceName,      order_index: 1, superset_group: null,  set_count: dead531.assistance.set_count, rep_range: dead531.assistance.rep_range, tempo: dead531.assistance.tempo, rest_seconds: dead531.assistance.rest_seconds, notes: dead531.assistance.notes },
            { name: 'Front Squat',           order_index: 2, superset_group: 'C1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Leg Curl',              order_index: 3, superset_group: 'C2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: '45° Back Extension',    order_index: 4, superset_group: 'D1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Ab Circuit',            order_index: 5, superset_group: null,  set_count: 3, rep_range: '15', tempo: '3010', rest_seconds: 45, notes: null },
          ],
        })

        // Day 4 — OHP
        const ohp531 = getMainSets(phaseIdx, cycleWeek, 'Overhead Press')
        const ohpAssistanceName = phaseIdx === 0 ? 'DB Press (BBB)' : phaseIdx === 1 ? 'Push Press (FSL)' : 'Overhead Press (Joker)'
        sessions.push({
          day_label: 'Day 4 — OHP',
          week_number: week,
          session_type: 'strength',
          exercises: [
            { name: 'Overhead Press',          order_index: 0, superset_group: null,  set_count: ohp531.mainLift.set_count, rep_range: ohp531.mainLift.rep_range, tempo: ohp531.mainLift.tempo, rest_seconds: ohp531.mainLift.rest_seconds, notes: ohp531.mainLift.notes },
            { name: ohpAssistanceName,         order_index: 1, superset_group: null,  set_count: ohp531.assistance.set_count, rep_range: ohp531.assistance.rep_range, tempo: ohp531.assistance.tempo, rest_seconds: ohp531.assistance.rest_seconds, notes: ohp531.assistance.notes },
            { name: 'Lat Pulldown',            order_index: 2, superset_group: 'C1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'DB Shoulder Press',       order_index: 3, superset_group: 'C2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Barbell Curl',            order_index: 4, superset_group: 'D1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
            { name: 'Lateral Raise',           order_index: 5, superset_group: 'D2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
          ],
        })
      }

      return sessions
    },
  },

  // ─── 13. Structural Balance — Full Body Correction ───────────────────────────
  {
    id: 'structural-balance-full',
    name: 'Structural Balance — Full Body Correction',
    description: 'Addresses muscular imbalances and weak links before loading. Focuses on posterior chain strength, joint health, and movement quality. The essential foundation before any advanced programme.',
    goal_type: 'maintain',
    phase: 'Structural Balance',
    default_weeks: 12,
    days_per_week: 3,
    difficulty: 'beginner',
    icon: '🏥',
    color: 'var(--warn)',
    tags: ['structural-balance', 'corrective', 'beginner', 'foundation', 'posterior'],
    generateSessions: (weeks) => {
      const sessions = []

      // Phase configs — note: weeks is expected to be 12 but we use phaseLength for flexibility
      const phases = [
        { name: 'Accumulation',    setCount: 3, repRange: '15-20', tempo: '3010', rest: 60 },
        { name: 'Loading',         setCount: 4, repRange: '10-12', tempo: '3010', rest: 75 },
        { name: 'Intensification', setCount: 4, repRange: '8-10',  tempo: '4010', rest: 90 },
      ]

      // Accessory config mirrors the main phase progression for this template
      const accPhases = [
        { set_count: 3, rep_range: '15-20', tempo: '3010', rest_seconds: 60 },
        { set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 75 },
        { set_count: 4, rep_range: '8-10',  tempo: '4010', rest_seconds: 90 },
      ]

      for (let week = 1; week <= weeks; week++) {
        const phaseLength = Math.floor(weeks / 3)
        const phaseIdx = week <= phaseLength ? 0 : week <= phaseLength * 2 ? 1 : 2
        const phase = phases[phaseIdx]
        const acc = accPhases[phaseIdx]

        // Alternating A/B pattern: odd weeks = A B A, even weeks = B A B
        const isOddWeek = week % 2 !== 0
        const daySequence = isOddWeek ? ['A', 'B', 'A'] : ['B', 'A', 'B']

        daySequence.forEach(dayType => {
          if (dayType === 'A') {
            sessions.push({
              day_label: 'Day A — Full Body (Posterior Emphasis)',
              week_number: week,
              session_type: 'strength',
              exercises: [
                { name: 'Back Squat',           order_index: 0, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
                { name: 'Romanian Deadlift',    order_index: 1, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
                { name: 'Chest Supported Row',  order_index: 2, superset_group: 'B1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
                { name: 'Incline DB Press',     order_index: 3, superset_group: 'B2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
                { name: 'Nordic Curl',          order_index: 4, superset_group: 'C1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: 'Slow eccentric — key for knee health' },
                { name: 'Face Pull',            order_index: 5, superset_group: 'C2', set_count: 3, rep_range: '15-20', tempo: '2012', rest_seconds: 45, notes: 'External rotation — rotator cuff health' },
                { name: 'Single Leg RDL',       order_index: 6, superset_group: null,  set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: 'Stability and glute activation' },
                { name: 'Plank Hold',           order_index: 7, superset_group: null,  set_count: 3, rep_range: '30-45s', tempo: 'hold', rest_seconds: 45, notes: 'Core bracing' },
              ],
            })
          } else {
            sessions.push({
              day_label: 'Day B — Full Body (Anterior Correction)',
              week_number: week,
              session_type: 'strength',
              exercises: [
                { name: 'Front Squat',          order_index: 0, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: 'Thoracic mobility and quad strength' },
                { name: 'Trap Bar Deadlift',    order_index: 1, superset_group: null,  set_count: phase.setCount, rep_range: phase.repRange, tempo: phase.tempo, rest_seconds: phase.rest, notes: null },
                { name: 'Seated Cable Row',     order_index: 2, superset_group: 'B1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
                { name: 'Low Incline DB Press', order_index: 3, superset_group: 'B2', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
                { name: 'Lying Leg Curl',       order_index: 4, superset_group: 'C1', set_count: acc.set_count, rep_range: acc.rep_range, tempo: acc.tempo, rest_seconds: acc.rest_seconds, notes: null },
                { name: 'Band Pull-Apart',      order_index: 5, superset_group: 'C2', set_count: 3, rep_range: '20', tempo: '1010', rest_seconds: 45, notes: 'Shoulder health' },
                { name: 'Split Squat',          order_index: 6, superset_group: null,  set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: 'Single leg strength and balance' },
                { name: 'Dead Bug',             order_index: 7, superset_group: null,  set_count: 3, rep_range: '10 each side', tempo: '3010', rest_seconds: 45, notes: 'Anti-extension core' },
              ],
            })
          }
        })
      }

      return sessions
    },
  },


  // ─── 14. 3 Day Athlete GBC ───────────────────────────────────────────────────
  {
    id: '3-day-athlete-gbc',
    name: '3 Day Athlete GBC',
    description: 'A 3-day German Body Composition athlete programme pairing compound lifts in supersets and giant sets. Balances strength, power and conditioning with minimal rest between exercises for a high lactate response and body recomposition.',
    goal_type: 'recomp',
    phase: 'Athletic Conditioning',
    default_weeks: 8,
    days_per_week: 3,
    difficulty: 'intermediate',
    icon: '⚡',
    color: 'var(--accent)',
    tags: ['gbc', 'superset', 'athlete', 'conditioning', 'full-body'],
    generateSessions: (weeks) => {
      const sessions = []
      const DAYS = [
        {
          day_label: 'GBC Day 1',
          session_type: 'strength',
          exercises: [
            { name: 'Couch Stretch', set_count: 2, rep_range: '45s', tempo: '1111', rest_seconds: 0, notes: 'Warmup — hold each side', order_index: 0, superset_group: 'W1' },
            { name: 'Single Leg Hamstring Bridge', set_count: 2, rep_range: '10', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'W2' },
            { name: 'Copenhagen Plank', set_count: 2, rep_range: '20s', tempo: '1111', rest_seconds: 0, notes: 'Warmup', order_index: 2, superset_group: 'W3' },
            { name: 'Deficit Plate Push Ups', set_count: 2, rep_range: '8', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 3, superset_group: 'W4' },
            { name: 'Prone External Rotation Isometrics', set_count: 2, rep_range: '10', tempo: '1111', rest_seconds: 60, notes: 'Warmup — last in giant set', order_index: 4, superset_group: 'W5' },
            { name: 'Long-Sit Snatch Iso Holds', set_count: 2, rep_range: '30s', tempo: '1111', rest_seconds: 90, notes: 'Focus on upright torso and external rotation', order_index: 5, superset_group: 'A' },
            { name: 'Barbell Front Squat', set_count: 4, rep_range: '8-10', tempo: '3010', rest_seconds: 60, notes: null, order_index: 6, superset_group: 'B1' },
            { name: 'Pull Ups', set_count: 4, rep_range: '8-10', tempo: '3010', rest_seconds: 60, notes: null, order_index: 7, superset_group: 'B2' },
            { name: 'Single Leg Landmine RDL', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: 'Per side', order_index: 8, superset_group: 'C1' },
            { name: 'Alternating Glute Bridge Press', set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: null, order_index: 9, superset_group: 'C2' },
            { name: 'Zercher Deficit Lunges', set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: 'Per side', order_index: 10, superset_group: 'D1' },
            { name: 'Dumbbell Row', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 11, superset_group: 'D2' },
            { name: 'Tricep Dips', set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 10, notes: null, order_index: 12, superset_group: 'E1' },
            { name: 'Dumbbell Side Lateral Raises', set_count: 3, rep_range: '12-15', tempo: '2020', rest_seconds: 10, notes: null, order_index: 13, superset_group: 'E2' },
            { name: 'Incline Dumbbell Curls', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 14, superset_group: 'E3' },
            { name: 'GHD Reverse Crunch', set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 45, notes: null, order_index: 15, superset_group: 'F1' },
            { name: 'DB Single Leg Calf Raise', set_count: 3, rep_range: '15-20', tempo: '2020', rest_seconds: 45, notes: null, order_index: 16, superset_group: 'F2' },
          ],
        },
        {
          day_label: 'GBC Day 2',
          session_type: 'strength',
          exercises: [
            { name: '90/90 Breathe with Reach Forward', set_count: 2, rep_range: '10', tempo: '1111', rest_seconds: 0, notes: 'Warmup', order_index: 0, superset_group: 'W1' },
            { name: 'Kickstance RDL with Contralateral Load', set_count: 2, rep_range: '8', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'W2' },
            { name: 'Goblet Cossack Squat', set_count: 2, rep_range: '8', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 2, superset_group: 'W3' },
            { name: 'Hanging Knee Raises', set_count: 2, rep_range: '10', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 3, superset_group: 'W4' },
            { name: 'Ab Rollout', set_count: 2, rep_range: '8', tempo: '3010', rest_seconds: 60, notes: 'Warmup — last in giant set', order_index: 4, superset_group: 'W5' },
            { name: 'Clean Pull', set_count: 3, rep_range: '4-6', tempo: '1010', rest_seconds: 90, notes: 'Focus on triple extension', order_index: 5, superset_group: 'A' },
            { name: 'Conventional Deadlift', set_count: 4, rep_range: '6-8', tempo: '3010', rest_seconds: 75, notes: null, order_index: 6, superset_group: 'B1' },
            { name: 'Standing Unilateral Dumbbell Shoulder Press', set_count: 4, rep_range: '8-10', tempo: '3010', rest_seconds: 75, notes: 'Per arm', order_index: 7, superset_group: 'B2' },
            { name: 'Barbell Hip Thrusts', set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: null, order_index: 8, superset_group: 'C1' },
            { name: 'Prone Dumbbell Row', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 9, superset_group: 'C2' },
            { name: 'Supinated Pull Up', set_count: 3, rep_range: '8-10', tempo: '3010', rest_seconds: 60, notes: null, order_index: 10, superset_group: 'D1' },
            { name: 'Walking Lunges', set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: 'Per side', order_index: 11, superset_group: 'D2' },
            { name: 'Dumbbell Powell Raise', set_count: 3, rep_range: '12-15', tempo: '2020', rest_seconds: 10, notes: null, order_index: 12, superset_group: 'E1' },
            { name: 'Deficit Plate Push Ups', set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 10, notes: null, order_index: 13, superset_group: 'E2' },
            { name: 'Dumbbell Curls', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 10, notes: null, order_index: 14, superset_group: 'E3' },
            { name: 'Dumbbell Skullcrushers', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 15, superset_group: 'E4' },
            { name: 'Deadhang Max Effort', set_count: 3, rep_range: 'max', tempo: '1111', rest_seconds: 60, notes: 'Hold as long as possible', order_index: 16, superset_group: 'F1' },
            { name: 'DB Single Leg Calf Raise', set_count: 3, rep_range: '15-20', tempo: '2020', rest_seconds: 60, notes: null, order_index: 17, superset_group: 'F2' },
          ],
        },
        {
          day_label: 'GBC Day 3',
          session_type: 'strength',
          exercises: [
            { name: 'Couch Stretch', set_count: 2, rep_range: '45s', tempo: '1111', rest_seconds: 0, notes: 'Warmup — hold each side', order_index: 0, superset_group: 'W1' },
            { name: 'Single Leg Hamstring Bridge Iso', set_count: 2, rep_range: '20s', tempo: '1111', rest_seconds: 0, notes: 'Warmup — foam roller under hip', order_index: 1, superset_group: 'W2' },
            { name: 'Front Foot Elevated Split Squat', set_count: 2, rep_range: '8', tempo: '2010', rest_seconds: 0, notes: 'Warmup — contralateral load', order_index: 2, superset_group: 'W3' },
            { name: 'Pogo Hops', set_count: 2, rep_range: '20', tempo: '1010', rest_seconds: 0, notes: 'Warmup', order_index: 3, superset_group: 'W4' },
            { name: 'Max Effort Vertical Jump', set_count: 2, rep_range: '5', tempo: '1010', rest_seconds: 60, notes: 'Warmup — full reset between jumps', order_index: 4, superset_group: 'W5' },
            { name: 'Barbell Hip Thrusts', set_count: 4, rep_range: '8-10', tempo: '2010', rest_seconds: 60, notes: null, order_index: 5, superset_group: 'A1' },
            { name: 'Alternating Glute Bridge Press', set_count: 4, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: null, order_index: 6, superset_group: 'A2' },
            { name: 'Power Clean', set_count: 3, rep_range: '4-5', tempo: '1010', rest_seconds: 75, notes: 'Reset between reps', order_index: 7, superset_group: 'B1' },
            { name: 'GHD Sit Ups', set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 75, notes: null, order_index: 8, superset_group: 'B2' },
            { name: 'Heel Elevated Front Barbell Squat', set_count: 3, rep_range: '8-10', tempo: '3010', rest_seconds: 60, notes: null, order_index: 9, superset_group: 'C1' },
            { name: 'Alternating Gorilla Row', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 10, superset_group: 'C2' },
            { name: 'Pull Ups', set_count: 3, rep_range: '8-10', tempo: '3010', rest_seconds: 60, notes: null, order_index: 11, superset_group: 'D1' },
            { name: 'Alternating Dumbbell Z Press', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: 'Per arm', order_index: 12, superset_group: 'D2' },
            { name: 'Front Foot Elevated Bulgarian Split Squat', set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 45, notes: 'Per leg', order_index: 13, superset_group: 'E1' },
            { name: 'Dumbbell Side Lateral Raises', set_count: 3, rep_range: '12-15', tempo: '2020', rest_seconds: 45, notes: null, order_index: 14, superset_group: 'E2' },
            { name: 'Incline Dumbbell Curls', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 45, notes: null, order_index: 15, superset_group: 'F1' },
            { name: 'Dumbbell Skullcrushers', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 45, notes: null, order_index: 16, superset_group: 'F2' },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ─── 15. 3 Day Powerbuild ────────────────────────────────────────────────────
  {
    id: '3-day-powerbuild',
    name: '3 Day Powerbuild',
    description: 'Combines heavy compound powerlifting movements with hypertrophy-focused accessory work across three sessions: Squat/Press, Squat/Pull, and Hinge/Push. Builds raw strength and size simultaneously.',
    goal_type: 'gain',
    phase: 'Powerbuilding',
    default_weeks: 8,
    days_per_week: 3,
    difficulty: 'intermediate',
    icon: '🏋️',
    color: 'var(--accent)',
    tags: ['powerbuilding', 'strength', 'hypertrophy', 'compound', 'barbell'],
    generateSessions: (weeks) => {
      const sessions = []
      const DAYS = [
        {
          day_label: 'Day 1 — Squat / Press',
          session_type: 'strength',
          exercises: [
            { name: 'Single Leg Bridge', set_count: 2, rep_range: '10', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 0, superset_group: 'W1' },
            { name: 'Copenhagen Plank', set_count: 2, rep_range: '20s', tempo: '1111', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'W2' },
            { name: 'Front Foot Elevated Split Squat', set_count: 2, rep_range: '8', tempo: '2010', rest_seconds: 0, notes: 'Warmup — contralateral load', order_index: 2, superset_group: 'W3' },
            { name: 'Hanging Knee Raises', set_count: 2, rep_range: '10', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 3, superset_group: 'W4' },
            { name: 'Deficit Push Ups', set_count: 2, rep_range: '8', tempo: '2010', rest_seconds: 60, notes: 'Warmup — last in giant set', order_index: 4, superset_group: 'W5' },
            { name: 'Barbell Front Squat', set_count: 4, rep_range: '4-6', tempo: '3010', rest_seconds: 90, notes: 'Main strength lift', order_index: 5, superset_group: 'A1' },
            { name: 'Flat Barbell Bench Press', set_count: 4, rep_range: '4-6', tempo: '3010', rest_seconds: 90, notes: 'Main strength lift', order_index: 6, superset_group: 'A2' },
            { name: 'Seated Lateral Raise', set_count: 2, rep_range: '12-15', tempo: '2020', rest_seconds: 60, notes: null, order_index: 7, superset_group: 'B' },
            { name: 'Seated Chest Supported Row', set_count: 2, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 8, superset_group: 'C' },
            { name: 'Prime Seated Machine Row (Lat Focus)', set_count: 2, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: 'Neutral grip', order_index: 9, superset_group: 'D' },
            { name: 'Straight Arm Pushdowns', set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 10, superset_group: 'E' },
            { name: 'Leg Extensions', set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 11, superset_group: 'F' },
            { name: 'Lying Leg Curl', set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 12, superset_group: 'G' },
            { name: '45° Hip Extension', set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 13, superset_group: 'H' },
          ],
        },
        {
          day_label: 'Day 2 — Squat / Pull',
          session_type: 'strength',
          exercises: [
            { name: 'Single Leg Bridge', set_count: 2, rep_range: '10', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 0, superset_group: 'W1' },
            { name: 'Copenhagen Plank', set_count: 2, rep_range: '20s', tempo: '1111', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'W2' },
            { name: 'Front Foot Elevated Split Squat', set_count: 2, rep_range: '8', tempo: '2010', rest_seconds: 0, notes: 'Warmup — contralateral load', order_index: 2, superset_group: 'W3' },
            { name: '45° Side Bends', set_count: 2, rep_range: '12', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 3, superset_group: 'W4' },
            { name: 'Kneeling Cable Crunches', set_count: 2, rep_range: '12', tempo: '2010', rest_seconds: 60, notes: 'Warmup — last in giant set', order_index: 4, superset_group: 'W5' },
            { name: 'Barbell Back Squat', set_count: 4, rep_range: '4-6', tempo: '3010', rest_seconds: 90, notes: 'Main strength lift', order_index: 5, superset_group: 'A1' },
            { name: 'Pull Ups', set_count: 4, rep_range: '6-8', tempo: '3010', rest_seconds: 90, notes: 'Add weight if needed', order_index: 6, superset_group: 'A2' },
            { name: '45° Incline Dumbbell Press', set_count: 2, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 7, superset_group: 'B' },
            { name: 'Pec Deck Machine', set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 8, superset_group: 'C' },
            { name: 'Dual Rope Pushdowns', set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 9, superset_group: 'D' },
            { name: 'Seated Chest Supported Row', set_count: 2, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 10, superset_group: 'E' },
            { name: 'Preacher Curl Machine', set_count: 2, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 11, superset_group: 'F' },
            { name: 'Seated Leg Curl', set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 12, superset_group: 'G' },
            { name: '45° Hip Extension', set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 13, superset_group: 'H' },
            { name: 'Standing Calf Raise', set_count: 2, rep_range: '15-20', tempo: '2020', rest_seconds: 60, notes: null, order_index: 14, superset_group: 'I' },
          ],
        },
        {
          day_label: 'Day 3 — Hinge / Push',
          session_type: 'strength',
          exercises: [
            { name: 'Kettlebell Arm Bar', set_count: 2, rep_range: '5', tempo: '1111', rest_seconds: 0, notes: 'Warmup — per side', order_index: 0, superset_group: 'W1' },
            { name: 'Copenhagen Plank', set_count: 2, rep_range: '20s', tempo: '1111', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'W2' },
            { name: 'Kickstance RDL with Contralateral Load', set_count: 2, rep_range: '8', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 2, superset_group: 'W3' },
            { name: 'Ab Roll Out', set_count: 2, rep_range: '8', tempo: '3010', rest_seconds: 60, notes: 'Warmup — last in giant set', order_index: 3, superset_group: 'W4' },
            { name: 'Conventional Deadlift', set_count: 3, rep_range: '4-5', tempo: '3010', rest_seconds: 120, notes: 'Primary hinge — reset between reps', order_index: 4, superset_group: 'A' },
            { name: 'Standing Barbell Shoulder Press', set_count: 3, rep_range: '5-6', tempo: '3010', rest_seconds: 120, notes: null, order_index: 5, superset_group: 'B' },
            { name: 'Pull Ups', set_count: 2, rep_range: '8-10', tempo: '3010', rest_seconds: 60, notes: null, order_index: 6, superset_group: 'C' },
            { name: 'Seated Lateral Raise', set_count: 2, rep_range: '12-15', tempo: '2020', rest_seconds: 60, notes: null, order_index: 7, superset_group: 'D' },
            { name: 'Cable Single Arm High to Low Row', set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: 'Per arm', order_index: 8, superset_group: 'E' },
            { name: 'Seated Chest Supported Row', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 9, superset_group: 'F' },
            { name: 'Preacher Curl Machine', set_count: 2, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 10, superset_group: 'G' },
            { name: 'Leg Extensions', set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 11, superset_group: 'H' },
            { name: 'Standing Calf Raise', set_count: 2, rep_range: '15-20', tempo: '2020', rest_seconds: 60, notes: null, order_index: 12, superset_group: 'I' },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ─── 16. 4 Day Full Body ─────────────────────────────────────────────────────
  {
    id: '4-day-full-body',
    name: '4 Day Full Body',
    description: 'Four rotating full-body sessions (A/B/C/D) with an optional metabolic conditioning day. Each session targets different movement combinations — squat, hinge, push, pull — using supersets and giant set warmups for efficient, high-variety training.',
    goal_type: 'lean_gain',
    phase: 'Athletic Hypertrophy',
    default_weeks: 8,
    days_per_week: 4,
    difficulty: 'intermediate',
    icon: '🔄',
    color: 'var(--accent)',
    tags: ['full-body', 'hypertrophy', 'superset', 'conditioning', 'variety'],
    generateSessions: (weeks) => {
      const sessions = []
      const DAYS = [
        {
          day_label: 'Full Body A',
          session_type: 'strength',
          exercises: [
            { name: 'Single Leg Hamstring Bridge Iso', set_count: 2, rep_range: '20s', tempo: '1111', rest_seconds: 0, notes: 'Warmup — foam roller under hip', order_index: 0, superset_group: 'W1' },
            { name: 'Copenhagen Plank', set_count: 2, rep_range: '20s', tempo: '1111', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'W2' },
            { name: 'Front Foot Elevated Split Squat', set_count: 2, rep_range: '8', tempo: '2010', rest_seconds: 0, notes: 'Warmup — contralateral load', order_index: 2, superset_group: 'W3' },
            { name: 'Single Leg Pogo Hops', set_count: 2, rep_range: '15', tempo: '1010', rest_seconds: 60, notes: 'Warmup — last in giant set', order_index: 3, superset_group: 'W4' },
            { name: 'Bulgarian Split Squat', set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: 'Per leg', order_index: 4, superset_group: 'A1' },
            { name: 'Hook Lying Dumbbell Press', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 5, superset_group: 'A2' },
            { name: 'Single Leg Leg Extension Machine', set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: 'Per leg', order_index: 6, superset_group: 'B' },
            { name: 'Barbell Hip Thrusts', set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: null, order_index: 7, superset_group: 'C1' },
            { name: 'Side Plank Pronation', set_count: 3, rep_range: '30s', tempo: '1111', rest_seconds: 60, notes: 'Timed — per side', order_index: 8, superset_group: 'C2' },
            { name: 'Zercher Squat', set_count: 3, rep_range: '8-10', tempo: '3010', rest_seconds: 60, notes: null, order_index: 9, superset_group: 'D1' },
            { name: 'Figure of 8 Swissball Plank', set_count: 3, rep_range: '30s', tempo: '1111', rest_seconds: 60, notes: null, order_index: 10, superset_group: 'D2' },
            { name: 'Dumbbell Romanian Deadlift', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 11, superset_group: 'E1' },
            { name: 'Half Kneeling Landmine Press', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: 'Per arm', order_index: 12, superset_group: 'E2' },
            { name: 'Incline Garhammer Raise', set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 45, notes: null, order_index: 13, superset_group: 'F1' },
            { name: 'Seated Calf Raise', set_count: 3, rep_range: '15-20', tempo: '2020', rest_seconds: 45, notes: null, order_index: 14, superset_group: 'F2' },
          ],
        },
        {
          day_label: 'Full Body B',
          session_type: 'strength',
          exercises: [
            { name: 'Childs Pose', set_count: 2, rep_range: '30s', tempo: '1111', rest_seconds: 0, notes: 'Warmup', order_index: 0, superset_group: 'W1' },
            { name: 'Kettlebell Arm Bar', set_count: 2, rep_range: '5', tempo: '1111', rest_seconds: 0, notes: 'Warmup — per side', order_index: 1, superset_group: 'W2' },
            { name: 'Incline Garhammer Raise', set_count: 2, rep_range: '10', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 2, superset_group: 'W3' },
            { name: 'Half Kneeling Landmine Press', set_count: 2, rep_range: '8', tempo: '2010', rest_seconds: 0, notes: 'Warmup — per arm', order_index: 3, superset_group: 'W4' },
            { name: 'Ab Rollout', set_count: 2, rep_range: '8', tempo: '3010', rest_seconds: 60, notes: 'Warmup — last in giant set', order_index: 4, superset_group: 'W5' },
            { name: 'Lying Leg Curl', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 5, superset_group: 'A1' },
            { name: 'Hip Abductor Machine', set_count: 3, rep_range: '15-20', tempo: '3010', rest_seconds: 60, notes: null, order_index: 6, superset_group: 'A2' },
            { name: 'Zercher Squat', set_count: 3, rep_range: '8-10', tempo: '3010', rest_seconds: 60, notes: null, order_index: 7, superset_group: 'B1' },
            { name: 'Alternating Glute Bridge Press', set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: null, order_index: 8, superset_group: 'B2' },
            { name: '45° Hip Extension', set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 9, superset_group: 'C' },
            { name: 'Pull Ups', set_count: 3, rep_range: '8-10', tempo: '3010', rest_seconds: 60, notes: null, order_index: 10, superset_group: 'D1' },
            { name: 'Zercher Deficit Lunges', set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: 'Per leg', order_index: 11, superset_group: 'D2' },
            { name: 'Dumbbell Row', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 12, superset_group: 'E1' },
            { name: 'Deficit Plate Push Ups', set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: null, order_index: 13, superset_group: 'E2' },
            { name: 'Rear Delt Machine', set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 14, superset_group: 'F' },
            { name: 'Overhead Rope Tricep Extension', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 45, notes: null, order_index: 15, superset_group: 'G1' },
            { name: 'Behind-The-Back Dual Cable D-Handle Curls', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 45, notes: null, order_index: 16, superset_group: 'G2' },
            { name: 'Reverse Sled Pull', set_count: 1, rep_range: '20m', tempo: '—', rest_seconds: 60, notes: 'Conditioning finisher', order_index: 17, superset_group: 'H' },
          ],
        },
        {
          day_label: 'Full Body C',
          session_type: 'strength',
          exercises: [
            { name: 'Heel Elevated Toe Reach', set_count: 2, rep_range: '10', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 0, superset_group: 'W1' },
            { name: 'Heel Elevated Goblet Squat', set_count: 2, rep_range: '8', tempo: '3010', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'W2' },
            { name: 'Side Plank Pronation', set_count: 2, rep_range: '20s', tempo: '1111', rest_seconds: 0, notes: 'Warmup — timed, per side', order_index: 2, superset_group: 'W3' },
            { name: 'Deadhang Max Effort Hold', set_count: 2, rep_range: 'max', tempo: '1111', rest_seconds: 60, notes: 'Warmup — hold as long as possible', order_index: 3, superset_group: 'W4' },
            { name: 'Prone Hamstring Curl Machine', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 4, superset_group: 'A1' },
            { name: 'Goblet Cossack Squat', set_count: 3, rep_range: '8', tempo: '2010', rest_seconds: 60, notes: 'Per side', order_index: 5, superset_group: 'A2' },
            { name: 'Trap Bar Deadlift', set_count: 3, rep_range: '6-8', tempo: '3010', rest_seconds: 75, notes: null, order_index: 6, superset_group: 'B1' },
            { name: 'Hook Lying Dumbbell Press', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 75, notes: null, order_index: 7, superset_group: 'B2' },
            { name: '45° Hip Extension', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 8, superset_group: 'C1' },
            { name: 'Walking Lunges', set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: 'Per leg', order_index: 9, superset_group: 'C2' },
            { name: 'Incline Garhammer Raise', set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 45, notes: null, order_index: 10, superset_group: 'D1' },
            { name: 'Seated Calf Raise', set_count: 3, rep_range: '15-20', tempo: '2020', rest_seconds: 45, notes: null, order_index: 11, superset_group: 'D2' },
          ],
        },
        {
          day_label: 'Full Body D',
          session_type: 'strength',
          exercises: [
            { name: 'Heel Elevated Toe Reach', set_count: 2, rep_range: '10', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 0, superset_group: 'W1' },
            { name: 'Heel Elevated Goblet Squat', set_count: 2, rep_range: '8', tempo: '3010', rest_seconds: 60, notes: 'Warmup — last in pair', order_index: 1, superset_group: 'W2' },
            { name: 'Barbell Romanian Deadlift', set_count: 3, rep_range: '8-10', tempo: '3010', rest_seconds: 60, notes: null, order_index: 2, superset_group: 'A1' },
            { name: 'Copenhagen Plank Dips', set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: 'Per side', order_index: 3, superset_group: 'A2' },
            { name: 'Pendulum Squat', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 4, superset_group: 'B1' },
            { name: 'Alternating Dumbbell Z Press', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: 'Per arm', order_index: 5, superset_group: 'B2' },
            { name: 'Wide Grip Machine Row', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 6, superset_group: 'C1' },
            { name: 'Dumbbell Step Up', set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: 'Per leg', order_index: 7, superset_group: 'C2' },
            { name: 'Dumbbell Side Lateral Raises', set_count: 2, rep_range: '12-15', tempo: '2020', rest_seconds: 60, notes: null, order_index: 8, superset_group: 'D' },
            { name: 'Dumbbell Skullcrushers', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 45, notes: null, order_index: 9, superset_group: 'E1' },
            { name: 'Incline Dumbbell Curls', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 45, notes: null, order_index: 10, superset_group: 'E2' },
          ],
        },
        {
          day_label: 'Metabolic Conditioning',
          session_type: 'conditioning',
          exercises: [
            { name: 'AMRAP in 40 Minutes', set_count: 1, rep_range: '40 min', tempo: '—', rest_seconds: 0, notes: 'As many rounds as possible — choose movements that complement your training week', order_index: 0, superset_group: 'A' },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ─── 17. 3 x Full Body + Accessories ────────────────────────────────────────
  {
    id: '3x-full-body-accessories',
    name: '3 x Full Body + Accessories',
    description: 'Three full-body sessions each week paired with conditioning days and a dedicated accessories day for arms, delts and calves. Machine-friendly supersets throughout for maximum efficiency and metabolic demand.',
    goal_type: 'lean_gain',
    phase: 'Hypertrophy',
    default_weeks: 8,
    days_per_week: 6,
    difficulty: 'intermediate',
    icon: '💪',
    color: 'var(--accent)',
    tags: ['full-body', 'hypertrophy', 'superset', 'machines', 'conditioning', 'accessories'],
    generateSessions: (weeks) => {
      const sessions = []
      const DAYS = [
        {
          day_label: 'Full Body Day 1',
          session_type: 'strength',
          exercises: [
            { name: 'Childs Pose', set_count: 2, rep_range: '30s', tempo: '1111', rest_seconds: 0, notes: 'Warmup', order_index: 0, superset_group: 'W1' },
            { name: 'Kettlebell Arm Bar', set_count: 2, rep_range: '5', tempo: '1111', rest_seconds: 0, notes: 'Warmup — per side', order_index: 1, superset_group: 'W2' },
            { name: 'Assisted Deadhang', set_count: 2, rep_range: '20s', tempo: '1111', rest_seconds: 0, notes: 'Warmup', order_index: 2, superset_group: 'W3' },
            { name: 'Downdog Toe Tap', set_count: 2, rep_range: '10', tempo: '1010', rest_seconds: 60, notes: 'Warmup — last in giant set', order_index: 3, superset_group: 'W4' },
            { name: 'Plate Loaded Shoulder Press Machine', set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 4, superset_group: 'A1' },
            { name: 'Dumbbell Romanian Deadlift', set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 5, superset_group: 'A2' },
            { name: 'Lat Pulldown', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 6, superset_group: 'B1' },
            { name: 'Bulgarian Split Squat', set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: 'Per leg', order_index: 7, superset_group: 'B2' },
            { name: '30° Dumbbell Incline Press', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 8, superset_group: 'C1' },
            { name: 'Prone Leg Curl', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 9, superset_group: 'C2' },
            { name: 'Chest Supported Machine Row', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 10, superset_group: 'D1' },
            { name: 'Standing Smith Machine Calf Raise', set_count: 3, rep_range: '15-20', tempo: '2020', rest_seconds: 60, notes: null, order_index: 11, superset_group: 'D2' },
            { name: 'Dual Cable Face Away Bicep Curls', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 45, notes: null, order_index: 12, superset_group: 'E1' },
            { name: 'Cross Cable Tricep Pushdowns', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 45, notes: null, order_index: 13, superset_group: 'E2' },
          ],
        },
        {
          day_label: 'Conditioning',
          session_type: 'conditioning',
          exercises: [
            { name: 'Single Leg Bridge', set_count: 2, rep_range: '10', tempo: '2010', rest_seconds: 0, notes: 'Warmup — per side', order_index: 0, superset_group: 'W1' },
            { name: 'Cossack Squat', set_count: 2, rep_range: '8', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'W2' },
            { name: 'Pogo Hops', set_count: 2, rep_range: '20', tempo: '1010', rest_seconds: 0, notes: 'Warmup', order_index: 2, superset_group: 'W3' },
            { name: 'Lateral Pogo Hops', set_count: 2, rep_range: '20', tempo: '1010', rest_seconds: 90, notes: 'Warmup — last in giant set', order_index: 3, superset_group: 'W4' },
            { name: 'Cardio Equipment of Choice', set_count: 1, rep_range: '20-30 min', tempo: '—', rest_seconds: 0, notes: 'Bike, rower, ski erg or treadmill — steady state Zone 2', order_index: 4, superset_group: 'A' },
          ],
        },
        {
          day_label: 'Full Body Day 2',
          session_type: 'strength',
          exercises: [
            { name: 'Heel Elevated Toe Reach', set_count: 2, rep_range: '10', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 0, superset_group: 'W1' },
            { name: 'Heel Elevated Goblet Squat', set_count: 2, rep_range: '8', tempo: '3010', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'W2' },
            { name: 'Copenhagen Plank', set_count: 2, rep_range: '20s', tempo: '1111', rest_seconds: 0, notes: 'Warmup', order_index: 2, superset_group: 'W3' },
            { name: 'Single Leg Hamstring Bridge', set_count: 2, rep_range: '10', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 3, superset_group: 'W4' },
            { name: 'Depth Jumps', set_count: 2, rep_range: '5', tempo: '1010', rest_seconds: 60, notes: 'Warmup — absorb landing, fast rebound', order_index: 4, superset_group: 'W5' },
            { name: 'Pec Deck Machine', set_count: 4, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 5, superset_group: 'A1' },
            { name: 'Hip Adductor Machine', set_count: 4, rep_range: '15-20', tempo: '3010', rest_seconds: 60, notes: null, order_index: 6, superset_group: 'A2' },
            { name: '45° Back Extension', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 7, superset_group: 'B1' },
            { name: 'GHD Sit Ups', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 8, superset_group: 'B2' },
            { name: 'Leg Extensions', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 9, superset_group: 'C1' },
            { name: 'Standing Cable Chest Press (Neutral Grip)', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 10, superset_group: 'C2' },
            { name: 'Heel Elevated Safety Bar Squat', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 11, superset_group: 'D1' },
            { name: 'Chest Supported T-Bar Row', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 12, superset_group: 'D2' },
            { name: 'Dumbbell Lateral Raise', set_count: 3, rep_range: '12-15', tempo: '2020', rest_seconds: 45, notes: null, order_index: 13, superset_group: 'E1' },
            { name: 'Decline Bench Dumbbell Skullcrusher', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 45, notes: null, order_index: 14, superset_group: 'E2' },
          ],
        },
        {
          day_label: 'Conditioning',
          session_type: 'conditioning',
          exercises: [
            { name: 'Single Leg Bridge', set_count: 2, rep_range: '10', tempo: '2010', rest_seconds: 0, notes: 'Warmup — per side', order_index: 0, superset_group: 'W1' },
            { name: 'Cossack Squat', set_count: 2, rep_range: '8', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'W2' },
            { name: 'Pogo Hops', set_count: 2, rep_range: '20', tempo: '1010', rest_seconds: 0, notes: 'Warmup', order_index: 2, superset_group: 'W3' },
            { name: 'Lateral Pogo Hops', set_count: 2, rep_range: '20', tempo: '1010', rest_seconds: 90, notes: 'Warmup — last in giant set', order_index: 3, superset_group: 'W4' },
            { name: 'Cardio Equipment of Choice', set_count: 1, rep_range: '20-30 min', tempo: '—', rest_seconds: 0, notes: 'Bike, rower, ski erg or treadmill — steady state Zone 2', order_index: 4, superset_group: 'A' },
          ],
        },
        {
          day_label: 'Full Body Day 3',
          session_type: 'strength',
          exercises: [
            { name: 'Childs Pose', set_count: 2, rep_range: '30s', tempo: '1111', rest_seconds: 0, notes: 'Warmup', order_index: 0, superset_group: 'W1' },
            { name: 'Kettlebell Arm Bar', set_count: 2, rep_range: '5', tempo: '1111', rest_seconds: 0, notes: 'Warmup — per side', order_index: 1, superset_group: 'W2' },
            { name: '45° Side Bends', set_count: 2, rep_range: '12', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 2, superset_group: 'W3' },
            { name: 'Deficit Plate Push Ups', set_count: 2, rep_range: '8', tempo: '2010', rest_seconds: 60, notes: 'Warmup — last in giant set', order_index: 3, superset_group: 'W4' },
            { name: 'Seated Cable Y Raise', set_count: 2, rep_range: '12-15', tempo: '2020', rest_seconds: 60, notes: 'Shoulder health / activation', order_index: 4, superset_group: 'A' },
            { name: 'Hook Lying Dumbbell Press', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 5, superset_group: 'B1' },
            { name: 'Single Arm Vertical Pulldown', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: 'Per arm', order_index: 6, superset_group: 'B2' },
            { name: 'Dumbbell Bent Over Row', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 7, superset_group: 'C1' },
            { name: 'Leg Extensions', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: null, order_index: 8, superset_group: 'C2' },
            { name: 'Pendulum Squat', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 9, superset_group: 'D1' },
            { name: 'Half Kneeling Landmine Press', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: 'Per arm', order_index: 10, superset_group: 'D2' },
            { name: 'Seated Hamstring Curl', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 45, notes: null, order_index: 11, superset_group: 'E1' },
            { name: 'Rear Delt Machine Fly', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 45, notes: null, order_index: 12, superset_group: 'E2' },
            { name: 'Cable EZ Bar Curl', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 45, notes: null, order_index: 13, superset_group: 'F1' },
            { name: 'Cable Tricep Pushdown', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 45, notes: null, order_index: 14, superset_group: 'F2' },
          ],
        },
        {
          day_label: 'Accessories — Arms, Delts & Calves',
          session_type: 'strength',
          exercises: [
            { name: 'Box Thoracic Extension', set_count: 2, rep_range: '10', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 0, superset_group: 'W1' },
            { name: 'Deadhang', set_count: 2, rep_range: '20s', tempo: '1111', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'W2' },
            { name: 'Half Kneeling Landmine Press', set_count: 2, rep_range: '8', tempo: '2010', rest_seconds: 0, notes: 'Warmup — per arm', order_index: 2, superset_group: 'W3' },
            { name: 'Downward Dog Toe Taps', set_count: 2, rep_range: '10', tempo: '1010', rest_seconds: 60, notes: 'Warmup — last in giant set', order_index: 3, superset_group: 'W4' },
            { name: 'Seated Calf Raise', set_count: 3, rep_range: '15-20', tempo: '2020', rest_seconds: 45, notes: null, order_index: 4, superset_group: 'A1' },
            { name: 'Pull Up', set_count: 3, rep_range: '8-10', tempo: '3010', rest_seconds: 45, notes: null, order_index: 5, superset_group: 'A2' },
            { name: 'X-Over Cable Lateral Raises', set_count: 3, rep_range: '12-15', tempo: '2020', rest_seconds: 45, notes: null, order_index: 6, superset_group: 'B1' },
            { name: 'DB Single Leg Calf Raise', set_count: 3, rep_range: '15-20', tempo: '2020', rest_seconds: 45, notes: null, order_index: 7, superset_group: 'B2' },
            { name: 'Cross Cable Tricep Pushdowns', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 45, notes: null, order_index: 8, superset_group: 'C1' },
            { name: 'Single Arm High Cable Bicep Curl', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 45, notes: 'Per arm', order_index: 9, superset_group: 'C2' },
            { name: 'JM Floor Press', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 45, notes: null, order_index: 10, superset_group: 'D1' },
            { name: 'Preacher Curl Machine', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 45, notes: null, order_index: 11, superset_group: 'D2' },
            { name: 'Cable Single Arm Overhead Tricep Extension', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 45, notes: 'Per arm', order_index: 12, superset_group: 'E1' },
            { name: 'Dual Cable Face Away Bicep Curls', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 45, notes: null, order_index: 13, superset_group: 'E2' },
          ],
        },
        {
          day_label: 'Conditioning',
          session_type: 'conditioning',
          exercises: [
            { name: 'Single Leg Bridge', set_count: 2, rep_range: '10', tempo: '2010', rest_seconds: 0, notes: 'Warmup — per side', order_index: 0, superset_group: 'W1' },
            { name: 'Cossack Squat', set_count: 2, rep_range: '8', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'W2' },
            { name: 'Pogo Hops', set_count: 2, rep_range: '20', tempo: '1010', rest_seconds: 0, notes: 'Warmup', order_index: 2, superset_group: 'W3' },
            { name: 'Lateral Pogo Hops', set_count: 2, rep_range: '20', tempo: '1010', rest_seconds: 90, notes: 'Warmup — last in giant set', order_index: 3, superset_group: 'W4' },
            { name: 'Cardio Equipment of Choice', set_count: 1, rep_range: '20-30 min', tempo: '—', rest_seconds: 0, notes: 'Bike, rower, ski erg or treadmill — steady state Zone 2', order_index: 4, superset_group: 'A' },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ── Template 23 — Accumulation 5x5 ──────────────────────────────────────
  {
    id: 'accumulation-5x5',
    name: 'Accumulation 5 × 5',
    description: 'A 3-day Squat/Press, Squat/Pull, Hinge/Push programme using the classic 5-set × 5-rep accumulation scheme on compound supersets. An excellent strength foundation phase before transitioning to lower-rep intensification. Same CNS warmup structure and accessory prescription as the 6×4 sibling programme.',
    goal_type: 'strength',
    phase: 'Accumulation',
    default_weeks: 6,
    days_per_week: 3,
    difficulty: 'intermediate',
    icon: '💪',
    color: '#7c3aed',
    tags: ['strength', 'accumulation', '5x5', 'squat', 'hinge', 'superset'],
    generateSessions: (weeks) => {
      const sessions = []
      const DAYS = [
        {
          day_label: 'Day 1 — Squat / Press',
          session_type: 'strength',
          exercises: [
            { name: 'Single Leg Hamstring Bridge',               set_count: 2, rep_range: '10/side', tempo: '2010', rest_seconds: 10,  notes: 'CNS warmup giant set', order_index: 0, superset_group: 'W1' },
            { name: 'Copenhagen Plank',                          set_count: 2, rep_range: '20s/side', tempo: null,   rest_seconds: 10,  notes: 'CNS warmup giant set', order_index: 1, superset_group: 'W2' },
            { name: 'Front Foot Elevated Split Squat (CL Load)', set_count: 2, rep_range: '6/side',  tempo: '3010', rest_seconds: 10,  notes: 'CNS warmup giant set', order_index: 2, superset_group: 'W3' },
            { name: 'Hanging Knee Raises',                       set_count: 2, rep_range: '10-12',   tempo: '2010', rest_seconds: 10,  notes: 'CNS warmup giant set', order_index: 3, superset_group: 'W4' },
            { name: 'Deficit Push Ups',                          set_count: 2, rep_range: '8-10',    tempo: '3010', rest_seconds: 90,  notes: 'CNS warmup giant set finisher', order_index: 4, superset_group: 'W5' },
            { name: 'Prone Hamstring Curl Machine',              set_count: 2, rep_range: '10-12',   tempo: '3010', rest_seconds: 60,  notes: null, order_index: 5, superset_group: null },
            { name: 'Barbell Front Squat',                       set_count: 5, rep_range: '5',       tempo: '3010', rest_seconds: 10,  notes: 'Superset with Bench Press — 5×5 accumulation scheme', order_index: 6, superset_group: 'A1' },
            { name: 'Flat Barbell Bench Press',                  set_count: 5, rep_range: '5',       tempo: '3010', rest_seconds: 90,  notes: 'Superset finisher — 5×5 accumulation', order_index: 7, superset_group: 'A2' },
            { name: 'Alternating Glute Bridge Press',            set_count: 2, rep_range: '10/side', tempo: '2010', rest_seconds: 60,  notes: null, order_index: 8, superset_group: null },
            { name: 'Seated Chest Supported Row',                set_count: 3, rep_range: '10-12',   tempo: '3010', rest_seconds: 60,  notes: null, order_index: 9, superset_group: null },
            { name: 'Single Arm Cable Lateral Raise',            set_count: 2, rep_range: '12-15',   tempo: '2010', rest_seconds: 60,  notes: null, order_index: 10, superset_group: null },
            { name: 'Cross Body Tricep Extension',               set_count: 2, rep_range: '12-15',   tempo: '2010', rest_seconds: 10,  notes: 'Superset with Behind-Back D-Handle Curls', order_index: 11, superset_group: 'B1' },
            { name: 'Behind-The-Back Dual Cable D-Handle Curls', set_count: 2, rep_range: '10-12',   tempo: '2010', rest_seconds: 60,  notes: 'Superset finisher', order_index: 12, superset_group: 'B2' },
            { name: 'Leg Extensions',                            set_count: 2, rep_range: '15-20',   tempo: '2010', rest_seconds: 60,  notes: null, order_index: 13, superset_group: null },
            { name: '45° Hip Extension',                         set_count: 2, rep_range: '15-20',   tempo: '3010', rest_seconds: 60,  notes: null, order_index: 14, superset_group: null },
          ],
        },
        {
          day_label: 'Day 2 — Squat / Pull',
          session_type: 'strength',
          exercises: [
            { name: 'Single Leg Hamstring Bridge',               set_count: 2, rep_range: '10/side', tempo: '2010', rest_seconds: 10,  notes: 'CNS warmup giant set', order_index: 0, superset_group: 'W1' },
            { name: 'Copenhagen Plank',                          set_count: 2, rep_range: '20s/side', tempo: null,   rest_seconds: 10,  notes: 'CNS warmup giant set', order_index: 1, superset_group: 'W2' },
            { name: 'Front Foot Elevated Split Squat (CL Load)', set_count: 2, rep_range: '6/side',  tempo: '3010', rest_seconds: 10,  notes: 'CNS warmup giant set', order_index: 2, superset_group: 'W3' },
            { name: '45° Side Bends',                           set_count: 2, rep_range: '10/side', tempo: '2010', rest_seconds: 10,  notes: 'CNS warmup giant set', order_index: 3, superset_group: 'W4' },
            { name: 'Kneeling Cable Crunches',                   set_count: 2, rep_range: '12-15',   tempo: '2010', rest_seconds: 90,  notes: 'CNS warmup giant set finisher', order_index: 4, superset_group: 'W5' },
            { name: 'Seated Leg Curl',                           set_count: 2, rep_range: '10-12',   tempo: '3010', rest_seconds: 10,  notes: 'Superset primer', order_index: 5, superset_group: 'P1' },
            { name: 'Single Arm High Cable Bicep Curl',          set_count: 2, rep_range: '10-12',   tempo: '2010', rest_seconds: 60,  notes: 'Superset primer finisher', order_index: 6, superset_group: 'P2' },
            { name: 'Barbell Back Squat',                        set_count: 5, rep_range: '5',       tempo: '3010', rest_seconds: 10,  notes: 'Superset with Pull Ups — 5×5 accumulation scheme', order_index: 7, superset_group: 'A1' },
            { name: 'Pull Ups',                                  set_count: 5, rep_range: '5',       tempo: '3010', rest_seconds: 90,  notes: 'Superset finisher — 5×5 accumulation', order_index: 8, superset_group: 'A2' },
            { name: '45° Incline DB Press',                      set_count: 2, rep_range: '10-12',   tempo: '3010', rest_seconds: 60,  notes: null, order_index: 9, superset_group: null },
            { name: 'Pec Deck Machine',                          set_count: 2, rep_range: '12-15',   tempo: '2010', rest_seconds: 60,  notes: null, order_index: 10, superset_group: null },
            { name: 'Seated Chest Supported Row',                set_count: 2, rep_range: '10-12',   tempo: '3010', rest_seconds: 60,  notes: null, order_index: 11, superset_group: null },
            { name: 'Bulgarian Split Squat',                     set_count: 2, rep_range: '8/side',  tempo: '3010', rest_seconds: 60,  notes: null, order_index: 12, superset_group: null },
            { name: '45° Hip Extension',                         set_count: 2, rep_range: '15-20',   tempo: '3010', rest_seconds: 60,  notes: null, order_index: 13, superset_group: null },
            { name: 'Standing Calf Raise',                       set_count: 2, rep_range: '15-20',   tempo: '2010', rest_seconds: 60,  notes: null, order_index: 14, superset_group: null },
          ],
        },
        {
          day_label: 'Day 3 — Hinge / Push',
          session_type: 'strength',
          exercises: [
            { name: 'Kettlebell Arm Bar',                   set_count: 2, rep_range: '5/side',  tempo: '3010', rest_seconds: 10,  notes: 'CNS warmup giant set', order_index: 0, superset_group: 'W1' },
            { name: 'Copenhagen Plank',                     set_count: 2, rep_range: '20s/side', tempo: null,   rest_seconds: 10,  notes: 'CNS warmup giant set', order_index: 1, superset_group: 'W2' },
            { name: 'Kickstance RDL (Contralateral Load)',  set_count: 2, rep_range: '8/side',  tempo: '3010', rest_seconds: 10,  notes: 'CNS warmup giant set', order_index: 2, superset_group: 'W3' },
            { name: 'Ab Rollout',                           set_count: 2, rep_range: '8-10',    tempo: '3010', rest_seconds: 90,  notes: 'CNS warmup giant set finisher', order_index: 3, superset_group: 'W4' },
            { name: 'Single Arm High Cable Bicep Curl',     set_count: 2, rep_range: '10-12',   tempo: '2010', rest_seconds: 60,  notes: 'Primer', order_index: 4, superset_group: null },
            { name: 'Conventional Deadlift',                set_count: 5, rep_range: '5',       tempo: '3010', rest_seconds: 10,  notes: 'Superset with Standing Barbell Shoulder Press — 5×5 accumulation', order_index: 5, superset_group: 'A1' },
            { name: 'Standing Barbell Shoulder Press',      set_count: 5, rep_range: '5',       tempo: '3010', rest_seconds: 90,  notes: 'Superset finisher — 5×5 accumulation', order_index: 6, superset_group: 'A2' },
            { name: 'Pull Ups',                             set_count: 2, rep_range: '6-8',     tempo: '3010', rest_seconds: 60,  notes: null, order_index: 7, superset_group: null },
            { name: 'Cable Single Arm High to Low Row',     set_count: 2, rep_range: '10-12',   tempo: '3010', rest_seconds: 60,  notes: null, order_index: 8, superset_group: null },
            { name: 'Seated Chest Supported Row',           set_count: 3, rep_range: '10-12',   tempo: '3010', rest_seconds: 60,  notes: null, order_index: 9, superset_group: null },
            { name: 'Single Arm Cable Lateral Raise',       set_count: 2, rep_range: '12-15',   tempo: '2010', rest_seconds: 60,  notes: null, order_index: 10, superset_group: null },
            { name: 'Walking Lunges',                       set_count: 2, rep_range: '10/leg',  tempo: '2010', rest_seconds: 60,  notes: null, order_index: 11, superset_group: null },
            { name: 'Standing Calf Raise',                  set_count: 2, rep_range: '15-20',   tempo: '2010', rest_seconds: 60,  notes: null, order_index: 12, superset_group: null },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ── Template 22 — Accumulation 2 - 6 x 4 ────────────────────────────────
  {
    id: 'accumulation-2-6x4',
    name: 'Accumulation 2 — 6 × 4',
    description: 'A 3-day Squat/Press, Squat/Pull, Hinge/Push programme using a 6-set × 4-rep accumulation scheme on main compound lifts. CNS-activating giant-set warmups precede heavy barbell supersets, with targeted accessory work to build structural balance and maximise strength accumulation.',
    goal_type: 'strength',
    phase: 'Accumulation',
    default_weeks: 6,
    days_per_week: 3,
    difficulty: 'intermediate',
    icon: '📈',
    color: '#b45309',
    tags: ['strength', 'accumulation', '6x4', 'squat', 'hinge', 'superset'],
    generateSessions: (weeks) => {
      const sessions = []
      const DAYS = [
        {
          day_label: 'Day 1 — Squat / Press',
          session_type: 'strength',
          exercises: [
            { name: 'Single Leg Hamstring Bridge',                    set_count: 2, rep_range: '10/side', tempo: '2010', rest_seconds: 10, notes: 'CNS warmup giant set — move to W2', order_index: 0, superset_group: 'W1' },
            { name: 'Copenhagen Plank',                               set_count: 2, rep_range: '20s/side', tempo: null,   rest_seconds: 10, notes: 'CNS warmup giant set', order_index: 1, superset_group: 'W2' },
            { name: 'Front Foot Elevated Split Squat (CL Load)',      set_count: 2, rep_range: '6/side',  tempo: '3010', rest_seconds: 10, notes: 'CNS warmup giant set', order_index: 2, superset_group: 'W3' },
            { name: 'Hanging Knee Raises',                            set_count: 2, rep_range: '10-12',   tempo: '2010', rest_seconds: 10, notes: 'CNS warmup giant set', order_index: 3, superset_group: 'W4' },
            { name: 'Deficit Push Ups',                               set_count: 2, rep_range: '8-10',    tempo: '3010', rest_seconds: 90, notes: 'CNS warmup giant set finisher', order_index: 4, superset_group: 'W5' },
            { name: 'Prone Hamstring Curl Machine',                   set_count: 2, rep_range: '10-12',   tempo: '3010', rest_seconds: 60, notes: null, order_index: 5, superset_group: null },
            { name: 'Barbell Front Squat',                            set_count: 6, rep_range: '4',       tempo: '3010', rest_seconds: 10, notes: 'Superset with Bench Press — 6×4 accumulation scheme', order_index: 6, superset_group: 'A1' },
            { name: 'Flat Barbell Bench Press',                       set_count: 6, rep_range: '4',       tempo: '3010', rest_seconds: 90, notes: 'Superset finisher — 6×4 accumulation', order_index: 7, superset_group: 'A2' },
            { name: 'Alternating Glute Bridge Press',                 set_count: 2, rep_range: '10/side', tempo: '2010', rest_seconds: 60, notes: null, order_index: 8, superset_group: null },
            { name: 'Seated Chest Supported Row',                     set_count: 3, rep_range: '10-12',   tempo: '3010', rest_seconds: 60, notes: null, order_index: 9, superset_group: null },
            { name: 'Single Arm Cable Lateral Raise',                 set_count: 2, rep_range: '12-15',   tempo: '2010', rest_seconds: 60, notes: null, order_index: 10, superset_group: null },
            { name: 'Cross Body Tricep Extension',                    set_count: 2, rep_range: '12-15',   tempo: '2010', rest_seconds: 10, notes: 'Superset with Behind-Back D-Handle Curls', order_index: 11, superset_group: 'B1' },
            { name: 'Behind-The-Back Dual Cable D-Handle Curls',      set_count: 2, rep_range: '10-12',   tempo: '2010', rest_seconds: 60, notes: 'Superset finisher', order_index: 12, superset_group: 'B2' },
            { name: 'Leg Extensions',                                 set_count: 2, rep_range: '15-20',   tempo: '2010', rest_seconds: 60, notes: null, order_index: 13, superset_group: null },
            { name: '45° Hip Extension',                              set_count: 2, rep_range: '15-20',   tempo: '3010', rest_seconds: 60, notes: null, order_index: 14, superset_group: null },
          ],
        },
        {
          day_label: 'Day 2 — Squat / Pull',
          session_type: 'strength',
          exercises: [
            { name: 'Single Leg Hamstring Bridge',               set_count: 2, rep_range: '10/side', tempo: '2010', rest_seconds: 10, notes: 'CNS warmup giant set', order_index: 0, superset_group: 'W1' },
            { name: 'Copenhagen Plank',                          set_count: 2, rep_range: '20s/side', tempo: null,   rest_seconds: 10, notes: 'CNS warmup giant set', order_index: 1, superset_group: 'W2' },
            { name: 'Front Foot Elevated Split Squat (CL Load)', set_count: 2, rep_range: '6/side',  tempo: '3010', rest_seconds: 10, notes: 'CNS warmup giant set', order_index: 2, superset_group: 'W3' },
            { name: '45° Side Bends',                           set_count: 2, rep_range: '10/side', tempo: '2010', rest_seconds: 10, notes: 'CNS warmup giant set', order_index: 3, superset_group: 'W4' },
            { name: 'Kneeling Cable Crunches',                   set_count: 2, rep_range: '12-15',   tempo: '2010', rest_seconds: 90, notes: 'CNS warmup giant set finisher', order_index: 4, superset_group: 'W5' },
            { name: 'Seated Leg Curl',                           set_count: 2, rep_range: '10-12',   tempo: '3010', rest_seconds: 10, notes: 'Superset with Single Arm High Cable Bicep Curl', order_index: 5, superset_group: 'P1' },
            { name: 'Single Arm High Cable Bicep Curl',          set_count: 2, rep_range: '10-12',   tempo: '2010', rest_seconds: 60, notes: 'Superset finisher', order_index: 6, superset_group: 'P2' },
            { name: 'Barbell Back Squat',                        set_count: 6, rep_range: '4',       tempo: '3010', rest_seconds: 10, notes: 'Superset with Pull Ups — 6×4 accumulation scheme', order_index: 7, superset_group: 'A1' },
            { name: 'Pull Ups',                                  set_count: 6, rep_range: '4',       tempo: '3010', rest_seconds: 90, notes: 'Superset finisher — 6×4 accumulation', order_index: 8, superset_group: 'A2' },
            { name: '45° Incline DB Press',                      set_count: 2, rep_range: '10-12',   tempo: '3010', rest_seconds: 60, notes: null, order_index: 9, superset_group: null },
            { name: 'Pec Deck Machine',                          set_count: 2, rep_range: '12-15',   tempo: '2010', rest_seconds: 60, notes: null, order_index: 10, superset_group: null },
            { name: 'Seated Chest Supported Row',                set_count: 2, rep_range: '10-12',   tempo: '3010', rest_seconds: 60, notes: null, order_index: 11, superset_group: null },
            { name: 'Bulgarian Split Squat',                     set_count: 2, rep_range: '8/side',  tempo: '3010', rest_seconds: 60, notes: null, order_index: 12, superset_group: null },
            { name: '45° Hip Extension',                         set_count: 2, rep_range: '15-20',   tempo: '3010', rest_seconds: 60, notes: null, order_index: 13, superset_group: null },
            { name: 'Standing Calf Raise',                       set_count: 2, rep_range: '15-20',   tempo: '2010', rest_seconds: 60, notes: null, order_index: 14, superset_group: null },
          ],
        },
        {
          day_label: 'Day 3 — Hinge / Push',
          session_type: 'strength',
          exercises: [
            { name: 'Kettlebell Arm Bar',                   set_count: 2, rep_range: '5/side',  tempo: '3010', rest_seconds: 10, notes: 'CNS warmup giant set — shoulder stability', order_index: 0, superset_group: 'W1' },
            { name: 'Copenhagen Plank',                     set_count: 2, rep_range: '20s/side', tempo: null,   rest_seconds: 10, notes: 'CNS warmup giant set', order_index: 1, superset_group: 'W2' },
            { name: 'Kickstance RDL (Contralateral Load)',  set_count: 2, rep_range: '8/side',  tempo: '3010', rest_seconds: 10, notes: 'CNS warmup giant set', order_index: 2, superset_group: 'W3' },
            { name: 'Ab Rollout',                           set_count: 2, rep_range: '8-10',    tempo: '3010', rest_seconds: 90, notes: 'CNS warmup giant set finisher', order_index: 3, superset_group: 'W4' },
            { name: 'Single Arm High Cable Bicep Curl',     set_count: 2, rep_range: '10-12',   tempo: '2010', rest_seconds: 60, notes: 'Primer', order_index: 4, superset_group: null },
            { name: 'Conventional Deadlift',                set_count: 6, rep_range: '4',       tempo: '3010', rest_seconds: 10, notes: 'Superset with Standing Barbell Shoulder Press — 6×4 accumulation', order_index: 5, superset_group: 'A1' },
            { name: 'Standing Barbell Shoulder Press',      set_count: 6, rep_range: '4',       tempo: '3010', rest_seconds: 90, notes: 'Superset finisher — 6×4 accumulation', order_index: 6, superset_group: 'A2' },
            { name: 'Pull Ups',                             set_count: 2, rep_range: '6-8',     tempo: '3010', rest_seconds: 60, notes: null, order_index: 7, superset_group: null },
            { name: 'Cable Single Arm High to Low Row',     set_count: 2, rep_range: '10-12',   tempo: '3010', rest_seconds: 60, notes: null, order_index: 8, superset_group: null },
            { name: 'Seated Chest Supported Row',           set_count: 3, rep_range: '10-12',   tempo: '3010', rest_seconds: 60, notes: null, order_index: 9, superset_group: null },
            { name: 'Single Arm Cable Lateral Raise',       set_count: 2, rep_range: '12-15',   tempo: '2010', rest_seconds: 60, notes: null, order_index: 10, superset_group: null },
            { name: 'Walking Lunges',                       set_count: 2, rep_range: '10/leg',  tempo: '2010', rest_seconds: 60, notes: null, order_index: 11, superset_group: null },
            { name: 'Standing Calf Raise',                  set_count: 2, rep_range: '15-20',   tempo: '2010', rest_seconds: 60, notes: null, order_index: 12, superset_group: null },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ── Template 21 — 5 Day Full Body Functional With 2 Conditioning ─────────
  {
    id: '5-day-functional-2-conditioning',
    name: '5 Day Full Body Functional With 2 Conditioning',
    description: 'Seven-session functional training programme: 5 full-body strength/skill days and 2 dedicated conditioning days. Each strength session uses supersets and giant sets combining barbells, kettlebells, sleds and bodyweight movements for athletic development. "The Engine" and "Not for the Faint Hearted" push aerobic and anaerobic capacity.',
    goal_type: 'recomp',
    phase: 'Athletic Conditioning',
    default_weeks: 8,
    days_per_week: 5,
    difficulty: 'advanced',
    icon: '⚡',
    color: '#d97706',
    tags: ['functional', 'full-body', 'conditioning', 'kettlebell', 'athletic', 'superset'],
    generateSessions: (weeks) => {
      const sessions = []
      const DAYS = [
        {
          day_label: 'Day 1 — Full Body Functional A',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Barbell Back Squat',              set_count: 4, rep_range: '8-10',  tempo: '3010', rest_seconds: 10,  notes: 'Superset with Abductor Plank', order_index: 0, superset_group: 'A1' },
            { name: 'Abductor Plank',                  set_count: 4, rep_range: '20s/side', tempo: null, rest_seconds: 75, notes: 'Superset finisher', order_index: 1, superset_group: 'A2' },
            { name: 'Barbell Romanian Deadlift',       set_count: 4, rep_range: '8-10',  tempo: '3010', rest_seconds: 10,  notes: 'Superset with Behind-neck Walking Lunge', order_index: 2, superset_group: 'B1' },
            { name: 'Barbell Behind-the-Neck Walking Lunge', set_count: 4, rep_range: '8/leg', tempo: '2010', rest_seconds: 75, notes: 'Superset finisher', order_index: 3, superset_group: 'B2' },
            { name: 'Dual Kettlebell Front Squat',     set_count: 4, rep_range: '8-10',  tempo: '3010', rest_seconds: 10,  notes: 'Superset with TRX Prowler Row', order_index: 4, superset_group: 'C1' },
            { name: 'TRX Prowler Row',                 set_count: 4, rep_range: '10-12', tempo: '2010', rest_seconds: 75,  notes: 'Superset finisher — horizontal pull', order_index: 5, superset_group: 'C2' },
            { name: 'Banded Pull Ups',                 set_count: 3, rep_range: '6-10',  tempo: '3010', rest_seconds: 10,  notes: 'Giant set — move to D2', order_index: 6, superset_group: 'D1' },
            { name: 'Neutral Grip Push Up',            set_count: 3, rep_range: '10-15', tempo: '2010', rest_seconds: 10,  notes: 'Giant set — move to D3', order_index: 7, superset_group: 'D2' },
            { name: 'TRX Row',                         set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 75,  notes: 'Giant set finisher', order_index: 8, superset_group: 'D3' },
          ],
        },
        {
          day_label: 'Day 2 — Full Body Functional B',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Inchworm Walk Out',               set_count: 1, rep_range: '6-8',   tempo: '2010', rest_seconds: 60,  notes: 'Warmup — thoracic and hip mobility', order_index: 0, superset_group: null },
            { name: 'Front Foot Elevated Split Squat', set_count: 1, rep_range: '8/side', tempo: '3010', rest_seconds: 60,  notes: 'Activation set', order_index: 1, superset_group: null },
            { name: 'Front Foot Elevated DB Split Squat', set_count: 4, rep_range: '8/side', tempo: '3010', rest_seconds: 10, notes: 'Superset with Nordic Hold', order_index: 2, superset_group: 'A1' },
            { name: 'Nordic Hold',                     set_count: 4, rep_range: '5-8',   tempo: '4010', rest_seconds: 90,  notes: 'Superset finisher — isometric or eccentric', order_index: 3, superset_group: 'A2' },
            { name: 'Sumo Deadlift',                   set_count: 4, rep_range: '6-8',   tempo: '3010', rest_seconds: 10,  notes: 'Superset with Russian KB Swing', order_index: 4, superset_group: 'B1' },
            { name: 'Russian Kettlebell Swing',        set_count: 4, rep_range: '15-20', tempo: '1010', rest_seconds: 75,  notes: 'Superset finisher — hip hinge power', order_index: 5, superset_group: 'B2' },
            { name: 'Glute Rounded Back Hyperextension', set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 10, notes: 'Superset with Heel Elevated Sissy Squat', order_index: 6, superset_group: 'C1' },
            { name: 'Dumbbell Heel Elevated Sissy Squat', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 75, notes: 'Superset finisher — extreme quad stretch', order_index: 7, superset_group: 'C2' },
            { name: 'Ski Erg',                         set_count: 3, rep_range: '10-15 cal', tempo: null, rest_seconds: 10, notes: 'Conditioning giant set — move to G2', order_index: 8, superset_group: 'G1' },
            { name: 'Kettlebell Thruster',             set_count: 3, rep_range: '10-12', tempo: '1010', rest_seconds: 10,  notes: 'Conditioning giant set', order_index: 9, superset_group: 'G2' },
            { name: 'Burpee',                          set_count: 3, rep_range: '8-10',  tempo: null,   rest_seconds: 90,  notes: 'Conditioning giant set finisher', order_index: 10, superset_group: 'G3' },
          ],
        },
        {
          day_label: 'The Engine — Aerobic Conditioning',
          session_type: 'conditioning',
          exercises: [
            { name: 'Ski Erg',      set_count: 5, rep_range: '3-5 min', tempo: null, rest_seconds: 60, notes: 'Moderate pace — sustainable effort across all 5 sets', order_index: 0, superset_group: null },
            { name: 'Assault Bike', set_count: 5, rep_range: '3-5 min', tempo: null, rest_seconds: 60, notes: 'Match Ski Erg duration — Zone 2-3 effort', order_index: 1, superset_group: null },
          ],
        },
        {
          day_label: 'Day 3 — Full Body Functional C (HIIT)',
          session_type: 'conditioning',
          exercises: [
            { name: 'Barbell Back Squat',          set_count: 4, rep_range: '6-8',   tempo: '3010', rest_seconds: 10,  notes: 'Giant set — move to B2', order_index: 0, superset_group: 'B1' },
            { name: 'Hip Raise (Feet Elevated)',   set_count: 4, rep_range: '15-20', tempo: '2010', rest_seconds: 10,  notes: 'Giant set — move to B3', order_index: 1, superset_group: 'B2' },
            { name: 'Incline Bench Prone DB Row',  set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 75,  notes: 'Giant set finisher — horizontal pull', order_index: 2, superset_group: 'B3' },
            { name: 'Sled Push',                   set_count: 4, rep_range: '20m',   tempo: null,   rest_seconds: 10,  notes: 'Giant set — move to C2', order_index: 3, superset_group: 'C1' },
            { name: 'Double Kettlebell Clean',     set_count: 4, rep_range: '6-8',   tempo: '1010', rest_seconds: 10,  notes: 'Giant set — move to C3', order_index: 4, superset_group: 'C2' },
            { name: 'Nordic Hold',                 set_count: 4, rep_range: '5-8',   tempo: '4010', rest_seconds: 75,  notes: 'Giant set finisher', order_index: 5, superset_group: 'C3' },
            { name: 'Assault Bike',                set_count: 4, rep_range: '10-15 cal', tempo: null, rest_seconds: 10, notes: 'Giant set — move to D2', order_index: 6, superset_group: 'D1' },
            { name: 'Wall Balls',                  set_count: 4, rep_range: '15-20', tempo: '1010', rest_seconds: 10,  notes: 'Giant set — move to D3', order_index: 7, superset_group: 'D2' },
            { name: 'Lateral Burpee Box Jump Over',set_count: 4, rep_range: '8-10', tempo: null,   rest_seconds: 90,  notes: 'Giant set finisher — max effort', order_index: 8, superset_group: 'D3' },
          ],
        },
        {
          day_label: 'Day 4 — Full Body Functional D',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Conventional Deadlift',          set_count: 4, rep_range: '5-6',   tempo: '3010', rest_seconds: 10,  notes: 'Superset with Dead Ball Carry', order_index: 0, superset_group: 'A1' },
            { name: 'Dead Ball Carry',                set_count: 4, rep_range: '20m',   tempo: null,   rest_seconds: 90,  notes: 'Superset finisher — bear hug carry', order_index: 1, superset_group: 'A2' },
            { name: 'Plate Loaded Front Pulldown',    set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Superset with Single Arm DB Snatch', order_index: 2, superset_group: 'B1' },
            { name: 'Single Arm Dumbbell Snatch',     set_count: 4, rep_range: '5/side', tempo: '1010', rest_seconds: 75, notes: 'Superset finisher — power exercise', order_index: 3, superset_group: 'B2' },
            { name: 'Bilateral T-Bar Row (Handles)',  set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Superset with Dumbbell Pullover', order_index: 4, superset_group: 'C1' },
            { name: 'Dumbbell Pullover',              set_count: 4, rep_range: '12-15', tempo: '3010', rest_seconds: 75,  notes: 'Superset finisher — lat stretch', order_index: 5, superset_group: 'C2' },
            { name: 'DB Bicep Curl to Shoulder Press',set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 10,  notes: 'Superset with Cable Tricep Extension', order_index: 6, superset_group: 'D1' },
            { name: 'Cable Tricep Extension (Rope)',  set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 60,  notes: 'Superset finisher', order_index: 7, superset_group: 'D2' },
          ],
        },
        {
          day_label: 'Day 5 — Full Body Functional E',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Trap Bar Deadlift',              set_count: 4, rep_range: '5-6',   tempo: '3010', rest_seconds: 10,  notes: 'Superset with Hanging Knee Raises', order_index: 0, superset_group: 'A1' },
            { name: 'Hanging Knee Raises',            set_count: 4, rep_range: '10-15', tempo: '2010', rest_seconds: 75,  notes: 'Superset finisher', order_index: 1, superset_group: 'A2' },
            { name: 'Bulgarian Split Squat (Back Foot Elevated)', set_count: 4, rep_range: '8/side', tempo: '3010', rest_seconds: 10, notes: 'Superset with Half Kneeling KB Press', order_index: 2, superset_group: 'B1' },
            { name: 'Half Kneeling Kettlebell Press', set_count: 4, rep_range: '8/side', tempo: '2010', rest_seconds: 75, notes: 'Superset finisher', order_index: 3, superset_group: 'B2' },
            { name: 'MAG-Handle Seated Cable Row',    set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Superset with Deadball Slam', order_index: 4, superset_group: 'C1' },
            { name: 'Deadball Slam',                  set_count: 4, rep_range: '10-12', tempo: '1010', rest_seconds: 75,  notes: 'Superset finisher — power and core', order_index: 5, superset_group: 'C2' },
            { name: 'Farmers Walk',                   set_count: 3, rep_range: '30m',   tempo: null,   rest_seconds: 10,  notes: 'Giant set — move to G2', order_index: 6, superset_group: 'G1' },
            { name: 'Deadball Over the Shoulder Toss',set_count: 3, rep_range: '6-8',   tempo: null,   rest_seconds: 10,  notes: 'Giant set — move to G3', order_index: 7, superset_group: 'G2' },
            { name: 'Ab Roll Out',                    set_count: 3, rep_range: '8-10',  tempo: '3010', rest_seconds: 90,  notes: 'Giant set finisher', order_index: 8, superset_group: 'G3' },
          ],
        },
        {
          day_label: 'Not for the Faint Hearted — HIIT Conditioning',
          session_type: 'conditioning',
          exercises: [
            { name: 'Assault Bike',       set_count: 5, rep_range: '15-20 cal', tempo: null, rest_seconds: 10, notes: 'Giant set — max effort then move immediately to G2', order_index: 0, superset_group: 'G1' },
            { name: 'Burpee',             set_count: 5, rep_range: '10',        tempo: null, rest_seconds: 10, notes: 'Giant set — move to G3', order_index: 1, superset_group: 'G2' },
            { name: 'V Sit Ups',          set_count: 5, rep_range: '15-20',     tempo: '2010', rest_seconds: 10, notes: 'Giant set — move to G4', order_index: 2, superset_group: 'G3' },
            { name: 'Butterfly Crunch',   set_count: 5, rep_range: '15-20',     tempo: '2010', rest_seconds: 90, notes: 'Giant set finisher — rest 90s then repeat', order_index: 3, superset_group: 'G4' },
            { name: 'Rowing Machine',     set_count: 1, rep_range: '10-20 min', tempo: null,   rest_seconds: 0,  notes: 'Cooldown — steady state row after HIIT block', order_index: 4, superset_group: null },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ── Template 20 — 4 Day Split ────────────────────────────────────────────
  {
    id: '4-day-split',
    name: '4 Day Split',
    description: 'A 5-session upper/lower split targeting Posterior chain, Chest/Shoulders/Triceps, Lower body, Shoulders/Arms, and a Cardio/Mobility day. Each session opens with a CNS-activating giant-set warmup before structured supersets and single-exercise blocks.',
    goal_type: 'lean_gain',
    phase: 'Hypertrophy',
    default_weeks: 8,
    days_per_week: 4,
    difficulty: 'intermediate',
    icon: '🔀',
    color: '#0891b2',
    tags: ['hypertrophy', 'split', 'superset', 'posterior', 'upper-lower'],
    generateSessions: (weeks) => {
      const sessions = []
      const DAYS = [
        {
          day_label: 'Posterior — Back, Biceps & Hamstrings',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Single Leg Hamstring Bridge',             set_count: 2, rep_range: '10/side', tempo: '2010', rest_seconds: 10,  notes: 'Giant set warmup — move to W2', order_index: 0, superset_group: 'W1' },
            { name: 'Copenhagen Plank',                        set_count: 2, rep_range: '20s/side', tempo: null,   rest_seconds: 10,  notes: 'Giant set warmup', order_index: 1, superset_group: 'W2' },
            { name: 'Front Foot Elevated Split Squat',         set_count: 2, rep_range: '8/side',  tempo: '3010', rest_seconds: 90,  notes: 'Giant set warmup finisher', order_index: 2, superset_group: 'W3' },
            { name: 'Snatch Grip Deadlift',                    set_count: 3, rep_range: '5-6',     tempo: '3010', rest_seconds: 120, notes: 'Wide grip — more thoracic demand', order_index: 3, superset_group: null },
            { name: 'Lat Pulldown to Sternum',                 set_count: 3, rep_range: '10-12',   tempo: '3010', rest_seconds: 90,  notes: 'Pull to low chest — squeeze lats', order_index: 4, superset_group: null },
            { name: 'T Bar Row',                               set_count: 2, rep_range: '10-12',   tempo: '3010', rest_seconds: 75,  notes: null, order_index: 5, superset_group: null },
            { name: 'Rear Delt Cable Fly',                     set_count: 3, rep_range: '15-20',   tempo: '2010', rest_seconds: 60,  notes: null, order_index: 6, superset_group: null },
            { name: 'Cable Single Arm Low Curl (Facing Stack)',set_count: 3, rep_range: '10-12',   tempo: '2010', rest_seconds: 10,  notes: 'Superset — move to B2', order_index: 7, superset_group: 'B1' },
            { name: 'Cable Single Arm Low Curl (Facing Away)', set_count: 3, rep_range: '10-12',   tempo: '2010', rest_seconds: 60,  notes: 'Superset finisher', order_index: 8, superset_group: 'B2' },
            { name: 'Glute Ham Raise',                         set_count: 3, rep_range: '8-10',    tempo: '3010', rest_seconds: 90,  notes: null, order_index: 9, superset_group: null },
          ],
        },
        {
          day_label: 'Chest, Shoulders & Triceps',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Supine Arm Bar',           set_count: 2, rep_range: '5/side',  tempo: '3010', rest_seconds: 10,  notes: 'Giant set warmup — shoulder stability', order_index: 0, superset_group: 'W1' },
            { name: 'Deadhang',                 set_count: 2, rep_range: '20-30s',  tempo: null,   rest_seconds: 10,  notes: 'Giant set warmup — lat and shoulder decompression', order_index: 1, superset_group: 'W2' },
            { name: 'Deficit Push Ups',         set_count: 2, rep_range: '8-10',    tempo: '3010', rest_seconds: 90,  notes: 'Giant set warmup finisher — full pec stretch', order_index: 2, superset_group: 'W3' },
            { name: 'Upper Chest Fly',          set_count: 3, rep_range: '12-15',   tempo: '3010', rest_seconds: 75,  notes: null, order_index: 3, superset_group: null },
            { name: 'Low Incline Dumbbell Press',set_count: 3, rep_range: '10-12',  tempo: '3010', rest_seconds: 90,  notes: 'Approx 20–30° incline', order_index: 4, superset_group: null },
            { name: 'High Incline Dumbbell Press',set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 90,  notes: 'Approx 60–70° incline — upper chest emphasis', order_index: 5, superset_group: null },
            { name: 'Incline Bench Y Raise',    set_count: 3, rep_range: '15-20',   tempo: '2010', rest_seconds: 60,  notes: 'Prone on incline bench — rear delt and lower trap', order_index: 6, superset_group: null },
            { name: 'Strict Dips',              set_count: 3, rep_range: '8-12',    tempo: '2010', rest_seconds: 10,  notes: 'Superset with Cable Tricep Pushdown', order_index: 7, superset_group: 'A1' },
            { name: 'Cable Tricep Pushdown (Straight Bar)', set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 75, notes: 'Superset finisher', order_index: 8, superset_group: 'A2' },
          ],
        },
        {
          day_label: 'Lower — Quads, Hamstrings & Glutes',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Heel Elevated Toe Reach',       set_count: 2, rep_range: '10',       tempo: '2010', rest_seconds: 10, notes: 'Giant set warmup — ankle and hip mobility', order_index: 0, superset_group: 'W1' },
            { name: 'Heel Elevated Goblet Squat',    set_count: 2, rep_range: '10',       tempo: '3010', rest_seconds: 10, notes: 'Giant set warmup', order_index: 1, superset_group: 'W2' },
            { name: 'Side Plank Pronation',          set_count: 2, rep_range: '5/side',   tempo: '2010', rest_seconds: 10, notes: 'Giant set warmup', order_index: 2, superset_group: 'W3' },
            { name: 'Pogo Hops',                     set_count: 2, rep_range: '20',       tempo: null,   rest_seconds: 90, notes: 'Giant set warmup finisher — reactive calf activation', order_index: 3, superset_group: 'W4' },
            { name: 'Hip Adductor',                  set_count: 3, rep_range: '15-20',    tempo: '2010', rest_seconds: 10, notes: 'Superset with Standing Calf Raise', order_index: 4, superset_group: 'A1' },
            { name: 'Standing Calf Raise',           set_count: 3, rep_range: '15-20',    tempo: '2010', rest_seconds: 60, notes: 'Superset finisher', order_index: 5, superset_group: 'A2' },
            { name: 'Heel Elevated Back Squat',      set_count: 3, rep_range: '8-10',     tempo: '3010', rest_seconds: 120, notes: 'Heels elevated for quad emphasis and depth', order_index: 6, superset_group: null },
            { name: 'Prone Hamstring Curl Machine',  set_count: 3, rep_range: '10-12',    tempo: '3010', rest_seconds: 10, notes: 'Superset with Romanian Deadlift', order_index: 7, superset_group: 'B1' },
            { name: 'Romanian Deadlift',             set_count: 3, rep_range: '10-12',    tempo: '3010', rest_seconds: 75, notes: 'Superset finisher', order_index: 8, superset_group: 'B2' },
            { name: '45° Back Extension',            set_count: 3, rep_range: '12-15',    tempo: '3010', rest_seconds: 10, notes: 'Superset with Leg Extensions', order_index: 9, superset_group: 'C1' },
            { name: 'Leg Extensions',                set_count: 3, rep_range: '15-20',    tempo: '2010', rest_seconds: 60, notes: 'Superset finisher', order_index: 10, superset_group: 'C2' },
          ],
        },
        {
          day_label: 'Shoulders & Arms',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Arm Bar',                         set_count: 2, rep_range: '5/side',  tempo: '3010', rest_seconds: 10, notes: 'Giant set warmup — rotator cuff and thoracic mobility', order_index: 0, superset_group: 'W1' },
            { name: 'Deadhang',                        set_count: 2, rep_range: '20-30s',  tempo: null,   rest_seconds: 10, notes: 'Giant set warmup', order_index: 1, superset_group: 'W2' },
            { name: 'Half Kneeling Landmine Press',    set_count: 2, rep_range: '8/side',  tempo: '2010', rest_seconds: 10, notes: 'Giant set warmup', order_index: 2, superset_group: 'W3' },
            { name: 'Ab Rollout',                      set_count: 2, rep_range: '8-10',    tempo: '3010', rest_seconds: 90, notes: 'Giant set warmup finisher', order_index: 3, superset_group: 'W4' },
            { name: 'Cable Y Raise',                   set_count: 3, rep_range: '15-20',   tempo: '2010', rest_seconds: 60, notes: 'Lower and mid trap emphasis', order_index: 4, superset_group: null },
            { name: 'Lat Pulldown',                    set_count: 3, rep_range: '10-12',   tempo: '3010', rest_seconds: 90, notes: null, order_index: 5, superset_group: null },
            { name: 'Cable Rear Delt Row (2 D-handles)',set_count: 4, rep_range: '12-15',  tempo: '2010', rest_seconds: 75, notes: 'Pull handles out wide — rear delt focus', order_index: 6, superset_group: null },
            { name: 'Standing Lateral Raise Machine',  set_count: 3, rep_range: '15-20',   tempo: '2010', rest_seconds: 60, notes: null, order_index: 7, superset_group: null },
            { name: 'Katana Extensions',               set_count: 3, rep_range: '12-15',   tempo: '2010', rest_seconds: 10, notes: 'Superset with Preacher Curl', order_index: 8, superset_group: 'A1' },
            { name: 'Preacher Curl Machine',           set_count: 3, rep_range: '10-12',   tempo: '3010', rest_seconds: 60, notes: 'Superset finisher', order_index: 9, superset_group: 'A2' },
          ],
        },
        {
          day_label: 'Cardio & Mobility',
          session_type: 'conditioning',
          exercises: [
            { name: 'Pigeon Pose',               set_count: 2, rep_range: '60s/side', tempo: null,   rest_seconds: 10, notes: 'Giant set mobility — move to W2', order_index: 0, superset_group: 'W1' },
            { name: 'Couch Stretch',             set_count: 2, rep_range: '60s/side', tempo: null,   rest_seconds: 10, notes: 'Giant set mobility', order_index: 1, superset_group: 'W2' },
            { name: 'Frog Pose',                 set_count: 2, rep_range: '60s',      tempo: null,   rest_seconds: 90, notes: 'Giant set mobility finisher — hip capsule stretch', order_index: 2, superset_group: 'W3' },
            { name: 'Couch Stretch (Timed)',     set_count: 1, rep_range: '2-3 min/side', tempo: null, rest_seconds: 60, notes: 'Deep hip flexor work', order_index: 3, superset_group: null },
            { name: 'Sprinter Lunge',            set_count: 3, rep_range: '10/side',  tempo: '2010', rest_seconds: 10, notes: 'Superset with Kickstance RDL', order_index: 4, superset_group: 'A1' },
            { name: 'Kickstance RDL (Contralateral)', set_count: 3, rep_range: '8/side', tempo: '3010', rest_seconds: 60, notes: 'Superset finisher', order_index: 5, superset_group: 'A2' },
            { name: 'Ski Erg',                   set_count: 3, rep_range: '15-20 cal', tempo: null,   rest_seconds: 10, notes: 'Superset with GHD Sit Ups — moderate pace', order_index: 6, superset_group: 'B1' },
            { name: 'GHD Sit Ups',               set_count: 3, rep_range: '10-12',    tempo: '2010', rest_seconds: 60, notes: 'Superset finisher', order_index: 7, superset_group: 'B2' },
            { name: 'Assault Bike',              set_count: 1, rep_range: '10-20 min', tempo: null,  rest_seconds: 0,  notes: 'Steady state — Zone 2 RPE 5-6/10', order_index: 8, superset_group: null },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ── Template 19 — 1RM Peaking ────────────────────────────────────────────
  {
    id: '1rm-peaking',
    name: '1RM Peaking',
    description: 'A 4-day Anterior/Posterior split designed to peak strength for 1 rep max testing. Giant-set warmups prime the nervous system with CNS-activating movements — jumps, plyometrics and loaded carries — before heavy structural work on squats, deadlifts, pressing and pulling patterns.',
    goal_type: 'strength',
    phase: 'Peaking',
    default_weeks: 6,
    days_per_week: 4,
    difficulty: 'advanced',
    icon: '🏆',
    color: '#dc2626',
    tags: ['strength', 'peaking', '1rm', 'anterior-posterior', 'cns-activation'],
    generateSessions: (weeks) => {
      const sessions = []
      const DAYS = [
        {
          day_label: 'Day 1 — Anterior',
          session_type: 'strength',
          exercises: [
            { name: 'Single Leg Hamstring Bridge',        set_count: 2, rep_range: '10/side', tempo: '2010', rest_seconds: 10,  notes: 'CNS activation giant set — move to W2', order_index: 0, superset_group: 'W1' },
            { name: 'Full Copenhagen Plank',              set_count: 2, rep_range: '20s/side', tempo: null,   rest_seconds: 10,  notes: 'CNS giant set', order_index: 1, superset_group: 'W2' },
            { name: 'Kickstance RDL (Contralateral Load)',set_count: 2, rep_range: '8/side',  tempo: '3010', rest_seconds: 10,  notes: 'CNS giant set', order_index: 2, superset_group: 'W3' },
            { name: 'Broad Jump to Single Leg Hop',       set_count: 2, rep_range: '5',       tempo: null,   rest_seconds: 10,  notes: 'CNS giant set — max effort', order_index: 3, superset_group: 'W4' },
            { name: 'Max Effort Vertical Jump',           set_count: 2, rep_range: '3',       tempo: null,   rest_seconds: 90,  notes: 'CNS giant set finisher — full recovery before main work', order_index: 4, superset_group: 'W5' },
            { name: 'Barbell Back Squat',                 set_count: 3, rep_range: '3-5',     tempo: '3010', rest_seconds: 180, notes: 'Work up to heavy triple; peaking load', order_index: 5, superset_group: null },
            { name: 'Angled Leg Press',                   set_count: 3, rep_range: '6-8',     tempo: '3010', rest_seconds: 120, notes: null, order_index: 6, superset_group: null },
            { name: 'Prone Hamstring Curl Machine',       set_count: 3, rep_range: '10-12',   tempo: '3010', rest_seconds: 75,  notes: null, order_index: 7, superset_group: null },
            { name: 'Neutral Grip Flat Dumbbell Press',   set_count: 3, rep_range: '8-10',    tempo: '3010', rest_seconds: 90,  notes: null, order_index: 8, superset_group: null },
            { name: 'Tricep Dips',                        set_count: 2, rep_range: '10-12',   tempo: '2010', rest_seconds: 60,  notes: null, order_index: 9, superset_group: null },
            { name: 'Dumbbell Side Lateral Raises',       set_count: 2, rep_range: '12-15',   tempo: '2010', rest_seconds: 60,  notes: null, order_index: 10, superset_group: null },
            { name: 'Cross Cable Tricep Pushdowns',       set_count: 2, rep_range: '12-15',   tempo: '2010', rest_seconds: 60,  notes: null, order_index: 11, superset_group: null },
            { name: 'Decline Bench Dumbbell Skullcrusher',set_count: 2, rep_range: '10-12',   tempo: '3010', rest_seconds: 60,  notes: null, order_index: 12, superset_group: null },
          ],
        },
        {
          day_label: 'Day 2 — Posterior',
          session_type: 'strength',
          exercises: [
            { name: 'Kettlebell Windmill',         set_count: 2, rep_range: '5/side', tempo: '3010', rest_seconds: 10,  notes: 'CNS activation giant set', order_index: 0, superset_group: 'W1' },
            { name: 'Cossack Squat',               set_count: 2, rep_range: '8/side', tempo: '2010', rest_seconds: 10,  notes: 'CNS giant set', order_index: 1, superset_group: 'W2' },
            { name: 'Toes To Bar',                 set_count: 2, rep_range: '8-10',   tempo: '2010', rest_seconds: 10,  notes: 'CNS giant set', order_index: 2, superset_group: 'W3' },
            { name: 'Downdog Toe Tap',             set_count: 2, rep_range: '10/side',tempo: '2010', rest_seconds: 90,  notes: 'CNS giant set finisher', order_index: 3, superset_group: 'W4' },
            { name: 'Romanian Deadlift',           set_count: 3, rep_range: '5-6',    tempo: '3010', rest_seconds: 180, notes: 'Heavy load; keep tension on hamstrings throughout', order_index: 4, superset_group: null },
            { name: 'Lat Pulldown',                set_count: 3, rep_range: '6-8',    tempo: '3010', rest_seconds: 120, notes: null, order_index: 5, superset_group: null },
            { name: 'Barbell Hip Thrust',          set_count: 3, rep_range: '8-10',   tempo: '2010', rest_seconds: 90,  notes: 'Drive through heels; full hip extension', order_index: 6, superset_group: null },
            { name: '45° Back Extension',          set_count: 3, rep_range: '10-12',  tempo: '3010', rest_seconds: 75,  notes: null, order_index: 7, superset_group: null },
            { name: 'Rear Delt Machine Fly',       set_count: 3, rep_range: '12-15',  tempo: '2010', rest_seconds: 60,  notes: null, order_index: 8, superset_group: null },
            { name: 'Incline Bench Bicep Curl',    set_count: 3, rep_range: '10-12',  tempo: '3010', rest_seconds: 60,  notes: 'Full stretch at bottom', order_index: 9, superset_group: null },
            { name: 'Incline Garhammer Raise',     set_count: 2, rep_range: '10-12',  tempo: '2010', rest_seconds: 60,  notes: null, order_index: 10, superset_group: null },
          ],
        },
        {
          day_label: 'Day 3 — Anterior',
          session_type: 'strength',
          exercises: [
            { name: 'Kettlebell Arm Bar',         set_count: 2, rep_range: '5/side',  tempo: '3010', rest_seconds: 10,  notes: 'CNS activation giant set — shoulder stability', order_index: 0, superset_group: 'W1' },
            { name: 'Hanging Knee Raises',        set_count: 2, rep_range: '10-12',   tempo: '2010', rest_seconds: 10,  notes: 'CNS giant set', order_index: 1, superset_group: 'W2' },
            { name: 'Split Squat (Contralateral Load)', set_count: 2, rep_range: '6/side', tempo: '3010', rest_seconds: 10, notes: 'CNS giant set', order_index: 2, superset_group: 'W3' },
            { name: 'Deficit Push Ups',           set_count: 2, rep_range: '8-10',    tempo: '3010', rest_seconds: 90,  notes: 'CNS giant set finisher — full pec stretch', order_index: 3, superset_group: 'W4' },
            { name: 'Flat Barbell Bench Press',   set_count: 3, rep_range: '3-5',     tempo: '3010', rest_seconds: 180, notes: 'Peaking load — work up to heavy triple', order_index: 4, superset_group: null },
            { name: 'Incline Bench Dumbbell Fly', set_count: 3, rep_range: '10-12',   tempo: '3010', rest_seconds: 75,  notes: null, order_index: 5, superset_group: null },
            { name: 'Deficit Plate Push Ups',     set_count: 3, rep_range: '10-12',   tempo: '3010', rest_seconds: 60,  notes: null, order_index: 6, superset_group: null },
            { name: 'Seated Dumbbell Overhead Press',set_count: 3, rep_range: '8-10', tempo: '3010', rest_seconds: 90,  notes: null, order_index: 7, superset_group: null },
            { name: 'Dumbbell Side Lateral Raises', set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 60,  notes: null, order_index: 8, superset_group: null },
            { name: 'Tricep Dips',                set_count: 2, rep_range: '10-12',   tempo: '2010', rest_seconds: 60,  notes: null, order_index: 9, superset_group: null },
            { name: 'Leg Extensions',             set_count: 2, rep_range: '15-20',   tempo: '2010', rest_seconds: 60,  notes: 'Quad flush', order_index: 10, superset_group: null },
            { name: 'Bulgarian Split Squat',      set_count: 3, rep_range: '8/side',  tempo: '3010', rest_seconds: 90,  notes: null, order_index: 11, superset_group: null },
          ],
        },
        {
          day_label: 'Day 4 — Posterior',
          session_type: 'strength',
          exercises: [
            { name: 'Kettlebell Windmill',         set_count: 2, rep_range: '5/side', tempo: '3010', rest_seconds: 10,  notes: 'CNS activation giant set', order_index: 0, superset_group: 'W1' },
            { name: '45° Side Bend',               set_count: 2, rep_range: '10/side',tempo: '2010', rest_seconds: 10,  notes: 'CNS giant set', order_index: 1, superset_group: 'W2' },
            { name: 'Cable Rope Crunches',         set_count: 2, rep_range: '12-15',  tempo: '2010', rest_seconds: 10,  notes: 'CNS giant set', order_index: 2, superset_group: 'W3' },
            { name: 'Pull Up',                     set_count: 2, rep_range: '5-8',    tempo: '3010', rest_seconds: 90,  notes: 'CNS giant set finisher', order_index: 3, superset_group: 'W4' },
            { name: 'Seated Hamstring Curl',       set_count: 3, rep_range: '8-10',   tempo: '3010', rest_seconds: 90,  notes: null, order_index: 4, superset_group: null },
            { name: 'Dumbbell Walking Lunge',      set_count: 3, rep_range: '10/leg', tempo: '2010', rest_seconds: 90,  notes: null, order_index: 5, superset_group: null },
            { name: 'Chest Supported Machine Row', set_count: 3, rep_range: '8-10',   tempo: '3010', rest_seconds: 90,  notes: 'Horizontal pull — retract scapula', order_index: 6, superset_group: null },
            { name: 'Upper Back Pulldown',         set_count: 2, rep_range: '12-15',  tempo: '2010', rest_seconds: 60,  notes: null, order_index: 7, superset_group: null },
            { name: 'Rear Delt Cable Fly',         set_count: 2, rep_range: '15-20',  tempo: '2010', rest_seconds: 60,  notes: null, order_index: 8, superset_group: null },
            { name: 'Zottman Curls',               set_count: 2, rep_range: '10-12',  tempo: '3010', rest_seconds: 60,  notes: 'Supinate up, pronate down for full arm development', order_index: 9, superset_group: null },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ── Template 18 — 4 Day Hypertrophy ──────────────────────────────────────
  {
    id: '4-day-hypertrophy',
    name: '4 Day Hypertrophy',
    description: 'A 4-session push/pull/shoulders/legs split built around giant sets and supersets for maximum volume. Day 1 focuses on chest, triceps and anterior delts; Day 2 on back and biceps; Day 4 on shoulders and arms with leg finishers; Day 6 on complete lower body development.',
    goal_type: 'lean_gain',
    phase: 'Hypertrophy',
    default_weeks: 8,
    days_per_week: 4,
    difficulty: 'intermediate',
    icon: '💪',
    color: '#7c3aed',
    tags: ['hypertrophy', 'push-pull', 'giant-set', 'superset', '4-day'],
    generateSessions: (weeks) => {
      const sessions = []
      const DAYS = [
        {
          day_label: 'Day 1 — Push / Chest / Triceps',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Elevated Pike Push Up',                    set_count: 4, rep_range: '8-12',  tempo: '3010', rest_seconds: 60,  notes: 'Elevate feet on bench; emphasise overhead pressing pattern', order_index: 0, superset_group: null },
            { name: 'Incline Dumbbell Press',                   set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60,  notes: null, order_index: 1, superset_group: null },
            { name: 'Assisted Dips',                            set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 10,  notes: 'Superset with Decline Dumbbell Fly', order_index: 2, superset_group: 'A1' },
            { name: 'Decline Dumbbell Fly',                     set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 75,  notes: 'Superset with Assisted Dips', order_index: 3, superset_group: 'A2' },
            { name: 'Push Up on Rings with External Rotation',  set_count: 3, rep_range: '8-12',  tempo: '3010', rest_seconds: 75,  notes: 'Rotate rings out at top for RTC activation', order_index: 4, superset_group: null },
            { name: 'Unilateral Lateral Raise Prone on Bench',  set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 10,  notes: 'Giant set — move immediately to B2', order_index: 5, superset_group: 'B1' },
            { name: 'Dumbbell Rear Delt Fly',                   set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 10,  notes: 'Giant set — move immediately to B3', order_index: 6, superset_group: 'B2' },
            { name: '30° Incline Dumbbell Row (pronated grip)', set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 75,  notes: 'Giant set finisher — 75s rest then back to B1', order_index: 7, superset_group: 'B3' },
            { name: 'Double Rope Tricep Press Down',             set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 60,  notes: null, order_index: 8, superset_group: null },
            { name: 'Inclined Bench Reverse Crunches',           set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 60,  notes: 'Core finisher on incline bench', order_index: 9, superset_group: null },
          ],
        },
        {
          day_label: 'Day 2 — Pull / Back / Biceps',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Conventional Deadlifts',              set_count: 3, rep_range: '5-6',   tempo: '3010', rest_seconds: 120, notes: 'Heavy hinge — full reset each rep', order_index: 0, superset_group: null },
            { name: 'T Bar Row',                           set_count: 4, rep_range: '8-10',  tempo: '3010', rest_seconds: 90,  notes: 'Drive elbows back; squeeze at top', order_index: 1, superset_group: null },
            { name: 'Lat Pulldown Mid Grip',               set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Giant set — move immediately to C2', order_index: 2, superset_group: 'C1' },
            { name: 'Cable Upright Row',                   set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 10,  notes: 'Giant set — move immediately to C3', order_index: 3, superset_group: 'C2' },
            { name: 'Standing Straight Arm Pulldown',      set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 75,  notes: 'Giant set finisher — keep arms straight', order_index: 4, superset_group: 'C3' },
            { name: 'Cable Bicep Curl',                    set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 60,  notes: null, order_index: 5, superset_group: null },
            { name: 'Kneeling Dumbbell Zottman Curl',      set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60,  notes: 'Supinate on curl, pronate on descent', order_index: 6, superset_group: null },
          ],
        },
        {
          day_label: 'Day 4 — Shoulders / Arms',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Single-Arm Dumbbell Powell Raise',   set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 60,  notes: 'Shoulder prehab — lateral delt focus', order_index: 0, superset_group: null },
            { name: '1¼ Dumbbell Shoulder Press',         set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 75,  notes: 'Extra ROM quarter rep at bottom', order_index: 1, superset_group: null },
            { name: 'Dumbbell Side Lateral Raise',        set_count: 3, rep_range: '15',    tempo: '2010', rest_seconds: 10,  notes: 'Giant set — move to D2', order_index: 2, superset_group: 'D1' },
            { name: 'Standing Dumbbell Shoulder Press',   set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 10,  notes: 'Giant set — move to D3', order_index: 3, superset_group: 'D2' },
            { name: 'Bicep Curl Supinated Grip (Swiss ball)', set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 10, notes: 'Giant set — move to D4', order_index: 4, superset_group: 'D3' },
            { name: 'Dumbbell Side Lateral Raise (drop)', set_count: 3, rep_range: '15',    tempo: '2010', rest_seconds: 75,  notes: 'Giant set finisher — drop set option', order_index: 5, superset_group: 'D4' },
            { name: 'Cable Upright Row',                  set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 10,  notes: 'Giant set — move to E2', order_index: 6, superset_group: 'E1' },
            { name: 'Standing Double Arm Face Pull',      set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 10,  notes: 'Giant set — move to E3', order_index: 7, superset_group: 'E2' },
            { name: 'Rear Delt & Mid Back Raise',         set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 75,  notes: 'Giant set finisher — W or Y raise pattern', order_index: 8, superset_group: 'E3' },
            { name: 'Machine Leg Press',                  set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 60,  notes: 'High-rep flush — keep tension on quads', order_index: 9, superset_group: null },
            { name: 'Leg Extensions',                     set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 10,  notes: 'Superset with Walking Lunges', order_index: 10, superset_group: 'F1' },
            { name: 'Walking Lunges',                     set_count: 3, rep_range: '12/leg', tempo: '2010', rest_seconds: 75,  notes: 'Superset finisher — controlled stride', order_index: 11, superset_group: 'F2' },
          ],
        },
        {
          day_label: 'Day 6 — Legs',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Snatch Grip Deadlift',   set_count: 3, rep_range: '5-6',   tempo: '3010', rest_seconds: 120, notes: 'Wide grip — hips lower, more thoracic extension', order_index: 0, superset_group: null },
            { name: 'Romanian Deadlift',      set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 90,  notes: 'Hinge dominant — hamstring stretch at bottom', order_index: 1, superset_group: null },
            { name: 'Lying Leg Curl',         set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 75,  notes: 'Full ROM — avoid hip flexion assist', order_index: 2, superset_group: null },
            { name: 'Machine Leg Press',      set_count: 4, rep_range: '10-12', tempo: '2010', rest_seconds: 75,  notes: 'High and wide foot placement for glute emphasis', order_index: 3, superset_group: null },
            { name: 'Pendulum Squat',         set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 75,  notes: 'Upright torso; deep knee flexion', order_index: 4, superset_group: null },
            { name: 'Leg Extensions',         set_count: 1, rep_range: '20-25', tempo: '2010', rest_seconds: 60,  notes: 'Single pump set — quad finisher', order_index: 5, superset_group: null },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ── Template 24 — Advanced Powerbuild - Phase 1 ───────────────────────────
  {
    id: 'advanced-powerbuild-phase1',
    name: 'Advanced Powerbuild — Phase 1',
    description: 'Four-day advanced powerbuild programme built around hinge, bench, squat and upper/arms days. CNS-activating giant-set warmups open each session, followed by heavy compound supersets (deadlifts, squats, bench) paired with core/stability work, then hypertrophy accessory circuits. Merges maximal strength with size in one structured weekly cycle.',
    goal_type: 'lean_gain',
    phase: 'Hypertrophy-Strength',
    default_weeks: 8,
    days_per_week: 4,
    difficulty: 'advanced',
    icon: '⚡',
    color: '#b45309',
    tags: ['powerbuild', 'strength', 'hypertrophy', 'barbell', 'upper-lower', 'superset'],
    generateSessions: (weeks) => {
      const sessions = []
      const DAYS = [
        {
          day_label: 'Day 1 — Hinge Dominant',
          session_type: 'strength',
          exercises: [
            // CNS Giant Set warmup
            { name: 'Single Leg Hamstring Bridge Iso (Foam Roller)', set_count: 1, rep_range: '6-8',   tempo: '0000', rest_seconds: 0,  notes: 'CNS warmup A — activate glutes and hamstrings unilaterally', order_index: 0,  superset_group: 'warmup' },
            { name: 'Copenhagen Plank',                               set_count: 1, rep_range: '30s',   tempo: '0000', rest_seconds: 0,  notes: 'CNS warmup B — adductor and lateral core activation',       order_index: 1,  superset_group: 'warmup' },
            { name: 'Kickstance RDL with Contralateral Load',        set_count: 1, rep_range: '8-10',  tempo: '2010', rest_seconds: 0,  notes: 'CNS warmup C — single-leg hinge pattern primer',            order_index: 2,  superset_group: 'warmup' },
            { name: 'Broad Jumps',                                    set_count: 1, rep_range: '5',     tempo: '1010', rest_seconds: 60, notes: 'CNS warmup D — explosive hip extension to prime CNS',       order_index: 3,  superset_group: 'warmup' },
            // Superset 1
            { name: 'Snatch Grip Deadlift',  set_count: 4, rep_range: '4-6',  tempo: '5021', rest_seconds: 120, notes: '3 working sets + AMRAP final set. Wide grip forces upright torso',      order_index: 4,  superset_group: 'ss1' },
            { name: 'Ab Roll Out',           set_count: 4, rep_range: '6-10', tempo: '0000', rest_seconds: 60,  notes: 'Controlled — no lumbar extension at bottom',                           order_index: 5,  superset_group: 'ss1' },
            // Superset 2
            { name: 'Trap Bar Deadlift',     set_count: 4, rep_range: '8-10', tempo: '5020', rest_seconds: 90,  notes: 'Slow eccentric — feel hamstrings load through entire range',            order_index: 6,  superset_group: 'ss2' },
            { name: 'Copenhagen Plank',      set_count: 4, rep_range: '40s',  tempo: '0000', rest_seconds: 0,   notes: 'Paired with deadlift — lateral hip stability between sets',             order_index: 7,  superset_group: 'ss2' },
            // Superset 3
            { name: 'Barbell Hip Thrusts',   set_count: 4, rep_range: '8-12', tempo: '3012', rest_seconds: 90,  notes: 'Failure on sets 1–3; back-off set x12. Full lockout at top',           order_index: 8,  superset_group: 'ss3' },
            { name: 'Hanging Knee Raise',    set_count: 4, rep_range: '6-10', tempo: '3010', rest_seconds: 60,  notes: 'Controlled — avoid swinging. Tuck hips at top',                        order_index: 9,  superset_group: 'ss3' },
            // Finisher
            { name: 'Front Foot Elevated Split Squat', set_count: 3, rep_range: '6-8', tempo: '3010', rest_seconds: 90, notes: 'Elevation increases glute stretch — keep torso upright', order_index: 10, superset_group: null },
          ],
        },
        {
          day_label: 'Day 2 — Bench Dominant',
          session_type: 'hypertrophy',
          exercises: [
            // CNS Giant Set warmup
            { name: 'Childs Pose',          set_count: 1, rep_range: '6-8',   tempo: '0000', rest_seconds: 0,  notes: 'CNS warmup A — thoracic extension and lat stretch',            order_index: 0,  superset_group: 'warmup' },
            { name: 'Kettlebell Arm Bar',   set_count: 1, rep_range: '6',     tempo: '0000', rest_seconds: 0,  notes: 'CNS warmup B — rotator cuff and shoulder stability',            order_index: 1,  superset_group: 'warmup' },
            { name: 'Hanging Knee Raise',   set_count: 1, rep_range: '15-20', tempo: '3010', rest_seconds: 0,  notes: 'CNS warmup C — anti-extension core activation',                order_index: 2,  superset_group: 'warmup' },
            { name: 'Ab Rollout',           set_count: 1, rep_range: '15-20', tempo: '3010', rest_seconds: 0,  notes: 'CNS warmup D — full-body core tension under load',             order_index: 3,  superset_group: 'warmup' },
            { name: 'Deficit Push Ups',     set_count: 1, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: 'CNS warmup E — pec stretch + shoulder patterning into bench',  order_index: 4,  superset_group: 'warmup' },
            // Superset 1
            { name: 'Close Grip Bench Press',  set_count: 4, rep_range: '4-6',   tempo: '3110', rest_seconds: 60,  notes: 'Tricep-biased bench — elbows track slightly narrow',            order_index: 5,  superset_group: 'ss1' },
            { name: 'Standing Pallof Press',   set_count: 4, rep_range: '6-8',   tempo: '1101', rest_seconds: 90,  notes: 'Anti-rotation core work between pressing sets',                order_index: 6,  superset_group: 'ss1' },
            // Superset 2
            { name: 'Low Incline Dumbbell Press',        set_count: 4, rep_range: '6-8',   tempo: '3100', rest_seconds: 0,   notes: '15–30° incline — upper pec and anterior delt emphasis',        order_index: 7,  superset_group: 'ss2' },
            { name: 'Machine Row Upper Back',            set_count: 4, rep_range: '8-10',  tempo: '3011', rest_seconds: 90,  notes: 'Paired pull to balance shoulder health mid-session',           order_index: 8,  superset_group: 'ss2' },
            // Superset 3
            { name: 'Single Arm Half Kneeling Lat Pulldown', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 0,  notes: 'Unilateral — focus on scapular depression and retraction',  order_index: 9,  superset_group: 'ss3' },
            { name: 'Fitball Plank',                         set_count: 3, rep_range: '40s',   tempo: '0000', rest_seconds: 60, notes: 'Elbows on ball — RKC bracing technique',                   order_index: 10, superset_group: 'ss3' },
            // Solo + Superset finishers
            { name: 'Rear Delt Row',                            set_count: 2, rep_range: '12-15', tempo: '3021', rest_seconds: 90, notes: 'Prone or cable — elbows flare wide, pinch at top', order_index: 11, superset_group: null },
            { name: 'Single Arm Incline Bench Dumbbell Preacher Curl', set_count: 3, rep_range: '6-8', tempo: '1230', rest_seconds: 0,  notes: 'Incline preacher — peak bicep stretch at bottom', order_index: 12, superset_group: 'ss4' },
            { name: 'Standing Single Arm Cable Bicep Curl',             set_count: 3, rep_range: '6-8', tempo: '1130', rest_seconds: 90, notes: 'High cable — constant tension through full ROM',   order_index: 13, superset_group: 'ss4' },
          ],
        },
        {
          day_label: 'Day 3 — Squat Dominant',
          session_type: 'strength',
          exercises: [
            // CNS Giant Set warmup
            { name: 'Single Leg Hamstring Bridge Iso (Foam Roller)',         set_count: 1, rep_range: '6-8',  tempo: '0000', rest_seconds: 0,  notes: 'CNS warmup A — glute and hamstring activation',              order_index: 0,  superset_group: 'warmup' },
            { name: 'Copenhagen Plank',                                       set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 0,  notes: 'CNS warmup B — lateral hip stability',                       order_index: 1,  superset_group: 'warmup' },
            { name: 'Front Foot Elevated Split Squat Contralaterally Loaded', set_count: 1, rep_range: '8-10', tempo: '3110', rest_seconds: 0,  notes: 'CNS warmup C — unilateral squat pattern primer',             order_index: 2,  superset_group: 'warmup' },
            { name: 'Pogo Hops',                                              set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 0,  notes: 'CNS warmup D — reactive ankle stiffness and CNS activation', order_index: 3,  superset_group: 'warmup' },
            // Superset 1 — Main Squat
            { name: 'Heel Elevated Safety Bar Squat / Front Squat', set_count: 5, rep_range: '4-6',   tempo: '5421', rest_seconds: 120, notes: 'Deep knee flexion; heel elevation improves ankle mobility and quad depth', order_index: 4,  superset_group: 'ss1' },
            { name: 'Fitball Plank',                                 set_count: 5, rep_range: '45s',   tempo: '0000', rest_seconds: 60,  notes: 'Anterior core bracing between squat sets',                                  order_index: 5,  superset_group: 'ss1' },
            // Accessories
            { name: 'Hack Squat / Pendulum Squat', set_count: 3, rep_range: '8-10',  tempo: '3120', rest_seconds: 90,  notes: 'Machine squat — high quad emphasis, full depth',          order_index: 6,  superset_group: null },
            { name: 'Lying Leg Curl',               set_count: 2, rep_range: '8-10',  tempo: '3011', rest_seconds: 90,  notes: 'Prone — point toes slightly inward for bicep femoris bias', order_index: 7,  superset_group: null },
            { name: 'Leg Extensions',               set_count: 2, rep_range: '12-15', tempo: '3020', rest_seconds: 0,   notes: 'Terminal extension — squeeze quad at top',                  order_index: 8,  superset_group: null },
            { name: 'Bulgarian Split Squat',        set_count: 2, rep_range: '6-8',   tempo: '3210', rest_seconds: 120, notes: 'Rear foot elevated — controlled descent, explosive drive',  order_index: 9,  superset_group: null },
            // Calf Superset
            { name: 'Standing Calf Raise', set_count: 3, rep_range: '15-20', tempo: '3210', rest_seconds: 0,  notes: 'Full ROM — pause at stretch; explosive concentric', order_index: 10, superset_group: 'ss2' },
            { name: 'Tibialis Raise',      set_count: 3, rep_range: '20-25', tempo: '2010', rest_seconds: 90, notes: 'Tib bar or toe raise — balance calf development',   order_index: 11, superset_group: 'ss2' },
          ],
        },
        {
          day_label: 'Day 4 — Upper / Shoulders & Arms',
          session_type: 'hypertrophy',
          exercises: [
            // CNS Giant Set warmup
            { name: 'Kettlebell Arm Bar',        set_count: 1, rep_range: '5',     tempo: '1010', rest_seconds: 0,  notes: 'CNS warmup A — rotator cuff activation and thoracic rotation',  order_index: 0,  superset_group: 'warmup' },
            { name: 'Hanging Knee Raise',        set_count: 1, rep_range: '15-20', tempo: '2010', rest_seconds: 0,  notes: 'CNS warmup B — core activation before pressing',                order_index: 1,  superset_group: 'warmup' },
            { name: 'Half Kneeling Landmine Press', set_count: 1, rep_range: '6-8', tempo: '2010', rest_seconds: 0, notes: 'CNS warmup C — overhead pattern with core stability',           order_index: 2,  superset_group: 'warmup' },
            { name: 'Ab Rollout',                set_count: 1, rep_range: '15-20', tempo: '2010', rest_seconds: 0,  notes: 'CNS warmup D — anti-extension core primer',                     order_index: 3,  superset_group: 'warmup' },
            { name: 'Deficit Push Ups',          set_count: 1, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: 'CNS warmup E — shoulder patterning warmup',                     order_index: 4,  superset_group: 'warmup' },
            // Opener
            { name: 'Single Arm High Cable Bicep Curl', set_count: 1, rep_range: '10-15', tempo: '3011', rest_seconds: 60, notes: 'High cable — elbow behind torso for long-head stretch', order_index: 5,  superset_group: null },
            // Superset 1 — Main Press
            { name: 'High Incline Dumbbell Press', set_count: 5, rep_range: '6-8',   tempo: '3110', rest_seconds: 120, notes: '70–80° incline — anterior delt and upper pec; elbows slightly in', order_index: 6,  superset_group: 'ss1' },
            { name: 'Incline Garhammer Raise',     set_count: 5, rep_range: '6-10',  tempo: '3011', rest_seconds: 90,  notes: 'Hips start below bench — explosive hip flexion, controlled descent',  order_index: 7,  superset_group: 'ss1' },
            // Superset 2
            { name: 'Cable Crucifix Raise',  set_count: 4, rep_range: '8-12', tempo: '3010', rest_seconds: 60,  notes: 'Bilateral cable lateral raise — constant tension through full arc', order_index: 8,  superset_group: 'ss2' },
            { name: 'Rhomboid Pulldown',     set_count: 4, rep_range: '8-12', tempo: '3010', rest_seconds: 90,  notes: 'Overhand cable — elbows wide, scapular retraction focus',           order_index: 9,  superset_group: 'ss2' },
            // Arms Giant Set
            { name: 'Kneeling Dumbbell Zottman Curl', set_count: 3, rep_range: '8-10',  tempo: '3010', rest_seconds: 45, notes: 'Supinate up, pronate down — trains both heads of bicep and brachioradialis', order_index: 10, superset_group: 'ss3' },
            { name: 'Cross Body Tricep Extension',    set_count: 3, rep_range: '8-10',  tempo: '3010', rest_seconds: 90, notes: 'Dumbbell or cable — cross body arc keeps long head under tension',           order_index: 11, superset_group: 'ss3' },
            { name: 'Close Grip Push Ups',            set_count: 3, rep_range: 'AMRAP', tempo: '0000', rest_seconds: 90, notes: 'To technical failure — tricep burnout finisher',                             order_index: 12, superset_group: 'ss3' },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(dayDef => {
          sessions.push({
            day_label: dayDef.day_label,
            week_number: week,
            session_type: dayDef.session_type,
            exercises: dayDef.exercises.map(ex => ({ ...ex })),
          })
        })
      }
      return sessions
    },
  },

  // ── Template 25 — Advanced Powerbuild Phase 2 ────────────────────────────
  {
    id: 'advanced-powerbuild-phase2',
    name: 'Advanced Powerbuild — Phase 2',
    description: 'Phase 2 intensification: Barbell Deadlift anchors the hinge day; Heel Elevated High Bar Back Squat and Standing Barbell Press drive squat and upper days. Rest-pause, dropsets and back-off sets layer hypertrophy stimulus over strength work.',
    goal_type: 'strength',
    phase: 'intensification',
    default_weeks: 4,
    days_per_week: 4,
    difficulty: 'advanced',
    icon: '🏋️',
    color: 'from-rose-700 to-orange-500',
    tags: ['powerbuild', 'hinge', 'squat', 'press', 'arms', '4-day', 'advanced'],
    generateSessions(weeks = this.default_weeks) {
      const sessions = []

      const warmup_gs_hinge = [
        { name: 'Single Leg Hamstring Bridge Iso (Foam Roller)', set_count: 1, rep_range: '6-8', tempo: '0000', rest_seconds: 0, notes: 'Warmup', order_index: 0, superset_group: 'gs_hinge_wu' },
        { name: 'Copenhagen Plank', set_count: 1, rep_range: '30s', tempo: '', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'gs_hinge_wu' },
        { name: 'Kickstance RDL with Contralteral Load', set_count: 1, rep_range: '8-10', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 2, superset_group: 'gs_hinge_wu' },
        { name: 'Broad Jumps', set_count: 1, rep_range: '5', tempo: '1010', rest_seconds: 60, notes: 'Warmup', order_index: 3, superset_group: 'gs_hinge_wu' },
      ]

      const warmup_gs_bench = [
        { name: 'Childs Pose', set_count: 1, rep_range: '6-8', tempo: '0000', rest_seconds: 0, notes: 'Warmup', order_index: 0, superset_group: 'gs_bench_wu' },
        { name: 'Kettlebell Arm Bar', set_count: 1, rep_range: '6', tempo: '0000', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'gs_bench_wu' },
        { name: 'Hanging Knee Raise', set_count: 1, rep_range: '15-20', tempo: '3010', rest_seconds: 0, notes: 'Warmup', order_index: 2, superset_group: 'gs_bench_wu' },
        { name: 'Ab Rollout', set_count: 1, rep_range: '15-20', tempo: '3010', rest_seconds: 0, notes: 'Warmup', order_index: 3, superset_group: 'gs_bench_wu' },
        { name: 'Deficit Push Ups', set_count: 1, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: 'Warmup', order_index: 4, superset_group: 'gs_bench_wu' },
      ]

      const warmup_gs_squat = [
        { name: 'Single Leg Hamstring Bridge Iso (Foam Roller)', set_count: 1, rep_range: '6-8', tempo: '0000', rest_seconds: 0, notes: 'Warmup', order_index: 0, superset_group: 'gs_squat_wu' },
        { name: 'Copenhagen Plank', set_count: 1, rep_range: '30s', tempo: '', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'gs_squat_wu' },
        { name: 'Front Foot Elevated Split Squat Contralaterally Loaded', set_count: 1, rep_range: '8-10', tempo: '3110', rest_seconds: 0, notes: 'Warmup', order_index: 2, superset_group: 'gs_squat_wu' },
        { name: 'Pogo Hops', set_count: 1, rep_range: '30s', tempo: '', rest_seconds: 60, notes: 'Warmup', order_index: 3, superset_group: 'gs_squat_wu' },
      ]

      const warmup_gs_upper = [
        { name: 'Kettlebell Arm Bar', set_count: 1, rep_range: '5', tempo: '1010', rest_seconds: 0, notes: 'Warmup', order_index: 0, superset_group: 'gs_upper_wu' },
        { name: 'Hanging Knee Raise', set_count: 1, rep_range: '15-20', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 1, superset_group: 'gs_upper_wu' },
        { name: 'Half Kneeling Landmine Press', set_count: 1, rep_range: '6-8', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 2, superset_group: 'gs_upper_wu' },
        { name: 'Deficit Push Ups', set_count: 1, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: 'Warmup', order_index: 3, superset_group: 'gs_upper_wu' },
        { name: 'Ab Rollout', set_count: 1, rep_range: '15-20', tempo: '2010', rest_seconds: 0, notes: 'Warmup', order_index: 4, superset_group: 'gs_upper_wu' },
      ]

      for (let week = 1; week <= weeks; week++) {
        // Day 1 — Hinge Dominant
        sessions.push({
          day_label: 'Day 1 — Hinge Dominant',
          week_number: week,
          session_type: 'strength',
          exercises: [
            ...warmup_gs_hinge,
            { name: 'Lying Hamstring Curl', set_count: 1, rep_range: '10-15', tempo: '3010', rest_seconds: 90, notes: 'Activation primer', order_index: 5 },
            { name: 'Barbell Deadlifts', set_count: 3, rep_range: '5', tempo: '3010', rest_seconds: 120, notes: 'Work to technical failure each set', order_index: 6, superset_group: 'ss1_d1' },
            { name: 'Ab Roll Out', set_count: 4, rep_range: '6-10', tempo: '0000', rest_seconds: 60, notes: '', order_index: 7, superset_group: 'ss1_d1' },
            { name: '45 Degree Leg Press (Hip Dominant)', set_count: 3, rep_range: '10-12', tempo: '3210', rest_seconds: 90, notes: 'Take to failure', order_index: 8 },
            { name: '45 Degree Hip Extension', set_count: 3, rep_range: '12-15', tempo: '3012', rest_seconds: 90, notes: '', order_index: 9, superset_group: 'ss2_d1' },
            { name: 'Side Plank Hip Lifts', set_count: 3, rep_range: '6-10', tempo: '3010', rest_seconds: 60, notes: '', order_index: 10, superset_group: 'ss2_d1' },
            { name: 'Walking Lunges', set_count: 2, rep_range: '10-12', tempo: '3010', rest_seconds: 90, notes: '', order_index: 11 },
            { name: 'Standing Calf Raise', set_count: 2, rep_range: '10-15', tempo: '3010', rest_seconds: 0, notes: '', order_index: 12, superset_group: 'ss3_d1' },
            { name: 'Incline Garhammer Raise', set_count: 2, rep_range: '15-20', tempo: '3010', rest_seconds: 90, notes: 'Failure', order_index: 13, superset_group: 'ss3_d1' },
          ],
        })

        // Day 2 — Bench Dominant
        sessions.push({
          day_label: 'Day 2 — Bench Dominant',
          week_number: week,
          session_type: 'strength',
          exercises: [
            ...warmup_gs_bench,
            { name: 'Flat Barbell Bench Press', set_count: 4, rep_range: '5', tempo: '3110', rest_seconds: 60, notes: 'Strength focus — add load when all 4×5 clean', order_index: 5 },
            { name: 'Low Incline Dumbbell Press', set_count: 4, rep_range: '6-8', tempo: '3100', rest_seconds: 0, notes: '', order_index: 6, superset_group: 'ss1_d2' },
            { name: 'Machine Row Upper Back', set_count: 4, rep_range: '8-10', tempo: '3011', rest_seconds: 90, notes: '', order_index: 7, superset_group: 'ss1_d2' },
            { name: 'Prone Lat Pulldown', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 90, notes: '', order_index: 8, superset_group: 'ss2_d2' },
            { name: 'Fitball Plank', set_count: 3, rep_range: '40s', tempo: '', rest_seconds: 60, notes: '', order_index: 9, superset_group: 'ss2_d2' },
            { name: 'Rear Delt Machine', set_count: 1, rep_range: '12-15', tempo: '3121', rest_seconds: 90, notes: 'Rest-pause set', order_index: 10 },
            { name: 'Preacher Curl Machine', set_count: 1, rep_range: '6-10', tempo: '3010', rest_seconds: 90, notes: '', order_index: 11 },
            { name: 'Behind-The-Back Dual Cable D-Handle Curls', set_count: 2, rep_range: '10-15', tempo: '3010', rest_seconds: 90, notes: 'Failure each set', order_index: 12 },
          ],
        })

        // Day 3 — Squat Dominant
        sessions.push({
          day_label: 'Day 3 — Squat Dominant',
          week_number: week,
          session_type: 'strength',
          exercises: [
            ...warmup_gs_squat,
            { name: 'Lying Leg Curl', set_count: 2, rep_range: '10-15', tempo: '3011', rest_seconds: 90, notes: '', order_index: 4, superset_group: 'ss1_d3' },
            { name: 'Hip Adductor', set_count: 2, rep_range: '10-15', tempo: '3010', rest_seconds: 0, notes: '', order_index: 5, superset_group: 'ss1_d3' },
            { name: 'Heel Elevated High Bar Back Squat', set_count: 4, rep_range: '5', tempo: '3110', rest_seconds: 120, notes: 'Primary strength lift', order_index: 6, superset_group: 'ss2_d3' },
            { name: 'Stir The Pot', set_count: 4, rep_range: '10-12', tempo: '2010', rest_seconds: 120, notes: '', order_index: 7, superset_group: 'ss2_d3' },
            { name: 'Leg Extensions', set_count: 1, rep_range: '10-15', tempo: '3020', rest_seconds: 0, notes: 'Dropset', order_index: 8 },
            { name: 'Hack Squat / Pendulum Squat', set_count: 1, rep_range: '10-15', tempo: '3120', rest_seconds: 90, notes: 'Back-off set from main squat', order_index: 9 },
            { name: 'Bulgarian Split Squat', set_count: 2, rep_range: '6-8', tempo: '3210', rest_seconds: 120, notes: 'Set 2 as dropset', order_index: 10 },
            { name: 'Standing Calf Raise', set_count: 3, rep_range: '15-20', tempo: '3210', rest_seconds: 0, notes: '', order_index: 11, superset_group: 'ss3_d3' },
            { name: 'Tibialis Raise', set_count: 3, rep_range: '20-25', tempo: '2010', rest_seconds: 90, notes: '', order_index: 12, superset_group: 'ss3_d3' },
          ],
        })

        // Day 4 — Upper / Sharms
        sessions.push({
          day_label: 'Day 4 — Upper / Sharms',
          week_number: week,
          session_type: 'strength',
          exercises: [
            ...warmup_gs_upper,
            { name: 'Seated Cable Y Raise', set_count: 1, rep_range: '10-15', tempo: '3011', rest_seconds: 60, notes: 'Rear delt activation', order_index: 5 },
            { name: 'Standing Barbell Shoulder Press', set_count: 4, rep_range: '5', tempo: '3110', rest_seconds: 120, notes: 'Strength focus', order_index: 6, superset_group: 'ss1_d4' },
            { name: 'Pull Ups', set_count: 4, rep_range: '5', tempo: '3011', rest_seconds: 90, notes: 'Add weight if 5 reps feels easy', order_index: 7, superset_group: 'ss1_d4' },
            { name: 'Prone Row With Thoracic Extension', set_count: 3, rep_range: '6-12', tempo: '3010', rest_seconds: 60, notes: 'Increase reps each set', order_index: 8, superset_group: 'ss2_d4' },
            { name: 'Tricep Dips', set_count: 3, rep_range: '4-12', tempo: '3010', rest_seconds: 90, notes: 'Increase reps each set', order_index: 9, superset_group: 'ss2_d4' },
            { name: 'Dumbbell Spider Curl', set_count: 3, rep_range: '8-10', tempo: '3010', rest_seconds: 45, notes: '', order_index: 10, superset_group: 'ss3_d4' },
            { name: 'Straight Arm Pushdowns', set_count: 3, rep_range: '8-10', tempo: '3010', rest_seconds: 90, notes: '', order_index: 11, superset_group: 'ss3_d4' },
            { name: 'Incline Dumbbell Curls', set_count: 3, rep_range: '15-20', tempo: '0000', rest_seconds: 90, notes: 'AMRAP each set — full stretch at bottom', order_index: 12 },
          ],
        })
      }

      return sessions
    },
  },

  // ── Template 26 — Anterior / Posterior / HICT ────────────────────────────
  {
    id: 'anterior-posterior-hict',
    name: 'Anterior / Posterior / HICT',
    description: 'Six-day hybrid: alternating anterior-chain (quad / chest / tricep) and posterior-chain (hip hinge / back / bicep) sessions bookended by HICT conditioning slots. Giant-set activation sequences precede every lifting day; paired compounds build strength; back-off sets, rest-pause and dropsets drive hypertrophy.',
    goal_type: 'hypertrophy',
    phase: 'accumulation',
    default_weeks: 4,
    days_per_week: 6,
    difficulty: 'intermediate',
    icon: '⚡',
    color: 'from-violet-700 to-cyan-500',
    tags: ['anterior', 'posterior', 'HICT', 'conditioning', '6-day', 'hybrid', 'superset'],
    generateSessions(weeks = this.default_weeks) {
      const sessions = []

      for (let week = 1; week <= weeks; week++) {
        // ── Day 1 — Anterior ────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 1 — Anterior',
          week_number: week,
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Couch Stretch (Time)',                  set_count: 1, rep_range: '60s',   tempo: '0000', rest_seconds: 0,  notes: 'Warmup',                              order_index: 0,  superset_group: 'gs_ant1_wu' },
            { name: 'Kettlebell Arm Bar',                    set_count: 1, rep_range: '5-6',   tempo: '2000', rest_seconds: 0,  notes: 'Warmup',                              order_index: 1,  superset_group: 'gs_ant1_wu' },
            { name: 'Hanging Leg/Knee Raises',               set_count: 1, rep_range: '15-20', tempo: '3010', rest_seconds: 0,  notes: 'Warmup',                              order_index: 2,  superset_group: 'gs_ant1_wu' },
            { name: 'Deficit Plate Push Ups',                set_count: 1, rep_range: '10-12', tempo: '3210', rest_seconds: 60, notes: 'Warmup',                              order_index: 3,  superset_group: 'gs_ant1_wu' },
            { name: 'Smith Machine Bulgarian Split Squats',  set_count: 3, rep_range: '4-6',   tempo: '3210', rest_seconds: 90, notes: null,                                  order_index: 4,  superset_group: 'ss1_ant1' },
            { name: 'Cuffed Cable Chest Press',              set_count: 3, rep_range: '10-15', tempo: '3110', rest_seconds: 90, notes: null,                                  order_index: 5,  superset_group: 'ss1_ant1' },
            { name: '45 Degree Dumbbell Press',              set_count: 2, rep_range: '5-7',   tempo: '3110', rest_seconds: 45, notes: null,                                  order_index: 6,  superset_group: 'ss2_ant1' },
            { name: 'Leg Extensions',                        set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 90, notes: null,                                  order_index: 7,  superset_group: 'ss2_ant1' },
            { name: 'Bulgarian Split Squat',                 set_count: 2, rep_range: '10-12', tempo: '3210', rest_seconds: 90, notes: null,                                  order_index: 8,  superset_group: 'ss3_ant1' },
            { name: 'Pec Deck Machine',                      set_count: 2, rep_range: '12-15', tempo: '2220', rest_seconds: 90, notes: 'Final set Rest Pause',                order_index: 9,  superset_group: 'ss3_ant1' },
            { name: 'Dumbbell Side Lateral Raises',          set_count: 2, rep_range: '10-15', tempo: '3010', rest_seconds: 90, notes: 'Set 1 to Failure; Set 2 Dropset',     order_index: 10, superset_group: null },
            { name: 'Cross Body Tricep Extension',           set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 45, notes: null,                                  order_index: 11, superset_group: 'ss4_ant1' },
            { name: 'Dumbbell Skullcrushers',                set_count: 3, rep_range: '10-12', tempo: '3100', rest_seconds: 90, notes: null,                                  order_index: 12, superset_group: 'ss4_ant1' },
          ],
        })

        // ── Day 2 — Posterior ───────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 2 — Posterior',
          week_number: week,
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Childs Pose',                           set_count: 1, rep_range: '6-8',   tempo: '0000', rest_seconds: 0,  notes: 'Warmup',                              order_index: 0,  superset_group: 'gs_post1_wu' },
            { name: 'Kettlebell Arm Bar',                    set_count: 1, rep_range: '60s',   tempo: null,   rest_seconds: 0,  notes: 'Warmup — hold each side',             order_index: 1,  superset_group: 'gs_post1_wu' },
            { name: 'Hanging Knee Raises',                   set_count: 1, rep_range: '15-20', tempo: '3010', rest_seconds: 0,  notes: 'Warmup',                              order_index: 2,  superset_group: 'gs_post1_wu' },
            { name: 'Ab Wheel',                              set_count: 1, rep_range: '15-20', tempo: '3010', rest_seconds: 60, notes: 'Warmup',                              order_index: 3,  superset_group: 'gs_post1_wu' },
            { name: 'Trap Bar Deadlift',                     set_count: 3, rep_range: '4-6',   tempo: '3010', rest_seconds: 60, notes: null,                                  order_index: 4,  superset_group: 'ss1_post1' },
            { name: 'Kneeling Unilateral Lat Pulldown',      set_count: 3, rep_range: '8-10',  tempo: '3010', rest_seconds: 90, notes: null,                                  order_index: 5,  superset_group: 'ss1_post1' },
            { name: 'Wide Grip Machine Row',                 set_count: 3, rep_range: '5-15',  tempo: '5220', rest_seconds: 45, notes: 'Sets 1–2: 5-7 reps heavy; Set 3: 10-15 back-off', order_index: 6, superset_group: 'ss2_post1' },
            { name: 'Lying Leg Curl',                        set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 90, notes: null,                                  order_index: 7,  superset_group: 'ss2_post1' },
            { name: 'Dumbbell Row',                          set_count: 2, rep_range: '5-7',   tempo: '3010', rest_seconds: 45, notes: null,                                  order_index: 8,  superset_group: 'ss3_post1' },
            { name: '45 Degree Hip Extension',               set_count: 2, rep_range: '12-15', tempo: '3011', rest_seconds: 90, notes: 'Final set Dropset',                   order_index: 9,  superset_group: 'ss3_post1' },
            { name: 'Preacher Curl Machine',                 set_count: 2, rep_range: '5-7',   tempo: '3010', rest_seconds: 90, notes: null,                                  order_index: 10, superset_group: null },
            { name: 'Behind-The-Back Dual Cable D-Handle Curls', set_count: 2, rep_range: '8-12', tempo: '3110', rest_seconds: 90, notes: null,                              order_index: 11, superset_group: null },
          ],
        })

        // ── Conditioning ────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Conditioning',
          week_number: week,
          session_type: 'conditioning',
          exercises: [],
        })

        // ── Day 3 — Anterior ────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 3 — Anterior',
          week_number: week,
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Kettlebell Arm Bar',                    set_count: 1, rep_range: '4-6',   tempo: '2010', rest_seconds: 0,  notes: 'Warmup',                              order_index: 0,  superset_group: 'gs_ant2_wu' },
            { name: 'Deadhang Max Effort Hold',              set_count: 1, rep_range: 'max',   tempo: '0000', rest_seconds: 0,  notes: 'Warmup — hold to near failure',       order_index: 1,  superset_group: 'gs_ant2_wu' },
            { name: 'Kneeling Cable Crunches',               set_count: 2, rep_range: '10-15', tempo: '3010', rest_seconds: 0,  notes: 'Warmup',                              order_index: 2,  superset_group: 'gs_ant2_wu' },
            { name: '45 Degree Back Extension Side Bends',   set_count: 2, rep_range: '10-12', tempo: '2010', rest_seconds: 60, notes: 'Warmup',                              order_index: 3,  superset_group: 'gs_ant2_wu' },
            { name: 'Incline Smith Press',                   set_count: 3, rep_range: '5-7',   tempo: '3110', rest_seconds: 90, notes: null,                                  order_index: 4,  superset_group: 'ss1_ant2' },
            { name: 'Goblet Squat',                          set_count: 3, rep_range: '6-10',  tempo: '3111', rest_seconds: 90, notes: null,                                  order_index: 5,  superset_group: 'ss1_ant2' },
            { name: 'Machine Leg Press',                     set_count: 2, rep_range: '5-7',   tempo: '3110', rest_seconds: 90, notes: 'Final set Rest Pause',                order_index: 6,  superset_group: 'ss2_ant2' },
            { name: 'Pec Deck Machine',                      set_count: 2, rep_range: '6-10',  tempo: '3110', rest_seconds: 90, notes: 'Final set Dropset',                   order_index: 7,  superset_group: 'ss2_ant2' },
            { name: 'Cuffed Cable Chest Press',              set_count: 2, rep_range: '10-15', tempo: '3010', rest_seconds: 30, notes: null,                                  order_index: 8,  superset_group: 'ss3_ant2' },
            { name: 'Walking Lunges',                        set_count: 2, rep_range: '12',    tempo: '2110', rest_seconds: 90, notes: null,                                  order_index: 9,  superset_group: 'ss3_ant2' },
            { name: 'Tricep Dips',                           set_count: 3, rep_range: '4-6',   tempo: '3110', rest_seconds: 45, notes: null,                                  order_index: 10, superset_group: 'ss4_ant2' },
            { name: 'Dumbbell Side Lateral Raises',          set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 90, notes: null,                                  order_index: 11, superset_group: 'ss4_ant2' },
          ],
        })

        // ── Day 4 — Posterior ───────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 4 — Posterior',
          week_number: week,
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Kettlebell Arm Bar',                    set_count: 1, rep_range: '30s',   tempo: null,   rest_seconds: 0,  notes: 'Warmup — hold each side',             order_index: 0,  superset_group: 'gs_post2_wu' },
            { name: '45 Degree Side Bends',                  set_count: 1, rep_range: '10-12', tempo: '2010', rest_seconds: 0,  notes: 'Warmup',                              order_index: 1,  superset_group: 'gs_post2_wu' },
            { name: 'Kneeling Cable Crunches',               set_count: 1, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: 'Warmup',                              order_index: 2,  superset_group: 'gs_post2_wu' },
            { name: 'Barbell Hip Thrusts',                   set_count: 2, rep_range: '10-15', tempo: '3010', rest_seconds: 90, notes: 'Final set Rest Pause',                order_index: 3,  superset_group: 'ss1_post2' },
            { name: 'Pull Ups',                              set_count: 2, rep_range: '6+',    tempo: '3010', rest_seconds: 90, notes: 'AMRAP from 6 — add weight if easy',   order_index: 4,  superset_group: 'ss1_post2' },
            { name: 'Romanian Deadlift',                     set_count: 3, rep_range: '5-6',   tempo: '3110', rest_seconds: 45, notes: null,                                  order_index: 5,  superset_group: 'ss2_post2' },
            { name: 'Cable Single Arm High to Low Row',      set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 90, notes: null,                                  order_index: 6,  superset_group: 'ss2_post2' },
            { name: 'Wide Grip Machine Row',                 set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 90, notes: null,                                  order_index: 7,  superset_group: 'ss3_post2' },
            { name: '45 Degree Hip Extension',               set_count: 2, rep_range: '12-15', tempo: '3011', rest_seconds: 90, notes: null,                                  order_index: 8,  superset_group: 'ss3_post2' },
            { name: 'Single Arm Rear Delt Cable Fly',        set_count: 2, rep_range: '10-15', tempo: '3010', rest_seconds: 60, notes: 'Final set Rest Pause',                order_index: 9,  superset_group: null },
            { name: 'Preacher Curl Machine',                 set_count: 2, rep_range: '5-7',   tempo: '3010', rest_seconds: 45, notes: null,                                  order_index: 10, superset_group: null },
            { name: 'Behind-The-Back Dual Cable D-Handle Curls', set_count: 2, rep_range: '5-8', tempo: '3110', rest_seconds: 60, notes: null,                               order_index: 11, superset_group: null },
          ],
        })

        // ── Conditioning ────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Conditioning',
          week_number: week,
          session_type: 'conditioning',
          exercises: [],
        })
      }

      return sessions
    },
  },

  // ── Template 27 — Anterior / Posterior / Shoulders & Arms ───────────────
  {
    id: 'anterior-posterior-shoulders-arms',
    name: 'Anterior / Posterior / Shoulders & Arms',
    description: 'Five-day Poliquin contrast split: every working superset pairs a heavy compound (4–6 reps, 5-sec eccentric) with an isolation for the same muscle (8–15 reps) to exploit post-activation potentiation. Day 5 dedicates a full session to shoulder width, arm detail and abs.',
    goal_type: 'hypertrophy',
    phase: 'accumulation',
    default_weeks: 4,
    days_per_week: 5,
    difficulty: 'intermediate',
    icon: '💪',
    color: 'from-blue-600 to-purple-600',
    tags: ['anterior', 'posterior', 'shoulders', 'arms', 'contrast', 'poliquin', '5-day'],
    generateSessions(weeks = this.default_weeks) {
      const sessions = []

      const warmup_mob_a = [
        { name: 'Pigeon Pose',    set_count: 1, rep_range: 'hold', tempo: '0000', rest_seconds: 0, notes: 'Warmup — 60s each side', order_index: 0, superset_group: 'gs_wu_ant1' },
        { name: 'Couch Stretch',  set_count: 1, rep_range: 'hold', tempo: '0000', rest_seconds: 0, notes: 'Warmup — 60s each side', order_index: 1, superset_group: 'gs_wu_ant1' },
        { name: 'Frog Pose',      set_count: 1, rep_range: 'hold', tempo: '0000', rest_seconds: 60, notes: 'Warmup',                order_index: 2, superset_group: 'gs_wu_ant1' },
      ]

      const warmup_post = [
        { name: 'Ab Wheel',                set_count: 1, rep_range: '10-15', tempo: null,   rest_seconds: 0,  notes: 'Warmup',                     order_index: 0, superset_group: 'gs_wu_post' },
        { name: 'Unilateral Farmers Carry', set_count: 1, rep_range: '20m',  tempo: '0000', rest_seconds: 0,  notes: 'Warmup — each side',          order_index: 1, superset_group: 'gs_wu_post' },
        { name: 'Single Leg RDL',           set_count: 1, rep_range: '6-8',  tempo: '0000', rest_seconds: 60, notes: 'Warmup — bodyweight each side', order_index: 2, superset_group: 'gs_wu_post' },
      ]

      const warmup_mob_b = [
        { name: 'Thread the Needle',                         set_count: 1, rep_range: '4',    tempo: '0000', rest_seconds: 0,  notes: 'Warmup',  order_index: 0, superset_group: 'gs_wu_b' },
        { name: 'Face Pulls',                                set_count: 1, rep_range: '6',    tempo: '0000', rest_seconds: 0,  notes: 'Warmup',  order_index: 1, superset_group: 'gs_wu_b' },
        { name: 'Lat PNF Stretch',                           set_count: 1, rep_range: 'hold', tempo: '0000', rest_seconds: 0,  notes: 'Warmup',  order_index: 2, superset_group: 'gs_wu_b' },
        { name: "Cable External Rotation at 90° Abduction",  set_count: 1, rep_range: '8-10', tempo: '0000', rest_seconds: 0,  notes: 'Warmup',  order_index: 3, superset_group: 'gs_wu_b' },
        { name: 'Flat Dumbbell Floor Press',                 set_count: 1, rep_range: '8-10', tempo: '0000', rest_seconds: 60, notes: 'Warmup',  order_index: 4, superset_group: 'gs_wu_b' },
      ]

      for (let week = 1; week <= weeks; week++) {
        // ── Day 1 — Anterior ────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 1 — Anterior',
          week_number: week,
          session_type: 'hypertrophy',
          exercises: [
            ...warmup_mob_a.map(e => ({ ...e })),
            { name: 'Reverse Banded Hack Squat / Pendulum Squat', set_count: 4, rep_range: '4-6',   tempo: '5220', rest_seconds: 0,  notes: 'A1 — 5-sec eccentric; go straight to A2',    order_index: 3,  superset_group: 'ss1_ant1' },
            { name: 'Seated Cable Chest Press',                    set_count: 4, rep_range: '12-15', tempo: '2220', rest_seconds: 60, notes: 'A2 — 60s rest after A2 before next round',    order_index: 4,  superset_group: 'ss1_ant1' },
            { name: 'Incline Dumbbell Press',                      set_count: 4, rep_range: '4-6',   tempo: '5220', rest_seconds: 0,  notes: 'B1 — 5-sec eccentric; go straight to B2',    order_index: 5,  superset_group: 'ss2_ant1' },
            { name: 'Leg Extensions',                              set_count: 4, rep_range: '12-15', tempo: '2220', rest_seconds: 60, notes: 'B2 — 60s rest after B2 before next round',    order_index: 6,  superset_group: 'ss2_ant1' },
            { name: 'Bulgarian Split Squat',                       set_count: 3, rep_range: '4-6',   tempo: '5220', rest_seconds: 0,  notes: 'C1 — 5-sec eccentric; go straight to C2',    order_index: 7,  superset_group: 'ss3_ant1' },
            { name: 'Pec Deck Machine',                            set_count: 3, rep_range: '12-15', tempo: '2220', rest_seconds: 60, notes: 'C2 — 60s rest after C2 before next round',    order_index: 8,  superset_group: 'ss3_ant1' },
            { name: 'Decline Skullcrushers',                       set_count: 4, rep_range: '4-6',   tempo: '5220', rest_seconds: 0,  notes: 'D1 — 5-sec eccentric; go straight to D2',    order_index: 9,  superset_group: 'ss4_ant1' },
            { name: 'Cross Cable Tricep Extensions',               set_count: 4, rep_range: '12-15', tempo: '2220', rest_seconds: 60, notes: 'D2 — 60s rest after D2 before next round',    order_index: 10, superset_group: 'ss4_ant1' },
          ],
        })

        // ── Day 2 — Posterior ───────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 2 — Posterior',
          week_number: week,
          session_type: 'hypertrophy',
          exercises: [
            ...warmup_post.map(e => ({ ...e })),
            { name: 'Trap Bar Deadlift',                              set_count: 4, rep_range: '4-6',   tempo: '5220', rest_seconds: 0,  notes: 'A1 — 5-sec eccentric; go straight to A2',    order_index: 3,  superset_group: 'ss1_post1' },
            { name: 'Single Arm Supinated Pulldown',                  set_count: 4, rep_range: '8-10',  tempo: '3110', rest_seconds: 60, notes: 'A2 — 60s rest after A2 before next round',    order_index: 4,  superset_group: 'ss1_post1' },
            { name: 'T Bar Row',                                       set_count: 4, rep_range: '4-6',   tempo: '5220', rest_seconds: 0,  notes: 'B1 — 5-sec eccentric; go straight to B2',    order_index: 5,  superset_group: 'ss2_post1' },
            { name: 'Lying Hamstring Curl',                            set_count: 4, rep_range: '12-15', tempo: '2220', rest_seconds: 60, notes: 'B2 — 60s rest after B2 before next round',    order_index: 6,  superset_group: 'ss2_post1' },
            { name: 'Single Arm Machine Row',                          set_count: 4, rep_range: '8-10',  tempo: '3010', rest_seconds: 0,  notes: 'C1 — go straight to C2',                     order_index: 7,  superset_group: 'ss3_post1' },
            { name: 'Rounded Back Extension',                          set_count: 4, rep_range: '12-15', tempo: '3111', rest_seconds: 90, notes: 'C2 — 90s rest after C2 before next round',    order_index: 8,  superset_group: 'ss3_post1' },
            { name: 'Cable Bicep Curls (Facing Towards Stack)',        set_count: 4, rep_range: '6-8',   tempo: '2220', rest_seconds: 0,  notes: 'D1 — go straight to D2',                     order_index: 9,  superset_group: 'ss4_post1' },
            { name: 'Cable Bicep Curls (Facing Away From Stack)',      set_count: 4, rep_range: '8-12',  tempo: '2220', rest_seconds: 90, notes: 'D2 — 90s rest after D2 before next round',    order_index: 10, superset_group: 'ss4_post1' },
          ],
        })

        // ── Day 3 — Anterior ────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 3 — Anterior',
          week_number: week,
          session_type: 'hypertrophy',
          exercises: [
            ...warmup_mob_b.map(e => ({ ...e })),
            { name: 'Incline Smith Press',       set_count: 4, rep_range: '4-6',   tempo: '5210', rest_seconds: 0,  notes: 'A1 — 5-sec eccentric; go straight to A2',    order_index: 5,  superset_group: 'ss1_ant2' },
            { name: 'Leg Extensions',             set_count: 4, rep_range: '12-15', tempo: '3111', rest_seconds: 60, notes: 'A2 — 60s rest after A2 before next round',    order_index: 6,  superset_group: 'ss1_ant2' },
            { name: 'Machine Leg Press',          set_count: 4, rep_range: '6-8',   tempo: '5220', rest_seconds: 0,  notes: 'B1 — 5-sec eccentric; go straight to B2',    order_index: 7,  superset_group: 'ss2_ant2' },
            { name: 'Pec Deck Machine',           set_count: 4, rep_range: '8-10',  tempo: '2220', rest_seconds: 90, notes: 'B2 — 90s rest after B2 before next round',    order_index: 8,  superset_group: 'ss2_ant2' },
            { name: 'Seated Cable Chest Press',   set_count: 3, rep_range: '12-15', tempo: '2220', rest_seconds: 0,  notes: 'C1 — go straight to C2',                     order_index: 9,  superset_group: 'ss3_ant2' },
            { name: 'Walking Lunges',             set_count: 3, rep_range: '12',    tempo: '2220', rest_seconds: 90, notes: 'C2 — 90s rest after C2 before next round',    order_index: 10, superset_group: 'ss3_ant2' },
            { name: 'Strict Dips',               set_count: 4, rep_range: '4-6',   tempo: '5220', rest_seconds: 0,  notes: 'D1 — 5-sec eccentric; go straight to D2',    order_index: 11, superset_group: 'ss4_ant2' },
            { name: 'Cable Tricep Pushdown',      set_count: 4, rep_range: '12-15', tempo: '2220', rest_seconds: 90, notes: 'D2 — 90s rest after D2 before next round',    order_index: 12, superset_group: 'ss4_ant2' },
          ],
        })

        // ── Day 4 — Posterior ───────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 4 — Posterior',
          week_number: week,
          session_type: 'hypertrophy',
          exercises: [
            ...warmup_post.map(e => ({ ...e })),
            { name: 'Romanian Deadlift',                               set_count: 4, rep_range: '4-6',   tempo: '5220', rest_seconds: 0,  notes: 'A1 — 5-sec eccentric; go straight to A2',    order_index: 3,  superset_group: 'ss1_post2' },
            { name: 'Dual Cable Pulldown',                             set_count: 4, rep_range: '12-15', tempo: '2220', rest_seconds: 90, notes: 'A2 — 90s rest after A2 before next round',    order_index: 4,  superset_group: 'ss1_post2' },
            { name: 'Barbell Hip Thrusts',                             set_count: 4, rep_range: '4-6',   tempo: '3010', rest_seconds: 0,  notes: 'B1 — go straight to B2',                     order_index: 5,  superset_group: 'ss2_post2' },
            { name: 'Chin Up',                                         set_count: 4, rep_range: '6-8',   tempo: '3010', rest_seconds: 90, notes: 'B2 — 90s rest after B2 before next round',    order_index: 6,  superset_group: 'ss2_post2' },
            { name: 'Machine Row Upper Back',                          set_count: 3, rep_range: '8-10',  tempo: '2220', rest_seconds: 0,  notes: 'C1 — go straight to C2',                     order_index: 7,  superset_group: 'ss3_post2' },
            { name: 'Rounded Back Extension',                          set_count: 3, rep_range: '12-15', tempo: '5220', rest_seconds: 90, notes: 'C2 — 90s rest after C2 before next round',    order_index: 8,  superset_group: 'ss3_post2' },
            { name: 'Single Arm Cable Curl',                           set_count: 4, rep_range: '6-8',   tempo: '2220', rest_seconds: 0,  notes: 'D1 — go straight to D2',                     order_index: 9,  superset_group: 'ss4_post2' },
            { name: 'Single Arm Incline Bench Dumbbell Preacher Curl', set_count: 4, rep_range: '6-8',   tempo: '2220', rest_seconds: 90, notes: 'D2 — 90s rest after D2 before next round',    order_index: 10, superset_group: 'ss4_post2' },
          ],
        })

        // ── Day 5 — Shoulders, Arms & Abs ───────────────────────────────────
        sessions.push({
          day_label: 'Day 5 — Shoulders, Arms & Abs',
          week_number: week,
          session_type: 'hypertrophy',
          exercises: [
            ...warmup_mob_b.map(e => ({ ...e })),
            { name: 'Neutral Grip Seated Dumbbell Shoulder Press', set_count: 4, rep_range: '4-6',   tempo: '5120', rest_seconds: 0,  notes: 'A1 — 5-sec eccentric; go straight to A2',    order_index: 5,  superset_group: 'ss1_saa' },
            { name: 'Reverse Crunches',                             set_count: 4, rep_range: '6-8',   tempo: '3010', rest_seconds: 60, notes: 'A2 — 60s rest after A2 before next round',    order_index: 6,  superset_group: 'ss1_saa' },
            { name: 'Single Arm Cable Lateral Raise',              set_count: 4, rep_range: '8-10',  tempo: '3110', rest_seconds: 0,  notes: 'B1 — go straight to B2',                     order_index: 7,  superset_group: 'ss2_saa' },
            { name: 'Lean Away Dumbbell Lateral Raise',            set_count: 4, rep_range: '8-10',  tempo: '3110', rest_seconds: 90, notes: 'B2 — 90s rest after B2 before next round',    order_index: 8,  superset_group: 'ss2_saa' },
            { name: 'Incline Dumbbell Curls',                      set_count: 4, rep_range: '4-6',   tempo: '3110', rest_seconds: 0,  notes: 'C1 — arms giant set; go to C2',               order_index: 9,  superset_group: 'gs_arms' },
            { name: 'Standing Alternate Bicep Curl',               set_count: 4, rep_range: '8-10',  tempo: '3110', rest_seconds: 0,  notes: 'C2 — go to C3',                              order_index: 10, superset_group: 'gs_arms' },
            { name: 'Cable Overhead Tricep Extension',             set_count: 4, rep_range: '6-8',   tempo: '3110', rest_seconds: 0,  notes: 'C3 — go to C4',                              order_index: 11, superset_group: 'gs_arms' },
            { name: 'Double Rope Tricep Pushdowns',                set_count: 4, rep_range: '12-15', tempo: '2220', rest_seconds: 90, notes: 'C4 — 90s rest after C4 before next round',    order_index: 12, superset_group: 'gs_arms' },
            { name: 'Kneeling Cable Crunches',                     set_count: 3, rep_range: '15-20', tempo: '2220', rest_seconds: 90, notes: null,                                          order_index: 13, superset_group: null },
          ],
        })
      }

      return sessions
    },
  },

  // ── Template 28 — Athletic Development ───────────────────────────────────
  {
    id: 'athletic-development',
    name: 'Athletic Development',
    description: 'Six-day strength-conditioning hybrid built around three full-body strength sessions and three conditioning days. Strength days open with a CNS-priming giant-set activation circuit (bridges, Copenhagen planks, jumps and hops) before progressing to main lifts, supersets and loaded isometric holds. Conditioning days combine sled work with an arm-focused giant set.',
    goal_type: 'athletic',
    phase: 'accumulation',
    default_weeks: 4,
    days_per_week: 6,
    difficulty: 'intermediate',
    icon: '🏃',
    color: 'from-green-600 to-teal-500',
    tags: ['athletic', 'strength', 'conditioning', 'sled', 'full-body', '6-day'],
    generateSessions(weeks = this.default_weeks) {
      const sessions = []

      // ── Reusable warmup circuits ────────────────────────────────────────────
      const warmup_lower_a = [
        { name: 'Single Leg Hamstring Bridge Iso (Foam Roller)', set_count: 2, rep_range: '6-8', tempo: '0000', rest_seconds: 0,  notes: '6-8 Breath isometric hold — long slow exhales, find obliques, reach forward in low reach position compressing pelvis to ribcage', order_index: 0, superset_group: 'A1' },
        { name: 'Copenhagen Plank',                              set_count: 2, rep_range: '30s', tempo: '0000', rest_seconds: 0,  notes: null, order_index: 1, superset_group: 'A1' },
        { name: 'Front Foot Elevated Split Squat Contralaterally Loaded', set_count: 2, rep_range: '8-10', tempo: '3210', rest_seconds: 0, notes: null, order_index: 2, superset_group: 'A1' },
        { name: 'Pogo Hops',                                     set_count: 2, rep_range: '30s', tempo: '0000', rest_seconds: 0,  notes: null, order_index: 3, superset_group: 'A1' },
        { name: 'Max Effort Vertical Jump',                      set_count: 2, rep_range: '5',   tempo: '1010', rest_seconds: 0,  notes: null, order_index: 4, superset_group: 'A1' },
      ]

      const warmup_lower_b = [
        { name: 'Single Leg Hamstring Bridge Iso (Foam Roller)', set_count: 2, rep_range: '6-8', tempo: '0000', rest_seconds: 0,  notes: null, order_index: 0, superset_group: 'A1' },
        { name: 'Copenhagen Plank',                              set_count: 2, rep_range: '30s', tempo: '0000', rest_seconds: 0,  notes: null, order_index: 1, superset_group: 'A1' },
        { name: 'Kickstance RDL with CL Load',                  set_count: 2, rep_range: '6-8', tempo: '3210', rest_seconds: 0,  notes: null, order_index: 2, superset_group: 'A1' },
        { name: 'Pogo Hops',                                     set_count: 2, rep_range: '30s', tempo: '0000', rest_seconds: 0,  notes: null, order_index: 3, superset_group: 'A1' },
        { name: 'Max Effort Vertical Jump',                      set_count: 2, rep_range: '3-5', tempo: '1010', rest_seconds: 60, notes: null, order_index: 4, superset_group: 'A1' },
      ]

      const warmup_upper = [
        { name: 'Childs Pose',              set_count: 1, rep_range: '6-8',   tempo: '0000', rest_seconds: 0,    notes: null, order_index: 0, superset_group: 'A1' },
        { name: 'Kettlebell Arm Bar',        set_count: 1, rep_range: '6-8',   tempo: '2010', rest_seconds: 0,    notes: null, order_index: 1, superset_group: 'A1' },
        { name: 'Hanging Knee Raises',       set_count: 1, rep_range: '10-20', tempo: '3011', rest_seconds: 0,    notes: null, order_index: 2, superset_group: 'A1' },
        { name: 'Deficit Plate Push Ups',    set_count: 1, rep_range: '10-12', tempo: '3210', rest_seconds: 0,    notes: null, order_index: 3, superset_group: 'A1' },
        { name: 'Ab Rollout',               set_count: 1, rep_range: '10-20', tempo: '3010', rest_seconds: 60,   notes: null, order_index: 4, superset_group: 'A1' },
      ]

      for (let week = 1; week <= weeks; week++) {
        // ── Day 1 — Strength ─────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 1 — Strength',
          week_number: week,
          session_type: 'strength',
          exercises: [
            ...warmup_lower_a.map((e, i) => ({ ...e, order_index: i })),
            { name: 'Prone Hamstring Curl Machine', set_count: 2, rep_range: '10-15', tempo: '3011', rest_seconds: 60,  notes: null, order_index: 5, superset_group: 'B1' },
            { name: 'Hip Adductor',                 set_count: 2, rep_range: '10-15', tempo: '3011', rest_seconds: 60,  notes: null, order_index: 6, superset_group: 'B1' },
            { name: 'Safety Squat',                 set_count: 3, rep_range: '6-8',   tempo: '3110', rest_seconds: 120, notes: null, order_index: 7, superset_group: null },
            { name: 'Wall Reference Split Squat',   set_count: 4, rep_range: '10',    tempo: '3210', rest_seconds: 60,  notes: null, order_index: 8, superset_group: 'C1' },
            { name: 'Hook Lying Dumbbell Press',    set_count: 4, rep_range: '5',     tempo: '3110', rest_seconds: 60,  notes: null, order_index: 9, superset_group: 'C1' },
            { name: 'Wall Reference Seated Overhead Press', set_count: 3, rep_range: '12-15', tempo: '2011', rest_seconds: 90, notes: null, order_index: 10, superset_group: null },
            { name: 'Behind-The-Back Dual Cable D-Handle Curls', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 11, superset_group: 'D1' },
            { name: 'Cross Body Tricep Extension',  set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60,  notes: null, order_index: 12, superset_group: 'D1' },
            { name: 'Trap Bar Isometric Hold',      set_count: 3, rep_range: '2',     tempo: '0000', rest_seconds: 90,  notes: 'Accumulate 2 minute hold — squeeze hamstrings, glutes, abs, traps', order_index: 13, superset_group: null },
          ],
        })

        // ── Day 2 — Conditioning ─────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 2 — Conditioning',
          week_number: week,
          session_type: 'conditioning',
          exercises: [
            { name: 'Assault Bike (distance)', set_count: 1, rep_range: '3500m', tempo: '0000', rest_seconds: 0,   notes: 'Time trial — 3500 metres as fast as possible', order_index: 0, superset_group: null },
            { name: 'Double DB Snatch / Heavy Kettlebell Swing', set_count: 1, rep_range: '100', tempo: '2010', rest_seconds: 0, notes: '100 reps as fast as possible', order_index: 1, superset_group: null },
          ],
        })

        // ── Day 3 — Strength ─────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 3 — Strength',
          week_number: week,
          session_type: 'strength',
          exercises: [
            ...warmup_upper.map((e, i) => ({ ...e, order_index: i })),
            { name: 'Single Arm High Cable Bicep Curl', set_count: 2, rep_range: '10-15', tempo: '3011', rest_seconds: 90,  notes: null, order_index: 5, superset_group: null },
            { name: 'Pull Ups',                         set_count: 4, rep_range: '6-10',  tempo: '2010', rest_seconds: 90,  notes: null, order_index: 6, superset_group: 'B1' },
            { name: 'Incline Bench Press',              set_count: 4, rep_range: '10',    tempo: '3010', rest_seconds: 150, notes: '45° incline', order_index: 7, superset_group: 'B1' },
            { name: 'Trap Bar Deadlift',                set_count: 3, rep_range: '6',     tempo: '2010', rest_seconds: 120, notes: null, order_index: 8, superset_group: 'C1' },
            { name: 'Alternating Glute Bridge Press',   set_count: 3, rep_range: '12',    tempo: '2010', rest_seconds: 90,  notes: null, order_index: 9, superset_group: 'C1' },
            { name: 'Glute Ham Raise',                  set_count: 3, rep_range: '20-30', tempo: '2010', rest_seconds: 90,  notes: null, order_index: 10, superset_group: null },
            { name: 'Zercher Squat Iso',                set_count: 2, rep_range: '2',     tempo: '3010', rest_seconds: 120, notes: 'Sit in the position for 2 minutes total', order_index: 11, superset_group: null },
          ],
        })

        // ── Day 4 — Conditioning + Arms ──────────────────────────────────────
        sessions.push({
          day_label: 'Day 4 — Conditioning + Arms',
          week_number: week,
          session_type: 'conditioning',
          exercises: [
            { name: 'Reverse Sled Drag', set_count: 1, rep_range: '10 min', tempo: '0000', rest_seconds: 0, notes: '10 minute continuous sled drag', order_index: 0, superset_group: null },
            { name: 'Plyo Step Ups',     set_count: 1, rep_range: '10 min', tempo: '1010', rest_seconds: 0, notes: '10 minutes continuous alternating legs', order_index: 1, superset_group: null },
            { name: 'Cross Body Hammer Curl',    set_count: 3, rep_range: '10', tempo: '2010', rest_seconds: 0,   notes: null, order_index: 2, superset_group: 'B1' },
            { name: 'Reverse Grip EZ Bar Curl',  set_count: 3, rep_range: '10', tempo: '2010', rest_seconds: 0,   notes: null, order_index: 3, superset_group: 'B1' },
            { name: 'Incline Dumbbell Curls',    set_count: 3, rep_range: '10', tempo: '2010', rest_seconds: 0,   notes: null, order_index: 4, superset_group: 'B1' },
            { name: 'Dumbbell Skullcrushers',    set_count: 3, rep_range: '10', tempo: '2010', rest_seconds: 0,   notes: null, order_index: 5, superset_group: 'B1' },
            { name: 'Dumbbell Pullover',         set_count: 3, rep_range: '10', tempo: '2010', rest_seconds: 0,   notes: null, order_index: 6, superset_group: 'B1' },
            { name: 'Tate Press',                set_count: 3, rep_range: '10', tempo: '2010', rest_seconds: 120, notes: null, order_index: 7, superset_group: 'B1' },
          ],
        })

        // ── Day 5 — Strength ─────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 5 — Strength',
          week_number: week,
          session_type: 'strength',
          exercises: [
            ...warmup_lower_b.map((e, i) => ({ ...e, order_index: i })),
            { name: 'Trap Bar Deadlift',       set_count: 3, rep_range: '8',   tempo: '2010', rest_seconds: 120, notes: null, order_index: 5, superset_group: null },
            { name: 'Flat Barbell Bench Press', set_count: 4, rep_range: '8',  tempo: '3010', rest_seconds: 120, notes: 'Final set: reduce load by 20% and AMRAP', order_index: 6, superset_group: null },
            { name: 'Bulgarian Split Squat',    set_count: 3, rep_range: '12', tempo: '3210', rest_seconds: 90,  notes: null, order_index: 7, superset_group: 'B1' },
            { name: 'Prone Hamstring Curl Machine', set_count: 3, rep_range: '10', tempo: '3010', rest_seconds: 90, notes: null, order_index: 8, superset_group: 'B1' },
            { name: 'Half Kneeling Landmine Press', set_count: 2, rep_range: '10', tempo: '2010', rest_seconds: 90, notes: null, order_index: 9, superset_group: null },
            { name: 'Hanging Knee Raises',          set_count: 3, rep_range: '20-30', tempo: '2010', rest_seconds: 90, notes: null, order_index: 10, superset_group: null },
          ],
        })

        // ── Day 6 — Conditioning + Arms ──────────────────────────────────────
        sessions.push({
          day_label: 'Day 6 — Conditioning + Arms',
          week_number: week,
          session_type: 'conditioning',
          exercises: [
            { name: 'Assault Bike',  set_count: 1, rep_range: '5 min', tempo: '0000', rest_seconds: 120, notes: '5 minute max calories effort', order_index: 0, superset_group: null },
            { name: 'Sled Push',     set_count: 1, rep_range: '5 laps', tempo: '0000', rest_seconds: 120, notes: '5 laps of turf as fast as possible — keep sled light for acceleration', order_index: 1, superset_group: null },
            { name: 'Barbell Curls',            set_count: 4, rep_range: '10', tempo: '2010', rest_seconds: 0,   notes: null, order_index: 2, superset_group: 'B1' },
            { name: 'Tricep Dips',              set_count: 4, rep_range: '10', tempo: '2010', rest_seconds: 0,   notes: null, order_index: 3, superset_group: 'B1' },
            { name: 'Dumbbell Side Lateral Raises', set_count: 4, rep_range: '10', tempo: '2010', rest_seconds: 0, notes: null, order_index: 4, superset_group: 'B1' },
            { name: 'Ab Rollout',               set_count: 4, rep_range: '10', tempo: '2010', rest_seconds: 60,  notes: null, order_index: 5, superset_group: 'B1' },
          ],
        })
      }

      return sessions
    },
  },

  // ── Template 29 — Athletic Development - Football ────────────────────────
  {
    id: 'athletic-development-football',
    name: 'Athletic Development — Football',
    description: 'Two-day football-specific S+C programme. Adds dedicated neck conditioning (isometric bridge + cable extension superset) to the standard Athletic Development framework, and replaces conventional pulls with GI/towel pull-ups and Telemark squats to build the grip, hip stability and loaded tendon resilience required for contact sport.',
    goal_type: 'athletic',
    phase: 'accumulation',
    default_weeks: 4,
    days_per_week: 2,
    difficulty: 'intermediate',
    icon: '🏈',
    color: 'from-green-700 to-yellow-500',
    tags: ['athletic', 'football', 'strength', 'neck', 'grip', '2-day'],
    generateSessions(weeks = this.default_weeks) {
      const sessions = []

      for (let week = 1; week <= weeks; week++) {
        // ── Day 1 — Strength ─────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 1 — Strength',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Giant Set A — CNS warmup
            { name: 'Single Leg Hamstring Bridge Iso (Foam Roller)', set_count: 2, rep_range: '6-8',   tempo: '0000', rest_seconds: 0,   notes: '6-8 breath isometric hold — long slow exhales, reach forward compressing pelvis to ribcage', order_index: 0, superset_group: 'A1' },
            { name: 'Copenhagen Plank',                              set_count: 2, rep_range: '30s',   tempo: '0000', rest_seconds: 0,   notes: null, order_index: 1, superset_group: 'A1' },
            { name: 'Front Foot Elevated Split Squat Contralaterally Loaded', set_count: 2, rep_range: '8-10', tempo: '3210', rest_seconds: 0, notes: null, order_index: 2, superset_group: 'A1' },
            { name: 'Straight Arm Russian Twist',                    set_count: 2, rep_range: '6-8',   tempo: '2010', rest_seconds: 0,   notes: null, order_index: 3, superset_group: 'A1' },
            // Giant Set B — Plyometric + core
            { name: 'Pogo Hops',                                     set_count: 2, rep_range: '30s',   tempo: '0000', rest_seconds: 0,   notes: null, order_index: 4, superset_group: 'B1' },
            { name: 'GHD Sit Ups',                                   set_count: 2, rep_range: '10-15', tempo: '2010', rest_seconds: 0,   notes: null, order_index: 5, superset_group: 'B1' },
            // Superset — Neck conditioning
            { name: 'Neck Bridge Isometric',                         set_count: 2, rep_range: '25-30', tempo: '0000', rest_seconds: 0,   notes: '30s isometric hold', order_index: 6, superset_group: 'C1' },
            { name: 'Cable Neck Extension',                          set_count: 2, rep_range: '12-15', tempo: '2010', rest_seconds: 0,   notes: null, order_index: 7, superset_group: 'C1' },
            // Superset — Hamstring/adductor
            { name: 'Prone Hamstring Curl Machine',                  set_count: 2, rep_range: '10-15', tempo: '3011', rest_seconds: 60,  notes: null, order_index: 8, superset_group: 'D1' },
            { name: 'Hip Adductor',                                  set_count: 2, rep_range: '10-15', tempo: '3011', rest_seconds: 60,  notes: null, order_index: 9, superset_group: 'D1' },
            // Giant Set C — Main work
            { name: 'Trap Bar Isometric Hold',                       set_count: 3, rep_range: '2',     tempo: '0000', rest_seconds: 90,  notes: 'Accumulate 2 minute hold — squeeze hamstrings, glutes, abs, traps', order_index: 10, superset_group: 'E1' },
            { name: 'Telemark Squats',                               set_count: 3, rep_range: '6-8',   tempo: '3110', rest_seconds: 90,  notes: null, order_index: 11, superset_group: 'E1' },
            { name: 'Low Reach Cable Row',                           set_count: 3, rep_range: '8-12',  tempo: '3010', rest_seconds: 60,  notes: null, order_index: 12, superset_group: 'E1' },
            // Superset — Hip extension + press
            { name: 'Rounded Back GHD Hip Extension',                set_count: 3, rep_range: '10',    tempo: '3210', rest_seconds: 60,  notes: null, order_index: 13, superset_group: 'F1' },
            { name: 'Hook Lying Dumbbell Press',                     set_count: 3, rep_range: '5',     tempo: '3010', rest_seconds: 60,  notes: null, order_index: 14, superset_group: 'F1' },
            // Finisher
            { name: 'Zercher Squat Iso',                             set_count: 2, rep_range: '2',     tempo: '0000', rest_seconds: 90,  notes: 'Sit in the position for 2 minutes total', order_index: 15, superset_group: null },
          ],
        })

        // ── Day 2 — Strength ─────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 2 — Strength',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Giant Set A — warmup
            { name: 'Childs Pose',              set_count: 1, rep_range: '6-8',   tempo: '0000', rest_seconds: 0,   notes: null, order_index: 0, superset_group: 'A1' },
            { name: 'Kettlebell Arm Bar',        set_count: 1, rep_range: '6-8',   tempo: '2010', rest_seconds: 0,   notes: null, order_index: 1, superset_group: 'A1' },
            { name: 'Hanging Knee Raises',       set_count: 1, rep_range: '10-20', tempo: '3011', rest_seconds: 0,   notes: null, order_index: 2, superset_group: 'A1' },
            { name: 'Deficit Plate Push Ups',    set_count: 1, rep_range: '10-12', tempo: '3210', rest_seconds: 0,   notes: null, order_index: 3, superset_group: 'A1' },
            { name: 'Ab Rollout',               set_count: 1, rep_range: '10-20', tempo: '3010', rest_seconds: 60,  notes: null, order_index: 4, superset_group: 'A1' },
            // Superset — Neck conditioning
            { name: 'Neck Bridge Isometric',    set_count: 2, rep_range: '25-30', tempo: '0000', rest_seconds: 90,  notes: '30s isometric hold', order_index: 5, superset_group: 'B1' },
            { name: 'Cable Neck Extension',     set_count: 2, rep_range: '12-15', tempo: '2010', rest_seconds: 60,  notes: null, order_index: 6, superset_group: 'B1' },
            // Superset — Deadlift complex
            { name: 'Trap Bar Deadlift',                set_count: 3, rep_range: '3-5',  tempo: '2010', rest_seconds: 120, notes: null, order_index: 7, superset_group: 'C1' },
            { name: 'Alternating Glute Bridge Press',   set_count: 3, rep_range: '12',   tempo: '2010', rest_seconds: 90,  notes: null, order_index: 8, superset_group: 'C1' },
            // Giant Set B — unilateral lower + pull
            { name: 'Single Leg Landmine RDL',  set_count: 3, rep_range: '6-8',   tempo: '3010', rest_seconds: 45,  notes: null, order_index: 9,  superset_group: 'D1' },
            { name: 'Pull Ups',                 set_count: 3, rep_range: '6-10',  tempo: '2010', rest_seconds: 0,   notes: null, order_index: 10, superset_group: 'D1' },
            { name: 'GI Pull Ups',              set_count: 3, rep_range: '8-12',  tempo: '2010', rest_seconds: 90,  notes: 'Go to failure with towel/GI — grip strength endurance', order_index: 11, superset_group: 'D1' },
            // Finishers
            { name: 'Glute Ham Raise',          set_count: 3, rep_range: '20-30', tempo: '2010', rest_seconds: 90,  notes: null, order_index: 12, superset_group: null },
            { name: 'Cable ER at 90 Degrees',   set_count: 2, rep_range: '10-15', tempo: '2010', rest_seconds: 90,  notes: null, order_index: 13, superset_group: null },
          ],
        })
      }

      return sessions
    },
  },

  // ── Template 30 — Athletic Development S+C ───────────────────────────────
  {
    id: 'athletic-development-sc',
    name: 'Athletic Development S+C',
    description: 'Three-day strength and conditioning programme for athletes. Days 1 and 2 share the CNS warmup circuit and Telemark squat complex from the Athletic Development series; Day 3 shifts to a barbell-focused session with heavy RDL, bench press and weighted pull-ups. Day 2 closes with a reverse sled finisher for aerobic capacity.',
    goal_type: 'athletic',
    phase: 'accumulation',
    default_weeks: 4,
    days_per_week: 3,
    difficulty: 'intermediate',
    icon: '⚡',
    color: 'from-teal-600 to-green-500',
    tags: ['athletic', 's+c', 'strength', 'conditioning', 'sled', '3-day'],
    generateSessions(weeks = this.default_weeks) {
      const sessions = []

      for (let week = 1; week <= weeks; week++) {
        // ── Day 1 — Strength ─────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 1 — Strength',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Giant Set A — CNS warmup
            { name: 'Single Leg Hamstring Bridge Iso (Foam Roller)', set_count: 2, rep_range: '6-8',   tempo: '0000', rest_seconds: 0,   notes: '6-8 breath isometric hold — long slow exhales, reach forward compressing pelvis to ribcage', order_index: 0, superset_group: 'A1' },
            { name: 'Copenhagen Plank',                              set_count: 2, rep_range: '30s',   tempo: '0000', rest_seconds: 0,   notes: null, order_index: 1, superset_group: 'A1' },
            { name: 'Front Foot Elevated Split Squat Contralaterally Loaded', set_count: 2, rep_range: '8-10', tempo: '3210', rest_seconds: 0, notes: null, order_index: 2, superset_group: 'A1' },
            { name: 'Straight Arm Russian Twist',                    set_count: 2, rep_range: '6-8',   tempo: '2010', rest_seconds: 0,   notes: null, order_index: 3, superset_group: 'A1' },
            // Giant Set B — plyometric + core
            { name: 'Pogo Hops',                                     set_count: 2, rep_range: '30s',   tempo: '0000', rest_seconds: 0,   notes: null, order_index: 4, superset_group: 'B1' },
            { name: 'GHD Sit Ups',                                   set_count: 2, rep_range: '10-15', tempo: '2010', rest_seconds: 0,   notes: null, order_index: 5, superset_group: 'B1' },
            // Superset — knee activation
            { name: 'Banded TKE',                                    set_count: 2, rep_range: '15-20', tempo: '2010', rest_seconds: 0,   notes: null, order_index: 6, superset_group: 'C1' },
            { name: 'Poliquin Step-Up',                              set_count: 2, rep_range: '12-15', tempo: '2010', rest_seconds: 60,  notes: null, order_index: 7, superset_group: 'C1' },
            // Superset — hamstring/adductor
            { name: 'Prone Hamstring Curl - Two Up One Down',        set_count: 2, rep_range: '10-15', tempo: '3011', rest_seconds: 60,  notes: null, order_index: 8, superset_group: 'D1' },
            { name: 'Hip Adductor',                                  set_count: 2, rep_range: '10-15', tempo: '3011', rest_seconds: 60,  notes: null, order_index: 9, superset_group: 'D1' },
            // Giant Set C — main strength complex
            { name: 'Trap Bar Isometric Hold',                       set_count: 3, rep_range: '2',     tempo: '0000', rest_seconds: 90,  notes: 'Accumulate 2 minute hold — squeeze hamstrings, glutes, abs, traps', order_index: 10, superset_group: 'E1' },
            { name: 'Telemark Squats',                               set_count: 3, rep_range: '6-8',   tempo: '3110', rest_seconds: 90,  notes: null, order_index: 11, superset_group: 'E1' },
            { name: 'Low Reach Cable Row',                           set_count: 3, rep_range: '8-12',  tempo: '3010', rest_seconds: 60,  notes: null, order_index: 12, superset_group: 'E1' },
            // Superset — hip extension + press
            { name: '45 Degree Hip Extension',                       set_count: 2, rep_range: '15-20', tempo: '3010', rest_seconds: 60,  notes: null, order_index: 13, superset_group: 'F1' },
            { name: 'Hook Lying Dumbbell Press',                     set_count: 2, rep_range: '5',     tempo: '3010', rest_seconds: 60,  notes: null, order_index: 14, superset_group: 'F1' },
            // Finisher
            { name: 'Zercher Squat Iso',                             set_count: 2, rep_range: '2',     tempo: '0000', rest_seconds: 90,  notes: 'Sit in the position for 2 minutes total', order_index: 15, superset_group: null },
          ],
        })

        // ── Day 2 — Strength + Conditioning ──────────────────────────────────
        sessions.push({
          day_label: 'Day 2 — Strength + Conditioning',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Giant Set A — warmup
            { name: 'Childs Pose',              set_count: 1, rep_range: '6-8',   tempo: '0000', rest_seconds: 0,   notes: null, order_index: 0, superset_group: 'A1' },
            { name: 'Kettlebell Arm Bar',        set_count: 1, rep_range: '6-8',   tempo: '2010', rest_seconds: 0,   notes: null, order_index: 1, superset_group: 'A1' },
            { name: 'Hanging Knee Raises',       set_count: 1, rep_range: '10-20', tempo: '3011', rest_seconds: 0,   notes: null, order_index: 2, superset_group: 'A1' },
            { name: 'Deficit Plate Push Ups',    set_count: 1, rep_range: '10-12', tempo: '3210', rest_seconds: 0,   notes: null, order_index: 3, superset_group: 'A1' },
            { name: 'Ab Rollout',               set_count: 1, rep_range: '10-20', tempo: '3010', rest_seconds: 60,  notes: null, order_index: 4, superset_group: 'A1' },
            // Isometric primer
            { name: 'Zercher Squat Iso',        set_count: 1, rep_range: '2',     tempo: '0000', rest_seconds: 0,   notes: 'Hold for 2 minutes', order_index: 5, superset_group: null },
            // Superset — core/hip flexor
            { name: 'Eccentric Hip Flexor Sit Up', set_count: 2, rep_range: '10-12', tempo: '0000', rest_seconds: 0, notes: null, order_index: 6, superset_group: 'B1' },
            { name: 'Low Cable Pull In',          set_count: 2, rep_range: '12-15', tempo: '2010', rest_seconds: 60, notes: null, order_index: 7, superset_group: 'B1' },
            // Superset — deadlift complex
            { name: 'Trap Bar Deadlift',                set_count: 3, rep_range: '3-5',  tempo: '2010', rest_seconds: 120, notes: null, order_index: 8, superset_group: 'C1' },
            { name: 'Alternating Glute Bridge Press',   set_count: 3, rep_range: '12',   tempo: '2010', rest_seconds: 90,  notes: null, order_index: 9, superset_group: 'C1' },
            // Giant Set B — unilateral lower + pull
            { name: 'Single Leg Landmine RDL',   set_count: 3, rep_range: '6-8',   tempo: '3010', rest_seconds: 45,  notes: null, order_index: 10, superset_group: 'D1' },
            { name: 'Copenhagen Plank Dips',     set_count: 3, rep_range: '8-12',  tempo: '2010', rest_seconds: 90,  notes: null, order_index: 11, superset_group: 'D1' },
            { name: 'Pull Ups',                  set_count: 3, rep_range: '6-10',  tempo: '2010', rest_seconds: 0,   notes: null, order_index: 12, superset_group: 'D1' },
            // Finishers
            { name: '45 Degree Hip Extension',   set_count: 2, rep_range: '12-15', tempo: '2010', rest_seconds: 90,  notes: null, order_index: 13, superset_group: null },
            { name: 'Reverse Sled Drag',         set_count: 1, rep_range: '20',    tempo: '0000', rest_seconds: 90,  notes: 'Accumulate 10 minutes continuous dragging', order_index: 14, superset_group: null },
          ],
        })

        // ── Day 3 — Barbell Strength ──────────────────────────────────────────
        sessions.push({
          day_label: 'Day 3 — Barbell Strength',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Mini warmup (1 round)
            { name: 'Single Leg Hamstring Bridge Iso (Foam Roller)', set_count: 1, rep_range: '6-8',   tempo: '0000', rest_seconds: 0,  notes: null, order_index: 0, superset_group: 'A1' },
            { name: 'Copenhagen Plank Dips',                         set_count: 1, rep_range: '10-12', tempo: '0000', rest_seconds: 0,  notes: null, order_index: 1, superset_group: 'A1' },
            { name: 'Front Foot Elevated Bulgarian Split Squats',    set_count: 1, rep_range: '8-10',  tempo: '0000', rest_seconds: 0,  notes: null, order_index: 2, superset_group: 'A1' },
            // Superset — knee activation
            { name: 'Banded TKE',         set_count: 2, rep_range: '15-20', tempo: '2010', rest_seconds: 0,   notes: null, order_index: 3, superset_group: 'B1' },
            { name: 'Poliquin Step-Up',   set_count: 2, rep_range: '10-12', tempo: '2010', rest_seconds: 0,   notes: null, order_index: 4, superset_group: 'B1' },
            // Main lifts
            { name: 'Barbell Hip Thrusts',                   set_count: 2, rep_range: '12-15', tempo: '2011', rest_seconds: 90,  notes: null, order_index: 5, superset_group: null },
            { name: 'Barbell Romanian Deadlifts',            set_count: 3, rep_range: '6',     tempo: '3110', rest_seconds: 150, notes: null, order_index: 6, superset_group: null },
            { name: 'Single Leg Leg Extension Machine',      set_count: 2, rep_range: '10-12', tempo: '3015', rest_seconds: 90,  notes: '5 second isometric hold at the top of each rep', order_index: 7, superset_group: null },
            { name: 'Flat Barbell Bench Press',              set_count: 3, rep_range: '3-5',   tempo: '3010', rest_seconds: 150, notes: null, order_index: 8, superset_group: null },
            { name: 'Pull Ups',                              set_count: 3, rep_range: '3-5',   tempo: '3010', rest_seconds: 150, notes: null, order_index: 9, superset_group: null },
            { name: 'Dumbbell Side Lateral Raises',          set_count: 2, rep_range: '10-12', tempo: '3010', rest_seconds: 90,  notes: null, order_index: 10, superset_group: null },
            // Superset — arm finisher
            { name: 'Behind-The-Back Dual Cable D-Handle Curls', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 90, notes: null, order_index: 11, superset_group: 'C1' },
            { name: 'Cross Body Tricep Extension',               set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 90, notes: null, order_index: 12, superset_group: 'C1' },
          ],
        })
      }

      return sessions
    },
  },

  // ── Template 31 — Base Accumulation ─────────────────────────────────────
  {
    id: 'base-accumulation',
    name: 'Base Accumulation',
    description: 'Six-session weekly block for athletes building aerobic base alongside strength. Three progressive runs (easy 10 km, easy-medium 13–15 km, long aerobic 18–22 km) alternate with three strength sessions (lower, upper, full GPP). Every session opens with the same CNS/mobility giant set to reinforce movement quality at high training volumes.',
    goal_type: 'athletic',
    phase: 'accumulation',
    default_weeks: 4,
    days_per_week: 6,
    difficulty: 'intermediate',
    icon: '🏃',
    color: 'from-sky-600 to-emerald-500',
    tags: ['base', 'accumulation', 'running', 'strength', 'gpp', 'aerobic', '6-day'],
    generateSessions(weeks = this.default_weeks) {
      const sessions = []

      // Shared running warmup giant set
      const run_warmup = [
        { name: 'Single leg hamstring bridge',         set_count: 1, rep_range: '6-8',  tempo: '0000', rest_seconds: 0, notes: null, order_index: 0, superset_group: 'A1' },
        { name: 'Copenhagen Plank',                    set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 0, notes: null, order_index: 1, superset_group: 'A1' },
        { name: 'Cossack Squat',                       set_count: 1, rep_range: '6-8',  tempo: '2010', rest_seconds: 0, notes: null, order_index: 2, superset_group: 'A1' },
        { name: 'Sprinter Lunge to RDL',               set_count: 1, rep_range: '6-8',  tempo: '2010', rest_seconds: 0, notes: null, order_index: 3, superset_group: 'A1' },
        { name: 'Pogo Hops',                           set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 0, notes: null, order_index: 4, superset_group: 'A1' },
      ]

      for (let week = 1; week <= weeks; week++) {
        // ── Run 1 — Easy 10 km ───────────────────────────────────────────────
        sessions.push({
          day_label: 'Run 1 — Easy 10 km',
          week_number: week,
          session_type: 'conditioning',
          exercises: [
            ...run_warmup.map(e => ({ ...e })),
            { name: 'Easy Run', set_count: 1, rep_range: '10km', tempo: '0000', rest_seconds: 150, notes: 'Easy zone 2 pace', order_index: 5, superset_group: null },
          ],
        })

        // ── Day 1 — Lower ────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 1 — Lower',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Single leg Bridge',                                         set_count: 1, rep_range: '5-6',   tempo: '0000', rest_seconds: 0,   notes: null, order_index: 0, superset_group: 'A1' },
            { name: 'Copenhagen Plank',                                          set_count: 1, rep_range: '30s',   tempo: '0000', rest_seconds: 0,   notes: null, order_index: 1, superset_group: 'A1' },
            { name: 'Front Foot Elevated Split Squat Contralaterally Loaded',    set_count: 1, rep_range: '6-8',   tempo: '3110', rest_seconds: 0,   notes: null, order_index: 2, superset_group: 'A1' },
            { name: 'Hanging Knee Raises',                                       set_count: 1, rep_range: '15-20', tempo: '3010', rest_seconds: 0,   notes: null, order_index: 3, superset_group: 'A1' },
            { name: 'Single Leg Pogo Hops',                                      set_count: 1, rep_range: '30',    tempo: '0000', rest_seconds: 0,   notes: null, order_index: 4, superset_group: 'A1' },
            // Superset — calf/hamstring primer
            { name: 'Seated Calf Raise',                                         set_count: 2, rep_range: '5-7',   tempo: '3210', rest_seconds: 45,  notes: null, order_index: 5, superset_group: 'B1' },
            { name: 'Seated Hamstring Curl',                                     set_count: 2, rep_range: '5-7',   tempo: '3010', rest_seconds: 120, notes: null, order_index: 6, superset_group: 'B1' },
            // Standalone
            { name: 'Barbell Hip Thrusts',                                       set_count: 2, rep_range: '12-15', tempo: '3011', rest_seconds: 90,  notes: null, order_index: 7, superset_group: null },
            // Superset — main lower compound
            { name: 'Barbell Front Squat',                                       set_count: 4, rep_range: '5-7',   tempo: '3110', rest_seconds: 60,  notes: null, order_index: 8, superset_group: 'C1' },
            { name: 'Cable Loaded Hip Airplane',                                 set_count: 4, rep_range: '5-7',   tempo: '3010', rest_seconds: 120, notes: null, order_index: 9, superset_group: 'C1' },
            // Accessories
            { name: 'Stiff Leg Dumbbell Romanian Deadlifts',                     set_count: 3, rep_range: '10-12', tempo: '3110', rest_seconds: 120, notes: null, order_index: 10, superset_group: null },
            { name: 'Walking Lunges',                                            set_count: 2, rep_range: '8-10',  tempo: '2010', rest_seconds: 90,  notes: null, order_index: 11, superset_group: null },
            { name: 'Leg Extensions',                                            set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 90,  notes: null, order_index: 12, superset_group: null },
          ],
        })

        // ── Run 2 — Easy-medium 13–15 km ────────────────────────────────────
        sessions.push({
          day_label: 'Run 2 — Easy-Medium 13–15 km',
          week_number: week,
          session_type: 'conditioning',
          exercises: [
            ...run_warmup.map(e => ({ ...e })),
            { name: 'Easy-Medium Run', set_count: 1, rep_range: '13-15km', tempo: '0000', rest_seconds: 150, notes: 'Easy to moderate aerobic pace', order_index: 5, superset_group: null },
          ],
        })

        // ── Day 2 — Upper ────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 2 — Upper',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Single leg Bridge',                                         set_count: 1, rep_range: '6-8',   tempo: '0000', rest_seconds: 0,   notes: null, order_index: 0, superset_group: 'A1' },
            { name: 'Copenhagen Plank',                                          set_count: 1, rep_range: '30s',   tempo: '0000', rest_seconds: 0,   notes: null, order_index: 1, superset_group: 'A1' },
            { name: 'Front Foot Elevated Split Squat Contralaterally Loaded',    set_count: 1, rep_range: '6-8',   tempo: '3210', rest_seconds: 0,   notes: null, order_index: 2, superset_group: 'A1' },
            { name: '45 Degree Side Bends',                                      set_count: 1, rep_range: '10-12', tempo: '3010', rest_seconds: 0,   notes: null, order_index: 3, superset_group: 'A1' },
            { name: 'Kneeling Cable Crunches',                                   set_count: 1, rep_range: '12-15', tempo: '3011', rest_seconds: 60,  notes: null, order_index: 4, superset_group: 'A1' },
            // Superset — horizontal push/pull
            { name: 'Flat Barbell Bench Press',                                  set_count: 4, rep_range: '6-8',   tempo: '3110', rest_seconds: 120, notes: null, order_index: 5, superset_group: 'B1' },
            { name: 'Prone Dumbbell Row',                                        set_count: 4, rep_range: '5-7',   tempo: '3010', rest_seconds: 120, notes: null, order_index: 6, superset_group: 'B1' },
            // Standalones — overhead + vertical pull
            { name: 'Overhead Barbell Press',                                    set_count: 3, rep_range: '6-8',   tempo: '3010', rest_seconds: 120, notes: null, order_index: 7, superset_group: null },
            { name: 'Pull Ups',                                                  set_count: 3, rep_range: '5-15',  tempo: '3010', rest_seconds: 120, notes: null, order_index: 8, superset_group: null },
            { name: 'Standing Unilateral Cable Lateral Raise',                   set_count: 2, rep_range: '10-15', tempo: '3110', rest_seconds: 90,  notes: null, order_index: 9, superset_group: null },
            // Superset — arm finisher
            { name: 'Cross Body Tricep Extension',                               set_count: 3, rep_range: '5-7',   tempo: '3010', rest_seconds: 90,  notes: null, order_index: 10, superset_group: 'C1' },
            { name: 'Behind-The-Back Dual Cable D-Handle Curls',                 set_count: 3, rep_range: '5-7',   tempo: '3010', rest_seconds: 90,  notes: null, order_index: 11, superset_group: 'C1' },
          ],
        })

        // ── Run 3 — Long aerobic 18–22 km ───────────────────────────────────
        sessions.push({
          day_label: 'Run 3 — Long Aerobic 18–22 km',
          week_number: week,
          session_type: 'conditioning',
          exercises: [
            ...run_warmup.map(e => ({ ...e })),
            { name: 'Long Aerobic Run', set_count: 1, rep_range: '18-22km', tempo: '0000', rest_seconds: 150, notes: 'Long slow distance — conversational pace', order_index: 5, superset_group: null },
          ],
        })

        // ── Day 3 — Full GPP ─────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 3 — Full GPP',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Kettlebell Arm Bar',                          set_count: 1, rep_range: '6-8',   tempo: '2010', rest_seconds: 0,   notes: null, order_index: 0, superset_group: 'A1' },
            { name: 'Copenhagen Plank',                            set_count: 1, rep_range: '30s',   tempo: '0000', rest_seconds: 0,   notes: null, order_index: 1, superset_group: 'A1' },
            { name: 'Kickstance RDL with Contralateral Load',      set_count: 1, rep_range: '6-8',   tempo: '2110', rest_seconds: 0,   notes: null, order_index: 2, superset_group: 'A1' },
            { name: 'Ab Roll Out',                                 set_count: 1, rep_range: '10-20', tempo: '3010', rest_seconds: 0,   notes: null, order_index: 3, superset_group: 'A1' },
            // Main work — single leg / hip strength
            { name: 'Cable Loaded Hip Airplane',                   set_count: 3, rep_range: '3-5',   tempo: '3010', rest_seconds: 150, notes: null, order_index: 4, superset_group: null },
            { name: 'Bulgarian Split Squat',                       set_count: 3, rep_range: '5-7',   tempo: '3210', rest_seconds: 150, notes: null, order_index: 5, superset_group: null },
            // Superset — unilateral hip hinge + adductor
            { name: 'Single Leg Landmine RDL',                     set_count: 3, rep_range: '5-7',   tempo: '2010', rest_seconds: 45,  notes: null, order_index: 6, superset_group: 'B1' },
            { name: 'Full Copenhagen Plank',                       set_count: 3, rep_range: '8-10',  tempo: '0000', rest_seconds: 90,  notes: null, order_index: 7, superset_group: 'B1' },
            // Accessories
            { name: 'Prone Hamstring Curl - Two Up One Down',      set_count: 3, rep_range: '5-7',   tempo: '3010', rest_seconds: 120, notes: null, order_index: 8, superset_group: null },
            { name: 'Single Leg 45 Degree Back Extension',         set_count: 2, rep_range: '8-10',  tempo: '3010', rest_seconds: 90,  notes: null, order_index: 9, superset_group: null },
            { name: 'DB Single Leg Calf Raise',                    set_count: 2, rep_range: '10-15', tempo: '3210', rest_seconds: 90,  notes: 'Hold for 20 seconds in the stretch position at the end of each set', order_index: 10, superset_group: null },
          ],
        })
      }

      return sessions
    },
  },

  // ── Template 32 — Bikini Focus, Delts & Glutes ───────────────────────────
  {
    id: 'bikini-focus-delts-glutes',
    name: 'Bikini Focus — Delts & Glutes',
    description: 'Four-day upper/lower split engineered for bikini physique development. Upper days are shoulder-dominant — no horizontal pressing — using unilateral cable and dumbbell work to build cap-shaped delts and a wide, pulled-in back. Lower days prioritise glute hypertrophy through hip thrusts, hip-dominant leg press and loaded hip hinge variations.',
    goal_type: 'hypertrophy',
    phase: 'accumulation',
    default_weeks: 4,
    days_per_week: 4,
    difficulty: 'intermediate',
    icon: '✨',
    color: 'from-pink-500 to-rose-400',
    tags: ['bikini', 'glutes', 'delts', 'upper-lower', 'female', '4-day'],
    generateSessions(weeks = this.default_weeks) {
      const sessions = []

      // Shared KB shoulder warmup superset
      const warmup_upper = [
        { name: 'Kettlebell Windmill',       set_count: 1, rep_range: '6-8', tempo: '3010', rest_seconds: 30, notes: null, order_index: 0, superset_group: 'A1' },
        { name: 'Kettlebell Bottom-up Press', set_count: 1, rep_range: '6-8', tempo: '3010', rest_seconds: 30, notes: null, order_index: 1, superset_group: 'A1' },
      ]

      for (let week = 1; week <= weeks; week++) {
        // ── Upper 1 ──────────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Upper 1 — Delts & Back',
          week_number: week,
          session_type: 'strength',
          exercises: [
            ...warmup_upper.map(e => ({ ...e })),
            { name: 'Single Arm Rear Delt Cable Fly',           set_count: 2, rep_range: '10-15', tempo: '2021', rest_seconds: 45, notes: null, order_index: 2, superset_group: null },
            { name: 'Single Arm Straight Arm Lat Pulldown',     set_count: 2, rep_range: '10-15', tempo: '3021', rest_seconds: 45, notes: null, order_index: 3, superset_group: null },
            { name: 'Half Kneeling Landmine Press',             set_count: 2, rep_range: '6-10',  tempo: '3021', rest_seconds: 45, notes: null, order_index: 4, superset_group: null },
            { name: 'Single Arm Cable Lateral Raise',           set_count: 2, rep_range: '12-15', tempo: '3021', rest_seconds: 45, notes: null, order_index: 5, superset_group: null },
            { name: 'Single Arm Reverse Pec Deck',              set_count: 2, rep_range: '12-15', tempo: '3021', rest_seconds: 45, notes: null, order_index: 6, superset_group: null },
            { name: 'Dumbbell Lateral Raise',                   set_count: 2, rep_range: '10-15', tempo: '3021', rest_seconds: 90, notes: null, order_index: 7, superset_group: null },
          ],
        })

        // ── Lower 1 ──────────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Lower 1 — Glutes & Quads',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Single Leg Hamstring Bridge Iso (Foam Roller)', set_count: 1, rep_range: '6-8',  tempo: '0000', rest_seconds: 30, notes: null, order_index: 0, superset_group: 'A1' },
            { name: 'Straight Leg Copenhagen Plank',                 set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 30, notes: null, order_index: 1, superset_group: 'A1' },
            { name: 'Kickstance RDL with Contralateral Load',        set_count: 1, rep_range: '10-12',tempo: '3210', rest_seconds: 30, notes: null, order_index: 2, superset_group: 'A1' },
            { name: 'Single Leg Pogo Hops',                          set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 30, notes: null, order_index: 3, superset_group: 'A1' },
            { name: 'Max Effort Vertical Jump',                      set_count: 1, rep_range: '5',    tempo: '0000', rest_seconds: 30, notes: null, order_index: 4, superset_group: 'A1' },
            // Main work
            { name: 'Cable Glute Kickback (on plate)',  set_count: 2, rep_range: '12-15', tempo: '3021', rest_seconds: 45,  notes: null, order_index: 5, superset_group: null },
            { name: 'Barbell Hip Thrusts',              set_count: 2, rep_range: '15-20', tempo: '2012', rest_seconds: 90,  notes: null, order_index: 6, superset_group: null },
            { name: 'Smith Machine Squat',              set_count: 3, rep_range: '6-10',  tempo: '3120', rest_seconds: 120, notes: null, order_index: 7, superset_group: null },
            { name: 'Smith Machine Reverse Deficit Lunges', set_count: 2, rep_range: '10-12', tempo: '2120', rest_seconds: 90, notes: null, order_index: 8, superset_group: null },
            { name: '45 Degree Leg Press (Hip Dominant)', set_count: 2, rep_range: '10-15', tempo: '3210', rest_seconds: 120, notes: null, order_index: 9, superset_group: null },
            { name: 'Seated Hamstring Curl',            set_count: 2, rep_range: '10-15', tempo: '3120', rest_seconds: 90,  notes: null, order_index: 10, superset_group: null },
            { name: 'Seated Calf Raise',                set_count: 2, rep_range: '10-15', tempo: '3212', rest_seconds: 90,  notes: null, order_index: 11, superset_group: null },
          ],
        })

        // ── Upper 2 ──────────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Upper 2 — Back & Delts',
          week_number: week,
          session_type: 'strength',
          exercises: [
            ...warmup_upper.map(e => ({ ...e })),
            { name: 'Single Arm Rear Delt Cable Fly',       set_count: 2, rep_range: '10-15', tempo: '2021', rest_seconds: 45, notes: null, order_index: 2, superset_group: null },
            { name: 'Single Arm Straight Arm Lat Pulldown', set_count: 2, rep_range: '10-15', tempo: '3021', rest_seconds: 45, notes: null, order_index: 3, superset_group: null },
            { name: 'Cable Single Arm High to Low Row',     set_count: 2, rep_range: '12-15', tempo: '3021', rest_seconds: 45, notes: null, order_index: 4, superset_group: null },
            { name: 'Dumbbell Bentover Row',                set_count: 2, rep_range: '6-10',  tempo: '3021', rest_seconds: 90, notes: null, order_index: 5, superset_group: null },
            { name: 'Half Kneeling Single Arm Cable Row',   set_count: 2, rep_range: '10-12', tempo: '3021', rest_seconds: 45, notes: null, order_index: 6, superset_group: null },
            { name: 'Single Arm Cable Lateral Raise',       set_count: 2, rep_range: '12-15', tempo: '3021', rest_seconds: 45, notes: null, order_index: 7, superset_group: null },
          ],
        })

        // ── Lower 2 ──────────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Lower 2 — Hamstrings & Glutes',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Single Leg Hamstring Bridge Iso (Foam Roller)', set_count: 1, rep_range: '6-8',  tempo: '0000', rest_seconds: 30, notes: null, order_index: 0, superset_group: 'A1' },
            { name: 'Full Copenhagen Plank',                         set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 30, notes: null, order_index: 1, superset_group: 'A1' },
            { name: 'Kickstance RDL with Contralateral Load',        set_count: 1, rep_range: '8-10', tempo: '2110', rest_seconds: 30, notes: null, order_index: 2, superset_group: 'A1' },
            { name: 'Single Leg Pogo Hops',                          set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 30, notes: null, order_index: 3, superset_group: 'A1' },
            { name: 'Max Effort Vertical Jump',                      set_count: 1, rep_range: '5',    tempo: '0000', rest_seconds: 60, notes: null, order_index: 4, superset_group: 'A1' },
            // Superset — hamstring/adductor pump
            { name: 'Prone Hamstring Curl Machine', set_count: 2, rep_range: '10-15', tempo: '3021', rest_seconds: 45,  notes: null, order_index: 5, superset_group: 'B1' },
            { name: 'Hip Adductor',                 set_count: 2, rep_range: '10-15', tempo: '3021', rest_seconds: 45,  notes: null, order_index: 6, superset_group: 'B1' },
            // Main work
            { name: 'Barbell Romanian Deadlifts',   set_count: 2, rep_range: '6-10',  tempo: '3120', rest_seconds: 150, notes: null, order_index: 7,  superset_group: null },
            { name: 'Smith Machine Step Up',        set_count: 2, rep_range: '10-12', tempo: '3010', rest_seconds: 90,  notes: null, order_index: 8,  superset_group: null },
            { name: 'Single Leg Landmine RDL',      set_count: 2, rep_range: '10-12', tempo: '2010', rest_seconds: 90,  notes: null, order_index: 9,  superset_group: null },
            { name: 'Leg Extensions',               set_count: 2, rep_range: '10-15', tempo: '3021', rest_seconds: 90,  notes: null, order_index: 10, superset_group: null },
            { name: 'Pendulum Squat',               set_count: 2, rep_range: '6-10',  tempo: '3120', rest_seconds: 120, notes: null, order_index: 11, superset_group: null },
            { name: 'Standing Smith Machine Calf Raise', set_count: 2, rep_range: '10-15', tempo: '3210', rest_seconds: 90, notes: null, order_index: 12, superset_group: null },
          ],
        })
      }

      return sessions
    },
  },

  // ── Template 33 — Bodyweight Travel ──────────────────────────────────────
  {
    id: 'bodyweight-travel',
    name: 'Bodyweight Travel',
    description: 'Minimal-equipment full-body programme built around bodyweight and light dumbbells. Three circuit-style resistance days plus one active recovery run day.',
    goal: 'recomp',
    difficulty: 'intermediate',
    days_per_week: 4,
    duration_weeks: 4,
    generateSessions(weeks = 4) {
      const sessions = []
      for (let week = 1; week <= weeks; week++) {

        // ── Day 1 ────────────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 1 — Full Body A',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: "World's Greatest Stretch",       set_count: 1, rep_range: '5',    tempo: '0000', rest_seconds: 30,  notes: null, order_index: 0,  superset_group: 'A1' },
            { name: 'Push Ups',                       set_count: 1, rep_range: '8-10', tempo: '2010', rest_seconds: 30,  notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Deadbugs',                       set_count: 1, rep_range: '8-10', tempo: '0000', rest_seconds: 30,  notes: null, order_index: 2,  superset_group: 'A1' },
            { name: 'Side Plank with Hip Lift',       set_count: 1, rep_range: '8-10', tempo: '1010', rest_seconds: 60,  notes: null, order_index: 3,  superset_group: 'A1' },
            // Superset 1 — lower push / core
            { name: 'Single Leg Bridge Iso',          set_count: 3, rep_range: '30s',  tempo: '0000', rest_seconds: 30,  notes: null, order_index: 4,  superset_group: 'B1' },
            { name: 'Jump Lunges',                    set_count: 3, rep_range: '10-12',tempo: '0000', rest_seconds: 30,  notes: null, order_index: 5,  superset_group: 'B1' },
            { name: 'Forearm Plank',                  set_count: 3, rep_range: '30s',  tempo: '0000', rest_seconds: 60,  notes: null, order_index: 6,  superset_group: 'B1' },
            // Superset 2 — cardio circuit
            { name: 'Mountain Climber',               set_count: 3, rep_range: '20',   tempo: '0000', rest_seconds: 30,  notes: null, order_index: 7,  superset_group: 'C1' },
            { name: 'Burpee',                         set_count: 3, rep_range: '10',   tempo: '0000', rest_seconds: 60,  notes: null, order_index: 8,  superset_group: 'C1' },
            // Superset 3 — upper
            { name: 'Inverted Row',                   set_count: 3, rep_range: '8-12', tempo: '2010', rest_seconds: 30,  notes: null, order_index: 9,  superset_group: 'D1' },
            { name: 'Tricep Dips',                    set_count: 3, rep_range: '10-15',tempo: '2010', rest_seconds: 60,  notes: null, order_index: 10, superset_group: 'D1' },
            // Finisher
            { name: 'Steady State Cardio',            set_count: 1, rep_range: '20min',tempo: '0000', rest_seconds: 0,   notes: 'Low intensity — walk or light jog', order_index: 11, superset_group: null },
          ],
        })

        // ── Day 2 ────────────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 2 — Full Body B',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Inchworm',                       set_count: 1, rep_range: '5',    tempo: '0000', rest_seconds: 30,  notes: null, order_index: 0,  superset_group: 'A1' },
            { name: 'Squat to T-Rotation',            set_count: 1, rep_range: '8-10', tempo: '0000', rest_seconds: 30,  notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Side Plank Rotations',           set_count: 1, rep_range: '8-10', tempo: '1010', rest_seconds: 30,  notes: null, order_index: 2,  superset_group: 'A1' },
            { name: 'Prone Shoulder Swimmers',        set_count: 1, rep_range: '10',   tempo: '1010', rest_seconds: 60,  notes: null, order_index: 3,  superset_group: 'A1' },
            // Superset 1 — lower push / core
            { name: 'Plank to Push Up',               set_count: 3, rep_range: '8-10', tempo: '2010', rest_seconds: 30,  notes: null, order_index: 4,  superset_group: 'B1' },
            { name: 'DB Walking Lunge',               set_count: 3, rep_range: '10-12',tempo: '2010', rest_seconds: 60,  notes: null, order_index: 5,  superset_group: 'B1' },
            // Superset 2 — plyometric circuit
            { name: '3 Part Squat Jump',              set_count: 3, rep_range: '10',   tempo: '0000', rest_seconds: 30,  notes: null, order_index: 6,  superset_group: 'C1' },
            { name: 'Bear Crawl',                     set_count: 3, rep_range: '20m',  tempo: '0000', rest_seconds: 60,  notes: null, order_index: 7,  superset_group: 'C1' },
            // Standalone
            { name: 'Push Up to T Rotation',          set_count: 3, rep_range: '8-10', tempo: '2010', rest_seconds: 60,  notes: null, order_index: 8,  superset_group: null },
            // Superset 3 — upper
            { name: 'DB Bent Over Row',               set_count: 3, rep_range: '10-12',tempo: '2011', rest_seconds: 30,  notes: null, order_index: 9,  superset_group: 'D1' },
            { name: 'Tricep Dips',                    set_count: 3, rep_range: '10-15',tempo: '2010', rest_seconds: 60,  notes: null, order_index: 10, superset_group: 'D1' },
            // Finisher
            { name: 'Steady State Cardio',            set_count: 1, rep_range: '20min',tempo: '0000', rest_seconds: 0,   notes: 'Low intensity — walk or light jog', order_index: 11, superset_group: null },
          ],
        })

        // ── Day 3 ────────────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 3 — Full Body C',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Get Ups',                        set_count: 1, rep_range: '5',    tempo: '0000', rest_seconds: 30,  notes: null, order_index: 0,  superset_group: 'A1' },
            { name: 'Reverse Crunches',               set_count: 1, rep_range: '10-12',tempo: '2010', rest_seconds: 30,  notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Deep Lunge to T-Rotation',       set_count: 1, rep_range: '8-10', tempo: '0000', rest_seconds: 30,  notes: null, order_index: 2,  superset_group: 'A1' },
            { name: 'Forearm Plank Rotations',        set_count: 1, rep_range: '10',   tempo: '1010', rest_seconds: 60,  notes: null, order_index: 3,  superset_group: 'A1' },
            // Superset 1 — upper/lower combo
            { name: 'Explosive Push Ups',             set_count: 3, rep_range: '6-8',  tempo: '0000', rest_seconds: 30,  notes: null, order_index: 4,  superset_group: 'B1' },
            { name: 'Reverse Lunge',                  set_count: 3, rep_range: '10-12',tempo: '2010', rest_seconds: 60,  notes: null, order_index: 5,  superset_group: 'B1' },
            // Superset 2 — plyometric circuit
            { name: '3 Part Squat Jump',              set_count: 3, rep_range: '10',   tempo: '0000', rest_seconds: 30,  notes: null, order_index: 6,  superset_group: 'C1' },
            { name: 'Bear Crawl Shoulder Tap',        set_count: 3, rep_range: '20',   tempo: '0000', rest_seconds: 60,  notes: null, order_index: 7,  superset_group: 'C1' },
            // Standalone
            { name: 'Push Up to Downdog',             set_count: 3, rep_range: '8-10', tempo: '2010', rest_seconds: 60,  notes: null, order_index: 8,  superset_group: null },
            // Superset 3 — upper
            { name: 'DB Bent Over Row',               set_count: 3, rep_range: '10-12',tempo: '2011', rest_seconds: 30,  notes: null, order_index: 9,  superset_group: 'D1' },
            { name: 'Close Grip Push Ups',            set_count: 3, rep_range: '10-15',tempo: '2010', rest_seconds: 60,  notes: null, order_index: 10, superset_group: 'D1' },
            // Finisher
            { name: 'Steady State Cardio',            set_count: 1, rep_range: '20min',tempo: '0000', rest_seconds: 0,   notes: 'Low intensity — walk or light jog', order_index: 11, superset_group: null },
          ],
        })

        // ── Run Day ──────────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Run Day — Active Recovery',
          week_number: week,
          session_type: 'cardio',
          exercises: [
            { name: 'Single Leg Hamstring Bridge',    set_count: 2, rep_range: '10-12',tempo: '1010', rest_seconds: 30,  notes: 'Pre-run activation', order_index: 0, superset_group: null },
            { name: 'Side to Side Squat',             set_count: 2, rep_range: '10',   tempo: '1010', rest_seconds: 30,  notes: null, order_index: 1, superset_group: null },
            { name: 'Pogo Hops',                      set_count: 2, rep_range: '20',   tempo: '0000', rest_seconds: 30,  notes: null, order_index: 2, superset_group: null },
            { name: 'Lateral Pogo Hops',              set_count: 2, rep_range: '20',   tempo: '0000', rest_seconds: 30,  notes: null, order_index: 3, superset_group: null },
          ],
        })
      }

      return sessions
    },
  },

  // ── Template 34 — Built Powerful ─────────────────────────────────────────
  {
    id: 'built-powerful',
    name: 'Built Powerful',
    description: '5-session power-focused programme: Lower Power, Upper Power, Plyometrics, Full Body, and HIIT. Every session opens with a CNS-priming giant set and builds to explosive or heavy compound work.',
    goal: 'strength',
    difficulty: 'advanced',
    days_per_week: 5,
    duration_weeks: 4,
    generateSessions(weeks = 4) {
      const sessions = []
      for (let week = 1; week <= weeks; week++) {

        // ── Lower Power ───────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Lower Power',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // CNS warmup giant set (1 round)
            { name: 'Single Leg Hamstring Bridge',       set_count: 1, rep_range: '6-8',  tempo: '0000', rest_seconds: 0,   notes: null, order_index: 0,  superset_group: 'A1' },
            { name: 'Copenhagen Plank',                  set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 0,   notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Kickstance RDL with CL Load',       set_count: 1, rep_range: '6-8',  tempo: '2110', rest_seconds: 0,   notes: null, order_index: 2,  superset_group: 'A1' },
            { name: 'Single Leg Pogo Hops',              set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 0,   notes: null, order_index: 3,  superset_group: 'A1' },
            { name: 'Max Effort Vertical Jump',          set_count: 1, rep_range: '5-6',  tempo: '2010', rest_seconds: 60,  notes: null, order_index: 4,  superset_group: 'A1' },
            // Superset — calf/hamstring activation
            { name: 'Seated Calf Raise',                 set_count: 2, rep_range: '12-15',tempo: '3210', rest_seconds: 60,  notes: null, order_index: 5,  superset_group: 'B1' },
            { name: 'Seated Hamstring Curl',             set_count: 2, rep_range: '10-15',tempo: '3010', rest_seconds: 90,  notes: null, order_index: 6,  superset_group: 'B1' },
            // Main lifts
            { name: 'Barbell Box Squat',                 set_count: 3, rep_range: '6',    tempo: '3110', rest_seconds: 150, notes: null, order_index: 7,  superset_group: null },
            { name: 'Trap Bar Deadlift',                 set_count: 3, rep_range: '6',    tempo: '3010', rest_seconds: 150, notes: null, order_index: 8,  superset_group: null },
            { name: 'B Stance Hip Thrust',               set_count: 4, rep_range: '6',    tempo: '3011', rest_seconds: 90,  notes: null, order_index: 9,  superset_group: null },
            { name: 'Dumbbell Explosive Lateral Step',   set_count: 3, rep_range: '6',    tempo: '2010', rest_seconds: 90,  notes: null, order_index: 10, superset_group: null },
          ],
        })

        // ── Upper Power ───────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Upper Power',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // CNS warmup giant set (1 round)
            { name: 'Kettlebell Windmill',               set_count: 1, rep_range: '6',    tempo: '2010', rest_seconds: 0,   notes: null, order_index: 0,  superset_group: 'A1' },
            { name: 'Hanging Leg/Knee Raises',           set_count: 1, rep_range: '15-20',tempo: '3021', rest_seconds: 0,   notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Deficit Push Ups',                  set_count: 1, rep_range: '10-12',tempo: '3010', rest_seconds: 0,   notes: null, order_index: 2,  superset_group: 'A1' },
            { name: 'Ab Roll Out',                       set_count: 1, rep_range: '10-15',tempo: '3010', rest_seconds: 60,  notes: null, order_index: 3,  superset_group: 'A1' },
            // Main lifts
            { name: 'Pull Ups',                          set_count: 3, rep_range: '15-20',tempo: '2010', rest_seconds: 150, notes: null, order_index: 4,  superset_group: null },
            { name: 'Tricep Dips',                       set_count: 4, rep_range: '6',    tempo: '3010', rest_seconds: 120, notes: null, order_index: 5,  superset_group: null },
            { name: 'TRX / Ring Rows',                   set_count: 3, rep_range: '15-20',tempo: '2010', rest_seconds: 90,  notes: null, order_index: 6,  superset_group: null },
            { name: 'Half Kneeling Single Arm Rotational Press', set_count: 3, rep_range: '6', tempo: '2010', rest_seconds: 60, notes: null, order_index: 7, superset_group: null },
            // Superset — arms
            { name: 'Behind-The-Back Dual Cable D-Handle Curls', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: null, order_index: 8, superset_group: 'B1' },
            { name: 'Dumbbell Skullcrushers',            set_count: 3, rep_range: '10-12',tempo: '3010', rest_seconds: 60,  notes: null, order_index: 9,  superset_group: 'B1' },
          ],
        })

        // ── Plyometrics ───────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Plyometrics',
          week_number: week,
          session_type: 'conditioning',
          exercises: [
            // Plyometric giant set (2 rounds)
            { name: 'Alternate Leg Bounds',              set_count: 2, rep_range: '6',    tempo: '1010', rest_seconds: 0,   notes: null, order_index: 0,  superset_group: 'A1' },
            { name: 'Single Pogo Hops',                  set_count: 2, rep_range: '30s',  tempo: '0000', rest_seconds: 0,   notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Lateral Pogo Hops',                 set_count: 2, rep_range: '30s',  tempo: '0000', rest_seconds: 0,   notes: null, order_index: 2,  superset_group: 'A1' },
            { name: 'Sprinter Lunge to RDL',             set_count: 2, rep_range: '6',    tempo: '2010', rest_seconds: 60,  notes: null, order_index: 3,  superset_group: 'A1' },
            // Strength/power work
            { name: 'Cossack Squat',                     set_count: 2, rep_range: '6-8',  tempo: '2010', rest_seconds: 60,  notes: null, order_index: 4,  superset_group: null },
            { name: 'Treadmill Running',                  set_count: 13, rep_range: '30s', tempo: '0000', rest_seconds: 60,  notes: 'HIIT intervals — sprint effort each set', order_index: 5, superset_group: null },
            { name: 'Bulgarian Split Squat Jumps',       set_count: 4, rep_range: '6',    tempo: '2010', rest_seconds: 120, notes: null, order_index: 6,  superset_group: null },
            { name: 'Banded Hamstring Tantum',           set_count: 3, rep_range: '30',   tempo: '0000', rest_seconds: 90,  notes: null, order_index: 7,  superset_group: null },
          ],
        })

        // ── Full Body ─────────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Full Body',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // CNS warmup giant set (1 round)
            { name: 'Kettlebell Windmill',               set_count: 1, rep_range: '6-8',  tempo: '3010', rest_seconds: 0,   notes: null, order_index: 0,  superset_group: 'A1' },
            { name: 'Hanging Knee Raise',                set_count: 1, rep_range: '15-20',tempo: '3010', rest_seconds: 0,   notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Ab Rollout',                        set_count: 1, rep_range: '10-12',tempo: '0000', rest_seconds: 0,   notes: null, order_index: 2,  superset_group: 'A1' },
            { name: 'Deficit Push Ups',                  set_count: 1, rep_range: '10-12',tempo: '2110', rest_seconds: 60,  notes: null, order_index: 3,  superset_group: 'A1' },
            // Power primer
            { name: 'Double DB Snatch / Heavy Kettlebell Swing', set_count: 1, rep_range: '6-8', tempo: '2010', rest_seconds: 90, notes: 'Primer — focus on speed and intent', order_index: 4, superset_group: null },
            // Main lifts
            { name: 'Power Clean',                       set_count: 4, rep_range: '3',    tempo: '2010', rest_seconds: 150, notes: null, order_index: 5,  superset_group: null },
            { name: 'Barbell Front Squat',               set_count: 3, rep_range: '3',    tempo: '3110', rest_seconds: 150, notes: null, order_index: 6,  superset_group: null },
            // Superset — upper pull/power
            { name: 'High Pull Up',                      set_count: 3, rep_range: '3',    tempo: '2010', rest_seconds: 45,  notes: null, order_index: 7,  superset_group: 'B1' },
            { name: 'Med Ball Slams',                    set_count: 3, rep_range: '3',    tempo: '1010', rest_seconds: 90,  notes: null, order_index: 8,  superset_group: 'B1' },
            // Accessories
            { name: 'Plyo Step Ups',                     set_count: 3, rep_range: '6',    tempo: '2010', rest_seconds: 90,  notes: null, order_index: 9,  superset_group: null },
            { name: 'Kettlebell Hike to Swing',          set_count: 3, rep_range: '6',    tempo: '2010', rest_seconds: 90,  notes: null, order_index: 10, superset_group: null },
          ],
        })

        // ── HIIT ──────────────────────────────────────────────────────────────
        sessions.push({
          day_label: 'HIIT',
          week_number: week,
          session_type: 'conditioning',
          exercises: [
            // Warmup giant set
            { name: 'Single Leg Hamstring Bridge Iso (Foam Roller)', set_count: 1, rep_range: '6-8', tempo: '0000', rest_seconds: 0, notes: null, order_index: 0, superset_group: 'A1' },
            { name: 'Copenhagen Plank',                  set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 0,   notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Sprinter Lunge to RDL',             set_count: 2, rep_range: '6',    tempo: '2010', rest_seconds: 60,  notes: null, order_index: 2,  superset_group: 'A1' },
            // Superset — hamstring/plyometric activation
            { name: 'Banded Hamstring Tantum',           set_count: 2, rep_range: '30',   tempo: '0000', rest_seconds: 0,   notes: null, order_index: 3,  superset_group: 'B1' },
            { name: 'Single Leg Pogo Hops',              set_count: 2, rep_range: '30s',  tempo: '0000', rest_seconds: 60,  notes: null, order_index: 4,  superset_group: 'B1' },
            // HIIT cardio
            { name: 'Treadmill Running',                  set_count: 13, rep_range: '30s', tempo: '0000', rest_seconds: 60,  notes: 'HIIT intervals — max effort each sprint', order_index: 5, superset_group: null },
            // Power superset
            { name: 'One Arm Dumbbell Snatch',           set_count: 3, rep_range: '6',    tempo: '1010', rest_seconds: 30,  notes: null, order_index: 6,  superset_group: 'C1' },
            { name: 'Lateral Step Up to High Knee',      set_count: 3, rep_range: '6',    tempo: '1010', rest_seconds: 60,  notes: null, order_index: 7,  superset_group: 'C1' },
            // Superset — core/power finisher
            { name: 'Med Ball Slams',                    set_count: 3, rep_range: '6',    tempo: '2010', rest_seconds: 0,   notes: null, order_index: 8,  superset_group: 'D1' },
            { name: 'Hanging Knee Tuck',                 set_count: 3, rep_range: '10-12',tempo: '2010', rest_seconds: 60,  notes: null, order_index: 9,  superset_group: 'D1' },
          ],
        })
      }

      return sessions
    },
  },

  // ── Template 35 — Condition ───────────────────────────────────────────────
  {
    id: 'condition',
    name: 'Condition',
    description: '4-day upper/lower conditioning split using giant sets with isometric integration. Each giant set pairs two dynamic exercises with a third isometric hold to deepen neuromuscular conditioning.',
    goal: 'recomp',
    difficulty: 'intermediate',
    days_per_week: 4,
    duration_weeks: 4,
    generateSessions(weeks = 4) {
      const sessions = []
      for (let week = 1; week <= weeks; week++) {

        // ── Day 1 — Quads, Chest, Shoulders & Triceps ────────────────────────
        sessions.push({
          day_label: 'Day 1 — Quads, Chest, Shoulders & Triceps',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Thread the Needle',                               set_count: 1, rep_range: '4',    tempo: '0000', rest_seconds: 0,  notes: null, order_index: 0,  superset_group: 'A1' },
            { name: 'Face Pulls',                                      set_count: 1, rep_range: '6',    tempo: '0000', rest_seconds: 0,  notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Lat PNF Stretch',                                 set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 0,  notes: null, order_index: 2,  superset_group: 'A1' },
            { name: 'Cable External Rotation at 90° Abduction',        set_count: 1, rep_range: '10-12',tempo: '0000', rest_seconds: 0,  notes: null, order_index: 3,  superset_group: 'A1' },
            { name: 'Flat Dumbbell Floor Press',                       set_count: 1, rep_range: '8-10', tempo: '0000', rest_seconds: 60, notes: null, order_index: 4,  superset_group: 'A1' },
            // Quad giant set — dynamic + isometric
            { name: 'Leg Extensions',                                  set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 5,  superset_group: 'B1' },
            { name: 'Sissy Squat',                                     set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 6,  superset_group: 'B1' },
            { name: 'Leg Press / Pendulum / Hack Squat',               set_count: 3, rep_range: '8-10', tempo: '0000', rest_seconds: 90, notes: null, order_index: 7,  superset_group: 'B1' },
            // Push giant set — dynamic + isometric
            { name: 'Banded Push-Up',                                  set_count: 3, rep_range: '8-10', tempo: '0000', rest_seconds: 0,  notes: null, order_index: 8,  superset_group: 'C1' },
            { name: 'Regular Push Up',                                 set_count: 3, rep_range: '8-10', tempo: '0000', rest_seconds: 0,  notes: null, order_index: 9,  superset_group: 'C1' },
            { name: 'Banded Push Up Isometric',                        set_count: 3, rep_range: '5',    tempo: '0000', rest_seconds: 90, notes: 'Hold at bottom for 5s', order_index: 10, superset_group: 'C1' },
            // Shoulder giant set — dynamic + isometric
            { name: 'Dumbbell Y Raises',                               set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 11, superset_group: 'D1' },
            { name: 'Cable Crucifix Raise',                            set_count: 3, rep_range: '8-10', tempo: '0000', rest_seconds: 0,  notes: null, order_index: 12, superset_group: 'D1' },
            { name: 'Dumbbell Y Raise Isometric',                      set_count: 3, rep_range: '5',    tempo: '0000', rest_seconds: 90, notes: 'Hold at top for 5s', order_index: 13, superset_group: 'D1' },
            // Tricep giant set — dynamic + isometric
            { name: 'Standing Tricep Extension on Cable Machine',      set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 14, superset_group: 'E1' },
            { name: 'Cable Cross Body Tricep Extensions',              set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 15, superset_group: 'E1' },
            { name: 'Standing Isometric Tricep Extension on Cable',    set_count: 3, rep_range: '5',    tempo: '0000', rest_seconds: 90, notes: 'Hold in contracted position for 5s', order_index: 16, superset_group: 'E1' },
          ],
        })

        // ── Day 2 — Glutes, Hamstrings, Back & Rear Delts ────────────────────
        sessions.push({
          day_label: 'Day 2 — Glutes, Hamstrings, Back & Rear Delts',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Plank',                                           set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 0,  notes: null, order_index: 0,  superset_group: 'A1' },
            { name: 'Copenhagen Plank',                                set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 0,  notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Bear Crawl',                                      set_count: 1, rep_range: '20m',  tempo: '0000', rest_seconds: 60, notes: null, order_index: 2,  superset_group: 'A1' },
            // Glute/ham giant set
            { name: 'Barbell Hip Thrusts',                             set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 3,  superset_group: 'B1' },
            { name: 'Dumbbell Romanian Deadlifts',                     set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 4,  superset_group: 'B1' },
            { name: 'Machine Leg Press',                               set_count: 3, rep_range: '15-20',tempo: '0000', rest_seconds: 120,notes: 'High foot placement for glute emphasis', order_index: 5, superset_group: 'B1' },
            // Hamstring giant set
            { name: 'Nordic Hamstring Curl',                           set_count: 3, rep_range: '8-10', tempo: '0000', rest_seconds: 0,  notes: null, order_index: 6,  superset_group: 'C1' },
            { name: 'Glute Ham Raise',                                 set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 7,  superset_group: 'C1' },
            { name: '45° Back Extension',                              set_count: 3, rep_range: '12-15',tempo: '0000', rest_seconds: 90, notes: null, order_index: 8,  superset_group: 'C1' },
            // Back giant set
            { name: 'Seated Wide Grip Row',                            set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 9,  superset_group: 'D1' },
            { name: 'Wide Grip Lat Pulldown',                          set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 10, superset_group: 'D1' },
            { name: 'Straight Arm Pulldown',                           set_count: 3, rep_range: '12-15',tempo: '0000', rest_seconds: 90, notes: null, order_index: 11, superset_group: 'D1' },
            // Rear delt giant set — dynamic + dropset + isometric
            { name: 'Rear Delt Row',                                   set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 12, superset_group: 'E1' },
            { name: 'Rear Delt Row Dropset',                           set_count: 1, rep_range: '12-15',tempo: '0000', rest_seconds: 0,  notes: 'Drop 30% and continue', order_index: 13, superset_group: 'E1' },
            { name: 'Rear Delt Row Isometric',                         set_count: 3, rep_range: '5',    tempo: '0000', rest_seconds: 90, notes: 'Hold at peak contraction for 5s', order_index: 14, superset_group: 'E1' },
            // Bicep giant set — dynamic + isometric
            { name: 'Scott Narrow Grip Barbell Curl',                  set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 15, superset_group: 'F1' },
            { name: 'Single Arm Incline Bench DB Preacher Curl',       set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 16, superset_group: 'F1' },
            { name: 'Scott Narrow Grip Barbell Curl Isometric',        set_count: 3, rep_range: '5',    tempo: '0000', rest_seconds: 90, notes: 'Hold at 90° for 5s', order_index: 17, superset_group: 'F1' },
          ],
        })

        // ── Day 3 — Chest, Shoulders, Triceps & Quads ────────────────────────
        sessions.push({
          day_label: 'Day 3 — Chest, Shoulders, Triceps & Quads',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Pigeon Pose',                                     set_count: 1, rep_range: '60s',  tempo: '0000', rest_seconds: 0,  notes: 'Each side', order_index: 0, superset_group: 'A1' },
            { name: 'Couch Stretch',                                   set_count: 1, rep_range: '60s',  tempo: '0000', rest_seconds: 0,  notes: 'Each side', order_index: 1, superset_group: 'A1' },
            { name: 'Frog Pose',                                       set_count: 1, rep_range: '60s',  tempo: '0000', rest_seconds: 60, notes: null, order_index: 2, superset_group: 'A1' },
            // Chest — standalone
            { name: 'Seated Cable Chest Press',                        set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 90, notes: null, order_index: 3, superset_group: null },
            { name: 'Low Incline Dumbbell Press',                      set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 90, notes: null, order_index: 4, superset_group: null },
            { name: 'Seated Cable Chest Press Isometric',              set_count: 1, rep_range: '5',    tempo: '0000', rest_seconds: 60, notes: 'Hold at full extension for 5s', order_index: 5, superset_group: null },
            // Shoulder giant set — prone Y
            { name: 'Prone Y on Floor',                                set_count: 3, rep_range: '12-15',tempo: '1310', rest_seconds: 0,  notes: null, order_index: 6, superset_group: 'B1' },
            { name: 'Prone Y on Bench',                                set_count: 3, rep_range: '12-15',tempo: '0000', rest_seconds: 0,  notes: null, order_index: 7, superset_group: 'B1' },
            { name: 'Prone Y on Floor Isometric',                      set_count: 3, rep_range: '5',    tempo: '0000', rest_seconds: 90, notes: 'Hold at top for 5s', order_index: 8, superset_group: 'B1' },
            // Tricep giant set
            { name: 'Ring Tricep Extension',                           set_count: 3, rep_range: '12-15',tempo: '0000', rest_seconds: 0,  notes: null, order_index: 9,  superset_group: 'C1' },
            { name: 'Inverted Skull Crusher',                          set_count: 3, rep_range: '8-10', tempo: '0000', rest_seconds: 90, notes: null, order_index: 10, superset_group: 'C1' },
            // Standalone
            { name: 'Push Ups',                                        set_count: 3, rep_range: '12-20',tempo: '0000', rest_seconds: 60, notes: 'To failure', order_index: 11, superset_group: null },
            // Quad giant set — single-leg
            { name: 'Single Leg Leg Extension Machine',                set_count: 4, rep_range: '10-12',tempo: '1220', rest_seconds: 0,  notes: null, order_index: 12, superset_group: 'D1' },
            { name: 'Front Foot Elevated Split Squat',                 set_count: 4, rep_range: '10-12',tempo: '1220', rest_seconds: 90, notes: null, order_index: 13, superset_group: 'D1' },
          ],
        })

        // ── Day 4 — Back, Biceps, Glutes & Hamstrings ────────────────────────
        sessions.push({
          day_label: 'Day 4 — Back, Biceps, Glutes & Hamstrings',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Ab Wheel',                                        set_count: 1, rep_range: '8-10', tempo: '0000', rest_seconds: 0,  notes: null, order_index: 0,  superset_group: 'A1' },
            { name: 'Unilateral Farmers Carry',                        set_count: 1, rep_range: '20m',  tempo: '0000', rest_seconds: 0,  notes: 'Each side', order_index: 1, superset_group: 'A1' },
            { name: 'Single Leg RDL',                                  set_count: 1, rep_range: '8-10', tempo: '0000', rest_seconds: 60, notes: 'Each side', order_index: 2, superset_group: 'A1' },
            // Back giant set A
            { name: 'Round Back Cable Row',                            set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 3,  superset_group: 'B1' },
            { name: 'Lat Pulldown',                                    set_count: 4, rep_range: '8-10', tempo: '2220', rest_seconds: 90, notes: null, order_index: 4,  superset_group: 'B1' },
            // Back giant set B — dynamic + isometric
            { name: 'Incline Bench Dumbbell Row',                      set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 5,  superset_group: 'C1' },
            { name: 'Upper Back Pulldown',                             set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 6,  superset_group: 'C1' },
            { name: 'Incline Bench Dumbbell Row Isometric',            set_count: 3, rep_range: '5',    tempo: '0000', rest_seconds: 120,notes: 'Hold at peak contraction for 5s', order_index: 7, superset_group: 'C1' },
            // Biceps — standalone
            { name: 'Standing Cable Curl',                             set_count: 3, rep_range: '15',   tempo: '2220', rest_seconds: 60, notes: null, order_index: 8,  superset_group: null },
            // Glute giant set — dynamic + isometric
            { name: 'Barbell Hip Thrusts',                             set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 9,  superset_group: 'D1' },
            { name: 'Bulgarian Split Squat',                           set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 90, notes: null, order_index: 10, superset_group: 'D1' },
            // Hamstring giant set
            { name: 'Lying Leg Curl',                                  set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 0,  notes: null, order_index: 11, superset_group: 'E1' },
            { name: 'Good Mornings',                                   set_count: 3, rep_range: '8-10', tempo: '2220', rest_seconds: 90, notes: null, order_index: 12, superset_group: 'E1' },
          ],
        })
      }

      return sessions
    },
  },

  // ── Template 36 — Contrast Training ──────────────────────────────────────
  {
    id: 'contrast-training',
    name: 'Contrast Training',
    description: '5-day upper/lower contrast programme pairing heavy strength lifts with explosive plyometric or Olympic-lift variations to maximise post-activation potentiation. Finishes with a mixed power/conditioning day.',
    goal: 'strength',
    difficulty: 'advanced',
    days_per_week: 5,
    duration_weeks: 4,
    generateSessions(weeks = 4) {
      const sessions = []
      for (let week = 1; week <= weeks; week++) {

        // ── Upper — Push Dominant ─────────────────────────────────────────────
        sessions.push({
          day_label: 'Upper — Push Dominant',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Kettlebell Windmill',               set_count: 1, rep_range: '6-8',  tempo: '0000', rest_seconds: 30,  notes: null, order_index: 0,  superset_group: 'A1' },
            { name: 'Push Up to Downward Dog',           set_count: 1, rep_range: '10-12',tempo: '0000', rest_seconds: 30,  notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Toes to Bar',                       set_count: 1, rep_range: '10-15',tempo: '0000', rest_seconds: 30,  notes: null, order_index: 2,  superset_group: 'A1' },
            { name: 'Ab Roll Out',                       set_count: 1, rep_range: '10-15',tempo: '0000', rest_seconds: 60,  notes: null, order_index: 3,  superset_group: 'A1' },
            // Shoulder health
            { name: 'Side Lying Powell Raise',           set_count: 2, rep_range: '10-12',tempo: '0000', rest_seconds: 60,  notes: null, order_index: 4,  superset_group: null },
            // Contrast — power primer
            { name: 'Hip Snatch',                        set_count: 3, rep_range: '5',    tempo: '0000', rest_seconds: 120, notes: 'Explosive hip extension — build to heavy single', order_index: 5, superset_group: null },
            // Contrast superset — heavy push + pull
            { name: 'Flat Barbell Bench Press',          set_count: 3, rep_range: '5',    tempo: '0000', rest_seconds: 90,  notes: null, order_index: 6,  superset_group: 'B1' },
            { name: 'Pull Ups',                          set_count: 3, rep_range: '5',    tempo: '0000', rest_seconds: 90,  notes: null, order_index: 7,  superset_group: 'B1' },
            // Contrast superset — plyo push + rotational press
            { name: 'Plyometric Push Up',                set_count: 3, rep_range: '8',    tempo: '0000', rest_seconds: 90,  notes: null, order_index: 8,  superset_group: 'C1' },
            { name: 'Landmine Rotational Press',         set_count: 3, rep_range: '6',    tempo: '0000', rest_seconds: 90,  notes: null, order_index: 9,  superset_group: 'C1' },
            // Accessory giant set
            { name: 'Single Arm Cable Lateral Raise',    set_count: 2, rep_range: '10-15',tempo: '0000', rest_seconds: 90,  notes: null, order_index: 10, superset_group: 'D1' },
            { name: 'EZ Bar Tricep Pushdown',            set_count: 2, rep_range: '12-15',tempo: '0000', rest_seconds: 90,  notes: null, order_index: 11, superset_group: 'D1' },
            { name: 'Squatting Cable Curl',              set_count: 2, rep_range: '10-15',tempo: '0000', rest_seconds: 90,  notes: null, order_index: 12, superset_group: 'D1' },
          ],
        })

        // ── Lower — Squat ─────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Lower — Squat',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: '90/90 Breathe with Reach Forward',  set_count: 1, rep_range: '10-12',tempo: '0000', rest_seconds: 60,  notes: null, order_index: 0,  superset_group: 'A1' },
            { name: 'GHD Rounded Back Hip Extension',    set_count: 1, rep_range: '10-12',tempo: '0000', rest_seconds: 0,   notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Side to Side Squats',               set_count: 1, rep_range: '6',    tempo: '0000', rest_seconds: 0,   notes: null, order_index: 2,  superset_group: 'A1' },
            { name: 'Full Copenhagen Plank',             set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 30,  notes: null, order_index: 3,  superset_group: 'A1' },
            { name: 'Max Effort Vertical Jump',          set_count: 1, rep_range: '3',    tempo: '0000', rest_seconds: 60,  notes: null, order_index: 4,  superset_group: 'A1' },
            // Activation superset
            { name: 'Prone Hamstring Curl Machine',      set_count: 2, rep_range: '12-15',tempo: '0000', rest_seconds: 30,  notes: null, order_index: 5,  superset_group: 'B1' },
            { name: 'Hip Adductor',                      set_count: 2, rep_range: '10-15',tempo: '0000', rest_seconds: 90,  notes: null, order_index: 6,  superset_group: 'B1' },
            // Contrast — Olympic lift primer
            { name: 'Power Clean',                       set_count: 3, rep_range: '5',    tempo: '0000', rest_seconds: 120, notes: null, order_index: 7,  superset_group: null },
            // Heavy squat
            { name: 'Safety Bar Box Squat',              set_count: 3, rep_range: '3',    tempo: '0000', rest_seconds: 120, notes: null, order_index: 8,  superset_group: null },
            // Plyometric contrast
            { name: 'Dumbbell Squat Jumps',              set_count: 2, rep_range: '6',    tempo: '0000', rest_seconds: 120, notes: null, order_index: 9,  superset_group: null },
            // Volume accessories
            { name: '45° Leg Press (Hip Dominant)',      set_count: 2, rep_range: '10-15',tempo: '0000', rest_seconds: 120, notes: null, order_index: 10, superset_group: null },
            { name: 'Seated Hamstring Curl',             set_count: 2, rep_range: '12-15',tempo: '0000', rest_seconds: 120, notes: null, order_index: 11, superset_group: null },
            { name: 'Front Rack Walking Lunges',         set_count: 2, rep_range: '10-12',tempo: '0000', rest_seconds: 120, notes: null, order_index: 12, superset_group: null },
            // Superset — core/calf finisher
            { name: 'Incline Garhammer Raise',           set_count: 2, rep_range: '10-20',tempo: '0000', rest_seconds: 30,  notes: null, order_index: 13, superset_group: 'C1' },
            { name: 'Seated Calf Raise',                 set_count: 2, rep_range: '12-15',tempo: '0000', rest_seconds: 90,  notes: null, order_index: 14, superset_group: 'C1' },
          ],
        })

        // ── Upper — Pull ──────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Upper — Pull',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Kettlebell Windmill',               set_count: 1, rep_range: '6-8',  tempo: '0000', rest_seconds: 0,   notes: null, order_index: 0,  superset_group: 'A1' },
            { name: 'Cable Rope Crunches',               set_count: 1, rep_range: '12-15',tempo: '0000', rest_seconds: 0,   notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Straight Arm Russian Twist',        set_count: 1, rep_range: '8-10', tempo: '0000', rest_seconds: 0,   notes: null, order_index: 2,  superset_group: 'A1' },
            { name: 'Ab Roll Out',                       set_count: 1, rep_range: '10-20',tempo: '0000', rest_seconds: 60,  notes: null, order_index: 3,  superset_group: 'A1' },
            // Contrast superset — pull + overhead
            { name: 'Pull Ups',                          set_count: 3, rep_range: '5',    tempo: '0000', rest_seconds: 90,  notes: null, order_index: 4,  superset_group: 'B1' },
            { name: 'Kettlebell Bottom-up Press',        set_count: 3, rep_range: '6-8',  tempo: '0000', rest_seconds: 60,  notes: null, order_index: 5,  superset_group: 'B1' },
            // Contrast — unilateral power
            { name: 'One Arm Dumbbell Snatch',           set_count: 3, rep_range: '6-8',  tempo: '0000', rest_seconds: 90,  notes: null, order_index: 6,  superset_group: null },
            { name: 'Rotational Medicine Ball Slams',    set_count: 3, rep_range: '8-10', tempo: '0000', rest_seconds: 90,  notes: null, order_index: 7,  superset_group: null },
            // Volume accessories
            { name: 'Pendlay Row',                       set_count: 2, rep_range: '6-10', tempo: '0000', rest_seconds: 120, notes: null, order_index: 8,  superset_group: null },
            { name: 'Single Arm Rear Delt Cable Fly',    set_count: 2, rep_range: '12-15',tempo: '0000', rest_seconds: 60,  notes: null, order_index: 9,  superset_group: null },
            { name: 'Dual Cable Face Away Bicep Curls',  set_count: 2, rep_range: '10-15',tempo: '0000', rest_seconds: 90,  notes: null, order_index: 10, superset_group: null },
          ],
        })

        // ── Lower — Hinge ─────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Lower — Hinge',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Single Leg Hamstring Bridge Iso (Foam Roller)', set_count: 1, rep_range: '6-8', tempo: '0000', rest_seconds: 0, notes: null, order_index: 0, superset_group: 'A1' },
            { name: 'Full Copenhagen Plank',             set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 0,   notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Kickstance RDL with Contralateral Load', set_count: 1, rep_range: '10-12', tempo: '0000', rest_seconds: 0, notes: null, order_index: 2, superset_group: 'A1' },
            { name: 'Broad Jumps',                       set_count: 1, rep_range: '6',    tempo: '0000', rest_seconds: 60,  notes: null, order_index: 3,  superset_group: 'A1' },
            // Activation
            { name: 'Hip Adductor',                      set_count: 2, rep_range: '12-15',tempo: '0000', rest_seconds: 90,  notes: null, order_index: 4,  superset_group: null },
            // Contrast — Olympic lift primer
            { name: 'Hang Power Snatch',                 set_count: 3, rep_range: '5',    tempo: '0000', rest_seconds: 120, notes: null, order_index: 5,  superset_group: null },
            // Heavy hinge
            { name: 'Barbell Deadlifts',                 set_count: 3, rep_range: '5',    tempo: '0000', rest_seconds: 150, notes: null, order_index: 6,  superset_group: null },
            // Plyometric contrast
            { name: 'Trap Bar Squat Jumps',              set_count: 2, rep_range: '6-8',  tempo: '0000', rest_seconds: 150, notes: null, order_index: 7,  superset_group: null },
            // Volume accessories
            { name: 'Pendulum Squat',                    set_count: 2, rep_range: '8-10', tempo: '0000', rest_seconds: 90,  notes: null, order_index: 8,  superset_group: null },
            { name: 'Stiff Leg Dumbbell Romanian Deadlifts', set_count: 2, rep_range: '10-15', tempo: '0000', rest_seconds: 150, notes: null, order_index: 9, superset_group: null },
            { name: 'Dumbbell Walking Lunge',            set_count: 2, rep_range: '10-12',tempo: '0000', rest_seconds: 120, notes: null, order_index: 10, superset_group: null },
          ],
        })

        // ── Mixed Power / Plyo Conditioning ──────────────────────────────────
        sessions.push({
          day_label: 'Mixed Power / Plyo Conditioning',
          week_number: week,
          session_type: 'conditioning',
          exercises: [
            // Contrast circuit (1 round — primer)
            { name: 'Assault Bike',                      set_count: 1, rep_range: '12min',tempo: '0000', rest_seconds: 0,   notes: 'Max effort 12-minute effort', order_index: 0, superset_group: 'A1' },
            { name: 'Power Clean',                       set_count: 1, rep_range: '3',    tempo: '0000', rest_seconds: 0,   notes: null, order_index: 1, superset_group: 'A1' },
            { name: 'Front Squats BB',                   set_count: 1, rep_range: '3',    tempo: '0000', rest_seconds: 0,   notes: null, order_index: 2, superset_group: 'A1' },
            { name: 'Dumbbell Push Press',               set_count: 1, rep_range: '3',    tempo: '0000', rest_seconds: 120, notes: null, order_index: 3, superset_group: 'A1' },
            // Conditioning superset — rowing + lunge
            { name: 'Concept 2 Rowing Machine',          set_count: 3, rep_range: '30s',  tempo: '0000', rest_seconds: 0,   notes: 'Sprint interval each set', order_index: 4, superset_group: 'B1' },
            { name: 'Front Rack Walking Lunges',         set_count: 3, rep_range: '20',   tempo: '0000', rest_seconds: 90,  notes: 'Total steps', order_index: 5, superset_group: 'B1' },
            // Finisher giant set
            { name: 'Plyo Step Ups',                     set_count: 3, rep_range: '12',   tempo: '0000', rest_seconds: 30,  notes: null, order_index: 6, superset_group: 'C1' },
            { name: 'Single Leg RDL to Snatch',          set_count: 3, rep_range: '8',    tempo: '0000', rest_seconds: 30,  notes: null, order_index: 7, superset_group: 'C1' },
            { name: 'DB Sit Up',                         set_count: 3, rep_range: '10-12',tempo: '0000', rest_seconds: 45,  notes: null, order_index: 8, superset_group: 'C1' },
          ],
        })
      }

      return sessions
    },
  },

  // ── Template 37 — Contrast 2.0 ───────────────────────────────────────────
  {
    id: 'contrast-2',
    name: 'Contrast 2.0',
    description: '4-session full body contrast programme. Each session pairs a heavy compound lift with a plyometric/explosive counterpart, surrounded by superset accessories. More hypertrophy volume than the original Contrast Training.',
    goal: 'strength',
    difficulty: 'advanced',
    days_per_week: 4,
    duration_weeks: 4,
    generateSessions(weeks = 4) {
      const sessions = []
      for (let week = 1; week <= weeks; week++) {

        // ── Full Body 1 ───────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Full Body 1',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Single Leg Bridge',                               set_count: 1, rep_range: '6-8',  tempo: '0000', rest_seconds: 30,  notes: null, order_index: 0,  superset_group: 'A1' },
            { name: '45° Adductor Side Bend',                          set_count: 1, rep_range: '10-12',tempo: '3021', rest_seconds: 30,  notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Dumbbell Front Foot Elevated Split Squat',        set_count: 1, rep_range: '10-12',tempo: '3120', rest_seconds: 30,  notes: null, order_index: 2,  superset_group: 'A1' },
            { name: 'Single Leg Pogo Hops',                            set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 30,  notes: null, order_index: 3,  superset_group: 'A1' },
            { name: 'Double DB Snatch / Heavy Kettlebell Swing',       set_count: 1, rep_range: '5-6',  tempo: '2020', rest_seconds: 60,  notes: 'Power primer — fast and explosive', order_index: 4, superset_group: 'A1' },
            // Contrast pair — heavy hinge + Olympic
            { name: 'Trap Bar Deadlift',                               set_count: 3, rep_range: '4-6',  tempo: '3020', rest_seconds: 30,  notes: null, order_index: 5,  superset_group: 'B1' },
            { name: 'Power Clean',                                     set_count: 3, rep_range: '3',    tempo: '2010', rest_seconds: 180, notes: 'Explosive — full recovery between sets', order_index: 6, superset_group: 'B1' },
            // Superset — lower push + upper push
            { name: 'Front Foot Elevated Dumbbell Split Squat',        set_count: 2, rep_range: '6-8',  tempo: '3210', rest_seconds: 90,  notes: null, order_index: 7,  superset_group: 'C1' },
            { name: '45° Incline DB Press',                            set_count: 2, rep_range: '6-10', tempo: '3120', rest_seconds: 90,  notes: null, order_index: 8,  superset_group: 'C1' },
            // Superset — hamstring + rear delt
            { name: 'Nordic Curls',                                    set_count: 2, rep_range: '6-8',  tempo: '3120', rest_seconds: 90,  notes: null, order_index: 9,  superset_group: 'D1' },
            { name: 'Face Pulls',                                      set_count: 2, rep_range: '12-15',tempo: '3021', rest_seconds: 90,  notes: null, order_index: 10, superset_group: 'D1' },
            // Arm giant set — mechanical drop set style
            { name: 'Preacher Curl Machine',                           set_count: 3, rep_range: '6',    tempo: '3021', rest_seconds: 30,  notes: null, order_index: 11, superset_group: 'E1' },
            { name: 'Rope Cable Curl',                                 set_count: 3, rep_range: '12',   tempo: '3021', rest_seconds: 30,  notes: null, order_index: 12, superset_group: 'E1' },
            { name: 'Dual Rope Pushdowns',                             set_count: 3, rep_range: '24',   tempo: '3021', rest_seconds: 120, notes: null, order_index: 13, superset_group: 'E1' },
          ],
        })

        // ── Full Body 2 ───────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Full Body 2',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: "Child's Pose",                                    set_count: 1, rep_range: '8-10', tempo: '0000', rest_seconds: 0,   notes: null, order_index: 0,  superset_group: 'A1' },
            { name: 'Kettlebell Arm Bar',                              set_count: 1, rep_range: '6-8',  tempo: '0000', rest_seconds: 0,   notes: 'Each side', order_index: 1, superset_group: 'A1' },
            { name: 'Kneeling Cable Crunches',                        set_count: 1, rep_range: '12-15',tempo: '3021', rest_seconds: 0,   notes: null, order_index: 2,  superset_group: 'A1' },
            { name: 'Hanging Knee Raises',                             set_count: 1, rep_range: '12-15',tempo: '3021', rest_seconds: 0,   notes: null, order_index: 3,  superset_group: 'A1' },
            { name: 'Dumbbell Front Foot Elevated Split Squat',        set_count: 1, rep_range: '8-10', tempo: '3210', rest_seconds: 60,  notes: 'Mobility activation', order_index: 4, superset_group: 'A1' },
            // Contrast pair — heavy squat + plyometric
            { name: 'Barbell Front Squat',                             set_count: 3, rep_range: '4-6',  tempo: '3120', rest_seconds: 30,  notes: null, order_index: 5,  superset_group: 'B1' },
            { name: 'Dumbbell Squat Jumps',                            set_count: 3, rep_range: '5-6',  tempo: '3210', rest_seconds: 120, notes: 'Explosive — max height', order_index: 6, superset_group: 'B1' },
            // Superset — horizontal push + pull
            { name: 'Flat Barbell Bench Press',                        set_count: 2, rep_range: '6-10', tempo: '3120', rest_seconds: 60,  notes: null, order_index: 7,  superset_group: 'C1' },
            { name: 'Single Arm Pulldown',                             set_count: 2, rep_range: '6-10', tempo: '3021', rest_seconds: 60,  notes: null, order_index: 8,  superset_group: 'C1' },
            // Superset — row + tricep
            { name: 'Seated Chest Supported Row',                      set_count: 2, rep_range: '10-15',tempo: '3021', rest_seconds: 90,  notes: null, order_index: 9,  superset_group: 'D1' },
            { name: 'Tricep Dips',                                     set_count: 2, rep_range: '6-10', tempo: '3120', rest_seconds: 90,  notes: null, order_index: 10, superset_group: 'D1' },
            // Superset — leg press + rear delt
            { name: '45° Leg Press',                                   set_count: 2, rep_range: '12-15',tempo: '3120', rest_seconds: 90,  notes: null, order_index: 11, superset_group: 'E1' },
            { name: 'Cable Rear Delt Row with 2 D Handles',            set_count: 2, rep_range: '12-15',tempo: '3021', rest_seconds: 90,  notes: null, order_index: 12, superset_group: 'E1' },
            // Superset — core + calf
            { name: 'Incline Garhammer Raise',                         set_count: 2, rep_range: '12-15',tempo: '3020', rest_seconds: 90,  notes: null, order_index: 13, superset_group: 'F1' },
            { name: 'Seated Calf Raise',                               set_count: 2, rep_range: '12-15',tempo: '3021', rest_seconds: 90,  notes: null, order_index: 14, superset_group: 'F1' },
          ],
        })

        // ── Full Body 3 ───────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Full Body 3',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: 'Single Leg Bridge',                               set_count: 1, rep_range: '6-8',  tempo: '0000', rest_seconds: 0,   notes: null, order_index: 0,  superset_group: 'A1' },
            { name: '45° Back Extension Side Bends',                   set_count: 1, rep_range: '10-12',tempo: '3021', rest_seconds: 0,   notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Kickstance RDL with Contralateral Load',          set_count: 1, rep_range: '6-8',  tempo: '2110', rest_seconds: 0,   notes: null, order_index: 2,  superset_group: 'A1' },
            { name: 'Lateral Pogo Hops',                               set_count: 1, rep_range: '30s',  tempo: '0000', rest_seconds: 0,   notes: null, order_index: 3,  superset_group: 'A1' },
            { name: 'Max Effort Vertical Jump',                        set_count: 1, rep_range: '3-5',  tempo: '2010', rest_seconds: 60,  notes: null, order_index: 4,  superset_group: 'A1' },
            // Contrast pair — heavy hinge + box jump
            { name: 'Trap Bar Deadlift',                               set_count: 3, rep_range: '4-6',  tempo: '3020', rest_seconds: 30,  notes: null, order_index: 5,  superset_group: 'B1' },
            { name: 'Counterbalance Box Jump',                         set_count: 3, rep_range: '3-5',  tempo: '0000', rest_seconds: 180, notes: 'Max height — full reset between reps', order_index: 6, superset_group: 'B1' },
            // Superset — back extension + lunge
            { name: '45° Back Extension',                              set_count: 2, rep_range: '12-15',tempo: '3021', rest_seconds: 60,  notes: null, order_index: 7,  superset_group: 'C1' },
            { name: 'Walking Lunges',                                  set_count: 2, rep_range: '10-12',tempo: '3120', rest_seconds: 120, notes: null, order_index: 8,  superset_group: 'C1' },
            // Superset — pull + overhead press
            { name: 'Pull Ups',                                        set_count: 3, rep_range: '6-10', tempo: '3021', rest_seconds: 90,  notes: null, order_index: 9,  superset_group: 'D1' },
            { name: 'Alternating Dumbbell Z Press',                    set_count: 3, rep_range: '10-12',tempo: '2020', rest_seconds: 90,  notes: null, order_index: 10, superset_group: 'D1' },
            // Superset — lateral raise + long tricep
            { name: 'Single Arm Cable Lateral Raise',                  set_count: 3, rep_range: '10-15',tempo: '3021', rest_seconds: 60,  notes: null, order_index: 11, superset_group: 'E1' },
            { name: 'Single Arm Tricep Extension — Long',              set_count: 3, rep_range: '12-15',tempo: '3021', rest_seconds: 60,  notes: null, order_index: 12, superset_group: 'E1' },
            // Superset — curl + katana
            { name: 'Dual Cable Face Away Bicep Curls',                set_count: 3, rep_range: '10-15',tempo: '3021', rest_seconds: 60,  notes: null, order_index: 13, superset_group: 'F1' },
            { name: 'Katana Extensions',                               set_count: 3, rep_range: '10-15',tempo: '3120', rest_seconds: 60,  notes: null, order_index: 14, superset_group: 'F1' },
          ],
        })

        // ── Full Body 4 ───────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Full Body 4',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Warmup giant set (1 round)
            { name: "Child's Pose",                                    set_count: 1, rep_range: '8-10', tempo: '0000', rest_seconds: 0,   notes: null, order_index: 0,  superset_group: 'A1' },
            { name: 'Kettlebell Windmill',                             set_count: 1, rep_range: '5-6',  tempo: '0000', rest_seconds: 0,   notes: null, order_index: 1,  superset_group: 'A1' },
            { name: 'Hanging Knee Raise',                              set_count: 1, rep_range: '12-15',tempo: '3021', rest_seconds: 0,   notes: null, order_index: 2,  superset_group: 'A1' },
            { name: 'Ab Rollout',                                      set_count: 1, rep_range: '12-15',tempo: '3021', rest_seconds: 0,   notes: null, order_index: 3,  superset_group: 'A1' },
            { name: 'Deficit Push Ups',                                set_count: 1, rep_range: '10-12',tempo: '3120', rest_seconds: 60,  notes: null, order_index: 4,  superset_group: 'A1' },
            // Contrast pair — heavy squat + broad jump
            { name: 'Barbell Back Squat',                              set_count: 3, rep_range: '4-6',  tempo: '3120', rest_seconds: 30,  notes: null, order_index: 5,  superset_group: 'B1' },
            { name: 'Continuous Broad Jumps',                          set_count: 3, rep_range: '5-6',  tempo: '0000', rest_seconds: 180, notes: 'Max distance — stick each landing', order_index: 6, superset_group: 'B1' },
            // Superset — pull up + snatch
            { name: 'Pull Ups',                                        set_count: 2, rep_range: '6-10', tempo: '3021', rest_seconds: 30,  notes: null, order_index: 7,  superset_group: 'C1' },
            { name: 'Single Arm Dumbbell Snatch',                      set_count: 2, rep_range: '6-8',  tempo: '3020', rest_seconds: 120, notes: null, order_index: 8,  superset_group: 'C1' },
            // Superset — lat row + shoulder press
            { name: 'Single Arm Cable Lat Row',                        set_count: 2, rep_range: '12-15',tempo: '3021', rest_seconds: 30,  notes: null, order_index: 9,  superset_group: 'D1' },
            { name: 'Standing Dumbbell Shoulder Press',                set_count: 2, rep_range: '10-12',tempo: '3021', rest_seconds: 90,  notes: null, order_index: 10, superset_group: 'D1' },
            // Superset — hamstring + quad
            { name: 'Prone Hamstring Curl Machine',                    set_count: 2, rep_range: '12-15',tempo: '3021', rest_seconds: 60,  notes: null, order_index: 11, superset_group: 'E1' },
            { name: 'Leg Extensions',                                  set_count: 2, rep_range: '12-15',tempo: '3021', rest_seconds: 90,  notes: null, order_index: 12, superset_group: 'E1' },
            // Superset — lateral raise + calf
            { name: 'Cable Crucifix Lateral Raise',                    set_count: 2, rep_range: '12-15',tempo: '3021', rest_seconds: 60,  notes: null, order_index: 13, superset_group: 'F1' },
            { name: 'Standing Calf Raise',                             set_count: 2, rep_range: '12-15',tempo: '3221', rest_seconds: 60,  notes: null, order_index: 14, superset_group: 'F1' },
          ],
        })
      }

      return sessions
    },
  },

  // ── Template 38 ── Contrast Block ────────────────────────────────────────────
  {
    id: 'contrast-block',
    name: 'Contrast Block',
    sessions_per_week: 5,
    goals: ['lean_gain', 'strength'],
    difficulty: 'advanced',
    generateSessions(weekCount) {
      const sessions = []
      for (let w = 1; w <= weekCount; w++) {
        // ── Day A — Glutes, Hams & Abs ────────────────────────────────────────
        sessions.push({
          day_label: 'Day A — Glutes, Hams & Abs',
          week_number: w,
          session_type: 'Lower',
          exercises: [
            // Warmup giant set — 1 round
            { name: 'Single Leg Hamstring Bridge',               set_count: 1, rep_range: '6-8',   tempo: '2010', rest_seconds: 0,   notes: 'Warmup activation — 1 round only', order_index: 1,  superset_group: 'A1' },
            { name: 'Copenhagen Plank',                          set_count: 1, rep_range: '45s',   tempo: '0000', rest_seconds: 0,   notes: null,                               order_index: 2,  superset_group: 'A1' },
            { name: 'Front Foot Elevated Bulgarian Split Squat', set_count: 1, rep_range: '6-8',   tempo: '3010', rest_seconds: 0,   notes: null,                               order_index: 3,  superset_group: 'A1' },
            { name: 'Pogo Hops',                                 set_count: 1, rep_range: '30s',   tempo: '0000', rest_seconds: 60,  notes: null,                               order_index: 4,  superset_group: 'A1' },
            // Contrast triple — heavy hinge + jump + anti-extension
            { name: 'Barbell RDL',                               set_count: 4, rep_range: '4-5',   tempo: '3010', rest_seconds: 60,  notes: 'Heavy — contrast primer',          order_index: 5,  superset_group: 'B1' },
            { name: 'DL Jumps',                                  set_count: 4, rep_range: '5-6',   tempo: '1010', rest_seconds: 0,   notes: 'Explosive — immediately after RDL', order_index: 6,  superset_group: 'B1' },
            { name: 'Fitball Plank',                             set_count: 4, rep_range: '30s',   tempo: '0000', rest_seconds: 120, notes: 'Anti-extension hold',              order_index: 7,  superset_group: 'B1' },
            // Superset — hip thrust + hanging abs
            { name: 'Barbell Hip Thrusts',                       set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 90,  notes: null,                               order_index: 8,  superset_group: 'C1' },
            { name: 'Hanging Knee Tuck',                         set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 60,  notes: null,                               order_index: 9,  superset_group: 'C1' },
            // Superset — adductor + calf
            { name: 'Goblet Cossack Squat',                      set_count: 3, rep_range: '10-12', tempo: '2010', rest_seconds: 0,   notes: null,                               order_index: 10, superset_group: 'D1' },
            { name: 'Standing Calf Raise',                       set_count: 3, rep_range: '10-15', tempo: '3110', rest_seconds: 60,  notes: null,                               order_index: 11, superset_group: 'D1' },
            // Superset — conditioning + anti-rotation
            { name: 'Squat Thrusts',                             set_count: 3, rep_range: '10-12', tempo: '1010', rest_seconds: 0,   notes: null,                               order_index: 12, superset_group: 'E1' },
            { name: 'Band Tight Rotations',                      set_count: 3, rep_range: '15-20', tempo: '1010', rest_seconds: 60,  notes: null,                               order_index: 13, superset_group: 'E1' },
            // Finisher
            { name: 'Seated Calf Raise',                         set_count: 3, rep_range: '10-15', tempo: '3210', rest_seconds: 90,  notes: null,                               order_index: 14, superset_group: null },
          ],
        })

        // ── Day B — Pull (V), Chest, Lats, Biceps ────────────────────────────
        sessions.push({
          day_label: 'Day B — Pull (V), Chest, Lats & Biceps',
          week_number: w,
          session_type: 'Upper',
          exercises: [
            // Warmup giant set — 1 round
            { name: 'Kettlebell Arm Bar',                        set_count: 1, rep_range: '6-8',   tempo: '2010', rest_seconds: 0,   notes: 'Warmup — 1 round only',            order_index: 1,  superset_group: 'A1' },
            { name: 'Lat PNF Stretch',                           set_count: 1, rep_range: '8-10',  tempo: '0000', rest_seconds: 0,   notes: null,                               order_index: 2,  superset_group: 'A1' },
            { name: 'Hanging Knee Raises',                       set_count: 1, rep_range: '15-20', tempo: '3011', rest_seconds: 0,   notes: null,                               order_index: 3,  superset_group: 'A1' },
            { name: 'Ab Roll Out',                               set_count: 1, rep_range: '15-20', tempo: '3010', rest_seconds: 60,  notes: null,                               order_index: 4,  superset_group: 'A1' },
            // Contrast pair — vertical pull + ski erg sprint
            { name: 'Pull Ups',                                  set_count: 4, rep_range: '10-20', tempo: '3010', rest_seconds: 0,   notes: 'Heavy — contrast primer; go to near-failure', order_index: 5,  superset_group: 'B1' },
            { name: 'Ski Erg',                                   set_count: 4, rep_range: '10-15', tempo: '0000', rest_seconds: 90,  notes: 'Max effort sprint immediately after pull ups', order_index: 6,  superset_group: 'B1' },
            // Standalone — horizontal pull
            { name: 'Cable Single Arm High to Low Row',          set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 90,  notes: null,                               order_index: 7,  superset_group: null },
            // Superset — wide pull + lateral core
            { name: 'Wide Grip Machine Row',                     set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 90,  notes: null,                               order_index: 8,  superset_group: 'C1' },
            { name: 'Side Plank with Hip Lift',                  set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 120, notes: null,                               order_index: 9,  superset_group: 'C1' },
            // Standalone — chest
            { name: 'Prime Incline Chest Press Machine',         set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 90,  notes: null,                               order_index: 10, superset_group: null },
            { name: 'Single Arm Pec Deck',                       set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 90,  notes: null,                               order_index: 11, superset_group: null },
            // Superset — arms antagonist
            { name: 'Rope Cable Curl',                           set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 90,  notes: null,                               order_index: 12, superset_group: 'D1' },
            { name: 'Tricep Rope Pushdown',                      set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 90,  notes: null,                               order_index: 13, superset_group: 'D1' },
          ],
        })

        // ── 1KM Sprint Intervals ──────────────────────────────────────────────
        sessions.push({
          day_label: '1KM Sprint Intervals',
          week_number: w,
          session_type: 'Conditioning',
          exercises: [
            // Activation giant set — 2 rounds
            { name: 'Walking March',                             set_count: 2, rep_range: '10',    tempo: '0000', rest_seconds: 60,  notes: 'Activation — 2 rounds',            order_index: 1,  superset_group: 'A1' },
            { name: 'Single Leg Pogo Hops',                     set_count: 2, rep_range: '30s',   tempo: '0000', rest_seconds: 0,   notes: null,                               order_index: 2,  superset_group: 'A1' },
            { name: 'Alternate Leg Bounds',                     set_count: 2, rep_range: '20',    tempo: '0000', rest_seconds: 0,   notes: null,                               order_index: 3,  superset_group: 'A1' },
            { name: 'Broad Jumps',                              set_count: 2, rep_range: '3-5',   tempo: '0000', rest_seconds: 0,   notes: null,                               order_index: 4,  superset_group: 'A1' },
            { name: 'Lateral Pogo Hops',                        set_count: 2, rep_range: '30s',   tempo: '0000', rest_seconds: 60,  notes: null,                               order_index: 5,  superset_group: 'A1' },
            // Main conditioning block
            { name: 'Treadmill Running',                        set_count: 6, rep_range: '300s',  tempo: '0000', rest_seconds: 60,  notes: '6×300s intervals at high effort; 60s walk recovery between reps', order_index: 6,  superset_group: null },
          ],
        })

        // ── Day C — Legs, Glute + Abs ─────────────────────────────────────────
        sessions.push({
          day_label: 'Day C — Legs, Glute + Abs',
          week_number: w,
          session_type: 'Lower',
          exercises: [
            // Warmup giant set — 1 round
            { name: 'Single Leg Hamstring Bridge Iso (Foam Roller)', set_count: 1, rep_range: '6-8',   tempo: '0000', rest_seconds: 0,   notes: 'Isometric hold on foam roller — 1 round', order_index: 1,  superset_group: 'A1' },
            { name: 'Copenhagen Plank',                              set_count: 1, rep_range: '45s',   tempo: '0000', rest_seconds: 0,   notes: null,                                       order_index: 2,  superset_group: 'A1' },
            { name: 'Straight Arm Russian Twist',                    set_count: 1, rep_range: '6-8',   tempo: '0000', rest_seconds: 0,   notes: null,                                       order_index: 3,  superset_group: 'A1' },
            { name: 'Pogo Hops',                                     set_count: 1, rep_range: '30s',   tempo: '0000', rest_seconds: 60,  notes: null,                                       order_index: 4,  superset_group: 'A1' },
            // Superset — knee activation
            { name: 'Banded TKE',                                    set_count: 2, rep_range: '15-20', tempo: '2010', rest_seconds: 90,  notes: null,                                       order_index: 5,  superset_group: 'B1' },
            { name: 'Poliquin Step-Up',                              set_count: 2, rep_range: '10-12', tempo: '2010', rest_seconds: 90,  notes: null,                                       order_index: 6,  superset_group: 'B1' },
            // Standalone — unilateral squat
            { name: 'Bulgarian Split Squat',                         set_count: 2, rep_range: '8-12',  tempo: '3210', rest_seconds: 90,  notes: null,                                       order_index: 7,  superset_group: null },
            // Contrast pair — heavy hinge + broad jump
            { name: 'Snatch Grip Deadlift',                          set_count: 3, rep_range: '3-5',   tempo: '3010', rest_seconds: 120, notes: 'Heavy contrast primer',                    order_index: 8,  superset_group: 'C1' },
            { name: 'Broad Jumps',                                   set_count: 3, rep_range: '4-6',   tempo: '3010', rest_seconds: 60,  notes: 'Explosive — immediately after deadlift',    order_index: 9,  superset_group: 'C1' },
            // Standalone — hamstring isolation
            { name: 'Prone Hamstring Curl Machine',                  set_count: 2, rep_range: '8-12',  tempo: '3110', rest_seconds: 90,  notes: null,                                       order_index: 10, superset_group: null },
            // Superset — abs + sled
            { name: 'V Sit Ups (Butterfly Crunch)',                  set_count: 3, rep_range: '10',    tempo: '3010', rest_seconds: 90,  notes: null,                                       order_index: 11, superset_group: 'D1' },
            { name: 'Reverse Sled Drag',                             set_count: 3, rep_range: '15',    tempo: '3010', rest_seconds: 90,  notes: null,                                       order_index: 12, superset_group: 'D1' },
            // Superset — unilateral leg + carry
            { name: 'Dumbbell Step Up',                              set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 90,  notes: null,                                       order_index: 13, superset_group: 'E1' },
            { name: 'Suitcase Carry',                                set_count: 3, rep_range: '10',    tempo: '0000', rest_seconds: 90,  notes: null,                                       order_index: 14, superset_group: 'E1' },
            // Finisher
            { name: 'Seated Calf Raise',                             set_count: 3, rep_range: '10-15', tempo: '3210', rest_seconds: 90,  notes: null,                                       order_index: 15, superset_group: null },
          ],
        })

        // ── Day D — Pull (H), Push & Triceps ──────────────────────────────────
        sessions.push({
          day_label: 'Day D — Pull (H), Push & Triceps',
          week_number: w,
          session_type: 'Upper',
          exercises: [
            // Warmup giant set — 1 round
            { name: 'Kettlebell Windmill',                       set_count: 1, rep_range: '5-6',   tempo: '2010', rest_seconds: 0,   notes: 'Warmup — 1 round only',            order_index: 1,  superset_group: 'A1' },
            { name: '45 Degree Side Bend',                       set_count: 1, rep_range: '10-12', tempo: '2010', rest_seconds: 0,   notes: null,                               order_index: 2,  superset_group: 'A1' },
            { name: 'Kneeling Cable Crunches',                   set_count: 1, rep_range: '12-15', tempo: '3011', rest_seconds: 60,  notes: null,                               order_index: 3,  superset_group: 'A1' },
            // Power primer
            { name: 'Med Ball Slams',                            set_count: 2, rep_range: '6',     tempo: '1010', rest_seconds: 60,  notes: 'Explosive — full reset between reps', order_index: 4,  superset_group: null },
            // Contrast triple — horizontal pull + speed + push
            { name: 'Bentover Barbell Row',                      set_count: 4, rep_range: '4-5',   tempo: '2010', rest_seconds: 90,  notes: 'Heavy contrast primer',            order_index: 5,  superset_group: 'B1' },
            { name: 'Band Speed Row',                            set_count: 4, rep_range: '20-25', tempo: '1010', rest_seconds: 90,  notes: 'Explosive speed — immediately after heavy row', order_index: 6, superset_group: 'B1' },
            { name: 'Flat Dumbbell Bench Press',                 set_count: 4, rep_range: '4-6',   tempo: '3010', rest_seconds: 90,  notes: null,                               order_index: 7,  superset_group: 'B1' },
            // Superset — wide pull + front delt
            { name: 'Wide Grip Machine Row',                     set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 60,  notes: null,                               order_index: 8,  superset_group: 'C1' },
            { name: 'Dumbbell Front Raise',                      set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 60,  notes: null,                               order_index: 9,  superset_group: 'C1' },
            // Superset — rear delt + triceps
            { name: 'Rear Delt Machine',                         set_count: 3, rep_range: '10-15', tempo: '3011', rest_seconds: 0,   notes: null,                               order_index: 10, superset_group: 'D1' },
            { name: 'Tricep Dips',                               set_count: 3, rep_range: '10-15', tempo: '2010', rest_seconds: 90,  notes: null,                               order_index: 11, superset_group: 'D1' },
            // Superset — chest + shoulder pump finisher
            { name: 'Stability Ball Push Up',                    set_count: 2, rep_range: '15-20', tempo: '2010', rest_seconds: 60,  notes: null,                               order_index: 12, superset_group: 'E1' },
            { name: 'Standing Front Dumbbell Lateral Raise',     set_count: 2, rep_range: '10-15', tempo: '2010', rest_seconds: 60,  notes: null,                               order_index: 13, superset_group: 'E1' },
          ],
        })
      }
      return sessions
    },
  },

  // ── Template 39 ── Depletion ──────────────────────────────────────────────
  {
    id: 'depletion',
    name: 'Depletion',
    sessions_per_week: 3,
    goals: ['cut', 'recomp', 'lean_gain'],
    difficulty: 'intermediate',
    generateSessions(weekCount) {
      const sessions = []
      for (let w = 1; w <= weekCount; w++) {
        // ── Monday — Full Body Depletion A ────────────────────────────────────
        sessions.push({
          day_label: 'Monday — Full Body Depletion',
          week_number: w,
          session_type: 'Full Body',
          exercises: [
            // Giant Set A — lower body (calf + quad + hamstring), 3 rounds, 45s rest per exercise
            { name: 'Standing Calf Raise',          set_count: 3, rep_range: '12-20', tempo: '3210', rest_seconds: 45,  notes: 'Giant set — move immediately to next exercise', order_index: 1,  superset_group: 'A1' },
            { name: 'Hack Squat / Pendulum Squat',  set_count: 3, rep_range: '12-20', tempo: '3110', rest_seconds: 45,  notes: null,                                           order_index: 2,  superset_group: 'A1' },
            { name: 'Dumbbell Romanian Deadlifts',  set_count: 3, rep_range: '12-20', tempo: '3110', rest_seconds: 45,  notes: null,                                           order_index: 3,  superset_group: 'A1' },
            // Giant Set B — upper push/pull/rear delt
            { name: 'Chest Press Machine',          set_count: 3, rep_range: '12-20', tempo: '3010', rest_seconds: 45,  notes: 'Giant set — move immediately to next exercise', order_index: 4,  superset_group: 'B1' },
            { name: 'Supinated Lat Pulldown',       set_count: 3, rep_range: '12-20', tempo: '3010', rest_seconds: 45,  notes: null,                                           order_index: 5,  superset_group: 'B1' },
            { name: 'Face Pulls',                   set_count: 3, rep_range: '12-20', tempo: '3010', rest_seconds: 45,  notes: null,                                           order_index: 6,  superset_group: 'B1' },
            // Giant Set C — abs + glute + arms (quad giant set)
            { name: 'Incline Garhammer Raise',      set_count: 3, rep_range: '12-20', tempo: '3010', rest_seconds: 45,  notes: 'Giant set — move immediately to next exercise', order_index: 7,  superset_group: 'C1' },
            { name: '45 Degree Hip Extension',      set_count: 3, rep_range: '12-20', tempo: '3010', rest_seconds: 45,  notes: null,                                           order_index: 8,  superset_group: 'C1' },
            { name: 'Scott Curl',                   set_count: 3, rep_range: '12-20', tempo: '3010', rest_seconds: 45,  notes: null,                                           order_index: 9,  superset_group: 'C1' },
            { name: 'Dual Rope Pushdowns',          set_count: 3, rep_range: '12-20', tempo: '3010', rest_seconds: 45,  notes: null,                                           order_index: 10, superset_group: 'C1' },
          ],
        })

        // ── Wednesday — Full Body Depletion B ────────────────────────────────
        sessions.push({
          day_label: 'Wednesday — Full Body Depletion',
          week_number: w,
          session_type: 'Full Body',
          exercises: [
            // Giant Set A — lower body (calf + hamstring + quad)
            { name: 'Seated Calf Raise',                            set_count: 3, rep_range: '12-20', tempo: '3210', rest_seconds: 45,  notes: 'Giant set — move immediately to next exercise', order_index: 1,  superset_group: 'A1' },
            { name: 'Prone Hamstring Curl Machine',                 set_count: 3, rep_range: '12-20', tempo: '3011', rest_seconds: 45,  notes: null,                                           order_index: 2,  superset_group: 'A1' },
            { name: 'Leg Extensions',                               set_count: 3, rep_range: '12-20', tempo: '3011', rest_seconds: 60,  notes: null,                                           order_index: 3,  superset_group: 'A1' },
            // Giant Set B — upper push/pull/lateral
            { name: 'Pec Deck Machine',                             set_count: 3, rep_range: '12-20', tempo: '3010', rest_seconds: 45,  notes: 'Giant set — move immediately to next exercise', order_index: 4,  superset_group: 'B1' },
            { name: 'Seated Chest Supported Row',                   set_count: 3, rep_range: '12-20', tempo: '3010', rest_seconds: 45,  notes: null,                                           order_index: 5,  superset_group: 'B1' },
            { name: 'Dumbbell Side Lateral Raises',                 set_count: 3, rep_range: '12-20', tempo: '3010', rest_seconds: 60,  notes: null,                                           order_index: 6,  superset_group: 'B1' },
            // Giant Set C — glute + abs + arms (quad giant set)
            { name: 'Hip Thrust Machine',                           set_count: 3, rep_range: '12-20', tempo: '3011', rest_seconds: 45,  notes: 'Giant set — move immediately to next exercise', order_index: 7,  superset_group: 'C1' },
            { name: 'Hanging Knee Raise',                           set_count: 3, rep_range: '12-20', tempo: '3010', rest_seconds: 45,  notes: null,                                           order_index: 8,  superset_group: 'C1' },
            { name: 'Behind-The-Back Dual Cable D-Handle Curls',    set_count: 3, rep_range: '12-20', tempo: '3110', rest_seconds: 45,  notes: null,                                           order_index: 9,  superset_group: 'C1' },
            { name: 'Cross Cable Tricep Extensions',                set_count: 3, rep_range: '12-20', tempo: '3010', rest_seconds: 45,  notes: null,                                           order_index: 10, superset_group: 'C1' },
          ],
        })

        // ── Saturday — Full Body Tension ──────────────────────────────────────
        sessions.push({
          day_label: 'Saturday — Full Body Tension',
          week_number: w,
          session_type: 'Full Body',
          exercises: [
            // Standalone opener
            { name: 'Standing Cable Chest Press (Neutral Grip)',    set_count: 2, rep_range: '10-15', tempo: '3010', rest_seconds: 90,  notes: 'Tension day — heavier, longer rest; 6-10 reps for supersets', order_index: 1,  superset_group: null },
            // Superset A — push + pull (horizontal)
            { name: 'Incline Dumbbell Press',                       set_count: 1, rep_range: '6-10',  tempo: '3110', rest_seconds: 90,  notes: null,                                           order_index: 2,  superset_group: 'A1' },
            { name: 'D-Handle Lat Pulldown',                        set_count: 1, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: null,                                           order_index: 3,  superset_group: 'A1' },
            // Superset B — row + triceps
            { name: 'Seated Chest Supported Row',                   set_count: 1, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: null,                                           order_index: 4,  superset_group: 'B1' },
            { name: 'Tricep Dips',                                  set_count: 1, rep_range: '6-10',  tempo: '3110', rest_seconds: 90,  notes: null,                                           order_index: 5,  superset_group: 'B1' },
            // Superset C — quad + hamstring isolation
            { name: 'Leg Extensions',                               set_count: 1, rep_range: '6-10',  tempo: '3011', rest_seconds: 90,  notes: null,                                           order_index: 6,  superset_group: 'C1' },
            { name: 'Prone Hamstring Curl Machine',                 set_count: 1, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: null,                                           order_index: 7,  superset_group: 'C1' },
            // Superset D — compound quad + hamstring
            { name: 'Pendulum Squat',                               set_count: 1, rep_range: '6-10',  tempo: '3110', rest_seconds: 90,  notes: null,                                           order_index: 8,  superset_group: 'D1' },
            { name: 'Seated Hamstring Curl',                        set_count: 1, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: null,                                           order_index: 9,  superset_group: 'D1' },
            // Standalone — lateral delt
            { name: 'Dumbbell Side Lateral Raises',                 set_count: 1, rep_range: '10-15', tempo: '3010', rest_seconds: 90,  notes: null,                                           order_index: 10, superset_group: null },
            // Tri-set E — calf + arms pump finisher
            { name: 'Standing Calf Raise',                          set_count: 1, rep_range: '10-15', tempo: '3210', rest_seconds: 45,  notes: null,                                           order_index: 11, superset_group: 'E1' },
            { name: 'Rope Tricep Pushdown',                         set_count: 1, rep_range: '6-10',  tempo: '3010', rest_seconds: 45,  notes: null,                                           order_index: 12, superset_group: 'E1' },
            { name: 'Rope Cable Curl',                              set_count: 1, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: null,                                           order_index: 13, superset_group: 'E1' },
          ],
        })
      }
      return sessions
    },
  },

  // ── Template 40 ── Female 531 Strength Programme ─────────────────────────
  {
    id: 'female-531',
    name: 'Female 531 Strength Programme',
    sessions_per_week: 3,
    goals: ['strength', 'lean_gain'],
    difficulty: 'intermediate',
    generateSessions(weekCount) {
      const sessions = []
      // 531 wave: Week 1 = 3×5, Week 2 = 3×3, Week 3 = 5/3/1, Week 4 = Deload
      const waves = [
        { reps: '5',   sets: 3, note: 'Week 1 — 3×5 @ 65/75/85%' },
        { reps: '3',   sets: 3, note: 'Week 2 — 3×3 @ 70/80/90%' },
        { reps: '1',   sets: 3, note: 'Week 3 — 5/3/1 @ 75/85/95% — AMRAP on last set' },
        { reps: '5',   sets: 3, note: 'Week 4 — Deload @ 40/50/60%' },
      ]
      for (let w = 1; w <= weekCount; w++) {
        const wave = waves[(w - 1) % 4]

        // ── Day 1 — Deadlift Focus ────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 1 — Deadlift Focus',
          week_number: w,
          session_type: 'Lower',
          exercises: [
            // Warmup giant set — 1 round
            { name: 'Ab Wheel',                    set_count: 1, rep_range: '8-10',  tempo: '3010', rest_seconds: 0,   notes: 'Warmup — 1 round',       order_index: 1,  superset_group: 'A1' },
            { name: 'Unilateral Farmers Carry',    set_count: 1, rep_range: '20',    tempo: '0000', rest_seconds: 0,   notes: null,                     order_index: 2,  superset_group: 'A1' },
            { name: 'Single Leg RDL',              set_count: 1, rep_range: '8',     tempo: '3010', rest_seconds: 90,  notes: null,                     order_index: 3,  superset_group: 'A1' },
            // 531 main lift + anti-extension superset
            { name: 'Trap Bar Deadlift',           set_count: wave.sets, rep_range: wave.reps, tempo: '3010', rest_seconds: 180, notes: wave.note,      order_index: 4,  superset_group: 'B1' },
            { name: 'Fitball Plank',               set_count: 3, rep_range: '20s',   tempo: '0000', rest_seconds: 60,  notes: 'Hold between DL sets',   order_index: 5,  superset_group: 'B1' },
            // Superset — glute + vertical pull
            { name: 'Barbell Hip Thrusts',         set_count: 3, rep_range: '6-10',  tempo: '2011', rest_seconds: 90,  notes: null,                     order_index: 6,  superset_group: 'C1' },
            { name: 'Eccentric Chin Ups',          set_count: 3, rep_range: '3-5',   tempo: '5010', rest_seconds: 90,  notes: '5s lowering phase',      order_index: 7,  superset_group: 'C1' },
            // Standalone — glute isolation
            { name: 'Single Leg Cable Kickback',   set_count: 2, rep_range: '15-20', tempo: '2010', rest_seconds: 60,  notes: null,                     order_index: 8,  superset_group: null },
            // Superset — posterior chain + unilateral legs
            { name: 'Rounded Back Extension',      set_count: 2, rep_range: '15-20', tempo: '3010', rest_seconds: 60,  notes: null,                     order_index: 9,  superset_group: 'D1' },
            { name: 'Walking Lunges',              set_count: 2, rep_range: '15-20', tempo: '2010', rest_seconds: 90,  notes: null,                     order_index: 10, superset_group: 'D1' },
          ],
        })

        // ── Day 2 — Squat Focus ───────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 2 — Squat Focus',
          week_number: w,
          session_type: 'Lower',
          exercises: [
            // Mobility warmup — 1 round
            { name: 'Pigeon Pose',                          set_count: 1, rep_range: '60s', tempo: '0000', rest_seconds: 0,   notes: 'Mobility warmup — 1 round each side', order_index: 1,  superset_group: 'A1' },
            { name: 'Couch Stretch',                        set_count: 1, rep_range: '60s', tempo: '0000', rest_seconds: 0,   notes: null,                                   order_index: 2,  superset_group: 'A1' },
            { name: 'Frog Pose',                            set_count: 1, rep_range: '60s', tempo: '0000', rest_seconds: 90,  notes: null,                                   order_index: 3,  superset_group: 'A1' },
            // 531 main lift
            { name: 'Hack Squat / Pendulum Squat',          set_count: wave.sets, rep_range: wave.reps, tempo: '3110', rest_seconds: 180, notes: wave.note, order_index: 4,  superset_group: null },
            // Standalone — core carry
            { name: 'Suitcase Carry',                       set_count: 3, rep_range: '20',    tempo: '0000', rest_seconds: 60,  notes: null,                                   order_index: 5,  superset_group: null },
            // Superset — leg volume + upper push
            { name: 'Machine Leg Press',                    set_count: 3, rep_range: '6-10',  tempo: '3110', rest_seconds: 90,  notes: null,                                   order_index: 6,  superset_group: 'B1' },
            { name: 'Push Up Negative',                     set_count: 3, rep_range: '5-6',   tempo: '5010', rest_seconds: 90,  notes: '5s lowering phase',                   order_index: 7,  superset_group: 'B1' },
            // Standalone — quad isolation + press
            { name: 'Leg Extensions',                       set_count: 2, rep_range: '20-25', tempo: '3011', rest_seconds: 60,  notes: null,                                   order_index: 8,  superset_group: null },
            { name: 'Neutral Grip Incline Dumbbell Press',  set_count: 3, rep_range: '6-10',  tempo: '3110', rest_seconds: 90,  notes: null,                                   order_index: 9,  superset_group: null },
            // Superset — triceps
            { name: 'Decline Skullcrushers',                set_count: 3, rep_range: '6-10',  tempo: '3010', rest_seconds: 60,  notes: null,                                   order_index: 10, superset_group: 'C1' },
            { name: 'Tricep Rope Pushdown',                 set_count: 3, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: null,                                   order_index: 11, superset_group: 'C1' },
          ],
        })

        // ── Day 3 — Upper Focus ───────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 3 — Upper Focus',
          week_number: w,
          session_type: 'Upper',
          exercises: [
            // Shoulder/thoracic warmup — 1 round
            { name: 'Thread the Needle',                              set_count: 1, rep_range: '4',    tempo: '0000', rest_seconds: 0,   notes: 'Mobility warmup — 1 round', order_index: 1,  superset_group: 'A1' },
            { name: 'Face Pulls',                                     set_count: 1, rep_range: '6',    tempo: '0000', rest_seconds: 0,   notes: null,                        order_index: 2,  superset_group: 'A1' },
            { name: 'Lat PNF Stretch',                                set_count: 1, rep_range: '8',    tempo: '0000', rest_seconds: 0,   notes: null,                        order_index: 3,  superset_group: 'A1' },
            { name: 'Cable External Rotation at 90° Abduction',      set_count: 1, rep_range: '10',   tempo: '2010', rest_seconds: 0,   notes: null,                        order_index: 4,  superset_group: 'A1' },
            { name: 'Flat Dumbbell Floor Press',                      set_count: 1, rep_range: '8-10', tempo: '3010', rest_seconds: 90,  notes: null,                        order_index: 5,  superset_group: 'A1' },
            // 531-style main upper lift
            { name: 'Chin Up',                                        set_count: wave.sets, rep_range: wave.reps, tempo: '3010', rest_seconds: 180, notes: wave.note,        order_index: 6,  superset_group: null },
            // Accessories — all standalone (Wendler-style boring but big)
            { name: 'Half Kneeling Anti-Rotation Kettlebell Press',   set_count: 3, rep_range: '8-10', tempo: '2010', rest_seconds: 90,  notes: null,                        order_index: 7,  superset_group: null },
            { name: 'Single Arm Dumbbell Row',                        set_count: 3, rep_range: '8-12', tempo: '3010', rest_seconds: 90,  notes: null,                        order_index: 8,  superset_group: null },
            { name: 'Romanian Deadlift',                              set_count: 3, rep_range: '8-10', tempo: '3010', rest_seconds: 90,  notes: null,                        order_index: 9,  superset_group: null },
            { name: 'Lying Hamstring Curl',                           set_count: 3, rep_range: '10-12',tempo: '3011', rest_seconds: 60,  notes: null,                        order_index: 10, superset_group: null },
            { name: 'Barbell Hip Thrusts',                            set_count: 3, rep_range: '10-15',tempo: '2011', rest_seconds: 90,  notes: null,                        order_index: 11, superset_group: null },
            { name: 'Barbell Curls',                                  set_count: 3, rep_range: '8-12', tempo: '3010', rest_seconds: 60,  notes: null,                        order_index: 12, superset_group: null },
          ],
        })
      }
      return sessions
    },
  },

  // ── Template 41 ── Female Physique 5 Day ─────────────────────────────────
  {
    id: 'female-physique-5day',
    name: 'Female Physique 5 Day',
    sessions_per_week: 5,
    goals: ['lean_gain', 'recomp'],
    difficulty: 'intermediate',
    generateSessions(weekCount) {
      const sessions = []
      for (let w = 1; w <= weekCount; w++) {
        // ── Day 1 — Lower (Quad & Glute) ─────────────────────────────────────
        sessions.push({
          day_label: 'Day 1 — Lower (Quad & Glute)',
          week_number: w,
          session_type: 'Lower',
          exercises: [
            // Warmup GS — 1 round
            { name: 'Cat Cow',                     set_count: 1, rep_range: '8',    tempo: '0000', rest_seconds: 0,   notes: 'Warmup — 1 round', order_index: 1,  superset_group: 'A1' },
            { name: 'Thoracic Rotation',            set_count: 1, rep_range: '6',    tempo: '0000', rest_seconds: 0,   notes: null,               order_index: 2,  superset_group: 'A1' },
            { name: 'Bird Dog',                     set_count: 1, rep_range: '6',    tempo: '0000', rest_seconds: 0,   notes: null,               order_index: 3,  superset_group: 'A1' },
            { name: 'Banded Glute Kickback',        set_count: 1, rep_range: '45s',  tempo: '0000', rest_seconds: 60,  notes: null,               order_index: 4,  superset_group: 'A1' },
            // Standalone primer
            { name: 'Goblet Cossack Squat',         set_count: 3, rep_range: '8',    tempo: '2220', rest_seconds: 60,  notes: null,               order_index: 5,  superset_group: null },
            // Superset B — main squat + anti-rotation core
            { name: 'Pause Back Squat',             set_count: 4, rep_range: '6-10', tempo: '2220', rest_seconds: 0,   notes: '2s pause at bottom', order_index: 6,  superset_group: 'B1' },
            { name: 'Stir The Pot',                 set_count: 4, rep_range: '8-10', tempo: '0000', rest_seconds: 120, notes: null,               order_index: 7,  superset_group: 'B1' },
            // Superset C — glute bilateral + unilateral
            { name: 'Barbell Hip Thrusts',          set_count: 3, rep_range: '6-10', tempo: '1220', rest_seconds: 0,   notes: null,               order_index: 8,  superset_group: 'C1' },
            { name: 'Bulgarian Split Squat',        set_count: 3, rep_range: '6-10', tempo: '2120', rest_seconds: 90,  notes: null,               order_index: 9,  superset_group: 'C1' },
            // Superset D — hamstring + unilateral quad
            { name: 'Rounded Back Extension',       set_count: 3, rep_range: '12-15',tempo: '2220', rest_seconds: 0,   notes: null,               order_index: 10, superset_group: 'D1' },
            { name: 'Walking Lunges',               set_count: 3, rep_range: '10-12',tempo: '2220', rest_seconds: 90,  notes: null,               order_index: 11, superset_group: 'D1' },
            // Superset E — hamstring curl + calf
            { name: 'Lying Hamstring Curl',         set_count: 3, rep_range: '6-10', tempo: '3011', rest_seconds: 0,   notes: null,               order_index: 12, superset_group: 'E1' },
            { name: 'Single Leg Calf Raise',        set_count: 4, rep_range: '8-12', tempo: '2220', rest_seconds: 60,  notes: null,               order_index: 13, superset_group: 'E1' },
            // Superset F — core finisher
            { name: 'Deadbug Heel Taps',            set_count: 3, rep_range: '8',    tempo: '0000', rest_seconds: 0,   notes: null,               order_index: 14, superset_group: 'F1' },
            { name: 'Forearm Plank',                set_count: 3, rep_range: '30s',  tempo: '0000', rest_seconds: 60,  notes: null,               order_index: 15, superset_group: 'F1' },
          ],
        })

        // ── Day 2 — Upper (Pull & Push) ───────────────────────────────────────
        sessions.push({
          day_label: 'Day 2 — Upper (Pull & Push)',
          week_number: w,
          session_type: 'Upper',
          exercises: [
            // Warmup GS — 1 round
            { name: 'Kettlebell Windmill',                   set_count: 1, rep_range: '6',    tempo: '2010', rest_seconds: 0,   notes: 'Warmup — 1 round', order_index: 1,  superset_group: 'A1' },
            { name: 'Kettlebell Bottom-Up Press',            set_count: 1, rep_range: '6',    tempo: '2010', rest_seconds: 0,   notes: null,               order_index: 2,  superset_group: 'A1' },
            { name: '30 Degree Dumbbell Press',              set_count: 1, rep_range: '6-10', tempo: '2010', rest_seconds: 60,  notes: null,               order_index: 3,  superset_group: 'A1' },
            // Superset B — vertical pull + overhead push
            { name: 'Pull Ups',                              set_count: 5, rep_range: '2-5',  tempo: '2120', rest_seconds: 0,   notes: 'Work up to max — include warm-up sets', order_index: 4,  superset_group: 'B1' },
            { name: 'Half Kneeling Arnold Press',            set_count: 3, rep_range: '6-10', tempo: '2120', rest_seconds: 120, notes: null,               order_index: 5,  superset_group: 'B1' },
            // Standalone — horizontal pull
            { name: 'Landmine Meadow Row',                  set_count: 4, rep_range: '6-10', tempo: '2120', rest_seconds: 90,  notes: null,               order_index: 6,  superset_group: null },
            // Superset C — hinge + lat
            { name: 'Trap Bar Deadlift',                    set_count: 3, rep_range: '6-10', tempo: '2220', rest_seconds: 0,   notes: null,               order_index: 7,  superset_group: 'C1' },
            { name: 'Single Arm Pulldown',                  set_count: 3, rep_range: '6-10', tempo: '2220', rest_seconds: 90,  notes: null,               order_index: 8,  superset_group: 'C1' },
            // Superset D — lateral + rear delt
            { name: 'Cable Lateral Raise',                  set_count: 3, rep_range: '6-10', tempo: '2220', rest_seconds: 0,   notes: null,               order_index: 9,  superset_group: 'D1' },
            { name: 'Standing Double Arm Face Pull',        set_count: 3, rep_range: '6-10', tempo: '2220', rest_seconds: 90,  notes: null,               order_index: 10, superset_group: 'D1' },
            // Superset E — arms antagonist
            { name: 'DB Hammer Curls',                      set_count: 3, rep_range: '6-10', tempo: '2220', rest_seconds: 0,   notes: null,               order_index: 11, superset_group: 'E1' },
            { name: 'Dumbbell Skullcrushers',               set_count: 3, rep_range: '6-10', tempo: '2220', rest_seconds: 90,  notes: null,               order_index: 12, superset_group: 'E1' },
            // Core finisher
            { name: 'Side Plank Rotations',                 set_count: 3, rep_range: '8',    tempo: '0000', rest_seconds: 0,   notes: null,               order_index: 13, superset_group: null },
            { name: 'Reverse Crunches',                     set_count: 3, rep_range: '8-12', tempo: '0000', rest_seconds: 60,  notes: null,               order_index: 14, superset_group: null },
          ],
        })

        // ── Day 3 — Lower/Full Body ───────────────────────────────────────────
        sessions.push({
          day_label: 'Day 3 — Lower / Full Body',
          week_number: w,
          session_type: 'Lower',
          exercises: [
            // Activation GS — 4 rounds
            { name: 'Sprinter Lunge with Kettlebell',                   set_count: 4, rep_range: '6-8',  tempo: '2010', rest_seconds: 0,   notes: 'Activation — 4 rounds', order_index: 1,  superset_group: 'A1' },
            { name: 'Cossack Squat',                                    set_count: 4, rep_range: '6-8',  tempo: '2010', rest_seconds: 0,   notes: null,                    order_index: 2,  superset_group: 'A1' },
            { name: 'Clams',                                            set_count: 4, rep_range: '12-15',tempo: '0000', rest_seconds: 0,   notes: null,                    order_index: 3,  superset_group: 'A1' },
            { name: 'Banded Deadbugs',                                  set_count: 4, rep_range: '8',    tempo: '0000', rest_seconds: 60,  notes: null,                    order_index: 4,  superset_group: 'A1' },
            // Superset B — hinge + anti-extension
            { name: 'Romanian Deadlift',                                set_count: 4, rep_range: '6-10', tempo: '2220', rest_seconds: 0,   notes: null,                    order_index: 5,  superset_group: 'B1' },
            { name: 'Bird Dog',                                         set_count: 4, rep_range: '6',    tempo: '0000', rest_seconds: 90,  notes: null,                    order_index: 6,  superset_group: 'B1' },
            // Standalone — quad
            { name: 'Machine Leg Press',                                set_count: 3, rep_range: '6-10', tempo: '2220', rest_seconds: 90,  notes: null,                    order_index: 7,  superset_group: null },
            // Superset C — glute + posterior chain
            { name: 'Barbell Hip Thrusts',                              set_count: 3, rep_range: '6-10', tempo: '2130', rest_seconds: 0,   notes: null,                    order_index: 8,  superset_group: 'C1' },
            { name: 'Rounded Back Extension',                           set_count: 3, rep_range: '12-15',tempo: '3010', rest_seconds: 90,  notes: null,                    order_index: 9,  superset_group: 'C1' },
            // Superset D — upper back + chest
            { name: 'Chest Supported Incline Dumbbell Row',             set_count: 3, rep_range: '6-10', tempo: '2220', rest_seconds: 0,   notes: null,                    order_index: 10, superset_group: 'D1' },
            { name: 'Dumbbell Pullover',                                set_count: 3, rep_range: '12-15',tempo: '3120', rest_seconds: 90,  notes: null,                    order_index: 11, superset_group: 'D1' },
            // Superset E — push + lateral
            { name: 'Half Kneeling Landmine Press',                     set_count: 3, rep_range: '6-10', tempo: '2230', rest_seconds: 0,   notes: null,                    order_index: 12, superset_group: 'E1' },
            { name: 'Cable Lateral Raise',                              set_count: 3, rep_range: '6-10', tempo: '1230', rest_seconds: 90,  notes: null,                    order_index: 13, superset_group: 'E1' },
            // Superset F — arms
            { name: 'Cable Single Arm Overhead Tricep Extension',       set_count: 4, rep_range: '6-10', tempo: '2220', rest_seconds: 0,   notes: null,                    order_index: 14, superset_group: 'F1' },
            { name: 'Standing Single Arm Cable Bicep Curl',             set_count: 4, rep_range: '6-10', tempo: '2220', rest_seconds: 60,  notes: null,                    order_index: 15, superset_group: 'F1' },
          ],
        })

        // ── Day 4 — Lower (Hinge & Glute) ────────────────────────────────────
        sessions.push({
          day_label: 'Day 4 — Lower (Hinge & Glute)',
          week_number: w,
          session_type: 'Lower',
          exercises: [
            // Mobility warmup — 1 round
            { name: 'Pigeon Pose',                          set_count: 1, rep_range: '60s',  tempo: '0000', rest_seconds: 0,   notes: 'Mobility warmup — 1 round each side', order_index: 1,  superset_group: 'A1' },
            { name: 'Couch Stretch',                        set_count: 1, rep_range: '60s',  tempo: '0000', rest_seconds: 0,   notes: null,                                  order_index: 2,  superset_group: 'A1' },
            { name: 'Frog Pose',                            set_count: 1, rep_range: '60s',  tempo: '0000', rest_seconds: 60,  notes: null,                                  order_index: 3,  superset_group: 'A1' },
            // Superset B — unilateral squat + lateral core
            { name: 'Bulgarian Split Squat',                set_count: 6, rep_range: '6-10', tempo: '2220', rest_seconds: 0,   notes: '6 sets — include warm-up sets',       order_index: 4,  superset_group: 'B1' },
            { name: 'Side Plank',                           set_count: 3, rep_range: '30s',  tempo: '0000', rest_seconds: 120, notes: null,                                  order_index: 5,  superset_group: 'B1' },
            // Superset C — hinge + quad isolation
            { name: 'Trap Bar Deadlift',                    set_count: 3, rep_range: '6-10', tempo: '2230', rest_seconds: 0,   notes: null,                                  order_index: 6,  superset_group: 'C1' },
            { name: 'Leg Extensions',                       set_count: 3, rep_range: '6-10', tempo: '2230', rest_seconds: 90,  notes: null,                                  order_index: 7,  superset_group: 'C1' },
            // Superset D — glute + unilateral leg
            { name: 'Barbell Hip Thrusts',                  set_count: 3, rep_range: '6-10', tempo: '2220', rest_seconds: 0,   notes: null,                                  order_index: 8,  superset_group: 'D1' },
            { name: 'Walking Lunges',                       set_count: 3, rep_range: '6-10', tempo: '1230', rest_seconds: 90,  notes: null,                                  order_index: 9,  superset_group: 'D1' },
            // Superset E — lat + push
            { name: 'Single Arm Pulldown',                  set_count: 3, rep_range: '6-10', tempo: '2120', rest_seconds: 0,   notes: null,                                  order_index: 10, superset_group: 'E1' },
            { name: 'Strict Dips',                          set_count: 3, rep_range: '6-10', tempo: '2220', rest_seconds: 90,  notes: null,                                  order_index: 11, superset_group: 'E1' },
            // Standalone — horizontal pull
            { name: 'Single Arm Dumbbell Row',              set_count: 3, rep_range: '6-10', tempo: '2220', rest_seconds: 90,  notes: null,                                  order_index: 12, superset_group: null },
            // Superset F — arms
            { name: 'Standing Rope Tricep Extension',       set_count: 3, rep_range: '6-10', tempo: '1230', rest_seconds: 0,   notes: null,                                  order_index: 13, superset_group: 'F1' },
            { name: 'Cable Bicep Curl',                     set_count: 3, rep_range: '6-10', tempo: '1230', rest_seconds: 60,  notes: null,                                  order_index: 14, superset_group: 'F1' },
          ],
        })

        // ── Day 5 — Upper (Press & Shoulder Focus) ────────────────────────────
        sessions.push({
          day_label: 'Day 5 — Upper (Press & Shoulder)',
          week_number: w,
          session_type: 'Upper',
          exercises: [
            // Shoulder/thoracic warmup — 1 round
            { name: 'Thread the Needle',                          set_count: 1, rep_range: '4',    tempo: '0000', rest_seconds: 0,   notes: 'Warmup — 1 round', order_index: 1,  superset_group: 'A1' },
            { name: 'Face Pulls',                                 set_count: 1, rep_range: '6',    tempo: '0000', rest_seconds: 0,   notes: null,               order_index: 2,  superset_group: 'A1' },
            { name: 'Lat PNF Stretch',                            set_count: 1, rep_range: '8',    tempo: '0000', rest_seconds: 0,   notes: null,               order_index: 3,  superset_group: 'A1' },
            { name: 'Cable External Rotation at 90° Abduction',  set_count: 1, rep_range: '10',   tempo: '2010', rest_seconds: 0,   notes: null,               order_index: 4,  superset_group: 'A1' },
            { name: 'Flat Dumbbell Floor Press',                  set_count: 1, rep_range: '8-10', tempo: '3010', rest_seconds: 60,  notes: null,               order_index: 5,  superset_group: 'A1' },
            // Superset B — overhead press + hanging abs
            { name: 'Barbell Strict Press',                       set_count: 4, rep_range: '6-10', tempo: '2220', rest_seconds: 0,   notes: null,               order_index: 6,  superset_group: 'B1' },
            { name: 'Hanging Knee Raise',                         set_count: 4, rep_range: '6-10', tempo: '2220', rest_seconds: 120, notes: null,               order_index: 7,  superset_group: 'B1' },
            // Superset C — rear delt + lateral
            { name: 'Rear Delt Cable Pull',                       set_count: 3, rep_range: '6-10', tempo: '1230', rest_seconds: 0,   notes: null,               order_index: 8,  superset_group: 'C1' },
            { name: 'Cable Lateral Raise',                        set_count: 3, rep_range: '6-10', tempo: '1230', rest_seconds: 90,  notes: null,               order_index: 9,  superset_group: 'C1' },
            // Superset D — adductor mobility + abs
            { name: 'Goblet Cossack Squat',                       set_count: 3, rep_range: '6-8',  tempo: '2220', rest_seconds: 0,   notes: null,               order_index: 10, superset_group: 'D1' },
            { name: 'Ab Roll Out',                                set_count: 3, rep_range: '6-10', tempo: '1220', rest_seconds: 90,  notes: null,               order_index: 11, superset_group: 'D1' },
            // Superset E — arms
            { name: 'Decline Skullcrushers',                      set_count: 3, rep_range: '6-10', tempo: '1220', rest_seconds: 0,   notes: null,               order_index: 12, superset_group: 'E1' },
            { name: 'Incline Dumbbell Curls',                     set_count: 3, rep_range: '6-10', tempo: '2220', rest_seconds: 90,  notes: null,               order_index: 13, superset_group: 'E1' },
            // Standalone finisher
            { name: 'Single Leg Calf Raise',                      set_count: 3, rep_range: '6-10', tempo: '2220', rest_seconds: 60,  notes: null,               order_index: 14, superset_group: null },
          ],
        })
      }
      return sessions
    },
  },

  // ── Template 42 ── Full Body ──────────────────────────────────────────────
  {
    id: 'full-body',
    name: 'Full Body',
    sessions_per_week: 4,
    goals: ['lean_gain', 'recomp'],
    difficulty: 'intermediate',
    generateSessions(weekCount) {
      const sessions = []
      for (let w = 1; w <= weekCount; w++) {
        // ── Day 1 — Full Body (Pull Focus) ───────────────────────────────────
        sessions.push({
          day_label: 'Day 1 — Full Body (Pull Focus)',
          week_number: w,
          session_type: 'Full Body',
          exercises: [
            // Warmup GS — 1 round
            { name: 'Child\'s Pose',                       set_count: 1, rep_range: '10',   tempo: '0000', rest_seconds: 0,   notes: 'Warmup — 1 round', order_index: 1,  superset_group: 'A1' },
            { name: 'Supine Arm Bar',                      set_count: 1, rep_range: '6',    tempo: '0000', rest_seconds: 0,   notes: null,               order_index: 2,  superset_group: 'A1' },
            { name: 'Half Kneeling Landmine Press',        set_count: 1, rep_range: '8',    tempo: '2010', rest_seconds: 0,   notes: null,               order_index: 3,  superset_group: 'A1' },
            { name: 'Dual Cable Straight Rope Pulldown',   set_count: 1, rep_range: '12-15',tempo: '3010', rest_seconds: 60,  notes: null,               order_index: 4,  superset_group: 'A1' },
            // Superset B — vertical pull + overhead press
            { name: 'Chin Up',                             set_count: 4, rep_range: '8-10', tempo: '3020', rest_seconds: 60,  notes: null,               order_index: 5,  superset_group: 'B1' },
            { name: 'Dumbbell Standing Overhead Press',    set_count: 4, rep_range: '8-10', tempo: '3020', rest_seconds: 90,  notes: null,               order_index: 6,  superset_group: 'B1' },
            // Superset C — tricep + rear delt/Y raise
            { name: 'Close Grip Barbell Bench Press',      set_count: 3, rep_range: '12-15',tempo: '3120', rest_seconds: 60,  notes: null,               order_index: 7,  superset_group: 'C1' },
            { name: 'Dumbbell Y Raises',                   set_count: 3, rep_range: '15-20',tempo: '3022', rest_seconds: 90,  notes: null,               order_index: 8,  superset_group: 'C1' },
            // Superset D — hamstring + unilateral squat
            { name: 'Single Leg Lying Leg Curl',           set_count: 3, rep_range: '8-10', tempo: '3021', rest_seconds: 60,  notes: null,               order_index: 9,  superset_group: 'D1' },
            { name: 'Bulgarian Split Squat',               set_count: 3, rep_range: '8-10', tempo: '3220', rest_seconds: 90,  notes: null,               order_index: 10, superset_group: 'D1' },
            // Superset E — core
            { name: 'Incline Bench Reverse Crunch',        set_count: 3, rep_range: '12-15',tempo: '3020', rest_seconds: 30,  notes: null,               order_index: 11, superset_group: 'E1' },
            { name: 'Cable Rope Crunches',                 set_count: 3, rep_range: '15-20',tempo: '3021', rest_seconds: 90,  notes: null,               order_index: 12, superset_group: 'E1' },
          ],
        })

        // ── Day 2 — Full Body (Squat/Hinge Focus) ────────────────────────────
        sessions.push({
          day_label: 'Day 2 — Full Body (Squat & Hinge)',
          week_number: w,
          session_type: 'Full Body',
          exercises: [
            // Warmup GS — 1 round
            { name: 'Heel Elevated Toe Reach',             set_count: 1, rep_range: '10',   tempo: '0000', rest_seconds: 0,   notes: 'Warmup — 1 round', order_index: 1,  superset_group: 'A1' },
            { name: 'Heel Elevated Goblet Squat',          set_count: 1, rep_range: '10',   tempo: '0000', rest_seconds: 0,   notes: null,               order_index: 2,  superset_group: 'A1' },
            { name: 'Side Plank With Pronation',           set_count: 1, rep_range: '8s',   tempo: '0000', rest_seconds: 0,   notes: null,               order_index: 3,  superset_group: 'A1' },
            { name: 'Front Foot Elevated Split Squat',     set_count: 1, rep_range: '8',    tempo: '2010', rest_seconds: 60,  notes: null,               order_index: 4,  superset_group: 'A1' },
            // Superset B — squat + hinge
            { name: 'Heel Elevated Barbell Front Squat',   set_count: 3, rep_range: '8-10', tempo: '3220', rest_seconds: 60,  notes: null,               order_index: 5,  superset_group: 'B1' },
            { name: 'Romanian Deadlift',                   set_count: 3, rep_range: '8-10', tempo: '3220', rest_seconds: 90,  notes: null,               order_index: 6,  superset_group: 'B1' },
            // Superset C — horizontal pull + push
            { name: 'Wide Grip Seated Cable Row',          set_count: 3, rep_range: '8-10', tempo: '3021', rest_seconds: 60,  notes: null,               order_index: 7,  superset_group: 'C1' },
            { name: 'Feet Elevated Push Ups',              set_count: 3, rep_range: '8-10', tempo: '3120', rest_seconds: 90,  notes: null,               order_index: 8,  superset_group: 'C1' },
            // Superset D — bicep + tricep
            { name: 'Alternating Dumbbell Curl',           set_count: 3, rep_range: '8-10', tempo: '2020', rest_seconds: 0,   notes: null,               order_index: 9,  superset_group: 'D1' },
            { name: 'Tricep Dips',                         set_count: 3, rep_range: '8-10', tempo: '3120', rest_seconds: 90,  notes: null,               order_index: 10, superset_group: 'D1' },
            // Superset E — arms isolation finisher
            { name: 'Dual Cable X-Body Tricep Extension',  set_count: 2, rep_range: '12-15',tempo: '3021', rest_seconds: 0,   notes: null,               order_index: 11, superset_group: 'E1' },
            { name: 'Dumbbell Skullcrushers',              set_count: 2, rep_range: '12-15',tempo: '3120', rest_seconds: 60,  notes: null,               order_index: 12, superset_group: 'E1' },
          ],
        })

        // ── Day 3 — Full Body (Push/Chest Focus) ─────────────────────────────
        sessions.push({
          day_label: 'Day 3 — Full Body (Push & Chest)',
          week_number: w,
          session_type: 'Full Body',
          exercises: [
            // Warmup GS — 1 round
            { name: 'Child\'s Pose',                             set_count: 1, rep_range: '10',   tempo: '0000', rest_seconds: 0,   notes: 'Warmup — 1 round', order_index: 1,  superset_group: 'A1' },
            { name: 'Supine Arm Bar',                            set_count: 1, rep_range: '8',    tempo: '0000', rest_seconds: 0,   notes: null,               order_index: 2,  superset_group: 'A1' },
            { name: 'Side Plank With Pronation',                 set_count: 1, rep_range: '8s',   tempo: '0000', rest_seconds: 0,   notes: null,               order_index: 3,  superset_group: 'A1' },
            { name: 'Deficit Push Ups',                          set_count: 1, rep_range: '10',   tempo: '3010', rest_seconds: 60,  notes: null,               order_index: 4,  superset_group: 'A1' },
            // Superset B — incline press + row
            { name: 'Incline Dumbbell Press',                    set_count: 3, rep_range: '8-10', tempo: '3120', rest_seconds: 45,  notes: null,               order_index: 5,  superset_group: 'B1' },
            { name: 'Single Arm Dumbbell Row on Incline Bench',  set_count: 3, rep_range: '8-10', tempo: '2020', rest_seconds: 90,  notes: null,               order_index: 6,  superset_group: 'B1' },
            // Superset C — leg press + chest isolation
            { name: 'Machine Leg Press',                         set_count: 3, rep_range: '12-15',tempo: '3220', rest_seconds: 90,  notes: null,               order_index: 7,  superset_group: 'C1' },
            { name: 'Pec Deck Machine',                          set_count: 3, rep_range: '12-15',tempo: '3220', rest_seconds: 90,  notes: null,               order_index: 8,  superset_group: 'C1' },
            // Superset D — posterior chain + abs
            { name: '45 Degree Back Extension',                  set_count: 3, rep_range: '12-15',tempo: '3022', rest_seconds: 60,  notes: null,               order_index: 9,  superset_group: 'D1' },
            { name: 'Cable Rope Crunches',                       set_count: 3, rep_range: '12-15',tempo: '3021', rest_seconds: 60,  notes: null,               order_index: 10, superset_group: 'D1' },
            // Standalone finisher
            { name: 'Standing Calf Raise',                       set_count: 3, rep_range: '12-15',tempo: '3220', rest_seconds: 60,  notes: null,               order_index: 11, superset_group: null },
          ],
        })

        // ── Day 4 — Full Body (Lat/Hinge Focus) ──────────────────────────────
        sessions.push({
          day_label: 'Day 4 — Full Body (Lat & Hinge)',
          week_number: w,
          session_type: 'Full Body',
          exercises: [
            // Warmup GS — 1 round
            { name: 'Child\'s Pose',                             set_count: 1, rep_range: '10',   tempo: '0000', rest_seconds: 0,   notes: 'Warmup — 1 round', order_index: 1,  superset_group: 'A1' },
            { name: 'Supine Arm Bar',                            set_count: 1, rep_range: '8',    tempo: '0000', rest_seconds: 0,   notes: null,               order_index: 2,  superset_group: 'A1' },
            { name: 'Double Rope Straight Arm Pulldown',         set_count: 1, rep_range: '15',   tempo: '3010', rest_seconds: 0,   notes: null,               order_index: 3,  superset_group: 'A1' },
            { name: 'Deficit Push Ups',                          set_count: 1, rep_range: '10',   tempo: '3010', rest_seconds: 60,  notes: null,               order_index: 4,  superset_group: 'A1' },
            // Superset B — lat + tricep
            { name: 'Wide Grip Lat Pulldown',                    set_count: 3, rep_range: '8-10', tempo: '3021', rest_seconds: 0,   notes: null,               order_index: 5,  superset_group: 'B1' },
            { name: 'Cable Tricep Pushdown (Straight Bar)',       set_count: 3, rep_range: '10-15',tempo: '3021', rest_seconds: 90,  notes: null,               order_index: 6,  superset_group: 'B1' },
            // Superset C — single-arm lat + bicep
            { name: 'Single Arm Cable Lat Row',                  set_count: 3, rep_range: '12-15',tempo: '3021', rest_seconds: 0,   notes: null,               order_index: 7,  superset_group: 'C1' },
            { name: 'Standing Single Arm Cable Bicep Curl',      set_count: 3, rep_range: '12-15',tempo: '3021', rest_seconds: 90,  notes: null,               order_index: 8,  superset_group: 'C1' },
            // Standalone — deadlift + lunges
            { name: 'Deficit Deadlift',                          set_count: 3, rep_range: '8-10', tempo: '4020', rest_seconds: 120, notes: '4s eccentric — full stretch at bottom', order_index: 9,  superset_group: null },
            { name: 'Walking Lunges',                            set_count: 2, rep_range: '16',   tempo: '2020', rest_seconds: 90,  notes: null,               order_index: 10, superset_group: null },
          ],
        })
      }
      return sessions
    },
  },

  // ── Template 43 ── Full Body / Upper / Lower / Accessories ───────────────
  {
    id: 'fb-upper-lower-accessories',
    name: 'Full Body / Upper / Lower / Accessories',
    sessions_per_week: 4,
    goals: ['lean_gain', 'strength'],
    difficulty: 'advanced',
    generateSessions(weekCount) {
      const sessions = []
      for (let w = 1; w <= weekCount; w++) {
        // ── Day 1 — Full Body ─────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 1 — Full Body',
          week_number: w,
          session_type: 'Full Body',
          exercises: [
            // Warmup GS — 1 round
            { name: 'Single Leg Bridge',                                set_count: 1, rep_range: '5-6',   tempo: '0000', rest_seconds: 0,   notes: 'Warmup — 1 round', order_index: 1,  superset_group: 'A1' },
            { name: 'Copenhagen Plank',                                 set_count: 1, rep_range: '30s',   tempo: '0000', rest_seconds: 0,   notes: null,               order_index: 2,  superset_group: 'A1' },
            { name: 'Front Foot Elevated Split Squat (Contralateral)',   set_count: 1, rep_range: '6-8',   tempo: '3110', rest_seconds: 0,   notes: null,               order_index: 3,  superset_group: 'A1' },
            { name: 'Hanging Knee Raises',                              set_count: 1, rep_range: '15-20', tempo: '3010', rest_seconds: 0,   notes: null,               order_index: 4,  superset_group: 'A1' },
            { name: 'Ab Roll Out',                                      set_count: 1, rep_range: '10-12', tempo: '3110', rest_seconds: 60,  notes: null,               order_index: 5,  superset_group: 'A1' },
            // Standalones — shoulder press + lateral
            { name: 'Prime Shoulder Press',                             set_count: 2, rep_range: '6-10',  tempo: '3110', rest_seconds: 150, notes: null,               order_index: 6,  superset_group: null },
            { name: 'Seated Lateral Raise',                             set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 7,  superset_group: null },
            // Superset B — incline press + lat pulldown
            { name: 'Prime Incline Chest Press Machine',                set_count: 2, rep_range: '6-10',  tempo: '3110', rest_seconds: 150, notes: null,               order_index: 8,  superset_group: 'B1' },
            { name: 'Prone Lat Pulldown',                               set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 120, notes: null,               order_index: 9,  superset_group: 'B1' },
            // Superset C — row + trap
            { name: 'Seated Cable Row',                                 set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 120, notes: null,               order_index: 10, superset_group: 'C1' },
            { name: 'Kelso Shrugs',                                     set_count: 2, rep_range: '10-15', tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 11, superset_group: 'C1' },
            // Superset D — arms antagonist
            { name: 'Cross Body Tricep Extension',                      set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 12, superset_group: 'D1' },
            { name: 'Behind-The-Back Dual Cable D-Handle Curls',        set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 13, superset_group: 'D1' },
            // Standalones — leg press + calf
            { name: 'Single Leg 45 Degree Leg Press',                   set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 14, superset_group: null },
            { name: 'Standing Calf Raise',                              set_count: 2, rep_range: '6-10',  tempo: '3210', rest_seconds: 90,  notes: null,               order_index: 15, superset_group: null },
            // Superset E — hip adductor + abductor
            { name: 'Hip Adductor Machine',                             set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 45,  notes: null,               order_index: 16, superset_group: 'E1' },
            { name: 'Hip Abductor Machine',                             set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 17, superset_group: 'E1' },
          ],
        })

        // ── Day 2 — Upper ─────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 2 — Upper',
          week_number: w,
          session_type: 'Upper',
          exercises: [
            // Warmup GS — 1 round
            { name: 'Child\'s Pose',                         set_count: 1, rep_range: '6-8',   tempo: '0000', rest_seconds: 0,   notes: 'Warmup — 1 round', order_index: 1,  superset_group: 'A1' },
            { name: 'Kettlebell Arm Bar',                    set_count: 1, rep_range: '6-8',   tempo: '2010', rest_seconds: 0,   notes: null,               order_index: 2,  superset_group: 'A1' },
            { name: 'Kneeling Cable Crunches',               set_count: 1, rep_range: '12-15', tempo: '3011', rest_seconds: 0,   notes: null,               order_index: 3,  superset_group: 'A1' },
            { name: '45 Degree Side Bends',                  set_count: 1, rep_range: '10-12', tempo: '3010', rest_seconds: 0,   notes: null,               order_index: 4,  superset_group: 'A1' },
            { name: 'Deficit Push Ups',                      set_count: 1, rep_range: '10-12', tempo: '3110', rest_seconds: 60,  notes: null,               order_index: 5,  superset_group: 'A1' },
            // Superset B — overhead + vertical pull (heavy)
            { name: 'Smith Machine Behind The Neck Press',   set_count: 5, rep_range: '2-3',   tempo: '3110', rest_seconds: 120, notes: 'Heavy — include warm-up sets; 5 total sets', order_index: 6,  superset_group: 'B1' },
            { name: 'Pull Ups',                              set_count: 5, rep_range: '2-3',   tempo: '3010', rest_seconds: 120, notes: null,               order_index: 7,  superset_group: 'B1' },
            // Standalones — incline + neutral grip pull + row + dips
            { name: '30 Degree Dumbbell Incline Press',      set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 120, notes: null,               order_index: 8,  superset_group: null },
            { name: 'Neutral Grip Pull Up',                  set_count: 1, rep_range: '12-15', tempo: '3010', rest_seconds: 120, notes: 'Back-off set',     order_index: 9,  superset_group: null },
            { name: 'Seated Chest Supported Row',            set_count: 2, rep_range: '6-8',   tempo: '3010', rest_seconds: 120, notes: null,               order_index: 10, superset_group: null },
            { name: 'Tricep Dips',                           set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 120, notes: null,               order_index: 11, superset_group: null },
            { name: 'Dual Cable Rear Delt',                  set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 12, superset_group: null },
            { name: 'Straight Arm Pushdowns',                set_count: 2, rep_range: '8-12',  tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 13, superset_group: null },
            // Superset C — arms
            { name: 'EZ Bar Spider Curl',                    set_count: 2, rep_range: '5-8',   tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 14, superset_group: 'C1' },
            { name: 'Ring Skullcrushers',                    set_count: 2, rep_range: '10-15', tempo: '3110', rest_seconds: 90,  notes: null,               order_index: 15, superset_group: 'C1' },
          ],
        })

        // ── Day 3 — Lower ─────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 3 — Lower',
          week_number: w,
          session_type: 'Lower',
          exercises: [
            // Warmup GS — 1 round
            { name: 'Single Leg Hamstring Bridge Iso (Foam Roller)', set_count: 1, rep_range: '6-8',   tempo: '2010', rest_seconds: 0,   notes: 'Warmup — 1 round', order_index: 1,  superset_group: 'A1' },
            { name: 'Copenhagen Plank',                              set_count: 1, rep_range: '30s',   tempo: '0000', rest_seconds: 0,   notes: null,               order_index: 2,  superset_group: 'A1' },
            { name: 'Kickstance RDL with Contralateral Load',        set_count: 1, rep_range: '6-8',   tempo: '2110', rest_seconds: 0,   notes: null,               order_index: 3,  superset_group: 'A1' },
            { name: '45 Degree Hip Extension',                       set_count: 1, rep_range: '15-20', tempo: '3010', rest_seconds: 60,  notes: null,               order_index: 4,  superset_group: 'A1' },
            // Superset B — hip adductor + abductor
            { name: 'Hip Adductor Machine',                          set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 0,   notes: null,               order_index: 5,  superset_group: 'B1' },
            { name: 'Cable Hip Abduction',                           set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 6,  superset_group: 'B1' },
            // Standalones — hamstring, hinge, lunge, quad, squat
            { name: 'Prone Hamstring Curl Machine',                  set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 7,  superset_group: null },
            { name: 'Barbell Romanian Deadlift',                     set_count: 3, rep_range: '6-10',  tempo: '3010', rest_seconds: 150, notes: null,               order_index: 8,  superset_group: null },
            { name: 'Dumbbell Reverse Lunge',                        set_count: 2, rep_range: '10-12', tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 9,  superset_group: null },
            { name: 'Single Leg Leg Extension Machine',              set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 10, superset_group: null },
            { name: 'Pendulum Squat',                                set_count: 2, rep_range: '6-10',  tempo: '3010', rest_seconds: 120, notes: null,               order_index: 11, superset_group: null },
            // Superset C — abs + calf
            { name: 'Incline Garhammer Raise',                       set_count: 2, rep_range: '10-20', tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 12, superset_group: 'C1' },
            { name: 'Standing Calf Raise',                           set_count: 2, rep_range: '10-15', tempo: '3110', rest_seconds: 90,  notes: null,               order_index: 13, superset_group: 'C1' },
          ],
        })

        // ── Day 4 — Accessories ───────────────────────────────────────────────
        sessions.push({
          day_label: 'Day 4 — Accessories',
          week_number: w,
          session_type: 'Upper',
          exercises: [
            // Warmup GS — 1 round
            { name: 'Kettlebell Windmill',               set_count: 1, rep_range: '5',    tempo: '2010', rest_seconds: 0,   notes: 'Warmup — 1 round', order_index: 1,  superset_group: 'A1' },
            { name: 'Kneeling Cable Crunches',           set_count: 1, rep_range: '12-15',tempo: '3010', rest_seconds: 0,   notes: null,               order_index: 2,  superset_group: 'A1' },
            { name: '45 Degree Side Bends',              set_count: 1, rep_range: '6-8',  tempo: '3010', rest_seconds: 0,   notes: null,               order_index: 3,  superset_group: 'A1' },
            { name: 'Deficit Push Ups',                  set_count: 1, rep_range: '10-12',tempo: '3110', rest_seconds: 60,  notes: null,               order_index: 4,  superset_group: 'A1' },
            // Superset B — vertical pull + JM press
            { name: 'Chin Up',                           set_count: 3, rep_range: '6-10', tempo: '3010', rest_seconds: 45,  notes: null,               order_index: 5,  superset_group: 'B1' },
            { name: 'Banded Smith JM Press',             set_count: 3, rep_range: '6-10', tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 6,  superset_group: 'B1' },
            // Standalones — lateral + rear delt
            { name: 'Single Arm Cable Lateral Raise',    set_count: 2, rep_range: '6-10', tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 7,  superset_group: null },
            { name: 'Single Arm Rear Delt Cable Fly',    set_count: 2, rep_range: '10-12',tempo: '3010', rest_seconds: 60,  notes: null,               order_index: 8,  superset_group: null },
            // Superset C — bicep isolation
            { name: 'Dumbbell Spider Curl',              set_count: 2, rep_range: '6-10', tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 9,  superset_group: 'C1' },
            { name: 'Ring Skullcrushers',                set_count: 2, rep_range: '5-7',  tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 10, superset_group: 'C1' },
            // Superset D — arms finisher
            { name: 'Cross Body Hammer Curl',            set_count: 2, rep_range: '6-10', tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 11, superset_group: 'D1' },
            { name: 'Dual Rope Pushdowns',               set_count: 2, rep_range: '6-10', tempo: '3010', rest_seconds: 90,  notes: null,               order_index: 12, superset_group: 'D1' },
          ],
        })
      }
      return sessions
    },
  },

  // ── Template 44 — Full Body Contrast Blend ──────────────────────────────────
  {
    id: 'full-body-contrast-blend',
    name: 'Full Body Contrast Blend',
    description: 'Four-session full-body programme pairing heavy compound lifts with plyometric contrast movements to potentiate the nervous system. Each session opens with a mobility/activation giant set, then moves into contrast tri-sets or supersets (strength lift → reactive effort → hypertrophy accessory). Power output, structural balance, and isolation finishers are all addressed within each session.',
    goals: ['lean_gain', 'strength'],
    phase: 'Accumulation / Intensification',
    sessions_per_week: 4,
    difficulty: 'advanced',
    icon: '⚡',
    color: '#7c3aed',
    tags: ['full-body', 'contrast', 'plyometric', 'PAP', 'strength', 'power', '4-day'],
    generateSessions(weeks = 8) {
      const sessions = []

      for (let week = 1; week <= weeks; week++) {

        // ── Full Body 1 ──────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Full Body 1 — Squat Contrast',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Activation giant set
            { name: 'Single Leg Hamstring Bridge Isometric', set_count: 1, rep_range: '20-30s/side', tempo: '0000', rest_seconds: 10, notes: 'Activation warmup', order_index: 0, superset_group: 'A' },
            { name: 'Goblet Cossack Squat',                  set_count: 1, rep_range: '8/side',       tempo: '3010', rest_seconds: 10, notes: 'Hip mobility',      order_index: 1, superset_group: 'A' },
            { name: 'Assisted Hip Airplane',                  set_count: 1, rep_range: '8/side',       tempo: '2010', rest_seconds: 60, notes: 'Hip stability',     order_index: 2, superset_group: 'A' },
            // Contrast tri-set B — squat + jump + pull
            { name: 'Heel Elevated Back Squat',  set_count: 3, rep_range: '3',     tempo: '3110', rest_seconds: 10,  notes: 'Heavy — potentiation lift',         order_index: 3, superset_group: 'B' },
            { name: 'Counterbalance Box Jump',   set_count: 3, rep_range: '4-6',   tempo: '0000', rest_seconds: 10,  notes: 'Maximal intent — full reset each',  order_index: 4, superset_group: 'B' },
            { name: 'Pull Ups',                  set_count: 3, rep_range: '4-6',   tempo: '3010', rest_seconds: 120, notes: 'Weighted if possible',              order_index: 5, superset_group: 'B' },
            // Contrast tri-set C — hip hinge + broad jump + press
            { name: 'Barbell Romanian Deadlift', set_count: 3, rep_range: '6-10',  tempo: '3110', rest_seconds: 10,  notes: 'Control the eccentric',            order_index: 6, superset_group: 'C' },
            { name: 'Broad Jumps',               set_count: 3, rep_range: '5-6',   tempo: '0000', rest_seconds: 10,  notes: 'Max distance — full reset each',   order_index: 7, superset_group: 'C' },
            { name: '45° Incline DB Press',      set_count: 3, rep_range: '6-10',  tempo: '3010', rest_seconds: 90,  notes: 'Upper chest emphasis',             order_index: 8, superset_group: 'C' },
            // Standalone — delt isolation
            { name: 'Single Arm Cable Lateral Raise', set_count: 3, rep_range: '10-15', tempo: '2010', rest_seconds: 45, notes: 'Strict — no body English', order_index: 9, superset_group: null },
            // Superset D — arms
            { name: 'Dual Cable Bicep Curl',      set_count: 3, rep_range: '10-15', tempo: '2010', rest_seconds: 10, notes: 'Full supination at top',    order_index: 10, superset_group: 'D' },
            { name: 'X Cable Tricep Extension',   set_count: 3, rep_range: '10-15', tempo: '2010', rest_seconds: 60, notes: 'Cross-body cable stretch',  order_index: 11, superset_group: 'D' },
          ],
        })

        // ── Full Body 2 ──────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Full Body 2 — Trap Bar Contrast',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Activation giant set
            { name: 'Kettlebell Arm Bar',   set_count: 1, rep_range: '5/side',  tempo: '2000', rest_seconds: 10, notes: 'Shoulder stability',  order_index: 0, superset_group: 'A' },
            { name: 'Kickstance RDL',       set_count: 1, rep_range: '8/side',  tempo: '3010', rest_seconds: 10, notes: 'Hip hinge patterning', order_index: 1, superset_group: 'A' },
            { name: 'Single Leg Pogos',     set_count: 1, rep_range: '30s/side',tempo: '0000', rest_seconds: 60, notes: 'Calf/ankle activation', order_index: 2, superset_group: 'A' },
            // Contrast tri-set B — trap bar
            { name: 'Trap Bar Deadlift',        set_count: 3, rep_range: '3',    tempo: '3010', rest_seconds: 10,  notes: 'Heavy — near maximal',           order_index: 3, superset_group: 'B' },
            { name: 'Trap Bar Squat Jump',       set_count: 3, rep_range: '4-5', tempo: '0000', rest_seconds: 10,  notes: 'Light trap bar — maximal jump',   order_index: 4, superset_group: 'B' },
            { name: 'Z Press',                   set_count: 3, rep_range: '6-10',tempo: '3010', rest_seconds: 120, notes: 'Seated on floor — strict OHP',    order_index: 5, superset_group: 'B' },
            // Superset C — back + press
            { name: 'Chest Supported Incline DB Row', set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 10, notes: 'Elbows flared — upper back', order_index: 6, superset_group: 'C' },
            { name: 'Landmine Rotational Press',      set_count: 3, rep_range: '5-6/side', tempo: '2010', rest_seconds: 90, notes: 'Core rotation + press',  order_index: 7, superset_group: 'C' },
            // Superset D — rear delt + lunge
            { name: 'Rear Delt Cable Fly',  set_count: 2, rep_range: '10-15', tempo: '2010', rest_seconds: 10, notes: 'Face-down on incline or cable', order_index: 8,  superset_group: 'D' },
            { name: 'Walking Lunges',       set_count: 2, rep_range: '10-12', tempo: '3010', rest_seconds: 90, notes: 'Controlled — full stride',     order_index: 9,  superset_group: 'D' },
            // Superset E — finishers
            { name: 'Incline Garhammer Raise', set_count: 2, rep_range: '10-15', tempo: '2010', rest_seconds: 10, notes: 'Incline bench — hip flexor/core', order_index: 10, superset_group: 'E' },
            { name: 'DB Single Leg Calf Raise',set_count: 2, rep_range: '12-15', tempo: '3010', rest_seconds: 60, notes: 'Full ROM — heel drop',           order_index: 11, superset_group: 'E' },
          ],
        })

        // ── Full Body 3 ──────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Full Body 3 — Hip Thrust Contrast',
          week_number: week,
          session_type: 'hypertrophy',
          exercises: [
            // Activation giant set
            { name: '90/90 Breathing Reset',               set_count: 1, rep_range: '5 breaths',  tempo: '0000', rest_seconds: 10, notes: 'Diaphragmatic reset',         order_index: 0, superset_group: 'A' },
            { name: 'GHD Rounded Back Hip Extension',      set_count: 1, rep_range: '10-12',       tempo: '3010', rest_seconds: 10, notes: 'Spinal erector activation',   order_index: 1, superset_group: 'A' },
            { name: 'FFE Split Squat Contralateral Reach', set_count: 1, rep_range: '8/side',       tempo: '3010', rest_seconds: 10, notes: 'Front-foot elevated',         order_index: 2, superset_group: 'A' },
            { name: 'Deficit Plate Push Ups',              set_count: 1, rep_range: '8-10',         tempo: '3210', rest_seconds: 60, notes: 'Full pec stretch at bottom', order_index: 3, superset_group: 'A' },
            // Contrast tri-set B — hip thrust
            { name: 'Hip Thrusts',            set_count: 3, rep_range: '12-15', tempo: '3110', rest_seconds: 10,  notes: 'Heavy — glute focus',           order_index: 4, superset_group: 'B' },
            { name: 'Flat Barbell Bench Press',set_count: 3, rep_range: '3',    tempo: '3110', rest_seconds: 10,  notes: 'Heavy — potentiation lift',     order_index: 5, superset_group: 'B' },
            { name: 'Medicine Ball Chest Pass',set_count: 3, rep_range: '6-8',  tempo: '0000', rest_seconds: 90,  notes: 'Explosive — against wall/partner', order_index: 6, superset_group: 'B' },
            // Contrast superset C — squat + jump
            { name: 'Heel Elevated Back Squat',   set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Moderate load — hypertrophy focus', order_index: 7, superset_group: 'C' },
            { name: 'Band Assisted Squat Jumps',  set_count: 3, rep_range: '5-6',   tempo: '0000', rest_seconds: 90,  notes: 'Band support — reactive jump',      order_index: 8, superset_group: 'C' },
            // Superset D — pull + delt
            { name: 'Lat Pulldown',     set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 10, notes: 'Full stretch at top',     order_index: 9,  superset_group: 'D' },
            { name: 'DB Lateral Raise', set_count: 3, rep_range: '10-15', tempo: '2010', rest_seconds: 60, notes: 'Lead with elbow — strict', order_index: 10, superset_group: 'D' },
            // Superset E — arms
            { name: 'DB Skullcrusher',    set_count: 3, rep_range: '10-15', tempo: '3010', rest_seconds: 10, notes: 'Control — full ROM',       order_index: 11, superset_group: 'E' },
            { name: 'DB Hammer Curl',     set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60, notes: 'Neutral grip throughout', order_index: 12, superset_group: 'E' },
          ],
        })

        // ── Full Body 4 ──────────────────────────────────────────────────────
        sessions.push({
          day_label: 'Full Body 4 — Row Contrast',
          week_number: week,
          session_type: 'strength',
          exercises: [
            // Core activation giant set
            { name: 'Kettlebell Windmill',   set_count: 1, rep_range: '6-8/side', tempo: '3010', rest_seconds: 10, notes: 'Shoulder + hip mobility', order_index: 0, superset_group: 'A' },
            { name: 'Hanging Knee Raise',    set_count: 1, rep_range: '10-12',     tempo: '2010', rest_seconds: 10, notes: 'Core activation',        order_index: 1, superset_group: 'A' },
            { name: 'Ab Roll Out',           set_count: 1, rep_range: '10-15',     tempo: '3010', rest_seconds: 60, notes: 'Full extension',         order_index: 2, superset_group: 'A' },
            // Contrast superset B — row + rotational
            { name: 'Bentover Barbell Row',          set_count: 2, rep_range: '6-10', tempo: '3010', rest_seconds: 10,  notes: 'Horizontal pull — heavy',        order_index: 3, superset_group: 'B' },
            { name: 'Rotational Medicine Ball Slams',set_count: 2, rep_range: '6-8',  tempo: '0000', rest_seconds: 90,  notes: 'Explosive — alternate sides',    order_index: 4, superset_group: 'B' },
            // Contrast superset C — squat + box jump
            { name: 'Heel Elevated Safety Bar / Front Squat', set_count: 3, rep_range: '4-6', tempo: '3110', rest_seconds: 10,  notes: 'Heavy — safety bar preferred', order_index: 5, superset_group: 'C' },
            { name: 'Box Jump Step Down',             set_count: 3, rep_range: '4-6', tempo: '0000', rest_seconds: 90,  notes: 'Step down — no drop landing',  order_index: 6, superset_group: 'C' },
            // Superset D — press + single leg
            { name: 'Hook Lying DB Press',         set_count: 2, rep_range: '6-8',   tempo: '3010', rest_seconds: 10,  notes: 'Neutral grip — full pec stretch', order_index: 7, superset_group: 'D' },
            { name: 'Single Leg 45° Leg Press',    set_count: 2, rep_range: '10-12', tempo: '3010', rest_seconds: 90,  notes: 'Hip dominant foot position',     order_index: 8, superset_group: 'D' },
            // Superset E — hamstring + pec
            { name: 'Seated Hamstring Curl', set_count: 2, rep_range: '10-15', tempo: '3010', rest_seconds: 10, notes: 'Dorsiflexed — greater ROM', order_index: 9,  superset_group: 'E' },
            { name: 'Pec Deck Machine',      set_count: 2, rep_range: '10-15', tempo: '3010', rest_seconds: 60, notes: 'Full stretch at open',    order_index: 10, superset_group: 'E' },
            // Standalone — curl
            { name: 'Alternating DB Curl',   set_count: 2, rep_range: '8-10',  tempo: '2010', rest_seconds: 60, notes: 'Supinate fully at top',  order_index: 11, superset_group: null },
            // Superset F — tricep + preacher
            { name: 'Behind Head Rope Tricep Extension', set_count: 2, rep_range: '10-15', tempo: '3010', rest_seconds: 10, notes: 'Overhead — full long-head stretch', order_index: 12, superset_group: 'F' },
            { name: 'Preacher Curl Machine',             set_count: 2, rep_range: '10-15', tempo: '3010', rest_seconds: 60, notes: 'Slow eccentric',                  order_index: 13, superset_group: 'F' },
          ],
        })
      }

      return sessions
    },
  },

  // ── Template 45 — German Body Composition ────────────────────────────────────
  {
    id: 'german-body-composition',
    name: 'German Body Composition',
    description: 'Poliquin\'s metabolic fat-loss protocol using antagonist supersets with short rest to maximise growth hormone release. Three sessions per week alternate upper and lower emphasis. High reps (10–15), 30–60s rest, and strategic exercise pairing create significant metabolic stress. Optional conditioning finishers accelerate fat loss.',
    goals: ['recomp', 'cut'],
    phase: 'Fat Loss / Body Recomposition',
    sessions_per_week: 3,
    difficulty: 'intermediate',
    icon: '🔥',
    color: '#dc2626',
    tags: ['GBC', 'fat-loss', 'superset', 'antagonist', 'metabolic', '3-day'],
    generateSessions(weeks = 8) {
      const sessions = []
      const DAYS = [
        {
          day_label: 'Day A — Lower Emphasis',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Back Squat',                set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'GBC superset — move immediately to A2',      order_index: 0, superset_group: 'A1' },
            { name: 'Incline DB Press',          set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60,  notes: 'GBC superset — rest 60s then return to A1',  order_index: 1, superset_group: 'A2' },
            { name: 'Romanian Deadlift',         set_count: 4, rep_range: '10-12', tempo: '3110', rest_seconds: 10,  notes: 'GBC superset',                               order_index: 2, superset_group: 'B1' },
            { name: 'Seated Cable Row',          set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60,  notes: 'GBC superset',                               order_index: 3, superset_group: 'B2' },
            { name: 'Leg Press',                 set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 10,  notes: 'GBC finisher superset',                      order_index: 4, superset_group: 'C1' },
            { name: 'Lat Pulldown',              set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 60,  notes: 'GBC finisher superset',                      order_index: 5, superset_group: 'C2' },
          ],
        },
        {
          day_label: 'Day B — Upper Emphasis',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Flat Barbell Bench Press',  set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'GBC superset',                               order_index: 0, superset_group: 'A1' },
            { name: 'Bent Over Barbell Row',     set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60,  notes: 'GBC superset',                               order_index: 1, superset_group: 'A2' },
            { name: 'Leg Curl',                  set_count: 4, rep_range: '10-12', tempo: '3110', rest_seconds: 10,  notes: 'GBC superset',                               order_index: 2, superset_group: 'B1' },
            { name: 'Bulgarian Split Squat',     set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60,  notes: 'GBC superset',                               order_index: 3, superset_group: 'B2' },
            { name: 'DB Shoulder Press',         set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 10,  notes: 'GBC finisher superset',                      order_index: 4, superset_group: 'C1' },
            { name: 'Cable Face Pull',           set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 60,  notes: 'GBC finisher superset',                      order_index: 5, superset_group: 'C2' },
          ],
        },
        {
          day_label: 'Day C — Full Body Metabolic',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Front Squat',               set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'GBC superset',                               order_index: 0, superset_group: 'A1' },
            { name: 'Pull Ups',                  set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60,  notes: 'GBC superset — add band assist if needed',   order_index: 1, superset_group: 'A2' },
            { name: 'Walking Lunges',            set_count: 4, rep_range: '10/leg', tempo: '3010', rest_seconds: 10, notes: 'GBC superset',                               order_index: 2, superset_group: 'B1' },
            { name: 'Close Grip Bench Press',    set_count: 4, rep_range: '10-12', tempo: '3010', rest_seconds: 60,  notes: 'GBC superset',                               order_index: 3, superset_group: 'B2' },
            { name: 'Glute Ham Raise',           set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 10,  notes: 'GBC finisher superset',                      order_index: 4, superset_group: 'C1' },
            { name: 'Cable Curl',                set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 60,  notes: 'GBC finisher superset',                      order_index: 5, superset_group: 'C2' },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(d => sessions.push({ ...d, week_number: week, exercises: d.exercises.map(e => ({ ...e })) }))
      }
      return sessions
    },
  },

  // ── Template 46 — Grow The Bro ───────────────────────────────────────────────
  {
    id: 'grow-the-bro',
    name: 'Grow The Bro',
    description: 'Classic bodybuilder split — chest, back, arms, shoulders and legs trained across five dedicated sessions. Each session opens with a primary compound lift followed by strategic supersets and isolation finishers. Volume is the priority: multiple angles, contraction techniques and pump-focused sets build maximum hypertrophy.',
    goals: ['lean_gain'],
    phase: 'Hypertrophy',
    sessions_per_week: 5,
    difficulty: 'intermediate',
    icon: '💪',
    color: '#7c3aed',
    tags: ['bro-split', '5-day', 'hypertrophy', 'bodybuilder', 'chest-back-arms-shoulders-legs'],
    generateSessions(weeks = 8) {
      const sessions = []
      const DAYS = [
        {
          day_label: 'Chest',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Flat Barbell Bench Press',    set_count: 4, rep_range: '8-10',  tempo: '3010', rest_seconds: 90,  notes: 'Primary compound',          order_index: 0, superset_group: null },
            { name: 'Incline DB Press',            set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Superset with fly',          order_index: 1, superset_group: 'A1' },
            { name: 'Incline DB Fly',              set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 75,  notes: 'Superset with press',        order_index: 2, superset_group: 'A2' },
            { name: 'Cable Crossover',             set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 10,  notes: 'Superset with dips',         order_index: 3, superset_group: 'B1' },
            { name: 'Weighted Dips',               set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 75,  notes: 'Lean forward — chest focus', order_index: 4, superset_group: 'B2' },
            { name: 'Pec Deck Machine',            set_count: 3, rep_range: '15-20', tempo: '2110', rest_seconds: 60,  notes: 'Squeeze at peak contraction',order_index: 5, superset_group: null },
          ],
        },
        {
          day_label: 'Back',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Deadlift',                    set_count: 4, rep_range: '6-8',   tempo: '3010', rest_seconds: 120, notes: 'Primary compound',          order_index: 0, superset_group: null },
            { name: 'Weighted Pull Ups',           set_count: 3, rep_range: '8-10',  tempo: '3010', rest_seconds: 10,  notes: 'Superset with row',          order_index: 1, superset_group: 'A1' },
            { name: 'Seated Cable Row',            set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 75,  notes: 'Superset with pull ups',     order_index: 2, superset_group: 'A2' },
            { name: 'Single Arm DB Row',           set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Superset with pulldown',     order_index: 3, superset_group: 'B1' },
            { name: 'Lat Pulldown',                set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 75,  notes: 'Superset with row',          order_index: 4, superset_group: 'B2' },
            { name: 'Cable Face Pull',             set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 60,  notes: 'Rear delt/rotator cuff',     order_index: 5, superset_group: null },
          ],
        },
        {
          day_label: 'Arms',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'EZ Bar Curl',                 set_count: 4, rep_range: '8-10',  tempo: '3010', rest_seconds: 10,  notes: 'Superset with skullcrusher', order_index: 0, superset_group: 'A1' },
            { name: 'EZ Bar Skullcrusher',         set_count: 4, rep_range: '8-10',  tempo: '3010', rest_seconds: 75,  notes: 'Superset with curl',         order_index: 1, superset_group: 'A2' },
            { name: 'Incline DB Curl',             set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Superset with overhead tri', order_index: 2, superset_group: 'B1' },
            { name: 'Overhead Rope Tricep Extension',set_count: 3, rep_range: '12-15',tempo: '3010',rest_seconds: 60,  notes: 'Superset with curl',         order_index: 3, superset_group: 'B2' },
            { name: 'Cable Curl',                  set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 10,  notes: 'Superset with pushdown',     order_index: 4, superset_group: 'C1' },
            { name: 'Cable Tricep Pushdown',       set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 60,  notes: 'Superset with curl',         order_index: 5, superset_group: 'C2' },
            { name: 'Hammer Curl',                 set_count: 2, rep_range: '12-15', tempo: '2010', rest_seconds: 60,  notes: 'Brachialis/brachioradialis', order_index: 6, superset_group: null },
          ],
        },
        {
          day_label: 'Shoulders',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Seated DB Shoulder Press',    set_count: 4, rep_range: '8-10',  tempo: '3010', rest_seconds: 90,  notes: 'Primary compound',          order_index: 0, superset_group: null },
            { name: 'Cable Lateral Raise',         set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 10,  notes: 'Superset with front raise',  order_index: 1, superset_group: 'A1' },
            { name: 'DB Front Raise',              set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 60,  notes: 'Superset with lateral raise',order_index: 2, superset_group: 'A2' },
            { name: 'Bent Over Rear Delt Fly',     set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 10,  notes: 'Superset with upright row',  order_index: 3, superset_group: 'B1' },
            { name: 'Barbell Upright Row',         set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 60,  notes: 'Superset with rear delt',    order_index: 4, superset_group: 'B2' },
            { name: 'DB Shrugs',                   set_count: 3, rep_range: '15-20', tempo: '2110', rest_seconds: 60,  notes: 'Trap finisher',              order_index: 5, superset_group: null },
          ],
        },
        {
          day_label: 'Legs',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Back Squat',                  set_count: 4, rep_range: '8-10',  tempo: '3010', rest_seconds: 120, notes: 'Primary compound',          order_index: 0, superset_group: null },
            { name: 'Leg Press',                   set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 10,  notes: 'Superset with leg curl',     order_index: 1, superset_group: 'A1' },
            { name: 'Lying Leg Curl',              set_count: 3, rep_range: '12-15', tempo: '3110', rest_seconds: 75,  notes: 'Superset with leg press',    order_index: 2, superset_group: 'A2' },
            { name: 'Bulgarian Split Squat',       set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Superset with RDL',          order_index: 3, superset_group: 'B1' },
            { name: 'Romanian Deadlift',           set_count: 3, rep_range: '10-12', tempo: '3110', rest_seconds: 75,  notes: 'Superset with split squat',  order_index: 4, superset_group: 'B2' },
            { name: 'Leg Extensions',              set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 10,  notes: 'Superset with calf raise',   order_index: 5, superset_group: 'C1' },
            { name: 'Standing Calf Raise',         set_count: 3, rep_range: '15-20', tempo: '3110', rest_seconds: 60,  notes: 'Superset with extensions',   order_index: 6, superset_group: 'C2' },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(d => sessions.push({ ...d, week_number: week, exercises: d.exercises.map(e => ({ ...e })) }))
      }
      return sessions
    },
  },

  // ── Template 47 — Growing The Peach Phase 2 ──────────────────────────────────
  {
    id: 'growing-the-peach-p2',
    name: 'Growing The Peach — Phase 2',
    description: 'Advanced glute specialisation programme building on Phase 1. Four sessions per week with increased loading on hip thrusts, RDLs and split squats. Phase 2 introduces heavier compound work (3–6 reps), more unilateral volume, and banded isolation work to maximise glute hypertrophy and shape.',
    goals: ['lean_gain'],
    phase: 'Glute Hypertrophy — Phase 2',
    sessions_per_week: 4,
    difficulty: 'intermediate',
    icon: '🍑',
    color: '#ec4899',
    tags: ['glutes', 'female', 'hypertrophy', '4-day', 'hip-thrust', 'unilateral'],
    generateSessions(weeks = 8) {
      const sessions = []
      const DAYS = [
        {
          day_label: 'Day 1 — Glute & Hamstring',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Barbell Hip Thrust',          set_count: 4, rep_range: '8-10',  tempo: '3011', rest_seconds: 90,  notes: 'Drive hips fully at top — squeeze hard',    order_index: 0, superset_group: null },
            { name: 'Romanian Deadlift',           set_count: 3, rep_range: '10-12', tempo: '3110', rest_seconds: 10,  notes: 'Superset with leg curl',                    order_index: 1, superset_group: 'A1' },
            { name: 'Lying Leg Curl',              set_count: 3, rep_range: '10-12', tempo: '3110', rest_seconds: 75,  notes: 'Superset with RDL',                         order_index: 2, superset_group: 'A2' },
            { name: 'Single Leg Hip Thrust',       set_count: 3, rep_range: '12-15', tempo: '3011', rest_seconds: 10,  notes: 'Superset with abduction',                   order_index: 3, superset_group: 'B1' },
            { name: 'Cable Hip Abduction',         set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 60,  notes: 'Superset with hip thrust',                  order_index: 4, superset_group: 'B2' },
            { name: 'Banded Glute Kickback',       set_count: 3, rep_range: '15-20', tempo: '2011', rest_seconds: 60,  notes: 'Squeeze at top',                            order_index: 5, superset_group: null },
          ],
        },
        {
          day_label: 'Day 2 — Quad & Glute',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Heel Elevated Back Squat',    set_count: 4, rep_range: '8-10',  tempo: '3010', rest_seconds: 90,  notes: 'Heels on plate — quad/glute emphasis',      order_index: 0, superset_group: null },
            { name: 'Front Foot Elevated Split Squat', set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 10, notes: 'Superset with leg extension',           order_index: 1, superset_group: 'A1' },
            { name: 'Leg Extension',               set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 75,  notes: 'Superset with split squat',                 order_index: 2, superset_group: 'A2' },
            { name: '45° Leg Press',               set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 10,  notes: 'Wide stance — glute emphasis',              order_index: 3, superset_group: 'B1' },
            { name: 'Walking Lunges',              set_count: 3, rep_range: '12/leg', tempo: '3010', rest_seconds: 75,  notes: 'Superset with leg press',                  order_index: 4, superset_group: 'B2' },
            { name: 'Standing Calf Raise',         set_count: 3, rep_range: '15-20', tempo: '3110', rest_seconds: 60,  notes: 'Full ROM',                                  order_index: 5, superset_group: null },
          ],
        },
        {
          day_label: 'Day 3 — Glute & Upper',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Sumo Deadlift',               set_count: 4, rep_range: '6-8',   tempo: '3010', rest_seconds: 90,  notes: 'Wide stance — inner thigh/glute',           order_index: 0, superset_group: null },
            { name: '45° Back Extension',          set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 10,  notes: 'Superset with hip thrust',                  order_index: 1, superset_group: 'A1' },
            { name: 'Barbell Hip Thrust',          set_count: 3, rep_range: '12-15', tempo: '3011', rest_seconds: 75,  notes: 'Back-off weight',                           order_index: 2, superset_group: 'A2' },
            { name: 'Lat Pulldown',                set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Superset with row',                         order_index: 3, superset_group: 'B1' },
            { name: 'Seated Cable Row',            set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 75,  notes: 'Superset with pulldown',                    order_index: 4, superset_group: 'B2' },
            { name: 'Banded Clamshell',            set_count: 3, rep_range: '20-25', tempo: '2011', rest_seconds: 45,  notes: 'Glute med activation',                      order_index: 5, superset_group: null },
          ],
        },
        {
          day_label: 'Day 4 — Hamstring & Glute',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Stiff Leg Deadlift',          set_count: 4, rep_range: '10-12', tempo: '3110', rest_seconds: 90,  notes: 'Full stretch — hamstring focus',             order_index: 0, superset_group: null },
            { name: 'Seated Leg Curl',             set_count: 3, rep_range: '10-12', tempo: '3110', rest_seconds: 10,  notes: 'Superset with nordic curl',                 order_index: 1, superset_group: 'A1' },
            { name: 'Nordic Hamstring Curl',       set_count: 3, rep_range: '6-8',   tempo: '3010', rest_seconds: 75,  notes: 'Eccentric focus',                           order_index: 2, superset_group: 'A2' },
            { name: 'Cable Pull-Through',          set_count: 3, rep_range: '15-20', tempo: '3011', rest_seconds: 10,  notes: 'Hip hinge — glute/ham',                     order_index: 3, superset_group: 'B1' },
            { name: 'Banded Hip Thrust',           set_count: 3, rep_range: '20-25', tempo: '2011', rest_seconds: 60,  notes: 'Light band — pump focus',                   order_index: 4, superset_group: 'B2' },
            { name: 'Seated Calf Raise',           set_count: 3, rep_range: '15-20', tempo: '3110', rest_seconds: 60,  notes: 'Soleus focus',                              order_index: 5, superset_group: null },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(d => sessions.push({ ...d, week_number: week, exercises: d.exercises.map(e => ({ ...e })) }))
      }
      return sessions
    },
  },

  // ── Template 48 — High Frequency Glutes ──────────────────────────────────────
  {
    id: 'high-frequency-glutes',
    name: 'High Frequency Glutes',
    description: 'Glutes trained four times per week across full-body sessions — each session hits hip thrust, hinge, and unilateral patterns so the glutes are stimulated through multiple movement planes with sufficient frequency to drive rapid hypertrophy. Upper body and quad work fills session volume around the glute priority exercises.',
    goals: ['lean_gain'],
    phase: 'Glute Specialisation',
    sessions_per_week: 4,
    difficulty: 'intermediate',
    icon: '🍑',
    color: '#db2777',
    tags: ['glutes', 'high-frequency', 'female', '4-day', 'full-body', 'hip-thrust'],
    generateSessions(weeks = 8) {
      const sessions = []
      const DAYS = [
        {
          day_label: 'Day 1 — Glute Priority Lower',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Barbell Hip Thrust',               set_count: 4, rep_range: '8-12',  tempo: '3011', rest_seconds: 90,  notes: 'Primary glute driver — heavy', order_index: 0, superset_group: null },
            { name: 'Romanian Deadlift',                set_count: 3, rep_range: '10-12', tempo: '3110', rest_seconds: 10,  notes: 'Superset with leg curl',       order_index: 1, superset_group: 'A1' },
            { name: 'Seated Leg Curl',                  set_count: 3, rep_range: '12-15', tempo: '3110', rest_seconds: 75,  notes: 'Superset with RDL',            order_index: 2, superset_group: 'A2' },
            { name: 'Cable Kickback',                   set_count: 3, rep_range: '15-20', tempo: '2011', rest_seconds: 10,  notes: 'Superset with abduction',      order_index: 3, superset_group: 'B1' },
            { name: 'Banded Lateral Walk',              set_count: 3, rep_range: '20 steps', tempo: null, rest_seconds: 60, notes: 'Glute med activation',         order_index: 4, superset_group: 'B2' },
          ],
        },
        {
          day_label: 'Day 2 — Upper + Glute Accessory',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Single Leg Hip Thrust (Bench)',    set_count: 3, rep_range: '12-15', tempo: '3011', rest_seconds: 60,  notes: 'Glute activation before upper', order_index: 0, superset_group: null },
            { name: 'Incline DB Press',                 set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Superset with row',            order_index: 1, superset_group: 'A1' },
            { name: 'Seated Cable Row',                 set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 75,  notes: 'Superset with press',          order_index: 2, superset_group: 'A2' },
            { name: 'Lat Pulldown',                     set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Superset with shoulder press', order_index: 3, superset_group: 'B1' },
            { name: 'DB Shoulder Press',                set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 75,  notes: 'Superset with pulldown',       order_index: 4, superset_group: 'B2' },
            { name: 'Banded Glute Bridge',              set_count: 3, rep_range: '20-25', tempo: '2011', rest_seconds: 45,  notes: 'Pump finisher',                order_index: 5, superset_group: null },
          ],
        },
        {
          day_label: 'Day 3 — Quad + Glute',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Barbell Hip Thrust',               set_count: 3, rep_range: '10-15', tempo: '3011', rest_seconds: 75,  notes: 'Moderate load — second glute session', order_index: 0, superset_group: null },
            { name: 'Heel Elevated Goblet Squat',       set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 10,  notes: 'Superset with leg extension',  order_index: 1, superset_group: 'A1' },
            { name: 'Leg Extension',                    set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 75,  notes: 'Superset with squat',          order_index: 2, superset_group: 'A2' },
            { name: 'Walking Lunges',                   set_count: 3, rep_range: '12/leg', tempo: '3010', rest_seconds: 10, notes: 'Superset with calf raise',     order_index: 3, superset_group: 'B1' },
            { name: 'Standing Calf Raise',              set_count: 3, rep_range: '15-20', tempo: '3110', rest_seconds: 60,  notes: 'Superset with lunge',          order_index: 4, superset_group: 'B2' },
          ],
        },
        {
          day_label: 'Day 4 — Full Body Glute Focus',
          session_type: 'hypertrophy',
          exercises: [
            { name: 'Sumo Deadlift',                    set_count: 4, rep_range: '8-10',  tempo: '3010', rest_seconds: 90,  notes: 'Wide stance — posterior chain', order_index: 0, superset_group: null },
            { name: '45° Back Extension',               set_count: 3, rep_range: '12-15', tempo: '3011', rest_seconds: 10,  notes: 'Superset with hip thrust',     order_index: 1, superset_group: 'A1' },
            { name: 'Banded Hip Thrust',                set_count: 3, rep_range: '20-25', tempo: '2011', rest_seconds: 60,  notes: 'Light load — pump',            order_index: 2, superset_group: 'A2' },
            { name: 'Pull Ups (Assisted)',              set_count: 3, rep_range: '8-10',  tempo: '3010', rest_seconds: 10,  notes: 'Superset with push',           order_index: 3, superset_group: 'B1' },
            { name: 'Push Ups',                         set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 75,  notes: 'Superset with pull',           order_index: 4, superset_group: 'B2' },
            { name: 'Cable Hip Abduction',              set_count: 3, rep_range: '20/side', tempo: '2010', rest_seconds: 45, notes: 'Glute med finisher',          order_index: 5, superset_group: null },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(d => sessions.push({ ...d, week_number: week, exercises: d.exercises.map(e => ({ ...e })) }))
      }
      return sessions
    },
  },

  // ── Template 49 — Hypertrophy Hybrid ─────────────────────────────────────────
  {
    id: 'hypertrophy-hybrid',
    name: 'Hypertrophy Hybrid',
    description: 'Four-day programme blending strength (3–6 reps) and hypertrophy (8–15 reps) within every session. Each day opens with a heavy compound lift to build strength, then transitions into superset-based accessory work at higher reps. This dual-rep-range approach maximises both myofibrillar and sarcoplasmic hypertrophy across a single block.',
    goals: ['lean_gain', 'strength'],
    phase: 'Hybrid Strength / Hypertrophy',
    sessions_per_week: 4,
    difficulty: 'intermediate',
    icon: '🏗️',
    color: '#0891b2',
    tags: ['hybrid', 'strength', 'hypertrophy', '4-day', 'upper-lower', 'superset'],
    generateSessions(weeks = 8) {
      const sessions = []
      const DAYS = [
        {
          day_label: 'Upper A — Horizontal Push/Pull',
          session_type: 'strength',
          exercises: [
            { name: 'Flat Barbell Bench Press',    set_count: 4, rep_range: '4-6',   tempo: '3110', rest_seconds: 120, notes: 'Strength block — heavy',         order_index: 0, superset_group: null },
            { name: 'Bent Over Barbell Row',       set_count: 4, rep_range: '4-6',   tempo: '3010', rest_seconds: 120, notes: 'Strength block — heavy',         order_index: 1, superset_group: null },
            { name: 'Incline DB Press',            set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Hypertrophy superset',           order_index: 2, superset_group: 'A1' },
            { name: 'Cable Row',                   set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 75,  notes: 'Hypertrophy superset',           order_index: 3, superset_group: 'A2' },
            { name: 'Cable Lateral Raise',         set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 10,  notes: 'Delt superset',                  order_index: 4, superset_group: 'B1' },
            { name: 'Cable Face Pull',             set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 60,  notes: 'Delt superset',                  order_index: 5, superset_group: 'B2' },
          ],
        },
        {
          day_label: 'Lower A — Squat Dominant',
          session_type: 'strength',
          exercises: [
            { name: 'Back Squat',                  set_count: 4, rep_range: '4-6',   tempo: '3010', rest_seconds: 120, notes: 'Strength block — heavy',         order_index: 0, superset_group: null },
            { name: 'Romanian Deadlift',           set_count: 3, rep_range: '8-10',  tempo: '3110', rest_seconds: 90,  notes: 'Strength/hypertrophy bridge',    order_index: 1, superset_group: null },
            { name: 'Leg Press',                   set_count: 3, rep_range: '12-15', tempo: '3010', rest_seconds: 10,  notes: 'Hypertrophy superset',           order_index: 2, superset_group: 'A1' },
            { name: 'Lying Leg Curl',              set_count: 3, rep_range: '12-15', tempo: '3110', rest_seconds: 75,  notes: 'Hypertrophy superset',           order_index: 3, superset_group: 'A2' },
            { name: 'Leg Extension',               set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 10,  notes: 'Finisher superset',              order_index: 4, superset_group: 'B1' },
            { name: 'Standing Calf Raise',         set_count: 3, rep_range: '15-20', tempo: '3110', rest_seconds: 60,  notes: 'Finisher superset',              order_index: 5, superset_group: 'B2' },
          ],
        },
        {
          day_label: 'Upper B — Vertical Push/Pull',
          session_type: 'strength',
          exercises: [
            { name: 'Weighted Pull Ups',           set_count: 4, rep_range: '4-6',   tempo: '3010', rest_seconds: 120, notes: 'Strength block — add weight',    order_index: 0, superset_group: null },
            { name: 'Seated DB Shoulder Press',    set_count: 4, rep_range: '6-8',   tempo: '3010', rest_seconds: 90,  notes: 'Strength/hypertrophy bridge',    order_index: 1, superset_group: null },
            { name: 'Lat Pulldown',                set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Hypertrophy superset',           order_index: 2, superset_group: 'A1' },
            { name: 'DB Lateral Raise',            set_count: 3, rep_range: '15-20', tempo: '2010', rest_seconds: 75,  notes: 'Hypertrophy superset',           order_index: 3, superset_group: 'A2' },
            { name: 'EZ Bar Curl',                 set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Arms superset',                  order_index: 4, superset_group: 'B1' },
            { name: 'Tricep Pushdown',             set_count: 3, rep_range: '12-15', tempo: '2010', rest_seconds: 60,  notes: 'Arms superset',                  order_index: 5, superset_group: 'B2' },
          ],
        },
        {
          day_label: 'Lower B — Hip Hinge Dominant',
          session_type: 'strength',
          exercises: [
            { name: 'Deadlift',                    set_count: 4, rep_range: '4-5',   tempo: '3010', rest_seconds: 120, notes: 'Strength block — heavy',         order_index: 0, superset_group: null },
            { name: 'Barbell Hip Thrust',          set_count: 3, rep_range: '8-10',  tempo: '3011', rest_seconds: 90,  notes: 'Strength/hypertrophy bridge',    order_index: 1, superset_group: null },
            { name: 'Bulgarian Split Squat',       set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 10,  notes: 'Hypertrophy superset',           order_index: 2, superset_group: 'A1' },
            { name: 'Glute Ham Raise',             set_count: 3, rep_range: '10-12', tempo: '3010', rest_seconds: 75,  notes: 'Hypertrophy superset',           order_index: 3, superset_group: 'A2' },
            { name: 'Walking Lunges',              set_count: 3, rep_range: '12/leg', tempo: '3010', rest_seconds: 10, notes: 'Finisher superset',              order_index: 4, superset_group: 'B1' },
            { name: 'Seated Calf Raise',           set_count: 3, rep_range: '15-20', tempo: '3110', rest_seconds: 60,  notes: 'Finisher superset',              order_index: 5, superset_group: 'B2' },
          ],
        },
      ]
      for (let week = 1; week <= weeks; week++) {
        DAYS.forEach(d => sessions.push({ ...d, week_number: week, exercises: d.exercises.map(e => ({ ...e })) }))
      }
      return sessions
    },
  },

]

// ============================================================
// TEMPLATE METADATA — display fields for ProgramTemplates.jsx
// ============================================================

const GOAL_DISPLAY = {
  lean_gain: 'Hypertrophy',
  gain: 'Hypertrophy',
  cut: 'Fat Loss',
  aggressive_cut: 'Fat Loss',
  recomp: 'Body Composition',
  maintain: 'Body Composition',
  strength: 'Strength',
}

const DIFFICULTY_DISPLAY = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

const TEMPLATE_METADATA = {
  'gvt-classic': {
    method: 'GVT',
    keyPrinciples: [
      '10 sets of 10 reps for maximum hypertrophy stimulus',
      'Superset antagonist muscle groups (A1/A2) to maintain intensity',
      '60s rest between supersets — time under tension is the key driver',
      'Use the same weight throughout — drop 5% if you fail to complete all 10',
      'Three sessions per week: Lower Body, Torso, Arms & Delts',
    ],
  },
  'gvt-advanced': {
    method: 'GVT',
    keyPrinciples: [
      'Progressive rep schemes: 10×5 → 10×4 → 10×3 across the block',
      'Load increases 4–5% each workout as reps decrease',
      'Designed for athletes who have already completed Classic GVT',
      '90s rest — heavier loads demand longer recovery',
      'CNS-intensive — prioritise sleep, nutrition and recovery',
    ],
  },
  'gbc-body-comp': {
    method: 'GBC',
    keyPrinciples: [
      'Alternating upper and lower body supersets to maximise lactate',
      'Minimal rest (10s between exercises, 60–90s between rounds)',
      'GH spike from lactate drives simultaneous fat loss and muscle retention',
      'Full-body A/B alternation — odd weeks A-B-A, even weeks B-A-B',
      'More effective than traditional cardio for body recomposition',
    ],
  },
  'linear-beginner': {
    method: 'Classic',
    coach: 'Mark Rippetoe',
    keyPrinciples: [
      'Add weight to every session — novice adaptation allows rapid progress',
      '3×5 across on the main lifts with double progression',
      'Focus on core barbell movements: squat, press, deadlift',
      'Rest 3–5 minutes between working sets',
      'Eat aggressively to support linear progression',
    ],
  },
  'linear-intermediate': {
    method: 'Classic',
    keyPrinciples: [
      'Weekly progression — strength increases every 7 days',
      '4-day upper/lower split for increased training frequency',
      'Accessory supersets paired to build muscle and structural balance',
      'Deload week built in every 4th week to manage fatigue',
      'Bridges the gap between beginner linear gains and periodised training',
    ],
  },
  'dup-strength-size': {
    method: 'Poliquin',
    keyPrinciples: [
      'Daily Undulating Periodisation — rep ranges vary within the week',
      'Strength day, size day, and power day every training week',
      'Prevents plateau by stimulating different muscle fibre types each session',
      'Four-day upper/lower split for balanced development',
      'Ideal for intermediates who have stalled on linear programmes',
    ],
  },
  'six-twelve-twentyfive': {
    method: 'Poliquin',
    keyPrinciples: [
      'Tri-set of 6, 12, and 25 reps in rapid succession',
      'Recruits fast-twitch, intermediate, and slow-twitch fibres in one go',
      'Extremely high lactate — powerful fat-burning effect',
      'Rest only 10s between exercises within the tri-set',
      'Brutal but highly effective for body recomposition',
    ],
  },
  'pof-upper': {
    method: 'Poliquin',
    keyPrinciples: [
      'Trains each muscle through mid, stretch, and contracted positions',
      'Three exercises per muscle group targeting all points on the strength curve',
      'Maximises motor unit recruitment and mechanical tension',
      'Short rest, high volume — combines hypertrophy with metabolic stress',
      'Upper body focused split with balanced push and pull volumes',
    ],
  },
  'anterior-posterior-4day': {
    method: 'Poliquin',
    keyPrinciples: [
      'Alternates anterior (quad/push) and posterior (hinge/pull) dominant sessions',
      'Accumulation → Loading → Intensification: 3-phase autonomous progression',
      'Supersets pair opposing movements for efficiency and structural balance',
      'Volume and TUT highest in accumulation, intensity peaks in intensification',
      '18-week block with natural progression built into phase transitions',
    ],
    conditioning: { recommended: 'gbc', notes: 'GBC conditioning pairs well with the metabolic demands of this split.' },
  },
  'push-pull-legs': {
    method: 'Classic',
    keyPrinciples: [
      '6-day Push/Pull/Legs with A and B session variants each day type',
      'Accumulation → Loading → Intensification phase progression',
      'High frequency — each muscle trained twice per week',
      'Phase-appropriate volume: high in accumulation, peak intensity in intensification',
      'Most comprehensive PPL structure — for committed athletes only',
    ],
    conditioning: { recommended: 'tempo-intervals', notes: 'Tempo intervals on rest days keep aerobic base without taxing recovery.' },
  },
  'strength-5x5': {
    method: 'Poliquin',
    keyPrinciples: [
      '5×5 on core barbell lifts: squat, bench, deadlift, row, press',
      'Accumulation → Loading → Intensification: volume drops as intensity rises',
      'Superset accessory pairs to build structural balance alongside the main lifts',
      'Proven strength protocol adapted with Poliquin phase principles',
      '18-week block designed to add significant weight to all main lifts',
    ],
  },
  'wendler-531': {
    method: 'Classic',
    coach: 'Jim Wendler',
    keyPrinciples: [
      '5/3/1 main lift sets each week: 5+ reps, 3+ reps, 1+ rep',
      'Three phases control block structure: Volume, Strength, Intensification',
      'AMRAP final sets auto-regulate load based on daily readiness',
      'Four-day upper/lower split: squat, deadlift, bench, press',
      'Built for the long game — patient, consistent, sustainable',
    ],
  },
  'structural-balance-full': {
    method: 'Poliquin',
    keyPrinciples: [
      'Identifies and corrects strength imbalances between opposing muscle groups',
      'Full body A/B alternation — 3 sessions per week',
      'Anterior/posterior ratios drive exercise selection',
      'High posterior chain volume to correct the most common imbalance pattern',
      'Foundation programme — use before GVT or DUP to prevent injury',
    ],
  },
  '3-day-athlete-gbc': {
    method: 'GBC',
    keyPrinciples: [
      'German Body Composition pairing: compound lifts superseted with opposite-pattern movements',
      'Giant set warmups prime the nervous system and mobilise key joints before loading',
      'Short rest between exercises (10–60s) maximises lactate and growth hormone response',
      'Three full-body sessions per week — rotates through hip, knee, push and pull patterns',
      'Power clean and vertical jump variations develop athleticism alongside hypertrophy',
    ],
  },
  '3-day-powerbuild': {
    method: 'Powerbuilding',
    keyPrinciples: [
      'Compound lifts at 4–6 reps build maximal strength; accessories at 10–15 reps build size',
      'Each session pairs a strength pattern (squat or hinge) with a push or pull',
      'Giant set warmups activate glutes, core and hips before heavy barbell loading',
      'Accessory volume targets specific weaknesses for each movement pattern per day',
      'Progress the main lifts weekly — add load when all sets are completed with solid form',
    ],
  },
  '3x-full-body-accessories': {
    method: 'Full Body Superset',
    keyPrinciples: [
      'Three full-body sessions pair push/pull and upper/lower movements for maximum efficiency',
      'Conditioning days use dynamic mobility warmups followed by low-intensity steady-state cardio',
      'Dedicated accessories day targets arms, delts and calves — volume full-body days can\'t cover',
      'Machine-friendly supersets — ideal for busy gym environments with consistent equipment access',
      'Six sessions per week: Full Body, Conditioning, Full Body, Conditioning, Full Body, Accessories',
    ],
  },
  '4-day-full-body': {
    method: 'Full Body Split',
    keyPrinciples: [
      'Four distinct full-body sessions (A/B/C/D) rotate movement patterns across the week',
      'Each session targets different loading patterns: hinge, squat, push, pull combinations',
      'Giant set warmups vary each session to address different mobility and activation needs',
      'Conditioning session (AMRAP in 40 minutes) builds aerobic capacity and work capacity',
      'High variety keeps training fresh and develops well-rounded athletic capability',
    ],
  },
  'accumulation-5x5': {
    method: 'Accumulation — 5 × 5',
    keyPrinciples: [
      '5 sets of 5 reps on main compound supersets — the classic strength foundation scheme',
      'Main lifts are supersetted as antagonist pairs: Front Squat+Bench, Back Squat+Pull Up, Deadlift+Press',
      'Use as a foundation block before transitioning to the 6×4 intensification phase',
      'CNS giant-set warmups prime the nervous system for heavy compound loading each session',
      'Add 2.5–5kg to main lifts each week — when you can complete all 5×5 with perfect form, progress the load',
    ],
  },
  'accumulation-2-6x4': {
    method: 'Accumulation — 6 × 4',
    keyPrinciples: [
      '6 sets of 4 reps on main compound supersets — high volume at moderate-to-heavy loads for strength accumulation',
      'Main lifts are always supersetted: Squat+Bench, Squat+Pull Up, Deadlift+Press — pairing antagonists maximises density',
      'CNS giant-set warmups (bridges, Copenhagen planks, split squats, hanging raises) prime the nervous system',
      'Accessory volume is moderate (2-3 sets) — the 6×4 main lifts are the priority stimulus',
      'Progress by adding 2.5–5kg to main lifts each week as long as all 6×4 sets are completed with good form',
    ],
  },
  '5-day-functional-2-conditioning': {
    method: 'Functional Full Body',
    keyPrinciples: [
      'All strength days use supersets and giant sets pairing barbells, kettlebells and bodyweight',
      '"The Engine" is pure aerobic work — Ski Erg and Assault Bike at sustainable Zone 2-3 pace',
      '"Not for the Faint Hearted" is all-out HIIT — Assault Bike, Burpees, V-Sits and Butterfly Crunches',
      'Athletic movements (sled push, dead ball, farmers walk, KB snatch) develop real-world strength',
      'Five full-body days ensure every session trains multiple patterns — no muscle group is ever neglected',
    ],
  },
  '4-day-split': {
    method: 'Body Part Split',
    keyPrinciples: [
      'Five distinct sessions: Posterior, Chest/Shoulders/Triceps, Lower, Shoulders/Arms, and Cardio',
      'Each session opens with a CNS-activating giant-set warmup tailored to that day\'s movement demands',
      'Supersets pair antagonist or synergist muscles for time efficiency and metabolic stress',
      'The Cardio & Mobility day targets hip flexor restoration, aerobic conditioning and core stability',
      'Flexible scheduling — run 4 days with 1 optional cardio day, or all 5 across the week',
    ],
  },
  '1rm-peaking': {
    method: 'Anterior / Posterior Peaking',
    keyPrinciples: [
      'CNS activation giant-set warmups (jumps, plyometrics, loaded carries) prime the nervous system before heavy work',
      'Anterior days focus on squats, pressing and quad-dominant patterns; Posterior days on hinges, rows and hip extension',
      'Heavy compound lifts use low reps (3–5) at near-maximal loads to develop peak strength',
      'Accumulation phase builds volume; intensity ramps week-on-week to peak for 1RM testing in the final week',
      'Structural balance accessory work reduces injury risk and eliminates strength imbalances before maximal testing',
    ],
  },
  '4-day-hypertrophy': {
    method: 'Push / Pull Split',
    keyPrinciples: [
      'Giant sets and supersets maximise volume and metabolic stress for hypertrophy',
      'Day 1 Push (chest/triceps/anterior delts) and Day 2 Pull (back/biceps) are the foundation',
      'Day 4 accumulates shoulder and arm volume with high-rep leg finishers',
      'Day 6 dedicated lower body session uses hinge, squat and isolation for complete leg development',
      'Progress by adding a rep or small load increment each week before cycling',
    ],
  },
  'advanced-powerbuild-phase1': {
    method: 'Powerbuild — Hinge / Bench / Squat / Arms',
    keyPrinciples: [
      'CNS-activating giant-set warmups (bridges, plank, jumps, hops) prime the nervous system before heavy work',
      'Day 1 Hinge pairs Snatch Grip and Trap Bar deadlifts with core supersets for posterior chain overload',
      'Day 2 Bench pairs close grip and incline press variations with pulls to protect shoulder health',
      'Day 3 Squat uses 5×4-6 safety bar squats as the centrepiece with accessory quad and hamstring work',
      'Day 4 Upper/Sharms builds shoulder width and arm detail with high-incline press, cable raises and arm giant sets',
    ],
  },
  'advanced-powerbuild-phase2': {
    method: 'Powerbuild — Hinge / Bench / Squat / Upper',
    keyPrinciples: [
      'Day 1 Hinge progresses to conventional Barbell Deadlift 3×5 as the primary lift, with leg press and hip extension for posterior volume',
      'Day 2 Bench shifts to Flat Barbell Bench 4×5 paired with prone lat pulldown and fitball plank for balanced pressing',
      'Day 3 Squat uses Heel Elevated High Bar Back Squat 4×5 with Stir The Pot core pairing, dropset leg extensions and back-off hack squat',
      'Day 4 Upper/Sharms pairs Standing Barbell Press 4×5 with weighted Pull Ups, then spider curls and straight-arm pushdowns for arm detail',
      'Rest-pause, dropsets and back-off sets intensify hypertrophy stimulus on top of the strength-focused primary lifts',
    ],
  },
  'anterior-posterior-hict': {
    method: 'Anterior / Posterior Split with HICT Conditioning',
    keyPrinciples: [
      'Anterior days (1 & 3) target quad-dominant squats, chest press and tricep exercises; posterior days (2 & 4) target hip hinges, rows and bicep work',
      'Every lifting day opens with a giant-set activation sequence using warmup-flagged movements to prime the CNS before working sets',
      'SS1 on each day pairs the primary compound (Trap Bar Deadlift, Smith BSS, Hip Thrusts, Incline Smith Press) with a complementary pull or push',
      'Intensification techniques — rest-pause, dropsets, failure sets — are built into the final set of key isolation exercises',
      'Conditioning sessions (Days 3 & 6) are left blank for the coach to programme client-specific HICT cardio work',
    ],
  },
  'anterior-posterior-shoulders-arms': {
    method: 'Poliquin Contrast Split — Anterior / Posterior / Shoulders & Arms',
    keyPrinciples: [
      'Every working superset pairs a heavy compound (4–6 reps, 5-sec eccentric) with an isolation for the same muscle group (8–15 reps) to exploit post-activation potentiation',
      'Anterior days (1 & 3) lead with quad-dominant squats and chest press variations; posterior days (2 & 4) lead with hip hinges and horizontal pulls',
      'Day 5 dedicates a full session to shoulder width, arm detail and abs with its own contrast supersets and a 4-exercise arm giant set',
      'Rest-pause, dropsets and failure sets are programmed into isolation finishers to maximise metabolic stress at session end',
      'Mobility warmup sequences (pigeon, couch stretch, frog; thread-the-needle, face pulls, lat PNF) are prescribed before every session to prime joint health',
    ],
  },
  'athletic-development': {
    method: 'Athletic Development — Strength / Conditioning Hybrid',
    keyPrinciples: [
      'Alternating strength and conditioning days (3 of each per week) build work capacity without compromising strength adaptation',
      'Strength days open with a 5-exercise CNS-priming giant set (bridges, Copenhagen planks, loaded split squat, pogo hops, max effort vertical jumps) to activate the posterior chain and elastic system',
      'Main strength work pairs primary compound movements (Safety Squat, Trap Bar Deadlift, Flat Bench) with supersets targeting complementary patterns for efficiency',
      'Loaded isometric holds (Trap Bar Isometric Hold, Zercher Squat Iso) are programmed at session end to build tendon resilience and mental fortitude',
      'Conditioning sessions use sled-based locomotion (reverse drag, push) for joint-friendly output, paired with an arm giant set to maintain upper body volume',
    ],
  },
  'athletic-development-football': {
    method: 'Athletic Development — Football S+C',
    keyPrinciples: [
      'All strength sessions open with a 4-exercise CNS giant set (single-leg bridges, Copenhagen planks, contralateral split squats, Russian twists) to prime the posterior chain and rotational power',
      'Dedicated neck conditioning superset (Neck Bridge Isometric + Cable Neck Extension) appears in both days to build cervical resilience for contact sport',
      'Telemark squats and Trap Bar Isometric Holds develop the hip stability and loaded tendon strength critical for change-of-direction performance',
      'GI/towel pull-ups are used on Day 2 to build grip endurance — a key physical quality for football at all levels',
      'Zercher Squat Iso finishes each session with a full-body bracing challenge, reinforcing midline stability under load',
    ],
  },
  'athletic-development-sc': {
    method: 'Athletic Development S+C — Three-Day Strength Block',
    keyPrinciples: [
      'Days 1 and 2 share the core Athletic Development framework (CNS warmup, Telemark squat complex, isometric holds) but differ in their accessory supersets',
      'Day 1 uses Banded TKE + Poliquin Step-Up to address knee tracking and eccentric quad strength — common weak links in athletic populations',
      'Day 2 closes with a reverse sled drag finisher (10 min accumulation) to build aerobic base without axial loading',
      'Day 3 shifts to a barbell-dominant session: heavy Romanian Deadlifts (3110 tempo), Flat Bench, and weighted Pull-Ups to build maximal force production',
      'Single Leg Leg Extension with 5-second isometric hold targets VMO activation and tendon adaptation at end-range knee extension',
    ],
  },
  'bikini-focus-delts-glutes': {
    method: 'Bikini Focus — Shoulder-Dominant Upper / Glute-Dominant Lower Split',
    keyPrinciples: [
      'Upper days contain zero horizontal pressing — all shoulder work is unilateral (cable laterals, rear delt flies, landmine press) to build cap-shaped deltoids without adding chest mass',
      'Lower days prioritise hip extension patterns: Hip Thrusts, hip-dominant 45° leg press and Kickstance RDL all target the glute-hamstring tie-in valued in bikini competition',
      'A 1-second peak contraction pause (tempo digit 1 in concentric/pause position) appears throughout to maximise muscle activation quality in glute and delt exercises',
      'Every lower session opens with the same CNS warmup (single-leg bridges, Copenhagen planks, contralateral RDL, pogo hops, vertical jumps) to prime the posterior chain',
      'Smith Machine Squat and Pendulum Squat are used over barbell back squat to allow upright torso position, maximising quad and VMO stimulus for stage shape',
    ],
  },
  'contrast-2': {
    method: 'Contrast 2.0 — Full Body PAP Supersets',
    keyPrinciples: [
      'The central contrast pair in each session uses a 30-second inter-set rest (heavy lift → 30s → explosive), then 180s full recovery — the short gap preserves post-activation potentiation while the long recovery restores CNS output',
      'Sessions alternate between hinge-dominant (Trap Bar DL) and squat-dominant (Front/Back Squat) contrast pairs to manage spinal fatigue across the week',
      'Warmup giant sets (5 exercises each) vary between sessions — posterior chain focus on sessions 1 & 3, thoracic/core focus on sessions 2 & 4',
      'Hypertrophy accessories use supersets throughout with 3020–3120 tempos to maximise time under tension after the neurally demanding contrast work',
      'The arm giant set in Full Body 1 uses a mechanical drop set (Preacher Curl 6 reps → Rope Curl 12 reps → Pushdowns 24 reps) to extend the set to fatigue without reducing load',
    ],
  },
  'contrast-training': {
    method: 'Contrast Training — Post-Activation Potentiation',
    keyPrinciples: [
      'Each session pairs a heavy strength exercise (3–5 reps) with a biomechanically similar plyometric or Olympic lift variation — the heavy load primes the CNS to recruit more motor units for the explosive movement',
      'Olympic lifts (Hip Snatch, Power Clean, Hang Power Snatch) serve as power primers before the heavy squat or hinge to pattern explosive hip extension before loading',
      'Upper days split push-dominant vs pull-dominant to balance volume while allowing higher frequency per movement pattern',
      'The fifth day (Mixed Power/Conditioning) blends short cyclical efforts (Assault Bike, Rower) with barbell complexes and plyometrics for metabolic conditioning without jeopardising strength recovery',
      'All warmup giant sets include a core anti-rotation or stability exercise (Ab Roll Out, Copenhagen Plank) to activate deep trunk musculature before spinal loading',
    ],
  },
  'condition': {
    method: 'Condition — Giant Set Isometric Integration',
    keyPrinciples: [
      'Every working giant set follows a "dynamic → dynamic → isometric" structure: two controlled-tempo exercises followed by a max-effort isometric hold to drive deep neural conditioning',
      'The signature tempo is 2-2-2-0 (2s eccentric, 2s pause, 2s concentric) — slow and deliberate to maximise time under tension and structural adaptation',
      'Day 1 and Day 3 both train chest and quads but with different exercises (floor press/leg press vs. cable press/split squat), allowing frequency without monotony',
      'Days 2 and 4 share glute/hamstring work similarly — Hip Thrusts and RDL-variants appear twice per week for posterior chain frequency',
      'Mobility warmups (Thread the Needle, Pigeon Pose, Couch Stretch) are embedded as 1-round giant sets before every session to prime joints before loaded work',
    ],
  },
  'built-powerful': {
    method: 'Built Powerful — 5-Day Power Development',
    keyPrinciples: [
      'Every session opens with a CNS-priming giant set (hamstring bridges, pogo hops, explosive jumps) to maximise neural drive before heavy or ballistic work',
      'Lower Power prioritises triple extension strength: Box Squat, Trap Bar Deadlift and B-Stance Hip Thrust develop the posterior chain through maximal-force ranges',
      'Upper Power uses bodyweight loading (Pull Ups, Dips, Ring Rows) for relative strength before adding loaded rotational and arm superset work',
      'The Plyometrics day pairs bounds, pogo hops and BSS Jumps with treadmill HIIT intervals to develop reactive strength alongside conditioning',
      'Full Body day centres on Olympic-influenced lifts (Power Clean, High Pull, DB Snatch) to build rate-of-force development — low reps (3–6) with full recovery',
    ],
  },
  'bodyweight-travel': {
    method: 'Bodyweight Travel — Minimal Equipment Full Body',
    keyPrinciples: [
      'Three circuit-style resistance days (A/B/C) use only bodyweight and light dumbbells — no gym required',
      'Each day opens with a 4-exercise mobility/activation giant set to prime joints before the working circuits',
      'Superset 2 on every day is plyometric (Squat Jumps + Bear Crawl variation) to maintain power output and conditioning without equipment',
      'An active recovery Run Day includes 4 pre-run activation exercises (single-leg bridges, pogo hops) to reinforce movement quality',
      'Steady state cardio finisher on all three strength days maintains aerobic capacity when traditional cardio equipment is unavailable',
    ],
  },
  'base-accumulation': {
    method: 'Base Accumulation — Running + Strength Hybrid',
    keyPrinciples: [
      'Three progressive runs per week (easy 10 km → easy-medium 13–15 km → long aerobic 18–22 km) build aerobic base through progressive volume overload',
      'Every session — run or strength — opens with the same CNS/mobility giant set (hamstring bridges, Copenhagen planks, Cossack squats, sprinter lunges, pogo hops) to reinforce movement quality at high weekly volumes',
      'Lower day (Day 1) uses Barbell Front Squat + Cable Hip Airplane superset to develop anterior chain strength with simultaneous hip stability demand',
      'Upper day (Day 2) pairs horizontal push/pull (Bench + Prone DB Row) before overhead press and pull-ups to build structural balance',
      'Full GPP day (Day 3) is single-leg dominant throughout — Cable Hip Airplane, Bulgarian Split Squat, Single Leg Landmine RDL and Single Leg Calf Raise with 20-second stretch hold',
    ],
  },
  'fb-upper-lower-accessories': {
    method: 'Full Body / Upper / Lower / Accessories — 4-Day Structural Balance',
    keyPrinciples: [
      'Day 1 (Full Body) covers every pattern in a single session: shoulder press, lat pulldown, row, push, leg press, arms, hip adductor/abductor — making it a standalone "whole-body insurance" session that reinforces all movements before the split days',
      'Day 2 (Upper) is the highest-intensity session — heavy 5-set supersets of Behind-the-Neck Press + Pull Ups at 2–3 reps develop maximum neuromuscular output before dropping into hypertrophy volume',
      'Day 3 (Lower) is the most thorough single lower-body session in the programme: 5 distinct movement patterns (adductor/abductor, hamstring curl, RDL, reverse lunge, leg extension, pendulum squat) ensuring complete lower-body structural balance',
      'Day 4 (Accessories) targets lagging detail muscles — rear delts, lateral raises, spider curls, JM press, ring skullcrushers — that get compressed in the other three sessions due to heavier compound prioritisation',
      'All sessions open with the same warm-up GS format: a core stability exercise + Copenhagen Plank or Arm Bar + a mobility drill + a push pattern — building a consistent pre-session ritual regardless of the day\'s primary focus',
    ],
  },
  'full-body': {
    method: 'Full Body — 4-Day Superset Hypertrophy',
    keyPrinciples: [
      'Four full-body sessions per week, each with a different primary movement pattern focus: Day 1 pull/overhead, Day 2 squat/hinge, Day 3 push/chest, Day 4 lat/deadlift — ensuring every pattern is trained with fresh motor units twice per week',
      'Every session opens with the same 1-round warmup giant set (Child\'s Pose, Supine Arm Bar + session-specific mobility) to build a consistent pre-training ritual and prime the relevant joints',
      'All working exercises are in supersets — push/pull, squat/hinge, or agonist/antagonist pairings — maximising time efficiency and metabolic stimulus while managing per-set fatigue',
      'Tempos vary by exercise type: 3-2-2-0 and 3-1-2-0 for upper body emphasise the stretch position; 4-0-2-0 on the Deficit Deadlift creates a maximal eccentric stimulus; 3-0-2-1 on posterior chain holds the contraction',
      'Arms receive dedicated volume through direct superset work on every session (Chin Ups/Close Grip Bench Day 1, Curl/Dips Day 2, Tricep Extensions Day 4) ensuring bicep/tricep development without arm-only days',
    ],
  },
  'female-physique-5day': {
    method: 'Female Physique 5 Day — Superset Hypertrophy Split',
    keyPrinciples: [
      'Five sessions split into Lower/Upper/Lower/Lower/Upper — higher lower-body frequency (3×/week) targets glutes, hamstrings and quads for the physique priorities most common in female training',
      'Every session opens with a 1-round mobility or activation giant set (Cat Cow/Bird Dog on lower days, Windmill/KB Bottom-Up on upper days, Sprinter Lunge/Cossack on Day 3) to prime joints before loaded work',
      'All working exercises are in supersets or giant sets — antagonist or adjacent muscles are paired (push/pull, hinge/lat, glute/unilateral) to keep session density high while managing fatigue per muscle group',
      'Tempos cluster around 2-2-2-0 and 2-1-2-0 throughout — 2-second eccentric, 2-second isometric, 2-second concentric — creating high time under tension without the technique breakdown of slow eccentrics',
      'Arms are trained as finishing supersets on every session (DB Hammer + Skullcrushers Day 2, Cable Tricep + Cable Curl Day 3, Rope Tricep + Cable Curl Day 4, Skullcrusher + Incline Curl Day 5) ensuring bicep/tricep volume without dedicated arm days',
    ],
  },
  'female-531': {
    method: 'Female 531 — Jim Wendler Wave Loading',
    keyPrinciples: [
      'The three main lifts (Trap Bar Deadlift, Hack Squat, Chin Up) follow Jim Wendler\'s 5/3/1 wave: Week 1 = 3×5 @ 65/75/85%, Week 2 = 3×3 @ 70/80/90%, Week 3 = 5/3/1 @ 75/85/95% (AMRAP on last set), Week 4 = Deload',
      'The AMRAP final set is the engine of 531 — always leave 1 rep in reserve, but push hard; this is where strength is built and weekly progress is tracked',
      'Day 1 is hinge-dominant (Trap Bar DL), Day 2 is quad-dominant (Hack Squat), Day 3 is upper-body pull-dominant (Chin Up) — ensuring every major pattern is trained with a progressive overload main lift each week',
      'Accessories are kept simple and repeatable — posterior chain (Hip Thrusts, RDL, Hamstring Curl), upper push (Incline DB Press, Floor Press), and isolation work stays at 6–15 reps with controlled tempos',
      'The programme is designed for women building their first strength base — lower-back-friendly trap bar over conventional deadlift, machine squat options, and a 3-day structure to allow full recovery between sessions',
    ],
  },
  'depletion': {
    method: 'Depletion — Glycogen Depletion Giant Sets + Tension Day',
    keyPrinciples: [
      'Monday and Wednesday use 3-round giant sets of 3–4 exercises with only 45–60s between movements — the short rest and high rep range (12–20) is designed to fully deplete muscle glycogen, creating a strong fat-burning environment',
      'Each giant set targets a distinct muscle group cluster: lower body compound, upper push/pull, and glute/abs/arms — ensuring whole-body glycogen depletion across every session',
      'Saturday is a "Tension Day" — heavier loads (6–10 reps), longer rest (90s), single supersets — designed to deliver a strength and hypertrophy stimulus after two depletion days',
      'The two depletion sessions use different exercises for each giant set (e.g. Hack Squat Mon vs Leg Extension Wed; Chest Press Mon vs Pec Deck Wed) to hit the same muscles through different strength curves without repeating the same movement twice in a week',
      'Arms are trained at the end of each depletion giant set (Scott Curl + Rope Pushdown / Cable Curl + Tricep Extension) to ensure bicep/tricep depletion after heavier compound work — maximising total muscle glycogen drainage per session',
    ],
  },
  'contrast-block': {
    method: 'Contrast Block — PAP Tri-Sets & Sprint Integration',
    keyPrinciples: [
      'Each lower session contains one contrast tri-set: a heavy hinge/squat (3–5 reps) → explosive plyometric → anti-gravity core hold, exploiting post-activation potentiation to drive power output after each strength set',
      'Each upper session has a contrast pair: Pull Ups/Bentover Row (strength) → Ski Erg sprint/Band Speed Row (ballistic), pairing vertical and horizontal pulling patterns with their explosive equivalents',
      'The dedicated sprint day (1KM Sprint Intervals) uses 6×300s running intervals bookended by a plyometric activation circuit, developing anaerobic capacity separately from strength sessions',
      'Day B separates vertical pull/lats/biceps from Day D horizontal pull/push/triceps — two upper sessions per week with completely different movement patterns and muscle emphasis',
      'All four resistance sessions open with a 1-round warmup giant set specific to the day\'s demands (posterior chain, shoulder/thoracic, knee activation, or lateral core) to prime joints before heavy loading',
    ],
  },
  'full-body-contrast-blend': {
    method: 'Contrast — PAP Full Body Blend',
    keyPrinciples: [
      'Every session pairs a heavy compound lift (3–12 reps) with an immediate plyometric or reactive movement in a tri-set or superset — exploiting post-activation potentiation to prime the nervous system before accessory work',
      'Four full-body sessions per week hit every major movement pattern (squat, hinge, press, pull, carry) across the week so no muscle is undertrained or overstressed',
      'Each session opens with a 3–4 exercise giant-set activation sequence targeting mobility, stability, and neural readiness specific to that day\'s primary movement pattern',
      'Power exercises (box jumps, broad jumps, medicine ball throws, squat jumps) are always positioned immediately after the strength lift while PAP is at its peak — never used as a warmup or finisher',
      'Accessory supersets (lateral raises, arms, calf raises) are structured as paired sets to maintain session density and accumulate adequate volume without excessive rest',
    ],
  },
}

export const PROGRAM_TEMPLATES = RAW_PROGRAM_TEMPLATES.map((t) => {
  const meta = TEMPLATE_METADATA[t.id] || {}
  // Support three template formats:
  // 1. Old:    goal_type (string), days_per_week, default_weeks
  // 2. Mid:    goal (string), days_per_week, duration_weeks
  // 3. New:    goals (array), sessions_per_week, (no weeks field)
  const primaryGoalKey = t.goal_type || t.goal || (Array.isArray(t.goals) ? t.goals[0] : null)
  return {
    ...t,
    method: meta.method || 'Classic',
    coach: meta.coach || 'Poliquin Principles',
    keyPrinciples: meta.keyPrinciples || [],
    conditioning: meta.conditioning || null,
    goal: GOAL_DISPLAY[primaryGoalKey] || primaryGoalKey || 'General',
    days: t.days_per_week || t.sessions_per_week || 3,
    weeks: t.default_weeks || t.duration_weeks || 8,
    difficulty: DIFFICULTY_DISPLAY[t.difficulty] || t.difficulty || 'Intermediate',
  }
})

// ============================================================
// CONDITIONING METHODS — Energy System Development Reference
// Used in ProgramTemplates.jsx ConditioningCard library
// ============================================================

export const CONDITIONING_METHODS = [
  {
    id: 'gbc',
    name: 'German Body Composition (GBC)',
    category: 'Metabolic Conditioning',
    energySystem: 'Glycolytic',
    duration: '45–60 min',
    frequency: '2–3×/week',
    description:
      'Alternates between upper and lower body exercises with short rest periods to maximise lactate production and GH release. One of the most effective approaches for simultaneous fat loss and muscle retention.',
    whenToUse:
      'Use in a fat-loss or body recomposition phase. Pairs well with moderate-calorie diets. Avoid in peak strength or intensification phases where CNS recovery is critical.',
    protocols: [
      {
        name: 'Classic GBC Superset',
        work: '10–12 reps',
        rest: '10 s between exercises, 60–90 s between rounds',
        sets: '3–5 rounds',
        notes:
          'Pick one lower-body push, one upper-body pull. Move immediately between exercises. Rest 60 s after the pair.',
        exercises: ['Back Squat', 'Chin-Up', 'Romanian Deadlift', 'DB Bench Press'],
      },
      {
        name: 'GBC Tri-Set',
        work: '10 reps each',
        rest: '90 s after tri-set',
        sets: '3–4 rounds',
        notes:
          'Three exercises cycling upper push → lower pull → upper pull. Elevates lactate higher than supersets.',
        exercises: ['DB Shoulder Press', 'Leg Press', 'Chest-Supported Row'],
      },
    ],
  },
  {
    id: 'tempo-intervals',
    name: 'Tempo Intervals',
    category: 'Speed Endurance',
    energySystem: 'Oxidative / Glycolytic',
    duration: '20–35 min',
    frequency: '1–2×/week',
    description:
      'Submaximal repeats performed at roughly 70–80% max effort with incomplete recovery. Builds aerobic capacity, improves lactate clearance, and maintains conditioning without excessive CNS cost.',
    whenToUse:
      'Use during accumulation or loading phases to build a conditioning base alongside weight training. Low enough intensity to not impair strength recovery.',
    protocols: [
      {
        name: '100m Tempo Run',
        work: '100 m @ ~75% effort',
        rest: '60 s walk back',
        sets: '10–16 reps',
        notes: 'Should feel controlled and rhythmic, never sprinting. Heart rate 130–150 bpm.',
        exercises: ['100m Run'],
      },
      {
        name: 'Bike Tempo Intervals',
        work: '45 s moderate effort',
        rest: '45 s easy spin',
        sets: '12–20 rounds',
        notes: 'Perceived effort 6/10. Great low-impact alternative for those with joint issues.',
        exercises: ['Assault Bike', 'Stationary Bike'],
      },
    ],
  },
  {
    id: 'esd-alactic',
    name: 'Alactic Power (Short Sprints)',
    category: 'Speed-Strength',
    energySystem: 'ATP-PCr (Alactic)',
    duration: '20–30 min',
    frequency: '1–2×/week',
    description:
      'Maximum-effort bursts of 5–10 seconds with full recovery to train the phosphagen system. Develops explosive power and speed without significant metabolic fatigue.',
    whenToUse:
      'Use in intensification phases or when the goal is power and speed retention during a fat-loss block. Requires full rest — never done when fatigued.',
    protocols: [
      {
        name: '10 s Sprint / 90 s Rest',
        work: '10 s all-out sprint',
        rest: '90 s full rest',
        sets: '8–10 reps',
        notes:
          'Quality over quantity. Each sprint should feel as fast as the first. Stop if speed drops.',
        exercises: ['Flat Sprint', 'Sled Push', 'Cycle Sprint'],
      },
      {
        name: 'Bounding / Jump Complex',
        work: '5–6 reps explosive',
        rest: '2 min',
        sets: '5–6 sets',
        notes: 'Broad jumps, single-leg hops, or box jumps. Land softly and reset fully.',
        exercises: ['Broad Jump', 'Box Jump', 'Single-Leg Hop'],
      },
    ],
  },
  {
    id: 'aerobic-base',
    name: 'Aerobic Base Training (MAF)',
    category: 'Aerobic Base',
    energySystem: 'Oxidative (Fat)',
    duration: '30–60 min',
    frequency: '2–4×/week',
    description:
      'Steady-state work at a heart rate that keeps you primarily in fat-burning aerobic zones (typically 130–150 bpm depending on individual). Builds the aerobic engine, accelerates recovery between sessions, and supports hormonal health.',
    whenToUse:
      'Ideal as active recovery, on off-days, or for clients newer to conditioning. Used throughout all training phases but especially in accumulation to build the base.',
    protocols: [
      {
        name: 'MAF Walk / Jog',
        work: '30–60 min continuous',
        rest: 'None',
        sets: '1 continuous effort',
        notes:
          'Keep heart rate at or below 180 minus your age. If you cannot hold a conversation, slow down.',
        exercises: ['Walking', 'Jogging', 'Hiking'],
      },
      {
        name: 'Low-Intensity Bike / Row',
        work: '30–45 min continuous',
        rest: 'None',
        sets: '1 continuous effort',
        notes: 'RPE 4–5/10. Nasal breathing should be possible throughout.',
        exercises: ['Assault Bike (easy)', 'SkiErg', 'Rowing Machine'],
      },
    ],
  },
  {
    id: 'liss-cardio',
    name: 'Low-Intensity Steady State (LISS)',
    category: 'Aerobic Development',
    energySystem: 'Oxidative',
    duration: '30–45 min',
    frequency: '2–3×/week',
    description:
      'Moderate-intensity continuous cardio at a comfortable, sustainable pace. Burns calories, supports fat oxidation, and improves cardiovascular health with minimal recovery cost.',
    whenToUse:
      'Great for fat loss phases when added on top of strength training. Easy enough not to interfere with recovery. Can be done most days.',
    protocols: [
      {
        name: 'Incline Treadmill Walk',
        work: '30–45 min @ 4–6 km/h, 8–12% incline',
        rest: 'None',
        sets: '1 session',
        notes: 'Higher incline increases calorie burn and glute activation without added impact.',
        exercises: ['Incline Treadmill'],
      },
      {
        name: 'Stationary Bike',
        work: '30–40 min @ moderate pace',
        rest: 'None',
        sets: '1 session',
        notes: 'RPE 5/10 — you should be able to hold a full conversation.',
        exercises: ['Stationary Bike', 'Recumbent Bike'],
      },
    ],
  },
  {
    id: 'hiit',
    name: 'High-Intensity Interval Training (HIIT)',
    category: 'ESD',
    energySystem: 'Glycolytic / Oxidative',
    duration: '15–25 min',
    frequency: '1–2×/week',
    description:
      'Short, intense work intervals alternated with recovery periods. Highly effective for improving VO₂ max, insulin sensitivity, and burning calories in a time-efficient manner. Use sparingly — CNS cost is significant.',
    whenToUse:
      'Use when time is limited or as a metabolic finisher after strength work. Do NOT use more than twice per week alongside heavy lifting, or performance and recovery will suffer.',
    protocols: [
      {
        name: 'Tabata (20s/10s)',
        work: '20 s all-out',
        rest: '10 s rest',
        sets: '8 rounds (4 min total)',
        notes:
          'Popularised for its time efficiency. Use for a single movement. True Tabata requires maximum effort on every interval.',
        exercises: ['Bike Sprint', 'Burpees', 'Jump Squat'],
      },
      {
        name: '30:30 Intervals',
        work: '30 s hard',
        rest: '30 s easy',
        sets: '10–16 rounds',
        notes:
          'More sustainable than Tabata. Effort should be 8–9/10. Pace yourself for the full set count.',
        exercises: ['Assault Bike', 'Rower', 'Sled Push'],
      },
      {
        name: '1:2 Work-Rest Intervals',
        work: '30 s hard',
        rest: '60 s walk/rest',
        sets: '8–12 rounds',
        notes: 'Allows slightly more recovery. Good for beginners transitioning into HIIT.',
        exercises: ['Treadmill Sprint', 'Jumping Jacks', 'Ski Erg'],
      },
    ],
  },
]
