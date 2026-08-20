import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  salesReturns: [
    {
      id: "SR-2201",
      date: "2026-08-15",
      invoiceId: "INV-88104",
      productName: "Sony Bravia X75K",
      imei: "SN75K-004423",
      reason: "Display fault after 3 days",
      action: "replace", // replace | refund
      status: "sent_to_damage",
    },
  ],
  rtvChallans: [
    {
      id: "RTV-0071",
      date: "2026-08-16",
      supplierId: "sup-002",
      supplierName: "Sony Gallery BD",
      items: [{ productName: "Sony Bravia X75K", imei: "SN75K-004423", reason: "Display fault" }],
      status: "sent",
    },
  ],
};

const returnsSlice = createSlice({
  name: "returns",
  initialState,
  reducers: {
    addSalesReturn: {
      reducer(state, action) {
        state.salesReturns.unshift(action.payload);
      },
      prepare(ret) {
        return { payload: { id: `SR-${nanoid(4).toUpperCase()}`, date: new Date().toISOString().slice(0, 10), status: "sent_to_damage", ...ret } };
      },
    },
    addRTV: {
      reducer(state, action) {
        state.rtvChallans.unshift(action.payload);
      },
      prepare(rtv) {
        return { payload: { id: `RTV-${nanoid(4).toUpperCase()}`, date: new Date().toISOString().slice(0, 10), status: "sent", ...rtv } };
      },
    },
  },
});

export const { addSalesReturn, addRTV } = returnsSlice.actions;
export default returnsSlice.reducer;
