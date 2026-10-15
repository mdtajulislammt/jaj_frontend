"use client";

import { useState } from "react";
import {
  CircleDollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Building,
  CreditCard,
  Plus,
  Calendar,
  X,
  FileText,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { money } from "@/lib/format";

const INITIAL_TRANSACTIONS = [
  {
    id: "TX-1092",
    date: "2026-10-15 11:20 AM",
    description: "POS Counter Cash Inflow - Reg #1",
    type: "credit",
    category: "Sales Revenue",
    account: "Cash Drawer #1",
    amount: 26990,
  },
  {
    id: "TX-1091",
    date: "2026-10-15 10:15 AM",
    description: "Store Electricity & AC Bill (September)",
    type: "debit",
    category: "Utility Expense",
    account: "City Bank Current A/C",
    amount: 14500,
  },
  {
    id: "TX-1090",
    date: "2026-10-14 05:40 PM",
    description: "Supplier Payment - Samsung Authorized Dist.",
    type: "debit",
    category: "Vendor Payable",
    account: "City Bank Current A/C",
    amount: 185000,
  },
  {
    id: "TX-1089",
    date: "2026-10-14 02:30 PM",
    description: "Customer Due Settlement - Tanvir Ahmed",
    type: "credit",
    category: "Due Recovery",
    account: "bKash Merchant Account",
    amount: 12000,
  },
  {
    id: "TX-1088",
    date: "2026-10-13 04:10 PM",
    description: "Retail Display Stand & LED Lightings",
    type: "debit",
    category: "Store Maintenance",
    account: "Cash Drawer #1",
    amount: 3200,
  },
];

export default function AccountsPage() {
  const [txs, setTxs] = useState(INITIAL_TRANSACTIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    description: "",
    category: "Operational Expense",
    account: "Cash Drawer #1",
    amount: "",
    type: "debit",
  });

  const cashInHand = 84500;
  const bankBalance = 1420000;
  const totalReceivable = 171000;
  const totalPayable = 230000;

  const handleAddTx = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return;
    const newTx = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: "Just now",
      description: form.description,
      type: form.type,
      category: form.category,
      account: form.account,
      amount: Number(form.amount) || 0,
    };
    setTxs([newTx, ...txs]);
    setForm({
      description: "",
      category: "Operational Expense",
      account: "Cash Drawer #1",
      amount: "",
      type: "debit",
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Financial Management"
        title="Accounts & Cash Flow Console"
        description="Monitor liquid cash positions, bank balances, operating expenses, and accounts ledger."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.35)] transition-all hover:scale-[1.02]"
          >
            <Plus size={16} /> Record Expense / Entry
          </button>
        }
      />

      {/* ━━ 4 Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Cash in Counter Drawer"
          value={money(cashInHand)}
          icon={Wallet}
          trend="Physical drawer balance"
          trendUp
          tone="primary"
        />
        <StatCard
          label="Bank & MFS Balance"
          value={money(bankBalance)}
          icon={Building}
          trend="3 linked corporate A/Cs"
          tone="good"
        />
        <StatCard
          label="Customer Receivables"
          value={money(totalReceivable)}
          icon={ArrowUpRight}
          trend="Due recovery pipeline"
          tone="warn"
        />
        <StatCard
          label="Vendor Payables"
          value={money(totalPayable)}
          icon={ArrowDownLeft}
          trend="Upcoming PO payments"
          tone="bad"
        />
      </div>

      {/* ━━ Accounts Breakdown & Recent Ledger ━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Accounts Balances */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] p-5 space-y-4">
          <h3 className="font-display font-bold text-[16px] text-slate-900 border-b border-slate-100 pb-3">
            Financial Accounts
          </h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#64BD0B]/15 text-[#3B7506] flex items-center justify-center font-bold">
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-[13px]">Dhanmondi Cash Counter</p>
                  <p className="text-[11px] text-slate-400">Cash in Hand</p>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-900 text-[14px]">৳84,500</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-600 flex items-center justify-center font-bold">
                  <Building size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-[13px]">City Bank Current A/C</p>
                  <p className="text-[11px] text-slate-400">A/C: 110293847201</p>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-900 text-[14px]">৳980,000</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-pink-500/15 text-pink-600 flex items-center justify-center font-bold">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-[13px]">bKash Merchant</p>
                  <p className="text-[11px] text-slate-400">01851004545</p>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-900 text-[14px]">৳440,000</span>
            </div>
          </div>
        </div>

        {/* Right 2 cols: Recent Transactions Table */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-[#64BD0B]/5 to-transparent flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-[16px] text-slate-900">General Cash &amp; Bank Ledger</h2>
              <p className="text-[12px] text-slate-500 mt-0.5">Real-time inflows &amp; outflows record</p>
            </div>
            <span className="text-[12px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-3 py-1 rounded-full border border-[#64BD0B]/20">
              {txs.length} Entries
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm border-b border-slate-100">
                  <th className="px-6 py-3 font-semibold">Reference</th>
                  <th className="px-6 py-3 font-semibold">Description</th>
                  <th className="px-6 py-3 font-semibold">Account</th>
                  <th className="px-6 py-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {txs.map((t) => (
                  <tr key={t.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[12px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {t.id}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">{t.date}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-slate-900">{t.description}</p>
                      <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 font-medium text-[12.5px]">
                      {t.account}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-bold text-[14px]">
                      <span className={t.type === "credit" ? "text-[#3B7506]" : "text-rose-600"}>
                        {t.type === "credit" ? "+" : "-"} {money(t.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ━━ Record Expense Modal ━━━━━━━━━━━━━━━━━━━━━ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Record Expense / Cash Out</h3>
            <p className="text-[12px] text-slate-500 mb-4">Post expense or account transfer to ledger.</p>

            <form onSubmit={handleAddTx} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Transaction Note *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Office Stationery, Courier Charge"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Expense Amount (৳) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2500"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Payment Source</label>
                <select
                  value={form.account}
                  onChange={(e) => setForm({ ...form, account: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none"
                >
                  <option value="Cash Drawer #1">Cash Drawer #1 (Counter)</option>
                  <option value="City Bank Current A/C">City Bank Current A/C</option>
                  <option value="bKash Merchant Account">bKash Merchant Account</option>
                </select>
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
                  Post Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
