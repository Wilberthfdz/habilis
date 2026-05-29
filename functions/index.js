// Habilis — Gemini proxy Cloud Function
// Keeps the API key server-side; the browser only calls this endpoint.
//
// Key setup (one-time):
//   firebase functions:config:set gemini.key="YOUR_KEY"
//   firebase deploy --only functions
//
// Or create functions/.env:
//   GEMINI_API_KEY=YOUR_KEY

const functions = require("firebase-functions");

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL   = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

exports.geminiProxy = functions.https.onCall(async (data, context) => {
  const { prompt, temperature = 0.7 } = data;

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    throw new functions.https.HttpsError("invalid-argument", "El campo 'prompt' es requerido.");
  }

  // Support both firebase functions:config:set and .env / process.env
  const apiKey =
    (functions.config().gemini && functions.config().gemini.key) ||
    process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "PEGA_TU_GEMINI_API_KEY_AQUI") {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Gemini API key no configurada. Ejecuta: firebase functions:config:set gemini.key=TU_KEY"
    );
  }

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature:     Math.min(Math.max(Number(temperature) || 0.7, 0), 1),
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new functions.https.HttpsError(
      "internal",
      `Gemini API error ${res.status}: ${body.slice(0, 200)}`
    );
  }

  const json = await res.json();
  return { text: json.candidates?.[0]?.content?.parts?.[0]?.text ?? "" };
});
