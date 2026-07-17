import { useEffect, useState } from "react";
import { db } from "../../lib/firebase.js";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px" };
const TH = { textAlign: "left", padding: "10px 12px", color: "#64748B", fontWeight: 700, fontSize: 11, textTransform: "uppercase" };
const TD = { padding: "9px 12px", fontSize: 13, borderBottom: "1px solid #F1F5F9" };
const btnSm = { background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" };
const badge = (bg, fg) => ({ background: bg, color: fg, borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 700 });

export default function AdminOperaciones() {
  const [tab, setTab] = useState("trabajos");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {[["trabajos", "Trabajos"], ["solicitudes", "Solicitudes"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ ...btnSm, background: tab === id ? "#0F172A" : "#F1F5F9", color: tab === id ? "#fff" : "#0F172A" }}>{label}</button>
        ))}
      </div>
      {tab === "trabajos" ? <Trabajos /> : <Solicitudes />}
    </div>
  );
}

function Trabajos() {
  const [items, setItems] = useState(null);
  const [filtro, setFiltro] = useState("todos");
  const [busy, setBusy] = useState(null);

  const cargar = async () => {
    const snap = await getDocs(collection(db, "trabajos"));
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };
  useEffect(() => { cargar(); }, []);
  if (!items) return <p style={{ color: "#64748B" }}>Cargando trabajos…</p>;

  const filtrados = filtro === "todos" ? items : items.filter((t) => (filtro === "aprobados" ? t.aprobadoIA : filtro === "marcados" ? t.aprobadoIA === false : !t.moderadoPorIA));

  const forzar = async (id, aprobadoIA) => {
    setBusy(id);
    try { await updateDoc(doc(db, "trabajos", id), { aprobadoIA, moderadoPorIA: true, razonModeracionIA: "Override manual del admin" }); await cargar(); }
    finally { setBusy(null); }
  };
  const eliminar = async (id) => {
    if (!confirm("¿Eliminar este trabajo permanentemente?")) return;
    setBusy(id);
    try { await deleteDoc(doc(db, "trabajos", id)); await cargar(); }
    finally { setBusy(null); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {["todos", "aprobados", "marcados", "sin revisar"].map((f) => (
          <button key={f} onClick={() => setFiltro(f === "sin revisar" ? "sinrevisar" : f)} style={{ ...btnSm, background: filtro === f ? "#F97316" : "#F1F5F9", color: filtro === f ? "#fff" : "#0F172A" }}>{f}</button>
        ))}
      </div>
      <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Título", "Técnico", "Tipo", "Categoría IA", "Calidad IA", "Estado", "Razón IA", "Acciones"].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {filtrados.map((t) => (
                <tr key={t.id}>
                  <td style={TD}>{t.titulo}</td>
                  <td style={TD} title={t.tecnicoId}>{(t.tecnicoId || "").slice(0, 8)}…</td>
                  <td style={TD}>{t.tipo}</td>
                  <td style={TD}>{t.categoriaIA || "—"}</td>
                  <td style={TD}>{t.calidadIA ?? "—"}/10</td>
                  <td style={TD}>
                    {!t.moderadoPorIA ? <span style={badge("#F1F5F9", "#64748B")}>sin revisar</span>
                      : t.aprobadoIA ? <span style={badge("#DCFCE7", "#166534")}>aprobado</span>
                      : <span style={badge("#FEF3C7", "#92400E")}>marcado</span>}
                  </td>
                  <td style={TD}>{t.razonModeracionIA || "—"}</td>
                  <td style={{ ...TD, whiteSpace: "nowrap" }}>
                    <button disabled={busy === t.id} style={btnSm} onClick={() => forzar(t.id, true)}>✅ Forzar aprobar</button>{" "}
                    <button disabled={busy === t.id} style={btnSm} onClick={() => forzar(t.id, false)}>⚠️ Forzar marcar</button>{" "}
                    <button disabled={busy === t.id} style={{ ...btnSm, color: "#991B1B" }} onClick={() => eliminar(t.id)}>🗑</button>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && <tr><td colSpan={8} style={{ ...TD, textAlign: "center", color: "#94A3B8" }}>Sin resultados.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Solicitudes() {
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState(null);

  const cargar = async () => {
    const snap = await getDocs(collection(db, "solicitudes"));
    setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };
  useEffect(() => { cargar(); }, []);
  if (!items) return <p style={{ color: "#64748B" }}>Cargando solicitudes…</p>;

  const marcarCompletada = async (id) => { setBusy(id); try { await updateDoc(doc(db, "solicitudes", id), { estado: "completada" }); await cargar(); } finally { setBusy(null); } };
  const eliminar = async (id) => { if (!confirm("¿Eliminar esta solicitud?")) return; setBusy(id); try { await deleteDoc(doc(db, "solicitudes", id)); await cargar(); } finally { setBusy(null); } };

  return (
    <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#F8FAFC" }}>{["Servicio", "Ciudad", "Urgencia IA", "Técnicos asignados IA", "Estado", "Creada por IA", "Acciones"].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id}>
                <td style={TD}>{s.titulo || s.descripcion}</td>
                <td style={TD}>{s.ciudad || "—"}</td>
                <td style={TD}>{s.urgenciaIA || "—"}</td>
                <td style={TD}>{(s.tecnicosAsignadosIA || []).length}</td>
                <td style={TD}>{s.estado}</td>
                <td style={TD}>{s.creadaPorIA ? <span style={badge("#FFEDD5", "#C2410C")}>🤖 IA</span> : "—"}</td>
                <td style={{ ...TD, whiteSpace: "nowrap" }}>
                  <button disabled={busy === s.id} style={btnSm} onClick={() => marcarCompletada(s.id)}>✅ Completada</button>{" "}
                  <button disabled={busy === s.id} style={{ ...btnSm, color: "#991B1B" }} onClick={() => eliminar(s.id)}>🗑 Spam</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={7} style={{ ...TD, textAlign: "center", color: "#94A3B8" }}>Sin solicitudes todavía.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
