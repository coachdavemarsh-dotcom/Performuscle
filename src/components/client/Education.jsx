import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase.js'
import Learn from './Learn.jsx'

// ============================================================
// BUILT-IN MODULE LIBRARY (used until coach uploads content)
// ============================================================

const BUILTIN_MODULES = [
  // ── Training ──
  {
    id: 'b_prog_overload', category: 'training', contentType: 'article', unlockWeek: 0,
    title: 'Progressive Overload: The Engine of All Progress',
    summary: 'Without progressive overload, training becomes maintenance. Learn the 7 ways to drive adaptation.',
    readTime: '5 min', tag: 'Foundational', tagColor: 'var(--accent)',
    articleBody: `**What Is Progressive Overload?**
Progressive overload means systematically increasing the demands placed on your body so it keeps adapting. Once your body has adapted to a stimulus, that stimulus is no longer novel — progress stalls.

**The 7 Ways to Overload**
- **Load** — Add weight to the bar (the obvious one)
- **Volume** — More sets or reps at the same load
- **Density** — Same volume in less time (shorter rest periods)
- **Range of Motion** — Deeper squat, fuller stretch at the bottom
- **Frequency** — Train a muscle group more often per week
- **Technique** — Better motor patterns = more effective muscle recruitment
- **Intensity Techniques** — Drop sets, rest-pause, forced reps at the same load

**Why Just Adding Weight Isn't Enough**
Most beginners only think of progressive overload as "add 2.5kg every session." This works early on but creates a ceiling fast. Intermediate and advanced athletes must rotate which variable they're overloading — this is called Undulating Periodisation.

**Practical Application**
Track every single session. You cannot manage what you don't measure. When you can complete all prescribed reps with clean form, increase load by the smallest available increment. If load is stuck, increase reps first, then come back down in weight and push reps higher before climbing back up.`,
  },
  {
    id: 'b_hypertrophy', category: 'training', contentType: 'article', unlockWeek: 0,
    title: 'The 3 Mechanisms of Muscle Hypertrophy',
    summary: 'Mechanical tension, metabolic stress, and muscle damage — understanding all three changes how you train.',
    readTime: '6 min', tag: 'Science', tagColor: '#a78bfa',
    articleBody: `**1. Mechanical Tension**
This is the primary driver. When a muscle fibre is placed under load through its full range of motion, mechanical receptors trigger protein synthesis. Control the eccentric (lowering) phase — this is where the most tension occurs. Tempos like 4010 maximise this.

**2. Metabolic Stress**
The pump is real. When blood is occluded and metabolites accumulate (lactate, hydrogen ions, inorganic phosphate), a secondary hypertrophic signal is triggered. This is the basis of GBC training and high-rep work with short rest.

**3. Muscle Damage**
Microscopic disruption from eccentric loading triggers a repair response that stimulates growth. This is why novel exercises cause DOMS. Periodically introducing new movements keeps this mechanism active.

**Programming All Three**
Heavy compound lifts early (mechanical tension), followed by isolation work with shorter rest (metabolic stress), with strategic eccentric emphasis on key exercises (muscle damage). A well-designed programme hits all three every session.`,
  },
  {
    id: 'b_rpe', category: 'training', contentType: 'article', unlockWeek: 1,
    title: 'RPE & RIR: Train Smarter, Not Just Harder',
    summary: 'Two tools that transform how you auto-regulate load and avoid both under- and over-training.',
    readTime: '4 min', tag: 'Technique', tagColor: 'var(--warn)',
    articleBody: `**The RPE Scale (6–10)**
- RPE 6 — Moderate, 4+ reps in reserve
- RPE 7 — Somewhat hard, 3 reps left
- RPE 8 — Hard, 2 reps left
- RPE 9 — Very hard, 1 rep left
- RPE 10 — Absolute maximum

**RIR — Reps In Reserve**
RIR is the flip side: how many reps you could do before hitting failure. 2 RIR = RPE 8. Most effective training sits between RPE 7–9.

**Why Beginners Get It Wrong**
Most beginners underestimate their RPE — they think they're at 8 when they're actually at 6. Test yourself: on your last set, count how many more reps you could genuinely do. Compare it to what you thought. Your accuracy improves dramatically over time.

**How Your Coach Uses This**
RPE targets on your programme mean auto-regulation — on a heavy day you work up to RPE 8.5, leaving 1–2 reps in the tank. On a light day, the same weight might only be RPE 7. This lets training adapt to how you feel that day.`,
  },
  {
    id: 'b_tempo', category: 'training', contentType: 'article', unlockWeek: 1,
    title: 'Tempo Training: The 4-Digit Code Explained',
    summary: 'What 4010 actually means, and why controlling movement speed changes everything.',
    readTime: '4 min', tag: 'Technique', tagColor: 'var(--warn)',
    articleBody: `**Reading the 4-Digit Code**
Each digit = one phase of the movement:
- Digit 1 — Eccentric (lowering) in seconds
- Digit 2 — Pause at bottom (stretched position)
- Digit 3 — Concentric (lifting) — X = explosive
- Digit 4 — Pause at top (contracted position)

**Example: Squat @ 4010**
4 seconds down, 0 pause at bottom, 1 second up, 0 pause at top. The slow descent maximises mechanical tension.

**Example: Chin-up @ 3111**
3 seconds lowering, 1 second dead hang, 1 second pull, 1 second hold at top.

**Why It Matters**
Controlling tempo eliminates momentum (the muscle does the work, not physics), forces honest range of motion, and increases time under tension — the primary driver of hypertrophy. A 4010 squat is a completely different stimulus than the same weight bounced up fast.`,
  },
  {
    id: 'b_quiz_training', category: 'training', contentType: 'quiz', unlockWeek: 2,
    title: 'Training Foundations Quiz',
    summary: 'Test your understanding of the core training principles.',
    readTime: '3 min', tag: 'Quiz', tagColor: '#60a5fa',
    questions: [
      {
        question: 'Which phase of a lift produces the greatest mechanical tension?',
        options: [
          { text: 'The concentric (lifting) phase', hint: 'This is where you produce force, but tension is lower.' },
          { text: 'The eccentric (lowering) phase', hint: 'Correct! More motor units are recruited under eccentric load.' },
          { text: 'The isometric pause at the top', hint: 'Tension here is significant but less than eccentric.' },
          { text: 'The transition between phases', hint: 'Not a recognised phase for tension measurement.' },
        ],
        correctIndex: 1,
        explanation: 'The eccentric phase produces the highest mechanical tension and is the primary driver of muscle damage and mechanical tension-based hypertrophy. This is why controlling the lowering phase (tempo digit 1) is so important.',
      },
      {
        question: 'In tempo notation "4010", what does the first digit represent?',
        options: [
          { text: 'The concentric (lifting) speed in seconds', hint: 'Check the digit order again — concentric is digit 3.' },
          { text: 'The rest between reps', hint: 'Rest between reps is not encoded in tempo notation.' },
          { text: 'The eccentric (lowering) speed in seconds', hint: 'Correct! Digit 1 = eccentric, digit 3 = concentric.' },
          { text: 'The number of sets', hint: 'Sets are listed separately as a number before the exercise.' },
        ],
        correctIndex: 2,
        explanation: 'The four digits map to: 1=Eccentric, 2=Bottom pause, 3=Concentric (X=explosive), 4=Top pause. So 4010 means 4s down, no pause, 1s up, no pause at top.',
      },
      {
        question: 'RPE 8 means approximately how many reps are left in reserve (RIR)?',
        options: [
          { text: '0 — you are at absolute failure', hint: 'That would be RPE 10.' },
          { text: '1 rep in reserve', hint: 'Close — that is RPE 9.' },
          { text: '2 reps in reserve', hint: 'Correct! RPE 8 = 2 RIR, which is the sweet spot for most working sets.' },
          { text: '4–5 reps in reserve', hint: 'That would be around RPE 6.' },
        ],
        correctIndex: 2,
        explanation: 'RPE 8 = 2 RIR. The most effective training range sits between RPE 7–9 (1–3 reps in reserve). Training consistently below RPE 7 is too easy; training at RPE 10 on every set leads to excessive fatigue and injury risk.',
      },
    ],
  },

  // ── Nutrition ──
  {
    id: 'b_protein', category: 'nutrition', contentType: 'article', unlockWeek: 0,
    title: 'Protein: How Much, When, and Why',
    summary: 'The single most important macronutrient for body composition. Targets, timing, and strategy.',
    readTime: '6 min', tag: 'Foundational', tagColor: 'var(--accent)',
    articleBody: `**Daily Protein Target**
For anyone training seriously: 1.6–2.4g per kg of body weight per day. For an 80kg person, that is 128–192g daily. If you are in a caloric deficit, push toward the higher end (2.4–3.1g/kg) to preserve muscle.

**Does Timing Matter?**
Yes — but less than total daily intake. A protein dose of 0.4g/kg per meal maximally stimulates muscle protein synthesis. For an 80kg person, that is ~32g per meal. 4–5 meals per day hitting this threshold is optimal. The anabolic window is real but wide — within 2 hours post-training is sufficient.

**Best Sources Per 100g**
- Chicken breast: 31g protein
- Tuna: 30g protein
- Turkey: 29g protein
- Lean beef mince: 26g protein
- Eggs: 13g (6g per egg)
- Greek yoghurt: 10g per 100g (17g per serving)
- Whey protein: 80g+ (supplement)

**Practical Strategy**
Build every meal around a protein source first, then add carbs and fat around it. This single habit — protein first — naturally improves overall diet quality and hits targets without overthinking it.`,
  },
  {
    id: 'b_deficit', category: 'nutrition', contentType: 'article', unlockWeek: 0,
    title: 'Caloric Deficit: How Aggressive Is Too Aggressive?',
    summary: 'Bigger deficits mean faster fat loss, right? Not exactly — here is why rate of loss matters.',
    readTime: '5 min', tag: 'Science', tagColor: '#a78bfa',
    articleBody: `**The Sweet Spot**
0.5–1% of body weight per week is the evidence-backed target for fat loss while preserving muscle. For an 80kg person: 400–800g per week. This equals roughly a 300–600 kcal daily deficit.

**Why Aggressive Deficits Backfire**
When you cut too hard:
- Muscle catabolism increases — your body breaks down muscle for energy
- Metabolic rate drops — adaptive thermogenesis reduces TDEE by 200–400 kcal
- Training performance suffers — you cannot train hard enough to maintain muscle
- Hormones drop — testosterone, thyroid, and leptin all fall

**Energy Availability (EA)**
EA = (Intake − Exercise EE) ÷ Lean Body Mass. This is what your coach uses to check your plan is sustainable:
- EA ≥ 45 kcal/kg LBM — Optimal
- EA 30–44 — Low (recovery impaired)
- EA < 30 — RED-S risk (Relative Energy Deficiency in Sport)

**The Formula**
Moderate deficit (300–500 kcal below TDEE) + high protein + hard training = fat loss while preserving or building muscle. There is no shortcut that beats this combination.`,
  },
  {
    id: 'b_carb_cycling', category: 'nutrition', contentType: 'article', unlockWeek: 3,
    title: 'Carb Cycling: Matching Intake to Training Demand',
    summary: 'Why your calories should change based on your training day — and how to implement it.',
    readTime: '5 min', tag: 'Advanced', tagColor: 'var(--danger)',
    articleBody: `**The Logic**
Carbohydrates are the primary fuel for high-intensity training. On training days you need them. On rest days you don't. Eating more carbs on training days and fewer on rest days fuels performance when needed and shifts toward fat-burning when you don't need the glucose.

**The 3-Day-Type System**
Your nutrition plan uses this framework:
- Training Day — High carbs (250–350g), at or above maintenance calories
- Moderate Day — Medium carbs (150–200g), slight deficit
- Rest Day — Low carbs (75–100g), meaningful deficit

**Where to Put the Carbs**
- Pre-training (30–60 min before): fast-digesting carbs — rice, banana, oats
- Post-training (within 2 hours): pair carbs with protein for muscle protein synthesis
- Rest of day: slower-digesting sources — sweet potato, whole grains, legumes

**Fat Intake**
Fat is inversely adjusted — higher on lower-carb days to maintain satiety and support hormones, slightly lower on high-carb training days. Protein stays consistent across all day types.`,
  },
  {
    id: 'b_quiz_nutrition', category: 'nutrition', contentType: 'quiz', unlockWeek: 2,
    title: 'Nutrition Fundamentals Quiz',
    summary: 'Test your understanding of protein, calories, and macro strategy.',
    readTime: '3 min', tag: 'Quiz', tagColor: '#60a5fa',
    questions: [
      {
        question: 'What is the research-backed daily protein target for someone in hard training?',
        options: [
          { text: '0.8g per kg body weight', hint: 'This is the minimum for sedentary people — too low for athletes.' },
          { text: '1.6–2.4g per kg body weight', hint: 'Correct! This is the evidence-backed range for athletes and those training seriously.' },
          { text: '3.5–4.0g per kg body weight', hint: 'This is higher than necessary — benefits plateau well below this.' },
          { text: '1.0g per pound body weight', hint: 'Close in imperial terms but not quite the precision-based recommendation.' },
        ],
        correctIndex: 1,
        explanation: 'The research consistently supports 1.6–2.4g/kg for people training regularly. In a caloric deficit, pushing toward 2.4–3.1g/kg helps preserve muscle mass by providing extra amino acids when some protein is used for energy.',
      },
      {
        question: 'What is Energy Availability (EA) and what level indicates RED-S risk?',
        options: [
          { text: 'Total daily calories — below 1500 kcal/day is risky', hint: 'EA is more specific than total calories.' },
          { text: '(Intake − Exercise EE) ÷ Lean Mass — below 30 kcal/kg LBM is risky', hint: 'Correct! EA measures calories available for bodily functions after accounting for exercise.' },
          { text: 'Protein × 4 ÷ body weight — below 1.0 is risky', hint: 'This is not how EA is calculated.' },
          { text: 'TDEE minus deficit — below 500 kcal deficit is risky', hint: 'The deficit size alone does not capture EA.' },
        ],
        correctIndex: 1,
        explanation: 'EA = (Energy Intake − Exercise Energy Expenditure) ÷ Lean Body Mass. Below 30 kcal/kg LBM indicates Relative Energy Deficiency in Sport (RED-S) risk — hormonal disruption, bone density loss, impaired recovery, and suppressed immune function.',
      },
    ],
  },

  // ── Recovery ──
  {
    id: 'b_sleep', category: 'recovery', contentType: 'article', unlockWeek: 0,
    title: 'Sleep: The Most Underrated Performance Tool',
    summary: 'No supplement can compensate for poor sleep. Here is what the research shows about sleep and adaptation.',
    readTime: '5 min', tag: 'Foundational', tagColor: 'var(--accent)',
    articleBody: `**Why Sleep Is Non-Negotiable**
Sleep is where adaptation actually happens. Training and nutrition are the stimulus — sleep is where the body responds. The majority of daily growth hormone secretion occurs during deep sleep, driving muscle protein synthesis, fat mobilisation, and tissue repair.

**What the Research Shows**
- Reducing sleep from 8 to 5.5 hours reduces muscle gain by ~60% on the same training programme
- Testosterone levels drop 10–15% after one week of sleeping 5 hours vs 8 hours
- Cortisol stays chronically elevated with poor sleep, blocking muscle growth and increasing fat storage
- Motor patterns practiced in training are consolidated during REM sleep

**Sleep Hygiene Protocol**
- Consistent wake time — the strongest anchor for your circadian rhythm
- Room temperature 18–19°C — optimal for deep sleep onset
- Blackout curtains — even small light levels disrupt melatonin production
- No screens 45 min before bed — blue light suppresses melatonin
- No caffeine after 2pm (half-life ~6 hours)
- Alcohol disrupts REM even in small amounts despite feeling sedating

**Target for Athletes**
7.5–9 hours per night during hard training blocks. In a heavy programme week, prioritise sleep over any other recovery method.`,
  },
  {
    id: 'b_recovery_methods', category: 'recovery', contentType: 'article', unlockWeek: 2,
    title: 'Active Recovery vs Passive Rest',
    summary: 'Not all recovery is equal — some methods accelerate adaptation, others just mask fatigue.',
    readTime: '4 min', tag: 'Practical', tagColor: 'var(--warn)',
    articleBody: `**The Recovery Toolkit**
From most to least impactful:
- Sleep (most important — not negotiable)
- Nutrition and hydration
- Light walking or movement
- Mobility and soft tissue work
- Cold water immersion (strategic use)
- Contrast therapy
- Low-intensity cardio (Zone 1–2)

**Active Recovery**
Low-intensity activity on rest days increases blood flow without imposing new training stress. This flushes metabolic waste and delivers nutrients to recovering tissue. Use on days after heavy sessions.

**Cold Water Immersion**
Reduces acute inflammation and perceived soreness — useful for rapid recovery between competition days. Caution: regular post-training CWI blunts long-term adaptations because inflammation is part of the growth signal. Use strategically, not after every session.

**The Key Principle**
Recovery methods should facilitate adaptation — not mask fatigue so you can push through. If your body is signalling rest, a massage before a training day is counterproductive. The goal is long-term adaptation, not short-term performance maintenance.`,
  },

  // ── Programming ──
  {
    id: 'b_periodisation', category: 'programming', contentType: 'article', unlockWeek: 4,
    title: 'Periodisation: Why Your Training Needs Structure',
    summary: 'Linear, undulating, block — the three models and how they apply to your programme phases.',
    readTime: '6 min', tag: 'Advanced', tagColor: 'var(--danger)',
    articleBody: `**Linear Periodisation**
Each phase progresses from high volume/low intensity to low volume/high intensity. Simple and effective for beginners but causes other fitness qualities to degrade while you focus on one.

**Undulating Periodisation (DUP)**
Changes the training stimulus more frequently — daily or weekly variation in rep ranges and loading. Maintains multiple fitness qualities simultaneously. More complex to programme.

**Block Periodisation (Poliquin Model)**
Three distinct blocks:
- Accumulation — High volume, moderate intensity. Build work capacity and muscle.
- Intensification — Lower volume, higher intensity. Convert volume adaptations to strength.
- Realisation — Low volume, maximal intensity. Express the strength built.

**Your Phases**
Your programme is built on a block model. Phase 1 is your corrective and accumulation phase — building movement quality and work capacity. Phase 2 intensification builds on what Phase 1 created. Do not rush Phase 1.

**The Deload**
Every 4–6 week block should be followed by a deload week at 50–60% normal volume. Supercompensation — the actual performance improvement — happens during this recovery, not during the hard work.`,
  },

  // ── Mindset ──
  {
    id: 'b_consistency', category: 'mindset', contentType: 'article', unlockWeek: 0,
    title: 'Consistency Beats Intensity: The Long Game',
    summary: 'The person who trains at 70% every week beats the person who goes all-in for a month and burns out.',
    readTime: '4 min', tag: 'Mindset', tagColor: '#60a5fa',
    articleBody: `**The Consistency Paradox**
The best programme is the one you actually do. A 7/10 programme followed consistently for 2 years produces dramatically better results than a 10/10 programme followed for 8 weeks. Adaptation is cumulative and time-dependent. You cannot rush it with more intensity — only sustain it with consistency.

**The 80% Rule**
Show up and do the work at 80% intensity, 80% of the time. On bad days — poor sleep, high stress, low energy — still show up and train at 70%. The session won't feel great. The numbers won't be there. That does not matter.

What matters is that you did not skip it. Because the habit of showing up is the foundation everything else is built on.

**Identity Before Outcomes**
The most durable motivation comes from identity, not goals. "I want to lose 10kg" ends when you reach it (or fail to). "I am someone who trains" does not end. Every session reinforces the identity. Every session skipped weakens it.

**The Non-Negotiable Rule**
Never miss twice. Miss a session? Fine — life happens. Miss two in a row? The habit is breaking. Whatever it takes, get the next one done. The streak does not have to be perfect — it just has to restart immediately.`,
  },

  // ── Hormones ──────────────────────────────────────────────────────────────

  {
    id: 'b_testosterone_foundation', category: 'hormones', contentType: 'article', unlockWeek: 0,
    title: 'Testosterone: Why It\'s the Foundation of Male Health',
    summary: 'Testosterone is far more than a sex hormone. Understanding what it does — and what happens when it\'s low — changes everything.',
    readTime: '6 min', tag: 'Foundations', tagColor: '#f472b6',
    articleBody: `**More Than Muscle**
Most people associate testosterone with muscle and libido. That's a tiny piece of the picture. Testosterone is the master regulator of male physiology — it governs energy metabolism, mood, cognition, cardiovascular health, bone density, insulin sensitivity, and recovery. When it's at optimal levels, everything works as it should. When it's not, the knock-on effects touch every system in the body.

**How Testosterone Is Made: The HPG Axis**
Your brain, specifically the hypothalamus, sends a signal down to the pituitary gland telling it to release two hormones: LH (Luteinising Hormone) and FSH (Follicle Stimulating Hormone). LH travels to the testicles and tells the Leydig cells to produce testosterone. This entire signalling chain is called the HPG axis — hypothalamus, pituitary, gonads.

It works like a thermostat. When testosterone levels are high enough, the brain senses it and dials back the signal. When levels drop, the signal increases. This feedback loop is elegant when it works, and the source of the problem when it doesn't.

**The Decline Is Real — and It's Getting Worse**
Testosterone reference ranges have fallen significantly over the last two decades. What was considered "mid-range" ten years ago would be flagged as low today by most lab standards. This isn't good news — it means population averages are declining, and reference ranges are being recalculated to reflect a sicker population, not an optimal one.

The takeaway: being "within range" on a blood test does not mean your testosterone is optimal. It means you're not in the bottom percentage of an increasingly compromised population.

**What Optimal Actually Looks Like**
Optimal testosterone isn't a number — it's a feeling. It's waking up with energy, recovering well from training, maintaining a healthy sex drive, thinking clearly under pressure, and feeling emotionally steady. When those things are absent consistently, it's worth investigating why — and testosterone is one of the first places to look.

**The Bottom Line**
Testosterone is foundational. It's not a shortcut, it's not a performance enhancer for those who don't need it — it's a fundamental biological requirement for male health. Understanding how it works is the first step to understanding your own body.`,
  },

  {
    id: 'b_low_t_symptoms', category: 'hormones', contentType: 'article', unlockWeek: 0,
    title: 'Recognising Low Testosterone: The Full Picture',
    summary: 'Low T doesn\'t just mean low libido. The symptom profile is broader, more subtle, and more damaging than most men realise.',
    readTime: '5 min', tag: 'Symptoms', tagColor: '#f472b6',
    articleBody: `**Why Symptoms Get Missed**
Low testosterone rarely announces itself clearly. It tends to creep in gradually — the slow erosion of drive, recovery, and vitality over months or years. By the time most men seek help, they've often been living with it for a long time without connecting the dots.

The most common symptoms I see in clinical practice are depression and low mood, anxiety, erectile dysfunction or reduced sexual desire, persistent fatigue, and poor recovery from training. But the list extends well beyond these five.

**The Broader Symptom Profile**
- Feeling emotionally flat — little enjoyment from things that used to matter
- Low stress threshold — easily overwhelmed by things that didn't used to phase you
- Poor sleep despite being tired — waking during the night and lying there
- Taking days to physically recover from a training session
- No matter how hard you train or how well you eat, muscle won't come
- Brain fog — reduced sharpness, poor concentration
- Loss of competitive drive or masculine identity
- Reduced morning erections or complete absence

**The Physical Consequences Over Time**
If left unaddressed, chronically low testosterone contributes to muscle loss, increased visceral fat, worsening insulin resistance, and reduced bone density. These aren't just quality-of-life issues — they're long-term health risks.

**When Low T Affects Development**
For younger men who haven't had optimal testosterone during their late teens and early twenties, the effects go deeper. Testosterone during those years drives not just physical development — muscle building capacity, posture, metabolic function — but also psychological development: confidence, stress resilience, and the ability to engage socially without anxiety.

**Low T Can Be a Symptom Too**
It's important to understand that low testosterone can be both a cause and a consequence. Obesity, chronic stress, poor sleep, and unresolved health conditions can all suppress testosterone production. This means the most important first step is always a thorough assessment — not just of your hormones, but of the broader picture.

**The Pattern I See Most**
The thing that most often brings men to seek help — beyond sexual issues — is being completely wiped out after training. Two or three days of fatigue after a session that should feel manageable. That's usually the moment men realise this isn't just in their heads, and something is genuinely wrong.`,
  },

  {
    id: 'b_hormone_bloodwork', category: 'hormones', contentType: 'article', unlockWeek: 1,
    title: 'Your Hormone Blood Work Decoded',
    summary: 'A guide to the markers that actually matter — and why most standard panels miss the full picture.',
    readTime: '8 min', tag: 'Blood Work', tagColor: '#f472b6',
    articleBody: `**Why Standard Blood Tests Often Fall Short**
When most GPs order a testosterone test, they check one number — total testosterone — and compare it to a reference range that gets recalculated every few years to reflect a declining population. This tells you almost nothing useful. A thorough hormone assessment requires context: multiple markers, their relationship to each other, and an understanding of what they mean for how you actually feel.

Here's what to know about the key markers.

**Total Testosterone**
This tells you the total amount of testosterone circulating in your blood. It's useful as a starting point but incomplete on its own, because the majority of testosterone in circulation is bound to proteins and not biologically active. Reference ranges vary significantly between labs and have been dropping steadily. Being "in range" is not the same as being optimal.

**Free Testosterone**
This is the biologically active fraction — the testosterone that's actually available to exert its effects on your tissues. Free testosterone is far more closely correlated with how you feel than total testosterone. It's the primary target when optimising hormone levels. A man can have a "normal" total testosterone but low free testosterone and still experience every symptom of deficiency.

**SHBG (Sex Hormone Binding Globulin)**
SHBG is a protein that binds to testosterone and reduces how much is free and available. High SHBG means more of your total testosterone is bound up and inactive. SHBG tends to rise with age and can be elevated by extended periods of ketogenic eating. Low SHBG, on the other hand, can be a sign of insulin resistance or thyroid issues — it's a signal worth investigating, not fixing in isolation.

**Estradiol**
Yes, men need estrogen. Estradiol is essential for bone health, cardiovascular function, mood, and sexual health. The goal isn't to suppress it — it's to keep it in an appropriate balance relative to testosterone. Very low estradiol causes joint pain, poor cognitive function, and low libido just as low testosterone does. The obsession with "crashing estrogen" that you'll find in online forums is largely misguided.

**Prolactin**
Prolactin is primarily known as a lactation hormone, but in men it plays an important role in reproductive health. Elevated prolactin suppresses the HPG axis, reducing testosterone. Mild elevations can result from chronic stress, poor sleep, or hypothyroidism. Significantly elevated prolactin — well above the top of range — warrants an MRI to rule out a benign pituitary growth called a prolactinoma.

**DHEA**
DHEA is a precursor hormone produced largely by the adrenal glands and is important for mood, libido, metabolism, and immune function. Low DHEA shares many symptoms with low testosterone and is often part of the same deficiency picture. It's frequently overlooked but worth measuring and addressing.

**Thyroid (TSH, Free T3, Free T4)**
Thyroid function and testosterone are deeply interconnected. An underactive thyroid is one of the most common reasons TRT doesn't work as expected. Testing TSH alone is inadequate — a full panel including Free T3 and Free T4 is needed to properly assess thyroid function. T3 is the primary active hormone governing energy metabolism. An unaddressed thyroid issue can undermine everything else.

**Supporting Markers**
- **CRP** — An inflammation marker. Chronic inflammation suppresses testosterone production and impairs recovery.
- **Fasting Insulin / HbA1c** — Insulin resistance is a major driver of low testosterone and poor hormonal health overall.
- **Liver Enzymes** — The liver metabolises hormones. Poor liver health compromises both natural testosterone production and how well the body handles TRT.
- **Vitamin D** — A proxy for sun exposure and a critical co-factor in the endocrine system.
- **Full Blood Count** — Anaemia mimics low testosterone symptoms and should always be ruled out.

**The Key Takeaway**
Blood work is a tool, not a verdict. Numbers only make sense in context — alongside your symptoms, lifestyle, and the full panel. One number in isolation tells you almost nothing. The whole picture tells you everything.`,
  },

  {
    id: 'b_trt_basics', category: 'hormones', contentType: 'article', unlockWeek: 1,
    title: 'TRT: What It Is, and Whether It\'s Right for You',
    summary: 'Testosterone Replacement Therapy explained honestly — who it helps, who should wait, and why it\'s not a decision to take lightly.',
    readTime: '7 min', tag: 'TRT Basics', tagColor: '#f472b6',
    articleBody: `**What TRT Actually Does**
Testosterone Replacement Therapy replaces your body's own testosterone production with an external source. When your brain detects that testosterone is being supplied from outside, it dials back the internal signal — this is the HPG axis shutting down, which we covered in a previous module. Your testicles stop producing testosterone and go dormant. You are now dependent on exogenous testosterone to maintain your levels.

This is a significant and ongoing intervention. It's not a supplement. It's not something you cycle on and off. It's a medical treatment that, for the right person with a genuine deficiency, can be genuinely life-changing. For the wrong person, it creates new problems without solving the original ones.

**Primary Hypogonadism: Clear-Cut**
Primary hypogonadism means the testicles themselves are failing to produce adequate testosterone. The pituitary is doing its job — LH is elevated, the signal is being sent — but the hardware can't respond. This can result from age-related testicular decline, injury, illness, or other factors.

If you have elevated LH with low testosterone, your body has already maxed out its own production. The only path forward is replacement. This is the clearest indication for TRT.

**Secondary Hypogonadism: More Complex**
Secondary hypogonadism means the pituitary isn't signalling the testicles properly. LH is low or suppressed, and as a result, testosterone is low. The hardware is potentially fine — the problem is upstream.

Common causes include: chronic stress, obesity, significant caloric restriction, heavy alcohol use, history of anabolic steroid use, head injuries, PTSD, and auto-immune conditions. When the body is under chronic stress, it prioritises survival over reproductive function. Testosterone production gets downregulated as a result.

In these cases, the right first question is always: can the root cause be addressed? If the answer is yes and the intervention is realistic, that should come first. But many of these states don't fully reverse even when the root cause is resolved — and some people simply cannot address the root cause without improving their hormonal environment first. This is why secondary hypogonadism requires careful individual assessment, not a blanket protocol.

**The Question I Always Ask**
Before recommending TRT for anyone with secondary hypogonadism, I want to know: are you doing everything within your control? Are you eating to support your health, training consistently, sleeping adequately, managing your stress load, getting sunlight, and not suppressing your system with alcohol or other substances?

If the answer is genuinely yes, and levels are still suboptimal and symptoms are present — then the conversation about TRT is worth having.

**TRT Will Not Fix What It Didn't Cause**
This is perhaps the most important thing to understand. Testosterone will make most men feel better because most men have suboptimal testosterone. But if your primary problems are anxiety from an unresolved trauma, depression from a life situation that needs changing, or fatigue from sleep apnoea — testosterone will not fix those things. It is not a panacea, and approaching it as one is a recipe for disappointment.

**Working with the Right Practitioner**
TRT is a medical intervention that requires proper supervision, comprehensive blood work, and an informed provider who understands the full endocrine picture — not just a practitioner who will put you on a standard protocol and adjust the dose based on your total testosterone alone. The practitioner relationship matters as much as the protocol.`,
  },

  {
    id: 'b_trt_administration', category: 'hormones', contentType: 'article', unlockWeek: 2,
    title: 'TRT Administration: Why How You Take It Matters',
    summary: 'The delivery method and frequency of TRT are just as important as the dose. Most men start on sub-optimal protocols.',
    readTime: '6 min', tag: 'Protocol', tagColor: '#f472b6',
    articleBody: `**Not All Methods Are Equal**
The route of administration for testosterone significantly affects how stable your levels are, how you feel day to day, and how manageable the therapy is long-term. Some methods simply don't work well for most people — and unfortunately, they're often the ones prescribed first.

**What Doesn't Work Well**

*Pellets* are implanted under the skin and release testosterone slowly over months. In theory this sounds convenient. In practice: the dose is difficult to adjust, infection risk exists, and levels are often suboptimal — particularly as the pellets approach the end of their release period. Useful for livestock. Not ideal for men.

*Standard gels and patches* suffer from poor and inconsistent absorption, and the low concentrations available mean you can't reach optimal levels without impractical amounts. Patches often cause skin reactions. Transference to partners and children is a genuine concern with gels.

*Long-acting injectable undecanoate (Nebido/Reandron)* promises four injections per year. The half-life simply doesn't support this frequency. Most men end up severely deficient before each injection is due, experiencing the highs of the first week and then dropping back to where they started — or lower. It can be used more frequently than prescribed, but that defeats the convenience selling point and is rarely done in practice.

**What Works: Testosterone Cypionate and Enanthate**
These are currently the gold standard for TRT. They're widely available, well-studied, and have a moderate half-life that makes dosing manageable. The key principle is frequent, smaller injections rather than large infrequent ones.

**Why Frequency Matters: Understanding Half-Life**
Testosterone cypionate and enanthate have a half-life of approximately 4–5 days in practice. Standard medical guidelines often recommend one injection every two to three weeks — but this creates a significant problem.

The half-life doesn't mean the testosterone is evenly distributed over that period. It means it's being cleared progressively from the moment you inject. Most men feel a noticeable spike in the first day or two, then a gradual decline, dropping back toward deficient levels well before the next injection is due. This creates a hormonal rollercoaster — mood swings, energy crashes, and inconsistent response.

Twice-weekly injections are the minimum effective frequency for stable levels. Many men do better on every-other-day or even daily small doses. More frequent injections mean smaller peaks and shallower troughs, and far more stable levels day to day.

**Compounded Testosterone Cream**
A high-concentration compounded cream (typically 20%+) applied to scrotal skin can be an effective alternative to injections for those who can't or won't inject. The scrotal skin has high 5-alpha reductase activity, which means this route of administration produces more DHT relative to estradiol — a characteristic that some men respond very well to. It requires daily application and careful monitoring but is a legitimate option in the right hands.

**The Takeaway**
The best TRT protocol is the one that keeps your levels stable, matches your lifestyle, and is something you'll actually follow consistently. Frequent smaller doses beat infrequent large ones. Work with your provider to find the frequency and delivery method that suits you — and don't accept "one injection every two weeks" as the only option.`,
  },

  {
    id: 'b_dialling_in', category: 'hormones', contentType: 'article', unlockWeek: 2,
    title: 'Dialling In: Getting Your Levels Right',
    summary: 'Starting TRT is the easy part. Finding the right dose and protocol for your individual biology takes time, patience, and the right markers.',
    readTime: '6 min', tag: 'Optimisation', tagColor: '#f472b6',
    articleBody: `**The First 3 Months**
The initial phase of TRT is about establishing a stable baseline — not chasing optimal levels. Hormone receptors need time to upregulate in response to testosterone. The body needs time to adapt. Most men experience meaningful improvements within 6–12 weeks, but the full picture of how you're responding won't be clear until you've been consistent for at least 3 months.

Resist the urge to adjust the dose every few weeks based on how you feel day to day. Hormones fluctuate. Stress, sleep, nutrition, and training all influence how you feel on any given day. Give the protocol time to stabilise before drawing conclusions.

**What to Optimise For**
The primary target is free testosterone — the bioavailable fraction that actually drives your symptom resolution. Total testosterone matters, but free testosterone is what's most closely correlated with how you feel. The goal is to find the dose that gets your free testosterone into a range where symptoms resolve, without pushing levels so high that side effects emerge.

There is no universal "optimal dose." Individual variation is enormous. Some men feel excellent at a relatively modest dose. Others need significantly more to hit the same effect. Genetics, androgen receptor sensitivity, conversion to other hormones, and SHBG all play a role.

**Monitoring Estradiol**
As testosterone rises, some of it will convert to estradiol via an enzyme called aromatase. This is normal and necessary — estradiol is not the enemy. The goal is not to suppress it but to keep it in an appropriate balance. Too low and you'll experience joint pain, low mood, and poor libido. Too high and you may experience water retention, emotional sensitivity, or sleep disruption.

In most men, estradiol manages itself when the testosterone dose is appropriate. It rarely needs to be aggressively managed, particularly early in therapy.

**Blood Work Timing**
Test your levels at trough — meaning at the lowest point before your next injection. This gives you a consistent, reproducible measurement. Testing at peak (immediately after injection) tells you your maximum but not your stable baseline, and makes it difficult to compare results over time.

After any dose change, wait at least 6 weeks before re-testing. Hormones don't stabilise overnight, and testing too early gives you an inaccurate picture.

**Patience Is the Protocol**
The biggest mistake men make on TRT is chasing optimal too quickly. Dose changes, adding ancillaries, switching delivery methods — all before the previous change has had time to work. Each change resets your ability to assess what's working.

The process is: stabilise, assess, adjust, stabilise again. It takes time. It requires patience. But men who follow this approach consistently get the best long-term outcomes.

**When Symptoms Persist Despite Good Levels**
If your levels look good on paper but you still don't feel right, there are other areas to investigate — thyroid function, DHEA levels, sleep quality, iron status, or other hormonal markers that may be contributing. TRT will not resolve problems it didn't cause. A thorough practitioner will look beyond the testosterone panel when symptoms persist.`,
  },

  {
    id: 'b_beyond_testosterone', category: 'hormones', contentType: 'article', unlockWeek: 3,
    title: 'Beyond Testosterone: The Supporting Cast',
    summary: 'For some men, testosterone is only part of the answer. DHEA, Pregnenolone, and Thyroid are the hormones most often left unaddressed.',
    readTime: '7 min', tag: 'Advanced', tagColor: '#f472b6',
    articleBody: `**The Car Analogy**
Fixing the engine doesn't fix the whole car. Testosterone is a major component of male hormonal health — but it's one component in a complex system. Many men start TRT and feel dramatically better. Others improve but hit a ceiling they can't get past. For this second group, the answer usually lies in the hormones that work alongside testosterone, not in adjusting the testosterone itself.

**The Hormonal Hierarchy**
All steroid hormones share a common origin — they're made from cholesterol via a series of enzymatic conversions. At the top of this pathway is pregnenolone, often called the "mother hormone" because it can convert into multiple downstream hormones depending on what the body needs. Below pregnenolone sits DHEA, which then feeds into testosterone, estrogen, and other androgens.

Understanding this hierarchy helps explain why some men feel incomplete on testosterone alone.

**Pregnenolone**
Pregnenolone is produced primarily in the adrenal glands and brain. It's critical for cognitive function, mood regulation, and neurological health. A deficiency can cause anxiety, depression, memory problems, and anhedonia (the inability to feel pleasure) — symptoms that look almost identical to low testosterone but that testosterone alone cannot resolve.

Pregnenolone deficiency is more common in men with a history of head injuries, PTSD, or prolonged periods of severe stress. If these factors are present and symptoms persist despite optimised testosterone, pregnenolone is worth investigating.

**DHEA**
DHEA is produced mainly in the adrenal glands and acts on both androgen and oestrogen receptors. It plays an important role in libido, mood, metabolic function, and immune health. Deficiency symptoms include reduced penile sensitivity, delayed orgasm, low mood, and poor energy — all of which overlap significantly with low testosterone.

DHEA levels decline with age and can be low even in younger men under chronic physiological stress. Testing DHEA-S (the sulphate form) gives you a stable, reliable measurement. If levels are consistently low, supplementation under guidance can make a meaningful difference to how you feel.

**Thyroid**
Thyroid function is one of the most commonly overlooked contributors to poor outcomes on TRT. The thyroid governs energy metabolism at a cellular level — when it's underperforming, everything feels sluggish regardless of testosterone levels.

The problem is that most practitioners check only TSH to assess thyroid. A low or normal TSH doesn't confirm optimal thyroid function — you need Free T3 and Free T4 to get the full picture. T3 is the primary active hormone; T4 is largely a storage form that converts to T3 in peripheral tissue. If this conversion is impaired, or if production is simply insufficient, no amount of testosterone optimisation will fully resolve energy and mood symptoms.

For men who are on TRT and still not feeling right — particularly around energy, body temperature, and recovery — thyroid assessment is one of the first places I look.

**Why These Aren't Add-Ons**
These hormones aren't optional extras or upgrades to stack on top of TRT. For men with genuine deficiencies, they're essential. Chasing an optimal testosterone dose when the thyroid is underactive or DHEA is depleted is like trying to fine-tune an engine while the fuel system is compromised.

**The Principle**
Address what's deficient. Measure, don't guess. And understand that hormonal health is a system — optimising one part while ignoring others gives you partial results at best.`,
  },

  // ── Women's Health ────────────────────────────────────────────────────────

  {
    id: 'b_womens_cycle', category: 'womens-health', contentType: 'article', unlockWeek: 0,
    title: 'Your Cycle Is Not a Liability — It\'s Information',
    summary: 'The two phases of the menstrual cycle create completely different physiological environments. Understanding both changes how you train and eat.',
    readTime: '7 min', tag: 'Foundations', tagColor: '#f472b6',
    articleBody: `**Women Are Not Small Men**
The fitness industry has been built largely on research done on men, applied to everyone. The result is that most coaching frameworks, most programmes, and most nutrition advice was built for a male hormonal environment. Men are essentially the same every day. Women are not — and that is actually an advantage once you understand it.

During the menstrual cycle, a woman's insulin sensitivity, fuel preference, metabolic rate, hunger, strength, coordination, body weight, and injury risk all shift. Knowing where you are in your cycle is information you can use.

**The Follicular Phase (Days 1–14 approx)**
The first half of your cycle is dominated by estrogen. Estrogen is genuinely performance-friendly. It improves insulin sensitivity, promotes fat burning during exercise, supports muscle repair, reduces inflammation after hard sessions, and directly supports muscle remodelling. This is where women tend to make their best strength and hypertrophy gains.

Key characteristics of this phase:
- Better insulin sensitivity — carbohydrates are handled well
- Lower baseline hunger — closer to your natural set point
- Faster muscle repair between sessions
- Better coordination and power output
- Lower injury risk (until the pre-ovulation estrogen spike)

This is the phase to push your hardest sessions. If you are going to attempt a personal best, add volume, or push intensity, do it here.

**The Luteal Phase (Days 15–28 approx)**
The second half is dominated by progesterone. Progesterone raises your resting core temperature by about half a degree (increasing perceived effort), drives insulin resistance, activates fat-storage enzymes in the lower body, and drives hunger up by 90 to 500 calories per day above your baseline.

Key characteristics of this phase:
- Elevated resting core temperature — training feels harder
- Insulin resistance — muscles less efficient at using carbohydrates
- Hunger significantly elevated — 90 to 500 kcal/day above normal
- Body weight may increase 2–5 kg from water retention
- Coordination and performance often dip mid-to-late luteal phase
- Injury risk increases slightly due to hormonal effects on connective tissue

The goal in the luteal phase is to maintain — not progress. Keeping intensity reasonable, managing volume, and accepting that some sessions will feel harder than they should is not failure. It is smart training.

**What to Do With This**
You do not need to track your hormones with blood draws to use your cycle intelligently. Start with a cycle tracking app and notice the pattern. Most women find the shift between phases becomes obvious once they start paying attention. Use that information to adjust your training expectations and nutrition strategy rather than fighting your physiology for two weeks out of every four.`,
  },

  {
    id: 'b_womens_fat', category: 'womens-health', contentType: 'article', unlockWeek: 0,
    title: 'Why Lower Body Fat Is Not a Willpower Problem',
    summary: 'The physiology of stubborn lower body fat — why it resists the same approaches that work for upper body fat, and what can actually shift it.',
    readTime: '5 min', tag: 'Body Composition', tagColor: '#f472b6',
    articleBody: `**It Is Designed to Be Stubborn**
The most common frustration I hear from female clients is that lower body fat — hips, thighs, glutes — simply does not respond the way the rest of their body does. Diet is consistent. Training is consistent. Upper body leans out. Lower body stays put. This is not a willpower problem. It is a physiological one.

**The Receptor Ratio**
Fat cells in different parts of the body have different ratios of two key receptors. Beta-2 receptors promote fat release when activated by adrenaline and similar hormones. Alpha-2 receptors do the opposite — they actively block fat release.

Lower body fat in women has a much higher ratio of alpha-2 to beta-2 receptors than upper body or visceral fat. This means that when your body's natural fat-mobilising hormones are circulating — during exercise, fasting, or a caloric deficit — those signals are being actively blocked in the lower body areas. The same stimulus that successfully mobilises fat from your upper body is turned away at the door of your hips and thighs.

**The Hormonal Layer**
Estrogen directly amplifies this effect. It upregulates the alpha-2 receptors in lower body fat tissue and activates specific fat-storage enzymes (particularly lipoprotein lipase) in those same areas. Progesterone adds another layer in the luteal phase, further promoting storage.

This is an evolutionary feature, not a defect. Lower body fat is a long-term caloric reserve for pregnancy and lactation — and the female endocrine system actively protects it.

**What This Means in Practice**
Stubborn lower body fat does not respond well to moderate deficits and moderate exercise. The approaches that help mobilise it more effectively include:
- Extended fasted or low-insulin states (the alpha-2 receptors are less active when insulin is very low)
- Higher-intensity exercise that drives significant catecholamine release
- Patience — lower body fat is almost always the last to go
- Maintaining or building muscle in the lower body to improve the ratio of muscle to fat in that region

Understanding the physiology stops the self-blame and redirects energy toward approaches that can actually work. Lower body fat will shift — it just responds to a different stimulus, and on a longer timeline.`,
  },

  {
    id: 'b_birth_control', category: 'womens-health', contentType: 'article', unlockWeek: 0,
    title: 'Birth Control and Athletic Performance',
    summary: 'What hormonal birth control actually does to the physiology that drives training — and which options are least disruptive.',
    readTime: '8 min', tag: 'Hormones', tagColor: '#f472b6',
    articleBody: `**The Gap Nobody Closes**
Gynaecologists are not exercise physiologists. Coaches are not gynaecologists. The result is that millions of active women are making decisions about their birth control without anyone connecting the dots to their training.

This is not an argument against birth control. It is an argument for having the right information so you can make an informed choice.

**How Hormonal Birth Control Works**
Almost all hormonal birth control works through feedback inhibition. By supplying synthetic hormones, it signals the brain that hormone levels are already sufficient. The brain responds by reducing its own output — natural estrogen and progesterone drop significantly as a result.

The critical secondary consequence is what happens to testosterone. Combined oral contraceptives reduce total and free testosterone by around 50% on average through two mechanisms: cutting production directly, and raising SHBG (a binding protein that grabs free testosterone and makes it unavailable to your muscles and tissues).

Less free testosterone means a weaker anabolic signal, lower training drive, and for some women, reduced libido.

**Not All Birth Control Is Equal**
The type matters enormously.

*Depo-Provera (injection)* — Worst body composition effects of any method. One long-term study found an average of 11 pounds of weight gain over 3 years, 9 of which were fat. Also has the worst effects on bone mineral density. Not recommended for active women who care about performance.

*Triphasic pill* — Varies hormone dose across three phases, including a high-progestin third week. Multiple studies link triphasic pills to reduced VO2 max, fat gain, and performance impairment specifically during week 3. Avoid if performance matters.

*4th generation progestin pill (e.g. Yaz, Yasmin)* — Anti-androgenic. Actively blocks the androgen receptor. Good for acne and water retention; potentially the worst option for women prioritising muscle and strength gains.

*Monophasic pill (2nd or 3rd gen)* — Maintains consistent hormone levels throughout the cycle. Third generation progestins (especially norgestimate) show the least impact on aerobic capacity in the research. A considerably better option than triphasic if you want an oral pill.

*Hormonal IUD (Mirena, Kyleena, etc.)* — The standout option for active women. Its effects are almost entirely local to the uterus. It does not raise SHBG, does not reduce testosterone, does not affect VO2 max or training adaptations. From a performance standpoint, it is the best option available.

**The Practical Framework**
If performance and body composition are priorities and you have flexibility in your choice, the hormonal IUD is the clear front-runner. If you want an oral pill, ask your doctor specifically about monophasic vs triphasic. If your training has gone backwards since starting or changing birth control, a hormone panel is worth investigating — not necessarily to come off it, but to understand the environment you are working in.`,
  },

  {
    id: 'b_energy_availability', category: 'womens-health', contentType: 'article', unlockWeek: 0,
    title: 'Energy Availability: The Number That Runs Everything',
    summary: 'The most important concept in female athletic health — and the one most women have never heard of.',
    readTime: '6 min', tag: 'Health', tagColor: '#f472b6',
    articleBody: `**What Is Energy Availability?**
Energy Availability (EA) is the amount of dietary energy left over for all normal bodily functions after accounting for the energy cost of your exercise. It is calculated as:

EA = (Daily Calorie Intake − Exercise Energy Expenditure) ÷ Lean Body Mass

The unit is calories per kilogram of lean body mass per day (kcal/kg LBM/day). This is what your coach uses to ensure your plan is sustainable — not just whether you are in a caloric deficit, but whether the deficit is one your body can actually function within.

**The Critical Threshold**
The research is clear on the threshold: 30 kcal/kg LBM/day.

Drop consistently below this level and the body begins shutting down non-essential systems to conserve energy. The menstrual cycle is one of the first things to go.

- EA ≥ 45 kcal/kg LBM — Optimal for health and performance
- EA 30–44 — Low; recovery and hormonal function are impaired
- EA < 30 — RED-S risk (Relative Energy Deficiency in Sport)

**Why Losing Your Period Is Not Normal**
Amenorrhea — the loss of the menstrual cycle — is driven by chronically low energy availability, not by low body fat percentage. Women with normal body fat levels can lose their periods if they are training hard enough and not eating enough to cover it.

This happens far more commonly than most people realise, and it is frequently dismissed as a normal adaptation to hard training. It is not. It is a warning signal that the body does not have enough energy to keep functioning normally.

**The Long-Term Consequences**
The estrogen drop that accompanies amenorrhea directly accelerates bone density loss. Studies have found amenorrheic athletes can have the bone density of women 20 to 30 years older than their chronological age. This is a structural problem that does not bounce back quickly when eating resumes.

Critically: going on hormonal birth control does not fix this. Birth control can restore the appearance of a cycle, but it does not restore the estrogen levels that protect bone when the underlying energy deficit is still present.

**Warning Signs to Watch**
- Irregular or absent periods
- Stress fractures or recurrent bone injuries
- Persistent fatigue that does not resolve with rest
- Difficulty maintaining or building muscle despite training
- Recurrent illness — suppressed immune function
- Mood changes including increased irritability and poor concentration

**How to Fix Low Energy Availability**
The protocol is straightforward: add approximately 250 to 360 calories per day to your current intake AND reduce training by one session per week. It sounds counterintuitive when the goal is fat loss. But a body in hormonal distress is not going to produce results — and the health consequences of ignoring this are too significant to push through.

If you have any of the warning signs above, raise it with your coach immediately.`,
  },

  {
    id: 'b_womens_stress', category: 'womens-health', contentType: 'article', unlockWeek: 1,
    title: 'Stress, Cortisol, and Why Women Are More Affected',
    summary: 'The hormonal reality of chronic stress for female athletes — and why it has to be managed as a training variable, not a lifestyle issue.',
    readTime: '5 min', tag: 'Recovery', tagColor: '#f472b6',
    articleBody: `**Stress Is a Training Variable**
Most coaches treat psychological stress as a lifestyle issue, separate from training. It is not. Stress directly affects the hormonal environment that determines how your training produces results — and this effect is more pronounced in women than in men.

**The Gender Difference in Cortisol**
Women and men respond to the same stressor differently at the hormonal level. Women tend to release cortisol more rapidly, reach higher peak cortisol levels, and clear cortisol from circulation more slowly than men. The practical consequence: women are more susceptible to the chronic cortisol elevation that builds up from persistent life or training stress, and the downstream effects are more pronounced.

**What Chronic High Cortisol Does**

*Water retention:* Cortisol causes the kidneys to retain sodium and water. This shows up as persistent puffiness that does not respond to diet changes and can mask fat loss entirely on the scale for weeks at a time.

*Insulin resistance:* Cortisol antagonises insulin, increasing blood glucose and making fat storage more likely — particularly in the abdomen.

*Hormonal disruption:* High cortisol suppresses GnRH, the signalling hormone that drives the menstrual cycle. This can disrupt or stop periods even when energy availability is otherwise adequate.

*Muscle breakdown:* Cortisol is catabolic. Chronic elevation increases protein breakdown and limits muscle building even when training and nutrition are otherwise in order.

*Sleep disruption:* Elevated evening cortisol disrupts sleep quality, which then further elevates the next day's cortisol. A self-reinforcing cycle.

**Recognising the Pattern**
If you are doing everything right on paper but progress has stalled — and you are also sleeping poorly, feeling persistently irritable, carrying unusual water retention, and your cycle has gone irregular — this is not a calorie tracking problem. This is a cortisol problem.

The combined effect of high training stress plus high life stress plus a caloric deficit can push the body into a state where fat loss effectively stops despite a deficit that looks correct on paper. The body is in perceived emergency mode and has deprioritised everything except survival.

**What to Do**
Managing stress means treating it with the same seriousness as training load. When life stress is genuinely high:
- Reduce training volume rather than pushing through
- Prioritise sleep above any other recovery method
- Eat at or closer to maintenance to reduce the total physiological load
- Address the source of the stress where possible

The version of you that trains at 85% but sleeps well, manages stress, and maintains a healthy cycle will consistently outperform the version running on cortisol and willpower. Every time.`,
  },

  {
    id: 'b_dieter_categories', category: 'womens-health', contentType: 'article', unlockWeek: 0,
    title: 'The 3-Category Dieter Framework: Which One Are You?',
    summary: 'Your body fat percentage determines how aggressively you can diet, how fast you can lose fat, and what risks you face. This framework changes everything about how dieting should be approached.',
    readTime: '7 min', tag: 'Framework', tagColor: '#f472b6',
    articleBody: `**Why Your Body Fat Percentage Changes Everything**
Most dieting advice treats all women the same. Eat less, move more, lose fat. The problem with that approach is that a woman at 14% body fat and a woman at 34% body fat are in completely different physiological situations. The rules that work brilliantly for one will fail the other — sometimes seriously.

The 3-Category Dieter Framework, developed through Lyle McDonald's extensive work with female physiology, acknowledges what most coaches ignore: how much fat you're carrying determines how aggressively you can diet, how fast you can safely lose, and what happens to your hormones when you don't respect those limits.

**The Three Categories**

**Category 3 — Higher Body Fat (typically >27–28% BF)**
Category 3 women are typically just starting their fitness journey, returning after a long break, or primarily focused on health and general fat loss rather than physique performance. Body fat stores are substantial, which is actually an advantage for dieting: the body has plenty of stored energy to draw on, hormonal disruption from dieting is uncommon, and larger caloric deficits are tolerated well.

The body simply doesn't panic when a Category 3 dieter eats less. Fat is available in abundance. The physiological systems responsible for reproduction and metabolism are not threatened by a moderate deficit. This is why general weight-loss advice (eat 500 kcal less per day, lose about 0.5 kg per week) tends to work reasonably well for this group.

**Category 2 — Moderate Body Fat (typically 20–27% BF)**
Category 2 is the most common position for a recreational exerciser or intermediate fitness enthusiast. There's meaningful fat to lose, but the body is starting to become more conservative with its reserves. Deficits can still be moderate — around 300 to 500 kcal per day — and the rate of fat loss can be maintained at roughly 0.5 to 1% of body weight per week without serious hormonal consequences.

This is the sweet spot. The body will still release fat readily, hormonal systems are largely robust, and consistent training produces clear results. Most 8–16 week physique and fat-loss programmes are designed with Category 2 physiology in mind.

**Category 1 — Very Lean (typically <17–18% BF for females)**
Category 1 is where the rules change dramatically. These are athletes, competitive physique athletes, or women who are already genuinely lean and are trying to get leaner still. The body's fat stores are low enough that it begins treating any significant caloric deficit as a threat to survival.

At low body fat levels, the body shifts from readily burning stored fat to protecting it. Hormonal systems start to shut down. The menstrual cycle — energetically expensive and reproductively non-essential during a perceived famine — is one of the first casualties. Performance degrades. Muscle is increasingly at risk.

Category 1 women cannot diet the way a Category 3 woman does. Doing so causes hormonal disruption, muscle loss, and the clinical syndrome known as RED-S. The rules here are fundamentally different.

**How to Determine Your Category**
Body fat percentage is the starting point. Use skinfold calipers, DEXA, or if those aren't available, the Naval body fat calculation from the coach tools section gives a reasonable estimate.

As a general guide:
- Above ~27–28% BF: Category 3
- Approximately 20–27% BF: Category 2
- Below ~17–18% BF: Category 1

These ranges are approximate and shift slightly based on athletic history, muscularity, and individual hormonal sensitivity. A woman who has been lean and athletic for years may show Category 1 responses at slightly higher body fat percentages than a woman who recently lost a large amount of weight.

**Why This Matters Practically**
Getting the category wrong in either direction causes problems.

A Category 3 woman using a Category 1 approach — tiny deficits, aggressive diet breaks, very slow rate of loss — will make unnecessarily slow progress. She has the physiological headroom to push harder.

A Category 1 woman using a Category 3 approach — large deficit, aggressive weekly rate of loss, no regard for hormonal consequences — will lose muscle, disrupt her menstrual cycle, suppress her training performance, and potentially cause long-term health damage. Her body simply does not have the fat reserves to support that kind of deficit.

The framework isn't about making dieting harder or easier. It's about matching the approach to the actual physiology.`,
  },

  {
    id: 'b_category_1', category: 'womens-health', contentType: 'article', unlockWeek: 0,
    title: 'Category 1: Dieting at Low Body Fat',
    summary: 'Lean women face a completely different set of physiological rules when dieting. Understand the constraints, the risks, and the specific strategies that work at low body fat.',
    readTime: '8 min', tag: 'Advanced', tagColor: '#f472b6',
    articleBody: `**Who Is a Category 1 Dieter?**
A Category 1 dieter is a woman who is already genuinely lean — typically below 17–18% body fat — and who is looking to reduce further. This includes competitive physique athletes in the weeks before a show, high-level sportswomen trying to make weight or hit a performance target, and recreational athletes who are already lean and chasing the final few percent of fat loss.

This is physiologically the most demanding type of dieting. Not because it requires more willpower, but because the body genuinely resists it.

**Why the Body Fights Back at Low Body Fat**
At higher body fat levels, adipose tissue releases fat relatively readily in response to a caloric deficit. The body treats its fat stores as a large, accessible reserve. As body fat drops, this changes. The body's hormonal signalling begins to register that reserves are getting low and responds by making it progressively harder to mobilise the remaining fat — particularly lower body fat in women, which is the last to go and the most stubbornly protected.

Several things happen simultaneously:
- Leptin (the satiety and metabolic hormone) drops significantly, increasing hunger and reducing metabolic rate
- Thyroid hormone output decreases, slowing metabolism further
- Cortisol rises, which promotes muscle breakdown and fat retention
- The hypothalamic-pituitary-ovarian axis — the hormonal chain that drives the menstrual cycle — starts to down-regulate

This is not a failure of willpower or adherence. It is a coordinated physiological response to perceived energy scarcity. Understanding that it is biological makes it easier to work with rather than against.

**The Constraints of Category 1 Dieting**

*Rate of Loss*
The maximum sustainable rate of fat loss for a Category 1 dieter is approximately 200 to 350 grams per week — roughly 0.5 lb/week. Attempting faster loss at this level of leanness means losing muscle, not additional fat, because there simply isn't enough fat available to support a larger deficit. The body breaks down lean tissue to meet the energy gap.

*Deficit Size*
The caloric deficit needs to be small — typically 200 to 300 kcal per day. This sounds counterintuitively modest. The reason is that energy availability (the fuel left for physiological function after accounting for exercise expenditure) must remain above approximately 30–35 kcal per kg LBM per day. Go below this consistently and hormonal disruption follows.

*Protein*
Protein requirements are higher in Category 1 dieters than any other group. A minimum of 2.3–2.5 g per kg body weight per day is appropriate during a fat-loss phase, with some recommendations going higher. Muscle preservation at low body fat requires aggressive protein provision because the body is in a catabolic environment.

*Diet Breaks*
Category 1 dieters need regular periods of eating at maintenance calories — often called diet breaks. Every 4 to 6 weeks of active dieting, a 1 to 2 week period at maintenance allows leptin to recover, cortisol to drop, metabolic rate to stabilise, and hormonal function to reset. Skipping this step leads to the physiological adaptation that makes further fat loss increasingly difficult and eventually impossible.

*Diet Duration*
Active dieting phases should typically run no longer than 8 to 12 weeks before a structured break. Continuous dieting at low body fat, even with a small deficit, causes cumulative hormonal suppression that ultimately stalls progress entirely.

**Training During Category 1 Dieting**
Resistance training must be maintained to preserve muscle. However, volume should be managed carefully — high training volume combined with a caloric deficit and low body fat is a recipe for overtraining, injury, and hormonal disruption. Keep intensity high but manage total volume. Cardio adds to total exercise energy expenditure and must be accounted for in energy availability calculations. More cardio means more food is needed, not less, to maintain safe EA.

**Signs the Deficit Is Too Large**
- Training performance declining significantly
- Unusual fatigue or poor recovery between sessions
- Menstrual cycle becoming irregular or disappearing
- Persistent hunger that does not resolve after several weeks
- Mood disturbance, irritability, or difficulty concentrating
- Increasing obsession with food

Any of these signals should prompt an immediate reassessment of food intake, exercise load, and rest adequacy. They are not signs of poor discipline — they are physiological warning signals.

**The Reality of the Timeline**
Category 1 fat loss is slow by design. A lean woman dieting responsibly might lose 1 to 2 kg of actual fat over an 8-week block — less than most people expect, but more than the body wants to give up without significant cost. Patience and precision are not optional. Rushing this process damages health, performance, and future dieting capacity.`,
  },

  {
    id: 'b_category_2_3', category: 'womens-health', contentType: 'article', unlockWeek: 0,
    title: 'Category 2 and 3: Dieting with More Room to Move',
    summary: 'Higher body fat stores mean greater physiological flexibility. Here is how Category 2 and Category 3 dieters should structure their approach — and why they can push harder than Category 1.',
    readTime: '6 min', tag: 'Nutrition', tagColor: '#f472b6',
    articleBody: `**Category 2: The Intermediate Dieter**

Category 2 encompasses roughly 20 to 27% body fat — the range that covers most recreational exercisers and intermediate-level fitness enthusiasts. This is the most common starting point for structured fat-loss coaching, and in many ways it is the most manageable physiologically.

*Why Category 2 Has More Flexibility*
At 20–27% body fat, adipose tissue is substantial enough that the body does not panic when you eat less. Leptin levels, while they will drop during a diet, start from a higher baseline and fall less dramatically. The hormonal systems that govern the menstrual cycle and metabolic rate are more resilient. The body will release fat more readily because it correctly registers that reserves are not in short supply.

This does not mean dieting is effortless at Category 2 — hunger, fatigue, and metabolic adaptation still occur. But the physiological fight is considerably less intense than in Category 1.

*Rate of Loss*
A Category 2 dieter can safely target approximately 0.5 to 1% of body weight per week in fat loss. For a woman weighing 70 kg, that is 350 to 700 grams per week — meaningfully faster than Category 1 and still protective of lean tissue when protein is adequate.

*Deficit Size*
A caloric deficit of 300 to 500 kcal per day is appropriate for most Category 2 dieters. Some women tolerate slightly larger deficits when starting from the higher end of this body fat range. The key marker is that training performance should remain largely intact and the menstrual cycle should stay regular. If either of these starts to deteriorate, the deficit is too large.

*Protein*
2.0 to 2.3 g per kg body weight per day is a reasonable target. Higher end of this range when training volume is significant.

*Diet Breaks*
Category 2 dieters typically do not require diet breaks as frequently as Category 1. An 8 to 16 week dieting phase is often sustainable before a maintenance period is needed, though this varies individually. Watching for signs of hormonal adaptation (cycle changes, persistent fatigue, significant performance decline) is more useful than sticking to a rigid timeline.

*Carb Cycling*
Category 2 dieters often respond well to carbohydrate cycling — higher carb intake on training days to support performance, lower carb on rest days to create the weekly caloric deficit. This approach maintains training quality better than a flat caloric restriction and takes advantage of the body's sensitivity to carbohydrate-driven insulin signalling at this body fat level.

**Category 3: The Health-First Dieter**

Category 3 dieters are above approximately 27–28% body fat. The physiological landscape here is very different from Category 1 and to a lesser extent Category 2 — and the approach should reflect that.

*Greater Physiological Tolerance for Deficit*
Abundant fat stores mean the body has extensive reserves to draw on. Large caloric deficits do not represent a physiological threat at Category 3 because the stored energy available is more than sufficient to meet the body's needs. The hormonal consequences that are a real concern in Category 1 are effectively non-existent at Category 3 body fat levels.

This is why general dietary advice — 500 kcal daily deficit, 0.5 kg per week loss — was designed with a Category 3 population in mind. It works because the physiology supports it.

*Rate of Loss*
A Category 3 dieter can often sustain 0.5 to 1.0 kg per week of actual weight loss, particularly early in the dieting period. As body fat decreases and the woman moves toward Category 2 territory, the approach should be recalibrated accordingly.

*Insulin Sensitivity and Diet Composition*
Category 3 dieters are more likely to have some degree of insulin resistance, particularly if they are sedentary or carry significant central adiposity. This means:
- Lower carbohydrate approaches tend to produce better early results
- Fat loss is closely tied to improving insulin sensitivity through diet and exercise
- Resistance training produces disproportionately large benefits at this stage — both for fat loss and for metabolic health

*The Health Gains Come First*
For Category 3 dieters, the biggest physiological benefits of fat loss — improved blood sugar regulation, reduced inflammation, better cardiovascular markers, improved sleep — often show up before any dramatic aesthetic change. Understanding this matters because it reframes early progress: the goal at Category 3 is health improvement that enables the next stage, not a rapid body transformation.

*Transitioning Between Categories*
As a Category 3 dieter loses fat and moves into Category 2 territory, the approach must change. The larger deficits and aggressive rates of loss that were appropriate at higher body fat need to be wound back. This is not a failure — it is the correct physiological response to a changed situation. Coaching must anticipate this transition rather than waiting for it to become a problem.`,
  },

  {
    id: 'b_reds_explained', category: 'womens-health', contentType: 'article', unlockWeek: 1,
    title: 'RED-S: Relative Energy Deficiency in Sport',
    summary: 'RED-S is a serious health syndrome affecting lean athletes who chronically under-fuel relative to their exercise output. It is not a problem for overweight individuals — here is what it is, who it affects, and why it matters.',
    readTime: '7 min', tag: 'Health', tagColor: '#ef4444',
    articleBody: `**What RED-S Is — and What It Is Not**
Relative Energy Deficiency in Sport is a clinical syndrome that occurs when a physically active individual consistently consumes insufficient calories to cover both the energy cost of their exercise and the energy demands of the body's essential physiological functions.

The word "relative" in the name is important. RED-S is not simply about eating too little in absolute terms. It is about eating too little relative to energy expenditure — specifically, about energy availability falling below the threshold the body needs to maintain core biological processes.

A critical point that is often misunderstood: RED-S is an athlete problem and a lean-person problem. It does not occur in individuals who carry substantial body fat. The reason is straightforward: body fat is stored energy. Someone carrying 20 to 30 kg of excess fat has a physiological buffer of tens of thousands of calories available at any given time. Even during a caloric deficit, the body can draw on those fat stores to meet the energy needs of critical functions. True cellular energy deficiency simply does not occur under those circumstances.

RED-S requires the combination of high exercise output, restricted caloric intake, and insufficient fat stores to bridge the gap. This is the situation that exists for lean athletes, competitive physique athletes in the final stages of a diet, and Category 1 dieters as described in the framework above.

**The Energy Availability Threshold**
Energy availability is calculated as:

EA = (Daily Caloric Intake minus Exercise Energy Expenditure) divided by Lean Body Mass in kg

The result is expressed in kcal per kg of lean body mass per day.

At EA of 45 kcal/kg LBM/day or above, the body has sufficient fuel for all physiological functions — exercise recovery, hormonal production, immune function, bone metabolism, and all other systems.

Below 30 kcal/kg LBM/day, the body begins making triage decisions. Non-essential (for immediate survival) systems start to shut down. The menstrual cycle is one of the first casualties in women because reproduction is energetically expensive and non-essential when the body perceives it is in famine.

Women are more sensitive to this threshold than men. The menstrual cycle begins to show disruption at EA levels that a male athlete might sustain without obvious consequences — which is why EA monitoring is especially important in female athlete coaching.

**What RED-S Does to the Body**
The consequences of chronic low energy availability affect virtually every system:

*Reproductive system*
Loss of menstrual cycle (amenorrhea) or irregular cycles (oligomenorrhea) is typically the first and most visible sign in women. This is not benign — it indicates suppression of the entire hormonal axis. Estrogen drops, which has downstream consequences for bone, cardiovascular health, and mood.

*Bone*
Estrogen is essential for bone mineral density. Chronically low estrogen from exercise-induced amenorrhea causes bone loss. This is not the same as normal aging-related bone loss — it is active, accelerated demineralisation that significantly raises the risk of stress fractures during training. Bone loss from RED-S can be partially but not fully recovered even after hormonal function is restored. This makes it one of the most serious long-term consequences.

*Metabolic*
The body reduces metabolic rate to conserve energy. Thyroid hormone output decreases. This is why some athletes feel permanently cold, fatigued, and mentally sluggish during extended periods of low energy availability — their metabolic engine is running at a fraction of its normal output.

*Cardiovascular*
Heart rate can drop to unusually low levels (beyond normal athletic bradycardia), blood pressure decreases, and changes in lipid profiles have been documented. The heart itself is a muscle under energy restriction and is not immune to the conservation response.

*Immune*
Chronic low EA impairs immune function, leaving athletes more susceptible to illness, particularly upper respiratory infections. This is a common observation in athletes during hard training blocks where food intake has not kept pace with energy output.

*Psychological*
Irritability, depression, anxiety, difficulty concentrating, and increasing preoccupation with food are all documented in RED-S. These are not personality traits — they are neurological consequences of chronic energy restriction affecting neurotransmitter function.

*Performance*
Despite often feeling driven and highly motivated initially, athletes with RED-S ultimately see performance degrade. Strength and power output decline, reaction time slows, coordination suffers, and the training load that previously produced adaptation now just produces fatigue without recovery.

**Warning Signs to Watch For**
As a coach, these are the red flags that warrant immediate food intake review:
- Loss of menstrual cycle, or cycles becoming irregular
- Stress fractures or bone injuries without adequate trauma to explain them
- Persistent fatigue that rest does not resolve
- Significant decline in training performance despite consistent work
- Frequent illness, repeated infections
- Mood changes, increased anxiety, persistent low mood
- Obsessive food restriction behaviour or intense fear of eating

**How RED-S Is Addressed**
The only intervention that works is increasing energy availability. This means eating more, reducing exercise load, or both. There are no supplements, hormonal interventions, or workarounds that address the root cause. Estrogen replacement, for example, may slow bone loss but does not restore the underlying hormonal function — only restoring adequate energy availability does that.

The conversation around RED-S in coaching can be difficult. Athletes who are in this state are often psychologically invested in not eating more and not training less. Recovery requires rebuilding the relationship with food and movement alongside the physiological restoration — which is why working with a sports psychologist or therapist experienced in this area is often appropriate.

For coaches: if a client shows multiple warning signs, this needs to be addressed as a health priority before any physique or performance goal. EA should be calculated, food intake increased to bring EA above 35 kcal/kg LBM/day as a minimum, and exercise load reviewed. Progress on physique goals stops. Health comes first.`,
  },

  {
    id: 'b_cat1_amenorrhea', category: 'womens-health', contentType: 'article', unlockWeek: 1,
    title: 'Amenorrhea in Category 1 Athletes: Causes and Recovery',
    summary: 'Loss of the menstrual cycle in lean athletes is one of the most serious signals the body can send. It is not a side effect to train through — here is what causes it and how to restore hormonal function.',
    readTime: '7 min', tag: 'Advanced', tagColor: '#f472b6',
    articleBody: `**What Is Exercise-Induced Amenorrhea?**
Amenorrhea is the absence of menstruation. In the context of sport and dieting, it falls into two types: primary (never having had a cycle) and secondary (loss of a previously regular cycle). Secondary amenorrhea in athletes — defined clinically as the absence of three or more consecutive cycles — is what we are concerned with here.

Exercise-induced or hypothalamic amenorrhea is the loss of the menstrual cycle as a direct consequence of chronic low energy availability. It is the most visible symptom of RED-S and the clearest signal that the body's hormonal axis has been suppressed in response to perceived energy scarcity.

It is important to understand what amenorrhea is not: it is not a neutral adaptation to athletic training. It is not something to be "worked through." It is not an acceptable trade-off for leanness. It is a physiological emergency signal indicating that the body has shut down reproductive function because it does not have sufficient energy to sustain it.

**The Hormonal Mechanism**
The menstrual cycle is controlled by the hypothalamic-pituitary-ovarian (HPO) axis — a chain of hormonal communication between the hypothalamus, pituitary gland, and ovaries. This axis is extraordinarily sensitive to energy status.

When energy availability drops consistently below approximately 30 kcal per kg of lean body mass per day, the hypothalamus reduces its pulsatile release of GnRH (gonadotropin-releasing hormone). Without adequate GnRH, the pituitary does not release LH and FSH in normal patterns. Without LH and FSH, the ovaries do not receive the signal to develop follicles, ovulate, or produce estrogen and progesterone.

The result is a cascade shutdown of the entire reproductive hormone system. This is not a specific pathology — it is the hypothalamus rationing energy away from a non-survival function. The body treats reproduction as a luxury it cannot currently afford.

**Who Is at Risk**
Category 1 dieters are the highest-risk group. The combination of:
- Low body fat (limited hormonal reserve from adipose tissue, which produces estrogen via aromatisation)
- High exercise energy expenditure
- Caloric restriction to achieve further fat loss

...creates exactly the conditions the hypothalamus responds to by shutting down the HPO axis.

Risk is also elevated in athletes who:
- Have a history of very restrictive dieting
- Are increasing training load significantly without increasing food intake
- Are in the final preparation phase for a physique competition or weight-class sport
- Have high psychological stress alongside physical stress

**Consequences Beyond Missing Periods**
Many athletes dismiss amenorrhea as an inconvenient side effect — "at least I don't have to deal with a cycle." This is a serious misunderstanding of what amenorrhea means physiologically.

Estrogen is not only a reproductive hormone. It is critical for:
- Bone mineral density maintenance (estrogen inhibits osteoclasts, the cells that break bone down)
- Cardiovascular health (estrogen has protective effects on the vascular endothelium)
- Mood regulation and cognitive function
- Fat mobilisation and metabolic rate regulation
- Ligament and connective tissue integrity

Three to six months of amenorrhea begins to produce measurable bone density loss. Extended amenorrhea (one to two or more years) can produce bone density levels equivalent to early osteoporosis — in women who are in their twenties and thirties. This bone loss is only partially reversible even after hormonal function is restored.

The ligament laxity associated with low estrogen also significantly raises injury risk. ACL injuries in female athletes, in particular, are more common when estrogen levels are chronically suppressed.

**Restoring the Cycle**
The single most effective intervention is increasing energy availability. This means:
- Eating more — specifically, increasing caloric intake to bring EA above 35 kcal/kg LBM/day, aiming for 40–45 over time
- Reducing exercise load if increasing food alone is insufficient
- Prioritising rest and sleep, which both support hormonal recovery

Recovery is not instant. The HPO axis can take weeks to months to resume normal function once EA is restored. Most women will see the return of menstruation within 3 to 6 months of sustained adequate energy availability, though individual variation is wide.

During recovery, body weight may increase slightly as the body restores lean tissue and glycogen. This is not fat gain — it is the physiological restoration of function. Resisting this process by restricting food intake or increasing cardio prolongs the hormonal suppression.

Oral contraceptives are sometimes prescribed for amenorrheic athletes, and this requires careful consideration. The pill will produce withdrawal bleeds that appear to be menstrual cycles, but this does not indicate that the HPO axis has recovered. It is artificial hormonal cycling overlaid on suppression. The underlying energy status problem is not addressed. Bone loss will continue despite the apparent cycle.

**The Coach's Role**
If a client reports cycle loss or increasing irregularity:
- Immediately calculate energy availability using all three components: intake, exercise EE, and daily steps/NEAT
- Review whether food intake has kept pace with training load
- Do not wait to see if it resolves on its own — address the deficit now
- Be prepared for a difficult conversation: the client may not want to eat more or train less
- If cycle loss has been ongoing for more than three months, a referral to a sports medicine doctor or endocrinologist familiar with the female athlete triad/RED-S is appropriate

Performance goals are secondary to this. A client cannot achieve long-term physique or performance outcomes while her hormonal axis is shut down. Restoring health is the prerequisite for everything else.`,
  },

  {
    id: 'b_quiz_womens', category: 'womens-health', contentType: 'quiz', unlockWeek: 2,
    title: 'Women\'s Physiology Quiz',
    summary: 'Test your understanding of the menstrual cycle, energy availability, and how hormones affect training.',
    readTime: '4 min', tag: 'Quiz', tagColor: '#60a5fa',
    questions: [
      {
        question: 'Which phase of the menstrual cycle is associated with better insulin sensitivity, faster muscle repair, and lower hunger?',
        options: [
          { text: 'The luteal phase (days 15–28)', hint: 'The luteal phase is progesterone-dominant, which increases insulin resistance and hunger.' },
          { text: 'The follicular phase (days 1–14)', hint: 'Correct! Estrogen dominance in the follicular phase supports performance, recovery, and lower hunger.' },
          { text: 'The premenstrual phase only', hint: 'The premenstrual phase is the late luteal phase — not performance-friendly.' },
          { text: 'Hormone levels do not change enough to affect training', hint: 'Hormonal changes across the cycle have measurable, significant effects on physiology.' },
        ],
        correctIndex: 1,
        explanation: 'The follicular phase is estrogen-dominant. Estrogen improves insulin sensitivity, promotes fat burning, reduces inflammation, and supports muscle repair — making it the best window for hardest training sessions.',
      },
      {
        question: 'What is the minimum energy availability threshold before menstrual dysfunction typically begins?',
        options: [
          { text: '20 kcal/kg LBM/day', hint: 'At this level significant health consequences would already be present.' },
          { text: '30 kcal/kg LBM/day', hint: 'Correct! Below 30 kcal/kg LBM/day, the body begins shutting down non-essential systems including the menstrual cycle.' },
          { text: '45 kcal/kg LBM/day', hint: '45 is the optimal target — not the minimum threshold.' },
          { text: '1,200 calories per day regardless of body composition', hint: 'EA is relative to lean body mass and exercise expenditure — not a fixed calorie number.' },
        ],
        correctIndex: 1,
        explanation: 'EA = (Intake − Exercise EE) ÷ LBM. Below 30 kcal/kg LBM/day, the body begins suppressing non-essential functions. The menstrual cycle is typically one of the first casualties. Optimal EA is 45 kcal/kg LBM/day.',
      },
      {
        question: 'Why is lower body fat in women more resistant to mobilisation than upper body fat?',
        options: [
          { text: 'Women have more fat cells in the lower body overall', hint: 'Cell count is not the primary reason for resistance to mobilisation.' },
          { text: 'The lower body has a higher ratio of alpha-2 to beta-2 adrenoceptors, blocking fat release', hint: 'Correct! Alpha-2 receptors actively inhibit fat mobilisation, and estrogen upregulates them in lower body tissue.' },
          { text: 'Lower body fat contains more saturated fats which are harder to oxidise', hint: 'This is not the primary mechanism for stubborn lower body fat.' },
          { text: 'Lower body fat requires more exercise than upper body fat to mobilise', hint: 'The issue is receptor physiology, not exercise volume.' },
        ],
        correctIndex: 1,
        explanation: 'Lower body fat has a high alpha-2:beta-2 receptor ratio. Alpha-2 receptors block adrenaline-driven fat mobilisation. Estrogen upregulates these receptors in lower body tissue and activates fat-storage enzymes there — making this an evolutionary design, not a training problem.',
      },
    ],
  },

  {
    id: 'b_quiz_category_framework', category: 'womens-health', contentType: 'quiz', unlockWeek: 2,
    title: 'Dieter Category Framework Quiz',
    summary: 'Test your understanding of the 3-category framework, RED-S, and how energy availability drives hormonal health in lean athletes.',
    readTime: '5 min', tag: 'Quiz', tagColor: '#60a5fa',
    questions: [
      {
        question: 'A female client is at approximately 15% body fat and training 6 days per week for a physique competition. She reports her menstrual cycle has become irregular. Which dieter category does she fall into, and what is the primary concern?',
        options: [
          { text: 'Category 3 — she needs to increase cardio to accelerate fat loss before the competition', hint: 'Category 3 refers to higher body fat individuals. At 15% BF this client is Category 1, and adding cardio would worsen her situation.' },
          { text: 'Category 1 — her irregular cycle signals that energy availability has dropped below the safe threshold', hint: 'Correct. At 15% BF she is Category 1, and menstrual irregularity is the clearest warning sign that EA has fallen too low.' },
          { text: 'Category 2 — irregular cycles are normal for women who train hard and she should continue the programme', hint: 'At 15% BF she is Category 1, not Category 2, and irregular cycles are not a normal consequence of hard training — they signal a physiological problem.' },
          { text: 'Category 1 — she should stop training entirely until her cycle returns', hint: 'Correct category, but the intervention is increasing food intake and reducing exercise load — not stopping training completely.' },
        ],
        correctIndex: 1,
        explanation: 'At 15% BF this woman is firmly Category 1. Menstrual irregularity is the hypothalamus signalling that energy availability has dropped below what the body can sustain hormonal function on. The intervention is increasing caloric intake to bring EA above 35 kcal/kg LBM/day, not further restriction or more exercise.',
      },
      {
        question: 'Why does RED-S (Relative Energy Deficiency in Sport) not occur in overweight or obese individuals, even if they are training heavily and eating in a deficit?',
        options: [
          { text: 'Overweight individuals do not train with sufficient intensity to trigger the syndrome', hint: 'RED-S is about energy availability, not training intensity. Exercise type and intensity are not the determining factors.' },
          { text: 'The hormonal profile of overweight individuals protects them from energy deficiency', hint: 'This is partially related but not the primary explanation. The core reason is the availability of stored energy.' },
          { text: 'Body fat stores provide a large reserve of available energy that prevents true cellular energy deficiency', hint: 'Correct. Significant adipose tissue means the body can draw on stored energy to meet physiological needs even during a caloric deficit, preventing the energy scarcity that drives RED-S.' },
          { text: 'Overweight individuals have higher leptin levels which prevents the hormonal cascade', hint: 'While leptin is relevant to the mechanism, the fundamental reason is that abundant fat stores prevent true energy deficiency at the cellular level.' },
        ],
        correctIndex: 2,
        explanation: 'RED-S requires the combination of high exercise output, restricted intake, and insufficient fat stores to bridge the gap. An overweight person has tens of thousands of calories of stored energy available. Even in a dietary deficit, the body can draw on those fat stores to maintain critical physiological functions. Genuine cellular energy deficiency simply does not occur when substantial fat reserves are present.',
      },
      {
        question: 'A Category 2 client (23% BF) has been dieting for 10 weeks at a 400 kcal daily deficit and is making good progress. Her Category 1 friend tells her she should be taking diet breaks every 4 weeks. Is this advice applicable?',
        options: [
          { text: 'Yes — all women need diet breaks every 4 weeks regardless of body fat level', hint: 'Diet break frequency depends on body fat level and hormonal resilience, not a universal 4-week rule.' },
          { text: 'No — Category 2 dieters typically sustain 8–16 week phases before needing a break, and should use their own hormonal markers as a guide', hint: 'Correct. The 4-week diet break recommendation is specifically for Category 1 dieters. Category 2 dieters have more physiological resilience and can sustain longer phases, guided by their own cycle regularity and performance.' },
          { text: 'No — Category 2 dieters never need diet breaks', hint: 'Diet breaks may still be appropriate for Category 2 eventually — but the frequency and timing is different from Category 1.' },
          { text: 'Yes — 400 kcal is too large a deficit for any woman and should be halved immediately', hint: 'A 400 kcal deficit is entirely appropriate for a Category 2 dieter. This recommendation applies to Category 1 where deficits must be much smaller.' },
        ],
        correctIndex: 1,
        explanation: 'Diet break frequency is determined by the physiological stress of the dieting phase, which is directly related to body fat level. Category 1 dieters need frequent breaks because their body is under significant metabolic and hormonal pressure. Category 2 dieters have greater resilience. An 8–16 week phase is typically sustainable at this body fat level. Menstrual regularity and training performance are the best individual guides.',
      },
    ],
  },

  {
    id: 'b_hcg_myths', category: 'hormones', contentType: 'article', unlockWeek: 3,
    title: 'HCG: Separating the Facts from the Noise',
    summary: 'HCG is one of the most oversold and misunderstood adjuncts to TRT. Here\'s what it actually does — and what it doesn\'t.',
    readTime: '6 min', tag: 'Advanced', tagColor: '#f472b6',
    articleBody: `**What HCG Is**
HCG (Human Chorionic Gonadotropin) is a hormone produced by women during pregnancy. It stimulates the LH receptor — the same receptor that Luteinising Hormone acts on in men to signal testosterone production in the testicles. Because of this receptor overlap, HCG can be used in men to keep the testicles active and stimulated while on TRT, since TRT itself shuts down the body's own LH production.

This is the mechanism behind prescribing HCG alongside TRT: keep the testicles stimulated, maintain their size and function, and preserve intratesticular hormone production.

The reality is more complicated.

**The Nuance Most Clinics Skip**
HCG and LH both bind to the LH receptor, but they don't produce identical effects. Think of it like different keys fitting the same lock — they can both open the door, but the experience on the other side isn't necessarily the same. This is likely why a significant number of men experience side effects from HCG that they never experienced from their own LH. HCG is a potent stimulus and it affects the body differently than the hormone it's supposed to mimic.

**Who Responds Well — and Who Doesn't**
Based on clinical experience, roughly one third of men feel genuinely better on HCG alongside TRT — improved mood, energy, and a sense of mental clarity. One third feel nothing beyond physical changes (the testicles remain fuller and more active). And one third experience significant side effects: anxiety, insomnia, mood disturbances, sweating, and worsening of sexual function.

For the men in that last group, no reduction in dose resolves it. They simply don't tolerate HCG, and they do better without it. If you fall into this category, the mechanistic argument for why you "should" be on HCG is irrelevant — your experience is the only data point that matters.

**What HCG Does NOT Do**
There are several persistent myths about HCG worth addressing directly.

*It does not meaningfully raise DHEA or pregnenolone.* This idea comes from an oversimplified reading of the hormonal pathway diagram — the steroidogenic cascade. While LH is one of several signals involved in that pathway, it isn't the primary driver of adrenal DHEA or pregnenolone production, which come from completely separate glands. HCG does not "protect" upstream hormone levels in any clinically significant way.

*It does not reliably protect fertility.* TRT suppresses fertility in some men, not all. HCG at the low doses typically used alongside TRT primarily stimulates the LH receptor and has minimal effect on the FSH receptor — which is what drives sperm production. Men have conceived while on TRT without HCG, and men have been rendered infertile while on TRT with HCG. It is not a reliable contraceptive insurance policy in either direction.

*TRT without HCG will not destroy your testicles.* Yes, the testicles atrophy somewhat — typically 20–30% — when they're no longer being stimulated by LH. But testicular atrophy is not irreversible damage. The testicles receive no LH stimulation from birth until puberty either — and they recover fine when the signal returns. For men where testicular size or discomfort is genuinely problematic, HCG is worth trialling. For men where it isn't — there's no emergency.

**The Practical Approach**
If you and your practitioner want to trial HCG, do it after testosterone levels have been stabilised and symptoms have begun to improve — not at the start of therapy. That way, any side effects that emerge are clearly attributable to the HCG, not the testosterone.

If HCG is going to cause problems, it usually becomes apparent within days. If it doesn't cause issues in the first week, that's a positive sign. Give it 6–8 weeks to assess the full effect on testicular size and how you feel.

The bottom line: HCG is an option for some men, not a requirement for all. Your individual response is the only reliable guide.`,
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'training', label: 'Training' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'recovery', label: 'Recovery' },
  { id: 'programming', label: 'Programming' },
  { id: 'mindset', label: 'Mindset' },
  { id: 'hormones', label: 'Hormones' },
  { id: 'womens-health', label: "Women's Health" },
]

