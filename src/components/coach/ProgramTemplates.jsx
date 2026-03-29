import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROGRAM_TEMPLATES, CONDITIONING_METHODS } from '../../data/programTemplates.js';
import { supabase } from '../../lib/supabase.js';
import { useCoach } from '../../hooks/useCoach.js';
import { createProgramFromTemplate } from '../../lib/supabase.js';
import TemplateCustomiser from './TemplateCustomiser.jsx';

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────

const METHOD_COLORS = {
  GBC: { bg: 'rgba(0,200,150,0.15)', border: '#00C896', text: '#00FFB8' },
  'Heavy Duty': { bg: 'rgba(220,50,50,0.15)', border: '#dc3232', text: '#ff6b6b' },
  Gironda: { bg: 'rgba(140,60,220,0.15)', border: '#8c3cdc', text: '#c084fc' },
  GVT: { bg: 'rgba(50,100,220,0.15)', border: '#3264dc', text: '#93c5fd' },
  Poliquin: { bg: 'rgba(200,160,0,0.15)', border: '#c8a000', text: '#fcd34d' },
  Classic: { bg: 'rgba(100,180,100,0.15)', border: '#64b464', text: '#86efac' },
};

const GOAL_COLORS = {
  'Body Composition': { bg: 'rgba(0,200,150,0.15)', text: '#00FFB8' },
  Hypertrophy: { bg: 'rgba(140,60,220,0.15)', text: '#c084fc' },
  Strength: { bg: 'rgba(50,100,220,0.15)', text: '#93c5fd' },
  'Fat Loss': { bg: 'rgba(245,120,0,0.18)', text: '#fb923c' },
};

const DIFFICULTY_COLORS = {
  Intermediate: { bg: 'rgba(250,200,0,0.12)', text: '#fcd34d' },
  Advanced: { bg: 'rgba(220,50,50,0.12)', text: '#f87171' },
};

const CATEGORY_COLORS = {
  'Speed-Strength': { bg: 'rgba(220,50,50,0.15)', text: '#f87171' },
  'Speed Endurance': { bg: 'rgba(245,120,0,0.15)', text: '#fb923c' },
  'Metabolic Conditioning': { bg: 'rgba(0,200,150,0.15)', text: '#00FFB8' },
  'Aerobic Base': { bg: 'rgba(50,100,220,0.15)', text: '#93c5fd' },
  'Aerobic Development': { bg: 'rgba(100,180,100,0.15)', text: '#86efac' },
  ESD: { bg: 'rgba(200,160,0,0.15)', text: '#fcd34d' },
};

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────

function Badge({ color, children, style }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 20,
        fontSize: 11,
        fontFamily: 'var(--font-display)',
        letterSpacing: '0.04em',
        background: color.bg,
        color: color.text,
        border: `1px solid ${color.border || color.text + '55'}`,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function MethodBadge({ method }) {
  const color = METHOD_COLORS[method] || METHOD_COLORS['Classic'];
  return <Badge color={color}>{method}</Badge>;
}

function GoalBadge({ goal }) {
  const color = GOAL_COLORS[goal] || { bg: 'rgba(100,100,100,0.15)', text: '#aaa' };
  return <Badge color={color}>{goal}</Badge>;
}

function DifficultyBadge({ difficulty }) {
  const color = DIFFICULTY_COLORS[difficulty] || { bg: 'rgba(100,100,100,0.15)', text: '#aaa' };
  return <Badge color={color}>{difficulty}</Badge>;
}

function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] || { bg: 'rgba(100,100,100,0.15)', text: '#aaa' };
  return <Badge color={color}>{category}</Badge>;
}

