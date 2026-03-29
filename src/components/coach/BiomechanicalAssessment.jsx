import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../hooks/useAuth.jsx'

// ============================================================
// CONSTANTS & DATA
// ============================================================

const FMS_TESTS = [
  {
    id: 'deep_squat',
    name: 'Deep Squat',
    bilateral: false,
    description: 'Feet shoulder-width, toes forward. Squat to full depth, arms overhead.',
    criteria: {
      3: 'Hips below knees, femur parallel, torso parallel to tibia, knees aligned over feet, dowel aligned over feet',
      2: 'Heels elevated OR dowel not aligned OR some compensation present',
      1: 'Cannot perform even with heels elevated',
      0: 'Pain during test',
    },
  },
  {
    id: 'hurdle_step',
    name: 'Hurdle Step',
    bilateral: true,
    description: 'Step over hurdle (set at tibial tuberosity height) while maintaining balance.',
    criteria: {
      3: 'Hips, knees and ankles aligned in sagittal plane, minimal lumbar movement, dowel and hurdle remain parallel',
      2: 'Alignment lost OR lumbar movement OR dowel/hurdle not parallel',
      1: 'Contact with hurdle OR loss of balance',
      0: 'Pain during test',
    },
  },
  {
    id: 'inline_lunge',
    name: 'Inline Lunge',
    bilateral: true,
    description: 'Foot on line, lunge to touch rear knee to board, dowel behind back.',
    criteria: {
      3: 'Dowel contacts maintained, no torso movement, dowel stays vertical, knee touches board',
      2: 'Dowel contacts NOT maintained OR torso movement OR knee misses board',
      1: 'Loss of balance',
      0: 'Pain during test',
    },
  },
  {
    id: 'shoulder_mobility',
    name: 'Shoulder Mobility',
    bilateral: true,
    description: 'One hand overhead down back, other behind back up. Measure fist distance.',
    criteria: {
      3: 'Fists within one hand length',
      2: 'Fists within one-and-a-half hand lengths',
      1: 'Fists NOT within one-and-a-half hand lengths',
      0: 'Pain during test or clearing test positive',
    },
    clearingTest: 'Push-up position — extend elbow with hand on shoulder. Pain = 0.',
  },
  {
    id: 'aslr',
    name: 'Active Straight Leg Raise',
    bilateral: true,
    description: 'Supine. Raise one leg keeping knee extended, opposite leg flat.',
    criteria: {
      3: 'Ankle clears a point between mid-thigh and ASIS',
      2: 'Ankle clears a point between knee and mid-thigh',
      1: 'Ankle does not clear the knee',
      0: 'Pain during test',
    },
  },
  {
    id: 'trunk_stability_pushup',
    name: 'Trunk Stability Push-Up',
    bilateral: false,
    description: 'Males: thumbs at forehead level. Females: thumbs at chin level. Single push-up.',
    criteria: {
      3: 'Male: performs single rep at forehead. Female: performs single rep at chin.',
      2: 'Male: performs at chin level. Female: performs at clavicle level.',
      1: 'Cannot perform at given level',
      0: 'Pain during test or clearing test positive',
    },
    clearingTest: 'Prone press-up / cobra. Pain in spine = 0.',
  },
  {
    id: 'rotary_stability',
    name: 'Rotary Stability',
    bilateral: true,
    description: 'Quadruped. Extend ipsilateral arm and leg, bring elbow to knee.',
    criteria: {
      3: 'Correctly performs unilateral rep with spine parallel to board',
      2: 'Correctly performs diagonal rep (opposite arm/leg)',
      1: 'Cannot perform diagonal rep',
      0: 'Pain during test or clearing test positive',
    },
    clearingTest: 'Quadruped flexion (childs pose). Pain = 0.',
  },
]

const HIP_ROM = [
  { id: 'flex', name: 'Flexion', normal: 120, unit: '°', note: 'Supine, knee extended' },
  { id: 'ext', name: 'Extension', normal: 30, unit: '°', note: 'Prone, knee extended' },
  { id: 'abd', name: 'Abduction', normal: 45, unit: '°', note: 'Supine, neutral rotation' },
  { id: 'add', name: 'Adduction', normal: 30, unit: '°', note: 'Supine, over midline' },
  { id: 'ir', name: 'Internal Rotation', normal: 45, unit: '°', note: 'Prone, knee at 90°' },
  { id: 'er', name: 'External Rotation', normal: 45, unit: '°', note: 'Prone, knee at 90°' },
]

const HIP_SPECIAL = [
  { id: 'thomas', name: 'Thomas Test', desc: 'Hip flexor tightness. Supine, pull one knee to chest — observe contralateral hip.' },
  { id: 'faber', name: 'FABER / Patrick\'s', desc: 'Figure-4 position. Pain in groin = hip pathology. SI pain = SI joint.' },
  { id: 'fadir', name: 'FADIR', desc: 'Flexion, Adduction, Internal Rotation. Positive = anterior hip impingement (FAI).' },
  { id: 'ober', name: 'Ober\'s Test', desc: 'Side-lying. IT band tightness — inability to adduct past neutral = positive.' },
  { id: 'trendelenburg', name: 'Trendelenburg Sign', desc: 'Single-leg stance 30s. Contralateral pelvis drop = weak glute medius.' },
]

const SHOULDER_ROM = [
  { id: 'flex', name: 'Flexion', normal: 180, unit: '°', note: 'Standing, arm forward' },
  { id: 'ext', name: 'Extension', normal: 60, unit: '°', note: 'Standing, arm behind' },
  { id: 'abd', name: 'Abduction', normal: 180, unit: '°', note: 'Standing, coronal plane' },
  { id: 'ir', name: 'Internal Rotation', normal: 70, unit: '°', note: 'Supine, elbow at 90°' },
  { id: 'er', name: 'External Rotation', normal: 90, unit: '°', note: 'Supine, elbow at 90°' },
  { id: 'hadd', name: 'Horiz. Adduction', normal: 130, unit: '°', note: 'Posterior capsule tightness' },
]

const SHOULDER_SPECIAL = [
  { id: 'neer', name: 'Neer Impingement', desc: 'Passive forward flexion with internal rotation. Pain at end range = positive.' },
  { id: 'hawkins', name: 'Hawkins-Kennedy', desc: 'Arm at 90° forward flex, internally rotate. Subacromial impingement.' },
  { id: 'empty_can', name: 'Empty Can (Jobe\'s)', desc: 'Arms at 90° abduction, 30° forward, thumb down. Resisted = supraspinatus.' },
  { id: 'apprehension', name: 'Apprehension Test', desc: 'ER at 90° abduction. Apprehension/pain = anterior instability.' },
  { id: 'speeds', name: "Speed's Test", desc: 'Resisted forward flexion, elbow extended, supinated. Biceps tendon pathology.' },
  { id: 'scapular_winging', name: 'Scapular Winging', desc: 'Push-up against wall. Medial border lifts = serratus anterior weakness.' },
]

const CERVICAL_ROM = [
  { id: 'flex', name: 'Flexion', normal: 80, unit: '°' },
  { id: 'ext', name: 'Extension', normal: 70, unit: '°' },
  { id: 'lat_l', name: 'Lateral Flexion L', normal: 45, unit: '°' },
  { id: 'lat_r', name: 'Lateral Flexion R', normal: 45, unit: '°' },
  { id: 'rot_l', name: 'Rotation L', normal: 80, unit: '°' },
  { id: 'rot_r', name: 'Rotation R', normal: 80, unit: '°' },
]

