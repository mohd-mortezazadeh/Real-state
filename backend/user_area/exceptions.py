# from rest_framework.views import exception_handler
# from django.http import JsonResponse
# from rest_framework import status

# from copy import deepcopy


# def detail_exception_handler(exc, context):
# 	# Call REST framework's default exception handler first,
# 	# to get the standard error response.
# 	response = exception_handler(exc, context)
# 	try:
# 		if 'file' in response.data:
# 			data = deepcopy(response.data)

# 			code = data['file'][0].code
# 			detail = data.pop('file')
# 			message = detail[0]

# 			match code:
# 				case 'required':
# 					message = 'گروه اجباری است'
# 					data['file'] = message

# 				case 'does_not_exist':
# 					message = 'گروه نامعتبر است'
# 					data['file'] = message
				
# 				case 'null':
# 					message = 'گروه نمی تواند خالی باشد'
# 					data['file'] = message

# 				case 'invalid':
# 					message = 'فایل نامعتبر است'
# 					data['file'] = message

# 			response.data = data
# 	except:
# 		return response

# 	return response



#! Handle all errors
# def custom_exception_handler(exc, context):
# 	response = exception_handler(exc, context)
# 	handlers = {
# 		'ValidationError': _handle_generic_error,
# 		'NotFound': _handle_not_found,
# 		'MethodNotAllowed': _handle_method_not_allowed,
# 		'AuthenticationFailed': _handle_authentication_failed,
# 		'NotAuthenticated': _handle_not_authenticated,
# 		'ParseError': _handle_parse_error,
# 	}

# 	if response is not None:
# 		response.data['status'] = response.status_code

# 	exception_class = exc.__class__.__name__
# 	if exception_class in handlers:
# 		return handlers[exception_class](exc, context, response)
# 	return response


# def _handle_authentication_failed(exc, context, response):
# 	response.data = {
# 		'message': "نام کاربری یا رمز عبور اشتباه است",
# 		'status': response.status_code,
# 	}
# 	return response

# def _handle_not_authenticated(exc, context, response):
# 	response.data = {
# 		'message': "لطفا ابتدا وارد شوید",
# 		'status': response.status_code,
# 	}
# 	return response

# def _handle_method_not_allowed(exc, context, response):
# 	response.data = {
# 		'message': "از این متد پشتیبانی نمی شود",
# 		'status': response.status_code,
# 	}
# 	return response

# def _handle_generic_error(exc, context, response):
# 	response.data = {
# 		'message': response.data,
# 		'status_code': response.status_code,
# 	}
# 	return response

# def _handle_not_found(exc, context, response):
# 	response.data = {
# 		'message': "موردی یافت نشد",
# 		'status': response.status_code,
# 	}
# 	return response

# def _handle_parse_error(exc, context, response):
# 	response.data = {
# 		'message': "خطا در دریافت اطلاعات",
# 		'status': response.status_code,
# 	}
# 	return response


# def error_404(request, exception):
# 	data = {
# 		'message': 'آدرس اشتباه',
# 		'status': status.HTTP_404_NOT_FOUND,
# 	}
# 	return JsonResponse(data=data, status=status.HTTP_404_NOT_FOUND)


# def error_500(request):
# 	data = {
# 		'message': 'خطای سرور',
# 		'status': status.HTTP_500_INTERNAL_SERVER_ERROR,
# 	}
# 	return JsonResponse(data=data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
