from django.http import Http404
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product
from .serializers import ProductIngestSerializer, ProductSerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = (
        Product.objects.all()
        .prefetch_related('media', 'makers', 'product_links')
        .order_by('-featured_at', '-votes_count')
    )
    serializer_class = ProductSerializer
    # Performance: use human-readable slug lookup so frontend detail pages can fetch one product directly.
    lookup_field = 'slug'
    lookup_value_regex = '[-a-zA-Z0-9_]+'

    def retrieve(self, request, *args, **kwargs):
        slug = kwargs.get(self.lookup_field)
        instance = self.get_queryset().filter(slug=slug).first()
        if not instance:
            raise Http404('No Product matches the given query.')
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class ProductIngestAPIView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        serializer = ProductIngestSerializer(
            data=request.data,
            context={'raw_payload': request.data},
        )
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)
