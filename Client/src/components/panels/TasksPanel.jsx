import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import useZenflowStore from '../../store/useZenflowStore'
import ToolPanel from '../ui/ToolPanel'

function TaskRow({ task, onToggle, onChange, onRemove }) {
  const name = task.text.trim() || 'Untitled task'

  return (
    <li className={`task-row ${task.completed ? 'is-done' : ''}`}>
      <input
        type="checkbox"
        className="task-row__check"
        checked={task.completed}
        onChange={onToggle}
        aria-label={name}
      />
      <input
        className="task-row__text"
        value={task.text}
        onChange={(event) => onChange(event.target.value)}
        onBlur={() => {
          if (!task.text.trim()) onRemove()
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur()
        }}
        aria-label={`Edit task: ${name}`}
        maxLength={200}
      />
      <button type="button" className="icon-btn icon-btn--quiet task-row__remove" onClick={onRemove} aria-label={`Delete ${name}`}>
        <X size={14} aria-hidden="true" />
      </button>
    </li>
  )
}

export default function TasksPanel({ onClose }) {
  const { tasks, addTask, updateTask, toggleTaskCompleted, removeTask, clearCompletedTasks } = useZenflowStore()
  const [draft, setDraft] = useState('')

  const openCount = tasks.filter((task) => !task.completed).length
  const doneCount = tasks.length - openCount

  const handleSubmit = (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    addTask(text)
    setDraft('')
  }

  return (
    <ToolPanel
      id="tasks"
      title="Tasks"
      placement="left"
      onClose={onClose}
      footer={
        tasks.length ? (
          <>
            <span className="meta-text">
              {openCount ? `${openCount} open` : 'All done'}
              {doneCount ? ` · ${doneCount} done` : ''}
            </span>
            {doneCount ? (
              <button type="button" className="text-btn" onClick={clearCompletedTasks}>
                Clear completed
              </button>
            ) : null}
          </>
        ) : null
      }
    >
      {tasks.length ? (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={() => toggleTaskCompleted(task.id)}
              onChange={(text) => updateTask(task.id, text)}
              onRemove={() => removeTask(task.id)}
            />
          ))}
        </ul>
      ) : (
        <p className="empty-note">What is this session for? Add one task and keep it in view.</p>
      )}

      <form className="task-entry" onSubmit={handleSubmit}>
        <Plus size={16} aria-hidden="true" className="task-entry__icon" />
        <input
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Add a task"
          aria-label="New task"
          enterKeyHint="done"
          maxLength={200}
        />
      </form>
    </ToolPanel>
  )
}
