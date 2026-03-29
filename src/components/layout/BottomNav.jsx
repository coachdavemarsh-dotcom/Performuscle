import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useTheme } from '../../hooks/useTheme.jsx'
import { signOut } from '../../lib/supabase.js'


// ─── icons (shared with Sidebar) ─────────────────────────────────────────────

const icons = {
  dashboard: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <rect x="1" y="1" width="6" height="6" rx="1.5"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5"/>
    </svg>
  ),
  training: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <path d="M2 8h2M12 8h2M4 8h8M4 6v4M12 6v4"/>
    </svg>
  ),
  nutrition: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <path d="M8 2C5.8 2 4 3.8 4 6c0 2.4 1.5 4.4 3.5 5.3l.5.2.5-.2C10.5 10.4 12 8.4 12 6c0-2.2-1.8-4-4-4z"/>
      <path d="M8 11.5V14"/>
    </svg>
  ),
  habits: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <path d="M4 8l2.5 2.5L12 5"/>
      <circle cx="8" cy="8" r="6.5"/>
    </svg>
  ),
  progress: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <path d="M2 12L6 7l3 3 5-6"/>
    </svg>
  ),
  checkin: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <rect x="3" y="2" width="10" height="12" rx="1.5"/>
      <path d="M6 2V1M10 2V1"/>
      <path d="M5.5 9l1.5 1.5L10 7"/>
    </svg>
  ),
  programs: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <rect x="2" y="3" width="12" height="10" rx="1.5"/>
      <path d="M5 7h6M5 10h4"/>
    </svg>
  ),
  stripe: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <rect x="1.5" y="4.5" width="13" height="9" rx="1.5"/>
      <path d="M1.5 7.5h13"/>
      <path d="M5 10.5h2"/>
    </svg>
  ),
  calc: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <rect x="2" y="2" width="12" height="12" rx="1.5"/>
      <path d="M5 5h2M9 5h2M5 8h2M9 8h2M5 11h2M9 11h2"/>
    </svg>
  ),
  testing: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <path d="M6 2v5L3 13h10L10 7V2"/>
      <path d="M5.5 2h5"/>
      <circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  assessment: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <circle cx="8" cy="4" r="2"/>
      <path d="M8 6v4"/>
      <path d="M5 10l3 4 3-4"/>
      <path d="M4 8H2M14 8h-2"/>
    </svg>
  ),
  education: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <path d="M8 2L1 6l7 4 7-4-7-4z"/>
      <path d="M3 8v4c0 1 2.2 2 5 2s5-1 5-2V8"/>
    </svg>
  ),
  templates: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <rect x="2" y="2" width="5" height="5" rx="1"/>
      <rect x="9" y="2" width="5" height="5" rx="1"/>
      <rect x="2" y="9" width="5" height="5" rx="1"/>
      <path d="M9 11.5h5M11.5 9v5"/>
    </svg>
  ),
  content: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <rect x="2" y="2" width="12" height="10" rx="1.5"/>
      <path d="M6 6l4 2-4 2V6z" fill="currentColor" stroke="none"/>
      <path d="M2 14h12"/>
    </svg>
  ),
  goalmap: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <path d="M1 13L5 8l2.5 2.5L11 5l4 3"/>
      <circle cx="13" cy="3.5" r="1.5" fill="currentColor" stroke="none"/>
      <path d="M1 13h14" strokeDasharray="2 1.5"/>
    </svg>
  ),
  results: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <rect x="2" y="2" width="12" height="12" rx="1.5"/>
      <path d="M5 11l2-3 2 2 2-4"/>
    </svg>
  ),
  cycle: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <circle cx="8" cy="8" r="6"/>
      <path d="M8 4v4l2.5 2.5"/>
      <circle cx="8" cy="3" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  learn: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <path d="M8 2L1 6l7 4 7-4-7-4z"/>
      <path d="M3 8v4c0 1 2.2 2 5 2s5-1 5-2V8"/>
      <path d="M13 6v4"/>
      <circle cx="13" cy="11" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <path d="M6 13H3a1 1 0 01-1-1V4a1 1 0 011-1h3"/>
      <path d="M10 11l3-3-3-3M13 8H6"/>
    </svg>
  ),
  more: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <circle cx="3" cy="8" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="13" cy="8" r="1.2" fill="currentColor" stroke="none"/>
    </svg>
  ),
  supplements: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <rect x="5" y="2" width="6" height="12" rx="3"/>
      <path d="M5 8h6"/>
    </svg>
  ),
  protocols: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <path d="M3 4h10M3 8h7M3 12h5"/>
      <circle cx="13" cy="11" r="2.5"/>
      <path d="M12 11h2M13 10v2"/>
    </svg>
  ),
  mobility: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
      <circle cx="8" cy="3" r="1.5"/>
      <path d="M8 4.5v4"/>
      <path d="M5 7l3 1.5L11 7"/>
      <path d="M6 8.5l-2 4M10 8.5l2 4"/>
    </svg>
  ),
}

