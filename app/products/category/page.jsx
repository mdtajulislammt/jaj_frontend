"use client";

import { useState } from "react";
import { Plus, Layers, Package, Search, Edit2, Trash2, X, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";

const INITIAL_CATEGORIES = [
  {
    id: "cat-1",
    name: "Smartphones & Tablets",
    code: "CAT-MOB",
    productCount: 142,
    taxPercent: 5,
    status: "active",
    description: "Flagship, mid-range smartphones and cellular iPads.",
  },
  {
    id: "cat-2",
    name: "Laptops & Computing",
    code: "CAT-LAP",
    productCount: 56,
    taxPercent: 5,
    status: "active",
    description: "Ultrabooks, gaming rigs, workstations and mini PCs.",
  },
  {
    id: "cat-3",
    name: "Wearables & Smartwatches",
    code: "CAT-WAT",
    productCount: 88,
    taxPercent: 7.5,
    status: "active",
    description: "Apple Watches, Garmin, Galaxy Watches and fitness bands.",
  },
  {
    id: "cat-4",
    name: "Audio & Accessories",
    code: "CAT-AUD",
    productCount: 230,
    taxPercent: 7.5,
    status: "active",
    description: "TWS Earbuds, ANC headphones, power adapters, MagSafe.",
  },
  {
    id: "cat-5",
    name: "Home Appliances & AC",
    code: "CAT-HOM",
    productCount: 45,
    taxPercent: 10,
    status: "active",
    description: "Inverter Split ACs, Smart 4K UHD TVs, Air Purifiers.",
  },
];

export default function CategoryPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", taxPercent: "5", description: "" });

  const totalProducts = categories.reduce((s, c) => s + c.productCount, 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name) return;
    const newCat = {
      id: `cat-${Date.now()}`,
      name: form.name,
      code: form.code || `CAT-${form.name.slice(0, 3).toUpperCase()}`,
      productCount: 0,
      taxPercent: Number(form.taxPercent) || 5,
      status: "active",
      description: form.description || "Active catalog category.",
    };
    setCategories([newCat, ...categories]);
    setForm({ name: "", code: "", taxPercent: "5", description: "" });
    setModalOpen(false);
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Product Catalog"
        title="Product Categories"
        description="Organize merchandise into high-level catalog divisions, tax slabs, and department categories."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.35)] transition-all hover:scale-[1.02]"
          >
            <Plus size={16} /> Add Category
          </button>
        }
      />

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Categories"
          value={categories.length}
          icon={Layers}
          tone="primary"
        />
        <StatCard
          label="Total Catalog SKUs"
          value={totalProducts}
          icon={Package}
          trend="Categorized products"
          trendUp
          tone="good"
        />
        <StatCard
          label="Top Category"
          value="Audio & Acc."
          icon={Layers}
          trend="230 Products"
          tone="warn"
        />
        <StatCard
          label="Active Status"
          value="100%"
          icon={CheckCircle2}
          trend="All operational"
          tone="primary"
        />
      </div>

      {/* ━━ Category Table Card ━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-200/60 flex items-center justify-between gap-3 bg-gradient-to-r from-[#64BD0B]/5 to-transparent">
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search category by name or code…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#64BD0B]"
            />
          </div>
          <span className="text-[12px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-3 py-1.5 rounded-xl border border-[#64BD0B]/20">
            {categories.length} Categories
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">Category Name</th>
                <th className="px-6 py-3.5 font-semibold">Category Code</th>
                <th className="px-6 py-3.5 font-semibold text-center">VAT / Tax</th>
                <th className="px-6 py-3.5 font-semibold text-center">Listed SKUs</th>
                <th className="px-6 py-3.5 font-semibold">Description</th>
                <th className="px-6 py-3.5 font-semibold text-center">Status</th>
                <th className="px-6 py-3.5 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 text-[14px]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#64BD0B]/10 text-[#3B7506] flex items-center justify-center font-bold">
                        <Layers size={16} />
                      </div>
                      <span>{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-700">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      {cat.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-semibold text-slate-800">
                    {cat.taxPercent}%
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2.5 py-1 rounded-full text-[12px]">
                      {cat.productCount} SKUs
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-[12px] max-w-xs">
                    {cat.description}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge tone="good" dot>Active</Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setCategories(categories.filter((c) => c.id !== cat.id))}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Category"
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

      {/* ━━ Add Category Modal ━━━━━━━━━━━━━━━━━━━━━━━ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Add Product Category</h3>
            <p className="text-[12px] text-slate-500 mb-4">Define a new master category classification.</p>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gaming Consoles & VR"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Category Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CAT-GAM"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">VAT Surcharge (%)</label>
                  <input
                    type="number"
                    value={form.taxPercent}
                    onChange={(e) => setForm({ ...form, taxPercent: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Scope of products under this category…"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
