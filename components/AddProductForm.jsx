"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "@/store/slices/productsSlice";
import { CheckCircle2, Sparkles, RefreshCw, Barcode as BarcodeIcon, ShieldCheck, Calendar, ArrowRight, ArrowLeft } from "lucide-react";

const GROUPS = [
  "General Goods",
  "IMEI Serialized Flagships",
  "Standard Serialized Devices",
  "Non-Serialized Fast Moving Goods",
  "Bulky & High Weight Appliances",
  "Beverages & Food Items",
  "Electronics & Accessories",
  "Cosmetics & Toiletries",
  "Pharmacy & Health",
];

const CATEGORIES = [
  "Smartphones & Tablets",
  "Laptops & Computing",
  "Wearables & Smartwatches",
  "Audio & Accessories",
  "Home Appliances & AC",
  "Groceries & Provisions",
  "Beverages & Snacks",
  "Personal Care & Hygiene",
];

const BRANDS = [
  "Apple",
  "Samsung",
  "Sony",
  "Walton",
  "LG Electronics",
  "Xiaomi",
  "Asus",
  "Anker",
  "Coca-Cola",
  "Nestle",
  "Unilever",
  "Square",
  "Pran",
  "Apex",
  "Bata",
];

const SUB_CATEGORIES = [
  "5G Flagship Phones",
  "Budget & Entry Android",
  "Gaming Ultrabooks",
  "Business MacBooks & Thin Laptops",
  "Inverter Split Air Conditioners",
  "4K UHD Smart Televisions",
  "TWS Wireless Earbuds",
  "Fast Charging & GaN Adapters",
  "Soft Drinks & Carbonated Beverages",
  "Packaged Snacks & Biscuits",
  "Dairy & Milk Products",
];

const UNITS = [
  "Pcs",
  "Box",
  "Ctn",
  "Kg",
  "Gm",
  "Ltr",
  "Ml",
  "Pack",
  "Dozen",
  "Pair",
  "Set",
];

const WARRANTY_PERIODS = [
  { label: "No Warranty", months: 0 },
  { label: "7 Days Replacement", months: 0.25 },
  { label: "1 Month", months: 1 },
  { label: "3 Months", months: 3 },
  { label: "6 Months", months: 6 },
  { label: "1 Year (12 Months)", months: 12 },
  { label: "2 Years (24 Months)", months: 24 },
  { label: "3 Years (36 Months)", months: 36 },
  { label: "5 Years", months: 60 },
  { label: "10 Years (Compressor / Motor)", months: 120 },
  { label: "Lifetime Warranty", months: 999 },
];

