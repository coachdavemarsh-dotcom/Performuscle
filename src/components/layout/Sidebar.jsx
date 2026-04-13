import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { signOut } from '../../lib/supabase.js'

// Icons (inline SVG to avoid dependency)
const icons = {
  dashboard: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="6" height="6" rx="1.5"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5"/>
    </svg>
  ),
  training: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 8h2M12 8h2M4 8h8M4 6v4M12 6v4"/>
    </svg>
  ),
  nutrition: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2C5.8 2 4 3.8 4 6c0 2.4 1.5 4.4 3.5 5.3l.5.2.5-.2C10.5 10.4 12 8.4 12 6c0-2.2-1.8-4-4-4z"/>
      <path d="M8 11.5V14"/>
    </svg>
  ),
  habits: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 8l2.5 2.5L12 5"/>
      <circle cx="8" cy="8" r="6.5"/>
    </svg>
  ),
  progress: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12L6 7l3 3 5-6"/>
    </svg>
  ),
  checkin: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="2" width="10" height="12" rx="1.5"/>
      <path d="M6 2V1M10 2V1"/>
      <path d="M5.5 9l1.5 1.5L10 7"/>
    </svg>
  ),
  clients: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6" cy="5" r="2.5"/>
      <path d="M1.5 13.5c0-2.2 2-4 4.5-4s4.5 1.8 4.5 4"/>
      <circle cx="12" cy="5" r="2" />
      <path d="M14.5 13c0-1.7-1.3-3-3-3"/>
    </svg>
  ),
  programs: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="12" height="10" rx="1.5"/>
      <path d="M5 7h6M5 10h4"/>
    </svg>
  ),
  stripe: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="4.5" width="13" height="9" rx="1.5"/>
      <path d="M1.5 7.5h13"/>
      <path d="M5 10.5h2"/>
    </svg>
  ),
  calc: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="12" height="12" rx="1.5"/>
      <path d="M5 5h2M9 5h2M5 8h2M9 8h2M5 11h2M9 11h2"/>
    </svg>
  ),
  testing: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2v5L3 13h10L10 7V2"/>
      <path d="M5.5 2h5"/>
      <circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  assessment: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="4" r="2"/>
      <path d="M8 6v4"/>
      <path d="M5 10l3 4 3-4"/>
      <path d="M4 8H2M14 8h-2"/>
    </svg>
  ),
  education: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2L1 6l7 4 7-4-7-4z"/>
      <path d="M3 8v4c0 1 2.2 2 5 2s5-1 5-2V8"/>
    </svg>
  ),
  recipes: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2a5 5 0 010 7M3 9.5C3 7 5 5 8 5s5 2 5 4.5V13H3V9.5z"/>
      <line x1="5" y1="13" x2="5" y2="15"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="11" y1="13" x2="11" y2="15"/>
    </svg>
  ),
  mealplans: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="12" height="12" rx="1.5"/>
      <path d="M5 5h6M5 8h4M5 11h3"/>
      <circle cx="12" cy="10.5" r="2.5" fill="none"/>
      <path d="M11.3 10.5h1.4M12 9.8v1.4"/>
    </svg>
  ),
  templates: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="5" height="5" rx="1"/>
      <rect x="9" y="2" width="5" height="5" rx="1"/>
      <rect x="2" y="9" width="5" height="5" rx="1"/>
      <path d="M9 11.5h5M11.5 9v5"/>
    </svg>
  ),
  content: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="12" height="10" rx="1.5"/>
      <path d="M6 6l4 2-4 2V6z" fill="currentColor" stroke="none"/>
      <path d="M2 14h12"/>
    </svg>
  ),
  goalmap: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 13L5 8l2.5 2.5L11 5l4 3"/>
      <circle cx="13" cy="3.5" r="1.5" fill="currentColor" stroke="none"/>
      <path d="M1 13h14" strokeDasharray="2 1.5"/>
    </svg>
  ),
  results: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="12" height="12" rx="1.5"/>
      <path d="M5 11l2-3 2 2 2-4"/>
    </svg>
  ),
  cycle: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6"/>
      <path d="M8 4v4l2.5 2.5"/>
      <circle cx="8" cy="3" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  learn: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2L1 6l7 4 7-4-7-4z"/>
      <path d="M3 8v4c0 1 2.2 2 5 2s5-1 5-2V8"/>
      <path d="M13 6v4"/>
      <circle cx="13" cy="11" r="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 13H3a1 1 0 01-1-1V4a1 1 0 011-1h3"/>
      <path d="M10 11l3-3-3-3M13 8H6"/>
    </svg>
  ),
  technique: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="3" width="14" height="10" rx="1.5"/>
      <path d="M6 6.5l4 2-4 2V6.5z" fill="currentColor" stroke="none"/>
    </svg>
  ),
  database: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="8" cy="4.5" rx="5.5" ry="2"/>
      <path d="M2.5 4.5v3c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-3"/>
      <path d="M2.5 7.5v3c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-3"/>
    </svg>
  ),
  supplements: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="2" width="6" height="12" rx="3"/>
      <path d="M5 8h6"/>
    </svg>
  ),
  protocols: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 4h10M3 8h7M3 12h5"/>
      <circle cx="13" cy="11" r="2.5"/>
      <path d="M12 11h2M13 10v2"/>
    </svg>
  ),
  mobility: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="3" r="1.5"/>
      <path d="M8 4.5v4"/>
      <path d="M5 7l3 1.5L11 7"/>
      <path d="M6 8.5l-2 4M10 8.5l2 4"/>
    </svg>
  ),
  mealplanner: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="12" height="10" rx="1.5"/>
      <path d="M5 6h6M5 9h3"/>
      <circle cx="11" cy="10" r="2" fill="none"/>
      <path d="M10.3 10h1.4M11 9.3v1.4"/>
    </svg>
  ),
}

