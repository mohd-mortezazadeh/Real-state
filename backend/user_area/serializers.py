from rest_framework import serializers

from .models import City, Role, Company, Province

from post_manager.models import Ad, Order, Package


class RoleSerializer(serializers.ModelSerializer):
	class Meta:
		model = Role
		fields = "__all__"


class CitySerializer(serializers.ModelSerializer):
	ad_count = serializers.SerializerMethodField()
	province = serializers.SerializerMethodField()

	def get_province(self, obj):
		data = {
			"id": obj.province.id,
			"name": obj.province.name,
			"slug": obj.province.slug,
		}
		return data

	def get_ad_count(self, obj):
		count = Ad.objects.filter(section__city=obj, status=True).count()
		return count

	class Meta:
		model = City
		fields = "__all__"


class ProvinceSerializer(serializers.ModelSerializer):

	class Meta:
		model = Province
		fields = "__all__"


class CompanySerializer(serializers.ModelSerializer):
	phone = serializers.SerializerMethodField()

	def get_phone(self, obj):
		return obj.owner.phone
	
	class Meta:
		model = Company
		fields = "__all__"

#TODO These serializers for order and package ...
class OrderSerializer(serializers.ModelSerializer):
	"""
		- order: order of sorting
	"""
	user = serializers.HiddenField(default=serializers.CurrentUserDefault())
	package = serializers.PrimaryKeyRelatedField(queryset=Package.objects.all(), write_only=True)
	show_package = serializers.SerializerMethodField()

	def get_show_package(self, obj):
		get_package = obj.package
		data = {
			"id": get_package.id,
			"name": get_package.name,
		}
		return data
	
	class Meta:
		model = Order
		fields = "__all__"


class PackageSerializer(serializers.ModelSerializer):
	class Meta:
		model = Package
		fields = "__all__"

