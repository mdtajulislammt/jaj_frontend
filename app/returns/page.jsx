"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Undo2,
  Upload,
  Search,
  Trash2,
  CheckCircle2,
  List,
  X,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import CursorPagination from "@/components/CursorPagination";
import { money } from "@/lib/format";
import { addRTV } from "@/store/slices/returnsSlice";

export default function ReturnsPage() {
  const dispatch = useDispatch();
  const suppliers = useSelector((s) => s.suppliers.items);
  const products = useSelector((s) => s.products.items);
  const rtvChallans = useSelector((s) => s.returns.rtvChallans || []);

  const [activeTab, setActiveTab] = useState("create"); // "create" | "history"
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);

  // Form states matching Screenshot 2
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [returnCart, setReturnCart] = useState([]);
  const [note, setNote] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId);

  const availableProducts = products.filter((p) => {
    if (!selectedSupplierId) return false;
    const matchesSupplier =
      !selectedSupplier ||
      p.brand?.toLowerCase() === selectedSupplier.name?.toLowerCase() ||
      p.name?.toLowerCase().includes(selectedSupplier.name?.toLowerCase().split(" ")[0]);
    const matchesSearch =
      p.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(supplierSearch.toLowerCase());
    return matchesSupplier && matchesSearch;
  });

  const addToReturnCart = (prod) => {
    const existing = returnCart.find((i) => i.id === prod.id);
    if (existing) {
      setReturnCart(
        returnCart.map((i) =>
          i.id === prod.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setReturnCart([
        ...returnCart,
        {
          id: prod.id,
          code: prod.sku,
          name: prod.name,
          stock: prod.serials?.filter((s) => s.status === "in_stock").length || 10,
          qty: 1,
          tp: prod.costPrice || 25000,
          mrp: prod.sellPrice || 30000,
        },
      ]);
    }
  };

  const updateQty = (id, newQty) => {
    const q = Math.max(1, Number(newQty) || 1);
    setReturnCart(
      returnCart.map((i) => (i.id === id ? { ...i, qty: q } : i))
    );
  };

  const removeFromCart = (id) => {
    setReturnCart(returnCart.filter((i) => i.id !== id));
  };

  const resetCart = () => {
    setReturnCart([]);
    setNote("");
  };

  const totalReturnCost = returnCart.reduce((s, i) => s + i.qty * i.tp, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSupplierId) {
      alert("Please select a supplier!");
      return;
    }
    if (returnCart.length === 0) {
      alert("Please select at least one product to return!");
      return;
    }

    const payload = {
      supplierId: selectedSupplierId,
      supplierName: selectedSupplier?.name || "Selected Supplier",
      warehouse: selectedWarehouse || "Dhanmondi Central Store",
      lines: returnCart.map((i) => ({
        productId: i.id,
        productName: i.name,
        qty: i.qty,
        tp: i.tp,
      })),
      total: totalReturnCost,
      note,
    };

    dispatch(addRTV(payload));
    setSuccessMsg(`RTV Challan issued to ${selectedSupplier?.name}! Stock deducted.`);
    resetCart();
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-end gap-4 mb-2">
        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-bold transition-all ${
              activeTab === "create"
                ? "bg-[#64BD0B] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            + Create New RTV
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-bold transition-all ${
              activeTab === "history"
                ? "bg-[#64BD0B] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <List size={14} className="inline mr-1" /> RTV Challans ({rtvChallans.length})
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-[#64BD0B]/15 border border-[#64BD0B]/30 text-[#2C6004] px-4 py-3 rounded-xl flex items-center gap-2 font-semibold text-[13px] animate-in fade-in">
          <CheckCircle2 size={17} /> {successMsg}
        </div>
      )}

      {activeTab === "create" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Top Row: Warehouse & Supplier (Screenshot 2 exact layout) */}
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
                <option value="">Select warehouse</option>
                <option value="Dhanmondi Flagship Store">Dhanmondi Flagship Store</option>
                <option value="Central Warehouse Hub">Central Warehouse Hub</option>
                <option value="Uttara Superstore Outlet">Uttara Superstore Outlet</option>
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

          {/* Second Row: Import Product CSV */}
          <div className="bg-white/80 backdrop-blur-xl p-4 md:p-5 rounded-2xl border border-white/90 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12.5px] font-semibold text-slate-700">Import Product</label>
              <a
                href="#sample"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Downloading RTV sample CSV template");
                }}
                className="text-[11px] font-bold text-slate-500 hover:text-[#3B7506] border border-slate-200 px-2 py-0.5 rounded"
              >
                Download Sample CSV
              </a>
            </div>
            <div className="flex items-center gap-2 max-w-md">
              <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden px-3 py-1.5">
                <span className="bg-slate-800 text-white text-[11px] font-bold px-2 py-1 rounded mr-2">
                  Browse Csv
                </span>
                <span className="text-[12px] text-slate-400 truncate">No File Selected</span>
              </div>
              <button
                type="button"
                onClick={() => alert("CSV Import: Select a CSV file to bulk import RTV items.")}
                className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[12.5px] px-4 py-2 rounded-xl shadow-sm transition-all"
              >
                <Upload size={14} /> Import Product
              </button>
            </div>
          </div>

          {/* Middle Two-Column Section: Supplier Products vs RTV Cart */}
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
                          Please Select a Supplier
                        </td>
                      </tr>
                    ) : availableProducts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                          No products found for this vendor.
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
                              onClick={() => addToReturnCart(p)}
                              className="px-2.5 py-1 rounded-lg text-[11.5px] font-bold bg-[#64BD0B] text-white hover:bg-[#529E08] transition-all shadow-sm"
                            >
                              + Return
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Products to Return Table */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-sm overflow-hidden flex flex-col">
              <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
                <p className="text-[13px] font-bold text-slate-800">Return Items Table</p>
                <span className="text-[11.5px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2 py-0.5 rounded-full">
                  {returnCart.length} Items selected
                </span>
              </div>

              <div className="overflow-x-auto overflow-y-auto max-h-[300px] scrollbar-thin">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/50 border-b border-slate-200">
                      <th className="px-2.5 py-2 font-semibold">#</th>
                      <th className="px-2.5 py-2 font-semibold">Code</th>
                      <th className="px-2.5 py-2 font-semibold">Name</th>
                      <th className="px-2.5 py-2 font-semibold text-center">Quantity</th>
                      <th className="px-2.5 py-2 font-semibold text-right">TP</th>
                      <th className="px-2.5 py-2 font-semibold text-right">MRP</th>
                      <th className="px-2.5 py-2 font-semibold text-right">Total</th>
                      <th className="px-2.5 py-2 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {returnCart.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-12 text-center text-slate-400 font-medium">
                          Please Select a Product to return
                        </td>
                      </tr>
                    ) : (
                      returnCart.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-2.5 py-2 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                          <td className="px-2.5 py-2 font-mono text-slate-600">{item.code}</td>
                          <td className="px-2.5 py-2 font-bold text-slate-900 truncate max-w-[130px]">
                            {item.name}
                          </td>
                          <td className="px-2.5 py-2 text-center">
                            <input
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={(e) => updateQty(item.id, e.target.value)}
                              className="w-12 text-center bg-white border border-slate-200 rounded px-1 py-0.5 text-[12px] font-bold"
                            />
                          </td>
                          <td className="px-2.5 py-2 text-right font-mono text-slate-700">{money(item.tp)}</td>
                          <td className="px-2.5 py-2 text-right font-mono text-slate-700">{money(item.mrp)}</td>
                          <td className="px-2.5 py-2 text-right font-mono font-bold text-rose-600">
                            {money(item.qty * item.tp)}
                          </td>
                          <td className="px-2.5 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="text-slate-400 hover:text-rose-500"
                            >
                              <X size={14} />
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

          {/* Lower Note Input (Screenshot 2 exact design) */}
          <div className="bg-white/80 backdrop-blur-xl p-4 md:p-5 rounded-2xl border border-white/90 shadow-sm">
            <label className="block text-[12px] font-semibold text-slate-700 mb-1">Note</label>
            <textarea
              rows={2}
              placeholder="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
            />
          </div>

          {/* Bottom Buttons: Reset Cart & Submit (Screenshot 2 exact style) */}
          <div className="flex justify-start items-center gap-3">
            <button
              type="button"
              onClick={resetCart}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-[13px] px-5 py-2.5 rounded-xl shadow-sm transition-all"
            >
              Reset Cart
            </button>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-black text-white font-bold text-[13px] px-6 py-2.5 rounded-xl shadow-md transition-all"
            >
              Submit
            </button>
          </div>
        </form>
      ) : (
        /* RTV History Tab */
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-sm overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">Challan Ref</th>
                <th className="px-6 py-3.5 font-semibold">Vendor / Supplier</th>
                <th className="px-6 py-3.5 font-semibold">Warehouse</th>
                <th className="px-6 py-3.5 font-semibold text-center">Returned Qty</th>
                <th className="px-6 py-3.5 font-semibold text-right">RTV Value</th>
                <th className="px-6 py-3.5 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rtvChallans
                .slice((historyPage - 1) * historyPageSize, historyPage * historyPageSize)
                .map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-rose-600">RTV-10{i + 1}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{r.supplierName}</td>
                  <td className="px-6 py-4 text-slate-600">{r.warehouse || "Dhanmondi Store"}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-800">
                    {r.lines?.reduce((s, l) => s + l.qty, 0) || 1} pcs
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                    {money(r.total || 45000)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge tone="warn" dot>Challan Dispatched</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cursor Pagination for RTV History */}
          <div className="p-3 bg-white border-t border-slate-100">
            <CursorPagination
              totalItems={rtvChallans.length}
              pageSize={historyPageSize}
              onPageSizeChange={setHistoryPageSize}
              currentPage={historyPage}
              onPageChange={setHistoryPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
