import { FormEvent, useState } from "react";
import useDrillStore from "../store/drillStore";

const inputStyle: React.CSSProperties = {
  background: "#0f0f0f",
  border: "1px solid #333",
  borderRadius: 4,
  color: "#e5e7eb",
  padding: "8px 12px",
  fontSize: 13,
  width: "100%",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = { color: "#9ca3af", fontSize: 12, display: "block", marginBottom: 4 };

export default function RigForm() {
  const { submitRig, fetchRigs, fetchStats } = useDrillStore();
  const [form, setForm] = useState({
    rig_name: "",
    rig_type: "jackup",
    depth_current: "",
    depth_target: "",
    rop_rate_ft_hr: "",
    mud_weight: "",
    bit_type: "PDC",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submitRig({
      ...form,
      depth_current: parseFloat(form.depth_current) || 0,
      depth_target: parseFloat(form.depth_target) || 0,
      rop_rate_ft_hr: parseFloat(form.rop_rate_ft_hr) || 0,
      mud_weight: parseFloat(form.mud_weight) || 0,
    });
    setForm({ rig_name: "", rig_type: "jackup", depth_current: "", depth_target: "", rop_rate_ft_hr: "", mud_weight: "", bit_type: "PDC" });
    await fetchRigs();
    await fetchStats();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: 8,
        padding: 20,
        marginBottom: 24,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 12,
      }}
    >
      <div>
        <label style={labelStyle}>Rig Name</label>
        <input style={inputStyle} value={form.rig_name} onChange={(e) => setForm({ ...form, rig_name: e.target.value })} required />
      </div>
      <div>
        <label style={labelStyle}>Rig Type</label>
        <select style={inputStyle} value={form.rig_type} onChange={(e) => setForm({ ...form, rig_type: e.target.value })}>
          <option value="jackup">Jackup</option>
          <option value="semisub">Semi-Submersible</option>
          <option value="drillship">Drillship</option>
          <option value="platform">Platform</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>Depth Current (ft)</label>
        <input style={inputStyle} type="number" value={form.depth_current} onChange={(e) => setForm({ ...form, depth_current: e.target.value })} />
      </div>
      <div>
        <label style={labelStyle}>Depth Target (ft)</label>
        <input style={inputStyle} type="number" value={form.depth_target} onChange={(e) => setForm({ ...form, depth_target: e.target.value })} />
      </div>
      <div>
        <label style={labelStyle}>ROP (ft/hr)</label>
        <input style={inputStyle} type="number" value={form.rop_rate_ft_hr} onChange={(e) => setForm({ ...form, rop_rate_ft_hr: e.target.value })} />
      </div>
      <div>
        <label style={labelStyle}>Mud Weight (ppg)</label>
        <input style={inputStyle} type="number" step="0.1" value={form.mud_weight} onChange={(e) => setForm({ ...form, mud_weight: e.target.value })} />
      </div>
      <div>
        <label style={labelStyle}>Bit Type</label>
        <select style={inputStyle} value={form.bit_type} onChange={(e) => setForm({ ...form, bit_type: e.target.value })}>
          <option value="PDC">PDC</option>
          <option value="rollerCone">Roller Cone</option>
          <option value="diamond">Diamond</option>
        </select>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <button
          type="submit"
          style={{
            background: "#d97706",
            color: "#fff",
            border: "none",
            padding: "8px 20px",
            borderRadius: 4,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Add Rig
        </button>
      </div>
    </form>
  );
}
