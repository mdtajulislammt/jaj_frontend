"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Building2,
  Upload,
  Search,
  Trash2,
  CheckCircle2,
  List,
  X,
  ArrowRightLeft,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import { money } from "@/lib/format";

export default function TpnPage() {
  const products = useSelector((s) => s.products.items);
  const [activeTab, setActiveTab] = useState("create"); // "create" | "history"

  // Form states matching Screenshot 3
  const [warehouseFrom, setWarehouseFrom] = useState(
    "Hasib Mart - [House#06, Road#27, Sector#07, Uttara]"
  );
  const [warehouseTo, setWarehouseTo] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");

  const [transportedList, setTransportedList] = useState([]);
  const [shippingCost, setShippingCost] = useState("");
  const [note, setNote] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleProductSelect = (pId) => {
    if (!pId) return;
    const prod = products.find((p) => p.id === pId);
    if (!prod) return;

    const existing = transportedList.find((i) => i.id === prod.id);
    if (existing) {
      setTransportedList(
        transportedList.map((i) =>
          i.id === prod.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setTransportedList([
        ...transportedList,
        {
          id: prod.id,
          code: prod.sku,
          name: prod.name,
          qty: 1,
          tp: prod.costPrice || 25000,
        },
      ]);
    }
    setSelectedProductId("");
  };

  const updateQty = (id, newQty) => {
    const q = Math.max(1, Number(newQty) || 1);
    setTransportedList(
      transportedList.map((i) => (i.id === id ? { ...i, qty: q } : i))
    );
  };

  const removeItem = (id) => {
    setTransportedList(transportedList.filter((i) => i.id !== id));
  };

  const resetCart = () => {
    setTransportedList([]);
    setShippingCost("");
    setNote("");
  };

  // Calculations
  const totalItems = transportedList.reduce((s, i) => s + i.qty, 0);
  const productCost = transportedList.reduce((s, i) => s + i.qty * i.tp, 0);
  const numShipping = Number(shippingCost) || 0;
  const totalCost = productCost + numShipping;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!warehouseTo) {
      alert("Please select destination Warehouse To!");
      return;
    }
    if (transportedList.length === 0) {
      alert("Please select at least one product to transport via TPN!");
      return;
    }

    setSuccessMsg(`TPN Gate Pass issued! Stock transferred to ${warehouseTo}.`);
    resetCart();
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
            Product Out via TPN
          </h1>
          <p className="text-slate-500 text-[13px] mt-0.5">
            Inter-branch stock consignment gate pass and shipment dispatch
          </p>
        </div>

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
            + Create TPN
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-bold transition-all ${
              activeTab === "history"
                ? "bg-[#64BD0B] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <List size={14} className="inline mr-1" /> TPN Gate Passes
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
          {/* Top Row: Warehouse From & Warehouse To (Screenshot 3 exact layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/80 backdrop-blur-xl p-4 md:p-5 rounded-2xl border border-white/90 shadow-sm">
            <div>
              <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                Warehouse From
              </label>
              <select
                value={warehouseFrom}
                onChange={(e) => setWarehouseFrom(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
              >
                <option value="Hasib Mart - [House#06, Road#27, Sector#07, Uttara]">
                  Hasib Mart - [House#06, Road#27, Sector#07, Uttara]
                </option>
                <option value="Central Warehouse Hub">Central Warehouse Hub</option>
                <option value="Dhanmondi Flagship Store">Dhanmondi Flagship Store</option>
                <option value="Mirpur Depot">Mirpur Depot</option>
              </select>
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                Warehouse To *
              </label>
              <select
                value={warehouseTo}
                onChange={(e) => setWarehouseTo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                required
              >
                <option value="">Select warehouse</option>
                <option value="Dhanmondi Flagship Store">Dhanmondi Flagship Store</option>
                <option value="Mirpur Depot & Service Center">Mirpur Depot & Service Center</option>
                <option value="Central Warehouse Hub">Central Warehouse Hub</option>
              </select>
            </div>
          </div>

          {/* Second Row: Products Selector & Import Product */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/80 backdrop-blur-xl p-4 md:p-5 rounded-2xl border border-white/90 shadow-sm">
            <div>
              <label className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                Products
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductSelect(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku}) · Stock: {p.serials?.filter((s) => s.status === "in_stock").length || 10}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12.5px] font-semibold text-slate-700">Import Product</label>
                <a
                  href="#sample"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Downloading TPN sample CSV template");
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
                  onClick={() => alert("CSV Import: Select a CSV file to bulk import items for TPN.")}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[12.5px] px-4 py-2 rounded-xl shadow-sm transition-all"
                >
                  <Upload size={14} /> Import
                </button>
              </div>
            </div>
          </div>

          {/* Middle Table: Transported Products List (Screenshot 3 exact layout) */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-sm overflow-hidden">
            <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
              <p className="text-[13px] font-bold text-slate-800">Transported Products List</p>
              <span className="text-[11.5px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2.5 py-0.5 rounded-full">
                {transportedList.length} items
              </span>
            </div>

            <div className="overflow-x-auto min-h-[140px] max-h-[300px] scrollbar-thin">
              <table className="w-full text-[12.5px]">
                <thead>
                  <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/50 border-b border-slate-200">
                    <th className="px-3.5 py-2 font-semibold">#</th>
                    <th className="px-3.5 py-2 font-semibold">Code</th>
                    <th className="px-3.5 py-2 font-semibold">Name</th>
                    <th className="px-3.5 py-2 font-semibold text-center">Quantity</th>
                    <th className="px-3.5 py-2 font-semibold text-right">TP</th>
                    <th className="px-3.5 py-2 font-semibold text-right">Total</th>
                    <th className="px-3.5 py-2 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transportedList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-slate-400 font-medium">
                        No Product Selected
                      </td>
                    </tr>
                  ) : (
                    transportedList.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-3.5 py-2.5 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="px-3.5 py-2.5 font-mono text-slate-600 font-semibold">{item.code}</td>
                        <td className="px-3.5 py-2.5 font-bold text-slate-900">{item.name}</td>
                        <td className="px-3.5 py-2.5 text-center">
                          <input
                            type="number"
                            min={1}
                            value={item.qty}
                            onChange={(e) => updateQty(item.id, e.target.value)}
                            className="w-14 text-center bg-white border border-slate-200 rounded px-1.5 py-0.5 font-bold text-slate-800 text-[12px]"
                          />
                        </td>
                        <td className="px-3.5 py-2.5 text-right font-mono text-slate-700">{money(item.tp)}</td>
                        <td className="px-3.5 py-2.5 text-right font-mono font-bold text-[#3B7506]">
                          {money(item.qty * item.tp)}
                        </td>
                        <td className="px-3.5 py-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-slate-400 hover:text-rose-500 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Fields: Shipping Cost & Note */}
          <div className="bg-white/80 backdrop-blur-xl p-4 md:p-5 rounded-2xl border border-white/90 shadow-sm space-y-3">
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Shipping Cost
              </label>
              <input
                type="number"
                placeholder="Shipping Cost"
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                Note
              </label>
              <textarea
                rows={2}
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
              />
            </div>
          </div>

          {/* Bottom Summary Bar (Screenshot 3 exact style) */}
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between text-[12.5px] font-medium text-slate-700">
            <div>Total Items: <span className="font-bold text-slate-900">{totalItems}.00</span></div>
            <div>Product Cost: <span className="font-bold text-slate-900">{money(productCost)}</span></div>
            <div>Shipping Cost: <span className="font-bold text-slate-900">{money(numShipping)}</span></div>
            <div className="text-[14px] font-extrabold text-[#3B7506]">
              Total Cost: <span className="font-mono">{money(totalCost)}</span>
            </div>
          </div>

          {/* Action Buttons: Reset Cart & Submit */}
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
              className="bg-slate-900 hover:bg-black text-white font-bold text-[13px] px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <ArrowRightLeft size={15} /> Submit
            </button>
          </div>
        </form>
      ) : (
        /* History View */
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-sm overflow-hidden p-6 text-center text-slate-500">
          <p className="font-semibold">Recent TPN shipments logged. All deliveries synced.</p>
        </div>
      )}
    </div>
  );
}
