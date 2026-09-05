import os
from django.contrib.auth import get_user_model
from django.core.files import File
from django.core.management.base import BaseCommand
from django.conf import settings

from core.models import Dog, Cat, Review, CustomerGallery


def get_image_path(filename):
    if not filename:
        return None
    candidates = [
        settings.BASE_DIR / "core" / "static" / "core" / "images" / filename,
        settings.BASE_DIR / "static" / "images" / filename,
        settings.BASE_DIR.parent / "core" / "static" / "core" / "images" / filename,
        settings.BASE_DIR.parent / "backend" / "core" / "static" / "core" / "images" / filename,
        settings.BASE_DIR.parent / "frontend" / "assets" / "images" / filename,
        settings.BASE_DIR / "backend" / "core" / "static" / "core" / "images" / filename,
    ]
    for c in candidates:
        if c.exists():
            return c
    return None


def attach_image(instance, filename, field_name="image"):
    path = get_image_path(filename)
    if path and path.exists():
        try:
            with open(path, "rb") as f:
                getattr(instance, field_name).save(filename, File(f), save=False)
        except Exception:
            pass


DOGS_DATA = [
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

CATS_DATA = [
    dict(name="Persian Cat", price_range="₹15,000 - ₹40,000 (estimated)",
         description="Known for its long coat and calm temperament.", img="cat1.jpg"),
    dict(name="Siamese Cat", price_range="₹12,000 - ₹35,000 (estimated)",
         description="Alert and social, with striking blue eyes.", img="cat2.jpg"),
    dict(name="Maine Coon", price_range="₹25,000 - ₹60,000 (estimated)",
         description="Large, friendly, and excellent with families.", img="cat3.jpg"),
    dict(name="British Shorthair", price_range="₹20,000 - ₹45,000 (estimated)",
         description="Stocky and calm, a lovely companion cat.", img="cat1.jpg"),
]

REVIEWS_DATA = [
    dict(name="Sunita Patel", rating=5, text="Amazing care and updates during our pup's stay. The team is professional and truly cares about the dogs' wellbeing."),
    dict(name="Rakesh Mehra", rating=4, text="Friendly staff and great play area. My dog had a wonderful time. Highly recommended for all dog needs."),
    dict(name="Anita Kapoor", rating=5, text="Excellent grooming services and very attentive staff. Our dog looks and feels amazing after each visit."),
    dict(name="Vikram Singh", rating=5, text="Outstanding breeding practices. Our puppy is healthy, well-socialized, and has become a beloved family member."),
    dict(name="Priya Sharma", rating=5, text="Professional and transparent. They answered all our questions and provided excellent guidance in choosing the right dog."),
    dict(name="Ajay Kumar", rating=4, text="Great experience overall. Excellent health certifications and continuous support after purchase."),
]

CUSTOMER_GALLERY_DATA = [
    dict(
        customer_name="Bhumika Sharma",
        dog_breed="Chow Chow",
        caption="Our cute Chow Chow puppy having fun! Video reel from happy pet parents.",
        video="customer_gallery/videos/WhatsApp_Video_2026-09-05_at_1.41.50_PM.mp4",
        photo="",
        priority=9
    ),
    dict(
        customer_name="Manpreet Singh",
        dog_breed="German Shepherd Puppy",
        caption="Brought home this strong and playful GSD puppy from S2 Kennel Vijaypur!",
        photo="customer_gallery/photos/customer_germanshepherd1.jpg",
        video="",
        priority=8
    ),
    dict(
        customer_name="Sneha Gupta",
        dog_breed="Shih Tzu Puppy",
        caption="Got my adorable Shihtzu fur baby from S2 Kennel Jammu. Absolutely in love!",
        photo="customer_gallery/photos/customer_shihtzu1.jpg",
        video="",
        priority=7
    ),
    dict(
        customer_name="Ananya Sharma",
        dog_breed="Persian White Kitten",
        caption="Adopted this lovely blue-eyed kitten from S2 Kennel. Super active and healthy!",
        photo="customer_gallery/photos/customer_persian_kitten1.jpg",
        video="",
        priority=6
    ),
    dict(
        customer_name="Rahul Jamwal",
        dog_breed="Golden Labrador",
        caption="Got our adorable Golden Labrador puppy from S2 Kennel Jammu! Healthy, active and super playful.",
        photo="customer_gallery/photos/Golden_labrador1.jpeg",
        video="",
        priority=5
    ),
    dict(
        customer_name="Amit Sharma",
        dog_breed="Shihtzu",
        caption="Our beautiful little Shihtzu puppy enjoying her new home in Jammu. Thank you S2 Kennel team!",
        photo="customer_gallery/photos/Shihtzu_1.jpeg",
        video="",
        priority=4
    ),
    dict(
        customer_name="Sunil Dogra",
        dog_breed="Tibetan Mastiff",
        caption="Majestic Tibetan Mastiff puppy delivered in top health with all vaccinations completed.",
        photo="customer_gallery/photos/Tibetian_mastiff1.jpg.jpeg",
        video="",
        priority=3
    ),
    dict(
        customer_name="Pooja Rajput",
        dog_breed="Chow Chow",
        caption="Such a fluffy and sweet Chow Chow teddy bear! Highly recommended pet breeders in J&K.",
        photo="customer_gallery/photos/chow_chow__1.jpeg",
        video="",
        priority=2
    ),
    dict(
        customer_name="Vikram Choudhary",
        dog_breed="Rottweiler",
        caption="Strong, active and obedient Rottweiler pup. Best bloodline pedigree!",
        photo="customer_gallery/photos/Rottweiller1.jpeg",
        video="",
        priority=1
    ),
]


def run_seed():
    # 1. Superuser: Create only if does not exist, never overwrite custom admin password
    try:
        User = get_user_model()
        admin_user = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
        admin_pass = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "admin123")
        admin_email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@s2kennel.com")
        force_reset = os.environ.get("DJANGO_SUPERUSER_FORCE_RESET", "false").lower() in ("true", "1", "yes")
        
        user = User.objects.filter(username=admin_user).first()
        if not user:
            # Check if any superuser already exists
            if not User.objects.filter(is_superuser=True).exists():
                user = User.objects.create_superuser(username=admin_user, email=admin_email, password=admin_pass)
                print(f"Superuser '{admin_user}' created successfully.")
            else:
                user = User.objects.create_superuser(username=admin_user, email=admin_email, password=admin_pass)
                print(f"Superuser '{admin_user}' created successfully.")
        else:
            # User already exists - preserve their existing password and do NOT overwrite!
            if not user.is_staff or not user.is_superuser:
                user.is_staff = True
                user.is_superuser = True
                user.save(update_fields=['is_staff', 'is_superuser'])
            if force_reset:
                user.set_password(admin_pass)
                user.save(update_fields=['password'])
                print(f"Superuser '{admin_user}' password force-reset via DJANGO_SUPERUSER_FORCE_RESET.")
    except Exception as e:
        print(f"Superuser creation notice: {e}")

    # 2. Dogs
    for i, item in enumerate(DOGS_DATA, start=1):
        data = dict(item)
        img1 = data.pop("img1", None)
        img2 = data.pop("img2", None)
        dog, created = Dog.objects.get_or_create(name=data["name"], defaults={"order": i, **data})
        img1_rel = f"dogs/{img1.replace(' ', '_')}" if img1 else ""
        img2_rel = f"dogs/{img2.replace(' ', '_')}" if img2 else ""
        Dog.objects.filter(pk=dog.pk).update(image=img1_rel, image2=img2_rel)

    # 3. Cats
    for i, item in enumerate(CATS_DATA, start=1):
        data = dict(item)
        img = data.pop("img", None)
        cat, created = Cat.objects.get_or_create(name=data["name"], defaults={"order": i, **data})
        img_rel = f"cats/{img}" if img else ""
        Cat.objects.filter(pk=cat.pk).update(image=img_rel)

    # 4. Reviews
    if not Review.objects.exists():
        Review.objects.bulk_create([Review(**r) for r in REVIEWS_DATA])

    # 5. Customer Gallery (Seed all 9 items and set priority timestamps)
    from django.utils import timezone
    import datetime
    now = timezone.now()

    for item in CUSTOMER_GALLERY_DATA:
        name = item["customer_name"]
        breed = item["dog_breed"]
        caption = item["caption"]
        photo = item.get("photo", "")
        video = item.get("video", "")
        priority = item.get("priority", 0)

        cg, created = CustomerGallery.objects.get_or_create(
            customer_name=name,
            dog_breed=breed,
            defaults={
                "caption": caption,
                "photo": photo,
                "video": video,
            }
        )
        if not created:
            update_kwargs = {}
            if photo:
                update_kwargs["photo"] = photo
            if video:
                update_kwargs["video"] = video
            if caption:
                update_kwargs["caption"] = caption
            if update_kwargs:
                CustomerGallery.objects.filter(pk=cg.pk).update(**update_kwargs)
        CustomerGallery.objects.filter(pk=cg.pk).update(created_at=now + datetime.timedelta(minutes=priority * 5))


class Command(BaseCommand):
    help = "Seed the database with the full original dogs, cats, reviews and customer gallery from the frontend."

    def handle(self, *args, **options):
        run_seed()
        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))

