import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  categories: [
    { id: "cat-mobile", name: "Mobile", parent: "Electronics" },
    { id: "cat-laptop", name: "Laptop", parent: "Electronics" },
    { id: "cat-tv", name: "TV", parent: "Electronics" },
    { id: "cat-appliance", name: "Appliances", parent: "Electronics" },
  ],
  brands: ["Samsung", "Sony", "Apple", "Xiaomi", "Walton", "LG"],
  items: [
    {
      id: "p-001",
      name: "Samsung Galaxy S24",
      brand: "Samsung",
      categoryId: "cat-mobile",
      variant: "Black · 8GB/256GB",
      sku: "SGS24-BLK-256",
      barcode: "8801643921456",
      costPrice: 82000,
      sellPrice: 98000,
      warrantyMonths: 12,
      warrantyLabel: "1 Year Official",
      trackSerial: true,
      image: "📱",
      serials: [
        { imei: "356938035643809", status: "in_stock", branch: "Dhanmondi" },
        { imei: "356938035643810", status: "in_stock", branch: "Dhanmondi" },
        { imei: "356938035643811", status: "sold", branch: "Dhanmondi" },
        { imei: "356938035643812", status: "in_stock", branch: "Gulshan" },
      ],
    },
    {
      id: "p-002",
      name: "Sony Bravia X75K",
      brand: "Sony",
      categoryId: "cat-tv",
      variant: '55" · 4K UHD',
      sku: "SNY-BRV-55X75K",
      barcode: "4548736135702",
      costPrice: 63000,
      sellPrice: 79500,
      warrantyMonths: 24,
      warrantyLabel: "2 Years Service",
      trackSerial: true,
      image: "📺",
      serials: [
        { imei: "SN75K-004421", status: "in_stock", branch: "Dhanmondi" },
        { imei: "SN75K-004422", status: "in_stock", branch: "Dhanmondi" },
        { imei: "SN75K-004423", status: "damage", branch: "Dhanmondi" },
      ],
    },
    {
      id: "p-003",
      name: "Apple iPhone 15",
      brand: "Apple",
      categoryId: "cat-mobile",
      variant: "Blue · 128GB",
      sku: "IP15-BLU-128",
      barcode: "0195949038291",
      costPrice: 98000,
      sellPrice: 115000,
      warrantyMonths: 12,
      warrantyLabel: "1 Year Official",
      trackSerial: true,
      image: "📱",
      serials: [
        { imei: "356938099912345", status: "in_stock", branch: "Gulshan" },
        { imei: "356938099912346", status: "sold", branch: "Gulshan" },
      ],
    },
    {
      id: "p-004",
      name: "Walton WFA-2Q3",
      brand: "Walton",
      categoryId: "cat-appliance",
      variant: "1.5 Ton · Inverter AC",
      sku: "WAL-AC-1.5T",
      barcode: "8941234567890",
      costPrice: 41000,
      sellPrice: 52900,
      warrantyMonths: 36,
      warrantyLabel: "3 Years Compressor",
      trackSerial: true,
      image: "❄️",
      serials: [
        { imei: "WFA2Q3-11029", status: "in_stock", branch: "Dhanmondi" },
        { imei: "WFA2Q3-11030", status: "in_stock", branch: "Dhanmondi" },
      ],
    },
    {
      id: "p-005",
      name: "Xiaomi Redmi Note 13",
      brand: "Xiaomi",
      categoryId: "cat-mobile",
      variant: "Mint Green · 6GB/128GB",
      sku: "RN13-MG-128",
      barcode: "6941059654321",
      costPrice: 21500,
      sellPrice: 26990,
      warrantyMonths: 12,
      warrantyLabel: "1 Year Official",
      trackSerial: true,
      image: "📱",
      serials: [
        { imei: "869876054412201", status: "in_stock", branch: "Dhanmondi" },
        { imei: "869876054412202", status: "in_stock", branch: "Dhanmondi" },
        { imei: "869876054412203", status: "in_stock", branch: "Gulshan" },
        { imei: "869876054412204", status: "sold", branch: "Gulshan" },
      ],
    },
    {
      id: "p-006",
      name: "LG Gram 14",
      brand: "LG",
      categoryId: "cat-laptop",
      variant: "i5 · 16GB/512GB",
      sku: "LG-GRAM14-I5",
      barcode: "8806096543210",
      costPrice: 115000,
      sellPrice: 134500,
      warrantyMonths: 12,
      warrantyLabel: "1 Year Official",
      trackSerial: true,
      image: "💻",
      serials: [
        { imei: "LGGRM14-99021", status: "in_stock", branch: "Gulshan" },
      ],
    },
  ],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(product) {
        return { payload: { id: `p-${nanoid(6)}`, serials: [], ...product } };
      },
    },
    updateProduct(state, action) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload };
    },
    removeProduct(state, action) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    addSerials(state, action) {
      const { productId, serials } = action.payload; // serials: [{imei, branch}]
      const product = state.items.find((p) => p.id === productId);
      if (!product) return;
      serials.forEach((s) => {
        product.serials.push({ imei: s.imei, status: "in_stock", branch: s.branch });
      });
    },
    setSerialStatus(state, action) {
      const { productId, imei, status } = action.payload;
      const product = state.items.find((p) => p.id === productId);
      if (!product) return;
      const serial = product.serials.find((s) => s.imei === imei);
      if (serial) serial.status = status;
    },
  },
});

export const { addProduct, updateProduct, removeProduct, addSerials, setSerialStatus } =
  productsSlice.actions;
export default productsSlice.reducer;
