from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.core.exceptions import ValidationError
from django import forms

from .models import User


class UserCreationForm(forms.ModelForm):
	"""
		A form for creating new users. Includes all the required
		fields, plus a repeated password.
	"""
	password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
	password2 = forms.CharField(label='Confirm Password', widget=forms.PasswordInput)

	class Meta:
		model : User
		fields = ('fullname', 'phone','email', 'role','avatar','password1', 'password2')
		
	def clean_password2(self):
		password1 = self.cleaned_data.get('password1')
		password2 = self.cleaned_data.get('password2')

		if password1 and password2 and password1 != password2:
			raise ValidationError("Passwords don't match")

		return password2

	def save(self, commit=True):
		user = super().save(commit=False)
		user.set_password(self.cleaned_data['password1'])
		if commit:
			user.save()
		return user


class UserChangeForm(forms.ModelForm):
	"""
		A form for updating users. Includes all the fields on
		the user, but replaces the password field with admin's
		password hash display field.
	"""
	password = ReadOnlyPasswordHashField(help_text="Raw passwords are not stored, so there is no way to see this user's password, but you can change the password using <a href=\"../password/\">this form</a>.")

	class Meta:
		model = User
		fields = ('fullname', 'phone', 'email', 'role','avatar', 'password', 'last_login')

	def clean_password(self):
		return self.initial['password']

