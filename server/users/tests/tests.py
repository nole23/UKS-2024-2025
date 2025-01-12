from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from users.models import CustomUser
from django.core.mail import send_mail
from unittest.mock import patch

class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.create_url = reverse('create_user')  # URL za kreiranje korisnika
        self.all_users_url = reverse('get_all_users')  # URL za dobijanje svih korisnika
        self.login_url = reverse('login_user')  # URL za prijavu korisnika
        self.reset_password_url = reverse('reset_password')  # URL za resetovanje lozinke
        self.verify_token_url = reverse('verify_token')  # URL za verifikaciju tokena
        self.set_new_password_url = reverse('set_new_passwrod')  # URL za postavljanje nove lozinke
        
        # Kreiraj korisnika za testove
        self.user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'testpassword123'
        }
        self.user = CustomUser.objects.create_user(**self.user_data)

    # Testiranje kreiranja korisnika
    def test_create_user_success(self):
        response = self.client.post(self.create_url, data={
            'email': 'newuser@example.com',
            'username': 'newuser',
            'first_name': 'New',
            'last_name': 'User',
            'password': 'newpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomUser.objects.count(), 2)  # Provjeri da li je korisnik dodat

    def test_create_user_missing_field(self):
        response = self.client.post(self.create_url, data={
            'email': 'newuser@example.com',
            'username': 'newuser',
            'first_name': 'New',
            # 'last_name' nedostaje
            'password': 'newpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # Testiranje dohvatanja svih korisnika
    def test_get_all_users(self):
        response = self.client.get(self.all_users_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Trebalo bi da imamo jednog korisnika

    def test_get_all_users_empty(self):
        CustomUser.objects.all().delete()  # Obriši sve korisnike
        response = self.client.get(self.all_users_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Ne bi trebalo da bude korisnika

    # Testiranje logovanja korisnika
    def test_login_user_success(self):
        response = self.client.post(self.login_url, data={
            'email': 'testuser@example.com',
            'password': 'testpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['message'], "SUCCESS")

    def test_login_user_fail(self):
        response = self.client.post(self.login_url, data={
            'email': 'wrongemail@example.com',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['message'], "INVALID_CREDENTIALS")

    # Testiranje resetovanja lozinke
    @patch('django.core.mail.send_mail')  # Mock funkcija za slanje email-a
    def test_reset_password_success(self, mock_send_mail):
        response = self.client.post(self.reset_password_url, data={
            'email': 'testuser@example.com'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(mock_send_mail.called)  # Provjerite da li je email poslan

    def test_reset_password_user_not_found(self):
        response = self.client.post(self.reset_password_url, data={
            'email': 'nonexistentuser@example.com'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['message'], "User with this email does not exist")

    # Testiranje verifikacije tokena
    def test_verify_token_success(self):
        token = '123456'  # Ovaj token treba da bude sačuvan u 'bio' polju korisnika
        self.user.bio = token
        self.user.save()
        response = self.client.get(self.verify_token_url, {'email': self.user.email, 'token': token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['message'], "SUCCESS")

    def test_verify_token_fail(self):
        response = self.client.get(self.verify_token_url, {'email': self.user.email, 'token': 'wrongtoken'})
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.json()['message'], "Token is invalid")

    def test_verify_token_user_not_found(self):
        response = self.client.get(self.verify_token_url, {'email': 'wrongemail@example.com', 'token': '123456'})
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.json()['message'], "Email is invalid")

    # Testiranje postavljanja nove lozinke
    def test_set_new_password_success(self):
        token = '123456'
        self.user.bio = token
        self.user.save()

        response = self.client.put(self.set_new_password_url, data={
            'email': self.user.email,
            'password': 'newpassword123',
            'token': token
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()  # Osvježavamo korisnika iz baze
        self.assertTrue(self.user.check_password('newpassword123'))

    def test_set_new_password_invalid_token(self):
        response = self.client.put(self.set_new_password_url, data={
            'email': self.user.email,
            'password': 'newpassword123',
            'token': 'invalidtoken'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['message'], "Token not valid")

    def test_set_new_password_user_not_found(self):
        response = self.client.put(self.set_new_password_url, data={
            'email': 'nonexistentuser@example.com',
            'password': 'newpassword123',
            'token': '123456'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['message'], "User with this email does not exist")

    def test_search_friends_success(self):
        response = self.client.get(reverse('search_friends'), {'username': 'testuser'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()['data']), 0)  # Očekujemo jednog prijatelja (testuser)

    def test_search_friends_missing_query(self):
        response = self.client.get(reverse('search_friends'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  # Očekujemo grešku zbog nedostatka username

    def test_search_new_collaboration_success(self):
        response = self.client.get(reverse('search_new_collaboration'), {'username': 'test'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()['data']), 1)  # Očekujemo korisnika sa imenom koje sadrži "test"

    def test_search_new_collaboration_no_results(self):
        response = self.client.get(reverse('search_new_collaboration'), {'username': 'nonexistentuser'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()['data']), 0)  # Nema korisnika sa tim imenom

    def test_search_new_collaboration_missing_query(self):
        response = self.client.get(reverse('search_new_collaboration'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  # Očekujemo grešku zbog nedostatka username
