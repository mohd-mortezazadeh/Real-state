from ckeditor_uploader.fields import RichTextUploadingField
from django.db import models

from user_area.models import BaseModel, User, Rating, MediaUser


class Comment(BaseModel):
    """
            Comment model
            This model create comment by user
            User can create comment on article with login and without login
    """
    fullname = models.CharField(max_length=255, null=True, blank=True)
    replied_to = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True, related_name="reply_comment")
    content = models.TextField()
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.fullname


class Article(BaseModel):
    """
            Article model
            This model create article by admin
    """
    title = models.CharField(max_length=255)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="article_user")
    content = models.TextField()
    rating = models.ManyToManyField(
        Rating, related_name='article_rating', blank=True)
    slug = models.SlugField(max_length=255, allow_unicode=True)
    media = models.ManyToManyField(MediaUser, related_name='article_media')
    comment = models.ManyToManyField(
        Comment, related_name='article_comment', blank=True)

    def __str__(self):
        return self.title


class ContactUs(BaseModel):
    """
            ContactUs model
            This model create contact us by user
    """
    fullname = models.CharField(max_length=100)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=100)
    content = models.TextField()

    def __str__(self):
        return self.fullname

    class Meta:
        verbose_name = 'ContactUs'
        verbose_name_plural = 'ContactUs'


# ? SEO
class Meta(models.Model):
    """
            This model is for meta data of all models in project (it's for seo)
    """
    name = models.CharField(max_length=255, null=True, blank=True)
    content = models.TextField()
    property_type = models.CharField(max_length=255, null=True, blank=True)
    path = models.CharField(max_length=255)

    def __str__(self):
        return self.path

    class Meta:
        verbose_name = 'Meta'
        verbose_name_plural = 'Meta'


class Schima(models.Model):
    path = models.CharField(max_length=255)
    content = models.TextField()

    def __str__(self):
        return self.content

    class Meta:
        verbose_name = 'Schima'
        verbose_name_plural = 'Schima'


class Canonical(models.Model):
    path = models.CharField(max_length=255)
    url = models.CharField(max_length=255)

    def __str__(self):
        return self.path

    class Meta:
        verbose_name = 'Canonical'
        verbose_name_plural = 'Canonical'


class Content(models.Model):
    title = models.CharField(max_length=255)
    path = models.CharField(max_length=255)
    body = RichTextUploadingField()  # CKEditor Rich Text Field

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Content'
        verbose_name_plural = 'Content'
