import { configureStore } from "@reduxjs/toolkit";
import connectionReducer from "../features/Connections/connectionSlice";
import projectReducer from "../features/Project/projectSlice";
import bussinesrulesReducer from '../features/BussinessRules/BussinessRulesSlice'
import fileReducer from '../features/Connections/fileSlice'

export const store = configureStore({
    reducer:{
        connection:connectionReducer,
        project : projectReducer,
        bussinessrules : bussinesrulesReducer,
        file : fileReducer
    }
})