import hashlib
import time
from rest_framework import serializers
from .models import Repository, RepositoryUsage, RepositorySettings, DockerImage

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
    user = serializers.SerializerMethodField() 

    class Meta:
        model = Repository
        fields = ['id', 'user', 'name', 'description', 'created_at', 'updated_at', 'usage_stats', 'settings', 'is_private']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_user(self, obj):
        return obj.user.username  # Vraća `username` korisnika

    def create(self, validated_data):
        # Izvuci podatke
        name = validated_data.get('name')
        user = validated_data.get('user')

        # Proveri da li ime već postoji za tog korisnika
        existing_repository = Repository.objects.filter(name=name).first()
        if existing_repository:
            # Generiši hash na osnovu trenutnog vremena
            hash_suffix = hashlib.sha256(f"{name}{time.time()}".encode()).hexdigest()[:8]
            name = f"{name}-{hash_suffix}"
            validated_data['name'] = name

        # Izvuci `is_private` iz podataka ako postoji
        is_private = validated_data.pop('is_private', True)

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

    def check_name(self, validated_data, username):
        """
        Proverava da li postoji repozitorijum sa istim imenom.
        Ako postoji, dodaje sufix u ime.
        """
        name = validated_data.get('name')

        # Proveri da li već postoji repository sa istim imenom
        if Repository.objects.filter(name=name).exists():
            # Generiši hash sufix
            hash_suffix = hashlib.sha256(f"{name}{time.time()}".encode()).hexdigest()[:8]
            validated_data['name'] = f"{name}-{hash_suffix}"
        

class DockerImageSerializer(serializers.ModelSerializer):
    repository_name = serializers.CharField(source="repository.name", read_only=True)  # Dodaje ime repozitorijuma (read-only)

    class Meta:
        model = DockerImage
        fields = ['id', 'repository', 'repository_name', 'tag', 'name', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']