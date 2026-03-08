const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PUT: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  PATCH: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  HEAD: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  OPTIONS: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export function MethodBadge({ method }: { method: string }) {
  const cls = METHOD_COLORS[method] ?? "bg-slate-500/20 text-slate-400 border-slate-500/30";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-mono font-semibold tracking-wider ${cls}`}>
      {method}
    </span>
  );
}