import { useState } from 'react'
import { Link2, Share2, UserRound } from 'lucide-react'
import useZenflowStore from '../../store/useZenflowStore'
import { SHORTCUTS } from '../../hooks/useKeyboardShortcuts'
import ToolPanel from '../ui/ToolPanel'
import Switch from '../ui/Switch'
import SegmentedControl from '../ui/SegmentedControl'
import { getDisplayName } from '../focus/FocusHeader'

const ACCENT_COLORS = [
  { name: 'Violet', value: '#7567FF' },
  { name: 'Teal', value: '#36D6B4' },
  { name: 'Sky', value: '#5BB8F5' },
  { name: 'Rose', value: '#EE7EA8' },
  { name: 'Sand', value: '#D9B38C' },
  { name: 'Mist', value: '#C9CCD6' },
]

const TIMER_FIELDS = [
  { key: 'focus', label: 'Focus', unit: 'min', max: 180 },
  { key: 'shortBreak', label: 'Short break', unit: 'min', max: 180 },
  { key: 'longBreak', label: 'Long break', unit: 'min', max: 180 },
  { key: 'rounds', label: 'Rounds', unit: 'cycles', max: 12 },
]

function TimerSettings() {
  const { pomodoroDurations, pomodoroRounds, applyCustomTimer, completionChime, setCompletionChime, showToast } =
    useZenflowStore()
  const saved = { ...pomodoroDurations, rounds: pomodoroRounds }
  const [form, setForm] = useState(saved)
  const dirty = TIMER_FIELDS.some(({ key }) => Number(form[key]) !== saved[key])

  const handleSubmit = (event) => {
    event.preventDefault()
    applyCustomTimer(form)
    const next = useZenflowStore.getState()
    setForm({ ...next.pomodoroDurations, rounds: next.pomodoroRounds })
    showToast('Timer updated.')
  }

  return (
    <section className="settings-section" aria-labelledby="settings-timer">
      <h3 id="settings-timer" className="settings-section__title">
        Timer
      </h3>
      <form className="timer-fields" onSubmit={handleSubmit}>
        {TIMER_FIELDS.map(({ key, label, unit, max }) => (
          <label key={key} className="number-field">
            <span className="number-field__label">{label}</span>
            <span className="number-field__control">
              <input
                type="number"
                inputMode="numeric"
                min="1"
                max={max}
                value={form[key]}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
              />
              <span className="number-field__unit">{unit}</span>
            </span>
          </label>
        ))}
        <div className="timer-fields__actions">
          <span className="meta-text">{dirty ? 'Applying restarts the current session.' : ''}</span>
          <button type="submit" className="secondary-btn" disabled={!dirty}>
            Apply
          </button>
        </div>
      </form>
      <Switch
        label="Chime when a session ends"
        checked={completionChime}
        onChange={setCompletionChime}
      />
    </section>
  )
}

function AppearanceSettings() {
  const {
    accentColor,
    setAccentColor,
    showClock,
    setShowClock,
    clockFormat,
    setClockFormat,
    showQuote,
    setShowQuote,
    showCompanion,
    setShowCompanion,
    customCursor,
    setCustomCursor,
  } = useZenflowStore()

  return (
    <section className="settings-section" aria-labelledby="settings-appearance">
      <h3 id="settings-appearance" className="settings-section__title">
        Appearance
      </h3>

      <div className="setting-row">
        <span className="setting-row__label" id="accent-label">
          Accent
        </span>
        <div className="swatches" role="radiogroup" aria-labelledby="accent-label">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              role="radio"
              aria-checked={accentColor.toLowerCase() === color.value.toLowerCase()}
              aria-label={color.name}
              title={color.name}
              className="swatch"
              style={{ '--swatch': color.value }}
              onClick={() => setAccentColor(color.value)}
            />
          ))}
        </div>
      </div>

      <Switch label="Clock" checked={showClock} onChange={setShowClock} />
      {showClock ? (
        <div className="setting-row setting-row--nested">
          <span className="setting-row__label">Format</span>
          <SegmentedControl
            label="Clock format"
            options={[
              { id: '24h', label: '24h' },
              { id: '12h', label: '12h' },
            ]}
            value={clockFormat}
            onChange={setClockFormat}
          />
        </div>
      ) : null}
      <Switch label="Quote" description="A quiet line at the bottom of the canvas." checked={showQuote} onChange={setShowQuote} />
      <Switch
        label="Focus companion"
        description="A small mug that empties as the session runs. Drag it anywhere."
        checked={showCompanion}
        onChange={setShowCompanion}
      />
      <Switch label="Custom cursor" checked={customCursor} onChange={setCustomCursor} />
    </section>
  )
}

