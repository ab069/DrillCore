import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      setAuth(data.access_token, data.user);
      navigate("/");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 8,
          padding: 32,
          width: 340,
        }}
      >
        <h1 style={{ margin: "0 0 24px", color: "#d97706", fontSize: 24, textAlign: "center" }}>⛰ DrillCore</h1>
        {error && <p style={{ color: "#ef4444", fontSize: 13, textAlign: "center" }}>{error}</p>}
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            marginBottom: 12,
            background: "#0f0f0f",
            border: "1px solid #333",
            borderRadius: 4,
            color: "#e5e7eb",
            padding: "10px 12px",
            fontSize: 14,
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            display: "block",
            width: "100%",
            boxSizing: "border-box",
            marginBottom: 16,
            background: "#0f0f0f",
            border: "1px solid #333",
            borderRadius: 4,
            color: "#e5e7eb",
            padding: "10px 12px",
            fontSize: 14,
          }}
          required
        />
        <button
          type="submit"
          style={{
            width: "100%",
            background: "#d97706",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: 4,
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Sign In
        </button>
        <p style={{ color: "#9ca3af", fontSize: 13, textAlign: "center", marginTop: 16 }}>
          No account? <Link to="/register" style={{ color: "#d97706" }}>Register</Link>
        </p>
      </form>
    </div>
  );
}
