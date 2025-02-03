import axios from 'axios'
import { toast } from 'react-toastify';


const createProjectService = async(data)=>{
    console.log("varun  :",data);  
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/Pcreate/',data);
        return response;
    } catch (error) {
        return error
    }
}

const getProjectsService = async()=>{
    try {
        const response = await axios.get('http://127.0.0.1:8000/api/Pget/');
        console.log(response);
        return response;
    } catch (error) {
        return error
    }
}

const updateProjectService = async (data)=>{
    try {
        const response = await axios.put(`http://127.0.0.1:8000/api/PUpdate/${data.project_id}/`,data);
        return response;
    } catch (error) {
        return error
    }
}

const deleteProjectService = async (data)=>{
    try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/PDelete/${data.project_id}/`)
        return response;
    } catch (error) {
        return error
    }
}



export const projectServices = {
    createProjectService,
    getProjectsService,
    updateProjectService,
    deleteProjectService
}