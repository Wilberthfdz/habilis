// ─── HABILIS — CONFIGURACIÓN REAL ─────────────────────────────────────────
// Firebase proyecto: habilis-eb89c
// Wilberth Fernández — wilberthfdz@gmail.com

export const firebaseConfig = {
  apiKey:            "AIzaSyB0HWg3uqpMiAf0lNihsgI-ys-24VZP3J4",
  authDomain:        "habilis-eb89c.firebaseapp.com",
  projectId:         "habilis-eb89c",
  storageBucket:     "habilis-eb89c.firebasestorage.app",
  messagingSenderId: "947440925461",
  appId:             "1:947440925461:web:e19cd4c3b639f438fb471c",
  measurementId:     "G-NXTTH01G1N"
};

// ── GEMINI API ──────────────────────────────────────────────────────────────
// La key vive SOLO server-side, en functions/.env (GEMINI_API_KEY=...).
// El cliente nunca debe tener la key — todas las llamadas pasan por la
// Cloud Function `geminiProxy` (ver src/lib/gemini.js y functions/index.js).
export const GEMINI_MODEL = "gemini-2.0-flash";

// ── PRECIOS ─────────────────────────────────────────────────────────────────
export const PRECIO_PRO_MXN = 100;
