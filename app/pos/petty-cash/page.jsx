"use client";

import { useState } from "react";
import { Wallet, Plus, Minus, Search, Calendar, CheckCircle2, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { money } from "@/lib/format";

const INITIAL_PETTY_CASH = [
  { id: "PC-104", type: "out", amount: 350, reason: "Office Tea & Refreshment", user: "Shafiul Alam", time: "Today 11:15 AM" },
  { id: "PC-103", type: "in", amount: 2000, reason: "Small Currency Float Replenishment (Coins & 10tk/20tk notes)", user: "Tajul Islam", time: "Today 09:45 AM" },
  { id: "PC-102", type: "out", amount: 500, reason: "Sundarban Courier Document Parcel", user: "Shafiul Alam", time: "Yesterday 04:30 PM" },
  { id: "PC-101", type: "out", amount: 350, reason: "Thermal Receipt Paper Roll Pack (5 rolls)", user: "Shafiul Alam", time: "Yesterday 02:10 PM" },
];

export default function PettyCashPage() {
  const [logs, setLogs] = useState(INITIAL_PETTY_CASH);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ type: "out", amount: "", reason: "" });

  const totalIn = logs.filter((l) => l.type === "in").reduce((s, l) => s + l.amount, 0);
  const totalOut = logs.filter((l) => l.type === "out").reduce((s, l) => s + l.amount, 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.amount || !form.reason) return;
    const item = {
      id: `PC-${Date.now().toString().slice(-4)}`,
      type: form.type,
      amount: Number(form.amount) || 0,
      reason: form.reason,
      user: "Current Cashier",
      time: "Just now",
    };
    setLogs([item, ...logs]);
    setForm({ type: "out", amount: "", reason: "" });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        eyebrow="POS & Register"
        title="Cash In / Cash Out (Petty Cash)"
        description="Log incidental counter cash movements, drawer adjustments, and miscellaneous retail store petty expenditures."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.35)] transition-all hover:scale-[1.02]"
          >
            <Plus size={16} /> Record Cash In / Out
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Petty Cash In" value={money(totalIn)} icon={Plus} tone="good" />
        <StatCard label="Total Petty Cash Out" value={money(totalOut)} icon={Minus} tone="bad" />
        <StatCard label="Net Petty Flow" value={money(totalIn - totalOut)} icon={Wallet} trend="Float balance impact" tone="primary" />
        <StatCard label="Total Entries Logged" value={logs.length} icon={Wallet} trend="Today & yesterday" tone="warn" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-[#64BD0B]/5 to-transparent flex items-center justify-between">
          <h3 className="font-display font-bold text-[16px] text-slate-900">Petty Cash Counter Audit Log</h3>
          <span className="text-[12px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2.5 py-0.5 rounded-full">
            {logs.length} Transactions
          </span>
        </div>

        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 border-b border-slate-100">
              <th className="px-6 py-3.5 font-semibold">Voucher</th>
              <th className="px-6 py-3.5 font-semibold">Type</th>
              <th className="px-6 py-3.5 font-semibold">Expenditure Purpose / Reason</th>
              <th className="px-6 py-3.5 font-semibold text-right">Amount</th>
              <th className="px-6 py-3.5 font-semibold">Cashier / Staff</th>
              <th className="px-6 py-3.5 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono font-bold text-slate-800">{l.id}</td>
                <td className="px-6 py-4">
                  <Badge tone={l.type === "in" ? "good" : "warn"}>
                    {l.type === "in" ? "+ Cash In" : "- Cash Out"}
                  </Badge>
                </td>
                <td className="px-6 py-4 font-medium text-slate-800 max-w-sm">{l.reason}</td>
                <td className="px-6 py-4 text-right font-mono font-bold text-[14px]">
                  <span className={l.type === "in" ? "text-[#3B7506]" : "text-rose-600"}>
                    {l.type === "in" ? "+" : "-"} {money(l.amount)}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-semibold text-[12.5px]">{l.user}</td>
                <td className="px-6 py-4 text-slate-400 font-mono text-[12px]">{l.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Record Cash In / Out</h3>
            <p className="text-[12px] text-slate-500 mb-4">Post counter petty transaction.</p>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Transaction Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: "out" })}
                    className={`py-2 rounded-xl text-[12.5px] font-bold border transition-all ${form.type === "out" ? "bg-rose-50 border-rose-300 text-rose-700" : "bg-slate-50 border-slate-200 text-slate-600"}`}
                  >
                    - Cash Out (Expense)
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: "in" })}
                    className={`py-2 rounded-xl text-[12.5px] font-bold border transition-all ${form.type === "in" ? "bg-[#64BD0B]/15 border-[#64BD0B]/40 text-[#2C6004]" : "bg-slate-50 border-slate-200 text-slate-600"}`}
                  >
                    + Cash In (Float)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Amount (৳) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 500"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Expense Reason / Note *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Office Coffee & Refreshment"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold text-[13px] shadow-md"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
