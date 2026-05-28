// Perfil.jsx — Perfil público del técnico
import { useState, useEffect } from "react";
import { obtenerTecnico, obtenerTrabajosDelTecnico } from "../lib/firebase.js";

export default function Perfil({ nav, params }) {
  const [tecnico,  setTecnico]  = useState(null);
  const [trabajos, setTrabajos] = useState([]);

  useEffect(() => {
    if (!params?.tecnicoId) return;
    const cargarPerfil = async () => {
      try {
        const t = await obtenerTecnico(params.tecnicoId);
        if (t) {
          setTecnico(t);
          const tr = await obtenerTrabajosDelTecnico(params.tecnicoId).catch(() => []);
          setTrabajos(tr);
        }
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      }
    };
    cargarPerfil();
  }, [params?.tecnicoId]);

  const s = {
    page:   { minHeight:"100vh", background:"#F4F5F7" },
    header: { background:"#1E2A3B", color:"#fff", padding:"14px 20px", display:"flex", gap:"14px", alignItems:"center" },
    logo:   { background:"#D97706", color:"#fff", fontWeight:900, fontSize:"15px", padding:"4px 10px", borderRadius:"8px" },
    wrap:   { maxWidth:"680px", margin:"0 auto", padding:"20px" },
    card:   { background:"#fff", border:"1px solid #E5E7EB", borderRadius:"16px", padding:"20px", marginBottom:"14px" },
    btn:    { background:"#D97706", color:"#fff", border:"none", borderRadius:"10px", padding:"11px 20px", fontSize:"14px", fontWeight:700, cursor:"pointer" },
  };

  if (!tecnico) return (
    <div style={s.page}>
      <div style={s.header}><span style={s.logo}>OFICIO</span></div>
      <p style={{ textAlign:"center", padding:"60px", color:"#6B7280" }}>Cargando perfil...</p>
    </div>
  );

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={s.header}>
        <button onClick={() => nav("buscar")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight:600 }}>← Buscar</button>
        <span style={s.logo}>OFICIO</span>
      </div>
      <div style={s.wrap}>
        <div style={s.card}>
          <div style={{ display:"flex", gap:"16px", alignItems:"flex-start", marginBottom:"16px" }}>
            <div style={{ width:"64px", height:"64px", background:"linear-gradient(135deg,#1E2A3B,#2D3F55)", borderRadius:"16px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:"22px", color:"#fff", flexShrink:0, border: tecnico.plan==="pro" ? "3px solid #D97706" : "none" }}>
              {tecnico.nombre?.charAt(0)}
            </div>
            <div style={{ flex:1 }}>
              <h1 style={{ fontSize:"20px", fontWeight:800, marginBottom:"3px" }}>{tecnico.nombre}</h1>
              <p style={{ color:"#D97706", fontWeight:600, fontSize:"14px" }}>{tecnico.oficio}</p>
              <p style={{ color:"#9CA3AF", fontSize:"13px" }}>📍 {tecnico.ciudad} · {tecnico.experiencia} años</p>
              {tecnico.verificado && <span style={{ background:"#D1FAE5", color:"#059669", fontSize:"11px", fontWeight:700, padding:"2px 8px", borderRadius:"6px", display:"inline-block", marginTop:"6px" }}>✅ Verificado</span>}
            </div>
          </div>
          {tecnico.bio && <p style={{ color:"#4B5563", fontSize:"13px", lineHeight:1.6, marginBottom:"16px" }}>{tecnico.bio}</p>}
          <div style={{ display:"flex", gap:"8px" }}>
            <button style={{ ...s.btn, flex:2 }}>💬 Contactar</button>
            <button style={{ ...s.btn, flex:1, background:"#fff", color:"#374151", border:"1px solid #D1D5DB" }}>Guardar</button>
          </div>
        </div>

        {trabajos.length > 0 && (
          <div style={s.card}>
            <h2 style={{ fontWeight:700, fontSize:"15px", marginBottom:"14px" }}>Trabajos registrados ({trabajos.length})</h2>
            {trabajos.map(t => (
              <div key={t.id} style={{ padding:"12px", background:"#F9FAFB", borderRadius:"10px", marginBottom:"8px", border:"1px solid #E5E7EB" }}>
                <p style={{ fontWeight:600, fontSize:"13px", marginBottom:"3px" }}>{t.titulo}</p>
                <p style={{ color:"#6B7280", fontSize:"12px" }}>{t.tipo} · {t.ciudad} · ⏱ {t.tiempoHoras}h</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ ...s.card, background:"#FFFBEB", border:"1px solid #FDE68A" }}>
          <p style={{ color:"#92400E", fontSize:"13px", lineHeight:1.5 }}>
            <b>Oficio.mx conecta clientes con técnicos</b> pero no garantiza trabajos ni se hace responsable por acuerdos entre partes. Valida siempre el trabajo antes de pagar.
          </p>
        </div>
      </div>
    </div>
  );
}
