import { Pause, Play, SkipBack, SkipForward } from 'lucide-react'
import useZenflowStore from '../../store/useZenflowStore'
import WidgetCard from '../WidgetCard'

export default function VinylWidget() {
  const { isPlaying, videoId, currentVideoUrl, setIsPlaying } = useZenflowStore()
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null

  return (
    <WidgetCard title="Sound Atmosphere">
      <div className="vinyl-widget">
        <div className={`vinyl-disc ${isPlaying ? 'is-playing' : ''}`}>
          <svg width="90" height="90" viewBox="0 0 90 90" aria-hidden="true">
            <defs>
              <radialGradient id="vinylCenter">
                <stop offset="0%" stopColor="#9d98ff" />
                <stop offset="100%" stopColor="#6C63FF" />
              </radialGradient>
              <clipPath id="thumbClip">
                <circle cx="45" cy="45" r="14" />
              </clipPath>
            </defs>
            <circle cx="45" cy="45" r="44" fill="#0D0D18" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            {[38, 33, 28, 23, 18].map((radius) => (
              <circle
                key={radius}
                cx="45"
                cy="45"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="0.8"
              />
            ))}
            {thumbnail ? (
              <image href={thumbnail} x="31" y="31" width="28" height="28" clipPath="url(#thumbClip)" />
            ) : (
              <circle cx="45" cy="45" r="14" fill="url(#vinylCenter)" />
            )}
            <circle cx="45" cy="45" r="2.5" fill="rgba(255,255,255,0.5)" />
            <ellipse cx="35" cy="30" rx="12" ry="7" fill="rgba(255,255,255,0.04)" transform="rotate(-30 35 30)" />
          </svg>
        </div>

        <div className="vinyl-copy">
          <div className="vinyl-state">{isPlaying ? 'Now playing...' : 'Ready to play'}</div>
          <div className="vinyl-title">
            {videoId ? 'YouTube Atmosphere' : 'Add a video to build your own sound mood'}
          </div>
          <div className="vinyl-channel">
            {currentVideoUrl || 'Paste a video link in the header to start your custom ambience.'}
          </div>

          <div className="vinyl-controls">
            <button className="btn-ghost" aria-label="Previous track">
              <SkipBack size={16} />
            </button>
            <button
              className="vinyl-play-button"
              onClick={() => videoId && setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause track' : 'Play track'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: 2 }} />}
            </button>
            <button className="btn-ghost" aria-label="Next track">
              <SkipForward size={16} />
            </button>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            defaultValue={isPlaying ? 72 : 0}
            className="vinyl-slider"
            aria-label="Mood intensity"
          />
        </div>
      </div>
    </WidgetCard>
  )
}
