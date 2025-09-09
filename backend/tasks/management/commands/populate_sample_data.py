from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from tasks.models import Task

class Command(BaseCommand):
    help = 'Populate the database with sample task data'

    def handle(self, *args, **options):
        # Clear existing tasks
        Task.objects.all().delete()
        
        # Sample tasks
        sample_tasks = [
            {
                'title': 'Complete project documentation',
                'description': 'Write comprehensive documentation for the todo application including API endpoints and frontend components.',
                'priority': 'high',
                'category': 'work',
                'due_date': timezone.now() + timedelta(days=3),
                'is_done': False
            },
            {
                'title': 'Buy groceries',
                'description': 'Get milk, bread, eggs, and vegetables from the supermarket.',
                'priority': 'medium',
                'category': 'shopping',
                'due_date': timezone.now() + timedelta(days=1),
                'is_done': False
            },
            {
                'title': 'Schedule dentist appointment',
                'description': 'Call the dental clinic to schedule a routine checkup.',
                'priority': 'low',
                'category': 'health',
                'due_date': timezone.now() + timedelta(days=7),
                'is_done': False
            },
            {
                'title': 'Learn React hooks',
                'description': 'Study advanced React hooks like useReducer, useCallback, and useMemo.',
                'priority': 'medium',
                'category': 'education',
                'due_date': timezone.now() + timedelta(days=5),
                'is_done': False
            },
            {
                'title': 'Plan weekend trip',
                'description': 'Research destinations and book accommodation for the upcoming weekend.',
                'priority': 'low',
                'category': 'personal',
                'due_date': timezone.now() + timedelta(days=2),
                'is_done': False
            },
            {
                'title': 'Fix bug in login system',
                'description': 'Debug and fix the authentication issue reported by users.',
                'priority': 'urgent',
                'category': 'work',
                'due_date': timezone.now() + timedelta(hours=6),
                'is_done': False
            },
            {
                'title': 'Update resume',
                'description': 'Add recent projects and skills to professional resume.',
                'priority': 'medium',
                'category': 'work',
                'due_date': timezone.now() + timedelta(days=4),
                'is_done': True
            },
            {
                'title': 'Call mom',
                'description': 'Check in with family and catch up on recent events.',
                'priority': 'low',
                'category': 'personal',
                'due_date': timezone.now() - timedelta(days=1),
                'is_done': True
            },
            {
                'title': 'Review code changes',
                'description': 'Review pull requests and provide feedback to team members.',
                'priority': 'high',
                'category': 'work',
                'due_date': timezone.now() + timedelta(days=1),
                'is_done': False
            },
            {
                'title': 'Organize workspace',
                'description': 'Clean up desk and organize files and documents.',
                'priority': 'low',
                'category': 'personal',
                'due_date': timezone.now() + timedelta(days=3),
                'is_done': False
            }
        ]
        
        # Create tasks
        for task_data in sample_tasks:
            Task.objects.create(**task_data)
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(sample_tasks)} sample tasks')
        )
