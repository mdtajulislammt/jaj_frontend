"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  ScanLine,
  X,
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { money } from "@/lib/format";

export default function SalesPage() {
  const invoices = useSelector((s) => s.sales.invoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const totalSales = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const totalPaid = invoices.reduce((sum, inv) => {
    if (inv.status === "paid") return sum + inv.total;
    if (inv.status === "partial_due") return sum + (inv.paidTotal || inv.total * 0.7);
    return sum;
  }, 0);
  const totalDue = totalSales - totalPaid;

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel =
      channelFilter === "all" || inv.channel === channelFilter;
    const matchesStatus =
      statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesChannel && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sales Management"
        title="Sales Invoices & Transactions"
        description="Comprehensive audit of all registered POS counter slips, corporate orders, and e-commerce transactions."
        action={
          <Link
            href="/pos"
            className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.35)] transition-all hover:scale-[1.02]"
          >
            <ScanLine size={16} /> Open POS Terminal
          </Link>
        }
      />

      {/* ━━ 4 Glass Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Sales Revenue"
          value={money(totalSales)}
          icon={ShoppingCart}
          trend="+14.8% this month"
          trendUp
          tone="primary"
        />
        <StatCard
          label="Paid Inflow"
          value={money(totalPaid)}
          icon={CheckCircle2}
          trend="Settled & verified"
          trendUp
          tone="good"
        />
        <StatCard
          label="Outstanding Dues"
          value={money(totalDue)}
          icon={AlertTriangle}
          trend="Requires follow-up"
          tone="warn"
        />
        <StatCard
          label="Total Orders"
          value={invoices.length}
          icon={Receipt}
          trend="All sales channels"
          tone="primary"
        />
      </div>

      {/* ━━ Filter Bar & Table ━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden">
        {/* Search & Filter Header */}
        <div className="p-4 md:p-5 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#64BD0B]/5 to-transparent">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by invoice number or customer name…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#64BD0B] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="bg-white/80 border border-slate-200/80 rounded-xl px-3 py-2 text-[12.5px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Channels</option>
              <option value="pos">Counter POS</option>
              <option value="ecom">Online / E-Com</option>
              <option value="corporate">Corporate</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/80 border border-slate-200/80 rounded-xl px-3 py-2 text-[12.5px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="partial_due">Partial Due</option>
              <option value="due">Due</option>
            </select>
          </div>
        </div>

        {/* Sales Invoices Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm border-b border-slate-100">
                <th className="px-6 py-3 font-semibold">Invoice No</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Date &amp; Time</th>
                <th className="px-6 py-3 font-semibold">Channel</th>
                <th className="px-6 py-3 font-semibold text-right">Items</th>
                <th className="px-6 py-3 font-semibold text-right">Total Amount</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-6 py-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-500 font-medium">
                    No sales invoices matched your search filter.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="font-mono text-[12.5px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2.5 py-1 rounded-md border border-[#64BD0B]/20 inline-block">
                        {inv.id}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-slate-900">{inv.customerName}</p>
                      <p className="text-[11px] text-slate-400">Regular Customer</p>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 font-mono text-[12px]">
                      {inv.date || "Today"} {inv.time || "12:30 PM"}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="capitalize px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {inv.channel || "POS"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right font-medium text-slate-700">
                      {inv.items?.length || 1} pcs
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-bold text-slate-900">
                      {money(inv.total)}
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <Badge
                        tone={
                          inv.status === "paid"
                            ? "good"
                            : inv.status === "partial_due"
                            ? "warn"
                            : "bad"
                        }
                        dot
                      >
                        {inv.status === "paid"
                          ? "Paid"
                          : inv.status === "partial_due"
                          ? "Partial Due"
                          : "Due"}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-bold bg-[#64BD0B]/10 text-[#3B7506] hover:bg-[#64BD0B] hover:text-white transition-all shadow-sm"
                      >
                        <Eye size={13} /> View Slip
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ━━ Modal: Invoice Slip View ━━━━━━━━━━━━━━━━━━━ */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="text-center pb-4 border-b border-dashed border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-[#64BD0B] text-white flex items-center justify-center mx-auto mb-2 font-bold shadow-md">
                <Receipt size={20} />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">Mona POS Retail Receipt</h3>
              <p className="text-[12px] text-slate-500">Invoice: {selectedInvoice.id}</p>
            </div>

            <div className="py-4 space-y-2 text-[13px]">
              <div className="flex justify-between text-slate-600">
                <span>Customer:</span>
                <span className="font-semibold text-slate-900">{selectedInvoice.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Date:</span>
                <span className="font-medium text-slate-900">{selectedInvoice.date || "Today"}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Channel:</span>
                <span className="capitalize font-medium text-slate-900">{selectedInvoice.channel || "Counter POS"}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Status:</span>
                <Badge tone={selectedInvoice.status === "paid" ? "good" : "warn"}>
                  {selectedInvoice.status?.toUpperCase()}
                </Badge>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-[16px] text-slate-900">
                <span>Total Amount:</span>
                <span className="font-mono text-[#3B7506]">{money(selectedInvoice.total)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold py-2.5 rounded-xl shadow-md transition-all text-[13px]"
              >
                <Printer size={15} /> Print Receipt
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[13px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
