from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'priority', 'category', 'is_done', 'due_date', 'created_at']
    list_filter = ['priority', 'category', 'is_done', 'created_at', 'due_date']
    search_fields = ['title', 'description']
    list_editable = ['priority', 'category', 'is_done']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description')
        }),
        ('Classification', {
            'fields': ('priority', 'category')
        }),
        ('Status & Dates', {
            'fields': ('is_done', 'due_date')
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()