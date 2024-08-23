from .authentication import get_user_by_token
from post_manager.models import Order, Payment, Package
from .zarinpal import *

class CreatePayment:
	def __init__(self, request):
		self.request = request
		self.user = get_user_by_token(request)

	def create_payment_from_order(serlf, order):
		order_ins = Order.objects.filter(id=order.id).first()
		payment = Payment.objects.create(order=order, amount=order_ins.amount)
		return payment

	def zp_from_payment(self, payment):
		try:
			description = "پرداخت از سایت ویلا ارزان"
			phone = self.user.phone
			data = send_request(self.request, payment.amount, description, phone)
			payment.authority = data['authority']
			payment.save()
			return data
		except:
			return False
		