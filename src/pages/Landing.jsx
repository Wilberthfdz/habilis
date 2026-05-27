// ─── LANDING PAGE — Oficio.mx ─────────────────────────────────────────────
const s = {
  hero:    { background:"#1E2A3B", color:"#fff", padding:"80px 20px", textAlign:"center" },
  logo:    { background:"#D97706", color:"#fff", fontWeight:900, fontSize:"18px", padding:"5px 12px", borderRadius:"8px", display:"inline-block", marginBottom:"24px" },
  h1:      { fontSize:"clamp(28px,5vw,48px)", fontWeight:900, lineHeight:1.1, marginBottom:"16px" },
  accent:  { color:"#D97706" },
  sub:     { color:"rgba(255,255,255,0.6)", fontSize:"16px", marginBottom:"36px", maxWidth:"480px", margin:"0 auto 36px", lineHeight:1.6 },
  cats:    { maxWidth:"960px", margin:"0 auto", padding:"40px 20px" },
  cat:     { background:"#fff", border:"1px solid #E5E7EB", borderRadius:"12px", padding:"16px 10px", textAlign:"center", cursor:"pointer" },
  btn:     { background:"#D97706", color:"#fff", border:"none", borderRadius:"12px", padding:"13px 26px", fontSize:"15px", fontWeight:700, cursor:"pointer" },
  btnOut:  { background:"transparent", color:"rgba(255,255,255,0.7)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:"12px", padding:"13px 26px", fontSize:"15px", fontWeight:600, cursor:"pointer" },
};

const CATS = [
  ["⚡","Electricidad"],["❄️","Minisplits"],["🔧","Mecánica"],["🚿","Plomería"],
  ["📷","Cámaras"],["🏗️","Herrería"],["🪟","Tablaroca"],["🎨","Pintura"],["⚙️","Motores"],["🌡️","Refrigeración"],
];

export default function Landing({ nav }) {
  return (
    <div style={{ minHeight:"100vh", background:"#F4F5F7", fontFamily:"'Inter',system-ui" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <nav style={{ background:"#1E2A3B", padding:"0 20px", height:"56px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ ...s.logo, marginBottom:0, fontSize:"15px", padding:"4px 10px" }}>OFICIO</span>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={() => nav("buscar")} style={{ ...s.btnOut, padding:"7px 14px", fontSize:"12px" }}>Buscar técnico</button>
          <button onClick={() => nav("registro")} style={{ ...s.btn, padding:"7px 14px", fontSize:"12px" }}>Registrarme</button>
        </div>
      </nav>

      <div style={s.hero}>
        <div style={s.logo}>OFICIO.MX</div>
        <h1 style={s.h1}>Técnicos verificados con<br /><span style={s.accent}>trabajos documentados</span></h1>
        <p style={s.sub}>Perfiles reales · Evidencia antes/después · Reputación basada en hechos</p>
        <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
          <button style={s.btn} onClick={() => nav("buscar")}>Buscar técnico →</button>
          <button style={s.btnOut} onClick={() => nav("registro", { modo:"tecnico" })}>Soy técnico — registro gratis</button>
        </div>
        <div style={{ display:"flex", gap:"32px", justifyContent:"center", marginTop:"40px", flexWrap:"wrap" }}>
          {[["30M+","Trabajadores en México sin reputación digital"],["$100","MXN/mes Plan Pro para técnicos"],["Gratis","Para clientes siempre"]].map(([n,l]) => (
            <div key={n} style={{ textAlign:"center" }}>
              <div style={{ fontWeight:900, fontSize:"22px", color:"#D97706" }}>{n}</div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", marginTop:"3px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.cats}>
        <p style={{ fontSize:"11px", fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"16px", textAlign:"center" }}>Servicios disponibles</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:"10px" }}>
          {CATS.map(([icon,label]) => (
            <button key={label} style={s.cat} onClick={() => nav("buscar", { oficio:label })}>
              <div style={{ fontSize:"26px", marginBottom:"8px" }}>{icon}</div>
              <div style={{ fontSize:"12px", fontWeight:600, color:"#111827", lineHeight:1.3 }}>{label}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ background:"#1E2A3B", color:"#fff", padding:"60px 20px", textAlign:"center" }}>
        <p style={{ color:"#D97706", fontSize:"12px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"12px" }}>¿Eres técnico?</p>
        <h2 style={{ fontSize:"28px", fontWeight:900, marginBottom:"12px" }}>Construye tu historial profesional</h2>
        <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"14px", maxWidth:"420px", margin:"0 auto 28px", lineHeight:1.6 }}>
          Registra tus trabajos con fotos, acumula reputación real, consigue más clientes. La IA de Gemini escribe tu perfil aunque no escribas bien.
        </p>
        <button style={s.btn} onClick={() => nav("registro")}>Crear perfil gratis →</button>
      </div>

      <div style={{ background:"#fff", borderTop:"1px solid #E5E7EB", padding:"20px", textAlign:"center" }}>
        <span style={{ ...s.logo, fontSize:"13px", padding:"3px 8px" }}>OFICIO</span>
        <p style={{ color:"#9CA3AF", fontSize:"12px", marginTop:"8px" }}>Infraestructura de confianza para trabajadores técnicos · México 2025</p>
      </div>
    </div>
  );
}
