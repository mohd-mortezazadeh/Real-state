# Generated by Django 4.1.7 on 2023-04-30 20:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('blog', '0001_initial'),
        ('user_area', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ad',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('title', models.CharField(blank=True, max_length=100)),
                ('description', models.TextField(blank=True)),
                ('home_phone', models.CharField(blank=True, max_length=11, null=True)),
                ('price', models.PositiveBigIntegerField(default=0)),
                ('slug', models.SlugField(allow_unicode=True, max_length=255)),
                ('view', models.PositiveBigIntegerField(default=0)),
                ('lat_path', models.CharField(blank=True, max_length=100, null=True)),
                ('lng_path', models.CharField(blank=True, max_length=100, null=True)),
                ('status', models.IntegerField(choices=[(-1, 'rejected'), (0, 'pending'), (1, 'active')], default=0)),
                ('bookmark', models.ManyToManyField(blank=True, related_name='post_bookmark', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.PositiveBigIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('status', models.IntegerField(choices=[(-1, 'failed'), (0, 'pending'), (1, 'complete')], default=0)),
                ('ad', models.ForeignKey(blank=True, default='', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='orders_ad', to='post_manager.ad')),
            ],
        ),
        migrations.CreateModel(
            name='Package',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('price', models.PositiveBigIntegerField(default=0)),
                ('description', models.TextField(blank=True)),
                ('ad_count', models.IntegerField(default=1)),
                ('nardeban_count', models.IntegerField(default=0)),
                ('fori_count', models.IntegerField(default=0)),
                ('vip_count', models.IntegerField(default=0)),
                ('status', models.BooleanField(default=True)),
            ],
        ),
        migrations.CreateModel(
            name='Visitor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ip_address', models.CharField(max_length=100)),
                ('last_visit', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'visitor',
                'verbose_name_plural': 'visitors',
            },
        ),
        migrations.CreateModel(
            name='VipSms',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('ad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vip_sms_ad', to='post_manager.ad')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vip_sms_user', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'vip sms',
                'verbose_name_plural': 'vip sms',
            },
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('authority', models.CharField(max_length=255)),
                ('card', models.CharField(blank=True, max_length=100, null=True)),
                ('refid', models.IntegerField(blank=True, null=True)),
                ('amount', models.PositiveBigIntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('status', models.IntegerField(choices=[(-2, 'unexpected_error'), (-1, 'failed'), (0, 'pending'), (1, 'completed')], default=0)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payment_order', to='post_manager.order')),
            ],
        ),
        migrations.CreateModel(
            name='PackageOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject_type', models.CharField(choices=[(0, 'vip'), (1, 'nardeban'), (2, 'fori')], max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('ad', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ad_pack', to='post_manager.ad')),
            ],
        ),
        migrations.AddField(
            model_name='order',
            name='package',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, related_name='orders_package', to='post_manager.package'),
        ),
        migrations.AddField(
            model_name='order',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='orders_user', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('tab', models.CharField(blank=True, max_length=100, null=True)),
                ('display_name', models.CharField(max_length=100)),
                ('status', models.BooleanField(default=True)),
                ('canonical', models.ManyToManyField(related_name='canonical', to='blog.canonical')),
                ('city', models.ManyToManyField(related_name='category_city', to='user_area.city')),
                ('content', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='content_blog', to='blog.content')),
                ('meta', models.ManyToManyField(related_name='meta', to='blog.meta')),
                ('schima', models.ManyToManyField(related_name='schima', to='blog.schima')),
            ],
            options={
                'verbose_name': 'Category',
                'verbose_name_plural': 'Categories',
            },
        ),
        migrations.CreateModel(
            name='AdOption',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('display_name', models.CharField(max_length=100)),
                ('category', models.ManyToManyField(related_name='options', to='post_manager.category')),
            ],
        ),
        migrations.CreateModel(
            name='AdMeta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(max_length=100)),
                ('value', models.TextField()),
                ('ad', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ad_meta', to='post_manager.ad')),
            ],
        ),
        migrations.AddField(
            model_name='ad',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ad_category', to='post_manager.category'),
        ),
        migrations.AddField(
            model_name='ad',
            name='media',
            field=models.ManyToManyField(blank=True, related_name='ad_media', to='user_area.mediauser'),
        ),
        migrations.AddField(
            model_name='ad',
            name='options',
            field=models.ManyToManyField(blank=True, related_name='ad_option', to='post_manager.adoption'),
        ),
        migrations.AddField(
            model_name='ad',
            name='rating',
            field=models.ManyToManyField(blank=True, related_name='ad_rating', to='user_area.rating'),
        ),
        migrations.AddField(
            model_name='ad',
            name='section',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ad_section', to='user_area.section'),
        ),
        migrations.AddField(
            model_name='ad',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ad_user', to=settings.AUTH_USER_MODEL),
        ),
    ]