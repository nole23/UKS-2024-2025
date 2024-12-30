from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q

from .serializers import RepositorySerializer

from .models import CustomUser, Repository
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
    except CustomUser.DoesNotExist:
        # Ako korisnik nema povezan `customuser`, vraćamo status 400
        return JsonResponse({"message": "REPOSITORY_NOT_FOIND"}, status=400)