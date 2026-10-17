"use client";

import { useState } from "react";
import {
  Layers2,
  Plus,
  Package,
  Gift,
  DollarSign,
  Tag,
  CheckCircle2,
  Trash2,
  TrendingUp,
  Percent,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const INITIAL_BUNDLES = [
  {
    id: 1,
    name: "Home Cinema Entertainment Suite",
    sku: "BNDL-CINEMA-01",
    type: "Fixed Price Combo",
    items: [
      { name: "Sony Bravia 55' 4K OLED TV", regularPrice: 115000 },
      { name: "Samsung Soundbar HW-Q600B", regularPrice: 32000 },
      { name: "HDMI 2.1 Ultra High Speed Cable", regularPrice: 1200 },
    ],
    regularPriceTotal: 148200,
    bundlePrice: 138000,
    savings: 10200,
    soldCount: 28,
    status: "Active",
  },
  {
    id: 2,
    name: "Work-From-Home Ergonomic Bundle",
    sku: "BNDL-WFH-02",
    type: "Cross-Product Discount",
    items: [
      { name: "Logitech MX Master 3S Mouse", regularPrice: 11500 },
      { name: "Anker 65W GaN Fast Charger", regularPrice: 3800 },
    ],
    regularPriceTotal: 15300,
    bundlePrice: 13500,
    savings: 1800,
    soldCount: 64,
    status: "Active",
  },
  {
    id: 3,
    name: "Kitchen Master Chef Special (BOGO)",
    sku: "BNDL-CHEF-03",
    type: "Buy 1 Get 1 (BOGO)",
    items: [
      { name: "Philips Air Fryer XL 6.2L", regularPrice: 16500 },
      { name: "Silicon Baking Mat & Accessory Set (FREE)", regularPrice: 2200 },
    ],
    regularPriceTotal: 18700,
    bundlePrice: 16500,
    savings: 2200,
    soldCount: 92,
    status: "Active",
  },
];

export default function ComboBundlesPage() {
  const [bundles, setBundles] = useState(INITIAL_BUNDLES);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    type: "Fixed Price Combo",
    bundlePrice: 0,
    savings: 0,
  });

  const totalBundleRevenue = bundles.reduce((acc, b) => acc + b.soldCount * b.bundlePrice, 0);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name || !form.sku) return;
    setBundles([
      ...bundles,
      {
        id: Date.now(),
        name: form.name,
        sku: form.sku.toUpperCase(),
        type: form.type,
        items: [{ name: "Custom Selected Products (Bundle)", regularPrice: Number(form.bundlePrice) + Number(form.savings) }],
        regularPriceTotal: Number(form.bundlePrice) + Number(form.savings),
        bundlePrice: Number(form.bundlePrice),
        savings: Number(form.savings),
        soldCount: 0,
        status: "Active",
      },
    ]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-2">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-sm shadow-[0_4px_14px_rgba(100,189,11,0.35)] transition-all"
        >
          <Plus size={16} />
          <span>Build New Combo / Bundle</span>
        </button>
      </div>

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Combo Packages"
          value={bundles.length.toString()}
          trend={{ value: "All barcodes active in POS", positive: true }}
          icon={Layers2}
          accent="emerald"
        />
        <StatCard
          label="Total Bundle Revenue"
          value={`৳${(totalBundleRevenue / 100000).toFixed(1)}L`}
          trend={{ value: "High-ticket basket size", positive: true }}
          icon={DollarSign}
          accent="blue"
        />
        <StatCard
          label="Packages Sold"
          value="184 Combos"
          trend={{ value: "+38 this month", positive: true }}
          icon={Package}
          accent="purple"
        />
        <StatCard
          label="Total Customer Savings"
          value="৳420,000"
          trend={{ value: "Average ৳2,280 / order", positive: true }}
          icon={Percent}
          accent="amber"
        />
      </div>

      {/* ━━ Bundles Table ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Combo Name &amp; SKU</th>
                <th className="py-3.5 px-4">Bundle Type</th>
                <th className="py-3.5 px-4">Included Products</th>
                <th className="py-3.5 px-4 text-right">Regular Total</th>
                <th className="py-3.5 px-4 text-right">Bundle Price</th>
                <th className="py-3.5 px-4 text-right">Savings</th>
                <th className="py-3.5 px-4 text-center">Packages Sold</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bundles.map((b) => (
                <tr key={b.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{b.name}</p>
                    <span className="font-mono text-xs font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2 py-0.5 rounded">
                      {b.sku}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                    {b.type}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    <ul className="space-y-0.5 list-disc list-inside">
                      {b.items.map((it, idx) => (
                        <li key={idx} className="truncate max-w-[220px]">
                          {it.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-400 line-through">
                    ৳{b.regularPriceTotal.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                    ৳{b.bundlePrice.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#3B7506] text-xs">
                    ৳{b.savings.toLocaleString()} OFF
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {b.soldCount}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setBundles(bundles.filter((x) => x.id !== b.id))}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ━━ Modal ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800">Create Combo / BOGO Package</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bundle Package Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Master Living Room Bundle"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bundle SKU:</label>
                  <input
                    type="text"
                    placeholder="BNDL-NEW-01"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] font-mono outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Offer Mechanism:</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  >
                    <option value="Fixed Price Combo">Fixed Price Combo</option>
                    <option value="Buy 1 Get 1 (BOGO)">Buy 1 Get 1 (BOGO)</option>
                    <option value="Cross-Product Discount">Cross-Product Discount</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Package Special Price (৳):</label>
                  <input
                    type="number"
                    value={form.bundlePrice}
                    onChange={(e) => setForm({ ...form, bundlePrice: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Savings (৳):</label>
                  <input
                    type="number"
                    value={form.savings}
                    onChange={(e) => setForm({ ...form, savings: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#64BD0B] text-white font-bold shadow-md"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
