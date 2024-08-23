from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from django.contrib import admin

from .forms import UserCreationForm, UserChangeForm
from .models import *


class UserAdmin(BaseUserAdmin):
	form = UserChangeForm
	add_form = UserCreationForm

	list_display = ('fullname', 'phone','role', 'status')
	list_filter =  ('role',)
	fieldsets = (None, {'fields': ('fullname','password','city','phone', 'email', 'role','avatar','company_name','rating','ad_count','nardeban_count','fori_count', 'vip_count','status', 'last_login','date_joined' )}),
	readonly_fields= ('last_login','date_joined')
	add_fieldsets = (None, {'fields': ('fullname' ,'phone','city','email', 'role','company_name','avatar', 'rating','ad_count','nardeban_count','fori_count', 'vip_count','status','password1', 'password2')}),

	search_fields =  ('fullname', 'email')
	ordering = ('fullname',)
admin.site.unregister(Group)
admin.site.register(User, UserAdmin)


class UserMetaAdmin(admin.ModelAdmin):
	def get_avatar(self, obj):
		return obj.user.avatar
	list_display = ('user', 'key', 'value', 'get_avatar')
	list_filter =  ('user',)
admin.site.register(UserMeta, UserMetaAdmin)


class OtpCodeAdmin(admin.ModelAdmin):
	list_display = ('phone', 'code', 'ip_address')
	list_filter =  ('phone',)
	readonly_fields = ('request_date',)
admin.site.register(OtpCode, OtpCodeAdmin)


class RoleAdmin(admin.ModelAdmin):
	list_display = ('name', 'display_name')
	list_filter =  ('name',)
	search_fields =  ('name',)
	ordering = ('name',)
admin.site.register(Role, RoleAdmin)


class ProvinceAdmin(admin.ModelAdmin):
	list_display = ('name', )
	list_filter =  ('name',)
	search_fields =  ('name',)
	ordering = ('name',)
admin.site.register(Province, ProvinceAdmin)


class CityAdmin(admin.ModelAdmin):
	list_display = ('name', 'province', 'slug')
	list_filter =  ('name',)
	search_fields =  ('name',)
	ordering = ('name',)
	prepopulated_fields = {'slug': ('name',)}
admin.site.register(City, CityAdmin)


class SectionAdmin(admin.ModelAdmin):
	list_display = ('name', 'city', 'slug')
	list_filter =  ('name',)
	search_fields =  ('name',)
	ordering = ('name',)
	prepopulated_fields = {'slug': ('name',)}
admin.site.register(Section, SectionAdmin)


class MediaUserAdmin(admin.ModelAdmin):
	list_display = ('user', 'file', 'subject_type')
	list_filter =  ('user',)
	search_fields =  ('id',)
	ordering = ('user',)
admin.site.register(MediaUser, MediaUserAdmin)


class RatingAdmin(admin.ModelAdmin):
	empty_value_display = '-empty-'
	list_display = ('rate', 'user')
	list_filter =  ('user',)
	search_fields =  ('id',)
	ordering = ('user',)
admin.site.register(Rating, RatingAdmin)


class CompanyAdmin(admin.ModelAdmin):
	def user_phone(self, obj):
		return obj.owner.phone
	list_display = ('owner', 'user_phone','name', 'status')
	list_filter =  ('owner',)
	search_fields =  ('name',)
	ordering = ('name',)
	
admin.site.register(Company, CompanyAdmin)


class TicketAdmin(admin.ModelAdmin):
	list_display = ('user', 'replied_to','title')
	list_filter =  ('user',)
	search_fields =  ('id',)
	ordering = ('user',)
	
admin.site.register(Ticket, TicketAdmin)



