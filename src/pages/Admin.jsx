import { useState } from "react";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminAgentes from "./admin/AdminAgentes.jsx";

function Proximamente({ nombre }) {
  return (
    <div style={{ background: "#fff", border: "1px dashed #CBD5E1", borderRadius: 14, padding: 40, textAlign: "center", color: "#64748B" }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>🚧</div>
      <p style={{ fontWeight: 700, marginBottom: 4 }}>{nombre}</p>
      <p style={{ fontSize: 13 }}>Este módulo todavía no está construido.</p>
    </div>
  );
}

export default function Admin({ nav, user }) {
  const [active, setActive] = useState("dashboard");

  const renderModule = () => {
    switch (active) {
      case "dashboard":   return <AdminDashboard onChangeModule={setActive} />;
      case "agentes":     return <AdminAgentes />;
      case "usuarios":    return <Proximamente nombre="👥 Usuarios" />;
      case "finanzas":    return <Proximamente nombre="💰 Finanzas" />;
      case "operaciones": return <Proximamente nombre="🔧 Operaciones" />;
      case "care":        return <Proximamente nombre="🏥 Care" />;
      case "marketing":   return <Proximamente nombre="📣 Marketing" />;
      case "config":      return <Proximamente nombre="⚙️ Configuración" />;
      default:            return <AdminDashboard onChangeModule={setActive} />;
    }
  };

  return (
    <AdminLayout user={user} nav={nav} active={active} onChangeModule={setActive}>
      {renderModule()}
    </AdminLayout>
  );
}
