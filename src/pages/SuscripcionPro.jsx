import { useState, useEffect } from "react";
import Nav from "../components/Nav.jsx";
import { obtenerTecnico, obtenerFacturas } from "../lib/firebase.js";
import { iniciarSuscripcionPro, solicitarFactura, cancelarSuscripcionPro } from "../lib/gemini.js";

const BENEFICIOS = [
  "Prioridad alta en búsquedas",
  "Sin anuncios en tu perfil",
  "Trabajos documentados ilimitados",
  "Herramientas de IA completas",
  "Cotizaciones profesionales",
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
  const [emailPago, setEmailPago] = useState("");
  const [editarEmail, setEditarEmail] = useState(false);
  const [verCodigo, setVerCodigo] = useState(false);
  const [facturas, setFacturas] = useState([]);
  const [error, setError]       = useState("");
  const [cargando, setCargando] = useState(false);

  const [fx, setFx] = useState({ rfc:"", razonSocial:"", codigoPostal:"", regimenFiscal:"612", usoCFDI:"G03" });
  const [fxEstado, setFxEstado] = useState({ cargando:false, error:"", url:"" });

  const [cancelando, setCancelando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [tardando, setTardando] = useState(false);

  // Mercado Pago regresa a /pro con parámetros en la URL. El plan lo activa
  // el webhook, que puede tardar unos segundos: en vez de dejar al técnico
  // viendo la pantalla de compra como si no hubiera pagado, se muestra
  // "confirmando" y se relee su plan hasta que aparezca.
  const vueltaDePago = typeof window !== "undefined" && window.location.search.length > 1;

  useEffect(() => { if (user?.email) setEmailPago(user.email); }, [user]);

  useEffect(() => {
    if (!user) { setTecnico(null); return; }
    let cancelado = false;
    let intentos = 0;

    const leer = async () => {
      try {
        const t = await obtenerTecnico(user.uid);
        if (cancelado) return;
        setTecnico(t || null);
        if (t?.plan === "pro") { setConfirmando(false); return; }
        if (vueltaDePago && intentos < 20) {          // ~60 s de espera
          intentos++;
          setConfirmando(true);
          if (intentos === 8) setTardando(true);
          setTimeout(leer, 3000);
        } else {
          setConfirmando(false);
        }
      } catch {
        if (!cancelado) { setTecnico(null); setConfirmando(false); }
      }
    };

    leer();
    return () => { cancelado = true; };
  }, [user, vueltaDePago]);

  const pagar = async () => {
    const correo = emailPago.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError("Escribe un correo válido para la suscripción.");
      return;
    }
    setError(""); setCargando(true);
    try {
      const { url } = await iniciarSuscripcionPro(correo, codigo.trim() || null);
      window.location.href = url;   // checkout de Mercado Pago
    } catch (e) {
      setError(e.message || "No se pudo iniciar el pago. Intenta de nuevo.");
      setCargando(false);
    }
  };

  const recargarFacturas = () => {
    if (!user) return;
    obtenerFacturas(user.uid).then(setFacturas).catch(() => setFacturas([]));
  };
  useEffect(recargarFacturas, [user, tecnico?.plan]);

  const facturar = async () => {
    setFxEstado({ cargando:true, error:"", url:"" });
    try {
      const r = await solicitarFactura({ ...fx, rfc: fx.rfc.trim().toUpperCase(),
                                         razonSocial: fx.razonSocial.trim(),
                                         codigoPostal: fx.codigoPostal.trim() });
      setFxEstado({ cargando:false, error:"", url: r?.verificationUrl || "ok" });
      recargarFacturas();
    } catch (e) {
      setFxEstado({ cargando:false, error: e.message || "No se pudo generar la factura.", url:"" });
    }
  };

  const cancelar = async () => {
    if (!window.confirm(
      "¿Cancelar tu suscripción Pro?\n\nDejarás de tener prioridad en búsquedas, " +
      "herramientas de IA y Habilis Care. No se te volverá a cobrar."
    )) return;
    setError(""); setCancelando(true);
    try {
      await cancelarSuscripcionPro();
      const t = await obtenerTecnico(user.uid);
      setTecnico(t || null);
    } catch (e) {
      setError(e.message || "No se pudo cancelar. Intenta de nuevo o escríbenos a habilisempresa@gmail.com.");
    } finally {
      setCancelando(false);
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

        {user && confirmando && (
          <div className="h-card" style={{ padding:"36px", textAlign:"center" }}>
            <div style={{ width:"38px", height:"38px", border:"3px solid #F97316",
                          borderTopColor:"transparent", borderRadius:"50%",
                          margin:"0 auto 16px", animation:"spin 0.8s linear infinite" }} />
            <h1 style={{ fontSize:"20px", fontWeight:900, color:"#0F172A", marginBottom:"8px" }}>
              Confirmando tu pago…
            </h1>
            <p style={{ fontSize:"14px", color:"#64748B", lineHeight:1.7 }}>
              {tardando
                ? "Mercado Pago está tardando más de lo normal. Puedes cerrar esta página: en cuanto se confirme, tu plan se activa solo. Si en unos minutos sigue igual, escríbenos a habilisempresa@gmail.com."
                : "Estamos esperando la confirmación de Mercado Pago. Esto suele tomar unos segundos."}
            </p>
          </div>
        )}

        {user && tecnico !== undefined && !esPro && !confirmando && (
          <div className="h-card" style={{ padding:"clamp(24px,5vw,36px)" }}>
            <p style={{ fontSize:"11px", fontWeight:800, color:"#F97316", letterSpacing:"0.1em",
                        textTransform:"uppercase", marginBottom:"8px" }}>Suscripción</p>
            <h1 style={{ fontSize:"24px", fontWeight:900, color:"#0F172A", marginBottom:"4px" }}>
              Plan Pro
            </h1>
            <p style={{ fontSize:"14px", color:"#64748B", marginBottom:"18px" }}>
              <strong style={{ color:"#0F172A", fontSize:"20px" }}>$149 MXN/mes</strong> · IVA incluido ·
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

            {/* El camino normal es un solo clic: los campos solo aparecen si
                el técnico los necesita, para no convertir el pago en un
                formulario. */}
            <div style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:"10px",
                          padding:"12px 14px", marginBottom:"12px" }}>
              {editarEmail ? (
                <>
                  <label style={LBL}>Correo de tu cuenta de Mercado Pago</label>
                  <input style={{ ...INP, marginBottom:"6px" }} type="email" value={emailPago}
                    inputMode="email" autoFocus placeholder="tucorreo@ejemplo.com"
                    onChange={e => setEmailPago(e.target.value)} />
                  <p style={{ fontSize:"11.5px", color:"#94A3B8", lineHeight:1.5 }}>
                    Debe ser el correo con el que entras a Mercado Pago.
                  </p>
                </>
              ) : (
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                              gap:"10px", flexWrap:"wrap" }}>
                  <span style={{ fontSize:"13px", color:"#475569", wordBreak:"break-all" }}>
                    Se cobrará a <strong>{emailPago || "tu cuenta"}</strong>
                  </span>
                  <button onClick={() => setEditarEmail(true)}
                    style={{ background:"none", border:"none", padding:0, fontSize:"12.5px",
                             fontWeight:800, color:"#F97316", cursor:"pointer", flexShrink:0 }}>
                    Usar otro correo
                  </button>
                </div>
              )}
            </div>

            {verCodigo ? (
              <>
                <label style={LBL}>Código de descuento</label>
                <input style={{ ...INP, textTransform:"uppercase" }} value={codigo} autoFocus
                  onChange={e => setCodigo(e.target.value)} placeholder="EJEMPLO10" maxLength={30} />
              </>
            ) : (
              <button onClick={() => setVerCodigo(true)}
                style={{ background:"none", border:"none", padding:"0 0 14px", fontSize:"12.5px",
                         fontWeight:700, color:"#64748B", cursor:"pointer" }}>
                ¿Tienes un código de descuento?
              </button>
            )}

            {error && (
              <p style={{ fontSize:"13px", color:"#DC2626", background:"#FEE2E2", borderRadius:"8px",
                          padding:"10px 14px", marginBottom:"12px" }}>{error}</p>
            )}

            <button className="h-btn-orange" onClick={pagar} disabled={cargando}
              style={{ width:"100%", padding:"14px", fontSize:"15px", opacity: cargando ? 0.6 : 1 }}>
              {cargando ? "Conectando con Mercado Pago…" : "Pagar con Mercado Pago →"}
            </button>
            <p style={{ fontSize:"12px", color:"#94A3B8", marginTop:"12px", lineHeight:1.6, textAlign:"center" }}>
              Mercado Pago te pedirá iniciar sesión para autorizar el cobro recurrente:
              es un requisito suyo para las suscripciones, no un paso extra de Habilis.
              Ahí registras tu tarjeta — Habilis nunca la ve. Se cobra cada mes hasta que
              canceles, y puedes cancelar desde esta misma página cuando quieras.
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
              <p style={{ fontSize:"14px", color:"#64748B", lineHeight:1.7, marginBottom:"18px" }}>
                Tu suscripción está activa y se renueva automáticamente cada mes.
                El método de pago se administra desde tu cuenta de Mercado Pago.
              </p>

              {error && (
                <p style={{ fontSize:"13px", color:"#DC2626", background:"#FEE2E2", borderRadius:"8px",
                            padding:"10px 14px", marginBottom:"12px" }}>{error}</p>
              )}

              <button onClick={cancelar} disabled={cancelando}
                style={{ background:"none", border:"1px solid #E2E8F0", borderRadius:"10px",
                         padding:"10px 18px", fontSize:"13px", fontWeight:700,
                         color:"#64748B", cursor:"pointer", opacity: cancelando ? 0.6 : 1 }}>
                {cancelando ? "Cancelando…" : "Cancelar suscripción"}
              </button>
            </div>

            <div className="h-card" style={{ padding:"clamp(24px,5vw,32px)" }}>
              <h2 style={{ fontSize:"16px", fontWeight:900, color:"#0F172A", marginBottom:"4px" }}>
                Solicitar factura (CFDI)
              </h2>
              <p style={{ fontSize:"13px", color:"#64748B", marginBottom:"16px" }}>
                Se factura tu cobro más reciente que aún no tenga CFDI. Cada mensualidad
                se timbra una sola vez.
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

              {/* Historial: antes el enlace del CFDI solo aparecía una vez y
                  se perdía al recargar la página. */}
              {facturas.length > 0 && (
                <div style={{ marginTop:"26px", borderTop:"1px solid #F1F5F9", paddingTop:"18px" }}>
                  <h3 style={{ fontSize:"13px", fontWeight:800, color:"#0F172A", marginBottom:"12px" }}>
                    Tus facturas
                  </h3>
                  {facturas.map(f => (
                    <div key={f.id} style={{ display:"flex", justifyContent:"space-between",
                                             alignItems:"center", gap:"10px", flexWrap:"wrap",
                                             padding:"9px 0", borderBottom:"1px solid #F8FAFC" }}>
                      <div>
                        <p style={{ fontSize:"13px", fontWeight:700, color:"#0F172A" }}>
                          ${(f.total ?? 0).toLocaleString("es-MX")} MXN
                          <span style={{ fontWeight:500, color:"#94A3B8" }}> · {f.rfc}</span>
                        </p>
                        <p style={{ fontSize:"11.5px", color:"#94A3B8" }}>
                          {f.fecha?.toDate ? f.fecha.toDate().toLocaleDateString("es-MX",
                            { day:"2-digit", month:"long", year:"numeric" }) : "—"}
                        </p>
                      </div>
                      {f.verificationUrl && (
                        <a href={f.verificationUrl} target="_blank" rel="noreferrer"
                          style={{ fontSize:"12.5px", fontWeight:800, color:"#F97316", flexShrink:0 }}>
                          Ver CFDI →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
