from rest_framework.authentication import BasicAuthentication 
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.decorators import permission_classes
from django.contrib.auth.models import update_last_login
from rest_framework.exceptions import PermissionDenied
from django.views.decorators.csrf import csrf_protect
from rest_framework import generics, viewsets, status
from django.utils.timezone import utc, now, timedelta
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.sites.models import Site
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from django.db.models import F

import datetime, re

from .functions import create_hash_token, create_otp_code, CsrfExemptSessionAuthentication, get_user_info, check_user_is_active
from .serializers import CompanySerializer, RoleSerializer, CitySerializer, OrderSerializer, PackageSerializer
from .authentication import create_refresh_token, get_user_by_token, set_cookie_for_user
from .permissions import AllowAnyUser, IsAuthenticatedUser
from .models import User, Company, Role, City, OtpCode, Province
from .paginations import PageNumberAsLimitOffset
from .zarinpal import *
from .payment import *

from post_manager.models import Category, Ad, Order, Package, Payment, PackageOption, VipSms
from post_manager.serializers import AdSerializer, AdPreviewSerializer


#? First step of login check phone number
class CheckPhoneView(APIView):
	"""
		Check phone number if it's not exist create new user
		check if user exist (send otp code)
		check if user exist and has password
		check if user rejected or not
	"""
	permission_classes = [AllowAnyUser, ]
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def post(self, request):
		phone = request.data.get('phone')
		is_loggin = False
		has_password = False
		is_admin = False
	
		if not phone:
			return Response({'detail': 'لطفا شماره تماس را وارد کنید.', 'status': status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		
		if len(phone) != 11:
			return Response({'detail': 'شماره تلفن وارد شده صحیح نیست', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

		regex = re.compile(r'^09\d{9}$')
		if not regex.match(phone):
			return Response({'detail': 'شماره تلفن وارد شده صحیح نیست', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		
		user= User.objects.filter(phone=phone).first()
		if user:
			is_loggin = True
			if user.status == -1:
				return Response({'detail': 'حساب کاربری شما مسدود شده است', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

			if user.password:
				if user.role.name == 'admin':
					is_admin = True
				has_password = True
				return Response({"is_loggin": is_loggin, 'is_admin': is_admin, "has_password":has_password, 'detail': 'پسورد خود را وارد کنید', 'status':status.HTTP_200_OK}, status=status.HTTP_200_OK)
			
			hash_code = create_hash_token()
			create_otp_code(request, phone, hash_code)
			return Response({'is_loggin':is_loggin, 'is_admin': is_admin, 'has_password':has_password , 'token': hash_code, 'detail': 'کد تایید برای شما ارسال شد', 'status':status.HTTP_200_OK}, status=status.HTTP_200_OK)
		
		return Response({'is_loggin':is_loggin, 'is_admin': is_admin, 'has_password':has_password, 'detail': 'شماره تلفن وارد شده در سیستم موجود نیست', 'status':status.HTTP_200_OK}, status=status.HTTP_200_OK)


#? Second step of login check otp code
class AuthenticatedView(APIView):
	"""
		register user and send otp code
	"""
	permission_classes = [AllowAnyUser]
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def post(self, request):
		phone = request.data.get('phone')
		is_loggin = False

		user= User.objects.filter(phone=phone).first()
		if user:
			return Response({'detail': 'شماره تلفن وارد شده در سیستم موجود است', 'status':status.HTTP_200_OK}, status=status.HTTP_200_OK)

		if len(phone) != 11:
			return Response({'detail': 'شماره تلفن وارد شده صحیح نیست', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

		role = Role.objects.filter(id=request.data.get('role')).first()
		if not role:
			return Response({'detail': 'نقش را وارد کنید', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

		roles = [3, 4, 5, 6] # 3= advisor(moshaver), 4= real_estate(daftar), 5= owner(malek/kharidar), 6= free_advisor(moshaverazad)
		if role.id not in roles:
			return Response({'detail': 'نقش وارد شده صحیح نیست', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

		fullname = request.data.get('fullname')
		city = request.data.get('city')
		
		if not fullname:
			return Response({'detail': 'لطفا نام را وارد کنید', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		
		if  2 >= len(fullname) or len(fullname) > 50:
			return Response({'detail': 'نام وارد شده باید بیشتر از 2 کاراکتر باشد', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

		if not city:
			return Response({'detail': 'لطفا شهر را وارد کنید', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

		city = City.objects.filter(id=city).first()
		if not city:
			return Response({'detail': 'شهر وارد شده معتبر نیست', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

		get_company = request.data.get('company_name')
		if role.id == 3 or role.id == 4: # Real_estate(daftarAmlak) / advisor(moshaverAmlak)
			if not get_company:
				return Response({'detail': 'لطفا نام شرکت را وارد کنید', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

		if role.id == 3: # advisor
			company_instance = Company.objects.filter(id=get_company).first()
			if not company_instance:
				return Response({'detail': 'شرکت وارد شده معتبر نیست', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
				
			if company_instance.status == 0:
				return Response({'detail': 'شرکت وارد شده فعال نیست', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

		if role.id == 6 or role.id ==5: # Free_advisor, owner
			company_instance = None

		# Create hash code for phone number
		hash_code = create_hash_token()
		create_otp_code(request, phone, hash_code)
		
		return Response({"is_loggin": is_loggin, 'detail': 'کد تایید برای شما ارسال شد', 'token': hash_code,'status':status.HTTP_200_OK}, status=status.HTTP_200_OK)


#? Verify code 
class VerifyCodeView(APIView):
	"""
		Verify code for register
		Verify code for login
		Verify code for reset password
	"""
	permission_classes = [AllowAnyUser]
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
	
	def post(self, request):
		phone = request.data.get('phone')
		fullname = request.data.get('fullname')
		role = request.data.get('role')
		city = request.data.get('city')
		company = request.data.get('company_name')
		token = request.data.get('token')
		code = request.data.get('code')

		role =Role.objects.filter(id=role).first()
		city = City.objects.filter(id=city).first()

		if not phone:
			return Response({'detail': 'لطفا شماره تلفن را وارد کنید', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

		if not code:
			return Response({'detail': 'لطفا کد تایید را وارد کنید', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		
		check_code = OtpCode.objects.filter(phone=phone, token=token, code=code).first()
		if not check_code:
			return Response({'detail': 'کد تایید نامعتبر است', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		
		if not check_code.code:
			return Response({'detail': 'کد تاییدی برای شما ارسال نشده است', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		
		user = User.objects.filter(phone=phone).first()
		if user:
			if check_code.code == code:
				check_code.delete()
				update_last_login(None, user)
				refresh_token = create_refresh_token(user.id, user.fullname, user.role.id, user.phone, user.city.name)
				response = set_cookie_for_user(request, refresh_token)
				response.data = {
					'detail': 'یوزر با موفقیت وارد شد',
					'status':status.HTTP_200_OK,
				}
				return response
			else:
				return Response({'detail': 'کد تایید صحیح نیست', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
	
		if not fullname:
			return Response({'detail': 'لطفا نام را وارد کنید', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

		if not role:
			return Response({'detail': 'لطفا نقش را وارد کنید', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		
		if not city:
			return Response({'detail': 'لطفا شهر را وارد کنید', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)


		expire_date = check_code.request_date
		expire_date = expire_date + timedelta(minutes=2)

		if expire_date < datetime.datetime.utcnow().replace(tzinfo=utc):
			check_code.delete()
			return Response({'detail': 'کد تایید منقضی شده است', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

		if check_code.code == code:
			user = User.objects.create(
				phone=phone, 
				fullname=fullname, 
				role=role, 
				city=city
				)
			check_code.delete()

			if role.id == 4: # Real_estate/ daftarAmlak
				company = Company.objects.create(
					name=company,
					owner=user
				)
				user.company_name = company
				user.status = 0
				user.save()
			
			if role.id == 3: # Advisor
				company_instance = Company.objects.filter(id=company).first()
				user.company_name = company_instance
				user.status = 0
				user.save()
			
			refresh_token = create_refresh_token(user.id, fullname, role.id, phone, city.name)
			response = set_cookie_for_user(request, refresh_token)
			response.data = {
				'message': 'ثبت نام با موفقیت انجام شد',
				'status':status.HTTP_200_OK,
			}
			return response

		return Response({'detail': 'کد تایید نامعتبر است', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)


#? Check Password 
class CheckPasswordView(APIView):
	"""
		check password if user save password
	"""
	permission_classes = [AllowAnyUser]
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def post(self, request):
		phone = request.data.get('phone')
		password = request.data.get('password')

		if not phone:
			return Response({'detail': 'لطفا شماره تلفن را وارد کنید', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
			
		if not password:
			return Response({'detail': 'لطفا رمز عبور را وارد کنید', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		
		user = User.objects.filter(phone=phone).first()
		if not user:
			return Response({'detail': 'کاربری با این شماره وجود ندارد', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		
		if not user.check_password(password):
			return Response({'detail': 'رمز عبور اشتباه است', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

		if user.check_password(password):
			update_last_login(None, user)
			if user.role.id == 1:
				refresh_token = create_refresh_token(user.id, user.fullname, user.role.id, user.phone, user.city)
			else:
				refresh_token = create_refresh_token(user.id, user.fullname, user.role.id, user.phone, user.city.name)
			refresh_token = refresh_token.decode('utf-8')
			response = set_cookie_for_user(request, refresh_token)
			response.data = {
				'detail': 'یوزر با موفقیت وارد شد',
				'status':status.HTTP_200_OK,
			}
			return response

#? Forgot Password
class ForgotPasswordView(APIView):
	"""
		forgot password if user forget password
	"""
	permission_classes = [AllowAnyUser]
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def post(self, request):
		phone = request.data.get('phone')
		if not phone:
			return Response({'detail': 'لطفا شماره تلفن را وارد کنید', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		
		user = User.objects.filter(phone=phone).first()
		if not user:
			return Response({'detail': 'کاربری با این شماره وجود ندارد', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		
		if user:
			hash_code = create_hash_token()
			create_otp_code(request, phone, hash_code)
			return Response({'detail': 'کد تایید برای شما ارسال شد', 'token': hash_code,'status':status.HTTP_200_OK}, status=status.HTTP_200_OK)


#? logout user
class LogoutView(APIView):
	"""
		logout user and delete cookie
	"""
	permission_classes = [IsAuthenticatedUser]
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def post(self, request):
		response = Response()
		# current_site = Site.objects.get_current()
		# current_site = f".{current_site.domain}"
		response.delete_cookie('Authorization') #!TODO domain=current_site (this is for production)
		response.data = {
			'message': 'خروج با موفقیت انجام شد',
			'status':status.HTTP_200_OK,
		}
		return response

	def permission_denied(self, request, message=None, code=None):
		raise PermissionDenied(message)


#? check user
class UserView(APIView):
	"""
		check user if user login
		check user info
	"""
	permission_classes = [IsAuthenticatedUser]
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def get(self, request):
		user = get_user_by_token(request)
		if user:
			return Response({
				'data':get_user_info(user)
			})
			
		else:
			return Response({'detail': 'کاربری یافت نشد', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		
	def permission_denied(self, request, message=None, code=None):
		raise PermissionDenied(message)


#? check role for user
class RoleView(APIView):
	"""
		show all roles for user
	"""
	permission_classes = [AllowAnyUser]
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def get(self, request):
		roles = Role.objects.all()
		serializer = RoleSerializer(roles, many=True)
		return Response(serializer.data)
		

#? city user
class CityView(APIView):
	"""
		show all cities for user
	"""
	permission_classes = [AllowAnyUser]
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def get(self, request):
		cities = City.objects.all()
		# show province object in city

		category = request.query_params.get('category')
		if category:
			# filter city by category
			get_category = Category.objects.filter(id=category)
			cities = get_category.values_list('city', flat=True)
			cities = City.objects.filter(id__in=cities)
			
		serializer = CitySerializer(cities, many=True)

		return Response(serializer.data)
		

#? company user
class CompanyView(generics.ListAPIView):
	"""
		show all companies for real estate
		show all companies for user and filter by status
	"""
	permission_classes = [AllowAnyUser]
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
	serializer_class = CompanySerializer

	def get(self, request):
		queryset = Company.objects.all()
		status = request.query_params.get('status')
		if status:
			queryset = queryset.filter(status=status)
		serializer = CompanySerializer(queryset, many=True)
		return Response(serializer.data)


#TODO Payment user
class OrderPaymentView(viewsets.ModelViewSet):
	"""
		This viewset automatically provides orders and payment
		Save order and payment
	"""
	permission_classes = [IsAuthenticatedUser]
	queryset = Order.objects.all()
	serializer_class = OrderSerializer
	pagination_class = PageNumberAsLimitOffset
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def get_queryset(self):
		user = get_user_by_token(self.request)
		order = Order.objects.filter(user=user)
		return order

	def create(self, request, *args, **kwargs):
		user = get_user_by_token(request)
		check_user_is_active(user)

		package = request.data.get('package')
		if not package:
			return Response({'detail': 'لطفا پکیج را انتخاب کنید', 'status':status.HTTP_405_METHOD_NOT_ALLOWED}, status=status.HTTP_400_BAD_REQUEST)		
		
		package_ins = Package.objects.get(id=package)

		free_package_id = [3,4,5]
		ad_id = request.data.get('ad_id')
		ad_ins = Ad.objects.get(id=ad_id)

		if package in free_package_id:
			order = Order.objects.create(user=user, package=package_ins, amount=package_ins.price, ad=ad_ins)

		
		elif package == 6:
			expired_date = now() - timedelta(seconds=60)
			check_ad = PackageOption.objects.filter(subject_type=0, created_at__gte=expired_date)
			if check_ad.count() == 2:	
				return Response({
					'detail': "به من خبر بده", 
					'status':status.HTTP_405_METHOD_NOT_ALLOWED}, 
					status=status.HTTP_405_METHOD_NOT_ALLOWED)
					
			order = Order.objects.create(user=user, package=package_ins, amount=package_ins.price, ad=ad_ins)

		else:
			order = Order.objects.create(user=user, package=package_ins, amount=package_ins.price)

		payment = CreatePayment(request)
		if order:
			payment_instance = payment.create_payment_from_order(order)
			if payment:
				zp = payment.zp_from_payment(payment_instance)
				if zp:
					return Response({'zp':zp, 'status':status.HTTP_200_OK}, status=status.HTTP_200_OK)
				else:
					payment_instance.status = -2
					payment_instance.save()
					order.status = -1
					order.save()
					return Response({'detail': 'پرداخت با خطا مواجه شد', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
			else:
				return Response({'detail': 'پرداخت با خطا مواجه شد', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		else:
			return Response({'detail': 'سفارشی یافت نشد', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

	def permission_denied(self, request, message=None, code=None):
		raise PermissionDenied(message)
	

class VerifyView(APIView):
	permission_classes = [AllowAnyUser]
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def get(self, request):
		authority = request.GET.get('Authority')
		if authority:
			payment = Payment.objects.get(authority=authority)
			zp_verify = verify(payment.amount, authority)
			order = payment.order
			package_ins = order.package
			user = order.user
			if zp_verify['status']:
				user = User.objects.filter(id=user.id).update(ad_count=F('ad_count') + package_ins.ad_count, nardeban_count=F('nardeban_count') + package_ins.nardeban_count)
				payment.status = 1
				payment.save()
				order.status = 1
				order.save()
				if package_ins.id == 4 or package_ins.id == 5:
					PackageOption.objects.create(
					ad=order.ad,
					subject_type = 1,
				)
				if package_ins.id == 6:
					PackageOption.objects.create(
					ad=order.ad,
					subject_type = 0,
				)
				
				return Response({'detail': 'پرداخت با موفقیت انجام شد', 'status':status.HTTP_200_OK}, status=status.HTTP_200_OK)
			else:
				payment.status = -1 
				payment.save()
				order.status = -1
				order.save()
				return Response({'detail': 'پرداخت با خطا مواجه شد', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		else:
			return Response({'detail': 'پرداخت با خطا مواجه شد', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)


class AddPackageView(APIView):
	permission_classes = [IsAuthenticatedUser]
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def get_permissions(self):
		if self.request.method == 'GET':
			self.permission_classes = [AllowAnyUser]
		return super().get_permissions()

	def get(self, request):
		packages = Package.objects.all()

		all_package = request.GET.get('all_package')
		if all_package:
			packages = Package.objects.filter(status=True)
		
		free_package = request.GET.get('free_package')
		if free_package:
			packages = Package.objects.filter(status=False)

		serializer = PackageSerializer(packages, many=True)
		return Response(serializer.data)

	def post(self, request):
		user = get_user_by_token(request)
		check_user_is_active(user)

		subject_type = request.data.get('subject_type')
		post_id = request.data.get('post_id')

		if not post_id:
			return Response({'detail': 'لطفا آگهی را انتخاب کنید', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		
		ad_ins = Ad.objects.get(id=post_id)
		if not ad_ins:
			return Response({'detail': 'آگهی یافت نشد', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		
		if ad_ins.user != user:
			return Response({'detail': 'شما اجازه دسترسی به این آگهی را ندارید', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)
		
		get_user = User.objects.filter(id=user.id, nardeban_count__gt=0)
		if get_user:
			User.objects.filter(id=user.id).update(nardeban_count=F('nardeban_count') - 1)
		else:
			return Response({
				'detail': 'تعداد نردبان شما به اتمام رسیده است',
				'status':status.HTTP_402_PAYMENT_REQUIRED}
				, status=status.HTTP_402_PAYMENT_REQUIRED)

		if subject_type:
			PackageOption.objects.create(
				ad=ad_ins,
				subject_type = subject_type,
			)
			
		else:
			return Response({'detail': 'انتخاب کن', 'status':status.HTTP_400_BAD_REQUEST}, status=status.HTTP_400_BAD_REQUEST)

			
		return Response({'detail':"اعمال شد", 'status':status.HTTP_201_CREATED},
		  	status=status.HTTP_201_CREATED)

	def permission_denied(self, request, message=None, code=None):
		raise PermissionDenied(message)

class AdVipView(viewsets.ModelViewSet):
	permission_classes = [AllowAnyUser]
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
	queryset = Ad.objects.all()
	serializer_class = AdSerializer

	def get_serializer_class(self):
		if self.action == 'list':
			return AdPreviewSerializer
		elif self.action == 'retrieve':
			return AdSerializer
		else:
			return AdSerializer
		
	def get_queryset(self):
		expired_date = now() - timedelta(days=7)
		check_ad = PackageOption.objects.filter(subject_type=0, created_at__gte=expired_date)
		ads = Ad.objects.filter(id__in=check_ad.values('ad'))
		return ads
		
		
class VipNotifView(APIView):
	permission_classes = [IsAuthenticatedUser]
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def post(self, request):
		user = get_user_by_token(request)
		check_user_is_active(user)
		ad = Ad.objects.get(id=request.data.get('ad_id'))
		VipSms.objects.create(user=user, ad=ad)
		return Response({'detail':"اعمال شد", 'status':status.HTTP_201_CREATED},
		  	status=status.HTTP_201_CREATED)

	def permission_denied(self, request, message=None, code=None):
		raise PermissionDenied(message)



