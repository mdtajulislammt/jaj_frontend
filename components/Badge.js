import clsx from "clsx";

const TONES = {
  neutral: "bg-mist-deep text-slate",
  sky: "bg-sky-dim text-sky",
  good: "bg-good/10 text-good",
  warn: "bg-warn/10 text-warn",
  bad: "bg-bad/10 text-bad",
  ink: "bg-ink text-white",
};

export default function Badge({ tone = "neutral", children, dot = false }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11.5px] font-semibold whitespace-nowrap",
        TONES[tone]
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
