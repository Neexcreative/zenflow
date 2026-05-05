import { useRef } from 'react'
import { Check, GripVertical, Plus, SquarePen, Trash2, X } from 'lucide-react'
import useZenflowStore from '../store/useZenflowStore'

export default function NotesTasksPanel() {
  const {
    notes,
    setNotes,
    clearNotes,
    tasks,
    addTask,
    updateTask,
    toggleTaskCompleted,
    removeTask,
    productivityTab,
    setProductivityTab,
    setNotesTasksOpen,
    showToast,
  } = useZenflowStore()
  const inputRefs = useRef({})

  return (
    <aside className="side-panel productivity-panel">
      <div className="panel-head">
        <div>
          <span className="eyebrow-label">Productivity desk</span>
          <h3>Notes and tasks</h3>
          <p>Keep ideas, next actions, and momentum close to the timer.</p>
        </div>
        <button className="icon-button" onClick={() => setNotesTasksOpen(false)} aria-label="Close productivity panel">
          <X size={16} />
        </button>
      </div>

      <div className="panel-tabs">
        {['notes', 'tasks'].map((item) => (
          <button
            key={item}
            className={`panel-tab ${productivityTab === item ? 'is-active' : ''}`}
            onClick={() => setProductivityTab(item)}
          >
            {item === 'notes' ? 'Notes' : 'Tasks'}
          </button>
        ))}
      </div>

      {productivityTab === 'notes' ? (
        <div className="panel-section">
          <div className="desk-note-card">
            <div className="desk-card-head">
              <div>
                <h4>Session notes</h4>
                <p>Capture thoughts, blockers, and ideas while you stay in flow.</p>
              </div>
              {notes ? <span className="tiny-status-pill">Saved</span> : null}
            </div>

            <textarea
              className="panel-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Write your notes here..."
            />

            <div className="panel-row-between">
              <span className="subtle-meta">{notes.length} characters</span>
              <button className="secondary-pill" onClick={clearNotes}>
                Clear Notes
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="panel-section">
          <div className="tasks-card">
            <div className="tasks-card-head">
              <div>
                <h4>Tasks</h4>
                <p>Turn the next few priorities into something concrete.</p>
              </div>
              <button className="primary-pill compact-pill" onClick={() => addTask('')}>
                <Plus size={14} />
                <span>Add Task</span>
              </button>
            </div>

            <div className="task-list">
              {tasks.map((task) => (
                <div key={task.id} className={`task-row ${task.completed ? 'is-complete' : ''}`}>
                  <button
                    className="task-icon-button drag-button"
                    title="Task reordering is coming next"
                    type="button"
                    onClick={() => showToast('Task reordering is not connected yet.')}
                  >
                    <GripVertical size={14} />
                  </button>

                  <button
                    className={`task-icon-button ${task.completed ? 'is-complete' : ''}`}
                    onClick={() => toggleTaskCompleted(task.id)}
                    type="button"
                    title="Mark complete"
                  >
                    <Check size={14} />
                  </button>

                  <input
                    ref={(node) => {
                      inputRefs.current[task.id] = node
                    }}
                    value={task.text}
                    onChange={(event) => updateTask(task.id, event.target.value)}
                    placeholder="Type your priority"
                  />

                  <button
                    className="task-icon-button"
                    type="button"
                    title="Focus task field"
                    onClick={() => inputRefs.current[task.id]?.focus()}
                  >
                    <SquarePen size={14} />
                  </button>

                  <button
                    className="task-icon-button"
                    onClick={() => removeTask(task.id)}
                    type="button"
                    title="Remove task"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {tasks.length < 3 &&
                Array.from({ length: 3 - tasks.length }).map((_, index) => (
                  <div key={`empty-${index}`} className="task-row is-empty-slot">
                    <button
                      className="task-icon-button drag-button"
                      type="button"
                      title="Task reordering is coming next"
                      onClick={() => showToast('Task reordering is not connected yet.')}
                    >
                      <GripVertical size={14} />
                    </button>
                    <button className="task-icon-button" type="button" title="Empty slot">
                      <Check size={14} />
                    </button>
                    <input value="" readOnly placeholder="Type your priority" />
                    <button className="task-icon-button" type="button" title="Focus task field">
                      <SquarePen size={14} />
                    </button>
                  </div>
                ))}
            </div>

            <div className="plus-promo">
              <span className="plus-badge">Plus preview</span>
              <p>Infinite tasks, smarter prioritization, and richer organization are planned next.</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
