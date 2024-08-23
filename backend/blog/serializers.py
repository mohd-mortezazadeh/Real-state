from rest_framework import serializers
from django.utils.text import slugify
from django.db.models import Avg
import filetype, re

from .models import *

from user_area.authentication import get_user_by_token
from user_area.models import MediaUser, User

from post_manager.serializers import MediaUserSerializer



class ArticleSerializer(serializers.ModelSerializer):
	"""
		ArticleSerializer
		This serializer create article and padcast by admin
	"""
	user = serializers.HiddenField(default= serializers.CurrentUserDefault())
	slug = serializers.SerializerMethodField()
	title = serializers.CharField(required=True, allow_blank=True, allow_null=True)
	content = serializers.CharField(required=True, allow_blank=True, allow_null=True)
	media = serializers.PrimaryKeyRelatedField(queryset=MediaUser.objects.all(), required=True, many=True)
	is_podcast = serializers.SerializerMethodField()
	writer = serializers.SerializerMethodField()
	rating_article = serializers.SerializerMethodField()

	def get_rating_article(self, obj):
		rating_avg = obj.rating.all().aggregate(Avg('rate'))
		user_rating_count = obj.rating.all().count()
		return {
			'rating_avg': rating_avg['rate__avg'],
			'user_rating_count': user_rating_count
		}

	def get_writer(self, obj):
		return obj.user.fullname

	def get_is_podcast(self, obj):
		file = obj.media
		if file.count() == 2:
			return True
		return False

	def get_slug(self, obj):
		obj.slug = slugify(obj.title, allow_unicode=True)
		obj.save()
		return obj.slug

	def to_representation(self, instance):
		"""
			This method change data to show in response
		"""
		data = super().to_representation(instance)
		data['media'] = MediaUserSerializer(instance.media.all(), many=True).data
		get_media = data['media']
		if len(get_media) == 2:
			ext_file = get_media[0]['file'].split('.')[-1]
			if ext_file not in ['jpeg', 'png', 'jpg', 'heic', 'HEIC']:
				data['media'] = [get_media[1], get_media[0]]
				return data	

		return data


	class Meta:
		model = Article
		exclude = ('comment', 'rating')

	def create(self, validated_data):
		user = validated_data.pop('user')
		user = get_user_by_token(self.context['request'])

		if user is None:
			raise serializers.ValidationError({'detail': "کاربر یافت نشد"})
		if user.role.id != 1:
			raise serializers.ValidationError({'detail': 'اجازه دسترسی به این بخش ندارید'})
		
		media = validated_data.pop('media')
		ext_file = filetype.guess(media[0].file).extension

		if ext_file not in ['jpeg', 'png', 'jpg']:
			raise serializers.ValidationError({'detail': 'فرمت فایل انتخابی مجاز نیست'})

		if not media:
			raise serializers.ValidationError({'detail': 'مدیا انتخاب نشده است'})
		
		title = validated_data.get('title')
		if not title:
			raise serializers.ValidationError({'detail': 'عنوان مقاله وارد نشده است'})

		if len(title) < 5:
			raise serializers.ValidationError({'detail': "عنوان باید بیشتر از 4 کاراکتر باشد"})

		if not re.match(r'^[a-zA-Z0-9آ-ی ]', title):
			raise serializers.ValidationError({'detail': "عنوان باید با حروف و یا اعداد شروع شود"})

		if not validated_data.get('content'):
			raise serializers.ValidationError({'detail': 'محتوای مقاله وارد نشده است'})

		article = Article.objects.create(**validated_data, user=user)
		article.media.set(media)
		return article

	def update(self, instance, validated_data):
		"""
			This method update article and padcast by admin
		"""
		user = get_user_by_token(self.context['request'])
		if user is None:
			raise serializers.ValidationError({'detail': "کاربر یافت نشد"})
		if user.role.id != 1:
			raise serializers.ValidationError({'detail': 'اجازه دسترسی به این بخش ندارید'})

		user = User.objects.get(id=user.id)
		if not user:
			raise serializers.ValidationError({'detail': 'کاربر یافت نشد'})
		
		if instance.user.id != user.id:
			raise serializers.ValidationError({'detail': 'شما اجازه ویرایش این مقاله را ندارید'})

		title = validated_data.get('title')
		if not title:
			raise serializers.ValidationError({'detail': 'عنوان مقاله وارد نشده است'})
			
		if len(title) < 5:
			raise serializers.ValidationError({'detail': "عنوان باید بیشتر از 4 کاراکتر باشد"})

		if not re.match(r'^[a-zA-Z0-9آ-ی ]', title):
			raise serializers.ValidationError({'detail': "عنوان باید با حروف و یا اعداد شروع شود"})

		content = validated_data.get('content')
		if not content:
			raise serializers.ValidationError({'detail': 'محتوای مقاله وارد نشده است'})

		instance.user = user
		instance.title = title
		instance.content = content
		instance.slug = slugify(validated_data.get('title', instance.title))
		instance.media.set(validated_data.get('media', instance.media))
		instance.save()
		return instance


