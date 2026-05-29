// ─── GEMINI SERVICE ────────────────────────────────────────────────────────
// Strategy:
//   1. Try Firebase Function proxy (key lives server-side, no CORS risk).
//      Requires Blaze plan + `firebase deploy --only functions`.
//   2. Fall back to direct Gemini REST call using GEMINI_API_KEY from config.js.
//      Works immediately on Spark plan; key is visible in client bundle.

import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase.js";
import { GEMINI_API_KEY, GEMINI_MODEL } from "./config.js";

const fns   = getFunctions(app, "us-central1");
const proxy = httpsCallable(fns, "geminiProxy");

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function callGemini(prompt, temperature = 0.7) {
  // ── Try Function proxy first ─────────────────────────────────────────────
  try {
    const result = await proxy({ prompt, temperature });
    return result.data?.text ?? "";
  } catch (fnErr) {
    // Proxy not available (Blaze required, not yet deployed, etc.) — fall through
    const fnCode = fnErr?.code ?? "";
    const isMissing =
      fnCode.includes("not-found") ||
      fnCode.includes("unavailable") ||
      fnCode.includes("internal") ||
      fnCode.includes("failed-precondition");

    if (!isMissing) throw fnErr; // Real error (bad auth, quota, etc.)
  }

  // ── Fallback: direct REST call ───────────────────────────────────────────
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "PEGA_TU_GEMINI_API_KEY_AQUI") {
    throw new Error("Gemini API key no configurada. Edita src/lib/config.js y reemplaza PEGA_TU_GEMINI_API_KEY_AQUI con tu key real.");
  }

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature, maxOutputTokens: 1024 },
    }),
  });

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
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
