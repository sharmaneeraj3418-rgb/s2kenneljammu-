import os
import shutil
from django.core.management.base import BaseCommand
from django.conf import settings
from core.models import CustomerGallery

class Command(BaseCommand):
    help = 'Add new customer gallery photos from uploads'

    def handle(self, *args, **options):
        upload_dir = r"C:\Users\sharm\.gemini\antigravity-ide\brain\da4e3331-dbcd-4771-a578-caaa8966c11f\.user_uploaded"
        media_photo_dir = os.path.join(settings.MEDIA_ROOT, "customer_gallery", "photos")
        backend_media_photo_dir = os.path.join(settings.BASE_DIR, "backend", "media", "customer_gallery", "photos")

        os.makedirs(media_photo_dir, exist_ok=True)
        os.makedirs(backend_media_photo_dir, exist_ok=True)

        new_entries = [
            {
                "src_file": "media_1788600139144.jpg",
                "target_filename": "customer_persian_kitten1.jpg",
                "customer_name": "Ananya Sharma",
                "dog_breed": "Persian White Kitten",
                "caption": "Adopted this lovely blue-eyed kitten from S2 Kennel. Super active and healthy!"
            },
            {
                "src_file": "media_1788600146482.jpg",
                "target_filename": "customer_shihtzu1.jpg",
                "customer_name": "Sneha Gupta",
                "dog_breed": "Shih Tzu Puppy",
                "caption": "Got my adorable Shihtzu fur baby from S2 Kennel Jammu. Absolutely in love!"
            },
            {
                "src_file": "media_1788600160996.jpg",
                "target_filename": "customer_germanshepherd1.jpg",
                "customer_name": "Manpreet Singh",
                "dog_breed": "German Shepherd Puppy",
                "caption": "Brought home this strong and playful GSD puppy from S2 Kennel Vijaypur!"
            }
        ]

        for entry in new_entries:
            src_path = os.path.join(upload_dir, entry["src_file"]) if os.path.exists(upload_dir) else ""
            dest_path1 = os.path.join(media_photo_dir, entry["target_filename"])
            dest_path2 = os.path.join(backend_media_photo_dir, entry["target_filename"])

            if src_path and os.path.exists(src_path):
                if not os.path.exists(dest_path1):
                    shutil.copy2(src_path, dest_path1)
                if not os.path.exists(dest_path2):
                    shutil.copy2(src_path, dest_path2)
                self.stdout.write(self.style.SUCCESS(f"Processed {entry['target_filename']}"))

            rel_media_path = f"customer_gallery/photos/{entry['target_filename']}"

            obj, created = CustomerGallery.objects.get_or_create(
                customer_name=entry["customer_name"],
                dog_breed=entry["dog_breed"],
                defaults={
                    "caption": entry["caption"],
                    "photo": rel_media_path,
                }
            )
            if not created:
                obj.caption = entry["caption"]
                obj.photo = rel_media_path
                obj.save()
                self.stdout.write(self.style.SUCCESS(f"Updated CustomerGallery: {obj.customer_name} (ID: {obj.id})"))
            else:
                self.stdout.write(self.style.SUCCESS(f"Created CustomerGallery: {obj.customer_name} (ID: {obj.id})"))

        self.stdout.write("\n--- ALL Customer Gallery Items ---")
        for g in CustomerGallery.objects.all().order_by('-created_at'):
            self.stdout.write(f"ID={g.id} | Name={g.customer_name} | Breed={g.dog_breed} | Photo={g.photo} | Video={g.video}")
