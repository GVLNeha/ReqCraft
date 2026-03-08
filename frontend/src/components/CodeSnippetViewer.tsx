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
  curl: "shell",
  python: "python",
  javascript: "javascript",
};

const TABS: { key: SnippetLang; label: string }[] = [
  { key: "curl", label: "cURL" },
  { key: "python", label: "Python" },
  { key: "javascript", label: "JavaScript" },
];

export function CodeSnippetViewer({ snippets }: Props) {
  const [active, setActive] = useState<SnippetLang>("curl");
  const [copied, setCopied] = useState(false);

  const code = snippets[active];

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0d0d0d]">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                active === t.key
                  ? "bg-[#00E5CC]/10 text-[#00E5CC] border border-[#00E5CC]/30"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all font-mono"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Editor */}
      <Editor
        height="200px"
        language={LANG_MAP[active]}
        value={code}
        theme="vs-dark"
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