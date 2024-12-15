from django.db import models

from users.models import CustomUser

# Create your models here.
# Explorer: Docker Image model
class DockerImage(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    version = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name

# Repository: Models for Repository and Search
class Repository(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def search_by_name(self, name):
        return Repository.objects.filter(name__icontains=name)

    def search_by_content(self, content):
        return Repository.objects.filter(description__icontains=content)

    def search_by_user(self, user):
        return Repository.objects.filter(user=user)

# Usage Stats: For tracking pulls and storage usage
class RepositoryUsage(models.Model):
    repository = models.OneToOneField(Repository, on_delete=models.CASCADE)
    total_pulls = models.IntegerField(default=0)
    storage_used = models.FloatField(default=0.0)  # In GB
    last_pulled = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.repository.name} Usage Stats"

# Search: For tracking search queries and results
class Search(models.Model):
    query = models.CharField(max_length=255)
    search_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Search query: {self.query}"

# Notifications: For tracking user notifications
class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}"

# Repository Settings: For configuring repository settings like permissions
class RepositorySettings(models.Model):
    repository = models.OneToOneField(Repository, on_delete=models.CASCADE)
    is_private = models.BooleanField(default=False)
    permissions = models.JSONField(default=dict)  # Store user permissions in a dict

    def __str__(self):
        return f"Settings for {self.repository.name}"