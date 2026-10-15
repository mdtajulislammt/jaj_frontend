"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Wallet2 } from "lucide-react";
import { addCustomer, settleDue } from "@/store/slices/customersSlice";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import StatCard from "@/components/StatCard";
import { Users, AlertTriangle, Star } from "lucide-react";
import { money } from "@/lib/format";

export default function CustomersPage() {
  const dispatch = useDispatch();
  const customers = useSelector((s) => s.customers.items);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", creditLimit: 0 });

  const totalDue = customers.reduce((s, c) => s + c.due, 0);
  const totalPoints = customers.reduce((s, c) => s + c.points, 0);

  function submit(e) {
    e.preventDefault();
    if (!form.name) return;
    dispatch(addCustomer({ ...form, creditLimit: Number(form.creditLimit) || 0 }));
    setForm({ name: "", phone: "", address: "", creditLimit: 0 });
    setModalOpen(false);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Stakeholders"
        title="Customers"
        description="Profiles, purchase history, loyalty points and due recovery."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-sky hover:bg-sky/90 text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg shadow-pop transition-colors"
          >
            <Plus size={15} /> Add Customer
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
        <StatCard label="Total Customers" value={customers.length} icon={Users} tone="sky" />
        <StatCard label="Total Due Outstanding" value={money(totalDue)} icon={AlertTriangle} tone="warn" />
        <StatCard label="Loyalty Points Issued" value={totalPoints} icon={Star} tone="good" />
      </div>

      <div className="bg-paper rounded-xl2 border border-line shadow-card overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-slate-light text-[11px] uppercase tracking-wide border-b border-line">
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Phone</th>
              <th className="px-5 py-3 font-medium text-right">Total Purchase</th>
              <th className="px-5 py-3 font-medium text-right">Credit Limit</th>
              <th className="px-5 py-3 font-medium text-right">Due</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-line hover:bg-mist/60 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-medium text-ink">{c.name}</p>
                  <p className="text-[11.5px] text-slate">{c.address}</p>
                </td>
                <td className="px-5 py-3 font-mono text-slate">{c.phone}</td>
                <td className="px-5 py-3 text-right font-mono text-ink">{money(c.totalPurchase)}</td>
                <td className="px-5 py-3 text-right font-mono text-slate">{money(c.creditLimit)}</td>
                <td className="px-5 py-3 text-right">
                  {c.due > 0 ? <Badge tone="warn">{money(c.due)}</Badge> : <span className="text-slate-light">—</span>}
                </td>
                <td className="px-5 py-3 text-right">
                  {c.due > 0 && (
                    <button
                      onClick={() => dispatch(settleDue({ customerId: c.id, amount: c.due }))}
                      className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-sky hover:underline"
                    >
                      <Wallet2 size={13} /> Settle Due
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={submit} className="bg-paper rounded-xl2 shadow-pop max-w-sm w-full p-6 space-y-3.5">
            <h2 className="font-display font-semibold text-ink text-[15px] mb-1">Add Customer</h2>
            <label className="block">
              <span className="block text-[11.5px] font-medium text-slate mb-1">Full Name</span>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 text-[13px] focus-visible:outline-none" />
            </label>
            <label className="block">
              <span className="block text-[11.5px] font-medium text-slate mb-1">Phone</span>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 text-[13px] focus-visible:outline-none" />
            </label>
            <label className="block">
              <span className="block text-[11.5px] font-medium text-slate mb-1">Address</span>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 text-[13px] focus-visible:outline-none" />
            </label>
            <label className="block">
              <span className="block text-[11.5px] font-medium text-slate mb-1">Credit Limit (৳)</span>
              <input type="number" value={form.creditLimit} onChange={(e) => setForm({ ...form, creditLimit: e.target.value })} className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 text-[13px] focus-visible:outline-none" />
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
