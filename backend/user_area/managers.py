from django.contrib.auth.models import BaseUserManager



class UserManager(BaseUserManager):
	"""
		Manager for User abstract model to create user and superuser
	"""
	def create_user(self,fullname,phone, password):
		if not phone:
			raise ValueError('Users must have a phone number')

		if not fullname:
			raise ValueError('Users must have a name')
		
		user = self.model(fullname=fullname, phone=phone,)
		user.set_password(password)
		
		user.save(using=self._db)
		return user

	def create_superuser(self,fullname, phone,password):
		user = self.create_user(fullname=fullname,phone=phone,password=password)
		user.set_password(password)
		user.status = 1
		user.is_superuser = True
		user.save(using=self._db)
		return user
