import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../hooks/useAuth.jsx'

// ─── Naval BF% formula (US Navy method, measurements in cm) ──────────────────

function navalBF(gender, heightCm, waistCm, neckCm, hipsCm) {
  const h = parseFloat(heightCm)
  const w = parseFloat(waistCm)
  const n = parseFloat(neckCm)
  if (!h || !w || !n || w <= n) return null
  if (gender === 'male') {
    const bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76
    return Math.max(1, Math.round(bf * 10) / 10)
  }
  const hi = parseFloat(hipsCm)
  if (!hi) return null
  const bf = 163.205 * Math.log10(w + hi - n) - 97.684 * Math.log10(h) - 78.387
  return Math.max(1, Math.round(bf * 10) / 10)
}

function bfCategory(gender, bf) {
  if (bf === null) return null
  if (gender === 'male') {
    if (bf < 6)  return { label: 'Essential Fat', color: 'var(--info)' }
    if (bf < 14) return { label: 'Athletic',      color: 'var(--accent)' }
    if (bf < 18) return { label: 'Fitness',        color: 'var(--accent)' }
    if (bf < 25) return { label: 'Average',        color: 'var(--warn)' }
    return { label: 'Above Average', color: 'var(--danger)' }
  }
  if (bf < 14) return { label: 'Essential Fat', color: 'var(--info)' }
  if (bf < 21) return { label: 'Athletic',      color: 'var(--accent)' }
  if (bf < 25) return { label: 'Fitness',        color: 'var(--accent)' }
  if (bf < 32) return { label: 'Average',        color: 'var(--warn)' }
  return { label: 'Above Average', color: 'var(--danger)' }
}

// ─── FMS test data ────────────────────────────────────────────────────────────

const FMS_TESTS = [
  {
    id: 'deep_squat', name: 'Deep Squat', bilateral: false,
    desc: 'Hold a dowel overhead (shoulder-width grip). Feet shoulder-width apart, toes forward. Squat to full depth keeping heels flat on the floor.',
    criteria: {
      3: 'Upper torso parallel to tibia. Knees aligned over feet. Dowel aligned over feet. Full depth achieved.',
      2: 'Upper torso parallel to tibia BUT heels elevated OR knees not aligned over feet.',
      1: 'Tibia and upper torso not parallel. Knees collapsed. Lumbar flexion visible.',
      0: 'Pain with any part of this test.',
    },
    youtubeSearch: 'FMS+deep+squat+Gray+Cook',
  },
  {
    id: 'hurdle_step', name: 'Hurdle Step', bilateral: true,
    desc: 'Set hurdle height to tibial tuberosity. Stand tall behind hurdle with dowel across shoulders. Step over hurdle touching heel to floor, return without touching.',
    criteria: {
      3: 'Hips, knees and ankles remain aligned. Minimal lumbar movement. Dowel stays parallel to hurdle.',
      2: 'Some alignment loss OR touching hurdle OR lumbar movement noted.',
      1: 'Contact with hurdle. Loss of balance. Excessive trunk movement.',
      0: 'Pain with any part of this test.',
    },
    youtubeSearch: 'FMS+hurdle+step+test',
  },
  {
    id: 'inline_lunge', name: 'Inline Lunge', bilateral: true,
    desc: 'Stand on board, feet inline. Back toe touches front heel. Dowel placed behind head, between shoulder blades and at sacrum. Lower back knee to tap board.',
    criteria: {
      3: 'All three dowel contacts maintained. No trunk movement. Knee taps board behind front heel.',
      2: 'Some loss of contact OR trunk movement OR dowel not staying aligned.',
      1: 'Loss of balance OR unable to tap knee to board.',
      0: 'Pain with any part of this test.',
    },
    youtubeSearch: 'FMS+inline+lunge',
  },
  {
    id: 'shoulder_mobility', name: 'Shoulder Mobility', bilateral: true,
    desc: 'Make a fist with thumb inside. One arm reaches up/over the shoulder, other reaches up the back. Measure distance between fists.',
    criteria: {
      3: 'Fists within one hand-length of each other.',
      2: 'Fists within one-and-a-half hand-lengths.',
      1: 'Fists more than one-and-a-half hand-lengths apart.',
      0: 'Pain OR positive clearing test (internal impingement).',
    },
    youtubeSearch: 'FMS+shoulder+mobility+test',
  },
  {
    id: 'active_straight_leg', name: 'Active Straight Leg Raise', bilateral: true,
    desc: 'Lie on back, arms at sides. Board placed under knees. Raise one straight leg as high as possible while keeping opposite leg flat on board.',
    criteria: {
      3: 'Ankle passes a vertical line drawn between ASIS and mid-patella of the opposite leg.',
      2: 'Ankle passes vertical line of opposite knee.',
      1: 'Ankle stays below the vertical line of the opposite knee.',
      0: 'Pain with any part of this test.',
    },
    youtubeSearch: 'FMS+active+straight+leg+raise',
  },
  {
    id: 'trunk_stability', name: 'Trunk Stability Push-Up', bilateral: false,
    desc: 'Men: thumbs at forehead. Women: thumbs at chin. Perform one push-up maintaining a rigid plank — no spinal lag or hip sag allowed.',
    criteria: {
      3: 'Performs one push-up at forehead level (men) or chin level (women). Body rises as a unit.',
      2: 'Performs push-up at chin level (men) or clavicle level (women).',
      1: 'Unable to perform push-up at either level.',
      0: 'Pain OR positive spinal extension clearing test.',
    },
    youtubeSearch: 'FMS+trunk+stability+pushup',
  },
  {
    id: 'rotary_stability', name: 'Rotary Stability', bilateral: true,
    desc: 'Quadruped position on a board. First attempt: extend same-side arm and leg simultaneously, touch elbow to knee. If unable, cross-pattern (opposite arm/leg).',
    criteria: {
      3: 'Performs a correct unilateral (same-side) repetition while maintaining balance.',
      2: 'Performs a correct diagonal (cross-body) repetition.',
      1: 'Unable to perform diagonal pattern without losing balance.',
      0: 'Pain OR positive prone press-up clearing test.',
    },
    youtubeSearch: 'FMS+rotary+stability+test',
  },
]

// ─── ROM test data ────────────────────────────────────────────────────────────

const ROM_AREAS = [
  {
    id: 'hip', label: 'Hips', icon: '🦵',
    instructions: 'Perform each movement to comfortable end-range. Bilateral tests measure both left and right sides. No need for exact goniometry — best estimate is fine.',
    youtubeSearch: 'hip+range+of+motion+assessment',
    tests: [
      { id: 'hip_flex',  name: 'Flexion',           normal: 120, bilateral: true,  cue: 'Supine, pull knee toward chest' },
      { id: 'hip_ext',   name: 'Extension',          normal: 30,  bilateral: true,  cue: 'Prone or standing, lift leg back' },
      { id: 'hip_ir',    name: 'Internal Rotation',  normal: 40,  bilateral: true,  cue: 'Seated, swing foot outward (IR)' },
      { id: 'hip_er',    name: 'External Rotation',  normal: 45,  bilateral: true,  cue: 'Seated, swing foot inward (ER)' },
      { id: 'hip_abd',   name: 'Abduction',          normal: 45,  bilateral: true,  cue: 'Supine, slide leg out to side' },
    ],
  },
  {
    id: 'shoulder', label: 'Shoulders', icon: '💪',
    instructions: 'Measure with arm in neutral unless stated. Note any pain, clicking or impingement. Bilateral comparison is key.',
    youtubeSearch: 'shoulder+range+of+motion+self+assessment',
    tests: [
      { id: 'sh_flex',   name: 'Flexion',           normal: 180, bilateral: true,  cue: 'Raise arm forward, overhead' },
      { id: 'sh_ext',    name: 'Extension',          normal: 60,  bilateral: true,  cue: 'Reach arm straight back' },
      { id: 'sh_abd',    name: 'Abduction',          normal: 180, bilateral: true,  cue: 'Raise arm out to side, overhead' },
      { id: 'sh_ir',     name: 'Internal Rotation',  normal: 70,  bilateral: true,  cue: '90° abduction, rotate forearm down' },
      { id: 'sh_er',     name: 'External Rotation',  normal: 90,  bilateral: true,  cue: '90° abduction, rotate forearm up' },
    ],
  },
  {
    id: 'spine', label: 'Spine', icon: '🦴',
    instructions: 'Assess cervical (neck), thoracic (upper/mid back) and lumbar (lower back) independently. Note any pain or restriction.',
    youtubeSearch: 'spinal+range+of+motion+self+assessment',
    tests: [
      { id: 'cerv_flex', name: 'Cervical Flexion',    normal: 80,  bilateral: false, cue: 'Chin toward chest' },
      { id: 'cerv_ext',  name: 'Cervical Extension',  normal: 70,  bilateral: false, cue: 'Look up to ceiling' },
      { id: 'cerv_rot',  name: 'Cervical Rotation',   normal: 80,  bilateral: true,  cue: 'Turn head side to side' },
      { id: 'thor_rot',  name: 'Thoracic Rotation',   normal: 45,  bilateral: true,  cue: 'Seated, arms crossed, rotate trunk' },
      { id: 'lumb_flex', name: 'Lumbar Flexion',      normal: 90,  bilateral: false, cue: 'Bend forward — estimate or finger-to-floor cm' },
      { id: 'lumb_ext',  name: 'Lumbar Extension',    normal: 30,  bilateral: false, cue: 'Hands on hips, arch back' },
    ],
  },
]

