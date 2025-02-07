import {createSlice,createAsyncThunk,createAction} from '@reduxjs/toolkit'
import BussinessRulesServices from './BussinessRulesService'
import { toast } from 'react-toastify'

const initialState = {
    isError: false,
    isSuccess : false,
    isLoading : false,
    rules:[]
}

export const createBussinessRulesSlice = createAsyncThunk('bussinessrules/create',async (formData,thunkAPI)=>{
    try {
        return await BussinessRulesServices.createBussinessRulesService(formData);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const updateBussinessRulesSlice = createAsyncThunk('bussiness/update',async(updateData,thunkAPI)=>{
    try {
        return await BussinessRulesServices.updateBussinessRulesService(updateData);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const deleteBussinessRulesSlice = createAsyncThunk('bussiness/delete',async(deleteData,thunkAPI)=>{
    try {
        return await BussinessRulesServices.deleteBussinessRulesService(deleteData);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const getSingleBussinessRulesSlice = createAsyncThunk('bussiness/getsingle', async(getData,thunkAPI)=>{
    try {
        return await BussinessRulesServices.getSingleBussinessRulesService(getData);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const getBussinessRulesSlice = createAsyncThunk('bussiness/get', async(getData,thunkAPI)=>{
    console.log(getData);
    try {
        return await BussinessRulesServices.getBussinessRulesService(getData);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

export const uploadFileNameFetchSlice = createAsyncThunk('bussiness/filenamefetch',async(formData,thunkAPI)=>{
    try {
        return await BussinessRulesServices.uploadFileNameFetchService(formData);
    } catch (error) {
        return thunkAPI.rejectWithValue(error);
    }
})

const BussinesRulesSlice = createSlice({
    name:'Bussiness_rules',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(createBussinessRulesSlice.pending,(state)=>{
            state.isSuccess = false;
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(createBussinessRulesSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            console.log(action?.payload);
        })
        .addCase(createBussinessRulesSlice.rejected,(state)=>{
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
        })
        
        builder.addCase(updateBussinessRulesSlice.pending,(state)=>{
            state.isSuccess = false;
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(updateBussinessRulesSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            console.log(action?.payload);
        })
        .addCase(updateBussinessRulesSlice.rejected,(state)=>{
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
        })

        
        builder.addCase(deleteBussinessRulesSlice.pending,(state)=>{
            state.isSuccess = false;
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(deleteBussinessRulesSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            console.log(action?.payload);
        })
        .addCase(deleteBussinessRulesSlice.rejected,(state)=>{
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
        })

        builder.addCase(getSingleBussinessRulesSlice.pending,(state)=>{
            state.isSuccess = false;
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(getSingleBussinessRulesSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            console.log(action?.payload);
        })
        .addCase(getSingleBussinessRulesSlice.rejected,(state)=>{
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
        })

        builder.addCase(getBussinessRulesSlice.pending,(state)=>{
            state.isSuccess = false;
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(getBussinessRulesSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            state.rules = action?.payload?.data;
        })
        .addCase(getBussinessRulesSlice.rejected,(state)=>{
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
        })

        builder.addCase(uploadFileNameFetchSlice.pending,(state)=>{
            state.isSuccess = false;
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(uploadFileNameFetchSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = true;
            console.log(action?.payload);
        })
        .addCase(uploadFileNameFetchSlice.rejected,(state)=>{
            state.isError = true;
            state.isLoading = false;
            state.isSuccess = false;
        })

    } 
})

export default BussinesRulesSlice.reducer;