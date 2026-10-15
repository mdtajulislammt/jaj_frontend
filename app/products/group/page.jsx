"use client";

import { useState } from "react";
import { Plus, FolderTree, Package, Search, Trash2, X, ShieldAlert } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";

const INITIAL_GROUPS = [
  { id: "grp-1", name: "IMEI Serialized Flagships", trackingType: "Strict IMEI Tracking", warrantyValidation: "Mandatory", items: 125, returnPolicy: "RTV Supplier RMA" },
  { id: "grp-2", name: "Standard Serialized Devices", trackingType: "Barcode / Serial", warrantyValidation: "Required", items: 84, returnPolicy: "Store Replacement" },
  { id: "grp-3", name: "Non-Serialized Fast Moving Goods", trackingType: "Quantity / Barcode Only", warrantyValidation: "Optional", items: 210, returnPolicy: "7 Days Return" },
  { id: "grp-4", name: "Bulky & High Weight Appliances", trackingType: "Serial Number", warrantyValidation: "Mandatory", items: 38, returnPolicy: "Brand Technician Visit" },
  { id: "grp-5", name: "Clearance & Refurbished Stock", trackingType: "IMEI Tracking", warrantyValidation: "Limited 90d", items: 16, returnPolicy: "Final Sale / No Return" },
];

export default function ProductGroupPage() {
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", trackingType: "Strict IMEI Tracking", warrantyValidation: "Mandatory", returnPolicy: "Standard Policy" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name) return;
    const item = {
      id: `grp-${Date.now()}`,
      name: form.name,
      trackingType: form.trackingType,
      warrantyValidation: form.warrantyValidation,
      items: 0,
      returnPolicy: form.returnPolicy,
    };
    setGroups([item, ...groups]);
    setForm({ name: "", trackingType: "Strict IMEI Tracking", warrantyValidation: "Mandatory", returnPolicy: "Standard Policy" });
    setModalOpen(false);
  };

  const filtered = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.trackingType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Product Catalog"
        title="Product Inventory Groups"
        description="Classify inventory by serial tracking requirements, RMA warranty protocols, and handling policies."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.35)] transition-all hover:scale-[1.02]"
          >
            <Plus size={16} /> Add Product Group
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Configured Groups" value={groups.length} icon={FolderTree} tone="primary" />
        <StatCard label="Total Monitored Items" value="473 SKUs" icon={Package} trend="Tracking enforced" trendUp tone="good" />
        <StatCard label="Strict IMEI Enforced" value="141 SKUs" icon={ShieldAlert} trend="Mobile & Laptops" tone="warn" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-200/60 flex items-center justify-between gap-3 bg-gradient-to-r from-[#64BD0B]/5 to-transparent">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product groups…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#64BD0B]"
            />
          </div>
          <span className="text-[12px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-3 py-1.5 rounded-xl border border-[#64BD0B]/20">
            {groups.length} Tracking Groups
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">Group Classification</th>
                <th className="px-6 py-3.5 font-semibold">Tracking Type</th>
                <th className="px-6 py-3.5 font-semibold">Warranty Validation</th>
                <th className="px-6 py-3.5 font-semibold text-center">Items</th>
                <th className="px-6 py-3.5 font-semibold">RTV &amp; Return Policy</th>
                <th className="px-6 py-3.5 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 text-[14px]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#64BD0B]/10 text-[#3B7506] flex items-center justify-center font-bold">
                        <FolderTree size={16} />
                      </div>
                      <span>{g.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md text-[12px]">
                      {g.trackingType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge tone={g.warrantyValidation === "Mandatory" ? "good" : "warn"}>
                      {g.warrantyValidation}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2.5 py-1 rounded-full text-[12px]">
                      {g.items} SKUs
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-[12px]">
                    {g.returnPolicy}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setGroups(groups.filter((x) => x.id !== g.id))}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Create Inventory Group</h3>
            <p className="text-[12px] text-slate-500 mb-4">Establish tracking and warranty handling rules.</p>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Group Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Serialized Audio Gear"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Tracking Type</label>
                <select
                  value={form.trackingType}
                  onChange={(e) => setForm({ ...form, trackingType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none"
                >
                  <option value="Strict IMEI Tracking">Strict IMEI Tracking</option>
                  <option value="Barcode / Serial">Barcode / Serial</option>
                  <option value="Quantity / Barcode Only">Quantity / Barcode Only</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">RTV Policy</label>
                <input
                  type="text"
                  placeholder="e.g. 14 Days Replacement"
                  value={form.returnPolicy}
                  onChange={(e) => setForm({ ...form, returnPolicy: e.target.value })}
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
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
