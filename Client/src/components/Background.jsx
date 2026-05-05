import { useEffect, useMemo, useState } from 'react'
import useZenflowStore from '../store/useZenflowStore'
import { DEFAULT_BACKGROUND_ID, getBackgroundById } from '../data/backgrounds'

export default function Background() {
  const {
    videoId,
    isPlaying,
    backgroundVisible,
    selectedBackgroundId,
    setSelectedBackgroundId,
    setBackgroundTheme,
  } = useZenflowStore()
  const [assetReady, setAssetReady] = useState(false)
  const [assetFailed, setAssetFailed] = useState(false)

  const selectedBackground = useMemo(
    () => getBackgroundById(selectedBackgroundId || DEFAULT_BACKGROUND_ID),
    [selectedBackgroundId]
  )

  useEffect(() => {
    if (!selectedBackground?.assetUrl) {
      setAssetReady(false)
      setAssetFailed(false)
      return
    }

    setAssetReady(false)
    setAssetFailed(false)
  }, [selectedBackground?.assetUrl])

  useEffect(() => {
    if (assetFailed && selectedBackgroundId !== DEFAULT_BACKGROUND_ID) {
      setSelectedBackgroundId(DEFAULT_BACKGROUND_ID)
      setBackgroundTheme('default')
    }
  }, [assetFailed, selectedBackgroundId, setBackgroundTheme, setSelectedBackgroundId])

  return (
    <>
      <div className="ambient-mesh" aria-hidden="true" />

      {selectedBackground?.assetUrl && !assetFailed ? (
        <>
          {selectedBackground.type === 'video' ? (
            <video
              key={selectedBackground.assetUrl}
              className={`background-media-layer ${assetReady ? 'is-ready' : ''}`}
              autoPlay
              muted
              loop
              playsInline
              onCanPlay={() => setAssetReady(true)}
              onError={() => setAssetFailed(true)}
            >
              <source src={selectedBackground.assetUrl} />
            </video>
          ) : (
            <img
              key={selectedBackground.assetUrl}
              className={`background-media-layer ${assetReady ? 'is-ready' : ''}`}
              src={selectedBackground.assetUrl}
              alt=""
              onLoad={() => setAssetReady(true)}
              onError={() => setAssetFailed(true)}
            />
          )}
        </>
      ) : null}

      {videoId && backgroundVisible && (
        <div
          className="ambient-video-glow"
          aria-hidden="true"
          style={{
            backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`,
            opacity: isPlaying ? 0.95 : 0.35,
          }}
        />
      )}

      <div className="noise-overlay" aria-hidden="true" />

      {videoId && (
        <iframe
          className="ambient-player"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&loop=1&playlist=${videoId}&controls=0&enablejsapi=1`}
          allow="autoplay; encrypted-media"
          title="zenflow-audio"
        />
      )}
    </>
  )
}
