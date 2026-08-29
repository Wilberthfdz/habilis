// Validación de la firma `x-signature` de los webhooks de Mercado Pago.
//
// MP firma cada notificación con HMAC-SHA256 sobre un manifiesto formado por
// el id del recurso, el `x-request-id` y el timestamp de la propia firma.
// Vive en su propio módulo para poder probarlo sin levantar firebase-admin.

const crypto = require("crypto");

/**
 * @param {object} headers  Cabeceras de la petición (req.headers).
 * @param {string} dataId   id del recurso notificado (body.data.id).
 * @param {string} secreto  Clave secreta del webhook (MP_WEBHOOK_SECRET).
 * @returns {boolean} true solo si la firma corresponde al manifiesto.
 */
function firmaMPValida(headers, dataId, secreto) {
  if (!secreto || dataId === undefined || dataId === null) return false;

  const firma = headers?.["x-signature"];
  if (!firma || typeof firma !== "string") return false;

  let ts, v1;
  for (const parte of firma.split(",")) {
    const i = parte.indexOf("=");
    if (i === -1) continue;
    const clave = parte.slice(0, i).trim();
    const valor = parte.slice(i + 1).trim();
    if (clave === "ts") ts = valor;
    if (clave === "v1") v1 = valor;
  }
  if (!ts || !v1) return false;

  const requestId = headers["x-request-id"] || "";
  // El id va en minúsculas en el manifiesto, según la documentación de MP.
  const manifiesto = `id:${String(dataId).toLowerCase()};request-id:${requestId};ts:${ts};`;
  const esperado = crypto.createHmac("sha256", secreto).update(manifiesto).digest("hex");

  const a = Buffer.from(esperado, "utf8");
  const b = Buffer.from(v1, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = { firmaMPValida };
