import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import BottomNav from './BottomNav.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'

export default function AppShell() {
  const { isCoach } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Determine mode from current route
  const [mode, setMode] = useState(
    location.pathname.startsWith('/coach') ? 'coach' : 'client'
  )

  useEffect(() => {
    const isCoachRoute = location.pathname.startsWith('/coach')
    setMode(isCoachRoute ? 'coach' : 'client')
  }, [location.pathname])

  function handleModeChange(newMode) {
    setMode(newMode)
    if (newMode === 'coach') {
      navigate('/coach/dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="app-shell">
      <Sidebar mode={mode} onModeChange={handleModeChange} />
      <div className="main-content">
        <Topbar mode={mode} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
      <BottomNav mode={mode} onModeChange={handleModeChange} />
    </div>
  )
}
