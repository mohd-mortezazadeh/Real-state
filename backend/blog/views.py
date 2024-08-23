from rest_framework.authentication import BasicAuthentication 
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from django.contrib.sessions.models import Session
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets
from django.db.models import Count
from rest_framework import filters
from rest_framework import status

from .serializers import *
from .models import *

from user_area.functions import CsrfExemptSessionAuthentication, check_user_is_active
from user_area.permissions import AllowAnyUser, IsAuthenticatedRatingUser
from user_area.paginations import PageNumberAsLimitOffset
from user_area.authentication import get_user_by_token
from user_area.models import User
from post_manager.serializers import MetaSerializer, SchimaSerializer, CanonicalSerializer,ContentSerializer

class ArticleViewSet(viewsets.ModelViewSet):
	"""
		ArticlePadcastViewSet
		This viewset create article and padcast by admin
	"""
	permission_classes = [AllowAnyUser]
	pagination_class = PageNumberAsLimitOffset
	queryset = Article.objects.all()
	serializer_class = ArticleSerializer
	filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
	filterset_fields = ['user']
	search_fields = ['title', 'content']
	ordering_fields = ['title', 'content']
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def retrieve(self, request, *args, **kwargs):
		instance = self.get_object()
		serializer = self.get_serializer(instance)
		# get last article
		last_article = Article.objects.all().order_by('-id').exclude(id=instance.id)[:3]
		serializer_last_article = ArticleSerializer(last_article, many=True)
		
		return Response({
			'article': serializer.data,
			'last_article': serializer_last_article.data
		})

	def get_queryset(self):
		queryset = Article.objects.all().order_by('-id')
		sort = self.request.query_params.get('_sort')
		order = self.request.query_params.get('_order')
		if sort is not None and order == 'asc':
			queryset = queryset.order_by(sort)
		if order == 'desc':
			queryset = queryset.order_by('-'+sort)

		padcast = self.request.query_params.get('padcast')
		if padcast:
			if padcast == 'true':
				queryset = Article.objects.annotate(
					media_count=Count('media')
				).filter(media_count__gt=1).order_by('-id')
			else:
				queryset = Article.objects.annotate(
					media_count=Count('media')
				).filter(media_count=1).order_by('-id')

		return queryset

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		user = get_user_by_token(self.request)
		if user.role.id != 1:
			raise PermissionDenied("اجازه دسترسی به این بخش را ندارید")

		if instance.user.id != user.id:
			raise PermissionDenied("شما اجازه حذف این مقاله را ندارید")

		self.perform_destroy(instance)
		return Response({
			"detail": "مقاله با موفقیت حذف شد",
			"status": status.HTTP_200_OK
		},
		 status=status.HTTP_200_OK)

	def perform_destroy(self, instance):
		instance.delete()
	
	def permission_denied(self, request, message=None, code=None):
		raise PermissionDenied(message)


