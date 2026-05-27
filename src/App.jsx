// ─── OFICIO.MX — App principal ────────────────────────────────────────────
import { useState, useEffect }       from "react";
import { onAuth }                    from "./lib/firebase.js";
import Landing                       from "./pages/Landing.jsx";
import Registro                      from "./pages/Registro.jsx";
import Perfil                        from "./pages/Perfil.jsx";
import Buscar                        from "./pages/Buscar.jsx";
import PanelTecnico                  from "./pages/PanelTecnico.jsx";
import RegistrarTrabajo              from "./pages/RegistrarTrabajo.jsx";

// CSS global mínimo
const globalCSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', system-ui, sans-serif; background: #F4F5F7; color: #111827; }
input, select, textarea, button { font-family: inherit; }
button { cursor: pointer; }
a { text-decoration: none; color: inherit; }
`;

export default function App() {
  const [user,    setUser]    = useState(undefined); // undefined = cargando
  const [screen,  setScreen]  = useState("landing");
  const [params,  setParams]  = useState({});

  useEffect(() => {
    const unsub = onAuth(u => setUser(u || null));
    return unsub;
  }, []);

  const nav = (screen, params = {}) => {
    setScreen(screen);
    setParams(params);
    window.scrollTo(0, 0);
  };

  if (user === undefined) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid #D97706", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>Cargando Oficio.mx...</p>
        </div>
      </div>
    );
  }

  const screenProps = { nav, user };

  return (
    <>
      <style>{globalCSS}</style>
      {screen === "landing"          && <Landing        {...screenProps} />}
      {screen === "registro"         && <Registro       {...screenProps} params={params} />}
      {screen === "buscar"           && <Buscar         {...screenProps} params={params} />}
      {screen === "perfil"           && <Perfil         {...screenProps} params={params} />}
      {screen === "panel"            && <PanelTecnico   {...screenProps} />}
      {screen === "registrarTrabajo" && <RegistrarTrabajo {...screenProps} params={params} />}
    </>
  );
}
