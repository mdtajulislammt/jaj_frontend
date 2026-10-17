"use client";

import { useState } from "react";
import {
  Gift,
  Award,
  Search,
  Plus,
  Coins,
  Sparkles,
  UserCheck,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Clock,
  Printer,
  ChevronRight,
  Filter,
} from "lucide-react";
import StatCard from "@/components/StatCard";

const TIERS = [
  { name: "Bronze", pointsMultiplier: "1 pt / ৳100", minSpend: "৳0", color: "from-amber-700 to-amber-900", members: 420 },
  { name: "Silver", pointsMultiplier: "1.5 pts / ৳100", minSpend: "৳25,000", color: "from-slate-400 to-slate-600", members: 180 },
  { name: "Gold", pointsMultiplier: "2 pts / ৳100", minSpend: "৳75,000", color: "from-yellow-500 to-amber-600", members: 64 },
  { name: "Platinum VIP", pointsMultiplier: "3 pts / ৳100", minSpend: "৳150,000", color: "from-emerald-600 to-teal-800", members: 22 },
];

const INITIAL_MEMBERS = [
  { id: "LOY-101", name: "Al-Amin Sarkar", phone: "01711-234567", tier: "Platinum VIP", points: 3450, totalSpent: 215000, lastRedeemed: "10 Oct 2026", status: "Active" },
  { id: "LOY-102", name: "Sabrina Mostafa", phone: "01819-345678", tier: "Gold", points: 1820, totalSpent: 92400, lastRedeemed: "04 Oct 2026", status: "Active" },
  { id: "LOY-103", name: "Tanvir Hasan", phone: "01912-789012", tier: "Silver", points: 640, totalSpent: 38900, lastRedeemed: "28 Sep 2026", status: "Active" },
  { id: "LOY-104", name: "Farhana Yasmin", phone: "01611-456789", tier: "Bronze", points: 210, totalSpent: 14200, lastRedeemed: "Never", status: "Active" },
  { id: "LOY-105", name: "Dr. Shafiqul Alam", phone: "01722-998877", tier: "Gold", points: 2400, totalSpent: 110000, lastRedeemed: "12 Oct 2026", status: "Active" },
];

const REWARD_RULES = [
  { points: 500, discount: 250, title: "৳250 Off Voucher", minOrder: 1500 },
  { points: 1000, discount: 600, title: "৳600 Off Voucher", minOrder: 3000 },
  { points: 2000, discount: 1400, title: "৳1,400 VIP Gift Card", minOrder: 5000 },
];

