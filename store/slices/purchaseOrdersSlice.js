import { createSlice, nanoid } from "@reduxjs/toolkit";

import mockData from "@/data/mockData.json";

const initialState = {
  items: mockData.purchaseOrders || [],
  grns: mockData.grnNotes || [],
};

const purchaseOrdersSlice = createSlice({
  name: "purchaseOrders",
  initialState,
  reducers: {
    createPO: {
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
      prepare(po) {
        return {
          payload: {
            id: `PO-${1000 + Math.floor(Math.random() * 900)}`,
            status: "draft",
            date: new Date().toISOString().slice(0, 10),
            ...po,
          },
        };
      },
    },
    setPOStatus(state, action) {
      const { poId, status } = action.payload;
      const po = state.items.find((p) => p.id === poId);
      if (po) po.status = status;
    },
    createGRN: {
      reducer(state, action) {
        state.grns.unshift(action.payload);
        const po = state.items.find((p) => p.id === action.payload.poId);
        if (po) po.status = "received";
      },
      prepare(grn) {
        return { payload: { id: `GRN-${nanoid(4).toUpperCase()}`, date: new Date().toISOString().slice(0, 10), ...grn } };
      },
    },
  },
});

export const { createPO, setPOStatus, createGRN } = purchaseOrdersSlice.actions;
export default purchaseOrdersSlice.reducer;
