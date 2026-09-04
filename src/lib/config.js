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

// ── APP CHECK ───────────────────────────────────────────────────────────────
// Clave de sitio de reCAPTCHA v3, generada en la consola de Firebase:
// Compilación → App Check → Apps → registrar la app web con reCAPTCHA v3.
// Es pública por diseño (viaja en el navegador, igual que el apiKey); lo que
// protege es el par con el secreto, que se queda en Google.
//
// Vacía = App Check apagado: la app funciona igual y no se envían tokens.
// Al ponerla, el cliente empieza a mandar tokens y en la consola se puede ver
// cuánto tráfico llega verificado ANTES de exigirlo (Métricas → Aplicar).
export const APPCHECK_SITE_KEY = "";

// ── PRECIOS ─────────────────────────────────────────────────────────────────
export const PRECIO_PRO_MXN = 100;

// Versión del clausulado vigente. Al publicar términos nuevos se sube la
// fecha: permite saber qué versión aceptó cada usuario y a quién hay que
// pedirle que vuelva a aceptar.
export const VERSION_TERMINOS = "2026-09-04";
