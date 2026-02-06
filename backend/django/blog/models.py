from django.db import models


class BlogPost(models.Model):
    slug = models.SlugField(max_length=200, unique=True)
    title = models.CharField(max_length=200)
    excerpt = models.TextField(blank=True)
    content = models.JSONField(blank=True, default=list)
    read_time = models.CharField(max_length=50, blank=True)
    published_at = models.DateTimeField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_at']

    def __str__(self) -> str:
        return self.title