export default function AddProductForm({ onSuccess, onCancel, onBack }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/products");
    }
  };
  const existingCategories = useSelector((s) => s.products.categories) || [];
  const existingBrands = useSelector((s) => s.products.brands) || [];

  const todayStr = new Date().toISOString().split("T")[0];
  const nextMonthStr = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];
  const nextYearStr = new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0];

  const [form, setForm] = useState({
    group: "",
    category: "",
    eanCode: "",
    productType: "Standard",
    name: "",
    articleCode: "",
    brand: "",
    subCategory: "",
    slug: "",
    productUnit: "",
    alertQuantity: "",
    weightScale: "Inactive",
    vat: "",
    vatMethod: "Include",
    status: "Active",
    promotionalPrice: "",
    promotionStart: todayStr,
    promotionEnd: todayStr,
    // Explicit additions: Warranty, Dates, Pricing
    costPrice: "",
    sellPrice: "",
    openingStock: "10",
    warrantyPeriod: "1 Year (12 Months)",
    warrantyPolicy: "Official Brand Warranty",
    mfgDate: todayStr,
    expDate: nextYearStr,
  });

  const [autoSlug, setAutoSlug] = useState(true);
  const [successMsg, setSuccessMsg] = useState(null);

  // Auto-generate slug when name changes
  const handleNameChange = (val) => {
    const slugified = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setForm((prev) => ({
      ...prev,
      name: val,
      slug: autoSlug ? slugified : prev.slug,
    }));
  };

  const generateEan = () => {
    const prefix = "890";
    const rand = Math.floor(100000000 + Math.random() * 900000000);
    setForm((prev) => ({ ...prev, eanCode: `${prefix}${rand}` }));
  };

  const generateArticleCode = () => {
    const code = "ART-" + Math.floor(100000 + Math.random() * 900000);
    setForm((prev) => ({ ...prev, articleCode: code }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Please enter product name");
      return;
    }

    const selectedWarranty = WARRANTY_PERIODS.find((w) => w.label === form.warrantyPeriod);
    const warrantyMonths = selectedWarranty ? selectedWarranty.months : 12;

    const newProduct = {
      name: form.name.trim(),
      group: form.group || "General Goods",
      category: form.category || "General",
      brand: form.brand || "Generic",
      subCategory: form.subCategory || "",
      variant: form.productType || "Standard",
      sku: form.articleCode || form.eanCode || `SKU-${Date.now().toString().slice(-6)}`,
      barcode: form.eanCode || form.articleCode || `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
      articleCode: form.articleCode,
      eanCode: form.eanCode,
      slug: form.slug,
      productUnit: form.productUnit || "Pcs",
      productType: form.productType,
      alertQuantity: Number(form.alertQuantity) || 5,
      weightScale: form.weightScale,
      vat: Number(form.vat) || 0,
      vatMethod: form.vatMethod,
      status: form.status,
      promotionalPrice: form.promotionalPrice ? Number(form.promotionalPrice) : null,
      promotionStart: form.promotionStart,
      promotionEnd: form.promotionEnd,
      costPrice: Number(form.costPrice) || 0,
      sellPrice: Number(form.sellPrice) || 0,
      warrantyMonths: warrantyMonths,
      warrantyLabel: form.warrantyPeriod,
      warrantyPolicy: form.warrantyPolicy,
      mfgDate: form.mfgDate,
      expDate: form.expDate,
      trackSerial: form.productType === "Serialized" || form.group.toLowerCase().includes("serialized"),
      image: "📦",
    };

    dispatch(addProduct(newProduct));
    setSuccessMsg(`"${form.name}" has been successfully added to products!`);

    if (onSuccess) {
      onSuccess(newProduct);
    }
  };

  const handleReset = () => {
    setForm({
      group: "",
      category: "",
      eanCode: "",
      productType: "Standard",
      name: "",
      articleCode: "",
      brand: "",
      subCategory: "",
      slug: "",
      productUnit: "",
      alertQuantity: "",
      weightScale: "Inactive",
      vat: "",
      vatMethod: "Include",
      status: "Active",
      promotionalPrice: "",
      promotionStart: todayStr,
      promotionEnd: todayStr,
      costPrice: "",
      sellPrice: "",
      openingStock: "10",
      warrantyPeriod: "1 Year (12 Months)",
      warrantyPolicy: "Official Brand Warranty",
      mfgDate: todayStr,
      expDate: nextYearStr,
    });
    setSuccessMsg(null);
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200/90 overflow-hidden">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleBack}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer active:scale-95 shadow-2xs"
            title="Back to Products List"
            aria-label="Back to Products List"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-[17px] font-semibold text-slate-800">Add New Product</h1>
        </div>
        {successMsg && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 size={14} className="text-emerald-600" />
              {successMsg}
            </span>
            <button
              type="button"
              onClick={handleBack}
              className="text-xs font-semibold text-[#529E08] hover:underline flex items-center gap-1 px-2 py-1"
            >
              View in List <ArrowRight size={12} />
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Row 1: Group, Category, EAN Code, Product Type */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Group</label>
            <div className="relative">
              <select
                value={form.group}
                onChange={(e) => setForm({ ...form, group: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select Group</option>
                {GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Category</label>
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select Category...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12.5px] font-medium text-slate-700">EAN Code</label>
              <button
                type="button"
                onClick={generateEan}
                className="text-[11px] text-[#529E08] hover:underline font-medium"
              >
                Generate
              </button>
            </div>
            <input
              type="text"
              placeholder="EAN CODE"
              value={form.eanCode}
              onChange={(e) => setForm({ ...form, eanCode: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Product Type</label>
            <div className="relative">
              <select
                value={form.productType}
                onChange={(e) => setForm({ ...form, productType: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors appearance-none cursor-pointer"
              >
                <option value="Standard">Standard</option>
                <option value="Variable">Variable</option>
                <option value="Combo">Combo / Pack</option>
                <option value="Service">Service</option>
                <option value="Serialized">Serialized (IMEI)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Product Name (Wide) & Article Code */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Product Name *</label>
            <input
              type="text"
              required
              placeholder="Product name"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors"
            />
          </div>

          <div className="md:col-span-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12.5px] font-medium text-slate-700">Article Code</label>
              <button
                type="button"
                onClick={generateArticleCode}
                className="text-[11px] text-[#529E08] hover:underline font-medium"
              >
                Generate
              </button>
            </div>
            <input
              type="text"
              placeholder="Article Code"
              value={form.articleCode}
              onChange={(e) => setForm({ ...form, articleCode: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors"
            />
          </div>
        </div>

        {/* Row 3: Brand, Sub Category, Slug */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Brand</label>
            <div className="relative">
              <select
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select...</option>
                {BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Sub Category</label>
            <div className="relative">
              <select
                value={form.subCategory}
                onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select Sub Category...</option>
                {SUB_CATEGORIES.map((sc) => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Slug</label>
            <input
              type="text"
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => {
                setAutoSlug(false);
                setForm({ ...form, slug: e.target.value });
              }}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors"
            />
          </div>
        </div>

        {/* Row 4: Product Unit, Alert Quantity, Weight Scale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Product Unit</label>
            <div className="relative">
              <select
                value={form.productUnit}
                onChange={(e) => setForm({ ...form, productUnit: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select...</option>
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Alert Quantity</label>
            <input
              type="number"
              min="0"
              placeholder="Alert Quantity"
              value={form.alertQuantity}
              onChange={(e) => setForm({ ...form, alertQuantity: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Weight Scale</label>
            <div className="relative">
              <select
                value={form.weightScale}
                onChange={(e) => setForm({ ...form, weightScale: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors appearance-none cursor-pointer"
              >
                <option value="Inactive">Inactive</option>
                <option value="Active">Active</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Row 5: VAT, Vat Method, Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">VAT</label>
            <div className="flex h-10 rounded-md border border-slate-300 bg-white focus-within:border-[#64BD0B] focus-within:ring-1 focus-within:ring-[#64BD0B] overflow-hidden transition-colors">
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="VAT"
                value={form.vat}
                onChange={(e) => setForm({ ...form, vat: e.target.value })}
                className="flex-1 px-3 text-[13px] text-slate-800 placeholder-slate-400 border-0 focus:outline-none"
              />
              <span className="inline-flex items-center justify-center px-3.5 bg-slate-50 border-l border-slate-200 text-slate-500 text-[13px] font-medium">
                %
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Vat Method</label>
            <div className="relative">
              <select
                value={form.vatMethod}
                onChange={(e) => setForm({ ...form, vatMethod: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors appearance-none cursor-pointer"
              >
                <option value="Include">Include</option>
                <option value="Exclude">Exclude</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Status</label>
            <div className="relative">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors appearance-none cursor-pointer"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Row 6: Promotional Price, Promotion Start, Promotion End */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Promotional Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Promotional Price"
              value={form.promotionalPrice}
              onChange={(e) => setForm({ ...form, promotionalPrice: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Promotion Start</label>
            <input
              type="date"
              value={form.promotionStart}
              onChange={(e) => setForm({ ...form, promotionStart: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Promotion End</label>
            <input
              type="date"
              value={form.promotionEnd}
              onChange={(e) => setForm({ ...form, promotionEnd: e.target.value })}
              className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors"
            />
          </div>
        </div>

        {/* Row 7: Pricing & Stock (Essential for POS) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">TP (৳)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.costPrice}
                onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5"> MRP (৳) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.sellPrice}
                onChange={(e) => setForm({ ...form, sellPrice: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Opening Stock Quantity</label>
              <input
                type="number"
                min="0"
                placeholder="10"
                value={form.openingStock}
                onChange={(e) => setForm({ ...form, openingStock: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Row 8: Explicit Additions (Warranty and Dates - Manufacturing & Expiry Date) */}
        <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-200/80">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={16} className="text-[#64BD0B]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Warranty & Dates (MFG / EXP)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Warranty Period</label>
              <div className="relative">
                <select
                  value={form.warrantyPeriod}
                  onChange={(e) => setForm({ ...form, warrantyPeriod: e.target.value })}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors appearance-none cursor-pointer"
                >
                  {WARRANTY_PERIODS.map((wp) => (
                    <option key={wp.label} value={wp.label}>{wp.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Warranty Policy</label>
              <div className="relative">
                <select
                  value={form.warrantyPolicy}
                  onChange={(e) => setForm({ ...form, warrantyPolicy: e.target.value })}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors appearance-none cursor-pointer"
                >
                  <option value="Official Brand Warranty">Official Brand Warranty</option>
                  <option value="Store Service Warranty">Store Service Warranty</option>
                  <option value="Replacement Guarantee">Replacement Guarantee</option>
                  <option value="Parts & Labor Warranty">Parts & Labor Warranty</option>
                  <option value="No Warranty">No Warranty</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Manufacturing Date (MFG)</label>
              <input
                type="date"
                value={form.mfgDate}
                onChange={(e) => setForm({ ...form, mfgDate: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-medium text-slate-700 mb-1.5">Expiry Date (EXP / Date of Date)</label>
              <input
                type="date"
                value={form.expDate}
                onChange={(e) => setForm({ ...form, expDate: e.target.value })}
                className="w-full h-10 px-3 bg-white border border-slate-300 rounded-md text-[13px] text-slate-800 focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions: Add Product button exactly matching screenshot */}
        <div className="pt-3 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="bg-[#1A1A1A] hover:bg-black text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            Add Product
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-100 border border-slate-300 transition-colors"
          >
            Reset Form
          </button>
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2.5 rounded-lg text-[13px] font-medium text-slate-600 hover:bg-slate-100 border border-slate-300 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> Back to Products List
          </button>
        </div>
      </form>
    </div>
  );
}
