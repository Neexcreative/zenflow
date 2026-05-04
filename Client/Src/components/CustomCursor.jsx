import { useEffect, useRef } from 'react'

function isInteractive(target) {
  return target?.closest?.('button, a, input, textarea, select, [role="button"], label')
}

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const frameRef = useRef(0)
  const posRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const ringPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined

    const onMove = (event) => {
      posRef.current = { x: event.clientX, y: event.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = `${event.clientX}px`
        dotRef.current.style.top = `${event.clientY}px`
      }

      document.body.classList.toggle('cursor-hovering', Boolean(isInteractive(event.target)))
    }

    const onDown = () => document.body.classList.add('cursor-clicking')
    const onUp = () => document.body.classList.remove('cursor-clicking')

    const animate = () => {
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.15
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.15

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPosRef.current.x}px`
        ringRef.current.style.top = `${ringPosRef.current.y}px`
      }

      frameRef.current = window.requestAnimationFrame(animate)
    }

    frameRef.current = window.requestAnimationFrame(animate)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    return () => {
      document.body.classList.remove('cursor-hovering', 'cursor-clicking')
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      window.cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
