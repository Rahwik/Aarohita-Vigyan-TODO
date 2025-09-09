from django.urls import path
from .views import (
    TaskListCreateView, TaskDetailView, TaskUpdateView,
    task_stats, bulk_delete_tasks, bulk_update_tasks,
    mark_task_complete, mark_task_incomplete,
    overdue_tasks, tasks_due_today
)

urlpatterns = [
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('tasks/<int:pk>/toggle/', TaskUpdateView.as_view(), name='task-toggle'),
    path('tasks/<int:task_id>/complete/', mark_task_complete, name='mark-task-complete'),
    path('tasks/<int:task_id>/incomplete/', mark_task_incomplete, name='mark-task-incomplete'),
    path('tasks/stats/', task_stats, name='task-stats'),
    path('tasks/overdue/', overdue_tasks, name='overdue-tasks'),
    path('tasks/due-today/', tasks_due_today, name='tasks-due-today'),
    path('tasks/bulk-delete/', bulk_delete_tasks, name='bulk-delete-tasks'),
    path('tasks/bulk-update/', bulk_update_tasks, name='bulk-update-tasks'),
]