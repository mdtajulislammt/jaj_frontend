"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Building,
  Shield,
  DollarSign,
  UserCheck,
  Award,
  Trash2,
  Edit2,
  Calendar,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const INITIAL_STAFF = [
  {
    id: "EMP-001",
    name: "Tanvir Ahmed",
    role: "Senior Cashier & Shift Lead",
    branch: "Dhanmondi Flagship Outlet",
    phone: "01711-889900",
    email: "tanvir.pos@electro.com",
    joinedDate: "12 Jan 2024",
    salary: 28000,
    commissionRate: "1.5%",
    status: "Active",
  },
  {
    id: "EMP-002",
    name: "Sadia Sultana",
    role: "Cashier",
    branch: "Gulshan Premium Store",
    phone: "01819-223344",
    email: "sadia.s@electro.com",
    joinedDate: "05 Jun 2024",
    salary: 24000,
    commissionRate: "1.0%",
    status: "Active",
  },
  {
    id: "EMP-003",
    name: "Mahmudul Hasan",
    role: "Store Manager",
    branch: "Dhanmondi Flagship Outlet",
    phone: "01912-556677",
    email: "mahmud.mgr@electro.com",
    joinedDate: "01 Mar 2023",
    salary: 55000,
    commissionRate: "2.0%",
    status: "Active",
  },
  {
    id: "EMP-004",
    name: "Kamrul Islam",
    role: "Warehouse & Inventory Officer",
    branch: "Central Hub Warehouse",
    phone: "01611-334455",
    email: "kamrul.inv@electro.com",
    joinedDate: "15 Sep 2023",
    salary: 32000,
    commissionRate: "—",
    status: "Active",
  },
  {
    id: "EMP-005",
    name: "Nusrat Jahan",
    role: "Sales Associate",
    branch: "Chittagong Regional Depot",
    phone: "01722-114477",
    email: "nusrat.sales@electro.com",
    joinedDate: "01 Aug 2025",
    salary: 22000,
    commissionRate: "1.5%",
    status: "On Leave",
  },
];

export default function StaffPage() {
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "Cashier",
    branch: "Dhanmondi Flagship Outlet",
    phone: "",
    email: "",
    salary: 25000,
    commissionRate: "1.0%",
  });

  const filteredStaff = staffList.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "All" || s.role.includes(filterRole);
    return matchSearch && matchRole;
  });

  const totalPayroll = staffList.reduce((acc, s) => acc + s.salary, 0);

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setStaffList([
      ...staffList,
      {
        id: `EMP-00${staffList.length + 1}`,
        name: form.name,
        role: form.role,
        branch: form.branch,
        phone: form.phone,
        email: form.email || `${form.name.toLowerCase().replace(/\s+/g, ".")}@electro.com`,
        joinedDate: "15 Oct 2026",
        salary: Number(form.salary),
        commissionRate: form.commissionRate,
        status: "Active",
      },
    ]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* ━━ Header ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#64BD0B]/10 text-[#3B7506]">
              <Users size={22} className="text-[#3B7506]" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Employee &amp; Staff Directory
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage store employees, assigned branch outlets, designations, base salaries, and sales commission rates.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-sm shadow-[0_4px_14px_rgba(100,189,11,0.35)] transition-all"
        >
          <Plus size={16} />
          <span>Add New Employee</span>
        </button>
      </div>

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Headcount"
          value={staffList.length.toString()}
          trend={{ value: "4 retail branches", positive: true }}
          icon={Users}
          accent="emerald"
        />
        <StatCard
          label="On Duty Today"
          value="4 Active"
          trend={{ value: "1 staff on leave", positive: true }}
          icon={UserCheck}
          accent="blue"
        />
        <StatCard
          label="Monthly Base Payroll"
          value={`৳${totalPayroll.toLocaleString()}`}
          trend={{ value: "Scheduled on 1st of month", positive: true }}
          icon={DollarSign}
          accent="purple"
        />
        <StatCard
          label="Commission Eligible"
          value="4 Associates"
          trend={{ value: "Target performance track", positive: true }}
          icon={Award}
          accent="amber"
        />
      </div>

      {/* ━━ Search & Filter Bar ━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee name, phone, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white/70 text-sm focus:border-[#64BD0B] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none"
            >
              <option value="All">All Designations</option>
              <option value="Cashier">Cashiers</option>
              <option value="Manager">Store Managers</option>
              <option value="Inventory">Inventory Officers</option>
              <option value="Sales">Sales Associates</option>
            </select>
          </div>
        </div>
      </div>

      {/* ━━ Staff Table ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Staff ID &amp; Name</th>
                <th className="py-3.5 px-4">Designation</th>
                <th className="py-3.5 px-4">Assigned Outlet</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4 text-right">Base Salary</th>
                <th className="py-3.5 px-4 text-center">Commission</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.map((s) => (
                <tr key={s.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#64BD0B]/15 text-[#3B7506] font-bold text-xs flex items-center justify-center">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{s.name}</p>
                        <p className="text-[11px] font-mono text-slate-400">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 text-xs">
                    {s.role}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Building size={13} className="text-slate-400" />
                      <span>{s.branch}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    <p className="font-mono">{s.phone}</p>
                    <p className="text-[11px] text-slate-400">{s.email}</p>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                    ৳{s.salary.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-[#3B7506] text-xs">
                    {s.commissionRate}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        s.status === "Active"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setStaffList(staffList.filter((x) => x.id !== s.id))}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ━━ Modal ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800">Add Staff Member</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Asif Mahmud"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation:</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  >
                    <option>Cashier</option>
                    <option>Senior Cashier & Shift Lead</option>
                    <option>Store Manager</option>
                    <option>Warehouse & Inventory Officer</option>
                    <option>Sales Associate</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Outlet:</label>
                  <select
                    value={form.branch}
                    onChange={(e) => setForm({ ...form, branch: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  >
                    <option>Dhanmondi Flagship Outlet</option>
                    <option>Gulshan Premium Store</option>
                    <option>Central Hub Warehouse</option>
                    <option>Chittagong Regional Depot</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number:</label>
                  <input
                    type="text"
                    placeholder="017XX-XXXXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Salary (৳):</label>
                  <input
                    type="number"
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#64BD0B] text-white font-bold shadow-md"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
