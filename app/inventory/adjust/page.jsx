"use client";

import { useState } from "react";
import { Plus, ArrowUpDown, CheckCircle2, AlertTriangle, Search, X, Package } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";

const INITIAL_ADJUSTMENTS = [
  {
    id: "ADJ-204",
    date: "2026-10-14",
    productName: "Apple 20W USB-C Power Adapter",
    sku: "ANK-20W-WHT",
    systemStock: 45,
    physicalStock: 48,
    variance: 3,
    type: "positive",
    reason: "Found unrecorded carton during physical shelf audit",
    authorizedBy: "Store Manager",
  },
  {
    id: "ADJ-203",
    date: "2026-10-12",
    productName: "Sony WH-1000XM5 Wireless Headphones",
    sku: "SNY-XM5-SLV",
    systemStock: 12,
    physicalStock: 11,
    variance: -1,
    type: "negative",
    reason: "Discrepancy audit loss / display demo unit decommission",
    authorizedBy: "Tajul Islam",
  },
  {
    id: "ADJ-202",
    date: "2026-10-08",
    productName: "Xiaomi 67W Turbo Charger",
    sku: "MI-67W-FAST",
    systemStock: 30,
    physicalStock: 32,
    variance: 2,
    type: "positive",
    reason: "Returned customer replacement returned to shelf",
    authorizedBy: "Inventory Clerk",
  },
];

export default function InventoryAdjustPage() {
  const [adjustments, setAdjustments] = useState(INITIAL_ADJUSTMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    productName: "",
    sku: "",
    systemStock: "10",
    physicalStock: "10",
    reason: "Periodic shelf count verification audit",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.productName) return;
    const sys = Number(form.systemStock) || 0;
    const phys = Number(form.physicalStock) || 0;
    const diff = phys - sys;

    const item = {
      id: `ADJ-${Math.floor(200 + Math.random() * 800)}`,
      date: "Today",
      productName: form.productName,
      sku: form.sku || "SKU-AUTO",
      systemStock: sys,
      physicalStock: phys,
      variance: diff,
      type: diff >= 0 ? "positive" : "negative",
      reason: form.reason,
      authorizedBy: "Admin",
    };
    setAdjustments([item, ...adjustments]);
    setForm({ productName: "", sku: "", systemStock: "10", physicalStock: "10", reason: "Periodic shelf count verification audit" });
    setModalOpen(false);
  };

  const filtered = adjustments.filter(
    (a) =>
      a.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Stock Management"
        title="Inventory Stock Adjustments"
        description="Reconcile physical stock counts with digital books to eliminate discrepancy variances."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.35)] transition-all hover:scale-[1.02]"
          >
            <Plus size={16} /> New Stock Adjustment
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Adjustments Logged" value={adjustments.length} icon={ArrowUpDown} tone="primary" />
        <StatCard label="Net Variance" value="+4 Pcs" icon={Package} trend="Physical balance higher" trendUp tone="good" />
        <StatCard label="Audit Compliance" value="99.4%" icon={CheckCircle2} trend="Shelf count accuracy" tone="warn" />
        <StatCard label="Discrepancy Rate" value="0.6%" icon={AlertTriangle} trend="Well below 2% limit" tone="primary" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-200/60 flex items-center justify-between gap-3 bg-gradient-to-r from-[#64BD0B]/5 to-transparent">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by SKU, item name or adjustment ID…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#64BD0B]"
            />
          </div>
          <span className="text-[12px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-3 py-1.5 rounded-xl border border-[#64BD0B]/20">
            {adjustments.length} Records
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">Adjustment ID</th>
                <th className="px-6 py-3.5 font-semibold">Product &amp; SKU</th>
                <th className="px-6 py-3.5 font-semibold text-center">System Stock</th>
                <th className="px-6 py-3.5 font-semibold text-center">Physical Count</th>
                <th className="px-6 py-3.5 font-semibold text-center">Variance (+/-)</th>
                <th className="px-6 py-3.5 font-semibold">Adjustment Reason</th>
                <th className="px-6 py-3.5 font-semibold">Authorized By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-[#3B7506]">
                    <span className="bg-[#64BD0B]/10 px-2.5 py-1 rounded-md border border-[#64BD0B]/20">
                      {a.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{a.productName}</p>
                    <p className="text-[11.5px] font-mono text-slate-400">{a.sku}</p>
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-medium text-slate-700">
                    {a.systemStock} pcs
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-bold text-slate-900">
                    {a.physicalStock} pcs
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-block font-mono font-bold px-2.5 py-1 rounded-md text-[13px] ${
                        a.variance > 0
                          ? "bg-[#64BD0B]/15 text-[#3B7506] border border-[#64BD0B]/30"
                          : a.variance < 0
                          ? "bg-rose-100 text-rose-700 border border-rose-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {a.variance > 0 ? `+${a.variance}` : a.variance}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-[12px] max-w-xs">
                    {a.reason}
                  </td>
                  <td className="px-6 py-4 text-slate-800 font-semibold text-[12.5px]">
                    {a.authorizedBy}
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
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Create Stock Adjustment</h3>
            <p className="text-[12px] text-slate-500 mb-4">Reconcile physical stock discrepancy.</p>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Product Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Walton Inverter AC 1.5T"
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">SKU Code</label>
                <input
                  type="text"
                  placeholder="e.g. WLT-AC-15T"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">System Count (Digital)</label>
                  <input
                    type="number"
                    value={form.systemStock}
                    onChange={(e) => setForm({ ...form, systemStock: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Physical Count (Real)</label>
                  <input
                    type="number"
                    value={form.physicalStock}
                    onChange={(e) => setForm({ ...form, physicalStock: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Audit Justification Note</label>
                <textarea
                  rows={2}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
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
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
