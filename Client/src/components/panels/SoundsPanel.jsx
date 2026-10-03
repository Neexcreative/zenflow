import { useMemo, useState } from 'react'
import {
  AudioWaveform,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  Coffee,
  ExternalLink,
  Eye,
  EyeOff,
  Flame,
  Leaf,
  Lock,
  Pause,
  Plane,
  Play,
  Tent,
  Trash2,
  Volume1,
  Volume2,
  VolumeX,
  Waves,
  Wind,
  X,
} from 'lucide-react'
import useZenflowStore, { extractVideoId } from '../../store/useZenflowStore'
import { AMBIENT_SOUNDS, SOUND_FILTERS, getSoundById } from '../../data/sounds'
import ToolPanel from '../ui/ToolPanel'
import SegmentedControl from '../ui/SegmentedControl'

const ICON_BY_ID = {
  ocean: Waves,
  wind: Wind,
  campfire: Tent,
  thunderstorm: CloudLightning,
  'light-rain': CloudDrizzle,
}

const ICON_BY_CATEGORY = {
  rain: CloudRain,
  nature: Leaf,
  cafe: Coffee,
  travel: Plane,
  study: BookOpen,
  city: Building2,
  warmth: Flame,
  work: Briefcase,
  noise: AudioWaveform,
  binaural: Brain,
}

const TABS = [
  { id: 'sounds', label: 'Sounds' },
  { id: 'music', label: 'Music' },
  { id: 'library', label: 'Saved' },
]

const MAX_FAVORITES = 5

function isValidUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isYouTubeUrl(value) {
  return /(?:youtube\.com|youtu\.be)\//i.test(value)
}

function isSpotifyUrl(value) {
  return /^https?:\/\/(open\.)?spotify\.com\/(playlist|track|album)\//i.test(value.trim())
}

function getSpotifyEmbedUrl(value) {
  return value.replace('open.spotify.com/', 'open.spotify.com/embed/')
}

function shortLink(value) {
  try {
    const url = new URL(value)
    return `${url.hostname.replace(/^www\./, '')}${url.pathname === '/' ? '' : url.pathname}`
  } catch {
    return value
  }
}

function VolumeSlider({ value, onChange }) {
  const VolumeIcon = value === 0 ? VolumeX : value < 0.5 ? Volume1 : Volume2
  return (
    <label className="volume">
      <VolumeIcon size={16} aria-hidden="true" />
      <input
        type="range"
        min="0"
        max="100"
        value={Math.round(value * 100)}
        onChange={(event) => onChange(Number(event.target.value) / 100)}
        aria-label="Ambient volume"
        style={{ '--fill': `${Math.round(value * 100)}%` }}
      />
    </label>
  )
}

