// ─── HABILIS ERP — utilidades compartidas del panel admin ─────────────────
// Exportación CSV, agrupación temporal, formato y log de auditoría.

import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/** Tipo de cambio de referencia MXN→USD — fuente única para todo el ERP. */
export const USD_RATE = 18.5;

/**
 * Registra una acción del admin en `adminLogs` (fire-and-forget: nunca
 * bloquea la UI si falla). accion: "activó Pro", entidad: "tecnicos/abc".
 */
export function logAdmin(adminEmail, accion, entidad, detalle = "") {
  addDoc(collection(db, "adminLogs"), {
    admin: adminEmail || "?",
    accion,
    entidad,
    detalle,
    fecha: serverTimestamp(),
  }).catch(() => {});
}

/** Formatea centavos/pesos MXN: 1234.5 → "$1,234.50" */
export function mxn(n) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n || 0);
}

/** Fecha corta legible: Timestamp|Date|string → "12 ago 2026" */
export function fechaCorta(f) {
  const d = f?.toDate ? f.toDate() : f ? new Date(f) : null;
  if (!d || isNaN(d)) return "—";
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
}

/** Clave de mes "2026-08" a partir de Timestamp/Date. */
export function claveMes(f) {
  const d = f?.toDate ? f.toDate() : f ? new Date(f) : null;
  if (!d || isNaN(d)) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** Clave de semana ISO-ish "2026-W33" (lunes como inicio). */
export function claveSemana(f) {
  const d = f?.toDate ? f.toDate() : f ? new Date(f) : null;
  if (!d || isNaN(d)) return null;
  const t = new Date(d);
  t.setHours(0, 0, 0, 0);
  // jueves de la misma semana define el año ISO
  t.setDate(t.getDate() + 3 - ((t.getDay() + 6) % 7));
  const inicio = new Date(t.getFullYear(), 0, 4);
  const semana = 1 + Math.round(((t - inicio) / 86400000 - 3 + ((inicio.getDay() + 6) % 7)) / 7);
  return `${t.getFullYear()}-W${String(semana).padStart(2, "0")}`;
}

/** Agrupa documentos por clave temporal. keyFn: claveMes|claveSemana. campo fecha configurable. */
export function agruparPor(docs, keyFn, campoFecha = "fecha") {
  const out = {};
  for (const d of docs) {
    const k = keyFn(d[campoFecha] || d.createdAt);
    if (!k) continue;
    (out[k] ||= []).push(d);
  }
  return out;
}

/** Últimas N claves de mes hasta hoy, en orden cronológico. */
export function ultimosMeses(n = 6) {
  const out = [];
  const hoy = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}

/** Últimas N claves de semana hasta hoy, en orden cronológico. */
export function ultimasSemanas(n = 8) {
  const out = [];
  const hoy = new Date();
  for (let i = n - 1; i >= 0; i--) {
    out.push(claveSemana(new Date(hoy.getTime() - i * 7 * 86400000)));
  }
  return out;
}

/**
 * Exporta filas a CSV y dispara la descarga en el navegador.
 * columnas: [{ key: "nombre", label: "Nombre" }, ...] — el valor puede ser
 * función (fila) => valor para campos calculados.
 */
export function exportarCSV(nombreArchivo, columnas, filas) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const encabezado = columnas.map((c) => esc(c.label)).join(",");
  const cuerpo = filas.map((f) =>
    columnas.map((c) => esc(typeof c.key === "function" ? c.key(f) : f[c.key])).join(",")
  );
  // BOM para que Excel abra acentos correctamente
  const csv = "﻿" + [encabezado, ...cuerpo].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo.endsWith(".csv") ? nombreArchivo : `${nombreArchivo}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Barra de tendencia simple para tablas (porcentaje 0-100 del máximo). */
export function pctDelMax(valor, valores) {
  const max = Math.max(...valores, 1);
  return Math.round(((valor || 0) / max) * 100);
}
