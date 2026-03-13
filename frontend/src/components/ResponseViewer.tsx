import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Clock } from "lucide-react";
import type { ExecuteResponse } from "../types";

interface Props {
  response: ExecuteResponse;
}

type ViewTab = "body" | "headers";

function StatusBadge({ code }: { code: number }) {
  const ok = code >= 200 && code < 300;
  const redirect = code >= 300 && code < 400;
  const color = ok ? "#4a8a60" : redirect ? "#a07850" : "#a05048";
  const bg   = ok
    ? "rgba(122,171,138,0.18)"
    : redirect
    ? "rgba(245,201,168,0.3)"
    : "rgba(196,116,106,0.15)";

  return (
    <span style={{
      fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 700,
      padding: "3px 10px", borderRadius: "6px",
      background: bg, color,
    }}>
      {code}
    </span>
  );
}

export function ResponseViewer({ response }: Props) {
  const [tab, setTab] = useState<ViewTab>("body");

  const bodyStr =
    typeof response.body === "string"
      ? response.body
      : JSON.stringify(response.body, null, 2);

  const isOk = response.status_code >= 200 && response.status_code < 300;

  return (
    <div className="rc-panel">

      {/* ── Status bar ────────────────────────────────────── */}
      <div className="rc-status-bar">
        <div className={`rc-status-dot ${isOk ? "ok" : "err"}`} />
        <StatusBadge code={response.status_code} />
        <span style={{ display: "flex", alignItems: "center", gap: "5px", color: "var(--soft)", fontSize: "0.68rem" }}>
          <Clock size={11} />
          {response.elapsed_ms}ms
        </span>

        {/* Tab switcher */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
          {(["body", "headers"] as ViewTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                fontFamily: "var(--font-mono)", fontSize: "0.65rem",
                padding: "3px 10px", borderRadius: "6px", border: "none", cursor: "pointer",
                background: tab === t ? "var(--sand)" : "transparent",
                color: tab === t ? "var(--text)" : "var(--soft)",
                fontWeight: tab === t ? 600 : 400,
                transition: "all 0.15s",
                textTransform: "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body tab ──────────────────────────────────────── */}
      {tab === "body" ? (
        <Editor
          height="280px"
          language="json"
          value={bodyStr}
          theme="light"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 12,
            lineNumbers: "off",
            folding: true,
            renderLineHighlight: "none",
            overviewRulerLanes: 0,
            scrollbar: { vertical: "auto" },
            padding: { top: 12, bottom: 12 },
            wordWrap: "on",
          }}
        />
      ) : (
        /* ── Headers tab ──────────────────────────────────── */
        <div style={{
          padding: "12px 16px",
          maxHeight: "280px", overflowY: "auto",
          display: "flex", flexDirection: "column", gap: "8px",
        }}>
          {Object.entries(response.headers).map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: "12px", fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>
              <span style={{ color: "var(--accent)", minWidth: "200px", flexShrink: 0 }}>{k}</span>
              <span style={{ color: "var(--muted)", wordBreak: "break-all" }}>{v}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}