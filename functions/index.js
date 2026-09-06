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

const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
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
// Cabecera compartida con RevenueCat para acreditar que el aviso es suyo.
const RC_WEBHOOK_SECRET = defineSecret("RC_WEBHOOK_SECRET");

const db = admin.firestore();
// Gemini puede omitir una clave del JSON que le pedimos. firebase-admin
// RECHAZA los `undefined`, así que una respuesta incompleta hacía fallar el
// update entero: el trabajo se quedaba sin veredicto de moderación y —como
// el feed solo oculta lo rechazado— acababa publicado. Ignorarlos convierte
// una clave ausente en un campo ausente, que sí es recuperable.
db.settings({ ignoreUndefinedProperties: true });
const GEMINI_MODEL = "gemini-2.0-flash";

// Misma normalización que src/lib/indice.js: si las dos no coinciden, un
// perfil indexado como "cancun" nunca casa con la búsqueda de "Cancún".
function normalizarTexto(texto) {
  return (texto || "").toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").trim().replace(/\s+/g, " ");
}

// ═══════════════════════════ HELPERS ═══════════════════════════
async function callGemini(prompt, key, { maxTokens = 800, temperature = 0.4, json = false } = {}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
  const generationConfig = { maxOutputTokens: maxTokens, temperature };
  // Cuando esperamos JSON se lo exigimos al modelo en vez de confiar en que
  // obedezca el prompt: quita de raíz los ```json y el texto de cortesía.
  if (json) generationConfig.responseMimeType = "application/json";
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig,
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

// Leer y escribir por separado no serializa nada: varias llamadas
// simultáneas leían el mismo contador y todas pasaban, así que el límite se
// saltaba con solo disparar en paralelo. La transacción lo hace real.
async function checkRateLimit(uid, action, maxPerHour = 20) {
  const ref = db.collection("rateLimits").doc(`${uid}_${action}`);
  const now = Date.now();
  const haceUnaHora = now - 3600000;
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const calls = snap.exists ? (snap.data().calls || []).filter((t) => t > haceUnaHora) : [];
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
exports.agenteMatching = onDocumentCreated(
  { document: "solicitudes/{id}", secrets: [GEMINI_KEY] },
  async (event) => {
    const sol = event.data.data();
    const solId = event.params.id;
    if (sol.asignadoPorIA) return; // evita reprocesar

    // Leía 60 técnicos CUALESQUIERA de todo el país y se los daba a Gemini.
    // Con cien mil perfiles, el plomero de la esquina no entra nunca en esos
    // 60 — y el prompt le pedía al modelo que priorizara la cercanía sobre
    // una lista que no la tenía en cuenta. Se acota antes de preguntar.
    const ciudadNorm = normalizarTexto(sol.ciudad || "");
    let consulta = db.collection("tecnicos").where("disponible", "==", true);
    if (sol.categoria) {
      const cat = String(sol.categoria).split(".")[0];
      consulta = consulta.where("categoriaId", "==", cat);
    }
    if (ciudadNorm) consulta = consulta.where("ciudadNorm", "==", ciudadNorm);

    let snap = await consulta.orderBy("rankScore", "desc").limit(40).get();
    // Si en esa ciudad y oficio no hay nadie, se abre a la ciudad entera y,
    // en último caso, al país: es mejor proponer lejos que no proponer.
    if (snap.empty && ciudadNorm) {
      snap = await db.collection("tecnicos")
        .where("disponible", "==", true).where("ciudadNorm", "==", ciudadNorm)
        .orderBy("rankScore", "desc").limit(40).get();
    }
    if (snap.empty) {
      snap = await db.collection("tecnicos").where("disponible", "==", true)
        .orderBy("rankScore", "desc").limit(40).get();
    }
    // Suspender a un técnico no lo sacaba del reparto de solicitudes: el
    // agente lo seguía proponiendo y notificando.
    const tecnicos = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((t) => t.suspendido !== true);
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

    // Si Gemini falla o devuelve algo ilegible, el trabajo queda SIN aprobar
    // y a revisión manual. Antes el respaldo era `aprobadoIA: true`: una
    // caída del proveedor publicaba automáticamente todo lo que llegara,
    // que es justo lo contrario de lo que debe hacer un moderador.
    // callGemini LANZA cuando el proveedor responde con error o se cae la red.
    // Sin este try la excepción escapaba antes del update de abajo, el trabajo
    // se quedaba sin marcar y quedaba publicado: exactamente el fallo abierto
    // que este agente existe para evitar.
    let out = null;
    try {
      out = parseJsonLoose(
        await callGemini(prompt, GEMINI_KEY.value(), { maxTokens: 500, temperature: 0.1, json: true }), null);
    } catch (e) {
      console.error(`Moderación: Gemini no respondió para el trabajo ${tId}`, e);
    }
    const moderado = out !== null && typeof out.aprobadoIA === "boolean";

    await db.collection("trabajos").doc(tId).update({
      aprobadoIA: moderado ? out.aprobadoIA : false,
      razonModeracionIA: moderado ? (out.razonIA || "") : "La moderación automática no pudo evaluarlo; queda pendiente de revisión manual.",
      categoriaIA: moderado ? out.categoriaIA : "Otro",
      urgenciaIA: moderado ? out.urgenciaIA : "media",
      calidadIA: moderado ? out.calidadIA : null,
      moderadoPorIA: moderado,
      requiereRevisionManual: !moderado,
    });

    if (!moderado) {
      console.error(`Moderación no concluyente para trabajo ${tId}: queda sin publicar.`);
    }

    if (t.tecnicoId) {
      await db.collection("notificaciones").add({
        userId: t.tecnicoId,
        tipo: "moderacion",
        mensaje: !moderado
          ? `⏳ Tu trabajo "${t.titulo}" está en revisión: no pudimos evaluarlo automáticamente. Lo revisamos a mano y te avisamos.`
          : out.aprobadoIA
            ? `✅ Tu trabajo "${t.titulo}" fue revisado por IA (calidad ${out.calidadIA}/10)`
            : `⚠️ Tu trabajo "${t.titulo}" fue marcado por IA: ${out.razonIA}`,
        leida: false,
        link: "panel",
        fecha: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // El historial profesional es el producto entero, y hasta ahora no se
    // acumulaba: `totalTrabajos` se ponía a cero al registrarse y nadie lo
    // volvía a tocar, así que el ranking diario calculaba un puntaje con
    // campos permanentemente vacíos. Solo cuenta el trabajo aprobado.
    if (moderado && out.aprobadoIA && t.tecnicoId) {
      await db.collection("tecnicos").doc(t.tecnicoId).set({
        totalTrabajos: admin.firestore.FieldValue.increment(1),
      }, { merge: true });
    }

    await logDecision(
      "moderador",
      !moderado ? "NO CONCLUYENTE" : out.aprobadoIA ? "APROBÓ" : "MARCÓ",
      tId,
      moderado ? (out.razonIA || out.categoriaIA) : "La IA no devolvió un veredicto legible"
    );
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
      scoreInicialIA: out.scoreInicial ?? null,
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

// La ciudad no vive en la solicitud sino en el perfil de quien la crea.
async function ciudadDelUsuario(uid) {
  if (!uid) return "";
  const snap = await db.collection("tecnicos").doc(uid).get().catch(() => null);
  return snap?.data()?.ciudad || "";
}

exports.agenteCare = onSchedule(
  // Recorre todos los equipos con una llamada a Gemini cada uno: con el
  // tiempo de espera de 60 s por defecto moría a media lista y dejaba
  // actualizaciones a medias.
  { schedule: "every day 08:00", timeZone: "America/Cancun", secrets: [GEMINI_KEY],
    timeoutSeconds: 540, memory: "512MiB" },
  async () => {
    const snap = await db.collection("activos").where("eliminado", "==", false).get();
    const hoy = new Date().toISOString().slice(0, 10);

    for (const doc of snap.docs) {
      const a = doc.data();
      if (!a.userId) continue;
      const baseRaw = a.ultimoMantenimiento || a.fechaCompra;
      const baseDate = baseRaw ? (baseRaw.toDate ? baseRaw.toDate() : new Date(baseRaw)) : null;
      const intervalo = INTERVALOS_CARE[a.tipo] || 180;

      // Este agente corre a diario sobre TODOS los equipos: sin freno, cada
      // activo registrado costaba una llamada a Gemini cada 24 h para llegar
      // casi siempre a la misma conclusión. Un equipo recién revisado se
      // vuelve a analizar cada 7 días; conforme se acerca su fecha, a diario.
      const diasDesde = baseDate ? (Date.now() - baseDate.getTime()) / 86400000 : null;
      const cercaDeVencer = diasDesde == null || diasDesde >= intervalo - 30;
      const ultimoAnalisis = a.ultimoAnalisisIA?.toDate?.();
      const diasSinAnalizar = ultimoAnalisis
        ? (Date.now() - ultimoAnalisis.getTime()) / 86400000
        : Infinity;
      if (!cercaDeVencer && diasSinAnalizar < 7) continue;

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
        saludScoreIA: out.saludScoreIA ?? null,
        estadoIA: out.estadoIA ?? "amarillo",
        ultimoAnalisisIA: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Un equipo vencido cumplía la condición de aviso TODOS los días, para
      // siempre: el dueño recibía la misma notificación cada mañana hasta
      // darle servicio. Ahora solo se avisa cuando el estado empeora, o si
      // ya pasó una semana desde el último aviso.
      const avisoPrevio = a.ultimoAvisoIA?.toDate?.();
      const diasSinAvisar = avisoPrevio
        ? (Date.now() - avisoPrevio.getTime()) / 86400000
        : Infinity;
      const cambioDeEstado = a.estadoIA !== out.estadoIA;
      const tocaAvisar = cambioDeEstado || diasSinAvisar >= 7;

      if (tocaAvisar && (out.accionIA === "notificar" || out.accionIA === "crear_solicitud")) {
        await db.collection("notificaciones").add({
          userId: a.userId,
          tipo: "care",
          mensaje: `${out.estadoIA === "rojo" ? "🔴" : "🟡"} ${a.nombre}: ${out.mensajeIA}`,
          leida: false,
          link: "habilisCare",
          fecha: admin.firestore.FieldValue.serverTimestamp(),
        });
        await db.collection("activos").doc(doc.id).update({
          ultimoAvisoIA: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      if (out.accionIA === "crear_solicitud" && !a.solicitudAutoCreada) {
        await db.collection("solicitudes").add({
          titulo: `Mantenimiento: ${a.nombre}`,
          categoria: a.tipo,
          descripcion: `Solicitud creada automáticamente por el agente Habilis Care. ${out.mensajeIA}`,
          // Sin ciudad, el agente de matching leía "ciudad no especificada" y
          // asignaba técnicos de cualquier estado del país.
          ciudad: await ciudadDelUsuario(a.userId),
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
exports.agenteRanking = onSchedule(
  { schedule: "every day 08:30", timeZone: "America/Cancun", timeoutSeconds: 540, memory: "512MiB" },
  async () => {
  // Leía la colección ENTERA cada mañana: con cien mil perfiles son cien
  // mil lecturas diarias para recalcular un número que, en la mayoría, no
  // cambió. Ahora solo se recalcula lo que se movió desde el último día,
  // más los Pro cancelados que puedan haber vencido.
  const ayer = admin.firestore.Timestamp.fromMillis(Date.now() - 26 * 3600 * 1000);
  const [cambiados, caducables] = await Promise.all([
    db.collection("tecnicos").where("updatedAt", ">=", ayer).limit(5000).get(),
    db.collection("tecnicos").where("suscripcionEstado", "==", "cancelled").limit(1000).get(),
  ]);
  // Un mismo técnico puede salir en las dos consultas.
  const porId = new Map();
  for (const d of [...cambiados.docs, ...caducables.docs]) porId.set(d.id, d);
  const snap = { docs: [...porId.values()] };
  let n = 0;
  const ahora = Date.now();
  // Una escritura suelta por técnico, esperando cada una: con unos cientos
  // de perfiles el programado moría antes de terminar. En lotes de 500 —el
  // máximo de Firestore— la colección entera cabe en unas pocas entregas.
  let lote = db.batch();
  let enLote = 0;
  const vaciar = async () => {
    if (enLote === 0) return;
    await lote.commit();
    lote = db.batch();
    enLote = 0;
  };
  for (const doc of snap.docs) {
    const t = doc.data();
    // Una suscripción cancelada conserva el Pro hasta el fin del mes pagado;
    // este recorrido diario es el que finalmente lo baja a gratis.
    if (t.plan === "pro" && t.suscripcionEstado === "cancelled"
        && t.proHasta?.toDate && t.proHasta.toDate().getTime() < ahora) {
      lote.set(doc.ref, { plan: "gratis", proHasta: null }, { merge: true });
      if (++enLote >= 500) await vaciar();
      continue;
    }
    // Fórmula sobre señales reales. Antes pesaba `rating` y `totalReviews`,
    // que no los escribía nadie: el puntaje era, en la práctica, "años
    // declarados + ser Pro". Ahora manda el trabajo documentado y validado.
    const score =
      (t.totalTrabajos || 0) * 3 +
      (t.totalValidaciones || 0) * 2 +
      Math.min(t.experiencia || 0, 30) * 0.5 +
      (t.verificado ? 5 : 0) +
      (t.plan === "pro" ? 8 : 0);
    lote.set(db.collection("tecnicos").doc(doc.id), { rankScore: score }, { merge: true });
    n++;
    if (++enLote >= 500) await vaciar();
  }
  await vaciar();
  await logDecision("ranking", `recalculó ${n} técnico(s)`, "batch",
    "solo perfiles con cambios en las últimas 26 h y suscripciones por vencer");
});

// ═══════════════════════════════════════════════════════════════
// ⭐ VALIDACIÓN SOCIAL — corre al recibir un voto de un cliente
// Los votos se guardaban uno por documento, pero nadie los contaba: el
// trabajo no mostraba cuántos tenía y el técnico no acumulaba reputación.
// ═══════════════════════════════════════════════════════════════
// Lleva la cuenta de trabajos creados por técnico. Es lo que consulta la
// regla de Firestore para aplicar el tope de 5 del plan gratuito, que se
// anunciaba desde el principio y no existía en ninguna parte.
exports.contarTrabajoCreado = onDocumentCreated("trabajos/{id}", async (event) => {
  const tecnicoId = event.data.data()?.tecnicoId;
  if (!tecnicoId) return;
  await db.collection("tecnicos").doc(tecnicoId).set({
    trabajosCreados: admin.firestore.FieldValue.increment(1),
  }, { merge: true });
});

// El chat funcionaba, pero en silencio: un cliente escribía y el técnico solo
// se enteraba si por casualidad volvía a abrir la conversación. La campana
// anunciaba "notificaciones de actividad" que para el chat no existían.
exports.notificarMensajeChat = onDocumentCreated(
  "solicitudes_chat/{solicitudId}/mensajes/{mensajeId}",
  async (event) => {
    const m = event.data.data();
    // Los avisos que el propio sistema escribe no se notifican a nadie:
    // duplicarían lo que la pantalla ya muestra.
    if (!m || m.tipo !== "mensaje" || !m.autorId) return;

    const solId = event.params.solicitudId;
    const snap = await db.collection("solicitudes_chat").doc(solId).get();
    const chat = snap.data();
    if (!chat) return;

    // El destinatario es la otra parte de la conversación.
    const destinatario = m.autorId === chat.clienteId ? chat.tecnicoId
                       : m.autorId === chat.tecnicoId ? chat.clienteId
                       : null;
    if (!destinatario) return;

    const texto = String(m.texto || "").replace(/\s+/g, " ").trim();
    await db.collection("notificaciones").add({
      userId: destinatario,
      tipo: "chat",
      mensaje: `💬 Mensaje nuevo${chat.descripcion ? ` sobre "${String(chat.descripcion).slice(0, 40)}"` : ""}: "${texto.slice(0, 70)}${texto.length > 70 ? "…" : ""}"`,
      leida: false,
      link: "chat",
      solicitudId: solId,
      fecha: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

// La estrella del perfil. El cliente calificaba al terminar el trabajo, la
// calificación se guardaba dentro de la conversación… y ahí se quedaba:
// `rating` y `totalReviews` no los escribía NADIE, así que todos los perfiles
// mostraban "Sin calificaciones" para siempre y el buscador ordenaba por un
// campo que no existía. Este disparador es el que cierra ese circuito.
exports.agregarCalificacion = onDocumentUpdated("solicitudes_chat/{id}", async (event) => {
  const antes   = event.data.before.data();
  const despues = event.data.after.data();
  // Solo cuando la calificación aparece por primera vez: si el cliente la
  // editara, no se vuelve a sumar.
  if (antes?.review || !despues?.review) return;

  const estrellas = Number(despues.review.rating);
  const tecnicoId = despues.tecnicoId;
  if (!tecnicoId || !Number.isFinite(estrellas) || estrellas < 1 || estrellas > 5) return;

  const ref = db.collection("tecnicos").doc(tecnicoId);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return;
    const d = snap.data();
    const total = (d.totalReviews || 0) + 1;
    // Media acumulada, redondeada a un decimal: es como se muestra.
    const suma = (d.rating || 0) * (d.totalReviews || 0) + estrellas;
    tx.update(ref, {
      totalReviews: total,
      rating: Math.round((suma / total) * 10) / 10,
    });
  });

  await db.collection("notificaciones").add({
    userId: tecnicoId,
    tipo: "calificacion",
    mensaje: `⭐ Recibiste una calificación de ${estrellas}/5${despues.review.texto ? `: "${String(despues.review.texto).slice(0, 60)}"` : ""}`,
    leida: false,
    link: "panel",
    fecha: admin.firestore.FieldValue.serverTimestamp(),
  });
});

exports.contarValidacion = onDocumentCreated("validaciones/{id}", async (event) => {
  const v = event.data.data();
  if (!v?.trabajoId || !v?.tipo) return;

  const campo = v.tipo === "util" ? "validacionesUtil" : "validacionesBienHecho";
  const trabajoRef = db.collection("trabajos").doc(v.trabajoId);
  await trabajoRef.set({
    [campo]: admin.firestore.FieldValue.increment(1),
  }, { merge: true });

  // El técnico dueño acumula el total, que es lo que alimenta el ranking.
  const trabajo = await trabajoRef.get();
  const tecnicoId = trabajo.data()?.tecnicoId;
  if (tecnicoId) {
    await db.collection("tecnicos").doc(tecnicoId).set({
      totalValidaciones: admin.firestore.FieldValue.increment(1),
    }, { merge: true });
  }
});

// ═══════════════════════════════════════════════════════════════
// GEMINI PROXY (genérico) — usos síncronos que el usuario dispara a
// propósito: sugerirRespuesta, generarTipsMantenimiento, clasificarSolicitud,
// generarResumenChat, sugerirColaboradores. El prompt lo arma el cliente
// (gemini.js) y este proxy solo añade auth + rate limit + log.
// ═══════════════════════════════════════════════════════════════
// Herramientas de IA reservadas al Plan Pro. Se anunciaban como beneficio
// exclusivo y no había ninguna comprobación: el plan gratuito las usaba
// igual, así que no había razón para pagar. Quedan fuera de la reserva el
// soporte (bloquearlo sería hostil con quien tiene un problema) y la mejora
// del perfil, que ocurre al registrarse, antes de poder ser Pro.
const IA_SOLO_PRO = new Set([
  "cotizacion", "respuesta", "resumen", "colaboradores", "care", "mercado",
]);

// El candado anterior solo miraba el `agentName` que mandaba el cliente:
// cualquiera podía pedir la misma herramienta con agentName:"generic" y
// usarla gratis. Ahora el nombre tiene que estar en esta lista —así el
// registro de decisiones tampoco admite basura— y lo que no esté se rechaza.
const AGENTES_VALIDOS = new Set([
  ...IA_SOLO_PRO,
  "generic", "soporte", "perfil", "clasificacion", "matching",
]);

exports.geminiProxy = onCall({ secrets: [GEMINI_KEY] }, async (request) => {
  const uid = requireAuth(request);
  await checkRateLimit(uid, "geminiProxy", 60);
  const { prompt, temperature = 0.7, agentName = "generic" } = request.data ?? {};
  if (!prompt || typeof prompt !== "string" || !prompt.trim() || prompt.length > 4000) {
    throw new HttpsError("invalid-argument", "El campo 'prompt' es requerido y debe ser válido.");
  }
  if (typeof agentName !== "string" || !AGENTES_VALIDOS.has(agentName)) {
    throw new HttpsError("invalid-argument", "Herramienta de IA desconocida.");
  }
  // Sin esto, un número fuera de rango o una cadena provocaban un 400 de
  // Gemini que al usuario le llegaba como "error interno".
  const temp = Number(temperature);
  if (!Number.isFinite(temp) || temp < 0 || temp > 2) {
    throw new HttpsError("invalid-argument", "Parámetro de temperatura inválido.");
  }

  if (IA_SOLO_PRO.has(agentName)) {
    const perfil = await db.collection("tecnicos").doc(uid).get();
    if (perfil.data()?.plan !== "pro") {
      throw new HttpsError("permission-denied",
        "Esta herramienta es del Plan Pro. Puedes activarlo desde tu página de suscripción.");
    }
  }
  const text = await callGemini(prompt, GEMINI_KEY.value(), { temperature: temp, maxTokens: 1024 });
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

  // El navegador manda "audio/webm;codecs=opus"; el parámetro de códec sobra
  // y solo estorba. Además se restringe a formatos que Gemini admite: antes
  // cualquier cadena viajaba tal cual y el error volvía en silencio.
  const base = String(mimeType || "audio/webm").split(";")[0].trim().toLowerCase();
  const FORMATOS = new Set([
    "audio/webm", "audio/ogg", "audio/mp4", "audio/mpeg",
    "audio/mp3", "audio/wav", "audio/aac", "audio/flac",
  ]);
  const tipo = FORMATOS.has(base) ? base : "audio/webm";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY.value()}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      generationConfig: { responseMimeType: "application/json" },
      contents: [
        {
          parts: [
            { inline_data: { mime_type: tipo, data: audioBase64 } },
            {
              text: `Transcribe este audio en español de un trabajador técnico mexicano registrándose en Habilis. Extrae y responde SOLO JSON: {"nombre":"","oficio":"","ciudad":"","experiencia":0,"bio":"lo que dijo, ordenado"}`,
            },
          ],
        },
      ],
    }),
  });
  // Sin comprobar r.ok, un 400 (audio ilegible, demasiado largo) devolvía el
  // perfil vacío y se registraba como éxito: el técnico dictaba, no se
  // llenaba nada y nadie —ni él ni nosotros— sabía por qué.
  if (!r.ok) {
    const cuerpo = await r.text().catch(() => "");
    console.error(`Transcripción: Gemini ${r.status} — ${cuerpo.slice(0, 400)}`);
    throw new HttpsError("internal", "No pudimos entender el audio. Intenta de nuevo o escribe los datos.");
  }
  const d = await r.json().catch(() => null);
  const text = d?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const out = parseJsonLoose(text, null);
  if (!out || typeof out !== "object") {
    console.error("Transcripción: respuesta ilegible de Gemini", text.slice(0, 300));
    throw new HttpsError("internal", "No pudimos entender el audio. Intenta de nuevo o escribe los datos.");
  }
  await logDecision("registroVoz", "transcribió y estructuró perfil", uid, "");
  return {
    nombre:      typeof out.nombre === "string" ? out.nombre : "",
    oficio:      typeof out.oficio === "string" ? out.oficio : "",
    ciudad:      typeof out.ciudad === "string" ? out.ciudad : "",
    experiencia: Number(out.experiencia) || 0,
    bio:         typeof out.bio === "string" ? out.bio : "",
  };
});

// ═══════════════════════════════════════════════════════════════
// MERCADO PAGO — suscripción Habilis Pro
// ═══════════════════════════════════════════════════════════════
exports.crearSuscripcion = onCall({ secrets: [MP_TOKEN] }, async (request) => {
  const uid = requireAuth(request);
  await checkRateLimit(uid, "crearSuscripcion", 10);

  // Sin perfil de técnico no hay a quién darle el plan: el webhook fallaría
  // al activarlo y el cobro quedaría vivo sin contraprestación. Se comprueba
  // ANTES de tocar la API de Mercado Pago para no crear la suscripción.
  const perfil = await db.collection("tecnicos").doc(uid).get();
  if (!perfil.exists) {
    throw new HttpsError("failed-precondition",
      "Antes de suscribirte necesitas completar tu perfil de técnico.");
  }

  const { email, codigo } = request.data;
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpsError("invalid-argument", "Email requerido.");
  }

  // Código de descuento (colección `promos` del admin de Marketing).
  let monto = 100;
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
    monto = Math.round(100 * (1 - pct / 100) * 100) / 100;
    promoId = promoRef.id;
  }

  const r = await fetch("https://api.mercadopago.com/preapproval", {
    method: "POST",
    headers: { Authorization: `Bearer ${MP_TOKEN.value()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      reason: "Habilis Pro",
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
    promoId,
    fecha: admin.firestore.FieldValue.serverTimestamp(),
  });
  return { url: destino, monto };
});

// Cancelar la suscripción desde la propia app. Antes había que buscarla en
// Mercado Pago: una fricción innecesaria y una queja segura de soporte.
// El plan se retira aquí mismo y el webhook confirma después el estado.
exports.cancelarSuscripcion = onCall({ secrets: [MP_TOKEN] }, async (request) => {
  const uid = requireAuth(request);
  await checkRateLimit(uid, "cancelarSuscripcion", 10);

  const tecnico = await db.collection("tecnicos").doc(uid).get();
  const origen = tecnico.data()?.origenSuscripcion;

  // Una suscripción comprada en App Store o Google Play NO se puede cancelar
  // desde aquí: es una pantalla del sistema operativo, y ambas tiendas
  // rechazan las apps que intentan hacerlo por su cuenta.
  if (origen === "app_store" || origen === "play_store") {
    throw new HttpsError("failed-precondition",
      origen === "app_store"
        ? "Tu suscripción se contrató en la App Store. Cancélala desde Ajustes → tu nombre → Suscripciones."
        : "Tu suscripción se contrató en Google Play. Cancélala desde Play Store → Pagos y suscripciones.");
  }

  let suscripcionId = tecnico.data()?.suscripcionId;

  // Hubo caminos que activaban Pro sin guardar el id de la suscripción, y el
  // técnico quedaba sin poder cancelar mientras se le seguía cobrando. Si
  // falta, se busca en Mercado Pago por la referencia externa (su uid).
  if (!suscripcionId) {
    const busqueda = await mpGet(`/preapproval/search?external_reference=${encodeURIComponent(uid)}`);
    const viva = (busqueda?.results || []).find(
      (p) => p.status === "authorized" || p.status === "pending"
    );
    if (viva?.id) {
      suscripcionId = viva.id;
      await db.collection("tecnicos").doc(uid).set({ suscripcionId }, { merge: true });
    }
  }

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

  // Se conserva el plan hasta el fin del periodo ya cobrado, que es lo que
  // dicen los Términos y lo que responde el asistente de soporte.
  const ref = db.collection("tecnicos").doc(uid);
  const hasta = finDePeriodoPagado((await ref.get()).data()?.fechaPago);
  await ref.set({
    plan: "pro",
    suscripcionEstado: "cancelled",
    proHasta: hasta,
  }, { merge: true });
  return { ok: true, proHasta: hasta.toDate().toISOString() };
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

// En las notificaciones de suscripción, el id que manda Mercado Pago
// identifica un "authorized payment", que vive en /authorized_payments/{id}
// y no en /v1/payments/{id}. Consultar el endpoint equivocado devolvía null y
// la notificación se descartaba en silencio: el cobro mensual nunca quedaba
// registrado, no se podía facturar y Finanzas mostraba cero ingresos.
// Se prueban los dos y se normaliza la forma del resultado.
async function obtenerPagoRecurrente(id) {
  const ap = await mpGet(`/authorized_payments/${id}`);
  if (ap) {
    const p = ap.payment || {};
    return {
      // El id manda el del cobro autorizado, no el del pago: un mismo cargo
      // se notifica primero como "scheduled" (sin sub-objeto payment) y
      // después como procesado, y usar p.id creaba DOS documentos del mismo
      // cobro, uno de ellos fantasma en Finanzas.
      id: ap.id ?? p.id ?? id,
      pagoId: p.id ?? null,
      status: p.status ?? ap.status ?? "desconocido",
      transaction_amount: p.transaction_amount ?? ap.transaction_amount ?? 0,
      date_approved: p.date_approved ?? ap.date_created ?? null,
      preapproval_id: ap.preapproval_id ?? null,
      external_reference: ap.external_reference ?? null,
      // Necesario para la forma de pago del CFDI: antes se descartaba y el
      // comprobante salía siempre como débito.
      payment_method_id: p.payment_type_id ?? p.payment_method_id ?? ap.payment_method_id ?? null,
    };
  }
  const pago = await mpGet(`/v1/payments/${id}`);
  if (!pago) return null;
  return {
    id: pago.id ?? id,
    pagoId: pago.id ?? null,
    status: pago.status ?? "desconocido",
    transaction_amount: pago.transaction_amount ?? 0,
    date_approved: pago.date_approved ?? null,
    preapproval_id: pago.metadata?.preapproval_id ?? pago.preapproval_id ?? null,
    external_reference: pago.external_reference ?? null,
    payment_method_id: pago.payment_type_id ?? pago.payment_method_id ?? null,
  };
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

// `authorized` da acceso Pro; `paused` (típicamente por un cobro que falló) y
// `cancelled` lo retiran. Antes solo se contemplaban los dos extremos, así que
// una suscripción pausada conservaba el plan Pro indefinidamente.
// Los Términos y el asistente de soporte prometen lo mismo: al cancelar
// "conservas los beneficios hasta el fin del periodo ya pagado". El código
// hacía lo contrario —bajaba a gratis en el acto—, así que quien cancelaba
// el día 2 perdía 28 días pagados. `proHasta` es la fecha hasta la que el
// plan sigue valiendo.
function finDePeriodoPagado(fechaPago) {
  const base = fechaPago?.toDate?.() || new Date();
  const fin = new Date(base);
  fin.setMonth(fin.getMonth() + 1);
  return admin.firestore.Timestamp.fromDate(fin);
}

async function aplicarEstadoSuscripcion(uid, sub) {
  // `set(..., { merge: true })` en vez de `update()`: si el documento del
  // técnico no existe todavía, `update()` lanza NOT_FOUND y el aviso de
  // Mercado Pago se pierde para siempre — quedaba cobrando sin plan.
  const ref = db.collection("tecnicos").doc(uid);
  if (sub.status === "authorized") {
    await ref.set({
      plan: "pro",
      suscripcionId: sub.id,
      suscripcionEstado: "authorized",
      fechaPago: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    await consumirPromo(uid);
  } else if (sub.status === "cancelled") {
    // Cancelada: no habrá más cobros, pero el mes en curso ya está pagado.
    const snap = await ref.get();
    await ref.set({
      plan: "pro",
      suscripcionEstado: "cancelled",
      proHasta: finDePeriodoPagado(snap.data()?.fechaPago),
    }, { merge: true });
  } else if (sub.status === "paused") {
    // Pausada casi siempre significa un cobro que falló: aquí no hay periodo
    // pagado que respetar.
    await ref.set({ plan: "gratis", suscripcionEstado: "paused", proHasta: null }, { merge: true });
  } else {
    await ref.set({ suscripcionEstado: sub.status || "desconocido" }, { merge: true });
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
  const ref = db.collection("pagos").doc(`mp_${pago.id}`);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const datos = {
      userId: uid,
      monto: pago.transaction_amount ?? 0,
      metodo: "mercadopago",
      estado: aprobado ? "aprobado" : (pago.status || "desconocido"),
      concepto: "Habilis Pro mensual",
      pagoMP: String(pago.pagoId ?? pago.id),
      metodoPago: pago.payment_method_id || null,
      suscripcionId: preapprovalId || null,
      fecha: pago.date_approved
        ? admin.firestore.Timestamp.fromDate(new Date(pago.date_approved))
        : admin.firestore.FieldValue.serverTimestamp(),
    };
    if (!snap.exists) datos.facturada = false;
    tx.set(ref, datos, { merge: true });
  });

  if (aprobado) {
    // Se escribe también `suscripcionId`: sin él, el botón de cancelar del
    // técnico devuelve un error permanente mientras se le sigue cobrando.
    await db.collection("tecnicos").doc(uid).set({
      plan: "pro",
      suscripcionEstado: "authorized",
      ...(preapprovalId ? { suscripcionId: preapprovalId } : {}),
      fechaPago: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
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
      const pago = await obtenerPagoRecurrente(data.id);
      if (pago) {
        const preapprovalId = pago.preapproval_id || null;
        const uid = await resolverUid(pago, preapprovalId);
        if (uid) await registrarPagoSuscripcion(uid, pago, preapprovalId);
        else console.error(`webhookMP: cobro ${data.id} sin técnico identificable.`);
      } else {
        console.error(`webhookMP: no se pudo leer el cobro ${data.id} en Mercado Pago.`);
      }
    }

    res.status(200).send("OK");
  } catch (e) {
    // Responder 200 ante un fallo hacía que Mercado Pago diera la entrega por
    // buena y no reintentara: el cobro se perdía sin dejar rastro. Ahora el
    // evento crudo queda guardado para poder reprocesarlo, y se devuelve 500
    // para que Mercado Pago lo reintente.
    console.error("webhookMP error:", e.message);
    try {
      await db.collection("webhooksFallidos").add({
        origen: "mercadopago",
        cuerpo: JSON.stringify(req.body || {}).slice(0, 4000),
        error: String(e.message).slice(0, 500),
        reprocesado: false,
        fecha: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (e2) {
      console.error("webhookMP: tampoco se pudo registrar el fallo:", e2.message);
    }
    res.status(500).send("ERROR");
  }
});

// El cliente aceptaba una cotización, la pantalla le decía "El técnico se
// pondrá en contacto contigo" y el técnico no se enteraba de nada: no había
// ningún disparador sobre `cotizaciones`. La cotización aceptada se quedaba
// esperando a que él entrara a mirar por casualidad.
exports.avisarCotizacionDecidida = onDocumentUpdated("cotizaciones/{id}", async (event) => {
  const antes   = event.data.before.data();
  const despues = event.data.after.data();
  if (!despues?.tecnicoId || antes?.estado === despues?.estado) return;
  if (!["aceptada", "rechazada"].includes(despues.estado)) return;

  const cliente = despues.cliente?.nombre?.trim();
  const folio   = despues.folio ? `#${despues.folio}` : "";
  const aceptada = despues.estado === "aceptada";

  await db.collection("notificaciones").add({
    userId: despues.tecnicoId,
    tipo: "cotizacion",
    mensaje: aceptada
      ? `✅ ${cliente || "Un cliente"} aceptó tu cotización ${folio}. Ponte en contacto para acordar fecha.`.trim()
      : `❌ ${cliente || "Un cliente"} rechazó tu cotización ${folio}.`.trim(),
    leida: false,
    link: "cotizaciones",
    fecha: admin.firestore.FieldValue.serverTimestamp(),
  });
});

// ═══════════════════════════════════════════════════════════════
// 🎙️ DICTAR UN TRABAJO — el técnico cuenta lo que hizo y la IA lo ordena.
// "Dicta tu trabajo terminado y la IA lo transcribe, clasifica y publica"
// se anunciaba en Cómo funciona y en Quiénes somos, y solo existía el
// dictado del PERFIL. Es justo la función que más falta le hace a quien
// termina un trabajo con las manos sucias.
// ═══════════════════════════════════════════════════════════════
exports.transcribirTrabajo = onCall({ secrets: [GEMINI_KEY] }, async (request) => {
  const uid = requireAuth(request);
  await checkRateLimit(uid, "transcribirTrabajo", 20);
  const { audioBase64, mimeType } = request.data ?? {};
  if (!audioBase64 || typeof audioBase64 !== "string") {
    throw new HttpsError("invalid-argument", "Audio requerido.");
  }
  if (audioBase64.length > 15 * 1024 * 1024) {
    throw new HttpsError("invalid-argument", "El audio es demasiado largo.");
  }
  const base = String(mimeType || "audio/webm").split(";")[0].trim().toLowerCase();
  const FORMATOS = new Set([
    "audio/webm", "audio/ogg", "audio/mp4", "audio/mpeg",
    "audio/mp3", "audio/wav", "audio/aac", "audio/flac",
  ]);
  const tipo = FORMATOS.has(base) ? base : "audio/webm";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY.value()}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      generationConfig: { responseMimeType: "application/json", temperature: 0.2, maxOutputTokens: 700 },
      contents: [{
        parts: [
          { inline_data: { mime_type: tipo, data: audioBase64 } },
          { text: `Un trabajador técnico mexicano acaba de terminar un trabajo y lo está contando en voz alta. Transcribe y ordena lo que dijo.

Reglas:
- Escribe en español neutro de México, en tercera persona y en pasado.
- NO inventes datos: si no dijo el costo, las horas o la ciudad, deja el campo vacío o en 0.
- "tipo" tiene que ser exactamente uno de: Instalación, Reparación, Mantenimiento, Diagnóstico, Otro.
- "titulo" es una línea corta y concreta, máximo 60 caracteres.

Responde SOLO JSON:
{"titulo":"","tipo":"Reparación","descripcion":"","problema":"lo que estaba mal","solucion":"lo que hizo","materiales":"lo que usó, separado por comas","tiempoHoras":0,"costoTotal":0,"ciudad":"","clienteNombre":""}` },
        ],
      }],
    }),
  });
  if (!r.ok) {
    const cuerpo = await r.text().catch(() => "");
    console.error(`Dictado de trabajo: Gemini ${r.status} — ${cuerpo.slice(0, 400)}`);
    throw new HttpsError("internal", "No pudimos entender el audio. Intenta de nuevo o escribe los datos.");
  }
  const d = await r.json().catch(() => null);
  const out = parseJsonLoose(d?.candidates?.[0]?.content?.parts?.[0]?.text || "", null);
  if (!out || typeof out !== "object") {
    throw new HttpsError("internal", "No pudimos entender el audio. Intenta de nuevo o escribe los datos.");
  }

  const TIPOS = new Set(["Instalación", "Reparación", "Mantenimiento", "Diagnóstico", "Otro"]);
  const texto = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  await logDecision("dictadoTrabajo", "transcribió y estructuró un trabajo", uid, "");
  return {
    titulo:        texto(out.titulo, 80),
    tipo:          TIPOS.has(out.tipo) ? out.tipo : "Otro",
    descripcion:   texto(out.descripcion, 1500),
    problema:      texto(out.problema, 800),
    solucion:      texto(out.solucion, 800),
    materiales:    texto(out.materiales, 500),
    tiempoHoras:   Number(out.tiempoHoras) || 0,
    costoTotal:    Number(out.costoTotal) || 0,
    ciudad:        texto(out.ciudad, 80),
    clienteNombre: texto(out.clienteNombre, 80),
  };
});

// ═══════════════════════════════════════════════════════════════
// 🗑️ BORRAR MI CUENTA
// Apple rechaza (guía 5.1.1 v) cualquier app con registro que no permita
// borrar la cuenta DESDE DENTRO, y Google Play exige lo mismo desde 2024.
// Aquí sólo se podía pedir por correo. Además es el derecho de cancelación
// de la LFPDPPP, que hoy se atendía a mano.
//
// Se borra lo que es del usuario y se ANONIMIZA lo que no puede
// desaparecer: los cobros y las facturas tienen que conservarse por
// obligación fiscal, y los mensajes de un chat son también de la otra parte.
// ═══════════════════════════════════════════════════════════════
async function borrarPorLotes(consulta) {
  let borrados = 0;
  while (true) {
    const snap = await consulta.limit(300).get();
    if (snap.empty) break;
    const lote = db.batch();
    snap.docs.forEach((d) => lote.delete(d.ref));
    await lote.commit();
    borrados += snap.size;
    if (snap.size < 300) break;
  }
  return borrados;
}

exports.eliminarMiCuenta = onCall({ secrets: [MP_TOKEN], timeoutSeconds: 300 }, async (request) => {
  const uid = requireAuth(request);
  await checkRateLimit(uid, "eliminarCuenta", 5);

  // La confirmación escrita evita el borrado por un toque accidental y es
  // lo que las tiendas esperan ver en el flujo.
  if (request.data?.confirmacion !== "ELIMINAR") {
    throw new HttpsError("invalid-argument", "Falta la confirmación para eliminar la cuenta.");
  }

  const perfil = await db.collection("tecnicos").doc(uid).get();
  const datos = perfil.data() || {};

  // Primero se corta el cobro: borrar la cuenta dejando viva la suscripción
  // sería seguir cobrando a alguien que ya no existe en la plataforma.
  if (datos.suscripcionId) {
    try {
      await fetch(`https://api.mercadopago.com/preapproval/${datos.suscripcionId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${MP_TOKEN.value()}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
    } catch (e) {
      console.error(`No se pudo cancelar la suscripción de ${uid} al borrar su cuenta:`, e.message);
      throw new HttpsError("failed-precondition",
        "No pudimos cancelar tu suscripción activa. Cancélala primero desde tu panel y vuelve a intentarlo.");
    }
  }

  // Lo que es enteramente suyo desaparece.
  await borrarPorLotes(db.collection("trabajos").where("tecnicoId", "==", uid));
  await borrarPorLotes(db.collection("activos").where("userId", "==", uid));
  await borrarPorLotes(db.collection("servicios").where("userId", "==", uid));
  await borrarPorLotes(db.collection("cotizaciones").where("tecnicoId", "==", uid));
  await borrarPorLotes(db.collection("clientes_tecnico").where("tecnicoId", "==", uid));
  await borrarPorLotes(db.collection("productos_tecnico").where("tecnicoId", "==", uid));
  await borrarPorLotes(db.collection("solicitudes").where("userId", "==", uid));
  await borrarPorLotes(db.collection("notificaciones").where("userId", "==", uid));
  await borrarPorLotes(db.collection("validaciones").where("validadorId", "==", uid));
  await db.collection("cotizaciones_folio").doc(uid).delete().catch(() => {});
  await db.collection("suscripcionesPendientes").doc(uid).delete().catch(() => {});

  // Las conversaciones son de dos personas: se anonimiza al que se va en
  // lugar de borrar el hilo de la otra parte.
  for (const campo of ["tecnicoId", "clienteId"]) {
    const chats = await db.collection("solicitudes_chat").where(campo, "==", uid).get();
    const lote = db.batch();
    chats.docs.forEach((d) => lote.update(d.ref, {
      [campo === "tecnicoId" ? "tecnicoNombre" : "clienteNombre"]: "Usuario eliminado",
      cuentaEliminada: true,
    }));
    if (!chats.empty) await lote.commit();
  }

  // Cobros y facturas se conservan por obligación fiscal (CFF art. 30: cinco
  // años), pero desligados de la persona.
  for (const col of ["pagos", "facturas"]) {
    const docs = await db.collection(col).where("userId", "==", uid).get();
    const lote = db.batch();
    docs.docs.forEach((d) => lote.update(d.ref, { userId: `eliminado_${uid.slice(0, 6)}`, cuentaEliminada: true }));
    if (!docs.empty) await lote.commit();
  }

  await db.collection("tecnicos").doc(uid).delete().catch(() => {});
  await db.collection("clientes").doc(uid).delete().catch(() => {});
  await logDecision("cuenta", "eliminó su cuenta", uid, "solicitud del propio usuario");

  // Lo último: sin la cuenta de acceso, nada de lo anterior sería reversible
  // por el usuario aunque quedara algo suelto.
  await admin.auth().deleteUser(uid);
  return { ok: true };
});

// ═══════════════════════════════════════════════════════════════
// 🍏 COBRO DENTRO DE LA APP — App Store y Google Play
//
// Apple y Google exigen su propio sistema de cobro para lo que desbloquea
// funciones dentro de la app. En la web se sigue cobrando por Mercado Pago,
// que no paga comisión de tienda. Los dos caminos terminan aquí: en el
// mismo `plan: "pro"` del documento del técnico.
//
// RevenueCat avisa de cada compra, renovación, cancelación y reembolso. Se
// usa en lugar de hablar con cada tienda por separado porque la validación
// de recibos de Apple y la de Google no se parecen en nada.
// ═══════════════════════════════════════════════════════════════
const EVENTOS_ALTA  = new Set([
  "INITIAL_PURCHASE", "RENEWAL", "UNCANCELLATION",
  "PRODUCT_CHANGE", "SUBSCRIPTION_EXTENDED", "TRANSFER",
]);
const EVENTOS_BAJA  = new Set(["EXPIRATION", "REFUND", "SUBSCRIPTION_PAUSED"]);

exports.webhookTienda = onRequest({ secrets: [RC_WEBHOOK_SECRET] }, async (req, res) => {
  try {
    // RevenueCat manda el secreto en Authorization. Sin comprobarlo,
    // cualquiera con la URL se regalaría el plan Pro.
    const esperado = RC_WEBHOOK_SECRET.value();
    if (!esperado || req.headers.authorization !== esperado) {
      console.error("webhookTienda: autorización inválida");
      res.status(401).send("NO AUTORIZADO");
      return;
    }

    const ev = req.body?.event;
    if (!ev?.type) { res.status(200).send("SIN EVENTO"); return; }

    // `app_user_id` es el uid de Habilis: se lo pasamos al SDK con logIn().
    const uid = ev.app_user_id;
    if (!uid || uid.startsWith("$RCAnonymousID")) {
      // Una compra anónima no se puede asociar a nadie. Se registra para
      // poder reclamarla a mano en vez de perderla en silencio.
      await db.collection("webhooksFallidos").add({
        origen: "revenuecat", motivo: "compra sin usuario identificado",
        evento: ev.type, cuerpo: JSON.stringify(req.body).slice(0, 4000),
        fecha: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.status(200).send("SIN USUARIO");
      return;
    }

    const tienda = ev.store === "APP_STORE" ? "app_store"
                 : ev.store === "PLAY_STORE" ? "play_store"
                 : String(ev.store || "desconocida").toLowerCase();
    const ref = db.collection("tecnicos").doc(uid);

    if (EVENTOS_ALTA.has(ev.type)) {
      await ref.set({
        plan: "pro",
        suscripcionEstado: "authorized",
        // De dónde viene el cobro. Importa: una suscripción de tienda NO se
        // cancela desde aquí (lo hace el usuario en los ajustes del
        // teléfono) y NO se factura con CFDI, porque quien cobró fue Apple
        // o Google, no Habilis.
        origenSuscripcion: tienda,
        proHasta: ev.expiration_at_ms
          ? admin.firestore.Timestamp.fromMillis(Number(ev.expiration_at_ms))
          : null,
        fechaPago: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      // Se deja constancia del cobro para Finanzas, marcado como no
      // facturable: el comprobante lo emite la tienda al usuario final.
      if (ev.type !== "TRANSFER" && ev.id) {
        await db.collection("pagos").doc(`rc_${ev.id}`).set({
          userId: uid,
          monto: Number(ev.price_in_purchased_currency) || 0,
          moneda: ev.currency || "MXN",
          metodo: tienda,
          estado: "aprobado",
          concepto: "Habilis Pro mensual",
          // La tienda es el vendedor de cara al usuario y emite ella el
          // comprobante; Habilis recibe el neto ya sin comisión.
          facturable: false,
          comisionTienda: Number(ev.tax_percentage) || null,
          fecha: ev.purchased_at_ms
            ? admin.firestore.Timestamp.fromMillis(Number(ev.purchased_at_ms))
            : admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }
    } else if (EVENTOS_BAJA.has(ev.type)) {
      await ref.set({
        plan: "gratis",
        suscripcionEstado: ev.type === "REFUND" ? "refunded" : "expired",
        proHasta: null,
      }, { merge: true });
    } else if (ev.type === "CANCELLATION") {
      // Canceló la renovación, pero el periodo pagado sigue corriendo:
      // conserva el Pro hasta que la tienda mande EXPIRATION.
      await ref.set({
        plan: "pro",
        suscripcionEstado: "cancelled",
        proHasta: ev.expiration_at_ms
          ? admin.firestore.Timestamp.fromMillis(Number(ev.expiration_at_ms))
          : null,
      }, { merge: true });
    }

    await logDecision("tienda", `${ev.type} (${tienda})`, uid, "");
    res.status(200).send("OK");
  } catch (e) {
    console.error("webhookTienda:", e);
    // Un 500 hace que RevenueCat reintente en vez de dar el aviso por bueno.
    res.status(500).send("ERROR");
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
  // Los cobros hechos por App Store o Google Play no los factura Habilis: el
  // vendedor de cara al usuario es la tienda, que emite ella el comprobante
  // y retiene el IVA. Se avisa en lugar de dejar al técnico buscando una
  // factura que nunca va a aparecer.
  const perfilFactura = await db.collection("tecnicos").doc(uid).get();
  const origenPago = perfilFactura.data()?.origenSuscripcion;
  if (origenPago === "app_store" || origenPago === "play_store") {
    throw new HttpsError("failed-precondition",
      "Tu suscripción se cobró a través de la tienda de aplicaciones, que emite su propio comprobante. " +
      "Puedes descargarlo desde tu cuenta de " +
      (origenPago === "app_store" ? "Apple" : "Google") + ".");
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

  // Si algo sale mal a partir de aquí hay que DEVOLVER el cobro a la cola:
  // ya quedó marcado como facturado y, sin liberarlo, el técnico se queda
  // con un pago que nunca podrá facturar.
  const liberar = async (motivo, detalle) => {
    await pagoRef.update({ facturada: false }).catch((e) =>
      console.error("No se pudo liberar el cobro tras fallar Facturapi:", e.message));
    console.error(`Facturapi — ${motivo}:`, String(detalle).slice(0, 500));
  };

  // La forma de pago del CFDI venía fija en "28" (tarjeta de débito) aunque
  // la suscripción se cobrara con crédito, que es lo más común: un dato
  // fiscal incorrecto en cada comprobante.
  const FORMA_SAT = { credit_card: "04", debit_card: "28", prepaid_card: "04", account_money: "03" };
  const pagoDatos = (await pagoRef.get()).data() || {};
  const formaPago = FORMA_SAT[pagoDatos.metodoPago] || "03";  // 03 = transferencia electrónica

  let r, inv;
  try {
    r = await fetch("https://www.facturapi.io/v2/invoices", {
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
        payment_form: formaPago,
        use: usoCFDI,
      }),
    });
    inv = await r.json().catch(() => null);
  } catch (e) {
    await liberar("no se pudo contactar a Facturapi", e.message);
    throw new HttpsError("unavailable", "No pudimos conectar con el servicio de facturación. Intenta de nuevo en unos minutos.");
  }

  // Facturapi NO devuelve una clave `error`: sus fallos vienen con `message`,
  // `code` y un HTTP 4xx. Comprobar solo `inv.error` dejaba pasar todos los
  // rechazos —RFC mal, régimen que no corresponde, CSD vencido— y el cobro
  // se quedaba marcado como facturado sin CFDI, de forma permanente.
  if (!r.ok || !inv?.id) {
    await liberar(`respuesta ${r?.status}`, JSON.stringify(inv || {}));
    const detalle = inv?.message ? ` (${String(inv.message).slice(0, 160)})` : "";
    throw new HttpsError("failed-precondition",
      `No se pudo generar la factura. Verifica tus datos fiscales e intenta de nuevo.${detalle}`);
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
