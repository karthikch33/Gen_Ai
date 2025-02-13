import React from 'react'
import {useFormik} from 'formik'
import * as yup from 'yup'
import { useSelector, useDispatch } from 'react-redux';  
import { Input, Table, Button, Modal, Form, Space, message, Radio } from 'antd';  
import { createProjectSlice } from '../../features/Project/projectSlice';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const CreateProject = () => {
   const schema = yup.object().shape({  
           project_name:yup.string().required('Project Name Required')
                   .matches(/^(?!_)(?!.*_$)[a-zA-Z0-9_]+$/, 'Invalid Project Name'),
           description: yup.string().required("Description is required"),  
       });  

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const 

    const formik = useFormik({
        initialValues:{
            project_name:'',
            description:'',
            created_by:'aditya',
        },
        validationSchema:schema,
        onSubmit:(values)=>{
            dispatch(createProjectSlice(values))
            .then((response)=>{
                console.log(response);
                if(response?.payload?.status === 200){
                    toast.success(`Project ${response?.payload?.data?.project_name} Created Successfully`);
                    setTimeout(()=>{
                        navigate('/project/manageprojects')
                    },2000)
                }
                else if(response?.payload?.status === 406){
                    toast.info(`Project  Already Exists`)
                }
                else{
                    toast.error(`Project Creation Failed`);
                }
            })
        }
    })


  return (
    <div className='p-2 m-3'>
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>  
          <Form  
            layout="vertical"  
            onFinish={formik.handleSubmit}  
            style={{  
                width: '400px',  
                backgroundColor: '#f8f9fa',  
                maxWidth: '400px',  
                padding: '30px',  
                borderRadius: '8px',  
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',  
            }}  
        >  
            <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Project</h4>  

                 <div className="row mt-3 d-flex align-items-center" >  
                    <label htmlFor="project_name" className='col-4'>Project Name</label> 
                    <div className='col-8'>
                    <Input
                        type="text" 
                        className='form-control' 
                        name="project_name"  
                        value={formik.values.project_name}  
                        onChange={formik.handleChange}  
                        onBlur={formik.handleBlur}
                    />  
                    </div>
                    </div>    

                <div className='row'>
                    <label className='col-4'></label>
                    <div className='col-8'>
                    <div className="error" style={{overflowX:"auto"}}>
                        {formik.touched.project_name && formik.errors.project_name}
                    </div>  
                    </div>
                </div>

                 <div className="row mt-3 d-flex align-items-center" >  
                    <label htmlFor="description" className='col-4'>Description</label> 
                    <div className='col-8'>
                    <Input
                        type="text" 
                        className='form-control' 
                        name="description"  
                        value={formik.values.description}  
                        onChange={formik.handleChange('description')}  
                    />  
                    </div>
                    </div>    

                <div className='row'>
                    <label className='col-4'></label>
                    <div className='col-8'>
                    <div className="error" style={{overflowX:"auto"}}>
                        {formik.touched.description && formik.errors.description}
                    </div>  
                    </div>
                </div>

                <div className='d-flex justify-content-center mt-3 gap-4'>  
                        <input type='submit' className='btn btn-primary' value={'Create'} />  
                        <input type='button' className="btn btn-danger" onClick={() => navigate('/project/manageprojects')} value={'Cancel'} />  
                </div>                       
         </Form>  
</div>  
</div>
  )
}

export default CreateProject