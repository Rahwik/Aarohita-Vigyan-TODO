from rest_framework import serializers
from django.utils import timezone
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'is_done', 'priority', 
            'category', 'due_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_title(self, value):
        """Validate task title"""
        if not value or not value.strip():
            raise serializers.ValidationError("Task title cannot be empty.")
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Task title must be at least 3 characters long.")
        return value.strip()
    
    def validate_due_date(self, value):
        """Validate due date"""
        if value and value < timezone.now():
            raise serializers.ValidationError("Due date cannot be in the past.")
        return value
    
    def validate(self, data):
        """Cross-field validation"""
        # If task is marked as done, due date validation is more lenient
        if data.get('is_done') and data.get('due_date'):
            # Allow past due dates for completed tasks
            pass
        elif data.get('due_date') and not data.get('is_done'):
            # For incomplete tasks, due date should not be in the past
            if data['due_date'] < timezone.now():
                raise serializers.ValidationError({
                    'due_date': 'Due date cannot be in the past for incomplete tasks.'
                })
        
        return data