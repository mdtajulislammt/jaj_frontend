"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  ShoppingCart,
  Clock,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Printer,
  RefreshCw,
  Plus,
  User,
  Package,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const INITIAL_DRAFTS = [
  {
    id: "DRF-2026-001",
    customer: "Rahim Chowdhury (VIP)",
    phone: "01711-234567",
    cashier: "Tanvir Ahmed",
    itemsCount: 4,
    items: [
      { name: "Sony Bravia 55' 4K OLED TV", qty: 1, price: 115000 },
      { name: "Samsung Soundbar HW-Q600B", qty: 1, price: 32000 },
      { name: "HDMI 2.1 Ultra High Speed Cable 2m", qty: 2, price: 1200 },
    ],
    subtotal: 149400,
    tax: 7470,
    discount: 5000,
    total: 151870,
    heldAt: "10:45 AM, Today",
    note: "Customer went to ATM booth to withdraw cash",
    status: "Parked",
  },
  {
    id: "DRF-2026-002",
    customer: "Walk-in Customer",
    phone: "—",
    cashier: "Sadia Sultana",
    itemsCount: 2,
    items: [
      { name: "Whirlpool Inverter AC 1.5 Ton", qty: 1, price: 68500 },
      { name: "AC Outdoor Wall Bracket Heavy Duty", qty: 1, price: 1850 },
    ],
    subtotal: 70350,
    tax: 3517,
    discount: 2000,
    total: 71867,
    heldAt: "11:20 AM, Today",
    note: "Checking model dimensions with installer",
    status: "Parked",
  },
  {
    id: "DRF-2026-003",
    customer: "Anisur Rahman (B2B)",
    phone: "01819-987654",
    cashier: "Tanvir Ahmed",
    itemsCount: 6,
    items: [
      { name: "Philips Air Fryer XL 6.2L", qty: 3, price: 16500 },
      { name: "Panasonic Microwave Oven 27L", qty: 2, price: 21500 },
      { name: "Walton Blender 3-in-1", qty: 1, price: 4200 },
    ],
    subtotal: 96700,
    tax: 4835,
    discount: 4000,
    total: 97535,
    heldAt: "12:15 PM, Today",
    note: "Awaiting purchase approval from office manager",
    status: "Parked",
  },
  {
    id: "DRF-2026-004",
    customer: "Nasreen Akter",
    phone: "01912-345678",
    cashier: "Kamrul Islam",
    itemsCount: 1,
    items: [
      { name: "LG Front Load Washer 8kg", qty: 1, price: 62000 },
    ],
    subtotal: 62000,
    tax: 3100,
    discount: 1500,
    total: 63600,
    heldAt: "Yesterday, 07:40 PM",
    note: "Customer promised to return in morning",
    status: "Expired Soon",
  },
];

