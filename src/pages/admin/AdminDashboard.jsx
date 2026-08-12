import { useEffect, useState } from "react";
import { db } from "../../lib/firebase.js";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { mxn, claveMes, claveSemana, ultimasSemanas, USD_RATE } from "../../lib/erp.js";

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px" };
const KPI_LABEL = { fontSize: 12, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.3 };
const KPI_VALUE = { fontSize: 26, fontWeight: 800, marginTop: 4 };
const btn = {
  background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 10,
  padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", color: "#0F172A",
};

// Mini gráfica de barras sin librerías — tendencia semanal
function Barras({ series, color = "#F97316" }) {
  const max = Math.max(...series.map((s) => s.valor), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 56, marginTop: 10 }}>
      {series.map((s) => (
        <div key={s.clave} title={`${s.clave}: ${s.valor}`}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <span style={{ fontSize: 9.5, color: "#94A3B8", fontVariantNumeric: "tabular-nums" }}>{s.valor || ""}</span>
          <div style={{ width: "100%", borderRadius: "3px 3px 0 0", background: color,
                        height: `${Math.max((s.valor / max) * 40, s.valor ? 3 : 1)}px`,
                        opacity: s.valor ? 1 : 0.25 }} />
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard({ onChangeModule }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    try {
      const [tecnicosSnap, trabajosSnap, solicitudesSnap, activosSnap, aiLogsSnap, pagosSnap] = await Promise.all([
        getDocs(collection(db, "tecnicos")),
        getDocs(collection(db, "trabajos")),
        getDocs(query(collection(db, "solicitudes"), where("estado", "==", "abierta"))),
        getDocs(collection(db, "activos")),
        getDocs(query(collection(db, "aiLogs"), orderBy("fecha", "desc"), limit(500))),
        getDocs(query(collection(db, "pagos"), orderBy("fecha", "desc"), limit(500))),
      ]);

      const tecnicos = tecnicosSnap.docs.map((d) => d.data());
      const trabajos = trabajosSnap.docs.map((d) => d.data());
      const aiLogs = aiLogsSnap.docs.map((d) => d.data());
      const pagos = pagosSnap.docs.map((d) => d.data());
      const activos = activosSnap.docs.map((d) => d.data()).filter((a) => !a.eliminado);

      // Ingresos REALES del mes (pagos aprobados) — no el proxy pros×100
      const mesActual = claveMes(new Date());
      const ingresosMes = pagos
        .filter((p) => p.estado === "aprobado" && claveMes(p.fecha) === mesActual)
        .reduce((a, p) => a + (p.monto || 0), 0);

      // Tendencias: últimas 8 semanas
      const semanas = ultimasSemanas(8);
      const porSemana = (docs, campo = "createdAt") => semanas.map((s) => ({
        clave: s.slice(5),
        valor: docs.filter((d) => claveSemana(d[campo] || d.fecha) === s).length,
      }));

      const semanaActual = claveSemana(new Date());
      const semanaPasada = claveSemana(new Date(Date.now() - 7 * 86400000));
      const registrosSemana  = tecnicos.filter((t) => claveSemana(t.createdAt) === semanaActual).length;
      const registrosAnterior = tecnicos.filter((t) => claveSemana(t.createdAt) === semanaPasada).length;

      const hoyStr = new Date().toDateString();
      setData({
        totalUsuarios: tecnicos.length,
        registrosSemana,
        deltaRegistros: registrosSemana - registrosAnterior,
        pros: tecnicos.filter((t) => t.plan === "pro").length,
        ingresosMes,
        trabajos: trabajos.length,
        solicitudesAbiertas: solicitudesSnap.size,
        equiposCare: activos.length,
        decisionesHoy: aiLogs.filter((l) => l.fecha?.toDate?.().toDateString() === hoyStr).length,
        tendRegistros: porSemana(tecnicos),
        tendTrabajos: porSemana(trabajos),
        tendIA: porSemana(aiLogs, "fecha"),
      });
      setError("");
    } catch (e) {
      setError(e.message);
    } finally { setCargando(false); }
  };

  useEffect(() => { cargar(); }, []);

  if (error) return <div style={{ ...CARD, color: "#991B1B" }}>Error cargando el dashboard: {error}</div>;
  if (!data) return <p style={{ color: "#64748B" }}>Cargando KPIs…</p>;

  const kpis = [
    { label: "Técnicos totales", value: data.totalUsuarios,
      sub: `+${data.registrosSemana} esta semana ${data.deltaRegistros >= 0 ? "▲" : "▼"} vs anterior` },
    { label: "Técnicos Pro", value: data.pros,
      sub: data.totalUsuarios ? `${Math.round((data.pros / data.totalUsuarios) * 100)}% conversión` : "" },
    { label: "Ingresos del mes (reales)", value: mxn(data.ingresosMes),
      sub: `≈ $${(data.ingresosMes / USD_RATE).toFixed(0)} USD · solo pagos aprobados` },
    { label: "Trabajos documentados", value: data.trabajos },
    { label: "Solicitudes abiertas", value: data.solicitudesAbiertas },
    { label: "Equipos en Care", value: data.equiposCare },
    { label: "Decisiones de IA hoy", value: data.decisionesHoy },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={cargar} disabled={cargando} style={btn}>{cargando ? "Actualizando…" : "↻ Actualizar"}</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
        {kpis.map((k) => (
          <div key={k.label} style={CARD}>
            <div style={KPI_LABEL}>{k.label}</div>
            <div style={KPI_VALUE}>{k.value}</div>
            {k.sub && <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 2 }}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Tendencias — los números que pide el XPRIZE, semana a semana */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        <div style={CARD}>
          <div style={KPI_LABEL}>Registros de técnicos / semana</div>
          <Barras series={data.tendRegistros} color="#F97316" />
        </div>
        <div style={CARD}>
          <div style={KPI_LABEL}>Trabajos documentados / semana</div>
          <Barras series={data.tendTrabajos} color="#0EA5E9" />
        </div>
        <div style={CARD}>
          <div style={KPI_LABEL}>Decisiones de IA / semana</div>
          <Barras series={data.tendIA} color="#8B5CF6" />
        </div>
      </div>

      <div style={{ ...CARD, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => onChangeModule("usuarios")} style={btn}>👥 Ver usuarios</button>
        <button onClick={() => onChangeModule("finanzas")} style={btn}>💰 Ver pagos</button>
        <button onClick={() => onChangeModule("agentes")} style={btn}>🤖 Ver logs de IA</button>
        <button onClick={() => onChangeModule("operaciones")} style={btn}>📋 Ver operaciones</button>
      </div>
    </div>
  );
}
