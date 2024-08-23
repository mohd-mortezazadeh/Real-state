from django.contrib import admin

from .serializers import ArticleSerializer
from .models import *


# set title in admin panel
admin.site.site_header = 'villaarzan admin'
admin.site.site_title = 'villaarzan admin'
admin.site.index_title = 'villaarzan admin'


class CommentAdmin(admin.ModelAdmin):
    list_display = ('fullname', 'replied_to', 'is_admin')
    list_filter = ('fullname',)
    search_fields = ('fullname',)
    ordering = ('fullname',)


admin.site.register(Comment, CommentAdmin)


class ArticleAdmin(admin.ModelAdmin):
    def show_padcast(self, obj):
        data = ArticleSerializer(obj)
        return data.data['is_podcast']

    list_display = ('user', 'title', 'show_padcast')
    list_filter = ('user',)
    search_fields = ('user',)
    ordering = ('user',)
    prepopulated_fields = {'slug': ('title',)}


admin.site.register(Article, ArticleAdmin)


class ContactAdmin(admin.ModelAdmin):
    list_display = ('fullname', 'phone')
    list_filter = ('fullname',)
    search_fields = ('fullname',)
    ordering = ('fullname',)


admin.site.register(ContactUs, ContactAdmin)


class MetaAdmin(admin.ModelAdmin):
    empty_value_display = '-empty-'
    list_display = ('name', 'content', 'property_type', 'path')
    list_filter = ('name',)
    search_fields = ('name', 'path')
    ordering = ('name',)


admin.site.register(Meta, MetaAdmin)


class SchimaAdmin(admin.ModelAdmin):
    list_display = ('path', 'content')
    list_filter = ('path',)
    search_fields = ('path',)
    ordering = ('path',)


admin.site.register(Schima, SchimaAdmin)


class CanonicalAdmin(admin.ModelAdmin):
    list_display = ('path', 'url')
    list_filter = ('path',)
    search_fields = ('path',)
    ordering = ('path',)


admin.site.register(Canonical, CanonicalAdmin)


class ContentAdmin(admin.ModelAdmin):
    list_display = ('title', 'path', 'body')
    list_filter = ('title',)
    search_fields = ('title',)
    ordering = ('title',)


admin.site.register(Content, ContentAdmin)
