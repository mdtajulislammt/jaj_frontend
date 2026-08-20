import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  lines: [], // { key, productId, name, group, stock, price, qty, vat, discountPct, noOfBox }
  customerId: "cus-003",
  discount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addLine(state, action) {
      const line = action.payload;
      // For IMEI-tracked items, prevent duplicate IMEI
      if (line.imei) {
        const exists = state.lines.find((l) => l.imei === line.imei);
        if (exists) return;
      }
      state.lines.push({ qty: 1, vat: 0, discountPct: 0, noOfBox: 0, ...line });
    },
    removeLine(state, action) {
      state.lines = state.lines.filter((l) => l.key !== action.payload);
    },
    setQty(state, action) {
      const { key, qty } = action.payload;
      const line = state.lines.find((l) => l.key === key);
      if (line) line.qty = Math.max(1, qty);
    },
    updateLine(state, action) {
      const { key, field, value } = action.payload;
      const line = state.lines.find((l) => l.key === key);
      if (line) line[field] = value;
    },
    setCustomer(state, action) {
      state.customerId = action.payload;
    },
    setDiscount(state, action) {
      state.discount = Math.max(0, action.payload || 0);
    },
    clearCart(state) {
      state.lines = [];
      state.discount = 0;
      state.customerId = "cus-003";
    },
  },
});

export const { addLine, removeLine, setQty, updateLine, setCustomer, setDiscount, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
