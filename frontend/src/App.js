import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import TaskList from './components/TaskList';

const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/tasks/`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Make sure the Django server is running.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/tasks/`, {
        title: newTaskTitle.trim(),
        is_done: false
      });
      setTasks([response.data, ...tasks]);
      setNewTaskTitle('');
      setError(null);
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error('Error adding task:', err);
    }
  };

  // Toggle task completion
  const toggleTask = async (taskId) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/tasks/${taskId}/`);
      setTasks(tasks.map(task => 
        task.id === taskId ? response.data : task
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Todo App</h1>
        <p>Django + React Todo Application</p>
      </header>

      {error && <div className="error">{error}</div>}

      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter a new task..."
          className="task-input"
        />
        <button 
          type="submit" 
          disabled={!newTaskTitle.trim()}
          className="add-button"
        >
          Add Task
        </button>
      </form>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <TaskList tasks={tasks} onToggleTask={toggleTask} />
      )}
    </div>
  );
}

export default App;