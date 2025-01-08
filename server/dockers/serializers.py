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
    is_private = serializers.BooleanField(write_only=True, required=False)  # Za prosleđivanje `is_private`

    class Meta:
        model = Repository
        fields = ['id', 'user', 'name', 'description', 'created_at', 'updated_at', 'usage_stats', 'settings', 'is_private']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Izvuci `is_private` iz podataka ako postoji
        is_private = validated_data.pop('is_private', True)  # Podrazumevano privatno

        # Kreiraj Repository
        repository = Repository.objects.create(**validated_data)

        # Kreiraj povezane postavke (RepositorySettings)
        RepositorySettings.objects.create(repository=repository, is_private=is_private)

        return repository

    def update(self, instance, validated_data):
        # Ažuriraj `Repository` podatke
        is_private = validated_data.pop('is_private', None)
        repository = super().update(instance, validated_data)

        # Ako postoji `is_private`, ažuriraj `RepositorySettings`
        if is_private is not None:
            try:
                settings = RepositorySettings.objects.get(repository=repository)
                settings.is_private = is_private
                settings.save()
            except RepositorySettings.DoesNotExist:
                RepositorySettings.objects.create(repository=repository, is_private=is_private)

        return repository
