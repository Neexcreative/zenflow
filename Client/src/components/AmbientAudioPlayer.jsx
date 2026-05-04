import { useEffect, useRef } from 'react'
import useZenflowStore from '../store/useZenflowStore'
import { AMBIENT_SOUNDS } from '../data/sounds'

export default function AmbientAudioPlayer() {
  const audioRef = useRef(null)
  const warnedSourcesRef = useRef(new Set())
  const { selectedSoundId, ambientPlaying, ambientVolume, isPremiumUser, showToast, setAmbientPlaying } =
    useZenflowStore()

  useEffect(() => {
    const audio = new Audio()
    audio.loop = true
    audioRef.current = audio

    const onEnded = () => setAmbientPlaying(false)
    const onError = () => {
      if (!audio.src) return
      const source = audio.src
      if (!warnedSourcesRef.current.has(source)) {
        warnedSourcesRef.current.add(source)
        console.warn(`Ambient audio file is missing or failed to load: ${source}`)
        const filename = source.split('/').pop() || 'selected audio file'
        showToast(`Missing audio file: ${filename}`)
      }
      setAmbientPlaying(false)
    }

    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.pause()
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audioRef.current = null
    }
  }, [setAmbientPlaying, showToast])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = ambientVolume
  }, [ambientVolume])

  useEffect(() => {
    const sound = AMBIENT_SOUNDS.find((item) => item.id === selectedSoundId)
    const audio = audioRef.current

    if (!audio) return

    if (!sound) {
      audio.pause()
      audio.currentTime = 0
      audio.removeAttribute('src')
      return
    }

    if (sound.plus && !isPremiumUser) {
      audio.pause()
      setAmbientPlaying(false)
      showToast('This sound is available for Plus users.')
      return
    }

    if (!ambientPlaying) {
      audio.pause()
      return
    }

    if (!audio.src || !audio.src.endsWith(sound.src)) {
      audio.pause()
      audio.src = sound.src
      audio.currentTime = 0
      audio.load()
    }

    audio.play().catch(() => {
      console.warn(`Ambient audio could not start automatically for ${sound.src}`)
      showToast('Press play again if your browser blocked audio autoplay.')
    })
  }, [selectedSoundId, ambientPlaying, isPremiumUser, showToast, setAmbientPlaying])

  return null
}
