export function StatusBadge({ code }: { code: number }) {
  const style: { bg: string; color: string; dot: string } =
    code >= 500
      ? { bg: "rgba(196,116,106,0.15)", color: "#a05048", dot: "#c4746a" }
      : code >= 400
      ? { bg: "rgba(232,165,152,0.25)",  color: "#b07060", dot: "#e8a598" }
      : code >= 300
      ? { bg: "rgba(197,184,212,0.25)",  color: "#7a6890", dot: "#c5b8d4" }
      : { bg: "rgba(122,171,138,0.18)",  color: "#4a8a60", dot: "#7aab8a" };

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      padding: "3px 10px", borderRadius: "6px",
      background: style.bg, color: style.color,
      fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 700,
    }}>
      {/* animated pulse dot */}
      <span style={{
        width: "6px", height: "6px", borderRadius: "50%",
        background: style.dot,
        display: "inline-block",
        animation: "pulse 1.8s ease-in-out infinite",
      }} />
      {code}
    </span>
  );
}