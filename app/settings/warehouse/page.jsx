"use client";

import { useState } from "react";
import { Plus, Warehouse, MapPin, Phone, User, Package, Trash2, X, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";

const INITIAL_WAREHOUSES = [
  {
    id: "wh-1",
    name: "Central Warehouse Hub",
    code: "WH-HQ",
    location: "Tejgaon Industrial Area, Dhaka",
    phone: "01851004545",
    manager: "Imtiaz Hossain",
    capacityUnits: 10000,
    currentStock: 4820,
    isRetailOutlet: false,
  },
  {
    id: "wh-2",
    name: "Dhanmondi Flagship Store",
    code: "ST-DHN",
    location: "Road 27, Dhanmondi, Dhaka",
    phone: "01711223344",
    manager: "Nusrat Jahan",
    capacityUnits: 2500,
    currentStock: 1420,
    isRetailOutlet: true,
  },
  {
    id: "wh-3",
    name: "Uttara Superstore Outlet",
    code: "ST-UTR",
    location: "Sector 7, Jasimuddin Ave, Uttara, Dhaka",
    phone: "01998877665",
    manager: "Karim Uddin",
    capacityUnits: 3000,
    currentStock: 1890,
    isRetailOutlet: true,
  },
  {
    id: "wh-4",
    name: "Mirpur Depot & Service Center",
    code: "ST-MIR",
    location: "Mirpur 10 Circle, Dhaka",
    phone: "01622334455",
    manager: "Faruk Ahmed",
    capacityUnits: 2000,
    currentStock: 980,
    isRetailOutlet: true,
  },
];

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    location: "",
    phone: "",
    manager: "",
    capacityUnits: "2000",
  });

  const totalStockInWarehouses = warehouses.reduce((s, w) => s + w.currentStock, 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name) return;
    const item = {
      id: `wh-${Date.now()}`,
      name: form.name,
      code: form.code || `WH-${form.name.slice(0, 3).toUpperCase()}`,
      location: form.location || "Dhaka, Bangladesh",
      phone: form.phone || "017XXXXXXXX",
      manager: form.manager || "Store Manager",
      capacityUnits: Number(form.capacityUnits) || 2000,
      currentStock: 0,
      isRetailOutlet: true,
    };
    setWarehouses([item, ...warehouses]);
    setForm({ name: "", code: "", location: "", phone: "", manager: "", capacityUnits: "2000" });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Storage & Logistics"
        title="Warehouse &amp; Branch Locations"
        description="Configure physical storage facilities, retail outlets, stock capacities, and designated depot supervisors."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.35)] transition-all hover:scale-[1.02]"
          >
            <Plus size={16} /> Add New Warehouse
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Locations" value={warehouses.length} icon={Warehouse} tone="primary" />
        <StatCard label="Physical Stock on Hand" value={`${totalStockInWarehouses} Pcs`} icon={Package} trend="Synchronized online" trendUp tone="good" />
        <StatCard label="Active Retail Stores" value="3 Outlets" icon={MapPin} trend="Point-of-Sale active" tone="warn" />
        <StatCard label="Central Distribution" value="1 Hub" icon={Warehouse} trend="Bulk receiving dock" tone="primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {warehouses.map((w) => {
          const utilPct = Math.round((w.currentStock / w.capacityUnits) * 100);
          return (
            <div
              key={w.id}
              className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] p-6 space-y-4 relative overflow-hidden group hover:border-[#64BD0B]/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#64BD0B]/12 text-[#3B7506] flex items-center justify-center font-bold">
                    <Warehouse size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-[16px]">{w.name}</h3>
                    <p className="text-[12px] font-mono text-[#3B7506] font-bold">{w.code}</p>
                  </div>
                </div>
                <Badge tone={w.isRetailOutlet ? "sky" : "primary"}>
                  {w.isRetailOutlet ? "Retail POS Store" : "Central Distribution"}
                </Badge>
              </div>

              <div className="space-y-1.5 text-[12.5px] text-slate-600">
                <p className="flex items-center gap-2"><MapPin size={14} className="text-[#64BD0B] shrink-0" /> {w.location}</p>
                <p className="flex items-center gap-2"><Phone size={14} className="text-[#64BD0B] shrink-0" /> {w.phone}</p>
                <p className="flex items-center gap-2"><User size={14} className="text-[#64BD0B] shrink-0" /> Manager: <span className="font-semibold text-slate-800">{w.manager}</span></p>
              </div>

              {/* Capacity Progress Bar */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex justify-between text-[12px] font-semibold mb-1.5">
                  <span className="text-slate-600">Storage Capacity Utilization</span>
                  <span className="text-slate-900">{w.currentStock} / {w.capacityUnits} Pcs ({utilPct}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#64BD0B] h-full rounded-full transition-all"
                    style={{ width: `${utilPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
            >
              <X size={16} />
            </button>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Add Warehouse Facility</h3>
            <p className="text-[12px] text-slate-500 mb-4">Register a storage hub or retail store location.</p>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Banani Showroom Hub"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Location Code</label>
                  <input
                    type="text"
                    placeholder="e.g. ST-BNI"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Max Capacity (Pcs)</label>
                  <input
                    type="number"
                    value={form.capacityUnits}
                    onChange={(e) => setForm({ ...form, capacityUnits: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  placeholder="e.g. Kemal Ataturk Ave, Banani, Dhaka"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Assigned Manager</label>
                <input
                  type="text"
                  placeholder="e.g. Asif Mahmud"
                  value={form.manager}
                  onChange={(e) => setForm({ ...form, manager: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold shadow-md text-[13px]"
                >
                  Save Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
