from django.db import models
from django.conf import settings
from travel.models import Package

class Booking(models.Model):
    """Model for package bookings"""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='bookings')
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    travel_date = models.DateField()
    number_of_adults = models.PositiveIntegerField(default=1)
    number_of_children = models.PositiveIntegerField(default=0)
    special_requirements = models.TextField(blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    booking_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    
    # Fields for guest checkout (if user is not logged in)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    state_province = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)
    
    # If user is logged in, we can link booking to user
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, 
                            null=True, blank=True, related_name='bookings')
    
    def __str__(self):
        return f"Booking #{self.id} - {self.name} - {self.package.title}"
    
    class Meta:
        ordering = ['-booking_date']
        
class CustomTourRequest(models.Model):
    """Model for customized tour requests"""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    
    # Trip details
    destination = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    number_of_adults = models.PositiveIntegerField(default=1)
    number_of_children = models.PositiveIntegerField(default=0)
    budget = models.CharField(max_length=100)
    
    # Preferences
    accommodation_preferences = models.TextField(blank=True)
    transport_preferences = models.TextField(blank=True)
    activities_interests = models.TextField(blank=True)
    special_requirements = models.TextField(blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    request_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    
    # If user is logged in, we can link request to user
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, 
                            null=True, blank=True, related_name='custom_tour_requests')
    
    def __str__(self):
        return f"Custom Tour Request - {self.name} - {self.destination}"
    
    class Meta:
        ordering = ['-request_date']
        
class ContactInquiry(models.Model):
    """Model for contact form submissions"""
    STATUS_CHOICES = (
        ('unread', 'Unread'),
        ('read', 'Read'),
        ('replied', 'Replied'),
        ('spam', 'Spam'),
    )
    
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unread')
    submission_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    
    # If user is logged in, we can link inquiry to user
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, 
                            null=True, blank=True, related_name='contact_inquiries')
    
    def __str__(self):
        return f"{self.subject} - {self.name}"
    
    class Meta:
        ordering = ['-submission_date']
        verbose_name_plural = 'Contact Inquiries'