const THORACIC_ROM = [
  { id: 'flex', name: 'Flexion (finger-floor)', normal: 10, unit: 'cm', note: 'Distance from fingertip to floor' },
  { id: 'rot_l', name: 'Rotation L', normal: 40, unit: '°', note: 'Seated rotation' },
  { id: 'rot_r', name: 'Rotation R', normal: 40, unit: '°', note: 'Seated rotation' },
  { id: 'ext', name: 'Extension', normal: 25, unit: '°', note: 'Kyphosis flexibility' },
]

const LUMBAR_ROM = [
  { id: 'flex', name: 'Flexion', normal: 60, unit: '°' },
  { id: 'ext', name: 'Extension', normal: 25, unit: '°' },
  { id: 'lat_l', name: 'Lateral Flexion L', normal: 25, unit: '°' },
  { id: 'lat_r', name: 'Lateral Flexion R', normal: 25, unit: '°' },
]

const SPINE_SPECIAL = [
  { id: 'slr', name: 'Straight Leg Raise (SLR)', desc: 'Supine, passive hip flex with knee extended. < 70° or radicular pain = nerve tension / disc.' },
  { id: 'slump', name: 'Slump Test', desc: 'Seated slump, extend knee, dorsiflex ankle. Neural tension test. Symptom reproduction = positive.' },
  { id: 'prone_instability', name: 'Prone Instability Test', desc: 'Prone, legs off table, provoke pain. Lift legs — if pain decreases = lumbar instability.' },
  { id: 'quadrant', name: 'Quadrant Test (Kemp\'s)', desc: 'Extension + lateral flexion + rotation. Facet joint / foraminal stenosis.' },
]

const POSTURE_ITEMS = {
  anterior: [
    { id: 'head_tilt_l', label: 'Head tilt LEFT', side: 'L' },
    { id: 'head_tilt_r', label: 'Head tilt RIGHT', side: 'R' },
    { id: 'shoulder_high_l', label: 'LEFT shoulder elevated', side: 'L' },
    { id: 'shoulder_high_r', label: 'RIGHT shoulder elevated', side: 'R' },
    { id: 'hip_high_l', label: 'LEFT hip elevated (lateral pelvic tilt)', side: 'L' },
    { id: 'hip_high_r', label: 'RIGHT hip elevated (lateral pelvic tilt)', side: 'R' },
    { id: 'knee_valgus_l', label: 'LEFT knee valgus (knock-knee)', side: 'L' },
    { id: 'knee_valgus_r', label: 'RIGHT knee valgus (knock-knee)', side: 'R' },
    { id: 'knee_varus_l', label: 'LEFT knee varus (bow-leg)', side: 'L' },
    { id: 'knee_varus_r', label: 'RIGHT knee varus (bow-leg)', side: 'R' },
    { id: 'foot_pronation_l', label: 'LEFT foot over-pronation', side: 'L' },
    { id: 'foot_pronation_r', label: 'RIGHT foot over-pronation', side: 'R' },
    { id: 'foot_supination_l', label: 'LEFT foot supination', side: 'L' },
    { id: 'foot_supination_r', label: 'RIGHT foot supination', side: 'R' },
  ],
  posterior: [
    { id: 'head_shift_l', label: 'Head lateral shift LEFT', side: 'L' },
    { id: 'head_shift_r', label: 'Head lateral shift RIGHT', side: 'R' },
    { id: 'scap_wing_l', label: 'LEFT scapular winging', side: 'L' },
    { id: 'scap_wing_r', label: 'RIGHT scapular winging', side: 'R' },
    { id: 'scap_elev_l', label: 'LEFT scapular elevation', side: 'L' },
    { id: 'scap_elev_r', label: 'RIGHT scapular elevation', side: 'R' },
    { id: 'scoliosis', label: 'Scoliosis / spinal curvature', side: null },
    { id: 'psis_high_l', label: 'LEFT PSIS elevated', side: 'L' },
    { id: 'psis_high_r', label: 'RIGHT PSIS elevated', side: 'R' },
    { id: 'calcaneal_valgus_l', label: 'LEFT calcaneal valgus', side: 'L' },
    { id: 'calcaneal_valgus_r', label: 'RIGHT calcaneal valgus', side: 'R' },
  ],
  lateral: [
    { id: 'forward_head', label: 'Forward Head Posture', side: null },
    { id: 'upper_cross', label: 'Upper Crossed Syndrome (rounded shoulders + FHP)', side: null },
    { id: 'thoracic_kyphosis', label: 'Increased thoracic kyphosis', side: null },
    { id: 'thoracic_flat', label: 'Flat thoracic spine', side: null },
    { id: 'anterior_pelvic_tilt', label: 'Anterior pelvic tilt (Lower Crossed Syndrome)', side: null },
    { id: 'posterior_pelvic_tilt', label: 'Posterior pelvic tilt', side: null },
    { id: 'lumbar_hyperlordosis', label: 'Lumbar hyperlordosis', side: null },
    { id: 'lumbar_flat', label: 'Flat lumbar spine', side: null },
    { id: 'knee_hyperext', label: 'Knee hyperextension (genu recurvatum)', side: null },
    { id: 'knee_flexed', label: 'Habitual knee flexion', side: null },
  ],
}

// ============================================================
// CORRECTIVE LOGIC ENGINE
// Maps dysfunction findings → Phase 1 priority correctives
// ============================================================

