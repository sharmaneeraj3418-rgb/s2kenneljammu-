from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Dog(models.Model):
    name = models.CharField(max_length=100, help_text="e.g. Labrador Retriever")
    breed = models.CharField(max_length=100, blank=True, help_text="Optional extra breed detail, e.g. Golden Lab")
    age_range = models.CharField(max_length=50, blank=True, help_text="e.g. 3-6 months (optional)")
    size = models.CharField(
        max_length=20,
        choices=[("", "-- optional --"), ("Toy", "Toy"), ("Small", "Small"), ("Medium", "Medium"), ("Large", "Large")],
        blank=True, default="",
    )
    price_range = models.CharField(max_length=100, help_text="e.g. ₹18,000 to ₹22,000")
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
    breed = models.CharField(max_length=100, blank=True, help_text="Optional extra breed detail, e.g. White Persian")
    age_range = models.CharField(max_length=50, blank=True, help_text="e.g. 6-12 months (optional)")
    size = models.CharField(
        max_length=20,
        choices=[("", "-- optional --"), ("Toy", "Toy"), ("Small", "Small"), ("Medium", "Medium"), ("Large", "Large")],
        blank=True, default="",
    )
    price_range = models.CharField(max_length=100, help_text="e.g. ₹15,000 - ₹40,000")
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
    name = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField(
        default=5, validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    text = models.TextField()
    approved = models.BooleanField(default=True, help_text="Untick to hide this review from the site")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.rating} stars)"

    @property
    def stars(self):
        return "\u2605" * self.rating + "\u2606" * (5 - self.rating)


class Enquiry(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    breed = models.CharField(max_length=100, blank=True, help_text="Breed the customer is interested in")
    message = models.TextField()
    contacted = models.BooleanField(default=False, help_text="Tick once you've followed up with the customer")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Enquiries"

    def __str__(self):
        return f"{self.name} - {self.phone}"
