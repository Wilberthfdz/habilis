import { useState, useEffect } from "react";
import { db } from "../lib/firebase.js";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

const s = {
  page:    { minHeight:"100vh", background:"#F4F5F7" },
  header:  { background:"#1E2A3B", color:"#fff", padding:"0 20px", height:"56px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 },
  logo:    { background:"#D97706", color:"#fff", fontWeight:900, fontSize:"15px", padding:"4px 12px", borderRadius:"8px", letterSpacing:"0.05em", cursor:"pointer" },
  wrap:    { maxWidth:"700px", margin:"0 auto", padding:"20px" },
  card:    { background:"#fff", borderRadius:"16px", border:"1px solid #E5E7EB", padding:"20px", marginBottom:"14px" },
  filterBtn: active => ({
    padding:"7px 16px",
    background: active ? "#D97706" : "#fff",
    color: active ? "#fff" : "#374151",
    border: "1px solid " + (active ? "#D97706" : "#E5E7EB"),
    borderRadius:"20px", fontSize:"13px", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap"
  }),
};

export default function Feed({ nav, user }) {
  const [filter,  setFilter]  = useState("todos");
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarFeed();
  }, []);

  const cargarFeed = async () => {
    setLoading(true);
    try {
      const qTrabajos    = query(collection(db, "trabajos"),   orderBy("createdAt", "desc"), limit(30));
      const qSolicitudes = query(collection(db, "solicitudes"),orderBy("createdAt", "desc"), limit(20));

      const [snapTr, snapSol] = await Promise.all([
        getDocs(qTrabajos).catch(() => ({ docs: [] })),
        getDocs(qSolicitudes).catch(() => ({ docs: [] })),
      ]);

      const tList = snapTr.docs.map(d => ({ id: d.id, ...d.data(), feedType: "trabajo" }));
      const sList = snapSol.docs.map(d => ({ id: d.id, ...d.data(), feedType: "solicitud" }));

      const combined = [...tList, ...sList].sort((a, b) => {
        const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return tB - tA;
      });
      setPosts(combined);
    } catch (err) {
      console.error("Error al cargar feed:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "todos" ? posts : posts.filter(p => p.feedType === filter);

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <span style={s.logo} onClick={() => nav("landing")}>HABILIS</span>
          <span style={{ fontSize:"14px", fontWeight:600, color:"rgba(255,255,255,0.7)" }}>Feed</span>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          {user
            ? <button onClick={() => nav("panel")} style={{ background:"#D97706", color:"#fff", border:"none", borderRadius:"8px", padding:"7px 14px", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>Mi Panel</button>
            : <button onClick={() => nav("registro")} style={{ background:"#D97706", color:"#fff", border:"none", borderRadius:"8px", padding:"7px 14px", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>Registrarme</button>
          }
        </div>
      </header>

      <div style={s.wrap}>
        {/* Filters */}
        <div style={{ display:"flex", gap:"8px", marginBottom:"20px", overflowX:"auto", paddingBottom:"4px" }}>
          {[["todos","Todos"],["trabajo","Trabajos realizados"],["solicitud","Solicitudes"]].map(([id, label]) => (
            <button key={id} style={s.filterBtn(filter === id)} onClick={() => setFilter(id)}>{label}</button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <div style={{ width:"32px", height:"32px", border:"3px solid #D97706", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color:"#6B7280" }}>Cargando publicaciones...</p>
          </div>
        )}

        {!loading && filtered.map(post => (
          <div key={post.id} style={s.card}>
            <div style={{ marginBottom:"12px" }}>
              <span style={{
                display:"inline-block", padding:"4px 10px", borderRadius:"6px",
                fontSize:"11px", fontWeight:800, textTransform:"uppercase",
                background: post.feedType === "trabajo" ? "#ECFDF5" : "#EFF6FF",
                color: post.feedType === "trabajo" ? "#059669" : "#2563EB",
              }}>
                {post.feedType === "trabajo" ? "🔧 Trabajo Realizado" : "📋 Solicitud de Cliente"}
              </span>
            </div>

            <h2 style={{ fontSize:"17px", fontWeight:700, marginBottom:"6px", color:"#111827" }}>
              {post.titulo || "Sin título"}
            </h2>
            <div style={{ fontSize:"13px", color:"#6B7280", marginBottom:"10px" }}>
              📍 {post.ciudad || "No especificada"} · 🏷️ {post.tipo || post.categoria || "General"}
            </div>

            {(post.descripcion || post.problema) && (
              <p style={{ fontSize:"14px", color:"#4B5563", lineHeight:1.55, marginBottom:"14px" }}>
                {(post.descripcion || post.problema || "").slice(0, 200)}
                {(post.descripcion || post.problema || "").length > 200 ? "..." : ""}
              </p>
            )}

            {/* Fotos trabajos */}
            {post.feedType === "trabajo" && post.evidencias?.length > 0 && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"14px" }}>
                {post.evidencias.slice(0, 2).map((ev, i) => (
                  <div key={i} style={{ position:"relative" }}>
                    <img src={ev} alt={i === 0 ? "Antes" : "Después"} style={{ width:"100%", height:"120px", objectFit:"cover", borderRadius:"8px" }} />
                    <span style={{ position:"absolute", bottom:"6px", left:"6px", background:"rgba(0,0,0,0.6)", color:"#fff", fontSize:"10px", fontWeight:700, padding:"2px 6px", borderRadius:"4px" }}>
                      {i === 0 ? "ANTES" : "DESPUÉS"}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {post.feedType === "trabajo" && (!post.evidencias || post.evidencias.length === 0) && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"14px" }}>
                {["ANTES","DESPUÉS"].map(l => (
                  <div key={l} style={{ background:"#F3F4F6", borderRadius:"8px", height:"100px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", color:"#9CA3AF", fontWeight:600 }}>
                    📷 {l}
                  </div>
                ))}
              </div>
            )}

            {/* Solicitud info */}
            {post.feedType === "solicitud" && (
              <div style={{ background:"#F9FAFB", padding:"12px", borderRadius:"10px", marginBottom:"14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px", marginBottom:"6px" }}>
                  <span style={{ color:"#6B7280" }}>Urgencia:</span>
                  <span style={{ fontWeight:700, color: post.urgencia === "Alta" ? "#DC2626" : "#111827" }}>{post.urgencia || "Normal"}</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px" }}>
                  <span style={{ color:"#6B7280" }}>Presupuesto:</span>
                  <span style={{ fontWeight:700, color:"#059669" }}>{post.presupuesto || "A convenir"}</span>
                </div>
              </div>
            )}

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid #F3F4F6", paddingTop:"12px" }}>
              <span style={{ fontSize:"13px", color:"#6B7280" }}>
                {post.feedType === "trabajo"
                  ? post.clienteNombre ? `Cliente: ${post.clienteNombre}` : "Trabajo documentado"
                  : "Publicado recientemente"}
              </span>
              <button
                style={{ background:"#1E2A3B", color:"#fff", border:"none", borderRadius:"8px", padding:"8px 16px", fontSize:"12px", fontWeight:600, cursor:"pointer" }}
                onClick={() => {
                  if (post.feedType === "trabajo" && post.tecnicoId) nav("perfil", { tecnicoId: post.tecnicoId });
                  else if (post.feedType === "solicitud") nav("registro");
                }}
              >
                {post.feedType === "trabajo" ? "Ver técnico" : "Responder solicitud"}
              </button>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px", color:"#6B7280" }}>
            <div style={{ fontSize:"40px", marginBottom:"12px" }}>📋</div>
            <p style={{ fontWeight:700, marginBottom:"6px", color:"#374151", fontSize:"16px" }}>No hay publicaciones aún</p>
            <p style={{ fontSize:"14px", marginBottom:"20px" }}>Registra tu primer trabajo para aparecer en el feed.</p>
            <button
              style={{ background:"#D97706", color:"#fff", border:"none", borderRadius:"12px", padding:"12px 24px", fontSize:"14px", fontWeight:700, cursor:"pointer" }}
              onClick={() => user ? nav("registrarTrabajo") : nav("registro")}
            >
              {user ? "Registrar mi trabajo →" : "Registrarme gratis →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