function generateRecommendations(fmsScores, posture, hipRom, hipSpecial, shoulderRom, shoulderSpecial, cervRom, thorRom, lumRom, spineSpecial) {
  const issues = []
  const correctives = []

  // ── FMS Scoring ──
  const bilateralTests = ['hurdle_step', 'inline_lunge', 'shoulder_mobility', 'aslr', 'rotary_stability']
  let fmsTotal = 0
  let asymmetries = []

  FMS_TESTS.forEach(test => {
    if (test.bilateral) {
      const l = parseInt(fmsScores[`${test.id}_L`]) || 0
      const r = parseInt(fmsScores[`${test.id}_R`]) || 0
      const score = Math.min(l, r)
      fmsTotal += score
      if (l !== r) asymmetries.push(test.name)
      if (score <= 1) issues.push({ region: 'FMS', flag: 'red', text: `${test.name}: score ${score}/3` })
      else if (score === 2) issues.push({ region: 'FMS', flag: 'warn', text: `${test.name}: score 2/3 (compensating)` })
    } else {
      const score = parseInt(fmsScores[test.id]) || 0
      fmsTotal += score
      if (score <= 1) issues.push({ region: 'FMS', flag: 'red', text: `${test.name}: score ${score}/3` })
      else if (score === 2) issues.push({ region: 'FMS', flag: 'warn', text: `${test.name}: score 2/3 (compensating)` })
    }
  })

  if (asymmetries.length > 0) {
    issues.push({ region: 'FMS', flag: 'warn', text: `Bilateral asymmetry: ${asymmetries.join(', ')}` })
  }

  // FMS → corrective map
  const fmsDeepSquat = parseInt(fmsScores.deep_squat) || 0
  const fmsShoulderL = parseInt(fmsScores.shoulder_mobility_L) || 0
  const fmsShoulderR = parseInt(fmsScores.shoulder_mobility_R) || 0
  const fmsAslrL = parseInt(fmsScores.aslr_L) || 0
  const fmsAslrR = parseInt(fmsScores.aslr_R) || 0
  const fmsTsPu = parseInt(fmsScores.trunk_stability_pushup) || 0
  const fmsRsL = parseInt(fmsScores.rotary_stability_L) || 0
  const fmsRsR = parseInt(fmsScores.rotary_stability_R) || 0

  if (fmsDeepSquat < 3) correctives.push({ priority: fmsDeepSquat < 2 ? 1 : 2, category: 'Ankle Mobility', exercise: 'Ankle dorsiflexion wall drill, banded ankle mobilisation', reason: 'Deep Squat score' })
  if (fmsDeepSquat < 2) correctives.push({ priority: 1, category: 'Hip Mobility', exercise: '90/90 hip mobility, hip flexor stretch, deep squat hold with support', reason: 'Deep Squat score ≤ 1' })
  if (fmsDeepSquat < 3) correctives.push({ priority: 2, category: 'Thoracic Extension', exercise: 'Foam roller thoracic extension, quadruped rotation', reason: 'Deep Squat — overhead mobility' })
  if (Math.min(fmsShoulderL, fmsShoulderR) < 3) correctives.push({ priority: 2, category: 'Shoulder / Lat Mobility', exercise: 'Lat stretch, sleeper stretch, doorway pec stretch', reason: 'Shoulder Mobility FMS' })
  if (Math.min(fmsAslrL, fmsAslrR) < 3) correctives.push({ priority: 1, category: 'Hamstring Flexibility', exercise: 'Active straight leg lowering, contract-relax hamstring stretch', reason: 'ASLR FMS' })
  if (Math.min(fmsAslrL, fmsAslrR) < 2) correctives.push({ priority: 1, category: 'Core Stability (Anterior)', exercise: "Dead bug progression, McGill curl-up, hollow body hold", reason: 'ASLR score ≤ 1 — core stability insufficient' })
  if (fmsTsPu < 3) correctives.push({ priority: 1, category: 'Core Anti-Extension', exercise: 'Deadbug, ab wheel eccentric, RKC plank', reason: 'Trunk Stability Push-Up' })
  if (Math.min(fmsRsL, fmsRsR) < 3) correctives.push({ priority: 2, category: 'Core Anti-Rotation', exercise: 'Pallof press, half-kneeling chop & lift, bird dog', reason: 'Rotary Stability FMS' })

  // ── Posture ──
  if (posture.lateral?.forward_head || posture.lateral?.upper_cross) {
    issues.push({ region: 'Posture', flag: 'warn', text: 'Forward Head Posture / Upper Crossed Syndrome' })
    correctives.push({ priority: 1, category: 'Cervical & Upper Trap', exercise: 'Deep neck flexor activation (chin tuck), upper trap & SCM stretch, face pulls', reason: 'Forward head / UCS' })
  }
  if (posture.lateral?.anterior_pelvic_tilt) {
    issues.push({ region: 'Posture', flag: 'warn', text: 'Anterior Pelvic Tilt (Lower Crossed Syndrome)' })
    correctives.push({ priority: 1, category: 'Glute & Core Activation', exercise: 'Glute bridges, hip flexor stretching, posterior pelvic tilt drill, dead bug', reason: 'Anterior pelvic tilt / LCS' })
  }
  if (posture.lateral?.thoracic_kyphosis) {
    issues.push({ region: 'Posture', flag: 'warn', text: 'Increased Thoracic Kyphosis' })
    correctives.push({ priority: 2, category: 'Thoracic Mobility', exercise: 'Foam roller extension over roll, thoracic rotations, band pull-aparts', reason: 'Thoracic kyphosis' })
  }
  if (posture.anterior?.knee_valgus_l || posture.anterior?.knee_valgus_r) {
    issues.push({ region: 'Posture', flag: 'red', text: 'Knee Valgus' })
    correctives.push({ priority: 1, category: 'Glute Med / Hip ER Activation', exercise: 'Clamshells, banded squats, single-leg stance drills, lateral band walks', reason: 'Knee valgus' })
  }
  if (posture.anterior?.foot_pronation_l || posture.anterior?.foot_pronation_r || posture.posterior?.calcaneal_valgus_l || posture.posterior?.calcaneal_valgus_r) {
    issues.push({ region: 'Posture', flag: 'warn', text: 'Foot Pronation / Calcaneal Valgus' })
    correctives.push({ priority: 2, category: 'Foot & Ankle Stability', exercise: 'Short foot exercise, single-leg calf raises, intrinsic foot strengthening', reason: 'Foot pronation' })
  }
  if (posture.posterior?.scap_wing_l || posture.posterior?.scap_wing_r) {
    issues.push({ region: 'Posture', flag: 'warn', text: 'Scapular Winging' })
    correctives.push({ priority: 1, category: 'Serratus & Scapular Stability', exercise: 'Serratus wall slides, push-up plus, bear crawl holds', reason: 'Scapular winging' })
  }

  // ── Hip ROM ──
  const hipThreshold = 0.75 // 75% of normal = restricted
  const hipSides = ['L', 'R']
  HIP_ROM.forEach(r => {
    hipSides.forEach(side => {
      const val = parseFloat(hipRom?.[`${r.id}_${side}`])
      if (val && val < r.normal * hipThreshold) {
        issues.push({ region: 'Hip', flag: 'red', text: `Hip ${r.name} restricted ${side} (${val}° vs ${r.normal}° normal)` })
        if (r.id === 'ir' || r.id === 'er') correctives.push({ priority: 1, category: 'Hip Rotational Mobility', exercise: '90/90 stretch, piriformis stretch, posterior hip capsule mob', reason: `Hip ${r.name} restriction` })
        if (r.id === 'flex') correctives.push({ priority: 1, category: 'Hip Flexion Mobility', exercise: 'Hip flexor stretch (lunge position), hip CARs, deep squat holds', reason: 'Hip flexion restriction' })
        if (r.id === 'ext') correctives.push({ priority: 2, category: 'Hip Extension & Glute', exercise: 'Hip flexor stretch, glute bridges, SL hip extension', reason: 'Hip extension restriction' })
        if (r.id === 'abd') correctives.push({ priority: 2, category: 'Hip Abductor Mobility', exercise: 'Lateral hip stretch, adductor rock-back', reason: 'Hip abduction restriction' })
      }
    })
  })

  // Hip special tests
  if (hipSpecial?.thomas_L || hipSpecial?.thomas_R) {
    issues.push({ region: 'Hip', flag: 'warn', text: 'Positive Thomas Test — hip flexor tightness' })
    correctives.push({ priority: 1, category: 'Hip Flexor Lengthening', exercise: 'Half-kneeling hip flexor stretch, couch stretch, prone hip extension', reason: 'Thomas test positive' })
  }
  if (hipSpecial?.fadir_L || hipSpecial?.fadir_R) {
    issues.push({ region: 'Hip', flag: 'red', text: 'Positive FADIR — possible FAI / anterior hip impingement' })
    correctives.push({ priority: 1, category: 'Hip Impingement Management', exercise: 'Avoid deep squatting below impingement point, posterior capsule mob, hip distraction', reason: 'FADIR positive — FAI suspected' })
  }
  if (hipSpecial?.trendelenburg_L || hipSpecial?.trendelenburg_R) {
    issues.push({ region: 'Hip', flag: 'red', text: 'Trendelenburg Sign — glute medius weakness' })
    correctives.push({ priority: 1, category: 'Glute Medius Strength', exercise: 'Side-lying abduction, clamshells, lateral band walks, single-leg stance progression', reason: 'Trendelenburg positive' })
  }

  // ── Shoulder ROM ──
  const shoulderThreshold = 0.8
  SHOULDER_ROM.forEach(r => {
    hipSides.forEach(side => {
      const val = parseFloat(shoulderRom?.[`${r.id}_${side}`])
      if (val && val < r.normal * shoulderThreshold) {
        issues.push({ region: 'Shoulder', flag: 'red', text: `Shoulder ${r.name} restricted ${side} (${val}° vs ${r.normal}° normal)` })
        if (r.id === 'er') correctives.push({ priority: 1, category: 'Shoulder External Rotation', exercise: 'Side-lying ER, band ER, sleeper stretch, posterior capsule mob', reason: `Shoulder ER restriction ${side}` })
        if (r.id === 'ir') correctives.push({ priority: 2, category: 'Shoulder Internal Rotation', exercise: 'Shoulder IR stretch, sleeper stretch (modified)', reason: `Shoulder IR restriction ${side}` })
        if (r.id === 'flex' || r.id === 'abd') correctives.push({ priority: 2, category: 'Shoulder Elevation Mobility', exercise: 'Lat stretch, band overhead stretch, thoracic extension', reason: `Shoulder ${r.name} restriction` })
      }
    })
  })

  if (shoulderSpecial?.neer_L || shoulderSpecial?.neer_R || shoulderSpecial?.hawkins_L || shoulderSpecial?.hawkins_R) {
    issues.push({ region: 'Shoulder', flag: 'red', text: 'Positive impingement test — subacromial impingement likely' })
    correctives.push({ priority: 1, category: 'Shoulder Impingement Protocol', exercise: 'Rotator cuff strengthening (ER/IR), posterior capsule mob, scapular stabilisation, avoid overhead pressing initially', reason: 'Positive Neer/Hawkins' })
  }
  if (shoulderSpecial?.empty_can_L || shoulderSpecial?.empty_can_R) {
    issues.push({ region: 'Shoulder', flag: 'red', text: 'Positive Empty Can — supraspinatus weakness or tear' })
    correctives.push({ priority: 1, category: 'Supraspinatus Rehab', exercise: 'Full can exercise (30° scaption), band side raises, scapular stability work', reason: 'Positive empty can test' })
  }
  if (shoulderSpecial?.scapular_winging_L || shoulderSpecial?.scapular_winging_R) {
    issues.push({ region: 'Shoulder', flag: 'warn', text: 'Scapular winging on push-up' })
    correctives.push({ priority: 1, category: 'Serratus Anterior', exercise: 'Wall push-up plus, bear crawl, serratus punches', reason: 'Scapular winging' })
  }

  // ── Spine ──
  const cervThreshold = 0.75
  CERVICAL_ROM.forEach(r => {
    const val = parseFloat(cervRom?.[r.id])
    if (val && val < r.normal * cervThreshold) {
      issues.push({ region: 'Cervical', flag: 'warn', text: `Cervical ${r.name} restricted (${val}° vs ${r.normal}°)` })
      correctives.push({ priority: 2, category: 'Cervical Mobility', exercise: 'Cervical CARs, gentle cervical traction, SCM & levator stretch', reason: `Cervical ${r.name} restriction` })
    }
  })

  THORACIC_ROM.forEach(r => {
    const val = parseFloat(thorRom?.[r.id])
    if (r.id === 'flex') {
      // finger-floor distance — higher = restricted
      if (val && val > 20) {
        issues.push({ region: 'Thoracic', flag: 'warn', text: `Thoracic/hamstring tightness — finger-floor ${val}cm` })
        correctives.push({ priority: 2, category: 'Thoracic Flexion / Hamstrings', exercise: 'Seated thoracic flexion, hamstring stretch progression', reason: 'Restricted finger-to-floor' })
      }
    } else if (val && val < r.normal * 0.7) {
      issues.push({ region: 'Thoracic', flag: 'warn', text: `Thoracic ${r.name} restricted (${val}° vs ${r.normal}°)` })
      correctives.push({ priority: 2, category: 'Thoracic Rotation', exercise: 'Thread the needle, open book stretch, quadruped rotation', reason: `Thoracic ${r.name} restriction` })
    }
  })

  LUMBAR_ROM.forEach(r => {
    const val = parseFloat(lumRom?.[r.id])
    if (val && val < r.normal * 0.7) {
      issues.push({ region: 'Lumbar', flag: 'red', text: `Lumbar ${r.name} restricted (${val}° vs ${r.normal}°)` })
      if (r.id === 'ext') correctives.push({ priority: 1, category: 'Lumbar Extension Tolerance', exercise: 'Prone prop, McKenzie extension, hip flexor stretch', reason: 'Lumbar extension restriction' })
      if (r.id === 'flex') correctives.push({ priority: 2, category: 'Lumbar Flexion Mobility', exercise: 'Knees-to-chest, cat-cow, lumbar rotation stretch', reason: 'Lumbar flexion restriction' })
    }
  })

  if (spineSpecial?.slr_L || spineSpecial?.slr_R) {
    issues.push({ region: 'Spine', flag: 'red', text: 'Positive SLR — nerve tension / possible disc involvement' })
    correctives.push({ priority: 1, category: 'Neural Mobilisation', exercise: 'Nerve flossing (sciatic), gentle lumbar decompression, avoid loaded spinal flexion initially', reason: 'Positive SLR' })
  }
  if (spineSpecial?.slump_L || spineSpecial?.slump_R) {
    issues.push({ region: 'Spine', flag: 'red', text: 'Positive Slump Test — neural tension' })
    correctives.push({ priority: 1, category: 'Neural Mobilisation', exercise: 'Neural flossing, hamstring mob without spinal loading', reason: 'Positive slump test' })
  }
  if (spineSpecial?.prone_instability) {
    issues.push({ region: 'Spine', flag: 'red', text: 'Lumbar instability — positive prone instability test' })
    correctives.push({ priority: 1, category: 'Lumbar Stability', exercise: 'McGill Big 3 (curl-up, side plank, bird dog), dead bug, diaphragmatic breathing', reason: 'Lumbar instability' })
  }

  // Deduplicate correctives by category
  const seen = new Set()
  const uniqueCorrectves = correctives.filter(c => {
    if (seen.has(c.category)) return false
    seen.add(c.category)
    return true
  }).sort((a, b) => a.priority - b.priority)

  return { fmsTotal, issues, correctives: uniqueCorrectves, asymmetries }
}

