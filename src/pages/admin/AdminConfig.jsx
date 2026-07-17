import { useEffect, useState } from "react";
import { db } from "../../lib/firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";

const CARD = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px" };
const inp = { border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 10px", fontSize: 13, width: "100%" };
const lbl = { fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 4 };
const row = { display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 };

const DEFAULTS = {
  precioProMxn: 100,
  mensajeBienvenida: "¡Bienvenido a Habilis! Tu perfil ya está listo.",
  modoMantenimiento: false,
  registroAbierto: true,
  whatsappSoporte: "",
};

export default function AdminConfig() {
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "config", "general")).then((snap) => {
      setConfig(snap.exists() ? { ...DEFAULTS, ...snap.data() } : DEFAULTS);
    });
  }, []);

  if (!config) return <p style={{ color: "#64748B" }}>Cargando configuración…</p>;

  const set = (k) => (e) => setConfig((c) => ({ ...c, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const guardar = async () => {
    setSaving(true); setSaved(false);
    try {
      await setDoc(doc(db, "config", "general"), {
        ...config,
        precioProMxn: parseFloat(config.precioProMxn) || 100,
      });
      setSaved(true);
    } finally { setSaving(false); }
  };

  return (
    <div style={{ ...CARD, maxWidth: 480, display: "flex", flexDirection: "column" }}>
      <strong style={{ fontSize: 14, marginBottom: 16 }}>⚙️ Configuración general</strong>

      <div style={row}>
        <label style={lbl}>Precio plan Pro (MXN/mes)</label>
        <input type="number" value={config.precioProMxn} onChange={set("precioProMxn")} style={inp} />
      </div>

      <div style={row}>
        <label style={lbl}>Mensaje de bienvenida</label>
        <textarea value={config.mensajeBienvenida} onChange={set("mensajeBienvenida")} style={{ ...inp, minHeight: 60 }} />
      </div>

      <div style={row}>
        <label style={lbl}>WhatsApp de soporte</label>
        <input placeholder="+52 998 123 4567" value={config.whatsappSoporte} onChange={set("whatsappSoporte")} style={inp} />
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 10 }}>
        <input type="checkbox" checked={config.modoMantenimiento} onChange={set("modoMantenimiento")} />
        Modo mantenimiento (muestra banner en el Landing)
      </label>

      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 16 }}>
        <input type="checkbox" checked={config.registroAbierto} onChange={set("registroAbierto")} />
        Registro abierto a nuevos técnicos
      </label>

      <button onClick={guardar} disabled={saving} style={{ background: "#F97316", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", alignSelf: "flex-start" }}>
        {saving ? "Guardando…" : "Guardar cambios"}
      </button>
      {saved && <p style={{ color: "#166534", fontSize: 13, marginTop: 8 }}>✅ Guardado.</p>}

      <p style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 14 }}>
        Nota: estos valores se guardan en Firestore (`config/general`), pero todavía ningún componente del Landing/Precios los está leyendo — hoy quedan guardados y listos, falta conectar esas pantallas para que respeten estos valores en vez de sus constantes fijas.
      </p>
    </div>
  );
}
