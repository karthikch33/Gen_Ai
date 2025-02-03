import React, { useEffect, useState } from 'react';  
import {  Button, Input, Select, message } from 'antd';  
import { useFormik } from "formik";  
import * as yup from 'yup';  
import { useLocation, useNavigate } from 'react-router-dom';  
import 'bootstrap/dist/css/bootstrap.min.css';  
import { useDispatch, useSelector } from 'react-redux';
import { checkConnectionSlice, resetState, saveConnectionSlice, singleGetConnectionSlice, updateConnectionSlice } from '../../../features/Connections/connectionSlice';
import { toast, ToastContainer } from 'react-toastify';
import { getProjectsSlice } from '../../../features/Project/projectSlice';

const ErpForm = () => {  
    const [allProjects, setAllProjects] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();  
    const location = useLocation();  

    // Extracting connection details from URL  
    const getConnectionName = location.pathname.split('/')[3] || null;  
    const getProjectId = location.pathname.split('/')[4];  

    const dispatch = useDispatch();
    const {singleConnection} = useSelector(state=>state.connection);
    const projects = useSelector(state => state.project.projects);  

    // Validation Schema  
    const schema = yup.object().shape({  
        project_id: yup.string().required('Project Selection Required'),  
        host: yup.string().required('Host Required'),  
        sysnr: yup.string().required('System Number Required'),  
        client: yup.string().required('Client Required'),  
        username: yup.string().required('Username Required'),  
        password: yup.string().required('Password Required'),  
    });  
    
    // Formik setup  
    const formik = useFormik({  
        initialValues: {  
            project_id: "",  
            connection_name: "",  
            connection_type: "",  
            host: "34.194.191.113",  
            sysnr: "01",  
            client: "100",  
            username: "",  
            password: "",  
            status: "Inactive", // Use "Inactive" consistently  
        },  
        validationSchema: schema,  
        onSubmit: async (values) => {
            dispatch(checkConnectionSlice(values))  
            .then((response) => {  
                    if (response?.payload?.status === 404) {  
                        const popUpClose = messageApi.error(  
                            <div className='d-flex flex-column'>  
                                <label>Invalid Credentials. Do you still want to save?</label>  
                                <div className='d-flex justify-content-center w-100 gap-4 mt-3'>  
                                    <Button  style={{ width: "100px", padding: "10px" }} className='p-2'  
                                        onClick={async () => {  
                                            values.status = 'InActive';
                                            getConnectionName === null ? await saveConnection(values) : await updateConnection(values);
                                            dispatch(resetState());  
                                            popUpClose();
                                        }}> Yes </Button>  
                                    <Button  style={{ width: "100px", padding: "10px" }} className='align-center'  
                                        onClick={() => {  
                                            popUpClose();   
                                        }}>  No  </Button>  
                                </div>  
                            </div>, 0);  
                    }  
                else if(response?.payload?.status === 200){
                     values.status = 'Active'; 
                     getConnectionName === null ?  saveConnection(values) : updateConnection(values);;  
                }
            }
            )   
            .catch(()=>{
                toast.error('Connection Failed')
            })
        }  
    }); 
    
        // Save connection  
        const saveConnection = async (values) => {  
            dispatch(saveConnectionSlice({...values,connection_type:"Erp"}))
            .then((response)=>{
                if(response?.payload?.status === 201){
                    toast.success(`${response?.payload?.data?.connection_name} Created Successfully`);
                    dispatch(resetState()); 
                    setTimeout(()=>{
                        navigate('/connections/view-connections')
                    },2000)
    
                }
                else if(response?.payload?.status === 406)
                {
                    toast.error(`Connection Already Exists`);
                }
                else{
                    toast.error('Connection Creation Failed');
                }
            })
        };  
    
        // Update connection  
        const updateConnection = async (values) => {  
           dispatch(updateConnectionSlice({...values,connection_type:"Erp"}))
           .then((response)=>{
            if(response?.payload?.status === 202){
                toast.success(`${response?.payload?.data?.connection_name} Updated Successfully`);
                dispatch(resetState()); 
                setTimeout(()=>{
                    navigate('/connections/view-connections')
                },2000)
    
            }
            else if(response?.payload?.status === 406)
            {
                toast.error(`Connection Already Exists`);
            }
            else{
                toast.error('Connection Creation Failed');
            }
        })
        };  

    // Fetch connection details if editing  
    const fetchConnection = async () => { 
        const singleConnectionData = {
            project_id : getProjectId,
            connection_name : getConnectionName
        } 
        dispatch(singleGetConnectionSlice(singleConnectionData));   
    };  

     // Fetch all projects  
     const fetchProjects = async () => {  
        dispatch(getProjectsSlice())
    };  


    useEffect(()=>{
            if (getConnectionName && singleConnection) {  
                formik.setValues({  
                    project_id: singleConnection.data.project_id,  
                    connection_name: singleConnection.data.connection_name,  
                    connection_type: singleConnection.data.connection_type,  
                    host: singleConnection.data.host,  
                    sysnr: singleConnection.data.sysnr,  
                    client: singleConnection.data.client,  
                    username: singleConnection.data.username,  
                    password: "",
                    status: singleConnection.data.status,
                });
        } 
    },[singleConnection])
   
    useEffect(()=>{
        setAllProjects(projects);
    },[projects])
 
    useEffect(() => {  
        fetchProjects();  
        fetchConnection(); 
    }, [getConnectionName, getProjectId]);  

    return (  
        <>
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
        <div className="d-flex justify-content-center" >  
            <div className="bg-light border rounded shadow p-2" >  
                <h3 className="text-center"> SAP Connection</h3>  
                <form onSubmit={formik.handleSubmit} className="form-container">   
                    <div className="form-group">  
                        <label htmlFor="project_id">Project Name</label>  
                        <select  
                            name="project_id"
                            className='w-100 form-select'
                            style={{marginLeft:"10px"}}
                            value={formik.values.project_id}  
                            onChange={formik.handleChange('project_id')}  
                            disabled={getConnectionName !== null}  
                        >  
                            <option value="">Select Project</option>    
                            {allProjects && allProjects.map((option) => (  
                                <option key={option?.project_id}   value={option?.project_id}>{option?.project_name}</option>  
                            ))}  
                        </select>  
                        <div className="error">{formik.touched.project_id && formik.errors.project_id}</div>  
                    </div>  
                    
                    <div className="form-group">  
                        <label htmlFor="connection_name">Connection Name</label>  
                        <Input  
                            type="text"  
                            name="connection_name"  
                            value={formik.values.connection_name}  
                            onChange={formik.handleChange('connection_name')}  
                            disabled={getConnectionName !== null}   
                        />  
                        <div className="error">{formik.touched.connection_name && formik.errors.connection_name}</div>  
                    </div>  

                    <div className="form-group">  
                        <label htmlFor="host">Host</label>  
                        <Input  
                            type="text"  
                            name="host"  
                            value={formik.values.host}  
                            onChange={formik.handleChange('host')}  
                        />  
                        <div className="error">{formik.touched.host && formik.errors.host}</div>  
                    </div>  

                    <div className="form-group">  
                        <label htmlFor="sysnr">SYSNR</label>  
                        <Input  
                            type="text"  
                            name="sysnr"  
                            value={formik.values.sysnr}  
                            onChange={formik.handleChange('sysnr')}  
                        />  
                        <div className="error">{formik.touched.sysnr && formik.errors.sysnr}</div>  
                    </div>  

                    <div className="form-group">  
                        <label htmlFor="client">Client</label>  
                        <Input  
                            type="text"  
                            name="client"  
                            value={formik.values.client}  
                            onChange={formik.handleChange('client')}  
                        />  
                        <div className="error">{formik.touched.client && formik.errors.client}</div>  
                    </div>  

                    <div className="form-group">  
                        <label htmlFor="username">Username</label>  
                        <Input  
                            type="text"  
                            name="username"  
                            value={formik.values.username}  
                            onChange={formik.handleChange('username')}  
                        />  
                        <div className="error">{formik.touched.username && formik.errors.username}</div>  
                    </div>  

                    <div className="form-group">  
                        <label htmlFor="password">Password</label>  
                        <Input  
                            type="password"  
                            name="password"  
                            value={formik.values.password}  
                            onChange={formik.handleChange('password')}  
                        />  
                        <div className="error">{formik.touched.password && formik.errors.password}</div>  
                    </div>  

                    <div className='d-flex justify-content-around w-75 mt-2'>  
                        <input type='submit' className='btn btn-primary' value={getConnectionName !== null ? 'Update' : 'Save'} />  
                        <input type='button' className="btn btn-danger" onClick={() => navigate("/connections/view-connections")} value={'Cancel'} />  
                    </div>  
                </form>  
            </div>  
        </div>  
        </>
    );  
}  
   
export default ErpForm;