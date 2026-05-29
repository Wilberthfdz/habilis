// Habilis Cloud Functions
// Gemini proxy — keeps the API key server-side, avoids browser CORS issues.
//
// Setup:
//   1. Set your key:  firebase functions:secrets:set GEMINI_API_KEY
//      (or create functions/.env with GEMINI_API_KEY=AIza...)
//   2. Deploy:        firebase deploy --only functions
//
// The client calls this via Firebase SDK (httpsCallable), which handles
// auth headers and serialization automatically.

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret }       = require("firebase-functions/params");

const geminiKey = defineSecret("GEMINI_API_KEY");

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_URL   = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

exports.geminiProxy = onCall(
  { secrets: [geminiKey], maxInstances: 10, region: "us-central1" },
  async (request) => {
    const { prompt, temperature = 0.7 } = request.data;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      throw new HttpsError("invalid-argument", "El campo 'prompt' es requerido.");
    }

    const apiKey = geminiKey.value();
    if (!apiKey || apiKey === "PEGA_TU_GEMINI_API_KEY_AQUI") {
      throw new HttpsError(
        "failed-precondition",
        "Gemini API key no configurada. Ejecuta: firebase functions:secrets:set GEMINI_API_KEY"
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
      throw new HttpsError("internal", `Gemini API error ${res.status}: ${body.slice(0, 200)}`);
    }

    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return { text };
  }
);
