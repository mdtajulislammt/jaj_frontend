"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Truck, AlertTriangle } from "lucide-react";
import { addSupplier } from "@/store/slices/suppliersSlice";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import StatCard from "@/components/StatCard";
import { money } from "@/lib/format";

export default function SuppliersPage() {
  const dispatch = useDispatch();
  const suppliers = useSelector((s) => s.suppliers.items);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", phone: "", email: "" });

  const totalPayable = suppliers.reduce((s, x) => s + x.payable, 0);

  function submit(e) {
    e.preventDefault();
    if (!form.name) return;
    dispatch(addSupplier(form));
    setForm({ name: "", contact: "", phone: "", email: "" });
    setModalOpen(false);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Stakeholders"
        title="Suppliers"
        description="Vendor profiles, catalog relationships and accounts payable."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-sky hover:bg-sky/90 text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg shadow-pop transition-colors"
          >
            <Plus size={15} /> Add Supplier
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
        <StatCard label="Active Suppliers" value={suppliers.length} icon={Truck} tone="sky" />
        <StatCard label="Total Payable" value={money(totalPayable)} icon={AlertTriangle} tone="warn" />
      </div>

      <div className="bg-paper rounded-xl2 border border-line shadow-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-slate-light text-[11px] uppercase tracking-wide border-b border-line">
              <th className="px-5 py-3 font-medium">Supplier</th>
              <th className="px-5 py-3 font-medium">Contact Person</th>
              <th className="px-5 py-3 font-medium">Phone / Email</th>
              <th className="px-5 py-3 font-medium text-right">Total Purchase</th>
              <th className="px-5 py-3 font-medium text-right">Payable</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="border-t border-line hover:bg-mist/60 transition-colors">
                <td className="px-5 py-3 font-medium text-ink">{s.name}</td>
                <td className="px-5 py-3 text-slate">{s.contact}</td>
                <td className="px-5 py-3">
                  <p className="font-mono text-[12.5px] text-slate">{s.phone}</p>
                  <p className="text-[11.5px] text-slate-light">{s.email}</p>
                </td>
                <td className="px-5 py-3 text-right font-mono text-ink">{money(s.totalPurchase)}</td>
                <td className="px-5 py-3 text-right">
                  {s.payable > 0 ? <Badge tone="warn">{money(s.payable)}</Badge> : <Badge tone="good">Settled</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={submit} className="bg-paper rounded-xl2 shadow-pop max-w-sm w-full p-6 space-y-3.5">
            <h2 className="font-display font-semibold text-ink text-[15px] mb-1">Add Supplier</h2>
            <label className="block">
              <span className="block text-[11.5px] font-medium text-slate mb-1">Company Name</span>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 text-[13px] focus-visible:outline-none" />
            </label>
            <label className="block">
              <span className="block text-[11.5px] font-medium text-slate mb-1">Contact Person</span>
              <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 text-[13px] focus-visible:outline-none" />
            </label>
            <label className="block">
              <span className="block text-[11.5px] font-medium text-slate mb-1">Phone</span>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 text-[13px] focus-visible:outline-none" />
            </label>
            <label className="block">
              <span className="block text-[11.5px] font-medium text-slate mb-1">Email</span>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 text-[13px] focus-visible:outline-none" />
            </label>
            <div className="flex justify-end gap-2.5 pt-1">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg text-[13px] font-medium text-slate hover:bg-mist transition-colors">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg text-[13px] font-semibold bg-sky text-white hover:bg-sky/90 transition-colors shadow-pop">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
