import axios from 'axios'

export const createBussinessRulesService = async (formData)=>{
    console.log(formData);
    try {
         const response = await axios.post("http://127.0.0.1:8000/api/ObjCreate/", formData, {
             headers: {
                        'Content-Type': 'multipart/form-data'
                    }
        })
        return response;
     }
     catch(error){
        return error;
       };
}

export const updateBussinessRulesService = async (updateData)=>{

    console.log(updateData?.get('object_id'))
    try {
        const response = await axios.put(`http://127.0.0.1:8000/api/ObjUpdate/${updateData?.get('object_id')}/`,updateData,{
            headers:{
                'Content-Type' : 'multipart/form-data'
            }
        })
        return response;
    } catch (error) {
        return error;
    }
}


export const deleteBussinessRulesService = async (deleteData)=>{
    console.log(deleteData);
    try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/ObjDelete/${deleteData?.obj_id}/`, deleteData);
        return response;
    } catch (error) {
        return error;
    }
}

export const getSingleBussinessRulesService = async (getData)=>{
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/ObjGet/${getData?.obj_id}/`);
        return response;
    } catch (error) {
        return error;
    }
}

export const getBussinessRulesService = async (getData)=>{
    console.log(getData);
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/PdataObject/${getData?.project_id}/`);
        return response;
    } catch (error) {
        return error;
    }
}


export const uploadFileNameFetchService = async (formData)=>{
    console.log(formData);
    try {
        const response = await axios.post('http://127.0.0.1:8000/xls/',formData,{
            headers:{
                'Content-Type' : 'multipart/form-data'
            }
        })
        return response;
    } catch (error) {
        return error
    }
}

const BussinessRulesServices = {
    createBussinessRulesService,
    updateBussinessRulesService,
    deleteBussinessRulesService,
    getSingleBussinessRulesService,
    getBussinessRulesService,
    uploadFileNameFetchService
}

export default BussinessRulesServices;