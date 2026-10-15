"use client";

import { Search, Bell, MapPin, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setBranch } from "@/store/slices/uiSlice";
import Link from "next/link";

export default function Topbar() {
  const dispatch = useDispatch();
  const { activeBranch, branches } = useSelector((s) => s.ui);

  return (
    <header className="h-16 bg-white/75 backdrop-blur-xl border-b border-white/80 shadow-[0_4px_24px_-4px_rgba(100,189,11,0.06)] flex items-center gap-4 px-4 md:px-6 sticky top-0 z-30">
      {/* ━━ Branch Selector ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="hidden md:flex items-center gap-2 text-slate-700 text-sm">
        <div className="relative">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-[#64BD0B]/20 hover:border-[#64BD0B]/40 rounded-xl px-3 py-1.5 shadow-sm transition-all">
            <MapPin size={15} className="text-[#64BD0B] shrink-0" />
            <select
              value={activeBranch}
              onChange={(e) => dispatch(setBranch(e.target.value))}
              className="appearance-none bg-transparent pr-6 text-slate-800 text-[13px] font-semibold focus-visible:outline-none cursor-pointer"
            >
              {branches.map((b) => (
                <option key={b} value={b} className="text-slate-800 bg-white">
                  {b} Branch
                </option>
              ))}
            </select>
            <ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* ━━ Search Bar ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex-1 max-w-md relative">
        <div className="relative flex items-center bg-white/70 backdrop-blur-md border border-slate-200/80 hover:border-[#64BD0B]/40 focus-within:border-[#64BD0B] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(100,189,11,0.15)] rounded-xl transition-all">
          <Search size={15} className="absolute left-3.5 text-[#64BD0B]/80 pointer-events-none" />
          <input
            placeholder="Search product, IMEI, invoice, customer…"
            className="w-full bg-transparent pl-10 pr-4 py-2 text-[13px] text-slate-800 placeholder:text-slate-400 focus-visible:outline-none"
          />
        </div>
      </div>

      {/* ━━ Actions & User ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/pos"
          className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-[#64BD0B] to-[#529E08] hover:from-[#5CB209] hover:to-[#488E06] text-white text-[13px] font-bold px-4 py-2 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.35)] hover:shadow-[0_6px_20px_rgba(100,189,11,0.45)] hover:scale-[1.02] transition-all"
        >
          <span>+ New Sale</span>
        </Link>
        <button className="relative w-9 h-9 rounded-xl bg-white/75 backdrop-blur-md border border-slate-200/70 hover:border-[#64BD0B]/40 hover:bg-white flex items-center justify-center text-slate-600 hover:text-[#3B7506] shadow-sm transition-all">
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#64BD0B] to-[#7ADB1F] text-white flex items-center justify-center text-[12.5px] font-bold font-display shadow-[0_4px_12px_rgba(100,189,11,0.35)] ring-2 ring-white/90">
          SM
        </div>
      </div>
    </header>
  );
}
