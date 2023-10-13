import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    addQr: false,
    showPopUp: false,
    popUpImg:null,
  },
  reducers: {
    qrHandler: (state) => {
      state.addQr = true;
    },
    showPopUpHandler: (state) => {
      state.showPopUp = true;
    },
    hidePopUpHandler: (state) => {
      state.showPopUp = false;
    },
    popUpImgHandler:(state,action)=>{
      state.popUpImg=action.payload;
    }
  },
});

export const { qrHandler, showPopUpHandler, hidePopUpHandler,popUpImgHandler } =
  uiSlice.actions;
export default uiSlice.reducer;
