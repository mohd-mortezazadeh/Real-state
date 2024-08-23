from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.sessions.models import Session
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import models

from .managers import UserManager


class BaseModel(models.Model):
    """
            This is a abstract model for all models need to have created_at and update_at
    """
    created_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Role(models.Model):
    """
            - name: name of role
            - display_name: display name of role
            included roles are admin(id=1), banned(2), advisor(3),
            real_estate(4), owner(5), free_advisor(6)
    """
    name = models.CharField(max_length=32)
    display_name = models.CharField(max_length=32)

    def __str__(self):
        return self.name


class Province(models.Model):
    """
            - name: name of province in iran
    """
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=100)

    def __str__(self):
        return self.name


class City(models.Model):
    """
            - name: name of city in iran
            - province: province of city
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)
    province = models.ForeignKey(
        Province, on_delete=models.CASCADE, related_name='city_province', null=True, blank=True)
    lat_path = models.CharField(max_length=100, blank=True, null=True)
    lng_path = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'City'
        verbose_name_plural = 'Cities'


class Section(models.Model):
    """
            - name: name of section
            - city: city of section
    """
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)
    city = models.ForeignKey(City, on_delete=models.CASCADE,
                             related_name='section_city', null=True, blank=True)

    def __str__(self):
        return self.name


def get_file_folder_name(instance, filename):
    if instance.subject_type == 5:
        return f"thumbnail/{filename}"
    else:
        return f"media_file/{filename}"


class MediaUser(models.Model):
    """
            - user: user of media
            - file: file of media
            - subject_type: type of media
            a table for file like avatar, thumbnail, gallery, audio for padcast
            default pk is default picture for avatar for user
            default pk=76 is the id of the picture in the media table when uploaded with the admin
    """
    DEFAULT_PK = 76
    STATUS = (
        (1, 'avatar'),
        (2, 'thumbnail'),
        (3, 'gallery'),
        (4, 'event'),
        (5, 'small_thumbnail'),
    )
    user = models.ForeignKey(
        'User', on_delete=models.CASCADE, related_name='media')
    file = models.FileField(upload_to=get_file_folder_name,
                            null=True, blank=True, max_length=255)
    subject_type = models.IntegerField(
        choices=STATUS, default=1, blank=True, null=True)

    def __str__(self):
        return f"{self.user.fullname} - {self.id}"


class User(AbstractBaseUser, PermissionsMixin):
    """
            a abstract model for all users
            get default avatar from media table
    """
    STATUS = (
        (-1, 'rejected'),
        (0, 'pending'),
        (1, 'active'),
    )
    fullname = models.CharField(max_length=255)
    phone = models.CharField(max_length=11, unique=True)
    city = models.ForeignKey(City, on_delete=models.DO_NOTHING,
                             related_name='user_city', blank=True, null=True)
    role = models.ForeignKey(Role, on_delete=models.DO_NOTHING,
                             related_name='user_role', blank=True, null=True)
    email = models.EmailField(max_length=255, null=True, blank=True)
    avatar = models.ForeignKey(MediaUser,  default=MediaUser.DEFAULT_PK,
                               on_delete=models.DO_NOTHING, related_name='user_avatar', blank=True, null=True)
    company_name = models.ForeignKey(
        'Company', on_delete=models.DO_NOTHING, related_name='user_company', blank=True, null=True)
    rating = models.ManyToManyField(
        'Rating', related_name='user_rating', blank=True)
    ad_count = models.IntegerField(default=0)
    nardeban_count = models.IntegerField(default=0)
    fori_count = models.IntegerField(default=0)
    vip_count = models.IntegerField(default=0)
    date_joined = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField(choices=STATUS, default=1)

    objects = UserManager()

    USERNAME_FIELD = 'phone'  # for authentication purposes
    REQUIRED_FIELDS = ['fullname', ]  # just for createsuperuser

    # class Meta:
    # 	permissions = [
    # 		("IsAdminUser", "AllowAnyUser"),
    # 		# Others customs permissions if needed
    # 	]

    def __str__(self):
        return f"{self.fullname} - {self.id}"

    def has_perm(self, perm, obj=None):
        return True

    def has_moduls_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_superuser


class Rating(models.Model):
    """
            - rate: rate of user
            a table for rating for users for any ad or blog
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name='rating_user', null=True, blank=True)
    session = models.ForeignKey(Session, on_delete=models.SET_NULL,
                                related_name='rating_session', null=True, blank=True)
    rate = models.IntegerField()

    def __str__(self):
        if self.user:
            return f"{self.user.fullname} - {self.id}"
        else:
            return self.session.session_key


class UserMeta(models.Model):
    """
            this for about user data like address, description, etc
    """
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='user_meta')
    key = models.CharField(max_length=100, null=True, blank=True)
    value = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.user.fullname


class OtpCode(models.Model):
    """
            create code for sms verification
    """
    phone = models.CharField(max_length=11)
    ip_address = models.CharField(max_length=255)
    code = models.PositiveIntegerField()
    token = models.CharField(max_length=255, null=True, blank=True)
    request_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.phone


class Company(models.Model):
    """
            - owner: owner of company
            - name: name of company
            - status: status of company
            a table for companies for real estate
    """
    STATUS = (
        (-1, 'rejected'),
        (0, 'pending'),
        (1, 'active'),
    )
    owner = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='company_user')
    name = models.CharField(max_length=255)
    status = models.IntegerField(choices=STATUS, default=0)

    def __str__(self):
        return f"{self.name}-{self.id}"

    class Meta:
        verbose_name_plural = "Companies"


class Ticket(BaseModel):
    # is_admin in serializers
    STATUS = (
        (0, 'close'),
        (1, 'open'),
        (2, 'pending'),
        (3, 'deliverd'),
    )

    URGENCY = (
        (0, 'low'),
        (1, 'medium'),
        (2, 'high'),
    )

    DEPARTMENT = (
        (0, 'support'),
        (1, 'sales'),
        (2, 'technical'),
    )

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True)
    replied_to = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=50)
    description = models.TextField()
    file = models.ManyToManyField(
        MediaUser, related_name='user_ticket', blank=True)
    status = models.IntegerField(default=2, null=True, choices=STATUS)
    urgency = models.IntegerField(default=0, choices=URGENCY)
    department = models.IntegerField(default=0, choices=DEPARTMENT)

    def __str__(self):
        return self.user.fullname


# ? This is for admin panel when user is active => company is active
@receiver(post_save, sender=(User))
def active_company(sender, instance, created, **kwargs):
    if instance.role is not None:
        if instance.role.id == 4 and instance.status == 1:
            get_company = Company.objects.filter(owner=instance)
            get_company.update(status=1)

# ? This is for admin panel when company is active => user is active


@receiver(post_save, sender=(Company))
def active_user(sender, instance, created, **kwargs):
    if instance.status == 1:
        instance.owner.status = 1
        instance.owner.save()
