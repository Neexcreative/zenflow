import { useEffect, useState } from 'react'

const ACTIVITY_EVENTS = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart']

// True after `timeout` ms without user input, while `enabled`.
export function useIdle(enabled, timeout = 4000) {
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setIdle(false)
      return undefined
    }

    let timeoutId
    const wake = () => {
      setIdle(false)
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => setIdle(true), timeout)
    }

    wake()
    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, wake, { passive: true }))
    return () => {
      window.clearTimeout(timeoutId)
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, wake))
    }
  }, [enabled, timeout])

  return idle
}
