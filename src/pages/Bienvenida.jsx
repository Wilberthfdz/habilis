import React from 'react';

const s = {
  page: { 
    minHeight: "100vh", 
    background: "#1E2A3B", 
    color: "#fff", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: "20px",
    fontFamily: "'Inter', sans-serif"
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "40px",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "400px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    textAlign: "center"
  },
  logo: {
    background: "#D97706",
    color: "#fff",
    fontWeight: 900,
    fontSize: "18px",
    padding: "5px 12px",
    borderRadius: "8px",
    display: "inline-block",
    marginBottom: "24px"
  },
  icon: {
    fontSize: "48px",
    marginBottom: "16px"
  },
  h1: { fontSize: "28px", fontWeight: 800, marginBottom: "8px" },
  p: { color: "rgba(255, 255, 255, 0.6)", fontSize: "15px", marginBottom: "32px", lineHeight: "1.5" },
  btn: {
    width: "100%",
    background: "#D97706",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "transform 0.2s"
  }
};

export default function Bienvenida({ nav }) {
  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={s.card}>
        <div style={s.logo}>OFICIO.MX</div>
        <div style={s.icon}>🎉</div>
        <h1 style={s.h1}>Tu perfil fue creado</h1>
        <p style={s.p}>¡Bienvenido a Oficio.mx! Ya estás listo para documentar tus trabajos y conseguir más clientes.</p>
        
        <button style={s.btn} onClick={() => nav("panel")}>
          Ir a mi Panel →
        </button>
      </div>
    </div>
  );
}