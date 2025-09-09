import React from 'react';
import './TaskList.css';

const TaskList = ({ tasks, onToggleTask }) => {
  if (tasks.length === 0) {
    return <div className="no-tasks">No tasks yet. Add one above!</div>;
  }

  return (
    <div className="task-list">
      <h2 className="task-list-title">Your Tasks ({tasks.length})</h2>
      {tasks.map(task => (
        <div key={task.id} className={`task-item ${task.is_done ? 'completed' : ''}`}>
          <div className="task-content">
            <span className={`task-title ${task.is_done ? 'done' : ''}`}>
              {task.title}
            </span>
            <small className="task-date">
              Created: {new Date(task.created_at).toLocaleDateString()}
            </small>
          </div>
          <button
            onClick={() => onToggleTask(task.id)}
            className={`toggle-button ${task.is_done ? 'mark-undone' : 'mark-done'}`}
          >
            {task.is_done ? 'Mark Undone' : 'Mark Done'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;