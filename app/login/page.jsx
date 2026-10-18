"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  User,
  Building2,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Eye,
  EyeOff,
  Store,
  Wifi,
} from "lucide-react";
import mockData from "@/data/mockData.json";

export default function LoginPage() {
  const router = useRouter();
  const warehouses = mockData.warehouses || [];

  const [selectedBranch, setSelectedBranch] = useState(
    warehouses[1]?.id || "wh-002"
  );
  const [username, setUsername] = useState("manager@jajpos.com");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Quick Demo Auto-fill Credentials
  const handleQuickRole = (role) => {
    if (role === "manager") {
      setUsername("manager@jajpos.com");
      setPassword("Admin@2026");
      setSelectedBranch("wh-001");
    } else if (role === "cashier") {
      setUsername("cashier.dhanmondi@jajpos.com");
      setPassword("Pos#2026");
      setSelectedBranch("wh-002");
    } else if (role === "auditor") {
      setUsername("auditor.gulshan@jajpos.com");
      setPassword("Audit$2026");
      setSelectedBranch("wh-003");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setLoginSuccess(true);
      setTimeout(() => {
        router.push("/pos");
      }, 700);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 text-slate-800 flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Decorative ambient blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#64BD0B]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#64BD0B] to-[#3B7506] text-white font-black text-2xl shadow-xl shadow-[#64BD0B]/25 mb-1">
            JAJ
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            JAJ Retail POS & ERP
          </h1>
          <p className="text-[13px] text-slate-500 font-medium">
            Enterprise Multi-Branch Point of Sale & Supply Chain System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-2xl border border-white/90 p-6 md:p-8 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] space-y-5">
          {loginSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2 text-[13px] font-semibold animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-600" /> Authenticated! Launching POS Terminal...
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-[13px]">
            {/* Branch / Outlet Selector */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5 flex items-center gap-1.5">
                <Store size={15} className="text-[#3B7506]" />
                Select Branch / Terminal Location
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-[#64BD0B] transition-colors font-medium"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Username / Staff Email */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5 flex items-center gap-1.5">
                <User size={15} className="text-[#3B7506]" />
                Username or Staff Email
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="staff@jajpos.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#64BD0B] transition-colors font-medium"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5 flex items-center gap-1.5">
                <Lock size={15} className="text-[#3B7506]" />
                Terminal Security PIN / Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter PIN or Password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#64BD0B] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-[12px] pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#64BD0B] rounded"
                />
                Remember this terminal
              </label>
              <a href="#" className="text-[#3B7506] hover:underline font-bold">
                Reset PIN?
              </a>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold rounded-xl text-[13.5px] transition-all duration-150 shadow-lg shadow-[#64BD0B]/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Validating credentials...</span>
              ) : (
                <>
                  <span>Sign In & Open Register</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Quick Demo Auto-Fill
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11.5px]">
              <button
                type="button"
                onClick={() => handleQuickRole("manager")}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-bold transition-colors text-center"
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole("cashier")}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-bold transition-colors text-center"
              >
                Cashier
              </button>
              <button
                type="button"
                onClick={() => handleQuickRole("auditor")}
                className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-bold transition-colors text-center"
              >
                Auditor
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11.5px] text-slate-400">
          Strict Serial/IMEI Hardware Ledger · v2.1.0 Enterprise
        </div>
      </div>
    </div>
  );
}
