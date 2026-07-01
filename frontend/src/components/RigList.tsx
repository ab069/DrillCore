import { useEffect, useState } from "react";
import useDrillStore from "../store/drillStore";
import { useWebSocket } from "../hooks/useWebSocket";

const cellStyle: React.CSSProperties = { padding: "10px 12px", borderBottom: "1px solid #2a2a2a", fontSize: 13 };

function riskColor(score: number): string {
  if (score >= 75) return "#ef4444";
  if (score >= 50) return "#f59e0b";
  if (score >= 25) return "#eab308";
  return "#22c55e";
}

export default function RigList() {
  const { rigs, fetchRigs, fetchStats, deleteRig } = useDrillStore();
  const { sendMessage } = useWebSocket();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [analyses, setAnalyses] = useState<Record<number, any>>({});

  useEffect(() => {
    fetchRigs();
    fetchStats();
  }, []);

  const handleAnalyze = (rigId: number) => {
    sendMessage({ action: "analyze", rig_id: rigId });
    setExpanded(expanded === rigId ? null : rigId);
  };

  const handleDelete = async (id: number) => {
    await deleteRig(id);
    await fetchRigs();
    await fetchStats();
  };

  const rowStyle = (status: string): React.CSSProperties => ({
    background: status === "drilling" ? "rgba(217,119,6,0.05)" : "transparent",
    cursor: "pointer",
  });

  return (
    <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #333" }}>
            {["Rig", "Type", "Status", "Depth", "ROP", "Mud", "Bit", "Hours", "Actions"].map((h) => (
              <th key={h} style={{ ...cellStyle, color: "#9ca3af", textAlign: "left", fontWeight: 500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rigs.map((rig) => (
            <>
              <tr key={rig.id} style={rowStyle(rig.status)} onClick={() => handleAnalyze(rig.id)}>
                <td style={cellStyle}>{rig.rig_name}</td>
                <td style={cellStyle}>{rig.rig_type}</td>
                <td style={cellStyle}>
                  <span style={{
                    color: rig.status === "drilling" ? "#d97706" : "#9ca3af",
                    fontWeight: rig.status === "drilling" ? 600 : 400,
                  }}>
                    {rig.status}
                  </span>
                </td>
                <td style={cellStyle}>{rig.depth_current.toLocaleString()} ft</td>
                <td style={cellStyle}>{rig.rop_rate_ft_hr} ft/hr</td>
                <td style={cellStyle}>{rig.mud_weight} ppg</td>
                <td style={cellStyle}>{rig.bit_type}</td>
                <td style={cellStyle}>{rig.bit_hours}h</td>
                <td style={cellStyle}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(rig.id); }}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 13 }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
              {expanded === rig.id && (
                <tr>
                  <td colSpan={9} style={{ ...cellStyle, background: "#151515" }}>
                    <p style={{ color: "#d97706", margin: "0 0 8px", fontWeight: 600 }}>Analysis pending — send "analyze" action via WebSocket</p>
                    {analyses[rig.id] && (
                      <pre style={{ color: "#e5e7eb", fontSize: 12, whiteSpace: "pre-wrap", margin: 0 }}>
                        Score: {analyses[rig.id].risk_score} — {analyses[rig.id].report}
                      </pre>
                    )}
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
      {rigs.length === 0 && (
        <p style={{ textAlign: "center", color: "#6b7280", padding: 24, margin: 0 }}>No rigs registered.</p>
      )}
    </div>
  );
}
