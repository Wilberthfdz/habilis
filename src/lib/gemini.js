// ─── GEMINI SERVICE — El cerebro de IA de Oficio.mx ──────────────────────
// Esto satisface el requisito de la competencia: usar Gemini API en producción

import { GEMINI_API_KEY, GEMINI_MODEL } from "./config.js";

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt, temperature = 0.7) {
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature, maxOutputTokens: 1024 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ── 1. MEJORA DE PERFIL ─────────────────────────────────────────────────
// El técnico escribe como puede — Gemini lo convierte en perfil profesional
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

  return await callGemini(prompt, 0.5);
}

// ── 2. CLASIFICACIÓN DE TRABAJO ─────────────────────────────────────────
// Cuando un técnico documenta un trabajo, Gemini lo categoriza
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
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return { tipo: "Otro", categoria: "Otro", urgencia: "media", palabrasClave: [] };
  }
}

// ── 3. RESPUESTA A CLIENTE ──────────────────────────────────────────────
// Ayuda al técnico a responder solicitudes de forma profesional
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

  return await callGemini(prompt, 0.6);
}

// ── 4. DETECCIÓN DE SPAM ────────────────────────────────────────────────
// Moderación automática de publicaciones
export async function detectarSpam(texto) {
  const prompt = `Analiza si este texto publicado en una plataforma de técnicos es spam o inapropiado.

Texto: "${texto}"

Responde SOLO con JSON:
{
  "esSpam": true|false,
  "razon": "breve explicación o null",
  "confianza": 0.0-1.0
}`;

  try {
    const raw = await callGemini(prompt, 0.1);
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return { esSpam: false, razon: null, confianza: 0 };
  }
}

// ── 5. SUGERENCIA DE TÉCNICOS ───────────────────────────────────────────
// Recomienda técnicos relevantes basado en la solicitud
export async function sugerirTecnicos(solicitud, tecnicos) {
  const listaTexto = tecnicos.map(t =>
    `ID:${t.id} | ${t.nombre} | ${t.oficio} | Especialidades: ${t.especialidades?.join(", ")} | Rating: ${t.rating}`
  ).join("\n");

  const prompt = `Eres un sistema de recomendación. Un cliente necesita: "${solicitud}"

Lista de técnicos disponibles:
${listaTexto}

Selecciona los 3 técnicos más relevantes para esta solicitud.
Responde SOLO con JSON:
{ "recomendados": ["ID1", "ID2", "ID3"], "razon": "breve explicación" }`;

  try {
    const raw = await callGemini(prompt, 0.2);
    const clean = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return { recomendados: tecnicos.slice(0, 3).map(t => t.id), razon: "Top calificados" };
  }
}
