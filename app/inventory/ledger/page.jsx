"use client";

import { useState } from "react";
import { FileSpreadsheet, Search, Filter, Download, Printer, Calendar } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { money } from "@/lib/format";

const INITIAL_LEDGER = [
  {
    sku: "IPH-15P-256",
    productName: "iPhone 15 Pro 256GB Natural Titanium",
    category: "Smartphones",
    openingStock: 12,
    inwardQty: 5,
    outwardQty: 3,
    closingStock: 14,
    unitCost: 135000,
    totalValuation: 1890000,
    status: "in_stock",
  },
  {
    sku: "S24U-512-TI",
    productName: "Samsung Galaxy S24 Ultra 512GB",
    category: "Smartphones",
    openingStock: 8,
    inwardQty: 10,
    outwardQty: 4,
    closingStock: 14,
    unitCost: 148000,
    totalValuation: 2072000,
    status: "in_stock",
  },
  {
    sku: "MAC-M3-16",
    productName: "Apple MacBook Air 13' M3 16GB/512GB",
    category: "Laptops",
    openingStock: 6,
    inwardQty: 2,
    outwardQty: 2,
    closingStock: 6,
    unitCost: 152000,
    totalValuation: 912000,
    status: "in_stock",
  },
  {
    sku: "WLT-AC-15T",
    productName: "Walton Inverter AC 1.5 Ton Dual Cool",
    category: "Home Appliances",
    openingStock: 15,
    inwardQty: 8,
    outwardQty: 5,
    closingStock: 18,
    unitCost: 48000,
    totalValuation: 864000,
    status: "in_stock",
  },
  {
    sku: "SNY-55-4K",
    productName: "Sony Bravia 55' 4K UHD Smart Google TV",
    category: "Home Appliances",
    openingStock: 4,
    inwardQty: 2,
    outwardQty: 4,
    closingStock: 2,
    unitCost: 78000,
    totalValuation: 156000,
    status: "low_stock",
  },
];

export default function StockLedgerPage() {
  const [ledger] = useState(INITIAL_LEDGER);
  const [searchTerm, setSearchTerm] = useState("");

  const totalValuation = ledger.reduce((sum, item) => sum + item.totalValuation, 0);
  const totalUnits = ledger.reduce((sum, item) => sum + item.closingStock, 0);

  const filtered = ledger.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Valuation & Audit"
        title="Stock Valuation Ledger"
        description="Comprehensive accounting statement of opening inventory, receipts, sales outflows, and closing balance values."
        action={
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.35)] transition-all hover:scale-[1.02]"
          >
            <Printer size={15} /> Export Ledger Report
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Stock Valuation" value={money(totalValuation)} icon={FileSpreadsheet} trend="At acquisition cost" tone="primary" />
        <StatCard label="Physical Units on Hand" value={`${totalUnits} Pcs`} icon={FileSpreadsheet} trend="Across all outlets" trendUp tone="good" />
        <StatCard label="Stock Turnover Ratio" value="4.8x" icon={FileSpreadsheet} trend="Healthy cadence" tone="warn" />
        <StatCard label="Audited SKUs" value={ledger.length} icon={FileSpreadsheet} trend="Active ledger accounts" tone="primary" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-200/60 flex items-center justify-between gap-3 bg-gradient-to-r from-[#64BD0B]/5 to-transparent">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by SKU code, item name, or category…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#64BD0B]"
            />
          </div>
          <span className="text-[12px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-3 py-1.5 rounded-xl border border-[#64BD0B]/20">
            {ledger.length} Stock Ledger Accounts
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">SKU / Item</th>
                <th className="px-6 py-3.5 font-semibold">Category</th>
                <th className="px-6 py-3.5 font-semibold text-center">Opening</th>
                <th className="px-6 py-3.5 font-semibold text-center text-[#3B7506]">Inward (+)</th>
                <th className="px-6 py-3.5 font-semibold text-center text-rose-600">Outward (-)</th>
                <th className="px-6 py-3.5 font-semibold text-center font-bold">Closing Balance</th>
                <th className="px-6 py-3.5 font-semibold text-right">Unit Cost</th>
                <th className="px-6 py-3.5 font-semibold text-right">Total Asset Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filtered.map((item) => (
                <tr key={item.sku} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{item.productName}</p>
                    <p className="font-mono text-[11px] font-bold text-[#3B7506]">{item.sku}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-medium text-slate-700">
                    {item.openingStock}
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-bold text-[#3B7506]">
                    +{item.inwardQty}
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-bold text-rose-600">
                    -{item.outwardQty}
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-extrabold text-slate-900 text-[14px]">
                    <span className="bg-slate-100 px-3 py-1 rounded-lg">
                      {item.closingStock} pcs
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700">
                    {money(item.unitCost)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-extrabold text-[#3B7506] text-[14px]">
                    {money(item.totalValuation)}
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
