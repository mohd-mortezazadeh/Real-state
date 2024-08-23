from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import serializers
from django.utils.text import slugify
from django.db.models import Count
from rest_framework import status
from django.db.models import Avg
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from PIL import Image
from collections import OrderedDict

import filetype
import re
import random
import string
import requests

from blog.models import Canonical, Content, Meta, Schima

from .models import Ad, AdMeta, Category, AdOption, PackageOption, Order
from .functions import set_watermark

from user_area.models import Section, MediaUser, UserMeta, User, Ticket, Role
from user_area.authentication import get_user_by_token
from user_area.serializers import CitySerializer


class SectionSerializer(serializers.ModelSerializer):
    city = CitySerializer()

    class Meta:
        model = Section
        fields = '__all__'


class MetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meta
        exclude = ("path",)


class SchimaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schima
        exclude = ("path",)


class CanonicalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Canonical
        exclude = ("path",)


class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    content = ContentSerializer()

    class Meta:
        model = Category
        fields = "__all__"


class CategorySerializer2(serializers.ModelSerializer):
    content = ContentSerializer()
    meta = MetaSerializer(many=True)
    schima = SchimaSerializer(many=True)
    canonical = CanonicalSerializer(many=True)

    class Meta:
        model = Category
        fields = "__all__"


class AdOptionSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=True)

    class Meta:
        model = AdOption
        fields = "__all__"


class AdMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdMeta
        fields = "__all__"


class MediaUserSerializer(serializers.ModelSerializer):
    """
            This serializer is for upload media
            watermark add in here
            - force by provider in middle of project 
    """
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    # def get_user(self, obj):
    # 	return obj.user.phone

    class Meta:
        model = MediaUser
        fields = "__all__"

    def create(self, validated_data):
        user = validated_data.pop('user')
        user = get_user_by_token(self.context['request'])
        subject_type = validated_data['subject_type']
        file = validated_data['file']
        print(file)
        if not file:
            raise serializers.ValidationError(
                {'detail': "فایلی ارسال نشده است"})

        try:
            ext_file = filetype.guess(file).extension
        except:
            raise serializers.ValidationError(
                {'detail': "فرمت فایل ارسالی مجاز نیست"})

        subject_list = [2, 3]
        if subject_type in subject_list:
            image = Image.open(file)
            x, y = image.size
            if x < 600 or y < 600:
                raise serializers.ValidationError(
                    {'detail': "حداقل اندازه عکس 600*600 است"})

        # ? check media type and size
        subject_list = [1, 2, 3, 4]
        if subject_type in subject_list:
            if user.role.name == 'admin':
                if ext_file in ['mp3', 'ogg']:
                    media = MediaUser.objects.create(
                        user=user, **validated_data)
                    return media

            if ext_file not in ['jpeg', 'png', 'jpg', 'heic', 'HEIC']:
                raise serializers.ValidationError(
                    {'detail': "فرمت فایل ارسالی مجاز نیست"})

            if file.size > settings.MAX_UPLOAD_SIZE:
                raise serializers.ValidationError(
                    {'detail': "حجم فایل بیشتر از حد مجاز است"})

        # ? check media name
        file_name = file.name
        if len(file_name) > 95:
            raise serializers.ValidationError(
                {'detail': "نام فایل بیشتر از حد مجاز است"})

        file_name = file_name.split('.')
        file_name = '_' + ''.join(random.choice(string.ascii_uppercase + string.digits)
                                  for _ in range(10)) + '.' + file_name[1]
        file.name = file_name

        media = MediaUser.objects.create(user=user, **validated_data)

        watermark_list = [3]
        if subject_type in watermark_list:
            if subject_type == 2:
                small_thumbnail = MediaUser.objects.create(
                    user=user, subject_type=5)
                small_thumbnail.file = set_watermark(
                    5, media.file, ext_file, file_name)
                small_thumbnail.save()

            media.file = set_watermark(
                subject_type, media.file, ext_file, file_name)
            media.save()

        # ? set media on avatar
        if subject_type == 1:
            user.avatar = media
            user.save()

        return media