function AccountSettings() {
  const { authUser, authLoading, userPlan, isPremiumUser, setLoginOpen, setUpgradeOpen, clickSoundEnabled, toggleClickSound, showToast } =
    useZenflowStore()
  const avatarUrl = authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin)
      showToast('Link copied.')
    } catch {
      showToast('Couldn’t copy the link.')
    }
  }

  const shareLink = async () => {
    try {
      await navigator.share({
        title: 'Zenflow',
        text: 'A calm place to focus.',
        url: window.location.origin,
      })
    } catch {
      // Dismissed share sheets reject; nothing to report.
    }
  }

  return (
    <>
      <section className="settings-section" aria-labelledby="settings-sound">
        <h3 id="settings-sound" className="settings-section__title">
          Sound
        </h3>
        <Switch
          label="Interface clicks"
          description="A soft tick when you press a control."
          checked={clickSoundEnabled}
          onChange={toggleClickSound}
        />
      </section>

      <section className="settings-section" aria-labelledby="settings-account">
        <h3 id="settings-account" className="settings-section__title">
          Account
        </h3>
        <div className="account-row">
          {avatarUrl ? (
            <img className="account-row__avatar" src={avatarUrl} alt="" referrerPolicy="no-referrer" />
          ) : (
            <span className="account-row__avatar">
              <UserRound size={16} aria-hidden="true" />
            </span>
          )}
          <span className="account-row__copy">
            <span className="account-row__name">
              {authLoading ? 'Checking session…' : authUser ? getDisplayName(authUser) : 'Not signed in'}
            </span>
            <span className="account-row__meta">
              {isPremiumUser ? `Zenflow Plus · ${userPlan}` : 'Zenflow Free'}
            </span>
          </span>
          <button type="button" className="secondary-btn" onClick={() => setLoginOpen(true)} disabled={authLoading}>
            {authUser ? 'Manage' : 'Sign in'}
          </button>
        </div>
        {!isPremiumUser ? (
          <button type="button" className="plus-row" onClick={() => setUpgradeOpen(true)}>
            <span>
              <span className="plus-row__title">Zenflow Plus</span>
              <span className="plus-row__meta">The full sound library and every scene.</span>
            </span>
            <span className="plus-row__cta">See plans</span>
          </button>
        ) : null}
      </section>

      <section className="settings-section" aria-labelledby="settings-share">
        <h3 id="settings-share" className="settings-section__title">
          Share Zenflow
        </h3>
        <div className="button-row">
          <button type="button" className="secondary-btn" onClick={copyLink}>
            <Link2 size={14} aria-hidden="true" />
            Copy link
          </button>
          {typeof navigator !== 'undefined' && navigator.share ? (
            <button type="button" className="secondary-btn" onClick={shareLink}>
              <Share2 size={14} aria-hidden="true" />
              Share
            </button>
          ) : null}
        </div>
      </section>
    </>
  )
}

export default function SettingsPanel({ onClose }) {
  return (
    <ToolPanel id="settings" title="Settings" placement="right" size="md" onClose={onClose} bodyClassName="settings-body">
      <TimerSettings />
      <AppearanceSettings />
      <AccountSettings />

      <section className="settings-section settings-section--quiet" aria-labelledby="settings-keys">
        <h3 id="settings-keys" className="settings-section__title">
          Keyboard
        </h3>
        <dl className="shortcut-list">
          {SHORTCUTS.map((item) => (
            <div key={item.keys} className="shortcut-list__row">
              <dt>{item.label}</dt>
              <dd>
                <kbd>{item.keys}</kbd>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </ToolPanel>
  )
}
