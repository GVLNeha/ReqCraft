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

  // ── Shareable link: load query from URL on mount ──────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("query");
    if (q) setDescription(decodeURIComponent(q));
  }, []);

  // ── Update URL when description changes ───────────────────────
  useEffect(() => {
    const url = new URL(window.location.href);
    if (description.trim()) {
      url.searchParams.set("query", encodeURIComponent(description.trim()));
    } else {
      url.searchParams.delete("query");
    }
    window.history.replaceState(null, "", url.toString());
  }, [description]);

  // ── Handlers (unchanged) ──────────────────────────────────────
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
    <div className="rc-root">
      <div className="rc-shell">

        {/* ── HEADER ─────────────────────────────────────────── */}
        <header className="rc-header">
          <div className="rc-logo">
            <div className="rc-logo-mark">
              <Zap size={15} style={{ color: "#c8764a" }} />
            </div>
            Req<span className="rc-logo-dot">Craft</span>
          </div>
          <p className="rc-tagline">
            Describe an HTTP request in plain English. Get method, URL, headers,
            body and code snippets instantly.
          </p>
        </header>

        {/* ── INPUT ──────────────────────────────────────────── */}
        <div className="rc-input-section">
          <label className="rc-label">Describe your request</label>

          <div className="rc-textarea-wrap">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
              }}
              placeholder="e.g. POST /api/users with name and email…"
              rows={3}
              className="rc-textarea"
            />
            <span className="rc-kbd">⌘↵</span>
          </div>

          {/* Example pills */}
          <div className="rc-examples">
            {EXAMPLES.map((ex) => (
              <button key={ex} className="rc-pill" onClick={() => setDescription(ex)}>
                {ex}
              </button>
            ))}
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !description.trim()}
            className="rc-generate-btn"
          >
            {isGenerating ? (
              <>
                <span className="rc-spinner" />
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

        {/* ── ERROR ──────────────────────────────────────────── */}
        {error && (
          <div className="rc-error">
            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{error}</span>
          </div>
        )}

        {/* ── TABS ───────────────────────────────────────────── */}
        <div className="rc-tabs">
          <button
            className={`rc-tab ${tab === "builder" ? "active" : ""}`}
            onClick={() => setTab("builder")}
          >
            Builder
          </button>
          <button
            className={`rc-tab ${tab === "history" ? "active" : ""}`}
            onClick={() => setTab("history")}
          >
            <History size={13} />
            History
            {history.length > 0 && (
              <span className="rc-tab-badge">{history.length}</span>
            )}
          </button>
        </div>

        {/* ── MAIN CONTENT ───────────────────────────────────── */}
        {tab === "builder" ? (
          <div className="rc-grid">

            {/* Left: Generated Request */}
            <div>
              {request ? (
                <>
                  <p className="rc-section-label">Generated Request</p>
                  <RequestPanel
                    request={request}
                    onExecute={handleExecute}
                    isExecuting={isExecuting}
                  />
                </>
              ) : (
                <div className="rc-empty">
                  <div className="rc-empty-icon">
                    <Sparkles size={26} />
                  </div>
                  <p>No request generated yet.</p>
                  <small>Describe one above and hit Generate.</small>
                </div>
              )}
            </div>

            {/* Right: Response */}
            <div>
              {response ? (
                <>
                  <p className="rc-section-label">Response</p>
                  <ResponseViewer response={response} />
                </>
              ) : request ? (
                <div className="rc-empty">
                  <div className="rc-empty-icon">✉️</div>
                  <p>No response yet.</p>
                  <small>Click "Send Request" to execute.</small>
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