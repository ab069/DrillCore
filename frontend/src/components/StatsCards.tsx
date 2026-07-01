import useDrillStore from "../store/drillStore";

const cardStyle: React.CSSProperties = {
  background: "#1a1a1a",
  border: "1px solid #2a2a2a",
  borderRadius: 8,
  padding: "16px 20px",
  flex: 1,
  minWidth: 180,
};

const labelStyle: React.CSSProperties = { color: "#9ca3af", fontSize: 12, margin: 0 };
const valueStyle: React.CSSProperties = { color: "#f3f4f6", fontSize: 28, fontWeight: 700, margin: "4px 0 0" };

export default function StatsCards() {
  const stats = useDrillStore((s) => s.stats);

  if (!stats) return null;

  const items = [
    { label: "Total Rigs", value: stats.total_rigs },
    { label: "Active Drilling", value: stats.active_drilling },
    { label: "Avg ROP (ft/hr)", value: stats.avg_rop.toFixed(1) },
    { label: "Avg Depth (ft)", value: stats.avg_depth.toFixed(0) },
  ];

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
      {items.map((item) => (
        <div key={item.label} style={cardStyle}>
          <p style={labelStyle}>{item.label}</p>
          <p style={valueStyle}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
