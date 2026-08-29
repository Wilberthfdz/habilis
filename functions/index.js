// Habilis — Backend: agentes autónomos de Gemini (triggers de Firestore +
// scheduler), proxy genérico para los usos síncronos existentes, pagos
// (Mercado Pago), facturación (Facturapi) y registro por voz.
//
// Los agentes autónomos NO esperan a que el frontend los llame: reaccionan
// solos a eventos de Firestore, deciden con Gemini, y ejecutan la decisión
// escribiendo en la base de datos. Cada decisión queda en `aiLogs` — esa
// colección es la evidencia de "AI live in production" para el XPRIZE.
//
// IMPORTANTE: los campos que ya usa el estado real de la app (`estado` en
// trabajos/solicitudes, `tipo` en trabajos) NO se tocan — los agentes
// escriben en campos nuevos con sufijo IA para no romper flujos existentes.
//
// Setup (one-time) — ver SETUP_PAGOS.md para el procedimiento completo:
//   firebase functions:secrets:set GEMINI_KEY
//   firebase functions:secrets:set MP_ACCESS_TOKEN
//   firebase functions:secrets:set MP_WEBHOOK_SECRET
//   firebase functions:secrets:set FACTURAPI_KEY
//   firebase functions:secrets:set RESEND_API_KEY

const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const { firmaMPValida } = require("./mpFirma");
const { elegirCheckout } = require("./mpCheckout");
admin.initializeApp();

const GEMINI_KEY = defineSecret("GEMINI_KEY");
const MP_TOKEN = defineSecret("MP_ACCESS_TOKEN");
const MP_WEBHOOK_SECRET = defineSecret("MP_WEBHOOK_SECRET");
const FACTURAPI_KEY = defineSecret("FACTURAPI_KEY");
const RESEND_KEY = defineSecret("RESEND_API_KEY");
// Debe coincidir con el dominio verificado en Resend (Domains → DNS).
const RESEND_FROM = "Habilis <noreply@myhabilis.com>";

const db = admin.firestore();
// gemini-2.0-flash se retiró (404 model-not-found) — reemplazado por
// gemini-3.6-flash, que Google recomienda como sucesor directo.
const GEMINI_MODEL = "gemini-3.6-flash";

// ═══════════════════════════ HELPERS ═══════════════════════════
// gemini-3.6-flash gasta varios cientos de tokens "pensando" antes de dar
// la respuesta (no se puede desactivar con thinkingConfig en este modelo:
// thinkingBudget:0 da 400 invalid-argument, y valores bajos no se respetan
// con precisión). maxTokens debe dejar espacio de sobra para ese consumo
// además de la respuesta real, o la llamada corta en MAX_TOKENS sin JSON.
async function callGemini(prompt, key, { maxTokens = 1500, temperature = 0.4 } = {}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature },
    }),
  });
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    console.error(`Gemini API error ${r.status}: ${body.slice(0, 500)}`); // detalle solo en logs del servidor
    throw new HttpsError("internal", "No se pudo generar la respuesta de IA. Intenta de nuevo.");
  }
  const data = await r.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

function parseJsonLoose(text, fallback) {
  try {
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    return fallback;
  }
}

function requireAuth(request) {
  if (!request.auth) throw new HttpsError("unauthenticated", "Debes iniciar sesión.");
  return request.auth.uid;
}

// Transacción, no get()+set(): con llamadas concurrentes, dos lecturas
// podían ver el mismo conteo por debajo del límite y las dos pasaban, y el
// segundo set() sobrescribía el historial del primero en vez de acumularlo.
async function checkRateLimit(uid, action, maxPerHour = 20) {
  const ref = db.collection("rateLimits").doc(`${uid}_${action}`);
  await db.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    const now = Date.now();
    const hourAgo = now - 3600000;
    const calls = doc.exists ? (doc.data().calls || []).filter((t) => t > hourAgo) : [];
    if (calls.length >= maxPerHour) {
      throw new HttpsError("resource-exhausted", "Límite de uso alcanzado. Intenta en 1 hora.");
    }
    calls.push(now);
    tx.set(ref, { calls });
  });
}

// Evidencia de decisión de agente — leída por el panel admin y por los jueces.
async function logDecision(agente, decision, entidadId, razon) {
  await db.collection("aiLogs").add({
    agente,
    decision,
    entidadId,
    razon: razon || "",
    fecha: admin.firestore.FieldValue.serverTimestamp(),
  });
}

// ═══════════════════════════════════════════════════════════════
// 🎯 AGENTE MATCHING — corre solo al crearse una solicitud
// DECIDE qué técnicos son los mejores y EJECUTA notificándolos.
// Activa por primera vez en producción la lógica de "sugerirTecnicos"
// (antes muerta: existía en el frontend pero nadie la llamaba).
// ═══════════════════════════════════════════════════════════════
// Plan Pro/Empresa promete "4 leads garantizados al mes" (Precios.jsx) —
// antes el plan solo era desempate dentro de un top-3 fijo, así que la
// garantía nunca se cumplía en la práctica. Ahora cualquier técnico Pro o
// Empresa que sea oficio-compatible con la solicitud entra SIEMPRE en la
// notificación mientras no haya usado su cupo del mes; no puede fabricar
// demanda que no existe, pero si la solicitud existe y aplica, no depende
// de que Gemini lo elija entre solo 3.
const MAX_LEADS_MES_GARANTIZADOS = 4;
const MAX_NOTIFICADOS_POR_SOLICITUD = 8; // tope para no saturar en ciudades grandes

