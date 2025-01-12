from django.urls import path
from . import views

urlpatterns = [
    path('repositories/', views.get_user_repositories, name='get_user_repositories'),
    path('search', views.search_view, name='search_view'),
    path('search-repositories', views.search_repositories, name='search_repositories'),
    path('get-all-repository', views.get_all_repository, name='get_all_repository'),
    path('get-tags-by-repository', views.get_all_tags_by_repository, name='get_all_tags_by_repository'),
    path('repositories', views.get_repositories, name='get-repositories'),
    path('repositories/delete', views.delete_reposiroty, name='delete_reposiroty'),
    path('repositories/create/', views.create_repository, name='create-repository'),
    path('repositories/update/', views.update_repository, name='update_repository'),
    path('repositories/update/settings/', views.update_settings_repository, name='update_settings_repository'),
    path('repositories/tags/delete/', views.delete_repository, name='delete_repository'),
    path('repositories/tags/add/', views.add_repository, name='add_repository'),
    path('repositories/collaborators/', views.add_collaborators, name='add_collaborators'),
    path('get-one-repository-by-name', views.get_one_repository_by_name, name='get_one_repository_by_name')
]
