import React, { useEffect, useState } from 'react';   
import { Button, input, message } from 'antd';  
import { useFormik } from "formik";  
import * as yup from 'yup';  
import { useLocation, useNavigate } from 'react-router-dom';  
import { useDispatch, useSelector } from 'react-redux';  
import { checkHanaConnectionSlice, resetState, saveConnectionSlice, singleGetConnectionSlice, updateConnectionSlice } from '../../../features/Connections/connectionSlice';  
import { getProjectsSlice } from '../../../features/Project/projectSlice';  
import 'bootstrap/dist/css/bootstrap.min.css';  
import { toast, ToastContainer } from 'react-toastify';

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
        connection_name : yup.string().required('Connection Name Required ')
        .matches(/^(?!_)(?!.*_$)[a-zA-Z0-9_]+$/, 'Invalid Connection Name'),   
         host: yup.string()  
        .matches(  
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,   
        'Must be a valid IP address'  
        ).required('Provide Host Number'),  
        port: yup.number().required('Port Required'),  
        username: yup.string().required('Username Required')
        .matches(/^(?!_)(?!.*_$)[a-zA-Z0-9_]+$/, 'Invalid Username Name'),
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
        
        <div className="d-flex justify-content-center">   
            <div className="bg-light border rounded shadow p-4">   
                <h3 className="text-center mt-3"> HANA Connection</h3>  
                <form onSubmit={formik.handleSubmit} style={{width:"400px",padding:"25px"}}>

                    <div className="row d-flex align-items-center">  
                        <label htmlFor="project_id" className="col-4" >Project Name</label>
                        <div className='col-8'>
                        <select  
                            name="project_id"  
                            className='form-select'  
                            style={{ width: '100%'}}  
                            value={formik.values.project_id}  
                            onChange={formik.handleChange}  
                            onBlur={formik.handleBlur}
                            disabled={getConnectionName !== null}  
                        >  
                            <option value="">Select Project</option>    
                            {allProjects && allProjects.map((option) => (  
                                <option key={option?.project_id} value={option?.project_id}>  
                                    {option?.project_name}  
                                </option>  
                            ))}  
                        </select>  
                        
                        </div>
                        </div>

                        <div className='row'>
                            <label className='col-4'></label>
                            <div className='col-8'>
                            <div className="error" style={{overflowX:"auto"}}>
                                {formik.touched.project_id && formik.errors.project_id}
                            </div>  
                            </div>
                        </div>   
                    
                    <div className="row mt-3 d-flex align-items-center" >  
                        <label htmlFor="connection_name" className='col-4'>Connection</label> 
                        <div className='col-8'>
                        <input
                            type="text" 
                            className='form-control' 
                            name="connection_name"  
                            value={formik.values.connection_name}  
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}  
                            disabled={getConnectionName !== null}   
                        />  
                        </div>
                        </div>    

                        <div className='row'>
                            <label className='col-4'></label>
                            <div className='col-8'>
                            <div className="error" style={{overflowX:"auto"}}>
                                {formik.touched.connection_name && formik.errors.connection_name}
                            </div>  
                            </div>
                        </div>
                    
                     <div  className="row mt-3 d-flex align-items-center">  
                        <label htmlFor="host" className='col-4'>Host</label>  
                        <div className='col-8'>
                        <input  
                            type="text"  
                            className='form-control' 
                            name="host"  
                            value={formik.values.host}  
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}  
                        />  
                        </div>
                    </div>  

                    <div className='row'>
                        <label className='col-4'></label>
                        <div className='col-8'>
                        <div className="error" style={{overflowX:"auto"}}>
                            {formik.touched.host && formik.errors.host}
                        </div>  
                        </div>
                    </div>

                    
                    <div className="row mt-3 d-flex align-items-center">  
                        <label htmlFor="port" className='col-4 '>Port</label> 
                        <div className='col-8'> 
                        <input  
                            type="text"  
                            value={formik.values.port}  
                            name="port"  
                            className='form-control' 
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}   
                        />   
                        </div>
                    </div>  

                    <div className='row'>
                        <label className='col-4'></label>
                        <div className='col-8'>
                        <div className="error" style={{overflowX:"auto"}}>
                            {formik.touched.port && formik.errors.port}
                        </div>  
                        </div>
                    </div>
                    
                     <div  className="row mt-3 d-flex align-items-center">  
                            <label htmlFor="username" className='col-4'>Username</label> 
                            <div className='col-8'> 
                            <input  
                                type="text"  
                                name="username"  
                                className='form-control' 
                                value={formik.values.username}  
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}  
                            />  
                            </div>
                        </div> 

                        <div className='row'>
                                <label className='col-4'></label>
                                <div className='col-8'>
                                <div className="error" style={{overflowX:"auto"}}>
                                    {formik.touched.username && formik.errors.username}
                                </div>  
                                </div>
                        </div> 

                        <div  className="row mt-3 d-flex align-items-center">  
                            <label htmlFor="password" className='col-4'>Password</label>  
                            <div className='col-8'>
                            <input  
                                type="password"   
                                className='form-control' 
                                name="password"  
                                value={formik.values.password}  
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}  
                            /> 
                            </div> 
                        </div>  

                        <div className='row'>
                                <label className='col-4'></label>
                                <div className='col-8'>
                                <div className="error" style={{overflowX:"auto"}}>
                                    {formik.touched.password && formik.errors.password}
                                </div>  
                        </div>  
            </div>
                                      
                    <div className='d-flex justify-content-center mt-3 gap-4'>  
                        <input type='submit' className='btn btn-primary' value={getConnectionName !== null ? 'Update' : 'Save'} />  
                        <input type='button' className="btn btn-danger" onClick={() => navigate("/connections/view-connections")} value={'Cancel'} />  
                    </div>   
                </form>   
            </div>  
        </div>   
        </>
    );  
}  

export default HanaForm;