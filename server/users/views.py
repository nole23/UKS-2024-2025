from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth import authenticate, login

from uks.settings import EMAIL_HOST_USER
from .models import CustomUser, Friendship
from .serializers import CustomUserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.core.mail import send_mail
import random

# Kreiranje novog korisnika
@api_view(['POST'])
def create_user(request):
    if request.method == 'POST':
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Dohvat svih korisnika
@api_view(['GET'])
def get_all_users(request):
    if request.method == 'GET':
        users = CustomUser.objects.all()
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data)

# Login korisnika (koristi email i lozinku)
@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(request, email=email, password=password)

    if user is not None:
        # Ako je autentifikacija uspešna, postavimu usera u sessiu
        login(request, user)
        # Serializuj podatke o korisniku koristeći CustomUserResponseSerializer
        user_data = CustomUserSerializer(user).data
        return JsonResponse({"message": "SUCCESS", "user": user_data}, status=200)
    else:
        return JsonResponse({"message": "INVALID_CREDENTIALS"}, status=400)

@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email')  # Email koji korisnik šalje
    try:
        user = CustomUser.objects.get(email=email)  # Pronađi korisnika po email-u
    except CustomUser.DoesNotExist:
        return JsonResponse({"message": "User with this email does not exist"}, status=400)

    # Generiši verifikacioni broj (npr. 6 cifara)
    verification_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])

    # Sačuvaj verifikacioni broj u polje 'bio' korisnika
    user.bio = verification_code  # Čuvamo broj u bio polju
    user.save()

    # Generiši link za verifikaciju
    domain = get_current_site(request).domain
    protocol = 'https' if request.is_secure() else 'http'

    # Pripremi email
    subject = "Password Reset Request"
    message = render_to_string('password_reset_email.html', {
        'user': user,
        'protocol': protocol,
        'domain': domain,
        'verification_code': verification_code,  # Prosledimo verifikacioni broj
    })

    # Pošaljite email korisniku
    test = send_mail(subject, message, EMAIL_HOST_USER, [email])  # Podesite pravi "from" email
    return JsonResponse({"message": "SUCCESS"}, status=200)

@api_view(['GET'])
def verify_token(request):
    token = request.GET.get('token')  # Dobavi token iz query parametra
    email = request.GET.get('email')  # Dobavi email iz query parametra

    try:
        # Tvoj logika za verifikaciju tokena
        # Na primer, koristi token da bi dobio korisnika ili proverio da li je validan
        # Ako koristiš token za resetovanje lozinke, možeš proveriti da li odgovara korisniku
        user = CustomUser.objects.get(email=email)  # Ako si sačuvao token u "bio" polje

        if user.bio == token:
            return JsonResponse({"message": "SUCCESS"})
        else:
            return JsonResponse({"message": "Token is invalid", "toen": token}, status=500)
    except CustomUser.DoesNotExist:
        return JsonResponse({"message": "Email is invalid", "email": email}, status=500)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=500)


@api_view(['PUT'])
def set_new_passwrod(request):
    email = request.data.get('email')
    password = request.data.get('password')
    token = request.data.get('token')

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        return JsonResponse({"message": "User with this email does not exist"}, status=400)

    if user.bio != token:
        return JsonResponse({"message": "Token not valid"}, status=400)

    user.bio = ''
    user.set_password(password)
    user.save()

    return JsonResponse({"message": "SUCCESS"}, status=200)

@api_view(['GET'])
def search_friends(request):
    username = request.GET.get('username', None)

    if not username:
        return JsonResponse({'error': 'QUERY_NOT_FOUND'}, status=400)
    
    user = CustomUser.objects.get(username=username)
    friends = user.get_friends()
    serializer = CustomUserSerializer(friends, many=True)
    return JsonResponse({"message": "SUCCESS", "data": serializer.data}, status=200)
    
@api_view(['POST'])
def add_friend(user, friend):
    """
    Dodaj prijatelja korisniku.
    """
    if user == friend:
        raise ValueError("Korisnik ne može dodati sebe kao prijatelja.")

    # Proveri da li prijateljstvo već postoji
    if Friendship.objects.filter(user=user, friend=friend).exists():
        raise ValueError("Prijateljstvo već postoji.")

    # Kreiraj prijateljstvo
    Friendship.objects.create(user=user, friend=friend)
    Friendship.objects.create(user=friend, friend=user)  # Dvosmerno prijateljstvo

    JsonResponse({"message": "SUCCESS"}, status=200)