class AdSerializer(serializers.ModelSerializer):
    """
            This serializer is for just view ad
    """
    user = serializers.SerializerMethodField()
    section = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    options = AdOptionSerializer(many=True)
    slug = serializers.SerializerMethodField()
    meta = serializers.SerializerMethodField()
    code = serializers.SerializerMethodField()
    media = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()

    def get_category(self, obj):
        city = obj.section.city
        data = {
            "id": obj.category.id,
            "name": obj.category.name,
            "display_name": obj.category.display_name,
            "city": city.name,
            "city_id": city.id,
            "city_slug": city.slug
        }
        return data

    def get_is_bookmarked(self, instance):
        user = get_user_by_token(self.context['request'])
        if user:
            if instance.bookmark.filter(id=user.id).exists():
                return True
        return False

    def get_section(self, obj):
        section = obj.section
        return {
            "id": section.id,
            "name": section.name,
            "slug": section.slug,
            "city": section.city.name,
            "city_slug": section.city.slug,
            "city_id": section.city.id
        }

    def get_media(self, obj):
        media = Ad.objects.get(id=obj.id).media.all()

        # ? get thumbnail
        thumbnail = media.filter(subject_type=2)
        if thumbnail:
            thumbnail = MediaUserSerializer(thumbnail, many=True).data
        else:
            default_media = MediaUser.objects.get(id=221)
            thumbnail = [MediaUserSerializer(default_media).data]

        if thumbnail[0]['id'] == 221:
            is_default = True
        else:
            is_default = False
        thumbnail[0]['is_default'] = is_default

        # ? get gallery
        gallery = media.filter(subject_type=3)
        gallery_count = gallery.count()
        if gallery_count > 10:
            raise serializers.ValidationError(
                {'detail':  "تعداد عکس های بارگذاری شده بیشتر از حد مجاز است"})

        if gallery:
            gallery = MediaUserSerializer(gallery, many=True).data
        else:
            default_media = MediaUser.objects.get(id=221)
            gallery = [MediaUserSerializer(default_media).data]

        if gallery[0]['id'] == 221:
            is_default = True
        else:
            is_default = False
        gallery[0]['is_default'] = is_default

        # ? get small thumbnail
        small_thumbnail = media.filter(subject_type=5).first()
        if small_thumbnail:
            small_thumbnail = MediaUserSerializer(small_thumbnail).data
            thumbnail = [small_thumbnail] + thumbnail

        return {
            "thumbnail": thumbnail,
            "gallery": gallery
        }

    def get_code(self, obj):
        obj_id = obj.id
        code_count = obj_id + 1230
        obj_code = f"{code_count}"
        obj.code = obj_code
        obj.save()
        return obj.code

    def get_meta(self, obj):
        add_meta = AdMeta.objects.filter(ad=obj)
        serializer = AdMetaSerializer(add_meta, many=True)
        return serializer.data

    def get_user(self, obj):

        user = obj.user
        role = {
            'id': user.role.id,
            'name': user.role.name,
            "display_name": user.role.display_name,
        }
        if user.role.id == 1:
            city = None
        else:
            city = {
                'id': user.city.id,
                'name': user.city.name,
            }

        roles = [1, 2, 5, 6]
        if user.role.id in roles:
            company_name = ""
        else:
            company_name = {
                'id': user.company_name.id,
                'name': user.company_name.name,
                'username': user.company_name.owner.fullname,
                'phone': user.company_name.owner.phone,
            }

        # get avatar
        avatar = user.avatar
        if avatar:
            avatar = MediaUserSerializer(avatar).data

        # get user meta
        user_meta = UserMeta.objects.filter(user=user)
        # show all user meta for this user
        if user_meta:
            data = UserMetaSerializer(user_meta, many=True).data
        else:
            data = None

        # get status id and name
        status = {
            'id': user.status,
            'name': user.get_status_display(),
        }

        # check has password
        if user.password:
            has_password = True
        else:
            has_password = False

        # get user rating
        rating_avg = user.rating.all().aggregate(Avg('rate'))
        user_rating_count = user.rating.all().count()

        data = {
            'id': user.id,
            'fullname': user.fullname,
            'phone': user.phone,
            'role': role,
            'city': city,
            'company_name': company_name,
            'avatar': avatar,
            'user_meta': data,
            'has_password': has_password,
            'rating_avg': rating_avg['rate__avg'],
            'rating_count': user_rating_count,
            'status': status,
        }
        return data

    def get_slug(self, obj):
        obj.slug = slugify(obj.title, allow_unicode=True)
        obj.save()
        return obj.slug

    class Meta:
        model = Ad
        exclude = ('rating', 'bookmark')


