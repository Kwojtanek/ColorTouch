# coding=utf-8
from django.contrib import admin
from .models import *
# Register your models here.
admin.site.site_header = 'Panel dowodzenia wszechświatem.'


def singleton_check():
    single = Informations.objects.count()
    return False if single >= 1 else True


class AdminInformation(admin.ModelAdmin):
    def has_add_permission(self, request):
        return singleton_check()

    def has_change_permission(self, request, obj=None):
        return not singleton_check()

    def has_delete_permission(self, request, obj=None):
        return False

    class Media:
        css = {
            'all': ('css/disable_save_and_continuue_editing_button.css',)
        }





class AdminPatternPhotos(admin.StackedInline):
    model = PatternPhoto


class AdminPattern(admin.ModelAdmin):
    inlines = (AdminPatternPhotos, )

class AdminGalleryPhotos(admin.StackedInline):
    model = GalleryPhoto


class AdminGallery(admin.ModelAdmin):
    inlines = (AdminGalleryPhotos, )

admin.site.register(Informations, AdminInformation)
admin.site.register(Pattern, AdminPattern)
admin.site.register(Gallery, AdminGallery)
admin.site.register(ContactForm)