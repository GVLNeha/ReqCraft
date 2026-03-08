export function StatusBadge({ code }: { code: number }) {
  const cls =
    code >= 500
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : code >= 400
      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
      : code >= 300
      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded border text-sm font-mono font-semibold ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${code < 400 ? "bg-emerald-400" : "bg-red-400"} animate-pulse`} />
      {code}
    </span>
  );
}