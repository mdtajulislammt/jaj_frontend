"use client";

import { Search, Bell, MapPin, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setBranch } from "@/store/slices/uiSlice";
import Link from "next/link";

export default function Topbar() {
  const dispatch = useDispatch();
  const { activeBranch, branches } = useSelector((s) => s.ui);

  return (
    <header className="h-16 bg-paper border-b border-line flex items-center gap-4 px-4 md:px-6 sticky top-0 z-30">
      <div className="hidden md:flex items-center gap-2 text-slate text-sm">
        <MapPin size={15} className="text-primary" />
        <div className="relative">
          <select
            value={activeBranch}
            onChange={(e) => dispatch(setBranch(e.target.value))}
            className="appearance-none bg-mist border border-line rounded-lg pl-2.5 pr-7 py-1.5 text-ink text-[13px] font-medium focus-visible:outline-none cursor-pointer"
          >
            {branches.map((b) => (
              <option key={b} value={b}>
                {b} Branch
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-light" />
        </div>
      </div>

      <div className="flex-1 max-w-md relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-light" />
        <input
          placeholder="Search product, IMEI, invoice, customer…"
          className="w-full bg-mist border border-line rounded-lg pl-9 pr-3 py-2 text-[13px] text-ink placeholder:text-slate-light focus-visible:outline-none focus:border-primary"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/pos"
          className="hidden sm:inline-flex bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-pop"
        >
          + New Sale
        </Link>
        <button className="relative w-9 h-9 rounded-lg border border-line flex items-center justify-center text-slate hover:bg-mist transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-bad" />
        </button>
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-[12px] font-semibold font-display shadow-sm">
          SM
        </div>
      </div>
    </header>
  );
}
