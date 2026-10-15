"use client";

import { useState } from "react";
import {
  UserCog,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Search,
  Fingerprint,
  UserCheck,
  Building,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const SHIFTS = [
  { id: "S1", name: "Morning Retail Shift", time: "09:00 AM - 05:00 PM", activeCount: 6 },
  { id: "S2", name: "Evening Peak Shift", time: "01:00 PM - 09:30 PM", activeCount: 8 },
  { id: "S3", name: "Warehouse Restock Shift", time: "08:00 AM - 05:00 PM", activeCount: 4 },
];

const INITIAL_LOGS = [
  {
    id: 1,
    empId: "EMP-001",
    name: "Tanvir Ahmed",
    shift: "Morning Retail Shift",
    clockIn: "08:52 AM",
    clockOut: "— (Active)",
    hours: "5h 45m",
    method: "Biometric Fingerprint",
    status: "On Time",
  },
  {
    id: 2,
    empId: "EMP-002",
    name: "Sadia Sultana",
    shift: "Morning Retail Shift",
    clockIn: "09:18 AM",
    clockOut: "— (Active)",
    hours: "5h 20m",
    method: "RFID Smart Card",
    status: "Late (18m)",
  },
  {
    id: 3,
    empId: "EMP-003",
    name: "Mahmudul Hasan",
    shift: "Morning Retail Shift",
    clockIn: "08:45 AM",
    clockOut: "— (Active)",
    hours: "6h 00m",
    method: "Face Recognition",
    status: "On Time",
  },
  {
    id: 4,
    empId: "EMP-004",
    name: "Kamrul Islam",
    shift: "Warehouse Restock Shift",
    clockIn: "07:58 AM",
    clockOut: "— (Active)",
    hours: "6h 40m",
    method: "Biometric Fingerprint",
    status: "On Time",
  },
  {
    id: 5,
    empId: "EMP-005",
    name: "Nusrat Jahan",
    shift: "Morning Retail Shift",
    clockIn: "—",
    clockOut: "—",
    hours: "0h",
    method: "Leave Application #41",
    status: "Approved Leave",
  },
];

export default function AttendancePage() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [search, setSearch] = useState("");
  const [filterShift, setFilterShift] = useState("All");

  const filteredLogs = logs.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.empId.toLowerCase().includes(search.toLowerCase());
    const matchShift = filterShift === "All" || l.shift === filterShift;
    return matchSearch && matchShift;
  });

  const presentCount = logs.filter((l) => l.clockIn !== "—").length;
  const lateCount = logs.filter((l) => l.status.includes("Late")).length;

  return (
    <div className="space-y-6">
      {/* ━━ Header ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#64BD0B]/10 text-[#3B7506]">
              <UserCog size={22} className="text-[#3B7506]" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Attendance &amp; Shifts Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time biometric punch logs, shift allocations, late arrival tracking, and daily cashier check-in status.
          </p>
        </div>

        <button
          onClick={() => alert("Biometric terminals synced: All 4 outlets connected.")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-sm shadow-[0_4px_14px_rgba(100,189,11,0.35)] transition-all"
        >
          <Fingerprint size={16} />
          <span>Sync Biometric Machines</span>
        </button>
      </div>

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Present Today"
          value={`${presentCount} Staff`}
          trend={{ value: "80% attendance rate", positive: true }}
          icon={UserCheck}
          accent="emerald"
        />
        <StatCard
          label="Late Clock-Ins"
          value={`${lateCount} Cashier`}
          trend={{ value: "Over 15 mins grace", positive: false }}
          icon={AlertTriangle}
          accent="amber"
        />
        <StatCard
          label="On Scheduled Leave"
          value="1 Person"
          trend={{ value: "Nusrat Jahan (Medical)", positive: true }}
          icon={Calendar}
          accent="purple"
        />
        <StatCard
          label="Active Shifts Now"
          value="2 Shifts Running"
          trend={{ value: "Morning & Warehouse", positive: true }}
          icon={Clock}
          accent="blue"
        />
      </div>

      {/* ━━ Active Shifts Overview ━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SHIFTS.map((s) => (
          <div
            key={s.id}
            className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-extrabold text-sm text-slate-800">{s.name}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Clock size={13} className="text-[#3B7506]" />
                <span>{s.time}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-[#64BD0B]/10 text-[#3B7506] font-extrabold text-xs">
              {s.activeCount} Staff
            </span>
          </div>
        ))}
      </div>

      {/* ━━ Daily Attendance Punch Log ━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search staff name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white/70 text-sm focus:border-[#64BD0B] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none"
            >
              <option value="All">All Shifts</option>
              <option value="Morning Retail Shift">Morning Retail Shift</option>
              <option value="Evening Peak Shift">Evening Peak Shift</option>
              <option value="Warehouse Restock Shift">Warehouse Restock Shift</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Staff Details</th>
                <th className="py-3.5 px-4">Assigned Shift</th>
                <th className="py-3.5 px-4">Clock-In Time</th>
                <th className="py-3.5 px-4">Clock-Out Time</th>
                <th className="py-3.5 px-4 text-center">Worked Hours</th>
                <th className="py-3.5 px-4">Verification Method</th>
                <th className="py-3.5 px-4 text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((l) => (
                <tr key={l.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{l.name}</p>
                    <p className="text-[11px] font-mono text-slate-400">{l.empId}</p>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                    {l.shift}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-xs">
                    {l.clockIn}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">
                    {l.clockOut}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-slate-800 text-xs">
                    {l.hours}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {l.method}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        l.status === "On Time"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : l.status.includes("Late")
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-purple-100 text-purple-800 border border-purple-200"
                      }`}
                    >
                      {l.status}
                    </span>
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
