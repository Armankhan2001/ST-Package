from django.db import models
from django.utils.text import slugify
from django.urls import reverse

class State(models.Model):
    """Model for Indian states for national packages"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='states/', blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']

class Country(models.Model):
    """Model for countries for international packages"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='countries/', blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Countries'

class City(models.Model):
    """Model for cities in countries or states"""
    name = models.CharField(max_length=100)
    state = models.ForeignKey(State, on_delete=models.CASCADE, null=True, blank=True, related_name='cities')
    country = models.ForeignKey(Country, on_delete=models.CASCADE, null=True, blank=True, related_name='cities')
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='cities/', blank=True)
    
    def __str__(self):
        if self.state:
            return f"{self.name}, {self.state.name}"
        elif self.country:
            return f"{self.name}, {self.country.name}"
        return self.name
    
    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Cities'

class PackageCategory(models.Model):
    """Package categories like Honeymoon, Adventure, Family, etc."""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Package Categories'

class Package(models.Model):
    """Main model for travel packages"""
    PACKAGE_TYPE_CHOICES = (
        ('national', 'National'),
        ('international', 'International'),
    )
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=100)  # e.g., "7 Days / 6 Nights"
    type = models.CharField(max_length=20, choices=PACKAGE_TYPE_CHOICES)
    
    # Locations
    state = models.ForeignKey(State, on_delete=models.SET_NULL, null=True, blank=True, related_name='packages')
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, blank=True, related_name='packages')
    destinations = models.ManyToManyField(City, related_name='packages')
    
    # Features
    category = models.ForeignKey(PackageCategory, on_delete=models.SET_NULL, null=True, blank=True)
    featured = models.BooleanField(default=False)
    best_seller = models.BooleanField(default=False)
    
    # Images
    main_image = models.ImageField(upload_to='packages/')
    
    # Reviews
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    review_count = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Package details
    includes = models.TextField(blank=True)  # What's included in the package
    excludes = models.TextField(blank=True)  # What's excluded from the package
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('package_detail', kwargs={'slug': self.slug})
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_at']

class PackageImage(models.Model):
    """Additional images for a package"""
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='packages/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.IntegerField(default=0)
    
    def __str__(self):
        return f"Image for {self.package.title}"
    
    class Meta:
        ordering = ['order']

class Itinerary(models.Model):
    """Itinerary for a package broken down by days"""
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='itinerary_days')
    day = models.IntegerField()
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    def __str__(self):
        return f"Day {self.day}: {self.title} - {self.package.title}"
    
    class Meta:
        ordering = ['package', 'day']
        verbose_name_plural = 'Itineraries'

class Testimonial(models.Model):
    """Customer testimonials"""
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    package = models.ForeignKey(Package, on_delete=models.SET_NULL, null=True, blank=True, related_name='testimonials')
    content = models.TextField()
    rating = models.IntegerField(default=5)
    image = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Review by {self.name} for {self.package.title if self.package else 'General'}"