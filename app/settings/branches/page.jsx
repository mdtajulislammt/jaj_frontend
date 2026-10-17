"use client";

import { useState } from "react";
import {
  Warehouse,
  Plus,
  Search,
  MapPin,
  Phone,
  Monitor,
  User,
  CheckCircle2,
  Trash2,
  Edit2,
  Building2,
  DollarSign,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const INITIAL_BRANCHES = [
  {
    id: 1,
    code: "BR-DHM-01",
    name: "Dhanmondi Flagship Superstore",
    type: "Retail Outlet & Showroom",
    address: "Road 27 (Old), Dhanmondi R/A, Dhaka-1209",
    phone: "01711-223344",
    manager: "Mahmudul Hasan",
    terminalsCount: 4,
    openingFloat: 50000,
    status: "Active",
  },
  {
    id: 2,
    code: "BR-GLS-02",
    name: "Gulshan Premium Boutique",
    type: "High-Street Outlet",
    address: "Avenue 1, Gulshan-2 Circle, Dhaka-1212",
    phone: "01819-334455",
    manager: "Farzana Sultana",
    terminalsCount: 3,
    openingFloat: 60000,
    status: "Active",
  },
  {
    id: 3,
    code: "BR-CTG-03",
    name: "Agrabad Regional Outlet",
    type: "Regional Superstore",
    address: "CDA Commercial Area, Agrabad, Chittagong",
    phone: "01912-778899",
    manager: "Kamal Uddin",
    terminalsCount: 3,
    openingFloat: 40000,
    status: "Active",
  },
  {
    id: 4,
    code: "BR-UTT-04",
    name: "Uttara Express Outlet",
    type: "Express Mini-Store",
    address: "Sector 3, Jasimuddin Avenue, Uttara, Dhaka",
    phone: "01611-998877",
    manager: "Shakil Hossain",
    terminalsCount: 2,
    openingFloat: 30000,
    status: "Renovating",
  },
];

export default function BranchesPage() {
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    code: "",
    name: "",
    type: "Retail Outlet & Showroom",
    address: "",
    phone: "",
    manager: "",
    terminalsCount: 2,
    openingFloat: 30000,
  });

  const filtered = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase()) ||
      b.manager.toLowerCase().includes(search.toLowerCase())
  );

  const totalTerminals = branches.reduce((acc, b) => acc + b.terminalsCount, 0);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name || !form.code) return;
    setBranches([
      ...branches,
      {
        id: Date.now(),
        code: form.code.toUpperCase(),
        name: form.name,
        type: form.type,
        address: form.address,
        phone: form.phone,
        manager: form.manager || "Unassigned",
        terminalsCount: Number(form.terminalsCount),
        openingFloat: Number(form.openingFloat),
        status: "Active",
      },
    ]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* ━━ Header ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-2">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-sm shadow-[0_4px_14px_rgba(100,189,11,0.35)] transition-all"
        >
          <Plus size={16} />
          <span>Add New Outlet</span>
        </button>
      </div>

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Retail Outlets"
          value={branches.length.toString()}
          trend={{ value: `${branches.filter((b) => b.status === "Active").length} fully operational`, positive: true }}
          icon={Building2}
          accent="emerald"
        />
        <StatCard
          label="Active POS Terminals"
          value={`${totalTerminals} Terminals`}
          trend={{ value: "Connected to central sync", positive: true }}
          icon={Monitor}
          accent="blue"
        />
        <StatCard
          label="Total Float Allocation"
          value={`৳${branches.reduce((a, b) => a + b.openingFloat, 0).toLocaleString()}`}
          trend={{ value: "Opening petty cash pool", positive: true }}
          icon={DollarSign}
          accent="purple"
        />
        <StatCard
          label="Network Reliability"
          value="99.9% Uptime"
          trend={{ value: "Direct multi-branch sync", positive: true }}
          icon={CheckCircle2}
          accent="amber"
        />
      </div>

      {/* ━━ Search & Table ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search branch name, code, manager..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white/70 text-sm focus:border-[#64BD0B] outline-none"
            />
          </div>
          <span className="text-xs text-slate-400">
            {filtered.length} outlet(s) registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Branch Code &amp; Name</th>
                <th className="py-3.5 px-4">Outlet Type</th>
                <th className="py-3.5 px-4">Address &amp; Contact</th>
                <th className="py-3.5 px-4">Store Manager</th>
                <th className="py-3.5 px-4 text-center">Terminals</th>
                <th className="py-3.5 px-4 text-right">Cash Float (৳)</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{b.name}</p>
                    <span className="font-mono text-xs font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2 py-0.5 rounded">
                      {b.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                    {b.type}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    <p className="flex items-center gap-1">
                      <MapPin size={12} className="text-slate-400" />
                      <span>{b.address}</span>
                    </p>
                    <p className="flex items-center gap-1 text-slate-400 font-mono mt-0.5">
                      <Phone size={12} />
                      <span>{b.phone}</span>
                    </p>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <User size={13} className="text-slate-400" />
                      <span>{b.manager}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs">
                      {b.terminalsCount} POS
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                    ৳{b.openingFloat.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        b.status === "Active"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => alert(`Edit ${b.name}`)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 mr-1"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setBranches(branches.filter((x) => x.id !== b.id))}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ━━ Modal ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800">Register New Branch Outlet</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch Code:</label>
                  <input
                    type="text"
                    placeholder="e.g. BR-MIR-05"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] font-mono outline-none uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Outlet Type:</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  >
                    <option>Retail Outlet & Showroom</option>
                    <option>High-Street Outlet</option>
                    <option>Regional Superstore</option>
                    <option>Express Mini-Store</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Branch Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Mirpur 10 Mega Outlet"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Physical Address:</label>
                <input
                  type="text"
                  placeholder="e.g. Plot 12, Main Road, Mirpur-10, Dhaka"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number:</label>
                  <input
                    type="text"
                    placeholder="017XX-XXXXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Store Manager Name:</label>
                  <input
                    type="text"
                    placeholder="Manager name"
                    value={form.manager}
                    onChange={(e) => setForm({ ...form, manager: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">POS Terminals Count:</label>
                  <input
                    type="number"
                    min="1"
                    value={form.terminalsCount}
                    onChange={(e) => setForm({ ...form, terminalsCount: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Opening Cash Float (৳):</label>
                  <input
                    type="number"
                    value={form.openingFloat}
                    onChange={(e) => setForm({ ...form, openingFloat: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#64BD0B] text-white font-bold shadow-md"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
