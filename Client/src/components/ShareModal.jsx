import { useState } from 'react'
import { Gift, Link2, Share2 } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'
import ModalShell from './ModalShell'

export default function ShareModal() {
  const { setShareOpen } = useZenflowStore()
  const [feedback, setFeedback] = useState('')
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
      text: 'Share Zenflow with someone who wants a calmer focus routine.',
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
    <ModalShell
      title="Share Zenflow"
      description="Invite someone into the same calm, focused workflow."
      onClose={close}
      className="feature-modal-card share-modal-card"
    >
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
    </ModalShell>
  )
}
