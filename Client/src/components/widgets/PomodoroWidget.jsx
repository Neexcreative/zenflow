import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react'
import useZenflowStore from '../../store/useZenflowStore'
import WidgetCard from '../WidgetCard'

const MODES = [
  { key: 'focus', label: 'Focus', accentClass: 'is-focus' },
  { key: 'shortBreak', label: 'Short Break', accentClass: 'is-break' },
  { key: 'longBreak', label: 'Long Break', accentClass: 'is-break' },
]

export default function PomodoroWidget() {
  const {
    pomodoroMode,
    pomodoroTime,
    pomodoroRunning,
    pomodoroSessions,
    pomodoroDurations,
    pomodoroRounds,
    setPomodoroMode,
    setPomodoroRunning,
    tickPomodoro,
    resetPomodoro,
  } = useZenflowStore()

  const intervalRef = useRef(null)

  useEffect(() => {
    if (pomodoroRunning) {
      intervalRef.current = setInterval(() => {
        const done = tickPomodoro()
        if (done) clearInterval(intervalRef.current)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [pomodoroRunning, tickPomodoro])

  const totalSeconds = pomodoroDurations[pomodoroMode] * 60
  const progress = totalSeconds > 0 ? pomodoroTime / totalSeconds : 0
  const minutes = Math.floor(pomodoroTime / 60)
  const seconds = pomodoroTime % 60
  const circumference = 2 * Math.PI * 52
  const completedRounds = pomodoroSessions % pomodoroRounds
  const currentMode = MODES.find((mode) => mode.key === pomodoroMode)

  const skip = () => {
    const currentIndex = MODES.findIndex((mode) => mode.key === pomodoroMode)
    setPomodoroMode(MODES[(currentIndex + 1) % MODES.length].key)
  }

  return (
    <WidgetCard
      title="Pomodoro"
      className="pomodoro-card"
      accent
      headerRight={
        <div className="pomodoro-header-meta">
          <div className="pomodoro-session-group">
            {Array.from({ length: pomodoroRounds }).map((_, index) => (
              <span
                key={index}
                className={`pomodoro-session-dot ${index < completedRounds ? 'is-complete' : ''}`}
              />
            ))}
          </div>
          <span className="tiny-status-pill">{pomodoroRunning ? 'In session' : 'Ready'}</span>
        </div>
      }
    >
      <motion.div
        className="pomodoro-shell"
        animate={pomodoroRunning ? { opacity: [1, 0.9, 1] } : { opacity: 1 }}
        transition={{ duration: 3, repeat: pomodoroRunning ? Infinity : 0, ease: 'easeInOut' }}
      >
        <div className="pomodoro-hero-copy">
          <div>
            <h3>{pomodoroMode === 'focus' ? 'Protected focus time' : 'Intentional recovery'}</h3>
            <p>
              {pomodoroMode === 'focus'
                ? 'Keep the room quiet and move one meaningful task forward.'
                : pomodoroMode === 'shortBreak'
                  ? 'Step back for a quick reset before the next round.'
                  : 'Take a longer pause and recharge your attention.'}
            </p>
          </div>
          <div className="pomodoro-summary">
            <span>Session {completedRounds + 1}</span>
            <strong>{pomodoroDurations[pomodoroMode]} min</strong>
          </div>
        </div>

        <div className="pomodoro-pills">
          {MODES.map((mode) => {
            const active = pomodoroMode === mode.key
            return (
              <button
                key={mode.key}
                onClick={() => setPomodoroMode(mode.key)}
                className={`pomodoro-pill ${mode.accentClass} ${active ? 'is-active' : ''}`}
              >
                {mode.label}
              </button>
            )
          })}
        </div>

        <div className="pomodoro-dial">
          <svg viewBox="0 0 120 120" className="pomodoro-svg" aria-hidden="true">
            <defs>
              <linearGradient id="pomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6C63FF" />
                <stop offset="100%" stopColor="#00D4AA" />
              </linearGradient>
              <filter id="pomGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="url(#pomGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress * circumference}
              filter="url(#pomGlow)"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>

          <div className="pomodoro-dial-center">
            <span className={`pomodoro-mode-badge ${currentMode?.accentClass || ''}`}>{currentMode?.label}</span>
            <div className="pomodoro-time">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="pomodoro-subtitle">
              {pomodoroMode === 'focus'
                ? 'Deep focus session'
                : pomodoroMode === 'shortBreak'
                  ? 'Short recovery'
                  : 'Long recovery'}
            </div>
          </div>
        </div>

        <div className="pomodoro-controls">
          <button onClick={resetPomodoro} className="icon-button" title="Reset timer">
            <RotateCcw size={16} />
          </button>

          <button
            onClick={() => setPomodoroRunning(!pomodoroRunning)}
            className="pomodoro-play-button"
            title={pomodoroRunning ? 'Pause timer' : 'Start timer'}
          >
            {pomodoroRunning ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
            <span>{pomodoroRunning ? 'Pause' : 'Start'}</span>
          </button>

          <button onClick={skip} className="icon-button" title="Skip mode">
            <SkipForward size={16} />
          </button>
        </div>
      </motion.div>
    </WidgetCard>
  )
}
