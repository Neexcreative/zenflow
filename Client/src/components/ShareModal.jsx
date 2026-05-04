import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Link2, Share2, X } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'

export default function ShareModal() {
  const { setShareOpen } = useZenflowStore()
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setShareOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [setShareOpen])

  const close = () => setShareOpen(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setFeedback('Link copied')
    } catch {
      setFeedback('Could not copy the link')
    }
  }

  const shareLink = async () => {
    const data = {
      title: 'Zenflow',
      text: 'Love using Flocus? Share it with a friend and help them get more done!',
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(data)
        setFeedback('Shared successfully')
        return
      } catch {
        setFeedback('')
      }
    }

    await copyLink()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="overlay-modal"
      onClick={close}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 18 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="feature-modal-card share-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h2>Share Flocus with Friends</h2>
            <p>Love using Flocus? Share it with a friend and help them get more done!</p>
          </div>
          <button type="button" onClick={close} className="btn-ghost">
            <X size={16} />
          </button>
        </div>

        <div className="share-hero-icon">
          <Gift size={24} />
        </div>

        <div className="modal-actions">
          <button type="button" className="secondary-pill" onClick={copyLink}>
            <Link2 size={14} />
            <span>Copy Link</span>
          </button>
          <button type="button" className="primary-pill" onClick={shareLink}>
            <Share2 size={14} />
            <span>Share</span>
          </button>
        </div>

        {feedback && <p className="inline-feedback">{feedback}</p>}
      </motion.div>
    </motion.div>
  )
}
