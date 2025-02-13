from django.db.models import fields
from rest_framework import serializers
from .models import *


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class ConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connection
        fields = '__all__'


class ObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = objects
        fields = '__all__'
 
 
class SegementSerializer(serializers.ModelSerializer):
    class Meta:
        model = segments
        fields = '__all__'
 
 
class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = fields
        fields = '__all__'

class FileSerializer(serializers.ModelSerializer):
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),  # Important: Specify the queryset
    )
 
    class Meta:
        model = FileConnection
        fields = ['project_id', 'fileName', 'fileType', 'sheet', 'tableName']