import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    addQr: 0,
    showPopUp: false,
  },
  reducers: {
    qrHandler: (state) => {
      state.addQr += state.addQr;
    },
    showPopUpHandler: (state) => {
      state.showPopUp = true;
    },
    hidePopUpHandler: (state) => {
      state.showPopUp = false;
    },
  },
});

export const { qrHandler, showPopUpHandler, hidePopUpHandler } =
  uiSlice.actions;
export default uiSlice.reducer;