exports.agenteMatching = onDocumentCreated(
  { document: "solicitudes/{id}", secrets: [GEMINI_KEY] },
  async (event) => {
    const sol = event.data.data();
    const solId = event.params.id;
    if (sol.asignadoPorIA) return; // evita reprocesar

    const snap = await db.collection("tecnicos").where("disponible", "==", true).limit(60).get();
    const tecnicos = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (tecnicos.length === 0) return;

    const lista = tecnicos
      .map((t) => `ID:${t.id}|${t.nombre}|${t.oficio}|${t.ciudad}|exp:${t.experiencia || 0}a|trabajos:${t.totalTrabajos || 0}|plan:${t.plan}`)
      .join("\n");

    const prompt = `Eres el agente de asignación de Habilis. Un cliente necesita:
"${sol.descripcion || sol.titulo}" (categoría: ${sol.categoria || "sin especificar"}) en ${sol.ciudad || "ciudad no especificada"}.
Técnicos disponibles:
${lista}
Marca TODOS los técnicos cuyo oficio sea razonablemente compatible con esta solicitud (no te limites a 3 — pueden ser 1 o pueden ser 15). Si se especificó ciudad, prioriza esa ciudad o cercanas en el orden, pero no excluyas a los demás si hay pocos compatibles ahí.
Responde SOLO JSON, ordenado del más al menos relevante: {"elegibles":[{"id":"...","razon":"breve"}],"urgenciaIA":"baja|media|alta"}`;

    const out = parseJsonLoose(await callGemini(prompt, GEMINI_KEY.value(), { maxTokens: 2000, temperature: 0.3 }), {
      elegibles: [],
      urgenciaIA: "media",
    });
    const mapTec = Object.fromEntries(tecnicos.map((t) => [t.id, t]));
    const elegibles = (out.elegibles || []).filter((s) => mapTec[s.id]);

    const periodo = new Date().toISOString().slice(0, 7); // "2026-08"
    const bajoCupo = (s) => {
      const t = mapTec[s.id];
      if (t.plan !== "pro" && t.plan !== "empresa") return false;
      const usados = t.leadsMesPeriodo === periodo ? (t.leadsMes || 0) : 0;
      return usados < MAX_LEADS_MES_GARANTIZADOS;
    };

    // Pro/Empresa bajo cupo van primero (garantía real); el resto llena los
    // huecos hasta el tope, en el mismo orden de relevancia que dio Gemini.
    const prioridad = elegibles.filter(bajoCupo);
    const resto = elegibles.filter((s) => !bajoCupo(s));
    const seleccionados = [...prioridad, ...resto].slice(0, MAX_NOTIFICADOS_POR_SOLICITUD);

    await db.collection("solicitudes").doc(solId).update({
      urgenciaIA: out.urgenciaIA,
      tecnicosAsignadosIA: seleccionados.map((s) => s.id),
      asignadoPorIA: true,
    });

    for (const sel of seleccionados) {
      await db.collection("notificaciones").add({
        userId: sel.id,
        tipo: "solicitud",
        mensaje: `🎯 Nueva solicitud para ti: "${(sol.titulo || sol.descripcion || "").slice(0, 60)}". Seleccionado por IA: ${sel.razon}`,
        leida: false,
        link: "feed",
        fecha: admin.firestore.FieldValue.serverTimestamp(),
      });
      if (bajoCupo(sel)) {
        const t = mapTec[sel.id];
        const usados = t.leadsMesPeriodo === periodo ? (t.leadsMes || 0) : 0;
        await db.collection("tecnicos").doc(sel.id).update({
          leadsMes: usados + 1,
          leadsMesPeriodo: periodo,
        });
      }
    }

    await logDecision("matching", `asignó ${seleccionados.length} técnico(s)`, solId, seleccionados.map((s) => s.razon).join("; "));
  }
);

