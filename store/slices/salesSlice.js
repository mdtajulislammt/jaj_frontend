import { createSlice, nanoid } from "@reduxjs/toolkit";

import mockData from "@/data/mockData.json";

const initialState = {
  invoices: mockData.salesInvoices || [],
  dueBills: mockData.dueBills || [],
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    createInvoice: {
      reducer(state, action) {
        state.invoices.unshift(action.payload);
      },
      prepare(invoice) {
        return {
          payload: {
            id: `INV-${88232 + Math.floor(Math.random() * 500)}`,
            date: new Date().toISOString().slice(0, 10),
            ...invoice,
          },
        };
      },
    },
  },
});

export const { createInvoice } = salesSlice.actions;
export default salesSlice.reducer;
