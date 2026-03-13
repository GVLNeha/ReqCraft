const METHOD_STYLES: Record<string, { bg: string; color: string }> = {
  GET:     { bg: "rgba(122,171,138,0.18)", color: "#4a8a60" },
  POST:    { bg: "rgba(200,118,74, 0.15)", color: "#b06030" },
  PUT:     { bg: "rgba(197,184,212,0.25)", color: "#7a6890" },
  PATCH:   { bg: "rgba(232,165,152,0.25)", color: "#b07060" },
  DELETE:  { bg: "rgba(196,116,106,0.15)", color: "#a05048" },
  HEAD:    { bg: "rgba(228,216,196,0.35)", color: "#9e8877" },
  OPTIONS: { bg: "rgba(228,216,196,0.35)", color: "#9e8877" },
};

export function MethodBadge({ method }: { method: string }) {
  const s = METHOD_STYLES[method.toUpperCase()] ?? { bg: "var(--sand)", color: "var(--muted)" };

  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 10px", borderRadius: "6px",
      background: s.bg, color: s.color,
      fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700,
      letterSpacing: "0.04em", minWidth: "52px", justifyContent: "center",
      flexShrink: 0,
    }}>
      {method.toUpperCase()}
    </span>
  );
}