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



class objects(models.Model):
    obj_id = models.AutoField(primary_key=True)
    obj_name = models.CharField(
        max_length=255,
        blank = True,
        null=True
    )
    project_id = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='objects_project'  # Helpful for reverse lookups
    )
    template_name = models.CharField(max_length=255, blank=True, null=True)
 
    class Meta:
        unique_together = ('project_id', 'obj_name')
 
    def __str__ (self):
        return f"{self.obj_id}{self.obj_name}"
   
 
 
 
 
class segments(models.Model):
    segment_id = models.AutoField(primary_key=True)
    project_id = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='segement_projid'  # Helpful for reverse lookups
    )
    obj_id = models.ForeignKey(
        objects,
        on_delete=models.CASCADE,
        related_name='segement_objid'  # Helpful for reverse lookups
    )
    segement_name = models.CharField(max_length=255, blank=True, null=True)  
    table_name = models.CharField(max_length=255, blank=True, null=True)
 
    def __str__ (self):
        return f"{self.segment_id}{self.segement_name}"
 
 
class fields(models.Model):
    field_id = models.AutoField(primary_key=True)
    project_id = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='fields_projid'  # Helpful for reverse lookups
    )
    obj_id = models.ForeignKey(
        objects,
        on_delete=models.CASCADE,
        related_name='fields_objid'  # Helpful for reverse lookups
    )
    segement_id = models.ForeignKey(
        segments,
        on_delete=models.CASCADE,
        related_name='fields_segementid'  # Helpful for reverse lookups
    )
    fields = models.CharField(max_length=255, blank=True, null=True)  
    description = models.CharField(max_length=255, blank=True, null=True)
    isMandatory = models.CharField(max_length=255, blank=True, null=True)
 
    def __str__ (self):
        return f"{self.field_id}{self.fields}"
   
 
 
 
class Rule(models.Model):
    Rule_id = models.AutoField(primary_key=True)
    version = models.IntegerField(null=False,blank=False,default=1)
    Source_Table = models.CharField(max_length=255,blank=True, null=True)
    Source_Field_Name = models.CharField(max_length=255,blank=True, null=True)
    Data_Mapping_Rules = models.CharField(max_length=255,blank=True, null=True)
    Target_SAP_Table = models.CharField(max_length=255,blank=True, null=True)
    Target_SAP_Field = models.CharField(max_length=255,blank=True, null=True)
    Text_Description = models.CharField(max_length=255,blank=True, null=True)
    Lookup_Table = models.CharField(max_length=255,blank=True, null=True)
    Look_Up_Required = models.BooleanField(default=False)
    Last_Updated_By = models.CharField(max_length=255,blank=True, null=True)
    Last_Updated_On = models.DateTimeField(auto_now_add=True)
    Rule_Status = models.CharField(max_length=255,blank=True, null=True)
    Check_Box = models.CharField(max_length=255,blank=True, null=True)
 
    def __str__ (self):
        return f"{self.Rule_id}"