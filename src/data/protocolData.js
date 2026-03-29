// ============================================================
// PERFORMUSCLE — WELLNESS PROTOCOL DATA
// ============================================================

export const PROTOCOL_DATA = [
  {
    id: 'cold-flu',
    name: 'Cold & Flu Protocol',
    category: 'Immune',
    icon: '🤧',
    description:
      'Accelerate recovery from viral upper respiratory infections. This protocol targets immune support, symptom relief, and preservation of muscle mass and sleep quality during illness.',
    duration: '5–7 days',
    steps: [
      {
        phase: 'Day 1–2: Acute Phase',
        actions: [
          'REST — do not train. Immune function is compromised; training will prolong illness.',
          'Hydrate aggressively: 3–4 L water/day, electrolytes (sodium, potassium).',
          'Zinc lozenges: 13–25 mg elemental zinc every 2–3 hours within first 24 hours of symptom onset (up to 75 mg/day for short periods). Reduces duration by ~33%.',
          'Vitamin C: 1–2 g every few hours (up to 6–8 g/day split doses) during acute phase.',
          'Vitamin D3: 5,000–10,000 IU/day for 3 days.',
          'Elderberry syrup or extract (Sambucus): 4 x tablespoons or 1,500 mg extract/day. Shown to reduce flu duration by 2–4 days.',
          'Quercetin: 500 mg twice daily — acts as zinc ionophore and anti-inflammatory.',
          'Sleep 9–10 hours. Prioritise sleep above all other interventions.',
        ],
      },
      {
        phase: 'Day 3–5: Resolution Phase',
        actions: [
          'Continue hydration, vitamin C (drop to 2–4 g/day), zinc (drop to 30 mg/day).',
          'Introduce light food — prioritise protein to minimise muscle catabolism (1.6+ g/kg).',
          'Bone broth or collagen — supports gut and mucosal recovery.',
          'Nasal saline rinse twice daily to clear viral particles.',
          'Light walking only — no resistance training.',
          'Continue 9 hours sleep minimum.',
        ],
      },
      {
        phase: 'Day 5–7: Return to Training',
        actions: [
          'Return to training only when symptom-free for 24–48 hours AND energy is restored.',
          'Use the "neck check": symptoms above the neck only → light training may be OK. Symptoms below the neck (chest, GI, fever) → rest.',
          'Start at 50–60% normal training load. Do not attempt to "catch up" — 1 week of missed training causes minimal fitness loss.',
          'Reintroduce probiotics (10–30 billion CFU/day) to restore gut flora disrupted by illness.',
          'Consider N-Acetyl Cysteine (NAC): 600 mg/day — mucolytic and antioxidant support.',
        ],
      },
    ],
  },
  {
    id: 'sleep-optimisation',
    name: 'Sleep Optimisation Protocol',
    category: 'Sleep',
    icon: '😴',
    description:
      'A comprehensive framework to maximise sleep quality, duration, and recovery value. Poor sleep is the single greatest limiter of adaptation, fat loss, hormonal health, and performance.',
    duration: 'Ongoing — implement over 2 weeks',
    steps: [
      {
        phase: 'Morning Anchors',
        actions: [
          'Get 10–20 minutes of bright outdoor light within 30–60 minutes of waking. This anchors your circadian rhythm.',
          'Consistent wake time 7 days/week — even weekends. This is the most powerful circadian cue.',
          'Morning exercise (light-moderate) supports evening sleepiness by building adenosine pressure.',
          'Delay caffeine 90–120 minutes after waking to allow adenosine clearance, reducing afternoon crash.',
        ],
      },
      {
        phase: 'Daytime Practices',
        actions: [
          'Avoid caffeine after 2 PM (or 12 PM if a slow metaboliser).',
          'Strategic napping: 10–20 min nap before 3 PM if needed. Avoid longer naps that reduce night sleep drive.',
          'Manage blue light exposure in the afternoon — not primarily an evening issue.',
          'Exercise regularly. Even 20–30 min moderate exercise significantly improves sleep quality.',
          'Track food timing — avoid large meals within 3 hours of bed. Last meal ideally 3+ hours before sleep.',
        ],
      },
      {
        phase: 'Evening Wind-Down (90 min before bed)',
        actions: [
          'Dim lights to 50 lux or below after sunset — this is critical for melatonin production.',
          'Blue-light blocking glasses or warm-spectrum lighting (Iris app for screens).',
          'Reduce room temperature: target 17–19°C (63–67°F). Core temperature must drop 1–3°C to initiate sleep.',
          'No screens 30–60 min before bed minimum. Reading, journalling, light stretching instead.',
          'Supplements: Magnesium glycinate 300–400 mg + L-Theanine 200 mg + Apigenin 50 mg (from chamomile).',
          'Optional: Tart cherry extract (melatonin source) or 0.5–1 mg melatonin (use low doses — higher doses disrupt circadian rhythm).',
          'Write tomorrow\'s tasks on paper — "offloads" the mental loop that prevents sleep onset.',
        ],
      },
      {
        phase: 'Sleep Environment',
        actions: [
          'Complete darkness — blackout curtains and eye mask.',
          'White noise or earplugs if noise is a factor.',
          'Phone in another room or on aeroplane mode. Notifications disrupt sleep architecture even without full waking.',
          'Consistent bedtime target (± 30 minutes) every night.',
        ],
      },
    ],
  },
  {
    id: 'immune-boost',
    name: 'Immune Boost Protocol',
    category: 'Immune',
    icon: '🛡️',
    description:
      'A preventative and acute immune support protocol for use during high-risk periods (winter, high-stress blocks, travel, overtraining).',
    duration: '2–4 weeks preventative, or acute as needed',
    steps: [
      {
        phase: 'Foundation (Daily)',
        actions: [
          'Vitamin D3 + K2: 3,000–5,000 IU D3 + 100 mcg K2 daily.',
          'Zinc: 25–30 mg/day (picolinate or bisglycinate).',
          'Vitamin C: 500–1,000 mg/day in two doses.',
          'Omega-3: 2–4 g EPA+DHA to reduce chronic low-grade inflammation.',
          'Quality sleep: 7.5–9 hours. Sleep deprivation is the primary immune suppressor.',
          'Moderate exercise: maintains NK cell activity and mucosal immunity. Overtraining suppresses it.',
        ],
      },
      {
        phase: 'Enhanced Protocol (High-Risk Periods)',
        actions: [
          'Add: Beta-glucans 250–500 mg/day (from oats, mushrooms, or supplements). Potent innate immune activator.',
          'Add: Quercetin 500–1,000 mg/day (zinc ionophore + anti-inflammatory).',
          'Add: Elderberry extract 600–1,200 mg/day.',
          "Add: Lion's Mane 500–1,000 mg for gut-immune axis support.",
          'Increase prebiotic fibre (onions, garlic, leeks, bananas) to support gut-immune junction.',
          'Fermented foods daily: kefir, kimchi, yoghurt — support microbiome diversity.',
        ],
      },
      {
        phase: 'Lifestyle Immune Pillars',
        actions: [
          'Stress management — chronic cortisol is profoundly immunosuppressive. Meditation, walking, nature exposure.',
          'Cold exposure (Wim Hof breathing, cold showers): activates sympathetic nervous system and may improve innate immunity.',
          'Alcohol reduction — even moderate alcohol impairs mucosal immunity and sleep quality.',
          'Nasal hygiene: saline spray when exposed to high-risk environments.',
          'Hand hygiene: the most evidence-based intervention for preventing viral transmission.',
        ],
      },
    ],
  },
  {
    id: 'post-training-recovery',
    name: 'Post-Training Recovery Protocol',
    category: 'Recovery',
    icon: '⚡',
    description:
      'Systematic recovery practices to maximise adaptation, reduce soreness, and prepare for the next session. Recovery is where training gains are realised.',
    duration: 'After every significant training session',
    steps: [
      {
        phase: 'Immediate (0–30 min post-training)',
        actions: [
          'Protein: 30–40 g high-quality protein within 30–60 minutes post-training. Leucine content matters — whey, chicken, eggs.',
          'Carbohydrate: 0.5–1.0 g/kg bodyweight if training depleted glycogen (endurance or high-volume lifting). White rice, banana, or dextrose are rapidly absorbed.',
          'Rehydration: 1.5x the fluid lost. Weigh before and after if sweating heavily. Add electrolytes if session exceeded 60 min.',
          'Cold water immersion (CWI): 11–15°C for 10–15 min — significantly reduces DOMS. Best for sport performance recovery. Avoid immediately post-hypertrophy sessions (blunts anabolic signalling).',
          'Compression garments: wear for 2–4 hours post-session if DOMS is a concern.',
        ],
      },
      {
        phase: 'Hours 1–6: Recovery Window',
        actions: [
          'Full meal within 2 hours: complete protein, carbohydrates, colourful vegetables.',
          'Tart cherry concentrate: 2 x 30 mL concentrate or 1,000 mg extract for DOMS reduction.',
          'Creatine: take daily dose if not already taken pre-workout.',
          'Light walking or low-intensity movement (active recovery) improves blood flow without adding stress.',
          'Avoid alcohol — even 1–2 drinks post-training significantly impairs MPS and sleep quality.',
          'Foam rolling/self-myofascial release: 60–90 sec per major muscle group for pain reduction (not necessarily ROM improvement).',
        ],
      },
      {
        phase: 'Evening / Sleep',
        actions: [
          'Magnesium glycinate 300 mg — muscle relaxation and sleep quality.',
          'Collagen + Vitamin C if tendons/joints are loading targets — take 30 min before any evening physio work.',
          'Temperature: cool bedroom (17–19°C) for deeper slow-wave sleep (growth hormone release peak).',
          'Aim for 8–9 hours — growth hormone and testosterone are released primarily during slow-wave and REM sleep.',
          'Compression or elevation for legs if heavy lower body session was performed.',
        ],
      },
      {
        phase: 'Next Day: Recovery Assessment',
        actions: [
          'HRV monitoring (Whoop, Oura, Garmin): green = full training, amber = moderate, red = active recovery or rest.',
          'Resting heart rate: >7 BPM above baseline suggests incomplete recovery.',
          'Grip strength test (quick proxy for CNS fatigue): >10% drop suggests backing off.',
          'Adjust next session intensity or volume based on recovery status. Consistency beats heroic individual sessions.',
        ],
      },
    ],
  },
  {
    id: 'gut-health-reset',
    name: 'Gut Health Reset Protocol',
    category: 'Gut',
    icon: '🌱',
    description:
      'A systematic 4-week protocol to restore gut microbiome diversity, reduce intestinal permeability ("leaky gut"), and improve digestion, energy, and immune function.',
    duration: '4 weeks',
    steps: [
      {
        phase: 'Week 1: Remove & Reduce',
        actions: [
          'Eliminate: processed foods, refined sugars, seed oils, excessive alcohol for the full 4 weeks.',
          'Reduce: red meat to 2–3 servings/week. Prioritise fish, poultry, legumes.',
          'Remove common irritants if suspected: gluten (wheat, barley, rye) and dairy for 2 weeks to assess impact.',
          'Start food journalling to identify personal trigger foods.',
          'Eliminate artificial sweeteners (aspartame, sucralose) — evidence of microbiome disruption.',
          'Reduce NSAIDs (ibuprofen, aspirin) — they increase intestinal permeability. Use paracetamol instead where possible.',
        ],
      },
      {
        phase: 'Week 2: Replace & Support',
        actions: [
          'Increase prebiotic foods: onion, garlic, leeks, asparagus, Jerusalem artichoke, oats, bananas, chicory root.',
          'Increase dietary fibre to 30–35 g/day from diverse plant sources. Aim for 30 different plant foods/week.',
          'Add: L-Glutamine 5 g twice daily — primary fuel for enterocytes, supports gut barrier.',
          'Add: Zinc carnosine 75 mg twice daily — shown to restore gut barrier integrity.',
          'Bone broth 1–2 cups/day: collagen, glycine, and gelatin support mucosal lining.',
          'Stay well-hydrated: 2.5–3.5 L/day to support gut motility.',
        ],
      },
      {
        phase: 'Week 3: Reinoculate',
        actions: [
          'Start high-quality multi-strain probiotic: 30–50 billion CFU/day, diverse strains (Lactobacillus, Bifidobacterium).',
          'Add fermented foods: kefir, yoghurt (live cultures), kimchi, sauerkraut, miso, tempeh — ideally 2–3 servings/day.',
          'Butyrate supplement or tributyrin (500–1,000 mg/day) — short-chain fatty acid that feeds colonocytes.',
          'Digestive enzymes with larger meals if bloating/gas are present.',
          'Continue removing trigger foods. Reintroduce one suspected food at a time to identify reactivity.',
        ],
      },
      {
        phase: 'Week 4: Reinforce & Maintain',
        actions: [
          'Assess: energy, bloating, bowel regularity, skin, mood — these all improve with gut health.',
          'Reintroduce removed foods one at a time (gluten, dairy) to identify true sensitivities.',
          'Establish long-term habits: 30 plant foods/week, fermented food daily, fibre target.',
          'Stress management ongoing — the gut-brain axis means chronic stress directly damages gut health.',
          'Consider gut microbiome testing (Viome, Atlas Biomed) to get personalised insights.',
          'Continue probiotic at lower maintenance dose (10 billion CFU/day).',
        ],
      },
    ],
  },
  {
    id: 'stress-burnout',
    name: 'Stress & Burnout Recovery Protocol',
    category: 'Stress',
    icon: '🧘',
    description:
      'A structured protocol for recovering from chronic stress, HPA axis dysregulation, and burnout. Addresses sleep, adrenal support, nervous system regulation, and lifestyle restructuring.',
    duration: '6–12 weeks',
    steps: [
      {
        phase: 'Phase 1: Stabilise (Weeks 1–2)',
        actions: [
          'Sleep: prioritise 8–9 hours above everything else. This is non-negotiable during burnout recovery.',
          'Exercise: reduce to light walking and gentle yoga only. Intense training is a stressor and will worsen HPA dysfunction.',
          'Caffeine: reduce to 1 cup before 10 AM. Remove entirely if experiencing anxiety, insomnia, or heart palpitations.',
          'Alcohol: eliminate — it directly dysregulates cortisol rhythm and destroys sleep architecture.',
          'Establish 3 fixed anchor times daily: wake time, first meal, sleep time. Routine restores circadian rhythm.',
          'Vitamin C: 1,000 mg with breakfast — adrenal glands concentrate vitamin C and deplete it rapidly under stress.',
          'Magnesium glycinate: 400 mg before bed.',
          'Identify and remove the primary stressor(s) where possible.',
        ],
      },
      {
        phase: 'Phase 2: Support (Weeks 3–6)',
        actions: [
          'Ashwagandha (KSM-66): 600 mg/day — clinically proven to reduce cortisol and improve stress resilience.',
          'Rhodiola Rosea: 300–500 mg standardised extract in morning — adaptogen with evidence for burnout and fatigue.',
          'Phosphatidylserine: 400 mg/day — shown to blunt cortisol response and improve HPA axis regulation.',
          'B-complex: high-dose B vitamins (especially B5 pantothenic acid) support adrenal function.',
          'Omega-3: 3–4 g EPA+DHA — reduces neuroinflammation and cortisol reactivity.',
          'Morning sunlight: 15–20 min within 60 min of waking — essential for cortisol rhythm normalisation.',
          'Progressive muscle relaxation or 4-7-8 breathing: 10 min daily. Activates parasympathetic nervous system.',
          'Introduce light resistance training (40–50% intensity) by week 4 if energy permits.',
        ],
      },
      {
        phase: 'Phase 3: Rebuild (Weeks 7–12)',
        actions: [
          'Gradually increase training volume and intensity by no more than 10%/week.',
          'Introduce HRV monitoring to objectively guide training readiness.',
          'Begin addressing nutrition quality: adequate protein (1.6 g/kg), anti-inflammatory foods, reduce ultra-processed foods.',
          'Social connection: prioritise relationships — isolation amplifies stress and slows recovery.',
          'Therapy or coaching: burnout often has cognitive/behavioural roots that supplementation alone cannot address.',
          'Cold shower or contrast therapy: gradually introduced, builds stress resilience (hormesis).',
          'Re-evaluate work/life load. Without structural change, biochemical recovery is temporary.',
          'Reassess sleep, energy, libido, and mood markers at week 12 to gauge recovery depth.',
        ],
      },
    ],
  },
]
