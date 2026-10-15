"use client";

import { useState } from "react";
import { Clock, Wallet, DollarSign, CheckCircle2, AlertTriangle, Printer, Lock, Unlock, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { money } from "@/lib/format";

export default function RegisterShiftPage() {
  const [registerOpen, setRegisterOpen] = useState(true);
  const [openingCash, setOpeningCash] = useState(5000);
  const [countedCash, setCountedCash] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const cashSales = 26990;
  const cardSales = 45000;
  const mfsSales = 18500;
  const cashIn = 2000;
  const cashOut = 1200; // petty cash tea/snacks

  const expectedCashInDrawer = openingCash + cashSales + cashIn - cashOut;
  const variance = countedCash ? Number(countedCash) - expectedCashInDrawer : 0;

  const handleCloseRegister = (e) => {
    e.preventDefault();
    setRegisterOpen(false);
    setModalOpen(false);
    setSuccessMsg("Shift closed successfully! Daily Z-Report generated and sent to Admin.");
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const handleOpenRegister = () => {
    setRegisterOpen(true);
    setCountedCash("");
    setSuccessMsg("New Cash Register Shift opened with ৳5,000 opening float!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        eyebrow="POS & Register"
        title="Register Shift & Cash Drawer"
        description="Shift opening floats, tender payment totals, drawer reconciliation, and end-of-day X/Z reports."
        action={
          registerOpen ? (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              <Lock size={15} /> Close Register (Shift End)
            </button>
          ) : (
            <button
              onClick={handleOpenRegister}
              className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              <Unlock size={15} /> Open New Shift Register
            </button>
          )
        }
      />

      {successMsg && (
        <div className="bg-[#64BD0B]/15 border border-[#64BD0B]/30 text-[#2C6004] px-4 py-3 rounded-xl flex items-center gap-2 font-semibold text-[13px] animate-in fade-in">
          <CheckCircle2 size={17} /> {successMsg}
        </div>
      )}

      {/* ━━ Shift Status Banner ━━ */}
      <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl border border-white/90 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${registerOpen ? "bg-[#64BD0B]" : "bg-slate-500"}`}>
            <Clock size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-slate-900">
                Register #1 — Dhanmondi Flagship
              </h2>
              <Badge tone={registerOpen ? "good" : "neutral"} dot>
                {registerOpen ? "Shift Active (Open)" : "Shift Closed"}
              </Badge>
            </div>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Cashier: <span className="font-semibold text-slate-700">Shafiul Alam</span> · Shift Started: Today 09:30 AM
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[12.5px] transition-all"
        >
          <Printer size={14} /> Print Shift X-Report
        </button>
      </div>

      {/* ━━ 4 Stat Cards ━━ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Opening Cash Float" value={money(openingCash)} icon={Wallet} tone="primary" />
        <StatCard label="Cash Sales Collected" value={money(cashSales)} icon={DollarSign} trend="In counter drawer" trendUp tone="good" />
        <StatCard label="Cards & MFS Sales" value={money(cardSales + mfsSales)} icon={DollarSign} trend="Digital bank inflow" tone="sky" />
        <StatCard label="Expected Drawer Cash" value={money(expectedCashInDrawer)} icon={Wallet} trend="Must match physical" tone="warn" />
      </div>

      {/* ━━ Shift Tender Breakdown Table ━━ */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-[#64BD0B]/5 to-transparent flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-[16px] text-slate-900">Current Shift Tender Breakdown</h3>
            <p className="text-[12px] text-slate-500 mt-0.5">Payment channel reconciliation for Register #1</p>
          </div>
          <span className="text-[13px] font-bold text-[#3B7506] font-mono">
            Total Sales: {money(cashSales + cardSales + mfsSales)}
          </span>
        </div>

        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 border-b border-slate-100">
              <th className="px-6 py-3 font-semibold">Tender Channel</th>
              <th className="px-6 py-3 font-semibold">Transactions</th>
              <th className="px-6 py-3 font-semibold text-right">Inflow Amount</th>
              <th className="px-6 py-3 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-3.5 font-bold text-slate-900">💵 Counter Cash</td>
              <td className="px-6 py-3.5 text-slate-600">8 Invoices</td>
              <td className="px-6 py-3.5 text-right font-mono font-bold text-slate-900">{money(cashSales)}</td>
              <td className="px-6 py-3.5 text-center"><Badge tone="good">In Drawer</Badge></td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-3.5 font-bold text-slate-900">💳 City Bank POS Card (Visa/MC)</td>
              <td className="px-6 py-3.5 text-slate-600">4 Invoices</td>
              <td className="px-6 py-3.5 text-right font-mono font-bold text-slate-900">{money(cardSales)}</td>
              <td className="px-6 py-3.5 text-center"><Badge tone="sky">Bank Terminal Settled</Badge></td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="px-6 py-3.5 font-bold text-slate-900">📱 bKash / Nagad MFS QR</td>
              <td className="px-6 py-3.5 text-slate-600">3 Invoices</td>
              <td className="px-6 py-3.5 text-right font-mono font-bold text-slate-900">{money(mfsSales)}</td>
              <td className="px-6 py-3.5 text-center"><Badge tone="primary">MFS Merchant A/C</Badge></td>
            </tr>
            <tr className="hover:bg-slate-50 bg-slate-50/50">
              <td className="px-6 py-3.5 font-bold text-slate-700">➕ Cash In (Added Float)</td>
              <td className="px-6 py-3.5 text-slate-600">Change Currency</td>
              <td className="px-6 py-3.5 text-right font-mono font-bold text-[#3B7506]">+{money(cashIn)}</td>
              <td className="px-6 py-3.5 text-center"><Badge tone="good">Added</Badge></td>
            </tr>
            <tr className="hover:bg-slate-50 bg-slate-50/50">
              <td className="px-6 py-3.5 font-bold text-slate-700">➖ Cash Out (Petty Expenses)</td>
              <td className="px-6 py-3.5 text-slate-600">Tea &amp; Courier</td>
              <td className="px-6 py-3.5 text-right font-mono font-bold text-rose-600">-{money(cashOut)}</td>
              <td className="px-6 py-3.5 text-center"><Badge tone="warn">Petty Out</Badge></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ━━ Close Register Modal ━━ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
            >
              <X size={16} />
            </button>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Close Cash Register</h3>
            <p className="text-[12px] text-slate-500 mb-4">Reconcile physical cash drawer with digital expected balance.</p>

            <form onSubmit={handleCloseRegister} className="space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-[12.5px]">
                <div className="flex justify-between">
                  <span className="text-slate-600">Opening Float:</span>
                  <span className="font-mono font-semibold">{money(openingCash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Cash Sales:</span>
                  <span className="font-mono font-semibold">{money(cashSales)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Petty Cash In/Out:</span>
                  <span className="font-mono font-semibold">+{money(cashIn - cashOut)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-[14px] text-slate-900">
                  <span>Expected Drawer Cash:</span>
                  <span className="font-mono text-[#3B7506]">{money(expectedCashInDrawer)}</span>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Actual Physical Cash Counted (৳) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 32790"
                  value={countedCash}
                  onChange={(e) => setCountedCash(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[14px] font-mono font-bold text-slate-900 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              {countedCash && (
                <div className={`p-2.5 rounded-lg text-[12px] font-bold flex justify-between ${variance === 0 ? "bg-[#64BD0B]/15 text-[#3B7506]" : variance > 0 ? "bg-blue-50 text-blue-700" : "bg-rose-50 text-rose-700"}`}>
                  <span>Cash Variance:</span>
                  <span>{variance === 0 ? "Balanced (0.00)" : variance > 0 ? `+৳${variance} (Over)` : `-৳${Math.abs(variance)} (Short)`}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[13px] shadow-md"
                >
                  Confirm &amp; Close Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