class CommentSerializer(serializers.ModelSerializer):
	"""
		CommentSerializer
		This serializer create comment by user
	"""
	user = serializers.HiddenField(default= serializers.CurrentUserDefault())
	fullname = serializers.CharField(required=False, allow_blank=True, allow_null=True)
	article = serializers.PrimaryKeyRelatedField(queryset=Article.objects.all(), required=True, write_only=True)
	content = serializers.CharField(required=True, allow_blank=True, allow_null=True)
	replied_to = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all(), required=False, allow_null=True, write_only=True)
	reply = serializers.SerializerMethodField()

	def get_reply(self, obj):
		reply_id = obj.replied_to
		if reply_id:
			return reply_id.id
		else:
			return None

	class Meta:
		model = Comment
		fields = '__all__'

	def create(self, validated_data):
		user = get_user_by_token(self.context['request'])
		fullname = validated_data.get('fullname')
		content = validated_data.get('content')
		article = validated_data.get('article')
		replied_to = validated_data.get('replied_to')
		article = Article.objects.filter(id=article.id)

		if not validated_data.get('content'):
			raise serializers.ValidationError({'detail': 'محتوای نظر وارد نشده است'})

		if not validated_data.get('article'):
			raise serializers.ValidationError({'detail': 'مقاله انتخاب نشده است'})

		if user:
			fullname = user.fullname
			if user.role.id == 1:
				is_admin = True
			else:
				is_admin = False
		else:
			is_admin = False

		if not fullname:
			raise serializers.ValidationError({'detail': 'نام و نام خانوادگی وارد نشده است'})
		
		if replied_to:
			comment = Comment.objects.create(fullname=fullname, content=content, replied_to=replied_to, is_admin=is_admin)
		else:
			comment = Comment.objects.create(fullname=fullname, content=content, is_admin=is_admin)

		if article:
			article = article[0]
			article.comment.add(comment)
			article.save()
		else:
			raise serializers.ValidationError({'detail': 'مقاله یافت نشد'})
		
		return comment


class ContactUsSerializer(serializers.ModelSerializer):
	"""
		ContactUsSerializer
		This serializer create contact us by user
	"""
	fullname = serializers.CharField(required=True, allow_blank=True, allow_null=True)
	phone = serializers.CharField(required=True, allow_blank=True, allow_null=True)
	email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
	content = serializers.CharField(required=True, allow_blank=True, allow_null=True)

	class Meta:
		model = ContactUs
		fields = '__all__'

	def create(self, validated_data):
		fullname = validated_data.get('fullname')
		email = validated_data.get('email')
		phone = validated_data.get('phone')
		content = validated_data.get('content')

		if not fullname:
			raise serializers.ValidationError({'detail': 'نام و نام خانوادگی وارد نشده است'})

		if not phone:
			raise serializers.ValidationError({'detail': 'شماره تماس وارد نشده است'})

		if not content:
			raise serializers.ValidationError({'detail': 'محتوای پیام وارد نشده است'})

		contact = ContactUs.objects.create(fullname=fullname, phone=phone, email=email, content=content)
		return contact

