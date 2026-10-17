"use client";

import { useState } from "react";
import {
  Tag,
  Plus,
  Search,
  Copy,
  CheckCircle2,
  Calendar,
  DollarSign,
  Percent,
  TrendingUp,
  Clock,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const INITIAL_COUPONS = [
  {
    id: 1,
    code: "WELCOME500",
    description: "New Customer Registration Welcome Discount",
    discountType: "Fixed Amount",
    discountValue: 500,
    minOrderValue: 3000,
    maxDiscount: 500,
    usedCount: 142,
    usageLimit: 500,
    validUntil: "31 Dec 2026",
    status: true,
  },
  {
    id: 2,
    code: "EID15",
    description: "Festive Season Flash Discount on Electronics",
    discountType: "Percentage",
    discountValue: 15,
    minOrderValue: 10000,
    maxDiscount: 3000,
    usedCount: 388,
    usageLimit: 1000,
    validUntil: "25 Nov 2026",
    status: true,
  },
  {
    id: 3,
    code: "VIPOFF1000",
    description: "Exclusive Gold & Platinum Member Promo",
    discountType: "Fixed Amount",
    discountValue: 1000,
    minOrderValue: 20000,
    maxDiscount: 1000,
    usedCount: 45,
    usageLimit: 100,
    validUntil: "15 Nov 2026",
    status: true,
  },
  {
    id: 4,
    code: "FLASH5",
    description: "App & Weekend Flash 5% Off",
    discountType: "Percentage",
    discountValue: 5,
    minOrderValue: 2000,
    maxDiscount: 1000,
    usedCount: 890,
    usageLimit: 1000,
    validUntil: "01 Oct 2026",
    status: false,
  },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "Percentage",
    discountValue: 10,
    minOrderValue: 1000,
    maxDiscount: 1500,
    usageLimit: 500,
    validUntil: "2026-12-31",
  });

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsed = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  const handleToggle = (id) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: !c.status } : c))
    );
  };

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!form.code) return;
    const newCoupon = {
      id: Date.now(),
      code: form.code.toUpperCase().trim(),
      description: form.description || "General Promo Coupon",
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderValue: Number(form.minOrderValue),
      maxDiscount: Number(form.maxDiscount),
      usedCount: 0,
      usageLimit: Number(form.usageLimit),
      validUntil: form.validUntil,
      status: true,
    };
    setCoupons([newCoupon, ...coupons]);
    setShowAddModal(false);
    setForm({
      code: "",
      description: "",
      discountType: "Percentage",
      discountValue: 10,
      minOrderValue: 1000,
      maxDiscount: 1500,
      usageLimit: 500,
      validUntil: "2026-12-31",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-2">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-sm shadow-[0_4px_14px_rgba(100,189,11,0.35)] transition-all"
        >
          <Plus size={16} />
          <span>Create New Coupon</span>
        </button>
      </div>

      {copiedCode && (
        <div className="p-3 rounded-xl bg-[#64BD0B]/15 border border-[#64BD0B]/30 text-[#3B7506] font-bold text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Coupon code "{copiedCode}" copied to clipboard! Ready to apply at POS checkout.</span>
        </div>
      )}

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Promo Codes"
          value={coupons.filter((c) => c.status).length.toString()}
          trend={{ value: `${coupons.length} total created`, positive: true }}
          icon={Tag}
          accent="emerald"
        />
        <StatCard
          label="Total Redemptions"
          value={totalUsed.toLocaleString()}
          trend={{ value: "+210 this month", positive: true }}
          icon={CheckCircle2}
          accent="blue"
        />
        <StatCard
          label="Revenue from Promos"
          value="৳4.85M"
          trend={{ value: "Driven by coupon sales", positive: true }}
          icon={TrendingUp}
          accent="amber"
        />
        <StatCard
          label="Avg Discount Applied"
          value="11.4%"
          trend={{ value: "Healthy margin safety", positive: true }}
          icon={Percent}
          accent="purple"
        />
      </div>

      {/* ━━ Search & Table ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code or campaign..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white/70 text-sm focus:border-[#64BD0B] outline-none"
            />
          </div>
          <span className="text-xs text-slate-400">
            {filteredCoupons.length} coupon(s) listed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Campaign Details</th>
                <th className="py-3.5 px-4">Discount Value</th>
                <th className="py-3.5 px-4">Min Spend / Max Cap</th>
                <th className="py-3.5 px-4 text-center">Usage Progress</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCoupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg text-xs border border-slate-200">
                        {c.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(c.code)}
                        className="text-slate-400 hover:text-slate-700"
                        title="Copy Code"
                      >
                        <Copy size={13} />
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800 text-xs">{c.description}</p>
                    <p className="text-[11px] text-slate-400">{c.discountType}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#3B7506]">
                    {c.discountType === "Percentage" ? `${c.discountValue}% OFF` : `৳${c.discountValue} FLAT`}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    <p>Min: ৳{c.minOrderValue.toLocaleString()}</p>
                    <p className="text-slate-400">Max Cap: ৳{c.maxDiscount.toLocaleString()}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="w-24 mx-auto">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-0.5">
                        <span>{c.usedCount}</span>
                        <span>{c.usageLimit}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#64BD0B] rounded-full"
                          style={{ width: `${Math.min(100, (c.usedCount / c.usageLimit) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {c.validUntil}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggle(c.id)}
                      className="inline-flex items-center"
                    >
                      {c.status ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 text-slate-600">
                          Inactive
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setCoupons(coupons.filter((x) => x.id !== c.id))}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
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

      {/* ━━ Create Coupon Modal ━━━━━━━━━━━━━━━━━━━━ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800">Create Promotional Coupon</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coupon Code:</label>
                  <input
                    type="text"
                    placeholder="e.g. FLASH10, WINTER2026"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] font-mono font-bold outline-none uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Type:</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  >
                    <option value="Percentage">Percentage (% Discount)</option>
                    <option value="Fixed Amount">Fixed Amount (৳ Flat Off)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Campaign Description:</label>
                <input
                  type="text"
                  placeholder="e.g. Summer special savings on consumer electronics"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Value:</label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Order (৳):</label>
                  <input
                    type="number"
                    value={form.minOrderValue}
                    onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Cap (৳):</label>
                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Usage Limit (Total times):</label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valid Until:</label>
                  <input
                    type="date"
                    value={form.validUntil}
                    onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold shadow-md"
                >
                  Publish Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
