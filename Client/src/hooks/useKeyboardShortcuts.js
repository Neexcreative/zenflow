import { useEffect } from 'react'
import useZenflowStore from '../store/useZenflowStore'
import { fullscreenSupported, toggleFullscreen } from '../lib/fullscreen'

export const SHORTCUTS = [
  { keys: 'Space', label: 'Start or pause' },
  { keys: 'R', label: 'Reset timer' },
  { keys: '→', label: 'Next session' },
  { keys: 'T', label: 'Tasks' },
  { keys: 'S', label: 'Sounds' },
  { keys: 'N', label: 'Notes' },
  { keys: 'B', label: 'Scenes' },
  { keys: 'F', label: 'Fullscreen' },
  { keys: 'Esc', label: 'Close panel' },
]

const TOOL_KEYS = { t: 'tasks', s: 'sounds', n: 'notes', b: 'background' }

function isTyping(target) {
  return Boolean(target?.closest?.('input, textarea, select, [contenteditable="true"]'))
}

function isPressable(target) {
  return Boolean(target?.closest?.('button, a, [role="button"], [role="switch"]'))
}

export function useKeyboardShortcuts() {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return
      if (isTyping(event.target)) return

      const store = useZenflowStore.getState()
      if (store.upgradeOpen || store.loginOpen) return

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key

      if (key === ' ') {
        // Space on a focused control activates that control instead.
        if (isPressable(event.target)) return
        event.preventDefault()
        if (store.pomodoroRunning) store.pausePomodoro()
        else if (store.pomodoroTime === 0) store.advancePomodoro({ autoStart: true })
        else store.startPomodoro()
      } else if (key === 'r') {
        store.resetPomodoro()
      } else if (key === 'ArrowRight') {
        store.advancePomodoro()
      } else if (key === 'f' && fullscreenSupported) {
        toggleFullscreen()
      } else if (TOOL_KEYS[key]) {
        store.toggleTool(TOOL_KEYS[key])
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
