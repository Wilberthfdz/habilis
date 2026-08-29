import { useState, useEffect } from "react";
import Logo from "./Logo.jsx";
import NotifBell from "./NotifBell.jsx";
import { obtenerTecnico, obtenerCliente, cerrarSesion } from "../lib/firebase.js";
import { enviarVerificacionEmailPropio } from "../lib/gemini.js";
import { isAdminUser } from "../lib/admin.js";

const aboutLinks = [
  { label:"Quiénes somos",          route:"quienesSomos" },
  { label:"Lo que ofrecemos",       route:"quienesSomos", params:{ seccion:"ofrecemos" } },
  { label:"Cómo funciona la app",   route:"comoFunciona" },
  { label:"Soporte",                route:"soporte" },
  { label:"Términos y condiciones", route:"terminos" },
  { label:"Aviso de privacidad",    route:"privacidad" },
];

export default function Nav({ nav, user }) {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  // null = aún no sabemos (evita parpadear el botón equivocado); true/false una vez resuelto.
  const [esTecnico, setEsTecnico] = useState(null);
  const [esCliente, setEsCliente] = useState(false);
  const [esEmpresa, setEsEmpresa] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [reenviado,  setReenviado]  = useState(false);
  const [errorReenvio, setErrorReenvio] = useState("");

  // Una cuenta puede tener perfil de técnico Y de cliente a la vez (ver
  // MiCuentaCliente.jsx → "Ofrece tus servicios como técnico"), así que se
  // consultan los dos en vez de asumir que son excluyentes.
  useEffect(() => {
    if (!user) { setEsTecnico(null); setEsCliente(false); setEsEmpresa(false); return; }
    let cancelado = false;
    Promise.all([obtenerTecnico(user.uid), obtenerCliente(user.uid)]).then(([t, c]) => {
      if (cancelado) return;
      setEsTecnico(!!t);
      setEsCliente(!!c);
      setEsEmpresa(t?.plan === "empresa");
    });
    return () => { cancelado = true; };
  }, [user]);

  const logout = async () => { await cerrarSesion(); nav("landing"); };

  const reenviarVerificacion = async () => {
    setReenviando(true); setErrorReenvio("");
    try { await enviarVerificacionEmailPropio(); setReenviado(true); }
    catch (e) { setErrorReenvio(e.message || "No se pudo enviar. Intenta de nuevo en un momento."); }
    finally { setReenviando(false); }
  };

  const primaryLinks = [
    { label:"Buscar",      route:"buscar" },
    { label:"Feed",        route:"feed" },
    { label:"Precios",     route:"precios" },
    ...(user ? [{ label:"Care", route:"habilisCare" }] : []),
    ...(esTecnico === true ? [{ label:"Cotizaciones", route:"cotizaciones" }] : []),
    ...(esEmpresa ? [{ label:"Empleados", route:"empleados" }] : []),
    ...(esCliente ? [{ label:"Mi cuenta", route:"miCuenta" }] : []),
    ...(isAdminUser(user) ? [
      { label:"⚙️ Admin",  route:"admin" },
    ] : []),
  ];

  return (
    <>
    <nav style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 clamp(16px,4vw,40px)", height:"60px",
      position:"sticky", top:0, zIndex:200,
      background:"rgba(8,14,28,0.97)",
      borderBottom:"1px solid rgba(255,255,255,0.06)"
    }}>
      <style>{`
        .nav-link {
          background:transparent; border:none; color:rgba(255,255,255,0.6);
          padding:7px 12px; font-size:13px; font-weight:600; cursor:pointer;
          border-radius:7px; font-family:inherit; transition:color 0.15s, background 0.15s;
          min-height:40px; display:flex; align-items:center;
        }
        .nav-link:hover { color:#fff; background:rgba(255,255,255,0.07); }

        .nav-btn-login {
          background:transparent; color:rgba(255,255,255,0.75);
          border:1.5px solid rgba(255,255,255,0.18); border-radius:7px;
          padding:7px 16px; font-size:13px; font-weight:700; cursor:pointer;
          font-family:inherit; transition:border-color 0.15s, color 0.15s;
          min-height:40px;
        }
        .nav-btn-login:hover { border-color:rgba(255,255,255,0.45); color:#fff; }

        .nav-btn-cta {
          background:#F07020; color:#fff; border:none;
          border-radius:7px; padding:7px 16px;
          font-size:13px; font-weight:800; cursor:pointer;
          font-family:inherit; min-height:40px;
          box-shadow:0 3px 0 #A84E10;
          transform:translateY(0); transition:transform 0.1s, box-shadow 0.1s;
          display:flex; align-items:center; gap:6px;
        }
        .nav-btn-cta:hover { transform:translateY(2px); box-shadow:0 1px 0 #A84E10; }
        .nav-btn-cta:active { transform:translateY(3px); box-shadow:none; }

        .nav-btn-panel {
          background:#F07020; color:#fff; border:none;
          border-radius:7px; padding:7px 16px;
          font-size:13px; font-weight:800; cursor:pointer;
          font-family:inherit; min-height:40px;
          box-shadow:0 3px 0 #A84E10;
          transform:translateY(0); transition:transform 0.1s, box-shadow 0.1s;
        }
        .nav-btn-panel:hover { transform:translateY(2px); box-shadow:0 1px 0 #A84E10; }
        .nav-btn-panel:active { transform:translateY(3px); box-shadow:none; }

        .nav-btn-logout {
          background:transparent; color:rgba(255,255,255,0.5);
          border:1px solid rgba(255,255,255,0.12); border-radius:7px;
          padding:7px 12px; font-size:12px; font-weight:600; cursor:pointer;
          font-family:inherit; min-height:40px;
          transition:background 0.15s, color 0.15s, border-color 0.15s;
        }
        .nav-btn-logout:hover {
          background:rgba(220,38,38,0.12); color:#FCA5A5;
          border-color:rgba(220,38,38,0.3);
        }

        .nav-about-menu {
          position:absolute; top:calc(100% + 8px); left:0; min-width:230px;
          background:#fff; border-radius:12px; padding:8px 0;
          box-shadow:0 12px 32px rgba(0,0,0,0.22); z-index:300;
        }
        .nav-about-item {
          display:block; width:100%; text-align:left; background:none; border:none;
          padding:11px 20px; font-size:13.5px; font-weight:600; color:#475569;
          cursor:pointer; font-family:inherit; transition:background 0.12s, color 0.12s;
        }
        .nav-about-item:hover { background:#F1F5F9; color:#0F172A; }

        @media(min-width:768px) { .nav-hamburger{display:none!important;} }
        @media(max-width:767px) { .nav-desktop{display:none!important;} .nav-hamburger{display:flex!important;} }
      `}</style>

      <Logo size={26} onClick={() => { nav("landing"); setOpen(false); }}/>

      {/* Desktop */}
      <div className="nav-desktop" style={{ display:"flex", alignItems:"center", gap:"2px" }}>
        {primaryLinks.map(l => (
          <button key={l.label} className="nav-link" onClick={() => nav(l.route)}>
            {l.label}
          </button>
        ))}

        {/* Acerca de — dropdown */}
        <div style={{ position:"relative" }}
          onMouseEnter={() => setAboutOpen(true)}
          onMouseLeave={() => setAboutOpen(false)}>
          <button className="nav-link" onClick={() => setAboutOpen(o => !o)}
            style={{ gap:"6px" }}>
            Acerca de
            <svg viewBox="0 0 12 12" width="9" height="9" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round"
              style={{ transform: aboutOpen ? "rotate(180deg)" : "none", transition:"transform 0.15s" }}>
              <path d="M2 4l4 4 4-4"/>
            </svg>
          </button>
          {aboutOpen && (
            <div className="nav-about-menu">
              {aboutLinks.map(l => (
                <button key={l.label} className="nav-about-item"
                  onClick={() => { nav(l.route, l.params || {}); setAboutOpen(false); }}>
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ width:"1px", height:"16px", background:"rgba(255,255,255,0.12)", margin:"0 8px" }}/>
        {user ? (
          <>
            <NotifBell nav={nav} user={user} />
            {esTecnico && <button className="nav-btn-panel" onClick={() => nav("panel")}>Mi Panel</button>}
            {esCliente && <button className="nav-btn-panel" onClick={() => nav("misSolicitudes")}>Mis solicitudes</button>}
            <button className="nav-btn-logout" onClick={logout} style={{ marginLeft:"6px" }}>
              Salir
            </button>
          </>
        ) : (
          <>
            <button className="nav-btn-login" onClick={() => nav("login")}>Entrar</button>
            <button className="nav-btn-cta" onClick={() => nav("registro")} style={{ marginLeft:"8px" }}>
              Registrarme
              <svg viewBox="0 0 12 12" width="10" height="10" fill="currentColor">
                <path d="M6.5 1.5l4 4.5-4 4.5M1.5 6h9"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Hamburger (la campana queda visible también en móvil) */}
      {user && (
        <div className="nav-hamburger" style={{ marginLeft:"auto", marginRight:"4px" }}>
          <NotifBell nav={nav} user={user} />
        </div>
      )}
      <button className="nav-hamburger"
        onClick={() => setOpen(o => !o)}
        style={{ background:"none", border:"none", color:"#fff", cursor:"pointer",
                 padding:"8px", minHeight:"44px", minWidth:"44px",
                 display:"flex", alignItems:"center", justifyContent:"center" }}>
        {open
          ? <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/></svg>
          : <svg viewBox="0 0 20 20" width="20" height="20" fill="currentColor"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        }
      </button>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position:"absolute", top:"60px", left:0, right:0,
          // Opaco a propósito: con fondo translúcido el contenido de la página
          // se transparentaba detrás del menú y estorbaba la lectura.
          background:"#080E1C",
          borderBottom:"1px solid rgba(255,255,255,0.08)",
          padding:"8px 16px 20px", display:"flex", flexDirection:"column", gap:"4px", zIndex:201,
          maxHeight:"calc(100vh - 60px)", overflowY:"auto"
        }}>
          {primaryLinks.map(l => (
            <button key={l.label} className="nav-link" style={{ width:"100%", justifyContent:"flex-start" }}
              onClick={() => { nav(l.route); setOpen(false); }}>
              {l.label}
            </button>
          ))}
          <div style={{ height:"1px", background:"rgba(255,255,255,0.08)", margin:"8px 0" }}/>
          <p style={{ fontSize:"11px", fontWeight:800, color:"rgba(255,255,255,0.35)",
                      letterSpacing:"0.08em", textTransform:"uppercase", padding:"6px 12px" }}>
            Acerca de
          </p>
          {aboutLinks.map(l => (
            <button key={l.label} className="nav-link" style={{ width:"100%", justifyContent:"flex-start" }}
              onClick={() => { nav(l.route, l.params || {}); setOpen(false); }}>
              {l.label}
            </button>
          ))}
          <div style={{ height:"1px", background:"rgba(255,255,255,0.08)", margin:"8px 0" }}/>
          {user ? (
            <>
              {esTecnico && (
                <button className="nav-link" style={{ width:"100%", justifyContent:"flex-start" }}
                  onClick={() => { nav("panel"); setOpen(false); }}>
                  Mi Panel
                </button>
              )}
              {esCliente && (
                <button className="nav-link" style={{ width:"100%", justifyContent:"flex-start" }}
                  onClick={() => { nav("misSolicitudes"); setOpen(false); }}>
                  Mis solicitudes
                </button>
              )}
              <button className="nav-btn-logout" style={{ width:"100%", textAlign:"left", marginTop:"4px" }}
                onClick={() => { logout(); setOpen(false); }}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button className="nav-link" style={{ width:"100%", justifyContent:"flex-start" }}
                onClick={() => { nav("login"); setOpen(false); }}>Entrar</button>
              <button className="nav-btn-cta" style={{ width:"100%", marginTop:"6px", justifyContent:"center" }}
                onClick={() => { nav("registro"); setOpen(false); }}>
                Registrarme gratis
              </button>
            </>
          )}
        </div>
      )}
    </nav>
    {user && !user.emailVerified && (
      <div style={{ background:"linear-gradient(90deg,#F59E0B,#F97316)", color:"#1C1206",
                    padding:"10px 16px", fontSize:"13.5px", display:"flex", alignItems:"center",
                    justifyContent:"center", gap:"12px", flexWrap:"wrap", textAlign:"center",
                    boxShadow:"0 2px 8px rgba(0,0,0,0.15)" }}>
        <span style={{ fontWeight:800 }}>
          ⚠️ Tu correo no está verificado — confírmalo para proteger tu cuenta (revisa tu bandeja y spam).
        </span>
        <button onClick={reenviarVerificacion} disabled={reenviando || reenviado}
          style={{ background:"#1C1206", border:"none",
                   color:"#FDE68A", borderRadius:"7px", padding:"6px 14px", fontSize:"12.5px",
                   fontWeight:800, cursor: reenviado ? "default" : "pointer", flexShrink:0 }}>
          {reenviando ? "Enviando..." : reenviado ? "✓ Correo enviado" : "Reenviar correo →"}
        </button>
        {errorReenvio && (
          <span style={{ fontSize:"12px", fontWeight:700, color:"#7F1D1D" }}>{errorReenvio}</span>
        )}
      </div>
    )}
    </>
  );
}
