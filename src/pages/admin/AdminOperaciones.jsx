import { useEffect, useMemo, useState } from "react";
import { db, auth } from "../../lib/firebase.js";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { fechaCorta, exportarCSV, logAdmin } from "../../lib/erp.js";

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px" };
const TH = { textAlign: "left", padding: "10px 12px", color: "#64748B", fontWeight: 700, fontSize: 11, textTransform: "uppercase" };
const TD = { padding: "9px 12px", fontSize: 13, borderBottom: "1px solid #F1F5F9" };
const btnSm = { background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" };
const badge = (bg, fg) => ({ background: bg, color: fg, borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 700 });
const inp = { border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 10px", fontSize: 13 };

// Notificación al usuario cuando el admin interviene — el flujo de la IA sí
// notifica; el override manual no debe ser silencioso.
function notificar(userId, tipo, mensaje, link = "panel") {
  if (!userId) return Promise.resolve();
  return addDoc(collection(db, "notificaciones"), {
    userId, tipo, mensaje, leida: false, link, fecha: serverTimestamp(),
  }).catch(() => {});
}

export default function AdminOperaciones() {
  const [tab, setTab] = useState("trabajos");
  const [tecnicos, setTecnicos] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "tecnicos"))
      .then((s) => setTecnicos(s.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch(() => {});
  }, []);

  const nombres = useMemo(() => new Map(tecnicos.map((t) => [t.id, t.nombre || t.email || t.id])), [tecnicos]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {[["trabajos", "Trabajos"], ["solicitudes", "Solicitudes"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ ...btnSm, background: tab === id ? "#0F172A" : "#F1F5F9", color: tab === id ? "#fff" : "#0F172A" }}>{label}</button>
        ))}
      </div>
      {tab === "trabajos" ? <Trabajos nombres={nombres} /> : <Solicitudes nombres={nombres} tecnicos={tecnicos} />}
    </div>
  );
}

