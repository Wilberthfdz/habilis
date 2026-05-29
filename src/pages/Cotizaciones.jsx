import { useState, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import { obtenerCotizaciones, eliminarCotizacion, crearCotizacion, obtenerSiguienteFolio } from "../lib/firebase.js";

const ESTADO_CFG = {
  borrador:  { bg:"#F1F5F9", color:"#64748B",  label:"Borrador"  },
  enviada:   { bg:"#EFF6FF", color:"#2563EB",  label:"Enviada"   },
  aceptada:  { bg:"#F0FDF4", color:"#059669",  label:"Aceptada"  },
  rechazada: { bg:"#FEF2F2", color:"#DC2626",  label:"Rechazada" },
  vencida:   { bg:"#FFF7ED", color:"#EA580C",  label:"Vencida"   },
};

const CARD = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"16px",
               padding:"20px", boxShadow:"0 1px 3px rgba(0,0,0,0.06)" };

const fmt = n => `$${(Number(n)||0).toLocaleString("es-MX", { minimumFractionDigits:2 })}`;

export default function Cotizaciones({ nav, user }) {
  const [cots,    setCots]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("todas");
  const [creating,setCreating]= useState(false);

  useEffect(() => {
    if (!user) { nav("login"); return; }
    cargar();
  }, [user]);

  const cargar = () => {
    setLoading(true);
    obtenerCotizaciones(user.uid)
      .then(r => setCots(r.filter(c => !c.eliminada)))
      .catch(() => setCots([]))
      .finally(() => setLoading(false));
  };

  const nueva = async () => {
    setCreating(true);
    try {
      const folio = await obtenerSiguienteFolio(user.uid);
      const id    = await crearCotizacion({
        tecnicoId: user.uid,
        folio,
        estado:    "borrador",
        cliente:   { nombre:"", empresa:"", rfc:"", email:"", telefono:"" },
        productos: [],
        manoObra:  [],
        subtotal:  0,
        total:     0,
        iva:       true,
        descuento: { tipo:"porcentaje", valor:0 },
        moneda:    "MXN",
        tipoCambio:17.5,
        validez:   15,
        notas:     "",
        terminos:  "Cotización válida por 15 días. Precios sujetos a cambio sin previo aviso.",
        metodoPago:"Transferencia",
        fecha:     new Date().toISOString(),
      });
      nav("editorCotizacion", { cotizacionId: id });
    } finally { setCreating(false); }
  };

  const duplicar = async (cot) => {
    const folio = await obtenerSiguienteFolio(user.uid);
    const id = await crearCotizacion({
      ...cot, id: undefined, folio, estado: "borrador",
      fecha: new Date().toISOString(),
      createdAt: undefined, updatedAt: undefined,
    });
    nav("editorCotizacion", { cotizacionId: id });
  };

  const eliminar = async (cotId) => {
    if (!confirm("¿Eliminar esta cotización?")) return;
    await eliminarCotizacion(cotId);
    cargar();
  };

  const compartirWA = (cot) => {
    const url = `${window.location.origin}?vista=${cot.id}`;
    const msg = `Hola, te comparto la cotización ${cot.folio} de Habilis: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const filtradas = filter === "todas" ? cots : cots.filter(c => c.estado === filter);

  const stats = {
    total:    cots.length,
    enviadas: cots.filter(c => c.estado === "enviada").length,
    aceptadas:cots.filter(c => c.estado === "aceptada").length,
    monto:    cots.filter(c => c.estado === "aceptada").reduce((s, c) => s + (c.total||0), 0),
  };

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      {/* HERO */}
      <div style={{ background:"#0F172A", padding:"32px 20px 28px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-40%", right:"-5%", width:"400px", height:"400px",
                      background:"radial-gradient(circle,rgba(249,115,22,0.15) 0%,transparent 65%)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"960px", margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end",
                        flexWrap:"wrap", gap:"12px" }}>
            <div>
              <p style={{ fontSize:"11px", fontWeight:700, color:"#F97316", textTransform:"uppercase",
                          letterSpacing:"0.1em", marginBottom:"8px" }}>📋 Cotizaciones Pro</p>
              <h1 style={{ fontSize:"clamp(20px,4vw,34px)", fontWeight:900, color:"#fff" }}>
                Mis cotizaciones
              </h1>
            </div>
            <button onClick={nueva} disabled={creating}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                       padding:"11px 22px", fontWeight:700, fontSize:"14px", cursor:"pointer",
                       opacity: creating ? 0.7 : 1 }}>
              {creating ? "Creando..." : "+ Nueva cotización"}
            </button>
          </div>

          {/* Stats */}
          {cots.length > 0 && (
            <div style={{ display:"flex", gap:"16px", marginTop:"20px", flexWrap:"wrap" }}>
              {[
                ["📋", stats.total,    "Total"],
                ["📤", stats.enviadas, "Enviadas"],
                ["✅", stats.aceptadas,"Aceptadas"],
                ["💰", fmt(stats.monto),"Ingreso generado"],
              ].map(([icon, val, label]) => (
                <div key={label} style={{ background:"rgba(255,255,255,0.07)", borderRadius:"10px",
                                          padding:"8px 14px", border:"1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ fontSize:"14px" }}>{icon}</span>
                  <span style={{ fontWeight:800, fontSize:"16px", color:"#F97316", margin:"0 6px" }}>{val}</span>
                  <span style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px" }}>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"20px" }}>
        {/* Filters */}
        <div style={{ display:"flex", gap:"8px", marginBottom:"20px", overflowX:"auto", paddingBottom:"4px" }}>
          {[["todas","Todas"],["borrador","Borrador"],["enviada","Enviadas"],["aceptada","Aceptadas"],["rechazada","Rechazadas"]].map(([id,label]) => (
            <button key={id} onClick={() => setFilter(id)}
              style={{ padding:"6px 16px", background: filter===id ? "#F97316" : "#fff",
                       color: filter===id ? "#fff" : "#374151",
                       border:`1px solid ${filter===id ? "#F97316" : "#E2E8F0"}`,
                       borderRadius:"20px", fontSize:"12px", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                          borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
            <p style={{ color:"#64748B" }}>Cargando cotizaciones...</p>
          </div>
        ) : filtradas.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 20px", ...CARD }}>
            <div style={{ fontSize:"52px", marginBottom:"14px" }}>📋</div>
            <h2 style={{ fontWeight:900, fontSize:"18px", color:"#0F172A", marginBottom:"8px" }}>
              {cots.length === 0 ? "Sin cotizaciones aún" : "No hay cotizaciones en este estado"}
            </h2>
            <p style={{ color:"#64748B", fontSize:"14px", marginBottom:"24px" }}>
              {cots.length === 0 ? "Crea tu primera cotización profesional en segundos" : "Prueba otro filtro"}
            </p>
            {cots.length === 0 && (
              <button onClick={nueva}
                style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                         padding:"12px 24px", fontWeight:700, cursor:"pointer" }}>
                + Nueva cotización
              </button>
            )}
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {filtradas.map(cot => {
              const cfg = ESTADO_CFG[cot.estado] || ESTADO_CFG.borrador;
              return (
                <div key={cot.id} style={CARD}>
                  <div style={{ display:"flex", gap:"14px", alignItems:"center", flexWrap:"wrap" }}>
                    {/* Folio + client */}
                    <div style={{ flex:"2 1 180px", minWidth:0 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"3px" }}>
                        <span style={{ fontWeight:800, fontSize:"14px", color:"#0F172A" }}>{cot.folio}</span>
                        <span style={{ background:cfg.bg, color:cfg.color, fontSize:"10px", fontWeight:700,
                                       padding:"2px 8px", borderRadius:"20px" }}>{cfg.label}</span>
                      </div>
                      <p style={{ fontSize:"12px", color:"#64748B" }}>
                        {cot.cliente?.nombre || "Sin cliente"}{cot.cliente?.empresa ? ` · ${cot.cliente.empresa}` : ""}
                      </p>
                    </div>
                    {/* Total */}
                    <div style={{ flex:"1 1 100px", textAlign:"right" }}>
                      <p style={{ fontWeight:900, fontSize:"16px", color:"#0F172A" }}>{fmt(cot.total)}</p>
                      <p style={{ fontSize:"11px", color:"#94A3B8" }}>
                        {cot.moneda || "MXN"} · {cot.fecha ? new Date(cot.fecha).toLocaleDateString("es-MX") : ""}
                      </p>
                    </div>
                    {/* Actions */}
                    <div style={{ display:"flex", gap:"6px", flexShrink:0 }}>
                      <button onClick={() => nav("editorCotizacion", { cotizacionId:cot.id })}
                        style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"8px",
                                 padding:"6px 12px", fontWeight:700, fontSize:"12px", cursor:"pointer" }}>
                        Editar
                      </button>
                      <button onClick={() => nav("vistaCotizacion", { token:cot.id })}
                        style={{ background:"#F1F5F9", color:"#374151", border:"1px solid #E2E8F0",
                                 borderRadius:"8px", padding:"6px 12px", fontWeight:600, fontSize:"12px", cursor:"pointer" }}>
                        Vista
                      </button>
                      <button onClick={() => compartirWA(cot)}
                        style={{ background:"#25D366", color:"#fff", border:"none",
                                 borderRadius:"8px", padding:"6px 12px", fontWeight:700, fontSize:"12px", cursor:"pointer" }}>
                        WA
                      </button>
                      <button onClick={() => duplicar(cot)}
                        style={{ background:"#F1F5F9", color:"#374151", border:"1px solid #E2E8F0",
                                 borderRadius:"8px", padding:"6px 10px", fontSize:"12px", cursor:"pointer" }}>
                        ⧉
                      </button>
                      <button onClick={() => eliminar(cot.id)}
                        style={{ background:"#FEF2F2", color:"#DC2626", border:"1px solid #FECACA",
                                 borderRadius:"8px", padding:"6px 10px", fontSize:"12px", cursor:"pointer" }}>
                        ✕
                      </button>
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
