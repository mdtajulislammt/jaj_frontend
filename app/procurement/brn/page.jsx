"use client";

import { useState, useMemo } from "react";
import {
  PackageCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  List,
  ScanBarcode,
  Truck,
  Building2,
  FileText,
  ShieldAlert,
  Boxes,
  TrendingUp,
  RotateCw,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import CursorPagination from "@/components/CursorPagination";
import { money } from "@/lib/format";
import mockData from "@/data/mockData.json";

export default function BrnPage() {
  const [activeTab, setActiveTab] = useState("inbound"); // "inbound" | "history"
  const [selectedTpnId, setSelectedTpnId] = useState("TPN-1011");
  const [serialScanInput, setSerialScanInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Inbound TPN manifests list from mockData
  const [manifests, setManifests] = useState(mockData.tpnManifests || []);
  const [brnHistory, setBrnHistory] = useState(mockData.brnReceipts || []);

  // Pagination states for history tab
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Active TPN object being received
  const activeTpn = useMemo(
    () => manifests.find((m) => m.id === selectedTpnId) || manifests[0],
    [manifests, selectedTpnId]
  );

  // Reconciliation state for active TPN lines
  const [reconciliationLines, setReconciliationLines] = useState(() => {
    if (!activeTpn) return [];
    return activeTpn.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      code: item.code,
      expectedQty: item.qty,
      receivedQty: item.qty,
      damagedQty: 0,
      missingQty: 0,
      tp: item.tp,
      verifiedSerials: [...(item.serials || [])],
      flaggedDiscrepancy: false,
    }));
  });

  // When selected TPN changes, reload lines
  const handleSelectTpn = (tpnId) => {
    setSelectedTpnId(tpnId);
    const tpn = manifests.find((m) => m.id === tpnId);
    if (tpn) {
      setReconciliationLines(
        tpn.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          code: item.code,
          expectedQty: item.qty,
          receivedQty: item.qty,
          damagedQty: 0,
          missingQty: 0,
          tp: item.tp,
          verifiedSerials: [...(item.serials || [])],
          flaggedDiscrepancy: false,
        }))
      );
    }
  };

  // Adjust quantities
  const updateLineQty = (productId, field, val) => {
    const num = Math.max(0, Number(val) || 0);
    setReconciliationLines((prev) =>
      prev.map((line) => {
        if (line.productId !== productId) return line;
        const updated = { ...line, [field]: num };
        const missing = Math.max(
          0,
          updated.expectedQty - (updated.receivedQty + updated.damagedQty)
        );
        updated.missingQty = missing;
        updated.flaggedDiscrepancy = updated.damagedQty > 0 || missing > 0;
        return updated;
      })
    );
  };

  // Fast Serial Scan
  const handleScanSerial = (e) => {
    e.preventDefault();
    if (!serialScanInput.trim()) return;
    const serial = serialScanInput.trim();

    let found = false;
    setReconciliationLines((prev) =>
      prev.map((line) => {
        if (line.verifiedSerials.includes(serial)) {
          found = true;
          return line;
        }
        return line;
      })
    );

    if (found) {
      setSuccessMsg(`Serial verified and matched: ${serial}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } else {
      setErrorMsg(`Serial ${serial} not listed in this TPN manifest!`);
      setTimeout(() => setErrorMsg(""), 3500);
    }
    setSerialScanInput("");
  };

  // Finalize BRN receipt
  const handleCompleteBRN = (e) => {
    e.preventDefault();
    if (!activeTpn) return;

    const hasDiscrepancy = reconciliationLines.some((l) => l.flaggedDiscrepancy);
    const newBrn = {
      id: `BRN-${Math.floor(1000 + Math.random() * 9000)}`,
      tpnId: activeTpn.id,
      date: new Date().toISOString().slice(0, 10),
      destinationBranch: activeTpn.warehouseTo,
      verifiedBy: "Store Manager",
      status: hasDiscrepancy ? "RECEIVED_WITH_DISCREPANCY" : "RECEIVED_EXACT",
      scannedLines: reconciliationLines.map((l) => ({
        productId: l.productId,
        productName: l.name,
        expectedQty: l.expectedQty,
        receivedQty: l.receivedQty,
        damagedQty: l.damagedQty,
        verifiedSerials: l.verifiedSerials,
        discrepancy: l.flaggedDiscrepancy,
      })),
      note: hasDiscrepancy
        ? "Transit discrepancies recorded. Defective items isolated to DAMAGED_QUARANTINE."
        : "Complete physical verification. Serials successfully unlocked and moved to IN_STOCK.",
    };

    setBrnHistory([newBrn, ...brnHistory]);
    setManifests((prev) =>
      prev.map((m) => (m.id === activeTpn.id ? { ...m, status: "RECEIVED" } : m))
    );

    setSuccessMsg(`Branch Receive Note ${newBrn.id} recorded! Active branch stock updated.`);
    setTimeout(() => setSuccessMsg(""), 4500);
    setActiveTab("history");
  };

  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return brnHistory.slice(start, start + pageSize);
  }, [brnHistory, currentPage, pageSize]);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto select-none">
      {/* ━━ Header & Mode Switcher ━━ */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <PackageCheck size={24} className="text-[#64BD0B]" />
            BRN — Branch Receive Note
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Phase 3 Inbound Physical Reconciliation against Outward TPN Manifests
          </p>
        </div>

        {/* Tab Toggle (Matching Website Style) */}
        <div className="flex items-center gap-1.5 p-1 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("inbound")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "inbound"
                ? "bg-[#64BD0B] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PackageCheck size={14} className="inline mr-1" />
            Inbound Intake
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "history"
                ? "bg-[#64BD0B] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <List size={14} className="inline mr-1" />
            BRN Receipts ({brnHistory.length})
          </button>
        </div>
      </div>

      {/* ━━ Stat Cards ━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="In-Transit TPN Shipments"
          value={manifests.filter((m) => m.status === "IN_TRANSIT").length}
          trend={{ value: "Pending Physical Check", positive: false }}
          icon={Truck}
          accent="amber"
        />
        <StatCard
          label="Total Handsets Received"
          value="48 Pcs"
          trend={{ value: "Added to Branch Stock", positive: true }}
          icon={Boxes}
          accent="emerald"
        />
        <StatCard
          label="Transit Damage Claims"
          value="1 Unit"
          trend={{ value: "Quarantined for RTV", positive: false }}
          icon={ShieldAlert}
          accent="red"
        />
        <StatCard
          label="Consignment Valuation"
          value={money(activeTpn?.totalValue || 164000)}
          trend={{ value: "Destination Ledger", positive: true }}
          icon={TrendingUp}
          accent="blue"
        />
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm animate-in fade-in">
          <AlertTriangle size={16} className="text-rose-600" />
          <span className="font-semibold">{errorMsg}</span>
        </div>
      )}

      {activeTab === "inbound" ? (
        <div className="space-y-6">
          {/* Top Panel: Pending Inbound TPN Selector & Manifest Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: TPN Manifest Picker */}
            <div className="lg:col-span-4 bg-white/80 backdrop-blur-xl p-5 rounded-2xl border border-white/90 shadow-sm space-y-3.5">
              <h3 className="text-slate-900 text-[14px] font-bold flex items-center gap-2">
                <Truck size={16} className="text-[#3B7506]" />
                Select In-Transit Manifest (TPN)
              </h3>
              <p className="text-[12px] text-slate-500">
                Choose the transfer dispatch note to verify against physical delivery.
              </p>

              <div className="space-y-2.5">
                {manifests.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => handleSelectTpn(m.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedTpnId === m.id
                        ? "bg-[#64BD0B]/10 border-[#64BD0B] text-slate-900"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[13px] text-[#3B7506] font-mono">
                        {m.id}
                      </span>
                      <Badge
                        tone={m.status === "RECEIVED" ? "good" : "warn"}
                        dot
                      >
                        {m.status}
                      </Badge>
                    </div>
                    <div className="text-[11.5px] text-slate-600 mt-1">
                      From: <strong className="text-slate-800">{m.warehouseFrom}</strong>
                    </div>
                    <div className="text-[11.5px] text-slate-600">
                      To: <strong className="text-slate-800">{m.warehouseTo}</strong>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span>{m.items.length} product(s)</span>
                      <span className="font-mono font-bold text-slate-900">{money(m.totalValue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Active Manifest Summary & Barcode Scanner */}
            <div className="lg:col-span-8 bg-white/80 backdrop-blur-xl p-5 rounded-2xl border border-white/90 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#3B7506]">
                    Active Manifest Inward Check
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    {activeTpn?.id || "No TPN Selected"}
                    <Badge tone="warn" dot>{activeTpn?.status || "PENDING"}</Badge>
                  </h2>
                </div>
                <div className="text-right text-[12px] text-slate-600">
                  <div>Driver: <strong className="text-slate-800">{activeTpn?.driverName || "N/A"}</strong></div>
                  <div>Vehicle: <strong className="text-slate-800">{activeTpn?.vehicleNo || "N/A"}</strong></div>
                </div>
              </div>

              {/* Fast Barcode Scanner Input */}
              <form onSubmit={handleScanSerial} className="flex gap-2">
                <div className="relative flex-1">
                  <ScanBarcode
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={serialScanInput}
                    onChange={(e) => setSerialScanInput(e.target.value)}
                    placeholder="Scan IMEI or Serial barcode from physical carton..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold rounded-xl text-[12.5px] transition-all shadow-md shadow-[#64BD0B]/20 flex items-center gap-1.5"
                >
                  <Search size={14} /> Verify Serial
                </button>
              </form>

              {/* 3-Phase Rule Note */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-[12px] text-amber-800">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-600" />
                <span>
                  <strong>Strict Transfer Protocol:</strong> Accepted items unlock from <code>IN_TRANSIT</code> to <code>IN_STOCK</code>. Damaged units route directly to <code>DAMAGED_QUARANTINE</code>. Missing units trigger a <code>TRANSIT_LOSS</code> incident log.
                </span>
              </div>
            </div>
          </div>

          {/* Reconciliation Table */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-[13.5px]">
                Line Items Reconciliation
              </h3>
              <span className="text-[12px] text-slate-500">
                Total Products: <strong className="text-slate-900">{reconciliationLines.length}</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px]">
                <thead>
                  <tr className="bg-slate-50/70 text-slate-500 uppercase text-[11px] tracking-wider border-b border-slate-100 font-semibold">
                    <th className="py-3 px-4">Product Details</th>
                    <th className="py-3 px-3 text-center">Expected (TPN)</th>
                    <th className="py-3 px-3 text-center">Received (Good)</th>
                    <th className="py-3 px-3 text-center">Damaged</th>
                    <th className="py-3 px-3 text-center">Missing</th>
                    <th className="py-3 px-4">Serial / IMEI Verification</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {reconciliationLines.map((line) => (
                    <tr
                      key={line.productId}
                      className={
                        line.flaggedDiscrepancy
                          ? "bg-amber-50/40 hover:bg-amber-50"
                          : "hover:bg-slate-50/80 transition-colors"
                      }
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{line.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          SKU: {line.code} · TP: {money(line.tp)}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-slate-800">
                        {line.expectedQty}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={line.expectedQty}
                          value={line.receivedQty}
                          onChange={(e) =>
                            updateLineQty(line.productId, "receivedQty", e.target.value)
                          }
                          className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-center font-bold text-[#3B7506] focus:outline-none focus:border-[#64BD0B]"
                        />
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={line.expectedQty}
                          value={line.damagedQty}
                          onChange={(e) =>
                            updateLineQty(line.productId, "damagedQty", e.target.value)
                          }
                          className="w-16 bg-white border border-rose-300 rounded-lg px-2 py-1 text-center font-bold text-rose-600 focus:outline-none focus:border-rose-500"
                        />
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-amber-600">
                        {line.missingQty}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {line.verifiedSerials.length > 0 ? (
                            line.verifiedSerials.map((s) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-800 rounded font-mono text-[11px]"
                              >
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic text-[11.5px]">
                              Non-serialized item
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {line.flaggedDiscrepancy ? (
                          <Badge tone="warn" dot>Discrepancy</Badge>
                        ) : (
                          <Badge tone="good" dot>Exact Match</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="text-[12px] text-slate-600">
                Destination: <strong className="text-slate-900">{activeTpn?.warehouseTo}</strong>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectTpn(selectedTpnId)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-[12.5px] font-semibold transition-colors bg-white shadow-sm"
                >
                  Reset Verification
                </button>
                <button
                  onClick={handleCompleteBRN}
                  disabled={!activeTpn || activeTpn.status === "RECEIVED"}
                  className="px-6 py-2.5 bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold rounded-xl text-[13px] transition-all shadow-md shadow-[#64BD0B]/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  Complete BRN & Accept Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-sm overflow-hidden">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-slate-50/70 text-slate-500 uppercase text-[11px] tracking-wider border-b border-slate-100 font-semibold">
                  <th className="py-3.5 px-4">BRN Number</th>
                  <th className="py-3.5 px-4">TPN Ref</th>
                  <th className="py-3.5 px-3">Date</th>
                  <th className="py-3.5 px-4">Receiving Branch</th>
                  <th className="py-3.5 px-4">Verified By</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {paginatedHistory.map((brn) => (
                  <tr key={brn.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-[#3B7506]">
                      {brn.id}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900 font-mono">
                      {brn.tpnId}
                    </td>
                    <td className="py-4 px-3 text-slate-600 font-mono text-[12px]">{brn.date}</td>
                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {brn.destinationBranch}
                    </td>
                    <td className="py-4 px-4 text-slate-700">
                      {brn.verifiedBy}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <Badge
                        tone={brn.status === "RECEIVED_EXACT" ? "good" : "warn"}
                        dot
                      >
                        {brn.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-[12px] text-slate-500">
                      {brn.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Cursor Pagination for BRN History */}
            <div className="p-3 bg-white border-t border-slate-100">
              <CursorPagination
                totalItems={brnHistory.length}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
