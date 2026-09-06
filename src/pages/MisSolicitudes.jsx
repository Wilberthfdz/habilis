import { useState, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import Avatar from "../components/Avatar.jsx";
import { obtenerSolicitudesDelCliente } from "../lib/firebase.js";

// El panel del cliente. Antes no existía: un cliente que cerraba la
// conversación solo podía volver a ella por una notificación.
const ESTADO = {
  pendiente:  { bg:"#FEF3C7", color:"#D97706", label:"Esperando al técnico" },
  aceptado:   { bg:"#F0FDF4", color:"#059669", label:"En curso" },
  rechazado:  { bg:"#FEF2F2", color:"#DC2626", label:"No disponible" },
  completado: { bg:"#F1F5F9", color:"#64748B", label:"Completado" },
};

export default function MisSolicitudes({ nav, user }) {
  const [lista,   setLista]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!user) { nav("login"); return; }
    obtenerSolicitudesDelCliente(user.uid)
      .then(setLista)
      .catch(e => { console.error(e); setError("No pudimos cargar tus solicitudes."); })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      <div style={{ background:"#0F172A", padding:"36px 20px 32px" }}>
        <div style={{ maxWidth:"760px", margin:"0 auto" }}>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                      letterSpacing:"0.1em", marginBottom:"8px" }}>Mi cuenta</p>
          <h1 style={{ fontSize:"clamp(22px,4vw,34px)", fontWeight:900, color:"#fff", marginBottom:"6px" }}>
            Mis solicitudes
          </h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px" }}>
            Las conversaciones que has abierto con técnicos.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:"760px", margin:"0 auto", padding:"24px 20px 48px" }}>
        {loading ? (
          <p style={{ color:"#64748B", textAlign:"center", padding:"40px" }}>Cargando…</p>
        ) : error ? (
          <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"12px",
                        padding:"14px 16px", color:"#DC2626", fontSize:"13px" }}>{error}</div>
        ) : lista.length === 0 ? (
          <div style={{ textAlign:"center", padding:"56px 20px", background:"#fff",
                        borderRadius:"20px", border:"1px solid #E2E8F0" }}>
            <p style={{ fontWeight:800, fontSize:"18px", color:"#0F172A", marginBottom:"6px" }}>
              Todavía no has pedido ningún servicio
            </p>
            <p style={{ color:"#64748B", fontSize:"14px", marginBottom:"22px" }}>
              Busca un técnico, entra a su perfil y escríbele lo que necesitas.
            </p>
            <button onClick={() => nav("buscar")}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                       padding:"12px 24px", fontWeight:700, cursor:"pointer" }}>
              Buscar un técnico →
            </button>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            {lista.map(s => {
              const e = ESTADO[s.estado] || { bg:"#F1F5F9", color:"#64748B", label:s.estado };
              return (
                <div key={s.id} onClick={() => nav("chat", { solicitudId:s.id })}
                  style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
                           padding:"16px 18px", cursor:"pointer", display:"flex", gap:"14px",
                           alignItems:"flex-start", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
                  <Avatar size={44} nombre={s.tecnicoNombre} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", gap:"10px", flexWrap:"wrap" }}>
                      <p style={{ fontWeight:800, fontSize:"14px", color:"#0F172A" }}>{s.tecnicoNombre || "Técnico"}</p>
                      <span style={{ background:e.bg, color:e.color, fontSize:"11px", fontWeight:700,
                                     padding:"3px 10px", borderRadius:"20px" }}>{e.label}</span>
                    </div>
                    <p style={{ fontSize:"13px", color:"#475569", marginTop:"4px", lineHeight:1.5,
                                overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>
                      {s.descripcion}
                    </p>
                    {s.review && (
                      <p style={{ fontSize:"12px", color:"#D97706", marginTop:"4px", fontWeight:600 }}>
                        ⭐ Calificaste con {s.review.rating}/5
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer nav={nav} />
    </div>
  );
}
