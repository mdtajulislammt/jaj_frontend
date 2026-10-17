"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Calculator,
  FileText,
  ShoppingCart,
  Landmark,
  User,
  Package,
  Users,
  Banknote,
  Trash2,
  Settings,
  FileSpreadsheet,
  Boxes,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const QUICK_ACTIONS = [
  {
    id: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & Analytics",
  },
  {
    id: "pos",
    title: "POS",
    href: "/pos",
    icon: Calculator,
    description: "Billing & Cash Register",
  },
  {
    id: "grn",
    title: "GRN",
    href: "/grn",
    icon: FileText,
    description: "Goods Received Note",
  },
  {
    id: "sales",
    title: "Sales",
    href: "/sales",
    icon: ShoppingCart,
    description: "Invoices & Returns",
  },
  {
    id: "accounts",
    title: "Accounts",
    href: "/reports/profit-loss",
    icon: Landmark,
    description: "P&L & Financials",
  },
  {
    id: "users",
    title: "Users",
    href: "/settings/users",
    icon: User,
    description: "Roles & Permissions",
  },
  {
    id: "products",
    title: "Products",
    href: "/products",
    icon: Package,
    description: "Catalog & Pricing",
  },
  {
    id: "customers",
    title: "Customers",
    href: "/customers",
    icon: Users,
    description: "CRM & Groups",
  },
  {
    id: "purchase",
    title: "Purchase",
    href: "/purchase-orders",
    icon: Banknote,
    description: "Purchase Orders ",
  },
  {
    id: "damage",
    title: "Damage",
    href: "/procurement/damage",
    icon: Trash2,
    description: "Loss & Shrinkage",
  },
  {
    id: "settings",
    title: "Settings",
    href: "/settings/profile",
    icon: Settings,
    description: "System & Outlets",
  },
  {
    id: "reports",
    title: "Reports",
    href: "/reports",
    icon: FileSpreadsheet,
    description: "Sales & Stock Reports",
  },
  {
    id: "inventory",
    title: "Inventory",
    href: "/inventory",
    icon: Boxes,
    description: "Stock & Movement",
  },
];

export default function QuickActionsPage() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Format live date like "15 October 2026"
    const now = new Date();
    const formatted = now.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setCurrentDate(formatted);
  }, []);

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* ━━ Header Section: Welcome & Live Date ━━━━━━━ */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/60 pb-5">
          <div>
            <p className="text-xs font-bold text-[#3B7506] uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#64BD0B] animate-pulse" />
              Welcome Back
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mt-1">
              Quick Actions
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-sm sm:text-base font-bold text-slate-700 bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200/80 shadow-xs inline-block">
              {currentDate || "15 October 2026"}
            </span>
          </div>
        </div>

        {/* ━━ 13 Quick Action Tiles Grid ━━━━━━━━━━━━━━━ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {QUICK_ACTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className="group relative flex flex-col items-center justify-center p-6 sm:p-7 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 hover:border-[#64BD0B] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(100,189,11,0.22)] hover:-translate-y-1.5 transition-all duration-200 overflow-hidden text-center"
              >
                {/* Subtle top indicator on hover */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#64BD0B] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Icon Circle */}
                <div className="w-14 h-14 rounded-2xl bg-slate-100/90 group-hover:bg-[#64BD0B]/15 text-slate-700 group-hover:text-[#3B7506] flex items-center justify-center transition-all duration-200 group-hover:scale-110 shadow-xs mb-3">
                  <Icon size={26} strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-[15px] text-slate-800 group-hover:text-[#3B7506] transition-colors">
                  {item.title}
                </h3>

                {/* Short Subtitle */}
                <p className="text-[11px] text-slate-400 group-hover:text-slate-500 transition-colors mt-0.5 truncate w-full">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* ━━ Bottom Helper Notice ━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="pt-4 flex items-center justify-center text-xs text-slate-400 gap-2">
          <span>Click any module above to enter management console</span>
          <span>•</span>
          <span className="text-[#3B7506] font-semibold">Click Logo anytime to return here</span>
        </div>
      </div>
    </div>
  );
}
