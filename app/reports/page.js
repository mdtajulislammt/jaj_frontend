"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { TrendingUp, PackageSearch, ShieldAlert } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { money, formatDate } from "@/lib/format";

export default function ReportsPage() {
  const invoices = useSelector((s) => s.sales.invoices);
  const products = useSelector((s) => s.products.items);
  const returns = useSelector((s) => s.returns.salesReturns);

  const grossSales = invoices.reduce((s, i) => s + i.total, 0);
  const totalDiscount = invoices.reduce((s, i) => s + i.discount, 0);
  const estCogs = invoices.reduce((sum, inv) => {
    return (
      sum +
      inv.items.reduce((s, it) => {
        const product = products.find((p) => p.id === it.productId);
        return s + (product ? product.costPrice * it.qty : 0);
      }, 0)
    );
  }, 0);
  const grossProfit = grossSales - estCogs;

  const brandPerformance = useMemo(() => {
    const map = {};
    invoices.forEach((inv) => {
      inv.items.forEach((it) => {
        const product = products.find((p) => p.id === it.productId);
        const brand = product?.brand || "Other";
        map[brand] = (map[brand] || 0) + it.price * it.qty;
      });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [invoices, products]);

  const maxBrandValue = Math.max(1, ...brandPerformance.map(([, v]) => v));

  const agingStock = useMemo(() => {
    return products
      .map((p) => ({
        ...p,
        inStock: p.serials.filter((s) => s.status === "in_stock").length,
      }))
      .filter((p) => p.inStock > 0)
      .sort((a, b) => b.inStock - a.inStock);
  }, [products]);

  const warrantyByBrand = useMemo(() => {
    const map = {};
    returns.forEach((r) => {
      const product = products.find((p) => p.name === r.productName);
      const brand = product?.brand || "Other";
      map[brand] = (map[brand] || 0) + 1;
    });
    return Object.entries(map);
  }, [returns, products]);

  return (
    <div>
      <PageHeader
        eyebrow="Insights"
        title="Reports"
        description="Sales performance, stock aging and warranty claim analysis."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        <StatCard label="Gross Sales" value={money(grossSales)} icon={TrendingUp} tone="sky" />
        <StatCard label="Est. Gross Profit" value={money(grossProfit)} icon={TrendingUp} tone="good" />
        <StatCard label="Total Discount Given" value={money(totalDiscount)} icon={PackageSearch} tone="warn" />
        <StatCard label="Warranty Claims" value={returns.length} icon={ShieldAlert} tone="bad" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        <div className="bg-paper rounded-xl2 border border-line shadow-card p-5">
          <h2 className="font-display font-semibold text-ink text-[15px] mb-4">Sales by Brand</h2>
          <div className="space-y-3">
            {brandPerformance.map(([brand, value]) => (
              <div key={brand}>
                <div className="flex justify-between text-[12.5px] mb-1">
                  <span className="text-ink font-medium">{brand}</span>
                  <span className="font-mono text-slate">{money(value)}</span>
                </div>
                <div className="h-2 rounded-full bg-mist overflow-hidden">
                  <div
                    className="h-full bg-sky rounded-full"
                    style={{ width: `${(value / maxBrandValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {brandPerformance.length === 0 && <p className="text-[13px] text-slate">No sales recorded yet.</p>}
          </div>
        </div>

        <div className="bg-paper rounded-xl2 border border-line shadow-card p-5">
          <h2 className="font-display font-semibold text-ink text-[15px] mb-4">Warranty Claims by Brand</h2>
          {warrantyByBrand.length === 0 ? (
            <p className="text-[13px] text-slate">No claims recorded — brand reliability looking healthy.</p>
          ) : (
            <div className="space-y-2.5">
              {warrantyByBrand.map(([brand, count]) => (
                <div key={brand} className="flex items-center justify-between px-3.5 py-2.5 bg-mist rounded-lg">
                  <span className="text-[13px] text-ink font-medium">{brand}</span>
                  <Badge tone="bad">{count} claim{count > 1 ? "s" : ""}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-paper rounded-xl2 border border-line shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-line">
          <h2 className="font-display font-semibold text-ink text-[15px]">Stock Aging — Fast vs Slow Moving</h2>
          <p className="text-[12px] text-slate mt-0.5">Units currently sitting in stock, most to least</p>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-slate-light text-[11px] uppercase tracking-wide border-b border-line">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Brand</th>
              <th className="px-5 py-3 font-medium text-center">Units In Stock</th>
              <th className="px-5 py-3 font-medium">Movement</th>
            </tr>
          </thead>
          <tbody>
            {agingStock.map((p) => (
              <tr key={p.id} className="border-t border-line hover:bg-mist/60 transition-colors">
                <td className="px-5 py-3 text-ink font-medium">{p.name}</td>
                <td className="px-5 py-3 text-slate">{p.brand}</td>
                <td className="px-5 py-3 text-center font-mono text-ink">{p.inStock}</td>
                <td className="px-5 py-3">
                  <Badge tone={p.inStock >= 3 ? "warn" : "good"}>
                    {p.inStock >= 3 ? "Slow-moving" : "Fast-moving"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
