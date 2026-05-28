const s = {
  hero:   { background:"#1E2A3B", color:"#fff", padding:"80px 20px", textAlign:"center" },
  logo:   { background:"#D97706", color:"#fff", fontWeight:900, fontSize:"18px", padding:"5px 14px", borderRadius:"8px", display:"inline-block", letterSpacing:"0.05em" },
  h1:     { fontSize:"clamp(28px,5vw,52px)", fontWeight:900, lineHeight:1.1, marginBottom:"16px" },
  accent: { color:"#D97706" },
  sub:    { color:"rgba(255,255,255,0.6)", fontSize:"17px", marginBottom:"36px", maxWidth:"500px", margin:"0 auto 36px", lineHeight:1.6 },
  btn:    { background:"#D97706", color:"#fff", border:"none", borderRadius:"12px", padding:"14px 28px", fontSize:"15px", fontWeight:700, cursor:"pointer" },
  btnOut: { background:"transparent", color:"rgba(255,255,255,0.75)", border:"1px solid rgba(255,255,255,0.3)", borderRadius:"12px", padding:"14px 28px", fontSize:"15px", fontWeight:600, cursor:"pointer" },
  navBtn: { background:"transparent", color:"rgba(255,255,255,0.7)", border:"none", borderRadius:"8px", padding:"7px 14px", fontSize:"13px", fontWeight:600, cursor:"pointer" },
  navBtnSolid: { background:"#D97706", color:"#fff", border:"none", borderRadius:"8px", padding:"7px 14px", fontSize:"13px", fontWeight:700, cursor:"pointer" },
};

const CATS = [
  ["⚡","Electricidad"],["❄️","Minisplits"],["🔧","Mecánica"],["🚿","Plomería"],
  ["📷","Cámaras CCTV"],["🏗️","Herrería"],["🪟","Tablaroca"],["🎨","Pintura"],
  ["⚙️","Motores"],["🌡️","Refrigeración"],["🛠️","Albañilería"],["🌐","Redes"],
];

