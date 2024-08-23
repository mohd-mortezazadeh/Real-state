from django.utils.timezone import now, timedelta

from .models import OtpCode, VipSms
from .utils import send_notif_sms
from post_manager.models import PackageOption

# Delete Useless OtpCode
def delete_useless_otp_code():

	"""
		Delete useless code in otp_code table
		This function will be called every 5 minutes
		Call this function in the settings.py file
	"""
	print('ok')
	expired_date = now() - timedelta(minutes=5)
	OtpCode.objects.filter(request_date__lt=expired_date).delete()

#TODO this abouy payments
# def delete_useless_vip():
# 	expired_date = now() - timedelta(seconds=60)
# 	package_option = PackageOption.objects.filter(subject_type=0, created_at__lt=expired_date).delete()
# 	get_vip = VipSms.objects.all()
# 	if package_option.count() <= 1:
# 		data = get_vip.values('user__phone', 'ad')
# 		for k in data:
# 			ad_id = k['ad']
# 			if ad_id:
# 				code = ad_id + 1230
# 				send_notif_sms(k['user__phone'],code)
# 		get_vip.delete()

