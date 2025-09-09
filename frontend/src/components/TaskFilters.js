import React from 'react';
import './TaskFilters.css';

const TaskFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="task-filters">
      <h3>Filters</h3>
      
      <div className="filter-group">
        <label htmlFor="search">Search</label>
        <input
          type="text"
          id="search"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search tasks..."
        />
      </div>

      <div className="filter-group">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          value={filters.priority}
          onChange={handleChange}
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="">All Categories</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
          <option value="health">Health</option>
          <option value="education">Education</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="is_done">Status</label>
        <select
          id="is_done"
          name="is_done"
          value={filters.is_done}
          onChange={handleChange}
        >
          <option value="">All Tasks</option>
          <option value="false">Pending</option>
          <option value="true">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="due_filter">Due Date</label>
        <select
          id="due_filter"
          name="due_filter"
          value={filters.due_filter}
          onChange={handleChange}
        >
          <option value="">All Dates</option>
          <option value="overdue">Overdue</option>
          <option value="today">Today</option>
          <option value="this_week">This Week</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button 
          className="clear-filters-button"
          onClick={onClearFilters}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default TaskFilters;
