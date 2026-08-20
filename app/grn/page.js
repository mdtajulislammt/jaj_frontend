"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PackageCheck, ScanBarcode } from "lucide-react";
import { createGRN, setPOStatus } from "@/store/slices/purchaseOrdersSlice";
import { addSerials } from "@/store/slices/productsSlice";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import { formatDate } from "@/lib/format";

export default function GRNPage() {
  const dispatch = useDispatch();
  const pos = useSelector((s) => s.purchaseOrders.items);
  const grns = useSelector((s) => s.purchaseOrders.grns);
  const branch = useSelector((s) => s.ui.activeBranch);

  const receivable = pos.filter((p) => p.status === "approved" || p.status === "grn_pending");
  const [selectedPO, setSelectedPO] = useState(receivable[0]?.id || "");
  const [serialText, setSerialText] = useState("");
  const [confirmed, setConfirmed] = useState(null);

  const po = pos.find((p) => p.id === selectedPO);
  const line = po?.lines[0];

  function submitGRN(e) {
    e.preventDefault();
    if (!po || !line) return;
    const serials = serialText
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((imei) => ({ imei, branch }));

    if (serials.length === 0) return;

    dispatch(addSerials({ productId: line.productId, serials }));
    dispatch(
      createGRN({
        poId: po.id,
        receivedBy: `Storekeeper · ${branch}`,
        lines: [{ productId: line.productId, productName: line.productName, qty: serials.length, serialsAdded: serials.length }],
      })
    );
    dispatch(setPOStatus({ poId: po.id, status: "received" }));
    setConfirmed({ poId: po.id, count: serials.length, product: line.productName });
    setSerialText("");
  }

  return (
    <div>
      <PageHeader
        eyebrow="Procurement"
        title="GRN — Goods Received Note"
        description="Receive stock against a PO and capture unique IMEI/Serial numbers on the way in."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-5">
        <div className="bg-paper rounded-xl2 border border-line shadow-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <PackageCheck size={16} className="text-sky" />
            <h2 className="font-display font-semibold text-ink text-[15px]">Receive Against PO</h2>
          </div>

          {receivable.length === 0 ? (
            <p className="text-[13px] text-slate py-6">No purchase orders are currently awaiting receiving.</p>
          ) : (
            <form onSubmit={submitGRN} className="space-y-3.5">
              <label className="block">
                <span className="block text-[11.5px] font-medium text-slate mb-1">Purchase Order</span>
                <select
                  value={selectedPO}
                  onChange={(e) => setSelectedPO(e.target.value)}
                  className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 text-[13px] text-ink focus-visible:outline-none"
                >
                  {receivable.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.id} — {p.supplierName}
                    </option>
                  ))}
                </select>
              </label>

              {line && (
                <div className="bg-mist rounded-lg px-3.5 py-2.5 text-[13px] text-slate">
                  Receiving <span className="font-semibold text-ink">{line.qty}× {line.productName}</span> at{" "}
                  <span className="font-semibold text-ink">{branch}</span> branch
                </div>
              )}

              <label className="block">
                <span className="block text-[11.5px] font-medium text-slate mb-1 flex items-center gap-1.5">
                  <ScanBarcode size={13} /> Scan / paste IMEI or Serial numbers (one per line)
                </span>
                <textarea
                  value={serialText}
                  onChange={(e) => setSerialText(e.target.value)}
                  rows={6}
                  placeholder={"356938035699001\n356938035699002\n356938035699003"}
                  className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 text-[12.5px] font-mono text-ink focus-visible:outline-none resize-none"
                />
              </label>

              <button
                type="submit"
                className="w-full bg-sky hover:bg-sky/90 text-white font-semibold text-[13.5px] py-2.5 rounded-lg transition-colors shadow-pop"
              >
                Confirm GRN &amp; Update Inventory
              </button>

              {confirmed && confirmed.poId === selectedPO && (
                <p className="text-[12.5px] text-good font-medium text-center">
                  ✓ {confirmed.count} units of {confirmed.product} added to stock.
                </p>
              )}
            </form>
          )}
        </div>

        <div className="bg-paper rounded-xl2 border border-line shadow-card overflow-hidden h-fit">
          <div className="px-5 py-4 border-b border-line">
            <h2 className="font-display font-semibold text-ink text-[15px]">Recent GRNs</h2>
          </div>
          <div className="divide-y divide-line">
            {grns.map((g) => (
              <div key={g.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[12.5px] text-ink">{g.id}</span>
                  <Badge tone="good">Received</Badge>
                </div>
                <p className="text-[12.5px] text-slate">
                  Against <span className="font-mono text-ink">{g.poId}</span> · {formatDate(g.date)}
                </p>
                <p className="text-[12px] text-slate-light mt-0.5">{g.receivedBy}</p>
                <div className="mt-1.5 space-y-0.5">
                  {g.lines.map((l, i) => (
                    <p key={i} className="text-[12.5px] text-ink">
                      {l.productName} — {l.serialsAdded} serials added
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
