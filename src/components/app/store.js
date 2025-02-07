import { configureStore } from "@reduxjs/toolkit";
import connectionReducer from "../features/Connections/connectionSlice";
import projectReducer from "../features/Project/projectSlice";
import bussinesrulesReducer from '../features/BussinessRules/BussinessRulesSlice'

export const store = configureStore({
    reducer:{
        connection:connectionReducer,
        project : projectReducer,
        bussinessrules : bussinesrulesReducer
    }
})