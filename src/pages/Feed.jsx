import { useState, useEffect } from "react";
import Logo from "../components/Logo.jsx";
import Nav from "../components/Nav.jsx";
import { db } from "../lib/firebase.js";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export default function Feed({ nav, user }) {
  const [filter,  setFilter]  = useState("todos");
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [snapTr, snapSol] = await Promise.all([
          getDocs(query(collection(db,"trabajos"),   orderBy("createdAt","desc"), limit(30))).catch(() => ({ docs:[] })),
          getDocs(query(collection(db,"solicitudes"),orderBy("createdAt","desc"), limit(20))).catch(() => ({ docs:[] })),
        ]);
        const tList = snapTr.docs.map(d => ({ id:d.id,...d.data(), feedType:"trabajo" }));
        const sList = snapSol.docs.map(d => ({ id:d.id,...d.data(), feedType:"solicitud" }));
        const all = [...tList,...sList].sort((a,b) => {
          const tA = a.createdAt?.toMillis?.() || 0;
          const tB = b.createdAt?.toMillis?.() || 0;
          return tB - tA;
        });
        setPosts(all);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = filter === "todos" ? posts : posts.filter(p => p.feedType === filter);

  const filterBtn = (id, label) => (
    <button key={id} onClick={() => setFilter(id)}
      style={{ padding:"7px 18px", background: filter===id ? "#F97316" : "#fff",
               color: filter===id ? "#fff" : "#374151",
               border: `1px solid ${filter===id ? "#F97316" : "#E2E8F0"}`,
               borderRadius:"20px", fontSize:"13px", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
      {label}
    </button>
  );

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      {/* NAV */}
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      {/* HERO BANNER */}
      <div style={{ background:"#0F172A", padding:"40px 20px 36px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-5%", width:"420px", height:"420px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"700px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                      letterSpacing:"0.1em", marginBottom:"8px" }}>Comunidad</p>
          <h1 style={{ fontSize:"clamp(24px,4vw,40px)", fontWeight:900, color:"#fff", marginBottom:"8px" }}>
            Feed de trabajo
          </h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"15px" }}>
            Trabajos documentados · Solicitudes de servicio · Actividad reciente
          </p>
        </div>
      </div>

      <div style={{ maxWidth:"700px", margin:"0 auto", padding:"24px 20px" }}>
        {/* Filters */}
        <div style={{ display:"flex", gap:"8px", marginBottom:"24px", overflowX:"auto", paddingBottom:"4px" }}>
          {filterBtn("todos","Todos")}
          {filterBtn("trabajo","Trabajos realizados")}
          {filterBtn("solicitud","Solicitudes")}
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:"72px 20px" }}>
            <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                          borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
            <p style={{ color:"#64748B" }}>Cargando publicaciones...</p>
          </div>
        ) : filtered.map(post => {
          const esTrabajo = post.feedType === "trabajo";
          return (
            <div key={post.id} style={{ background:"#fff", borderRadius:"18px", border:"1px solid #E2E8F0",
                                        padding:"22px", marginBottom:"14px",
                                        boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
              {/* Badge */}
              <div style={{ marginBottom:"14px" }}>
                <span style={{ display:"inline-flex", alignItems:"center", gap:"5px",
                               padding:"4px 10px", borderRadius:"6px", fontSize:"11px", fontWeight:800,
                               textTransform:"uppercase", letterSpacing:"0.05em",
                               background: esTrabajo ? "#F0FDF4" : "#EFF6FF",
                               color:      esTrabajo ? "#059669" : "#2563EB" }}>
                  {esTrabajo ? "🔧 Trabajo realizado" : "📋 Solicitud de cliente"}
                </span>
              </div>

              <h2 style={{ fontSize:"17px", fontWeight:800, color:"#0F172A", marginBottom:"6px" }}>
                {post.titulo || "Sin título"}
              </h2>
              <p style={{ fontSize:"13px", color:"#94A3B8", marginBottom:"12px" }}>
                📍 {post.ciudad||"No especificada"} · 🏷️ {post.tipo||post.categoria||"General"}
              </p>

              {(post.descripcion||post.problema) && (
                <p style={{ fontSize:"14px", color:"#475569", lineHeight:1.6, marginBottom:"16px" }}>
                  {(post.descripcion||post.problema||"").slice(0,200)}
                  {(post.descripcion||post.problema||"").length > 200 ? "..." : ""}
                </p>
              )}

              {/* Fotos */}
              {esTrabajo && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"16px" }}>
                  {post.evidencias?.length > 0 ? (
                    post.evidencias.slice(0,2).map((ev,i) => (
                      <div key={i} style={{ position:"relative" }}>
                        <img src={ev} alt="" style={{ width:"100%", height:"120px", objectFit:"cover", borderRadius:"10px" }} />
                        <span style={{ position:"absolute", bottom:"6px", left:"6px",
                                       background:"rgba(0,0,0,0.6)", color:"#fff",
                                       fontSize:"10px", fontWeight:700, padding:"2px 7px", borderRadius:"4px" }}>
                          {i===0?"ANTES":"DESPUÉS"}
                        </span>
                      </div>
                    ))
                  ) : (
                    ["ANTES","DESPUÉS"].map(l => (
                      <div key={l} style={{ background:"#F8FAFC", borderRadius:"10px", height:"100px",
                                            display:"flex", alignItems:"center", justifyContent:"center",
                                            fontSize:"11px", color:"#94A3B8", fontWeight:600,
                                            border:"1px dashed #E2E8F0" }}>
                        📷 {l}
                      </div>
                    ))
                  )}
                </div>
              )}

              {!esTrabajo && (
                <div style={{ background:"#F8FAFC", borderRadius:"10px", padding:"12px 16px",
                              marginBottom:"16px", display:"flex", gap:"24px", flexWrap:"wrap" }}>
                  <div>
                    <span style={{ fontSize:"11px", color:"#94A3B8", fontWeight:600 }}>URGENCIA</span>
                    <p style={{ fontSize:"13px", fontWeight:700, color: post.urgencia==="Alta"?"#DC2626":"#0F172A" }}>
                      {post.urgencia || "Normal"}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize:"11px", color:"#94A3B8", fontWeight:600 }}>PRESUPUESTO</span>
                    <p style={{ fontSize:"13px", fontWeight:700, color:"#059669" }}>
                      {post.presupuesto || "A convenir"}
                    </p>
                  </div>
                </div>
              )}

              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                            borderTop:"1px solid #F1F5F9", paddingTop:"12px" }}>
                <span style={{ fontSize:"12px", color:"#94A3B8" }}>
                  {esTrabajo ? (post.clienteNombre ? `Cliente: ${post.clienteNombre}` : "Trabajo documentado") : "Publicado recientemente"}
                </span>
                <button onClick={() => {
                  if (esTrabajo && post.tecnicoId) nav("perfil", { tecnicoId:post.tecnicoId });
                  else nav(user ? "registrarTrabajo" : "registro");
                }}
                  style={{ background:"#0F172A", color:"#fff", border:"none", borderRadius:"8px",
                           padding:"8px 16px", fontSize:"12px", fontWeight:600, cursor:"pointer" }}>
                  {esTrabajo ? "Ver técnico" : "Responder solicitud"}
                </button>
              </div>
            </div>
          );
        })}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"72px 20px", background:"#fff",
                        borderRadius:"20px", border:"1px solid #E2E8F0" }}>
            <div style={{ fontSize:"52px", marginBottom:"14px" }}>📋</div>
            <p style={{ fontWeight:800, fontSize:"18px", color:"#0F172A", marginBottom:"8px" }}>No hay publicaciones aún</p>
            <p style={{ fontSize:"14px", color:"#64748B", marginBottom:"24px" }}>
              Registra tu primer trabajo para aparecer en el feed.
            </p>
            <button onClick={() => user ? nav("registrarTrabajo") : nav("registro")}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                       padding:"12px 24px", fontWeight:700, cursor:"pointer" }}>
              {user ? "Registrar mi trabajo →" : "Registrarme gratis →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
