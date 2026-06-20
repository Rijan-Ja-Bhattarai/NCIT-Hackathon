from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import TherapistProfile, ClientProfile, Appointment, Message, Review
from .serializers import (
    TherapistProfileSerializer, ClientProfileSerializer,
    AppointmentSerializer, MessageSerializer, ReviewSerializer,
)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    role = request.data.get('role', 'client')  # 'client' or 'therapist'

    if not username or not password:
        return Response({'error': 'username and password required'}, status=400)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'username already taken'}, status=400)

    user = User.objects.create_user(
        username=username, password=password,
        email=email, first_name=first_name, last_name=last_name
    )
    if role == 'therapist':
        TherapistProfile.objects.create(
            user=user,
            specialization=request.data.get('specialization', 'other'),
            license_number=request.data.get('license_number', f'LIC-{user.id}'),
            hourly_rate=request.data.get('hourly_rate', 0),
        )
    else:
        ClientProfile.objects.create(user=user)

    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key, 'user_id': user.id, 'role': role}, status=201)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'invalid credentials'}, status=401)
    token, _ = Token.objects.get_or_create(user=user)
    role = 'therapist' if hasattr(user, 'therapist_profile') else 'client'
    return Response({'token': token.key, 'user_id': user.id, 'role': role})


@api_view(['POST'])
def logout(request):
    request.user.auth_token.delete()
    return Response(status=204)


@api_view(['GET', 'PATCH'])
def therapist_profile(request):
    try:
        profile = request.user.therapist_profile
    except TherapistProfile.DoesNotExist:
        return Response({'error': 'not a therapist'}, status=403)
    if request.method == 'PATCH':
        serializer = TherapistProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
    return Response(TherapistProfileSerializer(profile).data)


@api_view(['GET', 'PATCH'])
def client_profile(request):
    try:
        profile = request.user.client_profile
    except ClientProfile.DoesNotExist:
        return Response({'error': 'not a client'}, status=403)
    if request.method == 'PATCH':
        serializer = ClientProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
    return Response(ClientProfileSerializer(profile).data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def therapist_list(request):
    qs = TherapistProfile.objects.filter(is_available=True)
    return Response(TherapistProfileSerializer(qs, many=True).data)


class AppointmentListCreate(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'therapist_profile'):
            return Appointment.objects.filter(therapist=user.therapist_profile)
        return Appointment.objects.filter(client=user.client_profile)

    def perform_create(self, serializer):
        serializer.save(client=self.request.user.client_profile)


class AppointmentDetail(generics.RetrieveUpdateAPIView):
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'therapist_profile'):
            return Appointment.objects.filter(therapist=user.therapist_profile)
        return Appointment.objects.filter(client=user.client_profile)


class MessageListCreate(generics.ListCreateAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        return Message.objects.filter(appointment_id=self.kwargs['appointment_id'])

    def perform_create(self, serializer):
        serializer.save(
            sender=self.request.user,
            appointment_id=self.kwargs['appointment_id']
        )


@api_view(['GET', 'POST'])
def review(request, appointment_id):
    appointment = Appointment.objects.get(pk=appointment_id)
    if request.method == 'POST':
        serializer = ReviewSerializer(data={**request.data, 'appointment': appointment_id})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)
    try:
        return Response(ReviewSerializer(appointment.review).data)
    except Review.DoesNotExist:
        return Response({'error': 'no review yet'}, status=404)