// ─── video URL parser (YouTube + Vimeo) ──────────────────────────────────────

function parseVideoEmbed(url) {
  if (!url || typeof url !== 'string') return null
  const u = url.trim()
  // YouTube: watch?v=, youtu.be/, /embed/
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1`
  // Vimeo: vimeo.com/ID or player.vimeo.com/video/ID
  const vi = u.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/)
  if (vi) return `https://player.vimeo.com/video/${vi[1]}`
  return null
}

// ─── shared UI ────────────────────────────────────────────────────────────────

function PillButton({ active, onClick, children, style = {} }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1.5,
      padding: '9px 18px', borderRadius: 6, cursor: 'pointer', transition: 'all .15s',
      background: active ? 'linear-gradient(135deg,var(--accent),var(--accent-hi))' : 'var(--s3)',
      color: active ? 'var(--ink)' : 'var(--sub)',
      border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
      boxShadow: active ? '0 0 12px rgba(0,200,150,.25)' : 'none',
      ...style,
    }}>
      {children}
    </button>
  )
}

function OptionCard({ active, onClick, icon, label, desc }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer', padding: '14px 16px',
      borderRadius: 10, transition: 'all .15s',
      background: active ? 'rgba(0,200,150,.08)' : 'var(--s3)',
      border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
      boxShadow: active ? '0 0 16px rgba(0,200,150,.15)' : 'none',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <span style={{ fontSize: 24, lineHeight: 1 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 1, color: active ? 'var(--accent)' : 'var(--white)' }}>
          {label}
        </div>
        {desc && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{desc}</div>}
      </div>
      {active && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--accent)', flexShrink: 0 }}>
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  )
}

function InputField({ label, note, children }) {
  return (
    <div className="input-group">
      <label className="form-label">{label}</label>
      {children}
      {note && <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>{note}</div>}
    </div>
  )
}

// ─── demo video component ─────────────────────────────────────────────────────

function DemoVideo({ videoUrl, youtubeId, searchQuery, label = 'Watch Demo' }) {
  const [open, setOpen] = useState(false)

  // Accept full URL (new) or bare YouTube ID (legacy), falling back to search
  const embedUrl = parseVideoEmbed(videoUrl)
    || (youtubeId ? `https://www.youtube.com/embed/${youtubeId}?rel=0` : null)

  if (!embedUrl) {
    return (
      <a
        href={`https://www.youtube.com/results?search_query=${searchQuery}`}
        target="_blank" rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5,
          color: 'var(--info)', textDecoration: 'none',
          background: 'rgba(100,160,255,.08)', border: '1px solid rgba(100,160,255,.2)',
          borderRadius: 4, padding: '4px 10px',
        }}
      >
        <span>▶</span> {label.toUpperCase()} ON YOUTUBE ↗
      </a>
    )
  }

  return (
    <div>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5,
        color: open ? 'var(--accent)' : 'var(--info)',
        background: open ? 'rgba(0,200,150,.08)' : 'rgba(100,160,255,.08)',
        border: `1px solid ${open ? 'rgba(0,200,150,.2)' : 'rgba(100,160,255,.2)'}`,
        borderRadius: 4, padding: '4px 10px', cursor: 'pointer',
      }}>
        <span>{open ? '▼' : '▶'}</span> {open ? 'HIDE VIDEO' : `PLAY — ${label.toUpperCase()}`}
      </button>
      {open && (
        <div style={{ marginTop: 10, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <iframe
            width="100%" height="220"
            src={embedUrl}
            title={label} frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}

// ─── photo upload zone ────────────────────────────────────────────────────────

function PhotoZone({ label, icon, hint, file, onFile }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)

  function handleChange(e) {
    const f = e.target.files[0]
    if (!f) return
    setPreview(URL.createObjectURL(f))
    onFile(f)
  }

  return (
    <div style={{ flex: 1 }}>
      <input ref={inputRef} type="file" accept="image/*,video/*" onChange={handleChange}
        style={{ display: 'none' }} />
      <button onClick={() => inputRef.current?.click()} style={{
        width: '100%', aspectRatio: '3/4', borderRadius: 10, cursor: 'pointer',
        border: `2px dashed ${file ? 'var(--accent)' : 'var(--border)'}`,
        background: file ? 'rgba(0,200,150,.05)' : 'var(--s3)',
        overflow: 'hidden', position: 'relative', padding: 0,
        transition: 'all .2s',
      }}>
        {preview ? (
          <img src={preview} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, padding: 12 }}>
            <span style={{ fontSize: 28 }}>{icon}</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1.5, color: 'var(--sub)' }}>
              {label.toUpperCase()}
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center' }}>{hint}</div>
          </div>
        )}
        {file && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'rgba(0,200,150,.9)', padding: '4px 8px', textAlign: 'center',
            fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5, color: 'var(--ink)',
          }}>
            ✓ UPLOADED — TAP TO REPLACE
          </div>
        )}
      </button>
    </div>
  )
}

// ─── video upload component ───────────────────────────────────────────────────

