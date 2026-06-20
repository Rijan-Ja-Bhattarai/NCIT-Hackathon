from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('api/auth/signup/', views.signup, name='auth-signup'),
    path('api/auth/login/', views.login, name='auth-login'),
    path('api/auth/logout/', views.logout, name='auth-logout'),
    # Profiles
    path('api/profile/therapist/', views.therapist_profile, name='therapist-profile'),
    path('api/profile/client/', views.client_profile, name='client-profile'),
    path('api/therapists/', views.therapist_list, name='therapist-list'),
    # Appointments
    path('api/appointments/', views.AppointmentListCreate.as_view(), name='appointment-list'),
    path('api/appointments/<int:pk>/', views.AppointmentDetail.as_view(), name='appointment-detail'),
    # Messages
    path('api/appointments/<int:appointment_id>/messages/', views.MessageListCreate.as_view(), name='appointment-messages'),
    # Reviews
    path('api/appointments/<int:appointment_id>/review/', views.review, name='appointment-review'),
]
