from django.shortcuts import render

# Create your views here.
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer

class TaskListCreateView(generics.ListCreateAPIView):
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