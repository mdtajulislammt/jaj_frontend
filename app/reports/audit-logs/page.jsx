"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Search,
  Filter,
  Printer,
  AlertTriangle,
  FileText,
  User,
  Clock,
  CheckCircle2,
  Lock,
  DollarSign,
  KeyRound,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const INITIAL_LOGS = [
  {
    id: "AUD-9901",
    timestamp: "15 Oct 2026, 02:40 PM",
    user: "Tanvir Ahmed (Cashier)",
    branch: "Dhanmondi Outlet",
    event: "Void Bill / Cancelled Invoice",
    details: "Voided Order #INV-2026-0895 after customer card declined multiple times",
    prevVal: "৳115,000",
    newVal: "Voided (৳0)",
    authorizer: "Mahmudul Hasan (Manager PIN)",
    severity: "Critical",
  },
  {
    id: "AUD-9902",
    timestamp: "15 Oct 2026, 01:15 PM",
    user: "Sadia Sultana (Cashier)",
    branch: "Gulshan Store",
    event: "Price Override at Checkout",
    details: "Reduced MRP of Samsung Soundbar HW-Q600B for floor-model minor scratch",
    prevVal: "৳32,000",
    newVal: "৳29,500",
    authorizer: "Floor Supervisor Approved",
    severity: "Warning",
  },
  {
    id: "AUD-9903",
    timestamp: "15 Oct 2026, 11:30 AM",
    user: "Tanvir Ahmed (Cashier)",
    branch: "Dhanmondi Outlet",
    event: "Cash Drawer Manual Open",
    details: "Drawer kicked open without transaction to provide change for ৳1,000 bill",
    prevVal: "Closed",
    newVal: "Manual Kick",
    authorizer: "POS Direct Pin",
    severity: "Warning",
  },
  {
    id: "AUD-9904",
    timestamp: "14 Oct 2026, 06:10 PM",
    user: "Admin (Superuser)",
    branch: "Head Office",
    event: "User Role / Permission Mod",
    details: "Granted 'Inventory Adjust' and 'Purchase Order Create' permissions to Kamrul Islam",
    prevVal: "Staff Role",
    newVal: "Inventory Officer",
    authorizer: "Root Admin",
    severity: "Info",
  },
  {
    id: "AUD-9905",
    timestamp: "14 Oct 2026, 03:22 PM",
    user: "Kamrul Islam (Inventory)",
    branch: "Central Hub Warehouse",
    event: "Stock Adjustment (Damage)",
    details: "Wrote off 2 units of Philips Air Fryer damaged during transit pallet unloading",
    prevVal: "47 pcs",
    newVal: "45 pcs (-2)",
    authorizer: "Warehouse Lead",
    severity: "Warning",
  },
];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [search, setSearch] = useState("");
  const [filterEvent, setFilterEvent] = useState("All");

  const filteredLogs = logs.filter((l) => {
    const matchSearch =
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase());
    const matchEvent = filterEvent === "All" || l.event === filterEvent;
    return matchSearch && matchEvent;
  });

  const criticalCount = logs.filter((l) => l.severity === "Critical").length;
  const warningCount = logs.filter((l) => l.severity === "Warning").length;

  return (
    <div className="space-y-6">
      {/* ━━ Header ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-500/10 text-red-600">
              <ShieldAlert size={22} className="text-red-600" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Audit Logs &amp; Security Compliance
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-proof activity logs tracking voided sales, cashier price overrides, manual cash drawer kicks, and supervisor overrides.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs"
        >
          <Printer size={14} />
          <span>Export Audit Trail</span>
        </button>
      </div>

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Audited Events"
          value="1,420 Logs"
          trend={{ value: "Archived & immutable", positive: true }}
          icon={FileText}
          accent="blue"
        />
        <StatCard
          label="Critical Actions (Today)"
          value={`${criticalCount} Event`}
          trend={{ value: "Manager PIN required", positive: false }}
          icon={ShieldAlert}
          accent="purple"
        />
        <StatCard
          label="Warnings & Overrides"
          value={`${warningCount} Events`}
          trend={{ value: "Price changes & drawer opens", positive: false }}
          icon={AlertTriangle}
          accent="amber"
        />
        <StatCard
          label="Security Compliance"
          value="100% Passed"
          trend={{ value: "PCI-DSS / ISO Standard", positive: true }}
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
              placeholder="Search user, audit ID, details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white/70 text-sm focus:border-[#64BD0B] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none"
            >
              <option value="All">All Event Categories</option>
              <option value="Void Bill / Cancelled Invoice">Void Bill / Cancelled Invoice</option>
              <option value="Price Override at Checkout">Price Override at Checkout</option>
              <option value="Cash Drawer Manual Open">Cash Drawer Manual Open</option>
              <option value="User Role / Permission Mod">User Role / Permission Mod</option>
              <option value="Stock Adjustment (Damage)">Stock Adjustment (Damage)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ━━ Audit Logs Table ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Audit ID &amp; Time</th>
                <th className="py-3.5 px-4">User &amp; Outlet</th>
                <th className="py-3.5 px-4">Event Category</th>
                <th className="py-3.5 px-4">Action Details</th>
                <th className="py-3.5 px-4 text-center">Value Shift</th>
                <th className="py-3.5 px-4">Authorized By</th>
                <th className="py-3.5 px-4 text-center">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900 text-xs block">{l.id}</span>
                    <span className="text-[11px] text-slate-400">{l.timestamp}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800 text-xs">{l.user}</p>
                    <p className="text-[11px] text-slate-400">{l.branch}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 text-xs">
                      {l.event}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs">
                    {l.details}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-xs">
                    <span className="text-slate-400 line-through mr-1">{l.prevVal}</span>
                    <span className="font-bold text-slate-800">{l.newVal}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                    <div className="flex items-center gap-1">
                      <KeyRound size={12} className="text-[#3B7506]" />
                      <span>{l.authorizer}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        l.severity === "Critical"
                          ? "bg-red-100 text-red-800 border border-red-200"
                          : l.severity === "Warning"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {l.severity}
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
