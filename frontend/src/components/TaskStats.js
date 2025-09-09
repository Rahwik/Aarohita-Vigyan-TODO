import React from 'react';
import './TaskStats.css';

const TaskStats = ({ stats }) => {
  if (!stats) {
    return (
      <div className="task-stats">
        <h3>Statistics</h3>
        <div className="loading">Loading stats...</div>
      </div>
    );
  }

  const { 
    total_tasks, 
    completed_tasks, 
    pending_tasks, 
    completion_rate, 
    overdue_tasks,
    priority_stats,
    category_stats 
  } = stats;

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

  return (
    <div className="task-stats">
      <h3>Statistics</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{total_tasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{completed_tasks}</div>
          <div className="stat-label">Completed</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{pending_tasks}</div>
          <div className="stat-label">Pending</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{Math.round(completion_rate)}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
      </div>

      {overdue_tasks > 0 && (
        <div className="overdue-warning">
          <span className="warning-icon">⚠️</span>
          <span>{overdue_tasks} overdue task{overdue_tasks !== 1 ? 's' : ''}</span>
        </div>
      )}

      <div className="priority-breakdown">
        <h4>By Priority</h4>
        <div className="priority-list">
          {Object.entries(priority_stats).map(([priority, count]) => (
            <div key={priority} className="priority-item">
              <div 
                className="priority-dot" 
                style={{ backgroundColor: getPriorityColor(priority) }}
              ></div>
              <span className="priority-name">{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
              <span className="priority-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="category-breakdown">
        <h4>By Category</h4>
        <div className="category-list">
          {Object.entries(category_stats).map(([category, count]) => (
            <div key={category} className="category-item">
              <span className="category-icon">{getCategoryIcon(category)}</span>
              <span className="category-name">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              <span className="category-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskStats;
