import { useState, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import { obtenerTecnico } from "../lib/firebase.js";
import { iniciarSuscripcionPro, solicitarFactura } from "../lib/gemini.js";

const BENEFICIOS = [
  "Prioridad alta en búsquedas",
  "Sin anuncios en tu perfil",
  "Trabajos documentados ilimitados",
  "Herramientas de IA completas",
  "Cotizaciones profesionales + CTRL+W",
  "Habilis Care y soporte prioritario",
];

const REGIMENES = [
  ["612", "Personas Físicas con Actividades Empresariales"],
  ["626", "Régimen Simplificado de Confianza (RESICO)"],
  ["621", "Incorporación Fiscal (RIF)"],
  ["601", "General de Ley Personas Morales"],
  ["605", "Sueldos y Salarios"],
];

const USOS_CFDI = [
  ["G03", "Gastos en general"],
  ["G01", "Adquisición de mercancías"],
  ["S01", "Sin efectos fiscales"],
];

const INP = { width:"100%", border:"1px solid #E2E8F0", borderRadius:"10px",
              padding:"11px 14px", fontSize:"14px", marginBottom:"12px" };
const LBL = { fontSize:"12px", fontWeight:700, color:"#64748B", marginBottom:"5px", display:"block" };

export default function SuscripcionPro({ nav, user }) {
  const [tecnico, setTecnico]   = useState(undefined);
  const [codigo, setCodigo]     = useState("");
  const [error, setError]       = useState("");
  const [cargando, setCargando] = useState(false);

  const [fx, setFx] = useState({ rfc:"", razonSocial:"", codigoPostal:"", regimenFiscal:"612", usoCFDI:"G03" });
  const [fxEstado, setFxEstado] = useState({ cargando:false, error:"", url:"" });

  useEffect(() => {
    if (!user) { setTecnico(null); return; }
    obtenerTecnico(user.uid).then(t => setTecnico(t || null)).catch(() => setTecnico(null));
  }, [user]);

  const pagar = async () => {
    setError(""); setCargando(true);
    try {
      const { url } = await iniciarSuscripcionPro(user.email, codigo.trim() || null);
      window.location.href = url;   // checkout de Mercado Pago
    } catch (e) {
      setError(e.message || "No se pudo iniciar el pago. Intenta de nuevo.");
      setCargando(false);
    }
  };

  const facturar = async () => {
    setFxEstado({ cargando:true, error:"", url:"" });
    try {
      const r = await solicitarFactura({ ...fx, rfc: fx.rfc.trim().toUpperCase(),
                                         razonSocial: fx.razonSocial.trim(),
                                         codigoPostal: fx.codigoPostal.trim() });
      setFxEstado({ cargando:false, error:"", url: r?.verificationUrl || "ok" });
    } catch (e) {
      setFxEstado({ cargando:false, error: e.message || "No se pudo generar la factura.", url:"" });
    }
  };

  const esPro = tecnico?.plan === "pro";

  return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9" }}>
      <Nav nav={nav} user={user} />

      <div style={{ maxWidth:"520px", margin:"0 auto", padding:"48px 20px 80px" }}>

        {!user && (
          <div className="h-card" style={{ padding:"36px", textAlign:"center" }}>
            <h1 style={{ fontSize:"22px", fontWeight:900, color:"#0F172A", marginBottom:"10px" }}>
              Inicia sesión para continuar
            </h1>
            <p style={{ fontSize:"14px", color:"#64748B", marginBottom:"20px" }}>
              Necesitas una cuenta de técnico para suscribirte al Plan Pro.
            </p>
            <button className="h-btn-orange" style={{ padding:"12px 26px", fontSize:"14px" }}
              onClick={() => nav("login")}>Iniciar sesión</button>
          </div>
        )}

        {user && tecnico === undefined && (
          <p style={{ textAlign:"center", color:"#94A3B8", fontSize:"14px" }}>Cargando…</p>
        )}

        {user && tecnico !== undefined && !esPro && (
          <div className="h-card" style={{ padding:"clamp(24px,5vw,36px)" }}>
            <p style={{ fontSize:"11px", fontWeight:800, color:"#F97316", letterSpacing:"0.1em",
                        textTransform:"uppercase", marginBottom:"8px" }}>Suscripción</p>
            <h1 style={{ fontSize:"24px", fontWeight:900, color:"#0F172A", marginBottom:"4px" }}>
              Plan Pro
            </h1>
            <p style={{ fontSize:"14px", color:"#64748B", marginBottom:"18px" }}>
              <strong style={{ color:"#0F172A", fontSize:"20px" }}>$100 MXN/mes</strong> · IVA incluido ·
              cancela cuando quieras
            </p>
            <ul style={{ listStyle:"none", marginBottom:"20px" }}>
              {BENEFICIOS.map(b => (
                <li key={b} style={{ display:"flex", gap:"10px", fontSize:"14px", color:"#475569",
                                     lineHeight:1.6, marginBottom:"8px" }}>
                  <span style={{ color:"#16A34A", fontWeight:800 }}>✓</span>{b}
                </li>
              ))}
            </ul>

            <label style={LBL}>Código de descuento (opcional)</label>
            <input style={{ ...INP, textTransform:"uppercase" }} value={codigo}
              onChange={e => setCodigo(e.target.value)} placeholder="EJEMPLO10" maxLength={30} />

            {error && (
              <p style={{ fontSize:"13px", color:"#DC2626", background:"#FEE2E2", borderRadius:"8px",
                          padding:"10px 14px", marginBottom:"12px" }}>{error}</p>
            )}

            <button className="h-btn-orange" onClick={pagar} disabled={cargando}
              style={{ width:"100%", padding:"14px", fontSize:"15px", opacity: cargando ? 0.6 : 1 }}>
              {cargando ? "Conectando con Mercado Pago…" : "Pagar con Mercado Pago →"}
            </button>
            <p style={{ fontSize:"12px", color:"#94A3B8", marginTop:"12px", lineHeight:1.6, textAlign:"center" }}>
              El pago se procesa de forma segura en Mercado Pago; Habilis nunca ve tu tarjeta.
              Tu plan se activa automáticamente al confirmarse el pago.
            </p>
          </div>
        )}

        {user && esPro && (
          <>
            <div className="h-card" style={{ padding:"clamp(24px,5vw,32px)", marginBottom:"18px",
                                             textAlign:"center" }}>
              <div style={{ fontSize:"34px", marginBottom:"8px" }}>⚡</div>
              <h1 style={{ fontSize:"22px", fontWeight:900, color:"#0F172A", marginBottom:"6px" }}>
                Ya eres Pro
              </h1>
              <p style={{ fontSize:"14px", color:"#64748B", lineHeight:1.7 }}>
                Tu suscripción está activa. La gestión del cobro (método de pago o cancelación)
                se hace desde tu cuenta de Mercado Pago.
              </p>
            </div>

            <div className="h-card" style={{ padding:"clamp(24px,5vw,32px)" }}>
              <h2 style={{ fontSize:"16px", fontWeight:900, color:"#0F172A", marginBottom:"4px" }}>
                Solicitar factura (CFDI)
              </h2>
              <p style={{ fontSize:"13px", color:"#64748B", marginBottom:"16px" }}>
                De tu suscripción Pro del mes en curso.
              </p>

              <label style={LBL}>RFC</label>
              <input style={{ ...INP, textTransform:"uppercase" }} value={fx.rfc} maxLength={13}
                onChange={e => setFx(f => ({ ...f, rfc:e.target.value }))} placeholder="XAXX010101000" />
              <label style={LBL}>Razón social (sin régimen societario, como en tu CSF)</label>
              <input style={INP} value={fx.razonSocial} maxLength={200}
                onChange={e => setFx(f => ({ ...f, razonSocial:e.target.value }))} placeholder="Nombre o razón social" />
              <label style={LBL}>Código postal fiscal</label>
              <input style={INP} value={fx.codigoPostal} maxLength={5} inputMode="numeric"
                onChange={e => setFx(f => ({ ...f, codigoPostal:e.target.value }))} placeholder="77500" />
              <label style={LBL}>Régimen fiscal</label>
              <select style={INP} value={fx.regimenFiscal}
                onChange={e => setFx(f => ({ ...f, regimenFiscal:e.target.value }))}>
                {REGIMENES.map(([v, l]) => <option key={v} value={v}>{v} — {l}</option>)}
              </select>
              <label style={LBL}>Uso de CFDI</label>
              <select style={INP} value={fx.usoCFDI}
                onChange={e => setFx(f => ({ ...f, usoCFDI:e.target.value }))}>
                {USOS_CFDI.map(([v, l]) => <option key={v} value={v}>{v} — {l}</option>)}
              </select>

              {fxEstado.error && (
                <p style={{ fontSize:"13px", color:"#DC2626", background:"#FEE2E2", borderRadius:"8px",
                            padding:"10px 14px", marginBottom:"12px" }}>{fxEstado.error}</p>
              )}
              {fxEstado.url && (
                <p style={{ fontSize:"13px", color:"#166534", background:"#DCFCE7", borderRadius:"8px",
                            padding:"10px 14px", marginBottom:"12px" }}>
                  ✓ Factura generada.{" "}
                  {fxEstado.url !== "ok" && (
                    <a href={fxEstado.url} target="_blank" rel="noreferrer"
                      style={{ fontWeight:800, color:"#166534", textDecoration:"underline" }}>
                      Verificarla aquí
                    </a>
                  )}
                </p>
              )}

              <button className="h-btn-orange" onClick={facturar} disabled={fxEstado.cargando}
                style={{ width:"100%", padding:"13px", fontSize:"14px",
                         opacity: fxEstado.cargando ? 0.6 : 1 }}>
                {fxEstado.cargando ? "Generando…" : "Generar factura"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
