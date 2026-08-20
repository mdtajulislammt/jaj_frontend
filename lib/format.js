export function money(n) {
  const val = Number(n || 0);
  return "৳" + val.toLocaleString("en-BD", { maximumFractionDigits: 0 });
}

export function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
}
