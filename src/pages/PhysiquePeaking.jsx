import { useState, useMemo, useEffect } from 'react'

/* ─── Brand ──────────────────────────────────────────────────────────────── */
const C = {
  bg:           '#0F0F0F',
  card:         '#1A1A1A',
  card2:        '#222222',
  accent:       '#00C9A7',
  accentDim:    'rgba(0,201,167,0.10)',
  accentBorder: 'rgba(0,201,167,0.25)',
  text:         '#FFFFFF',
  muted:        '#888888',
  faint:        '#444444',
  border:       'rgba(255,255,255,0.07)',
  borderMd:     'rgba(255,255,255,0.13)',
  danger:       '#EF4444',
  dangerDim:    'rgba(239,68,68,0.10)',
  warn:         '#F59E0B',
  warnDim:      'rgba(245,158,11,0.10)',
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const r   = n => Math.round(n)
const kcal = (c, p, f) => r(c * 4 + p * 4 + f * 9)
const fmtL = ml => ml >= 1000 ? `${(ml / 1000).toFixed(1)}L` : `${ml}ml`

function getDaysOut(shootDate) {
  if (!shootDate) return null
  const today = new Date(); today.setHours(0,0,0,0)
  const shoot = new Date(shootDate); shoot.setHours(0,0,0,0)
  return Math.ceil((shoot - today) / 86400000)
}

function dayDate(shootDate, daysBack) {
  const d = new Date(shootDate)
  d.setDate(d.getDate() - daysBack)
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function fmtShootDate(shootDate) {
  return new Date(shootDate).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function parseMacros(str) {
  if (!str?.trim()) return null
  const p = str.match(/(\d+)\s*g?\s*(?:protein|pro)/i)?.[1]
  const c = str.match(/(\d+)\s*g?\s*(?:carbs?|carbohydrates?)/i)?.[1]
  const f = str.match(/(\d+)\s*g?\s*fat/i)?.[1]
  if (!p && !c && !f) return null
  return {
    protein: p ? +p : null,
    carbs:   c ? +c : null,
    fat:     f ? +f : null,
  }
}

function pctDiff(current, target) {
  if (!current || !target) return null
  return ((current - target) / target) * 100
}

/* ─── Cardio map ─────────────────────────────────────────────────────────── */
const CARDIO = {
  'None': {
    d7:'Off', d6:'Off', d5:'Metabolic weights (3×15 @ RPE 6)',
    d4:'Off', d3:'Off', d2:'Off', d1:'Full body pump only', d0:'Off',
  },
  'LISS only': {
    d7:'LISS', d6:'LISS', d5:'Metabolic weights (3×15 @ RPE 6)',
    d4:'LISS', d3:'LISS', d2:'Off', d1:'Full body pump only', d0:'Off',
  },
  'LISS + HIIT': {
    d7:'LISS', d6:'LISS + HIIT', d5:'Metabolic weights (3×15 @ RPE 6)',
    d4:'LISS', d3:'LISS', d2:'Off', d1:'Full body pump only', d0:'Off',
  },
}

/* ─── Protocol calculators ───────────────────────────────────────────────── */
function calcBackLoad(BW, LBM, cardioType) {
  const dC = Math.max(r(BW * 0.8), 50), dP = r(LBM * 2.2), dF = r(LBM * 0.7), dW = r(BW * 35)
  const l1C = r(BW * 6.6), l1P = r(LBM * 1.8), l1F = r(LBM * 0.3), lW = r(BW * 100)
  const l2C = r(l1C * 0.75), l2P = r(LBM * 1.8), l2F = r(LBM * 0.3)
  const hC  = r(((dC + l2C) / 2) * 0.9), hP = r(LBM * 1.8), hF = r(LBM * 0.5), hW = r(BW * 35)
  const d1C = Math.min(r(hC * 1.1), l2C), d1P = r(LBM * 1.8), d1F = r(LBM * 0.4), d1W = r(BW * 15)
  const d0Min = r(d1C * 0.6), d0P = r(BW * 0.5), d0F = r(BW * 0.1), d0W = r(BW * 15)
  const cv = k => CARDIO[cardioType]?.[k] ?? 'Off'
  return [
    { key:'d7', lbl:'D-7', phase:'Depletion 1',  pc:'dep',  c:dC,           p:dP,  f:dF,  w:dW,  cardio:cv('d7'), notes:'Lower body session' },
    { key:'d6', lbl:'D-6', phase:'Depletion 2',  pc:'dep',  c:dC,           p:dP,  f:dF,  w:dW,  cardio:cv('d6'), notes:'Upper body session' },
    { key:'d5', lbl:'D-5', phase:'Depletion 3',  pc:'dep',  c:dC,           p:dP,  f:dF,  w:dW,  cardio:cv('d5'), notes:'Baseline visual assessment AM' },
    { key:'d4', lbl:'D-4', phase:'Load Day 1',   pc:'load', c:l1C,          p:l1P, f:l1F, w:lW,  cardio:cv('d4'), notes:'Prioritise low-GI carbs early, moderate-GI PM' },
    { key:'d3', lbl:'D-3', phase:'Load Day 2',   pc:'load', c:l2C,          p:l2P, f:l2F, w:lW,  cardio:cv('d3'), notes:'Monitor fullness vs spillover. If bloated from D-4, reduce by 20%.' },
    { key:'d2', lbl:'D-2', phase:'Hold',         pc:'hold', c:hC,           p:hP,  f:hF,  w:hW,  cardio:cv('d2'), notes:'Visual assessment PM. Aim for "almost full".' },
    { key:'d1', lbl:'D-1', phase:'Final Adj.',   pc:'hold', c:d1C,          p:d1P, f:d1F, w:d1W, cardio:cv('d1'), notes:'Easy to digest foods only. No HIIT. Drink to thirst.' },
    { key:'d0', lbl:'D-0', phase:'Shoot Day',    pc:'shoot',c:`${d0Min}–${d1C}`, cNum:d1C, p:d0P, f:d0F, w:d0W, cardio:cv('d0'), isShoot:true,
      notes:`Graze every 2–3hrs based on visual. 1g Na per 1000kcal 10–20min before pump-up. ${fmtL(d0W)} post-weigh then drink to thirst.` },
  ]
}

function calcFrontLoad(BW, LBM, cardioType) {
  const dC = Math.max(r(BW * 0.8), 50), dP = r(LBM * 2.2), dF = r(LBM * 0.7)
  const l1C = r(BW * 6.6), l1P = r(LBM * 1.8), l1F = r(LBM * 0.3), lW = r(BW * 100)
  const l2C = r(l1C * 0.75), l2P = r(LBM * 1.8), l2F = r(LBM * 0.3)
  const hC  = r(((dC + l2C) / 2) * 0.9), hP = r(LBM * 1.8), hF = r(LBM * 0.5), hW = r(BW * 35)
  const t1F = r(LBM * 0.9), t2F = r(LBM * 1.0), tW = r(BW * 15)
  const d1C = r(dC * 0.8), d0Min = r(d1C * 0.6), d0P = r(BW * 0.5), d0F = r(BW * 0.1), d0W = r(BW * 15)
  const cv = k => CARDIO[cardioType]?.[k] ?? 'Off'
  return [
    { key:'d7', lbl:'D-7', phase:'Load Day 1',  pc:'load', c:l1C,          p:l1P, f:l1F, w:lW,        cardio:cv('d7'), notes:'Prioritise low-GI carbs early, moderate-GI PM' },
    { key:'d6', lbl:'D-6', phase:'Load Day 2',  pc:'load', c:l2C,          p:l2P, f:l2F, w:lW,        cardio:cv('d6'), notes:'Monitor fullness vs spillover. Reduce by 20% if bloated from D-7.' },
    { key:'d5', lbl:'D-5', phase:'Hold',        pc:'hold', c:hC,           p:hP,  f:hF,  w:hW,        cardio:cv('d5'), notes:'Visual assessment PM. Aim for "almost full".' },
    { key:'d4', lbl:'D-4', phase:'Moderate',    pc:'dep',  c:dC,           p:dP,  f:dF,  w:r(BW*35),  cardio:cv('d4'), notes:'Maintain training quality. Baseline visual assessment.' },
    { key:'d3', lbl:'D-3', phase:'Moderate',    pc:'dep',  c:dC,           p:dP,  f:dF,  w:r(BW*35),  cardio:cv('d3'), notes:'Consistent with D-4. Monitor vascularity.' },
    { key:'d2', lbl:'D-2', phase:'Taper',       pc:'hold', c:dC,           p:dP,  f:t1F, w:tW,        cardio:cv('d2'), notes:'Increase dietary fat. Keep carbs low.' },
    { key:'d1', lbl:'D-1', phase:'Taper',       pc:'hold', c:d1C,          p:dP,  f:t2F, w:tW,        cardio:cv('d1'), notes:'Easy to digest foods. Full body pump. Drink to thirst.' },
    { key:'d0', lbl:'D-0', phase:'Shoot Day',   pc:'shoot',c:`${d0Min}–${d1C}`, cNum:d1C, p:d0P, f:d0F, w:d0W, cardio:cv('d0'), isShoot:true,
      notes:`Graze every 2–3hrs based on visual. 1g Na per 1000kcal 10–20min before pump-up. ${fmtL(d0W)} post-weigh then drink to thirst.` },
  ]
}

/* ─── Phase badge styles ─────────────────────────────────────────────────── */
const PHASE_BADGE = {
  dep:   { bg:'rgba(239,68,68,0.15)',    color:'#f87171',  label:'Depletion' },
  load:  { bg:C.accentDim,              color:C.accent,   label:'Load'      },
  hold:  { bg:'rgba(96,165,250,0.15)',   color:'#60a5fa',  label:'Hold'      },
  shoot: { bg:'rgba(255,255,255,0.06)',  color:C.accent,   label:'Shoot'     },
}

/* ─── Input / toggle shared styles ──────────────────────────────────────── */
const inputStyle = {
  width:'100%', background:C.card2, border:`1px solid ${C.borderMd}`,
  borderRadius:8, color:C.text, fontFamily:'Inter,sans-serif', fontSize:14,
  padding:'10px 14px', outline:'none',
}

const labelStyle = {
  display:'block', fontFamily:'Inter,sans-serif', fontSize:11,
  fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase',
  color:C.muted, marginBottom:6,
}

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

/* ── Toggle (two options) ── */
function Toggle({ options, value, onChange }) {
  return (
    <div style={{ display:'flex', background:C.card2, borderRadius:8, border:`1px solid ${C.borderMd}`, overflow:'hidden' }}>
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          style={{
            flex:1, padding:'10px 0', border:'none', cursor:'pointer',
            fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:600,
            background: value === opt ? C.accent : 'transparent',
            color: value === opt ? '#000' : C.muted,
            transition:'background .15s, color .15s',
          }}
        >{opt}</button>
      ))}
    </div>
  )
}

