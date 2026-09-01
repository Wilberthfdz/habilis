// Pruebas de la validación de firma de webhooks de Mercado Pago.
// Ejecutar: node --test functions/

const test = require("node:test");
const assert = require("node:assert");
const crypto = require("crypto");
const { firmaMPValida, revisarFirmaMP, TOLERANCIA_SEGUNDOS } = require("./mpFirma");

const SECRETO = "clave-de-prueba-del-webhook";

// Ahora que la firma caduca, un `ts` fijo en el pasado haría fallar a todas
// las pruebas por un motivo que no es el que cada una quiere comprobar.
const ahoraSegundos = () => String(Math.floor(Date.now() / 1000));

// Construye una cabecera x-signature legítima, como la mandaría Mercado Pago.
function firmar(dataId, requestId, ts = ahoraSegundos(), secreto = SECRETO) {
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
  // El ts alterado sigue dentro de la ventana: así se comprueba que lo que
  // rechaza es el HMAC y no la caducidad.
  const ts = ahoraSegundos();
  const alterado = String(Number(ts) + 30);
  const headers = firmar("12345", "req-abc", ts);
  headers["x-signature"] = headers["x-signature"].replace(`ts=${ts}`, `ts=${alterado}`);
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
  const ts = ahoraSegundos();
  const manifiesto = `id:12345;request-id:;ts:${ts};`;
  const v1 = crypto.createHmac("sha256", SECRETO).update(manifiesto).digest("hex");
  assert.strictEqual(
    firmaMPValida({ "x-signature": `ts=${ts},v1=${v1}` }, "12345", SECRETO), true);
});

// ── Ventana de tiempo: lo que impide el reenvío ──────────────────────────
// El reloj se inyecta para no depender de la hora real de la máquina.

test("rechaza un evento reenviado fuera de la ventana", () => {
  const ts = "1700000000";
  const headers = firmar("12345", "req-abc", ts);
  const ahora = (Number(ts) + 900) * 1000; // 15 minutos después
  const r = revisarFirmaMP(headers, "12345", SECRETO, { ahora });
  assert.strictEqual(r.valida, false);
  assert.strictEqual(r.motivo, "caducada");
  assert.strictEqual(r.antiguedadSegundos, 900);
});

test("acepta un evento dentro de la ventana de 300 s", () => {
  const ts = "1700000000";
  const headers = firmar("12345", "req-abc", ts);
  const ahora = (Number(ts) + 299) * 1000;
  assert.strictEqual(firmaMPValida(headers, "12345", SECRETO, { ahora }), true);
});

test("el límite exacto de la ventana todavía se acepta", () => {
  const ts = "1700000000";
  const headers = firmar("12345", "req-abc", ts);
  const ahora = (Number(ts) + TOLERANCIA_SEGUNDOS) * 1000;
  assert.strictEqual(firmaMPValida(headers, "12345", SECRETO, { ahora }), true);
});

test("tampoco acepta un timestamp del futuro por desfase de reloj", () => {
  const ts = "1700000000";
  const headers = firmar("12345", "req-abc", ts);
  const ahora = (Number(ts) - 900) * 1000; // el evento viene 15 min adelantado
  assert.strictEqual(firmaMPValida(headers, "12345", SECRETO, { ahora }), false);
});

test("rechaza un ts que no es numérico", () => {
  const headers = { "x-signature": "ts=ayer,v1=abc123", "x-request-id": "req-abc" };
  assert.strictEqual(revisarFirmaMP(headers, "12345", SECRETO).motivo, "ts_no_numerico");
});

test("la tolerancia se puede ajustar por parámetro", () => {
  const ts = "1700000000";
  const headers = firmar("12345", "req-abc", ts);
  const ahora = (Number(ts) + 600) * 1000;
  assert.strictEqual(firmaMPValida(headers, "12345", SECRETO, { ahora }), false);
  assert.strictEqual(
    firmaMPValida(headers, "12345", SECRETO, { ahora, toleranciaSegundos: 900 }), true);
});

test("distingue el motivo de cada rechazo", () => {
  const headers = firmar("12345", "req-abc");
  assert.strictEqual(revisarFirmaMP(headers, "12345", SECRETO).motivo, null);
  assert.strictEqual(revisarFirmaMP(headers, "12345", "").motivo, "sin_secreto");
  assert.strictEqual(revisarFirmaMP(headers, null, SECRETO).motivo, "sin_id");
  assert.strictEqual(revisarFirmaMP({}, "12345", SECRETO).motivo, "sin_cabecera");
  assert.strictEqual(
    revisarFirmaMP({ "x-signature": "basura" }, "12345", SECRETO).motivo, "cabecera_mal_formada");
  assert.strictEqual(revisarFirmaMP(headers, "99999", SECRETO).motivo, "no_coincide");
});
