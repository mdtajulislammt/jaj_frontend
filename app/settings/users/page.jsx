"use client";

import { useState } from "react";
import { Plus, Users, ShieldCheck, Mail, Phone, Lock, Trash2, X, CheckCircle2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";

const INITIAL_USERS = [
  { id: "u-1", name: "Md Tajul Islam", email: "tajul@monapos.com", phone: "01851004545", role: "Super Admin", branch: "All Branches", status: "active" },
  { id: "u-2", name: "Shafiul Alam", email: "shafiul@monapos.com", phone: "01711223399", role: "POS Cashier", branch: "Dhanmondi Branch", status: "active" },
  { id: "u-3", name: "Nusrat Jahan", email: "nusrat@monapos.com", phone: "01998877665", role: "Store Manager", branch: "Dhanmondi Branch", status: "active" },
  { id: "u-4", name: "Imtiaz Hossain", email: "imtiaz@monapos.com", phone: "01622334455", role: "Warehouse Officer", branch: "Central Warehouse Hub", status: "active" },
  { id: "u-5", name: "Karim Uddin", email: "karim@monapos.com", phone: "01511224488", role: "POS Cashier", branch: "Uttara Superstore", status: "active" },
];

export default function UsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "POS Cashier", branch: "Dhanmondi Branch" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    const newUser = {
      id: `u-${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone || "017XXXXXXXX",
      role: form.role,
      branch: form.branch,
      status: "active",
    };
    setUsers([newUser, ...users]);
    setForm({ name: "", email: "", phone: "", role: "POS Cashier", branch: "Dhanmondi Branch" });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Access Control"
        title="User &amp; Staff Management"
        description="Configure role-based access permissions, cashier registers, and manager authorizations."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2.5 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.35)] transition-all hover:scale-[1.02]"
          >
            <Plus size={16} /> Add New User
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Staff Users" value={users.length} icon={Users} tone="primary" />
        <StatCard label="Store Managers" value="2" icon={ShieldCheck} trend="Branch management" tone="good" />
        <StatCard label="Active Cashiers" value="2" icon={Lock} trend="Counter registers" tone="warn" />
        <StatCard label="Security Status" value="Healthy" icon={CheckCircle2} trend="2FA enabled" tone="primary" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-[#64BD0B]/5 to-transparent flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-[16px] text-slate-900">Registered System Users</h2>
            <p className="text-[12px] text-slate-500 mt-0.5">Role permissions and location assignment</p>
          </div>
          <span className="text-[12px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-3 py-1 rounded-full border border-[#64BD0B]/20">
            {users.length} Staff Accounts
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70 backdrop-blur-sm border-b border-slate-100">
                <th className="px-6 py-3.5 font-semibold">User Profile</th>
                <th className="px-6 py-3.5 font-semibold">Contact Info</th>
                <th className="px-6 py-3.5 font-semibold">Role</th>
                <th className="px-6 py-3.5 font-semibold">Assigned Branch</th>
                <th className="px-6 py-3.5 font-semibold text-center">Status</th>
                <th className="px-6 py-3.5 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 text-[14px]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#64BD0B] to-[#7ADB1F] text-white flex items-center justify-center font-bold text-[12px] shadow-sm">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p>{u.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-[12px]">
                    <p className="font-medium text-slate-800">{u.email}</p>
                    <p className="text-slate-400">{u.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2.5 py-1 rounded-md text-[12px] border border-[#64BD0B]/20">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">
                    {u.branch}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge tone="good" dot>Active</Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setUsers(users.filter((x) => x.id !== u.id))}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
            >
              <X size={16} />
            </button>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Add Staff Account</h3>
            <p className="text-[12px] text-slate-500 mb-4">Create access credentials for an employee.</p>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abdullah Al Mamun"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. mamun@monapos.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Role Permission</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none"
                  >
                    <option value="POS Cashier">POS Cashier</option>
                    <option value="Store Manager">Store Manager</option>
                    <option value="Warehouse Officer">Warehouse Officer</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 mb-1">Assigned Branch</label>
                  <select
                    value={form.branch}
                    onChange={(e) => setForm({ ...form, branch: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 focus:outline-none"
                  >
                    <option value="Dhanmondi Branch">Dhanmondi Branch</option>
                    <option value="Uttara Superstore">Uttara Superstore</option>
                    <option value="Mirpur Branch">Mirpur Branch</option>
                    <option value="Central Warehouse Hub">Central Warehouse Hub</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[13px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold shadow-md text-[13px]"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