export default function PosDraftsPage() {
  const [drafts, setDrafts] = useState(INITIAL_DRAFTS);
  const [search, setSearch] = useState("");
  const [selectedDraft, setSelectedDraft] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionNotice, setActionNotice] = useState(null);

  const filteredDrafts = drafts.filter(
    (d) =>
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.customer.toLowerCase().includes(search.toLowerCase()) ||
      d.cashier.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = drafts.reduce((acc, d) => acc + d.total, 0);

  const handleResumeOrder = (draft) => {
    setActionNotice(`Resuming ${draft.id} to POS Billing Terminal...`);
    setTimeout(() => {
      setActionNotice(null);
      window.location.href = "/pos";
    }, 1000);
  };

  const handleDiscardDraft = (id) => {
    if (confirm(`Are you sure you want to discard Hold Order ${id}?`)) {
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      if (selectedDraft?.id === id) setShowModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ━━ Header & Quick Action ━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#64BD0B]/10 text-[#3B7506]">
              <FileText size={22} className="text-[#3B7506]" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Hold / Draft Orders (Parked Carts)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage parked orders from the POS terminal, review pending customer carts, and resume checkout instantly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/pos"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-sm shadow-[0_4px_14px_rgba(100,189,11,0.35)] transition-all"
          >
            <ShoppingCart size={17} />
            <span>Go to POS Terminal</span>
          </Link>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-[#64BD0B]/15 border border-[#64BD0B]/30 text-[#3B7506] font-bold text-sm flex items-center gap-2 animate-pulse">
          <RefreshCw size={17} className="animate-spin" />
          {actionNotice}
        </div>
      )}

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Held Carts"
          value={drafts.length.toString()}
          trend={{ value: `${drafts.length} orders waiting`, positive: true }}
          icon={FileText}
          accent="emerald"
        />
        <StatCard
          label="Total Held Value"
          value={`৳${totalValue.toLocaleString()}`}
          trend={{ value: "Pending payment", positive: true }}
          icon={ShoppingCart}
          accent="blue"
        />
        <StatCard
          label="Parked Today"
          value={drafts.filter((d) => d.heldAt.includes("Today")).length.toString()}
          trend={{ value: "Fast turnarounds", positive: true }}
          icon={Clock}
          accent="amber"
        />
        <StatCard
          label="Auto-Expire Time"
          value="24 Hours"
          trend={{ value: "Stock returned to shelf", positive: false }}
          icon={AlertCircle}
          accent="purple"
        />
      </div>

      {/* ━━ Search & Filter Bar ━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by Draft ID, Customer, Cashier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white/70 text-sm focus:border-[#64BD0B] focus:ring-2 focus:ring-[#64BD0B]/20 outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Showing {filteredDrafts.length} parked cart(s)</span>
          </div>
        </div>
      </div>

      {/* ━━ Draft Orders Table ━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Draft ID</th>
                <th className="py-3.5 px-4">Customer &amp; Phone</th>
                <th className="py-3.5 px-4">Cashier</th>
                <th className="py-3.5 px-4">Items / Qty</th>
                <th className="py-3.5 px-4 text-right">Cart Total</th>
                <th className="py-3.5 px-4">Held Time &amp; Reason</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDrafts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileText size={36} className="mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-semibold">No Parked Orders Found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Carts put on hold in POS billing will appear here automatically.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDrafts.map((draft) => (
                  <tr key={draft.id} className="hover:bg-[#64BD0B]/5 transition-colors group">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md text-xs">
                        {draft.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{draft.customer}</p>
                      <p className="text-xs text-slate-400">{draft.phone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <User size={13} className="text-slate-400" />
                        <span>{draft.cashier}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        <Package size={12} />
                        {draft.itemsCount} lines
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        ৳{draft.total.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
                        <Clock size={12} className="text-amber-500" />
                        <span>{draft.heldAt}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate max-w-[200px] mt-0.5" title={draft.note}>
                        {draft.note}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          draft.status === "Parked"
                            ? "bg-amber-100 text-amber-700 border border-amber-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {draft.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDraft(draft);
                            setShowModal(true);
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                          title="View Cart Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResumeOrder(draft)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-xs shadow-sm transition-all"
                          title="Resume Checkout in POS"
                        >
                          <span>Resume</span>
                          <ArrowRight size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDiscardDraft(draft.id)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                          title="Discard Order"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ━━ View Cart Details Modal ━━━━━━━━━━━━━━━━━ */}
      {showModal && selectedDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-[#3B7506]" />
                <h3 className="font-bold text-slate-800">
                  Cart Details: {selectedDraft.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Customer:</span>
                  <span className="font-bold text-slate-800">{selectedDraft.customer}</span>
                  <span className="text-slate-500 block">{selectedDraft.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Cashier / Time:</span>
                  <span className="font-bold text-slate-800">{selectedDraft.cashier}</span>
                  <span className="text-slate-500 block">{selectedDraft.heldAt}</span>
                </div>
              </div>

              {selectedDraft.note && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                  <strong>Hold Reason:</strong> {selectedDraft.note}
                </div>
              )}

              {/* Items List */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Cart Items ({selectedDraft.items.length})
                </p>
                <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {selectedDraft.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-slate-400">Qty: {item.qty} × ৳{item.price.toLocaleString()}</p>
                      </div>
                      <p className="font-mono font-bold text-slate-900">
                        ৳{(item.qty * item.price).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>৳{selectedDraft.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>VAT / Tax (5%)</span>
                  <span>+৳{selectedDraft.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Discount</span>
                  <span className="text-red-500">-৳{selectedDraft.discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 text-sm pt-2 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className="text-[#3B7506]">৳{selectedDraft.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70 gap-2">
              <button
                type="button"
                onClick={() => handleDiscardDraft(selectedDraft.id)}
                className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
              >
                Discard Cart
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer size={14} />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleResumeOrder(selectedDraft)}
                  className="px-4 py-2 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <span>Resume to POS</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
