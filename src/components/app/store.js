import { configureStore } from "@reduxjs/toolkit";
import connectionReducer from "../features/Connections/connectionSlice";
import projectReducer from "../features/Project/projectSlice";

export const store = configureStore({
    reducer:{
        connection:connectionReducer,
        project : projectReducer
    }
})