export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div>
        {eyebrow && (
          <p className="text-[11px] font-semibold tracking-widest text-sky uppercase mb-1">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display font-semibold text-2xl text-ink tracking-tight">{title}</h1>
        {description && <p className="text-slate text-sm mt-1 max-w-xl">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
