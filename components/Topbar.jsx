"use client";

import { usePathname } from "next/navigation";
import { Search, ScanLine } from "lucide-react";
import Link from "next/link";

export default function Topbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="h-16 bg-[#64BD0B] text-white shadow-[0_4px_24px_rgba(100,189,11,0.22)] border-b border-[#529E08] flex items-center justify-between gap-4 px-4 md:px-6 sticky top-0 z-30 select-none">
      {/* ━━ Left: Brand Logo (Only shown on Quick Actions Home /) ━━━ */}
      {isHome ? (
        <Link
          href="/"
          title="Quick Actions Home"
          className="flex items-center gap-2.5 py-1 px-2 rounded-xl hover:bg-white/10 transition-colors group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-white text-[#3B7506] flex items-center justify-center font-black shadow-sm group-hover:scale-105 transition-transform">
            <ScanLine size={18} strokeWidth={2.8} />
          </div>
          <div className="leading-tight">
            <span className="font-extrabold text-base md:text-lg tracking-tight text-white flex items-center gap-1.5">
              Mona POS
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
            <span className="text-[9px] font-bold text-white/80 tracking-wider uppercase block">
              RETAIL &amp; SUPERSTORE
            </span>
          </div>
        </Link>
      ) : (
        /* Empty spacer on inner pages so search bar aligns nicely */
        <div className="w-2 shrink-0" />
      )}

      {/* ━━ Center: Search Bar (Hidden on Home /, shown on inner pages) ━━━ */}
      {!isHome ? (
        <div className="flex-1 max-w-md relative mx-2">
          <div className="w-full relative flex items-center bg-white/20 hover:bg-white/25 focus-within:bg-white border border-white/30 focus-within:border-white rounded-xl transition-all group">
            <Search
              size={15}
              className="absolute left-3.5 text-white/80 group-focus-within:text-[#3B7506] pointer-events-none transition-colors"
            />
            <input
              placeholder="Search product, invoice, customer…"
              className="w-full bg-transparent pl-10 pr-4 py-2 text-[13px] text-white placeholder:text-white/70 group-focus-within:text-slate-800 group-focus-within:placeholder:text-slate-400 focus-visible:outline-none transition-colors"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1" />
      )}

      {/* ━━ Right: POS Button & 50% Radius Circular Avatar ━━━━━━━━━ */}
      <div className="flex items-center gap-3 shrink-0">
        {/* POS Button */}
        <Link
          href="/pos"
          className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-[#3B7506] text-[13px] font-extrabold px-4 py-2 rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-all"
        >
          POS
        </Link>

        {/* Profile Avatar with 50% Radius (rounded-full) */}
        <div
          className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/80 shadow-md shrink-0 cursor-pointer bg-white relative flex items-center justify-center group hover:ring-white transition-all"
          title="Admin Profile"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="Profile Avatar"
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          {/* Fallback initials if offline or image failed */}
          <span className="font-display font-black text-xs text-[#3B7506] select-none absolute inset-0 flex items-center justify-center -z-10 bg-white">
            HM
          </span>
        </div>
      </div>
    </header>
  );
}
