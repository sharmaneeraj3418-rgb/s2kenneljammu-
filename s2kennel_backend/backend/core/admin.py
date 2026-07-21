from django.contrib import admin
from django.utils.html import format_html
from .models import Dog, Cat, Review, Enquiry, BookDog, CustomerGallery


@admin.register(Dog)
class DogAdmin(admin.ModelAdmin):
    list_display = ("thumb", "name", "breed", "size", "price_range", "available", "order")
    list_editable = ("available", "order")
    list_filter = ("available", "size", "breed")
    search_fields = ("name", "breed", "description")
    ordering = ("order", "-created_at")

    def thumb(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:45px;width:45px;object-fit:cover;border-radius:6px;" />', obj.image.url)
        return "-"
    thumb.short_description = "Photo"


@admin.register(Cat)
class CatAdmin(admin.ModelAdmin):
    list_display = ("thumb", "name", "breed", "size", "price_range", "available", "order")
    list_editable = ("available", "order")
    list_filter = ("available", "size", "breed")
    search_fields = ("name", "breed", "description")
    ordering = ("order", "-created_at")

    def thumb(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:45px;width:45px;object-fit:cover;border-radius:6px;" />', obj.image.url)
        return "-"
    thumb.short_description = "Photo"


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("name", "rating", "short_text", "approved", "created_at")
    list_editable = ("approved",)
    list_filter = ("approved", "rating")
    search_fields = ("name", "text")

    def short_text(self, obj):
        return (obj.text[:60] + "...") if len(obj.text) > 60 else obj.text
    short_text.short_description = "Review"


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "email", "breed", "visit_date", "contacted", "created_at")
    list_editable = ("contacted",)
    list_filter = ("contacted", "created_at")
    search_fields = ("name", "phone", "email", "breed", "message")
    readonly_fields = ("name", "phone", "email", "breed", "visit_date", "message", "created_at")


@admin.register(BookDog)
class BookDogAdmin(admin.ModelAdmin):
    list_display = ("full_name", "phone", "email", "dog_breed", "visit_date", "created_at")
    list_filter = ("created_at",)
    search_fields = ("full_name", "phone", "email", "dog_breed", "message")


@admin.register(CustomerGallery)
class CustomerGalleryAdmin(admin.ModelAdmin):
    list_display = ("thumb", "customer_name", "dog_breed", "caption", "created_at")
    search_fields = ("customer_name", "dog_breed", "caption")
    readonly_fields = ("created_at",)

    def thumb(self, obj):
        if obj.photo:
            return format_html('<img src="{}" style="height:45px;width:45px;object-fit:cover;border-radius:6px;" />', obj.photo.url)
        if obj.video:
            return format_html('<a href="{}">Video</a>', obj.video.url)
        return "-"
    thumb.short_description = "Media"


admin.site.site_header = "S2 Kennel Jammu - Admin Panel"
admin.site.site_title = "S2 Kennel Admin"
admin.site.index_title = "Manage Dogs, Cats, Reviews & Enquiries"