function SoundLibrary() {
  const {
    soundFilter,
    setSoundFilter,
    selectedSoundId,
    ambientPlaying,
    setSelectedSoundId,
    setAmbientPlaying,
    isPremiumUser,
    setUpgradeOpen,
  } = useZenflowStore()

  const sounds = useMemo(() => {
    if (soundFilter === 'Free') return AMBIENT_SOUNDS.filter((item) => !item.premium)
    if (soundFilter === 'Plus') return AMBIENT_SOUNDS.filter((item) => item.premium)
    return AMBIENT_SOUNDS
  }, [soundFilter])

  const handleSelect = (sound) => {
    if (sound.premium && !isPremiumUser) {
      setUpgradeOpen(true)
      return
    }
    if (selectedSoundId === sound.id) {
      setAmbientPlaying(!ambientPlaying)
      return
    }
    setSelectedSoundId(sound.id)
    setAmbientPlaying(true)
  }

  return (
    <>
      <SegmentedControl
        label="Filter sounds"
        className="segmented--quiet"
        options={SOUND_FILTERS}
        value={soundFilter}
        onChange={setSoundFilter}
      />

      <ul className="sound-grid">
        {sounds.map((sound) => {
          const Icon = ICON_BY_ID[sound.id] || ICON_BY_CATEGORY[sound.category] || AudioWaveform
          const locked = sound.premium && !isPremiumUser
          const selected = selectedSoundId === sound.id
          const playing = selected && ambientPlaying

          return (
            <li key={sound.id}>
              <button
                type="button"
                className={`sound-tile ${selected ? 'is-selected' : ''} ${locked ? 'is-locked' : ''}`}
                aria-pressed={playing}
                aria-label={locked ? `${sound.title}, Plus sound` : sound.title}
                onClick={() => handleSelect(sound)}
              >
                <Icon size={18} aria-hidden="true" className="sound-tile__icon" />
                <span className="sound-tile__name">{sound.title}</span>
                <span className="sound-tile__meta">{sound.mood}</span>
                {locked ? <Lock size={12} aria-hidden="true" className="sound-tile__lock" /> : null}
                {playing ? (
                  <span className="eq" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

function MusicLinks({ onShowSaved }) {
  const {
    videoId,
    currentVideoUrl,
    isPlaying,
    backgroundVisible,
    setVideoUrl,
    setIsPlaying,
    setBackgroundVisible,
    customMusicUrl,
    setCustomMusicUrl,
    musicFavorites,
    saveMusicFavorite,
  } = useZenflowStore()
  const [draft, setDraft] = useState('')
  const [feedback, setFeedback] = useState('')

  const saveFavorite = (url) => {
    if (musicFavorites.includes(url)) {
      setFeedback('Already in your saved links.')
      return
    }
    if (musicFavorites.length >= MAX_FAVORITES) {
      setFeedback(`You can keep up to ${MAX_FAVORITES} saved links.`)
      return
    }
    saveMusicFavorite(url)
    setFeedback('Saved.')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const url = draft.trim()

    if (!isValidUrl(url)) {
      setFeedback('That doesn’t look like a link. Paste a full YouTube or Spotify URL.')
      return
    }

    if (isYouTubeUrl(url)) {
      if (!extractVideoId(url)) {
        setFeedback('Couldn’t find a video in that YouTube link.')
        return
      }
      setVideoUrl(url)
      setIsPlaying(true)
      setFeedback('')
    } else {
      setCustomMusicUrl(url)
      setFeedback(isSpotifyUrl(url) ? '' : 'Only YouTube and Spotify play inside Zenflow. You can still save this link.')
    }
    setDraft('')
  }

  return (
    <>
      <form className="link-entry" onSubmit={handleSubmit}>
        <input
          type="url"
          inputMode="url"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Paste a YouTube or Spotify link"
          aria-label="Music link"
        />
        <button type="submit" className="secondary-btn" disabled={!draft.trim()}>
          Play
        </button>
      </form>

      {feedback ? (
        <p className="inline-note" role="status">
          {feedback}
        </p>
      ) : null}

      {videoId ? (
        <div className="media-card">
          <img
            className="media-card__thumb"
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt=""
          />
          <div className="media-card__copy">
            <span className="media-card__title">YouTube</span>
            <span className="media-card__meta">{shortLink(currentVideoUrl)}</span>
          </div>
          <div className="media-card__actions">
            <button
              type="button"
              className="icon-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause YouTube' : 'Play YouTube'}
            >
              {isPlaying ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => setBackgroundVisible(!backgroundVisible)}
              aria-pressed={backgroundVisible}
              aria-label="Tint the scene with the video"
              title="Tint the scene with the video"
            >
              {backgroundVisible ? <Eye size={16} aria-hidden="true" /> : <EyeOff size={16} aria-hidden="true" />}
            </button>
            <button type="button" className="text-btn" onClick={() => saveFavorite(currentVideoUrl)}>
              Save
            </button>
            <button
              type="button"
              className="icon-btn icon-btn--quiet"
              onClick={() => {
                setIsPlaying(false)
                setVideoUrl('')
              }}
              aria-label="Remove YouTube link"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}

      {customMusicUrl ? (
        <div className="media-block">
          {isSpotifyUrl(customMusicUrl) ? (
            <iframe
              className="spotify-embed"
              title="Spotify player"
              src={getSpotifyEmbedUrl(customMusicUrl)}
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          ) : (
            <a className="link-card" href={customMusicUrl} target="_blank" rel="noreferrer">
              <span>{shortLink(customMusicUrl)}</span>
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
          <div className="media-block__actions">
            <button type="button" className="text-btn" onClick={() => saveFavorite(customMusicUrl)}>
              Save link
            </button>
            <button type="button" className="text-btn" onClick={() => setCustomMusicUrl('')}>
              Remove
            </button>
          </div>
        </div>
      ) : null}

      {!videoId && !customMusicUrl ? (
        <p className="empty-note">
          Bring your own soundtrack. YouTube plays in the background; Spotify opens a compact player here.
          {musicFavorites.length ? (
            <>
              {' '}
              <button type="button" className="text-btn text-btn--inline" onClick={onShowSaved}>
                Open saved links
              </button>
            </>
          ) : null}
        </p>
      ) : null}
    </>
  )
}

function SavedLinks({ onPlay }) {
  const { musicFavorites, removeMusicFavorite } = useZenflowStore()

  if (!musicFavorites.length) {
    return (
      <p className="empty-note">
        Nothing saved yet. Play a link in Music and save it to keep up to {MAX_FAVORITES} here.
      </p>
    )
  }

  return (
    <ul className="saved-list">
      {musicFavorites.map((url) => (
        <li key={url} className="saved-row">
          <button type="button" className="saved-row__play" onClick={() => onPlay(url)}>
            <Play size={14} aria-hidden="true" />
            <span>{shortLink(url)}</span>
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--quiet"
            onClick={() => removeMusicFavorite(url)}
            aria-label={`Remove ${shortLink(url)}`}
          >
            <Trash2 size={14} aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  )
}

function NowPlaying() {
  const { selectedSoundId, ambientPlaying, ambientVolume, setAmbientPlaying, setAmbientVolume } = useZenflowStore()
  const sound = getSoundById(selectedSoundId)

  if (!sound) {
    return <span className="meta-text">Pick a sound to begin. Tap it again to pause.</span>
  }

  return (
    <div className="now-playing">
      <button
        type="button"
        className="ctrl-btn ctrl-btn--sm"
        onClick={() => setAmbientPlaying(!ambientPlaying)}
        aria-label={ambientPlaying ? `Pause ${sound.title}` : `Play ${sound.title}`}
      >
        {ambientPlaying ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      </button>
      <span className="now-playing__title">{sound.title}</span>
      <VolumeSlider value={ambientVolume} onChange={setAmbientVolume} />
    </div>
  )
}

export default function SoundsPanel({ onClose }) {
  const { soundsTab, setSoundsTab, setVideoUrl, setIsPlaying, setCustomMusicUrl } = useZenflowStore()
  const tab = TABS.some((item) => item.id === soundsTab) ? soundsTab : 'sounds'

  const playSaved = (url) => {
    if (isYouTubeUrl(url)) {
      setVideoUrl(url)
      setIsPlaying(true)
    } else {
      setCustomMusicUrl(url)
    }
    setSoundsTab('music')
  }

  return (
    <ToolPanel
      id="sounds"
      title="Sounds"
      placement="left"
      size="lg"
      onClose={onClose}
      footer={<NowPlaying />}
    >
      <SegmentedControl label="Sound source" options={TABS} value={tab} onChange={setSoundsTab} />
      <div className="panel-stack">
        {tab === 'sounds' ? <SoundLibrary /> : null}
        {tab === 'music' ? <MusicLinks onShowSaved={() => setSoundsTab('library')} /> : null}
        {tab === 'library' ? <SavedLinks onPlay={playSaved} /> : null}
      </div>
    </ToolPanel>
  )
}