/* ── Field wrapper ── */
function Field({ label, children, style }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6, ...style }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

/* ── Metric card ── */
function MetricCard({ label, value, unit, accent }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'16px 20px' }}>
      <div style={{ fontSize:11, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:C.muted, marginBottom:6 }}>{label}</div>
      <div style={{ fontFamily:'Inter,sans-serif', fontSize:28, fontWeight:700, color: accent ? C.accent : C.text, lineHeight:1 }}>
        {value}<span style={{ fontSize:14, fontWeight:400, color:C.muted, marginLeft:4 }}>{unit}</span>
      </div>
    </div>
  )
}

/* ── Collapsible section ── */
function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border:`1px solid ${C.border}`, borderRadius:10, overflow:'hidden', marginBottom:12 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width:'100%', padding:'14px 20px', background:C.card,
          border:'none', color:C.text, cursor:'pointer', display:'flex',
          justifyContent:'space-between', alignItems:'center',
          fontFamily:'Inter,sans-serif', fontSize:14, fontWeight:600,
        }}
      >
        <span>{title}</span>
        <span style={{ color:C.muted, fontSize:18, lineHeight:1 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ background:C.card2, padding:'16px 20px', borderTop:`1px solid ${C.border}` }}>
          {children}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PASSWORD GATE
