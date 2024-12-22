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
