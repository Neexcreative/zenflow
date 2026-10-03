import { Headphones, Image as ImageIcon, ListChecks, Maximize2, Minimize2, NotebookPen, Settings2 } from 'lucide-react'
import useZenflowStore from '../../store/useZenflowStore'
import { fullscreenSupported, toggleFullscreen } from '../../lib/fullscreen'
import FocusQuote from './FocusQuote'

function DockButton({ id, label, shortcut, icon: Icon, active, onClick, indicator, controls, status }) {
  return (
    <button
      type="button"
      className="dock-btn"
      data-tool-trigger={id}
      aria-pressed={active}
      aria-controls={controls}
      aria-label={status ? `${label}, ${status}` : label}
      title={shortcut ? `${label} (${shortcut})` : label}
      onClick={onClick}
    >
      <Icon size={18} aria-hidden="true" />
      <span className="dock-btn__label">{label}</span>
      {indicator}
    </button>
  )
}

export default function FocusDock() {
  const { activeTool, toggleTool, tasks, ambientPlaying, isPlaying, isFullscreen, showQuote } = useZenflowStore()
  const openTasks = tasks.filter((task) => !task.completed && task.text.trim()).length
  const soundLive = ambientPlaying || isPlaying

  const tool = (id, label, shortcut, icon, indicator, status) => (
    <DockButton
      id={id}
      label={label}
      shortcut={shortcut}
      icon={icon}
      active={activeTool === id}
      controls={activeTool === id ? `${id}-panel` : undefined}
      onClick={() => toggleTool(id)}
      indicator={indicator}
      status={status}
    />
  )

  return (
    <footer className="focus-bottom">
      <div className="dock chrome" role="toolbar" aria-label="Focus tools" data-dock>
        {tool(
          'tasks',
          'Tasks',
          'T',
          ListChecks,
          openTasks ? <span className="dock-btn__count">{openTasks}</span> : null,
          openTasks ? `${openTasks} open` : null
        )}
        {tool(
          'sounds',
          'Sounds',
          'S',
          Headphones,
          soundLive ? <span className="dock-btn__live" /> : null,
          soundLive ? 'playing' : null
        )}
        {tool('notes', 'Notes', 'N', NotebookPen)}
      </div>

      <div className="focus-bottom__center chrome">{showQuote ? <FocusQuote /> : null}</div>

      <div className="dock chrome" role="toolbar" aria-label="Canvas" data-dock>
        {tool('background', 'Scenes', 'B', ImageIcon)}
        {tool('settings', 'Settings', null, Settings2)}
        {fullscreenSupported ? (
          <DockButton
            id="fullscreen"
            label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            shortcut="F"
            icon={isFullscreen ? Minimize2 : Maximize2}
            active={isFullscreen}
            onClick={toggleFullscreen}
          />
        ) : null}
      </div>
    </footer>
  )
}
