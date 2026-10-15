"use client";

import { useState } from "react";
import { Plus, CreditCard, Wallet, Smartphone, Building, CheckCircle2, Trash2, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";

const INITIAL_METHODS = [
  {
    id: "pay-1",
    name: "Cash in Counter Drawer",
    category: "Cash",
    gateway: "Direct Register Drawer",
    chargePct: 0,
    status: true,
    settlement: "Instant",
  },
  {
    id: "pay-2",
    name: "City Bank POS Terminal (Visa/MC)",
    category: "Card",
    gateway: "City Bank EDC Terminal",
    chargePct: 1.5,
    status: true,
    settlement: "T+1 Business Day",
  },
  {
    id: "pay-3",
    name: "bKash Merchant Payment (Dynamic QR)",
    category: "MFS",
    gateway: "bKash Checkout API",
    chargePct: 1.2,
    status: true,
    settlement: "Instant Settlement",
  },
  {
    id: "pay-4",
    name: "Nagad Direct Merchant",
    category: "MFS",
    gateway: "Nagad Business Gateway",
    chargePct: 1.0,
    status: true,
    settlement: "Instant Settlement",
  },
  {
    id: "pay-5",
    name: "Zero% EMI Card Facility (6-12 Months)",
    category: "EMI",
    gateway: "Standard Chartered & City Bank EMI",
    chargePct: 3.5,
    status: true,
    settlement: "T+2 Business Days",
  },
];

export default function PaymentSettingsPage() {
  const [methods, setMethods] = useState(INITIAL_METHODS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "MFS", gateway: "", chargePct: "1.0" });

  const toggleStatus = (id) => {
    setMethods(
      methods.map((m) => (m.id === id ? { ...m, status: !m.status } : m))
    );
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name) return;
    const item = {
      id: `pay-${Date.now()}`,
      name: form.name,
      category: form.category,
      gateway: form.gateway || "Custom Gateway",
      chargePct: Number(form.chargePct) || 0,
      status: true,
      settlement: "Instant",
    };
    setMethods([...methods, item]);
    setForm({ name: "", category: "MFS", gateway: "", chargePct: "1.0" });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Payment Gateway"
        title="Payment Methods &amp; POS Tenders"
        description="Configure counter cash registers, credit card swipe terminals, mobile wallets (MFS), and EMI partner rules."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.35)] transition-all hover:scale-[1.02]"
          >
            <Plus size={16} /> Add Payment Method
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Configured Methods" value={methods.length} icon={CreditCard} tone="primary" />
        <StatCard label="Active Status" value="100% Online" icon={CheckCircle2} trend="All gateways healthy" trendUp tone="good" />
        <StatCard label="Supported MFS" value="bKash & Nagad" icon={Smartphone} trend="Low fee QR checkout" tone="warn" />
        <StatCard label="EMI Availability" value="Up to 12m" icon={Building} trend="Major credit cards" tone="primary" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-[#64BD0B]/5 to-transparent flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-[16px] text-slate-900">Registered POS Payment Tenders</h2>
            <p className="text-[12px] text-slate-500 mt-0.5">Tender types available at cashier terminal checkout</p>
          </div>
          <span className="text-[12px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-3 py-1 rounded-full border border-[#64BD0B]/20">
            {methods.length} Payment Gateways
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">Tender Name</th>
                <th className="px-6 py-3.5 font-semibold">Category</th>
                <th className="px-6 py-3.5 font-semibold">Provider / Terminal</th>
                <th className="px-6 py-3.5 font-semibold text-center">Processing Surcharge</th>
                <th className="px-6 py-3.5 font-semibold">Settlement Period</th>
                <th className="px-6 py-3.5 font-semibold text-center">Status</th>
                <th className="px-6 py-3.5 font-semibold text-center">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {methods.map((m) => (
                <tr key={m.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 text-[14px]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#64BD0B]/10 text-[#3B7506] flex items-center justify-center font-bold">
                        {m.category === "Cash" ? <Wallet size={16} /> : m.category === "Card" ? <CreditCard size={16} /> : <Smartphone size={16} />}
                      </div>
                      <span>{m.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-[12px]">
                      {m.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {m.gateway}
                  </td>
                  <td className="px-6 py-4 text-center font-mono font-bold text-slate-800">
                    {m.chargePct > 0 ? `${m.chargePct}%` : "0% (Free)"}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-[12px]">
                    {m.settlement}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge tone={m.status ? "good" : "neutral"} dot>
                      {m.status ? "Active" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleStatus(m.id)}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 inline-block ${
                        m.status ? "bg-[#64BD0B]" : "bg-slate-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                          m.status ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
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
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Add POS Payment Tender</h3>
            <p className="text-[12px] text-slate-500 mb-4">Configure a new transaction method.</p>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Method Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Upay Merchant / Amex EDC"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Tender Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none"
                  >
                    <option value="MFS">MFS Mobile Wallet</option>
                    <option value="Card">Bank Card / EDC</option>
                    <option value="EMI">EMI Instalment</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Processing Surcharge (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.chargePct}
                    onChange={(e) => setForm({ ...form, chargePct: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Gateway or Terminal Provider</label>
                <input
                  type="text"
                  placeholder="e.g. BRAC Bank EDC Terminal"
                  value={form.gateway}
                  onChange={(e) => setForm({ ...form, gateway: e.target.value })}
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
                  Save Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
