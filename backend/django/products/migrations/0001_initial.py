from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Maker',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=150, unique=True)),
                ('name', models.CharField(blank=True, max_length=150)),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ph_id', models.CharField(max_length=32, unique=True)),
                ('name', models.CharField(max_length=200)),
                ('slug', models.SlugField(db_index=True, max_length=200)),
                ('tagline', models.CharField(blank=True, max_length=280)),
                ('description', models.TextField(blank=True)),
                ('url', models.URLField(blank=True, max_length=500)),
                ('website', models.URLField(blank=True, max_length=500)),
                ('votes_count', models.IntegerField(db_index=True, default=0)),
                ('reviews_count', models.IntegerField(default=0)),
                ('reviews_rating', models.DecimalField(decimal_places=2, default=0, max_digits=4)),
                ('created_at', models.DateTimeField(db_index=True)),
                ('featured_at', models.DateTimeField(blank=True, db_index=True, null=True)),
                ('thumbnail_url', models.URLField(blank=True, max_length=500)),
                ('submitted_by_name', models.CharField(blank=True, max_length=150)),
                ('submitted_by_username', models.CharField(blank=True, max_length=150)),
                ('fetched_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('raw_payload', models.JSONField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ProductLink',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField(max_length=500)),
                ('type', models.CharField(max_length=50)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='product_links', to='products.product')),
            ],
        ),
        migrations.CreateModel(
            name='ProductMedia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField(max_length=500)),
                ('type', models.CharField(choices=[('image', 'Image'), ('video', 'Video')], max_length=20)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='media', to='products.product')),
            ],
        ),
        migrations.CreateModel(
            name='ProductMaker',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('maker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.maker')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.product')),
            ],
            options={
                'unique_together': {('product', 'maker')},
            },
        ),
        migrations.AddField(
            model_name='product',
            name='makers',
            field=models.ManyToManyField(related_name='products', through='products.ProductMaker', to='products.maker'),
        ),
    ]
