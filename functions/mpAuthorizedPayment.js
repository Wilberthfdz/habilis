// Lectura de un "cobro programado" (authorized_payment) de una suscripción
// de Mercado Pago.
//
// El webhook `subscription_authorized_payment` manda en `data.id` el id del
// COBRO, no el del pago. Pedirle ese id a /v1/payments devuelve 404 — es
// exactamente lo que se veía en los logs ("respondió 404" una y otra vez) —
// así que hay que resolverlo en dos pasos: /authorized_payments/{id} trae el
// `payment.id` real, y ese sí se puede consultar.
//
// Vive aparte para poder probarlo sin red ni firebase-admin.

/**
 * Normaliza la respuesta de GET /authorized_payments/{id}.
 *
 * @param {object} ap Cuerpo devuelto por Mercado Pago.
 * @returns {object|null} Datos del cobro, o null si no vino nada usable.
 */
function datosCobroRecurrente(ap) {
  if (!ap || typeof ap !== "object" || Array.isArray(ap)) return null;

  // El id del pago llega como número; las URLs y Firestore lo quieren string.
  const idPago = ap.payment?.id;
  const paymentId =
    idPago === undefined || idPago === null || idPago === "" ? null : String(idPago);

  return {
    preapprovalId: ap.preapproval_id || null,
    paymentId,
    // scheduled | processed | recycling | cancelled
    estado: ap.status || null,
    // approved | rejected | pending | ...
    estadoPago: ap.payment?.status || null,
    // p.ej. cc_rejected_high_risk — el motivo real del rechazo
    detallePago: ap.payment?.status_detail || null,
    intento: Number.isFinite(ap.retry_attempt) ? ap.retry_attempt : null,
    proximoIntento: ap.next_retry_date || null,
    monto: Number.isFinite(ap.transaction_amount) ? ap.transaction_amount : null,
    moneda: ap.currency_id || null,
  };
}

/**
 * Arma la línea de log de un cobro que no terminó aprobado. Dice de un
 * vistazo lo que antes obligaba a abrir el panel de Mercado Pago: por qué se
 * rechazó, cuántos intentos lleva y cuándo vuelve a intentarlo.
 *
 * @param {string|number} apId  id del authorized_payment notificado.
 * @param {object|null} cobro   Salida de datosCobroRecurrente().
 * @returns {string}
 */
function resumenCobro(apId, cobro) {
  if (!cobro) return `cobro ${apId}: Mercado Pago no devolvió datos.`;

  const partes = [
    `cobro ${apId}`,
    cobro.preapprovalId ? `suscripción ${cobro.preapprovalId}` : "sin suscripción",
    cobro.paymentId ? `pago ${cobro.paymentId}` : "sin pago asociado",
    `estado ${cobro.estado || "desconocido"}`,
  ];
  if (cobro.estadoPago) {
    partes.push(
      `resultado ${cobro.estadoPago}${cobro.detallePago ? ` (${cobro.detallePago})` : ""}`);
  }
  if (cobro.monto !== null) partes.push(`${cobro.monto} ${cobro.moneda || ""}`.trim());
  if (cobro.intento !== null) partes.push(`intento ${cobro.intento}`);
  if (cobro.proximoIntento) partes.push(`próximo reintento ${cobro.proximoIntento}`);
  return partes.join(" · ");
}

module.exports = { datosCobroRecurrente, resumenCobro };