function VideoUploadBtn({ file, onFile, label = 'Upload Your Attempt' }) {
  const inputRef = useRef(null)

  function handleChange(e) {
    const f = e.target.files[0]
    if (f) onFile(f)
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="video/*" onChange={handleChange} style={{ display: 'none' }} />
      <button onClick={() => inputRef.current?.click()} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 1.5,
        color: file ? 'var(--accent)' : 'var(--muted)',
        background: file ? 'rgba(0,200,150,.08)' : 'var(--s3)',
        border: `1px solid ${file ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 4, padding: '4px 10px', cursor: 'pointer',
      }}>
        <span>📹</span>
        {file ? `✓ ${file.name.slice(0, 24)}…` : label.toUpperCase()}
      </button>
      <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 4 }}>
        Optional · Max 200MB · Coach reviews your form
      </div>
    </div>
  )
}

// ─── score buttons ────────────────────────────────────────────────────────────

function ScoreButtons({ value, onChange }) {
  const config = [
    { v: 0, color: 'var(--danger)',  bg: 'rgba(255,68,68,.1)',    label: '0', desc: 'Pain' },
    { v: 1, color: 'var(--warn)',    bg: 'rgba(255,173,0,.1)',    label: '1', desc: 'Cannot' },
    { v: 2, color: 'var(--info)',    bg: 'rgba(100,160,255,.1)',  label: '2', desc: 'Compensate' },
    { v: 3, color: 'var(--accent)',  bg: 'rgba(0,200,150,.1)',    label: '3', desc: 'Perfect' },
  ]
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {config.map(c => (
        <button key={c.v} onClick={() => onChange(c.v)} style={{
          flex: 1, padding: '8px 4px', borderRadius: 6, cursor: 'pointer', textAlign: 'center',
          background: value === c.v ? c.bg : 'var(--s4)',
          border: `1px solid ${value === c.v ? c.color : 'var(--border)'}`,
          color: value === c.v ? c.color : 'var(--muted)',
          transition: 'all .15s',
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>{c.label}</div>
          <div style={{ fontSize: 8, letterSpacing: .5 }}>{c.desc}</div>
        </button>
      ))}
    </div>
  )
}

// ─── step: welcome ────────────────────────────────────────────────────────────

function StepWelcome({ onNext, coachVideoUrl }) {
  const [videoOpen, setVideoOpen] = useState(false)
  const embedUrl = parseVideoEmbed(coachVideoUrl)

  return (
    <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: 2,
        background: 'linear-gradient(135deg,var(--accent),var(--accent-hi))',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 12,
      }}>LET'S BUILD YOUR PLAN</h1>

      {/* Coach intro video */}
      {embedUrl ? (
        <div style={{ marginBottom: 24, textAlign: 'left' }}>
          <button
            onClick={() => setVideoOpen(o => !o)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '13px 16px', borderRadius: 10, cursor: 'pointer',
              background: videoOpen ? 'rgba(0,200,150,.06)' : 'var(--s3)',
              border: `1px solid ${videoOpen ? 'var(--border-accent)' : 'var(--border)'}`,
              transition: 'all .15s',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8, flexShrink: 0,
              background: 'linear-gradient(135deg,var(--accent),var(--accent-hi))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 2l9 5-9 5V2z" fill="#060608"/>
              </svg>
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1, color: 'var(--white)' }}>
                A MESSAGE FROM DAVE
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                Watch before you start — what to expect & how it works
              </div>
            </div>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: 'var(--muted)', transform: videoOpen ? 'rotate(180deg)' : '', transition: 'transform .2s', flexShrink: 0 }}>
              <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          {videoOpen && (
            <div style={{ borderRadius: '0 0 10px 10px', overflow: 'hidden', border: '1px solid var(--border-accent)', borderTop: 'none' }}>
              <iframe
                width="100%" height="260"
                src={embedUrl}
                title="Welcome from Dave"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      ) : (
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, maxWidth: 340, margin: '0 auto 24px' }}>
          This takes around 5–10 minutes across two parts. Your answers personalise everything — training, nutrition, and movement programming.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 340, margin: '0 auto 28px', textAlign: 'left' }}>
        {[
          { icon: '👤', label: 'Part 1 — Your Profile', desc: 'Goals, body stats & lifestyle' },
          { icon: '🏋️', label: 'Part 2 — Movement Assessment', desc: 'Posture photos, FMS & mobility screen' },
        ].map(p => (
          <div key={p.label} style={{
            display: 'flex', gap: 12, padding: '12px 16px',
            background: 'var(--s3)', borderRadius: 8, border: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 20 }}>{p.icon}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1, color: 'var(--white)' }}>{p.label}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-primary" style={{ width: '100%', maxWidth: 340 }} onClick={onNext}>
        Let's go →
      </button>
    </div>
  )
}

// ─── step: about you ──────────────────────────────────────────────────────────

function StepAboutYou({ data, update, onNext, onBack }) {
  const canProceed = data.full_name && data.date_of_birth && data.gender && data.height_cm && data.current_weight

  const isMale = data.gender === 'male'
  const isFemale = data.gender === 'female' || data.gender === 'non_binary'
  const showHips = isFemale
  const bf = (isMale || isFemale) && data.height_cm && data.waist_cm && data.neck_cm
    ? navalBF(isMale ? 'male' : 'female', data.height_cm, data.waist_cm, data.neck_cm, data.hips_cm)
    : null
  const bfCat = bfCategory(isMale ? 'male' : 'female', bf)
  const leanMass = bf && data.current_weight ? Math.round((1 - bf / 100) * parseFloat(data.current_weight) * 10) / 10 : null
  const fatMass  = bf && data.current_weight ? Math.round((bf / 100) * parseFloat(data.current_weight) * 10) / 10 : null

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 2, color: 'var(--accent)', marginBottom: 4 }}>PART 1 OF 2 — PROFILE</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 2, color: 'var(--white)', marginBottom: 4 }}>ABOUT YOU</h2>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>Used for TDEE, body composition, and VO₂ Max zone calculations.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <InputField label="Full Name">
          <input className="input" value={data.full_name} onChange={e => update('full_name', e.target.value)} placeholder="Your full name" />
        </InputField>
        <InputField label="Date of Birth" note="Required for age-based fitness norms">
          <input className="input" type="date" value={data.date_of_birth} onChange={e => update('date_of_birth', e.target.value)} />
        </InputField>
        <InputField label="Gender">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[{ v: 'male', l: 'Male' }, { v: 'female', l: 'Female' }, { v: 'non_binary', l: 'Non-binary' }, { v: 'prefer_not', l: 'Prefer not to say' }].map(g => (
              <PillButton key={g.v} active={data.gender === g.v} onClick={() => update('gender', g.v)}>{g.l}</PillButton>
            ))}
          </div>
        </InputField>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <InputField label="Height (cm)">
            <input className="input" type="number" step="0.5" value={data.height_cm} onChange={e => update('height_cm', e.target.value)} placeholder="175" />
          </InputField>
          <InputField label="Body Weight (kg)">
            <input className="input" type="number" step="0.1" value={data.current_weight} onChange={e => update('current_weight', e.target.value)} placeholder="80" />
          </InputField>
        </div>

        {/* Body circumference measurements */}
        {(isMale || isFemale) && (
          <>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <div className="label" style={{ marginBottom: 4 }}>Body Circumference Measurements</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10 }}>
                Used to calculate Naval body fat %. Measure at widest/narrowest point in cm.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: showHips ? '1fr 1fr 1fr' : '1fr 1fr', gap: 10 }}>
              <InputField label="Waist (cm)" note="At navel level">
                <input className="input" type="number" step="0.5" value={data.waist_cm || ''} onChange={e => update('waist_cm', e.target.value)} placeholder="82" />
              </InputField>
              <InputField label="Neck (cm)" note="Below larynx">
                <input className="input" type="number" step="0.5" value={data.neck_cm || ''} onChange={e => update('neck_cm', e.target.value)} placeholder="38" />
              </InputField>
              {showHips && (
                <InputField label="Hips (cm)" note="At widest point">
                  <input className="input" type="number" step="0.5" value={data.hips_cm || ''} onChange={e => update('hips_cm', e.target.value)} placeholder="96" />
                </InputField>
              )}
            </div>

            {/* Live BF% result */}
            {bf !== null ? (
              <div style={{
                padding: '14px 16px', borderRadius: 10,
                background: `${bfCat?.color || 'var(--accent)'}0a`,
                border: `1px solid ${bfCat?.color || 'var(--accent)'}33`,
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12,
              }}>
                {[
                  { label: 'Body Fat', value: `${bf}%`, color: bfCat?.color },
                  { label: 'Category', value: bfCat?.label, color: bfCat?.color },
                  { label: 'Lean Mass', value: leanMass ? `${leanMass}kg` : '—', color: 'var(--accent)' },
                  { label: 'Fat Mass',  value: fatMass  ? `${fatMass}kg`  : '—', color: 'var(--muted)' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: 1, marginBottom: 3 }}>
                      {s.label.toUpperCase()}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            ) : data.waist_cm && data.neck_cm && (
              <div style={{ fontSize: 11, color: 'var(--muted)', padding: '8px 12px', background: 'var(--s3)', borderRadius: 6 }}>
                {showHips && !data.hips_cm ? 'Add hips measurement to calculate body fat %' : 'Enter all measurements to calculate body fat %'}
              </div>
            )}
          </>
        )}
      </div>

        {/* Home Address */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
          <div className="label" style={{ marginBottom: 8 }}>Home Address <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 400 }}>(optional)</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input className="input" value={data.address_line1} onChange={e => update('address_line1', e.target.value)} placeholder="Street address" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <input className="input" value={data.city} onChange={e => update('city', e.target.value)} placeholder="City" />
              <input className="input" value={data.postcode} onChange={e => update('postcode', e.target.value)} placeholder="Postcode / ZIP" />
            </div>
            <input className="input" value={data.country} onChange={e => update('country', e.target.value)} placeholder="Country" />
          </div>
        </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext} disabled={!canProceed} style={{ flex: 1 }}>Continue →</button>
      </div>
    </div>
  )
}

// ─── step: goal ───────────────────────────────────────────────────────────────

function StepYourGoal({ data, update, onNext, onBack }) {
  const canProceed = data.goal_type && data.training_experience
  const showTarget = ['cut', 'gain'].includes(data.goal_type)
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 2, color: 'var(--accent)', marginBottom: 4 }}>PART 1 OF 2 — PROFILE</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 2, color: 'var(--white)', marginBottom: 4 }}>YOUR GOAL</h2>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>Drives your nutrition targets, rate of progress, and 6-month goal map.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        {[
          { v: 'cut',       i: '🔥', l: 'Lose Body Fat',      d: 'Reduce fat while preserving muscle' },
          { v: 'gain',      i: '💪', l: 'Build Muscle',       d: 'Increase lean mass and strength' },
          { v: 'recomp',    i: '⚖️', l: 'Recomposition',     d: 'Lose fat and gain muscle simultaneously' },
          { v: 'maintain',  i: '🏃', l: 'Maintain & Perform', d: 'Keep composition, focus on performance' },
          { v: 'pain',      i: '🩹', l: 'Get Out of Pain',    d: 'Reduce pain & restore function' },
          { v: 'longevity', i: '🌱', l: 'Longevity',          d: 'Move well & stay healthy long-term' },
        ].map(g => (
          <OptionCard key={g.v} active={data.goal_type === g.v} onClick={() => update('goal_type', g.v)} icon={g.i} label={g.l} desc={g.d} />
        ))}
      </div>
      {showTarget && (
        <InputField label={`Target Weight (kg)`} note="Populates your 6-month goal map predictions">
          <input className="input" type="number" step="0.5" value={data.target_weight} onChange={e => update('target_weight', e.target.value)} placeholder={data.goal_type === 'cut' ? '72' : '88'} />
        </InputField>
      )}
      <div style={{ marginTop: 16 }}>
        <div className="form-label" style={{ marginBottom: 8 }}>Training Experience</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ v: 'beginner', l: 'Beginner', d: '< 1 yr' }, { v: 'intermediate', l: 'Intermediate', d: '1–3 yrs' }, { v: 'advanced', l: 'Advanced', d: '3+ yrs' }].map(e => (
            <button key={e.v} onClick={() => update('training_experience', e.v)} style={{
              flex: 1, padding: '10px 8px', borderRadius: 8, cursor: 'pointer',
              background: data.training_experience === e.v ? 'rgba(0,200,150,.08)' : 'var(--s3)',
              border: `1px solid ${data.training_experience === e.v ? 'var(--accent)' : 'var(--border)'}`,
              color: data.training_experience === e.v ? 'var(--accent)' : 'var(--sub)',
              textAlign: 'center', transition: 'all .15s',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1 }}>{e.l}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{e.d}</div>
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext} disabled={!canProceed} style={{ flex: 1 }}>Continue →</button>
      </div>
    </div>
  )
}

// ─── step: lifestyle ──────────────────────────────────────────────────────────

function StepLifestyle({ data, update, onNext, onBack }) {
  const canProceed = data.activity_level
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 2, color: 'var(--accent)', marginBottom: 4 }}>PART 1 OF 2 — PROFILE</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 2, color: 'var(--white)', marginBottom: 4 }}>LIFESTYLE</h2>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>Used to calculate your TDEE and personalise recovery recommendations.</p>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div className="form-label" style={{ marginBottom: 10 }}>Activity Level (outside of planned training)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { v: 'sedentary', i: '🪑', l: 'Sedentary',        d: 'Desk job, little or no exercise' },
            { v: 'light',     i: '🚶', l: 'Lightly Active',   d: '1–3 light sessions/week' },
            { v: 'moderate',  i: '🏋️', l: 'Moderately Active', d: '3–5 training sessions/week' },
            { v: 'active',    i: '⚡', l: 'Very Active',      d: 'Hard training 6–7 days/week' },
            { v: 'athlete',   i: '🏆', l: 'Athlete',          d: 'Daily training, physical job' },
          ].map(a => (
            <OptionCard key={a.v} active={data.activity_level === a.v} onClick={() => update('activity_level', a.v)} icon={a.i} label={a.l} desc={a.d} />
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        <InputField label="Occupation" note="Physical vs desk job affects TDEE">
          <input className="input" value={data.occupation} onChange={e => update('occupation', e.target.value)} placeholder="e.g. Teacher, Nurse, Office" />
        </InputField>
        <InputField label="Avg Sleep (hours/night)">
          <input className="input" type="number" step="0.5" min="4" max="12" value={data.sleep_hours} onChange={e => update('sleep_hours', e.target.value)} />
        </InputField>
      </div>
      <div style={{ marginBottom: 14 }}>
        <div className="form-label" style={{ marginBottom: 8 }}>Daily Stress Level</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[{ v: 1, l: '1', d: 'Low' }, { v: 2, l: '2', d: '' }, { v: 3, l: '3', d: 'Mid' }, { v: 4, l: '4', d: '' }, { v: 5, l: '5', d: 'High' }].map(s => {
            const col = s.v <= 2 ? 'var(--accent)' : s.v <= 3 ? 'var(--warn)' : 'var(--danger)'
            const active = data.stress_level === s.v
            return (
              <button key={s.v} onClick={() => update('stress_level', s.v)} style={{
                flex: 1, padding: '8px 4px', borderRadius: 6, cursor: 'pointer', textAlign: 'center',
                background: active ? `${col}18` : 'var(--s3)', border: `1px solid ${active ? col : 'var(--border)'}`,
                color: active ? col : 'var(--sub)', transition: 'all .15s',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>{s.l}</div>
                <div style={{ fontSize: 9 }}>{s.d}</div>
              </button>
            )
          })}
        </div>
      </div>
      <InputField label="Injuries or Health Concerns" note="Coach uses this to adapt your programme">
        <textarea className="input" rows={2} style={{ resize: 'none' }} value={data.injuries}
          onChange={e => update('injuries', e.target.value)}
          placeholder="e.g. Lower back, left knee, shoulder history… or 'None'" />
      </InputField>

      {/* Blood pressure */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
        <div className="label" style={{ marginBottom: 4 }}>Resting Blood Pressure <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 400 }}>(optional)</span></div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Measured at rest, sitting. Used for cardiovascular health monitoring.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <InputField label="Systolic (mmHg)" note="Top number">
            <input className="input" type="number" min="80" max="220" value={data.systolic_bp} onChange={e => update('systolic_bp', e.target.value)} placeholder="120" />
          </InputField>
          <InputField label="Diastolic (mmHg)" note="Bottom number">
            <input className="input" type="number" min="50" max="140" value={data.diastolic_bp} onChange={e => update('diastolic_bp', e.target.value)} placeholder="80" />
          </InputField>
        </div>
        {data.systolic_bp && data.diastolic_bp && (() => {
          const s = parseInt(data.systolic_bp), d = parseInt(data.diastolic_bp)
          const cat = s < 120 && d < 80 ? { label: 'Normal', color: 'var(--accent)' }
            : s < 130 && d < 80 ? { label: 'Elevated', color: 'var(--warn)' }
            : s < 140 || d < 90 ? { label: 'High Stage 1', color: '#fb923c' }
            : { label: 'High Stage 2', color: 'var(--danger)' }
          return (
            <div style={{ marginTop: 8, padding: '6px 12px', borderRadius: 6, background: cat.color + '18', border: `1px solid ${cat.color}44`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.06em', color: cat.color }}>{cat.label}</span>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{data.systolic_bp}/{data.diastolic_bp} mmHg</span>
            </div>
          )
        })()}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext} disabled={!canProceed} style={{ flex: 1 }}>Continue →</button>
      </div>
    </div>
  )
}

// ─── step: cycle ──────────────────────────────────────────────────────────────

function StepCycleTracking({ data, update, onNext, onBack }) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 2, color: 'var(--accent)', marginBottom: 4 }}>PART 1 OF 2 — PROFILE</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 2, color: 'var(--white)', marginBottom: 4 }}>CYCLE TRACKING</h2>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>Your cycle directly affects training performance, recovery, and nutrition needs.</p>
      </div>
      <div style={{ padding: '16px 20px', background: 'var(--s3)', borderRadius: 10, border: '1px solid var(--border)', marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: 1, color: 'var(--white)', marginBottom: 4 }}>ENABLE CYCLE TRACKING</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Phase-based training and nutrition recommendations</div>
          </div>
          <button onClick={() => update('cycle_tracking_enabled', !data.cycle_tracking_enabled)} style={{
            width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
            background: data.cycle_tracking_enabled ? 'linear-gradient(135deg,var(--accent),var(--accent-hi))' : 'var(--s5)',
            position: 'relative', transition: 'background .2s', flexShrink: 0,
          }}>
            <span style={{
              position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%',
              transition: 'left .2s', left: data.cycle_tracking_enabled ? 23 : 3,
              background: data.cycle_tracking_enabled ? 'var(--ink)' : 'var(--muted)',
            }} />
          </button>
        </div>
      </div>
      {data.cycle_tracking_enabled && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <InputField label="Avg Cycle Length (days)" note="Typically 21–35">
            <input className="input" type="number" step="1" min="18" max="45" value={data.cycle_length} onChange={e => update('cycle_length', parseInt(e.target.value))} />
          </InputField>
          <InputField label="Avg Period Length (days)" note="Typically 3–7">
            <input className="input" type="number" step="1" min="1" max="10" value={data.period_length} onChange={e => update('period_length', parseInt(e.target.value))} />
          </InputField>
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext} style={{ flex: 1 }}>
          {data.cycle_tracking_enabled ? 'Continue →' : 'Skip →'}
        </button>
      </div>
    </div>
  )
}

// ─── step: posture photos ─────────────────────────────────────────────────────

function StepPosture({ data, update, onNext, onBack }) {
  const hasAny = data.posture_front || data.posture_back || data.posture_side
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 2, color: '#f472b6', marginBottom: 4 }}>PART 2 OF 2 — ASSESSMENT</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 2, color: 'var(--white)', marginBottom: 4 }}>POSTURE PHOTOS</h2>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>3 photos — front, back, and side. Your coach uses these to identify asymmetries and postural deviations.</p>
      </div>

      {/* How to take your photos */}
      <div style={{ padding: '12px 16px', background: 'var(--s3)', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 18 }}>
        <div className="label" style={{ marginBottom: 8, fontSize: 9 }}>HOW TO TAKE YOUR POSTURE PHOTOS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            { icon: '👕', text: 'Fitted clothing — shorts & sports top' },
            { icon: '📏', text: 'Stand in relaxed, natural posture' },
            { icon: '📷', text: 'Camera at waist height, 2–3m away' },
            { icon: '💡', text: 'Good lighting — avoid strong shadows' },
            { icon: '🦶', text: 'Feet hip-width apart, arms relaxed at sides' },
            { icon: '↔️', text: 'Side photo: shoulder level with camera' },
          ].map(t => (
            <div key={t.text} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 11, color: 'var(--sub)' }}>
              <span>{t.icon}</span><span>{t.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upload zones */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <PhotoZone label="Anterior" icon="⬆️" hint="Front view — face the camera" file={data.posture_front} onFile={f => update('posture_front', f)} />
        <PhotoZone label="Posterior" icon="⬇️" hint="Back view — face away from camera" file={data.posture_back} onFile={f => update('posture_back', f)} />
        <PhotoZone label="Lateral" icon="➡️" hint="Side view — left or right" file={data.posture_side} onFile={f => update('posture_side', f)} />
      </div>

      <InputField label="Posture Notes (optional)" note="Any areas of discomfort or things you've noticed about your posture">
        <textarea className="input" rows={2} style={{ resize: 'none' }} value={data.posture_notes || ''}
          onChange={e => update('posture_notes', e.target.value)} placeholder="e.g. Forward head, rounded shoulders, left hip higher than right…" />
      </InputField>

      <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext} style={{ flex: 1 }}>
          {hasAny ? 'Continue →' : 'Skip for now →'}
        </button>
      </div>
    </div>
  )
}

// ─── step: FMS ────────────────────────────────────────────────────────────────

function StepFMS({ data, update, onNext, onBack, videoUrls = {} }) {
  const [openTest, setOpenTest] = useState(FMS_TESTS[0].id)

  function updateFMS(testId, field, value) {
    update('fms', {
      ...data.fms,
      [testId]: { ...(data.fms[testId] || {}), [field]: value },
    })
  }

  const scored = FMS_TESTS.filter(t => data.fms?.[t.id]?.score != null).length
  const composite = FMS_TESTS.reduce((sum, t) => {
    const score = data.fms?.[t.id]?.score
    return score != null ? sum + score : sum
  }, 0)

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 2, color: '#f472b6', marginBottom: 4 }}>PART 2 OF 2 — ASSESSMENT</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 2, color: 'var(--white)', marginBottom: 4 }}>FMS SCREEN</h2>
            <p style={{ fontSize: 12, color: 'var(--muted)' }}>7 tests. Watch each demo, perform the movement, self-score 0–3.</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: scored >= 7 ? 'var(--accent)' : 'var(--sub)' }}>
              {scored}/7
            </div>
            <div style={{ fontSize: 9, color: 'var(--muted)' }}>
              {scored > 0 ? `Score: ${composite}` : 'scored'}
            </div>
          </div>
        </div>
      </div>

      {/* Scoring key */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[
          { s: '3', l: 'Perfect', c: 'var(--accent)' },
          { s: '2', l: 'Compensate', c: 'var(--info)' },
          { s: '1', l: 'Cannot', c: 'var(--warn)' },
          { s: '0', l: 'Pain', c: 'var(--danger)' },
        ].map(k => (
          <div key={k.s} style={{
            flex: 1, textAlign: 'center', padding: '5px 0',
            background: `${k.c}0f`, border: `1px solid ${k.c}33`, borderRadius: 4,
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: k.c }}>{k.s}</div>
            <div style={{ fontSize: 8, color: 'var(--muted)', marginTop: 1 }}>{k.l}</div>
          </div>
        ))}
      </div>

      {/* Test list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20, maxHeight: 420, overflowY: 'auto', paddingRight: 2 }}>
        {FMS_TESTS.map((test, idx) => {
          const testData = data.fms?.[test.id] || {}
          const score = testData.score ?? null
          const isOpen = openTest === test.id
          const scoreColor = score === null ? 'var(--muted)' : score === 3 ? 'var(--accent)' : score === 2 ? 'var(--info)' : score === 1 ? 'var(--warn)' : 'var(--danger)'

          return (
            <div key={test.id} style={{
              background: 'var(--s3)', borderRadius: 8,
              border: `1px solid ${isOpen ? 'var(--border-accent)' : 'var(--border)'}`,
              borderLeft: `3px solid ${score !== null ? scoreColor : 'var(--s5)'}`,
              overflow: 'hidden',
            }}>
              {/* Header */}
              <button
                onClick={() => setOpenTest(isOpen ? null : test.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--muted)', minWidth: 18 }}>
                  {idx + 1}
                </span>
                <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: .5, color: 'var(--white)' }}>
                  {test.name}
                  {test.bilateral && <span style={{ fontSize: 9, color: 'var(--muted)', marginLeft: 6 }}>BILATERAL</span>}
                </span>
                {score !== null ? (
                  <span style={{
                    fontFamily: 'var(--font-display)', fontSize: 18, color: scoreColor,
                    background: `${scoreColor}15`, border: `1px solid ${scoreColor}33`,
                    borderRadius: 4, padding: '2px 10px',
                  }}>{score}</span>
                ) : (
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>— score</span>
                )}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ color: 'var(--muted)', transform: isOpen ? 'rotate(180deg)' : '', flexShrink: 0 }}>
                  <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Expanded body */}
              {isOpen && (
                <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border)' }}>
                  {/* Description */}
                  <p style={{ fontSize: 12, color: 'var(--sub)', lineHeight: 1.7, margin: '12px 0 10px' }}>{test.desc}</p>

                  {/* Demo video link */}
                  <div style={{ marginBottom: 12 }}>
                    <DemoVideo videoUrl={videoUrls[test.id]} searchQuery={test.youtubeSearch} label={`Demo — ${test.name}`} />
                  </div>

                  {/* Scoring criteria */}
                  <div style={{ marginBottom: 14, padding: '10px 12px', background: 'var(--s4)', borderRadius: 6 }}>
                    <div className="label" style={{ marginBottom: 8, fontSize: 8 }}>SCORING CRITERIA</div>
                    {[3, 2, 1, 0].map(s => (
                      <div key={s} style={{
                        display: 'flex', gap: 10, padding: '4px 0',
                        borderBottom: s > 0 ? '1px solid var(--border)' : 'none',
                        opacity: score !== null && score !== s ? .5 : 1,
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-display)', fontSize: 14, minWidth: 16, textAlign: 'center',
                          color: s === 3 ? 'var(--accent)' : s === 2 ? 'var(--info)' : s === 1 ? 'var(--warn)' : 'var(--danger)',
                        }}>{s}</span>
                        <span style={{ fontSize: 11, color: 'var(--sub)', lineHeight: 1.5 }}>{test.criteria[s]}</span>
                      </div>
                    ))}
                  </div>

                  {/* Score buttons */}
                  <div className="label" style={{ marginBottom: 8, fontSize: 8 }}>YOUR SCORE</div>
                  <ScoreButtons value={score} onChange={v => updateFMS(test.id, 'score', v)} />

                  {/* Notes + video upload */}
                  <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <textarea className="input" rows={1} style={{ resize: 'none', fontSize: 12 }}
                      placeholder="Notes (optional — pain, restriction, compensation…)"
                      value={testData.notes || ''}
                      onChange={e => updateFMS(test.id, 'notes', e.target.value)} />
                    <VideoUploadBtn
                      file={testData.videoFile}
                      onFile={f => updateFMS(test.id, 'videoFile', f)}
                      label="Upload your attempt" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext} style={{ flex: 1 }}>
          {scored > 0 ? `Continue (${scored}/7 scored) →` : 'Skip for now →'}
        </button>
      </div>
    </div>
  )
}

// ─── step: ROM (hip / shoulder / spine) ──────────────────────────────────────

function StepMovement({ data, update, onNext, onBack }) {
  const [area, setArea] = useState('hip')
  const current = ROM_AREAS.find(a => a.id === area)

  function updateROM(areaId, testId, side, value) {
    const key = side ? `${testId}_${side}` : testId
    update('rom', {
      ...data.rom,
      [areaId]: { ...(data.rom?.[areaId] || {}), [key]: value },
    })
  }

  function getROM(areaId, testId, side) {
    const key = side ? `${testId}_${side}` : testId
    return data.rom?.[areaId]?.[key] || ''
  }

  const pctNormal = (value, normal) => {
    if (!value) return null
    const pct = Math.round((parseFloat(value) / normal) * 100)
    return pct
  }

  const pctColor = (pct) => {
    if (pct >= 90) return 'var(--accent)'
    if (pct >= 75) return 'var(--warn)'
    return 'var(--danger)'
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 2, color: '#f472b6', marginBottom: 4 }}>PART 2 OF 2 — ASSESSMENT</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 2, color: 'var(--white)', marginBottom: 4 }}>MOBILITY SCREEN</h2>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>Range of motion across hips, shoulders, and spine. Estimate is fine — exact goniometry not required.</p>
      </div>

      {/* Area tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {ROM_AREAS.map(a => (
          <button key={a.id} onClick={() => setArea(a.id)} style={{
            flex: 1, padding: '10px 8px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
            background: area === a.id ? 'rgba(0,200,150,.08)' : 'var(--s3)',
            border: `1px solid ${area === a.id ? 'var(--accent)' : 'var(--border)'}`,
            color: area === a.id ? 'var(--accent)' : 'var(--sub)', transition: 'all .15s',
          }}>
            <div style={{ fontSize: 18 }}>{a.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 1, marginTop: 3 }}>{a.label.toUpperCase()}</div>
          </button>
        ))}
      </div>

      {/* Instructions + demo video */}
      <div style={{ padding: '10px 14px', background: 'var(--s3)', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 14 }}>
        <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.6 }}>{current.instructions}</p>
        <DemoVideo youtubeId={current.youtubeId} searchQuery={current.youtubeSearch} label={`${current.label} Assessment Demo`} />
      </div>

      {/* ROM inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, maxHeight: 340, overflowY: 'auto' }}>
        {current.tests.map(test => {
          if (test.bilateral) {
            const lVal = getROM(area, test.id, 'l')
            const rVal = getROM(area, test.id, 'r')
            const lPct = pctNormal(lVal, test.normal)
            const rPct = pctNormal(rVal, test.normal)
            return (
              <div key={test.id} style={{
                padding: '10px 14px', background: 'var(--s3)',
                borderRadius: 8, border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: .5, color: 'var(--white)' }}>{test.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{test.cue}</div>
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--muted)' }}>Normal: {test.normal}°</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[{ side: 'l', label: 'Left', val: lVal, pct: lPct }, { side: 'r', label: 'Right', val: rVal, pct: rPct }].map(s => (
                    <div key={s.side}>
                      <div style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 4 }}>{s.label}</div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input className="input input-sm" type="number" step="1" min="0" max="200"
                          value={s.val} placeholder="°"
                          onChange={e => updateROM(area, test.id, s.side, e.target.value)}
                          style={{ flex: 1 }} />
                        {s.pct !== null && (
                          <span style={{
                            fontFamily: 'var(--font-display)', fontSize: 10,
                            color: pctColor(s.pct), minWidth: 36, textAlign: 'right',
                          }}>
                            {s.pct}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          const val = getROM(area, test.id, null)
          const pct = pctNormal(val, test.normal)
          return (
            <div key={test.id} style={{
              padding: '10px 14px', background: 'var(--s3)',
              borderRadius: 8, border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: .5, color: 'var(--white)' }}>{test.name}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{test.cue}</div>
              </div>
              <div style={{ fontSize: 9, color: 'var(--muted)', flexShrink: 0 }}>Normal: {test.normal}°</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input className="input input-sm" type="number" step="1" min="0" max="200"
                  value={val} placeholder="°"
                  onChange={e => updateROM(area, test.id, null, e.target.value)}
                  style={{ width: 64 }} />
                {pct !== null && (
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: pctColor(pct), minWidth: 36, textAlign: 'right' }}>
                    {pct}%
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Photo upload for this area */}
      <div style={{ marginBottom: 16 }}>
        <div className="label" style={{ marginBottom: 8, fontSize: 8 }}>UPLOAD PHOTO / VIDEO — {current.label.toUpperCase()} (OPTIONAL)</div>
        <VideoUploadBtn
          file={data[`${area}_media`]}
          onFile={f => update(`${area}_media`, f)}
          label={`Upload ${current.label} assessment video`} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext} style={{ flex: 1 }}>Finish Assessment →</button>
      </div>
    </div>
  )
}

// ─── step: baseline summary + week 1 protocol ────────────────────────────────

function StepBaseline({ data, onNext, onBack }) {
  const isMale = data.gender === 'male'
  const isFemale = data.gender === 'female' || data.gender === 'non_binary'
  const bf = (isMale || isFemale) && data.height_cm && data.waist_cm && data.neck_cm
    ? navalBF(isMale ? 'male' : 'female', data.height_cm, data.waist_cm, data.neck_cm, data.hips_cm)
    : null
  const bfCat    = bfCategory(isMale ? 'male' : 'female', bf)
  const leanMass = bf && data.current_weight ? Math.round((1 - bf / 100) * parseFloat(data.current_weight) * 10) / 10 : null
  const fatMass  = bf && data.current_weight ? Math.round((bf / 100) * parseFloat(data.current_weight) * 10) / 10 : null

  const age = data.date_of_birth
    ? Math.floor((new Date() - new Date(data.date_of_birth)) / (1000 * 60 * 60 * 24 * 365.25))
    : null

  const WEEK1_DAYS = [
    {
      day: 'Day 1',
      focus: 'Upper Body + Cooper Run',
      sessions: [
        { name: 'Cooper 12-Min Run', note: 'VO₂ Max baseline — run as far as possible in 12 minutes on a flat surface. Record distance in metres.' },
        { name: 'Bench Press', note: '3 sets to technical failure — coach records reps + weight for predicted 1RM' },
        { name: 'Pull-Up / Lat Pulldown', note: '3 sets — max reps bodyweight + max dead-hang hold (record in seconds)' },
        { name: 'Overhead Press', note: '3 sets — recorded for shoulder strength baseline' },
      ],
    },
    {
      day: 'Day 2',
      focus: 'Lower Body Strength',
      sessions: [
        { name: 'Back Squat', note: '3 sets to technical failure — coach records for predicted 1RM and movement quality' },
        { name: 'Romanian Deadlift', note: '3 sets — hip hinge pattern, records hamstring/hip loading capacity' },
        { name: 'Bulgarian Split Squat', note: '3 sets/side — unilateral lower body baseline, asymmetry check' },
        { name: 'Walking Lunge', note: '2 sets — movement pattern and coordination assessment' },
      ],
    },
    {
      day: 'Day 3',
      focus: 'Posterior Chain + Conditioning',
      sessions: [
        { name: 'Conventional Deadlift', note: '3 sets to technical failure — primary posterior chain strength baseline for predicted 1RM' },
        { name: 'Barbell Row', note: '3 sets — horizontal pull strength and upper back assessment' },
        { name: 'Dip / Tricep Press', note: '3 sets — pushing capacity and shoulder stability' },
        { name: 'GBC Conditioning Finisher', note: '10 min — 10 reps each: goblet squat + push-up + TRX row, minimal rest. Assesses work capacity and conditioning base.' },
      ],
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: 2, color: '#f472b6', marginBottom: 4 }}>PART 2 OF 2 — ASSESSMENT</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 2, color: 'var(--white)', marginBottom: 4 }}>YOUR BASELINE</h2>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>Here's your current snapshot and your Week 1 assessment protocol.</p>
      </div>

      {/* Current stats summary */}
      <div style={{ marginBottom: 20 }}>
        <div className="label" style={{ marginBottom: 10, fontSize: 9 }}>CURRENT SNAPSHOT</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))', gap: 8 }}>
          {[
            { label: 'Body Weight',   value: data.current_weight ? `${data.current_weight}kg`  : '—', color: 'var(--white)' },
            { label: 'Body Fat',      value: bf ? `${bf}%` : '—',                                     color: bfCat?.color || 'var(--muted)' },
            { label: 'Lean Mass',     value: leanMass ? `${leanMass}kg` : '—',                        color: 'var(--accent)' },
            { label: 'Fat Mass',      value: fatMass ? `${fatMass}kg` : '—',                          color: 'var(--muted)' },
            { label: 'Height',        value: data.height_cm ? `${data.height_cm}cm` : '—',            color: 'var(--sub)' },
            { label: 'Age',           value: age ? `${age} yrs` : '—',                               color: 'var(--sub)' },
            { label: 'Goal',          value: data.goal_type ? data.goal_type.charAt(0).toUpperCase() + data.goal_type.slice(1) : '—', color: 'var(--accent)' },
            { label: 'Experience',    value: data.training_experience || '—',                         color: 'var(--sub)' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '10px 12px', background: 'var(--s3)',
              borderRadius: 8, border: '1px solid var(--border)', textAlign: 'center',
            }}>
              <div style={{ fontSize: 8, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: 1, marginBottom: 4 }}>
                {s.label.toUpperCase()}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Week 1 protocol */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div className="label" style={{ fontSize: 9 }}>WEEK 1 — ASSESSMENT PROTOCOL</div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 1.5,
            color: 'var(--accent)', background: 'var(--accent-dim)',
            border: '1px solid var(--border-accent)', borderRadius: 4, padding: '2px 8px',
          }}>
            GBC FORMAT
          </div>
        </div>
        <div style={{ padding: '10px 14px', background: 'rgba(0,200,150,.05)', border: '1px solid rgba(0,200,150,.15)', borderRadius: 8, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--sub)', lineHeight: 1.7 }}>
            Your first week is a <strong style={{ color: 'var(--accent)' }}>testing week</strong>, not a training week.
            We use it to establish your baselines — VO₂ Max, strength 1RMs, and movement quality — then everything else gets built from here.
            Your coach will record results and use them to build your personalised programme.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {WEEK1_DAYS.map(day => (
            <div key={day.day} style={{
              background: 'var(--s3)', borderRadius: 10,
              border: '1px solid var(--border)',
              borderLeft: '3px solid var(--accent)',
              overflow: 'hidden',
            }}>
              <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--accent)', letterSpacing: 1 }}>{day.day}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--sub)', letterSpacing: .5 }}>{day.focus}</div>
              </div>
              <div style={{ borderTop: '1px solid var(--border)' }}>
                {day.sessions.map((s, i) => (
                  <div key={s.name} style={{
                    display: 'flex', gap: 12, padding: '8px 16px',
                    borderBottom: i < day.sessions.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                      background: 'var(--s4)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)',
                    }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--white)', marginBottom: 2 }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.5 }}>{s.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn btn-primary" onClick={onNext} style={{ flex: 1 }}>Complete Setup →</button>
      </div>
    </div>
  )
}

// ─── step: all set ────────────────────────────────────────────────────────────

function StepAllSet({ saving, error }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      {saving ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div className="spinner" style={{ width: 40, height: 40 }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--sub)', letterSpacing: 2 }}>
            UPLOADING & SAVING…
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>Uploading photos and saving your assessment data</div>
        </div>
      ) : error ? (
        <div>
          <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
          <div style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</div>
        </div>
      ) : (
        <>
          <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 24px' }}>
            <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(0,200,150,.15)" strokeWidth="6" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="url(#gl)" strokeWidth="6"
                strokeLinecap="round" strokeDasharray="276" strokeDashoffset="0" transform="rotate(-90 50 50)" />
              <defs>
                <linearGradient id="gl" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-hi)" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>✓</div>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 30, letterSpacing: 2, marginBottom: 10,
            background: 'linear-gradient(135deg,var(--accent),var(--accent-hi))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>YOU'RE ALL SET</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, maxWidth: 320, margin: '0 auto' }}>
            Profile complete and assessment submitted. Your coach will review your posture photos and FMS scores before building your programme.
          </p>
        </>
      )}
    </div>
  )
}

// ─── progress stepper ─────────────────────────────────────────────────────────

function ProgressBar({ current, total, part, partTotal }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--font-display)', letterSpacing: 1 }}>
          STEP {current} OF {total}
        </div>
        <div style={{ fontSize: 9, color: 'var(--muted)' }}>{pct}%</div>
      </div>
      <div style={{ height: 4, background: 'var(--s4)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 2, transition: 'width .3s ease',
          background: 'linear-gradient(90deg,var(--accent),var(--accent-hi))',
          boxShadow: '0 0 8px rgba(0,200,150,.4)',
        }} />
      </div>
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function Onboarding() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep]         = useState(0)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState(null)
  const [coachVideos, setCoachVideos] = useState({})

  // ── localStorage draft key (per-user so multi-account is safe) ──────────────
  const storageKey = user ? `pm_onboarding_${user.id}` : null

  // Fetch coach's onboarding video URLs
  useEffect(() => {
    const coachId = user?.user_metadata?.coach_id || profile?.coach_id
    if (!coachId) return
    supabase
      .from('profiles')
      .select('onboarding_videos')
      .eq('id', coachId)
      .single()
      .then(({ data: coachProfile }) => {
        if (coachProfile?.onboarding_videos) {
          setCoachVideos(coachProfile.onboarding_videos)
        }
      })
  }, [user, profile])

  // ── restore draft from localStorage when user becomes known ─────────────────
  useEffect(() => {
    if (!storageKey) return
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return
      const saved = JSON.parse(raw)
      setData(prev => ({ ...prev, ...saved }))
      const savedStep = localStorage.getItem(`${storageKey}_step`)
      if (savedStep !== null) setStep(Math.max(0, parseInt(savedStep, 10)))
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  const [data, setData] = useState({
    full_name:              profile?.full_name || '',
    date_of_birth:          '',
    gender:                 '',
    height_cm:              '',
    current_weight:         '',
    goal_type:              '',
    target_weight:          '',
    training_experience:    '',
    activity_level:         '',
    occupation:             '',
    sleep_hours:            7,
    stress_level:           3,
    injuries:               '',
    cycle_tracking_enabled: false,
    cycle_length:           28,
    period_length:          5,
    // address
    address_line1:          '',
    city:                   '',
    postcode:               '',
    country:                '',
    // blood pressure
    systolic_bp:            '',
    diastolic_bp:           '',
    // body measurements
    waist_cm:               '',
    neck_cm:                '',
    hips_cm:                '',
    // assessment
    posture_front:          null,
    posture_back:           null,
    posture_side:           null,
    posture_notes:          '',
    fms:                    {},
    rom:                    {},
    hip_media:              null,
    shoulder_media:         null,
    spine_media:            null,
  })

  function update(key, value) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  // ── auto-save draft (File objects excluded — not JSON-serialisable) ──────────
  useEffect(() => {
    if (!storageKey) return
    try {
      const toSave = {
        ...data,
        // strip File objects
        posture_front: null, posture_back: null, posture_side: null,
        hip_media: null, shoulder_media: null, spine_media: null,
        // keep FMS scores/notes but not video blobs
        fms: Object.fromEntries(
          Object.entries(data.fms || {}).map(([k, v]) => [k, { score: v.score ?? null, notes: v.notes || '' }])
        ),
      }
      localStorage.setItem(storageKey, JSON.stringify(toSave))
      localStorage.setItem(`${storageKey}_step`, String(step))
    } catch {}
  }, [data, step, storageKey])

  const showCycleStep = ['female', 'non_binary'].includes(data.gender)

  const steps = ['welcome', 'about', 'goal', 'lifestyle']
  if (showCycleStep) steps.push('cycle')
  steps.push('posture', 'fms', 'movement', 'baseline', 'done')
  const totalSteps = steps.length
  const currentStepId = steps[step]

  function nextStep() {
    if (step < totalSteps - 2) setStep(s => s + 1)
    else handleComplete()
  }

  function prevStep() {
    setStep(s => Math.max(0, s - 1))
  }

  // ── upload a file to Supabase Storage ──────────────────────

  async function uploadFile(bucket, file, folder = '') {
    if (!file) return null
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${folder}${Date.now()}.${ext}`
    const { data: uploadData, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true })
    if (error) return null
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(uploadData.path)
    return publicUrl
  }

  // ── save everything ─────────────────────────────────────────

  async function handleComplete() {
    setStep(totalSteps - 1)
    setSaving(true)
    setError(null)

    try {
      // 1 — upload posture photos
      const [frontUrl, backUrl, sideUrl] = await Promise.all([
        uploadFile('assessment-photos', data.posture_front, 'posture/front_'),
        uploadFile('assessment-photos', data.posture_back,  'posture/back_'),
        uploadFile('assessment-photos', data.posture_side,  'posture/side_'),
      ])

      // 2 — upload FMS attempt videos
      const fmsPayload = {}
      for (const test of FMS_TESTS) {
        const td = data.fms?.[test.id] || {}
        const videoUrl = td.videoFile
          ? await uploadFile('assessment-videos', td.videoFile, `fms/${test.id}_`)
          : null
        fmsPayload[test.id] = { score: td.score ?? null, notes: td.notes || '', video_url: videoUrl }
      }

      // 3 — upload ROM area media
      const [hipUrl, shoulderUrl, spineUrl] = await Promise.all([
        uploadFile('assessment-videos', data.hip_media,      'rom/hip_'),
        uploadFile('assessment-videos', data.shoulder_media, 'rom/shoulder_'),
        uploadFile('assessment-videos', data.spine_media,    'rom/spine_'),
      ])

      // 4 — save profile
      const { error: profileError } = await supabase.from('profiles').update({
        full_name:              data.full_name,
        date_of_birth:          data.date_of_birth || null,
        gender:                 data.gender,
        height_cm:              data.height_cm ? parseFloat(data.height_cm) : null,
        current_weight:         data.current_weight ? parseFloat(data.current_weight) : null,
        goal_type:              data.goal_type,
        target_weight:          data.target_weight ? parseFloat(data.target_weight) : null,
        training_experience:    data.training_experience,
        activity_level:         data.activity_level,
        occupation:             data.occupation || null,
        sleep_hours:            data.sleep_hours ? parseFloat(data.sleep_hours) : null,
        stress_level:           data.stress_level,
        injuries:               data.injuries || null,
        waist_cm:               data.waist_cm  ? parseFloat(data.waist_cm)  : null,
        neck_cm:                data.neck_cm   ? parseFloat(data.neck_cm)   : null,
        hips_cm:                data.hips_cm   ? parseFloat(data.hips_cm)   : null,
        cycle_tracking_enabled: data.cycle_tracking_enabled,
        cycle_length:           data.cycle_length,
        period_length:          data.period_length,
        address_line1:          data.address_line1 || null,
        city:                   data.city || null,
        postcode:               data.postcode || null,
        country:                data.country || null,
        systolic_bp:            data.systolic_bp ? parseInt(data.systolic_bp) : null,
        diastolic_bp:           data.diastolic_bp ? parseInt(data.diastolic_bp) : null,
        onboarding_complete:    true,
      }).eq('id', user.id)

      if (profileError) throw profileError

      // 4b — auto-link to coach if invited via coach invite
      const coachId = user.user_metadata?.coach_id
      if (coachId) {
        await supabase.from('clients').upsert(
          { coach_id: coachId, client_id: user.id },
          { onConflict: 'coach_id,client_id' }
        )
      }

      // 5 — save assessment
      await supabase.from('client_assessments').insert({
        client_id: user.id,
        posture: {
          front_url:    frontUrl,
          back_url:     backUrl,
          side_url:     sideUrl,
          notes:        data.posture_notes || '',
        },
        fms: fmsPayload,
        rom: {
          hip:      { ...data.rom?.hip,      media_url: hipUrl },
          shoulder: { ...data.rom?.shoulder, media_url: shoulderUrl },
          spine:    { ...data.rom?.spine,    media_url: spineUrl },
        },
      })

      await refreshProfile()
      // Clear the draft now that onboarding is complete
      if (storageKey) {
        localStorage.removeItem(storageKey)
        localStorage.removeItem(`${storageKey}_step`)
      }
      setTimeout(() => navigate('/dashboard', { replace: true }), 2500)

    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  const contentStep = step - 1 // 0-indexed for content steps (excluding welcome)
  const contentTotal = totalSteps - 2 // exclude welcome + done

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--ink)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient orbs */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,200,150,.07) 0%,transparent 70%)', top: '-20%', left: '-10%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(244,114,182,.04) 0%,transparent 70%)', bottom: '0%', right: '-5%', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 520, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{
          textAlign: 'center', marginBottom: 28,
          fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 4,
          background: 'linear-gradient(135deg,var(--accent),var(--accent-hi))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          PERFORMUSCLE
        </div>

        {/* Card */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(255,255,255,.04) 0%,rgba(255,255,255,.01) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,.08)',
          borderRadius: 16, padding: '32px 36px',
          boxShadow: '0 24px 80px rgba(0,0,0,.5)',
        }}>
          {step > 0 && step < totalSteps - 1 && (
            <ProgressBar current={contentStep} total={contentTotal} />
          )}

          <div key={step} style={{ animation: 'fadeIn .2s ease' }}>
            {currentStepId === 'welcome'  && <StepWelcome onNext={nextStep} coachVideoUrl={coachVideos.welcome} />}
            {currentStepId === 'about'    && <StepAboutYou data={data} update={update} onNext={nextStep} onBack={prevStep} />}
            {currentStepId === 'goal'     && <StepYourGoal data={data} update={update} onNext={nextStep} onBack={prevStep} />}
            {currentStepId === 'lifestyle'&& <StepLifestyle data={data} update={update} onNext={nextStep} onBack={prevStep} />}
            {currentStepId === 'cycle'    && <StepCycleTracking data={data} update={update} onNext={nextStep} onBack={prevStep} />}
            {currentStepId === 'posture'  && <StepPosture data={data} update={update} onNext={nextStep} onBack={prevStep} />}
            {currentStepId === 'fms'      && <StepFMS data={data} update={update} onNext={nextStep} onBack={prevStep} videoUrls={coachVideos} />}
            {currentStepId === 'movement'  && <StepMovement data={data} update={update} onNext={nextStep} onBack={prevStep} />}
            {currentStepId === 'baseline'  && <StepBaseline data={data} onNext={nextStep} onBack={prevStep} />}
            {currentStepId === 'done'      && <StepAllSet saving={saving} error={error} />}
          </div>
        </div>
      </div>
    </div>
  )
}
