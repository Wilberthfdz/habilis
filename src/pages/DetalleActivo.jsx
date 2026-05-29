import { useState, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import { obtenerActivos, actualizarActivo, crearServicio, obtenerServicios, crearSolicitud } from "../lib/firebase.js";
import { TIPOS_ACTIVO, calcularSalud, calcularProxima } from "./HabilisCare.jsx";

// Re-export AnilloSalud if needed by other components
function AnilloGrande({ pct }) {
  const size  = 110;
  const r     = (size - 12) / 2;
  const circ  = 2 * Math.PI * r;
  const fill  = Math.max(0, Math.min(100, pct));
  const color = fill > 80 ? "#10B981" : fill > 50 ? "#F59E0B" : "#EF4444";
  const label = fill > 80 ? "Saludable" : fill > 50 ? "Revisar pronto" : "Requiere servicio";
  return (
    <div style={{ textAlign:"center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth="10"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
                strokeDasharray={`${(fill/100)*circ} ${circ}`} strokeLinecap="round"
                transform={`rotate(-90 ${size/2} ${size/2})`}
                style={{ transition:"stroke-dasharray 0.7s ease" }}/>
        <text x={size/2} y={size/2-4} textAnchor="middle" dominantBaseline="middle"
              fontSize="18" fontWeight="900" fill={color}>{fill}%</text>
        <text x={size/2} y={size/2+16} textAnchor="middle" fontSize="9" fill="#94A3B8">SALUD</text>
      </svg>
      <p style={{ fontSize:"12px", fontWeight:700, color, marginTop:"4px" }}>{label}</p>
    </div>
  );
}

const CARD = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
               padding:"20px", marginBottom:"14px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };
const BTN  = { background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
               padding:"10px 18px", fontSize:"14px", fontWeight:700, cursor:"pointer" };
const INP  = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
               padding:"10px 13px", fontSize:"14px", outline:"none",
               background:"#F8FAFC", color:"#0F172A", boxSizing:"border-box" };

const fmtDate   = d => d ? (d.toDate ? d.toDate() : new Date(d)).toLocaleDateString("es-MX", { day:"2-digit", month:"short", year:"numeric" }) : "—";
const diasHasta = d => d ? Math.ceil((d - Date.now()) / 86400000) : null;

export default function DetalleActivo({ nav, user, params }) {
  const [activo,    setActivo]    = useState(null);
  const [servicios, setServicios] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showServForm, setShowServForm] = useState(false);
  const [solicitando, setSolicitando]  = useState(false);
  const [solicOk,     setSolicOk]      = useState(false);
  const [servForm, setServForm] = useState({
    fecha:"", descripcion:"", costo:"", tecnico:"",
  });

  const activoId = params?.activoId;

  useEffect(() => {
    if (!user || !activoId) { nav("habilisCare"); return; }
    cargar();
  }, [activoId]);

  const cargar = async () => {
    setLoading(true);
    try {
      const todos = await obtenerActivos(user.uid);
      const a = todos.find(x => x.id === activoId);
      if (!a) { nav("habilisCare"); return; }
      setActivo(a);
      const sv = await obtenerServicios(activoId);
      setServicios(sv);
    } finally { setLoading(false); }
  };

  const registrarServicio = async () => {
    if (!servForm.fecha || !servForm.descripcion.trim()) return;
    try {
      await crearServicio({
        activoId,
        userId: user.uid,
        fecha: servForm.fecha,
        descripcion: servForm.descripcion.trim(),
        costo: parseFloat(servForm.costo) || 0,
        tecnico: servForm.tecnico.trim(),
      });
      // Update activo's last maintenance date
      await actualizarActivo(activoId, { ultimoMantenimiento: servForm.fecha });
      setServForm({ fecha:"", descripcion:"", costo:"", tecnico:"" });
      setShowServForm(false);
      cargar();
    } catch (e) { console.error(e); }
  };

  const solicitarMantenimiento = async () => {
    setSolicitando(true);
    try {
      await crearSolicitud({
        titulo:    `Mantenimiento: ${activo.nombre}`,
        categoria: activo.tipo,
        descripcion: `Solicitud de mantenimiento para ${activo.nombre} (${activo.marca || ""} ${activo.modelo || ""}). Último servicio: ${fmtDate(activo.ultimoMantenimiento)}.`,
        ciudad:    "",
        urgencia:  calcularSalud(activo) < 50 ? "Alta" : "Normal",
        userId:    user.uid,
        activoId,
      });
      setSolicOk(true);
    } finally { setSolicitando(false); }
  };

  const openCtrlW = () => {
    const url = new URL("https://ctrlw.mx/cotizacion");
    url.searchParams.set("action", "crear");
    url.searchParams.set("from", "habilis");
    url.searchParams.set("equipo", activo?.nombre || "");
    url.searchParams.set("cliente", user?.email || "");
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  if (loading) return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>
      <div style={{ textAlign:"center", padding:"100px 20px" }}>
        <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                      borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
        <p style={{ color:"#64748B" }}>Cargando equipo...</p>
      </div>
    </div>
  );

  if (!activo) return null;

  const salud   = calcularSalud(activo);
  const proxima = calcularProxima(activo);
  const dias    = diasHasta(proxima);
  const cfg     = TIPOS_ACTIVO[activo.tipo] || { icono:"🔧", intervalo: 180 };
  const color   = salud > 80 ? "#10B981" : salud > 50 ? "#F59E0B" : "#EF4444";

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      {/* HERO BANNER */}
      <div style={{ background:"#0F172A", padding:"32px 20px 28px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-5%", width:"400px", height:"400px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.14) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"680px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <button onClick={() => nav("habilisCare")}
            style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)",
                     fontSize:"13px", fontWeight:600, cursor:"pointer", marginBottom:"10px", padding:0 }}>
            ← Habilis Care
          </button>
          <div style={{ display:"flex", gap:"16px", alignItems:"flex-start" }}>
            <span style={{ fontSize:"40px" }}>{cfg.icono}</span>
            <div>
              <h1 style={{ fontSize:"clamp(20px,4vw,28px)", fontWeight:900, color:"#fff", marginBottom:"4px" }}>
                {activo.nombre}
              </h1>
              <p style={{ color:"#F97316", fontSize:"14px", fontWeight:600 }}>
                {activo.tipo}{activo.marca ? ` · ${activo.marca}` : ""}{activo.modelo ? ` ${activo.modelo}` : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"680px", margin:"0 auto", padding:"20px" }}>

        {/* Health + countdown */}
        <div style={CARD}>
          <div style={{ display:"flex", gap:"24px", alignItems:"center", flexWrap:"wrap" }}>
            <AnilloGrande pct={salud} />
            <div style={{ flex:1, minWidth:"160px" }}>
              <div style={{ marginBottom:"14px" }}>
                <p style={{ fontSize:"11px", fontWeight:700, color:"#94A3B8",
                            textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"4px" }}>
                  Próximo mantenimiento
                </p>
                <p style={{ fontSize:"22px", fontWeight:900, color }}>
                  {proxima
                    ? dias < 0 ? `Vencido hace ${Math.abs(dias)} días` : dias === 0 ? "¡Hoy!" : `En ${dias} días`
                    : "Sin registro"}
                </p>
                {proxima && <p style={{ fontSize:"12px", color:"#94A3B8", marginTop:"2px" }}>{fmtDate(proxima)}</p>}
              </div>
              <p style={{ fontSize:"12px", color:"#64748B" }}>
                Intervalo recomendado: <b>cada {cfg.intervalo} días{cfg.nota ? ` ${cfg.nota}` : ""}</b>
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display:"flex", gap:"10px", marginBottom:"14px", flexWrap:"wrap" }}>
          {solicOk ? (
            <div style={{ flex:1, background:"#F0FDF4", border:"1px solid #A7F3D0", borderRadius:"10px",
                          padding:"11px 16px", fontSize:"14px", fontWeight:600, color:"#059669" }}>
              ✅ Solicitud enviada al Feed de Habilis
            </div>
          ) : (
            <button onClick={solicitarMantenimiento} disabled={solicitando}
              style={{ ...BTN, flex:1, opacity: solicitando ? 0.7 : 1 }}>
              {solicitando ? "Enviando..." : "🔧 Solicitar mantenimiento"}
            </button>
          )}
          <button onClick={openCtrlW}
            style={{ flex:1, background:"#0F172A", color:"#fff", border:"none", borderRadius:"10px",
                     padding:"10px 18px", fontSize:"14px", fontWeight:700, cursor:"pointer" }}>
            💼 Cotizar con CTRL+W
          </button>
        </div>

        {/* Asset details */}
        <div style={CARD}>
          <h3 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"14px" }}>
            Información del equipo
          </h3>
          {[
            ["Tipo",                 activo.tipo],
            ["Marca",                activo.marca || "—"],
            ["Modelo",               activo.modelo || "—"],
            ["Fecha de compra",      fmtDate(activo.fechaCompra)],
            ["Último mantenimiento", fmtDate(activo.ultimoMantenimiento)],
            ["Notas",                activo.notas || "—"],
          ].map(([k, v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0",
                                   borderBottom:"1px solid #F1F5F9", fontSize:"13px" }}>
              <span style={{ color:"#64748B" }}>{k}</span>
              <span style={{ fontWeight:600, color:"#0F172A", maxWidth:"55%", textAlign:"right" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Service history */}
        <div style={CARD}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
            <h3 style={{ fontWeight:800, fontSize:"15px", color:"#0F172A" }}>
              Historial de servicio ({servicios.length})
            </h3>
            <button onClick={() => setShowServForm(!showServForm)}
              style={{ ...BTN, padding:"7px 14px", fontSize:"12px" }}>
              {showServForm ? "Cancelar" : "+ Registrar servicio"}
            </button>
          </div>

          {showServForm && (
            <div style={{ background:"#F8FAFC", borderRadius:"12px", padding:"16px", marginBottom:"16px",
                          border:"1px solid #E2E8F0" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"10px" }}>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"#64748B", textTransform:"uppercase",
                                   display:"block", marginBottom:"4px" }}>Fecha *</label>
                  <input style={INP} type="date" value={servForm.fecha}
                    onChange={e => setServForm(f => ({ ...f, fecha: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"#64748B", textTransform:"uppercase",
                                   display:"block", marginBottom:"4px" }}>Costo ($MXN)</label>
                  <input style={INP} type="number" value={servForm.costo} placeholder="0"
                    onChange={e => setServForm(f => ({ ...f, costo: e.target.value }))} />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"#64748B", textTransform:"uppercase",
                                   display:"block", marginBottom:"4px" }}>Descripción *</label>
                  <textarea style={{ ...INP, resize:"vertical", minHeight:"60px" }}
                    value={servForm.descripcion} placeholder="Qué se hizo en este servicio..."
                    onChange={e => setServForm(f => ({ ...f, descripcion: e.target.value }))} />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ fontSize:"11px", fontWeight:700, color:"#64748B", textTransform:"uppercase",
                                   display:"block", marginBottom:"4px" }}>Técnico (opcional)</label>
                  <input style={INP} value={servForm.tecnico} placeholder="Nombre del técnico"
                    onChange={e => setServForm(f => ({ ...f, tecnico: e.target.value }))} />
                </div>
              </div>
              <button onClick={registrarServicio}
                disabled={!servForm.fecha || !servForm.descripcion.trim()}
                style={{ ...BTN, width:"100%", opacity: !servForm.fecha || !servForm.descripcion.trim() ? 0.6 : 1 }}>
                Guardar servicio
              </button>
            </div>
          )}

          {servicios.length === 0 ? (
            <p style={{ color:"#94A3B8", fontSize:"13px", textAlign:"center", padding:"20px" }}>
              Sin servicios registrados aún.
            </p>
          ) : servicios.map(s => (
            <div key={s.id} style={{ padding:"12px", background:"#F8FAFC", borderRadius:"10px",
                                      border:"1px solid #E2E8F0", marginBottom:"8px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                <span style={{ fontWeight:700, fontSize:"13px", color:"#0F172A" }}>{fmtDate(s.fecha)}</span>
                {s.costo > 0 && <span style={{ fontSize:"13px", fontWeight:700, color:"#059669" }}>
                  ${s.costo.toLocaleString("es-MX")}
                </span>}
              </div>
              <p style={{ fontSize:"13px", color:"#475569", lineHeight:1.5 }}>{s.descripcion}</p>
              {s.tecnico && <p style={{ fontSize:"12px", color:"#94A3B8", marginTop:"3px" }}>👤 {s.tecnico}</p>}
            </div>
          ))}
        </div>

        {/* CTRL+W promo */}
        <div style={{ background:"#0F172A", borderRadius:"16px", padding:"20px", marginBottom:"14px",
                      display:"flex", gap:"16px", alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ flex:1 }}>
            <p style={{ fontWeight:700, fontSize:"14px", color:"#fff", marginBottom:"4px" }}>
              💼 Genera cotizaciones con CTRL+W
            </p>
            <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", lineHeight:1.5 }}>
              Crea cotizaciones profesionales con catálogo de refacciones y envía por WhatsApp directo al cliente.
            </p>
          </div>
          <button onClick={openCtrlW}
            style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                     padding:"10px 18px", fontWeight:700, fontSize:"13px", cursor:"pointer", flexShrink:0 }}>
            Abrir CTRL+W →
          </button>
        </div>

      </div>
    </div>
  );
}
