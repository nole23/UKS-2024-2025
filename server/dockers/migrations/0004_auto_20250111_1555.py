# Generated by Django 3.2.25 on 2025-01-11 14:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dockers', '0003_alter_repository_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dockerimage',
            name='created_by',
        ),
        migrations.RemoveField(
            model_name='dockerimage',
            name='version',
        ),
        migrations.AddField(
            model_name='dockerimage',
            name='repository',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='images', to='dockers.repository'),
        ),
        migrations.AddField(
            model_name='dockerimage',
            name='tag',
            field=models.CharField(default='latest', max_length=100),
        ),
        migrations.AlterField(
            model_name='dockerimage',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
