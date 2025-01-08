from rest_framework.decorators import api_view
from django.http import JsonResponse

# Create your views here.
# Dohvat svih korisnika
@api_view(['GET'])
def notification(request):
    if request.method == 'GET':
        #TODO treba implementirati servis za notifikacije kada
        return JsonResponse({"message": "SUCCESS", "notification": []}, status=200)
