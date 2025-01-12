from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from dockers.models import Repository
from users.models import CustomUser

User = get_user_model()  # Ovdje se koristi get_user_model jer CustomUser menja User model

# tests.py

class RepositoryTests(APITestCase):
    
    def setUp(self):
        self.client = APIClient()
        """
        Set up test data for the tests
        """
        self.user_data = {
            'email': 'testuser@example.com',
            'username': 'testuser',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'testpassword123',
        }
        self.user = CustomUser.objects.create_user(**self.user_data)
        self.repository1 = Repository.objects.create(user=self.user, name="Repo1", description="Test Repo 1")
        self.repository2 = Repository.objects.create(user=self.user, name="Repo2", description="Test Repo 2")

        # URL za testiranje (koristi "repositories" ime umesto "get_user_repositories")
        self.url = reverse('get_user_repositories')

    def test_get_all_repositories_success(self):
        """
        Test that authenticated user with a CustomUser object can get all repositories
        """
        # Logovanje korisnika sa emailom i passwordom
        self.client.login(email='testuser@example.com', password='testpassword123')
        
        response = self.client.get(self.url)
        
        # Proveravamo status 200 i da li su vraćeni repozitorijumi
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Dva repozitorijuma
        self.assertEqual(response.data[0]['name'], self.repository1.name)
        self.assertEqual(response.data[1]['name'], self.repository2.name)

    def test_get_all_repositories_unauthenticated(self):
        """
        Test that unauthenticated user gets a 401 response
        """
        self.client.logout()
        response = self.client.get(self.url)
        
        # Proveravamo status 403 i poruku
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['detail'], 'Authentication credentials were not provided.')

    def test_get_all_repositories_empty(self):
        """
        Test that authenticated user with CustomUser but no repositories gets an empty list
        """
        # Kreiraj korisnika sa CustomUser, ali bez repozitorijuma
        user_without_repos = CustomUser.objects.create_user(
            email='test3@example.com',
            username='test3',
            password='testpassword123'
        )

        # Logovanje sa korisnikom koji nema repozitorijume
        self.client.login(email='test3@example.com', password='testpassword123')
        
        response = self.client.get(self.url)
        
        # Proveravamo da li je status 200 i da li je lista prazna
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])  # Očekujemo praznu listu jer nema repozitorijuma
    
    def test_search_view_with_query(self):
        url = reverse('search_view')  # putanja za search_view
        response = self.client.get(url, {'query': 'testrepo'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.json())
    
    def test_search_view_no_query(self):
        url = reverse('search_view')  # putanja za search_view
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['error'], 'QUERY_NOT_FOUND')

    def test_search_repositories_with_query(self):
        url = reverse('search_repositories')  # putanja za search_repositories
        response = self.client.get(url, {'username': 'testuser', 'query': 'testrepo'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.json())
    
    def test_search_repositories_no_query(self):
        url = reverse('search_repositories')  # putanja za search_repositories
        response = self.client.get(url, {'username': 'testuser'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['error'], 'QUERY_NOT_FOUND')

    def test_get_all_repository(self):
        url = reverse('get_all_repository')  # putanja za get_all_repository
        response = self.client.get(url, {'username': 'testuser'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.json())

    def test_get_all_repository_no_username(self):
        url = reverse('get_all_repository')  # putanja za get_all_repository
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['error'], 'QUERY_NOT_FOUND')

    def test_get_all_tags_by_repository(self):
        url = reverse('get_all_tags_by_repository')  # putanja za get_all_tags_by_repository
        response = self.client.get(url, {'repositoryId': self.repository1.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.json())

    def test_get_all_tags_by_repository_no_repository(self):
        url = reverse('get_all_tags_by_repository')  # putanja za get_all_tags_by_repository
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['error'], 'QUERY_NOT_FOUND')

    def test_create_repository(self):
        url = reverse('create-repository')  # putanja za create_repository
        data = {'username': 'testuser', 'name': 'newrepo', 'description': 'A new repo'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.json())
    
    def test_create_repository_no_username(self):
        url = reverse('create-repository')  # putanja za create_repository
        data = {'name': 'newrepo', 'description': 'A new repo'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['message'], 'USERNAME_NOT_PROVIDED')

    def test_delete_repository(self):
        url = reverse('delete_reposiroty')  # putanja za delete_reposiroty
        response = self.client.delete(url, {'reposirotyId': self.repository1.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_repository(self):
        url = reverse('add_repository')  # putanja za add_repository
        data = {'newTag': {'repository': self.repository1.id, 'tag': 'newtag'}, 'username': 'testuser'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_collaborators(self):
        url = reverse('add_collaborators')  # putanja za add_collaborators
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_get_repositories(self):
        url = reverse('get-repositories')  # putanja za get_repositories
        response = self.client.get(url, {'username': 'testuser'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('data', response.json())

    def test_get_one_repository_by_name(self):
        url = reverse('get_one_repository_by_name')  # putanja za get_one_repository_by_name
        response = self.client.get(url, {'username': 'testuser', 'repository-name': 'testrepo'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_get_one_repository_by_name_no_name(self):
        url = reverse('get_one_repository_by_name')  # putanja za get_one_repository_by_name
        response = self.client.get(url, {'username': 'testuser'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['error'], 'QUERY_NOT_FOUND')
