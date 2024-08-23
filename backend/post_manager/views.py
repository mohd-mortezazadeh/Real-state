from rest_framework.authentication import BasicAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from django.contrib.sessions.models import Session
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django.db.models.functions import Cast
from django.db.models import IntegerField
from rest_framework.views import APIView
from django.db.models import Avg, Sum
from rest_framework import generics
from rest_framework import viewsets
from rest_framework import filters
from django.db.models import Count
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
import time

from blog.models import Content

from .serializers import (AdSerializer, CategorySerializer, CategorySerializer2, SectionSerializer,
                          AdOptionSerializer, AdCreateSerializer, MediaUserSerializer,
                          UserMetaSerializer, CreatePasswordSerializer, CheckAdvisorSerializer,
                          TicketSerializer, ChangeRoleSerializer, AdPreviewSerializer)
from .models import Ad, AdMeta, Category, Section, AdOption, Visitor

from user_area.permissions import AllowAnyUser, IsAuthenticatedUser, IsAuthenticatedBookmarkUser, IsAdminUser
from user_area.functions import CsrfExemptSessionAuthentication, check_user_is_active
from user_area.models import MediaUser, UserMeta, User, Ticket, Rating, Company
from user_area.paginations import PageNumberAsLimitOffset
from user_area.authentication import get_user_by_token


class AdView(viewsets.ModelViewSet):
    """
            This viewset automatically provides `list` and `detail` actions for Ad model.
            This class show all active ads and similar ads in website
            - filter by category
            - filter by category meta
            - filter by city
            - filter by section
            - filter user ads
            - etc.
    """
    permission_classes = [AllowAnyUser]
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    pagination_class = PageNumberAsLimitOffset
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def get_serializer_class(self):
        if self.action == 'list':
            return AdPreviewSerializer
        elif self.action == 'retrieve':
            return AdSerializer
        else:
            return AdSerializer

    def retrieve(self, request, *args, **kwargs):

        instance = self.get_object()
        # get ad
        serializer = self.get_serializer(instance)

        # view post
        if request.user:
            instance.view += 1
            instance.save()

        # get similar ads
        similar_ads = Ad.objects.filter(
            category=instance.category, section__city=instance.section.city.id, status=1).exclude(id=instance.id)[:3]
        similar_serializer = AdPreviewSerializer(similar_ads, many=True)

        return Response({
            'ad': serializer.data,
            'similar_ads': similar_serializer.data
        })

    def list(self, request, *args, **kwargs):
        queryset = Ad.objects.filter(status=1).order_by('-id')

        # ? Search with code or title
        q = self.request.query_params.get('q', None)
        if q:
            if q.isdigit():
                get_code = int(q)-1230
                queryset = Ad.objects.filter(id=get_code)
            else:
                queryset = Ad.objects.filter(
                    title__icontains=q).order_by('-id')

        province = self.request.query_params.get('province', None)
        if province:
            queryset = queryset.filter(section__city__province__slug=province)

        # filter by city
        city = self.request.query_params.get('city', None)
        if city:
            queryset = queryset.filter(section__city__slug=city)
            if city == 'shomal':
                # get all ads
                queryset = Ad.objects.filter(status=1).order_by('-id')

        # get all villa
        villa = queryset.filter(category__name='villa-saheli') | queryset.filter(
            category__name='villa-jangali') | queryset.filter(category__name='villa-shahraki')

        category = self.request.query_params.get('category', None)
        # get category
        if category:
            queryset = queryset.filter(category__name=category)
            if category == 'villa':
                queryset = villa

        # filter by section
        section = self.request.query_params.get('section', None)
        if section:
            queryset = queryset.filter(section__slug=section)

        # show Add Meta
        meta = self.request.query_params.get('meta', None)
        if meta:
            meta = meta.split('-')
            data = AdMeta.objects.annotate(
                text_int=Cast('value', output_field=IntegerField())
            ).filter(text_int__gte=meta[0], text_int__lte=meta[1], ad__in=queryset).values_list('ad', flat=True)

            queryset = queryset.filter(id__in=data)

        # filter by ad option
        PARAMS = ['estakhr', 'asansor', 'parking',
                  'roof_garden', 'sona_jacozi', 'anbari']
        details = {}
        for param in PARAMS:
            details[param] = self.request.query_params.get(param, None)
            if details[param]:
                queryset = queryset.filter(options__name=param)

        # filter by price
        price = self.request.query_params.get('price', None)
        if price:
            price = price.split('-')
            queryset = queryset.filter(price__range=[price[0], price[1]])

        # filter by user
        user = self.request.query_params.get('user', None)
        if user:
            queryset = queryset.filter(user__id=user)

        # TODO sort serializer data by created_at date (nardeban)

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)

        serializer_data = sorted(
            serializer.data, key=lambda k: k['date'], reverse=True)

        if page is not None:
            return self.get_paginated_response(serializer.data)

        return Response(serializer_data)


