from django.db import transaction
from rest_framework import serializers

from .models import Maker, Product, ProductLink, ProductMedia


class MakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maker
        fields = ('name', 'username')


class ProductMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMedia
        fields = ('url', 'type')


class ProductLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductLink
        fields = ('url', 'type')


class ProductSerializer(serializers.ModelSerializer):
    media = ProductMediaSerializer(many=True, read_only=True)
    makers = MakerSerializer(many=True, read_only=True)
    product_links = ProductLinkSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            'ph_id',
            'name',
            'slug',
            'tagline',
            'description',
            'url',
            'website',
            'votes_count',
            'created_at',
            'featured_at',
            'reviews_count',
            'reviews_rating',
            'thumbnail_url',
            'media',
            'makers',
            'product_links',
            'fetched_at',
        )


class IngestThumbnailSerializer(serializers.Serializer):
    url = serializers.URLField()


class IngestMediaSerializer(serializers.Serializer):
    url = serializers.URLField()
    type = serializers.CharField()


class IngestMakerSerializer(serializers.Serializer):
    name = serializers.CharField(required=False, allow_blank=True)
    username = serializers.CharField()


class IngestUserSerializer(serializers.Serializer):
    name = serializers.CharField(required=False, allow_blank=True)
    username = serializers.CharField(required=False, allow_blank=True)


class IngestProductLinkSerializer(serializers.Serializer):
    url = serializers.URLField()
    type = serializers.CharField()


class ProductIngestSerializer(serializers.Serializer):
    id = serializers.CharField()
    votesCount = serializers.IntegerField(required=False, default=0)
    createdAt = serializers.DateTimeField()
    description = serializers.CharField(required=False, allow_blank=True)
    featuredAt = serializers.DateTimeField(required=False, allow_null=True)
    name = serializers.CharField()
    slug = serializers.CharField()
    tagline = serializers.CharField(required=False, allow_blank=True)
    url = serializers.URLField(required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)
    reviewsCount = serializers.IntegerField(required=False, default=0)
    reviewsRating = serializers.DecimalField(max_digits=4, decimal_places=2, required=False, default=0)
    thumbnail = IngestThumbnailSerializer(required=False)
    media = IngestMediaSerializer(many=True, required=False)
    makers = IngestMakerSerializer(many=True, required=False)
    user = IngestUserSerializer(required=False)
    productLinks = IngestProductLinkSerializer(many=True, required=False)

    @transaction.atomic
    def create(self, validated_data):
        media = validated_data.pop('media', [])
        makers = validated_data.pop('makers', [])
        user = validated_data.pop('user', {})
        product_links = validated_data.pop('productLinks', [])
        thumbnail = validated_data.pop('thumbnail', {})

        ph_id = validated_data.pop('id')
        product, _ = Product.objects.update_or_create(
            ph_id=ph_id,
            defaults={
                'name': validated_data.get('name', ''),
                'slug': validated_data.get('slug', ''),
                'tagline': validated_data.get('tagline', ''),
                'description': validated_data.get('description', ''),
                'url': validated_data.get('url', ''),
                'website': validated_data.get('website', ''),
                'votes_count': validated_data.get('votesCount', 0),
                'created_at': validated_data.get('createdAt'),
                'featured_at': validated_data.get('featuredAt'),
                'reviews_count': validated_data.get('reviewsCount', 0),
                'reviews_rating': validated_data.get('reviewsRating', 0),
                'thumbnail_url': thumbnail.get('url', ''),
                'raw_payload': self.context.get('raw_payload'),
            },
        )

        ProductMedia.objects.filter(product=product).delete()
        for item in media:
            ProductMedia.objects.create(
                product=product,
                url=item.get('url', ''),
                type=item.get('type', ''),
            )

        ProductLink.objects.filter(product=product).delete()
        for item in product_links:
            ProductLink.objects.create(
                product=product,
                url=item.get('url', ''),
                type=item.get('type', ''),
            )

        product.makers.clear()
        for maker in makers:
            maker_obj, _ = Maker.objects.update_or_create(
                username=maker.get('username', ''),
                defaults={
                    'name': maker.get('name', ''),
                },
            )
            product.makers.add(maker_obj)

        return product
