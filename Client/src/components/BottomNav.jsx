import { FileCheck2, FileText, Flame, Fullscreen, Gift, Palette, Shrink } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'

async function toggleFullscreen(setIsFullscreen, isFullscreen) {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
      return
    }

    await document.exitFullscreen()
    setIsFullscreen(false)
  } catch {
    setIsFullscreen(isFullscreen)
  }
}

export default function BottomNav() {
  const {
    pomodoroSessions,
    setShareOpen,
    notesTasksOpen,
    productivityTab,
    openProductivityPanel,
    setBackgroundSwitcherOpen,
    isFullscreen,
    setIsFullscreen,
    showToast,
  } = useZenflowStore()

  const items = [
    {
      id: 'streak',
      label: 'Streak',
      shortLabel: `${pomodoroSessions || 0}`,
      icon: Flame,
      onClick: () => showToast(`You have completed ${pomodoroSessions || 0} focus sessions.`),
      passive: true,
    },
    {
      id: 'notes',
      label: 'Notes Desk',
      shortLabel: 'Notes',
      icon: FileText,
      onClick: () => openProductivityPanel('notes'),
      active: notesTasksOpen && productivityTab === 'notes',
    },
    {
      id: 'tasks',
      label: 'Tasks Desk',
      shortLabel: 'Tasks',
      icon: FileCheck2,
      onClick: () => openProductivityPanel('tasks'),
      active: notesTasksOpen && productivityTab === 'tasks',
    },
    {
      id: 'background',
      label: 'Background',
      shortLabel: 'Background',
      icon: Palette,
      onClick: () => setBackgroundSwitcherOpen(true),
    },
    {
      id: 'share',
      label: 'Share',
      shortLabel: 'Share',
      icon: Gift,
      onClick: () => setShareOpen(true),
    },
    {
      id: 'fullscreen',
      label: 'Fullscreen',
      shortLabel: isFullscreen ? 'Window' : 'Fullscreen',
      icon: isFullscreen ? Shrink : Fullscreen,
      onClick: () => toggleFullscreen(setIsFullscreen, isFullscreen),
      active: isFullscreen,
    },
  ]

  return (
    <nav className="bottom-nav" aria-label="Quick actions">
      {items.map(({ id, label, shortLabel, icon: Icon, onClick, active, passive }) => (
        <button
          key={id}
          className={`bottom-nav-item ${active ? 'is-active' : ''} ${passive ? 'is-passive' : ''}`}
          onClick={onClick}
          title={label}
        >
          <Icon size={16} />
          <span>{shortLabel}</span>
        </button>
      ))}
    </nav>
  )
}
