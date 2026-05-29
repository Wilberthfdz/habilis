import { useState, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import { obtenerActivos, crearPlanCare, obtenerPlanesCare } from "../lib/firebase.js";
import { TIPOS_ACTIVO, calcularSalud } from "./HabilisCare.jsx";

const PLANES = {
  basico: { nombre:"Básico", precio:299, visitas:1, label:"1 visita / 6 meses", color:"#E2E8F0", textColor:"#0F172A" },
  pro:    { nombre:"Pro",    precio:499, visitas:2, label:"2 visitas / 6 meses", color:"#0F172A", textColor:"#fff"    },
};

const CARD = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
               padding:"20px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };

export default function PlanCare({ nav, user }) {
  const [activos,  setActivos]  = useState([]);
  const [planes,   setPlanes]   = useState({}); // activoId → plan doc
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState({}); // activoId → "basico"|"pro"
  const [paying,   setPaying]   = useState(null);
  const [success,  setSuccess]  = useState(null);

  useEffect(() => {
    if (!user) { nav("login"); return; }
    Promise.all([
      obtenerActivos(user.uid),
      obtenerPlanesCare(user.uid),
    ]).then(([acts, pls]) => {
      setActivos(acts.filter(a => !a.eliminado));
      const map = {};
      pls.forEach(p => { map[p.activoId] = p; });
      setPlanes(map);
    }).finally(() => setLoading(false));
  }, [user]);

  const contratar = async (activoId) => {
    const planKey = selected[activoId];
    if (!planKey) return;
    setPaying(activoId);
    try {
      const plan = PLANES[planKey];
      await crearPlanCare({
        clienteId:      user.uid,
        activoId,
        tecnicoId:      null,
        plan:           planKey,
        montoPagado:    plan.precio,
        fechaInicio:    new Date().toISOString(),
        proximoServicio:null,
        estado:         "pendiente_pago",
        historial:      [],
      });
      setSuccess(activoId);
      const pls = await obtenerPlanesCare(user.uid);
      const map = {};
      pls.forEach(p => { map[p.activoId] = p; });
      setPlanes(map);
    } finally { setPaying(null); }
  };

  const estadoBadge = estado => {
    const cfg = {
      pendiente_pago:      { bg:"#FEF3C7", color:"#92400E", label:"Pendiente de pago" },
      activo:              { bg:"#F0FDF4", color:"#059669", label:"Activo" },
      servicio_programado: { bg:"#EFF6FF", color:"#1D4ED8", label:"Servicio programado" },
      completado:          { bg:"#F8FAFC", color:"#64748B", label:"Completado" },
    };
    const c = cfg[estado] || cfg.pendiente_pago;
    return (
      <span style={{ background:c.bg, color:c.color, fontSize:"11px", fontWeight:700,
                     padding:"3px 10px", borderRadius:"20px" }}>
        {c.label}
      </span>
    );
  };

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      {/* HERO */}
      <div style={{ background:"#0F172A", padding:"36px 20px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-5%", width:"420px", height:"420px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"860px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <button onClick={() => nav("habilisCare")}
            style={{ background:"none", border:"none", color:"rgba(255,255,255,0.45)",
                     fontSize:"13px", fontWeight:600, cursor:"pointer", marginBottom:"10px", padding:0 }}>
            ← Habilis Care
          </button>
          <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                      letterSpacing:"0.1em", marginBottom:"8px" }}>🛡️ Plan de Mantenimiento</p>
          <h1 style={{ fontSize:"clamp(22px,4vw,36px)", fontWeight:900, color:"#fff", marginBottom:"6px" }}>
            Protege tus equipos con Habilis Care
          </h1>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"14px" }}>
            Habilis asigna un técnico certificado · Recordatorios automáticos · Garantía de servicio
          </p>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background:"#fff", borderBottom:"1px solid #E2E8F0", padding:"20px" }}>
        <div style={{ maxWidth:"860px", margin:"0 auto", display:"flex", gap:"24px", flexWrap:"wrap", justifyContent:"center" }}>
          {[
            ["1","Elige un equipo","Selecciona el equipo que quieres proteger"],
            ["2","Elige tu plan","Básico (1 visita) o Pro (2 visitas) por 6 meses"],
            ["3","Habilis asigna","Te asignamos el mejor técnico en tu zona"],
          ].map(([n, t, d]) => (
            <div key={n} style={{ display:"flex", gap:"10px", alignItems:"flex-start", maxWidth:"220px" }}>
              <div style={{ width:"26px", height:"26px", background:"#F97316", color:"#fff", borderRadius:"50%",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:"12px", fontWeight:900, flexShrink:0 }}>{n}</div>
              <div>
                <p style={{ fontWeight:700, fontSize:"13px", color:"#0F172A" }}>{t}</p>
                <p style={{ fontSize:"12px", color:"#64748B", lineHeight:1.4 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:"860px", margin:"0 auto", padding:"24px 20px" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"60px" }}>
            <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                          borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
            <p style={{ color:"#64748B" }}>Cargando equipos...</p>
          </div>
        ) : activos.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 20px", ...CARD }}>
            <div style={{ fontSize:"48px", marginBottom:"12px" }}>🛡️</div>
            <h2 style={{ fontWeight:900, fontSize:"18px", color:"#0F172A", marginBottom:"8px" }}>
              No tienes equipos registrados
            </h2>
            <p style={{ color:"#64748B", fontSize:"14px", marginBottom:"20px" }}>
              Primero registra tus equipos en Habilis Care para poder suscribirte a un plan.
            </p>
            <button onClick={() => nav("habilisCare")}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                       padding:"12px 24px", fontWeight:700, cursor:"pointer" }}>
              Registrar mis equipos →
            </button>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
            {activos.map(activo => {
              const planActivo = planes[activo.id];
              const cfg = TIPOS_ACTIVO[activo.tipo] || { icono:"🔧" };
              const salud = calcularSalud(activo);
              return (
                <div key={activo.id} style={CARD}>
                  {/* Equipment info */}
                  <div style={{ display:"flex", gap:"12px", alignItems:"center", marginBottom:"16px",
                                paddingBottom:"16px", borderBottom:"1px solid #F1F5F9" }}>
                    <span style={{ fontSize:"28px" }}>{cfg.icono}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ fontWeight:800, fontSize:"15px", color:"#0F172A", marginBottom:"2px" }}>{activo.nombre}</p>
                      <p style={{ fontSize:"12px", color:"#64748B" }}>
                        {activo.tipo}{activo.marca ? ` · ${activo.marca}` : ""}{activo.modelo ? ` ${activo.modelo}` : ""}
                      </p>
                    </div>
                    {planActivo ? estadoBadge(planActivo.estado) : (
                      <span style={{ background: salud > 80 ? "#F0FDF4" : salud > 50 ? "#FFFBEB" : "#FEF2F2",
                                     color: salud > 80 ? "#059669" : salud > 50 ? "#92400E" : "#DC2626",
                                     fontSize:"11px", fontWeight:700, padding:"3px 10px", borderRadius:"20px" }}>
                        Salud: {salud}%
                      </span>
                    )}
                  </div>

                  {planActivo ? (
                    <div style={{ background:"#F8FAFC", borderRadius:"10px", padding:"14px 16px" }}>
                      <p style={{ fontWeight:700, fontSize:"13px", color:"#0F172A", marginBottom:"4px" }}>
                        Plan {PLANES[planActivo.plan]?.nombre} · ${PLANES[planActivo.plan]?.precio} MXN / 6 meses
                      </p>
                      <p style={{ fontSize:"12px", color:"#64748B" }}>
                        {PLANES[planActivo.plan]?.label} · {estadoBadge(planActivo.estado)}
                      </p>
                      {planActivo.proximoServicio && (
                        <p style={{ fontSize:"12px", color:"#F97316", marginTop:"6px", fontWeight:600 }}>
                          📅 Próximo servicio: {new Date(planActivo.proximoServicio).toLocaleDateString("es-MX")}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Plan selection */}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"14px" }}>
                        {Object.entries(PLANES).map(([key, plan]) => (
                          <div key={key}
                            onClick={() => setSelected(s => ({ ...s, [activo.id]: key }))}
                            style={{ border: selected[activo.id] === key ? "2px solid #F97316" : "1.5px solid #E2E8F0",
                                     borderRadius:"12px", padding:"14px 16px", cursor:"pointer",
                                     background: selected[activo.id] === key ? "#FFF7ED" : "#fff",
                                     transition:"all 0.15s" }}>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"6px" }}>
                              <p style={{ fontWeight:800, fontSize:"15px", color:"#0F172A" }}>Plan {plan.nombre}</p>
                              {selected[activo.id] === key && <span style={{ color:"#F97316", fontSize:"16px" }}>✓</span>}
                            </div>
                            <p style={{ fontWeight:900, fontSize:"20px", color:"#F97316", marginBottom:"4px" }}>
                              ${plan.precio} <span style={{ fontSize:"12px", fontWeight:500, color:"#64748B" }}>MXN / 6 meses</span>
                            </p>
                            <p style={{ fontSize:"12px", color:"#64748B" }}>{plan.label}</p>
                          </div>
                        ))}
                      </div>

                      {success === activo.id ? (
                        <div style={{ background:"#F0FDF4", border:"1px solid #A7F3D0", borderRadius:"10px",
                                      padding:"12px 16px", fontSize:"13px", fontWeight:600, color:"#059669" }}>
                          ✅ Plan registrado. Pago próximamente por Conekta.
                        </div>
                      ) : (
                        <button
                          onClick={() => contratar(activo.id)}
                          disabled={!selected[activo.id] || paying === activo.id}
                          style={{ width:"100%", background:"#F97316", color:"#fff", border:"none",
                                   borderRadius:"10px", padding:"12px", fontWeight:700, fontSize:"14px",
                                   cursor: selected[activo.id] ? "pointer" : "not-allowed",
                                   opacity: selected[activo.id] ? 1 : 0.5 }}>
                          {paying === activo.id ? "Procesando..." : "Contratar plan →"}
                        </button>
                      )}

                      <p style={{ fontSize:"11px", color:"#94A3B8", textAlign:"center", marginTop:"8px" }}>
                        💳 Pago seguro próximamente via Conekta · Sin contratos de permanencia
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Habilis commission note */}
        <div style={{ marginTop:"24px", background:"#F8FAFC", border:"1px solid #E2E8F0",
                      borderRadius:"14px", padding:"16px 20px" }}>
          <p style={{ fontSize:"12px", color:"#64748B", lineHeight:1.6 }}>
            <b style={{ color:"#0F172A" }}>¿Cómo funciona el pago?</b> Habilis recibe el pago completo,
            retiene un 30% de comisión por la plataforma y el técnico recibe el 70% al completar el servicio.
            Si el técnico no se presenta en 48 horas, asignamos uno nuevo sin costo adicional.
          </p>
        </div>
      </div>
    </div>
  );
}
