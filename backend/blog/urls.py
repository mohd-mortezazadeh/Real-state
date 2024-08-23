from django.urls import path, include
from rest_framework import routers

from .views import *


app_name = "blog"
router = routers.SimpleRouter()
router.register('article', ArticleViewSet, basename='article')
router.register('articlerating', ArticleRatingView, basename='article_rating')
router.register('comment', CommentView, basename='comment')
router.register('contact', ContactUsView, basename='contact')
# urlpatterns = router.urls

urlpatterns = [
    path('', include(router.urls)),
	path('seo', MetaView.as_view(), name='seo'),
]
