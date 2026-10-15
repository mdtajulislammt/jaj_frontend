"use client";

import { useState } from "react";
import { Plus, Component, Layers, Package, Search, Trash2, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";

const INITIAL_SUBCATS = [
  { id: "sub-1", name: "5G Flagship Phones", parent: "Smartphones & Tablets", code: "SUB-5G", count: 68 },
  { id: "sub-2", name: "Budget & Entry Android", parent: "Smartphones & Tablets", code: "SUB-AND", count: 74 },
  { id: "sub-3", name: "Gaming Ultrabooks", parent: "Laptops & Computing", code: "SUB-GAM", count: 24 },
  { id: "sub-4", name: "Business MacBooks & Thin Laptops", parent: "Laptops & Computing", code: "SUB-MAC", count: 32 },
  { id: "sub-5", name: "Inverter Split Air Conditioners", parent: "Home Appliances & AC", code: "SUB-AC", count: 22 },
  { id: "sub-6", name: "4K UHD Smart Televisions", parent: "Home Appliances & AC", code: "SUB-TV", count: 23 },
  { id: "sub-7", name: "TWS Wireless Earbuds", parent: "Audio & Accessories", code: "SUB-TWS", count: 110 },
  { id: "sub-8", name: "Fast Charging & GaN Adapters", parent: "Audio & Accessories", code: "SUB-CHG", count: 120 },
];

export default function SubCategoryPage() {
  const [subcats, setSubcats] = useState(INITIAL_SUBCATS);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", parent: "Smartphones & Tablets", code: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name) return;
    const item = {
      id: `sub-${Date.now()}`,
      name: form.name,
      parent: form.parent,
      code: form.code || `SUB-${form.name.slice(0, 3).toUpperCase()}`,
      count: 0,
    };
    setSubcats([item, ...subcats]);
    setForm({ name: "", parent: "Smartphones & Tablets", code: "" });
    setModalOpen(false);
  };

  const filtered = subcats.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Product Catalog"
        title="Sub Categories"
        description="Granular product grouping linked to primary department parent categories."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.35)] transition-all hover:scale-[1.02]"
          >
            <Plus size={16} /> Add Sub Category
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Sub-categories" value={subcats.length} icon={Component} tone="primary" />
        <StatCard label="Total Grouped SKUs" value="473" icon={Package} trend="Linked across brands" trendUp tone="good" />
        <StatCard label="Parent Divisions" value="5" icon={Layers} trend="Major categories" tone="warn" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-200/60 flex items-center justify-between gap-3 bg-gradient-to-r from-[#64BD0B]/5 to-transparent">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by subcategory or parent category…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#64BD0B]"
            />
          </div>
          <span className="text-[12px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-3 py-1.5 rounded-xl border border-[#64BD0B]/20">
            {subcats.length} Sub Categories
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">Sub Category Name</th>
                <th className="px-6 py-3.5 font-semibold">Parent Category</th>
                <th className="px-6 py-3.5 font-semibold">Code</th>
                <th className="px-6 py-3.5 font-semibold text-center">Items Count</th>
                <th className="px-6 py-3.5 font-semibold text-center">Status</th>
                <th className="px-6 py-3.5 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 text-[14px]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#64BD0B]/10 text-[#3B7506] flex items-center justify-center font-bold">
                        <Component size={14} />
                      </div>
                      <span>{s.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg text-[12px]">
                      {s.parent}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-600">
                    {s.code}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2.5 py-1 rounded-full text-[12px]">
                      {s.count} SKUs
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge tone="good" dot>Active</Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSubcats(subcats.filter((x) => x.id !== s.id))}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ━━ Modal ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
            >
              <X size={16} />
            </button>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Add Sub Category</h3>
            <p className="text-[12px] text-slate-500 mb-4">Link a subcategory to an existing parent category.</p>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Sub Category Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mechanical Keyboards"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Parent Category</label>
                <select
                  value={form.parent}
                  onChange={(e) => setForm({ ...form, parent: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none"
                >
                  <option value="Smartphones & Tablets">Smartphones & Tablets</option>
                  <option value="Laptops & Computing">Laptops & Computing</option>
                  <option value="Audio & Accessories">Audio & Accessories</option>
                  <option value="Wearables & Smartwatches">Wearables & Smartwatches</option>
                  <option value="Home Appliances & AC">Home Appliances & AC</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Code</label>
                <input
                  type="text"
                  placeholder="e.g. SUB-KEY"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold shadow-md text-[13px]"
                >
                  Save Sub Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
