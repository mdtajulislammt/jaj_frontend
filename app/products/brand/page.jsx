"use client";

import { useState } from "react";
import { Plus, Tag, Sparkles, Globe, Search, Trash2, X, CheckCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";

const INITIAL_BRANDS = [
  { id: "b-1", name: "Apple", origin: "USA", products: 48, official: true, warrantyPolicy: "1 Year Official AppleCare" },
  { id: "b-2", name: "Samsung", origin: "South Korea", products: 62, official: true, warrantyPolicy: "1 Year Official Service Warranty" },
  { id: "b-3", name: "Sony", origin: "Japan", products: 35, official: true, warrantyPolicy: "2 Years Panel & Parts Warranty" },
  { id: "b-4", name: "Walton", origin: "Bangladesh", products: 54, official: true, warrantyPolicy: "10 Years Compressor / 1 Year Electrical" },
  { id: "b-5", name: "LG Electronics", origin: "South Korea", products: 28, official: true, warrantyPolicy: "10 Years Smart Inverter Warranty" },
  { id: "b-6", name: "Xiaomi", origin: "China", products: 72, official: true, warrantyPolicy: "1 Year Official Xiaomi Bangladesh" },
  { id: "b-7", name: "Asus", origin: "Taiwan", products: 30, official: true, warrantyPolicy: "2 Years International ROG/Zenbook" },
  { id: "b-8", name: "Anker", origin: "USA", products: 95, official: true, warrantyPolicy: "18 Months Replacement Warranty" },
];

export default function BrandPage() {
  const [brands, setBrands] = useState(INITIAL_BRANDS);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", origin: "Global", warrantyPolicy: "1 Year Official" });

  const totalBrandProducts = brands.reduce((s, b) => s + b.products, 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name) return;
    const item = {
      id: `b-${Date.now()}`,
      name: form.name,
      origin: form.origin || "Global",
      products: 0,
      official: true,
      warrantyPolicy: form.warrantyPolicy,
    };
    setBrands([item, ...brands]);
    setForm({ name: "", origin: "Global", warrantyPolicy: "1 Year Official" });
    setModalOpen(false);
  };

  const filtered = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Product Catalog"
        title="Manufacturer Brands"
        description="Official brand distributor agreements, origin details, and authorized warranty coverage."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.35)] transition-all hover:scale-[1.02]"
          >
            <Plus size={16} /> Add Brand
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Authorized Brands" value={brands.length} icon={Tag} tone="primary" />
        <StatCard label="Cataloged SKUs" value={totalBrandProducts} icon={Sparkles} trend="Branded inventory" trendUp tone="good" />
        <StatCard label="Official Partners" value="100%" icon={CheckCircle} trend="Direct distributor" tone="warn" />
        <StatCard label="Global Origins" value="6 Countries" icon={Globe} trend="Imported & Local" tone="primary" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-200/60 flex items-center justify-between gap-3 bg-gradient-to-r from-[#64BD0B]/5 to-transparent">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search brand by name or origin country…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#64BD0B]"
            />
          </div>
          <span className="text-[12px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-3 py-1.5 rounded-xl border border-[#64BD0B]/20">
            {brands.length} Brands
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">Brand Name</th>
                <th className="px-6 py-3.5 font-semibold">Origin</th>
                <th className="px-6 py-3.5 font-semibold text-center">Catalog SKUs</th>
                <th className="px-6 py-3.5 font-semibold">Warranty Policy</th>
                <th className="px-6 py-3.5 font-semibold text-center">Status</th>
                <th className="px-6 py-3.5 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 text-[14px]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-display font-bold text-[13px] shadow-sm">
                        {b.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{b.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-[12px]">
                      {b.origin}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2.5 py-1 rounded-full text-[12px]">
                      {b.products} Products
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 text-[12.5px] font-medium">
                    <Badge tone="sky">{b.warrantyPolicy}</Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge tone="good" dot>Authorized</Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setBrands(brands.filter((x) => x.id !== b.id))}
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
            >
              <X size={16} />
            </button>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Add Manufacturer Brand</h3>
            <p className="text-[12px] text-slate-500 mb-4">Register a new product vendor brand.</p>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dell / OnePlus"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Country of Origin</label>
                <input
                  type="text"
                  placeholder="e.g. Japan / Taiwan"
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Warranty Term Policy</label>
                <input
                  type="text"
                  placeholder="e.g. 1 Year Official / 6 Months"
                  value={form.warrantyPolicy}
                  onChange={(e) => setForm({ ...form, warrantyPolicy: e.target.value })}
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
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
