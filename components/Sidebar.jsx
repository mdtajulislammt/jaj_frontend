"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SlidersHorizontal,
  TrendingUp,
  AlertTriangle,
  ShoppingBag,
  Clock,
  Wallet,
  FileText,
  ShoppingCart,
  Undo2,
  Receipt,
  Users,
  Contact,
  Gift,
  Package,
  Plus,
  Layers,
  Tag,
  Boxes,
  Barcode,
  ArrowDownToLine,
  ClipboardList,
  PackageCheck,
  Truck,
  ArrowUpDown,
  FileSpreadsheet,
  CalendarClock,
  ArrowRightLeft,
  BadgePercent,
  Megaphone,
  Layers2,
  UserCheck,
  UserCog,
  Award,
  BarChart3,
  DollarSign,
  ShieldAlert,
  Settings,
  User,
  Warehouse,
  Printer,
  CreditCard,
  Database,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ScanLine,
  FolderTree,
  Component,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "@/store/slices/uiSlice";
import clsx from "clsx";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: SlidersHorizontal,
    submodules: [
      { href: "/dashboard", label: "Overview & Sales Analytics", icon: SlidersHorizontal },
      { href: "/reports/profit-loss", label: "Real-time Revenue & Profit", icon: TrendingUp },
      { href: "/inventory/reorder-alerts", label: "Low Stock & Expiry Alerts", icon: AlertTriangle },
    ],
  },
  {
    id: "pos",
    label: "POS",
    icon: ShoppingBag,
    submodules: [
      { href: "/pos", label: "POS", icon: ShoppingBag },
      { href: "/pos/register", label: "Open / Close Register", icon: Clock },
      { href: "/pos/petty-cash", label: "Cash In / Cash Out (Petty Cash)", icon: Wallet },
      { href: "/pos/drafts", label: "Hold / Draft Orders", icon: FileText },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    icon: ShoppingCart,
    submodules: [
      { href: "/sales", label: "Sales", icon: ShoppingCart },
      { href: "/sales/returns", label: "Sales Return", icon: Undo2 },
      { href: "/sales/due-bills", label: "Due Bills", icon: Receipt },
      { href: "/customers", label: "Customers", icon: Users },
      { href: "/sales/customer-group", label: "Customer Groups", icon: Contact },
      { href: "/sales/loyalty", label: "Loyalty Points", icon: Gift },
    ],
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    submodules: [
      { href: "/products", label: "Products", icon: Package },
      { href: "/products/category", label: "Category", icon: Layers },
      { href: "/products/sub-category", label: "Sub Category", icon: Component },
      { href: "/products/brand", label: "Brand", icon: Tag },
      { href: "/products/group", label: "Group", icon: FolderTree },
      { href: "/suppliers", label: "Supplier", icon: Truck },
      { href: "/products/variants", label: "Units", icon: Boxes },
      { href: "/products/barcode", label: "Barcode", icon: Barcode },
    ],
  },
  {
    id: "procurement",
    label: "Procurement",
    icon: ArrowDownToLine,
    submodules: [
      { href: "/purchase-orders", label: "PO", icon: ClipboardList },
      { href: "/grn", label: "GRN", icon: PackageCheck },
      { href: "/returns", label: "RTV", icon: Undo2 },
      { href: "/suppliers", label: "Suppliers", icon: Truck },
      { href: "/damage", label: "Damage", icon: ShieldAlert },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Boxes,
    submodules: [
      { href: "/inventory", label: "Inventories", icon: Boxes },
      { href: "/inventory/adjust", label: "Adjust", icon: ArrowUpDown },
      { href: "/inventory/movement", label: "Movement", icon: ArrowRightLeft },
      { href: "/inventory/ledger", label: "Stock Ledger", icon: FileSpreadsheet },
      { href: "/inventory/expiry-tracker", label: "Expiry Tracker", icon: CalendarClock },
      { href: "/inventory/reorder-alerts", label: "Reorder Alerts", icon: AlertTriangle },
    ],
  },
  {
    id: "promotions",
    label: "Promotions & Offers",
    icon: BadgePercent,
    submodules: [
      { href: "/promotions/coupons", label: "Coupons & Promo Codes", icon: Tag },
      { href: "/promotions/campaigns", label: "Discount Campaigns (Flat, %)", icon: Megaphone },
      { href: "/promotions/bundles", label: "Combo & Bundle Offers (BOGO)", icon: Layers2 },
    ],
  },
  {
    id: "hrm",
    label: "HRM & Staff",
    icon: UserCheck,
    submodules: [
      { href: "/hrm/staff", label: "Employee / Staff List", icon: Users },
      { href: "/hrm/attendance", label: "Attendance & Shifts", icon: UserCog },
      { href: "/hrm/commission", label: "Sales Commission & Targets", icon: Award },
    ],
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    icon: BarChart3,
    submodules: [
      { href: "/reports", label: "Sales & Revenue Reports", icon: BarChart3 },
      { href: "/reports/stock-valuation", label: "Stock Valuation (FIFO/FEFO)", icon: FileSpreadsheet },
      { href: "/reports/expiry", label: "Expiry Forecast Reports", icon: CalendarClock },
      { href: "/reports/profit-loss", label: "Profit & Loss Reports", icon: DollarSign },
      { href: "/reports/audit-logs", label: "Audit Logs (Void bills, System)", icon: ShieldAlert },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    submodules: [
      { href: "/settings/profile", label: "General Business Profile", icon: User },
      { href: "/settings/branches", label: "Branches / Outlets Setup", icon: Warehouse },
      { href: "/settings/warehouse", label: "Warehouses Setup", icon: Boxes },
      { href: "/settings/users", label: "User Management & RBAC", icon: Users },
      { href: "/settings/hardware", label: "Hardware & Printer Settings", icon: Printer },
      { href: "/settings/payment", label: "Payment Gateways (Cards, MFS)", icon: CreditCard },
      { href: "/settings/backup", label: "Backup & Restore", icon: Database },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const collapsed = useSelector((s) => s.ui.sidebarCollapsed);

  // Track ONLY ONE open menu at a time (accordion collapse others)
  const [openMenuId, setOpenMenuId] = useState("dashboard");

  // Automatically expand parent menu if pathname matches a sub-item, auto-collapsing others
  useEffect(() => {
    const matchedItem = NAV_ITEMS.find((item) =>
      item.submodules?.some((sub) => {
        if (sub.href === "/") return pathname === "/";
        return pathname === sub.href || pathname.startsWith(sub.href + "/");
      })
    );
    if (matchedItem) {
      setOpenMenuId(matchedItem.id);
    }
  }, [pathname]);

  const toggleMenu = (id) => {
    // If clicking the currently open menu, collapse it; otherwise open it and collapse all others
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  if (pathname === "/") {
    return null;
  }

  return (
    <aside
      className={clsx(
        "shrink-0 bg-gradient-to-b from-white via-white via-60% to-[#64BD0B]/20 text-slate-800 flex flex-col transition-[width] duration-300 border-r border-[#64BD0B]/20 shadow-[4px_0_24px_rgba(100,189,11,0.08)] sticky top-0 h-screen z-40 select-none",
        collapsed ? "w-[76px]" : "w-[268px]"
      )}
    >
      {/* ━━ Header: Logo Link to Quick Actions Home ━━━ */}
      <Link
        href="/"
        title="Go to Quick Actions Home"
        className="h-16 flex items-center justify-center my-4  bg-white/80 backdrop-blur-md shrink-0 hover:bg-[#64BD0B]/10 transition-colors group overflow-hidden"
      >
        <div className="flex items-center justify-center w-full ">
          <img
            src="/logo.png"
            alt="Mona Pos"
            className={`object-contain transition-all duration-200 group-hover:scale-105 ${collapsed ? "h-12 w-auto max-w-[58px]" : "h-16 w-auto max-w-[190px]"
              }`}
          />
        </div>
      </Link>

      {/* ━━ Navigation List (10 Modules Accordion) ━━━ */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const hasChildren = Boolean(item.submodules?.length);
          const isOpen = openMenuId === item.id;

          const isAnyChildActive =
            hasChildren &&
            item.submodules.some((sub) => {
              if (sub.href === "/") return pathname === "/";
              return pathname === sub.href || pathname.startsWith(sub.href + "/");
            });

          return (
            <div key={item.id} className="space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  if (collapsed) {
                    dispatch(toggleSidebar());
                  }
                  toggleMenu(item.id);
                }}
                className={clsx(
                  "w-full flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-all duration-200 group",
                  isAnyChildActive
                    ? "bg-[#64BD0B]/15 text-[#2d5c04] shadow-xs border-l-[3px] border-[#64BD0B]"
                    : "text-slate-700 hover:text-slate-900 hover:bg-[#64BD0B]/10"
                )}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    size={17}
                    strokeWidth={isAnyChildActive ? 2.5 : 2}
                    className={clsx(
                      "shrink-0 transition-transform group-hover:scale-110",
                      isAnyChildActive ? "text-[#3B7506]" : "text-slate-500 group-hover:text-[#64BD0B]"
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed && (
                  <ChevronRight
                    size={14}
                    className={clsx(
                      "shrink-0 transition-transform duration-300 ease-in-out",
                      isOpen ? "rotate-90 text-[#3B7506]" : "text-slate-400 group-hover:text-slate-600"
                    )}
                  />
                )}
              </button>

              {/* Submenu Accordion Items with Smooth Collapse Animation */}
              {!collapsed && (
                <div
                  className={clsx(
                    "grid transition-all duration-300 ease-in-out overflow-hidden ml-4",
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-0.5" : "grid-rows-[0fr] opacity-0 mt-0"
                  )}
                >
                  <div className="min-h-0 pl-3.5 pr-1 py-1 space-y-0.5 border-l-2 border-[#64BD0B]/35">
                    {item.submodules.map((sub) => {
                      const SubIcon = sub.icon;
                      const isSubActive =
                        sub.href === "/"
                          ? pathname === "/"
                          : pathname === sub.href || pathname.startsWith(sub.href + "/");

                      return (
                        <Link
                          key={sub.href + sub.label}
                          href={sub.href}
                          className={clsx(
                            "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all group",
                            isSubActive
                              ? "bg-[#64BD0B] text-white font-bold shadow-sm shadow-[#64BD0B]/30"
                              : "text-slate-600 hover:text-[#2d5c04] hover:bg-[#64BD0B]/10"
                          )}
                        >
                          <SubIcon
                            size={13}
                            strokeWidth={isSubActive ? 2.4 : 1.8}
                            className={clsx(
                              "shrink-0",
                              isSubActive ? "text-white" : "text-slate-400 group-hover:text-[#64BD0B]"
                            )}
                          />
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ━━ Footer: Collapse Toggle ━━━━━━━━━━━━━━━━━━━ */}
      <div className="p-3 border-t border-[#64BD0B]/15 bg-white/40 shrink-0">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-slate-600 hover:text-[#2d5c04] hover:bg-[#64BD0B]/10 transition-colors"
        >
          {collapsed ? <ChevronsRight size={17} /> : <ChevronsLeft size={17} />}
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
