from django.urls import path
from . import views

app_name = "core"

urlpatterns = [
    path("", views.index, name="index"),
    path("dogs/", views.dogs, name="dogs"),
    path("cats/", views.cats, name="cats"),
    path("about/", views.about, name="about"),
    path("gallery/", views.gallery, name="gallery"),
    path("book-dog/", views.book_dog, name="book_dog"),
    path("reviews/", views.reviews, name="reviews"),
    path("health-tips/", views.health_tips, name="health_tips"),
    path("location/", views.location, name="location"),
    path("contact/", views.contact, name="contact"),
    path("api/enquiry/", views.api_enquiry, name="api_enquiry"),
    path("api/review/", views.api_review, name="api_review"),
    path("api/book_dog/", views.api_book_dog, name="api_book_dog"),
]
