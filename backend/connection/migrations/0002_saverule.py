# Generated by Django 5.1.5 on 2025-02-12 12:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('connection', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SaveRule',
            fields=[
                ('rule_no', models.AutoField(primary_key=True, serialize=False)),
                ('source_table', models.CharField(blank=True, max_length=255, null=True)),
                ('source_field_name', models.CharField(blank=True, max_length=255, null=True)),
                ('data_mapping_rules', models.CharField(blank=True, max_length=500, null=True)),
                ('target_sap_table', models.CharField(blank=True, max_length=255, null=True)),
                ('target_sap_field', models.CharField(blank=True, max_length=255, null=True)),
                ('text_description', models.TextField(blank=True, null=True)),
                ('lookup_table', models.CharField(blank=True, max_length=255, null=True)),
                ('last_updated_by', models.CharField(blank=True, max_length=255, null=True)),
                ('last_updated_on', models.DateTimeField(auto_now=True)),
                ('rule_status', models.BooleanField(default=True)),
                ('check_box', models.BooleanField(default=False)),
                ('is_latest', models.BooleanField(default=False)),
                ('field_id', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='connection.fields')),
                ('object_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='connection.objects')),
                ('project_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='connection.project')),
                ('segment_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='connection.segments')),
            ],
        ),
    ]
