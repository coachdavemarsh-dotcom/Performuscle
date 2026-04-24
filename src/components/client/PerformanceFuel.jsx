import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'

// ─── calculation engine ───────────────────────────────────────────────────────

function clamp(val, min, max) { return Math.min(max, Math.max(min, val)) }
function round5(n) { return Math.round(n / 5) * 5 }

function calculate({ weightKg, activityType, durationMin, intensity, heat }) {
  const w  = parseFloat(weightKg) || 75
  const dur = parseInt(durationMin) || 60
  const hrDur = dur / 60

  // ── intensity multipliers ──
  const intMult = { easy: 0.6, moderate: 1.0, hard: 1.4, race: 1.8 }[intensity] || 1.0
  const heatMult = { cool: 0.8, moderate: 1.0, hot: 1.35, very_hot: 1.7 }[heat] || 1.0

  // ── is endurance-dominant? ──
  const isEndurance = ['run', 'cycle', 'swim'].includes(activityType)
  const isStrength  = activityType === 'strength'

  // ─── PRE-WORKOUT ───────────────────────────────────────────────────────────
  // Carbs: 1-4g/kg depending on intensity & duration (Burke et al.)
  let preCarbFactor
  if (intensity === 'easy' || dur < 45)    preCarbFactor = 1.0
  else if (intensity === 'moderate')        preCarbFactor = isEndurance ? 2.0 : 1.5
  else if (intensity === 'hard')            preCarbFactor = isEndurance ? 3.0 : 2.0
  else                                      preCarbFactor = isEndurance ? 4.0 : 2.5
  // Protein: light pre-workout (Areta et al.)
  const preProtein = isStrength ? round5(clamp(w * 0.2, 15, 30)) : round5(clamp(w * 0.15, 10, 25))
  const preCarbs   = round5(clamp(w * preCarbFactor, 20, 400))
  // Fluid
  const preFluid   = Math.round(w * 6) // ~6ml/kg 2hr before, top up 3-5ml/kg 20min before

  // ─── INTRA-WORKOUT ─────────────────────────────────────────────────────────
  // Carbs/hr (Jeukendrup 2011)
  let intraCarbHr
  if (dur < 45)          intraCarbHr = 0
  else if (dur < 75)     intraCarbHr = 20
  else if (dur < 90)     intraCarbHr = 30
  else if (dur < 120)    intraCarbHr = 45
  else if (dur < 180)    intraCarbHr = 60
  else                   intraCarbHr = 80

  // Adjust upward for hard/race endurance
  if (intensity === 'hard' && isEndurance && dur >= 90)  intraCarbHr = Math.min(intraCarbHr * 1.1, 90)
  if (intensity === 'race' && isEndurance && dur >= 120) intraCarbHr = Math.min(intraCarbHr * 1.2, 90)

  const intraCarbHrRounded = round5(intraCarbHr)
  const intraTotalCarb     = round5(intraCarbHrRounded * hrDur)
  const useMultiCarb       = dur > 150 && intraCarbHrRounded > 50 // needs glucose+fructose

  // Sodium/hr (Maughan & Shirreffs)
  const baseSodium = { easy: 250, moderate: 400, hard: 600, race: 800 }[intensity] || 400
  const intraSodiumHr = Math.round(baseSodium * heatMult)

  // Fluid/hr (ACSM guidelines)
  const baseFluidHr = 500 + (w > 80 ? 100 : 0)
  const intensFluid = { easy: 0.8, moderate: 1.0, hard: 1.2, race: 1.4 }[intensity] || 1.0
  const intraFluidHr = Math.round(baseFluidHr * intensFluid * heatMult / 50) * 50

  // Potassium/hr
  const intraPotassiumHr = Math.round(150 * Math.min(heatMult, 1.4))

  // ─── POST-WORKOUT ──────────────────────────────────────────────────────────
  // Protein: 0.25-0.4g/kg leucine-rich (Moore et al., Witard et al.)
  const postProteinFactor = isStrength ? 0.35 : 0.3
  const postProtein = round5(clamp(w * postProteinFactor, 20, 45))

  // Carbs: 0.5-1.2g/kg depending on type & intensity (Ivy et al.)
  let postCarbFactor
  if (isStrength)                                   postCarbFactor = 0.5
  else if (activityType === 'hiit')                 postCarbFactor = 0.7
  else if (intensity === 'race' && isEndurance)     postCarbFactor = 1.2
  else if (intensity === 'hard')                    postCarbFactor = 1.0
  else                                              postCarbFactor = 0.7
  const postCarbs = round5(clamp(w * postCarbFactor, 20, 200))

  // Rehydration: sweat loss estimate × 1.5
  const sweatRateLhr = { easy: 0.5, moderate: 0.8, hard: 1.2, race: 1.6 }[intensity] || 0.8
  const sweatLossL   = sweatRateLhr * heatMult * hrDur
  const rehydMl      = Math.round(sweatLossL * 1500) // 1.5× sweat loss

  // Post sodium
  const postSodium = Math.round(sweatLossL * 800) // ~800mg Na/L sweat

  // ─── CARB LOADING ──────────────────────────────────────────────────────────
  const shouldLoad = dur >= 90 && (intensity === 'hard' || intensity === 'race') && isEndurance
  const loadDay2   = shouldLoad ? round5(w * 8)  : null // 8g/kg moderate loading
  const loadDay1   = shouldLoad ? round5(w * 10) : null // 10g/kg peak loading
  const loadMorning = shouldLoad ? round5(w * 2) : null // 2g/kg race morning (4hrs before)

  // ─── DAILY ELECTROLYTES ────────────────────────────────────────────────────
  // Base daily targets (adjusted for training load)
  const trainingBoost = hrDur * intMult
  const sodiumDaily   = Math.round((2000 + trainingBoost * 600) * heatMult)
  const potassiumDaily = 3500 + Math.round(trainingBoost * 200)
  const magnesiumDaily = Math.round(w * 5.5) // ~5.5mg/kg for athletes (Volpe 2015)
  const calciumDaily   = 1000

  // Session losses
  const sessionSodiumLoss   = Math.round(intraSodiumHr   * hrDur)
  const sessionPotassiumLoss = Math.round(intraPotassiumHr * hrDur)
  const sessionMagLoss      = Math.round(5 * hrDur) // ~5mg/hr sweat

  return {
    weight: w,
    // pre
    preCarbs, preProtein, preFluid,
    preTiming: preCarbFactor >= 3 ? '3–4 hours before' : preCarbFactor >= 2 ? '2–3 hours before' : '1–2 hours before',
    // intra
    intraCarbHr: intraCarbHrRounded, intraTotalCarb, useMultiCarb,
    intraSodiumHr, intraFluidHr, intraPotassiumHr,
    needsIntra: dur >= 45,
    // post
    postCarbs, postProtein, rehydMl, postSodium,
    postWindow: isEndurance && intensity !== 'easy' ? '30 min' : '60 min',
    // carb load
    shouldLoad, loadDay2, loadDay1, loadMorning,
    // electrolytes
    sodiumDaily, potassiumDaily, magnesiumDaily, calciumDaily,
    sessionSodiumLoss, sessionPotassiumLoss, sessionMagLoss,
  }
}

