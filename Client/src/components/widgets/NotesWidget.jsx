import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Maximize2, Minimize2 } from 'lucide-react'
import useZenflowStore from '../../store/useZenflowStore'
import WidgetCard from '../WidgetCard'

export default function NotesWidget() {
  const { notes, setNotes } = useZenflowStore()
  const [expanded, setExpanded] = useState(false)
  const [savedVisible, setSavedVisible] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSavedVisible(Boolean(notes))
    }, 800)

    return () => window.clearTimeout(timeoutId)
  }, [notes])

  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0

  const editor = (
    <>
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Capture a thought, blocker, or next step..."
        spellCheck={false}
        className="notes-textarea"
        style={{ minHeight: expanded ? '60vh' : '180px' }}
      />

      <div className="notes-footer">
        <AnimatePresence>
          {savedVisible && (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="notes-saved"
            >
              Saved
            </motion.span>
          )}
        </AnimatePresence>
        <span>{notes.length} chars</span>
      </div>
    </>
  )

  return (
    <>
      <WidgetCard
        title="Notes"
        className={expanded ? 'notes-card-expanded' : ''}
        headerRight={
          <div className="notes-header-right">
            <span>{wordCount} words</span>
            <button onClick={() => setExpanded(true)} className="icon-button" title="Expand notes">
              <Maximize2 size={14} />
            </button>
          </div>
        }
      >
        {editor}
      </WidgetCard>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="notes-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(false)}
          >
            <motion.div
              className="notes-modal-card modal-shell-card"
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="notes-modal-header">
                <div>
                  <span className="eyebrow-label">Zenflow</span>
                  <div className="widget-card-title">Notes</div>
                  <p>Expanded space for deeper thinking and planning.</p>
                </div>
                <button onClick={() => setExpanded(false)} className="icon-button" title="Minimize notes">
                  <Minimize2 size={15} />
                </button>
              </div>
              {editor}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
