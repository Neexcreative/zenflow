import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import useZenflowStore from '../../store/useZenflowStore'

const EASE = [0.22, 1, 0.36, 1]

/**
 * Floating tool surface that opens over the Focus Canvas.
 * Desktop: anchored above the dock on `placement` side. Mobile: bottom sheet (CSS).
 */
export default function ToolPanel({
  id,
  title,
  placement = 'left',
  size = 'md',
  onClose,
  actions,
  footer,
  children,
  bodyClassName = '',
}) {
  const panelRef = useRef(null)
  const titleId = `${id}-panel-title`

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      const { upgradeOpen, loginOpen } = useZenflowStore.getState()
      if (upgradeOpen || loginOpen) return
      onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    const node = panelRef.current
    if (node && !node.contains(document.activeElement)) node.focus({ preventScroll: true })
  }, [])

  return (
    <>
      <motion.div
        className="tool-scrim"
        aria-hidden="true"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.section
        ref={panelRef}
        id={`${id}-panel`}
        data-tool-panel
        role="dialog"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`tool-panel tool-panel--${placement} tool-panel--${size}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8, transition: { duration: 0.14 } }}
        transition={{ duration: 0.26, ease: EASE }}
      >
        <header className="tool-panel__head">
          <h2 id={titleId} className="tool-panel__title">
            {title}
          </h2>
          <div className="tool-panel__actions">
            {actions}
            <button type="button" className="icon-btn" onClick={onClose} aria-label={`Close ${title}`}>
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className={`tool-panel__body ${bodyClassName}`.trim()}>{children}</div>
        {footer ? <footer className="tool-panel__foot">{footer}</footer> : null}
      </motion.section>
    </>
  )
}
