// Pruebas de la elección de URL de checkout de Mercado Pago.
// Ejecutar: npm test

const test = require("node:test");
const assert = require("node:assert");
const { elegirCheckout } = require("./mpCheckout");

const PROD = "https://www.mercadopago.com.mx/subscriptions/checkout?preapproval_id=abc";
const SANDBOX = "https://sandbox.mercadopago.com.mx/subscriptions/checkout?preapproval_id=abc";
const TOKEN_PRUEBA = "TEST-6384475498145034-082819-abc";
const TOKEN_PROD = "APP_USR-6384475498145034-082819-abc";

test("con credenciales de prueba usa el checkout de sandbox", () => {
  const data = { init_point: PROD, sandbox_init_point: SANDBOX };
  assert.strictEqual(elegirCheckout(data, TOKEN_PRUEBA), SANDBOX);
});

test("con credenciales de producción usa el checkout normal", () => {
  const data = { init_point: PROD, sandbox_init_point: SANDBOX };
  assert.strictEqual(elegirCheckout(data, TOKEN_PROD), PROD);
});

test("en pruebas cae al init_point si MP no manda sandbox", () => {
  assert.strictEqual(elegirCheckout({ init_point: PROD }, TOKEN_PRUEBA), PROD);
});

test("en producción nunca usa el sandbox aunque venga", () => {
  const data = { sandbox_init_point: SANDBOX };
  assert.strictEqual(elegirCheckout(data, TOKEN_PROD), null);
});

test("devuelve null cuando MP responde con error", () => {
  const error = { message: "invalid_payer_email", error: "bad_request", status: 400 };
  assert.strictEqual(elegirCheckout(error, TOKEN_PRUEBA), null);
  assert.strictEqual(elegirCheckout(error, TOKEN_PROD), null);
});

test("devuelve null ante respuestas vacías o mal formadas", () => {
  for (const data of [null, undefined, {}, "texto", 42, []]) {
    assert.strictEqual(elegirCheckout(data, TOKEN_PRUEBA), null, `debió ser null: ${JSON.stringify(data)}`);
  }
});

test("ignora URLs vacías o de tipo incorrecto", () => {
  assert.strictEqual(elegirCheckout({ init_point: "" }, TOKEN_PROD), null);
  assert.strictEqual(elegirCheckout({ init_point: 123 }, TOKEN_PROD), null);
  // sandbox vacío en pruebas: cae al de producción
  assert.strictEqual(elegirCheckout({ init_point: PROD, sandbox_init_point: "" }, TOKEN_PRUEBA), PROD);
});

test("sin token tratable lo considera producción", () => {
  const data = { init_point: PROD, sandbox_init_point: SANDBOX };
  assert.strictEqual(elegirCheckout(data, undefined), PROD);
  assert.strictEqual(elegirCheckout(data, ""), PROD);
});