// ═══════════════════════════════════════════════════════════════
// 🛡️ AGENTE MODERADOR+CLASIFICADOR — corre solo al documentarse un trabajo
// DECIDE calidad/categoría/spam y EJECUTA escribiendo el veredicto.
// No toca `estado` ni `tipo` (son del flujo real: pendiente→...→validado,
// y el oficio elegido por el técnico) — escribe en campos *_IA nuevos.
// Activa por primera vez "clasificarTrabajo" y "detectarSpam" (antes muertas).
// ═══════════════════════════════════════════════════════════════
exports.agenteModeradorTrabajos = onDocumentCreated(
  { document: "trabajos/{id}", secrets: [GEMINI_KEY] },
  async (event) => {
    const t = event.data.data();
    const tId = event.params.id;

    const prompt = `Eres el moderador-clasificador de Habilis, plataforma de trabajos técnicos documentados en México.
SOLO se permite contenido real de trabajo técnico. PROHIBIDO: spam, memes, política, insultos, promociones ajenas, contenido no técnico.
Trabajo: título "${t.titulo}", descripción "${t.descripcion || ""}", problema "${t.problema || ""}", solución "${t.solucion || ""}".
DECIDE y responde SOLO JSON:
{"aprobadoIA":true|false,"razonIA":"breve","categoriaIA":"Electricidad|Plomería|HVAC|Redes|Cámaras|Herrería|Tablaroca|Pintura|Mecánica|Otro","urgenciaIA":"baja|media|alta","calidadIA":1-10}`;

    const out = parseJsonLoose(await callGemini(prompt, GEMINI_KEY.value(), { maxTokens: 1300, temperature: 0.1 }), {
      aprobadoIA: true,
      razonIA: "",
      categoriaIA: "Otro",
      urgenciaIA: "media",
      calidadIA: 5,
    });

    await db.collection("trabajos").doc(tId).update({
      aprobadoIA: out.aprobadoIA,
      razonModeracionIA: out.razonIA,
      categoriaIA: out.categoriaIA,
      urgenciaIA: out.urgenciaIA,
      calidadIA: out.calidadIA,
      moderadoPorIA: true,
    });

    if (t.tecnicoId) {
      await db.collection("notificaciones").add({
        userId: t.tecnicoId,
        tipo: "moderacion",
        mensaje: out.aprobadoIA
          ? `✅ Tu trabajo "${t.titulo}" fue revisado por IA (calidad ${out.calidadIA}/10)`
          : `⚠️ Tu trabajo "${t.titulo}" fue marcado por IA: ${out.razonIA}`,
        leida: false,
        link: "panel",
        fecha: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    await logDecision("moderador", out.aprobadoIA ? "APROBÓ" : "MARCÓ", tId, out.razonIA || out.categoriaIA);
  }
);

// ═══════════════════════════════════════════════════════════════
// ✅ AGENTE VERIFICADOR — corre solo al registrarse un técnico nuevo
// DECIDE score inicial y EJECUTA mejorando la bio automáticamente.
// Activa por primera vez "mejorarPerfil" (antes definida pero nunca llamada
// desde ningún flujo del frontend).
// ═══════════════════════════════════════════════════════════════
exports.agenteVerificador = onDocumentCreated(
  { document: "tecnicos/{uid}", secrets: [GEMINI_KEY] },
  async (event) => {
    const t = event.data.data();
    const uid = event.params.uid;
    if (t.procesadoPorIA) return;

    const prompt = `Eres un asistente que ayuda a trabajadores técnicos en México a crear perfiles profesionales.

El siguiente texto fue escrito por un ${t.oficio || "técnico"} para describirse:
"${t.bio || ""}"

Transforma este texto en un perfil profesional bien redactado en español.
Reglas:
- Mantén los datos reales que menciona (años de experiencia, especialidades, zona)
- No inventes información que no esté en el texto original
- Tono profesional pero cercano, no corporativo
- Máximo 150 palabras
- No uses frases como "con mucho gusto" o "a sus órdenes"

Responde SOLO JSON: {"bioMejorada":"...","perfilCompleto":true|false,"scoreInicial":0-100,"sugerencia":"qué le falta al perfil, breve o vacío"}`;

    const out = parseJsonLoose(await callGemini(prompt, GEMINI_KEY.value(), { maxTokens: 1400, temperature: 0.5 }), {
      bioMejorada: t.bio || "",
      perfilCompleto: false,
      scoreInicial: 30,
      sugerencia: "",
    });

    await db.collection("tecnicos").doc(uid).update({
      bio: out.bioMejorada || t.bio || "",
      bioOriginal: t.bio || "",
      rankScore: out.scoreInicial,
      perfilCompletoIA: out.perfilCompleto,
      procesadoPorIA: true,
    });

    await db.collection("notificaciones").add({
      userId: uid,
      tipo: "bienvenida",
      mensaje: `👋 ¡Bienvenido a Habilis! La IA mejoró tu perfil automáticamente.${out.sugerencia ? " Tip: " + out.sugerencia : ""}`,
      leida: false,
      link: "panel",
      fecha: admin.firestore.FieldValue.serverTimestamp(),
    });

    await logDecision("verificador", `score inicial ${out.scoreInicial}`, uid, out.sugerencia);
  }
);

// ═══════════════════════════════════════════════════════════════
// 🏥 AGENTE CARE — corre solo cada día 08:00 (America/Cancun)
// DECIDE salud de cada equipo y EJECUTA: actualiza score, notifica, y
// CREA una solicitud automática si el equipo está en rojo (encadena con
// el agente de matching sin intervención humana).
// ═══════════════════════════════════════════════════════════════
const INTERVALOS_CARE = {
  "Aire acondicionado": 180,
  Refrigerador: 365,
  "Panel solar": 90,
  CCTV: 180,
  UPS: 365,
  Vehículo: 90,
  "Red/Router": 365,
  Generador: 180,
};

exports.agenteCare = onSchedule(
  { schedule: "every day 08:00", timeZone: "America/Cancun", secrets: [GEMINI_KEY] },
  async () => {
    const snap = await db.collection("activos").where("eliminado", "==", false).get();
    const hoy = new Date().toISOString().slice(0, 10);

    for (const doc of snap.docs) {
      const a = doc.data();
      if (!a.userId) continue;
      const baseRaw = a.ultimoMantenimiento || a.fechaCompra;
      const baseDate = baseRaw ? (baseRaw.toDate ? baseRaw.toDate() : new Date(baseRaw)) : null;
      const intervalo = INTERVALOS_CARE[a.tipo] || 180;

      const prompt = `Eres el agente de mantenimiento de Habilis Care. Hoy es ${hoy}.
Equipo: ${a.tipo} marca "${a.marca || "desconocida"}" modelo "${a.modelo || "desconocido"}".
Última fecha de referencia (compra o último mantenimiento): ${baseDate ? baseDate.toISOString().slice(0, 10) : "desconocida"}.
Intervalo recomendado para este tipo de equipo: ${intervalo} días.
DECIDE y responde SOLO JSON:
{"saludScoreIA":0-100,"estadoIA":"verde|amarillo|rojo","accionIA":"nada|notificar|crear_solicitud","mensajeIA":"breve en español"}`;

      const out = parseJsonLoose(await callGemini(prompt, GEMINI_KEY.value(), { maxTokens: 1300, temperature: 0.3 }), {
        saludScoreIA: 50,
        estadoIA: "amarillo",
        accionIA: "nada",
        mensajeIA: "",
      });

      await db.collection("activos").doc(doc.id).update({
        saludScoreIA: out.saludScoreIA,
        estadoIA: out.estadoIA,
        ultimoAnalisisIA: admin.firestore.FieldValue.serverTimestamp(),
      });

      if (out.accionIA === "notificar" || out.accionIA === "crear_solicitud") {
        await db.collection("notificaciones").add({
          userId: a.userId,
          tipo: "care",
          mensaje: `${out.estadoIA === "rojo" ? "🔴" : "🟡"} ${a.nombre}: ${out.mensajeIA}`,
          leida: false,
          link: "habilisCare",
          fecha: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      if (out.accionIA === "crear_solicitud" && !a.solicitudAutoCreada) {
        await db.collection("solicitudes").add({
          titulo: `Mantenimiento: ${a.nombre}`,
          categoria: a.tipo,
          descripcion: `Solicitud creada automáticamente por el agente Habilis Care. ${out.mensajeIA}`,
          ciudad: "",
          urgencia: "Alta",
          userId: a.userId,
          activoId: doc.id,
          creadaPorIA: true,
          estado: "abierta",
          respuestas: 0,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        await db.collection("activos").doc(doc.id).update({ solicitudAutoCreada: true });
        await logDecision("care", "CREÓ SOLICITUD AUTOMÁTICA", doc.id, out.mensajeIA);
      } else {
        await logDecision("care", `score ${out.saludScoreIA} (${out.estadoIA})`, doc.id, out.accionIA);
      }
    }
  }
);

// ═══════════════════════════════════════════════════════════════
// 📊 AGENTE RANKING — corre solo cada día 08:30
// DECIDE el orden de búsqueda de todos los técnicos y lo EJECUTA.
// Fórmula transparente y auditable (sin caja negra) usando solo campos
// que ya existen en el esquema real de `tecnicos`.
// ═══════════════════════════════════════════════════════════════
exports.agenteRanking = onSchedule({ schedule: "every day 08:30", timeZone: "America/Cancun" }, async () => {
  const snap = await db.collection("tecnicos").get();
  let n = 0;
  for (const doc of snap.docs) {
    const t = doc.data();
    const score =
      (t.totalTrabajos || 0) * 2 +
      (t.rating || 0) * 3 +
      (t.totalReviews || 0) * 1 +
      (t.experiencia || 0) * 0.5 +
      (t.verificado ? 5 : 0) +
      // Empresa paga más que Pro ($499 vs $149) y también promete
      // "prioridad alta en búsquedas" — antes solo "pro" recibía el bono.
      (t.plan === "pro" || t.plan === "empresa" ? 8 : 0);
    await db.collection("tecnicos").doc(doc.id).update({ rankScore: score });
    n++;
  }
  await logDecision("ranking", `recalculó ${n} técnico(s)`, "batch", "fórmula diaria transparente");
});

// ═══════════════════════════════════════════════════════════════
// GEMINI PROXY (genérico) — usos síncronos que el usuario dispara a
// propósito: sugerirRespuesta, generarTipsMantenimiento, clasificarSolicitud,
// generarResumenChat, sugerirColaboradores. El prompt lo arma el cliente
// (gemini.js) y este proxy solo añade auth + rate limit + log.
// ═══════════════════════════════════════════════════════════════
exports.geminiProxy = onCall({ secrets: [GEMINI_KEY] }, async (request) => {
  const uid = requireAuth(request);
  await checkRateLimit(uid, "geminiProxy", 60);
  const { prompt, temperature = 0.7, agentName = "generic" } = request.data;
  if (!prompt || typeof prompt !== "string" || !prompt.trim() || prompt.length > 4000) {
    throw new HttpsError("invalid-argument", "El campo 'prompt' es requerido y debe ser válido.");
  }
  const text = await callGemini(prompt, GEMINI_KEY.value(), { temperature, maxTokens: 1800 });
  await logDecision(agentName, "respuesta generada", uid, "");
  return { text };
});

// ═══════════════════════════════════════════════════════════════
// 🎙️ REGISTRO POR VOZ — transcribe audio y estructura el perfil.
// Requiere trabajo de frontend adicional (grabar audio) para activarse
// de punta a punta — ver nota al final del documento de cierre.
// ═══════════════════════════════════════════════════════════════
exports.transcribirRegistro = onCall({ secrets: [GEMINI_KEY] }, async (request) => {
  const uid = requireAuth(request);
  await checkRateLimit(uid, "transcribir", 10);
  const { audioBase64, mimeType } = request.data;
  if (!audioBase64 || typeof audioBase64 !== "string") {
    throw new HttpsError("invalid-argument", "Audio requerido.");
  }
  if (audioBase64.length > 15 * 1024 * 1024) { // ~11 MB de audio real tras decodificar base64
    throw new HttpsError("invalid-argument", "El audio es demasiado largo.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY.value()}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { inline_data: { mime_type: mimeType || "audio/webm", data: audioBase64 } },
            {
              text: `Transcribe este audio en español de un trabajador técnico mexicano registrándose en Habilis. Extrae y responde SOLO JSON: {"nombre":"","oficio":"","ciudad":"","experiencia":0,"bio":"lo que dijo, ordenado"}`,
            },
          ],
        },
      ],
    }),
  });
  const d = await r.json();
  const text = d.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  await logDecision("registroVoz", "transcribió y estructuró perfil", uid, "");
  return parseJsonLoose(text, { nombre: "", oficio: "", ciudad: "", experiencia: 0, bio: "" });
});

// ═══════════════════════════════════════════════════════════════
// 📊 ANÁLISIS DE MERCADO — beneficio Pro/Empresa del panel de IA.
// Cuenta solicitudes reales de la ciudad del técnico en los últimos 30
// días, agrupadas por categoría. Es honesto sobre su propia limitación:
// hoy `solicitudes` solo se llena desde Habilis Care (mantenimiento), así
// que el panorama real de demanda todavía es parcial, no de toda la app.
// ═══════════════════════════════════════════════════════════════
exports.analisisMercado = onCall(async (request) => {
  const uid = requireAuth(request);
  await checkRateLimit(uid, "analisisMercado", 20);

  const tecnicoDoc = await db.collection("tecnicos").doc(uid).get();
  const tecnico = tecnicoDoc.data();
  if (!tecnico || (tecnico.plan !== "pro" && tecnico.plan !== "empresa")) {
    throw new HttpsError("permission-denied", "El análisis de mercado es un beneficio Pro/Empresa.");
  }
  const ciudad = (tecnico.ciudad || "").trim();
  if (!ciudad) {
    throw new HttpsError("failed-precondition", "Agrega tu ciudad en Configurar antes de ver el análisis de tu zona.");
  }

  // Sin rango en la query (evita depender de un índice compuesto nuevo):
  // se trae por ciudad y se filtra la fecha en memoria — el volumen de
  // `solicitudes` es bajo, así que no hay problema de rendimiento.
  const snap = await db.collection("solicitudes").where("ciudad", "==", ciudad).limit(300).get();
  const desdeMs = Date.now() - 30 * 24 * 3600 * 1000;
  const conteo = {};
  let total = 0;
  snap.docs.forEach((d) => {
    const data = d.data();
    const ts = data.createdAt?.toMillis?.() || 0;
    if (ts < desdeMs) return;
    total++;
    const cat = data.categoria || "Sin categoría";
    conteo[cat] = (conteo[cat] || 0) + 1;
  });
  const ranking = Object.entries(conteo)
    .sort((a, b) => b[1] - a[1])
    .map(([categoria, solicitudes]) => ({ categoria, solicitudes }));

  await logDecision("analisisMercado", `${total} solicitud(es) en ${ciudad}`, uid, "");
  return { ciudad, dias: 30, total, ranking };
});

// ═══════════════════════════════════════════════════════════════
// 🎧 SOPORTE — "soporte prioritario" para Pro/Empresa dejaba de ser una
// frase en Precios.jsx: se crea vía Admin SDK para que `prioridad` salga
// del plan REAL en Firestore (no de lo que el cliente declare), y el panel
// admin (AdminSoporte.jsx) ordena la cola con los prioritarios primero.
// ═══════════════════════════════════════════════════════════════
exports.crearTicketSoporte = onCall(async (request) => {
  const uid = requireAuth(request);
  await checkRateLimit(uid, "crearTicketSoporte", 10);
  const { mensaje } = request.data || {};
  if (!mensaje || typeof mensaje !== "string" || !mensaje.trim()) {
    throw new HttpsError("invalid-argument", "Escribe tu mensaje.");
  }
  if (mensaje.length > 2000) {
    throw new HttpsError("invalid-argument", "El mensaje es demasiado largo (máx. 2000 caracteres).");
  }

  const [tecnicoDoc, clienteDoc] = await Promise.all([
    db.collection("tecnicos").doc(uid).get(),
    db.collection("clientes").doc(uid).get(),
  ]);
  const tecnico = tecnicoDoc.data();
  const cliente = clienteDoc.data();
  const prioridad = tecnico?.plan === "pro" || tecnico?.plan === "empresa";

  const ref = await db.collection("soporteTickets").add({
    userId: uid,
    userEmail: request.auth.token.email || "",
    userNombre: tecnico?.nombre || cliente?.nombre || "",
    plan: tecnico?.plan || (cliente ? "cliente" : "desconocido"),
    prioridad,
    mensaje: mensaje.trim(),
    estado: "abierto",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  await logDecision("soporte", `nuevo ticket${prioridad ? " (prioritario)" : ""}`, ref.id, "");
  return { id: ref.id, prioridad };
});

// ═══════════════════════════════════════════════════════════════
// 📧 CORREO TRANSACCIONAL PROPIO (Resend) — reemplaza el correo de
// verificación/reset genérico de Firebase (noreply@<proyecto>.firebaseapp.com,
// que cae en spam por no tener la reputación de myhabilis.com). El enlace de
// acción lo sigue emitiendo Firebase Auth (generateEmailVerificationLink /
// generatePasswordResetLink); solo cambia quién manda el correo.
// TODAVÍA NO está conectado al frontend — falta verificar el dominio en
// Resend y guardar RESEND_API_KEY. Ver DESPLEGAR.md / SETUP_PAGOS.md.
// ═══════════════════════════════════════════════════════════════
async function enviarCorreoResend(key, to, subject, html) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: RESEND_FROM, to: [to], subject, html }),
  });
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    console.error(`Resend error ${r.status}: ${body.slice(0, 300)}`);
    throw new HttpsError("internal", "No se pudo enviar el correo. Intenta de nuevo.");
  }
}

