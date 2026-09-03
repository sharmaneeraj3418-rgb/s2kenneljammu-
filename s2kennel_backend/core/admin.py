import csv
import re
from django.contrib import admin
from django.http import HttpResponse
from django.utils.html import format_html
from .models import Dog, Cat, Review, Enquiry, BookDog, CustomerGallery


def export_as_csv(description="Export Selected as CSV", fields=None, exclude=None, header=True):
    """
    Generic Django Admin action to export selected queryset records as a downloadable CSV spreadsheet.
    """
    def export(modeladmin, request, queryset):
        opts = modeladmin.model._meta
        field_names = [field.name for field in opts.fields]
        if fields:
            field_names = fields
        elif exclude:
            field_names = [f for f in field_names if f not in exclude]

        response = HttpResponse(content_type="text/csv; charset=utf-8")
        response["Content-Disposition"] = f'attachment; filename="{opts.verbose_name_plural.lower().replace(" ", "_")}.csv"'
        
        # Write UTF-8 BOM so Excel opens Hindi/Special chars cleanly
        response.write('\ufeff'.encode('utf8'))
        
        writer = csv.writer(response)
        if header:
            writer.writerow([opts.get_field(f).verbose_name if hasattr(opts, 'get_field') else f for f in field_names])
            
        for obj in queryset:
            row = []
            for field in field_names:
                val = getattr(obj, field, "")
                if callable(val):
                    val = val()
                row.append(str(val) if val is not None else "")
            writer.writerow(row)
        return response

    export.short_description = description
    export.__name__ = "export_as_csv"
    return export


@admin.register(Dog)
class DogAdmin(admin.ModelAdmin):
    list_display = ("thumb", "name", "breed", "size", "price_range", "available", "order", "created_at")
    list_editable = ("available", "order")
    list_filter = ("available", "size", "breed")
    search_fields = ("name", "breed", "description")
    ordering = ("order", "-created_at")
    actions = [export_as_csv("📥 Export Selected Dogs to CSV")]

    def thumb(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:45px;width:45px;object-fit:cover;border-radius:6px;" />', obj.image.url)
        return "-"
    thumb.short_description = "Photo"


@admin.register(Cat)
class CatAdmin(admin.ModelAdmin):
    list_display = ("thumb", "name", "breed", "size", "price_range", "available", "order", "created_at")
    list_editable = ("available", "order")
    list_filter = ("available", "size", "breed")
    search_fields = ("name", "breed", "description")
    ordering = ("order", "-created_at")
    actions = [export_as_csv("📥 Export Selected Cats to CSV")]

    def thumb(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:45px;width:45px;object-fit:cover;border-radius:6px;" />', obj.image.url)
        return "-"
    thumb.short_description = "Photo"


@admin.register(BookDog)
class BookDogAdmin(admin.ModelAdmin):
    list_display = ("full_name", "phone_contact", "email", "dog_breed", "visit_date", "status", "created_at")
    list_editable = ("status",)
    list_filter = ("status", "created_at", "dog_breed")
    search_fields = ("full_name", "phone", "email", "dog_breed", "message")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
    actions = [export_as_csv("📥 Export Selected Bookings to CSV / Excel")]

    def phone_contact(self, obj):
        clean_phone = re.sub(r'[^0-9]', '', obj.phone)
        if len(clean_phone) == 10:
            clean_phone = "91" + clean_phone
        return format_html(
            '<span>{}</span> <a href="https://wa.me/{}?text=Hello%20{},%20regarding%20your%20puppy%20booking%20at%20S2%20Kennel%20Jammu:" target="_blank" style="margin-left:6px; color:#25d366; font-weight:700; text-decoration:none;" title="Chat on WhatsApp">💬 WA</a>',
            obj.phone,
            clean_phone,
            obj.full_name
        )
    phone_contact.short_description = "Phone & WhatsApp"


@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "phone_contact", "email", "breed", "status", "contacted", "created_at")
    list_editable = ("status", "contacted")
    list_filter = ("status", "contacted", "created_at")
    search_fields = ("name", "phone", "email", "breed", "message")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
    actions = [export_as_csv("📥 Export Selected Enquiries to CSV / Excel")]

    def phone_contact(self, obj):
        clean_phone = re.sub(r'[^0-9]', '', obj.phone)
        if len(clean_phone) == 10:
            clean_phone = "91" + clean_phone
        return format_html(
            '<span>{}</span> <a href="https://wa.me/{}?text=Hello%20{},%20thank%20you%20for%20contacting%20S2%20Kennel%20Jammu:" target="_blank" style="margin-left:6px; color:#25d366; font-weight:700; text-decoration:none;" title="Chat on WhatsApp">💬 WA</a>',
            obj.phone,
            clean_phone,
            obj.name
        )
    phone_contact.short_description = "Phone & WhatsApp"


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("name", "dog_breed", "rating", "short_text", "approved", "created_at")
    list_editable = ("approved",)
    list_filter = ("approved", "rating", "created_at")
    search_fields = ("name", "dog_breed", "text")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
    actions = [export_as_csv("📥 Export Selected Reviews to CSV / Excel")]

    def short_text(self, obj):
        return (obj.text[:60] + "...") if len(obj.text) > 60 else obj.text
    short_text.short_description = "Review Message"


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


admin.site.site_header = "S2 Kennel Jammu • Admin Portal"
admin.site.site_title = "S2 Kennel Admin"
admin.site.index_title = "Kennel Operations & Management Dashboard"

# Enhance Admin Index with Live Analytics Context
_orig_index = admin.site.index

def _enhanced_admin_index(request, extra_context=None):
    extra_context = extra_context or {}
    try:
        extra_context["stats"] = {
            "dogs_count": Dog.objects.count(),
            "available_dogs": Dog.objects.filter(available=True).count(),
            "cats_count": Cat.objects.count(),
            "bookings_count": BookDog.objects.count(),
            "pending_bookings": BookDog.objects.filter(status="pending").count(),
            "enquiries_count": Enquiry.objects.count(),
            "pending_enquiries": Enquiry.objects.filter(status="new").count(),
            "reviews_count": Review.objects.count(),
            "pending_reviews": Review.objects.filter(approved=False).count(),
            "gallery_count": CustomerGallery.objects.count(),
        }
    except Exception:
        extra_context["stats"] = {}
    return _orig_index(request, extra_context=extra_context)

admin.site.index = _enhanced_admin_index

