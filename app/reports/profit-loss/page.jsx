"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Printer,
  Calendar,
  Percent,
  CheckCircle2,
  FileText,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import StatCard from "@/components/StatCard";

export default function ProfitLossPage() {
  const [period, setPeriod] = useState("month"); // 'today' | 'week' | 'month' | 'year'

  // Multipliers based on period
  const multiplier = period === "today" ? 0.035 : period === "week" ? 0.25 : period === "year" ? 12 : 1;

  const grossSales = Math.round(4850000 * multiplier);
  const salesReturns = Math.round(58000 * multiplier);
  const netRevenue = grossSales - salesReturns;

  const costOfGoods = Math.round(3450000 * multiplier);
  const freightCost = Math.round(45000 * multiplier);
  const totalCOGS = costOfGoods + freightCost;

  const grossProfit = netRevenue - totalCOGS;
  const grossMargin = ((grossProfit / netRevenue) * 100).toFixed(1);

  // Operating Expenses (OPEX)
  const salaries = Math.round(161000 * multiplier);
  const rentUtilities = Math.round(120000 * multiplier);
  const marketingCoupons = Math.round(85000 * multiplier);
  const posSoftwareDepreciation = Math.round(25000 * multiplier);
  const totalOPEX = salaries + rentUtilities + marketingCoupons + posSoftwareDepreciation;

  const operatingProfit = grossProfit - totalOPEX;
  const taxEstimated = Math.round(operatingProfit * 0.15);
  const netProfit = operatingProfit - taxEstimated;
  const netMargin = ((netProfit / netRevenue) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* ━━ Header ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#64BD0B]/10 text-[#3B7506]">
              <DollarSign size={22} className="text-[#3B7506]" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Real-time Revenue &amp; Profit &amp; Loss (P&amp;L)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time financial income statement detailing gross sales revenue, COGS, gross margins, operational overheads, and net bottom-line profit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => setPeriod("today")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === "today" ? "bg-white text-[#3B7506] shadow-sm" : "text-slate-600"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setPeriod("week")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === "week" ? "bg-white text-[#3B7506] shadow-sm" : "text-slate-600"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setPeriod("month")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === "month" ? "bg-white text-[#3B7506] shadow-sm" : "text-slate-600"
              }`}
            >
              This Month (Oct)
            </button>
            <button
              onClick={() => setPeriod("year")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === "year" ? "bg-white text-[#3B7506] shadow-sm" : "text-slate-600"
              }`}
            >
              YTD 2026
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs"
          >
            <Printer size={14} />
            <span>Print P&amp;L</span>
          </button>
        </div>
      </div>

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Net Sales Revenue"
          value={`৳${netRevenue.toLocaleString()}`}
          trend={{ value: "+14.2% vs last period", positive: true }}
          icon={TrendingUp}
          accent="blue"
        />
        <StatCard
          label="Gross Profit"
          value={`৳${grossProfit.toLocaleString()}`}
          trend={{ value: `${grossMargin}% Gross Margin`, positive: true }}
          icon={DollarSign}
          accent="emerald"
        />
        <StatCard
          label="Operating Expenses (OPEX)"
          value={`৳${totalOPEX.toLocaleString()}`}
          trend={{ value: "Salaries, rent & marketing", positive: false }}
          icon={TrendingDown}
          accent="amber"
        />
        <StatCard
          label="Net Bottom-Line Profit"
          value={`৳${netProfit.toLocaleString()}`}
          trend={{ value: `${netMargin}% Net Margin`, positive: true }}
          icon={CheckCircle2}
          accent="purple"
        />
      </div>

      {/* ━━ Financial Statement Grid ━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Income Statement Detailed Table (8 cols) */}
        <div className="lg:col-span-8 bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h2 className="text-base font-black text-slate-800">
              Audited Income &amp; Expenditure Statement
            </h2>
            <span className="text-xs font-mono font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2.5 py-1 rounded-lg">
              Currency: BDT (৳)
            </span>
          </div>

          <div className="space-y-4 text-sm">
            {/* Section 1: Revenue */}
            <div>
              <div className="flex justify-between items-center font-bold text-slate-800 bg-slate-50/80 px-3 py-2 rounded-xl">
                <span>1. Operating Revenue</span>
                <span>৳{netRevenue.toLocaleString()}</span>
              </div>
              <div className="pl-4 pr-3 py-1.5 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Gross POS &amp; Terminal Sales</span>
                  <span className="font-mono">৳{grossSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-red-500">
                  <span>Less: Customer Returns &amp; Exchanges</span>
                  <span className="font-mono">-৳{salesReturns.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Section 2: COGS */}
            <div>
              <div className="flex justify-between items-center font-bold text-slate-800 bg-slate-50/80 px-3 py-2 rounded-xl">
                <span>2. Cost of Goods Sold (COGS)</span>
                <span className="text-red-600 font-mono">-৳{totalCOGS.toLocaleString()}</span>
              </div>
              <div className="pl-4 pr-3 py-1.5 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Inventory Purchase Cost (FIFO Basis)</span>
                  <span className="font-mono">৳{costOfGoods.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Inbound Freight &amp; Transport</span>
                  <span className="font-mono">৳{freightCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Gross Profit Subtotal */}
            <div className="p-3 bg-emerald-50/80 border border-emerald-200/60 rounded-xl flex items-center justify-between font-extrabold text-[#3B7506]">
              <span>Gross Profit (Revenue – COGS)</span>
              <span className="text-base">৳{grossProfit.toLocaleString()} ({grossMargin}%)</span>
            </div>

            {/* Section 3: OPEX */}
            <div>
              <div className="flex justify-between items-center font-bold text-slate-800 bg-slate-50/80 px-3 py-2 rounded-xl">
                <span>3. Operating Overhead (OPEX)</span>
                <span className="text-red-600 font-mono">-৳{totalOPEX.toLocaleString()}</span>
              </div>
              <div className="pl-4 pr-3 py-1.5 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Employee Salaries &amp; Commissions</span>
                  <span className="font-mono">৳{salaries.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Outlet Rent, Power &amp; Utilities</span>
                  <span className="font-mono">৳{rentUtilities.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Promotional Campaigns &amp; Discount Vouchers</span>
                  <span className="font-mono">৳{marketingCoupons.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hardware &amp; Systems Maintenance</span>
                  <span className="font-mono">৳{posSoftwareDepreciation.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Section 4: Operating Profit */}
            <div className="flex justify-between items-center font-bold text-slate-800 px-3 py-1 border-t border-slate-200 pt-2">
              <span>Operating Profit (EBITDA)</span>
              <span className="font-mono font-black text-slate-900">৳{operatingProfit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 px-3">
              <span>Estimated Corporate Income Tax (15%)</span>
              <span className="font-mono text-red-500">-৳{taxEstimated.toLocaleString()}</span>
            </div>

            {/* Final Net Profit */}
            <div className="p-4 bg-gradient-to-r from-[#64BD0B] to-[#3B7506] text-white rounded-xl flex items-center justify-between font-black text-lg shadow-md">
              <div>
                <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Net Realized Profit</p>
                <p className="text-xl">৳{netProfit.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-bold">
                  {netMargin}% Net Margin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Health & Ratios Card (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5 space-y-4">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">
              Profitability Ratios
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500">Gross Margin:</span>
                  <span className="text-[#3B7506]">{grossMargin}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#64BD0B] rounded-full" style={{ width: `${grossMargin}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500">Net Profit Margin:</span>
                  <span className="text-purple-600">{netMargin}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${Math.min(100, Number(netMargin) * 3)}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500">OPEX to Sales Ratio:</span>
                  <span className="text-amber-600">{((totalOPEX / netRevenue) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${((totalOPEX / netRevenue) * 100).toFixed(1)}%` }} />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-700">Financial Insight:</p>
              <p>Healthy margins maintained across high-velocity appliances and televisions. Cash conversion cycle is currently 14.8 days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
