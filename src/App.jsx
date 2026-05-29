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
import CompletarPerfil               from "./pages/CompletarPerfil.jsx";
import HabilisCare                   from "./pages/HabilisCare.jsx";
import DetalleActivo                 from "./pages/DetalleActivo.jsx";
import PlanCare                      from "./pages/PlanCare.jsx";
import Cotizaciones                  from "./pages/Cotizaciones.jsx";
import EditorCotizacion              from "./pages/EditorCotizacion.jsx";
import VistaCotizacion               from "./pages/VistaCotizacion.jsx";
import SolicitarServicio             from "./pages/SolicitarServicio.jsx";
import Chat                          from "./pages/Chat.jsx";
import MiRed                         from "./pages/MiRed.jsx";

const globalCSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #F1F5F9; color: #0F172A; -webkit-font-smoothing: antialiased; }
input, select, textarea, button { font-family: inherit; }
button { cursor: pointer; }
a { text-decoration: none; color: inherit; }
img { max-width: 100%; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes blob { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.06)} 66%{transform:translate(-20px,25px) scale(0.95)} }
@keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-35px,15px) scale(1.08)} 66%{transform:translate(20px,-28px) scale(0.93)} }
input::placeholder { color: rgba(148,163,184,0.7); }
input:focus, textarea:focus, select:focus { outline: 2px solid #F97316; outline-offset: -1px; }
.h-btn-orange { background:#F97316; color:#fff; border:none; border-radius:10px; font-weight:700; cursor:pointer; transition:background 0.15s,transform 0.1s; }
.h-btn-orange:hover { background:#EA580C; }
.h-btn-orange:active { transform:scale(0.98); }
.h-card { background:#fff; border:1px solid #E2E8F0; border-radius:16px; box-shadow:0 1px 3px rgba(0,0,0,0.06); transition:box-shadow 0.2s,transform 0.2s; }
.h-card:hover { box-shadow:0 8px 24px rgba(0,0,0,0.1); }
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
      case "perfil": return <Perfil {...screenProps} params={params} user={user} />;
      case "panel": return <PanelTecnico {...screenProps} />;
      case "registrarTrabajo": return <RegistrarTrabajo {...screenProps} params={params} />;
      case "bienvenida":      return <Bienvenida {...screenProps} />;
      case "completarPerfil": return <CompletarPerfil {...screenProps} />;
      case "habilisCare":      return <HabilisCare      {...screenProps} />;
      case "detalleActivo":   return <DetalleActivo   {...screenProps} params={params} />;
      case "planCare":        return <PlanCare         {...screenProps} />;
      case "cotizaciones":    return <Cotizaciones     {...screenProps} />;
      case "editorCotizacion":return <EditorCotizacion {...screenProps} params={params} />;
      case "vistaCotizacion":    return <VistaCotizacion    {...screenProps} params={params} />;
      case "solicitarServicio":  return <SolicitarServicio  {...screenProps} params={params} />;
      case "chat":               return <Chat               {...screenProps} params={params} />;
      case "miRed":              return <MiRed              {...screenProps} />;
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