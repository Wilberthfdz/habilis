import { useEffect, useState } from "react";
import { db } from "../../lib/firebase.js";
import { collection, getDocs } from "firebase/firestore";

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px" };
const TH = { textAlign: "left", padding: "10px 12px", color: "#64748B", fontWeight: 700, fontSize: 11, textTransform: "uppercase" };
const TD = { padding: "9px 12px", fontSize: 13, borderBottom: "1px solid #F1F5F9" };

const COLOR = (estado) => estado === "rojo" ? "#EF4444" : estado === "amarillo" ? "#F59E0B" : "#10B981";

export default function AdminCare() {
  const [activos, setActivos] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDocs(collection(db, "activos"))
      .then((snap) => setActivos(snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((a) => !a.eliminado)))
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div style={{ ...CARD, color: "#991B1B" }}>Error: {error}</div>;
  if (!activos) return <p style={{ color: "#64748B" }}>Cargando equipos…</p>;

  const rojos = activos.filter((a) => a.estadoIA === "rojo").length;
  const amarillos = activos.filter((a) => a.estadoIA === "amarillo").length;
  const autoSolicitudes = activos.filter((a) => a.solicitudAutoCreada).length;

  const ordenados = [...activos].sort((a, b) => (a.saludScoreIA ?? 100) - (b.saludScoreIA ?? 100));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>TOTAL EQUIPOS</div><div style={{ fontSize: 22, fontWeight: 800 }}>{activos.length}</div></div>
        <div style={CARD}><div style={{ fontSize: 11, color: "#EF4444", fontWeight: 700 }}>🔴 EN ROJO</div><div style={{ fontSize: 22, fontWeight: 800 }}>{rojos}</div></div>
        <div style={CARD}><div style={{ fontSize: 11, color: "#F59E0B", fontWeight: 700 }}>🟡 EN AMARILLO</div><div style={{ fontSize: 22, fontWeight: 800 }}>{amarillos}</div></div>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>SOLICITUDES AUTO-CREADAS</div><div style={{ fontSize: 22, fontWeight: 800 }}>{autoSolicitudes}</div></div>
      </div>

      <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Equipo", "Tipo", "Dueño", "Salud IA", "Estado", "Último análisis IA"].map((h) => <th key={h} style={TH}>{h}</th>)}</tr></thead>
            <tbody>
              {ordenados.map((a) => (
                <tr key={a.id}>
                  <td style={TD}>{a.nombre}</td>
                  <td style={TD}>{a.tipo}</td>
                  <td style={TD} title={a.userId}>{(a.userId || "").slice(0, 8)}…</td>
                  <td style={TD}>
                    <div style={{ width: 80, height: 6, background: "#F1F5F9", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${a.saludScoreIA ?? 100}%`, height: "100%", background: COLOR(a.estadoIA) }} />
                    </div>
                  </td>
                  <td style={TD}>{a.estadoIA ? (a.estadoIA === "rojo" ? "🔴" : a.estadoIA === "amarillo" ? "🟡" : "🟢") : "sin analizar"}</td>
                  <td style={TD}>{a.ultimoAnalisisIA?.toDate ? a.ultimoAnalisisIA.toDate().toLocaleString("es-MX") : "—"}</td>
                </tr>
              ))}
              {ordenados.length === 0 && <tr><td colSpan={6} style={{ ...TD, textAlign: "center", color: "#94A3B8" }}>Sin equipos registrados todavía.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
