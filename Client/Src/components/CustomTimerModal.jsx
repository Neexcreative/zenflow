import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'

export default function CustomTimerModal() {
  const { pomodoroDurations, pomodoroRounds, applyCustomTimer, setCustomTimerOpen } = useZenflowStore()
  const [form, setForm] = useState({
    focus: pomodoroDurations.focus,
    shortBreak: pomodoroDurations.shortBreak,
    longBreak: pomodoroDurations.longBreak,
    rounds: pomodoroRounds,
  })

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setCustomTimerOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setCustomTimerOpen])

  const close = () => setCustomTimerOpen(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    applyCustomTimer(form)
    close()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overlay-modal"
      onClick={close}
    >
      <motion.form
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="feature-modal-card"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="modal-head">
          <div>
            <h2>Custom Timer</h2>
            <p>Fine-tune your focus rhythm and save it instantly.</p>
          </div>
          <button type="button" onClick={close} className="btn-ghost">
            <X size={16} />
          </button>
        </div>

        <div className="settings-grid-2">
          {[
            { key: 'focus', label: 'Focus time', suffix: 'minutes' },
            { key: 'shortBreak', label: 'Short break', suffix: 'minutes' },
            { key: 'longBreak', label: 'Long break', suffix: 'minutes' },
            { key: 'rounds', label: 'Number of rounds', suffix: 'cycles' },
          ].map(({ key, label, suffix }) => (
            <label key={key} className="settings-input-block">
              <span>{label}</span>
              <div className="input-with-suffix">
                <input
                  type="number"
                  min="1"
                  max={key === 'rounds' ? '12' : '180'}
                  value={form[key]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [key]: Number(event.target.value),
                    }))
                  }
                />
                <small>{suffix}</small>
              </div>
            </label>
          ))}
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary-pill" onClick={close}>
            Cancel
          </button>
          <button type="submit" className="primary-pill">
            Save Custom Timer
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}