class AdPreviewSerializer(AdSerializer):
    date = serializers.SerializerMethodField()
    # TODO show ad fori label
    is_fori = serializers.SerializerMethodField()

    def get_is_fori(self, obj):
        order = Order.objects.filter(ad=obj, status=1)
        if order.exists():
            return True
        return False

    def get_date(self, obj):
        nardeban_list = PackageOption.objects.filter(subject_type=1,
                                                     ad__id=obj.id
                                                     )
        if nardeban_list.exists():
            return int(nardeban_list.last().created_at.timestamp())
        else:
            return int(obj.created_at.timestamp())

    class Meta:
        model = Ad
        fields = ('id', 'user', 'title', 'is_fori', 'section',
                  'category', 'date', 'price', 'media', 'description', 'slug')


class AdCreateSerializer(AdSerializer):
    """
            inherited from AdSerializer
            This serializer is for create and update ad
    """
    section = serializers.PrimaryKeyRelatedField(
        queryset=Section.objects.all())
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all())
    media = serializers.DictField(child=serializers.ListField(
        child=serializers.CharField()), write_only=True)
    meta = serializers.DictField(
        child=serializers.CharField(), write_only=True)
    options = serializers.ListField(child=serializers.PrimaryKeyRelatedField(
        queryset=AdOption.objects.all()), write_only=True, required=False)

    class Meta:
        model = Ad
        exclude = ('rating', 'bookmark')

    def create(self, validated_data):
        # get user from token
        user = get_user_by_token(self.context['request'])
        if user is None:
            raise serializers.ValidationError({'detail': "کاربر یافت نشد"})
        if user.status == 0:
            raise serializers.ValidationError(
                {'detail': "حساب کاربری شما غیر فعال است"})

        if user.status == -1:
            raise serializers.ValidationError(
                {'detail': "حساب کاربری شما مسدود شده است"})

        if user.role.name == "admin":
            raise serializers.ValidationError(
                {'detail': "شما اجازه ایجاد آگهی ندارید"})

        # get section and category
        section = validated_data['section']
        section_qs = Section.objects.filter(id=section.id)
        if not section_qs.exists():
            raise serializers.ValidationError(
                {'detail': "بخش مورد نظر یافت نشد"})

        category = validated_data['category']
        if category is None:
            raise serializers.ValidationError({'detail': "دسته بندی یافت نشد"})

        # get city from section
        city = section.city
        if city is None:
            raise serializers.ValidationError({'detail': "شهر یافت نشد"})

        check_category = Category.objects.filter(id=category.id, city=city)
        if not check_category.exists():
            raise serializers.ValidationError(
                {'detail': "دسته بندی مورد نظر در این شهر وجود ندارد"})

        # get home_phone and this is optional
        home_phone = validated_data['home_phone']
        if home_phone:
            if len(home_phone) > 11:
                raise serializers.ValidationError(
                    {'detail': "شماره تماس نباید بیشتر از یازده رقم باشد"})

        # check media
        media = validated_data['media']
        thumbnail = media.get('thumbnail')
        gallery = media.get('gallery')

        if len(thumbnail) > 1:
            raise serializers.ValidationError(
                {'detail': "تنها یک عکس شاخص می توانید انتخاب کنید"})

        if len(gallery) > 10:
            raise serializers.ValidationError(
                {'detail': "تعداد عکس های گالری بیشتر از حد مجاز است"})

        # get options and this is optional
        options = validated_data['options']
        if options:
            for option in options:
                catgory = AdOption.objects.filter(
                    category=category, id=option.id)
                if not catgory.exists():
                    raise serializers.ValidationError(
                        {'detail': "گزینه ای که انتخاب کرده اید در این دسته بندی وجود ندارد"})

        title = validated_data['title']
        if len(title) < 5:
            raise serializers.ValidationError(
                {'detail': "عنوان باید بیشتر از 4 کاراکتر باشد"})

        if not re.match(r'^[a-zA-Z0-9آ-ی ]', title):
            raise serializers.ValidationError(
                {'detail': "عنوان باید با حروف و یا اعداد شروع شود"})

        description = validated_data['description']
        if len(description) < 10:
            raise serializers.ValidationError(
                {'detail': "توضیحات باید بیشتر از 10 کاراکتر باشد"})

        # TODO user ad count limit check
        # if user.ad_count == 0:
        # 	raise serializers.ValidationError({'detail': "شما اجازه ایجاد آگهی ندارید"})

        # create ad
        ad = Ad.objects.create(
            user=user,
            section=section,
            category=category,
            title=title,
            description=description,
            price=validated_data['price'],
            home_phone=home_phone,
            lat_path=validated_data['lat_path'],
            lng_path=validated_data['lng_path'],
        )

        # TODO user ad count check
        user.ad_count -= 1
        user.save()

        # if user is real estate and advisor then status ad is 1
        if user.role.name == "real_estate" or user.role.name == "advisor":
            ad.status = 1
            ad.save()

        # add media to ad
        if thumbnail:
            media = MediaUser.objects.get(id=thumbnail[0])
            get_small_thumb = MediaUser.objects.get(
                id=int(thumbnail[0])+1, user=user)
            ad.media.add(media)
            ad.media.add(get_small_thumb)
        # else:
        # 	print("else")
        # 	media = MediaUser.objects.get(id=221)
        # 	print(media)
        # 	ad.media.add(media)

        if gallery:
            for item in gallery:
                media = MediaUser.objects.get(id=item)
                ad.media.add(media)
        # else:
        # 	media = MediaUser.objects.get(id=221)
        # 	ad.media.add(media)

        # add options to ad
        if options:
            for option in options:
                ad.options.add(option)

        # add AdMeta to ad
        meta = validated_data['meta']
        if meta:
            ad_instance = Ad.objects.get(id=ad.id)
            for k, v in meta.items():
                AdMeta.objects.create(key=k, value=v, ad=ad_instance)

        return ad

    def update(self, instance, validated_data):
        # get user
        user = get_user_by_token(self.context['request'])
        if user is None:
            raise serializers.ValidationError({'detail': "کاربر یافت نشد"})
        if user.status == 0:
            raise serializers.ValidationError(
                {'detail': "حساب کاربری شما غیر فعال است"})

        if instance.user != user:
            raise serializers.ValidationError(
                {'detail': "شما اجازه ویرایش این آگهی را ندارید"})

        # ? Set Status Ad
        if user.role.name == "real_estate" or user.role.name == "advisor":
            instance.status = 1
            instance.save()
        else:
            instance.status = 0
            instance.save()

        # ? check section
        section = validated_data['section']
        section_qs = Section.objects.filter(id=section.id)
        if not section_qs.exists():
            raise serializers.ValidationError(
                {'detail': "بخش مورد نظر یافت نشد"})

        # ? add category
        category = validated_data['category']
        if category is None:
            raise serializers.ValidationError({'detail': "دسته بندی یافت نشد"})

        # ? check home phone
        home_phone = validated_data['home_phone']
        if home_phone:
            if len(home_phone) > 11:
                raise serializers.ValidationError(
                    {'detail': "شماره تماس نباید بیشتر از یازده رقم باشد"})

        # ? check media
        media = validated_data['media']
        thumbnail = media.get('thumbnail')
        gallery = media.get('gallery')

        if len(thumbnail) > 1:
            raise serializers.ValidationError(
                {'detail': "تنها یک عکس شاخص می توانید انتخاب کنید"})

        if len(gallery) > 10:
            raise serializers.ValidationError(
                {'detail': "تعداد عکس های گالری بیشتر از حد مجاز است"})

        try:
            instance.media.clear()
            if thumbnail:
                for item in thumbnail:
                    media = MediaUser.objects.get(id=item)
                    get_small_thumb = MediaUser.objects.get(
                        id=int(thumbnail[0])+1, user=user)
                    instance.media.add(get_small_thumb)
                    instance.media.add(media)
            # else:
            # 	media = MediaUser.objects.get(id=221)
            # 	instance.media.add(media)

            if gallery:
                for item in gallery:
                    media = MediaUser.objects.get(id=item)
                    instance.media.add(media)
            # else:
            # 	media = MediaUser.objects.get(id=221)
            # 	instance.media.add(media)
        except:
            raise serializers.ValidationError(
                {'detail': "عکس های گالری آگهی را درست انتخاب کنید"})

        # ? check options
        options = validated_data['options']
        if options:
            for option in options:
                catgory = AdOption.objects.filter(
                    category=category, id=option.id)
                if not catgory.exists():
                    raise serializers.ValidationError(
                        {'detail': "گزینه ای که انتخاب کرده اید در این دسته بندی وجود ندارد"})

        if options:
            instance.options.clear()
            for option in options:
                instance.options.add(option)

        if not options:
            instance.options.clear()

        # ? check meta
        meta = validated_data['meta']
        if meta:
            AdMeta.objects.filter(ad=instance).delete()
            ad_instance = Ad.objects.get(id=instance.id)
            for k, v in meta.items():
                AdMeta.objects.create(key=k, value=v, ad=ad_instance)

        title = validated_data['title']
        if len(title) < 5:
            raise serializers.ValidationError(
                {'detail': "عنوان باید بیشتر از 4 کاراکتر باشد"})

        if not re.match(r'^[a-zA-Z0-9آ-ی ]', title):
            raise serializers.ValidationError(
                {'detail': "عنوان باید با حروف و یا اعداد شروع شود"})

        description = validated_data['description']
        if len(description) < 10:
            raise serializers.ValidationError(
                {'detail': "توضیحات باید بیشتر از 10 کاراکتر باشد"})

        instance.section = section
        instance.category = category
        instance.title = title
        instance.description = description
        instance.price = validated_data['price']
        instance.home_phone = home_phone
        instance.lat_path = validated_data['lat_path']
        instance.lng_path = validated_data['lng_path']
        instance.save()

        return instance