export default function LoyaltyPage() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("All");
  const [selectedMember, setSelectedMember] = useState(null);
  const [redeemPoints, setRedeemPoints] = useState(500);
  const [notice, setNotice] = useState(null);

  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) ||
      m.id.toLowerCase().includes(search.toLowerCase());
    const matchTier = filterTier === "All" || m.tier === filterTier;
    return matchSearch && matchTier;
  });

  const totalPointsInCirculation = members.reduce((sum, m) => sum + m.points, 0);

  const handleRedeem = (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    if (selectedMember.points < redeemPoints) {
      alert("Insufficient points balance!");
      return;
    }

    const rewardCashValue = (redeemPoints / 500) * 250;
    setMembers((prev) =>
      prev.map((m) =>
        m.id === selectedMember.id
          ? {
              ...m,
              points: m.points - redeemPoints,
              lastRedeemed: "Just now",
            }
          : m
      )
    );

    setNotice(
      `Redeemed ${redeemPoints} points for ${selectedMember.name}. Issued ৳${rewardCashValue} discount voucher!`
    );
    setSelectedMember(null);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* ━━ Action Button ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 mb-2">
        <button
          onClick={() => alert("Points settings saved. Conversion: 1 Point = ৳0.50")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white font-bold text-sm shadow-[0_4px_14px_rgba(100,189,11,0.35)] transition-all"
        >
          <Sparkles size={16} />
          <span>Reward Configuration</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-[#64BD0B]/15 border border-[#64BD0B]/30 text-[#3B7506] font-bold text-sm flex items-center gap-2">
          <CheckCircle2 size={18} />
          {notice}
        </div>
      )}

      {/* ━━ Stat Cards ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Loyalty Members"
          value="686"
          trend={{ value: "+32 this month", positive: true }}
          icon={UserCheck}
          accent="emerald"
        />
        <StatCard
          label="Circulating Points"
          value={totalPointsInCirculation.toLocaleString()}
          trend={{ value: "Worth ৳" + Math.round(totalPointsInCirculation * 0.5).toLocaleString(), positive: true }}
          icon={Coins}
          accent="amber"
        />
        <StatCard
          label="Redeemed (30 Days)"
          value="18,400 Pts"
          trend={{ value: "৳9,200 saved by customers", positive: true }}
          icon={Gift}
          accent="purple"
        />
        <StatCard
          label="Top VIP Tier"
          value="22 Members"
          trend={{ value: "৳1.5L+ lifetime spend", positive: true }}
          icon={Award}
          accent="blue"
        />
      </div>

      {/* ━━ Loyalty Tiers Overview ━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-extrabold text-sm text-slate-800">{tier.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#64BD0B]/10 text-[#3B7506]">
                {tier.members} Members
              </span>
            </div>
            <div className="space-y-1 text-xs text-slate-600 mb-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Rate:</span>
                <span className="font-bold text-slate-700">{tier.pointsMultiplier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Min Spend:</span>
                <span className="font-bold text-slate-700">{tier.minSpend}</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#64BD0B] to-[#3B7506] rounded-full"
                style={{ width: `${Math.min(100, (tier.members / 450) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ━━ Member Search & Ledger Table ━━━━━━━━━━━━ */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search member name, phone or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white/70 text-sm focus:border-[#64BD0B] outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 outline-none"
            >
              <option value="All">All Tiers</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum VIP">Platinum VIP</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Loyalty ID</th>
                <th className="py-3.5 px-4">Member Name &amp; Phone</th>
                <th className="py-3.5 px-4">Membership Tier</th>
                <th className="py-3.5 px-4 text-center">Available Points</th>
                <th className="py-3.5 px-4 text-right">Cash Value (৳)</th>
                <th className="py-3.5 px-4 text-right">Lifetime Spend</th>
                <th className="py-3.5 px-4">Last Redeemed</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-[#64BD0B]/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-xs">
                    {m.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.phone}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        m.tier === "Platinum VIP"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : m.tier === "Gold"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : m.tier === "Silver"
                          ? "bg-slate-200 text-slate-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {m.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-extrabold text-[#3B7506]">
                    {m.points.toLocaleString()} pts
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                    ৳{(m.points * 0.5).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                    ৳{m.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">
                    {m.lastRedeemed}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMember(m);
                        setRedeemPoints(Math.min(500, m.points));
                      }}
                      disabled={m.points < 500}
                      className="px-3 py-1.5 rounded-lg bg-[#64BD0B] hover:bg-[#529b09] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs transition-all shadow-sm"
                    >
                      Redeem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ━━ Redeem Modal ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Gift size={18} className="text-[#3B7506]" />
                <h3 className="font-bold text-slate-800">
                  Redeem Reward Points
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
              <p className="font-bold text-slate-800 text-sm">{selectedMember.name}</p>
              <p className="text-slate-500">{selectedMember.phone} • {selectedMember.tier}</p>
              <p className="text-[#3B7506] font-bold">
                Available: {selectedMember.points.toLocaleString()} points (৳{(selectedMember.points * 0.5).toLocaleString()})
              </p>
            </div>

            <form onSubmit={handleRedeem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Reward Voucher:
                </label>
                <div className="space-y-2">
                  {REWARD_RULES.map((rule) => (
                    <label
                      key={rule.points}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                        redeemPoints === rule.points
                          ? "border-[#64BD0B] bg-[#64BD0B]/10 font-bold text-slate-900"
                          : "border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="rewardRule"
                          checked={redeemPoints === rule.points}
                          onChange={() => setRedeemPoints(rule.points)}
                          className="accent-[#64BD0B]"
                        />
                        <span>{rule.title}</span>
                      </div>
                      <span className="font-mono text-[#3B7506]">{rule.points} pts</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#64BD0B] hover:bg-[#529b09] text-white text-xs font-bold shadow-md"
                >
                  Confirm &amp; Issue Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
