import django_filters

from .models import Product


class ProductFilter(django_filters.FilterSet):
    min_votes = django_filters.NumberFilter(field_name='votes_count', lookup_expr='gte')
    max_votes = django_filters.NumberFilter(field_name='votes_count', lookup_expr='lte')
    min_rating = django_filters.NumberFilter(field_name='reviews_rating', lookup_expr='gte')
    max_rating = django_filters.NumberFilter(field_name='reviews_rating', lookup_expr='lte')

    created_after = django_filters.IsoDateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.IsoDateTimeFilter(field_name='created_at', lookup_expr='lte')
    featured_after = django_filters.IsoDateTimeFilter(field_name='featured_at', lookup_expr='gte')
    featured_before = django_filters.IsoDateTimeFilter(field_name='featured_at', lookup_expr='lte')

    maker_username = django_filters.CharFilter(field_name='makers__username', lookup_expr='iexact')
    media_type = django_filters.CharFilter(field_name='media__type', lookup_expr='iexact')
    has_reviews = django_filters.BooleanFilter(method='filter_has_reviews')

    class Meta:
        model = Product
        fields = [
            'min_votes',
            'max_votes',
            'min_rating',
            'max_rating',
            'created_after',
            'created_before',
            'featured_after',
            'featured_before',
            'maker_username',
            'media_type',
            'has_reviews',
        ]

    def filter_has_reviews(self, queryset, name, value):
        if value:
            return queryset.filter(reviews_count__gt=0)
        return queryset.filter(reviews_count=0)
