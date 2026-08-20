"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ArrowLeftRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import StatCard from "@/components/StatCard";
import { Boxes, AlertOctagon } from "lucide-react";

export default function InventoryPage() {
  const products = useSelector((s) => s.products.items);
  const branches = useSelector((s) => s.ui.branches);
  const [branchFilter, setBranchFilter] = useState("All");

  const rows = useMemo(() => {
    return products.map((p) => {
      const byBranch = branches.map((b) => {
        const serials = p.serials.filter((s) => s.branch === b);
        return {
          branch: b,
          inStock: serials.filter((s) => s.status === "in_stock").length,
          sold: serials.filter((s) => s.status === "sold").length,
          damage: serials.filter((s) => s.status === "damage").length,
        };
      });
      const totalInStock = p.serials.filter((s) => s.status === "in_stock").length;
      const totalDamage = p.serials.filter((s) => s.status === "damage").length;
      const totalSold = p.serials.filter((s) => s.status === "sold").length;
      return { product: p, byBranch, totalInStock, totalDamage, totalSold };
    });
  }, [products, branches]);

  const totalUnits = products.reduce((s, p) => s + p.serials.length, 0);
  const totalDamageAll = products.reduce((s, p) => s + p.serials.filter((x) => x.status === "damage").length, 0);
  const totalInStockAll = products.reduce((s, p) => s + p.serials.filter((x) => x.status === "in_stock").length, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Stock"
        title="Inventory"
        description="Branch-wise, IMEI-level stock levels updated in real time from POS and GRN."
        action={
          <button className="inline-flex items-center gap-2 border border-line bg-paper hover:bg-mist text-ink text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors">
            <ArrowLeftRight size={15} /> New Stock Transfer
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
        <StatCard label="Total Units Tracked" value={totalUnits} icon={Boxes} tone="sky" />
        <StatCard label="Available In Stock" value={totalInStockAll} icon={Boxes} tone="good" />
        <StatCard label="Flagged as Damage" value={totalDamageAll} icon={AlertOctagon} tone="bad" />
      </div>

      <div className="flex items-center gap-2 mb-3">
        {["All", ...branches].map((b) => (
          <button
            key={b}
            onClick={() => setBranchFilter(b)}
            className={`px-3 py-1.5 rounded-lg text-[12.5px] font-medium border transition-colors ${
              branchFilter === b ? "bg-ink text-white border-ink" : "bg-paper text-slate border-line hover:bg-mist"
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      <div className="bg-paper rounded-xl2 border border-line shadow-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-slate-light text-[11px] uppercase tracking-wide border-b border-line">
              <th className="px-5 py-3 font-medium">Product</th>
              {branchFilter === "All"
                ? branches.map((b) => <th key={b} className="px-5 py-3 font-medium text-center">{b}</th>)
                : <th className="px-5 py-3 font-medium text-center">In Stock</th>}
              <th className="px-5 py-3 font-medium text-center">Sold</th>
              <th className="px-5 py-3 font-medium text-center">Damage</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ product, byBranch, totalDamage, totalSold }) => (
              <tr key={product.id} className="border-t border-line hover:bg-mist/60 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-mist flex items-center justify-center text-base">{product.image}</div>
                    <div>
                      <p className="font-medium text-ink">{product.name}</p>
                      <p className="text-[11.5px] text-slate">{product.variant}</p>
                    </div>
                  </div>
                </td>
                {branchFilter === "All" ? (
                  byBranch.map((bb) => (
                    <td key={bb.branch} className="px-5 py-3 text-center">
                      <Badge tone={bb.inStock === 0 ? "bad" : bb.inStock <= 2 ? "warn" : "good"}>{bb.inStock}</Badge>
                    </td>
                  ))
                ) : (
                  <td className="px-5 py-3 text-center">
                    {(() => {
                      const bb = byBranch.find((x) => x.branch === branchFilter);
                      return <Badge tone={bb.inStock === 0 ? "bad" : bb.inStock <= 2 ? "warn" : "good"}>{bb.inStock}</Badge>;
                    })()}
                  </td>
                )}
                <td className="px-5 py-3 text-center text-slate">{totalSold}</td>
                <td className="px-5 py-3 text-center">
                  {totalDamage > 0 ? <Badge tone="bad">{totalDamage}</Badge> : <span className="text-slate-light">0</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
