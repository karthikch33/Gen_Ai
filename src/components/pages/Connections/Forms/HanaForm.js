import React, { useEffect, useState } from 'react';   
import { Button, Input, message } from 'antd';  
import { useFormik } from "formik";  
import * as yup from 'yup';  
import { useLocation, useNavigate } from 'react-router-dom';  
import { useDispatch, useSelector } from 'react-redux';  
import { checkHanaConnectionSlice, resetState, saveConnectionSlice, singleGetConnectionSlice, updateConnectionSlice } from '../../../features/Connections/connectionSlice';  
import { getProjectsSlice } from '../../../features/Project/projectSlice';  
import 'bootstrap/dist/css/bootstrap.min.css';  
import { toast } from 'react-toastify';

const HanaForm = () => {  
    const [allProjects, setAllProjects] = useState([]);  
    const [messageApi, contextHolder] = message.useMessage();  
    const navigate = useNavigate();  
    const location = useLocation();  

    const getConnectionName = location.pathname.split('/')[3] || null;  
    const getProjectId = location.pathname.split('/')[4];  

    const dispatch = useDispatch();  
    const {  singleConnection } = useSelector(state => state.connection);  
    const projects = useSelector(state => state.project.projects);  

    const schema = yup.object().shape({  
        project_id: yup.string().required('Project Selection Required'),   
        connection_name: yup.string().required("Connection Name Required"),  
        host: yup.string().required('Host Required'),  
        port: yup.string().required('Port Required'),  
        username: yup.string().required('Username Required'),  
        password: yup.string().required('Password Required'),  
    });  

    const formik = useFormik({  
        initialValues: {  
            project_id: "",  
            connection_name: getProjectId || '', 
            host: '10.56.7.40',  
            port: "30015",  
            username: "",  
            password: ""  
        },  
        validationSchema: schema,  
        onSubmit: async (values) => {  
            
            dispatch(checkHanaConnectionSlice(values))
            .then((response)=>{
                console.log(response);
                if(response?.payload?.status === 404){
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
            })
        }  
    });  

    useEffect(() => {  
        setAllProjects(projects);  
    }, [projects]);  

    useEffect(() => {  
        fetchProjects();  
        fetchConnection();  
    }, [getConnectionName, getProjectId]);  

    useEffect(() => {  
        if (getConnectionName && singleConnection) {  
            formik.setValues({  
                project_id: singleConnection.data.project_id,  
                connection_name: singleConnection.data.connection_name,  
                host: singleConnection.data.host,  
                port: singleConnection.data.port,  
                username: singleConnection.data.username,  
                password: singleConnection.data.password || '',  
            });  
        }   
    }, [singleConnection]);  

    const fetchConnection = async () => {   
        const singleConnectionData = {  
            project_id: getProjectId,  
            connection_name: getConnectionName  
        };   
        dispatch(singleGetConnectionSlice(singleConnectionData));   
    };  

    const fetchProjects = async () => {  
        dispatch(getProjectsSlice());  
    };  

    const saveConnection = async (values) => {  
        dispatch(saveConnectionSlice({...values,connection_type:"Hana"}))
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

    const updateConnection = async (values) => {  
        dispatch(updateConnectionSlice({...values,connection_type:"Hana"}))
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

    return (  
        <>
        {contextHolder}
        
        <div className="d-flex justify-content-center">   
            <div className="bg-light border rounded shadow p-4" style={{ width: '400px' }}>   
                <h3 className="text-center mb-4"> HANA Connection</h3>  
                <form onSubmit={formik.handleSubmit} className="form-container">  
                    <div className="form-group">  
                        <label htmlFor="project_id">Project Name</label>  
                        <select  
                            name="project_id"  
                            className='w-100 form-select'  
                            style={{ marginLeft: "10px" }}  
                            value={formik.values.project_id}  
                            onChange={formik.handleChange}  
                            disabled={getConnectionName !== null}  
                        >  
                            <option value="">Select Project</option>    
                            {allProjects && allProjects.map(option => (  
                                <option key={option?.project_id} value={option?.project_id}>  
                                    {option?.project_name}  
                                </option>  
                            ))}  
                        </select>  
                        <div className="error">  
                            {formik.touched.project_id && formik.errors.project_id}  
                        </div>  
                    </div>    
                    
                    <div className="form-group">  
                        <label htmlFor="connection_name">Connection Name</label>  
                        <Input  
                            type="text"  
                            value={formik.values.connection_name}  
                            name="connection_name"  
                            onChange={formik.handleChange}  
                        />   
                        <div className="error">  
                            {formik.touched.connection_name && formik.errors.connection_name}  
                        </div>  
                    </div>  
                    
                    <div className="form-group">  
                        <label htmlFor="host">Host</label>  
                        <Input  
                            type="text"  
                            value={formik.values.host}  
                            name="host"  
                            onChange={formik.handleChange}  
                        />   
                        <div className="error">  
                            {formik.touched.host && formik.errors.host}  
                        </div>  
                    </div>  
                    
                    <div className="form-group">  
                        <label htmlFor="port">Port</label>  
                        <Input  
                            type="text"  
                            value={formik.values.port}  
                            name="port"  
                            onChange={formik.handleChange}   
                        />   
                        <div className="error">  
                            {formik.touched.port && formik.errors.port}  
                        </div>  
                    </div>  
                    
                    <div className="form-group">  
                        <label htmlFor="username">Username</label>  
                        <Input  
                            type="text"  
                            value={formik.values.username}  
                            name="username"  
                            onChange={formik.handleChange}   
                        />   
                        <div className="error">  
                            {formik.touched.username && formik.errors.username}  
                        </div>  
                    </div>  
                    
                    <div className="form-group">  
                        <label htmlFor="password">Password</label>  
                        <Input  
                            type="password"  
                            value={formik.values.password}  
                            name="password"  
                            onChange={formik.handleChange}  
                        />   
                        <div className="error">  
                            {formik.touched.password && formik.errors.password}  
                        </div>  
                    </div>   

                    <div className='d-flex justify-content-around w-75 mt-2'>  
                        <input type="submit" className="btn btn-primary" value={getConnectionName === null ? 'Save' : 'Update'} />  
                        <Button className="btn btn-danger" onClick={() => navigate('/connections/view-connections')}>Cancel</Button>  
                    </div>   
                </form>   
            </div>  
        </div>   
        </>
    );  
}  

export default HanaForm;