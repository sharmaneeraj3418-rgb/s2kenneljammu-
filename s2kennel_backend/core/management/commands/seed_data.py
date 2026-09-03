import os
from django.contrib.auth import get_user_model
from django.core.files import File
from django.core.management.base import BaseCommand
from django.conf import settings

from core.models import Dog, Cat, Review


def get_image_path(filename):
    if not filename:
        return None
    candidates = [
        settings.BASE_DIR / "core" / "static" / "core" / "images" / filename,
        settings.BASE_DIR / "static" / "images" / filename,
        settings.BASE_DIR.parent / "core" / "static" / "core" / "images" / filename,
        settings.BASE_DIR.parent / "backend" / "core" / "static" / "core" / "images" / filename,
        settings.BASE_DIR.parent / "frontend" / "assets" / "images" / filename,
    ]
    for c in candidates:
        if c.exists():
            return c
    return None


def attach_image(instance, filename, field_name="image"):
    path = get_image_path(filename)
    if path and path.exists():
        with open(path, "rb") as f:
            getattr(instance, field_name).save(filename, File(f), save=False)


class Command(BaseCommand):
    help = "Seed the database with the full original dogs, cats and reviews from the frontend."

    def handle(self, *args, **options):
        # Auto create superuser if none exists
        User = get_user_model()
        if not User.objects.filter(is_superuser=True).exists():
            admin_user = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
            admin_pass = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "admin123")
            admin_email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@s2kennel.com")
            User.objects.create_superuser(username=admin_user, email=admin_email, password=admin_pass)
            self.stdout.write(self.style.SUCCESS(f"Superuser '{admin_user}' created successfully."))

        if Dog.objects.exists() or Cat.objects.exists() or Review.objects.exists():
            self.stdout.write(self.style.WARNING(
                "Data already exists. Skipping seed (delete existing records first if you want to reseed)."
            ))
            return

        # Full list of 17 dog breeds with real price ranges and both photos, taken from the
        # original site content.
        dogs_data = [
            dict(name="Shihtzu", price_range="₹18,000 to ₹22,000",
                 img1="Shihtzu 1.jpeg", img2="Shihtzu 2.jpeg"),
            dict(name="Tibetan Mastiff", price_range="₹85,000 to ₹1,00,000",
                 img1="Tibetian mastiff1.jpg.jpeg", img2="Tibetian mastiff2.jpg.jpeg"),
            dict(name="Golden Labrador", price_range="₹14,000 to ₹18,000",
                 img1="Golden labrador1.jpeg", img2="Golden labrador2.jpeg"),
            dict(name="Pakistani Bully", price_range="₹25,000 to ₹30,000",
                 img1="Pakistani bully1.jpeg", img2="Pakistani bully2.jpeg"),
            dict(name="Rottweiler", price_range="₹25,000 to ₹35,000",
                 img1="Rottweiller1.jpeg", img2="Rottweiller2.jpeg"),
            dict(name="Toy Pom", price_range="₹50,000 to ₹70,000",
                 img1="Toy Pom1.jpeg", img2="Toy Pom2.jpeg"),
            dict(name="Black Labrador (High Quality)", price_range="₹35,000 to ₹45,000",
                 img1="Black labrador 1.jpeg", img2="Black labrador 2.jpeg"),
            dict(name="Labrador", price_range="₹14,000 to ₹18,000",
                 img1="Labrador 1.jpeg", img2="Labrador 2.jpeg"),
            dict(name="French Bulldog", price_range="₹20,000 to ₹25,000",
                 img1="French bulldog .jpeg", img2="French bulldog .jpeg"),
            dict(name="Cane Corso", price_range="₹70,000 to ₹1,00,000",
                 img1="Cane corso1.jpeg", img2="Cane corso2.jpeg"),
            dict(name="Chow Chow (Cream)", price_range="₹22,000 to ₹30,000",
                 img1="chow chow  1.jpeg", img2="chow chow2.jpeg"),
            dict(name="Golden Retriever", price_range="₹20,000 to ₹35,000",
                 img1="Golden retriever .jpeg", img2="Golden retriever .jpeg"),
            dict(name="Chow Chow (Black)", price_range="₹35,000 to ₹50,000",
                 img1="chow chow black.jpeg", img2="chow chow black 2.jpeg"),
            dict(name="Doberman", price_range="₹22,000 to ₹35,000",
                 img1="Doberman.jpeg", img2="Doberman.jpeg"),
            dict(name="Siberian Husky", price_range="₹25,000 to ₹45,000",
                 img1="Siberian husky.jpeg", img2="Siberian husky.jpeg"),
            dict(name="German Shepherd", price_range="₹25,000 to ₹50,000",
                 img1="German shepherd1.jpeg", img2="German shepherd1.jpeg"),
            dict(name="Pug", price_range="₹12,000 to ₹15,000",
                 img1="pug2.jpeg", img2="pug2.jpeg"),
        ]

        for i, data in enumerate(dogs_data, start=1):
            img1 = data.pop("img1")
            img2 = data.pop("img2")
            dog = Dog(order=i, **data)
            attach_image(dog, img1, "image")
            attach_image(dog, img2, "image2")
            dog.save()
        self.stdout.write(self.style.SUCCESS(f"Created {len(dogs_data)} dogs."))

        # Full list of 4 cat breeds with real price ranges + descriptions.
        cats_data = [
            dict(name="Persian Cat", price_range="₹15,000 - ₹40,000 (estimated)",
                 description="Known for its long coat and calm temperament.", img="cat1.jpg"),
            dict(name="Siamese Cat", price_range="₹12,000 - ₹35,000 (estimated)",
                 description="Alert and social, with striking blue eyes.", img="cat2.jpg"),
            dict(name="Maine Coon", price_range="₹25,000 - ₹60,000 (estimated)",
                 description="Large, friendly, and excellent with families.", img="cat3.jpg"),
            dict(name="British Shorthair", price_range="₹20,000 - ₹45,000 (estimated)",
                 description="Stocky and calm, a lovely companion cat.", img="cat1.jpg"),
        ]

        for i, data in enumerate(cats_data, start=1):
            img = data.pop("img")
            cat = Cat(order=i, **data)
            attach_image(cat, img, "image")
            cat.save()
        self.stdout.write(self.style.SUCCESS(f"Created {len(cats_data)} cats."))

        reviews_data = [
            dict(name="Sunita Patel", rating=5, text="Amazing care and updates during our pup's stay. The team is professional and truly cares about the dogs' wellbeing."),
            dict(name="Rakesh Mehra", rating=4, text="Friendly staff and great play area. My dog had a wonderful time. Highly recommended for all dog needs."),
            dict(name="Anita Kapoor", rating=5, text="Excellent grooming services and very attentive staff. Our dog looks and feels amazing after each visit."),
            dict(name="Vikram Singh", rating=5, text="Outstanding breeding practices. Our puppy is healthy, well-socialized, and has become a beloved family member."),
            dict(name="Priya Sharma", rating=5, text="Professional and transparent. They answered all our questions and provided excellent guidance in choosing the right dog."),
            dict(name="Ajay Kumar", rating=4, text="Great experience overall. Excellent health certifications and continuous support after purchase."),
        ]
        Review.objects.bulk_create([Review(**r) for r in reviews_data])
        self.stdout.write(self.style.SUCCESS(f"Created {len(reviews_data)} reviews."))

        self.stdout.write(self.style.SUCCESS("Seeding complete!"))
