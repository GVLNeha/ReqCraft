import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Send, ChevronDown, ChevronUp } from "lucide-react";
import { MethodBadge } from "./MethodBadge";
import { CodeSnippetViewer } from "./CodeSnippetViewer";
import type { GeneratedRequest } from "../types";

interface Props {
  request: GeneratedRequest;
  onExecute: (req: GeneratedRequest) => void;
  isExecuting: boolean;
}

export function RequestPanel({ request, onExecute, isExecuting }: Props) {
  const [showHeaders, setShowHeaders] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* Method + URL */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
        <MethodBadge method={request.method} />
        <span className="font-mono text-sm text-white/90 break-all">{request.url}</span>
      </div>

      {/* Headers */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <button
          onClick={() => setShowHeaders((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm text-white/60 hover:text-white/80 hover:bg-white/[0.02] transition-all"
        >
          <span className="font-mono">
            Headers{" "}
            <span className="text-white/30 text-xs">
              ({Object.keys(request.headers).length})
            </span>
          </span>
          {showHeaders ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showHeaders && (
          <div className="border-t border-white/10 px-4 py-3 space-y-2">
            {Object.entries(request.headers).map(([k, v]) => (
              <div key={k} className="flex gap-3 font-mono text-xs">
                <span className="text-[#00E5CC]/80 min-w-[160px]">{k}</span>
                <span className="text-white/60">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      {request.body && (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
            <span className="text-xs font-mono text-white/50">Request Body</span>
            <span className="text-xs font-mono text-white/30">JSON</span>
          </div>
          <Editor
            height="160px"
            language="json"
            value={JSON.stringify(request.body, null, 2)}
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
              scrollbar: { vertical: "hidden" },
              padding: { top: 10, bottom: 10 },
            }}
          />
        </div>
      )}

      {/* Code snippets */}
      <div>
        <p className="text-xs font-mono text-white/40 mb-2 px-1">Code Snippets</p>
        <CodeSnippetViewer snippets={request.code_snippets} />
      </div>

      {/* Execute button */}
      <button
        onClick={() => onExecute(request)}
        disabled={isExecuting}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#00E5CC] text-black font-display font-semibold text-sm hover:bg-[#00cbb5] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        {isExecuting ? (
          <>
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
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
  );
}