"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Truck,
  Trash2,
  CheckCircle2,
  Search,
  Wifi,
  Store,
  Receipt,
  X,
  Building2,
  ChevronDown,
  Layers,
  ArrowUpDown,
} from "lucide-react";
import { addSupplier } from "@/store/slices/suppliersSlice";
import { money } from "@/lib/format";

const INITIAL_ASSIGNED_PRODUCTS = [
  {
    id: "sp-1",
    ean: "8801643921456",
    name: "Samsung Galaxy S24 (Black · 8GB/256GB)",
    code: "SGS24-BLK-256",
    unit: "Pcs",
  },
  {
    id: "sp-2",
    ean: "8801643921490",
    name: "Samsung Galaxy Buds Pro 2",
    code: "SGB-PR2-WHT",
    unit: "Pcs",
  },
];

export default function SuppliersPage() {
  const dispatch = useDispatch();
  const suppliers = useSelector((s) => s.suppliers.items);
  const catalogProducts = useSelector((s) => s.products.items);

  const [activeTab, setActiveTab] = useState("create"); // "create" | "list"
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form fields matching Screenshot 1 exactly
  const [form, setForm] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    altPhone: "811881",
    status: "Active",
    address: "",
  });

  const [assignedProducts, setAssignedProducts] = useState(INITIAL_ASSIGNED_PRODUCTS);
  const [selectedProductPicker, setSelectedProductPicker] = useState("");

  const handleAddProduct = (prodId) => {
    if (!prodId) return;
    const prod = catalogProducts.find((p) => p.id === prodId);
    if (!prod) return;

    if (assignedProducts.some((p) => p.code === prod.sku)) {
      setSelectedProductPicker("");
      return;
    }

    setAssignedProducts([
      ...assignedProducts,
      {
        id: `sp-${Date.now()}`,
        ean: prod.barcode || "880199482012",
        name: prod.name + (prod.variant ? ` (${prod.variant})` : ""),
        code: prod.sku,
        unit: "Pcs",
      },
    ]);
    setSelectedProductPicker("");
  };

  const handleRemoveProduct = (id) => {
    setAssignedProducts(assignedProducts.filter((p) => p.id !== id));
  };

  const handleResetForm = () => {
    setForm({
      company: "",
      name: "",
      email: "",
      phone: "",
      altPhone: "811881",
      status: "Active",
      address: "",
    });
    setAssignedProducts([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company && !form.name) return;

    const newSupplier = {
      company: form.company || form.name,
      name: form.name || form.company,
      contact: form.name,
      email: form.email,
      phone: form.phone,
      altPhone: form.altPhone,
      status: form.status,
      address: form.address,
      products: assignedProducts,
    };

    dispatch(addSupplier(newSupplier));
    setSuccessMessage(`Supplier "${form.company || form.name}" created successfully!`);
    setTimeout(() => setSuccessMessage(""), 4000);
    handleResetForm();
    setActiveTab("list");
  };

  const filteredSuppliers = suppliers.filter(
    (s) =>
      (s.company || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.phone || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto select-none">
      {/* ━━ Top Status / Store Bar (Matching Screenshot Header) ━━ */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab("create")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "create"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              + Add Supplier
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "list"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Suppliers ({suppliers.length})
            </button>
          </div>
        </div>

        {/* Right Corner Badges (Matching Screenshot 1) */}
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Wifi size={14} className="stroke-[2.5]" />
            <span className="font-semibold text-[11px]">Online</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <Store size={14} className="text-slate-400" />
            <span className="text-slate-700 font-semibold">Hasib Mart</span>
            <span className="text-slate-400 font-normal">Aamar ID: <strong className="text-slate-700">427671</strong></span>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 cursor-pointer">
            <span className="text-sm">🇬🇧</span>
            <span className="font-semibold text-slate-700 text-[11px]">English</span>
            <ChevronDown size={12} className="text-slate-400" />
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            title="Registers"
          >
            <Receipt size={15} />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-300">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* ━━ VIEW 1: ADD SUPPLIER VIEW (EXACT SCREENSHOT 1 DESIGN) ━━ */}
      {activeTab === "create" && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 md:p-8 space-y-6">
          {/* Top Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {/* Company */}
            <div>
              <input
                type="text"
                placeholder="Company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-[#64BD0B] focus:ring-2 focus:ring-[#64BD0B]/20 outline-none transition-all placeholder:text-slate-400 text-slate-800 bg-white"
              />
            </div>

            {/* Name */}
            <div>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-[#64BD0B] focus:ring-2 focus:ring-[#64BD0B]/20 outline-none transition-all placeholder:text-slate-400 text-slate-800 bg-white"
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-[#64BD0B] focus:ring-2 focus:ring-[#64BD0B]/20 outline-none transition-all placeholder:text-slate-400 text-slate-800 bg-white"
              />
            </div>

            {/* Phone */}
            <div>
              <input
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-[#64BD0B] focus:ring-2 focus:ring-[#64BD0B]/20 outline-none transition-all placeholder:text-slate-400 text-slate-800 bg-white"
              />
            </div>

            {/* Alternate Phone / Code (e.g. 811881) */}
            <div>
              <input
                type="text"
                placeholder="811881"
                value={form.altPhone}
                onChange={(e) => setForm({ ...form, altPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-[#64BD0B] focus:ring-2 focus:ring-[#64BD0B]/20 outline-none transition-all placeholder:text-slate-400 text-slate-800 bg-white"
              />
            </div>

            {/* Status Dropdown (Active / Inactive) */}
            <div className="relative">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-[#64BD0B] focus:ring-2 focus:ring-[#64BD0B]/20 outline-none transition-all text-slate-800 bg-white appearance-none cursor-pointer pr-10"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* Address (Spanning across full row) */}
            <div className="md:col-span-3">
              <textarea
                rows={2}
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-[#64BD0B] focus:ring-2 focus:ring-[#64BD0B]/20 outline-none transition-all placeholder:text-slate-400 text-slate-800 bg-white resize-none"
              />
            </div>
          </div>

          {/* Supplier's Products Section (Screenshot 1 Exact Layout) */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">
              Supplier&apos;s Products
            </h2>

            {/* Product Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedProductPicker}
                onChange={(e) => handleAddProduct(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-[#64BD0B] focus:ring-2 focus:ring-[#64BD0B]/20 outline-none transition-all text-slate-700 bg-white appearance-none cursor-pointer pr-10"
              >
                <option value="">Select or search product to assign to this supplier...</option>
                {catalogProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.variant ? `(${p.variant})` : ""} — SKU: {p.sku} | Barcode: {p.barcode}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            {/* Supplier's Products Table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">EAN</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4 text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {assignedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No products mapped to this supplier yet. Select a product from the dropdown above.
                      </td>
                    </tr>
                  ) : (
                    assignedProducts.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 text-center font-mono text-slate-400 font-medium">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-800">
                          {item.ean}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {item.name}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {item.code}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                            {item.unit}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(item.id)}
                            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors inline-flex items-center justify-center"
                            title="Remove product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Actions: Cancel & + Create Supplier (Exact Screenshot 1 design) */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetForm}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X size={14} /> Cancle
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-white bg-[#1A1A1A] hover:bg-black rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.18)] hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Plus size={15} /> Create Supplier
            </button>
          </div>
        </form>
      )}

      {/* ━━ VIEW 2: ALL SUPPLIERS DIRECTORY ━━ */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="relative flex-1 max-w-md">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search supplier by company, contact person, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:border-[#64BD0B] outline-none text-slate-700"
              />
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("create")}
              className="inline-flex items-center gap-1.5 bg-[#64BD0B] hover:bg-[#529E08] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all"
            >
              <Plus size={14} /> Add New Supplier
            </button>
          </div>

          {/* Suppliers Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px] font-semibold uppercase tracking-wider text-left">
                <tr>
                  <th className="py-3 px-5">Supplier / Company</th>
                  <th className="py-3 px-5">Contact Person</th>
                  <th className="py-3 px-5">Phone &amp; Email</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Total Purchase</th>
                  <th className="py-3 px-5 text-right">Payable Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSuppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#64BD0B]/10 text-[#3B7506] flex items-center justify-center font-bold">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{s.company || s.name}</p>
                          <p className="text-[11px] text-slate-400">{s.address || "Dhaka, Bangladesh"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 font-medium text-slate-800">{s.contact || s.name}</td>
                    <td className="py-3 px-5">
                      <p className="font-mono text-slate-700 font-medium">{s.phone}</p>
                      <p className="text-[11px] text-slate-400">{s.email}</p>
                    </td>
                    <td className="py-3 px-5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800">
                        {s.status || "Active"}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right font-mono font-semibold text-slate-900">
                      {money(s.totalPurchase || 0)}
                    </td>
                    <td className="py-3 px-5 text-right font-mono font-bold text-amber-600">
                      {money(s.payable || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
