"use client";

import { useState } from "react";
import {
  Megaphone,
  Plus,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Percent,
  CheckCircle2,
  Trash2,
  Clock,
  ArrowRight,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const INITIAL_CAMPAIGNS = [
  {
    id: 1,
    title: "Mega Autumn Electronics Festival",
    badge: "15% FLAT DISCOUNT",
    category: "Smart Televisions & Audio",
    discountType: "Percentage (15%)",
    startDate: "01 Oct 2026",
    endDate: "31 Oct 2026",
    revenue: 4250000,
    target: 5000000,
    status: "Active",
    color: "from-emerald-500 to-teal-700",
  },
  {
    id: 2,
    title: "Inverter AC Pre-Winter Clearance",
    badge: "FLAT ৳5,000 OFF",
    category: "Air Conditioners & Cooling",
    discountType: "Fixed Flat (৳5,000)",
    startDate: "10 Oct 2026",
    endDate: "15 Nov 2026",
    revenue: 2800000,
    target: 3500000,
    status: "Active",
    color: "from-blue-600 to-indigo-700",
  },
  {
    id: 3,
    title: "Corporate IT & Peripherals Bulk Deal",
    badge: "TIERED 8% TO 12% OFF",
    category: "Computers, Laptops & Accessories",
    discountType: "Volume Tiered",
    startDate: "15 Sep 2026",
    endDate: "15 Oct 2026",
    revenue: 1950000,
    target: 2000000,
    status: "Active",
    color: "from-purple-600 to-violet-800",
  },
];

export default function DiscountCampaignsPage() {
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    badge: "",
    category: "Smart Televisions & Audio",
    discountType: "Percentage (10%)",
    startDate: "2026-10-15",
    endDate: "2026-11-15",
    target: 1000000,
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.title) return;
    setCampaigns([
      ...campaigns,
      {
        id: Date.now(),
        title: form.title,
        badge: form.badge || "SPECIAL DISCOUNT",
        category: form.category,
        discountType: form.discountType,
        startDate: form.startDate,
        endDate: form.endDate,
        revenue: 0,
        target: Number(form.target),
        status: "Active",
        color: "from-emerald-600 to-teal-800",
      },
    ]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* ━━ Header ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#64BD0B]/10 text-[#3B7506]">
              <Megaphone size={22} className="text-[#3B7506]" />
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Discount Campaigns (Flat &amp; Percentage)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Plan and execute store-wide or category-based promotional campaigns with automated POS checkout price reductions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-sm shadow-[0_4px_14px_rgba(100,189,11,0.35)] transition-all"
        >
          <Plus size={16} />
          <span>Launch New Campaign</span>
        </button>
      </div>

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Campaigns"
          value={campaigns.length.toString()}
          trend={{ value: "All running on POS terminals", positive: true }}
          icon={Megaphone}
          accent="emerald"
        />
        <StatCard
          label="Campaign Sales (Gross)"
          value="৳9.0M"
          trend={{ value: "+24% sales uplift", positive: true }}
          icon={TrendingUp}
          accent="blue"
        />
        <StatCard
          label="Sales Target Reached"
          value="85.7%"
          trend={{ value: "Across 3 active festivals", positive: true }}
          icon={CheckCircle2}
          accent="purple"
        />
        <StatCard
          label="Target Goal"
          value="৳10.5M"
          trend={{ value: "Ending in 16 days", positive: true }}
          icon={Clock}
          accent="amber"
        />
      </div>

      {/* ━━ Campaign Cards Grid ━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {campaigns.map((camp) => {
          const progress = Math.min(100, Math.round((camp.revenue / (camp.target || 1)) * 100));
          return (
            <div
              key={camp.id}
              className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden flex flex-col justify-between group hover:shadow-lg transition-all"
            >
              <div className={`p-5 bg-gradient-to-r ${camp.color} text-white`}>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-md mb-2">
                  {camp.badge}
                </span>
                <h3 className="font-extrabold text-lg leading-tight">{camp.title}</h3>
                <p className="text-xs text-white/80 mt-1">{camp.category}</p>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Rule:</span>
                    <span className="font-bold text-slate-800">{camp.discountType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Duration:</span>
                    <span className="font-bold text-slate-800">{camp.startDate} – {camp.endDate}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-500">Sales Progress:</span>
                    <span className="text-[#3B7506]">{progress}% (৳{(camp.revenue / 100000).toFixed(1)}L / ৳{(camp.target / 100000).toFixed(1)}L)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#64BD0B] rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {camp.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCampaigns(campaigns.filter((c) => c.id !== camp.id))}
                    className="p-1 rounded text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ━━ Modal ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800">Launch Promotional Campaign</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Campaign Title:</label>
                <input
                  type="text"
                  placeholder="e.g. Winter Mega Sale"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Badge Tagline:</label>
                <input
                  type="text"
                  placeholder="e.g. 20% DISCOUNT or FLAT ৳2,000 OFF"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Category:</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  >
                    <option>Smart Televisions & Audio</option>
                    <option>Air Conditioners & Cooling</option>
                    <option>Kitchen Appliances</option>
                    <option>Mobile & Accessories</option>
                    <option>Store-Wide (All Products)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Rule:</label>
                  <input
                    type="text"
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                    placeholder="e.g. 15% Flat or ৳3,000 Off"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date:</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date:</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-slate-200 focus:border-[#64BD0B] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#64BD0B] text-white font-bold shadow-md"
                >
                  Start Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
