from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='BlogPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=200, unique=True)),
                ('title', models.CharField(max_length=200)),
                ('excerpt', models.TextField(blank=True)),
                ('content', models.JSONField(blank=True, default=list)),
                ('read_time', models.CharField(blank=True, max_length=50)),
                ('published_at', models.DateTimeField(db_index=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-published_at'],
            },
        ),
    ]
