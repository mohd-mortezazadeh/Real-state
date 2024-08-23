from django.db.models.signals import post_delete, post_save, pre_save
from django.utils.timezone import now, timedelta
from django.dispatch import receiver
from django.db import models
from blog.models import Canonical, Content, Schima, Meta

from user_area.models import User, Rating, MediaUser, Section, BaseModel, City
from user_area.utils import send_notif_sms


class Category(models.Model):
	"""
		- name: name of category
		(eg: apartment, villa, etc.)
	"""
	name = models.CharField(max_length=100)
	tab = models.CharField(max_length=100, blank = True, null = True)
	display_name = models.CharField(max_length=100)
	city = models.ManyToManyField(City, related_name='category_city')
	content = models.OneToOneField(Content, on_delete=models.CASCADE,related_name="content_blog", blank = True, null = True)
	status = models.BooleanField(default=True)
	canonical = models.ManyToManyField(Canonical, related_name="canonical")
	schima = models.ManyToManyField(Schima, related_name='schima')
	meta = models.ManyToManyField(Meta, related_name='meta')


	def __str__(self):
		return self.name
	
	class Meta:
		verbose_name = 'Category'
		verbose_name_plural = 'Categories'


class AdOption(models.Model):
	"""
		- category: category of option
		- name: name of option
		- display_name: display name of option
		(eg: parking, elevator, etc.)
	"""
	category = models.ManyToManyField(Category, related_name='options')
	name = models.CharField(max_length=100)
	display_name = models.CharField(max_length=100)

	def __str__(self):
		return self.name


class Ad(BaseModel):
	"""
		This model is for ads(post) of users
		admin can change status of ad to active or rejected
		if status is active, ad will be shown in website
	"""
	STATUS = (
		(-1, 'rejected'),
		(0, 'pending'),
		(1, 'active'),
	)
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ad_user")
	title = models.CharField(max_length=100, blank=True)
	description = models.TextField(blank=True)
	home_phone = models.CharField(max_length=11, blank=True, null=True)
	price = models.PositiveBigIntegerField(default=0) # price = 0 = tavafoghi
	slug = models.SlugField(max_length=255, allow_unicode=True)
	view = models.PositiveBigIntegerField(default=0)
	rating = models.ManyToManyField(Rating, related_name='ad_rating', blank=True)
	bookmark = models.ManyToManyField(User, related_name='post_bookmark', blank=True)
	lat_path = models.CharField(max_length=100, blank=True, null=True)
	lng_path = models.CharField(max_length=100, blank=True, null=True)
	category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='ad_category')
	media = models.ManyToManyField(MediaUser ,related_name='ad_media', blank=True)
	section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name="ad_section")
	options = models.ManyToManyField(AdOption, related_name='ad_option', blank=True)
	status = models.IntegerField(choices=STATUS, default=0)


	def __str__(self):
		return f"{self.title} - {self.id}"



class AdMeta(models.Model):
	"""
		- ad: ad of meta
		this model is for meta of ads like:
		- number of rooms
		- number of floors
		- etc.
	"""
	ad = models.ForeignKey(Ad, on_delete=models.CASCADE, related_name='ad_meta', blank=True, null=True)
	key = models.CharField(max_length=100)
	value = models.TextField()

	def get_value(self):
		return self.value
	
	def __str__(self):
		return self.key


#TODO models about payment
class Package(models.Model):
	"""
		- name: name of package
		- price: price of package
		- ad_count: count of ads
		- nardeban_count: count of nardeban
		- fori_count: count of fori
		- vip_count: count of vip
		a package includes all of the packages on the website
		a package for ads, nardeban, fori, vip
	"""
	name = models.CharField(max_length=100)
	price = models.PositiveBigIntegerField(default=0)
	description = models.TextField(blank=True)
	ad_count = models.IntegerField(default=1)
	nardeban_count = models.IntegerField(default=0)
	fori_count = models.IntegerField(default=0)
	vip_count = models.IntegerField(default=0)
	status = models.BooleanField(default=True)
	def __str__(self):
		return self.name


class Order(models.Model):
	STATUS = (
		(-1, 'failed'),
		(0, 'pending'),
		(1, 'complete'),)
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders_user")
	package = models.ForeignKey(Package, on_delete=models.CASCADE, default='',related_name="orders_package")
	ad = models.ForeignKey(Ad, on_delete=models.CASCADE, default='',related_name="orders_ad", blank=True, null=True)
	amount = models.PositiveBigIntegerField(default=0)
	created_at = models.DateTimeField(auto_now_add=True)
	status = models.IntegerField(choices=STATUS, default=0)

	def __str__(self):
		return self.user.fullname


class Payment(models.Model):
	STATUS = (
		(-2, 'unexpected_error'),
		(-1, 'failed'),
		(0, 'pending'),
		(1, 'completed'),
	)
	order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="payment_order")
	authority = models.CharField(max_length=255)
	card = models.CharField(max_length=100, blank=True, null=True)
	refid = models.IntegerField(blank=True, null=True)
	amount = models.PositiveBigIntegerField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)
	status = models.IntegerField(choices=STATUS, default=0)

	def __str__(self):
		return self.authority


class PackageOption(models.Model):
	TYPES =(
		(0, 'vip'),
		(1, 'nardeban'),
		(2, 'fori'),
	)
	ad = models.ForeignKey(Ad, related_name='ad_pack', on_delete=models.CASCADE)
	subject_type = models.CharField(choices=TYPES, max_length=50)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.ad.title
	

class VipSms(models.Model):
	"""
		- ad: ad of vip sms
		- user: user of vip sms
		- status: status of vip sms
		- created_at: created date of vip sms
	"""
	ad = models.ForeignKey(Ad, on_delete=models.CASCADE, related_name='vip_sms_ad')
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vip_sms_user')
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.ad.title
	
	class Meta:
		verbose_name = "vip sms"
		verbose_name_plural = "vip sms"


class Visitor(models.Model):
	ip_address = models.CharField(max_length=100)
	last_visit = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.ip_address

	class Meta:
		verbose_name = "visitor"
		verbose_name_plural = "visitors"

