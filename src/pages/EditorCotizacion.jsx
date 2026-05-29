import { useState, useEffect, useRef } from "react";
import Nav from "../components/Nav.jsx";
import {
  obtenerCotizacion, actualizarCotizacion, obtenerTecnico,
  obtenerClientesTecnico, guardarClienteTecnico,
  obtenerProductosTecnico, guardarProductoTecnico,
} from "../lib/firebase.js";

const INP = { border:"1px solid #E2E8F0", borderRadius:"8px", padding:"9px 12px",
              fontSize:"13px", outline:"none", background:"#fff", color:"#0F172A",
              boxSizing:"border-box", width:"100%" };
const LBL = { fontSize:"11px", fontWeight:700, color:"#64748B", textTransform:"uppercase",
              letterSpacing:"0.06em", display:"block", marginBottom:"3px" };
const SEC = { background:"#fff", border:"1px solid #E2E8F0", borderRadius:"14px",
              padding:"18px 20px", marginBottom:"14px", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" };
const fmt = n => (Number(n)||0).toLocaleString("es-MX", { minimumFractionDigits:2 });

const TERMINOS_DEFAULT = `1. Cotización válida por los días de vigencia indicados.
2. Precios en MXN, sujetos a cambio sin previo aviso.
3. El servicio inicia al recibir el anticipo acordado.
4. Materiales o trabajos adicionales se facturan por separado.
5. Garantía de mano de obra: 30 días desde la ejecución.`;

export default function EditorCotizacion({ nav, user, params }) {
  const cotId = params?.cotizacionId;

  const [cot,        setCot]        = useState(null);
  const [tecnico,    setTecnico]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);

  // Form state
  const [folio,      setFolio]      = useState("");
  const [fecha,      setFecha]      = useState(new Date().toISOString().slice(0,10));
  const [validez,    setValidez]    = useState(15);
  const [cliente,    setCliente]    = useState({ nombre:"", empresa:"", rfc:"", email:"", telefono:"" });
  const [productos,  setProductos]  = useState([]);
  const [manoObra,   setManoObra]   = useState([]);
  const [descPct,    setDescPct]    = useState(0);
  const [iva,        setIva]        = useState(true);
  const [moneda,     setMoneda]     = useState("MXN");
  const [notas,      setNotas]      = useState("");
  const [terminos,   setTerminos]   = useState(TERMINOS_DEFAULT);
  const [metodoPago, setMetodoPago] = useState("Transferencia");

  // Catalogs
  const [catalogo,   setCatalogo]   = useState([]);
  const [clientesList, setClientesList] = useState([]);
  const [showClienteSug, setShowClienteSug] = useState(false);

  // New product form
  const [newProd, setNewProd] = useState({ descripcion:"", cantidad:1, precioUnitario:"", nota:"" });
  const [prodSug, setProdSug] = useState([]);
  const [showProdSug, setShowProdSug] = useState(false);
  const [newObra, setNewObra] = useState({ descripcion:"", costo:"" });

  const autoSaveTimer = useRef(null);

  useEffect(() => {
    if (!user || !cotId) { nav("cotizaciones"); return; }
    Promise.all([
      obtenerCotizacion(cotId),
      obtenerTecnico(user.uid),
      obtenerClientesTecnico(user.uid),
      obtenerProductosTecnico(user.uid),
    ]).then(([c, t, cls, prods]) => {
      if (!c) { nav("cotizaciones"); return; }
      setCot(c);
      setTecnico(t);
      setClientesList(cls);
      setCatalogo(prods);
      // Populate form from saved cotización
      setFolio(c.folio || "");
      setFecha(c.fecha ? c.fecha.slice(0,10) : new Date().toISOString().slice(0,10));
      setValidez(c.validez || 15);
      setCliente(c.cliente || { nombre:"", empresa:"", rfc:"", email:"", telefono:"" });
      setProductos(c.productos || []);
      setManoObra(c.manoObra || []);
      setDescPct(c.descuento?.valor || 0);
      setIva(c.iva !== false);
      setMoneda(c.moneda || "MXN");
      setNotas(c.notas || "");
      setTerminos(c.terminos || TERMINOS_DEFAULT);
      setMetodoPago(c.metodoPago || "Transferencia");
    }).finally(() => setLoading(false));
  }, [cotId, user]);

  // Auto-save every 30s
  useEffect(() => {
    if (!cotId || loading) return;
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => guardar(false), 30000);
    return () => clearTimeout(autoSaveTimer.current);
  }, [productos, manoObra, cliente, notas, iva, descPct]);

  // Financial calculations
  const subtotalProds  = productos.reduce((s, p) => s + (Number(p.cantidad||1) * Number(p.precioUnitario||0)), 0);
  const subtotalObra   = manoObra.reduce((s, m) => s + Number(m.costo||0), 0);
  const subtotal       = subtotalProds + subtotalObra;
  const descuentoMonto = subtotal * (Number(descPct||0) / 100);
  const base           = subtotal - descuentoMonto;
  const ivaMonto       = iva ? base * 0.16 : 0;
  const total          = base + ivaMonto;

  const guardar = async (showFeedback = true) => {
    if (!cotId) return;
    if (showFeedback) setSaving(true);
    try {
      const data = {
        folio, fecha, validez: Number(validez), estado:"borrador",
        cliente, productos, manoObra,
        descuento: { tipo:"porcentaje", valor:Number(descPct) },
        iva, moneda, subtotal, total, ivaMonto,
        notas, terminos, metodoPago,
      };
      await actualizarCotizacion(cotId, data);
      // Save client to directory
      if (cliente.email) guardarClienteTecnico(user.uid, cliente).catch(() => {});
      // Save products to catalog
      productos.forEach(p => {
        if (p.descripcion) guardarProductoTecnico(user.uid, { descripcion:p.descripcion, precioUnitario:p.precioUnitario }).catch(() => {});
      });
      if (showFeedback) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    } finally { if (showFeedback) setSaving(false); }
  };

  const enviarWA = async () => {
    await guardar(false);
    await actualizarCotizacion(cotId, { estado:"enviada" });
    const url = `${window.location.origin}?vista=${cotId}`;
    const msg = `Hola ${cliente.nombre || ""}, te comparto la cotización ${folio} de Habilis: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  const addProducto = () => {
    if (!newProd.descripcion.trim()) return;
    setProductos(p => [...p, { ...newProd, cantidad:Number(newProd.cantidad)||1, precioUnitario:Number(newProd.precioUnitario)||0 }]);
    setNewProd({ descripcion:"", cantidad:1, precioUnitario:"", nota:"" });
    setShowProdSug(false);
  };

  const addManoObra = () => {
    if (!newObra.descripcion.trim()) return;
    setManoObra(m => [...m, { descripcion:newObra.descripcion.trim(), costo:Number(newObra.costo)||0 }]);
    setNewObra({ descripcion:"", costo:"" });
  };

  const setProd = (i, k, v) => setProductos(ps => ps.map((p, idx) => idx===i ? { ...p, [k]:v } : p));
  const delProd = i => setProductos(ps => ps.filter((_, idx) => idx !== i));
  const delObra = i => setManoObra(ms => ms.filter((_, idx) => idx !== i));

  const filteredCatalogo = catalogo.filter(p =>
    p.descripcion?.toLowerCase().includes(newProd.descripcion.toLowerCase()) && newProd.descripcion.length > 1
  ).slice(0,6);

  const filteredClientes = clientesList.filter(c =>
    c.nombre?.toLowerCase().includes(cliente.nombre?.toLowerCase() || "") && cliente.nombre?.length > 1
  ).slice(0,5);

  if (loading) return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>
      <div style={{ textAlign:"center", padding:"80px 20px" }}>
        <div style={{ width:"36px", height:"36px", border:"3px solid #F97316", borderTopColor:"transparent",
                      borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
        <p style={{ color:"#64748B" }}>Cargando editor...</p>
      </div>
    </div>
  );

  return (
    <div style={{ background:"#F1F5F9", minHeight:"100vh" }}>
      <div style={{ background:"#0F172A" }}><Nav nav={nav} user={user} /></div>

      {/* TOP BAR */}
      <div style={{ background:"#0F172A", padding:"14px 20px", borderTop:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth:"960px", margin:"0 auto", display:"flex", justifyContent:"space-between",
                      alignItems:"center", flexWrap:"wrap", gap:"10px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
            <button onClick={() => nav("cotizaciones")}
              style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:"13px" }}>
              ← Cotizaciones
            </button>
            <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"13px" }}>|</span>
            <span style={{ fontWeight:700, fontSize:"14px", color:"#fff" }}>{folio}</span>
          </div>
          <div style={{ display:"flex", gap:"8px" }}>
            {saved && <span style={{ color:"#10B981", fontSize:"12px", alignSelf:"center" }}>✓ Guardado</span>}
            <button onClick={() => nav("vistaCotizacion", { token:cotId })}
              style={{ background:"rgba(255,255,255,0.08)", color:"#fff", border:"1px solid rgba(255,255,255,0.15)",
                       borderRadius:"8px", padding:"7px 14px", fontSize:"12px", fontWeight:600, cursor:"pointer" }}>
              Vista previa
            </button>
            <button onClick={enviarWA}
              style={{ background:"#25D366", color:"#fff", border:"none", borderRadius:"8px",
                       padding:"7px 14px", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
              📲 WhatsApp
            </button>
            <button onClick={() => guardar(true)} disabled={saving}
              style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"8px",
                       padding:"7px 16px", fontSize:"13px", fontWeight:700, cursor:"pointer",
                       opacity: saving ? 0.75 : 1 }}>
              {saving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"960px", margin:"0 auto", padding:"20px", display:"grid",
                    gridTemplateColumns:"1fr min(360px,40%)", gap:"16px",
                    alignItems:"start" }}>

        {/* LEFT COLUMN */}
        <div>
          {/* HEADER */}
          <div style={SEC}>
            <h3 style={{ fontWeight:800, fontSize:"14px", color:"#0F172A", marginBottom:"14px" }}>
              📋 Encabezado
            </h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px" }}>
              <div><label style={LBL}>Folio</label><input style={INP} value={folio} onChange={e => setFolio(e.target.value)} /></div>
              <div><label style={LBL}>Fecha</label><input style={INP} type="date" value={fecha} onChange={e => setFecha(e.target.value)} /></div>
              <div><label style={LBL}>Validez (días)</label><input style={INP} type="number" value={validez} onChange={e => setValidez(e.target.value)} /></div>
            </div>
          </div>

          {/* TÉCNICO */}
          {tecnico && (
            <div style={SEC}>
              <h3 style={{ fontWeight:800, fontSize:"14px", color:"#0F172A", marginBottom:"10px" }}>👤 Datos del técnico</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", fontSize:"13px", color:"#374151" }}>
                {[["Nombre",     tecnico.nombre],
                  ["Oficio",     tecnico.oficio],
                  ["Ciudad",     tecnico.ciudad],
                  ["Email",      tecnico.email],
                ].map(([k,v]) => (
                  <div key={k}><span style={{ color:"#94A3B8", fontSize:"11px" }}>{k}</span><br /><b>{v||"—"}</b></div>
                ))}
              </div>
            </div>
          )}

          {/* CLIENTE */}
          <div style={SEC}>
            <h3 style={{ fontWeight:800, fontSize:"14px", color:"#0F172A", marginBottom:"14px" }}>🏢 Datos del cliente</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
              <div style={{ position:"relative", gridColumn:"1/-1" }}>
                <label style={LBL}>Nombre del cliente</label>
                <input style={INP} value={cliente.nombre}
                  onChange={e => { setCliente(c => ({ ...c, nombre:e.target.value })); setShowClienteSug(true); }}
                  onFocus={() => setShowClienteSug(true)}
                  onBlur={() => setTimeout(() => setShowClienteSug(false), 200)}
                  placeholder="Buscar cliente guardado o escribe..." />
                {showClienteSug && filteredClientes.length > 0 && (
                  <div style={{ position:"absolute", top:"100%", left:0, right:0, background:"#fff",
                                border:"1px solid #E2E8F0", borderRadius:"8px", zIndex:100,
                                boxShadow:"0 4px 12px rgba(0,0,0,0.1)", maxHeight:"160px", overflowY:"auto" }}>
                    {filteredClientes.map(c => (
                      <div key={c.id} onMouseDown={() => setCliente({ nombre:c.nombre, empresa:c.empresa||"", rfc:c.rfc||"", email:c.email||"", telefono:c.telefono||"" })}
                        style={{ padding:"8px 12px", cursor:"pointer", fontSize:"13px", borderBottom:"1px solid #F1F5F9" }}
                        onMouseEnter={e => e.currentTarget.style.background="#F8FAFC"}
                        onMouseLeave={e => e.currentTarget.style.background="#fff"}>
                        <b>{c.nombre}</b>{c.empresa ? ` · ${c.empresa}` : ""}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div><label style={LBL}>Empresa</label><input style={INP} value={cliente.empresa} onChange={e => setCliente(c => ({ ...c, empresa:e.target.value }))} placeholder="Nombre empresa" /></div>
              <div><label style={LBL}>RFC</label><input style={INP} value={cliente.rfc} onChange={e => setCliente(c => ({ ...c, rfc:e.target.value }))} placeholder="RFC123456789" /></div>
              <div><label style={LBL}>Email</label><input style={INP} type="email" value={cliente.email} onChange={e => setCliente(c => ({ ...c, email:e.target.value }))} placeholder="cliente@email.com" /></div>
              <div><label style={LBL}>Teléfono</label><input style={INP} value={cliente.telefono} onChange={e => setCliente(c => ({ ...c, telefono:e.target.value }))} placeholder="55 1234 5678" /></div>
            </div>
          </div>

          {/* PRODUCTOS */}
          <div style={SEC}>
            <h3 style={{ fontWeight:800, fontSize:"14px", color:"#0F172A", marginBottom:"14px" }}>📦 Productos y materiales</h3>
            {productos.length > 0 && (
              <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"14px", fontSize:"13px" }}>
                <thead>
                  <tr style={{ borderBottom:"2px solid #F1F5F9" }}>
                    {["Descripción","Cant.","Precio unit.","Subtotal",""].map(h => (
                      <th key={h} style={{ padding:"6px 8px", textAlign:"left", fontSize:"10px", fontWeight:700, color:"#94A3B8", textTransform:"uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p, i) => (
                    <tr key={i} style={{ borderBottom:"1px solid #F8FAFC" }}>
                      <td style={{ padding:"8px" }}>
                        <input style={{ ...INP, fontSize:"12px", padding:"5px 8px" }} value={p.descripcion} onChange={e => setProd(i,"descripcion",e.target.value)} />
                        {p.nota && <p style={{ fontSize:"11px", color:"#94A3B8", marginTop:"2px" }}>{p.nota}</p>}
                      </td>
                      <td style={{ padding:"8px", width:"60px" }}>
                        <input style={{ ...INP, fontSize:"12px", padding:"5px 8px", textAlign:"center" }} type="number" value={p.cantidad} onChange={e => setProd(i,"cantidad",e.target.value)} min="1" />
                      </td>
                      <td style={{ padding:"8px", width:"110px" }}>
                        <input style={{ ...INP, fontSize:"12px", padding:"5px 8px", textAlign:"right" }} type="number" value={p.precioUnitario} onChange={e => setProd(i,"precioUnitario",e.target.value)} />
                      </td>
                      <td style={{ padding:"8px", fontWeight:600, textAlign:"right", whiteSpace:"nowrap" }}>
                        ${fmt(Number(p.cantidad||1) * Number(p.precioUnitario||0))}
                      </td>
                      <td style={{ padding:"8px" }}>
                        <button onClick={() => delProd(i)} style={{ background:"#FEF2F2", color:"#DC2626", border:"none", borderRadius:"6px", padding:"4px 8px", cursor:"pointer", fontSize:"12px" }}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {/* Add product form */}
            <div style={{ background:"#F8FAFC", borderRadius:"10px", padding:"12px", border:"1px solid #E2E8F0" }}>
              <p style={{ fontSize:"11px", fontWeight:700, color:"#64748B", textTransform:"uppercase", marginBottom:"8px" }}>Agregar producto</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 70px 110px", gap:"8px", marginBottom:"8px" }}>
                <div style={{ position:"relative" }}>
                  <input style={INP} value={newProd.descripcion}
                    onChange={e => { setNewProd(p => ({ ...p, descripcion:e.target.value })); setShowProdSug(true); }}
                    onFocus={() => setShowProdSug(true)}
                    onBlur={() => setTimeout(() => setShowProdSug(false), 200)}
                    placeholder="Descripción del producto..." />
                  {showProdSug && filteredCatalogo.length > 0 && (
                    <div style={{ position:"absolute", top:"100%", left:0, right:0, background:"#fff",
                                  border:"1px solid #E2E8F0", borderRadius:"8px", zIndex:100,
                                  boxShadow:"0 4px 12px rgba(0,0,0,0.1)" }}>
                      {filteredCatalogo.map(p => (
                        <div key={p.id} onMouseDown={() => { setNewProd(np => ({ ...np, descripcion:p.descripcion, precioUnitario:p.precioUnitario||"" })); setShowProdSug(false); }}
                          style={{ padding:"8px 12px", cursor:"pointer", fontSize:"13px", borderBottom:"1px solid #F1F5F9" }}
                          onMouseEnter={e => e.currentTarget.style.background="#F8FAFC"}
                          onMouseLeave={e => e.currentTarget.style.background="#fff"}>
                          {p.descripcion}{p.precioUnitario ? ` · $${fmt(p.precioUnitario)}` : ""}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input style={{ ...INP, textAlign:"center" }} type="number" value={newProd.cantidad} onChange={e => setNewProd(p => ({ ...p, cantidad:e.target.value }))} placeholder="Cant." min="1" />
                <input style={{ ...INP, textAlign:"right" }} type="number" value={newProd.precioUnitario} onChange={e => setNewProd(p => ({ ...p, precioUnitario:e.target.value }))} placeholder="Precio unit." />
              </div>
              <div style={{ display:"flex", gap:"8px" }}>
                <input style={{ ...INP, flex:1 }} value={newProd.nota} onChange={e => setNewProd(p => ({ ...p, nota:e.target.value }))} placeholder="Nota opcional..." />
                <button onClick={addProducto}
                  style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"8px",
                           padding:"8px 16px", fontWeight:700, fontSize:"13px", cursor:"pointer", flexShrink:0 }}>
                  + Agregar
                </button>
              </div>
            </div>
          </div>

          {/* MANO DE OBRA */}
          <div style={SEC}>
            <h3 style={{ fontWeight:800, fontSize:"14px", color:"#0F172A", marginBottom:"14px" }}>🔧 Mano de obra y servicios</h3>
            {manoObra.length > 0 && (
              <div style={{ marginBottom:"12px" }}>
                {manoObra.map((m, i) => (
                  <div key={i} style={{ display:"flex", gap:"8px", alignItems:"center", padding:"8px 0",
                                        borderBottom:"1px solid #F1F5F9" }}>
                    <span style={{ flex:1, fontSize:"13px" }}>{m.descripcion}</span>
                    <span style={{ fontWeight:700, fontSize:"13px", color:"#0F172A", whiteSpace:"nowrap" }}>${fmt(m.costo)}</span>
                    <button onClick={() => delObra(i)} style={{ background:"#FEF2F2", color:"#DC2626", border:"none", borderRadius:"6px", padding:"4px 8px", cursor:"pointer", fontSize:"12px" }}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display:"flex", gap:"8px" }}>
              <input style={{ ...INP, flex:2 }} value={newObra.descripcion} onChange={e => setNewObra(o => ({ ...o, descripcion:e.target.value }))} placeholder="Ej: Mano de obra instalación, Viáticos..." />
              <input style={{ ...INP, flex:1 }} type="number" value={newObra.costo} onChange={e => setNewObra(o => ({ ...o, costo:e.target.value }))} placeholder="Costo" />
              <button onClick={addManoObra}
                style={{ background:"#F97316", color:"#fff", border:"none", borderRadius:"8px",
                         padding:"8px 14px", fontWeight:700, fontSize:"13px", cursor:"pointer", flexShrink:0 }}>
                +
              </button>
            </div>
          </div>

          {/* NOTES */}
          <div style={SEC}>
            <h3 style={{ fontWeight:800, fontSize:"14px", color:"#0F172A", marginBottom:"12px" }}>📝 Notas y términos</h3>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
              <div>
                <label style={LBL}>Notas para el cliente</label>
                <textarea style={{ ...INP, resize:"vertical", minHeight:"80px" }} value={notas} onChange={e => setNotas(e.target.value)} placeholder="Notas adicionales para el cliente..." />
              </div>
              <div>
                <label style={LBL}>Términos y condiciones</label>
                <textarea style={{ ...INP, resize:"vertical", minHeight:"80px" }} value={terminos} onChange={e => setTerminos(e.target.value)} />
              </div>
              <div>
                <label style={LBL}>Método de pago</label>
                <select style={INP} value={metodoPago} onChange={e => setMetodoPago(e.target.value)}>
                  {["Efectivo","Transferencia","Tarjeta","Cheque","50% anticipo + 50% al terminar"].map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={LBL}>Moneda</label>
                <select style={INP} value={moneda} onChange={e => setMoneda(e.target.value)}>
                  <option>MXN</option>
                  <option>USD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — TOTALS */}
        <div style={{ position:"sticky", top:"80px" }}>
          <div style={{ background:"#0F172A", borderRadius:"16px", padding:"22px",
                        boxShadow:"0 4px 16px rgba(15,23,42,0.2)" }}>
            <h3 style={{ fontWeight:800, fontSize:"14px", color:"rgba(255,255,255,0.7)",
                         textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"18px" }}>
              Resumen financiero
            </h3>

            {[
              ["Subtotal productos", subtotalProds],
              ["Mano de obra",       subtotalObra],
            ].map(([label, val]) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", fontSize:"13px",
                                         color:"rgba(255,255,255,0.6)", marginBottom:"8px" }}>
                <span>{label}</span>
                <span>${fmt(val)}</span>
              </div>
            ))}

            <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", padding:"10px 0", marginBottom:"8px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"14px", color:"#fff", fontWeight:600 }}>
                <span>Subtotal</span>
                <span>${fmt(subtotal)}</span>
              </div>
            </div>

            {/* Discount */}
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px" }}>
              <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", flex:1 }}>Descuento %</span>
              <input type="number" value={descPct} onChange={e => setDescPct(e.target.value)} min="0" max="100"
                style={{ background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)",
                         borderRadius:"6px", padding:"5px 8px", color:"#fff", fontSize:"12px",
                         width:"60px", textAlign:"right", outline:"none" }} />
              <span style={{ fontSize:"12px", color:"rgba(249,115,22,0.9)", width:"80px", textAlign:"right" }}>
                -${fmt(descuentoMonto)}
              </span>
            </div>

            {/* IVA toggle */}
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"14px" }}>
              <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)", flex:1 }}>IVA 16%</span>
              <button onClick={() => setIva(v => !v)}
                style={{ background: iva ? "#F97316" : "rgba(255,255,255,0.08)", color:"#fff",
                         border:`1px solid ${iva ? "#F97316" : "rgba(255,255,255,0.15)"}`,
                         borderRadius:"20px", padding:"3px 12px", fontSize:"11px", fontWeight:700, cursor:"pointer" }}>
                {iva ? "Con IVA" : "Sin IVA"}
              </button>
              {iva && <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.6)", width:"80px", textAlign:"right" }}>${fmt(ivaMonto)}</span>}
            </div>

            <div style={{ borderTop:"1px solid rgba(255,255,255,0.15)", paddingTop:"14px", marginBottom:"18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                <span style={{ fontSize:"16px", fontWeight:700, color:"rgba(255,255,255,0.7)" }}>TOTAL</span>
                <span style={{ fontSize:"28px", fontWeight:900, color:"#F97316" }}>
                  {moneda === "USD" ? "USD " : "$"}{fmt(total)}
                </span>
              </div>
              <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)", marginTop:"4px" }}>
                {iva ? "IVA incluido" : "Sin IVA"} · {moneda}
              </p>
            </div>

            <button onClick={() => guardar(true)} disabled={saving}
              style={{ width:"100%", background:"#F97316", color:"#fff", border:"none", borderRadius:"10px",
                       padding:"12px", fontWeight:700, fontSize:"14px", cursor:"pointer", marginBottom:"8px",
                       opacity: saving ? 0.75 : 1 }}>
              {saving ? "Guardando..." : "💾 Guardar borrador"}
            </button>
            <button onClick={() => nav("vistaCotizacion", { token:cotId })}
              style={{ width:"100%", background:"rgba(255,255,255,0.08)", color:"#fff",
                       border:"1px solid rgba(255,255,255,0.15)", borderRadius:"10px",
                       padding:"11px", fontWeight:600, fontSize:"13px", cursor:"pointer", marginBottom:"8px" }}>
              👁 Vista previa
            </button>
            <button onClick={enviarWA}
              style={{ width:"100%", background:"#25D366", color:"#fff", border:"none", borderRadius:"10px",
                       padding:"11px", fontWeight:700, fontSize:"13px", cursor:"pointer" }}>
              📲 Enviar por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
