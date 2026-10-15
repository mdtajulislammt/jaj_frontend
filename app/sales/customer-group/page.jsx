"use client";

import { useState } from "react";
import { Plus, Users, Contact, Percent, Calendar, ShieldCheck, Edit, Trash2, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";

const INITIAL_GROUPS = [
  {
    id: "grp-1",
    name: "VIP Elite Club",
    discount: 10,
    creditLimit: 250000,
    creditDays: 30,
    members: 42,
    color: "#64BD0B",
    notes: "Special discounts on flagships, free home delivery, priority warranty support.",
  },
  {
    id: "grp-2",
    name: "Wholesale Dealers",
    discount: 15,
    creditLimit: 800000,
    creditDays: 45,
    members: 18,
    color: "#2563EB",
    notes: "Bulk order purchase tier. Minimum billing requirement: ৳50,000 per invoice.",
  },
  {
    id: "grp-3",
    name: "Corporate Client Tier",
    discount: 7,
    creditLimit: 500000,
    creditDays: 60,
    members: 27,
    color: "#7C3AED",
    notes: "Companies with tax certificate & monthly billing consolidation.",
  },
  {
    id: "grp-4",
    name: "Regular Walk-in Retail",
    discount: 0,
    creditLimit: 0,
    creditDays: 0,
    members: 312,
    color: "#64748B",
    notes: "Standard counter customers with regular retail pricing and cash/card sales.",
  },
];

export default function CustomerGroupPage() {
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    discount: "",
    creditLimit: "",
    creditDays: "",
    notes: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name) return;
    const newGroup = {
      id: `grp-${Date.now()}`,
      name: form.name,
      discount: Number(form.discount) || 0,
      creditLimit: Number(form.creditLimit) || 0,
      creditDays: Number(form.creditDays) || 0,
      members: 0,
      color: "#64BD0B",
      notes: form.notes || "Custom customer group tier.",
    };
    setGroups([newGroup, ...groups]);
    setForm({ name: "", discount: "", creditLimit: "", creditDays: "", notes: "" });
    setModalOpen(false);
  };

  const totalMembers = groups.reduce((acc, g) => acc + g.members, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sales & CRM"
        title="Customer Groups & Membership Tiers"
        description="Configure pricing rules, discount margins, and credit policies for specific customer classifications."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.35)] transition-all hover:scale-[1.02]"
          >
            <Plus size={16} /> Add Customer Group
          </button>
        }
      />

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Customer Tiers"
          value={groups.length}
          icon={Contact}
          tone="primary"
        />
        <StatCard
          label="Assigned Members"
          value={totalMembers}
          icon={Users}
          trend="Enrolled across tiers"
          trendUp
          tone="good"
        />
        <StatCard
          label="Max Tier Discount"
          value="15%"
          icon={Percent}
          trend="Wholesale category"
          tone="warn"
        />
        <StatCard
          label="Credit Privilege"
          value="60 Days"
          icon={Calendar}
          trend="Corporate tier max"
          tone="primary"
        />
      </div>

      {/* ━━ Groups Table Card ━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-[#64BD0B]/5 to-transparent flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-[16px] text-slate-900">Active Customer Groups</h2>
            <p className="text-[12px] text-slate-500 mt-0.5">Tier configurations and billing parameters</p>
          </div>
          <span className="text-[12px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-3 py-1 rounded-full border border-[#64BD0B]/20">
            {groups.length} Tier Tiers
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">Tier Name</th>
                <th className="px-6 py-3.5 font-semibold text-center">Discount %</th>
                <th className="px-6 py-3.5 font-semibold text-right">Credit Limit</th>
                <th className="px-6 py-3.5 font-semibold text-center">Credit Period</th>
                <th className="px-6 py-3.5 font-semibold text-center">Members</th>
                <th className="px-6 py-3.5 font-semibold">Special Terms / Policy</th>
                <th className="px-6 py-3.5 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {groups.map((grp) => (
                <tr key={grp.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: grp.color }}
                      />
                      <span className="font-bold text-slate-900 text-[14px]">{grp.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold font-mono text-[#3B7506]">
                    <span className="bg-[#64BD0B]/10 px-2.5 py-1 rounded-md border border-[#64BD0B]/20">
                      {grp.discount}% Off
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-semibold text-slate-800">
                    {grp.creditLimit > 0 ? `৳${grp.creditLimit.toLocaleString()}` : "No Credit"}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-slate-700">
                    {grp.creditDays > 0 ? `${grp.creditDays} Days` : "Instant Pay"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full text-[12px]">
                      {grp.members} customers
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-[12px] max-w-xs">
                    {grp.notes}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setGroups(groups.filter((g) => g.id !== grp.id))}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Group"
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

      {/* ━━ Add Group Modal ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Create Customer Group Tier</h3>
            <p className="text-[12px] text-slate-500 mb-4">Set pricing discounts and credit terms for this group.</p>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Group Tier Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Platinum VIP / Franchise Partner"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Default Discount (%)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Credit Limit (৳)</label>
                  <input
                    type="number"
                    placeholder="e.g. 100000"
                    value={form.creditLimit}
                    onChange={(e) => setForm({ ...form, creditLimit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Payment Grace Period (Days)</label>
                <input
                  type="number"
                  placeholder="e.g. 30"
                  value={form.creditDays}
                  onChange={(e) => setForm({ ...form, creditDays: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Special Policy / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Additional eligibility or terms for this tier…"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
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
                  Save Group Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
