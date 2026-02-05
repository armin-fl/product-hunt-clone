from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ProductIngestAPIView, ProductViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
    path('ingest/producthunt/', ProductIngestAPIView.as_view(), name='producthunt-ingest'),
]