// ─── UI helpers ───────────────────────────────────────────────────────────────

function Pill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12,
      fontFamily: 'var(--font-display)', letterSpacing: 0.5, transition: 'all .15s',
      background: active ? 'linear-gradient(135deg,var(--accent),var(--accent-hi))' : 'var(--s3)',
      color: active ? 'var(--ink)' : 'var(--sub)',
      border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
      boxShadow: active ? '0 0 12px rgba(0,200,150,.25)' : 'none',
    }}>
      {children}
    </button>
  )
}

function MacroRow({ label, value, unit = 'g', color = 'var(--accent)', sub }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0', borderBottom: '1px solid var(--border)',
    }}>
      <div>
        <div style={{ fontSize: 13, color: 'var(--sub)' }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color }}>{value}</span>
        <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 3 }}>{unit}</span>
      </div>
    </div>
  )
}

function FoodList({ label, items }) {
  return (
    <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--s3)', borderRadius: 8, border: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {items.map(f => (
          <span key={f} style={{
            fontSize: 11, padding: '3px 9px', borderRadius: 4,
            background: 'var(--s4)', color: 'var(--sub)', border: '1px solid var(--border)',
          }}>{f}</span>
        ))}
      </div>
    </div>
  )
}

function SectionHeader({ eyebrow, title, color = 'var(--accent)' }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 2, color, marginBottom: 4 }}>{eyebrow}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 1, color: 'var(--white)' }}>{title}</div>
    </div>
  )
}