const clientNav = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/training', label: 'Training', icon: 'training' },
  { to: '/nutrition', label: 'Nutrition', icon: 'nutrition' },
  { to: '/meal-planner', label: 'Meal Planner', icon: 'mealplanner' },
  { to: '/habits', label: 'Habits', icon: 'habits' },
  { to: '/progress', label: 'Progress', icon: 'progress' },
  { to: '/checkin', label: 'Check-In', icon: 'checkin' },
  { to: '/learn', label: 'Learn', icon: 'learn' },
  { to: '/education', label: 'Education', icon: 'education' },
  { to: '/goalmap', label: 'Goal Map', icon: 'goalmap' },
  { to: '/results', label: 'My Results', icon: 'results' },
  { to: '/cycle', label: 'Cycle', icon: 'cycle' },
  { to: '/supplements', label: 'Supplements', icon: 'supplements' },
  { to: '/protocols', label: 'Protocols', icon: 'protocols' },
  { to: '/mobility', label: 'Mobility', icon: 'mobility' },
]

const coachNav = [
  { to: '/coach/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/coach/checkins', label: 'Check-Ins', icon: 'checkin' },
  { to: '/coach/programs', label: 'Programs', icon: 'programs' },
  { to: '/coach/recipes',     label: 'Recipes',    icon: 'recipes'    },
  { to: '/coach/meal-plans', label: 'Meal Plans', icon: 'mealplans' },
  { to: '/coach/templates', label: 'Templates', icon: 'templates' },
  { to: '/coach/assessment', label: 'Assessment', icon: 'assessment' },
  { to: '/coach/testing', label: 'Testing', icon: 'testing' },
  { to: '/coach/calculators', label: 'Calculators', icon: 'calc' },
  { to: '/coach/content', label: 'Content Hub', icon: 'content' },
  { to: '/coach/technique-lab', label: 'Technique Lab', icon: 'technique' },
  { to: '/coach/clients', label: 'Client Database', icon: 'database' },
  { to: '/coach/stripe', label: 'Billing', icon: 'stripe' },
]

export default function Sidebar({ mode, onModeChange }) {
  const { profile, isCoach } = useAuth()
  const navigate = useNavigate()
  const nav = (mode === 'coach' ? coachNav : clientNav).filter(item => {
    if (item.to === '/cycle') return profile?.cycle_tracking_enabled === true
    return true
  })

  async function handleSignOut() {
    await signOut()
    navigate('/auth')
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <nav className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-name">PERFORMUSCLE</div>
        <div className="logo-tag">Health · Function · Performance</div>
      </div>

      {/* Mode Toggle (only for coaches) */}
      {isCoach && (
        <div style={{ padding: '12px 12px 0' }}>
          <div className="sidebar-mode-toggle">
            <button
              className={`mode-toggle-btn ${mode === 'client' ? 'active' : ''}`}
              onClick={() => onModeChange('client')}
            >
              CLIENT
            </button>
            <button
              className={`mode-toggle-btn ${mode === 'coach' ? 'active' : ''}`}
              onClick={() => onModeChange('coach')}
            >
              COACH
            </button>
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">
          {mode === 'coach' ? 'Coach Portal' : 'My Portal'}
        </div>
        {nav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-nav-icon">{icons[item.icon]}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sidebar-user-name">{profile?.full_name || 'Loading…'}</div>
            <div className="sidebar-user-role">
              {isCoach ? 'Coach' : profile?.plan?.toUpperCase() || 'Client'}
            </div>
          </div>
          <button
            className="sidebar-nav-icon"
            onClick={handleSignOut}
            title="Sign out"
            style={{ color: 'var(--muted)', flexShrink: 0 }}
          >
            {icons.logout}
          </button>
        </div>
      </div>
    </nav>
  )
}
