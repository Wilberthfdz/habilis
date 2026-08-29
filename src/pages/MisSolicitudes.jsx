import { useState, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import { obtenerSolicitudesCliente } from "../lib/firebase.js";

const ESTADO_CFG = {
  pendiente:  { bg:"#FFF7ED", color:"#EA580C", label:"Pendiente"   },
  aceptado:   { bg:"#EFF6FF", color:"#2563EB", label:"Aceptada"    },
  en_proceso: { bg:"#F0F9FF", color:"#0284C7", label:"En proceso"  },
  completado: { bg:"#F0FDF4", color:"#059669", label:"Completada"  },
  rechazado:  { bg:"#FEF2F2", color:"#DC2626", label:"Rechazada"   },
};
const URGENCIA_COLOR = { Normal:"#64748B", Urgente:"#D97706", Emergencia:"#DC2626" };
const URGENCIA_BG    = { Normal:"#F1F5F9", Urgente:"#FEF3C7", Emergencia:"#FEF2F2" };

const CARD = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
               padding:"20px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };

export default function MisSolicitudes({ nav, user }) {
  const [sols,    setSols]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { nav("login"); return; }
    obtenerSolicitudesCliente(user.uid)
      .then(setSols)
      .catch(() => setSols([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      {/* HERO */}
      <div style={{ background:"#0F172A", padding:"32px 20px 28px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-5%", width:"400px", height:"400px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"760px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                      letterSpacing:"0.1em", marginBottom:"8px" }}>💬 Tu actividad</p>
          <h1 style={{ fontSize:"clamp(20px,4vw,34px)", fontWeight:900, color:"#fff" }}>
            Mis solicitudes
          </h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px", marginTop:"6px" }}>
            Los técnicos que has contactado y el estado de cada solicitud.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:"760px", margin:"0 auto", padding:"20px" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                          borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
            <p style={{ color:"#64748B" }}>Cargando tus solicitudes...</p>
          </div>
        ) : sols.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 20px", ...CARD }}>
            <div style={{ fontSize:"52px", marginBottom:"14px" }}>🔍</div>
            <h2 style={{ fontWeight:900, fontSize:"18px", color:"#0F172A", marginBottom:"8px" }}>
              Aún no has contactado a ningún técnico
            </h2>
            <p style={{ color:"#64748B", fontSize:"14px", marginBottom:"24px" }}>
              Busca un técnico verificado y envíale tu primera solicitud.
            </p>
            <button onClick={() => nav("buscar")}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                       padding:"12px 24px", fontWeight:700, cursor:"pointer" }}>
              Buscar técnicos →
            </button>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {sols.map(s => {
              const cfg = ESTADO_CFG[s.estado] || { bg:"#F1F5F9", color:"#64748B", label:s.estado };
              return (
                <div key={s.id} style={{ ...CARD, cursor:"pointer" }}
                  onClick={() => nav("chat", { solicitudId:s.id })}>
                  <div style={{ display:"flex", gap:"14px", alignItems:"center", flexWrap:"wrap" }}>
                    <div style={{ flex:"2 1 200px", minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px", flexWrap:"wrap" }}>
                        <span style={{ fontWeight:800, fontSize:"14px", color:"#0F172A" }}>{s.tecnicoNombre || "Técnico"}</span>
                        <span style={{ background:cfg.bg, color:cfg.color, fontSize:"10px", fontWeight:700,
                                       padding:"2px 8px", borderRadius:"20px" }}>{cfg.label}</span>
                        <span style={{ background:URGENCIA_BG[s.urgencia]||"#F1F5F9", color:URGENCIA_COLOR[s.urgencia]||"#64748B",
                                       fontSize:"10px", fontWeight:700, padding:"2px 8px", borderRadius:"20px" }}>
                          {s.urgencia || "Normal"}
                        </span>
                      </div>
                      <p style={{ fontSize:"13px", color:"#64748B", overflow:"hidden", textOverflow:"ellipsis",
                                  whiteSpace:"nowrap" }}>
                        {s.descripcion}
                      </p>
                    </div>
                    <div style={{ flex:"0 0 auto", textAlign:"right" }}>
                      <p style={{ fontSize:"11px", color:"#94A3B8" }}>
                        {s.createdAt?.toDate ? s.createdAt.toDate().toLocaleDateString("es-MX") : ""}
                      </p>
                      <span style={{ color:"#F97316", fontSize:"12px", fontWeight:700 }}>Ver conversación →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