function ElectrolyteBar({ label, value, unit, max, color, note }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <div>
          <span style={{ fontSize: 13, color: 'var(--sub)' }}>{label}</span>
          {note && <span style={{ fontSize: 10, color: 'var(--muted)', marginLeft: 8 }}>{note}</span>}
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color }}>
          {value.toLocaleString()} <span style={{ fontSize: 10, color: 'var(--muted)' }}>{unit}</span>
        </span>
      </div>
      <div style={{ height: 5, background: 'var(--s4)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}aa)`, borderRadius: 3, transition: 'width .4s ease' }} />
      </div>
    </div>
  )
}

// ─── result tabs ──────────────────────────────────────────────────────────────

function TabPre({ r }) {
  return (
    <div>
      <SectionHeader eyebrow="WINDOW" title={`${r.preTiming.toUpperCase()} YOUR SESSION`} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 4 }}>
        <div style={{ padding: '14px 16px', background: 'var(--s3)', borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 6 }}>CARBOHYDRATES</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--accent)' }}>{r.preCarbs}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)' }}>grams</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{(r.preCarbs / r.weight).toFixed(1)} g/kg</div>
        </div>
        <div style={{ padding: '14px 16px', background: 'var(--s3)', borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 6 }}>PROTEIN</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--info)' }}>{r.preProtein}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)' }}>grams</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>light — easy to digest</div>
        </div>
      </div>

      <MacroRow label="Fluid" value={r.preFluid} unit="ml" color="var(--info)" sub={`2 hrs before · top up with 200–300ml 20 min before`} />
      <MacroRow label="Fat" value="Keep low" unit="" color="var(--warn)" sub="Slow gastric emptying — avoid high fat meals pre-session" />

      <FoodList label="IDEAL PRE-WORKOUT FOODS"
        items={['White rice', 'Oats', 'Banana', 'Sourdough toast', 'Rice cakes', 'Potato', 'Sports drink', 'Low-fat yogurt', 'Honey']} />

      <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(0,200,150,.06)', border: '1px solid rgba(0,200,150,.15)', borderRadius: 8, fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
        💡 If eating <strong style={{ color: 'var(--white)' }}>1 hour or less</strong> before training, stick to simple carbs only (no fat, minimal protein). Avoid high-fibre foods to prevent GI discomfort.
      </div>
    </div>
  )
}

