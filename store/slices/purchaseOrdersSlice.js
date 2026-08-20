import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      id: "PO-1042",
      supplierId: "sup-001",
      supplierName: "Samsung Bangladesh Distribution Ltd.",
      date: "2026-08-10",
      status: "grn_pending", // draft | approved | grn_pending | received | closed
      lines: [
        { productId: "p-001", productName: "Samsung Galaxy S24", qty: 50, unitCost: 82000 },
      ],
    },
    {
      id: "PO-1041",
      supplierId: "sup-002",
      supplierName: "Sony Gallery BD",
      date: "2026-08-08",
      status: "received",
      lines: [
        { productId: "p-002", productName: "Sony Bravia X75K", qty: 20, unitCost: 63000 },
      ],
    },
    {
      id: "PO-1040",
      supplierId: "sup-003",
      supplierName: "Walton Hi-Tech Industries",
      date: "2026-08-02",
      status: "closed",
      lines: [
        { productId: "p-004", productName: "Walton WFA-2Q3", qty: 30, unitCost: 41000 },
      ],
    },
  ],
  grns: [
    {
      id: "GRN-0311",
      poId: "PO-1041",
      date: "2026-08-09",
      receivedBy: "Golam Rabbani (Storekeeper)",
      lines: [{ productId: "p-002", productName: "Sony Bravia X75K", qty: 20, serialsAdded: 20 }],
    },
  ],
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
