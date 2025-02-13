import React, { useEffect, useState } from 'react';  
import { Input, Table, Button, Radio, message, Modal, Select } from 'antd';  
import CustomModel from '../ViewConnections/CustomModel';  
import { Link } from 'react-router-dom'; 
import {useFormik} from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux';
import { deleteFileSlice, getFileSlice, renameFileSlice } from '../../../features/Connections/fileSlice';
import FormFile from './FormFile';
import { getProjectsSlice } from '../../../features/Project/projectSlice';
 
const FlatFile = () => {  
 
    const [searchText, setSearchText] = useState('');  
    const [allProjects, setAllProjects] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedKey, setSelectedKey] = useState(null);
    const [selectOption,setSelectOption] = useState();
    const [alertActive,setAlertActive] = useState(true);
    const [selectedRecord,setSelectedRecord] = useState(null);  
    const [open, setOpen] = useState(false);  
    const [open2, setOpen2] = useState(false);  
    const [createf, setcreatef] = useState(false);
    
    
    const handleRadioChange = (record) => {  
        setSelectedKey(record?.file_name);
        setSelectedRecord(record);
    };  
   
 
    const dispatch = useDispatch();
    const {file_connections} = useSelector((state)=> state.file)
   
 
    const {projects} = useSelector(state => state.project);
 
    const schema = yup.object({
        file_name : yup  
                .string()  
                .required("File Name is required")  
                .matches(  
                    /^[a-zA-Z_.-]+$/,  
                    'File name can only contain letters, underscores, periods, and hyphens.'  
                )  
                .trim()  
                .notOneOf(['.', '', '_', '-'], 'File name cannot be just a dot, underscore, or hyphen.')  
                .test('no-start-end-dot', 'File name cannot start or end with a dot.', (value) => {  
                    return value && !(value.startsWith('.') || value.endsWith('.'));  
                })  
                .test('no-start-end-hyphen', 'File name cannot start or end with a hyphen.', (value) => {  
                    return value && !(value.startsWith('-') || value.endsWith('-'));  
                })  
                .test('no-start-end-underscore', 'File name cannot start or end with an underscore.', (value) => {  
                    return value && !(value.startsWith('_') || value.endsWith('_'));  
                })  
                .test('no-spaces', 'Spaces are not allowed in file name.', (value) => {  
                    return value && !/\s/.test(value);  
                }),
    })
 
    useEffect(()=>{
      dispatch(getProjectsSlice());
    },[])
 
   
    const formik = useFormik({
      initialValues:{
          file_name:""
      },
      validationSchema:schema,
      onSubmit : (values)=>{
        handleRename();
      }
  })
 
    useEffect(() => {
        dispatch(getFileSlice())  
     }, []);
 
    const columns = [  
        {  
            title: 'Select',  
            dataIndex: 'selecteditem',  
            render: (text, record) =>   {
                return (<div style={{display:'flex',justifyContent:'center'}}>
                <Radio  
                    checked={selectedKey === record.file_name}  
                    onChange={() => handleRadioChange(record)}  
                />  
                </div>)
            }
             
        },  
        {  
            title: 'File Name',  
            dataIndex: 'file_name',  
            key: 'file_name',  
        },  
        {  
            title: 'File Type',  
            dataIndex: 'file_type',  
            key: 'file_type',  
        },  
        {  
            title: 'Sheet',  
            dataIndex: 'sheet',  
            key: 'sheet',  
        },  
        {  
            title: 'Table Name',  
            dataIndex: 'table_name',  
            key: 'table_name',  
            render: (text, record) => (
              <Link to={''} className='text-center'>{record.table_name}</Link>                  
          )
        }
    ];  
 
   
    useEffect(()=>{
      setAllProjects(projects);
  },[projects])
 
    const conns = []
 
   
    Array.isArray(file_connections?.data) && file_connections?.data.forEach((field,i)=>{
        conns.push({
         id: field.id,  
        file_type: field.fileType,  
        file_name: field.fileName,  
        table_name: field.tableName,  
        sheet: field.sheet,
        project_id : field.project_id
        })
    })
 
    const connectionsIterate =  conns?.map(field => ({  
        id: field.id,  
        file_type: field.file_type,  
        file_name: field.file_name, 
        table_name: field.table_name,  
        sheet: field.sheet,
        project_id : field.project_id
    }));  
   
   
   
    // Filter data based on search text  
    const filteredData =  connectionsIterate?.filter(item => (  
        item.file_name.toLowerCase().includes(searchText.toLowerCase() ) ||
        item.file_type.toLowerCase().includes(searchText.toLowerCase() ) ||
        item.table_name.toLowerCase().includes(searchText.toLowerCase() ) ||  
        item.sheet.toLowerCase().includes(searchText.toLowerCase() )  
    ));  

    const filterSelectOptions = filteredData?.filter(item => {  
        if (selectOption?.target?.value){  
            const selectedValue = Number(selectOption.target.value);  
            return item.project_id === selectedValue;  
        } else {  
            return false;
        }  
    });

    const handleProjectSelect = (e)=>{
        if(e.target.value !== ""){
            setSelectOption(e);
        }
    }
 
    const createFile = () => {
      setcreatef(true);
    }
 
    const handleOk = () => {
      setcreatef(false);
    }
       
   
   
    const handleFileDelete = ()=>{
        if(selectedRecord === null){
            if(alertActive){
                messageApi.info('Please Select a file')
                setAlertActive(false);
                setTimeout(()=>setAlertActive(true),3000);
                }
        }
       else{
           setOpen(true);
       }
    }
   
    const hideModal = () => {  
        setOpen(false);  
    };
 
    const handleDelete = ()=>{
        dispatch(deleteFileSlice(selectedRecord))
        .then((response)=>{
            if(response?.payload?.status === 200){
                messageApi.success(`${response?.payload?.data} has been deleted`)
                setSelectedRecord(null);
            }
            else{
                messageApi.error(`${response?.payload?.data} deletion failed`)
            }
        })

        setTimeout(()=>{
            dispatch(getFileSlice())
        },1000)

        hideModal(false);
    }  
 
   
    const handleFileRename = () => {  
        if(selectedRecord === null){
            if(alertActive){
                messageApi.info('Please Select a File')
                setAlertActive(false);
                setTimeout(()=>setAlertActive(true),3000);
                }
        }
        else{
        formik.values.file_name = selectedRecord?.file_name;
        setOpen2(true);
        }
    };  
 
 
    const hideModal2 = () => {  
        setOpen2(false);  
    };    
 
    const handleRename = ()=>{
        const rename_data = {
            re_val : formik.values.file_name,
            ...selectedRecord
        }
        dispatch(renameFileSlice(rename_data))
        .then((response)=>{
            if(response?.payload?.status === 200){
                messageApi.success(`${response?.payload?.data} is renamed`)
                setSelectedRecord(null);
            }
            else{
                messageApi.error(`${formik.values.file_name} failed to rename`)
            }
        })
        setTimeout(()=>{
            dispatch(getFileSlice())
        },1000)
        setSelectedKey('');
        hideModal2(false);
    }  
 
    return (  
      <>
        <div className="w-100">  
        {contextHolder}    
        <div className="container-fluid">  
            <div className="options_header" style={{ overflowX: "auto"}}>  
                    <label style={{ color: "skyblue", fontSize: "20px",marginRight:"10px" }}>Files</label>   
                    <select  
                        name="project_id"   
                        className='form-select'   
                        style={{ minWidth:"200px", maxWidth:"250px", padding: "3px", marginRight:"10px",maxHeight: "32px" }}   
                        onChange={handleProjectSelect}   
                    >  
                    <option value="" style={{ textAlign: "center" }}>Select Project</option>   
                        {allProjects && allProjects.map((option) => (  
                            <option key={option?.project_id} value={option?.project_id} style={{ textAlign: "center" }}>{option?.project_name}</option>  
                        ))}  
                    </select>
                    <Button onClick={createFile} style={{ fontSize: '14px', marginRight:"10px" }}>
                    Create
                </Button>   
                <Button onClick={handleFileDelete} style={{ fontSize: '14px', marginRight:"10px" }}>  
                    Delete  
                </Button>  
                <Button onClick={handleFileRename} style={{ fontSize: '14px', marginRight:"10px" }}>  
                    Rename  
                </Button>  

                <Input  
                placeholder="Search by File Name, File Type, Table Name, or Sheet"  
                value={searchText}  
                onChange={(e) => setSearchText(e.target.value)}  
                style={{ minWidth:"200px", maxWidth:"230px", marginRight:"10px" ,marginBottom:"1px",maxHeight: "32px"}}  
                className="search-input"  
                />  
                </div>
        </div>

            <Table  
                columns={columns}  
                dataSource={filterSelectOptions}
                pagination={{  
                    pageSize: 10,  
                }}
                style={{overflowX:"auto"}}  
            />  
                        <Modal
                              open = {createf}
                              footer = {null}
                              onCancel={handleOk}
                              hideModal = {handleOk}
                              >
                                <p><FormFile handleOk={handleOk}/></p>
                            </Modal>
 
            <CustomModel
              title={<>Delete { selectedRecord?.file_name !== undefined ?  <span style={{ color: "red",display:"inline" }}>"{` `} {selectedRecord?.file_name}{` `} "</span>:''} {` `}Connection</>}
              hideModal={hideModal}
              open={open}
              performAction = {handleDelete}
              onCancel={hideModal}
              okText="OK"
              cancelText="CANCEL"
            />
 
            <Modal
                title={<>Rename { selectedRecord?.file_name !== undefined ?  <span style={{ color: "red",display:"inline" }}>"{` `} {selectedRecord?.file_name}{` `} "</span>:''} {` `}Connection</>}
                open={open2}
                footer={null}
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
                            name="file_name"  
                            value={formik.values.file_name}
                            onChange={formik.handleChange('file_name')}  
                        />  
                         <div className="error">{formik.touched.file_name && formik.errors.file_name}</div>  
                         <div className="d-flex justify-content-end" style={{ marginTop: "10px" }}>  
                    <button type="submit" className="btn btn-primary">OK</button>
                    </div>
                    </form>  
            </Modal>
        </div>  
      </>
    );  
}  
 
export default FlatFile