export default function Landing({ nav, user }) {
  return (
    <div style={{ minHeight:"100vh", background:"#F4F5F7", fontFamily:"'Inter',system-ui" }}>

      {/* NAV */}
      <nav style={{ background:"#1E2A3B", padding:"0 20px", height:"58px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <span style={{ ...s.logo, marginBottom:0, fontSize:"16px", padding:"4px 12px", cursor:"pointer" }} onClick={() => nav("landing")}>HABILIS</span>
        <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
          <button onClick={() => nav("buscar")} style={s.navBtn}>Buscar</button>
          <button onClick={() => nav("feed")} style={s.navBtn}>Feed</button>
          <button onClick={() => nav("precios")} style={s.navBtn}>Precios</button>
          {user
            ? <button onClick={() => nav("panel")} style={s.navBtnSolid}>Mi Panel →</button>
            : <>
                <button onClick={() => nav("login")} style={{ ...s.navBtn, border:"1px solid rgba(255,255,255,0.25)", borderRadius:"8px" }}>Entrar</button>
                <button onClick={() => nav("registro")} style={s.navBtnSolid}>Registrarme</button>
              </>
          }
        </div>
      </nav>

      {/* HERO */}
      <div style={s.hero}>
        <div style={{ ...s.logo, marginBottom:"24px" }}>HABILIS</div>
        <h1 style={s.h1}>Técnicos verificados con<br /><span style={s.accent}>trabajos documentados</span></h1>
        <p style={s.sub}>Perfiles reales · Evidencia antes/después · Reputación basada en hechos</p>
        <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
          <button style={s.btn} onClick={() => nav("buscar")}>Buscar técnico →</button>
          <button style={s.btnOut} onClick={() => nav("registro")}>Soy técnico — registro gratis</button>
        </div>
        <div style={{ display:"flex", gap:"40px", justifyContent:"center", marginTop:"48px", flexWrap:"wrap" }}>
          {[["30M+","Trabajadores en México sin reputación digital"],["$100","MXN/mes Plan Pro para técnicos"],["Gratis","Para clientes siempre"]].map(([n,l]) => (
            <div key={n} style={{ textAlign:"center" }}>
              <div style={{ fontWeight:900, fontSize:"24px", color:"#D97706" }}>{n}</div>
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:"12px", marginTop:"4px", maxWidth:"120px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"48px 20px" }}>
        <p style={{ fontSize:"11px", fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"8px", textAlign:"center" }}>¿Cómo funciona?</p>
        <h2 style={{ fontSize:"clamp(20px,4vw,30px)", fontWeight:900, textAlign:"center", marginBottom:"36px" }}>Simple, transparente, real</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"24px", maxWidth:"860px", margin:"0 auto" }}>
          {[
            ["1","Regístrate gratis","Crea tu perfil técnico en 3 minutos. Sin tarjeta, sin contratos."],
            ["2","Documenta tus trabajos","Sube fotos antes/después y describe cada trabajo. Construye tu historial."],
            ["3","Clientes te encuentran","Apareces en búsquedas por oficio y ciudad. Los clientes ven tu reputación real."],
          ].map(([n,t,d]) => (
            <div key={n} style={{ textAlign:"center", padding:"20px" }}>
              <div style={{ width:"40px", height:"40px", background:"#1E2A3B", color:"#D97706", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:"18px", margin:"0 auto 14px" }}>{n}</div>
              <p style={{ fontWeight:700, fontSize:"15px", marginBottom:"6px" }}>{t}</p>
              <p style={{ color:"#6B7280", fontSize:"13px", lineHeight:1.5 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"40px 20px" }}>
        <p style={{ fontSize:"11px", fontWeight:700, color:"#9CA3AF", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"16px", textAlign:"center" }}>Servicios disponibles</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:"10px" }}>
          {CATS.map(([icon,label]) => (
            <button key={label}
              style={{ background:"#fff", border:"1px solid #E5E7EB", borderRadius:"12px", padding:"16px 10px", textAlign:"center", cursor:"pointer", transition:"box-shadow 0.15s" }}
              onClick={() => nav("buscar", { oficio:label })}
              onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.08)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow="none"}
            >
              <div style={{ fontSize:"26px", marginBottom:"8px" }}>{icon}</div>
              <div style={{ fontSize:"12px", fontWeight:600, color:"#111827", lineHeight:1.3 }}>{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA TECHNICO */}
      <div style={{ background:"#1E2A3B", color:"#fff", padding:"64px 20px", textAlign:"center" }}>
        <p style={{ color:"#D97706", fontSize:"12px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"12px" }}>¿Eres técnico?</p>
        <h2 style={{ fontSize:"clamp(22px,4vw,34px)", fontWeight:900, marginBottom:"12px" }}>Construye tu historial profesional</h2>
        <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"15px", maxWidth:"460px", margin:"0 auto 28px", lineHeight:1.6 }}>
          Registra tus trabajos con fotos, acumula reputación real, consigue más clientes. La IA de Gemini escribe tu perfil aunque no escribas bien.
        </p>
        <button style={s.btn} onClick={() => nav("registro")}>Crear perfil gratis →</button>
      </div>

      {/* FOOTER */}
      <div style={{ background:"#fff", borderTop:"1px solid #E5E7EB", padding:"24px 20px", textAlign:"center" }}>
        <span style={{ ...s.logo, fontSize:"13px", padding:"3px 10px" }}>HABILIS</span>
        <p style={{ color:"#9CA3AF", fontSize:"12px", marginTop:"10px" }}>Infraestructura de confianza para trabajadores técnicos · México 2025</p>
        <div style={{ display:"flex", gap:"16px", justifyContent:"center", marginTop:"12px" }}>
          <button onClick={() => nav("buscar")} style={{ background:"none", border:"none", color:"#9CA3AF", fontSize:"12px", cursor:"pointer" }}>Buscar técnicos</button>
          <button onClick={() => nav("precios")} style={{ background:"none", border:"none", color:"#9CA3AF", fontSize:"12px", cursor:"pointer" }}>Precios</button>
          <button onClick={() => nav("feed")} style={{ background:"none", border:"none", color:"#9CA3AF", fontSize:"12px", cursor:"pointer" }}>Feed</button>
        </div>
      </div>
    </div>
  );
}
