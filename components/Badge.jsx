import clsx from "clsx";

const TONES = {
  neutral: "bg-white/80 text-slate-600 border-slate-200/80 shadow-sm",
  primary: "bg-[#64BD0B]/15 text-[#2B5E04] border-[#64BD0B]/30 shadow-[0_2px_8px_rgba(100,189,11,0.15)]",
  sky: "bg-[#64BD0B]/15 text-[#2B5E04] border-[#64BD0B]/30 shadow-[0_2px_8px_rgba(100,189,11,0.15)]",
  good: "bg-[#64BD0B]/15 text-[#2B5E04] border-[#64BD0B]/30 shadow-[0_2px_8px_rgba(100,189,11,0.15)]",
  warn: "bg-amber-500/15 text-amber-800 border-amber-400/35 shadow-sm",
  bad: "bg-rose-500/15 text-rose-700 border-rose-400/35 shadow-sm",
  ink: "bg-slate-900/80 text-white border-white/20 shadow-sm",
};

export default function Badge({ tone = "neutral", children, dot = false }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold whitespace-nowrap backdrop-blur-md border transition-all",
        TONES[tone]
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current shadow-sm" />}
      {children}
    </span>
  );
}
