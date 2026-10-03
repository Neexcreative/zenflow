let audioContext = null

// A soft two-note bell for session changes. Synthesised, so it needs no asset.
export function playChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return

    audioContext ||= new AudioContextClass()
    if (audioContext.state === 'suspended') audioContext.resume()

    const start = audioContext.currentTime
    ;[
      [659.25, 0],
      [987.77, 0.22],
    ].forEach(([frequency, offset]) => {
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()
      const at = start + offset

      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0, at)
      gain.gain.linearRampToValueAtTime(0.11, at + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.6)

      oscillator.connect(gain)
      gain.connect(audioContext.destination)
      oscillator.start(at)
      oscillator.stop(at + 1.7)
    })
  } catch {
    // Audio is a nicety; never let it break the timer.
  }
}
