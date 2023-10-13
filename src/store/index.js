import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./slices/uiSlice";

const store = configureStore({
    reducer: {
        ui: uiSlice.reducer, // Remove the quotes around 'ui'
    },
});

export default store; // Corrected 'dafault' to 'default'
