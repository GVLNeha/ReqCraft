import { Trash2 } from "lucide-react";
import { MethodBadge } from "./MethodBadge";
import type { HistoryEntry, GeneratedRequest } from "../types";

interface Props {
  history: HistoryEntry[];
  onSelect: (description: string, request: GeneratedRequest) => void;
  onClear: () => void;
}

export function HistoryPanel({ history, onSelect, onClear }: Props) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/20">
        <p className="font-mono text-sm">No history yet.</p>
        <p className="font-mono text-xs mt-1">Generate requests to see them here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-mono text-white/30">Last {history.length} requests</p>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs font-mono text-white/30 hover:text-red-400 transition-colors"
        >
          <Trash2 size={11} />
          Clear
        </button>
      </div>
      {history.map((entry) => (
        <button
          key={entry.id}
          onClick={() => onSelect(entry.description, entry.request)}
          className="w-full text-left p-3.5 rounded-xl border border-white/10 hover:border-[#00E5CC]/30 hover:bg-[#00E5CC]/[0.03] transition-all group"
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <MethodBadge method={entry.request.method} />
            <span className="font-mono text-xs text-white/50 truncate">{entry.request.url}</span>
          </div>
          <p className="text-xs text-white/60 truncate group-hover:text-white/80 transition-colors">
            {entry.description}
          </p>
          <p className="text-xs text-white/20 mt-1 font-mono">
            {new Date(entry.timestamp).toLocaleString()}
          </p>
        </button>
      ))}
    </div>
  );
}