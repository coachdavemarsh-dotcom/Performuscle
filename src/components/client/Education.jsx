import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { supabase } from '../../lib/supabase.js'

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
]

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'training', label: 'Training' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'recovery', label: 'Recovery' },
  { id: 'programming', label: 'Programming' },
  { id: 'mindset', label: 'Mindset' },
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

  if (selectedModule) {
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

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Education Hub</div>
          <div className="page-subtitle">Training · Nutrition · Recovery · Programming · Mindset</div>
        </div>
      </div>

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
    </div>
  )
}
