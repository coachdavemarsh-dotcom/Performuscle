import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import { ThemeProvider } from './hooks/useTheme.jsx'
import AppShell from './components/layout/AppShell.jsx'

// Client pages
import Dashboard from './components/client/Dashboard.jsx'
import Training from './components/client/Training.jsx'
import Nutrition from './components/client/Nutrition.jsx'
import Habits from './components/client/Habits.jsx'
import Progress from './components/client/Progress.jsx'
import CheckIn from './components/client/CheckIn.jsx'
import Education from './components/client/Education.jsx'
import Learn from './components/client/Learn.jsx'
import GoalMap from './components/client/GoalMap.jsx'
import CycleTracker from './components/client/CycleTracker.jsx'
import TestResults from './components/client/TestResults.jsx'

// Coach pages
import CoachDashboard from './components/coach/CoachDashboard.jsx'
import CoachCheckIns from './components/coach/CheckIns.jsx'
import Programs from './components/coach/Programs.jsx'
import StripePage from './components/coach/Stripe.jsx'
import Calculators from './components/coach/Calculators.jsx'
import RecipeManager from './components/coach/RecipeManager.jsx'
import Testing from './components/coach/Testing.jsx'
import BiomechanicalAssessment from './components/coach/BiomechanicalAssessment.jsx'
import ProgramTemplates from './components/coach/ProgramTemplates.jsx'
import ContentHub from './components/coach/ContentHub.jsx'
import ClientProfile from './components/coach/ClientProfile.jsx'
import TechniqueLab from './components/coach/TechniqueLab.jsx'
import ClientDatabase from './components/coach/ClientDatabase.jsx'
import Supplements from './components/client/Supplements.jsx'
import Protocols from './components/client/Protocols.jsx'
import Mobility from './components/client/Mobility.jsx'
import PSMF from './components/client/PSMF.jsx'
import MealPlanTemplates from './components/coach/MealPlanTemplates.jsx'
import MealPlannerWizard from './components/client/MealPlannerWizard.jsx'

// Auth pages
import Auth from './components/Auth.jsx'
import Onboarding from './components/client/Onboarding.jsx'

function ProtectedRoute({ children, coachOnly = false }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh', background: 'var(--ink)' }}>
        <div className="spinner" />
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />
  if (coachOnly && !profile?.is_coach) return <Navigate to="/dashboard" replace />

  // Send non-coach clients through onboarding if not complete
  if (!profile?.is_coach && !profile?.onboarding_complete) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh', background: 'var(--ink)' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Auth */}
      <Route
        path="/auth"
        element={user ? <Navigate to="/dashboard" replace /> : <Auth />}
      />

      {/* Onboarding — standalone (no sidebar), auth required */}
      <Route
        path="/onboarding"
        element={
          !loading && !user
            ? <Navigate to="/auth" replace />
            : <Onboarding />
        }
      />

      {/* Client routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="training" element={<Training />} />
        <Route path="nutrition" element={<Nutrition />} />
        <Route path="habits" element={<Habits />} />
        <Route path="progress" element={<Progress />} />
        <Route path="checkin" element={<CheckIn />} />
        <Route path="education" element={<Education />} />
        <Route path="learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
        <Route path="goalmap" element={<GoalMap />} />
        <Route path="cycle" element={<CycleTracker />} />
        <Route path="results" element={<TestResults />} />
        <Route path="supplements" element={<Supplements />} />
        <Route path="protocols" element={<Protocols />} />
        <Route path="mobility" element={<Mobility />} />
        <Route path="psmf" element={<PSMF />} />
        <Route path="meal-planner" element={<MealPlannerWizard />} />

        {/* Coach routes */}
        <Route
          path="coach/dashboard"
          element={<ProtectedRoute coachOnly><CoachDashboard /></ProtectedRoute>}
        />
        <Route
          path="coach/checkins"
          element={<ProtectedRoute coachOnly><CoachCheckIns /></ProtectedRoute>}
        />
        <Route
          path="coach/programs"
          element={<ProtectedRoute coachOnly><Programs /></ProtectedRoute>}
        />
        <Route
          path="coach/recipes"
          element={<ProtectedRoute coachOnly><RecipeManager /></ProtectedRoute>}
        />
        <Route
          path="coach/meal-plans"
          element={<ProtectedRoute coachOnly><MealPlanTemplates /></ProtectedRoute>}
        />
        <Route
          path="coach/stripe"
          element={<ProtectedRoute coachOnly><StripePage /></ProtectedRoute>}
        />
        <Route
          path="coach/calculators"
          element={<ProtectedRoute coachOnly><Calculators /></ProtectedRoute>}
        />
        <Route
          path="coach/testing"
          element={<ProtectedRoute coachOnly><Testing /></ProtectedRoute>}
        />
        <Route
          path="coach/assessment"
          element={<ProtectedRoute coachOnly><BiomechanicalAssessment /></ProtectedRoute>}
        />
        <Route
          path="coach/templates"
          element={<ProtectedRoute coachOnly><ProgramTemplates /></ProtectedRoute>}
        />
        <Route
          path="coach/content"
          element={<ProtectedRoute coachOnly><ContentHub /></ProtectedRoute>}
        />
        <Route
          path="coach/client/:clientId"
          element={<ProtectedRoute coachOnly><ClientProfile /></ProtectedRoute>}
        />
        <Route
          path="coach/technique-lab"
          element={<ProtectedRoute coachOnly><TechniqueLab /></ProtectedRoute>}
        />
        <Route
          path="coach/clients"
          element={<ProtectedRoute coachOnly><ClientDatabase /></ProtectedRoute>}
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}
