"use client";

import { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, ChevronDown, X, ShieldCheck } from "lucide-react";
import { addProduct, resetToDemo } from "@/store/slices/productsSlice";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import { money } from "@/lib/format";
import clsx from "clsx";

const emptyForm = {
  name: "",
  brand: "Samsung",
  categoryId: "cat-mobile",
  variant: "",
  sku: "",
  barcode: "",
  costPrice: "",
  sellPrice: "",
  warrantyMonths: 12,
  warrantyLabel: "1 Year Official",
  trackSerial: true,
  image: "📦",
};

export default function ProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector((s) => s.products.items);
  const categories = useSelector((s) => s.products.categories);
  const brands = useSelector((s) => s.products.brands);
  const [expanded, setExpanded] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (products.length < 20 || products.some((p) => !p.image || !p.image.startsWith("http"))) {
      dispatch(resetToDemo());
    }
  }, [products, dispatch]);

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.sku) return;
    dispatch(
      addProduct({
        ...form,
        costPrice: Number(form.costPrice) || 0,
        sellPrice: Number(form.sellPrice) || 0,
        warrantyMonths: Number(form.warrantyMonths) || 0,
      })
    );
    setForm(emptyForm);
    setModalOpen(false);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="Category, brand, variant and warranty rules for every SKU."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all hover:scale-[1.02]"
          >
            <Plus size={15} /> Add Product
          </button>
        }
      />

      <div className="bg-paper rounded-xl2 border border-line shadow-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-slate-light text-[11px] uppercase tracking-wide border-b border-line">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">SKU / Barcode</th>
              <th className="px-5 py-3 font-medium">Warranty</th>
              <th className="px-5 py-3 font-medium text-right">Cost</th>
              <th className="px-5 py-3 font-medium text-right">Sell Price</th>
              <th className="px-5 py-3 font-medium text-center">In Stock</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const inStock = p.serials.filter((s) => s.status === "in_stock").length;
              const open = expanded === p.id;
              return (
                <Fragment key={p.id}>
                  <tr
                    onClick={() => setExpanded(open ? null : p.id)}
                    className="border-t border-line hover:bg-mist/60 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-mist flex items-center justify-center overflow-hidden shrink-0 border border-line">
                          {typeof p.image === "string" && (p.image.startsWith("http") || p.image.startsWith("/")) ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                          ) : (
                            <span className="text-base">{p.image || "📦"}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-ink">{p.name}</p>
                          <p className="text-[11.5px] text-slate">{p.brand} · {p.variant}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-[12px] text-slate">
                      {p.sku}<br /><span className="text-slate-light">{p.barcode}</span>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone="sky">{p.warrantyLabel}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-slate">{money(p.costPrice)}</td>
                    <td className="px-5 py-3 text-right font-mono font-medium text-ink">{money(p.sellPrice)}</td>
                    <td className="px-5 py-3 text-center">
                      <Badge tone={inStock === 0 ? "bad" : inStock <= 2 ? "warn" : "good"}>{inStock}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <ChevronDown size={15} className={clsx("text-slate-light transition-transform ml-auto", open && "rotate-180")} />
                    </td>
                  </tr>
                  {open && (
                    <tr className="bg-mist/40 border-t border-line">
                      <td colSpan={7} className="px-5 py-4">
                        <p className="text-[11px] font-semibold tracking-widest text-slate uppercase mb-2">
                          Serial / IMEI Tracking ({p.serials.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {p.serials.map((s) => (
                            <div
                              key={s.imei}
                              className="flex items-center gap-2 bg-paper border border-line rounded-lg px-3 py-1.5"
                            >
                              <span className="font-mono text-[12px] text-ink">{s.imei}</span>
                              <span className="text-[11px] text-slate-light">· {s.branch}</span>
                              <Badge
                                tone={s.status === "in_stock" ? "good" : s.status === "sold" ? "neutral" : "bad"}
                              >
                                {s.status.replace("_", " ")}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#64BD0B]" />
                <h2 className="font-bold text-slate-800 text-[15px]">Add New Product</h2>
              </div>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 grid grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto scrollbar-thin">
              <Field label="Product Name" className="col-span-2">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
              </Field>
              <Field label="Brand">
                <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input">
                  {brands.map((b) => <option key={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="Category">
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="input">
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Variant" className="col-span-2">
                <input placeholder="e.g. Black · 8GB/256GB" value={form.variant} onChange={(e) => setForm({ ...form, variant: e.target.value })} className="input" />
              </Field>
              <Field label="SKU">
                <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="input" />
              </Field>
              <Field label="Barcode">
                <input value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} className="input" />
              </Field>
              <Field label="Cost Price / TP (৳)">
                <input type="number" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} className="input" />
              </Field>
              <Field label="Sell Price / MRP (৳)">
                <input type="number" value={form.sellPrice} onChange={(e) => setForm({ ...form, sellPrice: e.target.value })} className="input" />
              </Field>
              <Field label="Warranty (months)">
                <input type="number" value={form.warrantyMonths} onChange={(e) => setForm({ ...form, warrantyMonths: e.target.value })} className="input" />
              </Field>
              <Field label="Warranty Label">
                <input value={form.warrantyLabel} onChange={(e) => setForm({ ...form, warrantyLabel: e.target.value })} className="input" />
              </Field>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2.5 bg-slate-50">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl text-[13px] font-bold bg-[#64BD0B] text-white hover:bg-[#529E08] transition-all shadow-sm hover:scale-[1.01]">
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx global>{`
        .input {
          width: 100%;
          background: var(--bg-mist, #f4f8f1);
          border: 1px solid var(--border-line, #dde8d6);
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 13px;
          color: #0a0e16;
        }
        .input:focus-visible {
          outline: 2px solid var(--primary);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children, className }) {
  return (
    <label className={clsx("block", className)}>
      <span className="block text-[11.5px] font-medium text-slate mb-1">{label}</span>
      {children}
    </label>
  );
}
