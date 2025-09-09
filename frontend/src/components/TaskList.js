import React from 'react';
import './TaskList.css';
import EditIcon from '../assets/icons/edit.svg';
import TrashIcon from '../assets/icons/trash.svg';
import CheckIcon from '../assets/icons/check.svg';
import CircleIcon from '../assets/icons/circle.svg';

const TaskList = ({ tasks, onToggleTask, onDeleteTask, onEditTask, onTaskSelect }) => {
  // Ensure tasks is always an array
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  
  if (safeTasks.length === 0) {
    return <div className="no-tasks">No tasks found. Try adjusting your filters or add a new task!</div>;
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#4CAF50',
      medium: '#FF9800',
      high: '#FF5722',
      urgent: '#F44336'
    };
    return colors[priority] || '#666';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      work: '💼',
      personal: '👤',
      shopping: '🛒',
      health: '🏥',
      education: '📚',
      other: '📝'
    };
    return icons[category] || '📝';
  };

  const isOverdue = (dueDate, isDone) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !isDone;
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  return (
    <div className="task-list">
      <h2 className="task-list-title">Your Tasks ({safeTasks.length})</h2>
      {safeTasks.map(task => (
        <div 
          key={task.id} 
          className={`task-item ${task.is_done ? 'completed' : ''} ${task.selected ? 'selected' : ''}`}
        >
          <div className="task-checkbox">
            <input
              type="checkbox"
              checked={task.selected || false}
              onChange={(e) => onTaskSelect(task.id, e.target.checked)}
            />
          </div>
          
          <div className="task-content">
            <div className="task-header">
              <span className={`task-title ${task.is_done ? 'done' : ''}`}>
                {task.title}
              </span>
              <div className="task-badges">
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                  {task.priority}
                </span>
                <span className="category-badge">
                  {getCategoryIcon(task.category)} {task.category}
                </span>
              </div>
            </div>
            
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            
            <div className="task-meta">
              <small className="task-date">
                Created: {new Date(task.created_at).toLocaleDateString()}
              </small>
              {task.due_date && (
                <small className={`due-date ${isOverdue(task.due_date, task.is_done) ? 'overdue' : ''}`}>
                  Due: {formatDueDate(task.due_date)}
                </small>
              )}
            </div>
          </div>
          
          <div className="task-actions">
            <button
              onClick={() => onEditTask(task)}
              className="edit-button"
              title="Edit task"
            >
              <img src={EditIcon} alt="Edit" width="16" height="16" />
            </button>
            <button
              onClick={() => onToggleTask(task.id)}
              className={`toggle-button ${task.is_done ? 'mark-undone' : 'mark-done'}`}
              title={task.is_done ? 'Mark as pending' : 'Mark as done'}
            >
              <img src={task.is_done ? CheckIcon : CircleIcon} alt={task.is_done ? 'Done' : 'Pending'} width="16" height="16" />
            </button>
            <button
              onClick={() => onDeleteTask(task.id)}
              className="delete-button"
              title="Delete task"
            >
              <img src={TrashIcon} alt="Delete" width="16" height="16" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;