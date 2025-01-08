from django.urls import path
from . import views

urlpatterns = [
    path('repositories/', views.get_user_repositories, name='get_user_repositories'),
    path('search', views.search_view, name='search_view'),
    path('search-repositories', views.search_repositories, name='search_repositories'),
    path('get-all-repository', views.get_all_repository, name='get_all_repository'),
    path('repositories', views.get_repositories, name='get-repositories'),
    path('repositories/create/', views.create_repository, name='create-repository'),
]