class AdPreviewView(viewsets.ModelViewSet):
    """
            This class is for show
            preview of ad
    """
    permission_classes = [AllowAnyUser]
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def get_queryset(self):
        user = get_user_by_token(self.request)
        queryset = Ad.objects.filter(status=0, user=user).order_by('-id')
        return queryset


class AddPostView(viewsets.ModelViewSet):
    """
            This class is for create and update ad
    """
    permission_classes = [IsAuthenticatedUser]
    queryset = Ad.objects.all()
    serializer_class = AdCreateSerializer
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)


class CreateMediaView(viewsets.ModelViewSet):
    """
            This class is for create media
    """
    permission_classes = [IsAuthenticatedUser]
    queryset = MediaUser.objects.all()
    serializer_class = MediaUserSerializer
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)


class SectionView(generics.ListAPIView):
    """
            This class is for get section
            filter by name or city
    """
    permission_classes = [AllowAnyUser]
    serializer_class = SectionSerializer
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def get(self, request):
        queryset = Section.objects.all().order_by('id')
        name = request.query_params.get('name', None)
        city = request.query_params.get('city', None)
        city_name = request.query_params.get('city-name', None)
        if city_name:
            queryset = queryset.filter(city__slug=city_name)

        if name:
            queryset = queryset.filter(name__exact=name)

        elif city:
            queryset = queryset.filter(city=city)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CategoryView(APIView):
    """
            This class is for get category
    """
    permission_classes = [AllowAnyUser]
    serializer_class = CategorySerializer
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def get(self, request, format=None):
        categories = Category.objects.all().filter(status=True)
        city = request.query_params.get('city', None)

        if city:
            categories = categories.filter(city__slug=city)

        serializer = self.serializer_class(categories, many=True)

        return Response(serializer.data)


class GetCategory(generics.RetrieveAPIView):
    permission_classes = [AllowAnyUser]

    def get(self, request, name):
        category = get_object_or_404(Category, name=name)
        # print("\n\n\n\n\ category : ", category, end="\n\n\n\n\n")
        category_data = CategorySerializer2(category)
        return Response(category_data.data, status=status.HTTP_200_OK)


class AdOptionView(APIView):
    """
            This class is for get ad option
            filter by category
    """
    permission_classes = [AllowAnyUser]
    serializer_class = AdOptionSerializer
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def get(self, request, format=None):
        ad_options = AdOption.objects.all()
        category = request.query_params.get('category', None)
        if category:
            ad_options = ad_options.filter(category__id=category)

        serializer = self.serializer_class(ad_options, many=True)
        return Response(serializer.data)


