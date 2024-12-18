from django.test import TestCase
from users.models import CustomUser, UserProfile, UserTheme, Users
from django.core.exceptions import ValidationError

class CustomUserModelTest(TestCase):
    
    def test_create_user(self):
        # Testiramo kreiranje korisnika sa validnim podacima
        user = CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123"
        )
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.email, "testuser@example.com")
        self.assertTrue(user.check_password("password123"))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
    
    def test_create_superuser(self):
        # Testiramo kreiranje superkorisnika
        superuser = CustomUser.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="adminpass"
        )
        self.assertEqual(superuser.username, "admin")
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
        self.assertTrue(superuser.check_password("adminpass"))
    
    def test_create_user_without_email(self):
        # Testiramo da li korisnik bez email-a baca grešku
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                username="userwithoutemail",
                email="",
                password="password"
            )

class UserProfileModelTest(TestCase):

    def test_create_user_profile(self):
        # Testiramo kreiranje UserProfile objekta povezano sa CustomUser
        user = CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123"
        )
        profile = UserProfile.objects.create(
            user=user,
            phone_number="1234567890",
            address="123 Test St",
            location="Test City"
        )
        self.assertEqual(profile.user.username, "testuser")
        self.assertEqual(profile.phone_number, "1234567890")
        self.assertEqual(profile.address, "123 Test St")
        self.assertEqual(profile.location, "Test City")
    
    def test_user_profile_str_method(self):
        # Testiramo __str__ metodu koja treba da vrati korisničko ime
        user = CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123"
        )
        profile = UserProfile.objects.create(user=user)
        self.assertEqual(str(profile), "testuser's Profile")

class UserThemeModelTest(TestCase):

    def setUp(self):
        # Kreirajte korisnika za testove
        self.user = CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123"
        )

    def test_user_theme_creation(self):
        # Kreirajte UserTheme objekat
        user_theme = UserTheme.objects.create(user=self.user, theme='dark')
        
        # Proverite da li je objekat sačuvan ispravno
        self.assertEqual(user_theme.user, self.user)
        self.assertEqual(user_theme.theme, 'dark')

    def test_default_theme(self):
        # Ako se ne navede tema, podrazumevana tema bi trebalo da bude 'light'
        user_theme = UserTheme.objects.create(user=self.user)
        
        # Proverite da li je tema podrazumevana 'light'
        self.assertEqual(user_theme.theme, 'light')

    def test_str_method(self):
        # Testirajte __str__ metodu
        user_theme = UserTheme.objects.create(user=self.user, theme='dark')
        
        # Proverite da li __str__ metoda vraća ispravan string
        self.assertEqual(str(user_theme), 'testuser - dark theme')

    def test_invalid_theme(self):
        # Testiramo unos nevažeće teme
        user_theme = UserTheme(user=self.user, theme='invalid_theme')
        with self.assertRaises(ValidationError):
            user_theme.full_clean()  # Očekujemo da se podigne ValidationError

class UsersModelTest(TestCase):
    
    def test_create_users_model(self):
        # Testiramo kreiranje objekta Users
        user = CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123"
        )
        users_model = Users.objects.create(
            user=user,
            is_active=True
        )
        self.assertEqual(users_model.user.username, "testuser")
        self.assertTrue(users_model.is_active)
    
    def test_users_model_str_method(self):
        # Testiramo __str__ metodu koja treba da vrati korisničko ime
        user = CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123"
        )
        users_model = Users.objects.create(user=user)
        self.assertEqual(str(users_model), "testuser")