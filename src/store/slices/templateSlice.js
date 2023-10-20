import { createSlice } from "@reduxjs/toolkit";
const intialStates={
  templates:[],
  templateId:null
}
export const templateSlice=createSlice({
    name:"templates",
    initialState:intialStates,
    reducers:{
        addTemplates:(state,action)=>{
            state.templates.push(action.payload)
        },
        addId:(state,action)=>{
            state.templateId = action.payload
        }
    }
})
export const {addTemplates,addId}=templateSlice.actions;
export default templateSlice.reducer;