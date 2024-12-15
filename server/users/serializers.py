# users/serializers.py
import random
from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'profile_picture']

    def create(self, validated_data):
        password = validated_data.pop('password', None)  # Uzimanje lozinke
        
        # Random izbor jedne od default vrednosti za profile_picture
        default_images = ['default_1', 'default_2', 'default_3', 'default_4', 'default_5']
        validated_data['profile_picture'] = random.choice(default_images)

        user = super().create(validated_data)
        if password:
            user.set_password(password)  # Postavljanje hashovane lozinke
            user.save()
        return user

    def to_representation(self, instance):
        # Pozivamo originalnu to_representation metodu
        representation = super().to_representation(instance)

        # Proveravamo vrednost 'profile_picture'
        profile_picture = representation.get('profile_picture')

        print(profile_picture)

        # Ako je vrednost jedan od default vrednosti, izvršavamo konverziju
        if profile_picture in '/media/default_1':
            representation['profile_picture'] = "1.png"

        if profile_picture in '/media/default_2':
            representation['profile_picture'] = "2.png"

        if profile_picture in '/media/default_3':
            representation['profile_picture'] = "3.png"

        if profile_picture in '/media/default_4':
            representation['profile_picture'] = "4.png"

        if profile_picture in '/media/default_5':
            representation['profile_picture'] = "5.png"

        return representation