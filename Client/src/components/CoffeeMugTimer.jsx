import { useEffect, useMemo, useRef, useState } from 'react'
import useZenflowStore from '../store/useZenflowStore'

const MUG_WIDTH = 100
const MUG_HEIGHT = 120
const EDGE_PADDING = 12

function clampPosition(x, y) {
  const maxX = Math.max(EDGE_PADDING, window.innerWidth - MUG_WIDTH - EDGE_PADDING)
  const maxY = Math.max(EDGE_PADDING, window.innerHeight - MUG_HEIGHT - EDGE_PADDING)

  return {
    x: Math.min(maxX, Math.max(EDGE_PADDING, x)),
    y: Math.min(maxY, Math.max(EDGE_PADDING, y)),
  }
}

export default function CoffeeMugTimer() {
  const { pomodoroMode, pomodoroTime, pomodoroDurations, coffeeMugPosition, setCoffeeMugPosition } =
    useZenflowStore()
  const [dragging, setDragging] = useState(false)
  const offsetRef = useRef({ x: 0, y: 0 })

  const totalSeconds = (pomodoroDurations[pomodoroMode] || 1) * 60
  const progress = Math.max(0, Math.min(1, pomodoroTime / totalSeconds))
  const fillHeight = 8 + progress * 82

  const position = useMemo(() => {
    if (coffeeMugPosition.x !== null && coffeeMugPosition.y !== null) {
      return coffeeMugPosition
    }

    return clampPosition(window.innerWidth - 132, 96)
  }, [coffeeMugPosition])

  useEffect(() => {
    if (coffeeMugPosition.x === null || coffeeMugPosition.y === null) {
      setCoffeeMugPosition(position)
    }
  }, [coffeeMugPosition.x, coffeeMugPosition.y, position, setCoffeeMugPosition])

  useEffect(() => {
    const handleResize = () => {
      setCoffeeMugPosition(clampPosition(position.x, position.y))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [position.x, position.y, setCoffeeMugPosition])

  useEffect(() => {
    if (!dragging) return undefined

    const onPointerMove = (event) => {
      const x = event.clientX - offsetRef.current.x
      const y = event.clientY - offsetRef.current.y
      setCoffeeMugPosition(clampPosition(x, y))
    }

    const onPointerUp = () => setDragging(false)

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [dragging, setCoffeeMugPosition])

  const onPointerDown = (event) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setDragging(true)
    offsetRef.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    }
  }

  return (
    <button
      type="button"
      className={`coffee-widget ${dragging ? 'is-dragging' : ''}`}
      aria-label="Move coffee mug"
      onPointerDown={onPointerDown}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div className="coffee-pixel-wrap">
        <div className="coffee-mug">
          <div className="coffee-fill" style={{ height: `${fillHeight}%` }} />
          <div className="coffee-steam steam-one" />
          <div className="coffee-steam steam-two" />
        </div>
      </div>
    </button>
  )
}
