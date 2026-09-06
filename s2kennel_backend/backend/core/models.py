from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class BookDog(models.Model):
    STATUS_CHOICES = [
        ("pending", "⏳ Pending"),
        ("contacted", "📞 Contacted"),
        ("confirmed", "✅ Confirmed"),
        ("cancelled", "❌ Cancelled"),
    ]

    full_name = models.CharField(max_length=200, verbose_name="Customer Name")
    phone = models.CharField(max_length=30, verbose_name="Phone / WhatsApp")
    email = models.EmailField(blank=True, verbose_name="Email Address")
    dog_breed = models.CharField(max_length=200, blank=True, verbose_name="Interested Breed")
    visit_date = models.DateField(blank=True, null=True, verbose_name="Preferred Date")
    message = models.TextField(blank=True, verbose_name="Notes / Preferences")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", verbose_name="Booking Status")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Submitted On")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Dog Booking Request"
        verbose_name_plural = "Dog Booking Requests"

    def __str__(self):
        return f"{self.full_name} ({self.dog_breed or 'General Booking'}) - {self.phone}"


class Dog(models.Model):
    name = models.CharField(max_length=100, help_text="e.g. German Shepherd")
    breed = models.CharField(max_length=100, blank=True, help_text="Optional extra breed detail, e.g. Working Line")
    age_range = models.CharField(max_length=50, blank=True, help_text="e.g. 2-3 months")
    size = models.CharField(
        max_length=20,
        choices=[("", "-- optional --"), ("Toy", "Toy"), ("Small", "Small"), ("Medium", "Medium"), ("Large", "Large")],
        blank=True, default="",
    )
    price_range = models.CharField(max_length=100, help_text="e.g. ₹18,000 to ₹25,000")
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="dogs/", blank=True, null=True)
    image2 = models.ImageField(upload_to="dogs/", blank=True, null=True, help_text="Optional second photo")
    available = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Lower numbers show first")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.name


class Cat(models.Model):
    name = models.CharField(max_length=100, help_text="e.g. Persian Cat")
    breed = models.CharField(max_length=100, blank=True, help_text="Optional extra breed detail, e.g. Doll Face White")
    age_range = models.CharField(max_length=50, blank=True, help_text="e.g. 2-4 months")
    size = models.CharField(
        max_length=20,
        choices=[("", "-- optional --"), ("Toy", "Toy"), ("Small", "Small"), ("Medium", "Medium"), ("Large", "Large")],
        blank=True, default="",
    )
    price_range = models.CharField(max_length=100, help_text="e.g. ₹15,000 - ₹35,000")
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="cats/", blank=True, null=True)
    image2 = models.ImageField(upload_to="cats/", blank=True, null=True, help_text="Optional second photo")
    available = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Lower numbers show first")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.name


class Review(models.Model):
    name = models.CharField(max_length=100, verbose_name="Customer Name")
    dog_breed = models.CharField(max_length=150, blank=True, verbose_name="Pet Breed Adopted")
    rating = models.PositiveSmallIntegerField(
        default=5, validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Rating (1-5)"
    )
    text = models.TextField(verbose_name="Review Message")
    approved = models.BooleanField(default=True, help_text="Check to display this review live on the website", verbose_name="Approved / Live")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Submitted On")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Customer Review"
        verbose_name_plural = "Customer Reviews"

    def __str__(self):
        return f"{self.name} ({self.rating}★) - {self.dog_breed or 'General'}"

    @property
    def stars(self):
        return "★" * self.rating + "☆" * (5 - self.rating)


class Enquiry(models.Model):
    STATUS_CHOICES = [
        ("new", "🆕 New"),
        ("in_progress", "⏳ In Progress"),
        ("contacted", "📞 Contacted"),
        ("closed", "✅ Closed"),
    ]

    name = models.CharField(max_length=100, verbose_name="Full Name")
    phone = models.CharField(max_length=25, verbose_name="Phone / WhatsApp")
    email = models.EmailField(blank=True, verbose_name="Email Address")
    breed = models.CharField(max_length=100, blank=True, verbose_name="Interested Breed")
    visit_date = models.DateField(blank=True, null=True, verbose_name="Visit Date")
    message = models.TextField(verbose_name="Message / Enquiry")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new", verbose_name="Status")
    contacted = models.BooleanField(default=False, help_text="Mark when customer is contacted", verbose_name="Contacted")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Received On")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Contact / General Enquiry"
        verbose_name_plural = "Contact & Enquiries"

    def __str__(self):
        return f"{self.name} - {self.phone} ({self.get_status_display()})"


from cloudinary_storage.storage import VideoMediaCloudinaryStorage


class CustomerGallery(models.Model):
    customer_name = models.CharField(max_length=200, blank=True, verbose_name="Customer / Family Name")
    dog_breed = models.CharField(max_length=200, blank=True, verbose_name="Dog / Cat Breed")
    photo = models.ImageField(upload_to="customer_gallery/photos/", blank=True, null=True, help_text="Upload customer photo")
    video = models.FileField(
        upload_to="customer_gallery/videos/",
        storage=VideoMediaCloudinaryStorage(),
        blank=True,
        null=True,
        help_text="Upload customer video (MP4/WebM/MOV)"
    )
    caption = models.CharField(max_length=400, blank=True, verbose_name="Short Story / Caption")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Added On")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Customer Gallery Item"
        verbose_name_plural = "Customer Gallery"

    def __str__(self):
        name = self.customer_name or 'Happy Customer'
        breed = f" ({self.dog_breed})" if self.dog_breed else ""
        return f"{name}{breed} - {self.caption[:40]}"

