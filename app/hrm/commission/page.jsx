"use client";

import { useState } from "react";
import {
  Award,
  DollarSign,
  TrendingUp,
  Target,
  UserCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const INITIAL_TARGETS = [
  {
    id: 1,
    empId: "EMP-001",
    name: "Tanvir Ahmed",
    branch: "Dhanmondi Flagship Outlet",
    target: 1500000,
    achieved: 1850000,
    rate: "2.0%",
    commission: 37000,
    bonus: 5000,
    totalPayout: 42000,
    payoutStatus: "Approved",
  },
  {
    id: 2,
    empId: "EMP-002",
    name: "Sadia Sultana",
    branch: "Gulshan Premium Store",
    target: 1200000,
    achieved: 1140000,
    rate: "1.0%",
    commission: 11400,
    bonus: 0,
    totalPayout: 11400,
    payoutStatus: "Pending Approval",
  },
  {
    id: 3,
    empId: "EMP-003",
    name: "Mahmudul Hasan",
    branch: "Dhanmondi Flagship Outlet",
    target: 3000000,
    achieved: 3450000,
    rate: "1.5%",
    commission: 51750,
    bonus: 10000,
    totalPayout: 61750,
    payoutStatus: "Approved",
  },
  {
    id: 4,
    empId: "EMP-005",
    name: "Nusrat Jahan",
    branch: "Chittagong Regional Depot",
    target: 1000000,
    achieved: 820000,
    rate: "1.0%",
    commission: 8200,
    bonus: 0,
    totalPayout: 8200,
    payoutStatus: "Pending Approval",
  },
];

export default function CommissionPage() {
  const [data, setData] = useState(INITIAL_TARGETS);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState(null);

  const filteredData = data.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.empId.toLowerCase().includes(search.toLowerCase())
  );

  const totalAchievedSales = data.reduce((acc, d) => acc + d.achieved, 0);
  const totalCommission = data.reduce((acc, d) => acc + d.totalPayout, 0);

  const handleApprove = (id) => {
    setData((prev) =>
      prev.map((d) => (d.id === id ? { ...d, payoutStatus: "Approved" } : d))
    );
    setNotice("Commission payout approved and routed to payroll processing!");
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* ━━ Approval Action ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-2">
        <button
          onClick={() => alert("All pending commissions approved.")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-sm shadow-[0_4px_14px_rgba(100,189,11,0.35)] transition-all"
        >
          <CheckCircle2 size={16} />
          <span>Approve All Payouts</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-[#64BD0B]/15 border border-[#64BD0B]/30 text-[#3B7506] font-bold text-sm flex items-center gap-2">
          <CheckCircle2 size={18} />
          {notice}
        </div>
      )}

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Staff Driven Sales"
          value={`৳${(totalAchievedSales / 100000).toFixed(1)}L`}
          trend={{ value: "+18% target exceeding", positive: true }}
          icon={TrendingUp}
          accent="emerald"
        />
        <StatCard
          label="Total Accrued Payout"
          value={`৳${totalCommission.toLocaleString()}`}
          trend={{ value: "Including performance bonuses", positive: true }}
          icon={DollarSign}
          accent="blue"
        />
        <StatCard
          label="Top Sales Achiever"
          value="Mahmudul Hasan"
          trend={{ value: "৳34.5L gross revenue (115%)", positive: true }}
          icon={Award}
          accent="amber"
        />
        <StatCard
          label="Team Target Success"
          value="108.2%"
          trend={{ value: "Exceeded monthly quota", positive: true }}
          icon={Target}
          accent="purple"
        />
      </div>

      {/* ━━ Commission Table ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search salesperson..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white/70 text-sm focus:border-[#64BD0B] outline-none"
            />
          </div>
          <span className="text-xs text-slate-400">Current Month Target Period: Oct 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Salesperson</th>
                <th className="py-3.5 px-4 text-right">Target (৳)</th>
                <th className="py-3.5 px-4 text-right">Achieved (৳)</th>
                <th className="py-3.5 px-4 text-center w-36">Target %</th>
                <th className="py-3.5 px-4 text-center">Comm. Rate</th>
                <th className="py-3.5 px-4 text-right">Bonus Incentive</th>
                <th className="py-3.5 px-4 text-right">Net Payout (৳)</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((d) => {
                const pct = Math.round((d.achieved / d.target) * 100);
                return (
                  <tr key={d.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800">{d.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{d.empId} • {d.branch}</p>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-600 text-xs">
                      ৳{d.target.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                      ৳{d.achieved.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="w-28 mx-auto">
                        <div className="flex justify-between text-[10px] font-bold mb-0.5">
                          <span className={pct >= 100 ? "text-[#3B7506]" : "text-slate-600"}>{pct}%</span>
                          <span className="text-slate-400">{pct >= 100 ? "Goal Met" : "In Progress"}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct >= 100 ? "bg-[#64BD0B]" : "bg-amber-500"}`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#3B7506] text-xs">
                      {d.rate}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs text-emerald-700 font-bold">
                      {d.bonus > 0 ? `+৳${d.bonus.toLocaleString()}` : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 text-sm">
                      ৳{d.totalPayout.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          d.payoutStatus === "Approved"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {d.payoutStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {d.payoutStatus !== "Approved" && (
                        <button
                          type="button"
                          onClick={() => handleApprove(d.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-xs shadow-sm transition-all"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
