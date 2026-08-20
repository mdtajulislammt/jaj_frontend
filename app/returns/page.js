"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Undo2, Truck } from "lucide-react";
import { addSalesReturn, addRTV } from "@/store/slices/returnsSlice";
import { setSerialStatus } from "@/store/slices/productsSlice";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import { formatDate } from "@/lib/format";

const STATUS_TONE = { sent_to_damage: "warn", sent: "sky", closed: "good" };

export default function ReturnsPage() {
  const dispatch = useDispatch();
  const products = useSelector((s) => s.products.items);
  const suppliers = useSelector((s) => s.suppliers.items);
  const salesReturns = useSelector((s) => s.returns.salesReturns);
  const rtvChallans = useSelector((s) => s.returns.rtvChallans);

  const [imei, setImei] = useState("");
  const [reason, setReason] = useState("");
  const [action, setAction] = useState("replace");
  const [rtvSupplier, setRtvSupplier] = useState(suppliers[0]?.id || "");
  const [rtvNote, setRtvNote] = useState("");

  function findProductByImei(searchImei) {
    for (const p of products) {
      const s = p.serials.find((x) => x.imei === searchImei);
      if (s) return { product: p, serial: s };
    }
    return null;
  }

  function submitReturn(e) {
    e.preventDefault();
    const found = findProductByImei(imei.trim());
    if (!found) return;
    dispatch(setSerialStatus({ productId: found.product.id, imei: imei.trim(), status: "damage" }));
    dispatch(
      addSalesReturn({
        invoiceId: "—",
        productName: found.product.name,
        imei: imei.trim(),
        reason,
        action,
      })
    );
    setImei("");
    setReason("");
  }

  function submitRTV(e) {
    e.preventDefault();
    const supplier = suppliers.find((s) => s.id === rtvSupplier);
    if (!supplier) return;
    dispatch(
      addRTV({
        supplierId: rtvSupplier,
        supplierName: supplier.name,
        items: [{ productName: rtvNote || "Damaged unit", imei: "-", reason: "Batch RTV" }],
      })
    );
    setRtvNote("");
  }

  return (
    <div>
      <PageHeader
        eyebrow="Sales"
        title="Returns & RTV"
        description="Customer returns/exchange, damage handling, and return-to-vendor challans."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Sales Return */}
        <div className="bg-paper rounded-xl2 border border-line shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-center gap-2">
            <Undo2 size={16} className="text-sky" />
            <h2 className="font-display font-semibold text-ink text-[15px]">Sales Return / Exchange</h2>
          </div>
          <form onSubmit={submitReturn} className="px-5 py-4 space-y-3 border-b border-line">
            <label className="block">
              <span className="block text-[11.5px] font-medium text-slate mb-1">IMEI / Serial to search invoice</span>
              <input
                required
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                placeholder="e.g. 356938035643811"
                className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 font-mono text-[12.5px] text-ink focus-visible:outline-none"
              />
            </label>
            <label className="block">
              <span className="block text-[11.5px] font-medium text-slate mb-1">Reason</span>
              <input
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Display fault after 3 days"
                className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 text-[13px] text-ink focus-visible:outline-none"
              />
            </label>
            <div className="flex gap-3">
              {["replace", "refund"].map((a) => (
                <label key={a} className="flex items-center gap-1.5 text-[13px] text-ink capitalize cursor-pointer">
                  <input type="radio" name="action" checked={action === a} onChange={() => setAction(a)} className="accent-sky" />
                  {a}
                </label>
              ))}
            </div>
            <button type="submit" className="w-full bg-sky hover:bg-sky/90 text-white font-semibold text-[13px] py-2.5 rounded-lg transition-colors shadow-pop">
              Process Return → Send to Damage
            </button>
          </form>
          <div className="divide-y divide-line max-h-72 overflow-y-auto scrollbar-thin">
            {salesReturns.map((r) => (
              <div key={r.id} className="px-5 py-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-[12px] text-ink">{r.id}</span>
                  <Badge tone={STATUS_TONE[r.status]}>{r.status.replace(/_/g, " ")}</Badge>
                </div>
                <p className="text-[13px] text-ink">{r.productName}</p>
                <p className="text-[11.5px] font-mono text-slate-light">{r.imei}</p>
                <p className="text-[12px] text-slate mt-0.5">{r.reason} · <span className="capitalize">{r.action}</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* RTV */}
        <div className="bg-paper rounded-xl2 border border-line shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-center gap-2">
            <Truck size={16} className="text-sky" />
            <h2 className="font-display font-semibold text-ink text-[15px]">Return to Vendor (RTV)</h2>
          </div>
          <form onSubmit={submitRTV} className="px-5 py-4 space-y-3 border-b border-line">
            <label className="block">
              <span className="block text-[11.5px] font-medium text-slate mb-1">Supplier</span>
              <select value={rtvSupplier} onChange={(e) => setRtvSupplier(e.target.value)} className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 text-[13px] text-ink focus-visible:outline-none">
                {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="block text-[11.5px] font-medium text-slate mb-1">Item / Note</span>
              <input
                value={rtvNote}
                onChange={(e) => setRtvNote(e.target.value)}
                placeholder="e.g. Sony Bravia X75K — display fault"
                className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 text-[13px] text-ink focus-visible:outline-none"
              />
            </label>
            <button type="submit" className="w-full bg-ink hover:bg-ink-soft text-white font-semibold text-[13px] py-2.5 rounded-lg transition-colors">
              Generate RTV Challan
            </button>
          </form>
          <div className="divide-y divide-line max-h-72 overflow-y-auto scrollbar-thin">
            {rtvChallans.map((r) => (
              <div key={r.id} className="px-5 py-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-mono text-[12px] text-ink">{r.id}</span>
                  <Badge tone={STATUS_TONE[r.status]}>{r.status}</Badge>
                </div>
                <p className="text-[13px] text-ink">{r.supplierName}</p>
                <p className="text-[12px] text-slate mt-0.5">{r.items.map((i) => i.productName).join(", ")}</p>
                <p className="text-[11px] text-slate-light mt-0.5">{formatDate(r.date)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
