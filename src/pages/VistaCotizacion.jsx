import { useState, useEffect } from "react";
import { obtenerCotizacion, actualizarCotizacion } from "../lib/firebase.js";
import Logo from "../components/Logo.jsx";

const fmt   = n => (Number(n)||0).toLocaleString("es-MX", { minimumFractionDigits:2 });
const fmtD  = d => d ? new Date(d).toLocaleDateString("es-MX", { day:"2-digit", month:"long", year:"numeric" }) : "—";

export default function VistaCotizacion({ nav, params }) {
  const token = params?.token;
  const [cot,     setCot]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [action,  setAction]  = useState(null); // "aceptando"|"rechazando"
  const [done,    setDone]    = useState(null); // "aceptada"|"rechazada"

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    obtenerCotizacion(token).then(c => setCot(c)).finally(() => setLoading(false));
  }, [token]);

  const cambiarEstado = async (estado) => {
    setAction(estado === "aceptada" ? "aceptando" : "rechazando");
    try {
      await actualizarCotizacion(token, { estado });
      setCot(c => ({ ...c, estado }));
      setDone(estado);
    } finally { setAction(null); }
  };

  if (loading) return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                    borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
    </div>
  );

  if (!cot) return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9", display:"flex", alignItems:"center",
                  justifyContent:"center", padding:"20px" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"52px", marginBottom:"12px" }}>📋</div>
        <h2 style={{ fontWeight:900, color:"#0F172A", marginBottom:"6px" }}>Cotización no encontrada</h2>
        <p style={{ color:"#64748B", marginBottom:"20px" }}>El enlace puede haber vencido o ser incorrecto.</p>
        <button onClick={() => nav("landing")}
          style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                   padding:"12px 24px", fontWeight:700, cursor:"pointer" }}>
          Ir a Habilis
        </button>
      </div>
    </div>
  );

  const { folio, fecha, validez, cliente, productos = [], manoObra = [],
          subtotal, descuento, ivaMonto, total, iva, moneda, notas, terminos,
          metodoPago, estado } = cot;

  const subtotalProds = productos.reduce((s,p) => s + Number(p.cantidad||1)*Number(p.precioUnitario||0), 0);
  const subtotalObra  = manoObra.reduce((s,m) => s + Number(m.costo||0), 0);
  const subtotalCalc  = subtotal || (subtotalProds + subtotalObra);
  const descMonto     = descuento?.valor ? subtotalCalc * (descuento.valor/100) : 0;
  const base          = subtotalCalc - descMonto;
  const ivaCalc       = iva ? (ivaMonto || base*0.16) : 0;
  const totalCalc     = total || (base + ivaCalc);

  const vencimiento = fecha ? (() => { const d = new Date(fecha); d.setDate(d.getDate() + (validez||15)); return d; })() : null;
  const vencida = vencimiento && new Date() > vencimiento;

  const ESTADO_CFG = {
    borrador:  { bg:"#F1F5F9", color:"#64748B",  label:"Borrador"  },
    enviada:   { bg:"#EFF6FF", color:"#2563EB",  label:"Enviada"   },
    aceptada:  { bg:"#F0FDF4", color:"#059669",  label:"Aceptada ✅" },
    rechazada: { bg:"#FEF2F2", color:"#DC2626",  label:"Rechazada" },
    vencida:   { bg:"#FFF7ED", color:"#EA580C",  label:"Vencida"   },
  };
  const eCfg = ESTADO_CFG[estado] || ESTADO_CFG.borrador;

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .print-area { box-shadow: none !important; }
        }
      `}</style>

      {/* Actions bar */}
      <div className="no-print" style={{ background:"#0F172A", padding:"12px 20px",
                                          display:"flex", justifyContent:"space-between", alignItems:"center",
                                          flexWrap:"wrap", gap:"10px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <Logo size={26} onClick={() => nav("landing")} />
          <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"13px" }}>Cotización {folio}</span>
          <span style={{ background:eCfg.bg, color:eCfg.color, fontSize:"11px", fontWeight:700,
                         padding:"2px 8px", borderRadius:"12px" }}>{eCfg.label}</span>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={() => window.print()}
            style={{ background:"rgba(255,255,255,0.08)", color:"#fff", border:"1px solid rgba(255,255,255,0.15)",
                     borderRadius:"8px", padding:"7px 14px", fontSize:"12px", fontWeight:600, cursor:"pointer" }}>
            🖨 Imprimir / PDF
          </button>
        </div>
      </div>

      {/* Document */}
      <div className="print-area" style={{ maxWidth:"800px", margin:"24px auto", background:"#fff",
                                            borderRadius:"16px", boxShadow:"0 2px 12px rgba(0,0,0,0.08)",
                                            padding:"40px 44px", fontFamily:"'Inter',system-ui" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                      marginBottom:"32px", flexWrap:"wrap", gap:"16px" }}>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
              <div style={{ background:"#0F172A", width:"32px", height:"38px", borderRadius:"8px",
                            display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"#F97316", fontWeight:900, fontSize:"18px" }}>H</span>
              </div>
              <span style={{ fontWeight:900, fontSize:"18px", color:"#0F172A", letterSpacing:"0.05em" }}>HABILIS</span>
            </div>
            <p style={{ fontSize:"12px", color:"#94A3B8" }}>Plataforma de técnicos verificados · México</p>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontWeight:900, fontSize:"22px", color:"#0F172A", marginBottom:"4px" }}>{folio}</p>
            <p style={{ fontSize:"12px", color:"#64748B" }}>Fecha: {fmtD(fecha)}</p>
            {vencimiento && (
              <p style={{ fontSize:"12px", color: vencida ? "#DC2626" : "#64748B" }}>
                Válida hasta: {fmtD(vencimiento)} {vencida ? "· VENCIDA" : ""}
              </p>
            )}
          </div>
        </div>

        {/* Parties */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px", marginBottom:"32px" }}>
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, color:"#94A3B8", textTransform:"uppercase",
                        letterSpacing:"0.08em", marginBottom:"6px" }}>Datos del proveedor</p>
            <p style={{ fontWeight:700, fontSize:"14px", color:"#0F172A" }}>{cot.tecnicoNombre || "Técnico Habilis"}</p>
            {cot.tecnicoOficio && <p style={{ fontSize:"12px", color:"#64748B" }}>{cot.tecnicoOficio}</p>}
            {cot.tecnicoEmail  && <p style={{ fontSize:"12px", color:"#64748B" }}>{cot.tecnicoEmail}</p>}
          </div>
          <div>
            <p style={{ fontSize:"10px", fontWeight:700, color:"#94A3B8", textTransform:"uppercase",
                        letterSpacing:"0.08em", marginBottom:"6px" }}>Datos del cliente</p>
            <p style={{ fontWeight:700, fontSize:"14px", color:"#0F172A" }}>{cliente?.nombre || "—"}</p>
            {cliente?.empresa  && <p style={{ fontSize:"12px", color:"#64748B" }}>{cliente.empresa}</p>}
            {cliente?.rfc      && <p style={{ fontSize:"12px", color:"#64748B" }}>RFC: {cliente.rfc}</p>}
            {cliente?.email    && <p style={{ fontSize:"12px", color:"#64748B" }}>{cliente.email}</p>}
            {cliente?.telefono && <p style={{ fontSize:"12px", color:"#64748B" }}>📞 {cliente.telefono}</p>}
          </div>
        </div>

        {/* Products table */}
        {(productos.length > 0 || manoObra.length > 0) && (
          <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"24px" }}>
            <thead>
              <tr style={{ background:"#0F172A" }}>
                {["Descripción","Cantidad","Precio unit.","Subtotal"].map((h, i) => (
                  <th key={h} style={{ padding:"10px 12px", textAlign: i === 0 ? "left" : "right",
                                       fontSize:"11px", fontWeight:700, color:"rgba(255,255,255,0.8)",
                                       textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {productos.map((p, i) => (
                <tr key={i} style={{ borderBottom:"1px solid #F1F5F9" }}>
                  <td style={{ padding:"10px 12px", fontSize:"13px", color:"#0F172A" }}>
                    {p.descripcion}
                    {p.nota && <p style={{ fontSize:"11px", color:"#94A3B8", margin:"2px 0 0" }}>{p.nota}</p>}
                  </td>
                  <td style={{ padding:"10px 12px", fontSize:"13px", textAlign:"right", color:"#374151" }}>{p.cantidad}</td>
                  <td style={{ padding:"10px 12px", fontSize:"13px", textAlign:"right", color:"#374151" }}>
                    {moneda === "USD" ? "USD " : "$"}{fmt(p.precioUnitario)}
                  </td>
                  <td style={{ padding:"10px 12px", fontSize:"13px", fontWeight:600, textAlign:"right", color:"#0F172A" }}>
                    {moneda === "USD" ? "USD " : "$"}{fmt(Number(p.cantidad||1) * Number(p.precioUnitario||0))}
                  </td>
                </tr>
              ))}
              {manoObra.map((m, i) => (
                <tr key={`m${i}`} style={{ borderBottom:"1px solid #F1F5F9", background:"#FAFAFA" }}>
                  <td style={{ padding:"10px 12px", fontSize:"13px", color:"#0F172A" }}>
                    <span style={{ background:"#F0FDF4", color:"#059669", fontSize:"10px", fontWeight:700,
                                   padding:"1px 6px", borderRadius:"4px", marginRight:"6px" }}>SERVICIO</span>
                    {m.descripcion}
                  </td>
                  <td style={{ padding:"10px 12px", fontSize:"13px", textAlign:"right", color:"#374151" }}>1</td>
                  <td style={{ padding:"10px 12px", fontSize:"13px", textAlign:"right", color:"#374151" }}>
                    {moneda === "USD" ? "USD " : "$"}{fmt(m.costo)}
                  </td>
                  <td style={{ padding:"10px 12px", fontSize:"13px", fontWeight:600, textAlign:"right", color:"#0F172A" }}>
                    {moneda === "USD" ? "USD " : "$"}{fmt(m.costo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Totals */}
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"28px" }}>
          <div style={{ minWidth:"260px" }}>
            {[
              ["Subtotal", subtotalCalc],
              descMonto > 0 ? [`Descuento (${descuento?.valor}%)`, -descMonto] : null,
              iva ? ["IVA 16%", ivaCalc] : null,
            ].filter(Boolean).map(([label, val]) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0",
                                         borderBottom:"1px solid #F1F5F9", fontSize:"13px" }}>
                <span style={{ color:"#64748B" }}>{label}</span>
                <span style={{ color: val < 0 ? "#DC2626" : "#0F172A" }}>
                  {val < 0 ? "-" : ""}{moneda === "USD" ? "USD " : "$"}{fmt(Math.abs(val))}
                </span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0 0",
                          borderTop:"2px solid #0F172A", marginTop:"4px" }}>
              <span style={{ fontWeight:900, fontSize:"16px", color:"#0F172A" }}>TOTAL</span>
              <span style={{ fontWeight:900, fontSize:"22px", color:"#F97316" }}>
                {moneda === "USD" ? "USD " : "$"}{fmt(totalCalc)}
              </span>
            </div>
            {metodoPago && (
              <p style={{ fontSize:"11px", color:"#94A3B8", marginTop:"6px", textAlign:"right" }}>
                Método de pago: {metodoPago}
              </p>
            )}
          </div>
        </div>

        {/* Notes & terms */}
        {(notas || terminos) && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", marginBottom:"28px" }}>
            {notas && (
              <div>
                <p style={{ fontSize:"10px", fontWeight:700, color:"#94A3B8", textTransform:"uppercase",
                            letterSpacing:"0.08em", marginBottom:"6px" }}>Notas</p>
                <p style={{ fontSize:"12px", color:"#374151", lineHeight:1.6, whiteSpace:"pre-wrap" }}>{notas}</p>
              </div>
            )}
            {terminos && (
              <div>
                <p style={{ fontSize:"10px", fontWeight:700, color:"#94A3B8", textTransform:"uppercase",
                            letterSpacing:"0.08em", marginBottom:"6px" }}>Términos y condiciones</p>
                <p style={{ fontSize:"11px", color:"#64748B", lineHeight:1.6, whiteSpace:"pre-wrap" }}>{terminos}</p>
              </div>
            )}
          </div>
        )}

        {/* Accept/Reject — only when sent and not yet decided */}
        {(estado === "enviada" || estado === "borrador") && !done && (
          <div className="no-print"
            style={{ borderTop:"2px solid #F1F5F9", paddingTop:"24px",
                     display:"flex", gap:"12px", justifyContent:"center" }}>
            <button onClick={() => cambiarEstado("rechazada")} disabled={!!action}
              style={{ background:"#fff", color:"#DC2626", border:"2px solid #FECACA",
                       borderRadius:"10px", padding:"12px 28px", fontWeight:700, fontSize:"14px",
                       cursor:"pointer", opacity: action ? 0.7 : 1 }}>
              {action === "rechazando" ? "Procesando..." : "Rechazar cotización"}
            </button>
            <button onClick={() => cambiarEstado("aceptada")} disabled={!!action}
              style={{ background:"#059669", color:"#fff", border:"none",
                       borderRadius:"10px", padding:"12px 28px", fontWeight:700, fontSize:"14px",
                       cursor:"pointer", opacity: action ? 0.7 : 1 }}>
              {action === "aceptando" ? "Procesando..." : "✅ Aceptar cotización"}
            </button>
          </div>
        )}

        {done && (
          <div className="no-print"
            style={{ background: done === "aceptada" ? "#F0FDF4" : "#FEF2F2",
                     border:`1px solid ${done === "aceptada" ? "#A7F3D0" : "#FECACA"}`,
                     borderRadius:"12px", padding:"16px", textAlign:"center",
                     color: done === "aceptada" ? "#059669" : "#DC2626",
                     fontWeight:700, fontSize:"15px" }}>
            {done === "aceptada" ? "✅ Cotización aceptada. El técnico se pondrá en contacto contigo." : "Cotización rechazada."}
          </div>
        )}

        {estado === "aceptada" && !done && (
          <div className="no-print"
            style={{ background:"#F0FDF4", border:"1px solid #A7F3D0", borderRadius:"12px",
                     padding:"16px", textAlign:"center", color:"#059669", fontWeight:700, fontSize:"15px" }}>
            ✅ Esta cotización ya fue aceptada.
          </div>
        )}

        <div style={{ borderTop:"1px solid #F1F5F9", paddingTop:"16px", marginTop:"24px", textAlign:"center" }}>
          <p style={{ fontSize:"11px", color:"#CBD5E1" }}>
            Generada con Habilis · habilis-eb89c.web.app · México
          </p>
        </div>
      </div>
    </div>
  );
}
