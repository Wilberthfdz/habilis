# Asistente "manos libres" por WhatsApp

Diseño técnico para que un técnico opere Habilis **sin tocar la pantalla**:
manda un audio por WhatsApp y la plataforma registra el trabajo, arma la
cotización o le hace las preguntas del diagnóstico. Pensado primero para
técnicos con discapacidad motriz o visual, útil para cualquiera que trabaja
con las manos ocupadas.

Este documento es la especificación. **El código no está construido** porque
depende de una cuenta de WhatsApp Business que todavía no existe (ver
"Qué necesita el dueño"). Lo que sí existe hoy y se reutiliza: el dictado por
voz dentro de la app (`transcribirRegistro`, `transcribirTrabajo`), el
moderador de trabajos, el perfil incluyente y la búsqueda Habilis Incluyente.

## Qué NO va a hacer (y por qué)

La propuesta original incluía tres cosas que en Habilis no existen y que no
se van a prometer:

| Idea | Por qué no |
|---|---|
| "Sumar $1,200 al balance del técnico" | Habilis **no intermedia pagos** entre cliente y técnico (Términos para Técnicos §2). No hay balance. El monto se guarda como dato del trabajo, nada más. |
| "Consultar la base de precios de CTRL+W" | No es un proveedor de Habilis ni hay integración. La cotización por voz usa los precios que dicta el técnico. |
| "Deducir impuestos por contratar técnicos con discapacidad" | El estímulo del art. 186 LISR aplica a **patrones con trabajadores** con discapacidad, no a quien contrata a un proveedor independiente. No se dice en ningún texto público. |

## Flujo

```
Técnico ──audio──▶ WhatsApp Cloud API ──webhook──▶ Cloud Function webhookWhatsApp
                                                        │
                                   1. verifica firma X-Hub-Signature-256
                                   2. resuelve el teléfono → uid (tecnicos.telefonoWA)
                                   3. descarga el .ogg por Graph API
                                   4. Gemini: audio → JSON estructurado (prompt abajo)
                                   5. según `action`:
                                        · registrar_trabajo → crea trabajos/{id} en estado
                                          "pendiente" (el agente moderador ya lo revisa)
                                        · cotizar → crea cotizaciones/{id} en "borrador"
                                        · diagnostico → guarda la respuesta y manda la
                                          siguiente pregunta
                                        · desconocido → pide que lo repita
                                   6. responde por WhatsApp: texto corto + audio TTS opcional
```

Reglas de seguridad del flujo:

- El teléfono se vincula **una sola vez desde la app** (el técnico escribe su
  número en Editar perfil y confirma un código que le llega por WhatsApp).
  Un número no vinculado recibe "No reconozco este número. Vincúlalo desde tu
  perfil en myhabilis.com" y nada más.
- Todo lo que crea el asistente nace en **borrador o pendiente**. Nada se
  publica ni se envía al cliente sin que el técnico lo confirme (por voz:
  "sí, publícalo" / por app).
- El audio se borra después de transcribirlo. Se conserva solo la
  transcripción, como parte del trabajo.
- Los secretos (`WA_TOKEN`, `WA_APP_SECRET`, `WA_VERIFY_TOKEN`,
  `WA_PHONE_ID`) van a Secret Manager con `firebase functions:secrets:set`,
  nunca al repositorio ni al chat.

## System prompt para Gemini (en inglés, como pediste)

```text
You are the intake engine of Habilis, a Mexican marketplace where independent
tradespeople (electricians, HVAC, plumbers, welders, etc.) document their work.
You receive the transcript of a voice note sent by a technician over WhatsApp,
in Mexican Spanish, often informal and with trade slang.

Your ONLY job is to convert it into a JSON object. Never chat, never add text
outside the JSON, never invent data that is not in the transcript.

Output schema (all keys required; use null when the information is absent):

{
  "action": "registrar_trabajo" | "cotizar" | "diagnostico" | "desconocido",
  "confidence": 0.0-1.0,
  "trabajo": {
    "titulo": string|null,          // short, e.g. "Cambio de capacitor de arranque en minisplit"
    "problema": string|null,        // what was wrong, in the technician's words, cleaned up
    "solucion": string|null,        // what was done
    "zona": string|null,            // neighbourhood / supermanzana / colonia ONLY, never a street address
    "monto_mxn": number|null,       // amount the client paid, if stated
    "metodo_pago": "efectivo"|"transferencia"|"tarjeta"|null,
    "fecha_relativa": string|null   // "hoy", "ayer", "el martes"; do not resolve to a date
  },
  "cotizacion": {
    "cliente_nombre": string|null,
    "partidas": [ { "concepto": string, "cantidad": number, "precio_unitario_mxn": number|null } ],
    "notas": string|null
  },
  "diagnostico": {
    "equipo": string|null,          // "minisplit 1 ton", "bomba sumergible"
    "lecturas": [ { "parametro": string, "valor": string } ],   // "voltaje compresor": "220 V"
    "siguiente_pregunta": string|null   // the single most useful next question, in Spanish
  },
  "pregunta_para_el_tecnico": string|null   // if something essential is missing or ambiguous
}

Rules:
1. Choose "registrar_trabajo" when the technician reports a job that is
   finished or in progress. Choose "cotizar" when they list parts, prices or
   ask to build a quote. Choose "diagnostico" when they describe measurements
   or symptoms without a finished job. Otherwise "desconocido".
2. Keep the technician's meaning; fix grammar, expand obvious abbreviations
   ("Sm. 75" -> "Supermanzana 75"), keep trade terms as they are.
3. Amounts: parse "mil doscientos", "1,200", "$1200" to 1200. Never guess.
4. Privacy: if the transcript contains a full street address, a phone number,
   an ID number, a bank account, or a person's health information, do NOT
   copy it into any field. Put "dato_sensible_omitido" in pregunta_para_el_tecnico
   explaining what was left out.
5. Never mention money owed to or by Habilis; the platform does not handle
   payments between the technician and the client.
6. confidence below 0.6 means the caller must ask the technician to confirm
   before saving anything.
```

