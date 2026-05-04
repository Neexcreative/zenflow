import { FileCheck2, FileText, Flame, Fullscreen, Gift, Home, LogIn, Palette, Settings, Shrink, Timer } from 'lucide-react'
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
    setSettingsOpen,
    setLoginOpen,
    setBackgroundSwitcherOpen,
    isFullscreen,
    setIsFullscreen,
  } = useZenflowStore()

  const items = [
    { id: 'streak', label: '🔥 0', icon: Flame, onClick: () => {}, passive: true, staticLabel: true },
    { id: 'home', label: 'Home', icon: Home, onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { id: 'focus', label: 'Focus', icon: Timer, onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }), active: true },
    { id: 'share', label: 'Share', icon: Gift, onClick: () => setShareOpen(true) },
    {
      id: 'notes',
      label: 'Notes',
      icon: FileText,
      onClick: () => openProductivityPanel('notes'),
      active: notesTasksOpen && productivityTab === 'notes',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: FileCheck2,
      onClick: () => openProductivityPanel('tasks'),
      active: notesTasksOpen && productivityTab === 'tasks',
    },
    { id: 'background', label: 'Background', icon: Palette, onClick: () => setBackgroundSwitcherOpen(true) },
    { id: 'settings', label: 'Settings', icon: Settings, onClick: () => setSettingsOpen(true) },
    {
      id: 'fullscreen',
      label: 'Fullscreen',
      icon: isFullscreen ? Shrink : Fullscreen,
      onClick: () => toggleFullscreen(setIsFullscreen, isFullscreen),
      active: isFullscreen,
    },
    { id: 'login', label: 'Login', icon: LogIn, onClick: () => setLoginOpen(true) },
  ]

  return (
    <nav className="bottom-nav">
      {items.map(({ id, label, icon: Icon, onClick, active, passive, staticLabel }) => (
        <button
          key={id}
          className={`bottom-nav-item ${active ? 'is-active' : ''} ${passive ? 'is-passive' : ''}`}
          onClick={onClick}
          title={id === 'streak' ? `🔥 ${pomodoroSessions || 0}` : label}
        >
          <Icon size={16} />
          <span>{staticLabel ? `🔥 ${pomodoroSessions || 0}` : label}</span>
        </button>
      ))}
    </nav>
  )
}