function plantillaCorreo({ titulo, cuerpo, botonTexto, botonUrl }) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#F1F5F9;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 16px;">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:480px;">
<tr><td style="background:#0F172A;padding:22px 32px;">
<span style="color:#F97316;font-weight:900;font-size:20px;letter-spacing:0.04em;">HABILIS</span>
</td></tr>
<tr><td style="padding:32px;">
<h1 style="margin:0 0 12px;font-size:20px;color:#0F172A;font-family:Arial,sans-serif;">${titulo}</h1>
<p style="margin:0 0 24px;font-size:14px;color:#475569;line-height:1.6;">${cuerpo}</p>
<table cellpadding="0" cellspacing="0"><tr><td style="background:#F97316;border-radius:10px;">
<a href="${botonUrl}" style="display:inline-block;padding:12px 28px;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;font-family:Arial,sans-serif;">${botonTexto}</a>
</td></tr></table>
<p style="margin:24px 0 0;font-size:12px;color:#94A3B8;word-break:break-all;">Si el botón no funciona, copia este enlace:<br>${botonUrl}</p>
</td></tr>
<tr><td style="padding:18px 32px;background:#F8FAFC;text-align:center;">
<p style="margin:0;font-size:11px;color:#94A3B8;">Habilis · myhabilis.com · México</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

