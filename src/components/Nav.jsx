import Logo from "./Logo.jsx";

export default function Nav({ nav, user, onLogout }) {
  const link = (label, route) => (
    <button key={label} onClick={() => nav(route)}
      style={{ background:"transparent", color:"rgba(255,255,255,0.7)", border:"none",
               padding:"8px 12px", fontSize:"13px", fontWeight:600, cursor:"pointer", borderRadius:"8px" }}
      onMouseEnter={e => e.currentTarget.style.color="#fff"}
      onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.7)"}
    >{label}</button>
  );

  return (
    <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"0 24px", height:"60px", position:"sticky", top:0, zIndex:200,
                  background:"rgba(15,23,42,0.85)", backdropFilter:"blur(16px)",
                  borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
      <Logo size={30} onClick={() => nav("landing")} />

      <div style={{ display:"flex", gap:"4px", alignItems:"center" }}>
        {link("Buscar","buscar")}
        {link("Feed","feed")}
        {link("Precios","precios")}
        <div style={{ width:"1px", height:"18px", background:"rgba(255,255,255,0.15)", margin:"0 8px" }} />
        {user ? (
          <>
            <button onClick={() => nav("panel")}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"9px",
                       padding:"8px 18px", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>
              Mi Panel →
            </button>
            {onLogout && (
              <button onClick={onLogout}
                style={{ background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.7)",
                         border:"1px solid rgba(255,255,255,0.15)", borderRadius:"9px",
                         padding:"7px 14px", fontSize:"13px", fontWeight:600, cursor:"pointer",
                         marginLeft:"6px" }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(239,68,68,0.18)"; e.currentTarget.style.color="#FCA5A5"; e.currentTarget.style.borderColor="rgba(239,68,68,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.08)"; e.currentTarget.style.color="rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.15)"; }}>
                Cerrar sesión
              </button>
            )}
          </>
        ) : (
          <>
            <button onClick={() => nav("login")}
              style={{ background:"rgba(255,255,255,0.08)", color:"#fff", border:"1px solid rgba(255,255,255,0.15)",
                       borderRadius:"9px", padding:"7px 16px", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
              Entrar
            </button>
            <button onClick={() => nav("registro")}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"9px",
                       padding:"8px 18px", fontSize:"13px", fontWeight:700, cursor:"pointer", marginLeft:"6px" }}>
              Registrarme
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