#! Dashboard users
class UserMetaSerializer(serializers.ModelSerializer):
    """
            user meta serializer
            create and update user meta
    """
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    data = serializers.DictField(write_only=True, allow_null=True)

    class Meta:
        model = UserMeta
        fields = "__all__"

    def create(self, validated_data):
        user = validated_data.pop('user')
        user = get_user_by_token(self.context['request'])
        if user is None:
            raise serializers.ValidationError({'detail': "کاربر یافت نشد"})
        if user.status != 1:
            raise serializers.ValidationError(
                {'detail': "حساب کاربری شما غیر فعال است"})

        user_instance = User.objects.get(id=user.id)
        meta_data = UserMeta.objects.filter(user=user_instance)
        data = validated_data['data']

        for meta in meta_data:
            if meta.key in data.keys():
                meta.value = data[meta.key]
                meta.save()
        else:
            keys = list(set(data.keys()) -
                        set(meta_data.values_list('key', flat=True)))
            for key in keys:
                UserMeta.objects.create(
                    key=key, value=data[key], user=user_instance)

        return self.Meta.model.objects.filter(user=user_instance).first()


class CreatePasswordSerializer(serializers.Serializer):
    """
            create password for user
    """
    password = serializers.CharField(required=True)
    password2 = serializers.CharField(required=True)

    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        if password != password2:
            raise serializers.ValidationError(
                {'detail': "رمز عبور با تکرار آن مطابقت ندارد"})
        return data

    def create(self, validated_data):
        user = get_user_by_token(self.context['request'])
        if user is None:
            raise serializers.ValidationError({'detail': "کاربر یافت نشد"})
        if user.status != 1:
            raise serializers.ValidationError(
                {'detail': "حساب کاربری شما غیر فعال است"})
        password = validated_data['password']
        user.set_password(password)
        user.save()
        return validated_data


