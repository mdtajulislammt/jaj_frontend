"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AlertTriangle,
  Receipt,
  Phone,
  Search,
  Wallet,
  CheckCircle,
  Calendar,
  X,
  CreditCard,
  Building,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { money } from "@/lib/format";
import { adjustDue } from "@/store/slices/customersSlice";

const INITIAL_DUE_BILLS = [
  {
    invoiceId: "INV-88231",
    customerName: "Tanvir Ahmed",
    customerId: "cus-001",
    phone: "01711223344",
    invoiceDate: "2026-10-10",
    totalAmount: 26990,
    paidAmount: 18490,
    dueAmount: 8500,
    overdueDays: 5,
    branch: "Dhanmondi",
  },
  {
    invoiceId: "INV-88210",
    customerName: "Mahmud Hasan",
    customerId: "cus-002",
    phone: "01819998877",
    invoiceDate: "2026-10-02",
    totalAmount: 114000,
    paidAmount: 80000,
    dueAmount: 34000,
    overdueDays: 13,
    branch: "Dhanmondi",
  },
  {
    invoiceId: "INV-88195",
    customerName: "Shahriar Kabir",
    customerId: "cus-004",
    phone: "01912345678",
    invoiceDate: "2026-09-25",
    totalAmount: 48500,
    paidAmount: 20000,
    dueAmount: 28500,
    overdueDays: 20,
    branch: "Uttara",
  },
  {
    invoiceId: "INV-88180",
    customerName: "ElectroZone Wholesale",
    customerId: "cus-005",
    phone: "01678887766",
    invoiceDate: "2026-09-18",
    totalAmount: 250000,
    paidAmount: 150000,
    dueAmount: 100000,
    overdueDays: 27,
    branch: "Dhanmondi",
  },
];

export default function DueBillsPage() {
  const dispatch = useDispatch();
  const [bills, setBills] = useState(INITIAL_DUE_BILLS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [successMsg, setSuccessMsg] = useState("");

  const totalOutstanding = bills.reduce((sum, b) => sum + b.dueAmount, 0);
  const criticalOverdue = bills.filter((b) => b.overdueDays > 15).length;

  const filteredBills = bills.filter(
    (b) =>
      b.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm)
  );

  const handleSettle = (e) => {
    e.preventDefault();
    const amount = Number(payAmount);
    if (!amount || amount <= 0 || !selectedBill) return;

    if (selectedBill.customerId) {
      dispatch(adjustDue({ customerId: selectedBill.customerId, amount: -amount }));
    }

    setBills((prev) =>
      prev
        .map((b) => {
          if (b.invoiceId === selectedBill.invoiceId) {
            const newDue = b.dueAmount - amount;
            return {
              ...b,
              paidAmount: b.paidAmount + amount,
              dueAmount: Math.max(0, newDue),
            };
          }
          return b;
        })
        .filter((b) => b.dueAmount > 0)
    );

    setSuccessMsg(`Successfully collected ৳${amount.toLocaleString()} for ${selectedBill.invoiceId}!`);
    setTimeout(() => setSuccessMsg(""), 4000);
    setSelectedBill(null);
    setPayAmount("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Accounts Receivable"
        title="Due Bills & Credit Recovery"
        description="Monitor outstanding customer invoice dues, credit aging periods, and record direct payment receipts."
      />

      {successMsg && (
        <div className="bg-[#64BD0B]/15 border border-[#64BD0B]/30 text-[#2C6004] px-4 py-3 rounded-xl flex items-center gap-2 font-semibold text-[13px] animate-in fade-in">
          <CheckCircle size={17} /> {successMsg}
        </div>
      )}

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Outstanding Due"
          value={money(totalOutstanding)}
          icon={AlertTriangle}
          trend={`${bills.length} pending invoices`}
          tone="warn"
        />
        <StatCard
          label="Critical Overdue (>15d)"
          value={criticalOverdue}
          icon={Calendar}
          trend="Immediate follow-up"
          tone="bad"
        />
        <StatCard
          label="Pending Due Bills"
          value={bills.length}
          icon={Receipt}
          trend="Active receivables"
          tone="primary"
        />
        <StatCard
          label="Collected Today"
          value={money(45000)}
          icon={Wallet}
          trend="+18% vs yesterday"
          trendUp
          tone="good"
        />
      </div>

      {/* ━━ Due Bills Table Card ━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden">
        <div className="p-4 md:p-5 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#64BD0B]/5 to-transparent">
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by customer name, phone number, or invoice ID…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#64BD0B]"
            />
          </div>
          <span className="text-[12px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            {filteredBills.length} Invoices Pending
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">Invoice No</th>
                <th className="px-6 py-3.5 font-semibold">Customer &amp; Phone</th>
                <th className="px-6 py-3.5 font-semibold">Bill Date</th>
                <th className="px-6 py-3.5 font-semibold text-right">Invoice Total</th>
                <th className="px-6 py-3.5 font-semibold text-right">Paid</th>
                <th className="px-6 py-3.5 font-semibold text-right text-rose-600">Due Amount</th>
                <th className="px-6 py-3.5 font-semibold text-center">Overdue</th>
                <th className="px-6 py-3.5 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                    🎉 All invoices are fully paid! No outstanding dues.
                  </td>
                </tr>
              ) : (
                filteredBills.map((b) => (
                  <tr key={b.invoiceId} className="hover:bg-[#64BD0B]/5 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#3B7506]">
                      <span className="bg-[#64BD0B]/10 px-2.5 py-1 rounded-md border border-[#64BD0B]/20">
                        {b.invoiceId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{b.customerName}</p>
                      <p className="text-[12px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone size={12} className="text-[#64BD0B]" /> {b.phone}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-[12px]">
                      {b.invoiceDate}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-slate-700">
                      {money(b.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-[#3B7506]">
                      {money(b.paidAmount)}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-rose-600 text-[14px]">
                      {money(b.dueAmount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge tone={b.overdueDays > 15 ? "bad" : "warn"}>
                        {b.overdueDays} Days
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedBill(b);
                          setPayAmount(String(b.dueAmount));
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold bg-[#64BD0B] text-white hover:bg-[#529E08] transition-all shadow-sm"
                      >
                        <Wallet size={13} /> Settle Due
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ━━ Collect Due Modal ━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedBill(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">
              Collect Invoice Due Payment
            </h3>
            <p className="text-[12px] text-slate-500 mb-4">
              Recording settlement for {selectedBill.invoiceId} · {selectedBill.customerName}
            </p>

            <form onSubmit={handleSettle} className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center text-[13px]">
                <span className="font-medium text-amber-800">Remaining Balance:</span>
                <span className="font-mono font-bold text-rose-600 text-[15px]">
                  {money(selectedBill.dueAmount)}
                </span>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Collection Amount (৳) *
                </label>
                <input
                  type="number"
                  required
                  max={selectedBill.dueAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[14px] font-mono font-bold text-slate-900 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] font-medium text-slate-800 focus:outline-none"
                >
                  <option value="cash">Cash Register</option>
                  <option value="bank">Bank POS Card Terminal</option>
                  <option value="bkash">bKash Merchant</option>
                  <option value="nagad">Nagad Direct</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedBill(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold shadow-md text-[13px]"
                >
                  Confirm Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
