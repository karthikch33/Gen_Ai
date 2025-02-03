# from django.db import models

# Create your models here.
# class sapconnection(models.Model):
#     PROJECT = models.CharField(max_length=50, blank=False, null=False , primary_key=True)
#     ASHOST = models.CharField(max_length=20, blank=True, null=True)
#     SYSNR = models.CharField(max_length=10, blank=True, null=True)  # String
#     CLIENT = models.CharField(max_length=10, blank=True, null=True)  # String
#     USER = models.CharField(max_length=50, blank=True, null=True)  # String
#     PASSWORD = models.CharField(max_length=50, blank=True, null=True)  # String
#     def __str__(self):
#         return str(self.PROJECT)

from django.db import models
from django.core.validators import RegexValidator

class Project(models.Model):
    project_id = models.AutoField(primary_key=True)
    project_name = models.CharField(
        max_length=255,
        unique=True
    )
    description = models.CharField(max_length=255,blank=True, null=True)
    created_by = models.CharField(max_length=255,blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project_id}{self.project_name}"  
    

class Connection(models.Model):
    project_id = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE, 
        related_name='connections'  # Helpful for reverse lookups
    )
    connection_name = models.CharField(max_length=255, blank=True, null=True)
    connection_type = models.CharField(max_length=255, blank=True, null=True)
    username = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)  
    host = models.CharField(max_length=255, blank=True, null=True)
    client =  models.CharField(max_length=255, blank=True, null=True)
    sysnr = models.CharField(max_length=255, blank=True, null=True)  
    port = models.CharField(max_length=255, blank=True, null=True)
    database = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        unique_together = ('project_id', 'connection_name')

    def __str__(self):
        return self.connection_name    
