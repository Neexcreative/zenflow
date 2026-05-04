import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Palette, X } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'

const BACKGROUNDS = [
  { id: 'default', label: 'Default Gradient' },
  { id: 'deep-focus', label: 'Deep Focus' },
  { id: 'sunset-flow', label: 'Sunset Flow' },
  { id: 'rainy-night', label: 'Rainy Night' },
  { id: 'minimal-dark', label: 'Minimal Dark' },
]

export default function BackgroundSwitcherModal() {
  const { backgroundTheme, setBackgroundTheme, setBackgroundSwitcherOpen } = useZenflowStore()

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setBackgroundSwitcherOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setBackgroundSwitcherOpen])

  const close = () => setBackgroundSwitcherOpen(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overlay-modal"
      onClick={close}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="feature-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h2>Change Background</h2>
            <p>Switch between a few polished gradients without leaving your workspace.</p>
          </div>
          <button type="button" onClick={close} className="btn-ghost">
            <X size={16} />
          </button>
        </div>

        <div className="background-option-grid">
          {BACKGROUNDS.map((item) => (
            <button
              key={item.id}
              className={`background-option background-${item.id} ${backgroundTheme === item.id ? 'is-active' : ''}`}
              onClick={() => setBackgroundTheme(item.id)}
            >
              <span className="background-option-preview">
                <Palette size={16} />
              </span>
              <span>{item.label}</span>
              {backgroundTheme === item.id && <Check size={14} />}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
