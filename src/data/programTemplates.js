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
}

export const PROGRAM_TEMPLATES = RAW_PROGRAM_TEMPLATES.map((t) => {
  const meta = TEMPLATE_METADATA[t.id] || {}
  return {
    ...t,
    method: meta.method || 'Classic',
    coach: meta.coach || 'Poliquin Principles',
    keyPrinciples: meta.keyPrinciples || [],
    conditioning: meta.conditioning || null,
    goal: GOAL_DISPLAY[t.goal_type] || t.goal_type,
    days: t.days_per_week,
    weeks: t.default_weeks,
    difficulty: DIFFICULTY_DISPLAY[t.difficulty] || t.difficulty,
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
