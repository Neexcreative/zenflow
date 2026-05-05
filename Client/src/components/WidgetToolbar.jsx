import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, FileText, Cloud, Clock, Disc3, Quote, Settings, Sparkles } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'

const WIDGETS = [
  { id: 'pomodoro', label: 'Timer', icon: Timer },
  { id: 'clock', label: 'Clock', icon: Clock },
  { id: 'weather', label: 'Weather', icon: Cloud },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'vinyl', label: 'Music', icon: Disc3 },
  { id: 'quote', label: 'Quote', icon: Quote },
]

export default function WidgetToolbar() {
  const { activeWidgets, toggleWidget, setSettingsOpen, setUpgradeOpen } = useZenflowStore()
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.aside
      className="sidebar-shell"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <motion.div
        animate={{ width: expanded ? 220 : 72 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="sidebar-panel"
      >
        <div className="sidebar-logo-wrap">
          <div className="sidebar-logo">Z</div>
          <AnimatePresence>
            {expanded ? (
              <motion.div
                className="sidebar-brand-copy"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
              >
                <strong>Zenflow</strong>
                <span>Workspace layout</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="sidebar-section-label">{expanded ? 'Visible widgets' : ''}</div>
        <div className="sidebar-items">
          {WIDGETS.map(({ id, label, icon: Icon }) => {
            const active = activeWidgets.includes(id)

            return (
              <button
                key={id}
                onClick={() => toggleWidget(id)}
                title={!expanded ? label : undefined}
                className={`sidebar-item ${active ? 'is-active' : ''}`}
              >
                <Icon size={17} className="shrink-0" />
                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.16 }}
                      className="sidebar-label"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </div>

        <div className="sidebar-bottom">
          <button onClick={() => setUpgradeOpen(true)} className="sidebar-item is-upgrade">
            <Sparkles size={17} className="shrink-0" />
            {expanded && <span className="sidebar-label">Upgrade</span>}
          </button>

          <button onClick={() => setSettingsOpen(true)} className="sidebar-item">
            <Settings size={17} className="shrink-0" />
            {expanded && <span className="sidebar-label">Settings</span>}
          </button>
        </div>
      </motion.div>
    </motion.aside>
  )
}
