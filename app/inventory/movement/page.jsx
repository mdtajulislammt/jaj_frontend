"use client";

import { useState } from "react";
import { ArrowRightLeft, ArrowDownLeft, ArrowUpRight, Search, Package, Calendar, Clock, Filter } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";

const INITIAL_MOVEMENTS = [
  {
    id: "MVT-9932",
    timestamp: "2026-10-15 11:24 AM",
    type: "sale",
    sku: "IPH-15P-256",
    productName: "iPhone 15 Pro (256GB Titanium)",
    qty: -1,
    from: "Dhanmondi Counter Reg #1",
    to: "Customer: Tanvir Ahmed",
    ref: "INV-88231",
    user: "Cashier Shafiul",
  },
  {
    id: "MVT-9931",
    timestamp: "2026-10-15 10:40 AM",
    type: "transfer_in",
    sku: "S24U-512-TI",
    productName: "Samsung Galaxy S24 Ultra",
    qty: 5,
    from: "Central Warehouse Hub",
    to: "Dhanmondi Store Shelf",
    ref: "TPN-4091",
    user: "Manager Tajul",
  },
  {
    id: "MVT-9930",
    timestamp: "2026-10-14 04:15 PM",
    type: "po_receiving",
    sku: "WLT-AC-15T",
    productName: "Walton Inverter AC 1.5T",
    qty: 10,
    from: "Supplier: Walton Hi-Tech",
    to: "Central Warehouse Hub",
    ref: "GRN-202",
    user: "Receiving Officer",
  },
  {
    id: "MVT-9929",
    timestamp: "2026-10-14 02:00 PM",
    type: "damage",
    sku: "SNY-55-4K",
    productName: "Sony Bravia 55' 4K OLED TV",
    qty: -1,
    from: "Central Warehouse Hub",
    to: "RMA Damaged Holding Bay",
    ref: "DMG-102",
    user: "QC Supervisor",
  },
  {
    id: "MVT-9928",
    timestamp: "2026-10-13 01:10 PM",
    type: "sale",
    sku: "MAC-M3-16",
    productName: "Apple MacBook Air M3 (16GB)",
    qty: -1,
    from: "Dhanmondi Branch",
    to: "Customer: Nusrat Jahan",
    ref: "INV-88230",
    user: "Cashier Shafiul",
  },
];

export default function StockMovementPage() {
  const [movements] = useState(INITIAL_MOVEMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = movements.filter((m) => {
    const matchesSearch =
      m.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.ref.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inventory Audit"
        title="Stock Movement Log"
        description="Immutable chronological ledger tracking every unit's arrival, transfer, sale, and disposal."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tracked Movements" value={movements.length} icon={ArrowRightLeft} tone="primary" />
        <StatCard label="Today's Outward (Sales)" value="2 Units" icon={ArrowUpRight} trend="Dispatched to customer" tone="warn" />
        <StatCard label="Today's Inward (GRN/TPN)" value="15 Units" icon={ArrowDownLeft} trend="Stock replenished" trendUp tone="good" />
        <StatCard label="Active Audit Logs" value="100%" icon={Package} trend="Serials synchronized" tone="primary" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#64BD0B]/5 to-transparent">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by product, SKU or reference ID…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#64BD0B]"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white/80 border border-slate-200/80 rounded-xl px-3 py-2 text-[12.5px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Movement Types</option>
            <option value="sale">Counter POS Sales</option>
            <option value="po_receiving">PO / GRN Inward</option>
            <option value="transfer_in">Inter-branch TPN</option>
            <option value="damage">Damage Discard</option>
          </select>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">Movement ID</th>
                <th className="px-6 py-3.5 font-semibold">Timestamp</th>
                <th className="px-6 py-3.5 font-semibold">Product &amp; SKU</th>
                <th className="px-6 py-3.5 font-semibold text-center">Movement Type</th>
                <th className="px-6 py-3.5 font-semibold text-center">Qty</th>
                <th className="px-6 py-3.5 font-semibold">Origin &rarr; Destination</th>
                <th className="px-6 py-3.5 font-semibold">Reference</th>
                <th className="px-6 py-3.5 font-semibold">Logged User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-700">
                    {m.id}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500 text-[12px]">
                    {m.timestamp}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{m.productName}</p>
                    <p className="font-mono text-[11px] text-slate-400">{m.sku}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge
                      tone={
                        m.type === "sale"
                          ? "sky"
                          : m.type === "po_receiving"
                          ? "good"
                          : m.type === "damage"
                          ? "bad"
                          : "primary"
                      }
                    >
                      {m.type === "sale"
                        ? "Sale Out"
                        : m.type === "po_receiving"
                        ? "PO Receiving"
                        : m.type === "damage"
                        ? "Damaged"
                        : "Branch Transfer"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-bold">
                    <span className={m.qty < 0 ? "text-rose-600" : "text-[#3B7506]"}>
                      {m.qty > 0 ? `+${m.qty}` : m.qty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[12.5px] text-slate-700">
                    <span className="font-medium">{m.from}</span> &rarr;{" "}
                    <span className="font-medium text-slate-900">{m.to}</span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-[#3B7506] text-[12px]">
                    <span className="bg-[#64BD0B]/10 px-2 py-0.5 rounded border border-[#64BD0B]/20">
                      {m.ref}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-[12px] font-medium">
                    {m.user}
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
