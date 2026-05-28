import React, { useState, useEffect } from 'react';
import { db } from "../lib/firebase.js";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const s = {
  page: { minHeight: "100vh", background: "#F4F5F7", fontFamily: "'Inter', sans-serif" },
  header: { background: "#1E2A3B", color: "#fff", padding: "0 20px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
  logo: { background: "#D97706", color: "#fff", fontWeight: 900, fontSize: "15px", padding: "4px 10px", borderRadius: "8px", cursor: "pointer" },
  container: { maxWidth: "700px", margin: "0 auto", padding: "20px" },
  filters: { display: "flex", gap: "10px", marginBottom: "20px", overflowX: "auto", paddingBottom: "10px" },
  filterBtn: active => ({
    padding: "8px 16px",
    background: active ? "#D97706" : "#fff",
    color: active ? "#fff" : "#374151",
    border: "1px solid " + (active ? "#D97706" : "#E5E7EB"),
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap"
  }),
  card: { background: "#fff", borderRadius: "16px", border: "1px solid #E5E7EB", padding: "20px", marginBottom: "16px" },
  badge: type => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    marginBottom: "12px",
    background: type === 'trabajo' ? "#ECFDF5" : "#EFF6FF",
    color: type === 'trabajo' ? "#059669" : "#2563EB"
  }),
  title: { fontSize: "18px", fontWeight: 700, marginBottom: "8px", color: "#111827" },
  meta: { fontSize: "13px", color: "#6B7280", marginBottom: "12px" },
  photoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" },
  photoPlaceholder: { background: "#F3F4F6", borderRadius: "8px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", color: "#9CA3AF", textAlign: "center", padding: "10px", overflow: "hidden" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F3F4F6", paddingTop: "12px", marginTop: "12px" },
  techName: { fontSize: "14px", fontWeight: 600, color: "#374151" },
  btn: { background: "#1E2A3B", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
  err: { background:"#FEE2E2", border:"1px solid #FECACA", borderRadius:"10px", padding:"16px", fontSize:"14px", color:"#991B1B", textAlign: "center", marginBottom: "20px" }
};

export default function Feed({ nav }) {
  const [filter, setFilter] = useState('todos');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarFeed();
  }, []);

  const cargarFeed = async () => {
    setLoading(true);
    setError("");
    try {
      const qTrabajos = query(collection(db, "trabajos"), orderBy("createdAt", "desc"), limit(20));
      const qSolicitudes = query(collection(db, "solicitudes"), orderBy("createdAt", "desc"), limit(20));
      
      const [snapTrabajos, snapSolicitudes] = await Promise.all([
        getDocs(qTrabajos),
        getDocs(qSolicitudes)
      ]);

      const tList = snapTrabajos.docs.map(d => ({ id: d.id, ...d.data(), feedType: 'trabajo' }));
      const sList = snapSolicitudes.docs.map(d => ({ id: d.id, ...d.data(), feedType: 'solicitud' }));
      
      const combined = [...tList, ...sList].sort((a, b) => {
        const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return tB - tA;
      });

      setPosts(combined);
    } catch (err) {
      console.error("Error al cargar feed:", err);
      if (err.message?.includes("permission-denied")) {
         setError("No tienes permiso para ver esta información. Inicia sesión.");
      } else {
         setError("Ocurrió un error al cargar el feed. Verifica tus permisos o conexión.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filtered = posts.filter(p => {
    return filter === 'todos' || p.feedType === filter;
  });

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={s.logo} onClick={() => nav("landing")}>OFICIO</span>
          <span style={{ fontSize: "14px", fontWeight: 600 }}>Feed de Trabajo</span>
        </div>
        <button onClick={() => nav("landing")} style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", cursor: "pointer" }}>Volver</button>
      </header>

      <div style={s.container}>
        <div style={s.filters}>
          {['todos', 'trabajo', 'solicitud'].map(f => (
            <button key={f} style={s.filterBtn(filter === f)} onClick={() => setFilter(f)}>
              {f === 'todos' ? 'Todos' : f === 'trabajo' ? 'Trabajos Realizados' : 'Solicitudes'}
            </button>
          ))}
        </div>

        {error && <div style={s.err}>{error}</div>}
        {loading && <p style={{ textAlign: "center", padding: "40px", color: "#6B7280" }}>Cargando publicaciones...</p>}

        {!loading && !error && filtered.map(post => (
          <div key={post.id} style={s.card}>
            <span style={s.badge(post.feedType)}>
              {post.feedType === 'trabajo' ? '🔧 Trabajo Realizado' : '📋 Solicitud de Cliente'}
            </span>
            <h2 style={s.title}>{post.titulo || post.title || 'Sin título'}</h2>
            <div style={s.meta}>
              📍 {post.ciudad || 'No especificada'} · 🏷️ {post.tipo || post.categoria || 'General'}
            </div>
            
            <p style={{ fontSize: "14px", color: "#4B5563", lineHeight: 1.5, marginBottom: "16px" }}>
              {post.descripcion || post.desc || post.problema || 'Sin descripción'}
            </p>

            {post.feedType === 'trabajo' && (
              <div style={s.photoGrid}>
                {post.evidencias && post.evidencias.length > 0 ? (
                  post.evidencias.slice(0, 2).map((ev, i) => (
                    <img key={i} src={ev} alt="Evidencia" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" }} />
                  ))
                ) : (
                  <>
                    <div style={s.photoPlaceholder}>📷 Foto Antes (Pendiente)</div>
                    <div style={s.photoPlaceholder}>📷 Foto Después (Pendiente)</div>
                  </>
                )}
              </div>
            )}

            {post.feedType === 'solicitud' && (
              <div style={{ background: "#F9FAFB", padding: "12px", borderRadius: "10px", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                  <span style={{ color: "#6B7280" }}>Urgencia:</span>
                  <span style={{ fontWeight: 700, color: post.urgencia === 'Alta' ? '#DC2626' : '#111827' }}>{post.urgencia || 'Normal'}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <span style={{ color: "#6B7280" }}>Presupuesto:</span>
                  <span style={{ fontWeight: 700, color: "#059669" }}>{post.presupuesto || post.budget || 'A convenir'}</span>
                </div>
              </div>
            )}

            <div style={s.footer}>
              {post.feedType === 'trabajo' ? (
                <span style={s.techName}>Por: {post.tecnicoId ? 'Técnico' : 'Anónimo'}</span>
              ) : (
                <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Publicado recientemente</span>
              )}
              <button style={s.btn} onClick={() => {
                if (post.feedType === 'trabajo' && post.tecnicoId) {
                  nav("perfil", { tecnicoId: post.tecnicoId });
                }
              }}>
                {post.feedType === 'trabajo' ? 'Ver Perfil' : 'Enviar Propuesta'}
              </button>
            </div>
          </div>
        ))}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#6B7280" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🔍</div>
            <p>No se encontraron publicaciones con estos filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}