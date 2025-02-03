import { createSlice, createAsyncThunk,createAction } from "@reduxjs/toolkit";
import connectionServices from "./connectionService";
import { toast } from "react-toastify";

const initialState ={
    isError:false,
    isSucess:false,
    isPending:false,
    connectionStatus:'',
    connectionHanaStatus:'',
    connections : [],
    singleConnection:''
}

export const checkConnectionSlice = createAsyncThunk('connection/checkconnection',async (data,thunkAPI)=>{
    try {
        return await connectionServices.checkConnectionService(data);
    } catch (error) {
        thunkAPI.rejectWithValue(error);
    }
})

export const checkHanaConnectionSlice = createAsyncThunk('connection/checkhanaconnection',async (data,thunkAPI)=>{
    try {
        console.log(data);
        return await connectionServices.checkHanaConnectionService(data);
    } catch (error) {
        thunkAPI.rejectWithValue(error);
    }
})

export const getConnectionSlice = createAsyncThunk('connection/getconnection',async (thunkAPI)=>{
    try {
        console.log("alertthis")
        return await connectionServices.getConnectionService();
    } catch (error) {
        thunkAPI.rejectWithValue(error);
    }
})

export const deleteConnectionSlice = createAsyncThunk('connection/deleteconnection',async (data,thunkAPI)=>{
    try {
        return await connectionServices.deleteConnectionService(data);
    } catch (error) {
        thunkAPI.rejectWithValue(error);
    }
})

export const updateConnectionSlice = createAsyncThunk('connection/updateconnection',async (data,thunkAPI)=>{
    try {
        return await connectionServices.updateConnectionService(data);
    } catch (error) {
        thunkAPI.rejectWithValue(error);
    }
})

export const renameConnectionSlice = createAsyncThunk('connection/renameconnection',async (data,thunkAPI)=>{
    try {
        console.log(data);
        return await connectionServices.renameConnectionService(data);
    } catch (error) {
        thunkAPI.rejectWithValue(error);
    }
})

export const saveConnectionSlice = createAsyncThunk('connection/saveconnection',async (data,thunkAPI)=>{
    try {
        console.log(data);
        return await connectionServices.saveConnectionService(data);
    } catch (error) {
        thunkAPI.rejectWithValue(error);
    }
})

export const singleGetConnectionSlice = createAsyncThunk('connection/singlegetconnection',async (data,thunkAPI)=>{
    try {
        console.log(data);
        return await connectionServices.singleGetConnectionService(data);
    } catch (error) {
        thunkAPI.rejectWithValue(error);
    }
})




export const resetState = createAction("Reset_all")

const connectionSlice = createSlice({
    name:"connection",
    initialState:initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(checkConnectionSlice.pending,(state)=>{
            state.isError = false;
            state.isPending = true;
            state.isSucess = false;
        }).addCase(checkConnectionSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isSucess = true;
            state.isPending = false;            
            state.connectionStatus = action.payload?.status;
        }).addCase(checkConnectionSlice.rejected,(state)=>{
            state.isError = true;
            state.isPending = false;
            state.isSucess = false;
        })

        builder.addCase(checkHanaConnectionSlice.pending,(state)=>{
            state.isError = false;
            state.isPending = true;
            state.isSucess = false;
        }).addCase(checkHanaConnectionSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isSucess = true;
            state.isPending = false;
            state.connectionHanaStatus = action.payload;
        }).addCase(checkHanaConnectionSlice.rejected,(state)=>{
            state.isError = true;
            state.isPending = false;
            state.isSucess = false;
        })

        builder.addCase(getConnectionSlice.pending,(state)=>{
            state.isError = false;
            state.isPending = true;
            state.isSucess = false;
        }).addCase(getConnectionSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isSucess = true;
            state.isPending = false;

            state.connections = action?.payload;
        }).addCase(getConnectionSlice.rejected,(state)=>{
            state.isError = true;
            state.isPending = false;
            state.isSucess = false;
        })

        builder.addCase(deleteConnectionSlice.pending,(state)=>{
            state.isError = false;
            state.isPending = true;
            state.isSucess = false;
        }).addCase(deleteConnectionSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isSucess = true;
            state.isPending = false;                
        }).addCase(deleteConnectionSlice.rejected,(state)=>{
            state.isError = true;
            state.isPending = false;
            state.isSucess = false;
            toast.error("Deletion Failed")
        })

        builder.addCase(renameConnectionSlice.pending,(state)=>{
            state.isError = false;
            state.isPending = true;
            state.isSucess = false;
        }).addCase(renameConnectionSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isSucess = true;
            state.isPending = false;
            if(action?.payload?.status === 404){
                toast.info(`${action?.payload?.data} is Already Exists`);
            }
            else if(action?.payload?.status === 202){
                toast.success(`${action?.payload?.data} Connection Renamed`);
            }
            else{
                toast.error('Rename Failed');
            }

        }).addCase(renameConnectionSlice.rejected,(state)=>{
            state.isError = true;
            state.isPending = false;
            state.isSucess = false;
        })

        builder.addCase(updateConnectionSlice.pending,(state)=>{
            state.isError = false;
            state.isPending = true;
            state.isSucess = false;
        }).addCase(updateConnectionSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isSucess = true;
            state.isPending = false;
        }).addCase(updateConnectionSlice.rejected,(state)=>{
            state.isError = true;
            state.isPending = false;
            state.isSucess = false;
        })

        builder.addCase(saveConnectionSlice.pending,(state)=>{
            state.isError = false;
            state.isPending = true;
            state.isSucess = false;
        }).addCase(saveConnectionSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isSucess = true;
            state.isPending = false;
        }).addCase(saveConnectionSlice.rejected,(state)=>{
            state.isError = true;
            state.isPending = false;
            state.isSucess = false;
        })

        builder.addCase(singleGetConnectionSlice.pending,(state)=>{
            state.isError = false;
            state.isPending = true;
            state.isSucess = false;
        }).addCase(singleGetConnectionSlice.fulfilled,(state,action)=>{
            state.isError = false;
            state.isSucess = true;
            state.isPending = false;
            state.singleConnection = action?.payload;
        }).addCase(singleGetConnectionSlice.rejected,(state)=>{
            state.isError = true;
            state.isPending = false;
            state.isSucess = false;
            toast.error('Fectch Connection Failed')
        })
    }
})

export default connectionSlice.reducer