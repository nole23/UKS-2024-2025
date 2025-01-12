# users/models.py

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.forms import ValidationError
from django.conf import settings

class Friendship(models.Model):
    """
    Model koji predstavlja prijateljstvo između dva korisnika.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='friendships', on_delete=models.CASCADE)
    friend = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='friends', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'friend')  # Sprečava dupliciranje prijateljstava

    def __str__(self):
        return f"{self.user.username} is friends with {self.friend.username}"

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)

        if password:
            user.set_password(password)

        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    date_of_birth = models.DateField(null=True, blank=True)  # Dodajemo datum rođenja
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)  # Slika profila
    bio = models.TextField(null=True, blank=True)  # Biografija
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)  # Dodajemo is_superuser
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email
    
    def get_friends(self):
        """
        Dohvati listu prijatelja korisnika.
        """
        friendships = Friendship.objects.filter(user=self)
        return [friendship.friend for friendship in friendships]

    def get_friend_requests(self):
        """
        Dohvati prijateljske zahteve koje korisnik još nije prihvatio.
        """
        friend_requests = Friendship.objects.filter(friend=self, is_pending=True)
        return [request.user for request in friend_requests]

# System Theme: For user system theme preferences
class UserTheme(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    theme = models.CharField(max_length=50, choices=[('light', 'Light'), ('dark', 'Dark')], default='light')

    def __str__(self):
        return f"{self.user.username} - {self.theme} theme"

    def clean(self):
        # Validiramo da je tema ili 'light' ili 'dark'
        if self.theme not in dict(self._meta.get_field('theme').choices):
            raise ValidationError(f"Invalid theme '{self.theme}'")

# 2. UserProfile model (dodatni podaci o korisniku)
class UserProfile(models.Model):
    """
    Dodatni profil korisnika sa personalnim podacima.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)  # Veza sa korisnikom
    phone_number = models.CharField(max_length=15, blank=True, null=True)  # Broj telefona korisnika
    address = models.CharField(max_length=255, blank=True, null=True)  # Adresa korisnika
    location = models.CharField(max_length=100, blank=True, null=True)  # Lokacija korisnika (grad, država)

    def __str__(self):
        return f"{self.user.username}'s Profile"  # Prikazivanje imena korisnika u administraciji

# 3. Users model (ako želimo dodatne informacije o korisnicima)
class Users(models.Model):
    """
    Model za korisničke informacije koje se mogu povezivati sa drugim objektima.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)  # Povezivanje sa CustomUser
    is_active = models.BooleanField(default=True)  # Da li je korisnik aktivan
    last_login = models.DateTimeField(auto_now=True)  # Poslednje vreme prijave
    registration_date = models.DateTimeField(auto_now_add=True)  # Datum registracije

    def __str__(self):
        return self.user.username  # Prikazivanje korisničkog imena u administraciji
