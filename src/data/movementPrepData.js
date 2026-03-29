// ============================================================
// MOVEMENT PREP — 4 R's Protocol
// Poliquin-based pre-training preparation system
// Re-align → Relax/Release → Re-integrate → Ramp
// ============================================================

export const MOVEMENT_PREP_PROTOCOLS = {

  // ─── LOWER BODY DAY ──────────────────────────────────────────────────────────
  lower: {
    label: 'Lower Body Day',
    color: '#00C896',
    icon: '🦵',
    phases: [
      {
        id: 'realign',
        name: 'Re-align / Re-position',
        duration: '3 min',
        description: 'Establish optimal joint position and postural alignment before loading.',
        exercises: [
          { name: 'Supine 90/90 Hip Correction', sets: 1, reps: '5 deep breaths', cues: 'Lie on back, hips and knees at 90°. Exhale fully and let rib cage drop. Maintain lumbar contact with floor.' },
          { name: 'Heel-Elevated Toe Reach', sets: 2, reps: '8 per side', cues: 'Heels elevated 2–3cm. Reach toes forward while maintaining dorsiflexion. Builds posterior chain length.' },
          { name: 'Standing Hip Shift (Wall)', sets: 1, reps: '5 per side, 5s hold', cues: 'Wall on one side. Shift hip into wall creating a lateral hip flexion. Addresses infrasternal angle asymmetry.' },
        ],
      },
      {
        id: 'release',
        name: 'Relax / Release / Activate',
        duration: '4 min',
        description: 'Release overactive tissue and activate inhibited muscles.',
        exercises: [
          { name: 'Single-Leg Hamstring ISO', sets: 2, reps: '30s per side', cues: 'Standing, slight forward lean. Isometric hamstring contraction against your own hand resistance. Activates glute medius.' },
          { name: 'Prone Hip Extension with Breath', sets: 2, reps: '8 per side', cues: 'Face down, exhale and brace core before lifting leg. Avoid lumbar rotation. Pure hip extension only.' },
          { name: 'Side-Lying Clam', sets: 2, reps: '15 per side', cues: 'Hips stacked, feet together. Rotate top knee up maintaining hip contact with floor. Feel glute medius fire.' },
        ],
      },
      {
        id: 'reintegrate',
        name: 'Re-integrate',
        duration: '4 min',
        description: 'Re-integrate movement patterns — program the new position into movement.',
        exercises: [
          { name: 'Split Squat (Bodyweight)', sets: 2, reps: '8 per side', cues: 'Front shin vertical, rear knee drives down — not back. Maintain tall spine. Feel bilateral hip alignment.' },
          { name: 'Kickstance RDL', sets: 2, reps: '8 per side', cues: 'Trail foot for balance only. Hinge at hip, flat back. Drive heel to return. Programs single-leg posterior chain.' },
          { name: 'Lateral Lunge Touch', sets: 2, reps: '6 per side', cues: 'Shift weight laterally. Drive the groin stretch. Touch foot with same-side hand. Return with control.' },
        ],
      },
      {
        id: 'ramp',
        name: 'Ramp — Plyometrics / CNS Activation',
        duration: '3 min',
        description: 'Raise heart rate, prime CNS, and prepare the neuromuscular system for heavy loading.',
        exercises: [
          { name: 'Ankle Pogos', sets: 2, reps: '20s', cues: 'Minimal ground contact time. Stiff ankles, slight forward lean. Spring from the ankle joint only. 2×10s rest.' },
          { name: 'Vertical Jump x3', sets: 3, reps: '3 jumps', cues: 'Maximal intent on every jump. Full arm swing. Soft landing with hip/knee absorption. 30s rest between sets.' },
          { name: 'Broad Jump', sets: 2, reps: '3 jumps', cues: 'Arm swing + hip hinge to load. Explode forward. Stick the landing for 3 seconds. Builds horizontal power.' },
        ],
      },
    ],
  },

  // ─── UPPER BODY DAY ──────────────────────────────────────────────────────────
  upper: {
    label: 'Upper Body Day',
    color: '#60a5fa',
    icon: '💪',
    phases: [
      {
        id: 'realign',
        name: 'Re-align / Re-position',
        duration: '3 min',
        description: 'Establish scapular position and thoracic alignment before pressing or pulling.',
        exercises: [
          { name: 'Supine 90/90 Reach (Upper Focus)', sets: 1, reps: '5 deep breaths per side', cues: 'Lie on side, knees stacked. Top arm reaches forward + upward rotating the thoracic spine. Exhale at end range.' },
          { name: 'Wall Slide (Scapular)', sets: 2, reps: '10 reps', cues: 'Back flat against wall. Arms bent 90°, forearms on wall. Slide arms overhead maintaining contact. Corrects upper-cross syndrome.' },
          { name: 'Chin-Tuck with Cervical Retraction', sets: 2, reps: '10 reps, 5s hold', cues: 'Stand tall. Draw chin directly back (not down). Feel a "double chin". Resets forward head posture before pressing.' },
        ],
      },
      {
        id: 'release',
        name: 'Relax / Release / Activate',
        duration: '4 min',
        description: 'Release pec minor and upper traps; activate lower trapezius and serratus.',
        exercises: [
          { name: 'Pronated Side Plank (Serratus)', sets: 2, reps: '20s per side', cues: 'Forearm plank rotated to one side. Focus on pushing the floor away with the bottom shoulder. Serratus anterior prime mover.' },
          { name: 'Band Face Pull (External Rotation)', sets: 2, reps: '15 reps', cues: 'Band at face height. Pull to forehead with elbows high. Squeeze external rotators at peak. Counters internal rotation dominance.' },
          { name: 'Thoracic Extension on Foam Roller', sets: 2, reps: '8 reps each level', cues: 'Roller perpendicular to spine. Hands behind head. Extend over roller at each thoracic segment. Opens closed kyphosis.' },
        ],
      },
      {
        id: 'reintegrate',
        name: 'Re-integrate',
        duration: '4 min',
        description: 'Program the corrected position into compound upper body movement patterns.',
        exercises: [
          { name: 'Deficit Push-Up', sets: 2, reps: '8 reps', cues: 'Hands on plates or rings. Full range including protraction at top. Chest below hands at bottom. Maximises serratus and pec development.' },
          { name: 'Hanging Knee Raise', sets: 2, reps: '8 reps', cues: 'Dead hang grip, slight posterior pelvic tilt. Raise knees to hip height. Controlled descent. Programs scapular depression under load.' },
          { name: 'Incline Garhammer Raise', sets: 2, reps: '8 reps', cues: 'Inclined bench at 45°. Knees to chest from hanging position. Builds hip flexor strength in lengthened position — upper body integration.' },
        ],
      },
      {
        id: 'ramp',
        name: 'Ramp — Speed & CNS Activation',
        duration: '3 min',
        description: 'Prime the CNS and prepare the shoulder girdle for explosive/heavy upper body training.',
        exercises: [
          { name: 'Med Ball Overhead Slam', sets: 3, reps: '5 reps', cues: 'Full overhead reach. Slam with maximal intent. Receive at knee height. Stimulates type IIX fibre recruitment for pressing/pulling.' },
          { name: 'Clapping Push-Up', sets: 3, reps: '5 reps', cues: 'Set up like normal push-up. Lower with control. Explode up. Clap and land softly. Pure rate-of-force development.' },
          { name: 'Band Pull-Apart (Speed)', sets: 2, reps: '15 fast reps', cues: 'Light band. Rapid pulses — full stretch at each rep. Focus on SPEED not heavy resistance. Potentiates rear delt and rotator cuff.' },
        ],
      },
    ],
  },

  // ─── FULL BODY DAY ────────────────────────────────────────────────────────────
  full_body: {
    label: 'Full Body Day',
    color: '#f59e0b',
    icon: '⚡',
    phases: [
      {
        id: 'realign',
        name: 'Re-align / Re-position',
        duration: '3 min',
        description: 'Full body alignment — hip position, spine neutrality, shoulder girdle.',
        exercises: [
          { name: 'Supine 90/90 Hip Correction', sets: 1, reps: '5 deep breaths', cues: 'Lie on back. Exhale fully. Let ribcage drop. Create lumbar contact with the floor.' },
          { name: 'Standing Hip Shift (Wall)', sets: 1, reps: '5 per side, 5s hold', cues: 'Wall on one side. Shift hip into wall. Addresses infrasternal angle and hip lateralization.' },
          { name: 'Thoracic Rotation in Quadruped', sets: 2, reps: '8 per side', cues: 'Hand behind head. Rotate elbow toward opposite knee then to ceiling. Full thoracic ROM. Addresses rotation restriction.' },
        ],
      },
      {
        id: 'release',
        name: 'Relax / Release / Activate',
        duration: '4 min',
        description: 'Combination release — anterior chain (hip flexors, pecs) and posterior activation.',
        exercises: [
          { name: 'Half-Kneeling Hip Flexor Stretch', sets: 2, reps: '30s per side', cues: 'Back knee on floor. Posterior pelvic tilt. Drive hip forward — not forward lean. Stretches iliopsoas in correct position.' },
          { name: 'Single-Leg Hamstring ISO', sets: 2, reps: '20s per side', cues: 'Standing, slight lean. Isometric hamstring contraction. Activates posterior chain before bilateral loading.' },
          { name: 'Band Face Pull + External Rotation', sets: 2, reps: '12 reps', cues: 'Combine face pull with external rotation at peak. Addresses upper cross syndrome for full-body days.' },
        ],
      },
      {
        id: 'reintegrate',
        name: 'Re-integrate',
        duration: '4 min',
        description: 'Full body movement pattern integration — hinge, squat, push, pull.',
        exercises: [
          { name: 'Kickstance RDL', sets: 2, reps: '6 per side', cues: 'Programs single-leg hinge. Trail foot for balance. Drive heel to return. Full hip extension at top.' },
          { name: 'Ab Rollout (Kneeling)', sets: 2, reps: '8 reps', cues: 'Kneel on pad. Arms locked. Roll out until parallel. Pull back with lats, not lumbar extension. Integrates anterior core.' },
          { name: 'Goblet Squat (Slow)', sets: 2, reps: '8 reps, 4s down', cues: 'Heavy enough to feel the weight. Elbows inside knees at bottom. Tall chest. Reinforces squat mechanics.' },
        ],
      },
      {
        id: 'ramp',
        name: 'Ramp — Full Body Power',
        duration: '3 min',
        description: 'Full CNS activation for total body training.',
        exercises: [
          { name: 'Vertical Jump x3', sets: 3, reps: '3 jumps', cues: 'Maximal intent. Full arm swing. Soft landing with hip/knee absorption. 30s rest between sets.' },
          { name: 'Medicine Ball Slam', sets: 3, reps: '5 reps', cues: 'Full overhead. Slam with maximal intent. Combine upper and lower body force generation.' },
          { name: 'Ankle Pogos', sets: 2, reps: '15s', cues: 'Stiff ankles. Minimal ground contact. Primes Achilles tendon for heavy loading.' },
        ],
      },
    ],
  },
}

export const SESSION_TYPE_MAP = {
  strength:     'lower',
  lower:        'lower',
  upper:        'upper',
  push:         'upper',
  pull:         'upper',
  legs:         'lower',
  full_body:    'full_body',
  conditioning: 'lower',
  emom:         'full_body',
  amrap:        'full_body',
  circuit:      'full_body',
}
