import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Send, ChevronDown, ChevronUp } from "lucide-react";
import { CodeSnippetViewer } from "./CodeSnippetViewer";
import type { GeneratedRequest } from "../types";

interface Props {
  request: GeneratedRequest;
  onExecute: (req: GeneratedRequest) => void;
  isExecuting: boolean;
}

function MethodBadge({ method }: { method: string }) {
  return (
    <span className={`rc-method-badge ${method.toUpperCase()}`}>
      {method.toUpperCase()}
    </span>
  );
}

export function RequestPanel({ request, onExecute, isExecuting }: Props) {
  const [showHeaders, setShowHeaders] = useState(false);

  return (
    <div className="rc-panel">

      {/* ── Method + URL ─────────────────────────────────── */}
      <div className="rc-method-row">
        <MethodBadge method={request.method} />
        <span className="rc-url">{request.url}</span>
      </div>

      {/* ── Headers (collapsible) ─────────────────────────── */}
      <div style={{ borderBottom: "1px solid var(--border)" }}>
        <button
          onClick={() => setShowHeaders((v) => !v)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            color: "var(--muted)",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--surface2)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <span>
            Headers{" "}
            <span style={{ color: "var(--soft)", fontSize: "0.65rem" }}>
              ({Object.keys(request.headers).length})
            </span>
          </span>
          {showHeaders
            ? <ChevronUp size={13} style={{ color: "var(--soft)" }} />
            : <ChevronDown size={13} style={{ color: "var(--soft)" }} />}
        </button>

        {showHeaders && (
          <div style={{
            borderTop: "1px solid var(--border)",
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            background: "var(--bg)",
          }}>
            {Object.entries(request.headers).map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: "12px", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>
                <span style={{ color: "var(--accent)", minWidth: "160px", flexShrink: 0 }}>{k}</span>
                <span style={{ color: "var(--muted)" }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      {request.body && (
        <div style={{ borderBottom: "1px solid var(--border)" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "9px 16px", borderBottom: "1px solid var(--border)",
            background: "var(--surface2)",
          }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--soft)" }}>
              Request Body
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--border2)" }}>
              JSON
            </span>
          </div>
          <Editor
            height="160px"
            language="json"
            value={JSON.stringify(request.body, null, 2)}
            theme="light"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 12,
              lineNumbers: "off",
              folding: false,
              renderLineHighlight: "none",
              overviewRulerLanes: 0,
              scrollbar: { vertical: "hidden" },
              padding: { top: 10, bottom: 10 },
            }}
          />
        </div>
      )}

      {/* ── Code Snippets ─────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid var(--border)" }}>
        <div style={{
          padding: "9px 16px",
          background: "var(--surface2)",
          borderBottom: "1px solid var(--border)",
          fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--soft)",
        }}>
          Code Snippets
        </div>
        <div style={{ padding: "14px 16px" }}>
          <CodeSnippetViewer snippets={request.code_snippets} />
        </div>
      </div>

      {/* ── Send Button ───────────────────────────────────── */}
      <div style={{ padding: "14px 16px" }}>
        <button
          onClick={() => onExecute(request)}
          disabled={isExecuting}
          className="rc-send-btn"
        >
          {isExecuting ? (
            <>
              <span className="rc-spinner" style={{ borderTopColor: "#fff" }} />
              Sending…
            </>
          ) : (
            <>
              <Send size={14} />
              Send Request
            </>
          )}
        </button>
      </div>

    </div>
  );
}