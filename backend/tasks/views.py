from django.shortcuts import render
from django.db.models import Q
from django.utils import timezone
from datetime import datetime, timedelta

from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from .models import Task
from .serializers import TaskSerializer

class TaskPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    pagination_class = TaskPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'category']
    ordering_fields = ['created_at', 'updated_at', 'due_date', 'priority']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by completion status
        is_done = self.request.query_params.get('is_done')
        if is_done is not None:
            queryset = queryset.filter(is_done=is_done.lower() == 'true')
        
        # Filter by priority
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by due date (overdue, today, this week, etc.)
        due_filter = self.request.query_params.get('due_filter')
        now = timezone.now()
        if due_filter == 'overdue':
            queryset = queryset.filter(due_date__lt=now, is_done=False)
        elif due_filter == 'today':
            tomorrow = now + timedelta(days=1)
            queryset = queryset.filter(due_date__gte=now, due_date__lt=tomorrow)
        elif due_filter == 'this_week':
            next_week = now + timedelta(days=7)
            queryset = queryset.filter(due_date__gte=now, due_date__lt=next_week)
        
        return queryset

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskUpdateView(generics.UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    
    def patch(self, request, *args, **kwargs):
        task = self.get_object()
        task.is_done = not task.is_done
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

@api_view(['GET'])
def task_stats(request):
    """Get task statistics"""
    total_tasks = Task.objects.count()
    completed_tasks = Task.objects.filter(is_done=True).count()
    pending_tasks = total_tasks - completed_tasks
    
    # Tasks by priority
    priority_stats = {}
    for priority, _ in Task.PRIORITY_CHOICES:
        count = Task.objects.filter(priority=priority).count()
        priority_stats[priority] = count
    
    # Tasks by category
    category_stats = {}
    for category, _ in Task.CATEGORY_CHOICES:
        count = Task.objects.filter(category=category).count()
        category_stats[category] = count
    
    # Overdue tasks
    overdue_tasks = Task.objects.filter(
        due_date__lt=timezone.now(), 
        is_done=False
    ).count()
    
    return Response({
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'pending_tasks': pending_tasks,
        'completion_rate': (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0,
        'priority_stats': priority_stats,
        'category_stats': category_stats,
        'overdue_tasks': overdue_tasks
    })

@api_view(['POST'])
def bulk_delete_tasks(request):
    """Delete multiple tasks at once"""
    task_ids = request.data.get('task_ids', [])
    if not task_ids:
        return Response({'error': 'No task IDs provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not isinstance(task_ids, list):
        return Response({'error': 'task_ids must be a list'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate that all IDs are integers
    try:
        task_ids = [int(id) for id in task_ids]
    except (ValueError, TypeError):
        return Response({'error': 'All task IDs must be valid integers'}, status=status.HTTP_400_BAD_REQUEST)
    
    deleted_count = Task.objects.filter(id__in=task_ids).delete()[0]
    return Response({'deleted_count': deleted_count})

@api_view(['POST'])
def bulk_update_tasks(request):
    """Update multiple tasks at once"""
    task_ids = request.data.get('task_ids', [])
    updates = request.data.get('updates', {})
    
    if not task_ids or not updates:
        return Response({'error': 'No task IDs or updates provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    if not isinstance(task_ids, list):
        return Response({'error': 'task_ids must be a list'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate that all IDs are integers
    try:
        task_ids = [int(id) for id in task_ids]
    except (ValueError, TypeError):
        return Response({'error': 'All task IDs must be valid integers'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Only allow certain fields to be updated in bulk
    allowed_fields = ['is_done', 'priority', 'category']
    filtered_updates = {k: v for k, v in updates.items() if k in allowed_fields}
    
    if not filtered_updates:
        return Response({'error': 'No valid fields to update'}, status=status.HTTP_400_BAD_REQUEST)
    
    updated_count = Task.objects.filter(id__in=task_ids).update(**filtered_updates)
    return Response({'updated_count': updated_count})

@api_view(['POST'])
def mark_task_complete(request, task_id):
    """Mark a specific task as complete"""
    try:
        task = Task.objects.get(id=task_id)
        task.is_done = True
        task.save()
        serializer = TaskSerializer(task)
        return Response(serializer.data)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def mark_task_incomplete(request, task_id):
    """Mark a specific task as incomplete"""
    try:
        task = Task.objects.get(id=task_id)
        task.is_done = False
        task.save()
        serializer = TaskSerializer(task)
        return Response(serializer.data)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def overdue_tasks(request):
    """Get all overdue tasks"""
    now = timezone.now()
    overdue_tasks = Task.objects.filter(
        due_date__lt=now,
        is_done=False
    ).order_by('due_date')
    
    serializer = TaskSerializer(overdue_tasks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def tasks_due_today(request):
    """Get all tasks due today"""
    now = timezone.now()
    tomorrow = now + timedelta(days=1)
    
    tasks_due_today = Task.objects.filter(
        due_date__gte=now,
        due_date__lt=tomorrow,
        is_done=False
    ).order_by('due_date')
    
    serializer = TaskSerializer(tasks_due_today, many=True)
    return Response(serializer.data)