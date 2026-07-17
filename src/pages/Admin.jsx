import { useState } from "react";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminAgentes from "./admin/AdminAgentes.jsx";
import AdminUsuarios from "./admin/AdminUsuarios.jsx";
import AdminFinanzas from "./admin/AdminFinanzas.jsx";
import AdminOperaciones from "./admin/AdminOperaciones.jsx";
import AdminCare from "./admin/AdminCare.jsx";
import AdminMarketing from "./admin/AdminMarketing.jsx";
import AdminConfig from "./admin/AdminConfig.jsx";

export default function Admin({ nav, user }) {
  const [active, setActive] = useState("dashboard");

  const renderModule = () => {
    switch (active) {
      case "dashboard":   return <AdminDashboard onChangeModule={setActive} />;
      case "agentes":     return <AdminAgentes />;
      case "usuarios":    return <AdminUsuarios />;
      case "finanzas":    return <AdminFinanzas />;
      case "operaciones": return <AdminOperaciones />;
      case "care":        return <AdminCare />;
      case "marketing":   return <AdminMarketing />;
      case "config":      return <AdminConfig />;
      default:            return <AdminDashboard onChangeModule={setActive} />;
    }
  };

  return (
    <AdminLayout user={user} nav={nav} active={active} onChangeModule={setActive}>
      {renderModule()}
    </AdminLayout>
  );
}
