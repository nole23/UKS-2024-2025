from rest_framework.permissions import BasePermission
from rest_framework.exceptions import AuthenticationFailed

class CustomIsAuthenticated(BasePermission):
    """
    Custom permission to check if the user is authenticated.
    Returns a custom message if the user is not authenticated.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            raise AuthenticationFailed("Custom error: You must be logged in to access this resource.")
        return True
