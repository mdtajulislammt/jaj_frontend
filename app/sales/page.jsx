"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  FileText,
  Table as TableIcon,
  Download,
  Eye,
  Trash2,
  Printer,
  X,
  CheckCircle2,
  Calendar,
  Building,
  ChevronDown,
  Layers,
  BarChart3,
  Search,
  ShoppingCart,
  Wallet,
  Receipt,
  ScanLine,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import { money } from "@/lib/format";
import clsx from "clsx";

const INITIAL_SALES_DATA = [
  {
    id: "AD9919610001",
    date: "10-17-2026 03:44 PM",
    rawDate: "2026-10-17",
    biller: "Hasib Mahmud",
    warehouse: "Hasib Mart",
    customer: "Walkaway customer",
    itemsCount: 1,
    items: [
      { name: "Pran Frooto Mango 500ml", sku: "PRN-FRT-500", category: "Beverages", qty: 1, price: 135, total: 135 },
    ],
    grossTotal: 135,
    paid: 200,
    change: 65,
    status: "Complete",
    paymentMethod: "Cash",
  },
  {
    id: "AD9919610002",
    date: "10-17-2026 02:15 PM",
    rawDate: "2026-10-17",
    biller: "Hasib Mahmud",
    warehouse: "Hasib Mart",
    customer: "Tanvir Ahmed",
    itemsCount: 2,
    items: [
      { name: "Nestle Nido Milk Powder 1kg", sku: "NST-NID-1KG", category: "Groceries", qty: 1, price: 950, total: 950 },
      { name: "Aarong Pure Ghee 400g", sku: "ARG-GHE-400", category: "Groceries", qty: 1, price: 620, total: 620 },
    ],
    grossTotal: 1570,
    paid: 1600,
    change: 30,
    status: "Complete",
    paymentMethod: "bKash MFS",
  },
  {
    id: "AD9919610003",
    date: "10-17-2026 01:20 PM",
    rawDate: "2026-10-17",
    biller: "Nusrat Jahan",
    warehouse: "Dhanmondi Flagship Store",
    customer: "Mahmud Hasan",
    itemsCount: 1,
    items: [
      { name: "Samsung Galaxy S24 Ultra", sku: "SGS24-BLK-256", category: "Smartphones", qty: 1, price: 98000, total: 98000 },
    ],
    grossTotal: 98000,
    paid: 98000,
    change: 0,
    status: "Complete",
    paymentMethod: "Visa Card",
  },
  {
    id: "AD9919610004",
    date: "10-17-2026 11:45 AM",
    rawDate: "2026-10-17",
    biller: "Imtiaz Hossain",
    warehouse: "Central Warehouse Hub",
    customer: "Apex Retailers Ltd",
    itemsCount: 4,
    items: [
      { name: "Anker 65W GaN Fast Charger", sku: "ANK-GAN-65W", category: "Audio & Accessories", qty: 4, price: 3200, total: 12800 },
    ],
    grossTotal: 12800,
    paid: 12800,
    change: 0,
    status: "Complete",
    paymentMethod: "Bank Transfer",
  },
  {
    id: "AD9919610005",
    date: "10-16-2026 05:10 PM",
    rawDate: "2026-10-16",
    biller: "Hasib Mahmud",
    warehouse: "Hasib Mart",
    customer: "Walkaway customer",
    itemsCount: 1,
    items: [
      { name: "Coca-Cola 500ml Pet Bottle", sku: "CC-500ML", category: "Beverages", qty: 1, price: 40, total: 40 },
    ],
    grossTotal: 40,
    paid: 50,
    change: 10,
    status: "Complete",
    paymentMethod: "Cash",
  },
];

const WAREHOUSES = [
  "All Warehouse",
  "Hasib Mart",
  "Central Warehouse Hub",
  "Dhanmondi Flagship Store",
  "Uttara Superstore Outlet",
  "Gulshan Premium Express",
];

