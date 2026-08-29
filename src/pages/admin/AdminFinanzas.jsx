import { useEffect, useMemo, useState } from "react";
import { db, auth } from "../../lib/firebase.js";
import { collection, getDocs, getDoc, setDoc, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy, limit, writeBatch } from "firebase/firestore";
import { mxn, fechaCorta, claveMes, ultimosMeses, exportarCSV, USD_RATE, logAdmin } from "../../lib/erp.js";

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px" };
const TH = { textAlign: "left", padding: "10px 12px", color: "#64748B", fontWeight: 700, fontSize: 11, textTransform: "uppercase" };
const TD = { padding: "9px 12px", fontSize: 13, borderBottom: "1px solid #F1F5F9" };
const btnSm = { background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" };
const inp = { border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 10px", fontSize: 13 };

const MES_CORTO = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const labelMes = (k) => k ? `${MES_CORTO[parseInt(k.slice(5), 10)]} ${k.slice(0, 4)}` : "—";

export default function AdminFinanzas() {
  const [tab, setTab] = useState("pagos");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {[["pagos", "Pagos"], ["facturas", "Facturas"], ["xprize", "Reporte XPRIZE"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ ...btnSm, background: tab === id ? "#0F172A" : "#F1F5F9", color: tab === id ? "#fff" : "#0F172A" }}>{label}</button>
        ))}
      </div>
      {tab === "pagos" && <Pagos />}
      {tab === "facturas" && <Facturas />}
      {tab === "xprize" && <ReporteXPrize />}
    </div>
  );
}

