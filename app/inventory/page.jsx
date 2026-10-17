"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Download,
  Search,
  RotateCw,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Store,
  Receipt,
  Boxes,
  ArrowUpDown,
  ArrowRightLeft,
  FileSpreadsheet,
  CheckCircle2,
  FileText,
  Filter,
} from "lucide-react";
import { useSelector } from "react-redux";

// Realistic inventory rows matching Screenshot 2
const INITIAL_INVENTORY_ITEMS = [
  {
    article: "5114433",
    name: "NeoCare Baby Diaper Midi 40",
    unit: "Pcs",
    openingStock: 0,
    purchaseQty: 40,
    salesReturnQty: 0,
    receiveAdjustment: 0,
    availableStock: 35,
    saleQty: 5,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 35,
    tp: 105.0,
    mrp: 114.0,
  },
  {
    article: "5115640",
    name: "Gocool Fresh Moisturizing 40",
    unit: "Pcs",
    openingStock: 10,
    purchaseQty: 50,
    salesReturnQty: 1,
    receiveAdjustment: 0,
    availableStock: 52,
    saleQty: 9,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 52,
    tp: 68.0,
    mrp: 100.0,
  },
  {
    article: "5115620",
    name: "Huggies Wonder Pants S 44",
    unit: "Pcs",
    openingStock: 5,
    purchaseQty: 60,
    salesReturnQty: 0,
    receiveAdjustment: 0,
    availableStock: 48,
    saleQty: 17,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 48,
    tp: 111.0,
    mrp: 115.0,
  },
  {
    article: "5115634",
    name: "Huggies Dry Pants M 34 (Q1)",
    unit: "Pcs",
    openingStock: 0,
    purchaseQty: 30,
    salesReturnQty: 0,
    receiveAdjustment: 0,
    availableStock: 22,
    saleQty: 8,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 22,
    tp: 113.0,
    mrp: 118.0,
  },
  {
    article: "5014301",
    name: "Tetley Green Tea Bag - Lemon 2",
    unit: "Pcs",
    openingStock: 15,
    purchaseQty: 80,
    salesReturnQty: 2,
    receiveAdjustment: 0,
    availableStock: 74,
    saleQty: 23,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 74,
    tp: 123.0,
    mrp: 128.0,
  },
  {
    article: "5014303",
    name: "Tetley Green Tea Bag - Premium",
    unit: "Pcs",
    openingStock: 8,
    purchaseQty: 50,
    salesReturnQty: 0,
    receiveAdjustment: 0,
    availableStock: 42,
    saleQty: 16,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 42,
    tp: 124.0,
    mrp: 129.0,
  },
  {
    article: "5110874",
    name: "Cocomo Fabric Wash (Refill) 1L",
    unit: "Pcs",
    openingStock: 0,
    purchaseQty: 30,
    salesReturnQty: 0,
    receiveAdjustment: 0,
    availableStock: 25,
    saleQty: 5,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 25,
    tp: 85.0,
    mrp: 90.0,
  },
  {
    article: "5110654",
    name: "Cocomo Gentle Kids Body Wash",
    unit: "Pcs",
    openingStock: 12,
    purchaseQty: 40,
    salesReturnQty: 0,
    receiveAdjustment: 0,
    availableStock: 38,
    saleQty: 14,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 38,
    tp: 80.0,
    mrp: 110.0,
  },
  {
    article: "5014504",
    name: "Dettol 250ml Pump Bottle",
    unit: "Pcs",
    openingStock: 20,
    purchaseQty: 100,
    salesReturnQty: 1,
    receiveAdjustment: 0,
    availableStock: 86,
    saleQty: 35,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 86,
    tp: 92.0,
    mrp: 97.0,
  },
  {
    article: "5014190",
    name: "Complan Creamy Classic 1KG",
    unit: "Box",
    openingStock: 6,
    purchaseQty: 25,
    salesReturnQty: 0,
    receiveAdjustment: 0,
    availableStock: 21,
    saleQty: 10,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 21,
    tp: 120.0,
    mrp: 125.0,
  },
  {
    article: "5110977",
    name: "Pendo Happy Nappy Pants Mini",
    unit: "Pcs",
    openingStock: 0,
    purchaseQty: 40,
    salesReturnQty: 0,
    receiveAdjustment: 0,
    availableStock: 31,
    saleQty: 9,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 31,
    tp: 50.0,
    mrp: 55.0,
  },
  {
    article: "5014550",
    name: "Harpic Power Plus Rose 1L",
    unit: "Pcs",
    openingStock: 14,
    purchaseQty: 60,
    salesReturnQty: 0,
    receiveAdjustment: 0,
    availableStock: 54,
    saleQty: 20,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 54,
    tp: 124.0,
    mrp: 132.0,
  },
  {
    article: "5014389",
    name: "Lizol 500ml Pine Floor Cleaner",
    unit: "Pcs",
    openingStock: 8,
    purchaseQty: 45,
    salesReturnQty: 0,
    receiveAdjustment: 0,
    availableStock: 39,
    saleQty: 14,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 39,
    tp: 115.0,
    mrp: 120.0,
  },
  {
    article: "5110978",
    name: "Pendo Happy Nappy Pants Small",
    unit: "Pcs",
    openingStock: 0,
    purchaseQty: 35,
    salesReturnQty: 0,
    receiveAdjustment: 0,
    availableStock: 28,
    saleQty: 7,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 28,
    tp: 151.0,
    mrp: 159.0,
  },
  {
    article: "5011784",
    name: "Vim Dishwash Liquid 250ml",
    unit: "Pcs",
    openingStock: 25,
    purchaseQty: 120,
    salesReturnQty: 0,
    receiveAdjustment: 0,
    availableStock: 95,
    saleQty: 50,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 95,
    tp: 85.0,
    mrp: 90.0,
  },
  {
    article: "5010059",
    name: "ISPAHANI MIRZAPORE TEA 400G",
    unit: "Pack",
    openingStock: 10,
    purchaseQty: 80,
    salesReturnQty: 0,
    receiveAdjustment: 0,
    availableStock: 68,
    saleQty: 22,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 68,
    tp: 120.0,
    mrp: 125.0,
  },
  {
    article: "5010101",
    name: "Pran Orange Drink 250ml Can",
    unit: "Can",
    openingStock: 50,
    purchaseQty: 200,
    salesReturnQty: 0,
    receiveAdjustment: 0,
    availableStock: 165,
    saleQty: 85,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 165,
    tp: 27.0,
    mrp: 30.0,
  },
  {
    article: "5014500",
    name: "Mojo Cola Magic 250ml Can",
    unit: "Can",
    openingStock: 40,
    purchaseQty: 240,
    salesReturnQty: 0,
    receiveAdjustment: 0,
    availableStock: 180,
    saleQty: 100,
    rtvQty: 0,
    tpnQty: 0,
    damageQty: 0,
    issueAdjustment: 0,
    closingStock: 180,
    tp: 25.0,
    mrp: 30.0,
  },
];

