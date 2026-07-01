import useWsStore from "../store/wsStore";

const severityColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f59e0b",
  medium: "#eab308",
  low: "#22c55e",
};

export default function AlertFeed() {
  const { connected, alerts } = useWsStore();

  return (
    <div
      style={{
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={{ margin: 0, color: "#e5e7eb", fontSize: 15 }}>Alert Feed</h3>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: connected ? "#22c55e" : "#ef4444",
            display: "inline-block",
          }}
        />
      </div>
      {alerts.length === 0 ? (
        <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>No alerts yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {alerts.map((a, i) => (
            <div
              key={i}
              style={{
                borderLeft: `3px solid ${severityColors[a.severity] || "#6b7280"}`,
                padding: "8px 12px",
                background: "#0f0f0f",
                borderRadius: 4,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "#e5e7eb", fontSize: 13 }}>{a.title}</strong>
                <span style={{ color: severityColors[a.severity] || "#6b7280", fontSize: 11, textTransform: "uppercase" }}>
                  {a.severity}
                </span>
              </div>
              <p style={{ color: "#9ca3af", fontSize: 12, margin: "4px 0 0" }}>{a.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