function TabIntra({ r }) {
  if (!r.needsIntra) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)', marginBottom: 8 }}>NO INTRA-WORKOUT FUEL NEEDED</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 300, margin: '0 auto' }}>
          For sessions under 45 minutes, endogenous glycogen stores are sufficient. Stay hydrated with water.
        </div>
      </div>
    )
  }

  return (
    <div>
      <SectionHeader eyebrow="PER HOUR OF TRAINING" title="DURING YOUR SESSION" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 4 }}>
        {[
          { label: 'CARBS', value: r.intraCarbHr, unit: 'g/hr', color: 'var(--accent)' },
          { label: 'SODIUM', value: r.intraSodiumHr, unit: 'mg/hr', color: 'var(--warn)' },
          { label: 'FLUID', value: r.intraFluidHr, unit: 'ml/hr', color: 'var(--info)' },
        ].map(s => (
          <div key={s.label} style={{ padding: '12px 10px', background: 'var(--s3)', borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{s.unit}</div>
          </div>
        ))}
      </div>

      <MacroRow label="Potassium" value={r.intraPotassiumHr} unit="mg/hr" color="var(--accent-hi)" sub="Lost in sweat — replenish during long sessions" />
      {r.intraCarbHr > 0 && (
        <MacroRow label="Total carbs this session" value={r.intraTotalCarb} unit="g total" color="var(--accent)" sub="Spread evenly across the session" />
      )}

      {r.useMultiCarb && (
        <div style={{ marginTop: 12, padding: '12px 14px', background: 'rgba(251,191,36,.06)', border: '1px solid rgba(251,191,36,.2)', borderRadius: 8 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5, color: 'var(--warn)', marginBottom: 6 }}>MULTI-CARB PROTOCOL RECOMMENDED</div>
          <div style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.7 }}>
            For sessions over 2.5 hrs consuming 60g+/hr, use a <strong style={{ color: 'var(--white)' }}>2:1 glucose:fructose</strong> ratio. This saturates separate intestinal transporters, maximising absorption up to 90g/hr (Jeukendrup 2011).
          </div>
        </div>
      )}

      <FoodList label="INTRA-WORKOUT OPTIONS"
        items={['Energy gel (22–25g)', 'Medjool dates (2)', 'Banana (half)', 'Sports drink 500ml', 'Rice balls', 'Chews / blocks', 'Maltodextrin + fructose mix']} />

      <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(0,200,150,.06)', border: '1px solid rgba(0,200,150,.15)', borderRadius: 8, fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
        💡 Sip fluid <strong style={{ color: 'var(--white)' }}>regularly, not all at once</strong>. Sodium in sports drinks helps fluid retention and maintains the drive to drink.
      </div>
    </div>
  )
}

function TabPost({ r }) {
  return (
    <div>
      <SectionHeader eyebrow={`WITHIN ${r.postWindow} OF FINISHING`} title="RECOVERY WINDOW" color="#f472b6" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 4 }}>
        <div style={{ padding: '14px 16px', background: 'var(--s3)', borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 6 }}>PROTEIN</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#f472b6' }}>{r.postProtein}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)' }}>grams</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>leucine-rich source</div>
        </div>
        <div style={{ padding: '14px 16px', background: 'var(--s3)', borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 6 }}>CARBOHYDRATES</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--accent)' }}>{r.postCarbs}</div>
          <div style={{ fontSize: 10, color: 'var(--muted)' }}>grams</div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{(r.postCarbs / r.weight).toFixed(1)} g/kg</div>
        </div>
      </div>

      <MacroRow label="Rehydration target" value={r.rehydMl} unit="ml" color="var(--info)" sub="Replace 1.5× estimated sweat loss over 2–4 hrs" />
      <MacroRow label="Sodium to replenish" value={r.postSodium} unit="mg" color="var(--warn)" sub="Add to food or use electrolyte drink" />

      <FoodList label="IDEAL POST-WORKOUT FOODS"
        items={['Greek yogurt + berries', 'Whey protein + banana', 'Chicken + white rice', 'Eggs + sourdough', 'Tuna + rice cakes', 'Chocolate milk', 'Cottage cheese + fruit']} />

      <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(244,114,182,.06)', border: '1px solid rgba(244,114,182,.15)', borderRadius: 8, fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
        💡 Co-ingesting carbs and protein post-workout <strong style={{ color: 'var(--white)' }}>does not impair MPS</strong> but does accelerate glycogen resynthesis. Aim for leucine ≥2–3g in your protein source.
      </div>
    </div>
  )
}

