from venv import logger
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q

from .serializers import RepositorySerializer

from .models import CustomUser, Repository, RepositorySettings
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_repositories(request):
    # Proveravamo da li korisnik postoji i da li ima povezan `customuser` objekat
    try:
        custom_user = request.user
    except CustomUser.DoesNotExist:
        # Ako korisnik nema povezan `customuser`, vraćamo status 400
        return JsonResponse({"message": "User does not have a custom profile."}, status=400)

    repository = Repository.objects.filter(user=custom_user)
    serializer = RepositorySerializer(repository, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def search_view(request):
    query = request.GET.get('query', None)

    if not query:
        return JsonResponse({'error': 'QUERY_NOT_FOUND'}, status=400)
    
    try:
        # Napravi složeni Q objekat za pretragu
        repositories = Repository.objects.filter(
            Q(user__username__icontains=query) |  # Pretraga po korisničkom imenu korisnika
            Q(name__icontains=query) |           # Pretraga po nazivu
            Q(description__icontains=query)      # Pretraga po opisu
        ).distinct()  # Uklanja duplikate ako postoji preklapanje između polja

        if len(repositories) == 0:
            return JsonResponse({"message": 'SUCCESS', 'data': []}, status=200)

        serializer = RepositorySerializer(repositories, many=True)
        return JsonResponse({"message": 'SUCCESS', 'data': serializer.data}, status=200)
    except Repository.DoesNotExist:
        # Ako korisnik nema povezan `customuser`, vraćamo status 400
        return JsonResponse({"message": "REPOSITORY_NOT_FOIND"}, status=400)

@api_view(['GET'])
def search_repositories(request):
    username = request.GET.get('username', None)
    query = request.GET.get('query', None)

    if not username or not query:
        return JsonResponse({'error': 'QUERY_NOT_FOUND'}, status=400)
    
    try:
        # Napravi složeni Q objekat za pretragu
        repositories = Repository.objects.filter(
            Q(user__username__icontains=username) |  # Pretraga po korisničkom imenu korisnika
            Q(name__icontains=query) |           # Pretraga po nazivu
            Q(description__icontains=query)      # Pretraga po opisu
        ).distinct()  # Uklanja duplikate ako postoji preklapanje između polja

        if len(repositories) == 0:
            return JsonResponse({"message": 'SUCCESS', 'data': []}, status=200)

        serializer = RepositorySerializer(repositories, many=True)
        return JsonResponse({"message": 'SUCCESS', 'data': serializer.data}, status=200)
    except Repository.DoesNotExist:
        # Ako korisnik nema povezan `customuser`, vraćamo status 400
        return JsonResponse({"message": "REPOSITORY_NOT_FOIND"}, status=400)
    
@api_view(['GET'])
def get_all_repository(request):
    try:
        username = request.GET.get('username', None)

        if not username:
            return JsonResponse({'error': 'QUERY_NOT_FOUND'}, status=400)
        
        user = CustomUser.objects.get(username=username)
        repositories = Repository.objects.filter(user=user)
        serializer = RepositorySerializer(repositories, many=True)
        return JsonResponse({"message": 'SUCCESS', 'data': serializer.data}, status=200)
    except Repository.DoesNotExist:
        return JsonResponse({"message": "REPOSITORY_NOT_FOIND"}, status=400)

@api_view(['POST'])
def create_repository(request):
    """
    Kreira novi repozitorijum i podešava da li je public ili private.
    """
    try:
        data = request.data.copy()

        # Pronađi korisnika na osnovu username-a
        username = data.get('username', None)
        if not username:
            return JsonResponse({"message": "USERNAME_NOT_PROVIDED"}, status=400)

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return JsonResponse({"message": "USER_NOT_FOUND"}, status=404)

        # Postavi user ID umesto objekta
        data['user'] = user.id

        # Proveri validaciju serijalizatora
        serializer = RepositorySerializer(data=data)
        if serializer.is_valid():
            print("Serializer is valid")

            try:
                # Sačuvaj Repository
                repository = serializer.save()
                print(f"Saved repository: {repository}")

                # Proveri da li već postoji RepositorySettings za ovaj repository
                existing_settings = RepositorySettings.objects.filter(repository=repository).first()

                if existing_settings:
                    # Ako postoji, ažuriraj postavke
                    print(f"Repository settings for repository {repository.id} already exist. Updating settings.")
                    existing_settings.is_private = data.get('is_private', True)  # Podrazumevano je privatno
                    existing_settings.save()
                    print(f"Updated repository settings for repository {repository.id}")
                else:
                    # Ako ne postoji, kreiraj nove postavke
                    is_private = data.get('is_private', True)  # Podrazumevano je privatno
                    RepositorySettings.objects.create(repository=repository, is_private=is_private)
                    print(f"Created new repository settings for repository {repository.id}")

                # Vrati podatke o repozitorijumu
                return JsonResponse({"message": 'SUCCESS', 'data': serializer.data}, status=200)

            except Exception as e:
                print(f"Error occurred while creating or updating RepositorySettings: {str(e)}")
                return JsonResponse({"message": "SETTINGS_CREATION_ERROR", "error": str(e)}, status=500)

        # Ako serijalizator nije validan, vrati greške
        return JsonResponse({"message": "VALIDATION_ERROR", "errors": serializer.errors}, status=400)

    except Exception as e:
        print(f"Server error occurred while creating repository: {str(e)}")
        return JsonResponse({"message": "SERVER_ERROR", "error": str(e)}, status=500)



@api_view(['GET'])
def get_repositories(request):
    """
    Lista repozitorijuma korisnika:
    - Privatni i javni repozitorijumi za vlasnika.
    - Samo javni repozitorijumi za ostale korisnike.
    """
    username = request.GET.get('username', None)
    if not username:
        return JsonResponse({'error': 'QUERY_NOT_FOUND'}, status=400)
    
    user = CustomUser.objects.get(username=username)
    repositories = Repository.objects.filter(
        Q(user=user) | 
        Q(repositorysettings__is_private=False)  # Samo javni repozitorijumi drugih korisnika
    ).distinct()

    serializer = RepositorySerializer(repositories, many=True)
    return JsonResponse({"message": 'SUCCESS', 'data': serializer.data}, status=200)
