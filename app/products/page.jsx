"use client";

import { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, ChevronDown, ShieldCheck, Search, Filter, Package, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { resetToDemo } from "@/store/slices/productsSlice";
import Badge from "@/components/Badge";
import { money } from "@/lib/format";
import clsx from "clsx";
import AddProductForm from "@/components/AddProductForm";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector((s) => s.products.items) || [];
  const [activeTab, setActiveTab] = useState("create"); // "create" or "list"
  const [expanded, setExpanded] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (products.length < 20 || products.some((p) => !p.image || !p.image.startsWith("http"))) {
      dispatch(resetToDemo());
    }
  }, [products, dispatch]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "all" || p.categoryId === selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto">

      {/* Tab 1: Add New Product Form matching screenshot */}
      {activeTab === "create" && (
        <AddProductForm
          onBack={() => setActiveTab("list")}
          onSuccess={() => {
            // Can stay on page or user can click View in List
          }}
        />
      )}

      {/* Tab 2: All Products Catalog Table */}
      {activeTab === "list" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by name, SKU, barcode, brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-[13px] border border-slate-200 rounded-lg focus:outline-none focus:border-[#64BD0B] focus:ring-1 focus:ring-[#64BD0B]"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("create")}
                className="bg-[#64BD0B] hover:bg-[#529E08] text-white text-[13px] font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={15} /> Add Product
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/80 border-b border-slate-200">
                    <th className="px-5 py-3 font-semibold">Product</th>
                    <th className="px-5 py-3 font-semibold">SKU / Barcode</th>
                    <th className="px-5 py-3 font-semibold">Warranty</th>
                    <th className="px-5 py-3 font-semibold text-right">Cost (TP)</th>
                    <th className="px-5 py-3 font-semibold text-right">Sell Price (MRP)</th>
                    <th className="px-5 py-3 font-semibold text-center">In Stock</th>
                    <th className="px-5 py-3 font-semibold text-center">Status</th>
                    <th className="px-5 py-3 font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                        No products found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const inStock = p.serials ? p.serials.filter((s) => s.status === "in_stock").length : 10;
                      const open = expanded === p.id;
                      return (
                        <Fragment key={p.id}>
                          <tr
                            onClick={() => setExpanded(open ? null : p.id)}
                            className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                          >
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                                  {typeof p.image === "string" && (p.image.startsWith("http") || p.image.startsWith("/")) ? (
                                    <img
                                      src={p.image}
                                      alt={p.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    />
                                  ) : (
                                    <span className="text-base">{p.image || "📦"}</span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-800">{p.name}</p>
                                  <p className="text-[11.5px] text-slate-500">
                                    {p.brand || "Brand"} · {p.variant || p.productType || "Standard"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3 font-mono text-[12px] text-slate-600">
                              <span className="font-medium text-slate-800">{p.sku || p.articleCode || "—"}</span>
                              <br />
                              <span className="text-slate-400 text-[11px]">{p.barcode || p.eanCode || "—"}</span>
                            </td>
                            <td className="px-5 py-3">
                              <Badge tone="sky">{p.warrantyLabel || (p.warrantyMonths ? `${p.warrantyMonths} Mos` : "No Warranty")}</Badge>
                            </td>
                            <td className="px-5 py-3 text-right font-mono text-slate-600">{money(p.costPrice || 0)}</td>
                            <td className="px-5 py-3 text-right font-mono font-bold text-slate-900">{money(p.sellPrice || 0)}</td>
                            <td className="px-5 py-3 text-center">
                              <Badge tone={inStock === 0 ? "bad" : inStock <= 2 ? "warn" : "good"}>{inStock}</Badge>
                            </td>
                            <td className="px-5 py-3 text-center">
                              <span className={clsx(
                                "inline-block px-2 py-0.5 rounded text-[11px] font-semibold",
                                p.status === "Inactive" ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              )}>
                                {p.status || "Active"}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <ChevronDown
                                size={15}
                                className={clsx("text-slate-400 transition-transform ml-auto", open && "rotate-180")}
                              />
                            </td>
                          </tr>
                          {open && (
                            <tr className="bg-slate-50/60 border-t border-slate-100">
                              <td colSpan={8} className="px-6 py-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mb-3 pb-3 border-b border-slate-200">
                                  <div>
                                    <span className="text-slate-400 block mb-0.5">Category & Group</span>
                                    <span className="font-medium text-slate-700">{p.category || "—"} / {p.group || "General"}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block mb-0.5">VAT & Method</span>
                                    <span className="font-medium text-slate-700">{p.vat || 0}% ({p.vatMethod || "Include"})</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block mb-0.5">Manufacturing Date</span>
                                    <span className="font-medium text-slate-700">{p.mfgDate || "—"}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block mb-0.5">Expiry Date (EXP)</span>
                                    <span className="font-medium text-rose-600 font-semibold">{p.expDate || "—"}</span>
                                  </div>
                                </div>

                                {p.serials && p.serials.length > 0 && (
                                  <div>
                                    <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-2">
                                      Serial / IMEI Tracking ({p.serials.length})
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {p.serials.map((s) => (
                                        <div
                                          key={s.imei}
                                          className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs"
                                        >
                                          <span className="font-mono text-[12px] text-slate-800">{s.imei}</span>
                                          <span className="text-[11px] text-slate-400">· {s.branch}</span>
                                          <Badge
                                            tone={s.status === "in_stock" ? "good" : s.status === "sold" ? "neutral" : "bad"}
                                          >
                                            {s.status.replace("_", " ")}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
