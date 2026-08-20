"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, X, ClipboardList } from "lucide-react";
import { createPO, setPOStatus } from "@/store/slices/purchaseOrdersSlice";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import { money, formatDate } from "@/lib/format";

const STATUS_TONE = { draft: "neutral", approved: "sky", grn_pending: "warn", received: "good", closed: "neutral" };
const STATUS_LABEL = { draft: "Draft", approved: "Approved", grn_pending: "GRN Pending", received: "Received", closed: "Closed" };
const NEXT_STATUS = { draft: "approved", approved: "grn_pending", grn_pending: "received", received: "closed" };

export default function PurchaseOrdersPage() {
  const dispatch = useDispatch();
  const pos = useSelector((s) => s.purchaseOrders.items);
  const suppliers = useSelector((s) => s.suppliers.items);
  const products = useSelector((s) => s.products.items);

  const [modalOpen, setModalOpen] = useState(false);
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || "");
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [qty, setQty] = useState(10);
  const [unitCost, setUnitCost] = useState(products[0]?.costPrice || 0);

  function submit(e) {
    e.preventDefault();
    const supplier = suppliers.find((s) => s.id === supplierId);
    const product = products.find((p) => p.id === productId);
    if (!supplier || !product) return;
    dispatch(
      createPO({
        supplierId,
        supplierName: supplier.name,
        lines: [{ productId, productName: product.name, qty: Number(qty), unitCost: Number(unitCost) }],
      })
    );
    setModalOpen(false);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Procurement"
        title="Purchase Orders"
        description="Request stock from suppliers and track approval through to receiving."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-sky hover:bg-sky/90 text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg shadow-pop transition-colors"
          >
            <Plus size={15} /> Create PO
          </button>
        }
      />

      <div className="bg-paper rounded-xl2 border border-line shadow-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-slate-light text-[11px] uppercase tracking-wide border-b border-line">
              <th className="px-5 py-3 font-medium">PO No.</th>
              <th className="px-5 py-3 font-medium">Supplier</th>
              <th className="px-5 py-3 font-medium">Items</th>
              <th className="px-5 py-3 font-medium text-right">Value</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {pos.map((po) => {
              const value = po.lines.reduce((s, l) => s + l.qty * l.unitCost, 0);
              const next = NEXT_STATUS[po.status];
              return (
                <tr key={po.id} className="border-t border-line hover:bg-mist/60 transition-colors">
                  <td className="px-5 py-3 font-mono text-ink">{po.id}</td>
                  <td className="px-5 py-3 text-ink">{po.supplierName}</td>
                  <td className="px-5 py-3 text-slate">
                    {po.lines.map((l) => `${l.productName} × ${l.qty}`).join(", ")}
                  </td>
                  <td className="px-5 py-3 text-right font-mono font-medium text-ink">{money(value)}</td>
                  <td className="px-5 py-3 text-slate">{formatDate(po.date)}</td>
                  <td className="px-5 py-3">
                    <Badge tone={STATUS_TONE[po.status]} dot>{STATUS_LABEL[po.status]}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    {next && (
                      <button
                        onClick={() => dispatch(setPOStatus({ poId: po.id, status: next }))}
                        className="text-[12px] font-semibold text-sky hover:underline whitespace-nowrap"
                      >
                        Mark {STATUS_LABEL[next]} →
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={submit} className="bg-paper rounded-xl2 shadow-pop max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-line">
              <div className="flex items-center gap-2">
                <ClipboardList size={16} className="text-sky" />
                <h2 className="font-display font-semibold text-ink text-[15px]">Create Purchase Order</h2>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-light hover:text-ink">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-3.5">
              <label className="block">
                <span className="block text-[11.5px] font-medium text-slate mb-1">Supplier</span>
                <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="pof-input">
                  {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="block text-[11.5px] font-medium text-slate mb-1">Product</span>
                <select
                  value={productId}
                  onChange={(e) => {
                    setProductId(e.target.value);
                    setUnitCost(products.find((p) => p.id === e.target.value)?.costPrice || 0);
                  }}
                  className="pof-input"
                >
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.variant}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-[11.5px] font-medium text-slate mb-1">Quantity</span>
                  <input type="number" min={1} value={qty} onChange={(e) => setQty(e.target.value)} className="pof-input" />
                </label>
                <label className="block">
                  <span className="block text-[11.5px] font-medium text-slate mb-1">Unit Cost (৳)</span>
                  <input type="number" min={0} value={unitCost} onChange={(e) => setUnitCost(e.target.value)} className="pof-input" />
                </label>
              </div>
              <div className="bg-mist rounded-lg px-3.5 py-2.5 flex justify-between text-[13px]">
                <span className="text-slate">Estimated Total</span>
                <span className="font-mono font-semibold text-ink">{money(qty * unitCost)}</span>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-line flex justify-end gap-2.5">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-[13px] font-medium text-slate hover:bg-mist transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-sky text-white hover:bg-sky/90 transition-colors shadow-pop">
                Submit PO
              </button>
            </div>
          </form>
        </div>
      )}
      <style jsx global>{`
        .pof-input {
          width: 100%;
          background: #eef5fc;
          border: 1px solid #dce6f0;
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 13px;
          color: #0a0e16;
        }
        .pof-input:focus-visible {
          outline: 2px solid #2f6fe4;
        }
      `}</style>
    </div>
  );
}
