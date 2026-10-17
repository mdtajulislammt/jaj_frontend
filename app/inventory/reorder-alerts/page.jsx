"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ClipboardList,
  Search,
  ShoppingCart,
  Boxes,
  ArrowRight,
  TrendingDown,
  Clock,
  CheckCircle2,
  Filter,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const INITIAL_LOW_STOCK = [
  {
    id: 1,
    product: "Sony Bravia 55' 4K OLED TV",
    sku: "SNY-55-OLED",
    category: "Smart Televisions",
    warehouse: "Central Hub Warehouse",
    currentStock: 2,
    safetyStock: 5,
    reorderLevel: 8,
    suggestedPOQty: 10,
    unitCost: 92000,
    preferredSupplier: "Sony Bangladesh Official",
    leadTimeDays: 4,
    status: "Critical Low",
  },
  {
    id: 2,
    product: "Logitech MX Master 3S Wireless Mouse",
    sku: "LOG-MX3S-GR",
    category: "Computer Peripherals",
    warehouse: "Dhanmondi Flagship Outlet",
    currentStock: 0,
    safetyStock: 10,
    reorderLevel: 15,
    suggestedPOQty: 25,
    unitCost: 8200,
    preferredSupplier: "Smart Technologies BD Ltd",
    leadTimeDays: 2,
    status: "Out of Stock",
  },
  {
    id: 3,
    product: "Whirlpool Inverter AC 1.5 Ton",
    sku: "WHL-AC-15T",
    category: "Air Conditioners",
    warehouse: "Gulshan Premium Store",
    currentStock: 3,
    safetyStock: 6,
    reorderLevel: 10,
    suggestedPOQty: 12,
    unitCost: 54000,
    preferredSupplier: "Whirlpool Global Dist.",
    leadTimeDays: 5,
    status: "Critical Low",
  },
  {
    id: 4,
    product: "Philips Air Fryer XL 6.2L",
    sku: "PHP-AF-62L",
    category: "Kitchen Appliances",
    warehouse: "Central Hub Warehouse",
    currentStock: 5,
    safetyStock: 8,
    reorderLevel: 12,
    suggestedPOQty: 15,
    unitCost: 12800,
    preferredSupplier: "Transcom Digital Wholesale",
    leadTimeDays: 3,
    status: "Warning",
  },
  {
    id: 5,
    product: "Anker 65W GaN Fast Charger",
    sku: "ANK-65W-BLK",
    category: "Mobile Accessories",
    warehouse: "Chittagong Regional Depot",
    currentStock: 6,
    safetyStock: 12,
    reorderLevel: 20,
    suggestedPOQty: 30,
    unitCost: 2800,
    preferredSupplier: "Dexsys Distribution BD",
    leadTimeDays: 2,
    status: "Warning",
  },
];

export default function ReorderAlertsPage() {
  const [items, setItems] = useState(INITIAL_LOW_STOCK);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredItems = items.filter((item) => {
    const matchSearch =
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.preferredSupplier.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const outOfStockCount = items.filter((i) => i.currentStock === 0).length;
  const criticalCount = items.filter((i) => i.status === "Critical Low").length;
  const totalRestockCost = items.reduce((sum, i) => sum + i.suggestedPOQty * i.unitCost, 0);

  return (
    <div className="space-y-6">
      {/* ━━ Action Bar ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-2">
        <Link
          href="/purchase-orders"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-sm shadow-[0_4px_14px_rgba(100,189,11,0.35)] transition-all"
        >
          <ClipboardList size={16} />
          <span>Generate PO for All Low Stock</span>
        </Link>
      </div>

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Out of Stock SKUs"
          value={`${outOfStockCount} Items`}
          trend={{ value: "Lost sales risk", positive: false }}
          icon={TrendingDown}
          accent="purple"
        />
        <StatCard
          label="Critical Low Stock"
          value={`${criticalCount} Items`}
          trend={{ value: "Below safety threshold", positive: false }}
          icon={AlertTriangle}
          accent="amber"
        />
        <StatCard
          label="Estimated Reorder Budget"
          value={`৳${totalRestockCost.toLocaleString()}`}
          trend={{ value: "Covers all suggested POs", positive: true }}
          icon={ShoppingCart}
          accent="emerald"
        />
        <StatCard
          label="Avg Supplier Lead Time"
          value="3.2 Days"
          trend={{ value: "Fast restocking", positive: true }}
          icon={Clock}
          accent="blue"
        />
      </div>

      {/* ━━ Search & Filter Bar ━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product, SKU, supplier..."
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
              <option value="All">All Severity Levels</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Critical Low">Critical Low</option>
              <option value="Warning">Warning</option>
            </select>
          </div>
        </div>
      </div>

      {/* ━━ Low Stock Alerts Table ━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Product &amp; SKU</th>
                <th className="py-3.5 px-4">Warehouse Location</th>
                <th className="py-3.5 px-4 text-center">Current Stock</th>
                <th className="py-3.5 px-4 text-center">Safety Level</th>
                <th className="py-3.5 px-4 text-center">Suggested PO</th>
                <th className="py-3.5 px-4">Preferred Supplier</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{item.product}</p>
                    <p className="text-xs font-mono text-slate-400">{item.sku} • {item.category}</p>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {item.warehouse}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`font-mono font-extrabold text-sm ${
                        item.currentStock === 0 ? "text-red-600" : "text-amber-600"
                      }`}
                    >
                      {item.currentStock} pcs
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-500">
                    Min {item.safetyStock} / Reorder {item.reorderLevel}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-[#3B7506]">
                    +{item.suggestedPOQty} pcs
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                    <p>{item.preferredSupplier}</p>
                    <p className="text-[11px] text-slate-400 font-normal">Lead: ~{item.leadTimeDays} days</p>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.status === "Out of Stock"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : item.status === "Critical Low"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href="/purchase-orders"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-xs shadow-sm transition-all"
                    >
                      <span>Create PO</span>
                      <ArrowRight size={13} />
                    </Link>
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