Respuesta sugerida al técnico (la genera la función, no el modelo):

> Registré "Cambio de capacitor de arranque en minisplit" en Supermanzana 75,
> $1,200 en efectivo. Quedó pendiente de revisión. Di "publícalo" para
> confirmarlo o "corrige" para cambiar algo.

## Esquema de datos (Firestore)

### `tecnicos/{uid}` — campos que agrega este módulo

```jsonc
{
  "telefonoWA": "+5299812345678",     // E.164, vinculado con código; único por técnico
  "telefonoWAVerificado": true,
  "telefonoWAFecha": "<timestamp>",
  "asistenteVoz": {                   // preferencias
    "respuestaAudio": true,           // además del texto, mandar audio TTS
    "idioma": "es-MX"
  }
}
```

### `tecnicos/{uid}.inclusion` — perfil incluyente (YA CONSTRUIDO)

```jsonc
{
  "perfilIncluyente": true,           // campo indexado que consulta la búsqueda
  "inclusion": {
    "activo": true,
    "consentimiento": true,           // casilla propia, separada de los términos
    "consentimientoFecha": "<timestamp de servidor>",
    "tipos": ["motriz"],              // opcional: motriz|visual|auditiva|habla|intelectual|psicosocial|otra
    "comoTrabajo": "Diagnóstico y reparación de tarjetas en mi taller; me comunico mejor por escrito."
  }
}
```

Reglas (`firestore.rules`, ya desplegables): solo el dueño lo escribe; la
marca `perfilIncluyente` solo puede ser verdadera si el bloque existe, está
activo, tiene consentimiento y fecha de servidor; desactivar borra el bloque.
No se guarda el dato "en privado": si no se muestra, no existe (minimización,
LFPDPPP art. 13).

### `conversaciones_wa/{telefono}` — estado del diálogo por voz

```jsonc
{
  "uid": "…",
  "modo": "diagnostico" | null,       // si hay un diagnóstico guiado en curso
  "diagnosticoId": "…",
  "pendienteConfirmar": { "tipo": "trabajo", "id": "…", "hasta": "<timestamp>" },
  "ultimoMensaje": "<timestamp>"
}
```

### `diagnosticos/{id}` — bitácora guiada

```jsonc
{
  "tecnicoId": "…",
  "equipo": "minisplit 1 ton",
  "lecturas": [ { "parametro": "voltaje compresor", "valor": "220 V", "fecha": "<ts>" } ],
  "estado": "abierto" | "cerrado",
  "trabajoId": null                   // se enlaza cuando el diagnóstico termina en un trabajo
}
```

Los trabajos y cotizaciones creados por voz usan las colecciones que ya
existen (`trabajos`, `cotizaciones`) con un campo extra `origen: "whatsapp"`
y `transcripcion: "…"`.

## Qué necesita el dueño antes de que se pueda programar y probar

1. **Cuenta de WhatsApp Business Platform** (Meta for Developers): app,
   número de teléfono dedicado (no el personal), verificación del negocio.
   La verificación de negocio pide documentos de la empresa; con la S.A.P.I.
   en trámite se puede iniciar con el RFC de persona física del operador
   provisional.
2. Tokens: token permanente del sistema, `App Secret` y un `Verify Token`
   propio. Van a Secret Manager, no al chat.
3. Plantillas de mensaje aprobadas por Meta para el código de vinculación.
4. Decisión de producto: ¿el asistente confirma por voz ("publícalo") o
   siempre desde la app? Recomiendo por voz con ventana de 15 minutos.
5. Presupuesto: Meta cobra por conversación iniciada por la empresa; las
   respuestas dentro de 24 h de un mensaje del técnico no cuestan. Gemini
   con audio cuesta por minuto; un audio de 30 s vale fracciones de centavo.

Cuando exista la cuenta, el orden de construcción es: vinculación de
teléfono → webhook con verificación de firma → `registrar_trabajo` →
confirmación por voz → `cotizar` → `diagnostico` → TTS.
