import useAuthStore from "../store/authStore";

const accent = { color: "#d97706" };

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f" }}>
      <header
        style={{
          background: "#1a1a1a",
          borderBottom: "1px solid #2a2a2a",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22, ...accent }}>
          ⛰ DrillCore
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#9ca3af", fontSize: 14 }}>{user?.name}</span>
          <button
            onClick={logout}
            style={{
              background: "transparent",
              border: "1px solid #d97706",
              color: "#d97706",
              padding: "6px 14px",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <main style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}
