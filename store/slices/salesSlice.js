import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  invoices: [
    {
      id: "INV-88231",
      date: "2026-08-18",
      customerId: "cus-001",
      customerName: "Tanvir Ahmed",
      channel: "pos",
      items: [{ productId: "p-005", name: "Xiaomi Redmi Note 13", imei: "869876054412204", qty: 1, price: 26990 }],
      subtotal: 26990,
      discount: 0,
      total: 26990,
      paid: { cash: 18490, card: 0, mfs: 0, due: 8500 },
      status: "partial_due",
    },
    {
      id: "INV-88230",
      date: "2026-08-17",
      customerId: "cus-002",
      customerName: "Nusrat Jahan",
      channel: "pos",
      items: [{ productId: "p-003", name: "Apple iPhone 15", imei: "356938099912346", qty: 1, price: 115000 }],
      subtotal: 115000,
      discount: 2000,
      total: 113000,
      paid: { cash: 0, card: 113000, mfs: 0, due: 0 },
      status: "paid",
    },
    {
      id: "INV-88229",
      date: "2026-08-16",
      customerId: "cus-003",
      customerName: "Walk-in Customer",
      channel: "ecom",
      items: [{ productId: "p-001", name: "Samsung Galaxy S24", imei: "356938035643811", qty: 1, price: 98000 }],
      subtotal: 98000,
      discount: 0,
      total: 98000,
      paid: { cash: 0, card: 0, mfs: 98000, due: 0 },
      status: "paid",
    },
  ],
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
