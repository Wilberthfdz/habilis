import React from 'react';

const s = {
  page: {
    minHeight: "100vh",
    background: "#1E2A3B",
    color: "#fff",
    fontFamily: "'Inter', sans-serif",
    padding: "60px 20px"
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    textAlign: "center"
  },
  h1: { fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 900, marginBottom: "16px" },
  sub: { color: "rgba(255, 255, 255, 0.6)", fontSize: "18px", marginBottom: "48px", maxWidth: "600px", margin: "0 auto 48px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    alignItems: "stretch"
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "24px",
    padding: "40px",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    backdropFilter: "blur(10px)"
  },
  cardPro: {
    background: "rgba(255, 255, 255, 0.08)",
    border: "2px solid #D97706",
    transform: "scale(1.05)",
    position: "relative"
  },
  badge: {
    position: "absolute",
    top: "-15px",
    right: "20px",
    background: "#D97706",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase"
  },
  planName: { fontSize: "24px", fontWeight: 800, marginBottom: "8px" },
  price: { fontSize: "36px", fontWeight: 900, marginBottom: "24px" },
  featureList: { listStyle: "none", padding: 0, margin: "0 0 40px 0", flex: 1 },
  feature: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    fontSize: "15px",
    color: "rgba(255, 255, 255, 0.8)"
  },
  check: { color: "#D97706", fontWeight: 900 },
  btn: {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "transform 0.2s"
  },
  btnFree: { background: "rgba(255, 255, 255, 0.1)", color: "#fff" },
  btnPro: { background: "#D97706", color: "#fff" },
  nav: {
    position: "absolute",
    top: "20px",
    left: "20px",
    display: "flex",
    gap: "10px"
  },
  logo: {
    background: "#D97706",
    color: "#fff",
    fontWeight: 900,
    fontSize: "14px",
    padding: "4px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default function Precios({ nav }) {
  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      
      <div style={s.nav}>
        <div style={s.logo} onClick={() => nav("landing")}>OFICIO</div>
      </div>

      <div style={s.container}>
        <h1 style={s.h1}>Planes para técnicos</h1>
        <p style={s.sub}>Elige el plan que mejor se adapte a tu crecimiento profesional.</p>

        <div style={s.grid}>
          {/* Plan Gratis */}
          <div style={s.card}>
            <h2 style={s.planName}>Gratis</h2>
            <div style={s.price}>$0 <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)" }}>MXN/mes</span></div>
            <ul style={s.featureList}>
              <li style={s.feature}><span style={s.check}>✓</span> Perfil profesional básico</li>
              <li style={s.feature}><span style={s.check}>✓</span> Aparece en los resultados de búsqueda</li>
              <li style={s.feature}><span style={s.check}>✓</span> Registro de trabajos limitado</li>
              <li style={s.feature}><span style={{ ...s.check, color: "rgba(255,255,255,0.3)" }}>✕</span> Con anuncios en tu perfil</li>
            </ul>
            <button style={{ ...s.btn, ...s.btnFree }} onClick={() => nav("registro", { modo: "tecnico" })}>
              Empezar gratis
            </button>
          </div>

          {/* Plan Pro */}
          <div style={{ ...s.card, ...s.cardPro }}>
            <div style={s.badge}>Más popular</div>
            <h2 style={s.planName}>Pro</h2>
            <div style={s.price}>$100 <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)" }}>MXN/mes</span></div>
            <ul style={s.featureList}>
              <li style={s.feature}><span style={s.check}>✓</span> <b>Prioridad alta</b> en búsquedas</li>
              <li style={s.feature}><span style={s.check}>✓</span> <b>Sin anuncios</b> en tu perfil</li>
              <li style={s.feature}><span style={s.check}>✓</span> <b>4 Leads garantizados</b> al mes</li>
              <li style={s.feature}><span style={s.check}>✓</span> Herramientas de <b>IA (Gemini)</b></li>
              <li style={s.feature}><span style={s.check}>✓</span> Generación de <b>facturas SAT</b></li>
              <li style={s.feature}><span style={s.check}>✓</span> Soporte técnico prioritario</li>
            </ul>
            <button style={{ ...s.btn, ...s.btnPro }} onClick={() => nav("registro", { modo: "tecnico", plan: "pro" })}>
              Obtener Pro ⚡
            </button>
          </div>
        </div>

        <p style={{ marginTop: "60px", color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>
          * Los precios no incluyen IVA. Cancela en cualquier momento.
        </p>
      </div>
    </div>
  );
}
