from rest_framework.authentication import SessionAuthentication 
from rest_framework.exceptions import PermissionDenied
from rest_framework.validators import ValidationError
from django.utils.crypto import get_random_string
from rest_framework.response import Response
from rest_framework import status
import random

from .models import OtpCode, UserMeta
from .utils import send_otp_code

from post_manager.serializers import MediaUserSerializer, UserMetaSerializer
from post_manager.models import Order

#? Create hash token
def create_hash_token():
	"""
		Generate a random string of 25 characters
		This will be used as the hash token for the OTP code 
	"""
	hash_str= "000005fab4534d05api_key9a0554259914a86fb9e7eb014e4e5d52permswrite"
	hash_str = ("".join(random.sample(hash_str, 25)))
	return hash_str


#? Create OtpCode
def create_otp_code(request, phone, token):
	"""
		Create a code for sms verification
	"""
	x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
	if x_forwarded_for:
		ip_address = x_forwarded_for.split(',')[-1].strip()
		return Response({'detail': "وی پی ان خود را قطع کنید سپس وارد شوید", 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
	else:
		ip_address = request.META.get('REMOTE_ADDR')
	
	# check_ip = OtpCode.objects.filter(ip_address=ip_address)
	random_code = get_random_string(length=4, allowed_chars='1234567890')
	
	check_ip = OtpCode.objects.filter(ip_address=ip_address)
	for qs in check_ip:
		if ip_address == qs.ip_address:
			if check_ip.count() > 2:
				raise ValidationError({'detail': "تعداد درخواست های شما بیشتر از حد مجاز است بعد از 5 دقیقه دوباره تلاش کنید"})

		if phone == qs.phone:
			get_code = qs.code
			otp_code = OtpCode.objects.create(phone=phone, token=token, code=get_code, ip_address=ip_address)
			return otp_code
				
	otp_code = OtpCode.objects.create(phone=phone, token=token, code=random_code, ip_address=ip_address)
	send_otp_code(phone, random_code)
	return otp_code


#? get user info
def get_user_info(user):
	role = {
		'id': user.role.id,
		'name': user.role.name,
		"display_name": user.role.display_name,
	}
	if user.role.id == 1:
		city = None
	else:
		city = {
			'id': user.city.id,
			'name': user.city.name,
		}
	
	roles = [1,2,5,6]
	if user.role.id in roles:
		company_name = ""
	else:
		company_name = {
			'id': user.company_name.id,
			'name': user.company_name.name,
			'username': user.company_name.owner.fullname,
			'phone': user.company_name.owner.phone,
		}

	# get avatar
	avatar = user.avatar
	if avatar:
		avatar = MediaUserSerializer(avatar).data

	
	# get user meta
	user_meta = UserMeta.objects.filter(user=user)
	# show all user meta for this user
	if user_meta:
		data = UserMetaSerializer(user_meta, many=True).data
	else:
		data = None
	
	# get status id and name
	status = {
		'id': user.status,
		'name': user.get_status_display(),
	}

	# check has password
	if user.password:
		has_password = True
	else:
		has_password = False

	# TODO about payment
	# get nardeban and ad count from user
	nardeban_count = user.nardeban_count
	ad_count = user.ad_count
	order_count = Order.objects.filter(user=user).count()

	data = {
		'id': user.id,
		'fullname': user.fullname,
		'phone': user.phone,
		'role': role,
		'city': city,
		'company_name': company_name,
		'avatar': avatar,
		'user_meta': data,
		'has_password': has_password,
		'status': status,
		'nardeban_count': nardeban_count,
		'ad_count': ad_count,
		'order_count': order_count,
	}
	return data


#? Check user is active
def check_user_is_active(user):
	if user.status != 1:
		raise PermissionDenied('حساب کاربری شما فعال نیست')


#! Handle the csrf error for production
class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return
    