#! Dashboard Users
class DashboardUsersView(APIView):
    """
            This class is for get all users
    """
    permission_classes = [IsAuthenticatedUser]
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def get(self, request, format=None):
        user = get_user_by_token(request)
        if user.status != 1:
            return Response({
                'status': status.HTTP_403_FORBIDDEN,
                'message': 'شما اجازه دسترسی به این بخش را ندارید'
            }, status=status.HTTP_403_FORBIDDEN)

        posts_count = Ad.objects.filter(user=user, status=1).count()
        bookmark_count = Ad.objects.filter(
            bookmark__id=user.id, status=1).count()
        if user.role.name == 'real_estate':
            company = user.company_name
            active_advisor = User.objects.filter(
                company_name=company, role__name='advisor', status=1).count()
            pending_advisor = User.objects.filter(
                company_name=company, role__name='advisor', status=0).count()
            ad_advisor = Ad.objects.filter(
                user__company_name=company, status=1).exclude(user=user).count()
        else:
            active_advisor = None
            pending_advisor = None
            ad_advisor = None

        return Response({
            'posts_count': posts_count,
            'bookmark_count': bookmark_count,
            'active_advisor': active_advisor,
            'pending_advisor': pending_advisor,
            'ad_advisor': ad_advisor
        })


class ProfileUsersView(viewsets.ModelViewSet):
    """
            This class is for get profile users include owner, advisor, real_estate
            this class for create and update profile
    """
    permission_classes = [IsAuthenticatedUser]
    queryset = UserMeta.objects.all()
    serializer_class = UserMetaSerializer
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def get_queryset(self):
        user = get_user_by_token(self.request)
        check_user_is_active(user)
        queryset = UserMeta.objects.filter(user=user)
        return queryset

    def permission_denied(self, request, message=None, code=None):
        raise PermissionDenied(message)


class MyAdUsersView(viewsets.ModelViewSet):
    """
            This class is for get for all user ad
            filter by status for example: -1, 0, 1
    """
    permission_classes = [IsAuthenticatedUser]
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    filterset_fields = ('status',)
    pagination_class = PageNumberAsLimitOffset
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def get_serializer_class(self):
        if self.action == 'list':
            return AdPreviewSerializer
        elif self.action == 'retrieve':
            return AdSerializer
        else:
            return AdSerializer

    def get_queryset(self):
        user = get_user_by_token(self.request)
        check_user_is_active(user)
        queryset = Ad.objects.filter(user=user).order_by('-id')

        # ? Search with code or title
        q = self.request.query_params.get('q', None)
        if q:
            if q.isdigit():
                get_code = int(q)-1230
                queryset = Ad.objects.filter(id=get_code)
            else:
                queryset = Ad.objects.filter(title__icontains=q)

        sort = self.request.query_params.get('_sort')
        order = self.request.query_params.get('_order')
        if sort is not None and order == 'asc':
            queryset = queryset.order_by(sort)
        if order == 'desc':
            queryset = queryset.order_by('-'+sort)

        return queryset

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = get_user_by_token(request)
        if instance.user != user:
            raise PermissionDenied('شما مجاز به انجام این کار نیستید')

        self.perform_destroy(instance)
        return Response({
                        "detail": "پست با موفقیت حذف شد",
                        'status': status.HTTP_200_OK
                        },
                        status=status.HTTP_200_OK)

    def perform_destroy(self, instance):
        instance.delete()

    def permission_denied(self, request, message=None, code=None):
        raise PermissionDenied(message)


class BookmarkView(viewsets.ModelViewSet):
    """
            Bookmark every ad by user
    """
    permission_classes = (IsAuthenticatedBookmarkUser,)
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    pagination_class = PageNumberAsLimitOffset
    search_fields = ['title', ]
    filter_backends = (filters.SearchFilter, DjangoFilterBackend)
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def get_queryset(self):
        user = get_user_by_token(self.request)
        check_user_is_active(user)
        queryset = Ad.objects.filter(bookmark=user).order_by('-id')
        sort = self.request.query_params.get('_sort')
        order = self.request.query_params.get('_order')
        if sort is not None and order == 'asc':
            queryset = queryset.order_by(sort)
        if order == 'desc':
            queryset = queryset.order_by('-'+sort)
        return queryset

    def update(self, request, *args, **kwargs):
        instance = Ad.objects.get(id=kwargs['pk'])
        user = get_user_by_token(request)

        if instance.bookmark.filter(id=user.id).exists():
            instance.bookmark.remove(user)
            return Response({
                "is_bookmarked": False,
                "detail": "پست مورد نظر از علاقمندی های شما با موفقیت حذف شد",
                'status': status.HTTP_200_OK
            },
                status=status.HTTP_200_OK)
        else:
            instance.bookmark.add(user)
            return Response({
                "is_bookmarked": True,
                "detail": "پست مورد نظر به علاقمندی ها اضافه شد",
                'status': status.HTTP_200_OK
            },
                status=status.HTTP_200_OK)

    def permission_denied(self, request, message=None, code=None):
        raise PermissionDenied(message)


