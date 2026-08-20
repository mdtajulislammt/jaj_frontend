"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ScanLine,
  Package,
  Boxes,
  ClipboardList,
  PackageCheck,
  Users,
  Truck,
  Undo2,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "@/store/slices/uiSlice";
import clsx from "clsx";

const NAV = [
  { section: "Overview", links: [{ href: "/", label: "Dashboard", icon: LayoutGrid }] },
  {
    section: "Sales",
    links: [
      { href: "/pos", label: "POS Terminal", icon: ScanLine },
      { href: "/returns", label: "Returns & RTV", icon: Undo2 },
    ],
  },
  {
    section: "Catalog & Stock",
    links: [
      { href: "/products", label: "Products", icon: Package },
      { href: "/inventory", label: "Inventory", icon: Boxes },
    ],
  },
  {
    section: "Procurement",
    links: [
      { href: "/purchase-orders", label: "Purchase Orders", icon: ClipboardList },
      { href: "/grn", label: "GRN — Receiving", icon: PackageCheck },
    ],
  },
  {
    section: "Stakeholders",
    links: [
      { href: "/customers", label: "Customers", icon: Users },
      { href: "/suppliers", label: "Suppliers", icon: Truck },
    ],
  },
  {
    section: "Insights",
    links: [
      { href: "/reports", label: "Reports", icon: BarChart3 },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const collapsed = useSelector((s) => s.ui.sidebarCollapsed);

  return (
    <aside
      className={clsx(
        "shrink-0 bg-ink text-white flex flex-col transition-[width] duration-200",
        collapsed ? "w-[76px]" : "w-[248px]"
      )}
    >
      <div className="h-16 flex items-center gap-2.5 px-4 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-sky flex items-center justify-center shrink-0">
          <ScanLine size={18} strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="font-display font-semibold text-[15px] tracking-tight">ElectroPOS</p>
            <p className="text-[10px] text-white/45 tracking-wide">RETAIL &amp; SUPERSTORE</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2.5">
        {NAV.map((group) => (
          <div key={group.section} className="mb-4">
            {!collapsed && (
              <p className="px-2.5 mb-1.5 text-[10px] font-semibold tracking-widest text-white/35 uppercase">
                {group.section}
              </p>
            )}
            <div className="space-y-0.5">
              {group.links.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] font-medium transition-colors",
                      active
                        ? "bg-sky text-white shadow-pop"
                        : "text-white/65 hover:bg-white/[0.06] hover:text-white"
                    )}
                    title={collapsed ? label : undefined}
                  >
                    <Icon size={17} strokeWidth={2} className="shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-2.5 border-t border-white/10">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-white/55 hover:bg-white/[0.06] hover:text-white transition-colors"
        >
          {collapsed ? <ChevronsRight size={17} /> : <ChevronsLeft size={17} />}
          {!collapsed && <span>Collapse</span>}
        </button>
        {!collapsed && (
          <div className="mt-2 h-3 text-sky-light/70 barcode-strip" aria-hidden="true" />
        )}
      </div>
    </aside>
  );
}
