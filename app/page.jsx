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
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg shadow-pop transition-all hover:scale-[1.02]"
          >
            <ScanLine size={16} /> Open POS Terminal
          </Link>
        }
      />

      {/* ━━ Featured Primary Hero Banner ━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative overflow-hidden rounded-xl2 bg-gradient-to-r from-primary via-[#56A809] to-[#458807] text-white p-5 md:p-6 mb-6 shadow-pop">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-sm mb-2">
              ● Live Retail Console
            </span>
            <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight">
              Today's Net Turnover: {money(todaysSales)}
            </h2>
            <p className="text-[13px] text-white/85 mt-1 max-w-lg">
              {invoices.length} transactions processed today across counter & online channels. All registers synced.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/pos"
              className="bg-white text-primary-dark hover:bg-white/95 px-4 py-2.5 rounded-lg text-[13px] font-bold shadow-md transition-all hover:scale-[1.03] inline-flex items-center gap-2"
            >
              <ScanLine size={15} /> Quick Sale
            </Link>
            <Link
              href="/reports"
              className="bg-black/20 hover:bg-black/30 text-white px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
            >
              Analytics
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        <StatCard label="Today's Sales" value={money(todaysSales)} icon={Wallet} trend="+12.4% vs yesterday" trendUp tone="primary" />
        <StatCard label="Outstanding Due" value={money(totalDue)} icon={AlertTriangle} trend={`${customers.filter((c) => c.due > 0).length} customers`} tone="warn" />
        <StatCard label="Low Stock Alerts" value={lowStock.length} icon={PackageCheck} trend="≤ 2 units remaining" tone="bad" />
        <StatCard label="GRN Pending" value={pendingGRN.length} icon={ShieldCheck} trend="awaiting receiving" tone="primary" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-paper rounded-xl2 border border-line shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-primary/5">
            <div>
              <h2 className="font-display font-semibold text-[15px] text-ink">Recent Invoices</h2>
              <p className="text-[12px] text-slate mt-0.5">Latest transactions across POS &amp; E-com</p>
            </div>
            <Link href="/reports" className="text-[12.5px] font-semibold text-primary-dark flex items-center gap-1 hover:underline">
              View reports <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-slate-light text-[11px] uppercase tracking-wide bg-mist">
                  <th className="px-5 py-2.5 font-medium">Invoice</th>
                  <th className="px-5 py-2.5 font-medium">Customer</th>
                  <th className="px-5 py-2.5 font-medium">Channel</th>
                  <th className="px-5 py-2.5 font-medium text-right">Total</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.slice(0, 6).map((inv) => (
                  <tr key={inv.id} className="border-t border-line hover:bg-primary/5 transition-colors">
                    <td className="px-5 py-2.5 font-mono text-[12.5px] font-semibold text-primary-dark">{inv.id}</td>
                    <td className="px-5 py-2.5 text-ink font-medium">{inv.customerName}</td>
                    <td className="px-5 py-2.5 capitalize text-slate">{inv.channel}</td>
                    <td className="px-5 py-2.5 text-right font-mono font-medium text-ink">{money(inv.total)}</td>
                    <td className="px-5 py-2.5">
                      <Badge tone={STATUS_TONE[inv.status]} dot>{STATUS_LABEL[inv.status]}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-paper rounded-xl2 border border-line shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-line bg-primary/5">
            <h2 className="font-display font-semibold text-[15px] text-ink">Low Stock Watch</h2>
            <p className="text-[12px] text-slate mt-0.5">Reorder before these run out</p>
          </div>
          <div className="divide-y divide-line">
            {lowStock.length === 0 && (
              <p className="px-5 py-6 text-[13px] text-slate">All items are healthily stocked.</p>
            )}
            {lowStock.map((p) => {
              const inStock = p.serials.filter((s) => s.status === "in_stock").length;
              return (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-10 h-10 rounded-lg bg-mist flex items-center justify-center overflow-hidden shrink-0 border border-line">
                    {typeof p.image === "string" && (p.image.startsWith("http") || p.image.startsWith("/")) ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    ) : (
                      <span className="text-base">{p.image || "📦"}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium text-ink truncate">{p.name}</p>
                    <p className="text-[11.5px] text-slate truncate">{p.variant}</p>
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
