import { useEffect, useState } from 'react'
import { Eye, EyeOff, LogIn, Music2, SlidersHorizontal, UserRound, Volume2 } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'

export default function HeaderBar() {
  const {
    authUser,
    currentVideoUrl,
    isPlaying,
    videoId,
    backgroundVisible,
    soundsOpen,
    setVideoUrl,
    setCustomTimerOpen,
    setLoginOpen,
    setBackgroundVisible,
    setSoundsOpen,
  } = useZenflowStore()
  const [value, setValue] = useState(currentVideoUrl)

  useEffect(() => {
    setValue(currentVideoUrl)
  }, [currentVideoUrl])

  const handleSubmit = (event) => {
    event.preventDefault()
    const url = value.trim()
    if (!url) return
    setVideoUrl(url)
  }

  const userName =
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    authUser?.email ||
    'Account'
  const avatarUrl = authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture

  return (
    <header className="top-header">
      <div className="header-utility-row">
        <button className="header-chip" onClick={() => setCustomTimerOpen(true)}>
          <SlidersHorizontal size={14} />
          <span>Custom Timer</span>
        </button>
      </div>

      <form className="youtube-bar" onSubmit={handleSubmit}>
        <div className="youtube-input-shell">
          <Music2 size={13} className={isPlaying ? 'is-playing' : ''} />
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Paste a YouTube link to set the mood..."
          />
          {videoId && (
            <button
              type="button"
              className="header-icon-button"
              title={backgroundVisible ? 'Hide background glow' : 'Show background glow'}
              onClick={() => setBackgroundVisible(!backgroundVisible)}
            >
              {backgroundVisible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          )}
          {isPlaying && <span className="playing-indicator" />}
        </div>
      </form>

      <div className="header-actions">
        <button
          className={`header-chip ${soundsOpen ? 'is-active' : ''}`}
          onClick={() => setSoundsOpen(!soundsOpen)}
        >
          <Volume2 size={14} />
          <span>Sounds</span>
        </button>
        <button className="header-chip" onClick={() => setLoginOpen(true)}>
          {authUser ? (
            <>
              {avatarUrl ? (
                <img src={avatarUrl} alt={userName} className="header-avatar" />
              ) : (
                <UserRound size={14} />
              )}
              <span>{userName}</span>
            </>
          ) : (
            <>
              <LogIn size={14} />
              <span>Login</span>
            </>
          )}
        </button>
      </div>
    </header>
  )
}
