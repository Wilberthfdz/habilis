// ─── OCULTAR DATOS DEMO DESPUÉS DE GRABAR EL VIDEO ─────────────────────────
// Firestore rules bloquean "delete" en tecnicos/trabajos a propósito
// (allow delete: if false), así que esto NO borra los documentos —
// los oculta de las vistas públicas:
//   - tecnicos: disponible=false → desaparecen de Buscar.jsx (filtra disponible==true)
//   - trabajos: no se pueden ocultar del Feed con datos solamente (Feed.jsx no
//     filtra por esDemo todavía). Si quieres que también desaparezcan del Feed,
//     dile a Claude Code: "agrega filtro esDemo a Feed.jsx" — es un cambio de
//     una línea, no de datos.
//
// Uso: node scripts/unseedDemo.mjs

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { firebaseConfig } from "../src/lib/config.js";

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

const PASSWORD = "HabilisDemo2026!";

const SLUGS_5X = [
  "electricista","plomero","hvac","albanil","tablaroca","mecanico",
  "redes","cctv","pintor","soldador","refrigeracion","herrero",
];

const EMAILS = [
  // Lote 1 (seedDemo.mjs) — 1 por oficio, 9 oficios
  "demo.electricista.cdmx@habilisdemo.mx",
  "demo.plomeria.cancun@habilisdemo.mx",
  "demo.hvac.gdl@habilisdemo.mx",
  "demo.cctv.mty@habilisdemo.mx",
  "demo.herreria.cdmx@habilisdemo.mx",
  "demo.mecanico.gdl@habilisdemo.mx",
  "demo.redes.cancun@habilisdemo.mx",
  "demo.refrigeracion.mty@habilisdemo.mx",
  "demo.pintor.cdmx@habilisdemo.mx",
  // Lote 2 (seedDemo2.mjs) — 5 por oficio, 12 oficios
  ...SLUGS_5X.flatMap(slug => [1, 2, 3, 4, 5].map(n => `demo2.${slug}${n}@habilisdemo.mx`)),
];

async function main() {
  for (const email of EMAILS) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, PASSWORD);
      await updateDoc(doc(db, "tecnicos", cred.user.uid), { disponible: false });
      console.log(`✓ ${email} → oculto de Buscar`);
    } catch (e) {
      console.error(`✗ ${email}:`, e.message);
    }
  }
  console.log("\nListo. Los perfiles demo ya no aparecen en Buscar.");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
