import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Dog, Cat, CustomerGallery, Review, Enquiry, BookDog


def index(request):
    dogs = Dog.objects.filter(available=True)[:6]
    return render(request, "core/index.html", {"dogs": dogs})


def dogs(request):
    dogs = Dog.objects.filter(available=True)
    return render(request, "core/dogs.html", {"dogs": dogs})


def cats(request):
    cats = Cat.objects.filter(available=True)
    return render(request, "core/cats.html", {"cats": cats})


def about(request):
    return render(request, "core/about.html")


def book_dog(request):
    return render(request, "core/book_dog.html")


def reviews(request):
    reviews_list = Review.objects.filter(approved=True).order_by("-created_at")
    return render(request, "core/reviews.html", {"reviews": reviews_list})


def health_tips(request):
    return render(request, "core/health-tips.html")


def location(request):
    return render(request, "core/location.html")


def contact(request):
    return render(request, "core/contact.html")


@csrf_exempt
@require_http_methods(["POST"])
def api_book_dog(request):
    """
    Receives booking form submissions from the website and stores them in the database.
    Supports both JSON and form data payloads.
    """
    try:
        if request.content_type == "application/json" or (request.body and request.body.startswith(b"{")):
            data = json.loads(request.body.decode("utf-8"))
        else:
            data = request.POST
    except Exception:
        data = request.POST

    name = (data.get("name") or data.get("full_name") or data.get("fullName") or data.get("custName") or "").strip()
    phone = (data.get("phone") or data.get("phoneNumber") or data.get("custPhone") or "").strip()
    email = (data.get("email") or data.get("emailAddress") or data.get("custEmail") or "").strip()
    breed = (data.get("breed") or data.get("dog_breed") or data.get("dogBreed") or "").strip()
    visit_date = (data.get("booking_date") or data.get("visit_date") or data.get("visitDate") or "").strip()
    message = (data.get("message") or data.get("bookingMessage") or data.get("custMessage") or "").strip()

    if not name or not phone:
        return JsonResponse({"status": "error", "success": False, "message": "Please provide your name and phone number."}, status=400)

    try:
        book = BookDog.objects.create(
            full_name=name,
            phone=phone,
            email=email,
            dog_breed=breed,
            visit_date=visit_date or None,
            message=message,
            status="pending",
        )
        return JsonResponse({
            "status": "success",
            "success": True,
            "message": "Dog Booking request submitted successfully!",
            "id": book.id
        })
    except Exception as e:
        return JsonResponse({"status": "error", "success": False, "message": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def api_enquiry(request):
    """
    Receives contact enquiry submissions and stores them in the database.
    """
    try:
        if request.content_type == "application/json" or (request.body and request.body.startswith(b"{")):
            data = json.loads(request.body.decode("utf-8"))
        else:
            data = request.POST
    except Exception:
        data = request.POST

    name = (data.get("name") or data.get("custName") or data.get("fullName") or "").strip()
    phone = (data.get("phone") or data.get("custPhone") or data.get("phoneNumber") or "").strip()
    email = (data.get("email") or data.get("custEmail") or "").strip()
    breed = (data.get("breed") or data.get("dogBreed") or "").strip()
    visit_date = (data.get("visit_date") or data.get("visitDate") or "").strip()
    message = (data.get("message") or data.get("custMessage") or "").strip()

    if not name or not phone or not message:
        return JsonResponse({"status": "error", "success": False, "message": "Please provide your name, phone number, and message."}, status=400)

    try:
        enquiry = Enquiry.objects.create(
            name=name,
            phone=phone,
            email=email,
            breed=breed,
            visit_date=visit_date or None,
            message=message,
            status="new",
            contacted=False,
        )
        return JsonResponse({
            "status": "success",
            "success": True,
            "message": "Thank you! Your enquiry has been received.",
            "id": enquiry.id
        })
    except Exception as e:
        return JsonResponse({"status": "error", "success": False, "message": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def api_review(request):
    """
    Receives customer reviews, stores them in the database, and publishes them live.
    """
    try:
        if request.content_type == "application/json" or (request.body and request.body.startswith(b"{")):
            data = json.loads(request.body.decode("utf-8"))
        else:
            data = request.POST
    except Exception:
        data = request.POST

    name = (data.get("name") or data.get("reviewerName") or data.get("reviewName") or "").strip()
    dog_breed = (data.get("dog_breed") or data.get("dogBreed") or data.get("breed") or "").strip()
    text = (data.get("text") or data.get("reviewText") or data.get("message") or "").strip()
    raw_rating = data.get("rating") or data.get("reviewRating") or 5

    try:
        rating = int(raw_rating)
        if rating < 1 or rating > 5:
            rating = 5
    except (TypeError, ValueError):
        rating = 5

    if not name or not text:
        return JsonResponse({"status": "error", "success": False, "message": "Please provide your name and review message."}, status=400)

    try:
        review = Review.objects.create(
            name=name,
            dog_breed=dog_breed,
            rating=rating,
            text=text,
            approved=True
        )
        return JsonResponse({
            "status": "success",
            "success": True,
            "message": "Thank you for your review! It has been posted successfully.",
            "id": review.id
        })
    except Exception as e:
        return JsonResponse({"status": "error", "success": False, "message": str(e)}, status=500)
