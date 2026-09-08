// ─── PERFIL INCLUYENTE ────────────────────────────────────────────────────
//
// Un técnico que vive con una discapacidad puede decirlo en su perfil y
// aparecer en la búsqueda "Habilis Incluyente", pensada para clientes y
// empresas que quieren contratar a personas con discapacidad.
//
// Es un dato personal SENSIBLE (LFPDPPP art. 3, fr. VI: estado de salud).
// Por eso las reglas son estrictas y viven aquí, en un solo lugar:
//
//   · Es voluntario. Nadie lo pide en el alta; es una sección que el
//     técnico decide abrir.
//   · Solo existe si el técnico lo hace público. No se guarda "en privado"
//     para nada: si no quiere que se vea, no se guarda. Así no acumulamos
//     un dato sensible sin finalidad (art. 13, minimización).
//   · Requiere consentimiento expreso (art. 9), con casilla propia y
//     texto propio, separada de los términos generales.
//   · Se retira con un clic: desmarcar borra el bloque entero.
//   · El tipo de discapacidad es opcional. Lo que importa al cliente es
//     "cómo trabajo": qué hace el técnico, qué ajustes necesita y en qué
//     destaca por su forma de trabajar.

export const TIPOS_INCLUSION = [
  ["motriz",      "Motriz"],
  ["visual",      "Visual"],
  ["auditiva",    "Auditiva"],
  ["habla",       "Del habla"],
  ["intelectual", "Intelectual"],
  ["psicosocial", "Psicosocial"],
  ["otra",        "Otra"],
];

export const IDS_INCLUSION = TIPOS_INCLUSION.map(([id]) => id);
export const MAX_COMO_TRABAJO = 500;

export function etiquetaInclusion(id) {
  return (TIPOS_INCLUSION.find(([t]) => t === id) || [])[1] || "";
}

// Convierte lo que capturó el formulario en lo que se escribe en el perfil.
// `sello` es la fecha de consentimiento (serverTimestamp() en producción;
// en pruebas, lo que se le pase).
//
// Devuelve SIEMPRE los dos campos, para que desactivar la sección borre el
// bloque en el mismo guardado y `perfilIncluyente` —el campo que consulta
// la búsqueda— nunca se quede desfasado.
export function camposDeInclusion(valor, sello) {
  const activo = !!(valor && valor.activo && valor.consentimiento);
  if (!activo) return { inclusion: null, perfilIncluyente: false };
  const tipos = [...new Set((valor.tipos || []).filter(t => IDS_INCLUSION.includes(t)))];
  return {
    perfilIncluyente: true,
    inclusion: {
      activo: true,
      consentimiento: true,
      consentimientoFecha: sello,
      tipos,
      comoTrabajo: String(valor.comoTrabajo || "").trim().slice(0, MAX_COMO_TRABAJO),
    },
  };
}

// Lo que el formulario necesita para editar un perfil existente.
export function inclusionDesdePerfil(perfil) {
  const i = perfil?.inclusion;
  if (!i || !i.activo) return { activo: false, consentimiento: false, tipos: [], comoTrabajo: "" };
  return {
    activo: true,
    consentimiento: i.consentimiento === true,
    tipos: (i.tipos || []).filter(t => IDS_INCLUSION.includes(t)),
    comoTrabajo: i.comoTrabajo || "",
  };
}

// Qué le falta al bloque para poder guardarse, o null si está completo.
export function problemaDeInclusion(valor) {
  if (!valor?.activo) return null;
  if (!valor.consentimiento) return "Para activar tu perfil incluyente necesitas dar tu consentimiento expreso.";
  return null;
}
