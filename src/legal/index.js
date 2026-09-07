// Centro Legal: todos los documentos, en un solo lugar y con una sola
// versión. Cada documento tiene su propia URL (/legal/<slug>) y aparece en
// el índice agrupado por a quién aplica.
import terminosClientes from "./terminosClientes.js";
import terminosTecnicos from "./terminosTecnicos.js";
import normasComunidad from "./normasComunidad.js";
import calificaciones from "./calificaciones.js";
import suspension from "./suspension.js";
import cancelacion from "./cancelacion.js";
import noDiscriminacion from "./noDiscriminacion.js";
import seguridad from "./seguridad.js";
import contenido from "./contenido.js";
import cookies from "./cookies.js";
import sitio from "./sitio.js";
import privacidadSimplificado from "./privacidadSimplificado.js";

export { FECHA_VIGENCIA, AUDIENCIAS, TITULAR } from "./comun.js";

// El Aviso de Privacidad integral tiene su propia página (/privacidad) por
// ser el documento al que más se enlaza desde fuera; aquí solo se referencia.
export const AVISO_PRIVACIDAD = {
  slug: "privacidad",
  titulo: "Aviso de Privacidad Integral",
  audiencia: "todos",
  resumen: "Qué datos tratamos, para qué, con quién los compartimos, ubicación, cookies, conservación y tus derechos ARCO.",
  externo: "privacidad",   // pantalla del router, no documento de esta lista
};

export const DOCUMENTOS = [
  terminosClientes,
  terminosTecnicos,
  normasComunidad,
  calificaciones,
  suspension,
  cancelacion,
  noDiscriminacion,
  seguridad,
  contenido,
  AVISO_PRIVACIDAD,
  privacidadSimplificado,
  cookies,
  sitio,
];

export const porSlug = slug => DOCUMENTOS.find(d => d.slug === slug) || null;
