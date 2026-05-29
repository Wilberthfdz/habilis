import { useState } from "react";
import Nav from "../components/Nav.jsx";
import Avatar from "../components/Avatar.jsx";
import { crearSolicitudChat, actualizarSolicitudChat } from "../lib/firebase.js";
import { clasificarSolicitud } from "../lib/gemini.js";

const URGENCIAS = [
  { id:"Normal",      color:"#64748B", bg:"#F1F5F9", desc:"Puedo esperar unos días" },
  { id:"Urgente",     color:"#D97706", bg:"#FEF3C7", desc:"Necesito atención pronto" },
  { id:"Emergencia",  color:"#DC2626", bg:"#FEF2F2", desc:"Necesito ayuda ahora" },
];

const INP = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px", padding:"11px 14px",
              fontSize:"14px", outline:"none", background:"#F8FAFC", color:"#0F172A", boxSizing:"border-box" };

export default function SolicitarServicio({ nav, user, params }) {
  const tecnicoId     = params?.tecnicoId;
  const tecnicoNombre = params?.tecnicoNombre || "el técnico";

  const [descripcion,  setDescripcion]  = useState("");
  const [urgencia,     setUrgencia]     = useState("Normal");
  const [presupuesto,  setPresupuesto]  = useState("");
  const [enviando,     setEnviando]     = useState(false);
  const [error,        setError]        = useState("");

  const enviar = async () => {
    if (!descripcion.trim()) { setError("Describe qué necesitas."); return; }
    if (!user) { nav("login"); return; }
    setError(""); setEnviando(true);
    try {
      // 1. Create solicitud doc
      const solicitudId = await crearSolicitudChat({
        clienteId:    user.uid,
        clienteNombre:user.displayName || user.email?.split("@")[0] || "Cliente",
        tecnicoId,
        tecnicoNombre,
        descripcion:  descripcion.trim(),
        urgencia,
        presupuesto:  presupuesto.trim(),
      });

      // 2. Gemini classification (non-blocking)
      clasificarSolicitud(descripcion)
        .then(cls => actualizarSolicitudChat(solicitudId, { clasificacionGemini: cls }).catch(() => {}))
        .catch(() => {});

      nav("chat", { solicitudId });
    } catch (e) {
      console.error(e);
      setError("Error al enviar. Intenta de nuevo.");
    } finally { setEnviando(false); }
  };

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      {/* HERO */}
      <div style={{ background:"#0F172A", padding:"32px 20px 28px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-5%", width:"380px", height:"380px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.14) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"560px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <button onClick={() => nav("perfil", { tecnicoId })}
            style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", fontSize:"13px",
                     fontWeight:600, cursor:"pointer", marginBottom:"10px", padding:0 }}>
            ← Volver al perfil
          </button>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                      letterSpacing:"0.1em", marginBottom:"6px" }}>💬 Nueva solicitud</p>
          <h1 style={{ fontSize:"clamp(20px,4vw,30px)", fontWeight:900, color:"#fff", marginBottom:"4px" }}>
            Solicitar servicio
          </h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px" }}>
            A: <b style={{ color:"#F97316" }}>{tecnicoNombre}</b>
          </p>
        </div>
      </div>

      <div style={{ maxWidth:"560px", margin:"0 auto", padding:"24px 20px" }}>
        <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
                      padding:"24px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>

          {/* Description */}
          <div style={{ marginBottom:"20px" }}>
            <label style={{ fontSize:"11px", fontWeight:700, color:"#64748B", textTransform:"uppercase",
                            letterSpacing:"0.06em", display:"block", marginBottom:"6px" }}>
              ¿Qué necesitas? *
            </label>
            <textarea
              style={{ ...INP, resize:"vertical", minHeight:"100px" }}
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder="Describe el problema o trabajo que necesitas. Ej: Se me fue la luz en 2 habitaciones, necesito revisar el tablero eléctrico..."
              autoFocus
            />
            <p style={{ fontSize:"11px", color:"#94A3B8", marginTop:"4px" }}>
              ✨ Gemini clasificará automáticamente tu solicitud para el técnico
            </p>
          </div>

          {/* Urgency */}
          <div style={{ marginBottom:"20px" }}>
            <label style={{ fontSize:"11px", fontWeight:700, color:"#64748B", textTransform:"uppercase",
                            letterSpacing:"0.06em", display:"block", marginBottom:"8px" }}>
              Urgencia
            </label>
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
              {URGENCIAS.map(u => (
                <button key={u.id} onClick={() => setUrgencia(u.id)}
                  style={{ flex:"1 1 120px", padding:"10px 14px", borderRadius:"10px", cursor:"pointer",
                           border: urgencia===u.id ? `2px solid ${u.color}` : "1.5px solid #E2E8F0",
                           background: urgencia===u.id ? u.bg : "#fff",
                           textAlign:"left", transition:"all 0.15s" }}>
                  <p style={{ fontWeight:700, fontSize:"13px", color:u.color }}>{u.id}</p>
                  <p style={{ fontSize:"11px", color:"#64748B", marginTop:"2px" }}>{u.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div style={{ marginBottom:"20px" }}>
            <label style={{ fontSize:"11px", fontWeight:700, color:"#64748B", textTransform:"uppercase",
                            letterSpacing:"0.06em", display:"block", marginBottom:"6px" }}>
              Presupuesto aproximado (opcional)
            </label>
            <input style={INP} value={presupuesto} onChange={e => setPresupuesto(e.target.value)}
              placeholder="Ej: $500-$1,000 MXN" />
          </div>

          {error && (
            <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"10px",
                          padding:"10px 14px", fontSize:"13px", color:"#DC2626", marginBottom:"16px" }}>
              {error}
            </div>
          )}

          <button onClick={enviar} disabled={enviando || !descripcion.trim()}
            style={{ width:"100%", background:"#F97316", color:"#fff", border:"none",
                     borderRadius:"12px", padding:"14px", fontSize:"15px", fontWeight:800,
                     cursor: descripcion.trim() ? "pointer" : "not-allowed",
                     opacity: enviando || !descripcion.trim() ? 0.65 : 1,
                     boxShadow:"0 4px 14px rgba(249,115,22,0.3)" }}>
            {enviando ? "Enviando..." : "Enviar solicitud →"}
          </button>

          <p style={{ fontSize:"11px", color:"#94A3B8", textAlign:"center", marginTop:"10px" }}>
            El técnico recibirá tu solicitud y podrá aceptarla o declinarla.
          </p>
        </div>
      </div>
    </div>
  );
}
