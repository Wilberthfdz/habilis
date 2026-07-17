import { useEffect, useState } from "react";
import { db } from "../../lib/firebase.js";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

const AGENTE_INFO = {
  matching:    { icon: "🎯", label: "Matching" },
  moderador:   { icon: "🛡️", label: "Moderador" },
  verificador: { icon: "✅", label: "Verificador" },
  care:        { icon: "🏥", label: "Care" },
  ranking:     { icon: "📊", label: "Ranking" },
  registroVoz: { icon: "🎙️", label: "Registro por voz" },
  generic:     { icon: "🤖", label: "Genérico" },
};

function fmtHora(ts) {
  if (!ts?.toDate) return "—";
  return ts.toDate().toLocaleString("es-MX", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function esHoy(ts) {
  if (!ts?.toDate) return false;
  const d = ts.toDate();
  const hoy = new Date();
  return d.toDateString() === hoy.toDateString();
}

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px" };

export default function AdminAgentes() {
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = query(collection(db, "aiLogs"), orderBy("fecha", "desc"), limit(200));
    const unsub = onSnapshot(
      q,
      (snap) => setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => setError(err.message)
    );
    return unsub;
  }, []);

  if (error) {
    return (
      <div style={{ ...CARD, borderColor: "#FCA5A5", background: "#FEF2F2", color: "#991B1B" }}>
        No se pudo cargar el feed de agentes: {error}
      </div>
    );
  }
  if (logs === null) {
    return <p style={{ color: "#64748B" }}>Cargando decisiones de los agentes…</p>;
  }

  const hoy = logs.filter((l) => esHoy(l.fecha));
  const porAgente = {};
  for (const l of hoy) porAgente[l.agente] = (porAgente[l.agente] || 0) + 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{
        background: "linear-gradient(135deg,#0F172A,#1E293B)", color: "#fff", borderRadius: 14,
        padding: "16px 20px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 0 4px rgba(34,197,94,0.25)" }} />
        <div>
          <strong style={{ fontSize: 14 }}>🟢 En vivo</strong>
          <p style={{ fontSize: 12.5, opacity: 0.75, margin: 0 }}>
            Cada fila es una decisión ejecutada autónomamente por Gemini en producción — sin intervención humana.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        <div style={CARD}>
          <div style={{ fontSize: 12, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Decisiones hoy</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{hoy.length}</div>
        </div>
        {Object.entries(AGENTE_INFO).filter(([k]) => k !== "generic").map(([key, info]) => (
          <div key={key} style={CARD}>
            <div style={{ fontSize: 12, color: "#64748B", fontWeight: 700 }}>{info.icon} {info.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{porAgente[key] || 0}</div>
          </div>
        ))}
        <div style={CARD}>
          <div style={{ fontSize: 12, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Total histórico</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{logs.length}{logs.length === 200 ? "+" : ""}</div>
        </div>
      </div>

      <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                {["Hora", "Agente", "Decisión", "Entidad", "Razón"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#64748B", fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 20, textAlign: "center", color: "#94A3B8" }}>
                  Todavía no hay decisiones registradas — corren en cuanto se cree una solicitud, un trabajo, un técnico nuevo, o al desplegar los schedulers diarios.
                </td></tr>
              )}
              {logs.map((l) => {
                const info = AGENTE_INFO[l.agente] || AGENTE_INFO.generic;
                return (
                  <tr key={l.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "9px 14px", whiteSpace: "nowrap", color: "#475569" }}>{fmtHora(l.fecha)}</td>
                    <td style={{ padding: "9px 14px", whiteSpace: "nowrap" }}>
                      <span style={{ background: "#F1F5F9", borderRadius: 8, padding: "3px 9px", fontWeight: 700, fontSize: 12 }}>
                        {info.icon} {info.label}
                      </span>
                    </td>
                    <td style={{ padding: "9px 14px" }}>{l.decision}</td>
                    <td style={{ padding: "9px 14px", color: "#64748B", fontFamily: "monospace", fontSize: 11.5 }}>{l.entidadId}</td>
                    <td style={{ padding: "9px 14px", color: "#64748B", maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={l.razon}>{l.razon || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
