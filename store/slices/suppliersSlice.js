import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      id: "sup-001",
      company: "Samsung Bangladesh Distribution Ltd.",
      name: "Rafiqul Islam",
      contact: "Rafiqul Islam",
      phone: "+880 1711-223344",
      altPhone: "811881",
      email: "sales@samsungbd-dist.com",
      status: "Active",
      address: "Plot #14, Road #03, Gulshan-1, Dhaka-1212",
      payable: 460000,
      totalPurchase: 3820000,
      products: [
        { id: "sp-1", ean: "8801643921456", name: "Samsung Galaxy S24", code: "SGS24-BLK-256", unit: "Pcs" },
        { id: "sp-2", ean: "8801643921490", name: "Samsung Galaxy Buds Pro 2", code: "SGB-PR2-WHT", unit: "Pcs" },
      ],
    },
    {
      id: "sup-002",
      company: "Sony Electronics Gallery BD",
      name: "Farhana Akter",
      contact: "Farhana Akter",
      phone: "+880 1822-556677",
      altPhone: "811902",
      email: "b2b@sonygallerybd.com",
      status: "Active",
      address: "Bashundhara City Level 5, Panthapath, Dhaka",
      payable: 126000,
      totalPurchase: 1590000,
      products: [
        { id: "sp-3", ean: "4548736135702", name: "Sony Bravia X75K 55\"", code: "SNY-BRV-55X75K", unit: "Pcs" },
      ],
    },
    {
      id: "sup-003",
      company: "Walton Hi-Tech Industries PLC",
      name: "Shahriar Kabir",
      contact: "Shahriar Kabir",
      phone: "+880 1911-889900",
      altPhone: "811950",
      email: "corporate@walton.com.bd",
      status: "Active",
      address: "Chandra, Gazipur, Dhaka",
      payable: 0,
      totalPurchase: 2140000,
      products: [
        { id: "sp-4", ean: "8941234567890", name: "Walton Inverter AC 1.5T", code: "WAL-AC-1.5T", unit: "Pcs" },
      ],
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
