"use client";

import { useState } from "react";
import {
  Undo2,
  Search,
  Receipt,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  User,
  Package,
  Layers,
  ArrowRightLeft,
  Clock,
  Printer,
  ChevronDown,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const SAMPLE_INVOICE_ITEMS = [
  { id: 101, name: "Samsung 43' UHD Smart Crystal 4K TV", sku: "SAM-TV-43", soldQty: 1, unitPrice: 48500, returnQty: 0, reason: "Defective Display Panel", condition: "Damaged / Scrap" },
  { id: 102, name: "Logitech MX Master 3S Wireless Mouse", sku: "LOG-MX3S-GR", soldQty: 2, unitPrice: 11500, returnQty: 1, reason: "Customer Mind Change", condition: "Resellable (Restock)" },
  { id: 103, name: "Anker 65W GaN Fast Wall Charger", sku: "ANK-65W-BLK", soldQty: 1, unitPrice: 3800, returnQty: 0, reason: "Wrong Variant Given", condition: "Resellable (Restock)" },
];

const INITIAL_RETURNS_HISTORY = [
  {
    id: "RET-2026-0042",
    invoiceNo: "INV-2026-0812",
    customer: "Kazi Motahar Hossain",
    itemsCount: 1,
    returnAmount: 11500,
    deduction: 500,
    netRefund: 11000,
    refundMode: "Store Credit / Voucher",
    type: "Customer Return",
    date: "14 Oct 2026, 03:45 PM",
    status: "Completed",
  },
  {
    id: "RET-2026-0041",
    invoiceNo: "INV-2026-0795",
    customer: "Sumona Parvin",
    itemsCount: 2,
    returnAmount: 7600,
    deduction: 0,
    netRefund: 7600,
    refundMode: "Cash Refund",
    type: "Exchange",
    date: "13 Oct 2026, 01:15 PM",
    status: "Completed",
  },
  {
    id: "RET-2026-0040",
    invoiceNo: "INV-2026-0770",
    customer: "ElectroTech Ltd (B2B)",
    itemsCount: 1,
    returnAmount: 48500,
    deduction: 0,
    netRefund: 48500,
    refundMode: "Adjust to Due Ledger",
    type: "Warranty Replacement",
    date: "12 Oct 2026, 11:30 AM",
    status: "In Review",
  },
];

export default function SalesReturnsPage() {
  const [activeTab, setActiveTab] = useState("create"); // 'create' | 'history'
  const [invoiceQuery, setInvoiceQuery] = useState("INV-2026-0891");
  const [searched, setSearched] = useState(true);
  const [customer, setCustomer] = useState({
    name: "Mahfuzur Rahman",
    phone: "01722-456789",
    type: "Gold Loyalty Member",
    branch: "Dhanmondi Flagship Outlet",
  });
  const [items, setItems] = useState(SAMPLE_INVOICE_ITEMS);
  const [refundMethod, setRefundMethod] = useState("Cash Refund");
  const [restockFee, setRestockFee] = useState(0);
  const [notes, setNotes] = useState("");
  const [history, setHistory] = useState(INITIAL_RETURNS_HISTORY);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleReturnQtyChange = (id, val) => {
    const qty = Math.max(0, parseInt(val) || 0);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, returnQty: Math.min(qty, item.soldQty) } : item))
    );
  };

  const handleReasonChange = (id, reason) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, reason } : item)));
  };

  const handleConditionChange = (id, condition) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, condition } : item)));
  };

  const totalReturnGross = items.reduce((sum, item) => sum + (item.returnQty * item.unitPrice), 0);
  const netRefundAmount = Math.max(0, totalReturnGross - restockFee);
  const totalReturnUnits = items.reduce((sum, item) => sum + item.returnQty, 0);

  const handleSubmitReturn = (e) => {
    e.preventDefault();
    if (totalReturnUnits === 0) {
      alert("Please specify at least 1 item quantity to return.");
      return;
    }

    const newRecord = {
      id: `RET-2026-00${history.length + 43}`,
      invoiceNo: invoiceQuery,
      customer: customer.name,
      itemsCount: items.filter((i) => i.returnQty > 0).length,
      returnAmount: totalReturnGross,
      deduction: Number(restockFee),
      netRefund: netRefundAmount,
      refundMode: refundMethod,
      type: "Customer Return",
      date: "Just Now",
      status: "Completed",
    };

    setHistory([newRecord, ...history]);
    setSuccessMessage(`Sales Return ${newRecord.id} generated successfully! Refund ৳${netRefundAmount.toLocaleString()} via ${refundMethod}.`);
    setTimeout(() => {
      setSuccessMessage(null);
      setActiveTab("history");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* ━━ Tab Switcher ━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-2">
        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "create"
                ? "bg-white text-[#3B7506] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plus size={14} />
            <span>Process New Return</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "history"
                ? "bg-white text-[#3B7506] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock size={14} />
            <span>Return History ({history.length})</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-[#64BD0B]/15 border border-[#64BD0B]/30 text-[#3B7506] font-bold text-sm flex items-center gap-2">
          <CheckCircle2 size={18} />
          {successMessage}
        </div>
      )}

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Returns (This Month)"
          value={`৳${history.reduce((a, b) => a + b.netRefund, 0).toLocaleString()}`}
          trend={{ value: "1.2% of total sales", positive: true }}
          icon={Undo2}
          accent="amber"
        />
        <StatCard
          label="Return Invoices"
          value={history.length.toString()}
          trend={{ value: "4 processed this week", positive: true }}
          icon={Receipt}
          accent="blue"
        />
        <StatCard
          label="Restocked to Inventory"
          value="85%"
          trend={{ value: "Verified resellable", positive: true }}
          icon={RotateCcw}
          accent="emerald"
        />
        <StatCard
          label="Store Credit Issued"
          value="৳11,000"
          trend={{ value: "Voucher retention", positive: true }}
          icon={DollarSign}
          accent="purple"
        />
      </div>

      {activeTab === "create" ? (
        <div className="space-y-5">
          {/* ━━ Step 1: Search Invoice ━━━━━━━━━━━━━━━━━ */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Search size={16} className="text-[#3B7506]" />
              <span>Step 1: Look Up Original Sales Invoice</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Receipt size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter Invoice Number (e.g. INV-2026-0891 or scan barcode)..."
                  value={invoiceQuery}
                  onChange={(e) => setInvoiceQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/70 text-sm focus:border-[#64BD0B] focus:ring-2 focus:ring-[#64BD0B]/20 outline-none transition-all"
                />
              </div>
              <button
                type="button"
                onClick={() => setSearched(true)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-sm shadow-sm transition-all"
              >
                Fetch Invoice Items
              </button>
            </div>

            {searched && (
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50/70 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block">Customer Name:</span>
                  <span className="font-bold text-slate-800">{customer.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contact Phone:</span>
                  <span className="font-bold text-slate-800">{customer.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tier / Segment:</span>
                  <span className="font-bold text-[#3B7506]">{customer.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Purchase Outlet:</span>
                  <span className="font-bold text-slate-800">{customer.branch}</span>
                </div>
              </div>
            )}
          </div>

          {/* ━━ Step 2: Select Return Items & Reasons ━━━ */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Package size={16} className="text-[#3B7506]" />
              <span>Step 2: Select Items for Return / Exchange</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-3">Product Name &amp; SKU</th>
                    <th className="py-3 px-3 text-center">Sold Qty</th>
                    <th className="py-3 px-3 text-right">Unit Price</th>
                    <th className="py-3 px-3 text-center w-28">Return Qty</th>
                    <th className="py-3 px-3">Return Reason</th>
                    <th className="py-3 px-3">Condition (Action)</th>
                    <th className="py-3 px-3 text-right">Line Refund</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-xs font-mono text-slate-400">{item.sku}</p>
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-slate-700">
                        {item.soldQty}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-slate-800">
                        ৳{item.unitPrice.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max={item.soldQty}
                          value={item.returnQty}
                          onChange={(e) => handleReturnQtyChange(item.id, e.target.value)}
                          className="w-20 text-center py-1.5 rounded-lg border border-slate-200 font-bold text-slate-800 focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] outline-none"
                        />
                      </td>
                      <td className="py-3.5 px-3">
                        <select
                          value={item.reason}
                          onChange={(e) => handleReasonChange(item.id, e.target.value)}
                          className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 text-xs bg-white focus:border-[#64BD0B] outline-none"
                        >
                          <option>Customer Mind Change</option>
                          <option>Defective Display Panel</option>
                          <option>Wrong Variant Given</option>
                          <option>Warranty Repair / Replacement</option>
                          <option>Damaged in Transit</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-3">
                        <select
                          value={item.condition}
                          onChange={(e) => handleConditionChange(item.id, e.target.value)}
                          className={`w-full py-1.5 px-2.5 rounded-lg border text-xs font-bold outline-none ${
                            item.condition.includes("Resellable")
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                              : "bg-red-50 border-red-200 text-red-800"
                          }`}
                        >
                          <option>Resellable (Restock to Shelf)</option>
                          <option>Damaged / Scrap</option>
                          <option>Send to Vendor (RTV)</option>
                          <option>Internal Service Center</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900">
                        ৳{(item.returnQty * item.unitPrice).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ━━ Step 3: Refund Settlement & Calculation Bar ━ */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-5">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <DollarSign size={16} className="text-[#3B7506]" />
              <span>Step 3: Settlement Method &amp; Confirmation</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Refund Method:
                </label>
                <select
                  value={refundMethod}
                  onChange={(e) => setRefundMethod(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-800 focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] outline-none"
                >
                  <option>Cash Refund</option>
                  <option>Store Credit / Gift Voucher</option>
                  <option>Credit Card Reversal</option>
                  <option>bKash / Nagad MFS Refund</option>
                  <option>Adjust to Customer Ledger</option>
                  <option>Direct Product Exchange</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Customer will receive printable receipt slip immediately upon submission.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Restocking Fee / Deduction (৳):
                </label>
                <input
                  type="number"
                  min="0"
                  value={restockFee}
                  onChange={(e) => setRestockFee(Number(e.target.value))}
                  placeholder="0"
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-800 focus:border-[#64BD0B] outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Applies deduction for unsealed boxes or processing fees.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Internal Return Note:
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional note for manager or warehouse supervisor..."
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:border-[#64BD0B] outline-none"
                />
              </div>
            </div>

            {/* Total Summary Footer */}
            <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-slate-400 block text-xs">Return Units:</span>
                  <span className="font-bold text-slate-800">{totalReturnUnits} units</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Gross Value:</span>
                  <span className="font-bold text-slate-800">৳{totalReturnGross.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Net Refund Due:</span>
                  <span className="font-extrabold text-[#3B7506] text-lg">
                    ৳{netRefundAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setItems(SAMPLE_INVOICE_ITEMS)}
                  className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-bold transition-colors"
                >
                  Reset Form
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReturn}
                  className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-sm shadow-[0_4px_14px_rgba(100,189,11,0.35)] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>Submit Sales Return</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ━━ History Table Tab ━━━━━━━━━━━━━━━━━━━━━━ */
        <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              Completed Sales Return Records
            </h2>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <Printer size={13} />
              <span>Export / Print</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Return ID</th>
                  <th className="py-3.5 px-4">Original Invoice</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4 text-center">Items</th>
                  <th className="py-3.5 px-4 text-right">Net Refund</th>
                  <th className="py-3.5 px-4">Refund Mode</th>
                  <th className="py-3.5 px-4">Date &amp; Time</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((record) => (
                  <tr key={record.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-xs">
                      {record.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-blue-600 font-semibold">
                      {record.invoiceNo}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {record.customer}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-semibold">
                        {record.itemsCount} item(s)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      ৳{record.netRefund.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                      {record.refundMode}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {record.date}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          record.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