export default function InventoryPage() {
  const catalogProducts = useSelector((s) => s.products.items);
  const [warehouse, setWarehouse] = useState("All Warehouse");
  const [activeTab, setActiveTab] = useState("inventory"); // "inventory" | "details" | "summary" | "ledger"
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Combine demo items with any newly created store catalog items
  const allItems = useMemo(() => {
    const combined = [...INITIAL_INVENTORY_ITEMS];
    if (catalogProducts && catalogProducts.length > 0) {
      catalogProducts.forEach((p) => {
        if (!combined.some((item) => item.article === p.sku)) {
          combined.push({
            article: p.sku || `ART-${p.id}`,
            name: p.name + (p.variant ? ` (${p.variant})` : ""),
            unit: "Pcs",
            openingStock: 5,
            purchaseQty: 20,
            salesReturnQty: 0,
            receiveAdjustment: 0,
            availableStock: p.serials ? p.serials.filter((s) => s.status === "in_stock").length : 15,
            saleQty: p.serials ? p.serials.filter((s) => s.status === "sold").length : 5,
            rtvQty: 0,
            tpnQty: 0,
            damageQty: p.serials ? p.serials.filter((s) => s.status === "damage").length : 0,
            issueAdjustment: 0,
            closingStock: p.serials ? p.serials.filter((s) => s.status === "in_stock").length : 15,
            tp: Number(p.costPrice) || 25000,
            mrp: Number(p.sellPrice) || 32000,
          });
        }
      });
    }
    return combined;
  }, [catalogProducts]);

  const filteredItems = useMemo(() => {
    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.article.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allItems, searchQuery]);

  const totalPages = Math.ceil(filteredItems.length / rowsPerPage) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-[1700px] mx-auto select-none">
      {/* ━━ Top Status Header Bar (Matching Screenshot Header) ━━ */}
      <div className="flex flex-wrap items-center justify-end gap-4 pb-2 border-b border-slate-200">

        {/* Right Corner Badges (Matching Screenshot 2) */}
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Wifi size={14} className="stroke-[2.5]" />
            <span className="font-semibold text-[11px]">Online</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <Store size={14} className="text-slate-400" />
            <span className="text-slate-700 font-semibold">Hasib Mart</span>
            <span className="text-slate-400 font-normal">Aamar ID: <strong className="text-slate-700">427671</strong></span>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 cursor-pointer">
            <span className="text-sm">🇬🇧</span>
            <span className="font-semibold text-slate-700 text-[11px]">English</span>
            <ChevronDown size={12} className="text-slate-400" />
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            title="Registers"
          >
            <Receipt size={15} />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-300">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ━━ Sub-Module Navigation Quick Bar (Inventory, Adjust, Movement, Stock Ledger) ━━ */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1 md:gap-2">
          <span className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider hidden sm:inline">
            Modules:
          </span>
          <Link
            href="/inventory"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#64BD0B] text-white shadow-sm transition-all"
          >
            <Boxes size={14} /> Inventories
          </Link>
          <Link
            href="/inventory/adjust"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            <ArrowUpDown size={14} /> Adjust
          </Link>
          <Link
            href="/inventory/movement"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            <ArrowRightLeft size={14} /> Movement
          </Link>
          <Link
            href="/inventory/ledger"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            <FileSpreadsheet size={14} /> Stock Ledger
          </Link>
        </div>

        {/* Search filter input toggle */}
        <div className="relative flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product / article code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-[#64BD0B] outline-none text-slate-700 w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 size={16} className="text-emerald-600" />
          Inventory data spreadsheet export initiated successfully!
        </div>
      )}

      {/* ━━ Top Control Bar (Matching Screenshot 2 exact elements) ━━ */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        {/* Left: Download Inventory Data & Warehouse Dropdown */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1A1A1A] hover:bg-black rounded-lg shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Download size={13} /> Download Inventory Data
          </button>

          <div className="relative">
            <select
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
              className="px-3.5 py-2 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700 outline-none pr-8 cursor-pointer hover:border-slate-400 focus:border-[#64BD0B]"
            >
              <option value="All Warehouse">All Warehouse</option>
              <option value="Dhanmondi Branch">Dhanmondi Store Hub</option>
              <option value="Gulshan Central">Gulshan Central Warehouse</option>
              <option value="Uttara Depot">Uttara Distribution Hub</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Right: Tabs & Export Button (Matching Screenshot 2 exact layout) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Tabs: Inventory, Inventory Details, Inventory Summary, Stock Ledger */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("inventory")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === "inventory"
                  ? "bg-white text-rose-600 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeTab === "inventory" ? "bg-rose-500" : "bg-slate-300"}`} />
              Inventory
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === "details"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Inventory Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === "summary"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Inventory Summary
            </button>
            <Link
              href="/inventory/ledger"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 transition-all"
            >
              Stock Ledger
            </Link>
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-white bg-[#1A1A1A] hover:bg-black rounded-lg shadow-2xs transition-all"
          >
            Export <ChevronDown size={12} />
          </button>

          {/* Table quick controls: reload, columns */}
          <div className="flex items-center gap-1 text-slate-500">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              title="Reset Filters"
              className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            >
              <RotateCw size={14} />
            </button>
            <button
              type="button"
              title="Filter Options"
              className="p-1.5 rounded hover:bg-slate-100 transition-colors"
            >
              <SlidersHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ━━ The Detailed Inventory Table (Exact Screenshot 2 Columns) ━━ */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[11.5px] whitespace-nowrap">
            <thead className="bg-[#FAFAFA] border-b border-slate-200 text-slate-500 font-semibold text-[10.5px]">
              <tr>
                <th className="py-2.5 px-3 border-r border-slate-200">Article ...</th>
                <th className="py-2.5 px-3 border-r border-slate-200 min-w-[190px]">Name</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200 text-center">Unit</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200 text-right">Opening Stock</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200 text-right">Purchase Qty (R...</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200 text-right">Sales Return Qty</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200 text-right">Receive Adjustm...</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200 text-right font-bold text-slate-800 bg-slate-100/60">
                  Available Stock
                </th>
                <th className="py-2.5 px-2.5 border-r border-slate-200 text-right">Sale Qty</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200 text-right">RTV Qty</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200 text-right">TPN Qty</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200 text-right">Damage Qty</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200 text-right">Issue Adjustment</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200 text-right font-semibold text-slate-700">
                  Closing Stock
                </th>
                <th className="py-2.5 px-2.5 border-r border-slate-200 text-right">TP</th>
                <th className="py-2.5 px-2.5 border-r border-slate-200 text-right">MRP</th>
                <th className="py-2.5 px-3 text-right font-bold text-slate-800">Stock Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={17} className="py-8 text-center text-slate-400 font-sans">
                    No products found matching &ldquo;{searchQuery}&rdquo;.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item, idx) => {
                  const stockValue = item.closingStock * item.tp;
                  return (
                    <tr
                      key={item.article + idx}
                      className="hover:bg-slate-50/70 transition-colors font-sans"
                    >
                      <td className="py-2 px-3 border-r border-slate-100 font-mono text-slate-800 font-medium">
                        {item.article}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-100 font-medium text-slate-900 truncate max-w-[220px]" title={item.name}>
                        {item.name}
                      </td>
                      <td className="py-2 px-2.5 border-r border-slate-100 text-center font-mono text-slate-500 text-[10.5px]">
                        {item.unit}
                      </td>
                      <td className="py-2 px-2.5 border-r border-slate-100 text-right font-mono text-slate-500">
                        {item.openingStock.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 border-r border-slate-100 text-right font-mono text-slate-600">
                        {item.purchaseQty.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 border-r border-slate-100 text-right font-mono text-slate-500">
                        {item.salesReturnQty.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 border-r border-slate-100 text-right font-mono text-slate-500">
                        {item.receiveAdjustment.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 border-r border-slate-100 text-right font-mono font-bold text-slate-900 bg-slate-50/60">
                        {item.availableStock.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 border-r border-slate-100 text-right font-mono text-slate-600">
                        {item.saleQty.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 border-r border-slate-100 text-right font-mono text-slate-500">
                        {item.rtvQty.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 border-r border-slate-100 text-right font-mono text-slate-500">
                        {item.tpnQty.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 border-r border-slate-100 text-right font-mono text-rose-500">
                        {item.damageQty.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 border-r border-slate-100 text-right font-mono text-slate-500">
                        {item.issueAdjustment.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 border-r border-slate-100 text-right font-mono font-semibold text-slate-800">
                        {item.closingStock.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 border-r border-slate-100 text-right font-mono text-slate-600">
                        {item.tp.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 border-r border-slate-100 text-right font-mono text-slate-600">
                        {item.mrp.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                        {stockValue.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ━━ Pagination Bar (Matching Screenshot 2 Footer) ━━ */}
        <div className="flex flex-wrap items-center justify-end gap-5 px-4 py-2.5 bg-white border-t border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-slate-200 rounded px-2 py-1 text-xs outline-none bg-white cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="font-mono text-slate-700">
            {filteredItems.length === 0
              ? "0 of 0"
              : `${(currentPage - 1) * rowsPerPage + 1} - ${Math.min(
                  currentPage * rowsPerPage,
                  filteredItems.length
                )} of ${filteredItems.length}`}
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
