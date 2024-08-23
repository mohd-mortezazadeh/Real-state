from django.urls import path, include
from rest_framework import routers

from .views import *



app_name = "post_manager"
router = routers.SimpleRouter()
#? Url for get all ads
router.register('post', AdView, basename='post')
router.register('addpost', AddPostView, basename='addpost')
router.register('preview', AdPreviewView , basename='preview')
#? Url for image
router.register('media', CreateMediaView, basename='media')
#? Url for dashboard
router.register('profile', ProfileUsersView, basename='profile')
router.register('my-ad', MyAdUsersView, basename='my_ad')
router.register('bookmark', BookmarkView, basename='bookmark')
router.register('password', CreatePasswordView, basename='password')
router.register('check-advisor', CheckAdvisorView, basename='check_advisor')
router.register('ticket', TicketView, basename='ticket')
router.register('ratinguser', RatingUserView, basename='rating_user')
router.register('change-role', ChangeRoleView, basename='chane_role')
router.register('category', ChangeRoleView, basename='category')


urlpatterns = [
    path('', include(router.urls)),

    path('dashboard', DashboardUsersView.as_view() , name='dashboard'),

    path('section', SectionView.as_view() , name='section'),
    path('category', CategoryView.as_view() , name='category'),
    path('options', AdOptionView.as_view() , name='options'),
    path('chart', ChartUserView.as_view() , name='chart'),
    path('chart-admin', ChartAdminView.as_view() , name='chart_admin'),
    path('best-advisor', BestAdvisorView.as_view() , name='best_advisor'),
    path('best-realtor', BestRealEstate.as_view() , name='best_realtor'),
    path('counter', LandingCounterView.as_view() , name='counter'),
    path('posts', PostsView.as_view() , name='posts'),
    path("get-category/<str:name>/", GetCategory.as_view(), name="get-category"),
]