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
    path('api/Crename/<str:re_val>/<int:p_id>/<str:c_name>/',views.connectionRename,name="Crename")
    
]
