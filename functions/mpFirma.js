// Validación de la firma `x-signature` de los webhooks de Mercado Pago.
//
// MP firma cada notificación con HMAC-SHA256 sobre un manifiesto formado por
// el id del recurso, el `x-request-id` y el timestamp de la propia firma.
// Vive en su propio módulo para poder probarlo sin levantar firebase-admin.
//
// La firma sola NO impide un reenvío: quien capture una entrega legítima puede
// repetirla tal cual y el HMAC seguirá cuadrando para siempre. Por eso además
// se exige que el `ts` sea reciente. Mercado Pago recomienda 5 minutos.

const crypto = require("crypto");

// Ventana que Mercado Pago recomienda para aceptar una notificación.
const TOLERANCIA_SEGUNDOS = 300;

/**
 * Revisa la firma y dice POR QUÉ falla, para que quien llame pueda registrar
 * algo más útil que "firma inválida" — un evento caducado y una firma que no
 * cuadra son problemas distintos y se arreglan de forma distinta.
 *
 * @param {object} headers  Cabeceras de la petición (req.headers).
 * @param {string} dataId   id del recurso notificado (body.data.id).
 * @param {string} secreto  Clave secreta del webhook (MP_WEBHOOK_SECRET).
 * @param {{ahora?: number, toleranciaSegundos?: number}} [opciones]
 *        `ahora` en milisegundos (inyectable para poder probar la ventana).
 * @returns {{valida: boolean, motivo: string|null, antiguedadSegundos?: number}}
 */
function revisarFirmaMP(headers, dataId, secreto, opciones = {}) {
  if (!secreto) return { valida: false, motivo: "sin_secreto" };
  if (dataId === undefined || dataId === null) return { valida: false, motivo: "sin_id" };

  const firma = headers?.["x-signature"];
  if (!firma || typeof firma !== "string") return { valida: false, motivo: "sin_cabecera" };

  let ts, v1;
  for (const parte of firma.split(",")) {
    const i = parte.indexOf("=");
    if (i === -1) continue;
    const clave = parte.slice(0, i).trim();
    const valor = parte.slice(i + 1).trim();
    if (clave === "ts") ts = valor;
    if (clave === "v1") v1 = valor;
  }
  if (!ts || !v1) return { valida: false, motivo: "cabecera_mal_formada" };

  // La ventana se comprueba ANTES del HMAC: un evento caducado se descarta
  // aunque venga perfectamente firmado, que es exactamente el caso de un
  // reenvío. El `ts` lo manda quien llama, así que no hay nada que filtrar
  // al mirarlo antes. Se usa el valor absoluto para no aceptar tampoco un
  // timestamp del futuro por desfase de reloj.
  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) return { valida: false, motivo: "ts_no_numerico" };

  const tolerancia = Number.isFinite(opciones.toleranciaSegundos)
    ? opciones.toleranciaSegundos
    : TOLERANCIA_SEGUNDOS;
  const ahora = Number.isFinite(opciones.ahora) ? opciones.ahora : Date.now();
  const antiguedad = Math.abs(ahora / 1000 - tsNum);
  if (antiguedad > tolerancia) {
    return { valida: false, motivo: "caducada", antiguedadSegundos: Math.round(antiguedad) };
  }

  const requestId = headers["x-request-id"] || "";
  // El id va en minúsculas en el manifiesto, según la documentación de MP.
  const manifiesto = `id:${String(dataId).toLowerCase()};request-id:${requestId};ts:${ts};`;
  const esperado = crypto.createHmac("sha256", secreto).update(manifiesto).digest("hex");

  const a = Buffer.from(esperado, "utf8");
  const b = Buffer.from(v1, "utf8");
  const coincide = a.length === b.length && crypto.timingSafeEqual(a, b);
  return coincide ? { valida: true, motivo: null } : { valida: false, motivo: "no_coincide" };
}

/**
 * @returns {boolean} true solo si la firma corresponde al manifiesto y el
 *          evento está dentro de la ventana de tiempo.
 */
function firmaMPValida(headers, dataId, secreto, opciones) {
  return revisarFirmaMP(headers, dataId, secreto, opciones).valida;
}

module.exports = { firmaMPValida, revisarFirmaMP, TOLERANCIA_SEGUNDOS };
