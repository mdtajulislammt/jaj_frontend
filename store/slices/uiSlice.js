import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarCollapsed: false,
  activeBranch: "Dhanmondi",
  branches: ["Dhanmondi", "Gulshan", "Chattogram"],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setBranch(state, action) {
      state.activeBranch = action.payload;
    },
  },
});

export const { toggleSidebar, setBranch } = uiSlice.actions;
export default uiSlice.reducer;
