"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Save, Settings2, MapPin, ShieldCheck, Printer } from "lucide-react";
import { updateSettings } from "@/store/slices/settingsSlice";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";

const PRINTER_OPTIONS = [
  { value: "thermal_80mm", label: "Thermal · 80mm POS Slip" },
  { value: "a5", label: "A5 Sheet" },
  { value: "a4", label: "A4 Sheet" },
];

export default function SettingsPage() {
  const dispatch = useDispatch();
  const settings = useSelector((s) => s.settings);
  const [form, setForm] = useState({
    vatPercent: settings.vatPercent,
    invoicePrefix: settings.invoicePrefix,
    printerFormat: settings.printerFormat,
  });
  const [saved, setSaved] = useState(false);

  function save(e) {
    e.preventDefault();
    dispatch(updateSettings({ ...form, vatPercent: Number(form.vatPercent) }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Tax rules, invoice/printer format, branches and role-based access."
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <form onSubmit={save} className="bg-paper rounded-xl2 border border-line shadow-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Settings2 size={16} className="text-sky" />
            <h2 className="font-display font-semibold text-ink text-[15px]">Tax &amp; Invoicing</h2>
          </div>
          <div className="space-y-3.5">
            <label className="block">
              <span className="block text-[11.5px] font-medium text-slate mb-1">VAT / Tax Rate (%)</span>
              <input
                type="number"
                step="0.1"
                value={form.vatPercent}
                onChange={(e) => setForm({ ...form, vatPercent: e.target.value })}
                className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 text-[13px] text-ink focus-visible:outline-none"
              />
            </label>
            <label className="block">
              <span className="block text-[11.5px] font-medium text-slate mb-1">Invoice Number Prefix</span>
              <input
                value={form.invoicePrefix}
                onChange={(e) => setForm({ ...form, invoicePrefix: e.target.value })}
                className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 font-mono text-[13px] text-ink focus-visible:outline-none"
              />
            </label>
            <label className="block">
              <span className="block text-[11.5px] font-medium text-slate mb-1 flex items-center gap-1.5">
                <Printer size={13} /> Printer Format
              </span>
              <select
                value={form.printerFormat}
                onChange={(e) => setForm({ ...form, printerFormat: e.target.value })}
                className="w-full bg-mist border border-line rounded-lg px-2.5 py-2 text-[13px] text-ink focus-visible:outline-none"
              >
                {PRINTER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-sky hover:bg-sky/90 text-white font-semibold text-[13.5px] py-2.5 rounded-lg transition-colors shadow-pop"
            >
              <Save size={15} /> {saved ? "Saved ✓" : "Save Settings"}
            </button>
          </div>
        </form>

        <div className="bg-paper rounded-xl2 border border-line shadow-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-sky" />
            <h2 className="font-display font-semibold text-ink text-[15px]">Branch Configuration</h2>
          </div>
          <div className="space-y-2.5">
            {settings.branches.map((b) => (
              <div key={b.id} className="flex items-start justify-between gap-3 px-3.5 py-2.5 bg-mist rounded-lg">
                <div>
                  <p className="text-[13px] font-medium text-ink">{b.name}</p>
                  <p className="text-[11.5px] text-slate">{b.address}</p>
                </div>
                <Badge tone="sky">Active</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-paper rounded-xl2 border border-line shadow-card p-5 xl:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-sky" />
            <h2 className="font-display font-semibold text-ink text-[15px]">Role-Based Access Control (RBAC)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {settings.roles.map((r) => (
              <div key={r.id} className="border border-line rounded-xl2 p-3.5">
                <p className="font-display font-semibold text-ink text-[13.5px] mb-1">{r.name}</p>
                <p className="text-[12px] text-slate leading-snug">{r.access}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
