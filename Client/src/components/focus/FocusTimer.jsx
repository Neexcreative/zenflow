import { Pause, Play, RotateCcw, SkipForward, SlidersHorizontal } from 'lucide-react'
import useZenflowStore, { POMODORO_MODES, getNextMode } from '../../store/useZenflowStore'
import { formatTime, getModeLabel } from '../../hooks/useFocusTimer'

// Each glyph gets a fixed cell so the readout never shifts as digits change,
// whatever the font's numeral widths.
function TimeReadout({ value }) {
  return (
    <span className="timer-readout__glyphs" aria-hidden="true">
      {value.split('').map((char, index) => (
        <span key={index} className={char === ':' ? 'timer-colon' : 'timer-digit'}>
          {char}
        </span>
      ))}
    </span>
  )
}

function getStatus({ mode, running, complete, pristine, round, rounds }) {
  if (complete) return mode === 'focus' ? 'Session complete' : 'Break complete'
  if (mode !== 'focus') return running ? 'Step away for a moment' : pristine ? 'Ready for a break' : 'Paused'
  if (!running && !pristine) return 'Paused'
  return `Round ${round} of ${rounds}`
}

export default function FocusTimer() {
  const {
    pomodoroMode,
    pomodoroTime,
    pomodoroRunning,
    pomodoroSessions,
    pomodoroDurations,
    pomodoroRounds,
    setPomodoroMode,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    advancePomodoro,
    openTool,
  } = useZenflowStore()

  const total = pomodoroDurations[pomodoroMode] * 60
  const elapsed = total > 0 ? Math.min(1, Math.max(0, 1 - pomodoroTime / total)) : 0
  const complete = pomodoroTime === 0
  const pristine = !pomodoroRunning && pomodoroTime === total
  const nextMode = getNextMode(pomodoroMode, pomodoroSessions, pomodoroRounds)
  const nextLabel = getModeLabel(nextMode).toLowerCase()
  const minutes = Math.floor(pomodoroTime / 60)
  const seconds = pomodoroTime % 60

  let primaryLabel = pristine ? 'Start' : 'Resume'
  let PrimaryIcon = Play
  let onPrimary = startPomodoro
  if (pomodoroRunning) {
    primaryLabel = 'Pause'
    PrimaryIcon = Pause
    onPrimary = pausePomodoro
  } else if (complete) {
    primaryLabel = `Start ${nextLabel}`
    onPrimary = () => advancePomodoro({ autoStart: true })
  }

  const status = getStatus({
    mode: pomodoroMode,
    running: pomodoroRunning,
    complete,
    pristine,
    round: (pomodoroSessions % pomodoroRounds) + 1,
    rounds: pomodoroRounds,
  })

  return (
    <section className="focus-timer" aria-label="Focus timer">
      <div className="mode-switch chrome" role="group" aria-label="Timer mode">
        {POMODORO_MODES.map((mode) => (
          <button
            key={mode.key}
            type="button"
            className="mode-switch__option"
            aria-pressed={pomodoroMode === mode.key}
            onClick={() => setPomodoroMode(mode.key)}
          >
            {mode.label}
          </button>
        ))}
        <button
          type="button"
          className="mode-switch__adjust"
          onClick={() => openTool('settings')}
          aria-label="Adjust timer durations"
          title="Adjust timer"
        >
          <SlidersHorizontal size={14} aria-hidden="true" />
        </button>
      </div>

      <div
        className="timer-readout"
        role="timer"
        aria-label={`${getModeLabel(pomodoroMode)}: ${minutes} minutes ${seconds} seconds remaining`}
      >
        <TimeReadout value={formatTime(pomodoroTime)} />
      </div>

      <div className="timer-progress" aria-hidden="true">
        <span className="timer-progress__fill" style={{ transform: `scaleX(${elapsed})` }} />
      </div>

      <p className="timer-status" aria-live="polite">
        {status}
      </p>

      <div className="timer-controls">
        <button
          type="button"
          className="ctrl-btn"
          onClick={resetPomodoro}
          disabled={pristine}
          aria-label="Reset timer"
          title="Reset (R)"
        >
          <RotateCcw size={18} aria-hidden="true" />
        </button>

        <button type="button" className="primary-btn timer-controls__primary" onClick={onPrimary}>
          <PrimaryIcon size={18} aria-hidden="true" />
          <span>{primaryLabel}</span>
        </button>

        <button
          type="button"
          className="ctrl-btn"
          onClick={() => advancePomodoro()}
          aria-label={`Skip to ${nextLabel}`}
          title="Next session (→)"
        >
          <SkipForward size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
