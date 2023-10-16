import { configureStore } from "@reduxjs/toolkit";
import uiSlice from "./slices/uiSlice";
import templateSlice from "./slices/templateSlice";

const store = configureStore({
    reducer: {
        ui: uiSlice,
        templates:templateSlice,
    },
});

export default store;
