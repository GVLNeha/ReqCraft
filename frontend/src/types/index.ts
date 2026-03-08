export interface GeneratedRequest {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown> | null;
  code_snippets: {
    curl: string;
    python: string;
    javascript: string;
  };
}

export interface ExecuteResponse {
  status_code: number;
  headers: Record<string, string>;
  body: unknown;
  elapsed_ms: number;
}

export interface HistoryEntry {
  id: string;
  description: string;
  request: GeneratedRequest;
  timestamp: number;
}

export type SnippetLang = "curl" | "python" | "javascript";

export type AppTab = "builder" | "history";