// new Date("2026-09-04") lo interpreta el navegador como medianoche UTC.
// En México (UTC-6) eso ya es el día ANTERIOR, así que las fechas de
// mantenimiento, de compra y de validez de las cotizaciones se mostraban
// todas un día antes de lo que el usuario había escrito.
export function fechaLocal(valor) {
  if (!valor) return null;
  if (valor?.toDate) return valor.toDate();              // Timestamp de Firestore
  if (valor instanceof Date) return valor;
  if (typeof valor === "string") {
    const soloFecha = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor.trim());
    if (soloFecha) {
      const [, a, m, d] = soloFecha;
      return new Date(Number(a), Number(m) - 1, Number(d));   // medianoche LOCAL
    }
  }
  const f = new Date(valor);
  return isNaN(f.getTime()) ? null : f;
}

const OPCIONES = { day: "2-digit", month: "short", year: "numeric" };

export function fmtFecha(valor, opciones = OPCIONES) {
  const f = fechaLocal(valor);
  return f ? f.toLocaleDateString("es-MX", opciones) : "—";
}

export function fmtFechaLarga(valor) {
  return fmtFecha(valor, { day: "2-digit", month: "long", year: "numeric" });
}
