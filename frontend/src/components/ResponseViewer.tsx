import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Clock } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { ExecuteResponse } from "../types";

interface Props {
  response: ExecuteResponse;
}

type ViewTab = "body" | "headers";

export function ResponseViewer({ response }: Props) {
  const [tab, setTab] = useState<ViewTab>("body");

  const bodyStr =
    typeof response.body === "string"
      ? response.body
      : JSON.stringify(response.body, null, 2);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0d0d0d]">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <StatusBadge code={response.status_code} />
          <div className="flex items-center gap-1.5 text-xs text-white/40 font-mono">
            <Clock size={11} />
            {response.elapsed_ms}ms
          </div>
        </div>
        <div className="flex gap-1">
          {(["body", "headers"] as ViewTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-md text-xs font-mono capitalize transition-all ${
                tab === t
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {tab === "body" ? (
        <Editor
          height="260px"
          language="json"
          value={bodyStr}
          theme="vs-dark"
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
        <div className="px-4 py-3 space-y-1.5 max-h-[260px] overflow-y-auto">
          {Object.entries(response.headers).map(([k, v]) => (
            <div key={k} className="flex gap-3 font-mono text-xs">
              <span className="text-[#00E5CC]/70 min-w-[200px] shrink-0">{k}</span>
              <span className="text-white/50 break-all">{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}