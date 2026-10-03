import { useEffect, useMemo, useState } from 'react'
import { Check, Lock } from 'lucide-react'
import useZenflowStore from '../../store/useZenflowStore'
import { BACKGROUND_CATEGORIES, BACKGROUND_GALLERY } from '../../data/backgrounds'
import ToolPanel from '../ui/ToolPanel'
import SegmentedControl from '../ui/SegmentedControl'

// Media scenes are only offered once their thumbnail loads, so a missing asset
// never shows up as a mislabelled gradient. Results are cached for the session.
const thumbnailStatus = new Map()

function useAvailableScenes() {
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    let active = true
    BACKGROUND_GALLERY.forEach((scene) => {
      if (scene.type === 'gradient' || !scene.thumbnail || thumbnailStatus.has(scene.id)) return
      thumbnailStatus.set(scene.id, 'loading')
      const image = new Image()
      image.onload = () => {
        thumbnailStatus.set(scene.id, 'ok')
        if (active) forceUpdate((value) => value + 1)
      }
      image.onerror = () => thumbnailStatus.set(scene.id, 'failed')
      image.src = scene.thumbnail
    })
    return () => {
      active = false
    }
  }, [])

  return BACKGROUND_GALLERY.filter(
    (scene) => scene.type === 'gradient' || thumbnailStatus.get(scene.id) === 'ok'
  )
}

export default function BackgroundPanel({ onClose }) {
  const {
    selectedBackgroundId,
    setSelectedBackgroundId,
    setBackgroundTheme,
    canvasDim,
    setCanvasDim,
    isPremiumUser,
    setUpgradeOpen,
  } = useZenflowStore()
  const [filter, setFilter] = useState('all')
  const scenes = useAvailableScenes()

  const filters = useMemo(() => {
    const present = new Set(scenes.map((scene) => scene.category))
    return [{ id: 'all', label: 'All' }, ...BACKGROUND_CATEGORIES.filter((item) => present.has(item.id))]
  }, [scenes])

  const visible = filter === 'all' ? scenes : scenes.filter((scene) => scene.category === filter)

  const handleSelect = (scene) => {
    if (scene.premium && !isPremiumUser) {
      setUpgradeOpen(true)
      return
    }
    setSelectedBackgroundId(scene.id)
    setBackgroundTheme(scene.fallbackTheme || 'default')
  }

  const dimPercent = Math.round(canvasDim * 100)

  return (
    <ToolPanel
      id="background"
      title="Scenes"
      placement="right"
      size="lg"
      onClose={onClose}
      footer={
        <label className="range-field">
          <span className="range-field__label">Dim</span>
          <input
            type="range"
            min="0"
            max="85"
            value={dimPercent}
            onChange={(event) => setCanvasDim(Number(event.target.value) / 100)}
            style={{ '--fill': `${(dimPercent / 85) * 100}%` }}
            aria-valuetext={`${dimPercent}%`}
          />
          <span className="range-field__value">{dimPercent}%</span>
        </label>
      }
    >
      {filters.length > 2 ? (
        <SegmentedControl
          label="Scene category"
          className="segmented--quiet"
          options={filters}
          value={filter}
          onChange={setFilter}
        />
      ) : null}

      <ul className="scene-grid">
        {visible.map((scene) => {
          const active = selectedBackgroundId === scene.id
          const locked = scene.premium && !isPremiumUser
          return (
            <li key={scene.id}>
              <button
                type="button"
                className={`scene-card ${active ? 'is-active' : ''}`}
                aria-pressed={active}
                aria-label={locked ? `${scene.title}, Plus scene` : scene.title}
                onClick={() => handleSelect(scene)}
              >
                <span className="scene-card__preview scene__layer" data-scene={scene.fallbackTheme || 'default'}>
                  {scene.type !== 'gradient' && scene.thumbnail ? (
                    <img src={scene.thumbnail} alt="" loading="lazy" />
                  ) : null}
                  {active ? (
                    <span className="scene-card__check">
                      <Check size={14} aria-hidden="true" />
                    </span>
                  ) : null}
                  {locked ? (
                    <span className="plus-tag">
                      <Lock size={11} aria-hidden="true" />
                      Plus
                    </span>
                  ) : null}
                </span>
                <span className="scene-card__title">{scene.title}</span>
                <span className="scene-card__meta">{scene.category === 'animated' ? 'Slow motion' : scene.mood}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </ToolPanel>
  )
}
