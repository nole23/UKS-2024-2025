# users/serializers.py
import random
from rest_framework import serializers
from .models import CustomUser, UserProfile

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'profile_picture', 'date_joined']

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
        profile_picture = representation.get('profile_picture', None)

        print(profile_picture)

        if profile_picture is None:
            representation['profile_picture'] = "1.png"
        else:
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

class CustomUserFullSerializer(serializers.ModelSerializer):
    """
    Serijalizacija za ažuriranje korisničkih podataka i povezanog UserProfile modela.
    """
    phone_number = serializers.CharField(source='userprofile.phone_number', required=False, allow_null=True)
    address = serializers.CharField(source='userprofile.address', required=False, allow_null=True)
    location = serializers.CharField(source='userprofile.location', required=False, allow_null=True)

    class Meta:
        model = CustomUser
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'date_of_birth',
            'bio',
            'phone_number',
            'address',
            'location'
        ]

    def update(self, instance, validated_data):
        # Ažuriranje osnovnih podataka korisnika
        user_profile_data = validated_data.pop('userprofile', {})

        for attr, value in validated_data.items():
            if value is not None:  # Ažuriramo samo ako je prosleđena vrednost
                setattr(instance, attr, value)
        instance.save()

        # Ažuriranje povezanog UserProfile modela
        if user_profile_data:
            user_profile, created = UserProfile.objects.get_or_create(user=instance)
            for attr, value in user_profile_data.items():
                if value is not None:  # Ažuriramo samo ako je prosleđena vrednost
                    setattr(user_profile, attr, value)
            user_profile.save()

        return instance