class CreatePasswordView(viewsets.ModelViewSet):
    """
            This class is for create password for user
    """
    permission_classes = [IsAuthenticatedUser]
    serializer_class = CreatePasswordSerializer
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def permission_denied(self, request, message=None, code=None):
        raise PermissionDenied(message)


class CheckAdvisorView(viewsets.ModelViewSet):
    """
            This class is for check advisor with real estate
            check spcific advisor with real estate
    """
    permission_classes = [IsAuthenticatedUser]
    serializer_class = CheckAdvisorSerializer
    filterset_fields = ['status', ]
    pagination_class = PageNumberAsLimitOffset
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def get_queryset(self):
        user = get_user_by_token(self.request)
        check_user_is_active(user)

        if user.role.name != 'real_estate':
            raise PermissionDenied('شما مجاز به انجام این کار نیستید')

        company = user.company_name
        queryset = User.objects.filter(
            company_name=company, role__name='advisor').order_by('-id')

        return queryset

    def permission_denied(self, request, message=None, code=None):
        raise PermissionDenied(message)


class TicketView(viewsets.ModelViewSet):
    """
            This class is for create ticket for user
            - retrieve ticket get id of ticket and show this ticket and another reply of this ticket
            - queryset ticket show all ticket of user without reply
    """
    permission_classes = [IsAuthenticatedUser]
    serializer_class = TicketSerializer
    search_fields = ['title', ]
    filter_backends = (filters.SearchFilter, DjangoFilterBackend)
    filterset_fields = ['urgency', 'department']
    pagination_class = PageNumberAsLimitOffset
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def retrieve(self, request, *args, **kwargs):
        user = get_user_by_token(self.request)

        check_user_is_active(user)
        instance = Ticket.objects.get(id=kwargs['pk'])
        if instance.user != user and user.role.name != 'admin':
            raise PermissionDenied('شما مجاز به انجام این کار نیستید')

        ticket = Ticket.objects.filter(
            id=kwargs['pk']).values_list('id', flat=True)
        replied_to = Ticket.objects.filter(
            replied_to__in=ticket).values_list('id', flat=True)

        while True:
            ticket = ticket | replied_to
            if replied_to:
                replied_to = Ticket.objects.filter(
                    replied_to__in=replied_to).values_list('id', flat=True)

            else:
                break

        queryset = Ticket.objects.filter(id__in=ticket).order_by('id')

        serializer = TicketSerializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        user = get_user_by_token(self.request)
        check_user_is_active(user)

        queryset = Ticket.objects.filter(
            user=user, replied_to=None).order_by('-id')
        if user.role.name == "admin":
            queryset = Ticket.objects.filter(replied_to=None).order_by('-id')

        if user.role.name == "admin" and self.request.method == 'PUT' or self.request.method == 'DELETE':
            queryset = Ticket.objects.all()

        sort = self.request.query_params.get('_sort')
        order = self.request.query_params.get('_order')
        if sort is not None and order == 'asc':
            queryset = queryset.order_by(sort)
        if order == 'desc':
            queryset = queryset.order_by('-'+sort)

        return queryset

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = get_user_by_token(request)

        if user.role.id != 1:
            raise PermissionDenied('شما مجاز به انجام این کار نیستید')

        if instance.user != user:
            raise PermissionDenied('شما مجاز به انجام این کار نیستید')

        self.perform_destroy(instance)
        return Response({
                        "detail": "تیکت با موفقیت حذف شد",
                        'status': status.HTTP_200_OK
                        },
                        status=status.HTTP_200_OK)

    def perform_destroy(self, instance):
        instance.delete()

    def permission_denied(self, request, message=None, code=None):
        raise PermissionDenied(message)


