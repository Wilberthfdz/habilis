import { useEffect, useState } from "react";
import { db, auth, esPlanPagante } from "../../lib/firebase.js";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { logAdmin } from "../../lib/erp.js";

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px" };
const inp = { border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 10px", fontSize: 13 };
const btnSm = { background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const TH = { textAlign: "left", padding: "10px 12px", color: "#64748B", fontWeight: 700, fontSize: 11, textTransform: "uppercase" };
const TD = { padding: "9px 12px", fontSize: 13, borderBottom: "1px solid #F1F5F9" };
const btnBorrar = { background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" };

export default function AdminMarketing() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <NotificacionMasiva />
      <Promos />
    </div>
  );
}

function NotificacionMasiva() {
  const [mensaje, setMensaje] = useState("");
  const [destinatarios, setDestinatarios] = useState("todos");
  const [ciudad, setCiudad] = useState("");
  const [sending, setSending] = useState(false);
  const [historial, setHistorial] = useState(null);
  const [result, setResult] = useState("");

  const cargarHistorial = async () => {
    const snap = await getDocs(query(collection(db, "notificaciones"), orderBy("fecha", "desc"), limit(20)));
    setHistorial(snap.docs.map((d) => d.data()).filter((n) => n.tipo === "marketing"));
  };
  useEffect(() => { cargarHistorial(); }, []);

  const enviar = async () => {
    if (!mensaje.trim()) return;
    setSending(true); setResult("");
    try {
      const snap = await getDocs(collection(db, "tecnicos"));
      const tecnicos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const destino = tecnicos.filter((t) => {
        if (destinatarios === "pros") return esPlanPagante(t.plan);
        if (destinatarios === "gratis") return !esPlanPagante(t.plan);
        if (destinatarios === "ciudad") return (t.ciudad || "").toLowerCase() === ciudad.trim().toLowerCase();
        return true;
      });
      await Promise.all(destino.map((t) => addDoc(collection(db, "notificaciones"), {
        userId: t.id, tipo: "marketing", mensaje: mensaje.trim(), leida: false, link: "feed",
        fecha: serverTimestamp(),
      })));
      setResult(`✅ Enviado a ${destino.length} usuario(s).`);
      setMensaje("");
      cargarHistorial();
    } catch (e) {
      setResult("Error: " + e.message);
    } finally { setSending(false); }
  };

  return (
    <div style={{ ...CARD, display: "flex", flexDirection: "column", gap: 10 }}>
      <strong style={{ fontSize: 14 }}>📣 Enviar notificación masiva</strong>
      <textarea placeholder="Mensaje para los técnicos…" value={mensaje} onChange={(e) => setMensaje(e.target.value)} style={{ ...inp, minHeight: 70 }} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <select value={destinatarios} onChange={(e) => setDestinatarios(e.target.value)} style={inp}>
        <option value="todos">Todos</option><option value="pros">Solo de paga (Pro y Empresa)</option>
          <option value="gratis">Solo Gratis</option><option value="ciudad">Por ciudad</option>
        </select>
        {destinatarios === "ciudad" && <input placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} style={inp} />}
        <button disabled={sending} onClick={enviar} style={{ ...btnSm, background: "#F97316", color: "#fff", border: "none" }}>{sending ? "Enviando…" : "Enviar"}</button>
      </div>
      {result && <p style={{ fontSize: 13 }}>{result}</p>}

      <div style={{ marginTop: 8 }}>
        <strong style={{ fontSize: 12, color: "#64748B", textTransform: "uppercase" }}>Historial reciente</strong>
        {historial === null ? <p style={{ fontSize: 13, color: "#94A3B8" }}>Cargando…</p> : historial.length === 0 ? (
          <p style={{ fontSize: 13, color: "#94A3B8" }}>Sin notificaciones masivas enviadas todavía.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 6 }}>
            <tbody>
              {historial.map((n, i) => <tr key={i}><td style={TD}>{n.fecha?.toDate ? n.fecha.toDate().toLocaleString("es-MX") : "—"}</td><td style={TD}>{n.mensaje}</td></tr>)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Promos() {
  const [promos, setPromos] = useState(null);
  const [form, setForm] = useState({ codigo: "", descuento: "", usosMaximos: "" });
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");

  const cargar = async () => {
    const snap = await getDocs(collection(db, "promos"));
    setPromos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };
  useEffect(() => { cargar(); }, []);

  const crear = async () => {
    if (!form.codigo.trim()) return;
    await addDoc(collection(db, "promos"), {
      codigo: form.codigo.trim().toUpperCase(), descuento: parseFloat(form.descuento) || 0,
      usosMaximos: parseInt(form.usosMaximos) || 0, usosActuales: 0, activo: true, createdAt: serverTimestamp(),
    });
    setForm({ codigo: "", descuento: "", usosMaximos: "" });
    cargar();
  };

  // Borrar un código no toca las suscripciones que ya se crearon con él: el
  // descuento vive en el preapproval/preferencia de Mercado Pago, no aquí. Se
  // pierde el contador de usos y la posibilidad de seguir canjeándolo, nada
  // más. `devolverUsoPromo` (backend) ya ignora un código borrado sin fallar,
  // así que un checkout abandonado después del borrado tampoco rompe nada.
  const eliminar = async (p) => {
    const usos = p.usosActuales || 0;
    if (!confirm(usos > 0
      ? `El código "${p.codigo}" ya se canjeó ${usos} ${usos === 1 ? "vez" : "veces"}.\n\nBorrarlo NO cancela esas suscripciones ni les quita el descuento: solo impide que se siga usando. ¿Eliminarlo?`
      : `¿Eliminar el código "${p.codigo}"? Nunca se ha canjeado.`)) return;
    setBusy(p.id);
    setError("");
    try {
      await deleteDoc(doc(db, "promos", p.id));
      logAdmin(auth.currentUser?.email, "ELIMINÓ código promocional", `promos/${p.id}`,
        `${p.codigo} — ${p.descuento}% — ${usos} uso(s)`);
      setPromos((prev) => prev.filter((x) => x.id !== p.id));
    } catch (e) { setError("No se pudo eliminar: " + e.message); }
    finally { setBusy(null); }
  };

  return (
    <div style={{ ...CARD, display: "flex", flexDirection: "column", gap: 10 }}>
      <strong style={{ fontSize: 14 }}>🏷️ Códigos promocionales</strong>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input placeholder="Código (ej. LANZAMIENTO)" value={form.codigo} onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value }))} style={inp} />
        <input placeholder="% descuento" type="number" value={form.descuento} onChange={(e) => setForm((f) => ({ ...f, descuento: e.target.value }))} style={inp} />
        <input placeholder="Usos máximos" type="number" value={form.usosMaximos} onChange={(e) => setForm((f) => ({ ...f, usosMaximos: e.target.value }))} style={inp} />
        <button onClick={crear} style={btnSm}>➕ Crear</button>
      </div>
      {error && <p style={{ fontSize: 12, color: "#DC2626", margin: 0 }}>{error}</p>}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr style={{ background: "#F8FAFC" }}>{["Código", "Descuento", "Usos", "Acciones"].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
        <tbody>
          {(promos || []).map((p) => (
            <tr key={p.id}>
              <td style={TD}>{p.codigo}</td>
              <td style={TD}>{p.descuento}%</td>
              <td style={TD}>{p.usosActuales || 0}/{p.usosMaximos || "∞"}</td>
              <td style={TD}>
                <button onClick={() => eliminar(p)} disabled={busy === p.id} style={btnBorrar}
                  title={`Eliminar el código ${p.codigo}`}>
                  {busy === p.id ? "Borrando…" : "🗑️ Eliminar"}
                </button>
              </td>
            </tr>
          ))}
          {promos && promos.length === 0 && (
            <tr><td colSpan={4} style={{ ...TD, color: "#94A3B8" }}>Todavía no hay códigos creados.</td></tr>
          )}
        </tbody>
      </table>
      <p style={{ fontSize: 11.5, color: "#94A3B8" }}>Los códigos se aplican en el checkout de /pro: `crearSuscripcion` valida el código y aparta el uso en ese momento, antes de mandar a pagar, para que el tope no se pueda rebasar. Un checkout abandonado consume el uso. Mercado Pago rechaza cualquier cobro menor a $10 MXN: con Pro ($149) el descuento máximo que pasa es 93%, y con Empresa ($499), 97% — por encima de eso el cobro falla con «Cannot pay an amount lower than $10».</p>
    </div>
  );
}