// ─── nav definitions ──────────────────────────────────────────────────────────

const clientPrimary = [
  { to: '/dashboard',  label: 'Home',     icon: 'dashboard' },
  { to: '/training',   label: 'Train',    icon: 'training'  },
  { to: '/nutrition',  label: 'Fuel',     icon: 'nutrition' },
  { to: '/progress',   label: 'Progress', icon: 'progress'  },
  { to: '/checkin',    label: 'Check-In', icon: 'checkin'   },
]

const clientSecondary = [
  { to: '/habits',       label: 'Habits',       icon: 'habits'       },
  { to: '/mobility',     label: 'Mobility',     icon: 'mobility'     },
  { to: '/supplements',  label: 'Supplements',  icon: 'supplements'  },
  { to: '/protocols',    label: 'Protocols',    icon: 'protocols'    },
  { to: '/goalmap',      label: 'Goal Map',     icon: 'goalmap'      },
  { to: '/results',      label: 'Results',      icon: 'results'      },
  { to: '/education',    label: 'Education',    icon: 'education'    },
  { to: '/learn',        label: 'Learn',        icon: 'learn'        },
  { to: '/cycle',        label: 'Cycle',        icon: 'cycle'        },
]

const coachPrimary = [
  { to: '/coach/dashboard', label: 'Home',     icon: 'dashboard' },
  { to: '/coach/checkins',  label: 'Check-ins', icon: 'checkin'  },
  { to: '/coach/programs',  label: 'Programs', icon: 'programs'  },
  { to: '/coach/stripe',    label: 'Billing',  icon: 'stripe'    },
]

const coachSecondary = [
  { to: '/coach/templates',   label: 'Templates',   icon: 'templates'   },
  { to: '/coach/assessment',  label: 'Assessment',  icon: 'assessment'  },
  { to: '/coach/testing',     label: 'Testing',     icon: 'testing'     },
  { to: '/coach/calculators', label: 'Calculators', icon: 'calc'        },
  { to: '/coach/content',     label: 'Content Hub', icon: 'content'     },
]

// ─── bottom nav tab item ──────────────────────────────────────────────────────

