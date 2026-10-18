"use client";

import { useState, useMemo } from "react";
import {
  BadgePercent,
  Plus,
  Tag,
  Gift,
  Megaphone,
  Layers2,
  Calendar,
  CheckCircle2,
  Trash2,
  Sparkles,
  SlidersHorizontal,
  TrendingUp,
  Percent,
  Award,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import CursorPagination from "@/components/CursorPagination";
import { money } from "@/lib/format";
import mockData from "@/data/mockData.json";

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState("rules"); // "rules" | "coupons" | "loyalty"

  // Data from mockData
  const [promotions, setPromotions] = useState(mockData.promotions || []);
  const [coupons, setCoupons] = useState(mockData.coupons || []);
  const [loyalty, setLoyalty] = useState(
    mockData.loyaltySettings || {
      earningRate: 1,
      redemptionRate: 100,
      minRedemptionThreshold: 100,
      maxInvoiceRedemptionPercentage: 30,
    }
  );

  const [successMsg, setSuccessMsg] = useState("");

  // Pagination states
  const [promoPage, setPromoPage] = useState(1);
  const [promoPageSize, setPromoPageSize] = useState(5);
  const [couponPage, setCouponPage] = useState(1);
  const [couponPageSize, setCouponPageSize] = useState(5);

  // New Promotion Form State
  const [newPromo, setNewPromo] = useState({
    title: "",
    type: "BOGO",
    buyProductId: "p-001",
    buyQty: 2,
    getProductId: "p-005",
    getQty: 1,
    discountPercent: 100,
    minimumInvoiceAmount: 5000,
    startDate: "2026-10-01",
    endDate: "2026-10-31",
  });

  // New Coupon Form State
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountAmount: 500,
    minPurchase: 5000,
    maxUses: 100,
  });

  const handleCreatePromo = (e) => {
    e.preventDefault();
    if (!newPromo.title.trim()) return;

    const promo = {
      id: `PRM-${Math.floor(100 + Math.random() * 900)}`,
      title: newPromo.title,
      type: newPromo.type,
      startDate: newPromo.startDate,
      endDate: newPromo.endDate,
      conditions: {
        buyProductId: newPromo.buyProductId,
        buyQty: Number(newPromo.buyQty) || 1,
        getProductId: newPromo.getProductId,
        getQty: Number(newPromo.getQty) || 1,
        discountPercent: Number(newPromo.discountPercent) || 100,
        minimumInvoiceAmount: Number(newPromo.minimumInvoiceAmount) || 0,
      },
      isActive: true,
    };

    setPromotions([promo, ...promotions]);
    setSuccessMsg(`Promotion "${promo.title}" deployed to POS terminals!`);
    setTimeout(() => setSuccessMsg(""), 4000);
    setNewPromo({
      title: "",
      type: "BOGO",
      buyProductId: "p-001",
      buyQty: 2,
      getProductId: "p-005",
      getQty: 1,
      discountPercent: 100,
      minimumInvoiceAmount: 5000,
      startDate: "2026-10-01",
      endDate: "2026-10-31",
    });
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;

    const coupon = {
      code: newCoupon.code.toUpperCase().trim(),
      discountAmount: Number(newCoupon.discountAmount) || 0,
      minPurchase: Number(newCoupon.minPurchase) || 0,
      maxUses: Number(newCoupon.maxUses) || 50,
      usedCount: 0,
      isActive: true,
    };

    setCoupons([coupon, ...coupons]);
    setSuccessMsg(`Coupon code "${coupon.code}" activated!`);
    setTimeout(() => setSuccessMsg(""), 4000);
    setNewCoupon({ code: "", discountAmount: 500, minPurchase: 5000, maxUses: 100 });
  };

  const togglePromoActive = (id) => {
    setPromotions(
      promotions.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const toggleCouponActive = (code) => {
    setCoupons(
      coupons.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const paginatedPromos = useMemo(() => {
    const start = (promoPage - 1) * promoPageSize;
    return promotions.slice(start, start + promoPageSize);
  }, [promotions, promoPage, promoPageSize]);

  const paginatedCoupons = useMemo(() => {
    const start = (couponPage - 1) * couponPageSize;
    return coupons.slice(start, start + couponPageSize);
  }, [coupons, couponPage, couponPageSize]);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto select-none">
      {/* ━━ Header & Mode Switcher ━━ */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BadgePercent size={24} className="text-[#64BD0B]" />
            Promotions, Coupons & Loyalty Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            BOGO Rules, Automated Line-Item Markdowns, Promotional Vouchers and Point Matrices
          </p>
        </div>

        {/* Tab Toggle (Matching Website Style) */}
        <div className="flex items-center gap-1.5 p-1 bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-xl shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("rules")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "rules"
                ? "bg-[#64BD0B] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles size={14} className="inline mr-1" />
            Promo Rules ({promotions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("coupons")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "coupons"
                ? "bg-[#64BD0B] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Tag size={14} className="inline mr-1" />
            Coupons ({coupons.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("loyalty")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "loyalty"
                ? "bg-[#64BD0B] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Gift size={14} className="inline mr-1" />
            Loyalty Matrix
          </button>
        </div>
      </div>

      {/* ━━ Stat Cards ━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Campaigns"
          value={promotions.filter((p) => p.isActive).length}
          trend={{ value: "Live on Terminals", positive: true }}
          icon={Megaphone}
          accent="emerald"
        />
        <StatCard
          label="Vouchers Issued"
          value={coupons.length}
          trend={{ value: "With Min Order Rules", positive: true }}
          icon={Tag}
          accent="blue"
        />
        <StatCard
          label="Total Redemptions"
          value="320 Uses"
          trend={{ value: "৳45,000 saved by customers", positive: true }}
          icon={Gift}
          accent="purple"
        />
        <StatCard
          label="Point Earning Rate"
          value="৳100 = 1 Pt"
          trend={{ value: "100 Pts = ৳100 discount", positive: true }}
          icon={Award}
          accent="amber"
        />
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-sm animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* TAB 1: PROMO RULES */}
      {activeTab === "rules" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Builder Form */}
          <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl p-5 rounded-2xl border border-white/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-[14px] flex items-center gap-2">
              <Plus size={16} className="text-[#3B7506]" />
              Create Promotional Campaign
            </h3>

            <form onSubmit={handleCreatePromo} className="space-y-3.5 text-[12.5px]">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={newPromo.title}
                  onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                  placeholder="e.g., Festival BOGO: Buy Galaxy S24 Get Earbuds Free"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Promotion Type</label>
                  <select
                    value={newPromo.type}
                    onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  >
                    <option value="BOGO">BOGO (Buy X Get Y)</option>
                    <option value="INVOICE_DISCOUNT">Invoice Flat / % Discount</option>
                    <option value="LINE_DISCOUNT">Line-item Discount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Min Subtotal (৳)</label>
                  <input
                    type="number"
                    value={newPromo.minimumInvoiceAmount}
                    onChange={(e) => setNewPromo({ ...newPromo, minimumInvoiceAmount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
              </div>

              {newPromo.type === "BOGO" && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <span className="text-[11.5px] font-bold text-[#3B7506] uppercase">BOGO Trigger & Reward</span>
                  <div className="grid grid-cols-2 gap-2 text-[12px]">
                    <div>
                      <span className="text-slate-600">Buy Qty:</span>
                      <input
                        type="number"
                        min={1}
                        value={newPromo.buyQty}
                        onChange={(e) => setNewPromo({ ...newPromo, buyQty: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-slate-600">Get Free Qty:</span>
                      <input
                        type="number"
                        min={1}
                        value={newPromo.getQty}
                        onChange={(e) => setNewPromo({ ...newPromo, getQty: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newPromo.startDate}
                    onChange={(e) => setNewPromo({ ...newPromo, startDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={newPromo.endDate}
                    onChange={(e) => setNewPromo({ ...newPromo, endDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold rounded-xl text-[13px] transition-all shadow-md shadow-[#64BD0B]/20"
              >
                Deploy Promotion
              </button>
            </form>
          </div>

          {/* Active Promos List */}
          <div className="lg:col-span-7 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-[14px]">Active Campaign Registry</h3>
            <div className="space-y-3">
              {paginatedPromos.map((p) => (
                <div
                  key={p.id}
                  className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-[13.5px]">{p.title}</span>
                      <Badge tone={p.isActive ? "good" : "default"} dot>
                        {p.isActive ? "ACTIVE" : "PAUSED"}
                      </Badge>
                      <span className="text-[11px] font-mono text-[#3B7506] px-2 py-0.5 bg-[#64BD0B]/10 rounded font-bold">
                        {p.type}
                      </span>
                    </div>
                    <div className="text-[12px] text-slate-500 font-mono">
                      Duration: {p.startDate} to {p.endDate}
                    </div>
                    {p.type === "BOGO" && (
                      <div className="text-[11.5px] text-slate-700 font-medium">
                        Trigger: Buy {p.conditions?.buyQty} item(s) ➔ Get {p.conditions?.getQty} free
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => togglePromoActive(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11.5px] font-bold border transition-colors ${
                      p.isActive
                        ? "border-amber-300 text-amber-700 hover:bg-amber-50 bg-white"
                        : "border-[#64BD0B] text-[#3B7506] hover:bg-[#64BD0B]/10 bg-white"
                    }`}
                  >
                    {p.isActive ? "Pause" : "Activate"}
                  </button>
                </div>
              ))}
            </div>

            <CursorPagination
              totalItems={promotions.length}
              pageSize={promoPageSize}
              onPageSizeChange={setPromoPageSize}
              currentPage={promoPage}
              onPageChange={setPromoPage}
            />
          </div>
        </div>
      )}

      {/* TAB 2: COUPONS */}
      {activeTab === "coupons" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-5 bg-white/80 backdrop-blur-xl p-5 rounded-2xl border border-white/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-[14px] flex items-center gap-2">
              <Tag size={16} className="text-[#3B7506]" />
              Generate Coupon Code
            </h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-[12.5px]">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                  placeholder="e.g. VIP2026, SUMMER1000"
                  className="w-full uppercase font-mono tracking-wider bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Discount (৳)</label>
                  <input
                    type="number"
                    required
                    value={newCoupon.discountAmount}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountAmount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Min Purchase (৳)</label>
                  <input
                    type="number"
                    value={newCoupon.minPurchase}
                    onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Maximum Usage Cap</label>
                <input
                  type="number"
                  value={newCoupon.maxUses}
                  onChange={(e) => setNewCoupon({ ...newCoupon, maxUses: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold rounded-xl text-[13px] transition-all shadow-md shadow-[#64BD0B]/20"
              >
                Save & Activate Coupon
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/90 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-[14px]">Active Coupon Ledger</h3>
            <div className="space-y-3">
              {paginatedCoupons.map((c) => (
                <div
                  key={c.code}
                  className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#3B7506] text-[15px] tracking-wider">
                        {c.code}
                      </span>
                      <Badge tone={c.isActive ? "good" : "default"} dot>
                        {c.isActive ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </div>
                    <div className="text-[12px] text-slate-700">
                      Discount: <strong className="text-slate-900">{money(c.discountAmount)}</strong> · Min Purchase: {money(c.minPurchase)}
                    </div>
                    <div className="text-[11.5px] text-slate-500 font-mono">
                      Redemptions: {c.usedCount} / {c.maxUses} uses
                    </div>
                  </div>

                  <button
                    onClick={() => toggleCouponActive(c.code)}
                    className={`px-3 py-1.5 rounded-lg text-[11.5px] font-bold border transition-colors ${
                      c.isActive
                        ? "border-amber-300 text-amber-700 hover:bg-amber-50 bg-white"
                        : "border-[#64BD0B] text-[#3B7506] hover:bg-[#64BD0B]/10 bg-white"
                    }`}
                  >
                    {c.isActive ? "Disable" : "Enable"}
                  </button>
                </div>
              ))}
            </div>

            <CursorPagination
              totalItems={coupons.length}
              pageSize={couponPageSize}
              onPageSizeChange={setCouponPageSize}
              currentPage={couponPage}
              onPageChange={setCouponPage}
            />
          </div>
        </div>
      )}

      {/* TAB 3: LOYALTY SETTINGS */}
      {activeTab === "loyalty" && (
        <div className="max-w-2xl bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/90 shadow-sm space-y-5">
          <h3 className="font-bold text-slate-900 text-[15px] flex items-center gap-2">
            <Gift size={18} className="text-[#3B7506]" />
            Loyalty Points Earning & Redemption Matrix
          </h3>
          <p className="text-[12.5px] text-slate-500">
            Define point issuance rates per purchase and redemption thresholds for checkout tenders.
          </p>

          <div className="space-y-4 text-[13px]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Spend Earning Ratio (৳ / Point)
                </label>
                <input
                  type="number"
                  value={loyalty.earningRate}
                  onChange={(e) => setLoyalty({ ...loyalty, earningRate: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
                <span className="text-[11px] text-slate-400">Every ৳100 spent = {loyalty.earningRate} point</span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Redemption Rate (Points / ৳)
                </label>
                <input
                  type="number"
                  value={loyalty.redemptionRate}
                  onChange={(e) => setLoyalty({ ...loyalty, redemptionRate: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
                <span className="text-[11px] text-slate-400">
                  {loyalty.redemptionRate} points = ৳1.00 checkout discount
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Min Points to Redeem
                </label>
                <input
                  type="number"
                  value={loyalty.minRedemptionThreshold}
                  onChange={(e) => setLoyalty({ ...loyalty, minRedemptionThreshold: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Max Invoice Redemption Cap (%)
                </label>
                <input
                  type="number"
                  value={loyalty.maxInvoiceRedemptionPercentage}
                  onChange={(e) => setLoyalty({ ...loyalty, maxInvoiceRedemptionPercentage: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-[#64BD0B]"
                />
                <span className="text-[11px] text-slate-400">Cannot exceed 30% of total bill</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSuccessMsg("Loyalty matrix parameters saved to central registry!");
                setTimeout(() => setSuccessMsg(""), 3500);
              }}
              className="px-6 py-2.5 bg-[#64BD0B] hover:bg-[#529E08] text-white font-bold rounded-xl text-[13px] transition-all shadow-md shadow-[#64BD0B]/20"
            >
              Save Loyalty Policy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
