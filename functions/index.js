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
// Setup (one-time):
//   firebase functions:secrets:set GEMINI_KEY
//   firebase functions:secrets:set MP_ACCESS_TOKEN
//   firebase functions:secrets:set FACTURAPI_KEY

const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
admin.initializeApp();

const GEMINI_KEY = defineSecret("GEMINI_KEY");
const MP_TOKEN = defineSecret("MP_ACCESS_TOKEN");
const FACTURAPI_KEY = defineSecret("FACTURAPI_KEY");

const db = admin.firestore();
const GEMINI_MODEL = "gemini-2.0-flash";

// ═══════════════════════════ HELPERS ═══════════════════════════
async function callGemini(prompt, key, { maxTokens = 800, temperature = 0.4 } = {}) {
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

async function checkRateLimit(uid, action, maxPerHour = 20) {
  const ref = db.collection("rateLimits").doc(`${uid}_${action}`);
  const doc = await ref.get();
  const now = Date.now();
  const hourAgo = now - 3600000;
  const calls = doc.exists ? (doc.data().calls || []).filter((t) => t > hourAgo) : [];
  if (calls.length >= maxPerHour) {
    throw new HttpsError("resource-exhausted", "Límite de uso alcanzado. Intenta en 1 hora.");
  }
  calls.push(now);
  await ref.set({ calls });
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
DECIDE los 3 mejores considerando: oficio compatible con la categoría, misma ciudad o cercana (ignora ciudad si no se especificó), experiencia, trabajos documentados. Plan pro es desempate, no criterio principal.
Responde SOLO JSON: {"seleccionados":[{"id":"...","razon":"breve"}],"urgenciaIA":"baja|media|alta"}`;

    const out = parseJsonLoose(await callGemini(prompt, GEMINI_KEY.value(), { maxTokens: 400, temperature: 0.3 }), {
      seleccionados: [],
      urgenciaIA: "media",
    });
    const seleccionados = (out.seleccionados || []).filter((s) => tecnicos.some((t) => t.id === s.id));

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

    const out = parseJsonLoose(await callGemini(prompt, GEMINI_KEY.value(), { maxTokens: 300, temperature: 0.1 }), {
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

    const out = parseJsonLoose(await callGemini(prompt, GEMINI_KEY.value(), { maxTokens: 500, temperature: 0.5 }), {
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

      const out = parseJsonLoose(await callGemini(prompt, GEMINI_KEY.value(), { maxTokens: 250, temperature: 0.3 }), {
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
      (t.plan === "pro" ? 8 : 0);
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
  const text = await callGemini(prompt, GEMINI_KEY.value(), { temperature, maxTokens: 1024 });
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
// MERCADO PAGO — suscripción Habilis Pro
// ═══════════════════════════════════════════════════════════════
exports.crearSuscripcion = onCall({ secrets: [MP_TOKEN] }, async (request) => {
  const uid = requireAuth(request);
  await checkRateLimit(uid, "crearSuscripcion", 10);
  const { email } = request.data;
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpsError("invalid-argument", "Email requerido.");
  }

  const r = await fetch("https://api.mercadopago.com/preapproval", {
    method: "POST",
    headers: { Authorization: `Bearer ${MP_TOKEN.value()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      reason: "Habilis Pro",
      external_reference: uid,
      auto_recurring: { frequency: 1, frequency_type: "months", transaction_amount: 100, currency_id: "MXN" },
      back_url: "https://myhabilis.com",
      payer_email: email,
    }),
  });
  const data = await r.json();
  if (!data.init_point) {
    console.error("Mercado Pago preapproval error:", JSON.stringify(data).slice(0, 500));
    throw new HttpsError("internal", "No se pudo crear la suscripción. Intenta de nuevo.");
  }
  await db.collection("suscripcionesPendientes").doc(uid).set({
    preapprovalId: data.id,
    fecha: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { url: data.init_point };
});

// El body de un webhook NUNCA es de confianza por sí mismo: en vez de creerle
// el status/monto que manda, solo tomamos el `id` para volver a preguntarle
// a la API real de Mercado Pago (con nuestro token) cuál es el estado
// verdadero, y solo entonces escribimos en Firestore.
exports.webhookMP = onRequest({ secrets: [MP_TOKEN] }, async (req, res) => {
  try {
    const { type, data } = req.body || {};
    if (type === "subscription_preapproval" && data?.id) {
      const r = await fetch(`https://api.mercadopago.com/preapproval/${data.id}`, {
        headers: { Authorization: `Bearer ${MP_TOKEN.value()}` },
      });
      const sub = await r.json();
      const uid = sub.external_reference;
      if (uid && sub.status === "authorized") {
        await db.collection("tecnicos").doc(uid).update({
          plan: "pro",
          suscripcionId: sub.id,
          fechaPago: admin.firestore.FieldValue.serverTimestamp(),
        });
        await db.collection("pagos").add({
          userId: uid,
          monto: 100,
          metodo: "mercadopago",
          estado: "aprobado",
          concepto: "Habilis Pro mensual",
          fecha: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      if (uid && sub.status === "cancelled") {
        await db.collection("tecnicos").doc(uid).update({ plan: "gratis" });
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
            price: 100,
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
    console.error("Facturapi error:", JSON.stringify(inv.error).slice(0, 500));
    throw new HttpsError("internal", "No se pudo generar la factura. Verifica tus datos fiscales e intenta de nuevo.");
  }
  await db.collection("facturas").add({
    userId: uid,
    facturaId: inv.id,
    rfc,
    total: 100,
    fecha: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { facturaId: inv.id, verificationUrl: inv.verification_url };
});
