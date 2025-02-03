import axios from 'axios'
import { toast } from 'react-toastify';



const checkConnectionService = async (data)=>{
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/sapconn/',data);
        return response;
    } catch (error) {
        return error?.response
    }
}

const checkHanaConnectionService = async (data)=>{
    console.log(data);
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/hanaconn/',data);
        return response;
    } catch (error) {
        return error?.response
    }
}
const getConnectionService = async ()=>{
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/Cget/');
        console.log(response);
        return response;
    } catch (error) {
        return error?.response
    }
}

const deleteConnectionService = async (data)=>{
    try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/Cdelete/${data?.project_id}/${data?.connection_name}/`);
        return response;
    } catch (error) {
        return error?.response
    }
}

const updateConnectionService = async (data)=>{
    try {
        const response = await axios.put(`http://127.0.0.1:8000/api/Cupdate/${data.project_id}/${data.connection_name}/`,data);
        return response;
    } catch (error) {
        return error?.response
    }
}

const renameConnectionService = async (data)=>{
    try {
        const response = await axios.put(`http://127.0.0.1:8000/api/Crename/${data?.re_val}/${data?.project_id}/${data?.connection_name}/`,data);
        return response;
    } catch (error) {
        return error?.response
    }
}

const saveConnectionService = async (data)=>{
    try {
        console.log(data);
        const response = await axios.post('http://127.0.0.1:8000/api/Ccreate/',data);
        return response;
    } catch (error) {
        return error?.response
    }
}

const singleGetConnectionService = async (data)=>{
    console.log(data);
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/CgetSingle/${data?.project_id}/${data?.connection_name}/`);
        return response;
    } catch (error) {
        return error?.response
    }
}

const connectionServices = {
    checkConnectionService,
    getConnectionService,
    deleteConnectionService,
    renameConnectionService,
    updateConnectionService,
    saveConnectionService,
    singleGetConnectionService,
    checkHanaConnectionService
}

export default connectionServices