// ============================================================
// SHARED UI
// ============================================================

function TagBadge({ label, color }) {
  return (
    <span style={{
      fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5,
      color, background: `${color}18`, border: `1px solid ${color}44`,
      borderRadius: 3, padding: '2px 7px',
    }}>
      {label}
    </span>
  )
}

function LockBadge({ week }) {
  return (
    <span style={{
      fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1,
      color: 'var(--muted)', background: 'var(--s5)', border: '1px solid var(--border)',
      borderRadius: 3, padding: '2px 7px',
    }}>
      🔒 Unlocks Week {week}
    </span>
  )
}

function ProgressRing({ pct, size = 40, stroke = 3 }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--s5)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--accent)" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset .4s' }} />
    </svg>
  )
}

// ============================================================
// CONTENT RENDERERS
// ============================================================

function ArticleBody({ body }) {
  if (!body) return null
  const lines = body.split('\n')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 10 }} />
        if (line.startsWith('**') && line.endsWith('**') && (line.match(/\*\*/g) || []).length === 2) {
          return (
            <div key={i} style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1.5, color: 'var(--accent)', marginTop: 18, marginBottom: 6 }}>
              {line.slice(2, -2)}
            </div>
          )
        }
        if (line.startsWith('- ')) {
          const text = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--white)">$1</strong>')
          return (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
              <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 3, fontSize: 10 }}>▸</span>
              <span style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          )
        }
        const html = line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--white);font-weight:600">$1</strong>')
        return (
          <p key={i} style={{ fontSize: 13, color: 'var(--sub)', lineHeight: 1.8, margin: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
        )
      })}
    </div>
  )
}

