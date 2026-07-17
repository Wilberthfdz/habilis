import { useEffect, useMemo, useState } from "react";
import { db } from "../../lib/firebase.js";
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px" };
const TH = { textAlign: "left", padding: "10px 12px", color: "#64748B", fontWeight: 700, fontSize: 11, textTransform: "uppercase" };
const TD = { padding: "9px 12px", fontSize: 13, borderBottom: "1px solid #F1F5F9" };
const badge = (bg, fg) => ({ background: bg, color: fg, borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 700 });
const btnSm = { background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" };

export default function AdminUsuarios() {
  const [tecnicos, setTecnicos] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const [q, setQ] = useState("");
  const [filtroPlan, setFiltroPlan] = useState("todos");
  const [filtroVerif, setFiltroVerif] = useState("todos");
  const [sort, setSort] = useState("fecha");
  const [showNuevo, setShowNuevo] = useState(false);

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
      return matchQ && matchPlan && matchVerif;
    });
    list.sort((a, b) => {
      if (sort === "rankScore") return (b.rankScore || 0) - (a.rankScore || 0);
      if (sort === "trabajos") return (b.totalTrabajos || 0) - (a.totalTrabajos || 0);
      return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
    });
    return list;
  }, [tecnicos, q, filtroPlan, filtroVerif, sort]);

  const accion = async (id, fn) => {
    setBusy(id);
    try { await fn(); await cargar(); }
    catch (e) { alert("Error: " + e.message); }
    finally { setBusy(null); }
  };

  const togglePlan = (t) => accion(t.id, () => updateDoc(doc(db, "tecnicos", t.id), { plan: t.plan === "pro" ? "gratis" : "pro" }));
  const toggleVerificado = (t) => accion(t.id, () => updateDoc(doc(db, "tecnicos", t.id), { verificado: !t.verificado }));
  const toggleSuspendido = (t) => accion(t.id, () => updateDoc(doc(db, "tecnicos", t.id), {
    suspendido: !t.suspendido,
    disponible: !!t.suspendido, // al des-suspender vuelve a aparecer en Buscar
  }));
  const eliminar = (t) => {
    if (!confirm(`¿Eliminar permanentemente a "${t.nombre}"? Esta acción no se puede deshacer.`)) return;
    if (!confirm("Confirma de nuevo: se borrará el perfil completo.")) return;
    accion(t.id, () => deleteDoc(doc(db, "tecnicos", t.id)));
  };

  if (error) return <div style={{ ...CARD, color: "#991B1B" }}>Error: {error}</div>;
  if (!tecnicos) return <p style={{ color: "#64748B" }}>Cargando usuarios…</p>;

  const stats = {
    total: tecnicos.length,
    pros: tecnicos.filter((t) => t.plan === "pro").length,
    verificados: tecnicos.filter((t) => t.verificado).length,
    suspendidos: tecnicos.filter((t) => t.suspendido).length,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: 10 }}>
        {[["Total", stats.total], ["Pro", stats.pros], ["Verificados", stats.verificados], ["Suspendidos", stats.suspendidos]].map(([l, v]) => (
          <div key={l} style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>{l}</div><div style={{ fontSize: 22, fontWeight: 800 }}>{v}</div></div>
        ))}
      </div>

      <div style={{ ...CARD, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <input placeholder="Buscar nombre, email, oficio, ciudad…" value={q} onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1, minWidth: 200, border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 12px", fontSize: 13 }} />
        <select value={filtroPlan} onChange={(e) => setFiltroPlan(e.target.value)} style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}>
          <option value="todos">Plan: todos</option><option value="gratis">Gratis</option><option value="pro">Pro</option>
        </select>
        <select value={filtroVerif} onChange={(e) => setFiltroVerif(e.target.value)} style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}>
          <option value="todos">Verificado: todos</option><option value="si">Sí</option><option value="no">No</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}>
          <option value="fecha">Ordenar: más recientes</option><option value="rankScore">Ranking</option><option value="trabajos">Trabajos</option>
        </select>
        <button style={{ ...btnSm, background: "#F97316", color: "#fff", border: "none" }} onClick={() => setShowNuevo(true)}>➕ Crear usuario</button>
      </div>

      {showNuevo && <NuevoUsuario onClose={() => setShowNuevo(false)} onCreated={() => { setShowNuevo(false); cargar(); }} />}

      <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>
              {["Nombre", "Email", "Oficio", "Ciudad", "Plan", "Verif.", "Rank", "Trabajos", "Acciones"].map((h) => <th key={h} style={TH}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtrados.map((t) => (
                <tr key={t.id} style={{ opacity: t.suspendido ? 0.5 : 1 }}>
                  <td style={TD}>{t.nombre || "—"}</td>
                  <td style={TD}>{t.email || "—"}</td>
                  <td style={TD}>{t.oficio || "—"}</td>
                  <td style={TD}>{t.ciudad || "—"}</td>
                  <td style={TD}><span style={badge(t.plan === "pro" ? "#FFEDD5" : "#F1F5F9", t.plan === "pro" ? "#C2410C" : "#64748B")}>{t.plan === "pro" ? "Pro" : "Gratis"}</span></td>
                  <td style={TD}>{t.verificado ? "✅" : "—"}</td>
                  <td style={TD}>{t.rankScore ?? "—"}</td>
                  <td style={TD}>{t.totalTrabajos || 0}</td>
                  <td style={{ ...TD, whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button disabled={busy === t.id} style={btnSm} onClick={() => togglePlan(t)}>{t.plan === "pro" ? "Quitar Pro" : "Hacer Pro"}</button>
                      <button disabled={busy === t.id} style={btnSm} onClick={() => toggleVerificado(t)}>{t.verificado ? "Desverificar" : "Verificar"}</button>
                      <button disabled={busy === t.id} style={btnSm} onClick={() => toggleSuspendido(t)}>{t.suspendido ? "Reactivar" : "Suspender"}</button>
                      <button disabled={busy === t.id} style={{ ...btnSm, color: "#991B1B" }} onClick={() => eliminar(t)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && <tr><td colSpan={9} style={{ ...TD, textAlign: "center", color: "#94A3B8" }}>Sin resultados.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function NuevoUsuario({ onClose, onCreated }) {
  const [form, setForm] = useState({ nombre: "", email: "", oficio: "Electricista", ciudad: "", experiencia: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const guardar = async () => {
    if (!form.nombre.trim()) { setErr("Falta el nombre."); return; }
    setSaving(true); setErr("");
    try {
      await addDoc(collection(db, "tecnicos"), {
        ...form, experiencia: parseInt(form.experiencia) || 0,
        tipo: "tecnico", plan: "gratis", verificado: false, rating: 0, totalTrabajos: 0, totalReviews: 0,
        disponible: true, creadoManualmente: true,
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
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
        <input placeholder="Oficio" value={form.oficio} onChange={set("oficio")} style={inp} />
        <input placeholder="Ciudad" value={form.ciudad} onChange={set("ciudad")} style={inp} />
        <input placeholder="Años de experiencia" type="number" value={form.experiencia} onChange={set("experiencia")} style={inp} />
      </div>
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

const inp = { border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 10px", fontSize: 13 };
