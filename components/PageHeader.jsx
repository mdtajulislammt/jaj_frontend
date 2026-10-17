export default function PageHeader({ action }) {
  if (!action) return null;
  return (
    <div className="flex items-center justify-end mb-4 shrink-0">
      {action}
    </div>
  );
}

