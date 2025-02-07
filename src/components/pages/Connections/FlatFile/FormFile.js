import React, { useEffect, useState } from 'react';  
import {  Button, Input, Select, Space, message } from 'antd';  
import { useFormik } from "formik";  
import * as yup from 'yup';  
import { useLocation, useNavigate } from 'react-router-dom';  
import 'bootstrap/dist/css/bootstrap.min.css';  
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { checkConnectionSlice, resetState, saveConnectionSlice, singleGetConnectionSlice, updateConnectionSlice } from '../../../features/Connections/connectionSlice';
import { toast, ToastContainer } from 'react-toastify';
import { getProjectsSlice } from '../../../features/Project/projectSlice';
import Search from 'antd/es/transfer/search';

const FormFile = () => {
    const [allProjects, setAllProjects] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();  
    const location = useLocation();  
    const [fileType, setFileType] = useState(null);
    const [file, setFile] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [sheets, setSheets] = useState([]);
    const [selectedOption, setSelectedOption] = useState(''); // Default selection

    const fileTypes = ['Excel', 'Text', 'CSV'];
    // const getFileName = location.pathname.split('/')[3] || null;  
    const getProjectId = location.pathname.split('/')[4];  

    const formik = useFormik({  
            initialValues: {  
                project_id: "", 
                fileName: "",
                tableName: "",
                file_type: "",
            }});


    const dispatch = useDispatch();
    // const {singleConnection} = useSelector(state=>state.connection);
    const projects = useSelector(state => state.project.projects);  

    const fetchProjects = async () => {  
        dispatch(getProjectsSlice())
    };  

    useEffect(()=>{
        setAllProjects(projects);
    },[projects])
        
    useEffect(() => {  
        fetchProjects();  
        // fetchConnection(); 
    }, [getProjectId]);  

    const handleSheetChange = (event) => {
        setSelectedOption(event.target.value);
        console.log('Selected:', event.target.value); // Log selected value
    };

    function handleFileChangeText(event) {
        if (event.target.files) {
            setFile(event.target.files[0]);
            setUploadedFileName(event.target.files[0].name);
            formik.handleChange('filePath')
            event.preventDefault()
        }
    }

    function handleFileChange(event) {
        if (event.target.files[0] !== undefined) {
            const fil = event.target.files[0]; 
            console.log(fil);
            setUploadedFileName(fil.name);
            setFile(event.target.files[0]);
            // setSelectedOption('Select a Sheet');            
            handleFileUpload(event.target.files[0]);
            formik.handleChange('filePath')
        }
    }

    const handleFormUploadExcel = async() => {
        if (!file) return;
        const formData = new FormData();
        formData.append('projectID', formik.values.project_id);
        formData.append('fileName', formik.values.fileName); // Append first string
        formData.append('tableName', formik.values.tableName);
        formData.append('sheet', selectedOption);
        formData.append('file', file);
        console.log(formData)
        try {
            const response = axios.post("http://127.0.0.1:8000/xlsx/", formData)
            // if (!response.ok) {
            //     throw new Error('Network response was not ok');
            // }
 
            const data = await response;
 
            console.log('Success:', data);
            alert("Connection Successful");
        } catch (error) {
            console.error('Error:', error);
            alert("Connection Failed");
        }
    }

    async function handleFileUpload(selectedFile) {
        if (!selectedFile) return;
        // console.log(selectedFile);
        const formData = new FormData();
        formData.append('file', selectedFile);
        // console.log(formData);

        try {
            const response = await axios.post("http://127.0.0.1:8000/xls/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            // console.log(response.data[0]);
            setSheets(response.data);
            setSelectedOption(response.data[0]);
        } catch { };
    }

  return (
    <div>
      {contextHolder}
            <ToastContainer
            position='top-center'
            autoClose={1000}
            hideProgressBar={true}
            closeOnClick
            newestOnTop={true}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
            />

            <div className="d-flex" style={{padding:"30px",marginLeft:"20px"}}>  
                <div>  
                    <h3 className="text-center"> File</h3>
                    
                    <form className="form-container">   
                    <div className="form-group">  
                        <label htmlFor="project_id">Project Name</label>  
                        <select  
                            name="project_id"
                            className='w-100 form-select'
                            style={{marginLeft:"5px"}}
                            value={formik.values.project_id}  
                            onChange={formik.handleChange('project_id')}  
                            // disabled={getConnectionName !== null}  
                        >  
                            <option value="">Select Project</option>    
                            {allProjects && allProjects.map((option) => (  
                                <option key={option?.project_id}   value={option?.project_id}>{option?.project_name}</option>  
                            ))}  
                        </select>  
                        <div className="error">{formik.touched.project_id && formik.errors.project_id}</div>  
                    
                    </div>  

                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">File Name</label>
                        <Input
                            type="text"
                            value={formik.values.fileName}
                            name="fileName"
                            onChange={formik.handleChange('fileName')}
                        />
                        <div className="error">
                            {
                                formik.touched.fileName && formik.errors.fileName
                            }
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Table Name</label>
                        <Input
                            type="text"
                            value={formik.values.tableName}
                            name="table_name"
                            onChange={formik.handleChange('tableName')}
                        />
                        <div className="error">
                            {
                                formik.touched.tableName && formik.errors.tableName
                            }
                        </div>
                    </div>

                    <div className="form-group">  
                        <label htmlFor="file_type">File Type</label>  
                        <select  
                            name="file_type"
                            className='w-100 form-select'
                            style={{marginLeft:"4px"}}
                            value={formik.values.curType}  
                            onChange={(e)=> {
                                formik.handleChange('file_type')
                                setFileType(e.target.value);
                            }}
                        >  
                            <option value="">Select File Type</option>    
                            {fileTypes && fileTypes.map((curType) => (                               
                                <option key={curType}   value={curType}>{curType}</option>  
                            ))}  
                        </select>  
                        <div className="error">{formik.touched.file_type && formik.errors.file_type}</div>  
                    </div>  

                    <div className="form-group">
                            <label htmlFor="exampleInputEmail1" style={{marginLeft:"-4px"}}>File Path</label>

                            <Input  value={uploadedFileName}/>
                            <Input type="file" 
                                className="form-control"
                                value={file} 
                                name="filePath"
                                hidden id="browse"
                                onChange={handleFileChange} />
                            <label htmlFor="browse">
                                Browse
                            </label>
                            <div className="error">
                                {
                                    formik.touched.filePath && formik.errors.filePath
                                }
                            </div>
                        </div>



                    {fileType === 'Excel' && <div>
                        
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Sheet</label>
                            {/* <input
                                type="text"
                                className="form-control"
                                value={formik.values.sheet}
                                name="sheet"
                                onChange={formik.handleChange('sheet')}
                            /> */}
                            <select value={selectedOption} className="form-select" onChange={handleSheetChange}>
                                {sheets.map((sheet, index) => (
                                    <option key={index} value={sheet}>
                                        {sheet}
                                    </option>
                                ))}
                            </select>
                            <div className="error">
                                {
                                    formik.touched.sheet && formik.errors.sheet
                                }
                            </div>
                        </div>
                        </div>}
                    
                    {fileType === 'Text' && <div>
                        <div className="form-group">
                        <label htmlFor="exampleInputEmail1" style = {{ marginLeft: "-5px"}}>File Path</label>

                        <input className="form-control" value={uploadedFileName}></input>
                        <input type="file" 
                            className="form-control"
                            // value={file} 
                            name="filePath"
                            hidden id="browse" 
                            onChange={handleFileChangeText} />
                        <label htmlFor="browse" className="form-control">
                            Browse
                        </label>
                        <div className="error">
                            {
                                formik.touched.filePath && formik.errors.filePath
                            }
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Delimiter</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formik.values.delimiter}
                            name="fileName"
                            onChange={formik.handleChange('delimiter')} />
                        <div className="error">
                            {
                                formik.touched.fileName && formik.errors.fileName
                            }
                        </div>
                    </div>
                        </div>}
                    
                    {fileType === 'CSV' && <div>
                        <div className="form-group">
                        <label htmlFor="exampleInputEmail1" style = {{ marginLeft: "-5px"}}>File Path</label>
                        {/* <input
                            type="text"
                            className="form-control"
                            value={formik.values.filePath}
                            name="filePath"
                            onChange={formik.handleChange('filePath')}
                        /> */}
                        <input className="form-control" value={uploadedFileName}></input>
                        <input type="file" 
                            className="form-control"
                            // value={file} 
                            name="filePath"
                            hidden id="browse" 
                            onChange={handleFileChangeText} />
                        <label htmlFor="browse" className="form-control">
                            Browse
                        </label>
                        <div className="error">
                            {
                                formik.touched.filePath && formik.errors.filePath
                            }
                        </div>
                    </div>
                        </div>}
                </form>



















                {fileType === 'Excel' && <div style={{width:"100%",display:"flex", justifyContent:"flex-end",marginTop:"10px",marginRight:"15px"}}>
                    {file && <button onClick={handleFormUploadExcel} type="submit" className="btn btn-primary">Upload</button>}
                </div>}
                {/* {fileType === 'Text' && <div style={{width:"100%",display:"flex", justifyContent:"flex-end",marginTop:"10px",marginRight:"15px"}}>
                    {file && <button onClick={handleFormUploadText} type="submit" className="btn btn-primary">Upload</button>}
                </div>}
                {fileType === 'CSV' && <div style={{width:"100%",display:"flex", justifyContent:"flex-end",marginTop:"10px",marginRight:"15px"}}>
                    {file && <button onClick={handleFormUploadCSV} type="submit" className="btn btn-primary">Upload</button>}
                </div>} */}
            </div>
        </div>
    </div>
  )
}

export default FormFile
