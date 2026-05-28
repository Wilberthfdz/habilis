const s = {
  page:      { minHeight:"100vh", background:"#1E2A3B", color:"#fff", padding:"0" },
  header:    { background:"rgba(0,0,0,0.2)", padding:"0 20px", height:"56px", display:"flex", alignItems:"center", justifyContent:"space-between" },
  logo:      { background:"#D97706", color:"#fff", fontWeight:900, fontSize:"15px", padding:"4px 12px", borderRadius:"8px", letterSpacing:"0.05em", cursor:"pointer" },
  container: { maxWidth:"960px", margin:"0 auto", padding:"60px 20px", textAlign:"center" },
  h1:        { fontSize:"clamp(28px,5vw,48px)", fontWeight:900, marginBottom:"14px" },
  sub:       { color:"rgba(255,255,255,0.55)", fontSize:"17px", maxWidth:"560px", margin:"0 auto 52px", lineHeight:1.6 },
  grid:      { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"24px", alignItems:"stretch" },
  card:      { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"24px", padding:"36px", textAlign:"left", display:"flex", flexDirection:"column" },
  cardPro:   { background:"rgba(255,255,255,0.08)", border:"2px solid #D97706", transform:"scale(1.03)", position:"relative" },
  badge:     { position:"absolute", top:"-13px", left:"50%", transform:"translateX(-50%)", background:"#D97706", color:"#fff", padding:"4px 16px", borderRadius:"20px", fontSize:"11px", fontWeight:800, textTransform:"uppercase", whiteSpace:"nowrap" },
  planName:  { fontSize:"22px", fontWeight:800, marginBottom:"6px" },
  price:     { fontSize:"38px", fontWeight:900, marginBottom:"6px" },
  priceSub:  { color:"rgba(255,255,255,0.4)", fontSize:"15px" },
  divider:   { border:"none", borderTop:"1px solid rgba(255,255,255,0.1)", margin:"20px 0" },
  list:      { listStyle:"none", padding:0, margin:"0 0 28px 0", flex:1 },
  item:      { display:"flex", alignItems:"flex-start", gap:"10px", marginBottom:"13px", fontSize:"14px", color:"rgba(255,255,255,0.8)", lineHeight:1.4 },
  check:     { color:"#D97706", fontWeight:900, flexShrink:0, marginTop:"1px" },
  cross:     { color:"rgba(255,255,255,0.25)", fontWeight:900, flexShrink:0 },
  btn:       { width:"100%", padding:"15px", borderRadius:"14px", border:"none", fontSize:"15px", fontWeight:700, cursor:"pointer" },
  btnFree:   { background:"rgba(255,255,255,0.1)", color:"#fff" },
  btnPro:    { background:"#D97706", color:"#fff" },
  faqTitle:  { fontSize:"22px", fontWeight:800, marginBottom:"24px", marginTop:"60px" },
  faqCard:   { background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"14px", padding:"18px 22px", marginBottom:"10px", textAlign:"left" },
};

const FREE_FEATURES = [
  [true,  "Perfil profesional básico"],
  [true,  "Aparece en resultados de búsqueda"],
  [true,  "Registro de hasta 5 trabajos"],
  [true,  "Feed público"],
  [false, "Con anuncios en tu perfil"],
  [false, "Sin prioridad en búsquedas"],
  [false, "Sin herramientas de IA"],
];

const PRO_FEATURES = [
  [true, "Prioridad alta en búsquedas"],
  [true, "Sin anuncios en tu perfil"],
  [true, "Trabajos ilimitados documentados"],
  [true, "4 Leads garantizados al mes"],
  [true, "Herramientas de IA con Gemini"],
  [true, "Generación de cotizaciones"],
  [true, "Soporte técnico prioritario"],
];

const FAQ = [
  ["¿Puedo cancelar en cualquier momento?", "Sí. Puedes cancelar tu suscripción Pro en cualquier momento desde tu panel. No hay contratos de permanencia."],
  ["¿Cómo se realiza el cobro?", "El cobro es mensual de $100 MXN. Aceptamos tarjetas de débito y crédito a través de Conekta (próximamente)."],
  ["¿Qué son los 'leads garantizados'?", "Son solicitudes de clientes que coinciden con tu oficio y ciudad, enviadas directamente a tu panel cada mes."],
  ["¿El plan Gratis es realmente gratis?", "Sí, siempre. Los clientes siempre pueden buscar y contactar técnicos sin costo."],
];

export default function Precios({ nav }) {
  return (
    <div style={s.page}>
      <div style={s.header}>
        <button onClick={() => nav("landing")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>← Inicio</button>
        <span style={s.logo} onClick={() => nav("landing")}>HABILIS</span>
        <button onClick={() => nav("registro")} style={{ background:"#D97706", color:"#fff", border:"none", borderRadius:"8px", padding:"7px 14px", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
          Registrarme gratis
        </button>
      </div>

      <div style={s.container}>
        <p style={{ color:"#D97706", fontSize:"12px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"10px" }}>Planes para técnicos</p>
        <h1 style={s.h1}>Invierte en tu reputación</h1>
        <p style={s.sub}>Elige el plan que mejor se adapte a tu crecimiento. Cambia cuando quieras.</p>

        <div style={s.grid}>
          {/* Plan Gratis */}
          <div style={s.card}>
            <h2 style={s.planName}>Gratis</h2>
            <div style={s.price}>$0 <span style={s.priceSub}>MXN/mes</span></div>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"13px", marginBottom:"0" }}>Para empezar a construir tu perfil</p>
            <hr style={s.divider} />
            <ul style={s.list}>
              {FREE_FEATURES.map(([ok, text]) => (
                <li key={text} style={s.item}>
                  <span style={ok ? s.check : s.cross}>{ok ? "✓" : "✕"}</span>
                  <span style={ok ? {} : { color:"rgba(255,255,255,0.35)" }}>{text}</span>
                </li>
              ))}
            </ul>
            <button style={{ ...s.btn, ...s.btnFree }} onClick={() => nav("registro")}>
              Empezar gratis
            </button>
          </div>

          {/* Plan Pro */}
          <div style={{ ...s.card, ...s.cardPro }}>
            <div style={s.badge}>⚡ Más popular</div>
            <h2 style={s.planName}>Pro</h2>
            <div style={s.price}>$100 <span style={s.priceSub}>MXN/mes</span></div>
            <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>≈ $3.30 MXN al día · Sin IVA</p>
            <hr style={s.divider} />
            <ul style={s.list}>
              {PRO_FEATURES.map(([ok, text]) => (
                <li key={text} style={s.item}>
                  <span style={s.check}>✓</span>
                  <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") }} />
                </li>
              ))}
            </ul>
            <button style={{ ...s.btn, ...s.btnPro }} onClick={() => nav("registro", { plan:"pro" })}>
              Obtener Plan Pro ⚡
            </button>
          </div>
        </div>

        {/* FAQ */}
        <h2 style={s.faqTitle}>Preguntas frecuentes</h2>
        {FAQ.map(([q, a]) => (
          <div key={q} style={s.faqCard}>
            <p style={{ fontWeight:700, fontSize:"14px", marginBottom:"6px" }}>{q}</p>
            <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"13px", lineHeight:1.6 }}>{a}</p>
          </div>
        ))}

        <p style={{ marginTop:"40px", color:"rgba(255,255,255,0.3)", fontSize:"13px" }}>
          * Los precios no incluyen IVA. Cancela en cualquier momento.
        </p>
      </div>
    </div>
  );
}
