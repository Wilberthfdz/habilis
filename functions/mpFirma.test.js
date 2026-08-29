// Pruebas de la validación de firma de webhooks de Mercado Pago.
// Ejecutar: node --test functions/

const test = require("node:test");
const assert = require("node:assert");
const crypto = require("crypto");
const { firmaMPValida } = require("./mpFirma");

const SECRETO = "clave-de-prueba-del-webhook";

// Construye una cabecera x-signature legítima, como la mandaría Mercado Pago.
function firmar(dataId, requestId, ts = "1700000000", secreto = SECRETO) {
  const manifiesto = `id:${String(dataId).toLowerCase()};request-id:${requestId};ts:${ts};`;
  const v1 = crypto.createHmac("sha256", secreto).update(manifiesto).digest("hex");
  return { "x-signature": `ts=${ts},v1=${v1}`, "x-request-id": requestId };
}

test("acepta una firma legítima", () => {
  const headers = firmar("12345", "req-abc");
  assert.strictEqual(firmaMPValida(headers, "12345", SECRETO), true);
});

test("acepta ids alfanuméricos comparando en minúsculas", () => {
  const headers = firmar("ABC123", "req-abc");
  assert.strictEqual(firmaMPValida(headers, "ABC123", SECRETO), true);
});

test("rechaza una firma calculada con otro secreto", () => {
  const headers = firmar("12345", "req-abc", "1700000000", "secreto-del-atacante");
  assert.strictEqual(firmaMPValida(headers, "12345", SECRETO), false);
});

test("rechaza si el id no corresponde al firmado", () => {
  const headers = firmar("12345", "req-abc");
  assert.strictEqual(firmaMPValida(headers, "99999", SECRETO), false);
});

test("rechaza si el request-id no corresponde al firmado", () => {
  const headers = firmar("12345", "req-abc");
  assert.strictEqual(firmaMPValida({ ...headers, "x-request-id": "req-otro" }, "12345", SECRETO), false);
});

test("rechaza si alteran el timestamp", () => {
  const headers = firmar("12345", "req-abc", "1700000000");
  headers["x-signature"] = headers["x-signature"].replace("ts=1700000000", "ts=1700009999");
  assert.strictEqual(firmaMPValida(headers, "12345", SECRETO), false);
});

test("rechaza cuando falta la cabecera de firma", () => {
  assert.strictEqual(firmaMPValida({ "x-request-id": "req-abc" }, "12345", SECRETO), false);
  assert.strictEqual(firmaMPValida({}, "12345", SECRETO), false);
});

test("rechaza firmas mal formadas sin romperse", () => {
  for (const firma of ["", "basura", "ts=1700000000", "v1=abc", "ts=,v1=", "=,="]) {
    assert.strictEqual(
      firmaMPValida({ "x-signature": firma, "x-request-id": "req-abc" }, "12345", SECRETO),
      false, `debió rechazar: "${firma}"`);
  }
});

test("rechaza una v1 de longitud distinta sin lanzar excepción", () => {
  const headers = { "x-signature": "ts=1700000000,v1=abc", "x-request-id": "req-abc" };
  assert.strictEqual(firmaMPValida(headers, "12345", SECRETO), false);
});

test("rechaza si no hay secreto configurado", () => {
  const headers = firmar("12345", "req-abc");
  assert.strictEqual(firmaMPValida(headers, "12345", ""), false);
  assert.strictEqual(firmaMPValida(headers, "12345", undefined), false);
});

test("rechaza si no viene id", () => {
  const headers = firmar("12345", "req-abc");
  assert.strictEqual(firmaMPValida(headers, undefined, SECRETO), false);
  assert.strictEqual(firmaMPValida(headers, null, SECRETO), false);
});

test("tolera que falte x-request-id firmando cadena vacía", () => {
  const ts = "1700000000";
  const manifiesto = `id:12345;request-id:;ts:${ts};`;
  const v1 = crypto.createHmac("sha256", SECRETO).update(manifiesto).digest("hex");
  assert.strictEqual(
    firmaMPValida({ "x-signature": `ts=${ts},v1=${v1}` }, "12345", SECRETO), true);
});
