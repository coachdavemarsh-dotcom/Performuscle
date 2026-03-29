import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { COURSES } from '../../data/educationContent.js'
import { getEducationProgress, upsertEducationProgress } from '../../lib/supabase.js'

// ─── helpers ─────────────────────────────────────────────────────────────────

function getModuleProgress(progress, courseId, moduleId) {
  return progress.find(p => p.course_id === courseId && p.module_id === moduleId) || null
}

function getCourseCompletedCount(progress, courseId) {
  return progress.filter(p => p.course_id === courseId && p.completed).length
}

// ─── progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ value, max, color = 'var(--accent)', height = 6 }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div style={{
      background: 'var(--s4)',
      borderRadius: 99,
      height,
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${pct}%`,
        height: '100%',
        background: color,
        borderRadius: 99,
        transition: 'width 0.4s ease',
      }} />
    </div>
  )
}

// ─── view 1: course library ───────────────────────────────────────────────────

function CourseLibrary({ progress, onSelectCourse }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Learning Hub</h1>
          <p className="page-subtitle">Build your knowledge, understand your programme</p>
        </div>
      </div>

      <div className="grid-2">
        {COURSES.map(course => {
          const completed = getCourseCompletedCount(progress, course.id)
          const total = course.modules.length
          const allDone = completed === total && total > 0

          return (
            <div
              key={course.id}
              className="card"
              onClick={() => onSelectCourse(course)}
              style={{
                cursor: 'pointer',
                borderLeft: `3px solid ${course.color}`,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = course.color}
            >
              {/* Icon + title row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                <div style={{
                  fontSize: 40,
                  lineHeight: 1,
                  flexShrink: 0,
                }}>
                  {course.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 18,
                    letterSpacing: 1,
                    color: 'var(--white)',
                    marginBottom: 4,
                    lineHeight: 1.2,
                  }}>
                    {course.title}
                  </div>
                  <div style={{
                    fontSize: 13,
                    color: 'var(--muted)',
                    lineHeight: 1.5,
                  }}>
                    {course.description}
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div style={{ marginBottom: 8 }}>
                <ProgressBar value={completed} max={total} color={course.color} />
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {completed} of {total} module{total !== 1 ? 's' : ''} complete
                </span>
                {allDone && (
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 10,
                    letterSpacing: 1.5,
                    color: course.color,
                  }}>
                    COMPLETE ✓
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── view 2: course detail ────────────────────────────────────────────────────

function CourseDetail({ course, progress, onBack, onSelectModule }) {
  const completed = getCourseCompletedCount(progress, course.id)
  const total = course.modules.length

  return (
    <div>
      {/* Back */}
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 20 }}>
        ← Back to Courses
      </button>

      {/* Course header */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <span style={{ fontSize: 48, lineHeight: 1 }}>{course.icon}</span>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 24,
              letterSpacing: 1,
              color: 'var(--white)',
              margin: 0,
              lineHeight: 1.2,
            }}>
              {course.title}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', margin: '4px 0 0' }}>
              {course.description}
            </p>
          </div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <ProgressBar value={completed} max={total} color={course.color} height={8} />
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>
          {completed} of {total} complete
        </div>
      </div>

      {/* Modules */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {course.modules.map((mod, idx) => {
          const mp = getModuleProgress(progress, course.id, mod.id)
          const isDone = mp?.completed === true
          const score = mp?.quiz_score

          return (
            <div
              key={mod.id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'pointer',
                transition: 'all 0.15s',
                padding: '16px 20px',
              }}
              onClick={() => onSelectModule(mod)}
            >
              {/* Number or tick */}
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: isDone ? 'var(--accent)' : 'var(--s4)',
                border: isDone ? 'none' : '1.5px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontFamily: 'var(--font-display)',
                fontSize: isDone ? 16 : 14,
                color: isDone ? 'var(--ink)' : 'var(--sub)',
                letterSpacing: 0,
              }}>
                {isDone ? '✓' : idx + 1}
              </div>

              {/* Title + duration */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 15,
                  letterSpacing: 0.5,
                  color: 'var(--white)',
                  marginBottom: 2,
                }}>
                  {mod.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {mod.duration}
                </div>
              </div>

              {/* Score badge */}
              {isDone && score !== null && score !== undefined && (
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 10,
                  letterSpacing: 1,
                  color: score >= 70 ? 'var(--accent)' : 'var(--warn)',
                  background: score >= 70 ? 'rgba(0,200,150,0.1)' : 'rgba(217,119,6,0.1)',
                  border: `1px solid ${score >= 70 ? 'rgba(0,200,150,0.3)' : 'rgba(217,119,6,0.3)'}`,
                  borderRadius: 6,
                  padding: '3px 8px',
                  flexShrink: 0,
                }}>
                  QUIZ {score}%
                </div>
              )}

              {/* Status tag */}
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 10,
                letterSpacing: 1,
                color: isDone ? 'var(--muted)' : course.color,
                flexShrink: 0,
              }}>
                {isDone ? 'RETAKE' : 'START →'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── view 3: lesson ───────────────────────────────────────────────────────────

function Lesson({ course, module: mod, onBack, onStartQuiz }) {
  return (
    <div>
      {/* Back */}
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 20 }}>
        ← Back to {course.title}
      </button>

      {/* Title */}
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 28,
        letterSpacing: 1,
        color: 'var(--white)',
        marginBottom: 6,
        lineHeight: 1.2,
      }}>
        {mod.title}
      </h2>

      {/* Intro */}
      <p style={{
        fontStyle: 'italic',
        color: 'var(--muted)',
        fontSize: 15,
        lineHeight: 1.7,
        marginBottom: 28,
        maxWidth: 680,
      }}>
        {mod.intro}
      </p>

      {/* Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
        {mod.sections.map((section, i) => (
          <div key={i} className="card">
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 16,
              letterSpacing: 0.5,
              color: 'var(--white)',
              marginBottom: 12,
              marginTop: 0,
            }}>
              {section.heading}
            </h3>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--sub)' }}>
              {section.body.split('\n\n').map((para, pi) => (
                <p key={pi} style={{ margin: pi === 0 ? 0 : '12px 0 0' }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Key Takeaway */}
      <div style={{
        borderLeft: `4px solid ${course.color}`,
        background: 'var(--s2)',
        borderRadius: '0 10px 10px 0',
        padding: '16px 20px',
        marginBottom: 28,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          letterSpacing: 2,
          color: course.color,
          marginBottom: 6,
        }}>
          KEY TAKEAWAY
        </div>
        <p style={{
          fontSize: 15,
          color: 'var(--white)',
          lineHeight: 1.6,
          margin: 0,
          fontWeight: 500,
        }}>
          {mod.keyTakeaway}
        </p>
      </div>

      {/* CTA */}
      <button
        className="btn btn-primary"
        style={{ width: '100%', padding: '16px', fontSize: 15 }}
        onClick={onStartQuiz}
      >
        Take the Quiz →
      </button>
    </div>
  )
}

// ─── view 4: quiz ─────────────────────────────────────────────────────────────

const INITIAL_QUIZ = { currentQ: 0, answers: [], submitted: [], complete: false }

function Quiz({ course, module: mod, progress, onBack, onComplete }) {
  const [quizState, setQuizState] = useState(INITIAL_QUIZ)
  const [selected, setSelected] = useState(null)

  const { currentQ, answers, submitted, complete } = quizState
  const questions = mod.quiz
  const question = questions[currentQ]

  const mp = getModuleProgress(progress, course.id, mod.id)
  const prevAttempts = mp?.quiz_attempts || 0

  function handleSubmit() {
    if (selected === null) return
    const isCorrect = selected === question.correct
    const newAnswers = [...answers, selected]
    const newSubmitted = [...submitted, isCorrect]
    setQuizState(s => ({
      ...s,
      answers: newAnswers,
      submitted: newSubmitted,
    }))
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setQuizState(s => ({ ...s, currentQ: s.currentQ + 1 }))
      setSelected(null)
    } else {
      setQuizState(s => ({ ...s, complete: true }))
    }
  }

  function handleRetry() {
    setQuizState(INITIAL_QUIZ)
    setSelected(null)
  }

  // Results screen
  if (complete) {
    const correct = quizState.submitted.filter(Boolean).length
    const scorePercent = Math.round((correct / questions.length) * 100)
    const passed = scorePercent >= 70

    return (
      <div>
        <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 20 }}>
          ← Back to Lesson
        </button>

        <div className="card" style={{ textAlign: 'center', marginBottom: 20, padding: '32px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>
            {passed ? '🎉' : '💪'}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 48,
            color: 'var(--white)',
            lineHeight: 1,
            marginBottom: 4,
          }}>
            {scorePercent}%
          </div>
          <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
            {correct} of {questions.length} correct
          </div>

          {/* Pass / fail badge */}
          <div style={{
            display: 'inline-block',
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            letterSpacing: 2,
            color: passed ? 'var(--accent)' : 'var(--warn)',
            background: passed ? 'rgba(0,200,150,0.1)' : 'rgba(217,119,6,0.1)',
            border: `1.5px solid ${passed ? 'rgba(0,200,150,0.4)' : 'rgba(217,119,6,0.4)'}`,
            borderRadius: 8,
            padding: '8px 20px',
            marginBottom: 16,
          }}>
            {passed ? 'PASSED ✓' : 'TRY AGAIN'}
          </div>

          <p style={{ fontSize: 14, color: 'var(--sub)', margin: '0 0 24px' }}>
            {passed
              ? 'Module complete! You\'ve locked in this knowledge.'
              : 'Review the lesson and try again — you\'ll get it.'}
          </p>

          {/* CTA buttons */}
          {passed ? (
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: 15 }}
              onClick={() => onComplete(scorePercent, prevAttempts + 1)}
            >
              Continue →
            </button>
          ) : (
            <button
              className="btn"
              style={{
                width: '100%', padding: '14px', fontSize: 15,
                background: 'var(--s3)', border: '1.5px solid var(--border)',
                color: 'var(--sub)',
              }}
              onClick={handleRetry}
            >
              Retry Quiz
            </button>
          )}
        </div>

        {/* Answer breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 10,
            letterSpacing: 2,
            color: 'var(--muted)',
            marginBottom: 4,
          }}>
            ANSWER BREAKDOWN
          </div>
          {questions.map((q, i) => {
            const wasCorrect = quizState.submitted[i]
            const chosen = quizState.answers[i]
            return (
              <div key={i} className="card" style={{
                borderLeft: `3px solid ${wasCorrect ? 'var(--accent)' : 'var(--danger)'}`,
                padding: '12px 16px',
              }}>
                <div style={{ fontSize: 13, color: 'var(--sub)', marginBottom: 6, lineHeight: 1.5 }}>
                  {i + 1}. {q.question}
                </div>
                <div style={{
                  fontSize: 12,
                  color: wasCorrect ? 'var(--accent)' : 'var(--danger)',
                  marginBottom: wasCorrect ? 0 : 4,
                }}>
                  {wasCorrect ? '✓ Correct' : `✗ You chose: ${q.options[chosen]}`}
                </div>
                {!wasCorrect && (
                  <div style={{ fontSize: 12, color: 'var(--accent)' }}>
                    ✓ Correct: {q.options[q.correct]}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Active question
  const isSubmitted = submitted.length > currentQ
  const currentAnswer = answers[currentQ]

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 20 }}>
        ← Back to Lesson
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 20,
          letterSpacing: 1,
          color: 'var(--white)',
          margin: 0,
        }}>
          Quiz — {mod.title}
        </h2>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>
          Question {currentQ + 1} of {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <ProgressBar value={currentQ + (isSubmitted ? 1 : 0)} max={questions.length} color={course.color} height={5} />
      </div>

      {/* Question */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 20,
        letterSpacing: 0.5,
        color: 'var(--white)',
        lineHeight: 1.4,
        marginBottom: 20,
      }}>
        {question.question}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {question.options.map((opt, i) => {
          const isSelected = selected === i
          const isCorrectOption = i === question.correct
          const isChosenWrong = isSubmitted && currentAnswer === i && !isCorrectOption

          let borderColor = 'var(--border)'
          let bgColor = 'var(--s2)'
          let textColor = 'var(--sub)'

          if (!isSubmitted && isSelected) {
            borderColor = course.color
            bgColor = 'var(--s3)'
            textColor = 'var(--white)'
          } else if (isSubmitted && isCorrectOption) {
            borderColor = 'var(--accent)'
            bgColor = 'rgba(0,200,150,0.08)'
            textColor = 'var(--white)'
          } else if (isSubmitted && isChosenWrong) {
            borderColor = 'var(--danger)'
            bgColor = 'rgba(229,53,53,0.08)'
            textColor = 'var(--white)'
          }

          return (
            <button
              key={i}
              onClick={() => !isSubmitted && setSelected(i)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 10,
                border: `1.5px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
                textAlign: 'left',
                cursor: isSubmitted ? 'default' : 'pointer',
                transition: 'all 0.15s',
                width: '100%',
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              <span style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                border: `1.5px solid ${borderColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 12,
                fontFamily: 'var(--font-display)',
                marginTop: 1,
              }}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          )
        })}
      </div>

      {/* Explanation after submit */}
      {isSubmitted && (
        <div style={{
          background: 'var(--s2)',
          border: `1px solid ${submitted[currentQ] ? 'rgba(0,200,150,0.3)' : 'rgba(229,53,53,0.3)'}`,
          borderRadius: 10,
          padding: '14px 16px',
          marginBottom: 20,
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 10,
            letterSpacing: 2,
            color: submitted[currentQ] ? 'var(--accent)' : 'var(--danger)',
            marginBottom: 6,
          }}>
            {submitted[currentQ] ? 'CORRECT' : 'INCORRECT'}
          </div>
          <p style={{ fontSize: 13, color: 'var(--sub)', margin: 0, lineHeight: 1.6 }}>
            {question.explanation}
          </p>
        </div>
      )}

      {/* Buttons */}
      {!isSubmitted ? (
        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: 15, opacity: selected === null ? 0.4 : 1 }}
          disabled={selected === null}
          onClick={handleSubmit}
        >
          Submit Answer
        </button>
      ) : (
        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: 15 }}
          onClick={handleNext}
        >
          {currentQ < questions.length - 1 ? 'Next Question →' : 'See Results →'}
        </button>
      )}
    </div>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function Learn() {
  const { user } = useAuth()

  const [view, setView] = useState('library') // 'library' | 'course' | 'lesson' | 'quiz'
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)

  // Load progress on mount
  useEffect(() => {
    async function load() {
      if (!user) return
      setLoading(true)
      const { data } = await getEducationProgress(user.id)
      if (data) setProgress(data)
      setLoading(false)
    }
    load()
  }, [user])

  // Navigation helpers
  function goToLibrary() {
    setView('library')
    setSelectedCourse(null)
    setSelectedModule(null)
  }

  function goToCourse(course) {
    setSelectedCourse(course)
    setSelectedModule(null)
    setView('course')
  }

  function goToLesson(mod) {
    setSelectedModule(mod)
    setView('lesson')
  }

  function goToQuiz() {
    setView('quiz')
  }

  function goBackToLesson() {
    setView('lesson')
  }

  // After passing the quiz — save to Supabase, then go to next module or back to course
  async function handleQuizComplete(scorePercent, attempts) {
    if (!user || !selectedCourse || !selectedModule) return

    // Save progress
    const { data: saved } = await upsertEducationProgress({
      client_id: user.id,
      course_id: selectedCourse.id,
      module_id: selectedModule.id,
      completed: true,
      quiz_score: scorePercent,
      quiz_attempts: attempts,
      completed_at: new Date().toISOString(),
    })

    // Update local state
    setProgress(prev => {
      const filtered = prev.filter(
        p => !(p.course_id === selectedCourse.id && p.module_id === selectedModule.id)
      )
      const newEntry = saved || {
        client_id: user.id,
        course_id: selectedCourse.id,
        module_id: selectedModule.id,
        completed: true,
        quiz_score: scorePercent,
        quiz_attempts: attempts,
        completed_at: new Date().toISOString(),
      }
      return [...filtered, newEntry]
    })

    // Go to next module or back to course
    const currentIdx = selectedCourse.modules.findIndex(m => m.id === selectedModule.id)
    const nextModule = selectedCourse.modules[currentIdx + 1]

    if (nextModule) {
      setSelectedModule(nextModule)
      setView('lesson')
    } else {
      setView('course')
      setSelectedModule(null)
    }
  }

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: 300 }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {view === 'library' && (
        <CourseLibrary
          progress={progress}
          onSelectCourse={goToCourse}
        />
      )}

      {view === 'course' && selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          progress={progress}
          onBack={goToLibrary}
          onSelectModule={goToLesson}
        />
      )}

      {view === 'lesson' && selectedCourse && selectedModule && (
        <Lesson
          course={selectedCourse}
          module={selectedModule}
          onBack={() => setView('course')}
          onStartQuiz={goToQuiz}
        />
      )}

      {view === 'quiz' && selectedCourse && selectedModule && (
        <Quiz
          course={selectedCourse}
          module={selectedModule}
          progress={progress}
          onBack={goBackToLesson}
          onComplete={handleQuizComplete}
        />
      )}
    </div>
  )
}
