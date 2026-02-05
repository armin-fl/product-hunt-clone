from django.db import models


class Maker(models.Model):
    username = models.CharField(max_length=150, unique=True)
    name = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return self.username


class Product(models.Model):
    # Core Product Hunt fields; keep raw_payload for replay/debugging when the API shape changes.
    ph_id = models.CharField(max_length=32, unique=True)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, db_index=True)
    tagline = models.CharField(max_length=280, blank=True)
    description = models.TextField(blank=True)
    url = models.URLField(max_length=500, blank=True)
    website = models.URLField(max_length=500, blank=True)
    votes_count = models.IntegerField(default=0, db_index=True)
    reviews_count = models.IntegerField(default=0)
    reviews_rating = models.DecimalField(max_digits=4, decimal_places=2, default=0)
    created_at = models.DateTimeField(db_index=True)
    featured_at = models.DateTimeField(null=True, blank=True, db_index=True)
    thumbnail_url = models.URLField(max_length=500, blank=True)
    fetched_at = models.DateTimeField(auto_now_add=True)
    raw_payload = models.JSONField(blank=True, null=True)  # full source payload from Product Hunt

    makers = models.ManyToManyField(Maker, through='ProductMaker', related_name='products')

    def __str__(self):
        return f"{self.name} ({self.ph_id})"


class ProductMaker(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    maker = models.ForeignKey(Maker, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('product', 'maker')


class ProductMedia(models.Model):
    MEDIA_IMAGE = 'image'
    MEDIA_VIDEO = 'video'
    MEDIA_TYPES = [
        (MEDIA_IMAGE, 'Image'),
        (MEDIA_VIDEO, 'Video'),
    ]

    product = models.ForeignKey(Product, related_name='media', on_delete=models.CASCADE)
    url = models.URLField(max_length=500)
    type = models.CharField(max_length=20, choices=MEDIA_TYPES)

    def __str__(self):
        return f"{self.type}: {self.url}"


class ProductLink(models.Model):
    product = models.ForeignKey(Product, related_name='product_links', on_delete=models.CASCADE)
    url = models.URLField(max_length=500)
    type = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.type}: {self.url}"
