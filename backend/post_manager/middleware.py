from user_area.authentication import set_cookie_for_user
from django.utils import timezone
from datetime import timedelta

from .models import Visitor


class GuestUserCheckMiddleware:

	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		response = self.get_response(request)
		return response

	def process_view(self, request, view_func, view_args, view_kwargs):
		if request.COOKIES.get('Authorization') is None:
			if request.session.session_key is None:
				request.session.save()
				
			jwt = request.session.session_key
			set_cookie_for_user(request, jwt)
		

		ip_address = request.META.get('REMOTE_ADDR')

		# get view basename
		path = request.path
		if path == '/post/' or path == '/category':
			visitor = Visitor.objects.filter(ip_address=ip_address, last_visit__gte=timezone.now() - timedelta(days=1))
			if not visitor.exists():
				Visitor.objects.create(ip_address=ip_address, last_visit=timezone.now())
			else:
				visitor.update(last_visit=timezone.now())


