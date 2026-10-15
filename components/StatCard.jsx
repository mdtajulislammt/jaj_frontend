import clsx from "clsx";

export default function StatCard({ label, value, icon: Icon, trend, trendUp, tone = "sky" }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/90 p-5 shadow-[0_8px_30px_rgba(100,189,11,0.06)] hover:shadow-[0_16px_36px_rgba(100,189,11,0.15)] hover:border-[#64BD0B]/35 hover:-translate-y-1 transition-all duration-300 group">
      {/* Top light reflection line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />
      {/* Corner ambient glow */}
      <div className="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#64BD0B]/10 blur-xl group-hover:bg-[#64BD0B]/20 transition-all" />

      <div className="flex items-start justify-between mb-3 relative z-10">
        <p className="text-[13px] font-semibold text-slate-600">{label}</p>
        {Icon && (
          <div
            className={clsx(
              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-md shadow-sm border transition-transform duration-300 group-hover:scale-110",
              (tone === "sky" || tone === "primary" || tone === "good") &&
                "bg-[#64BD0B]/12 text-[#3B7506] border-[#64BD0B]/25",
              tone === "warn" && "bg-amber-500/12 text-amber-700 border-amber-400/30",
              tone === "bad" && "bg-rose-500/12 text-rose-600 border-rose-400/30"
            )}
          >
            <Icon size={17} strokeWidth={2.2} />
          </div>
        )}
      </div>
      <p className="font-display font-bold text-[28px] text-slate-900 tracking-tight relative z-10 leading-tight">
        {value}
      </p>
      {trend && (
        <div className="relative z-10 mt-2">
          <span
            className={clsx(
              "inline-flex items-center gap-1 text-[11.5px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm border",
              trendUp !== undefined
                ? trendUp
                  ? "bg-[#64BD0B]/12 text-[#2E6004] border-[#64BD0B]/20"
                  : "bg-rose-500/12 text-rose-700 border-rose-400/20"
                : (tone === "warn" && "bg-amber-500/12 text-amber-800 border-amber-400/20") ||
                  (tone === "bad" && "bg-rose-500/12 text-rose-700 border-rose-400/20") ||
                  "bg-[#64BD0B]/10 text-[#3B7506] border-[#64BD0B]/20"
            )}
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
