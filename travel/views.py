from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q
from .models import Package, State, Country, City, Testimonial, PackageCategory

def home(request):
    """Homepage view showing featured packages, testimonials, etc."""
    featured_packages = Package.objects.filter(featured=True)[:6]
    national_packages = Package.objects.filter(type='national', best_seller=True)[:3]
    international_packages = Package.objects.filter(type='international', best_seller=True)[:3]
    testimonials = Testimonial.objects.all().order_by('-created_at')[:6]
    
    # States and countries for the search form
    states = State.objects.all()
    countries = Country.objects.all()
    
    context = {
        'featured_packages': featured_packages,
        'national_packages': national_packages,
        'international_packages': international_packages,
        'testimonials': testimonials,
        'states': states,
        'countries': countries,
    }
    return render(request, 'travel/home.html', context)

def about(request):
    """About Us page view"""
    return render(request, 'travel/about.html')

def contact(request):
    """Contact page with contact form"""
    if request.method == 'POST':
        # Process the contact form submission
        from bookings.models import ContactInquiry
        
        try:
            ContactInquiry.objects.create(
                name=request.POST.get('name'),
                email=request.POST.get('email'),
                phone=request.POST.get('phone', ''),
                subject=request.POST.get('subject'),
                message=request.POST.get('message'),
                user=request.user if request.user.is_authenticated else None,
            )
            messages.success(request, 'Your message has been sent. We will contact you shortly!')
            return redirect('contact')
        except Exception as e:
            messages.error(request, f'There was an error sending your message. Please try again.')
    
    return render(request, 'travel/contact.html')

def newsletter_subscribe(request):
    """Process newsletter subscription"""
    if request.method == 'POST':
        email = request.POST.get('email')
        if email:
            # Here you would typically add the email to your newsletter service
            # For now, we'll just show a success message
            messages.success(request, f'Thank you for subscribing to our newsletter with {email}!')
        else:
            messages.error(request, 'Please provide a valid email address.')
    
    # Redirect back to the page where the form was submitted
    return redirect(request.META.get('HTTP_REFERER', 'home'))

def package_list(request):
    """View for listing all packages with filters"""
    packages = Package.objects.all()
    
    # Apply filters from GET params
    package_type = request.GET.get('type')
    if package_type:
        packages = packages.filter(type=package_type)
    
    state = request.GET.get('state')
    if state:
        packages = packages.filter(state__name=state)
    
    country = request.GET.get('country')
    if country:
        packages = packages.filter(country__name=country)
    
    # Search functionality
    search_query = request.GET.get('q')
    if search_query:
        packages = packages.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(destinations__name__icontains=search_query) |
            Q(state__name__icontains=search_query) |
            Q(country__name__icontains=search_query)
        ).distinct()
    
    # Sorting
    sort_by = request.GET.get('sort', '-created_at')  # Default sort by latest
    packages = packages.order_by(sort_by)
    
    # Pagination
    paginator = Paginator(packages, 9)  # 9 packages per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    context = {
        'page_obj': page_obj,
        'package_type': package_type,
        'state': state,
        'country': country,
        'search_query': search_query,
        'sort_by': sort_by,
    }
    return render(request, 'travel/package_list.html', context)

def package_detail(request, slug):
    """View for displaying package details"""
    package = get_object_or_404(Package, slug=slug)
    
    # Get related packages (same category, same country/state, etc.)
    related_packages = Package.objects.filter(
        Q(category=package.category) | 
        Q(country=package.country) | 
        Q(state=package.state)
    ).exclude(id=package.id)[:3]
    
    context = {
        'package': package,
        'related_packages': related_packages,
    }
    return render(request, 'travel/package_detail.html', context)

def state_list(request):
    """View for listing all states in India"""
    states = State.objects.all().order_by('name')
    context = {'states': states}
    return render(request, 'travel/state_list.html', context)

def state_detail(request, slug):
    """View for displaying packages in a specific state"""
    state = get_object_or_404(State, name__iexact=slug.replace('-', ' '))
    packages = Package.objects.filter(state=state)
    
    context = {
        'state': state,
        'packages': packages,
    }
    return render(request, 'travel/state_detail.html', context)

def country_list(request):
    """View for listing all countries"""
    countries = Country.objects.all().order_by('name')
    context = {'countries': countries}
    return render(request, 'travel/country_list.html', context)

def country_detail(request, slug):
    """View for displaying packages in a specific country"""
    country = get_object_or_404(Country, name__iexact=slug.replace('-', ' '))
    packages = Package.objects.filter(country=country)
    
    context = {
        'country': country,
        'packages': packages,
    }
    return render(request, 'travel/country_detail.html', context)

def custom_tour(request):
    """Custom tour request page with form"""
    if request.method == 'POST':
        # Process the custom tour request form
        from bookings.models import CustomTourRequest
        
        try:
            CustomTourRequest.objects.create(
                name=request.POST.get('name'),
                email=request.POST.get('email'),
                phone=request.POST.get('phone'),
                destination=request.POST.get('destination'),
                start_date=request.POST.get('start_date'),
                end_date=request.POST.get('end_date'),
                number_of_adults=request.POST.get('number_of_adults', 1),
                number_of_children=request.POST.get('number_of_children', 0),
                budget=request.POST.get('budget'),
                accommodation_preferences=request.POST.get('accommodation_preferences', ''),
                transport_preferences=request.POST.get('transport_preferences', ''),
                activities_interests=request.POST.get('activities_interests', ''),
                special_requirements=request.POST.get('special_requirements', ''),
                user=request.user if request.user.is_authenticated else None,
            )
            messages.success(request, 'Your custom tour request has been submitted successfully! Our team will contact you shortly.')
            return redirect('home')
        except Exception as e:
            messages.error(request, f'There was an error submitting your request. Please try again.')
    
    # Get data for form dropdowns
    states = State.objects.all()
    countries = Country.objects.all()
    
    context = {
        'states': states,
        'countries': countries,
    }
    return render(request, 'travel/custom_tour.html', context)

def privacy_policy(request):
    """Privacy policy page"""
    return render(request, 'travel/privacy_policy.html')

def terms(request):
    """Terms and conditions page"""
    return render(request, 'travel/terms.html')

def sitemap(request):
    """HTML sitemap page"""
    # Get all packages categorized by type
    national_packages = Package.objects.filter(type='national')
    international_packages = Package.objects.filter(type='international')
    
    # Get all states and countries
    states = State.objects.all()
    countries = Country.objects.all()
    
    context = {
        'national_packages': national_packages,
        'international_packages': international_packages,
        'states': states,
        'countries': countries,
    }
    return render(request, 'travel/sitemap.html', context)