import { useEffect, useRef, useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import useZenflowStore from '../../store/useZenflowStore'
import ToolPanel from '../ui/ToolPanel'

export default function NotesPanel({ onClose }) {
  const { notes, setNotes, clearNotes } = useZenflowStore()
  const [expanded, setExpanded] = useState(false)
  const [confirmingClear, setConfirmingClear] = useState(false)
  const [settled, setSettled] = useState(true)
  const textareaRef = useRef(null)
  const lastNotesRef = useRef(notes)

  // Notes persist on every keystroke; "Saving…" just acknowledges typing in progress.
  useEffect(() => {
    if (notes === lastNotesRef.current) return undefined
    lastNotesRef.current = notes
    setSettled(false)
    const timeoutId = window.setTimeout(() => setSettled(true), 700)
    return () => window.clearTimeout(timeoutId)
  }, [notes])

  useEffect(() => {
    const node = textareaRef.current
    if (!node) return
    node.focus({ preventScroll: true })
    node.setSelectionRange(node.value.length, node.value.length)
  }, [])

  const words = notes.trim() ? notes.trim().split(/\s+/).length : 0

  return (
    <ToolPanel
      id="notes"
      title="Notes"
      placement="left"
      size={expanded ? 'xl' : 'md'}
      onClose={onClose}
      bodyClassName="notes-body"
      actions={
        <button
          type="button"
          className="icon-btn"
          onClick={() => setExpanded((value) => !value)}
          aria-pressed={expanded}
          aria-label={expanded ? 'Shrink notes' : 'Expand notes'}
        >
          {expanded ? <Minimize2 size={15} aria-hidden="true" /> : <Maximize2 size={15} aria-hidden="true" />}
        </button>
      }
      footer={
        <>
          <span className="meta-text" aria-live="polite">
            {words} {words === 1 ? 'word' : 'words'} · {settled ? 'Saved' : 'Saving…'}
          </span>
          {notes ? (
            confirmingClear ? (
              <span className="inline-actions">
                <button
                  type="button"
                  className="text-btn text-btn--danger"
                  onClick={() => {
                    clearNotes()
                    setConfirmingClear(false)
                  }}
                >
                  Clear all notes
                </button>
                <button type="button" className="text-btn" onClick={() => setConfirmingClear(false)}>
                  Keep
                </button>
              </span>
            ) : (
              <button type="button" className="text-btn" onClick={() => setConfirmingClear(true)}>
                Clear
              </button>
            )
          ) : null}
        </>
      }
    >
      <textarea
        ref={textareaRef}
        className="notes-area"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="A thought, a blocker, the next step. Everything saves as you type."
        aria-label="Notes"
      />
    </ToolPanel>
  )
}
