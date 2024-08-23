from django.contrib.sites.models import Site
from rest_framework.response import Response
from rest_framework import exceptions

import jwt, datetime

from .models import User

 

#? Create token
def create_refresh_token(id, fullname, role, phone, city):
    return jwt.encode({
		'phone': phone,
		'city': city,
        'user_id': id,
        'fullname': fullname,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=90),
    }, 'SECRET_KEY', algorithm='HS256')


#? Decode refresh token
def decode_refresh_token(token):
    try:
        payload = jwt.decode(token, 'SECRET_KEY', algorithms='HS256')
        return payload
    except:
        raise exceptions.AuthenticationFailed('باید وارد شوید')

#? Set Cookie
def set_cookie_for_user(request, refresh_token):
    response = Response()
    # current_site = Site.objects.get_current()
    # current_site = f".{current_site.domain}"
    response.set_cookie(key='Authorization', value=refresh_token,httponly=True, samesite='None'
    ,expires=datetime.datetime.utcnow() + datetime.timedelta(days=91)) #!TODO domain=current_site (for production)
    return response


#? Get user by jwt token
def get_user_by_token(request):
    refresh_token = request.COOKIES.get('Authorization')
    if refresh_token:
        refresh_decode = decode_refresh_token(refresh_token)
        user = User.objects.filter(phone=refresh_decode['phone']).first()
        return user
    
    return None

