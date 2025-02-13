import React, { useEffect, useState } from 'react';  
import { Input, Table, Button, Modal, Form, Space, message, Radio } from 'antd';  
import { useSelector, useDispatch } from 'react-redux';  
import { useFormik } from "formik";  
import * as yup from "yup";  
import { deleteProjectsSlice, getProjectsSlice, updateProjectsSlice } from '../../features/Project/projectSlice';  
import { toast, ToastContainer } from 'react-toastify';

const ManageProjects = () => {  
    const [searchText, setSearchText] = useState('');  
    const [open, setOpen] = useState(false);  
    const [open2, setOpen2] = useState(false);  
    const [selectedKey, setSelectedKey] = useState(null);  
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [alertActive,setAlertActive] = useState(true);  
    const dispatch = useDispatch();  
    const [messageApi, contextHolder] = message.useMessage();
    const projects = useSelector(state => state.project.projects);  
    const [data, setData] = useState([]);  

    const schema = yup.object().shape({  
        project_name: yup.string().required("Project Name is required")
        .required('Please enter your project Name!')  
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

    const formik = useFormik({  
        initialValues: {  
            project_name: "",  
            description: "",  
        },  
        validationSchema: schema,  
        onSubmit: (values) => {  
            handleEditSubmit(values);  
            hideModal();  
            setSelectedKey('');
        },  
        enableReinitialize: true,
    });  

    const handleRadioChange = (record) => {  
        setSelectedKey(record.project_id);  
        setSelectedRecord(record);  
    };  

    const showModal = () => { 
        if(selectedRecord === null)
            {
                if(alertActive){
                messageApi.info('Please Select a Project')
                setAlertActive(false);
                setTimeout(()=>setAlertActive(true),3000);
                }
            }
        else{
            formik.setValues({  
                project_name: selectedRecord.project_name,  
                description: selectedRecord.description,  
            });  
            setOpen(true);  
        }
    };  

    const hideModal = () => {  
      setOpen(false);  
  };  

    const handleEditSubmit = (values) => {  
        if (!selectedRecord) {  
            messageApi.info('Please Select a Project');  
            return;  
        }  
        dispatch(updateProjectsSlice({ ...values, project_id: selectedRecord.project_id }))
        .then((response)=>{
            if(response?.payload?.status === 200){
                toast.success(`Project ${response?.payload?.data?.project_name} Updated Successfully`);
            }
            else{
                toast.error(`Project Name already exists`);
            }
        })
        setTimeout(() => {  
            try {
                dispatch(getProjectsSlice());  
            } catch (error) {
                toast.error('Project Fectch Failed');                
            }
        }, 1000);  
        setSelectedRecord(null);
        setOpen(false);  
    };  

    const showModal2 = ()=>{
        if(selectedRecord === null)
            {
                if(alertActive){
                messageApi.info('Please Select a Project')
                setAlertActive(false);
                setTimeout(()=>setAlertActive(true),3000);
                }
            }
      else{
      setOpen2(true);
      }
    }

    const hideModal2 = () => {  
      setOpen2(false); 
  };  

    const handleDelete = () => {  
        if (selectedRecord) {  
            dispatch(deleteProjectsSlice({project_id : selectedRecord.project_id}))
            .then((response)=>{
                if(response?.payload?.status === 202){
                    toast.success(`${response?.payload?.data?.project_name} is deleted`);
                }  
                else{
                    toast.error('Deletion Failed');
                }
            })
            .catch(()=>{
                toast.error('Server Error')
            })
            setTimeout(()=>{
                try {
                    dispatch(getProjectsSlice())
                } catch (error) {
                    toast.error('Project Fectch Failed');
                }
            },1000)  
            setSelectedRecord(null);
            setOpen2(false);  
        }
    };  

    const columns = [  
      {  
          title: 'Select',  
          dataIndex: 'selecteditem',  
          render: (text, record) => (  
              <div style={{ display: 'flex', justifyContent: 'center' }}>  
                  <Radio  
                      checked={selectedKey === record.project_id}  
                      onChange={() => handleRadioChange(record)}  
                  />  
              </div>  
          )  
      },  
      {  
          title: 'Project Name',  
          dataIndex: 'project_name',  
          key: 'project_name',  
      },  
      {  
          title: 'description',  
          dataIndex: 'description',  
          key: 'description',  
      },  
      {  
          title: 'Created By',  
          dataIndex: 'created_by',  
          key: 'created_by',  
      },  
      {  
          title: 'Created On',  
          dataIndex: 'created_at',  
          key: 'created_at',  
      }  
  ];  


      useEffect(() => {  
        try {
            dispatch(getProjectsSlice());    
        } catch (error) {
            toast.error('Project Fectch Failed');
        }
    }, [dispatch]);  

    useEffect(() => {  
        setData(projects);  
    }, [projects]); 

    const projectData = []

    Array.isArray(data) && data.forEach((field,i)=>{
      projectData.push({
        project_id : field?.project_id,
        project_name : field?.project_name,
        description : field?.description,
        created_at : field?.created_at,
        created_by : field?.created_by,
      })
    })

    function formatDateString(isoDate) {  
        const date = new Date(isoDate);  
        const day = String(date.getDate()).padStart(2, '0');  
        const month = String(date.getMonth() + 1).padStart(2, '0');  
        const year = date.getFullYear();  
        const hours = String(date.getHours()).padStart(2, '0');  
        const minutes = String(date.getMinutes()).padStart(2, '0');  
        const seconds = String(date.getSeconds()).padStart(2, '0');  
    
        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;  
    }  
    
    const projectsIterate = projectData.map((field) => ({  
        project_id: field?.project_id,  
        project_name: field?.project_name,  
        description: field?.description,  
        created_at: formatDateString(field?.created_at),  
        created_by: field?.created_by,  
    }));  
    

    // Filter data based on search text  
    const filteredData = projectsIterate.filter(item =>(
        item.project_name.toLowerCase().includes(searchText.toLowerCase()) ||  
        item.description.toLowerCase().includes(searchText.toLowerCase()) ||
        item.created_by.toLowerCase().includes(searchText.toLowerCase())
    ));  

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
        {contextHolder}    

            <div className="container-fluid">  
            <div className="d-flex justify-content-end align-items-center mb-2">  
                <div className="d-flex mx-4 gap-3">  
                    <Button onClick={showModal} className='primary' style={{  
                        fontSize: '14px'  
                    }} >  
                        Edit  
                    </Button>  
                    <Button onClick={showModal2} className='type-primary' style={{ fontSize: '14px' }}>  
                        Delete  
                    </Button>  
                </div>  
                <Input  
                    placeholder="Search by Project Name, Created By or Description"  
                    value={searchText}  
                    onChange={(e) => setSearchText(e.target.value)}  
                    style={{ maxWidth: 300 }}  
                />  
            </div>

                <Table  
                    columns={columns}  
                    dataSource={filteredData}  
                    pagination={{ pageSize: 10 }}  
                    style={{overflowX:"auto"}}
                />  

                <Modal  
                //{ selectedRecord?.project_name !== undefined ?  <span style={{ color: "red",display:"inline" }}>"{` `} {selectedRecord?.project_name}{` `} "</span>:''} {` `}
                    title={<>Edit Project</>} 
                    onCancel={hideModal}  
                    open={open}
                    footer={null}  
                >  
                    <form onSubmit={formik.handleSubmit} className="max-w-[300px] mx-auto"> 
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
                        <Form.Item validateStatus={formik.errors.description ? "error" : ""} help={formik.errors.description}>  
                            <Input  
                                name="description"  
                                placeholder="Enter description"  
                                value={formik.values.description}  
                                onChange={formik.handleChange}  
                            />  
                        </Form.Item>  

                        <Form.Item>  
                            <Space>  
                                <Button type="primary" htmlType="submit">  
                                    Submit
                                </Button>  
                                <Button onClick={hideModal}>Cancel</Button>  
                            </Space>  
                        </Form.Item>  
                    </form>  
                </Modal>  

                <Modal  
                    title={<>Delete  { selectedRecord?.project_name !== undefined ?  <span style={{ color: "red",display:"inline" }}>"{` `} {selectedRecord?.project_name}{` `} "</span>:''} {` `}Project</>} 
                    open={open2}  
                    onOk={handleDelete}  
                    onCancel={hideModal2}  
                    okText="Yes, Delete"  
                    cancelText="Cancel"  
                >  
                </Modal>  
            </div>  
        </>  
    );  
};  

export default ManageProjects;