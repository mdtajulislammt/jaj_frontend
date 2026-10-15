"use client";

import { useState } from "react";
import { User, Mail, Phone, ShieldCheck, KeyRound, Building, Check, Save } from "lucide-react";
import PageHeader from "@/components/PageHeader";

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState({
    name: "Md Tajul Islam",
    email: "tajul@monapos.com",
    phone: "01851004545",
    role: "System Super Administrator",
    branch: "Dhanmondi Flagship Branch",
  });
  const [password, setPassword] = useState({ current: "", newPass: "", confirm: "" });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        eyebrow="Account Settings"
        title="Admin Profile & Security"
        description="Manage your identity credentials, branch authorization, and access passwords."
      />

      {saved && (
        <div className="bg-[#64BD0B]/15 border border-[#64BD0B]/30 text-[#2E6004] px-4 py-3 rounded-xl flex items-center gap-2 font-semibold text-[13px] animate-in fade-in">
          <Check size={18} /> Profile details saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] p-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#64BD0B] to-[#7ADB1F] text-white flex items-center justify-center font-bold font-display text-2xl shadow-lg ring-4 ring-white mx-auto mb-3">
            TI
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900">{profile.name}</h3>
          <p className="text-[12px] font-semibold text-[#3B7506] bg-[#64BD0B]/10 px-3 py-1 rounded-full inline-block mt-1">
            {profile.role}
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 text-[12px] text-slate-500 space-y-1 text-left">
            <p className="flex items-center gap-2"><Mail size={13} className="text-[#64BD0B]" /> {profile.email}</p>
            <p className="flex items-center gap-2"><Phone size={13} className="text-[#64BD0B]" /> {profile.phone}</p>
            <p className="flex items-center gap-2"><Building size={13} className="text-[#64BD0B]" /> {profile.branch}</p>
          </div>
        </div>

        {/* Update Form */}
        <div className="md:col-span-2 space-y-5">
          <form onSubmit={handleSave} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] p-6 space-y-4">
            <h3 className="font-display font-bold text-[16px] text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <User size={17} className="text-[#64BD0B]" /> Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Assigned Branch</label>
                <input
                  type="text"
                  disabled
                  value={profile.branch}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all text-[13px]"
              >
                <Save size={15} /> Save Profile Changes
              </button>
            </div>
          </form>

          {/* Change Password Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-[0_10px_35px_rgba(100,189,11,0.06)] p-6 space-y-4">
            <h3 className="font-display font-bold text-[16px] text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <KeyRound size={17} className="text-[#64BD0B]" /> Security &amp; Password
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password.newPass}
                  onChange={(e) => setPassword({ ...password, newPass: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password.confirm}
                  onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => alert("Password updated successfully!")}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-[13px] transition-all"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