function NavTab({ to, label, icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
    >
      <span className="bottom-nav-icon">{icons[icon]}</span>
      <span className="bottom-nav-label">{label}</span>
    </NavLink>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function BottomNav({ mode, onModeChange }) {
  const { profile, isCoach } = useAuth()
  const { theme, toggle: toggleTheme, isDark } = useTheme()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [sheetOpen, setSheetOpen] = useState(false)

  const primary   = mode === 'coach' ? coachPrimary   : clientPrimary
  const secondary = (mode === 'coach' ? coachSecondary : clientSecondary).filter(item => {
    if (item.to === '/cycle') return profile?.cycle_tracking_enabled === true
    return true
  })

  // Is any secondary route currently active?
  const secondaryActive = secondary.some(s => pathname === s.to)

  async function handleSignOut() {
    setSheetOpen(false)
    await signOut()
    navigate('/auth')
  }

  return (
    <>
      {/* ── bottom nav bar ───────────────────────────────────────────── */}
      <nav className="bottom-nav">
        {primary.map(item => (
          <NavTab key={item.to} to={item.to} label={item.label} icon={item.icon} />
        ))}

        {/* More tab — shown if there are secondary items */}
        {secondary.length > 0 && (
          <button
            className={`bottom-nav-item${sheetOpen || secondaryActive ? ' active' : ''}`}
            onClick={() => setSheetOpen(o => !o)}
          >
            <span className="bottom-nav-icon">{icons.more}</span>
            <span className="bottom-nav-label">More</span>
          </button>
        )}
      </nav>

      {/* ── more sheet ───────────────────────────────────────────────── */}
      {sheetOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setSheetOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 98,
            }}
          />

          {/* Sheet */}
          <div style={{
            position: 'fixed',
            bottom: 'var(--bottom-nav-height)',
            left: 0, right: 0,
            background: 'var(--s2)',
            borderTop: '1px solid var(--border)',
            borderRadius: '16px 16px 0 0',
            zIndex: 99,
            padding: '20px 16px',
            animation: 'slideUp .2s ease',
          }}>
            {/* Drag handle */}
            <div style={{
              width: 36, height: 4, borderRadius: 2,
              background: 'var(--s5)',
              margin: '-10px auto 18px',
            }} />

            {/* Mode toggle for coaches */}
            {isCoach && (
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 2,
                  color: 'var(--muted)', marginBottom: 10,
                }}>
                  MODE
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['client', 'coach'].map(m => (
                    <button
                      key={m}
                      onClick={() => { onModeChange(m); setSheetOpen(false) }}
                      style={{
                        flex: 1, padding: '10px',
                        fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 2,
                        borderRadius: 8, border: `1.5px solid ${mode === m ? 'var(--accent)' : 'var(--border)'}`,
                        background: mode === m ? 'var(--accent-dim)' : 'var(--s3)',
                        color: mode === m ? 'var(--accent)' : 'var(--muted)',
                        cursor: 'pointer', transition: 'all .15s',
                      }}
                    >
                      {m.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary nav grid */}
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 2,
              color: 'var(--muted)', marginBottom: 12,
            }}>
              MORE
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
              marginBottom: 20,
            }}>
              {secondary.map(item => {
                const isActive = pathname === item.to
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSheetOpen(false)}
                    style={{
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      gap: 6, padding: '12px 8px',
                      borderRadius: 10,
                      background: isActive ? 'var(--accent-dim)' : 'var(--s3)',
                      border: `1px solid ${isActive ? 'rgba(0,200,150,.3)' : 'var(--border)'}`,
                      color: isActive ? 'var(--accent)' : 'var(--sub)',
                      textDecoration: 'none',
                      transition: 'all .15s',
                    }}
                  >
                    {icons[item.icon]}
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 8, letterSpacing: 1,
                      textAlign: 'center',
                    }}>
                      {item.label}
                    </span>
                  </NavLink>
                )
              })}
            </div>

            {/* Theme toggle */}
            <div style={{ marginBottom: 12 }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 8, letterSpacing: 2,
                color: 'var(--muted)', marginBottom: 10,
              }}>
                APPEARANCE
              </div>
              <button
                onClick={toggleTheme}
                style={{
                  width: '100%', padding: '12px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'var(--s3)', border: '1px solid var(--border)',
                  borderRadius: 10, cursor: 'pointer', transition: 'all .15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 2, color: 'var(--white)' }}>
                    {isDark ? 'LIGHT MODE' : 'DARK MODE'}
                  </span>
                </div>
                {/* Toggle pill */}
                <div style={{
                  width: 40, height: 22, borderRadius: 11,
                  background: isDark ? 'var(--accent)' : 'var(--s5)',
                  border: '1px solid var(--border)',
                  position: 'relative', transition: 'background .2s',
                }}>
                  <div style={{
                    position: 'absolute', top: 3,
                    left: isDark ? 20 : 3,
                    width: 14, height: 14, borderRadius: '50%',
                    background: isDark ? 'var(--ink)' : 'var(--muted)',
                    transition: 'left .2s',
                  }} />
                </div>
              </button>
            </div>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              style={{
                width: '100%', padding: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'var(--s3)', border: '1px solid var(--border)',
                borderRadius: 10, color: 'var(--muted)', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: 2,
                transition: 'all .15s',
              }}
            >
              {icons.logout}
              SIGN OUT
            </button>
          </div>
        </>
      )}
    </>
  )
}
