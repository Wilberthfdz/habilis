// Pruebas de la lectura de cobros recurrentes de Mercado Pago.
// Ejecutar: npm test

const test = require("node:test");
const assert = require("node:assert");
const { datosCobroRecurrente, resumenCobro } = require("./mpAuthorizedPayment");

// Respuesta real de GET /authorized_payments/7031396727 (30 ago 2026), el
// cobro que se veía en los logs como "/v1/payments/7031396727 respondió 404".
const COBRO_RECHAZADO = {
  preapproval_id: "2179039a3c814a6196d5dc8a0afe3e3e",
  date_created: "2026-08-30T18:40:11.000-04:00",
  transaction_amount: 49.9,
  currency_id: "MXN",
  status: "recycling",
  retry_attempt: 1,
  next_retry_date: "2026-09-02T18:40:11.000-04:00",
  payment: { id: 176420323148, status: "rejected", status_detail: "cc_rejected_high_risk" },
};

const COBRO_APROBADO = {
  preapproval_id: "6d0a7955c8d14077b52241d0439016b9",
  transaction_amount: 149,
  currency_id: "MXN",
  status: "processed",
  retry_attempt: 0,
  payment: { id: 176399264956, status: "approved", status_detail: "accredited" },
};

test("saca el id del pago real, que es lo que /v1/payments sí acepta", () => {
  const c = datosCobroRecurrente(COBRO_RECHAZADO);
  assert.strictEqual(c.paymentId, "176420323148");
  assert.strictEqual(c.preapprovalId, "2179039a3c814a6196d5dc8a0afe3e3e");
});

test("el id del pago siempre sale como string, aunque MP lo mande numérico", () => {
  assert.strictEqual(typeof COBRO_APROBADO.payment.id, "number");
  assert.strictEqual(datosCobroRecurrente(COBRO_APROBADO).paymentId, "176399264956");
});

test("conserva el motivo del rechazo y el ciclo de reintentos", () => {
  const c = datosCobroRecurrente(COBRO_RECHAZADO);
  assert.strictEqual(c.estado, "recycling");
  assert.strictEqual(c.estadoPago, "rejected");
  assert.strictEqual(c.detallePago, "cc_rejected_high_risk");
  assert.strictEqual(c.intento, 1);
  assert.strictEqual(c.proximoIntento, "2026-09-02T18:40:11.000-04:00");
  assert.strictEqual(c.monto, 49.9);
  assert.strictEqual(c.moneda, "MXN");
});

test("un cobro aprobado se distingue del rechazado", () => {
  const c = datosCobroRecurrente(COBRO_APROBADO);
  assert.strictEqual(c.estadoPago, "approved");
  assert.strictEqual(c.intento, 0);
  assert.strictEqual(c.proximoIntento, null);
});

test("un cobro programado todavía sin pago no inventa un paymentId", () => {
  const c = datosCobroRecurrente({ preapproval_id: "abc", status: "scheduled" });
  assert.strictEqual(c.paymentId, null);
  assert.strictEqual(c.estadoPago, null);
  assert.strictEqual(c.intento, null);
});

test("devuelve null ante respuestas vacías o mal formadas", () => {
  for (const ap of [null, undefined, "texto", 42, []]) {
    assert.strictEqual(datosCobroRecurrente(ap), null, `debió ser null: ${JSON.stringify(ap)}`);
  }
});

test("un objeto vacío da todos los campos en null, no undefined sueltos", () => {
  const c = datosCobroRecurrente({});
  assert.deepStrictEqual(c, {
    preapprovalId: null, paymentId: null, estado: null, estadoPago: null,
    detallePago: null, intento: null, proximoIntento: null, monto: null, moneda: null,
  });
});

test("un 404 de MP (mpGet devuelve null) no revienta el resumen", () => {
  assert.match(resumenCobro("7031396727", null), /no devolvió datos/);
});

test("el resumen dice el motivo, el intento y el próximo reintento", () => {
  const linea = resumenCobro("7031396727", datosCobroRecurrente(COBRO_RECHAZADO));
  assert.match(linea, /cc_rejected_high_risk/);
  assert.match(linea, /pago 176420323148/);
  assert.match(linea, /intento 1/);
  assert.match(linea, /próximo reintento/);
  assert.match(linea, /49\.9 MXN/);
});

test("el resumen no se rompe si falta casi todo", () => {
  const linea = resumenCobro("x", datosCobroRecurrente({ status: "cancelled" }));
  assert.match(linea, /sin suscripción/);
  assert.match(linea, /sin pago asociado/);
  assert.match(linea, /estado cancelled/);
});
