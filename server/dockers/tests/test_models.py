from django.test import TestCase
from users.models import CustomUser
from dockers.models import DockerImage, Repository, RepositoryUsage, Search, Notification, RepositorySettings
from django.core.exceptions import ValidationError

class DockerImageModelTest(TestCase):

    def setUp(self):
        # Kreiramo korisnika za testove
        self.user = CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123"
        )

    def test_docker_image_str_method(self):
        # Testiramo __str__ metodu
        docker_image = DockerImage.objects.create(
            name="Ubuntu 20.04",
            description="Ubuntu Docker image",
            tag="20.04"
        )
        self.assertEqual(str(docker_image.name), "Ubuntu 20.04")
    
    def test_create_docker_image_without_repository(self):
        # Testiramo kreiranje DockerImage bez repository
        docker_image = DockerImage.objects.create(
            name="Ubuntu 20.04",
            description="Ubuntu Docker image",
        )
        self.assertIsNone(docker_image.repository)  # repository bi trebao biti None


class RepositoryModelTest(TestCase):

    def setUp(self):
        # Kreiramo korisnika za testove
        self.user = CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123"
        )

    def test_create_repository(self):
        # Testiramo kreiranje Repository objekta
        repository = Repository.objects.create(
            user=self.user,
            name="Test Repository",
            description="Test repository description"
        )
        self.assertEqual(repository.user, self.user)
        self.assertEqual(repository.name, "Test Repository")
        self.assertEqual(repository.description, "Test repository description")

    def test_repository_str_method(self):
        # Testiramo __str__ metodu
        repository = Repository.objects.create(
            user=self.user,
            name="Test Repository",
            description="Test repository description"
        )
        self.assertEqual(str(repository), "Test Repository")

    def test_search_by_name(self):
        # Testiramo search_by_name metodu
        repository = Repository.objects.create(
            user=self.user,
            name="Test Repository",
            description="Test repository description"
        )
        result = repository.search_by_name("Test")
        self.assertEqual(result.count(), 1)
        self.assertEqual(result[0], repository)

    def test_search_by_content(self):
        # Testiramo search_by_content metodu
        repository = Repository.objects.create(
            user=self.user,
            name="Test Repository",
            description="Test repository description"
        )
        result = repository.search_by_content("description")
        self.assertEqual(result.count(), 1)
        self.assertEqual(result[0], repository)

    def test_search_by_user(self):
        # Testiramo search_by_user metodu
        repository = Repository.objects.create(
            user=self.user,
            name="Test Repository",
            description="Test repository description"
        )
        result = repository.search_by_user(self.user)
        self.assertEqual(result.count(), 1)
        self.assertEqual(result[0], repository)


class RepositoryUsageModelTest(TestCase):

    def setUp(self):
        # Kreiramo korisnika za testove
        self.user = CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123"
        )
        # Kreiramo repository objekat
        self.repository = Repository.objects.create(
            user=self.user,
            name="Test Repository",
            description="Test repository description"
        )

    def test_create_repository_usage(self):
        # Testiramo kreiranje RepositoryUsage objekta
        repository_usage = RepositoryUsage.objects.create(
            repository=self.repository,
            total_pulls=100,
            storage_used=2.5
        )
        self.assertEqual(repository_usage.repository, self.repository)
        self.assertEqual(repository_usage.total_pulls, 100)
        self.assertEqual(repository_usage.storage_used, 2.5)

    def test_repository_usage_str_method(self):
        # Testiramo __str__ metodu
        repository_usage = RepositoryUsage.objects.create(
            repository=self.repository,
            total_pulls=100,
            storage_used=2.5
        )
        self.assertEqual(str(repository_usage), "Test Repository Usage Stats")
    
    def test_repository_usage_last_pulled(self):
        # Testiramo da li se last_pulled automatski ažurira
        repository_usage = RepositoryUsage.objects.create(
            repository=self.repository,
            total_pulls=100,
            storage_used=2.5
        )
        self.assertIsNotNone(repository_usage.last_pulled)



class SearchModelTest(TestCase):

    def test_create_search(self):
        # Testiramo kreiranje Search objekta
        search = Search.objects.create(query="docker image")
        self.assertEqual(search.query, "docker image")

    def test_search_str_method(self):
        # Testiramo __str__ metodu
        search = Search.objects.create(query="docker image")
        self.assertEqual(str(search), "Search query: docker image")



class NotificationModelTest(TestCase):

    def setUp(self):
        # Kreiramo korisnika za testove
        self.user = CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123"
        )

    def test_create_notification(self):
        # Testiramo kreiranje Notification objekta
        notification = Notification.objects.create(
            user=self.user,
            message="This is a test notification"
        )
        self.assertEqual(notification.user, self.user)
        self.assertEqual(notification.message, "This is a test notification")
        self.assertFalse(notification.is_read)

    def test_notification_str_method(self):
        # Testiramo __str__ metodu
        notification = Notification.objects.create(
            user=self.user,
            message="This is a test notification"
        )
        self.assertEqual(str(notification), "Notification for testuser")
    

    def test_notification_is_read(self):
        # Testiramo da li se is_read polje pravilno postavlja
        notification = Notification.objects.create(
            user=self.user,
            message="This is a test notification"
        )
        self.assertFalse(notification.is_read)
        notification.is_read = True
        notification.save()
        self.assertTrue(notification.is_read)



class RepositorySettingsModelTest(TestCase):

    def setUp(self):
        # Kreiramo korisnika za testove
        self.user = CustomUser.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123"
        )
        # Kreiramo repository objekat
        self.repository = Repository.objects.create(
            user=self.user,
            name="Test Repository",
            description="Test repository description"
        )

    def test_create_repository_settings(self):
        # Testiramo kreiranje RepositorySettings objekta
        repository_settings = RepositorySettings.objects.create(
            repository=self.repository,
            is_private=True,
            permissions={"read": [self.user.username]}
        )
        self.assertEqual(repository_settings.repository, self.repository)
        self.assertTrue(repository_settings.is_private)
        self.assertEqual(repository_settings.permissions, {"read": [self.user.username]})

    def test_repository_settings_str_method(self):
        # Testiramo __str__ metodu
        repository_settings = RepositorySettings.objects.create(
            repository=self.repository,
            is_private=True,
            permissions={"read": [self.user.username]}
        )
        self.assertEqual(str(repository_settings), "Settings for Test Repository")
    
    def test_repository_settings_permissions(self):
        # Testiramo da li su permissions ispravno spremljeni
        repository_settings = RepositorySettings.objects.create(
            repository=self.repository,
            is_private=True,
            permissions={"read": [self.user.username], "write": []}
        )
        self.assertEqual(repository_settings.permissions, {"read": [self.user.username], "write": []})