function TabCarbLoad({ r }) {
  if (!r.shouldLoad) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)', marginBottom: 8 }}>NOT REQUIRED FOR THIS SESSION</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
          Carb loading is beneficial for endurance events lasting <strong style={{ color: 'var(--white)' }}>90+ minutes at hard or race intensity</strong>. Adjust your session settings to see a loading protocol.
        </div>
      </div>
    )
  }

  const days = [
    { label: '2 DAYS OUT', grams: r.loadDay2, note: 'Moderate loading phase — taper training', color: 'var(--info)' },
    { label: '1 DAY OUT', grams: r.loadDay1, note: 'Peak loading phase — rest or very easy activity', color: 'var(--accent)' },
    { label: 'RACE MORNING', grams: r.loadMorning, note: '3–4 hours before start — familiar, low-fibre foods only', color: '#f472b6' },
  ]

  return (
    <div>
      <SectionHeader eyebrow="PRE-EVENT PROTOCOL" title="CARBOHYDRATE LOADING" color="var(--info)" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
        {days.map(d => (
          <div key={d.label} style={{
            padding: '16px 18px', borderRadius: 8,
            background: 'var(--s3)', border: '1px solid var(--border)',
            borderLeft: `3px solid ${d.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1.5, color: d.color, marginBottom: 4 }}>{d.label}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.5 }}>{d.note}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: d.color }}>{d.grams}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>grams carbs</div>
              <div style={{ fontSize: 10, color: 'var(--muted)' }}>{(d.grams / r.weight).toFixed(0)} g/kg</div>
            </div>
          </div>
        ))}
      </div>

      <FoodList label="LOADING FOODS — LOW FIBRE, HIGH CARB"
        items={['White rice', 'White pasta', 'White bread', 'Potatoes (no skin)', 'Pancakes + syrup', 'Sports drinks', 'Rice pudding', 'Pretzels', 'White bagels', 'Cornflakes']} />

      <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(99,179,237,.06)', border: '1px solid rgba(99,179,237,.15)', borderRadius: 8, fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
        ⚠️ <strong style={{ color: 'var(--white)' }}>Nothing new on race day.</strong> Only consume foods you have tested in training. Avoid high-fat, high-fibre, and high-protein meals in the 24hrs before to prevent GI distress.
      </div>
    </div>
  )
}

function TabElectrolytes({ r }) {
  return (
    <div>
      <SectionHeader eyebrow="DAILY TARGETS FOR YOUR TRAINING LOAD" title="ELECTROLYTES" color="var(--warn)" />

      <div style={{ marginBottom: 20 }}>
        <ElectrolyteBar label="Sodium"    value={r.sodiumDaily}    unit="mg/day" max={6000}  color="var(--warn)"     note="Athletes often need 2–4× sedentary targets" />
        <ElectrolyteBar label="Potassium" value={r.potassiumDaily} unit="mg/day" max={7000}  color="var(--accent)"   note="Critical for muscle contractions" />
        <ElectrolyteBar label="Magnesium" value={r.magnesiumDaily} unit="mg/day" max={600}   color="#a78bfa"         note="Sleep, muscle relaxation, energy metabolism" />
        <ElectrolyteBar label="Calcium"   value={r.calciumDaily}   unit="mg/day" max={1500}  color="var(--info)"     note="Bone health, muscle function" />
      </div>

      <div style={{ padding: '14px 16px', background: 'var(--s3)', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 12 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 10 }}>ESTIMATED SESSION LOSSES</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: 'SODIUM', value: r.sessionSodiumLoss, unit: 'mg' },
            { label: 'POTASSIUM', value: r.sessionPotassiumLoss, unit: 'mg' },
            { label: 'MAGNESIUM', value: r.sessionMagLoss, unit: 'mg' },
          ].map(e => (
            <div key={e.label} style={{ textAlign: 'center', padding: '8px 4px', background: 'var(--s4)', borderRadius: 6 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 7, letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 4 }}>{e.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)' }}>{e.value}</div>
              <div style={{ fontSize: 9, color: 'var(--muted)' }}>{e.unit} lost</div>
            </div>
          ))}
        </div>
      </div>

      <FoodList label="SODIUM SOURCES"
        items={['Salt (1/4 tsp = 575mg)', 'Soy sauce', 'Pickles / pickle juice', 'Olives', 'Cheese', 'Miso soup', 'Electrolyte tabs']} />
      <FoodList label="POTASSIUM SOURCES"
        items={['Banana (422mg)', 'Avocado (975mg)', 'Sweet potato', 'Spinach', 'Salmon', 'White beans', 'Coconut water']} />
      <FoodList label="MAGNESIUM SOURCES"
        items={['Pumpkin seeds (156mg/oz)', 'Dark chocolate', 'Almonds', 'Black beans', 'Spinach', 'Edamame', 'Magnesium glycinate supp']} />
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

const ACTIVITY_TYPES = [
  { id: 'strength', label: '🏋️ Strength' },
  { id: 'hiit',     label: '⚡ HIIT' },
  { id: 'run',      label: '🏃 Running' },
  { id: 'cycle',    label: '🚴 Cycling' },
  { id: 'team',     label: '⚽ Team Sport' },
  { id: 'swim',     label: '🏊 Swimming' },
]

const DURATIONS = [
  { id: '30',  label: '<30 min' },
  { id: '45',  label: '45 min' },
  { id: '60',  label: '60 min' },
  { id: '90',  label: '90 min' },
  { id: '120', label: '2 hrs' },
  { id: '180', label: '3 hrs+' },
]

const INTENSITIES = [
  { id: 'easy',     label: 'Easy',     sub: 'RPE 4–5' },
  { id: 'moderate', label: 'Moderate', sub: 'RPE 6–7' },
  { id: 'hard',     label: 'Hard',     sub: 'RPE 8–9' },
  { id: 'race',     label: 'Race',     sub: 'RPE 10' },
]

const HEATS = [
  { id: 'cool',     label: '❄️ Cool',        sub: '<15°C' },
  { id: 'moderate', label: '🌤️ Moderate',    sub: '15–25°C' },
  { id: 'hot',      label: '☀️ Hot',          sub: '25–35°C' },
  { id: 'very_hot', label: '🔥 Very Hot',     sub: '>35°C / Humid' },
]

const TABS = [
  { id: 'pre',   label: '↑ PRE',          color: 'var(--accent)' },
  { id: 'intra', label: '⚡ INTRA',        color: 'var(--warn)' },
  { id: 'post',  label: '↓ POST',         color: '#f472b6' },
  { id: 'load',  label: '📊 CARB LOAD',   color: 'var(--info)' },
  { id: 'elec',  label: '⚗️ ELECTROLYTES', color: '#a78bfa' },
]

export default function PerformanceFuel() {
  const { profile } = useAuth()

  const [weight,   setWeight]   = useState(profile?.current_weight || 75)
  const [activity, setActivity] = useState('run')
  const [duration, setDuration] = useState('60')
  const [intensity,setIntensity]= useState('moderate')
  const [heat,     setHeat]     = useState('moderate')
  const [results,  setResults]  = useState(null)
  const [tab,      setTab]      = useState('pre')

  function handleCalculate() {
    const r = calculate({
      weightKg:    weight,
      activityType: activity,
      durationMin:  duration,
      intensity,
      heat,
    })
    setResults(r)
    setTab('pre')
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">PERFORMANCE FUEL</h1>
          <p className="page-subtitle">Carb loading · peri-workout nutrition · electrolytes</p>
        </div>
      </div>

      {/* ── Inputs ── */}
      <div className="card section-gap">
        <div className="card-header" style={{ marginBottom: 20 }}>
          <div className="card-title">Session Details</div>
        </div>

        {/* Body weight */}
        <div style={{ marginBottom: 20 }}>
          <div className="label" style={{ marginBottom: 8 }}>Body Weight</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 200 }}>
            <input
              className="input"
              type="number" step="0.5" min="40" max="200"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 20 }}
            />
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>kg</span>
          </div>
        </div>

        {/* Activity type */}
        <div style={{ marginBottom: 20 }}>
          <div className="label" style={{ marginBottom: 8 }}>Activity Type</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ACTIVITY_TYPES.map(a => (
              <Pill key={a.id} active={activity === a.id} onClick={() => setActivity(a.id)}>{a.label}</Pill>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: 20 }}>
          <div className="label" style={{ marginBottom: 8 }}>Session Duration</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {DURATIONS.map(d => (
              <Pill key={d.id} active={duration === d.id} onClick={() => setDuration(d.id)}>{d.label}</Pill>
            ))}
          </div>
        </div>

        {/* Intensity */}
        <div style={{ marginBottom: 20 }}>
          <div className="label" style={{ marginBottom: 8 }}>Intensity</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {INTENSITIES.map(i => (
              <button key={i.id} onClick={() => setIntensity(i.id)} style={{
                padding: '8px 14px', borderRadius: 6, cursor: 'pointer', transition: 'all .15s',
                background: intensity === i.id ? 'linear-gradient(135deg,var(--accent),var(--accent-hi))' : 'var(--s3)',
                border: `1px solid ${intensity === i.id ? 'transparent' : 'var(--border)'}`,
                boxShadow: intensity === i.id ? '0 0 12px rgba(0,200,150,.25)' : 'none',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 0.5, color: intensity === i.id ? 'var(--ink)' : 'var(--sub)' }}>{i.label}</div>
                <div style={{ fontSize: 9, color: intensity === i.id ? 'rgba(6,6,8,.6)' : 'var(--muted)', marginTop: 2 }}>{i.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Heat / environment */}
        <div style={{ marginBottom: 24 }}>
          <div className="label" style={{ marginBottom: 8 }}>Environment</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {HEATS.map(h => (
              <button key={h.id} onClick={() => setHeat(h.id)} style={{
                padding: '8px 14px', borderRadius: 6, cursor: 'pointer', transition: 'all .15s',
                background: heat === h.id ? 'linear-gradient(135deg,var(--accent),var(--accent-hi))' : 'var(--s3)',
                border: `1px solid ${heat === h.id ? 'transparent' : 'var(--border)'}`,
                boxShadow: heat === h.id ? '0 0 12px rgba(0,200,150,.25)' : 'none',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 0.5, color: heat === h.id ? 'var(--ink)' : 'var(--sub)' }}>{h.label}</div>
                <div style={{ fontSize: 9, color: heat === h.id ? 'rgba(6,6,8,.6)' : 'var(--muted)', marginTop: 2 }}>{h.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCalculate}>
          Calculate My Fuel Plan →
        </button>
      </div>

      {/* ── Results ── */}
      {results && (
        <div className="card section-gap">
          {/* Summary strip */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
            padding: '14px 0', marginBottom: 20,
            borderBottom: '1px solid var(--border)',
          }}>
            {[
              { l: 'BODY WEIGHT', v: `${results.weight} kg` },
              { l: 'SWEAT LOSS EST.', v: `${Math.round(results.rehydMl / 1.5)} ml` },
              { l: 'CARB LOAD', v: results.shouldLoad ? 'YES' : 'N/A' },
            ].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 4 }}>{s.l}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--white)' }}>{s.v}</div>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto', paddingBottom: 2 }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: 6, cursor: 'pointer', flexShrink: 0,
                  fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.2, transition: 'all .15s',
                  background: tab === t.id ? `${t.color}18` : 'var(--s3)',
                  color: tab === t.id ? t.color : 'var(--muted)',
                  border: `1px solid ${tab === t.id ? `${t.color}44` : 'var(--border)'}`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div key={tab} style={{ animation: 'fadeIn .15s ease' }}>
            {tab === 'pre'   && <TabPre          r={results} />}
            {tab === 'intra' && <TabIntra        r={results} />}
            {tab === 'post'  && <TabPost         r={results} />}
            {tab === 'load'  && <TabCarbLoad     r={results} />}
            {tab === 'elec'  && <TabElectrolytes r={results} />}
          </div>

          {/* Recalculate */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
              Based on Jeukendrup (2011), Burke et al. (2011), ISSN Position Stand (2017), ACSM fluid guidelines
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setResults(null)}>
              ← Adjust inputs
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
