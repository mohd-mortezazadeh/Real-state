from kavenegar import *



def send_otp_code(phone, code):
	#? send sms to user
	# try:
	# 	api = KavenegarAPI('6362784C70776C357562616664687A364F3256574F4E69624D356965774163697672346A7461552F755A453D')
		
	# 	params = {
	# 		'sender': '', #optional
	# 		'template': 'otp',
	# 		'receptor': phone, #multiple mobile number, split by comma
	# 		'token': code,
	# 		'type': 'sms'
	# 	}
	# 	response = api.verify_lookup(params)
	# 	print(response)
	# except APIException as e:
	# 	print(e)
	# except HTTPException as e:
	# 	print(e)
	pass

#TODO about payment sms
def send_notif_sms(phone, adcode):
	try:
		api = KavenegarAPI('6362784C70776C357562616664687A364F3256574F4E69624D356965774163697672346A7461552F755A453D')
		
		params = {
			'sender': '', #optional
			'template': 'notif',
			'receptor': phone, #multiple mobile number, split by comma
			'type': 'sms',
			'token': adcode,
		}
		response = api.verify_lookup(params)
	except APIException as e:
		print(e)
	except HTTPException as e:
		print(e)