═══════════════════════════════════════════════════════════════════════════ */
function PasswordGate({ onAuth }) {
  const [pw, setPw]       = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function attempt() {
    if (pw === 'Physique') {
      sessionStorage.setItem('pp_auth', '1')
      onAuth()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes shake {
          0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)}
        }
        .pp-input:focus { border-color:${C.accent} !important; box-shadow:0 0 0 3px rgba(0,201,167,0.15); }
      `}</style>
      <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter,sans-serif', padding:20 }}>
        <div style={{ width:'100%', maxWidth:400, textAlign:'center' }}>
          <div style={{ fontFamily:'Inter,sans-serif', fontWeight:800, fontSize:22, letterSpacing:'0.2em', color:C.accent, marginBottom:8 }}>PERFORMUSCLE</div>
          <div style={{ fontSize:13, color:C.muted, marginBottom:40, letterSpacing:'0.05em' }}>PHYSIQUE PEAKING CALCULATOR</div>

          <div style={{ background:C.card, border:`1px solid ${C.borderMd}`, borderRadius:12, padding:'32px 28px' }}>
            <div style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:6 }}>Coach Access</div>
            <div style={{ fontSize:13, color:C.muted, marginBottom:24 }}>Enter your password to continue</div>

            <div style={{ animation: shake ? 'shake 0.45s ease' : 'none' }}>
              <input
                className="pp-input"
                type="password"
                value={pw}
                onChange={e => { setPw(e.target.value); setError(false) }}
                onKeyDown={e => e.key === 'Enter' && attempt()}
                placeholder="Password"
                style={{ ...inputStyle, marginBottom:12, textAlign:'center', fontSize:16, letterSpacing:'0.15em' }}
              />
              {error && (
                <div style={{ fontSize:13, color:C.danger, marginBottom:12 }}>Incorrect password</div>
              )}
              <button
                type="button"
                onClick={attempt}
                style={{
                  width:'100%', padding:'12px', background:C.accent, border:'none',
                  borderRadius:8, color:'#000', fontFamily:'Inter,sans-serif',
                  fontSize:14, fontWeight:700, cursor:'pointer', letterSpacing:'0.05em',
                }}
              >Enter</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PROTOCOL RESULTS
═══════════════════════════════════════════════════════════════════════════ */
function ProtocolResults({ form, protocol, daysOut, parsedCurrentMacros, onReset }) {
  const [copied, setCopied] = useState(false)

  const { clientName, shootDate, bodyweight, bodyFat, goalType, peakingMethod, waterLoad } = form
  const BW  = parseFloat(bodyweight)
  const BF  = parseFloat(bodyFat)
  const LBM = BW * (1 - BF / 100)
  const fatMass = BW * (BF / 100)
  const proteinFloor = r(LBM * 2.2)
  const initials = clientName.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)

  /* comparison against current macros — use D-7 as baseline */
  const baseline = protocol[0]
  const macroComparison = parsedCurrentMacros ? [
    { label:'Protein', current: parsedCurrentMacros.protein, protocol: baseline.p },
    { label:'Carbs',   current: parsedCurrentMacros.carbs,   protocol: baseline.c },
    { label:'Fat',     current: parsedCurrentMacros.fat,     protocol: baseline.f },
  ].filter(m => m.current !== null) : []

  /* ── copy to clipboard ── */
  function buildPlainText() {
    const sep = '─'.repeat(56)
    const header = [
      'PERFORMUSCLE — PHYSIQUE PEAKING PROTOCOL',
      sep,
      `Client: ${clientName} | Goal: ${goalType} | Shoot Date: ${fmtShootDate(shootDate)} | Days Out: ${daysOut ?? '—'}`,
      '',
      'BODY COMPOSITION',
      `Bodyweight: ${BW}kg | BF: ${BF}% | LBM: ${r(LBM)}kg | Fat Mass: ${r(fatMass)}kg`,
      `Protein Floor: ${proteinFloor}g/day`,
      '',
      `PEAKING METHOD: ${peakingMethod}${waterLoad ? ' + AIS Water Load' : ''}`,
    ]

    if (waterLoad) {
      header.push('')
      header.push('AIS WATER LOAD ADD-ON')
      header.push('3 days pre-depletion at 100ml/kg/day, then restrict to 15ml/kg on restriction day.')
      header.push('Upregulates renal excretion — increases net fluid loss on restriction day by ~39% vs control (Reale et al.).')
    }

    const cols = ['Day','Date','Phase','Carbs(g)','Protein(g)','Fat(g)','Kcals','Water','Cardio','Notes']
    const tableRows = protocol.map((d, i) => {
      const date = dayDate(shootDate, 7 - i)
      const cNum = typeof d.c === 'number' ? d.c : d.cNum
      const k    = kcal(cNum, d.p, d.f)
      return [d.lbl, date, d.phase, String(d.c), String(d.p), String(d.f), String(k), fmtL(d.w), d.cardio, d.notes].join('\t')
    })

    const body = [
      '',
      '7-DAY PROTOCOL',
      sep,
      cols.join('\t'),
      ...tableRows,
      '',
      'CARB-UP FOOD STRATEGY',
      sep,
      'LOAD DAYS — Prioritise: White rice, jasmine rice, white potato, cream of rice, rice cakes, white bread, banana, dates',
      'LOAD DAYS — Avoid: Cruciferous veg, high-fibre grains, high-fat alongside large carb doses, alcohol',
      'SHOOT DAY: Easy-to-digest carbs every 2–3hrs. Small electrolyte drink 10–15min before pump-up.',
      '',
      'SUPPLEMENT NOTES',
      sep,
      'Creatine maintenance throughout. No diuretics. Electrolyte drink on shoot morning.',
      'Flag any new compounds to Dave before protocol.',
      '',
      'DAILY MONITORING',
      sep,
      '□ Morning weight (same conditions each day)',
      '□ Front / side / back photo',
      '□ Subjective fullness score 1–10',
      '□ Send to Dave via WhatsApp each morning from D-7',
      '',
      sep,
      'Prepared by Coach Dave Marsh | Performuscle | @coachdavemarsh',
    ]

    return [...header, ...body].join('\n')
  }

  function copyProtocol() {
    navigator.clipboard.writeText(buildPlainText()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const tdStyle = (accent) => ({
    padding:'10px 12px', borderBottom:`1px solid ${C.border}`,
    fontSize:13, color: accent ? C.accent : C.text, whiteSpace:'nowrap',
  })

  const thStyle = {
    padding:'8px 12px', background:C.card, fontSize:10, fontWeight:700,
    letterSpacing:'0.08em', textTransform:'uppercase', color:C.muted,
    borderBottom:`1px solid ${C.borderMd}`, whiteSpace:'nowrap', textAlign:'left',
  }

  return (
    <div style={{ fontFamily:'Inter,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .pp-scroll { overflow-x: auto; }
        .pp-scroll::-webkit-scrollbar { height: 4px; }
        .pp-scroll::-webkit-scrollbar-track { background: ${C.card}; }
        .pp-scroll::-webkit-scrollbar-thumb { background: ${C.faint}; border-radius: 2px; }
      `}</style>

      {/* ── Less than 7 days warning ── */}
      {daysOut !== null && daysOut < 7 && (
        <div style={{ background:C.warnDim, border:`1px solid rgba(245,158,11,0.3)`, borderRadius:10, padding:'14px 20px', marginBottom:20, display:'flex', gap:12, alignItems:'flex-start' }}>
          <span style={{ fontSize:18 }}>⚠️</span>
          <div>
            <div style={{ fontWeight:700, color:C.warn, fontSize:14, marginBottom:2 }}>Less than 7 days out</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.5 }}>Protocol has been compressed. Monitor daily and contact Dave.</div>
          </div>
        </div>
      )}

      {/* ── AIS banner ── */}
      {waterLoad && (
        <div style={{ background:C.accentDim, border:`1px solid ${C.accentBorder}`, borderRadius:10, padding:'14px 20px', marginBottom:20 }}>
          <div style={{ fontWeight:700, color:C.accent, fontSize:13, marginBottom:4 }}>AIS WATER LOAD ADD-ON ACTIVE</div>
          <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>
            3 days pre-depletion at 100ml/kg/day, then restrict to 15ml/kg on restriction day.
            This upregulates renal excretion, increasing net fluid loss on restriction day by ~39% vs control (Reale et al.).
          </div>
        </div>
      )}

      {/* ── Client header card ── */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'20px 24px', marginBottom:20, display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
        <div style={{ width:52, height:52, borderRadius:'50%', background:C.accentDim, border:`2px solid ${C.accent}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:18, color:C.accent, flexShrink:0 }}>
          {initials}
        </div>
        <div style={{ flex:1, minWidth:180 }}>
          <div style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:2 }}>{clientName}</div>
          <div style={{ fontSize:13, color:C.muted }}>
            {goalType} &nbsp;·&nbsp; {fmtShootDate(shootDate)}
            &nbsp;·&nbsp; <span style={{ color: daysOut !== null && daysOut < 7 ? C.warn : C.accent, fontWeight:600 }}>
              {daysOut !== null ? `${daysOut} days out` : '—'}
            </span>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <span style={{ background:C.accentDim, color:C.accent, border:`1px solid ${C.accentBorder}`, borderRadius:20, padding:'4px 12px', fontSize:12, fontWeight:600 }}>
            {peakingMethod}
          </span>
          {waterLoad && (
            <span style={{ background:'rgba(96,165,250,0.1)', color:'#60a5fa', border:'1px solid rgba(96,165,250,0.25)', borderRadius:20, padding:'4px 12px', fontSize:12, fontWeight:600 }}>
              AIS Water Load
            </span>
          )}
        </div>
      </div>

      {/* ── Body composition stats ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:12, marginBottom:20 }}>
        <MetricCard label="Lean Body Mass"   value={r(LBM)}         unit="kg" accent />
        <MetricCard label="Fat Mass"         value={r(fatMass)}     unit="kg" />
        <MetricCard label="Glycogen Target"  value="~700"           unit="g" />
        <MetricCard label="Protein Floor"    value={proteinFloor}   unit="g/day" />
      </div>

      {/* ── Current macro comparison ── */}
      {macroComparison.length > 0 && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:'16px 20px', marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:C.muted, marginBottom:12 }}>Current Targets vs D-7 Protocol</div>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            {macroComparison.map(m => {
              const diff = pctDiff(m.current, m.protocol)
              const big = diff !== null && Math.abs(diff) > 20
              return (
                <div key={m.label} style={{ flex:1, minWidth:100, background:C.card2, borderRadius:8, padding:'10px 14px', border:`1px solid ${big ? C.warn : C.border}` }}>
                  <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>{m.label}</div>
                  <div style={{ fontSize:14, fontWeight:600 }}>
                    <span style={{ color:C.text }}>{m.current}g</span>
                    <span style={{ color:C.faint, margin:'0 6px' }}>→</span>
                    <span style={{ color: big ? C.warn : C.accent }}>{m.protocol}g</span>
                  </div>
                  {big && <div style={{ fontSize:11, color:C.warn, marginTop:4 }}>{diff > 0 ? '+' : ''}{r(diff)}% vs protocol</div>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── 7-day macro table ── */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, marginBottom:20, overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ fontSize:13, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', color:C.text }}>7-Day Protocol</div>
        </div>
        <div className="pp-scroll">
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:820 }}>
            <thead>
              <tr>
                {['Day','Date','Phase','Carbs','Protein','Fat','Kcals','Water','Cardio','Key Notes'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {protocol.map((d, i) => {
                const date = dayDate(shootDate, 7 - i)
                const cNum = typeof d.c === 'number' ? d.c : d.cNum
                const k    = kcal(cNum, d.p, d.f)
                const pb   = PHASE_BADGE[d.pc] || PHASE_BADGE.dep
                return (
                  <tr key={d.key} style={{ background: i % 2 === 0 ? C.card : C.card2 }}>
                    <td style={{ ...tdStyle(), fontWeight:700 }}>{d.lbl}</td>
                    <td style={{ ...tdStyle(), color:C.muted }}>{date}</td>
                    <td style={tdStyle()}>
                      <span style={{ background:pb.bg, color:pb.color, borderRadius:4, padding:'2px 8px', fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>
                        {d.phase}
                      </span>
                    </td>
                    <td style={{ ...tdStyle(true), fontWeight:600 }}>{typeof d.c === 'string' ? d.c : `${d.c}g`}</td>
                    <td style={tdStyle()}>{d.p}g</td>
                    <td style={tdStyle()}>{d.f}g</td>
                    <td style={{ ...tdStyle(), color:C.muted }}>{k}</td>
                    <td style={tdStyle()}>{fmtL(d.w)}</td>
                    <td style={{ ...tdStyle(), color:C.muted, fontSize:12 }}>{d.cardio}</td>
                    <td style={{ ...tdStyle(), color:C.muted, fontSize:12, whiteSpace:'normal', minWidth:220, lineHeight:1.5 }}>{d.notes}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Collapsibles ── */}
      <Collapsible title="Carb-Up Food Strategy">
        <div style={{ fontSize:13, color:C.muted, lineHeight:1.8 }}>
          <div style={{ fontWeight:700, color:C.accent, marginBottom:6 }}>LOAD DAYS — Prioritise</div>
          <div style={{ marginBottom:16 }}>White rice · Jasmine rice · White potato · Cream of rice · Rice cakes · White bread · Banana · Dates</div>
          <div style={{ fontWeight:700, color:C.danger, marginBottom:6 }}>LOAD DAYS — Avoid</div>
          <div style={{ marginBottom:16 }}>Cruciferous vegetables · High-fibre grains · High fat alongside large carb doses · Alcohol</div>
          <div style={{ fontWeight:700, color:C.text, marginBottom:6 }}>SHOOT DAY</div>
          <div>Easy-to-digest carbs every 2–3hrs. Small electrolyte drink 10–15min before pump-up. Sodium ~1g per 1000kcal consumed.</div>
        </div>
      </Collapsible>

      <Collapsible title="Supplement Notes">
        <ul style={{ fontSize:13, color:C.muted, lineHeight:2, margin:0, paddingLeft:18 }}>
          <li>Creatine maintenance throughout the entire peaking week</li>
          <li>No diuretics — water manipulation is protocol-driven</li>
          <li>Electrolyte drink on shoot morning (before pump-up)</li>
          <li>Flag any new compounds to Dave before starting the protocol</li>
        </ul>
      </Collapsible>

      <Collapsible title="Daily Monitoring Checklist">
        <div style={{ fontSize:13, color:C.muted, lineHeight:2 }}>
          {[
            'Morning weight — same conditions every day (post-toilet, pre-food)',
            'Front / side / back photo in pump lighting',
            'Subjective fullness score 1–10',
            'Send to Dave via WhatsApp each morning from D-7',
          ].map(item => (
            <div key={item} style={{ display:'flex', gap:10, alignItems:'flex-start', marginBottom:4 }}>
              <span style={{ color:C.accent, flexShrink:0 }}>□</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Collapsible>

      {/* ── Action buttons ── */}
      <div style={{ display:'flex', gap:12, marginTop:28, flexWrap:'wrap' }}>
        <button
          type="button"
          onClick={copyProtocol}
          style={{
            flex:1, minWidth:200, padding:'14px 20px', background: copied ? 'rgba(0,201,167,0.2)' : C.accent,
            border: copied ? `1px solid ${C.accent}` : 'none', borderRadius:10,
            color: copied ? C.accent : '#000', fontFamily:'Inter,sans-serif',
            fontSize:15, fontWeight:700, cursor:'pointer', letterSpacing:'0.03em',
            transition:'background .2s, color .2s',
          }}
        >
          {copied ? '✓ Copied!' : 'Copy Protocol for Gamma →'}
        </button>
        <button
          type="button"
          onClick={onReset}
          style={{
            padding:'14px 24px', background:'transparent', border:`1px solid ${C.borderMd}`,
            borderRadius:10, color:C.muted, fontFamily:'Inter,sans-serif',
            fontSize:14, fontWeight:600, cursor:'pointer',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   CALCULATOR FORM
═══════════════════════════════════════════════════════════════════════════ */
function CalculatorForm({ onGenerate }) {
  const EMPTY = {
    clientName:'', shootDate:'', bodyweight:'', bodyFat:'',
    goalType:'Photoshoot', currentMacros:'', trainingDays:'5',
    cardioType:'LISS only', peakingMethod:'Back Load', waterLoad:false,
  }
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: false }))
  }

  function validate() {
    const e = {}
    if (!form.clientName.trim()) e.clientName = true
    if (!form.shootDate) e.shootDate = true
    if (!form.bodyweight || isNaN(+form.bodyweight) || +form.bodyweight <= 0) e.bodyweight = true
    if (!form.bodyFat || isNaN(+form.bodyFat) || +form.bodyFat < 1 || +form.bodyFat > 50) e.bodyFat = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleGenerate() {
    if (!validate()) return
    onGenerate(form)
  }

  const focusStyle = { outline:'none', borderColor:C.accent, boxShadow:`0 0 0 3px rgba(0,201,167,0.15)` }

  function Input({ id, type='text', placeholder, value, onChange, error }) {
    const [focused, setFocused] = useState(false)
    return (
      <input
        type={type} id={id} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...inputStyle, ...(focused ? focusStyle : {}), borderColor: error ? C.danger : (focused ? C.accent : C.borderMd) }}
      />
    )
  }

  function SelectInput({ value, onChange, options }) {
    const [focused, setFocused] = useState(false)
    return (
      <select
        value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...inputStyle, ...(focused ? focusStyle : {}), appearance:'none', cursor:'pointer' }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    )
  }

  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:'28px' }}>
      <div style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:4 }}>Client Details</div>
      <div style={{ fontSize:13, color:C.muted, marginBottom:24 }}>Fill in the client's stats to generate their peaking protocol.</div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:18 }}>

        <Field label="Client Name">
          <Input id="name" value={form.clientName} onChange={v => set('clientName',v)} placeholder="e.g. Sarah Jones" error={errors.clientName} />
          {errors.clientName && <span style={{ fontSize:11, color:C.danger }}>Required</span>}
        </Field>

        <Field label="Shoot / Contest Date">
          <input
            type="date" value={form.shootDate}
            onChange={e => set('shootDate', e.target.value)}
            style={{ ...inputStyle, borderColor: errors.shootDate ? C.danger : C.borderMd, colorScheme:'dark' }}
          />
          {errors.shootDate && <span style={{ fontSize:11, color:C.danger }}>Required</span>}
        </Field>

        <Field label="Bodyweight (kg)">
          <Input id="bw" type="number" value={form.bodyweight} onChange={v => set('bodyweight',v)} placeholder="e.g. 78.5" error={errors.bodyweight} />
          {errors.bodyweight && <span style={{ fontSize:11, color:C.danger }}>Enter a valid weight</span>}
        </Field>

        <Field label="Body Fat %">
          <Input id="bf" type="number" value={form.bodyFat} onChange={v => set('bodyFat',v)} placeholder="e.g. 14.5" error={errors.bodyFat} />
          {errors.bodyFat && <span style={{ fontSize:11, color:C.danger }}>Enter 1–50%</span>}
        </Field>

        <Field label="Goal Type">
          <Toggle options={['Photoshoot','Contest Prep']} value={form.goalType} onChange={v => set('goalType',v)} />
        </Field>

        <Field label="Current Macros (optional)" style={{ gridColumn:'span 1' }}>
          <Input id="macros" value={form.currentMacros} onChange={v => set('currentMacros',v)} placeholder='e.g. "200g protein / 250g carbs / 70g fat"' />
        </Field>

        <Field label="Training Days / Week">
          <SelectInput value={form.trainingDays} onChange={v => set('trainingDays',v)} options={['3','4','5','6']} />
        </Field>

        <Field label="Cardio Type">
          <SelectInput value={form.cardioType} onChange={v => set('cardioType',v)} options={['None','LISS only','LISS + HIIT']} />
        </Field>

        <Field label="Peaking Method">
          <Toggle options={['Back Load','Front Load']} value={form.peakingMethod} onChange={v => set('peakingMethod',v)} />
        </Field>

        <Field label="Water Load Add-On">
          <button
            type="button"
            onClick={() => set('waterLoad', !form.waterLoad)}
            style={{
              padding:'10px 14px', borderRadius:8, cursor:'pointer', textAlign:'left',
              background: form.waterLoad ? C.accentDim : C.card2,
              border: form.waterLoad ? `1px solid ${C.accentBorder}` : `1px solid ${C.borderMd}`,
              color: form.waterLoad ? C.accent : C.muted,
              fontFamily:'Inter,sans-serif', fontSize:13, fontWeight:600,
              display:'flex', alignItems:'center', gap:8,
            }}
          >
            <span style={{ fontSize:16 }}>{form.waterLoad ? '✓' : '○'}</span>
            AIS Protocol Add-On
          </button>
        </Field>

      </div>

      <div style={{ marginTop:28, display:'flex', gap:12 }}>
        <button
          type="button"
          onClick={handleGenerate}
          style={{
            flex:1, padding:'14px', background:C.accent, border:'none', borderRadius:10,
            color:'#000', fontFamily:'Inter,sans-serif', fontSize:15, fontWeight:700,
            cursor:'pointer', letterSpacing:'0.04em', transition:'background .15s',
          }}
          onMouseEnter={e => e.target.style.background='#00e6be'}
          onMouseLeave={e => e.target.style.background=C.accent}
        >
          Generate Protocol
        </button>
        <button
          type="button"
          onClick={() => setForm(EMPTY)}
          style={{
            padding:'14px 20px', background:'transparent', border:`1px solid ${C.borderMd}`,
            borderRadius:10, color:C.muted, fontFamily:'Inter,sans-serif', fontSize:14,
            fontWeight:600, cursor:'pointer',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function PhysiquePeaking() {
  const [authed,   setAuthed]   = useState(() => sessionStorage.getItem('pp_auth') === '1')
  const [form,     setForm]     = useState(null)
  const [protocol, setProtocol] = useState(null)
  const [daysOut,  setDaysOut]  = useState(null)
  const [parsedMacros, setParsedMacros] = useState(null)

  function handleGenerate(f) {
    const BW  = parseFloat(f.bodyweight)
    const BF  = parseFloat(f.bodyFat)
    const LBM = BW * (1 - BF / 100)
    const calc = f.peakingMethod === 'Front Load' ? calcFrontLoad : calcBackLoad
    const proto = calc(BW, LBM, f.cardioType)
    setForm(f)
    setProtocol(proto)
    setDaysOut(getDaysOut(f.shootDate))
    setParsedMacros(parseMacros(f.currentMacros))
    window.scrollTo({ top: 0, behavior:'smooth' })
  }

  function handleReset() {
    setForm(null)
    setProtocol(null)
  }

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        select option { background: ${C.card2}; color: ${C.text}; }
      `}</style>

      <div style={{ minHeight:'100vh', background:C.bg, fontFamily:'Inter,sans-serif', color:C.text }}>

        {/* ── Header ── */}
        <header style={{ background:C.card, borderBottom:`1px solid ${C.border}`, position:'sticky', top:0, zIndex:50 }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontWeight:800, fontSize:16, letterSpacing:'0.18em', color:C.accent }}>PERFORMUSCLE</span>
              <span style={{ color:C.faint, fontSize:14 }}>|</span>
              <span style={{ fontSize:13, color:C.muted, letterSpacing:'0.05em' }}>Physique Peaking Calculator</span>
            </div>
            {protocol && (
              <button type="button" onClick={handleReset}
                style={{ fontSize:13, color:C.muted, background:'transparent', border:`1px solid ${C.border}`, borderRadius:6, padding:'6px 14px', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                ← New Protocol
              </button>
            )}
          </div>
        </header>

        {/* ── Main ── */}
        <main style={{ maxWidth:1200, margin:'0 auto', padding:'32px 24px 64px' }}>
          {!protocol ? (
            <>
              <div style={{ marginBottom:32 }}>
                <h1 style={{ fontSize:32, fontWeight:800, color:C.text, marginBottom:8 }}>
                  Physique <span style={{ color:C.accent }}>Peaking</span> Protocol
                </h1>
                <p style={{ fontSize:15, color:C.muted, maxWidth:560 }}>
                  Generate a fully personalised 7-day peaking protocol for photoshoots and contest prep.
                  All calculations are client-specific based on bodyweight and lean mass.
                </p>
              </div>
              <CalculatorForm onGenerate={handleGenerate} />
            </>
          ) : (
            <ProtocolResults
              form={form}
              protocol={protocol}
              daysOut={daysOut}
              parsedCurrentMacros={parsedMacros}
              onReset={handleReset}
            />
          )}
        </main>

      </div>
    </>
  )
}

// Named export used by the coach app route (already behind ProtectedRoute — no password gate needed)
// Sets the sessionStorage flag so PhysiquePeaking's own auth check is satisfied on mount.
export function PhysiquePeakingContent({ appMode = false }) {
  sessionStorage.setItem('pp_auth', '1')
  return <PhysiquePeaking />
}