exports.enviarVerificacionEmail = onCall({ secrets: [RESEND_KEY] }, async (request) => {
  const uid = requireAuth(request);
  await checkRateLimit(uid, "enviarVerificacionEmail", 5);

  const userRecord = await admin.auth().getUser(uid);
  if (!userRecord.email) throw new HttpsError("failed-precondition", "Tu cuenta no tiene correo.");
  if (userRecord.emailVerified) return { ok: true, yaVerificado: true };

  const link = await admin.auth().generateEmailVerificationLink(userRecord.email, {
    url: "https://myhabilis.com", handleCodeInApp: false,
  });
  const primerNombre = (userRecord.displayName || "").split(" ")[0];
  const html = plantillaCorreo({
    titulo: "Confirma tu correo",
    cuerpo: `Hola${primerNombre ? " " + primerNombre : ""}, confirma tu correo para proteger tu cuenta de Habilis.`,
    botonTexto: "Confirmar correo",
    botonUrl: link,
  });
  await enviarCorreoResend(RESEND_KEY.value(), userRecord.email, "Confirma tu correo — Habilis", html);
  return { ok: true };
});

exports.enviarResetPasswordEmail = onCall({ secrets: [RESEND_KEY] }, async (request) => {
  const { email } = request.data || {};
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpsError("invalid-argument", "Correo inválido.");
  }
  const correo = email.trim().toLowerCase();
  // Sin uid (puede pedirse deslogueado) — se limita por el correo mismo.
  await checkRateLimit(correo, "resetPasswordEmail", 5);

  try {
    const link = await admin.auth().generatePasswordResetLink(correo, {
      url: "https://myhabilis.com", handleCodeInApp: false,
    });
    const html = plantillaCorreo({
      titulo: "Restablece tu contraseña",
      cuerpo: "Pediste restablecer tu contraseña en Habilis. Si no fuiste tú, ignora este correo — tu cuenta sigue segura.",
      botonTexto: "Restablecer contraseña",
      botonUrl: link,
    });
    await enviarCorreoResend(RESEND_KEY.value(), correo, "Restablece tu contraseña — Habilis", html);
  } catch (e) {
    // Nunca revelar si el correo existe o no (enumeración de cuentas): se
    // responde éxito igual, el motivo real solo queda en logs del servidor.
    if (e.code !== "auth/user-not-found") console.error("enviarResetPasswordEmail:", e.message);
  }
  return { ok: true };
});

// ═══════════════════════════════════════════════════════════════
// EMPLEADOS (cuentas Empresa) — tope de 10 por cuenta
// Se crea vía Admin SDK, no como escritura directa del cliente: las
// reglas de Firestore no pueden contar cuántos documentos ya existen de
// forma confiable (y menos aún de forma resistente a manipulación), así
// que el límite solo se puede hacer cumplir aquí.
// ═══════════════════════════════════════════════════════════════
const MAX_EMPLEADOS_EMPRESA = 10;

