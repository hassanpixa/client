import { createSlice } from "@reduxjs/toolkit";
const intialStates={
  templates:[]
}
export const templateSlice=createSlice({
    name:"templates",
    initialState:intialStates,
    reducers:{
        addTemplates:(state,action)=>{
            state.templates.push(action.payload)
        }
    }
})
export const {addTemplates}=templateSlice.actions;
export default templateSlice.reducer;