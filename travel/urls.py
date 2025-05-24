from django.urls import path
from . import views

urlpatterns = [
    # Home and general pages
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('newsletter-subscribe/', views.newsletter_subscribe, name='newsletter_subscribe'),
    path('privacy-policy/', views.privacy_policy, name='privacy_policy'),
    path('terms/', views.terms, name='terms'),
    path('sitemap/', views.sitemap, name='sitemap'),
    
    # Package listings
    path('packages/', views.package_list, name='package_list'),
    path('packages/<slug:slug>/', views.package_detail, name='package_detail'),
    
    # States and countries for geographic organization
    path('states/', views.state_list, name='state_list'),
    path('states/<slug:slug>/', views.state_detail, name='state_detail'),
    path('countries/', views.country_list, name='country_list'),
    path('countries/<slug:slug>/', views.country_detail, name='country_detail'),
    
    # Custom tour request
    path('custom-tour/', views.custom_tour, name='custom_tour'),
]