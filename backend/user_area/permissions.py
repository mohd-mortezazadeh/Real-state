from rest_framework.permissions import BasePermission

from .authentication import get_user_by_token



#? Permissions for admin
class IsAdminUser(BasePermission):
    message = "ادمین اجازه دسترسی به این بخش را دارد"

    def has_permission(self, request, view):
        auth = get_user_by_token(request)
        if auth:
            return auth.role.name == 'admin'
        else:
            return False


#? Permissions for any user
class AllowAnyUser(BasePermission):
    def has_permission(self, request, view):
        return True


#? Permissions for authenticated user
class IsAuthenticatedUser(BasePermission):
    message = 'باید وارد شوید'

    def has_permission(self, request, view):
        return get_user_by_token(request)


#? Permission For Like
class IsAuthenticatedLikeUser(BasePermission):
    message = "برای لایک کردن وارد سایت شوید"

    def has_permission(self, request, view):
        return get_user_by_token(request)


#? Permission For Bookmark
class IsAuthenticatedBookmarkUser(BasePermission):
    message = "برای افزودن به علاقمندی ها وارد سایت شوید"

    def has_permission(self, request, view):
        return get_user_by_token(request)


#? Permission For Rating
class IsAuthenticatedRatingUser(BasePermission):
    message = "برای امتیاز دادن وارد سایت شوید"

    def has_permission(self, request, view):
        return get_user_by_token(request)
        