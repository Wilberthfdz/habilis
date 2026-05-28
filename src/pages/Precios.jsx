import Logo from "../components/Logo.jsx";
import Nav from "../components/Nav.jsx";

const FREE = [
  [true,  "Perfil profesional básico"],
  [true,  "Aparece en resultados de búsqueda"],
  [true,  "Hasta 5 trabajos documentados"],
  [true,  "Feed público"],
  [false, "Con anuncios en tu perfil"],
  [false, "Sin prioridad en búsquedas"],
  [false, "Sin herramientas de IA"],
];

const PRO = [
  [true, "Prioridad alta en búsquedas"],
  [true, "Sin anuncios en tu perfil"],
  [true, "Trabajos ilimitados documentados"],
  [true, "4 leads garantizados al mes"],
  [true, "Herramientas de IA con Gemini"],
  [true, "Generación de cotizaciones"],
  [true, "Soporte prioritario en español"],
];

const FAQ = [
  ["¿Puedo cancelar en cualquier momento?","Sí. Sin contratos de permanencia. Cancela desde tu panel cuando quieras."],
  ["¿Cómo se realiza el cobro?","Cobro mensual de $100 MXN mediante tarjeta de débito o crédito a través de Conekta (próximamente)."],
  ["¿Qué son los leads garantizados?","Son solicitudes de clientes que coinciden con tu oficio y ciudad, enviadas directo a tu panel."],
  ["¿El plan Gratis es realmente gratis?","Sí, siempre. Los clientes también pueden buscar y contactar técnicos sin costo alguno."],
];

export default function Precios({ nav, user }) {
  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      {/* NAV */}
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      {/* HERO BANNER */}
      <div style={{ background:"#0F172A", padding:"52px 20px 48px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-5%", width:"480px", height:"480px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-30%", left:"-5%", width:"350px", height:"350px",
                      background:"radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"700px", margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                      letterSpacing:"0.12em", marginBottom:"10px" }}>Para técnicos</p>
          <h1 style={{ fontSize:"clamp(26px,5vw,52px)", fontWeight:900, color:"#fff", marginBottom:"14px" }}>
            Planes simples y transparentes
          </h1>
          <p style={{ color:"rgba(255,255,255,0.52)", fontSize:"clamp(14px,2vw,17px)" }}>
            Elige el plan que mejor se adapte a tu crecimiento. Cambia cuando quieras.
          </p>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div style={{ maxWidth:"880px", margin:"0 auto", padding:"52px 20px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"24px", alignItems:"start" }}>

          {/* FREE */}
          <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"24px", padding:"36px",
                        boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize:"11px", fontWeight:700, color:"#94A3B8", textTransform:"uppercase",
                        letterSpacing:"0.1em", marginBottom:"10px" }}>Plan Gratuito</p>
            <div style={{ display:"flex", alignItems:"flex-end", gap:"4px", marginBottom:"6px" }}>
              <span style={{ fontSize:"44px", fontWeight:900, color:"#0F172A" }}>$0</span>
              <span style={{ fontSize:"15px", color:"#94A3B8", marginBottom:"8px" }}>MXN/mes</span>
            </div>
            <p style={{ color:"#64748B", fontSize:"13px", marginBottom:"28px" }}>Para empezar a construir tu perfil</p>
            <hr style={{ border:"none", borderTop:"1px solid #F1F5F9", marginBottom:"24px" }} />
            <ul style={{ listStyle:"none", padding:0, marginBottom:"32px" }}>
              {FREE.map(([ok, text]) => (
                <li key={text} style={{ display:"flex", alignItems:"flex-start", gap:"10px",
                                        marginBottom:"12px", fontSize:"14px" }}>
                  <span style={{ color: ok ? "#10B981" : "#CBD5E1", fontWeight:700, flexShrink:0, marginTop:"1px" }}>
                    {ok ? "✓" : "✕"}
                  </span>
                  <span style={{ color: ok ? "#374151" : "#94A3B8" }}>{text}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => nav("registro")}
              style={{ width:"100%", background:"#F1F5F9", color:"#0F172A", border:"1px solid #E2E8F0",
                       borderRadius:"12px", padding:"14px", fontSize:"15px", fontWeight:700, cursor:"pointer" }}>
              Empezar gratis
            </button>
          </div>

          {/* PRO */}
          <div style={{ background:"#0F172A", borderRadius:"24px", padding:"36px", position:"relative",
                        boxShadow:"0 20px 40px rgba(15,23,42,0.3)" }}>
            <div style={{ position:"absolute", top:"-13px", left:"50%", transform:"translateX(-50%)",
                          background:"#F97316", color:"#fff", padding:"4px 16px", borderRadius:"20px",
                          fontSize:"11px", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em",
                          whiteSpace:"nowrap" }}>
              ⚡ Más popular
            </div>
            <p style={{ fontSize:"11px", fontWeight:700, color:"rgba(249,115,22,0.8)", textTransform:"uppercase",
                        letterSpacing:"0.1em", marginBottom:"10px" }}>Plan Pro</p>
            <div style={{ display:"flex", alignItems:"flex-end", gap:"4px", marginBottom:"6px" }}>
              <span style={{ fontSize:"44px", fontWeight:900, color:"#fff" }}>$100</span>
              <span style={{ fontSize:"15px", color:"rgba(255,255,255,0.4)", marginBottom:"8px" }}>MXN/mes</span>
            </div>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"13px", marginBottom:"28px" }}>
              ≈ $3.30 MXN al día · Sin IVA
            </p>
            <hr style={{ border:"none", borderTop:"1px solid rgba(255,255,255,0.08)", marginBottom:"24px" }} />
            <ul style={{ listStyle:"none", padding:0, marginBottom:"32px" }}>
              {PRO.map(([, text]) => (
                <li key={text} style={{ display:"flex", alignItems:"flex-start", gap:"10px",
                                        marginBottom:"12px", fontSize:"14px" }}>
                  <span style={{ color:"#F97316", fontWeight:700, flexShrink:0, marginTop:"1px" }}>✓</span>
                  <span style={{ color:"rgba(255,255,255,0.82)" }}>{text}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => nav("registro", { plan:"pro" })}
              style={{ width:"100%", background:"#F97316", color:"#fff", border:"none",
                       borderRadius:"12px", padding:"14px", fontSize:"15px", fontWeight:700, cursor:"pointer" }}>
              Obtener Plan Pro ⚡
            </button>
          </div>
        </div>

        <p style={{ textAlign:"center", color:"#94A3B8", fontSize:"13px", marginTop:"24px" }}>
          * Cancela en cualquier momento. Los precios no incluyen IVA.
        </p>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth:"700px", margin:"0 auto", padding:"0 20px 60px" }}>
        <h2 style={{ fontSize:"clamp(20px,3.5vw,30px)", fontWeight:900, color:"#0F172A",
                     textAlign:"center", marginBottom:"28px" }}>
          Preguntas frecuentes
        </h2>
        {FAQ.map(([q, a]) => (
          <div key={q} style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"14px",
                                padding:"20px 24px", marginBottom:"10px",
                                boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
            <p style={{ fontWeight:700, fontSize:"15px", color:"#0F172A", marginBottom:"8px" }}>{q}</p>
            <p style={{ color:"#64748B", fontSize:"14px", lineHeight:1.65 }}>{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
