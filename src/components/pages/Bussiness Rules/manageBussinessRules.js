import { Button, message, Radio, Table } from 'antd';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import * as yup from 'yup'
import CreateBussinessRules from './createBussinessRules';
import CustomModel from '../Connections/ViewConnections/CustomModel';
import { deleteBussinessRulesSlice, getBussinessRulesSlice } from '../../features/BussinessRules/BussinessRulesSlice';

const ManageBussinessRules = () => {

     const [selectOption,setSelectOption] = useState(null);
     const dispatch = useDispatch();
     const [searchText, setSearchText] = useState(''); 
     const [open, setOpen] = useState(false);  
     const [alertActive,setAlertActive] = useState(true);
     const [selectedKey, setSelectedKey] = useState(null); 
     const [messageApi, contextHolder] = message.useMessage();
     const [selectedRecord,setSelectedRecord] = useState(null); 
     const [allProjects, setAllProjects] = useState([]);
     const [loading, setLoading] = React.useState(false);
     const navigate = useNavigate();
     const projects = useSelector(state => state.project.projects);

     const {rules} = useSelector(state=>state.bussinessrules)

      const schema = yup.object({
             connection_name : yup.string().required("Connection Name Required")
         })

     const formik = useFormik({
             initialValues:{
                 connection_name:"",
                 project_id_select:""
             },
             validationSchema:schema,
             onSubmit:(values)=>{
                 console.log(values);
             }
         })

         const handleRadioChange = (record) => {  
            setSelectedKey(record.obj_id); 
            setSelectedRecord(record);
        };  




    const columns = [   
        {  
            title: 'Select',  
            dataIndex: 'selecteditem',  
            render: (text, record) => (  
                <div style={{display:'flex',justifyContent:'center'}}>
                <Radio  
                    checked={selectedKey === record.obj_id}  
                    onChange={() => handleRadioChange(record)}   
                />  
                </div>
            )  
        },  
        {  
            title: 'Data Object',  
            dataIndex: 'obj_name',  
            key: 'obj_name',  
            render: (text, record) => (
                <Link to={''} className='text-center'>{record.obj_name}</Link>                  
            )
        },  
        {  
            title: 'Data Object Id',  
            dataIndex: 'obj_id',  
            key: 'obj_id',  
        },  
        {  
            title: 'Data Mapping Sheet',  
            dataIndex: 'template_name',  
            key: 'template_name',  
        }
    ];  

            useEffect(()=>{
                setAllProjects(projects);
            },[projects])

            useEffect(()=>{
                dispatch(getBussinessRulesSlice({project_id : selectOption?.target?.value}))
            },[selectOption])


    const handleFileSelect = (e)=>{
        if(e.target.value !== ""){
            setSelectOption(e);
        }
    }

    const showModal = ()=>{
        if(selectedRecord === null){
            if(alertActive){
                messageApi.info('Please Select a Connection2')
                setAlertActive(false);
                setTimeout(()=>setAlertActive(true),3000);
                }
        }
       else{
           setOpen(true);
       }
    }

    const handleCreateNavigation = ()=>{
        if(selectOption !== null){
            const project_id = selectOption?.target?.value;
            navigate(`/bussinessrules/create/${project_id}`);
        }
        else{
            messageApi.info('Please Select a File');
        }
    }

    const handleEditNavigation = ()=>{
        if(selectedRecord === null)
        {
            if(alertActive){
            messageApi.info('Please Select a File')
            setAlertActive(false);
            setTimeout(()=>setAlertActive(true),3000);
            }
        }
        else{
            navigate(`/bussinessrules/reupload/${selectedRecord?.obj_id}`);
        }
    }   

    const hideModal = () => {  
        setOpen(false);  
    }; 

    const handleDelete = ()=>{
        dispatch(deleteBussinessRulesSlice({obj_id : selectedRecord?.obj_id}))
        .then((response)=>{
            if(response?.payload?.status === 202){
                toast.success(`${selectedRecord?.obj_name} Deletion Successfull`)
                dispatch(getBussinessRulesSlice({project_id : selectOption?.target?.value}))
                hideModal(false);
            }
            else{
                toast.error(`${selectedRecord?.obj_id} Deletion Failed`)
            }
        })
        setOpen(false);
    }

    const bussiness_rules = []

    Array.isArray(rules) && rules?.forEach((field,i)=>{
        bussiness_rules.push({
            obj_name : field?.obj_name,
            obj_id : field?.obj_id,
            template_name : field?.template_name,
            project_id : field?.project_id
        })
    })

     // Filter data based on search text  
     const filteredData = bussiness_rules?.filter(item => (
        item.obj_name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.template_name.toLowerCase().includes(searchText.toLowerCase())
    ))
    

    const filterSelectOptions = filteredData?.filter(item => {  
        if (selectOption?.target?.value){  
            const selectedValue = Number(selectOption.target.value);  
            return item.project_id === selectedValue;  
        } else {  
            return true;
        }  
    });


  return (
    
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
                     {contextHolder}


                     <div className="container-fluid">  
                        <div className="d-flex flex-row justify-content-around mb-3" style={{ overflowX: "auto", maxWidth: "100%" }}>  
                    <label style={{ color: "skyblue", fontSize: "20px" }}>Bussines Rules</label>  
                    <select  
                        name="project_id"   
                        className='form-select'   
                        style={{ maxWidth: "200px", padding: "3px" }}   
                        onChange={handleFileSelect}   
                    >  
                        <option value="" style={{ textAlign: "center" }}>Select Project</option>   
                        {allProjects && allProjects.map((option) => (  
                            <option key={option?.project_id} value={option?.project_id} style={{ textAlign: "center" }}>{option?.project_name}</option>  
                        ))}  
                    </select>  
                    <Button className="mb-2 mb-md-0 me-md-2" onClick={handleCreateNavigation} style={{ fontSize: '14px' }}>  
                        Create  
                    </Button>  
                    <Button className="mb-2 mb-md-0 me-md-2" onClick={handleEditNavigation} style={{ fontSize: '14px' }}>  
                        ReUpload  
                    </Button>  
                    <Button className="mb-2 mb-md-0 me-md-2" onClick={showModal} style={{ fontSize: '14px' }}>  
                        Delete  
                    </Button>   
                   
                    <input  
                        placeholder="Search by Data Object, or Id"  
                        value={searchText}  
                        className='form-control form-control-addons'   
                        style={{ maxWidth: "200px", padding: "2px" }}   
                        onChange={(e) => setSearchText(e.target.value)}  
                    />  
                </div>  
            </div>


           <Table  
                columns={columns}  
                dataSource={filterSelectOptions} // Use the filtered data  
                pagination={{  
                    pageSize: 10,  
                }}  
            />  


        <CustomModel
              title={<>Delete { selectedRecord?.obj_name !== undefined ?  <span style={{ color: "red",display:"inline" }}>"{` `} {selectedRecord?.obj_name}{` `} "</span>:''} {` `}Object</>}
              hideModal={hideModal} 
              open={open}
              performAction = {handleDelete}
              onCancel={hideModal}
              okText="Yes"
              cancelText="No"
            />

    </div>
  )
}

export default ManageBussinessRules