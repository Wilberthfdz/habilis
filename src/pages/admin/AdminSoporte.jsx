import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase.js";
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { fechaCorta, logAdmin } from "../../lib/erp.js";

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px" };
const btnSm = { background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" };
const badge = (bg, fg) => ({ background: bg, color: fg, borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 700 });

const ESTADOS = ["abierto", "respondido", "cerrado"];

export default function AdminSoporte() {
  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("abierto");
  const [busy, setBusy] = useState(null);

  const cargar = () => {
    getDocs(collection(db, "soporteTickets"))
      .then((snap) => setTickets(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
      .catch((e) => setError(e.message));
  };

  useEffect(cargar, []);

  if (error) return <div style={{ ...CARD, color: "#991B1B" }}>Error: {error}</div>;
  if (!tickets) return <p style={{ color: "#64748B" }}>Cargando tickets…</p>;

  // Prioritarios primero, y dentro de cada grupo el más viejo primero — la
  // promesa de "soporte prioritario" solo es real si de verdad se atienden
  // en ese orden.
  const ordenados = [...tickets]
    .filter((t) => filtro === "todos" || t.estado === filtro)
    .sort((a, b) => {
      if (!!b.prioridad !== !!a.prioridad) return b.prioridad ? 1 : -1;
      return (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0);
    });

  const abiertos = tickets.filter((t) => t.estado === "abierto");
  const abiertosPrioritarios = abiertos.filter((t) => t.prioridad).length;

  const cambiarEstado = async (t, estado) => {
    setBusy(t.id);
    try {
      await updateDoc(doc(db, "soporteTickets", t.id), { estado, updatedAt: serverTimestamp() });
      if (estado === "respondido") {
        await addDoc(collection(db, "notificaciones"), {
          userId: t.userId, tipo: "soporte",
          mensaje: "Respondimos tu mensaje de soporte — revisa tu correo.",
          leida: false, link: "soporte", fecha: serverTimestamp(),
        }).catch(() => {});
      }
      logAdmin(auth.currentUser?.email, `marcó ticket ${estado}`, `soporteTickets/${t.id}`, t.userEmail || "");
      setTickets((prev) => prev.map((x) => x.id === t.id ? { ...x, estado } : x));
    } finally { setBusy(null); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>ABIERTOS</div><div style={{ fontSize: 22, fontWeight: 800 }}>{abiertos.length}</div></div>
        <div style={CARD}><div style={{ fontSize: 11, color: "#EA580C", fontWeight: 700 }}>⚡ PRIORITARIOS ABIERTOS</div><div style={{ fontSize: 22, fontWeight: 800 }}>{abiertosPrioritarios}</div></div>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>TOTAL HISTÓRICO</div><div style={{ fontSize: 22, fontWeight: 800 }}>{tickets.length}</div></div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {[["abierto", "Abiertos"], ["respondido", "Respondidos"], ["cerrado", "Cerrados"], ["todos", "Todos"]].map(([id, label]) => (
          <button key={id} onClick={() => setFiltro(id)}
            style={{ ...btnSm, background: filtro === id ? "#0F172A" : "#F1F5F9", color: filtro === id ? "#fff" : "#0F172A" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ordenados.length === 0 && (
          <div style={{ ...CARD, textAlign: "center", color: "#94A3B8" }}>Sin tickets en esta vista.</div>
        )}
        {ordenados.map((t) => (
          <div key={t.id} style={CARD}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
              <div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                  {t.prioridad && <span style={badge("#FFEDD5", "#C2410C")}>⚡ PRIORITARIO ({t.plan})</span>}
                  <span style={badge(
                    t.estado === "abierto" ? "#FEF3C7" : t.estado === "respondido" ? "#DCFCE7" : "#F1F5F9",
                    t.estado === "abierto" ? "#92400E" : t.estado === "respondido" ? "#15803D" : "#64748B"
                  )}>{t.estado}</span>
                  {!t.prioridad && <span style={badge("#F1F5F9", "#64748B")}>{t.plan || "sin cuenta"}</span>}
                </div>
                <p style={{ fontWeight: 700, fontSize: 13.5 }}>{t.userNombre || t.userEmail || t.userId}</p>
                <p style={{ fontSize: 12, color: "#94A3B8" }}>{t.userEmail} · {fechaCorta(t.createdAt)}</p>
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {ESTADOS.filter((e) => e !== t.estado).map((e) => (
                  <button key={e} disabled={busy === t.id} onClick={() => cambiarEstado(t, e)} style={btnSm}>
                    Marcar {e}
                  </button>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{t.mensaje}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
