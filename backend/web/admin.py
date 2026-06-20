from django.contrib import admin
from .models import TherapistProfile, ClientProfile, Appointment, Message, Review

admin.site.register(TherapistProfile)
admin.site.register(ClientProfile)
admin.site.register(Appointment)
admin.site.register(Message)
admin.site.register(Review)