class CheckAdvisorSerializer(serializers.ModelSerializer):
    """
            check advisor for real estate
            -create : remove all advisors 
    """
    phone = serializers.CharField(required=False)
    fullname = serializers.CharField(required=False)
    is_advisor = serializers.BooleanField(write_only=True, required=False)
    advisors = serializers.ListField(write_only=True, required=False)
    ads_count = serializers.SerializerMethodField()

    def get_ads_count(self, obj):
        company = obj.company_name
        user = User.objects.filter(
            company_name=company, role__name='advisor', status=1)
        get_ads = Ad.objects.filter(user__in=user, status=1).values(
            'user').annotate(count=Count('user'))
        count_ad = get_ads.filter(user=obj.id)
        return count_ad[0]['count'] if count_ad else 0

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data['avatar'] is not None:
            data['avatar'] = MediaUserSerializer(instance.avatar).data
        return data

    class Meta:
        model = User
        fields = ('id', 'phone', 'fullname', 'role', 'avatar',
                  'status', 'is_advisor', 'ads_count', 'advisors')

    def create(self, validated_data):
        user_auth = get_user_by_token(self.context['request'])
        if user_auth is None:
            raise serializers.ValidationError({'detail': "کاربر یافت نشد"})
        if user_auth.status != 1:
            raise serializers.ValidationError(
                {'detail': "حساب کاربری شما غیر فعال است"})

        advisors = validated_data['advisors']
        for advisor in advisors:
            user = User.objects.get(id=advisor)
            user.status = 1
            user.role = Role.objects.get(id=6)
            user.company_name = None
            user.save()

        return user

    def update(self, instance, validated_data):
        user = get_user_by_token(self.context['request'])
        if user is None:
            raise serializers.ValidationError({'detail': "کاربر یافت نشد"})
        if user.status != 1:
            raise serializers.ValidationError(
                {'detail': "حساب کاربری شما غیر فعال است"})

        is_advisor = validated_data['is_advisor']

        if instance.status == 1:
            raise serializers.ValidationError(
                {'detail': "این کاربر قبلا به عنوان مشاور تایید شده است"})

        if is_advisor:
            instance.status = 1
            instance.save()
        else:
            instance.role = Role.objects.get(id=6)
            instance.company_name = None
            instance.status = 1
            instance.save()

        return instance


