import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useZenflowStore from '../store/useZenflowStore'

export default function ToastMessage() {
  const { toast, clearToast } = useZenflowStore()

  useEffect(() => {
    if (!toast) return undefined
    const timeoutId = window.setTimeout(() => clearToast(), 2600)
    return () => window.clearTimeout(timeoutId)
  }, [toast, clearToast])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          className="toast-message"
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
