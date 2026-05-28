export default function Bienvenida({ nav }) {
  return (
    <div style={{ minHeight:"100vh", background:"#1E2A3B", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ background:"rgba(255,255,255,0.06)", padding:"48px 40px", borderRadius:"24px", width:"100%", maxWidth:"420px", border:"1px solid rgba(255,255,255,0.1)", textAlign:"center" }}>
        <div style={{ background:"#D97706", color:"#fff", fontWeight:900, fontSize:"17px", padding:"5px 14px", borderRadius:"8px", display:"inline-block", marginBottom:"28px", letterSpacing:"0.05em" }}>
          HABILIS
        </div>
        <div style={{ fontSize:"52px", marginBottom:"16px" }}>🎉</div>
        <h1 style={{ fontSize:"28px", fontWeight:800, marginBottom:"10px" }}>¡Tu perfil fue creado!</h1>
        <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"15px", marginBottom:"36px", lineHeight:1.6 }}>
          Bienvenido a Habilis. Ya estás listo para documentar tus trabajos y construir tu reputación profesional.
        </p>

        <button
          style={{ width:"100%", background:"#D97706", color:"#fff", border:"none", borderRadius:"12px", padding:"14px", fontSize:"16px", fontWeight:700, cursor:"pointer", marginBottom:"12px" }}
          onClick={() => nav("panel")}
        >
          Ir a mi Panel →
        </button>
        <button
          style={{ width:"100%", background:"transparent", color:"rgba(255,255,255,0.5)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:"12px", padding:"12px", fontSize:"14px", fontWeight:600, cursor:"pointer" }}
          onClick={() => nav("registrarTrabajo")}
        >
          Documentar mi primer trabajo
        </button>
      </div>
    </div>
  );
}
