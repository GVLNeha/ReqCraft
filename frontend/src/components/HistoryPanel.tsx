import { Trash2 } from "lucide-react";
import type { HistoryEntry, GeneratedRequest } from "../types";

interface Props {
  history: HistoryEntry[];
  onSelect: (description: string, request: GeneratedRequest) => void;
  onClear: () => void;
}

function MethodTag({ method }: { method: string }) {
  const m = method.toUpperCase() as "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  return <span className={`rc-mtag ${m}`}>{m}</span>;
}

export function HistoryPanel({ history, onSelect, onClear }: Props) {

  /* ── Empty state ──────────────────────────────────────────── */
  if (history.length === 0) {
    return (
      <div className="rc-empty">
        <div className="rc-empty-icon">🕐</div>
        <p>No history yet.</p>
        <small>Generate requests to see them here.</small>
      </div>
    );
  }

  /* ── List ─────────────────────────────────────────────────── */
  return (
    <div>
      {/* Header row */}
      <div className="rc-history-header">
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.65rem",
          color: "var(--soft)", letterSpacing: "0.06em",
        }}>
          Last {history.length} request{history.length !== 1 ? "s" : ""}
        </span>
        <button className="rc-clear-btn" onClick={onClear}>
          <Trash2 size={11} style={{ display: "inline", marginRight: 4 }} />
          Clear all
        </button>
      </div>

      {/* Items */}
      <div className="rc-history-list">
        {history.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry.description, entry.request)}
            className="rc-history-item"
            style={{ width: "100%", textAlign: "left", fontFamily: "inherit" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
              <MethodTag method={entry.request.method} />
              <span className="rc-history-url">{entry.request.url}</span>
            </div>
            <p className="rc-history-desc">{entry.description}</p>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "0.62rem",
              color: "var(--border2)", marginTop: "5px",
            }}>
              {new Date(entry.timestamp).toLocaleString()}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}