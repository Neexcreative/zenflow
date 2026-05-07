import { useMemo, useState } from 'react'
import { Check, Image as ImageIcon, Lock, Palette, Video } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'
import { BACKGROUND_FILTERS, BACKGROUND_GALLERY } from '../data/backgrounds'
import ModalShell from './ModalShell'

function matchesFilter(item, filter) {
  if (filter === 'All') return true
  return item.category.toLowerCase() === filter.toLowerCase()
}

function TypeIcon({ type }) {
  if (type === 'video') return <Video size={14} />
  return <ImageIcon size={14} />
}

export default function BackgroundSwitcherModal() {
  const {
    selectedBackgroundId,
    setSelectedBackgroundId,
    setBackgroundTheme,
    setBackgroundSwitcherOpen,
    isPremiumUser,
    setUpgradeOpen,
  } = useZenflowStore()
  const [filter, setFilter] = useState('All')
  const [failedThumbs, setFailedThumbs] = useState({})
  const close = () => setBackgroundSwitcherOpen(false)

  const filteredBackgrounds = useMemo(
    () => BACKGROUND_GALLERY.filter((item) => matchesFilter(item, filter)),
    [filter]
  )

  const handleSelect = (item) => {
    if (item.premium && !isPremiumUser) {
      close()
      setUpgradeOpen(true)
      return
    }

    setSelectedBackgroundId(item.id)
    if (item.fallbackTheme) {
      setBackgroundTheme(item.fallbackTheme)
    }
  }

  return (
    <ModalShell
      title="Background Gallery"
      description="Set the mood for your session."
      onClose={close}
      className="feature-modal-card background-gallery-modal"
    >
      <div className="gallery-filter-row">
        {BACKGROUND_FILTERS.map((item) => (
          <button
            key={item}
            className={`gallery-filter-pill ${filter === item ? 'is-active' : ''}`}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="background-gallery-grid">
        {filteredBackgrounds.map((item) => {
          const thumbFailed = failedThumbs[item.id]
          const isActive = selectedBackgroundId === item.id
          return (
            <button
              key={item.id}
              className={`background-gallery-card ${isActive ? 'is-active' : ''}`}
              onClick={() => handleSelect(item)}
              title={item.premium && !isPremiumUser ? 'Available for Plus users' : `Apply ${item.title}`}
            >
              <div className="background-gallery-preview">
                {item.thumbnail && !thumbFailed ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    onError={() =>
                      setFailedThumbs((current) => ({
                        ...current,
                        [item.id]: true,
                      }))
                    }
                  />
                ) : (
                  <div className={`background-gallery-fallback background-${item.fallbackTheme || 'default'}`}>
                    <Palette size={18} />
                  </div>
                )}

                <div className="background-gallery-meta-top">
                  <span className="background-type-pill">
                    <TypeIcon type={item.type} />
                    <span>{item.type}</span>
                  </span>
                  {item.premium ? (
                    <span className="sound-lock-pill">
                      <Lock size={12} />
                      <span>Plus</span>
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="background-gallery-copy">
                <div>
                  <strong>{item.title}</strong>
                  <p>
                    {item.category} · {item.mood}
                  </p>
                </div>
                {isActive ? <Check size={16} /> : null}
              </div>
            </button>
          )
        })}
      </div>
    </ModalShell>
  )
}
