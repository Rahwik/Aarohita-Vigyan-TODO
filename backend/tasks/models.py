from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    CATEGORY_CHOICES = [
        ('work', 'Work'),
        ('personal', 'Personal'),
        ('shopping', 'Shopping'),
        ('health', 'Health'),
        ('education', 'Education'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200, help_text="Task title (max 200 characters)")
    description = models.TextField(blank=True, null=True, help_text="Detailed task description")
    is_done = models.BooleanField(default=False, help_text="Task completion status")
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium', help_text="Task priority level")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other', help_text="Task category")
    due_date = models.DateTimeField(blank=True, null=True, help_text="Task due date and time")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        """Custom validation for the model"""
        if self.due_date and self.created_at and self.due_date < self.created_at:
            raise ValidationError({'due_date': 'Due date cannot be in the past.'})
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Task'
        verbose_name_plural = 'Tasks'