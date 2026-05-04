import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'

export default function SoundToggle() {
  const clickSoundEnabled = useZenflowStore((state) => state.clickSoundEnabled)
  const toggleClickSound = useZenflowStore((state) => state.toggleClickSound)

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      <motion.button
        onClick={toggleClickSound}
        title={`Click sound: ${clickSoundEnabled ? 'On' : 'Off'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${clickSoundEnabled ? 'rgba(0,212,170,0.3)' : 'rgba(255,255,255,0.07)'}`,
          color: clickSoundEnabled ? '#00D4AA' : 'rgba(255,255,255,0.25)',
        }}
      >
        {clickSoundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
      </motion.button>
    </div>
  )
}
