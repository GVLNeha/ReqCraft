import { useState, useEffect } from "react";
import { Sparkles, History, Zap, AlertCircle } from "lucide-react";
import { RequestPanel } from "./components/RequestPanel";
import { ResponseViewer } from "./components/ResponseViewer";
import { HistoryPanel } from "./components/HistoryPanel";
import { useHistory } from "./hooks/useHistory";
import { generateRequest, executeRequest } from "./utils/api";
import type { GeneratedRequest, ExecuteResponse, AppTab } from "./types";

const EXAMPLES = [
  "GET /products?category=electronics&limit=10",
  "POST /users with name and email",
  "PUT /orders/42 update status to shipped",
  "DELETE /sessions/abc123",
  "GET https://jsonplaceholder.typicode.com/posts/1",
];

export default function App() {
  const [tab, setTab] = useState<AppTab>("builder");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [request, setRequest] = useState<GeneratedRequest | null>(null);
  const [response, setResponse] = useState<ExecuteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { history, addEntry, clearHistory } = useHistory();

  // Shareable link: load query from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("query");
    if (q) setDescription(decodeURIComponent(q));
  }, []);

  // Update URL when description changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (description.trim()) {
      url.searchParams.set("query", encodeURIComponent(description.trim()));
    } else {
      url.searchParams.delete("query");
    }
    window.history.replaceState(null, "", url.toString());
  }, [description]);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setIsGenerating(true);
    setError(null);
    setResponse(null);
    try {
      const result = await generateRequest(description);
      setRequest(result);
      addEntry(description, result);
      setTab("builder");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExecute = async (req: GeneratedRequest) => {
    setIsExecuting(true);
    setError(null);
    try {
      const result = await executeRequest(req.method, req.url, req.headers, req.body);
      setResponse(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleHistorySelect = (desc: string, req: GeneratedRequest) => {
    setDescription(desc);
    setRequest(req);
    setResponse(null);
    setTab("builder");
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white font-display">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#00E5CC]/40 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00E5CC]/10 border border-[#00E5CC]/20">
              <Zap size={16} className="text-[#00E5CC]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Req<span className="text-[#00E5CC]">Craft</span>
            </h1>
          </div>
          <p className="text-white/40 text-sm max-w-md">
            Describe an HTTP request in plain English. Get method, URL, headers, body and code snippets instantly.
          </p>
        </header>

        {/* Input area */}
        <div className="mb-6">
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
              }}
              placeholder="Describe your HTTP request…"
              rows={3}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/20 font-mono resize-none focus:outline-none focus:border-[#00E5CC]/40 focus:bg-white/[0.05] transition-all"
            />
            <div className="absolute bottom-3 right-3">
              <kbd className="text-[10px] font-mono text-white/20 border border-white/10 px-1.5 py-0.5 rounded">
                ⌘↵
              </kbd>
            </div>
          </div>

          {/* Examples */}
          <div className="flex flex-wrap gap-2 mt-3">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setDescription(ex)}
                className="text-xs font-mono px-2.5 py-1 rounded-lg border border-white/10 text-white/35 hover:text-white/60 hover:border-white/20 transition-all"
              >
                {ex}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !description.trim()}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5CC] text-black font-semibold text-sm hover:bg-[#00cbb5] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate Request
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
            <AlertCircle size={15} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-sm text-red-300 font-mono">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-5 border-b border-white/10 pb-0">
          <button
            onClick={() => setTab("builder")}
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-all ${
              tab === "builder"
                ? "border-[#00E5CC] text-[#00E5CC]"
                : "border-transparent text-white/40 hover:text-white/60"
            }`}
          >
            Builder
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-all ${
              tab === "history"
                ? "border-[#00E5CC] text-[#00E5CC]"
                : "border-transparent text-white/40 hover:text-white/60"
            }`}
          >
            <History size={13} />
            History
            {history.length > 0 && (
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">{history.length}</span>
            )}
          </button>
        </div>

        {/* Main content */}
        {tab === "builder" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left: Request */}
            <div>
              {request ? (
                <div>
                  <h2 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">
                    Generated Request
                  </h2>
                  <RequestPanel
                    request={request}
                    onExecute={handleExecute}
                    isExecuting={isExecuting}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-white/20 border border-white/5 rounded-xl">
                  <Sparkles size={24} className="mb-3 opacity-50" />
                  <p className="text-sm font-mono">No request generated yet.</p>
                  <p className="text-xs mt-1">Describe one above and hit Generate.</p>
                </div>
              )}
            </div>

            {/* Right: Response */}
            <div>
              {response ? (
                <div>
                  <h2 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">
                    Response
                  </h2>
                  <ResponseViewer response={response} />
                </div>
              ) : request ? (
                <div className="flex flex-col items-center justify-center py-20 text-white/20 border border-white/5 rounded-xl">
                  <p className="text-sm font-mono">No response yet.</p>
                  <p className="text-xs mt-1">Click "Send Request" to execute.</p>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <HistoryPanel
            history={history}
            onSelect={handleHistorySelect}
            onClear={clearHistory}
          />
        )}
      </div>
    </div>
  );
}