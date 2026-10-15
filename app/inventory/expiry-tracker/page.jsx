"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Tag,
  ArrowRight,
  Boxes,
  RotateCcw,
  Trash2,
  DollarSign,
  Clock,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const INITIAL_BATCHES = [
  {
    id: "BAT-2025-091",
    sku: "ELEC-BAT-AA",
    product: "Duracell Ultra AA Batteries (Pack of 4)",
    category: "Accessories & Energy",
    warehouse: "Central Hub Warehouse",
    stockQty: 84,
    unitCost: 320,
    mfgDate: "15 Oct 2024",
    expiryDate: "10 Oct 2026",
    daysLeft: -5,
    status: "Expired",
  },
  {
    id: "BAT-2025-112",
    sku: "PRN-INK-680",
    product: "HP 680 Tri-Color Original Ink Cartridge",
    category: "Office & Printing",
    warehouse: "Dhanmondi Flagship Outlet",
    stockQty: 26,
    unitCost: 1450,
    mfgDate: "01 Nov 2024",
    expiryDate: "30 Oct 2026",
    daysLeft: 15,
    status: "Near Expiry (< 30 Days)",
  },
  {
    id: "BAT-2026-004",
    sku: "CLN-SCR-200",
    product: "Antec Anti-Static Screen Cleaner Spray 200ml",
    category: "Maintenance & Care",
    warehouse: "Gulshan Premium Store",
    stockQty: 45,
    unitCost: 450,
    mfgDate: "01 Dec 2024",
    expiryDate: "20 Nov 2026",
    daysLeft: 36,
    status: "Near Expiry (< 60 Days)",
  },
  {
    id: "BAT-2026-033",
    sku: "APL-WR-1Y",
    product: "AppleCare Extended Protection Pack (1-Yr Voucher)",
    category: "Services & Warranty",
    warehouse: "Central Hub Warehouse",
    stockQty: 18,
    unitCost: 6500,
    mfgDate: "01 Jan 2025",
    expiryDate: "25 Nov 2026",
    daysLeft: 41,
    status: "Near Expiry (< 60 Days)",
  },
  {
    id: "BAT-2026-089",
    sku: "SAM-FLT-02",
    product: "Samsung Refrigerator Carbon Deodorizer Filter",
    category: "Appliances Spare",
    warehouse: "Chittagong Regional Depot",
    stockQty: 60,
    unitCost: 850,
    mfgDate: "15 Mar 2025",
    expiryDate: "15 Mar 2027",
    daysLeft: 516,
    status: "Healthy Stock",
  },
];

export default function ExpiryTrackerPage() {
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [actionAlert, setActionAlert] = useState(null);

  const filteredBatches = batches.filter((b) => {
    const matchSearch =
      b.product.toLowerCase().includes(search.toLowerCase()) ||
      b.sku.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const expiredCount = batches.filter((b) => b.daysLeft <= 0).length;
  const nearExpiryCount = batches.filter((b) => b.daysLeft > 0 && b.daysLeft <= 60).length;
  const atRiskValue = batches
    .filter((b) => b.daysLeft <= 60)
    .reduce((sum, b) => sum + b.stockQty * b.unitCost, 0);

  const handleAction = (batch, actionType) => {
    setActionAlert(`Initiated [${actionType}] for Batch ${batch.id} (${batch.product}). Forwarding record...`);
    setTimeout(() => setActionAlert(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* ━━ Header ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#64BD0B]/10 text-[#3B7506]">
              <CalendarClock size={22} className="text-[#3B7506]" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Batch &amp; Expiry Date Tracker
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track product shelf-life, near-expiry alert batches, warranty expirations, and initiate clearance markdowns or vendor returns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/procurement/damage"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
          >
            <Trash2 size={14} />
            <span>Dispose Expired Stock</span>
          </Link>
          <Link
            href="/returns"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-xs shadow-sm transition-all"
          >
            <RotateCcw size={14} />
            <span>Return to Vendor (RTV)</span>
          </Link>
        </div>
      </div>

      {actionAlert && (
        <div className="p-4 rounded-xl bg-[#64BD0B]/15 border border-[#64BD0B]/30 text-[#3B7506] font-bold text-sm flex items-center gap-2">
          <CheckCircle2 size={18} />
          {actionAlert}
        </div>
      )}

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Expired Batches"
          value={`${expiredCount} Batches`}
          trend={{ value: "Immediate disposal required", positive: false }}
          icon={XCircle}
          accent="purple"
        />
        <StatCard
          label="Near-Expiry (< 60 Days)"
          value={`${nearExpiryCount} Batches`}
          trend={{ value: "Eligible for clearance discount", positive: false }}
          icon={AlertTriangle}
          accent="amber"
        />
        <StatCard
          label="Stock Value at Expiry Risk"
          value={`৳${atRiskValue.toLocaleString()}`}
          trend={{ value: "Cost basis evaluation", positive: false }}
          icon={DollarSign}
          accent="blue"
        />
        <StatCard
          label="FEFO Algorithm Compliance"
          value="98.4%"
          trend={{ value: "First-Expiring First-Out", positive: true }}
          icon={CheckCircle2}
          accent="emerald"
        />
      </div>

      {/* ━━ Search & Filter Bar ━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product, SKU, or Batch No..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white/70 text-sm focus:border-[#64BD0B] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none"
            >
              <option value="All">All Health Statuses</option>
              <option value="Expired">Expired</option>
              <option value="Near Expiry (< 30 Days)">Near Expiry (&lt; 30 Days)</option>
              <option value="Near Expiry (< 60 Days)">Near Expiry (&lt; 60 Days)</option>
              <option value="Healthy Stock">Healthy Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* ━━ Batches Table ━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Batch ID &amp; SKU</th>
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-4">Location / Depot</th>
                <th className="py-3.5 px-4 text-center">In-Stock Qty</th>
                <th className="py-3.5 px-4 text-right">Unit Cost</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4 text-center">Days Remaining</th>
                <th className="py-3.5 px-4 text-center">Urgency</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBatches.map((b) => (
                <tr key={b.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-mono font-bold text-slate-900 text-xs">{b.id}</p>
                    <p className="text-[11px] font-mono text-slate-400">{b.sku}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{b.product}</p>
                    <p className="text-xs text-slate-400">{b.category}</p>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {b.warehouse}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {b.stockQty} pcs
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                    ৳{b.unitCost.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-800">
                    {b.expiryDate}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-xs">
                    {b.daysLeft < 0 ? (
                      <span className="text-red-600">Expired ({Math.abs(b.daysLeft)}d ago)</span>
                    ) : (
                      <span className={b.daysLeft <= 30 ? "text-amber-600 font-extrabold" : "text-emerald-700"}>
                        {b.daysLeft} days
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        b.status === "Expired"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : b.status.includes("< 30")
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : b.status.includes("< 60")
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {b.daysLeft > 0 ? (
                        <button
                          type="button"
                          onClick={() => handleAction(b, "Markdown Discount")}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm"
                          title="Apply Clearance Markdown"
                        >
                          Markdown
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAction(b, "Vendor Return RTV")}
                          className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold text-xs shadow-sm"
                          title="Return to Vendor"
                        >
                          RTV
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