class RatingUserView(viewsets.ModelViewSet):
    """
            This class is for rating user with and without login
            with login:
                    use session and token
            without login:
                    use session
            - retrieve rating get id of user and show rating of this user
            - update rating get id of user and update rating of this user
    """

    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)
    queryset = User.objects.all()
    permission_classes = [AllowAnyUser]

    def retrieve(self, request, *args, **kwargs):
        user = get_user_by_token(self.request)

        instance = self.get_object()
        session_instance = Session.objects.get(
            session_key=self.request.session.session_key)
        rating_instance = Rating.objects.filter(session=session_instance)
        user_rating = instance.rating.filter(session=session_instance)

        if user is None:
            if user_rating.exists():
                rating = user_rating.values('rate').first()['rate']
                return Response({
                    "rating": rating
                })
            else:
                rating = 0
                return Response({
                    "rating": rating
                })
        else:
            x = user_rating & rating_instance
            if x.exists():
                rating = x.values('rate').first()['rate']
                return Response({
                    "rating": rating
                })
            else:
                rating = 0
                return Response({
                    "rating": rating
                })

    def update(self, request, *args, **kwargs):
        rating = request.data.get('rating')

        if rating > 5 or rating < 1:
            return Response({
                "detail": "امتیاز باید بین 1 تا 5 باشد",
                'status': status.HTTP_400_BAD_REQUEST
            },
                status=status.HTTP_400_BAD_REQUEST)

        instance = self.get_object()

        user = get_user_by_token(self.request)
        session_instance = Session.objects.get(
            session_key=self.request.session.session_key)
        rating_instance = Rating.objects.filter(session=session_instance)
        user_rating = instance.rating.filter(session=session_instance)

        if user is None:
            x = user_rating & rating_instance
            if x.exists():
                get_id_rate = x.values('id')
                rating_id = Rating.objects.filter(
                    id__in=get_id_rate, session=session_instance).first()
                rating_id.rate = rating
                rating_id.save()
            else:
                rating = Rating.objects.create(
                    session=session_instance, rate=rating)
                instance.rating.add(rating)

        else:
            check_user_is_active(user)
            instance_rate = instance.rating.filter(user=user).values('id')
            instance_session = instance.rating.filter(
                session=session_instance).values('id')

            if instance_rate.exists():
                rating_id = Rating.objects.filter(id__in=instance_rate).first()
                rating_id.rate = rating
                rating_id.save()

            elif instance_session.exists():
                rating_id = Rating.objects.filter(
                    id__in=instance_session).first()
                rating_id.rate = rating
                if not rating_id.user:
                    rating_id.user = user
                rating_id.save()

            else:
                rating = Rating.objects.create(
                    user=user, rate=rating, session=session_instance)
                instance.rating.add(rating)

        return Response({
                        "detail": "امتیاز با موفقیت ثبت شد",
                        'status': status.HTTP_200_OK
                        }, status=status.HTTP_200_OK)


class ChartUserView(APIView):
    """
            This class is for chart user
            - get chart get id of user and show chart of this user
    """

    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)
    serializer_class = AdSerializer
    permission_classes = [IsAuthenticatedUser]

    def get(self, request, format=None):
        user = get_user_by_token(self.request)
        check_user_is_active(user)

        seven_days_ago = []
        for i in range(7):
            seven_days_ago.append(timezone.now() - timedelta(days=i))

        ads = {}
        for date in seven_days_ago:
            timestamp = int(time.mktime(date.timetuple()))
            get_ad = Ad.objects.filter(user=user, status=1, created_at__date=date).values('user')\
                .annotate(count=Count('id'), view=Sum('view')).values('count', 'view')

            if get_ad.exists():
                ads[timestamp] = get_ad[0]
            else:
                ads[timestamp] = {
                    'count': 0,
                    'view': 0
                }

        return Response({
            "ads": ads,
        })


