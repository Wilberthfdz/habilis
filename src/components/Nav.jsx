import { useState } from "react";
import Logo from "./Logo.jsx";

export default function Nav({ nav, user, onLogout }) {
  const [open, setOpen] = useState(false);

  const primaryLinks = [
    { label:"Buscar",      route:"buscar" },
    { label:"Feed",        route:"feed" },
    { label:"Precios",     route:"precios" },
    ...(user ? [
      { label:"Care",      route:"habilisCare" },
      { label:"Cotizaciones", route:"cotizaciones" },
    ] : []),
    ...(user?.email === "wilberthfdz@gmail.com" ? [
      { label:"⚙️ Admin",  route:"admin" },
    ] : []),
  ];

  return (
    <nav style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 clamp(16px,4vw,40px)", height:"60px",
      position:"sticky", top:0, zIndex:200,
      background:"rgba(8,14,28,0.94)", backdropFilter:"blur(20px)",
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
        <div style={{ width:"1px", height:"16px", background:"rgba(255,255,255,0.12)", margin:"0 8px" }}/>
        {user ? (
          <>
            <button className="nav-btn-panel" onClick={() => nav("panel")}>Mi Panel</button>
            {onLogout && (
              <button className="nav-btn-logout" onClick={onLogout} style={{ marginLeft:"6px" }}>
                Salir
              </button>
            )}
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

      {/* Hamburger */}
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
          background:"rgba(8,14,28,0.98)", backdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(255,255,255,0.08)",
          padding:"8px 16px 20px", display:"flex", flexDirection:"column", gap:"4px", zIndex:201
        }}>
          {primaryLinks.map(l => (
            <button key={l.label} className="nav-link" style={{ width:"100%", justifyContent:"flex-start" }}
              onClick={() => { nav(l.route); setOpen(false); }}>
              {l.label}
            </button>
          ))}
          <div style={{ height:"1px", background:"rgba(255,255,255,0.08)", margin:"8px 0" }}/>
          {user ? (
            <>
              <button className="nav-link" style={{ width:"100%", justifyContent:"flex-start" }}
                onClick={() => { nav("panel"); setOpen(false); }}>Mi Panel</button>
              {onLogout && (
                <button className="nav-btn-logout" style={{ width:"100%", textAlign:"left", marginTop:"4px" }}
                  onClick={() => { onLogout(); setOpen(false); }}>
                  Cerrar sesión
                </button>
              )}
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
  );
}
