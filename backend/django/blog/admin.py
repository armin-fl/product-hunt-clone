from django.contrib import admin

from .models import BlogPost


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'published_at', 'read_time')
    search_fields = ('title', 'excerpt', 'slug')
    list_filter = ('published_at',)
