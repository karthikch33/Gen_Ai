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
           project_name: yup.string().required("Project Name is required")
           .matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Project name must start with a letter or underscore & can only contain letters, numbers, and underscores.')  
           .trim()  
           .notOneOf(['_', ''], 'Project name cannot be just an underscore or empty.')  
           .test('no-start-end-underscore', 'Underscore cannot be at the start or end of project name.', (value) => {  
               return value && !(value.startsWith('_') || value.endsWith('_'));  
           })  
           .test('no-spaces', 'Spaces are not allowed in project name.', (value) => {  
               return value && !/\s/.test(value);  
           }),  
           description: yup.string().required("description is required"),  
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
    <>
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
                backgroundColor: '#f0f2f5',  
                maxWidth: '400px',  
                padding: '30px',  
                borderRadius: '8px',  
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',  
            }}  
        >  
            <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Project</h4>  

             <label>Project Name :</label> 
                        <Form.Item  validateStatus={formik.errors.project_name ? "error" : ""} help={formik.errors.project_name}>  
                            <Input  
                                name="project_name"  
                                placeholder="Enter Project Name"  
                                value={formik.values.project_name}  
                                onChange={formik.handleChange}  
                            />  
                        </Form.Item>  
                        <label>Description :</label>
                        <Form.Item>  
                            <Input  
                                name="description"  
                                placeholder="Enter description"  
                                value={formik.values.description}  
                                onChange={formik.handleChange}  
                            />  
                            <div className="error">  
                            {formik.touched.description && formik.errors.description}  
                        </div>
                        </Form.Item>  
            
            <Form.Item style={{ textAlign: 'center' }}>  
                <Button  
                    type="primary"  
                    htmlType="submit"  
                    style={{  
                        backgroundColor: '#1890ff',  
                        borderColor: '#1890ff',  
                        marginRight: '10px',  
                    }}  
                >  
                    Create  
                </Button>  
                <Button  
                    danger  
                    onClick={() => navigate('/project/manageprojects')}  
                    style={{  
                        backgroundColor: 'red',  
                        borderColor: 'red',  
                        color: 'white',  
                    }}  
                >  
                    Cancel  
                </Button>  
            </Form.Item>  
        </Form>  
</div>  
</>
  )
}

export default CreateProject