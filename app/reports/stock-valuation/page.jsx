"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  Printer,
  Download,
  Filter,
  DollarSign,
  Boxes,
  TrendingUp,
  Percent,
  Search,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const SAMPLE_VALUATION = [
  { sku: "SNY-55-OLED", name: "Sony Bravia 55' 4K OLED TV", category: "Televisions", stock: 12, fifoCost: 92000, totalCost: 1104000, mrp: 115000, totalRetail: 1380000, margin: "20.0%" },
  { sku: "WHL-AC-15T", name: "Whirlpool Inverter AC 1.5 Ton", category: "Air Conditioners", stock: 24, fifoCost: 54000, totalCost: 1296000, mrp: 68500, totalRetail: 1644000, margin: "21.2%" },
  { sku: "PHP-AF-62L", name: "Philips Air Fryer XL 6.2L", category: "Kitchen Appliances", stock: 45, fifoCost: 12800, totalCost: 576000, mrp: 16500, totalRetail: 742500, margin: "22.4%" },
  { sku: "LOG-MX3S-GR", name: "Logitech MX Master 3S Mouse", category: "Computer Peripherals", stock: 35, fifoCost: 8200, totalCost: 287000, mrp: 11500, totalRetail: 402500, margin: "28.7%" },
  { sku: "ANK-65W-BLK", name: "Anker 65W GaN Fast Charger", category: "Mobile Accessories", stock: 80, fifoCost: 2800, totalCost: 224000, mrp: 3800, totalRetail: 304000, margin: "26.3%" },
  { sku: "SAM-SB-Q600", name: "Samsung Soundbar HW-Q600B", category: "Audio Systems", stock: 18, fifoCost: 24500, totalCost: 441000, mrp: 32000, totalRetail: 576000, margin: "23.4%" },
];

export default function StockValuationPage() {
  const [method, setMethod] = useState("FIFO"); // 'FIFO' | 'FEFO' | 'WAC'
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  const filtered = SAMPLE_VALUATION.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "All" || item.category === filterCat;
    return matchSearch && matchCat;
  });

  const totalCostBasis = filtered.reduce((acc, i) => acc + i.totalCost, 0);
  const totalRetailValue = filtered.reduce((acc, i) => acc + i.totalRetail, 0);
  const totalUnits = filtered.reduce((acc, i) => acc + i.stock, 0);
  const potentialGrossProfit = totalRetailValue - totalCostBasis;

  return (
    <div className="space-y-6">
      {/* ━━ Header ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#64BD0B]/10 text-[#3B7506]">
              <FileSpreadsheet size={22} className="text-[#3B7506]" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Inventory &amp; Stock Valuation Reports (FIFO/FEFO)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audited financial valuation of on-hand inventory using First-In-First-Out, FEFO batch costing, and gross margin forecasts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Method Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
            <button
              onClick={() => setMethod("FIFO")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                method === "FIFO" ? "bg-white text-[#3B7506] shadow-sm" : "text-slate-600"
              }`}
            >
              FIFO Method
            </button>
            <button
              onClick={() => setMethod("FEFO")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                method === "FEFO" ? "bg-white text-[#3B7506] shadow-sm" : "text-slate-600"
              }`}
            >
              FEFO Method
            </button>
            <button
              onClick={() => setMethod("WAC")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                method === "WAC" ? "bg-white text-[#3B7506] shadow-sm" : "text-slate-600"
              }`}
            >
              Weighted Avg
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs"
          >
            <Printer size={14} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Inventory Cost Value"
          value={`৳${(totalCostBasis / 100000).toFixed(2)}L`}
          trend={{ value: `${method} Valuation basis`, positive: true }}
          icon={DollarSign}
          accent="emerald"
        />
        <StatCard
          label="Potential Retail Worth (MRP)"
          value={`৳${(totalRetailValue / 100000).toFixed(2)}L`}
          trend={{ value: "Selling price realization", positive: true }}
          icon={TrendingUp}
          accent="blue"
        />
        <StatCard
          label="Potential Gross Margin"
          value={`৳${(potentialGrossProfit / 100000).toFixed(2)}L`}
          trend={{ value: `${((potentialGrossProfit / totalRetailValue) * 100).toFixed(1)}% expected margin`, positive: true }}
          icon={Percent}
          accent="amber"
        />
        <StatCard
          label="Total Units On-Hand"
          value={`${totalUnits} Units`}
          trend={{ value: "Across all central depots", positive: true }}
          icon={Boxes}
          accent="purple"
        />
      </div>

      {/* ━━ Table ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white/70 text-sm focus:border-[#64BD0B] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Showing {filtered.length} audited items</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Product Details &amp; SKU</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Stock On-Hand</th>
                <th className="py-3.5 px-4 text-right">Unit Cost ({method})</th>
                <th className="py-3.5 px-4 text-right">Total Cost Value</th>
                <th className="py-3.5 px-4 text-right">Selling MRP</th>
                <th className="py-3.5 px-4 text-right">Potential Retail</th>
                <th className="py-3.5 px-4 text-center">Gross Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.sku} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-[11px] font-mono text-slate-400">{item.sku}</p>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                    {item.category}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    {item.stock} pcs
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                    ৳{item.fifoCost.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    ৳{item.totalCost.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                    ৳{item.mrp.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#3B7506]">
                    ৳{item.totalRetail.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#64BD0B]/10 text-[#3B7506] border border-[#64BD0B]/20">
                      {item.margin}
                    </span>
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
