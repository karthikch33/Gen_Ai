from django.shortcuts import HttpResponse
from rest_framework.decorators import api_view
from .utils import sapnwrfc
from ctypes import *
from rest_framework.response import Response
from rest_framework import status
from hdbcli import dbapi
import sqlite3
from django.db import connections, transaction
from .serlializers import ProjectSerializer,ConnectionSerializer
from .models import Project,Connection
import json
from django.core.serializers import serialize

def home(request):
    return HttpResponse("home Page")


@api_view(['POST'])
def SAPconn(request):
    class RFC_ERROR_INFO(Structure):
        _fields_ = [("code", c_long),
                    ("group", c_long),
                    ("key", c_wchar * 128),
                    ("message", c_wchar * 512),
                    ("abapMsgClass", c_wchar * 21),
                    ("abapMsgType", c_wchar * 2),
                    ("abapMsgNumber", c_wchar * 4),
                    ("abapMsgV1", c_wchar * 51),
                    ("abapMsgV2", c_wchar * 51),
                    ("abapMsgV3", c_wchar * 51),
                    ("abapMsgV4", c_wchar * 51)]
    class RFC_CONNECTION_PARAMETER(Structure):
        _fields_ = [("name", c_wchar_p),
                    ("value", c_wchar_p)]
    RFC_OK = 0
    RFC_COMMUNICATION_FAILURE = 1
    RFC_LOGON_FAILURE = 2
    RFC_ABAP_RUNTIME_FAILURE = 3
    RFC_ABAP_MESSAGE = 4
    RFC_ABAP_EXCEPTION = 5
    RFC_CLOSED = 6
    RFC_CANCELED = 7
    RFC_TIMEOUT = 8
    RFC_MEMORY_INSUFFICIENT = 9
    RFC_VERSION_MISMATCH = 10
    RFC_INVALID_PROTOCOL = 11
    RFC_SERIALIZATION_FAILURE = 12
    RFC_INVALID_HANDLE = 13
    RFC_RETRY = 14
    RFC_EXTERNAL_FAILURE = 15
    RFC_EXECUTED = 16
    RFC_NOT_FOUND = 17
    RFC_NOT_SUPPORTED = 18
    RFC_ILLEGAL_STATE = 19
    RFC_INVALID_PARAMETER = 20
    RFC_CODEPAGE_CONVERSION_FAILURE = 21
    RFC_CONVERSION_FAILURE = 22
    RFC_BUFFER_TOO_SMALL = 23
    RFC_TABLE_MOVE_BOF = 24
    RFC_TABLE_MOVE_EOF = 25
    RFC_START_SAPGUI_FAILURE = 26
    RFC_ABAP_CLASS_EXCEPTION = 27
    RFC_UNKNOWN_ERROR = 28
    RFC_AUTHORIZATION_FAILURE = 29

    #-RFCTYPE - RFC data types----------------------------------------------
    RFCTYPE_CHAR = 0
    RFCTYPE_DATE = 1
    RFCTYPE_BCD = 2
    RFCTYPE_TIME = 3
    RFCTYPE_BYTE = 4
    RFCTYPE_TABLE = 5
    RFCTYPE_NUM = 6
    RFCTYPE_FLOAT = 7
    RFCTYPE_INT = 8
    RFCTYPE_INT2 = 9
    RFCTYPE_INT1 = 10
    RFCTYPE_NULL = 14
    RFCTYPE_ABAPOBJECT = 16
    RFCTYPE_STRUCTURE = 17
    RFCTYPE_DECF16 = 23
    RFCTYPE_DECF34 = 24
    RFCTYPE_XMLDATA = 28
    RFCTYPE_STRING = 29
    RFCTYPE_XSTRING = 30
    RFCTYPE_BOX = 31
    RFCTYPE_GENERIC_BOX = 32

    #-RFC_UNIT_STATE - Processing status of a background unit---------------
    RFC_UNIT_NOT_FOUND = 0 
    RFC_UNIT_IN_PROCESS = 1 
    RFC_UNIT_COMMITTED = 2 
    RFC_UNIT_ROLLED_BACK = 3 
    RFC_UNIT_CONFIRMED = 4 

    #-RFC_CALL_TYPE - Type of an incoming function call---------------------
    RFC_SYNCHRONOUS = 0 
    RFC_TRANSACTIONAL = 1 
    RFC_QUEUED = 2 
    RFC_BACKGROUND_UNIT = 3 

    #-RFC_DIRECTION - Direction of a function module parameter--------------
    RFC_IMPORT = 1 
    RFC_EXPORT = 2 
    RFC_CHANGING = RFC_IMPORT + RFC_EXPORT 
    RFC_TABLES = 4 + RFC_CHANGING 

    #-RFC_CLASS_ATTRIBUTE_TYPE - Type of an ABAP object attribute-----------
    RFC_CLASS_ATTRIBUTE_INSTANCE = 0 
    RFC_CLASS_ATTRIBUTE_CLASS = 1 
    RFC_CLASS_ATTRIBUTE_CONSTANT = 2 

    #-RFC_METADATA_OBJ_TYPE - Ingroup repository----------------------------
    RFC_METADATA_FUNCTION = 0 
    RFC_METADATA_TYPE = 1 
    RFC_METADATA_CLASS = 2 


    #-Variables-------------------------------------------------------------
    ErrInf = RFC_ERROR_INFO; RfcErrInf = ErrInf()
    ConnParams = RFC_CONNECTION_PARAMETER * 5; RfcConnParams = ConnParams()
    SConParams = RFC_CONNECTION_PARAMETER * 3; RfcSConParams = SConParams()


    SAPNWRFC = "sapnwrfc.dll"
    SAP = windll.LoadLibrary(SAPNWRFC)

    #-Prototypes------------------------------------------------------------
    SAP.RfcAppendNewRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcAppendNewRow.restype = c_void_p

    SAP.RfcCloseConnection.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcCloseConnection.restype = c_ulong

    SAP.RfcCreateFunction.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcCreateFunction.restype = c_void_p

    SAP.RfcCreateFunctionDesc.argtypes = [c_wchar_p, POINTER(ErrInf)]
    SAP.RfcCreateFunctionDesc.restype = c_void_p

    SAP.RfcDestroyFunction.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcDestroyFunction.restype = c_ulong

    SAP.RfcDestroyFunctionDesc.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcDestroyFunctionDesc.restype = c_ulong

    SAP.RfcGetChars.argtypes = [c_void_p, c_wchar_p, c_void_p, c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcGetChars.restype = c_ulong

    SAP.RfcGetCurrentRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcGetCurrentRow.restype = c_void_p

    SAP.RfcGetFunctionDesc.argtypes = [c_void_p, c_wchar_p, POINTER(ErrInf)]
    SAP.RfcGetFunctionDesc.restype = c_void_p

    SAP.RfcGetRowCount.argtypes = [c_void_p, POINTER(c_ulong), \
    POINTER(ErrInf)]
    SAP.RfcGetRowCount.restype = c_ulong

    SAP.RfcGetStructure.argtypes = [c_void_p, c_wchar_p, \
    POINTER(c_void_p), POINTER(ErrInf)]
    SAP.RfcGetStructure.restype = c_ulong

    SAP.RfcGetTable.argtypes = [c_void_p, c_wchar_p, POINTER(c_void_p), \
    POINTER(ErrInf)]
    SAP.RfcGetTable.restype = c_ulong

    SAP.RfcGetVersion.argtypes = [POINTER(c_ulong), POINTER(c_ulong), \
    POINTER(c_ulong)]
    SAP.RfcGetVersion.restype = c_wchar_p

    SAP.RfcInstallServerFunction.argtypes = [c_wchar_p, c_void_p, \
    c_void_p, POINTER(ErrInf)]
    SAP.RfcInstallServerFunction.restype = c_ulong

    SAP.RfcInvoke.argtypes = [c_void_p, c_void_p, POINTER(ErrInf)]
    SAP.RfcInvoke.restype = c_ulong

    SAP.RfcListenAndDispatch.argtypes = [c_void_p, c_ulong, POINTER(ErrInf)]
    SAP.RfcListenAndDispatch.restype = c_ulong

    SAP.RfcMoveToFirstRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcMoveToFirstRow.restype = c_ulong

    SAP.RfcMoveToNextRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcMoveToNextRow.restype = c_ulong

    SAP.RfcOpenConnection.argtypes = [POINTER(ConnParams), c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcOpenConnection.restype = c_void_p

    SAP.RfcPing.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcPing.restype = c_ulong

    SAP.RfcRegisterServer.argtypes = [POINTER(SConParams), c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcRegisterServer.restype = c_void_p

    SAP.RfcSetChars.argtypes = [c_void_p, c_wchar_p, c_wchar_p, c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcSetChars.restype = c_ulong

    RfcConnParams[0].name = "ASHOST"; RfcConnParams[0].value = request.data['host']
    RfcConnParams[1].name = "SYSNR" ; RfcConnParams[1].value = request.data['sysnr']            
    RfcConnParams[2].name = "CLIENT"; RfcConnParams[2].value = request.data['client']      
    RfcConnParams[3].name = "USER"  ; RfcConnParams[3].value = request.data['username']     
    RfcConnParams[4].name = "PASSWD"; RfcConnParams[4].value = request.data['password']  


    hRFC = SAP.RfcOpenConnection(RfcConnParams, 5, RfcErrInf)
    # hRFC = ""
    if hRFC != None:
        return Response(status=status.HTTP_200_OK)
    else:
        print(RfcErrInf.message)
    return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def SAPtables(request):
 
   
    class RFC_ERROR_INFO(Structure):
        _fields_ = [("code", c_ulong),
                    ("group", c_ulong),
                    ("key", c_wchar * 128),
                    ("message", c_wchar * 512),
                    ("abapMsgClass", c_wchar * 21),
                    ("abapMsgType", c_wchar * 2),
                    ("abapMsgNumber", c_wchar * 4),
                    ("abapMsgV1", c_wchar * 51),
                    ("abapMsgV2", c_wchar * 51),
                    ("abapMsgV3", c_wchar * 51),
                    ("abapMsgV4", c_wchar * 51)]
 
    class RFC_CONNECTION_PARAMETER(Structure):
        _fields_ = [("name", c_wchar_p),
                    ("value", c_wchar_p)]
 
 
    #-Constants-------------------------------------------------------------
 
    #-RFC_RC - RFC return codes---------------------------------------------
    RFC_OK = 0
    RFC_COMMUNICATION_FAILURE = 1
    RFC_LOGON_FAILURE = 2
    RFC_ABAP_RUNTIME_FAILURE = 3
    RFC_ABAP_MESSAGE = 4
    RFC_ABAP_EXCEPTION = 5
    RFC_CLOSED = 6
    RFC_CANCELED = 7
    RFC_TIMEOUT = 8
    RFC_MEMORY_INSUFFICIENT = 9
    RFC_VERSION_MISMATCH = 10
    RFC_INVALID_PROTOCOL = 11
    RFC_SERIALIZATION_FAILURE = 12
    RFC_INVALID_HANDLE = 13
    RFC_RETRY = 14
    RFC_EXTERNAL_FAILURE = 15
    RFC_EXECUTED = 16
    RFC_NOT_FOUND = 17
    RFC_NOT_SUPPORTED = 18
    RFC_ILLEGAL_STATE = 19
    RFC_INVALID_PARAMETER = 20
    RFC_CODEPAGE_CONVERSION_FAILURE = 21
    RFC_CONVERSION_FAILURE = 22
    RFC_BUFFER_TOO_SMALL = 23
    RFC_TABLE_MOVE_BOF = 24
    RFC_TABLE_MOVE_EOF = 25
    RFC_START_SAPGUI_FAILURE = 26
    RFC_ABAP_CLASS_EXCEPTION = 27
    RFC_UNKNOWN_ERROR = 28
    RFC_AUTHORIZATION_FAILURE = 29
 
    #-RFCTYPE - RFC data types----------------------------------------------
    RFCTYPE_CHAR = 0
    RFCTYPE_DATE = 1
    RFCTYPE_BCD = 2
    RFCTYPE_TIME = 3
    RFCTYPE_BYTE = 4
    RFCTYPE_TABLE = 5
    RFCTYPE_NUM = 6
    RFCTYPE_FLOAT = 7
    RFCTYPE_INT = 8
    RFCTYPE_INT2 = 9
    RFCTYPE_INT1 = 10
    RFCTYPE_NULL = 14
    RFCTYPE_ABAPOBJECT = 16
    RFCTYPE_STRUCTURE = 17
    RFCTYPE_DECF16 = 23
    RFCTYPE_DECF34 = 24
    RFCTYPE_XMLDATA = 28
    RFCTYPE_STRING = 29
    RFCTYPE_XSTRING = 30
    RFCTYPE_BOX = 31
    RFCTYPE_GENERIC_BOX = 32
 
    #-RFC_UNIT_STATE - Processing status of a background unit---------------
    RFC_UNIT_NOT_FOUND = 0
    RFC_UNIT_IN_PROCESS = 1
    RFC_UNIT_COMMITTED = 2
    RFC_UNIT_ROLLED_BACK = 3
    RFC_UNIT_CONFIRMED = 4
 
    #-RFC_CALL_TYPE - Type of an incoming function call---------------------
    RFC_SYNCHRONOUS = 0
    RFC_TRANSACTIONAL = 1
    RFC_QUEUED = 2
    RFC_BACKGROUND_UNIT = 3
 
    #-RFC_DIRECTION - Direction of a function module parameter--------------
    RFC_IMPORT = 1
    RFC_EXPORT = 2
    RFC_CHANGING = RFC_IMPORT + RFC_EXPORT
    RFC_TABLES = 4 + RFC_CHANGING
 
    #-RFC_CLASS_ATTRIBUTE_TYPE - Type of an ABAP object attribute-----------
    RFC_CLASS_ATTRIBUTE_INSTANCE = 0
    RFC_CLASS_ATTRIBUTE_CLASS = 1
    RFC_CLASS_ATTRIBUTE_CONSTANT = 2
 
    #-RFC_METADATA_OBJ_TYPE - Ingroup repository----------------------------
    RFC_METADATA_FUNCTION = 0
    RFC_METADATA_TYPE = 1
    RFC_METADATA_CLASS = 2
 
 
    #-Variables-------------------------------------------------------------
    ErrInf = RFC_ERROR_INFO; RfcErrInf = ErrInf()
    ConnParams = RFC_CONNECTION_PARAMETER * 5; RfcConnParams = ConnParams()
    SConParams = RFC_CONNECTION_PARAMETER * 3; RfcSConParams = SConParams()
 
 
    #-Library---------------------------------------------------------------
    # if str(platform.architecture()[0]) == "32bit":
    #   os.environ['PATH'] += ";C:\\SAPRFCSDK\\32bit"
    #   SAPNWRFC = "C:\\SAPRFCSDK\\32bit\\sapnwrfc.dll"
    # elif str(platform.architecture()[0]) == "64bit":
    #   os.environ['PATH'] += ";C:\\SAPRFCSDK\\64bit"
    #   SAPNWRFC = "C:\\SAPRFCSDK\\64bit\\sapnwrfc.dll"
 
    SAPNWRFC = "sapnwrfc.dll"
 
    SAP = windll.LoadLibrary(SAPNWRFC)
 
    #-Prototypes------------------------------------------------------------
    SAP.RfcAppendNewRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcAppendNewRow.restype = c_void_p
 
    SAP.RfcCloseConnection.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcCloseConnection.restype = c_ulong
 
    SAP.RfcCreateFunction.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcCreateFunction.restype = c_void_p
 
    SAP.RfcSetInt.argtypes = [c_void_p, c_wchar_p, c_ulong, POINTER(ErrInf)]
    SAP.RfcSetInt.restype = c_ulong
 
    SAP.RfcCreateFunctionDesc.argtypes = [c_wchar_p, POINTER(ErrInf)]
    SAP.RfcCreateFunctionDesc.restype = c_void_p
 
    SAP.RfcDestroyFunction.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcDestroyFunction.restype = c_ulong
 
    SAP.RfcDestroyFunctionDesc.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcDestroyFunctionDesc.restype = c_ulong
 
    SAP.RfcGetChars.argtypes = [c_void_p, c_wchar_p, c_void_p, c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcGetChars.restype = c_ulong
 
    SAP.RfcGetCurrentRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcGetCurrentRow.restype = c_void_p
 
    SAP.RfcGetFunctionDesc.argtypes = [c_void_p, c_wchar_p, POINTER(ErrInf)]
    SAP.RfcGetFunctionDesc.restype = c_void_p
 
    SAP.RfcCreateTable.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcCreateTable.restype = c_void_p
 
 
    SAP.RfcGetRowCount.argtypes = [c_void_p, POINTER(c_ulong), \
    POINTER(ErrInf)]
    SAP.RfcGetRowCount.restype = c_ulong
 
    SAP.RfcGetStructure.argtypes = [c_void_p, c_wchar_p, \
    POINTER(c_void_p), POINTER(ErrInf)]
    SAP.RfcGetStructure.restype = c_ulong
 
    SAP.RfcGetTable.argtypes = [c_void_p, c_wchar_p, POINTER(c_void_p), \
    POINTER(ErrInf)]
    SAP.RfcGetTable.restype = c_ulong
 
    SAP.RfcGetVersion.argtypes = [POINTER(c_ulong), POINTER(c_ulong), \
    POINTER(c_ulong)]
    SAP.RfcGetVersion.restype = c_wchar_p
 
    SAP.RfcInstallServerFunction.argtypes = [c_wchar_p, c_void_p, \
    c_void_p, POINTER(ErrInf)]
    SAP.RfcInstallServerFunction.restype = c_ulong
 
    SAP.RfcInvoke.argtypes = [c_void_p, c_void_p, POINTER(ErrInf)]
    SAP.RfcInvoke.restype = c_ulong
 
    SAP.RfcListenAndDispatch.argtypes = [c_void_p, c_ulong, POINTER(ErrInf)]
    SAP.RfcListenAndDispatch.restype = c_ulong
 
    SAP.RfcMoveToFirstRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcMoveToFirstRow.restype = c_ulong
 
    SAP.RfcMoveToNextRow.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcMoveToNextRow.restype = c_ulong
 
    SAP.RfcOpenConnection.argtypes = [POINTER(ConnParams), c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcOpenConnection.restype = c_void_p
 
    SAP.RfcPing.argtypes = [c_void_p, POINTER(ErrInf)]
    SAP.RfcPing.restype = c_ulong
 
    SAP.RfcRegisterServer.argtypes = [POINTER(SConParams), c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcRegisterServer.restype = c_void_p
 
    SAP.RfcSetChars.argtypes = [c_void_p, c_wchar_p, c_wchar_p, c_ulong, \
    POINTER(ErrInf)]
    SAP.RfcSetChars.restype = c_ulong
   
    RfcConnParams[0].name = "ASHOST"; RfcConnParams[0].value = "34.194.191.113"
    RfcConnParams[1].name = "SYSNR" ; RfcConnParams[1].value = "01"
    RfcConnParams[2].name = "CLIENT"; RfcConnParams[2].value = "100"
    RfcConnParams[3].name = "USER"  ; RfcConnParams[3].value = "RAJKUMARS"
    RfcConnParams[4].name = "PASSWD"; RfcConnParams[4].value = "JaiHanuman10"
   
    tables = []
    val = 50
    hRFC = SAP.RfcOpenConnection(RfcConnParams, 5, RfcErrInf)
    if hRFC != None:
   
        charBuffer = create_unicode_buffer(1048576 + 1)
        charBuffer1 = create_unicode_buffer(1048576 + 1)
   
    hFuncDesc = SAP.RfcGetFunctionDesc(hRFC, "ZTABLE_NAMES_DESC", RfcErrInf)
    if hFuncDesc != 0:
        hFunc = SAP.RfcCreateFunction(hFuncDesc, RfcErrInf)
        if hFunc != 0:
            rc = SAP.RfcSetInt(hFunc, "N",val, RfcErrInf)
            # print(SAP.RfcInvoke(hRFC, hFunc, RfcErrInf))
            if SAP.RfcInvoke(hRFC, hFunc, RfcErrInf) == RFC_OK:
       
                hTable = c_void_p(0)
                print(SAP.RfcGetTable(hFunc, "DATA", hTable, RfcErrInf))
                if SAP.RfcGetTable(hFunc, "DATA", hTable, RfcErrInf) == RFC_OK:
                    RowCount = c_ulong(0)
                rc = SAP.RfcGetRowCount(hTable, RowCount, RfcErrInf)
                print(RowCount)
                rc = SAP.RfcMoveToFirstRow(hTable, RfcErrInf)
                for i in range(0, RowCount.value):
                    hRow = SAP.RfcGetCurrentRow(hTable, RfcErrInf)
                    rc = SAP.RfcGetChars(hRow, "TAB", charBuffer, 512, RfcErrInf)
                    rc = SAP.RfcGetChars(hRow, "DESC", charBuffer1, 512, RfcErrInf)
                    # print(str(charBuffer.value))
                    tables.append(dict(table = str(charBuffer.value).strip(),desc = str(charBuffer1.value)))
                    if i < RowCount.value:
                        rc = SAP.RfcMoveToNextRow(hTable, RfcErrInf)
       
            rc = SAP.RfcDestroyFunction(hFunc, RfcErrInf)
       
        rc = SAP.RfcCloseConnection(hRFC, RfcErrInf)
        # print(tables)
        return Response(tables)
    else:
        print(RfcErrInf.key)    
        print(RfcErrInf.message)
   
    del SAP
 

l=[False,""]

@api_view(['POST'])
def HANAconn(request):
    print("Hana")
    print(request.data)
    try:
        conn = dbapi.connect(
            # address="10.56.7.40",
            address = request.data['host'],
            # port=30015,
            port=int(request.data['port']),
            # user="SURYAC",
            # password="Surya@2727",
            # user="SAMPATHS",
            # password="Sampath@123",
            # user="RUPAM",
            user = request.data['username'],
            password= request.data['password'],
            # password="Mrupa09$",
            encrypt='true',
            sslValidateCertificate='false'
        )
        print(conn.isconnected())
        l[0]=conn
        l[1] = request.data['username']
    #     cursor = conn.cursor()
    #     cursor.execute("SELECT TABLE_NAME FROM SYS.TABLES WHERE SCHEMA_NAME = '"+l[1]+"'")
    #     rows = cursor.fetchall()
    #     rows=list(rows)
    #     tables = [dict(var = str(row[0]).strip()) for row in rows]
 
    #     print(tables)
    #     # return Response(tables)
       
    #     return Response(tables,status=status.HTTP_200_OK)
    except:
        # return Response("failure")  
        return Response(status=status.HTTP_404_NOT_FOUND)
   
    if(conn.isconnected):  
        # return HttpResponse("success")
        return Response(status=status.HTTP_200_OK)
    # return HttpResponse("failure")
    return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def HANAtables(request,p_id,c_name):
    connection = Connection.objects.filter(project_id=p_id,connection_name=c_name)
    json_data = serialize('json', list(connection))
    json_data = json.loads(json_data)[0]['fields']
    print(json_data)
    conn = conn = dbapi.connect(
            # address="10.56.7.40",
            address = json_data['host'],
            # port=30015,
            port=int(json_data['port']),
            # user="SURYAC",
            # password="Surya@2727",
            # user="SAMPATHS",
            # password="Sampath@123",
            # user="RUPAM",
            user = json_data['username'],
            password= json_data['password'],
            # password="Mrupa09$",
            encrypt='true',
            sslValidateCertificate='false'
        )
    cursor = conn.cursor()
    cursor.execute("SELECT TABLE_NAME FROM SYS.TABLES WHERE SCHEMA_NAME = '"+json_data['username']+"'")
    rows = cursor.fetchall()
    rows=list(rows)
    tables = [dict(table = str(row[0]).strip(),desc="") for row in rows]
 
    print(tables)
    return Response(tables)  


@api_view(['POST'])
def ProjectCreate(request):
    print("Hello called Post")
    print(request.data)
    project = ProjectSerializer(data=request.data)

    # validating for already existing data
    # print("varun : ",Project.objects.filter(project_name=request.data['project_name']))

    if Project.objects.filter(project_name=request.data['project_name']):
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

    if project.is_valid():
        project.save()
        # proj = project_details.objects.get(project_name=request.data['project_name'])
        # print("Id : ",proj.proj_id)
        return Response(project.data)
    else:
        return Response(status=status.HTTP_409_CONFLICT)


@api_view(['GET'])
def ProjectGet(request):
    print("Hello called Get Api")
    sorted_objects = Project.objects.order_by('-created_at')
    # projects = project_details.objects.all()
    serializer = ProjectSerializer(sorted_objects, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
def projectUpdate(request,pk):
    print("Hello called update")
    print(request.data)
    project = Project.objects.get(project_id=pk)
    data = ProjectSerializer(instance=project, data=request.data)

    

    if data.is_valid():
        data.save()
        print("edjnkfhjrvfh")
        return Response(data.data)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def project_delete(request,pk):
 
    # pk = request.data['project_name']
    print("Hello called Delete")
    if Project.objects.filter(project_id=pk).exists():
        project = Project.objects.get(project_id=pk)
        if project:
            serializer = ProjectSerializer(project)
            project.delete()
            return Response(serializer.data,status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)



@api_view(['POST'])
def ConnectionCreate(request):
    # request.data['connection_type']=""
    connection = ConnectionSerializer(data=request.data)
    print("Hello post connection called")
    if Connection.objects.filter(project_id=request.data["project_id"],connection_name = request.data["connection_name"]).exists():
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
    if connection.is_valid():
        
        connection.save()
        return Response(connection.data,status=status.HTTP_201_CREATED)
    else:
        return Response(status=status.HTTP_409_CONFLICT)
    
@api_view(['GET'])
def ConnectionGet(request):
    print("hii")
    connections = Connection.objects.all()
    serializer = ConnectionSerializer(connections,many=True)
    return Response(serializer.data) 

@api_view(['PUT'])
def ConnectionUpdate(request,p_id,c_name):
    print(request.data)
    print(p_id,c_name)
    connection = Connection.objects.get(project_id=p_id,connection_name=c_name)
    data = ConnectionSerializer(instance=connection, data=request.data)
    if data.is_valid():
        print("jfnjkjefkjfkjnrkj")
        data.save()
        return Response(data.data,status=status.HTTP_202_ACCEPTED)
    else:
        print("ffffffffffffffffffffffffffffffffffffff")
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['DELETE'])
def connectionDelete(request,p_id,c_name):
    if Connection.objects.filter(project_id=p_id,connection_name=c_name).exists():
        connection = Connection.objects.get(project_id=p_id,connection_name=c_name)
        if connection:
            connection.delete()
            print("ssssssuccesssss")
            return Response(c_name,status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)   

@api_view(['GET'])
def ConnectionGetSingle(request,p_id,c_name):
    if Connection.objects.filter(project_id=p_id,connection_name=c_name).exists():
        connection = Connection.objects.get(project_id=p_id,connection_name=c_name)
        if connection:
            serializer = ConnectionSerializer(connection)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)   
    
@api_view(['GET'])
def ProjectGetSingle(request,p_id):
    if Project.objects.filter(project_id=p_id).exists():
        project = Project.objects.get(project_id=p_id)
        if project:
            serializer = ProjectSerializer(project)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)   


@api_view(['PUT'])
def connectionRename(request,re_val,p_id,c_name):
    # print(request.data)
    connection = Connection.objects.get(project_id=p_id,connection_name=c_name)
    data = ConnectionSerializer(instance=connection, data=request.data)
    request.data['connection_name'] = re_val
    data = ConnectionSerializer(instance=connection, data=request.data)
    if data.is_valid():
        try:
            data.save()
            return  Response(c_name,status=status.HTTP_202_ACCEPTED)
        except:
            return Response(re_val,status=status.HTTP_404_NOT_FOUND)
    else:
        return Response(re_val,status=status.HTTP_404_NOT_FOUND)
    
    
        
