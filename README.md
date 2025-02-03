// import React, { useEffect, useState } from 'react';  
// import {  Input, Select } from 'antd';  
// import { useFormik } from "formik";  
// import * as yup from 'yup';  
// import { useLocation, useNavigate } from 'react-router-dom';  
// import 'bootstrap/dist/css/bootstrap.min.css';  
// import { useDispatch, useSelector } from 'react-redux';
// import { checkConnectionSlice, saveConnectionSlice, singleGetConnectionSlice, updateConnectionSlice } from '../../../features/Connections/connectionSlice';
// import { ToastContainer } from 'react-toastify';
// import { getProjectsSlice } from '../../../features/Project/projectSlice';

// const ErpForm = () => {  
//     const [databases, setDatabases] = useState([]);  
//     const [allProjects, setAllProjects] = useState([]);  
//     const navigate = useNavigate();  
//     const location = useLocation();  

//     // Extracting connection details from URL  
//     const getConnectionType = location.pathname.split('/')[2] || null;  
//     const getConnectionName = location.pathname.split('/')[3] || null;  
//     const getProjectId = location.pathname.split('/')[4];  

//     const dispatch = useDispatch();
//     const {connectionStatus, singleConnection} = useSelector(state=>state.connection);
//     const projects = useSelector(state => state.project.projects);  



//     // Validation Schema  
//     const schema = yup.object().shape({  
//         project_id: yup.string().required('Project Selection Required'),  
//         host: yup.string().required('Host Required'),  
//         sysnr: yup.string().required('System Number Required'),  
//         client: yup.string().required('Client Required'),  
//         username: yup.string().required('Username Required'),  
//         password: yup.string().required('Password Required'),  
//     });  
    
//     // Formik setup  
//     const formik = useFormik({  
//         initialValues: {  
//             project_id: "",  
//             connection_name: "",  
//             connection_type: "",  
//             host: "34.194.191.113",  
//             sysnr: "01",  
//             client: "100",  
//             username: "",  
//             password: "",  
//             status: "Inactive", // Use "Inactive" consistently  
//         },  
//         validationSchema: schema,  
//         onSubmit: async (values) => {  
//             dispatch(checkConnectionSlice(values));
//             setTimeout(async ()=>{
//                     if (connectionStatus && getConnectionName === null) {  
//                         formik.values.status = 'Active';
//                         await saveConnection({...values , connection_type:"Erp"});  
//                     } else if(getConnectionName === null){  
//                         await saveConnection({...values , connection_type:"Erp"});  
//                     }  

//                     if (getConnectionName !== null) {  
//                         if(connectionStatus){
//                             formik.values.status = 'Active';
//                             await updateConnection({...values , connection_type:"Erp"});  
//                         }
//                         else{
//                             await updateConnection({...values , connection_type:"Erp"});  
//                         }
//                     }
//                     navigate('/connections/view-connections');
//             },1000)
//         }  
//     });  

//     // Fetch connection details if editing  
//     const fetchConnection = async () => { 
//         const singleConnectionData = {
//             project_id : getProjectId,
//             connection_name : getConnectionName
//         } 
//         dispatch(singleGetConnectionSlice(singleConnectionData));   
//     };  

//     useEffect(()=>{
//             if (getConnectionName && singleConnection) {  
//                 formik.setValues({  
//                     project_id: singleConnection.data.project_id,  
//                     connection_name: singleConnection.data.connection_name,  
//                     connection_type: singleConnection.data.connection_type,  
//                     host: singleConnection.data.host,  
//                     sysnr: singleConnection.data.sysnr,  
//                     client: singleConnection.data.client,  
//                     username: singleConnection.data.username,  
//                     password: "", // Do not fetch password for security reasons  
//                     status: singleConnection.data.status, // Maintain status if received  
//                 });
//         } 
//     },[singleConnection])

//     // Fetch all projects  
//     const fetchProjects = async () => {  
//         dispatch(getProjectsSlice())
//     };  

//     useEffect(()=>{
//         setAllProjects(projects);
//     },[projects])

//     // Fetch databases  
//     const fetchDatabases = async () => {  
//         try {  
//             const response = await fetch('http://127.0.0.1:8000/api/saptables/');  
//             if (response.ok) {  
//                 const data = await response.json();  
//                 setDatabases(data); // Assuming API returns { databases: [...] }  
//             } else {  
//                 throw new Error('Failed to fetch databases');  
//             }  
//         } catch (error) {  
//             console.error('Error fetching databases:', error);  
//         }  
//     };  

