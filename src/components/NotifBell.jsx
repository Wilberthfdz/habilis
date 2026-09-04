import { useState, useEffect, useRef } from "react";
import { obtenerNotificaciones, marcarNotificacionLeida, marcarTodasLeidas } from "../lib/firebase.js";

// Campana de notificaciones — muestra lo que los agentes de IA (y el admin)
// escriben en la colección `notificaciones`: asignaciones de solicitudes,
// veredictos de moderación, avisos de Habilis Care, bienvenidas.
const ICONO_TIPO = {
  solicitud:  "🎯",
  moderacion: "🛡️",
  bienvenida: "👋",
  care:       "🏥",
  marketing:  "📣",
  chat:       "💬",
};

function tiempoRelativo(fecha) {
  const ms = fecha?.toMillis?.() ? Date.now() - fecha.toMillis() : 0;
  const min = Math.floor(ms / 60000);
  if (min < 1)   return "ahora";
  if (min < 60)  return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24)    return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? "ayer" : `hace ${d} días`;
}

export default function NotifBell({ nav, user }) {
  const [open,   setOpen]   = useState(false);
  const [notifs, setNotifs] = useState([]);
  const boxRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    let vivo = true;
    const cargar = () => obtenerNotificaciones(user.uid)
      .then(n => { if (vivo) setNotifs(n); })
      .catch(() => {});
    cargar();
    const t = setInterval(cargar, 60000); // refresco cada minuto
    return () => { vivo = false; clearInterval(t); };
  }, [user]);

  useEffect(() => {
    if (!open) return;
    const cerrar = e => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", cerrar);
    return () => document.removeEventListener("mousedown", cerrar);
  }, [open]);

  if (!user) return null;

  const noLeidas = notifs.filter(n => !n.leida).length;

  const abrir = async (n) => {
    setOpen(false);
    if (!n.leida) {
      setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, leida: true } : x));
      marcarNotificacionLeida(n.id).catch(() => {});
    }
    // El chat necesita saber QUÉ conversación abrir; el resto de los avisos
    // van a una pantalla sin parámetros.
    if (n.link === "chat" && n.solicitudId) nav("chat", { solicitudId: n.solicitudId });
    else if (n.link) nav(n.link);
  };

  const limpiarTodas = () => {
    setNotifs(prev => prev.map(n => ({ ...n, leida: true })));
    marcarTodasLeidas(notifs).catch(() => {});
  };

  return (
    <div ref={boxRef} style={{ position:"relative" }}>
      <button onClick={() => setOpen(o => !o)} aria-label="Notificaciones"
        style={{ background:"none", border:"none", cursor:"pointer", position:"relative",
                 padding:"8px", minHeight:"40px", minWidth:"40px", display:"flex",
                 alignItems:"center", justifyContent:"center" }}>
        <svg viewBox="0 0 24 24" width="19" height="19" fill="none"
             stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {noLeidas > 0 && (
          <span style={{ position:"absolute", top:"4px", right:"2px", background:"#F97316",
                         color:"#fff", fontSize:"9px", fontWeight:800, minWidth:"16px", height:"16px",
                         borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center",
                         padding:"0 4px", border:"2px solid #0F172A" }}>
            {noLeidas > 9 ? "9+" : noLeidas}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position:"absolute", right:0, top:"48px", width:"min(340px, 88vw)",
                      background:"#fff", border:"1px solid #E2E8F0", borderRadius:"14px",
                      boxShadow:"0 12px 32px rgba(0,0,0,0.18)", zIndex:300, overflow:"hidden" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                        padding:"12px 16px", borderBottom:"1px solid #F1F5F9" }}>
            <p style={{ fontWeight:800, fontSize:"13px", color:"#0F172A" }}>Notificaciones</p>
            {noLeidas > 0 && (
              <button onClick={limpiarTodas}
                style={{ background:"none", border:"none", color:"#F97316", fontSize:"11px",
                         fontWeight:700, cursor:"pointer" }}>
                Marcar todas leídas
              </button>
            )}
          </div>
          <div style={{ maxHeight:"380px", overflowY:"auto" }}>
            {notifs.length === 0 ? (
              <p style={{ padding:"28px 16px", textAlign:"center", color:"#94A3B8", fontSize:"13px" }}>
                Sin notificaciones todavía.<br/>Aquí verás la actividad de tu cuenta.
              </p>
            ) : notifs.map(n => (
              <button key={n.id} onClick={() => abrir(n)}
                style={{ display:"flex", gap:"10px", width:"100%", textAlign:"left",
                         background: n.leida ? "#fff" : "#FFF7ED", border:"none",
                         borderBottom:"1px solid #F1F5F9", padding:"12px 16px", cursor:"pointer" }}>
                <span style={{ fontSize:"18px", flexShrink:0 }}>{ICONO_TIPO[n.tipo] || "🔔"}</span>
                <span style={{ minWidth:0 }}>
                  <span style={{ display:"block", fontSize:"12.5px", color:"#0F172A",
                                 lineHeight:1.45, fontWeight: n.leida ? 400 : 600 }}>
                    {n.mensaje}
                  </span>
                  <span style={{ display:"block", fontSize:"11px", color:"#94A3B8", marginTop:"3px" }}>
                    {tiempoRelativo(n.fecha)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
