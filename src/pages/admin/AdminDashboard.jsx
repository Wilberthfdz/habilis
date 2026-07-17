import { useEffect, useState } from "react";
import { db } from "../../lib/firebase.js";
import { collection, getDocs, query, where } from "firebase/firestore";

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px" };
const KPI_LABEL = { fontSize: 12, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3 };
const KPI_VALUE = { fontSize: 26, fontWeight: 800, marginTop: 4 };

function esHoy(ts) {
  if (!ts?.toDate) return false;
  return ts.toDate().toDateString() === new Date().toDateString();
}

export default function AdminDashboard({ onChangeModule }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [tecnicosSnap, trabajosSnap, solicitudesSnap, activosSnap, aiLogsSnap] = await Promise.all([
          getDocs(collection(db, "tecnicos")),
          getDocs(collection(db, "trabajos")),
          getDocs(query(collection(db, "solicitudes"), where("estado", "==", "abierta"))),
          getDocs(collection(db, "activos")),
          getDocs(collection(db, "aiLogs")),
        ]);

        const tecnicos = tecnicosSnap.docs.map((d) => d.data());
        const pros = tecnicos.filter((t) => t.plan === "pro").length;
        const mrrMxn = pros * 100;

        const aiLogs = aiLogsSnap.docs.map((d) => d.data());

        setData({
          totalUsuarios: tecnicos.length,
          pros,
          mrrMxn,
          mrrUsd: (mrrMxn / 18.5).toFixed(0),
          trabajos: trabajosSnap.size,
          solicitudesAbiertas: solicitudesSnap.size,
          equiposCare: activosSnap.size,
          decisionesHoy: aiLogs.filter(esHoy).length,
        });
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  if (error) return <div style={{ ...CARD, color: "#991B1B" }}>Error cargando el dashboard: {error}</div>;
  if (!data) return <p style={{ color: "#64748B" }}>Cargando KPIs…</p>;

  const kpis = [
    { label: "Usuarios totales", value: data.totalUsuarios },
    { label: "Técnicos Pro", value: data.pros },
    { label: "MRR", value: `$${data.mrrMxn.toLocaleString()} MXN`, sub: `≈ $${data.mrrUsd} USD` },
    { label: "Trabajos documentados", value: data.trabajos },
    { label: "Solicitudes abiertas", value: data.solicitudesAbiertas },
    { label: "Equipos en Care", value: data.equiposCare },
    { label: "Decisiones de IA hoy", value: data.decisionesHoy },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        {kpis.map((k) => (
          <div key={k.label} style={CARD}>
            <div style={KPI_LABEL}>{k.label}</div>
            <div style={KPI_VALUE}>{k.value}</div>
            {k.sub && <div style={{ fontSize: 12, color: "#94A3B8" }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      <div style={{ ...CARD, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => onChangeModule("usuarios")} style={btn}>👥 Ver usuarios</button>
        <button onClick={() => onChangeModule("finanzas")} style={btn}>💰 Ver pagos</button>
        <button onClick={() => onChangeModule("agentes")} style={btn}>🤖 Ver logs de IA</button>
      </div>
    </div>
  );
}

const btn = {
  background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 10,
  padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#0F172A",
};
