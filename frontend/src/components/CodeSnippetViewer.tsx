import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Copy, Check } from "lucide-react";
import type { SnippetLang } from "../types";

interface Props {
  snippets: {
    curl: string;
    python: string;
    javascript: string;
  };
}

const LANG_MAP: Record<SnippetLang, string> = {
  curl:       "shell",
  python:     "python",
  javascript: "javascript",
};

const TABS: { key: SnippetLang; label: string }[] = [
  { key: "curl",       label: "cURL"       },
  { key: "python",     label: "Python"     },
  { key: "javascript", label: "JavaScript" },
];

export function CodeSnippetViewer({ snippets }: Props) {
  const [active, setActive]   = useState<SnippetLang>("curl");
  const [copied, setCopied]   = useState(false);

  const code = snippets[active];

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      border: "1px solid var(--border)", borderRadius: "10px",
      overflow: "hidden", background: "var(--surface)",
    }}>

      {/* ── Tab bar ─────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
        padding: "0 12px",
        background: "var(--surface2)",
      }}>

        {/* Language tabs */}
        <div style={{ display: "flex" }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              style={{
                fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 500,
                padding: "9px 11px",
                border: "none", borderBottom: `2px solid ${active === t.key ? "var(--accent)" : "transparent"}`,
                borderTop: "none", borderLeft: "none", borderRight: "none",
                background: "transparent",
                color: active === t.key ? "var(--accent)" : "var(--soft)",
                cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          style={{
            display: "flex", alignItems: "center", gap: "5px",
            fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 600,
            padding: "3px 9px", borderRadius: "5px", border: "1px solid var(--border2)",
            background: copied ? "rgba(122,171,138,0.15)" : "var(--sand)",
            color: copied ? "#4a8a60" : "var(--muted)",
            cursor: "pointer", transition: "all 0.15s",
          }}
        >
          {copied ? (
            <>
              <Check size={11} />
              Copied
            </>
          ) : (
            <>
              <Copy size={11} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* ── Monaco editor (light theme) ──────────────────── */}
      <Editor
        height="200px"
        language={LANG_MAP[active]}
        value={code}
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
          hideCursorInOverviewRuler: true,
          scrollbar: { vertical: "hidden", horizontal: "auto" },
          wordWrap: "on",
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  );
}