exports.crearEmpleado = onCall(async (request) => {
  const uid = requireAuth(request);
  await checkRateLimit(uid, "crearEmpleado", 20);
  const { nombre, oficio, categoriaId, ciudad, experiencia, bio } = request.data || {};
  if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
    throw new HttpsError("invalid-argument", "El nombre del empleado es requerido.");
  }

  const empresaDoc = await db.collection("tecnicos").doc(uid).get();
  if (empresaDoc.data()?.plan !== "empresa") {
    throw new HttpsError("permission-denied", "Solo las cuentas Empresa pueden agregar empleados.");
  }

  const conteo = await db.collection("tecnicos").where("empresaId", "==", uid).count().get();
  if (conteo.data().count >= MAX_EMPLEADOS_EMPRESA) {
    throw new HttpsError("resource-exhausted",
      `Ya tienes ${MAX_EMPLEADOS_EMPRESA} empleados — es el máximo del Plan Empresa.`);
  }

  const ref = await db.collection("tecnicos").add({
    nombre: nombre.trim(),
    oficio: oficio || "",
    categoriaId: categoriaId || null,
    ciudad: (ciudad || "").trim(),
    experiencia: parseInt(experiencia) || 0,
    bio: (bio || "").trim(),
    empresaId: uid,
    plan: "empresa",
    verificado: false,
    rating: 0,
    totalReviews: 0,
    totalTrabajos: 0,
    disponible: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { id: ref.id };
});

// ═══════════════════════════════════════════════════════════════
// MERCADO PAGO — suscripción Habilis Pro
// ═══════════════════════════════════════════════════════════════
const PRECIOS_PLAN = { pro: 149, empresa: 499 };

exports.crearSuscripcion = onCall({ secrets: [MP_TOKEN] }, async (request) => {
  const uid = requireAuth(request);
  await checkRateLimit(uid, "crearSuscripcion", 10);
  const { email, codigo } = request.data;
  const plan = request.data.plan === "empresa" ? "empresa" : "pro";
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpsError("invalid-argument", "Email requerido.");
  }

  // Código de descuento (colección `promos` del admin de Marketing).
  const precioBase = PRECIOS_PLAN[plan];
  let monto = precioBase;
  let promoId = null;
  if (codigo) {
    if (typeof codigo !== "string" || codigo.length > 30) {
      throw new HttpsError("invalid-argument", "Código de descuento inválido.");
    }
    const snap = await db.collection("promos")
      .where("codigo", "==", codigo.trim().toUpperCase()).limit(1).get();
    if (snap.empty) throw new HttpsError("not-found", "Ese código de descuento no existe.");
    const promoRef = snap.docs[0].ref;

    // El uso se aparta aquí, no al confirmarse el pago. Comprobar el tope
    // ahora e incrementarlo después dejaba el contador en cero mientras
    // tanto: un código de un solo uso se podía canjear en paralelo cuantas
    // veces se quisiera, y la preaprobación con descuento seguía válida en
    // Mercado Pago para toda la vida de esa suscripción.
    const pct = await db.runTransaction(async (tx) => {
      const pSnap = await tx.get(promoRef);
      const promo = pSnap.data();
      if (!pSnap.exists || promo.activo === false) {
        throw new HttpsError("not-found", "Ese código de descuento no está disponible.");
      }
      if (promo.usosMaximos && (promo.usosActuales || 0) >= promo.usosMaximos) {
        throw new HttpsError("failed-precondition", "Ese código ya alcanzó su límite de usos.");
      }
      tx.update(promoRef, { usosActuales: admin.firestore.FieldValue.increment(1) });
      return Math.min(99, Math.max(0, Number(promo.descuento) || 0));
    });

    // Mercado Pago no acepta suscripciones de $0: el tope de 99% de arriba
    // lo evita (y también protege contra datos mal capturados).
    monto = Math.round(precioBase * (1 - pct / 100) * 100) / 100;
    promoId = promoRef.id;
  }

  const r = await fetch("https://api.mercadopago.com/preapproval", {
    method: "POST",
    headers: { Authorization: `Bearer ${MP_TOKEN.value()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      reason: plan === "empresa" ? "Habilis Empresa" : "Habilis Pro",
      external_reference: uid,
      auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: monto, currency_id: "MXN" },
      // Vuelve al checkout, que muestra el estado real del pago en vez de
      // dejar al usuario en la portada sin saber si se cobró.
      back_url: "https://myhabilis.com/pro",
      payer_email: email,
      // Flujo por redirección: la suscripción nace pendiente y el propio
      // pagador la autoriza en el checkout de Mercado Pago.
      status: "pending",
    }),
  });
  const data = await r.json();
  const destino = elegirCheckout(data, MP_TOKEN.value());
  if (!destino) {
    console.error("Mercado Pago preapproval error:", JSON.stringify(data).slice(0, 500));
    // La suscripción no llegó a existir: se devuelve el uso del código para
    // no quemarlo por un fallo que no fue del técnico.
    if (promoId) {
      await db.collection("promos").doc(promoId).update({
        usosActuales: admin.firestore.FieldValue.increment(-1),
      }).catch((e) => console.error("No se pudo devolver el uso del código:", e.message));
    }
    throw new HttpsError("internal", "No se pudo crear la suscripción. Intenta de nuevo.");
  }
  await db.collection("suscripcionesPendientes").doc(uid).set({
    preapprovalId: data.id,
    monto,
    plan,
    promoId,
    fecha: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { url: destino, monto, plan };
});

// Cancelar la suscripción desde la propia app. Antes había que buscarla en
// Mercado Pago: una fricción innecesaria y una queja segura de soporte.
// El plan se retira aquí mismo y el webhook confirma después el estado.
exports.cancelarSuscripcion = onCall({ secrets: [MP_TOKEN] }, async (request) => {
  const uid = requireAuth(request);
  await checkRateLimit(uid, "cancelarSuscripcion", 10);

  const tecnico = await db.collection("tecnicos").doc(uid).get();
  const suscripcionId = tecnico.data()?.suscripcionId;
  if (!suscripcionId) {
    throw new HttpsError("failed-precondition", "No tienes una suscripción activa que cancelar.");
  }

  const r = await fetch(`https://api.mercadopago.com/preapproval/${suscripcionId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${MP_TOKEN.value()}`, "Content-Type": "application/json" },
    body: JSON.stringify({ status: "cancelled" }),
  });
  if (!r.ok) {
    const detalle = await r.text().catch(() => "");
    console.error(`Cancelar preapproval ${suscripcionId} falló (${r.status}): ${detalle.slice(0, 300)}`);
    throw new HttpsError("internal", "No se pudo cancelar la suscripción. Intenta de nuevo o escríbenos.");
  }

  await db.collection("tecnicos").doc(uid).update({
    plan: "gratis",
    suscripcionEstado: "cancelled",
  });
  return { ok: true };
});

// ── Helpers de suscripción ───────────────────────────────────────────────
// Mercado Pago reintenta cada notificación hasta recibir un 200, y puede
// mandar la misma varias veces. Por eso todo lo que escribe aquí es
// idempotente: los documentos llevan id derivado del id de MP y el consumo
// del código promocional se hace en una transacción que solo corre una vez.

// Nombra el entorno del token sin revelar su valor. Un token de prueba con
// un webhook de producción (o al revés) hace que la firma nunca cuadre y que
// los cobros reales fallen sin explicación: conviene verlo en los logs.
function entornoMP() {
  return MP_TOKEN.value().startsWith("TEST-") ? "prueba (TEST-)" : "producción (APP_USR-)";
}

async function mpGet(ruta) {
  const r = await fetch(`https://api.mercadopago.com${ruta}`, {
    headers: { Authorization: `Bearer ${MP_TOKEN.value()}` },
  });
  if (!r.ok) {
    console.error(`Mercado Pago ${ruta} respondió ${r.status}`);
    return null;
  }
  return r.json();
}

// Un pago recurrente no siempre trae el uid: se busca en el pago, luego en
// la preaprobación que lo originó y por último en el técnico que ya tiene
// esa suscripción asociada.
async function resolverUid(pago, preapprovalId) {
  if (pago?.external_reference) return pago.external_reference;
  if (preapprovalId) {
    const sub = await mpGet(`/preapproval/${preapprovalId}`);
    if (sub?.external_reference) return sub.external_reference;
    const snap = await db.collection("tecnicos")
      .where("suscripcionId", "==", preapprovalId).limit(1).get();
    if (!snap.empty) return snap.docs[0].id;
  }
  return null;
}

// `authorized` da acceso Pro/Empresa; `paused` (típicamente por un cobro que
// falló) y `cancelled` lo retiran. Antes solo se contemplaban los dos
// extremos, así que una suscripción pausada conservaba el plan indefinidamente.
async function aplicarEstadoSuscripcion(uid, sub) {
  const ref = db.collection("tecnicos").doc(uid);
  if (sub.status === "authorized") {
    // El tipo de plan contratado vive en la suscripción pendiente creada al
    // iniciar el checkout — sin esto, toda alta activaba "pro" sin importar
    // qué haya pagado la cuenta.
    const pendiente = await db.collection("suscripcionesPendientes").doc(uid).get();
    const plan = pendiente.data()?.plan === "empresa" ? "empresa" : "pro";
    await ref.update({
      plan,
      suscripcionId: sub.id,
      suscripcionEstado: "authorized",
      fechaPago: admin.firestore.FieldValue.serverTimestamp(),
    });
    await consumirPromo(uid);
  } else if (sub.status === "paused" || sub.status === "cancelled") {
    await ref.update({ plan: "gratis", suscripcionEstado: sub.status });
  } else {
    await ref.update({ suscripcionEstado: sub.status || "desconocido" });
  }
}

// Suma el uso del código promocional una sola vez, aunque el webhook se
// repita: la transacción marca la intención como consumida.
// El uso del código ya se apartó al crear la suscripción; aquí solo se deja
// constancia de que ese apartado terminó en un pago confirmado.
async function consumirPromo(uid) {
  const ref = db.collection("suscripcionesPendientes").doc(uid);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const datos = snap.data();
    if (!snap.exists || !datos?.promoId || datos.promoConsumido) return;
    tx.update(ref, { promoConsumido: true });
  });
}

