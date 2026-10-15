"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Trash2,
  Upload,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  X,
  List,
  ShoppingCart,
  Search,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import { createPO } from "@/store/slices/purchaseOrdersSlice";
import { money } from "@/lib/format";

export default function PurchaseOrdersPage() {
  const dispatch = useDispatch();
  const suppliers = useSelector((s) => s.suppliers.items);
  const products = useSelector((s) => s.products.items);
  const existingPOs = useSelector((s) => s.purchaseOrders.items);

  const [activeTab, setActiveTab] = useState("create"); // "create" | "history"

  // Form states matching Screenshot 5
  const [selectedWarehouse, setSelectedWarehouse] = useState(
    "Hasib Mart - [ House#06, Road#27, Sector#07, Uttara ]"
  );
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState("Pending");
  const [supplierSearch, setSupplierSearch] = useState("");

  const [cart, setCart] = useState([]);
  const [tax, setTax] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [shippingCost, setShippingCost] = useState("0");
  const [note, setNote] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filter supplier products
  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId);
  const availableProducts = products.filter((p) => {
    if (!selectedSupplierId) return true;
    const matchesSupplier =
      !selectedSupplier ||
      p.brand?.toLowerCase() === selectedSupplier.name?.toLowerCase() ||
      p.name?.toLowerCase().includes(selectedSupplier.name?.toLowerCase().split(" ")[0]);
    const matchesSearch =
      p.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(supplierSearch.toLowerCase());
    return matchesSupplier && matchesSearch;
  });

  const addToCart = (prod) => {
    const existing = cart.find((item) => item.id === prod.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === prod.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: prod.id,
          code: prod.sku,
          name: prod.name,
          stock: prod.serials?.filter((s) => s.status === "in_stock").length || 10,
          qty: 1,
          tp: prod.costPrice || 25000,
        },
      ]);
    }
  };

  const updateQty = (id, newQty) => {
    const q = Math.max(1, Number(newQty) || 1);
    setCart(cart.map((item) => (item.id === id ? { ...item, qty: q } : item)));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const resetCart = () => {
    setCart([]);
    setTax("0");
    setDiscount("0");
    setShippingCost("0");
    setNote("");
  };

  // Calculations
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const orderTotal = cart.reduce((s, i) => s + i.qty * i.tp, 0);
  const numTax = Number(tax) || 0;
  const numDiscount = Number(discount) || 0;
  const numShipping = Number(shippingCost) || 0;
  const grandTotal = Math.max(0, orderTotal + numTax + numShipping - numDiscount);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSupplierId) {
      alert("Please select a supplier first!");
      return;
    }
    if (cart.length === 0) {
      alert("Please add at least one product to the purchase cart!");
      return;
    }

    const payload = {
      supplierId: selectedSupplierId,
      supplierName: selectedSupplier?.name || "Selected Supplier",
      warehouse: selectedWarehouse,
      status: purchaseStatus.toLowerCase(),
      lines: cart.map((i) => ({
        productId: i.id,
        productName: i.name,
        qty: i.qty,
        unitCost: i.tp,
      })),
      tax: numTax,
      discount: numDiscount,
      shippingCost: numShipping,
      total: grandTotal,
      note,
    };

    dispatch(createPO(payload));
    setSuccessMsg(`Purchase Order for ${selectedSupplier?.name} successfully created!`);
    resetCart();
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Create New Purchase
          </h1>
          <p className="text-slate-500 text-[13px] mt-0.5">
            Procurement requisition and stock purchase order generation
          </p>
        </div>

        {/* Tab Toggle: Create vs History */}
        <div className="flex items-center gap-1.5 p-1 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-bold transition-all ${
              activeTab === "create"
                ? "bg-[#64BD0B] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            + Create New Purchase
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-bold transition-all ${
              activeTab === "history"
                ? "bg-[#64BD0B] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <List size={14} className="inline mr-1" /> Purchase History ({existingPOs.length})
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-[#64BD0B]/15 border border-[#64BD0B]/30 text-[#2C6004] px-4 py-3 rounded-xl flex items-center gap-2 font-semibold text-[13px] animate-in fade-in">
          <CheckCircle2 size={17} /> {successMsg}
        </div>
      )}

      {/* ━━ CREATE NEW PURCHASE VIEW (Exact Screenshot 5 layout) ━━ */}
      {activeTab === "create" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Top Row: Warehouse & Supplier */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/80 backdrop-blur-xl p-4 md:p-5 rounded-2xl border border-white/90 shadow-sm">
            <div>
              <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                Warehouse
              </label>
              <select
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
              >
                <option value="Hasib Mart - [ House#06, Road#27, Sector#07, Uttara ]">
                  Hasib Mart - [ House#06, Road#27, Sector#07, Uttara ]
                </option>
                <option value="Dhanmondi Flagship Store">Dhanmondi Flagship Store</option>
                <option value="Central Warehouse Hub">Central Warehouse Hub</option>
                <option value="Mirpur Depot">Mirpur Depot</option>
              </select>
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                Supplier *
              </label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.contact})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Second Row: Purchase Status & Import Product */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/80 backdrop-blur-xl p-4 md:p-5 rounded-2xl border border-white/90 shadow-sm">
            <div>
              <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                Purchase Status
              </label>
              <select
                value={purchaseStatus}
                onChange={(e) => setPurchaseStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Received">Received</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12.5px] font-semibold text-slate-700">Import Product</label>
                <a
                  href="#sample"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Downloading sample CSV template: SKU, Name, Quantity, TradePrice");
                  }}
                  className="text-[11px] font-bold text-slate-500 hover:text-[#3B7506] border border-slate-200 px-2 py-0.5 rounded"
                >
                  Download Sample CSV
                </a>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden px-3 py-1.5">
                  <span className="bg-slate-800 text-white text-[11px] font-bold px-2 py-1 rounded mr-2">
                    Browse Csv
                  </span>
                  <span className="text-[12px] text-slate-400 truncate">No File Selected</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert("CSV Import: Select a CSV file to bulk import products.")}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[12.5px] px-4 py-2 rounded-xl shadow-sm transition-all"
                >
                  <Upload size={14} /> Import Product
                </button>
              </div>
            </div>
          </div>

          {/* Middle Two-Column Product Picker Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Supplier Products List */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-sm overflow-hidden flex flex-col">
              <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/70">
                <p className="text-[13px] font-bold text-slate-800 mb-2">Supplier Products List</p>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Product…"
                    value={supplierSearch}
                    onChange={(e) => setSupplierSearch(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-[12.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto overflow-y-auto max-h-[300px] scrollbar-thin">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/50 border-b border-slate-200">
                      <th className="px-3.5 py-2 font-semibold">Code</th>
                      <th className="px-3.5 py-2 font-semibold">Name</th>
                      <th className="px-3.5 py-2 font-semibold text-center">Stock</th>
                      <th className="px-3.5 py-2 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {!selectedSupplierId ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-12 text-center text-slate-400 font-medium">
                          Please select a supplier to view products
                        </td>
                      </tr>
                    ) : availableProducts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                          No matching products found.
                        </td>
                      </tr>
                    ) : (
                      availableProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                          <td className="px-3.5 py-2.5 font-mono text-[11.5px] text-slate-600">
                            {p.sku}
                          </td>
                          <td className="px-3.5 py-2.5 font-semibold text-slate-800 truncate max-w-[170px]">
                            {p.name}
                          </td>
                          <td className="px-3.5 py-2.5 text-center font-bold text-slate-700">
                            {p.serials?.filter((s) => s.status === "in_stock").length || 10}
                          </td>
                          <td className="px-3.5 py-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => addToCart(p)}
                              className="px-2.5 py-1 rounded-lg text-[11.5px] font-bold bg-[#64BD0B] text-white hover:bg-[#529E08] transition-all shadow-sm"
                            >
                              + Add
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Purchase Products List (Cart) */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-sm overflow-hidden flex flex-col">
              <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
                <p className="text-[13px] font-bold text-slate-800">Purchase Products List</p>
                <span className="text-[11.5px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2 py-0.5 rounded-full">
                  {cart.length} in cart
                </span>
              </div>

              <div className="overflow-x-auto overflow-y-auto max-h-[300px] scrollbar-thin">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/50 border-b border-slate-200">
                      <th className="px-3 py-2 font-semibold">#</th>
                      <th className="px-3 py-2 font-semibold">Name</th>
                      <th className="px-3 py-2 font-semibold text-center">Quantity</th>
                      <th className="px-3 py-2 font-semibold text-right">TP (৳)</th>
                      <th className="px-3 py-2 font-semibold text-right">Total</th>
                      <th className="px-3 py-2 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cart.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-slate-400 font-medium">
                          No products added to purchase list yet.
                        </td>
                      </tr>
                    ) : (
                      cart.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-2 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                          <td className="px-3 py-2 font-bold text-slate-900 truncate max-w-[140px]">
                            {item.name}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <input
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={(e) => updateQty(item.id, e.target.value)}
                              className="w-14 text-center bg-white border border-slate-200 rounded px-1 py-0.5 font-bold text-slate-800 text-[12px]"
                            />
                          </td>
                          <td className="px-3 py-2 text-right font-mono text-slate-700">
                            {money(item.tp)}
                          </td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-[#3B7506]">
                            {money(item.qty * item.tp)}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-slate-400 hover:text-rose-500 p-1 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Lower Form Fields: Tax, Discount, Shipping Cost & Note */}
          <div className="bg-white/80 backdrop-blur-xl p-4 md:p-5 rounded-2xl border border-white/90 shadow-sm space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Tax</label>
                <input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Discount</label>
                <input
                  type="number"
                  placeholder="Discount"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Shipping Cost</label>
                <input
                  type="number"
                  placeholder="Shipping Cost"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">Note</label>
              <textarea
                rows={2}
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
              />
            </div>
          </div>

          {/* Bottom Live Summary Bar (Screenshot 5 exact style) */}
          <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-[12.5px] font-medium text-slate-700">
            <div>Items: <span className="font-bold text-slate-900">{totalItems}</span></div>
            <div>Total Tax: <span className="font-bold text-slate-900">{money(numTax)}</span></div>
            <div>Order Total: <span className="font-bold text-slate-900">{money(orderTotal)}</span></div>
            <div>Order Discount: <span className="font-bold text-slate-900">{money(numDiscount)}</span></div>
            <div>Shipping Cost: <span className="font-bold text-slate-900">{money(numShipping)}</span></div>
            <div className="text-[14px] font-extrabold text-[#3B7506]">
              Grand Total: <span className="font-mono">{money(grandTotal)}</span>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={resetCart}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-[13px] px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              Reset Cart
            </button>
            <button
              type="submit"
              className="bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold text-[13px] px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              Submit Purchase
            </button>
          </div>
        </form>
      ) : (
        /* History / List Table View */
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-sm overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">PO Number</th>
                <th className="px-6 py-3.5 font-semibold">Supplier</th>
                <th className="px-6 py-3.5 font-semibold">Warehouse</th>
                <th className="px-6 py-3.5 font-semibold text-center">Items Qty</th>
                <th className="px-6 py-3.5 font-semibold text-right">Grand Total</th>
                <th className="px-6 py-3.5 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {existingPOs.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-[#3B7506]">{p.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{p.supplierName}</td>
                  <td className="px-6 py-4 text-slate-600">{p.warehouse || "Central Warehouse"}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-800">
                    {p.lines?.reduce((s, l) => s + l.qty, 0) || 10} pcs
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                    {money(p.total || 185000)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge tone="good" dot>{p.status?.toUpperCase() || "PENDING"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
