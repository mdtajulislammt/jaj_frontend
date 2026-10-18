import { createSlice, nanoid } from "@reduxjs/toolkit";

import mockData from "@/data/mockData.json";

const initialState = {
  salesReturns: mockData.salesReturns || [],
  rtvChallans: mockData.rtvChallans || [],
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