function Pagos() {
  const [pagos, setPagos] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filtroMes, setFiltroMes] = useState("");
  const [error, setError] = useState("");

  const cargar = async () => {
    try {
      const [pagosSnap, tecSnap] = await Promise.all([
        getDocs(query(collection(db, "pagos"), orderBy("fecha", "desc"), limit(500))),
        getDocs(collection(db, "tecnicos")),
      ]);
      setPagos(pagosSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setTecnicos(tecSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) { setError(e.message); }
  };
  useEffect(() => { cargar(); }, []);

  const nombres = useMemo(() => new Map(tecnicos.map((t) => [t.id, t.nombre || t.email || t.id])), [tecnicos]);

  if (error) return <div style={{ ...CARD, color: "#991B1B" }}>Error: {error}</div>;
  if (!pagos) return <p style={{ color: "#64748B" }}>Cargando pagos…</p>;

  // Solo pagos aprobados suman a los KPIs — rechazados/pendientes se ven en tabla pero no inflan totales
  const aprobados = pagos.filter((p) => p.estado === "aprobado");
  const mesActual = claveMes(new Date());
  const esteMes = aprobados.filter((p) => claveMes(p.fecha) === mesActual).reduce((a, p) => a + (p.monto || 0), 0);
  const total = aprobados.reduce((a, p) => a + (p.monto || 0), 0);

  const mesesConPagos = [...new Set(pagos.map((p) => claveMes(p.fecha)).filter(Boolean))].sort().reverse();
  const visibles = filtroMes ? pagos.filter((p) => claveMes(p.fecha) === filtroMes) : pagos;

  const exportar = () => exportarCSV("habilis_pagos", [
    { key: (p) => fechaCorta(p.fecha), label: "Fecha" },
    { key: (p) => nombres.get(p.userId) || p.userId, label: "Usuario" },
    { key: "monto", label: "Monto MXN" },
    { key: "metodo", label: "Método" },
    { key: "estado", label: "Estado" },
    { key: "concepto", label: "Concepto" },
  ], visibles);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>ESTE MES (APROBADOS)</div><div style={{ fontSize: 22, fontWeight: 800 }}>{mxn(esteMes)}</div></div>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>TOTAL HISTÓRICO</div><div style={{ fontSize: 22, fontWeight: 800 }}>{mxn(total)}</div></div>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}># PAGOS APROBADOS</div><div style={{ fontSize: 22, fontWeight: 800 }}>{aprobados.length}</div></div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button style={{ ...btnSm, background: "#F97316", color: "#fff", border: "none" }} onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancelar" : "➕ Registrar pago manual"}
        </button>
        <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)} style={inp}>
          <option value="">Todos los meses</option>
          {mesesConPagos.map((m) => <option key={m} value={m}>{labelMes(m)}</option>)}
        </select>
        <button style={btnSm} onClick={exportar}>⬇ Exportar CSV</button>
        <button style={btnSm} onClick={cargar}>↻ Actualizar</button>
      </div>

      {showForm && <FormPagoManual tecnicos={tecnicos} onDone={() => { setShowForm(false); cargar(); }} />}

      <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Fecha", "Usuario", "Monto", "Método", "Estado", "Concepto"].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {visibles.map((p) => (
                <tr key={p.id}>
                  <td style={TD}>{fechaCorta(p.fecha)}</td>
                  <td style={TD}>{nombres.get(p.userId) || p.userId}</td>
                  <td style={{ ...TD, fontVariantNumeric: "tabular-nums" }}>{mxn(p.monto)}</td>
                  <td style={TD}>{p.metodo}</td>
                  <td style={{ ...TD, color: p.estado === "aprobado" ? "#059669" : "#B45309", fontWeight: 700 }}>{p.estado}</td>
                  <td style={TD}>{p.concepto}</td>
                </tr>
              ))}
              {visibles.length === 0 && <tr><td colSpan={6} style={{ ...TD, textAlign: "center", color: "#94A3B8" }}>Sin pagos{filtroMes ? " en ese mes" : " registrados todavía"}.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FormPagoManual({ tecnicos, onDone }) {
  const [uid, setUid] = useState("");
  const [monto, setMonto] = useState("100");
  const [metodo, setMetodo] = useState("efectivo");
  const [concepto, setConcepto] = useState("Habilis Pro mensual");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const guardar = async () => {
    if (!uid) { setErr("Selecciona un usuario."); return; }
    const montoNum = parseFloat(monto);
    if (!(montoNum > 0)) { setErr("El monto debe ser mayor a cero."); return; }
    setSaving(true); setErr("");
    try {
      // Atómico: o se registra el pago Y se activa Pro, o ninguna de las dos
      const batch = writeBatch(db);
      const pagoRef = doc(collection(db, "pagos"));
      batch.set(pagoRef, {
        userId: uid, monto: montoNum, metodo, estado: "aprobado", concepto,
        fecha: serverTimestamp(), registradoManualmente: true,
        // El técnico puede pedir su CFDI de este cobro desde /pro.
        facturada: false,
      });
      batch.update(doc(db, "tecnicos", uid), { plan: "pro", fechaPago: serverTimestamp() });
      await batch.commit();
      logAdmin(auth.currentUser?.email, "registró pago manual y activó Pro", `tecnicos/${uid}`, `${mxn(montoNum)} · ${metodo}`);
      onDone();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ ...CARD, display: "flex", flexDirection: "column", gap: 10 }}>
      {err && <div style={{ color: "#991B1B", fontSize: 13 }}>{err}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 8 }}>
        <select value={uid} onChange={(e) => setUid(e.target.value)} style={inp}>
          <option value="">— Selecciona técnico —</option>
          {tecnicos.map((t) => <option key={t.id} value={t.id}>{t.nombre} ({t.email})</option>)}
        </select>
        <input placeholder="Monto MXN" type="number" min="1" value={monto} onChange={(e) => setMonto(e.target.value)} style={inp} />
        <select value={metodo} onChange={(e) => setMetodo(e.target.value)} style={inp}>
          <option value="efectivo">Efectivo</option><option value="transferencia">Transferencia</option>
          <option value="oxxo">Oxxo</option><option value="mercadopago">Mercado Pago</option>
        </select>
        <input placeholder="Concepto" value={concepto} onChange={(e) => setConcepto(e.target.value)} style={inp} />
      </div>
      <button disabled={saving} onClick={guardar} style={{ ...btnSm, background: "#F97316", color: "#fff", border: "none", alignSelf: "flex-start" }}>
        {saving ? "Guardando…" : "Registrar pago y activar Pro"}
      </button>
    </div>
  );
}

