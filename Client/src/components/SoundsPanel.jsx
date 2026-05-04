import { useMemo, useState } from 'react'
import { Music2, Pause, Play, X } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'
import { AMBIENT_SOUNDS, SOUND_FILTERS } from '../data/sounds'

function isValidUrl(value) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function isSpotifyUrl(value) {
  return /^https?:\/\/(open\.)?spotify\.com\/(playlist|track|album)\//i.test(value.trim())
}

function getSpotifyEmbedUrl(value) {
  return value.replace('open.spotify.com/', 'open.spotify.com/embed/')
}

export default function SoundsPanel() {
  const {
    soundsTab,
    setSoundsTab,
    soundFilter,
    setSoundFilter,
    selectedSoundId,
    ambientPlaying,
    ambientVolume,
    setSelectedSoundId,
    setAmbientPlaying,
    setAmbientVolume,
    customMusicUrl,
    setCustomMusicUrl,
    musicFavorites,
    saveMusicFavorite,
    removeMusicFavorite,
    setSoundsOpen,
    isPremiumUser,
    showToast,
  } = useZenflowStore()
  const [feedback, setFeedback] = useState('')

  const filteredSounds = useMemo(() => {
    if (soundFilter === 'All') return AMBIENT_SOUNDS
    if (soundFilter === 'Free') return AMBIENT_SOUNDS.filter((item) => !item.plus)
    return AMBIENT_SOUNDS.filter((item) => item.plus)
  }, [soundFilter])

  const handleLoad = () => {
    if (!isValidUrl(customMusicUrl)) {
      setFeedback('Please paste a valid URL first.')
      return
    }

    if (isSpotifyUrl(customMusicUrl)) {
      setFeedback('Spotify preview is ready below.')
      return
    }

    setFeedback('Link loaded as a music placeholder.')
  }

  const handleSaveFavorite = () => {
    if (!isValidUrl(customMusicUrl)) {
      setFeedback('Please paste a valid URL first.')
      return
    }
    if (musicFavorites.length >= 5 && !musicFavorites.includes(customMusicUrl)) {
      setFeedback('You can store up to 5 favorites.')
      return
    }
    saveMusicFavorite(customMusicUrl)
    setFeedback('Saved to favorites.')
  }

  const handleSpotifyConnect = () => {
    // Add Spotify OAuth or player setup here when integration is available.
    showToast('Spotify integration is not connected yet.')
  }

  const handleSoundSelect = (sound) => {
    if (sound.plus && !isPremiumUser) {
      showToast('This sound is available for Plus users.')
      return
    }

    if (selectedSoundId === sound.id) {
      setAmbientPlaying(!ambientPlaying)
      return
    }

    setSelectedSoundId(sound.id)
    setAmbientPlaying(true)
  }

  const playButtonLabel = ambientPlaying ? 'Pause' : 'Play'

  return (
    <aside className="side-panel sounds-panel">
      <div className="panel-head">
        <div>
          <h3>Ambient Audio</h3>
          <p>Blend calm textures, playlists, and your own music sources.</p>
        </div>
        <button className="btn-ghost" onClick={() => setSoundsOpen(false)}>
          <X size={16} />
        </button>
      </div>

      <div className="panel-tabs">
        {[
          { id: 'sounds', label: 'Sounds' },
          { id: 'music', label: 'My Music' },
          { id: 'library', label: 'Playlist Library' },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`panel-tab ${soundsTab === tab.id ? 'is-active' : ''}`}
            onClick={() => setSoundsTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {soundsTab === 'sounds' && (
        <div className="panel-section">
          <div className="panel-toolbar sound-toolbar">
            <select value={soundFilter} onChange={(event) => setSoundFilter(event.target.value)}>
              {SOUND_FILTERS.map((filter) => (
                <option key={filter}>{filter}</option>
              ))}
            </select>

            <div className="sound-toolbar-actions">
              <button
                className={`secondary-pill ${ambientPlaying ? 'is-playing' : ''}`}
                onClick={() => {
                  if (!selectedSoundId) {
                    const firstAvailable = filteredSounds.find((sound) => !sound.plus || isPremiumUser)
                    if (!firstAvailable) {
                      showToast('No available sounds match the current filter.')
                      return
                    }
                    setSelectedSoundId(firstAvailable.id)
                    setAmbientPlaying(true)
                    return
                  }
                  setAmbientPlaying(!ambientPlaying)
                }}
              >
                {ambientPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{playButtonLabel}</span>
              </button>

              <label className="volume-control">
                <span>Volume</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={Math.round(ambientVolume * 100)}
                  onChange={(event) => setAmbientVolume(Number(event.target.value) / 100)}
                />
              </label>
            </div>
          </div>

          <div className="sound-grid">
            {filteredSounds.map((sound) => (
              <button
                key={sound.id}
                className={`sound-tile ${selectedSoundId === sound.id ? 'is-active' : ''} ${sound.plus ? 'is-plus' : ''}`}
                onClick={() => handleSoundSelect(sound)}
                title={sound.plus && !isPremiumUser ? 'Available for Plus users' : `Play ${sound.name}`}
              >
                <span className="sound-emoji">{sound.emoji}</span>
                <span className="sound-name">{sound.name}</span>
                {sound.plus && <span className="mini-plus-badge">PLUS</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {soundsTab === 'music' && (
        <div className="panel-section">
          <div className="music-actions-row">
            <button className="secondary-pill" onClick={handleSpotifyConnect}>
              <Music2 size={14} />
              <span>Connect Spotify</span>
            </button>
            <button className="secondary-pill" onClick={handleSpotifyConnect}>
              <Music2 size={14} />
              <span>Load Spotify Player</span>
            </button>
          </div>

          <div className="music-copy">
            <h4>Custom Playlists</h4>
            <p>
              Add your favorite playlists from Spotify, YouTube, Apple Music, SoundCloud, or
              Amazon Music. Store up to 5 to favorites.
            </p>
          </div>

          <input
            className="music-url-input"
            value={customMusicUrl}
            onChange={(event) => setCustomMusicUrl(event.target.value)}
            placeholder="Paste playlist or video URL here"
          />

          <div className="modal-actions">
            <button className="secondary-pill" onClick={handleLoad}>
              Load
            </button>
            <button className="primary-pill" onClick={handleSaveFavorite}>
              Save to Favorites
            </button>
          </div>

          {customMusicUrl && isSpotifyUrl(customMusicUrl) && (
            <div className="spotify-preview-shell">
              <iframe
                title="Spotify preview"
                src={getSpotifyEmbedUrl(customMusicUrl)}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          )}

          {customMusicUrl && !isSpotifyUrl(customMusicUrl) && isValidUrl(customMusicUrl) && (
            <div className="music-preview-card">
              <p>Ready to save or connect later</p>
              <span>{customMusicUrl}</span>
            </div>
          )}
        </div>
      )}

      {soundsTab === 'library' && (
        <div className="panel-section">
          <div className="music-copy">
            <h4>Playlist Library</h4>
            <p>Your saved favorites live here so you can relaunch them quickly.</p>
          </div>

          <div className="playlist-library">
            {musicFavorites.length === 0 ? (
              <div className="empty-state-card">
                <p>No favorites yet. Save up to five playlist links from the My Music tab.</p>
              </div>
            ) : (
              musicFavorites.map((item) => (
                <div key={item} className="playlist-row">
                  <span>{item}</span>
                  <button className="task-icon-button" onClick={() => removeMusicFavorite(item)}>
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {feedback && <p className="inline-feedback">{feedback}</p>}
    </aside>
  )
}
