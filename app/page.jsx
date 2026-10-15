"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wallet, AlertTriangle, PackageCheck, ShieldCheck, ArrowUpRight, ScanLine } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { money, formatDate } from "@/lib/format";
import { resetToDemo } from "@/store/slices/productsSlice";

const STATUS_TONE = { paid: "good", partial_due: "warn", due: "bad" };
const STATUS_LABEL = { paid: "Paid", partial_due: "Partial Due", due: "Due" };

export default function DashboardPage() {
  const dispatch = useDispatch();
  const invoices = useSelector((s) => s.sales.invoices);
  const products = useSelector((s) => s.products.items);
  const customers = useSelector((s) => s.customers.items);
  const pos = useSelector((s) => s.purchaseOrders.items);
  const activeBranch = useSelector((s) => s.ui.activeBranch);

  useEffect(() => {
    if (products.length < 20 || products.some((p) => !p.image || !p.image.startsWith("http"))) {
      dispatch(resetToDemo());
    }
  }, [products, dispatch]);

  const todaysSales = invoices
    .filter((i) => i.date === invoices[0]?.date)
    .reduce((sum, i) => sum + i.total, 0);

  const totalDue = customers.reduce((sum, c) => sum + c.due, 0);

  const lowStock = products.filter(
    (p) => p.serials.filter((s) => s.status === "in_stock").length <= 2
  );

  const pendingGRN = pos.filter((p) => p.status === "grn_pending");

  return (
    <div>
      <PageHeader
        eyebrow={`${activeBranch} Branch · Today`}
        title="Overview"
        description="Live snapshot of sales, stock and pending receiving across the store."
        action={
          <Link
            href="/pos"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#64BD0B] to-[#529E08] hover:from-[#5CB209] hover:to-[#488E06] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-[0_6px_20px_rgba(100,189,11,0.35)] hover:shadow-[0_8px_25px_rgba(100,189,11,0.45)] transition-all hover:scale-[1.02]"
          >
            <ScanLine size={16} /> Open POS Terminal
          </Link>
        }
      />

      {/* ━━ Featured Glassmorphic Hero Banner ━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#64BD0B] via-[#5CB209] to-[#488F06] text-white p-6 md:p-7 mb-6 shadow-[0_12px_36px_rgba(100,189,11,0.32)] border border-white/30 backdrop-blur-xl">
        {/* Glow & Glass reflections */}
        <div className="pointer-events-none absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/15 blur-2xl" />
        <div className="pointer-events-none absolute right-1/3 -bottom-16 w-52 h-52 rounded-full bg-white/10 blur-xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11.5px] font-bold bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-sm mb-3">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live Retail Console
            </span>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-white drop-shadow-sm">
              Today's Net Turnover: {money(todaysSales)}
            </h2>
            <p className="text-[13.5px] text-white/90 mt-1.5 max-w-xl font-medium">
              {invoices.length} transactions processed today across counter & online channels. All registers synced.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/pos"
              className="bg-white text-[#3B7506] hover:bg-white/95 px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all hover:scale-[1.03] inline-flex items-center gap-2 backdrop-blur-sm"
            >
              <ScanLine size={15} strokeWidth={2.5} /> Quick Sale
            </Link>
            <Link
              href="/reports"
              className="bg-white/15 hover:bg-white/25 text-white px-4 py-2.5 rounded-xl text-[13px] font-semibold border border-white/30 backdrop-blur-md transition-all hover:scale-[1.02]"
            >
              Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* ━━ 4 Glass Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Today's Sales" value={money(todaysSales)} icon={Wallet} trend="+12.4% vs yesterday" trendUp tone="primary" />
        <StatCard label="Outstanding Due" value={money(totalDue)} icon={AlertTriangle} trend={`${customers.filter((c) => c.due > 0).length} customers`} tone="warn" />
        <StatCard label="Low Stock Alerts" value={lowStock.length} icon={PackageCheck} trend="≤ 2 units remaining" tone="bad" />
        <StatCard label="GRN Pending" value={pendingGRN.length} icon={ShieldCheck} trend="awaiting receiving" tone="primary" />
      </div>

      {/* ━━ Bottom 2 Glass Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent Invoices Glass Card */}
        <div className="xl:col-span-2 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/85 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden transition-all">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-[#64BD0B]/8 via-[#64BD0B]/2 to-transparent">
            <div>
              <h2 className="font-display font-bold text-[16px] text-slate-900">Recent Invoices</h2>
              <p className="text-[12px] text-slate-500 mt-0.5">Latest transactions across POS &amp; E-com</p>
            </div>
            <Link href="/reports" className="text-[12.5px] font-bold text-[#3B7506] flex items-center gap-1 hover:underline bg-[#64BD0B]/10 px-3 py-1.5 rounded-lg border border-[#64BD0B]/20 transition-all">
              View reports <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm border-b border-slate-100">
                  <th className="px-6 py-3 font-semibold">Invoice</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Channel</th>
                  <th className="px-6 py-3 font-semibold text-right">Total</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {invoices.slice(0, 6).map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#64BD0B]/6 transition-colors">
                    <td className="px-6 py-3 font-mono text-[12.5px] font-bold text-[#3B7506]">
                      <span className="bg-[#64BD0B]/10 px-2 py-0.5 rounded-md border border-[#64BD0B]/15 inline-block">
                        {inv.id}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-900 font-semibold">{inv.customerName}</td>
                    <td className="px-6 py-3 capitalize text-slate-600 font-medium">{inv.channel}</td>
                    <td className="px-6 py-3 text-right font-mono font-bold text-slate-900">{money(inv.total)}</td>
                    <td className="px-6 py-3">
                      <Badge tone={STATUS_TONE[inv.status]} dot>{STATUS_LABEL[inv.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watch Glass Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/85 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden transition-all">
          <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-[#64BD0B]/8 via-[#64BD0B]/2 to-transparent flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-[16px] text-slate-900">Low Stock Watch</h2>
              <p className="text-[12px] text-slate-500 mt-0.5">Reorder before these run out</p>
            </div>
            <span className="text-[11px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2 py-0.5 rounded-full border border-[#64BD0B]/20">
              {lowStock.length} items
            </span>
          </div>
          <div className="divide-y divide-slate-100/80">
            {lowStock.length === 0 && (
              <p className="px-6 py-6 text-[13px] text-slate-500">All items are healthily stocked.</p>
            )}
            {lowStock.map((p) => {
              const inStock = p.serials.filter((s) => s.status === "in_stock").length;
              return (
                <div key={p.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-[#64BD0B]/5 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-white/90 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200/80 shadow-sm p-0.5">
                    {typeof p.image === "string" && (p.image.startsWith("http") || p.image.startsWith("/")) ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-lg" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    ) : (
                      <span className="text-base">{p.image || "📦"}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-slate-900 truncate">{p.name}</p>
                    <p className="text-[11.5px] text-slate-500 truncate">{p.variant}</p>
                  </div>
                  <Badge tone={inStock === 0 ? "bad" : "warn"}>{inStock} left</Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