// ============================================================
// SHARED UI COMPONENTS
// ============================================================

function ScoreButton({ value, current, onChange, color }) {
  const colors = { 0: 'var(--danger)', 1: 'var(--danger)', 2: 'var(--warn)', 3: 'var(--accent)' }
  const active = current === String(value)
  return (
    <button
      onClick={() => onChange(String(value))}
      style={{
        width: 36, height: 36, borderRadius: 4, border: `1.5px solid ${active ? colors[value] : 'var(--border-hi)'}`,
        background: active ? `${colors[value]}22` : 'var(--s4)',
        color: active ? colors[value] : 'var(--muted)',
        fontFamily: 'var(--font-display)', fontSize: 16, cursor: 'pointer',
        transition: 'all .15s',
      }}
    >
      {value}
    </button>
  )
}

function RomInput({ label, value, onChange, normal, unit, note, threshold = 0.75 }) {
  const v = parseFloat(value)
  const isRestricted = v && v < normal * threshold
  const isBorderline = v && v >= normal * threshold && v < normal * 0.9
  const borderColor = !v ? 'var(--border)' : isRestricted ? 'var(--danger)' : isBorderline ? 'var(--warn)' : 'rgba(0,200,150,.4)'

  return (
    <div className="input-group">
      <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        <span style={{ color: 'var(--muted)', fontWeight: 400 }}>Normal: {normal}{unit}</span>
      </label>
      <div style={{ position: 'relative' }}>
        <input
          className="input input-sm"
          type="number"
          step={1}
          placeholder={`${normal}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ borderColor, paddingRight: 36 }}
        />
        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 11 }}>{unit}</span>
      </div>
      {note && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{note}</div>}
      {v > 0 && (
        <div style={{ fontSize: 10, marginTop: 2, color: isRestricted ? 'var(--danger)' : isBorderline ? 'var(--warn)' : 'var(--accent)' }}>
          {isRestricted ? `⚠ Restricted (${Math.round((v / normal) * 100)}% of normal)` : isBorderline ? `Borderline (${Math.round((v / normal) * 100)}% of normal)` : `✓ Within normal range`}
        </div>
      )}
    </div>
  )
}

function SpecialTestRow({ test, value, onChange, bilateral }) {
  if (bilateral) {
    return (
      <div style={{ padding: '10px 12px', background: 'var(--s4)', borderRadius: 6, border: '1px solid var(--border)', marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1, color: 'var(--white)', marginBottom: 3 }}>{test.name}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{test.desc}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['L', 'R'].map(side => (
              <button
                key={side}
                onClick={() => onChange(`${test.id}_${side}`, !value[`${test.id}_${side}`])}
                style={{
                  padding: '4px 10px', borderRadius: 4, border: `1.5px solid ${value[`${test.id}_${side}`] ? 'var(--danger)' : 'var(--border-hi)'}`,
                  background: value[`${test.id}_${side}`] ? 'rgba(255,59,59,.15)' : 'var(--s5)',
                  color: value[`${test.id}_${side}`] ? 'var(--danger)' : 'var(--muted)',
                  fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1, cursor: 'pointer',
                }}
              >
                {side} {value[`${test.id}_${side}`] ? '+ VE' : '−VE'}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '10px 12px', background: 'var(--s4)', borderRadius: 6, border: '1px solid var(--border)', marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1, color: 'var(--white)', marginBottom: 3 }}>{test.name}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{test.desc}</div>
        </div>
        <button
          onClick={() => onChange(test.id, !value[test.id])}
          style={{
            padding: '4px 14px', borderRadius: 4, border: `1.5px solid ${value[test.id] ? 'var(--danger)' : 'var(--border-hi)'}`,
            background: value[test.id] ? 'rgba(255,59,59,.15)' : 'var(--s5)',
            color: value[test.id] ? 'var(--danger)' : 'var(--muted)',
            fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1, cursor: 'pointer', flexShrink: 0,
          }}
        >
          {value[test.id] ? '+ POSITIVE' : '− NEGATIVE'}
        </button>
      </div>
    </div>
  )
}

function PostureCheckbox({ item, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 4, cursor: 'pointer', background: checked ? 'rgba(255,173,0,.08)' : 'transparent', border: `1px solid ${checked ? 'rgba(255,173,0,.3)' : 'var(--border)'}`, marginBottom: 4, userSelect: 'none' }}>
      <div style={{
        width: 16, height: 16, borderRadius: 3, border: `1.5px solid ${checked ? 'var(--warn)' : 'var(--border-hi)'}`,
        background: checked ? 'var(--warn)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {checked && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>}
      </div>
      <input type="checkbox" checked={checked} onChange={e => onChange(item.id, e.target.checked)} style={{ display: 'none' }} />
      <span style={{ fontSize: 12, color: checked ? 'var(--warn)' : 'var(--sub)' }}>{item.label}</span>
    </label>
  )
}

// ============================================================
// SECTION COMPONENTS
// ============================================================

function FMSSection({ scores, onChange }) {
  const bilateralTests = FMS_TESTS.filter(t => t.bilateral)
  const unilateralTests = FMS_TESTS.filter(t => !t.bilateral)

  // Compute total
  let total = 0
  FMS_TESTS.forEach(t => {
    if (t.bilateral) {
      const l = parseInt(scores[`${t.id}_L`]) || 0
      const r = parseInt(scores[`${t.id}_R`]) || 0
      total += Math.min(l, r)
    } else {
      total += parseInt(scores[t.id]) || 0
    }
  })

  const riskLevel = total === 0 ? null : total < 14 ? { label: 'Elevated Injury Risk', variant: 'danger' } : total < 17 ? { label: 'Moderate — Monitor', variant: 'warn' } : { label: 'Acceptable Movement Quality', variant: 'accent' }

  return (
    <div>
      {/* Score banner */}
      {total > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '14px 18px', background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: total < 14 ? 'var(--danger)' : total < 17 ? 'var(--warn)' : 'var(--accent)', lineHeight: 1 }}>{total}</div>
            <div className="label">/ 21</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 1.5, color: 'var(--white)' }}>{riskLevel?.label}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>Composite FMS Score — threshold for elevated injury risk: &lt; 14</div>
          </div>
        </div>
      )}

      {FMS_TESTS.map(test => (
        <div key={test.id} className="card" style={{ marginBottom: 12, padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 1.5, color: 'var(--white)', marginBottom: 4 }}>{test.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 8 }}>{test.description}</div>
              {/* Scoring criteria */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[3, 2, 1, 0].map(score => (
                  <div key={score} style={{ display: 'flex', gap: 8, fontSize: 10, color: 'var(--muted)' }}>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: 11, width: 14, flexShrink: 0,
                      color: score === 3 ? 'var(--accent)' : score === 2 ? 'var(--warn)' : score === 1 ? 'rgba(255,59,59,.7)' : 'var(--danger)',
                    }}>{score}</span>
                    <span style={{ lineHeight: 1.4 }}>{test.criteria[score]}</span>
                  </div>
                ))}
              </div>
              {test.clearingTest && (
                <div style={{ marginTop: 8, padding: '6px 8px', background: 'var(--s5)', borderRadius: 4, fontSize: 10, color: 'var(--warn)' }}>
                  ⚠ Clearing test: {test.clearingTest}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
              {test.bilateral ? (
                <>
                  <div>
                    <div className="label" style={{ marginBottom: 4, textAlign: 'center' }}>LEFT</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[0, 1, 2, 3].map(v => (
                        <ScoreButton key={v} value={v} current={scores[`${test.id}_L`]} onChange={val => onChange(`${test.id}_L`, val)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="label" style={{ marginBottom: 4, textAlign: 'center' }}>RIGHT</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[0, 1, 2, 3].map(v => (
                        <ScoreButton key={v} value={v} current={scores[`${test.id}_R`]} onChange={val => onChange(`${test.id}_R`, val)} />
                      ))}
                    </div>
                  </div>
                  {scores[`${test.id}_L`] && scores[`${test.id}_R`] && scores[`${test.id}_L`] !== scores[`${test.id}_R`] && (
                    <div style={{ fontSize: 10, color: 'var(--warn)', textAlign: 'center' }}>⚠ Asymmetry</div>
                  )}
                </>
              ) : (
                <div>
                  <div className="label" style={{ marginBottom: 4, textAlign: 'center' }}>Score</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2, 3].map(v => (
                      <ScoreButton key={v} value={v} current={scores[test.id]} onChange={val => onChange(test.id, val)} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PostureSection({ posture, onChange }) {
  const views = [
    { key: 'anterior', label: 'Anterior View', subtitle: 'Client facing you' },
    { key: 'posterior', label: 'Posterior View', subtitle: 'Client facing away' },
    { key: 'lateral', label: 'Lateral View', subtitle: 'Client side-on' },
  ]

  return (
    <div className="grid-3" style={{ alignItems: 'start' }}>
      {views.map(view => (
        <div key={view.key} className="card">
          <div style={{ marginBottom: 14 }}>
            <div className="card-title" style={{ fontSize: 13, letterSpacing: 1.5 }}>{view.label}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{view.subtitle}</div>
          </div>
          {POSTURE_ITEMS[view.key].map(item => (
            <PostureCheckbox
              key={item.id}
              item={item}
              checked={!!posture[view.key]?.[item.id]}
              onChange={(id, val) => onChange(view.key, id, val)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function HipSection({ rom, onRomChange, special, onSpecialChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ROM */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 16, fontSize: 13, letterSpacing: 1.5 }}>Range of Motion</div>
        <div className="grid-2">
          {HIP_ROM.map(r => (
            <div key={r.id}>
              <div className="label" style={{ marginBottom: 8 }}>{r.name}</div>
              <div className="grid-2">
                {['L', 'R'].map(side => (
                  <RomInput
                    key={side}
                    label={side}
                    value={rom[`${r.id}_${side}`] || ''}
                    onChange={val => onRomChange(`${r.id}_${side}`, val)}
                    normal={r.normal}
                    unit={r.unit}
                    note={side === 'L' && r.note ? r.note : ''}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Tests */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 16, fontSize: 13, letterSpacing: 1.5 }}>Special Tests</div>
        {HIP_SPECIAL.map(test => (
          <SpecialTestRow
            key={test.id}
            test={test}
            bilateral={['thomas', 'faber', 'fadir', 'ober', 'trendelenburg'].includes(test.id)}
            value={special}
            onChange={onSpecialChange}
          />
        ))}
      </div>
    </div>
  )
}

function ShoulderSection({ rom, onRomChange, special, onSpecialChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card">
        <div className="card-title" style={{ marginBottom: 16, fontSize: 13, letterSpacing: 1.5 }}>Range of Motion</div>
        <div className="grid-2">
          {SHOULDER_ROM.map(r => (
            <div key={r.id}>
              <div className="label" style={{ marginBottom: 8 }}>{r.name}</div>
              <div className="grid-2">
                {['L', 'R'].map(side => (
                  <RomInput
                    key={side}
                    label={side}
                    value={rom[`${r.id}_${side}`] || ''}
                    onChange={val => onRomChange(`${r.id}_${side}`, val)}
                    normal={r.normal}
                    unit={r.unit}
                    note={side === 'L' && r.note ? r.note : ''}
                    threshold={0.8}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 16, fontSize: 13, letterSpacing: 1.5 }}>Special Tests</div>
        {SHOULDER_SPECIAL.map(test => (
          <SpecialTestRow
            key={test.id}
            test={test}
            bilateral={['neer', 'hawkins', 'empty_can', 'apprehension', 'speeds'].includes(test.id)}
            value={special}
            onChange={onSpecialChange}
          />
        ))}
      </div>
    </div>
  )
}

function SpineSection({ cervRom, onCervChange, thorRom, onThorChange, lumRom, onLumChange, special, onSpecialChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Cervical */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 16, fontSize: 13, letterSpacing: 1.5 }}>Cervical Spine</div>
        <div className="grid-3">
          {CERVICAL_ROM.map(r => (
            <RomInput key={r.id} label={r.name} value={cervRom[r.id] || ''} onChange={v => onCervChange(r.id, v)} normal={r.normal} unit={r.unit} />
          ))}
        </div>
      </div>

      {/* Thoracic */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 16, fontSize: 13, letterSpacing: 1.5 }}>Thoracic Spine</div>
        <div className="grid-3">
          {THORACIC_ROM.map(r => (
            <RomInput key={r.id} label={r.name} value={thorRom[r.id] || ''} onChange={v => onThorChange(r.id, v)} normal={r.normal} unit={r.unit} note={r.note} threshold={r.id === 'flex' ? 99 : 0.7} />
          ))}
        </div>
      </div>

      {/* Lumbar */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 16, fontSize: 13, letterSpacing: 1.5 }}>Lumbar Spine</div>
        <div className="grid-4">
          {LUMBAR_ROM.map(r => (
            <RomInput key={r.id} label={r.name} value={lumRom[r.id] || ''} onChange={v => onLumChange(r.id, v)} normal={r.normal} unit={r.unit} />
          ))}
        </div>
      </div>

      {/* Special Tests */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 16, fontSize: 13, letterSpacing: 1.5 }}>Special Tests</div>
        {SPINE_SPECIAL.map(test => (
          <SpecialTestRow
            key={test.id}
            test={test}
            bilateral={['slr', 'slump'].includes(test.id)}
            value={special}
            onChange={onSpecialChange}
          />
        ))}
      </div>
    </div>
  )
}

function SummarySection({ recommendations, clientName }) {
  const { fmsTotal, issues, correctives, asymmetries } = recommendations

  const priorityOne = correctives.filter(c => c.priority === 1)
  const priorityTwo = correctives.filter(c => c.priority === 2)

  const regionColors = { FMS: 'var(--accent)', Posture: 'var(--warn)', Hip: '#a78bfa', Shoulder: '#60a5fa', Cervical: 'var(--sub)', Thoracic: 'var(--sub)', Lumbar: 'var(--warn)', Spine: 'var(--warn)' }

  const redFlags = issues.filter(i => i.flag === 'red')
  const warnFlags = issues.filter(i => i.flag === 'warn')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Overview Stats */}
      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeft: `3px solid ${fmsTotal < 14 ? 'var(--danger)' : fmsTotal < 17 ? 'var(--warn)' : 'var(--accent)'}` }}>
          <div className="stat-value">{fmsTotal || '—'}</div>
          <div className="stat-label">FMS Total / 21</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid var(--danger)' }}>
          <div className="stat-value" style={{ color: redFlags.length > 0 ? 'var(--danger)' : 'var(--white)' }}>{redFlags.length}</div>
          <div className="stat-label">Red Flags</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid var(--warn)' }}>
          <div className="stat-value" style={{ color: warnFlags.length > 0 ? 'var(--warn)' : 'var(--white)' }}>{warnFlags.length}</div>
          <div className="stat-label">Amber Flags</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '3px solid var(--accent)' }}>
          <div className="stat-value">{correctives.length}</div>
          <div className="stat-label">Corrective Areas</div>
        </div>
      </div>

      {/* Dysfunction Flags */}
      {issues.length > 0 && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: 14, fontSize: 13, letterSpacing: 1.5 }}>Dysfunction Summary</div>
          {issues.map((issue, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, padding: '7px 10px',
              background: issue.flag === 'red' ? 'rgba(255,59,59,.07)' : 'rgba(255,173,0,.07)',
              border: `1px solid ${issue.flag === 'red' ? 'rgba(255,59,59,.2)' : 'rgba(255,173,0,.2)'}`,
              borderRadius: 4, marginBottom: 4,
            }}>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-display)', letterSpacing: 1, color: regionColors[issue.region] || 'var(--sub)', flexShrink: 0, marginTop: 1 }}>{issue.region}</span>
              <span style={{ fontSize: 12, color: issue.flag === 'red' ? '#fca5a5' : '#fde68a' }}>{issue.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Phase 1 Program */}
      {correctives.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div className="card-title" style={{ fontSize: 13, letterSpacing: 1.5 }}>Phase 1 Corrective Programme</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Auto-generated based on assessment findings. Review and adjust before assigning.</div>
            </div>
          </div>

          {priorityOne.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'var(--font-display)', color: 'white' }}>1</div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1.5, color: 'var(--danger)' }}>Priority 1 — Address First</span>
              </div>
              {priorityOne.map((c, i) => (
                <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,59,59,.05)', border: '1px solid rgba(255,59,59,.15)', borderRadius: 6, marginBottom: 6 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1, color: 'var(--white)', marginBottom: 4 }}>{c.category}</div>
                  <div style={{ fontSize: 11, color: 'var(--sub)', marginBottom: 4 }}>{c.exercise}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>Reason: {c.reason}</div>
                </div>
              ))}
            </div>
          )}

          {priorityTwo.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--warn)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'var(--font-display)', color: 'black' }}>2</div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1.5, color: 'var(--warn)' }}>Priority 2 — Address in Phase 1</span>
              </div>
              {priorityTwo.map((c, i) => (
                <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,173,0,.05)', border: '1px solid rgba(255,173,0,.15)', borderRadius: 6, marginBottom: 6 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1, color: 'var(--white)', marginBottom: 4 }}>{c.category}</div>
                  <div style={{ fontSize: 11, color: 'var(--sub)', marginBottom: 4 }}>{c.exercise}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>Reason: {c.reason}</div>
                </div>
              ))}
            </div>
          )}

          {correctives.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-text">Complete the assessment above to generate corrective recommendations</div>
            </div>
          )}
        </div>
      )}

      {issues.length === 0 && (
        <div className="empty-state" style={{ height: 200 }}>
          <div className="empty-state-text">Complete the FMS, postural, and regional assessments to generate a summary</div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// MAIN PAGE
// ============================================================

const TABS = [
  { id: 'submission', label: 'Client Submission', icon: '📥' },
  { id: 'fms', label: 'FMS', icon: '📋' },
  { id: 'posture', label: 'Posture', icon: '🧍' },
  { id: 'hip', label: 'Hip', icon: '🦵' },
  { id: 'shoulder', label: 'Shoulder', icon: '💪' },
  { id: 'spine', label: 'Spine', icon: '🦴' },
  { id: 'summary', label: 'Summary & Phase 1', icon: '✅' },
]

// ─── client submission viewer ─────────────────────────────────────────────────

function ClientSubmission({ clientId, onLoad }) {
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    if (!clientId) { setSubmission(null); setLoading(false); return }
    setLoading(true)
    supabase.from('client_assessments')
      .select('*').eq('client_id', clientId)
      .order('assessed_at', { ascending: false }).limit(1)
      .then(({ data }) => { setSubmission(data?.[0] || null); setLoading(false) })
  }, [clientId])

  if (!clientId) return (
    <div className="empty-state" style={{ height: 160 }}>
      <div className="empty-state-title">Select a client above</div>
      <div className="empty-state-text">Choose a client to view their onboarding assessment submission.</div>
    </div>
  )

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>

  if (!submission) return (
    <div className="empty-state" style={{ height: 160 }}>
      <div className="empty-state-title">No submission yet</div>
      <div className="empty-state-text">This client hasn't completed their onboarding assessment.</div>
    </div>
  )

  const posture = submission.posture || {}
  const fms     = submission.fms     || {}
  const rom     = submission.rom     || {}

  const fmsScoreColor = (s) => s === 3 ? 'var(--accent)' : s === 2 ? 'var(--info)' : s === 1 ? 'var(--warn)' : s === 0 ? 'var(--danger)' : 'var(--muted)'
  const fmsTotal = Object.values(fms).reduce((sum, t) => sum + (t.score ?? 0), 0)

  const pctColor = (pct) => pct >= 90 ? 'var(--accent)' : pct >= 75 ? 'var(--warn)' : 'var(--danger)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Load into assessment button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="label" style={{ marginBottom: 2 }}>Client Submission</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            Submitted {new Date(submission.assessed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
        {Object.keys(fms).length > 0 && (
          <button className="btn btn-primary btn-sm" onClick={() => onLoad && onLoad(fms, rom)}>
            Load into Assessment →
          </button>
        )}
      </div>

      {/* Posture photos */}
      {(posture.front_url || posture.back_url || posture.side_url) && (
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="label" style={{ marginBottom: 14 }}>Posture Photos</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { label: 'Anterior (Front)', url: posture.front_url },
              { label: 'Posterior (Back)', url: posture.back_url },
              { label: 'Lateral (Side)',   url: posture.side_url },
            ].map(p => (
              <div key={p.label}>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 6, fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
                  {p.label.toUpperCase()}
                </div>
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    <img src={p.url} alt={p.label} style={{
                      width: '100%', aspectRatio: '3/4', objectFit: 'cover',
                      borderRadius: 8, border: '1px solid var(--border)',
                    }} />
                  </a>
                ) : (
                  <div style={{
                    width: '100%', aspectRatio: '3/4', borderRadius: 8,
                    border: '1px dashed var(--border)', background: 'var(--s3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: 'var(--muted)',
                  }}>Not uploaded</div>
                )}
              </div>
            ))}
          </div>
          {posture.notes && (
            <div className="coach-note" style={{ marginTop: 14 }}>{posture.notes}</div>
          )}
        </div>
      )}

      {/* FMS self-scores */}
      {Object.keys(fms).length > 0 && (
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="label">FMS Self-Scores</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: fmsTotal < 14 ? 'var(--danger)' : fmsTotal < 17 ? 'var(--warn)' : 'var(--accent)' }}>
              {fmsTotal}/21
              <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 4 }}>composite</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {Object.entries(fms).map(([testId, td]) => (
              <div key={testId} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 12px', background: 'var(--s3)', borderRadius: 6,
                border: '1px solid var(--border)',
                borderLeft: `3px solid ${fmsScoreColor(td.score)}`,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--white)', letterSpacing: .5 }}>
                    {testId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </div>
                  {td.notes && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{td.notes}</div>}
                </div>
                {td.video_url && (
                  <a href={td.video_url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 9, color: 'var(--info)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
                    ▶ VIDEO
                  </a>
                )}
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 20,
                  color: fmsScoreColor(td.score),
                  background: `${fmsScoreColor(td.score)}15`,
                  border: `1px solid ${fmsScoreColor(td.score)}33`,
                  borderRadius: 4, padding: '2px 10px', minWidth: 38, textAlign: 'center',
                }}>
                  {td.score ?? '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROM data */}
      {Object.keys(rom).length > 0 && (
        <div className="card" style={{ padding: '16px 20px' }}>
          <div className="label" style={{ marginBottom: 14 }}>Mobility Screen (Self-Reported ROM)</div>
          {['hip', 'shoulder', 'spine'].map(area => {
            const areaData = rom[area]
            if (!areaData || Object.keys(areaData).filter(k => k !== 'media_url').length === 0) return null
            const NORMALS = {
              hip_flex_l: 120, hip_flex_r: 120, hip_ext_l: 30, hip_ext_r: 30,
              hip_ir_l: 40, hip_ir_r: 40, hip_er_l: 45, hip_er_r: 45, hip_abd_l: 45, hip_abd_r: 45,
              sh_flex_l: 180, sh_flex_r: 180, sh_ext_l: 60, sh_ext_r: 60,
              sh_abd_l: 180, sh_abd_r: 180, sh_ir_l: 70, sh_ir_r: 70, sh_er_l: 90, sh_er_r: 90,
              cerv_flex: 80, cerv_ext: 70, cerv_rot_l: 80, cerv_rot_r: 80,
              thor_rot_l: 45, thor_rot_r: 45, lumb_flex: 90, lumb_ext: 30,
            }
            return (
              <div key={area} style={{ marginBottom: 14 }}>
                <div className="label" style={{ fontSize: 9, marginBottom: 8 }}>
                  {area.toUpperCase()}
                  {areaData.media_url && (
                    <a href={areaData.media_url} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'var(--info)', marginLeft: 10, fontSize: 9, fontFamily: 'var(--font-display)' }}>
                      ▶ VIDEO
                    </a>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(90px,1fr))', gap: 6 }}>
                  {Object.entries(areaData).filter(([k]) => k !== 'media_url' && areaData[k]).map(([key, val]) => {
                    const normal = NORMALS[key]
                    const pct    = normal && val ? Math.round((parseFloat(val) / normal) * 100) : null
                    return (
                      <div key={key} style={{
                        padding: '8px 10px', background: 'var(--s3)',
                        border: `1px solid ${pct ? pctColor(pct) + '33' : 'var(--border)'}`,
                        borderRadius: 6, textAlign: 'center',
                      }}>
                        <div style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: .5, marginBottom: 3 }}>
                          {key.replace(/_/g, ' ').toUpperCase()}
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: pct ? pctColor(pct) : 'var(--sub)' }}>
                          {val}°
                        </div>
                        {pct && <div style={{ fontSize: 8, color: pctColor(pct), marginTop: 1 }}>{pct}%</div>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function BiomechanicalAssessment() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('submission')
  const [clients, setClients]     = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedClientName, setSelectedClientName] = useState('')

  // fetch clients
  useEffect(() => {
    if (!user) return
    supabase.from('clients').select('client_id, profile:profiles!client_id(full_name)')
      .eq('coach_id', user.id).then(({ data }) => setClients(data || []))
  }, [user])

  function handleLoadSubmission(fmsData, romData) {
    // Pre-populate FMS scores from client's self-assessment
    const newScores = {}
    Object.entries(fmsData).forEach(([id, td]) => {
      if (td.score != null) newScores[id] = td.score
    })
    setFmsScores(newScores)
    setActiveTab('fms')
  }

  // FMS scores
  const [fmsScores, setFmsScores] = useState({})
  const updateFms = (key, val) => setFmsScores(p => ({ ...p, [key]: val }))

  // Posture
  const [posture, setPosture] = useState({ anterior: {}, posterior: {}, lateral: {} })
  const updatePosture = (view, id, val) => setPosture(p => ({ ...p, [view]: { ...p[view], [id]: val } }))

  // Hip
  const [hipRom, setHipRom] = useState({})
  const [hipSpecial, setHipSpecial] = useState({})
  const updateHipSpecial = (id, val) => setHipSpecial(p => ({ ...p, [id]: val }))

  // Shoulder
  const [shoulderRom, setShoulderRom] = useState({})
  const [shoulderSpecial, setShoulderSpecial] = useState({})
  const updateShoulderSpecial = (id, val) => setShoulderSpecial(p => ({ ...p, [id]: val }))

  // Spine
  const [cervRom, setCervRom] = useState({})
  const [thorRom, setThorRom] = useState({})
  const [lumRom, setLumRom] = useState({})
  const [spineSpecial, setSpineSpecial] = useState({})
  const updateSpineSpecial = (id, val) => setSpineSpecial(p => ({ ...p, [id]: val }))

  const recommendations = useMemo(() =>
    generateRecommendations(fmsScores, posture, hipRom, hipSpecial, shoulderRom, shoulderSpecial, cervRom, thorRom, lumRom, spineSpecial),
    [fmsScores, posture, hipRom, hipSpecial, shoulderRom, shoulderSpecial, cervRom, thorRom, lumRom, spineSpecial]
  )

  const { fmsTotal, issues } = recommendations
  const redCount = issues.filter(i => i.flag === 'red').length

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Biomechanical Assessment</div>
          <div className="page-subtitle">FMS · Posture · Hip · Shoulder · Spine → Phase 1 Programme</div>
        </div>
      </div>

      {/* Client selector */}
      <div className="card" style={{ marginBottom: 20, padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="input-group" style={{ flex: 1, margin: 0 }}>
            <select className="select" value={selectedClient}
              onChange={e => {
                setSelectedClient(e.target.value)
                const c = clients.find(c => c.client_id === e.target.value)
                setSelectedClientName(c?.profile?.full_name || '')
              }}>
              <option value="">— Select client —</option>
              {clients.map(c => (
                <option key={c.client_id} value={c.client_id}>{c.profile?.full_name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
            {fmsTotal > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: fmsTotal < 14 ? 'var(--danger)' : fmsTotal < 17 ? 'var(--warn)' : 'var(--accent)' }}>{fmsTotal}/21</div>
                <div className="label" style={{ fontSize: 8 }}>FMS Score</div>
              </div>
            )}
            {redCount > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--danger)' }}>{redCount}</div>
                <div className="label" style={{ fontSize: 8 }}>Red Flags</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, flexWrap: 'wrap' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{ position: 'relative' }}
          >
            {tab.label}
            {tab.id === 'summary' && recommendations.correctives.length > 0 && (
              <span style={{ marginLeft: 6, background: 'var(--danger)', color: 'white', borderRadius: '50%', width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontFamily: 'var(--font-display)' }}>
                {recommendations.correctives.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'submission' && <ClientSubmission clientId={selectedClient} onLoad={handleLoadSubmission} />}
      {activeTab === 'fms' && <FMSSection scores={fmsScores} onChange={updateFms} />}
      {activeTab === 'posture' && <PostureSection posture={posture} onChange={updatePosture} />}
      {activeTab === 'hip' && <HipSection rom={hipRom} onRomChange={(k, v) => setHipRom(p => ({ ...p, [k]: v }))} special={hipSpecial} onSpecialChange={updateHipSpecial} />}
      {activeTab === 'shoulder' && <ShoulderSection rom={shoulderRom} onRomChange={(k, v) => setShoulderRom(p => ({ ...p, [k]: v }))} special={shoulderSpecial} onSpecialChange={updateShoulderSpecial} />}
      {activeTab === 'spine' && <SpineSection cervRom={cervRom} onCervChange={(k, v) => setCervRom(p => ({ ...p, [k]: v }))} thorRom={thorRom} onThorChange={(k, v) => setThorRom(p => ({ ...p, [k]: v }))} lumRom={lumRom} onLumChange={(k, v) => setLumRom(p => ({ ...p, [k]: v }))} special={spineSpecial} onSpecialChange={updateSpineSpecial} />}
      {activeTab === 'summary' && <SummarySection recommendations={recommendations} clientName={selectedClientName} />}
    </div>
  )
}
