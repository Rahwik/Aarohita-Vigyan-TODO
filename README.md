# TaskCraft - Professional Task Management System

<div align="center">

<div align="center">

![TaskCraft Interface](https://github.com/Rahwik/Aarohita-Vigyan-TODO/blob/main/UI%20Images/Screenshot%202025-09-09%20111640.png)
![TaskCraft Interface](https://github.com/Rahwik/Aarohita-Vigyan-TODO/blob/main/UI%20Images/Screenshot%202025-09-09%20111718.png)
![TaskCraft Interface](https://github.com/Rahwik/Aarohita-Vigyan-TODO/blob/main/UI%20Images/Screenshot%202025-09-09%20112058.png)


</div>

**A modern, full-stack task management application built with Django REST API and React**

[![Django](https://img.shields.io/badge/Django-4.2.24-green.svg)](https://djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Django REST Framework](https://img.shields.io/badge/DRF-3.15.2-red.svg)](https://www.django-rest-framework.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## Overview

TaskCraft is a sophisticated task management application that combines Django's robust backend with React's dynamic frontend to deliver a seamless user experience. Built with modern web technologies and following industry best practices, TaskCraft provides an intuitive interface for managing daily tasks with advanced features like real-time statistics, filtering, and bulk operations.

## Technology Stack

### Backend
- **Django 4.2.24** - Web framework
- **Django REST Framework 3.15.2** - API development
- **SQLite** - Database
- **Python 3.8+** - Programming language

### Frontend
- **React 18.2.0** - UI library
- **Axios** - HTTP client
- **CSS3** - Modern styling features
- **SVG Icons** - Scalable vector graphics

### Development Tools
- **Node.js** - JavaScript runtime
- **npm** - Package manager
- **Git** - Version control

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/taskcraft.git
   cd taskcraft
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create sample data (optional)**
   ```bash
   python manage.py populate_sample_data
   ```

6. **Start the Django development server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the React development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
taskcraft/
├── backend/                 # Django backend
│   ├── tasks/              # Main app
│   │   ├── models.py       # Data models
│   │   ├── views.py        # API views
│   │   ├── serializers.py  # Data serialization
│   │   └── urls.py         # URL routing
│   ├── todo_backend/       # Project settings
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── assets/         # Static assets
│   │   │   └── icons/      # SVG icons
│   │   ├── App.js          # Main app component
│   │   └── App.css         # Main styles
│   └── package.json        # Node dependencies
└── README.md              # Project documentation
```

## API Endpoints

### Tasks
- `GET /api/tasks/` - Retrieve all tasks
- `POST /api/tasks/` - Create a new task
- `GET /api/tasks/{id}/` - Retrieve a specific task
- `PUT /api/tasks/{id}/` - Update a task
- `DELETE /api/tasks/{id}/` - Delete a task

### Statistics
- `GET /api/tasks/stats/` - Get task statistics

## Usage

### Basic Operations
- **Create Tasks** - Use the "Add New Task" button to create new tasks with title, description, category, and due date
- **Manage Tasks** - Edit or delete tasks using the action buttons on each task card
- **Filter & Search** - Use the filtering options to find specific tasks by status, category, or priority
- **View Statistics** - Access comprehensive analytics showing task completion rates and progress
- **Bulk Actions** - Select multiple tasks for batch operations like marking complete or deleting






