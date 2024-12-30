from django.urls import path
from . import views

urlpatterns = [
    path('repositories/', views.get_user_repositories, name='get_user_repositories'),
    path('search', views.search_view, name='search_view'),
]
