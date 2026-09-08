import React, { useState, useEffect, lazy, Suspense } from "react";
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
import EditarPerfil                  from "./pages/EditarPerfil.jsx";
import ElegirTipo                    from "./pages/ElegirTipo.jsx";
import MisSolicitudes                from "./pages/MisSolicitudes.jsx";
import Legal                         from "./pages/Legal.jsx";
import DocumentoLegal                from "./pages/DocumentoLegal.jsx";
import CompletarPerfil               from "./pages/CompletarPerfil.jsx";
import HabilisCare                   from "./pages/HabilisCare.jsx";
import DetalleActivo                 from "./pages/DetalleActivo.jsx";
import Cotizaciones                  from "./pages/Cotizaciones.jsx";
import EditorCotizacion              from "./pages/EditorCotizacion.jsx";
import VistaCotizacion               from "./pages/VistaCotizacion.jsx";
import SolicitarServicio             from "./pages/SolicitarServicio.jsx";
import Chat                          from "./pages/Chat.jsx";
import MiRed                         from "./pages/MiRed.jsx";
import Privacidad                    from "./pages/Privacidad.jsx";
import QuienesSomos                  from "./pages/QuienesSomos.jsx";
import ComoFunciona                  from "./pages/ComoFunciona.jsx";
import Soporte                       from "./pages/Soporte.jsx";
import SuscripcionPro                from "./pages/SuscripcionPro.jsx";

// Carga diferida: el ERP admin y la página de inversión solo los ve un
// puñado de personas — no tienen por qué pesar en el bundle de todos.
const Admin     = lazy(() => import("./pages/Admin.jsx"));
const Inversion = lazy(() => import("./pages/Inversion.jsx"));

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

/* ── ACCESIBILIDAD ──
   Foco visible para quien navega con teclado o con un conmutador; solo se
   pinta cuando el foco viene del teclado, para no ensuciar el clic. */
