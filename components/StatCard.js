import clsx from "clsx";

export default function StatCard({ label, value, icon: Icon, trend, trendUp, tone = "sky" }) {
  return (
    <div className="bg-paper rounded-xl2 border border-line p-4 shadow-card">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[12.5px] font-medium text-slate">{label}</p>
        {Icon && (
          <div
            className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              tone === "sky" && "bg-sky-dim text-sky",
              tone === "good" && "bg-good/10 text-good",
              tone === "warn" && "bg-warn/10 text-warn",
              tone === "bad" && "bg-bad/10 text-bad"
            )}
          >
            <Icon size={16} />
          </div>
        )}
      </div>
      <p className="font-display font-semibold text-[26px] text-ink tracking-tight">{value}</p>
      {trend && (
        <p className={clsx("text-[12px] font-medium mt-1", trendUp ? "text-good" : "text-bad")}>
          {trend}
        </p>
      )}
    </div>
  );
}
