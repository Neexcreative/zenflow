import { useEffect, useMemo, useState } from 'react'
import useZenflowStore from '../../store/useZenflowStore'
import { getBackgroundById } from '../../data/backgrounds'

/**
 * Layering, back to front: scene gradient → optional media → YouTube glow → dim scrim → grain.
 * Media that fails to load leaves the scene's gradient in place rather than resetting the choice.
 */
export default function SceneBackground() {
  const { videoId, isPlaying, backgroundVisible, selectedBackgroundId, canvasDim } = useZenflowStore()
  const [mediaReady, setMediaReady] = useState(false)
  const [mediaFailed, setMediaFailed] = useState(false)

  const scene = useMemo(() => getBackgroundById(selectedBackgroundId), [selectedBackgroundId])

  useEffect(() => {
    setMediaReady(false)
    setMediaFailed(false)
  }, [scene.assetUrl])

  const showMedia = scene.type !== 'gradient' && scene.assetUrl && !mediaFailed
  const mediaClass = `scene__media ${mediaReady ? 'is-ready' : ''}`

  return (
    <div className="scene" aria-hidden="true">
      <div className="scene__layer" data-scene={scene.fallbackTheme || 'default'} />

      {showMedia && scene.type === 'video' ? (
        <video
          key={scene.assetUrl}
          className={mediaClass}
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={() => setMediaReady(true)}
          onError={() => setMediaFailed(true)}
        >
          <source src={scene.assetUrl} />
        </video>
      ) : null}

      {showMedia && scene.type === 'image' ? (
        <img
          key={scene.assetUrl}
          className={mediaClass}
          src={scene.assetUrl}
          alt=""
          onLoad={() => setMediaReady(true)}
          onError={() => setMediaFailed(true)}
        />
      ) : null}

      {videoId && backgroundVisible ? (
        <div
          className="scene__video-glow"
          style={{
            backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`,
            opacity: isPlaying ? 0.55 : 0.2,
          }}
        />
      ) : null}

      <div className="scene__scrim" style={{ '--scene-dim': canvasDim }} />
      <div className="scene__grain" />

      {videoId ? (
        <iframe
          className="scene__youtube-player"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&enablejsapi=1`}
          allow="autoplay; encrypted-media"
          title="Zenflow music player"
          tabIndex={-1}
        />
      ) : null}
    </div>
  )
}
