from rest_framework import serializers
from .models import TherapistProfile, ClientProfile, Appointment, Message, Review


class TherapistProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = TherapistProfile
        fields = ['id', 'username', 'full_name', 'bio', 'specialization',
                  'license_number', 'years_experience', 'hourly_rate', 'is_available']


class ClientProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = ClientProfile
        fields = ['id', 'username', 'date_of_birth', 'phone', 'emergency_contact']


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'client', 'therapist', 'scheduled_at', 'duration_minutes', 'status', 'notes']
        read_only_fields = ['client']


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_username', 'content', 'sent_at', 'is_read']
        read_only_fields = ['sender', 'sent_at']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'appointment', 'rating', 'comment', 'created_at']
        read_only_fields = ['created_at']
