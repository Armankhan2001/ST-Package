from django.urls import path
from . import views

urlpatterns = [
    # Booking related URLs
    path('book/<int:package_id>/', views.book_package, name='book_package'),
    path('book-confirm/<int:booking_id>/', views.booking_confirmation, name='booking_confirmation'),
    path('my-bookings/', views.user_bookings, name='bookings'),
    path('my-bookings/<int:booking_id>/', views.booking_detail, name='booking_detail'),
    path('cancel-booking/<int:booking_id>/', views.cancel_booking, name='cancel_booking'),
]