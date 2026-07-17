import { useEffect, useState } from "react";
import { db } from "../../lib/firebase.js";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, limit } from "firebase/firestore";

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px" };
const inp = { border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 10px", fontSize: 13 };
const btnSm = { background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const TH = { textAlign: "left", padding: "10px 12px", color: "#64748B", fontWeight: 700, fontSize: 11, textTransform: "uppercase" };
const TD = { padding: "9px 12px", fontSize: 13, borderBottom: "1px solid #F1F5F9" };

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
        if (destinatarios === "pros") return t.plan === "pro";
        if (destinatarios === "gratis") return t.plan !== "pro";
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
          <option value="todos">Todos</option><option value="pros">Solo Pro</option>
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

  return (
    <div style={{ ...CARD, display: "flex", flexDirection: "column", gap: 10 }}>
      <strong style={{ fontSize: 14 }}>🏷️ Códigos promocionales</strong>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <input placeholder="Código (ej. LANZAMIENTO)" value={form.codigo} onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value }))} style={inp} />
        <input placeholder="% descuento" type="number" value={form.descuento} onChange={(e) => setForm((f) => ({ ...f, descuento: e.target.value }))} style={inp} />
        <input placeholder="Usos máximos" type="number" value={form.usosMaximos} onChange={(e) => setForm((f) => ({ ...f, usosMaximos: e.target.value }))} style={inp} />
        <button onClick={crear} style={btnSm}>➕ Crear</button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr style={{ background: "#F8FAFC" }}>{["Código", "Descuento", "Usos"].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
        <tbody>
          {(promos || []).map((p) => <tr key={p.id}><td style={TD}>{p.codigo}</td><td style={TD}>{p.descuento}%</td><td style={TD}>{p.usosActuales || 0}/{p.usosMaximos || "∞"}</td></tr>)}
        </tbody>
      </table>
      <p style={{ fontSize: 11.5, color: "#94A3B8" }}>Nota: los códigos se guardan listos para usarse, pero el checkout de Mercado Pago todavía no los aplica automáticamente — eso requiere conectar la lógica en `crearSuscripcion`.</p>
    </div>
  );
}
