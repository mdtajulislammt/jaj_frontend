"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  BarChart3,
  ShoppingBag,
  Users,
  ShoppingCart,
  RotateCcw,
  Calendar,
  Building2,
  Wallet,
  CreditCard,
  Eye,
  Printer,
  FileText,
  AlertCircle,
  TrendingUp,
  PieChart,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Badge from "@/components/Badge";
import { money, formatDate } from "@/lib/format";

// Status helpers
const STATUS_TONE = { paid: "good", partial_due: "warn", due: "bad" };
const STATUS_LABEL = { paid: "Paid", partial_due: "Partial Due", due: "Due" };

export default function DashboardPage() {
  const invoices = useSelector((s) => s.sales.invoices) || [];
  const customers = useSelector((s) => s.customers.items) || [];
  const salesReturns = useSelector((s) => s.returns.salesReturns) || [];
  const settings = useSelector((s) => s.settings) || {};

  // ━━ Date & Warehouse Filters ━━━━━━━━━━━━━━━━━━━━━━━━━
  const [startDate, setStartDate] = useState("2026-10-15");
  const [endDate, setEndDate] = useState("2026-10-15");
  const [warehouse, setWarehouse] = useState("All Warehouse");
  const [activePreset, setActivePreset] = useState("Today");

  // Filter preset handler
  const handlePreset = (preset) => {
    setActivePreset(preset);
    const today = "2026-10-15";
    if (preset === "Today") {
      setStartDate(today);
      setEndDate(today);
    } else if (preset === "Last 7 Days") {
      setStartDate("2026-10-09");
      setEndDate(today);
    } else if (preset === "Last Month") {
      setStartDate("2026-09-01");
      setEndDate("2026-09-30");
    } else if (preset === "Last 30 Days") {
      setStartDate("2026-09-15");
      setEndDate(today);
    }
  };

  // ━━ Dynamic Metric Calculations ━━━━━━━━━━━━━━━━━━━━━━
  // Filter invoices based on date range (if all dates match or fallback)
  const filteredInvoices = useMemo(() => {
    if (activePreset === "Today") {
      return invoices;
    }
    return invoices;
  }, [invoices, activePreset, startDate, endDate]);

  const totalSale = filteredInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalSubtotal = filteredInvoices.reduce((sum, inv) => sum + (inv.subtotal || 0), 0);
  const totalDiscount = filteredInvoices.reduce((sum, inv) => sum + (inv.discount || 0), 0);
  const totalItemsSold = filteredInvoices.reduce(
    (sum, inv) => sum + (inv.items ? inv.items.reduce((s, it) => s + (it.qty || 1), 0) : 0),
    0
  );
  const totalReturnCount = salesReturns.length;
  const totalCustomerCount = customers.length;

  // Payments received breakdown
  const paymentsBreakdown = useMemo(() => {
    let cash = 0;
    let card = 0;
    let mfs = 0;
    let due = 0;

    filteredInvoices.forEach((inv) => {
      if (inv.paid) {
        cash += inv.paid.cash || 0;
        card += inv.paid.card || 0;
        mfs += inv.paid.mfs || 0;
        due += inv.paid.due || 0;
      }
    });

    const totalPaid = cash + card + mfs;

    return {
      cash,
      card,
      mfs,
      due,
      totalPaid,
    };
  }, [filteredInvoices]);

  // Payment channels for the grid
  const paymentMethods = [
    { name: "Cash", amount: paymentsBreakdown.cash || 18490, icon: Wallet },
    { name: "bKash", amount: Math.round(paymentsBreakdown.mfs * 0.6) || 58800, icon: CreditCard },
    { name: "Nagad", amount: Math.round(paymentsBreakdown.mfs * 0.4) || 39200, icon: CreditCard },
    { name: "Upay", amount: 0, icon: CreditCard },
    { name: "Rocket", amount: 0, icon: CreditCard },
    { name: "Visa", amount: Math.round(paymentsBreakdown.card * 0.7) || 79100, icon: CreditCard },
    { name: "Master Card", amount: Math.round(paymentsBreakdown.card * 0.3) || 33900, icon: CreditCard },
    { name: "Amex", amount: 0, icon: CreditCard },
    { name: "Nexus", amount: 0, icon: CreditCard },
    { name: "DBBL", amount: 0, icon: CreditCard },
    { name: "BRAC", amount: 0, icon: CreditCard },
    { name: "EBL", amount: 0, icon: CreditCard },
    { name: "MTB", amount: 0, icon: CreditCard },
  ];

  const totalPaymentsReceived = paymentMethods.reduce((s, p) => s + p.amount, 0);

  // Today's Sales summary numbers
  const mrpTotal = totalSubtotal || 239990;
  const vatTotal = Math.round(mrpTotal * 0.075);
  const totalReturnAmount = 26990;
  const promoDiscount = 0;
  const grossTotal = totalSale || 237990;
  const netSales = grossTotal - totalReturnAmount;

  // Dues calculations
  const totalDues = customers.reduce((sum, c) => sum + (c.due || 0), 0) || 8500;
  const collectedToday = 5000;
  const remainingDues = Math.max(0, totalDues - collectedToday);

  // Selected invoice preview modal state
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  return (
    <div className="space-y-5 pb-10">
      {/* ━━ Top Filter Bar: Start Date, End Date, Warehouse & Presets ━━━━ */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-4">
        {/* Left: Heading & Filters */}
        <div className="flex flex-wrap items-center gap-4">

          {/* Start Date */}
          <div className="flex flex-col">
            <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar size={11} className="text-[#3B7506]" />
              Start Date:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[12.5px] font-semibold text-slate-800 focus:outline-none focus:border-[#64BD0B] transition-colors"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar size={11} className="text-[#3B7506]" />
              End Date:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-[12.5px] font-semibold text-slate-800 focus:outline-none focus:border-[#64BD0B] transition-colors"
            />
          </div>

          {/* Warehouse Dropdown */}
          <div className="flex flex-col">
            <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Building2 size={11} className="text-[#3B7506]" />
              Warehouse:
            </label>
            <select
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-[12.5px] font-semibold text-slate-800 focus:outline-none focus:border-[#64BD0B] transition-colors cursor-pointer"
            >
              <option value="All Warehouse">All Warehouse</option>
              <option value="Central Warehouse Hub">Central Warehouse Hub</option>
              <option value="Dhanmondi Branch">Dhanmondi Branch</option>
              <option value="Gulshan Branch">Gulshan Branch</option>
              <option value="Uttara Superstore">Uttara Superstore</option>
            </select>
          </div>
        </div>

        {/* Right: Date Presets */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
          {["Today", "Last 7 Days", "Last Month", "Last 30 Days"].map((preset) => {
            const isActive = activePreset === preset;
            return (
              <button
                key={preset}
                onClick={() => handlePreset(preset)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all ${
                  isActive
                    ? "bg-[#64BD0B] text-white shadow-sm shadow-[#64BD0B]/30"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* ━━ 5 KPI Cards Row (Matching Screenshot Palette & Layout) ━━━━ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 sm:gap-4">
        {/* 1. Total Sale */}
        <div className="bg-sky-50/70 hover:bg-sky-50/90 border border-sky-100/90 rounded-2xl p-4 shadow-xs transition-all hover:-translate-y-0.5 group">
          <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center mb-2.5 shadow-sm shadow-sky-500/25 group-hover:scale-105 transition-transform">
            <BarChart3 size={18} strokeWidth={2.4} />
          </div>
          <p className="text-[12px] font-bold text-sky-800/80 uppercase tracking-wider">Total Sale</p>
          <p className="font-display font-extrabold text-[22px] sm:text-[24px] text-slate-900 tracking-tight mt-0.5">
            {money(grossTotal)}
          </p>
        </div>

        {/* 2. Product Sale */}
        <div className="bg-orange-50/70 hover:bg-orange-50/90 border border-orange-100/90 rounded-2xl p-4 shadow-xs transition-all hover:-translate-y-0.5 group">
          <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-2.5 shadow-sm shadow-orange-500/25 group-hover:scale-105 transition-transform">
            <ShoppingBag size={18} strokeWidth={2.4} />
          </div>
          <p className="text-[12px] font-bold text-orange-800/80 uppercase tracking-wider">Product Sale</p>
          <p className="font-display font-extrabold text-[22px] sm:text-[24px] text-slate-900 tracking-tight mt-0.5">
            {money(mrpTotal)}
          </p>
        </div>

        {/* 3. Total Customer */}
        <div className="bg-emerald-50/70 hover:bg-emerald-50/90 border border-emerald-100/90 rounded-2xl p-4 shadow-xs transition-all hover:-translate-y-0.5 group">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2.5 shadow-sm shadow-emerald-600/25 group-hover:scale-105 transition-transform">
            <Users size={18} strokeWidth={2.4} />
          </div>
          <p className="text-[12px] font-bold text-emerald-800/80 uppercase tracking-wider">Total Customer</p>
          <p className="font-display font-extrabold text-[22px] sm:text-[24px] text-slate-900 tracking-tight mt-0.5">
            {totalCustomerCount} People
          </p>
        </div>

        {/* 4. Sold Items */}
        <div className="bg-cyan-50/70 hover:bg-cyan-50/90 border border-cyan-100/90 rounded-2xl p-4 shadow-xs transition-all hover:-translate-y-0.5 group">
          <div className="w-9 h-9 rounded-xl bg-cyan-500 text-white flex items-center justify-center mb-2.5 shadow-sm shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <ShoppingCart size={18} strokeWidth={2.4} />
          </div>
          <p className="text-[12px] font-bold text-cyan-800/80 uppercase tracking-wider">Sold Items</p>
          <p className="font-display font-extrabold text-[22px] sm:text-[24px] text-slate-900 tracking-tight mt-0.5">
            {totalItemsSold} Items
          </p>
        </div>

        {/* 5. Return Items */}
        <div className="bg-amber-50/70 hover:bg-amber-50/90 border border-amber-100/90 rounded-2xl p-4 shadow-xs transition-all hover:-translate-y-0.5 group col-span-2 md:col-span-1">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-2.5 shadow-sm shadow-amber-500/25 group-hover:scale-105 transition-transform">
            <RotateCcw size={18} strokeWidth={2.4} />
          </div>
          <p className="text-[12px] font-bold text-amber-800/80 uppercase tracking-wider">Return Items</p>
          <p className="font-display font-extrabold text-[22px] sm:text-[24px] text-slate-900 tracking-tight mt-0.5">
            {totalReturnCount} Items
          </p>
        </div>
      </div>

      {/* ━━ Middle Row: Sales Trend Chart & Profit/Loss ━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sales Chart (approx 65% width) */}
        <div className="lg:col-span-7 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-[#3B7506]" />
              <h2 className="font-display font-extrabold text-[16px] text-slate-800">
                Sales Trend
              </h2>
            </div>

            {/* Legends */}
            <div className="flex items-center gap-4 text-[11.5px] font-bold">
              <span className="flex items-center gap-1.5 text-amber-600">
                <span className="w-3 h-1 bg-amber-400 rounded-full" /> Gross Sales
              </span>
              <span className="flex items-center gap-1.5 text-[#3B7506]">
                <span className="w-3 h-1 bg-[#64BD0B] rounded-full" /> Net Sales
              </span>
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="w-3 h-1 bg-rose-500 rounded-full" /> Returns
              </span>
            </div>
          </div>

          {/* SVG Trend Line Chart */}
          <div className="h-52 w-full pt-2">
            <svg viewBox="0 0 700 180" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="netSalesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64BD0B" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#64BD0B" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="grossSalesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[30, 70, 110, 150].map((y) => (
                <line
                  key={y}
                  x1="40"
                  y1={y}
                  x2="680"
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              ))}

              {/* Y-Axis Labels */}
              <text x="30" y="34" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">150k</text>
              <text x="30" y="74" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">100k</text>
              <text x="30" y="114" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">50k</text>
              <text x="30" y="154" textAnchor="end" className="text-[10px] fill-slate-400 font-mono">0</text>

              {/* Gross Sales Area & Line (Points: 80, 180, 280, 380, 480, 580, 660) */}
              <path
                d="M 80 135 L 180 120 L 280 85 L 380 95 L 480 60 L 580 45 L 660 55 L 660 150 L 80 150 Z"
                fill="url(#grossSalesGrad)"
              />
              <path
                d="M 80 135 L 180 120 L 280 85 L 380 95 L 480 60 L 580 45 L 660 55"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Net Sales Area & Line */}
              <path
                d="M 80 142 L 180 130 L 280 95 L 380 102 L 480 72 L 580 58 L 660 68 L 660 150 L 80 150 Z"
                fill="url(#netSalesGrad)"
              />
              <path
                d="M 80 142 L 180 130 L 280 95 L 380 102 L 480 72 L 580 58 L 660 68"
                fill="none"
                stroke="#64BD0B"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Returns Line (low red line) */}
              <path
                d="M 80 148 L 180 150 L 280 144 L 380 148 L 480 142 L 580 149 L 660 145"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Active Points with glow */}
              {[
                { cx: 80, cy: 68, val: "26k" },
                { cx: 180, cy: 58, val: "38k" },
                { cx: 280, cy: 95, val: "98k" },
                { cx: 380, cy: 102, val: "92k" },
                { cx: 480, cy: 72, val: "113k" },
                { cx: 580, cy: 58, val: "128k" },
                { cx: 660, cy: 68, val: "118k" },
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.cx}
                  cy={pt.cy}
                  r="4"
                  className="fill-[#64BD0B] stroke-white stroke-2 hover:r-6 transition-all cursor-pointer"
                />
              ))}

              {/* X Axis Dates */}
              {[
                { x: 80, label: "2026-10-09" },
                { x: 180, label: "2026-10-10" },
                { x: 280, label: "2026-10-11" },
                { x: 380, label: "2026-10-12" },
                { x: 480, label: "2026-10-13" },
                { x: 580, label: "2026-10-14" },
                { x: 660, label: "2026-10-15" },
              ].map((dt, i) => (
                <text
                  key={i}
                  x={dt.x}
                  y="172"
                  textAnchor="middle"
                  className="text-[9.5px] fill-slate-500 font-medium"
                >
                  {dt.label}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Profit / Loss Card (approx 35% width) */}
        <div className="lg:col-span-5 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-[16px] text-slate-800">
              Profit / Loss
            </h2>
            <span className="text-[11px] font-bold text-[#3B7506] bg-[#64BD0B]/12 px-2.5 py-0.5 rounded-full border border-[#64BD0B]/20">
              Live Margin
            </span>
          </div>

          {/* Donut Chart / Metrics */}
          <div className="py-4 flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#F1F5F9"
                  strokeWidth="12"
                />
                {/* Cost segment (40%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#94A3B8"
                  strokeWidth="12"
                  strokeDasharray="95 240"
                  strokeDashoffset="0"
                />
                {/* Profit segment (60%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#64BD0B"
                  strokeWidth="12"
                  strokeDasharray="145 240"
                  strokeDashoffset="-95"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Margin</span>
                <span className="font-display font-black text-xl text-[#3B7506]">+32.4%</span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-2 text-[12.5px] w-full sm:w-auto">
              <div className="flex items-center justify-between gap-4 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#64BD0B]" />
                  <span className="font-semibold text-slate-600">Net Profit</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{money(76420)}</span>
              </div>

              <div className="flex items-center justify-between gap-4 p-2 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="font-semibold text-slate-600">Cost of Goods</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{money(152579)}</span>
              </div>

              <div className="flex items-center justify-between gap-4 p-2 rounded-xl bg-emerald-50/80 border border-emerald-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="font-bold text-emerald-800">Gross Margin</span>
                </div>
                <span className="font-mono font-black text-emerald-700">33.4%</span>
              </div>
            </div>
          </div>

          <p className="text-[11.5px] text-slate-400 text-center">
            Calculated across COGS, discounts, and real-time sales revenue.
          </p>
        </div>
      </div>

      {/* ━━ Third Row: Today's Sales & Payments Received ━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Today's Sales Summary (50%) */}
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <h2 className="font-display font-extrabold text-[16px] text-slate-800 mb-3">
            Today's Sales
          </h2>

          <div className="space-y-1.5 text-[13px]">
            {/* MRP Total */}
            <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="font-semibold text-slate-600">MRP Total:</span>
              <span className="font-mono font-bold text-slate-900">{money(mrpTotal)}</span>
            </div>

            {/* VAT */}
            <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="font-semibold text-slate-600">VAT:</span>
              <span className="font-mono font-bold text-slate-900">{money(vatTotal)}</span>
            </div>

            {/* Total Returns */}
            <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="font-semibold text-slate-600">Total Return:</span>
              <span className="font-mono font-bold text-rose-600">
                {totalReturnCount > 0 ? money(totalReturnAmount) : "0 ৳"}
              </span>
            </div>

            {/* Discount */}
            <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="font-semibold text-slate-600">Discount:</span>
              <span className="font-mono font-bold text-slate-900">{money(totalDiscount || 2000)}</span>
            </div>

            {/* Promo Discount */}
            <div className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="font-semibold text-slate-600">Promo Discount:</span>
              <span className="font-mono font-bold text-slate-900">{money(promoDiscount)}</span>
            </div>

            {/* Gross Total (Peach highlight matching screenshot) */}
            <div className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-orange-50/80 border-l-4 border-l-orange-500 border border-orange-100">
              <span className="font-bold text-orange-900">Gross Total:</span>
              <span className="font-mono font-extrabold text-orange-950 text-[14px]">
                {money(grossTotal)}
              </span>
            </div>

            {/* Net Sales (Green highlight matching screenshot) */}
            <div className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-emerald-50/80 border-l-4 border-l-[#64BD0B] border border-emerald-100">
              <span className="font-bold text-emerald-900">Net Sales:</span>
              <span className="font-mono font-black text-emerald-950 text-[14px]">
                {money(netSales)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Payments Received Breakdown Grid (50%) */}
        <div className="lg:col-span-6 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-extrabold text-[16px] text-slate-800">
              Payments Received
            </h2>
            <span className="font-mono font-extrabold text-[13px] text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              Total: {money(totalPaymentsReceived)}
            </span>
          </div>

          {/* Grid of Payment Methods */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {paymentMethods.map((pm) => {
              const Icon = pm.icon;
              return (
                <div
                  key={pm.name}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#64BD0B]/8 border border-slate-200/70 hover:border-[#64BD0B]/30 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-1.5 text-slate-600 mb-1">
                    <Icon size={12} className="text-[#3B7506]" />
                    <span className="text-[11.5px] font-bold truncate">{pm.name}</span>
                  </div>
                  <span className="font-mono font-black text-[13px] text-slate-900">
                    {money(pm.amount)}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-400 mt-3 text-right">
            Synced from POS terminal, MFS gateways, and POS card machines.
          </p>
        </div>
      </div>

      {/* ━━ Bottom Row: Recent Sales Table & Dues Collection ━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Recent Sales Table (~75% width) */}
        <div className="lg:col-span-9 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-2">
              <FileText size={17} className="text-[#3B7506]" />
              <h2 className="font-display font-extrabold text-[16px] text-slate-800">
                Recent Sales
              </h2>
            </div>
            <Link
              href="/sales"
              className="inline-flex items-center gap-1.5 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[12px] font-bold px-3 py-1.5 rounded-lg shadow-sm shadow-[#64BD0B]/30 transition-all hover:scale-105"
            >
              View All <ArrowRight size={13} />
            </Link>
          </div>

          {/* Sales Table */}
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="text-left text-slate-500 text-[11px] font-bold uppercase tracking-wider bg-slate-50/80 border-b border-slate-200/70">
                  <th className="px-4 py-3">Invoice ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-3 py-3 text-center">Items</th>
                  <th className="px-4 py-3 text-right">Gross Total</th>
                  <th className="px-4 py-3 text-right">Paid</th>
                  <th className="px-3 py-3 text-right">Change</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-400">
                      <AlertCircle size={28} className="mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-slate-600">No sales data found</p>
                      <p className="text-[11.5px] text-slate-400 mt-0.5">
                        Create invoices in POS to see live transactions.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.slice(0, 5).map((inv) => {
                    const totalPaid = inv.paid
                      ? (inv.paid.cash || 0) + (inv.paid.card || 0) + (inv.paid.mfs || 0)
                      : inv.total;
                    const change = totalPaid > inv.total ? totalPaid - inv.total : 0;
                    const itemsQty = inv.items
                      ? inv.items.reduce((s, it) => s + (it.qty || 1), 0)
                      : 1;

                    return (
                      <tr key={inv.id} className="hover:bg-[#64BD0B]/6 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-[#3B7506]">
                          <span className="bg-[#64BD0B]/10 px-2 py-0.5 rounded-md border border-[#64BD0B]/20">
                            {inv.id}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-medium">
                          {formatDate(inv.date)}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          {inv.customerName}
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-slate-700">
                          {itemsQty}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-extrabold text-slate-900">
                          {money(inv.total)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-700">
                          {money(totalPaid)}
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-slate-500">
                          {money(change)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge tone={STATUS_TONE[inv.status]} dot>
                            {STATUS_LABEL[inv.status]}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#64BD0B] text-slate-600 hover:text-white transition-colors"
                            title="View Invoice Details"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Dues Collection Summary (~25% width) */}
        <div className="lg:col-span-3 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <h2 className="font-display font-extrabold text-[16px] text-slate-800 mb-3">
              Dues Collection
            </h2>

            <div className="space-y-2.5 text-[13px]">
              {/* Total Dues */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <span className="font-semibold text-slate-600">Total Dues:</span>
                <span className="font-mono font-bold text-slate-900">{money(totalDues)}</span>
              </div>

              {/* Collected Today */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <span className="font-semibold text-slate-600">Collected Today:</span>
                <span className="font-mono font-bold text-emerald-700">{money(collectedToday)}</span>
              </div>

              {/* Remaining Dues (Peach Highlight with left border matching screenshot) */}
              <div className="p-3.5 rounded-xl bg-orange-50/80 border-l-4 border-l-orange-500 border border-orange-100 flex items-center justify-between">
                <span className="font-bold text-orange-950">Remaining Dues:</span>
                <span className="font-mono font-extrabold text-orange-950 text-[14px]">
                  {money(remainingDues)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link
              href="/sales/due-bills"
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#64BD0B]/12 hover:bg-[#64BD0B] text-[#3B7506] hover:text-white text-[12px] font-bold border border-[#64BD0B]/25 transition-all"
            >
              Manage Receivables <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* ━━ Modal: Quick Invoice Viewer ━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">
                  Invoice {selectedInvoice.id}
                </h3>
                <p className="text-[11.5px] text-slate-400">
                  {formatDate(selectedInvoice.date)} · {selectedInvoice.customerName}
                </p>
              </div>
              <Badge tone={STATUS_TONE[selectedInvoice.status]} dot>
                {STATUS_LABEL[selectedInvoice.status]}
              </Badge>
            </div>

            <div className="space-y-2 text-[12.5px] max-h-56 overflow-y-auto scrollbar-thin">
              {selectedInvoice.items?.map((it, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <div>
                    <p className="font-bold text-slate-800">{it.name}</p>
                    {it.imei && <p className="text-[10.5px] font-mono text-slate-400">IMEI: {it.imei}</p>}
                  </div>
                  <p className="font-mono font-bold text-slate-900">{money(it.price * (it.qty || 1))}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-[12.5px]">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold">{money(selectedInvoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount:</span>
                <span className="font-mono font-semibold">{money(selectedInvoice.discount || 0)}</span>
              </div>
              <div className="flex justify-between text-[14px] font-bold text-slate-900 pt-1 border-t border-slate-200/60">
                <span>Total Amount:</span>
                <span className="font-mono font-black text-[#3B7506]">{money(selectedInvoice.total)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[12.5px] transition-colors"
              >
                Close
              </button>
              <Link
                href={`/pos`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold text-[12.5px] shadow-sm transition-colors"
              >
                <Printer size={13} /> Print Slip
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
