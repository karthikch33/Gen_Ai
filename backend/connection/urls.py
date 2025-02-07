from django.contrib import admin
from django.urls import path
from . import views
urlpatterns = [
    path('',views.home,name="home"),
    path('api/sapconn/',views.SAPconn,name="SAPconn"),
    path('api/saptables/',views.SAPtables,name="SAPtables"),
    path('api/hanaconn/',views.HANAconn,name="HANAconn"),
    path('api/hanatables/<int:p_id>/<str:c_name>/',views.HANAtables,name="hanatables"),
    path('api/hanadata/',views.HANAtables,name="HANAtables"),

    # project CURD
    path('api/Pcreate/',views.ProjectCreate,name="Pcreate"),
    path('api/Pget/',views.ProjectGet,name="Pget"),
    path('api/PgetSingle/<int:p_id>/',views.ProjectGetSingle,name="PgetSingle"),
    path('api/PUpdate/<int:pk>/',views.projectUpdate,name="PUpdate"),
    path('api/PDelete/<int:pk>/',views.project_delete,name="PDelete"),

    
    
    # connection CURD
    path('api/Ccreate/',views.ConnectionCreate,name="Ccreate"),
    path('api/Cupdate/<int:p_id>/<str:c_name>/', views.ConnectionUpdate, name='Cupdate'),
    path('api/Cget/',views.ConnectionGet,name="Cget"),
    path('api/Cdelete/<int:p_id>/<str:c_name>/',views.connectionDelete,name="Cdelete"),
    path('api/CgetSingle/<int:p_id>/<str:c_name>/',views.ConnectionGetSingle,name="CgetSingle"),
    path('api/Crename/<str:re_val>/<int:p_id>/<str:c_name>/',views.connectionRename,name="Crename"),

    path('xls/',views.xls_read,name="xls_read"),
    path('api/ObjGet/<int:oid>/',views.objects_get,name="objects_get"),
    path('api/ObjCreate/',views.objects_create,name="objects_create"),
    path('api/ObjUpdate/<int:oid>/',views.objects_update,name="objects_update"),
    path('api/ObjDelete/<int:oid>/',views.objects_delete,name="objects_delete"),
 
 
    #Rules Page API's
    path('api/PdataObject/<int:pid>/',views.project_dataObject,name="project_dataObject"),
    path('api/Osegements/<int:pid>/<int:oid>/',views.DataObject_Segements,name="DataObject_Segements"),
    path('api/Sfields/<int:pid>/<int:oid>/<int:sid>/',views.Segements_Fields,name="Segements_Fields"),
 
 
    path('xls/',views.xls_read,name="xls_read"),
    path('tableDelete/',views.tableDelete,name="tableDelete"),
    
]
