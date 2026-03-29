// ============================================================
// PERFORMUSCLE — PROTEIN SPARING MODIFIED FAST (PSMF) DATA
// ============================================================

export const PSMF_PROTOCOL = {

  // ─── Overview ──────────────────────────────────────────────────────────────
  title: 'Protein Sparing Modified Fast',
  tagline: 'Preserve Every Ounce of Muscle. Annihilate Fat.',
  description:
    'The Protein Sparing Modified Fast (PSMF) is an extreme, structured deficit dietary strategy consuming 800–1000 kcal/day, composed almost entirely of lean protein. Fat and carbohydrate intake is reduced to near-zero. The goal is to maximise fat loss at the fastest biologically safe rate while preserving lean body mass. It is not a lifestyle diet — it is a short-term intervention (maximum 2 weeks per cycle) for individuals with specific fat-loss goals and adequate fat stores to fuel the deficit.',

  science: {
    title: 'The Science Behind PSMF',
    mechanism: [
      'At very low calorie intake, the body must generate energy via gluconeogenesis (converting amino acids and glycerol to glucose) and ketogenesis (converting fatty acids to ketone bodies). The PSMF exploits this by flooding the body with dietary protein — ensuring the amino acids used for gluconeogenesis come from food rather than from muscle tissue.',
      'Nitrogen balance studies show that adequate dietary protein (1.2–1.5g per lb of lean body mass) maintains a neutral or near-neutral nitrogen balance even at severe caloric deficits, meaning muscle protein breakdown is roughly matched by muscle protein synthesis.',
      'The absence of dietary fat forces the body to mobilise stored triglycerides from adipose tissue. The absence of carbohydrates depletes glycogen stores rapidly (0.5–2kg water loss in week 1), induces insulin suppression, and upregulates lipase activity — accelerating fat oxidation.',
      'High protein intake has the highest thermic effect of food (TEF) at ~25–30% — meaning roughly 30% of protein calories are burned during digestion itself, further widening the deficit.',
      'Resistance training during PSMF acts as a powerful anabolic signal, directing any available nutrients toward muscle maintenance rather than catabolism.',
    ],
  },

  // ─── Who Is It For ─────────────────────────────────────────────────────────
  whoIsItFor: [
    'BMI above 27 — sufficient adipose stores to fuel the severe caloric deficit without risking lean tissue',
    'Specific short-term fat-loss goal: event, photo shoot, competition, wedding, holiday',
    'Body fat percentage above 20% (men) or 28% (women)',
    'Working under qualified coach or personal trainer supervision',
    'No medical contraindications (see contraindications list)',
    'Psychologically prepared for hunger, fatigue, and dietary restriction',
    'Able to maintain resistance training (even at reduced intensity)',
    'Has tried moderate deficit approaches and requires a more aggressive intervention',
  ],

  // ─── Contraindications ─────────────────────────────────────────────────────
  contraindications: [
    { condition: 'Pregnancy or breastfeeding', reason: 'Severe caloric restriction is unsafe for foetal/infant development' },
    { condition: 'Type 1 Diabetes', reason: 'Risk of diabetic ketoacidosis and dangerous blood glucose instability' },
    { condition: 'Severe kidney disease (CKD stages 3–5)', reason: 'High protein load is contraindicated; impaired nitrogen excretion' },
    { condition: 'Severe liver disease or cirrhosis', reason: 'Impaired protein metabolism and gluconeogenesis regulation' },
    { condition: 'Active or recent history of eating disorders', reason: 'Extreme restriction may trigger relapse of disordered eating patterns' },
    { condition: 'Under 18 years of age', reason: 'Growth and development require adequate macro and caloric intake' },
    { condition: 'Underweight (BMI < 18.5)', reason: 'Insufficient fat stores — protein catabolism and organ damage risk' },
    { condition: 'Cardiac arrhythmia or known heart disease', reason: 'Electrolyte shifts (especially potassium) can precipitate arrhythmia' },
    { condition: 'Recent surgery (within 6 weeks)', reason: 'Wound healing requires adequate caloric and micronutrient support' },
    { condition: 'Type 2 Diabetes on insulin or sulfonylureas', reason: 'Hypoglycaemia risk — requires immediate medication review with GP/endocrinologist' },
    { condition: 'Warfarin therapy', reason: 'Dietary changes affect INR; close monitoring with prescribing doctor required' },
    { condition: 'Lithium therapy', reason: 'Low sodium diet can increase lithium levels to toxic range' },
    { condition: 'Severe anxiety or depression', reason: 'Caloric restriction can worsen mood disorders; requires clinical oversight' },
    { condition: 'Active gout', reason: 'Ketosis and high protein can raise uric acid levels and trigger flares' },
    { condition: 'Hypothyroidism (untreated or undertreated)', reason: 'Severe restriction further suppresses T3; thyroid function must be optimised first' },
  ],

  // ─── Phases ────────────────────────────────────────────────────────────────
  phases: [
    {
      id: 'psmf',
      number: 1,
      name: 'PSMF Days',
      label: 'Aggressive Deficit',
      color: 'var(--danger)',
      colorBg: '#e5353510',
      colorBorder: '#e5353540',
      duration: '5–6 days per week (not consecutive if possible)',
      icon: '🔥',
      description:
        'The core PSMF day: 800–1000 kcal from lean protein only. Fat and carbohydrate intake is minimised to near-zero. All calories come from approved lean protein sources. Electrolytes must be supplemented aggressively.',
      eat: [
        'Lean protein sources only (see approved foods list)',
        'Unlimited non-starchy vegetables (spinach, broccoli, courgette, peppers, etc.)',
        'Herbs, spices, mustard, hot sauce, vinegar (zero calorie condiments)',
        'Black coffee, plain tea, sparkling water',
        'Chicken or beef broth (electrolytes + satiety)',
        'Electrolyte supplements / sodium tablets',
      ],
      avoid: [
        'All fats: oils, butter, nuts, avocado, fatty fish',
        'All carbohydrates: bread, rice, fruit, oats, starchy vegetables',
        'Whole eggs (yolks add fat)',
        'Full-fat dairy products',
        'Protein bars (typically high in fat)',
      ],
    },
    {
      id: 'refeed',
      number: 2,
      name: 'Refeed Days',
      label: 'Glycogen Restoration',
      color: 'var(--accent)',
      colorBg: '#00C89610',
      colorBorder: '#00C89640',
      duration: '1–2 days per week (e.g. Saturday, or Saturday + Wednesday)',
      icon: '⚡',
      description:
        'Planned higher-carbohydrate days interspersed within the PSMF cycle. Protein remains high. Fat remains low. Carbohydrates are increased to 100–150g to restore muscle glycogen, support thyroid hormone conversion (T4→T3), partially restore leptin levels, and provide a psychological break from restriction.',
      eat: [
        'Same lean protein sources as PSMF days',
        '100–150g carbohydrates from clean sources: white rice, oats, sweet potato, fruit',
        'Vegetables unlimited',
        'Fat intake remains low (< 20g)',
      ],
      avoid: [
        'Using the refeed as a cheat day — structured, not a free-for-all',
        'High-fat foods even on refeed days',
        'Processed foods, takeaway, alcohol',
      ],
      why: [
        'Restores muscle glycogen → improved training performance',
        'Partially resets leptin (satiety hormone suppressed by restriction)',
        'Supports thyroid hormone conversion (T4 to active T3)',
        'Reduces cortisol chronically elevated by sustained deficit',
        'Psychological sustainability — breaking the monotony of restriction',
      ],
    },
    {
      id: 'maintenance',
      number: 3,
      name: 'Maintenance Break',
      label: 'Metabolic Reset',
      color: 'var(--info)',
      colorBg: '#2563eb10',
      colorBorder: '#2563eb40',
      duration: '2+ weeks at maintenance calories after every 2-week PSMF cycle',
      icon: '🔄',
      description:
        'After a maximum of 2 consecutive weeks on PSMF, a mandatory maintenance break is required before another PSMF cycle. This is not optional — it is a biological necessity to prevent metabolic adaptation, preserve muscle, and protect hormonal health.',
      eat: [
        'Caloric intake at TDEE (maintenance) — typically 2000–2800+ kcal depending on individual',
        'High protein maintained (1.6–2.2g/kg bodyweight)',
        'Balanced carbohydrates and healthy fats reintroduced',
        'Focus on nutrient-dense whole foods',
      ],
      why: [
        'Thyroid hormone (T3) restoration — severe restriction suppresses metabolic rate via T3 downregulation',
        'Leptin restoration — allows hunger signals to normalise',
        'Cortisol reduction — chronic cortisol elevation from caloric stress degrades muscle and sleep',
        'Reverse T3 clearance — extreme deficits can increase reverse T3 (inactive thyroid metabolite)',
        'Psychological recovery — sustained restriction creates disordered food relationships',
        'Muscle protein synthesis rates are maximised at or near maintenance',
      ],
    },
  ],

  // ─── Protein Calculator ────────────────────────────────────────────────────
  proteinCalculator: {
    formula: '1.2g of protein per pound of lean body mass (2.6g per kg LBM)',
    howToEstimateLBM:
      'If DEXA or BodPod data is unavailable, use the Navy Body Fat % formula (height, neck, waist, hips for females) available in the Performuscle Calculators section. LBM = Bodyweight × (1 − BF% ÷ 100).',
    minProteinG: 120,
    maxProteinG: 250,
    psmfCaloriesPerG: 4,
    targetCalsPerDayMin: 800,
    targetCalsPerDayMax: 1000,
    targetCalsRationale:
      '800–1000 kcal is the established therapeutic range from the original Blackburn PSMF research. Below 800 kcal, the risk of cardiac complications and lean mass loss increases substantially. Above 1000 kcal from protein, the deficit narrows to the point where other dietary approaches become more appropriate.',
    examples: [
      { lbm_lbs: 120, protein_g: 144, kcal: 576, note: '~465g chicken breast' },
      { lbm_lbs: 140, protein_g: 168, kcal: 672, note: '~540g chicken breast' },
      { lbm_lbs: 160, protein_g: 192, kcal: 768, note: '~620g chicken breast' },
      { lbm_lbs: 180, protein_g: 216, kcal: 864, note: '~700g chicken breast' },
    ],
  },

  // ─── Approved Foods ────────────────────────────────────────────────────────
  approvedFoods: [
    {
      category: 'Poultry',
      color: '#f59e0b',
      items: [
        { name: 'Chicken Breast (skinless)', protein100g: 31, fat100g: 3.6, typicalServing: '200g', servingProtein: 62 },
        { name: 'Turkey Breast (skinless)', protein100g: 29, fat100g: 1.0, typicalServing: '200g', servingProtein: 58 },
        { name: 'Egg Whites', protein100g: 11, fat100g: 0.2, typicalServing: '200ml (≈6 whites)', servingProtein: 22 },
      ],
    },
    {
      category: 'Fish & Seafood',
      color: 'var(--info)',
      items: [
        { name: 'Cod', protein100g: 18, fat100g: 0.7, typicalServing: '200g', servingProtein: 36 },
        { name: 'Tilapia', protein100g: 26, fat100g: 2.7, typicalServing: '200g', servingProtein: 52 },
        { name: 'Tuna (canned in water)', protein100g: 26, fat100g: 0.5, typicalServing: '185g tin', servingProtein: 48 },
        { name: 'Shrimp / Prawns', protein100g: 24, fat100g: 0.3, typicalServing: '150g', servingProtein: 36 },
        { name: 'White Fish (generic)', protein100g: 20, fat100g: 1.0, typicalServing: '200g', servingProtein: 40 },
        { name: 'Crab (cooked)', protein100g: 19, fat100g: 1.1, typicalServing: '150g', servingProtein: 29 },
        { name: 'Pollock', protein100g: 19, fat100g: 1.0, typicalServing: '200g', servingProtein: 38 },
        { name: 'Haddock', protein100g: 19, fat100g: 0.6, typicalServing: '200g', servingProtein: 38 },
      ],
    },
    {
      category: 'Lean Red Meat',
      color: 'var(--danger)',
      items: [
        { name: 'Extra Lean Beef Mince (5% fat)', protein100g: 21, fat100g: 5, typicalServing: '200g', servingProtein: 42 },
        { name: 'Bison (lean cuts)', protein100g: 26, fat100g: 2.4, typicalServing: '200g', servingProtein: 52 },
        { name: 'Venison (lean)', protein100g: 24, fat100g: 2.1, typicalServing: '200g', servingProtein: 48 },
      ],
    },
    {
      category: 'Dairy & Other',
      color: 'var(--accent)',
      items: [
        { name: 'Non-fat Greek Yoghurt', protein100g: 10, fat100g: 0.4, typicalServing: '200g', servingProtein: 20 },
        { name: 'Low-fat Cottage Cheese', protein100g: 11, fat100g: 1.2, typicalServing: '200g', servingProtein: 22 },
        { name: 'Non-fat Quark', protein100g: 12, fat100g: 0.2, typicalServing: '200g', servingProtein: 24 },
        { name: 'Imitation Crab (Surimi)', protein100g: 7, fat100g: 0.8, typicalServing: '150g', servingProtein: 11 },
      ],
    },
    {
      category: 'Vegetables (Unlimited)',
      color: '#10b981',
      note: 'These are near-zero calorie and should be eaten freely for fibre, micronutrients, and satiety. Do not count them toward your protein target.',
      items: [
        { name: 'Spinach', protein100g: 2.9, fat100g: 0.4, typicalServing: 'Unlimited', servingProtein: 0 },
        { name: 'Lettuce / Rocket', protein100g: 1.2, fat100g: 0.2, typicalServing: 'Unlimited', servingProtein: 0 },
        { name: 'Cucumber', protein100g: 0.7, fat100g: 0.1, typicalServing: 'Unlimited', servingProtein: 0 },
        { name: 'Celery', protein100g: 0.7, fat100g: 0.2, typicalServing: 'Unlimited', servingProtein: 0 },
        { name: 'Courgette / Zucchini', protein100g: 1.2, fat100g: 0.3, typicalServing: 'Unlimited', servingProtein: 0 },
        { name: 'Broccoli', protein100g: 2.8, fat100g: 0.4, typicalServing: 'Unlimited', servingProtein: 0 },
        { name: 'Cauliflower', protein100g: 1.9, fat100g: 0.3, typicalServing: 'Unlimited', servingProtein: 0 },
        { name: 'Mushrooms', protein100g: 3.1, fat100g: 0.3, typicalServing: 'Unlimited', servingProtein: 0 },
        { name: 'Bell Peppers', protein100g: 0.9, fat100g: 0.2, typicalServing: 'Unlimited', servingProtein: 0 },
        { name: 'Asparagus', protein100g: 2.2, fat100g: 0.1, typicalServing: 'Unlimited', servingProtein: 0 },
        { name: 'Green Beans', protein100g: 1.8, fat100g: 0.1, typicalServing: 'Unlimited', servingProtein: 0 },
        { name: 'Kale', protein100g: 4.3, fat100g: 0.9, typicalServing: 'Unlimited', servingProtein: 0 },
      ],
    },
  ],

  // ─── Restricted Foods ──────────────────────────────────────────────────────
  restrictedFoods: [
    { item: 'All cooking oils (olive, coconut, vegetable)', reason: 'Pure fat — 9 kcal/g, zero protein, destroys deficit' },
    { item: 'Butter and margarine', reason: 'Same as above — pure dietary fat' },
    { item: 'Avocado', reason: 'High fat (15g per 100g) despite being "healthy" fat' },
    { item: 'Nuts and nut butters', reason: 'Very calorie-dense fat source (50–65g fat per 100g)' },
    { item: 'All bread, rice, pasta, oats', reason: 'Carbohydrates blunt ketosis and add unwanted calories' },
    { item: 'Fruit (all types)', reason: 'Fructose and glucose raise insulin; save for refeed days' },
    { item: 'Starchy vegetables (potato, sweet potato, corn, peas)', reason: 'High carbohydrate content' },
    { item: 'Whole eggs', reason: 'Egg yolks add 5g fat per egg — use egg whites only' },
    { item: 'Fatty cuts of meat (salmon, ribeye, lamb, pork belly)', reason: 'Fat content too high for PSMF days' },
    { item: 'Full-fat dairy (cheese, cream, whole milk, full-fat yoghurt)', reason: 'High fat content' },
    { item: 'Alcohol', reason: 'Empty calories, suppresses fat oxidation, disrupts sleep and recovery' },
    { item: 'Fruit juice and smoothies', reason: 'High sugar, essentially liquid carbohydrate' },
    { item: 'Commercial protein bars', reason: 'Typically 8–15g fat and significant carbohydrates; use real food instead' },
    { item: 'Condiments with sugar (ketchup, BBQ sauce, teriyaki, sweet chilli)', reason: 'Sugar-based calories that add up quickly' },
    { item: 'Flavoured waters and sports drinks', reason: 'Often contain carbohydrates and sugar' },
    { item: 'Energy drinks (unless zero calorie)', reason: 'Many contain carbohydrates; check label carefully' },
  ],

  // ─── Electrolytes ──────────────────────────────────────────────────────────
  electrolytes: {
    warning:
      'Electrolyte depletion is the single greatest health risk on PSMF. When insulin is low (due to near-zero carbohydrate intake), the kidneys excrete significantly more sodium and potassium. Without deliberate supplementation, dangerous deficiencies will develop within days, causing muscle cramps, heart palpitations, headaches, fatigue, and in severe cases, cardiac arrhythmia. This is not optional — treat electrolytes as a medication.',
    targets: [
      {
        mineral: 'Sodium',
        target: '3000–5000mg/day',
        icon: '🧂',
        sources: ['Pink Himalayan salt (added liberally to food and water)', 'Chicken or beef broth (500–1000ml/day)', 'Sodium tablets or electrolyte capsules'],
        deficiencySymptoms: 'Headache, muscle cramps, nausea, dizziness, brain fog, fatigue',
        note: 'Do not restrict sodium on PSMF. The standard advice to reduce salt does NOT apply here. Hyponatraemia (low sodium from drinking too much plain water) is a real risk.',
        color: '#f59e0b',
      },
      {
        mineral: 'Potassium',
        target: '3500mg/day',
        icon: '⚡',
        sources: ['NoSalt or Nu-Salt (potassium chloride salt substitute — 600mg K per ¼ tsp)', 'Chicken breast, turkey (naturally high in K)', 'Potassium supplement capsules (99mg each — low dose; multiple needed)'],
        deficiencySymptoms: 'Severe muscle cramps, heart palpitations, arrhythmia, weakness, constipation',
        note: 'Potassium deficiency is dangerous and can cause cardiac arrhythmia. NoSalt/Nu-Salt is the most practical high-dose source. Do not exceed 5000mg/day without medical supervision.',
        color: 'var(--danger)',
      },
      {
        mineral: 'Magnesium',
        target: '300–500mg/day (elemental)',
        icon: '💊',
        sources: ['Magnesium glycinate (preferred — best absorbed, gentlest on gut)', 'Magnesium malate (energy support, good for daytime)', 'Magnesium citrate (can cause loose stools at high dose — use with caution)'],
        deficiencySymptoms: 'Sleep disruption, muscle twitches/cramps, anxiety, headaches, constipation',
        note: 'Take magnesium glycinate 200–400mg at night. It markedly improves sleep quality on PSMF and reduces cramping.',
        color: 'var(--purple)',
      },
      {
        mineral: 'Phosphorus',
        target: 'Adequate via diet',
        icon: '🔬',
        sources: ['Covered by high protein intake (chicken, fish, eggs all rich in phosphorus)'],
        deficiencySymptoms: 'Bone pain, weakness (rare on adequate protein intake)',
        note: 'No supplementation typically needed. High-protein diet provides sufficient phosphorus.',
        color: 'var(--info)',
      },
    ],
    practicalTips: [
      'Drink 500–1000ml chicken broth every day — it contains sodium, potassium, and is highly satiating',
      'Add pink Himalayan salt to every meal AND to your water bottle (a small pinch)',
      'Use NoSalt/Nu-Salt as your table salt substitute to hit potassium targets',
      'Take magnesium glycinate 300mg before bed every night',
      'Consider LMNT, Precision Hydration, or similar electrolyte sachets for convenience',
      'If you develop heart palpitations, stop PSMF immediately and seek medical advice',
      'Headaches in Week 1 are usually sodium deficiency — increase salt before reaching for paracetamol',
    ],
    hyponatraeiaWarning:
      'WARNING: Hyponatraemia — Drinking large volumes of plain water without adequate sodium is dangerous on PSMF. Low insulin causes extreme sodium wasting. Always salt your water or add electrolytes to every litre consumed.',
  },

  // ─── Supplements ───────────────────────────────────────────────────────────
  supplements: [
    {
      name: 'Electrolyte Complex',
      priority: 'Essential',
      dose: 'Per product instructions, targeting daily mineral targets above',
      rationale: 'The single most important supplement on PSMF. Without adequate electrolytes, the protocol is dangerous.',
      color: 'var(--danger)',
    },
    {
      name: 'Omega-3 Fish Oil',
      priority: 'Essential',
      dose: '2–4g EPA+DHA daily',
      rationale: 'Anti-inflammatory, preserves muscle protein synthesis signalling, supports cardiovascular health during caloric stress. One of the few fats that belongs on PSMF.',
      color: 'var(--info)',
    },
    {
      name: 'High-Quality Multivitamin',
      priority: 'Essential',
      dose: '1–2 per day with meals',
      rationale: 'A severely restricted diet lacks vitamins and minerals from food variety. A broad-spectrum multivitamin helps fill micronutrient gaps.',
      color: 'var(--accent)',
    },
    {
      name: 'Magnesium Glycinate',
      priority: 'Essential',
      dose: '300–400mg elemental magnesium at night',
      rationale: 'Addresses near-certain magnesium depletion from renal excretion. Improves sleep quality, reduces cramps, supports muscle function.',
      color: 'var(--purple)',
    },
    {
      name: 'Psyllium Husk / Fibre Supplement',
      priority: 'Highly Recommended',
      dose: '5–10g in water, 1–2x daily',
      rationale: 'PSMF is a very low-residue diet. Without supplemental fibre, constipation is almost universal. Psyllium also increases satiety and slows gastric emptying.',
      color: '#f59e0b',
    },
    {
      name: 'Vitamin D3 + K2',
      priority: 'Recommended',
      dose: '2000–5000 IU D3 + 100mcg K2 daily',
      rationale: 'Vitamin D supports muscle protein synthesis, immune function, and mood. Severe restriction increases deficiency risk if sun exposure is low.',
      color: '#f59e0b',
    },
    {
      name: 'Caffeine (optional)',
      priority: 'Optional',
      dose: '100–200mg pre-training or morning (avoid after 2pm)',
      rationale: 'Preserves training performance during caloric restriction. Mild appetite suppression. Improves fat oxidation via catecholamine stimulation.',
      color: 'var(--muted)',
    },
    {
      name: 'Collagen Peptides (optional)',
      priority: 'Optional',
      dose: '10–15g in hot drinks or food',
      rationale: 'Adds bulk and satiety to food. Provides proline and glycine for connective tissue support. Low in essential amino acids so does not replace complete protein foods.',
      color: 'var(--muted)',
    },
    {
      name: 'Melatonin (optional)',
      priority: 'Optional',
      dose: '0.5–3mg 30 min before bed',
      rationale: 'Sleep disruption is common in week 1. Low-dose melatonin can help re-establish sleep onset without dependence risk.',
      color: 'var(--muted)',
    },
  ],

  // ─── Side Effects ──────────────────────────────────────────────────────────
  sideEffects: [
    {
      effect: 'Fatigue and Low Energy',
      timing: 'Days 1–5 (adaptation phase)',
      severity: 'Moderate to significant',
      management: [
        'Ensure electrolytes are optimal — fatigue is usually sodium/potassium deficiency, not just calories',
        'Prioritise 7–9 hours of sleep',
        'Reduce training intensity by 20–30% in week 1',
        'Caffeine (100–200mg) can blunt fatigue without adding calories',
        'This WILL improve by days 5–7 as metabolic adaptation to fat burning occurs',
      ],
    },
    {
      effect: 'Hunger (especially days 1–4)',
      timing: 'Most intense first 3–4 days; diminishes significantly by day 6–8',
      severity: 'Significant',
      management: [
        'Drink 500ml chicken broth — highly satiating and provides electrolytes',
        'Eat bulky, high-volume low-calorie vegetables (broccoli, spinach, courgette) at every meal',
        'Divide protein across 4–6 small meals rather than 2–3 large ones',
        'Black coffee suppresses appetite and enhances fat oxidation',
        'Sparkling water significantly blunts appetite — use it aggressively',
        'Ketosis (typically achieved by day 3–4) is a natural appetite suppressant',
      ],
    },
    {
      effect: 'Brain Fog and Irritability',
      timing: 'Days 1–6, peak around day 2–4',
      severity: 'Moderate',
      management: [
        'This is carbohydrate withdrawal — entirely temporary',
        'Electrolytes are critical (brain fog = often sodium deficiency)',
        'Ketones become the brain\'s primary fuel by day 4–5 — cognition often normalises or improves',
        'Avoid high-stakes cognitive tasks in days 2–4 if possible',
        'Warn family/colleagues that you may be temporarily irritable',
      ],
    },
    {
      effect: 'Reduced Training Performance',
      timing: 'Entire PSMF period; worst in week 1',
      severity: 'Expected and normal',
      management: [
        'Reduce training weights by 20–30%',
        'Prioritise resistance training over cardio for muscle preservation',
        'Avoid high-intensity cardio (HIIT) in week 1 — risk of injury and excessive cortisol',
        'Focus on perfect form at lighter weights',
        'Do not attempt to maintain pre-PSMF performance benchmarks',
        'Performance returns to normal (often exceeds baseline) after maintenance break',
      ],
    },
    {
      effect: 'Constipation',
      timing: 'Days 3–10',
      severity: 'Moderate',
      management: [
        'Add 5–10g psyllium husk in water twice daily',
        'Eat unlimited fibrous vegetables (broccoli, cauliflower, green beans)',
        'Ensure adequate hydration (2.5–4L fluids daily)',
        'Magnesium citrate 150–300mg can provide a gentle laxative effect if needed',
        'Regular walking/light movement supports bowel motility',
      ],
    },
    {
      effect: 'Bad Breath (Halitosis)',
      timing: 'Days 3–7 onwards (once ketosis established)',
      severity: 'Minor to moderate',
      management: [
        'Ketone acetone is exhaled through the breath — this is a sign the protocol is working',
        'Stay well hydrated — reduces ketone concentration in saliva',
        'Sugar-free mints, chlorophyll drops',
        'Tongue scraping morning and evening',
        'This improves as ketosis stabilises after week 2',
      ],
    },
    {
      effect: 'Cold Sensitivity',
      timing: 'Throughout PSMF',
      severity: 'Mild',
      management: [
        'Reduced caloric intake suppresses thermogenesis — you will feel colder than usual',
        'Layer up clothing, use a blanket at your desk',
        'Hot beverages (black coffee, green tea, broth) help maintain warmth',
        'This is normal and reverses on maintenance break',
      ],
    },
    {
      effect: 'Sleep Disruption',
      timing: 'Weeks 1–2',
      severity: 'Mild to moderate',
      management: [
        'Magnesium glycinate 300–400mg before bed significantly improves sleep quality',
        'Low-dose melatonin 0.5–3mg if needed',
        'Avoid training within 3 hours of bed',
        'Keep bedroom cold (18–19°C) — counteracts thermogenesis suppression',
        'A small protein snack (egg whites, Greek yoghurt) before bed can prevent 3am waking from hypoglycaemia',
      ],
    },
    {
      effect: 'Hair Loss (Telogen Effluvium)',
      timing: '4–12 weeks after the period of restriction (delayed)',
      severity: 'Mild to moderate (temporary)',
      management: [
        'Occurs if PSMF is run > 3–4 weeks or protein intake was inadequate',
        'Hair follicles enter a resting phase due to caloric and nutritional stress',
        'Hair loss is temporary — regrowth is normal within 3–6 months',
        'Adequate protein (hitting your daily target) is the best prevention',
        'Zinc and biotin supplementation may reduce severity',
        'Maximum 2 weeks per PSMF cycle significantly reduces this risk',
      ],
    },
  ],

  // ─── Week by Week Guide ────────────────────────────────────────────────────
  weekByWeekGuide: [
    {
      week: 1,
      title: 'Adaptation Phase',
      subtitle: 'Electrolytes Critical — Trust the Process',
      focus: 'Survival, adaptation, electrolyte discipline',
      keyPoints: [
        'Scale weight will drop 2–4kg rapidly in days 1–4 — this is water and glycogen, not fat. Do not celebrate prematurely or panic when it stalls.',
        'DO NOT weigh yourself daily and attach emotion to the number. Use a weekly average (7-day sum ÷ 7) to see real trends.',
        'Electrolyte protocol must be started ON DAY 1 — do not wait until you feel symptoms.',
        'Hunger will be intense days 1–3, then diminishes. Use broth and vegetables aggressively.',
        'Reduce training weights by 20–30%. Focus on hitting your protein targets above hitting PBs.',
        'Expect to feel worse before you feel better. Days 2–4 are the hardest.',
        'Report any heart palpitations to your coach immediately.',
      ],
    },
    {
      week: 2,
      title: 'Peak Fat Loss Phase',
      subtitle: 'Body Adapts — Fat Burning Accelerates',
      focus: 'Maximise results, watch for plateau',
      keyPoints: [
        'Most people feel significantly better in week 2 — energy improves, hunger reduces, mental clarity returns.',
        'Fat loss accelerates — this is the primary fat-burning week of the cycle.',
        'Ketosis is well-established; ketone breath may peak.',
        'Watch for a weight plateau mid-week 2 — this is temporary water retention from muscle inflammation. It resolves.',
        'Training performance may improve slightly from week 1 as adaptation to fat-fuelled exercise occurs.',
        'Prepare mentally for the maintenance break — many clients resist it, feeling the momentum. The break is MANDATORY.',
        'Begin planning your maintenance week food strategy now to avoid reactive overeating when calories increase.',
      ],
    },
    {
      week: 3,
      title: 'Maintenance Break — Week 1',
      subtitle: 'Restore, Recover, Retain Gains',
      focus: 'Metabolic reset, prevent adaptation',
      keyPoints: [
        'Return to maintenance calories (TDEE) — increase is calculated with your coach. Do not guess.',
        'You will gain 1–2kg scale weight immediately — this is glycogen and water, NOT fat. Expected and normal.',
        'Reintroduce carbohydrates gradually: aim for 150–200g on day 1, building to full maintenance by day 3.',
        'Keep protein high (1.6–2g/kg) throughout maintenance break.',
        'Train normally — this is the week to make strength progress and push hard.',
        'Sleep, mood, and energy will improve markedly. Enjoy the break — it is doing critical hormonal work.',
        'Do NOT use this as a psychological release valve to binge. Structured maintenance, not a free-for-all.',
      ],
    },
    {
      week: 4,
      title: 'Maintenance Break — Week 2',
      subtitle: 'Consolidate & Prepare for Next Cycle',
      focus: 'Hormonal restoration, prepare for cycle 2 if needed',
      keyPoints: [
        'Thyroid, leptin, and cortisol are normalising. This is when the metabolic benefits of the maintenance break fully manifest.',
        'Assess total results with your coach: body weight trend, measurements, performance, how you feel.',
        'Decide with your coach whether a second PSMF cycle is appropriate, or whether transition to a moderate deficit is the better path.',
        'If running a second PSMF cycle, ensure you have had at least 14 days at maintenance before starting again.',
        'Continue strength training at full intensity.',
        'Run body composition assessment (measurements, photos) before committing to another cycle.',
        'Most clients achieve their goal within 1–2 PSMF cycles combined with appropriate maintenance periods.',
      ],
    },
  ],

  // ─── Monitoring ────────────────────────────────────────────────────────────
  monitoring: [
    {
      metric: 'Body Weight',
      frequency: 'Daily (first thing morning, after toilet, before food)',
      howToTrack: 'Record every day, calculate 7-day rolling average. Use the average, not the daily number, to assess progress.',
      redFlags: 'Consistent gain over 3+ days may indicate water retention issue; single day spikes are normal',
    },
    {
      metric: 'Energy Level',
      frequency: 'Daily self-rating 1–10',
      howToTrack: 'Log in check-in: 1 = bedridden, 5 = functional but flat, 10 = excellent',
      redFlags: 'Score of 2 or below for more than 3 consecutive days — review electrolytes and consider pausing',
    },
    {
      metric: 'Training Performance',
      frequency: 'Per session',
      howToTrack: 'Note weights used relative to pre-PSMF baseline. Expect 20–30% reduction in week 1.',
      redFlags: 'Progressive decline (not just maintained low level) across multiple sessions',
    },
    {
      metric: 'Sleep Quality',
      frequency: 'Daily self-rating 1–10',
      howToTrack: 'Log in check-in. Optimise with magnesium glycinate and melatonin if needed.',
      redFlags: 'Consistent poor sleep (< 5/10) for 5+ days without improvement',
    },
    {
      metric: 'Hunger Level',
      frequency: 'Daily self-rating 1–10',
      howToTrack: 'Log in check-in: 1 = no hunger, 10 = unmanageable hunger',
      redFlags: 'Score of 9–10 for multiple consecutive days — review food timing, fibre, broth use',
    },
    {
      metric: 'Mood and Adherence',
      frequency: 'Daily self-rating 1–10',
      howToTrack: 'Combined mood/adherence score in check-in',
      redFlags: 'Consistent low mood (< 4/10) — do not continue PSMF if mentally deteriorating',
    },
    {
      metric: 'Measurements',
      frequency: 'Weekly (start of PSMF cycle, end of week 2)',
      howToTrack: 'Waist, hips, chest, thigh, upper arm. Progress photos in same conditions (lighting, pose, clothing)',
      redFlags: 'No measurement reduction after 2 weeks of full adherence — review protocol',
    },
  ],

  // ─── Exit Protocol ─────────────────────────────────────────────────────────
  exitProtocol: {
    title: 'Transitioning Off PSMF Safely',
    description:
      'Ending PSMF incorrectly is as important as running it correctly. The body is highly sensitised to incoming energy after severe restriction. Abrupt high-calorie reintroduction — particularly high fat and carbohydrate simultaneously — will cause disproportionate fat storage.',
    steps: [
      {
        phase: 'Days 1–3 Post-PSMF',
        instruction: 'Add carbohydrates back first. Increase carbohydrates by 50g/day while keeping protein constant and fat low. Target: ~1200–1400 kcal. Body weight will increase 0.5–1kg — this is glycogen reloading, not fat gain.',
      },
      {
        phase: 'Days 4–7 Post-PSMF',
        instruction: 'Continue increasing carbohydrates to 100–150g. Begin gradually reintroducing moderate fats. Target: ~1600–1800 kcal. Weight will stabilise.',
      },
      {
        phase: 'Week 2 Post-PSMF',
        instruction: 'Return to full maintenance calories at TDEE. Maintain high protein (1.6–2g/kg). Normal eating restored with all food groups. Train at full intensity.',
      },
    ],
    warnings: [
      'Do not interpret the post-PSMF weight bounce (1–2kg) as failure — it is expected glycogen and water restoration, not fat gain',
      'The most common mistake: celebrating the end of PSMF by eating a massive calorie-rich meal. This triggers disproportionate fat storage and completely undermines results',
      'Diabetic clients: blood glucose must be monitored closely when reintroducing carbohydrates — risk of rebound hyperglycaemia',
      'Reintroduce foods systematically — this helps identify any GI sensitivities that developed during the restricted period',
      'If you experience light-headedness or nausea when reintroducing carbohydrates, slow the process further and consult your coach',
    ],
  },

  // ─── FAQs ──────────────────────────────────────────────────────────────────
  faqs: [
    {
      question: 'Can I exercise on PSMF?',
      answer:
        'Yes, and you should — resistance training is critical for muscle preservation on PSMF. Reduce your training weights by 20–30% in week 1 as glycogen stores are depleted. Focus on form and moderate volume rather than intensity. Avoid high-intensity cardio (HIIT, sprints) in week 1 as it significantly elevates cortisol which can impair muscle preservation. Moderate steady-state cardio (walking, cycling) is fine and aids fat oxidation. Performance returns to normal (often exceeds pre-PSMF levels) after the maintenance break.',
    },
    {
      question: 'Will I lose muscle on PSMF?',
      answer:
        'With adequate protein intake (1.2g/lb LBM) and continued resistance training, lean mass loss is minimal. Research on PSMF consistently shows muscle mass is preserved when protein is sufficient. The combination of high dietary protein (providing amino acids for muscle protein synthesis), an anabolic training stimulus, and adequate electrolytes ensures the body draws from adipose stores rather than muscle tissue for the caloric deficit. Small amounts of lean mass loss (< 0.5kg over 2 weeks) are normal and quickly restored during the maintenance break.',
    },
    {
      question: 'How much fat will I actually lose?',
      answer:
        'Expect 0.5–1kg of true fat loss per week on strict PSMF days, plus an initial 2–4kg of water/glycogen in the first 3–5 days (which is rapidly regained when carbohydrates are reintroduced). Total scale weight loss over a 2-week PSMF cycle is typically 4–7kg for most people, of which 1–2kg is true fat, 1–2kg is water/glycogen (temporarily lost), and the remainder is normal measurement variation. Focus on the monthly trend and measurements over scale weight alone.',
    },
    {
      question: 'Can I do PSMF long-term?',
      answer:
        'Absolutely not. PSMF is limited to a maximum of 2 consecutive weeks before a mandatory maintenance break of equal or greater length. Beyond 2 weeks, the metabolic costs — thyroid suppression (T3 reduction), cortisol elevation, leptin dysregulation, and risk of lean mass loss — outweigh the fat loss benefits. Multiple PSMF cycles with adequate breaks between them are the correct approach for individuals with substantial fat loss goals.',
    },
    {
      question: 'Can I have condiments and seasonings?',
      answer:
        'Yes — with careful selection. Approved: mustard (French, Dijon, American), hot sauce (Tabasco, Cholula, Sriracha — check for added sugar in some brands), white/apple cider/balsamic vinegar, all dried herbs and spices, salt, pepper, lemon/lime juice, soy sauce (adds negligible calories but high sodium — count it), Worcestershire sauce in small amounts. Not approved: ketchup (4g sugar per tbsp), BBQ sauce, teriyaki, honey mustard, ranch dressing, mayonnaise, any cream-based sauces. When in doubt, check the label for carbohydrates and fat.',
    },
    {
      question: 'What if I\'m constipated?',
      answer:
        'Very common on PSMF due to low dietary residue. Take 5g psyllium husk in 500ml water morning and evening. Eat unlimited fibrous vegetables (broccoli, cauliflower, green beans, spinach). Stay well hydrated (3–4L fluids). Consider magnesium citrate 150–200mg if constipation is severe (it has a mild laxative effect at this dose, unlike glycinate). Regular walking also supports bowel motility.',
    },
    {
      question: 'Is the weight bounce after PSMF real fat gain?',
      answer:
        'No. When you reintroduce carbohydrates after a low-carb phase, each gram of glycogen stored in muscle binds approximately 3–4g of water. Restoring ~300–400g of glycogen adds 1–1.5kg of scale weight immediately. This is not fat — it is a normal physiological process. Your body composition has not changed. This weight bounce is actually a positive sign that muscles are refuelling. Focus on monthly body composition trends, not day-to-day scale numbers.',
    },
    {
      question: 'Why do I feel cold all the time?',
      answer:
        'Severe caloric restriction suppresses non-shivering thermogenesis (the body\'s background heat production). The thyroid reduces T3 output slightly in response to caloric restriction, lowering metabolic rate. This is a normal adaptive response. Layer up, drink hot beverages (black coffee, tea, broth), and accept that you will feel cooler than normal during the PSMF phase. Thermogenesis and core temperature normalise fully during the maintenance break.',
    },
    {
      question: 'Can I do PSMF if I have Type 2 Diabetes (diet-controlled)?',
      answer:
        'Only under direct medical supervision. Diet-controlled T2D with no medication may be suitable for PSMF (the low-carb approach can actually dramatically improve blood glucose) but requires regular glucose monitoring and close liaison with your GP or endocrinologist. Anyone on metformin, insulin, or sulfonylureas must not start PSMF without medication adjustment overseen by their prescribing doctor — hypoglycaemia risk is significant.',
    },
  ],

  // ─── Legal Disclaimer ──────────────────────────────────────────────────────
  legalDisclaimer:
    'PSMF is an advanced dietary strategy intended for use under qualified supervision. It is not suitable for everyone. The information provided in this module is for educational purposes for personal trainers and their coached clients. It does not constitute medical advice. Always consult a qualified healthcare professional — including your GP or a registered dietitian — before starting any very low calorie diet. Any individual with existing medical conditions, or taking prescription medications, must obtain medical clearance before beginning this protocol.',

}
