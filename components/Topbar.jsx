"use client";

import { usePathname } from "next/navigation";
import { Search, ScanLine } from "lucide-react";
import Link from "next/link";

const ROUTE_MAP = {
  "/": { module: "Home", submodule: "Quick Actions", title: "Mona POS" },
  "/dashboard": { module: "Dashboard", submodule: "Overview", title: "Dashboard Overview" },
  "/pos": { module: "POS", submodule: "Terminal", title: "POS Terminal" },
  "/pos/register": { module: "POS", submodule: "Register", title: "Open / Close Register" },
  "/pos/petty-cash": { module: "POS", submodule: "Petty Cash", title: "Cash In / Cash Out" },
  "/pos/drafts": { module: "POS", submodule: "Draft Orders", title: "Hold / Draft Orders" },
  "/sales": { module: "Sales", submodule: "Invoices", title: "Sales Invoices" },
  "/sales/returns": { module: "Sales", submodule: "Returns", title: "Sales Return" },
  "/sales/due-bills": { module: "Sales", submodule: "Due Bills", title: "Due Bills & Receivables" },
  "/customers": { module: "Sales", submodule: "Customers", title: "Customers List" },
  "/sales/customer-group": { module: "Sales", submodule: "Customer Groups", title: "Customer Groups" },
  "/sales/loyalty": { module: "Sales", submodule: "Loyalty", title: "Loyalty Points & Rewards" },
  "/products": { module: "Products", submodule: "Products", title: "Products Catalog" },
  "/products/create": { module: "Products", submodule: "Add Product", title: "Add New Product" },
  "/products/category": { module: "Products", submodule: "Category", title: "Categories" },
  "/products/sub-category": { module: "Products", submodule: "Sub Category", title: "Sub Categories" },
  "/products/brand": { module: "Products", submodule: "Brand", title: "Brands" },
  "/products/group": { module: "Products", submodule: "Group", title: "Product Inventory Groups" },
  "/products/variants": { module: "Products", submodule: "Units", title: "Units & Variants" },
  "/products/barcode": { module: "Products", submodule: "Barcode", title: "Barcode & Label Generator" },
  "/purchase-orders": { module: "Procurement", submodule: "PO", title: "Purchase Orders (PO)" },
  "/grn": { module: "Procurement", submodule: "GRN", title: "Goods Received Note (GRN)" },
  "/returns": { module: "Procurement", submodule: "RTV", title: "Return to Vendor (RTV)" },
  "/suppliers": { module: "Products & Procurement", submodule: "Supplier", title: "Add Supplier" },
  "/damage": { module: "Procurement", submodule: "Damage", title: "Damaged Stock Register" },
  "/procurement/damage": { module: "Procurement", submodule: "Damage", title: "Damage Assessment" },
  "/procurement/tpn": { module: "Procurement", submodule: "TPN", title: "Inter-Branch Transfer (TPN)" },
  "/inventory": { module: "Inventory", submodule: "Inventories", title: "Products Inventory" },
  "/inventory/adjust": { module: "Inventory", submodule: "Adjust", title: "Stock Adjustment" },
  "/inventory/movement": { module: "Inventory", submodule: "Movement", title: "Stock Movement Ledger" },
  "/inventory/ledger": { module: "Inventory", submodule: "Stock Ledger", title: "Stock Ledger" },
  "/inventory/expiry-tracker": { module: "Inventory", submodule: "Expiry Tracker", title: "Batch & Expiry Tracker" },
  "/inventory/reorder-alerts": { module: "Inventory", submodule: "Reorder Alerts", title: "Stock Reorder & Alerts" },
  "/reports": { module: "Reports", submodule: "Reports", title: "Reports & Analytics" },
  "/reports/profit-loss": { module: "Reports", submodule: "Profit & Loss", title: "Profit & Loss Statement" },
  "/reports/stock-valuation": { module: "Reports", submodule: "Stock Valuation", title: "Stock Valuation" },
  "/reports/expiry": { module: "Reports", submodule: "Expiry", title: "Product Expiry Report" },
  "/reports/audit-logs": { module: "Reports", submodule: "Audit Logs", title: "System Audit Logs" },
  "/settings": { module: "Settings", submodule: "Overview", title: "System Settings" },
  "/settings/profile": { module: "Settings", submodule: "Profile", title: "Profile Settings" },
  "/settings/users": { module: "Settings", submodule: "Users", title: "Users & Roles" },
  "/settings/warehouse": { module: "Settings", submodule: "Warehouse", title: "Warehouse Management" },
  "/settings/branches": { module: "Settings", submodule: "Branches", title: "Store Branches" },
  "/settings/payment": { module: "Settings", submodule: "Payment", title: "Payment Settings" },
  "/settings/hardware": { module: "Settings", submodule: "Hardware", title: "POS Hardware & Terminals" },
  "/settings/backup": { module: "Settings", submodule: "Backup", title: "Backup & Restore" },
  "/promotions/coupons": { module: "Promotions", submodule: "Coupons", title: "Coupons & Promo Codes" },
  "/promotions/campaigns": { module: "Promotions", submodule: "Campaigns", title: "Discount Campaigns" },
  "/promotions/bundles": { module: "Promotions", submodule: "Bundles", title: "Combo & Bundle Offers" },
  "/hrm/staff": { module: "HRM", submodule: "Staff", title: "Staff Directory" },
  "/hrm/attendance": { module: "HRM", submodule: "Attendance", title: "Daily Attendance" },
  "/hrm/commission": { module: "HRM", submodule: "Commission", title: "Sales Commission" },
};

function getNavInfo(pathname) {
  if (ROUTE_MAP[pathname]) return ROUTE_MAP[pathname];

  // Try prefix matching
  const matchingKey = Object.keys(ROUTE_MAP)
    .filter((k) => k !== "/")
    .sort((a, b) => b.length - a.length)
    .find((k) => pathname.startsWith(k));

  if (matchingKey) return ROUTE_MAP[matchingKey];

  // Fallback parsing from path
  const parts = pathname.replace(/^\//, "").split("/");
  const mod = parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : "Module";
  const sub = parts[1] ? parts[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "";
  return {
    module: mod,
    submodule: sub,
    title: sub || mod,
  };
}

export default function Topbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const currentNav = getNavInfo(pathname || "/");

  return (
    <header className="h-16 bg-[#64BD0B] text-white shadow-[0_4px_24px_rgba(100,189,11,0.22)] flex items-center justify-between gap-4 px-4 md:px-6 sticky top-0 z-30 select-none">
      {/* ━━ Left: Brand Logo (on Home /) OR Dynamic Module / Sub-Module Name (on Inner Pages) ━━━ */}
      {isHome ? (
        <Link
          href="/"
          title="Quick Actions Home"
          className="flex items-center py-1 px-2 rounded-xl hover:bg-white/10 transition-colors group shrink-0"
        >
          <img
            src="/logo-white.png"
            alt="Mona Pos"
            className="h-8 md:h-9 w-auto object-contain group-hover:scale-105 transition-transform"
          />
        </Link>
      ) : (
        <div className="flex items-center gap-3 shrink-0 py-1">
          <div className="leading-tight">
            <h1 className="text-sm md:text-base font-extrabold text-white tracking-tight leading-none mt-0.5">
              {currentNav.title}
            </h1>
            <span className="text-[9px] font-bold text-white/80 tracking-wider uppercase block">
              {currentNav.module}
            </span>
          </div>
        </div>
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
