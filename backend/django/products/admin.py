from django.contrib import admin

from .models import Maker, Product, ProductLink, ProductMaker, ProductMedia


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'ph_id', 'votes_count', 'created_at')


admin.site.register(Maker)
admin.site.register(ProductMaker)
admin.site.register(ProductMedia)
admin.site.register(ProductLink)
