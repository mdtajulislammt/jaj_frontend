export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        {eyebrow && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider text-[#3B7506] uppercase mb-2 bg-[#64BD0B]/10 border border-[#64BD0B]/20 backdrop-blur-sm shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#64BD0B]" />
            {eyebrow}
          </div>
        )}
        <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 tracking-tight">{title}</h1>
        {description && <p className="text-slate-600 text-sm mt-1 max-w-xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
