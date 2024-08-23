from django.contrib import admin

from .models import *


class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'display_name', 'content', 'status')
    list_filter = ('name',)
    list_editable = ['content']
    search_fields = ('name',)
    ordering = ('name',)


admin.site.register(Category, CategoryAdmin)


class AdOptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'display_name')
    list_filter = ('name',)
    search_fields = ('name',)
    ordering = ('name',)


admin.site.register(AdOption, AdOptionAdmin)


class AdAdmin(admin.ModelAdmin):
    def get_city(self, obj):
        return obj.section.city.name

    def create_date(self, obj):
        return obj.created_at.strftime("%Y-%m-%d")

    def update_date(self, obj):
        return obj.update_at.strftime("%Y-%m-%d")

    list_display = ('user', 'title', 'price', 'get_city', 'section',
                    'category', 'status', 'create_date', 'update_date')
    list_filter = ('title',)
    search_fields = ('title',)
    ordering = ('title',)
    prepopulated_fields = {'slug': ('title',)}


admin.site.register(Ad, AdAdmin)


class AdMetaAdmin(admin.ModelAdmin):
    def get_category(self, obj):
        return obj.ad.category.name
    list_display = ('ad', 'key', 'value', 'get_category')
    list_filter = ('ad',)
    search_fields = ('ad',)
    ordering = ('ad',)


admin.site.register(AdMeta, AdMetaAdmin)


class PackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'ad_count',
                    'nardeban_count', 'fori_count', 'vip_count')
    list_filter = ('name',)
    search_fields = ('name',)
    ordering = ('name',)


admin.site.register(Package, PackageAdmin)


class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'package', 'amount', 'status', 'created_at')
    list_filter = ('user',)
    search_fields = ('id',)
    ordering = ('user',)


admin.site.register(Order, OrderAdmin)


class PaymentAdmin(admin.ModelAdmin):
    list_display = ('order', 'status', 'created_at')
    list_filter = ('card',)
    search_fields = ('id',)
    ordering = ('card',)


admin.site.register(Payment, PaymentAdmin)


class PackageOptionAdmin(admin.ModelAdmin):
    def create_date(self, obj):
        return obj.created_at.strftime("%Y-%m-%d")

    list_display = ('ad', 'create_date')
    list_filter = ('ad',)
    search_fields = ('ad',)
    ordering = ('ad',)


admin.site.register(PackageOption, PackageOptionAdmin)


class VipSmsAdmin(admin.ModelAdmin):
    list_display = ('ad', 'created_at')
    list_filter = ('ad',)
    search_fields = ('ad',)
    ordering = ('ad',)


admin.site.register(VipSms, VipSmsAdmin)


class VisitorAdmin(admin.ModelAdmin):
    list_display = ('ip_address', 'last_visit')
    list_filter = ('ip_address',)
    search_fields = ('ip_address',)
    ordering = ('ip_address',)


admin.site.register(Visitor, VisitorAdmin)
