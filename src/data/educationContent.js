export const COURSES = [
  // ============================================================
  // COURSE 1: NUTRITION
  // ============================================================
  {
    id: 'nutrition',
    title: 'Understanding Your Nutrition',
    description: 'The science behind how your nutrition is structured and why it works.',
    icon: '🥗',
    color: 'var(--accent)',
    modules: [
      {
        id: 'diet-periodization',
        title: 'The Big Picture — How Your Diet Is Structured',
        duration: '5 min',
        intro: 'Your diet isn\'t just a list of foods to eat — it\'s a structured plan built around where you are right now and where you\'re going. Understanding the big picture makes every phase make sense.',
        sections: [
          {
            heading: 'Your Diet Has Levels',
            body: 'Think of your nutrition plan in three layers. The macrocycle is the whole journey — your entire diet from start to finish. The mesocycle is a phase within that journey, typically lasting 4 to 12 weeks. The microcycle is your weekly plan — what you\'re actually doing day to day.\n\nMost people only ever think about the microcycle. They think about today\'s meals or this week\'s calories. But your coach is thinking about all three levels at once — and that\'s what makes the difference between a plan that works and one that falls apart.',
          },
          {
            heading: 'Why the Start of a Cut Feels Manageable',
            body: 'When you first begin a cut, a few things are working in your favour. Your body fat is relatively high, which means your body can access plenty of stored energy. Your hunger hormones haven\'t been disrupted yet, so cravings are low. Your motivation is typically at its peak — you\'re fired up and ready to go. And your body is still recovering well from training.\n\nAll of this means the first phase of a cut is usually the most manageable. You\'re dieting, you\'re progressing, and it doesn\'t feel that hard. This is by design.',
          },
          {
            heading: 'Why It Gets Harder — And Why the Plan Evolves',
            body: 'As you get leaner, things change. Your hunger increases because your body is trying to protect its remaining fat stores. Your motivation can dip — this is completely normal and expected. Recovery from training takes a little longer. Your body is adapting to the lower calorie intake.\n\nThis is exactly why your plan changes over time. It\'s not because the original plan was wrong. It\'s not because you\'ve done something wrong. Your body is adapting, and a smart plan adapts with it. The diet gets smarter as you progress — not just harder.',
          },
          {
            heading: 'What This Means for You',
            body: 'When your coach adjusts your calories, your macros, or your refeed schedule, it\'s because the plan is working exactly as it should. Every change is intentional. Every phase has a purpose. You\'re not starting over — you\'re progressing to the next level of the plan.\n\nKnowing this helps you stay the course when things get tougher. The difficulty isn\'t a sign that something is wrong — it\'s a sign that you\'re getting leaner and your plan is keeping up with where your body is at.',
          },
        ],
        keyTakeaway: 'Your diet isn\'t random — it\'s periodized just like your training.',
        quiz: [
          {
            question: 'What is the "macrocycle" in your diet plan?',
            options: [
              'The big picture, whole-diet strategy from start to finish',
              'A single day of eating',
              'A type of macronutrient',
              'A 2-week meal plan',
            ],
            correct: 0,
            explanation: 'The macrocycle is the entire diet journey — the big picture plan from start to finish. Mesocycles are the phases within it, and microcycles are the weekly structure.',
          },
          {
            question: 'At the START of a cut, which of the following is typically HIGH?',
            options: [
              'Hunger',
              'Fatigue',
              'Motivation',
              'Stress',
            ],
            correct: 2,
            explanation: 'At the start of a cut, motivation is typically high. Hunger is lower because body fat is still relatively high, and the calorie deficit hasn\'t been in place long enough to trigger strong hunger responses.',
          },
          {
            question: 'Why does the diet plan change as you get leaner?',
            options: [
              'Because you made a mistake early on',
              'Because your body adapts — hunger and fatigue increase, so the plan must evolve to match where you are',
              'Because the original plan was wrong',
              'The plan never actually changes',
            ],
            correct: 1,
            explanation: 'As you get leaner, your body adapts by increasing hunger hormones and slowing recovery. The plan evolves to manage these changes — it\'s designed to, not broken.',
          },
          {
            question: 'How long is a typical mesocycle?',
            options: [
              '1 day',
              '1–3 days',
              '4–12 weeks',
              '6–12 months',
            ],
            correct: 2,
            explanation: 'A mesocycle is a phase within the overall diet plan, typically lasting 4 to 12 weeks. It represents a distinct block of training and nutrition with a specific focus.',
          },
        ],
      },
      {
        id: 'refeeds',
        title: 'Refeeds & Diet Breaks — Working Smarter',
        duration: '4 min',
        intro: 'A refeed isn\'t a cheat day and a diet break isn\'t giving up. They\'re strategic tools built into your plan — and the leaner you get, the more powerful they become.',
        sections: [
          {
            heading: 'What Is a Refeed?',
            body: 'A refeed is a planned day (or multiple days) where your calories are brought back up to around your maintenance level. This is not a cheat day. A cheat day is unplanned and usually involves eating way beyond maintenance with no structure. A refeed is calculated, controlled, and purposeful.\n\nThe primary way refeeds work is by replenishing muscle glycogen — the stored carbohydrate your muscles use as fuel during training. To fully top up your glycogen stores, you need around 10 grams of carbohydrate per kilogram of bodyweight across the day. That\'s a significant amount of carbs, which is exactly why refeeds are planned in advance.',
          },
          {
            heading: 'The Hormonal Side of Refeeds',
            body: 'Beyond glycogen, refeeds also temporarily restore hormone levels — particularly leptin, the hormone that signals fullness and regulates energy balance. When you\'ve been dieting for a while, leptin levels drop, which is part of why hunger increases and motivation dips.\n\nBringing calories back up to maintenance for a day or two gives your hormonal system a chance to reset. It won\'t undo weeks of dieting, but it does take the edge off and allows your body to perform better when you go back into a deficit.',
          },
          {
            heading: 'The Leaner You Get, the More You Benefit',
            body: 'Here\'s something important: the benefit of refeeds increases the leaner you are. When you\'re at a higher body fat percentage — say 15 to 20 percent — refeeds help but aren\'t critical. When you\'re very lean — say 6 to 10 percent — refeeds become genuinely necessary to maintain performance and preserve muscle.\n\nThis is why a well-structured plan will typically move from one refeed per week early in a cut, to two or three refeeds per week when you\'re very lean. It\'s not more refeeds because the plan is getting easier on you — it\'s more refeeds because your body needs them to keep going at that leanness.',
          },
          {
            heading: 'Diet Breaks — A Week at Maintenance',
            body: 'A diet break is a longer pause from the deficit — typically one week or more spent at maintenance calories. Diet breaks serve a dual purpose. Physically, they allow a more thorough hormonal and metabolic reset. Psychologically, they give your mind a genuine rest from the mental load of dieting.\n\nThis is not failure. This is not quitting. A diet break is one of the most powerful tools in a longer cut — and it\'s planned into the programme from the start. Clients who use diet breaks tend to have better adherence, better performance, and better long-term results than those who try to push straight through.',
          },
        ],
        keyTakeaway: 'Refeeds and diet breaks are weapons, not weaknesses.',
        quiz: [
          {
            question: 'What is a refeed day?',
            options: [
              'An unplanned cheat day where you eat freely',
              'A planned day at maintenance calories to restore glycogen and hormones',
              'A day where you eat only protein',
              'A full week off dieting',
            ],
            correct: 1,
            explanation: 'A refeed is a carefully planned day at maintenance calories — not a cheat day. It\'s designed to replenish glycogen and partially restore hormones like leptin, with a specific carbohydrate target in mind.',
          },
          {
            question: 'How does the benefit of refeeds change as you get leaner?',
            options: [
              'The benefit decreases — you need them less when lean',
              'The benefit stays the same regardless of body fat',
              'The benefit increases — leaner people benefit more from refeeds',
              'Refeeds only help people above 20% body fat',
            ],
            correct: 2,
            explanation: 'The leaner you are, the more you benefit from refeeds. At very low body fat percentages, refeeds become genuinely necessary to maintain performance and prevent excessive muscle loss.',
          },
          {
            question: 'How much carbohydrate is typically needed to fully replenish muscle glycogen?',
            options: [
              '2g per kg of bodyweight',
              '5g per kg of bodyweight',
              '10g per kg of bodyweight',
              '20g per kg of bodyweight',
            ],
            correct: 2,
            explanation: 'Fully replenishing muscle glycogen requires approximately 10 grams of carbohydrate per kilogram of bodyweight. This is why refeed days are high in carbohydrates and carefully planned.',
          },
          {
            question: 'What is the purpose of a diet break between phases?',
            options: [
              'To quit dieting altogether',
              'Both psychological relief and a physiological reset — it\'s a planned tool',
              'To build as much muscle as possible',
              'To eat whatever you want with no structure',
            ],
            correct: 1,
            explanation: 'A diet break serves both psychological and physiological purposes. It gives your mind a rest from dieting while allowing a more thorough hormonal and metabolic reset before the next phase.',
          },
        ],
      },
      {
        id: 'flexible-dieting',
        title: 'Flexible Dieting — Making It Sustainable',
        duration: '4 min',
        intro: 'The best diet is the one you can actually stick to. Flexibility isn\'t a compromise — it\'s a strategy that produces better results than rigid perfection.',
        sections: [
          {
            heading: 'The Hierarchy of Tracking',
            body: 'Not all tracking is equal, but all of it can work. Here\'s how to think about it. The most precise approach is tracking all macros — protein, carbs, and fats — every day. A step down is tracking just calories and protein, which covers the two variables that matter most. The most relaxed approach is tracking calories only. Each level down gives you a little less precision but a lot more sustainability.\n\nThe goal isn\'t to track as much as possible. The goal is to track as little as possible while still hitting your targets. More tracking than necessary just adds stress without adding results.',
          },
          {
            heading: 'The 20% Borrowing Rule',
            body: 'Your weekly calorie target matters more than any single day. This means you have flexibility to shift calories between days — up to around 20% — without hurting your progress.\n\nFor example, if you know Friday night is a social event and you\'ll be eating more, you can save some of that allowance across the week. If Monday was especially light, you can carry those extra calories forward. This isn\'t cheating — it\'s planning. Managing your week as a whole, rather than each day in isolation, removes a huge amount of stress and improves long-term adherence.',
          },
          {
            heading: 'Flexible vs Rigid Dieting',
            body: 'Rigid dieting — where every meal is the same, every day is identical, and any deviation feels like failure — actually produces worse outcomes than flexible dieting in practice. The reason is simple: rigid dieting breaks under real-world pressure. Social events, travel, stress, hunger — all of these cause rigid dieters to abandon the plan entirely rather than adapt.\n\nFlexible dieters adapt. They hit their week, even if individual days look different. Adherence over time is what drives results — and flexibility is what drives adherence.',
          },
          {
            heading: 'How Tracking Changes by Phase',
            body: 'During a cut or competition prep, you\'ll want to track macros within 5 to 10 grams of your targets. Precision matters more when calories are tight and every macro serves a specific purpose.\n\nDuring a gaining phase, the approach is much more relaxed. Hitting your protein target and staying roughly within your calorie range is usually enough. The goal here is to support growth, not to hit exact numbers every day. As you get more experienced, you\'ll find you can do less tracking and still get great results — because you\'ve built the knowledge and habits to eat right without obsessing over every gram.',
          },
        ],
        keyTakeaway: 'The best diet is the one you can stick to — flexibility is a feature, not a bug.',
        quiz: [
          {
            question: 'In flexible dieting, what is the MOST precise tracking approach?',
            options: [
              'Tracking calories only',
              'Tracking all macros — protein, carbs, and fats',
              'Just eating healthy foods without tracking',
              'Tracking only protein and calories',
            ],
            correct: 1,
            explanation: 'Tracking all macros is the most precise approach in flexible dieting. It gives you full control over protein, carbs, and fats. Tracking calories and protein is a strong second option for most phases.',
          },
          {
            question: 'What does "20% borrowing" mean in flexible dieting?',
            options: [
              'Eating 20% more than your daily target',
              'Shifting up to 20% of your weekly calories from one day to another based on your schedule',
              'Borrowing food from someone else\'s meal plan',
              'Leaving 20% of your meals completely untracked',
            ],
            correct: 1,
            explanation: 'The 20% borrowing rule means you can shift up to 20% of your daily calories to another day in the week without hurting progress. Your weekly total matters more than any single day.',
          },
          {
            question: 'Compared to rigid dieting, flexible dieting tends to...',
            options: [
              'Produce worse body composition results',
              'Produce similar or better outcomes with significantly better adherence over time',
              'Be harder to follow in the real world',
              'Only work for advanced athletes who have years of experience',
            ],
            correct: 1,
            explanation: 'Flexible dieting consistently outperforms rigid dieting in practice because adherence is better. A plan you can stick to beats a perfect plan you abandon.',
          },
          {
            question: 'During a gaining phase, how much tracking is typically needed?',
            options: [
              'Precise macro tracking every single day to the gram',
              'As little as possible to maintain progress — often just protein and calories',
              'No tracking ever, just eat whatever you want',
              'Exact gram-level tracking of every food consumed',
            ],
            correct: 1,
            explanation: 'During a gaining phase, hitting your protein target and staying roughly within your calorie range is usually sufficient. Excessive tracking during a gain adds stress without meaningful benefit.',
          },
        ],
      },
      {
        id: 'nutritional-peaking',
        title: 'Peaking — Looking Your Best When It Counts',
        duration: '4 min',
        intro: 'Nutritional peaking is the final-week strategy that brings everything together for a specific moment — a competition, a photo shoot, or an event where you want to look and feel your absolute best.',
        sections: [
          {
            heading: 'What Is Nutritional Peaking?',
            body: 'Nutritional peaking refers to a set of strategic adjustments made in the final days before a specific event to make you look as lean and full as possible at exactly the right moment. It\'s not a long-term strategy — it\'s a short-term tool with a very specific purpose.\n\nPeaking involves carefully manipulating carbohydrates, water intake, and sodium levels in the final days of your prep. Done correctly, it can make a noticeable difference in how you present on the day. Done incorrectly, it can backfire — which is why it\'s guided by your coach and not something to experiment with randomly.',
          },
          {
            heading: 'What Gets Manipulated and Why',
            body: 'The three main variables in a peak are carbohydrates, water, and sodium. Carbohydrates drive glycogen storage — when your muscles are full of glycogen, they look fuller and harder. Water and sodium affect how much water your body holds under the skin versus inside the muscle.\n\nThe goal is to have maximum water inside the muscles (making them full and rounded) and minimum water under the skin (reducing the soft, blurry look). Getting this balance right takes planning, practice, and good timing — which is why peaking is a skill, not just a protocol.',
          },
          {
            heading: 'Weight Classes and Cutting',
            body: 'For those competing in weight-class sports, peaking also involves managing your weight on the day. Most athletes have three realistic options: competing at their current weight class, moving up one class, or moving down one class. Moving too far in either direction almost always hurts performance more than it helps.\n\nMoving down a weight class can improve your relative strength if done carefully — meaning you\'re stronger relative to your bodyweight. But it can also reduce your absolute strength and leave you depleted on competition day if you\'ve cut too aggressively. Your coach weighs all of this when deciding whether a weight cut is worth it.',
          },
          {
            heading: 'When to Use Peaking',
            body: 'Peaking should only be used when you have a genuine reason for it — a competition, a photo shoot, a wedding, or another event where presentation matters. It is not something to do every few weeks just to see how you look. The reason is simple: peaking protocols involve temporary manipulation of variables that your body normally keeps stable, and doing this repeatedly without reason just adds unnecessary stress with no lasting benefit.\n\nIf you have an event coming up, flag it with your coach well in advance. A good peak is planned weeks ahead — not improvised in the last 48 hours.',
          },
        ],
        keyTakeaway: 'Peaking is a short-term tool — use it for events, not as a regular strategy.',
        quiz: [
          {
            question: 'What is "nutritional peaking"?',
            options: [
              'Eating your highest calories ever to maximise energy',
              'Strategic final-week nutrition adjustments to look and perform your best at a specific event',
              'A long-term diet strategy for sustained fat loss',
              'Eating at maintenance calories year-round',
            ],
            correct: 1,
            explanation: 'Nutritional peaking is a short-term, event-specific strategy involving precise manipulation of nutrition variables in the final days before a competition or event.',
          },
          {
            question: 'What do you primarily manipulate during a nutritional peak?',
            options: [
              'Protein intake only',
              'Carbohydrates, water, and sodium',
              'Fat intake only',
              'Supplements and protein shakes only',
            ],
            correct: 1,
            explanation: 'The three primary variables manipulated during a peak are carbohydrates (for glycogen loading), water, and sodium (to manage where water is stored in the body).',
          },
          {
            question: 'Who should use a peaking protocol?',
            options: [
              'Anyone who wants to see how they look, at any time',
              'People who have a specific event, competition, or photo shoot coming up',
              'Beginners only — it\'s too risky for advanced athletes',
              'Only people above 20% body fat',
            ],
            correct: 1,
            explanation: 'Peaking is designed for a specific occasion — a competition, photo shoot, or event. Using it randomly without purpose adds unnecessary physiological stress with no lasting benefit.',
          },
          {
            question: 'What is a potential DOWNSIDE of cutting weight for a weight class?',
            options: [
              'Increased motivation and performance',
              'A possible decrease in absolute strength if the cut is too aggressive',
              'Better recovery capacity going into competition',
              'More energy available on competition day',
            ],
            correct: 1,
            explanation: 'Cutting too aggressively to make a weight class can reduce absolute strength and leave you depleted on competition day. Whether a weight cut is worthwhile depends on how much needs to be cut and how much time is available.',
          },
        ],
      },
    ],
  },

  // ============================================================
  // COURSE 2: TRAINING DESIGN
  // ============================================================
  {
    id: 'training-design',
    title: 'How Your Training Is Designed',
    description: 'Understand why your programme is built the way it is — and how to get the most from it.',
    icon: '🏗️',
    color: 'var(--info)',
    modules: [
      {
        id: 'periodization-basics',
        title: 'Why Your Training Changes Over Time',
        duration: '5 min',
        intro: 'Your training isn\'t random and it doesn\'t stay the same. Understanding why it changes — and how those changes are structured — will help you trust the process and get more out of every session.',
        sections: [
          {
            heading: 'What Is Periodization?',
            body: 'Periodization is the planned, structured manipulation of your training variables — things like volume, intensity, exercise selection, and rest periods — over time. The goal is to maximise adaptation while preventing plateau and overuse injury.\n\nWithout periodization, most people plateau. They keep doing the same thing, the same way, at roughly the same intensity — and their body stops adapting because it has no reason to change. A periodized plan keeps your body in a state of managed challenge, always progressing in some direction.',
          },
          {
            heading: 'Three Types of Periodization',
            body: 'Linear periodization is the simplest approach: you build steadily over time, adding weight or volume in a consistent, predictable way. It works very well for beginners and intermediate lifters who can still make predictable progress session to session.\n\nDaily Undulating Periodization (DUP) varies the volume and intensity more frequently — often within the same week. One session might be higher volume and moderate weight, while another is lower volume and heavier. This keeps the body adapting from multiple angles at once and works well for intermediate to advanced lifters.\n\nBlock periodization groups similar training goals into distinct phases — a volume block, then an intensity block, then a peak. Each block builds on the last. This is the approach used in most advanced programmes, including the one your coach builds for you.',
          },
          {
            heading: 'Why Periodized Training Outperforms Non-Periodized Training',
            body: 'A well-structured periodized programme consistently produces better results than training without structure. The reason is straightforward: your body adapts to specific stressors. If the stimulus never changes, adaptation stops. If it changes too randomly, the body can\'t build on previous work.\n\nPeriodization hits the sweet spot — enough structure to build progressively, enough variation to keep adaptation happening. It\'s not complicated once you understand the logic. Your coach handles the structure so you can focus on executing it.',
          },
          {
            heading: 'Training Frequency — How Often Is Right?',
            body: 'For most people, training each muscle group two to three times per week produces better results than once a week. More frequent training allows you to accumulate more total volume without any single session being overwhelming.\n\nFrequency also improves skill development — you get more practice at the movements, which means better technique and more efficient force production over time. The exact frequency in your programme is matched to your level and your recovery capacity — it\'s not arbitrary.',
          },
        ],
        keyTakeaway: 'The plan changes because your body adapts — structure is what keeps progress coming.',
        quiz: [
          {
            question: 'What is periodization?',
            options: [
              'Random training variation to keep things interesting',
              'Planned manipulation of training variables over time to maximise adaptation',
              'Always lifting as heavy as possible every session',
              'Doing the same training programme every week indefinitely',
            ],
            correct: 1,
            explanation: 'Periodization is the deliberate, planned manipulation of training variables — volume, intensity, exercise selection — over time to keep the body adapting and prevent plateau.',
          },
          {
            question: 'What is Daily Undulating Periodization (DUP)?',
            options: [
              'Training exactly the same way every day',
              'Varying volume and intensity across different training days within the same week',
              'Only training one day per week at maximum intensity',
              'Adding a fixed amount of weight to every lift every session',
            ],
            correct: 1,
            explanation: 'DUP varies the volume and intensity across sessions within a week — for example, one session is higher volume and moderate weight, while another is heavier with fewer reps. This allows the body to adapt from multiple angles.',
          },
          {
            question: 'Which type of training consistently outperforms the alternative?',
            options: [
              'Non-periodized training — more freedom means more progress',
              'Periodized training — structure drives better long-term adaptation',
              'Both approaches produce identical results',
              'Whichever approach the individual personally prefers',
            ],
            correct: 1,
            explanation: 'Periodized training consistently outperforms non-periodized training because it provides the right stimulus at the right time — enough structure for progressive overload, enough variation to prevent adaptation plateau.',
          },
          {
            question: 'What is the optimal training frequency per muscle group for most people?',
            options: [
              'Once per week per muscle group',
              '2–3 times per week per muscle group',
              'Every single day for maximum stimulus',
              'Once a fortnight is enough for advanced lifters',
            ],
            correct: 1,
            explanation: 'Training each muscle group 2–3 times per week produces better results for most people because it allows greater total volume accumulation while keeping each individual session manageable.',
          },
        ],
      },
      {
        id: 'volume-intensity',
        title: 'Volume vs Intensity — What They Mean and Why Both Matter',
        duration: '5 min',
        intro: 'Volume and intensity are the two biggest levers in your training. Understanding what they actually mean — and how they work together — will help you understand why your programme is built the way it is.',
        sections: [
          {
            heading: 'What Volume and Intensity Actually Mean',
            body: 'Training volume is the total amount of work you do. The simple formula is sets multiplied by reps multiplied by the weight lifted. A higher volume session means more total work — more sets, more reps, or both.\n\nTraining intensity refers to how heavy the weight is relative to your maximum. If your one-rep max on a squat is 100kg and you\'re squatting 80kg, you\'re training at 80% intensity. Intensity is about load — how challenging the weight is — not how hard the session feels overall.',
          },
          {
            heading: 'What Each One Drives',
            body: 'Volume is the primary driver of muscle growth and work capacity. When you do more total work over time, your muscles adapt by growing and becoming more capable. Higher volume phases are where a lot of the hypertrophy (muscle-building) happens.\n\nIntensity is the primary driver of strength. Heavy loads train your nervous system to produce more force and recruit more muscle fibres efficiently. You need intensity to get strong, and you need volume to build the muscle that makes strength possible. They work together — one without the other leaves results on the table.',
          },
          {
            heading: 'How Volume and Intensity Phases Work Together',
            body: 'A volume block typically involves higher rep ranges, more sets, and moderate weights. You\'re building the foundation — more muscle, more capacity, more resilience. This phase can feel tough because the total workload is high, but the weights aren\'t necessarily at their heaviest.\n\nAn intensity block follows — lower reps, heavier weights, and fewer total sets. This is where you convert the foundation you built into strength. The weights feel heavy, but you\'re doing less total work. Together, these two blocks produce better results than either one alone.',
          },
          {
            heading: 'Why Volume Needs to Be Spread Across the Week',
            body: 'There\'s a limit to how much productive training you can do in a single session. Beyond a certain point, fatigue means you\'re no longer training at the quality needed to drive adaptation.\n\nThis is why spreading volume across multiple sessions per week is more effective than cramming everything into one or two long workouts. When you come into each session reasonably fresh, you can train at a higher quality — better technique, better effort, better results. Your programme is designed with this in mind.',
          },
        ],
        keyTakeaway: 'Volume builds the engine. Intensity makes it powerful. You need both.',
        quiz: [
          {
            question: 'What does "training volume" mean?',
            options: [
              'How loudly you train in the gym',
              'Total work done — calculated as sets × reps × load',
              'Only the number of sets you complete',
              'How intense the workout feels subjectively',
            ],
            correct: 1,
            explanation: 'Training volume is total work done, calculated as sets multiplied by reps multiplied by the load lifted. More volume means more total mechanical work on the muscles.',
          },
          {
            question: 'What is the main purpose of a volume training block?',
            options: [
              'To peak for a competition at maximum strength',
              'To build muscle mass and work capacity as a foundation for future strength',
              'To test your current one-rep max across all lifts',
              'To reduce your overall training load and recover',
            ],
            correct: 1,
            explanation: 'Volume blocks build the foundation — more muscle, more capacity, more resilience. This foundation is then converted into strength during an intensity block.',
          },
          {
            question: 'Why should training volume be spread across multiple sessions per week?',
            options: [
              'So you don\'t get bored doing the same thing every day',
              'So each session you arrive recovered enough to train with good quality and effort',
              'To save time by shortening individual sessions',
              'It doesn\'t matter how volume is distributed — only the weekly total matters',
            ],
            correct: 1,
            explanation: 'Spreading volume across the week ensures each session is done at a high quality. Cramming too much into one session leads to fatigue that undermines performance and adaptation.',
          },
          {
            question: 'An intensity training block focuses on...',
            options: [
              'High reps, low weight to maximise muscle pump',
              'Lower reps with heavier weights to convert your training base into strength',
              'Cardiovascular conditioning and endurance',
              'Accessory isolation work only',
            ],
            correct: 1,
            explanation: 'Intensity blocks use lower reps and heavier weights to train the nervous system and convert the muscle built during a volume block into expressed strength.',
          },
        ],
      },
      {
        id: 'progression',
        title: 'How the Weights Progress — Week by Week',
        duration: '4 min',
        intro: 'Progress isn\'t just adding a bit of weight every week. There are smarter, more effective ways to manage how your loads progress — and your programme uses them.',
        sections: [
          {
            heading: 'The Basics: Linear Progression',
            body: 'The simplest form of progression is adding a fixed amount of weight each week. For a beginner, this might look like adding 2.5kg to a squat every session. It\'s simple, predictable, and very effective early on.\n\nThe problem is that linear progression has a natural ceiling. Your body can\'t keep adapting at a fixed rate indefinitely. At some point, you need smarter approaches to keep moving forward.',
          },
          {
            heading: 'APRE — Training Based on What You Actually Do',
            body: 'APRE stands for Autoregulatory Progressive Resistance Exercise. Instead of deciding next week\'s weights in advance, APRE determines them based on how you actually performed this week.\n\nAfter your main sets, you do a "plus set" — as many reps as possible with good form. If you get 9 to 10 reps, you add more weight next session. If you get 7 to 8 reps, you add a smaller increment. If you got fewer, you add very little or hold. This system means your programme automatically adjusts to how your body is actually responding — not how a spreadsheet predicted it would.',
          },
          {
            heading: 'RPE-Based Progression',
            body: 'RPE (Rate of Perceived Exertion) gives you another way to manage load. If a weight that was programmed at RPE 8 felt like an RPE 6 — meaning it was much easier than expected — you add more weight. If it felt like an RPE 9 — harder than it should have been — you hold or reduce slightly.\n\nThis accounts for the reality that your strength varies day to day. Stress, sleep, nutrition, and accumulated fatigue all affect performance. An RPE-based approach lets the programme adapt to your real state rather than assuming you\'re always the same.',
          },
          {
            heading: 'Why You Won\'t Progress Every Week Forever',
            body: 'No training programme produces progress every single week indefinitely — and any programme that promises otherwise isn\'t being honest with you. Your body adapts, recovery takes time, and some weeks are harder than others.\n\nWhat a well-designed programme does is build in structure to manage this reality. Deload weeks reduce fatigue so you can peak at the right moments. Phase changes refresh the stimulus. Autoregulatory tools keep loads accurate. The goal is long-term progress, not a perfect upward line every single week.',
          },
        ],
        keyTakeaway: 'Progress isn\'t just adding weight every week — it\'s a managed, intelligent process.',
        quiz: [
          {
            question: 'What is APRE?',
            options: [
              'A warm-up protocol used before heavy lifting',
              'A system where next week\'s training load is determined by how many reps you performed this week',
              'A stretching protocol for recovery',
              'Adding a fixed, predetermined amount each and every session',
            ],
            correct: 1,
            explanation: 'APRE (Autoregulatory Progressive Resistance Exercise) uses your actual performance — specifically how many reps you get on a plus set — to determine the load for your next session.',
          },
          {
            question: 'In APRE, if your plus set gives you 9–10 reps, what happens next session?',
            options: [
              'The weight stays exactly the same',
              'The weight is reduced to reset',
              'More weight is added for next session',
              'The rep target increases instead of the weight',
            ],
            correct: 2,
            explanation: 'Getting 9–10 reps on a plus set indicates the weight was too light for the prescribed intensity. More weight is added for the next session to maintain the correct training stimulus.',
          },
          {
            question: 'What is "progressive overload"?',
            options: [
              'Training to absolute failure every single set',
              'Consistently doing slightly more over time to force the body to continue adapting',
              'Adding the maximum amount of weight possible each session',
              'Always training with the heaviest weight you can possibly handle',
            ],
            correct: 1,
            explanation: 'Progressive overload means consistently doing slightly more than before — whether that\'s more weight, more reps, or more total sets. This ongoing challenge is what forces the body to keep adapting.',
          },
          {
            question: 'Why doesn\'t progress happen every single week indefinitely?',
            options: [
              'Because the programme is poorly designed',
              'Because the body has limits and adapts — a smart programme manages this rather than ignoring it',
              'Because you\'re not trying hard enough in the gym',
              'Progression is unlimited if you just keep adding weight',
            ],
            correct: 1,
            explanation: 'The body has adaptation limits, and fatigue accumulates over time. A smart programme manages this with deloads, phase changes, and autoregulatory tools — rather than assuming linear progress forever.',
          },
        ],
      },
      {
        id: 'overreaching-tapering',
        title: 'Overreaching & Tapering — Planned Fatigue Then Peak',
        duration: '4 min',
        intro: 'Feeling fatigued mid-block isn\'t a problem — it\'s often the plan. Understanding overreaching and tapering will help you trust the process when things feel hard, and peak when it matters.',
        sections: [
          {
            heading: 'What Is Overreaching?',
            body: 'Overreaching is a deliberate, short-term period of higher training volume and frequency than your body is fully adapted to. Typically this lasts two to three weeks. During this time, fatigue accumulates. Lifts might feel harder. Recovery might take longer. You might feel like you\'re going backwards.\n\nThis is intentional. Overreaching creates a training stimulus your body hasn\'t experienced before, which forces it to prepare to handle it. The fatigue is part of the process — not a sign something is wrong. The key word is deliberate: overreaching is planned, controlled, and followed by a specific phase designed to let that work pay off.',
          },
          {
            heading: 'The Taper — Where the Work Pays Off',
            body: 'After an overreaching block, the volume is dramatically reduced — typically by 50 to 80 percent. This is the taper. Intensity (how heavy the weights are) stays the same or even increases slightly. Frequency stays roughly the same.\n\nWhat happens during a taper is that accumulated fatigue clears while the adaptations from the overreaching block remain. As fatigue drops away, your performance rises. Strength and power that were masked by fatigue suddenly express themselves. Athletes almost always set personal bests in the week or two after a well-executed taper.',
          },
          {
            heading: 'Introductory Microcycles — Easing Into New Blocks',
            body: 'At the start of a new training block, you don\'t jump straight into maximum volume and intensity. Instead, the first one or two weeks are an introductory microcycle — lighter work that lets your body adjust to new exercises, new rep ranges, and new movement patterns.\n\nThis serves two purposes. First, it reduces the risk of injury when the movement patterns are new. Second, it establishes a baseline so that progression through the block is meaningful and measurable.',
          },
          {
            heading: 'Trusting the Timing',
            body: 'The hardest part of overreaching for most people is trusting that the fatigue is temporary and purposeful. When you\'re in the middle of a hard block and things feel difficult, the temptation is to back off or question the programme.\n\nStay the course. The taper is coming, and it works. Your coach has structured the timing so that you peak at the right moment — whether that\'s a competition, a test week, or simply the start of a new phase. The hard part is temporary. The results last.',
          },
        ],
        keyTakeaway: 'Feeling tired mid-block is usually planned — the taper is where it all comes together.',
        quiz: [
          {
            question: 'What is "overreaching" in the context of a training programme?',
            options: [
              'Accidentally training too hard without a plan',
              'A deliberate 2–3 week period of higher volume to create controlled, intentional fatigue',
              'Training with bad technique on heavy exercises',
              'Not recovering properly between sessions',
            ],
            correct: 1,
            explanation: 'Overreaching is a planned, controlled phase of higher training stress. It\'s intentional — the goal is to create a stimulus that forces adaptation, followed by a taper where that adaptation is expressed.',
          },
          {
            question: 'How should training volume change during a taper?',
            options: [
              'Increase significantly to capitalise on built-up fitness',
              'Stay exactly the same as the overreaching block',
              'Decrease by 50–80% while keeping intensity and frequency maintained',
              'Drop to zero — complete rest only',
            ],
            correct: 2,
            explanation: 'During a taper, volume drops by 50–80% to allow fatigue to clear. Intensity stays the same or slightly increases, and frequency is maintained so the training stimulus is preserved.',
          },
          {
            question: 'During a taper, what happens to intensity and training frequency?',
            options: [
              'Both are significantly reduced',
              'Intensity is maintained and frequency is maintained — only volume drops',
              'Both are increased to maximise final adaptation',
              'Intensity increases while frequency drops to zero',
            ],
            correct: 1,
            explanation: 'During a taper, volume drops significantly but both intensity and frequency are maintained. This allows fatigue to dissipate while keeping the training signal strong enough to preserve fitness.',
          },
          {
            question: 'Why is an introductory microcycle included at the start of a new training block?',
            options: [
              'To test your one-rep max before the block begins',
              'To ease into the new stimulus, adapt to new movements, and reduce injury risk',
              'To boost volume immediately for maximum early adaptation',
              'Introductory microcycles are not necessary — full intensity from day one is better',
            ],
            correct: 1,
            explanation: 'Introductory microcycles at the start of a new block allow your body to adjust to new exercises, rep ranges, and movement patterns at lower intensity — reducing injury risk and establishing a meaningful baseline.',
          },
        ],
      },
    ],
  },

  // ============================================================
  // COURSE 3: RPE
  // ============================================================
  {
    id: 'rpe',
    title: 'Train by Feel — Understanding RPE',
    description: 'Learn to listen to your body and train smarter using the RPE system.',
    icon: '🎯',
    color: 'var(--warn)',
    modules: [
      {
        id: 'rpe-basics',
        title: 'What is RPE and Why Does It Matter?',
        duration: '4 min',
        intro: 'RPE sounds technical, but the concept is simple and incredibly powerful. Once you understand it, you\'ll never think about training intensity the same way again.',
        sections: [
          {
            heading: 'What RPE Means in Strength Training',
            body: 'RPE stands for Rate of Perceived Exertion. In strength training, it\'s measured using Reps in Reserve (RIR) — how many more reps you could have done with good form before failing.\n\nRPE 10 means you gave absolutely everything — no reps left in the tank. RPE 9 means you had one more rep left. RPE 8 means two reps left. RPE 7 means three reps left. Simple, practical, and powerful.',
          },
          {
            heading: 'Why RPE Is More Useful Than Fixed Percentages',
            body: 'A fixed percentage approach assumes you\'re always the same. If your one-rep max is 100kg, training at 80% always means 80kg. But your actual strength on any given day varies — based on sleep, stress, nutrition, accumulated fatigue, and a dozen other factors.\n\nRPE doesn\'t assume anything. If 80kg feels like an RPE 8 on a good day but an RPE 9 on a bad day, the RPE system tells you to adjust. The load reflects where you actually are today — not where a formula says you should be. This means you\'re always training at the right intensity, not just a number on paper.',
          },
          {
            heading: 'How Accurate Is RPE in Practice?',
            body: 'Experienced lifters are typically accurate to within about one rep when estimating their Reps in Reserve. That\'s remarkably precise for a subjective measure.\n\nAccuracy improves in two situations: when the weight is closer to your maximum (you can feel how much is left more clearly), and with more training experience (you develop a better internal sense of effort). Beginners tend to underestimate how much they have left — they stop earlier than they need to. This is normal and improves with practice.',
          },
          {
            heading: 'How RPE Is Used in Your Programme',
            body: 'Your coach uses RPE targets in multiple ways. RPE guides the load you select for a given session. It signals week-to-week progression — if the weight felt easier than the prescribed RPE, you can add more. It allows volume to be autoregulated — doing more sets on good days, fewer on tough days.\n\nThis isn\'t guesswork. It\'s a precise, evidence-informed system that makes your programme responsive to your actual body rather than a rigid external standard.',
          },
        ],
        keyTakeaway: 'RPE means training at the right intensity for YOUR body on THAT day.',
        quiz: [
          {
            question: 'What does RPE 8 mean in strength training?',
            options: [
              'Maximum effort — you have nothing left',
              '2 reps left in reserve — you could have done 2 more before failing',
              '80% of your one-rep maximum',
              'An easy warm-up effort with plenty left',
            ],
            correct: 1,
            explanation: 'RPE 8 means 2 reps in reserve — you completed your set and could have done 2 more reps with good form. RPE 10 is true maximum with nothing left.',
          },
          {
            question: 'Why is RPE more flexible and useful than fixed percentages?',
            options: [
              'It\'s easier to calculate in the gym',
              'It adjusts to how you actually feel and perform each day, rather than assuming you\'re always the same',
              'It requires no training experience to use accurately',
              'It always produces heavier loads than percentage-based systems',
            ],
            correct: 1,
            explanation: 'RPE adapts to your actual state on any given day. Factors like sleep, stress, and fatigue all affect performance — RPE accounts for this, while fixed percentages don\'t.',
          },
          {
            question: 'When does RPE accuracy improve the most?',
            options: [
              'On rest days when you\'re fully fresh',
              'When working closer to failure and with more training experience',
              'When using lighter weights with more reps',
              'When training alone without a training partner',
            ],
            correct: 1,
            explanation: 'RPE accuracy improves as weights approach your maximum (you can feel more clearly how much is left) and with experience (better internal calibration of effort).',
          },
          {
            question: 'In strength training, RPE is based on...',
            options: [
              'Heart rate during the set',
              'Reps in Reserve — how many more reps you could have completed with good form',
              'Bar speed measured with a sensor',
              'Time under tension across the full set',
            ],
            correct: 1,
            explanation: 'In strength training, RPE is operationalised as Reps in Reserve (RIR) — the number of additional reps you could have performed with good form before reaching failure.',
          },
        ],
      },
      {
        id: 'rpe-load',
        title: 'Using RPE to Set and Adjust Your Training Loads',
        duration: '4 min',
        intro: 'Knowing what RPE means is one thing. Knowing how to use it to select weights and adjust on the fly is where it becomes a genuine training superpower.',
        sections: [
          {
            heading: 'Finding Your Working Weight Using RPE',
            body: 'When your programme prescribes a set at RPE 8, here\'s how you use it. Start with a weight you think will be around that difficulty. Complete your set. If it felt like an RPE 6 — you had four reps left — the weight is too light and you add more. If it felt like an RPE 9 — you had one rep left — the weight was slightly too heavy and you back off a touch.\n\nOver time, you develop a good feel for where to start. In the meantime, it\'s always better to start a little lighter and build up than to go too heavy and compromise the whole session.',
          },
          {
            heading: 'Adjusting Based on How the Session Feels',
            body: 'RPE during your warm-up tells you a lot about how the session is going to go. If your warm-up weights feel significantly heavier than usual at the same RPE, that\'s a signal — today might not be your strongest day. Manage your expectations and don\'t chase weights you\'d normally hit.\n\nConversely, if warm-up weights feel very easy, it\'s a signal you\'re in a good state. You might be able to push a little harder. This is intelligent training — reading the signals your body is giving you and responding accordingly.',
          },
          {
            heading: 'RPE Targets Across Different Training Blocks',
            body: 'Your coach deliberately programmes different RPE targets at different points in your programme. During a volume block, RPE targets are typically lower — around 5 to 7. The focus is on accumulating work, not hitting maximum effort. Keeping RPE lower means you can do more total sets and reps without exceeding your recovery capacity.\n\nDuring an intensity block, RPE targets rise — 8 to 10. Now you\'re working closer to your limit, and the lower volume means the higher effort is sustainable. The RPE target is always matched to the goal of that block.',
          },
          {
            heading: 'Adjusting Is Not Weakness',
            body: 'One of the most important mindset shifts with RPE is understanding that adjusting your load based on how you feel is not weakness — it\'s intelligence. Ego lifting (doing the weight you think you should do rather than the weight that matches the RPE) leads to poor technique, missed rep targets, and unnecessary injury risk.\n\nThe RPE system gives you explicit permission to adjust. Use it. Your coach would rather you hit the right RPE at a slightly lighter weight than miss the target entirely at a weight that was too heavy.',
          },
        ],
        keyTakeaway: 'RPE gives you permission to adjust — it\'s not weakness, it\'s intelligence.',
        quiz: [
          {
            question: 'If your prescribed RPE is 8 but the weight feels like a 6, what should you do?',
            options: [
              'Stop the set immediately — something is wrong',
              'Add more weight to reach the prescribed RPE 8 target',
              'Record it as RPE 8 anyway and move on',
              'Rest longer before the next set',
            ],
            correct: 1,
            explanation: 'If the weight feels easier than prescribed (RPE 6 vs target of 8), you add more weight to reach the correct training stimulus. RPE is the target, not the load itself.',
          },
          {
            question: 'During a volume training block, RPE targets are typically...',
            options: [
              'At maximum — RPE 9 to 10 every set',
              'Lower — around RPE 5 to 7 to allow more total work volume',
              'Maximum effort on every single set regardless of the block',
              'Below RPE 5 to keep the training very easy',
            ],
            correct: 1,
            explanation: 'Volume blocks use lower RPE targets (5–7) so you can accumulate more total work without exceeding your recovery capacity. Saving effort for volume is the priority in these phases.',
          },
          {
            question: 'What does a harder-than-expected warm-up tell you about the session ahead?',
            options: [
              'You need more pre-workout caffeine',
              'Today\'s performance may be reduced — you should manage your expectations and adjust loads accordingly',
              'Nothing useful — warm-up difficulty doesn\'t predict session performance',
              'You should skip the session entirely',
            ],
            correct: 1,
            explanation: 'Warm-up RPE is a valuable signal. If warm-up weights feel harder than expected, your recovery or readiness may be lower than usual. Adjusting your working loads accordingly is smart programming, not weakness.',
          },
          {
            question: 'The primary goal of RPE-based load prescription is...',
            options: [
              'Always lifting the maximum weight possible regardless of circumstances',
              'Hitting the right intensity for the training goal on that specific day',
              'Avoiding all heavy lifting to prevent injury',
              'Training to absolute failure on every set for maximum stimulus',
            ],
            correct: 1,
            explanation: 'RPE-based prescription aims to match training intensity to the goal of the session and the individual\'s state that day — not to maximise load or hit failure every set.',
          },
        ],
      },
      {
        id: 'apre-autoregulation',
        title: 'APRE & Volume Autoregulation',
        duration: '5 min',
        intro: 'APRE and volume autoregulation are the tools that make your programme truly intelligent. Instead of following a fixed script, these systems adapt your training to your actual capacity on any given day.',
        sections: [
          {
            heading: 'What Is a Plus Set and How APRE Works',
            body: 'After your main working sets, you perform a "plus set" — as many reps as possible with good form at the same weight. This set tells your coach — and you — exactly how strong you are right now.\n\nThe result of that plus set directly determines the load for next session. Get 9 to 10 reps? The weight goes up more — roughly 3.5% of your one-rep max, or 5 to 7.5kg depending on the lift. Get 7 to 8 reps? A smaller increase — around 2% or 2 to 5kg. Get 5 to 6 reps? A minimal increase or hold. This creates a self-correcting progression system: when you\'re strong, you progress faster. When recovery is challenging, progression is more conservative.',
          },
          {
            heading: 'Volume Autoregulation Using RPE Stop',
            body: 'Instead of doing a fixed number of sets, RPE stop means you perform sets until you reach a prescribed RPE ceiling — then you stop, regardless of how many sets you\'ve done.\n\nFor example, if today\'s prescription is "sets at RPE 7, stop when you reach RPE 8", you keep going until that 8 arrives. On a great day with good recovery, you might do 6 or 7 sets before hitting that ceiling. On a tough day with poor sleep, you might hit the ceiling after 3 sets. Both are correct — your body determined the right volume.',
          },
          {
            heading: 'How RPE Guides Week-to-Week Progression',
            body: 'Beyond individual sessions, RPE drives progression across weeks. If a weight felt easier this week than it should have (lower RPE than prescribed), that\'s a signal to increase load next week. If it felt harder than expected (higher RPE than prescribed), hold the load or adjust slightly down.\n\nThis makes the progression system responsive and accurate. You\'re not guessing what to add next week based on a formula — you\'re using real performance data to make that decision.',
          },
          {
            heading: 'Why Autoregulation Beats Fixed Programming Alone',
            body: 'Fixed programmes assume constant conditions. They assume you\'re always equally recovered, equally motivated, and always improving at a predictable rate. Real life doesn\'t work like that.\n\nAutoregulation tools — APRE and RPE stop — account for the variability that is an unavoidable part of any real training life. Good days produce more progress. Hard days produce appropriate training without grinding you into the ground. Over time, this produces better results than either fixed maximum effort or fixed conservative programming.',
          },
        ],
        keyTakeaway: 'APRE and RPE stop ensure your training always reflects your actual capacity.',
        quiz: [
          {
            question: 'What is a "plus set"?',
            options: [
              'Additional warm-up sets before the main work',
              'A set performed for as many reps as possible after completing the main sets',
              'A set done with 50% more weight than the working set',
              'The very first set of the training session',
            ],
            correct: 1,
            explanation: 'A plus set is a maximum rep set performed after the main working sets, at the same weight. The number of reps achieved directly determines the load for the next session in APRE.',
          },
          {
            question: 'In APRE, getting 9–10 reps on your plus set indicates...',
            options: [
              'You should reduce the weight next session',
              'The weight should remain exactly the same',
              'More weight should be added for the next session',
              'You should reduce the number of sets next session',
            ],
            correct: 2,
            explanation: 'Getting 9–10 reps on the plus set means the weight was lighter than ideal for that rep range. More weight is added for the next session to keep the stimulus appropriate.',
          },
          {
            question: '"RPE stop" means...',
            options: [
              'Stopping all training the moment you reach RPE 10 failure',
              'Performing sets until you hit a prescribed RPE ceiling, then stopping regardless of how many sets you\'ve done',
              'Only using RPE during warm-up sets, not working sets',
              'Always training to failure on every single set',
            ],
            correct: 1,
            explanation: 'RPE stop is a volume autoregulation tool where you perform sets until you reach a prescribed RPE ceiling. Good days produce more sets; harder days produce fewer — both are the correct response.',
          },
          {
            question: 'On a day when you feel strong and recovered, how does RPE-based volume autoregulation respond?',
            options: [
              'You do less volume to avoid overtraining',
              'You do exactly the same fixed volume regardless',
              'You naturally accumulate more volume because it takes more sets to reach the RPE ceiling',
              'You reduce intensity and add more isolation exercises',
            ],
            correct: 2,
            explanation: 'On a strong day, each set feels easier, meaning it takes more sets to reach the RPE ceiling. You automatically accumulate more volume — capitalising on good recovery without needing to plan it in advance.',
          },
        ],
      },
    ],
  },

  // ============================================================
  // COURSE 4: STRESS & RECOVERY
  // ============================================================
  {
    id: 'stress-recovery',
    title: 'Stress, Recovery & Your Results',
    description: 'How stress — inside and outside the gym — directly affects your body composition and progress.',
    icon: '🧠',
    color: 'var(--purple)',
    modules: [
      {
        id: 'stress-physiology',
        title: 'How Stress Actually Works in Your Body',
        duration: '5 min',
        intro: 'Stress gets talked about constantly, but most people don\'t understand how it actually works. Once you do, you\'ll see why everything in your programme — training, nutrition, recovery — is connected.',
        sections: [
          {
            heading: 'What Stress Actually Is',
            body: 'Stress, in biological terms, is anything that disrupts your body\'s equilibrium — its normal state of balance, called homeostasis. This includes obvious things like a hard training session or a stressful work deadline, but also subtler things like poor sleep, under-eating, relationship tension, or illness.\n\nYour body treats all of these as stressors. The source doesn\'t matter — what matters is the total load placed on your stress response system.',
          },
          {
            heading: 'The General Adaptation Syndrome',
            body: 'The General Adaptation Syndrome (GAS) describes how your body responds to any stressor: first, the stimulus disrupts your balance. Then, during recovery, your body rebuilds to a slightly higher level than before — this is called supercompensation. That higher level is what we call "progress".\n\nTraining is a stressor — a deliberate, controlled one. The session breaks your body down. Recovery builds it back up. The result is adaptation: more muscle, more strength, better capacity. The key word is recovery. Without adequate recovery after the stimulus, supercompensation doesn\'t happen.',
          },
          {
            heading: 'Your Two Stress Response Systems',
            body: 'Your body has two main systems for dealing with stress. The SAM system (Sympathetic-Adrenal-Medullary) responds in seconds to minutes — this is your adrenaline response, the classic fight-or-flight. It\'s designed for immediate, acute threats.\n\nThe HPA axis (Hypothalamic-Pituitary-Adrenal) responds over minutes to hours and produces cortisol. This is your sustained stress response — the one that manages longer-term challenges. Both systems are normal, useful, and necessary. Problems arise when they\'re constantly activated without enough recovery time.',
          },
          {
            heading: 'Allostatic Load — When Too Much Adds Up',
            body: 'Allostatic load is the cumulative wear and tear on your body from repeated or unresolved stress. Think of it as a stress debt. Every stressor adds to the load. Recovery reduces it. When you\'re in a state of high allostatic load, everything suffers: hormone production is disrupted, your immune system weakens, metabolism shifts, sleep worsens, and your motivation drops.\n\nThis is why managing your total stress — not just your training stress — is essential. Your body doesn\'t know the difference between gym stress and life stress. It all draws from the same recovery pool.',
          },
        ],
        keyTakeaway: 'Your body doesn\'t distinguish between gym stress and life stress — it all counts.',
        quiz: [
          {
            question: 'What is the General Adaptation Syndrome (GAS)?',
            options: [
              'A breathing technique used to manage stress during training',
              'The cycle of stimulus → recovery → supercompensation that drives adaptation',
              'A supplement protocol for managing cortisol',
              'A type of cardiovascular training',
            ],
            correct: 1,
            explanation: 'GAS describes how the body responds to stress: a stimulus disrupts homeostasis, recovery allows rebuilding, and supercompensation raises the baseline higher than before — this is how training produces progress.',
          },
          {
            question: 'What does the HPA axis produce in response to sustained stress?',
            options: [
              'Testosterone',
              'Cortisol',
              'Insulin',
              'Growth hormone',
            ],
            correct: 1,
            explanation: 'The HPA axis (Hypothalamic-Pituitary-Adrenal) produces cortisol in response to stress over minutes to hours. It\'s the sustained stress hormone, distinct from the rapid adrenaline response of the SAM system.',
          },
          {
            question: 'What is "allostatic load"?',
            options: [
              'The maximum amount you can lift in any given exercise',
              'The cumulative wear and tear from repeated or unresolved stress across all areas of life',
              'Your personalised daily calorie target',
              'A specific type of training block',
            ],
            correct: 1,
            explanation: 'Allostatic load is the total accumulated stress burden on the body. When it\'s too high, everything suffers — hormones, immune function, metabolism, sleep, and performance all decline.',
          },
          {
            question: 'Acute stress — like a hard training session — is...',
            options: [
              'Always harmful and should be avoided',
              'Adaptive and beneficial when it\'s followed by adequate recovery',
              'Identical in effect to chronic ongoing stress',
              'Never beneficial for the body in any way',
            ],
            correct: 1,
            explanation: 'Acute stress like a training session is a controlled, adaptive stressor. When followed by proper recovery, it leads to supercompensation and progress. The problem is when stress is chronic and unresolved.',
          },
        ],
      },
      {
        id: 'lifestyle-stressors',
        title: 'Lifestyle Stressors — What\'s Draining Your Results',
        duration: '4 min',
        intro: 'What you do outside the gym matters just as much as what you do inside it. Understanding how lifestyle stressors affect your results gives you more tools to control your progress.',
        sections: [
          {
            heading: 'Common Lifestyle Stressors That Hit Your Results',
            body: 'Alcohol disrupts sleep architecture, suppresses testosterone, and impairs recovery — even moderate amounts the night before training can reduce performance and slow fat loss. Chronic over-exercising — training without adequate recovery — adds to total stress rather than subtracting from it. More training is not always better.\n\nChronic under-eating is a significant physiological stressor. Your body interprets sustained calorie restriction as a threat, elevating cortisol and other stress hormones. Similarly, chronic over-eating creates metabolic stress through sustained elevated insulin and inflammatory signalling.',
          },
          {
            heading: 'Sleep, Relationships, and Hidden Stressors',
            body: 'Poor sleep is one of the most underrated performance and body composition variables. Even a few nights of poor sleep can measurably reduce fat loss, impair muscle building, increase hunger, and lower training output.\n\nRelationship stress, work pressure, financial stress — these are real physiological stressors. Your nervous system doesn\'t classify stress by category. A difficult conversation with your boss activates the same stress response as a hard training session. Allergies, food intolerances, and chronic inflammation are also hidden stressors that many people overlook entirely.',
          },
          {
            heading: 'The Total Stress Load Concept',
            body: 'Every stressor adds to your total stress load. Recovery reduces it. The balance between the two determines how well you adapt, how well you sleep, how strong you feel in the gym, and how effectively your body loses fat or builds muscle.\n\nThe practical takeaway: if your life stress is high — a tough week at work, relationship difficulties, illness — your body\'s recovery resources are already stretched. Hammering a high-volume training session on top of that doesn\'t add to your progress. It steals from it.',
          },
          {
            heading: 'Why Your Weekly Check-In Matters',
            body: 'Your biofeedback scores in the weekly check-in — your sleep quality, stress levels, energy, mood, libido, and training performance ratings — are not just questions to fill in. They give your coach a real-time view of your total stress load.\n\nWhen your biofeedback scores drop, a smart coach adjusts. Training load comes down. Calories might be increased slightly. Recovery is prioritised. This is what separates a responsive coaching programme from a static one. Your check-in is a tool — use it honestly.',
          },
        ],
        keyTakeaway: 'What happens outside the gym matters as much as what happens inside it.',
        quiz: [
          {
            question: 'How does alcohol primarily affect your training results?',
            options: [
              'It has no meaningful effect on body composition or recovery',
              'It disrupts sleep, suppresses hormones, and impairs recovery from training',
              'It boosts testosterone and improves recovery',
              'It improves sleep quality by helping you fall asleep faster',
            ],
            correct: 1,
            explanation: 'Alcohol disrupts sleep architecture, suppresses testosterone, and impairs muscle protein synthesis and recovery — all of which negatively impact body composition and training performance.',
          },
          {
            question: 'When life stress is high, what should happen to training stress?',
            options: [
              'Training stress should increase to compensate and maintain progress',
              'Training stress should stay exactly the same regardless of life circumstances',
              'Training stress should decrease to preserve total recovery capacity',
              'Training should stop completely until life stress resolves',
            ],
            correct: 2,
            explanation: 'All stress — gym and life — draws from the same recovery pool. When life stress is high, reducing training stress protects your recovery capacity and prevents the total load from exceeding what your body can handle.',
          },
          {
            question: 'Which of the following is a significant lifestyle stressor affecting body composition?',
            options: [
              'Drinking adequate water throughout the day',
              'Consistently sleeping 8 hours per night',
              'Chronic under-eating sustained over weeks',
              'Moderate, well-recovered exercise training',
            ],
            correct: 2,
            explanation: 'Chronic under-eating is a significant physiological stressor. The body interprets sustained calorie restriction as a threat, elevating cortisol and triggering hormonal responses that resist fat loss.',
          },
          {
            question: 'Why does your coach ask about stress levels in your weekly check-in?',
            options: [
              'Just to make conversation and build rapport',
              'To monitor your total stress load and adjust your training and nutrition accordingly',
              'To judge your lifestyle choices and hold you accountable',
              'The stress question is optional and rarely factors into coaching decisions',
            ],
            correct: 1,
            explanation: 'Biofeedback scores give your coach real-time data on your total stress load. This allows training and nutrition to be adjusted intelligently — a key part of responsive, effective coaching.',
          },
        ],
      },
      {
        id: 'cortisol-body-comp',
        title: 'Cortisol — Friend or Enemy?',
        duration: '4 min',
        intro: 'Cortisol has a bad reputation, but the reality is more nuanced. Understanding when cortisol helps you and when it hurts you is the key to managing it effectively.',
        sections: [
          {
            heading: 'Cortisol Is Not the Enemy',
            body: 'Cortisol is a survival hormone. Produced by your adrenal glands in response to stress, it does a lot of useful things: it mobilises stored glucose and fat to fuel your body, it manages inflammation in the short term, it sharpens focus and alertness, and it helps you perform under pressure.\n\nThe cortisol released during a hard training session is doing exactly what it\'s supposed to do. It\'s giving you energy, helping you manage the physical stress of exercise, and priming your body to respond. This is healthy and normal. The problem isn\'t cortisol — it\'s chronically elevated cortisol.',
          },
          {
            heading: 'What Chronically High Cortisol Does to You',
            body: 'When cortisol stays elevated day after day — because of chronic stress, poor sleep, under-eating, or excessive training — things start to go wrong. Your cells become less sensitive to cortisol\'s signals, a process called glucocorticoid receptor resistance. Your sympathetic nervous system stays in a state of low-level activation, like a background noise that never turns off.\n\nInflammatory markers rise. Muscle building is blunted — cortisol is catabolic, meaning it breaks tissue down rather than building it up. Fat loss slows, particularly around the midsection. Motivation, mood, and energy all suffer.',
          },
          {
            heading: 'The Big Cortisol Elevators',
            body: 'Three of the biggest contributors to chronically elevated cortisol are sleep deprivation, chronic under-eating, and excessive training without adequate recovery. These are all things that can be directly managed.\n\nSleep deprivation is particularly potent — even a single night of poor sleep measurably elevates morning cortisol. Chronic calorie restriction tells your body it\'s in a survival situation, triggering a sustained cortisol response. And training without recovery stacks stressor on top of stressor without allowing the adaptation cycle to complete.',
          },
          {
            heading: 'Managing Cortisol Through Smart Inputs',
            body: 'The solution to chronically elevated cortisol isn\'t a supplement or a hack — it\'s managing the inputs. Prioritising sleep gives your cortisol rhythm a chance to reset properly overnight. Eating adequate calories (not always being in an aggressive deficit) keeps your body out of perceived survival mode.\n\nTraining intelligently — with planned deloads, reasonable volume, and enough rest days — ensures you recover between sessions. Managing life stress where possible, and using your check-in to flag when it\'s unavoidably high, gives your coach the information needed to adjust your programme accordingly.',
          },
        ],
        keyTakeaway: 'Cortisol in a controlled dose is a tool — chronically high cortisol is the enemy.',
        quiz: [
          {
            question: 'Cortisol released during a training session is...',
            options: [
              'Always harmful and a sign of overtraining',
              'Useful — it mobilises fuel and supports performance during the session',
              'A sign that you are training too hard',
              'Only produced during cardiovascular training',
            ],
            correct: 1,
            explanation: 'Acute cortisol during training is adaptive — it mobilises energy, manages inflammation, and supports performance. The issue is not acute cortisol but chronically elevated cortisol that never comes down.',
          },
          {
            question: 'What does chronically elevated cortisol do to muscle building?',
            options: [
              'It enhances muscle protein synthesis',
              'It has no meaningful effect on muscle building',
              'It blunts muscle anabolism — cortisol is catabolic in chronic excess',
              'It only affects fat tissue, not muscle',
            ],
            correct: 2,
            explanation: 'Chronically elevated cortisol is catabolic — it promotes tissue breakdown rather than building. This blunts the muscle-building process and can even cause muscle loss in severe cases.',
          },
          {
            question: 'Which of these is a major contributor to chronically elevated cortisol?',
            options: [
              'Sleeping 8–9 hours every night',
              'Eating at your maintenance calorie target',
              'Sleep deprivation — even a single night raises morning cortisol measurably',
              'Taking rest days between training sessions',
            ],
            correct: 2,
            explanation: 'Sleep deprivation is one of the most potent elevators of cortisol. Even a single night of poor sleep measurably raises morning cortisol levels and impairs recovery.',
          },
          {
            question: 'The most effective way to manage chronically elevated cortisol is...',
            options: [
              'Taking cortisol-blocking supplements',
              'Managing your sleep, nutrition, and training load intelligently as the primary inputs',
              'Avoiding all forms of stress entirely',
              'Reducing training frequency to once a week',
            ],
            correct: 1,
            explanation: 'Managing cortisol means addressing its primary drivers: sleep, nutrition adequacy, and training recovery. These inputs directly control your cortisol rhythm without relying on supplements.',
          },
        ],
      },
      {
        id: 'sleep-recovery',
        title: 'Sleep — Your Most Powerful Recovery Tool',
        duration: '4 min',
        intro: 'You can have the best training programme and the most precise nutrition plan in the world — but if your sleep is poor, you\'re leaving most of your results on the table.',
        sections: [
          {
            heading: 'What Actually Happens During Sleep',
            body: 'Sleep is when your body does the actual work of recovering and rebuilding. Growth hormone — the primary anabolic hormone that drives muscle repair and fat metabolism — peaks during deep sleep. Protein synthesis ramps up. Cortisol resets to its natural morning baseline.\n\nCognitive function, motivation, and willpower — all of which directly affect your ability to train well, stick to your nutrition plan, and make good decisions — are restored during sleep. You don\'t get better during training. You get better during sleep. Training provides the signal; sleep is where the adaptation happens.',
          },
          {
            heading: 'What Poor Sleep Does to Your Body Composition',
            body: 'The effects of poor sleep on fat loss and muscle building are significant and well-established. Hunger hormones shift dramatically: ghrelin (which drives hunger) increases, while leptin (which signals fullness) decreases. The result is that you feel hungrier, less satisfied by food, and more likely to overeat.\n\nTestosterone levels drop with poor sleep. Glucose metabolism is impaired — your body handles carbohydrates less efficiently. Cortisol rises. Training performance falls. And fat loss slows even when you\'re maintaining the same calorie deficit. Poor sleep doesn\'t just make you tired — it actively works against the goals you\'re training for.',
          },
          {
            heading: 'How Much Sleep Do You Actually Need?',
            body: 'The general target is 7 to 9 hours for most adults. Individual variation exists — some people genuinely function well on 7, others need 9. But very few people truly thrive on less than 7 hours, regardless of what they believe about themselves.\n\nQuality matters as much as quantity. Eight hours of fragmented, light sleep is not the same as eight hours of deep, consolidated sleep. Alcohol, for example, makes falling asleep easier but significantly reduces sleep quality — particularly the deep, restorative phases that matter most for recovery.',
          },
          {
            heading: 'Practical Strategies for Better Sleep',
            body: 'The most effective sleep strategy is also the simplest: consistent sleep and wake times. Your body\'s circadian rhythm thrives on regularity. Going to bed and waking at the same time every day — including weekends — makes it far easier to fall asleep and wake up feeling rested.\n\nOther high-impact strategies: keep your room dark and cool (65-68°F / 18-20°C is optimal for most people), avoid screens for 30 to 60 minutes before bed as the blue light delays melatonin release, and limit alcohol and caffeine in the evening. These aren\'t complicated — they\'re fundamentals that compound significantly over time.',
          },
        ],
        keyTakeaway: 'You don\'t recover during training — you recover during sleep.',
        quiz: [
          {
            question: 'When does growth hormone reach its peak production?',
            options: [
              'During the most intense part of your training session',
              'Immediately after eating a high-protein meal',
              'During deep sleep — this is when the primary anabolic rebuilding happens',
              'First thing in the morning upon waking',
            ],
            correct: 2,
            explanation: 'Growth hormone peaks during deep sleep, making sleep quality critical for muscle repair, recovery, and fat metabolism. Training provides the signal; sleep is where the rebuilding occurs.',
          },
          {
            question: 'What happens to hunger hormones with poor or insufficient sleep?',
            options: [
              'No meaningful change — hunger is not affected by sleep duration',
              'Hunger decreases because fatigue suppresses appetite',
              'Ghrelin (hunger hormone) increases and leptin (fullness hormone) decreases — you feel hungrier',
              'Both hormones balance out and appetite stays normal',
            ],
            correct: 2,
            explanation: 'Poor sleep increases ghrelin (driving hunger) and decreases leptin (signalling fullness). This hormonal shift makes overeating significantly more likely and harder to resist.',
          },
          {
            question: 'What is the general sleep target for most adults?',
            options: [
              '5–6 hours — the body adapts to less over time',
              '7–9 hours per night for optimal recovery and performance',
              '10 hours or more — more is always better',
              '4–5 hours is sufficient for most trained athletes',
            ],
            correct: 1,
            explanation: 'The general target is 7–9 hours for most adults. Very few people genuinely thrive on less than 7 hours, regardless of adaptation claims. Quality within that window matters too.',
          },
          {
            question: 'Even when maintaining a calorie deficit, poor sleep...',
            options: [
              'Has no effect on fat loss outcomes',
              'Reduces fat loss rate and impairs recovery — the deficit alone is not enough',
              'Boosts fat loss by increasing the calorie deficit through hunger suppression',
              'Only affects muscle building, not fat loss specifically',
            ],
            correct: 1,
            explanation: 'Poor sleep directly impairs fat loss even in a calorie deficit — through hormonal shifts, reduced training performance, and impaired glucose metabolism. The calorie deficit is necessary but not sufficient.',
          },
        ],
      },
    ],
  },

  // ============================================================
  // COURSE 5: TRAINING METHODS
  // ============================================================
  {
    id: 'training-methods',
    title: 'Training Methods — The Tools in Your Programme',
    description: 'Understand the training methods in your programme and why each one is used.',
    icon: '💪',
    color: 'var(--accent)',
    modules: [
      {
        id: 'lifter-classification',
        title: 'Where Are You Right Now — Lifter Levels Explained',
        duration: '4 min',
        intro: 'Knowing where you are in your training journey matters. Your programme is matched to your level — and understanding why that matters will help you get the most from where you\'re at right now.',
        sections: [
          {
            heading: 'The Five Levels of Lifter Development',
            body: 'Beginner (under 6 months of structured training): At this stage, you\'re developing the fundamental movement patterns — the neuromuscular wiring that allows you to move safely and effectively under load. Spatial awareness is still being built. The focus is on skill, consistency, and low-risk exercises. Beginners respond very well to almost any reasonable stimulus.\n\nNovice (6 to 18 months): You have adequate technique and are building your work capacity. You\'re developing training literacy — an understanding of how training works and how to apply it. Strength is building steadily.',
          },
          {
            heading: 'Intermediate to Elite',
            body: 'Intermediate (18 months to 3 years): Good technique, above-average strength for your bodyweight, and a developing understanding of the more nuanced aspects of training. You need more sophisticated programming to keep progressing.\n\nAdvanced (3 to 5+ years): Very high strength and technical proficiency. Excellent work capacity. Progress comes more slowly but the total capacity is high. Programming needs to be very precise.\n\nElite (7 to 9+ years): Top-tier athletes with a high level of dedication and years of progressive, structured training. Represents a very small percentage of lifters.',
          },
          {
            heading: 'How Training Changes Across the Levels',
            body: 'At the beginner level, training is general — more varied exercise selection, lower risk movements, building the broad foundation. The goal is skill acquisition and consistent stimulus.\n\nAs you progress, training becomes increasingly specialised. Exercise selection narrows to the movements that deliver the highest return. Volume and intensity increase. The relationship between the stressor and the specific adaptation becomes more precise. A beginner can make progress almost anywhere — an advanced athlete needs exactly the right stimulus at the right time.',
          },
          {
            heading: 'Your Programme Matches Your Level',
            body: 'There\'s no shortcut through the levels. The development pathway exists for a reason — each level builds the foundation for the next. Trying to train like an advanced lifter when you\'re a novice doesn\'t accelerate progress. It typically leads to injury, burnout, or stalled development.\n\nYour coach matches your programme to your current level. If it feels different from what you\'ve seen others do, that\'s intentional. What works best for you right now is what matters — not what works for someone at a completely different stage.',
          },
        ],
        keyTakeaway: 'Your training level determines your training approach — there\'s no shortcut through the levels.',
        quiz: [
          {
            question: 'A lifter with 18 months of consistent, structured training would be classified as...',
            options: [
              'A beginner — still developing basic patterns',
              'Novice to intermediate — solid technique and building capacity',
              'Advanced — ready for high-intensity specialised programming',
              'Elite — top-tier strength and performance capacity',
            ],
            correct: 1,
            explanation: '18 months of consistent training sits at the novice-to-intermediate transition. Technique is solid, work capacity is building, and more sophisticated programming starts to become appropriate.',
          },
          {
            question: 'What is the primary focus of training at the beginner stage?',
            options: [
              'Lifting maximum weight as quickly as possible',
              'Fundamental movement skill development and building consistency',
              'Advanced programming techniques and specialised exercises',
              'Competition preparation and peaking protocols',
            ],
            correct: 1,
            explanation: 'The beginner stage is about building the neuromuscular foundation — fundamental movement patterns, consistency, and low-risk exercise selection. Strength will come as a natural byproduct.',
          },
          {
            question: 'As you progress from beginner to advanced, training typically becomes...',
            options: [
              'More general with a wider variety of exercises',
              'More specialised with fewer but more specifically targeted exercises and higher precision',
              'Less frequent to accommodate the greater recovery demands',
              'Focused exclusively on strength, with hypertrophy work eliminated',
            ],
            correct: 1,
            explanation: 'Advanced training is more specialised and precise. Exercise selection narrows to what delivers the highest return. The relationship between specific stimulus and specific adaptation becomes increasingly important.',
          },
          {
            question: 'What does "training literacy" mean?',
            options: [
              'The ability to read fitness books and research papers',
              'Understanding training principles and being able to apply them effectively in practice',
              'Knowing how to count your calories and macros accurately',
              'Understanding the unwritten rules and etiquette of the gym',
            ],
            correct: 1,
            explanation: 'Training literacy means understanding why training works, how different variables affect adaptation, and being able to apply that understanding to make good decisions about your own training.',
          },
        ],
      },
      {
        id: 'hypertrophy-mechanisms',
        title: 'What Actually Makes Muscles Grow',
        duration: '5 min',
        intro: 'Muscle growth isn\'t just about lifting heavy things. There are three distinct mechanisms that drive hypertrophy, and understanding them explains why your programme includes the exercises and methods it does.',
        sections: [
          {
            heading: 'Mechanism 1: Tension — The Primary Driver',
            body: 'Mechanical tension is the primary driver of muscle hypertrophy. This means placing a heavy enough load on a muscle for long enough to create a significant mechanical stimulus — the pulling force on muscle fibres during contraction.\n\nThe optimal rep range for tension-driven hypertrophy is typically 8 to 12 reps, with a Time Under Tension (TUT) of 40 to 70 seconds per set. Tempo matters here — a controlled, deliberate tempo like 4010 (4 seconds lowering, no pause, 1 second lifting) keeps the muscle under tension for the full duration of the set rather than allowing momentum to take over. This type of training primarily drives myofibrillar hypertrophy — growth in the contractile elements of the muscle itself.',
          },
          {
            heading: 'Mechanism 2: Metabolic Stress — The Pump',
            body: 'The pump you feel during training is more than just satisfying — it\'s a genuine hypertrophy stimulus. Metabolic stress occurs when byproducts of anaerobic work accumulate in the muscle: lactate, hydrogen ions, and inorganic phosphate build up faster than they can be cleared.\n\nMetabolic stress-based training typically involves longer sets (12 or more reps), shorter rest periods, and methods like supersets, giant sets, and blood flow restriction training. The resulting hypoxic environment — low oxygen within the muscle — triggers hormonal and cellular responses that contribute to muscle growth. This is a different pathway to tension-driven growth, which is why both are valuable.',
          },
          {
            heading: 'Mechanism 3: Muscle Damage — Use Carefully',
            body: 'Eccentric overload — the lowering phase of a lift, particularly when taken to extremes — creates microtears in muscle fibres, leading to inflammation and a repair response. This is the mechanism behind DOMS (delayed onset muscle soreness).\n\nMuscle damage is the least effective of the three mechanisms as a primary hypertrophy stimulus. It\'s also the most expensive in terms of recovery — it generates significant central nervous system fatigue and takes longer to recover from than the other two mechanisms. Advanced techniques like heavy negatives and drop sets use this mechanism, but it\'s applied carefully and selectively rather than maximised.',
          },
          {
            heading: 'Time Under Tension — Making Every Set Count',
            body: 'Time Under Tension (TUT) refers to the total time your muscle is under contraction during a set. For maximising hypertrophy, the target is 40 to 70 seconds. For functional hypertrophy (more strength-oriented), 20 to 40 seconds. For strength endurance, 70 or more seconds.\n\nControlling your tempo ensures you\'re achieving the intended TUT. A fast, sloppy rep might take 1 second. A controlled 4010 rep takes 5 seconds. Eight controlled reps at 4010 = 40 seconds of TUT. Eight fast reps = 8 seconds. The difference in stimulus is enormous.',
          },
        ],
        keyTakeaway: 'Tension is king — controlled tempo and adequate load drive most of your muscle growth.',
        quiz: [
          {
            question: 'Which mechanism is considered the PRIMARY driver of muscle hypertrophy?',
            options: [
              'Muscle damage from eccentric overload',
              'Metabolic stress — the pump sensation',
              'Mechanical tension — load and time under tension',
              'Cardiovascular adaptations from high-rep training',
            ],
            correct: 2,
            explanation: 'Mechanical tension is the primary driver of hypertrophy. It involves placing sufficient load on a muscle for an adequate duration, driving the structural adaptations that increase muscle size.',
          },
          {
            question: 'What is Time Under Tension (TUT)?',
            options: [
              'How long you rest between sets',
              'The total time the muscle is under load and actively contracting during a set',
              'The total duration of your training session',
              'The duration of the lowering (eccentric) phase only',
            ],
            correct: 1,
            explanation: 'TUT is the total time the muscle is under tension during a set. Controlling tempo to achieve the right TUT (40–70 seconds for hypertrophy) is a key part of making training maximally effective.',
          },
          {
            question: 'The "pump" sensation during training is related to which hypertrophy mechanism?',
            options: [
              'Mechanical tension from heavy loads',
              'Muscle damage from eccentric overload',
              'Metabolic stress — accumulation of lactate and other metabolites',
              'Neural adaptation of the motor units',
            ],
            correct: 2,
            explanation: 'The pump is the result of metabolic stress — accumulation of lactate, hydrogen ions, and inorganic phosphate in the muscle during anaerobic work. This creates a genuine hypertrophy stimulus via a different pathway to tension.',
          },
          {
            question: 'What is the target Time Under Tension for maximising hypertrophy?',
            options: [
              '0–20 seconds per set',
              '20–40 seconds per set',
              '40–70 seconds per set',
              '120 seconds or more per set',
            ],
            correct: 2,
            explanation: '40–70 seconds TUT is the optimal range for hypertrophy. Below this, the tension stimulus is too brief for maximum growth; above this, the weight typically must be too light to maintain adequate mechanical tension.',
          },
        ],
      },
      {
        id: 'gvt-gbc',
        title: 'GVT & German Body Comp — High Volume Training Methods',
        duration: '5 min',
        intro: 'German Volume Training and German Body Comp are two of the most effective high-volume methods in the coach\'s toolkit. Here\'s exactly how they work and why they produce results.',
        sections: [
          {
            heading: 'German Volume Training — The 10x10 Method',
            body: 'German Volume Training (GVT) is built around a simple but brutal structure: 10 sets of 10 reps on two compound movements performed as a superset. The weight used is approximately 60% of your one-rep max — roughly your 20-rep maximum. Rest between supersets is 60 seconds.\n\nTempo is controlled: 4010 (4 seconds lowering, no pause at bottom, 1 second lifting, no pause at top). This tempo ensures every rep is creating genuine muscle tension rather than relying on momentum. The volume is significant — 10 sets of 10 on two movements means 200 total reps of compound work in one block.',
          },
          {
            heading: 'How Progression Works in GVT',
            body: 'You stay at the same weight until you can successfully complete all 10 sets of 10 reps with the correct tempo and a full range of motion. When that happens, you add approximately 2.5% to the weight for the next session.\n\nThis sounds simple but is harder than it appears. The first few sets feel manageable. By sets 7, 8, and 9, the accumulated fatigue becomes significant. The goal is maintaining the same weight throughout all 10 sets — not increasing it mid-session. GVT is a General Physical Preparedness method used to build lean mass rapidly. It works across all experience levels, though the specific adaptations depend on training history.',
          },
          {
            heading: 'Advanced GVT Variations',
            body: 'As you progress beyond standard GVT, the protocol can be advanced by shifting from 10 sets of 10 to 10 sets of 5, then 10 sets of 4, then 10 sets of 3. The weight used increases accordingly — from 60% of 1RM toward 80% or higher.\n\nThis progression maintains the high-set structure while shifting the stimulus toward greater intensity and strength development. Load progression between workouts in advanced GVT is around 4 to 5%, reflecting the higher-intensity nature of the work.',
          },
          {
            heading: 'German Body Comp — When the Goal Is Body Composition',
            body: 'German Body Comp (GBC) uses a similar structure to GVT — compound supersets, high volume, controlled tempo — but the rest periods are significantly shorter, typically 30 to 45 seconds between supersets rather than 60.\n\nThe shorter rest periods dramatically increase metabolic stress, creating a strong fat-burning effect while simultaneously maintaining or building muscle. This makes GBC particularly effective for body composition phases when the goal is to lose fat while preserving as much muscle as possible. The metabolic demand of GBC sessions is high, and recovery between sessions needs to be managed accordingly.',
          },
        ],
        keyTakeaway: 'GVT and GBC use high volume and supersets to maximise adaptation — they\'re tools for specific phases.',
        quiz: [
          {
            question: 'In standard German Volume Training, what is the set and rep structure?',
            options: [
              '5 sets × 5 reps at heavy weight',
              '3 sets × 15 reps at moderate weight',
              '10 sets × 10 reps at approximately 60% of 1RM',
              '8 sets × 8 reps at 70–75% of 1RM',
            ],
            correct: 2,
            explanation: 'Standard GVT uses 10 sets × 10 reps at approximately 60% of your 1RM (your 20-rep maximum), performed as a superset with a second compound movement and 60 seconds rest.',
          },
          {
            question: 'What percentage of 1RM is used in standard GVT?',
            options: [
              '80–85% — close to your maximum',
              '70–75% — moderate to heavy',
              'Approximately 60% — your 20-rep maximum',
              '90% or above — near-maximal loads',
            ],
            correct: 2,
            explanation: 'GVT uses approximately 60% of 1RM, which corresponds to around your 20-rep maximum. This is deliberately moderate — the volume (10×10) provides the stimulus, not the load.',
          },
          {
            question: 'In GVT, when do you increase the weight?',
            options: [
              'Every single session regardless of performance',
              'When all 10 sets of 10 reps are completed successfully with correct tempo',
              'Every two weeks on a fixed schedule',
              'When the first three sets feel easy',
            ],
            correct: 1,
            explanation: 'In GVT, you increase weight (by approximately 2.5%) only when you\'ve successfully completed all 10 sets of 10 reps with correct tempo and full range of motion. Quality first, progression second.',
          },
          {
            question: 'What primarily differentiates German Body Comp from standard GVT?',
            options: [
              'GBC uses more total sets per session',
              'Significantly shorter rest periods in GBC, maximising metabolic stress and the fat-burning effect',
              'GBC uses higher intensity with near-maximal loads',
              'GBC does not use supersets — exercises are done separately',
            ],
            correct: 1,
            explanation: 'GBC uses shorter rest periods (30–45 seconds vs 60 seconds in GVT) to dramatically increase metabolic stress. This creates a strong fat-burning effect while maintaining the muscle-building stimulus of the high volume.',
          },
        ],
      },
      {
        id: 'advanced-methods',
        title: 'Advanced Training Methods — Drop Sets, Supersets & More',
        duration: '5 min',
        intro: 'Your programme uses a range of specific training methods, each targeting different mechanisms of muscle growth. Understanding what each one does helps you execute them with purpose rather than just going through the motions.',
        sections: [
          {
            heading: 'Position of Flexion Training',
            body: 'Position of Flexion (POF) is a training system that ensures a muscle is worked through all three of its positions: midrange, lengthened, and contracted. Each position provides a different training stimulus.\n\nMidrange exercises — like bench press, squat, and row — train the muscle where it\'s strongest, allowing the most weight and the most mechanical tension. Lengthened exercises — like flyes, pullovers, and Romanian deadlifts — train the muscle in its stretched position, where research and practice show a potent growth stimulus. Contracted exercises — like cable crossovers, leg extensions, and concentration curls — train the muscle at its fully contracted, shortest position. A complete hypertrophy programme trains all three positions, not just the easiest or most comfortable.',
          },
          {
            heading: 'Drop Sets',
            body: 'A drop set starts with your working weight, and when you reach the point of failure (or near failure), you immediately reduce the weight by 20 to 25% and continue the set without rest. This extends the set beyond the point where you could continue at the original weight.\n\nDrop sets are excellent for generating metabolic stress and contributing to muscle damage — two of the three hypertrophy mechanisms. They\'re also time-efficient. The downside is that they generate significant fatigue, so they\'re typically used on the final set of an exercise rather than throughout the whole session.',
          },
          {
            heading: 'Pre-Exhaust and Post-Exhaust',
            body: 'Pre-exhaust means isolating a target muscle with an isolation exercise first, then immediately following with a compound movement. For example: lateral raises (isolation) before overhead press (compound). The logic is that the target muscle (shoulder) is already fatigued when you get to the compound exercise — so it becomes the limiting factor rather than a supporting muscle.\n\nPost-exhaust reverses the order: compound exercise first (bench press), then isolation (cable fly). You get the heavy, high-tension work of the compound first, then burn out the specific target muscle with the isolation. Both methods target different goals — pre-exhaust for target muscle focus, post-exhaust for maximum total load before finishing with targeted work.',
          },
          {
            heading: 'Giant Sets and the 6-12-25 Method',
            body: 'Giant sets are four or more exercises performed back to back with minimal rest. They create maximum metabolic stress and are highly time-efficient. They\'re most commonly used in German Body Comp and advanced bodybuilding phases.\n\nThe 6-12-25 method is one of the most comprehensive single-round hypertrophy tools available. It involves three exercises performed back to back: 6 reps of a heavy compound (tension), 12 reps of a moderate compound or isolation (blend of tension and metabolic), then 25 reps of a light isolation (metabolic stress and damage). All three hypertrophy mechanisms are hit in a single sequence. It\'s demanding, effective, and highly efficient when programmed at the right point in a training block.',
          },
        ],
        keyTakeaway: 'Each method targets specific mechanisms — your coach chooses the right tool for your current goal.',
        quiz: [
          {
            question: 'What does Position of Flexion (POF) training ensure?',
            options: [
              'You always use the maximum possible weight in every session',
              'The muscle is trained through all three positions — midrange, lengthened, and contracted',
              'Maximum volume is always prioritised over intensity',
              'Only compound movements are used, never isolation exercises',
            ],
            correct: 1,
            explanation: 'POF ensures complete muscle stimulation by training in all three positions: midrange (most load), lengthened (stretched position, strong growth signal), and contracted (fully shortened). Each provides a distinct stimulus.',
          },
          {
            question: 'What is a drop set?',
            options: [
              'Dropping the bar at the end of a heavy set',
              'Reducing the weight mid-set to continue reps beyond the point of normal failure',
              'Reducing the number of reps each week to increase intensity',
              'A deload technique used to recover between training blocks',
            ],
            correct: 1,
            explanation: 'A drop set involves reaching near-failure, then immediately reducing the weight by 20–25% and continuing the set. This extends the stimulus beyond normal failure, generating extra metabolic stress and muscle damage.',
          },
          {
            question: 'In pre-exhaust training, what happens first?',
            options: [
              'The compound movement at the heaviest weight of the session',
              'An isolation exercise targeting the specific muscle to be focused on in the compound that follows',
              'The heaviest set of the entire session',
              'A cardiovascular warm-up',
            ],
            correct: 1,
            explanation: 'Pre-exhaust uses an isolation exercise first to fatigue the target muscle, then immediately follows with a compound movement. This ensures the target muscle becomes the limiting factor in the compound rather than a supporting muscle.',
          },
          {
            question: 'The 6-12-25 method is designed to...',
            options: [
              'Build maximal strength through very heavy low-rep work',
              'Build only muscular endurance through high-rep training',
              'Hit all three hypertrophy mechanisms — tension, metabolic stress, and muscle damage — in one sequence',
              'Test your one-rep maximum across three different exercises',
            ],
            correct: 2,
            explanation: 'The 6-12-25 method sequences three exercises: 6 heavy reps (tension), 12 moderate reps (tension + metabolic), 25 light reps (metabolic stress and damage). All three hypertrophy mechanisms are stimulated in a single round.',
          },
        ],
      },
    ],
  },
]
