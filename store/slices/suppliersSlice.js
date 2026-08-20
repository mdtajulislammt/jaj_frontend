import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      id: "sup-001",
      name: "Samsung Bangladesh Distribution Ltd.",
      contact: "Rafiqul Islam",
      phone: "01711-223344",
      email: "sales@samsungbd-dist.com",
      payable: 460000,
      totalPurchase: 3820000,
    },
    {
      id: "sup-002",
      name: "Sony Gallery BD",
      contact: "Farhana Akter",
      phone: "01822-556677",
      email: "b2b@sonygallerybd.com",
      payable: 126000,
      totalPurchase: 1590000,
    },
    {
      id: "sup-003",
      name: "Walton Hi-Tech Industries",
      contact: "Shahriar Kabir",
      phone: "01911-889900",
      email: "corporate@walton.com.bd",
      payable: 0,
      totalPurchase: 2140000,
    },
  ],
};

const suppliersSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    addSupplier: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(supplier) {
        return { payload: { id: `sup-${nanoid(6)}`, payable: 0, totalPurchase: 0, ...supplier } };
      },
    },
    adjustPayable(state, action) {
      const { supplierId, amount } = action.payload;
      const s = state.items.find((x) => x.id === supplierId);
      if (s) s.payable += amount;
    },
  },
});

export const { addSupplier, adjustPayable } = suppliersSlice.actions;
export default suppliersSlice.reducer;
