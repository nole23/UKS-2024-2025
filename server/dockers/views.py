from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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