import React, { useEffect, useState } from 'react';  
import { message,Spin } from 'antd';  
import { useFormik } from "formik";  
import * as yup from 'yup';  
import { useLocation } from 'react-router-dom';  
import 'bootstrap/dist/css/bootstrap.min.css';  
import { useDispatch, useSelector } from 'react-redux';
import { getProjectsSlice } from '../../../features/Project/projectSlice';
import { getFileSlice, uploadCsvSheetSlice, uploadExcelSheetSlice, uploadExcelSlice, uploadTxtSheetSlice } from '../../../features/Connections/fileSlice';
 
const FormFile = ({handleOk}) => {
    const [allProjects, setAllProjects] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();  
    const [fileType, setFileType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [sheets, setSheets] = useState([]);
 
    const fileTypes = ['Excel', 'Text', 'CSV'];
    const getProjectId = location.pathname.split('/')[4];  

    const schema = yup.object().shape({  
        project_id: yup.string().required('Project Selection Required'),  
        fileName: yup.string()  
            .required('File Name Required')  
            .matches(/^(?!_)(?!.*_$)[a-zA-Z0-9_]+$/, 'Invalid File Name'),  
        tableName: yup.string()  
            .required('Table Name Required')  
            .matches(/^(?!_)(?!.*_$)[a-zA-Z0-9_]+$/, 'Invalid Table Name'),   
        file_type: yup.string().required('File Type Selection Required'),  
    });  
 
    const formik = useFormik({  
            initialValues: {  
                project_id: "",
                fileName: "",
                tableName: "",
                file_type: "",
                project_name:'',
                uploaded_fileName:'',
                selected_sheet: ''
            },
            validationSchema : schema,
            onSubmit : ()=>{
                if(fileType === 'Excel'){
                    console.log(formik.values.selected_sheet);
                    if(formik.values.selected_sheet){
                        handleFormUploadExcel()
                    } 
                    else{
                        message.error('Sheet not Selected')
                    }
                }
                else if(fileType === 'Text'){
                    handleFormUploadText()
                }
                else if(fileType === 'CSV'){
                    handleFormUploadCSV()
                }
                else{
                    messageApi.error('Undefined File Type')
                }
            }
        });
 
 
    const dispatch = useDispatch();
    const projects = useSelector(state => state.project.projects);  
       
    useEffect(() => {  
        dispatch(getProjectsSlice())
    }, [getProjectId]);  

    useEffect(()=>{
        setAllProjects(projects);
    },[projects])


    const handleFileChangeTextAndCsv = (event)=>{
        if (event?.target?.files) {
            if((event?.target?.files[0]?.name?.split('.').pop() === 'txt' && fileType === 'Text') || (event?.target?.files[0]?.name?.split('.').pop() === 'csv' && fileType === 'CSV')){
                setFile(event?.target?.files[0]);
                formik.values.uploaded_fileName = event?.target?.files[0]?.name
            }
            else{
                message?.error(`Accepted Type ${fileType} `)
            }
        }
    }

    const handleFileChangeExcel = (event)=>{
        if (event?.target?.files[0] !== undefined) {
            if(event?.target?.files[0]?.name?.split('.').pop() === 'xls' || event?.target?.files[0]?.name?.split('.').pop() === 'xlsx'){
                formik.values.uploaded_fileName = event?.target?.files[0]?.name;
                setFile(event.target.files[0]);
                handleFileUpload(event?.target?.files[0]);
            }
            else{
                message.error('Accepted extensions .xls or .xlsx');
            }
        }
    }

    const handleFormUploadExcel = async() => {
        setLoading(true);
        if (!file) return;
        const formData = new FormData();
        formData.append('projectID', formik.values.project_id);
        formData.append('fileName', formik.values.fileName); // Append first string
        formData.append('tableName', formik.values.tableName);
        formData.append('sheet', formik.values.selected_sheet);
        formData.append('file', file);
        
        dispatch(uploadExcelSheetSlice(formData))
        .then((response)=>{
            if(response?.payload?.status === 200){
                message.success('File Uploded',1)
                handleOk();
                formik.resetForm();
                setLoading(false);
                setFileType(null);
                setFile(null);
                setSheets([]);
                setTimeout(()=>{
                    dispatch(getFileSlice())
                },1000)
            }
            else{
                setLoading(false);
                message.error('Error',1)
            }
        })
       
    }
 
    const  handleFormUploadCSV = async()=>{
        setLoading(true);
        if (!file) return;
        const formData = new FormData();
        formData.append('projectID', formik.values.project_id);
        formData.append('fileName', formik.values.fileName);
        formData.append('delimiter', formik.values.delimiter);
        formData.append('tableName', formik.values.tableName);
        formData.append('sheet', "N/A");
        formData.append('file', file); 

        dispatch(uploadCsvSheetSlice(formData))
        .then((response)=>{
            if(response?.payload?.status === 200){
                messageApi.success('File Upload')
                handleOk();
                setLoading(false);
                setFileType(null);
                setFile(null);
                setSheets([]);
                formik.resetForm();
                setTimeout(()=>{
                    dispatch(getFileSlice())
                },1000)
            }
            else{
                setLoading(false);
                messageApi.error('Error Encountered')
            }
        })

    }

    const handleFormUploadText = async()=>{
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('projectID', formik.values.project_id);
        formData.append('fileName', formik.values.fileName);
        formData.append('delimiter', formik.values.delimiter);
        formData.append('tableName', formik.values.tableName);
        formData.append('sheet', "N/A");
        formData.append('file', file);
 
        dispatch(uploadTxtSheetSlice(formData))
        .then((response)=>{
            if(response?.payload?.status === 200){
                messageApi.success('File Upload')
                handleOk();
                formik.resetForm();
                setLoading(false);
                setFileType(null);
                setFile(null);
                setSheets([]);
                setTimeout(()=>{
                    dispatch(getFileSlice())
                },1000)
            }
            else{
                setLoading(false);
                messageApi.error('Error Encountered')
            }
        })

    }
 
    const handleFileUpload = async(selectedFile)=>{
        setLoading(true);
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('file', selectedFile);
        console.log(selectedFile);

        dispatch(uploadExcelSlice(formData))
        .then((response)=>{
            setLoading(false);  // here error must be handle
            setSheets(response?.payload?.data);
            formik.values.selected_sheet =  response?.payload?.response?.data[0];
        })
    }
 
  return (
    <Spin spinning={loading} tip="Uploading...">
    <div>
      {contextHolder}
        <h3 className="text-center"> File</h3>  
        <form onSubmit={formik.handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>

        <div className="row mb-3">  
         <label htmlFor="project_id" className="col-4 col-form-label">Project Name</label>  
            <div className="col-8">  
            <select  
                name="project_id"  
                className='form-select'  
                value={formik.values.project_id}  
                onChange={formik.handleChange('project_id')}  
            >  
                <option value="">Select Project</option>  
                {allProjects && allProjects.map((option) => (  
                    <option key={option?.project_id} value={option?.project_id}>  
                        {option?.project_name}  
                    </option>  
                ))}  
            </select>  
            <div className="error" style={{overflowX:"auto"}}>{formik.touched.project_id && formik.errors.project_id}</div>  
        </div>  
        </div>  

    <div className="row mb-3">  
        <label htmlFor="fileName" className="col-4 col-form-label">File Name</label>  
        <div className="col-8">  
            <input  
                type="text"  
                className="form-control"  
                value={formik.values.fileName}  
                name="fileName"  
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}  
            />  
            <div className="error" style={{overflowX:"auto"}}>{formik.touched.fileName && formik.errors.fileName}</div>  
        </div>  
    </div>  

    <div className="row mb-3">  
        <label htmlFor="tableName" className="col-4 col-form-label">Table Name</label>  
        <div className="col-8">  
            <input  
                type="text"  
                className="form-control"  
                value={formik.values.tableName}  
                name="tableName"  
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}  
            />  
            <div className="error" style={{overflowX:"auto"}}>{formik.touched.tableName && formik.errors.tableName}</div>  
        </div>  
    </div>  

    <div className="row mb-3">  
        <label htmlFor="file_type" className="col-4 col-form-label">File Type</label>  
        <div className="col-8">  
            <select  
                name="file_type"  
                className='form-select'  
                value={formik.values.file_type}  
                onChange={(e) => {  
                    setFileType(e.target.value);
                    setFile('');
                    setSheets([]);  
                    formik.values.uploaded_fileName = '';
                    formik.setFieldValue('file_type', e.target.value);  
                }}  
                style={{ width: '100%'}} 
            >  
                <option value="">Select File Type</option>  
                {fileTypes && fileTypes.map((curType) => (  
                    <option key={curType} value={curType}>{curType}</option>  
                ))}  
            </select>  
            <div className="error" style={{overflowX:"auto"}}>{formik.touched.file_type && formik.errors.file_type}</div>  
        </div>  
    </div>  

  
    <div className="row mb-3">  
        <label htmlFor="filePath" className="col-4 col-form-label">File Path</label>  
        <div className="col-8 d-flex align-items-center">  
            <input  
                className="form-control me-2"  
                value={formik.values.uploaded_fileName}  
                readOnly  
                style={{ flex: '1 1 auto' }} 
            />  
         { fileType &&  <input  
                type="file"  
                className="form-control"  
                hidden id="browse"  
                onChange={fileType === 'Excel' ? handleFileChangeExcel : handleFileChangeTextAndCsv}  
            />  }
       { fileType &&    <label htmlFor="browse" className="form-control btn btn-outline-secondary" style={{ marginLeft: '5px' }}>  
                Browse  
            </label> 
} 
        </div>  
    </div>  

    
    {fileType === 'Excel' && (  
        <div className="row mb-3">  
        <label htmlFor="selected_sheet" className="col-4 col-form-label">Sheet</label>  
        <div className="col-8">  
            <select  
                name="selected_sheet"  
                className="form-select"  
                value={formik.values.selected_sheet}  
                onChange={formik.handleChange}  
            >  
                <option value="">Select Sheet</option>  
                {sheets && sheets.map((sheet, index) => (  
                    <option key={index} value={sheet}>  
                        {sheet}  
                    </option>  
                ))}  
            </select>  
            <div className="error" style={{overflowX:"auto"}}>{formik.touched.selected_sheet && formik.errors.selected_sheet}</div>  
        </div>  
    </div>
    )}  

   
    {fileType === 'Text' && (  
        <div className="row mb-3">  
            <label htmlFor="delimiter" className="col-4 col-form-label">Delimiter</label>  
            <div className="col-8">  
                <input  
                    type="text"  
                    className="form-control"  
                    value={formik.values.delimiter}  
                    name="delimiter"  
                    onChange={formik.handleChange('delimiter')}  
                    style={{ width: '100%' }} 
                />  
                <div className="error" style={{overflowX:"auto"}}>{formik.touched.delimiter && formik.errors.delimiter}</div>  
            </div>  
        </div>  
    )}  

    
    <div className="d-flex justify-content-end" style={{ marginTop: "10px" }}>  
        {file && <button type="submit" className="btn btn-primary">Upload</button>}  
    </div>  
</form>
            </div>
            </Spin>
  )
}
 
export default FormFile