function Toast({ message, visible }) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? 0 : 80}px)`,
        opacity: visible ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        background: 'var(--accent)',
        color: 'var(--ink)',
        padding: '12px 28px',
        borderRadius: 10,
        fontFamily: 'var(--font-display)',
        fontSize: 14,
        letterSpacing: '0.05em',
        fontWeight: 700,
        zIndex: 9999,
        pointerEvents: 'none',
        boxShadow: '0 8px 32px rgba(0,200,150,0.35)',
      }}
    >
      {message}
    </div>
  );
}

function WeeklyScheduleStrip({ schedule }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {DAY_LABELS.map((label, i) => {
        const isTraining = schedule[i] === 'Training';
        return (
          <div
            key={label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              flex: 1,
            }}
          >
            <div
              style={{
                width: '100%',
                height: 34,
                borderRadius: 6,
                background: isTraining ? 'rgba(0,200,150,0.18)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isTraining ? 'var(--accent)' : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isTraining ? (
                <span style={{ color: 'var(--accent)', fontSize: 14 }}>●</span>
              ) : (
                <span style={{ color: 'var(--muted)', fontSize: 11 }}>—</span>
              )}
            </div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 10,
                color: isTraining ? 'var(--accent)' : 'var(--muted)',
                letterSpacing: '0.04em',
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ExerciseTable({ exercises }) {
  const headers = ['', 'Exercise', 'Sets', 'Reps', 'Tempo', 'Rest', 'Notes'];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          minWidth: 620,
        }}
      >
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '8px 10px',
                  background: 'rgba(255,255,255,0.04)',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--muted)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 10,
                  letterSpacing: '0.07em',
                  fontWeight: 400,
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {exercises.map((ex, idx) => {
            const isSuperset = !!ex.superset_group
            const isEven = idx % 2 === 0;
            return (
              <tr
                key={idx}
                style={{ background: isEven ? 'transparent' : 'rgba(255,255,255,0.02)' }}
              >
                <td style={tdStyle}>
                  {ex.superset_group && (
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 12,
                        color: 'var(--accent)',
                        letterSpacing: '0.06em',
                        background: 'rgba(0,200,150,0.12)',
                        padding: '2px 7px',
                        borderRadius: 4,
                      }}
                    >
                      {ex.superset_group}
                    </span>
                  )}
                </td>
                <td style={{ ...tdStyle, color: 'var(--white)', minWidth: 180 }}>
                  {ex.name}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{ex.set_count}</td>
                <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>{ex.rep_range}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 13,
                      letterSpacing: '0.1em',
                      color: 'var(--accent-hi)',
                    }}
                  >
                    {ex.tempo || '—'}
                  </span>
                </td>
                <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                  {ex.rest_seconds ? `${ex.rest_seconds}s` : '—'}
                </td>
                <td style={{ ...tdStyle, color: 'var(--muted)', fontSize: 12, maxWidth: 260 }}>
                  {ex.notes || ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const tdStyle = {
  padding: '9px 10px',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  color: 'var(--sub)',
  verticalAlign: 'top',
};

function computeSchedule(daysPerWeek) {
  const patterns = {
    3: ['Training', 'Rest', 'Training', 'Rest', 'Training', 'Rest', 'Rest'],
    4: ['Training', 'Training', 'Rest', 'Training', 'Training', 'Rest', 'Rest'],
    5: ['Training', 'Training', 'Rest', 'Training', 'Training', 'Training', 'Rest'],
    6: ['Training', 'Training', 'Training', 'Rest', 'Training', 'Training', 'Training'],
  }
  return patterns[daysPerWeek] || ['Training', 'Rest', 'Training', 'Rest', 'Training', 'Rest', 'Rest']
}

function ConditioningCard({ method, compact }) {
  const [open, setOpen] = useState(false);
  const color = CATEGORY_COLORS[method.category] || { bg: 'rgba(100,100,100,0.15)', text: '#aaa' };

  return (
    <div
      style={{
        background: 'var(--s3)',
        border: `1px solid var(--border)`,
        borderRadius: 10,
        padding: compact ? '14px 16px' : '18px 20px',
        cursor: 'pointer',
      }}
      onClick={() => setOpen((o) => !o)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
            <CategoryBadge category={method.category} />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: compact ? 15 : 18,
              color: 'var(--white)',
              letterSpacing: '0.02em',
              marginBottom: 6,
            }}
          >
            {method.name}
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: compact ? 0 : 8 }}>
            <InfoPill label="System" value={method.energySystem} />
            <InfoPill label="Duration" value={method.duration} />
            <InfoPill label="Frequency" value={method.frequency} />
          </div>
          {!compact && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)', margin: '8px 0 0', lineHeight: 1.6 }}>
              {method.description}
            </p>
          )}
        </div>
        <div style={{ color: 'var(--muted)', fontSize: 18, flexShrink: 0, paddingTop: 2 }}>
          {open ? '▲' : '▼'}
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 16 }}>
          {compact && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)', margin: '0 0 14px', lineHeight: 1.6 }}>
              {method.description}
            </p>
          )}
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em' }}>
              WHEN TO USE
            </span>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--sub)', margin: '4px 0 0' }}>
              {method.whenToUse}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
            {method.protocols.map((p, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '12px 14px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 13,
                    color: color.text,
                    letterSpacing: '0.04em',
                    marginBottom: 8,
                  }}
                >
                  {p.name}
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
                  <InfoPill label="Work" value={p.work} />
                  <InfoPill label="Rest" value={p.rest} />
                  <InfoPill label="Sets" value={p.sets} />
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)', margin: '0 0 8px', lineHeight: 1.5 }}>
                  {p.notes}
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {p.exercises.map((e, j) => (
                    <span
                      key={j}
                      style={{
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontFamily: 'var(--font-body)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--sub)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.07em' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--sub)' }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Template Card (Gallery)
// ─────────────────────────────────────────────────────────

function TemplateCard({ template, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--s3)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '18px 20px',
        cursor: 'pointer',
        transition: 'border-color 0.15s, transform 0.1s',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Top badges */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <MethodBadge method={template.method} />
        <GoalBadge goal={template.goal} />
        <DifficultyBadge difficulty={template.difficulty} />
      </div>

      {/* Name */}
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 16,
          color: 'var(--white)',
          letterSpacing: '0.02em',
          lineHeight: 1.3,
        }}
      >
        {template.name}
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.07em' }}>DAYS</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--accent)', lineHeight: 1 }}>{template.days}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.07em' }}>WEEKS</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--white)', lineHeight: 1 }}>{template.weeks}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.07em' }}>METHOD</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--sub)', lineHeight: 1 }}>{template.method}</span>
        </div>
      </div>

      {/* Key principles preview */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 9,
            color: 'var(--muted)',
            letterSpacing: '0.07em',
          }}
        >
          KEY PRINCIPLES
        </span>
        {template.keyPrinciples.slice(0, 3).map((p, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
            }}
          >
            <span style={{ color: 'var(--accent)', fontSize: 9, marginTop: 4, flexShrink: 0 }}>●</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{p}</span>
          </div>
        ))}
        {template.keyPrinciples.length > 3 && (
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' }}>
            +{template.keyPrinciples.length - 3} more
          </span>
        )}
      </div>

      {/* CTA hint */}
      <div
        style={{
          marginTop: 'auto',
          color: 'var(--accent)',
          fontFamily: 'var(--font-display)',
          fontSize: 11,
          letterSpacing: '0.06em',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        VIEW FULL PROGRAM →
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Template Detail View
// ─────────────────────────────────────────────────────────

function TemplateDetail({ template, onBack, onAssign }) {
  const conditioningMethod = CONDITIONING_METHODS.find(
    (m) => m.id === template.conditioning?.recommended
  )
  const week1Sessions = template.generateSessions(1)
  const schedule = computeSchedule(template.days_per_week)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: '1px solid var(--border)',
          color: 'var(--sub)',
          cursor: 'pointer',
          padding: '8px 16px',
          borderRadius: 8,
          fontFamily: 'var(--font-display)',
          fontSize: 12,
          letterSpacing: '0.06em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          alignSelf: 'flex-start',
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)'
          e.currentTarget.style.color = 'var(--accent)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.color = 'var(--sub)'
        }}
      >
        ← BACK TO TEMPLATES
      </button>

      {/* Header card */}
      <div
        style={{
          background: 'var(--s3)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <MethodBadge method={template.method} />
            <GoalBadge goal={template.goal} />
            <DifficultyBadge difficulty={template.difficulty} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--white)', letterSpacing: '0.02em', lineHeight: 1.2, marginBottom: 8 }}>
            {template.name}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 600 }}>
            {template.description}
          </div>
          {/* Phase tag */}
          {template.phase && (
            <div style={{ marginTop: 10 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--accent)', background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', borderRadius: 4, padding: '3px 10px' }}>
                {template.phase}
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { label: 'DAYS / WEEK', value: template.days_per_week },
              { label: 'DURATION', value: `${template.default_weeks}w` },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.07em' }}>{item.label}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--accent)', lineHeight: 1 }}>{item.value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={onAssign}
            style={{ background: 'var(--accent)', color: 'var(--ink)', border: 'none', cursor: 'pointer', padding: '12px 28px', borderRadius: 8, fontFamily: 'var(--font-display)', fontSize: 13, letterSpacing: '0.06em', fontWeight: 700, transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hi)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
          >
            ASSIGN TO CLIENT
          </button>
        </div>
      </div>

      {/* Two-col: key principles + overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Key principles */}
        <div style={{ background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px 22px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.07em', marginBottom: 14 }}>
            KEY PRINCIPLES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(template.keyPrinciples || []).map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--accent)', fontSize: 10, marginTop: 3, flexShrink: 0 }}>●</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--sub)', lineHeight: 1.6 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Programme overview */}
        <div style={{ background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.07em', marginBottom: 10 }}>
              PROGRAMME OVERVIEW
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.06em' }}>SESSIONS</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--accent-hi)', marginTop: 2 }}>{week1Sessions.length}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>PER WEEK</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.06em' }}>DURATION</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--white)', marginTop: 2 }}>{template.default_weeks}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>WEEKS</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', letterSpacing: '0.06em' }}>TOTAL</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--white)', marginTop: 2 }}>{week1Sessions.length * template.default_weeks}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>SESSIONS</div>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.07em', marginBottom: 8 }}>
              POLIQUIN PRINCIPLES
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--sub)', margin: 0, lineHeight: 1.65 }}>
              Built on Poliquin training methodology — precise tempo control, antagonist superset pairing, and phase-appropriate volume and intensity to drive consistent adaptation.
            </p>
          </div>
          {/* Tags */}
          {template.tags && template.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {template.tags.map((tag) => (
                <span key={tag} style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 8px' }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weekly schedule */}
      <div style={{ background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px 22px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.07em', marginBottom: 14 }}>
          WEEKLY SCHEDULE
        </div>
        <WeeklyScheduleStrip schedule={schedule} />
      </div>

      {/* Week 1 session preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.07em' }}>
          WEEK 1 — SESSION PREVIEW
        </div>
        {week1Sessions.map((session, idx) => (
          <div
            key={idx}
            style={{ background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}
          >
            {/* Session header */}
            <div
              style={{
                padding: '14px 20px',
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span
                style={{
                  background: 'var(--accent)',
                  color: 'var(--ink)',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--white)', letterSpacing: '0.03em' }}>
                  {session.day_label}
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>
                  {session.exercises.length} exercises
                </div>
              </div>
            </div>
            {/* Exercise table */}
            <div style={{ padding: '0 0 8px' }}>
              <ExerciseTable exercises={session.exercises} />
            </div>
          </div>
        ))}
      </div>

      {/* Conditioning recommendation */}
      {conditioningMethod && (
        <div style={{ background: 'var(--s3)', border: '1px solid var(--border)', borderRadius: 10, padding: '20px 22px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.07em', marginBottom: 6 }}>
            RECOMMENDED CONDITIONING
          </div>
          {template.conditioning.notes && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)', margin: '0 0 16px', lineHeight: 1.6 }}>
              {template.conditioning.notes}
            </p>
          )}
          <ConditioningCard method={conditioningMethod} compact />
        </div>
      )}

      {/* Bottom assign button */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 16 }}>
        <button
          onClick={onAssign}
          style={{ background: 'var(--accent)', color: 'var(--ink)', border: 'none', cursor: 'pointer', padding: '14px 48px', borderRadius: 8, fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: '0.08em', fontWeight: 700, transition: 'background 0.15s' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-hi)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--accent)')}
        >
          ASSIGN TO CLIENT
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Filter Bar
// ─────────────────────────────────────────────────────────

function FilterBar({ filters, onChange }) {
  const methods = ['All', ...new Set(PROGRAM_TEMPLATES.map((t) => t.method))];
  const goals = ['All', ...new Set(PROGRAM_TEMPLATES.map((t) => t.goal))];
  const dayOptions = ['All', '3', '4', '5'];

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        padding: '14px 20px',
        background: 'var(--s3)',
        border: '1px solid var(--border)',
        borderRadius: 10,
      }}
    >
      <FilterGroup
        label="DAYS"
        options={dayOptions}
        value={filters.days}
        onChange={(v) => onChange({ ...filters, days: v })}
      />
      <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
      <FilterGroup
        label="METHOD"
        options={methods}
        value={filters.method}
        onChange={(v) => onChange({ ...filters, method: v })}
      />
      <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
      <FilterGroup
        label="GOAL"
        options={goals}
        value={filters.goal}
        onChange={(v) => onChange({ ...filters, goal: v })}
      />
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 9,
          color: 'var(--muted)',
          letterSpacing: '0.07em',
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              border: `1px solid ${value === opt ? 'var(--accent)' : 'var(--border)'}`,
              background: value === opt ? 'rgba(0,200,150,0.15)' : 'transparent',
              color: value === opt ? 'var(--accent)' : 'var(--muted)',
              fontFamily: 'var(--font-display)',
              fontSize: 11,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'all 0.12s',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────

export default function ProgramTemplates() {
  const [activeTab, setActiveTab] = useState('templates'); // 'templates' | 'conditioning'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filters, setFilters] = useState({ days: 'All', method: 'All', goal: 'All' });
  const [toast, setToast] = useState({ visible: false, message: '' });

  const [showCustomiser, setShowCustomiser] = useState(false);

  const { clients } = useCoach();

  const filteredTemplates = useMemo(() => {
    return PROGRAM_TEMPLATES.filter((t) => {
      if (filters.days !== 'All' && String(t.days) !== filters.days) return false;
      if (filters.method !== 'All' && t.method !== filters.method) return false;
      if (filters.goal !== 'All' && t.goal !== filters.goal) return false;
      return true;
    });
  }, [filters]);

  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 2800);
  };

  const handleAssign = () => setShowCustomiser(true);

  return (
    <div
      style={{
        background: 'var(--s4)',
        minHeight: '100vh',
        padding: '28px 32px',
        boxSizing: 'border-box',
      }}
    >
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 30,
            color: 'var(--white)',
            letterSpacing: '0.03em',
            marginBottom: 6,
          }}
        >
          PROGRAM TEMPLATES
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--muted)' }}>
          Evidence-based training programs from Poliquin, Mentzer, Gironda and classic methodology.
        </div>
      </div>

      {/* Tab bar */}
      {!selectedTemplate && (
        <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
          {[
            { id: 'templates', label: 'PROGRAM LIBRARY' },
            { id: 'conditioning', label: 'CONDITIONING LIBRARY' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? 'var(--accent)' : 'transparent'}`,
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)',
                fontFamily: 'var(--font-display)',
                fontSize: 12,
                letterSpacing: '0.07em',
                padding: '10px 20px 12px',
                cursor: 'pointer',
                transition: 'color 0.15s, border-color 0.15s',
                marginBottom: -1,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Template gallery */}
      {activeTab === 'templates' && !selectedTemplate && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <FilterBar filters={filters} onChange={setFilters} />

          {filteredTemplates.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'var(--muted)',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
              }}
            >
              No templates match the selected filters.
            </div>
          ) : (
            <>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 11,
                  color: 'var(--muted)',
                  letterSpacing: '0.06em',
                }}
              >
                {filteredTemplates.length} PROGRAM{filteredTemplates.length !== 1 ? 'S' : ''}
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: 16,
                }}
              >
                {filteredTemplates.map((t) => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                    onClick={() => {
                      setSelectedTemplate(t)
                      // Scroll page content back to top so detail starts at top
                      document.querySelector('.page-content')?.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Template detail */}
      {activeTab === 'templates' && selectedTemplate && (
        <TemplateDetail
          template={selectedTemplate}
          onBack={() => {
            setSelectedTemplate(null)
            document.querySelector('.page-content')?.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onAssign={handleAssign}
        />
      )}

      {/* Conditioning library */}
      {activeTab === 'conditioning' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 11,
                color: 'var(--muted)',
                letterSpacing: '0.07em',
                marginBottom: 6,
              }}
            >
              ENERGY SYSTEM OVERVIEW
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.7 }}>
              All conditioning methods are classified by energy system and training goal. Poliquin's
              ESD protocol periodizes all three systems across a training block. Click any card to
              expand protocols and exercise selections.
            </p>
          </div>

          {/* Energy system legend */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              padding: '12px 16px',
              background: 'var(--s3)',
              border: '1px solid var(--border)',
              borderRadius: 10,
            }}
          >
            {[
              { label: 'ATP-PCr (<10s efforts)', color: '#f87171' },
              { label: 'Glycolytic (10s–2min)', color: '#00FFB8' },
              { label: 'Oxidative (>2min)', color: '#93c5fd' },
              { label: 'Multi-System (ESD)', color: '#fcd34d' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: item.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Method cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CONDITIONING_METHODS.map((m) => (
              <ConditioningCard key={m.id} method={m} compact={false} />
            ))}
          </div>
        </div>
      )}

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} />

      {/* Template Customiser */}
      {showCustomiser && selectedTemplate && (
        <TemplateCustomiser
          template={selectedTemplate}
          clients={clients}
          onClose={() => setShowCustomiser(false)}
          onCreated={(name) => {
            setShowCustomiser(false);
            showToast(`✓ ${name} assigned!`);
          }}
        />
      )}
    </div>
  );
}