class ChartAdminView(APIView):
    """
            This class is for chart admin
            - get chart get id of user and show chart of this user
            - force by provider in middle of project 
    """

    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)
    serializer_class = AdSerializer
    permission_classes = [IsAdminUser]

    def get(self, request, format=None):
        user = get_user_by_token(self.request)
        check_user_is_active(user)

        seven_days_ago = []
        for i in range(7):
            seven_days_ago.append(timezone.now() - timedelta(days=i))

        visit = {}
        for date in seven_days_ago:
            visit_count = Visitor.objects.filter(last_visit__date=date).values('last_visit__date')\
                .annotate(count=Count('id')).values('count')

            timestamp = int(time.mktime(date.timetuple()))
            if visit_count.exists():
                visit[timestamp] = visit_count[0]
            else:
                visit[timestamp] = {
                    'count': 0
                }

        return Response({
            "visit": visit,
        })

    def permission_denied(self, request, message=None, code=None):
        raise PermissionDenied(message)


class BestAdvisorView(APIView):
    """
            This class is for best advisor in home page with count of ads & view& rating

    """
    permission_classes = [AllowAnyUser]
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def get(self, request):
        # 70% post , 20% view , 10% rating
        user = User.objects.filter(role__name='advisor', status=1)

        best_advisor = []
        for u in user:
            if Ad.objects.filter(user=u, status=1).exists():
                best_advisor.append({
                    'id': u.id,
                    'fullname': u.fullname,
                    'phone': u.phone,
                    'avatar': MediaUserSerializer(u.avatar).data,
                    'id_company': u.company_name.id,
                    'company_name': u.company_name.name,
                    'company_owner': u.company_name.owner.fullname,
                    'company_phone': u.company_name.owner.phone,
                    'ad_count': Ad.objects.filter(user=u, status=1).count(),
                    'ad_view': Ad.objects.filter(user=u, status=1).aggregate(Sum('view'))['view__sum'],
                    'user_rating': u.rating.aggregate(Avg('rate'))['rate__avg'] if u.rating.exists() else 0,
                })
            else:
                pass

        best_advisor = sorted(best_advisor, key=lambda k: k['ad_count']*.7 + k['ad_view']*.2 +
                              k['user_rating']*.1, reverse=True)[:20]
        return Response({
            "best_advisor": best_advisor,
        })


class BestRealEstate(APIView):
    """
            Best real estate in home page with count of ads & advisor
    """
    permission_classes = [AllowAnyUser]
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def get(self, request):
        # 90% advisor , 10% ads
        user = User.objects.filter(role__name='real_estate', status=1)

        best_realtor = []
        for u in user:
            if Ad.objects.filter(user=u, status=1).exists():
                best_realtor.append({
                    'id': u.id,
                    'fullname': u.fullname,
                    'phone': u.phone,
                    'avatar': MediaUserSerializer(u.avatar).data,
                    'id_company': u.company_name.id,
                    'company_name': u.company_name.name,
                    'ad_count': Ad.objects.filter(user=u, status=1).count(),
                    'advisor_count': User.objects.filter(company_name=u.company_name, role__name='advisor').count(),
                })

        best_realtor = sorted(
            best_realtor, key=lambda k: k['ad_count']*.1 + k['advisor_count']*.9, reverse=True)[:20]
        return Response({
            'best_realtor': best_realtor
        })


class LandingCounterView(APIView):
    """
            This class is for landing counter
            - get landing counter get id of landing and show counter of this landing
    """
    permission_classes = [AllowAnyUser]
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def get(self, request, format=None):
        user = User.objects.filter(status=1)
        user_count = user.count() + 200
        real_estate = user.filter(role__name='real_estate').count() + 15
        advisor = user.filter(role__name='advisor').count(
        ) + user.filter(role__name='free_advisor').count() + 100
        data = {
            'user_count': user_count,
            'real_estate': real_estate,
            'advisor': advisor
        }
        return Response({
            "data": data,
        })