export default function AllSalesPage() {
  const reduxInvoices = useSelector((s) => s.sales.invoices) || [];
  const [salesList, setSalesList] = useState(INITIAL_SALES_DATA);
  const [activeTab, setActiveTab] = useState("sale"); // "sale" | "article" | "category" | "allCategory"

  // Filter states matching screenshot
  const [dateFrom, setDateFrom] = useState("2026-10-17");
  const [dateTo, setDateTo] = useState("2026-10-17");
  const [searchInvoice, setSearchInvoice] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("All Warehouse");
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // Merge dynamic POS sales from Redux
  const allSales = useMemo(() => {
    const formattedRedux = reduxInvoices.map((inv) => ({
      id: inv.id,
      date: `${inv.date || "2026-10-17"} 12:30 PM`,
      rawDate: inv.date || "2026-10-17",
      biller: "Hasib Mahmud",
      warehouse: "Hasib Mart",
      customer: inv.customerName || "Walkaway customer",
      itemsCount: inv.items ? inv.items.reduce((s, i) => s + (i.qty || 1), 0) : 1,
      items: inv.items || [{ name: "Product Sale", sku: "SKU", category: "General", qty: 1, price: inv.total, total: inv.total }],
      grossTotal: inv.total || 0,
      paid: inv.total ? inv.total + 50 : 0,
      change: 50,
      status: "Complete",
      paymentMethod: "Cash",
    }));

    // Deduplicate by ID
    const map = new Map();
    salesList.forEach((s) => map.set(s.id, s));
    formattedRedux.forEach((s) => {
      if (!map.has(s.id)) map.set(s.id, s);
    });

    return Array.from(map.values());
  }, [salesList, reduxInvoices]);

  // Filtered sales
  const filteredSales = useMemo(() => {
    return allSales.filter((sale) => {
      const matchSearch =
        !searchInvoice.trim() ||
        sale.id.toLowerCase().includes(searchInvoice.toLowerCase().trim()) ||
        sale.customer.toLowerCase().includes(searchInvoice.toLowerCase().trim());

      const matchWarehouse =
        selectedWarehouse === "All Warehouse" || sale.warehouse === selectedWarehouse;

      const matchDate =
        (!dateFrom || sale.rawDate >= dateFrom) &&
        (!dateTo || sale.rawDate <= dateTo);

      return matchSearch && matchWarehouse && matchDate;
    });
  }, [allSales, searchInvoice, selectedWarehouse, dateFrom, dateTo]);

  // Totals for summary row & StatCards
  const totalGross = filteredSales.reduce((acc, s) => acc + (s.grossTotal || 0), 0);
  const totalPaid = filteredSales.reduce((acc, s) => acc + (s.paid || 0), 0);
  const totalChange = filteredSales.reduce((acc, s) => acc + (s.change || 0), 0);
  const totalItemsCount = filteredSales.reduce((acc, s) => acc + (s.itemsCount || 0), 0);

  // Article Sales Aggregation
  const articleSales = useMemo(() => {
    const map = new Map();
    filteredSales.forEach((s) => {
      s.items?.forEach((item) => {
        const key = item.sku || item.name;
        if (!map.has(key)) {
          map.set(key, {
            sku: item.sku || "N/A",
            name: item.name,
            category: item.category || "General",
            qtySold: 0,
            revenue: 0,
          });
        }
        const curr = map.get(key);
        curr.qtySold += item.qty || 1;
        curr.revenue += item.total || item.price * (item.qty || 1);
      });
    });
    return Array.from(map.values());
  }, [filteredSales]);

  // Category Sales Aggregation
  const categorySales = useMemo(() => {
    const map = new Map();
    filteredSales.forEach((s) => {
      s.items?.forEach((item) => {
        const cat = item.category || "General";
        if (!map.has(cat)) {
          map.set(cat, {
            category: cat,
            invoicesCount: 0,
            itemsSold: 0,
            grossSales: 0,
          });
        }
        const curr = map.get(cat);
        curr.itemsSold += item.qty || 1;
        curr.grossSales += item.total || item.price * (item.qty || 1);
      });
      map.forEach((c) => {
        c.invoicesCount = filteredSales.filter((sale) =>
          sale.items?.some((i) => (i.category || "General") === c.category)
        ).length;
      });
    });
    return Array.from(map.values());
  }, [filteredSales]);

  // Delete invoice
  const handleDelete = (id) => {
    if (confirm(`Are you sure you want to delete invoice ${id}?`)) {
      setSalesList((prev) => prev.filter((item) => item.id !== id));
      setToastMsg(`Invoice ${id} has been deleted.`);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  // Export handler
  const handleExport = (type) => {
    setExportMenuOpen(false);
    if (type === "csv") {
      const csvHeader = "Invoice ID,Date,Biller,Warehouse,Customer,Items,Gross Total,Paid,Change,Status\n";
      const csvRows = filteredSales
        .map(
          (s) =>
            `"${s.id}","${s.date}","${s.biller}","${s.warehouse}","${s.customer}",${s.itemsCount},${s.grossTotal},${s.paid},${s.change},"${s.status}"`
        )
        .join("\n");
      const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `sales_report_${dateFrom}_${dateTo}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setToastMsg("Sales data exported to CSV successfully.");
      setTimeout(() => setToastMsg(null), 3000);
    } else if (type === "print") {
      window.print();
    } else {
      setToastMsg("Sales export initiated.");
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-[1700px] mx-auto select-none">
      {/* ━━ 4 Glass Stat Cards (Website Design System) ━━ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Gross Sales"
          value={`৳${totalGross.toLocaleString()}`}
          icon={ShoppingCart}
          trend="+18.4% today"
          trendUp
          tone="primary"
        />
        <StatCard
          label="Paid Inflow"
          value={`৳${totalPaid.toLocaleString()}`}
          icon={CheckCircle2}
          trend="Settled & verified"
          trendUp
          tone="good"
        />
        <StatCard
          label="Change Returned"
          value={`৳${totalChange.toLocaleString()}`}
          icon={Wallet}
          trend="Cash drawer balance"
          tone="warn"
        />
        <StatCard
          label="Total Invoices"
          value={filteredSales.length}
          icon={Receipt}
          trend="Filtered records"
          tone="primary"
        />
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs text-emerald-800 font-medium shadow-sm animate-in fade-in">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-600" />
            {toastMsg}
          </span>
          <button onClick={() => setToastMsg(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <X size={15} />
          </button>
        </div>
      )}

      {/* ━━ Main Sales Console Card (Matching Website & Reference Image) ━━ */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/80 shadow-[0_10px_35px_rgba(100,189,11,0.06)] overflow-hidden">
        {/* Top Filter and Actions Bar Matching Screenshot */}
        <div className="p-4 md:p-5 border-b border-slate-200/70 bg-gradient-to-r from-[#64BD0B]/5 to-transparent flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          {/* Left Side: 2 Rows of Filter Inputs from Screenshot */}
          <div className="w-full xl:w-auto flex flex-col gap-2.5">
            {/* Row 1: Date From and Date To */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-44 h-9.5 px-3 bg-white/90 border border-slate-200/90 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-2 focus:ring-[#64BD0B]/20 transition-all shadow-2xs font-medium cursor-pointer"
                />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-44 h-9.5 px-3 bg-white/90 border border-slate-200/90 rounded-xl text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-2 focus:ring-[#64BD0B]/20 transition-all shadow-2xs font-medium cursor-pointer"
                />
              </div>
            </div>

            {/* Row 2: Search Invoice ID & All Warehouse Dropdown */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-44">
                <input
                  type="text"
                  placeholder="Search Invoice ID"
                  value={searchInvoice}
                  onChange={(e) => setSearchInvoice(e.target.value)}
                  className="w-full h-9.5 px-3.5 bg-white/90 border border-slate-200/90 rounded-xl text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#64BD0B] focus:ring-2 focus:ring-[#64BD0B]/20 transition-all shadow-2xs"
                />
              </div>
              <div className="relative w-44">
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  className="w-full h-9.5 px-3.5 bg-white/90 border border-slate-200/90 rounded-xl text-[13px] font-medium text-slate-700 focus:outline-none focus:border-[#64BD0B] focus:ring-2 focus:ring-[#64BD0B]/20 transition-all appearance-none cursor-pointer shadow-2xs"
                >
                  {WAREHOUSES.map((wh) => (
                    <option key={wh} value={wh}>
                      {wh}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Tab Buttons and Export Dropdown */}
          <div className="flex flex-wrap items-center gap-3 self-end xl:self-center">
            {/* Segmented Pill Tabs matching screenshot */}
            <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 shadow-2xs">
              {/* Tab 1: Sale */}
              <button
                onClick={() => setActiveTab("sale")}
                className={clsx(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-bold transition-all cursor-pointer",
                  activeTab === "sale"
                    ? "bg-white text-[#64BD0B] shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                )}
              >
                <FileText size={15} className={activeTab === "sale" ? "text-[#64BD0B]" : "text-slate-400"} />
                Sale
              </button>

              {/* Tab 2: Article Sale */}
              <button
                onClick={() => setActiveTab("article")}
                className={clsx(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-bold transition-all cursor-pointer",
                  activeTab === "article"
                    ? "bg-white text-[#64BD0B] shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                )}
              >
                <TableIcon size={15} className={activeTab === "article" ? "text-[#64BD0B]" : "text-slate-400"} />
                Article Sale
              </button>

              {/* Tab 3: Category Sale */}
              <button
                onClick={() => setActiveTab("category")}
                className={clsx(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-bold transition-all cursor-pointer",
                  activeTab === "category"
                    ? "bg-white text-[#64BD0B] shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                )}
              >
                <TableIcon size={15} className={activeTab === "category" ? "text-[#64BD0B]" : "text-slate-400"} />
                Category Sale
              </button>

              {/* Tab 4: All Category Sum */}
              <button
                onClick={() => setActiveTab("allCategory")}
                className={clsx(
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12.5px] font-bold transition-all cursor-pointer",
                  activeTab === "allCategory"
                    ? "bg-white text-[#64BD0B] shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                )}
              >
                <TableIcon size={15} className={activeTab === "allCategory" ? "text-[#64BD0B]" : "text-slate-400"} />
                All Category Sum
              </button>
            </div>

            {/* Button 5: Export Dropdown Button matching screenshot */}
            <div className="relative">
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="bg-[#64BD0B] hover:bg-[#529E08] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Download size={14} />
                Export
                <ChevronDown size={14} className={clsx("transition-transform duration-200", exportMenuOpen && "rotate-180")} />
              </button>

              {exportMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-30 animate-in fade-in">
                  <button
                    onClick={() => handleExport("csv")}
                    className="w-full text-left px-4 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Download size={14} className="text-slate-400" /> Export to CSV (.csv)
                  </button>
                  <button
                    onClick={() => handleExport("excel")}
                    className="w-full text-left px-4 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Download size={14} className="text-slate-400" /> Export to Excel (.xlsx)
                  </button>
                  <button
                    onClick={() => handleExport("print")}
                    className="w-full text-left px-4 py-2 text-[12.5px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Printer size={14} className="text-slate-400" /> Print Sales Report
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ━━ Tab 1: "Sale" Table (Matching Screenshot Columns & Layout) ━━ */}
        {activeTab === "sale" && (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr className="text-left text-slate-500 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-3.5">Invoice ID</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Biller</th>
                  <th className="px-5 py-3.5">Warehouse</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5 text-center">Items</th>
                  <th className="px-5 py-3.5 text-right">Gross Total</th>
                  <th className="px-5 py-3.5 text-right">Paid</th>
                  <th className="px-5 py-3.5 text-right">Change</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-5 py-12 text-center text-slate-400 font-medium">
                      No sales records found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                      {/* Invoice ID */}
                      <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        <span className="font-mono text-[12px] font-bold text-[#3B7506] bg-[#64BD0B]/10 px-2.5 py-1 rounded-md border border-[#64BD0B]/20 inline-block">
                          {sale.id}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap text-[12.5px] font-mono">
                        {sale.date}
                      </td>

                      {/* Biller */}
                      <td className="px-5 py-3.5 text-slate-700 font-medium">{sale.biller}</td>

                      {/* Warehouse */}
                      <td className="px-5 py-3.5 text-slate-700">{sale.warehouse}</td>

                      {/* Customer */}
                      <td className="px-5 py-3.5 text-slate-900 font-semibold">{sale.customer}</td>

                      {/* Items */}
                      <td className="px-5 py-3.5 text-center font-medium text-slate-700">{sale.itemsCount}</td>

                      {/* Gross Total */}
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-slate-900">
                        {sale.grossTotal.toLocaleString()}
                      </td>

                      {/* Paid */}
                      <td className="px-5 py-3.5 text-right font-mono text-slate-700 font-medium">
                        {sale.paid.toLocaleString()}
                      </td>

                      {/* Change */}
                      <td className="px-5 py-3.5 text-right font-mono text-slate-700 font-medium">
                        {sale.change.toLocaleString()}
                      </td>

                      {/* Status: Green pill badge using website Badge tone="good" */}
                      <td className="px-5 py-3.5 text-center">
                        <Badge tone="good" dot>
                          {sale.status}
                        </Badge>
                      </td>

                      {/* Actions: Blue Eye icon & Red Trash icon */}
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedInvoice(sale)}
                            className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-200/70 flex items-center justify-center transition-all hover:scale-105 shadow-2xs cursor-pointer"
                            title="View Invoice Slip"
                            aria-label="View Invoice Slip"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(sale.id)}
                            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/70 flex items-center justify-center transition-all hover:scale-105 shadow-2xs cursor-pointer"
                            title="Delete Invoice"
                            aria-label="Delete Invoice"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}

                {/* Total Summary Row Exactly Matching Screenshot */}
                {filteredSales.length > 0 && (
                  <tr className="bg-slate-50/90 font-bold border-t-2 border-slate-200/90">
                    <td colSpan={5} className="px-5 py-3.5"></td>
                    <td className="px-5 py-3.5 text-center text-slate-900 font-bold">Total</td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-[#3B7506] text-[14px]">
                      {totalGross.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-[#3B7506] text-[14px]">
                      {totalPaid.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-[#3B7506] text-[14px]">
                      {totalChange.toLocaleString()}
                    </td>
                    <td colSpan={2}></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ━━ Tab 2: Article Sale View ━━ */}
        {activeTab === "article" && (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr className="text-left text-slate-500 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-3.5">Article Code / SKU</th>
                  <th className="px-5 py-3.5">Product Name</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5 text-center">Quantity Sold</th>
                  <th className="px-5 py-3.5 text-right">Total Revenue (৳)</th>
                  <th className="px-5 py-3.5 text-right">Avg Unit Price (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articleSales.map((art) => (
                  <tr key={art.sku} className="hover:bg-[#64BD0B]/5 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200">{art.sku}</span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800">{art.name}</td>
                    <td className="px-5 py-3.5 text-slate-600">{art.category}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-slate-900">{art.qtySold}</td>
                    <td className="px-5 py-3.5 text-right font-mono font-bold text-[#EA580C]">
                      {art.revenue.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-slate-700">
                      {Math.round(art.revenue / art.qtySold).toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50/90 font-bold border-t-2 border-slate-200/90">
                  <td colSpan={3} className="px-5 py-3.5 text-slate-900">Total Article Sales</td>
                  <td className="px-5 py-3.5 text-center text-slate-900 font-bold">
                    {articleSales.reduce((s, a) => s + a.qtySold, 0)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-[#EA580C] text-[14px]">
                    {articleSales.reduce((s, a) => s + a.revenue, 0).toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ━━ Tab 3: Category Sale View ━━ */}
        {activeTab === "category" && (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-[13px] border-collapse">
              <thead>
                <tr className="text-left text-slate-500 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-3.5">Category Name</th>
                  <th className="px-5 py-3.5 text-center">Invoices</th>
                  <th className="px-5 py-3.5 text-center">Items Sold</th>
                  <th className="px-5 py-3.5 text-right">Gross Sales (৳)</th>
                  <th className="px-5 py-3.5 text-right">Revenue Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categorySales.map((cat) => {
                  const share = totalGross > 0 ? ((cat.grossSales / totalGross) * 100).toFixed(1) : 0;
                  return (
                    <tr key={cat.category} className="hover:bg-[#64BD0B]/5 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">{cat.category}</td>
                      <td className="px-5 py-3.5 text-center text-slate-700">{cat.invoicesCount}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-slate-800">{cat.itemsSold}</td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-[#EA580C]">
                        {cat.grossSales.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <div className="w-20 bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#64BD0B] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, share)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-slate-700 w-10 text-right">{share}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-slate-50/90 font-bold border-t-2 border-slate-200/90">
                  <td className="px-5 py-3.5 text-slate-900">Total All Categories</td>
                  <td className="px-5 py-3.5 text-center text-slate-900 font-bold">
                    {categorySales.reduce((s, c) => s + c.invoicesCount, 0)}
                  </td>
                  <td className="px-5 py-3.5 text-center text-slate-900 font-bold">
                    {categorySales.reduce((s, c) => s + c.itemsSold, 0)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-[#EA580C] text-[14px]">
                    {categorySales.reduce((s, c) => s + c.grossSales, 0).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-900 font-bold">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ━━ Tab 4: All Category Sum View ━━ */}
        {activeTab === "allCategory" && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Total Sales Revenue
                </span>
                <span className="text-2xl font-bold font-mono text-[#EA580C]">৳{totalGross.toLocaleString()}</span>
              </div>
              <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Total Items Sold
                </span>
                <span className="text-2xl font-bold text-slate-900">{totalItemsCount} pcs</span>
              </div>
              <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                  Active Categories
                </span>
                <span className="text-2xl font-bold text-[#64BD0B]">{categorySales.length} Categories</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Category Share & Contribution</h3>
              <div className="space-y-2.5">
                {categorySales.map((cat) => {
                  const share = totalGross > 0 ? ((cat.grossSales / totalGross) * 100).toFixed(1) : 0;
                  return (
                    <div
                      key={cat.category}
                      className="bg-white p-4 rounded-xl border border-slate-200/90 hover:border-[#64BD0B]/40 transition-all shadow-2xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-bold text-slate-800">{cat.category}</span>
                        <span className="text-[13px] font-bold font-mono text-[#EA580C]">
                          ৳{cat.grossSales.toLocaleString()} ({share}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#64BD0B] to-[#84DB1B] h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, share)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ━━ Invoice Details Modal (Website Design) ━━ */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="text-center pb-4 border-b border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-[#64BD0B] text-white flex items-center justify-center mx-auto mb-2 font-bold shadow-md shadow-[#64BD0B]/25">
                <Receipt size={22} />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Mona POS Sales Receipt</h3>
              <p className="text-[12px] text-slate-500 font-mono">Invoice: {selectedInvoice.id}</p>
            </div>

            <div className="py-4 space-y-2 text-[13px]">
              <div className="flex justify-between text-slate-600">
                <span>Date & Time:</span>
                <span className="font-medium text-slate-900">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Biller:</span>
                <span className="font-semibold text-slate-900">{selectedInvoice.biller}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Warehouse / Branch:</span>
                <span className="font-semibold text-slate-900">{selectedInvoice.warehouse}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Customer:</span>
                <span className="font-semibold text-slate-900">{selectedInvoice.customer}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Method:</span>
                <span className="font-medium text-slate-900">{selectedInvoice.paymentMethod || "Cash"}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Status:</span>
                <Badge tone="good" dot>
                  {selectedInvoice.status}
                </Badge>
              </div>

              {/* Itemized list */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Items Purchased</span>
                <div className="space-y-1.5">
                  {selectedInvoice.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                      <div>
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="text-slate-400 block text-[11px]">{item.sku} · Qty: {item.qty}</span>
                      </div>
                      <span className="font-bold font-mono text-slate-900 self-center">
                        ৳{(item.total || item.price * (item.qty || 1)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-1">
                <div className="flex justify-between text-sm font-bold text-slate-900">
                  <span>Gross Total:</span>
                  <span className="font-mono text-[#EA580C]">৳{selectedInvoice.grossTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Paid Amount:</span>
                  <span className="font-mono font-medium text-slate-900">৳{selectedInvoice.paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Change Given:</span>
                  <span className="font-mono font-medium text-slate-900">৳{selectedInvoice.change.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold py-2.5 rounded-xl shadow-[0_4px_16px_rgba(100,189,11,0.3)] transition-all text-[13px] cursor-pointer hover:scale-[1.01]"
              >
                <Printer size={15} /> Print Receipt
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[13px] cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
