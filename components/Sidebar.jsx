"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SlidersHorizontal,
  ShoppingBag,
  ShoppingCart,
  Users,
  Contact,
  Receipt,
  CircleDollarSign,
  Package,
  Layers,
  Component,
  Tag,
  FolderTree,
  Truck,
  ArrowDownToLine,
  ClipboardList,
  PackageCheck,
  Undo2,
  Building2,
  Trash2,
  Boxes,
  ArrowUpDown,
  ArrowRightLeft,
  FileSpreadsheet,
  BarChart3,
  Settings,
  User,
  Warehouse,
  Store,
  CreditCard,
  Database,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ScanLine,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "@/store/slices/uiSlice";
import clsx from "clsx";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: SlidersHorizontal,
    href: "/",
  },
  {
    id: "pos",
    label: "POS",
    icon: ShoppingBag,
    href: "/pos",
  },
  {
    id: "sales",
    label: "Sales",
    icon: ShoppingCart,
    submodules: [
      { href: "/sales", label: "Sales", icon: ShoppingCart },
      { href: "/customers", label: "Customers", icon: Users },
      { href: "/sales/customer-group", label: "Customer Group", icon: Contact },
      { href: "/sales/due-bills", label: "Due Bills", icon: Receipt },
    ],
  },
  {
    id: "accounts",
    label: "Accounts",
    icon: CircleDollarSign,
    href: "/accounts",
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
    ],
  },
  {
    id: "procurement",
    label: "Procurement",
    icon: ArrowDownToLine,
    submodules: [
      { href: "/purchase-orders", label: "Purchase", icon: ClipboardList },
      { href: "/grn", label: "GRN", icon: PackageCheck },
      { href: "/returns", label: "RTV", icon: Undo2 },
      { href: "/procurement/tpn", label: "TPN", icon: Building2 },
      { href: "/procurement/damage", label: "Damage", icon: Trash2 },
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
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    href: "/reports",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    submodules: [
      { href: "/settings/profile", label: "Profile Settings", icon: User },
      { href: "/settings/users", label: "Users", icon: Users },
      { href: "/settings/warehouse", label: "Warehouse", icon: Warehouse },
      { href: "/settings", label: "Store Settings", icon: Store },
      { href: "/settings/payment", label: "Payment Settings", icon: CreditCard },
      { href: "/settings/backup", label: "Backup & Restore", icon: Database },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const collapsed = useSelector((s) => s.ui.sidebarCollapsed);

  // Track expanded accordion menus
  const [openMenus, setOpenMenus] = useState({});

  // Automatically expand parent menu if pathname matches a sub-item
  useEffect(() => {
    const newOpens = {};
    NAV_ITEMS.forEach((item) => {
      if (item.submodules) {
        const isChildActive = item.submodules.some((sub) => {
          if (sub.href === "/") return pathname === "/";
          return pathname === sub.href || pathname.startsWith(sub.href + "/");
        });
        if (isChildActive) {
          newOpens[item.id] = true;
        }
      }
    });
    setOpenMenus((prev) => ({ ...prev, ...newOpens }));
  }, [pathname]);

  const toggleMenu = (id) => {
    setOpenMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <aside
      className={clsx(
        "shrink-0 bg-[#64BD0B] text-white flex flex-col transition-[width] duration-300 shadow-[4px_0_28px_rgba(100,189,11,0.35)] sticky top-0 h-screen z-40 select-none",
        collapsed ? "w-[76px]" : "w-[258px]"
      )}
    >
      {/* ━━ Header: ElectroPOS ━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-white/20 bg-black/5 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-white text-[#3B7506] flex items-center justify-center shrink-0 shadow-md font-bold">
          <ScanLine size={19} strokeWidth={2.6} />
        </div>
        {!collapsed && (
          <div className="leading-tight min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-display font-bold text-[16px] text-white tracking-tight">ElectroPOS</p>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
            <p className="text-[9.5px] font-bold text-white/80 tracking-wider uppercase">RETAIL &amp; SUPERSTORE</p>
          </div>
        )}
      </div>

      {/* ━━ Navigation List ━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2.5 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const hasChildren = Boolean(item.submodules?.length);
          const isOpen = Boolean(openMenus[item.id]);

          // Check if parent or direct item is active
          const isDirectActive = item.href && pathname === item.href;
          const isAnyChildActive =
            hasChildren &&
            item.submodules.some((sub) => {
              if (sub.href === "/") return pathname === "/";
              return pathname === sub.href || pathname.startsWith(sub.href + "/");
            });

          // Single Link Menu (no submodules)
          if (!hasChildren) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 group relative",
                  isDirectActive
                    ? "bg-white text-[#3B7506] shadow-md font-bold"
                    : "text-white/90 hover:text-white hover:bg-white/15"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={18}
                  strokeWidth={isDirectActive ? 2.5 : 2}
                  className={clsx("shrink-0 transition-transform", isDirectActive ? "text-[#3B7506]" : "text-white group-hover:scale-110")}
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {isDirectActive && !collapsed && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#3B7506]" />
                )}
              </Link>
            );
          }

          // Expandable Accordion Menu (with submodules)
          return (
            <div key={item.id} className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  if (collapsed) {
                    dispatch(toggleSidebar());
                  }
                  toggleMenu(item.id);
                }}
                className={clsx(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 group",
                  isAnyChildActive
                    ? "bg-white/20 text-white font-bold"
                    : "text-white/90 hover:text-white hover:bg-white/15"
                )}
                title={collapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    size={18}
                    strokeWidth={isAnyChildActive ? 2.5 : 2}
                    className="shrink-0 text-white group-hover:scale-110 transition-transform"
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed && (
                  <ChevronRight
                    size={15}
                    className={clsx(
                      "shrink-0 text-white/80 transition-transform duration-200",
                      isOpen && "rotate-90 text-white"
                    )}
                  />
                )}
              </button>

              {/* Submenu Accordion Items */}
              {!collapsed && isOpen && (
                <div className="pl-5 pr-1 py-1 space-y-1 border-l-2 border-white/25 ml-4">
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
                          "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all group",
                          isSubActive
                            ? "bg-white text-[#3B7506] font-bold shadow-sm"
                            : "text-white/85 hover:text-white hover:bg-white/15"
                        )}
                      >
                        <SubIcon
                          size={15}
                          strokeWidth={isSubActive ? 2.4 : 1.8}
                          className={clsx("shrink-0", isSubActive ? "text-[#3B7506]" : "text-white/80 group-hover:text-white")}
                        />
                        <span className="truncate">{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ━━ Footer: Collapse Toggle ━━━━━━━━━━━━━━━━━━━ */}
      <div className="p-3 border-t border-white/20 bg-black/5 shrink-0">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-white/85 hover:text-white hover:bg-white/15 transition-colors"
        >
          {collapsed ? <ChevronsRight size={17} /> : <ChevronsLeft size={17} />}
          {!collapsed && <span>Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
