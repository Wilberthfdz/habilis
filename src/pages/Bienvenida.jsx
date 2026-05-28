import Logo from "../components/Logo.jsx";

export default function Bienvenida({ nav }) {
  return (
    <div style={{ minHeight:"100vh", background:"#0F172A", display:"flex", flexDirection:"column",
                  position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"-20%", right:"-10%", width:"500px", height:"500px",
                    background:"radial-gradient(circle,rgba(249,115,22,0.16) 0%,transparent 65%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-20%", left:"-10%", width:"400px", height:"400px",
                    background:"radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 65%)", pointerEvents:"none" }} />

      <div style={{ padding:"18px 24px", position:"relative", zIndex:1 }}>
        <Logo size={30} onClick={() => nav("landing")} />
      </div>

      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center",
                    padding:"20px", position:"relative", zIndex:1 }}>
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)",
                      borderRadius:"24px", padding:"52px 40px", width:"100%", maxWidth:"440px",
                      textAlign:"center", backdropFilter:"blur(16px)" }}>
          <div style={{ fontSize:"64px", marginBottom:"20px", animation:"fadeUp 0.6s ease forwards" }}>🎉</div>
          <h1 style={{ fontSize:"30px", fontWeight:900, color:"#fff", marginBottom:"10px" }}>
            ¡Tu perfil fue creado!
          </h1>
          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"15px", lineHeight:1.65, marginBottom:"36px" }}>
            Bienvenido a Habilis. Ya estás listo para documentar tus trabajos y construir tu reputación profesional en México.
          </p>

          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            <button onClick={() => nav("panel")}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"12px",
                       padding:"15px", fontSize:"16px", fontWeight:800, cursor:"pointer",
                       boxShadow:"0 4px 16px rgba(249,115,22,0.35)" }}>
              Ir a mi Panel →
            </button>
            <button onClick={() => nav("registrarTrabajo")}
              style={{ background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.65)",
                       border:"1px solid rgba(255,255,255,0.12)", borderRadius:"12px",
                       padding:"14px", fontSize:"14px", fontWeight:600, cursor:"pointer" }}>
              Documentar mi primer trabajo
            </button>
          </div>

          <div style={{ marginTop:"24px", display:"flex", gap:"16px", justifyContent:"center" }}>
            {["Perfil creado ✓","Apareces en búsquedas ✓","Plan gratis activo ✓"].map(t => (
              <span key={t} style={{ color:"rgba(255,255,255,0.25)", fontSize:"11px" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
