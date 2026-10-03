import { useEffect } from 'react'
import useZenflowStore, { POMODORO_MODES } from '../store/useZenflowStore'
import { playChime } from '../lib/chime'

const BASE_TITLE = 'Zenflow — Focus & Flow'

export function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function getModeLabel(mode) {
  return POMODORO_MODES.find((item) => item.key === mode)?.label || 'Focus'
}

// The single timer engine. Mount once (in App) so the countdown keeps running
// no matter which UI is visible.
export function useFocusTimer() {
  const running = useZenflowStore((state) => state.pomodoroRunning)
  const time = useZenflowStore((state) => state.pomodoroTime)
  const mode = useZenflowStore((state) => state.pomodoroMode)
  const total = useZenflowStore((state) => state.pomodoroDurations[state.pomodoroMode] * 60)

  useEffect(() => {
    const sync = () => {
      const store = useZenflowStore.getState()
      const finishedMode = store.pomodoroMode
      if (!store.syncPomodoro()) return

      if (store.completionChime) playChime()
      store.showToast(
        finishedMode === 'focus' ? 'Focus session complete. Take a breath.' : 'Break is over. Ready when you are.'
      )
    }

    // Also settles a session that ended while the tab was closed.
    sync()
    if (!running) return undefined

    const intervalId = window.setInterval(sync, 250)
    document.addEventListener('visibilitychange', sync)
    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [running])

  useEffect(() => {
    const touched = running || (time !== total && time > 0)
    document.title = touched ? `${formatTime(time)} · ${getModeLabel(mode)}` : BASE_TITLE
  }, [running, time, total, mode])
}
