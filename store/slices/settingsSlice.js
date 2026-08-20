import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vatPercent: 7.5,
  currency: "BDT",
  invoicePrefix: "INV-",
  printerFormat: "thermal_80mm", // thermal_80mm | a5 | a4
  branches: [
    { id: "br-1", name: "Dhanmondi", address: "House 7, Road 2, Dhanmondi, Dhaka" },
    { id: "br-2", name: "Gulshan", address: "Plot 14, Gulshan Avenue, Dhaka" },
    { id: "br-3", name: "Chattogram", address: "GEC Circle, Chattogram" },
  ],
  roles: [
    { id: "role-1", name: "Admin", access: "Full system access" },
    { id: "role-2", name: "Store Manager", access: "Branch operations, reports, approvals" },
    { id: "role-3", name: "Cashier", access: "POS billing, returns" },
    { id: "role-4", name: "Inventory Officer", access: "PO, GRN, stock transfer" },
  ],
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings(state, action) {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
