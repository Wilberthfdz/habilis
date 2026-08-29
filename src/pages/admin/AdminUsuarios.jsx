import { useEffect, useMemo, useState } from "react";
import { db, auth } from "../../lib/firebase.js";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, query, where, limit } from "firebase/firestore";
import { mxn, fechaCorta, exportarCSV, logAdmin } from "../../lib/erp.js";
import { TAXONOMIA } from "../../lib/taxonomia.js";

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px" };
const TH = { textAlign: "left", padding: "10px 12px", color: "#64748B", fontWeight: 700, fontSize: 11, textTransform: "uppercase" };
const TD = { padding: "9px 12px", fontSize: 13, borderBottom: "1px solid #F1F5F9" };
const badge = (bg, fg) => ({ background: bg, color: fg, borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 700 });
const btnSm = { background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" };
const inp = { border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 10px", fontSize: 13 };

export default function AdminUsuarios() {
  const [tecnicos, setTecnicos] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const [q, setQ] = useState("");
  const [filtroPlan, setFiltroPlan] = useState("todos");
  const [filtroVerif, setFiltroVerif] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [sort, setSort] = useState("fecha");
  const [showNuevo, setShowNuevo] = useState(false);
  const [ficha, setFicha] = useState(null); // técnico abierto en detalle

  const cargar = async () => {
    try {
      const snap = await getDocs(collection(db, "tecnicos"));
      setTecnicos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { cargar(); }, []);

  const filtrados = useMemo(() => {
    if (!tecnicos) return [];
    let list = tecnicos.filter((t) => {
      const s = q.trim().toLowerCase();
      const matchQ = !s || [t.nombre, t.email, t.oficio, t.ciudad].some((v) => (v || "").toLowerCase().includes(s));
      const matchPlan = filtroPlan === "todos" || t.plan === filtroPlan;
      const matchVerif = filtroVerif === "todos" || (filtroVerif === "si" ? t.verificado : !t.verificado);
      const matchEstado = filtroEstado === "todos" || (filtroEstado === "suspendidos" ? t.suspendido : !t.suspendido);
      return matchQ && matchPlan && matchVerif && matchEstado;
    });
    list.sort((a, b) => {
      if (sort === "rankScore") return (b.rankScore || 0) - (a.rankScore || 0);
      if (sort === "trabajos") return (b.totalTrabajos || 0) - (a.totalTrabajos || 0);
      return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
    });
    return list;
  }, [tecnicos, q, filtroPlan, filtroVerif, filtroEstado, sort]);

  // Actualiza el doc y refleja el cambio en memoria sin recargar toda la colección
  const accion = async (t, cambios, descripcion) => {
    setBusy(t.id);
    try {
      await updateDoc(doc(db, "tecnicos", t.id), cambios);
      logAdmin(auth.currentUser?.email, descripcion, `tecnicos/${t.id}`, t.nombre || t.email || "");
      setTecnicos((prev) => prev.map((x) => (x.id === t.id ? { ...x, ...cambios } : x)));
      setFicha((f) => (f && f.id === t.id ? { ...f, ...cambios } : f));
    } catch (e) { setError("Error: " + e.message); }
    finally { setBusy(null); }
  };

  const togglePlan = (t) => accion(t, { plan: t.plan === "pro" ? "gratis" : "pro" }, t.plan === "pro" ? "quitó Pro" : "activó Pro (sin pago)");
  // Override manual (sin revisar documentos) — para onboarding en persona.
  // La vía normal con evidencia (INE/comprobante) es la pestaña Verificaciones.
  const toggleVerificado = (t) => accion(t, { verificado: !t.verificado }, t.verificado ? "desverificó (manual)" : "verificó (manual, sin documentos)");
  const toggleSuspendido = (t) => accion(t, { suspendido: !t.suspendido, disponible: !!t.suspendido }, t.suspendido ? "reactivó" : "suspendió");

  const eliminar = async (t) => {
    if (!confirm(`¿Eliminar permanentemente a "${t.nombre}"? Esta acción no se puede deshacer.`)) return;
    if (!confirm("Confirma de nuevo: se borrará el perfil completo.")) return;
    setBusy(t.id);
    try {
      // Sin esto, los trabajos del técnico quedaban huérfanos en el Feed
      // público (visible para todos) apuntando a un tecnicoId que ya no
      // existe — el clic terminaba en "perfil no encontrado".
      const trabajosSnap = await getDocs(query(collection(db, "trabajos"), where("tecnicoId", "==", t.id)));
      await Promise.all(trabajosSnap.docs.map((d) => deleteDoc(d.ref)));
      await deleteDoc(doc(db, "tecnicos", t.id));
      logAdmin(auth.currentUser?.email, "ELIMINÓ técnico", `tecnicos/${t.id}`,
        `${t.nombre || t.email || ""} (${trabajosSnap.size} trabajos borrados)`);
      setTecnicos((prev) => prev.filter((x) => x.id !== t.id));
      setFicha(null);
    } catch (e) { setError("Error: " + e.message); }
    finally { setBusy(null); }
  };

  const exportar = () => exportarCSV("habilis_tecnicos", [
    { key: "nombre", label: "Nombre" },
    { key: "email", label: "Email" },
    { key: "oficio", label: "Oficio" },
    { key: "ciudad", label: "Ciudad" },
    { key: "plan", label: "Plan" },
    { key: (t) => (t.verificado ? "sí" : "no"), label: "Verificado" },
    { key: (t) => (t.suspendido ? "sí" : "no"), label: "Suspendido" },
    { key: "rankScore", label: "Rank" },
    { key: "totalTrabajos", label: "Trabajos" },
    { key: (t) => fechaCorta(t.createdAt), label: "Registro" },
  ], filtrados);

  if (error && !tecnicos) return <div style={{ ...CARD, color: "#991B1B" }}>Error: {error}</div>;
  if (!tecnicos) return <p style={{ color: "#64748B" }}>Cargando usuarios…</p>;

  // KPIs sobre lo FILTRADO (acompañan a la vista actual) + total global de referencia
  const stats = {
    visibles: filtrados.length,
    total: tecnicos.length,
    pros: filtrados.filter((t) => t.plan === "pro").length,
    verificados: filtrados.filter((t) => t.verificado).length,
    suspendidos: filtrados.filter((t) => t.suspendido).length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {error && <div style={{ ...CARD, color: "#991B1B" }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: 10 }}>
        {[["En vista", `${stats.visibles} / ${stats.total}`], ["Pro", stats.pros], ["Verificados", stats.verificados], ["Suspendidos", stats.suspendidos]].map(([l, v]) => (
          <div key={l} style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>{l}</div><div style={{ fontSize: 22, fontWeight: 800 }}>{v}</div></div>
        ))}
      </div>

      <div style={{ ...CARD, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input placeholder="Buscar nombre, email, oficio, ciudad…" value={q} onChange={(e) => setQ(e.target.value)}
          style={{ ...inp, flex: 1, minWidth: 200 }} />
        <select value={filtroPlan} onChange={(e) => setFiltroPlan(e.target.value)} style={inp}>
          <option value="todos">Plan: todos</option><option value="gratis">Gratis</option><option value="pro">Pro</option>
        </select>
        <select value={filtroVerif} onChange={(e) => setFiltroVerif(e.target.value)} style={inp}>
          <option value="todos">Verificado: todos</option><option value="si">Sí</option><option value="no">No</option>
        </select>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} style={inp}>
          <option value="todos">Estado: todos</option><option value="activos">Activos</option><option value="suspendidos">Suspendidos</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={inp}>
          <option value="fecha">Ordenar: más recientes</option><option value="rankScore">Ranking</option><option value="trabajos">Trabajos</option>
        </select>
        <button style={btnSm} onClick={exportar}>⬇ CSV</button>
        <button style={btnSm} onClick={cargar}>↻</button>
        <button style={{ ...btnSm, background: "#F97316", color: "#fff", border: "none" }} onClick={() => setShowNuevo(true)}>➕ Crear usuario</button>
      </div>

      {showNuevo && <NuevoUsuario onClose={() => setShowNuevo(false)} onCreated={() => { setShowNuevo(false); cargar(); }} />}
      {ficha && (
        <FichaTecnico tecnico={ficha} busy={busy === ficha.id}
          onClose={() => setFicha(null)}
          onGuardar={(cambios) => accion(ficha, { ...cambios, updatedAt: serverTimestamp() }, "editó perfil")}
          onTogglePlan={() => togglePlan(ficha)}
          onToggleVerif={() => toggleVerificado(ficha)}
          onToggleSusp={() => toggleSuspendido(ficha)}
          onEliminar={() => eliminar(ficha)} />
      )}

      <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>
              {["Nombre", "Oficio", "Ciudad", "Plan", "Estado", "Rank", "Trabajos", "Acciones"].map((h) => <th key={h} style={TH}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtrados.map((t) => (
                <tr key={t.id}>
                  <td style={{ ...TD, cursor: "pointer", fontWeight: 600 }} onClick={() => setFicha(t)}>
                    {t.nombre || "—"}
                    <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 400 }}>{t.email || ""}</div>
                  </td>
                  <td style={TD}>{t.oficio || "—"}</td>
                  <td style={TD}>{t.ciudad || "—"}</td>
                  <td style={TD}><span style={badge(t.plan === "empresa" ? "#DBEAFE" : t.plan === "pro" ? "#FFEDD5" : "#F1F5F9", t.plan === "empresa" ? "#1D4ED8" : t.plan === "pro" ? "#C2410C" : "#64748B")}>{t.plan === "empresa" ? "Empresa" : t.plan === "pro" ? "Pro" : "Gratis"}</span></td>
                  <td style={TD}>
                    {t.suspendido
                      ? <span style={badge("#FEE2E2", "#B91C1C")}>Suspendido</span>
                      : t.verificado
                        ? <span style={badge("#DCFCE7", "#15803D")}>Verificado</span>
                        : <span style={badge("#F1F5F9", "#64748B")}>Activo</span>}
                  </td>
                  <td style={TD}>{t.rankScore ?? "—"}</td>
                  <td style={TD}>{t.totalTrabajos || 0}</td>
                  <td style={{ ...TD, whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button disabled={busy === t.id} style={btnSm} onClick={() => setFicha(t)}>Ver ficha</button>
                      <button disabled={busy === t.id} style={btnSm} onClick={() => toggleVerificado(t)}>{t.verificado ? "Desverificar" : "Verificar (manual)"}</button>
                      <button disabled={busy === t.id} style={btnSm} onClick={() => toggleSuspendido(t)}>{t.suspendido ? "Reactivar" : "Suspender"}</button>
                    </div>
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

// ── Ficha completa del técnico: edición + historial ────────────────────────
function FichaTecnico({ tecnico, busy, onClose, onGuardar, onTogglePlan, onToggleVerif, onToggleSusp, onEliminar }) {
  const [form, setForm] = useState({
    nombre: tecnico.nombre || "", oficio: tecnico.oficio || "", ciudad: tecnico.ciudad || "",
    experiencia: tecnico.experiencia || 0, bio: tecnico.bio || "",
  });
  const [historial, setHistorial] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    Promise.all([
      getDocs(query(collection(db, "trabajos"), where("tecnicoId", "==", tecnico.id), limit(25))),
      getDocs(query(collection(db, "pagos"), where("userId", "==", tecnico.id), limit(25))),
    ]).then(([tSnap, pSnap]) => {
      setHistorial({
        trabajos: tSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)),
        pagos: pSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.fecha?.toMillis?.() || 0) - (a.fecha?.toMillis?.() || 0)),
      });
    }).catch(() => setHistorial({ trabajos: [], pagos: [] }));
  }, [tecnico.id]);

  const guardar = () => onGuardar({
    nombre: form.nombre.trim(), oficio: form.oficio.trim(), ciudad: form.ciudad.trim(),
    experiencia: parseInt(form.experiencia) || 0, bio: form.bio.trim(),
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 400,
                  display: "flex", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ width: "min(560px, 100vw)", height: "100%", background: "#F8FAFC", overflowY: "auto",
                    padding: 24, boxSizing: "border-box" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>Ficha del técnico</h2>
          <button onClick={onClose} style={btnSm}>✕ Cerrar</button>
        </div>

        <div style={{ ...CARD, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={badge(tecnico.plan === "empresa" ? "#DBEAFE" : tecnico.plan === "pro" ? "#FFEDD5" : "#F1F5F9", tecnico.plan === "empresa" ? "#1D4ED8" : tecnico.plan === "pro" ? "#C2410C" : "#64748B")}>{tecnico.plan === "empresa" ? "🏢 Empresa" : tecnico.plan === "pro" ? "⚡ Pro" : "Gratis"}</span>
            {tecnico.verificado && <span style={badge("#DCFCE7", "#15803D")}>✅ Verificado</span>}
            {tecnico.suspendido && <span style={badge("#FEE2E2", "#B91C1C")}>⛔ Suspendido</span>}
            <span style={badge("#F1F5F9", "#64748B")}>Registro: {fechaCorta(tecnico.createdAt)}</span>
            <span style={badge("#F1F5F9", "#64748B")}>Rank: {tecnico.rankScore ?? "—"}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B" }}>Nombre
              <input value={form.nombre} onChange={set("nombre")} style={{ ...inp, width: "100%", boxSizing: "border-box", marginTop: 3 }} /></label>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B" }}>Oficio
              <input value={form.oficio} onChange={set("oficio")} list="oficios-tax" style={{ ...inp, width: "100%", boxSizing: "border-box", marginTop: 3 }} /></label>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B" }}>Ciudad
              <input value={form.ciudad} onChange={set("ciudad")} style={{ ...inp, width: "100%", boxSizing: "border-box", marginTop: 3 }} /></label>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B" }}>Años de experiencia
              <input type="number" value={form.experiencia} onChange={set("experiencia")} style={{ ...inp, width: "100%", boxSizing: "border-box", marginTop: 3 }} /></label>
          </div>
          <datalist id="oficios-tax">
            {TAXONOMIA.flatMap((c) => [c.nombre, ...(c.subcategorias || []).map((s) => s.nombre)]).map((n) => <option key={n} value={n} />)}
          </datalist>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", display: "block", marginTop: 8 }}>Bio
            <textarea value={form.bio} onChange={set("bio")} style={{ ...inp, width: "100%", minHeight: 70, boxSizing: "border-box", marginTop: 3 }} /></label>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <button disabled={busy} onClick={guardar} style={{ ...btnSm, background: "#F97316", color: "#fff", border: "none" }}>{busy ? "Guardando…" : "💾 Guardar cambios"}</button>
            <button disabled={busy} onClick={onTogglePlan} style={btnSm}>{tecnico.plan === "pro" ? "Quitar Pro" : "Hacer Pro"}</button>
            <button disabled={busy} onClick={onToggleVerif} style={btnSm}>{tecnico.verificado ? "Desverificar" : "Verificar"}</button>
            <button disabled={busy} onClick={onToggleSusp} style={btnSm}>{tecnico.suspendido ? "Reactivar" : "Suspender"}</button>
            <button disabled={busy} onClick={onEliminar} style={{ ...btnSm, color: "#991B1B" }}>🗑 Eliminar</button>
          </div>
        </div>

        <div style={{ ...CARD, marginBottom: 12 }}>
          <strong style={{ fontSize: 13 }}>🔧 Trabajos documentados {historial ? `(${historial.trabajos.length})` : ""}</strong>
          {!historial ? <p style={{ color: "#64748B", fontSize: 12, marginTop: 6 }}>Cargando…</p> :
            historial.trabajos.length === 0 ? <p style={{ color: "#94A3B8", fontSize: 12, marginTop: 6 }}>Sin trabajos.</p> : (
              historial.trabajos.map((t) => (
                <div key={t.id} style={{ borderBottom: "1px solid #F1F5F9", padding: "8px 0" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.titulo || "Sin título"}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>
                    {fechaCorta(t.createdAt)} · {t.estado}
                    {t.moderadoPorIA && ` · IA: ${t.aprobadoIA ? "✅" : "⚠️"} ${t.calidadIA != null ? `${t.calidadIA}/10` : ""}`}
                  </div>
                </div>
              ))
            )}
        </div>

        <div style={CARD}>
          <strong style={{ fontSize: 13 }}>💰 Pagos {historial ? `(${historial.pagos.length})` : ""}</strong>
          {!historial ? <p style={{ color: "#64748B", fontSize: 12, marginTop: 6 }}>Cargando…</p> :
            historial.pagos.length === 0 ? <p style={{ color: "#94A3B8", fontSize: 12, marginTop: 6 }}>Sin pagos.</p> : (
              historial.pagos.map((p) => (
                <div key={p.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", padding: "8px 0", fontSize: 12.5 }}>
                  <span>{fechaCorta(p.fecha)} · {p.metodo} · {p.estado}</span>
                  <span style={{ fontWeight: 700 }}>{mxn(p.monto)}</span>
                </div>
              ))
            )}
        </div>
      </div>
    </div>
  );
}

function NuevoUsuario({ onClose, onCreated }) {
  const [form, setForm] = useState({ nombre: "", email: "", oficio: "Electricidad", ciudad: "", experiencia: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const guardar = async () => {
    if (!form.nombre.trim()) { setErr("Falta el nombre."); return; }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setErr("El email no es válido."); return; }
    setSaving(true); setErr("");
    try {
      await addDoc(collection(db, "tecnicos"), {
        ...form, experiencia: parseInt(form.experiencia) || 0,
        tipo: "tecnico", plan: "gratis", verificado: false, rating: 0, totalTrabajos: 0, totalReviews: 0,
        disponible: true, creadoManualmente: true,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      logAdmin(auth.currentUser?.email, "creó técnico manualmente", "tecnicos", form.nombre);
      onCreated();
    } catch (e) { setErr(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ ...CARD, display: "flex", flexDirection: "column", gap: 10 }}>
      <strong style={{ fontSize: 14 }}>➕ Crear técnico manualmente (onboarding en persona)</strong>
      {err && <div style={{ color: "#991B1B", fontSize: 13 }}>{err}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 8 }}>
        <input placeholder="Nombre" value={form.nombre} onChange={set("nombre")} style={inp} />
        <input placeholder="Email" value={form.email} onChange={set("email")} style={inp} />
        <input placeholder="Oficio" value={form.oficio} onChange={set("oficio")} list="oficios-tax-nuevo" style={inp} />
        <input placeholder="Ciudad" value={form.ciudad} onChange={set("ciudad")} style={inp} />
        <input placeholder="Años de experiencia" type="number" value={form.experiencia} onChange={set("experiencia")} style={inp} />
      </div>
      <datalist id="oficios-tax-nuevo">
        {TAXONOMIA.flatMap((c) => [c.nombre, ...(c.subcategorias || []).map((s) => s.nombre)]).map((n) => <option key={n} value={n} />)}
      </datalist>
      <textarea placeholder="Bio corta" value={form.bio} onChange={set("bio")} style={{ ...inp, minHeight: 60 }} />
      <div style={{ display: "flex", gap: 8 }}>
        <button disabled={saving} onClick={guardar} style={{ ...btnSm, background: "#F97316", color: "#fff", border: "none" }}>{saving ? "Guardando…" : "Crear"}</button>
        <button onClick={onClose} style={btnSm}>Cancelar</button>
      </div>
      <p style={{ fontSize: 11.5, color: "#94A3B8" }}>
        Nota: este técnico no tendrá cuenta de login (no se crea usuario en Firebase Auth), solo perfil visible en Buscar/Feed. Para que pueda iniciar sesión, tiene que registrarse él mismo normalmente.
      </p>
    </div>
  );
}
