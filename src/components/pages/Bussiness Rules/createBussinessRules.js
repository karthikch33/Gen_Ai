import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {  useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Input, message, Spin } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { createBussinessRulesSlice, getSingleBussinessRulesSlice, updateBussinessRulesSlice, uploadFileNameFetchSlice } from '../../features/BussinessRules/BussinessRulesSlice';

const CreateBussinessRules = () => {


    const navigate = useNavigate();  
    const [uploadedFileName, setUploadedFileName] = useState('');  
    const [file, setFile] = useState(null);  
    const [loading, setLoading] = React.useState(false);


    const location = useLocation();
    const operation = location.pathname.split('/')[2] || null;
    const getObjectId = location.pathname.split('/')[3] || null; 
    const dispatch = useDispatch();


    const formik = useFormik({  
        initialValues: {  
            data_object_name: '',  
            filePath: '',
            project_id:''
        },  
        validationSchema: Yup.object({  
            data_object_name: Yup.string().required('Required'),  
            filePath: Yup.string().required('File is required'),  
        }),  
        onSubmit: (values) => {  
            operation === 'create' ? createBussinessRules(values) : updateBussinessRules(values);
        }  
    });  

    const updateBussinessRules = (values)=>{
        if(!file) return;
        const formData = new FormData();
        formData.append('file',file);
        formData.append('obj_name',values.data_object_name);
        formData.append('object_id',getObjectId);
        formData.append('file_name',file?.name.toString());
        formData.append('project_id',values?.project_id);
        setLoading(true);

        dispatch(updateBussinessRulesSlice(formData))
        .then((response)=>{
            if(response?.payload?.status === 200){
                toast.success(`${response?.payload?.data?.obj_name} is Updated Successfully`);
                setTimeout(()=>{
                    navigate('/bussinessrules/manage');
                },2000)
            }
            else if(response?.payload?.status === 406){
                toast.info(`Data Object Name Exists`);
            }
            else if(response?.payload?.status === 404){
                toast.info(`Updation Failed`);
            }
            else{
                toast.error('Updation Failed');
            }
            setLoading(false);
        })
    }

    const createBussinessRules = (values)=>{
        if(!file) return;
        const formData = new FormData();
        formData.append('file',file);
        formData.append('template_name',values.filePath);
        formData.append('project_id',getObjectId);
        formData.append('obj_name',values?.data_object_name);
        setLoading(true);

        
        dispatch(createBussinessRulesSlice(formData))
        .then((response)=>{
            if(response?.payload?.status === 200){
                toast.success(`${response?.payload?.data?.obj_name} is Created Successfully`);
                setTimeout(()=>{
                    navigate('/bussinessrules/manage');
                },2000)
            }
            else if(response?.payload?.status === 406){
                toast.info(`Data Object Name Exists`);
            }
            else if(response?.payload?.status === 404){
                toast.error(`Creation Failed`);
            }
            else{
                toast.error('Creation Failed');
            }
            setLoading(false);
        })
    }

    useEffect(()=>{
        if(getObjectId !== null)
        dispatch(getSingleBussinessRulesSlice({obj_id : getObjectId}))
        .then((response)=>{
            if(response?.payload?.status === 200){
                formik.values.data_object_name = response?.payload?.data?.obj_name;
                formik.values.project_id = response?.payload?.data?.project_id;
                // formik.values.filePath = response?.payload?.data?.template_name;
                setFile(response?.payload?.data?.file);
            }
            else{
                toast.error('Data Fetch Failed Through Object Id') 
            }
        })
    },[getObjectId])


    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        const uploadedFileExtension = selectedFile ? selectedFile?.name.split('.')[1].toLowerCase() : null;
        
        if(uploadedFileExtension === 'xlsx' || uploadedFileExtension === 'xls')
        {
            setUploadedFileName(selectedFile?.name);
            setFile(selectedFile);  
            formik.setFieldValue('filePath', selectedFile?.name);

            const formData = new FormData();
            formData.append('file',selectedFile);


            dispatch(uploadFileNameFetchSlice(formData))
            .then((response)=>{
                if(response?.payload?.data){
                    formik.setFieldValue('data_object_name', response?.payload?.data);
                }
                else if(response?.payload?.status === 415){
                    toast.error(`Please Upload Only DMC File`);
                }
            })
        }
        else{
            toast.error('UnSupported File Format Only xlsx or xls')
        }
    };  

  return (
    <Spin spinning={loading} tip="Uploading...">
    <div>
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
            <div className="bg-light border rounded shadow p-2">  
                <h3 className="text-center"> {operation === 'create' ? 'Create' :'Reupload' } Data Mapping Rules</h3>  
                <form onSubmit={formik.handleSubmit} className="form-container" style={{width:"400px"}}>   
                    
                    <div>  
                        <label htmlFor="data_object_name">Data Object Name</label>  
                        <Input  
                            type="text"  
                            name="data_object_name"  
                            value={formik.values.data_object_name}  
                            onChange={formik.handleChange('data_object_name')}  
                        />  
                        <div className="error">{formik.touched.data_object_name && formik.errors.data_object_name}</div>  
                    </div>  

                    <div>
                            <label htmlFor="exampleInputEmail1">File Path</label>
                            <div className='d-flex'>
                            <Input  value={uploadedFileName}/>
                            <Input type="file" 
                                className="form-control primary"
                                // value={file}
                                name="filePath"
                                hidden id="browse"
                                onChange={handleFileChange} />
                            <label htmlFor="browse">
                                Browse
                            </label>
                            </div>
                            <div className="error">
                                {
                                    formik.touched.filePath && formik.errors.filePath
                                }
                            </div>
                        </div>

                    <div className='d-flex justify-content-around w-75 mt-2'>  
                        <input type='submit' className='btn btn-primary' value={ operation === 'create' ? 'Upload' : 'ReUpload'} />  
                        <input type='button' className="btn btn-danger" onClick={() => navigate("/bussinessrules/manage")} value={'Cancel'} />  
                    </div>  
                </form>    
            </div>  
        </div> 
    </div>
    </Spin>
  )
}

export default CreateBussinessRules