import { useState } from 'react'
import useZenflowStore from '../store/useZenflowStore'
import ModalShell from './ModalShell'

export default function CustomTimerModal() {
  const { pomodoroDurations, pomodoroRounds, applyCustomTimer, setCustomTimerOpen } = useZenflowStore()
  const [form, setForm] = useState({
    focus: pomodoroDurations.focus,
    shortBreak: pomodoroDurations.shortBreak,
    longBreak: pomodoroDurations.longBreak,
    rounds: pomodoroRounds,
  })

  const close = () => setCustomTimerOpen(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    applyCustomTimer(form)
    close()
  }

  return (
    <ModalShell
      title="Custom Timer"
      description="Fine-tune your focus rhythm and save it instantly."
      onClose={close}
      className="feature-modal-card"
      footer={
        <div className="modal-actions">
          <button type="button" className="secondary-pill" onClick={close}>
            Cancel
          </button>
          <button type="submit" form="custom-timer-form" className="primary-pill">
            Save Custom Timer
          </button>
        </div>
      }
    >
      <form id="custom-timer-form" onSubmit={handleSubmit}>
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
      </form>
    </ModalShell>
  )
}
