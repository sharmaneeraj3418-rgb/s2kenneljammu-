import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Dog, Cat, Review, Enquiry


def index(request):
    return render(request, "core/index.html")


def dogs(request):
    dogs = Dog.objects.filter(available=True)
    return render(request, "core/dogs.html", {"dogs": dogs})


def cats(request):
    cats = Cat.objects.filter(available=True)
    return render(request, "core/cats.html", {"cats": cats})


def about(request):
    return render(request, "core/about.html")


def reviews(request):
    reviews = Review.objects.filter(approved=True)
    return render(request, "core/reviews.html", {"reviews": reviews})


def health_tips(request):
    return render(request, "core/health-tips.html")


def location(request):
    return render(request, "core/location.html")


def contact(request):
    return render(request, "core/contact.html")


@csrf_exempt
@require_http_methods(["POST"])
def api_enquiry(request):
    """
    Receives the enquiry form submission (sent via fetch() from js/script.js)
    and stores it in the database so it shows up in the Django admin panel.
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        data = request.POST

    name = (data.get("custName") or "").strip()
    phone = (data.get("custPhone") or "").strip()
    breed = (data.get("dogBreed") or "").strip()
    message = (data.get("custMessage") or "").strip()

    if not name or not phone or not message:
        return JsonResponse({"success": False, "error": "Missing required fields"}, status=400)

    enquiry = Enquiry.objects.create(name=name, phone=phone, breed=breed, message=message)
    return JsonResponse({"success": True, "id": enquiry.id})


@csrf_exempt
@require_http_methods(["POST"])
def api_review(request):
    """
    Receives review submissions from the website and stores them in the database.
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        data = request.POST

    name = (data.get("reviewName") or data.get("name") or "").strip()
    text = (data.get("reviewText") or data.get("text") or "").strip()
    rating = data.get("reviewRating") or data.get("rating") or 5

    try:
        rating = int(rating)
    except (TypeError, ValueError):
        rating = 5

    if not name or not text:
        return JsonResponse({"success": False, "error": "Missing required fields"}, status=400)

    review = Review.objects.create(name=name, text=text, rating=rating, approved=False)
    return JsonResponse({"success": True, "id": review.id})
