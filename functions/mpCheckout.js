// Elección de la URL de checkout que devuelve Mercado Pago al crear una
// preaprobación.
//
// Con credenciales de prueba hay que mandar al checkout de sandbox: el
// init_point de producción no reconoce a los usuarios de prueba y deja al
// pagador atorado pidiéndole la cuenta una y otra vez. Vive aparte para
// poder probarlo sin levantar firebase-admin.

/**
 * @param {object} data   Respuesta de POST /preapproval.
 * @param {string} token  Access token de Mercado Pago (TEST- en pruebas).
 * @returns {string|null} URL a la que redirigir, o null si MP no devolvió una.
 */
function elegirCheckout(data, token) {
  if (!data || typeof data !== "object") return null;
  const esPrueba = typeof token === "string" && token.startsWith("TEST-");
  const url = (esPrueba && data.sandbox_init_point) || data.init_point;
  return typeof url === "string" && url ? url : null;
}

module.exports = { elegirCheckout };
