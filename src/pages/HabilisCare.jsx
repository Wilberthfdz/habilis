import { useState, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import { crearActivo, obtenerActivos, crearSolicitud } from "../lib/firebase.js";
import { generarTipsMantenimiento } from "../lib/gemini.js";

// ── Constants ────────────────────────────────────────────────────────────────
export const TIPOS_ACTIVO = {
  "Aire acondicionado": { intervalo: 180, icono: "❄️" },
  "Refrigerador":       { intervalo: 365, icono: "🧊" },
  "Panel solar":        { intervalo: 90,  icono: "☀️" },
  "CCTV":               { intervalo: 180, icono: "📷" },
  "UPS":                { intervalo: 365, icono: "🔋" },
  "Vehículo":           { intervalo: 90,  icono: "🚗", nota: "o 5 000 km" },
  "Red/Router":         { intervalo: 365, icono: "🌐" },
  "Generador":          { intervalo: 180, icono: "⚡" },
};

export function calcularSalud(activo) {
  if (!activo.ultimoMantenimiento) return 100;
  const cfg = TIPOS_ACTIVO[activo.tipo];
  if (!cfg) return 100;
  const ultimo = activo.ultimoMantenimiento.toDate
    ? activo.ultimoMantenimiento.toDate()
    : new Date(activo.ultimoMantenimiento);
  const dias = Math.floor((Date.now() - ultimo.getTime()) / 86400000);
  return Math.max(0, Math.round((1 - dias / cfg.intervalo) * 100));
}

export function calcularProxima(activo) {
  const base = activo.ultimoMantenimiento || activo.fechaCompra;
  if (!base) return null;
  const cfg = TIPOS_ACTIVO[activo.tipo];
  if (!cfg) return null;
  const d = base.toDate ? base.toDate() : new Date(base);
  const p = new Date(d);
  p.setDate(p.getDate() + cfg.intervalo);
  return p;
}

const COLOR_SALUD = pct => pct > 80 ? "#10B981" : pct > 50 ? "#F59E0B" : "#EF4444";
const LABEL_SALUD = pct => pct > 80 ? "Al día" : pct > 50 ? "Próximo" : "Vencido";
const fmtDate = d => d ? new Date(d).toLocaleDateString("es-MX", { day:"2-digit", month:"short", year:"numeric" }) : "—";
const diasHasta = d => d ? Math.ceil((d - Date.now()) / 86400000) : null;

// ── Health ring SVG ──────────────────────────────────────────────────────────
function AnilloSalud({ pct, size = 68 }) {
  const r    = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const fill = Math.max(0, Math.min(100, pct));
  const color = COLOR_SALUD(fill);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth="7"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
              strokeDasharray={`${(fill/100)*circ} ${circ}`} strokeLinecap="round"
              transform={`rotate(-90 ${size/2} ${size/2})`}
              style={{ transition:"stroke-dasharray 0.6s ease" }}/>
      <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
            fontSize="12" fontWeight="800" fill={color}>{fill}%</text>
    </svg>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
const INP = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
              padding:"10px 13px", fontSize:"14px", outline:"none",
              background:"#F8FAFC", color:"#0F172A", boxSizing:"border-box" };
const LBL = { fontSize:"11px", fontWeight:700, color:"#64748B", textTransform:"uppercase",
              letterSpacing:"0.06em", display:"block", marginBottom:"4px" };

function ModalAgregar({ onClose, onSaved, userId }) {
  const [form, setForm] = useState({
    nombre:"", tipo:"Aire acondicionado", marca:"", modelo:"",
    fechaCompra:"", ultimoMantenimiento:"", notas:"",
  });
  const [saving, setSaving]   = useState(false);
  const [tips,   setTips]     = useState(null);
  const [genAI,  setGenAI]    = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const guardar = async () => {
    if (!form.nombre.trim()) return;
    setSaving(true);
    try {
      const id = await crearActivo(userId, {
        nombre:             form.nombre.trim(),
        tipo:               form.tipo,
        marca:              form.marca.trim(),
        modelo:             form.modelo.trim(),
        fechaCompra:        form.fechaCompra || null,
        ultimoMantenimiento:form.ultimoMantenimiento || null,
        notas:              form.notas.trim(),
        eliminado:          false,
      });
      // Gemini maintenance tips
      setGenAI(true);
      try {
        const t = await generarTipsMantenimiento(form.tipo, form.marca, form.modelo);
        setTips(t);
      } catch { /* tips are optional */ }
      setGenAI(false);
      onSaved(id);
    } finally { setSaving(false); }
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.7)", zIndex:1000,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}
         onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:"#fff", borderRadius:"20px", width:"100%", maxWidth:"520px",
                    maxHeight:"90vh", overflowY:"auto", padding:"28px 28px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
          <h2 style={{ fontWeight:900, fontSize:"18px", color:"#0F172A" }}>Registrar equipo</h2>
          <button onClick={onClose} style={{ background:"#F1F5F9", border:"none", borderRadius:"8px",
                                             width:"32px", height:"32px", fontSize:"18px", cursor:"pointer", color:"#64748B" }}>×</button>
        </div>

        {tips ? (
          // Gemini tips after save
          <div>
            <div style={{ background:"#FFF7ED", border:"1px solid rgba(249,115,22,0.25)", borderRadius:"14px",
                          padding:"16px 18px", marginBottom:"16px" }}>
              <p style={{ fontWeight:700, fontSize:"13px", color:"#EA580C", marginBottom:"10px" }}>
                ✨ Gemini generó tu plan de mantenimiento
              </p>
              <ul style={{ paddingLeft:"16px", display:"flex", flexDirection:"column", gap:"6px" }}>
                {tips.tips.map((t, i) => (
                  <li key={i} style={{ fontSize:"13px", color:"#374151", lineHeight:1.5 }}>{t}</li>
                ))}
              </ul>
              {tips.alerta && (
                <div style={{ marginTop:"10px", background:"#FEF2F2", borderRadius:"8px",
                              padding:"8px 12px", fontSize:"12px", color:"#DC2626" }}>
                  ⚠️ {tips.alerta}
                </div>
              )}
            </div>
            <button onClick={onClose}
              style={{ width:"100%", background:"#0F172A", color:"#fff", border:"none",
                       borderRadius:"12px", padding:"13px", fontSize:"15px", fontWeight:700, cursor:"pointer" }}>
              Ver mi equipo →
            </button>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              <div style={{ gridColumn:"1/-1" }}>
                <label style={LBL}>Nombre del equipo *</label>
                <input style={INP} value={form.nombre} onChange={set("nombre")}
                  placeholder="Ej: AC sala principal" autoFocus />
              </div>
              <div>
                <label style={LBL}>Tipo de equipo *</label>
                <select style={INP} value={form.tipo} onChange={set("tipo")}>
                  {Object.keys(TIPOS_ACTIVO).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={LBL}>Marca</label>
                <input style={INP} value={form.marca} onChange={set("marca")} placeholder="LG, Samsung..." />
              </div>
              <div>
                <label style={LBL}>Modelo</label>
                <input style={INP} value={form.modelo} onChange={set("modelo")} placeholder="WS09XHP2" />
              </div>
              <div>
                <label style={LBL}>Fecha de compra</label>
                <input style={INP} type="date" value={form.fechaCompra} onChange={set("fechaCompra")} />
              </div>
              <div>
                <label style={LBL}>Último mantenimiento</label>
                <input style={INP} type="date" value={form.ultimoMantenimiento} onChange={set("ultimoMantenimiento")} />
              </div>
              <div style={{ gridColumn:"1/-1" }}>
                <label style={LBL}>Notas</label>
                <textarea style={{ ...INP, resize:"vertical", minHeight:"60px" }}
                  value={form.notas} onChange={set("notas")} placeholder="Ubicación, número de serie, observaciones..." />
              </div>
            </div>

            <div style={{ background:"#F8FAFC", borderRadius:"10px", padding:"10px 14px",
                          fontSize:"12px", color:"#64748B" }}>
              ✨ Gemini generará un plan de mantenimiento personalizado al guardar.
            </div>

            <div style={{ display:"flex", gap:"10px" }}>
              <button onClick={onClose}
                style={{ flex:1, background:"#F1F5F9", color:"#374151", border:"none",
                         borderRadius:"10px", padding:"12px", fontWeight:600, cursor:"pointer" }}>
                Cancelar
              </button>
              <button onClick={guardar} disabled={saving || genAI || !form.nombre.trim()}
                style={{ flex:2, background:"#F97316", color:"#fff", border:"none",
                         borderRadius:"10px", padding:"12px", fontSize:"14px",
                         fontWeight:700, cursor:"pointer", opacity: saving || genAI ? 0.75 : 1 }}>
                {saving ? "Guardando..." : genAI ? "✨ Gemini analizando..." : "Guardar equipo →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function HabilisCare({ nav, user }) {
  const [activos,     setActivos]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showModal,   setShowModal]   = useState(false);

  useEffect(() => {
    if (!user) { nav("login"); return; }
    cargar();
  }, [user]);

  const cargar = () => {
    setLoading(true);
    obtenerActivos(user.uid)
      .then(r => setActivos(r.filter(a => !a.eliminado)))
      .catch(() => setActivos([]))
      .finally(() => setLoading(false));
  };

  const handleSaved = () => {
    cargar(); // refresh list after modal closes
  };

  const stats = {
    total:   activos.length,
    vencido: activos.filter(a => calcularSalud(a) < 50).length,
    proximo: activos.filter(a => { const p = calcularProxima(a); return p && diasHasta(p) <= 30 && diasHasta(p) >= 0; }).length,
  };

  const openCtrlW = (equipo) => {
    const url = new URL("https://ctrlw.mx/cotizacion");
    url.searchParams.set("action", "crear");
    url.searchParams.set("from", "habilis");
    url.searchParams.set("equipo", equipo || "");
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      {/* HERO BANNER */}
      <div style={{ background:"#0F172A", padding:"36px 20px 28px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-5%", width:"420px", height:"420px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"960px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                      letterSpacing:"0.1em", marginBottom:"8px" }}>
            🛡️ Habilis Care
          </p>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end",
                        flexWrap:"wrap", gap:"16px" }}>
            <div>
              <h1 style={{ fontSize:"clamp(22px,4vw,36px)", fontWeight:900, color:"#fff", marginBottom:"6px" }}>
                Mantenimiento preventivo
              </h1>
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px" }}>
                Registra tus equipos y Habilis Care te avisa cuándo necesitan servicio.
              </p>
            </div>
            <button onClick={() => setShowModal(true)}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                       padding:"11px 22px", fontWeight:700, fontSize:"14px", cursor:"pointer", flexShrink:0 }}>
              + Agregar equipo
            </button>
          </div>

          {/* Stats row */}
          {activos.length > 0 && (
            <div style={{ display:"flex", gap:"20px", marginTop:"20px", flexWrap:"wrap" }}>
              {[
                ["🔧", stats.total,   "Equipos registrados", "#94A3B8"],
                ["✅", stats.total - stats.vencido - stats.proximo, "Al día",       "#10B981"],
                ["⏰", stats.proximo, "Mantenimiento próximo", "#F59E0B"],
                ["🔴", stats.vencido, "Mantenimiento vencido", "#EF4444"],
              ].map(([icon, val, label, color]) => (
                <div key={label} style={{ background:"rgba(255,255,255,0.06)", borderRadius:"10px",
                                          padding:"10px 16px", border:"1px solid rgba(255,255,255,0.08)" }}>
                  <span style={{ fontSize:"16px" }}>{icon}</span>
                  <span style={{ fontWeight:900, fontSize:"18px", color, margin:"0 6px" }}>{val}</span>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:"12px" }}>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"24px 20px" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"72px 20px" }}>
            <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                          borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
            <p style={{ color:"#64748B" }}>Cargando equipos...</p>
          </div>
        ) : activos.length === 0 ? (
          <div style={{ textAlign:"center", padding:"72px 20px", background:"#fff",
                        borderRadius:"20px", border:"1px solid #E2E8F0" }}>
            <div style={{ fontSize:"60px", marginBottom:"16px" }}>🛡️</div>
            <h2 style={{ fontWeight:900, fontSize:"20px", color:"#0F172A", marginBottom:"8px" }}>
              Sin equipos registrados
            </h2>
            <p style={{ color:"#64748B", fontSize:"14px", marginBottom:"24px", maxWidth:"360px", margin:"0 auto 24px" }}>
              Registra tus equipos y Habilis Care calculará automáticamente cuándo necesitan mantenimiento.
            </p>
            <button onClick={() => setShowModal(true)}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"12px",
                       padding:"13px 28px", fontWeight:700, fontSize:"15px", cursor:"pointer" }}>
              + Registrar mi primer equipo
            </button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"14px" }}>
            {activos.map(activo => {
              const salud  = calcularSalud(activo);
              const proxima = calcularProxima(activo);
              const dias   = diasHasta(proxima);
              const cfg    = TIPOS_ACTIVO[activo.tipo] || { icono:"🔧" };
              const color  = COLOR_SALUD(salud);
              return (
                <div key={activo.id}
                  style={{ background:"#fff", border:`1px solid ${salud < 50 ? "rgba(239,68,68,0.3)" : salud < 80 ? "rgba(245,158,11,0.3)" : "#E2E8F0"}`,
                           borderRadius:"16px", padding:"18px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)",
                           cursor:"pointer", transition:"box-shadow 0.2s" }}
                  onClick={() => nav("detalleActivo", { activoId: activo.id })}
                  onMouseEnter={e => e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.06)"}>

                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
                    <div style={{ display:"flex", gap:"10px", alignItems:"center", flex:1, minWidth:0 }}>
                      <span style={{ fontSize:"26px", flexShrink:0 }}>{cfg.icono}</span>
                      <div style={{ minWidth:0 }}>
                        <p style={{ fontWeight:800, fontSize:"14px", color:"#0F172A",
                                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {activo.nombre}
                        </p>
                        <p style={{ fontSize:"12px", color:"#64748B" }}>
                          {activo.tipo}{activo.marca ? ` · ${activo.marca}` : ""}
                        </p>
                      </div>
                    </div>
                    <AnilloSalud pct={salud} size={60} />
                  </div>

                  <div style={{ borderTop:"1px solid #F1F5F9", paddingTop:"12px",
                                display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <p style={{ fontSize:"11px", color:"#94A3B8", marginBottom:"2px" }}>
                        {dias === null ? "Sin registro" : dias < 0 ? "Vencido hace" : "Próximo servicio"}
                      </p>
                      <p style={{ fontSize:"13px", fontWeight:700, color }}>
                        {proxima ? (dias < 0 ? `${Math.abs(dias)} días` : dias === 0 ? "Hoy" : `${dias} días`) : "Registrar mantenimiento"}
                      </p>
                    </div>
                    <span style={{ background: salud > 80 ? "#F0FDF4" : salud > 50 ? "#FFFBEB" : "#FEF2F2",
                                   color, fontSize:"11px", fontWeight:700,
                                   padding:"3px 10px", borderRadius:"20px" }}>
                      {LABEL_SALUD(salud)}
                    </span>
                  </div>

                  {salud < 80 && (
                    <div style={{ marginTop:"10px" }}>
                      <button
                        onClick={e => { e.stopPropagation(); openCtrlW(activo.nombre); }}
                        style={{ width:"100%", background:"#0F172A", color:"#fff", border:"none",
                                 borderRadius:"8px", padding:"8px", fontSize:"12px", fontWeight:700,
                                 cursor:"pointer" }}>
                        Cotizar con CTRL+W →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add button card */}
            <div onClick={() => setShowModal(true)}
              style={{ background:"#F8FAFC", border:"2px dashed #CBD5E1", borderRadius:"16px",
                       padding:"18px", display:"flex", flexDirection:"column", alignItems:"center",
                       justifyContent:"center", gap:"8px", cursor:"pointer", minHeight:"160px",
                       transition:"border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor="#F97316"}
              onMouseLeave={e => e.currentTarget.style.borderColor="#CBD5E1"}>
              <span style={{ fontSize:"28px", opacity:0.4 }}>+</span>
              <p style={{ fontSize:"13px", fontWeight:600, color:"#94A3B8" }}>Agregar equipo</p>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ModalAgregar
          userId={user.uid}
          onClose={() => { setShowModal(false); cargar(); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
