from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'username', 'first_name', 'last_name', 'date_of_birth', 'profile_picture', 'bio', 'is_staff', 'is_superuser', 'date_joined']
    list_filter = ['is_staff', 'is_superuser', 'groups']
    search_fields = ['email', 'username']
    ordering = ['email']
    filter_horizontal = ['groups', 'user_permissions']

admin.site.register(CustomUser, CustomUserAdmin)