function Facturas() {
  const [facturas, setFacturas] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getDocs(query(collection(db, "facturas"), orderBy("fecha", "desc"), limit(300))),
      getDocs(collection(db, "tecnicos")),
    ]).then(([fSnap, tSnap]) => {
      setFacturas(fSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setTecnicos(tSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }).catch((e) => setError(e.message));
  }, []);

  const nombres = useMemo(() => new Map(tecnicos.map((t) => [t.id, t.nombre || t.email || t.id])), [tecnicos]);

  if (error) return <div style={{ ...CARD, color: "#991B1B" }}>Error cargando facturas: {error}</div>;
  if (!facturas) return <p style={{ color: "#64748B" }}>Cargando facturas…</p>;

  const totalFacturado = facturas.reduce((a, f) => a + (f.total || 0), 0);
  const exportar = () => exportarCSV("habilis_facturas", [
    { key: (f) => fechaCorta(f.fecha), label: "Fecha" },
    { key: (f) => nombres.get(f.userId) || f.userId, label: "Usuario" },
    { key: "rfc", label: "RFC" },
    { key: "total", label: "Total MXN" },
    { key: "facturaId", label: "ID Facturapi" },
  ], facturas);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ ...CARD, flex: "0 0 auto" }}>
          <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>TOTAL FACTURADO</div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{mxn(totalFacturado)}</div>
        </div>
        <button style={btnSm} onClick={exportar}>⬇ Exportar CSV</button>
      </div>
      <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Fecha", "Usuario", "RFC", "Total", "Verificación"].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {facturas.map((f) => (
                <tr key={f.id}>
                  <td style={TD}>{fechaCorta(f.fecha)}</td>
                  <td style={TD}>{nombres.get(f.userId) || f.userId}</td>
                  <td style={TD}>{f.rfc}</td>
                  <td style={TD}>{mxn(f.total)}</td>
                  <td style={TD}>{f.verificationUrl ? <a href={f.verificationUrl} target="_blank" rel="noreferrer">Ver ↗</a> : "—"}</td>
                </tr>
              ))}
              {facturas.length === 0 && <tr><td colSpan={5} style={{ ...TD, textAlign: "center", color: "#94A3B8" }}>Sin facturas emitidas todavía.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReporteXPrize() {
  const [pagos, setPagos] = useState(null);
  const [gastos, setGastos] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [nuevoGasto, setNuevoGasto] = useState({ concepto: "", monto: "" });
  const [relatedParty, setRelatedParty] = useState("");
  const [rpGuardado, setRpGuardado] = useState(false);
  const [error, setError] = useState("");

  const cargar = async () => {
    try {
      const [pagosSnap, gastosSnap, tecSnap, rpSnap] = await Promise.all([
        getDocs(collection(db, "pagos")),
        getDocs(query(collection(db, "gastos"), orderBy("fecha", "desc"))),
        getDocs(collection(db, "tecnicos")),
        getDoc(doc(db, "config", "xprize")),
      ]);
      setPagos(pagosSnap.docs.map((d) => d.data()));
      setGastos(gastosSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setTecnicos(tecSnap.docs.map((d) => d.data()));
      if (rpSnap.exists()) setRelatedParty(rpSnap.data().ingresosPartesRelacionadas || "");
    } catch (e) { setError(e.message); }
  };
  useEffect(() => { cargar(); }, []);

  if (error) return <div style={{ ...CARD, color: "#991B1B" }}>Error: {error}</div>;
  if (!pagos || !gastos) return <p style={{ color: "#64748B" }}>Cargando reporte…</p>;

  // Últimos 6 meses, siempre vigente — no caduca como la versión anterior
  const meses = ultimosMeses(6);
  const aprobados = pagos.filter((p) => p.estado === "aprobado");
  const porMes = meses.map((m) => ({
    mes: m,
    label: labelMes(m),
    ingresos: aprobados.filter((p) => claveMes(p.fecha) === m).reduce((a, p) => a + (p.monto || 0), 0),
    gastos: gastos.filter((g) => claveMes(g.fecha) === m).reduce((a, g) => a + (parseFloat(g.monto) || 0), 0),
  }));
  const totalIngresos = porMes.reduce((a, m) => a + m.ingresos, 0);
  const totalGastos = gastos.reduce((a, g) => a + (parseFloat(g.monto) || 0), 0);
  const utilidad = totalIngresos - totalGastos;
  const usuariosAdquiridos = tecnicos.length;
  const usuariosPagando = tecnicos.filter((t) => t.plan === "pro").length;

  const agregarGasto = async () => {
    if (!nuevoGasto.concepto.trim()) return;
    const montoNum = parseFloat(nuevoGasto.monto);
    if (!(montoNum > 0)) return;
    try {
      await addDoc(collection(db, "gastos"), { concepto: nuevoGasto.concepto.trim(), monto: montoNum, fecha: serverTimestamp() });
      logAdmin(auth.currentUser?.email, "agregó gasto", "gastos", `${nuevoGasto.concepto} ${mxn(montoNum)}`);
      setNuevoGasto({ concepto: "", monto: "" });
      cargar();
    } catch (e) { setError(e.message); }
  };

  const borrarGasto = async (g) => {
    if (!window.confirm(`¿Borrar el gasto "${g.concepto}" (${mxn(g.monto)})?`)) return;
    await deleteDoc(doc(db, "gastos", g.id));
    logAdmin(auth.currentUser?.email, "borró gasto", "gastos", `${g.concepto} ${mxn(g.monto)}`);
    cargar();
  };

  const guardarRelatedParty = async () => {
    await setDoc(doc(db, "config", "xprize"), { ingresosPartesRelacionadas: relatedParty, actualizado: serverTimestamp() }, { merge: true });
    setRpGuardado(true);
    setTimeout(() => setRpGuardado(false), 2500);
  };

  const exportarReporte = () => exportarCSV("habilis_reporte_xprize", [
    { key: "label", label: "Mes" },
    { key: "ingresos", label: "Ingresos MXN" },
    { key: "gastos", label: "Gastos MXN" },
    { key: (m) => m.ingresos - m.gastos, label: "Utilidad MXN" },
    { key: (m) => (m.ingresos / USD_RATE).toFixed(2), label: "Ingresos USD" },
  ], porMes);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "linear-gradient(135deg,#0F172A,#1E293B)", color: "#fff", borderRadius: 14, padding: "14px 18px" }}>
        📸 Evidencia de ingresos y gastos para el jurado — últimos 6 meses, siempre al día.
      </div>

      <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Mes", "Ingresos", "Gastos", "Utilidad", `USD (≈${USD_RATE})`].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {porMes.map((m) => (
                <tr key={m.mes}>
                  <td style={TD}>{m.label}</td>
                  <td style={{ ...TD, fontVariantNumeric: "tabular-nums" }}>{mxn(m.ingresos)}</td>
                  <td style={{ ...TD, fontVariantNumeric: "tabular-nums" }}>{mxn(m.gastos)}</td>
                  <td style={{ ...TD, fontVariantNumeric: "tabular-nums", color: m.ingresos - m.gastos >= 0 ? "#059669" : "#DC2626", fontWeight: 700 }}>{mxn(m.ingresos - m.gastos)}</td>
                  <td style={{ ...TD, fontVariantNumeric: "tabular-nums" }}>${(m.ingresos / USD_RATE).toFixed(2)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 800 }}>
                <td style={TD}>Total</td>
                <td style={TD}>{mxn(totalIngresos)}</td>
                <td style={TD}>{mxn(totalGastos)}</td>
                <td style={{ ...TD, color: utilidad >= 0 ? "#059669" : "#DC2626" }}>{mxn(utilidad)}</td>
                <td style={TD}>${(totalIngresos / USD_RATE).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>USUARIOS ADQUIRIDOS</div><div style={{ fontSize: 22, fontWeight: 800 }}>{usuariosAdquiridos}</div></div>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>USUARIOS PAGANDO</div><div style={{ fontSize: 22, fontWeight: 800 }}>{usuariosPagando}</div></div>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>UTILIDAD NETA</div><div style={{ fontSize: 22, fontWeight: 800, color: utilidad >= 0 ? "#059669" : "#DC2626" }}>{mxn(utilidad)}</div></div>
      </div>

      <div style={CARD}>
        <strong style={{ fontSize: 13 }}>Ingresos de partes relacionadas (familia/amigos)</strong>
        <p style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 2 }}>El XPRIZE pide declarar si algún ingreso viene de alguien cercano a ti, para que no cuente como cliente real.</p>
        <textarea value={relatedParty} onChange={(e) => setRelatedParty(e.target.value)} placeholder="Ej: Ninguno de los pagos viene de familiares o amigos." style={{ ...inp, width: "100%", minHeight: 60, marginTop: 8, boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
          <button style={btnSm} onClick={guardarRelatedParty}>Guardar declaración</button>
          {rpGuardado && <span style={{ color: "#059669", fontSize: 12, fontWeight: 700 }}>✓ Guardado</span>}
        </div>
      </div>

      <div style={CARD}>
        <strong style={{ fontSize: 13 }}>Gastos del negocio</strong>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
          <tbody>
            {gastos.map((g) => (
              <tr key={g.id}>
                <td style={TD}>{g.concepto}</td>
                <td style={TD}>{fechaCorta(g.fecha)}</td>
                <td style={{ ...TD, fontVariantNumeric: "tabular-nums" }}>{mxn(g.monto)}</td>
                <td style={TD}><button style={btnSm} onClick={() => borrarGasto(g)}>🗑</button></td>
              </tr>
            ))}
            {gastos.length === 0 && <tr><td colSpan={4} style={{ ...TD, textAlign: "center", color: "#94A3B8" }}>Sin gastos registrados.</td></tr>}
          </tbody>
        </table>
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <input placeholder="Concepto (ej. Firebase)" value={nuevoGasto.concepto} onChange={(e) => setNuevoGasto((g) => ({ ...g, concepto: e.target.value }))} style={{ ...inp, flex: 1, minWidth: 160 }} />
          <input placeholder="Monto MXN" type="number" min="1" value={nuevoGasto.monto} onChange={(e) => setNuevoGasto((g) => ({ ...g, monto: e.target.value }))} style={{ ...inp, width: 120 }} />
          <button style={btnSm} onClick={agregarGasto}>➕ Agregar</button>
        </div>
      </div>

      <button style={{ ...btnSm, background: "#0F172A", color: "#fff", border: "none", alignSelf: "flex-start" }} onClick={exportarReporte}>⬇ Exportar reporte completo (CSV)</button>
    </div>
  );
}
