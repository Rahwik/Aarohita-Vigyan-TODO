import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import TaskStats from './components/TaskStats';
import PlusIcon from './assets/icons/plus.svg';
import ChartIcon from './assets/icons/chart.svg';
import TrashIcon from './assets/icons/trash.svg';
import CloseIcon from './assets/icons/close.svg';
import GitHubIcon from './assets/icons/github.svg';
import MailIcon from './assets/icons/mail.svg';
import NavBarIcon from './assets/icons/NavBar.png';

const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    priority: '',
    category: '',
    is_done: '',
    due_filter: ''
  });
  const [stats, setStats] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showStats, setShowStats] = useState(false);

  // Handle edit task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // Fetch tasks from API with filters
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await axios.get(`${API_BASE_URL}/tasks/?${params}`);
      // Handle paginated response - extract results array
      const tasksData = response.data.results || response.data;
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Make sure the Django server is running.');
      console.error('Error fetching tasks:', err);
      setTasks([]); // Ensure tasks is always an array
    } finally {
      setLoading(false);
    }
  };

  // Fetch task statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/stats/`);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Add new task
  const addTask = async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks/`, taskData);
      setTasks(prevTasks => [response.data, ...prevTasks]);
      setError(null);
      setShowTaskForm(false);
      fetchStats();
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error('Error adding task:', err);
    }
  };

  // Update task
  const updateTask = async (taskId, taskData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}/`, taskData);
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? response.data : task
      ));
      setError(null);
      setEditingTask(null);
      fetchStats();
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  // Toggle task completion
  const toggleTask = async (taskId) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/tasks/${taskId}/toggle/`);
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? response.data : task
      ));
      setError(null);
      fetchStats();
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}/`);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setError(null);
      fetchStats();
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  // Bulk delete tasks
  const bulkDeleteTasks = async (taskIds) => {
    try {
      await axios.post(`${API_BASE_URL}/tasks/bulk-delete/`, {
        task_ids: taskIds
      });
      setTasks(prevTasks => prevTasks.filter(task => !taskIds.includes(task.id)));
      setError(null);
      fetchStats();
    } catch (err) {
      setError('Failed to delete tasks. Please try again.');
      console.error('Error deleting tasks:', err);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      priority: '',
      category: '',
      is_done: '',
      due_filter: ''
    });
  };

  // Fetch tasks and stats on component mount and when filters change
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [filters]);


  return (
    <div className="min-h-screen w-full bg-black relative">
      {/* Dark White Dotted Grid Background */}
      <div className="dotted-bg"></div>
      
      {/* Header */}
      <header className="App-header">
        <div className="header-content">
          <div className="logo">
            <img src={NavBarIcon} alt="Logo" className="logo-image" />
            <h1 className="App-title">TaskCraft</h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="status-banner">
            <div className="status-indicator"></div>
            <span>Active Tasks</span>
            <span className="status-arrow">→</span>
          </div>
          
          <h1 className="hero-title">
            Manage Your
            <span className="hero-subtitle"> Daily Tasks</span>
          </h1>
          
          <p className="hero-description">
            Professional-grade task management with modern design. 
            Easily organize, track, and complete your daily tasks with intuitive controls.
          </p>
          
          <div className="hero-actions">
            <button 
              className="primary-button"
              onClick={() => setShowTaskForm(true)}
            >
              <span className="button-icon">
                <img src={PlusIcon} alt="Add" width="18" height="18" />
              </span>
              <div className="button-content">
                <span className="button-title">Add New Task</span>
                <span className="button-subtitle">Create and organize tasks</span>
              </div>
            </button>
            
            <button 
              className="secondary-button"
              onClick={() => {
                setShowStats(!showStats);
                // Scroll to stats section after a short delay to allow state update
                setTimeout(() => {
                  const statsElement = document.querySelector('.stats-view');
                  if (statsElement) {
                    statsElement.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }, 100);
              }}
            >
              <span className="button-icon">
                <img src={ChartIcon} alt="Stats" width="18" height="18" />
              </span>
              <div className="button-content">
                <span className="button-title">View Stats</span>
                <span className="button-subtitle">Track your progress</span>
              </div>
            </button>
            
            <a 
              className="secondary-button"
              href="https://github.com/Rahwik"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="button-icon">
                <img src={GitHubIcon} alt="GitHub" width="18" height="18" />
              </span>
              <div className="button-content">
                <span className="button-title">GitHub</span>
                <span className="button-subtitle">View source code</span>
              </div>
            </a>
            
            <a 
              className="secondary-button"
              href="mailto:rahul.3057.12@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="button-icon">
                <img src={MailIcon} alt="Contact" width="18" height="18" />
              </span>
              <div className="button-content">
                <span className="button-title">Contact</span>
                <span className="button-subtitle">Get in touch</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {error && <div className="error">{error}</div>}

        {showStats ? (
          <div className="stats-view">
            <div className="stats-container">
              <div className="stats-header">
                <h2>Task Statistics</h2>
                <button 
                  className="close-stats-button"
                  onClick={() => setShowStats(false)}
                >
                  <img src={CloseIcon} alt="Close" width="16" height="16" />
                </button>
              </div>
              <TaskStats stats={stats} />
            </div>
          </div>
        ) : (
          <div className="main-content">
            <div className="sidebar">
              <TaskStats stats={stats} />
              <TaskFilters 
                filters={filters} 
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>

            <div className="content">
              {Array.isArray(tasks) && tasks.length > 0 && (
                <div className="bulk-actions">
                  <button 
                    className="bulk-delete-button"
                    onClick={() => {
                      const selectedTasks = tasks.filter(task => task.selected);
                      if (selectedTasks.length > 0) {
                        bulkDeleteTasks(selectedTasks.map(task => task.id));
                      }
                    }}
                  >
                    <img src={TrashIcon} alt="Delete" width="16" height="16" style={{marginRight: '8px'}} />
                    Delete Selected ({tasks.filter(task => task.selected).length})
                  </button>
                </div>
              )}

              {showTaskForm && (
                <TaskForm
                  task={editingTask}
                  onSubmit={editingTask ? updateTask : addTask}
                  onCancel={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                  }}
                />
              )}

              {loading ? (
                <div className="loading">Loading tasks...</div>
              ) : (
                <TaskList 
                  tasks={tasks} 
                  onToggleTask={toggleTask}
                  onDeleteTask={deleteTask}
                  onEditTask={handleEditTask}
                  onTaskSelect={(taskId, selected) => {
                    setTasks(prevTasks => prevTasks.map(task => 
                      task.id === taskId ? { ...task, selected } : task
                    ));
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;