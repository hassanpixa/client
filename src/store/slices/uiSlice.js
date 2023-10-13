import { createSlice } from '@reduxjs/toolkit';
const initialStates={
    addQr:0,
    showPopUp:false,

}
const uiSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    qrHandler:(state)=>{
        state.addQr+=state.addQr;
    },
    showPopUpHandler: (state) =>{
            state.showPopUp=true
    },
    hidePopUpHandler: (state) =>{
        state.showPopUp=false
},
  },
});

export const { qrHandler, showPopUpHandler, hidePopUpHandler} = uiSlice.actions;
export default uiSlice.reducer;