// Registra el cobro del mes. El id del documento es el del pago en Mercado
// Pago, así que un reintento del webhook sobrescribe en lugar de duplicar.
//
// `facturada` es propiedad de emitirFactura, no de aquí: solo se inicializa
// al crear el documento. Escribirla en cada entrega volvía a marcar como no
// facturado un cobro ya timbrado, y bastaba una reentrega de Mercado Pago
// para poder emitir un segundo CFDI del mismo pago.
async function registrarPagoSuscripcion(uid, pago, preapprovalId) {
  const aprobado = pago.status === "approved";
  const tecnicoRef = db.collection("tecnicos").doc(uid);
  // No asumir "pro": una cuenta Empresa que renueva no debe degradarse en
  // cada cobro mensual solo porque este webhook no sabe qué plan contrató.
  const tecnicoSnap = await tecnicoRef.get();
  const planActual = tecnicoSnap.data()?.plan;
  const plan = planActual === "empresa" ? "empresa" : "pro";

  const ref = db.collection("pagos").doc(`mp_${pago.id}`);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const datos = {
      userId: uid,
      monto: pago.transaction_amount ?? 0,
      metodo: "mercadopago",
      estado: aprobado ? "aprobado" : (pago.status || "desconocido"),
      concepto: plan === "empresa" ? "Habilis Empresa mensual" : "Habilis Pro mensual",
      pagoMP: String(pago.id),
      suscripcionId: preapprovalId || null,
      fecha: pago.date_approved
        ? admin.firestore.Timestamp.fromDate(new Date(pago.date_approved))
        : admin.firestore.FieldValue.serverTimestamp(),
    };
    if (!snap.exists) datos.facturada = false;
    tx.set(ref, datos, { merge: true });
  });

  if (aprobado) {
    await tecnicoRef.update({
      plan,
      fechaPago: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

// El body de un webhook NUNCA es de confianza por sí mismo: en vez de creerle
// el status/monto que manda, solo tomamos el `id` para volver a preguntarle
// a la API real de Mercado Pago (con nuestro token) cuál es el estado
// verdadero, y solo entonces escribimos en Firestore.
exports.webhookMP = onRequest({ secrets: [MP_TOKEN, MP_WEBHOOK_SECRET] }, async (req, res) => {
  try {
    const { type, data } = req.body || {};

    // Segunda capa (defensa en profundidad): si la clave del webhook está
    // configurada, exigimos firma válida. Mientras no lo esté, se registra
    // el aviso y se sigue — el re-consulta contra la API de MP de abajo es
    // lo que impide que un body falso escriba algo.
    const secreto = MP_WEBHOOK_SECRET.value();
    if (secreto) {
      if (!data?.id || !firmaMPValida(req.headers, data.id, secreto)) {
        console.warn(
          `webhookMP: firma inválida o ausente — petición descartada. ` +
          `El access token es de ${entornoMP()}; MP_WEBHOOK_SECRET debe ser el de ESA ` +
          `misma aplicación de Mercado Pago. Si registraste el webhook en la otra, ` +
          `la firma nunca va a cuadrar.`);
        return res.status(200).send("OK");
      }
    } else {
      console.warn(
        `webhookMP: MP_WEBHOOK_SECRET no configurado — firma NO verificada. ` +
        `Access token de ${entornoMP()}.`);
    }

    // ── Alta / cambio de estado de la suscripción ──────────────────────
    if (type === "subscription_preapproval" && data?.id) {
      const sub = await mpGet(`/preapproval/${data.id}`);
      const uid = sub?.external_reference;
      if (uid) await aplicarEstadoSuscripcion(uid, sub);
    }

    // ── Cobro recurrente: llega uno por cada mes cobrado ───────────────
    // Sin esto solo quedaba registrado el primer pago y las renovaciones
    // mensuales eran invisibles para Finanzas.
    if (type === "subscription_authorized_payment" && data?.id) {
      const pago = await mpGet(`/v1/payments/${data.id}`);
      if (pago) {
        const preapprovalId = pago.metadata?.preapproval_id || pago.preapproval_id || null;
        const uid = await resolverUid(pago, preapprovalId);
        if (uid) await registrarPagoSuscripcion(uid, pago, preapprovalId);
      }
    }

    res.status(200).send("OK");
  } catch (e) {
    console.error("webhookMP error:", e.message);
    res.status(200).send("OK"); // siempre 200 para que MP no reintente infinito
  }
});

// ═══════════════════════════════════════════════════════════════
// FACTURAPI — CFDI para suscriptores Pro
// ═══════════════════════════════════════════════════════════════
exports.emitirFactura = onCall({ secrets: [FACTURAPI_KEY] }, async (request) => {
  const uid = requireAuth(request);
  await checkRateLimit(uid, "emitirFactura", 10);
  const { rfc, razonSocial, codigoPostal, regimenFiscal, usoCFDI } = request.data;
  if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(rfc || "")) {
    throw new HttpsError("invalid-argument", "RFC inválido.");
  }
  if (!razonSocial || typeof razonSocial !== "string" || razonSocial.length > 200) {
    throw new HttpsError("invalid-argument", "Razón social inválida.");
  }
  if (!/^\d{5}$/.test(codigoPostal || "")) {
    throw new HttpsError("invalid-argument", "Código postal inválido.");
  }
  if (!regimenFiscal || typeof regimenFiscal !== "string" || !usoCFDI || typeof usoCFDI !== "string") {
    throw new HttpsError("invalid-argument", "Régimen fiscal y uso de CFDI son requeridos.");
  }
  // Se factura un cobro concreto, no la intención de compra: en una
  // suscripción hay un pago por mes y cada uno se timbra una sola vez.
  const pendientes = await db.collection("pagos")
    .where("userId", "==", uid)
    .where("estado", "==", "aprobado")
    .where("facturada", "==", false)
    .orderBy("fecha", "desc")
    .limit(1)
    .get();

  if (pendientes.empty) {
    throw new HttpsError("failed-precondition",
      "No tienes cobros pendientes de facturar. Si acabas de pagar, espera unos minutos a que se confirme.");
  }
  const pagoRef = pendientes.docs[0].ref;

  // El cobro se aparta ANTES de timbrar. Consultar y marcar después dejaba
  // una ventana del tamaño de la llamada a Facturapi: varias peticiones
  // simultáneas leían el mismo cobro sin facturar y cada una emitía un CFDI
  // real del mismo pago, con RFC elegido por quien llamara.
  const montoFactura = await db.runTransaction(async (tx) => {
    const snap = await tx.get(pagoRef);
    const datos = snap.data();
    if (!snap.exists || datos.facturada !== false) {
      throw new HttpsError("failed-precondition", "Ese cobro ya tiene factura.");
    }
    const monto = datos.monto || 0;
    if (monto <= 0) {
      throw new HttpsError("failed-precondition", "El cobro registrado no tiene monto facturable.");
    }
    tx.update(pagoRef, { facturada: true });
    return monto;
  });

  const r = await fetch("https://www.facturapi.io/v2/invoices", {
    method: "POST",
    headers: { Authorization: `Bearer ${FACTURAPI_KEY.value()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      customer: { legal_name: razonSocial, tax_id: rfc, tax_system: regimenFiscal, address: { zip: codigoPostal } },
      items: [
        {
          quantity: 1,
          product: {
            description: "Suscripción Habilis Pro - 1 mes",
            product_key: "81112100",
            price: montoFactura,
            tax_included: true,
            taxes: [{ type: "IVA", rate: 0.16 }],
          },
        },
      ],
      payment_form: "28",
      use: usoCFDI,
    }),
  });
  const inv = await r.json();
  if (inv.error) {
    // No se timbró nada: se devuelve el cobro a la cola para que el técnico
    // pueda reintentar tras corregir sus datos fiscales.
    await pagoRef.update({ facturada: false }).catch((e) =>
      console.error("No se pudo liberar el cobro tras fallar Facturapi:", e.message));
    console.error("Facturapi error:", JSON.stringify(inv.error).slice(0, 500));
    throw new HttpsError("internal", "No se pudo generar la factura. Verifica tus datos fiscales e intenta de nuevo.");
  }
  // El cobro ya quedó apartado arriba; aquí solo se guarda el comprobante.
  await db.collection("facturas").add({
    userId: uid,
    facturaId: inv.id,
    pagoId: pagoRef.id,
    rfc,
    total: montoFactura,
    // Se guarda para que el técnico pueda volver a abrir su CFDI: antes el
    // enlace solo existía en la respuesta y se perdía al cerrar la página.
    verificationUrl: inv.verification_url || null,
    fecha: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { facturaId: inv.id, verificationUrl: inv.verification_url };
});
