import useZenflowStore from '../store/useZenflowStore'
import ModalShell from './ModalShell'

const ACCENT_COLORS = [
  { name: 'Violet', value: '#6C63FF' },
  { name: 'Teal', value: '#00D4AA' },
  { name: 'Pink', value: '#FF6B9D' },
  { name: 'Amber', value: '#FF9F43' },
  { name: 'Sky', value: '#48DBFB' },
  { name: 'Green', value: '#1DD1A1' },
]

export default function SettingsModal() {
  const {
    setSettingsOpen,
    accentColor,
    setAccentColor,
    clockFormat,
    setClockFormat,
    pomodoroDurations,
    setPomodoroDurations,
    setUpgradeOpen,
    userPlan,
  } = useZenflowStore()

  const close = () => setSettingsOpen(false)

  return (
    <ModalShell
      title="Settings"
      description="Tune the workspace to match your focus style."
      onClose={close}
      className="settings-modal-card"
    >
      <section className="settings-section">
        <h3>Accent color</h3>
        <div className="settings-color-grid">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => setAccentColor(color.value)}
              title={color.name}
              className={`settings-color-swatch ${accentColor === color.value ? 'is-active' : ''}`}
              style={{ background: color.value }}
            />
          ))}
        </div>
      </section>

      <section className="settings-section">
        <h3>Clock format</h3>
        <div className="settings-pill-row">
          {['24h', '12h'].map((format) => (
            <button
              key={format}
              onClick={() => setClockFormat(format)}
              className={`settings-pill ${clockFormat === format ? 'is-active' : ''}`}
            >
              {format}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <h3>Pomodoro durations</h3>
        <div className="settings-grid-3">
          {[
            { key: 'focus', label: 'Focus' },
            { key: 'shortBreak', label: 'Short break' },
            { key: 'longBreak', label: 'Long break' },
          ].map(({ key, label }) => (
            <label key={key} className="settings-input-block">
              <span>{label}</span>
              <input
                type="number"
                min="1"
                max="60"
                value={pomodoroDurations[key]}
                onChange={(event) =>
                  setPomodoroDurations({
                    ...pomodoroDurations,
                    [key]: Number(event.target.value),
                  })
                }
              />
            </label>
          ))}
        </div>
      </section>

      <section className="settings-plan">
        <div>
          <div className="settings-plan-title">{userPlan}</div>
          <div className="settings-plan-copy">
            {userPlan === 'free' ? 'Up to 3 widgets active at the same time.' : 'All widgets unlocked.'}
          </div>
        </div>
        {userPlan === 'free' && (
          <button
            onClick={() => {
              close()
              setUpgradeOpen(true)
            }}
            className="btn-accent"
          >
            Upgrade
          </button>
        )}
      </section>
    </ModalShell>
  )
}
