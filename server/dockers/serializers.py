from rest_framework import serializers
from .models import Repository, RepositoryUsage, RepositorySettings

class RepositoryUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepositoryUsage
        fields = ['total_pulls', 'storage_used', 'last_pulled']

class RepositorySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RepositorySettings
        fields = ['is_private', 'permissions']

class RepositorySerializer(serializers.ModelSerializer):
    usage_stats = RepositoryUsageSerializer(source='repositoryusage', read_only=True)
    settings = RepositorySettingsSerializer(source='repositorysettings', read_only=True)

    class Meta:
        model = Repository
        fields = ['id', 'user', 'name', 'description', 'created_at', 'updated_at', 'usage_stats', 'settings']