class TicketSerializer(serializers.ModelSerializer):
    """
            ticket serializer
            - create ticket for user
            - update ticket for admin
            - to_representation for show file link
    """
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    replied_to = serializers.PrimaryKeyRelatedField(
        queryset=Ticket.objects.all(), required=False, allow_null=True)
    media = serializers.PrimaryKeyRelatedField(
        queryset=MediaUser.objects.all(), required=False, allow_null=True, many=True)
    admin_replied = serializers.SerializerMethodField()
    status = serializers.CharField(required=False, allow_null=True)
    writer = serializers.SerializerMethodField()

    def get_writer(self, obj):
        user = obj.user
        return user.fullname

    def get_admin_replied(self, obj):
        user = obj.user
        if user.role.id == 1:
            return True
        return False

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data['file'] is not None:
            data['file'] = MediaUserSerializer(
                instance.file.all(), many=True).data

        return data

    class Meta:
        model = Ticket
        fields = "__all__"

    def create(self, validated_data):
        user = validated_data.pop('user')
        user = get_user_by_token(self.context['request'])
        if user is None:
            raise serializers.ValidationError({'detail': "کاربر یافت نشد"})
        if user.status != 1:
            raise serializers.ValidationError(
                {'detail': "حساب کاربری شما غیر فعال است"})

        file = validated_data['file']
        title = validated_data['title']
        description = validated_data['description']
        urgency = validated_data['urgency']
        department = validated_data['department']
        reply = validated_data['replied_to']

        ticket = Ticket.objects.create(user=user, title=title,
                                       description=description, urgency=urgency, department=department)

        if file:
            if len(file) > 10:
                raise serializers.ValidationError(
                    {'detail': "تعداد فایل های ارسالی بیشتر از حد مجاز است"})

            for f in file:
                if f.user != user:
                    raise serializers.ValidationError(
                        {'detail': "فایل متعلق به شما نیست"})

                if f.subject_type != 4:
                    raise serializers.ValidationError(
                        {'detail': "فایل متعلق به تیکت نیست"})
                media = MediaUser.objects.get(id=f.id)
                ticket.file.add(media)

        role = user.role.name
        if reply:
            reply = Ticket.objects.get(id=reply.id)
            ticket.replied_to = reply
            check_reply_none = ticket.replied_to.replied_to

            x = []
            if check_reply_none is None:
                parent_id = reply.id
            else:
                while check_reply_none is not None:
                    x.append(check_reply_none.id)
                    check_reply_none = check_reply_none.replied_to
                parent_id = x[0]

            if len(x) > 0:
                parent_id = x[-1]
            else:
                pass
            if role == "admin":
                Ticket.objects.filter(id=parent_id).update(status=3)
            else:
                Ticket.objects.filter(id=parent_id).update(status=2)

        else:
            ticket.replied_to = None

        ticket.save()
        return ticket

    def update(self, instance, validated_data):
        user = get_user_by_token(self.context['request'])
        if user is None:
            raise serializers.ValidationError({'detail': "کاربر یافت نشد"})
        if user.status != 1:
            raise serializers.ValidationError(
                {'detail': "حساب کاربری شما غیر فعال است"})

        role = user.role.id
        if role != 1:
            raise serializers.ValidationError(
                {'detail': "شما مجوز انجام این عملیات را ندارید"})

        if instance.user != user:
            raise serializers.ValidationError(
                {'detail': "شما مجوز انجام این عملیات را ندارید"})
        try:
            if role == 1:
                instance.status = 3
                instance.save()

            status = int(validated_data['status'])
            if role == 1 and status == 0:
                instance.status = 0
                instance.save()
        except:
            pass

        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get(
            'description', instance.description)
        instance.save()
        return instance


class ChangeRoleSerializer(serializers.ModelSerializer):
    """
            change role serializer
            - change role for admin
    """
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = User
        fields = ['user', 'role']
