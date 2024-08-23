from django.urls import path, include
from rest_framework import routers

from .views import  *



app_name = "user_area"
router = routers.SimpleRouter()
#TODO about order and vip ad
router.register('order', OrderPaymentView, basename='order')
router.register('ad-vip', AdVipView, basename='ad_vip')

urlpatterns = [
    path('', include(router.urls)),

    path('auth', CheckPhoneView.as_view(), name='auth'),
    path('info', AuthenticatedView.as_view(), name='info'),
    path('verify', VerifyCodeView.as_view(), name='verify'),
    path('logout', LogoutView.as_view(), name='logout'),

    path('password', CheckPasswordView.as_view(), name='password'),
    path('forgot-pass', ForgotPasswordView.as_view(), name='forgot_pass'),
    
    path('user', UserView.as_view(), name='user'),
    path('role', RoleView.as_view(), name='role'),
    path('city', CityView.as_view(), name='city'),
    path('company', CompanyView.as_view(), name='company'),

    # TODO about payment
	path('verify/', VerifyView.as_view(), name='verify'),
	path('add-package', AddPackageView.as_view(), name='add_package'),
	path('vip-notif', VipNotifView.as_view(), name='vip_notif'),
]
