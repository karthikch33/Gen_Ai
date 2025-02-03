import React, { useEffect, useState } from 'react';  
import { Input, Table, Button, Radio, message, Modal } from 'antd';  
import CustomModel from './CustomModel';  
import { Link, useNavigate } from 'react-router-dom';  
import {useFormik} from 'formik'
import * as yup from 'yup'
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { deleteConnectionSlice, getConnectionSlice, renameConnectionSlice } from '../../../features/Connections/connectionSlice';

const ViewConnection = () => {  

    const [searchText, setSearchText] = useState('');  
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedKey, setSelectedKey] = useState(null); 
    const [selectedRecord,setSelectedRecord] = useState(null);  
    const [open, setOpen] = useState(false);  
    const [open2, setOpen2] = useState(false);  
    const navigate = useNavigate();

    const handleRadioChange = (record) => {  
        setSelectedKey(record.id); 
        setSelectedRecord(record);
    };  
    

    const dispatch = useDispatch();
    const {connections} = useSelector((state)=>state.connection)

    const schema = yup.object({
        connection_name : yup.string().required("Connection Name Required")
    })


    const formik = useFormik({
        initialValues:{
            connection_name:""
        },
        validationSchema:schema,
        onSubmit:(values)=>{
            console.log(values);
        }
    })

    useEffect(() => { 
        dispatch(getConnectionSlice())   
     }, []);

    const columns = [   
        {  
            title: 'Select',  
            dataIndex: 'selecteditem',  
            render: (text, record) => (  
                <div style={{display:'flex',justifyContent:'center'}}>
                <Radio  
                    checked={selectedKey === record.id}  
                    onChange={() => handleRadioChange(record)}   
                />  
                </div>
            )  
        },  
        {  
            title: 'Connection Name',  
            dataIndex: 'connection_name',  
            key: 'connection_name',  
            render: (text, record) => (
                <Link to={''} className='text-center'>{record.connection_name}</Link>                  
            )
        },  
        {  
            title: 'Connection Type',  
            dataIndex: 'connection_type',  
            key: 'connection_type',  
        },  
        {  
            title: 'Username',  
            dataIndex: 'username',  
            key: 'username',  
        },  
        {  
            title: 'Host',  
            dataIndex: 'host',  
            key: 'host',  
        },  
        {  
            title: 'Connection Status',  
            dataIndex: 'connection_status',  
            key: 'connection_status',  
            render: (status) => (
                <div style={{ display: 'flex', alignItems: 'center', marginLeft:'18px' }}>  
                    <span className={`circle ${status === "Active" ? 'green' : 'red'}`}></span>      
                    <p className='mb-2 ml-2'>{status === "Active" ? 'Active' :'InActive'}</p>  
                </div>  
            ),   
        } 
    ];  

    const conns = []

    
    Array.isArray(connections?.data) && connections?.data.forEach((field,i)=>{
        conns.push({
         id: field.id,  
        connection_type: field.connection_type,  
        connection_name: field.connection_name,  
        username: field.username,  
        host: field.host,
        project_id : field.project_id,  
        connection_status: field.status  
        })
    })

    const connectionsIterate =  conns?.map(field => ({  
        id: field.id,  
        connection_type: field.connection_type,  
        connection_name: field.connection_name,
        // <a onClick={()=>{getTables(field)}} style={{textDecoration:'underline',color:'blue'}}>
        // {field.connection_name}
        // </a>,    
        username: field.username,  
        host: field.host,
        project_id : field.project_id,  
        connection_status: field.connection_status  
    }));  
    
    
    
    console.log(conns);
    // Filter data based on search text  
    const filteredData = connectionsIterate?.filter(item => (  
        item.connection_type.toLowerCase().includes(searchText.toLowerCase()) ||
        item.username.toLowerCase().includes(searchText.toLowerCase()) ||  
        item.host.toLowerCase().includes(searchText.toLowerCase())  ||  
        item?.connection_name.toLowerCase().includes(searchText.toLowerCase())   
    ));  

        
    const handleEditNavigation = ()=>{
        console.log(selectedRecord.connection_name)
        selectedRecord === null ? messageApi.info('Please Select a Connection') : 
        navigate(`/connections/${selectedRecord?.connection_type}/${selectedRecord.connection_name}/${selectedRecord?.project_id}`);
    }   
    
    const showModal = ()=>{
        selectedRecord === null ? messageApi.info('Please Select a Connection') : 
        setOpen(true);
    }
    
    const hideModal = () => {  
        setOpen(false);  
    }; 

    const handleDelete = ()=>{
        dispatch(deleteConnectionSlice(selectedRecord)) 
        setTimeout(()=>{
            dispatch(getConnectionSlice())
        },1000)
        hideModal(false);
    }  

    
    const showModal2 = () => {  
        if(selectedRecord === null)
        messageApi.info('Please Select a Record')
        else{
        formik.values.connection_name = selectedRecord?.connection_name;
        setOpen2(true);
        }
    };  


    const hideModal2 = () => {  
        setOpen2(false);  
    };    

    const handleRename = ()=>{
        console.log(formik.values.connection_name);
        const rename_data = {
            re_val : formik.values.connection_name,
            ...selectedRecord
        }
        dispatch(renameConnectionSlice(rename_data));
        setTimeout(()=>{
            dispatch(getConnectionSlice())
        },1000)
        setSelectedKey('');
        hideModal2(false);
    }   

    const handleValidateConnection = ()=>{

    }

    const getTables = async (field)=>{
        console.log(field);
        if(field.connection_status==='Inactive'){
            alert("Your Status is Inactive");
        }  
        else{
            if(field.connection_type==='Erp'){
                 navigate(`/connections/view-tables`);
            }
            else{
 
            navigate(`/connections/view-tables/${field.project_id}/${field.connection_name}`);
        }
    }
    }

    return (  
        <div className="w-100">  
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
            <div className="d-flex justify-content-between align-items-between mb-2">  
                    <div className="d-flex align-items-center">  
                        <Link>  
                            <label style={{ cursor: 'pointer', fontSize: "20px" }}>Connections</label>  
                        </Link>  
                        {/* <span style={{ margin: '0 5px' }}>/</span>   */}
                        <Link>  
                            <label style={{ cursor: 'pointer', fontSize: "20px" }}></label>  
                        </Link>  
                    </div>  
                    {/* <div className="form-group">  
                        <Select  
                            name="project_id"
                            className='w-50 h-100'
                            style={{maxHeight:"35px",marginTop:"-10px"}}
                            value={formik.values.project_id}  
                            onChange={formik.handleChange('project_id')}  
                        >  
                            <Option value="">Select Project</Option>    
                            {allProjects && allProjects.map((option) => (  
                                <Option key={option?.project_id} >{option?.project_name}</Option>  
                            ))}  
                        </Select>  
                        <div className="error">{formik.touched.project_id && formik.errors.project_id}</div>  
                    </div>    */}

                    <div className="d-flex justify-content-between align-items-between mb-2 gap-2">

                        <div className="d-flex gap-2">  
                            <Button onClick={handleEditNavigation} style={{ fontSize: '14px' }}>  
                                Edit  
                            </Button>  
                            <Button onClick={showModal} style={{ fontSize: '14px' }}>  
                                Delete  
                            </Button>  
                            <Button onClick={showModal2} style={{ fontSize: '14px' }}>  
                                Rename  
                            </Button>  
                            <Button onClick={handleValidateConnection} style={{ fontSize: '14px' }}>  
                                Validate Connection  
                            </Button>  
                        </div>  


                        <Input  
                            placeholder="Search by Name, Type, Username, or Host"  
                            value={searchText}  
                            onChange={(e) => setSearchText(e.target.value)}  
                            style={{ maxWidth: 300 }}   
                            className="search-input" // optional class for further styling if needed  
                            />  
                    </div>
        </div> 
            <Table  
                columns={columns}  
                dataSource={filteredData} // Use the filtered data  
                pagination={{  
                    pageSize: 10,  
                }}  
            />  


            <CustomModel
              title={<>Delete { selectedRecord?.connection_name !== undefined ?  <span style={{ color: "red",display:"inline" }}>"{` `} {selectedRecord?.connection_name}{` `} "</span>:''} {` `}Connection</>}
              hideModal={hideModal} 
              open={open}
              performAction = {handleDelete}
              onCancel={hideModal}
              okText="OK"
              cancelText="CANCEL"
            />

            <Modal
                title={<>Rename { selectedRecord?.connection_name !== undefined ?  <span style={{ color: "red",display:"inline" }}>"{` `} {selectedRecord?.connection_name}{` `} "</span>:''} {` `}Connection</>}
                open={open2}
                onOk={handleRename}
                onCancel={hideModal2}
                hideModal={hideModal2}
                okText="OK"
                cancelText="CANCEL"
            >
                <form onSubmit={formik.handleSubmit}>  
                        <label htmlFor="">Rename</label>  
                        <input  
                            type="text"  
                            className="form-control"
                            placeholder='Rename Here'
                            name="connection_name"  
                            value={formik.values.connection_name}
                            onChange={formik.handleChange('connection_name')}  
                        />  
                    </form>  
            </Modal>
        </div>  
    );  
}  

export default ViewConnection;