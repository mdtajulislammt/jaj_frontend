"use client";

import { useState } from "react";
import { Database, Download, Upload, ShieldCheck, Clock, HardDrive, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";

const INITIAL_BACKUPS = [
  { id: "BKP-20261015-0200", date: "2026-10-15 02:00 AM", size: "48.2 MB", type: "Automated Daily", tables: "Invoices, Serials, Customers, Catalog", status: "verified" },
  { id: "BKP-20261014-0200", date: "2026-10-14 02:00 AM", size: "47.8 MB", type: "Automated Daily", tables: "All 18 Data Tables", status: "verified" },
  { id: "BKP-20261013-1745", date: "2026-10-13 05:45 PM", size: "47.1 MB", type: "Pre-Update Manual Dump", tables: "Complete POS Snapshot", status: "verified" },
  { id: "BKP-20261007-0200", date: "2026-10-07 02:00 AM", size: "45.0 MB", type: "Weekly Cold Storage", tables: "Archive Database", status: "verified" },
];

export default function BackupPage() {
  const [backups, setBackups] = useState(INITIAL_BACKUPS);
  const [downloading, setDownloading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [msg, setMsg] = useState("");

  const handleCreateBackup = () => {
    setDownloading(true);
    setTimeout(() => {
      const newBkp = {
        id: `BKP-${Date.now()}`,
        date: "Just now",
        size: "48.6 MB",
        type: "On-demand Instant Dump",
        tables: "All 18 Data Tables",
        status: "verified",
      };
      setBackups([newBkp, ...backups]);
      setDownloading(false);
      setMsg("New encrypted backup snapshot created and ready for download!");
      setTimeout(() => setMsg(""), 4000);
    }, 1500);
  };

  const handleDownloadFile = (id) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ backupId: id, timestamp: new Date().toISOString(), system: "Mona POS" }));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Data Protection"
        title="Backup &amp; Disaster Recovery"
        description="Automated database replication, local snapshot downloads, and system restoration checkpoints."
        action={
          <button
            onClick={handleCreateBackup}
            disabled={downloading}
            className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.35)] transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            <RefreshCw size={15} className={downloading ? "animate-spin" : ""} />
            {downloading ? "Generating Snapshot…" : "Create Backup Now"}
          </button>
        }
      />

      {msg && (
        <div className="bg-[#64BD0B]/15 border border-[#64BD0B]/30 text-[#2C6004] px-4 py-3 rounded-xl flex items-center gap-2 font-semibold text-[13px] animate-in fade-in">
          <CheckCircle2 size={17} /> {msg}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Available Restore Points" value={backups.length} icon={Database} tone="primary" />
        <StatCard label="Auto-Backup Schedule" value="Daily 02:00 AM" icon={Clock} trend="Cloud synced" trendUp tone="good" />
        <StatCard label="Backup Storage Usage" value="188.1 MB" icon={HardDrive} trend="Cloud tier limit: 50GB" tone="warn" />
        <StatCard label="Data Integrity" value="100% OK" icon={ShieldCheck} trend="SHA-256 Checksum" tone="primary" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-[#64BD0B]/5 to-transparent flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-[16px] text-slate-900">Database Snapshots &amp; Archives</h2>
            <p className="text-[12px] text-slate-500 mt-0.5">Point-in-time recovery archives with SHA-256 verification</p>
          </div>
          <span className="text-[12px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-3 py-1 rounded-full border border-[#64BD0B]/20">
            {backups.length} Snapshots
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">Snapshot Ref</th>
                <th className="px-6 py-3.5 font-semibold">Timestamp</th>
                <th className="px-6 py-3.5 font-semibold">Type</th>
                <th className="px-6 py-3.5 font-semibold">Payload Content</th>
                <th className="px-6 py-3.5 font-semibold text-right">Archive Size</th>
                <th className="px-6 py-3.5 font-semibold text-center">Integrity</th>
                <th className="px-6 py-3.5 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {backups.map((b) => (
                <tr key={b.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">
                    {b.id}
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-[12px]">
                    {b.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-[12px]">
                      {b.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-[12px]">
                    {b.tables}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                    {b.size}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge tone="good" dot>Verified</Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDownloadFile(b.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold bg-[#64BD0B]/10 text-[#3B7506] hover:bg-[#64BD0B] hover:text-white transition-all shadow-sm"
                    >
                      <Download size={13} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
