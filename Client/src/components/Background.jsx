import useZenflowStore from '../store/useZenflowStore'

export default function Background() {
  const { videoId, isPlaying, backgroundVisible } = useZenflowStore()

  return (
    <>
      <div className="ambient-mesh" aria-hidden="true" />

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
