import { useEffect, useState } from "react";
import { db, auth } from "../../lib/firebase.js";
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { fechaCorta, logAdmin } from "../../lib/erp.js";

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px" };
const btnSm = { background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" };
const badge = (bg, fg) => ({ background: bg, color: fg, borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 700 });

const ESTADO_BADGE = {
  pendiente: badge("#FEF3C7", "#92400E"),
  aprobado:  badge("#DCFCE7", "#15803D"),
  rechazado: badge("#FEE2E2", "#B91C1C"),
};

export default function AdminVerificaciones() {
  const [items, setItems] = useState(null);
  const [tecnicos, setTecnicos] = useState({});
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("pendiente");
  const [busy, setBusy] = useState(null);
  const [motivo, setMotivo] = useState({});

  const cargar = async () => {
    try {
      const [vSnap, tSnap] = await Promise.all([
        getDocs(collection(db, "verificaciones")),
        getDocs(collection(db, "tecnicos")),
      ]);
      setItems(vSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      const map = {};
      tSnap.docs.forEach((d) => { map[d.id] = { id: d.id, ...d.data() }; });
      setTecnicos(map);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { cargar(); }, []);

  if (error) return <div style={{ ...CARD, color: "#991B1B" }}>Error: {error}</div>;
  if (!items) return <p style={{ color: "#64748B" }}>Cargando verificaciones…</p>;

  const filtrados = items
    .filter((v) => filtro === "todos" || v.estado === filtro)
    .sort((a, b) => (a.updatedAt?.toMillis?.() || 0) - (b.updatedAt?.toMillis?.() || 0));

  const pendientes = items.filter((v) => v.estado === "pendiente").length;

  const resolver = async (v, estado) => {
    setBusy(v.id);
    try {
      const cambios = { estado, updatedAt: serverTimestamp() };
      if (estado === "rechazado") cambios.motivoRechazo = (motivo[v.id] || "").trim() || "No cumple los requisitos.";
      if (estado === "aprobado") cambios.motivoRechazo = null;
      await updateDoc(doc(db, "verificaciones", v.id), cambios);
      if (estado === "aprobado") {
        await updateDoc(doc(db, "tecnicos", v.id), { verificado: true, updatedAt: serverTimestamp() });
      }
      const nombre = tecnicos[v.id]?.nombre || tecnicos[v.id]?.email || v.id;
      await addDoc(collection(db, "notificaciones"), {
        userId: v.id, tipo: "verificacion",
        mensaje: estado === "aprobado"
          ? "¡Tu identidad fue verificada! Ya tienes la insignia de verificado."
          : `Tu verificación fue rechazada: ${cambios.motivoRechazo}`,
        leida: false, link: "verificacion", fecha: serverTimestamp(),
      }).catch(() => {});
      logAdmin(auth.currentUser?.email, `${estado === "aprobado" ? "aprobó" : "rechazó"} verificación`, `verificaciones/${v.id}`, nombre);
      setItems((prev) => prev.map((x) => (x.id === v.id ? { ...x, ...cambios } : x)));
    } catch (e) { setError("Error: " + e.message); }
    finally { setBusy(null); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10 }}>
        <div style={CARD}><div style={{ fontSize: 11, color: "#92400E", fontWeight: 700 }}>PENDIENTES</div><div style={{ fontSize: 22, fontWeight: 800 }}>{pendientes}</div></div>
        <div style={CARD}><div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>TOTAL</div><div style={{ fontSize: 22, fontWeight: 800 }}>{items.length}</div></div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {[["pendiente", "Pendientes"], ["aprobado", "Aprobados"], ["rechazado", "Rechazados"], ["todos", "Todos"]].map(([id, label]) => (
          <button key={id} onClick={() => setFiltro(id)}
            style={{ ...btnSm, background: filtro === id ? "#0F172A" : "#F1F5F9", color: filtro === id ? "#fff" : "#0F172A" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtrados.length === 0 && (
          <div style={{ ...CARD, textAlign: "center", color: "#94A3B8" }}>Sin solicitudes en esta vista.</div>
        )}
        {filtrados.map((v) => {
          const t = tecnicos[v.id];
          return (
            <div key={v.id} style={CARD}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                    <span style={ESTADO_BADGE[v.estado] || badge("#F1F5F9", "#64748B")}>{v.estado}</span>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 13.5 }}>{t?.nombre || "(perfil no encontrado)"}</p>
                  <p style={{ fontSize: 12, color: "#94A3B8" }}>{t?.email} · {t?.oficio} · {fechaCorta(v.updatedAt)}</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10, marginBottom: 10 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>INE / identificación</p>
                  {v.ineBase64
                    ? <img src={v.ineBase64} alt="INE" style={{ width: "100%", borderRadius: 8, border: "1px solid #E2E8F0" }} />
                    : <p style={{ fontSize: 12, color: "#94A3B8" }}>No adjuntado.</p>}
                </div>
                {v.comprobanteBase64 && (
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>Comprobante de oficio</p>
                    <img src={v.comprobanteBase64} alt="Comprobante" style={{ width: "100%", borderRadius: 8, border: "1px solid #E2E8F0" }} />
                  </div>
                )}
              </div>

              {v.motivoRechazo && v.estado === "rechazado" && (
                <p style={{ fontSize: 12.5, color: "#B91C1C", marginBottom: 10 }}>Motivo del rechazo: {v.motivoRechazo}</p>
              )}

              {v.estado === "pendiente" && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <button disabled={busy === v.id} onClick={() => resolver(v, "aprobado")}
                    style={{ ...btnSm, background: "#16A34A", color: "#fff", border: "none" }}>✅ Aprobar</button>
                  <input placeholder="Motivo de rechazo (opcional)" value={motivo[v.id] || ""}
                    onChange={(e) => setMotivo((m) => ({ ...m, [v.id]: e.target.value }))}
                    style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: "6px 10px", fontSize: 12.5, flex: 1, minWidth: 160 }} />
                  <button disabled={busy === v.id} onClick={() => resolver(v, "rechazado")}
                    style={{ ...btnSm, background: "#DC2626", color: "#fff", border: "none" }}>✕ Rechazar</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
