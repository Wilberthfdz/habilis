import { useState, useEffect } from "react";
import { buscarTecnicos } from "../lib/firebase.js";

const CATS = [
  "Electricista","Plomero","Técnico HVAC / Minisplits","Mecánico",
  "Pintor","Instalador CCTV","Albañil","Tablaroquero","Soldador",
];

export default function Buscar({ nav, params }) {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [q,        setQ]        = useState(params?.oficio || "");

  useEffect(() => {
    cargarTecnicos(params?.oficio || "");
  }, []);

  const cargarTecnicos = async (filtro = "") => {
    setLoading(true);
    try {
      const results = await buscarTecnicos({ oficio: filtro || undefined });
      setTecnicos(results);
    } catch (err) {
      console.error("Error al buscar:", err);
      setTecnicos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => cargarTecnicos(q);
  const handleKeyDown = e => { if (e.key === "Enter") handleBuscar(); };

  const s = {
    page:   { minHeight:"100vh", background:"#F4F5F7" },
    header: { background:"#1E2A3B", color:"#fff", padding:"0 20px", height:"56px", display:"flex", alignItems:"center", gap:"14px", position:"sticky", top:0, zIndex:100 },
    logo:   { background:"#D97706", color:"#fff", fontWeight:900, fontSize:"15px", padding:"4px 12px", borderRadius:"8px", letterSpacing:"0.05em", cursor:"pointer" },
    inp:    { flex:1, border:"1px solid #D1D5DB", borderRadius:"10px", padding:"10px 14px", fontSize:"14px", outline:"none", background:"#F9FAFB" },
    btn:    { background:"#D97706", color:"#fff", border:"none", borderRadius:"10px", padding:"10px 18px", fontSize:"14px", fontWeight:700, cursor:"pointer" },
    card:   { background:"#fff", border:"1px solid #E5E7EB", borderRadius:"16px", padding:"18px", cursor:"pointer", transition:"box-shadow 0.15s" },
  };

  return (
    <div style={s.page}>
      {/* HEADER */}
      <div style={s.header}>
        <button onClick={() => nav("landing")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>← Inicio</button>
        <span style={s.logo} onClick={() => nav("landing")}>HABILIS</span>
        <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"13px" }}>Buscar técnicos</span>
      </div>

      {/* SEARCH BAR */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E5E7EB", padding:"14px 20px" }}>
        <div style={{ display:"flex", gap:"8px", maxWidth:"960px", margin:"0 auto" }}>
          <input
            style={s.inp}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="¿Qué necesitas? (ej. Electricista, Plomero...)"
          />
          <button style={s.btn} onClick={handleBuscar}>Buscar</button>
        </div>
      </div>

      {/* CHIPS */}
      <div style={{ background:"#fff", borderBottom:"1px solid #F3F4F6", padding:"10px 20px", overflowX:"auto" }}>
        <div style={{ display:"flex", gap:"8px", maxWidth:"960px", margin:"0 auto", width:"max-content" }}>
          <button
            style={{ padding:"6px 14px", background: !q ? "#D97706" : "#F3F4F6", color: !q ? "#fff" : "#374151", border:"none", borderRadius:"20px", fontSize:"12px", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}
            onClick={() => { setQ(""); cargarTecnicos(""); }}
          >
            Todos
          </button>
          {CATS.map(cat => (
            <button key={cat}
              style={{ padding:"6px 14px", background: q === cat ? "#D97706" : "#F3F4F6", color: q === cat ? "#fff" : "#374151", border:"none", borderRadius:"20px", fontSize:"12px", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}
              onClick={() => { setQ(cat); cargarTecnicos(cat); }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS */}
      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"20px" }}>
        {loading && (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <div style={{ width:"32px", height:"32px", border:"3px solid #D97706", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color:"#6B7280", fontSize:"14px" }}>Buscando técnicos...</p>
          </div>
        )}

        {!loading && tecnicos.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <p style={{ fontSize:"40px", marginBottom:"12px" }}>🔍</p>
            <p style={{ fontWeight:700, marginBottom:"6px", fontSize:"16px" }}>No hay técnicos registrados aún</p>
            <p style={{ color:"#6B7280", fontSize:"14px", marginBottom:"20px" }}>Sé el primero en registrarte en Habilis</p>
            <button style={{ ...s.btn, borderRadius:"12px", padding:"12px 24px" }} onClick={() => nav("registro")}>
              Registrarme gratis →
            </button>
          </div>
        )}

        {!loading && tecnicos.length > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            <p style={{ color:"#6B7280", fontSize:"13px", marginBottom:"4px" }}>
              {tecnicos.length} técnico{tecnicos.length !== 1 ? "s" : ""} encontrado{tecnicos.length !== 1 ? "s" : ""}
              {q ? ` para "${q}"` : ""}
            </p>
            {tecnicos.map(t => (
              <div
                key={t.id}
                style={s.card}
                onClick={() => nav("perfil", { tecnicoId: t.id })}
                onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow="none"}
              >
                <div style={{ display:"flex", gap:"14px", alignItems:"flex-start" }}>
                  <div style={{
                    width:"52px", height:"52px",
                    background:"linear-gradient(135deg,#1E2A3B,#2D3F55)",
                    borderRadius:"12px", display:"flex", alignItems:"center", justifyContent:"center",
                    fontWeight:900, fontSize:"18px", color:"#fff", flexShrink:0,
                    border: t.plan === "pro" ? "2px solid #D97706" : "none"
                  }}>
                    {t.nombre?.charAt(0)?.toUpperCase() || "T"}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap", marginBottom:"2px" }}>
                      <p style={{ fontWeight:700, fontSize:"15px" }}>{t.nombre}</p>
                      {t.plan === "pro" && <span style={{ background:"#FEF3C7", color:"#92400E", fontSize:"10px", fontWeight:700, padding:"2px 7px", borderRadius:"6px" }}>⚡ PRO</span>}
                      {t.verificado && <span style={{ background:"#D1FAE5", color:"#059669", fontSize:"10px", fontWeight:700, padding:"2px 7px", borderRadius:"6px" }}>✅ Verificado</span>}
                    </div>
                    <p style={{ color:"#D97706", fontSize:"13px", fontWeight:600 }}>{t.oficio}</p>
                    <p style={{ color:"#9CA3AF", fontSize:"12px", marginTop:"2px" }}>
                      📍 {t.ciudad}
                      {t.experiencia ? ` · ${t.experiencia} años` : ""}
                      {t.rating > 0 ? ` · ⭐ ${t.rating}` : " · Nuevo"}
                    </p>
                    {t.bio && <p style={{ color:"#6B7280", fontSize:"12px", marginTop:"5px", lineHeight:1.4 }}>{t.bio.slice(0, 90)}{t.bio.length > 90 ? "..." : ""}</p>}
                  </div>
                  <button
                    style={{ ...s.btn, padding:"7px 14px", fontSize:"12px", flexShrink:0 }}
                    onClick={e => { e.stopPropagation(); nav("perfil", { tecnicoId: t.id }); }}
                  >
                    Ver Perfil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
