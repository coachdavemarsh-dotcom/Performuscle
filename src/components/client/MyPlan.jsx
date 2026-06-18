import { useState } from 'react'
import MyRoadmap from './MyRoadmap.jsx'
import GoalMap from './GoalMap.jsx'

const TABS = [
  { id: 'roadmap', label: 'MY ROADMAP' },
  { id: 'goals',   label: 'GOAL MAP'   },
]

export default function MyPlan() {
  const [tab, setTab] = useState('roadmap')

  return (
    <div>
      {/* Tab switcher */}
      <div style={{
        display: 'flex', gap: 0, marginBottom: 24,
        borderBottom: '1px solid var(--border)',
      }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 20px', border: 'none', cursor: 'pointer',
              background: 'transparent',
              fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: 1.5,
              color: tab === t.id ? 'var(--accent)' : 'var(--muted)',
              borderBottom: `2px solid ${tab === t.id ? 'var(--accent)' : 'transparent'}`,
              marginBottom: -1, transition: 'all .15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'roadmap' && <MyRoadmap />}
      {tab === 'goals'   && <GoalMap />}
    </div>
  )
}
