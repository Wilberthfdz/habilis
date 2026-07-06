// ─── GEMINI SERVICE ────────────────────────────────────────────────────────
// Todas las llamadas pasan por la Cloud Function `geminiProxy`: la key vive
// solo server-side (functions/.env), nunca en el bundle del cliente.

import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase.js";

const fns   = getFunctions(app, "us-central1");
const proxy = httpsCallable(fns, "geminiProxy");

async function callGemini(prompt, temperature = 0.7) {
  const result = await proxy({ prompt, temperature });
  return result.data?.text ?? "";
}

// ── 1. MEJORA DE PERFIL ────────────────────────────────────────────────────
export async function mejorarPerfil(textoRaw, oficio) {
  const prompt = `Eres un asistente que ayuda a trabajadores técnicos en México a crear perfiles profesionales.

El siguiente texto fue escrito por un ${oficio} para describirse:
"${textoRaw}"

Transforma este texto en un perfil profesional bien redactado en español.
Reglas:
- Mantén los datos reales que menciona (años de experiencia, especialidades, zona)
- No inventes información que no esté en el texto original
- Tono: profesional pero cercano, no corporativo
- Formato: párrafo de presentación + lista de lo que incluye su servicio
- Máximo 150 palabras
- No uses frases como "con mucho gusto" o "a sus órdenes"

Responde SOLO con el perfil mejorado, sin explicaciones.`;
  return callGemini(prompt, 0.5);
}

// ── 2. CLASIFICACIÓN DE TRABAJO ─────────────────────────────────────────────
export async function clasificarTrabajo(descripcion) {
  const prompt = `Clasifica este trabajo técnico en México.

Descripción: "${descripcion}"

Responde SOLO con JSON válido:
{
  "tipo": "Instalación|Reparación|Mantenimiento|Diagnóstico|Otro",
  "categoria": "Electricidad|Plomería|HVAC|Redes|Cámaras|Herrería|Tablaroca|Pintura|Mecánica|Otro",
  "urgencia": "baja|media|alta",
  "palabrasClave": ["keyword1", "keyword2"]
}`;
  try {
    const raw = await callGemini(prompt, 0.1);
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return { tipo: "Otro", categoria: "Otro", urgencia: "media", palabrasClave: [] };
  }
}

// ── 3. RESPUESTA A CLIENTE ───────────────────────────────────────────────────
export async function sugerirRespuesta(solicitudCliente, perfilTecnico) {
  const prompt = `Eres asistente de un técnico mexicano. Ayúdale a responder esta solicitud de cliente.

Perfil del técnico: ${perfilTecnico.nombre}, ${perfilTecnico.oficio}, ${perfilTecnico.experiencia} años de experiencia.

Solicitud del cliente: "${solicitudCliente}"

Escribe una respuesta profesional y directa (máximo 80 palabras) que:
- Confirme que puede hacer el trabajo
- Mencione su experiencia relevante
- Indique que puede dar presupuesto
- Sea amable pero no exagerada

Responde SOLO con el texto de la respuesta.`;
  return callGemini(prompt, 0.6);
}

// ── 4. DETECCIÓN DE SPAM ─────────────────────────────────────────────────────
export async function detectarSpam(texto) {
  const prompt = `Analiza si este texto publicado en una plataforma de técnicos es spam o inapropiado.
Texto: "${texto}"
Responde SOLO con JSON: { "esSpam": true|false, "razon": "explicación o null", "confianza": 0.0-1.0 }`;
  try {
    const raw = await callGemini(prompt, 0.1);
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return { esSpam: false, razon: null, confianza: 0 };
  }
}

