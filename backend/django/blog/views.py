from rest_framework import viewsets

from .models import BlogPost
from .serializers import BlogPostSerializer


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'
    search_fields = ('title', 'excerpt')
    ordering_fields = ('published_at', 'updated_at', 'created_at')
    ordering = ('-published_at',)