class ChangeRoleView(viewsets.ModelViewSet):
    """
            This class is for change role of user
            - get change role get id of user and show change role of this user
    """
    permission_classes = [IsAuthenticatedUser]
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)
    queryset = User.objects.all()
    serializer_class = ChangeRoleSerializer

    def update(self, request, *args, **kwargs):
        user = get_user_by_token(self.request)
        check_user_is_active(user)
        instance = self.get_object()
        user_roleid = user.role.id
        role = request.data['role']
        company = request.data['company']

        if instance != user:
            raise PermissionDenied("شما اجازه تغییر نقش این کاربر را ندارید")

        if user_roleid == 1:
            raise PermissionDenied("شما اجازه تغییر نقش خود را ندارید")

        if role == 1:
            raise PermissionDenied("شما اجازه تغییر نقش خود را ندارید")

        check_company = Company.objects.filter(name=company)

        roles = [3, 5, 6]
        if role in roles:
            if user_roleid == 4 and User.objects.filter(role__name='advisor', company_name=user.company_name).exists():
                raise PermissionDenied("شما اجازه تغییر نقش خود را ندارید ")

            if role == 4 or role == 3:
                if not company:
                    raise PermissionDenied("شما باید یک شرکت انتخاب کنید")

            if role == 3:
                company_id = check_company[0].id
                if user_roleid == 4 and user.company_name.id == company_id:
                    raise PermissionDenied("شما این شرکت رو ثبت کرده اید")

            # ? Delete Company for real estate when change role
            user.company_name = None
            user.save()
            if user_roleid == 4:
                Company.objects.filter(owner=user).delete()

        # ? THIS IS DOESN'T WORK BECAUSE OF PYTHON VERSION ON CPANEL
        # match role:
        # 	case 5|6:
        # 		user.role_id = role
        # 		user.status = 1
        # 		user.save()

        # 	case 3:
        # 		if check_company.exists():
        # 			company = check_company[0]
        # 			user.role_id = role
        # 			user.company_name = company
        # 			user.status = 0
        # 			user.save()
        # 		else:
        # 			raise PermissionDenied("شرکت انتخاب شده موجود نیست")

        # 	case 4:
        # 		company_owner = Company.objects.filter(owner=user)
        # 		if company_owner:
        # 			company_owner.update(name=company)
        # 		else:
        # 			x = Company.objects.create(name=company, owner=user)
        # 			user.role_id = role
        # 			user.company_name = x
        # 			user.status = 0
        # 			user.save()

        if role == 5 or role == 6:
            user.role_id = role
            user.status = 1
            user.save()

        if role == 3:
            if check_company.exists():
                company = check_company[0]
                user.role_id = role
                user.company_name = company
                user.status = 0
                user.save()
            else:
                raise PermissionDenied("شرکت انتخاب شده موجود نیست")

        if role == 4:
            company_owner = Company.objects.filter(owner=user)
            if company_owner:
                company_owner.update(name=company)
            else:
                x = Company.objects.create(name=company, owner=user)
                user.role_id = role
                user.company_name = x
                user.status = 0
                user.save()

        return Response({
            "detail": "نقش با موفقیت تغییر کرد",
            'status': status.HTTP_200_OK
        }, status=status.HTTP_200_OK)

    def permission_denied(self, request, message=None, code=None):
        raise PermissionDenied(message)


# ? get all data for seo
class PostsView(APIView):

    permission_classes = [AllowAnyUser]
    authentication_classes = (
        CsrfExemptSessionAuthentication, BasicAuthentication)

    def get(self, request, format=None):
        posts = Ad.objects.filter(status=1).order_by('-id')
        serializer = AdSerializer(
            posts, many=True, context={'request': request})
        return Response({
            "posts": serializer.data
        })
