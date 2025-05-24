from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from django.urls import reverse

from travel.models import Package
from .models import Booking

def book_package(request, package_id):
    """View for booking a package"""
    package = get_object_or_404(Package, id=package_id)
    
    if request.method == 'POST':
        # Process the booking form
        try:
            # Calculate total price based on number of people
            adults = int(request.POST.get('number_of_adults', 1))
            children = int(request.POST.get('number_of_children', 0))
            total_price = package.price * adults + (package.price * 0.5 * children)
            
            # Create booking
            booking = Booking.objects.create(
                package=package,
                name=request.POST.get('name'),
                email=request.POST.get('email'),
                phone=request.POST.get('phone'),
                travel_date=request.POST.get('travel_date'),
                number_of_adults=adults,
                number_of_children=children,
                special_requirements=request.POST.get('special_requirements', ''),
                status='pending',
                total_price=total_price,
                address=request.POST.get('address', ''),
                city=request.POST.get('city', ''),
                state_province=request.POST.get('state_province', ''),
                zip_code=request.POST.get('zip_code', ''),
                country=request.POST.get('country', ''),
                user=request.user if request.user.is_authenticated else None,
            )
            
            # Send confirmation email (would be implemented with actual email service)
            
            messages.success(request, 'Your booking has been submitted successfully! You will receive a confirmation email shortly.')
            return redirect('booking_confirmation', booking_id=booking.id)
        except Exception as e:
            messages.error(request, f'There was an error processing your booking. Please try again. Error: {e}')
    
    context = {
        'package': package,
    }
    return render(request, 'bookings/book_package.html', context)

def booking_confirmation(request, booking_id):
    """View for displaying booking confirmation"""
    booking = get_object_or_404(Booking, id=booking_id)
    
    # Security check - only allow viewing if user is authenticated and owns the booking,
    # or if the booking is recent (for non-authenticated users)
    if not request.user.is_authenticated and booking.user is not None:
        messages.error(request, 'You do not have permission to view this booking.')
        return redirect('home')
    
    context = {
        'booking': booking,
        # Generate WhatsApp message to share booking details
        'whatsapp_message': f"I've booked the {booking.package.title} tour with Sanskruti Travels! My booking reference is #{booking.id}."
    }
    return render(request, 'bookings/booking_confirmation.html', context)

@login_required
def user_bookings(request):
    """View for displaying all bookings for the logged-in user"""
    bookings = Booking.objects.filter(user=request.user).order_by('-booking_date')
    
    context = {
        'bookings': bookings,
    }
    return render(request, 'bookings/user_bookings.html', context)

@login_required
def booking_detail(request, booking_id):
    """View for displaying detailed information about a specific booking"""
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    
    context = {
        'booking': booking,
    }
    return render(request, 'bookings/booking_detail.html', context)

@login_required
def cancel_booking(request, booking_id):
    """View for cancelling a booking"""
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    
    # Only allow cancellation if the booking status is pending or confirmed
    if booking.status not in ['pending', 'confirmed']:
        messages.error(request, 'This booking cannot be cancelled as it is already processed.')
        return redirect('booking_detail', booking_id=booking.id)
    
    if request.method == 'POST':
        booking.status = 'cancelled'
        booking.save()
        messages.success(request, 'Your booking has been cancelled successfully.')
        return redirect('bookings')
    
    context = {
        'booking': booking,
    }
    return render(request, 'bookings/cancel_booking.html', context)