"use client";

import { useState } from "react";
import {
  CalendarClock,
  Printer,
  Download,
  AlertTriangle,
  DollarSign,
  TrendingDown,
  Clock,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const TIMELINE_BUCKETS = [
  { range: "0 - 30 Days (Critical)", batchCount: 4, stockUnits: 145, estimatedLoss: 84200, riskLevel: "Critical Urgent", color: "bg-red-500 text-white" },
  { range: "31 - 60 Days (High Risk)", batchCount: 7, stockUnits: 320, estimatedLoss: 165000, riskLevel: "High Attention", color: "bg-amber-500 text-white" },
  { range: "61 - 90 Days (Moderate)", batchCount: 12, stockUnits: 580, estimatedLoss: 290000, riskLevel: "Moderate Planning", color: "bg-yellow-500 text-white" },
  { range: "90+ Days (Healthy Horizon)", batchCount: 48, stockUnits: 3400, estimatedLoss: 0, riskLevel: "Safe Stock", color: "bg-[#64BD0B] text-white" },
];

const VULNERABLE_CATEGORIES = [
  { category: "Battery Packs & Rechargeable Cells", totalSKUs: 8, atRiskVal: 112000, recommendedAction: "Apply 25% Flash Clearance Bundle" },
  { category: "Chemical Cleaners & Sprays", totalSKUs: 5, atRiskVal: 48500, recommendedAction: "Free gift with Monitor & TV purchases" },
  { category: "Printer Inks & Cartridges", totalSKUs: 6, atRiskVal: 88700, recommendedAction: "Distributor Buyback / RTV" },
  { category: "Extended Warranty Vouchers", totalSKUs: 3, atRiskVal: 195000, recommendedAction: "Sales Team Target Incentive" },
];

export default function ExpiryForecastPage() {
  const totalAtRisk = TIMELINE_BUCKETS.slice(0, 3).reduce((acc, b) => acc + b.estimatedLoss, 0);

  return (
    <div className="space-y-6">
      {/* ━━ Print Action ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-2">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs"
        >
          <Printer size={14} />
          <span>Export Expiry Audit</span>
        </button>
      </div>

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Potential Write-off"
          value={`৳${totalAtRisk.toLocaleString()}`}
          trend={{ value: "Within next 90 days", positive: false }}
          icon={TrendingDown}
          accent="purple"
        />
        <StatCard
          label="Immediate Critical Batches"
          value="4 Batches"
          trend={{ value: "Under 30 days remaining", positive: false }}
          icon={AlertTriangle}
          accent="amber"
        />
        <StatCard
          label="Safe Inventory Horizon"
          value="82.4%"
          trend={{ value: "Healthy shelf life", positive: true }}
          icon={CalendarClock}
          accent="emerald"
        />
        <StatCard
          label="Preventive Recovery Target"
          value="৳450,000"
          trend={{ value: "Via clearance markdowns", positive: true }}
          icon={DollarSign}
          accent="blue"
        />
      </div>

      {/* ━━ Timeline Buckets Grid ━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TIMELINE_BUCKETS.map((b) => (
          <div
            key={b.range}
            className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-xs text-slate-800">{b.range}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.color}`}>
                  {b.riskLevel}
                </span>
              </div>
              <p className="text-xl font-black text-slate-900 mt-2">
                ৳{b.estimatedLoss.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Potential cost value loss</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>{b.batchCount} Batches</span>
              <span className="font-bold">{b.stockUnits} units</span>
            </div>
          </div>
        ))}
      </div>

      {/* ━━ Category Vulnerability Table ━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert size={16} className="text-amber-600" />
            <span>Category Expiry Exposure &amp; Action Plan</span>
          </h2>
          <span className="text-xs text-slate-400">Automated liquidation recommendations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Category Name</th>
                <th className="py-3.5 px-4 text-center">At-Risk SKUs</th>
                <th className="py-3.5 px-4 text-right">Potential Financial Loss</th>
                <th className="py-3.5 px-4">Recommended Liquidation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {VULNERABLE_CATEGORIES.map((cat, idx) => (
                <tr key={idx} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {cat.category}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                    {cat.totalSKUs} items
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-red-600">
                    ৳{cat.atRiskVal.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-[#3B7506]">
                    {cat.recommendedAction}
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
