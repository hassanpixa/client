import { createSlice } from "@reduxjs/toolkit";
import defaultTemplates from "templates/defaultTemplates"
const intialStates = {
  templates: defaultTemplates,
  templateId: null,
  btnClicked: false
};
export const templateSlice = createSlice({
  name: "templates",
  initialState: intialStates,
  reducers: {
    addTemplates: (state, action) => {
      // console.log(action.payload)
      const id = action.payload.id;
      const existingItem = state.templates.find((temp) => temp.id === id);
      if (existingItem) {
        existingItem.id = action.payload.id;
        existingItem.json = action.payload.json;
        existingItem.prev = action.payload.prev;
      } else {
        state.templates.push(action.payload);
      }
    },
    removeTemplates: (state, action) => {
      const id = action.payload;
      state.templates = state.templates.filter((tem) => tem.id !== id);
      // state.templates.push(action.payload)
    },
    updateTemplates: (state, action) => {
      const id = action.payload.id;
      const updatedJson = action.payload.json;
      const updatedPrev = action.payload.prev;

      // Find the template with the matching id
      const templateToUpdate = state.templates.find((temp) => temp.id === id);

      if (templateToUpdate) {
        // Update the JSON for the matching template
        templateToUpdate.json = updatedJson;
        templateToUpdate.prev = updatedPrev;
      }
    },
    addId: (state, action) => {
      state.templateId = action.payload;
    },
    btnStateHandlder: (state,action) => {
      state.btnClicked = action.payload;
    },
  },
});
export const { addTemplates, addId, removeTemplates, updateTemplates,btnStateHandlder } =
  templateSlice.actions;
export default templateSlice.reducer;
