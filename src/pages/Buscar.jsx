import { useState, useEffect } from "react";
import { buscarTecnicos }      from "../lib/firebase.js";

export default function Buscar({ nav, params }) {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [q,        setQ]        = useState(params?.oficio || "");

  useEffect(() => {
    cargarTecnicos();
  }, []);

  const cargarTecnicos = async (filtro = params?.oficio) => {
    setLoading(true);
    setError("");
    try {
      const results = await buscarTecnicos({ oficio: filtro });
      setTecnicos(results);
    } catch (err) {
      console.error("Error al buscar técnicos:", err);
      if (err.message?.includes("permission-denied")) {
         setError("No tienes permiso para ver esta información. Por favor inicia sesión.");
      } else {
         setError("Ocurrió un error al cargar los datos. Intenta de nuevo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => cargarTecnicos(q);

  const s = {
    page:   { minHeight:"100vh", background:"#F4F5F7" },
    header: { background:"#1E2A3B", color:"#fff", padding:"14px 20px", display:"flex", alignItems:"center", gap:"14px" },
    logo:   { background:"#D97706", color:"#fff", fontWeight:900, fontSize:"15px", padding:"4px 10px", borderRadius:"8px", cursor: "pointer" },
    card:   { background:"#fff", border:"1px solid #E5E7EB", borderRadius:"16px", padding:"18px", cursor:"pointer" },
    inp:    { flex:1, border:"1px solid #D1D5DB", borderRadius:"10px", padding:"10px 14px", fontSize:"13px", outline:"none", background:"#F9FAFB" },
    btn:    { background:"#D97706", color:"#fff", border:"none", borderRadius:"10px", padding:"10px 18px", fontSize:"13px", fontWeight:700, cursor: "pointer" },
    err:    { background:"#FEE2E2", border:"1px solid #FECACA", borderRadius:"10px", padding:"16px", fontSize:"14px", color:"#991B1B", textAlign: "center" }
  };

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={s.header}>
        <button onClick={() => nav("landing")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight:600, cursor: "pointer" }}>← Inicio</button>
        <span style={s.logo} onClick={() => nav("landing")}>OFICIO</span>
      </div>
      <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"14px 20px" }}>
        <div style={{ display:"flex", gap:"8px", maxWidth:"960px", margin:"0 auto" }}>
          <input style={s.inp} value={q} onChange={e => setQ(e.target.value)} placeholder="¿Qué necesitas? (ej. Electricista)" />
          <button style={s.btn} onClick={handleBuscar}>Buscar</button>
        </div>
      </div>
      
      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"20px" }}>
        {error && <div style={s.err}>{error}</div>}
        
        {loading && !error && <p style={{ color:"#6B7280", textAlign:"center", padding:"40px" }}>Cargando técnicos...</p>}
        
        {!loading && !error && tecnicos.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <p style={{ fontSize:"40px", marginBottom:"12px" }}>🔍</p>
            <p style={{ fontWeight:700, marginBottom:"6px" }}>Nadie registrado aún en esta zona</p>
            <p style={{ color:"#6B7280", fontSize:"13px", marginBottom:"16px" }}>Sé el primero en registrarte</p>
            <button style={{ ...s.btn, borderRadius:"12px", padding:"12px 24px" }} onClick={() => nav("registro")}>Registrarme gratis →</button>
          </div>
        )}
        
        {!loading && !error && tecnicos.length > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            <p style={{ color:"#6B7280", fontSize:"13px" }}>{tecnicos.length} técnicos encontrados</p>
            {tecnicos.map(t => (
              <div key={t.id} style={s.card} onClick={() => nav("perfil", { tecnicoId: t.id })}>
                <div style={{ display:"flex", gap:"14px", alignItems:"flex-start" }}>
                  <div style={{ width:"48px", height:"48px", background:"linear-gradient(135deg,#1E2A3B,#2D3F55)", borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:"16px", color:"#fff", flexShrink:0 }}>
                    {t.nombre?.charAt(0) || "T"}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:700, fontSize:"15px" }}>{t.nombre}</p>
                    <p style={{ color:"#D97706", fontSize:"13px" }}>{t.oficio}</p>
                    <p style={{ color:"#9CA3AF", fontSize:"12px" }}>📍 {t.ciudad} · {t.experiencia} años · ⭐ {t.rating || "Nuevo"}</p>
                    {t.plan === "pro" && <span style={{ background:"#FEF3C7", color:"#92400E", fontSize:"10px", fontWeight:700, padding:"2px 7px", borderRadius:"6px" }}>⚡ PRO</span>}
                  </div>
                  <button style={{ ...s.btn, padding:"7px 14px", fontSize:"12px" }}>Ver Perfil</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}