// ── 5a. HABILIS CARE — TIPS DE MANTENIMIENTO ────────────────────────────────
export async function generarTipsMantenimiento(tipo, marca, modelo) {
  const prompt = `Eres experto en mantenimiento preventivo de equipos para el mercado mexicano.

Equipo: ${tipo} marca "${marca || "desconocida"}" modelo "${modelo || "desconocido"}"

Genera exactamente 3 consejos de mantenimiento preventivo específicos y prácticos en español.
Incluye también 1 señal de alerta crítica a vigilar.

Responde SOLO con JSON válido:
{
  "tips": ["consejo específico 1", "consejo específico 2", "consejo específico 3"],
  "alerta": "señal de alerta principal",
  "frecuencia": "resumen de frecuencia recomendada en una línea"
}`;
  try {
    const raw = await callGemini(prompt, 0.4);
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return {
      tips: ["Realiza limpieza y revisión visual periódica", "Verifica conexiones y sellos contra humedad", "Registra cada servicio con fecha y costo en Habilis Care"],
      alerta: "Ruidos inusuales o caída de rendimiento indican servicio urgente",
      frecuencia: "Consulta el manual del fabricante para intervalos exactos",
    };
  }
}

// ── 5. SUGERENCIA DE TÉCNICOS ────────────────────────────────────────────────
export async function sugerirTecnicos(solicitud, tecnicos) {
  const lista = tecnicos.map(t =>
    `ID:${t.id} | ${t.nombre} | ${t.oficio} | Rating: ${t.rating}`
  ).join("\n");
  const prompt = `Cliente necesita: "${solicitud}"\n\nTécnicos:\n${lista}\n\nSelecciona los 3 más relevantes.\nResponde SOLO con JSON: { "recomendados": ["ID1","ID2","ID3"], "razon": "explicación" }`;
  try {
    const raw = await callGemini(prompt, 0.2);
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return { recomendados: tecnicos.slice(0, 3).map(t => t.id), razon: "Top calificados" };
  }
}

// ── 6. CLASIFICAR SOLICITUD DE SERVICIO ─────────────────────────────────
export async function clasificarSolicitud(descripcion) {
  const prompt = `Extrae del siguiente mensaje de solicitud de servicio técnico en México:
descripcion='${descripcion.slice(0, 500)}'

Responde SOLO con JSON válido:
{
  "tipoTrabajo": "descripción breve del trabajo en 5 palabras máx",
  "urgenciaDetectada": "baja|media|alta",
  "palabrasClave": ["keyword1", "keyword2"]
}`;
  try {
    const raw = await callGemini(prompt, 0.1);
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return { tipoTrabajo:"Servicio técnico", urgenciaDetectada:"media", palabrasClave:[] };
  }
}

// ── 7. RESUMEN DE CONVERSACIÓN AL COMPLETAR ──────────────────────────────
export async function generarResumenChat(mensajes, descripcionOriginal) {
  const chatText = mensajes
    .filter(m => m.tipo !== "sistema")
    .slice(-20)
    .map(m => `${m.autorNombre}: ${m.texto}`)
    .join("\n");
  if (!chatText.trim()) return "Trabajo completado satisfactoriamente.";
  const prompt = `Genera un resumen en 2 oraciones de lo acordado en esta conversación entre cliente y técnico.
Solicitud original: "${descripcionOriginal}"
Conversación:\n${chatText}
Responde SOLO con el resumen en español.`;
  try { return await callGemini(prompt, 0.4); }
  catch { return "Trabajo completado satisfactoriamente."; }
}

// ── 8. SUGERIR COLABORADORES ─────────────────────────────────────────────
export async function sugerirColaboradores(oficio, ciudad, tecnicos) {
  if (!tecnicos?.length) return { sugeridos:[], razon:"Sin técnicos disponibles" };
  const lista = tecnicos.slice(0,20).map(t => `${t.nombre} - ${t.oficio} - ${t.ciudad}`).join("\n");
  const prompt = `Soy un ${oficio} en ${ciudad}. Sugiere los 3 técnicos más complementarios con los que podría colaborar:
${lista}
Responde SOLO JSON: {"sugeridos":["nombre1","nombre2","nombre3"],"razon":"explicación breve"}`;
  try {
    const raw = await callGemini(prompt, 0.3);
    return JSON.parse(raw.replace(/```json|```/g,"").trim());
  } catch {
    return { sugeridos: tecnicos.slice(0,3).map(t => t.nombre), razon:"Técnicos complementarios" };
  }
}
