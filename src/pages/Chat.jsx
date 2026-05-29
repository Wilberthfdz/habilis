import { useState, useEffect, useRef } from "react";
import Nav from "../components/Nav.jsx";
import Avatar from "../components/Avatar.jsx";
import { db } from "../lib/firebase.js";
import {
  actualizarSolicitudChat, enviarMensajeChat, crearTrabajo,
} from "../lib/firebase.js";
import { generarResumenChat } from "../lib/gemini.js";
import {
  doc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp,
} from "firebase/firestore";

const URGENCIA_COLOR = { Normal:"#64748B", Urgente:"#D97706", Emergencia:"#DC2626" };
const URGENCIA_BG    = { Normal:"#F1F5F9", Urgente:"#FEF3C7", Emergencia:"#FEF2F2" };

export default function Chat({ nav, user, params }) {
  const solicitudId = params?.solicitudId;

  const [solicitud,    setSolicitud]    = useState(null);
  const [mensajes,     setMensajes]     = useState([]);
  const [texto,        setTexto]        = useState("");
  const [loading,      setLoading]      = useState(true);
  const [enviando,     setEnviando]     = useState(false);
  const [completando,  setCompletando]  = useState(false);
  const [showReview,   setShowReview]   = useState(false);
  const [rating,       setRating]       = useState(0);
  const [reviewText,   setReviewText]   = useState("");
  const bottomRef = useRef(null);

  const esTecnico = solicitud && user?.uid === solicitud.tecnicoId;
  const esCliente = solicitud && user?.uid === solicitud.clienteId;
  const enConversacion = esTecnico || esCliente;

  useEffect(() => {
    if (!solicitudId || !user) { nav(user ? "panel" : "login"); return; }

    // Real-time listener on solicitud document
    const unsubSol = onSnapshot(doc(db, "solicitudes_chat", solicitudId), snap => {
      if (snap.exists()) {
        setSolicitud({ id: snap.id, ...snap.data() });
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    // Real-time listener on messages subcollection
    const qMsg = query(
      collection(db, "solicitudes_chat", solicitudId, "mensajes"),
      orderBy("timestamp", "asc")
    );
    const unsubMsg = onSnapshot(qMsg, snap => {
      setMensajes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubSol(); unsubMsg(); };
  }, [solicitudId, user]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [mensajes]);

  const agregarMsgSistema = async texto => {
    await addDoc(collection(db, "solicitudes_chat", solicitudId, "mensajes"), {
      autorId: "sistema", autorNombre:"Habilis", texto, tipo:"sistema",
      timestamp: serverTimestamp(),
    });
  };

  const aceptarSolicitud = async () => {
    await actualizarSolicitudChat(solicitudId, { estado:"aceptado" });
    // Create expediente in trabajos
    const expedienteId = await crearTrabajo({
      titulo:          `Solicitud: ${(solicitud.descripcion||"").slice(0,50)}`,
      descripcion:     solicitud.descripcion,
      tipo:            solicitud.clasificacionGemini?.tipoTrabajo || "Servicio",
      estado:          "en_proceso",
      tecnicoId:       solicitud.tecnicoId,
      clienteId:       solicitud.clienteId,
      clienteNombre:   solicitud.clienteNombre,
      origen:          "chat",
      solicitudId,
    });
    await actualizarSolicitudChat(solicitudId, { expedienteId });
    await agregarMsgSistema(`✅ ${solicitud.tecnicoNombre} aceptó la solicitud. ¡Puede comenzar el chat!`);
  };

  const rechazarSolicitud = async () => {
    await actualizarSolicitudChat(solicitudId, { estado:"rechazado" });
    await agregarMsgSistema("❌ El técnico no puede atender esta solicitud. Habilis buscará otro técnico.");
  };

  const enviarMensaje = async () => {
    if (!texto.trim() || !enConversacion || enviando) return;
    const msg = texto.trim();
    setTexto(""); setEnviando(true);
    try {
      await addDoc(collection(db, "solicitudes_chat", solicitudId, "mensajes"), {
        autorId:    user.uid,
        autorNombre:user.displayName || user.email?.split("@")[0] || "Usuario",
        texto:      msg,
        tipo:       "mensaje",
        timestamp:  serverTimestamp(),
      });
    } finally { setEnviando(false); }
  };

  const marcarCompletado = async () => {
    setCompletando(true);
    try {
      await actualizarSolicitudChat(solicitudId, { estado:"completado" });
      // Gemini summary
      try {
        const resumen = await generarResumenChat(mensajes, solicitud.descripcion || "");
        await agregarMsgSistema(`✅ Trabajo marcado como completado.\n📋 Resumen: ${resumen}`);
      } catch {
        await agregarMsgSistema("✅ Trabajo marcado como completado.");
      }
      if (esCliente) setShowReview(true);
    } finally { setCompletando(false); }
  };

  const enviarReview = async () => {
    if (rating === 0) return;
    await actualizarSolicitudChat(solicitudId, {
      review: { rating, texto: reviewText, fecha: new Date().toISOString() }
    });
    await agregarMsgSistema(`⭐ El cliente dejó una calificación de ${rating}/5.`);
    setShowReview(false);
  };

  const onKey = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviarMensaje(); } };

  if (loading) return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>
      <div style={{ textAlign:"center", padding:"80px" }}>
        <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                      borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
        <p style={{ color:"#64748B" }}>Cargando conversación...</p>
      </div>
    </div>
  );

  if (!solicitud) return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>
      <div style={{ textAlign:"center", padding:"80px" }}>
        <p style={{ fontSize:"52px" }}>💬</p>
        <p style={{ fontWeight:800, color:"#0F172A", marginTop:"12px" }}>Solicitud no encontrada</p>
        <button onClick={() => nav("panel")}
          style={{ marginTop:"20px", background:"#F97316", color:"#fff", border:"none",
                   borderRadius:"10px", padding:"11px 22px", fontWeight:700, cursor:"pointer" }}>
          Ir al Panel
        </button>
      </div>
    </div>
  );

  const estadoBadge = {
    pendiente:  { bg:"#FEF3C7", color:"#D97706",  label:"Pendiente de respuesta" },
    aceptado:   { bg:"#F0FDF4", color:"#059669",  label:"En curso" },
    rechazado:  { bg:"#FEF2F2", color:"#DC2626",  label:"No disponible" },
    completado: { bg:"#F1F5F9", color:"#64748B",  label:"Completado" },
  }[solicitud.estado] || { bg:"#F1F5F9", color:"#64748B", label:solicitud.estado };

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      {/* HEADER */}
      <div style={{ background:"#0F172A", padding:"16px 20px", position:"sticky", top:"60px",
                    zIndex:100, borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth:"700px", margin:"0 auto", display:"flex", gap:"12px", alignItems:"center" }}>
          <button onClick={() => nav("panel")}
            style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)", cursor:"pointer",
                     fontSize:"18px", padding:"0 8px 0 0", flexShrink:0 }}>←</button>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
              <p style={{ fontWeight:800, fontSize:"14px", color:"#fff",
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {esTecnico ? solicitud.clienteNombre : solicitud.tecnicoNombre}
              </p>
              <span style={{ background:estadoBadge.bg, color:estadoBadge.color, fontSize:"10px",
                             fontWeight:700, padding:"2px 8px", borderRadius:"12px", flexShrink:0 }}>
                {estadoBadge.label}
              </span>
              {solicitud.urgencia !== "Normal" && (
                <span style={{ background:URGENCIA_BG[solicitud.urgencia],
                               color:URGENCIA_COLOR[solicitud.urgencia],
                               fontSize:"10px", fontWeight:700, padding:"2px 8px", borderRadius:"12px" }}>
                  {solicitud.urgencia}
                </span>
              )}
            </div>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"12px",
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {solicitud.descripcion}
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ flex:1, maxWidth:"700px", margin:"0 auto", width:"100%", padding:"16px 20px",
                    display:"flex", flexDirection:"column", gap:"16px" }}>

        {/* Solicitud card */}
        <div style={{ background:"#fff", border:"1px solid #E2E8F0", borderRadius:"14px",
                      padding:"16px 18px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#94A3B8", textTransform:"uppercase",
                      letterSpacing:"0.06em", marginBottom:"6px" }}>Solicitud de servicio</p>
          <p style={{ fontSize:"14px", color:"#0F172A", lineHeight:1.6, marginBottom:"8px" }}>
            {solicitud.descripcion}
          </p>
          <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
            {solicitud.urgencia && (
              <span style={{ fontSize:"12px", fontWeight:600,
                             color:URGENCIA_COLOR[solicitud.urgencia] || "#64748B" }}>
                Urgencia: {solicitud.urgencia}
              </span>
            )}
            {solicitud.presupuesto && (
              <span style={{ fontSize:"12px", color:"#64748B" }}>
                Presupuesto: {solicitud.presupuesto}
              </span>
            )}
            {solicitud.clasificacionGemini && (
              <span style={{ fontSize:"11px", color:"#F97316", fontWeight:600 }}>
                ✨ {solicitud.clasificacionGemini.tipoTrabajo}
              </span>
            )}
          </div>
        </div>

        {/* TECHNICIAN ACCEPT/REJECT — pending state */}
        {esTecnico && solicitud.estado === "pendiente" && (
          <div style={{ background:"#fff", border:"2px solid #F97316", borderRadius:"14px",
                        padding:"20px", textAlign:"center" }}>
            <p style={{ fontWeight:800, fontSize:"16px", color:"#0F172A", marginBottom:"6px" }}>
              Nueva solicitud de servicio
            </p>
            <p style={{ color:"#64748B", fontSize:"14px", marginBottom:"20px" }}>
              {solicitud.clienteNombre} quiere contratarte. ¿Puedes atenderlo?
            </p>
            <div style={{ display:"flex", gap:"12px", justifyContent:"center" }}>
              <button onClick={rechazarSolicitud}
                style={{ background:"#FEF2F2", color:"#DC2626", border:"1.5px solid #FECACA",
                         borderRadius:"10px", padding:"11px 24px", fontWeight:700, fontSize:"14px",
                         cursor:"pointer" }}>
                ❌ No puedo atender
              </button>
              <button onClick={aceptarSolicitud}
                style={{ background:"#F97316", color:"#fff", border:"none",
                         borderRadius:"10px", padding:"11px 24px", fontWeight:800, fontSize:"14px",
                         cursor:"pointer" }}>
                ✅ Aceptar solicitud
              </button>
            </div>
          </div>
        )}

        {/* CLIENT WAITING — pending, not technician */}
        {esCliente && solicitud.estado === "pendiente" && (
          <div style={{ background:"#FFF7ED", border:"1px solid rgba(249,115,22,0.25)",
                        borderRadius:"12px", padding:"16px", textAlign:"center" }}>
            <p style={{ fontSize:"14px", color:"#92400E", fontWeight:600 }}>
              ⏳ Esperando respuesta de {solicitud.tecnicoNombre}...
            </p>
            <p style={{ fontSize:"12px", color:"#B45309", marginTop:"4px" }}>
              El técnico revisará tu solicitud pronto
            </p>
          </div>
        )}

        {/* REJECTED */}
        {solicitud.estado === "rechazado" && (
          <div style={{ background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"12px",
                        padding:"16px", textAlign:"center" }}>
            <p style={{ fontSize:"14px", color:"#DC2626", fontWeight:600, marginBottom:"10px" }}>
              El técnico no puede atender esta solicitud en este momento
            </p>
            <button onClick={() => nav("buscar")}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"9px",
                       padding:"9px 18px", fontWeight:700, fontSize:"13px", cursor:"pointer" }}>
              Buscar otro técnico →
            </button>
          </div>
        )}

        {/* CHAT MESSAGES — accepted state */}
        {(solicitud.estado === "aceptado" || solicitud.estado === "completado") && (
          <>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px", minHeight:"200px" }}>
              {mensajes.map(m => {
                if (m.tipo === "sistema") return (
                  <div key={m.id} style={{ textAlign:"center", padding:"8px 0" }}>
                    <span style={{ background:"#F1F5F9", color:"#64748B", fontSize:"12px",
                                   padding:"4px 12px", borderRadius:"12px", display:"inline-block",
                                   lineHeight:1.5, maxWidth:"80%", whiteSpace:"pre-wrap" }}>
                      {m.texto}
                    </span>
                  </div>
                );
                const esMio = m.autorId === user?.uid;
                return (
                  <div key={m.id} style={{ display:"flex", justifyContent: esMio ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth:"72%",
                                  background: esMio ? "#F97316" : "#fff",
                                  color: esMio ? "#fff" : "#0F172A",
                                  border: esMio ? "none" : "1px solid #E2E8F0",
                                  borderRadius: esMio ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                  padding:"10px 14px",
                                  boxShadow:"0 1px 3px rgba(0,0,0,0.08)" }}>
                      {!esMio && (
                        <p style={{ fontSize:"10px", fontWeight:700, color:"#F97316", marginBottom:"3px" }}>
                          {m.autorNombre}
                        </p>
                      )}
                      <p style={{ fontSize:"14px", lineHeight:1.5, whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
                        {m.texto}
                      </p>
                      <p style={{ fontSize:"10px", opacity:0.6, marginTop:"4px", textAlign: esMio ? "right" : "left" }}>
                        {m.timestamp?.toDate?.()?.toLocaleTimeString("es-MX", { hour:"2-digit", minute:"2-digit" }) || ""}
                      </p>
                    </div>
                  </div>
                );
              })}
              {mensajes.length === 0 && (
                <p style={{ textAlign:"center", color:"#94A3B8", fontSize:"13px", padding:"24px" }}>
                  Solicitud aceptada. ¡Empieza la conversación! 👋
                </p>
              )}
              <div ref={bottomRef} />
            </div>

            {/* MARK COMPLETE */}
            {solicitud.estado === "aceptado" && enConversacion && (
              <button onClick={marcarCompletado} disabled={completando}
                style={{ background:"#059669", color:"#fff", border:"none", borderRadius:"10px",
                         padding:"11px", fontWeight:700, fontSize:"13px", cursor:"pointer",
                         opacity: completando ? 0.7 : 1 }}>
                {completando ? "Procesando..." : "✅ Marcar trabajo como completado"}
              </button>
            )}

            {/* INPUT */}
            {solicitud.estado === "aceptado" && enConversacion && (
              <div style={{ display:"flex", gap:"8px", background:"#fff", border:"1px solid #E2E8F0",
                            borderRadius:"14px", padding:"10px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>
                <textarea
                  style={{ flex:1, border:"none", outline:"none", resize:"none", fontSize:"14px",
                           color:"#0F172A", background:"transparent", minHeight:"40px", maxHeight:"120px",
                           lineHeight:1.5, padding:"2px" }}
                  value={texto} onChange={e => setTexto(e.target.value)} onKeyDown={onKey}
                  placeholder="Escribe un mensaje... (Enter para enviar)"
                />
                <button onClick={enviarMensaje} disabled={!texto.trim() || enviando}
                  style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                           padding:"8px 16px", fontWeight:700, fontSize:"13px",
                           cursor: texto.trim() ? "pointer" : "not-allowed",
                           opacity: texto.trim() ? 1 : 0.5, flexShrink:0, alignSelf:"flex-end" }}>
                  Enviar
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* REVIEW MODAL */}
      {showReview && (
        <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.7)", zIndex:1000,
                      display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
          <div style={{ background:"#fff", borderRadius:"20px", padding:"32px", width:"100%",
                        maxWidth:"400px", textAlign:"center" }}>
            <p style={{ fontSize:"36px", marginBottom:"12px" }}>⭐</p>
            <h3 style={{ fontWeight:900, fontSize:"18px", color:"#0F172A", marginBottom:"6px" }}>
              ¿Cómo estuvo el servicio?
            </h3>
            <p style={{ color:"#64748B", fontSize:"14px", marginBottom:"20px" }}>
              Tu calificación ayuda a otros clientes
            </p>
            <div style={{ display:"flex", gap:"8px", justifyContent:"center", marginBottom:"16px" }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRating(n)}
                  style={{ fontSize:"28px", background:"none", border:"none", cursor:"pointer",
                           opacity: n <= rating ? 1 : 0.3, transition:"opacity 0.15s" }}>
                  ⭐
                </button>
              ))}
            </div>
            <textarea
              style={{ width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px", padding:"10px",
                       fontSize:"13px", outline:"none", resize:"vertical", minHeight:"60px",
                       boxSizing:"border-box", marginBottom:"14px" }}
              value={reviewText} onChange={e => setReviewText(e.target.value)}
              placeholder="Comentario opcional..." />
            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={() => setShowReview(false)}
                style={{ flex:1, background:"#F1F5F9", color:"#374151", border:"none",
                         borderRadius:"10px", padding:"12px", fontWeight:600, cursor:"pointer" }}>
                Omitir
              </button>
              <button onClick={enviarReview} disabled={rating === 0}
                style={{ flex:2, background:"#F97316", color:"#fff", border:"none",
                         borderRadius:"10px", padding:"12px", fontWeight:700,
                         cursor: rating ? "pointer" : "not-allowed", opacity: rating ? 1 : 0.5 }}>
                Enviar calificación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
