import { useState } from "react";

const ADMIN_EMAIL = "wilberthfdz@gmail.com";

const MODULES = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "usuarios", label: "Usuarios", icon: "👥" },
  { id: "finanzas", label: "Finanzas", icon: "💰" },
  { id: "operaciones", label: "Operaciones", icon: "🔧" },
  { id: "care", label: "Care", icon: "🏥" },
  { id: "agentes", label: "Agentes IA", icon: "🤖" },
  { id: "marketing", label: "Marketing", icon: "📣" },
  { id: "config", label: "Config", icon: "⚙️" },
];

export function isAdminUser(user) {
  return !!user && user.email === ADMIN_EMAIL;
}

export default function AdminLayout({ user, nav, active, onChangeModule, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAdminUser(user)) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0F172A", color: "#fff", padding: 20 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <p style={{ fontSize: 15, opacity: 0.8, marginBottom: 20 }}>No tienes acceso a esta sección.</p>
          <button
            onClick={() => nav("landing")}
            style={{ background: "#F97316", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer" }}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F1F5F9" }}>
      <style>{`
        .admin-side-btn {
          display:flex; align-items:center; gap:10px; width:100%;
          background:transparent; border:none; color:rgba(255,255,255,0.65);
          padding:11px 16px; font-size:14px; font-weight:600; cursor:pointer;
          border-radius:10px; text-align:left; font-family:inherit;
          transition:background 0.15s, color 0.15s;
        }
        .admin-side-btn:hover { background:rgba(255,255,255,0.06); color:#fff; }
        .admin-side-btn.active { background:#F97316; color:#fff; }
        @media (max-width: 860px) {
          .admin-sidebar { display:none !important; }
          .admin-mobile-bar { display:flex !important; }
        }
        .admin-mobile-bar { display:none; }
      `}</style>

      {/* Sidebar (desktop) */}
      <aside className="admin-sidebar" style={{ width: 230, background: "#0F172A", padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, padding: "0 12px 20px" }}>
          ⚙️ Habilis Admin
        </div>
        {MODULES.map((m) => (
          <button
            key={m.id}
            className={`admin-side-btn ${active === m.id ? "active" : ""}`}
            onClick={() => onChangeModule(m.id)}
          >
            <span>{m.icon}</span> {m.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="admin-side-btn" onClick={() => nav("landing")}>← Salir del admin</button>
      </aside>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <strong style={{ fontSize: 15 }}>{MODULES.find((m) => m.id === active)?.label || "Admin"}</strong>
          <span style={{ fontSize: 13, color: "#64748B" }}>{user.email} · {today}</span>
        </div>

        {/* Mobile module bar */}
        <div className="admin-mobile-bar" style={{ overflowX: "auto", background: "#0F172A", padding: "8px 10px", gap: 6 }}>
          {MODULES.map((m) => (
            <button
              key={m.id}
              onClick={() => onChangeModule(m.id)}
              style={{
                flexShrink: 0, background: active === m.id ? "#F97316" : "transparent",
                color: "#fff", border: "none", borderRadius: 8, padding: "8px 12px",
                fontSize: 12, fontWeight: 700, marginRight: 6, cursor: "pointer",
              }}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, padding: 24, overflow: "auto" }}>{children}</div>
      </div>
    </div>
  );
}