:focus-visible { outline: 3px solid #F97316; outline-offset: 2px; border-radius: 6px; }
button:focus:not(:focus-visible) { outline: none; }
/* Enlace "Saltar al contenido": invisible hasta que recibe el foco. */
.saltar { position: absolute; left: -9999px; top: 8px; z-index: 9999; background: #0F172A; color: #fff;
          padding: 10px 16px; border-radius: 8px; font-weight: 700; }
.saltar:focus { left: 8px; }
/* Quien pidió menos movimiento en su sistema no recibe animaciones. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
                           transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
/* Quien pidió más contraste: texto claro sobre naranja pasa a texto oscuro
   y los grises tenues suben. Los estilos van en línea, por eso se apunta al
   atributo tal como lo serializa el navegador. */
@media (prefers-contrast: more) {
  button[style*="background: rgb(249, 115, 22)"], .h-btn-orange, .nav-btn-cta, .hab-btn-primary, .hab-btn-card
    { color: #0F172A !important; }
  [style*="color: rgba(255, 255, 255, 0.3"], [style*="color: rgba(255, 255, 255, 0.4"],
  [style*="color: rgba(255, 255, 255, 0.5"], [style*="color: rgba(255, 255, 255, 0.6"]
    { color: rgba(255, 255, 255, 0.92) !important; }
  [style*="color: rgb(148, 163, 184)"], [style*="color: rgb(100, 116, 139)"] { color: #1E293B !important; }
}
.h-btn-orange { background:#F97316; color:#fff; border:none; border-radius:10px; font-weight:700; cursor:pointer; transition:background 0.15s,transform 0.1s; }
.h-btn-orange:hover { background:#EA580C; }
.h-btn-orange:active { transform:scale(0.98); }
.h-card { background:#fff; border:1px solid #E2E8F0; border-radius:16px; box-shadow:0 1px 3px rgba(0,0,0,0.06); transition:box-shadow 0.2s,transform 0.2s; }
.h-card:hover { box-shadow:0 8px 24px rgba(0,0,0,0.1); }

/* ── MOBILE RESPONSIVE ── */
button, a, label[for], input[type=file] + * { min-height:44px; }
input, select, textarea { font-size:16px !important; } /* prevent iOS zoom */
@media (max-width:640px) {
  body { font-size:15px; }
  /* Una sola columna. Los selectores anteriores buscaban "gridTemplateColumns"
     y 'borderRadius:"16px"', que es como se escribe en JSX — pero el
     navegador ve "grid-template-columns" y "border-radius". Ninguna regla
     aplicaba: todas las rejillas de 2 y 3 columnas seguían igual en el
     teléfono, apretadas contra el borde. */
  [style*="grid-template-columns"] { grid-template-columns:1fr !important; }
  [style*="border-radius: 16px"] { padding:14px !important; }
  /* Prevent overflow */
  * { max-width:100vw; }
  /* Table horizontal scroll */
  table { display:block; overflow-x:auto; -webkit-overflow-scrolling:touch; }
}
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

// Rutas compartibles. Antes solo unas pocas pantallas tenían URL: entrar a
// /registro desde un anuncio, compartir una búsqueda o usar el botón "atrás"
// del navegador devolvía al landing, y ninguna de esas pantallas era
// indexable. La tabla es la única fuente de verdad en los dos sentidos.
const RUTAS_URL = {
  landing:         "/",
  registro:        "/registro",
  login:           "/entrar",
  precios:         "/precios",
  buscar:          "/buscar",
  feed:            "/feed",
  panel:           "/panel",
  editarPerfil:    "/panel/editar",
  completarPerfil: "/completar-perfil",
  elegirTipo:      "/empezar",
  misSolicitudes:  "/mis-solicitudes",
  bienvenida:      "/bienvenida",
  habilisCare:     "/care",
  cotizaciones:    "/cotizaciones",
  miRed:           "/mi-red",
  quienesSomos:    "/quienes-somos",
  comoFunciona:    "/como-funciona",
  soporte:         "/soporte",
  suscripcionPro:  "/pro",
  terminos:        "/terminos",
  legal:           "/legal",
  // documentoLegal no va aquí: su ruta es /legal/<slug> y la resuelven
  // rutaDe y pantallaDe. Ponerla como "/legal" pisaba la del índice.
  privacidad:      "/privacidad",
  inversion:       "/inversion",
  admin:           "/admin",
};

const PANTALLA_POR_RUTA = Object.fromEntries(
  Object.entries(RUTAS_URL).map(([pantalla, ruta]) => [ruta, pantalla]));

// Pantallas que necesitan un parámetro para tener sentido (un perfil, un
// chat, una cotización). No se reflejan en la URL: sin el id la pantalla
// llegaría vacía, así que al recargar o volver atrás se cae al landing.
const rutaDe = (pantalla, params = {}) => {
  // Cada documento legal tiene su propia URL: /legal/<slug>.
  if (pantalla === "documentoLegal" && params.slug) return `/legal/${params.slug}`;
  // La búsqueda "Habilis Incluyente" tiene URL propia para poder compartirla.
  if (pantalla === "buscar" && params.incluyente === true) return "/incluyente";
  return RUTAS_URL[pantalla] || null;
};

// Pantallas que no existen sin sesión. Al abrirlas por URL sin haber
// iniciado sesión mandamos al login en vez de renderizar una pantalla rota.
const REQUIEREN_SESION = new Set([
  "panel", "editarPerfil", "completarPerfil", "elegirTipo", "misSolicitudes",
  "bienvenida", "habilisCare", "cotizaciones", "miRed", "admin",
]);
// /pro se queda fuera a propósito: la página explica el plan y ofrece
// iniciar sesión sin perder la intención de compra.

const pantallaDe = path => {
  const limpio = path.replace(/\/+$/, "") || "/";
  if (limpio.startsWith("/legal/")) return "documentoLegal";
  if (limpio === "/incluyente") return "buscar";
  return PANTALLA_POR_RUTA[limpio] || "landing";
};
const paramsDe = path => {
  const limpio = path.replace(/\/+$/, "") || "/";
  if (limpio === "/incluyente") return { incluyente: true };
  const m = /^\/legal\/([a-z0-9-]+)$/.exec(limpio);
  return m ? { slug: m[1] } : {};
};

// Las cotizaciones se comparten por WhatsApp como `?vista=<id>`. El router
// solo miraba la ruta, así que TODOS esos enlaces caían en la portada y el
// cliente nunca veía la cotización que le mandaron.
const arranqueDesdeURL = () => {
  const vista = new URLSearchParams(window.location.search).get("vista");
  if (vista) return { screen: "vistaCotizacion", params: { token: vista } };
  return { screen: pantallaDe(window.location.pathname), params: paramsDe(window.location.pathname) };
};

export default function App() {
  const [user,    setUser]    = useState(undefined);
  const arranque = arranqueDesdeURL();
  const [screen,  setScreen]  = useState(arranque.screen);
  const [params,  setParams]  = useState(arranque.params);

  useEffect(() => {
    const unsub = onAuth(u => setUser(u || null));
    return unsub;
  }, []);

  // Botón "atrás" del navegador. Sin esto la URL cambiaba pero la pantalla
  // no, y el usuario quedaba viendo /precios con el contenido del panel.
  useEffect(() => {
    const alVolver = () => {
      setScreen(pantallaDe(window.location.pathname));
      setParams(paramsDe(window.location.pathname));
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", alVolver);
    return () => window.removeEventListener("popstate", alVolver);
  }, []);

  const nav = (screen, params = {}) => {
    const path = rutaDe(screen, params);
    // Las pantallas con parámetro conservan la URL de donde vienen: no se
    // pueden reconstruir desde la barra de direcciones.
    if (path && window.location.pathname !== path) {
      window.history.pushState({ screen }, "", path);
    }
    setScreen(screen);
    setParams(params);
    window.scrollTo(0, 0);
  };

  if (user === undefined) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid #F97316", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ color: "#6B7280", fontSize: "14px" }}>Cargando Habilis...</p>
        </div>
      </div>
    );
  }

  // Cortafuegos de navegación: /panel o /pro abiertos por URL sin sesión
  // aterrizaban en una pantalla vacía; ahora llevan al login.
  const pantalla = (!user && REQUIEREN_SESION.has(screen)) ? "login" : screen;

  const screenProps = { nav, user };

  const renderScreen = () => {
    switch (pantalla) {
      case "landing": return <Landing {...screenProps} />;
      case "registro": return <Registro {...screenProps} params={params} />;
      case "login": return <Login {...screenProps} params={params} />;
      case "precios": return <Precios {...screenProps} />;
      case "feed": return <Feed {...screenProps} />;
      case "buscar": return <Buscar {...screenProps} params={params} />;
      case "perfil": return <Perfil {...screenProps} params={params} user={user} />;
      case "panel": return <PanelTecnico {...screenProps} />;
      case "registrarTrabajo": return <RegistrarTrabajo {...screenProps} params={params} />;
      case "bienvenida":      return <Bienvenida {...screenProps} />;
      case "completarPerfil": return <CompletarPerfil {...screenProps} params={params} />;
      case "editarPerfil":    return <EditarPerfil     {...screenProps} />;
      case "elegirTipo":      return <ElegirTipo       {...screenProps} params={params} />;
      case "misSolicitudes":  return <MisSolicitudes   {...screenProps} />;
      case "habilisCare":      return <HabilisCare      {...screenProps} />;
      case "detalleActivo":   return <DetalleActivo   {...screenProps} params={params} />;
      case "cotizaciones":    return <Cotizaciones     {...screenProps} />;
      case "editorCotizacion":return <EditorCotizacion {...screenProps} params={params} />;
      case "vistaCotizacion":    return <VistaCotizacion    {...screenProps} params={params} />;
      case "solicitarServicio":  return <SolicitarServicio  {...screenProps} params={params} />;
      case "chat":               return <Chat               {...screenProps} params={params} />;
      case "miRed":              return <MiRed              {...screenProps} />;
      case "admin":              return <Admin              {...screenProps} />;
      case "inversion":          return <Inversion          {...screenProps} />;
      case "privacidad":         return <Privacidad         {...screenProps} />;
      // /terminos se conserva por los enlaces antiguos; hoy es el Centro Legal.
      case "terminos":           return <Legal              {...screenProps} />;
      case "legal":              return <Legal              {...screenProps} />;
      case "documentoLegal":     return <DocumentoLegal     {...screenProps} params={params} />;
      case "quienesSomos":       return <QuienesSomos       {...screenProps} params={params} />;
      case "comoFunciona":       return <ComoFunciona       {...screenProps} />;
      case "soporte":            return <Soporte            {...screenProps} />;
      case "suscripcionPro":     return <SuscripcionPro     {...screenProps} />;
      default: return <Landing {...screenProps} />;
    }
  };

  return (
    <ErrorBoundary>
      <style>{globalCSS}</style>
      <a href="#contenido" className="saltar">Saltar al contenido</a>
      <Suspense fallback={
        <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:"40px", height:"40px", border:"3px solid #D97706", borderTopColor:"transparent",
                        borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
        </div>
      }>
        <main id="contenido">{renderScreen()}</main>
      </Suspense>
    </ErrorBoundary>
  );
}