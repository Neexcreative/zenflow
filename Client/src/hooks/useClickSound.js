import { useEffect, useRef } from 'react'
import useZenflowStore from '../store/useZenflowStore'

export function useClickSound() {
  const audioCtxRef = useRef(null)
  const clickSoundEnabled = useZenflowStore((s) => s.clickSoundEnabled)

  const playClick = () => {
    if (!clickSoundEnabled) return

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }

    const ctx = audioCtxRef.current

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    filter.type = 'highpass'
    filter.frequency.value = 800

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03)

    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.002)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.05)
  }

  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('button, a, [role="button"], input[type="checkbox"], label')
      if (target) playClick()
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [clickSoundEnabled])

  return { playClick }
}
