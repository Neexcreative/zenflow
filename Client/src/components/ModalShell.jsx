import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function ModalShell({
  title,
  description,
  onClose,
  children,
  className = '',
  contentClassName = '',
  footer,
}) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overlay-modal"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className={`modal-shell-card ${className}`.trim()}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <span className="eyebrow-label">Zenflow</span>
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="icon-button" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <div className={contentClassName}>{children}</div>
        {footer}
      </motion.div>
    </motion.div>
  )
}
