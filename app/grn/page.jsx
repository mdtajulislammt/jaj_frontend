"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PackageCheck,
  Search,
  RefreshCw,
  Trash2,
  Calendar,
  CheckCircle2,
  List,
  ScanBarcode,
  X,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Badge from "@/components/Badge";
import CursorPagination from "@/components/CursorPagination";
import { money } from "@/lib/format";
import { createGRN } from "@/store/slices/purchaseOrdersSlice";

export default function GRNPage() {
  const dispatch = useDispatch();
  const suppliers = useSelector((s) => s.suppliers.items);
  const products = useSelector((s) => s.products.items);
  const existingGRNs = useSelector((s) => s.purchaseOrders.grns || []);

  const [activeTab, setActiveTab] = useState("create"); // "create" | "history"
  const [grnPage, setGrnPage] = useState(1);
  const [grnPageSize, setGrnPageSize] = useState(10);

  // Options matching Screenshot 1: Purchase Order No | TPN No | Without Po
  const [grnSourceType, setGrnSourceType] = useState("without_po");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [poStatus, setPoStatus] = useState("Full GRN");
  const [productSearch, setProductSearch] = useState("");

  const [receivableList, setReceivableList] = useState([]);
  const [shippingCost, setShippingCost] = useState("");
  const [voucherNo, setVoucherNo] = useState("");
  const [voucherDate, setVoucherDate] = useState("2026-10-15");
  const [grnNote, setGrnNote] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId);

  const availableProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    return matchesSearch;
  });

  const addToReceivable = (prod) => {
    const existing = receivableList.find((i) => i.id === prod.id);
    if (existing) {
      setReceivableList(
        receivableList.map((i) =>
          i.id === prod.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setReceivableList([
        ...receivableList,
        {
          id: prod.id,
          code: prod.sku,
          name: prod.name,
          stock: prod.serials?.filter((s) => s.status === "in_stock").length || 10,
          qty: 1,
          tp: prod.costPrice || 25000,
          mrp: prod.sellPrice || 30000,
          cp: prod.costPrice || 25000,
        },
      ]);
    }
  };

  const updateQty = (id, newQty) => {
    const q = Math.max(1, Number(newQty) || 1);
    setReceivableList(
      receivableList.map((i) => (i.id === id ? { ...i, qty: q } : i))
    );
  };

  const removeItem = (id) => {
    setReceivableList(receivableList.filter((i) => i.id !== id));
  };

  // Calculations
  const totalItems = receivableList.reduce((s, i) => s + i.qty, 0);
  const totalAmount = receivableList.reduce((s, i) => s + i.qty * i.tp, 0);
  const numShipping = Number(shippingCost) || 0;
  const grandTotal = totalAmount + numShipping;

  const handleCreateGRN = (e) => {
    e.preventDefault();
    if (receivableList.length === 0) {
      alert("Please add at least one product to the Receivable Products List!");
      return;
    }

    const payload = {
      poId: voucherNo || `GRN-${Math.floor(1000 + Math.random() * 9000)}`,
      receivedBy: "Store Manager",
      sourceType: grnSourceType,
      poStatus,
      voucherNo,
      voucherDate,
      lines: receivableList.map((r) => ({
        productId: r.id,
        productName: r.name,
        qty: r.qty,
        tp: r.tp,
      })),
      total: grandTotal,
      note: grnNote,
    };

    dispatch(createGRN(payload));
    setSuccessMsg("Goods Receive Note (GRN) created and stock received into inventory!");
    setReceivableList([]);
    setVoucherNo("");
    setGrnNote("");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-end gap-4 mb-2">
        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-bold transition-all ${
              activeTab === "create"
                ? "bg-[#64BD0B] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            + Create GRN
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-bold transition-all ${
              activeTab === "history"
                ? "bg-[#64BD0B] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <List size={14} className="inline mr-1" /> GRN History
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-[#64BD0B]/15 border border-[#64BD0B]/30 text-[#2C6004] px-4 py-3 rounded-xl flex items-center gap-2 font-semibold text-[13px] animate-in fade-in">
          <CheckCircle2 size={17} /> {successMsg}
        </div>
      )}

      {activeTab === "create" ? (
        <form onSubmit={handleCreateGRN} className="space-y-4">
          {/* Top Options & Supplier Search Bar (Screenshot 1 Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Top: Radio options & Supplier Search */}
            <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-white/90 shadow-sm space-y-3">
              {/* Checkboxes/Radios */}
              <div className="flex items-center gap-5 text-[13px] font-semibold text-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="grnSource"
                    checked={grnSourceType === "po_no"}
                    onChange={() => setGrnSourceType("po_no")}
                    className="accent-[#64BD0B]"
                  />
                  <span>Purchase Order No</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="grnSource"
                    checked={grnSourceType === "tpn_no"}
                    onChange={() => setGrnSourceType("tpn_no")}
                    className="accent-[#64BD0B]"
                  />
                  <span>TPN No</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="grnSource"
                    checked={grnSourceType === "without_po"}
                    onChange={() => setGrnSourceType("without_po")}
                    className="accent-[#64BD0B]"
                  />
                  <span>Without Po</span>
                </label>
              </div>

              {/* Supplier Search Dropdown */}
              <div>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                >
                  <option value="">Supplier Search</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.contact})
                    </option>
                  ))}
                </select>
              </div>

              {/* PO Status */}
              <div>
                <label className="block text-[11.5px] font-semibold text-slate-600 mb-1">
                  PO Status
                </label>
                <select
                  value={poStatus}
                  onChange={(e) => setPoStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                >
                  <option value="Full GRN">Full GRN</option>
                  <option value="Partial GRN">Partial GRN</option>
                </select>
              </div>

              {/* Supplier Products List Panel */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12.5px] font-bold text-slate-800">Supplier Products List</p>
                  <button
                    type="button"
                    onClick={() => setProductSearch("")}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <RefreshCw size={13} />
                  </button>
                </div>

                <div className="relative mb-2">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Product"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-[12px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>

                <div className="overflow-x-auto max-h-[220px] scrollbar-thin">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="text-left text-slate-500 bg-slate-100/80">
                        <th className="px-2.5 py-1.5 font-semibold">#</th>
                        <th className="px-2.5 py-1.5 font-semibold">Name</th>
                        <th className="px-2.5 py-1.5 font-semibold text-center">Stock</th>
                        <th className="px-2.5 py-1.5 font-semibold text-right">TP</th>
                        <th className="px-2.5 py-1.5 font-semibold text-center">Add</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {availableProducts.slice(0, 6).map((p, idx) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="px-2.5 py-1.5 text-slate-400">{idx + 1}</td>
                          <td className="px-2.5 py-1.5 font-medium text-slate-800 truncate max-w-[130px]">
                            {p.name}
                          </td>
                          <td className="px-2.5 py-1.5 text-center font-bold text-slate-600">
                            {p.serials?.filter((s) => s.status === "in_stock").length || 10}
                          </td>
                          <td className="px-2.5 py-1.5 text-right font-mono text-slate-700">
                            {money(p.costPrice || 25000)}
                          </td>
                          <td className="px-2.5 py-1.5 text-center">
                            <button
                              type="button"
                              onClick={() => addToReceivable(p)}
                              className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#64BD0B] text-white hover:bg-[#529E08]"
                            >
                              +
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between font-medium">
                  <span>Items: 0</span>
                  <span>Tax: 0.00</span>
                  <span>Total: 0.00</span>
                  <span>Grand Total: 0.00</span>
                </div>
              </div>
            </div>

            {/* Right Top & Main: Receivable Products List (Screenshot 1 Right) */}
            <div className="lg:col-span-7 bg-white/80 backdrop-blur-xl p-4 md:p-5 rounded-2xl border border-white/90 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="font-display font-bold text-[15px] text-slate-900">
                    Receivable Products List
                  </h3>
                  <span className="text-[11.5px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2.5 py-0.5 rounded-full">
                    {receivableList.length} Items to receive
                  </span>
                </div>

                <div className="overflow-x-auto min-h-[160px] max-h-[240px] scrollbar-thin mt-2">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="text-left text-slate-500 bg-slate-50 border-b border-slate-200">
                        <th className="px-2 py-1.5 font-semibold">#</th>
                        <th className="px-2 py-1.5 font-semibold">Code</th>
                        <th className="px-2 py-1.5 font-semibold">Name</th>
                        <th className="px-2 py-1.5 font-semibold text-center">Qty</th>
                        <th className="px-2 py-1.5 font-semibold text-right">TP</th>
                        <th className="px-2 py-1.5 font-semibold text-right">MRP</th>
                        <th className="px-2 py-1.5 font-semibold text-right">CP</th>
                        <th className="px-2 py-1.5 font-semibold text-right">Total</th>
                        <th className="px-2 py-1.5 font-semibold text-center">[x]</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {receivableList.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-4 py-12 text-center text-slate-400 font-medium">
                            Please Select a GRN Order
                          </td>
                        </tr>
                      ) : (
                        receivableList.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="px-2 py-2 text-slate-400 font-mono">{idx + 1}</td>
                            <td className="px-2 py-2 font-mono text-slate-600">{item.code}</td>
                            <td className="px-2 py-2 font-bold text-slate-900 truncate max-w-[130px]">
                              {item.name}
                            </td>
                            <td className="px-2 py-2 text-center">
                              <input
                                type="number"
                                min={1}
                                value={item.qty}
                                onChange={(e) => updateQty(item.id, e.target.value)}
                                className="w-12 text-center bg-white border border-slate-200 rounded px-1 py-0.5 text-[11.5px]"
                              />
                            </td>
                            <td className="px-2 py-2 text-right font-mono text-slate-700">{money(item.tp)}</td>
                            <td className="px-2 py-2 text-right font-mono text-slate-700">{money(item.mrp)}</td>
                            <td className="px-2 py-2 text-right font-mono text-slate-700">{money(item.cp)}</td>
                            <td className="px-2 py-2 text-right font-mono font-bold text-[#3B7506]">
                              {money(item.qty * item.tp)}
                            </td>
                            <td className="px-2 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="text-slate-400 hover:text-rose-500"
                              >
                                <X size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Shipping Cost field */}
                <div className="pt-2">
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                    Shipping Cost
                  </label>
                  <input
                    type="number"
                    placeholder="Shipping Cost"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>

                {/* Summary calculation bar */}
                <div className="mt-3 bg-slate-100 border border-slate-200 rounded-xl p-2.5 flex flex-wrap justify-between text-[12px] font-semibold text-slate-700">
                  <span>Items: {totalItems}</span>
                  <span>Tax: 0.00</span>
                  <span>Total: {money(totalAmount)}</span>
                  <span>Shipping Cost: {money(numShipping)}</span>
                  <span className="text-[#3B7506] font-bold">Grand Total: {money(grandTotal)}</span>
                </div>

                {/* Voucher No & Voucher Date */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                      Voucher No
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. VCH-99210"
                      value={voucherNo}
                      onChange={(e) => setVoucherNo(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                      Voucher Date
                    </label>
                    <input
                      type="date"
                      value={voucherDate}
                      onChange={(e) => setVoucherDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                    />
                  </div>
                </div>

                {/* GRN Note */}
                <div className="mt-3">
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">
                    GRN Note
                  </label>
                  <textarea
                    rows={2}
                    placeholder="GRN Note / receiving remark…"
                    value={grnNote}
                    onChange={(e) => setGrnNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
              </div>

              {/* Create GRN Button (Exact Screenshot 1 design) */}
              <div className="pt-3 flex justify-start">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[13px] px-5 py-2.5 rounded-xl shadow-md transition-all"
                >
                  <PackageCheck size={16} /> Create GRN
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* GRN History Tab */
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-sm overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">GRN No</th>
                <th className="px-6 py-3.5 font-semibold">Received Date</th>
                <th className="px-6 py-3.5 font-semibold">Received By</th>
                <th className="px-6 py-3.5 font-semibold text-center">Items Qty</th>
                <th className="px-6 py-3.5 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {existingGRNs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                    No Goods Receive Notes recorded yet.
                  </td>
                </tr>
              ) : (
                existingGRNs
                  .slice((grnPage - 1) * grnPageSize, grnPage * grnPageSize)
                  .map((g, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#3B7506]">{g.poId}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-[12px]">{g.voucherDate || "2026-10-15"}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800">{g.receivedBy}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">
                      {g.lines?.reduce((s, l) => s + l.qty, 0) || 1} pcs
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge tone="good" dot>Stock Inward Complete</Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Cursor Pagination for GRN History */}
          <div className="p-3 bg-white border-t border-slate-100">
            <CursorPagination
              totalItems={existingGRNs.length}
              pageSize={grnPageSize}
              onPageSizeChange={setGrnPageSize}
              currentPage={grnPage}
              onPageChange={setGrnPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
