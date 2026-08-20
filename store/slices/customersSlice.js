import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      id: "cus-001",
      name: "Tanvir Ahmed",
      phone: "01711-556677",
      address: "House 12, Road 5, Dhanmondi, Dhaka",
      creditLimit: 20000,
      due: 8500,
      points: 240,
      totalPurchase: 186000,
    },
    {
      id: "cus-002",
      name: "Nusrat Jahan",
      phone: "01922-334455",
      address: "Flat 3B, Gulshan-2, Dhaka",
      creditLimit: 50000,
      due: 0,
      points: 610,
      totalPurchase: 452000,
    },
    {
      id: "cus-003",
      name: "Walk-in Customer",
      phone: "N/A",
      address: "-",
      creditLimit: 0,
      due: 0,
      points: 0,
      totalPurchase: 0,
    },
  ],
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    addCustomer: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(customer) {
        return {
          payload: {
            id: `cus-${nanoid(6)}`,
            due: 0,
            points: 0,
            totalPurchase: 0,
            creditLimit: 0,
            ...customer,
          },
        };
      },
    },
    adjustDue(state, action) {
      const { customerId, amount } = action.payload;
      const c = state.items.find((x) => x.id === customerId);
      if (c) c.due += amount;
    },
    settleDue(state, action) {
      const { customerId, amount } = action.payload;
      const c = state.items.find((x) => x.id === customerId);
      if (c) c.due = Math.max(0, c.due - amount);
    },
  },
});

export const { addCustomer, adjustDue, settleDue } = customersSlice.actions;
export default customersSlice.reducer;