class ArticleRatingView(viewsets.ModelViewSet):
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)
	queryset = Article.objects.all()
	permission_classes = [AllowAnyUser]

	def retrieve(self, request, *args, **kwargs):
		user = get_user_by_token(self.request)

		instance = self.get_object()

		session_instance = Session.objects.get(session_key=self.request.session.session_key)
		rating_instance = Rating.objects.filter(session= session_instance)
		article_rating = instance.rating.filter(session= session_instance)

		if user is None:
			if article_rating.exists():
				rating = article_rating.values('rate').first()['rate']
				return Response({
					"rating":rating
				})
			else:
				rating = 0
				return Response({
					"rating":rating
				})
		else:
			x = article_rating & rating_instance
			if x.exists():
				rating = x.values('rate').first()['rate']
				return Response({
					"rating":rating
				})
			else:
				rating = 0
				return Response({
					"rating":rating
				})

		
	def update(self, request, *args, **kwargs):
		rating = request.data.get('rating')

		if rating > 5 or rating < 1:
			return Response({
				"detail":"امتیاز باید بین 1 تا 5 باشد",
				'status':status.HTTP_400_BAD_REQUEST
			},
			status=status.HTTP_400_BAD_REQUEST)

		instance = self.get_object()

		user = get_user_by_token(self.request)
		session_instance = Session.objects.get(session_key=self.request.session.session_key)
		rating_instance = Rating.objects.filter(session= session_instance)
		article_rating = instance.rating.filter(session= session_instance)
		
		if user is None:
			x = article_rating & rating_instance
			if x.exists():
				get_id_rate = x.values('id')
				rating_id = Rating.objects.filter(id__in=get_id_rate, session= session_instance).first()
				rating_id.rate = rating
				rating_id.save()
			else:
				rating = Rating.objects.create(session= session_instance, rate=rating)
				instance.rating.add(rating)

		else:
			check_user_is_active(user)
			instance_rate = instance.rating.filter(user=user).values('id')
			instance_session = instance.rating.filter(session= session_instance).values('id')

			if instance_rate.exists():
				rating_id = Rating.objects.filter(id__in=instance_rate).first()
				rating_id.rate = rating
				rating_id.save()

			elif instance_session.exists():
				rating_id = Rating.objects.filter(id__in=instance_session).first()
				rating_id.rate = rating
				if not rating_id.user:
					rating_id.user = user
				rating_id.save()
				
			else:
				rating = Rating.objects.create(user= user, rate=rating, session = session_instance)
				instance.rating.add(rating)

		return Response({
				"detail":"امتیاز با موفقیت ثبت شد",
				'status':status.HTTP_200_OK
			},status=status.HTTP_200_OK)


class CommentView(viewsets.ModelViewSet):
	"""
		CommentViewSet
		This viewset create comment by user
	"""
	permission_classes = [AllowAnyUser]
	pagination_class = PageNumberAsLimitOffset
	queryset = Article.objects.all()
	serializer_class = CommentSerializer
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def retrieve(self, request, *args, **kwargs):
		article = Article.objects.get(id=kwargs['pk'])
		get_comment = article.comment.all().order_by('-id')
		serializer = CommentSerializer(get_comment, many=True)
		# pagination
		paginator = PageNumberAsLimitOffset()
		page = paginator.paginate_queryset(serializer.data, request)
		if page is not None:
			return paginator.get_paginated_response(page)

		return Response(serializer.data)

	def get_queryset(self):
		queryset = Comment.objects.all().order_by('-id')
		return queryset
	

class ContactUsView(viewsets.ModelViewSet):
	"""
		ContactUsViewSet
		This viewset create contact us by user
	"""
	permission_classes = [AllowAnyUser]
	queryset = ContactUs.objects.all()
	serializer_class = ContactUsSerializer
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def get_queryset(self):
		queryset = ContactUs.objects.all().order_by('-id')
		return queryset


class MetaView(APIView):
	"""
		show meta for seo
	"""
	permission_classes = [AllowAnyUser]
	authentication_classes = (CsrfExemptSessionAuthentication, BasicAuthentication)

	def get(self, request):
		meta = Meta.objects.all()
		schima = Schima.objects.all()
		canonical = Canonical.objects.all()
		seo_content = Content.objects.all()

		path = request.query_params.get('path')
		if path:
			meta = meta.filter(path=path)
			schima = schima.filter(path=path)
			canonical = canonical.filter(path=path)
			seo_content = seo_content.filter(path=path)

		property_type = request.query_params.get('property_type')
		if property_type:
			meta = meta.filter(property_type=property_type)

		data = {
			'meta': MetaSerializer(meta, many=True).data,
			'schima': SchimaSerializer(schima, many=True).data,
			'canonical': CanonicalSerializer(canonical, many=True).data,
			'content': ContentSerializer(seo_content, many=True).data,
		}
		return Response(data)