function Trabajos({ nombres }) {
  const [items, setItems] = useState(null);
  const [filtro, setFiltro] = useState("todos");
  const [busy, setBusy] = useState(null);
  const [abierto, setAbierto] = useState(null); // id expandido con fotos/descripcion
  const [error, setError] = useState("");

  const cargar = async () => {
    try {
      const snap = await getDocs(collection(db, "trabajos"));
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setItems(docs);
    } catch (e) { setError(e.message); }
  };
  useEffect(() => { cargar(); }, []);

  if (error) return <div style={{ ...CARD, color: "#991B1B" }}>Error: {error}</div>;
  if (!items) return <p style={{ color: "#64748B" }}>Cargando trabajos…</p>;

  const FILTROS = [
    { id: "todos",      label: `Todos (${items.length})` },
    { id: "aprobados",  label: `Aprobados (${items.filter((t) => t.aprobadoIA).length})` },
    { id: "marcados",   label: `Marcados (${items.filter((t) => t.aprobadoIA === false).length})` },
    { id: "sinrevisar", label: `Sin revisar (${items.filter((t) => !t.moderadoPorIA).length})` },
  ];
  const filtrados = filtro === "todos" ? items
    : items.filter((t) => (filtro === "aprobados" ? t.aprobadoIA : filtro === "marcados" ? t.aprobadoIA === false : !t.moderadoPorIA));

  const forzar = async (t, aprobadoIA) => {
    setBusy(t.id);
    try {
      await updateDoc(doc(db, "trabajos", t.id), { aprobadoIA, moderadoPorIA: true, razonModeracionIA: "Override manual del admin" });
      logAdmin(auth.currentUser?.email, aprobadoIA ? "forzó APROBAR trabajo" : "forzó MARCAR trabajo", `trabajos/${t.id}`, t.titulo || "");
      await notificar(t.tecnicoId, "moderacion", aprobadoIA
        ? `✅ Tu trabajo "${t.titulo}" fue aprobado por el equipo de Habilis`
        : `⚠️ Tu trabajo "${t.titulo}" fue marcado por el equipo de Habilis`);
      setItems((prev) => prev.map((x) => x.id === t.id ? { ...x, aprobadoIA, moderadoPorIA: true, razonModeracionIA: "Override manual del admin" } : x));
    } catch (e) { setError("Error: " + e.message); }
    finally { setBusy(null); }
  };

  const eliminar = async (t) => {
    if (!confirm(`¿Eliminar el trabajo "${t.titulo}" permanentemente?`)) return;
    setBusy(t.id);
    try {
      await deleteDoc(doc(db, "trabajos", t.id));
      logAdmin(auth.currentUser?.email, "ELIMINÓ trabajo", `trabajos/${t.id}`, t.titulo || "");
      setItems((prev) => prev.filter((x) => x.id !== t.id));
    } catch (e) { setError("Error: " + e.message); }
    finally { setBusy(null); }
  };

  const exportar = () => exportarCSV("habilis_trabajos", [
    { key: "titulo", label: "Título" },
    { key: (t) => nombres.get(t.tecnicoId) || t.tecnicoId, label: "Técnico" },
    { key: (t) => fechaCorta(t.createdAt), label: "Fecha" },
    { key: "estado", label: "Estado" },
    { key: "categoriaIA", label: "Categoría IA" },
    { key: "calidadIA", label: "Calidad IA" },
    { key: (t) => (!t.moderadoPorIA ? "sin revisar" : t.aprobadoIA ? "aprobado" : "marcado"), label: "Moderación" },
    { key: "razonModeracionIA", label: "Razón" },
  ], filtrados);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {FILTROS.map((f) => (
          <button key={f.id} onClick={() => setFiltro(f.id)}
            style={{ ...btnSm, background: filtro === f.id ? "#F97316" : "#F1F5F9", color: filtro === f.id ? "#fff" : "#0F172A" }}>
            {f.label}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <button style={btnSm} onClick={exportar}>⬇ CSV</button>
        <button style={btnSm} onClick={cargar}>↻</button>
      </div>

      <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Trabajo", "Técnico", "Fecha", "Calidad IA", "Moderación", "Acciones"].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {filtrados.map((t) => (
                <FilaTrabajo key={t.id} t={t} nombres={nombres} busy={busy === t.id}
                  abierto={abierto === t.id}
                  onToggle={() => setAbierto(abierto === t.id ? null : t.id)}
                  onAprobar={() => forzar(t, true)}
                  onMarcar={() => forzar(t, false)}
                  onEliminar={() => eliminar(t)} />
              ))}
              {filtrados.length === 0 && <tr><td colSpan={6} style={{ ...TD, textAlign: "center", color: "#94A3B8" }}>Sin resultados.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FilaTrabajo({ t, nombres, busy, abierto, onToggle, onAprobar, onMarcar, onEliminar }) {
  const evidencias = (t.evidencias || []).filter(Boolean);
  return (
    <>
      <tr>
        <td style={{ ...TD, cursor: "pointer", fontWeight: 600 }} onClick={onToggle}>
          {abierto ? "▾ " : "▸ "}{t.titulo || "Sin título"}
        </td>
        <td style={TD}>{nombres.get(t.tecnicoId) || (t.tecnicoId || "—").slice(0, 8)}</td>
        <td style={TD}>{fechaCorta(t.createdAt)}</td>
        <td style={TD}>{t.calidadIA != null ? `${t.calidadIA}/10` : "—"}</td>
        <td style={TD}>
          {!t.moderadoPorIA ? <span style={badge("#F1F5F9", "#64748B")}>sin revisar</span>
            : t.aprobadoIA ? <span style={badge("#DCFCE7", "#166534")}>aprobado</span>
            : <span style={badge("#FEF3C7", "#92400E")}>marcado</span>}
        </td>
        <td style={{ ...TD, whiteSpace: "nowrap" }}>
          <button disabled={busy} style={btnSm} onClick={onAprobar}>✅ Aprobar</button>{" "}
          <button disabled={busy} style={btnSm} onClick={onMarcar}>⚠️ Marcar</button>{" "}
          <button disabled={busy} style={{ ...btnSm, color: "#991B1B" }} onClick={onEliminar}>🗑</button>
        </td>
      </tr>
      {abierto && (
        <tr>
          <td colSpan={6} style={{ ...TD, background: "#F8FAFC" }}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ flex: "1 1 280px", minWidth: 0 }}>
                {t.descripcion && <p style={{ fontSize: 13, marginBottom: 6 }}><b>Descripción:</b> {t.descripcion}</p>}
                {t.problema && <p style={{ fontSize: 13, marginBottom: 6 }}><b>Problema:</b> {t.problema}</p>}
                {t.solucion && <p style={{ fontSize: 13, marginBottom: 6 }}><b>Solución:</b> {t.solucion}</p>}
                {t.razonModeracionIA && <p style={{ fontSize: 12.5, color: "#92400E" }}><b>Razón IA:</b> {t.razonModeracionIA}</p>}
                {t.categoriaIA && <p style={{ fontSize: 12.5, color: "#64748B" }}><b>Categoría IA:</b> {t.categoriaIA} · <b>Urgencia:</b> {t.urgenciaIA || "—"}</p>}
              </div>
              {evidencias.length > 0 ? (
                <div style={{ display: "flex", gap: 8 }}>
                  {evidencias.map((src, i) => (
                    <img key={i} src={src} alt={`Evidencia ${i + 1}`}
                      style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 10, border: "1px solid #E2E8F0" }} />
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: 12, color: "#94A3B8" }}>Sin fotos de evidencia.</span>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Solicitudes({ nombres, tecnicos }) {
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState(null);
  const [filtro, setFiltro] = useState("todas");
  const [asignando, setAsignando] = useState(null); // id de solicitud en modo reasignar
  const [nuevoTec, setNuevoTec] = useState("");
  const [error, setError] = useState("");

  const cargar = async () => {
    try {
      const snap = await getDocs(collection(db, "solicitudes"));
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)));
    } catch (e) { setError(e.message); }
  };
  useEffect(() => { cargar(); }, []);

  if (error) return <div style={{ ...CARD, color: "#991B1B" }}>Error: {error}</div>;
  if (!items) return <p style={{ color: "#64748B" }}>Cargando solicitudes…</p>;

  const FILTROS = [
    { id: "todas",       label: `Todas (${items.length})` },
    { id: "abierta",     label: `Abiertas (${items.filter((s) => s.estado === "abierta").length})` },
    { id: "completada",  label: `Completadas (${items.filter((s) => s.estado === "completada").length})` },
  ];
  const filtradas = filtro === "todas" ? items : items.filter((s) => s.estado === filtro);

  const setEstado = async (s, estado) => {
    setBusy(s.id);
    try {
      await updateDoc(doc(db, "solicitudes", s.id), { estado });
      logAdmin(auth.currentUser?.email, `cambió solicitud a "${estado}"`, `solicitudes/${s.id}`, s.titulo || "");
      setItems((prev) => prev.map((x) => (x.id === s.id ? { ...x, estado } : x)));
    } catch (e) { setError("Error: " + e.message); }
    finally { setBusy(null); }
  };

  const eliminar = async (s) => {
    if (!confirm(`¿Eliminar la solicitud "${s.titulo || s.descripcion || s.id}"?`)) return;
    setBusy(s.id);
    try {
      await deleteDoc(doc(db, "solicitudes", s.id));
      logAdmin(auth.currentUser?.email, "ELIMINÓ solicitud (spam)", `solicitudes/${s.id}`, s.titulo || "");
      setItems((prev) => prev.filter((x) => x.id !== s.id));
    } catch (e) { setError("Error: " + e.message); }
    finally { setBusy(null); }
  };

  const reasignar = async (s) => {
    if (!nuevoTec) return;
    setBusy(s.id);
    try {
      const asignados = [...new Set([...(s.tecnicosAsignadosIA || []), nuevoTec])];
      await updateDoc(doc(db, "solicitudes", s.id), { tecnicosAsignadosIA: asignados, asignadoPorIA: true });
      await notificar(nuevoTec, "solicitud",
        `🎯 Nueva solicitud asignada por el equipo de Habilis: "${(s.titulo || s.descripcion || "").slice(0, 60)}"`, "feed");
      logAdmin(auth.currentUser?.email, "asignó técnico manualmente", `solicitudes/${s.id}`, nombres.get(nuevoTec) || nuevoTec);
      setItems((prev) => prev.map((x) => (x.id === s.id ? { ...x, tecnicosAsignadosIA: asignados } : x)));
      setAsignando(null); setNuevoTec("");
    } catch (e) { setError("Error: " + e.message); }
    finally { setBusy(null); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {FILTROS.map((f) => (
          <button key={f.id} onClick={() => setFiltro(f.id)}
            style={{ ...btnSm, background: filtro === f.id ? "#F97316" : "#F1F5F9", color: filtro === f.id ? "#fff" : "#0F172A" }}>
            {f.label}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <button style={btnSm} onClick={cargar}>↻</button>
      </div>

      <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Servicio", "Ciudad", "Fecha", "Asignados", "Estado", "Origen", "Acciones"].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {filtradas.map((s) => (
                <tr key={s.id}>
                  <td style={TD}>{s.titulo || s.descripcion}</td>
                  <td style={TD}>{s.ciudad || "—"}</td>
                  <td style={TD}>{fechaCorta(s.createdAt)}</td>
                  <td style={TD}>
                    {(s.tecnicosAsignadosIA || []).length === 0 ? "—" :
                      (s.tecnicosAsignadosIA || []).map((id) => nombres.get(id) || id.slice(0, 8)).join(", ")}
                    {asignando === s.id ? (
                      <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                        <select value={nuevoTec} onChange={(e) => setNuevoTec(e.target.value)} style={{ ...inp, fontSize: 12 }}>
                          <option value="">— técnico —</option>
                          {tecnicos.filter((t) => !t.suspendido).map((t) => <option key={t.id} value={t.id}>{t.nombre} ({t.ciudad || "?"})</option>)}
                        </select>
                        <button disabled={busy === s.id || !nuevoTec} style={btnSm} onClick={() => reasignar(s)}>OK</button>
                        <button style={btnSm} onClick={() => { setAsignando(null); setNuevoTec(""); }}>✕</button>
                      </div>
                    ) : (
                      <button style={{ ...btnSm, marginLeft: 6, padding: "2px 8px" }} onClick={() => setAsignando(s.id)}>+ asignar</button>
                    )}
                  </td>
                  <td style={TD}>
                    <span style={badge(s.estado === "abierta" ? "#DBEAFE" : "#DCFCE7", s.estado === "abierta" ? "#1D4ED8" : "#166534")}>{s.estado}</span>
                    {s.urgenciaIA && <span style={{ ...badge("#F1F5F9", "#64748B"), marginLeft: 4 }}>urgencia {s.urgenciaIA}</span>}
                  </td>
                  <td style={TD}>{s.creadaPorIA ? <span style={badge("#FFEDD5", "#C2410C")}>🤖 IA</span> : "Cliente"}</td>
                  <td style={{ ...TD, whiteSpace: "nowrap" }}>
                    {s.estado === "abierta"
                      ? <button disabled={busy === s.id} style={btnSm} onClick={() => setEstado(s, "completada")}>✅ Completada</button>
                      : <button disabled={busy === s.id} style={btnSm} onClick={() => setEstado(s, "abierta")}>↩ Reabrir</button>}{" "}
                    <button disabled={busy === s.id} style={{ ...btnSm, color: "#991B1B" }} onClick={() => eliminar(s)}>🗑 Spam</button>
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && <tr><td colSpan={7} style={{ ...TD, textAlign: "center", color: "#94A3B8" }}>Sin solicitudes.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
