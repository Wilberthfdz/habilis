import React, { useState, useEffect } from "react";
import { onAuth }                    from "./lib/firebase.js";
import Landing                       from "./pages/Landing.jsx";
import Registro                      from "./pages/Registro.jsx";
import Login                         from "./pages/Login.jsx";
import Precios                       from "./pages/Precios.jsx";
import Feed                          from "./pages/Feed.jsx";
import Perfil                        from "./pages/Perfil.jsx";
import Buscar                        from "./pages/Buscar.jsx";
import PanelTecnico                  from "./pages/PanelTecnico.jsx";
import RegistrarTrabajo              from "./pages/RegistrarTrabajo.jsx";
import Bienvenida                    from "./pages/Bienvenida.jsx";

const globalCSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', system-ui, sans-serif; background: #F4F5F7; color: #111827; }
input, select, textarea, button { font-family: inherit; }
button { cursor: pointer; }
a { text-decoration: none; color: inherit; }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error capturado por boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FEE2E2", color: "#991B1B", padding: "20px" }}>
          <div style={{ background: "#fff", padding: "30px", borderRadius: "16px", maxWidth: "400px", textAlign: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px" }}>¡Uy! Algo salió mal.</h1>
            <p style={{ fontSize: "14px", marginBottom: "20px" }}>Ocurrió un error inesperado en esta pantalla.</p>
            <button 
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              style={{ background: "#D97706", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [user,    setUser]    = useState(undefined);
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
          <p style={{ color: "#6B7280", fontSize: "14px" }}>Cargando Habilis...</p>
        </div>
      </div>
    );
  }

  const screenProps = { nav, user };

  const renderScreen = () => {
    switch (screen) {
      case "landing": return <Landing {...screenProps} />;
      case "registro": return <Registro {...screenProps} params={params} />;
      case "login": return <Login {...screenProps} />;
      case "precios": return <Precios {...screenProps} />;
      case "feed": return <Feed {...screenProps} />;
      case "buscar": return <Buscar {...screenProps} params={params} />;
      case "perfil": return <Perfil {...screenProps} params={params} />;
      case "panel": return <PanelTecnico {...screenProps} />;
      case "registrarTrabajo": return <RegistrarTrabajo {...screenProps} params={params} />;
      case "bienvenida": return <Bienvenida {...screenProps} />;
      default: return <Landing {...screenProps} />;
    }
  };

  return (
    <ErrorBoundary>
      <style>{globalCSS}</style>
      {renderScreen()}
    </ErrorBoundary>
  );
}