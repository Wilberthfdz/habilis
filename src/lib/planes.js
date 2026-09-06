// Lo que incluye cada plan, en UN solo sitio. Antes esta lista vivía copiada
// en Precios, SuscripcionPro, el FAQ de Soporte, Cómo funciona y el prompt
// del asistente de soporte, y las cinco copias decían cosas distintas: unas
// vendían como Pro las cotizaciones y Habilis Care (que son gratis) y otras
// prometían "soporte prioritario", que no tiene ningún mecanismo detrás.
//
// Regla para tocar esto: cada línea tiene que corresponder a algo que la
// plataforma haga hoy. Lo que está reservado al Pro es exactamente lo que
// el backend bloquea en IA_SOLO_PRO (functions/index.js).
export const PRECIO_PRO = 100;   // MXN al mes, IVA incluido

export const PLAN_GRATIS = [
  [true,  "Perfil profesional y aparición en búsquedas"],
  [true,  "Hasta 5 trabajos documentados"],
  [true,  "Feed público y chat con clientes"],
  [true,  "Cotizaciones y Habilis Care"],
  [false, "Sin prioridad en las búsquedas"],
  [false, "Sin herramientas de IA"],
];

export const PLAN_PRO = [
  "Trabajos documentados sin límite",
  "Prioridad en los resultados de búsqueda",
  "Insignia Pro en tu perfil y en las búsquedas",
  "Cotizaciones redactadas con IA a partir del problema del cliente",
  "Respuestas sugeridas y resumen del trabajo en el chat",
  "Plan de mantenimiento con IA en Habilis Care",
  "Sugerencias de colaboradores para tu red",
];

// Frase corta para el asistente de soporte y para los avisos de "esto es Pro".
export const RESUMEN_PRO =
  `El Plan Pro cuesta $${PRECIO_PRO} MXN al mes con IVA incluido. Quita el tope de ` +
  "5 trabajos, te da prioridad en las búsquedas, la insignia Pro y todas las " +
  "herramientas de inteligencia artificial. Crear cotizaciones y usar Habilis " +
  "Care no cuesta: lo que agrega Pro es que la IA te ayude con ellas. " +
  "Se cancela desde el panel de suscripción o desde Mercado Pago, y conservas " +
  "los beneficios hasta el fin del periodo ya pagado.";
