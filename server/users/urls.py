from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_user, name='create_user'),
    path('all/', views.get_all_users, name='get_all_users'),
    path('login/', views.login_user, name='login_user'),
    path('send-restart-request/', views.reset_password, name='reset_password'),
    path('verify-token', views.verify_token, name='verify_token'),
    path('restart-password/', views.set_new_passwrod, name='set_new_passwrod'),
    path('myfriends', views.search_friends, name='search_friends'),
    path('search-users', views.search_new_collaboration, name='search_new_collaboration'),
    path('get-user-by-username', views.get_user_by_username, name='get_user_by_username'),
    path('uptede-user', views.uptede_user, name='uptede_user')
]
