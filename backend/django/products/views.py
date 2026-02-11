from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from clerk_auth.authentication import ClerkJWTAuthentication
from .models import Product
from .serializers import ProductIngestSerializer, ProductSerializer


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = (
        Product.objects.all()
        .prefetch_related('media', 'makers', 'product_links')
        .order_by('-featured_at', '-votes_count')
    )
    serializer_class = ProductSerializer


class ProductIngestAPIView(APIView):
    authentication_classes = [ClerkJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ProductIngestSerializer(
            data=request.data,
            context={'raw_payload': request.data},
        )
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response(ProductSerializer(product).data, status=status.HTTP_201_CREATED)
