from rest_framework.response import Response
from rest_framework import pagination



class MyPageNumberPagination(pagination.PageNumberPagination):
    page_size_query_param = "page_size"
    # page_size = api_settings.PAGE_SIZE  # default size
    # page_size = 1
    

class PageNumberAsLimitOffset(pagination.PageNumberPagination):
    page_query_param = "_page"   # this is the "page"
    page_size_query_param="_limit" # this is the "page_size"
    # page_size = api_settings.PAGE_SIZE # default size


    def get_paginated_response(self, data):
        return Response({
            'next': self.page.next_page_number() if self.page.has_next() else None,
            'previous': self.page.previous_page_number() if self.page.has_previous() else None,
            'count': self.page.paginator.count,
            'results': data
        })