function VideoPlayer({ url, title }) {
  // Convert YouTube/Vimeo URLs to embed format
  const getEmbedUrl = (url) => {
    if (!url) return null
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    return url
  }
  const embedUrl = getEmbedUrl(url)
  if (!embedUrl) {
    return (
      <div style={{ aspectRatio: '16/9', background: 'var(--s4)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>▶</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Video URL not configured</div>
        </div>
      </div>
    )
  }
  return (
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 8, overflow: 'hidden' }}>
      <iframe
        src={embedUrl}
        title={title}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

function PDFViewer({ url, title }) {
  return (
    <div style={{ padding: '32px', background: 'var(--s4)', borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📄</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 1, color: 'var(--white)', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 20 }}>PDF Document</div>
      {url ? (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
            Open PDF
          </a>
          <a href={url} download className="btn btn-ghost btn-sm">
            Download
          </a>
        </div>
      ) : (
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>PDF not yet available</div>
      )}
    </div>
  )
}

// ============================================================
// QUIZ ENGINE
// ============================================================

function QuizEngine({ questions, moduleId, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState([])
  const [done, setDone] = useState(false)

  const q = questions[currentQ]
  const score = answers.filter(a => a.correct).length
  const scorePct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0

  function handleSelect(idx) {
    if (revealed) return
    setSelected(idx)
  }

  function handleReveal() {
    if (selected === null) return
    setRevealed(true)
  }

  function handleNext() {
    const newAnswers = [...answers, { questionIndex: currentQ, selected, correct: selected === q.correctIndex }]
    setAnswers(newAnswers)
    if (currentQ + 1 >= questions.length) {
      const finalScore = Math.round((newAnswers.filter(a => a.correct).length / questions.length) * 100)
      setDone(true)
      onComplete(finalScore)
    } else {
      setCurrentQ(p => p + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  if (done) {
    const passed = scorePct >= 70
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ display: 'inline-flex', position: 'relative', marginBottom: 20 }}>
          <ProgressRing pct={scorePct} size={80} stroke={5} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: passed ? 'var(--accent)' : 'var(--danger)' }}>{scorePct}%</span>
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 2, color: passed ? 'var(--accent)' : 'var(--warn)', marginBottom: 8 }}>
          {passed ? 'Well Done!' : 'Keep Studying'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 8 }}>
          {score} of {questions.length} correct
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 24 }}>
          {passed ? 'You have a solid understanding of this topic.' : 'Review the article and try again when ready.'}
        </div>
        {/* Review wrong answers */}
        {answers.filter(a => !a.correct).length > 0 && (
          <div style={{ textAlign: 'left', marginTop: 20 }}>
            <div className="label" style={{ marginBottom: 10 }}>Review Incorrect Answers</div>
            {answers.filter(a => !a.correct).map((a, i) => {
              const aq = questions[a.questionIndex]
              return (
                <div key={i} style={{ padding: '12px', background: 'rgba(255,59,59,.06)', border: '1px solid rgba(255,59,59,.2)', borderRadius: 6, marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--white)', marginBottom: 6 }}>{aq.question}</div>
                  <div style={{ fontSize: 11, color: 'var(--danger)', marginBottom: 4 }}>✗ You answered: {aq.options[a.selected]?.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 6 }}>✓ Correct: {aq.options[aq.correctIndex]?.text}</div>
                  {aq.explanation && <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>{aq.explanation}</div>}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <span className="label">Question {currentQ + 1} of {questions.length}</span>
        <div style={{ display: 'flex', gap: 4 }}>
          {questions.map((_, i) => (
            <div key={i} style={{ width: 20, height: 3, borderRadius: 2, background: i < currentQ ? 'var(--accent)' : i === currentQ ? 'var(--accent-hi)' : 'var(--s5)' }} />
          ))}
        </div>
      </div>

      {/* Question */}
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: 1, color: 'var(--white)', lineHeight: 1.5, marginBottom: 20 }}>
        {q.question}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {q.options.map((opt, idx) => {
          const isSelected = selected === idx
          const isCorrect = idx === q.correctIndex
          let bg = 'var(--s4)', border = 'var(--border-hi)', color = 'var(--sub)'

          if (revealed) {
            if (isCorrect) { bg = 'rgba(0,200,150,.1)'; border = 'rgba(0,200,150,.4)'; color = 'var(--accent)' }
            else if (isSelected && !isCorrect) { bg = 'rgba(255,59,59,.1)'; border = 'rgba(255,59,59,.4)'; color = 'var(--danger)' }
            else { bg = 'var(--s4)'; border = 'var(--border)'; color = 'var(--muted)' }
          } else if (isSelected) {
            bg = 'rgba(0,200,150,.06)'; border = 'rgba(0,200,150,.3)'; color = 'var(--white)'
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                textAlign: 'left', padding: '12px 14px', borderRadius: 6,
                background: bg, border: `1.5px solid ${border}`, color,
                cursor: revealed ? 'default' : 'pointer',
                transition: 'all .15s', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>{opt.text}</div>
                {revealed && opt.hint && (
                  <div style={{ fontSize: 11, color: isCorrect ? 'var(--accent)' : 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>
                    {opt.hint}
                  </div>
                )}
              </div>
              {revealed && (isCorrect ? <span style={{ color: 'var(--accent)', flexShrink: 0 }}>✓</span> : isSelected ? <span style={{ color: 'var(--danger)', flexShrink: 0 }}>✗</span> : null)}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {revealed && q.explanation && (
        <div style={{ padding: '12px 14px', background: 'var(--accent-dim)', border: '1px solid rgba(0,200,150,.25)', borderRadius: 6, marginBottom: 16 }}>
          <div className="label" style={{ marginBottom: 4 }}>Explanation</div>
          <div style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.7 }}>{q.explanation}</div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        {!revealed ? (
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleReveal} disabled={selected === null}>
            Check Answer
          </button>
        ) : (
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleNext}>
            {currentQ + 1 >= questions.length ? 'See Results' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================================
// MODULE DETAIL VIEW
// ============================================================

function ModuleDetail({ module, clientWeek, completed, onComplete, onBack }) {
  const [quizDone, setQuizDone] = useState(false)
  const isLocked = module.unlockWeek > clientWeek
  const isCompleted = !!completed

  async function handleArticleComplete() {
    if (isCompleted) return
    try {
      await supabase.from('module_completions').insert({ module_id: module.id, client_id: (await supabase.auth.getUser()).data.user.id })
    } catch (e) { /* offline graceful */ }
    onComplete(module.id, null)
  }

  async function handleQuizComplete(score) {
    setQuizDone(true)
    try {
      await supabase.from('module_completions').upsert({ module_id: module.id, client_id: (await supabase.auth.getUser()).data.user.id, quiz_score: score })
    } catch (e) { /* offline graceful */ }
    onComplete(module.id, score)
  }

  const typeColor = { article: 'var(--accent)', video: '#a78bfa', pdf: 'var(--warn)', quiz: '#60a5fa' }[module.contentType] || 'var(--accent)'

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 20 }}>← Back to Library</button>

      <div className="card" style={{ maxWidth: 720 }}>
        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
            <TagBadge label={module.tag || module.contentType?.toUpperCase()} color={module.tagColor || typeColor} />
            <TagBadge label={module.category?.charAt(0).toUpperCase() + module.category?.slice(1)} color="var(--muted)" />
            {module.readTime && <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 'auto' }}>{module.readTime} read</span>}
            {isCompleted && <span style={{ fontSize: 10, color: 'var(--accent)' }}>✓ Completed</span>}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 1.5, color: 'var(--white)', lineHeight: 1.3, marginBottom: 8 }}>
            {module.title}
          </div>
          {module.summary && (
            <div style={{ fontSize: 13, color: 'var(--accent)', lineHeight: 1.6 }}>{module.summary}</div>
          )}
        </div>

        {isLocked ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--s4)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 6 }}>Locked</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>This module unlocks at Week {module.unlockWeek} of your programme</div>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            {module.contentType === 'article' && (
              <div>
                <ArticleBody body={module.articleBody || module.article_body} />
                {!isCompleted && (
                  <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary" onClick={handleArticleComplete}>
                      Mark as Read ✓
                    </button>
                  </div>
                )}
              </div>
            )}

            {module.contentType === 'video' && (
              <div>
                <VideoPlayer url={module.contentUrl || module.content_url} title={module.title} />
                {!isCompleted && (
                  <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary" onClick={handleArticleComplete}>Mark as Watched ✓</button>
                  </div>
                )}
              </div>
            )}

            {module.contentType === 'pdf' && (
              <div>
                <PDFViewer url={module.contentUrl || module.content_url} title={module.title} />
                {!isCompleted && (
                  <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn-primary" onClick={handleArticleComplete}>Mark as Read ✓</button>
                  </div>
                )}
              </div>
            )}

            {module.contentType === 'quiz' && (
              <QuizEngine
                questions={module.questions || []}
                moduleId={module.id}
                onComplete={handleQuizComplete}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// MODULE CARD
// ============================================================

function ModuleCard({ module, clientWeek, completed, onClick }) {
  const isLocked = module.unlockWeek > clientWeek
  const isCompleted = !!completed
  const typeColor = { article: 'var(--accent)', video: '#a78bfa', pdf: 'var(--warn)', quiz: '#60a5fa' }[module.contentType] || 'var(--accent)'
  const typeIcon = { article: '📄', video: '▶', pdf: '📋', quiz: '❓' }[module.contentType] || '📄'

  return (
    <div
      onClick={() => onClick(module)}
      style={{
        background: 'var(--s3)', border: `1px solid var(--border)`, borderRadius: 10,
        padding: 16, cursor: isLocked ? 'default' : 'pointer',
        opacity: isLocked ? 0.5 : 1, transition: 'border-color .15s, transform .1s',
        borderLeft: `3px solid ${isCompleted ? 'var(--accent)' : isLocked ? 'var(--s5)' : typeColor}`,
        position: 'relative',
      }}
      onMouseEnter={e => { if (!isLocked) { e.currentTarget.style.transform = 'translateY(-1px)' } }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
    >
      {isCompleted && (
        <div style={{ position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>✓</div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <TagBadge label={module.tag || module.contentType?.toUpperCase()} color={module.tagColor || typeColor} />
        {module.unlockWeek > 0 && isLocked && <LockBadge week={module.unlockWeek} />}
        {module.readTime && <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 'auto' }}>{module.readTime}</span>}
      </div>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 1, color: 'var(--white)', lineHeight: 1.4, marginBottom: 6 }}>
        {typeIcon} {module.title}
      </div>
      <div style={{ fontSize: 11, color: 'var(--sub)', lineHeight: 1.6 }}>{module.summary}</div>
    </div>
  )
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function Education() {
  const { profile } = useAuth()
  const [tab, setTab] = useState('articles') // 'articles' | 'courses'
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedModule, setSelectedModule] = useState(null)
  const [search, setSearch] = useState('')
  const [completions, setCompletions] = useState({})
  const [dbModules, setDbModules] = useState([])
  const [clientWeek, setClientWeek] = useState(0)

  // Fetch completions + DB modules + client week from Supabase
  useEffect(() => {
    async function load() {
      if (!profile?.id) return
      try {
        // Get client's current week from active program
        const { data: prog } = await supabase
          .from('programs')
          .select('current_week')
          .eq('client_id', profile.id)
          .eq('is_active', true)
          .maybeSingle()
        if (prog) setClientWeek(prog.current_week || 0)

        // Get module completions
        const { data: comps } = await supabase
          .from('module_completions')
          .select('module_id, quiz_score')
          .eq('client_id', profile.id)
        if (comps) {
          const map = {}
          comps.forEach(c => { map[c.module_id] = { score: c.quiz_score } })
          setCompletions(map)
        }

        // Get coach-uploaded modules
        const { data: mods } = await supabase
          .from('education_modules')
          .select('*')
          .eq('is_published', true)
          .order('order_index')
        if (mods) setDbModules(mods)
      } catch (e) { /* offline — use built-ins only */ }
    }
    load()
  }, [profile?.id])

  // Merge built-in + DB modules, DB takes precedence
  const allModules = [
    ...BUILTIN_MODULES.filter(b => !dbModules.find(d => d.id === b.id)),
    ...dbModules,
  ]

  const filtered = allModules.filter(m => {
    const matchCat = activeCategory === 'all' || m.category === activeCategory
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || (m.summary || '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function handleComplete(moduleId, score) {
    setCompletions(p => ({ ...p, [moduleId]: { score } }))
  }

  // Category stats
  const catStats = {}
  CATEGORIES.filter(c => c.id !== 'all').forEach(c => {
    const mods = allModules.filter(m => m.category === c.id)
    const comp = mods.filter(m => completions[m.id]).length
    catStats[c.id] = { total: mods.length, completed: comp }
  })

  const totalMods = allModules.length
  const totalCompleted = Object.keys(completions).length
  const overallPct = totalMods > 0 ? Math.round((totalCompleted / totalMods) * 100) : 0

  if (tab === 'articles' && selectedModule) {
    return (
      <ModuleDetail
        module={selectedModule}
        clientWeek={clientWeek}
        completed={completions[selectedModule.id]}
        onComplete={handleComplete}
        onBack={() => setSelectedModule(null)}
      />
    )
  }

  // ── Tab switcher ─────────────────────────────────────────────
  const TabBar = () => (
    <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
      {[
        { key: 'articles', label: 'Articles & Quizzes' },
        { key: 'courses',  label: 'Courses' },
      ].map(t => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          style={{
            fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1.5,
            padding: '7px 18px', borderRadius: 6, cursor: 'pointer',
            background: tab === t.key ? 'var(--accent)' : 'var(--s3)',
            border: `1px solid ${tab === t.key ? 'var(--accent)' : 'var(--border)'}`,
            color: tab === t.key ? 'var(--ink)' : 'var(--muted)',
            transition: 'all .15s',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Education Hub</div>
          <div className="page-subtitle">Training · Nutrition · Recovery · Programming · Mindset</div>
        </div>
      </div>

      <TabBar />

      {/* ── Courses tab ── */}
      {tab === 'courses' && <Learn hideHeader />}

      {/* ── Articles & Quizzes tab ── */}
      {tab === 'articles' && <>

      {/* Overall progress */}
      <div className="card" style={{ marginBottom: 20, padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <ProgressRing pct={overallPct} size={50} stroke={4} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--accent)' }}>{overallPct}%</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1.5, color: 'var(--white)', marginBottom: 6 }}>
              {totalCompleted} of {totalMods} modules completed
            </div>
            <div style={{ height: 3, background: 'var(--s5)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${overallPct}%`, background: 'var(--accent)', borderRadius: 2, transition: 'width .4s' }} />
            </div>
          </div>
          {clientWeek > 0 && (
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--accent)' }}>W{clientWeek}</div>
              <div className="label" style={{ fontSize: 8 }}>Current Week</div>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: 16, padding: '10px 14px' }}>
        <input
          className="input input-sm"
          placeholder="Search modules…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ border: 'none', background: 'transparent', padding: 0, fontSize: 13 }}
        />
      </div>

      {/* Category filter with completion counts */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
        {CATEGORIES.map(c => {
          const stats = catStats[c.id]
          return (
            <button
              key={c.id}
              className={`btn btn-sm ${activeCategory === c.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveCategory(c.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {c.label}
              {stats && stats.total > 0 && (
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: 9,
                  color: activeCategory === c.id ? 'rgba(0,0,0,.6)' : 'var(--muted)',
                  background: activeCategory === c.id ? 'rgba(0,0,0,.2)' : 'var(--s5)',
                  borderRadius: 10, padding: '1px 5px',
                }}>
                  {stats.completed}/{stats.total}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Module grid */}
      {filtered.length > 0 ? (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          {filtered.map(module => (
            <ModuleCard
              key={module.id}
              module={module}
              clientWeek={clientWeek}
              completed={completions[module.id]}
              onClick={setSelectedModule}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-text">No modules match your search</div>
        </div>
      )}

      </>}
    </div>
  )
}
