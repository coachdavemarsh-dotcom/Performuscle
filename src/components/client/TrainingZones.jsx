import { useAuth } from '../../hooks/useAuth.jsx'
import { Link } from 'react-router-dom'
import TrainingZonesPanel from '../shared/TrainingZonesPanel.jsx'

export default function TrainingZones() {
  const { user } = useAuth()

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">My Training Zones</div>
          <div className="page-subtitle">
            Your current heart rate, pace, power and swim zones — based on your latest test results.{' '}
            <Link to="/results" style={{ color: 'var(--accent)' }}>View full test history →</Link>
          </div>
        </div>
      </div>

      <TrainingZonesPanel clientId={user?.id} />
    </div>
  )
}
