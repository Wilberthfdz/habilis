import { useEffect, useMemo, useState } from "react";
import { db } from "../../lib/firebase.js";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px" };
const TH = { textAlign: "left", padding: "10px 12px", color: "#64748B", fontWeight: 700, fontSize: 11, textTransform: "uppercase" };
const TD = { padding: "9px 12px", fontSize: 13, borderBottom: "1px solid #F1F5F9" };
const btnSm = { background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" };
const inp = { border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 10px", fontSize: 13 };
const USD_RATE = 18.5;
const MESES_XPRIZE = ["2026-05", "2026-06", "2026-07", "2026-08"];
const MES_LABEL = { "2026-05": "Mayo", "2026-06": "Junio", "2026-07": "Julio", "2026-08": "Agosto" };

function mesDe(ts) {
  const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null;
  if (!d) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

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
  const [error, setError] = useState("");

  const cargar = async () => {
    try {
      const [pagosSnap, tecSnap] = await Promise.all([
        getDocs(query(collection(db, "pagos"), orderBy("fecha", "desc"))),
        getDocs(collection(db, "tecnicos")),
      ]);
      setPagos(pagosSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setTecnicos(tecSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) { setError(e.message); }
  };
  useEffect(() => { cargar(); }, []);

  if (error) return <div style={{ ...CARD, color: "#991B1B" }}>Error: {error}</div>;
  if (!pagos) return <p style={{ color: "#64748B" }}>Cargando pagos…</p>;

  const nombreDe = (uid) => tecnicos.find((t) => t.id === uid)?.nombre || uid;
  const hoy = new Date();
  const esteMes = pagos.filter((p) => mesDe(p.fecha) === mesDe(hoy)).reduce((a, p) => a + (p.monto || 0), 0);
  const total = pagos.reduce((a, p) => a + (p.monto || 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>ESTE MES</div><div style={{ fontSize: 22, fontWeight: 800 }}>${esteMes} MXN</div></div>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>TOTAL HISTÓRICO</div><div style={{ fontSize: 22, fontWeight: 800 }}>${total} MXN</div></div>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}># PAGOS</div><div style={{ fontSize: 22, fontWeight: 800 }}>{pagos.length}</div></div>
      </div>
      <button style={{ ...btnSm, background: "#F97316", color: "#fff", border: "none", alignSelf: "flex-start" }} onClick={() => setShowForm((s) => !s)}>
        {showForm ? "Cancelar" : "➕ Registrar pago manual"}
      </button>
      {showForm && <FormPagoManual tecnicos={tecnicos} onDone={() => { setShowForm(false); cargar(); }} />}
      <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Fecha", "Usuario", "Monto", "Método", "Estado", "Concepto"].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {pagos.map((p) => (
                <tr key={p.id}>
                  <td style={TD}>{p.fecha?.toDate ? p.fecha.toDate().toLocaleDateString("es-MX") : "—"}</td>
                  <td style={TD}>{nombreDe(p.userId)}</td>
                  <td style={TD}>${p.monto} MXN</td>
                  <td style={TD}>{p.metodo}</td>
                  <td style={TD}>{p.estado}</td>
                  <td style={TD}>{p.concepto}</td>
                </tr>
              ))}
              {pagos.length === 0 && <tr><td colSpan={6} style={{ ...TD, textAlign: "center", color: "#94A3B8" }}>Sin pagos registrados todavía.</td></tr>}
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
    setSaving(true); setErr("");
    try {
      await addDoc(collection(db, "pagos"), {
        userId: uid, monto: parseFloat(monto) || 0, metodo, estado: "aprobado", concepto,
        fecha: serverTimestamp(), registradoManualmente: true,
      });
      await updateDoc(doc(db, "tecnicos", uid), { plan: "pro" });
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
        <input placeholder="Monto MXN" type="number" value={monto} onChange={(e) => setMonto(e.target.value)} style={inp} />
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
  useEffect(() => { getDocs(collection(db, "facturas")).then((s) => setFacturas(s.docs.map((d) => ({ id: d.id, ...d.data() })))); }, []);
  if (!facturas) return <p style={{ color: "#64748B" }}>Cargando facturas…</p>;
  return (
    <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#F8FAFC" }}>{["Fecha", "Usuario", "RFC", "Total", "Verificación"].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {facturas.map((f) => (
              <tr key={f.id}>
                <td style={TD}>{f.fecha?.toDate ? f.fecha.toDate().toLocaleDateString("es-MX") : "—"}</td>
                <td style={TD}>{f.userId}</td>
                <td style={TD}>{f.rfc}</td>
                <td style={TD}>${f.total} MXN</td>
                <td style={TD}>{f.verificationUrl ? <a href={f.verificationUrl} target="_blank" rel="noreferrer">Ver ↗</a> : "—"}</td>
              </tr>
            ))}
            {facturas.length === 0 && <tr><td colSpan={5} style={{ ...TD, textAlign: "center", color: "#94A3B8" }}>Sin facturas emitidas todavía (requiere Facturapi desplegado).</td></tr>}
          </tbody>
        </table>
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

  const cargar = async () => {
    const [pagosSnap, gastosSnap, tecSnap] = await Promise.all([
      getDocs(collection(db, "pagos")),
      getDocs(collection(db, "gastos")),
      getDocs(collection(db, "tecnicos")),
    ]);
    setPagos(pagosSnap.docs.map((d) => d.data()));
    setGastos(gastosSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setTecnicos(tecSnap.docs.map((d) => d.data()));
  };
  useEffect(() => { cargar(); }, []);

  if (!pagos || !gastos) return <p style={{ color: "#64748B" }}>Cargando reporte…</p>;

  const porMes = MESES_XPRIZE.map((m) => ({
    mes: m,
    label: MES_LABEL[m],
    mxn: pagos.filter((p) => mesDe(p.fecha) === m).reduce((a, p) => a + (p.monto || 0), 0),
  }));
  const totalMxn = porMes.reduce((a, m) => a + m.mxn, 0);
  const totalGastos = gastos.reduce((a, g) => a + (parseFloat(g.monto) || 0), 0);
  const usuariosAdquiridos = tecnicos.length;
  const usuariosPagando = tecnicos.filter((t) => t.plan === "pro").length;

  const agregarGasto = async () => {
    if (!nuevoGasto.concepto.trim() || !nuevoGasto.monto) return;
    await addDoc(collection(db, "gastos"), { concepto: nuevoGasto.concepto.trim(), monto: parseFloat(nuevoGasto.monto) || 0, fecha: serverTimestamp() });
    setNuevoGasto({ concepto: "", monto: "" });
    cargar();
  };
  const borrarGasto = async (id) => { await deleteDoc(doc(db, "gastos", id)); cargar(); };

  const exportarCSV = () => {
    const rows = [["fecha", "usuario", "monto", "metodo", "estado", "concepto"]];
    pagos.forEach((p) => rows.push([mesDe(p.fecha) || "", p.userId || "", p.monto || 0, p.metodo || "", p.estado || "", p.concepto || ""]));
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "habilis_pagos.csv";
    a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "linear-gradient(135deg,#0F172A,#1E293B)", color: "#fff", borderRadius: 14, padding: "14px 18px" }}>
        📸 Este reporte es tu evidencia de ingresos y gastos para Devpost (mes a mes, may-ago 2026).
      </div>

      <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#F8FAFC" }}>{["Mes", "MXN", "USD (≈18.5)"].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {porMes.map((m) => (
              <tr key={m.mes}><td style={TD}>{m.label} 2026</td><td style={TD}>${m.mxn.toLocaleString()}</td><td style={TD}>${(m.mxn / USD_RATE).toFixed(2)}</td></tr>
            ))}
            <tr style={{ fontWeight: 800 }}><td style={TD}>Total</td><td style={TD}>${totalMxn.toLocaleString()}</td><td style={TD}>${(totalMxn / USD_RATE).toFixed(2)}</td></tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>USUARIOS ADQUIRIDOS</div><div style={{ fontSize: 22, fontWeight: 800 }}>{usuariosAdquiridos}</div></div>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>USUARIOS PAGANDO</div><div style={{ fontSize: 22, fontWeight: 800 }}>{usuariosPagando}</div></div>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>GASTOS TOTALES</div><div style={{ fontSize: 22, fontWeight: 800 }}>${totalGastos.toLocaleString()} MXN</div></div>
      </div>

      <div style={CARD}>
        <strong style={{ fontSize: 13 }}>Ingresos de partes relacionadas (familia/amigos)</strong>
        <p style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 2 }}>El XPRIZE pide declarar si algún ingreso viene de alguien cercano a ti, para que no cuente como cliente real.</p>
        <textarea value={relatedParty} onChange={(e) => setRelatedParty(e.target.value)} placeholder="Ej: Ninguno de los pagos viene de familiares o amigos." style={{ ...inp, width: "100%", minHeight: 60, marginTop: 8 }} />
      </div>

      <div style={CARD}>
        <strong style={{ fontSize: 13 }}>Gastos del negocio</strong>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
          <tbody>
            {gastos.map((g) => (
              <tr key={g.id}>
                <td style={TD}>{g.concepto}</td>
                <td style={TD}>${g.monto} MXN</td>
                <td style={TD}><button style={btnSm} onClick={() => borrarGasto(g.id)}>🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input placeholder="Concepto (ej. Firebase)" value={nuevoGasto.concepto} onChange={(e) => setNuevoGasto((g) => ({ ...g, concepto: e.target.value }))} style={{ ...inp, flex: 1 }} />
          <input placeholder="Monto MXN" type="number" value={nuevoGasto.monto} onChange={(e) => setNuevoGasto((g) => ({ ...g, monto: e.target.value }))} style={{ ...inp, width: 120 }} />
          <button style={btnSm} onClick={agregarGasto}>➕ Agregar</button>
        </div>
      </div>

      <button style={{ ...btnSm, background: "#0F172A", color: "#fff", border: "none", alignSelf: "flex-start" }} onClick={exportarCSV}>⬇ Exportar CSV de pagos</button>
    </div>
  );
}