//     // Save connection  
//     const saveConnection = async (values) => {  
//         dispatch(saveConnectionSlice(values));
//     };  

//     // Update connection  
//     const updateConnection = async (values) => {  
//        dispatch(updateConnectionSlice(values)); 
//     };  

//     // Effect to fetch data on component mount or when connection name changes  
//     useEffect(() => {  
//         fetchProjects();  
//         fetchConnection(); // Fetch connection only if we're in edit mode  
//     }, [getConnectionName, getProjectId]);  

//     return (  
//         <>
//         <ToastContainer
//           position='top-center'
//           autoClose={1000}
//           hideProgressBar={true}
//           closeOnClick
//           newestOnTop={true}
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme='light'
//           />
//         <div className="d-flex justify-content-center" >  
//             <div className="bg-light border rounded shadow p-2" >  
//                 <h3 className="text-center"> SAP Connection</h3>  
//                 <form onSubmit={formik.handleSubmit} className="form-container">   
//                     <div className="form-group">  
//                         <label htmlFor="project_id">Project Name</label>  
//                         <select  
//                             name="project_id"
//                             className='w-100 form-select'
//                             style={{marginLeft:"10px"}}
//                             value={formik.values.project_id}  
//                             onChange={formik.handleChange('project_id')}  
//                             disabled={getConnectionName !== null}  
//                         >  
//                             <option value="">Select Project</option>    
//                             {allProjects && allProjects.map((option) => (  
//                                 <option key={option?.project_id}   value={option?.project_id}>{option?.project_name}</option>  
//                             ))}  
//                         </select>  
//                         <div className="error">{formik.touched.project_id && formik.errors.project_id}</div>  
//                     </div>  
                    
//                     <div className="form-group">  
//                         <label htmlFor="connection_name">Connection Name</label>  
//                         <Input  
//                             type="text"  
//                             name="connection_name"  
//                             value={formik.values.connection_name}  
//                             onChange={formik.handleChange('connection_name')}  
//                             disabled={getConnectionName !== null}   
//                         />  
//                         <div className="error">{formik.touched.connection_name && formik.errors.connection_name}</div>  
//                     </div>  

//                     <div className="form-group">  
//                         <label htmlFor="host">Host</label>  
//                         <Input  
//                             type="text"  
//                             name="host"  
//                             value={formik.values.host}  
//                             onChange={formik.handleChange('host')}  
//                         />  
//                         <div className="error">{formik.touched.host && formik.errors.host}</div>  
//                     </div>  

//                     <div className="form-group">  
//                         <label htmlFor="sysnr">SYSNR</label>  
//                         <Input  
//                             type="text"  
//                             name="sysnr"  
//                             value={formik.values.sysnr}  
//                             onChange={formik.handleChange('sysnr')}  
//                         />  
//                         <div className="error">{formik.touched.sysnr && formik.errors.sysnr}</div>  
//                     </div>  

//                     <div className="form-group">  
//                         <label htmlFor="client">Client</label>  
//                         <Input  
//                             type="text"  
//                             name="client"  
//                             value={formik.values.client}  
//                             onChange={formik.handleChange('client')}  
//                         />  
//                         <div className="error">{formik.touched.client && formik.errors.client}</div>  
//                     </div>  

//                     <div className="form-group">  
//                         <label htmlFor="username">Username</label>  
//                         <Input  
//                             type="text"  
//                             name="username"  
//                             value={formik.values.username}  
//                             onChange={formik.handleChange('username')}  
//                         />  
//                         <div className="error">{formik.touched.username && formik.errors.username}</div>  
//                     </div>  

//                     <div className="form-group">  
//                         <label htmlFor="password">Password</label>  
//                         <Input  
//                             type="password"  
//                             name="password"  
//                             value={formik.values.password}  
//                             onChange={formik.handleChange('password')}  
//                         />  
//                         <div className="error">{formik.touched.password && formik.errors.password}</div>  
//                     </div>  

//                     <div className='d-flex justify-content-around w-75 mt-2'>  
//                         <input type='submit' className='btn btn-primary' value={getConnectionName !== null ? 'Update' : 'Save'} />  
//                         <input type='button' className="btn btn-danger" onClick={() => navigate("/connections/view-connections")} value={'Cancel'} />  
//                     </div>  
//                 </form>  
//             </div>  
//         </div>  
//         </>
//     );  
// }  
   
// export default ErpForm;